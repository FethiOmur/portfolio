"use client"

import type React from "react"

import { forwardRef, useCallback, useEffect, useState, useRef, type MouseEvent } from "react"
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  type MotionStyle,
  type MotionValue,
  type Variants,
} from "framer-motion"

// --- Helper Functions and Fallbacks ---

// A simple utility for class names, similar to cn/clsx
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(" ")
}

// Placeholder for image assets if they are not found.
const placeholderImage = (text = "Image") => `https://placehold.co/600x400/1a1a1a/ffffff?text=${text}`

// Base path helper for GitHub Pages (project subpath)
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ""
const withBase = (p: string) => {
  if (!p) return p
  return p.startsWith("http") ? p : `${basePath}${p}`
}

// --- Types ---
type StaticImageData = string

type WrapperStyle = MotionStyle & {
  "--x": MotionValue<string>
  "--y": MotionValue<string>
}

interface CardProps {
  bgClass?: string
}

interface ImageSet {
  step1img1: StaticImageData
  step1img2: StaticImageData
  step2img1: StaticImageData
  step2img2: StaticImageData
  step3img: StaticImageData
  step4img: StaticImageData
  step5img: StaticImageData
  step6img1: StaticImageData
  step6img2: StaticImageData
  alt: string
}

interface FeatureCarouselProps extends CardProps {
  step1img1Class?: string
  step1img2Class?: string
  step2img1Class?: string
  step2img2Class?: string
  step3imgClass?: string
  step4imgClass?: string
  step5imgClass?: string
  step6img1Class?: string
  step6img2Class?: string
  image: ImageSet
}

interface StepImageProps {
  src: StaticImageData
  alt: string
  className?: string
  style?: React.CSSProperties
  width?: number
  height?: number
}

interface Step {
  id: string
  name: string
  title: string
  description: string
  detailedDescription: string
  technologies: string[]
  achievements: string[]
  duration: string
  role: string
}

interface AnimatedStepImageProps {
  preset?: string
  delay?: number
  src: StaticImageData
  alt: string
  className?: string
  style?: React.CSSProperties
  layoutId?: string
}

// --- Constants ---
const TOTAL_STEPS = 6

