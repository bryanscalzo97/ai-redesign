import { Text } from "@/components/ui/Text";
import { Stack, useRouter } from "expo-router";
import { View } from "react-native";

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.View hidesSharedBackground>
          <Text type="title" weight="bold" lightColor="black" darkColor="white">
            Perfil
          </Text>
        </Stack.Toolbar.View>
      </Stack.Toolbar>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          icon="creditcard"
          onPress={() => router.push("/(paywall)")}
        >
          Paywall
        </Stack.Toolbar.Button>
      </Stack.Toolbar>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text type="body" weight="normal" lightColor="black" darkColor="white">
          Profile placeholder.
        </Text>
      </View>
    </>
  );
}
