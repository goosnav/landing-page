# CLAUDE.md

Project-level invariants and continuity rules for any AI session working on
this repository. Read this file before making any change.

---

## Continuity (read this first)

The canonical, resumable status of this project lives in
`dev/progress.md`. Always read it before changing code so you understand:

- the current sprint and the actual work in flight
- which open issues are tracked
- what was changed in the last session
- what must stay invariant

After every meaningful change, append a row to the `CHANGE LOG` section in
`dev/progress.md` and update any tasks under `CURRENT TASK LOG`.

The authoritative source for architecture and acceptance criteria is
`dev/specs.txt`. The execution order is `dev/sprints.txt`. Both take
precedence over anything in this file.

---

## What this project is

A reusable, framework-free static service-business website template:

- 10 page shells under `site/`
- shared behavior in `assets/js/` (single namespace `window.SiteTemplate`)
- business content in `assets/js/config/`
- design system in `assets/css/`
- assembled to `dist/` by `tools/build-site.mjs` for GitHub Pages
- validated by `tools/test-site.mjs`
- forms via Formspree, scheduling via Google Calendar handoff

There is **no framework, no bundler, no runtime dependency**. Vanilla
HTML/CSS/JS only.

---

## Run, build, test

From the repo root:

```sh
node tools/test-site.mjs        # contract gate — must be green before commit
node tools/build-site.mjs       # rebuild dist/ for GitHub Pages
python3 -m http.server --directory dist 8080   # local preview
```

`tools/test-site.mjs` runs:

1. Required-file existence checks
2. HTML shell-structure checks (skip-link, `data-site-header`,
   `main#main-content`, `data-site-footer`)
3. `node --check` syntax checks for every shared JS file and both tools
4. A full `tools/build-site.mjs` build into `dist/` and an output check
   (no `../assets/` references, `data-asset-root="assets/"` rewritten)
5. `vm`-sandboxed contract tests against config + quote engine + forms +
   scheduler

If this script fails, **stop and diagnose before changing anything else**.

---

## Invariants (do not break)

These rules are non-negotiable. They mirror `dev/specs.txt` and
`AGENTS.md`; if any of those documents conflict, those documents win.

### Architecture

1. **Config-first.** Business content (copy, labels, headings, links,
   pricing, branding strings) belongs in `assets/js/config/*.js`. Shared
   JS (`assets/js/*.js`) must not contain business names, brand-specific
   copy, or hardcoded section headings. Renderers read from config and
   fall back to brand-neutral defaults.
2. **Single namespace.** All shared JS attaches to `window.SiteTemplate`.
   No other globals.
3. **No bundler / no framework.** No build-time templating, no NPM runtime
   dependency, no JSX, no TS source files. Plain `<script>` tags only.
4. **HTML shells stay thin.** `site/*.html` files contain only the
   structural shell, the section render targets (data-attributes), and
   the script tags. Business copy must not be hardcoded in HTML.
5. **Build is a copy step.** `tools/build-site.mjs` rewrites
   `../assets/` → `assets/` and the `data-asset-root` attribute, copies
   shells into `dist/`, and writes `dist/.nojekyll`. It must remain
   zero-dependency.
6. **GitHub Pages compatibility.** The `dist/` artifact must stay
   self-contained. The Pages workflow at
   `.github/workflows/deploy-pages.yml` is the only deploy path.

### Content layers

7. **CSS roles.** `styles.css` = tokens/reset/layout/typography;
   `components.css` = nav/buttons/cards/forms/quote surfaces/footer;
   `utilities.css` = small helper set only; `print.css` = print-friendly
   quote summary. Do not move responsibilities across files.
8. **Service tiers.** Visible service tier count must stay between 3 and 7.
   Allowed `priceMode` values: `SHOW_PRICE`, `STARTING_AT`,
   `QUOTE_REQUIRED`, `CONTACT_SALES`. Allowed `ctaType` values:
   `GO_TO_QUOTE`, `GO_TO_CONTACT`, `GO_TO_CUSTOM_URL`, `NO_CTA`.
9. **Hero CTA count.** Must stay between 1 and 3.
10. **Testimonials.** At least one rich (`simplifiedMode: false`) and one
    simple (`simplifiedMode: true`) example must exist while the template
    is in template form, so the renderer keeps exercising both branches.
11. **Articles and Misc.** Hidden from public nav by default
    (`visible: false`). Privacy and Terms remain footer-only by default
    (`visible: false`, `footerVisible: true`).

### Quote engine

12. **Branching lives in `quote-config.js`.** Do not move branching
    decisions, recommendation thresholds, or estimate ranges into
    `quote-engine.js` or `quote-ui.js`.
13. **State pruning.** Changing an upstream answer must prune downstream
    answers that became unreachable. The contract test in
    `tools/test-site.mjs` exercises this; do not weaken it.
14. **Hard lead gate.** The result must not be revealed until the lead
    gate (name OR company, email OR phone) validates and the Formspree
    submission resolves. `quote-ui.js` already encodes this — do not
    bypass it.

### Forms and scheduler

15. **Placeholder rejection.** `assets/js/form-handlers.js`
    `isPlaceholderEndpoint` must continue to reject the placeholder
    Formspree endpoints (`your-contact-form-id`, `your-quote-form-id`).
    Do not silence the rejection in test or runtime code; replace the
    endpoints in `contact-config.js` instead.
16. **Scheduler default.** `scheduler-config.js` defaults to
    `mode: "EXTERNAL_LINK"`. `INLINE_EMBED` is opt-in and requires
    trusted embed HTML.

### Editing scope

17. **Edit config first.** If a customization can be done in config, do
    it there. Only edit shared JS or HTML when the change is structural
    or behavioral, not content.
18. **Run the test suite after every meaningful change.** Never claim a
    change works without re-running `node tools/test-site.mjs`.

---

## Where things live

| Concern                         | File or directory                                  |
|---------------------------------|----------------------------------------------------|
| Spec / acceptance criteria      | `dev/specs.txt`                                    |
| Sprint execution order          | `dev/sprints.txt`                                  |
| Resumable status                | `dev/progress.md`                                  |
| Page shells                     | `site/*.html`                                      |
| Shared JS                       | `assets/js/*.js`                                   |
| Business content                | `assets/js/config/*.js`                            |
| Design system                   | `assets/css/*.css`                                 |
| Branding assets                 | `assets/img/branding/`                             |
| Build script                    | `tools/build-site.mjs`                             |
| Test runner                     | `tools/test-site.mjs`                              |
| GitHub Pages workflow           | `.github/workflows/deploy-pages.yml`               |
| Operator docs                   | `docs/*.txt`                                       |
| Sample swap material (planned)  | `examples/sample-business-*` (placeholder today)   |

---

## When unsure

- If a change is structural, re-read the relevant section of
  `dev/specs.txt` first.
- If the request is content-only, look for the matching field in
  `assets/js/config/*.js` before touching shared JS.
- If a test fails after a change, diagnose the root cause; do not edit
  the test to make it pass unless the spec changed.
- If you find unexpected files (e.g., a `.env`, an in-progress branch,
  unfamiliar artifacts), investigate before deleting or overwriting them.
