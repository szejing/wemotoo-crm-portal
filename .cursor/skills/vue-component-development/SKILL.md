---
name: vue-component-development
description: Build and refactor Vue components and pages in the Wemotoo CRM Portal (Nuxt 3). Use when adding or changing UI in app/pages or app/components, creating forms, modals, or reusable UI, or when the user mentions shared components, reusability, or DRY in the portal.
---

# Vue Component Development (CRM Portal)

## Conventions and rules

When editing pages or components, follow the project Cursor rules in `.cursorrules/`:

- **vue-pages-components.mdc** – Pages (`app/pages/`), components (`app/components/`), file-based routing, layouts, data loading, shared components
- **general.mdc** – Structure, naming, TypeScript, code quality, shared-component guidance
- **composables.mdc** – When to use composables vs components
- **repository.mdc** – API layer for data
- **schema.mdc** – Zod validation for forms

See `.cursorrules/README.md` for the full layer reference.

## Shared components

- **Consider creating a shared component** when the same UI or behaviour is used in multiple places (e.g. same form field, toolbar, or modal pattern in 2+ pages or components).
- **Generic/reusable** → `app/components/Z/` (or subfolders like `Z/Modal/`, `Z/Input/`, `Z/SelectMenu/`). Keep them generic and configurable via props.
- **Feature-specific shared** → relevant domain folder: `Form/`, `Dashboard/`, `Sidebar/`, `Input/`, etc.
- One component per file; filename PascalCase (e.g. `DateRangePicker.vue`).

## Quick reference

| Need | Location / pattern |
|------|---------------------|
| New page/route | `app/pages/**/*.vue`, file-based routing |
| Reusable UI primitive | `app/components/Z/` or `Z/Subfolder/` |
| Form / domain form | `app/components/Form/` or `Form/Product/`, etc. |
| Shared logic / state | `app/composables/useXxx.ts` |
| API calls | `app/repository/` + server routes |
| Validation | `app/utils/schema/` (Zod) |

## Anti-patterns

- Large inline logic in pages → extract to composables or repository.
- Duplicated UI in 2+ places without a shared component → extract to `Z/` or domain folder.
- Direct `$fetch` in many components without a shared wrapper → use repository or composable.
