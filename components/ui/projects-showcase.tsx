"use client"

import { useRef, useState } from "react"
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion"
import { cn } from "@/lib/utils"

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ""
const withBase = (p: string) => (p.startsWith("http") ? p : `${basePath}${p}`)

const EASE = [0.22, 1, 0.36, 1] as const

// --- Types ---
type VisualKind = "graphic" | "phone" | "web" | "store"

interface Visual {
  src: string
  alt: string
  fit?: "cover" | "contain"
}

interface Project {
  id: string
  name: string
  title: string
  tagline?: string
  meta: string
  status?: string
  description: string
  highlights: string[]
  tech: string[]
  link?: { label: string; href: string }
  kind: VisualKind
  visuals: Visual[]
}

// --- Data ---
const projects: Project[] = [
  {
    id: "fethiverse",
    name: "Fethiverse",
    title: "Multi-Agent Content Factory",
    meta: "Solo build · Claude Agent SDK",
    description:
      "An autonomous content-production system built on the Claude Agent SDK. Nine personality-driven agents — research, copywriting, art direction, and an editorial review loop — collaborate through peer messaging to plan, write, illustrate, and ship content end to end.",
    highlights: [
      "9 personality-driven agents coordinating via peer messaging",
      "60+ MCP tool integrations",
      "Self-learning knowledge store",
      "AI image-generation pipeline",
      "2,000+ automated tests",
    ],
    tech: [
      "Claude Agent SDK",
      "MCP",
      "Multi-Agent Systems",
      "Python",
      "TypeScript",
      "WebGL",
      "AI Image Generation",
    ],
    kind: "graphic",
    visuals: [
      { src: withBase("/fethiverse/cover-altman.jpg"), alt: "Sample output — AI-news cover on OpenAI's IPO, generated autonomously by the pipeline" },
      { src: withBase("/fethiverse/cover-dario.jpg"), alt: "Sample output — AI-news cover on Anthropic, generated autonomously by the pipeline" },
    ],
  },
  {
    id: "routerush",
    name: "RouteRush",
    title: "RouteRush",
    tagline: "Territory conquest on a live 3D globe",
    meta: "Consumer subscription iOS app · built end-to-end solo",
    status: "Launch-ready — preparing App Store release",
    description:
      "A gamified fitness app that turns runs and rides into territory conquest on a live 3D globe — claim H3 hex cells, earn Rush Points, climb cohort leagues, train with an AI coach. Designed, built, and taken to launch entirely solo.",
    highlights: [
      "~111k lines of Swift · ~500 source files · 92 test files",
      "StoreKit 2 subscriptions with server-side entitlement sync",
      "Server-authoritative economy & anti-cheat in Postgres (98 migrations, 74 tables)",
      "Mapbox 3D globe · H3 hex-cell conquest · realtime territory updates",
      "Cohort leagues, AI coach “Boldi”, HealthKit, offline-first queue",
    ],
    tech: ["Swift", "SwiftUI", "StoreKit 2", "Mapbox 3D", "Supabase", "H3 Geospatial", "HealthKit", "Realtime", "Edge Functions"],
    kind: "phone",
    visuals: [
      { src: withBase("/routerush/rr-globe-view.png"), alt: "RouteRush 3D globe view" },
      { src: withBase("/routerush/rr-route.png"), alt: "RouteRush route tracking" },
    ],
  },
  {
    id: "llmetric",
    name: "LLMetric",
    title: "AI Discovery & Comparison Platform",
    meta: "Solo — frontend + multi-agent backend · 2024",
    description:
      "A centralized platform that guides users to the right AI models and tools. Personalized recommendations from a conversational 'AI Finder', live side-by-side model testing in a 'Battle Arena', and a multi-agent backend for autonomous content generation.",
    highlights: [
      "Conversational 'AI Finder' for personalized recommendations",
      "'Battle Arena' for live, side-by-side model testing",
      "Continuously updated leaderboards & comparison pages",
      "Multi-agent backend (Scraper, Editor, Manager) that delegate tasks",
    ],
    tech: ["Python", "LangChain", "LangGraph", "Next.js", "Multi-Agent Systems", "LLM Integration"],
    kind: "web",
    visuals: [
      { src: withBase("/llmetric-interface.png"), alt: "LLMetric search interface" },
      { src: withBase("/llmetric-testimonials.png"), alt: "LLMetric testimonials and announcements" },
    ],
  },
  {
    id: "inodea",
    name: "Inodea",
    title: "Smart Parking IoT Platform",
    meta: "CEO & Founder · Nov 2020 — Aug 2021",
    description:
      "Founded a smart-parking startup and designed the core IoT architecture with real-time analytics. Secured $125K in investment at a $600K valuation — Top 50 of 39,760 projects at ITU Çekirdek Big Bang.",
    highlights: [
      "$125K raised at a $600K valuation",
      "Top 50 startup out of 39,760 at ITU Çekirdek Big Bang",
      "IoT sensors integrated with a cloud analytics platform",
      "Scalable architecture for real-time parking data",
    ],
    tech: ["IoT", "Real-time Analytics", "System Architecture", "Leadership"],
    kind: "web",
    visuals: [{ src: withBase("/smart-parking-iot.png"), alt: "Smart parking IoT solution" }],
  },
  {
    id: "satellite",
    name: "Satellite",
    title: "Satellite Land-Use Classification",
    meta: "Computer Vision · 2023 — 2024",
    description:
      "Automated land-use classification with ResNet18 transfer learning — 97.33% validation accuracy across 21 categories — replacing slow manual analysis for urban planning and environmental monitoring.",
    highlights: [
      "97.33% ± 0.63% validation, 96.51% test accuracy (ResNet18, ImageNet transfer)",
      "Augmentation pipeline: rotations, flips, shear, brightness",
      "Rigorous 5-fold cross-validation with early stopping",
      "21 land-use classes, F1 scores 85–100%",
    ],
    tech: ["PyTorch", "ResNet18", "Transfer Learning", "Computer Vision", "Cross-validation"],
    link: { label: "Download report (PDF)", href: withBase("/fethi-omur-environment-final-report.pdf") },
    kind: "web",
    visuals: [
      { src: withBase("/harbor-satellite-images.png"), alt: "Harbor satellite imagery samples" },
      { src: withBase("/f1-scores-chart.png"), alt: "Per-class F1 scores chart" },
    ],
  },
  {
    id: "nerox",
    name: "Nerox",
    title: "AI Data Pipelines at Neurolanche",
    meta: "Mobile & AI Developer · May 2024 — Nov 2025",
    description:
      "Designed AI-powered data pipelines for automated cleaning, NLP error handling, and structured data generation. Optimized LLMs with quantization and built video-transcript processing for conversational AI.",
    highlights: [
      "Automated data-cleaning pipelines (noise & ad removal)",
      "LLM quantization (GPT, Llama, Gemini) on Colab GPUs",
      "Video-transcript processing for conversational AI",
      "Advanced augmentation: substitution, reordering, back-translation",
    ],
    tech: ["Python", "PyTorch", "TensorFlow", "LLM Optimization", "Quantization"],
    kind: "store",
    visuals: [
      { src: withBase("/nerox/appstore.jpg"), alt: "Nerox AI listing on the App Store" },
      { src: withBase("/nerox/marketing-emotional.jpg"), alt: "Nerox AI — Your Emotional Friend marketing screen" },
      { src: withBase("/nerox/marketing-inspiration.jpg"), alt: "Nerox AI — Find creative inspiration chat screen" },
    ],
  },
  {
    id: "medical",
    name: "Medical",
    title: "AI-Powered Breast Cancer Diagnostics",
    meta: "AI Research · 2023 — 2024",
    description:
      "Integrated radiomic feature extraction with an ML/DL pipeline for accurate tumor classification and precise segmentation, aiming to improve clinical decision-making.",
    highlights: [
      "Radiomic feature extraction via PyRadiomics",
      "SVM, Random Forest & FFNN for tumor classification",
      "U-Net segmentation for automated ROI delineation",
      "K-fold cross-validation; Random Forest up to 100% accuracy",
    ],
    tech: ["PyRadiomics", "U-Net", "SVM", "Random Forest", "Medical Imaging"],
    kind: "web",
    visuals: [
      { src: withBase("/medical-ai-diagnostic-interface.png"), alt: "Medical AI diagnostic interface" },
      { src: withBase("/u-net-tumor-segmentation.png"), alt: "U-Net tumor segmentation results" },
    ],
  },
  {
    id: "gaming",
    name: "Gaming",
    title: "Mobile & Game Development",
    meta: "Unity Developer · Gamebow · 2022",
    description:
      "Built four hyper-casual games at Gamebow, each surpassing 10,000 downloads in its first month, and helped shape half the studio's game portfolio.",
    highlights: [
      "4 hyper-casual games, 10,000+ downloads each",
      "Contributed to 50% of the studio's game pipeline",
      "Improved engagement metrics by 25%",
    ],
    tech: ["Unity", "C#", "Flutter", "Game Design"],
    kind: "web",
    visuals: [
      { src: withBase("/unity-interface.png"), alt: "Unity game development interface" },
      { src: withBase("/mobile-app-interface.png"), alt: "Mobile app interface" },
    ],
  },
]