const steps: readonly Step[] = [
  {
    id: "1",
    name: "LLMetric",
    title: "LLMetric: AI Discovery & Comparison Platform",
    description:
      "Developed as a solution to the complexity of the AI ecosystem, LLMetric is a centralized platform that guides users to find the most suitable AI models and tools for their specific needs.",
    detailedDescription:
      "LLMetric is a comprehensive AI Discovery & Comparison Platform designed to navigate the complex AI ecosystem. The platform provides personalized recommendations via an intelligent LLM assistant, enabling live model testing and comparison based on objective data. Built with a sophisticated multi-agent backend architecture for autonomous content generation. Developed end-to-end as a solo project, from the Next.js frontend to the multi-agent backend and supporting infrastructure.",
    technologies: ["Python", "LangChain", "LangGraph", "Next.js", "Multi-Agent Systems", "LLM Integration", "Real-time Testing"],
    achievements: [
      "Designed conversational 'AI Finder' LLM providing personalized recommendations for complex user needs",
      "Built 'Battle Arena' for live, side-by-side model testing against the same input",
      "Created continuously updated Leaderboards across various categories and detailed Comparison pages",
      "Developed sophisticated multi-agent backend with autonomous agents (Scraper, Editor, Manager) that communicate and delegate tasks",
    ],
    duration: "2024 - Present",
    role: "Lead Developer & AI Architect",
  },
  {
    id: "2",
    name: "Parking",
    title: "OPS Smart Parking IoT Solution",
    description:
      "Founded Inodea and developed innovative Smart Parking Solutions, securing $125K investment with a $600K valuation at ITU Çekirdek Big Bang.",
    detailedDescription:
      "As CEO and founder of Inodea, designed and implemented the core system architecture for a comprehensive smart parking solution. The system integrated IoT devices with real-time data analytics to optimize parking space utilization in urban environments. Led a cross-functional team through the entire product development lifecycle.",
    technologies: [
      "IoT Devices",
      "Real-time Analytics",
      "System Architecture",
      "Data Processing",
      "Mobile Integration",
    ],
    achievements: [
      "Secured $125K investment with $600K company valuation",
      "Selected as top 50 startup out of 39,760 projects at ITU Çekirdek Big Bang",
      "Successfully integrated IoT sensors with cloud-based analytics platform",
      "Developed scalable architecture handling real-time parking data",
    ],
    duration: "Nov 2020 - Aug 2021",
    role: "CEO & Founder",
  },
  {
    id: "3",
    name: "Satellite",
    title: "Satellite Image Analysis: Land Use Classification",
    description:
      "Automated land use classification system using ResNet18 with transfer learning, achieving 97.33% accuracy across 21 land use categories for urban planning and environmental monitoring.",
    detailedDescription:
      "This project automates land use classification by applying ResNet18 with transfer learning to satellite imagery. The solution replaces time-consuming and error-prone manual analysis with a fast and accurate system achieving exceptional performance metrics, providing crucial data for urban planning, environmental monitoring, and resource management.",
    technologies: [
      "ResNet18 Architecture",
      "Transfer Learning",
      "Data Augmentation",
      "5-fold Cross-validation",
      "Satellite Imagery",
      "Computer Vision",
      "Deep Learning",
      "Python",
      "PyTorch",
    ],
    achievements: [
      "Achieved exceptional 97.33 ± 0.63% validation accuracy and 96.51% test accuracy using ResNet18 with transfer learning from ImageNet pre-trained weights",
      "Developed comprehensive data augmentation pipeline with random rotations (30°), flips, shearing (0.3), and brightness adjustments (0.2-0.9) to improve model robustness",
      "Implemented rigorous 5-fold cross-validation strategy with early stopping (patience=10) and Adam optimizer achieving consistent performance across all folds",
      "Successfully classified 21 distinct land use categories including agricultural, residential areas, harbors, airports, and natural features with F1-scores ranging from 85% to 100%",
    ],
    duration: "2023 - 2024",
    role: "Computer Vision Engineer & Research Assistant",
  },
  {
    id: "4",
    name: "Nerox",
    title: "Nerox AI",
    description:
      "Developed AI-powered data pipelines and optimized LLMs for efficiency at Neurolance X Labs, focusing on video transcript processing and conversational AI applications.",
    detailedDescription:
      "As Mobile & Artificial Intelligence Developer at Neurolance X Labs, designed and implemented AI-powered data pipelines for automated data cleaning, NLP error handling, and structured data generation. Optimized multiple LLMs using quantization techniques and built comprehensive video transcript processing systems for conversational AI applications.",
    technologies: [
      "Python",
      "PyTorch",
      "TensorFlow",
      "LLM Optimization",
      "Data Augmentation",
      "Video Processing",
      "ChatCompletion API",
    ],
    achievements: [
      "Designed AI-powered data pipelines with automated data cleaning using Python, removing noise and advertisements",
      "Optimized LLMs for efficiency using quantization techniques (GPT, Llama, Gemini) on Google Colab GPUs",
      "Processed video transcripts and built scripts for efficient training and conversational AI applications",
      "Applied advanced data augmentation techniques including Word Substitution, Reordering, Deletion, and Back-Translation",
      "Prepared datasets in OpenAI's ChatCompletion format for advanced conversational AI models",
    ],
    duration: "May 2024 - Nov 2025",
    role: "Mobile & AI Developer",
  },
  {
    id: "5",
    name: "Medical",
    title: "AI-Powered Breast Cancer Diagnostics",
    description:
      "Enhanced breast cancer diagnostics by integrating radiomic feature extraction with multi-faceted machine learning and deep learning pipeline for highly accurate tumor classification and precise segmentation.",
    detailedDescription:
      "This project enhances breast cancer diagnostics by integrating radiomic feature extraction with a multi-faceted machine learning and deep learning pipeline. The solution leverages quantitative data from medical images to train models for highly accurate tumor classification and precise segmentation, aiming to improve clinical decision-making and patient outcomes.",
    technologies: [
      "PyRadiomics",
      "Support Vector Machine",
      "Random Forest",
      "Feed-Forward Neural Network",
      "U-Net",
      "PCA",
      "K-fold Cross-validation",
      "Medical Imaging",
    ],
    achievements: [
      "Developed comprehensive diagnostic pipeline extracting quantitative radiomic features from medical images using PyRadiomics",
      "Applied multiple models including SVM, Random Forest, and FFNN for robust tumor classification",
      "Engineered robust data pre-processing workflow with outlier detection, normalization, PCA for dimensionality reduction",
      "Implemented U-Net deep learning model for precise tumor segmentation enabling automated ROI delineation",
      "Validated model performance using K-fold cross-validation with Random Forest achieving up to 100% accuracy",
    ],
    duration: "2023 - 2024",
    role: "AI Research Developer",
  },
  {
    id: "6",
    name: "Gaming",
    title: "Mobile & Game Development",
    description:
      "Developed multiple successful mobile games and applications using Unity and Flutter, achieving significant user engagement and downloads.",
    detailedDescription:
      "Created four hyper-casual games at Gamebow, each achieving over 10,000 downloads in the first month. Actively contributed to brainstorming sessions and game design, leading to the development of half of the company's game portfolio. Improved overall game engagement by 25% through innovative gameplay mechanics and user experience optimization.",
    technologies: ["Unity", "C#", "Flutter", "Game Design", "Mobile Development", "UX/UI Design"],
    achievements: [
      "Developed 4 hyper-casual games with 10,000+ downloads each",
      "Contributed to 50% of company's game development pipeline",
      "Improved game engagement metrics by 25%",
      "Mastered both Unity and Flutter development frameworks",
    ],
    duration: "Feb 2022 - Jul 2022",
    role: "Unity Game Developer",
  },
]

