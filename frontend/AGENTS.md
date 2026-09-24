# Frontend contribution rules

These rules apply to every change under `frontend/`. Follow them before
adding, changing, or reviewing frontend code. Prefer the smallest change that
solves the requested problem; do not mix unrelated refactors into a feature.

## Project and commands

- Stack: Vue 3, Vite, Vue Router, Vuetify, Tailwind CSS, and Supabase.
- Use Node versions allowed by `package.json`.
- Run from `frontend/`:
  - `npm test` for the Node test suite.
  - `npm run build` for the production build.
  - `npm run format` only for files being changed. Do not reformat unrelated
    files.
- Do not edit `dist/` or `node_modules/`; both are generated/dependency output.
- Keep `.env.local` local. Never commit it or put credentials, tokens, or real
  personal data in source, tests, screenshots, or documentation.

## Source layout and boundaries

Use the existing directory boundaries. Create a new module at the lowest layer
that owns the concern; do not put all feature code in a view.

| Location | Responsibility |
| --- | --- |
| `src/views/` | Route-level screens. Compose UI, own page-level state, call a feature composable/service, and coordinate navigation. |
| `src/components/` | Reusable presentation or narrowly scoped interactive UI. Receive data through props and report actions through emits/callbacks. |
| `src/composables/` | Reusable reactive state and orchestration shared by views/components, such as auth/session state. |
| `src/lib/` | Framework-independent domain helpers, validation, API/Supabase access wrappers, error mapping, and small workflow helpers. |
| `src/router/` | Route definitions, route metadata, guards, and navigation policies only. |
| `src/plugins/` | Application-wide third-party plugin setup. |
| `src/assets/` and `public/` | Static styling/assets only; do not store business logic here. |
| `tests/` | Focused behavior tests mirroring the module being tested. |

- A view may import a composable or `lib` module, but a presentational component
  must not instantiate Supabase, own route guards, or make data calls directly.
- Put reusable pure transformations and validation in `src/lib/`, not in a Vue
  SFC. Keep functions small, explicit, and independently testable.
- Use `@/` for imports from `src/` in new or touched production code. Relative
  imports remain acceptable inside a tightly coupled folder when they are more
  readable; do not churn existing imports just to change their style.
- One file should have one clear responsibility. Split a file once a second
  independent concern makes its public purpose unclear.

## Vue component conventions

- Use Vue 3 Composition API and `<script setup>` for new SFCs.
- Keep script sections ordered: imports, props/emits, constants and reactive
  state, computed values, lifecycle/watchers, then event handlers/helpers.
- Name booleans with `is`, `has`, `can`, or `should` (for example,
  `isSubmitting`). Name actions with verbs (`loadTrips`, `saveTrip`).
- Keep derived state as `computed`; do not duplicate a value in reactive state
  unless it is intentionally editable or cached.
- Pass input through props and communicate user actions upward with explicit
  emits. Do not mutate props or reach into parent/child component internals.
- Use `v-for` with stable domain IDs as keys, never the array index for mutable
  lists.
- Use Vue Router links (`:to`) for in-app navigation; do not use raw anchors for
  application routes.
- Do not use broad global state for one page. Promote state to a composable only
  when more than one consumer needs the same reactive lifecycle.

## UI, accessibility, and copy

- Build on the existing Vuetify and Tailwind design system. Reuse a component or
  existing visual pattern before introducing a new one.
- Make every screen responsive at mobile and desktop widths. Do not rely on
  hover as the only way to access an action.
- Use semantic HTML and native controls where possible. Icon-only controls need
  an accessible label; inputs need visible labels; status/error feedback needs
  an appropriate accessible role.
- Preserve keyboard navigation and visible focus. Do not remove focus outlines
  without a deliberate, accessible replacement.
- User-facing product copy, validation, and errors are Vietnamese unless the
  product explicitly asks for another language. Keep terminology consistent
  with existing screens.
- Every async screen or action must define its loading, success, error, and
  empty/no-data states. Never leave a clickable action active while its request
  is being submitted.

## Forms and client-side validation

- Model a form in the view/composable with a single explicit shape. Validate
  before making a network request.
- Keep reusable validation functions in `src/lib/*Validation.js`; return a
  field-to-message map so views can render field errors consistently.
- Clear stale server errors before a new submission. Keep field-validation
  errors separate from request/server errors.
- Set `isSubmitting` around async submissions with `try`/`catch`/`finally`.
  Disable or show loading on the submit action to prevent duplicate requests.
- Client validation is UX only. Treat server validation and authorization as
  authoritative, and map expected server errors to clear Vietnamese messages
  through a shared error-mapping helper.

## Data access, Supabase, and security

- `src/lib/supabase.js` is the only place that creates a Supabase client.
  Import that shared client; never call `createClient` in a view, component, or
  composable.
- Keep Supabase/database calls behind a domain-focused `lib` module or
  composable. A view should call an intention-revealing function, not construct
  ad-hoc query chains.
- Validate required configuration at startup. Browser-exposed configuration
  must use `VITE_*` variables only.
- A `VITE_*` value is public after Vite builds the app. Never expose a Supabase
  `service_role` key, database password, private API key, or signing secret in
  frontend code or environment files.
- Frontend route guards and hidden UI are usability measures, not authorization.
  Assume Supabase RLS and/or the backend enforce every data permission.
- Do not accept a user ID, role, or ownership claim from client state as proof
  of permission. Use the authenticated session and server-side policies.

## Authentication and routing

- Keep session lifecycle behavior in `src/composables/useAuth.js` and the
  singleton wiring in `src/lib/auth.js`. Do not create parallel auth stores.
- Initialize auth before mounting the app; keep `bootstrap.js` responsible for
  startup ordering and listener disposal.
- New protected routes must use `meta.requiresAuth`; routes intended only for
  signed-out visitors must use `meta.guestOnly`. Extend guard behavior in
  `src/router/authGuard.js`, not inside individual views.
- Preserve a safe internal `redirect` target after login. Do not redirect to an
  arbitrary external URL supplied by a query string.
- Use the existing auth error mapping and show failures in the UI. Do not log
  passwords, access tokens, full session objects, or private error payloads.

## Errors, async work, and navigation

- Wrap awaited user-triggered requests in `try`/`catch`/`finally`; reset loading
  state in `finally`.
- Throw errors from low-level `lib` functions after normalizing only what the
  caller needs. Views decide presentation through shared error helpers.
- Avoid navigation until the operation that requires success has completed.
  For destructive actions, preserve the current route and show an error if the
  request fails.
- Guard against stale results when a route parameter or component can change
  during a request. Use Vue lifecycle cleanup or request cancellation when the
  feature needs it.

## Tests and change completion

- Add or update a focused test for every changed behavior, bug fix, validation
  rule, guard, data mapping, or error branch. Test behavior and boundary cases,
  not implementation details.
- Keep tests deterministic: mock Supabase, time, and network behavior; do not
  require live credentials or a live backend in unit tests.
- Put pure/helper tests in `tests/<domain>.test.mjs`. Inject dependencies into
  functions/composables where practical, following the existing auth tests.
- Before saying a frontend task is complete, run `npm test` and `npm run build`
  from `frontend/`. Report commands not run and the reason.
- Review the final diff for accidental `.env` changes, generated files,
  unrelated formatting, secrets, broken imports, and missing loading/error
  states.
