# From 60 Repos to 1 Shared Ecosystem: Our Rust Crate Journey

*Published: September 1, 2026 | Author: WyattAu*

---

By mid-2026, the WyattAu GitHub organization had 73 repositories. Inside them, the same patterns kept appearing: error handling with different HTTP status mappings, health check endpoints reimplemented from scratch, JWT validation with subtly different bugs, OpenTelemetry setup copy-pasted with different version pins.

We built 33 shared Rust crates to eliminate the duplication. This post tells the story of what we built, what we learned, and what changed.

## The Problem: Duplication Everywhere

The `ferro` monorepo alone contained 73 internal crates. The duplication was endemic:

**Error handling.** Every service defined its own error type. Some used `thiserror`, some used `anyhow`, some used hand-rolled enums. HTTP status code mappings were inconsistent -- one service returned 400 for validation errors, another returned 422.

**Health checks.** Kubernetes needs liveness, readiness, and startup probes. Every Axum server reimplemented these from scratch, with different response formats and different route structures.

**JWT validation.** Three repositories had three JWT validation implementations. Each had a subtly different bug in token expiry checking. One accepted expired tokens within a 5-minute window. Another didn't check the `exp` claim at all.

**HTTP client resilience.** Retry logic, circuit breakers, and connection pooling were copy-pasted across 4+ codebases. The implementations diverged over time -- one used exponential backoff, another used linear backoff, a third had no backoff at all.

**Design tokens.** Six separate CSS files defined overlapping custom properties. The "primary blue" was different in every project.

## What We Built: 33 Shared Crates

The Rust crates form a layered dependency graph with four tiers.

### Foundation Layer (No WyattAu Dependencies)

These crates have zero internal dependencies. They're the bedrock everything else builds on:

| Crate | Purpose |
|-------|---------|
| `errcode` | Structured error handling with derive macros, HTTP status mapping, RFC 7807 Problem Details |
| `otelkit` | OpenTelemetry, OTLP, and Sentry initialization |
| `healthkit` | Kubernetes/Docker health check endpoints |
| `envstack` | Layered config from env vars, TOML, and CLI args |
| `shared-state` | Readiness gates, TTL caches, shared counters |
| `graceful` | Graceful shutdown with signal handling and RAII cleanup guards |
| `api-types` | Standard API response types (Success, Error, List) with OpenAPI derives |
| `paginate` | Offset and cursor-based pagination types |

### Security Layer

| Crate | Purpose |
|-------|---------|
| `tokenkit` | Type-safe JWT encode/decode with key rotation and revocation |
| `cryptkit` | HMAC-SHA256, AES-GCM, constant-time comparison, secure random |
| `salting` | Opinionated Argon2id password hashing with OWASP defaults |
| `webhookkit` | Webhook signature verification for Stripe, GoCardless, etc. |
| `barbican` | Axum auth middleware -- extractors, role guards, public path bypass |
| `accessctl` | RBAC with Cedar policy engine integration |
| `oauth-toolkit` | Shared OAuth2/OIDC primitives -- PKCE, CSRF, social login, JWKS |
| `hdwallet` | BIP32/39/44 HD wallet for BTC, ETH, SOL, TRON |

### Resilience Layer

| Crate | Purpose |
|-------|---------|
| `fetchkit` | HTTP client with retry, circuit breaker, connection pooling on reqwest |
| `breaker` | Async circuit breaker with state machine and Tower layer |
| `ratelimit` | GCRA rate limiting with in-memory and Redis backends |
| `cachekit` | Unified caching -- moka in-memory and Redis with TTL and stale-while-revalidate |
| `retry-backoff` | Generic async retry with exponential backoff and jitter |
| `poolkit` | SQLx connection pooling with health checks and test containers |
| `mailkit` | Email delivery via SMTP and Resend with template rendering |

### Composition Layer

