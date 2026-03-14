import type { GuestType, RedesignStyle, RoomType } from "./redesign";

export type PropertyRegion =
  | "beach"
  | "city"
  | "mountain"
  | "countryside"
  | "suburban";

export type Hemisphere = "northern" | "southern";

export type Season = "spring" | "summer" | "fall" | "winter";

export type Urgency = "fresh" | "due" | "overdue";

export interface SeasonalRecommendation {
  styles: RedesignStyle[];
  guestType: GuestType;
  rooms: RoomType[];
  tip: string;
  urgency: Urgency;
  urgencyMessage: string;
  season: Season;
  seasonLabel: string;
}
