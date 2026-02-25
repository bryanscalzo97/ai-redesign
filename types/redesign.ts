export type RoomType =
  | "living"
  | "bedroom"
  | "kitchen"
  | "bathroom"
  | "dining"
  | "office"
  | "outdoor";

export type RedesignStyle =
  | "modern"
  | "minimalist"
  | "cozy"
  | "scandinavian"
  | "industrial"
  | "bohemian"
  | "midcentury"
  | "coastal"
  | "traditional"
  | "luxury";

export type RedesignCreationInput = {
  roomType: RoomType;
  style: RedesignStyle;
  imageBase64: string;
  customInstructions?: string;
};

export const ROOM_TYPE_LABELS: Record<RoomType, string> = {
  living: "Living Room",
  bedroom: "Bedroom",
  kitchen: "Kitchen",
  bathroom: "Bathroom",
  dining: "Dining Room",
  office: "Office",
  outdoor: "Outdoor",
};

export const REDESIGN_STYLE_LABELS: Record<RedesignStyle, string> = {
  modern: "Modern",
  minimalist: "Minimalist",
  cozy: "Cozy",
  scandinavian: "Scandinavian",
  industrial: "Industrial",
  bohemian: "Bohemian",
  midcentury: "Mid-Century",
  coastal: "Coastal",
  traditional: "Traditional",
  luxury: "Luxury",
};
