# Git commits

- Do not create commits, stage files, amend history, push branches, or open
  pull requests. Leave verified changes in the working tree for the user to
  review and commit manually.

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
- Project documentation is stored and read from `.doc/`, including
  `.doc/index.html`, `.doc/README.md`, and `.doc/README_DB.md`. Read the
  relevant material there before making a related change; create new project
  documentation there rather than inside `frontend/`.

## Source layout and boundaries

Use the existing directory boundaries. Create a new module at the lowest layer
that owns the concern; do not put all feature code in a view.

| Location | Responsibility |
| --- | --- |
| `frontend/src/views/` | Route-level screens. Compose UI, own page-level state, call a feature composable/service, and coordinate navigation. |
| `frontend/src/components/` | Reusable presentation or narrowly scoped interactive UI. Receive data through props and report actions through emits/callbacks. |
| `frontend/src/composables/` | Reusable reactive state and orchestration shared by views/components, such as auth/session state. |
| `frontend/src/lib/` | Framework-independent domain helpers, validation, API/Supabase access wrappers, error mapping, and small workflow helpers. |
| `frontend/src/router/` | Route definitions, route metadata, guards, and navigation policies only. |
| `frontend/src/plugins/` | Application-wide third-party plugin setup. |
| `frontend/src/assets/` and `frontend/public/` | Static styling/assets only; do not store business logic here. |
| `frontend/tests/` | Focused behavior tests mirroring the module being tested. |

- A view may import a composable or `lib` module, but a presentational component
  must not instantiate Supabase, own route guards, or make data calls directly.
- Put reusable pure transformations and validation in `frontend/src/lib/`, not in a Vue
  SFC. Keep functions small, explicit, and independently testable.
- Use `@/` for imports from `src/` in new or touched production code. Relative
  imports remain acceptable inside a tightly coupled folder when they are more
  readable; do not churn existing imports just to change their style.
- One file should have one clear responsibility. Split a file once a second
  independent concern makes its public purpose unclear.

## Vue component conventions

- Use Vue 3 Composition API and `<script setup>` for new SFCs.
- Order every Vue SFC with `<template>` first and `<script setup>` after it.
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
- For the Workspace trip-collection screen, use `.doc/index.html` as the
  functional and layout reference. Keep the
  application’s Ocean Slate palette below when translating that mockup; the
  mockup’s standalone colours do not override the canonical product palette.
- Keep the product's travel-inspired **Ocean Slate** palette consistent. The
  canonical colours and their roles are:
  - `#183D4C` (Ocean Slate): the shared background for the application header
    and sidebar; use it as the primary dark surface rather than introducing a
    new blue or green.
  - `#166C74` (Coastal Teal): interactive treatment on Ocean Slate, including
    header borders plus navigation/button hover and active backgrounds.
  - `#E8C47C` (Sand): warm accent for avatars, badges, key outlines, and
    keyboard focus indicators on dark surfaces. It is an accent, not a large
    background fill.
  - `#F4F8EC`, `#D9E8E7`, and `#C9DDE0`: high-to-medium emphasis text on dark
    surfaces. Use white or `#F4F8EC` for primary text, then the lighter muted
    tones for labels and secondary account information.
  - `#52717A`: secondary text on white surfaces, such as the account menu.
  - `#B42318` (with hover `#8F1D15`): destructive actions only, including
    logout in the account menu. Do not use this red for ordinary navigation or
    account information.
- Header and sidebar are one visual shell: keep both on `#183D4C`, with
  `#166C74` for their interactive states and `#E8C47C` for their shared accent.
  Do not make either surface white, add gradients, or substitute unrelated
  brand colours without an approved visual redesign.
- On dark surfaces, preserve visible keyboard focus with a `#E8C47C` outline.
  Hover, active, disabled, and focus states must remain distinguishable without
  relying on colour alone; disabled controls must also reduce opacity and block
  interaction.
