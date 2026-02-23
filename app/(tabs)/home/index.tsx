import { Text } from "@/components/ui/Text";
import { Home } from "@/components/screens/Home";
import { Stack, useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.View hidesSharedBackground>
          <Text type="title" weight="bold" lightColor="black" darkColor="white">
            Home
          </Text>
        </Stack.Toolbar.View>
      </Stack.Toolbar>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          icon="person.fill"
          onPress={() => router.push("/(tabs)/profile")}
        >
          Perfil
        </Stack.Toolbar.Button>
      </Stack.Toolbar>
      <Home />
    </>
  );
}
