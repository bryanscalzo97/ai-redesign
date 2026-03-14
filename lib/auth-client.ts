import { expoClient } from "@better-auth/expo/client";
import { createAuthClient } from "better-auth/react";
import * as SecureStore from "expo-secure-store";

const getBaseURL = () => {
  if (!process.env.EXPO_PUBLIC_BASE_URL) {
    throw new Error("EXPO_PUBLIC_BASE_URL is not set");
  }

  return process.env.EXPO_PUBLIC_BASE_URL;
};

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
  disableDefaultFetchPlugins: true,
  plugins: [
    expoClient({
      scheme: "StarterKit",
      storagePrefix: "starterkit",
      storage: SecureStore,
    }),
  ],
  fetchOptions: {
    onRequest: (context) => {
      console.log("🌐 Auth request:", context.url, context.method || "GET");
    },
    onResponse: (context) => {
      console.log(
        "🌐 Auth response:",
        context.response.status,
        context.response.statusText
      );
    },
    onError: (context) => {
      console.log("🌐 Auth error:", context.error);
    },
  },
});
