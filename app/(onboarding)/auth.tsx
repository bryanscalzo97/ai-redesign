import { AuthContent } from "@/components/auth/AuthContent";
import { Stack } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function OnboardingAuth() {
  const { bottom } = useSafeAreaInsets();

  const handleSuccess = () => {
    // Session is automatically updated by authClient.useSession() in AuthContext
    // The guard in _layout.tsx will unmount the onboarding segment
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <View style={{ flex: 1 }} />
        <AuthContent
          title="Welcome!"
          description="Please sign in to continue."
          onSuccess={handleSuccess}
          style={{ marginBottom: bottom }}
        />
      </View>
    </>
  );
}
