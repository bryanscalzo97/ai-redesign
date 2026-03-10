import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { useAccentColor } from "@/hooks/useAccentColor";
import { SPACING } from "@/constants/designTokens";
import { shareBase64Image } from "@/lib/share-image";
import { Image } from "expo-image";
import * as MediaLibrary from "expo-media-library";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  View,
} from "react-native";

export function RedesignDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getBackgroundColor } = useAccentColor();
  const backgroundColor = getBackgroundColor();

  const [asset, setAsset] = useState<MediaLibrary.Asset | null>(null);
  const [assetInfo, setAssetInfo] = useState<MediaLibrary.AssetInfo | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("No redesign ID provided");
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
          setError("Redesign not found");
          setIsLoading(false);
          return;
        }
        setAsset({ ...assets[0], ...info } as MediaLibrary.Asset);
        setAssetInfo(info);
      } catch {
        setError("Failed to load redesign");
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
        dialogTitle: "Share your redesign",
      });
    } catch (err) {
      if (err instanceof Error && err.message.includes("cancel")) return;
      Alert.alert("Share failed", "Could not share the image.");
    }
  }, [assetInfo]);

  const handleDelete = useCallback(async () => {
    if (!id) return;

    Alert.alert("Delete Redesign", "Are you sure? This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await MediaLibrary.deleteAssetsAsync([id]);
            router.back();
          } catch {
            Alert.alert("Error", "Failed to delete the redesign.");
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
          {error || "Redesign not found"}
        </Text>
        <Button
          title="Go Back"
          onPress={() => router.back()}
          variant="outline"
          size="lg"
        />
      </View>
    );
  }

  const createdAt = new Date(assetInfo.creationTime * 1000);

  return (
    <View style={[styles.container, { backgroundColor }]}>
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
          title="Share"
          onPress={handleShare}
          variant="outline"
          size="lg"
          symbol="square.and.arrow.up"
          style={styles.actionButton}
        />
        <Button
          title="Delete"
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
