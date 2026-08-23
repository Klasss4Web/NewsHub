# News Aggregator

A mobile-first news aggregator built with **React 18**, **TypeScript**, **Vite**, and **React Router**. It pulls articles from multiple trusted news sources, supports search and filtering, personalises feeds, uses infinite scroll, and includes a dedicated article detail page.

> 📋 For the original project plan, see [`PROJECT_PLAN.md`](./PROJECT_PLAN.md).
> ✅ For the completed task tracker, see [`TODOS.md`](./TODOS.md).
> 🤖 For notes on AI agent usage, see [`AGENTS.md`](./AGENTS.md).

## Features

- **Search & Filter:** Search by keyword and filter by date range, category, and source.
- **Personalised Feed:** Select preferred sources, categories, and authors.
- **Author Preference Toggles:** Click the star next to an author on any article card to add or remove them from your preferred authors.
- **Article Detail Page:** Click any news card to read it in a clean reader view at `/article/:id`.
- **Infinite Scroll:** Seamless article loading via `IntersectionObserver`.
- **Mobile-First:** Responsive layout optimised for mobile, tablet, and desktop.
- **Animations & Hover Effects:** Smooth transitions, card lift, button press, page fades, and staggered list entrances.
- **SOLID Architecture:** Adapter and Repository patterns for API abstraction.
- **Minimal Dependencies:** Custom utilities and components; no heavy UI libraries.
- **Mock / Live Toggle:** Switch between sample data and real APIs directly from the UI.
- **Dark Mode:** Toggle between light and dark themes; preference is persisted.
- **Dockerised:** Ready to build and run in a container.

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router DOM 6
- Node.js + Express API proxy
- Native `fetch` with custom timeout wrapper
- React Context API for preferences
- Vitest + React Testing Library for tests
- Docker (multi-stage build; Express serves the built client)

## Data Sources

The app integrates at least three news sources as required. All external API calls are proxied through the Express server so the API keys never reach the browser:

