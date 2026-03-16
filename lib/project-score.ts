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

// ── ROI Estimation ──────────────────────────────────────────────────────────

export interface ROIEstimate {
  currentScore: number;
  projectedScore: number;
  bookingLiftPercent: number;
  extraMonthlyRevenue: number;
  paybackWeeks: number;
  investmentCost: number;
}

/**
 * Estimates ROI based on score improvement and nightly rate.
 *
 * Model (simplified but defensible):
 * - Each point of score improvement above current → ~8% more bookings
 * - Assumes 50% baseline occupancy (15 nights/month)
 * - Extra bookings = baseline nights × lift%
 * - Extra revenue = extra nights × nightly rate
 * - Payback = total cost / extra monthly revenue
 */
export function estimateROI(
  propertyScore: PropertyScore,
  nightlyRate: number
): ROIEstimate | null {
  if (nightlyRate <= 0) return null;

  const currentScore = propertyScore.averageScore;
  // Projected score: assume completing all items brings score to ~8.0
  // (conservative — we don't promise 10)
  const projectedScore = Math.min(
    10,
    currentScore + (10 - currentScore) * 0.5
  );
  const scoreDelta = projectedScore - currentScore;
  if (scoreDelta <= 0) return null;

  const liftPerPoint = 0.08; // 8% more bookings per score point
  const bookingLiftPercent = Math.round(scoreDelta * liftPerPoint * 100);

  const baselineNightsPerMonth = 15; // 50% occupancy
  const extraNights = baselineNightsPerMonth * (scoreDelta * liftPerPoint);
  const extraMonthlyRevenue = Math.round(extraNights * nightlyRate);

  const investmentCost = propertyScore.totalEstimatedCost - propertyScore.completedCost;
  const paybackWeeks =
    extraMonthlyRevenue > 0
      ? Math.max(1, Math.round((investmentCost / extraMonthlyRevenue) * 4.33))
      : 0;

  return {
    currentScore,
    projectedScore,
    bookingLiftPercent,
    extraMonthlyRevenue,
    paybackWeeks,
    investmentCost,
  };
}

// ── Portfolio-level aggregation ─────────────────────────────────────────────

export interface PortfolioSummary {
  totalProperties: number;
  scannedProperties: number;
  overallAverageScore: number;
  totalPendingActions: number;
  totalPendingCost: number;
  totalCompletedActions: number;
  properties: {
    project: Project;
    score: PropertyScore;
  }[];
  worstProperty: Project | null;
}

export function computePortfolioSummary(
  projects: Project[]
): PortfolioSummary {
  const scored: { project: Project; score: PropertyScore }[] = [];
  let totalScore = 0;
  let totalPending = 0;
  let totalPendingCost = 0;
  let totalCompleted = 0;

  for (const p of projects) {
    const ps = computePropertyScore(p);
    if (!ps) continue;
    scored.push({ project: p, score: ps });
    totalScore += ps.averageScore;
    totalPending += ps.totalCount - ps.completedCount;
    totalPendingCost += ps.totalEstimatedCost - ps.completedCost;
    totalCompleted += ps.completedCount;
  }

  // Sort by score ascending (worst first)
  scored.sort((a, b) => a.score.averageScore - b.score.averageScore);

  return {
    totalProperties: projects.length,
    scannedProperties: scored.length,
    overallAverageScore: scored.length > 0 ? totalScore / scored.length : 0,
    totalPendingActions: totalPending,
    totalPendingCost,
    totalCompletedActions: totalCompleted,
    properties: scored,
    worstProperty: scored.length > 0 ? scored[0].project : null,
  };
}
