# BotConnector Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a production-quality marketing + docs website for the goose-based BotConnector, with every page fully built (no stubs), a real design system, and an honest, working "Get BotConnector" CTA.

**Architecture:** A single Astro project. Marketing pages (`/`, `/features`, `/about`, `/download`, `/blog`) are hand-built `.astro` pages sharing one `BaseLayout` + a small component set. The `/docs` section is the official Starlight integration, content-collection-driven, nested under `src/content/docs/docs/**` so its routes land at `/docs/*` alongside the marketing pages. Deployed as a static site to GitHub Pages via GitHub Actions.

**Tech Stack:** Astro (static output), `@astrojs/starlight`, `@astrojs/sitemap`, plain CSS (design tokens, no utility framework), npm, GitHub Actions → GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-09-23-botconnector-website-design.md`

## Global Constraints

- Node.js ≥ 22 (this machine has v24.18.0), npm as package manager — no pnpm/yarn.
- No CSS framework (no Tailwind) — shared design tokens in `src/styles/tokens.css` instead.
- Every page in the site structure is fully built with real content at the task that creates it — nothing left as "TODO, fill in later."
- The "Get BotConnector" / Download CTA always points to `GITHUB_REPO_URL` from `src/config/site.ts` — currently `https://github.com/farijarifriyanto-debug/BotConnector-Core` (a real, public, empty-of-releases repo created this session). Never hardcode this URL elsewhere; import the constant.
- Dark mode required (via `prefers-color-scheme` + a manual toggle persisted to `localStorage`).
- Every page needs: responsive layout, semantic HTML, a `<title>`/meta description via `BaseLayout`, Open Graph tags, and to be included in the sitemap.
- Site repo (this repo) will be pushed to `https://github.com/farijarifriyanto-debug/BotConnector-Website` (public, for free Actions + Pages) in the final task — don't push earlier tasks individually; commit locally per task as usual, push once at the end after everything builds green.
- `astro build` succeeding (zero errors) is the baseline pass/fail check for every task; several tasks add a grep-on-built-HTML check for content correctness.

---

## File Structure

```
package.json
astro.config.mjs
tsconfig.json
.gitignore
public/
  favicon.svg
  og-image.svg
  robots.txt
src/
  config/site.ts
  styles/tokens.css
  styles/global.css
  layouts/BaseLayout.astro
  components/Header.astro
  components/Footer.astro
  components/Hero.astro
  components/FeatureCard.astro
  pages/index.astro
  pages/features.astro
  pages/about.astro
  pages/download.astro
  pages/blog/index.astro
  pages/blog/[...slug].astro
  content.config.ts
  content/blog/announcing-goose-foundation.md
  content/docs/docs/index.md
  content/docs/docs/overview.md
  content/docs/docs/installation.md
  content/docs/docs/faq.md
.github/workflows/deploy.yml
```

---

### Task 1: Project scaffold

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`
- Create: `src/config/site.ts`
- Create: `public/robots.txt`

**Interfaces:**
- Produces: `SITE_TITLE`, `SITE_DESCRIPTION`, `SITE_URL`, `GITHUB_REPO_URL` (all `string`) exported from `src/config/site.ts` — every later task that needs site metadata or the download link imports from here.

- [ ] **Step 1: Scaffold the Astro project**

```bash
cd "C:\Users\farij\Projects\BotConnector-Website"
npm create astro@latest . -- --template minimal --typescript strict --no-install --no-git
npm install
npx astro add starlight --yes
npx astro add sitemap --yes
```

- [ ] **Step 2: Write `src/config/site.ts`**

```ts
export const SITE_TITLE = "BotConnector";
export const SITE_DESCRIPTION =
  "BotConnector is a local-first AI workspace and CLI, built on goose — the open agent foundation from the Agentic AI Foundation.";
export const SITE_URL = "https://farijarifriyanto-debug.github.io/BotConnector-Website";
export const GITHUB_REPO_URL = "https://github.com/farijarifriyanto-debug/BotConnector-Core";
```

- [ ] **Step 3: Write `public/robots.txt`**

```
User-agent: *
Allow: /

