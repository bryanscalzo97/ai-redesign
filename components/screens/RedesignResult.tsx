import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { useAccentColor } from "@/hooks/useAccentColor";
import { SPACING, BORDER_RADIUS } from "@/constants/designTokens";
import { Image } from "expo-image";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
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
          Redesigning your room...
        </Text>
        <Text
          type="caption"
          weight="normal"
          lightColor="black"
          darkColor="white"
          style={styles.loadingSubtext}
        >
          This may take a moment
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
          Generation Failed
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
            title="Try Again"
            onPress={onRetry}
            variant="solid"
            size="lg"
            symbol="arrow.clockwise"
          />
          <Button
            title="Start Over"
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
        Your Redesign is Ready!
      </Text>

      <Image
        source={{ uri: `data:image/png;base64,${generatedImage}` }}
        style={styles.resultImage}
        contentFit="cover"
        transition={300}
      />

      <View style={styles.buttonGroup}>
        <Button
          title="Generate Another"
          onPress={onGenerateAnother}
          variant="solid"
          size="lg"
          symbol="wand.and.stars"
        />
      </View>
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
    aspectRatio: 4 / 3,
    borderRadius: BORDER_RADIUS.MD,
    overflow: "hidden",
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
