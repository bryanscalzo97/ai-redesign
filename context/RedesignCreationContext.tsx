import {
  createContext,
  use,
  useCallback,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { saveBase64ToAlbum } from "@/lib/save-to-library";
import type { RedesignCreationInput } from "@/types/redesign";

export interface RedesignCreationState {
  image?: { uri: string; base64: string };
  roomType: string;
  style: string;
  guestType: string;
  customPrompt: string;
  currentStep: number;
  generatedImage?: string;
  isGenerating: boolean;
  error?: string;
  startedAt: Date;
  updatedAt: Date;
}

export interface RedesignCreationActions {
  setImage: (image: { uri: string; base64: string } | undefined) => void;
  setRoomType: (roomType: string) => void;
  setStyle: (style: string) => void;
  setGuestType: (guestType: string) => void;
  setCustomPrompt: (prompt: string) => void;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  generate: (input: RedesignCreationInput) => Promise<void>;
  retry: () => void;
  reset: () => void;
  notifySave: () => void;
}

export interface RedesignCreationContextValue
  extends RedesignCreationState,
    RedesignCreationActions {
  saveCount: number;
}

const TOTAL_STEPS = 3;

const initialState: RedesignCreationState = {
  image: undefined,
  roomType: "",
  style: "",
  guestType: "",
  customPrompt: "",
  currentStep: 1,
  generatedImage: undefined,
  isGenerating: false,
  error: undefined,
  startedAt: new Date(),
  updatedAt: new Date(),
};

export const RedesignCreationContext =
  createContext<RedesignCreationContextValue>({
    ...initialState,
    saveCount: 0,
    setImage: () => {},
    setRoomType: () => {},
    setStyle: () => {},
    setGuestType: () => {},
    setCustomPrompt: () => {},
    setCurrentStep: () => {},
    nextStep: () => {},
    previousStep: () => {},
    generate: async () => {},
    retry: () => {},
    reset: () => {},
    notifySave: () => {},
  });

export function RedesignCreationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, setState] = useState<RedesignCreationState>(initialState);
  const [saveCount, setSaveCount] = useState(0);
  const lastInputRef = useRef<RedesignCreationInput | null>(null);

  const setImage = useCallback(
    (image: { uri: string; base64: string } | undefined) => {
      setState((prev) => ({ ...prev, image, updatedAt: new Date() }));
    },
    []
  );

  const setRoomType = useCallback((roomType: string) => {
    setState((prev) => ({ ...prev, roomType, updatedAt: new Date() }));
  }, []);

  const setStyle = useCallback((style: string) => {
    setState((prev) => ({ ...prev, style, updatedAt: new Date() }));
  }, []);

  const setGuestType = useCallback((guestType: string) => {
    setState((prev) => ({ ...prev, guestType, updatedAt: new Date() }));
  }, []);

  const setCustomPrompt = useCallback((customPrompt: string) => {
    setState((prev) => ({ ...prev, customPrompt, updatedAt: new Date() }));
  }, []);

  const setCurrentStep = useCallback((step: number) => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(1, Math.min(step, TOTAL_STEPS)),
      updatedAt: new Date(),
    }));
  }, []);

  const nextStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, TOTAL_STEPS),
      updatedAt: new Date(),
    }));
  }, []);

  const previousStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 1),
      updatedAt: new Date(),
    }));
  }, []);

  const generate = useCallback(async (input: RedesignCreationInput) => {
    lastInputRef.current = input;
    setState((prev) => ({
      ...prev,
      isGenerating: true,
      error: undefined,
      generatedImage: undefined,
      updatedAt: new Date(),
    }));

    try {
      const response = await fetch("/api/redesign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_base64: input.imageBase64,
          roomType: input.roomType,
          style: input.style,
          customPrompt: input.customInstructions,
          guestType: input.guestType,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setState((prev) => ({
          ...prev,
          isGenerating: false,
          error: data.error || "Something went wrong",
          updatedAt: new Date(),
        }));
        return;
      }

      // Save to photo library automatically
      try {
        await saveBase64ToAlbum(data.imageData, "png");
        setSaveCount((prev) => prev + 1);
      } catch (saveError) {
        console.error("Failed to save to library:", saveError);
      }

      setState((prev) => ({
        ...prev,
        isGenerating: false,
        generatedImage: data.imageData,
        updatedAt: new Date(),
      }));
    } catch {
      setState((prev) => ({
        ...prev,
        isGenerating: false,
        error: "Failed to connect to the server",
        updatedAt: new Date(),
      }));
    }
  }, []);

  const retry = useCallback(() => {
    if (lastInputRef.current) {
      generate(lastInputRef.current);
    }
  }, [generate]);

  const reset = useCallback(() => {
    lastInputRef.current = null;
    setState({ ...initialState, startedAt: new Date(), updatedAt: new Date() });
  }, []);

  const notifySave = useCallback(() => {
    setSaveCount((prev) => prev + 1);
  }, []);

  const contextValue: RedesignCreationContextValue = {
    ...state,
    saveCount,
    setImage,
    setRoomType,
    setStyle,
    setGuestType,
    setCustomPrompt,
    setCurrentStep,
    nextStep,
    previousStep,
    generate,
    retry,
    reset,
    notifySave,
  };

  return (
    <RedesignCreationContext.Provider value={contextValue}>
      {children}
    </RedesignCreationContext.Provider>
  );
}

export function useRedesignCreation() {
  const context = use(RedesignCreationContext);
  if (!context) {
    throw new Error(
      "useRedesignCreation must be used within a RedesignCreationProvider"
    );
  }
  return context;
}