1. [NewsAPI.org](https://newsapi.org)
2. [The Guardian Open Platform](https://open-platform.theguardian.com)
3. [The New York Times Article Search API](https://developer.nytimes.com)

If API keys are missing, the app falls back to deterministic mock data so it remains usable.

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+ (or equivalent)
- Docker (optional, for containerised deployment)

### Installation

```bash
cd C:\Dev\personal\news-aggregator
npm install
```

### Environment Variables

Copy the example environment files and add your API keys:

```bash
cp .env.example .env
cp server/.env.example server/.env
```

Client environment variables (`.env`):

```env
VITE_API_BASE_URL=/api

# Optional: use mock data without API keys
VITE_USE_MOCK_DATA=false
```

Server environment variables (`server/.env`):

```env
PORT=3001
LOG_LEVEL=info
NEWSAPI_KEY=your_newsapi_key
GUARDIAN_KEY=your_guardian_key
NYTIMES_KEY=your_nytimes_key
```

All API keys are kept on the server only and are never bundled into the React client.

### Running Locally

Start the Express API server and the Vite dev server together:

```bash
npm run dev:all
```

The React app will be available at `http://localhost:3000` and the API proxy at `http://localhost:3001`.

You can also start each server separately:

```bash
npm run dev:server
npm run dev        # in another terminal
```

### Running Tests

```bash
npm test
```

This runs all client and server tests from the project root. To run only the server tests:

```bash
cd server && npm test
```

To run tests in watch mode:

```bash
npm run test:watch
```

### Building for Production

```bash
npm run build        # Build the React client
npm run build:server # Build the Express server
```

The static bundle will be output to the `dist/` directory and the compiled server to `server/dist/`.

### Docker

Make sure `server/.env` contains your API keys:

```env
PORT=3001
NEWSAPI_KEY=your_newsapi_key
GUARDIAN_KEY=your_guardian_key
NYTIMES_KEY=your_nytimes_key
```

Build and run the containerised application:

```bash
docker-compose up --build
```

Access the app at `http://localhost:3000`.

The container runs the Express server, which serves the built React app and proxies `/api/news`, `/api/news/everything`, `/api/guardian`, and `/api/nytimes` to the upstream news APIs using the keys from `server/.env`. A `/health` endpoint is also available. No API keys are exposed to the browser.

To stop:

```bash
docker-compose down
```

## Project Structure

```
src/
├── api/
│   ├── adapters/       # Normalise external API responses
│   ├── clients/        # Per-source HTTP clients
│   └── repositories/   # Aggregate and deduplicate articles
├── components/
│   ├── common/         # Reusable UI primitives
│   ├── features/       # Article cards, search, filters
│   └── layout/         # Header, mobile menu, page shell
├── hooks/              # useArticles, useInfiniteScroll, useDebounce, etc.
├── stores/             # Context-based preference store
├── types/              # Shared TypeScript interfaces
├── utils/              # Custom fetch, date, and string utilities
├── constants/          # News sources and categories
├── pages/              # Home, Article Detail, and Preferences views
├── services/           # API config and mock data
└── __tests__/          # Unit and component tests

server/
├── src/
│   ├── config/         # Environment variable loading
│   ├── routes/         # Express routes
│   ├── services/       # External API calls
│   ├── types/          # Server-side types
│   └── utils/          # Logger and HTTP error helpers
├── dist/               # Compiled server output
├── .env                # Server-side secrets
└── .env.example        # Example server environment variables
```

## Architecture Highlights

- **Adapter Pattern:** Each news source has its own adapter that converts the API-specific response into a common `Article` model.
- **Repository Pattern:** `NewsRepository` fetches from all adapters in parallel, aggregates results, deduplicates by URL, sorts by date, and gracefully handles partial failures.
- **Server-Side API Proxy:** A Node.js/Express server in `server/` owns all news API keys and exposes `/api/news`, `/api/news/everything`, `/api/guardian`, and `/api/nytimes`. The React app calls these local endpoints, keeping keys out of the client bundle.
- **Category Filtering:** Guardian and NYTimes support category filtering at the API level, but NewsAPI's `/v2/everything` endpoint does not. The app therefore filters by category in the repository to keep results consistent across all sources. This means pages may contain fewer cards than the requested page size when many returned articles do not match the selected category.
- **Custom Fetch Wrapper:** A timeout-aware `fetch` wrapper adapted from an internal reference project (`C:\Dev\open-retail\drivers-web-app\src\configs\fetch.js`).
- **Custom State Management:** Preferences are managed via React Context API and persisted to `localStorage`.
- **Routing:** React Router DOM handles navigation between Home, Article Detail, and Preferences pages.
- **Performance:** Images are lazy-loaded and search input is debounced.

## Assumptions Made

- **My Feed Page:** The assumption is that only selected user preferences are represented on the My Feed page. Articles are fetched only from preferred sources and filtered by preferred categories and authors.
- **Author Parameters:** Author preference parameters are not currently passed to any endpoints (from the client to the server or to third-party APIs). None of the selected upstream APIs — NewsAPI, The Guardian Open Platform, or The New York Times Article Search API — support filtering by author at the API level. Author matching is therefore applied client-side after articles are fetched.
- **NewsAPI Endpoint Choice:** The NewsAPI `/v2/everything` endpoint accepts a date range but does not accept category filtering, while the `/v2/top-headlines` endpoint accepts category but does not accept a date range. The All News page uses `/top-headlines` so users can filter by category, and the My Feed page uses `/everything` so personalised date-range preferences can be applied at the API level.
- **Rate Limiting:** NewsAPI and The New York Times enforce strict rate limits on their free-tier plans. Rate-limit responses are logged in the server terminal but are intentionally not surfaced to the frontend, so users may see fewer articles than expected without an explicit error message in the UI.

## Available Scripts

| Script                | Description                                          |
| --------------------- | ---------------------------------------------------- |
| `npm run dev`         | Start the Vite development server                    |
| `npm run dev:server`  | Start the Express API development server             |
| `npm run dev:all`     | Start both the Vite and Express dev servers          |
| `npm run build`       | Build the production client bundle                   |
| `npm run build:server`| Build the Express server                             |
| `npm run preview`     | Preview the production build locally                 |
| `npm test`            | Run all tests once (client + server)                 |
| `npm run test:watch`  | Run tests in watch mode                              |
| `npm run lint`        | Run ESLint                                           |

## License

This project was created as a take-home coding challenge and is not licensed for production use.
