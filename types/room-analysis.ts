export interface RoomIssue {
  label: string;
}

export interface Suggestion {
  action: "add" | "remove" | "move" | "replace";
  item: string;
  detail?: string;
}

export interface RoomAnalysis {
  score: number;
  issues: RoomIssue[];
  suggestions: Suggestion[];
}
