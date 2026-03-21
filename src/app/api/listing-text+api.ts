import https from "node:https";
import { constants } from "@/core/server/constants";
import { buildListingTextPrompt } from "@/core/server/listing-text-utils";
import { extractMimeAndData } from "@/core/server/generation-utils";
import { slog } from "@/core/server/log";
import { z } from "zod";

function httpsPost(
  url: string,
  body: string
): Promise<{ ok: boolean; status: number; data: any }> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const req = https.request(
      {
        hostname: parsed.hostname,
        path: parsed.pathname + parsed.search,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body).toString(),
        },
        timeout: 120_000,
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (chunk: Buffer) => chunks.push(chunk));
        res.on("end", () => {
          const raw = Buffer.concat(chunks).toString("utf-8");
          try {
            const data = JSON.parse(raw);
            resolve({
              ok: res.statusCode! >= 200 && res.statusCode! < 300,
              status: res.statusCode!,
              data,
            });
          } catch {
            reject(new Error("Failed to parse Gemini response"));
          }
        });
        res.on("error", reject);
      }
    );
    req.on("timeout", () =>
      req.destroy(new Error("Request timed out (2 min)"))
    );
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

const ListingTextRequestSchema = z.object({
  roomType: z.string().min(1, "Room type is required"),
  style: z.string().min(1, "Style is required"),
  guestType: z.string().optional(),
  image_base64: z.string().optional(),
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

    const { roomType, style, guestType, image_base64 } = parsed.data;
    slog("listing-text+api", "Listing text request", {
      roomType,
      style,
      guestType,
      hasImage: !!image_base64,
    });

    const prompt = buildListingTextPrompt(roomType, style, guestType, !!image_base64);

    const parts: any[] = [];

    // Include image if provided
    if (image_base64) {
      const { mime_type, data } = extractMimeAndData(image_base64);
      parts.push({ inline_data: { mime_type, data } });
    }

    parts.push({ text: prompt });

    const geminiBody = JSON.stringify({
      contents: [{ parts }],
      generationConfig: {
        responseMimeType: "text/plain",
        maxOutputTokens: 1024,
      },
    });

    const url = constants.GEMINI_TEXT_BASE_URL;
    const response = await httpsPost(url, geminiBody);

    if (!response.ok) {
      const errorMsg = response.data?.error?.message || "Gemini API error";
      slog("listing-text+api", "Gemini error", {
        status: response.status,
        errorMsg,
      });
      return Response.json(
        {
          success: false,
          error: "Failed to generate listing text. Please try again.",
        },
        { status: 502 }
      );
    }

    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      slog("listing-text+api", "No text in response", { data: response.data });
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
