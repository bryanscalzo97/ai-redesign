import { useAccentColor } from "@/hooks/useAccentColor";
import { useColorScheme } from "@/hooks/useColorScheme";
import { UIColor } from "@/types/ui";
import { getColorValue } from "@/utils/colorUtils";
import { FlashList } from "@shopify/flash-list";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";

const COLOR_FAMILIES: UIColor[] = [
  "slate",
  "gray",
  "zinc",
  "neutral",
  "stone",
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
];

type SwitchThemeProps = {
  size?: number;
  onChange?: (hex: string | null) => void;
  includeSystemOption?: boolean;
};

export function SwitchTheme({
  size = 36,
  onChange,
  includeSystemOption = true,
}: SwitchThemeProps) {
  const scheme = (useColorScheme() ?? "light") as "light" | "dark";
  const shade = scheme === "dark" ? 400 : 500;
  const { setAccentHex, accentHex } = useAccentColor();
  const animatedValues = useRef<{ [key: string]: Animated.Value }>({});

  const data = useMemo(() => {
    const list = COLOR_FAMILIES.map((family) => ({
      key: family,
      family,
      hex: getColorValue(family, shade),
    }));
    if (includeSystemOption) {
      return [
        { key: "system", family: null as UIColor | null, hex: "transparent" },
        ...list,
      ];
    }
    return list;
  }, [shade, includeSystemOption]);

  useEffect(() => {
    data.forEach((item) => {
      if (!animatedValues.current[item.key]) {
        animatedValues.current[item.key] = new Animated.Value(1);
      }
    });
  }, [data]);

  useEffect(() => {
    data.forEach((item) => {
      const isSelected = item.family
        ? getColorValue(item.family, scheme === "dark" ? 400 : 500) ===
          accentHex
        : accentHex === null;
      const targetScale = isSelected ? 0.85 : 1;

      Animated.spring(animatedValues.current[item.key], {
        toValue: targetScale,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    });
  }, [accentHex, data, scheme]);

  const renderItem = useCallback(
    ({
      item,
    }: {
      item: { key: string; family: UIColor | null; hex: string };
    }) => {
      return (
        <Animated.View
          style={{
            transform: [
              {
                scale:
                  animatedValues.current[item.key] || new Animated.Value(1),
              },
            ],
          }}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              item.family ? `${item.family} theme` : "System accent"
            }
            onPress={() => {
              if (item.family) {
                const accentColor = getColorValue(
                  item.family,
                  scheme === "dark" ? 400 : 500
                );
                setAccentHex(accentColor);
                onChange?.(accentColor);
              } else {
                setAccentHex(null);
                onChange?.(null);
              }
            }}
            style={[
              styles.swatch,
              {
                width: size,
                height: size,
                borderRadius: size / 3,
                backgroundColor: item.family ? item.hex : "transparent",
              },
            ]}
          >
            {!item.family && (
              <View style={[styles.system, { borderRadius: size / 3 - 3 }]} />
            )}
          </Pressable>
        </Animated.View>
      );
    },
    [onChange, setAccentHex, size, accentHex, scheme]
  );

  return (
    <FlashList
      horizontal
      data={data}
      keyExtractor={(i) => i.key}
      renderItem={renderItem}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.list}
      ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
      estimatedItemSize={size}
    />
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: 8 },
  swatch: {
    alignItems: "center",
    justifyContent: "center",
  },
  system: {
    width: "90%",
    height: "90%",
    borderWidth: 1,
    borderColor: "#00000020",
    backgroundColor: "#ffffff",
  },
});
