import type { RoomAnalysis } from "./room-analysis";

export interface RedesignEntry {
  id: string;
  createdAt: string;
  roomType: string;
  style: string;
  guestType?: string;
  customInstructions?: string;
  beforeImagePath: string;
  afterImagePath: string;
  listingText?: string;
  roomAnalysis?: RoomAnalysis;
}

export interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  coverImagePath?: string;
  redesigns: RedesignEntry[];
  region?: import("./seasonal").PropertyRegion;
  hemisphere?: import("./seasonal").Hemisphere;
}
