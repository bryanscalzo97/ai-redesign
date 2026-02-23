import { DURATION } from "@/constants/designTokens";
import { AuthContext, AuthProvider } from "@/context/AuthContext";
import { AccentColorProvider, useAccentColor } from "@/hooks/useAccentColor";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useLazyFonts } from "@/hooks/useLazyFonts";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { use, useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

// Fonts are now loaded lazily via useLazyFonts hook
// Only essential fonts loaded initially, others loaded on-demand

SplashScreen.setOptions({
  duration: DURATION.SPLASH,
  fade: true,
});
SplashScreen.preventAutoHideAsync();

function AppContent() {
  const colorScheme = useColorScheme();
  const { fontsLoaded: loaded } = useLazyFonts();
  const { getBackgroundColor } = useAccentColor();
  const [backgroundColor, setBackgroundColor] = useState<string>(() =>
    getBackgroundColor()
  );
  const { isAuthenticated } = use(AuthContext);

  useEffect(() => {
    const newColor = getBackgroundColor();
    setBackgroundColor(newColor);
  }, [getBackgroundColor, colorScheme]);

  const onLayoutRootView = useCallback(async () => {
    if (loaded) {
      await SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: backgroundColor,
      }}
      onLayout={onLayoutRootView}
    >
      <ThemeProvider
        value={{
          ...(colorScheme === "dark" ? DarkTheme : DefaultTheme),
          colors: {
            ...(colorScheme === "dark"
              ? DarkTheme.colors
              : DefaultTheme.colors),
            background: backgroundColor,
            card: backgroundColor,
          },
        }}
      >
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Protected guard={!isAuthenticated}>
            <Stack.Screen
              name="(onboarding)"
              options={{ headerShown: false }}
            />
          </Stack.Protected>
          <Stack.Protected guard={isAuthenticated}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="+not-found" />
          </Stack.Protected>
        </Stack>
        <StatusBar
          style={colorScheme === "dark" ? "light" : "dark"}
          backgroundColor={backgroundColor}
        />
      </ThemeProvider>
    </View>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <AccentColorProvider>
          <AppContent />
        </AccentColorProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