Sitemap: https://farijarifriyanto-debug.github.io/BotConnector-Website/sitemap-index.xml
```

- [ ] **Step 4: Verify the scaffold builds**

Run: `npm run build`
Expected: exits 0, `dist/` is created (may contain only Starlight's default page at this point — that's fine, later tasks add the rest).

- [ ] **Step 5: Commit**

```bash
git add package.json astro.config.mjs tsconfig.json .gitignore src/config/site.ts public/robots.txt package-lock.json
git commit -m "chore: scaffold Astro + Starlight project"
```

---

### Task 2: Design tokens, global styles, BaseLayout

**Files:**
- Create: `src/styles/tokens.css`, `src/styles/global.css`
- Create: `src/layouts/BaseLayout.astro`
- Create: `public/favicon.svg`, `public/og-image.svg`

**Interfaces:**
- Consumes: `SITE_TITLE`, `SITE_DESCRIPTION`, `SITE_URL` from `src/config/site.ts` (Task 1).
- Produces: `BaseLayout.astro` accepting `Props { title?: string; description?: string; ogImage?: string }`, rendering `<slot />` inside `<main>` with `<Header />`/`<Footer />` (added in Task 3 — until then, layout renders without them). Every marketing/blog page (Tasks 4-8) wraps its content in this layout.

- [ ] **Step 1: Write `src/styles/tokens.css`**

```css
:root {
  --color-bg: #ffffff;
  --color-bg-subtle: #f6f7f9;
  --color-text: #0d1117;
  --color-text-muted: #57606a;
  --color-accent: #4f46e5;
  --color-accent-hover: #4338ca;
  --color-border: #e1e4e8;

  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 1rem;
  --space-4: 1.5rem;
  --space-5: 2.5rem;
  --space-6: 4rem;
  --space-7: 6rem;

  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Roboto, sans-serif;
  --radius: 10px;
  --max-width: 1120px;
}

[data-theme="dark"] {
  --color-bg: #0d1117;
  --color-bg-subtle: #161b22;
  --color-text: #e6edf3;
  --color-text-muted: #8b949e;
  --color-accent: #818cf8;
  --color-accent-hover: #a5b4fc;
  --color-border: #30363d;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --color-bg: #0d1117;
    --color-bg-subtle: #161b22;
    --color-text: #e6edf3;
    --color-text-muted: #8b949e;
    --color-accent: #818cf8;
    --color-accent-hover: #a5b4fc;
    --color-border: #30363d;
  }
}
```

- [ ] **Step 2: Write `src/styles/global.css`**

```css
@import "./tokens.css";

* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body {
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-sans);
  line-height: 1.6;
}
a { color: var(--color-accent); }
a:hover { color: var(--color-accent-hover); }
.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--space-4);
}
img { max-width: 100%; display: block; }
:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }
```

- [ ] **Step 3: Write `public/favicon.svg` and `public/og-image.svg`**

`public/favicon.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="8" fill="#4f46e5"/>
  <text x="16" y="22" font-family="sans-serif" font-size="18" font-weight="700" fill="#fff" text-anchor="middle">B</text>
</svg>
```

`public/og-image.svg` (1200x630 standard OG size):
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0d1117"/>
  <rect x="60" y="60" width="88" height="88" rx="20" fill="#4f46e5"/>
  <text x="104" y="122" font-family="sans-serif" font-size="52" font-weight="700" fill="#fff" text-anchor="middle">B</text>
  <text x="60" y="280" font-family="sans-serif" font-size="72" font-weight="700" fill="#e6edf3">BotConnector</text>
  <text x="60" y="340" font-family="sans-serif" font-size="32" fill="#8b949e">A local-first AI agent, built on goose</text>
</svg>
```

- [ ] **Step 4: Write `src/layouts/BaseLayout.astro`**

```astro
---
import "../styles/global.css";
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL } from "../config/site";

interface Props {
  title?: string;
  description?: string;
  ogImage?: string;
}

const {
  title = SITE_TITLE,
  description = SITE_DESCRIPTION,
  ogImage = "/og-image.svg",
} = Astro.props;

const pageTitle = title === SITE_TITLE ? title : `${title} — ${SITE_TITLE}`;
const canonicalURL = new URL(Astro.url.pathname, SITE_URL);
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="canonical" href={canonicalURL} />
    <title>{pageTitle}</title>
    <meta name="description" content={description} />
    <meta property="og:type" content="website" />
    <meta property="og:title" content={pageTitle} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={new URL(ogImage, SITE_URL)} />
    <meta property="og:url" content={canonicalURL} />
    <meta name="twitter:card" content="summary_large_image" />
    <script is:inline>
      const saved = localStorage.getItem("theme");
      if (saved) document.documentElement.dataset.theme = saved;
    </script>
  </head>
  <body>
    <slot name="header" />
    <main>
      <slot />
    </main>
    <slot name="footer" />
  </body>
</html>
```

(Named slots for header/footer, filled by Task 3 — pages that don't pass them just get a bare `<main>`, which is still valid HTML for Task 2's build check.)

- [ ] **Step 5: Verify build**

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 6: Commit**

```bash
git add src/styles src/layouts/BaseLayout.astro public/favicon.svg public/og-image.svg
git commit -m "feat: add design tokens, global styles, and BaseLayout"
```

---

### Task 3: Header and Footer components

**Files:**
- Create: `src/components/Header.astro`, `src/components/Footer.astro`
- Modify: `src/layouts/BaseLayout.astro:body` — use `<Header slot="header" />` / `<Footer slot="footer" />` by default instead of relying on callers to pass them.

**Interfaces:**
- Consumes: `SITE_TITLE`, `GITHUB_REPO_URL` from `src/config/site.ts`.
- Produces: `BaseLayout` now always renders header/nav/theme-toggle and footer — no page needs to include them manually.

- [ ] **Step 1: Write `src/components/Header.astro`**

