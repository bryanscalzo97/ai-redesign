import { generateListingText } from "@/core/mutations";
import { ApiError } from "@/core/api-client";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Text } from "@/components/ui/Text";
import {
  BORDER_RADIUS,
  SPACING,
} from "@/theme/dimensions";
import {
  BUDGET_LEVEL_LABELS,
  BUDGET_LEVEL_DESCRIPTIONS,
  GUEST_TYPE_LABELS,
  REDESIGN_STYLE_LABELS,
  ROOM_TYPE_LABELS,
  type BudgetLevel,
  type GuestType,
  type RedesignCreationInput,
  type RedesignStyle,
  type RoomType,
} from "@/types/redesign";
import { HOST_INSIGHTS } from "@/constants/host-insights";
import { getScoreCategory } from "@/theme/semantic";
import { AuthContext } from "@/context/AuthContext";
import { useProjects } from "@/context/ProjectContext";
import { useRedesignCreation } from "@/context/RedesignCreationContext";
import { getRoomHistory, computeProgress } from "@/lib/progress-tracking";
import { CameraView, useCameraPermissions, FlashMode } from "expo-camera";
import { Image } from "expo-image";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { use, useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Linking,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

type CameraStep = "camera" | "options" | "generating" | "result";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

// Loading messages are now i18n-driven via camera.loadingMessages

function LoadingMessages() {
  const { t } = useTranslation();
  const messages = t("camera.loadingMessages", { returnObjects: true }) as string[];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <Text type="lg" weight="semibold" style={{ color: "#fff", textAlign: "center" }}>
      {messages[index]}
    </Text>
  );
}

