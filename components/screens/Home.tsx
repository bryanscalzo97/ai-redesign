import { useRedesignCreation } from "@/context/RedesignCreationContext";
import { CreateRedesign } from "./CreateRedesign";
import { RedesignResult } from "./RedesignResult";

export function Home() {
  const { generatedImage, isGenerating, error, generate, retry, reset } =
    useRedesignCreation();

  if (!generatedImage && !isGenerating && !error) {
    return <CreateRedesign onGenerate={generate} />;
  }

  return (
    <RedesignResult
      generatedImage={generatedImage ?? ""}
      isGenerating={isGenerating}
      error={error}
      onGenerateAnother={reset}
      onRetry={retry}
    />
  );
}