const N = projects.length

// --- Agent network graphic (Fethiverse) ---
// Round to fixed precision so server- and client-rendered SVG coordinate strings
// match exactly (avoids float-formatting hydration mismatches).
const r2 = (n: number) => Math.round(n * 100) / 100

const AGENT_NODES = Array.from({ length: 9 }, (_, i) => {
  const angle = (-90 + i * (360 / 9)) * (Math.PI / 180)
  const rad = 118
  return {
    x: r2(200 + rad * Math.cos(angle)),
    y: r2(200 + rad * Math.sin(angle)),
    label: ["Research", "", "Copy", "", "Art", "", "Editor", "", ""][i],
  }
})

function AgentNetwork({ backdrop = false }: { backdrop?: boolean }) {
  return (
    <div
      className={cn(
        "relative flex w-full items-center justify-center text-foreground",
        backdrop && "pointer-events-none absolute inset-0 opacity-[0.45]",
      )}
      aria-hidden={backdrop || undefined}
    >
      <svg
        viewBox="0 0 400 400"
        className={cn("w-full max-w-[420px]", backdrop && "h-full w-auto max-w-none")}
        role="img"
        aria-label="Multi-agent network diagram"
      >
        {/* Outer MCP tool ring (slow rotation) */}
        <motion.g
          style={{ transformOrigin: "200px 200px" }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 90, ease: "linear" }}
        >
          <circle cx="200" cy="200" r="176" fill="none" stroke="currentColor" strokeOpacity="0.12" strokeDasharray="2 8" strokeWidth="1" />
          {Array.from({ length: 60 }, (_, i) => {
            const a = (i * 6) * (Math.PI / 180)
            return (
              <line
                key={i}
                x1={r2(200 + 170 * Math.cos(a))}
                y1={r2(200 + 170 * Math.sin(a))}
                x2={r2(200 + 176 * Math.cos(a))}
                y2={r2(200 + 176 * Math.sin(a))}
                stroke="currentColor"
                strokeOpacity={i % 5 === 0 ? 0.35 : 0.15}
                strokeWidth="1"
              />
            )
          })}
        </motion.g>

        {/* Hub → agent edges */}
        {AGENT_NODES.map((n, i) => (
          <line key={`e${i}`} x1="200" y1="200" x2={n.x} y2={n.y} stroke="currentColor" strokeOpacity="0.16" strokeWidth="1" />
        ))}

        {/* Peer-messaging edges (a few, dashed) */}
        {[
          [0, 2],
          [2, 4],
          [4, 6],
          [6, 0],
          [1, 5],
          [3, 7],
        ].map(([a, b], i) => (
          <line
            key={`p${i}`}
            x1={AGENT_NODES[a].x}
            y1={AGENT_NODES[a].y}
            x2={AGENT_NODES[b].x}
            y2={AGENT_NODES[b].y}
            stroke="currentColor"
            strokeOpacity="0.22"
            strokeWidth="1"
            strokeDasharray="3 4"
          />
        ))}

        {/* Agent nodes */}
        {AGENT_NODES.map((n, i) => (
          <g key={`n${i}`}>
            <motion.circle
              cx={n.x}
              cy={n.y}
              r="6"
              fill="var(--background)"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeOpacity="0.75"
              animate={{ opacity: [0.55, 1, 0.55] }}
              transition={{ repeat: Infinity, duration: 3.6, delay: i * 0.35, ease: "easeInOut" }}
            />
            {n.label ? (
              <text
                x={n.x}
                y={n.y - 12}
                textAnchor="middle"
                fill="currentColor"
                fillOpacity="0.7"
                fontSize="9"
                fontFamily="var(--font-inter), sans-serif"
                letterSpacing="0.5"
              >
                {n.label}
              </text>
            ) : null}
          </g>
        ))}

        {/* Central knowledge hub */}
        <circle cx="200" cy="200" r="26" fill="var(--background)" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1" />
        <circle cx="200" cy="200" r="17" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1" />
        <text x="200" y="197" textAnchor="middle" fill="currentColor" fillOpacity="0.85" fontSize="8.5" fontFamily="var(--font-inter), sans-serif" letterSpacing="0.5">
          KNOWLEDGE
        </text>
        <text x="200" y="208" textAnchor="middle" fill="currentColor" fillOpacity="0.5" fontSize="7" fontFamily="var(--font-inter), sans-serif" letterSpacing="0.5">
          STORE
        </text>
      </svg>

      {!backdrop && (
        <span className="pointer-events-none absolute bottom-0 right-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/70">
          60+ MCP tools
        </span>
      )}
    </div>
  )
}

