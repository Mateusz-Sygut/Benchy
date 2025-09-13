# 🪑 ŁawAppka (Benchy) - Smart Bench Discovery App

[![React Native](https://img.shields.io/badge/React%20Native-0.79.5-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-54.0.0-blue.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-green.svg)](https://supabase.com/)

**ŁAWECZKApp** is a smart mobile application for adding, discovering and rating benches in your area. Find the perfect place to rest, add new benches, and rate the ones you already know!

## 🚀 **Features**

- 📍 **Interactive Maps** - See all benches in your area
- ➕ **Add Benches** - Add new resting places
- ⭐ **Rating System** - Rate benches and see average ratings
- 🔍 **Bench Details** - Check description, location, and ratings
- 🌍 **Multi-language** - Polish and English
- 👤 **Authentication** - Secure login and registration

## 📁 **Project Structure**

```
Laweczka/
├── 📱 laweczka-fe/          # Frontend - React Native App
│   ├── src/
│   │   ├── screens/         # App screens
│   │   │   └── auth/        # Authentication screens
│   │   ├── components/      # UI components
│   │   │   └── common/      # Common components
│   │   ├── navigation/      # Navigation
│   │   ├── i18n/           # Translations
│   │   ├── types/          # TypeScript types
│   │   ├── lib/            # Libraries (Supabase)
│   │   ├── contexts/       # React contexts
│   │   └── styles/         # Centralized styling system
│   │       ├── colors.ts   # Color palette
│   │       ├── common.ts   # Common styles
│   │       ├── components.ts # Component styles
│   │       └── screens.ts  # Screen styles
│   ├── app.json            # Expo configuration
│   └── package.json        # Dependencies
│
└── 🔧 laweczka-be/          # Backend - Supabase
    └── supabase/
        ├── migrations/     # SQL migrations
        └── config.toml     # Supabase configuration
```

## 🛠️ **Technologies**

### **Frontend (`laweczka-fe`)**
- **React Native** + **Expo SDK 54** - Mobile framework
- **TypeScript** - Type safety
- **React Navigation** - Navigation between screens
- **react-native-maps** - Google/Apple Maps
- **expo-location** - Geolocation
- **expo-localization** - Localization
- **expo-linear-gradient** - Gradients
- **react-i18next** - Internationalization
- **react-native-safe-area-context** - Safe area handling
- **@expo/vector-icons** - Icons
- **EAS Build** - Production builds and publishing
- **Centralized Styling System** - Organized StyleSheet architecture

### **Backend (`laweczka-be`)**
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Database
- **Row Level Security (RLS)** - Security
- **Real-time subscriptions** - Live updates

## 🚀 **Quick Start**

### **1. Clone Repository**
```bash
git clone <repository-url>
cd Laweczka
```

### **2. Backend Setup (Supabase)**
```bash
cd laweczka-be
# Follow instructions in README.md
```

### **3. Frontend Setup**
```bash
cd laweczka-fe
npm install
npx expo start
```

### **4. Testing**
- 📱 **Expo Go** - Scan QR code in Expo Go app
- 🌐 **Web** - Press `w` in terminal
- 📱 **Development Build** - For full map functionality

## 📱 **App Screens**

### **🔐 Authentication**
- **Login** - User login with email/password
- **Register** - New account registration

### **🗺️ Main App**
- **Map** - Interactive map with benches and user location
- **Bench List** - List of all benches with ratings
- **Add Bench** - Add new bench with location
- **Bench Details** - Bench details, ratings, and comments
- **Profile** - User profile and settings
- **Loading** - Loading screen

## 🗄️ **Database**

### **Tables**
- **`benches`** - Bench information (id, name, description, latitude, longitude, user_id, average_rating)
- **`ratings`** - User ratings (id, bench_id, user_id, rating, comment)
- **`auth.users`** - User profiles (handled by Supabase Auth)

### **Security**
- **Row Level Security (RLS)** - Access control
- **Policies** - Data access rules
- **Triggers** - Automatic average rating calculation

## 🌍 **Internationalization**

App supports:
- 🇵🇱 **Polish** (default)
- 🇬🇧 **English**

Translations in: `laweczka-fe/src/i18n/locales/`

## 🎨 **Design System**

### **Colors**
- **Primary**: `#2e7d32` (Green)
- **Background**: `#ffffff` (White)
- **Text**: `#333333` (Dark gray)
- **Success**: `#4caf50` (Green)
- **Warning**: `#ff9800` (Orange)
- **Error**: `#f44336` (Red)
- **Rating**: `#ffd700` (Gold)

### **Components**
- **Button** - Buttons with gradient and variants
- **Input** - Text fields with icons
- **StarRating** - Star rating system
- **ExpoMap** - Map component with user location
- **SearchModal** - Search functionality
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
cd laweczka-fe
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
- ✅ **Package Name**: `com.laweczka.app`
- ✅ **Permissions**: Location, Camera, Storage
- ✅ **Google Maps API**: Required for Android maps
- 🔄 **Status**: Ready for EAS Build
- 📋 **Requirements**: 
  - Google Maps API Key
  - App signing key
  - Store listing materials

#### **Apple App Store**
- ✅ **Bundle ID**: `com.laweczka.app`
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

The app uses a **centralized styling system** for better maintainability and consistency:

### **Style Organization**
```
src/styles/
├── colors.ts      # Color palette and theme
├── common.ts      # Common styles (containers, layouts)
├── components.ts  # Reusable component styles
├── screens.ts     # Screen-specific styles
└── animations.ts  # Animation styles and configurations
```

### **Benefits**
- ✅ **Consistent Design** - Unified color palette and spacing
- ✅ **Easy Maintenance** - All styles in one place
- ✅ **Type Safety** - TypeScript support for all styles
- ✅ **Reusability** - Shared styles across components
- ✅ **Performance** - StyleSheet.create optimization
- ✅ **Animated Effects** - Centralized animation configurations
- ✅ **Plant Animations** - Living, feng shui-inspired effects

### **Usage Example**
```typescript
import { screenStyles } from '../styles/screens';
import { componentStyles } from '../styles/components';
import { colors } from '../styles/colors';
import { animationStyles, animationConfigs } from '../styles/animations';

// In component
<View style={screenStyles.authContainer}>
  <Button style={componentStyles.buttonPrimary} />
</View>

// Animation components
<PlantAnimations variant="login" />
<BackgroundPlants />
<ParticleEffects />
```

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
- 📧 **Email**: [contact@laweczka.app](mailto:contact@laweczka.app) (...not yet)

---

**ŁAWECZKA** - Find the perfect place to rest! 🪑✨
