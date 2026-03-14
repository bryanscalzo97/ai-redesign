import { Text } from "@/components/ui/Text";
import { Home } from "@/components/screens/Home";
import { Stack } from "expo-router";

export default function HomeScreen() {
  return (
    <>
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.View hidesSharedBackground>
          <Text type="title" weight="bold" lightColor="black" darkColor="white">
            Home
          </Text>
        </Stack.Toolbar.View>
      </Stack.Toolbar>
      <Home />
    </>
  );
}
