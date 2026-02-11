# Cursor Rules Documentation

This directory contains coding rules and conventions for the Wemotoo CRM Portal (Nuxt 3 / Vue 3). The structure mirrors the ecommerce-nestjs `.cursorrules` layout; file extension is `.mdc`.

## Rule Files

### Core

- **`general.mdc`** – Project structure, naming, TypeScript, security, and code quality. `alwaysApply: true`.

### Server and API

- **`server-routes.mdc`** – Nitro API route handlers in `server/routes/merchant/`. Proxy to backend using `generateHeaders` and `Routes`; file naming follows `[param].get.ts`, `create.post.ts`, `many.get.ts`, etc.

- **`repository.mdc`** – Client API layer: `app/repository/` modules, `HttpFactory`, route definitions (`routes.client.ts`), and request/response models.

### Validation and Types

- **`schema.mdc`** – Zod validation in `app/utils/schema/`. Create/Update/Filter schemas per entity; used by forms and filters.

- **`types.mdc`** – Shared TypeScript types and domain models: `app/utils/types/`, `app/utils/interface/`, and repository `models/`.

### UI and Client Logic

- **`vue-pages-components.mdc`** – Pages (`app/pages/`) and components (`app/components/`). File-based routing, layouts, data loading, shared components, and component conventions.

- **`composables.mdc`** – Composables in `app/composables/`. Naming (`useXxx`), structure, and when to use them.

### Cross-Cutting

- **`middleware.mdc`** – Nuxt route middleware (`app/middleware/`) and Nitro server middleware (`server/middleware/`). Auth, redirects, CORS.

- **`utility.mdc`** – Pure helpers, table-columns, constants, and types under `app/utils/`. What belongs in utils vs repository/schema/composables.

## How to Use

- Cursor uses these rules to guide edits and suggestions.
- When adding features, open the relevant `.mdc` (and `general.mdc`) for the layer you’re editing (e.g. server-routes, repository, schema, pages/components).
- Keep rules under ~50 lines each where possible; add only patterns that match this codebase.

## Quick Reference

| Layer              | Location                     | Rule file              |
|--------------------|-----------------------------|------------------------|
| Server API proxy   | `server/routes/merchant/*`  | server-routes.mdc      |
| Client API         | `app/repository/*`          | repository.mdc         |
| Validation         | `app/utils/schema/*`        | schema.mdc             |
| Types / models     | `app/utils/types`, repo models | types.mdc          |
| Pages & components | `app/pages/*`, `app/components/*` | vue-pages-components.mdc |
| Composables        | `app/composables/*`         | composables.mdc        |
| Middleware         | `app/middleware/*`, `server/middleware/*` | middleware.mdc |
| Utils, constants   | `app/utils/*`               | utility.mdc            |

## Agent skills

Project-specific skills in `.cursor/skills/` (use when relevant):

- **nuxt-ui-usage** — Build UIs with @nuxt/ui v4; project theming, components, forms, tables, modals, i18n integration.
- **i18n-translation** — Locales (en, ms), translation patterns, validation schemas, options, table columns.

For full Nuxt UI component reference, install the official skill: `npx skills add nuxt/ui` or add in Cursor Settings > Skills: `https://github.com/nuxt/ui/tree/v4/skills/nuxt-ui`.
