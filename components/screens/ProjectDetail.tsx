import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { RegionPicker } from "@/components/RegionPicker";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { SPACING, BORDER_RADIUS } from "@/constants/designTokens";
import { HOST_INSIGHTS } from "@/constants/host-insights";
import { REGION_LABELS } from "@/constants/seasonal-tips";
import { useAccentColor } from "@/hooks/useAccentColor";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useProjects } from "@/context/ProjectContext";
import { getSeasonalRecommendation } from "@/lib/seasonal-engine";
import {
  computePropertyScore,
  estimateROI,
  suggestionKey,
  type AggregatedSuggestion,
  type PropertyScore,
} from "@/lib/project-score";
import {
  groupRedesignsByRoom,
  type RoomGroup,
} from "@/lib/progress-tracking";
import {
  REDESIGN_STYLE_LABELS,
  ROOM_TYPE_LABELS,
  GUEST_TYPE_LABELS,
} from "@/types/redesign";
import type { Project, RedesignEntry } from "@/types/project";
import type { PropertyRegion, Hemisphere, Urgency } from "@/types/seasonal";
import { Image } from "expo-image";
import { File as ExpoFile } from "expo-file-system";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
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

function scoreColor(score: number): string {
  if (score < 4) return "#EF4444";
  if (score <= 7) return "#EAB308";
  return "#22C55E";
}

// ─── Insight Banner ─────────────────────────────────────────────────────────
function InsightBanner({ text }: { text: string }) {
  return (
    <View style={s.insightBanner}>
      <Text type="caption" style={s.insightText}>
        💡 {text}
      </Text>
    </View>
  );
}

