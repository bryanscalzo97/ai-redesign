import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { SPACING, BORDER_RADIUS } from "@/constants/designTokens";
import { useAccentColor } from "@/hooks/useAccentColor";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useProjects } from "@/context/ProjectContext";
import { REDESIGN_STYLE_LABELS, ROOM_TYPE_LABELS } from "@/types/redesign";
import type { Project, RedesignEntry } from "@/types/project";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  View,
} from "react-native";

const screenWidth = Dimensions.get("window").width;
const GRID_GAP = SPACING.XS;
const NUM_COLUMNS = 2;
const ITEM_SIZE = (screenWidth - SPACING.MD * 2 - GRID_GAP) / NUM_COLUMNS;

function RedesignCard({
  entry,
  onPress,
}: {
  entry: RedesignEntry;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress}>
      <Image
        source={{ uri: entry.afterImagePath }}
        style={s.gridImage}
        contentFit="cover"
        transition={600}
      />
      <Text
        type="caption"
        lightColor="black"
        darkColor="white"
        style={{ marginTop: 4, opacity: 0.6 }}
        numberOfLines={1}
      >
        {(REDESIGN_STYLE_LABELS as any)[entry.style] || entry.style} ·{" "}
        {(ROOM_TYPE_LABELS as any)[entry.roomType] || entry.roomType}
      </Text>
    </Pressable>
  );
}

