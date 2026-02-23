# Expo Starter Kit

TypeScript-first Expo + expo-router starter focused on speed, clarity, and good defaults. It includes a small UI library, theme utilities with Tailwind-like color tokens, opinionated structure, and ready-made screens.

## Features

- TypeScript, React 19, React Native 0.81
- File-based routing with `expo-router`
- Light/Dark theming with accent color utilities
- Reusable UI components (Button, Input, Text, Card, Icon, LazyImage)
- Auth context scaffold and protected routes
- Bun support (works with npm/yarn too)

## Requirements

- Node.js compatible with Expo SDK 54
- Xcode (for iOS) and Android Studio (for Android) if running on devices/simulators

## Quick Start

1. Clone and install

```bash
git clone <your-repo-url>
cd starter-kit
bun install   # or: npm install / yarn install / pnpm install
```

2. Start the dev server

```bash
npx expo start
```

3. Open a platform

```bash
bun run android   # requires Android SDK
bun run ios       # requires Xcode
bun run web
```

## Scripts

- `start`: start Expo dev server
- `android`: build & run Android (Dev Client)
- `ios`: build & run iOS (Dev Client)
- `web`: run in a web browser
- `lint`: run ESLint (Expo config)

## Project Structure

```
app/                     # Routes (expo-router)
  _layout.tsx            # Root providers, navigation, theming
  (onboarding)/          # Onboarding flow (protected when unauthenticated)
  (tabs)/                # Tab navigator (protected when authenticated)
  +not-found.tsx         # 404 screen

assets/                  # Fonts and images
components/
  screens/               # Screen components used by routes
  ui/                    # UI primitives (Button, Input, Text, Card, Icon, ...)
constants/               # Design tokens, theme, color maps
context/                 # Global contexts (e.g., AuthContext)
hooks/                   # Custom hooks (theme, headers, fonts, variants)
types/                   # Shared type definitions
utils/                   # Pure utilities (e.g., color utils)
```

## Navigation & Auth

- File-system routing under `app/` using `expo-router`
- Route groups `(onboarding)` and `(tabs)` manage unauthenticated/authenticated areas
- Guards are configured in `app/_layout.tsx` using `AuthContext`

## Theming & Colors

### Color System

The starter kit uses a complete Tailwind CSS v4 inspired color system with semantic naming and consistent scales:

```tsx
import { Colors } from "@/constants/Colors";

// Using specific shades
const primary = Colors.violet[600]; // #7c3aed
const success = Colors.green[500]; // #22c55e
const warning = Colors.amber[400]; // #fbbf24
const error = Colors.red[500]; // #ef4444
```

Available color scales (each with shades from 50 to 950):

- **Grays**:

  - `slate`: Blue-gray
  - `gray`: Neutral gray
  - `zinc`: Cool gray
  - `neutral`: True neutral
  - `stone`: Warm gray

- **Colors**:
  - Warm: `red`, `orange`, `amber`, `yellow`
  - Nature: `lime`, `green`, `emerald`, `teal`
  - Cool: `cyan`, `sky`, `blue`, `indigo`
  - Vibrant: `violet`, `purple`, `fuchsia`, `pink`, `rose`

Each color includes 11 shades:

- `50`: Lightest (almost white)
- `100-400`: Light variations
- `500`: Base color
- `600-800`: Dark variations
- `900`: Very dark
- `950`: Darkest (almost black)

### Design System Architecture

The design system is split into two main files that serve different purposes:

#### 1. Design Tokens (`constants/designTokens.ts`)

The foundation layer that defines the raw values and scales used throughout the app:

```tsx
import { SPACING, FONT_SIZE, BORDER_RADIUS } from "@/constants/designTokens";

// Examples of design tokens
const spacing = {
  small: SPACING.SM, // 8px
  medium: SPACING.MD, // 16px
  large: SPACING.LG, // 32px
};

const typography = {
  body: FONT_SIZE.MD, // 16px
  title: FONT_SIZE.TITLE, // 32px
};
```