| Crate | Purpose |
|-------|---------|
| `otel-stack` | Unified OpenTelemetry tracing and metrics with OTLP export |
| `eventbus` | Async typed pub/sub with persistence and wildcard subscriptions |
| `auditlog` | Tamper-evident audit logging with SHA-256 chain |
| `money` | CurrencyAmount with Decimal precision and multi-currency FX |
| `tantivy-ext` | Tantivy wrapper with BM25 ranking, autocomplete, and highlighting |
| `axum-stack` | Full Axum server setup -- health routes, CORS, request ID, shutdown, middleware |

## Architecture Decisions

### Separate Repos, Not a Monorepo

Each Rust crate lives in its own repository. This was deliberate:

1. **Independent versioning** -- `errcode` at 0.1.0 doesn't block `tokenkit` from shipping 0.2.0
2. **Independent CI** -- A change to `cryptkit` doesn't trigger builds for `poolkit`
3. **Clean dependency graph** -- Each crate declares exactly what it needs
4. **crates.io publishing** -- Every crate is independently publishable and discoverable
5. **Focused code review** -- PRs to `barbican` are about auth middleware, not mixed with rate limiter changes

The tradeoff is more repository management overhead, but forgeyard templates and CI standardization minimize the friction.

### The `-kit` Naming Convention

Crates like `cachekit`, `tokenkit`, `cryptkit`, `fetchkit`, `poolkit`, `mailkit` follow a consistent naming pattern. This wasn't planned -- it emerged from the first few crates and became a convention. The benefits:

- **Instant discoverability** on crates.io
- **Clear signal** that a crate is a focused, practical toolkit
- **Consistency** across the ecosystem

### forgeyard Templates

The `forgeyard` repository provides standardized Rust templates with:
- `#![forbid(unsafe_code)]` and `#![deny(missing_docs)]` enforced from day one
- `thiserror` for errors, no `unwrap()` in library code
- Criterion benchmarks pre-configured
- Clippy lints: `deny(unwrap_used)`, `deny(panic)`
- GitHub Actions CI
- Release profiles with LTO

Every new crate starts from a forgeyard template. The first scaffold saves 30 minutes. By the 28th crate, it's indispensable.

## Example: How `fetchkit` Composes with `breaker` and `ratelimit`

`fetchkit` doesn't implement retry logic from scratch. It composes with `retry-backoff` for retry, `breaker` for circuit breaking, and `ratelimit` for throttling:

```rust
use fetchkit::Client;
use breaker::CircuitBreaker;
use ratelimit::Throttle;

let breaker = CircuitBreaker::new(5, Duration::from_secs(30));
let throttle = Throttle::new(100, Duration::from_secs(1));

let client = Client::builder()
    .with_circuit_breaker(breaker)
    .with_rate_limit(throttle)
    .with_retry(3, Duration::from_millis(100))
    .build();

let response = client.get("https://api.example.com/data").send().await?;
```

Each concern is handled by a focused crate. `fetchkit` doesn't know about circuit breaker internals -- it just calls the trait methods. `breaker` doesn't know about HTTP -- it just tracks failures and opens/closes. The composition is clean because each crate has a narrow responsibility.

## Migration Results

### Lines Eliminated

| Category | Lines Removed | Replaced By |
|----------|--------------|-------------|
| Error handling boilerplate | ~2,000 | `errcode` |
| OpenTelemetry setup | ~1,500 | `otelkit`, `otel-stack` |
| Health check implementations | ~800 | `healthkit` |
| JWT validation code | ~1,200 | `tokenkit` |
| HTTP client retry/circuit breaker | ~2,000 | `fetchkit`, `breaker` |
| Design tokens and CSS | ~3,000 | `@pediment/tokens` |
| Rate limiting | ~600 | `ratelimit` |
| Connection pooling | ~400 | `poolkit` |
| Auth middleware | ~1,500 | `barbican`, `accessctl` |
| Config loading | ~800 | `envstack` |
| Miscellaneous | ~4,200 | Other crates |
| **Total** | **~18,000** | |

### Test Coverage

