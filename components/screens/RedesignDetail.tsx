import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { useAccentColor } from "@/hooks/useAccentColor";
import { SPACING } from "@/constants/designTokens";
import { shareBase64Image } from "@/lib/share-image";
import { Image } from "expo-image";
import * as MediaLibrary from "expo-media-library";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function RedesignDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const { getBackgroundColor } = useAccentColor();
  const backgroundColor = getBackgroundColor();
  const insets = useSafeAreaInsets();

  const [asset, setAsset] = useState<MediaLibrary.Asset | null>(null);
  const [assetInfo, setAssetInfo] = useState<MediaLibrary.AssetInfo | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError(t("redesignDetail.noIdProvided"));
      setIsLoading(false);
      return;
    }

    (async () => {
      try {
        const { assets } = await MediaLibrary.getAssetsAsync({
          first: 1,
          sortBy: [MediaLibrary.SortBy.creationTime],
        });
        // getAssetInfoAsync gives us the full local URI
        const info = await MediaLibrary.getAssetInfoAsync(id);
        if (!info) {
          setError(t("redesignDetail.redesignNotFound"));
          setIsLoading(false);
          return;
        }
        setAsset({ ...assets[0], ...info } as MediaLibrary.Asset);
        setAssetInfo(info);
      } catch {
        setError(t("redesignDetail.failedToLoad"));
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id]);

  const handleShare = useCallback(async () => {
    if (!assetInfo?.localUri && !assetInfo?.uri) return;
    try {
      // Use expo-sharing with the local file URI
      const { shareAsync } = await import("expo-sharing");
      await shareAsync(assetInfo.localUri || assetInfo.uri, {
        mimeType: "image/png",
        dialogTitle: t("redesignDetail.shareYourRedesign"),
      });
    } catch (err) {
      if (err instanceof Error && err.message.includes("cancel")) return;
      Alert.alert(t("redesignResult.shareFailed"), t("redesignResult.couldNotShare"));
    }
  }, [assetInfo]);

  const handleDelete = useCallback(async () => {
    if (!id) return;

    Alert.alert(t("redesignDetail.deleteRedesign"), t("redesignDetail.deleteConfirm"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("common.delete"),
        style: "destructive",
        onPress: async () => {
          try {
            await MediaLibrary.deleteAssetsAsync([id]);
            router.back();
          } catch {
            Alert.alert(t("common.error"), t("redesignDetail.failedToDelete"));
          }
        },
      },
    ]);
  }, [id, router]);

  if (isLoading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !assetInfo) {
    return (
      <View style={[styles.centerContainer, { backgroundColor }]}>
        <Text
          type="body"
          weight="semibold"
          lightColor="black"
          darkColor="white"
          style={styles.errorText}
        >
          {error || t("redesignDetail.redesignNotFound")}
        </Text>
        <Button
          title={t("redesignDetail.goBack")}
          onPress={() => router.back()}
          variant="outline"
          size="lg"
        />
      </View>
    );
  }

  const createdAt = new Date(assetInfo.creationTime * 1000);

  return (
    <View style={[styles.container, { backgroundColor, paddingBottom: insets.bottom + 80 }]}>
      <Image
        source={{ uri: assetInfo.localUri || assetInfo.uri }}
        style={styles.image}
        contentFit="contain"
        transition={300}
      />

      <View style={styles.meta}>
        <Text
          type="caption"
          weight="normal"
          lightColor="black"
          darkColor="white"
          style={styles.metaText}
        >
          {createdAt.toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}{" "}
          ·{" "}
          {assetInfo.width}×{assetInfo.height}
        </Text>
      </View>

      <View style={styles.actions}>
        <Button
          title={t("common.share")}
          onPress={handleShare}
          variant="outline"
          size="lg"
          symbol="square.and.arrow.up"
          style={styles.actionButton}
        />
        <Button
          title={t("common.delete")}
          onPress={handleDelete}
          variant="outline"
          size="lg"
          symbol="trash"
          style={styles.actionButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING.LG,
  },
  image: {
    flex: 1,
    width: "100%",
  },
  meta: {
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
  },
  metaText: {
    textAlign: "center",
    opacity: 0.6,
  },
  actions: {
    flexDirection: "row",
    gap: SPACING.SM,
    paddingHorizontal: SPACING.MD,
    paddingBottom: SPACING.LG,
  },
  actionButton: {
    flex: 1,
  },
  errorText: {
    textAlign: "center",
    marginBottom: SPACING.MD,
  },
});