Available token categories:

- `COLOR_SHADES`: Standard shade numbers (50-950)
- `OPACITY`: Standard opacity values
- `BORDER_WIDTH`: Border thickness values
- `COMPONENT_HEIGHT`: Standard component heights
- `FONT_SIZE`: Typography scale
- `LINE_HEIGHT`: Line height scale
- `SPACING`: Space scale
- `BORDER_RADIUS`: Border radius scale
- `DURATION`: Animation durations
- `Z_INDEX`: Z-index layers
- `THEME_SHADES`: Semantic color mappings

These tokens are the building blocks that never change and provide consistency across the app.

#### 2. Theme Configuration (`constants/theme.ts`)

The theming layer that applies design tokens to create the actual theme:

The theme configuration uses design tokens and colors to create semantic themes:

1. **Base Theme** (`constants/theme.ts`):

Example of how design tokens and colors work together:

```tsx
import { Colors } from "@/constants/Colors";
import { OPACITY, BORDER_WIDTH, THEME_SHADES } from "@/constants/designTokens";

// Theme combines design tokens with color values
export const AppTheme = {
  light: {
    text: Colors.zinc[950],
    background: Colors.zinc[50],
    border: `${Colors.zinc[200]}80`,
    tint: Colors.violet[600], // Primary accent color
    // ... more tokens
  },
  dark: {
    text: Colors.zinc[50],
    background: Colors.zinc[950],
    border: `${Colors.zinc[800]}80`,
    tint: Colors.green[500], // Dark mode accent
    // ... more tokens
  },
};
```

2. **Custom Theme** (your app):

```tsx
// Create a theme.config.ts file
import { Colors } from "@/constants/Colors";

export const CustomTheme = {
  light: {
    // Override primary color
    tint: Colors.blue[600],
    // Add custom tokens
    success: Colors.green[500],
    warning: Colors.amber[400],
  },
  dark: {
    tint: Colors.blue[400],
    success: Colors.green[400],
    warning: Colors.amber[300],
  },
};
```

### Using Theme Colors

1. **In Components**:

```tsx
import { useThemeColor } from "@/hooks/useThemeColor";

function MyComponent() {
  const backgroundColor = useThemeColor({
    light: Colors.zinc[100],
    dark: Colors.zinc[900],
  });

  const accentColor = useThemeColor({}, "tint"); // Uses theme tint

  return <View style={{ backgroundColor }} />;
}
```

2. **Accent Colors**:

```tsx
import { useAccentColor } from "@/hooks/useAccentColor";

function MyComponent() {
  const { getBackgroundColor } = useAccentColor();
  const dynamicBg = getBackgroundColor(); // Changes with theme
}
```

3. **Theme Switching**:

```tsx
import { SwitchTheme } from "@/components/ui/SwitchTheme";

// Automatic OS theme detection
function Header() {
  return <SwitchTheme />; // Toggle light/dark
}
```

### Best Practices

1. **Color Selection**:

   - Use `500` for primary states
   - Use `600-700` for hover/active
   - Use `200-300` for backgrounds
   - Use `50-100` for subtle highlights
   - Use `900-950` for text

2. **Accessibility**:

   - Maintain contrast ratios
   - Test in both themes
   - Use semantic colors
   - Consider color blindness

3. **Performance**:
   - Colors are tree-shakeable
   - Use `useThemeColor` with memoization
   - Avoid runtime color calculations

## UI Components API Reference

All components support TypeScript and include full type definitions. Components are located in `components/ui/`.

### Text

Advanced text component with font variants, weights, and theme support. Includes automatic font loading and line height adjustments.

```tsx
import { Text } from "@/components/ui/Text";

// Basic usage
<Text>Default text</Text>

// With type and weight
<Text
  type="title"
  weight="semibold"
  variant="serif"
>
  Styled Text
</Text>

// Theme-aware colors
<Text
  lightColor="#111827"
  darkColor="#F9FAFB"
  type="body"
>
  Theme Text
</Text>
```

