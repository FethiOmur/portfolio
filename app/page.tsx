"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { FeatureCarousel } from "@/components/ui/animated-feature-carousel"
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ""
const withBase = (p: string) => (p.startsWith("http") ? p : `${basePath}${p}`)
import { SplashCursor } from "@/components/ui/splash-cursor"

export default function Home() {
  const [isDark, setIsDark] = useState(true)
  const [activeSection, setActiveSection] = useState("")
  const [hintedSection, setHintedSection] = useState<string | null>(null)
  const sectionsRef = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual"
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" })
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("opacity-0")
            entry.target.classList.add("opacity-100")
            entry.target.classList.add("animate-fade-in-up")
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.3, rootMargin: "0px 0px -20% 0px" },
    )

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!activeSection) return
    setHintedSection(activeSection)
    const timer = setTimeout(() => setHintedSection(null), 1500)
    return () => clearTimeout(timer)
  }, [activeSection])

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  const navigationSections = [
    { id: "intro", label: "Home" },
    { id: "work", label: "Works" },
    { id: "thoughts", label: "Projects" },
    { id: "connect", label: "Connect" },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <SplashCursor />
      <div className="fixed top-8 right-8 z-20">
        <button
          onClick={toggleTheme}
          className="group p-3 rounded-lg border border-border hover:border-muted-foreground/50 transition-all duration-300 bg-background/80 backdrop-blur-sm"
          aria-label="Toggle theme"
        >
          {isDark ? (
            <svg
              className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors duration-300"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707a1 1 0 011.414 0zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors duration-300"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>
      </div>

      <nav className="fixed left-8 top-1/2 -translate-y-1/2 z-10 hidden lg:block">
        <div className="flex flex-col gap-4">
          {navigationSections.map((section) => (
            <div key={section.id} className="relative group">
              <button
                onClick={() => document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth" })}
                className={`w-2 h-8 rounded-full transition-all duration-500 ${
                  activeSection === section.id ? "bg-foreground" : "bg-muted-foreground/30 hover:bg-muted-foreground/60"
                }`}
                aria-label={`Navigate to ${section.label}`}
              />
              <div className={`absolute left-6 top-1/2 -translate-y-1/2 transition-opacity duration-300 pointer-events-none ${
                hintedSection === section.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              }`}>
                <div className="bg-foreground text-background px-2 py-1 rounded text-sm whitespace-nowrap">
                  {section.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-8 lg:px-16">
        <header
          id="intro"
          ref={(el) => { sectionsRef.current[0] = el }}
          className="min-h-screen flex items-center opacity-0"
        >
          <div className="grid lg:grid-cols-5 gap-16 w-full">
            <div className="lg:col-span-3 space-y-8">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground font-mono tracking-wider">PORTFOLIO / 2025</div>
                <h1 className="text-6xl lg:text-7xl font-light tracking-tight">
                  Fethi
                  <br />
                  <span className="text-muted-foreground">Omur</span>
                </h1>
              </div>

              <div className="space-y-6 max-w-md">
                <p className="text-xl text-muted-foreground leading-relaxed">
                  AI Engineer crafting intelligent systems at the intersection of
                  <span className="text-foreground"> machine learning</span>,
                  <span className="text-foreground"> deep learning</span>, and
                  <span className="text-foreground"> scalable AI solutions</span>.
                </p>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Available for work anywhere in the EU
                  </div>
                  <div>Torino & Milano, Italy</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 flex flex-col justify-end space-y-8">
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground font-mono">CURRENTLY</div>
                <div className="space-y-2">
                  <div className="text-foreground">Advanced AI Data Trainer</div>
                  <div className="text-muted-foreground">@ Outlier</div>
                  <div className="text-xs text-muted-foreground">2025 — Present</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-sm text-muted-foreground font-mono">FOCUS</div>
                <div className="flex flex-wrap gap-2">
                  {["Python", "PyTorch", "TensorFlow", "LLM Fine-tuning", "Azure AI", "Docker"].map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 text-xs border border-border rounded-full hover:border-muted-foreground/50 transition-colors duration-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </header>

        <section id="work" ref={(el) => { sectionsRef.current[1] = el }} className="min-h-screen py-16 sm:py-24 lg:py-32 opacity-0">
          <div className="space-y-16">
            <div className="flex items-end justify-between">
              <h2 className="text-3xl sm:text-4xl font-light">Selected Work</h2>
              <div className="hidden sm:block text-sm text-muted-foreground font-mono">2020 — 2025</div>
            </div>

            <div className="space-y-8 sm:space-y-12">
              {[
                {
                  year: "2025",
                  role: "Advanced AI Data Trainer",
                  company: "Outlier",
                  description:
                    "Collaborated with AI researchers to fine-tune LLMs, ran systematic evaluations (reasoning, grading), and monitored bias/ethics. Built data augmentation and QC pipelines to improve robustness and clarity of model outputs.",
                  tech: ["LLMs", "Model Evaluation", "Bias Monitoring", "Reasoning Grading", "Data Augmentation", "Ethical Alignment"],
                },
                {
                  year: "2024",
                  role: "AI Engineer",
                  company: "Neurolanche X Labs",
                  description:
                    "Automated data pipelines for LLM fine-tuning with REST APIs and containerized microservices. Trained/served models on Azure AI Studio & AWS with quantization and GPU acceleration; built TTS/STT APIs and processed video transcripts for conversational AI at scale.",
                  tech: ["Python", "REST APIs", "Docker", "Microservices", "Azure AI", "AWS", "Quantization","TTS/STT", "Flutter"],
                },
                {
                  year: "2022",
                  role: "Software Trainee",
                  company: "Google Turkey AI and Technology Academy",
                  description:
                    "Delivered a production-grade automation project end-to-end; designed CI/CD, conducted load testing, and performed feasibility & risk assessments to ensure reliable, scalable services.",
                  tech: ["REST APIs", "Microservices", "CI/CD","Flutter", "Load Testing"],
                },
                {
                  year: "2022",
                  role: "Unity Game Developer",
                  company: "Gamebow",
                  description: "Developed four hyper‑casual games; each surpassed 10,000 downloads in the first month and improved player engagement through iterative design.",
                  tech: ["Unity", "C#", "Game Design"],
                },
                {
                  year: "2020",
                  role: "CEO & Founder",
                  company: "Inodea Information Tech",
                  description:
                    "Founded smart parking startup; designed core IoT architecture with real‑time analytics and secured $125K investment at a $600K valuation (Top 50 at ITU Çekirdek Big Bang).",
                  tech: ["IoT", "Real‑time Analytics", "System Architecture", "Leadership"],
                },
              ].map((job, index) => (
                <div
                  key={index}
                  className="group grid grid-cols-12 gap-4 sm:gap-6 lg:gap-8 py-6 sm:py-8 border-b border-border/50 hover:border-border transition-colors duration-500"
                >
                  <div className="col-span-3 sm:col-span-2">
                    <div className="text-xl sm:text-2xl font-light text-muted-foreground group-hover:text-foreground transition-colors duration-500">
                      {job.year}
                    </div>
                  </div>

                  <div className="col-span-9 sm:col-span-6 space-y-2 sm:space-y-3">
                    <div>
                      <h3 className="text-lg sm:text-xl font-medium">{job.role}</h3>
                      <div className="text-muted-foreground">{job.company}</div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{job.description}</p>
                  </div>

                  <div className="col-span-12 sm:col-span-4 flex flex-wrap gap-2 sm:justify-end mt-2 sm:mt-0">
                    {job.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 text-xs text-muted-foreground rounded border border-border/40 group-hover:border-muted-foreground/50 transition-colors duration-500"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="thoughts" ref={(el) => { sectionsRef.current[2] = el }} className="min-h-screen py-32 opacity-0">
          <div className="space-y-16">
            <h2 className="text-4xl font-light">Projects</h2>

            <FeatureCarousel
              image={{
                alt: "AI Project Screenshot",
                step1img1: withBase("/llm-fine-tuning-dashboard.png"),
                step1img2: withBase("/ai-model-training-interface.png"),
                step2img1: withBase("/smart-parking-iot.png"),
                step2img2: withBase("/mobile-app-interface.png"),
                step3img: withBase("/unity-interface.png"),
                step4img: withBase("/ai-data-pipeline.png"),
                step5img: withBase("/unity-interface.png"),
                step6img1: withBase("/unity-interface.png"),
                step6img2: withBase("/mobile-app-interface.png"),
              }}
            />
          </div>
        </section>

        <section id="connect" ref={(el) => { sectionsRef.current[3] = el }} className="py-32 opacity-0">
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="space-y-8">
              <h2 className="text-4xl font-light">Let's Connect</h2>

              <div className="space-y-6">
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Always interested in AI research collaborations, innovative projects, and conversations about machine
                  learning and technology.
                </p>

                <div className="space-y-4">
                  <Link
                    href="mailto:fethiomur@hotmail.com"
                    className="group flex items-center gap-3 text-foreground hover:text-muted-foreground transition-colors duration-300"
                  >
                    <span className="text-lg">fethiomur@hotmail.com</span>
                    <svg
                      className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="text-sm text-muted-foreground font-mono">ELSEWHERE</div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "LinkedIn", handle: "fethiomur", url: "https://www.linkedin.com/in/fethiomur" },
                  { name: "GitHub", handle: "@fethiomur", url: "https://github.com/FethiOmur" },
                  { name: "Location", handle: "Turin & Milan, Italy", url: "#" },
                ].map((social) => (
                  <Link
                    key={social.name}
                    href={social.url}
                    target={social.url.startsWith("http") ? "_blank" : undefined}
                    rel={social.url.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="group p-4 border border-border rounded-lg hover:border-muted-foreground/50 transition-all duration-300 hover:shadow-sm"
                  >
                    <div className="space-y-2">
                      <div className="text-foreground group-hover:text-muted-foreground transition-colors duration-300">
                        {social.name}
                      </div>
                      <div className="text-sm text-muted-foreground">{social.handle}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none"></div>
    </div>
  )
}
