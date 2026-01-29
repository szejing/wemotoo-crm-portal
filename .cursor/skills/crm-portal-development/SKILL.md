---
name: crm-portal-development
description: Run and develop the Wemotoo CRM Portal (Nuxt 3 / Vue 3). Use when starting the frontend locally, linking wemotoo-common, running builds, or using Docker for local dev. Covers npm/bun scripts, env files, and project layout.
---

# Wemotoo CRM Portal Development

## Quick Start

**Local dev (per environment):**
```bash
bun run start:local   # .env.local
bun run start:dev     # .env.dev
bun run start:prod    # .env.prod
```

**Build:**
```bash
bun run build:dev     # --dotenv .env.dev
bun run build:prod    # --dotenv .env.prod
```

**Preview production build:**
```bash
bun run preview
```

## Linking wemotoo-common

The portal depends on local `wemotoo-common`. Link it before developing:

```bash
npm link /Users/szejinggo/Documents/Projects/wemotoo-common
```

(Adjust the path if your wemotoo-common repo lives elsewhere.)

## NPM Scripts Reference

| Script | Purpose |
|--------|---------|
| `start:local` / `start:dev` / `start:prod` | `nuxt dev` with .env.local / .env.dev / .env.prod |
| `build:dev` / `build:prod` | `nuxt build` with corresponding dotenv |
| `generate` | `nuxt generate` (static) |
| `preview` | `nuxt preview` |
| `typecheck` | `nuxt typecheck` |
| `lint` / `lint:fix` | ESLint |
| `docker:dev` | docker-compose -f docker-compose.dev.yml up --build |
| `docker:prod` | docker-compose -f docker-compose.prod.yml up --build |
| `docker:build:dev` | docker buildx linux/arm64, tag wemotoo-crm:dev |
| `docker:build:prod` | docker buildx linux/amd64, tag wemotoo-crm:prod |
| `clean` | Remove node_modules, dist, .nuxt, bun.lockb |
| `rebuild` | clean then bun install |

## Conventions and Rules

When editing the portal, follow the Cursor rules in `.cursorrules/`:

- **general.mdc** – Structure, naming, TypeScript, security
- **vue-pages-components.mdc** – Pages, file-based routing, components, layouts
- **repository.mdc** – API client, routes.client.ts, request/response
- **server-routes.mdc** – Nitro routes under `server/routes/merchant/`, generateHeaders
- **schema.mdc** – Zod schemas in `app/utils/schema/`
- **types.mdc** – Types in `app/utils/types/`, repository models
- **composables.mdc** – Composables in `app/composables/`
- **middleware.mdc** – Nuxt and Nitro middleware
- **utility.mdc** – Utils, table-columns, constants

See `.cursorrules/README.md` for the layer-to-rule mapping.
