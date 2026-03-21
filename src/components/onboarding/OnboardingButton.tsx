import { Button } from "@/components/ui/Button";

interface OnboardingButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export function OnboardingButton({
  title,
  onPress,
  loading = false,
  disabled = false,
}: OnboardingButtonProps) {
  return (
    <Button
      title={loading ? "" : title}
      onPress={onPress}
      loading={loading}
      disabled={disabled}
      variant="solid"
      color="violet"
      radius="lg"
      size="lg"
      haptic
      hapticStyle="light"
    />
  );
}
