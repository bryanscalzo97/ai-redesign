import { Colors as ColorPalette } from './Colors';

/**
 * App-specific theme colors
 * Defines the color scheme for light and dark modes
 * Uses the base color palette from './colors'
 */
export const AppTheme = {
  light: {
    text: ColorPalette.zinc[950],        // Almost black for text
    background: ColorPalette.zinc[50],   // Almost white for background
    border: `${ColorPalette.zinc[200]}80`, // Light gray with opacity
    tint: ColorPalette.violet[600],      // Primary accent color
    icon: ColorPalette.zinc[400],        // Medium gray for icons
    tabIconDefault: ColorPalette.zinc[400],
    tabIconSelected: ColorPalette.violet[600],
  },
  dark: {
    text: ColorPalette.zinc[50],         // Almost white for text
    background: ColorPalette.zinc[950],  // Almost black for background  
    border: `${ColorPalette.zinc[800]}80`, // Dark gray with opacity
    tint: ColorPalette.green[500],       // Primary accent color
    icon: ColorPalette.zinc[300],        // Light gray for icons
    tabIconDefault: ColorPalette.zinc[300],
    tabIconSelected: ColorPalette.green[500],
  },
};