// --- Frames ---
function PhoneFrame({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <div className={cn("rounded-[2rem] border border-border bg-card p-1.5 shadow-2xl shadow-black/20", className)}>
      <div className="aspect-[9/19.5] overflow-hidden rounded-[1.6rem] border border-border/60">
        <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover" />
      </div>
    </div>
  )
}

function WindowFrame({
  visual,
  className,
}: {
  visual: Visual
  className?: string
}) {
  return (
    <div className={cn("overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-black/20", className)}>
      <div className="flex items-center gap-1.5 border-b border-border/60 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
        <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
        <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
      </div>
      <div className="aspect-[16/10] bg-background">
        <img
          src={visual.src}
          alt={visual.alt}
          loading="lazy"
          className={cn("h-full w-full", visual.fit === "contain" ? "object-contain" : "object-cover")}
        />
      </div>
    </div>
  )
}

function CoverFrame({
  visual,
  className,
  aspect = "aspect-[4/5]",
}: {
  visual: Visual
  className?: string
  aspect?: string
}) {
  return (
    <div className={cn("overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-black/30", className)}>
      <img src={visual.src} alt={visual.alt} loading="lazy" className={cn("w-full object-cover", aspect)} />
    </div>
  )
}

function ProjectVisual({ project }: { project: Project }) {
  if (project.kind === "graphic") {
    const [a, b] = project.visuals
    if (!a || !b) return <AgentNetwork />
    return (
      <div className="relative flex h-[360px] w-full max-w-[460px] items-center justify-center">
        <AgentNetwork backdrop />
        <CoverFrame visual={a} className="relative z-10 w-[184px] -rotate-3" />
        <CoverFrame visual={b} className="relative z-0 -ml-9 mt-14 w-[184px] rotate-3 opacity-95" />
        <span className="pointer-events-none absolute inset-x-0 bottom-0 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground/70">
          Sample outputs · fully autonomous runs
        </span>
      </div>
    )
  }

  if (project.kind === "store") {
    const [store, m1, m2] = project.visuals
    return (
      <div className="relative w-full max-w-[470px] pb-8">
        {store ? <WindowFrame visual={store} className="relative z-0 w-[86%]" /> : null}
        {m1 ? (
          <CoverFrame visual={m1} aspect="aspect-[9/19.5]" className="absolute right-10 top-14 z-10 w-[122px] -rotate-2" />
        ) : null}
        {m2 ? (
          <CoverFrame visual={m2} aspect="aspect-[9/19.5]" className="absolute -right-1 top-24 z-20 w-[122px] rotate-3" />
        ) : null}
      </div>
    )
  }

  if (project.kind === "phone") {
    const [a, b] = project.visuals
    return (
      <div className="relative flex items-center justify-center">
        {a ? <PhoneFrame src={a.src} alt={a.alt} className="relative z-10 w-[168px] -rotate-3" /> : null}
        {b ? <PhoneFrame src={b.src} alt={b.alt} className="relative z-0 -ml-8 mt-10 w-[168px] rotate-3 opacity-90" /> : null}
      </div>
    )
  }

  const [main, secondary] = project.visuals
  return (
    <div className="relative w-full max-w-[440px]">
      {secondary ? (
        <WindowFrame visual={secondary} className="absolute -right-5 -top-8 w-[58%] rotate-2 opacity-80" />
      ) : null}
      {main ? <WindowFrame visual={main} className="relative w-full" /> : null}
    </div>
  )
}