**Props:**

- `type`: Text preset sizes with predefined font sizes and line heights

  - Basic Sizes:
    - `"xs"`: 12px, line-height: 16px
    - `"sm"`: 14px, line-height: 20px
    - `"base"`: 16px, line-height: 24px
    - `"lg"` to `"12xl"`: Incremental sizes up to 220px
  - Semantic Presets:
    - `"title"`: 32px, optimized for headings
    - `"subtitle"`: 20px, for secondary headings
    - `"body"`: 14px, optimized for readability
    - `"caption"`: 12px, for auxiliary text
    - `"link"`: 16px, with appropriate line height
  - Default: `"default"` (16px)

- `weight`: Font weight presets

  - `"ultralight"`: 100
  - `"thin"`: 200
  - `"light"`: 300
  - `"normal"`: 400 (default)
  - `"medium"`: 500
  - `"semibold"`: 600
  - `"bold"`: 700
  - `"heavy"`: 800
  - `"black"`: 900

- `variant`: Font family variants

  - `"serif"`: Uses Bodoni Moda font
    - Elegant serif for headings
    - Includes italic variants
    - Automatic line height adjustments
  - `"poster"`: Uses Oswald font
    - Condensed style for impact
    - Great for large displays
    - Custom line height ratios

- `lightColor` / `darkColor`: Theme-specific colors

  - Automatically switches based on theme
  - Accepts any valid color value
  - Falls back to theme text color if not specified
  - Example: `lightColor="#111827"`, `darkColor="#F9FAFB"`

- Additional Features:
  - Automatic font loading for variants
  - Smart line height adjustments per font
  - Native text props support
  - Performance optimized with memoization

### Input

Themeable text input component with multiple variants and automatic color scheme support. Built on React Native's TextInput with enhanced styling capabilities.

```tsx
import { Input } from "@/components/ui/Input";

// Basic usage
<Input
  variant="outline"
  size="md"
  color="blue"
  radius="md"
  placeholder="Enter text..."
/>;

// Underline variant with custom styling
<Input
  variant="underline"
  size="lg"
  color="violet"
  style={{ paddingHorizontal: 20 }}
/>;

// Soft variant with error state
<Input
  variant="soft"
  color="red"
  placeholder="Error state..."
  value={value}
  onChangeText={setValue}
/>;
```

**Props:**

- `variant`: Input style variants

  - `"outline"`: Standard bordered input (default)
    - Full border with theme-aware colors
    - Best for forms and prominent inputs
  - `"soft"`: Subtle background fill
    - Light background without border
    - Good for search fields or secondary inputs
  - `"subtle"`: Minimal visual style
    - Very light background
    - Thin border
    - Ideal for inline editing
  - `"underline"`: Bottom border only
    - Clean look with just bottom line
    - Great for form fields in cards

- `size`: Component size presets

  - `"xs"`: Height 32px, fontSize 12px
  - `"sm"`: Height 36px, fontSize 14px
  - `"md"`: Height 40px, fontSize 16px (default)
  - `"lg"`: Height 44px, fontSize 18px
  - `"xl"`: Height 48px, fontSize 20px
  - `"2xl"`: Height 52px, fontSize 24px

- `color`: Theme color configuration

  - Any UI color key (e.g., "blue", "red", "green")
  - Affects border, background, and text colors
  - Automatically adjusts for light/dark mode
  - Different opacities per variant

- `radius`: Border radius options

  - `"none"`: 0px
  - `"sm"`: 4px
  - `"md"`: 6px (default)
  - `"lg"`: 8px
  - `"xl"`: 12px
  - `"full"`: 9999px

- Additional Features:
  - Full TextInput props support
  - Automatic dark mode support
  - Performance optimized with useMemo
  - Customizable placeholder colors
  - Consistent height across variants
  - RTL support

### Button

Feature-rich button component with variants, loading states, haptic feedback, and icon support. Built for maximum flexibility and performance.

