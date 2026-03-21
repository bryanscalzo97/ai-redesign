// ── Redesign ─────────────────────────────────────────────────────────────────
export type RedesignInput = {
  image_base64: string;
  roomType: string;
  style: string;
  customPrompt?: string;
  guestType?: string;
  budgetLevel?: string;
};

export type RedesignResponse = {
  success: true;
  imageData: string;
};

// ── Room Analysis ────────────────────────────────────────────────────────────
export type RoomAnalysisInput = {
  image_base64: string;
  roomType: string;
  style: string;
  guestType?: string;
  budgetLevel?: string;
};

export type RoomAnalysisResponse = {
  success: true;
  analysis: Record<string, unknown>;
};

// ── Listing Text ─────────────────────────────────────────────────────────────
export type ListingTextInput = {
  roomType: string;
  style: string;
  guestType?: string;
  image_base64?: string;
};

export type ListingTextResponse = {
  success: true;
  listingText: string;
};
