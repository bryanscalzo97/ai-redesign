import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { SPACING, BORDER_RADIUS } from "@/constants/designTokens";
import { findStyleByKey, findRoomTypeByKey, findGuestTypeByKey } from "@/constants/redesign-data";
import { useAccentColor } from "@/hooks/useAccentColor";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useTranslation } from "react-i18next";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HEADER_HEIGHT = 420;
const screenWidth = Dimensions.get("window").width;
const GALLERY_SIZE = (screenWidth - SPACING.MD * 2 - 12) / 2;

export default function StyleDetailScreen() {
  const { key, type } = useLocalSearchParams<{ key: string; type: "style" | "room" | "guest" }>();
  const router = useRouter();
  const { getBackgroundColor } = useAccentColor();
  const backgroundColor = getBackgroundColor();
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const isDark = colorScheme === "dark";
  const { t } = useTranslation();

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const translateY =
      scrollOffset.value <= 0
        ? interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0],
            [-HEADER_HEIGHT / 2, 0]
          )
        : 0;

    const scale =
      scrollOffset.value <= 0
        ? interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0], [2, 1])
        : 1;

    return {
      transform: [{ translateY }, { scale }],
    };
  });

  const data =
    type === "guest"
      ? findGuestTypeByKey(key ?? "")
      : type === "room"
        ? findRoomTypeByKey(key ?? "")
        : findStyleByKey(key ?? "");

  if (!data) {
    return (
      <View style={[s.center, { backgroundColor }]}>
        <Text type="body">{t("notFound.message")}</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: data.label }} />
      <View style={[s.container, { backgroundColor }]}>
        <Animated.ScrollView
          ref={scrollRef}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic"
        >
          {/* Parallax Header */}
          <Animated.View style={[s.header, headerAnimatedStyle]}>
            <Image
              source={{ uri: data.image }}
              style={s.headerImage}
              contentFit="cover"
              transition={1000}
            />
          </Animated.View>

          {/* Gradient overlay with title */}
          <View style={s.headerOverlay}>
            <View style={s.headerContent}>
              <Text type="4xl" weight="bold" style={{ color: isDark ? "#fff" : "#000" }}>
                {data.label}
              </Text>
              <Text type="default" weight="normal" style={{ opacity: 0.7 }}>
                {type === "guest" ? "Guest Type" : type === "room" ? "Space Type" : "Listing Style"}
              </Text>
            </View>
          </View>

          {/* Description */}
          <View style={s.section}>
            <Text
              type="body"
              weight="normal"
              style={{
                lineHeight: 24,
                color: isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.7)",
              }}
            >
              {data.description}
            </Text>
          </View>

          {/* CTA */}
          <View style={s.ctaSection}>
            <Button
              title={`Redesign with ${data.label}`}
              onPress={() => router.push("/(tabs)/camera")}
              variant="solid"
              size="lg"
              radius="full"
              symbol="wand.and.stars"
            />
          </View>

          {/* Gallery */}
          {data.gallery.length > 0 && (
            <View style={s.section}>
              <Text
                type="lg"
                weight="bold"
                lightColor="black"
                darkColor="white"
                style={{ marginBottom: 12 }}
              >
                {t("common.inspiration", { defaultValue: "Inspiration" })}
              </Text>
              <View style={s.galleryGrid}>
                {data.gallery.map((uri, i) => (
                  <Image
                    key={i}
                    source={{ uri }}
                    style={s.galleryImage}
                    contentFit="cover"
                    transition={800}
                  />
                ))}
              </View>
            </View>
          )}

          <View style={{ height: insets.bottom + 32 }} />
        </Animated.ScrollView>
      </View>
    </>
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
  header: {
    height: HEADER_HEIGHT,
    overflow: "hidden",
  },
  headerImage: {
    width: "100%",
    height: HEADER_HEIGHT,
  },
  headerOverlay: {
    position: "absolute",
    width: "100%",
    height: HEADER_HEIGHT,
    backgroundColor: "transparent",
    experimental_backgroundImage:
      "linear-gradient(to bottom, transparent 40%, var(--background, rgba(0,0,0,0.9)))",
  },
  headerContent: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: SPACING.MD,
    paddingBottom: 8,
    gap: 4,
  },
  section: {
    paddingHorizontal: SPACING.MD,
    marginTop: 20,
  },
  ctaSection: {
    paddingHorizontal: SPACING.MD,
    marginTop: 24,
  },
  galleryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  galleryImage: {
    width: GALLERY_SIZE,
    height: GALLERY_SIZE,
    borderRadius: BORDER_RADIUS.MD,
  },
});
