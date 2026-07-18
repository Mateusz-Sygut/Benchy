# ŁawAppka (Benchy)

Mobile app for discovering, adding, and rating public benches on a map. Frontend: React Native (Expo) and TypeScript; backend: Supabase (PostgreSQL).

[![React Native](https://img.shields.io/badge/React%20Native-0.81-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-54-blue.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green.svg)](https://supabase.com/)

## What this project is

**ŁawAppka** is a cross-platform mobile app (Expo / React Native) for sharing and exploring public benches. Data is stored in **Supabase** (PostgreSQL): you see benches on a map and in lists, can add your own with a description, type, tags, and location, and rate what others added. Heavier rules—how new benches get a rarity tier, achievements, login streaks, rolling average ratings—are enforced in the database with SQL triggers and functions, not only in the app code.

## Repository layout

| Path | Contents |
|------|----------|
| `benchy-fe/` | Full Expo app: screens, components, navigation, light/dark themes, PL/EN translations, Supabase client. |
| `benchy-fe/App.tsx` | Entry: `ThemeProvider`, `LanguageProvider`, `AuthProvider`, `AchievementsProvider`, `SitSessionProvider`, navigation. |
| `benchy-fe/src/screens/` | Map, bench list, bench details, add bench, profile, settings, help, my benches, my ratings, favourites, login/register. |
| `benchy-fe/src/components/` | Shared UI (map, buttons, inputs), `bench/` (sit session card + 3D viewer), `panels/`. |
| `benchy-fe/src/contexts/` | `AuthContext`, `ThemeContext`, `LanguageContext`, `AchievementsContext`, `SitSessionContext` (GPS sit timer). |
| `benchy-fe/src/theme/` + `styles/` | Colour tokens for light/dark and `create*Styles(theme)` style factories. |
| `benchy-fe/src/lib/` | Supabase, geocoding, titles, user tasks, achievement progress, app time, sit session helpers. |
| `benchy-fe/assets/models/` | 3D sit character (`sit-character.glb`) shown during an active sit. |
| `benchy-fe/metro.config.js` | Metro asset extensions for `.glb` / `.gltf`. |
| `benchy-fe/src/i18n/locales/` | `en.json`, `pl.json` (UI strings + random nickname word lists). |
| `benchy-be/supabase/migrations/` | SQL: schema, functions, triggers (e.g. smart rarity, rating averages). |
| `benchy-be/supabase/config.toml` | Local Supabase CLI config (if you use it). |

## How it works (short)

1. The **app** talks to your Supabase project via URL and anon key (`app.json` –> `expo.extra`). Users sign in with Supabase Auth (email/password).
2. **Data** (benches, ratings, profile, favourites, rarity) lives in PostgreSQL tables. Access is governed by **Row Level Security (RLS)** policies from migrations.
3. On **new bench** `INSERT`, `rarity_id` is set by trigger `set_smart_rarity`, which calls `calculate_smart_rarity()` – see below.
4. **Map UI** uses `react-native-maps` and `expo-location`. Navigation is **React Navigation** (stack) plus a custom **`PanelNavigator`**: left/right/bottom slide-in panels controlled from the map.
5. **Theme** (light/dark/system) is provided by `ThemeProvider`; preference is stored in AsyncStorage; screen styles come from `useThemedStyles()` and factories under `styles/`.

## What you can do in the app

For a signed-in user (within what RLS allows):

– **Map** – benches as pins (colour by rarity), recenter on user location, favourites filter, shortcut to profile.
– **Panels** – left: profile, stats, achievements with progress, tiered onboarding tasks; right: add bench, my benches, favourites; bottom: nearby benches (GPS distance when location is on, otherwise newest with a fallback message).
– **Bench list** – text search, open details or map.
– **Bench details** – description, mini map, average rating, favourites, **Sit here** (GPS sit session with timer + rotating 3D character), rarity, rating and comment.
– **Add bench** – description, bench type, surroundings, tags (UI limit), **GPS location or pick on map** (modal with draggable marker).
– **Profile** – stats (including time in app), login streak, equipable titles, achievements, shortcuts to “My benches” / “My ratings”, **Settings** (appearance & language), **Help** (FAQ), sign out.
– **Registration** – optional button to fill a random nickname from word lists in the current locale.

**Gamification:** achievements unlock from benches, ratings, favourites, login streaks, **time spent in the app**, and **physical sit sessions** on a bench (within ~80 m GPS, timer on Bench Details, sessions ≥ 2 min; sit achievements e.g. first sit / 5 min / 15 min). Active sit shows a tinted GLB character (`assets/models/sit-character.glb`) via `expo-gl` + `three`. The user panel shows **3 task tiers** (9 tasks total). Locked achievement cards show progress (e.g. `18/30 min`).

Without an account you typically only get login/register; everything else depends on Supabase config and RLS.

## Languages and tooling

**Languages (code and assets)**

| Area | Language / format |
|------|-------------------|
| Mobile app | **TypeScript** (`.ts`, `.tsx`) |
| Backend migrations | **SQL** (PostgreSQL) |
| Translations | **JSON** (`en.json`, `pl.json`) |
| Expo config | **JSON** (`app.json`) |

**Application stack (frontend)**

- **React Native** + **Expo** (SDK 54) – one codebase for iOS / Android / web (see Expo docs for web vs native map limitations).
- **React Navigation** – screen stack (add bench, details, profile from map, etc.).
- **react-native-maps** – map and markers.
- **expo-location** – permissions and GPS (map + sit proximity).
- **expo-gl** + **three** – 3D sit character on Bench Details.
- **expo-linear-gradient**, **expo-status-bar** – gradients and status bar.
- **react-i18next** + **i18next** – i18n.
- **@supabase/supabase-js** – Auth and database API.
- **@react-native-async-storage/async-storage** – e.g. theme preference.

**Backend**

- **Supabase** – hosted PostgreSQL, Auth, optional Realtime (app mainly uses queries as needed).
- **RLS policies**, **triggers**, and **SQL functions** – server-side logic on inserts/updates.

**Developer tools**

- **Node.js** + **npm** – install and scripts.
- **Metro** (via Expo) – dev bundler.
- **TypeScript compiler** (`tsc --noEmit`) – static checks (useful in CI).
- **EAS CLI** (optional) – store builds (`eas build`).

## Quick start

```bash
git clone <repo-url>
cd Benchy
```

**Backend:** configure a Supabase project and apply migrations from `benchy-be/supabase/migrations/`:

| Migration | Purpose |
|-----------|---------|
| `database.sql` | Main schema, RLS, smart rarity, achievements (incl. time-based), titles |
| `add_login_streak.sql` | Login streak columns on `user_profiles` |
| `add_avatar_storage.sql` | Avatar storage bucket/policies |
| `add_time_spent_achievements.sql` | `sitter` / `benchPhilosopher` achievements (also in `database.sql` for fresh installs) |
| `add_sit_sessions.sql` | Physical sit sessions at benches + sit achievements |

Run any incremental migrations you have not applied yet on an existing project.

**Frontend:**

```bash
cd benchy-fe
npm install
npx expo start
```

- **Expo Go** – scan QR (maps may need a dev build on some platforms).
- **Web** – press `w` in the Expo CLI.
- **Full native maps / production-like behaviour** – `expo run:android` / `expo run:ios` or an EAS build.

### Typecheck (no JS emit)

Run inside **`benchy-fe/`** (after `npm install` there):

```bash
cd benchy-fe
npm run build
```

This runs `tsc --noEmit` (TypeScript only; no Expo bundle). From the repo root you can use `npm run build --prefix benchy-fe` instead.

## Configuration

Supabase in Expo config, e.g. `app.json` → `expo.extra`:

```json
{
  "expo": {
    "extra": {
      "SUPABASE_URL": "https://YOUR_PROJECT.supabase.co",
      "SUPABASE_ANON_KEY": "YOUR_ANON_KEY"
    }
  }
}
```

Typical permissions: **location**. Camera/storage may be needed for future photo features.

## Security notes

- `SUPABASE_URL` and `SUPABASE_ANON_KEY` are expected in the client app, but they are **not** a replacement for database security.
- **Never commit secrets** (service role keys, database passwords, personal access tokens). Keep sensitive values in local env/config only.
- Keep **RLS enabled** on all application tables. For dictionary-like tables (e.g. `rarity`, `bench_types`, `locations`, `tags`, `achievements`, `titles`), allow read-only policies for `anon/authenticated` as needed.
- User-owned data (`favorites`, `ratings`, `user_profiles`, etc.) should have owner-based policies (typically `user_id = auth.uid()` for write operations).
- After schema changes, re-check Supabase **Security Advisor** and verify no new public write paths were introduced.

## Theming and dark mode

- **`ThemeProvider`** (`App.tsx`) + **`buildAppTheme(isDark, preference)`** in `src/theme/theme.ts`.
- **`useThemedStyles()`** – consistent screen and component styles for the active theme.
- Preference: **system** / **light** / **dark**, stored in AsyncStorage (`@benchy_theme_preference`).
- Controlled from **Profile** → Appearance section.

## Smart rarity (database)

New rows in `benches` get `rarity_id` from trigger **`set_smart_rarity`** → function **`calculate_smart_rarity()`** (`benchy-be/supabase/migrations/database.sql`):

1. No benches yet → **normal**.
2. `rare_count = unique_count` and both `> 0` → **anomalous**.
3. **unique** if unique count meets the threshold vs common or normal (`ceil(1.5 × …)`).
4. **rare** if rare count meets the threshold (`ceil(1.2 × …)`).
5. **common** vs **normal**: higher count wins; on a tie **normal** is chosen.

Rarity can also be changed manually from bench details (subject to UI and RLS).

## Database (outline)

Tables include `benches`, `ratings`, `rarity`, `bench_types`, `locations`, `tags`, achievements, titles, favourites, `user_profiles`. Details and policies are in the SQL migration files.

## Production build

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android
eas build --platform ios
```

Store setup (bundle IDs, map keys, signing) is outside this repo.

## Contributing

Conventional commit prefixes are fine (`feat:`, `fix:`, `docs:`, etc.).

## License

MIT – see [LICENSE](LICENSE).

## Authors

Frontend: React Native / Expo. Backend: Supabase. UI: custom (panels, map-first flow).

Map bench marker icon: [Freepik](https://www.flaticon.com/authors/freepik) via [Flaticon](https://www.flaticon.com/free-icons/bench) — see [benchy-fe/ATTRIBUTIONS.md](benchy-fe/ATTRIBUTIONS.md).
