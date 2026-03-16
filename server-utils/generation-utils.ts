import https from "node:https";
import { slog } from "./log";

// ============================================================================
// Native HTTPS request (bypasses fetch-nodeshim's 5s hardcoded timeout)
// ============================================================================

function httpsPost(
  url: string,
  headers: Record<string, string>,
  body: string
): Promise<{ ok: boolean; status: number; statusText: string; json: () => Promise<any> }> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const req = https.request(
      {
        hostname: parsed.hostname,
        path: parsed.pathname + parsed.search,
        method: "POST",
        headers: { ...headers, "Content-Length": Buffer.byteLength(body).toString() },
        timeout: 600_000, // 10 min
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (chunk: Buffer) => chunks.push(chunk));
        res.on("end", () => {
          const raw = Buffer.concat(chunks).toString("utf-8");
          resolve({
            ok: res.statusCode! >= 200 && res.statusCode! < 300,
            status: res.statusCode!,
            statusText: res.statusMessage || "",
            json: () => Promise.resolve(JSON.parse(raw)),
          });
        });
        res.on("error", reject);
      }
    );
    req.on("timeout", () => req.destroy(new Error("Request timed out (10 min)")));
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

// ============================================================================
// Gemini API Types
// ============================================================================

export type GeminiErrorStatus =
  | "INVALID_ARGUMENT"
  | "FAILED_PRECONDITION"
  | "UNAUTHENTICATED"
  | "PERMISSION_DENIED"
  | "NOT_FOUND"
  | "RESOURCE_EXHAUSTED"
  | "INTERNAL"
  | "UNKNOWN"
  | "UNAVAILABLE"
  | "DEADLINE_EXCEEDED";

export type GeminiFinishReason =
  | "STOP"
  | "SAFETY"
  | "IMAGE_SAFETY"
  | "RECITATION"
  | "OTHER"
  | "MAX_TOKENS"
  | "BLOCKLIST";

export interface GeminiError {
  httpStatus: number;
  status: GeminiErrorStatus;
  message: string;
  reason?: string;
  isRetryable: boolean;
  retryAfterMs?: number;
}

export type GeminiImageResult =
  | { success: true; imageData: string }
  | { success: false; error: GeminiError };

export const GEMINI_USER_ERROR_MESSAGES: Record<string, string> = {
  SAFETY:
    "This request can't be processed due to safety restrictions. Try rephrasing your prompt.",
  IMAGE_SAFETY:
    "This image can't be processed due to safety restrictions. Try using a different image.",
  RESOURCE_EXHAUSTED:
    "The service is currently busy. Please try again in a moment.",
  INVALID_ARGUMENT:
    "We couldn't process this request. Try adjusting your prompt and try again.",
  UNAUTHENTICATED:
    "You're not signed in. Please refresh the page or sign in again.",
  PERMISSION_DENIED:
    "You don't have access to this feature right now. Please try again later.",
  NOT_FOUND:
    "Something is misconfigured on our side. Please contact support if this keeps happening.",
  UNAVAILABLE:
    "The service is temporarily unavailable. Please try again shortly.",
  DEADLINE_EXCEEDED:
    "This request took too long to complete. Please try again.",
  DEFAULT: "Something went wrong. Please try again.",
};

// ============================================================================
// Gemini Response Handling
// ============================================================================

const RETRYABLE_HTTP_CODES = new Set([429, 500, 503, 504]);

const RETRYABLE_ERROR_STATUSES = new Set<GeminiErrorStatus>([
  "RESOURCE_EXHAUSTED",
  "INTERNAL",
  "UNKNOWN",
  "UNAVAILABLE",
  "DEADLINE_EXCEEDED",
]);

function parseGeminiError(
  httpStatus: number,
  data: any,
  attempt: number = 0
): GeminiError {
  const error = data?.error;
  const status: GeminiErrorStatus = error?.status || "UNKNOWN";
  const message = error?.message || "Unknown error occurred";

  const errorInfo = error?.details?.find(
    (d: any) => d["@type"] === "type.googleapis.com/google.rpc.ErrorInfo"
  );
  const reason = errorInfo?.reason;

  const isRetryable =
    RETRYABLE_HTTP_CODES.has(httpStatus) ||
    RETRYABLE_ERROR_STATUSES.has(status);

  const retryAfterMs = isRetryable ? Math.pow(2, attempt) * 1000 : undefined;

  return {
    httpStatus,
    status,
    message,
    reason,
    isRetryable,
    retryAfterMs,
  };
}

