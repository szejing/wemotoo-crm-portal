# Style and Conventions – Wemotoo CRM Portal

## ESLint (from nuxt.config)

- Indent: tab
- Quotes: single
- Semicolons: true
- Brace style: 1tbs

## Naming

- **Files:** Pages kebab-case or `[param].vue`; components PascalCase; composables useXxx.ts; repository modules by domain; request/response `*.req.ts` / `*.resp.ts`; schemas `*Validation.ts` under `utils/schema/{Entity}/{Create|Update|Filter}/`; server routes `many.get.ts`, `[param].get.ts`, `create.post.ts`, etc.
- **Variables/methods:** camelCase; constants UPPER_SNAKE_CASE; booleans prefix with is/has/should/can.
- **Props/emits:** camelCase in script, kebab-case in templates.

## TypeScript

- Strict types; avoid `any`. Explicit null/undefined checks. Prefer `Promise<T>` for async return types.

## Structure

- Pages: use `useAsyncData`/`useFetch` with unique keys; keep pages thin; delegate to composables or repository.
- Components: `<script setup lang="ts">`, defineProps/defineEmits with types; primitives under `components/Z/`.
- Repository: modules extend HttpFactory; use `this.call<T>({ method, url, body?, query? })`; no business logic in repository.
- Server routes: thin proxy only; use generateHeaders, Routes, baseUrl; no validation or DB logic here.
- Shared UI: put reusable pieces in `components/Z/`; domain-specific in Form/, Dashboard/, Sidebar/, etc.

## Imports

- `~/` for app; `#root/` for server in Nitro; wemotoo-common for API_PATH, KEY, enums.

## Security & Errors

- No secrets in client; use runtimeConfig. Validate/sanitize with Zod in utils/schema. Server: consistent error shape; avoid leaking stack. UI: handle useAsyncData/useFetch error/status; use typed error payloads.
