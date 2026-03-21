# Server

AI Redesign is a full-stack app. The mobile app and the API live in the same codebase using [Expo API Routes](https://docs.expo.dev/router/reference/api-routes/).

## API Routes

| Route                 | Method | What it does                                      |
| --------------------- | ------ | ------------------------------------------------- |
| `/api/redesign`       | POST   | Generates a redesigned room image via Gemini      |
| `/api/room-analysis`  | POST   | Analyzes a room image and returns scores/suggestions |
| `/api/listing-text`   | POST   | Generates listing text for a redesigned room      |
| `/api/auth/[...route]`| ALL    | Better Auth routes (login, register, session)     |

All routes validate request bodies with Zod.

## Middleware

The middleware (`src/app/+middleware.ts`) runs on all POST requests to `/api/*`, except `/api/auth/*`. It checks for a valid Better Auth session and logs the request.

## Client API Layer

Client-side code never calls `fetch()` directly. Instead, use the typed mutation functions:

```ts
import { generateRedesign, analyzeRoom, generateListingText } from "@/core/mutations";

// All mutations are typed — input and response
const result = await generateRedesign({
  image_base64: "...",
  roomType: "bedroom",
  style: "modern",
});
```

The mutations use `apiFetch<T>()` from `src/core/api-client.ts`, which handles JSON parsing and error extraction.

## Environment Variables

Required in `.env.local`:

```
GEMINI_API_KEY=your-gemini-api-key
BETTER_AUTH_SECRET=your-auth-secret
BETTER_AUTH_URL=http://localhost:8081
DATABASE_URL=your-postgres-url
EXPO_PUBLIC_BASE_URL=http://localhost:8081
```

## Local Development

During `npx expo start`, API routes run on your local dev server. Changes are picked up instantly.

## File Map

```
src/app/
├── +middleware.ts              ← Auth logging (runs before every API request)
└── api/
    ├── auth/[...route]+api.ts ← Better Auth handler
    ├── redesign+api.ts        ← Image generation
    ├── room-analysis+api.ts   ← Room analysis
    └── listing-text+api.ts    ← Listing text generation

src/core/
├── api-client.ts              ← apiFetch<T>() wrapper
├── api-types.ts               ← Request/response types
├── mutations.ts               ← Client-side mutation functions
└── server/
    ├── constants.ts           ← Gemini model config
    ├── generation-utils.ts    ← Gemini API helpers + retry logic
    ├── room-analysis-utils.ts ← Room analysis prompt builder
    ├── listing-text-utils.ts  ← Listing text prompt builder
    ├── auth-middleware.ts     ← withAuth() HOF for route protection
    └── log.ts                 ← Server-side logging
```