export function handleGeminiResponse(
  response: { ok: boolean; status: number },
  data: any,
  attempt: number = 0
): GeminiImageResult {
  if (!response.ok) {
    const error = parseGeminiError(response.status, data, attempt);
    slog("generation-utils", "Gemini API error", {
      httpStatus: error.httpStatus,
      status: error.status,
      message: error.message,
      reason: error.reason,
      isRetryable: error.isRetryable,
      attempt,
    });
    return { success: false, error };
  }

  if (data?.promptFeedback?.blockReason) {
    const blockReason = data.promptFeedback.blockReason;
    slog("generation-utils", "Gemini prompt blocked", {
      blockReason,
      safetyRatings: data.promptFeedback.safetyRatings,
    });
    return {
      success: false,
      error: {
        httpStatus: 200,
        status: "INVALID_ARGUMENT",
        message: `Prompt blocked: ${blockReason}`,
        reason: "SAFETY",
        isRetryable: false,
      },
    };
  }

  const candidates = data?.candidates;
  if (!candidates || candidates.length === 0) {
    slog("generation-utils", "Gemini returned empty candidates", {
      promptFeedback: data?.promptFeedback,
      usageMetadata: data?.usageMetadata,
    });
    return {
      success: false,
      error: {
        httpStatus: 200,
        status: "UNKNOWN",
        message: "No candidates returned from Gemini",
        isRetryable: true,
        retryAfterMs: Math.pow(2, attempt) * 1000,
      },
    };
  }

  const finishReason = candidates[0]?.finishReason as
    | GeminiFinishReason
    | undefined;
  if (finishReason && finishReason !== "STOP") {
    const safetyRatings = candidates[0]?.safetyRatings;
    slog("generation-utils", "Gemini generation stopped", {
      finishReason,
      safetyRatings,
    });

    if (finishReason === "SAFETY") {
      return {
        success: false,
        error: {
          httpStatus: 200,
          status: "INVALID_ARGUMENT",
          message: `Generation stopped: ${finishReason}`,
          reason: "SAFETY",
          isRetryable: false,
        },
      };
    }

    return {
      success: false,
      error: {
        httpStatus: 200,
        status: "UNKNOWN",
        message: `Generation stopped: ${finishReason}`,
        reason: finishReason,
        isRetryable: finishReason === "OTHER",
        retryAfterMs:
          finishReason === "OTHER" ? Math.pow(2, attempt) * 1000 : undefined,
      },
    };
  }

  const parts = candidates[0]?.content?.parts;
  const imagePart = parts?.find((part: any) => part.inlineData);
  const imageData = imagePart?.inlineData?.data;

  if (!imageData) {
    const candidatesLog = candidates.map((c: any, i: number) => ({
      index: i,
      finishReason: c.finishReason,
      hasParts: !!c.content?.parts,
      partsCount: c.content?.parts?.length,
      partTypes: c.content?.parts?.map((p: any) =>
        p.inlineData ? "inlineData" : p.text ? "text" : "unknown"
      ),
    }));
    const textContent = parts
      ?.filter((p: any) => p.text)
      .map((p: any) => p.text)
      .join(" ");
    slog("generation-utils", "No image data in Gemini response", {
      candidatesLog,
      textContent,
      usageMetadata: data?.usageMetadata,
    });
    return {
      success: false,
      error: {
        httpStatus: 200,
        status: "UNKNOWN",
        message: "No image data found in response",
        isRetryable: true,
        retryAfterMs: Math.pow(2, attempt) * 1000,
      },
    };
  }

  slog(
    "generation-utils",
    `Successfully extracted image data (${imageData.length} chars)`
  );

  return { success: true, imageData };
}

// ============================================================================
// Fetch with Retry
// ============================================================================

const DEFAULT_MAX_RETRIES = 2;

