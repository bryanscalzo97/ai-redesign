import type { Project } from "@/types/project";
import type { Suggestion } from "@/types/room-analysis";
import { ROOM_TYPE_LABELS } from "@/types/redesign";

export interface AggregatedSuggestion {
  redesignId: string;
  index: number;
  roomType: string;
  roomLabel: string;
  suggestion: Suggestion;
  checked: boolean;
}

export interface PropertyScore {
  averageScore: number;
  totalEstimatedCost: number;
  completedCost: number;
  rooms: { redesignId: string; roomType: string; roomLabel: string; score: number }[];
  suggestions: AggregatedSuggestion[];
  completedCount: number;
  totalCount: number;
}

export function suggestionKey(redesignId: string, index: number): string {
  return `${redesignId}-${index}`;
}

export function computePropertyScore(project: Project): PropertyScore | null {
  const checked = new Set(project.checkedSuggestions ?? []);

  const rooms: PropertyScore["rooms"] = [];
  const suggestions: AggregatedSuggestion[] = [];
  let totalScore = 0;
  let scoreCount = 0;

  for (const r of project.redesigns) {
    if (!r.roomAnalysis) continue;

    const roomLabel =
      (ROOM_TYPE_LABELS as Record<string, string>)[r.roomType] || r.roomType;

    rooms.push({
      redesignId: r.id,
      roomType: r.roomType,
      roomLabel,
      score: r.roomAnalysis.score,
    });

    totalScore += r.roomAnalysis.score;
    scoreCount++;

    r.roomAnalysis.suggestions.forEach((s, i) => {
      const key = suggestionKey(r.id, i);
      suggestions.push({
        redesignId: r.id,
        index: i,
        roomType: r.roomType,
        roomLabel,
        suggestion: s,
        checked: checked.has(key),
      });
    });
  }

  if (scoreCount === 0) return null;

  let totalEstimatedCost = 0;
  let completedCost = 0;
  let completedCount = 0;

  for (const s of suggestions) {
    const cost = s.suggestion.estimatedCost ?? 0;
    totalEstimatedCost += cost;
    if (s.checked) {
      completedCost += cost;
      completedCount++;
    }
  }

  return {
    averageScore: totalScore / scoreCount,
    totalEstimatedCost,
    completedCost,
    rooms,
    suggestions,
    completedCount,
    totalCount: suggestions.length,
  };
}
