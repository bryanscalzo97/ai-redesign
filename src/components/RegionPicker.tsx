import { Text } from "@/components/ui/Text";
import { SPACING, BORDER_RADIUS } from "@/theme/dimensions";
import { REGION_LABELS, HEMISPHERE_LABELS } from "@/constants/seasonal-tips";
import type { PropertyRegion, Hemisphere } from "@/types/seasonal";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";

const REGIONS = Object.keys(REGION_LABELS) as PropertyRegion[];
const HEMISPHERES = Object.keys(HEMISPHERE_LABELS) as Hemisphere[];

export function RegionPicker({
  region,
  hemisphere,
  onRegionChange,
  onHemisphereChange,
  isDark = false,
}: {
  region: PropertyRegion | undefined;
  hemisphere: Hemisphere;
  onRegionChange: (r: PropertyRegion) => void;
  onHemisphereChange: (h: Hemisphere) => void;
  isDark?: boolean;
}) {
  const { t } = useTranslation();
  const chipBg = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)";
  const chipSelectedBg = isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.12)";
  const chipBorder = isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)";
  const chipSelectedBorder = isDark ? "#fff" : "#000";
  const textColor = isDark ? "#fff" : "#000";

  return (
    <View style={s.container}>
      <Text type="sm" weight="semibold" style={{ color: textColor, opacity: 0.6 }}>
        {t("projectDetail.propertyLocation")}
      </Text>
      <View style={s.row}>
        {REGIONS.map((r) => {
          const selected = region === r;
          return (
            <Pressable
              key={r}
              onPress={() => onRegionChange(r)}
              style={[
                s.chip,
                { backgroundColor: selected ? chipSelectedBg : chipBg, borderColor: selected ? chipSelectedBorder : chipBorder },
              ]}
            >
              <Text
                type="sm"
                weight={selected ? "semibold" : "normal"}
                style={{ color: textColor }}
              >
                {t(`regions.${r}`)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text type="sm" weight="semibold" style={{ color: textColor, opacity: 0.6, marginTop: SPACING.SM }}>
        {t("projectDetail.hemisphere")}
      </Text>
      <View style={s.row}>
        {HEMISPHERES.map((h) => {
          const selected = hemisphere === h;
          return (
            <Pressable
              key={h}
              onPress={() => onHemisphereChange(h)}
              style={[
                s.chip,
                { backgroundColor: selected ? chipSelectedBg : chipBg, borderColor: selected ? chipSelectedBorder : chipBorder },
              ]}
            >
              <Text
                type="sm"
                weight={selected ? "semibold" : "normal"}
                style={{ color: textColor }}
              >
                {t(`hemispheres.${h}`)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    gap: SPACING.SM,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.SM,
  },
  chip: {
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderRadius: BORDER_RADIUS.FULL,
    borderWidth: 1,
  },
});
