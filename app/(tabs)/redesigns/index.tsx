import { Text } from "@/components/ui/Text";
import { Stack } from "expo-router";
import { View } from "react-native";

export default function RedesignsScreen() {
  return (
    <>
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.View hidesSharedBackground>
          <Text type="title" weight="bold" lightColor="black" darkColor="white">
            Rediseños
          </Text>
        </Stack.Toolbar.View>
      </Stack.Toolbar>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text type="body" weight="normal" lightColor="black" darkColor="white">
          Your redesigns will appear here.
        </Text>
      </View>
    </>
  );
}
