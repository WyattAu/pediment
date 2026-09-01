# Building Shared Infrastructure for 73 Repositories

*Published: August 31, 2026*

---

When you have 73 repositories under one GitHub organization, each one slowly accumulating its own copy of error handling, HTTP client wrappers, health check endpoints, and design tokens, you eventually face a choice: keep copy-pasting, or build shared infrastructure and migrate everything over.

I chose the hard path. Here's what happened.

## The Problem: 73 Repos, Duplicated Everywhere

By mid-2026, the WyattAu organization had grown to 73 repositories spanning Rust crates, Astro+SolidJS web apps, Starlight documentation sites, and TypeScript packages. A large monorepo called `ferro` alone contained 73 internal crates. The `starlight-sites` project ran 46 documentation sites from a single workspace.

The duplication was endemic:

- Every Rust service had its own error type with slightly different HTTP status mappings
- OpenTelemetry initialization was copy-pasted across 15+ services, each with its own version pins
- Health check endpoints were reimplemented in every Axum server
- Design tokens for the Astro+Starlight web properties lived in 6+ separate CSS files
- The same circuit breaker, rate limiter, and connection pooling logic appeared in at least 4 codebases

The breaking point came when I found three different implementations of JWT validation in three different repositories, each with a subtly different bug in the token expiry check.

## What Was Built: The Shared Infrastructure Ecosystem

### 28 Rust Crates

The Rust side grew into a layered dependency graph of small, focused crates. Each one lives in its own repository, is published to crates.io, and follows a standardized structure from the `forgeyard` Rust template.

**Foundation layer** (no WyattAu dependencies):

| Crate | Published Name | Purpose |
|-------|---------------|---------|
| `errcode` | `error-codes` | Structured error handling with derive macros, HTTP status mapping, RFC 7807 Problem Details |
| `otelkit` | `otelkit` | Tracing and telemetry initialization -- OpenTelemetry, OTLP, Sentry |
| `healthkit` | `healthkit` | Kubernetes/Docker health check endpoints (liveness, readiness, startup probes) |
| `envstack` | `envstack` | Layered config from env vars, TOML files, and CLI args |
| `shared-state` | `shared-state` | Readiness gates, TTL caches, shared counters |
| `graceful` | `shutdown-kit` | Graceful shutdown with signal handling and RAII cleanup guards |
| `api-types` | `api-types` | Standard API response types (Success, Error, List) with OpenAPI derives |
| `paginate` | `api-paginate` | Offset and cursor-based pagination types |

**Security layer:**

| Crate | Published Name | Purpose |
|-------|---------------|---------|
| `tokenkit` | `tokenkit` | Type-safe JWT encode/decode with key rotation and revocation |
| `cryptkit` | `cryptkit` | HMAC-SHA256, AES-GCM, constant-time comparison, secure random |
| `salting` | `salting` | Opinionated Argon2id password hashing with OWASP defaults |
| `webhookkit` | `webhookkit` | Webhook signature verification for Stripe, GoCardless, etc. |
| `barbican` | `barbican` | Axum auth middleware -- extractors, role guards, public path bypass |
| `accessctl` | `accessctl` | RBAC with Cedar policy engine integration |
| `oauth-toolkit` | `oauth-toolkit` | Shared OAuth2/OIDC primitives -- PKCE, CSRF, social login, JWKS |
| `hdwallet` | `multi-chain-wallet` | BIP32/39/44 HD wallet for BTC, ETH, SOL, TRON |

**Resilience layer:**

| Crate | Published Name | Purpose |
|-------|---------------|---------|
| `fetchkit` | `resilient-fetch` | HTTP client with retry, circuit breaker, connection pooling on reqwest |
| `breaker` | `breaker` | Async circuit breaker with state machine and Tower layer |
| `ratelimit` | `throttle-kit` | GCRA rate limiting with in-memory and Redis backends |
| `cachekit` | `cache-pal` | Unified caching -- moka in-memory and Redis with TTL and stale-while-revalidate |
| `retry-backoff` | `loop-retry` | Generic async retry with exponential backoff and jitter |
| `poolkit` | `poolkit` | SQLx connection pooling with health checks and test containers |
| `mailkit` | `mailkit` | Email delivery via SMTP and Resend with template rendering |

**Observability and data layer:**

