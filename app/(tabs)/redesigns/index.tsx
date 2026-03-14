import { ProjectList } from "@/components/screens/ProjectList";
import { Text } from "@/components/ui/Text";
import { Stack } from "expo-router";

export default function RedesignsScreen() {
  return (
    <>
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.View hidesSharedBackground>
          <Text type="title" weight="bold" lightColor="black" darkColor="white">
            Properties
          </Text>
        </Stack.Toolbar.View>
      </Stack.Toolbar>
      <ProjectList />
    </>
  );
}
