# 🫁 Breathline (Respira)

> A personalized health-planning mobile app for people with asthma and allergies. We don't show air data — we tell you when and where you can breathe.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Expo SDK](https://img.shields.io/badge/Expo-54.0-000020.svg)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB.svg)](https://reactnative.dev/)
[![React](https://img.shields.io/badge/React-19.1-61DAFB.svg)](https://reactjs.org/)

---

## 📋 Project Overview

- /plan — планирование сложных фич
- /tdd — TDD-воркфлоу
- /code-review — ревью кода
- /build-fix — исправление ошибок сборки
- /e2e — E2E тесты
- /refactor-clean — удаление мёртвого кода
- /update-docs — обновление документации
- /update-codemaps — обновление карт кода
- /test-coverage — проверка покрытия тестами

**Breathline** helps people with asthma and allergies understand when it's comfortable to breathe and plan their day with confidence.

Instead of showing raw air quality data, the app provides:
- **Personal Breathing Risk Score (PBRS)** - A 0-100 score based on your health profile
- **Clear status labels** - Comfortable, Moderate, or Unfavorable conditions
- **Calm, actionable advice** - "Good time for a walk" or "Better stay indoors until evening"
- **No alarming language** - Empowering, not fear-inducing

👉 **For complete project details, design principles, and roadmap:** See [PROJECT.md](./PROJECT.md)

---

## ✨ Features

- 🎯 **TypeScript** - Strict type safety across the entire app
- 📱 **Expo Router** - File-based routing (Next.js-like experience)
- 🎨 **NativeWind** - Tailwind CSS for React Native (utility-first styling)
- 🔐 **Authentication** - Complete auth flow with secure token storage
- 🌐 **API Integration** - Axios client with interceptors and error handling
- 📊 **State Management** - Zustand for global state + React Query for server state
- 🧩 **Modular Architecture** - Domain-driven folder structure
- ✅ **Type-Safe Forms** - React Hook Form + Zod validation
- ⚡ **Storage** - AsyncStorage + SecureStore for encrypted tokens
- 📱 **Offline Support** - React Query persistence with AsyncStorage
- 🔔 **Notifications** - Push and local notifications with expo-notifications
- 🎭 **Analytics Ready** - Provider-agnostic analytics service
- 🐛 **Error Tracking** - Error boundaries and logging utilities
- 🧪 **Testing Ready** - ESLint, Prettier, and TypeScript strict mode
- 🚀 **EAS Build** - Cloud builds for iOS and Android

## 🛠 Tech Stack

### Core

- **Framework**: [Expo](https://expo.dev/) (SDK 54) + [React Native](https://reactnative.dev/) (0.81)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (5.9) with strict mode
- **UI Framework**: React 19.1

### Navigation & Routing

- **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/) (file-based, like Next.js)
- **Navigation**: React Navigation (bottom tabs, stack navigation)

### State Management & Data

- **Global State**: [Zustand](https://github.com/pmndrs/zustand) - Minimal, fast state management
- **Server State**: [TanStack Query](https://tanstack.com/query) (React Query) - Data fetching, caching, and sync
- **HTTP Client**: [Axios](https://axios-http.com/) - HTTP client with interceptors
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) - Type-safe form validation

### Styling

- **UI Framework**: [NativeWind v4](https://www.nativewind.dev/) - Tailwind CSS for React Native
- **Utility**: `clsx` + `tailwind-merge` - Conditional class merging

### Storage & Security

- **Local Storage**: [@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/) - Async key-value storage
- **Secure Storage**: `expo-secure-store` - Encrypted token storage (Keychain/Keystore)

### Notifications

- **Push & Local**: `expo-notifications` - Push notifications, local notifications, scheduling

### Developer Experience

- **Linting**: ESLint with TypeScript, React, React Native, and Prettier rules
- **Formatting**: Prettier
- **Type Checking**: TypeScript strict mode

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 20.19.4 or higher
- [Yarn](https://yarnpkg.com/) 4.10.3 (included via Corepack)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- iOS Simulator (Mac only) or Android Emulator

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd respira-app
   ```

2. **Install dependencies**

   ```bash
   yarn install
   ```

3. **Start the development server**

   ```bash
   yarn start
   ```

4. **Run on a platform**
   - **iOS**: Press `i` or run `yarn ios`
   - **Android**: Press `a` or run `yarn android`
   - **Web**: Press `w` or run `yarn web`

## 📁 Project Structure

```
respira-app/
├── app/                          # Expo Router (file-based navigation)
│   ├── _layout.tsx              # Root layout with providers
│   ├── (auth)/                  # Auth routes
│   ├── (app)/(tabs)/            # Authenticated app with bottom tabs
│   └── +not-found.tsx
├── src/
│   ├── modules/                 # Business domains (modular monolith)
│   │   ├── auth/                # Auth: api, store, validation, components
│   │   ├── notes/               # Notes example
│   │   ├── notifications/       # Push/local notifications service
│   │   ├── analytics/           # Analytics service
│   │   └── errors/              # Error handling & boundaries
│   ├── ui/                      # Reusable UI components (NativeWind)
│   ├── lib/                     # Infrastructure (axios, query-client, storage, utils)
│   ├── theme/                   # Design tokens (legacy, mapped to Tailwind)
│   └── types/                   # TypeScript types
├── tailwind.config.js, global.css, nativewind-env.d.ts
├── AGENTS.md, app.json, eas.json, tsconfig.json
└── package.json
```

## 🏗 Architecture

### Modular Monolith

The app follows a **modular monolith** architecture where each business domain is self-contained:

```
src/modules/<domain>/
├── <domain>.api.ts        # React Query hooks (data fetching)
├── <domain>.store.ts      # Zustand store (global state, if needed)
├── validation.ts          # Zod schemas (if forms needed)
├── components/            # Domain-specific components
└── utils/                 # Domain-specific utilities
```

### Data Flow

```
Backend API
    ↓
React Query (useQuery/useMutation)
    ↓
Zustand Store (if global state needed)
    ↓
Components (render UI)
```

### Routing

Expo Router uses **file-based routing** (inspired by Next.js):

- Files in `app/` automatically become routes
- Folders in `(parentheses)` are layout groups
- `[param]` creates dynamic segments
- Deep linking works automatically

**Example:**

```
app/(app)/(tabs)/index.tsx     →  /(tabs)
app/(app)/feature/[id].tsx     →  /feature/123
app/(auth)/login.tsx           →  /login
```

## 📝 Available Scripts

```bash
# Development
yarn start              # Start Expo dev server
yarn ios               # Run on iOS simulator
yarn android           # Run on Android emulator
yarn web               # Run in web browser

# Code Quality
yarn lint              # Run ESLint
yarn format            # Format code with Prettier
yarn typecheck         # Run TypeScript type checking

# Building
yarn prebuild          # Generate native projects
```

## 🔐 Authentication Flow

The app includes a complete authentication system:

1. **Token Storage**: Secure storage using `expo-secure-store`
2. **Auto-Refresh**: Token persistence across app restarts
3. **Protected Routes**: Automatic redirect based on auth state
4. **HTTP Interceptors**: Auto-inject auth token in API requests

**Usage:**

```typescript
import { useAuthStore } from "@/src/modules/auth";

function MyComponent() {
  const { user, login, logout } = useAuthStore();

  // Login
  await login({ email, password });

  // Logout
  await logout();
}
```

## 🌐 API Integration

### Making API Calls

Use React Query hooks from `modules/<domain>/<domain>.api.ts`:

```typescript
import { useFeatures, useCreateFeature } from '@/src/modules/<domain>';

function FeaturesScreen() {
  const { data, isLoading } = useFeatures();
  const { mutate: createFeature } = useCreateFeature();

  const handleCreate = () => {
    createFeature({ name: 'New Feature' }, {
      onSuccess: () => console.log('Created!'),
    });
  };

  return <FeatureList features={data} />;
}
```

### Axios Configuration

The Axios client automatically:

- Injects auth tokens in requests
- Handles 401 errors (token expiration)
- Logs requests/responses
- Provides error handling

## 🎨 Styling with NativeWind

The app uses **NativeWind v4** (Tailwind CSS for React Native) for all styling:

```typescript
import { cn } from '@/src/lib/utils';

// Basic usage
<View className="p-md bg-white rounded-lg" />

// Conditional classes
<View className={cn("p-md", isActive && "bg-primary", className)} />

// Custom theme classes
<Text className="text-base font-semibold text-text" />
<Button className="bg-primary text-white rounded-md p-sm" />
```

**Custom Theme Classes:**

- **Colors**: `bg-primary`, `text-text`, `border-error`
- **Spacing**: `p-xs` (4px), `p-sm` (8px), `p-md` (16px), `p-lg` (24px)
- **Typography**: `text-xs/sm/base/lg/xl`, `font-regular/medium/semibold/bold`

**IMPORTANT**: Never use inline styles or `StyleSheet.create()` - always use `className` prop.

## 📊 State Management

### When to use what?

- **React Query**: Server state (API data, caching) - with AsyncStorage persistence
- **Zustand**: Global client state (auth, app settings)
- **useState**: Local component state

## 💾 Storage

### AsyncStorage (Local Storage)

```typescript
import { storage } from "@/src/lib/storage";

// String operations
await storage.setItem("key", "value");
const value = await storage.getItem("key");

// JSON operations
await storage.setJSON("user", { name: "John" });
const user = await storage.getJSON<User>("user");

// Remove items
await storage.removeItem("key");
```

### SecureStore (Encrypted Storage)

```typescript
import { secureStorage } from "@/src/lib/storage";

// For sensitive data (tokens, credentials)
await secureStorage.setItem("authToken", token);
const token = await secureStorage.getItem("authToken");
```

**Rule**: Use AsyncStorage for cache/preferences, SecureStore for tokens/credentials.

## ✅ Forms & Validation

The app uses **React Hook Form + Zod** for type-safe form validation:

```typescript
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Define schema
const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

// Use in component
function LoginForm() {
  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  return (
    <Controller
      control={control}
      name="email"
      render={({ field: { onChange, onBlur, value } }) => (
        <Input
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          error={errors.email?.message}
        />
      )}
    />
  );
}
```

**Best Practice**: Define schemas in `src/modules/<domain>/validation.ts`

## 🔔 Notifications

Push and local notifications are configured via `expo-notifications`:

```typescript
import { notificationsService } from "@/src/modules/notifications";

// Request permissions
const { granted } = await notificationsService.requestPermissions();

// Register for push notifications
const pushToken = await notificationsService.registerForPushNotifications();

// Send local notification
await notificationsService.sendLocalNotification({
  title: "Welcome!",
  body: "Thanks for signing up",
});

// Schedule notification
await notificationsService.scheduleNotification({
  title: "Reminder",
  body: "Check your notes",
  trigger: { seconds: 60 },
});

// Listen for notifications
notificationsService.addNotificationReceivedListener((notification) => {
  console.log("Received:", notification);
});
```

**Config**: Requires `EXPO_PUBLIC_PROJECT_ID` environment variable.

## 📱 Building for Production

### Development Build

```bash
# Build for iOS
eas build --platform ios --profile development

# Build for Android
eas build --platform android --profile development
```

### Production Build

```bash
# Build and submit to App Store
eas build --platform ios --profile production --auto-submit

# Build and submit to Play Store
eas build --platform android --profile production --auto-submit
```

## 🧪 Code Quality

### ESLint Rules

- TypeScript strict rules
- React/React Hooks rules
- React Native specific rules
- Prettier integration (no conflicts)

### Run Checks

```bash
# Check for linting errors
yarn lint

# Auto-fix linting issues
yarn lint --fix

# Check types
yarn typecheck

# Format all files
yarn format
```

## 📚 Key Concepts

### File Naming Convention

- **All files**: `kebab-case` (e.g., `project-detail.tsx`)
- **Components**: Export PascalCase function (e.g., `ProjectDetail`)
- **Consistency**: Matches backend conventions

### Smart vs. Dumb Components

- **Smart** (`src/modules/<domain>/components/`): Domain-aware, fetch data
- **Dumb** (`src/ui/`): Pure presentational, no business logic

### Deep Linking

Deep links work automatically with Expo Router:

```typescript
// Navigate programmatically
import { useRouter } from 'expo-router';

const router = useRouter();
router.push('/feature/123');

// Or use Link component
import { Link } from 'expo-router';

<Link href="/feature/123">View Feature</Link>
```

## 🔧 Configuration

### Environment Variables

Create `.env` files (not tracked in git):

```bash
# .env.local
EXPO_PUBLIC_API_URL=https://api.example.com
```

**Usage:**

```typescript
const API_URL = process.env.EXPO_PUBLIC_API_URL;
```

### EAS Configuration

Edit `eas.json` to configure build profiles:

```json
{
  "build": {
    "development": {
      "distribution": "internal"
    },
    "production": {
      "distribution": "store"
    }
  }
}
```

## 🤝 Contributing

1. Follow the existing code structure (modular monolith)
2. Use TypeScript strict mode
3. Use NativeWind `className` prop (never inline styles or StyleSheet)
4. Define Zod schemas in `<domain>/validation.ts` for forms
5. Use AsyncStorage for cache, SecureStore for sensitive data
6. Run `yarn lint` and `yarn typecheck` before committing
7. Follow naming conventions (kebab-case files, PascalCase components)

## 📖 Documentation

- **Product Vision & Roadmap**: See [PROJECT.md](./PROJECT.md)
- **Architecture Details**: See [AGENTS.md](./AGENTS.md)
- **Expo Docs**: https://docs.expo.dev/
- **React Native Docs**: https://reactnative.dev/
- **TypeScript Docs**: https://www.typescriptlang.org/