- For responsive account controls, keep account identity neutral and reserve
  destructive red for the logout action. On mobile, the account popup must
  visually separate logout from the name and email with its red text and a
  divider.
- Make every screen responsive at mobile and desktop widths. Do not rely on
  hover as the only way to access an action.
- Use semantic HTML and native controls where possible. Icon-only controls need
  an accessible label; inputs need visible labels; status/error feedback needs
  an appropriate accessible role.
- For forms, render a visible `<label>` above each Vuetify input/select/file
  control. Connect the label's `for` value to the control's `id`; do not rely
  on an in-field label when an external label is present.
- Use a compact responsive form grid: one column on mobile, up to two columns
  on tablet, and up to three columns on desktop. Reserve full-width spans for
  long content such as descriptions, uploads, and dynamic lists.
- Form fields use the `outlined` variant and a consistent `0.75rem` rounded
  field surface. Keep the input control height at 56px where adjacent buttons
  must align with it.
- Use rounded buttons with a visible Sand focus ring. Primary actions use
  `#166C74` with bold white text; neutral/cancel actions use `#D9E8E7` with
  Ocean Slate text; destructive actions use `#B42318` with white text and
  hover `#8F1D15`.
- For dynamic form lists, place the add action below the list and style it as
  a primary button. Use a text "Xóa" destructive button (not an X icon) for
  removal; it must match the associated input height and remain on the same
  row as that input at every viewport width.
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
- Keep reusable validation functions in `frontend/src/lib/*Validation.js`; return a
  field-to-message map so views can render field errors consistently.
- Clear stale server errors before a new submission. Keep field-validation
  errors separate from request/server errors.
- Set `isSubmitting` around async submissions with `try`/`catch`/`finally`.
  Disable or show loading on the submit action to prevent duplicate requests.
- Client validation is UX only. Treat server validation and authorization as
  authoritative, and map expected server errors to clear Vietnamese messages
  through a shared error-mapping helper.

## Data access, Supabase, and security

- `frontend/src/lib/supabase.js` is the only place that creates a Supabase client.
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

- Keep session lifecycle behavior in `frontend/src/composables/useAuth.js` and the
  singleton wiring in `frontend/src/lib/auth.js`. Do not create parallel auth stores.
- Initialize auth before mounting the app; keep `frontend/src/bootstrap.js` responsible for
  startup ordering and listener disposal.
- New protected routes must use `meta.requiresAuth`; routes intended only for
  signed-out visitors must use `meta.guestOnly`. Extend guard behavior in
  `frontend/src/router/authGuard.js`, not inside individual views.
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
- Put pure/helper tests in `frontend/tests/<domain>.test.mjs`. Inject dependencies into
  functions/composables where practical, following the existing auth tests.
- Before saying a frontend task is complete, run `npm test` and `npm run build`
  from `frontend/`. Report commands not run and the reason.
- Review the final diff for accidental `.env` changes, generated files,
  unrelated formatting, secrets, broken imports, and missing loading/error
  states.

# Backend API contribution rules

These rules apply to every change under `backend/`. Prefer the smallest change
that solves the requested API problem; do not mix unrelated refactors into an
endpoint or data-model change.

## Project and commands

### Công nghệ backend đang dùng

- Python 3 với FastAPI và Uvicorn cho HTTP API/ASGI server.
- Pydantic v2 và Pydantic Settings cho schema, validation, và cấu hình từ môi
  trường.
- SQLAlchemy 2.x cho truy cập dữ liệu; PostgreSQL qua driver psycopg 3 (kèm
  `psycopg-binary` trong môi trường phát triển).
- `python-dotenv` để nạp file `.env`; `email-validator` cho validation email;
  `python-multipart` khi endpoint cần nhận form hoặc file upload.

- Use the Python version supported by `backend/.venv` and
  `backend/requirements.txt`.
