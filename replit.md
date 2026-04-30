# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

- **housekeeping-memorize** (`artifacts/housekeeping-memorize/`) — React+Vite study app for housekeeping training slides. Multiple study modes (flashcards, multiple-choice, fill-blank, daily drill, speed round, brain dump, teach-it, mnemonic linker, diagram master, procedures walkthrough/order test). Dev workflow `Housekeeping Memorize` runs on PORT 22355 with `BASE_PATH=/`.

### Recent bug fixes (Apr 2026)
- **Diagram Master matching** (`src/pages/match.tsx`): match check used `norm(term) === norm(definition)` which never matched. Switched to comparing pair `id`s.
- **Flashcard "wrong" stuck** (`src/pages/study.tsx`, `src/pages/daily-drill.tsx`): when a flashcard was marked wrong, no UI advanced the user (the wrong-overlay is gated to non-flashcards). Now `handleAnswer` auto-advances on either answer when the question type is `flashcard`.
