import { Colors } from "@/theme/colors";
import { BORDER_RADIUS, BORDER_WIDTH } from "@/theme/dimensions";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ReactNode } from "react";
import { Pressable, StyleSheet, ViewStyle } from "react-native";

type CardVariant = "bordered" | "plain";
type CardColor = "white" | "black";

interface CardProps {
  children?: ReactNode;
  shadow?: "light" | "medium" | "large" | "none";
  variant?: CardVariant;
  color?: CardColor;
  onPress?: () => void;
  style?: ViewStyle;
}

export function Card({
  children,
  shadow = "none",
  variant = "plain",
  color,
  onPress,
  style,
}: CardProps) {
  const colorScheme = useColorScheme();

  // Determine color automatically if not specified
  const effectiveColor = color || (colorScheme === "dark" ? "black" : "white");
  const getThemeStyle = () => {
    const baseTheme =
      effectiveColor === "black" ? styles.themeDark : styles.themeLight;
    const shadowIntensity = getShadowIntensity();
    const borderVariant = variant === "plain" ? styles.noBorder : {};

    return [baseTheme, shadowIntensity, borderVariant];
  };

  const getShadowIntensity = () => {
    switch (shadow) {
      case "light":
        return effectiveColor === "black"
          ? styles.shadowLightDark
          : styles.shadowLightLight;
      case "medium":
        return effectiveColor === "black"
          ? styles.shadowMediumDark
          : styles.shadowMediumLight;
      case "large":
        return effectiveColor === "black"
          ? styles.shadowLargeDark
          : styles.shadowLargeLight;
      default:
        return {};
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        ...getThemeStyle(),
        style,
        { transform: [{ scale: pressed ? 0.99 : 1 }] },
      ]}
      onPress={onPress}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 300,
    borderRadius: BORDER_RADIUS.MD,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  // Two main theme styles
  themeLight: {
    backgroundColor: "white",
    borderWidth: BORDER_WIDTH.THIN,
    borderColor: Colors.grayscale[200] + "90",
  },
  themeDark: {
    backgroundColor: "black",
    borderWidth: BORDER_WIDTH.THIN,
    borderColor: Colors.grayscale[900] + "90",
  },
  // Override for plain variant
  noBorder: {
    borderWidth: 0,
  },
  // Light theme shadows
  shadowLightLight: {
    boxShadow: `0px 9px 4px rgba(0, 0, 0, 0.01), 0px 5px 3px rgba(0, 0, 0, 0.02), 0px 2px 2px rgba(0, 0, 0, 0.04), 0px 1px 1px rgba(0, 0, 0, 0.05);`,
  },
  shadowMediumLight: {
    boxShadow: `0px 16px 7px rgba(0, 0, 0, 0.01), 0px 9px 6px rgba(0, 0, 0, 0.05), 0px 4px 4px rgba(0, 0, 0, 0.09), 0px 1px 2px rgba(0, 0, 0, 0.1)`,
  },
  shadowLargeLight: {
    boxShadow: `0px 40px 16px rgba(0, 0, 0, 0.01), 0px 22px 13px rgba(0, 0, 0, 0.03), 0px 10px 10px rgba(0, 0, 0, 0.07), 0px 2px 5px rgba(0, 0, 0, 0.09)`,
  },
  // Dark theme shadows
  shadowLightDark: {
    boxShadow: `0px 9px 4px rgba(0, 0, 0, 0.08), 0px 5px 3px rgba(0, 0, 0, 0.12), 0px 2px 2px rgba(0, 0, 0, 0.16), 0px 1px 1px rgba(0, 0, 0, 0.18);`,
  },
  shadowMediumDark: {
    boxShadow: `0px 16px 7px rgba(0, 0, 0, 0.10), 0px 9px 6px rgba(0, 0, 0, 0.16), 0px 4px 4px rgba(0, 0, 0, 0.20), 0px 1px 2px rgba(0, 0, 0, 0.22);`,
  },
  shadowLargeDark: {
    boxShadow: `0px 40px 16px rgba(0, 0, 0, 0.12), 0px 22px 13px rgba(0, 0, 0, 0.18), 0px 10px 10px rgba(0, 0, 0, 0.22), 0px 2px 5px rgba(0, 0, 0, 0.24);`,
  },
});