- Run backend commands from `backend/`. Use the project virtual environment;
  on Windows, for example, `.venv\Scripts\python -m uvicorn app.main:app --reload`.
- Install or update dependencies only through `backend/requirements.txt`. Do
  not edit `.venv/`, `__pycache__/`, or other generated files.
- Keep `backend/.env` local. Do not commit it or put passwords, database URLs,
  tokens, private keys, or real personal data in source, tests, logs, or docs.
  Update `backend/.env.example` only with safe placeholder names and values.
- Read relevant project documentation from `.doc/` before related work,
  especially `.doc/README.md` and `.doc/README_DB.md`. Put new project
  documentation in `.doc/`, not in `backend/`, unless it is Python package
  documentation that belongs beside the module.

## Structure and dependency boundaries

Use the existing `backend/app/` package boundaries. Create a module at the
lowest layer that owns the concern.

| Location | Responsibility |
| --- | --- |
| `backend/app/main.py` | Application setup, router registration, lifespan wiring, and global middleware/exception handling. |
| `backend/app/api/` | HTTP routers, path/query parameter handling, response status codes, and dependencies. |
| `backend/app/schemas/` | Pydantic request/response models and API-facing validation. |
| `backend/app/services/` | Domain workflows and orchestration; independent from HTTP request/response objects. |
| `backend/app/repositories/` | SQLAlchemy persistence queries and transaction-aware data access. |
| `backend/app/models/` | SQLAlchemy ORM models and database mapping. |
| `backend/app/core/` | Settings, security primitives, shared errors, and framework-wide configuration. |
| `backend/app/db/` | Engine, session lifecycle, migrations integration, and database-only helpers. |
| `backend/tests/` | Deterministic API, service, repository, and validation tests. |

- A router must not construct SQLAlchemy queries or contain business workflows.
  It validates HTTP input, calls a service, and returns a declared response.
- Services must not depend on FastAPI `Request`, `Response`, or
  `HTTPException`; raise explicit domain errors that the API layer maps to
  HTTP responses.
- Repositories own persistence details. Do not duplicate SQL or session
  management across routers and services.
- Keep modules focused. Add an `api`, `schemas`, `services`, `repositories`,
  or `models` package only when the feature needs it; do not scaffold empty
  layers.

## API design and validation

- Use resource-oriented paths, plural nouns, and HTTP methods with their usual
  semantics. Use the consistent `/api` prefix for application endpoints (for
  example `/api/workspaces`); do not add a version segment such as `/v1`
  unless the product explicitly adopts an API-versioning plan. Operational
  endpoints such as `/health` may remain outside this prefix.
- Put cross-cutting, reusable backend concerns in a focused common package
  (for example `backend/app/common/`): response envelopes, exception/domain
  error types, client-safe messages, shared constants, and small generic
  helpers. Create a focused module for each concern; do not turn `common` into
  a catch-all for feature-specific business logic.
- Reuse common response schemas and messages across routers; do not duplicate
  response envelopes or user-facing messages in endpoints.
- Keep response envelopes consistent: successful responses provide `message`
  and `data`; error responses provide `message`, a stable machine-readable
  `code`, and optional safe field-level details. Keep messages in Vietnamese
  unless the product explicitly requests another language.
- Declare request bodies and success responses with Pydantic models. Do not
  expose ORM instances, database rows, passwords, tokens, internal exception
  text, or implementation-only fields directly.
- Use appropriate status codes: `201` for creation, `204` only for an empty
  successful response, `400` for malformed requests, `401` for unauthenticated
  requests, `403` for unauthorized requests, `404` for absent resources,
  `409` for state conflicts, and `422` for schema validation failures.
- Validate path, query, and body input at the API boundary. Put reusable
  domain validation in schemas or a focused pure helper and keep error
  messages safe and actionable in Vietnamese unless the product explicitly
  requests another language.
