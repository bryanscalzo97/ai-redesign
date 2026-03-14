import { constants } from "@/server-utils/constants";
import { buildListingTextPrompt } from "@/server-utils/listing-text-utils";
import { slog } from "@/server-utils/log";
import { z } from "zod";

const ListingTextRequestSchema = z.object({
  roomType: z.string().min(1, "Room type is required"),
  style: z.string().min(1, "Style is required"),
  guestType: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = ListingTextRequestSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        {
          success: false,
          error: parsed.error.issues.map((i) => i.message).join(", "),
        },
        { status: 400 }
      );
    }

    const { roomType, style, guestType } = parsed.data;
    slog("listing-text+api", "Listing text request", { roomType, style, guestType });

    const prompt = buildListingTextPrompt(roomType, style, guestType);

    const geminiBody = {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        responseMimeType: "text/plain",
        maxOutputTokens: 1024,
      },
    };

    const url = constants.GEMINI_IMAGE_BASE_URL;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(geminiBody),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data?.error?.message || "Gemini API error";
      slog("listing-text+api", "Gemini error", { status: response.status, errorMsg });
      return Response.json(
        { success: false, error: "Failed to generate listing text. Please try again." },
        { status: 502 }
      );
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      slog("listing-text+api", "No text in response", { data });
      return Response.json(
        { success: false, error: "No text generated. Please try again." },
        { status: 502 }
      );
    }

    slog("listing-text+api", "Listing text generated", { length: text.length });
    return Response.json({ success: true, listingText: text });
  } catch (error) {
    slog("listing-text+api", "Unexpected error", {
      error: error instanceof Error ? error.message : String(error),
    });
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
