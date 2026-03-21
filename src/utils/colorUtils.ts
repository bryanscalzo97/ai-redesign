import { Colors } from "@/constants/Colors";
import { UIColor } from "@/types/ui";

/**
 * Utility function to get color values from the color palette
 * @param color - The UI color name
 * @param shade - The color shade (50-950), defaults to 500
 * @returns The hex color value
 */
export const getColorValue = (color: UIColor, shade: number = 500): string => {
  if (color === "black") {
    // For "black": use grayscale where shade 50 = light gray, shade 950 = pure black
    // But shift the range to avoid pure white for backgrounds
    const adjustedShade = Math.max(100, shade) as keyof typeof Colors.grayscale;
    return (
      Colors.grayscale[adjustedShade] ||
      Colors.grayscale[500]
    );
  }
  if (color === "white") {
    // For "white": shade 50 = pure white, shade 950 = pure black
    return (
      Colors.grayscale[shade as keyof typeof Colors.grayscale] ||
      Colors.grayscale[500]
    );
  }

  const colorObj = Colors[color] as any;
  return colorObj[shade] || colorObj[500] || colorObj.DEFAULT;
};
