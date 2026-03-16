import https from "node:https";
import { constants } from "@/server-utils/constants";
import { extractMimeAndData } from "@/server-utils/generation-utils";
import { buildRoomAnalysisPrompt } from "@/server-utils/room-analysis-utils";
import { slog } from "@/server-utils/log";
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
    req.on("timeout", () => req.destroy(new Error("Request timed out (2 min)")));
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

const RoomAnalysisRequestSchema = z.object({
  image_base64: z.string().min(1, "Image is required"),
  roomType: z.string().min(1, "Room type is required"),
  style: z.string().min(1, "Style is required"),
  guestType: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = RoomAnalysisRequestSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        {
          success: false,
          error: parsed.error.issues.map((i) => i.message).join(", "),
        },
        { status: 400 }
      );
    }

    const { image_base64, roomType, style, guestType } = parsed.data;
    slog("room-analysis+api", "Room analysis request", { roomType, style, guestType });

    const prompt = buildRoomAnalysisPrompt(roomType, style, guestType);
    const { mime_type, data } = extractMimeAndData(image_base64);

    const geminiBody = JSON.stringify({
      contents: [
        {
          parts: [
            { inline_data: { mime_type, data } },
            { text: prompt },
          ],
        },
      ],
      generationConfig: {
        maxOutputTokens: 1024,
      },
    });

    const url = constants.GEMINI_TEXT_BASE_URL;
    const response = await httpsPost(url, geminiBody);

    if (!response.ok) {
      const errorMsg = response.data?.error?.message || "Gemini API error";
      slog("room-analysis+api", "Gemini error", { status: response.status, errorMsg });
      return Response.json(
        { success: false, error: "Failed to analyze room. Please try again." },
        { status: 502 }
      );
    }

    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      slog("room-analysis+api", "No text in response", { data: response.data });
      return Response.json(
        { success: false, error: "No analysis generated. Please try again." },
        { status: 502 }
      );
    }

    // Extract JSON from potential markdown code blocks
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    const jsonStr = jsonMatch ? jsonMatch[1].trim() : text.trim();
    const analysis = JSON.parse(jsonStr);
    slog("room-analysis+api", "Room analysis generated", {
      score: analysis.score,
      issueCount: analysis.issues?.length,
      suggestionCount: analysis.suggestions?.length,
    });

    return Response.json({ success: true, analysis });
  } catch (error) {
    slog("room-analysis+api", "Unexpected error", {
      error: error instanceof Error ? error.message : String(error),
    });
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
