import { Button } from "@/components/ui/Button";
import { Brand } from "@/theme/colors";
import { Text } from "@/components/ui/Text";
import { useEffect } from "react";
import { Pressable } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface OnboardingCTAProps {
  label: string;
  canAdvance: boolean;
  showSignIn: boolean;
  dark: boolean;
  skipLabel?: string;
  loading?: boolean;
  onPress: () => void;
  onSkip?: () => void;
}

export function OnboardingCTA({
  label,
  canAdvance,
  showSignIn,
  dark,
  skipLabel,
  loading = false,
  onPress,
  onSkip,
}: OnboardingCTAProps) {
  const { bottom } = useSafeAreaInsets();
  const signInVisible = useSharedValue(showSignIn ? 1 : 0);

  useEffect(() => {
    signInVisible.value = withTiming(showSignIn ? 1 : 0, {
      duration: 350,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [showSignIn, signInVisible]);

  const signInAnimatedStyle = useAnimatedStyle(() => ({
    opacity: signInVisible.value,
    height: signInVisible.value * 44,
    overflow: "hidden" as const,
  }));

  const isDisabled = !canAdvance || loading;

  return (
    <Animated.View
      entering={FadeIn}
      style={{
        marginTop: 8,
        gap: 12,
        width: "100%",
        paddingBottom: Math.max(bottom, 4),
        paddingHorizontal: 10,
      }}
      pointerEvents="auto"
    >
      <Button
        title={loading ? "" : label}
        onPress={onPress}
        loading={loading}
        disabled={isDisabled}
        variant="solid"
        color="violet"
        radius="full"
        size="lg"
        haptic
        hapticStyle="light"
        style={{ backgroundColor: Brand.purple, borderWidth: 0 }}
      />

      {/* Skip for now */}
      {skipLabel && onSkip && (
        <Pressable
          onPress={onSkip}
          style={{ alignItems: "center", paddingVertical: 4 }}
        >
          <Text
            type="sm"
            weight="semibold"
            style={{
              color: dark ? "rgba(255,255,255,0.5)" : "#1a1a1a",
              textDecorationLine: dark ? "none" : "underline",
            }}
          >
            {skipLabel}
          </Text>
        </Pressable>
      )}

      {/* Already have an account? Sign In */}
      <Animated.View
        style={[
          { alignItems: "center", width: "100%" },
          signInAnimatedStyle,
        ]}
        pointerEvents={showSignIn ? "auto" : "none"}
      >
        <Text
          type="sm"
          style={{
            textAlign: "center",
            lineHeight: 20,
            color: dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
          }}
        >
          Already have an account?{" "}
          <Text
            type="sm"
            weight="bold"
            style={{ color: dark ? "#fff" : "#1a1a1a", textDecorationLine: "underline" }}
          >
            Sign In
          </Text>
        </Text>
      </Animated.View>
    </Animated.View>
  );
}