```astro
---
import { SITE_TITLE } from "../config/site";
const nav = [
  { href: "/features", label: "Features" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/docs/overview", label: "Docs" },
];
---
<header class="site-header">
  <div class="container header-inner">
    <a href="/" class="brand">{SITE_TITLE}</a>
    <nav aria-label="Main">
      <ul>
        {nav.map((item) => (
          <li><a href={item.href}>{item.label}</a></li>
        ))}
      </ul>
    </nav>
    <div class="header-actions">
      <button id="theme-toggle" type="button" aria-label="Toggle dark mode">🌓</button>
      <a class="cta" href="/download">Get BotConnector</a>
    </div>
  </div>
</header>
<style>
  .site-header { border-bottom: 1px solid var(--color-border); }
  .header-inner { display: flex; align-items: center; justify-content: space-between; padding-block: var(--space-3); gap: var(--space-4); }
  .brand { font-weight: 700; font-size: 1.25rem; text-decoration: none; color: var(--color-text); }
  nav ul { display: flex; gap: var(--space-4); list-style: none; margin: 0; padding: 0; }
  nav a { text-decoration: none; color: var(--color-text); }
  .header-actions { display: flex; align-items: center; gap: var(--space-3); }
  .cta { background: var(--color-accent); color: white; padding: var(--space-2) var(--space-3); border-radius: var(--radius); text-decoration: none; font-weight: 600; }
  .cta:hover { background: var(--color-accent-hover); color: white; }
  #theme-toggle { background: none; border: 1px solid var(--color-border); border-radius: var(--radius); padding: var(--space-1) var(--space-2); cursor: pointer; font-size: 1rem; }
  @media (max-width: 640px) {
    nav ul { display: none; }
  }
</style>
<script>
  const btn = document.getElementById("theme-toggle");
  btn?.addEventListener("click", () => {
    const current = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = current;
    localStorage.setItem("theme", current);
  });
</script>
```

- [ ] **Step 2: Write `src/components/Footer.astro`**

```astro
---
import { SITE_TITLE, GITHUB_REPO_URL } from "../config/site";
const year = new Date().getFullYear();
---
<footer class="site-footer">
  <div class="container footer-inner">
    <p>&copy; {year} {SITE_TITLE}. Built on <a href="https://github.com/aaif-goose/goose">goose</a>, an Apache-2.0 project from the Agentic AI Foundation.</p>
    <a href={GITHUB_REPO_URL}>GitHub</a>
  </div>
</footer>
<style>
  .site-footer { border-top: 1px solid var(--color-border); margin-top: var(--space-7); }
  .footer-inner { display: flex; justify-content: space-between; align-items: center; padding-block: var(--space-4); color: var(--color-text-muted); font-size: 0.9rem; flex-wrap: wrap; gap: var(--space-3); }
</style>
```

- [ ] **Step 3: Wire into `BaseLayout.astro`**

In `src/layouts/BaseLayout.astro`, add imports and default the named slots:

```astro
---
import "../styles/global.css";
import Header from "../components/Header.astro";
import Footer from "../components/Footer.astro";
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL } from "../config/site";
// ...(Props unchanged)
---
<!-- head unchanged -->
  <body>
    <Header />
    <main>
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

(Replaces the two named `<slot>` placeholders from Task 2 with direct `<Header />`/`<Footer />` — simpler once both components exist, and every page automatically gets them.)

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: exits 0. `grep -l "Get BotConnector" dist/index.html` should find the string (the default Starlight/minimal index page still gets wrapped once Task 4 replaces it — if `dist/index.html` doesn't exist yet at this point, instead check the Starlight placeholder page at `dist/docs/**/index.html` is unaffected, since Header/Footer only apply to non-Starlight pages).

- [ ] **Step 5: Commit**

```bash
git add src/components/Header.astro src/components/Footer.astro src/layouts/BaseLayout.astro
git commit -m "feat: add Header and Footer, wire into BaseLayout"
```

---

### Task 4: Home page

**Files:**
- Create: `src/components/Hero.astro`, `src/components/FeatureCard.astro`
- Create: `src/pages/index.astro`

**Interfaces:**
- Consumes: `BaseLayout` (Task 2/3).
- Produces: `Hero` component with `Props { eyebrow?: string; title: string; subtitle: string; primaryHref: string; primaryLabel: string; secondaryHref?: string; secondaryLabel?: string }`; `FeatureCard` with `Props { title: string; description: string }` — both reused by Features/About (Tasks 5-6).

- [ ] **Step 1: Write `src/components/Hero.astro`**

```astro
---
interface Props {
  eyebrow?: string;
  title: string;
  subtitle: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}
const { eyebrow, title, subtitle, primaryHref, primaryLabel, secondaryHref, secondaryLabel } = Astro.props;
---
<section class="hero">
  <div class="container hero-inner">
    {eyebrow && <p class="eyebrow">{eyebrow}</p>}
    <h1>{title}</h1>
    <p class="subtitle">{subtitle}</p>
    <div class="actions">
      <a class="primary" href={primaryHref}>{primaryLabel}</a>
      {secondaryHref && <a class="secondary" href={secondaryHref}>{secondaryLabel}</a>}
    </div>
  </div>
