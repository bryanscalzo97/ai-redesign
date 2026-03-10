import { useLargeHeaderOptions } from "@/hooks/useLargeHeaderOptions";
import { Stack } from "expo-router";

export default function RedesignsLayout() {
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
        name="details"
        options={{
          title: "Redesign",
          headerLargeTitle: false,
        }}
      />
    </Stack>
  );
}