```tsx
import { Button } from "@/components/ui/Button";

// Basic usage
<Button
  title="Click Me"
  variant="solid"
  size="lg"
  color="blue"
  loading={false}
  haptic
  onPress={() => {}}
/>

// With icon and custom style
<Button
  symbol="star.fill"
  variant="outline"
  size="md"
  style={{ width: 'auto' }}
/>

// Danger action with confirmation
<Button
  title="Delete Account"
  variant="soft"
  color="red"
  confirmationAlert={{
    title: "Confirm Delete",
    message: "This action cannot be undone",
    confirmText: "Delete",
    cancelText: "Cancel",
    onConfirm: handleDelete,
    onCancel: () => console.log("Cancelled")
  }}
/>

// Loading state with custom image
<Button
  title="Upload"
  image={require("@/assets/upload-icon.png")}
  loading={isUploading}
  disabled={!canUpload}
/>
```

**Props:**

- `title`: Button label text

  - Optional when using `symbol` or `image`
  - Automatically centered with icons
  - Supports long text with ellipsis

- `variant`: Visual style variants

  - `"solid"`: Filled background (default)
    - High contrast, primary actions
    - Full background color
  - `"outline"`: Bordered style
    - Medium emphasis actions
    - Transparent background
  - `"soft"`: Subtle background
    - Secondary actions
    - Light background tint
  - `"subtle"`: Minimal style
    - Tertiary actions
    - Very light background
  - `"link"`: Text-only appearance
    - Navigation or minor actions
    - No background or border

- `size`: Button size presets

  - `"xs"`: Height 24px, Icon 12px
  - `"sm"`: Height 32px, Icon 14px
  - `"md"`: Height 40px, Icon 16px (default)
  - `"lg"`: Height 48px, Icon 18px
  - `"xl"`: Height 56px, Icon 20px
  - `"2xl"`: Height 64px, Icon 24px

- `color`: Theme color configuration

  - Any UI color key
  - Affects background, border, and text
  - Automatic dark mode adaptation
  - Different opacities by variant

- `radius`: Border radius options

  - `"none"`: 0px
  - `"xxs"`: 2px
  - `"xs"`: 4px
  - `"sm"`: 6px
  - `"md"`: 8px (default)
  - `"lg"`: 12px
  - `"xl"`: 16px
  - `"full"`: 9999px

- State Props:

  - `loading`: Shows animated spinner
    - Replaces icon/image if present
    - Maintains button size
    - Optional custom spinner color
  - `disabled`: Disables interactions
    - Reduces opacity
    - Prevents onPress
    - Maintains visual style

- Icon Support:

  - `symbol`: SF Symbol name
    - Automatically colored
    - Supports all SF Symbol types
  - `image`: Custom image source
    - Local or remote images
    - Automatic size scaling
    - Optional tinting

- Interaction Props:

  - `haptic`: Enable haptic feedback
    - `hapticStyle`: "light" | "medium" | "heavy"
    - Lazy-loaded for performance
  - `confirmationAlert`: Confirmation dialog
    - Custom title and message
    - Configurable buttons
    - Optional callbacks
    - Native alert on iOS/Android

- Additional Features:
  - Performance optimized
  - Automatic press animation
  - RTL support
  - Accessibility support
  - Native feedback on Android

### Card

Versatile container component with theme awareness, shadow variants, and press interactions. Perfect for content grouping and interactive surfaces.

```tsx
import { Card } from "@/components/ui/Card";

// Basic usage
<Card variant="bordered" shadow="medium" color="white" onPress={() => {}}>
  {/* Card content */}
</Card>;

// Interactive card with dark theme
<Card
  variant="plain"
  shadow="large"
  color="black"
  onPress={handlePress}
  style={{ height: 200 }}
>
  <Text>Custom Content</Text>
</Card>;

// Simple container
<Card variant="bordered" shadow="none">
  <View style={styles.content} />
</Card>;
```

**Props:**

