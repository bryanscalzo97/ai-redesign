import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Text } from "@/components/ui/Text";
import {
  BORDER_RADIUS,
  SPACING,
} from "@/constants/designTokens";
import {
  REDESIGN_STYLE_LABELS,
  ROOM_TYPE_LABELS,
  type RedesignCreationInput,
  type RedesignStyle,
  type RoomType,
} from "@/types/redesign";
import { AuthContext } from "@/context/AuthContext";
import { useRedesignCreation } from "@/context/RedesignCreationContext";
import { CameraView, useCameraPermissions, FlashMode } from "expo-camera";
import { Image } from "expo-image";
import * as ImageManipulator from "expo-image-manipulator";
import { useRouter } from "expo-router";
import { use, useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type CameraStep = "camera" | "options" | "generating" | "result";

const LOADING_MESSAGES = [
  "Redesigning your room...",
  "Applying style magic...",
  "Rearranging the furniture...",
  "Picking the perfect palette...",
  "Almost there...",
  "Adding finishing touches...",
  "Consulting the design oracle...",
  "Mixing textures and colors...",
];

function LoadingMessages() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <Text type="lg" weight="semibold" style={{ color: "#fff", textAlign: "center" }}>
      {LOADING_MESSAGES[index]}
    </Text>
  );
}