</section>
<style>
  .hero { padding-block: var(--space-7); text-align: center; }
  .eyebrow { color: var(--color-accent); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.85rem; }
  h1 { font-size: clamp(2.25rem, 5vw, 3.5rem); margin: var(--space-3) 0; }
  .subtitle { color: var(--color-text-muted); font-size: 1.15rem; max-width: 640px; margin: 0 auto var(--space-5); }
  .actions { display: flex; justify-content: center; gap: var(--space-3); flex-wrap: wrap; }
  .primary { background: var(--color-accent); color: white; padding: var(--space-3) var(--space-4); border-radius: var(--radius); text-decoration: none; font-weight: 600; }
  .primary:hover { background: var(--color-accent-hover); color: white; }
  .secondary { border: 1px solid var(--color-border); padding: var(--space-3) var(--space-4); border-radius: var(--radius); text-decoration: none; color: var(--color-text); }
</style>
```

- [ ] **Step 2: Write `src/components/FeatureCard.astro`**

```astro
---
interface Props { title: string; description: string; }
const { title, description } = Astro.props;
---
<div class="feature-card">
  <h3>{title}</h3>
  <p>{description}</p>
</div>
<style>
  .feature-card { background: var(--color-bg-subtle); border: 1px solid var(--color-border); border-radius: var(--radius); padding: var(--space-4); }
  .feature-card h3 { margin-top: 0; }
  .feature-card p { color: var(--color-text-muted); margin-bottom: 0; }
</style>
```

- [ ] **Step 3: Write `src/pages/index.astro`**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Hero from "../components/Hero.astro";
import FeatureCard from "../components/FeatureCard.astro";

const capabilities = [
  { title: "Local-first by default", description: "Run models on your own hardware. Nothing leaves your machine unless you explicitly choose a cloud provider." },
  { title: "Built on goose", description: "BotConnector runs on goose, the open agent runtime from the Agentic AI Foundation (Linux Foundation) — a production-grade foundation, not a hobby project." },
  { title: "CLI, desktop, and API", description: "Use BotConnector from the terminal, a native desktop app, or embed it via its API — the same agent, three surfaces." },
  { title: "Open extension model", description: "Connect tools and data sources through the Model Context Protocol, the same open standard goose supports." },
];
---
<BaseLayout>
  <Hero
    eyebrow="Now migrating to goose"
    title="An AI agent that runs where your work happens"
    subtitle="BotConnector is a local-first AI workspace and CLI, rebuilt on goose — the open, production-grade agent foundation from the Agentic AI Foundation."
    primaryHref="/download"
    primaryLabel="Get BotConnector"
    secondaryHref="/about"
    secondaryLabel="Why goose"
  />
  <section class="container capabilities">
    {capabilities.map((c) => <FeatureCard title={c.title} description={c.description} />)}
  </section>
</BaseLayout>
<style>
  .capabilities { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: var(--space-4); padding-block: var(--space-6); }
</style>
```

- [ ] **Step 4: Verify build and content**

Run: `npm run build && grep -c "feature-card" dist/index.html`
Expected: build exits 0; grep count is 4 (one per capability card).

- [ ] **Step 5: Commit**

```bash
git add src/components/Hero.astro src/components/FeatureCard.astro src/pages/index.astro
git commit -m "feat: build home page with hero and capabilities grid"
```

---

### Task 5: Features page

**Files:**
- Create: `src/pages/features.astro`

**Interfaces:**
- Consumes: `BaseLayout`, `FeatureCard` (Tasks 2-4).

- [ ] **Step 1: Write `src/pages/features.astro`**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import FeatureCard from "../components/FeatureCard.astro";

const sections = [
  {
    heading: "Chat and agent sessions",
    body: "Start a conversation from the CLI, the desktop app, or embed BotConnector via its API. Every surface talks to the same agent runtime, so context and behavior stay consistent wherever you work.",
  },
  {
    heading: "Model Context Protocol extensions",
    body: "Connect BotConnector to your existing tools — file systems, databases, internal APIs, or third-party services — through MCP, the open standard goose already supports across its ecosystem.",
  },
  {
    heading: "Provider flexibility",
    body: "Choose a local model through a managed runtime, or bring your own cloud provider credentials. Local prompts stay local by default; cloud routing is always an explicit, visible choice.",
  },
  {
    heading: "Recipes and guided workflows",
    body: "Package a multi-step task — research, a refactor, a report — into a reusable, shareable recipe, so repeatable work doesn't start from a blank prompt every time.",
  },
  {
    heading: "Approval-aware tool use",
    body: "Actions that touch your files or run commands go through an approval flow you control, not silent execution — the same safety model the goose foundation ships with.",
  },
];
---
<BaseLayout title="Features" description="What BotConnector can do: chat and agent sessions, MCP extensions, provider flexibility, recipes, and approval-aware tool use.">
  <section class="container page-header">
    <h1>Features</h1>
    <p>BotConnector inherits a production-grade feature set from the goose foundation, wrapped in a local-first workflow.</p>
  </section>
  <section class="container feature-list">
    {sections.map((s) => <FeatureCard title={s.heading} description={s.body} />)}
  </section>
