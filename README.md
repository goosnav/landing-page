# Enterprise Static Service Site Template

Reusable static website bedrock for service businesses. The source of
truth for scope and sequencing lives in [dev/specs.txt]
and [dev/sprints.txt]

The site is intentionally low-bloat:

- static multi-page HTML
- vanilla CSS and JavaScript only
- GitHub Pages compatible
- Formspree-ready contact and quote lead handling
- Google Calendar scheduler integration
- config-first business content model

## Quick Start

1. Open [site/index.html] directly for source preview, or build the publishable artifact with `node tools/build-site.mjs`.
2. Run `node tools/test-site.mjs` after every meaningful change.
3. Edit business content in `assets/js/config/` before touching structural HTML.
4. Review `docs/` before deployment or external-service setup.

## Working Directories

- `site/`: source HTML shells
- `assets/`: shared CSS, JS, config, and images
- `docs/`: operational template documentation
- `tools/`: zero-dependency build and validation scripts
- `examples/`: adaptation notes for future sample businesses

## Local Commands

```bash
node tools/build-site.mjs
node tools/test-site.mjs
python3 -m http.server --directory dist 8080
```

`build-site.mjs` exists only because GitHub Pages requires published
HTML at the artifact root, while the source-of-truth repo structure
keeps page shells under `site/`.