- `variant`: Card border styles

  - `"bordered"`: With border (default)
    - Theme-aware border color
    - Subtle border opacity (90%)
    - Consistent across themes
  - `"plain"`: Without border
    - Clean look
    - Relies on shadow/color
    - Good for media content

- `shadow`: Elevation levels

  - `"none"`: No shadow (default)
  - `"light"`: Subtle elevation
    - Light theme: `0 1px 3px rgba(0,0,0,0.1)`
    - Dark theme: Enhanced visibility
  - `"medium"`: Moderate elevation
    - Light theme: `0 4px 6px rgba(0,0,0,0.15)`
    - Dark theme: Stronger contrast
  - `"large"`: Significant elevation
    - Light theme: `0 10px 15px rgba(0,0,0,0.2)`
    - Dark theme: Maximum visibility
  - Auto-adjusts for dark mode

- `color`: Background color

  - `"white"`: Light theme (default)
    - Pure white in light mode
    - Adjusted for dark mode
  - `"black"`: Dark theme
    - Pure black in dark mode
    - Adjusted for light mode
  - Auto-switches based on system theme
  - Affects shadow intensity

- `onPress`: Interaction handler

  - Optional press callback
  - Adds press animation
  - Scale feedback (0.99)
  - Native feedback on Android

- Additional Features:
  - Default height: 300px
  - Customizable via style prop
  - Automatic border radius (MD)
  - Flex container by default
  - RTL support
  - Maintains children aspect ratio
  - Performance optimized shadows

### LazyImage

Advanced image component with smart loading strategies, placeholder support, and caching. Built on expo-image with fallback to React Native Image.

```tsx
import { LazyImage } from "@/components/ui/LazyImage";

// Basic usage with lazy loading
<LazyImage
  source={require("@/assets/image.jpg")}
  strategy="lazy"
  placeholder="blur"
  contentFit="cover"
  cachePolicy="memory-disk"
/>;

// Remote image with viewport loading
<LazyImage
  source={{ uri: "https://example.com/image.jpg" }}
  strategy="on-viewport"
  placeholder="skeleton"
  threshold={100}
  onLoad={() => console.log("Loaded")}
/>;

// With error handling and fallback
<LazyImage
  source={mainImage}
  fallbackSource={placeholderImage}
  onError={(error) => console.log("Load failed:", error)}
  contentFit="contain"
/>;
```

**Props:**

- `source`: Image source configuration

  - Local: `require("./image.jpg")`
  - Remote: `{ uri: "https://..." }`
  - Base64: `"data:image/jpeg;base64,..."`
  - Static resource number

- `strategy`: Loading strategies

  - `"immediate"`: Load right away
    - Good for critical images
    - No delay or placeholder
  - `"lazy"`: Delayed loading
    - 100ms default delay
    - Reduces initial load
  - `"on-scroll"`: Load while scrolling
    - Checks scroll position
    - Uses threshold distance
  - `"on-viewport"`: Load when visible
    - Viewport intersection
    - Most efficient for lists

- `placeholder`: Loading indicators

  - `"blur"`: Blurred placeholder
    - Smooth transition
    - Uses placeholder color
  - `"skeleton"`: Loading animation
    - Animated background
    - Good for lists
  - `"color"`: Solid color
    - Simple placeholder
    - Custom color support
  - `"none"`: No placeholder
    - Instant display
    - Might cause layout shift

- `contentFit`: Image scaling

  - `"cover"`: Fill container (default)
  - `"contain"`: Show full image
  - `"fill"`: Stretch to fit
  - `"scale-down"`: Maintain ratio

- `cachePolicy`: Caching strategy

  - `"memory"`: RAM only
    - Fast access
    - Clears on app close
  - `"disk"`: Persistent storage
    - Survives restarts
    - More storage use
  - `"memory-disk"`: Both (default)
    - Best performance
    - Maximum caching
  - `"none"`: No caching
    - Always reload
    - Network intensive

