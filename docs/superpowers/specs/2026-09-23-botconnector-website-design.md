# BotConnector Website — Design Spec

**Date:** 2026-09-23 (revised)
**Status:** Approved for planning

## Purpose

A production-quality marketing + documentation website for the new,
goose-based BotConnector (the product currently being migrated from a
custom TUI onto the upstream `aaif-goose/goose` foundation — see the
BotConnector-on-goose migration work in
`C:\Users\farij\Projects\BOTCONNECTOR-Goose`).

This site is **not** for the existing npm-published BotConnector product
(`botconnector-ai`, currently `0.5.0-beta1`, at
`C:\Users\farij\Projects\BotConnector`). That product has its own README
and is unaffected by this work.

**Revision note:** the first draft of this spec scoped a minimal
"coming soon" MVP. The user explicitly rejected that — the site must be
built and presented at production quality (design, copy, structure,
engineering), not as a stub. The one constraint that doesn't change:
the goose-based product genuinely has no public release yet, so the site
must not fabricate a working download that doesn't exist. See
"Download / Get Started behavior" below for how both are satisfied
together.

## Non-Goals

- No content for or references to the current npm `botconnector-ai` product.
- No backend, no database, no user accounts. A newsletter/subscribe form
  is out of scope unless requested later — link out to an existing
  service rather than build one.
- No fabricated download artifacts, install instructions for features
  that don't exist yet, or screenshots of UI that hasn't been built —
  production polish applies to execution quality, not to inventing
  product state that isn't real.

## Visual / Design Bar

Reference quality level: sites like linear.app, vercel.com, raycast.com —
strong typography, confident hero section, generous whitespace, a real
design system (consistent spacing scale, color tokens, component reuse),
not a default-template look. No "coming soon" badge or draft-looking
banner — the site should read as a confident, finished product site.
Dark-mode support expected (this class of reference site typically ships
it, and Astro/Starlight support it natively).

Required, not optional, for every page:

- Responsive layout (mobile through desktop).
- Accessibility: semantic HTML, sufficient color contrast, keyboard
  navigable, alt text on all images.
- Basic SEO: per-page `<title>`/meta description, Open Graph tags, a
  sitemap (Astro's built-in sitemap integration).

## Tech Stack

- **Astro** for the site shell and marketing pages (static output,
  minimal JS, fast).
- **Starlight** (Astro's official docs theme) for the `/docs` section —
  chosen over VitePress because it shares Astro's component model with
  the marketing pages (one framework, not two), and over hand-rolled
  HTML/CSS because it gives working nav/search/sidebar for docs for free.
- Plain CSS (Astro's scoped styles) with a small shared design-tokens
  file (spacing/color/type scale) — not a utility framework like
  Tailwind; the page count doesn't justify that dependency, but an
  ad-hoc, inconsistent style-per-component is what the "design system"
  requirement above rules out.

## Site Structure

```
/                     Home (hero, what-is-BotConnector, key capabilities, CTA)
/features             Feature breakdown (expands on home's highlights)
/about                What BotConnector is, the goose foundation, why the migration
/blog                 Changelog/blog index (empty-but-real list; first real post written
                       at implementation time — see Content Sourcing below, not left as a stub)
/blog/[slug]           Individual post/changelog entry template
/docs                 Starlight docs root
/docs/overview        What BotConnector is, how it relates to goose
/docs/installation     Real instructions once available; until then, honest
                       "not yet released — track progress on GitHub" content
                       (not a broken promise, not empty either)
/docs/faq             Real anticipated questions and answers
/download             Download / Get Started page — see below
```

Every page listed must be fully built with real content at
implementation time — none are placeholders to fill in "later."

## Content Sourcing

Copy for Home/Features/About must be written from what's actually known
about BotConnector's direction (its local-first AI workspace positioning,
the goose foundation migration, the product decisions already made in
this session — CLI + desktop app, MCP/tool support, provider flexibility)
rather than generic SaaS boilerplate. The implementer should treat
copywriting as a real task, not filler text.

The blog/changelog starts with one genuine entry: an announcement post
about the migration to the goose foundation (this is real, newsworthy,
and already true) — not a "Lorem ipsum" placeholder post.

## Download / Get Started Behavior

- The `/download` page and any "Download" / "Get Started" CTA link to
  the **real GitHub Releases page** of the goose-based BotConnector's
  public repository (once that repo exists publicly — implementer
  creates it under `farijarifriyanto-debug` if one doesn't already
  exist by the time this is implemented).
- If there are zero releases yet, GitHub's own Releases page communicates
  that natively — the site does not need to (and must not) claim a
  version number, file size, or platform support that doesn't exist.
- The page framing is forward-looking and confident ("Get BotConnector"
  / "Follow development on GitHub") rather than apologetic — this
  satisfies "no coming-soon badge" without lying about availability.

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
- Final public GitHub repo name/owner for the goose-based BotConnector
  product repo (needed for the `/download` CTA target) — implementer
  creates or confirms it under `farijarifriyanto-debug` unless told
  otherwise.

## Testing / Verification

- `npm run build` (or `astro build`) succeeds locally with zero errors.
- `npm run preview` (or equivalent) serves the built site; every page in
  Site Structure loads without console errors, at both mobile and
  desktop widths.
- Lighthouse (or equivalent) accessibility and SEO scores are checked,
  not assumed — no page ships with obvious a11y violations (missing alt
  text, insufficient contrast, unlabeled interactive elements).
- GitHub Actions deploy workflow runs green on push to `main` and the
  Pages URL serves the built site.
