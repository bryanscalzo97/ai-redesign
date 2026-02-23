import { Text } from "@/components/ui/Text";
import { Home } from "@/components/screens/home";
import { Stack, useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.View hidesSharedBackground>
          <Text type="title" weight="bold" lightColor="black" darkColor="white">
            Starter Kit
          </Text>
        </Stack.Toolbar.View>
      </Stack.Toolbar>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          icon="gearshape"
          onPress={() => router.push("/(tabs)/about")}
        >
          Settings
        </Stack.Toolbar.Button>
      </Stack.Toolbar>
      <Home />
    </>
  );
}
