# Portfolio Content Update + Projects Redesign — Design

Date: 2026-07-17
Context: Interview prep (Codeway, Applied AI Engineer, Barcelona — 28 Jul 2026). Recruiter will
view fethiomur.github.io/portfolio/. Goal: surface the strongest 2026 work; keep the existing
minimal/monochrome design everywhere EXCEPT the Projects section, which gets a creative,
scroll-integrated redesign.

## Constraints

- Site stays English. Overall design unchanged except Projects.
- No fabricated facts. Dates confirmed with owner.
- `npm run build` must stay green after every change (Next.js static export → GitHub Pages via Actions).
- Small commits.

## Confirmed decisions (owner)

- Header CURRENTLY: `AI & Full-Stack Developer · @ SmartCreative SRL, Milan · Jan 2026 — Present`.
- Outlier role moved to `2025 — Jan 2026`.
- RouteRush status: `Launch-ready — preparing App Store release` (NOT live on App Store).
- Projects redesign direction: **pinned scrollytelling**.
- Fethiverse (no screenshot asset) → bespoke monochrome "agent network" SVG (honest system diagram).
- All 8 projects live inside the scrollytelling showcase.
- Skills pills expand to 12 (existing 6 + 6 new).

## A. Content updates (existing design preserved)

### Intro (`app/page.tsx`)
- Headline lead sentence → multi-agent / LLM-product framing citing Claude Agent SDK + MCP.
- Keep "Available for work anywhere in the EU".
- CURRENTLY block → SmartCreative (see above).
- FOCUS/Skills pills: keep Python, PyTorch, TensorFlow, LLM Fine-tuning, Azure AI, Docker;
  prepend Claude Agent SDK, MCP, Claude / OpenAI / Gemini APIs, Google ADK, Agent harnesses & evals, Next.js.

### Selected Work (`app/page.tsx`)
- New top entry: SmartCreative SRL, Milan — AI & Full-Stack Developer — Jan 2026 – Present.
  - Figma MCP design-to-code automation (days → hours); internal AI automation & agentic workflows;
    full-stack (level 5, "Sviluppatore Software: Full Stack e AI").
- Outlier → period "2025 – Jan 2026" (content otherwise unchanged).
- Section date range label `2020 — 2025` → `2020 — 2026`.
- Add optional `period` line under company for precise month ranges (content, not a redesign).

## B. Projects redesign — pinned scrollytelling

New component `components/ui/projects-showcase.tsx`, replacing `FeatureCarousel` usage in `page.tsx`.

- Outer tall section; inner `sticky top-0 h-screen` two-column canvas.
- Scroll progress (framer-motion `useScroll`) → active project index.
- LEFT (sticky): name, tagline, status badge, description, tech chips, highlights, optional link.
- RIGHT: active project visuals, cross-faded. Phone frame for iOS apps, window frame for web.
- Vertical progress rail: 8 project names, active highlighted, click-to-jump.
- Responsive: below `lg`, no pinning — plain vertical stacked cards (mobile/trackpad/a11y safe).
- Perf: only the active project's visuals mount (some PNGs are 5–7 MB).

### Project order + content
1. Fethiverse — Multi-Agent Content Pipeline (flagship, new). Bespoke agent-graph SVG visual.
2. RouteRush — updated copy (consumer subscription app, solo, StoreKit 2, Mapbox 3D globe,
   server-authoritative Supabase economy, 46 test files, launch-ready).
3. LLMetric — existing.
4. Inodea Smart Parking — existing.
5. Satellite Land-Use — existing; attach environment report PDF download here (currently mis-placed under Gaming).
6. Nerox / Neurolanche — existing.
7. Medical AI — existing.
8. Gaming — existing.

Old `animated-feature-carousel.tsx`: no longer imported. Not deleted (deletion needs owner confirm);
proposed for a cleanup commit at the end.

## Commit plan

1. docs: this spec.
2. Intro + Skills.
3. Work Experience (SmartCreative + Outlier + period).
4. ProjectsShowcase component + project data + Fethiverse SVG.
5. Wire ProjectsShowcase into page.tsx (replace carousel).
6. RouteRush copy polish / final touches.
7. Deploy (push → Actions) + live screenshot verification.

Each step verified with `npm run build`.
