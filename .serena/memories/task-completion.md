# Task Completion – Wemotoo CRM Portal

When a coding task is completed:

1. **Lint:** Run `bun run lint` (or `lint:fix`). Resolve any ESLint errors in changed files.
2. **Typecheck:** Run `bun run typecheck`. Fix type errors before considering the task done.
3. **Manual check:** If the change affects UI or API flow, run `bun run start:local` and verify the relevant pages/flows.
4. **Conventions:** Ensure new code follows .agent/rules (repository, server-routes, vue-pages-components, general). Use existing patterns in repository/, server/routes/, and components/.
5. **Shared code:** If adding enums, constants, or types used by both portal and backend, add them in wemotoo-common and import in the portal; do not duplicate in app/utils or repository models when they belong in common.

Do not claim the task is complete without running lint and typecheck and addressing any failures.
