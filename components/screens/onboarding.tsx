import LinearGradientImageBlur from "@/components/LinearGradientImageBlur";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

export function Onboarding() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <LinearGradientImageBlur
        imageUrl={require("@/assets/images/background/starter-kit-9.png")}
        showGradient={true}
        showProgressiveBlur={true}
        gradientLocations={[0, 0.25, 0.5, 0.75, 1]}
      />
      <View style={styles.contentContainer}>
        <View style={styles.content}>
          <Text type="4xl" weight="semibold" style={styles.title}>
            Build your app faster than ever
          </Text>
          <Text type="lg" weight="normal" style={styles.subtitle}>
            Start with a ready-to-use, modern foundation that you can make your
            own.
          </Text>
          <Button
            title="Get started"
            color="neutral"
            variant="solid"
            radius="full"
            size="lg"
            style={{ marginTop: 44 } as any}
            onPress={() => {
              router.push("/(onboarding)/auth");
            }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  contentContainer: {
    position: "absolute",
    height: "100%",
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
    paddingBottom: 32,
    paddingHorizontal: 16,
  },
  title: {
    lineHeight: 36,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    marginTop: 8,
    lineHeight: 24,
    opacity: 0.5,
  },
  content: {
    width: "100%",
    alignItems: "flex-start",
    position: "relative",
    paddingHorizontal: 16,
  },
});
