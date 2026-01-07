# AGENTS.md

This document defines the **canonical architecture and conventions** for the React Native mobile application (iOS + Android via Expo).

All AI agents must follow these instructions when generating, modifying, or reasoning about code in the mobile codebase.

---

## 1. High-level Architecture

This is a **React Native + TypeScript** mobile app built with **Expo** (Prebuild workflow), consuming the same backend API as the web application.

### Tech Stack Overview

| Layer              | Technology                                      | Why                                                            |
| ------------------ | ----------------------------------------------- | -------------------------------------------------------------- |
| **Framework**      | Expo (Prebuild) + React Native                  | Managed native builds, zero Xcode/Android Studio setup for MVP |
| **Language**       | TypeScript (strict mode)                        | End-to-end type safety, same as backend                        |
| **Routing**        | Expo Router (file-based)                        | Next.js-like DX, familiar to web devs                          |
| **State Mgmt**     | Zustand                                         | Minimal boilerplate, near-Redux performance                    |
| **Data Fetching**  | React Query (TanStack Query)                    | Caching, offline support, background sync                      |
| **HTTP Client**    | Axios                                           | Shared with web, interceptors for auth                         |
| **Forms**          | React Hook Form + Zod                           | Declarative validation, type-safe                              |
| **UI Components**  | NativeWind (Tailwind CSS for React Native)      | Utility-first styling, design system integration               |
| **Storage**        | @react-native-async-storage + expo-secure-store | Async local storage, hardware-backed encryption for tokens     |
| **Notifications**  | expo-notifications                              | Push + local notifications, background handling                |
| **Analytics**      | Custom `modules/analytics` (provider-agnostic)  | Track events, user behavior                                    |
| **Error Tracking** | Sentry + custom error handler                   | Crash reporting, breadcrumbs                                   |
| **Build & Deploy** | EAS Build + EAS Submit                          | Cloud builds, TestFlight/Play Store submission                 |

### Architecture Principles

1. **Modular Monolith:** Business domains in `src/modules/<domain>` (symmetric with backend)
2. **Data Flow:** Backend API → React Query → Zustand (if needed) → Components
3. **Routing:** File-based via Expo Router (`app/` folder), automatic deep links
4. **File Naming:** `kebab-case` for all files (e.g., `feature-detail.tsx` exports `FeatureDetail()`)
5. **Components:** Smart components in `src/modules/<domain>/components/`, presentational in `src/ui/`

---

## 2. Project Structure

### Directory Layout

```
mobile/
├── app/                                    # Expo Router (Navigation Layer)
│   ├── _layout.tsx                        # Root layout, providers, auth check
│   ├── (auth)/                            # Auth group (no tabs)
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   └── signup.tsx
│   ├── (app)/                             # Authenticated app
│   │   ├── _layout.tsx                    # Shared layout for app
│   │   ├── (tabs)/                        # Bottom tab navigation
│   │   │   ├── _layout.tsx                # Configure tab bar
│   │   │   ├── index.tsx                  # Home/Dashboard
│   │   │   ├── features.tsx               # Feature list
│   │   │   └── settings.tsx               # Settings
│   │   └── feature/
│   │       └── [id].tsx                   # Feature detail (outside tabs)
│   └── +not-found.tsx
├── src/
│   ├── modules/                           # Business Domains (Modular Monolith)
│   │   ├── auth/
│   │   │   ├── auth.api.ts                # useLogin, useSignup (React Query)
│   │   │   ├── auth.store.ts              # Zustand (session, token, user)
│   │   │   ├── components/
│   │   │   │   └── login-form.tsx
│   │   │   └── utils/
│   │   │       └── token-storage.ts       # Token persistence helpers
│   │   ├── <domain>/                      # Example feature domain
│   │   │   ├── <domain>.api.ts            # useFeatures, useFeature, useCreateFeature
│   │   │   ├── <domain>.store.ts          # Zustand (filters, sorting, etc)
│   │   │   ├── components/
│   │   │   │   ├── feature-card.tsx       # Dumb card component
│   │   │   │   ├── feature-list.tsx       # Smart list (fetches data)
│   │   │   │   └── feature-detail.tsx     # Smart detail view
│   │   │   └── utils/
│   │   │       └── format-feature.ts
│   │   ├── analytics/                     # Cross-cutting: event tracking
│   │   │   ├── analytics.api.ts           # analyticsService abstraction
│   │   │   ├── providers/
│   │   │   │   └── mixpanel.provider.ts   # Actual provider implementation
│   │   │   └── config.ts                  # Provider selection via env
│   │   ├── errors/                        # Cross-cutting: error handling
│   │   │   ├── error-handler.ts           # logError, logInfo
│   │   │   ├── error-boundary.tsx         # React Error Boundary
│   │   │   └── sentry.service.ts          # Sentry init, capture
│   ├── ui/                                # Shared UI Kit (Dumb Components)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── lib/                               # Infrastructure (Inits, Config)
│   │   ├── axios.ts                       # HTTP client with interceptors
│   │   ├── query-client.ts                # React Query setup + persistence
│   │   ├── storage.ts                        # Storage + SecureStore wrappers
│   │   ├── logger.ts                      # Pino logger instance
│   │   └── constants.ts                   # API_URL, APP_VERSION, etc
│   └── types/                             # App-specific types (or import from shared-types)
│       └── index.ts
├── app.json                               # Expo config (SDK version, plugins, etc)
├── eas.json                               # EAS Build & Submit config
├── tsconfig.json
├── package.json
└── AGENTS.md                       # This file
```

