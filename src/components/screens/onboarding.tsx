import LinearGradientImageBlur from "@/components/LinearGradientImageBlur";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { SPACING, BORDER_RADIUS } from "@/theme/dimensions";
import { AuthContext } from "@/context/AuthContext";
import { use, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";

const STEPS = [
  {
    title: "Scan your spaces",
    subtitle:
      "Take photos of every room in your property. Our AI analyzes what guests see and scores your listing potential.",
  },
  {
    title: "Get your action plan",
    subtitle:
      "See exactly what to improve, how much it costs, and which changes will get you the most bookings.",
  },
  {
    title: "Track your progress",
    subtitle:
      "Re-scan after improvements to watch your score climb. Manage all your properties from one dashboard.",
  },
];

export function Onboarding() {
  const { setIsOnboarded } = use(AuthContext);
  const [step, setStep] = useState(0);
  const { t } = useTranslation();

  const steps = t("onboarding.steps", { returnObjects: true }) as Array<{ title: string; subtitle: string }>;

  const isLast = step === steps.length - 1;
  const current = steps[step];

  return (
    <View style={styles.container}>
      <LinearGradientImageBlur
        imageUrl={require("@/assets/images/background/starter-kit-9.png")}
        showGradient={true}
        showProgressiveBlur={true}
        gradientLocations={[0, 0.25, 0.5, 0.75, 1]}
      />
      <View style={styles.contentContainer}>
        <View style={styles.content}>
          {/* Step indicators */}
          <View style={styles.dots}>
            {steps.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  i === step && styles.dotActive,
                  i < step && styles.dotDone,
                ]}
              />
            ))}
          </View>

          <Text type="caption" weight="semibold" style={styles.stepLabel}>
            {t("onboarding.stepOf", { current: step + 1, total: steps.length })}
          </Text>

          <Text type="4xl" weight="semibold" style={styles.title}>
            {current.title}
          </Text>
          <Text type="lg" weight="normal" style={styles.subtitle}>
            {current.subtitle}
          </Text>

          {isLast ? (
            <Button
              title={t("onboarding.getStarted")}
              color="neutral"
              variant="solid"
              radius="full"
              size="lg"
              style={{ marginTop: 32 } as any}
              onPress={() => setIsOnboarded(true)}
            />
          ) : (
            <View style={styles.actions}>
              <Button
                title={t("common.next")}
                color="neutral"
                variant="solid"
                radius="full"
                size="lg"
                style={{ flex: 1 } as any}
                onPress={() => setStep(step + 1)}
              />
              <Pressable
                onPress={() => setIsOnboarded(true)}
                style={styles.skipButton}
              >
                <Text type="sm" weight="semibold" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {t("common.skip")}
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  contentContainer: {
    position: "absolute",
    height: "100%",
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
    paddingBottom: 32,
    paddingHorizontal: 16,
  },
  content: {
    width: "100%",
    alignItems: "flex-start",
    position: "relative",
    paddingHorizontal: 16,
  },
  dots: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  dotActive: {
    backgroundColor: "#fff",
    width: 24,
  },
  dotDone: {
    backgroundColor: "rgba(255,255,255,0.6)",
  },
  stepLabel: {
    color: "rgba(255,255,255,0.5)",
    marginBottom: 4,
  },
  title: {
    lineHeight: 36,
    textAlign: "left",
  },
  subtitle: {
    textAlign: "left",
    marginTop: 8,
    lineHeight: 24,
    opacity: 0.5,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginTop: 32,
    width: "100%",
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
