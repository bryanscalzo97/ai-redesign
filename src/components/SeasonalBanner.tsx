import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { SPACING, BORDER_RADIUS } from "@/theme/dimensions";
import { REGION_LABELS } from "@/constants/seasonal-tips";
import { REDESIGN_STYLE_LABELS, GUEST_TYPE_LABELS } from "@/types/redesign";
import { getSeasonalRecommendation } from "@/lib/seasonal-engine";
import type { Project } from "@/types/project";
import type { Urgency } from "@/types/seasonal";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { useMemo } from "react";

const URGENCY_COLORS: Record<Urgency, string> = {
  fresh: "#16A34A",
  due: "#CA8A04",
  overdue: "#DC2626",
};

export function SeasonalBanner({
  project,
  isDark,
}: {
  project: Project;
  isDark: boolean;
}) {
  const router = useRouter();
  const { t } = useTranslation();

  const recommendation = useMemo(() => {
    if (!project.region || !project.hemisphere) return null;
    return getSeasonalRecommendation(
      project.region,
      project.hemisphere,
      new Date(),
      project.updatedAt
    );
  }, [project.region, project.hemisphere, project.updatedAt]);

  if (!recommendation) return null;

  const urgencyColor = URGENCY_COLORS[recommendation.urgency];
  const cardBg = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)";
  const textColor = isDark ? "#fff" : "#000";

  const handleRefresh = () => {
    router.push({
      pathname: "/(tabs)/camera",
      params: {
        prefillStyle: recommendation.styles[0],
        prefillGuest: recommendation.guestType,
        prefillRoom: recommendation.rooms[0],
      },
    });
  };

  return (
    <View style={[s.card, { backgroundColor: cardBg }]}>
      <View style={s.header}>
        <Text type="sm" weight="bold" style={{ color: textColor }} numberOfLines={1}>
          {project.name}
        </Text>
        <View style={[s.seasonBadge, { backgroundColor: `${urgencyColor}20` }]}>
          <Text type="caption" weight="semibold" style={{ color: urgencyColor }}>
            {recommendation.seasonLabel}
          </Text>
        </View>
      </View>

      <View style={s.tags}>
        <View style={[s.tag, { backgroundColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.06)" }]}>
          <Text type="caption" style={{ color: textColor }}>
            {t(`redesignStyles.${recommendation.styles[0]}`)}
          </Text>
        </View>
        <View style={[s.tag, { backgroundColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.06)" }]}>
          <Text type="caption" style={{ color: textColor }}>
            {t(`guestTypes.${recommendation.guestType}`)}
          </Text>
        </View>
      </View>

      <Text type="sm" style={{ color: textColor, opacity: 0.7, lineHeight: 18 }} numberOfLines={2}>
        {recommendation.tip}
      </Text>

      {/* Urgency bar */}
      <View style={s.urgencyRow}>
        <View style={[s.urgencyDot, { backgroundColor: urgencyColor }]} />
        <Text type="caption" style={{ color: urgencyColor, flex: 1 }}>
          {recommendation.urgencyMessage}
        </Text>
      </View>

      <Button
        title={t("seasonalBanner.refreshFor", { season: recommendation.seasonLabel })}
        onPress={handleRefresh}
        variant="solid"
        size="md"
        symbol="camera.viewfinder"
      />
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    width: 280,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.MD,
    gap: SPACING.SM,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: SPACING.SM,
  },
  seasonBadge: {
    paddingHorizontal: SPACING.SM,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.FULL,
  },
  tags: {
    flexDirection: "row",
    gap: SPACING.XS,
  },
  tag: {
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
});
