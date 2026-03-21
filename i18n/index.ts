import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import en from "./locales/en";
import es from "./locales/es";
import pt from "./locales/pt";
import fr from "./locales/fr";
import it from "./locales/it";

const LANGUAGE_KEY = "@app_language";

const resources = {
  en: { translation: en },
  es: { translation: es },
  pt: { translation: pt },
  fr: { translation: fr },
  it: { translation: it },
};

export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "es", label: "Spanish", nativeLabel: "Español" },
  { code: "pt", label: "Portuguese", nativeLabel: "Português" },
  { code: "fr", label: "French", nativeLabel: "Français" },
  { code: "it", label: "Italian", nativeLabel: "Italiano" },
] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]["code"];

// Detect device language, fallback to "en"
const SUPPORTED_CODES = new Set(SUPPORTED_LANGUAGES.map((l) => l.code));

function getDeviceLanguage(): SupportedLanguage {
  const locale = Localization.getLocales()[0]?.languageCode ?? "en";
  return SUPPORTED_CODES.has(locale as SupportedLanguage)
    ? (locale as SupportedLanguage)
    : "en";
}

i18n.use(initReactI18next).init({
  resources,
  lng: getDeviceLanguage(),
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: "v4",
});

// Load stored language preference (async, updates after init)
AsyncStorage.getItem(LANGUAGE_KEY).then((savedLang) => {
  if (savedLang && SUPPORTED_CODES.has(savedLang as SupportedLanguage)) {
    i18n.changeLanguage(savedLang);
  }
});

export async function setLanguage(lang: SupportedLanguage) {
  await AsyncStorage.setItem(LANGUAGE_KEY, lang);
  await i18n.changeLanguage(lang);
}

export async function getStoredLanguage(): Promise<SupportedLanguage | null> {
  const lang = await AsyncStorage.getItem(LANGUAGE_KEY);
  if (lang && SUPPORTED_CODES.has(lang as SupportedLanguage)) return lang as SupportedLanguage;
  return null;
}

export default i18n;
