import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Text } from "@/components/ui/Text";
import { AuthContext } from "@/context/AuthContext";
import { useProjects } from "@/context/ProjectContext";
import { authClient } from "@/lib/auth-client";
import { useAccentColor } from "@/hooks/useAccentColor";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Stack, useRouter } from "expo-router";
import { use } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function SectionHeader({ title }: { title: string }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  return (
    <Text
      type="sm"
      weight="semibold"
      style={{
        color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
        textTransform: "uppercase",
        paddingHorizontal: 16,
        marginBottom: 6,
      }}
    >
      {title}
    </Text>
  );
}

function SectionCard({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  return (
    <View
      style={{
        backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.03)",
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      {children}
    </View>
  );
}

function Row({
  label,
  value,
  isLast = false,
}: {
  label: string;
  value: string;
  isLast?: boolean;
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const borderColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  return (
    <View
      style={[
        s.row,
        !isLast && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: borderColor },
      ]}
    >
      <Text type="default" style={{ color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)" }}>
        {label}
      </Text>
      <Text type="default" weight="medium" lightColor="black" darkColor="white">
        {value}
      </Text>
    </View>
  );
}

function LinkRow({
  title,
  onPress,
  isLast = false,
}: {
  title: string;
  onPress: () => void;
  isLast?: boolean;
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const borderColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  return (
    <Pressable
      onPress={onPress}
      style={[
        s.linkRow,
        !isLast && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: borderColor },
      ]}
    >
      <Text type="default" lightColor="black" darkColor="white">{title}</Text>
      <Icon symbol="chevron.right" size="xs" color={isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"} />
    </Pressable>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isAuthenticated, user } = use(AuthContext);
  const { projects, deleteProject } = useProjects();
  const { getBackgroundColor } = useAccentColor();
  const backgroundColor = getBackgroundColor();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

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

  const displayName = user?.name?.includes("@")
    ? user.name.slice(0, user.name.indexOf("@"))
    : user?.name || "—";

  return (
    <>
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.View hidesSharedBackground>
          <Text type="title" weight="bold" lightColor="black" darkColor="white">
            Profile
          </Text>
        </Stack.Toolbar.View>
      </Stack.Toolbar>

      <ScrollView
        style={[s.container, { backgroundColor }]}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
        contentInsetAdjustmentBehavior="always"
      >
        {/* Sign In Prompt */}
        {!isAuthenticated && (
          <View style={s.signInContainer}>
            <View style={s.signInIconCircle}>
              <Icon
                symbol="person.crop.circle"
                size="xl"
                color={isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)"}
              />
            </View>
            <Text
              type="xl"
              weight="bold"
              lightColor="black"
              darkColor="white"
              style={{ textAlign: "center", marginTop: 16 }}
            >
              Not signed in
            </Text>
            <Text
              type="sm"
              style={{
                textAlign: "center",
                marginTop: 6,
                color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
                lineHeight: 20,
                paddingHorizontal: 16,
              }}
            >
              Sign in to access your account details, subscription info, and personalized features.
            </Text>
            <Button
              title="Sign in"
              color="neutral"
              variant="solid"
              radius="full"
              size="lg"
              style={{ marginTop: 20, width: "100%" } as any}
              onPress={() => router.push("/auth-sheet")}
            />
          </View>
        )}

        {/* Account Section */}
        {isAuthenticated && (
          <View style={s.section}>
            <SectionHeader title="Account" />
            <SectionCard>
              <Row label="Name" value={displayName} />
              <Row label="Email" value={user?.email ?? "—"} isLast />
            </SectionCard>
          </View>
        )}

        {/* Legal Section */}
        <View style={s.section}>
          <SectionHeader title="Legal" />
          <SectionCard>
            <LinkRow
              title="Privacy Policy"
              onPress={() => router.push("/privacy-policy")}
            />
            <LinkRow
              title="Terms of Service"
              onPress={() => router.push("/terms-of-service")}
              isLast
            />
          </SectionCard>
        </View>

        {/* Log Out */}
        {isAuthenticated && (
          <View style={s.section}>
            <SectionCard>
              <Pressable onPress={confirmSignOut} style={s.logoutRow}>
                <Text type="default" weight="medium" style={{ color: "#ef4444" }}>
                  Log out
                </Text>
              </Pressable>
            </SectionCard>
          </View>
        )}

        {/* Data Management */}
        {projects.length > 0 && (
          <View style={s.section}>
            <SectionHeader title="Data" />
            <SectionCard>
              <Pressable
                onPress={() => {
                  Alert.alert(
                    "Delete All Data",
                    `This will permanently delete all ${projects.length} properties and their room scans. This cannot be undone.`,
                    [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Delete Everything",
                        style: "destructive",
                        onPress: async () => {
                          for (const p of projects) {
                            await deleteProject(p.id);
                          }
                          Alert.alert("Done", "All data has been deleted.");
                        },
                      },
                    ]
                  );
                }}
                style={s.logoutRow}
              >
                <Text type="default" weight="medium" style={{ color: "#ef4444" }}>
                  Delete all data ({projects.length} {projects.length === 1 ? "property" : "properties"})
                </Text>
              </Pressable>
            </SectionCard>
          </View>
        )}
      </ScrollView>
    </>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
  },
  signInContainer: {
    alignItems: "center",
    paddingHorizontal: 40,
    paddingTop: 48,
    paddingBottom: 12,
  },
  signInIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    marginTop: 28,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 16,
  },
  linkRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 16,
  },
  logoutRow: {
    paddingVertical: 13,
    paddingHorizontal: 16,
    alignItems: "center",
  },
});
