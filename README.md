# C0RVEX Command Center

High-performance administrative PWA for the GWS ecosystem. Built with Next.js 14+, TypeScript, Tailwind CSS, and Supabase.

## 🎨 Design System - "Stealth Tech"

### Color Palette
- **Background:** #0D0D0D (Deep Charcoal)
- **Surface:** #1A1A1A (Cards/Sidebars)
- **Primary:** #A0E9FF (Icy Blue - Neon)
- **Text Main:** #FFFFFF (White)
- **Text Muted:** #888888 (Metallic Gray)
- **Border:** #333333

### Features
- ✨ Glassmorphism effects
- 🌙 Native dark mode
- 📱 Progressive Web App (PWA)
- ⚡ Server Components & Server Actions
- 🔐 Row Level Security (RLS)

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ (you have v24.13.0 ✅)
- npm 11+ (you have v11.6.2 ✅)
- Supabase account

### Installation

1. **Install dependencies:**
```bash
cd C:\Users\leona\.gemini\antigravity\scratch\corvex-command-center
npm install
```

2. **Configure Supabase:**
   - Create a new project at [supabase.com](https://supabase.com)
   - Copy `.env.local.example` to `.env.local`
   - Add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

3. **Setup Database:**
   - Go to Supabase SQL Editor
   - Run the SQL script from `supabase/schema.sql`
   - This will create tables, ENUMs, indexes, RLS policies, and seed data

4. **Run Development Server:**
```bash
npm run dev
```

5. **Open Browser:**
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - Install as PWA (desktop icon in browser address bar)

## 📁 Project Structure

```
corvex-command-center/
├── app/
│   ├── layout.tsx          # Root layout with Sidebar
│   ├── page.tsx           # Dashboard (KPIs)
│   ├── globals.css        # Tailwind + custom styles
│   └── actions/           # Server Actions (coming soon)
├── components/
│   ├── Sidebar.tsx        # Navigation with glassmorphism
│   └── ui/
│       ├── Button.tsx     # Reusable button component
│       └── Card.tsx       # Card component
├── lib/
│   ├── supabase.ts        # Supabase client config
│   └── utils.ts           # Utility functions (cn, etc.)
├── types/
│   └── database.types.ts  # TypeScript types from DB
├── supabase/
│   └── schema.sql         # Database schema
└── public/
    ├── manifest.json      # PWA manifest
    └── icons/             # App icons
```

## 🗄️ Database Schema

### Tables
1. **clients** - Client management (name, slug, status, tier, billing)
2. **services** - Services per client (type, config, active)
3. **partners** - Partners per client (name, category, contact info)

### ENUMs
- `client_status`: 'active' | 'paused'
- `billing_type`: 'unique' | 'recurring'
- `client_tier`: 'gold' | 'platinum'
- `service_type`: 'ID' | 'Menu' | 'Partners' | 'Page'

## 🛠️ Tech Stack
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Icons:** Lucide React
- **State:** React Server Components + Server Actions

## 📝 Next Steps (Coming Soon)
- [ ] Client Manager with Data Table
- [ ] Client Status Toggle (Server Action + Optimistic UI)
- [ ] Partner Management CRUD
- [ ] Settings Page
- [ ] Authentication

## 📄 License
Private - C0RVEX Internal Use Only
