import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { useAccentColor } from "@/hooks/useAccentColor";
import { SPACING, BORDER_RADIUS } from "@/constants/designTokens";
import { ALBUM_NAME } from "@/lib/save-to-library";
import { Image } from "expo-image";
import * as MediaLibrary from "expo-media-library";
import { useRouter } from "expo-router";
import { useRedesignCreation } from "@/context/RedesignCreationContext";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";

const NUM_COLUMNS = 3;
const GRID_GAP = SPACING.XS;
const screenWidth = Dimensions.get("window").width;
const itemSize =
  (screenWidth - SPACING.MD * 2 - GRID_GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS;

type PermissionState = "loading" | "undetermined" | "denied" | "granted";

export function RedesignHistory() {
  const { t } = useTranslation();
  const { getBackgroundColor } = useAccentColor();
  const backgroundColor = getBackgroundColor();
  const router = useRouter();
  const { saveCount } = useRedesignCreation();

  const [permissionState, setPermissionState] =
    useState<PermissionState>("loading");
  const [assets, setAssets] = useState<MediaLibrary.Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const checkPermission = useCallback(async () => {
    const { status } = await MediaLibrary.getPermissionsAsync();
    if (status === "granted") {
      setPermissionState("granted");
    } else if (status === "denied") {
      setPermissionState("denied");
    } else {
      setPermissionState("undetermined");
    }
  }, []);

  const requestPermission = useCallback(async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    setPermissionState(status === "granted" ? "granted" : "denied");
  }, []);

  const loadAssets = useCallback(async () => {
    try {
      const album = await MediaLibrary.getAlbumAsync(ALBUM_NAME);
      if (!album) {
        setAssets([]);
        return;
      }
      const { assets: albumAssets } = await MediaLibrary.getAssetsAsync({
        album,
        sortBy: [MediaLibrary.SortBy.creationTime],
        mediaType: ["photo"],
        first: 100,
      });
      setAssets(albumAssets);
    } catch {
      setAssets([]);
    }
  }, []);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  useEffect(() => {
    if (permissionState === "granted") {
      setIsLoading(true);
      loadAssets().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [permissionState, loadAssets]);

  // Reload when a new image is saved anywhere in the app
  useEffect(() => {
    if (saveCount > 0 && permissionState === "granted") {
      loadAssets();
    }
  }, [saveCount, permissionState, loadAssets]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadAssets();
    setIsRefreshing(false);
  }, [loadAssets]);

  const handleAssetPress = useCallback(
    (asset: MediaLibrary.Asset) => {
      router.push({
        pathname: "/(tabs)/redesigns/details",
        params: { id: asset.id },
      });
    },
    [router]
  );

  // Loading
  if (isLoading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Permission: undetermined
  if (permissionState === "undetermined") {
    return (
      <View style={[styles.centerContainer, { backgroundColor }]}>
        <Text
          type="body"
          weight="semibold"
          lightColor="black"
          darkColor="white"
          style={styles.messageText}
        >
          {t("redesignHistory.allowPhotoAccess")}
        </Text>
        <Button
          title={t("redesignHistory.allowAccess")}
          onPress={requestPermission}
          variant="solid"
          size="lg"
        />
      </View>
    );
  }

  // Permission: denied
  if (permissionState === "denied") {
    return (
      <View style={[styles.centerContainer, { backgroundColor }]}>
        <Text
          type="body"
          weight="semibold"
          lightColor="black"
          darkColor="white"
          style={styles.messageText}
        >
          {t("redesignHistory.photoAccessRequired")}
        </Text>
      </View>
    );
  }

  // Empty state
  if (assets.length === 0) {
    return (
      <View style={[styles.centerContainer, { backgroundColor }]}>
        <Text
          type="body"
          weight="semibold"
          lightColor="black"
          darkColor="white"
          style={styles.messageText}
        >
          {t("redesignHistory.noRedesignsYet")}
        </Text>
        <Text
          type="caption"
          weight="normal"
          lightColor="black"
          darkColor="white"
          style={styles.messageSubtext}
        >
          {t("redesignHistory.savedRedesignsHere")}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={assets}
      numColumns={NUM_COLUMNS}
      keyExtractor={(item) => item.id}
      style={[styles.list, { backgroundColor }]}
      contentContainerStyle={styles.listContent}
      columnWrapperStyle={styles.row}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
      }
      renderItem={({ item }) => (
        <Pressable onPress={() => handleAssetPress(item)}>
          <Image
            source={{ uri: item.uri }}
            style={styles.gridImage}
            contentFit="cover"
            recyclingKey={item.id}
          />
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING.LG,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: SPACING.MD,
  },
  row: {
    gap: GRID_GAP,
    marginBottom: GRID_GAP,
  },
  gridImage: {
    width: itemSize,
    height: itemSize,
    borderRadius: BORDER_RADIUS.SM,
  },
  messageText: {
    textAlign: "center",
    marginBottom: SPACING.SM,
  },
  messageSubtext: {
    textAlign: "center",
    opacity: 0.6,
  },
});
