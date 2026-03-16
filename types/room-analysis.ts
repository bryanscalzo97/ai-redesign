export interface RoomIssue {
  label: string;
}

export interface Suggestion {
  action: "add" | "remove" | "move" | "replace";
  item: string;
  detail?: string;
  estimatedCost?: number;
}

export interface RoomAnalysis {
  score: number;
  afterScore?: number;
  issues: RoomIssue[];
  suggestions: Suggestion[];
}
