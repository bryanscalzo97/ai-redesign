import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { CreateRedesign } from "./CreateRedesign";
import type { RedesignCreationInput } from "@/types/redesign";

export function Home() {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = useCallback(async (input: RedesignCreationInput) => {
    if (isGenerating) return;
    setIsGenerating(true);

    try {
      const response = await fetch("/api/redesign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_base64: input.imageBase64,
          roomType: input.roomType,
          style: input.style,
          customPrompt: input.customInstructions,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        Alert.alert("Error", data.error || "Something went wrong");
        return;
      }

      // TODO: Navigate to result screen or show generated image
      console.log("Generation successful, imageData length:", data.imageData.length);
      Alert.alert("Success", "Room redesigned successfully!");
    } catch (error) {
      console.error("Generation error:", error);
      Alert.alert("Error", "Failed to connect to the server");
    } finally {
      setIsGenerating(false);
    }
  }, [isGenerating]);

  return <CreateRedesign onGenerate={handleGenerate} />;
}
