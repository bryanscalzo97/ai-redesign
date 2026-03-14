import { SeasonalBanner } from "@/components/SeasonalBanner";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { SPACING, BORDER_RADIUS } from "@/constants/designTokens";
import { useAccentColor } from "@/hooks/useAccentColor";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AuthContext } from "@/context/AuthContext";
import { useProjects } from "@/context/ProjectContext";
import { useRedesignCreation } from "@/context/RedesignCreationContext";
import { ALBUM_NAME } from "@/lib/save-to-library";
import {
  REDESIGN_STYLE_LABELS,
  ROOM_TYPE_LABELS,
  GUEST_TYPE_LABELS,
  type RedesignStyle,
  type RoomType,
  type GuestType,
} from "@/types/redesign";
import { Image } from "expo-image";
import * as MediaLibrary from "expo-media-library";
import { Link, useRouter } from "expo-router";
import { use, useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

const CARD_WIDTH = 160;
const CARD_HEIGHT = 220;
const RECENT_SIZE = 120;

const STYLE_IMAGES: Partial<Record<RedesignStyle, string>> = {
  "hotel-boutique": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&q=80",
  "cozy-retreat": "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=400&q=80",
  "resort-style": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&q=80",
  "urban-lux": "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=400&q=80",
  "nordic-airbnb": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80",
  "instagram-worthy": "https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=400&q=80",
  "business-ready": "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=400&q=80",
  "family-friendly": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80",
  "budget-refresh": "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&q=80",
  "rustic-charm": "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=400&q=80",
};

const ROOM_IMAGES: Partial<Record<RoomType, string>> = {
  living: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&q=80",
  bedroom: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=400&q=80",
  kitchen: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80",
  bathroom: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=400&q=80",
  dining: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400&q=80",
  entryway: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80",
  outdoor: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&q=80",
  patio: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&q=80",
};

const GUEST_TYPE_IMAGES: Partial<Record<GuestType, string>> = {
  business: "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=400&q=80",
  couples: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&q=80",
  families: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80",
  "digital-nomads": "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&q=80",
};

function StyleCard({
  itemKey,
  label,
  imageUrl,
  type,
}: {
  itemKey: string;
  label: string;
  imageUrl: string;
  type: "style" | "room" | "guest";
}) {
  return (
    <Link
      href={{
        pathname: "/(tabs)/home/style-detail",
        params: { key: itemKey, type },
      }}
      asChild
    >
      <Pressable style={s.card}>
        <Link.AppleZoom>
          <Image
            source={{ uri: imageUrl }}
            style={s.cardImageFlat}
            contentFit="cover"
            transition={800}
          />
        </Link.AppleZoom>
        <View style={s.cardGradient} />
        <View style={s.cardLabel}>
          <Text type="sm" weight="bold" style={{ color: "#fff" }}>
            {label}
          </Text>
        </View>
      </Pressable>
    </Link>
  );
}

export function Home() {
  const { getBackgroundColor } = useAccentColor();
  const backgroundColor = getBackgroundColor();
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { isAuthenticated } = use(AuthContext);
  const { projects } = useProjects();
  const { saveCount } = useRedesignCreation();

  const [recentAssets, setRecentAssets] = useState<MediaLibrary.Asset[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isDark = colorScheme === "dark";
  const textColor = isDark ? "#fff" : "#000";

  const loadRecentAssets = useCallback(async () => {
    try {
      const { status } = await MediaLibrary.getPermissionsAsync();
      if (status !== "granted") return;
      const album = await MediaLibrary.getAlbumAsync(ALBUM_NAME);
      if (!album) return;
      const { assets } = await MediaLibrary.getAssetsAsync({
        album,
        sortBy: [MediaLibrary.SortBy.creationTime],
        mediaType: ["photo"],
        first: 10,
      });
      setRecentAssets(assets);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    loadRecentAssets();
  }, [loadRecentAssets, saveCount]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadRecentAssets();
    setIsRefreshing(false);
  }, [loadRecentAssets]);

  const redesignStyles = Object.keys(REDESIGN_STYLE_LABELS) as RedesignStyle[];
  const roomTypes = Object.keys(ROOM_TYPE_LABELS) as RoomType[];
  const guestTypes = Object.keys(GUEST_TYPE_LABELS) as GuestType[];

  const seasonalProjects = projects.filter((p) => p.region && p.hemisphere);
  const hasProjectsWithoutMeta = projects.length > 0 && seasonalProjects.length === 0;

  return (
    <ScrollView
      style={[s.container, { backgroundColor }]}
      contentContainerStyle={s.content}
      contentInsetAdjustmentBehavior="always"
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Hero CTA */}
      <Pressable
        onPress={() => router.push("/(tabs)/camera")}
        style={[s.heroCta, { backgroundColor: isDark ? "#fff" : "#000" }]}
      >
        <Text type="lg" weight="bold" style={{ color: isDark ? "#000" : "#fff" }}>
          Boost Your Bookings
        </Text>
        <Text type="sm" style={{ color: isDark ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.6)" }}>
          Scan your space and optimize it for more bookings
        </Text>
      </Pressable>

      {/* Seasonal Recommendations */}
      {seasonalProjects.length > 0 && (
        <View style={s.section}>
          <Text type="lg" weight="bold" style={{ color: textColor, paddingHorizontal: SPACING.MD }}>
            Seasonal Recommendations
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.carousel}
          >
            {seasonalProjects.map((p) => (
              <SeasonalBanner key={p.id} project={p} isDark={isDark} />
            ))}
          </ScrollView>
        </View>
      )}
      {hasProjectsWithoutMeta && (
        <Pressable
          onPress={() => router.push("/(tabs)/redesigns")}
          style={[s.seasonalPrompt, { backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.03)" }]}
        >
          <Text type="sm" style={{ color: textColor, opacity: 0.6, textAlign: "center" }}>
            Add location details to your properties for seasonal tips
          </Text>
        </Pressable>
      )}

      {/* Recent Redesigns */}
      {recentAssets.length > 0 && (
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Text type="lg" weight="bold" style={{ color: textColor }}>
              Recent Redesigns
            </Text>
            <Pressable onPress={() => router.push("/(tabs)/redesigns")}>
              <Text type="sm" weight="semibold" style={{ opacity: 0.5, color: textColor }}>
                See all
              </Text>
            </Pressable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.carousel}
          >
            {recentAssets.map((asset) => (
              <Pressable
                key={asset.id}
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/redesigns/details",
                    params: { id: asset.id },
                  })
                }
              >
                <Image
                  source={{ uri: asset.uri }}
                  style={s.recentImage}
                  contentFit="cover"
                  recyclingKey={asset.id}
                  transition={600}
                />
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Styles */}
      <View style={s.section}>
        <Text type="lg" weight="bold" style={{ color: textColor, paddingHorizontal: SPACING.MD }}>
          Top Performing Styles
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.carousel}
        >
          {redesignStyles.map((key) => (
            <StyleCard
              key={key}
              itemKey={key}
              label={REDESIGN_STYLE_LABELS[key]}
              imageUrl={STYLE_IMAGES[key]!}
              type="style"
            />
          ))}
        </ScrollView>
      </View>

      {/* Spaces */}
      <View style={s.section}>
        <Text type="lg" weight="bold" style={{ color: textColor, paddingHorizontal: SPACING.MD }}>
          Spaces
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.carousel}
        >
          {roomTypes.map((key) => (
            <StyleCard
              key={key}
              itemKey={key}
              label={ROOM_TYPE_LABELS[key]}
              imageUrl={ROOM_IMAGES[key]!}
              type="room"
            />
          ))}
        </ScrollView>
      </View>

      {/* By Guest Type */}
      <View style={s.section}>
        <Text type="lg" weight="bold" style={{ color: textColor, paddingHorizontal: SPACING.MD }}>
          By Guest Type
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.carousel}
        >
          {guestTypes.map((key) => (
            <StyleCard
              key={key}
              itemKey={key}
              label={GUEST_TYPE_LABELS[key]}
              imageUrl={GUEST_TYPE_IMAGES[key]!}
              type="guest"
            />
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 32,
  },
  heroCta: {
    marginHorizontal: SPACING.MD,
    marginTop: SPACING.MD,
    borderRadius: BORDER_RADIUS.LG,
    paddingVertical: 24,
    paddingHorizontal: 20,
    gap: 4,
  },
  section: {
    marginTop: 28,
    gap: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.MD,
  },
  carousel: {
    paddingHorizontal: SPACING.MD,
    gap: 12,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
  },
  cardImageFlat: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 16,
  },
  cardGradient: {
    ...StyleSheet.absoluteFillObject,
    experimental_backgroundImage:
      "linear-gradient(to bottom, transparent 40%, rgba(0, 0, 0, 0.85))",
  },
  cardLabel: {
    position: "absolute",
    bottom: 12,
    left: 12,
    right: 12,
  },
  recentImage: {
    width: RECENT_SIZE,
    height: RECENT_SIZE,
    borderRadius: BORDER_RADIUS.MD,
  },
  seasonalPrompt: {
    marginHorizontal: SPACING.MD,
    marginTop: 28,
    borderRadius: BORDER_RADIUS.LG,
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.MD,
  },
});
