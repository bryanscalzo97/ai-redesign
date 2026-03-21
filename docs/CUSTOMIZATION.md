# Customization

Everything starts in **`src/config/app.ts`**. Change values there and the app adapts — colors, AI models, feature flags, i18n.

## Quick start

```ts
// src/config/app.ts
export const appConfig = {
  name: "AI Redesign",
  theme: {
    brand: {
      primary: { light: "#7c3aed", dark: "#22c55e" },
      onPrimary: { light: "#ffffff", dark: "#ffffff" },
      accent: { light: "#7c3aed", dark: "#22c55e" },
      onAccent: { light: "#ffffff", dark: "#ffffff" },
    },
  },
  ai: {
    imageModel: "gemini-3.1-flash-image-preview",
    textModel: "gemini-2.5-flash-image",
  },
  // ...
};
```

## Brand Colors

Set four values in `theme.brand`. Each accepts a plain hex string or a `{ light, dark }` object:

```ts
brand: {
  primary: "#6200EE",                              // same both modes
  onPrimary: { light: "#000000", dark: "#FFFFFF" }, // adapts to theme
  accent: { light: "#FF9800", dark: "#FFB74D" },
  onAccent: "#FFFFFF",
}
```

The theme (`src/theme/appTheme.ts`) reads from `appConfig.theme.brand` — changing the config updates tint colors, tab icons, and accent colors across the app.

## AI Models

```ts
ai: {
  imageModel: "gemini-3.1-flash-image-preview",  // for image generation
  textModel: "gemini-2.5-flash-image",            // for room analysis + listing text
}
```

Models are referenced in `src/core/server/constants.ts` via `appConfig.ai`.

## Feature Flags

```ts
features: {
  payments: false,   // enable when monetization is ready
  onboarding: true,  // set false to skip onboarding
}
```

## i18n

```ts
i18n: {
  enabled: true,
  defaultLanguage: "device",
  fallbackLanguage: "en",
  supportedLanguages: ["en", "es", "fr", "pt"],
}
```

See [I18N.md](./I18N.md) for details on adding languages.

## Design Tokens

Design tokens live in `src/theme/dimensions.ts`:

| Token           | Values                                        |
| --------------- | --------------------------------------------- |
| `SPACING`       | `NONE` `XXS` `XS` `SM` `MD` `LG` `XL` `XXL` |
| `BORDER_RADIUS` | `NONE` `SM` `MD` `LG` `FULL`                 |
| `BORDER_WIDTH`  | `NONE` `THIN` `MEDIUM` `THICK`                |
| `FONT_SIZE`     | `XS` through `DISPLAY_XXXL`                   |
| `COMPONENT_HEIGHT` | `XS` `SM` `MD` `LG` `XL` `XXL`           |

Usage in components:

```tsx
import { SPACING, BORDER_RADIUS } from "@/theme/dimensions";

const styles = StyleSheet.create({
  container: { padding: SPACING.MD, borderRadius: BORDER_RADIUS.LG },
});
```

## File Map

```
src/config/app.ts           ← single source of truth
src/config/app.types.ts     ← type definitions
src/theme/appTheme.ts       ← light/dark theme (reads brand from config)
src/theme/colors.ts         ← Tailwind color palette
src/theme/dimensions.ts     ← spacing, radius, sizes
src/theme/semantic.ts       ← semantic color tokens
src/core/server/constants.ts ← AI model config (reads from config)
```
