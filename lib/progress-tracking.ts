import type { Project, RedesignEntry } from "@/types/project";

export interface RoomProgress {
  firstScore: number;
  latestScore: number;
  improvement: number;
  improvementPercent: number;
}

export function getRoomHistory(
  project: Project,
  roomType: string
): RedesignEntry[] {
  return project.redesigns
    .filter((r) => r.roomType === roomType && r.roomAnalysis)
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
}

export function computeProgress(history: RedesignEntry[]): RoomProgress | null {
  if (history.length < 2) return null;

  const firstScore = history[0].roomAnalysis!.score;
  const latestScore = history[history.length - 1].roomAnalysis!.score;
  const improvement = latestScore - firstScore;
  const improvementPercent =
    firstScore > 0 ? Math.round((improvement / firstScore) * 100) : 0;

  return { firstScore, latestScore, improvement, improvementPercent };
}

export interface RoomGroup {
  roomType: string;
  entries: RedesignEntry[];
  progress: RoomProgress | null;
}

export function groupRedesignsByRoom(project: Project): RoomGroup[] {
  const groups = new Map<string, RedesignEntry[]>();

  for (const r of project.redesigns) {
    const existing = groups.get(r.roomType) ?? [];
    existing.push(r);
    groups.set(r.roomType, existing);
  }

  const result: RoomGroup[] = [];
  for (const [roomType, entries] of groups) {
    const sorted = entries
      .filter((e) => e.roomAnalysis)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    result.push({
      roomType,
      entries,
      progress: computeProgress(sorted),
    });
  }

  return result;
}