// --- Hooks ---
function useNumberCycler(totalSteps: number = TOTAL_STEPS, interval = 5000, isPaused = false) {
  const [currentNumber, setCurrentNumber] = useState(0)

  // This effect handles the automatic cycling.
  // It depends on `currentNumber`, so every time the step changes,
  // it will clear the old timer and set a new one for the next step.
  useEffect(() => {
    if (isPaused) return

    const timerId = setTimeout(() => {
      setCurrentNumber((prev) => (prev + 1) % totalSteps)
    }, interval)

    // Cleanup function to clear the timer if the component unmounts
    // or if the dependencies of the effect change (e.g., user clicks a step).
    return () => clearTimeout(timerId)
  }, [currentNumber, totalSteps, interval, isPaused])

  // This function allows manual setting of the step.
  // When called, it updates `currentNumber`, which will trigger the useEffect
  // to reset the timer for the next cycle.
  const setStep = useCallback(
    (stepIndex: number) => {
      setCurrentNumber(stepIndex % totalSteps)
    },
    [totalSteps],
  )

  return { currentNumber, setStep }
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches)
    }
    checkDevice()
    window.addEventListener("resize", checkDevice)
    return () => window.removeEventListener("resize", checkDevice)
  }, [])
  return isMobile
}

// --- Components ---
function IconCheck({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={cn("h-4 w-4", className)}
      {...props}
    >
      <path d="m229.66 77.66-128 128a8 8 0 0 1-11.32 0l-56-56a8 8 0 0 1 11.32-11.32L96 188.69 218.34 66.34a8 8 0 0 1 11.32 11.32Z" />
    </svg>
  )
}

const stepVariants: Variants = {
  inactive: { scale: 0.98, opacity: 0.75 },
  active: { scale: 1, opacity: 1 },
}

const StepImage = forwardRef<HTMLImageElement, StepImageProps>(({ src, alt, className, style, ...props }, ref) => {
  return (
    <img
      ref={ref}
      alt={alt}
      className={className}
      src={src || withBase("/placeholder.svg")}
      style={{ position: "absolute", userSelect: "none", maxWidth: "unset", ...style }}
      onError={(e) => (e.currentTarget.src = placeholderImage(alt))}
      {...props}
    />
  )
})
StepImage.displayName = "StepImage"

const MotionStepImage = motion(StepImage)

const ANIMATION_PRESETS = {
  fadeInScale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
  },
  slideInLeft: {
    initial: { opacity: 0, x: -60 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -60 },
    transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
  },
  slideInRight: {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 60 },
    transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
  },
}

const AnimatedStepImage = ({ preset = "fadeInScale", delay = 0, layoutId, className, ...props }: AnimatedStepImageProps) => {
  const presetConfig = ANIMATION_PRESETS[preset]
  return (
    <MotionStepImage
      {...props}
      className={cn("transform-gpu", className)}
      layout
      layoutId={layoutId}
      {...presetConfig}
      transition={{ ...presetConfig.transition, delay, layout: { type: "spring", stiffness: 300, damping: 32, mass: 0.6 } }}
    />
  )
}

