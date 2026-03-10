import { useCallback, useRef, useState } from "react";
import { CreateRedesign } from "./CreateRedesign";
import { RedesignResult } from "./RedesignResult";
import type { RedesignCreationInput } from "@/types/redesign";

type Screen = "create" | "generating" | "result" | "error";

export function Home() {
  const [screen, setScreen] = useState<Screen>("create");
  const [generatedImage, setGeneratedImage] = useState("");
  const [error, setError] = useState("");
  const lastInputRef = useRef<RedesignCreationInput | null>(null);

  const handleGenerate = useCallback(async (input: RedesignCreationInput) => {
    lastInputRef.current = input;
    setScreen("generating");
    setError("");

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
        setError(data.error || "Something went wrong");
        setScreen("error");
        return;
      }

      setGeneratedImage(data.imageData);
      setScreen("result");
    } catch (err) {
      setError("Failed to connect to the server");
      setScreen("error");
    }
  }, []);

  const handleGenerateAnother = useCallback(() => {
    setGeneratedImage("");
    setError("");
    setScreen("create");
  }, []);

  const handleRetry = useCallback(() => {
    if (lastInputRef.current) {
      handleGenerate(lastInputRef.current);
    }
  }, [handleGenerate]);

  if (screen === "create") {
    return <CreateRedesign onGenerate={handleGenerate} />;
  }

  return (
    <RedesignResult
      generatedImage={generatedImage}
      isGenerating={screen === "generating"}
      error={screen === "error" ? error : undefined}
      onGenerateAnother={handleGenerateAnother}
      onRetry={handleRetry}
    />
  );
}
