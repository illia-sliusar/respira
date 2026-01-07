# Breathline (Respira) - Project Overview

## 🎯 What We're Building

**Breathline** is a personalized health-planning mobile app for people with asthma and allergies. It answers one simple question: **"Can I breathe comfortably right now?"**

Instead of showing raw environmental data, the app makes decisions for users based on:
- Air quality (AQI, PM2.5, PM10)
- Pollen forecasts
- Weather conditions (wind, temperature, humidity)
- Personal health profile (asthma, allergies, sensitivity level)

### Core Philosophy

> "We don't show air data. We tell you when and where you can breathe."

The app communicates comfort and safety in **< 1 second** without overwhelming users with charts, dashboards, or alarming language.

---

## 👥 Target Users

### Primary
- People with **asthma** (including exercise-induced)
- People with **seasonal allergies** (pollen, grass, ragweed)
- Age: 18–55
- Location: Europe / North America
- Urban lifestyle

### Secondary
- Parents of children with allergies
- People sensitive to air pollution

---

## 🎨 Design Principles

### Visual Style
- **Minimalistic & calm** health-tech aesthetic
- **Dark mode first** design
- Scandinavian / Apple-like interface
- Atmospheric color palette: deep charcoal → subtle muted dark red
- **Never use bright red or alarming colors**

### Motion & Atmosphere
- Abstract airflow waves
- Organic, slow, subtle animations
- Suggest air movement (not water)
- Calm typography - no ALL CAPS for alerts

---

## 🚀 Core Features (Priority Order)

### 1. Personal Breathing Risk Score (PBRS) ⭐ TOP PRIORITY

**What it does:**
- Calculates a personalized comfort score (0-100)
- Based on environmental data + user health profile
- Shows clear status without using the word "Risk"

**Status Labels:**
- ✅ Comfortable conditions
- ⚠️ Moderate conditions
- 🔴 Unfavorable conditions

**UX Rules:**
- ONE main score on screen
- NO tables or dashboard cards
- Primary recommendation (1 sentence only)

### 2. Advice Engine

**Purpose:**
Give simple, calm advice that helps users plan their day without fear.

**Advice Types:**

**Activity advice:**
- "Good time for a walk"
- "Better stay indoors until evening"
- "Avoid outdoor exercise today"

**Preventive health advice:**
- "Allergy season approaching — consider limiting raw apples"
- "High pollen levels — keep windows closed"

**Asthma-specific:**
- "Use inhaler before going outside"
- "Cold air may trigger symptoms"

**Rules:**
- Maximum 1 primary advice
- Rest are secondary
- Tone: calm, confident, non-medical
- **NEVER use:** "dangerous", "hazard", "emergency"

### 3. Personal Health Profile

**Required inputs:**
- Allergies (multi-select)
- Sensitivity level (low/medium/high)
- Asthma (yes/no)

**Optional inputs:**
- Asthma triggers
- Dietary sensitivities
- Medications

**UX:**
- Hidden from main flow
- Used implicitly in recommendations
- Advice includes micro-context: "Based on your profile"

---

## 📱 MVP Screens

### 1. Home / Status Screen
- Greeting
- PBRS score (large, prominent)
- Status text
- Primary advice
- Subtle atmospheric background

### 2. Advice & Details Screen
- Expanded recommendations
- Secondary indicators (collapsed by default)
- Contextual information

### 3. Profile Screen
- Health configuration
- Allergy selection
- Sensitivity settings
- Account settings

### 4. Auth Screens
- Login (✅ Already implemented with minimalist design)
- Signup
- OAuth (Google, Apple)

---

## 🚫 What NOT to Build

❌ Weather dashboard with multiple cards
❌ AQI-first UI with charts
❌ Medical diagnosis features
❌ Loud alerts / warnings
❌ Over-explaining raw data
❌ Pure bright red colors or alarming visuals

---

## 🎯 Success Criteria

The app is successful if:

1. ✅ Main screen answers "Can I go outside?" in < 1 second
2. ✅ UI feels calm even when conditions are bad
3. ✅ Advice sounds human, not clinical
4. ✅ Visuals suggest air & breathing, not data charts
5. ✅ User never feels overwhelmed or scared

