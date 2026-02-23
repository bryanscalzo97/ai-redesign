import { Text } from "@/components/ui/Text";
import { useAccentColor } from "@/hooks/useAccentColor";
import { usePlatform } from "@/hooks/usePlatform";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function About() {
  const { getBackgroundColor } = useAccentColor();
  const backgroundColor = getBackgroundColor();
  const { isAndroid } = usePlatform();
  const { top } = useSafeAreaInsets();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="always"
      style={[styles.container, { backgroundColor }]}
    >
      <View
        style={[styles.contentContainer, { paddingTop: isAndroid ? top : 0 }]}
      >
        <View style={[styles.content, { marginTop: isAndroid ? top : 0 }]}>
          <Text
            type="default"
            weight="normal"
            style={{
              opacity: 0.6,
            }}
          >
            Starter Kit is a thoughtfully crafted, highly customizable mobile
            app foundation built with React Native and Expo.
            {"\n"}
            {"\n"}
            Accelerate your development process with a modern architecture, best
            practices, and a beautiful UI out of the box—so you can focus on
            building features that matter.
            {"\n"}
            {"\n"}
            Created with ❤️ by Code with Beto Team.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    position: "relative",
  },
  contentContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    paddingHorizontal: 16,
  },
  content: {
    width: "100%",
    alignItems: "flex-start",
    position: "relative",
  },
});
