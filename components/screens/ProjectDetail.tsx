import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { RegionPicker } from "@/components/RegionPicker";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { SPACING, BORDER_RADIUS } from "@/constants/designTokens";
import { REGION_LABELS } from "@/constants/seasonal-tips";
import { useAccentColor } from "@/hooks/useAccentColor";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useProjects } from "@/context/ProjectContext";
import { getSeasonalRecommendation } from "@/lib/seasonal-engine";
import { REDESIGN_STYLE_LABELS, ROOM_TYPE_LABELS, GUEST_TYPE_LABELS } from "@/types/redesign";
import type { Project, RedesignEntry } from "@/types/project";
import type { PropertyRegion, Hemisphere, Urgency } from "@/types/seasonal";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
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
  const { projects, deleteProject, updateProjectMeta } = useProjects();
  const [selectedEntry, setSelectedEntry] = useState<RedesignEntry | null>(null);
  const [editingMeta, setEditingMeta] = useState(false);
  const [pickerRegion, setPickerRegion] = useState<PropertyRegion | undefined>(undefined);
  const [pickerHemisphere, setPickerHemisphere] = useState<Hemisphere>("northern");

  const project = projects.find((p) => p.id === id);

  const recommendation = useMemo(() => {
    if (!project?.region || !project?.hemisphere) return null;
    return getSeasonalRecommendation(
      project.region,
      project.hemisphere,
      new Date(),
      project.updatedAt
    );
  }, [project?.region, project?.hemisphere, project?.updatedAt]);

  const handleSaveMeta = useCallback(async () => {
    if (!project || !pickerRegion) return;
    await updateProjectMeta(project.id, {
      region: pickerRegion,
      hemisphere: pickerHemisphere,
    });
    setEditingMeta(false);
  }, [project, pickerRegion, pickerHemisphere, updateProjectMeta]);

  const handleRefreshSeasonal = useCallback(() => {
    if (!recommendation) return;
    router.push({
      pathname: "/(tabs)/camera",
      params: {
        prefillStyle: recommendation.styles[0],
        prefillGuest: recommendation.guestType,
        prefillRoom: recommendation.rooms[0],
      },
    });
  }, [recommendation, router]);

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

      {/* Seasonal section */}
      {!project.region || editingMeta ? (
        <View style={[s.seasonalCard, { backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)" }]}>
          <Text type="body" weight="bold" lightColor="black" darkColor="white">
            {editingMeta ? "Edit Location" : "Add Location for Seasonal Tips"}
          </Text>
          <Text type="sm" lightColor="black" darkColor="white" style={{ opacity: 0.5 }}>
            Get personalized recommendations based on your property location and season.
          </Text>
          <RegionPicker
            region={pickerRegion ?? project.region}
            hemisphere={pickerHemisphere}
            onRegionChange={setPickerRegion}
            onHemisphereChange={setPickerHemisphere}
            isDark={isDark}
          />
          <View style={s.metaActions}>
            <Button
              title="Save"
              onPress={handleSaveMeta}
              variant="solid"
              size="md"
              disabled={!pickerRegion}
            />
            {editingMeta && (
              <Pressable onPress={() => setEditingMeta(false)}>
                <Text type="sm" weight="semibold" style={{ color: "#007AFF" }}>
                  Cancel
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      ) : recommendation ? (
        <View style={[s.seasonalCard, { backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)" }]}>
          <View style={s.seasonalHeader}>
            <Text type="body" weight="bold" lightColor="black" darkColor="white">
              {recommendation.seasonLabel}
            </Text>
            <Pressable onPress={() => {
              setPickerRegion(project.region);
              setPickerHemisphere(project.hemisphere ?? "northern");
              setEditingMeta(true);
            }}>
              <Text type="sm" weight="semibold" style={{ color: "#007AFF" }}>
                Edit
              </Text>
            </Pressable>
          </View>
          <Text type="sm" lightColor="black" darkColor="white" style={{ opacity: 0.5 }}>
            {REGION_LABELS[project.region!]} · Updated {new Date(project.updatedAt).toLocaleDateString()}
          </Text>
          <View style={s.seasonalTags}>
            <View style={[s.seasonalTag, { backgroundColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.06)" }]}>
              <Text type="caption" lightColor="black" darkColor="white">
                {REDESIGN_STYLE_LABELS[recommendation.styles[0]]}
              </Text>
            </View>
            <View style={[s.seasonalTag, { backgroundColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.06)" }]}>
              <Text type="caption" lightColor="black" darkColor="white">
                {GUEST_TYPE_LABELS[recommendation.guestType]}
              </Text>
            </View>
          </View>
          <Text type="sm" lightColor="black" darkColor="white" style={{ opacity: 0.7, lineHeight: 18 }}>
            {recommendation.tip}
          </Text>
          <View style={s.urgencyRow}>
            <View style={[s.urgencyDot, { backgroundColor: recommendation.urgency === "fresh" ? "#16A34A" : recommendation.urgency === "due" ? "#CA8A04" : "#DC2626" }]} />
            <Text type="caption" style={{ color: recommendation.urgency === "fresh" ? "#16A34A" : recommendation.urgency === "due" ? "#CA8A04" : "#DC2626", flex: 1 }}>
              {recommendation.urgencyMessage}
            </Text>
          </View>
          <Button
            title={`Refresh for ${recommendation.seasonLabel}`}
            onPress={handleRefreshSeasonal}
            variant="solid"
            size="md"
            symbol="camera.viewfinder"
          />
        </View>
      ) : null}

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
  seasonalCard: {
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.MD,
    gap: SPACING.SM,
    marginTop: SPACING.MD,
  },
  seasonalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  seasonalTags: {
    flexDirection: "row",
    gap: SPACING.XS,
  },
  seasonalTag: {
    paddingHorizontal: SPACING.SM,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.FULL,
  },
  urgencyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.XS,
  },
  urgencyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  metaActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.MD,
    marginTop: SPACING.XS,
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
