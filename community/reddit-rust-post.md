Title: "I built 40 shared Rust crates to eliminate duplicated code across 79 repos"

Body:

I've been working on a shared infrastructure ecosystem for the past few months. Here's what I built:

**40 Rust crates** on crates.io covering:
- Authentication: salting, tokenkit, oauth-toolkit, barbican
- Crypto: cryptkit, hdwallet
- Web: axum-stack, webhookkit, healthkit
- Infrastructure: envstack, poolkit, otelkit, shutdown-kit
- Resilience: breaker, throttle-kit, loop-retry, resilient-fetch
- Data: tantivy-helper, cache-pal, decimal-money, api-paginate
- Testing: testkit
- Process: pid-manager

**Key results:**
- ~24,000 lines of duplicated code eliminated
- 1,100+ tests across all crates
- 19 crates with property-based testing (proptest)
- 9 fuzz targets for security-critical code
- 20 crates with criterion benchmarks
- All crates have `#![forbid(unsafe_code)]` and `#![deny(missing_docs)]`

**Also built:**
- pediment - UI framework with 18 SolidJS components
- forgeyard - Project scaffolding CLI

The crates are designed for FAANG/HFT/defence quality - production-grade with comprehensive testing.

GitHub: https://github.com/WyattAu
Crate list: https://crates.io/users/WyattAu