</BaseLayout>
<style>
  .page-header { padding-block: var(--space-6) var(--space-4); }
  .page-header p { color: var(--color-text-muted); font-size: 1.1rem; max-width: 640px; }
  .feature-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--space-4); padding-block: var(--space-4) var(--space-7); }
</style>
```

- [ ] **Step 2: Verify build and content**

Run: `npm run build && grep -c "feature-card" dist/features/index.html`
Expected: build exits 0; grep count is 5.

- [ ] **Step 3: Commit**

```bash
git add src/pages/features.astro
git commit -m "feat: build features page"
```

---

### Task 6: About page

**Files:**
- Create: `src/pages/about.astro`

**Interfaces:**
- Consumes: `BaseLayout`.

- [ ] **Step 1: Write `src/pages/about.astro`**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
---
<BaseLayout title="About" description="Why BotConnector is moving onto the goose foundation, and what stays the same for users.">
  <section class="container prose">
    <h1>About BotConnector</h1>
    <p>
      BotConnector started as a local-first AI workspace and command-line
      client: discover GGUF models, manage a verified local runtime, and
      chat from the terminal, a desktop app, or a browser workspace —
      without your prompts leaving your machine unless you say so.
    </p>
    <h2>Why we're moving onto goose</h2>
    <p>
      Building and maintaining an agent runtime, a tool-approval system, an
      MCP implementation, and a desktop shell from scratch is a lot of
      surface area to keep production-grade. <a href="https://github.com/aaif-goose/goose">goose</a>
      already solves this well: it's an open-source agent runtime from the
      <strong>Agentic AI Foundation</strong>, part of the Linux Foundation,
      licensed under Apache 2.0, with a CLI, a native desktop app, 15+
      supported providers, and 70+ Model Context Protocol extensions out of
      the box.
    </p>
    <p>
      BotConnector is becoming a distribution of goose — the same
      local-first philosophy, running on a foundation with far more hands
      maintaining it than one project alone. This is a rebrand of the
      surface, not a rewrite of the ideas: goose is used as-is, with
      BotConnector's product identity applied at the branding layer only.
    </p>
    <h2>What doesn't change</h2>
    <ul>
      <li>Local-first defaults — nothing is sent to the cloud implicitly.</li>
      <li>CLI, desktop, and API access to the same agent.</li>
      <li>An open extension model, not a closed plugin store.</li>
    </ul>
  </section>
</BaseLayout>
<style>
  .prose { padding-block: var(--space-6) var(--space-7); max-width: 720px; }
  .prose h2 { margin-top: var(--space-6); }
  .prose p, .prose li { color: var(--color-text-muted); font-size: 1.05rem; }
</style>
```

- [ ] **Step 2: Verify build**

Run: `npm run build && grep -c "Agentic AI Foundation" dist/about/index.html`
Expected: build exits 0; grep count ≥ 1.

- [ ] **Step 3: Commit**

```bash
git add src/pages/about.astro
git commit -m "feat: build about page"
```

---

### Task 7: Blog (content collection + index + post template + first real post)

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/blog/announcing-goose-foundation.md`
- Create: `src/pages/blog/index.astro`, `src/pages/blog/[...slug].astro`

**Interfaces:**
- Produces: a `blog` content collection with schema `{ title: string; description: string; pubDate: Date }`, consumed by both blog pages.

- [ ] **Step 1: Write `src/content.config.ts`**

```ts
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
  }),
});

export const collections = { blog };
```

- [ ] **Step 2: Write `src/content/blog/announcing-goose-foundation.md`**

```markdown
---
title: "BotConnector is moving onto the goose foundation"
description: "Why BotConnector is rebuilding on goose, the open agent runtime from the Agentic AI Foundation, instead of maintaining its own runtime."
pubDate: 2026-09-23
---

