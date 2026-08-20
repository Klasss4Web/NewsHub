# Frontend Take-Home Challenge — Project Plan

> This document outlines the architecture and roadmap for the News Aggregator project.
> For build instructions, see [`README.md`](./README.md).
> For the task tracker, see [`TODOS.md`](./TODOS.md).
> For notes on how AI agents were used, see [`AGENTS.md`](./AGENTS.md).

## 1. Overview

Build a **mobile-first news aggregator web application** using **React.js + TypeScript + React Router**. The app pulls articles from multiple news sources, displays them in a clean readable format, supports search/filtering, lets users personalise their feed, uses infinite scroll, and provides a dedicated article detail page. The project is containerised with Docker and follows DRY, KISS, and SOLID principles.

## 2. Chosen Data Sources (3)

| # | Source | API |
|---|--------|-----|
| 1 | **NewsAPI.org** | `https://newsapi.org/v2/everything` |
| 2 | **The Guardian Open Platform** | `https://content.guardianapis.com/search` |
| 3 | **The New York Times** | `https://api.nytimes.com/svc/search/v2/articlesearch.json` |

## 3. Tech Stack

| Layer | Tool | Reason |
|-------|------|--------|
| Build Tool | **Vite** | Fast HMR and TypeScript support |
| Framework | **React 18** + **TypeScript** | Required by challenge |
| Styling | **Tailwind CSS** | Utility-first, mobile-first responsive design |
| HTTP | **Native `fetch`** via custom wrapper | Pattern adapted from internal reference project |
| Routing | **React Router DOM 6** | Declarative SPA navigation |
| State | **Context API + `useReducer`-style hooks** | Minimal third-party dependencies |
| Tests | **Vitest** + **React Testing Library** | Fast, modern testing stack |
| Container | **Docker** + **nginx** | Production-ready static serving |

## 4. Architecture & SOLID Mapping

### 4.1 Adapter Pattern
Each external API is mapped to a common `Article` model via an adapter implementing `IArticleAdapter`.

```
IArticleAdapter
├── NewsApiAdapter
├── GuardianAdapter
└── NyTimesAdapter
```

- **S:** Each adapter maps exactly one API.
- **O:** New sources are added as new adapters without changing existing code.
- **L:** All adapters are interchangeable via the shared interface.
- **I:** The adapter interface is small and focused.
- **D:** The repository depends on the `IArticleAdapter` abstraction.

### 4.2 Repository Pattern
`NewsRepository` orchestrates parallel fetches, aggregates results, deduplicates by URL, sorts by date, and gracefully handles partial failures using `Promise.allSettled`.

### 4.3 Custom Hooks
- `useArticles` — fetches and paginates aggregated articles
- `useInfiniteScroll` — triggers pagination via `IntersectionObserver`
- `useDebounce` — debounces search input
- `useLocalStorage` — persists preferences

### 4.4 Routing
React Router DOM provides client-side routes for:
- `/` — Home feed
- `/article/:id` — Article detail page
- `/preferences` — User preferences
- `*` — Redirect to Home

### 4.4 State Management
- Server/cache state is kept local to the `useArticles` hook.
- User preferences use React Context API + `useLocalStorage`.

## 5. Project Structure

```
src/
├── api/
│   ├── adapters/          # API-specific normalisation
│   ├── clients/           # HTTP clients per source
│   └── repositories/      # Aggregation logic
├── components/
│   ├── common/            # Reusable UI primitives
│   ├── features/          # Domain-specific components
│   └── layout/            # Header, menu, layout shell
├── hooks/                 # Custom React hooks
├── stores/                # Context-based preference store
├── types/                 # Shared TypeScript types
├── utils/                 # Custom utilities (fetch, dates, strings)
├── constants/             # Sources and categories
├── pages/                 # Top-level views
├── services/              # Config and mock data services
└── __tests__/             # Unit and component tests
```

## 6. Core Features

- Search by keyword (debounced)
- Filter by date range, category, source
- Personalised feed based on sources/categories/authors
- Infinite scroll via IntersectionObserver
- Mobile-first responsive design
- Dedicated article detail page with reader-friendly layout
- Animations and hover effects across cards, buttons, and transitions
- Runtime mock/live data toggle persisted in localStorage
- Light/dark theme toggle persisted in localStorage
- Reveal-on-scroll and slide-up-on-render animations
- Loading skeletons, error states, empty states
- Mock-data fallback for development without API keys

## 7. Docker Strategy

- Multi-stage `Dockerfile` builds the Vite app and serves it with nginx.
- `docker-compose.yml` exposes the app on port `3000`.
- Static assets are cached; security headers are added by nginx.

## 8. Open Decisions (Resolved)

- **Pagination vs. infinite scroll?** Infinite scroll.
- **Include tests?** Yes — adapters, hooks, repository, and components.
- **API keys required?** No — mock data fallback is included.
