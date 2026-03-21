import { ActivityIndicator, Image, Pressable, StyleSheet, View } from "react-native";
import { Text } from "./Text";

export default function SignInWithGoogleButton({
  onPress,
  disabled = false,
  isLoading = false,
}: {
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}) {
  return (
    <Pressable
      onPress={() => {
        if (disabled) return;
        onPress();
      }}
      style={({ pressed }) => [
        styles.button,
        pressed && { opacity: 0.8 },
      ]}
    >
      {isLoading ? (
        <ActivityIndicator style={{ height: 44 }} color="#fff" />
      ) : (
        <View style={styles.content}>
          <Image
            source={require("@/assets/images/google-icon.png")}
            style={styles.icon}
          />
          <Text type="default" weight="semibold" style={{ color: "#fff" }}>
            Continue with Google
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    backgroundColor: "#333",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 18,
    height: 18,
    marginRight: 6,
  },
});