function FeatureCard({
  children,
  step,
  isExpanded,
  onToggleExpanded,
}: {
  children: React.ReactNode
  step: number
  isExpanded: boolean
  onToggleExpanded: () => void
}) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const isMobile = useIsMobile()

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    if (isMobile) return
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  return (
    <motion.div
      className="animated-cards group relative w-full rounded-2xl"
      onMouseMove={handleMouseMove}
      onClick={onToggleExpanded}
      style={{ "--x": useMotionTemplate`${mouseX}px`, "--y": useMotionTemplate`${mouseY}px` } as WrapperStyle}
    >
      <div className="relative w-full overflow-hidden rounded-3xl border border-neutral-200 bg-white transition-colors duration-300 dark:border-neutral-800 dark:bg-neutral-900 will-change-transform">
        <motion.div
          className="m-10 w-full transform-gpu"
          layout
          style={{ minHeight: isExpanded ? "600px" : "450px" }}
          transition={{ type: "spring", stiffness: 240, damping: 34, mass: 0.7 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              className="flex w-full flex-col gap-4 md:w-3/5 transform-gpu"
              initial={{ opacity: 0.001, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                className="text-sm font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05, duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              >
                {steps[step].name}
              </motion.div>
              <motion.h2
                className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 md:text-3xl cursor-pointer hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              >
                {steps[step].title}
              </motion.h2>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15, duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="text-base leading-relaxed text-neutral-700 dark:text-neutral-400">
                  {isExpanded ? steps[step].detailedDescription : steps[step].description}
                </p>
              </motion.div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, scaleY: 0.96 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    exit={{ opacity: 0, scaleY: 0.96 }}
                    transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
                    className="space-y-6 overflow-hidden transform-gpu"
                    style={{ transformOrigin: "top" }}
                    layout
                  >
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-3">
                          Technologies
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {steps[step].technologies.map((tech, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-md"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-3">
                        Key Achievements
                      </h4>
                      <ul className="space-y-2">
                        {steps[step].achievements.map((achievement, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start gap-2 text-sm text-neutral-700 dark:text-neutral-300"
                          >
                            <span className="w-1.5 h-1.5 bg-neutral-400 dark:bg-neutral-600 rounded-full mt-2 flex-shrink-0" />
                            {achievement}
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    {step === 0 && (
                      <div className="mt-8">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-4">
                          Platform Interface
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <motion.img
                            src={withBase("/llmetric-testimonials.png")}
                            alt="LLMetric Testimonials and Announcements"
                            className="w-full rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-lg cursor-pointer hover:opacity-80 transition-opacity"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            onClick={(e) => {
                              // handleImageClick("/llmetric-testimonials.png", e)
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = "scale(1.02)"
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "scale(1)"
                            }}
                          />
                          <motion.img
                            src={withBase("/llmetric-interface.png")}
                            alt="LLMetric Search Interface"
                            className="w-full rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-lg cursor-pointer hover:opacity-80 transition-opacity"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            onClick={(e) => {
                              // handleImageClick("/llmetric-interface.png", e)
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = "scale(1.02)"
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "scale(1)"
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="mt-8">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-4">
                          Development Interface
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <motion.img
                            src={withBase("/unity-interface.png")}
                            alt="Unity Game Development Interface"
                            className="w-full rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-lg cursor-pointer hover:opacity-80 transition-opacity"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            onClick={(e) => {
                              // handleImageClick("/unity-interface.png", e)
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = "scale(1.02)"
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "scale(1)"
                            }}
                          />
                          <motion.img
                            src={withBase("/mobile-app-interface.png")}
                            alt="Mobile App Development Interface"
                            className="w-full rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-lg cursor-pointer hover:opacity-80 transition-opacity"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            onClick={(e) => {
                              // handleImageClick("/mobile-app-interface.png", e)
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = "scale(1.02)"
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "scale(1)"
                            }}
                          />
                          <motion.a
                            href={withBase("/fethi-omur-environment-final-report.pdf")}
                            download
                            className="w-full p-6 flex items-center justify-center rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 shadow-lg hover:shadow-xl transition-all cursor-pointer text-neutral-800 dark:text-neutral-200"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35 }}
                            title="Download: Fethi Omur Environment Final Report"
                          >
                            <span className="text-center text-sm">Download PDF<br/>Fethi Omur Environment Final Report</span>
                          </motion.a>
                        </div>
                      </div>
                    )}

                    {step === 3 && (
                      <div className="mt-8">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-4">
                          AI Development Interface
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <motion.img
                            src={withBase("/neurolanche.svg")}
                            alt="Neurolanche Main Logo"
                            className="w-3/4 mx-auto rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-lg cursor-pointer hover:opacity-80 transition-opacity"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            onClick={(e) => {
                              // handleImageClick("/neurolanche.svg", e)
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = "scale(1.02)"
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "scale(1)"
                            }}
                          />
                          <motion.img
                            src={withBase("/neurolanche-4.svg")}
                            alt="Neurolanche Brand Variant"
                            className="w-3/4 mx-auto rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-lg cursor-pointer hover:opacity-80 transition-opacity"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            onClick={(e) => {
                              // handleImageClick("/neurolanche-4.svg", e)
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = "scale(1.02)"
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "scale(1)"
                            }}
                          />
                          <motion.img
                            src={withBase("/neurolanche-1.svg")}
                            alt="Neurolanche Logo Alternative"
                            className="w-3/4 mx-auto rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-lg cursor-pointer hover:opacity-80 transition-opacity"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            onClick={(e) => {
                              // handleImageClick("/neurolanche-1.svg", e)
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = "scale(1.02)"
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "scale(1)"
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {step === 4 && (
                      <div className="mt-8">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-4">
                          Medical AI Interface
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <motion.img
                            src={withBase("/medical-ai-diagnostic-interface.png")}
                            alt="Medical AI Diagnostic Interface"
                            className="w-full rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-lg cursor-pointer hover:opacity-80 transition-opacity"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            onClick={(e) => {
                              // handleImageClick("/medical-ai-diagnostic-interface.png", e)
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = "scale(1.02)"
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "scale(1)"
                            }}
                          />
                          <motion.img
                            src={withBase("/u-net-tumor-segmentation.png")}
                            alt="U-Net Segmentation Results"
                            className="w-full rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-lg cursor-pointer hover:opacity-80 transition-opacity"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            onClick={(e) => {
                              // handleImageClick("/u-net-tumor-segmentation.png", e)
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = "scale(1.02)"
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "scale(1)"
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {step === 5 && (
                      <div className="mt-8">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-4">
                          Gaming Images
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <motion.img
                            src={withBase("/unity-interface.png")}
                            alt="Unity Game Development Interface"
                            className="w-full rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-lg cursor-pointer hover:opacity-80 transition-opacity"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            onClick={(e) => {
                              e.stopPropagation()
                              // setEnlargedImage("/unity-interface.png")
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = "scale(1.02)"
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "scale(1)"
                            }}
                          />
                          <motion.img
                            src={withBase("/mobile-app-interface.png")}
                            alt="Mobile App Development Interface"
                            className="w-full rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-lg cursor-pointer hover:opacity-80 transition-opacity"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            onClick={(e) => {
                              e.stopPropagation()
                              // setEnlargedImage("/mobile-app-interface.png")
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = "scale(1.02)"
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "scale(1)"
                            }}
                          />
                        </div>
                      </div>
                    )}

                    <motion.button
                      onClick={(e) => { e.stopPropagation(); onToggleExpanded() }}
                      className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Show less ↑
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
          {children}
        </motion.div>
      </div>
    </motion.div>
  )
}

function StepsNav({
  steps: stepItems,
  current,
  onChange,
}: { steps: readonly Step[]; current: number; onChange: (index: number) => void }) {
  return (
    <nav aria-label="Progress" className="flex justify-center px-4">
      <ol className="flex w-full flex-wrap items-center justify-center gap-2" role="list">
        {stepItems.map((step, stepIdx) => {
          const isCompleted = current > stepIdx
          const isCurrent = current === stepIdx
          return (
            <motion.li
              key={step.name}
              initial="inactive"
              animate={isCurrent ? "active" : "inactive"}
              variants={stepVariants}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <button
                type="button"
                className={cn(
                  "group flex items-center gap-2.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-500 dark:focus-visible:ring-offset-black",
                  isCurrent
                    ? "bg-white text-black dark:bg-white dark:text-black"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700",
                )}
                onClick={() => onChange(stepIdx)}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-all duration-300",
                    isCompleted
                      ? "bg-neutral-600 text-white dark:bg-neutral-400 dark:text-black"
                      : isCurrent
                        ? "bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white"
                        : "bg-neutral-200 text-neutral-700 group-hover:bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-200 dark:group-hover:bg-neutral-600",
                  )}
                >
                  {isCompleted ? <IconCheck className="h-3.5 w-3.5" /> : <span>{stepIdx + 1}</span>}
                </span>
                <span className="hidden sm:inline-block">{step.name}</span>
              </button>
            </motion.li>
          )
        })}
      </ol>
    </nav>
  )
}

const defaultClasses = {
  img: "rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl shadow-black/10 dark:shadow-neutral-950/50 transform-gpu will-change-transform",
  step1img1: "w-[45%] right-[54%] top-[5%]",
  step1img2: "w-[45%] right-[9%] top-[20%]",
  step2img1: "w-[50%] left-[5%] top-[20%]",
  step2img2: "w-[40%] left-[55%] top-[45%]",
  step3img: "w-[90%] left-[5%] top-[25%]",
  step4img: "w-[90%] left-[5%] top-[25%]",
  step5img: "w-[90%] left-[5%] top-[25%]",
  step6img1: "w-[45%] left-[5%] top-[15%]",
  step6img2: "w-[45%] left-[52%] top-[30%]",
} as const

export function FeatureCarousel({
  image,
  step1img1Class = defaultClasses.step1img1,
  step1img2Class = defaultClasses.step1img2,
  step2img1Class = defaultClasses.step2img1,
  step2img2Class = defaultClasses.step2img2,
  step3imgClass = defaultClasses.step3img,
  step4imgClass = defaultClasses.step4img,
  step5imgClass = defaultClasses.step5img,
  step6img1Class = defaultClasses.step6img1,
  step6img2Class = defaultClasses.step6img2,
  ...props
}: FeatureCarouselProps) {
  const [isPaused, setIsPaused] = useState(false)
  const { currentNumber: step, setStep } = useNumberCycler(TOTAL_STEPS, 5000, isPaused)
  const [expandedStep, setExpandedStep] = useState<number | null>(null)
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()

  const handleToggleExpanded = useCallback(() => {
    setExpandedStep(expandedStep === step ? null : step)
  }, [expandedStep, step])

  const handleImageClick = useCallback((imageSrc: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setEnlargedImage(imageSrc)
  }, [])

  const closeModal = useCallback(() => {
    setEnlargedImage(null)
  }, [])

  useEffect(() => {
    if (expandedStep !== null && expandedStep !== step) {
      setExpandedStep(null)
    }
  }, [step, expandedStep])

  const handleCarouselClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setIsPaused(true)
  }, [])

  const handleOutsideClick = useCallback((e: MouseEvent) => {
    if (carouselRef.current && !carouselRef.current.contains(e.target as Node)) {
      setIsPaused(false)
      setEnlargedImage(null)
    }
  }, [])

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick)
    return () => {
      document.removeEventListener("click", handleOutsideClick)
    }
  }, [handleOutsideClick])

  const renderStepContent = () => {
    if (isMobile) return null
    switch (step) {
      case 0:
        return (
          <div className="relative w-full h-full">
            <AnimatedStepImage
              alt="LLMetric Testimonials and Announcements"
              className={cn(defaultClasses.img, "w-[45%] right-[54%] top-[5%]")}
              layoutId="step0-1"
              src={withBase("/llmetric-testimonials.png")}
              preset="slideInLeft"
            />
            <AnimatedStepImage
              alt="LLMetric Search Interface"
              className={cn(defaultClasses.img, "w-[45%] right-[9%] top-[20%]")}
              layoutId="step0-2"
              src={withBase("/llmetric-interface.png")}
              preset="slideInRight"
              delay={0.1}
            />
          </div>
        )
      case 1:
        return (
          <div className="relative w-full h-full">
            <AnimatedStepImage
              alt={image.alt}
              className={cn(defaultClasses.img, step2img1Class)}
              layoutId="step1-1"
              src={withBase(image.step2img1 as string)}
              preset="fadeInScale"
            />
            <AnimatedStepImage
              alt={image.alt}
              className={cn(defaultClasses.img, step2img2Class)}
              layoutId="step1-2"
              src={withBase(image.step2img2 as string)}
              preset="fadeInScale"
              delay={0.1}
            />
          </div>
        )
      case 2:
        return (
          <div className="relative w-full h-full">
            <AnimatedStepImage
              alt="F1 Scores Chart"
              className={cn(defaultClasses.img, "w-[45%] right-[54%] top-[5%]")}
              layoutId="step2-1"
              src={withBase("/f1-scores-chart.png")}
              preset="slideInLeft"
            />
            <AnimatedStepImage
              alt="Harbor Satellite Images"
              className={cn(defaultClasses.img, "w-[45%] right-[9%] top-[20%]")}
              layoutId="step2-2"
              src={withBase("/harbor-satellite-images.png")}
              preset="slideInRight"
              delay={0.1}
            />
          </div>
        )
      case 3:
        return (
          <div className="relative w-full h-full">
            <AnimatedStepImage
              alt="Neurolanche Main Logo"
              className={cn(defaultClasses.img, "w-[25%] right-[70%] top-[5%]")}
              layoutId="step3-1"
              src={withBase("/neurolanche.svg")}
              preset="slideInLeft"
            />
            <AnimatedStepImage
              alt="Neurolanche Brand Variant"
              className={cn(defaultClasses.img, "w-[25%] right-[40%] top-[15%]")}
              layoutId="step3-2"
              src={withBase("/neurolanche-4.svg")}
              preset="fadeInScale"
              delay={0.1}
            />
            <AnimatedStepImage
              alt="Neurolanche Logo Alternative"
              className={cn(defaultClasses.img, "w-[25%] right-[10%] top-[25%]")}
              layoutId="step3-3"
              src={withBase("/neurolanche-1.svg")}
              preset="slideInRight"
              delay={0.2}
            />
          </div>
        )
      case 4:
        return (
          <div className="relative w-full h-full">
            <AnimatedStepImage
              alt="Medical AI Diagnostic Interface"
              className={cn(defaultClasses.img, "w-[45%] right-[54%] top-[5%]")}
              layoutId="step4-1"
              src={withBase("/medical-ai-diagnostic-interface.png")}
              preset="slideInLeft"
            />
            <AnimatedStepImage
              alt="U-Net Segmentation Results"
              className={cn(defaultClasses.img, "w-[45%] right-[9%] top-[20%]")}
              layoutId="step4-2"
              src={withBase("/u-net-tumor-segmentation.png")}
              preset="slideInRight"
              delay={0.1}
            />
          </div>
        )
      case 5:
        return (
          <div className="relative w-full h-full">
            <AnimatedStepImage
              alt="Unity Game Development Interface"
              className={cn(defaultClasses.img, "w-[45%] right-[54%] top-[5%]")}
              layoutId="step5-1"
              src={withBase("/unity-interface.png")}
              preset="slideInLeft"
            />
            <AnimatedStepImage
              alt="Mobile App Development Interface"
              className={cn(defaultClasses.img, "w-[45%] right-[9%] top-[20%]")}
              layoutId="step5-2"
              src={withBase("/mobile-app-interface.png")}
              preset="slideInRight"
              delay={0.1}
            />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <>
      <div
        ref={carouselRef}
        className="flex flex-col gap-12 w-full max-w-4xl mx-auto p-4"
        onClick={handleCarouselClick}
      >
        <FeatureCard {...props} step={step} isExpanded={expandedStep === step} onToggleExpanded={handleToggleExpanded}>
          <AnimatePresence mode="wait">
            <motion.div key={step} {...ANIMATION_PRESETS.fadeInScale} className="w-full h-full absolute" layout>
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </FeatureCard>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <StepsNav current={step} onChange={setStep} steps={steps} />
        </motion.div>
      </div>

      <AnimatePresence>
        {enlargedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-w-4xl max-h-[90vh] p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={enlargedImage || "/placeholder.svg"}
                alt="Enlarged view"
                className="w-full h-full object-contain rounded-lg shadow-2xl"
              />
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
