# Project Development Guidelines

## [Beto Changes & Bug Fixes]

### Header Large Title Bug Fix

There is a bug with the header large title that can be fixed using a transparent color for the header:

```tsx
<Stack
  screenOptions={{
    headerLargeStyle: {
      backgroundColor: "transparent",
    },
  }}
>
```

## Architecture & Organization

### Screen Organization

- **New screens**: Create in `components/screens/` then import in the corresponding `app/` route
- **Pattern**:

```tsx
// In app/example.tsx
import { Example } from "@/components/screens/Example";

export default function ExampleScreen() {
  return <Example />;
}
```

### Directory Structure

```
├── app/                    # Expo Router routes
├── components/
│   ├── screens/           # Screen components
│   └── ui/                # Reusable UI components
├── constants/             # App constants & configuration
├── context/               # React contexts
├── hooks/                 # Custom hooks
├── types/                 # TypeScript type definitions
└── assets/                # Static assets
```

## Code Style & Conventions

### Export Conventions

- **Components**: Use named exports
  ```tsx
  export function ComponentName() {}
  ```
- **Screens**: Use default exports
  ```tsx
  export default function ScreenName() {}
  ```
- **Hooks**: Use named exports with `use` prefix
  ```tsx
  export function useCustomHook() {}
  ```
- **Types/Interfaces**: Use named exports
  ```tsx
  export interface ComponentProps {}
  export type UISize = "sm" | "md" | "lg";
  ```

### File Naming Conventions

- **kebab-case** for utility files and constants
  - `navigation-options.tsx`
  - `color-scheme.ts`
- **PascalCase** for components, screens, contexts, and types
  - `AuthContext.tsx`
  - `Button.tsx`
  - `HomeScreen.tsx`

### Import Organization

Follow this order:

1. React imports
2. React Native imports
3. Third-party libraries
4. Internal imports (using `@/` alias)

```tsx
import { type ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { Stack } from "expo-router";
import { Button } from "@/components/ui/Button";
```

### TypeScript Patterns

#### Props Interfaces

- Use `interface` for component props
- Extend React Native types when possible

```tsx
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "solid" | "outline";
}

export type TextProps = RNTextProps & {
  type?: "title" | "body" | "caption";
  weight?: "normal" | "bold";
};
```

#### Type Definitions

- Create shared types in `types/` directory
- Use union types for variants

```tsx
export type UISize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type UIColor = "blue" | "red" | "green" | "gray";
```

## Component Development

### UI Component Structure

```tsx
interface ComponentProps {
  // Props definition
}

export function Component({
  prop1,
  prop2 = "defaultValue",
  ...rest
}: ComponentProps) {
  // Hooks
  const colorScheme = useColorScheme();

  // Logic

  // Render
  return <View style={styles.container}>{/* JSX */}</View>;
}

const styles = StyleSheet.create({
  container: {
    // Styles
  },
});
```

### Styling Approach

- Use `StyleSheet.create()` for component styles
- Leverage the TailwindCSS-inspired color system from `colors.ts`
- Support both light and dark themes
- Use the custom `useThemeColor` hook for theme-aware styling

### Theme & Colors

- Use `Colors` object from `@/constants/colors` for the base color palette
- Use `AppTheme` object from `@/constants/theme` for app-specific theme colors
- Support automatic dark/light mode switching
- Use `useColorScheme()` hook for theme detection
- Implement theme-aware components with `lightColor` and `darkColor` props

## Platform-Specific Development

### Cross-Platform Components

- If a component is iOS-only, create `.android.tsx` equivalent with fallback implementation
- Example pattern:

```tsx
// ContextMenu.tsx (iOS implementation)
export function ContextMenuProfile() {
  return <ActualContextMenu />;
}

// ContextMenu.android.tsx (Android fallback)
export function ContextMenuProfile() {
  return <Text>Context menu not available on Android</Text>;
}
```

## Navigation Patterns

### Screen Options

- Use `useLargeHeaderOptions()` for consistent header styling
- Pattern for reusable navigation options:

```tsx
const largeHeaderOptions = useLargeHeaderOptions();

<Stack
  screenOptions={{
    ...largeHeaderOptions,
    title: "Screen Title",
    headerLeft: () => <CustomComponent />,
  }}
>
```

## State Management

### Context Pattern

- Use React Context for global state
- Provide both context and provider

```tsx
export const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: ReactNode }) {
  // State logic
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
```

## Performance & Best Practices

### Component Optimization

- Use `React.memo()` for expensive components
- Implement proper dependency arrays in hooks
- Use `useCallback()` and `useMemo()` when beneficial

### Asset Management

- Place images in `assets/images/`
- Use Expo's optimized image formats
- Support multiple densities (@2x, @3x)

### Development Tools

- Use ESLint with Expo config
- Enable TypeScript strict mode
- Use the provided path aliases (`@/*`)

## Testing & Quality

### Code Quality

- Follow ESLint rules (expo-config)
- Use TypeScript strict mode
- Implement proper error boundaries
- Handle loading and error states

### Accessibility

- Add proper accessibility labels
- Support screen readers
- Test with accessibility tools

## Package Management

- Use Bun as the package manager
- Keep dependencies up to date
- Use exact versions for critical dependencies