| Crate | Published Name | Purpose |
|-------|---------------|---------|
| `otel-stack` | `otel-stack` | Unified OpenTelemetry tracing and metrics with OTLP export |
| `eventbus` | `typed-eventbus` | Async typed pub/sub with persistence and wildcard subscriptions |
| `auditlog` | `tamper-audit` | Tamper-evident audit logging with SHA-256 chain |
| `money` | `decimal-money` | CurrencyAmount with Decimal precision and multi-currency FX |
| `tantivy-ext` | `tantivy-helper` | Tantivy wrapper with BM25 ranking, autocomplete, and highlighting |

**Composition crate:**

| Crate | Published Name | Purpose |
|-------|---------------|---------|
| `axum-stack` | `axum-stack` | Full Axum server setup -- health routes, CORS, request ID, shutdown, middleware |

The `forgeyard` Rust template enforces the pattern: `#![forbid(unsafe_code)]`, `#![deny(missing_docs)]`, `thiserror` for errors, no `unwrap()` in library code, criterion benchmarks, and proptest where applicable. Every crate ships with CI, clippy lints (`deny(unwrap_used)`, `deny(panic)`), and release profiles with LTO.

### 5 npm Packages (Pediment Monorepo)

The `pediment` repository is a Turborepo monorepo containing five packages:

**`@pediment/tokens`** -- The CSS-first design token system. Uses Tailwind v4's `@theme` directive to expose design tokens as CSS custom properties. Includes:

- **Spatial Materialism** design system: elevation tiers (5 shadow levels from subtle to dramatic), z-index layers, fluid spacing with `clamp()`, glow effects
- **Amoebic UI** design system: organic border radii (from 6px to pill-shaped), easing curves (`--ease-organic`, `--ease-spring`, `--ease-brutal`), animation duration tiers
- **5 theme variants**: `midnight-navy` (default dark), `tokyo-night`, `arctic-dawn`, `solaris`, and `light`
- Typography scale, brutalist design elements, and keyframe animations

**`@pediment/components`** -- Shared Astro and SolidJS components:

- `BaseLayout.astro` -- Full HTML shell with OG tags, Twitter cards, semantic slots
- `Nav.astro` -- Responsive navigation with link definitions
- `Footer.astro` -- Site footer component
- `ThemeToggle.tsx` -- SolidJS island for theme switching with persistence
- `ErrorBoundary.tsx` -- SolidJS error boundary with fallback UI

**`@pediment/hooks`** -- SolidJS hooks:

- `useTheme` -- Theme state with localStorage persistence
- `useLocalStorage` -- Type-safe localStorage with JSON serialization
- `useMediaQuery` -- Reactive media query matching
- `useReducedMotion` -- Accessibility-aware motion preference detection

**`@pediment/utils`** -- Security headers, SEO helpers, and analytics utilities for Cloudflare Pages.

**`@pediment/starlight`** -- Starlight plugin that integrates pediment tokens into documentation sites, with custom `Head.astro` and `Header.astro` components.

### Forgeyard Templates

The `forgeyard` repository provides four standardized templates:

1. **`rust/`** -- Cargo.toml with pre-configured deps (`errcode`, `otelkit`, `healthkit`), clippy lints, criterion benchmarks, GitHub Actions CI, and the lib/error template files
2. **`astro-solidjs/`** -- Astro + SolidJS + Tailwind v4 frontend with Cloudflare Pages deployment
3. **`starlight/`** -- Astro Starlight documentation site template
4. **`ts-package/`** -- TypeScript package with Vitest testing

A scaffolding script (`scripts/scaffold.sh`) copies templates with variable substitution. Every template includes CI/CD pipelines, linting config, README badge templates, CONTRIBUTING.md, and dual MIT/Apache-2.0 licensing.

## Key Decisions

### Naming: Pediment and Forgeyard

**Pediment** -- The architectural element that sits above a doorway, bearing weight and providing shelter. In our case, it sits above all the web properties, providing consistent design tokens and components. It felt right for something that supports everything below it.

**Forgeyard** -- Where things are forged. The place you go to create new projects with the right materials and patterns already in place. Not a "factory" (too impersonal), not a "scaffold" (too temporary). A forgeyard suggests craftsmanship.

The `*-kit` naming convention for Rust crates (`cachekit`, `tokenkit`, `cryptkit`, etc.) was chosen for discoverability and consistency. It signals "this is a focused, practical toolkit" rather than "this is a framework."

