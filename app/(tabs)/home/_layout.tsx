import { useLargeHeaderOptions } from "@/hooks/useLargeHeaderOptions";
import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ ...useLargeHeaderOptions() }}>
      <Stack.Screen
        name="index"
        options={{
          title: "",
          headerLargeTitle: false,
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="style-detail"
        options={{
          headerBackButtonDisplayMode: "minimal",
          headerLargeTitle: false,
        }}
      />
    </Stack>
  );
}
