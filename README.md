# CollégeIQ — College Discovery Platform

A production-grade college discovery platform built with **Next.js 15**, **TypeScript**, **TailwindCSS**, **Zustand**, and **TanStack Query**.

---

## Features

- **Smart Search** — Debounced search with instant results
- **Advanced Filters** — Filter by type, state, fees, rating, courses
- **College Detail Pages** — Overview, Fees, Placements, Reviews tabs
- **Compare Colleges** — Side-by-side comparison of up to 3 colleges
- **Save Colleges** — Persistent bookmarks via localStorage
- **Loading Skeletons** — Professional shimmer loading states
- **Graceful Error Handling** — Fallback UI for all failure states
- **Fully Responsive** — Mobile, tablet, and desktop layouts

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | TailwindCSS v4 |
| State Management | Zustand (with persist) |
| Data Fetching | TanStack Query v5 |
| Forms | React Hook Form + Zod |
| HTTP Client | Axios |
| Icons | Lucide React |

---

## Project Structure

```
college-discovery/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Landing page
│   ├── colleges/           # College listing + detail pages
│   ├── compare/            # Side-by-side comparison
│   └── saved/              # Bookmarked colleges
├── components/
│   ├── ui/                 # Reusable UI: Button, Input, Badge, Card, Skeleton...
│   ├── colleges/           # CollegeCard, FilterSidebar
│   ├── compare/            # CompareBar (floating)
│   └── layout/             # Navbar
├── store/                  # Zustand stores (compare, saved, filters)
├── hooks/                  # TanStack Query hooks
├── services/               # API service layer
├── types/                  # TypeScript interfaces
├── lib/                    # Mock data
└── utils/                  # cn(), formatCurrency(), debounce()...
```

---

## Getting Started

### Prerequisites
- Node.js v18 or higher
- npm or yarn

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/college-iq.git
cd college-iq
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## Key Architecture Decisions

- **Zustand** for lightweight, typesafe global state (compare list, saved colleges, filters)
- **TanStack Query** for server state — caching, deduplication, automatic retries
- **Debounced search** — 300ms delay prevents unnecessary API calls
- **Service layer abstraction** — `services/api.ts` decouples data fetching from UI components
- **Reusable component system** — Button, Input, Badge, Card, Skeleton, EmptyState, ErrorState

---
