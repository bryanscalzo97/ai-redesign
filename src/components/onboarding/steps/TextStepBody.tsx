import { Brand } from "@/theme/colors";
import * as Haptics from "expo-haptics";
import { View } from "react-native";
import { Input } from "@/components/ui/Input";
import type { TextStep } from "../onboardingTypes";

type TextStepBodyProps = {
  step: TextStep;
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  dark?: boolean;
};

export function TextStepBody({
  step,
  value,
  onChange,
  onSubmit,
  dark = false,
}: TextStepBodyProps) {
  return (
    <View style={{ paddingTop: 24, width: "100%", paddingHorizontal: 24 }}>
      <Input
        autoFocus
        value={value}
        cursorColor={dark ? "white" : Brand.purple}
        onChangeText={onChange}
        maxLength={40}
        textContentType={step.id === "user-name" ? "name" : "none"}
        placeholder={step.placeholder}
        size="lg"
        variant="outline"
        radius="full"
        color="neutral"
        style={{
          color: dark ? "white" : "#1a1a1a",
          borderColor: dark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.12)",
        }}
        placeholderTextColor={dark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.35)"}
        onSubmitEditing={() => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          onSubmit?.();
        }}
        returnKeyType="go"
        enablesReturnKeyAutomatically={true}
      />
    </View>
  );
}
