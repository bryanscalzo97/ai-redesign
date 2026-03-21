import { Text } from "@/components/ui/Text";
import { Search } from "@/components/screens/search";
import { Stack, useRouter } from "expo-router";

export default function SearchScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.View hidesSharedBackground>
          <Text type="title" weight="bold" lightColor="black" darkColor="white">
            Search
          </Text>
        </Stack.Toolbar.View>
      </Stack.Toolbar>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          icon="arrow.clockwise"
          onPress={() => router.push("/(tabs)/home")}
        >
          Refresh
        </Stack.Toolbar.Button>
      </Stack.Toolbar>
      <Search />
    </>
  );
}
