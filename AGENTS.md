# v0-clone-prototype

_the app is running on localhost:3000_

A v0 clone prototype — AI-powered UI generation interface.

## Prototype Notice

This is a **UI prototype only**. There is no backend.

- Focus on UI/UX and component development
- Mock all API requests with static data or simulated delays
- Use hardcoded responses for AI chat interactions
- Prioritize visual fidelity and interaction patterns over real functionality

## Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript 5
- **Styling**: Tailwind CSS 4 + shadcn/ui components
- **Theming**: next-themes (dark/light mode with system detection)
- **Path alias**: `@/*` maps to project root

## Project Structure

```
app/           → Pages and layouts (App Router)
components/ui/ → shadcn/ui components (ready to use)
hooks/         → Custom React hooks
lib/           → Utilities (cn() for class merging)
```

## Commands

```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build (always verify before committing)
npm run lint     # ESLint check
```

## Conventions

- **Components**: Use existing UI components from `components/ui/` before creating new ones
- **Guard**: Do not edit files in `components/ui/` unless explicitly asked
- **Styling**: Use `cn()` from `@/lib/utils` for conditional classes
- **Theming**: Use CSS variables from `app/globals.css`, not hardcoded colors

## Code

- No workarounds, no backwards-compat shims
- Don't remove features unless asked
- Small focused changes
- Minimal new dependencies
