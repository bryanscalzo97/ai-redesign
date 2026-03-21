import {
  COMPONENT_HEIGHT,
  DURATION,
  FONT_SIZE,
  OPACITY,
  SPACING,
} from "@/constants/designTokens";
import { useVariantConfig } from "@/hooks/useVariantConfig";
import { RADIUS_VALUES, UIColor, UIRadius, UISize } from "@/types/ui";
// Lazy-loaded heavy dependencies - imported only when needed
// import * as Haptics from "expo-haptics"; // -> dynamic import
// import { Image } from "expo-image"; // -> dynamic import
import { SFSymbol } from "expo-symbols";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  Alert,
  Animated,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { Icon } from "./Icon";
import { Text } from "./Text";

import { LazyImage } from "./LazyImage";

// Lazy loading helpers for heavy dependencies
const loadHaptics = () => import("expo-haptics");

type ButtonVariant = "solid" | "outline" | "soft" | "subtle" | "link";

interface ConfirmationAlert {
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
}

interface BaseButtonProps {
  title?: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  selected?: boolean;
  variant?: ButtonVariant;
  color?: UIColor;
  size?: UISize;
  radius?: UIRadius;
  style?: ViewStyle;
  haptic?: boolean;
  hapticStyle?: "light" | "medium" | "heavy";
  confirmationAlert?: ConfirmationAlert;
}

type ButtonPropsWithSymbol = BaseButtonProps & {
  symbol: string;
  image?: never;
};

type ButtonPropsWithImage = BaseButtonProps & {
  image: ImageSourcePropType;
  symbol?: never;
};

type ButtonPropsWithoutIcon = BaseButtonProps & {
  symbol?: never;
  image?: never;
};

type ButtonProps =
  | ButtonPropsWithSymbol
  | ButtonPropsWithImage
  | ButtonPropsWithoutIcon;

export function Button({
  title,
  onPress,
  disabled = false,
  loading = false,
  selected = false,
  variant = "outline",
  color,
  size = "md",
  radius = "md",
  style,
  symbol,
  image,
  haptic = false,
  hapticStyle = "light",
  confirmationAlert,
}: ButtonProps) {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (loading) {
      const spin = () => {
        spinValue.setValue(0);
        Animated.timing(spinValue, {
          toValue: 1,
          duration: DURATION.LOADING,
          useNativeDriver: true,
        }).start(() => spin());
      };
      spin();
    } else {
      spinValue.stopAnimation();
    }
  }, [loading, spinValue]);

  const spinInterpolate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const variantConfigs = useVariantConfig<ButtonVariant>(color, {
    supportedVariants: ["solid", "outline", "soft", "subtle", "link"],
    includePlaceholderColor: false,
  });

  const variantConfig = variantConfigs[variant];

  const isDisabled = disabled || loading;

  // Pre-calculate complete style object to avoid spread operations and lookups
  const buttonStyles = useMemo(() => {
    const height = SIZE_TO_HEIGHT[size];

    const baseStyles: ViewStyle = {
      // Base button styles (inlined for performance)
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: SPACING.XS + 2, // 6px
      width: "100%",
      willChange: "transform",
      transform: [{ perspective: 1 }],
      // Size-specific height
      height,
      // Variant-specific styles
      backgroundColor: variantConfig.backgroundColor,
      borderColor: variantConfig.borderColor,
      borderWidth: variantConfig.borderWidth,
      borderRadius: RADIUS_VALUES[radius],
    };

    return [baseStyles, style];
  }, [size, variantConfig, style, radius]);

  // Pre-calculate text styles with direct font size lookup
  const textStyles = useMemo(() => {
    const fontSize = SIZE_TO_FONT_SIZE[size];

    return [
      { fontWeight: "600" as const }, // inlined from styles.buttonText
      { fontSize },
      { color: variantConfig.textColor },
    ];
  }, [size, variantConfig]);

  const iconColor = variantConfig.textColor;
  const displayIcon = loading ? "arrow.2.circlepath" : symbol;
  const displayImage = loading ? undefined : image;

  const shouldCenterIcon = !title && (displayIcon || displayImage);

  const handlePress = useCallback(async () => {
    if (!isDisabled) {
      // Haptic feedback - lazy loaded
      if (haptic) {
        try {
          const Haptics = await loadHaptics();
          const hapticStyleMap = {
            light: Haptics.ImpactFeedbackStyle.Light,
            medium: Haptics.ImpactFeedbackStyle.Medium,
            heavy: Haptics.ImpactFeedbackStyle.Heavy,
          };
          await Haptics.impactAsync(hapticStyleMap[hapticStyle]);
        } catch (error) {
          // Silently fail if haptics module is not available
          console.warn("Haptics not available:", error);
        }
      }
      if (confirmationAlert) {
        Alert.alert(confirmationAlert.title, confirmationAlert.message, [
          {
            text: confirmationAlert.cancelText || "Cancel",
            style: "cancel",
            onPress: confirmationAlert.onCancel,
          },
          {
            text: confirmationAlert.confirmText || "Confirm",
            style: "default",
            onPress: confirmationAlert.onConfirm || onPress,
          },
        ]);
      } else {
        onPress();
      }
    }
  }, [isDisabled, haptic, hapticStyle, confirmationAlert, onPress]);

  return (
    <Pressable
      style={({ pressed }) => [
        ...buttonStyles,
        shouldCenterIcon ? styles.iconOnly : {},
        isDisabled ? styles.disabled : {},
        pressed && !isDisabled ? styles.pressed : {},
      ]}
      onPress={isDisabled ? undefined : handlePress}
      disabled={isDisabled}
    >
      {displayIcon &&
        (loading ? (
          <Animated.View style={{ transform: [{ rotate: spinInterpolate }] }}>
            <Icon
              symbol={displayIcon as SFSymbol}
              size={size}
              color={iconColor}
            />
          </Animated.View>
        ) : (
          <Icon
            symbol={displayIcon as SFSymbol}
            size={size}
            color={iconColor}
          />
        ))}
      {displayImage && (
        <LazyImage
          source={displayImage}
          style={{
            width: IMAGE_SIZES[size],
            height: IMAGE_SIZES[size],
          }}
          contentFit="contain"
          contentPosition="center"
          strategy="lazy"
          placeholder="color"
          placeholderColor="#f0f0f0"
        />
      )}
      {title && <Text style={textStyles}>{title}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.XS + 2, // 6px
    width: "100%",
    willChange: "transform",
    transform: [{ perspective: 1 }],
  },
  iconOnly: {
    justifyContent: "center",
    gap: SPACING.NONE,
  },
  // Removed individual size and text styles - now calculated directly for better performance
  disabled: { opacity: OPACITY.DISABLED },
  pressed: {
    opacity: OPACITY.PRESSED,
    transform: [{ scale: 0.99 }],
    transitionDuration: "150ms",
    transitionProperty: "opacity, transform",
    transitionTimingFunction: "ease-in-out",
  },
});

// Removed SIZE_STYLES and TEXT_SIZE_STYLES - replaced with direct mappings above for better performance

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

const IMAGE_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
} as const;
