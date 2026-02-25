import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Text } from "@/components/ui/Text";
import { useAccentColor } from "@/hooks/useAccentColor";
import { useColorScheme } from "@/hooks/useColorScheme";
import { usePlatform } from "@/hooks/usePlatform";
import { AppTheme } from "@/constants/theme";
import {
  REDESIGN_STYLE_LABELS,
  ROOM_TYPE_LABELS,
  type RedesignCreationInput,
  type RedesignStyle,
  type RoomType,
} from "@/types/redesign";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useCallback, useState } from "react";
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { createRedesignStyles as styles } from "./CreateRedesign.styles";

type OnGenerateFn = (input: RedesignCreationInput) => void;

type CreateRedesignProps = {
  onGenerate?: OnGenerateFn;
};

export function CreateRedesign({ onGenerate }: CreateRedesignProps) {
  const { getBackgroundColor } = useAccentColor();
  const backgroundColor = getBackgroundColor();
  const colorScheme = useColorScheme();
  const { isAndroid } = usePlatform();
  const { top } = useSafeAreaInsets();

  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [roomType, setRoomType] = useState<RoomType | null>(null);
  const [style, setStyle] = useState<RedesignStyle | null>(null);
  const [customInstructions, setCustomInstructions] = useState("");

  const theme = colorScheme === "dark" ? AppTheme.dark : AppTheme.light;
  const roomTypes = Object.keys(ROOM_TYPE_LABELS) as RoomType[];
  const redesignStyles = Object.keys(REDESIGN_STYLE_LABELS) as RedesignStyle[];

  const pickImageFromGallery = useCallback(async () => {
    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Please grant photo library access to select an image.",
        [{ text: "OK" }, { text: "Open Settings", onPress: () => Linking.openSettings() }]
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0]?.base64) {
      setImageBase64(result.assets[0].base64);
    }
  }, []);

  const takePhoto = useCallback(async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Please grant camera access to take a photo.",
        [{ text: "OK" }, { text: "Open Settings", onPress: () => Linking.openSettings() }]
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0]?.base64) {
      setImageBase64(result.assets[0].base64);
    }
  }, []);

  const handleImagePress = useCallback(() => {
    Alert.alert("Add photo", "Choose a source", [
      { text: "Camera", onPress: takePhoto },
      { text: "Gallery", onPress: pickImageFromGallery },
      { text: "Cancel", style: "cancel" },
    ]);
  }, [takePhoto, pickImageFromGallery]);

  const handleGenerate = useCallback(() => {
    if (!imageBase64 || !roomType || !style) return;

    const input: RedesignCreationInput = {
      roomType,
      style,
      imageBase64,
      customInstructions: customInstructions.trim() || undefined,
    };

    if (onGenerate) {
      onGenerate(input);
    } else {
      console.log("Generate (stub):", {
        roomType,
        style,
        customInstructions: input.customInstructions,
        imageLength: imageBase64.length,
      });
    }
  }, [imageBase64, roomType, style, customInstructions, onGenerate]);

  const canGenerate = Boolean(imageBase64 && roomType && style);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="always"
      style={[styles.container, { backgroundColor }]}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingTop: isAndroid ? top : 0 },
      ]}
    >
      <View style={[styles.section, { marginTop: isAndroid ? top : 0 }]}>
        <Text
          type="body"
          weight="semibold"
          lightColor="black"
          darkColor="white"
          style={styles.sectionTitle}
        >
          Room photo
        </Text>
        <Pressable onPress={handleImagePress}>
          {imageBase64 ? (
            <Image
              source={{ uri: `data:image/jpeg;base64,${imageBase64}` }}
              style={styles.imagePreview}
              contentFit="cover"
            />
          ) : (
            <View
              style={[
                styles.imagePlaceholder,
                { borderColor: theme.border },
              ]}
            >
              <Text
                type="body"
                weight="normal"
                lightColor="black"
                darkColor="white"
                style={styles.imagePlaceholderText}
              >
                Tap to add photo (camera or gallery)
              </Text>
            </View>
          )}
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text
          type="body"
          weight="semibold"
          lightColor="black"
          darkColor="white"
          style={styles.sectionTitle}
        >
          Room type
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContainer}
        >
          {roomTypes.map((key) => {
            const isSelected = roomType === key;
            return (
              <Pressable
                key={key}
                onPress={() => setRoomType(key)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: isSelected
                      ? theme.tint
                      : theme.border,
                  },
                  isSelected ? styles.chipSelected : styles.chipUnselected,
                ]}
              >
                <Text
                  type="body"
                  weight={isSelected ? "semibold" : "normal"}
                  style={{
                    color: isSelected ? "#FFFFFF" : theme.text,
                  }}
                >
                  {ROOM_TYPE_LABELS[key]}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text
          type="body"
          weight="semibold"
          lightColor="black"
          darkColor="white"
          style={styles.sectionTitle}
        >
          Redesign style
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContainer}
        >
          {redesignStyles.map((key) => {
            const isSelected = style === key;
            return (
              <Pressable
                key={key}
                onPress={() => setStyle(key)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: isSelected
                      ? theme.tint
                      : theme.border,
                  },
                  isSelected ? styles.chipSelected : styles.chipUnselected,
                ]}
              >
                <Text
                  type="body"
                  weight={isSelected ? "semibold" : "normal"}
                  style={{
                    color: isSelected ? "#FFFFFF" : theme.text,
                  }}
                >
                  {REDESIGN_STYLE_LABELS[key]}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text
          type="body"
          weight="semibold"
          lightColor="black"
          darkColor="white"
          style={styles.sectionTitle}
        >
          Extra instructions (optional)
        </Text>
        <Input
          placeholder="e.g. more natural light, neutral colors..."
          value={customInstructions}
          onChangeText={setCustomInstructions}
          multiline
          style={styles.instructionsInput}
        />
      </View>

      <Button
        title="Generar"
        onPress={handleGenerate}
        disabled={!canGenerate}
        variant="solid"
        size="lg"
        style={styles.generateButton}
        symbol="wand.and.stars"
      />
    </ScrollView>
  );
}
