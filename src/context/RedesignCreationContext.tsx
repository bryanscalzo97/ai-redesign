import {
  createContext,
  use,
  useCallback,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { generateRedesign, analyzeRoom as analyzeRoomMutation } from "@/core/mutations";
import { ApiError } from "@/core/api-client";
import { saveBase64ToAlbum } from "@/lib/save-to-library";
import type { RedesignCreationInput } from "@/types/redesign";
import type { RoomAnalysis } from "@/types/room-analysis";

// ── State ────────────────────────────────────────────────────────────────────

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
  roomAnalysis?: RoomAnalysis;
  isAnalyzing: boolean;
  startedAt: Date;
  updatedAt: Date;
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
  roomAnalysis: undefined,
  isAnalyzing: false,
  startedAt: new Date(),
  updatedAt: new Date(),
};

// ── Actions ──────────────────────────────────────────────────────────────────

type Action =
  | { type: "SET_IMAGE"; image: RedesignCreationState["image"] }
  | { type: "SET_ROOM_TYPE"; roomType: string }
  | { type: "SET_STYLE"; style: string }
  | { type: "SET_GUEST_TYPE"; guestType: string }
  | { type: "SET_CUSTOM_PROMPT"; customPrompt: string }
  | { type: "SET_STEP"; step: number }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "GENERATE_START" }
  | { type: "GENERATE_SUCCESS"; imageData: string }
  | { type: "GENERATE_ERROR"; error: string }
  | { type: "ANALYSIS_START" }
  | { type: "ANALYSIS_SUCCESS"; analysis: RoomAnalysis }
  | { type: "ANALYSIS_FAIL" }
  | { type: "RESET" };

function reducer(state: RedesignCreationState, action: Action): RedesignCreationState {
  const now = new Date();
  switch (action.type) {
    case "SET_IMAGE":
      return { ...state, image: action.image, updatedAt: now };
    case "SET_ROOM_TYPE":
      return { ...state, roomType: action.roomType, updatedAt: now };
    case "SET_STYLE":
      return { ...state, style: action.style, updatedAt: now };
    case "SET_GUEST_TYPE":
      return { ...state, guestType: action.guestType, updatedAt: now };
    case "SET_CUSTOM_PROMPT":
      return { ...state, customPrompt: action.customPrompt, updatedAt: now };
    case "SET_STEP":
      return { ...state, currentStep: Math.max(1, Math.min(action.step, TOTAL_STEPS)), updatedAt: now };
    case "NEXT_STEP":
      return { ...state, currentStep: Math.min(state.currentStep + 1, TOTAL_STEPS), updatedAt: now };
    case "PREV_STEP":
      return { ...state, currentStep: Math.max(state.currentStep - 1, 1), updatedAt: now };
    case "GENERATE_START":
      return { ...state, isGenerating: true, error: undefined, generatedImage: undefined, updatedAt: now };
    case "GENERATE_SUCCESS":
      return { ...state, isGenerating: false, generatedImage: action.imageData, roomAnalysis: undefined, isAnalyzing: true, updatedAt: now };
    case "GENERATE_ERROR":
      return { ...state, isGenerating: false, error: action.error, updatedAt: now };
    case "ANALYSIS_START":
      return { ...state, isAnalyzing: true, roomAnalysis: undefined, updatedAt: now };
    case "ANALYSIS_SUCCESS":
      return { ...state, roomAnalysis: action.analysis, isAnalyzing: false, updatedAt: now };
    case "ANALYSIS_FAIL":
      return { ...state, isAnalyzing: false, updatedAt: now };
    case "RESET":
      return { ...initialState, startedAt: now, updatedAt: now };
  }
}

// ── Context ──────────────────────────────────────────────────────────────────

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
  analyzeRoom: () => Promise<void>;
  retry: () => void;
  reset: () => void;
  notifySave: () => void;
}

export interface RedesignCreationContextValue
  extends RedesignCreationState,
    RedesignCreationActions {
  saveCount: number;
}

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
    analyzeRoom: async () => {},
    retry: () => {},
    reset: () => {},
    notifySave: () => {},
  });

