import { useTranslation } from "react-i18next";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { RegionPicker } from "@/components/RegionPicker";
import { Button } from "@/components/ui/Button";
import { ScalePress } from "@/components/ui/ScalePress";
import { Text } from "@/components/ui/Text";
import { SPACING, BORDER_RADIUS } from "@/theme/dimensions";
import { REGION_LABELS } from "@/constants/seasonal-tips";
import {
  surface,
  accent,
  getScoreCategory,
  getScoreLabel,
  textMuted,
} from "@/theme/semantic";
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
  GUEST_TYPE_LABELS,
} from "@/types/redesign";
import type { Project, RedesignEntry } from "@/types/project";
import type { PropertyRegion, Hemisphere, Urgency } from "@/types/seasonal";
import { Image } from "expo-image";
import { File as ExpoFile } from "expo-file-system";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

async function readFileAsBase64(uri: string): Promise<string> {
  const file = new ExpoFile(uri);
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function scoreColor(score: number): string {
  return getScoreCategory(score).bg;
}

// ─── Insight Banner ─────────────────────────────────────────────────────────
function InsightBanner({ text, isDark }: { text: string; isDark: boolean }) {
  return (
    <View
      style={[
        s.insightBanner,
        {
          backgroundColor: isDark
            ? "rgba(255,255,255,0.05)"
            : "rgba(0,0,0,0.03)",
        },
      ]}
    >
      <Text type="caption" weight="medium" style={{ color: isDark ? textMuted.dark : textMuted.light }}>
        {text}
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
  const { t } = useTranslation();
  return (
    <ScalePress onPress={onPress}>
      <View>
        <Image
          source={{ uri: entry.afterImagePath }}
          style={s.gridImage}
          contentFit="cover"
          transition={600}
        />
        <View
          style={[
            s.scoreBadge,
            {
              backgroundColor: entry.roomAnalysis
                ? scoreColor(entry.roomAnalysis.score)
                : "rgba(0,0,0,0.5)",
            },
          ]}
        >
          <Text type="caption" weight="bold" style={{ color: "#fff" }}>
            {entry.roomAnalysis ? entry.roomAnalysis.score.toFixed(1) : "..."}
          </Text>
        </View>
      </View>
      <Text
        type="caption"
        lightColor="black"
        darkColor="white"
        style={{ marginTop: 4, opacity: 0.6 }}
        numberOfLines={1}
      >
        {t(`redesignStyles.${entry.style}`)} ·{" "}
        {t(`roomTypes.${entry.roomType}`)}
      </Text>
    </ScalePress>
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
  const { t } = useTranslation();
  const { updateRedesignListingText, updateRedesignAnalysis } = useProjects();
  const [listingText, setListingText] = useState(entry.listingText || "");
  const [isGeneratingText, setIsGeneratingText] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const handleAnalyze = useCallback(async () => {
    setIsAnalyzing(true);
    try {
      let imageBase64: string | undefined;
      try {
        imageBase64 = await readFileAsBase64(entry.beforeImagePath);
      } catch {
        try {
          imageBase64 = await readFileAsBase64(entry.afterImagePath);
        } catch {
          // ignore
        }
      }

      if (!imageBase64) {
        Alert.alert(t("common.error"), t("projectDetail.couldNotReadImage"));
        return;
      }

      const response = await fetch("/api/room-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_base64: imageBase64,
          roomType: entry.roomType,
          style: entry.style,
          guestType: entry.guestType,
        }),
      });
      const data = await response.json();
      if (data.success && data.analysis) {
        await updateRedesignAnalysis(projectId, entry.id, data.analysis);
        Alert.alert(
          t("projectDetail.analysisComplete"),
          t("projectDetail.analysisCompleteMsg", { score: data.analysis.score.toFixed(1), count: data.analysis.suggestions?.length ?? 0 }),
          [{ text: t("common.ok"), onPress: onClose }]
        );
      } else {
        Alert.alert(t("common.error"), data.error || t("projectDetail.failedAnalyze"));
      }
    } catch {
      Alert.alert(t("common.error"), t("projectDetail.failedConnect"));
    } finally {
      setIsAnalyzing(false);
    }
  }, [entry, projectId, updateRedesignAnalysis, onClose]);

  const handleGenerateText = useCallback(async () => {
    setIsGeneratingText(true);
    try {
      // Try to read the after-image and send as base64
      let imageBase64: string | undefined;
      try {
        imageBase64 = await readFileAsBase64(entry.afterImagePath);
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
        Alert.alert(t("common.error"), data.error || t("projectDetail.failedListingText"));
      }
    } catch {
      Alert.alert(t("common.error"), t("projectDetail.failedConnect"));
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
          {t(`redesignStyles.${entry.style}`)}
        </Text>
        <Text
          type="sm"
          lightColor="black"
          darkColor="white"
          style={{ opacity: 0.5 }}
        >
          {t(`roomTypes.${entry.roomType}`)} ·{" "}
          {new Date(entry.createdAt).toLocaleDateString()}
        </Text>
      </View>

      {/* Analyze / Re-scan */}
      <View style={s.rescanSection}>
        {!entry.roomAnalysis && (
          <Button
            title={isAnalyzing ? t("projectDetail.analyzing") : t("projectDetail.analyzeThisRoom")}
            onPress={handleAnalyze}
            disabled={isAnalyzing}
            variant="solid"
            size="lg"
            symbol="sparkle.magnifyingglass"
          />
        )}
        <Button
          title={t("projectDetail.rescan", { room: t(`roomTypes.${entry.roomType}`) })}
          onPress={handleRescan}
          variant="soft"
          size="md"
          symbol="camera.viewfinder"
        />
      </View>

      {/* Listing text section */}
      <View style={s.textSection}>
        <InsightBanner text={t("hostInsights.description")} isDark={isDark} />
        {listingText ? (
          <>
            <View style={s.textHeader}>
              <Text
                type="body"
                weight="bold"
                lightColor="black"
                darkColor="white"
              >
                {t("projectDetail.listingDescription")}
              </Text>
              <Pressable onPress={handleShare}>
                <Text
                  type="sm"
                  weight="semibold"
                  style={{ color: isDark ? accent.dark : accent.light }}
                >
                  {t("common.share")}
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
              title={t("common.regenerate")}
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
                  {t("projectDetail.writingDescription")}
                </Text>
              </View>
            ) : (
              <Button
                title={t("projectDetail.generateDescription")}
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
        title={t("projectDetail.backToProperty")}
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
  const { t } = useTranslation();
  return (
    <View
      style={[
        s.dashboardCard,
        {
          backgroundColor: isDark ? surface.dark : surface.light,
        },
      ]}
    >
      <InsightBanner text={t("hostInsights.score")} isDark={isDark} />
      <View style={s.scoreCenter}>
        <Text
          type="5xl"
          weight="bold"
          variant="serif"
          style={{ color: scoreColor(averageScore) }}
        >
          {averageScore.toFixed(1)}
        </Text>
        <Text
          type="sm"
          weight="semibold"
          style={{ color: scoreColor(averageScore) }}
        >
          {getScoreLabel(averageScore)}
        </Text>
        <Text
          type="caption"
          style={{ color: isDark ? textMuted.dark : textMuted.light }}
        >
          {t("projectDetail.basedOnRooms", { count: roomCount, rooms: roomCount === 1 ? t("common.room") : t("common.rooms") })}
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
  occupancyPercent,
  projectId,
  isDark,
}: {
  propertyScore: PropertyScore;
  nightlyRate: number | undefined;
  occupancyPercent: number | undefined;
  projectId: string;
  isDark: boolean;
}) {
  const { t } = useTranslation();
  const { updateProjectMeta } = useProjects();

  const handleSetRate = useCallback(() => {
    Alert.prompt(
      t("projectDetail.nightlyRate"),
      t("projectDetail.enterNightlyRate"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.save"),
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

  const handleSetOccupancy = useCallback(() => {
    Alert.prompt(
      t("projectDetail.currentOccupancy"),
      t("projectDetail.enterOccupancy"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.save"),
          onPress: (val: string | undefined) => {
            const pct = Number(val);
            if (pct > 0 && pct <= 100) {
              updateProjectMeta(projectId, { occupancyPercent: pct });
            }
          },
        },
      ],
      "plain-text",
      occupancyPercent?.toString() ?? "50",
      "number-pad"
    );
  }, [projectId, occupancyPercent, updateProjectMeta]);

  const roi = nightlyRate
    ? estimateROI(propertyScore, nightlyRate, occupancyPercent)
    : null;

  return (
    <View
      style={[
        s.dashboardCard,
        {
          backgroundColor: isDark ? surface.dark : surface.light,
        },
      ]}
    >
      <View style={s.actionPlanHeader}>
        <Text type="body" weight="bold" lightColor="black" darkColor="white">
          {t("projectDetail.roiEstimate")}
        </Text>
      </View>

      {/* Rate + Occupancy inputs */}
      <View style={s.roiInputRow}>
        <Pressable onPress={handleSetRate} style={s.roiInputChip}>
          <Text type="caption" lightColor="black" darkColor="white" style={{ opacity: 0.5 }}>
            {t("projectDetail.rate")}
          </Text>
          <Text type="sm" weight="semibold" style={{ color: isDark ? accent.dark : accent.light }}>
            {nightlyRate ? `$${nightlyRate}/night` : t("common.set")}
          </Text>
        </Pressable>
        <Pressable onPress={handleSetOccupancy} style={s.roiInputChip}>
          <Text type="caption" lightColor="black" darkColor="white" style={{ opacity: 0.5 }}>
            {t("projectDetail.occupancy")}
          </Text>
          <Text type="sm" weight="semibold" style={{ color: isDark ? accent.dark : accent.light }}>
            {occupancyPercent ? `${occupancyPercent}%` : "50%"}
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
              {t("projectDetail.moreBookings")}
            </Text>
          </View>
          <View style={s.roiItem}>
            <Text type="lg" weight="bold" style={{ color: "#22C55E" }}>
              +${roi.extraMonthlyRevenue}
            </Text>
            <Text type="caption" lightColor="black" darkColor="white" style={{ opacity: 0.5 }}>
              {t("projectDetail.extraPerMonth")}
            </Text>
          </View>
          <View style={s.roiItem}>
            <Text type="lg" weight="bold" lightColor="black" darkColor="white">
              {roi.paybackWeeks}w
            </Text>
            <Text type="caption" lightColor="black" darkColor="white" style={{ opacity: 0.5 }}>
              {t("projectDetail.payback")}
            </Text>
          </View>
          <View style={s.roiItem}>
            <Text type="lg" weight="bold" lightColor="black" darkColor="white">
              ${roi.investmentCost}
            </Text>
            <Text type="caption" lightColor="black" darkColor="white" style={{ opacity: 0.5 }}>
              {t("projectDetail.toInvest")}
            </Text>
          </View>
        </View>
      ) : (
        <Text type="sm" lightColor="black" darkColor="white" style={{ opacity: 0.5 }}>
          {nightlyRate
            ? t("projectDetail.noRoiData")
            : t("projectDetail.setRateForRoi")}
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
  const { t } = useTranslation();
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
          backgroundColor: isDark ? surface.dark : surface.light,
        },
      ]}
    >
      <InsightBanner text={t("hostInsights.actionPlan")} isDark={isDark} />
      <View style={s.actionPlanHeader}>
        <Text type="body" weight="bold" lightColor="black" darkColor="white">
          {t("projectDetail.actionPlan")}
        </Text>
        <Pressable onPress={handleExport}>
          <Text type="sm" weight="semibold" style={{ color: isDark ? accent.dark : accent.light }}>
            {t("common.share")}
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
  const { t } = useTranslation();
  const label = t(`roomTypes.${group.roomType}`);
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
  const { t } = useTranslation();
  const { getBackgroundColor } = useAccentColor();
  const backgroundColor = getBackgroundColor();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const {
    projects,
    deleteProject,
    updateProjectMeta,
    toggleSuggestionChecked,
    updateRedesignAnalysis,
  } = useProjects();
  const [selectedEntry, setSelectedEntry] = useState<RedesignEntry | null>(
    null
  );
  const [editingMeta, setEditingMeta] = useState(false);
  const [isAnalyzingAll, setIsAnalyzingAll] = useState(false);
  const [analyzeProgress, setAnalyzeProgress] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "plan" | "insights">("overview");
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
      t("projectDetail.deleteProperty"),
      t("projectDetail.deleteConfirm", { name: project.name }),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: async () => {
            await deleteProject(project.id);
            router.back();
          },
        },
      ]
    );
  }, [project, deleteProject, router]);

  const unanalyzedEntries = useMemo(
    () => project?.redesigns.filter((r) => !r.roomAnalysis) ?? [],
    [project]
  );

  const handleAnalyzeAll = useCallback(async () => {
    if (!project || unanalyzedEntries.length === 0) return;
    setIsAnalyzingAll(true);
    let done = 0;
    for (const entry of unanalyzedEntries) {
      done++;
      setAnalyzeProgress(`Analyzing ${done} of ${unanalyzedEntries.length}...`);
      try {
        let imageBase64: string | undefined;
        try {
          imageBase64 = await readFileAsBase64(entry.beforeImagePath);
        } catch {
          try {
            imageBase64 = await readFileAsBase64(entry.afterImagePath);
          } catch {
            // skip
          }
        }
        if (!imageBase64) continue;

        const response = await fetch("/api/room-analysis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image_base64: imageBase64,
            roomType: entry.roomType,
            style: entry.style,
            guestType: entry.guestType,
          }),
        });
        const data = await response.json();
        if (data.success && data.analysis) {
          await updateRedesignAnalysis(project.id, entry.id, data.analysis);
        }
      } catch {
        // continue with next
      }
    }
    setIsAnalyzingAll(false);
    setAnalyzeProgress("");
  }, [project, unanalyzedEntries, updateRedesignAnalysis]);

  const handleRoomPillPress = useCallback(
    (redesignId: string) => {
      const entry = project?.redesigns.find((r) => r.id === redesignId);
      if (entry) setSelectedEntry(entry);
    },
    [project]
  );

  // Auto-analyze unscored rooms on mount
  const autoAnalyzeTriggered = useRef(false);
  useEffect(() => {
    if (
      project &&
      unanalyzedEntries.length > 0 &&
      !isAnalyzingAll &&
      !autoAnalyzeTriggered.current
    ) {
      autoAnalyzeTriggered.current = true;
      handleAnalyzeAll();
    }
  }, [project, unanalyzedEntries.length, isAnalyzingAll, handleAnalyzeAll]);

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
        {project.redesigns.length === 1 ? "room" : "rooms"} scanned
        {project.totalRooms ? ` of ${project.totalRooms}` : ""}
        {" "}· Updated {new Date(project.updatedAt).toLocaleDateString()}
      </Text>
      {!project.totalRooms && project.redesigns.length > 0 && (
        <Pressable
          onPress={() => {
            Alert.prompt(
              "Total Rooms",
              "How many rooms does this property have?",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Save",
                  onPress: (val: string | undefined) => {
                    const n = Number(val);
                    if (n > 0 && n <= 20) {
                      updateProjectMeta(project.id, { totalRooms: n });
                    }
                  },
                },
              ],
              "plain-text",
              "",
              "number-pad"
            );
          }}
        >
          <Text type="caption" weight="semibold" style={{ color: isDark ? accent.dark : accent.light }}>
            Set total rooms for this property
          </Text>
        </Pressable>
      )}

      <Button
        title={t("projectDetail.scanNewRoom")}
        onPress={() =>
          router.push({
            pathname: "/(tabs)/camera",
            params: { saveToProjectId: project.id },
          })
        }
        variant="solid"
        size="lg"
        symbol="camera.viewfinder"
        radius="full"
        style={s.addButton as any}
      />

      {/* Auto-analyzing rooms indicator */}
      {isAnalyzingAll && (
        <View style={s.analyzeAllSection}>
          <View style={s.generatingRow}>
            <ActivityIndicator size="small" />
            <Text type="sm" lightColor="black" darkColor="white" style={{ opacity: 0.6 }}>
              {analyzeProgress}
            </Text>
          </View>
        </View>
      )}

      {/* ── Score summary (always visible) ── */}
      {propertyScore && (
        <DashboardScoreCard
          averageScore={propertyScore.averageScore}
          roomCount={propertyScore.rooms.length}
          isDark={isDark}
        />
      )}

      {/* ── Segmented control ── */}
      {propertyScore && (
        <View
          style={[
            s.segmentedControl,
            { backgroundColor: isDark ? surface.dark : surface.light },
          ]}
        >
          {(["overview", "plan", "insights"] as const).map((tab) => {
            const label = tab === "overview" ? "Rooms" : tab === "plan" ? "Action Plan" : "Insights";
            const active = activeTab === tab;
            return (
              <Pressable
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[
                  s.segment,
                  active && {
                    backgroundColor: isDark ? "#fff" : "#000",
                    borderRadius: BORDER_RADIUS.SM,
                  },
                ]}
              >
                <Text
                  type="sm"
                  weight={active ? "semibold" : "normal"}
                  style={{
                    color: active
                      ? isDark ? "#000" : "#fff"
                      : isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
                  }}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}

      {/* ── Tab: Rooms (Overview) ── */}
      {(!propertyScore || activeTab === "overview") && (
        <>
          {propertyScore && (
            <RoomBreakdownRow
              rooms={propertyScore.rooms}
              isDark={isDark}
              onRoomPress={handleRoomPillPress}
            />
          )}

      {/* ── Room grid ── */}
      {project.redesigns.length === 0 ? (
        <View style={s.emptyState}>
          <Text
            type="body"
            lightColor="black"
            darkColor="white"
            style={{ textAlign: "center", opacity: 0.5 }}
          >
            {t("projectDetail.noRoomsTitle")}
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
        </>
      )}

      {/* ── Tab: Action Plan ── */}
      {propertyScore && activeTab === "plan" && (
        <>
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
            occupancyPercent={project.occupancyPercent}
            projectId={project.id}
            isDark={isDark}
          />
        </>
      )}

      {/* ── Tab: Insights ── */}
      {propertyScore && activeTab === "insights" && (
        <>
          {/* Seasonal section */}
          {!project.region || editingMeta ? (
            <View
              style={[
                s.seasonalCard,
                {
                  backgroundColor: isDark ? surface.dark : surface.light,
                },
              ]}
            >
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
                <Button title="Save" onPress={handleSaveMeta} variant="solid" size="md" disabled={!pickerRegion} />
                {editingMeta && (
                  <Pressable onPress={() => setEditingMeta(false)}>
                    <Text type="sm" weight="semibold" style={{ color: isDark ? accent.dark : accent.light }}>Cancel</Text>
                  </Pressable>
                )}
              </View>
            </View>
          ) : recommendation ? (
            <View
              style={[
                s.seasonalCard,
                { backgroundColor: isDark ? surface.dark : surface.light },
              ]}
            >
              <View style={s.seasonalHeader}>
                <Text type="body" weight="bold" lightColor="black" darkColor="white">
                  {recommendation.seasonLabel}
                </Text>
                <Pressable onPress={() => { setPickerRegion(project.region); setPickerHemisphere(project.hemisphere ?? "northern"); setEditingMeta(true); }}>
                  <Text type="sm" weight="semibold" style={{ color: isDark ? accent.dark : accent.light }}>Edit</Text>
                </Pressable>
              </View>
              <Text type="sm" lightColor="black" darkColor="white" style={{ opacity: 0.5 }}>
                {REGION_LABELS[project.region!]} · Updated {new Date(project.updatedAt).toLocaleDateString()}
              </Text>
              <View style={s.seasonalTags}>
                <View style={[s.seasonalTag, { backgroundColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.06)" }]}>
                  <Text type="caption" lightColor="black" darkColor="white">{t(`redesignStyles.${recommendation.styles[0]}`)}</Text>
                </View>
                <View style={[s.seasonalTag, { backgroundColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.06)" }]}>
                  <Text type="caption" lightColor="black" darkColor="white">{GUEST_TYPE_LABELS[recommendation.guestType]}</Text>
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
              <Button title={`Refresh for ${recommendation.seasonLabel}`} onPress={handleRefreshSeasonal} variant="solid" size="md" symbol="camera.viewfinder" />
            </View>
          ) : null}

          {/* Listing texts overview */}
          {project.redesigns.filter((r) => r.listingText).length > 0 && (
            <View style={[s.dashboardCard, { backgroundColor: isDark ? surface.dark : surface.light }]}>
              <Text type="body" weight="bold" lightColor="black" darkColor="white">
                Listing Descriptions
              </Text>
              <Text type="caption" lightColor="black" darkColor="white" style={{ opacity: 0.5 }}>
                {project.redesigns.filter((r) => r.listingText).length} of {project.redesigns.length} rooms have descriptions
              </Text>
            </View>
          )}
        </>
      )}

      <Pressable onPress={handleDelete} style={s.deleteButton}>
        <Text type="sm" weight="semibold" style={{ color: "#DC2626" }}>
          {t("projectDetail.deleteProperty")}
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
  // Segmented control
  segmentedControl: {
    flexDirection: "row",
    marginTop: SPACING.SM,
    borderRadius: BORDER_RADIUS.MD,
    padding: 3,
  },
  segment: {
    flex: 1,
    paddingVertical: SPACING.SM,
    alignItems: "center",
    borderRadius: BORDER_RADIUS.SM - 2,
  },
  // Analyze all
  analyzeAllSection: {
    marginTop: SPACING.SM,
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
  roiInputRow: {
    flexDirection: "row",
    gap: SPACING.SM,
  },
  roiInputChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.MD,
    backgroundColor: "rgba(128,128,128,0.1)",
  },
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
    paddingVertical: SPACING.SM,
    paddingHorizontal: SPACING.SM,
    borderRadius: BORDER_RADIUS.SM,
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
    gap: SPACING.SM,
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