export async function fetchGeminiWithRetry(
  url: string,
  options: { method?: string; headers?: Record<string, string>; body?: string },
  maxRetries: number = DEFAULT_MAX_RETRIES
): Promise<GeminiImageResult> {
  let lastError: GeminiError | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      slog("generation-utils", `Gemini API request (attempt ${attempt + 1})`, {
        url: url.replace(/key=[^&]+/, "key=***"),
        attempt,
        maxRetries,
      });

      const response = await httpsPost(
        url,
        options.headers || {},
        options.body || ""
      );

      let data: any;
      try {
        data = await response.json();
      } catch {
        slog("generation-utils", "Failed to parse Gemini response as JSON", {
          status: response.status,
          statusText: response.statusText,
        });
        return {
          success: false,
          error: {
            httpStatus: response.status,
            status: "INTERNAL",
            message: "Failed to parse API response",
            isRetryable: true,
            retryAfterMs: Math.pow(2, attempt) * 1000,
          },
        };
      }

      const result = handleGeminiResponse(response, data, attempt);

      if (result.success) {
        return result;
      }

      if (!result.error.isRetryable) {
        slog("generation-utils", "Non-retryable error, failing fast", {
          status: result.error.status,
          reason: result.error.reason,
        });
        return result;
      }

      lastError = result.error;

      if (attempt < maxRetries) {
        const delayMs =
          result.error.retryAfterMs || Math.pow(2, attempt) * 1000;
        slog("generation-utils", `Retrying after ${delayMs}ms`, {
          attempt: attempt + 1,
          maxRetries,
          status: result.error.status,
        });
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    } catch (networkError) {
      slog("generation-utils", "Network error during Gemini API call", {
        error:
          networkError instanceof Error
            ? networkError.message
            : String(networkError),
        errorName: networkError instanceof Error ? networkError.name : "unknown",
        errorStack: networkError instanceof Error ? networkError.stack?.split("\n").slice(0, 3).join(" | ") : undefined,
        attempt,
      });

      lastError = {
        httpStatus: 0,
        status: "UNAVAILABLE",
        message:
          networkError instanceof Error
            ? networkError.message
            : "Network error",
        isRetryable: true,
        retryAfterMs: Math.pow(2, attempt) * 1000,
      };

      if (attempt < maxRetries) {
        const delayMs = Math.pow(2, attempt) * 1000;
        slog(
          "generation-utils",
          `Retrying after network error in ${delayMs}ms`
        );
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  slog("generation-utils", "All retries exhausted", {
    maxRetries,
    lastError,
  });

  return {
    success: false,
    error: lastError || {
      httpStatus: 0,
      status: "UNKNOWN",
      message: "All retries exhausted",
      isRetryable: false,
    },
  };
}

// ============================================================================
// Error Response Helper
// ============================================================================

export function createGeminiErrorResponse(error: GeminiError): Response {
  const userMessage =
    GEMINI_USER_ERROR_MESSAGES[error.reason || ""] ||
    GEMINI_USER_ERROR_MESSAGES[error.status] ||
    GEMINI_USER_ERROR_MESSAGES.DEFAULT;

  let httpStatus: number;
  switch (error.status) {
    case "INVALID_ARGUMENT":
    case "FAILED_PRECONDITION":
      httpStatus = 400;
      break;
    case "UNAUTHENTICATED":
      httpStatus = 401;
      break;
    case "PERMISSION_DENIED":
      httpStatus = 403;
      break;
    case "NOT_FOUND":
      httpStatus = 404;
      break;
    case "RESOURCE_EXHAUSTED":
      httpStatus = 429;
      break;
    case "UNAVAILABLE":
    case "DEADLINE_EXCEEDED":
      httpStatus = 503;
      break;
    default:
      httpStatus = 500;
  }

  return Response.json(
    {
      success: false,
      error: userMessage,
      errorCode: error.reason || error.status,
      retryable: error.isRetryable,
    },
    { status: httpStatus }
  );
}

// ============================================================================
// Image Processing
// ============================================================================

export function extractMimeAndData(input: string): {
  mime_type: string;
  data: string;
} {
  const trimmed = input.trim();

  if (trimmed.startsWith("data:")) {
    const match = /^data:([^;]+);base64,(.*)$/i.exec(trimmed);
    if (match && match[1] && match[2]) {
      return { mime_type: match[1], data: match[2] };
    }
  }

  if (trimmed.startsWith("iVBORw0KGgo")) {
    return { mime_type: "image/png", data: trimmed };
  }
  if (trimmed.startsWith("/9j/")) {
    return { mime_type: "image/jpeg", data: trimmed };
  }
  if (trimmed.startsWith("UklG")) {
    return { mime_type: "image/webp", data: trimmed };
  }

  return { mime_type: "image/jpeg", data: trimmed };
}

export function toGeminiImageParts(
  images: string[]
): { inline_data: { mime_type: string; data: string } }[] {
  return images.map((img) => {
    const { mime_type, data } = extractMimeAndData(img);
    return { inline_data: { mime_type, data } };
  });
}

// ============================================================================
// Room Redesign Prompt
// ============================================================================

const BUDGET_LEVEL_PROMPT_ADDITIONS: Record<string, string> = {
  "quick-fixes":
    "IMPORTANT: Only make minimal, low-cost changes (under $50). Focus on swapping bedding, adding a few throw pillows, repositioning existing items, and small decor touches like candles or a plant. Keep ALL existing furniture. The changes should be things someone could do in an afternoon with a quick store run.",
  "refresh":
    "Make moderate changes ($50-200 budget). You can swap out textiles (curtains, bedding, towels), add new lighting fixtures, hang artwork, add area rugs, and introduce accent pieces. Keep the main furniture but refresh the accessories and soft furnishings.",
  "makeover":
    "Make significant changes ($200-500 budget). You can replace some furniture pieces (nightstands, chairs, coffee table), add a fresh paint color to an accent wall, introduce new rugs, lighting, and decorative elements. Keep the large/expensive pieces (bed frame, sofa, cabinets) but upgrade the rest.",
  "full-redesign":
    "Go all out with a complete transformation ($500+ budget). Replace furniture, change color schemes, upgrade lighting, add statement pieces, and create a fully cohesive design. The only constraint is keeping the room's architecture and layout.",
};

const GUEST_TYPE_PROMPT_ADDITIONS: Record<string, string> = {
  business:
    "Emphasize a dedicated workspace area with a clean desk, ergonomic chair, good task lighting, and cable management. The space should feel professional and productive.",
  couples:
    "Create a romantic, intimate ambiance with soft warm lighting, plush textures, candles or decorative accents, and a cozy, inviting bed setup. The space should feel like a getaway.",
  families:
    "Prioritize a safe, spacious layout with durable and practical furniture, ample storage, and a welcoming atmosphere suitable for guests of all ages.",
  "digital-nomads":
    "Include a well-lit desk area with comfortable seating for long work sessions, natural light, and a modern aesthetic that inspires focus and creativity.",
};

export function buildRedesignPrompt(
  roomType: string,
  style: string,
  customPrompt?: string,
  guestType?: string,
  budgetLevel?: string
): string {
  let prompt = `Redesign this ${roomType} in a ${style} style, optimized for a short-term rental listing. Keep the exact same room structure, dimensions, windows, and doors. Change the furniture, decorations, colors, textures, and lighting to match the ${style} aesthetic. The result should look like a professional Airbnb listing photo — clean, bright, well-staged, and inviting. Focus on perceived value: the space should look like it justifies a higher nightly rate. Photorealistic quality.`;

  if (budgetLevel && BUDGET_LEVEL_PROMPT_ADDITIONS[budgetLevel]) {
    prompt += ` ${BUDGET_LEVEL_PROMPT_ADDITIONS[budgetLevel]}`;
  }

  if (guestType && GUEST_TYPE_PROMPT_ADDITIONS[guestType]) {
    prompt += ` ${GUEST_TYPE_PROMPT_ADDITIONS[guestType]}`;
  }

  if (customPrompt) {
    prompt += ` Additional instructions: ${customPrompt}`;
  }

  prompt += ` IMPORTANT: Generate only one image. Keep the room layout and architecture identical to the original photo.`;

  return prompt;
}
