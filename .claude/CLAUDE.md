# CLAUDE.md — Sesli Kitap Dinleme ve Abonelik Sistemi

> Bu dosya her Claude Code oturumunda otomatik yüklenir.
> Her kural **zorunludur** — genel tavsiye değildir.

---

## 1. PROJE BRİEFİ

### 1.1 Ürün Kimliği

| Alan | Değer |
|---|---|
| Ürün Adı | **Sesli** — Sesli Kitap Dinleme ve Abonelik Platformu |
| Versiyon | 1.0.0 |
| Öğrenci | Çağrı Tekin · 233311060 |
| Ders | Veritabanı Yönetim Sistemleri — Selçuk Üniversitesi |
| Hedef Platform | Web (React) → Electron (Desktop) → React Native (Mobile) |
| Backend | MS SQL Server + Express.js REST API |

### 1.2 Problem & Çözüm

**Problem:** Türkçe sesli kitap piyasasında mobil-first, abonelik bazlı, kullanıcı dostu bir platform bulunmuyor. Mevcut çözümler ya çok pahalı ya da kötü UX sunuyor.

**Çözüm:** Spotify/Audible benzeri deneyimi Türkçe içerikle buluşturan, 3 platform üzerinde çalışan (web + masaüstü + mobil), veritabanı destekli tam kapsamlı bir sesli kitap platformu.

### 1.3 Hedef Kullanıcı

- **Birincil:** 18–35 yaş, mobil kullanıcı, günlük commute yapan, kitap okumaya zaman bulamayan
- **İkincil:** Öğrenciler, görme engelliler, uzun yol sürücüleri

### 1.4 Temel Özellikler (MVP Scope)

1. Kullanıcı kayıt/giriş (JWT tabanlı)
2. Sesli kitap kataloğu (listeleme, arama, filtreleme)
3. Sesli oynatıcı (play/pause, ileri/geri sarma, hız kontrolü, kaldığı yer kaydetme)
4. Abonelik planları (Temel / Standart / Premium)
5. Ödeme simülasyonu
6. Dinleme geçmişi ve profil sayfası
7. Kitap değerlendirme ve puanlama

### 1.5 Platform Stratejisi

```
React Web App (Vite)
    ↓
Electron Wrapper → Windows / macOS / Linux .exe / .dmg / .AppImage
    ↓
React Native (Expo) → iOS .ipa / Android .apk
```

Tek codebase mantığı: business logic hook'ları shared, UI platform'a göre ayrı.

---

## 2. ÜRÜN GEREKSİNİMLERİ (PRD)

### 2.1 Fonksiyonel Gereksinimler

#### FR-01: Kimlik Yönetimi
- Kullanıcı e-posta + şifre ile kayıt olabilir
- JWT access token (15 dk) + refresh token (7 gün) kullanılır
- Şifreler bcrypt ile hash'lenir (salt rounds: 12)
- "Beni hatırla" seçeneği localStorage'da refresh token saklar
- Profil fotoğrafı yüklenebilir (max 2MB, jpg/png/webp)

#### FR-02: Kitap Kataloğu
- Kategoriye göre filtreleme (Roman, Kişisel Gelişim, Tarih, Bilim, Çocuk, Felsefe, Ekonomi, Psikoloji, Fantastik, Sağlık)
- Yazara göre filtreleme
- Arama: başlık, yazar adı, ISBN üzerinden
- Sıralama: en yeni, en çok dinlenen, en yüksek puanlı, fiyat
- Sayfalama: cursor-based (offset değil)
- Kitap detay sayfası: kapak, özet, yazar bio, örnek dinleme (ilk 5 dk ücretsiz)