- Define pagination, filtering, sorting, and date/time formats explicitly.
  Use timezone-aware ISO 8601 timestamps and stable IDs; never rely on client
  supplied ownership or role fields as authorization proof.
- Preserve backward compatibility for existing API contracts. Make breaking
  changes only with an explicit migration/versioning plan and tests.

## Database, transactions, and configuration

- `backend/app/core/config.py` is the sole source of typed application
  settings. Read configuration through `settings`; do not read environment
  variables ad hoc in routers, services, or repositories.
- `backend/app/db/session.py` owns engine creation. Reuse the shared engine and
  provide an explicit session dependency for request-scoped database work; do
  not create an engine or a database connection inside an endpoint.
- Use SQLAlchemy ORM for straightforward create, read, update, delete, and
  relationship queries. Use raw SQL only when a complex query is clearer or
  needs PostgreSQL-specific capabilities; keep it isolated in a repository and
  document its purpose briefly.
- Use parameterized SQLAlchemy expressions or bound parameters only. Never
  interpolate user input into SQL strings.
- Keep transaction ownership explicit: commit only after the complete service
  operation succeeds, roll back on failures, and close/release sessions in all
  paths. Avoid partial writes for multi-step workflows.
- Treat database constraints, migrations, RLS, and server-side authorization as
  authoritative. Model nullability, uniqueness, foreign keys, indexes, and
  delete behavior deliberately; do not rely on client-side checks.
- Do not log connection strings, credentials, complete authorization headers,
  or sensitive database values.

## Authentication, authorization, and security

- Put authentication parsing and reusable authorization dependencies in
  `backend/app/core/security.py` or a focused dependency module. Authenticate
  before loading protected resources and authorize each resource action on the
  server.
- Derive identity, roles, and ownership from verified credentials and trusted
  persistence data. Never trust a user ID, workspace ID, role, or permission
  submitted by the client.
- Use proven password hashing and token-verification libraries/configuration;
  never store or log plaintext passwords, access tokens, refresh tokens, or
  signing secrets.
- Keep CORS origins, trusted hosts, rate limits, upload limits, and production
  debug settings explicit and environment-driven. Do not use permissive `*`
  origins with credentialed production requests.
- Return generic client-safe errors for authentication, authorization, and
  unexpected failures. Log structured, redacted diagnostic context server-side
  without secrets or personal data.

## Errors, async work, and observability

- Map expected domain and database errors to a consistent API error shape. Do
  not leak stack traces, raw SQL errors, schema details, or third-party payloads
  in responses.
- Use `async def` only when all awaited I/O in that path is async-compatible.
  Keep blocking database calls in regular `def` endpoints/services or migrate
  the full data-access path deliberately; do not mix styles accidentally.
- Set timeouts for outbound network calls, translate their expected failures,
  and make retry behavior explicit and safe for the operation.
- Maintain a health endpoint that reflects the dependencies it claims to
  check. Health endpoints must not expose secrets or privileged data.
- Add request/correlation IDs and structured logs when an API has operational
  needs, while redacting credentials and sensitive personal data.

## Tests and change completion

- Add or update focused deterministic tests for every changed endpoint,
  service workflow, validation rule, authorization branch, error mapping, and
  persistence boundary. Mock external services and use a dedicated test
  database/session; never require production credentials.
- Test both success and failure behavior, including invalid input, missing
  resources, forbidden access, conflict cases, and transaction rollback where
  applicable. Assert public contracts rather than implementation details.
- When a pytest suite is present, run it from `backend/` with
  `.venv\Scripts\python -m pytest`; otherwise run the narrowest available
  deterministic verification and state what is missing.
- Before declaring a backend task complete, run the applicable tests and a
  startup/import check, such as `.venv\Scripts\python -m compileall app`.
  Report every command not run and why.
- Review the final diff for accidental `.env` changes, generated files,
  secrets, unregistered routes, broken imports, missing response models,
  missing authorization, and incomplete error handling.