- 28 Rust crate test suites with unit and integration tests
- Criterion benchmarks on performance-critical crates (cachekit, fetchkit, tokenkit, cryptkit)
- Proptest property-based tests on security crates (tokenkit, cryptkit, salting, webhookkit)
- CI enforcement: every PR must pass clippy, fmt, and test before merge
- 400+ tests across the entire ecosystem

### Projects Migrated

15 projects now consume the shared crates:

- **ferro** (73-crate workspace): Uses 14 shared crates
- **axum-stack**: Composes healthkit and shutdown-kit
- **accessctl**: Integrates tokenkit for JWT validation
- **crawlkit/web** and **crawlkit/dashboard**: Use `@pediment/tokens`
- **ferro/docs**: Uses `@pediment/starlight` and `@pediment/tokens`
- **starlight-sites** (46 sites): Uses shared config referencing pediment tokens
- Plus 8 other Rust services

## What We Learned

### What Worked

**1. Start with the shared error type.** Every service needs error handling, and unifying it early forces you to think about your error taxonomy. RFC 7807 Problem Details gives you a standard structure.

**2. Make the template, then make the crate.** If you copy-paste boilerplate between projects, stop and create a forgeyard template first. The template pays for itself after 3 uses.

**3. Keep the dependency graph shallow.** Our crates form a clean DAG: foundation at the bottom, security and resilience in the middle, composition at the top. No circular dependencies, no diamond problems.

**4. Forcing `#![forbid(unsafe_code)]` from day one.** It means every crate is safe to use in any context. The initial friction was worth it.

**5. Publish to crates.io even for internal packages.** The discipline of writing a real README, setting proper metadata, and following semver forces better engineering.

### What Didn't Work

**1. Version pinning across separate repos is painful.** When `errcode` bumped from 0.1.0 to 0.2.0 with a breaking change, every downstream crate needed coordinated updates. Without a workspace-level `cargo update`, this meant 10+ separate PRs.

**2. CSS tokens are hard to test programmatically.** The `@pediment/tokens` package is pure CSS. There's no unit test that can verify "the midnight-navy theme has a readable contrast ratio." Visual regression testing should have been part of the setup.

**3. Documentation lagged behind implementation.** Many crates got good README documentation but sparse rustdoc comments on internal types. The learning curve for composition is steeper than it should be.

## Advice for Others

**Start small.** Don't try to build 33 crates at once. Start with the error type, then health checks, then JWT validation. Each crate that gets adopted builds momentum.

**Budget for migration.** Building the shared infrastructure was 40% of the work. The other 60% was migrating existing projects. Every migration requires updating dependencies, refactoring imports, verifying behavior, and updating CI.

**Use the monorepo for tightly coupled packages, separate repos for independent ones.** Our Rust crates benefit from independent versioning. Our npm tokens/components/hooks benefit from shared build orchestration. Know which situation you're in.

**Keep crates small and focused.** `barbican` doesn't reimplement JWT validation -- it depends on `tokenkit`. `axum-stack` doesn't implement health checks -- it depends on `healthkit`. The dependency graph is clean because each crate does one thing.

## What's Next

- Visual regression testing for `@pediment/tokens` themes
- A compatibility matrix documenting which crate versions work together
- More forgeyard templates (Leptos, Cloudflare Workers, Tauri)
- A shared `Justfile` for common development tasks across all repos

## Links

- [GitHub: WyattAu/pediment](https://github.com/WyattAu/pediment)
- [GitHub: WyattAu/forgeyard](https://github.com/WyattAu/forgeyard)
- [crates.io: WyattAu](https://crates.io/users/WyattAu)
- [Previous: Migrating from Tailwind CSS to Pediment](./2026-09-01-migrating-tailwind-to-pediment.md)
- [First post: Building Shared Infrastructure for 73 Repositories](./2026-08-31-building-shared-infrastructure.md)

---

*The code is all open source under MIT/Apache-2.0. Start with forgeyard for templates, pediment for web design tokens, and browse the WyattAu org for individual crate implementations.*
