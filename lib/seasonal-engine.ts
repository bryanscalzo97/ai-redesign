import type {
  Hemisphere,
  PropertyRegion,
  Season,
  SeasonalRecommendation,
  Urgency,
} from "@/types/seasonal";
import type { GuestType, RedesignStyle, RoomType } from "@/types/redesign";
import { SEASONAL_TIPS, SEASON_LABELS } from "@/constants/seasonal-tips";

// ============================================================================
// Season detection
// ============================================================================

export function getSeason(date: Date, hemisphere: Hemisphere): Season {
  const month = date.getMonth(); // 0-11
  let season: Season;
  if (month >= 2 && month <= 4) season = "spring";
  else if (month >= 5 && month <= 7) season = "summer";
  else if (month >= 8 && month <= 10) season = "fall";
  else season = "winter";

  if (hemisphere === "southern") {
    const flip: Record<Season, Season> = {
      spring: "fall",
      summer: "winter",
      fall: "spring",
      winter: "summer",
    };
    season = flip[season];
  }

  return season;
}

export function getSeasonLabel(season: Season, date: Date): string {
  return `${SEASON_LABELS[season]} ${date.getFullYear()}`;
}

// ============================================================================
// Urgency calculation
// ============================================================================

function getUrgency(lastUpdated?: string): {
  urgency: Urgency;
  urgencyMessage: string;
} {
  if (!lastUpdated) {
    return { urgency: "overdue", urgencyMessage: "No photos yet — time to capture your space!" };
  }

  const daysSince = Math.floor(
    (Date.now() - new Date(lastUpdated).getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysSince < 45) {
    return { urgency: "fresh", urgencyMessage: "Your listing photos are up to date." };
  }
  if (daysSince <= 90) {
    return {
      urgency: "due",
      urgencyMessage: `Last updated ${daysSince} days ago — a seasonal refresh could boost bookings.`,
    };
  }
  return {
    urgency: "overdue",
    urgencyMessage: `Last updated ${daysSince} days ago — your listing may look outdated to guests.`,
  };
}

// ============================================================================
// Recommendation table: 5 regions × 4 seasons
// ============================================================================

type RecommendationSet = {
  styles: RedesignStyle[];
  guestType: GuestType;
  rooms: RoomType[];
};

const RECOMMENDATIONS: Record<PropertyRegion, Record<Season, RecommendationSet>> = {
  beach: {
    spring: { styles: ["budget-refresh", "cozy-retreat", "instagram-worthy"], guestType: "couples", rooms: ["bedroom", "outdoor", "living"] },
    summer: { styles: ["budget-refresh", "family-friendly", "instagram-worthy"], guestType: "families", rooms: ["outdoor", "living", "kitchen"] },
    fall: { styles: ["cozy-retreat", "rustic-charm", "budget-refresh"], guestType: "couples", rooms: ["living", "bedroom", "patio"] },
    winter: { styles: ["cozy-retreat", "budget-refresh", "rustic-charm"], guestType: "couples", rooms: ["bedroom", "living", "bathroom"] },
  },
  city: {
    spring: { styles: ["budget-refresh", "instagram-worthy", "cozy-retreat"], guestType: "couples", rooms: ["living", "bedroom", "entryway"] },
    summer: { styles: ["budget-refresh", "instagram-worthy", "cozy-retreat"], guestType: "digital-nomads", rooms: ["living", "patio", "kitchen"] },
    fall: { styles: ["cozy-retreat", "budget-refresh", "business-ready"], guestType: "business", rooms: ["bedroom", "living", "dining"] },
    winter: { styles: ["cozy-retreat", "budget-refresh", "nordic-airbnb"], guestType: "business", rooms: ["living", "bedroom", "entryway"] },
  },
  mountain: {
    spring: { styles: ["rustic-charm", "budget-refresh", "cozy-retreat"], guestType: "couples", rooms: ["outdoor", "living", "kitchen"] },
    summer: { styles: ["rustic-charm", "family-friendly", "budget-refresh"], guestType: "families", rooms: ["outdoor", "patio", "living"] },
    fall: { styles: ["cozy-retreat", "rustic-charm", "budget-refresh"], guestType: "couples", rooms: ["living", "bedroom", "dining"] },
    winter: { styles: ["cozy-retreat", "rustic-charm", "budget-refresh"], guestType: "families", rooms: ["living", "bedroom", "bathroom"] },
  },
  countryside: {
    spring: { styles: ["rustic-charm", "budget-refresh", "family-friendly"], guestType: "families", rooms: ["outdoor", "kitchen", "bedroom"] },
    summer: { styles: ["rustic-charm", "budget-refresh", "family-friendly"], guestType: "families", rooms: ["outdoor", "patio", "kitchen"] },
    fall: { styles: ["cozy-retreat", "rustic-charm", "budget-refresh"], guestType: "couples", rooms: ["kitchen", "living", "dining"] },
    winter: { styles: ["cozy-retreat", "rustic-charm", "budget-refresh"], guestType: "families", rooms: ["living", "bedroom", "kitchen"] },
  },
  suburban: {
    spring: { styles: ["budget-refresh", "family-friendly", "cozy-retreat"], guestType: "families", rooms: ["kitchen", "outdoor", "living"] },
    summer: { styles: ["budget-refresh", "family-friendly", "cozy-retreat"], guestType: "families", rooms: ["outdoor", "patio", "living"] },
    fall: { styles: ["budget-refresh", "cozy-retreat", "family-friendly"], guestType: "digital-nomads", rooms: ["living", "bedroom", "dining"] },
    winter: { styles: ["budget-refresh", "cozy-retreat", "family-friendly"], guestType: "families", rooms: ["living", "bedroom", "entryway"] },
  },
};

// ============================================================================
// Main API
// ============================================================================

export function getSeasonalRecommendation(
  region: PropertyRegion,
  hemisphere: Hemisphere,
  date: Date,
  lastUpdated?: string
): SeasonalRecommendation {
  const season = getSeason(date, hemisphere);
  const seasonLabel = getSeasonLabel(season, date);
  const { urgency, urgencyMessage } = getUrgency(lastUpdated);
  const rec = RECOMMENDATIONS[region][season];
  const tip = SEASONAL_TIPS[region][season];

  return {
    ...rec,
    tip,
    urgency,
    urgencyMessage,
    season,
    seasonLabel,
  };
}