// ─── Redesign Card ──────────────────────────────────────────────────────────
function RedesignCard({
  entry,
  onPress,
}: {
  entry: RedesignEntry;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress}>
      <View>
        <Image
          source={{ uri: entry.afterImagePath }}
          style={s.gridImage}
          contentFit="cover"
          transition={600}
        />
        {entry.roomAnalysis && (
          <View
            style={[
              s.scoreBadge,
              { backgroundColor: scoreColor(entry.roomAnalysis.score) },
            ]}
          >
            <Text type="caption" weight="bold" style={{ color: "#fff" }}>
              {entry.roomAnalysis.score.toFixed(1)}
            </Text>
          </View>
        )}
      </View>
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

// ─── Expanded View ──────────────────────────────────────────────────────────
function RedesignExpandedView({
  entry,
  projectId,
  project,
  onClose,
}: {
  entry: RedesignEntry;
  projectId: string;
  project: Project;
  onClose: () => void;
}) {
  const router = useRouter();
  const { updateRedesignListingText } = useProjects();
  const [listingText, setListingText] = useState(entry.listingText || "");
  const [isGeneratingText, setIsGeneratingText] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const handleGenerateText = useCallback(async () => {
    setIsGeneratingText(true);
    try {
      // Try to read the after-image and send as base64
      let imageBase64: string | undefined;
      try {
        const file = new ExpoFile(entry.afterImagePath);
        if (file.exists) {
          imageBase64 = await file.text();
        }
      } catch {
        // ignore — will generate without image
      }

      const response = await fetch("/api/listing-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomType: entry.roomType,
          style: entry.style,
          guestType: entry.guestType,
          image_base64: imageBase64,
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

  const handleRescan = useCallback(() => {
    router.push({
      pathname: "/(tabs)/camera",
      params: { prefillRoom: entry.roomType },
    });
  }, [entry.roomType, router]);

  return (
    <ScrollView
      style={s.expandedContainer}
      contentContainerStyle={s.expandedContent}
    >
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
        <Text
          type="sm"
          lightColor="black"
          darkColor="white"
          style={{ opacity: 0.5 }}
        >
          {(ROOM_TYPE_LABELS as any)[entry.roomType] || entry.roomType} ·{" "}
          {new Date(entry.createdAt).toLocaleDateString()}
        </Text>
      </View>

      {/* Re-scan button */}
      <View style={s.rescanSection}>
        <Button
          title={`Re-scan this ${(ROOM_TYPE_LABELS as any)[entry.roomType] || "room"}`}
          onPress={handleRescan}
          variant="soft"
          size="md"
          symbol="camera.viewfinder"
        />
      </View>

      {/* Listing text section */}
      <View style={s.textSection}>
        <InsightBanner text={HOST_INSIGHTS.description} />
        {listingText ? (
          <>
            <View style={s.textHeader}>
              <Text
                type="body"
                weight="bold"
                lightColor="black"
                darkColor="white"
              >
                Listing Description
              </Text>
              <Pressable onPress={handleShare}>
                <Text
                  type="sm"
                  weight="semibold"
                  style={{ color: "#007AFF" }}
                >
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
                <Text
                  type="sm"
                  lightColor="black"
                  darkColor="white"
                  style={{ opacity: 0.6 }}
                >
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

// ─── Score Card (Dashboard) ─────────────────────────────────────────────────
function DashboardScoreCard({
  averageScore,
  roomCount,
  isDark,
}: {
  averageScore: number;
  roomCount: number;
  isDark: boolean;
}) {
  return (
    <View
      style={[
        s.dashboardCard,
        {
          backgroundColor: isDark
            ? "rgba(255,255,255,0.08)"
            : "rgba(0,0,0,0.04)",
        },
      ]}
    >
      <InsightBanner text={HOST_INSIGHTS.score} />
      <View style={s.scoreCenter}>
        <Text
          type="title"
          weight="bold"
          style={{ color: scoreColor(averageScore), fontSize: 48, lineHeight: 56 }}
        >
          {averageScore.toFixed(1)}
        </Text>
        <Text
          type="body"
          weight="semibold"
          lightColor="black"
          darkColor="white"
        >
          Property Score
        </Text>
        <Text
          type="caption"
          lightColor="black"
          darkColor="white"
          style={{ opacity: 0.5 }}
        >
          Based on {roomCount} {roomCount === 1 ? "room" : "rooms"} scanned
        </Text>
      </View>
    </View>
  );
}

// ─── Room Breakdown Row ─────────────────────────────────────────────────────
function RoomBreakdownRow({
  rooms,
  isDark,
  onRoomPress,
}: {
  rooms: { redesignId: string; roomLabel: string; score: number }[];
  isDark: boolean;
  onRoomPress: (redesignId: string) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={s.roomBreakdownRow}
    >
      {rooms.map((room) => (
        <Pressable
          key={room.redesignId}
          onPress={() => onRoomPress(room.redesignId)}
          style={[
            s.roomPill,
            {
              backgroundColor: isDark
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.06)",
              borderColor: scoreColor(room.score),
              borderWidth: 1.5,
            },
          ]}
        >
          <Text type="caption" weight="semibold" lightColor="black" darkColor="white">
            {room.roomLabel}
          </Text>
          <Text
            type="caption"
            weight="bold"
            style={{ color: scoreColor(room.score) }}
          >
            {room.score.toFixed(1)}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

// ─── Action Plan Export ──────────────────────────────────────────────────────
function buildActionPlanText(
  propertyName: string,
  suggestions: AggregatedSuggestion[],
  totalCost: number,
  completedCost: number,
  completedCount: number,
  totalCount: number
): string {
  const grouped = new Map<string, AggregatedSuggestion[]>();
  for (const sg of suggestions) {
    const existing = grouped.get(sg.roomLabel) ?? [];
    existing.push(sg);
    grouped.set(sg.roomLabel, existing);
  }

  const lines: string[] = [
    `ACTION PLAN: ${propertyName}`,
    `Progress: ${completedCount}/${totalCount} completed`,
    `Budget: $${completedCost} spent of $${totalCost} total`,
    "",
  ];

  for (const [room, items] of grouped) {
    lines.push(room);
    for (const item of items) {
      const check = item.checked ? "[x]" : "[ ]";
      const cost = item.suggestion.estimatedCost
        ? ` (~$${item.suggestion.estimatedCost})`
        : "";
      const detail = item.suggestion.detail
        ? ` - ${item.suggestion.detail}`
        : "";
      lines.push(`  ${check} ${item.suggestion.item}${detail}${cost}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

// ─── ROI Card ───────────────────────────────────────────────────────────────
function ROICard({
  propertyScore,
  nightlyRate,
  projectId,
  isDark,
}: {
  propertyScore: PropertyScore;
  nightlyRate: number | undefined;
  projectId: string;
  isDark: boolean;
}) {
  const { updateProjectMeta } = useProjects();

  const handleSetRate = useCallback(() => {
    Alert.prompt(
      "Nightly Rate",
      "Enter your average nightly rate ($)",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Save",
          onPress: (val: string | undefined) => {
            const rate = Number(val);
            if (rate > 0) {
              updateProjectMeta(projectId, { nightlyRate: rate });
            }
          },
        },
      ],
      "plain-text",
      nightlyRate?.toString() ?? "",
      "decimal-pad"
    );
  }, [projectId, nightlyRate, updateProjectMeta]);

  const roi = nightlyRate ? estimateROI(propertyScore, nightlyRate) : null;

  return (
    <View
      style={[
        s.dashboardCard,
        {
          backgroundColor: isDark
            ? "rgba(255,255,255,0.08)"
            : "rgba(0,0,0,0.04)",
        },
      ]}
    >
      <View style={s.actionPlanHeader}>
        <Text type="body" weight="bold" lightColor="black" darkColor="white">
          ROI Estimate
        </Text>
        <Pressable onPress={handleSetRate}>
          <Text type="sm" weight="semibold" style={{ color: "#007AFF" }}>
            {nightlyRate ? `$${nightlyRate}/night` : "Set rate"}
          </Text>
        </Pressable>
      </View>

      {roi ? (
        <View style={s.roiGrid}>
          <View style={s.roiItem}>
            <Text type="lg" weight="bold" style={{ color: "#22C55E" }}>
              +{roi.bookingLiftPercent}%
            </Text>
            <Text type="caption" lightColor="black" darkColor="white" style={{ opacity: 0.5 }}>
              More bookings
            </Text>
          </View>
          <View style={s.roiItem}>
            <Text type="lg" weight="bold" style={{ color: "#22C55E" }}>
              +${roi.extraMonthlyRevenue}
            </Text>
            <Text type="caption" lightColor="black" darkColor="white" style={{ opacity: 0.5 }}>
              Extra / month
            </Text>
          </View>
          <View style={s.roiItem}>
            <Text type="lg" weight="bold" lightColor="black" darkColor="white">
              {roi.paybackWeeks}w
            </Text>
            <Text type="caption" lightColor="black" darkColor="white" style={{ opacity: 0.5 }}>
              Payback
            </Text>
          </View>
          <View style={s.roiItem}>
            <Text type="lg" weight="bold" lightColor="black" darkColor="white">
              ${roi.investmentCost}
            </Text>
            <Text type="caption" lightColor="black" darkColor="white" style={{ opacity: 0.5 }}>
              To invest
            </Text>
          </View>
        </View>
      ) : (
        <Text type="sm" lightColor="black" darkColor="white" style={{ opacity: 0.5 }}>
          {nightlyRate
            ? "Not enough data to estimate ROI yet."
            : "Set your nightly rate to see estimated ROI for improvements."}
        </Text>
      )}
    </View>
  );
}

// ─── Action Plan Card ───────────────────────────────────────────────────────
function ActionPlanCard({
  suggestions,
  totalCost,
  completedCost,
  completedCount,
  totalCount,
  projectId,
  propertyName,
  isDark,
}: {
  suggestions: AggregatedSuggestion[];
  totalCost: number;
  completedCost: number;
  completedCount: number;
  totalCount: number;
  projectId: string;
  propertyName: string;
  isDark: boolean;
}) {
  const { toggleSuggestionChecked } = useProjects();
  const progress = totalCount > 0 ? completedCount / totalCount : 0;

  // Group by roomLabel
  const grouped = useMemo(() => {
    const map = new Map<string, AggregatedSuggestion[]>();
    for (const sg of suggestions) {
      const existing = map.get(sg.roomLabel) ?? [];
      existing.push(sg);
      map.set(sg.roomLabel, existing);
    }
    return Array.from(map.entries());
  }, [suggestions]);

  const handleToggle = useCallback(
    (sg: AggregatedSuggestion) => {
      const key = suggestionKey(sg.redesignId, sg.index);
      toggleSuggestionChecked(projectId, key);
    },
    [projectId, toggleSuggestionChecked]
  );

  const handleExport = useCallback(() => {
    const text = buildActionPlanText(
      propertyName,
      suggestions,
      totalCost,
      completedCost,
      completedCount,
      totalCount
    );
    Share.share({ message: text });
  }, [propertyName, suggestions, totalCost, completedCost, completedCount, totalCount]);

  return (
    <View
      style={[
        s.dashboardCard,
        {
          backgroundColor: isDark
            ? "rgba(255,255,255,0.08)"
            : "rgba(0,0,0,0.04)",
        },
      ]}
    >
      <InsightBanner text={HOST_INSIGHTS.actionPlan} />
      <View style={s.actionPlanHeader}>
        <Text type="body" weight="bold" lightColor="black" darkColor="white">
          Action Plan
        </Text>
        <Pressable onPress={handleExport}>
          <Text type="sm" weight="semibold" style={{ color: "#007AFF" }}>
            Share
          </Text>
        </Pressable>
      </View>

      <Text type="caption" lightColor="black" darkColor="white" style={{ opacity: 0.6 }}>
        Total: ${totalCost} · Done: ${completedCost}
      </Text>

      {/* Progress bar */}
      <View style={s.progressBarBg}>
        <View
          style={[
            s.progressBarFill,
            { width: `${Math.round(progress * 100)}%` as any },
          ]}
        />
      </View>
      <Text type="caption" lightColor="black" darkColor="white" style={{ opacity: 0.5 }}>
        {completedCount} of {totalCount} completed ({Math.round(progress * 100)}
        %)
      </Text>

      {/* Grouped checklist */}
      {grouped.map(([roomLabel, items]) => (
        <View key={roomLabel} style={s.actionGroup}>
          <Text
            type="sm"
            weight="semibold"
            lightColor="black"
            darkColor="white"
            style={{ opacity: 0.7 }}
          >
            {roomLabel}
          </Text>
          {items.map((item) => (
            <Pressable
              key={suggestionKey(item.redesignId, item.index)}
              onPress={() => handleToggle(item)}
              style={s.checkRow}
            >
              <Text type="body" style={{ width: 24 }}>
                {item.checked ? "☑" : "☐"}
              </Text>
              <Text
                type="sm"
                lightColor="black"
                darkColor="white"
                style={[
                  { flex: 1 },
                  item.checked && { opacity: 0.4, textDecorationLine: "line-through" },
                ]}
              >
                {item.suggestion.item}
                {item.suggestion.detail ? ` — ${item.suggestion.detail}` : ""}
                {item.suggestion.estimatedCost
                  ? ` (~$${item.suggestion.estimatedCost})`
                  : ""}
              </Text>
            </Pressable>
          ))}
        </View>
      ))}
    </View>
  );
}

// ─── Room Group Header (Phase 2) ───────────────────────────────────────────
function RoomGroupHeader({
  group,
  isDark,
}: {
  group: RoomGroup;
  isDark: boolean;
}) {
  const label =
    (ROOM_TYPE_LABELS as Record<string, string>)[group.roomType] ||
    group.roomType;
  const scanCount = group.entries.length;

  return (
    <View style={s.roomGroupHeader}>
      <Text type="sm" weight="bold" lightColor="black" darkColor="white">
        {label}
        {scanCount > 1 ? ` (${scanCount} scans)` : ""}
      </Text>
      {group.progress && group.progress.improvement > 0 && (
        <View style={s.improvementBadge}>
          <Text type="caption" weight="bold" style={{ color: "#22C55E" }}>
            ↑ {group.progress.improvementPercent}%
          </Text>
        </View>
      )}
      {group.progress && (
        <View style={s.progressDots}>
          {group.entries
            .filter((e) => e.roomAnalysis)
            .sort(
              (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
            )
            .map((e) => (
              <View
                key={e.id}
                style={[
                  s.progressDot,
                  {
                    backgroundColor: scoreColor(e.roomAnalysis!.score),
                  },
                ]}
              />
            ))}
        </View>
      )}
    </View>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────
export function ProjectDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getBackgroundColor } = useAccentColor();
  const backgroundColor = getBackgroundColor();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { projects, deleteProject, updateProjectMeta, toggleSuggestionChecked } =
    useProjects();
  const [selectedEntry, setSelectedEntry] = useState<RedesignEntry | null>(
    null
  );
  const [editingMeta, setEditingMeta] = useState(false);
  const [pickerRegion, setPickerRegion] = useState<PropertyRegion | undefined>(
    undefined
  );
  const [pickerHemisphere, setPickerHemisphere] =
    useState<Hemisphere>("northern");
  const scrollRef = useRef<ScrollView>(null);

  const project = projects.find((p) => p.id === id);

  const propertyScore = useMemo(
    () => (project ? computePropertyScore(project) : null),
    [project]
  );

  const roomGroups = useMemo(
    () => (project ? groupRedesignsByRoom(project) : []),
    [project]
  );

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

  const handleRoomPillPress = useCallback(
    (redesignId: string) => {
      const entry = project?.redesigns.find((r) => r.id === redesignId);
      if (entry) setSelectedEntry(entry);
    },
    [project]
  );

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
        project={project}
        onClose={() => setSelectedEntry(null)}
      />
    );
  }

  return (
    <ScrollView
      ref={scrollRef}
      style={[s.container, { backgroundColor }]}
      contentContainerStyle={s.content}
    >
      <Text type="title" weight="bold" lightColor="black" darkColor="white">
        {project.name}
      </Text>
      <Text
        type="sm"
        lightColor="black"
        darkColor="white"
        style={{ opacity: 0.5 }}
      >
        {project.redesigns.length}{" "}
        {project.redesigns.length === 1 ? "redesign" : "redesigns"} · Updated{" "}
        {new Date(project.updatedAt).toLocaleDateString()}
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

      {/* ── Dashboard Section ── */}
      {propertyScore && (
        <>
          <DashboardScoreCard
            averageScore={propertyScore.averageScore}
            roomCount={propertyScore.rooms.length}
            isDark={isDark}
          />

          <RoomBreakdownRow
            rooms={propertyScore.rooms}
            isDark={isDark}
            onRoomPress={handleRoomPillPress}
          />

          {propertyScore.suggestions.length > 0 && (
            <ActionPlanCard
              suggestions={propertyScore.suggestions}
              totalCost={propertyScore.totalEstimatedCost}
              completedCost={propertyScore.completedCost}
              completedCount={propertyScore.completedCount}
              totalCount={propertyScore.totalCount}
              projectId={project.id}
              propertyName={project.name}
              isDark={isDark}
            />
          )}

          <ROICard
            propertyScore={propertyScore}
            nightlyRate={project.nightlyRate}
            projectId={project.id}
            isDark={isDark}
          />
        </>
      )}

      {/* ── Seasonal section ── */}
      {!project.region || editingMeta ? (
        <View
          style={[
            s.seasonalCard,
            {
              backgroundColor: isDark
                ? "rgba(255,255,255,0.08)"
                : "rgba(0,0,0,0.04)",
            },
          ]}
        >
          <Text type="body" weight="bold" lightColor="black" darkColor="white">
            {editingMeta
              ? "Edit Location"
              : "Add Location for Seasonal Tips"}
          </Text>
          <Text
            type="sm"
            lightColor="black"
            darkColor="white"
            style={{ opacity: 0.5 }}
          >
            Get personalized recommendations based on your property location and
            season.
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
                <Text
                  type="sm"
                  weight="semibold"
                  style={{ color: "#007AFF" }}
                >
                  Cancel
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      ) : recommendation ? (
        <View
          style={[
            s.seasonalCard,
            {
              backgroundColor: isDark
                ? "rgba(255,255,255,0.08)"
                : "rgba(0,0,0,0.04)",
            },
          ]}
        >
          <View style={s.seasonalHeader}>
            <Text
              type="body"
              weight="bold"
              lightColor="black"
              darkColor="white"
            >
              {recommendation.seasonLabel}
            </Text>
            <Pressable
              onPress={() => {
                setPickerRegion(project.region);
                setPickerHemisphere(project.hemisphere ?? "northern");
                setEditingMeta(true);
              }}
            >
              <Text type="sm" weight="semibold" style={{ color: "#007AFF" }}>
                Edit
              </Text>
            </Pressable>
          </View>
          <Text
            type="sm"
            lightColor="black"
            darkColor="white"
            style={{ opacity: 0.5 }}
          >
            {REGION_LABELS[project.region!]} · Updated{" "}
            {new Date(project.updatedAt).toLocaleDateString()}
          </Text>
          <View style={s.seasonalTags}>
            <View
              style={[
                s.seasonalTag,
                {
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.12)"
                    : "rgba(0,0,0,0.06)",
                },
              ]}
            >
              <Text
                type="caption"
                lightColor="black"
                darkColor="white"
              >
                {REDESIGN_STYLE_LABELS[recommendation.styles[0]]}
              </Text>
            </View>
            <View
              style={[
                s.seasonalTag,
                {
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.12)"
                    : "rgba(0,0,0,0.06)",
                },
              ]}
            >
              <Text
                type="caption"
                lightColor="black"
                darkColor="white"
              >
                {GUEST_TYPE_LABELS[recommendation.guestType]}
              </Text>
            </View>
          </View>
          <Text
            type="sm"
            lightColor="black"
            darkColor="white"
            style={{ opacity: 0.7, lineHeight: 18 }}
          >
            {recommendation.tip}
          </Text>
          <View style={s.urgencyRow}>
            <View
              style={[
                s.urgencyDot,
                {
                  backgroundColor:
                    recommendation.urgency === "fresh"
                      ? "#16A34A"
                      : recommendation.urgency === "due"
                      ? "#CA8A04"
                      : "#DC2626",
                },
              ]}
            />
            <Text
              type="caption"
              style={{
                color:
                  recommendation.urgency === "fresh"
                    ? "#16A34A"
                    : recommendation.urgency === "due"
                    ? "#CA8A04"
                    : "#DC2626",
                flex: 1,
              }}
            >
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

      {/* ── Redesign Grid (grouped by room) ── */}
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
      ) : roomGroups.length > 0 ? (
        <View style={s.groupedSection}>
          {roomGroups.map((group) => (
            <View key={group.roomType}>
              <RoomGroupHeader group={group} isDark={isDark} />
              <View style={s.grid}>
                {group.entries.map((entry) => (
                  <RedesignCard
                    key={entry.id}
                    entry={entry}
                    onPress={() => setSelectedEntry(entry)}
                  />
                ))}
              </View>
            </View>
          ))}
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
  // Dashboard
  dashboardCard: {
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.MD,
    gap: SPACING.SM,
    marginTop: SPACING.SM,
  },
  scoreCenter: {
    alignItems: "center",
    gap: 2,
  },
  roomBreakdownRow: {
    flexDirection: "row",
    gap: SPACING.SM,
    paddingVertical: SPACING.XS,
  },
  roomPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.FULL,
  },
  // Action plan
  actionPlanHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressBarBg: {
    height: 6,
    backgroundColor: "rgba(128,128,128,0.2)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: 6,
    backgroundColor: "#22C55E",
    borderRadius: 3,
  },
  actionGroup: {
    gap: 4,
    marginTop: SPACING.SM,
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 4,
    paddingVertical: 2,
  },
  // ROI
  roiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.SM,
  },
  roiItem: {
    width: "46%" as any,
    alignItems: "center",
    gap: 2,
    paddingVertical: SPACING.SM,
  },
  // Insight
  insightBanner: {
    paddingVertical: 4,
  },
  insightText: {
    color: "#9CA3AF",
    fontStyle: "italic",
  },
  // Room groups
  groupedSection: {
    marginTop: SPACING.MD,
    gap: SPACING.MD,
  },
  roomGroupHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.SM,
    marginBottom: SPACING.XS,
  },
  improvementBadge: {
    backgroundColor: "rgba(34,197,94,0.15)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  progressDots: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  // Grid
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: GRID_GAP,
  },
  gridImage: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: BORDER_RADIUS.MD,
  },
  scoreBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.FULL,
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
  rescanSection: {
    paddingHorizontal: SPACING.MD,
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
