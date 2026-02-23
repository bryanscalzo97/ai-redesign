import { NativeTabs } from "expo-router/unstable-native-tabs";
import { Text } from "@/components/ui/Text";
import { View } from "react-native";

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="home">
        <NativeTabs.Trigger.Label>General</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="house.fill" drawable="ic_menu_home" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="about">
        <NativeTabs.Trigger.Label>About</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf="gearshape.fill"
          drawable="ic_menu_manage"
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="search" role="search">
        <NativeTabs.Trigger.Label>Search</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf="magnifyingglass"
          drawable="ic_menu_search"
        />
      </NativeTabs.Trigger>
      <NativeTabs.BottomAccessory>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text type="body" weight="bold" lightColor="black" darkColor="white">
            Make apps happen!
          </Text>
        </View>
      </NativeTabs.BottomAccessory>
    </NativeTabs>
  );
}
