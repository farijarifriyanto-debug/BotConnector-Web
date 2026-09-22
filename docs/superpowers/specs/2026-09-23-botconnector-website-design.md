# BotConnector Website (Pre-Launch) — Design Spec

**Date:** 2026-09-23
**Status:** Approved for planning

## Purpose

A pre-launch marketing + documentation website for the new, goose-based
BotConnector (the product currently being migrated from a custom TUI onto
the upstream `aaif-goose/goose` foundation — see the BotConnector-on-goose
migration work in `C:\Users\farij\Projects\BOTCONNECTOR-Goose`).

This site is **not** for the existing npm-published BotConnector product
(`botconnector-ai`, currently `0.5.0-beta1`, at `C:\Users\farij\Projects\BotConnector`).
That product has its own README and is unaffected by this work.

Because the goose-based product has no public build or release yet, this
site launches in a "coming soon" state: it explains what BotConnector is
becoming, points to the GitHub source, and reserves a documentation
section that stays mostly stubbed until a real release exists to document.

## Non-Goals

- No content for or references to the current npm `botconnector-ai` product.
- No backend, no database, no user accounts, no forms beyond a possible
  static "star us on GitHub" / newsletter link (no working newsletter
  backend — out of scope; link out to an existing service if requested
  later).
- No full documentation content yet — docs section is structural
  scaffolding only, filled in after the goose migration produces a real
  build.
- No custom domain wiring yet. Site deploys to the default GitHub Pages
  URL (`<username>.github.io/BotConnector-Website` or equivalent). The
  existing `botconnector.id` domain (referenced in the old product's
  README) is a known future target but is explicitly deferred — this
  spec does not decide whether the new site reuses it.

## Tech Stack

- **Astro** for the site shell and landing page (static output, minimal
  JS, fast).
- **Starlight** (Astro's official docs theme) for the `/docs` section —
  chosen over VitePress because it shares Astro's component model with
  the landing page (one framework, not two), and over hand-rolled
  HTML/CSS because it gives working nav/search/sidebar for docs for free.
- Plain CSS (Astro's built-in scoped styles), no CSS framework — the site
  is small enough that Tailwind/etc. would be unused-utility bloat.

## Site Structure

```
/                     Landing page (hero, what-is-BotConnector, coming-soon status, GitHub link)
/docs                 Starlight docs root
/docs/overview        Stub: what BotConnector is, links back to landing
/docs/installation     Stub: "not yet released" placeholder
/docs/faq             Stub: a handful of anticipated questions
```

Stub pages must render as real, navigable pages (not 404s or TODO
comments) — each has enough content to not look broken (a paragraph of
real text), but doesn't promise features or dates the migration hasn't
confirmed.

## Content — Landing Page

- Hero: product name "BotConnector", one-line tagline, "Coming soon" badge.
- Short explainer: BotConnector is transitioning onto the goose
  (Agentic AI Foundation) open-source foundation — same idea as today's
  local-first AI workspace, rebuilt on a production-grade agent runtime.
- Link to the GitHub source repo (the goose-based BotConnector repo, once
  it has a public remote — until then, link can point to the current
  private/local work is N/A, so this links to whatever public repo the
  user designates at implementation time; if none exists yet, omit the
  link rather than invent a URL).
- No pricing, no download buttons, no screenshots (none exist yet).

## Deployment

- GitHub Actions workflow (`.github/workflows/deploy.yml`) building the
  Astro site and publishing to GitHub Pages on every push to `main`,
  following the same pattern already validated in this session for the
  goose Windows build (public repo → GitHub Actions is free, no billing
  risk).
- Repo must be public on GitHub for free Actions minutes and free GitHub
  Pages hosting.

## Open Questions (deferred, not blocking)

- Whether `botconnector.id` gets pointed at this site later, and who
  controls DNS for it — out of scope for this spec.
- Final public GitHub repo name/owner for the site — implementer creates
  it under the same account used for the goose fork
  (`farijarifriyanto-debug`) unless told otherwise.

## Testing / Verification

- `npm run build` (or `astro build`) succeeds locally with zero errors.
- `npm run preview` (or equivalent) serves the built site; landing page
  and all three stub docs pages load without console errors.
- GitHub Actions deploy workflow runs green on push to `main` and the
  Pages URL serves the built site.
