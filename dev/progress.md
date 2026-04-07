# PROGRESS TRACKER

This is the canonical, resumable status file for the enterprise static service
site template. Any future AI session must read this file (and the
`AUTHORITATIVE INPUTS` it references) before changing code.

---

## PROJECT SUMMARY

Reusable static service-business website with no framework, no runtime build,
and config-first content. Pages are thin shells under `site/`; shared
behavior lives in `assets/js/`; business content lives in `assets/js/config/`.
A small Node.js script in `tools/build-site.mjs` assembles `dist/` for GitHub
Pages with asset path rewriting. `tools/test-site.mjs` runs file existence,
HTML shell, JS syntax, build, and `vm`-sandboxed contract tests in one shot.

Forms post through Formspree (placeholder endpoints today). Scheduling is a
pluggable Google Calendar handoff (`EXTERNAL_LINK` default, `INLINE_EMBED`
optional). The quote experience is a one-question-per-screen wizard with a
hard lead gate before result reveal and an HTML summary download.

---

## AUTHORITATIVE INPUTS

These files take precedence over anything else in the repo:

- `dev/specs.txt` — architecture, page inventory, content model, accessibility,
  performance, security, acceptance criteria, and the 16 non-negotiable
  implementation rules. Read fully before any structural change.
- `dev/sprints.txt` — execution order across 14 sprints (0–13) plus optional
  post-base sprints A–D and the minimum acceptance gate.
- `AGENTS.md` — pre-existing agent rules (config-first edits, post-edit
  validation via `node tools/test-site.mjs`, etc.).
- `CLAUDE.md` — invariant project rules and continuity instructions; points
  back to this file as the resumable source of truth.

---

## CURRENT STATE

- Baseline repo bedrock is in place (all 10 HTML shells, all 9 shared JS
  files, all 10 config files, all 4 CSS files, both tools, GH Pages workflow,
  10 docs files, branding assets, dist artifact).
- `node tools/test-site.mjs` is GREEN at the start of this session
  (`All static site checks passed.`).
- The dist artifact in `dist/` is fresh and well-formed (asset paths
  rewritten, `.nojekyll` present, all 10 HTML files emitted).
- The implementation is functionally complete for the bedrock spec but has
  meaningful **template-reuse drift** (business copy hardcoded in shared JS)
  and a few **resilience gaps** (engine and renderer functions assume the
  default config schema is present without guarding).

---

## SPRINT STATUS TABLE

Source of truth: `dev/sprints.txt`. Status reflects observed implementation
plus the audit findings below; "complete" means the deliverable exists and
matches the spec for default content; "complete-with-debt" means it works
but carries a finding tracked in OPEN ISSUES.

