import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { SPACING, BORDER_RADIUS } from "@/constants/designTokens";
import { useAccentColor } from "@/hooks/useAccentColor";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useProjects } from "@/context/ProjectContext";
import { getSeasonalRecommendation } from "@/lib/seasonal-engine";
import type { Project } from "@/types/project";
import type { Urgency } from "@/types/seasonal";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";

const screenWidth = Dimensions.get("window").width;
const CARD_WIDTH = screenWidth - SPACING.MD * 2;
const CARD_IMAGE_HEIGHT = 160;

const URGENCY_COLORS: Record<Urgency, string> = {
  fresh: "#16A34A",
  due: "#CA8A04",
  overdue: "#DC2626",
};

function ProjectCard({
  project,
  onPress,
  isDark,
}: {
  project: Project;
  onPress: () => void;
  isDark: boolean;
}) {
  const count = project.redesigns.length;
  const date = new Date(project.updatedAt).toLocaleDateString();

  const urgency = useMemo<Urgency | null>(() => {
    if (!project.region || !project.hemisphere) return null;
    return getSeasonalRecommendation(
      project.region,
      project.hemisphere,
      new Date(),
      project.updatedAt
    ).urgency;
  }, [project.region, project.hemisphere, project.updatedAt]);

  return (
    <Pressable
      onPress={onPress}
      style={[
        s.card,
        { backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)" },
      ]}
    >
      {project.coverImagePath ? (
        <Image
          source={{ uri: project.coverImagePath }}
          style={s.cardImage}
          contentFit="cover"
          transition={600}
        />
      ) : (
        <View style={[s.cardImage, s.cardPlaceholder]}>
          <Text type="lg" style={{ opacity: 0.3 }}>
            No photos yet
          </Text>
        </View>
      )}
      <View style={s.cardInfo}>
        <View style={s.cardNameRow}>
          <Text
            type="body"
            weight="bold"
            lightColor="black"
            darkColor="white"
            numberOfLines={1}
            style={{ flex: 1 }}
          >
            {project.name}
          </Text>
          {urgency && (
            <View style={[s.urgencyDot, { backgroundColor: URGENCY_COLORS[urgency] }]} />
          )}
        </View>
        <Text
          type="sm"
          lightColor="black"
          darkColor="white"
          style={{ opacity: 0.5 }}
        >
          {count} {count === 1 ? "redesign" : "redesigns"} · {date}
        </Text>
      </View>
    </Pressable>
  );
}

export function ProjectList() {
  const { getBackgroundColor } = useAccentColor();
  const backgroundColor = getBackgroundColor();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();
  const { projects, isLoading, refreshProjects, createProject } = useProjects();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refreshProjects();
    setIsRefreshing(false);
  }, [refreshProjects]);

  const handleCreateProject = useCallback(() => {
    Alert.prompt(
      "New Property",
      "Enter a name for your property listing",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Create",
          onPress: async (name: string | undefined) => {
            if (name?.trim()) {
              const project = await createProject(name.trim());
              router.push({
                pathname: "/(tabs)/redesigns/project-detail",
                params: { id: project.id },
              });
            }
          },
        },
      ],
      "plain-text",
      "",
      "default"
    );
  }, [createProject, router]);

  const handleProjectPress = useCallback(
    (project: Project) => {
      router.push({
        pathname: "/(tabs)/redesigns/project-detail",
        params: { id: project.id },
      });
    },
    [router]
  );

  if (isLoading) {
    return (
      <View style={[s.center, { backgroundColor }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FlatList
      data={projects}
      keyExtractor={(item) => item.id}
      style={[s.list, { backgroundColor }]}
      contentContainerStyle={[
        s.listContent,
        projects.length === 0 && s.emptyContent,
      ]}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
      }
      ListHeaderComponent={
        <Button
          title="New Property"
          onPress={handleCreateProject}
          variant="solid"
          size="lg"
          symbol="plus"
          radius="full"
          style={s.createButton as any}
        />
      }
      ListEmptyComponent={
        <View style={s.empty}>
          <Text
            type="body"
            weight="semibold"
            lightColor="black"
            darkColor="white"
            style={{ textAlign: "center" }}
          >
            No properties yet
          </Text>
          <Text
            type="sm"
            lightColor="black"
            darkColor="white"
            style={{ textAlign: "center", opacity: 0.5, marginTop: 4 }}
          >
            Create a property to start organizing your redesigns.
          </Text>
        </View>
      }
      renderItem={({ item }) => (
        <ProjectCard
          project={item}
          onPress={() => handleProjectPress(item)}
          isDark={isDark}
        />
      )}
    />
  );
}

const s = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: SPACING.MD,
    gap: SPACING.MD,
  },
  emptyContent: {
    flexGrow: 1,
  },
  createButton: {
    marginBottom: SPACING.SM,
  },
  card: {
    borderRadius: BORDER_RADIUS.LG,
    overflow: "hidden",
  },
  cardImage: {
    width: CARD_WIDTH,
    height: CARD_IMAGE_HEIGHT,
  },
  cardPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(128,128,128,0.1)",
  },
  cardInfo: {
    padding: SPACING.MD,
    gap: 2,
  },
  cardNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.SM,
  },
  urgencyDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING.LG,
  },
});
