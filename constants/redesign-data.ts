import type { RedesignStyle, RoomType } from "@/types/redesign";

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

export const STYLE_DATA: StyleInfo[] = [
  {
    key: "modern",
    label: "Modern",
    description:
      "Clean lines, open spaces, and a neutral color palette define the modern style. Expect sleek furniture, large windows, and minimal ornamentation that creates a fresh, uncluttered feel.",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80",
      "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=400&q=80",
    ],
  },
  {
    key: "minimalist",
    label: "Minimalist",
    description:
      "Less is more. Minimalist design strips away excess to focus on essential elements. Monochromatic tones, simple forms, and purposeful furniture create a calm, intentional space.",
    image: "https://images.unsplash.com/photo-1598928506311-c55ez637a58a?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1598928506311-c55ez637a58a?w=400&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80",
    ],
  },
  {
    key: "cozy",
    label: "Cozy",
    description:
      "Warm textures, soft lighting, and plush materials make a space feel like a hug. Think layered blankets, warm wood tones, candles, and inviting seating arrangements.",
    image: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=400&q=80",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&q=80",
    ],
  },
  {
    key: "scandinavian",
    label: "Scandinavian",
    description:
      "Inspired by Nordic simplicity. Light woods, white walls, functional furniture, and pops of muted color create bright, airy spaces that balance form and function.",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80",
      "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&q=80",
    ],
  },
  {
    key: "industrial",
    label: "Industrial",
    description:
      "Raw, unfinished aesthetics meet urban edge. Exposed brick, metal fixtures, concrete floors, and open ductwork give spaces a warehouse-turned-loft character.",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&q=80",
    ],
  },
  {
    key: "bohemian",
    label: "Bohemian",
    description:
      "Eclectic, colorful, and free-spirited. Bohemian interiors mix patterns, textures, and global influences with plants, macramé, and vintage finds for a lived-in, artistic feel.",
    image: "https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=400&q=80",
      "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=400&q=80",
    ],
  },
  {
    key: "midcentury",
    label: "Mid-Century",
    description:
      "Retro charm from the 1950s-60s. Organic curves, tapered legs, bold accent colors, and iconic furniture pieces like Eames chairs define this timeless style.",
    image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80",
    ],
  },
  {
    key: "coastal",
    label: "Coastal",
    description:
      "Breezy, beach-inspired living. Light blues, sandy neutrals, natural fibers, and ocean-inspired accents bring the relaxed feel of seaside life into any room.",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&q=80",
    ],
  },
  {
    key: "traditional",
    label: "Traditional",
    description:
      "Classic elegance with rich wood furniture, ornate details, symmetrical layouts, and warm color palettes. Think crown molding, wingback chairs, and timeless sophistication.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80",
      "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=400&q=80",
    ],
  },
  {
    key: "luxury",
    label: "Luxury",
    description:
      "Opulent materials, statement lighting, and high-end finishes elevate every detail. Marble, velvet, gold accents, and custom furniture create an atmosphere of refined indulgence.",
    image: "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=400&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&q=80",
    ],
  },
];

export const ROOM_TYPE_DATA: RoomTypeInfo[] = [
  {
    key: "living",
    label: "Living Room",
    description:
      "The heart of the home where family and guests gather. Transform your living room with new layouts, furniture arrangements, and color schemes that match your lifestyle.",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&q=80",
    ],
  },
  {
    key: "bedroom",
    label: "Bedroom",
    description:
      "Your personal sanctuary for rest and relaxation. Reimagine your bedroom with calming colors, cozy textures, and smart storage solutions.",
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
      "Where culinary creativity meets design. Modernize your kitchen with new cabinetry, countertops, and layout ideas that make cooking a pleasure.",
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
      "Turn your bathroom into a spa-like retreat. Explore tile patterns, vanity styles, and lighting that elevate your daily routine.",
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
      "Set the scene for memorable meals. From formal dining to casual breakfast nooks, find the perfect table, lighting, and ambiance for your space.",
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80",
    ],
  },
  {
    key: "office",
    label: "Office",
    description:
      "Design a workspace that boosts productivity and creativity. Ergonomic setups, smart storage, and inspiring aesthetics for your home office.",
    image: "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=400&q=80",
      "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&q=80",
    ],
  },
  {
    key: "outdoor",
    label: "Outdoor",
    description:
      "Extend your living space outside. Patios, gardens, decks, and balconies transformed with furniture, greenery, and lighting for year-round enjoyment.",
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&q=80",
    ],
  },
];

export function findStyleByKey(key: string): StyleInfo | undefined {
  return STYLE_DATA.find((s) => s.key === key);
}

export function findRoomTypeByKey(key: string): RoomTypeInfo | undefined {
  return ROOM_TYPE_DATA.find((r) => r.key === key);
}
