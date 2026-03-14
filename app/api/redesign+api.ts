import { constants } from "@/server-utils/constants";
import {
  buildRedesignPrompt,
  createGeminiErrorResponse,
  fetchGeminiWithRetry,
  toGeminiImageParts,
} from "@/server-utils/generation-utils";
import { slog } from "@/server-utils/log";
import { z } from "zod";

const RedesignRequestSchema = z.object({
  image_base64: z.string().min(1, "Image is required"),
  roomType: z.string().min(1, "Room type is required"),
  style: z.string().min(1, "Style is required"),
  customPrompt: z.string().optional(),
  guestType: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = RedesignRequestSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        {
          success: false,
          error: parsed.error.issues.map((i) => i.message).join(", "),
        },
        { status: 400 }
      );
    }

    const { image_base64, roomType, style, customPrompt, guestType } = parsed.data;

    const imageSizeKB = Math.round(image_base64.length * 0.75 / 1024);
    slog("redesign+api", "Redesign request received", { roomType, style, guestType, imageSizeKB });

    // Build the prompt
    const prompt = buildRedesignPrompt(roomType, style, customPrompt, guestType);
    slog("redesign+api", "Prompt built", { prompt });

    // Convert image to Gemini format
    const imageParts = toGeminiImageParts([image_base64]);

    // Build Gemini request body
    const geminiBody = {
      contents: [
        {
          parts: [{ text: prompt }, ...imageParts],
        },
      ],
      generationConfig: {
        responseModalities: ["IMAGE", "TEXT"],
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: "1K",
        },
      },
    };

    const url = constants.GEMINI_IMAGE_BASE_URL;

    const result = await fetchGeminiWithRetry(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(geminiBody),
    });

    if (!result.success) {
      slog("redesign+api", "Generation failed", {
        status: result.error.status,
        message: result.error.message,
      });
      return createGeminiErrorResponse(result.error);
    }

    slog("redesign+api", "Generation successful");

    return Response.json({ success: true, imageData: result.imageData });
  } catch (error) {
    slog("redesign+api", "Unexpected error", {
      error: error instanceof Error ? error.message : String(error),
    });
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