| #  | Sprint                                       | Status               |
|----|----------------------------------------------|----------------------|
| 0  | Foundation, repo, build/test scaffolding     | complete             |
| 1  | CSS bedrock (tokens, reset, layout)          | complete             |
| 2  | Global shell (header/footer/nav)             | complete             |
| 3  | Config system (10 config modules)            | complete             |
| 4  | Home page (hero, diff, process, CTA strip)   | complete-with-debt   |
| 5  | Services page (tiers, comparison matrix)     | complete-with-debt   |
| 6  | About / Contact / Legal pages                | complete-with-debt   |
| 7  | Quote engine (deterministic, branching)      | complete-with-debt   |
| 8  | Quote UI (one-question-per-screen + lead)    | complete             |
| 9  | Formspree integration                        | complete             |
| 10 | Scheduler integration                        | complete             |
| 11 | SEO / metadata package                       | complete-with-debt   |
| 12 | Accessibility / responsiveness               | complete             |
| 13 | Docs / handoff                               | complete             |
| A  | Sample swap material (examples/*)            | not done             |
| B  | Theme variants                               | not done             |
| C  | Additional locales                           | not done             |
| D  | Optional CMS bridge                          | not done             |

---

## DELIVERABLE STATUS

| Area                                    | State                 |
|-----------------------------------------|-----------------------|
| `dev/progress.md` (this file)           | created               |
| `CLAUDE.md`                             | created (this session)|
| All 10 HTML page shells                 | present, valid        |
| Shared JS namespace `window.SiteTemplate`| live                  |
| All 10 config modules                   | present, populated    |
| `tools/build-site.mjs`                  | working               |
| `tools/test-site.mjs`                   | passing               |
| `dist/`                                 | fresh, valid          |
| `.github/workflows/deploy-pages.yml`    | valid                 |
| All 10 `docs/*.txt`                     | populated             |
| `examples/sample-business-*`            | placeholder only      |

---

## CURRENT TASK LOG

Each task here maps directly to the OPEN ISSUES list. Mark each as complete
when the corresponding fix lands AND `node tools/test-site.mjs` re-passes.

- [x] T0: Establish baseline; verify `node tools/test-site.mjs` passes.
- [x] T1: Author this `dev/progress.md` and `CLAUDE.md`.
- [x] T2: Add resilience guards in `assets/js/quote-engine.js`
  `resolveRecommendedTier` so missing recommendation sub-objects do not throw.
- [x] T3: Add resilience guard in `assets/js/renderers.js` `renderHero` so a
  missing `visualPanel` does not throw.
- [x] T4: Hoist hardcoded section header copy out of `assets/js/renderers.js`
  into `site-config.js` and `services-config.js`. Renderers read from config
  with neutral fallbacks (no business names in shared JS).
- [x] T5: Hoist hardcoded testimonial section headings and quote intro copy
  out of `assets/js/app.js` into config (`site-config.homePage.testimonialsHeader`,
  `services-config.testimonialsHeader`, and read quote intro from
  `quote-config.experience`).
- [x] T6: Hoist 404 page copy from `renderNotFound` into
  `site-config.notFoundPage`.
- [x] T7: Hoist contact form labels and "Send a message" heading out of
  `renderContactPage` into `contact-config.formLabels`.
- [x] T8: Hoist `renderMiscPage` "Hidden placeholder" eyebrow into
  `misc-config`.
- [x] T9: Add contract test assertions in `tools/test-site.mjs` that lock in
  the new config slots so future drift fails the suite.
- [ ] T10: Decide what to do about hardcoded `<title>` and
  `<meta name="description">` in every `site/*.html` head — they are
  immediately overwritten by `assets/js/seo.js`, so they currently exist only
  as no-JS fallbacks. Either remove or harmonize per page. **Backlog**.
- [ ] T11: Make `renderProcess` pick a grid class based on step count instead
  of always using `grid-4`. **Backlog**.
- [ ] T12: Populate `examples/sample-business-a/` and
  `examples/sample-business-b/` with real swap material (post-base Sprint A).
  **Backlog**.

---

## CHANGE LOG

Append-only. Newest first.

### 2026-04-06 — Hardening pass #1 (this session)

- Created canonical `dev/progress.md` (this file).
- Created `CLAUDE.md` with project invariants, run/test workflow, and
  continuity instructions.
- `assets/js/quote-engine.js`: `resolveRecommendedTier` now guards every
  recommendation sub-object access with `|| {}` and falls back to the first
  tier in `tierOrder` when an answer maps to nothing.
- `assets/js/renderers.js`: `renderHero` now omits the visual aside entirely
  when `siteConfig.homePage.hero.visualPanel` is absent.
- `assets/js/renderers.js`: section header copy in `renderDifferentiators`,
  `renderProcess`, `renderServiceSummary`, `renderComparisonMatrix`,
  `renderCtaStrip`, `renderAboutPage`, `renderContactPage`, `renderMiscPage`,
  and `renderNotFound` is now read from config with neutral, brand-free
  fallbacks. The shared JS layer no longer mentions any business name.
- `assets/js/app.js`: `initHomePage` and `initServicesPage` now read
  testimonial section headings from config; `initQuotePage` reads intro copy
  from `quote-config.experience`.
- `assets/js/config/site-config.js`: added `homePage.differentiatorsHeader`,
  `homePage.processHeader`, `homePage.servicesHeader`,
  `homePage.testimonialsHeader`, `homePage.ctaStrip.eyebrow`,
  `aboutPage.engagementModelHeading`, `aboutPage.trustMarkersHeading`,
  `notFoundPage`.
- `assets/js/config/services-config.js`: added `comparisonMatrix.header` and
  `testimonialsHeader`.
- `assets/js/config/contact-config.js`: added `formLabels` block.
- `assets/js/config/misc-config.js`: added `eyebrow` field.
- `tools/test-site.mjs`: added contract assertions that lock in the new
  config slots.
- `node tools/test-site.mjs` re-verified GREEN after each increment.

### Pre-session (Codex baseline, 2026-04-06)

- Initial bedrock implementation: 10 HTML shells, 9 shared JS modules,
  10 config modules, 4 CSS files, both tools, GH Pages workflow, all docs,
  branding assets, and dist artifact. See `docs/CHANGELOG.txt` for the
  pre-session record.

---

## OPEN ISSUES

Severity tags: **CRITICAL** (runtime breakage on default config),
**HIGH** (template-reuse violation: business copy in shared layer),
**MEDIUM** (resilience under non-default configs),
**LOW** (drift / cleanup).

### RESOLVED in this session

- ~~**HIGH** `assets/js/renderers.js:192-194` — `renderDifferentiators`
  hardcodes "Why Northstar" eyebrow and "Built for sober operating
  decisions." heading.~~ (T4)
- ~~**HIGH** `assets/js/renderers.js:219-221` — `renderProcess` hardcodes
  "Process" / "A direct operating sequence."~~ (T4)
- ~~**HIGH** `assets/js/renderers.js:298-300` — `renderServiceSummary`
  hardcodes "Services" / "Three default tiers, built to scale to seven."~~
  (T4)
- ~~**HIGH** `assets/js/renderers.js:341-342` — `renderComparisonMatrix`
  hardcodes "Comparison" / "Service structure at a glance."~~ (T4)
- ~~**HIGH** `assets/js/renderers.js:450` — `renderCtaStrip` hardcodes
  "Next Step" eyebrow.~~ (T4)
- ~~**HIGH** `assets/js/renderers.js:484, 502` — `renderAboutPage`
  hardcodes "Engagement model" and "Trust markers" headings.~~ (T4)
- ~~**HIGH** `assets/js/renderers.js:559-573` — `renderContactPage`
  hardcodes "Send a message" heading and form field labels.~~ (T7)
- ~~**HIGH** `assets/js/renderers.js:632` — `renderMiscPage` hardcodes
  "Hidden placeholder" eyebrow.~~ (T8)
- ~~**HIGH** `assets/js/renderers.js:663-668` — `renderNotFound` hardcodes
  body copy and "Return Home" / "Contact Northstar" buttons.~~ (T6)
- ~~**HIGH** `assets/js/app.js:23-24, 38-39` — testimonial section heading
  and intro text passed as literals from app.js.~~ (T5)
- ~~**HIGH** `assets/js/app.js:97-101` — `initQuotePage` hardcodes the
  quote intro copy instead of using `quote-config.experience`.~~ (T5)
- ~~**MEDIUM** `assets/js/renderers.js:171` — `renderHero` reads
  `hero.visualPanel.heading` without guarding for missing `visualPanel`.~~
  (T3)
- ~~**MEDIUM** `assets/js/quote-engine.js:271-305` — `resolveRecommendedTier`
  does not guard against missing `recommendationModel.*` sub-objects.~~ (T2)

### STILL OPEN

- **LOW** `site/*.html:9` — every page hardcodes a `<title>` (mostly the
  filename, e.g. `<title>Articles</title>`) and a stale
  `<meta name="description" content="Northstar Systems Advisory">`. These
  are immediately overwritten by `assets/js/seo.js`, so under JS they have
  no effect; without JS they are stale duplication. Decide whether to
  remove them entirely (accept that no-JS users get a blank document title)
  or harmonize each page to its `seo-config.pageOverrides` value as a
  no-JS fallback. **T10**.
- **LOW** `assets/js/renderers.js:223` — `renderProcess` always emits
  `class="grid-4"` regardless of step count. Three steps render as a
  4-column grid with one empty cell. Should pick `grid-2` / `grid-3` /
  `grid-4` / `card-grid` based on `steps.length`. **T11**.
- **LOW** `examples/sample-business-a/README.txt`,
  `examples/sample-business-b/README.txt` — both are tiny placeholder
  READMEs (under 220 bytes each) with no actual swap material. The spec
  calls for sample swap material to validate template reuse. This is
  post-base Sprint A. **T12**.

---

## NEXT MODEL HANDOFF

If a future model picks this up cold, do this in order:

1. Read `dev/specs.txt` and `dev/sprints.txt` fully. They are authoritative.
2. Read `CLAUDE.md` for invariants (config-first, namespace, post-edit
   validation, etc.).
3. Read this file (`dev/progress.md`) for the actual current state.
4. Run `node tools/test-site.mjs`. If it is not green, **stop and diagnose
   before changing anything else** — the test runner is the contract gate.
5. Pick the next item off `CURRENT TASK LOG` (look for the first unchecked
   `[ ]` task). The current backlog is T10 (HTML head drift), T11
   (`renderProcess` grid sizing), and T12 (sample swap material).
6. Make changes incrementally. After each meaningful increment, re-run
   `node tools/test-site.mjs` and append a row to `CHANGE LOG` here.
7. Never claim a task is done without re-running the test suite.
8. Never delete work you do not understand. If you find unfamiliar files
   (e.g., a `.env`, an in-progress branch, an unexpected `dev/` artifact),
   investigate before touching them.

### Constraints to preserve

- GitHub Pages compatibility: `tools/build-site.mjs` must continue to emit
  a self-contained `dist/` with `.nojekyll`, no `../assets/` references,
  and `data-asset-root="assets/"` in every HTML file.
- No framework, no bundler, no runtime dependency. Vanilla HTML/CSS/JS only.
- Single explicit namespace: `window.SiteTemplate`.
- Formspree placeholder endpoints (`your-contact-form-id`,
  `your-quote-form-id`) must keep being rejected by `form-handlers.js`
  until a real endpoint is configured.
- Scheduler defaults to `EXTERNAL_LINK` mode. `INLINE_EMBED` is opt-in.
- The 16 non-negotiable implementation rules in `dev/specs.txt` apply at
  all times.
