# AI Agent Usage Notes

> This file documents how AI coding agents were used during the development of this project.
> For the project plan, see [`PROJECT_PLAN.md`](./PROJECT_PLAN.md).
> For the task tracker, see [`TODOS.md`](./TODOS.md).
> For build/run instructions, see [`README.md`](./README.md).

## Agent Used

- **OpenCode** (powered by `kimi-k2.7` via `aigateway/kimi-k2.7`)

## How the Agent Was Used

1. **Requirement Analysis**
   - The agent read the challenge screenshots and extracted functional and non-functional requirements.
   - It proposed a project plan, tech stack, and architecture before writing any code.

2. **Architecture Design**
   - Designed a SOLID-compliant architecture using the Adapter and Repository patterns.
   - Chose React Context API and native `fetch` to minimise third-party dependencies.
   - Adapted the custom `fetchWithTimeout` pattern from an internal reference project (`C:\Dev\open-retail\drivers-web-app\src\configs\fetch.js`).

3. **Implementation**
   - Generated the full project scaffold, source files, tests, Docker configuration, and documentation.
   - Implemented mobile-first components with Tailwind CSS.
   - Added infinite scroll via a custom `IntersectionObserver` hook.
   - Added React Router DOM for client-side navigation, including a dedicated article detail page at `/article/:id`.

4. **Quality Assurance**
   - Wrote unit tests for adapters, repository, hooks, and components.
   - Ran build and test commands to verify the project compiles and passes tests.

## Best Practices Followed

- **Mobile-first responsive design** with Tailwind breakpoints.
- **Minimal dependencies:** only React, Vite, Tailwind, and testing tools.
- **Custom utilities and reusable components** instead of UI libraries.
- **SOLID principles:** Adapter/Repository patterns, dependency inversion, single responsibility.
- **Performance:** `React.memo`, lazy-loaded images, debounced search, efficient state updates.
- **Accessibility:** semantic HTML, focus-visible styles, ARIA labels.

## Testing Practices

- **Framework:** Vitest with jsdom and `@testing-library/react`.
- **Browser API mocking:** mock globals such as `IntersectionObserver` and `localStorage` in `src/__tests__/setup.ts` or in the relevant test file.
- **Controllable mocks:** for `IntersectionObserver` tests, use a mock class that records observed targets and exposes a `trigger(isIntersecting)` helper. This lets tests assert on callback behavior without relying on real layout.
- **Test behavior, not implementation:** verify trigger conditions, loading/no-more guards, cleanup, and delayed element mounting rather than asserting on internal refs.
- **Coverage targets:** adapters, repository, hooks, and components should each have focused unit tests.
- Always run `npm test` and `npm run build` before considering work complete.

## Infinite Scroll / IntersectionObserver Guidelines

- Use a **single sentinel element** at the end of the list and an `IntersectionObserver` instead of scroll/resize event listeners.
- Use a **callback ref** to track the sentinel node so the observer is created as soon as the node exists, even if it is not rendered on the first paint (e.g. during initial skeleton loading).
- Apply a `rootMargin` (default `200px`) so the next page loads while the user is still near the end of the current page.
- Guard `onLoadMore` with refs/state for `isLoading` and `hasMore`.
- Reset the trigger only when the sentinel leaves the viewport to avoid duplicate or infinite calls while it stays intersecting.
- Always disconnect the observer in the effect cleanup to prevent memory leaks.

## Development Workflow

1. Make focused, minimal changes.
2. Follow the existing file structure and naming conventions.
3. Add or update tests for any changed behavior.
4. Run quality checks:
   - `npm test`
   - `npm run build`
   - `npx eslint <changed-files>` (the full `npm run lint` script currently has pre-existing errors in `src/api/clients/*` and store files).

## Additional Guidelines

- **TypeScript strict mode** is enabled; prefer explicit types for component props and hook options.
- Use **`@/*` path aliases** for imports to keep the codebase consistent.
- Keep React Hooks inside components or custom hooks only; do not call them from plain utility/async functions such as API clients.
- Prefer the mock data service (`src/services/mockDataService.ts`) for offline development and to avoid API rate limits.
- Keep components functional and leverage custom hooks in `src/hooks/` for reusable logic.

## Candidate Guidance

If you are extending this project, you can continue using an AI agent by:

1. Describing the feature or bug fix in plain language.
2. Pointing the agent to the relevant files in `src/`.
3. Asking the agent to follow the existing patterns (adapters, hooks, custom components).
4. Running tests and the build before considering the change complete.