---

## 🏗️ Technical Stack

### Frontend (Mobile App)
- **Framework:** React Native + Expo
- **Navigation:** Expo Router (file-based)
- **Styling:** NativeWind (Tailwind CSS for React Native)
- **State Management:** Zustand
- **Forms:** React Hook Form + Zod validation
- **API Client:** Axios + TanStack Query

### Backend (Planned)
- **Authentication:** Better Auth
- **Database:** TBD (PostgreSQL/Supabase recommended)
- **APIs to integrate:**
  - Air quality API (IQAir, OpenWeather, etc.)
  - Pollen API
  - Weather API
  - Geolocation services

### Scoring Algorithm (Core Logic)
- **PBRS calculation engine** (to be developed)
- Inputs: AQI, pollen, weather, user profile
- Output: 0-100 score + status + advice

---

## 📋 Current Status

### ✅ Completed
- Project boilerplate setup (React Native + Expo)
- Authentication flow structure
- **Login screen with minimalist design** (matches PRD aesthetic)
- Basic UI components (Button, Input, SocialButton, Card)
- Dark mode support in Tailwind config
- Navigation structure

### 🚧 In Progress
- Project documentation

### 📝 Next Steps (Priority Order)

1. **Update design system to match PRD**
   - Implement dark charcoal → muted red gradient backgrounds
   - Create atmospheric airflow animations
   - Refine typography for calm aesthetic
   - Remove any bright red colors

2. **Build Home/Status screen (PBRS)**
   - Large breathing score display (0-100)
   - Status label component
   - Primary advice section
   - Atmospheric background with subtle animation

3. **Implement Personal Health Profile**
   - Onboarding flow
   - Allergy selection UI
   - Sensitivity level picker
   - Asthma configuration

4. **Integrate Air Quality APIs**
   - Research and select API providers
   - Set up API clients
   - Implement data fetching layer

5. **Build PBRS Calculation Engine**
   - Design scoring algorithm
   - Factor in user health profile
   - Generate contextual advice
   - Test with real data

6. **Build Advice & Details screen**
   - Expandable recommendations
   - Secondary indicators
   - Activity suggestions

7. **Add subtle animations**
   - Airflow waves
   - Score transitions
   - Calm micro-interactions

8. **Testing & Refinement**
   - User testing with target audience
   - Refine advice engine tone
   - Optimize for < 1 second comprehension

---

## 🎨 Design Reference

### Color Palette
```
Background:
- Deep charcoal: #1a1a1a → #2a1a1a
- Subtle dark red undertone (not bright)

Text:
- Primary: #ffffff
- Secondary: #9ca3af
- Muted: #6b7280

Status colors:
- Comfortable: #00d26b (calm green)
- Moderate: #f59e0b (warm amber)
- Unfavorable: #8b3a3a (muted dark red, NOT bright)
```

### Typography Principles
- Use sentence case for everything
- Never ALL CAPS for status labels
- Font weight: 300-600 (no ultra-bold)
- Status feels descriptive, not alarming

---

## 📖 One-Sentence Description

**Breathline helps people with asthma and allergies understand when it's comfortable to breathe and plan their day with confidence.**

---

## 🤝 Development Notes

### For AI Agents / Developers

When implementing features:

1. **Always prioritize calmness over urgency**
   - Even "unfavorable" conditions should feel manageable
   - Use soft language and visuals

2. **Question: "Does this reduce anxiety?"**
   - If a feature increases stress → reconsider design
   - Goal is empowerment, not fear

3. **The user should NEVER need to interpret data**
   - Don't show raw AQI numbers prominently
   - Always translate to human advice

4. **Test comprehension speed**
   - Can user understand status in 1 second?
   - If not, simplify further

---

## 📚 Additional Resources

- **PRD Source:** (see original document)
- **Design Assets:** TBD
- **API Documentation:** TBD
- **User Research:** TBD

---

**Last Updated:** 2026-01-07
**Project Status:** Early Development
**Target Launch:** TBD