#### FR-03: Oynatıcı
- Play / Pause
- 15 saniye geri / 30 saniye ileri sarma
- Hız: 0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x
- Progress bar: tıklanabilir scrubber
- Kaldığı yer otomatik kaydedilir (her 10 saniyede bir DB'ye)
- Uyku zamanlayıcısı: 5, 10, 15, 30, 45, 60 dk veya bölüm sonu
- Mini player (sticky bottom) + Full screen player

#### FR-04: Abonelik
- 3 plan: Temel (₺29.90/ay, 2 kitap), Standart (₺59.90/ay, 10 kitap), Premium (₺99.90/ay, sınırsız + indirme)
- Yıllık ödeme: %20 indirim
- Plan değiştirme: anında geçiş, fark ücret hesaplama
- İptal: bitiş tarihine kadar aktif kalır
- Ödeme simülasyonu (gerçek ödeme gateway yok — akademik proje)

#### FR-05: Profil & Geçmiş
- Dinleme istatistikleri: toplam süre, tamamlanan kitap sayısı, en çok dinlenen kategori
- Dinleme geçmişi listesi (tarih, kitap, ilerleme yüzdesi)
- Favoriler listesi
- Kişisel değerlendirmeler

### 2.2 Non-Fonksiyonel Gereksinimler

| Gereksinim | Hedef |
|---|---|
| İlk yükleme (FCP) | < 1.5 saniye |
| API yanıt süresi | < 200ms (p95) |
| Bundle boyutu | < 500KB gzip |
| Lighthouse Performans | > 90 |
| Lighthouse Erişilebilirlik | > 85 |
| Responsive Breakpoint | 320px — 1440px arası kesintisiz |
| Çevrimdışı Destek | Service Worker ile son dinlenen 3 kitap |

### 2.3 Kapsam Dışı (Out of Scope)

- Gerçek ses dosyası streaming (UI simülasyon yeterli)
- Gerçek ödeme entegrasyonu
- Push notification
- Sosyal özellikler (arkadaş ekleme, paylaşım)
- Admin paneli (raporlama ayrı scope)

---

## 3. TEKNİK STACK

### 3.1 Frontend

```
Framework   : React 18 (Vite 5)
Dil         : TypeScript 5.x (strict mode AÇIK)
Routing     : React Router v6
State       : Zustand (global) + React Query v5 (server state)
Form        : React Hook Form + Zod validation
İkon        : lucide-react (SADECE bu — başka ikon kütüphanesi yok)
HTTP        : axios (interceptor'lı)
Tarih       : date-fns (dayjs veya moment YASAK)
Test        : Vitest + React Testing Library
```

### 3.2 Backend

```
Runtime     : Node.js 20 LTS
Framework   : Express.js 4.x
Dil         : TypeScript
DB          : MS SQL Server (mssql paketi)
Auth        : jsonwebtoken + bcrypt
Validation  : zod
Linting     : ESLint + Prettier
```

### 3.3 Desktop (Electron)

```
Electron    : v30+
Builder     : electron-builder
IPC         : contextBridge + ipcRenderer (preload script zorunlu)
Auto-update : electron-updater
```

### 3.4 Mobile (React Native)

```
Framework   : Expo SDK 51+
Navigation  : Expo Router (file-based)
Audio       : expo-av
Storage     : expo-secure-store (token) + AsyncStorage (tercihler)
```

---

## 4. TASARIM SİSTEMİ (ZORUNLU — HİÇBİR İSTİSNA YOK)

### 4.1 Temel Prensipler

```
Gölge      : YASAK — box-shadow kullanma, hiçbir yerde
Border     : YASAK — border kullanma (input focus ring hariç, o da outline ile)
Stil       : Soft Flat Design — yüzeyler renk ve boşlukla ayrışır, çizgi ile değil
```

### 4.2 Tipografi — Plus Jakarta Sans

```css
/* Google Fonts import — index.html veya global.css'e ekle */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap');

font-family: 'Plus Jakarta Sans', sans-serif; /* TÜM elementlerde */

/* Type Scale */
--text-xs   : 11px / line-height: 1.5  / weight: 400
--text-sm   : 13px / line-height: 1.55 / weight: 400
--text-base : 15px / line-height: 1.6  / weight: 400
--text-lg   : 17px / line-height: 1.5  / weight: 500
--text-xl   : 20px / line-height: 1.4  / weight: 600
--text-2xl  : 24px / line-height: 1.3  / weight: 700
--text-3xl  : 30px / line-height: 1.2  / weight: 700
--text-4xl  : 36px / line-height: 1.15 / weight: 800

/* Weight Kuralları */
400 → body text, descriptions, metadata
500 → labels, nav items, secondary headings  
600 → card titles, button text, section headings
700 → page titles, hero headings
800 → display headings, marketing copy — sadece büyük başlıklarda
```

### 4.3 Renk Paleti — Teal Temelli

```css
:root {
  /* === TEAL PRIMARY === */
  --teal-50  : #f0fdfa;
  --teal-100 : #ccfbf1;
  --teal-200 : #99f6e4;
  --teal-300 : #5eead4;
  --teal-400 : #2dd4bf;
  --teal-500 : #14b8a6;   /* Ana brand rengi */
  --teal-600 : #0d9488;   /* Hover state */
  --teal-700 : #0f766e;   /* Active / pressed */
  --teal-800 : #115e59;
  --teal-900 : #134e4a;

  /* === NEUTRAL (Dark Mode Base) === */
  --neutral-50  : #fafafa;
  --neutral-100 : #f5f5f5;
  --neutral-200 : #e5e5e5;
  --neutral-300 : #d4d4d4;
  --neutral-400 : #a3a3a3;
  --neutral-500 : #737373;
  --neutral-600 : #525252;
  --neutral-700 : #404040;
  --neutral-800 : #262626;
  --neutral-900 : #171717;
  --neutral-950 : #0a0a0a;

  /* === SEMANTIC === */
  --color-success : #10b981;
  --color-warning : #f59e0b;
  --color-error   : #ef4444;
  --color-info    : #3b82f6;

  /* === DARK MODE SURFACE HIERARCHY === */
  --surface-base    : #0a0f0e;   /* En koyu — sayfa arka planı */
  --surface-raised  : #111918;   /* Kartlar, panel arka planları */
  --surface-overlay : #1a2421;   /* Hover state'ler, dropdown'lar */
  --surface-sunken  : #0d1513;   /* Input arka planları */

  /* === METİN === */
  --text-primary   : #f0fdfb;    /* Ana içerik */
  --text-secondary : #94a3ab;    /* Yardımcı metin, metadata */
  --text-tertiary  : #4a6268;    /* Placeholder, devre dışı */
  --text-inverse   : #0a0f0e;    /* Teal buton üzeri metin */

  /* === BORDER-LESS YÜZEYLERİN AYIRIMI (border değil, bg farkı) === */
  /* Kartları ayırmak için border kullanma — sadece farklı surface rengi kullan */
}
```

### 4.4 Boşluk Sistemi (Spacing)

```
4px  → icon gap, tight inline spacing
8px  → chip padding, small component gap
12px → card internal gap, form field gap
16px → section padding, standard gap
20px → card padding
24px → section gap, page horizontal padding
32px → between major sections
48px → page section spacing (mobile)
64px → page section spacing (desktop)
```

### 4.5 Border Radius

```
4px  → tag, badge, chip
8px  → input, small button
12px → button, card içi element
16px → card
20px → modal, bottom sheet, büyük kart
full → avatar, toggle, icon button
```

### 4.6 İkon Kullanımı — lucide-react

```tsx
// DOĞRU kullanım
import { Play, Pause, BookOpen, Star, Search } from 'lucide-react'

<Play size={20} strokeWidth={1.75} className="text-teal-500" />

// Boyut Kuralları
16px → inline metin içinde, metadata
20px → buton içinde, kart aksiyonları
24px → nav item, section başlığı
28px → feature icon (büyük)
32px → hero/empty state

// strokeWidth SADECE 1.5 veya 1.75 kullan — 2 çok kalın

// YASAK
import { PlayFill } from 'react-icons/bs'    // başka ikon kütüphanesi yok
<img src="play-icon.svg" />                   // custom SVG icon yok
<span>▶</span>                               // unicode icon yok
```

### 4.7 Komponent Örnekleri

```tsx
// PRIMARY BUTTON
<button className="
  bg-teal-500 hover:bg-teal-600 active:bg-teal-700
  text-white font-semibold text-sm
  px-5 py-2.5 rounded-xl
  transition-colors duration-150
  disabled:opacity-40 disabled:cursor-not-allowed
">
  Başla
</button>

// SECONDARY BUTTON
<button className="
  bg-surface-overlay hover:bg-teal-500/10
  text-teal-400 hover:text-teal-300 font-semibold text-sm
  px-5 py-2.5 rounded-xl
  transition-colors duration-150
">
  Daha Fazla
</button>

// CARD (border yok, shadow yok — sadece bg farkı)
<div className="bg-surface-raised rounded-2xl p-5 hover:bg-surface-overlay transition-colors">
  {/* içerik */}
</div>

// INPUT (border yok — sadece bg + focus ring outline)
<input className="
  w-full bg-surface-sunken
  text-text-primary placeholder:text-text-tertiary
  px-4 py-3 rounded-xl text-sm
  outline-none focus:ring-2 focus:ring-teal-500/50
  transition-all duration-150
" />

// CHIP / TAG
<span className="
  inline-flex items-center gap-1
  bg-teal-500/10 text-teal-400
  text-xs font-medium
  px-3 py-1 rounded-full
">
  Roman
</span>
```

---

## 5. PROJE YAPISI

```
sesli-kitap/
├── CLAUDE.md                    ← bu dosya
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── index.html
│
├── src/
│   ├── main.tsx                 ← React entry point
│   ├── App.tsx                  ← Router + layout wrapper
│   ├── index.css                ← Tailwind base + CSS variables
│   │
│   ├── pages/                   ← Sayfa bileşenleri (route başına bir dosya)
│   │   ├── HomePage.tsx
│   │   ├── CatalogPage.tsx
│   │   ├── BookDetailPage.tsx
│   │   ├── PlansPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── HistoryPage.tsx
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   │
│   ├── components/              ← Tekrar kullanılabilir UI bileşenleri
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── BottomNav.tsx
│   │   │   └── PageWrapper.tsx
│   │   ├── player/
│   │   │   ├── MiniPlayer.tsx
│   │   │   └── FullPlayer.tsx
│   │   ├── book/
│   │   │   ├── BookCard.tsx     ← küçük kart (grid görünümü)
│   │   │   ├── BookRow.tsx      ← geniş kart (liste görünümü)
│   │   │   └── BookCarousel.tsx ← yatay scroll row
│   │   ├── ui/                  ← atom bileşenler
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Chip.tsx
│   │   │   ├── Avatar.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── StarRating.tsx
│   │   │   └── EmptyState.tsx
│   │   └── subscription/
│   │       └── PlanCard.tsx
│   │
│   ├── hooks/                   ← Custom React hook'ları
│   │   ├── useAuth.ts
│   │   ├── usePlayer.ts
│   │   ├── useBooks.ts
│   │   └── useSubscription.ts
│   │
│   ├── store/                   ← Zustand store'ları
│   │   ├── authStore.ts
│   │   ├── playerStore.ts
│   │   └── uiStore.ts
│   │
│   ├── api/                     ← API katmanı
│   │   ├── client.ts            ← axios instance + interceptors
│   │   ├── auth.api.ts
│   │   ├── books.api.ts
│   │   ├── subscriptions.api.ts
│   │   └── profile.api.ts
│   │
│   ├── types/                   ← TypeScript tip tanımları
│   │   ├── book.types.ts
│   │   ├── user.types.ts
│   │   ├── subscription.types.ts
│   │   └── api.types.ts
│   │
│   └── utils/                   ← Yardımcı fonksiyonlar
│       ├── formatters.ts        ← süre formatlama, para formatlama
│       ├── validators.ts
│       └── constants.ts
│
├── backend/                     ← Express API
│   ├── src/
│   │   ├── server.ts
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── db/
│   │   └── types/
│   └── package.json
│
└── docs/
    ├── @database-schema.md      ← SQL şema (referans için @docs/database-schema.md)
    ├── @api-endpoints.md        ← API dökümantasyonu
    └── @design-tokens.md        ← Tasarım token referansı
```

---

## 6. KOD KURALLARI (ZORUNLU)

### 6.1 TypeScript

```typescript
// strict: true — tsconfig'de kapalı olamaz
// any YASAK — unknown kullan, sonra type guard ekle
// Tip assertion (as Type) sadece gerekli yerlerde, açıklama ekle

// DOĞRU
const user = data as User // API response shape garantili, zod ile validate edildi

// YANLIŞ  
const x = something as any
```

### 6.2 Bileşen Yazımı

```tsx
// Functional component, named export
// Props interface component dosyasında tanımlanır

interface BookCardProps {
  book: Book
  onPlay: (bookId: number) => void
  showProgress?: boolean   // optional prop'lar ? ile
}

export function BookCard({ book, onPlay, showProgress = false }: BookCardProps) {
  // ...
}

// DEFAULT EXPORT YASAK — tree-shaking için named export
export default BookCard  // ❌ YAPMA
export { BookCard }      // ✅ veya yukarıdaki gibi
```

### 6.3 Styling

```
Tailwind CSS kullan — inline style YASAK
CSS module YASAK — Tailwind yeterli
styled-components YASAK

className string'i çok uzasa → clsx veya cn() helper kullan:
import { cn } from '@/utils/cn'

<div className={cn(
  "bg-surface-raised rounded-2xl p-5",
  isActive && "bg-teal-500/10",
  className
)} />
```

### 6.4 State Yönetimi

```
Server state (API data)   → React Query (useQuery, useMutation)
Global client state       → Zustand
Local component state     → useState / useReducer
Form state                → React Hook Form

Context API YASAK (performans) — Zustand kullan
Redux YASAK — proje kapsamı için fazla
```

### 6.5 API Çağrıları

```typescript
// Tüm API çağrıları api/ klasöründe
// Component içinde doğrudan fetch/axios YASAK

// api/books.api.ts
export const booksApi = {
  getAll: (params: BookListParams) =>
    apiClient.get<PaginatedResponse<Book>>('/books', { params }),

  getById: (id: number) =>
    apiClient.get<Book>(`/books/${id}`),
}

// Component'te
const { data, isLoading, error } = useQuery({
  queryKey: ['books', params],
  queryFn: () => booksApi.getAll(params),
})
```

### 6.6 Hata Yönetimi

```tsx
// API hataları ErrorBoundary ile yakalanır
// Form hataları Zod + React Hook Form ile
// Loading state'ler skeleton ile (spinner değil)

// Skeleton pattern
if (isLoading) return <BookCardSkeleton />
if (error) return <ErrorState message={error.message} onRetry={refetch} />
```

### 6.7 Dosya İsimlendirme

```
Component dosyaları  : PascalCase.tsx     → BookCard.tsx
Hook dosyaları       : camelCase.ts       → useBooks.ts
Utility dosyaları    : camelCase.ts       → formatters.ts
Type dosyaları       : camelCase.types.ts → book.types.ts
API dosyaları        : camelCase.api.ts   → books.api.ts
Test dosyaları       : *.test.tsx         → BookCard.test.tsx
```

---

## 7. KOMUTLAR

```bash
# Geliştirme
pnpm dev              # Vite dev server (http://localhost:5173)
pnpm dev:backend      # Express server (http://localhost:3001)

# Build
pnpm build            # Production web build → dist/
pnpm build:electron   # Electron paketi → release/
pnpm preview          # Build önizleme

# Test
pnpm test             # Vitest watch mode
pnpm test:run         # Tek seferlik test
pnpm test:coverage    # Coverage raporu

# Lint & Format
pnpm lint             # ESLint
pnpm lint:fix         # ESLint autofix
pnpm format           # Prettier

# Type check
pnpm typecheck        # tsc --noEmit
```

**Paket yöneticisi: pnpm** — npm veya yarn kullanma.

---

## 8. VERİTABANI REFERANSI

Detaylı şema için: `@docs/database-schema.md`

**Tablolar:** Kullanici · Yazar · Kategori · Kitap · AbonelikPlani · Abonelik · Odeme · DinlemeGecmisi · Degerlendirme

**Zorunlu kural:** Her tablodaki `kullaniciID` sütunu `Kullanici` tablosuna FK. Cascade delete stratejisi tablo bazında farklı — schema doc'a bak.

---

## 9. RESPONSIVE TASARIM

```
Mobile-first — her zaman küçükten büyüğe
xs  : 0px+    (varsayılan — tüm stiller buraya)
sm  : 640px+
md  : 768px+
lg  : 1024px+
xl  : 1280px+

Breakpoint kullanımı:
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

Min dokunma hedefi: 44×44px (buton ve tıklanabilir elementler)
Bottom nav: mobile only (md: hidden)
Sidebar: md+ üzeri görünür
```

---

## 10. ERİŞİLEBİLİRLİK

```
- Tüm img elementleri alt text alır
- Icon-only butonlar aria-label alır: <button aria-label="Oynat">
- Form input'ları label ile ilişkilendirilir (htmlFor)
- Renk kontrastı WCAG AA standardını sağlar (teal-400 on surface-raised ✓)
- Keyboard navigation: Tab, Enter, Space, Arrow keys çalışır
- Focus visible: outline-none + focus:ring-2 pattern — görünür focus ring
```

---

## 11. ELECTRON KURULUMU

```javascript
// main/main.ts — temel pencere config
mainWindow = new BrowserWindow({
  width: 1200,
  height: 800,
  minWidth: 900,
  minHeight: 600,
  titleBarStyle: 'hiddenInset',   // macOS native feel
  webPreferences: {
    nodeIntegration: false,        // KAPALI — güvenlik
    contextIsolation: true,        // AÇIK — güvenlik
    preload: path.join(__dirname, 'preload.js'),
  },
})

// Geliştirmede localhost, production'da dist/index.html
if (isDev) {
  mainWindow.loadURL('http://localhost:5173')
} else {
  mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
}
```

---

## 12. SÜRÜM KONTROLÜ

```
Branch: feature/*, fix/*, chore/*
Commit format: feat: add book detail page
               fix: player progress not saving
               chore: update dependencies
               docs: add API endpoint docs

Her commit öncesi: pnpm typecheck && pnpm lint
```

---

## 13. YASAK LİSTESİ (ÖZET)

```
❌ box-shadow (hiçbir yerde)
❌ border (outline/ring hariç)
❌ any TypeScript tipi
❌ lucide-react dışında ikon kütüphanesi
❌ Plus Jakarta Sans dışında font ailesi
❌ default export (component'lerde)
❌ inline style (className kullan)
❌ npm veya yarn (pnpm kullan)
❌ Redux, MobX, Context API (Zustand kullan)
❌ moment.js, dayjs (date-fns kullan)
❌ Component içinde doğrudan fetch/axios (api/ klasörünü kullan)
❌ console.log production kodda (logger servisi kullan)
```

---

*Son güncelleme: Mayıs 2026 · Çağrı Tekin · 233311060*