import { Brand, Colors } from "@/theme/colors";
import { Text } from "@/components/ui/Text";
import { Icon } from "@/components/ui/Icon";
import { useEffect } from "react";
import { Pressable, ScrollView, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import type {
  ChoiceOption,
  MultiChoiceStep,
  SingleChoiceStep,
} from "../onboardingTypes";

const ANIMATION_DURATION = 200;

const TIMING = {
  list: { initialDelay: 200, staggerDelay: 100, fadeDuration: 350 },
  chips: { initialDelay: 66, staggerDelay: 33, fadeDuration: 117 },
} as const;

type SelectableOptionsVariant = "list" | "chips";
type TimingConfig = (typeof TIMING)[SelectableOptionsVariant];

type SingleSelectionProps = {
  step: SingleChoiceStep;
  value?: string;
  onSelect: (value: string) => void;
  dark?: boolean;
};

type MultiSelectionProps = {
  step: MultiChoiceStep;
  values: string[];
  onToggle: (value: string) => void;
  dark?: boolean;
};

type SelectableOptionsBodyProps = SingleSelectionProps | MultiSelectionProps;

function getVariant(step: SingleChoiceStep | MultiChoiceStep): SelectableOptionsVariant {
  return step.kind === "multiChoiceChips" ? "chips" : "list";
}

function SelectableOption({
  option,
  isSelected,
  onPress,
  index,
  variant,
  timing,
  dark,
}: {
  option: ChoiceOption;
  isSelected: boolean;
  onPress: () => void;
  index: number;
  variant: SelectableOptionsVariant;
  timing: TimingConfig;
  dark: boolean;
}) {
  const progress = useSharedValue(isSelected ? 1 : 0);
  const isChip = variant === "chips";

  useEffect(() => {
    progress.value = withTiming(isSelected ? 1 : 0, { duration: ANIMATION_DURATION });
  }, [isSelected, progress]);

  // Light mode styles for list cards
  const animatedCardStyle = useAnimatedStyle(() => {
    if (dark) {
      return {
        borderColor: interpolateColor(progress.value, [0, 1], ["rgba(255,255,255,0.15)", Brand.purple]),
        backgroundColor: interpolateColor(progress.value, [0, 1], ["transparent", "rgba(64,32,96,0.1)"]),
      };
    }
    if (isChip) {
      return {
        borderColor: interpolateColor(progress.value, [0, 1], ["rgba(0,0,0,0.15)", "#1a1a1a"]),
        backgroundColor: interpolateColor(progress.value, [0, 1], ["transparent", "rgba(0,0,0,0.04)"]),
      };
    }
    return {
      borderColor: interpolateColor(progress.value, [0, 1], ["rgba(0,0,0,0.12)", Brand.purple]),
      backgroundColor: interpolateColor(progress.value, [0, 1], ["#fff", "rgba(64,32,96,0.04)"]),
    };
  });

  const selectedIconOpacity = useAnimatedStyle(() => ({
    opacity: progress.value,
    position: "absolute" as const,
  }));

  const unselectedIconOpacity = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
  }));

  const enteringDelay = timing.initialDelay + index * timing.staggerDelay;
  const selectedTextColor = dark ? "white" : "#1a1a1a";
  const unselectedTextColor = dark ? "rgba(255,255,255,0.6)" : "#757575";
  const textColor = isSelected ? selectedTextColor : unselectedTextColor;

  return (
    <Animated.View
      entering={FadeIn.duration(timing.fadeDuration).delay(enteringDelay)}
      exiting={FadeOut.duration(16)}
    >
      <Pressable onPress={onPress}>
        <Animated.View
          style={[
            {
              flexDirection: "row",
              alignItems: "center",
              gap: isChip ? 6 : 10,
              paddingHorizontal: isChip ? 14 : 14,
              paddingVertical: isChip ? 10 : 12,
              borderWidth: 1,
              borderRadius: 100,
            },
            animatedCardStyle,
          ]}
        >
          {/* Checkbox for list variant */}
          {!isChip && (
            <View style={{ width: 22, height: 22 }}>
              <Animated.View style={unselectedIconOpacity}>
                <Icon symbol="circle" size={22} color={dark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.15)"} />
              </Animated.View>
              <Animated.View style={selectedIconOpacity}>
                <Icon symbol="checkmark.circle.fill" size={22} color={Brand.purple} />
              </Animated.View>
            </View>
          )}

          {/* Checkmark for selected chips */}
          {isChip && isSelected && (
            <Icon symbol="checkmark" size={12} color={selectedTextColor} />
          )}

          <Text
            type={isChip ? "sm" : "base"}
            weight={isSelected ? "semibold" : "normal"}
            style={isChip ? { color: textColor } : { flex: 1, color: textColor }}
          >
            {option.label}
          </Text>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

function isSingleSelection(props: SelectableOptionsBodyProps): props is SingleSelectionProps {
  return props.step.kind === "singleChoice";
}

export function SelectableOptionsBody(props: SelectableOptionsBodyProps) {
  const { step } = props;
  const dark = props.dark ?? false;
  const variant = getVariant(step);
  const timing = TIMING[variant];

  const selectedValues: string[] = isSingleSelection(props)
    ? props.value ? [props.value] : []
    : props.values;

  const handleOptionPress = (value: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (isSingleSelection(props)) {
      props.onSelect(value);
    } else {
      props.onToggle(value);
    }
  };

  return (
    <ScrollView
      style={{ flexGrow: 1, flexShrink: 1, marginTop: 20 }}
      contentContainerStyle={
        variant === "chips"
          ? {
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 10,
              paddingHorizontal: 24,
              paddingBottom: 8,
            }
          : {
              gap: 10,
              paddingHorizontal: 24,
              paddingBottom: 8,
            }
      }
      showsVerticalScrollIndicator={false}
    >
      {step.options.map((option, index) => (
        <SelectableOption
          key={option.id}
          option={option}
          isSelected={selectedValues.includes(option.value)}
          onPress={() => handleOptionPress(option.value)}
          index={index}
          variant={variant}
          timing={timing}
          dark={dark}
        />
      ))}
    </ScrollView>
  );
}
