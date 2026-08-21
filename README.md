# News Aggregator

A mobile-first news aggregator built with **React 18**, **TypeScript**, **Vite**, and **React Router**. It pulls articles from multiple trusted news sources, supports search and filtering, personalises feeds, uses infinite scroll, and includes a dedicated article detail page.

> 📋 For the original project plan, see [`PROJECT_PLAN.md`](./PROJECT_PLAN.md).
> ✅ For the completed task tracker, see [`TODOS.md`](./TODOS.md).
> 🤖 For notes on AI agent usage, see [`AGENTS.md`](./AGENTS.md).

## Features

- **Search & Filter:** Search by keyword and filter by date range, category, and source.
- **Personalised Feed:** Select preferred sources, categories, and authors.
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
- Native `fetch` with custom timeout wrapper
- React Context API for preferences
- Vitest + React Testing Library for tests
- Docker + nginx

## Data Sources

The app integrates at least three news sources as required:

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

Copy the example environment file and add your API keys:

```bash
cp .env.example .env
```

```env
VITE_NEWSAPI_KEY=your_newsapi_key
VITE_GUARDIAN_KEY=your_guardian_key
VITE_NYTIMES_KEY=your_nytimes_key

# Optional: use mock data without API keys
VITE_USE_MOCK_DATA=false
```

### Running Locally

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Running Tests

```bash
npm test
```

To run tests in watch mode:

```bash
npm run test:watch
```

### Building for Production

```bash
npm run build
```

The static bundle will be output to the `dist/` directory.

### Docker

Build and run the containerised application:

```bash
docker-compose up --build
```

Access the app at `http://localhost:3000`.

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
```

## Architecture Highlights

- **Adapter Pattern:** Each news source has its own adapter that converts the API-specific response into a common `Article` model.
- **Repository Pattern:** `NewsRepository` fetches from all adapters in parallel, aggregates results, deduplicates by URL, sorts by date, and gracefully handles partial failures.
- **Custom Fetch Wrapper:** A timeout-aware `fetch` wrapper adapted from an internal reference project (`C:\Dev\open-retail\drivers-web-app\src\configs\fetch.js`).
- **Custom State Management:** Preferences are managed via React Context API and persisted to `localStorage`.
- **Routing:** React Router DOM handles navigation between Home, Article Detail, and Preferences pages.
- **Performance:** Article cards are memoised, images are lazy-loaded, and search input is debounced.

## Available Scripts

| Script               | Description                          |
| -------------------- | ------------------------------------ |
| `npm run dev`        | Start the Vite development server    |
| `npm run build`      | Build the production bundle          |
| `npm run preview`    | Preview the production build locally |
| `npm test`           | Run all tests once                   |
| `npm run test:watch` | Run tests in watch mode              |
| `npm run lint`       | Run ESLint                           |

## License

This project was created as a take-home coding challenge and is not licensed for production use.
