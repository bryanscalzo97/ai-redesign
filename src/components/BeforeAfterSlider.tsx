import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  clamp,
} from "react-native-reanimated";

interface BeforeAfterSliderProps {
  beforeUri: string;
  afterUri: string;
  width: number;
  height: number;
}

export function BeforeAfterSlider({
  beforeUri,
  afterUri,
  width,
  height,
}: BeforeAfterSliderProps) {
  const sliderX = useSharedValue(width / 2);

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      sliderX.value = clamp(e.absoluteX, 0, width);
    })
    .minDistance(0);

  const beforeClipStyle = useAnimatedStyle(() => ({
    width: sliderX.value,
  }));

  const handleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: sliderX.value - 20 }],
  }));

  const lineStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: sliderX.value - 1 }],
  }));

  return (
    <GestureDetector gesture={pan}>
      <View style={[s.container, { width, height }]}>
        {/* After image (full, behind) */}
        <Image
          source={{ uri: afterUri }}
          style={[s.image, { width, height }]}
          contentFit="cover"
        />

        {/* Before image (clipped) */}
        <Animated.View style={[s.beforeClip, { height }, beforeClipStyle]}>
          <Image
            source={{ uri: beforeUri }}
            style={[s.image, { width, height }]}
            contentFit="cover"
          />
        </Animated.View>

        {/* Labels */}
        <View style={s.labelBefore}>
          <Animated.Text style={s.labelText}>Before</Animated.Text>
        </View>
        <View style={s.labelAfter}>
          <Animated.Text style={s.labelText}>After</Animated.Text>
        </View>

        {/* Slider line */}
        <Animated.View style={[s.line, { height }, lineStyle]} />

        {/* Drag handle */}
        <Animated.View style={[s.handle, handleStyle]}>
          <View style={s.handleInner}>
            <View style={s.arrow}>
              <View style={[s.arrowHead, s.arrowLeft]} />
            </View>
            <View style={s.arrow}>
              <View style={[s.arrowHead, s.arrowRight]} />
            </View>
          </View>
        </Animated.View>
      </View>
    </GestureDetector>
  );
}

const s = StyleSheet.create({
  container: {
    position: "relative",
    overflow: "hidden",
  },
  image: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  beforeClip: {
    position: "absolute",
    top: 0,
    left: 0,
    overflow: "hidden",
    zIndex: 1,
  },
  line: {
    position: "absolute",
    top: 0,
    width: 2,
    backgroundColor: "#fff",
    zIndex: 2,
  },
  handle: {
    position: "absolute",
    top: "50%",
    width: 40,
    height: 40,
    marginTop: -20,
    zIndex: 3,
  },
  handleInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  arrow: {
    justifyContent: "center",
    alignItems: "center",
  },
  arrowHead: {
    width: 0,
    height: 0,
    borderTopWidth: 5,
    borderBottomWidth: 5,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
  },
  arrowLeft: {
    borderRightWidth: 6,
    borderRightColor: "#333",
  },
  arrowRight: {
    borderLeftWidth: 6,
    borderLeftColor: "#333",
  },
  labelBefore: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 4,
  },
  labelAfter: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 4,
  },
  labelText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});
