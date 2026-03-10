import { RedesignHistory } from "@/components/screens/RedesignHistory";
import { Text } from "@/components/ui/Text";
import { Stack } from "expo-router";

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
      <RedesignHistory />
    </>
  );
}