export function CameraCapture() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const cameraRef = useRef<CameraView>(null);
  const { generate, isGenerating, generatedImage, error, reset } = useRedesignCreation();
  const { isAuthenticated } = use(AuthContext);

  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<"front" | "back">("back");
  const [flash, setFlash] = useState<FlashMode>("off");
  const [step, setStep] = useState<CameraStep>("camera");
  const [capturedUri, setCapturedUri] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [roomType, setRoomType] = useState<RoomType | null>(null);
  const [style, setStyle] = useState<RedesignStyle | null>(null);
  const [customInstructions, setCustomInstructions] = useState("");

  const roomTypes = Object.keys(ROOM_TYPE_LABELS) as RoomType[];
  const redesignStyles = Object.keys(REDESIGN_STYLE_LABELS) as RedesignStyle[];

  // Watch generation state to transition steps
  useEffect(() => {
    if (step === "generating" && !isGenerating) {
      if (generatedImage) {
        setStep("result");
      } else if (error) {
        setStep("options");
      }
    }
  }, [step, isGenerating, generatedImage, error]);

  const resizeAndCompress = useCallback(async (uri: string): Promise<string | null> => {
    const manipulated = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 1024 } }],
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG, base64: true }
    );
    return manipulated.base64 ?? null;
  }, []);

  const handleCapture = useCallback(async () => {
    if (!cameraRef.current) return;
    const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
    if (photo?.uri) {
      setCapturedUri(photo.uri);
      const base64 = await resizeAndCompress(photo.uri);
      if (base64) {
        setImageBase64(base64);
        setStep("options");
      }
    }
  }, [resizeAndCompress]);

  const handleRetake = useCallback(() => {
    setCapturedUri(null);
    setImageBase64(null);
    setRoomType(null);
    setStyle(null);
    reset();
    setStep("camera");
  }, [reset]);

  const handleGenerate = useCallback(() => {
    if (!imageBase64 || !roomType || !style) return;

    const input: RedesignCreationInput = {
      roomType,
      style,
      imageBase64,
      customInstructions: customInstructions.trim() || undefined,
    };

    setStep("generating");
    generate(input);
  }, [imageBase64, roomType, style, customInstructions, generate]);

  const handleNewScan = useCallback(() => {
    setCapturedUri(null);
    setImageBase64(null);
    setRoomType(null);
    setStyle(null);
    reset();
    setStep("camera");
  }, [reset]);

  const toggleFlash = useCallback(() => {
    setFlash((prev) => (prev === "off" ? "on" : "off"));
  }, []);

  const toggleFacing = useCallback(() => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  }, []);

  // Permission not yet determined
  if (!permission) {
    return <View style={s.container} />;
  }

  // Permission denied
  if (!permission.granted) {
    return (
      <View style={[s.container, s.centered]}>
        <Icon symbol="camera.fill" size="xl" color="#fff" />
        <Text type="subtitle" weight="semibold" style={s.permissionText}>
          Camera access needed
        </Text>
        <Text type="body" weight="normal" style={s.permissionSubtext}>
          Allow camera access to scan your room and generate redesigns in real time.
        </Text>
        <Button
          title="Allow Camera"
          onPress={() => {
            if (permission.canAskAgain) {
              requestPermission();
            } else {
              Alert.alert(
                "Camera access",
                "Open Settings to enable camera access.",
                [
                  { text: "Cancel", style: "cancel" },
                  { text: "Open Settings", onPress: () => Linking.openSettings() },
                ]
              );
            }
          }}
          variant="solid"
          size="lg"
          style={{ width: 200 }}
        />
      </View>
    );
  }

  // Result step - show generated image
  if (step === "result" && generatedImage) {
    return (
      <View style={s.container}>
        <Image
          source={{ uri: `data:image/png;base64,${generatedImage}` }}
          style={StyleSheet.absoluteFillObject}
          contentFit="cover"
        />

        {/* Top bar */}
        <View style={[s.topBar, { paddingTop: insets.top + SPACING.SM }]}>
          <View style={s.topButton} />
          <Text type="body" weight="semibold" style={{ color: "#fff" }}>
            Your Redesign
          </Text>
          <View style={s.topButton} />
        </View>

        {/* Bottom actions */}
        <View style={[s.resultBottomBar, { paddingBottom: insets.bottom + SPACING.MD }]}>
          <Button
            title="New Scan"
            onPress={handleNewScan}
            variant="soft"
            size="lg"
            radius="full"
            style={{ flex: 1 } as any}
          />
          <Button
            title="View in Redesigns"
            onPress={() => router.push("/(tabs)/redesigns")}
            variant="solid"
            size="lg"
            radius="full"
            style={{ flex: 1 } as any}
          />
        </View>
      </View>
    );
  }

  // Generating step - loading with animated messages
  if (step === "generating") {
    return (
      <View style={s.container}>
        {capturedUri && (
          <Image
            source={{ uri: capturedUri }}
            style={StyleSheet.absoluteFillObject}
            contentFit="cover"
          />
        )}
        <View style={[StyleSheet.absoluteFillObject, s.generatingOverlay]} />

        <View style={s.generatingContent}>
          <ActivityIndicator size="large" color="#fff" />
          <LoadingMessages />
          <Text type="sm" style={{ color: "rgba(255,255,255,0.5)", textAlign: "center", marginTop: 8 }}>
            This may take a moment
          </Text>
        </View>
      </View>
    );
  }

  // Options step - photo captured, select room type & style
  if (step === "options" && capturedUri) {
    const canGenerate = Boolean(roomType && style);
    return (
      <View style={s.container}>
        <Image
          source={{ uri: capturedUri }}
          style={StyleSheet.absoluteFillObject}
          contentFit="cover"
        />
        <View style={[StyleSheet.absoluteFillObject, s.optionsOverlay]} />

        {/* Top bar */}
        <View style={[s.topBar, { paddingTop: insets.top + SPACING.SM }]}>
          <Pressable onPress={handleRetake} style={s.topButton}>
            <Icon symbol="arrow.left" size="md" color="#fff" />
          </Pressable>
          <Text type="body" weight="semibold" style={{ color: "#fff" }}>
            Customize redesign
          </Text>
          <View style={s.topButton} />
        </View>

        {/* Error banner */}
        {error && (
          <View style={s.errorBanner}>
            <Text type="sm" weight="semibold" style={{ color: "#fff" }}>
              {error}
            </Text>
          </View>
        )}

        {/* Options */}
        <ScrollView
          style={s.optionsScroll}
          contentContainerStyle={[
            s.optionsContent,
            { paddingBottom: insets.bottom + SPACING.LG },
          ]}
        >
          {/* Room type */}
          <View style={s.optionSection}>
            <Text type="body" weight="semibold" style={s.optionLabel}>
              Room type
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.chipsRow}
            >
              {roomTypes.map((key) => {
                const selected = roomType === key;
                return (
                  <Pressable
                    key={key}
                    onPress={() => setRoomType(key)}
                    style={[s.chip, selected && s.chipSelected]}
                  >
                    <Text
                      type="body"
                      weight={selected ? "semibold" : "normal"}
                      style={{ color: "#fff" }}
                    >
                      {ROOM_TYPE_LABELS[key]}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* Style */}
          <View style={s.optionSection}>
            <Text type="body" weight="semibold" style={s.optionLabel}>
              Redesign style
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.chipsRow}
            >
              {redesignStyles.map((key) => {
                const selected = style === key;
                return (
                  <Pressable
                    key={key}
                    onPress={() => setStyle(key)}
                    style={[s.chip, selected && s.chipSelected]}
                  >
                    <Text
                      type="body"
                      weight={selected ? "semibold" : "normal"}
                      style={{ color: "#fff" }}
                    >
                      {REDESIGN_STYLE_LABELS[key]}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* Generate or Sign In */}
          {isAuthenticated ? (
            <Button
              title="Generate Redesign"
              onPress={handleGenerate}
              disabled={!canGenerate}
              variant="solid"
              size="lg"
              symbol="wand.and.stars"
              style={s.generateButton}
            />
          ) : (
            <View style={s.signInPrompt}>
              <Text type="lg" weight="bold" style={{ color: "#fff", textAlign: "center" }}>
                Sign in to generate your redesign
              </Text>
              <Text type="sm" style={{ color: "rgba(255,255,255,0.6)", textAlign: "center", marginTop: 4 }}>
                Create an account to start redesigning your rooms.
              </Text>
              <Button
                title="Sign in"
                onPress={() => router.push("/auth-sheet")}
                variant="solid"
                size="lg"
                color="neutral"
                radius="full"
                style={{ marginTop: 16 } as any}
              />
            </View>
          )}
        </ScrollView>
      </View>
    );
  }

  // Camera step - live preview
  return (
    <View style={s.container}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFillObject}
        facing={facing}
        flash={flash}
      />

      {/* Top bar */}
      <View style={[s.topBar, { paddingTop: insets.top + SPACING.SM }]}>
        <Pressable onPress={toggleFlash} style={s.topButton}>
          <Icon
            symbol={flash === "on" ? "bolt.fill" : "bolt.slash.fill"}
            size="md"
            color="#fff"
          />
        </Pressable>
        <Text type="subtitle" weight="bold" style={{ color: "#fff" }}>
          Scan Room
        </Text>
        <Pressable onPress={toggleFacing} style={s.topButton}>
          <Icon symbol="camera.rotate.fill" size="md" color="#fff" />
        </Pressable>
      </View>

      {/* Framing guide */}
      <View style={s.frameGuide}>
        <View style={s.frameCornerTL} />
        <View style={s.frameCornerTR} />
        <View style={s.frameCornerBL} />
        <View style={s.frameCornerBR} />
      </View>
      <Text type="caption" weight="normal" style={s.guideText}>
        Frame your room within the guide
      </Text>

      {/* Bottom controls */}
      <View style={[s.bottomBar, { paddingBottom: insets.bottom + SPACING.MD }]}>
        <View style={s.captureRow}>
          <Pressable onPress={handleCapture} style={s.captureButton}>
            <View style={s.captureButtonInner} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const CORNER_SIZE = 30;
const CORNER_WIDTH = 3;

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
    gap: SPACING.MD,
    paddingHorizontal: SPACING.LG,
  },
  permissionText: {
    color: "#fff",
    textAlign: "center",
    marginTop: SPACING.SM,
  },
  permissionSubtext: {
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    marginBottom: SPACING.MD,
  },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.MD,
    paddingBottom: SPACING.SM,
    zIndex: 10,
  },
  topButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  frameGuide: {
    position: "absolute",
    top: "25%",
    left: "10%",
    right: "10%",
    bottom: "30%",
  },
  frameCornerTL: {
    position: "absolute",
    top: 0,
    left: 0,
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderTopWidth: CORNER_WIDTH,
    borderLeftWidth: CORNER_WIDTH,
    borderColor: "rgba(255,255,255,0.6)",
    borderTopLeftRadius: 8,
  },
  frameCornerTR: {
    position: "absolute",
    top: 0,
    right: 0,
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderTopWidth: CORNER_WIDTH,
    borderRightWidth: CORNER_WIDTH,
    borderColor: "rgba(255,255,255,0.6)",
    borderTopRightRadius: 8,
  },
  frameCornerBL: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderBottomWidth: CORNER_WIDTH,
    borderLeftWidth: CORNER_WIDTH,
    borderColor: "rgba(255,255,255,0.6)",
    borderBottomLeftRadius: 8,
  },
  frameCornerBR: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderBottomWidth: CORNER_WIDTH,
    borderRightWidth: CORNER_WIDTH,
    borderColor: "rgba(255,255,255,0.6)",
    borderBottomRightRadius: 8,
  },
  guideText: {
    position: "absolute",
    bottom: "31%",
    alignSelf: "center",
    color: "rgba(255,255,255,0.6)",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingTop: SPACING.MD,
  },
  captureRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  captureButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  captureButtonInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "#fff",
  },
  // Options overlay styles
  optionsOverlay: {
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  optionsScroll: {
    flex: 1,
    marginTop: 100,
  },
  optionsContent: {
    paddingHorizontal: SPACING.MD,
    paddingTop: SPACING.LG,
    justifyContent: "flex-end",
    flexGrow: 1,
  },
  optionSection: {
    marginBottom: SPACING.LG,
  },
  optionLabel: {
    color: "#fff",
    marginBottom: SPACING.SM,
  },
  chipsRow: {
    flexDirection: "row",
    gap: SPACING.SM,
  },
  chip: {
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderRadius: BORDER_RADIUS.FULL,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  chipSelected: {
    backgroundColor: "rgba(255,255,255,0.4)",
    borderColor: "#fff",
  },
  generateButton: {
    marginTop: SPACING.MD,
  },
  signInPrompt: {
    marginTop: SPACING.MD,
    alignItems: "center",
    paddingHorizontal: SPACING.MD,
  },
  // Generating step styles
  generatingOverlay: {
    backgroundColor: "rgba(0,0,0,0.75)",
  },
  generatingContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: SPACING.LG,
  },
  // Result step styles
  resultBottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: SPACING.MD,
    paddingTop: SPACING.MD,
  },
  // Error banner
  errorBanner: {
    position: "absolute",
    top: 100,
    left: SPACING.MD,
    right: SPACING.MD,
    backgroundColor: "rgba(220,38,38,0.9)",
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.MD,
    zIndex: 10,
  },
});
