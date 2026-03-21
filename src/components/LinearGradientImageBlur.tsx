import LinearGradientComponent from "@/components/LinearGradient";
import { LazyImage } from "@/components/ui/LazyImage";
import { Colors } from "@/theme/colors";
import MaskedView from "@react-native-masked-view/masked-view";
import type { BlurTint } from "expo-blur";
import { BlurView } from "expo-blur";
import {
  StyleSheet,
  useColorScheme,
  View,
  type ColorValue,
  type ImageStyle,
  type ViewStyle,
} from "react-native";

export interface LinearGradientImageBlurProps {
  // Visibility controls
  showBlur?: boolean;
  showImage?: boolean;
  showGradient?: boolean;
  showProgressiveBlur?: boolean;
  showSolidColor?: boolean;

  // Gradient configuration
  lightGradientColors?: readonly [
    ColorValue,
    ColorValue,
    ColorValue,
    ColorValue,
    ColorValue
  ];
  darkGradientColors?: readonly [
    ColorValue,
    ColorValue,
    ColorValue,
    ColorValue,
    ColorValue
  ];
  /**
   * Gradient stop locations (0..1, ascending). Must be 5 positions to match the 5 colors.
   * If omitted, defaults to: [0, 0.25, 0.5, 0.75, 1]
   */
  gradientLocations?: readonly [number, number, number, number, number];

  // Image configuration
  imageUrl?: string;
  // Image
  imageFit?: "cover" | "contain";
  // Image position
  imagePosition?: string;
  // Blur configuration
  blurIntensity?: number;

  // Solid color configuration
  solidColor?: string;

  // Style overrides
  containerStyle?: ViewStyle;
  imageStyle?: ImageStyle;
  tint?: BlurTint | undefined;
}

function MaskedViewComponent({
  selectedColors = [
    "transparent",
    "transparent",
    "transparent",
    "transparent",
    "transparent",
  ],
  gradientLocations = [0, 0.25, 0.5, 0.75, 1],
  blurIntensity = 30,
}: {
  selectedColors: readonly [
    ColorValue,
    ColorValue,
    ColorValue,
    ColorValue,
    ColorValue
  ];
  gradientLocations?: readonly [number, number, number, number, number];
  blurIntensity?: number;
}) {
  return (
    <MaskedView
      style={[styles.absolute, styles.sizeFull, styles.maskedView]}
      maskElement={
        <GradientViewComponent
          selectedColors={selectedColors}
          gradientLocations={gradientLocations}
        />
      }
    >
      <BlurViewComponent blurIntensity={blurIntensity} />
    </MaskedView>
  );
}

function BlurViewComponent({
  blurIntensity = 30,
  style,
  tint = "default",
}: {
  blurIntensity?: number;
  style?: ViewStyle;
  tint?: BlurTint | undefined;
}) {
  return (
    <View style={[styles.absolute, styles.sizeFull, styles.blurView, style]}>
      <BlurView intensity={blurIntensity} tint={tint} style={{ flex: 1 }} />
    </View>
  );
}

function GradientViewComponent({
  selectedColors,
  gradientLocations = [0, 0.25, 0.5, 0.75, 1],
  style,
}: {
  selectedColors: readonly [
    ColorValue,
    ColorValue,
    ColorValue,
    ColorValue,
    ColorValue
  ];
  gradientLocations?: readonly [number, number, number, number, number];
  style?: ViewStyle;
}) {
  return (
    <View
      style={[
        styles.absolute,
        styles.sizeFull,
        styles.gradientContainer,
        style,
      ]}
    >
      <LinearGradientComponent
        colors={selectedColors}
        locations={gradientLocations}
      />
    </View>
  );
}

function ImageViewComponent({
  imageUrl,
  imageStyle,
  containerStyle,
  imageFit,
  imagePosition,
}: {
  imageUrl: string;
  imageStyle?: ImageStyle;
  containerStyle?: ViewStyle;
  imageFit?: "cover" | "contain";
  imagePosition?: string;
}) {
  return (
    <View
      style={[
        styles.absolute,
        styles.imageContainer,
        styles.sizeFull,
        containerStyle,
      ]}
    >
      <LazyImage
        source={imageUrl}
        contentFit={imageFit}
        contentPosition={imagePosition}
        style={[styles.image, imageStyle] as any}
      />
    </View>
  );
}

function SolidColorViewComponent({
  solidColor,
  style,
}: {
  solidColor: string;
  style?: ViewStyle;
}) {
  return (
    <View
      style={[
        styles.absolute,
        styles.solidColorContainer,
        styles.sizeFull,
        { backgroundColor: solidColor },
        style,
      ]}
    />
  );
}

export default function LinearGradientImageBlur({
  showBlur = false,
  showImage = false,
  showGradient = false,
  showProgressiveBlur = false,
  showSolidColor = false,
  lightGradientColors = [
    "transparent",
    Colors.grayscale[50] + "40",
    Colors.grayscale[50] + "80",
    Colors.grayscale[50],
    Colors.grayscale[50],
  ],
  darkGradientColors = [
    "transparent",
    Colors.grayscale[950] + "40",
    Colors.grayscale[950] + "80",
    Colors.grayscale[950],
    Colors.grayscale[950],
  ],
  gradientLocations = [0, 0.25, 0.5, 0.75, 1],
  imageUrl,
  imageFit = "cover",
  imagePosition = "center",
  blurIntensity = 30,
  solidColor,
  containerStyle,
  imageStyle,
  tint = "default",
}: LinearGradientImageBlurProps) {
  const isDarkMode = useColorScheme() === "dark";
  const selectedColors = isDarkMode ? darkGradientColors : lightGradientColors;

  const progressiveBlurColors =
    showProgressiveBlur && !showGradient
      ? ([
          "transparent",
          "transparent",
          "transparent",
          "black",
          "black",
        ] as const)
      : selectedColors;

  return (
    <View style={[styles.container, styles.sizeFull, containerStyle]}>
      {/* Progressive Blur Section*/}
      {showProgressiveBlur && (
        <MaskedViewComponent
          selectedColors={progressiveBlurColors}
          gradientLocations={gradientLocations}
          blurIntensity={blurIntensity}
        />
      )}

      {/* Blur Section*/}
      {showBlur && (
        <BlurViewComponent blurIntensity={blurIntensity} tint={tint} />
      )}

      {/* Gradient Section*/}
      {showGradient && (
        <GradientViewComponent
          selectedColors={selectedColors}
          gradientLocations={gradientLocations}
        />
      )}

      {/* Image Section*/}
      {(showImage || imageUrl) && imageUrl && (
        <ImageViewComponent
          imageUrl={imageUrl}
          imageStyle={imageStyle}
          imageFit={imageFit}
          imagePosition={imagePosition}
        />
      )}

      {/* Solid Color Section*/}
      {(showSolidColor || solidColor) && solidColor && (
        <SolidColorViewComponent solidColor={solidColor} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  sizeFull: {
    width: "100%",
    height: "100%",
    flex: 1,
  },
  maskedView: {
    zIndex: 4,
  },
  blurView: {
    zIndex: 3,
  },
  gradientContainer: {
    zIndex: 2,
  },
  imageContainer: {
    zIndex: 1,
  },
  solidColorContainer: {
    zIndex: 0,
  },
});
