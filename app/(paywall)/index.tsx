import { Text } from "@/components/ui/Text";
import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PaywallScreen() {
  const router = useRouter();
  const { top } = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Pressable
        onPress={() => router.back()}
        style={{
          position: "absolute",
          top: top + 8,
          right: 20,
          padding: 12,
          zIndex: 10,
        }}
      >
        <Text type="body" weight="semibold" lightColor="black" darkColor="white">
          Close
        </Text>
      </Pressable>
      <Text type="title" weight="bold" lightColor="black" darkColor="white">
        Paywall
      </Text>
    </View>
  );
}
