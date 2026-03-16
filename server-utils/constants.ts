export const GEMINI_MODEL = "gemini-3.1-flash-image-preview";
export const GEMINI_TEXT_MODEL = "gemini-2.5-flash-image";

export const constants = {
  GEMINI_IMAGE_BASE_URL: `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY || ""}`,
  GEMINI_TEXT_BASE_URL: `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_TEXT_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY || ""}`,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
};
