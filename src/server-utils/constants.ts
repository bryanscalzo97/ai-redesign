import { appConfig } from "@/config/app";

export const GEMINI_MODEL = appConfig.ai.imageModel;
export const GEMINI_TEXT_MODEL = appConfig.ai.textModel;

export const constants = {
  GEMINI_IMAGE_BASE_URL: `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY || ""}`,
  GEMINI_TEXT_BASE_URL: `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_TEXT_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY || ""}`,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
};