### Key Rules

1. **`app/`** - Routing only, minimal logic, delegates to `src/modules/` components
2. **`src/modules/<domain>/`** - Domain-specific code:
   - `<domain>.api.ts` - React Query hooks
   - `<domain>.store.ts` - Zustand store (if needed)
   - `validation.ts` - Zod schemas (if forms)
   - `components/` - UI components
   - `utils/` - Domain helpers
3. **`src/lib/`** - Infrastructure only (axios, query client, storage), no business logic
4. **`src/ui/`** - Reusable UI primitives (Button, Input, Card), no API calls or business logic

---

## 3. Authentication

**Already configured** in `src/modules/auth/`:

- `useAuthStore` - Zustand store for session management
- Token stored in `expo-secure-store` (encrypted)
- Axios interceptor auto-injects tokens
- Protected routes in `app/_layout.tsx`

---

## 4. Data Fetching (React Query)

**Pattern:** Each domain has `<domain>.api.ts` exporting React Query hooks.

**Already configured** in `src/lib/query-client.ts` with AsyncStorage persistence.

**AsyncStorage Persistence:**

- Automatic cache persistence using `@tanstack/query-async-storage-persister`
- Storage via `@react-native-async-storage/async-storage`
- Offline-first experience with automatic rehydration on app restart

**How to add new API hooks:**

- Export `useFeatures()` for lists
- Export `useFeature(id)` for single items
- Export `useCreateFeature()`, `useUpdateFeature()`, `useDeleteFeature()` for mutations
- Use `queryClient.invalidateQueries()` in `onSuccess` to refresh data

---

## 5. Forms (React Hook Form + Zod)

**Pattern:** Use React Hook Form with `zodResolver` for all forms.

**Already configured:**

- `react-hook-form` + `@hookform/resolvers/zod`
- Example: `src/modules/auth/validation.ts`

**Best Practices:**

- Define Zod schemas in `<domain>/validation.ts`
- Use `Controller` wrapper for React Native inputs
- Extract types with `z.infer<typeof schema>`

---

## 6. Storage (AsyncStorage + SecureStore)

**AsyncStorage (Local Storage):**

- Location: `src/lib/storage.ts`
- Use for: cache, preferences, app state
- API: `await storage.setItem()`, `await storage.getItem()`, `await storage.setJSON()`, etc
- Async key-value storage

**SecureStore (Encrypted Storage):**

- Location: `src/lib/storage.ts` (as `secureStorage`)
- Use for: auth tokens, sensitive credentials
- API: `await secureStorage.setItem()`, `await secureStorage.getItem()`
- Hardware-backed (Keychain/Keystore), async

**Rule:** Never store tokens in AsyncStorage - use SecureStore only

---

## 7. State Management (Zustand)

**When to use Zustand:**

- Global state: Auth session, user profile, app theme
- Domain state: Filter/sort preferences
- UI state: Modal visibility, tab index

**Do NOT use Zustand for:**

- Fetched data (use React Query)
- One-off component state (use `useState`)

**Pattern:** Create `<domain>.store.ts` with Zustand when you need shared state across components.

---

## 8. Expo Router Navigation

**Rules:**

- Files in `app/` map to routes
- `()` folders = layout groups (not in URL)
- `[param]` = dynamic segments
- Deep links work automatically
- Use `useLocalSearchParams()` for route params

---

## 9. Adding Native Modules

1. Install: `npx expo install <package>`
2. Add plugin to `app.json` (if required)
3. Rebuild dev client: `eas build --profile development --platform ios`
4. Continue: `npx expo start --dev-client`

---

## 10. Error Handling

**Already configured:**

- `src/modules/errors/error-handler.ts` - `logError(error, context)`
- `src/modules/errors/error-boundary.tsx` - React Error Boundary
- Sentry integration

**Usage:** Wrap async calls in try/catch, call `logError()`

---

## 11. Notifications

**Already configured:**

- Location: `src/modules/notifications/notifications.service.ts`
- Push notifications (Expo Push Tokens)
- Local/scheduled notifications
- Permission handling, badge management

