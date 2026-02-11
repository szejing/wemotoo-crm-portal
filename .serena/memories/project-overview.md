# Wemotoo CRM Portal – Project Overview

## Purpose

Admin frontend for Wemotoo CRM: merchant-facing portal for managing products, orders, sales, customers, outlets, taxes, CRM users, appointments, payment methods, and analytics. Communicates with the backend (ecommerce-nestjs) via Nuxt server routes that proxy requests with auth headers.

## Tech Stack

- **Framework:** Nuxt 4 (Vue 3, compatibilityVersion 4)
- **State:** Pinia
- **UI:** Nuxt UI 4, Tailwind CSS 4, VueUse, Material Icons
- **i18n:** @nuxtjs/i18n (en, ms), lazy locales in `i18n/locales/`
- **Validation:** VeeValidate + Zod (schemas in `app/utils/schema/`)
- **Charts:** @unovis/vue
- **Shared lib:** wemotoo-common (API_PATH, KEY, enums) – use for API paths and constants; portal has composable `useWemotooCommon` re-exporting KEY for Docker/build compatibility

## Codebase Structure

- **app/** – Vue app: `pages/` (file-based routing), `components/`, `layouts/`, `composables/`, `middleware/`, `repository/` (API client modules), `stores/`, `utils/` (types, schema, table-columns, options), `plugins/` (01.api.ts injects `$api` with all modules)
- **server/** – Nitro: `base_api.ts` (generateHeaders, generateImageHeaders), `routes/merchant/**` (proxy to backend; use `Routes` from `routes.server.ts` and `config.public.baseUrl`)
- **.agent/rules/** – Project rules (shared Cursor & Antigravity) for repository, server-routes, vue-pages-components, composables, middleware, schema, types, etc.

## Key Conventions

- **API:** Client calls go through Nuxt server routes (same path as backend). Repository modules extend HttpFactory, use MerchantRoutes (from routes.client.ts) for URLs. Server routes use `generateHeaders(event, includeAccessToken?)` and `Routes` from server.
- **Auth:** Cookie-based (KEY.ACCESS_TOKEN, KEY.X_MERCHANT_ID). Global middleware `auth.global.ts` redirects to `/login` if no token; public paths: `/login`, `/forgot-password`, `/reset-password`.
- **Imports:** `~/` for app, `#root/` for server/root in Nitro. Import API_PATH and shared types from wemotoo-common where applicable.
