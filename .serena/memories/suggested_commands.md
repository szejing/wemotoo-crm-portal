# Suggested Commands – Wemotoo CRM Portal

## Development

- **Local dev:** `bun run start:local` (uses `.env.local`)
- **Dev env:** `bun run start:dev` (uses `.env.dev`)
- **Prod env (dev server):** `bun run start:prod` (uses `.env.prod`)

## Build

- **Dev build:** `bun run build:dev`
- **Prod build:** `bun run build:prod`

## Quality & Checks

- **Lint:** `bun run lint` or `bun run lint:fix`
- **Typecheck:** `bun run typecheck`

## Docker

- **Dev stack:** `bun run docker:dev` (docker-compose.dev.yml)
- **Prod stack:** `bun run docker:prod` (docker-compose.prod.yml)
- **Build images:** `bun run docker:build:dev` (arm64), `bun run docker:build:prod` (amd64)

## Utilities

- **Clean + reinstall:** `bun run rebuild` (removes node_modules, dist, .nuxt, bun.lockb; then bun install)
- **Generate (static):** `bun run generate`
- **Preview (after build):** `bun run preview`

## System (Darwin)

- Standard shell commands: `git`, `ls`, `cd`, `grep`, `rg`, `find`, etc. Prefer `rg` over `grep` for searching.