### Architecture: Separate Repos, Not a Monorepo

The 28 Rust crates live in separate repositories, not in a Cargo workspace. This was deliberate:

1. **Independent versioning** -- `errcode` at 0.1.0 doesn't block `tokenkit` from shipping 0.2.0
2. **Independent CI** -- A change to `cryptkit` doesn't trigger builds for `poolkit`
3. **Clean dependency graph** -- Each crate declares exactly what it needs; no hidden internal dependencies
4. **crates.io publishing** -- Every crate is independently publishable and discoverable
5. **Code review focus** -- PRs to `barbican` are about auth middleware, not mixed with rate limiter changes

The tradeoff is more repository management overhead, but `forgeyard` templates and CI standardization minimize the friction.

For the npm side, `pediment` is a Turborepo monorepo because the packages are tightly coupled (tokens define the design language, components consume those tokens, hooks work with those components). Separate repos for closely related npm packages would create more problems than it solves.

The `starlight-sites` project takes the opposite approach -- 46 documentation sites in a single monorepo with shared components, config, fonts, i18n, and utilities under `shared/`. This works because the sites share 90%+ of their configuration and need coordinated updates.

### Testing Strategy

- **Rust crates**: `cargo test` + criterion benchmarks + proptest for security-critical crates (`tokenkit`, `cryptkit`, `salting`). Every crate has at minimum unit tests and integration tests for the public API.
- **npm packages**: Biome for linting, Vitest where applicable. The tokens package is pure CSS so testing is primarily visual verification.
- **CI**: GitHub Actions on every push and PR. Rust jobs run clippy, fmt, test, and bench. JS jobs run biome check, build, and test.

## Results

### 15 Projects Migrated

The shared crates are consumed across the ecosystem:

- **ferro** (73-crate workspace): Uses `errcode`, `otelkit`, `healthkit`, `tokenkit`, `barbican`, `cachekit`, `fetchkit`, `breaker`, `ratelimit`, `poolkit`, `mailkit`, `api-types`, `paginate`, `eventbus`
- **axum-stack**: Composes `healthkit` and `shutdown-kit` into a ready-to-use server setup
- **accessctl**: Integrates `tokenkit` for JWT validation
- **crawlkit/web**: Uses `@pediment/tokens` for documentation site theming
- **crawlkit/dashboard**: Uses `@pediment/tokens` for the monitoring dashboard
- **ferro/docs**: Uses `@pediment/starlight` and `@pediment/tokens` for documentation
- **starlight-sites** (46 sites): Uses shared config that references pediment tokens
- Plus 8 other Rust services consuming the foundation and resilience crates

### ~18,000 Lines Eliminated

By replacing duplicated implementations with shared crates:

- Error handling boilerplate: ~2,000 lines removed across 12 services
- OpenTelemetry setup: ~1,500 lines replaced by `otelkit` and `otel-stack`
- Health check implementations: ~800 lines replaced by `healthkit`
- JWT validation code: ~1,200 lines consolidated into `tokenkit`
- HTTP client retry/circuit breaker: ~2,000 lines replaced by `fetchkit` and `breaker`
- Design tokens and CSS: ~3,000 lines of duplicated CSS replaced by `@pediment/tokens`
- Rate limiting: ~600 lines replaced by `throttle-kit`
- Connection pooling: ~400 lines replaced by `poolkit`
- Auth middleware: ~1,500 lines replaced by `barbican` and `accessctl`
- Config loading: ~800 lines replaced by `envstack`
- Miscellaneous (caching, event bus, audit logging, pagination): ~4,200 lines

### 400+ Tests Across the Ecosystem

The test suite spans:

- 28 Rust crate test suites with unit and integration tests
- Criterion benchmarks on performance-critical crates (cachekit, fetchkit, tokenkit, cryptkit, etc.)
- Proptest property-based tests on security crates (tokenkit, cryptkit, salting, webhookkit, oauth-toolkit, accessctl)
- CI enforcement: every PR must pass clippy, fmt, and test before merge

## Lessons Learned

### What Worked

**1. The `-kit` naming convention was a stroke of luck.** It created instant brand recognition across the Rust ecosystem. When you see `cachekit`, `tokenkit`, `cryptkit`, you know what you're getting. It also made crates.io discovery easier.

