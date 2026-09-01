# Migration Checklist Template

A systematic checklist for migrating dependencies or functionality across crates.

## Pre-Migration

- [ ] Identify all crates that use the target functionality
- [ ] Read the target crate's public API (lib.rs exports)
- [ ] Document current function signatures being called
- [ ] Check for version compatibility (edition, MSRV)
- [ ] Search for all import paths (`use crate::...`) referencing old module
- [ ] Identify wrapper types used (Zeroizing, Arc, Box, Option, etc.)
- [ ] Note any `pub use` re-exports that downstream crates depend on

## During Migration

- [ ] Update Cargo.toml dependencies (add new, remove old)
- [ ] Update ALL `use` import paths (not just the first one found)
- [ ] Verify function signatures match (argument count, types, return types)
- [ ] Handle type wrapper mismatches (e.g., Zeroizing<String> vs String)
- [ ] Update pub mod re-exports in lib.rs if new modules are added
- [ ] Check for ambiguous module names (file vs directory conflicts)
- [ ] Verify trait implementations match new API expectations
- [ ] Update any `cfg` attributes or feature flags tied to old crate

## Post-Migration

- [ ] Run `cargo check` (not just `cargo build` — faster feedback)
- [ ] Run `cargo clippy -- -D warnings`
- [ ] Run full test suite
- [ ] Verify no unwrap() in library code
- [ ] Check for unused imports (cargo clippy warns about these)
- [ ] Verify compilation of all workspace members
- [ ] Confirm old crate is fully removed from Cargo.toml and lock file
- [ ] Run `cargo update` to regenerate lock file if needed

## Common Pitfalls

1. **Partial migration**: Updating one file but not others that use the same import
2. **Type mismatches**: Wrapper types (Zeroizing, Arc, Box) not matching expected signatures
3. **Module ambiguity**: Both `hooks.rs` and `hooks/mod.rs` existing
4. **Stale callers**: Old function calls not updated to new signatures
5. **Missing re-exports**: New modules in lib.rs not declared as `pub mod`
6. **Feature flag drift**: Old crate features not disabled in Cargo.toml
7. **Downstream breakage**: Public API changes that affect dependent crates
8. **Lock file conflicts**: Stale Cargo.lock entries after dependency removal

## Verification Commands

```bash
# Quick feedback loop
cargo check --workspace

# Linting
cargo clippy --workspace -- -D warnings

# Full test suite
cargo test --workspace

# Format check
cargo fmt --all -- --check

# Verify lock file is clean
cargo generate-lockfile --dry-run
```

## Migration Script Template

For larger migrations, script the repetitive changes:

```bash
#!/bin/bash
set -e

echo "Updating imports..."
find . -name "*.rs" -exec sed -i 's/old_module::/new_module::/g' {} +

echo "Checking compilation..."
cargo check --workspace

echo "Running clippy..."
cargo clippy --workspace -- -D warnings

echo "Running tests..."
cargo test --workspace
```