function RedesignExpandedView({
  entry,
  projectId,
  onClose,
}: {
  entry: RedesignEntry;
  projectId: string;
  onClose: () => void;
}) {
  const { updateRedesignListingText } = useProjects();
  const [listingText, setListingText] = useState(entry.listingText || "");
  const [isGeneratingText, setIsGeneratingText] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const handleGenerateText = useCallback(async () => {
    setIsGeneratingText(true);
    try {
      const response = await fetch("/api/listing-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomType: entry.roomType,
          style: entry.style,
          guestType: entry.guestType,
        }),
      });
      const data = await response.json();
      if (data.success && data.listingText) {
        setListingText(data.listingText);
        await updateRedesignListingText(projectId, entry.id, data.listingText);
      } else {
        Alert.alert("Error", data.error || "Failed to generate listing text");
      }
    } catch {
      Alert.alert("Error", "Failed to connect to the server");
    } finally {
      setIsGeneratingText(false);
    }
  }, [entry, projectId, updateRedesignListingText]);

  const handleShare = useCallback(() => {
    if (listingText) {
      Share.share({ message: listingText });
    }
  }, [listingText]);

  return (
    <ScrollView style={s.expandedContainer} contentContainerStyle={s.expandedContent}>
      <BeforeAfterSlider
        beforeUri={entry.beforeImagePath}
        afterUri={entry.afterImagePath}
        width={screenWidth}
        height={screenWidth}
      />

      <View style={s.expandedInfo}>
        <Text type="body" weight="bold" lightColor="black" darkColor="white">
          {(REDESIGN_STYLE_LABELS as any)[entry.style] || entry.style}
        </Text>
        <Text type="sm" lightColor="black" darkColor="white" style={{ opacity: 0.5 }}>
          {(ROOM_TYPE_LABELS as any)[entry.roomType] || entry.roomType} ·{" "}
          {new Date(entry.createdAt).toLocaleDateString()}
        </Text>
      </View>

      {/* Listing text section */}
      <View style={s.textSection}>
        {listingText ? (
          <>
            <View style={s.textHeader}>
              <Text type="body" weight="bold" lightColor="black" darkColor="white">
                Listing Description
              </Text>
              <Pressable onPress={handleShare}>
                <Text type="sm" weight="semibold" style={{ color: "#007AFF" }}>
                  Share
                </Text>
              </Pressable>
            </View>
            <Text
              type="sm"
              lightColor="black"
              darkColor="white"
              style={{ lineHeight: 20, opacity: 0.8 }}
              selectable
            >
              {listingText}
            </Text>
            <Button
              title="Regenerate"
              onPress={handleGenerateText}
              variant="soft"
              size="md"
              style={s.textButton as any}
              disabled={isGeneratingText}
            />
          </>
        ) : (
          <View style={s.generateSection}>
            {isGeneratingText ? (
              <View style={s.generatingRow}>
                <ActivityIndicator size="small" />
                <Text type="sm" lightColor="black" darkColor="white" style={{ opacity: 0.6 }}>
                  Writing listing description...
                </Text>
              </View>
            ) : (
              <Button
                title="Generate Listing Description"
                onPress={handleGenerateText}
                variant="solid"
                size="lg"
                symbol="text.badge.star"
              />
            )}
          </View>
        )}
      </View>

      <Button
        title="Back to property"
        onPress={onClose}
        variant="soft"
        size="md"
        style={s.backButton as any}
      />

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

export function ProjectDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getBackgroundColor } = useAccentColor();
  const backgroundColor = getBackgroundColor();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { projects, deleteProject } = useProjects();
  const [selectedEntry, setSelectedEntry] = useState<RedesignEntry | null>(null);

  const project = projects.find((p) => p.id === id);

  const handleDelete = useCallback(() => {
    if (!project) return;
    Alert.alert(
      "Delete Property",
      `Delete "${project.name}" and all its redesigns?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteProject(project.id);
            router.back();
          },
        },
      ]
    );
  }, [project, deleteProject, router]);

  if (!project) {
    return (
      <View style={[s.center, { backgroundColor }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (selectedEntry) {
    return (
      <RedesignExpandedView
        entry={selectedEntry}
        projectId={project.id}
        onClose={() => setSelectedEntry(null)}
      />
    );
  }

  return (
    <ScrollView
      style={[s.container, { backgroundColor }]}
      contentContainerStyle={s.content}
    >
      <Text type="title" weight="bold" lightColor="black" darkColor="white">
        {project.name}
      </Text>
      <Text type="sm" lightColor="black" darkColor="white" style={{ opacity: 0.5 }}>
        {project.redesigns.length}{" "}
        {project.redesigns.length === 1 ? "redesign" : "redesigns"} ·
        Updated {new Date(project.updatedAt).toLocaleDateString()}
      </Text>

      <Button
        title="Add Redesign"
        onPress={() => router.push("/(tabs)/camera")}
        variant="solid"
        size="lg"
        symbol="camera.viewfinder"
        radius="full"
        style={s.addButton as any}
      />

      {project.redesigns.length === 0 ? (
        <View style={s.emptyState}>
          <Text
            type="body"
            lightColor="black"
            darkColor="white"
            style={{ textAlign: "center", opacity: 0.5 }}
          >
            No redesigns yet. Scan a space to get started.
          </Text>
        </View>
      ) : (
        <View style={s.grid}>
          {project.redesigns.map((entry) => (
            <RedesignCard
              key={entry.id}
              entry={entry}
              onPress={() => setSelectedEntry(entry)}
            />
          ))}
        </View>
      )}

      <Pressable onPress={handleDelete} style={s.deleteButton}>
        <Text type="sm" weight="semibold" style={{ color: "#DC2626" }}>
          Delete Property
        </Text>
      </Pressable>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: SPACING.MD,
    gap: SPACING.SM,
  },
  addButton: {
    marginTop: SPACING.MD,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: GRID_GAP,
    marginTop: SPACING.MD,
  },
  gridImage: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: BORDER_RADIUS.MD,
  },
  emptyState: {
    paddingVertical: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButton: {
    marginTop: 32,
    alignItems: "center",
    paddingVertical: SPACING.MD,
  },
  // Expanded view
  expandedContainer: {
    flex: 1,
  },
  expandedContent: {
    paddingBottom: 20,
  },
  expandedInfo: {
    padding: SPACING.MD,
    gap: 2,
  },
  textSection: {
    paddingHorizontal: SPACING.MD,
    marginTop: SPACING.SM,
  },
  textHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.SM,
  },
  textButton: {
    marginTop: SPACING.MD,
  },
  generateSection: {
    gap: SPACING.SM,
  },
  generatingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.SM,
    paddingVertical: SPACING.MD,
  },
  backButton: {
    marginHorizontal: SPACING.MD,
    marginTop: SPACING.LG,
  },
});
