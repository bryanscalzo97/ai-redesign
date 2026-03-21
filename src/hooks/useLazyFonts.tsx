import {
  BodoniModa_400Regular,
  BodoniModa_700Bold,
} from "@expo-google-fonts/bodoni-moda";
import {
  Oswald_400Regular,
  Oswald_700Bold,
  useFonts,
} from "@expo-google-fonts/oswald";
import { useMemo, useState } from "react";

// Essential fonts loaded immediately
const ESSENTIAL_FONTS = {
  // Load most common variants + heavy weights for onboarding
  Oswald_400Regular,
  Oswald_700Bold, // Needed for weight="black" in onboarding
  BodoniModa_400Regular,
  BodoniModa_700Bold,
};

// Lazy-loaded fonts mapping
const LAZY_FONT_LOADERS = {
  // Oswald variants
  oswald_light: () =>
    import("@expo-google-fonts/oswald").then((m) => ({
      Oswald_200ExtraLight: m.Oswald_200ExtraLight,
      Oswald_300Light: m.Oswald_300Light,
    })),
  oswald_heavy: () =>
    import("@expo-google-fonts/oswald").then((m) => ({
      Oswald_500Medium: m.Oswald_500Medium,
      Oswald_600SemiBold: m.Oswald_600SemiBold,
      Oswald_700Bold: m.Oswald_700Bold,
    })),

  // Bodoni variants
  bodoni_variants: () =>
    import("@expo-google-fonts/bodoni-moda").then((m) => ({
      BodoniModa_500Medium: m.BodoniModa_500Medium,
      BodoniModa_600SemiBold: m.BodoniModa_600SemiBold,
      BodoniModa_800ExtraBold: m.BodoniModa_800ExtraBold,
      BodoniModa_900Black: m.BodoniModa_900Black,
    })),

  // Bodoni italics
  bodoni_italics: () =>
    import("@expo-google-fonts/bodoni-moda").then((m) => ({
      BodoniModa_400Regular_Italic: m.BodoniModa_400Regular_Italic,
      BodoniModa_500Medium_Italic: m.BodoniModa_500Medium_Italic,
      BodoniModa_600SemiBold_Italic: m.BodoniModa_600SemiBold_Italic,
      BodoniModa_700Bold_Italic: m.BodoniModa_700Bold_Italic,
      BodoniModa_800ExtraBold_Italic: m.BodoniModa_800ExtraBold_Italic,
      BodoniModa_900Black_Italic: m.BodoniModa_900Black_Italic,
    })),
};

export type FontGroup = keyof typeof LAZY_FONT_LOADERS;

interface LazyFontsState {
  loadedGroups: Set<FontGroup>;
  loadingGroups: Set<FontGroup>;
  allFonts: Record<string, any>;
}

export function useLazyFonts() {
  // Load essential fonts immediately
  const [fontsLoaded] = useFonts(ESSENTIAL_FONTS);

  // State for lazy-loaded fonts
  const [lazyState, setLazyState] = useState<LazyFontsState>({
    loadedGroups: new Set(),
    loadingGroups: new Set(),
    allFonts: ESSENTIAL_FONTS,
  });

  // Function to load a specific font group
  const loadFontGroup = useMemo(() => {
    return async (group: FontGroup) => {
      if (
        lazyState.loadedGroups.has(group) ||
        lazyState.loadingGroups.has(group)
      ) {
        return; // Already loaded or loading
      }

      setLazyState((prev) => ({
        ...prev,
        loadingGroups: new Set([...prev.loadingGroups, group]),
      }));

      try {
        const fontLoader = LAZY_FONT_LOADERS[group];
        const fonts = await fontLoader();

        setLazyState((prev) => ({
          loadedGroups: new Set([...prev.loadedGroups, group]),
          loadingGroups: new Set(
            [...prev.loadingGroups].filter((g) => g !== group)
          ),
          allFonts: { ...prev.allFonts, ...fonts },
        }));
      } catch (error) {
        console.warn(`Failed to load font group ${group}:`, error);

        setLazyState((prev) => ({
          ...prev,
          loadingGroups: new Set(
            [...prev.loadingGroups].filter((g) => g !== group)
          ),
        }));
      }
    };
  }, [lazyState]);

  // Check if a specific font is available
  const isFontLoaded = useMemo(() => {
    return (fontName: string) => fontName in lazyState.allFonts;
  }, [lazyState.allFonts]);

  return {
    fontsLoaded: fontsLoaded,
    loadFontGroup,
    isFontLoaded,
    loadedFontGroups: lazyState.loadedGroups,
    loadingFontGroups: lazyState.loadingGroups,
    allLoadedFonts: lazyState.allFonts,
  };
}
