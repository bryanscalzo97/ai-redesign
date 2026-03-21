import type { AppConfig } from "./app.types";

export const appConfig = {
  // Identity
  name: "AI Redesign",
  slug: "ai-redesign",
  bundleId: "com.ai-redesign.app",
  description: "AI-powered room redesign and staging",
  albumName: "AI Redesign",

  // Theme
  theme: {
    brand: {
      primary: { light: "#7c3aed", dark: "#22c55e" }, // violet-600 / green-500
      onPrimary: { light: "#ffffff", dark: "#ffffff" },
      accent: { light: "#7c3aed", dark: "#22c55e" },
      onAccent: { light: "#ffffff", dark: "#ffffff" },
    },
    system: {
      background: "native",
      secondaryBackground: "native",
      text: "native",
      secondaryText: "native",
      separator: "native",
      link: "native",
    },
  },

  // AI Generation
  ai: {
    imageModel: "gemini-3.1-flash-image-preview",
    textModel: "gemini-2.5-flash-image",
  },

  // Feature Flags
  features: {
    payments: false,
    onboarding: true,
  },

  // Internationalization
  i18n: {
    enabled: true,
    defaultLanguage: "device",
    fallbackLanguage: "en",
    supportedLanguages: ["en", "es", "fr", "pt"],
  },

  // Links
  links: {
    privacyPolicy: "https://...",
    termsOfService: "https://...",
    support: "mailto:...",
  },
} as const satisfies AppConfig;
