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
   - Applied SOLID principles, particularly single responsibility and dependency inversion, using Adapter and Repository patterns.
   - Chose React Context API and native `fetch` to minimise third-party dependencies.
   - "Adapted an existing fetchWithTimeout pattern from an internal reference implementation."

3. **Implementation**
   - Used the agent to accelerate implementation across the project, including scaffolding, component generation, test generation, Docker configuration, and documentation, with generated output reviewed, adapted, and validated against the requirements.
   - Implemented mobile-first components with Tailwind CSS.
   - Added infinite scroll via a custom `IntersectionObserver` hook.
   - Added React Router DOM for client-side navigation, including a dedicated article detail page at `/article/:id`.

4. **Quality Assurance**
   - Wrote unit tests for adapters, repository, hooks, and components.
   - Ran build and test commands to verify the project compiles and passes tests.

## Engineering Decisions and AI Validation

AI was used to explore implementation alternatives, but architectural
and technical decisions were reviewed against the project requirements.

Examples:

- Evaluated infinite-scroll approaches and selected IntersectionObserver
  instead of scroll-event listeners to avoid unnecessary event handling
  and improve efficiency.

- Reviewed dependency choices and intentionally avoided introducing a
  UI component library to keep the application lightweight and reduce
  unnecessary bundle overhead.

- AI-generated implementations were reviewed for correctness,
  maintainability, accessibility, and performance before being retained.

## AI-Assisted Development Workflow

The agent was used iteratively rather than as a one-shot code generator.

1. Understand the requirement.
2. Ask the agent to analyse the problem and identify edge cases.
3. Review proposed architecture and implementation options.
4. Select or modify the approach based on project constraints.
5. Implement the feature with AI assistance.
6. Review generated code manually.
7. Run tests, linting, and build checks.
8. Use the agent to identify potential issues.
9. Apply only validated improvements.
10. Re-run quality checks.

## Examples of AI-Assisted Decisions

### Infinite Scrolling

The agent evaluated scroll-event and IntersectionObserver approaches.
IntersectionObserver was selected because it avoids continuous scroll
event handling and provides a cleaner sentinel-based implementation.

### Dependencies

AI suggested several libraries during exploration. Dependencies were
not adopted automatically; each was evaluated against bundle size,
project complexity, and whether the functionality could be implemented
cleanly with existing platform APIs.

## Best Practices Followed

- **Mobile-first responsive design** with Tailwind breakpoints.
- **Minimal dependencies:** only React, Vite, Tailwind, and testing tools.
- **Custom utilities and reusable components** instead of UI libraries.
- **SOLID principles:** Adapter/Repository patterns, dependency inversion, single responsibility.
- **Performance:** ## Performance Validation

Performance considerations were reviewed using browser DevTools and
build output.

Areas evaluated included:

- JavaScript bundle size
- image loading
- unnecessary component re-renders
- network requests
- infinite-scroll behavior
- initial loading experience
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
