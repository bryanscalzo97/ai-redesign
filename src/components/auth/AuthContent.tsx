import { authClient } from "@/lib/auth-client";
import SignInWithGoogleButton from "@/components/ui/SignInWithGoogleButton";
import { Text } from "@/components/ui/Text";
import { useState } from "react";
import { View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface AuthContentProps {
  title?: string;
  description?: string;
  onSuccess: () => void;
  style?: ViewStyle;
}

export function AuthContent({
  title = "Welcome back!",
  description = "Please choose your preferred sign in method",
  onSuccess,
  style,
}: AuthContentProps) {
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <View
      style={[
        {
          flex: 1,
          gap: 16,
          paddingHorizontal: 16,
          paddingBottom: insets.bottom,
          paddingTop: insets.top,
        },
        style,
      ]}
    >
      <View
        style={{
          flex: 1,
          gap: 8,
        }}
      >
        <Text type="3xl" weight="bold">
          {title}
        </Text>
        <Text type="default">{description}</Text>
      </View>

      <SignInWithGoogleButton
        isLoading={isLoading}
        onPress={async () => {
          try {
            setIsLoading(true);
            await authClient.signIn.social({
              provider: "google",
              callbackURL: "/(tabs)",
            });
            onSuccess();
          } catch (error) {
            console.error("Google sign-in error:", error);
          } finally {
            setIsLoading(false);
          }
        }}
        disabled={isLoading}
      />
    </View>
  );
}
