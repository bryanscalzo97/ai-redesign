import { Brand } from "@/theme/colors";
import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface CircleProgressProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  dark?: boolean;
}

export function CircleProgress({
  progress,
  size = 32,
  strokeWidth = 3,
  dark = true,
}: CircleProgressProps) {
  const animatedProgress = useSharedValue(progress);

  useEffect(() => {
    animatedProgress.value = withTiming(progress, { duration: 400 });
  }, [progress, animatedProgress]);

  const animatedStyle = useAnimatedStyle(() => {
    const degrees = animatedProgress.value * 360;
    return {
      transform: [{ rotate: `${degrees}deg` }],
    };
  });

  const halfSize = size / 2;
  const trackColor = dark ? "rgba(255,255,255,0.15)" : "rgba(60,20,120,0.15)";
  const progressColor = dark ? "white" : Brand.purple;

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: halfSize,
        borderWidth: strokeWidth,
        borderColor: trackColor,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Animated.View
        style={[
          {
            position: "absolute",
            top: -strokeWidth,
            left: -strokeWidth,
            width: size,
            height: size,
            borderRadius: halfSize,
            borderWidth: strokeWidth,
            borderColor: progressColor,
            borderLeftColor: "transparent",
            borderBottomColor: "transparent",
          },
          animatedStyle,
        ]}
      />
    </View>
  );
}
