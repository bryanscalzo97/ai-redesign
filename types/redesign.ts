export type RoomType =
  | "living"
  | "bedroom"
  | "kitchen"
  | "bathroom"
  | "dining"
  | "entryway"
  | "outdoor"
  | "patio";

export type RedesignStyle =
  | "hotel-boutique"
  | "cozy-retreat"
  | "resort-style"
  | "urban-lux"
  | "nordic-airbnb"
  | "instagram-worthy"
  | "business-ready"
  | "family-friendly"
  | "budget-refresh"
  | "rustic-charm";

export type GuestType = "business" | "couples" | "families" | "digital-nomads";

export type RedesignCreationInput = {
  roomType: RoomType;
  style: RedesignStyle;
  imageBase64: string;
  customInstructions?: string;
  guestType?: GuestType;
};

export const ROOM_TYPE_LABELS: Record<RoomType, string> = {
  living: "Living Area",
  bedroom: "Guest Bedroom",
  kitchen: "Kitchen",
  bathroom: "Bathroom",
  dining: "Dining Room",
  entryway: "Entryway",
  outdoor: "Outdoor",
  patio: "Patio / Balcony",
};

export const REDESIGN_STYLE_LABELS: Record<RedesignStyle, string> = {
  "hotel-boutique": "Hotel Boutique",
  "cozy-retreat": "Cozy Retreat",
  "resort-style": "Resort Style",
  "urban-lux": "Urban Lux",
  "nordic-airbnb": "Nordic Airbnb",
  "instagram-worthy": "Instagram-Worthy",
  "business-ready": "Business Ready",
  "family-friendly": "Family Friendly",
  "budget-refresh": "Budget Refresh",
  "rustic-charm": "Rustic Charm",
};

export const GUEST_TYPE_LABELS: Record<GuestType, string> = {
  business: "Business",
  couples: "Couples",
  families: "Families",
  "digital-nomads": "Digital Nomads",
};
