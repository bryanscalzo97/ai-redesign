import {
  createContext,
  use,
  useCallback,
  useState,
  type ReactNode,
} from "react";

export interface RedesignCreationState {
  image?: { uri: string; base64: string };
  roomType: string;
  style: string;
  customPrompt: string;
  currentStep: number;
  generatedImage?: string; // base64
  isGenerating: boolean;
  startedAt: Date;
  updatedAt: Date;
}

export interface RedesignCreationActions {
  setImage: (image: { uri: string; base64: string } | undefined) => void;
  setRoomType: (roomType: string) => void;
  setStyle: (style: string) => void;
  setCustomPrompt: (prompt: string) => void;
  setGeneratedImage: (imageData: string | undefined) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  reset: () => void;
}

export interface RedesignCreationContextValue
  extends RedesignCreationState,
    RedesignCreationActions {}

const TOTAL_STEPS = 3; // 1) Photo, 2) Style, 3) Result

const initialState: RedesignCreationState = {
  image: undefined,
  roomType: "",
  style: "",
  customPrompt: "",
  currentStep: 1,
  generatedImage: undefined,
  isGenerating: false,
  startedAt: new Date(),
  updatedAt: new Date(),
};

export const RedesignCreationContext =
  createContext<RedesignCreationContextValue>({
    ...initialState,
    setImage: () => {},
    setRoomType: () => {},
    setStyle: () => {},
    setCustomPrompt: () => {},
    setGeneratedImage: () => {},
    setIsGenerating: () => {},
    setCurrentStep: () => {},
    nextStep: () => {},
    previousStep: () => {},
    reset: () => {},
  });

export function RedesignCreationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, setState] = useState<RedesignCreationState>(initialState);

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

  const setCustomPrompt = useCallback((customPrompt: string) => {
    setState((prev) => ({ ...prev, customPrompt, updatedAt: new Date() }));
  }, []);

  const setGeneratedImage = useCallback(
    (generatedImage: string | undefined) => {
      setState((prev) => ({ ...prev, generatedImage, updatedAt: new Date() }));
    },
    []
  );

  const setIsGenerating = useCallback((isGenerating: boolean) => {
    setState((prev) => ({ ...prev, isGenerating, updatedAt: new Date() }));
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

  const reset = useCallback(() => {
    setState({ ...initialState, startedAt: new Date(), updatedAt: new Date() });
  }, []);

  const contextValue: RedesignCreationContextValue = {
    ...state,
    setImage,
    setRoomType,
    setStyle,
    setCustomPrompt,
    setGeneratedImage,
    setIsGenerating,
    setCurrentStep,
    nextStep,
    previousStep,
    reset,
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
