import { COMPONENT_HEIGHT, FONT_SIZE, SPACING } from "@/constants/designTokens";
import { useVariantConfig } from "@/hooks/useVariantConfig";
import {
  InputColorConfig,
  RADIUS_VALUES,
  UIColor,
  UIRadius,
  UISize,
} from "@/types/ui";
import React, { forwardRef, useMemo } from "react";
import { TextInput, type TextInputProps } from "react-native";

type InputVariant = "outline" | "soft" | "subtle" | "underline";

export type ThemedInputProps = TextInputProps & {
  size?: UISize;
  variant?: InputVariant;
  color?: UIColor;
  radius?: UIRadius;
};

export const Input = forwardRef<TextInput, ThemedInputProps>(
  (
    {
      style,
      placeholderTextColor,
      size = "md",
      variant = "outline",
      color,
      radius = "default",
      ...rest
    },
    ref
  ) => {
    const variantConfigs = useVariantConfig<InputVariant>(color, {
      supportedVariants: ["outline", "soft", "subtle", "underline"],
      includePlaceholderColor: true,
    });

    const variantConfig = variantConfigs[variant] as InputColorConfig;

    const inputStyles = useMemo(() => {
      // Direct lookups for better performance
      const height = SIZE_TO_HEIGHT[size];
      const fontSize = SIZE_TO_FONT_SIZE[size];

      // Base styles inlined for performance
      const baseStyles = {
        // Inline styles from styles.input for better performance
        paddingHorizontal: SPACING.MD,
        width: "100%",
        // Dynamic size
        height,
        // Variant-specific styles
        backgroundColor: variantConfig.backgroundColor,
        color: variantConfig.textColor,
        borderColor: variantConfig.borderColor,
        fontSize,
      };

      if (variant === "underline") {
        return [
          {
            ...baseStyles,
            borderBottomWidth: variantConfig.borderWidth,
            borderTopWidth: 0,
            borderLeftWidth: 0,
            borderRightWidth: 0,
            borderRadius: SPACING.NONE,
          },
          style,
        ];
      }

      return [
        {
          ...baseStyles,
          borderWidth: variantConfig.borderWidth,
          borderRadius: RADIUS_VALUES[radius],
        },
        style,
      ];
    }, [size, variantConfig, radius, variant, style]);

    return (
      <TextInput
        ref={ref}
        style={inputStyles}
        placeholderTextColor={
          placeholderTextColor || variantConfig.placeholderColor
        }
        {...rest}
      />
    );
  }
);

Input.displayName = "Input";

// Removed styles - now calculated directly for better performance
// const styles = StyleSheet.create({
//   input: { paddingHorizontal: SPACING.MD, width: "100%" }, // inlined
//   size styles: now calculated directly from SIZE_TO_HEIGHT mapping
// });

// Performance-optimized direct mappings (moved outside component)
const SIZE_TO_HEIGHT = {
  xs: COMPONENT_HEIGHT.XS,
  sm: COMPONENT_HEIGHT.SM,
  md: COMPONENT_HEIGHT.MD,
  lg: COMPONENT_HEIGHT.LG,
  xl: COMPONENT_HEIGHT.XL,
  "2xl": COMPONENT_HEIGHT.XXL,
} as const;

const SIZE_TO_FONT_SIZE = {
  xs: FONT_SIZE.XS,
  sm: FONT_SIZE.SM,
  md: FONT_SIZE.MD,
  lg: FONT_SIZE.LG,
  xl: FONT_SIZE.XL,
  "2xl": FONT_SIZE.XXL,
} as const;
