Project rules for future Codex runs:

1. Treat [dev/specs.txt](/home/goosnav/Desktop/business/landing-page/dev/specs.txt) as the architecture and acceptance source of truth.
2. Treat [dev/sprints.txt](/home/goosnav/Desktop/business/landing-page/dev/sprints.txt) as the required execution order.
3. Preserve the source layout: `site/` for page shells, `assets/` for shared assets, `docs/` for operational guidance, `tools/` for lightweight automation.
4. Keep the site static and GitHub Pages compatible. Do not add framework runtimes, CMSs, or unnecessary dependencies.
5. Prefer editing `assets/js/config/` for business customization. Do not scatter business data across page shells.
6. Preserve semantic HTML and the dark default enterprise visual language.
7. Keep CSS role-separated: tokens/base in `styles.css`, component styling in `components.css`, small helpers in `utilities.css`, print rules in `print.css`.
8. Keep JavaScript role-separated and explicit. Use the shared `window.SiteTemplate` namespace rather than hidden globals.
9. Quote behavior boundaries:
   - question definitions and rules belong in `assets/js/config/quote-config.js`
   - engine logic belongs in `assets/js/quote-engine.js`
   - UI state and rendering belong in `assets/js/quote-ui.js`
10. Form endpoints belong only in `assets/js/config/contact-config.js`.
11. Scheduler settings belong only in `assets/js/config/scheduler-config.js`.
12. Navigation visibility belongs only in `assets/js/config/nav-config.js`.
13. Maintain safe edit markers:
   - `SAFE TO EDIT`
   - `EDIT WITH CARE`
   - `CORE SYSTEM LOGIC`
14. After meaningful edits, run `node tools/test-site.mjs` and fix failures before stopping.
15. If you must introduce a new file, justify it against the reusable template architecture first.
