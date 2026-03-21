import { apiFetch } from "./api-client";
import type {
  RedesignInput,
  RedesignResponse,
  RoomAnalysisInput,
  RoomAnalysisResponse,
  ListingTextInput,
  ListingTextResponse,
} from "./api-types";

export function generateRedesign(
  input: RedesignInput,
  signal?: AbortSignal,
): Promise<RedesignResponse> {
  return apiFetch<RedesignResponse>("/api/redesign", { body: input, signal });
}

export function analyzeRoom(
  input: RoomAnalysisInput,
  signal?: AbortSignal,
): Promise<RoomAnalysisResponse> {
  return apiFetch<RoomAnalysisResponse>("/api/room-analysis", {
    body: input,
    signal,
  });
}

export function generateListingText(
  input: ListingTextInput,
  signal?: AbortSignal,
): Promise<ListingTextResponse> {
  return apiFetch<ListingTextResponse>("/api/listing-text", {
    body: input,
    signal,
  });
}
