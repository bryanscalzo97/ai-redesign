import { appConfig } from '@/config/app';
import { Colors as ColorPalette } from './Colors';

const brand = appConfig.theme.brand;
const primaryLight = typeof brand.primary === 'string' ? brand.primary : brand.primary.light;
const primaryDark = typeof brand.primary === 'string' ? brand.primary : brand.primary.dark;

export const AppTheme = {
  light: {
    text: ColorPalette.zinc[950],
    background: ColorPalette.zinc[50],
    border: `${ColorPalette.zinc[200]}80`,
    tint: primaryLight,
    icon: ColorPalette.zinc[400],
    tabIconDefault: ColorPalette.zinc[400],
    tabIconSelected: primaryLight,
  },
  dark: {
    text: ColorPalette.zinc[50],
    background: ColorPalette.zinc[950],
    border: `${ColorPalette.zinc[800]}80`,
    tint: primaryDark,
    icon: ColorPalette.zinc[300],
    tabIconDefault: ColorPalette.zinc[300],
    tabIconSelected: primaryDark,
  },
};

