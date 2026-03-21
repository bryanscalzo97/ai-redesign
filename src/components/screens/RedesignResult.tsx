import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { useAccentColor } from "@/hooks/useAccentColor";
import { SPACING, BORDER_RADIUS } from "@/theme/dimensions";
import { useRedesignCreation } from "@/context/RedesignCreationContext";
import { saveBase64ToAlbum } from "@/lib/save-to-library";
import { shareBase64Image } from "@/lib/share-image";
import { Image } from "expo-image";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePlatform } from "@/hooks/usePlatform";

interface RedesignResultProps {
  generatedImage: string;
  isGenerating: boolean;
  error?: string;
  onGenerateAnother: () => void;
  onRetry: () => void;
}

export function RedesignResult({
  generatedImage,
  isGenerating,
  error,
  onGenerateAnother,
  onRetry,
}: RedesignResultProps) {
  const { getBackgroundColor } = useAccentColor();
  const backgroundColor = getBackgroundColor();
  const { isAndroid } = usePlatform();
  const { top } = useSafeAreaInsets();
  const { notifySave } = useRedesignCreation();
  const { t } = useTranslation();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = useCallback(async () => {
    if (!generatedImage) return;
    setIsSaving(true);
    try {
      await saveBase64ToAlbum(generatedImage, "png");
      notifySave();
      Alert.alert(t("redesignResult.saved"), t("redesignResult.savedToLibrary"));
    } catch (err) {
      Alert.alert(
        t("redesignResult.saveFailed"),
        err instanceof Error ? err.message : t("redesignResult.couldNotSave")
      );
    } finally {
      setIsSaving(false);
    }
  }, [generatedImage]);

  const handleShare = useCallback(async () => {
    if (!generatedImage) return;
    try {
      await shareBase64Image(generatedImage, "png");
    } catch (err) {
      // User cancelled share sheet — not an error
      if (err instanceof Error && err.message.includes("cancel")) return;
      Alert.alert(
        t("redesignResult.shareFailed"),
        err instanceof Error ? err.message : t("redesignResult.couldNotShare")
      );
    }
  }, [generatedImage]);

  if (isGenerating) {
    return (
      <View style={[styles.centerContainer, { backgroundColor }]}>
        <ActivityIndicator size="large" />
        <Text
          type="body"
          weight="semibold"
          lightColor="black"
          darkColor="white"
          style={styles.loadingText}
        >
          {t("redesignResult.redesigningRoom")}
        </Text>
        <Text
          type="caption"
          weight="normal"
          lightColor="black"
          darkColor="white"
          style={styles.loadingSubtext}
        >
          {t("redesignResult.mayTakeMoment")}
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centerContainer, { backgroundColor }]}>
        <Text
          type="lg"
          weight="semibold"
          lightColor="black"
          darkColor="white"
          style={styles.errorTitle}
        >
          {t("redesignResult.generationFailed")}
        </Text>
        <Text
          type="body"
          weight="normal"
          lightColor="black"
          darkColor="white"
          style={styles.errorMessage}
        >
          {error}
        </Text>
        <View style={styles.buttonGroup}>
          <Button
            title={t("common.retry")}
            onPress={onRetry}
            variant="solid"
            size="lg"
            symbol="arrow.clockwise"
          />
          <Button
            title={t("redesignResult.startOver")}
            onPress={onGenerateAnother}
            variant="outline"
            size="lg"
          />
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="always"
      style={[styles.container, { backgroundColor }]}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingTop: isAndroid ? top : 0 },
      ]}
    >
      <Text
        type="xl"
        weight="bold"
        lightColor="black"
        darkColor="white"
        style={styles.title}
      >
        {t("redesignResult.yourRedesignReady")}
      </Text>

      <Image
        source={{ uri: `data:image/png;base64,${generatedImage}` }}
        style={styles.resultImage}
        contentFit="cover"
        transition={300}
      />

      <View style={styles.actionRow}>
        <Button
          title={isSaving ? t("common.saving") : t("common.save")}
          onPress={handleSave}
          disabled={isSaving}
          variant="outline"
          size="lg"
          symbol="square.and.arrow.down"
          style={styles.actionButton}
        />
        <Button
          title={t("common.share")}
          onPress={handleShare}
          variant="outline"
          size="lg"
          symbol="square.and.arrow.up"
          style={styles.actionButton}
        />
      </View>

      <Button
        title={t("redesignResult.generateAnother")}
        onPress={onGenerateAnother}
        variant="solid"
        size="lg"
        symbol="wand.and.stars"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACING.MD,
  },
  contentContainer: {
    paddingBottom: SPACING.XL,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING.LG,
  },
  title: {
    textAlign: "center",
    marginBottom: SPACING.MD,
  },
  resultImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: BORDER_RADIUS.MD,
    overflow: "hidden",
  },
  actionRow: {
    flexDirection: "row",
    gap: SPACING.SM,
    marginTop: SPACING.LG,
    marginBottom: SPACING.SM,
  },
  actionButton: {
    flex: 1,
  },
  loadingText: {
    marginTop: SPACING.MD,
    textAlign: "center",
  },
  loadingSubtext: {
    marginTop: SPACING.SM,
    textAlign: "center",
    opacity: 0.6,
  },
  errorTitle: {
    textAlign: "center",
    marginBottom: SPACING.SM,
  },
  errorMessage: {
    textAlign: "center",
    marginBottom: SPACING.LG,
    opacity: 0.7,
  },
  buttonGroup: {
    width: "100%",
    gap: SPACING.SM,
    marginTop: SPACING.LG,
  },
});
