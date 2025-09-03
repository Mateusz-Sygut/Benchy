# 📱 Ławeczka Frontend

React Native + Expo aplikacja do znajdowania ławeczek.

## 🚀 **Uruchamianie**

### **Web (dla testowania UI)**
```bash
npx expo start --web
```

### **Android/iOS Development Build**
```bash
# Android
npx eas build --platform android --profile development

# iOS (wymaga Apple Developer account)
npx eas build --platform ios --profile development
```

### **Development z Expo Go**
```bash
npx expo start
# Skanuj QR kod w Expo Go app
```

## 🔧 **Konfiguracja**

### **1. Dodaj tokeny do `app.json`:**
```json
{
  "extra": {
    "MAPBOX_ACCESS_TOKEN": "pk.eyJ1...",
    "SUPABASE_URL": "https://twoj-projekt.supabase.co",
    "SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "plugins": [
    [
      "@rnmapbox/maps",
      {
        "RNMapboxMapsDownloadToken": "sk.eyJ1..."
      }
    ]
  ]
}
```

### **2. Setup Supabase Database**
Zobacz instrukcje w `../laweczka-be/README.md`

## 📁 **Struktura**

```
src/
├── components/       # Reusable components
├── contexts/         # React contexts (Auth)
├── i18n/            # Translations (PL/EN)
├── lib/             # External services (Mapbox, Supabase)
├── navigation/      # React Navigation setup
├── screens/         # App screens
├── styles/          # Style definitions
└── types/           # TypeScript types
```

## 🧪 **Features**

- ✅ **Authentication** - Login/Register z Supabase
- ✅ **Map** - Mapbox z markerami ławeczek  
- ✅ **CRUD** - Dodawanie, przeglądanie, ocenianie ławeczek
- ✅ **i18n** - Wsparcie PL/EN
- ✅ **Responsive** - Działa na phone/tablet
- ✅ **Native modules** - Pełne API urządzenia

## 📱 **Testowanie**

1. **Web** - `npx expo start --web` (UI/UX testing)
2. **Expo Go** - `npx expo start` (basic testing)  
3. **Development Build** - `npx eas build` (full features)

## 🐛 **Debugging**

```bash
# Clear cache
npx expo start --clear

# Reset Metro
npx expo start --reset-cache

# Check dependencies
npx expo doctor
```