- Loading Control:

  - `threshold`: Viewport distance (px)
    - Default: 100px
    - Adjusts load trigger
  - `fallbackSource`: Backup image
    - Shows on error
    - Any valid source

- Event Handlers:

  - `onLoad`: Load success
  - `onError`: Load failure
  - `onLoadStart`: Load begins

- Additional Features:
  - Automatic expo-image loading
  - React Native Image fallback
  - Memory efficient
  - Automatic cleanup
  - Size preservation
  - Progressive loading
  - Error boundaries

### Icon

Optimized SF Symbols wrapper with size presets and rendering modes. Perfect for consistent iconography across your app.

```tsx
import { Icon } from "@/components/ui/Icon";

// Basic usage
<Icon symbol="star.fill" size="md" color="#000" type="hierarchical" />;

// Custom size with monochrome style
<Icon
  symbol="arrow.right.circle.fill"
  size={32}
  color="rgb(59, 130, 246)"
  type="monochrome"
/>;

// Multicolor system icon
<Icon
  symbol="person.crop.circle.fill.badge.checkmark"
  size="xl"
  type="multicolor"
/>;
```

**Props:**

- `symbol`: SF Symbol name

  - Any valid SF Symbol identifier
  - Supports all system icons
  - Automatic validation
  - Example: `"star.fill"`, `"cloud.sun.rain"`

- `size`: Icon dimensions

  - Preset Sizes:
    - `"xs"`: 14px
    - `"sm"`: 18px
    - `"md"`: 22px (default)
    - `"lg"`: 26px
    - `"xl"`: 30px
    - `"2xl"`: 34px
  - Custom size: Any number
  - Maintains aspect ratio
  - Auto-scales for density

- `color`: Icon tint color

  - Any valid color value
  - Hex: `"#000000"`
  - RGB: `"rgb(0, 0, 0)"`
  - Named: `"blue"`
  - Affects monochrome/hierarchical
  - Ignored in multicolor

- `type`: Rendering mode

  - `"monochrome"`: Single color
    - Uses `color` prop
    - Simplest rendering
    - Best for UI elements
  - `"hierarchical"`: Layered (default)
    - Depth through opacity
    - Based on `color`
    - Good for navigation
  - `"palette"`: System colors
    - Uses SF Symbol palette
    - Ignores `color`
    - Platform consistency
  - `"multicolor"`: Full color
    - Original SF colors
    - Ignores `color`
    - Best for status/alerts

- Additional Features:
  - Native SF Symbols rendering
  - Automatic scaling
  - Performance optimized
  - Memory efficient
  - RTL support
  - Accessibility labels
  - Platform fallbacks

## Authentication

The starter kit includes a simple authentication context that manages the app's auth state. Protected routes in `app/_layout.tsx` use this context to control access.

### Using AuthContext

```tsx
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

function MyComponent() {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

  const login = () => {
    // Add your login logic here
    setIsAuthenticated(true);
  };

  const logout = () => {
    // Add your logout logic here
    setIsAuthenticated(false);
  };

  return (
    <>
      {isAuthenticated ? (
        <Button title="Logout" onPress={logout} />
      ) : (
        <Button title="Login" onPress={login} />
      )}
    </>
  );
}
```

### Protected Routes

The app uses route groups to protect authenticated/unauthenticated areas:

- `(onboarding)/*`: Only accessible when NOT authenticated
- `(tabs)/*`: Only accessible when authenticated

The protection is configured in `app/_layout.tsx`:

```tsx
<Stack>
  <Stack.Protected guard={!isAuthenticated}>
    <Stack.Screen name="(onboarding)" />
  </Stack.Protected>
  <Stack.Protected guard={isAuthenticated}>
    <Stack.Screen name="(tabs)" />
  </Stack.Protected>
</Stack>
```

## Development

```bash
# Lint
bun run lint

# Start web directly
bun run web
```

Troubleshooting tips:

- If fonts or splash screen hang, ensure dev server is cleanly restarted
- For iOS/Android builds, open the platform logs in Expo CLI for errors

## License

MIT
