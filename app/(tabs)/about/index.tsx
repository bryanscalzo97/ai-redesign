import { Text } from "@/components/ui/Text";
import { About } from "@/components/screens/about";
import { Stack, useRouter } from "expo-router";

export default function AboutScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.View hidesSharedBackground>
          <Text type="title" weight="bold" lightColor="black" darkColor="white">
            About
          </Text>
        </Stack.Toolbar.View>
      </Stack.Toolbar>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          icon="house.fill"
          onPress={() => router.push("/(tabs)/home")}
        >
          Home
        </Stack.Toolbar.Button>
      </Stack.Toolbar>
      <About />
    </>
  );
}
