---
name: form-creation
description: >-
  Build create-entity flows in the Wemotoo CRM Portal using ZPagePanel + footer actions, UForm + Zod schema, optional sticky review column, and Form*Creation components. Use when adding a new “create” page, FormFooCreation.vue, marketing or dashboard create views, submit-from-footer pattern, or when the user mentions form creation, create flow, or entity creation UI.
---

# Form creation (dashboard)

Standard pattern for **creating** a resource in the portal: a dedicated **`Form…Creation`** component (form + validation + optional review) and a **page** that hosts it with **`ZPagePanel`**, **`grow`**, and a **fixed footer** that triggers submit.

Pair with **`page-panel-layout`** (shell), **`nuxt-ui-usage`** (UForm / UCard / buttons), **`i18n-translation`** (keys), and **`implementation-and-tests`** (tests).

## Reference implementations

| Pattern | Form component | Page |
|--------|----------------|------|
| Simple (form + sticky review, no section nav) | `app/components/Form/DiscountCreation.vue` | `app/pages/marketing/discounts/create.vue` |
| Review card styling | `app/components/Form/Discount/ReviewSummary.vue` | — |
| Complex (multi-section, optional sidebar nav) | `app/components/Form/Product/Creation.vue` | `app/pages/products/create.vue` |

Use the **simple** pattern by default. Use the **product** pattern only when there are multiple long sections and section navigation is required.

## Page (`app/pages/.../create.vue`)

1. **`ZPagePanel`** with `id`, `:title` (`$t`), `back-to`, and **`grow`** so the body and footer layout match other create flows.
2. Body: **`div.container.w-full.mx-auto.py-4`** wrapping **`FormEntityCreation ref="formRef"`** (name matches Nuxt auto-import).
3. **`#footer`**: bordered, backdrop blur, **desktop** row (e.g. cancel + primary) and **mobile** column (primary full width, secondary actions). Primary action calls **`formRef?.submit()`** — do not duplicate submit logic on the page.
4. **`useHead`** title from i18n.
5. **`useLeavePageGuard(isDirty, { onLeave: () => store.resetNew…() })`** when the store holds draft state; align `isDirty` with fields users can edit.
6. Import **`ICONS`** from `~/utils/icons` for footer buttons.

## Form component (`app/components/Form/EntityCreation.vue`)

### Layout

- Root **`div.w-full`**.
- **`grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6`**:
  - **Form column**: `lg:col-span-9` — `UForm` + content.
  - **Review column** (if used): `lg:col-span-3` with **`lg:sticky lg:top-4`** wrapping a small summary card component.
- Omit the **left section sidebar** unless the flow is genuinely multi-section (see Product Creation).

### `UForm`

- **`ref="formRef"`**
- **`:schema`** — from `CreateEntityValidation(t)` (or equivalent) wrapped in **`computed(() => …)`** when the schema depends on `t`.
- **`:state`** — Pinia store draft (e.g. `new_entity` from `storeToRefs`).
- **`@submit`** — call store create action; navigate or toast per existing store patterns.
- **`@error`** — optional: map first error’s field to a **`#id`** on a **`UCard`** and **`scrollIntoView`**, then **`focus`** the control if it exposes an id (match existing discount/product behavior).

### `defineExpose({ submit })`

Implement **`submit()`** as **`formRef.value?.submit()`** on the `UForm` ref so the page footer can trigger validation + submit.

### Loading

While the store exposes an **`adding`** (or similar) flag, use **`useOverlay()`** + **`ZModalLoading`** from `#components` and **`watch(adding, …)`** to open/close the modal (same idea as product creation).

### Card and fields

- Wrap the main block in **`UCard`** with stable **`id="section-…"`** (for scroll-to-error), **`class="shadow-md scroll-mt-4"`**.
- **Header**: icon (`ICONS` from `~/utils/icons`), **`h2.text-xl.font-semibold`**, optional **`*`** for required sections, subtitle **`text-sm text-neutral-500 dark:text-neutral-400`**.
- **Body**: **`div.space-y-6.py-2.px-4`**; inner **`grid grid-cols-1 sm:grid-cols-2 gap-4`** for fields.
- **`UFormField`**: **`name`** must match Zod keys; **`required`** when applicable.
- Optional hint line under label: **`p.text-xs.text-neutral-500.dark:text-neutral-400.my-1`** with i18n under **`components.<entity>Form.*`**.
- Generic field labels: **`form.code`**, **`form.name`**, **`form.description`** (defined in `i18n/locales/en.json` and `ms.json`). Entity-specific hints/titles stay under **`components.<entity>Form`**.

Prefer **`UInput`** for short text (including description) unless multiline is explicitly required.

### Review summary component

- Place at **`app/components/Form/<Entity>/ReviewSummary.vue`** (auto-import: **`Form<Entity>ReviewSummary`**).
- Mirror **`Form/Product/ReviewSummary.vue`**: **`UCard`** with primary border treatment, header with check icon, sections with **`rounded-xl bg-elevated/60 p-4 border border-default/10`**.
- Accept a small **typed props** object (e.g. `DiscountReviewSummary`) built from a **`computed`** in the form component.

## i18n

- Add **`form.code`**, **`form.name`**, **`form.description`** if not present (EN + MS).
- Add **`components.<entity>Form.*`** for create button label, section subtitle, hints, review title/subtitle as needed.

## When not to use this skill

- **Edit/update** flows may reuse pieces (card, `UForm`) but often differ (load by id, patch, no `resetNew*`).
- **Modals** or inline creates without a full page: adapt layout; keep validation and store patterns consistent.
