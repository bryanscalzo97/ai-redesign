import * as Haptics from "expo-haptics";
import { useEffect, useMemo, useRef, useState } from "react";
import { Dimensions, FlatList, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { Brand } from "@/theme/colors";
import { Text } from "@/components/ui/Text";
import type { OnboardingAnswers, ReviewsStep } from "../onboardingTypes";
import { ReviewItem, type Review } from "./ReviewItem";

const { width } = Dimensions.get("window");
const DEFAULT_TIMEOUT = 8_000;

type ReviewsStepBodyProps = {
  step: ReviewsStep;
  answers?: OnboardingAnswers;
  onReady?: () => void;
};

const reviews: Review[] = [
  {
    stars: 4,
    title: "Review title",
    review: "Review body",
    createdAt: new Date("2026-02-15"),
    author: "Reviewer name",
  },
  {
    stars: 4,
    title: "Review title",
    review: "Review body",
    createdAt: new Date("2026-01-28"),
    author: "Reviewer name",
  },
  {
    stars: 5,
    title: "Review title",
    review: "Review body",
    createdAt: new Date("2026-03-10"),
    author: "Reviewer name",
  },
];

function generateLoadingTexts(answers: OnboardingAnswers): string[] {
  const userName =
    typeof answers["user-name"] === "string" && answers["user-name"].trim().length > 0
      ? answers["user-name"].trim()
      : undefined;

  const messages: string[] = [];
  messages.push(userName ? `Setting things up for ${userName}...` : "Setting things up for you...");

  const styles = Array.isArray(answers["styles"]) ? answers["styles"] : [];
  if (styles.length > 0) {
    messages.push("Tailoring designs to your style");
  } else {
    messages.push("Personalizing your experience");
  }

  messages.push("Preparing your property dashboard");
  messages.push("Almost ready...");
  return messages.slice(0, 4);
}

export function ReviewsStepBody({
  step,
  answers = {},
  onReady,
}: ReviewsStepBodyProps) {
  const [index, setIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const hasCompletedRef = useRef(false);
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  const loadingTexts = useMemo(() => generateLoadingTexts(answers), [answers]);
  const timeout = step.timeout ?? DEFAULT_TIMEOUT;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasCompletedRef.current) {
        hasCompletedRef.current = true;
        setIsLoading(false);
        onReadyRef.current?.();
      }
    }, timeout);
    return () => clearTimeout(timer);
  }, [timeout]);

  useEffect(() => {
    if (!isLoading) return;
    const transitionDuration = 200;
    const timePerMessage = Math.floor(timeout / loadingTexts.length);
    const showDuration = timePerMessage - transitionDuration;
    const interval = setInterval(() => {
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % loadingTexts.length);
      }, transitionDuration);
    }, showDuration + transitionDuration);
    return () => clearInterval(interval);
  }, [isLoading, loadingTexts.length, timeout]);

  useEffect(() => {
    if (isLoading) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, [index, isLoading]);

  const displayText = loadingTexts[index] ?? "";

  return (
    <View style={{ flex: 1 }}>
      {/* Loading text area */}
      <View style={{ flex: 1, justifyContent: "flex-end", alignItems: "center", paddingBottom: 32 }}>
        {isLoading && (
          <>
            <Animated.View
              key={`title-${index}`}
              entering={FadeIn.duration(300)}
              exiting={FadeOut.duration(200)}
            >
              <Text
                type="xl"
                weight="semibold"
                style={{
                  textAlign: "center",
                  color: "rgba(255,255,255,0.7)",
                  paddingHorizontal: 32,
                  fontStyle: "italic",
                }}
              >
                {displayText}
              </Text>
            </Animated.View>
            {index > 0 && (
              <Animated.View
                key={`sub-${index}`}
                entering={FadeIn.duration(300).delay(100)}
                exiting={FadeOut.duration(200)}
              >
                <Text
                  type="base"
                  weight="medium"
                  style={{
                    textAlign: "center",
                    color: Brand.purpleLight,
                    paddingHorizontal: 32,
                    marginTop: 8,
                    fontStyle: "italic",
                  }}
                >
                  {loadingTexts[index - 1]}
                </Text>
              </Animated.View>
            )}
          </>
        )}
      </View>

      {/* Review cards */}
      <View style={{ height: 220, marginBottom: 16 }}>
        <FlatList
          data={reviews}
          renderItem={({ item, index: i }) => <ReviewItem review={item} index={i} />}
          style={{ width, alignSelf: "center" }}
          keyExtractor={(_, i) => `review-${i}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          snapToInterval={292}
          decelerationRate="fast"
        />
      </View>
    </View>
  );
}
