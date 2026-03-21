import { Colors } from "./Colors";
import { AppTheme } from "./theme";

/**
 * Semantic color tokens for consistent UI across the app.
 * All screen-level colors should reference these instead of raw hex values.
 */

// ── Surface / Card backgrounds ──────────────────────────────────────────────
export const surface = {
  light: Colors.zinc[100],
  dark: Colors.zinc[900],
} as const;

export const surfaceElevated = {
  light: Colors.zinc[50],
  dark: Colors.zinc[800],
} as const;

// ── Text helpers ────────────────────────────────────────────────────────────
export const textMuted = {
  light: Colors.zinc[500],
  dark: Colors.zinc[400],
} as const;

export const textSubtle = {
  light: Colors.zinc[400],
  dark: Colors.zinc[500],
} as const;

// ── Accent / Links ──────────────────────────────────────────────────────────
// Single accent for the whole app — matches the theme tint
export const accent = {
  light: AppTheme.light.tint, // violet[600]
  dark: AppTheme.dark.tint, // green[500]
} as const;

// ── Score colors (opportunity language) ─────────────────────────────────────
export const scoreColors = {
  high_potential: {
    bg: Colors.indigo[500],
    text: Colors.indigo[700],
    textDark: Colors.indigo[300],
    surface: `${Colors.indigo[500]}18`,
  },
  good: {
    bg: Colors.amber[500],
    text: Colors.amber[700],
    textDark: Colors.amber[400],
    surface: `${Colors.amber[500]}18`,
  },
  optimized: {
    bg: Colors.emerald[500],
    text: Colors.emerald[700],
    textDark: Colors.emerald[400],
    surface: `${Colors.emerald[500]}18`,
  },
} as const;

export function getScoreCategory(score: number) {
  if (score < 4) return scoreColors.high_potential;
  if (score <= 7) return scoreColors.good;
  return scoreColors.optimized;
}

export function getScoreLabel(score: number): string {
  if (score < 4) return "High potential";
  if (score <= 7) return "Good";
  return "Optimized";
}

// ── Urgency colors ──────────────────────────────────────────────────────────
export const urgencyColors = {
  fresh: Colors.emerald[500],
  due: Colors.amber[600],
  overdue: Colors.red[500],
} as const;

// ── Feedback ────────────────────────────────────────────────────────────────
export const success = Colors.emerald[500];
export const warning = Colors.amber[500];
export const error = Colors.red[500];
