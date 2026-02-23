/**
 * Design Tokens - Centralized constants for consistent UI
 * Eliminates magic numbers and provides semantic naming
 */

// =============================================================================
// COLOR SHADES
// =============================================================================
export const COLOR_SHADES = {
  /** Lightest shade - typically white or very light */
  LIGHTEST: 50,
  /** Very light shade */
  VERY_LIGHT: 100,
  /** Light shade */
  LIGHT: 400,
  /** Medium shade - default for most colors */
  MEDIUM: 500,
  /** Semi-dark shade */
  SEMI_DARK: 600,
  /** Dark shade */
  DARK: 700,
  /** Very dark shade */
  VERY_DARK: 800,
  /** Darkest shade - typically black or very dark */
  DARKEST: 950,
} as const;

// =============================================================================
// OPACITY VALUES
// =============================================================================
export const OPACITY = {
  /** Subtle background opacity for light mode */
  BACKGROUND_LIGHT: "10",
  /** Subtle background opacity for dark mode */  
  BACKGROUND_DARK: "20",
  /** Placeholder opacity for light mode */
  PLACEHOLDER_LIGHT: "66",
  /** Placeholder opacity for dark mode */
  PLACEHOLDER_DARK: "99",
  /** Disabled state opacity */
  DISABLED: 0.5,
  /** Pressed state opacity */
  PRESSED: 0.9,
  /** Muted text opacity */
  MUTED: 0.6,
} as const;

// =============================================================================
// BORDER WIDTHS
// =============================================================================
export const BORDER_WIDTH = {
  /** No border */
  NONE: 0,
  /** Thin border - default for most components */
  THIN: 1,
  /** Medium border */
  MEDIUM: 2,
  /** Thick border */
  THICK: 3,
} as const;

// =============================================================================
// COMPONENT HEIGHTS
// =============================================================================
export const COMPONENT_HEIGHT = {
  /** Extra small components */
  XS: 28,
  /** Small components */
  SM: 36,
  /** Medium components - default */
  MD: 48,
  /** Large components */
  LG: 56,
  /** Extra large components */
  XL: 64,
  /** 2X large components */
  XXL: 72,
} as const;

// =============================================================================
// FONT SIZES
// =============================================================================
export const FONT_SIZE = {
  /** Extra small text */
  XS: 12,
  /** Small text */
  SM: 14,
  /** Medium text - body default */
  MD: 16,
  /** Large text */
  LG: 18,
  /** Extra large text */
  XL: 20,
  /** 2X large text */
  XXL: 22,
  /** 3X large text */
  XXXL: 24,
  /** 4X large text */
  XXXXL: 30,
  /** Title text */
  TITLE: 32,
  /** Large heading */
  HEADING_LG: 36,
  /** Extra large heading */
  HEADING_XL: 48,
  /** 2X large heading */
  HEADING_XXL: 60,
  /** 3X large heading */
  HEADING_XXXL: 72,
  /** Display text */
  DISPLAY: 96,
  /** Large display text */
  DISPLAY_LG: 128,
  /** Extra large display */
  DISPLAY_XL: 160,
  /** 2X large display */
  DISPLAY_XXL: 192,
  /** 3X large display */
  DISPLAY_XXXL: 220,
} as const;

// =============================================================================
// LINE HEIGHTS
// =============================================================================
export const LINE_HEIGHT = {
  /** Extra small line height */
  XS: 16,
  /** Small line height */
  SM: 20,
  /** Medium line height - body default */
  MD: 24,
  /** Large line height */
  LG: 28,
  /** Extra large line height */
  XL: 30,
  /** 2X large line height */
  XXL: 32,
  /** 3X large line height */
  XXXL: 36,
  /** 4X large line height */
  XXXXL: 40,
  /** Large heading line height */
  HEADING_LG: 44,
  /** Extra large heading line height */
  HEADING_XL: 58,
  /** 2X large heading line height */
  HEADING_XXL: 72,
  /** 3X large heading line height */
  HEADING_XXXL: 86,
  /** Display line height */
  DISPLAY: 116,
  /** Large display line height */
  DISPLAY_LG: 154,
  /** Extra large display line height */
  DISPLAY_XL: 192,
  /** 2X large display line height */
  DISPLAY_XXL: 230,
  /** 3X large display line height */
  DISPLAY_XXXL: 268,
} as const;

// =============================================================================
// SPACING
// =============================================================================
export const SPACING = {
  /** No spacing */
  NONE: 0,
  /** Minimal spacing */
  XXS: 1,
  /** Extra small spacing */
  XS: 4,
  /** Small spacing */
  SM: 8,
  /** Medium spacing - default gap */
  MD: 16,
  /** Large spacing */
  LG: 32,
  /** Extra large spacing */
  XL: 48,
  /** 2X large spacing */
  XXL: 64,
} as const;

// =============================================================================
// BORDER RADIUS
// =============================================================================
export const BORDER_RADIUS = {
  /** No radius */
  NONE: 0,
  /** Small radius */
  SM: 8,
  /** Medium radius - default */
  MD: 16,
  /** Large radius */
  LG: 24,
  /** Full radius - circular */
  FULL: 9999,
} as const;

// =============================================================================
// ANIMATION DURATIONS
// =============================================================================
export const DURATION = {
  /** Quick animations */
  QUICK: 150,
  /** Fast animations */
  FAST: 300,
  /** Normal animations - default */
  NORMAL: 500,
  /** Slow animations */
  SLOW: 1000,
  /** Loading/spinner animations */
  LOADING: 1000,
  /** Splash screen duration */
  SPLASH: 1500,
} as const;

// =============================================================================
// Z-INDEX LAYERS
// =============================================================================
export const Z_INDEX = {
  /** Base layer */
  BASE: 0,
  /** Content layer */
  CONTENT: 1,
  /** Overlay layer */
  OVERLAY: 2,
  /** Blur layer */
  BLUR: 3,
  /** Modal layer */
  MODAL: 10,
  /** Tooltip layer */
  TOOLTIP: 20,
  /** Dropdown layer */
  DROPDOWN: 30,
} as const;

// =============================================================================
// SEMANTIC MAPPINGS
// =============================================================================

/** Quick access to commonly used color shades for theming */
export const THEME_SHADES = {
  /** Background colors */
  BG: {
    LIGHT: COLOR_SHADES.LIGHTEST,
    DARK: COLOR_SHADES.DARKEST,
  },
  /** Text colors */
  TEXT: {
    LIGHT: COLOR_SHADES.LIGHTEST,
    DARK: COLOR_SHADES.DARKEST,
  },
  /** Primary color shades */
  PRIMARY: {
    LIGHT: COLOR_SHADES.SEMI_DARK,
    DARK: COLOR_SHADES.MEDIUM,
  },
  /** Placeholder colors */
  PLACEHOLDER: {
    LIGHT: COLOR_SHADES.LIGHT,
    DARK: COLOR_SHADES.DARK,
  },
} as const;


