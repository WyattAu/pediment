# npm Publishing — Status & Decisions (pediment + starlight families)

## Blocker (single)

Everything below is ready except **npm 2FA**: `npm publish` requires a 6-digit
authenticator OTP per publish (automation tokens do not cover 2FA-protected
accounts). Run interactively:

```bash
npm login                      # + OTP
# pediment family (all at 1.0.0, registry-ready)
for p in tokens components hooks utils starlight; do
  (cd packages/$p && npm publish --access public)
done
# starlight family (see naming decisions below first)
```

## pediment family — no decisions needed

| Package | Version | Status |
|---|---|---|
| pediment-tokens | 1.0.0 | name free, publish as-is |
| pediment-components | 1.0.0 | name free, publish as-is |
| pediment-hooks | 1.0.0 | name free, publish as-is |
| pediment-utils | 1.0.0 | name free, publish as-is |
| pediment-starlight | 1.0.0 | name free, publish as-is |

## starlight family — naming decisions (DECIDED 2026-09-09)

All six plugins are published under the **`@wyatt` scope** to avoid every
possible npm name collision (the audit found `starlight-katex` and
`starlight-progress` squatted by unrelated crates; scoping all six keeps the
suite consistent). The `name` fields, READMEs, and MIT LICENSEs are already
updated in each repo and pushed.

| Local package | npm name | Decision |
|---|---|---|
| starlight-content-guard | `@wyatt/starlight-content-guard` | Renamed, publishable (build + tests pass) |
| starlight-cross-domain-sync | `@wyatt/starlight-cross-domain-sync` | Renamed, publishable (tests pass) |
| starlight-interactive-islands | `@wyatt/starlight-interactive-islands` | Renamed, publishable (tests pass) |
| starlight-katex | `@wyatt/starlight-katex` | Renamed (unscoped name squatted), publishable |
| starlight-multi-site | `@wyatt/starlight-multi-site` | Renamed; build fixed (`tsc -p tsconfig.build.json` emits `dist/index.js`), publishable |
| starlight-progress | `@wyatt/starlight-progress` | Renamed (unscoped name squatted), publishable |
| starlight-dse-test | — | Keep private — do not publish |
| starlight-sites | `private: true` | Intentionally unpublished, keep |

**One remaining site action:** the `@wyatt` scope must be registered on
npmjs.com (one-time) before any `@wyatt/*` publish succeeds. `@wyatt/starlight-kit`
shares the scope.

## Launch sequence

Run from the repo root, in order. Package audit 2026-09-05: all five pediment
packages have `files` matching their `exports` targets (source-distributed, no
build step) and resolve correctly; starlight family is clean after adding the
missing `files` field to `starlight-interactive-islands`.

**0. Preconditions**

```bash
npm whoami                        # confirm identity; else step 1
npm login                         # + 6-digit authenticator OTP (the blocker above)
```

**1. Publish the pediment family (unscoped, 1.0.0)**

```bash
for p in tokens components hooks utils starlight; do
  (cd packages/$p && npm publish --access public)
done
```

**2. Publish the starlight family** (all six renamed to the `@wyatt` scope —
decisions executed above; do not publish `dse-test`/`sites`):

```bash
# precondition: @wyatt scope registered on npmjs.com
(cd ../starlight-content-guard       && npm run build && npm publish --access public)
(cd ../starlight-cross-domain-sync   && npm publish --access public)
(cd ../starlight-multi-site          && npm run build && npm publish --access public)   # tsc -p tsconfig.build.json -> dist/
(cd ../starlight-interactive-islands && npm publish --access public)
(cd ../starlight-katex               && npm publish --access public)
(cd ../starlight-progress            && npm publish --access public)
```

**3. Post-publish verification**

```bash
for p in tokens components hooks utils starlight; do npm view pediment-$p version; done
# expect: 1.0.0 ×5
npm view pediment-components dist.tarball   # sanity: tarball URL
npm pack --dry-run packages/components      # local: confirms file list matches files field
```

Also spot-check one install in a scratch dir:

```bash
cd /tmp && npm init -y >/dev/null && npm i pediment-tokens && ls node_modules/pediment-tokens/src
```

**4. crdt-demo / HN tie-in**

The launch posts (see `community/` — HN, Reddit, awesome-lists) must link the
**live demo URL**, not a repo-only CTA. Deploy first (see
`../crdt-demo/DEPLOY.md` — Fly.io `fly deploy` is the fastest path, Render
blueprint as alternative), confirm the health check:

```bash
curl -s -o /dev/null -w '%{http_code}' https://crdt-demo.fly.dev/   # expect 200
```

then update every launch post to include the demo link (open-in-two-tabs
collaborative editing is the hook — lead with it). Sequence: **deploy demo →
verify 200 → publish packages → update posts → submit**.