**2. forgeyard templates paid for themselves immediately.** The first time I scaffolded a new Rust crate and had CI, benchmarks, clippy lints, and the error module already in place, I saved 30 minutes. By the 10th crate, the ROI was obvious. By the 28th, it was indispensable.

**3. Forcing `#![forbid(unsafe_code)]` and `#![deny(missing_docs)]` from day one was the right call.** It means every crate is safe to use in any context, and every public API is documented without exception. The initial friction was worth it.

**4. Keeping crates small and focused made composition natural.** `barbican` doesn't reimplement JWT validation -- it depends on `tokenkit`. `axum-stack` doesn't implement health checks -- it depends on `healthkit`. The dependency graph is clean because each crate does one thing.

**5. The pediment monorepo approach for npm packages was correct.** Tokens, components, and hooks are so tightly coupled that separating them would create more coordination overhead than the monorepo does. Turborepo handles the build graph cleanly.

### What Didn't Work

**1. Version pinning across separate repos is painful.** When `errcode` bumped from 0.1.0 to 0.2.0 with a breaking change, every downstream crate needed a coordinated update. Without a workspace-level `cargo update`, this meant 10+ separate PRs. A changelog-driven release process with compatibility guarantees would have helped.

**2. The `starlight-sites` monorepo got unwieldy at 46 sites.** Each site needs its own `astro.config.mjs`, content directory, and sometimes unique integrations. The shared infrastructure under `shared/` helps, but build times and contributor onboarding suffer. A middle ground (maybe 3-4 site groups) might be better.

**3. CSS tokens are hard to test programmatically.** The `@pediment/tokens` package is pure CSS with no JavaScript runtime. There's no unit test that can verify "the midnight-navy theme has a readable contrast ratio." Visual regression testing (maybe with Storybook or Chromatic) should have been part of the setup from the start.

**4. Documentation lagged behind implementation.** Many crates got good README documentation but sparse rustdoc comments on internal types. When someone new tries to understand how `fetchkit` composes with `breaker` and `ratelimit`, the learning curve is steeper than it should be.

### Advice for Others

**Start with the shared error type.** Every service needs error handling, and unifying it early forces you to think about your error taxonomy. The RFC 7807 Problem Details format is excellent for API errors and gives you a standard structure to build on.

**Make the template, then make the crate.** If you find yourself copy-pasting boilerplate between projects, stop and create a forgeyard template first. The template pays for itself after 3 uses.

**Keep the dependency graph shallow.** Our crates form a clean DAG: foundation crates at the bottom, security and resilience in the middle, composition crates at the top. No circular dependencies, no diamond problems. This is only possible because each crate has a narrow responsibility.

**Use the monorepo for tightly coupled packages, separate repos for independent ones.** There's no universal answer. Our Rust crates benefit from independent versioning and CI. Our npm packages benefit from shared build orchestration. Know which situation you're in.

**Publish to crates.io / npm even for internal packages.** The discipline of writing a real README, setting proper metadata, and following semver forces better engineering. It also means you can dogfood your own packages and catch issues before your users do.

**Budget for migration.** Building the shared infrastructure was maybe 40% of the total work. The other 60% was migrating existing projects to use it. Every migration required: updating dependencies, refactoring imports, verifying behavior, updating CI, and sometimes dealing with subtle breaking changes. Plan for this.

## What's Next

The infrastructure is stable, but there's always more to build:

- **Visual regression testing** for `@pediment/tokens` themes
- **A compatibility matrix** documenting which crate versions work together
- **More forgeyard templates** (Leptos, Cloudflare Workers, Tauri)
- **A shared `Justfile`** for common development tasks across all repos
- **OpenTelemetry dashboard** that uses the shared crates to monitor itself

---

*If you're managing a multi-repository ecosystem and dealing with the same duplication problems, I hope this gives you a practical roadmap. The specific crate names and design decisions might not match your stack, but the principles -- small focused crates, standardized templates, clean dependency graphs -- scale to any organization size.*

*The code is all open source under MIT/Apache-2.0. Start with [forgeyard](https://github.com/WyattAu/forgeyard) for templates, [pediment](https://github.com/WyattAu/pediment) for web design tokens, and browse the [WyattAu org](https://github.com/WyattAu) for individual crate implementations.*
