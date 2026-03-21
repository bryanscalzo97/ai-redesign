import type { PropertyRegion, Season, Hemisphere } from "@/types/seasonal";

export const SEASONAL_TIPS: Record<PropertyRegion, Record<Season, string>> = {
  beach: {
    spring: "Photograph open windows and ocean breezes — spring beach trips are booked by dreamers scrolling at work.",
    summer: "Bright towels, cold drinks on the counter, and golden-hour balcony shots convert summer browsers instantly.",
    fall: "Highlight cozy blankets and sunset decks — off-season beach stays sell on tranquility, not crowds.",
    winter: "Show the fireplace and hot cocoa setup — winter beach escapes attract couples seeking quiet romance.",
  },
  city: {
    spring: "Capture fresh flowers on the windowsill with the skyline behind — spring city breaks are all about energy.",
    summer: "Stage the rooftop or balcony with evening lights — summer city travelers want that nightlife-ready vibe.",
    fall: "Warm lighting and a reading nook near the window sell the autumn cityscape story perfectly.",
    winter: "Holiday lights visible from the window plus a warm interior creates irresistible winter city appeal.",
  },
  mountain: {
    spring: "Show wildflowers on the table and open trails visible from the deck — spring hikers book on scenery.",
    summer: "Stage the outdoor dining area and adventure gear storage — summer mountain guests want an active basecamp.",
    fall: "Capture the foliage from every window and add warm throws — fall mountain stays sell themselves with color.",
    winter: "Firewood stacked, hot tub steaming, snow outside — winter mountain listings need that ski-lodge warmth.",
  },
  countryside: {
    spring: "Photograph the garden in bloom and the breakfast nook — spring countryside guests crave pastoral mornings.",
    summer: "Show the hammock, BBQ area, and golden fields — summer countryside bookings peak with outdoor living shots.",
    fall: "Warm kitchen shots with harvest produce and candlelight — fall countryside stays sell on homey nostalgia.",
    winter: "A lit fireplace, wool blankets, and a stocked pantry — winter countryside retreats should feel like a hug.",
  },
  suburban: {
    spring: "Clean garage, tidy yard, and a bright kitchen — spring suburban guests are families planning ahead.",
    summer: "Stage the backyard with a grill and lawn games — summer suburban stays are all about space and fun.",
    fall: "Show the home office setup and cozy living room — fall suburban bookings come from remote workers and families.",
    winter: "Holiday-ready decor and a warm family room — winter suburban listings attract holiday visitors and reunions.",
  },
};

export const REGION_LABELS: Record<PropertyRegion, string> = {
  beach: "Beach",
  city: "City",
  mountain: "Mountain",
  countryside: "Countryside",
  suburban: "Suburban",
};

export const HEMISPHERE_LABELS: Record<Hemisphere, string> = {
  northern: "Northern",
  southern: "Southern",
};

export const SEASON_LABELS: Record<Season, string> = {
  spring: "Spring",
  summer: "Summer",
  fall: "Fall",
  winter: "Winter",
};
