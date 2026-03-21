import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

/**
 * Hook that provides reusable large header screen options
 */
export function useLargeHeaderOptions() {
  const colorScheme = useColorScheme();

  return {
    headerTintColor:
      colorScheme === "dark" ? Colors.grayscale[50] : Colors.grayscale[950],
    headerTransparent: true,
    headerLargeStyle: {
      backgroundColor: "transparent",
    },
    headerLargeTitle: true,
    headerShown: true,
  };
}
