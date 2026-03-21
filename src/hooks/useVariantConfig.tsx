import {
  BORDER_WIDTH,
  COLOR_SHADES,
  OPACITY,
  THEME_SHADES,
} from "@/theme/dimensions";
import { AppTheme } from "@/theme/appTheme";
import { useAccentColor } from "@/hooks/useAccentColor";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ColorConfig, InputColorConfig, UIColor } from "@/types/ui";
import { getColorValue } from "@/utils/colorUtils";
import { useMemo } from "react";

/**
 * Base variant styles that are common across all components
 * Each component can choose which variants to support
 */
export type BaseVariant =
  | "solid"
  | "outline"
  | "soft"
  | "subtle"
  | "link"
  | "underline";

/**
 * Configuration options for the variant generator
 */
interface VariantConfigOptions {
  /** Whether to include placeholder color (for Input components) */
  includePlaceholderColor?: boolean;
  /** Custom variants to support (defaults to all base variants) */
  supportedVariants?: BaseVariant[];
}

/**
 * Generates variant configurations for UI components with color theming
 * Centralizes the logic that was duplicated between Button and Input components
 *
 * @param color - UI color or null for accent color
 * @param options - Configuration options for the generator
 * @returns Object with variant configurations
 */
export function useVariantConfig<T extends BaseVariant>(
  color?: UIColor | null,
  options: VariantConfigOptions = {}
) {
  const colorScheme = useColorScheme();
  const { accentHex } = useAccentColor();
  const {
    includePlaceholderColor = false,
    supportedVariants = [
      "solid",
      "outline",
      "soft",
      "subtle",
      "link",
      "underline",
    ] as BaseVariant[],
  } = options;

  const variantConfigs = useMemo(() => {
    const scheme = (colorScheme ?? "light") as "light" | "dark";
    const isDark = scheme === "dark";

    // Helper function to create variant configuration
    const createVariantConfig = (
      bgColor: string,
      textColor: string,
      borderColor: string,
      placeholderColor?: string
    ) => {
      const baseConfig = {
        solid: {
          backgroundColor: bgColor,
          borderColor: borderColor,
          textColor: textColor,
          borderWidth: BORDER_WIDTH.THIN,
        },
        outline: {
          backgroundColor: "transparent",
          borderColor: borderColor,
          textColor: bgColor,
          borderWidth: BORDER_WIDTH.THIN,
        },
        soft: {
          backgroundColor: `${bgColor}${
            isDark ? OPACITY.BACKGROUND_DARK : OPACITY.BACKGROUND_LIGHT
          }`,
          borderColor: "transparent",
          textColor: bgColor,
          borderWidth: BORDER_WIDTH.NONE,
        },
        subtle: {
          backgroundColor: `${bgColor}${
            isDark ? OPACITY.BACKGROUND_DARK : OPACITY.BACKGROUND_LIGHT
          }`,
          borderColor: borderColor,
          textColor: bgColor,
          borderWidth: BORDER_WIDTH.THIN,
        },
        link: {
          backgroundColor: "transparent",
          borderColor: "transparent",
          textColor: bgColor,
          borderWidth: BORDER_WIDTH.NONE,
        },
        underline: {
          backgroundColor: "transparent",
          borderColor: borderColor,
          textColor: bgColor,
          borderWidth: BORDER_WIDTH.THIN,
        },
      };

      // Add placeholder color if needed (for Input components)
      if (includePlaceholderColor && placeholderColor) {
        return Object.fromEntries(
          Object.entries(baseConfig).map(([variant, config]) => [
            variant,
            { ...config, placeholderColor },
          ])
        );
      }

      return baseConfig;
    };

    // Generate configurations based on color type
    if (color === "black") {
      const bgColor = getColorValue("black", COLOR_SHADES.DARKEST);
      const textColor = getColorValue("white", COLOR_SHADES.LIGHTEST);
      const borderColor = bgColor;
      const placeholderColor = getColorValue(
        "black",
        isDark ? COLOR_SHADES.VERY_DARK : COLOR_SHADES.LIGHT
      );

      return createVariantConfig(
        bgColor,
        textColor,
        borderColor,
        placeholderColor
      );
    }

    if (color === "white") {
      const bgColor = getColorValue("white", COLOR_SHADES.LIGHTEST);
      const textColor = getColorValue("white", COLOR_SHADES.DARKEST);
      const borderColor = bgColor;
      const placeholderColor = getColorValue(
        "white",
        isDark ? COLOR_SHADES.SEMI_DARK : COLOR_SHADES.VERY_LIGHT
      );

      return createVariantConfig(
        bgColor,
        textColor,
        borderColor,
        placeholderColor
      );
    }

    if (color === "neutral") {
      const bgColor = isDark
        ? getColorValue("white", THEME_SHADES.BG.LIGHT)
        : getColorValue("black", THEME_SHADES.BG.DARK);
      const textColor = isDark
        ? getColorValue("white", THEME_SHADES.TEXT.DARK)
        : getColorValue("black", THEME_SHADES.TEXT.LIGHT);
      const borderColor = bgColor;
      const placeholderColor = getColorValue(
        color,
        isDark ? COLOR_SHADES.SEMI_DARK : COLOR_SHADES.SEMI_DARK
      );

      return createVariantConfig(
        bgColor,
        textColor,
        borderColor,
        placeholderColor
      );
    }

    if (color) {
      // Standard color variants
      const bgColor = getColorValue(
        color,
        isDark ? THEME_SHADES.PRIMARY.DARK : THEME_SHADES.PRIMARY.LIGHT
      );
      const textColor = getColorValue(
        color,
        isDark ? THEME_SHADES.TEXT.DARK : THEME_SHADES.TEXT.LIGHT
      );
      const borderColor = bgColor;
      const placeholderColor = getColorValue(
        color,
        isDark ? THEME_SHADES.PLACEHOLDER.DARK : THEME_SHADES.PLACEHOLDER.LIGHT
      );

      return createVariantConfig(
        bgColor,
        textColor,
        borderColor,
        placeholderColor
      );
    }

    // Default: use accent color
    const baseHex = accentHex || AppTheme[scheme].tint;
    const highContrastText = isDark
      ? getColorValue("zinc", COLOR_SHADES.DARKEST)
      : getColorValue("zinc", COLOR_SHADES.LIGHTEST);
    const placeholderColor = `${baseHex}${
      isDark ? OPACITY.PLACEHOLDER_DARK : OPACITY.PLACEHOLDER_LIGHT
    }`;

    return createVariantConfig(
      baseHex,
      highContrastText,
      baseHex,
      placeholderColor
    );
  }, [color, colorScheme, accentHex, includePlaceholderColor]);

  // Filter to only supported variants and ensure proper typing
  const filteredConfigs = useMemo(() => {
    return Object.fromEntries(
      supportedVariants.map((variant) => [
        variant,
        variantConfigs[variant as keyof typeof variantConfigs],
      ])
    ) as Record<T, ColorConfig | InputColorConfig>;
  }, [variantConfigs, supportedVariants]);

  return filteredConfigs;
}
