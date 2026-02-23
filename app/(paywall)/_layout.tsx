import { Stack } from "expo-router";

export default function PaywallLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          presentation: "modal",
          headerTransparent: true,
          headerShown: false,
        }}
      />
    </Stack>
  );
}