BotConnector is migrating its runtime, CLI, and desktop app onto
[goose](https://github.com/aaif-goose/goose), the open-source agent
foundation from the Agentic AI Foundation (part of the Linux Foundation).

Maintaining a bespoke agent runtime, MCP implementation, approval system,
and desktop shell is a lot of surface area for one project to carry alone.
goose already does this well, in the open, under Apache 2.0, with far more
maintainers than BotConnector has on its own.

**What this means in practice:** BotConnector becomes a distribution of
goose — upstream is used as-is, with BotConnector's identity applied at
the branding layer only. No custom UI, no custom runtime, no forked
approval semantics. The local-first philosophy BotConnector started with
carries over unchanged.

We'll post progress here as the migration moves from foundation work to a
public build.
```

- [ ] **Step 3: Write `src/pages/blog/index.astro`**

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import { getCollection } from "astro:content";

const posts = (await getCollection("blog")).sort(
  (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
);
---
<BaseLayout title="Blog" description="Updates on BotConnector's development and its migration onto the goose foundation.">
  <section class="container page-header">
    <h1>Blog</h1>
    <p>Updates on BotConnector's development.</p>
  </section>
  <section class="container post-list">
    {posts.map((post) => (
      <a class="post-card" href={`/blog/${post.id}`}>
        <time datetime={post.data.pubDate.toISOString()}>
          {post.data.pubDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </time>
        <h2>{post.data.title}</h2>
        <p>{post.data.description}</p>
      </a>
    ))}
  </section>
</BaseLayout>
<style>
  .page-header { padding-block: var(--space-6) var(--space-4); }
  .post-list { display: flex; flex-direction: column; gap: var(--space-4); padding-block: var(--space-4) var(--space-7); max-width: 720px; }
  .post-card { display: block; border: 1px solid var(--color-border); border-radius: var(--radius); padding: var(--space-4); text-decoration: none; color: var(--color-text); }
  .post-card time { color: var(--color-text-muted); font-size: 0.85rem; }
  .post-card p { color: var(--color-text-muted); margin-bottom: 0; }
</style>
```

- [ ] **Step 4: Write `src/pages/blog/[...slug].astro`**

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import { getCollection, render } from "astro:content";

export async function getStaticPaths() {
  const posts = await getCollection("blog");
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await render(post);
---
<BaseLayout title={post.data.title} description={post.data.description}>
  <article class="container prose">
    <time datetime={post.data.pubDate.toISOString()}>
      {post.data.pubDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
    </time>
    <h1>{post.data.title}</h1>
    <Content />
  </article>
</BaseLayout>
<style>
  .prose { padding-block: var(--space-6) var(--space-7); max-width: 720px; }
  .prose time { color: var(--color-text-muted); font-size: 0.9rem; }
  .prose :global(p) { color: var(--color-text-muted); font-size: 1.05rem; line-height: 1.7; }
</style>
```

- [ ] **Step 5: Verify build and content**

Run: `npm run build && grep -c "BotConnector is moving onto the goose foundation" dist/blog/index.html`
Expected: build exits 0; grep count ≥ 1. Also check `dist/blog/announcing-goose-foundation/index.html` exists.

- [ ] **Step 6: Commit**

```bash
git add src/content.config.ts src/content/blog src/pages/blog
git commit -m "feat: add blog content collection, index, post template, and first post"
```

---

### Task 8: Download page

**Files:**
- Create: `src/pages/download.astro`

**Interfaces:**
- Consumes: `BaseLayout`, `GITHUB_REPO_URL` from `src/config/site.ts`.

- [ ] **Step 1: Write `src/pages/download.astro`**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import { GITHUB_REPO_URL } from "../config/site";

const releasesURL = `${GITHUB_REPO_URL}/releases`;
---
<BaseLayout title="Download" description="Get BotConnector — track releases and installation instructions on GitHub.">
  <section class="container page-header">
    <h1>Get BotConnector</h1>
    <p>
      BotConnector is being rebuilt on the goose foundation. Releases,
      install instructions, and platform support are published on GitHub
      as they become available — follow the repository to get notified.
    </p>
    <div class="actions">
      <a class="primary" href={releasesURL}>View releases on GitHub</a>
      <a class="secondary" href={GITHUB_REPO_URL}>Browse the source</a>
    </div>
  </section>
  <section class="container prose">
    <h2>In the meantime</h2>
    <p>
      Read <a href="/about">why BotConnector is moving onto goose</a>, or
      follow progress on the <a href="/blog">blog</a>. Once a build is
      published, this page will link directly to platform-specific
      installers.
    </p>
  </section>
</BaseLayout>
<style>
  .page-header { padding-block: var(--space-6) var(--space-4); max-width: 640px; }
  .page-header p { color: var(--color-text-muted); font-size: 1.05rem; }
  .actions { display: flex; gap: var(--space-3); flex-wrap: wrap; margin-top: var(--space-4); }
  .primary { background: var(--color-accent); color: white; padding: var(--space-3) var(--space-4); border-radius: var(--radius); text-decoration: none; font-weight: 600; }
  .primary:hover { background: var(--color-accent-hover); color: white; }
  .secondary { border: 1px solid var(--color-border); padding: var(--space-3) var(--space-4); border-radius: var(--radius); text-decoration: none; color: var(--color-text); }
  .prose { padding-block: var(--space-4) var(--space-7); max-width: 640px; }
  .prose p { color: var(--color-text-muted); }
</style>
```

- [ ] **Step 2: Verify build and CTA correctness**

Run: `npm run build && grep -o 'href="[^"]*BotConnector-Core[^"]*"' dist/download/index.html`
Expected: build exits 0; output shows two matches, both containing `github.com/farijarifriyanto-debug/BotConnector-Core` (confirms the CTA uses the real repo, not a placeholder).

- [ ] **Step 3: Commit**

```bash
git add src/pages/download.astro
git commit -m "feat: build download page with honest GitHub Releases CTA"
```

---

### Task 9: Docs section (Starlight content)

**Files:**
- Create: `src/content/docs/docs/index.md`, `src/content/docs/docs/overview.md`, `src/content/docs/docs/installation.md`, `src/content/docs/docs/faq.md`
- Modify: `astro.config.mjs` — configure the `starlight()` integration's title, social link, and sidebar.

**Interfaces:**
- Consumes: Starlight's built-in `docs` content collection (auto-registered by the `@astrojs/starlight` integration added in Task 1) — files under `src/content/docs/docs/**` map to routes `/docs/**`.

- [ ] **Step 1: Update `astro.config.mjs`**

```js
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://farijarifriyanto-debug.github.io",
  base: "/BotConnector-Website",
  integrations: [
    starlight({
      title: "BotConnector Docs",
      social: [
        { icon: "github", label: "GitHub", href: "https://github.com/farijarifriyanto-debug/BotConnector-Core" },
      ],
      sidebar: [
        {
          label: "Guides",
          items: [
            { label: "Overview", slug: "docs/overview" },
            { label: "Installation", slug: "docs/installation" },
            { label: "FAQ", slug: "docs/faq" },
          ],
        },
      ],
    }),
    sitemap(),
  ],
});
```

- [ ] **Step 2: Write `src/content/docs/docs/index.md`**

```markdown
---
title: BotConnector Docs
description: Documentation for BotConnector, the local-first AI agent built on goose.
---

BotConnector is a local-first AI workspace and CLI, built on
[goose](https://github.com/aaif-goose/goose). These docs cover what
BotConnector is, how installation will work once a build is published,
and answers to common questions.

- [Overview](/docs/overview/) — what BotConnector is and how it relates to goose
- [Installation](/docs/installation/) — current status and what to expect
- [FAQ](/docs/faq/) — common questions
```

- [ ] **Step 3: Write `src/content/docs/docs/overview.md`**

```markdown
---
title: Overview
description: What BotConnector is and how it relates to the goose foundation.
---

BotConnector is a local-first AI workspace and command-line client. It
runs on [goose](https://github.com/aaif-goose/goose), the open agent
foundation from the Agentic AI Foundation (Linux Foundation), used
as-is — BotConnector applies its product identity at the branding layer,
not by forking goose's runtime, UI, or tool behavior.

That means BotConnector inherits, unchanged, everything goose already
does well:

- A CLI, a native desktop app, and an API — the same agent, three surfaces.
- 15+ supported model providers, plus fully local model support.
- Model Context Protocol (MCP) extensions for connecting external tools.
- An approval flow for actions that touch your files or run commands.

See [About](/about/) for why this migration is happening.
```

- [ ] **Step 4: Write `src/content/docs/docs/installation.md`**

```markdown
---
title: Installation
description: Current installation status for the goose-based BotConnector.
---

BotConnector's goose-based foundation is still in migration — there is no
public build yet.

Once a build is published, this page will have platform-specific install
instructions for Windows, macOS, and Linux (CLI and desktop app), the way
goose itself documents installation today.

In the meantime:

- [View releases on GitHub](/download/) — this always reflects the real,
  current release state.
- [Read the migration announcement](/blog/announcing-goose-foundation/)
  for background on why this is happening.
```

- [ ] **Step 5: Write `src/content/docs/docs/faq.md`**

```markdown
---
title: FAQ
description: Frequently asked questions about BotConnector's move to goose.
---

### Is BotConnector still local-first?

Yes. Local-first defaults don't change with this migration — prompts stay
on your machine unless you explicitly choose a cloud provider.

### Why rebuild on goose instead of BotConnector's own runtime?

Maintaining a bespoke agent runtime, MCP implementation, and desktop
shell is a lot of surface area to keep production-grade alone. goose
already solves this, in the open, under Apache 2.0, with a much larger
set of maintainers. See [About](/about/) for the full reasoning.

### Does this change how I use BotConnector day to day?

The goal is no — same local-first workflow, same CLI/desktop surfaces.
Branding changes; behavior doesn't.

### Where can I follow progress?

The [blog](/blog/) posts updates as the migration moves forward, and
[GitHub Releases](/download/) is the source of truth for what's actually
shipped.
```

- [ ] **Step 6: Verify build**

Run: `npm run build`
Expected: exits 0. `ls dist/docs/overview/index.html dist/docs/installation/index.html dist/docs/faq/index.html` all exist.

- [ ] **Step 7: Commit**

```bash
git add astro.config.mjs src/content/docs
git commit -m "feat: add Starlight docs content (overview, installation, FAQ)"
```

---

### Task 10: SEO/sitemap verification pass

**Files:**
- No new files — verification only, using assets already created (Tasks 1-9).

- [ ] **Step 1: Full build**

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 2: Verify sitemap includes every marketing page**

Run: `grep -o "<loc>[^<]*</loc>" dist/sitemap-0.xml`
Expected: output includes entries for `/`, `/features`, `/about`, `/download`, `/blog`, `/blog/announcing-goose-foundation`, `/docs/overview`, `/docs/installation`, `/docs/faq` (paths prefixed with the configured `base`/`site`).

- [ ] **Step 3: Verify every marketing page has OG tags**

Run: `for f in dist/index.html dist/features/index.html dist/about/index.html dist/download/index.html dist/blog/index.html; do echo "-- $f --"; grep -c "og:title" "$f"; done`
Expected: every file prints `1` (each page's `BaseLayout` renders exactly one `og:title` tag).

- [ ] **Step 4: Commit (only if this step required fixes; otherwise skip — nothing to commit for a pure verification pass)**

If any check in Steps 2-3 failed and required a fix, commit that fix now with a message describing what was missing (e.g. `fix: include blog post pages in sitemap`). If everything passed, there's nothing to commit — proceed to Task 11.

---

### Task 11: GitHub Actions deploy workflow

**Files:**
- Create: `.github/workflows/deploy.yml`

**Interfaces:**
- None — this is the final build/deploy step, triggered by pushes to `main` on the repo created in Task 12.

- [ ] **Step 1: Write `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Verify YAML is well-formed**

Run: `python -c "import yaml,sys; yaml.safe_load(open('.github/workflows/deploy.yml'))" 2>&1 || node -e "require('yaml' in require('module').builtinModules ? 'yaml' : './node_modules/yaml').parse(require('fs').readFileSync('.github/workflows/deploy.yml','utf8'))"`
Expected: no output / no error (if neither `yaml` module nor Python is available, visually re-check indentation instead — this step just guards against a YAML typo before pushing).

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "chore: add GitHub Pages deploy workflow"
```

---

### Task 12: Create public repo, push, enable Pages, verify live deploy

**Files:**
- None — infrastructure/deployment task.

- [ ] **Step 1: Create the public GitHub repo**

```bash
gh repo create farijarifriyanto-debug/BotConnector-Website --public --description "BotConnector marketing site and docs (goose-based product)."
```

Expected: prints the new repo URL, e.g. `https://github.com/farijarifriyanto-debug/BotConnector-Website`.

- [ ] **Step 2: Push**

```bash
cd "C:\Users\farij\Projects\BotConnector-Website"
git remote add origin https://github.com/farijarifriyanto-debug/BotConnector-Website.git
git push -u origin main
```

Expected: push succeeds, no rejection (this is a brand-new repo, so no fork-sync issue like the goose fork had).

- [ ] **Step 3: Enable GitHub Pages with GitHub Actions as the source**

```bash
gh api -X PUT repos/farijarifriyanto-debug/BotConnector-Website/pages -f build_type=workflow
```

Expected: 2xx response (Pages is now configured to deploy from the Actions workflow rather than a branch).

- [ ] **Step 4: Watch the deploy workflow run**

```bash
gh run list --repo farijarifriyanto-debug/BotConnector-Website --limit 3
gh run watch --repo farijarifriyanto-debug/BotConnector-Website
```

Expected: the `Deploy to GitHub Pages` run (triggered automatically by the Task 12 Step 2 push) completes with conclusion `success`.

- [ ] **Step 5: Verify the live site**

Run: `curl -s -o /dev/null -w "%{http_code}" https://farijarifriyanto-debug.github.io/BotConnector-Website/`
Expected: `200`. Also spot-check `https://farijarifriyanto-debug.github.io/BotConnector-Website/download/` returns `200` and its body contains `BotConnector-Core` (confirms the CTA shipped correctly to production, not just in the local build).

- [ ] **Step 6: Record the result**

No commit needed for this task (nothing left to add — repo is already pushed). If Step 5 fails, debug via `gh run view --log` on the failed run before retrying; do not force-push over unrelated history.

---

## Self-Review Notes

- **Spec coverage:** every Site Structure entry from the spec (`/`, `/features`, `/about`, `/blog` + post template, `/docs` × 3, `/download`) has a task. Design bar (dark mode, design tokens, no template look), SEO/OG/sitemap, accessibility semantics, and the honest-download-link requirement are each covered by a specific task or verification step.
- **Placeholder scan:** no task leaves a "TODO" page; `/download` and `/docs/installation` explicitly describe the *real* current state (no public release yet) rather than pretending otherwise — that's accurate content, not a placeholder.
- **Type/interface consistency:** `GITHUB_REPO_URL` defined once in Task 1, consumed by Header (Task 3), Footer (Task 3), and Download (Task 8) — no page hardcodes the URL separately. `Hero`/`FeatureCard` props defined in Task 4 match their usage in Tasks 5-6.
- **Scope:** single cohesive plan, matches the one spec it implements. Accessibility/Lighthouse auditing beyond the structural checks above (semantic HTML, alt text, contrast via the token palette) is manual/follow-up work, not automated in this plan — flagged here rather than silently skipped.