// ── Provider ─────────────────────────────────────────────────────────────────

export function RedesignCreationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [saveCount, setSaveCount] = useState(0);
  const lastInputRef = useRef<RedesignCreationInput | null>(null);

  const setImage = useCallback(
    (image: { uri: string; base64: string } | undefined) =>
      dispatch({ type: "SET_IMAGE", image }),
    [],
  );
  const setRoomType = useCallback(
    (roomType: string) => dispatch({ type: "SET_ROOM_TYPE", roomType }),
    [],
  );
  const setStyle = useCallback(
    (style: string) => dispatch({ type: "SET_STYLE", style }),
    [],
  );
  const setGuestType = useCallback(
    (guestType: string) => dispatch({ type: "SET_GUEST_TYPE", guestType }),
    [],
  );
  const setCustomPrompt = useCallback(
    (customPrompt: string) => dispatch({ type: "SET_CUSTOM_PROMPT", customPrompt }),
    [],
  );
  const setCurrentStep = useCallback(
    (step: number) => dispatch({ type: "SET_STEP", step }),
    [],
  );
  const nextStep = useCallback(() => dispatch({ type: "NEXT_STEP" }), []);
  const previousStep = useCallback(() => dispatch({ type: "PREV_STEP" }), []);

  const generate = useCallback(async (input: RedesignCreationInput) => {
    lastInputRef.current = input;
    dispatch({ type: "GENERATE_START" });

    try {
      const data = await generateRedesign({
        image_base64: input.imageBase64,
        roomType: input.roomType,
        style: input.style,
        customPrompt: input.customInstructions,
        guestType: input.guestType,
        budgetLevel: input.budgetLevel,
      });

      // Save to photo library automatically
      try {
        await saveBase64ToAlbum(data.imageData, "png");
        setSaveCount((prev) => prev + 1);
      } catch (saveError) {
        console.error("Failed to save to library:", saveError);
      }

      dispatch({ type: "GENERATE_SUCCESS", imageData: data.imageData });

      // Fire both analyses in parallel: original image + redesigned image
      const analysisBody = {
        roomType: input.roomType,
        style: input.style,
        guestType: input.guestType,
        budgetLevel: input.budgetLevel,
      };

      Promise.all([
        analyzeRoomMutation({ ...analysisBody, image_base64: input.imageBase64 }),
        analyzeRoomMutation({ ...analysisBody, image_base64: data.imageData }),
      ])
        .then(([beforeResult, afterResult]) => {
          const analysis = beforeResult.analysis;
          if (afterResult.analysis) {
            (analysis as any).afterScore = (afterResult.analysis as any).score;
          }
          dispatch({
            type: "ANALYSIS_SUCCESS",
            analysis: analysis as unknown as RoomAnalysis,
          });
        })
        .catch((err) => {
          console.error("Room analysis request failed:", err);
          dispatch({ type: "ANALYSIS_FAIL" });
        });
    } catch (err) {
      dispatch({
        type: "GENERATE_ERROR",
        error: err instanceof ApiError ? err.message : "Failed to connect to the server",
      });
    }
  }, []);

  const analyzeRoom = useCallback(async () => {
    const input = lastInputRef.current;
    if (!input) return;

    dispatch({ type: "ANALYSIS_START" });

    try {
      const result = await analyzeRoomMutation({
        image_base64: input.imageBase64,
        roomType: input.roomType,
        style: input.style,
        guestType: input.guestType,
        budgetLevel: input.budgetLevel,
      });
      dispatch({
        type: "ANALYSIS_SUCCESS",
        analysis: result.analysis as unknown as RoomAnalysis,
      });
    } catch {
      dispatch({ type: "ANALYSIS_FAIL" });
    }
  }, []);

  const retry = useCallback(() => {
    if (lastInputRef.current) {
      generate(lastInputRef.current);
    }
  }, [generate]);

  const reset = useCallback(() => {
    lastInputRef.current = null;
    dispatch({ type: "RESET" });
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
    analyzeRoom,
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