// --- Info block ---
function Highlights({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((h) => (
        <li key={h} className="flex items-start gap-2.5 text-sm text-muted-foreground">
          <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-muted-foreground/50" />
          <span className="leading-relaxed">{h}</span>
        </li>
      ))}
    </ul>
  )
}

function TechChips({ tech }: { tech: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tech.map((t) => (
        <span
          key={t}
          className="inline-flex h-7 items-center rounded-md border border-border/50 bg-background/30 px-2 text-xs leading-none text-muted-foreground"
        >
          {t}
        </span>
      ))}
    </div>
  )
}

function ProjectInfo({ project }: { project: Project }) {
  return (
    <div className="space-y-4">
      <div className="font-mono text-xs tracking-wider text-muted-foreground">{project.meta}</div>
      <h3 className="text-3xl font-light tracking-tight lg:text-4xl">{project.title}</h3>
      {project.tagline ? <div className="text-lg text-muted-foreground">{project.tagline}</div> : null}
      {project.status ? (
        <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
          {project.status}
        </span>
      ) : null}
      <p className="max-w-md leading-relaxed text-muted-foreground">{project.description}</p>
      <Highlights items={project.highlights} />
      <TechChips tech={project.tech} />
      {project.link ? (
        <a
          href={project.link.href}
          target={project.link.href.startsWith("http") ? "_blank" : undefined}
          rel={project.link.href.startsWith("http") ? "noopener noreferrer" : undefined}
          className="group inline-flex items-center gap-2 text-sm text-foreground transition-colors hover:text-muted-foreground"
        >
          {project.link.label}
          <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      ) : null}
    </div>
  )
}