**Key API:**

- `requestPermissions()`, `registerForPushNotifications()`
- `sendLocalNotification()`, `scheduleNotification()`
- `addNotificationReceivedListener()`, `addNotificationResponseReceivedListener()`

**Config:** Plugin in `app.json`, requires `EXPO_PUBLIC_PROJECT_ID` env var

---

## 12. Analytics

**Already configured:** `src/modules/analytics/analytics.api.ts`

- API: `analyticsService.track(event, properties)`, `analyticsService.screen(name)`
- Provider-agnostic, call in mutation callbacks

---

## 13. Styling & Theme (NativeWind + Tailwind CSS)

**CRITICAL: Always use `className` prop, never inline styles or StyleSheet**

**Setup:**

- Config: `tailwind.config.js`, `global.css`, `nativewind-env.d.ts`
- Utility: `src/lib/utils.ts` - `cn()` for conditional classes

**Custom Theme Classes:**

- **Colors:** `bg-primary`, `bg-surface`, `text-text`, `text-text-secondary`, `border-border`, `border-error`
- **Spacing:** `p-xs` (4px), `p-sm` (8px), `p-md` (16px), `p-lg` (24px), `p-xl` (32px), `m-2xl` (48px), `m-3xl` (64px)
- **Radius:** `rounded-sm` (4px), `rounded-md` (8px), `rounded-lg` (12px), `rounded-xl` (16px)
- **Typography:** `text-xs/sm/base/lg/xl/2xl/3xl/4xl`, `font-regular/medium/semibold/bold`

**Pattern:**

```typescript
import { cn } from "@/src/lib/utils";

// Basic usage
<View className="p-md bg-white rounded-lg" />

// Conditional classes
<View className={cn("p-md", isActive && "bg-primary", className)} />

// Variants
const variants = { primary: "bg-primary text-white", secondary: "bg-gray-200" };
<TouchableOpacity className={cn(variants[variant], className)} />
```

---

## 14. Build & Deployment

**Already configured** in `eas.json`

- Dev: `npx expo start`
- Test build: `eas build --platform ios --profile preview`
- Production: `eas build --platform ios --profile production --auto-submit`

---

## 15. Offline Support

**Already configured:** React Query persistence with AsyncStorage in `src/lib/query-client.ts`

- Automatic cache persistence and rehydration on app restart
- **Optimistic updates:** Use `onMutate` callback in mutations

---

## 16. Code Quality & Conventions

### TypeScript

- Strict mode enabled, type everything (props, API responses, store state)
- Use shared types from `@my-app/shared-types`

### File Naming

- `kebab-case` for all files (e.g., `feature-card.tsx` exports `FeatureCard()`)
- Pattern: `<domain>.api.ts`, `<domain>.store.ts`, `validation.ts`

### Organization

- One component per file
- Imports: React/RN → third-party → relative
- Use `logger`, never `console.log`

### Best Practices

✅ Always use Zustand for cross-component state.
✅ Always use React Query for server state.
✅ Always use NativeWind className prop for styling (never inline styles or StyleSheet).
✅ Validate forms with Zod before API calls.
✅ Log all errors via error-handler.
✅ Track user actions via analyticsService.
✅ Test on real devices early (iOS/Android differ).
✅ Monitor bundle size (Expo can show per-module breakdown).
✅ Use SecureStore for tokens, AsyncStorage for cache.

❌ Never store auth tokens in AsyncStorage (not encrypted - use SecureStore).
❌ Never call APIs directly from components (use React Query).
❌ Never hardcode env vars; use EXPO*PUBLIC*\* prefixes.
❌ Never mutate Zustand state directly; use setters.
❌ Never use inline styles or StyleSheet.create() (use NativeWind className).

---

## 17. How AI Should Extend This Project

When implementing new features:

1. **Identify the domain** (auth, billing, etc).
2. **Create module structure** (if not exists):
   - `src/modules/<domain>/<domain>.api.ts` — React Query hooks.
   - `src/modules/<domain>/<domain>.store.ts` — Zustand (if needed).
   - `src/modules/<domain>/components/` — UI components.
   - `src/modules/<domain>/validation.ts` — Zod schemas (if forms needed).
3. **Add routes** (if adding new screens):
   - Create file in `app/` (e.g., `app/(tabs)/new-feature.tsx`).
   - Import component from `src/modules/<domain>/components/`.
   - Use `useLocalSearchParams` for dynamic segments.
4. **Use NativeWind className** for all styling:
   - Import `cn()` from `@/src/lib/utils` for conditional classes.
   - Use custom theme classes (p-md, bg-primary, text-base, etc).
   - Never use inline styles or StyleSheet.create().
5. **Test on real devices** (especially iOS vs Android differences).

All deviations from this architecture must be justified in comments or updated in this file.
