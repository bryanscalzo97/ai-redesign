import { AppTheme } from "@/theme/appTheme";
import { useColorScheme } from "@/hooks/useColorScheme";
import { UIColor } from "@/types/ui";
import { getColorValue } from "@/utils/colorUtils";
import React, { createContext, useContext, useMemo, useState } from "react";

interface AccentColorContextValue {
  accentHex: string;
  setAccentHex: (hex: string | null) => void;
  getBackgroundColor: () => string;
}

const AccentColorContext = createContext<AccentColorContextValue | undefined>(
  undefined
);

export function AccentColorProvider({
  children,
  initialHex = null,
}: {
  children: React.ReactNode;
  initialHex?: string | null;
}) {
  const colorScheme = useColorScheme();
  const [selectedHex, setSelectedHex] = useState<string | null>(initialHex);

  const accentHex = useMemo(() => {
    const scheme = (colorScheme ?? "light") as "light" | "dark";
    return selectedHex ?? AppTheme[scheme].tint;
  }, [selectedHex, colorScheme]);

  // Pre-calculate color families to avoid creating this array on every calculation
  const COLOR_FAMILIES: UIColor[] = useMemo(
    () => [
      "slate",
      "gray",
      "zinc",
      "neutral",
      "stone",
      "red",
      "orange",
      "amber",
      "yellow",
      "lime",
      "green",
      "emerald",
      "teal",
      "cyan",
      "sky",
      "blue",
      "indigo",
      "violet",
      "purple",
      "fuchsia",
      "pink",
      "rose",
    ],
    []
  );

  // Pre-calculate the background color instead of returning a function
  const backgroundColor = useMemo(() => {
    const scheme = (colorScheme ?? "light") as "light" | "dark";

    if (!selectedHex) {
      return AppTheme[scheme].background;
    }

    const isDark = scheme === "dark";
    const targetShade = isDark ? 950 : 50;
    const sourceShade = isDark ? 400 : 500;

    // Find matching color family and return background color
    for (const family of COLOR_FAMILIES) {
      if (selectedHex === getColorValue(family, sourceShade)) {
        return getColorValue(family, targetShade);
      }
    }

    return AppTheme[scheme].background;
  }, [selectedHex, colorScheme, COLOR_FAMILIES]);

  // Return a stable function that returns the pre-calculated value
  const getBackgroundColor = useMemo(() => {
    return () => backgroundColor;
  }, [backgroundColor]);

  const value = useMemo(
    () => ({ accentHex, setAccentHex: setSelectedHex, getBackgroundColor }),
    [accentHex, getBackgroundColor]
  );

  return (
    <AccentColorContext.Provider value={value}>
      {children}
    </AccentColorContext.Provider>
  );
}

export function useAccentColor() {
  const ctx = useContext(AccentColorContext);
  if (!ctx) {
    throw new Error(
      "useAccentColor must be used within an AccentColorProvider"
    );
  }
  return ctx;
}
