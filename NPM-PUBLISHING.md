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
