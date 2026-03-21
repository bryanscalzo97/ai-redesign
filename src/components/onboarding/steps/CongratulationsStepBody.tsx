import { Brand, Colors } from "@/theme/colors";
import { Icon } from "@/components/ui/Icon";
import { Text } from "@/components/ui/Text";
import { StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import type {
  CongratulationsStep,
  OnboardingAnswers,
} from "../onboardingTypes";

type CongratulationsStepBodyProps = {
  step: CongratulationsStep;
  answers?: OnboardingAnswers;
};

type Feature = {
  icon: string;
  title: string;
  description: string;
};

const FEATURES: Feature[] = [
  {
    icon: "camera.viewfinder",
    title: "Scan your space",
    description: "Use your camera to capture each room of your property.",
  },
  {
    icon: "chart.bar.fill",
    title: "Get your property score",
    description: "Receive AI insights on what's working and what to improve.",
  },
  {
    icon: "arrow.up.right",
    title: "Boost your bookings",
    description: "Follow a personalized action plan to attract more guests.",
  },
];

export function CongratulationsStepBody({
  step,
}: CongratulationsStepBodyProps) {
  return (
    <View style={styles.container}>
      {/* Feature Cards */}
      <View style={styles.featuresContainer}>
        {FEATURES.map((feature, index) => (
          <Animated.View
            key={feature.title}
            entering={FadeInDown.delay(200 + index * 150).duration(500)}
            style={styles.featureCard}
          >
            <View style={styles.iconContainer}>
              <Icon symbol={feature.icon as any} size={20} color={Brand.purpleLight} />
            </View>
            <View style={styles.featureContent}>
              <Text type="base" weight="semibold" style={styles.featureTitle}>
                {feature.title}
              </Text>
              <Text type="sm" style={styles.featureDescription}>
                {feature.description}
              </Text>
            </View>
          </Animated.View>
        ))}
      </View>

      {/* Bottom message */}
      <Animated.View
        entering={FadeInDown.delay(700).duration(500)}
        style={styles.urgencyContainer}
      >
        <Text type="sm" weight="medium" style={styles.urgencyText}>
          {step.description}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
    paddingHorizontal: 16,
    justifyContent: "flex-end",
  },
  featuresContainer: {
    gap: 10,
  },
  featureCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    padding: 16,
    gap: 14,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(64, 32, 96, 0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    color: "white",
  },
  featureDescription: {
    color: "rgba(255,255,255,0.5)",
    marginTop: 2,
    lineHeight: 18,
  },
  urgencyContainer: {
    marginTop: 20,
    alignItems: "center",
    paddingHorizontal: 8,
  },
  urgencyText: {
    color: "rgba(255,255,255,0.5)",
    textAlign: "center",
    lineHeight: 20,
  },
});
