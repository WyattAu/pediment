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

## starlight family — naming decisions required BEFORE publish

Registry scan (2026-09):

| Local package | npm name status | Decision |
|---|---|---|
| starlight-katex | **SQUATTED** — `starlight-katex@0.0.4` (stereobooster, real Starlight plugin) | Do **not** fight the name. Republish as **`@wyatt/starlight-katex`** or pick a distinct name (e.g. `starlight-katex-plus`). Requires updating the plugin's `name` + docs before publishing |
| starlight-progress | **SQUATTED** — `starlight-progress@1.0.0` (unrelated progress-bar lib) | Same: **`@wyatt/starlight-progress`** or rename |
| starlight-content-guard | FREE | Publish as-is |
| starlight-interactive-islands | FREE | Publish as-is |
| starlight-cross-domain-sync | FREE | Publish as-is |
| starlight-multi-site | FREE | Publish as-is |
| starlight-dse-test | FREE but **internal-test name** | Keep private — do not publish |
| starlight-sites | `private: true` | Intentionally unpublished, keep |
| @wyatt/starlight-kit | Scoped, publishable **only if the `@wyatt` scope is registered** on npmjs.com (site action, one-time) | Register scope if adopting scoped naming |

**Recommendation:** register the `@wyatt` scope once, publish the squatted two
under scope, the four free ones unscoped, skip `dse-test`/`sites`. Suite
landing page can then link all of them + pediment.

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

**2. Publish the starlight family** (only after the naming decisions in the
table above are executed — do not publish `starlight-katex` /
`starlight-progress` as-is, skip `dse-test`/`sites`):

```bash
# free as-is, in separate checkouts:
(cd ../starlight-content-guard       && npm publish --access public)
(cd ../starlight-cross-domain-sync   && npm publish --access public)
(cd ../starlight-multi-site          && npm publish --access public)   # after build: dist/ is a files entry
(cd ../starlight-interactive-islands && npm publish --access public)
# squatted two: publish as @wyatt/starlight-katex and @wyatt/starlight-progress
# AFTER registering the @wyatt scope on npmjs.com
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