export function CameraCapture() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    prefillStyle?: string;
    prefillGuest?: string;
    prefillRoom?: string;
    saveToProjectId?: string;
  }>();
  const insets = useSafeAreaInsets();
  const cameraRef = useRef<CameraView>(null);
  const { generate, isGenerating, generatedImage, error, reset, roomAnalysis, isAnalyzing } = useRedesignCreation();
  const { isAuthenticated } = use(AuthContext);
  const { projects, createProject, addRedesignToProject } = useProjects();

  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<"front" | "back">("back");
  const [flash, setFlash] = useState<FlashMode>("off");
  const [step, setStep] = useState<CameraStep>("camera");
  const [capturedUri, setCapturedUri] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [roomType, setRoomType] = useState<RoomType | null>(
    (params.prefillRoom as RoomType) || null
  );
  const [style, setStyle] = useState<RedesignStyle | null>(
    (params.prefillStyle as RedesignStyle) || null
  );
  const [guestType, setGuestType] = useState<GuestType | null>(
    (params.prefillGuest as GuestType) || null
  );
  const [customInstructions, setCustomInstructions] = useState("");
  const [budgetLevel, setBudgetLevel] = useState<BudgetLevel | null>(null);
  const { t } = useTranslation();

  // Result state
  const [listingText, setListingText] = useState<string | null>(null);
  const [isGeneratingText, setIsGeneratingText] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedToProject, setSavedToProject] = useState(false);
  const [progressMessage, setProgressMessage] = useState<string | null>(null);
  const [savedProjectId, setSavedProjectId] = useState<string | null>(null);
  const [scanNudge, setScanNudge] = useState<string | null>(null);

  const roomTypes = Object.keys(ROOM_TYPE_LABELS) as RoomType[];
  const redesignStyles = Object.keys(REDESIGN_STYLE_LABELS) as RedesignStyle[];
  const guestTypes = Object.keys(GUEST_TYPE_LABELS) as GuestType[];
  const budgetLevels = Object.keys(BUDGET_LEVEL_LABELS) as BudgetLevel[];

  // Reset to camera when tab regains focus (if scan is done)
  const navigation = useNavigation();
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (savedToProject || step === "result") {
        setCapturedUri(null);
        setImageBase64(null);
        setRoomType((params.prefillRoom as RoomType) || null);
        setStyle((params.prefillStyle as RedesignStyle) || null);
        setGuestType((params.prefillGuest as GuestType) || null);
        setBudgetLevel(null);
        setListingText(null);
        setSavedToProject(false);
        setProgressMessage(null);
        setSavedProjectId(null);
        setScanNudge(null);
        autoSaveTriggered.current = false;
        reset();
        setStep("camera");
      }
    });
    return unsubscribe;
  }, [navigation, savedToProject, step, reset, params]);

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

  const autoSaveTriggered = useRef(false);

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

  const handlePickFromGallery = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      setCapturedUri(uri);
      const base64 = await resizeAndCompress(uri);
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
    setGuestType(null);
    setBudgetLevel(null);
    setListingText(null);
    setSavedToProject(false);
    setProgressMessage(null);
    setSavedProjectId(null);
    setScanNudge(null);
    autoSaveTriggered.current = false;
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
      guestType: guestType ?? undefined,
      budgetLevel: budgetLevel ?? undefined,
    };

    setStep("generating");
    generate(input);
  }, [imageBase64, roomType, style, guestType, budgetLevel, customInstructions, generate]);

  const handleNewScan = useCallback(() => {
    setCapturedUri(null);
    setImageBase64(null);
    setRoomType(null);
    setStyle(null);
    setGuestType(null);
    setBudgetLevel(null);
    setListingText(null);
    setSavedToProject(false);
    setProgressMessage(null);
    setSavedProjectId(null);
    setScanNudge(null);
    autoSaveTriggered.current = false;
    reset();
    setStep("camera");
  }, [reset]);

  const toggleFlash = useCallback(() => {
    setFlash((prev) => (prev === "off" ? "on" : "off"));
  }, []);

  const toggleFacing = useCallback(() => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  }, []);

  // ── Listing text generation ──
  const handleGenerateListingText = useCallback(async () => {
    if (!roomType || !style) return;
    setIsGeneratingText(true);
    try {
      const data = await generateListingText({
        roomType,
        style,
        guestType: guestType ?? undefined,
        image_base64: generatedImage ?? undefined,
      });
      setListingText(data.listingText);
    } catch (err) {
      Alert.alert(t("common.error"), err instanceof ApiError ? err.message : t("camera.failedToSave"));
    } finally {
      setIsGeneratingText(false);
    }
  }, [roomType, style, guestType, generatedImage]);

  const handleShareText = useCallback(() => {
    if (listingText) {
      Share.share({ message: listingText });
    }
  }, [listingText]);

  // ── Save to project ──
  const handleSaveToProject = useCallback(() => {
    const options = projects.map((p) => p.name);
    options.push(t("camera.newPropertyDots"));
    options.push(t("common.cancel"));

    Alert.alert(t("camera.saveToProperty"), t("camera.chooseProperty"), [
      ...projects.map((p) => ({
        text: p.name,
        onPress: () => saveToProject(p.id),
      })),
      {
        text: t("camera.newPropertyDots"),
        onPress: () => {
          Alert.prompt(
            t("projectList.newProperty"),
            t("camera.enterPropertyName"),
            [
              { text: t("common.cancel"), style: "cancel" },
              {
                text: t("camera.createAndSave"),
                onPress: async (name: string | undefined) => {
                  if (name?.trim()) {
                    const project = await createProject(name.trim());
                    await saveToProject(project.id);
                  }
                },
              },
            ],
            "plain-text"
          );
        },
      },
      { text: t("common.cancel"), style: "cancel" },
    ]);
  }, [projects, createProject, imageBase64, generatedImage, roomType, style, guestType, customInstructions, listingText, t]);

  const saveToProject = useCallback(
    async (projectId: string) => {
      if (!imageBase64 || !generatedImage || !roomType || !style) return;
      setIsSaving(true);
      try {
        // Check for existing scans of same room type before saving
        const existingProject = projects.find((p) => p.id === projectId);

        await addRedesignToProject(projectId, {
          roomType,
          style,
          guestType: guestType ?? undefined,
          customInstructions: customInstructions.trim() || undefined,
          beforeBase64: imageBase64,
          afterBase64: generatedImage,
          listingText: listingText ?? undefined,
          roomAnalysis: roomAnalysis ?? undefined,
        });
        setSavedToProject(true);
        setSavedProjectId(projectId);

        // Compute scan nudge
        const updatedProject = projects.find((p) => p.id === projectId);
        const currentScanCount = (updatedProject?.redesigns.length ?? 0) + 1;
        if (currentScanCount < 3) {
          setScanNudge(
            `${currentScanCount} room${currentScanCount === 1 ? "" : "s"} scanned — scan ${3 - currentScanCount} more to get your full property score`
          );
        } else {
          setScanNudge(
            `${currentScanCount} rooms scanned — your property dashboard is ready!`
          );
        }

        // Show progress message if same room was scanned before
        if (existingProject && roomAnalysis) {
          const history = getRoomHistory(existingProject, roomType);
          if (history.length > 0) {
            const prevScore = history[history.length - 1].roomAnalysis!.score;
            const newScore = roomAnalysis.score;
            const roomLabel =
              (ROOM_TYPE_LABELS as Record<string, string>)[roomType] || roomType;
            if (newScore !== prevScore) {
              setProgressMessage(
                `${roomLabel} ${newScore > prevScore ? "improved" : "changed"}: ${prevScore.toFixed(1)} → ${newScore.toFixed(1)}`
              );
            }
          }
        }
      } catch (err) {
        Alert.alert(t("common.error"), t("camera.failedToSave"));
      } finally {
        setIsSaving(false);
      }
    },
    [
      imageBase64,
      generatedImage,
      roomType,
      style,
      guestType,
      customInstructions,
      listingText,
      roomAnalysis,
      addRedesignToProject,
      projects,
    ]
  );

  // Auto-save when coming from Welcome Guide (saveToProjectId param)
  // Wait for room analysis to finish so the score gets saved
  useEffect(() => {
    if (
      step === "result" &&
      params.saveToProjectId &&
      generatedImage &&
      imageBase64 &&
      !isAnalyzing &&
      !savedToProject &&
      !isSaving &&
      !autoSaveTriggered.current
    ) {
      autoSaveTriggered.current = true;
      saveToProject(params.saveToProjectId);
    }
  }, [step, params.saveToProjectId, generatedImage, imageBase64, isAnalyzing, savedToProject, isSaving, saveToProject]);

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
          {t("camera.cameraAccessNeeded")}
        </Text>
        <Text type="body" weight="normal" style={s.permissionSubtext}>
          {t("camera.cameraAccessDesc")}
        </Text>
        <Button
          title={t("camera.allowCamera")}
          onPress={() => {
            if (permission.canAskAgain) {
              requestPermission();
            } else {
              Alert.alert(
                t("camera.cameraAccessSettings"),
                t("camera.cameraAccessSettingsMsg"),
                [
                  { text: t("common.cancel"), style: "cancel" },
                  { text: t("common.openSettings"), onPress: () => Linking.openSettings() },
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

  // ── Result step — before/after slider + listing text + save ──
  if (step === "result" && generatedImage && capturedUri) {
    return (
      <View style={s.container}>
        <ScrollView
          style={s.resultScroll}
          contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        >
          {/* Before / After slider */}
          <BeforeAfterSlider
            beforeUri={capturedUri}
            afterUri={`data:image/png;base64,${generatedImage}`}
            width={screenWidth}
            height={screenWidth}
          />

          {/* Action buttons */}
          <View style={s.resultActions}>
            {params.saveToProjectId && !savedToProject && (isAnalyzing || isSaving) ? (
              <View style={s.savedBadge}>
                <ActivityIndicator size="small" color="#16A34A" />
                <Text type="sm" style={{ color: "rgba(255,255,255,0.6)", marginTop: 4 }}>
                  {isAnalyzing ? t("camera.analyzingBeforeSaving") : t("camera.savingToProperty")}
                </Text>
              </View>
            ) : savedToProject ? (
              <View style={s.savedSection}>
                <View style={s.savedBadge}>
                  <Text type="sm" weight="semibold" style={{ color: "#16A34A" }}>
                    {t("camera.savedToProperty")}
                  </Text>
                  {progressMessage && (
                    <Text type="sm" weight="semibold" style={{ color: "#22C55E", marginTop: 4 }}>
                      {progressMessage}
                    </Text>
                  )}
                </View>
                {scanNudge && (
                  <Text type="sm" style={{ color: "rgba(255,255,255,0.6)", textAlign: "center", marginTop: 8 }}>
                    {scanNudge}
                  </Text>
                )}
                <View style={s.postSaveActions}>
                  <Button
                    title={t("camera.scanNextRoom")}
                    onPress={handleNewScan}
                    variant="soft"
                    size="md"
                    radius="full"
                    symbol="camera.viewfinder"
                    style={{ flex: 1 } as any}
                  />
                  {savedProjectId && (
                    <Button
                      title={t("camera.viewDashboard")}
                      onPress={() =>
                        router.push({
                          pathname: "/(tabs)/redesigns/project-detail",
                          params: { id: savedProjectId },
                        })
                      }
                      variant="solid"
                      size="md"
                      radius="full"
                      style={{ flex: 1 } as any}
                    />
                  )}
                </View>
              </View>
            ) : (
              <Button
                title={isSaving ? t("common.saving") : isAnalyzing ? t("projectDetail.analyzing") : t("camera.saveToProperty")}
                onPress={handleSaveToProject}
                disabled={isSaving || isAnalyzing}
                variant="solid"
                size="lg"
                symbol="folder.badge.plus"
              />
            )}
          </View>

          {/* Room Analysis */}
          <View style={s.analysisSection}>
            <Text type="lg" weight="bold" lightColor="white" darkColor="white">
              {t("camera.yourRoomAnalysis")}
            </Text>
            <Text type="caption" style={{ color: "rgba(255,255,255,0.4)", fontStyle: "italic" }}>
              💡 {HOST_INSIGHTS.score}
            </Text>

            {isAnalyzing ? (
              <View style={s.generatingTextRow}>
                <ActivityIndicator size="small" color="#fff" />
                <Text type="sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                  {t("camera.analyzingSpace")}
                </Text>
              </View>
            ) : roomAnalysis ? (
              <>
                <View style={s.scoresContainer}>
                  <View style={s.scoreCard}>
                    <Text type="caption" weight="semibold" style={{ color: "rgba(255,255,255,0.5)" }}>
                      {t("common.before")}
                    </Text>
                    <Text
                      type="title"
                      weight="bold"
                      style={{
                        color:
                          getScoreCategory(roomAnalysis.score).bg,
                      }}
                    >
                      {roomAnalysis.score.toFixed(1)}
                    </Text>
                  </View>

                  {roomAnalysis.afterScore != null && (
                    <>
                      <Text type="lg" style={{ color: "rgba(255,255,255,0.3)", alignSelf: "center" }}>
                        →
                      </Text>
                      <View style={s.scoreCard}>
                        <Text type="caption" weight="semibold" style={{ color: "rgba(255,255,255,0.5)" }}>
                          {t("common.after")}
                        </Text>
                        <Text
                          type="title"
                          weight="bold"
                          style={{
                            color:
                              getScoreCategory(roomAnalysis.afterScore).bg,
                          }}
                        >
                          {roomAnalysis.afterScore.toFixed(1)}
                        </Text>
                      </View>

                      {roomAnalysis.afterScore > roomAnalysis.score && (
                        <View style={s.improvementBadge}>
                          <Text type="sm" weight="bold" style={{ color: "#22C55E" }}>
                            +{(roomAnalysis.afterScore - roomAnalysis.score).toFixed(1)}
                          </Text>
                        </View>
                      )}
                    </>
                  )}
                </View>

                {roomAnalysis.issues.length > 0 && (
                  <View style={s.issuesList}>
                    <Text type="sm" weight="semibold" style={{ color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>
                      {t("camera.issuesDetected")}
                    </Text>
                    {roomAnalysis.issues.map((issue, i) => (
                      <View key={i} style={s.issueRow}>
                        <Text type="sm" style={{ color: "rgba(255,255,255,0.5)" }}>•</Text>
                        <Text type="sm" style={{ color: "rgba(255,255,255,0.8)", flex: 1 }}>
                          {issue.label}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </>
            ) : (
              <Text type="sm" style={{ color: "rgba(255,255,255,0.4)", marginTop: 4 }}>
                {t("camera.analysisUnavailable")}
              </Text>
            )}
          </View>

          {/* Recommended Improvements */}
          {(isAnalyzing || (roomAnalysis && roomAnalysis.suggestions.length > 0)) && (
            <View style={s.analysisSection}>
              <Text type="lg" weight="bold" lightColor="white" darkColor="white">
                {t("camera.recommendedImprovements")}
              </Text>

              {isAnalyzing ? (
                <View style={s.generatingTextRow}>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text type="sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                    {t("camera.generatingSuggestions")}
                  </Text>
                </View>
              ) : roomAnalysis ? (
                <View style={s.suggestionsList}>
                  {(["add", "remove", "move", "replace"] as const).map((action) => {
                    const items = roomAnalysis.suggestions.filter((sg) => sg.action === action);
                    if (items.length === 0) return null;
                    const actionLabel = action === "add" ? t("camera.actionAdd") : action === "remove" ? t("camera.actionRemove") : action === "move" ? t("camera.actionMove") : t("camera.actionReplace");
                    const actionIcon = action === "add" ? "+" : action === "remove" ? "−" : action === "move" ? "↔" : "⟳";
                    return (
                      <View key={action} style={s.suggestionGroup}>
                        <Text type="sm" weight="semibold" style={{ color: "rgba(255,255,255,0.7)", marginBottom: 2 }}>
                          {actionLabel}
                        </Text>
                        {items.map((suggestion, i) => (
                          <View key={i} style={s.issueRow}>
                            <Text type="sm" style={{ color: "rgba(255,255,255,0.5)", width: 18 }}>
                              {actionIcon}
                            </Text>
                            <Text type="sm" style={{ color: "rgba(255,255,255,0.8)", flex: 1 }}>
                              {suggestion.item}
                              {suggestion.detail ? ` — ${suggestion.detail}` : ""}
                              {suggestion.estimatedCost ? ` (~$${suggestion.estimatedCost})` : ""}
                            </Text>
                          </View>
                        ))}
                      </View>
                    );
                  })}
                </View>
              ) : null}
            </View>
          )}

          {/* Listing text */}
          <View style={s.listingTextSection}>
            <Text type="lg" weight="bold" lightColor="white" darkColor="white">
              {t("camera.listingDescription")}
            </Text>
            <Text type="caption" style={{ color: "rgba(255,255,255,0.4)", fontStyle: "italic" }}>
              💡 {HOST_INSIGHTS.description}
            </Text>

            {listingText ? (
              <>
                <Text
                  type="sm"
                  style={{ color: "rgba(255,255,255,0.8)", lineHeight: 20, marginTop: 8 }}
                  selectable
                >
                  {listingText}
                </Text>
                <View style={s.textActions}>
                  <Button
                    title={t("common.share")}
                    onPress={handleShareText}
                    variant="soft"
                    size="md"
                    style={{ flex: 1 } as any}
                  />
                  <Button
                    title={t("common.regenerate")}
                    onPress={handleGenerateListingText}
                    variant="soft"
                    size="md"
                    disabled={isGeneratingText}
                    style={{ flex: 1 } as any}
                  />
                </View>
              </>
            ) : isGeneratingText ? (
              <View style={s.generatingTextRow}>
                <ActivityIndicator size="small" color="#fff" />
                <Text type="sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                  {t("camera.generatingText")}
                </Text>
              </View>
            ) : (
              <Button
                title={t("camera.generateListingText")}
                onPress={handleGenerateListingText}
                variant="soft"
                size="lg"
                symbol="text.badge.star"
                style={{ marginTop: 8 } as any}
              />
            )}
          </View>
        </ScrollView>

        {/* Fixed bottom bar */}
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
            title="Properties"
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
            Optimize your listing
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
              {t("camera.roomType")}
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
                      {t(`roomTypes.${key}`)}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* Style */}
          <View style={s.optionSection}>
            <Text type="body" weight="semibold" style={s.optionLabel}>
              {t("camera.redesignStyle")}
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
                      {t(`redesignStyles.${key}`)}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* Guest type (optional) */}
          <View style={s.optionSection}>
            <Text type="body" weight="semibold" style={s.optionLabel}>
              {t("camera.guestType")}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.chipsRow}
            >
              {guestTypes.map((key) => {
                const selected = guestType === key;
                return (
                  <Pressable
                    key={key}
                    onPress={() => setGuestType(selected ? null : key)}
                    style={[s.chip, selected && s.chipSelected]}
                  >
                    <Text
                      type="body"
                      weight={selected ? "semibold" : "normal"}
                      style={{ color: "#fff" }}
                    >
                      {t(`guestTypes.${key}`)}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* Budget level (optional) */}
          <View style={s.optionSection}>
            <Text type="body" weight="semibold" style={s.optionLabel}>
              {t("camera.budgetLevel")}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.chipsRow}
            >
              {budgetLevels.map((key) => {
                const selected = budgetLevel === key;
                return (
                  <Pressable
                    key={key}
                    onPress={() => setBudgetLevel(selected ? null : key)}
                    style={[s.chip, selected && s.chipSelected]}
                  >
                    <Text
                      type="body"
                      weight={selected ? "semibold" : "normal"}
                      style={{ color: "#fff" }}
                    >
                      {t(`budgetLevels.${key}`)}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
            {budgetLevel && (
              <Text type="caption" style={{ color: "rgba(255,255,255,0.5)", marginTop: 4 }}>
                {t(`budgetDescriptions.${budgetLevel}`)}
              </Text>
            )}
          </View>

          {/* Generate or Sign In */}
          {isAuthenticated ? (
            <Button
              title={t("camera.analyzeAndRedesign")}
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
                Sign in to optimize your listing
              </Text>
              <Text type="sm" style={{ color: "rgba(255,255,255,0.6)", textAlign: "center", marginTop: 4 }}>
                Create an account to start optimizing your spaces.
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
          Scan Space
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
        Frame your space within the guide
      </Text>

      {/* Bottom controls */}
      <View style={[s.bottomBar, { paddingBottom: insets.bottom + SPACING.MD }]}>
        <View style={s.captureRow}>
          <Pressable onPress={handlePickFromGallery} style={s.galleryButton}>
            <Icon symbol="photo.on.rectangle" size="md" color="#fff" />
          </Pressable>
          <Pressable onPress={handleCapture} style={s.captureButton}>
            <View style={s.captureButtonInner} />
          </Pressable>
          <View style={s.galleryButton} />
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
    gap: 32,
  },
  galleryButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
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
  resultScroll: {
    flex: 1,
  },
  resultActions: {
    paddingHorizontal: SPACING.MD,
    paddingTop: SPACING.MD,
  },
  savedSection: {
    gap: 4,
  },
  savedBadge: {
    backgroundColor: "rgba(22,163,74,0.15)",
    borderRadius: BORDER_RADIUS.FULL,
    paddingVertical: 10,
    alignItems: "center",
  },
  postSaveActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  analysisSection: {
    paddingHorizontal: SPACING.MD,
    marginTop: SPACING.LG,
  },
  scoresContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 8,
  },
  scoreCard: {
    alignItems: "center",
    gap: 2,
  },
  improvementBadge: {
    backgroundColor: "rgba(34,197,94,0.15)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "center",
  },
  issuesList: {
    marginTop: SPACING.SM,
  },
  issueRow: {
    flexDirection: "row",
    gap: 6,
    paddingVertical: 2,
  },
  suggestionsList: {
    marginTop: SPACING.SM,
    gap: SPACING.SM,
  },
  suggestionGroup: {
    gap: 2,
  },
  listingTextSection: {
    paddingHorizontal: SPACING.MD,
    marginTop: SPACING.LG,
  },
  textActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: SPACING.MD,
  },
  generatingTextRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.SM,
    paddingVertical: SPACING.MD,
  },
  resultBottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: SPACING.MD,
    paddingTop: SPACING.MD,
    backgroundColor: "rgba(0,0,0,0.8)",
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
