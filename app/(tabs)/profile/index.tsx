import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { AuthContext } from "@/context/AuthContext";
import { authClient } from "@/lib/auth-client";
import { Stack, useRouter } from "expo-router";
import { use } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isAuthenticated, user } = use(AuthContext);

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const confirmSignOut = () => {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Log out", style: "destructive", onPress: handleSignOut },
    ]);
  };

  return (
    <>
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.View hidesSharedBackground>
          <Text type="title" weight="bold" lightColor="black" darkColor="white">
            Profile
          </Text>
        </Stack.Toolbar.View>
      </Stack.Toolbar>

      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        {!isAuthenticated ? (
          <View style={styles.signInContainer}>
            <Text type="2xl" weight="bold" style={styles.centered}>
              Not signed in
            </Text>
            <Text type="default" style={[styles.centered, { opacity: 0.5, marginTop: 8 }]}>
              Sign in to access your account details and personalized features.
            </Text>
            <Button
              title="Sign in"
              color="neutral"
              variant="solid"
              radius="full"
              size="lg"
              style={{ marginTop: 24 } as any}
              onPress={() => router.push("/auth-sheet")}
            />
          </View>
        ) : (
          <View style={styles.accountContainer}>
            <View style={styles.section}>
              <Text type="sm" weight="semibold" style={{ opacity: 0.5, marginBottom: 12 }}>
                ACCOUNT
              </Text>
              <View style={styles.row}>
                <Text type="default" style={{ opacity: 0.5 }}>Name</Text>
                <Text type="default" weight="semibold">{user?.name ?? "—"}</Text>
              </View>
              <View style={styles.row}>
                <Text type="default" style={{ opacity: 0.5 }}>Email</Text>
                <Text type="default" weight="semibold">{user?.email ?? "—"}</Text>
              </View>
            </View>

            <Button
              title="Log out"
              color="red"
              variant="soft"
              radius="full"
              size="lg"
              style={{ marginTop: 32 } as any}
              onPress={confirmSignOut}
            />
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  signInContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  centered: {
    textAlign: "center",
  },
  accountContainer: {
    flex: 1,
    paddingTop: 24,
  },
  section: {
    gap: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(128,128,128,0.2)",
  },
});
