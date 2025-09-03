# 🗄️ Ławeczka Backend

Backend aplikacji Ławeczka oparty na **Supabase** (PostgreSQL + Auth + Storage + Edge Functions).

## 📁 **Struktura**

```
laweczka-be/
├── README.md                           # Ten plik
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql     # Database schema
│   ├── functions/                      # Edge Functions
│   └── config.toml                     # Local development config
└── docs/                              # API documentation
```

## 🚀 **Quick Setup**

### **1. Utwórz projekt Supabase**
```bash
# Online
1. Idź na https://supabase.com
2. Utwórz nowy projekt  
3. Zapisz URL i ANON KEY
```

### **2. Uruchom migration**
```sql
-- Skopiuj zawartość supabase/migrations/001_initial_schema.sql
-- Wklej w Supabase Dashboard → SQL Editor → New Query
-- Kliknij RUN
```

### **3. Skonfiguruj Auth**
```bash
# W Supabase Dashboard:
Authentication → Settings → 
  ✅ Enable email confirmations: OFF (development)
  ✅ Enable phone confirmations: OFF  
  ✅ Enable sign ups: ON
```

### **4. Dodaj tokeny do frontend**
```json
// laweczka-fe/app.json
{
  "extra": {
    "SUPABASE_URL": "https://twoj-projekt.supabase.co",
    "SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## 🛠️ **Local Development** (Opcjonalne)

```bash
# Install Supabase CLI
npm install supabase -g

# Initialize local Supabase
supabase init

# Start local development
supabase start

# Apply migrations
supabase db reset
```

## 📊 **Database Schema**

### **Tables:**
- `benches` - Ławeczki (lokalizacja, opis, obrazy)
- `ratings` - Oceny i komentarze użytkowników

### **Features:**
- ✅ **Row Level Security (RLS)** - bezpieczeństwo na poziomie wierszy
- ✅ **Auto-update rating** - automatyczna średnia ocena
- ✅ **Indexes** - optymalizacja zapytań
- ✅ **Triggers** - automatyczne aktualizacje

### **Permissions:**
- 👁️ **READ**: Wszyscy (public access)
- ✏️ **WRITE**: Tylko zalogowani użytkownicy
- 🗑️ **DELETE**: Tylko właściciel rekordu

## 🔐 **Security Model**

```sql
-- Users can only modify their own data
auth.uid() = user_id

-- Public read access for discovery
SELECT * FROM benches WHERE true

-- Protected write operations
INSERT INTO benches (...) WHERE auth.uid() = user_id
```

## 🌐 **API Endpoints**

Supabase automatycznie generuje REST API:

```bash
# Get all benches
GET /rest/v1/benches

# Add new bench  
POST /rest/v1/benches

# Get ratings for bench
GET /rest/v1/ratings?bench_id=eq.{id}

# Add rating
POST /rest/v1/ratings
```

## 🚀 **Deployment**

**Backend jest w pełni managed przez Supabase:**
- ✅ Automatic scaling
- ✅ SSL certificates  
- ✅ CDN distribution
- ✅ Real-time subscriptions
- ✅ Edge Functions globally

**Nie wymaga osobnego hostingu!** 🎉
