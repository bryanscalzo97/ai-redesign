import { useLargeHeaderOptions } from "@/hooks/useLargeHeaderOptions";
import { Stack } from "expo-router";

export default function SearchLayout() {
  return (
    <Stack screenOptions={{ ...useLargeHeaderOptions() }}>
      <Stack.Screen
        name="index"
        options={{
        title: "",
        headerLargeTitle: false,
        headerTransparent: true,
        animation: "simple_push",
      }}
      >
        <Stack.SearchBar
          placeholder="Search stories"
          onChangeText={(e) => console.log(e.nativeEvent.text)}
        />
      </Stack.Screen>
    </Stack>
  );
}
