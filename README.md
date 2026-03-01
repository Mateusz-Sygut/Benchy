# 🪑 ŁawAppka - Smart Bench Discovery App

[![React Native](https://img.shields.io/badge/React%20Native-0.81.4-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-54.0.7-blue.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-green.svg)](https://supabase.com/)

**ŁawAppka** is a revolutionary mobile application with **glassmorphism design** and **panel-based navigation** for discovering, adding, and rating benches in your area. Experience the future of bench discovery with click panels, rarity system, achievements, and beautiful glassmorphism UI!

## 🚀 **Features**

### **🎨 Revolutionary Design**
- 🌟 **Glassmorphism UI** - Beautiful glass-like elements with transparency
- 📱 **Panel Navigation** - Click panels for different sections
- 🎯 **Drag Handles** - Intuitive arrow buttons for panel access
- 🌈 **Rarity System** - 5 rarity levels with unique colors

### **🏆 Gamification System**
- 🏅 **Achievements** - Automatic unlocking system
- 🎖️ **Titles** - Assignable titles
- 🪙 **Tokens** - 3-tier achievement rewards
- 📊 **User Stats** - Track your bench contributions

### **📍 Core Functionality**
- 🗺️ **Interactive Maps** - See all benches with rarity colors
- ➕ **Smart Bench Adding** - Types, locations, tags (max 4); **location choice**: use your GPS or pick a spot on the map
- ⭐ **Rating System** - Rate benches and see average ratings
- 🔍 **Bench Details** - Complete information with rarity
- ❤️ **Favorites** - Save your favorite benches
- 🌍 **Multi-language** - Polish and English
- 👤 **Authentication** - Secure login and registration; optional random nickname on signup (“Losuj”)
- 🏷️ **Display names** - Username or generated nickname (PL/EN)

### **🎮 Navigation System**
- 👈 **Left Panel** - Achievements, tasks, profile
- 👉 **Right Panel** - Your benches, favorites, add bench
- ⬆️ **Bottom Panel** - Nearby benches list
- 🎯 **Click Navigation** - Simple arrow buttons for panel access

## 📁 **Project Structure**

```
Benchy/
├── 📱 benchy-fe/            # Frontend - React Native App
│   ├── src/
│   │   ├── screens/         # App screens
│   │   │   └── auth/        # Authentication screens
│   │   ├── components/      # UI components
│   │   │   ├── common/      # Common (Button, Input, ExpoMap, LocationMapPicker, etc.)
│   │   │   ├── navigation/  # Panel navigation system
│   │   │   └── panels/      # Panel components (User, Bench, Nearby)
│   │   ├── hooks/           # Custom hooks (useAchievements)
│   │   ├── navigation/      # App navigation
│   │   ├── i18n/           # Translations (EN/PL)
│   │   ├── types/          # TypeScript types
│   │   ├── lib/            # Libraries (Supabase, API, displayName, geocoding)
│   │   ├── contexts/       # React contexts
│   │   └── styles/         # Centralized styling system
│   │       ├── colors.ts   # Color palette
│   │       ├── common.ts   # Common styles
│   │       ├── components.ts # Component styles
│   │       ├── screens.ts  # Screen styles
│   │       ├── glassmorphism.ts # Glassmorphism & panel styles
│   │       └── animations.ts # Animation styles
│   ├── app.json            # Expo configuration
│   └── package.json        # Dependencies
│
└── 🔧 benchy-be/            # Backend - Supabase
    └── supabase/
        ├── migrations/     # SQL migrations
        │   ├── 001_initial_schema.sql
        │   └── 004_simple_lawappka.sql # Complete feature set
        └── config.toml     # Supabase configuration
```

## 🛠️ **Technologies**

### **Frontend (`benchy-fe`)**
- **React Native** + **Expo SDK 54** - Mobile framework
- **TypeScript** - Type safety
- **React Navigation** - Navigation between screens
- **Panel Navigation System** - Custom click-based panel navigation
- **react-native-maps** - Google/Apple Maps
- **expo-location** - Geolocation
- **expo-localization** - Localization
- **expo-linear-gradient** - Gradients
- **react-i18next** - Internationalization
- **react-native-safe-area-context** - Safe area handling
- **@expo/vector-icons** - Icons
- **EAS Build** - Production builds and publishing
- **Glassmorphism Design System** - Modern glass-like UI
- **Centralized Styling System** - Organized StyleSheet architecture

### **Backend (`benchy-be`)**
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Database with advanced features
- **Row Level Security (RLS)** - Security
- **Real-time subscriptions** - Live updates
- **Database Triggers** - Automatic achievement unlocking
- **Advanced Schema** - Rarity, achievements, titles, favorites

## 🚀 **Quick Start**

### **1. Clone Repository**
```bash
git clone <repository-url>
cd Benchy
```

### **2. Backend Setup (Supabase)**
```bash
cd benchy-be
# Follow instructions in README.md
```

### **3. Frontend Setup**
```bash
cd benchy-fe
npm install
npx expo start
```

### **4. Testing**
- 📱 **Expo Go** - Scan QR code in Expo Go app
- 🌐 **Web** - Press `w` in terminal
- 📱 **Development Build** - For full map functionality

## 📱 **App Screens & Navigation**

### **🔐 Authentication**
- **Login** - User login with email/password
- **Register** - New account registration; optional to generate a random nickname (translated PL/EN)

### **🗺️ Main App - Panel Navigation**
- **Map Screen** - Interactive map with benches and rarity colors
- **Left Panel** - Achievements, tasks, user profile
- **Right Panel** - Your benches, favorites, add bench
- **Bottom Panel** - Nearby benches list

### **📋 Detailed Screens**
- **Bench List** - List of all benches with ratings
- **Add Bench** - Add bench with types, surroundings, tags; **location**: “Your location” (GPS) or “Pick on map” (tap-to-select, centered on your position; fallback Tokyo)
- **Bench Details** - Complete bench information with rarity
- **Profile** - User profile, stats, and settings
- **Loading** - Loading screen

## 🗄️ **Database Schema**

### **Core Tables**
- **`benches`** - Bench information with rarity, types, locations, tags
- **`ratings`** - User ratings and comments
- **`auth.users`** - User profiles (handled by Supabase Auth)

### **New Feature Tables**
- **`rarity`** - 5 rarity levels with colors (Ordynarna, Normalna, Rzadka, Unikatowa, Anomalna)
- **`bench_types`** - Bench types (Metalowa, Drewniana, Kamienna, Dizajnerska)
- **`locations`** - Location types (Park, Miasto, Las, Woda)
- **`tags`** - Bench tags (Spokojna, Zatłoczona, Cicha, Głośna, etc.)
- **`achievements`** - Achievement definitions with requirements
- **`user_achievements`** - User's unlocked achievements
- **`titles`** - LoL-style titles
- **`user_titles`** - User's unlocked titles
- **`favorites`** - User's favorite benches
- **`user_profiles`** - Extended user statistics

### **Security & Automation**
- **Row Level Security (RLS)** - Access control
- **Policies** - Data access rules
- **Smart Rarity System** - Intelligent rarity assignment
- **Automatic Rating Updates** - Real-time average calculation
- **Database Triggers** - Automatic achievement unlocking
- **Functions** - User stats updates

### **🎲 Smart Rarity System**
The rarity system automatically assigns rarity levels based on existing benches:

**🔄 Dynamic Logic:**
- **Normal ↔ Rare**: If one is 1+ more than the other, assign the opposite
- **Unique**: Requires 5+ more benches than any other rarity
- **Common**: Requires 5+ more benches than any other rarity  
- **Anomalous**: Triggered when Unique and Common are equal
- **Fallback**: Alternates between Normal and Rare

**📊 Example Scenarios:**
- 10 Normal, 9 Rare → Next bench gets **Rare**
- 15 Unique, 10 Normal → Next bench gets **Unique** (5+ difference)
- 8 Unique, 8 Common → Next bench gets **Anomalous** (equal counts)

## 🌍 **Internationalization**

App supports:
- 🇵🇱 **Polish** (default)
- 🇬🇧 **English**

Translations in: `benchy-fe/src/i18n/locales/`. Includes UI strings and **nickname word lists** (adjectives/nouns for generated display names).

## 🎨 **Design System**

### **🌟 Glassmorphism Design**
- **Glass Containers** - Transparent elements with blur effects
- **Panel Backgrounds** - Colored glass panels (left: blue, right: red, bottom: green)
- **Drag Handles** - Green glass arrow buttons
- **Transparency** - `rgba()` colors with opacity
- **Borders** - Subtle white borders for glass effect
- **Shadows** - Depth and elevation

### **🌈 Rarity Color System**
- **Ordynarna** (Common): `#808080` (Gray)
- **Normalna** (Normal): `#00FF00` (Green)
- **Rzadka** (Rare): `#0080FF` (Blue)
- **Unikatowa** (Unique): `#FF8000` (Orange)
- **Anomalna** (Anomalous): `#FF0080` (Pink)

### **🎯 Core Colors**
- **Primary**: `#7cb342` (Green) - Updated for glassmorphism
- **Background**: `#ffffff` (White)
- **Text**: `#333333` (Dark gray)
- **Success**: `#4caf50` (Green)
- **Warning**: `#ff9800` (Orange)
- **Error**: `#f44336` (Red)
- **Rating**: `#ffd700` (Gold)

### **🧩 Components**
- **PanelNavigator** - Main navigation system
- **UserPanel** - Left panel with achievements
- **BenchPanel** - Right panel with bench options
- **NearbyBenchesPanel** - Bottom panel with nearby benches
- **Button** - Glassmorphism buttons
- **Input** - Glassmorphism text fields
- **StarRating** - Star rating system
- **ExpoMap** - Map with rarity-colored pins
- **LocationMapPicker** - Modal map to pick bench location (tap/drag marker; centers on user or Hachikō statue fallback)
- **ScrollingBenchesHeader** - Animated header

## 🔧 **Configuration**

### **Environment Variables**
```json
// app.json
{
  "expo": {
    "extra": {
      "SUPABASE_URL": "YOUR_SUPABASE_URL",
      "SUPABASE_ANON_KEY": "YOUR_SUPABASE_ANON_KEY"
    }
  }
}
```

### **Permissions**
- **Location** - Location access
- **Camera** - Bench photos (planned)

## 🚀 **Deployment & Publishing**

### **Development**
```bash
cd benchy-fe
npx expo start
```

### **Production Build (EAS Build)**
```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure

# Build for platforms
eas build --platform android  # Google Play Store
eas build --platform ios      # App Store
```

### **📱 Store Publishing Plans**

#### **Google Play Store**
- ✅ **Package Name**: `com.lawappka.app` (Updated)
- ✅ **Permissions**: Location, Camera, Storage
- ✅ **Google Maps API**: Required for Android maps
- 🔄 **Status**: Ready for EAS Build
- 📋 **Requirements**: 
  - Google Maps API Key
  - App signing key
  - Store listing materials

#### **Apple App Store**
- ✅ **Bundle ID**: `com.lawappka.app` (Updated)
- ✅ **Permissions**: Location, Camera
- ✅ **Apple Maps**: Native iOS maps support
- 🔄 **Status**: Ready for EAS Build
- 📋 **Requirements**:
  - Apple Developer Account ($99/year)
  - App Store Connect setup
  - Store listing materials

### **🔧 EAS Build Configuration**
```json
// eas.json (auto-generated)
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

### **📋 Publishing Checklist**
- [ ] Google Maps API Key configured
- [ ] App icons and splash screens
- [ ] Privacy policy (✅ Created)
- [ ] Store descriptions (PL/EN)
- [ ] Screenshots for stores
- [ ] App signing certificates
- [ ] Store developer accounts

## 🎨 **Styling Architecture**

The app uses a **centralized styling system** with **glassmorphism design** for better maintainability and modern aesthetics:

### **Style Organization**
```
src/styles/
├── colors.ts         # Color palette and theme
├── common.ts         # Common styles (containers, layouts)
├── components.ts     # Reusable component styles
├── screens.ts        # Screen-specific styles
├── glassmorphism.ts  # Glassmorphism & panel styles
└── animations.ts     # Animation styles and configurations
```

### **🌟 Glassmorphism Features**
- ✅ **Glass Containers** - Transparent elements with blur
- ✅ **Panel Styles** - Colored glass backgrounds
- ✅ **Drag Handles** - Glass arrow buttons
- ✅ **Rarity Colors** - Dynamic color system
- ✅ **Transparency** - `rgba()` color system
- ✅ **Borders & Shadows** - Depth and elevation

### **Benefits**
- ✅ **Modern Design** - Glassmorphism aesthetic
- ✅ **Consistent Design** - Unified color palette and spacing
- ✅ **Easy Maintenance** - All styles in one place
- ✅ **Type Safety** - TypeScript support for all styles
- ✅ **Reusability** - Shared styles across components
- ✅ **Performance** - StyleSheet.create optimization
- ✅ **Panel Navigation** - Specialized panel styles

### **Usage Example**
```typescript
import { screenStyles } from '../styles/screens';
import { componentStyles } from '../styles/components';
import { glassmorphismStyles } from '../styles/glassmorphism';
import { panelNavigatorStyles } from '../styles/glassmorphism';
import { colors } from '../styles/colors';

// Glassmorphism components
<View style={glassmorphismStyles.glassContainer}>
  <Button style={glassmorphismStyles.glassButton} />
</View>

// Panel navigation
<PanelNavigator
  leftPanel={<UserPanel />}
  rightPanel={<BenchPanel />}
  bottomPanel={<NearbyBenchesPanel />}
>
  <MapScreen />
</PanelNavigator>
```

## 🚀 **Recent Major Updates**

### **🎨 Glassmorphism Design Revolution**
- **Complete UI Overhaul** - Modern glassmorphism design
- **Panel Navigation System** - Revolutionary click-based navigation
- **Glass Components** - Transparent elements with blur effects
- **Rarity Color System** - 5-level rarity with unique colors

### **🏆 Gamification System**
- **Achievement System** - Automatic unlocking with database triggers
- **Title System** - Assignable titles
- **Token Rewards** - 3-tier achievement tokens
- **User Statistics** - Comprehensive tracking

### **🗄️ Advanced Database**
- **Extended Schema** - Rarity, achievements, titles, favorites
- **Smart Rarity System** - Intelligent rarity assignment based on existing benches
- **Automatic Rating Updates** - Real-time average rating calculation
- **Advanced Features** - Bench types, locations, tags
- **Performance Optimized** - Indexes and RLS policies

### **📍 Location & Add Bench**
- **Location choice** - When adding a bench: “Your location” (GPS) or “Pick on map” (tap to set marker, draggable)
- **Map picker** - Modal map centered on user location; fallback region: Hachikō statue, Tokyo
- **Clear feedback** - UI shows whether location was set via GPS or map

### **🏷️ Display names & i18n**
- **Nicknames** - If user has no username, app shows a generated nickname (adjective + noun from translations)
- **PL/EN nicknames** - Word lists in `nickname.adjectives` / `nickname.nouns`; same index, different language
- **Register** - “Random” button to fill username with a random nickname

### **🧹 Code Cleanup**
- **Removed Unused Code** - Unused imports/exports, gesture handlers, dead functions
- **Simplified Navigation** - Click-based panel system
- **Clean Architecture** - Organized components and styles
- **Type Safety** - Full TypeScript coverage

## 🤝 **Contributing**

### **Commit Structure**
- `feat:` - New features
- `fix:` - Bug fixes
- `style:` - Style changes
- `docs:` - Documentation
- `refactor:` - Refactoring

### **Branches**
- `main` - Stable version
- `develop` - Development
- `feature/*` - New features

## 📄 **License**

MIT License - see [LICENSE](LICENSE) for details.

## 👥 **Authors**

- **Frontend**: React Native + Expo
- **Backend**: Supabase
- **Design**: Custom UI/UX

## 📞 **Support**

- 🐛 **Issues**: [GitHub Issues](link-to-issues)
- 💬 **Discussions**: [GitHub Discussions](link-to-discussions)
- 📧 **Email**: [contact@benchy.app](mailto:contact@benchy.app) (...not yet)

---

**ŁawAppka** - Experience the future of bench discovery with glassmorphism design, panel navigation, and gamification! 🪑✨🌟
