# Architecture

AI Redesign is a full-stack Expo/React Native app for AI-powered room redesign and staging.

## Project Structure

```
src/
├── app/                    # Expo Router file-based routes
│   ├── _layout.tsx         # Root layout with providers
│   ├── +middleware.ts      # API auth middleware
│   ├── (onboarding)/       # First-run onboarding
│   ├── (tabs)/             # Main tab navigation
│   │   ├── home/           # Home tab
│   │   ├── camera/         # Photo capture + redesign
│   │   ├── redesigns/      # Projects list + details
│   │   ├── profile/        # User profile
│   │   ├── search/         # Search
│   │   └── about/          # About
│   ├── (paywall)/          # Premium paywall (modal)
│   └── api/                # Server-side API routes
│       ├── auth/           # Better Auth routes
│       ├── redesign+api.ts
│       ├── room-analysis+api.ts
│       └── listing-text+api.ts
│
├── config/                 # Centralized app configuration
│   ├── app.ts              # Single source of truth
│   └── app.types.ts        # Type definitions
│
├── core/                   # Business logic
│   ├── api-client.ts       # Typed fetch wrapper (client-side)
│   ├── api-types.ts        # Request/response types
│   ├── mutations.ts        # API mutation functions
│   └── server/             # Server-only code
│       ├── constants.ts    # Gemini API config
│       ├── generation-utils.ts
│       ├── room-analysis-utils.ts
│       ├── listing-text-utils.ts
│       ├── auth-middleware.ts
│       └── log.ts
│
├── context/                # React Context providers
│   ├── AuthContext.tsx      # Session + onboarding state
│   ├── ProjectContext.tsx   # Project CRUD
│   └── RedesignCreationContext.tsx  # Generation workflow (useReducer)
│
├── theme/                  # Design tokens
│   ├── colors.ts           # Tailwind color palette
│   ├── appTheme.ts         # Light/dark theme (reads from appConfig)
│   ├── dimensions.ts       # Spacing, radius, font sizes, etc.
│   └── semantic.ts         # Semantic colors (surfaces, scores, feedback)
│
├── components/
│   ├── screens/            # Page-level components
│   └── ui/                 # Reusable primitives (Button, Input, Text, Card, Icon)
│
├── hooks/                  # Custom React hooks
├── lib/                    # Client-side utilities (auth, storage, sharing)
├── constants/              # Domain data (room types, styles, seasonal tips)
├── types/                  # TypeScript type definitions
├── utils/                  # General utilities
└── i18n/                   # Internationalization (en, es, fr, pt)
```

## Data Flow

```
Client                          Server
──────                          ──────
mutations.ts ──→ apiFetch() ──→ +middleware.ts (auth check)
                                    ↓
                                api/redesign+api.ts
                                    ↓
                                server/generation-utils.ts ──→ Gemini API
                                    ↓
                    ←── JSON response ←──
```

## State Management

- **AuthContext** — Better Auth session, onboarding status (AsyncStorage)
- **ProjectContext** — Project CRUD (AsyncStorage + FileSystem for images)
- **RedesignCreationContext** — Multi-step generation workflow (`useReducer` with typed actions)

## Authentication

- **Better Auth** with email/password and Google OAuth
- **Expo Secure Store** for token storage on device
- **Server middleware** (`+middleware.ts`) logs API requests with session info

## Key Decisions

- **No external state library** — Context API + useReducer is sufficient for the app's complexity
- **Expo API Routes** — Server and client in the same codebase, no separate backend
- **Gemini API** — Image generation and room analysis via Google's API
- **AsyncStorage + FileSystem** — Projects stored locally, images on disk
- **Prisma + PostgreSQL** — Server-side for user auth and redesign records
