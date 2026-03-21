import LinearGradientImageBlur from "@/components/LinearGradientImageBlur";
import { Brand } from "@/theme/colors";
import { Text } from "@/components/ui/Text";
import { Icon } from "@/components/ui/Icon";
import { AuthContext } from "@/context/AuthContext";
import * as Haptics from "expo-haptics";
import { StatusBar } from "expo-status-bar";
import { use, useCallback, useRef, useState } from "react";
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CircleProgress } from "./CircleProgress";
import { HostlyLogo } from "./HostlyLogo";
import { OnboardingCTA } from "./OnboardingCTA";
import {
  getNextStepIndex,
  isDarkStep,
  isStepComplete,
  ONBOARDING_STEPS,
} from "./onboardingSteps";
import type { MultiChoiceStep, OnboardingAnswers } from "./onboardingTypes";
import { CongratulationsStepBody } from "./steps/CongratulationsStepBody";
import { ReviewsStepBody } from "./steps/ReviewsStepBody";
import { SelectableOptionsBody } from "./steps/SelectableOptionsBody";
import { TextStepBody } from "./steps/TextStepBody";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function OnboardingV2() {
  const { setIsOnboarded } = use(AuthContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const currentIndexRef = useRef(currentIndex);
  currentIndexRef.current = currentIndex;

  const { top } = useSafeAreaInsets();
  const [answers, setAnswersState] = useState<OnboardingAnswers>({});
  const currentStep = ONBOARDING_STEPS[currentIndex] ?? ONBOARDING_STEPS[0];
  const canAdvance = isStepComplete(currentStep, answers);
  const ctaLabel = currentStep.cta ?? "Continue";
  const canGoBack = currentIndex > 0 && currentStep.kind !== "reviews";
  const isHero = currentStep.kind === "hero";
  const isFeature = currentStep.kind === "feature";
  const dark = isDarkStep(currentStep.id);
  const showHeader = !isHero;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    if (index !== currentIndexRef.current && index >= 0 && index < ONBOARDING_STEPS.length) {
      setCurrentIndex(index);
    }
  };

  const goTo = useCallback((index: number) => {
    scrollViewRef.current?.scrollTo({ x: index * SCREEN_WIDTH, animated: true });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const setAnswer = useCallback((stepId: string, value: string | string[]) => {
    setAnswersState((prev) => ({ ...prev, [stepId]: value }));
  }, []);

  const toggleMultiChoice = useCallback((step: MultiChoiceStep, value: string) => {
    setAnswersState((prev) => {
      const existing = Array.isArray(prev[step.id]) ? (prev[step.id] as string[]) : [];
      if (existing.includes(value)) {
        return { ...prev, [step.id]: existing.filter((item) => item !== value) };
      }
      if (step.max && existing.length > step.max) return prev;
      return { ...prev, [step.id]: [...existing, value] };
    });
  }, []);

  const getStringAnswer = (id: string) =>
    typeof answers[id] === "string" ? (answers[id] as string) : undefined;
  const getArrayAnswer = (id: string) =>
    Array.isArray(answers[id]) ? (answers[id] as string[]) : [];

  const advance = useCallback(() => {
    const nextIndex = getNextStepIndex(currentStep, currentIndex);
    if (nextIndex >= ONBOARDING_STEPS.length) {
      setIsOnboarded(true);
    } else {
      goTo(nextIndex);
    }
  }, [currentStep, currentIndex, setIsOnboarded, goTo]);

  const stepBody = (() => {
    switch (currentStep.kind) {
      case "singleChoice":
        return (
          <SelectableOptionsBody
            step={currentStep}
            value={getStringAnswer(currentStep.id)}
            onSelect={(value) => setAnswer(currentStep.id, value)}
            dark={dark}
          />
        );
      case "multiChoice":
      case "multiChoiceChips":
        return (
          <SelectableOptionsBody
            step={currentStep}
            values={getArrayAnswer(currentStep.id)}
            onToggle={(value) => toggleMultiChoice(currentStep, value)}
            dark={dark}
          />
        );
      case "text":
        return (
          <TextStepBody
            step={currentStep}
            value={getStringAnswer(currentStep.id) ?? ""}
            onChange={(text) => setAnswer(currentStep.id, text.trim())}
            onSubmit={advance}
            dark={dark}
          />
        );
      case "congratulations":
        return <CongratulationsStepBody step={currentStep} answers={answers} />;
      case "reviews":
        return (
          <ReviewsStepBody
            step={currentStep}
            answers={answers}
            onReady={() => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              goTo(getNextStepIndex(currentStep, currentIndex));
            }}
          />
        );
      default:
        return null;
    }
  })();

  const title = (() => {
    if (currentStep.kind === "congratulations" && answers["user-name"]) {
      return `Welcome aboard,  ${answers["user-name"]}!`;
    }
    if (currentStep.id === "feature-welcome" && answers["user-name"]) {
      return `Welcome ${answers["user-name"]}`;
    }
    return currentStep?.title;
  })();

  // Colors based on dark/light
  const textColor = dark ? "#fff" : "#1a1a1a";
  const subtitleColor = dark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)";
  const headerIconColor = dark ? "#fff" : "#1a1a1a";

  return (
    <View style={{ flex: 1, backgroundColor: dark ? "#000" : "#fff" }}>
      <StatusBar style={dark ? "light" : "dark"} />

      {/* Background layer */}
      <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          decelerationRate="fast"
          snapToInterval={SCREEN_WIDTH}
          snapToAlignment="center"
          scrollEnabled={false}
          style={{ flex: 1 }}
          onScroll={handleScroll}
        >
          {ONBOARDING_STEPS.map((step, index) => {
            const stepDark = isDarkStep(step.id);
            return (
              <View
                key={index}
                style={{
                  width: SCREEN_WIDTH,
                  height: "100%",
                  backgroundColor: stepDark ? "#000" : "#fff",
                }}
              >
                {step.kind === "hero" && (
                  <LinearGradientImageBlur
                    imageUrl={require("@/assets/images/background/onboarding1.png") as any}
                    showGradient={true}
                    lightGradientColors={[
                      "transparent", "transparent", "#00000040", "#000000BB", "#000000",
                    ]}
                    darkGradientColors={[
                      "transparent", "transparent", "#00000040", "#000000BB", "#000000",
                    ]}
                    gradientLocations={[0, 0.15, 0.35, 0.6, 0.75]}
                  />
                )}
                {step.kind === "feature" && (
                  <LinearGradientImageBlur
                    imageUrl={require("@/assets/images/background/onboarding2.png") as any}
                    showGradient={true}
                    lightGradientColors={["transparent", "transparent", "#000000AA", "#000000EE", "#000000"]}
                    darkGradientColors={["transparent", "transparent", "#000000AA", "#000000EE", "#000000"]}
                    gradientLocations={[0, 0.3, 0.55, 0.75, 1]}
                  />
                )}
                {step.kind === "reviews" && (
                  <LinearGradientImageBlur
                    imageUrl={require("@/assets/images/background/onboarding3.png") as any}
                    showGradient={true}
                    lightGradientColors={["transparent", "#00000040", "#000000CC", "#000000", "#000000"]}
                    darkGradientColors={["transparent", "#00000040", "#000000CC", "#000000", "#000000"]}
                    gradientLocations={[0, 0.2, 0.45, 0.6, 1]}
                  />
                )}
                {step.kind === "congratulations" && (
                  <LinearGradientImageBlur
                    imageUrl={require("@/assets/images/background/onboarding4.png") as any}
                    showGradient={true}
                    lightGradientColors={["transparent", "transparent", "#00000090", "#000000DD", "#000000"]}
                    darkGradientColors={["transparent", "transparent", "#00000090", "#000000DD", "#000000"]}
                    gradientLocations={[0, 0.25, 0.45, 0.6, 1]}
                  />
                )}
              </View>
            );
          })}
        </ScrollView>
      </View>

      {/* Content layer */}
      <View style={{ flex: 1, position: "relative", zIndex: 2 }} pointerEvents="box-none">
        {/* Header */}
        {showHeader && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: top + 8,
              paddingHorizontal: 16,
              height: top + 52,
            }}
          >
            {canGoBack ? (
              <Pressable
                onPress={() => goTo(currentIndex - 1)}
                hitSlop={12}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.05)",
                }}
              >
                <Icon symbol="chevron.left" size="sm" color={headerIconColor} />
              </Pressable>
            ) : (
              <View style={{ width: 40 }} />
            )}

            {currentIndex > 0 && (
              <Animated.View entering={FadeIn} exiting={FadeOut}>
                <CircleProgress
                  progress={currentIndex / (ONBOARDING_STEPS.length - 1)}
                  size={32}
                  strokeWidth={3}
                  dark={dark}
                />
              </Animated.View>
            )}
          </View>
        )}

        {/* Main content */}
        <View
          style={{
            flex: 1,
            justifyContent: isHero || isFeature ? "flex-end" : "flex-start",
          }}
          pointerEvents="box-none"
        >
          {/* HERO */}
          {isHero && (
            <View style={{ flex: 1, justifyContent: "flex-end" }}>
              <View style={{ alignItems: "center", paddingHorizontal: 24, paddingBottom: 0 }}>
                <View style={{ marginBottom: 16 }}>
                  <HostlyLogo width={165} height={36} />
                </View>
                <Text
                  type="lg"
                  weight="medium"
                  style={{ color: "rgba(255,255,255,0.8)", textAlign: "center", lineHeight: 26, paddingHorizontal: 8 }}
                >
                  {currentStep?.description}
                </Text>
              </View>
            </View>
          )}

          {/* FEATURE (Welcome) */}
          {isFeature && (
            <Animated.View
              key={currentIndex}
              entering={FadeIn.duration(300)}
              pointerEvents="none"
              style={{ width: "100%", paddingHorizontal: 24, alignItems: "center" }}
            >
              <Text type="3xl" weight="bold" style={{ textAlign: "center", color: "white", lineHeight: 34 }}>
                {title}
              </Text>
              {currentStep?.description && (
                <Text type="base" style={{ color: "rgba(255,255,255,0.6)", textAlign: "center", marginTop: 8, lineHeight: 22 }}>
                  {currentStep.description}
                </Text>
              )}
            </Animated.View>
          )}

          {/* REGULAR STEPS (light bg) */}
          {!isHero && !isFeature && currentStep.kind !== "reviews" && currentStep.kind !== "congratulations" && (
            <Animated.View
              key={currentIndex}
              entering={FadeIn.duration(300)}
              pointerEvents="none"
              style={{ width: "100%", paddingHorizontal: 24, paddingTop: 12 }}
            >
              <Text type="2xl" weight="bold" style={{ textAlign: "center", color: textColor, lineHeight: 32 }}>
                {title}
              </Text>
              {currentStep?.description && (
                <Text
                  type="sm"
                  style={{ color: subtitleColor, textAlign: "center", marginTop: 6, lineHeight: 20 }}
                >
                  {currentStep.description}
                </Text>
              )}
            </Animated.View>
          )}

          {/* REVIEWS title */}
          {currentStep.kind === "reviews" && (
            <View />
          )}

          {/* CONGRATULATIONS title */}
          {currentStep.kind === "congratulations" && (
            <Animated.View
              key={currentIndex}
              entering={FadeIn.duration(300)}
              pointerEvents="none"
              style={{ width: "100%", paddingHorizontal: 24, paddingTop: 12 }}
            >
              <Text type="2xl" weight="bold" style={{ textAlign: "center", color: "white", lineHeight: 32 }}>
                {title}
              </Text>
              {currentStep?.description && (
                <Text type="sm" style={{ color: "rgba(255,255,255,0.5)", textAlign: "center", marginTop: 6, lineHeight: 20 }}>
                  You're all set to start optimizing your property.
                </Text>
              )}
            </Animated.View>
          )}

          {/* Step body */}
          {stepBody && (
            <View style={{ flex: isHero || isFeature ? 0 : 1 }} pointerEvents="box-none">
              {stepBody}
            </View>
          )}

          {/* CTA */}
          {currentStep.kind !== "reviews" && (
            <OnboardingCTA
              label={ctaLabel}
              canAdvance={canAdvance}
              showSignIn={isHero}
              skipLabel={currentStep.cta2}
              dark={dark}
              onPress={advance}
              onSkip={currentStep.cta2 ? advance : undefined}
            />
          )}
        </View>
      </View>
    </View>
  );
}