// --- Main component ---
export function ProjectsShowcase() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  })
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(N - 1, Math.max(0, Math.floor(v * N)))
    setActive(idx)
  })

  const goTo = (i: number) => {
    const el = scrollRef.current
    if (!el) return
    const top = window.scrollY + el.getBoundingClientRect().top
    const scrollable = el.offsetHeight - window.innerHeight
    window.scrollTo({ top: top + ((i + 0.5) / N) * scrollable, behavior: "smooth" })
  }

  const activeProject = projects[active]

  return (
    <div className="pt-8">
      <div className="mb-12 flex items-end justify-between">
        <h2 className="text-4xl font-light">Projects</h2>
        <span className="hidden font-mono text-sm tracking-wider text-muted-foreground sm:block">BUILT · SHIPPED</span>
      </div>

      {/* Desktop: pinned scrollytelling */}
      <div ref={scrollRef} className="relative hidden lg:block" style={{ height: `${N * 100}vh` }}>
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden py-20">
          {/* progress header */}
          <div className="mb-10 flex items-center gap-4">
            <span className="font-mono text-xs text-muted-foreground">
              {String(active + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
            </span>
            <div className="relative h-px flex-1 bg-border">
              <motion.div className="absolute inset-y-0 left-0 bg-foreground" style={{ width: progressWidth }} />
            </div>
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{activeProject.name}</span>
          </div>

          {/* content */}
          <div className="grid grid-cols-12 items-center gap-8">
            <div className="col-span-6 lg:col-span-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProject.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  <ProjectInfo project={activeProject} />
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="col-span-6 flex min-h-[46vh] items-center justify-center lg:col-span-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProject.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="flex w-full items-center justify-center"
                >
                  <ProjectVisual project={activeProject} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* jump rail */}
          <div className="mt-10 flex flex-wrap gap-x-4 gap-y-2">
            {projects.map((p, i) => (
              <button
                key={p.id}
                onClick={() => goTo(i)}
                className={cn(
                  "font-mono text-[11px] tracking-wide transition-colors",
                  i === active ? "text-foreground" : "text-muted-foreground/40 hover:text-muted-foreground",
                )}
              >
                {String(i + 1).padStart(2, "0")} {p.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile / tablet: stacked reveal cards */}
      <div className="space-y-14 lg:hidden">
        {projects.map((project) => (
          <motion.article
            key={project.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="space-y-5 border-t border-border/50 pt-8"
          >
            <ProjectInfo project={project} />
            <div className="flex justify-center pt-2">
              <ProjectVisual project={project} />
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  )
}
