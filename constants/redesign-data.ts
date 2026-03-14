import type { RedesignStyle, RoomType, GuestType } from "@/types/redesign";

export interface StyleInfo {
  key: RedesignStyle;
  label: string;
  description: string;
  image: string;
  gallery: string[];
}

export interface RoomTypeInfo {
  key: RoomType;
  label: string;
  description: string;
  image: string;
  gallery: string[];
}

export interface GuestTypeInfo {
  key: GuestType;
  label: string;
  description: string;
  image: string;
  gallery: string[];
}

export const STYLE_DATA: StyleInfo[] = [
  {
    key: "hotel-boutique",
    label: "Hotel Boutique",
    description:
      "Give your space the polished feel of a boutique hotel. Crisp linens, curated art, and elegant fixtures that make guests feel they're checking into a high-end stay.",
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d955e4c47?w=400&q=80",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400&q=80",
    ],
  },
  {
    key: "cozy-retreat",
    label: "Cozy Retreat",
    description:
      "Warm textures, soft lighting, and layered blankets create an irresistible hideaway. Perfect for listings that promise relaxation and five-star comfort reviews.",
    image: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=400&q=80",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&q=80",
    ],
  },
  {
    key: "resort-style",
    label: "Resort Style",
    description:
      "Bring vacation vibes indoors with tropical accents, natural materials, and airy layouts. Guests will feel like they're at a beachside resort.",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&q=80",
    ],
  },
  {
    key: "urban-lux",
    label: "Urban Lux",
    description:
      "Sleek city living with statement lighting, dark accents, and premium finishes. Ideal for urban listings targeting upscale travelers.",
    image: "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=400&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&q=80",
    ],
  },
  {
    key: "nordic-airbnb",
    label: "Nordic Airbnb",
    description:
      "Scandinavian simplicity meets Airbnb appeal. Light woods, white walls, and functional furniture that photographs beautifully and delights guests.",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80",
      "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&q=80",
    ],
  },
  {
    key: "instagram-worthy",
    label: "Instagram-Worthy",
    description:
      "Bold colors, eye-catching accents, and photogenic corners that guests will share on social media — free marketing for your listing.",
    image: "https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=400&q=80",
      "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=400&q=80",
    ],
  },
  {
    key: "business-ready",
    label: "Business Ready",
    description:
      "A professional workspace setup with ergonomic seating, fast-wifi-ready desk, and clean aesthetics. Attract business travelers and digital nomads.",
    image: "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=400&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&q=80",
    ],
  },
  {
    key: "family-friendly",
    label: "Family Friendly",
    description:
      "Safe, welcoming spaces with practical layouts, durable materials, and thoughtful touches that families love — and review highly.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&q=80",
    ],
  },
  {
    key: "budget-refresh",
    label: "Budget Refresh",
    description:
      "Maximum impact with minimal spend. Smart styling, decluttering, and affordable accents that dramatically improve your listing photos.",
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&q=80",
    ],
  },
  {
    key: "rustic-charm",
    label: "Rustic Charm",
    description:
      "Exposed wood, natural stone, and earthy tones create a warm, authentic character. Perfect for cabins, cottages, and countryside listings.",
    image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=400&q=80",
      "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&q=80",
    ],
  },
];

export const ROOM_TYPE_DATA: RoomTypeInfo[] = [
  {
    key: "living",
    label: "Living Area",
    description:
      "The space guests see first in your listing photos. Stage your living area with inviting furniture, great lighting, and a layout that feels spacious and welcoming.",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&q=80",
    ],
  },
  {
    key: "bedroom",
    label: "Guest Bedroom",
    description:
      "The room guests care about most. Crisp bedding, ambient lighting, and a hotel-like feel that earns top reviews and repeat bookings.",
    image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=400&q=80",
      "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=400&q=80",
    ],
  },
  {
    key: "kitchen",
    label: "Kitchen",
    description:
      "A clean, well-equipped kitchen is a top booking factor. Modernize the look with updated surfaces, organized counters, and inviting styling.",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80",
    ],
  },
  {
    key: "bathroom",
    label: "Bathroom",
    description:
      "Turn your bathroom into a spa-like experience. Fresh towels, modern fixtures, and clean lines that photograph like a luxury hotel.",
    image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=400&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&q=80",
    ],
  },
  {
    key: "dining",
    label: "Dining Room",
    description:
      "A well-staged dining area suggests memorable meals and gatherings. Show guests an inviting table setting that adds perceived value to your listing.",
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80",
    ],
  },
  {
    key: "entryway",
    label: "Entryway",
    description:
      "First impressions matter. A styled entryway with smart storage and warm lighting sets the tone for a great guest experience from the moment they arrive.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80",
      "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=400&q=80",
    ],
  },
  {
    key: "outdoor",
    label: "Outdoor",
    description:
      "Outdoor spaces are a huge differentiator. Stage your yard, garden, or deck to showcase the full potential of your property.",
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&q=80",
    ],
  },
  {
    key: "patio",
    label: "Patio / Balcony",
    description:
      "Patios and balconies are guest favorites. Add comfortable seating, plants, and ambient lighting to create an irresistible outdoor living space.",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&q=80",
    ],
  },
];

export const GUEST_TYPE_DATA: GuestTypeInfo[] = [
  {
    key: "business",
    label: "Business",
    description:
      "Business travelers value a dedicated workspace, fast Wi-Fi, good lighting, and a quiet environment. They want convenience and professionalism.",
    image: "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=400&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&q=80",
    ],
  },
  {
    key: "couples",
    label: "Couples",
    description:
      "Couples look for romantic ambiance, cozy bedding, warm lighting, and intimate spaces. Think candles, soft textures, and a relaxing vibe.",
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&q=80",
      "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=400&q=80",
    ],
  },
  {
    key: "families",
    label: "Families",
    description:
      "Families need safe, spacious layouts with durable furniture, storage for luggage, and a welcoming atmosphere that works for all ages.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&q=80",
    ],
  },
  {
    key: "digital-nomads",
    label: "Digital Nomads",
    description:
      "Digital nomads want a great desk setup, natural light, comfortable seating for long work sessions, and a space that inspires productivity.",
    image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&q=80",
      "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=400&q=80",
    ],
  },
];

export function findStyleByKey(key: string): StyleInfo | undefined {
  return STYLE_DATA.find((s) => s.key === key);
}

export function findRoomTypeByKey(key: string): RoomTypeInfo | undefined {
  return ROOM_TYPE_DATA.find((r) => r.key === key);
}

export function findGuestTypeByKey(key: string): GuestTypeInfo | undefined {
  return GUEST_TYPE_DATA.find((g) => g.key === key);
}
