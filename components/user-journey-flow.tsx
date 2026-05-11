"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bot,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileSearch,
  MessageSquare,
  Pause,
  Play,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  User,
  UserCheck,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"

/* ---------- NatWest palette ---------- */
const NW = {
  primary: "#5a287d",
  accent: "#bd0f72",
  human: "#1e6cb8",
  agent: "#7b2d8e",
  ok: "#1a8754",
  warn: "#f59e0b",
  error: "#dc2626",
  wait: "#94a3b8",
  bg: "#faf8fc",
}

/* ---------- Pilot agents for user journey ---------- */
const PILOT_AGENTS = [
  {
    id: "sof",
    name: "SOF Capture Agent",
    short: "SOF",
    color: "#7b2d8e",
    check: "Source of Funds",
  },
  {
    id: "biz",
    name: "Business Verification Agent",
    short: "BizVerify",
    color: "#bd0f72",
    check: "Company Details",
  },
  {
    id: "director",
    name: "Director Check Agent",
    short: "Directors",
    color: "#5a287d",
    check: "Director Info",
  },
  {
    id: "sic",
    name: "SIC Review Agent",
    short: "SIC",
    color: "#1a8754",
    check: "Industry Code",
  },
]

/* ---------- Journey steps with overlay annotations ---------- */
const JOURNEY_STEPS = [
  {
    id: "start",
    label: "Customer Starts Application",
    overlay: "Customer begins filling the onboarding form",
    type: "customer",
    x: 60,
    y: 200,
  },
  {
    id: "sof-check",
    label: "SOF Agent Validates",
    overlay: "Agent checks Source of Funds declaration in real-time",
    type: "agent",
    agentIdx: 0,
    x: 180,
    y: 120,
  },
  {
    id: "sof-prompt",
    label: "Prompts for Missing Info",
    overlay: "Issue found → Agent immediately asks customer to clarify",
    type: "prompt",
    x: 180,
    y: 280,
  },
  {
    id: "biz-check",
    label: "BizVerify Agent Validates",
    overlay: "Agent verifies company against Companies House live",
    type: "agent",
    agentIdx: 1,
    x: 320,
    y: 120,
  },
  {
    id: "director-check",
    label: "Director Agent Validates",
    overlay: "Agent cross-checks director details against registry",
    type: "agent",
    agentIdx: 2,
    x: 460,
    y: 120,
  },
  {
    id: "sic-check",
    label: "SIC Agent Validates",
    overlay: "Agent confirms SIC codes match declared activity",
    type: "agent",
    agentIdx: 3,
    x: 600,
    y: 120,
  },
  {
    id: "clean-submit",
    label: "Clean Application Submitted",
    overlay: "All checks passed → Complete, validated application ready",
    type: "success",
    x: 720,
    y: 200,
  },
  {
    id: "analyst",
    label: "Analyst Reviews",
    overlay: "Analyst receives high-quality application — minimal rework",
    type: "analyst",
    x: 860,
    y: 200,
  },
  {
    id: "approved",
    label: "Approved",
    overlay: "Fast approval — no back-and-forth delays",
    type: "complete",
    x: 980,
    y: 200,
  },
]

/* ---------- Speed options (slower defaults) ---------- */
const SPEEDS = [
  { label: "Slow", ms: 4000 },
  { label: "Normal", ms: 2500 },
  { label: "Fast", ms: 1200 },
]

/* ---------- Main component ---------- */
export function UserJourneyFlow() {
  const [playing, setPlaying] = useState(true)
  const [speedIdx, setSpeedIdx] = useState(0) // Default to Slow
  const [activeStep, setActiveStep] = useState(0)

  // Animation tick through steps
  useEffect(() => {
    if (!playing) return
    const interval = setInterval(() => {
      setActiveStep((s) => (s + 1) % JOURNEY_STEPS.length)
    }, SPEEDS[speedIdx].ms)
    return () => clearInterval(interval)
  }, [playing, speedIdx])

  const currentStep = JOURNEY_STEPS[activeStep]

  return (
    <main className="min-h-screen bg-background">
      <div className="nw-grid-bg min-h-screen" style={{ background: NW.bg }}>
        <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6">
          {/* Header */}
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="size-3" />
                Back to Journey
              </Link>
              <h1
                className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl"
                style={{ color: NW.primary }}
              >
                Agents in the User Journey
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                Agents validate data as customers fill the form — catching issues
                immediately and prompting for corrections in the same session.
                No wait. No rework. Better quality for analysts.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* Speed selector */}
              <div className="flex items-center gap-1 rounded-lg border bg-muted/40 p-1">
                {SPEEDS.map((s, i) => (
                  <button
                    key={s.label}
                    onClick={() => setSpeedIdx(i)}
                    className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition ${
                      speedIdx === i
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPlaying((p) => !p)}
                className="gap-1.5"
              >
                {playing ? (
                  <Pause className="size-3.5" />
                ) : (
                  <Play className="size-3.5" />
                )}
                {playing ? "Pause" : "Play"}
              </Button>
            </div>
          </header>

          {/* Overlay annotation panel */}
          <div
            key={currentStep.id}
            className="animate-draw-in mt-6 rounded-xl border-2 p-4"
            style={{
              borderColor:
                currentStep.type === "agent"
                  ? `${PILOT_AGENTS[currentStep.agentIdx ?? 0].color}66`
                  : currentStep.type === "prompt"
                    ? `${NW.warn}66`
                    : currentStep.type === "success" ||
                        currentStep.type === "complete"
                      ? `${NW.ok}66`
                      : `${NW.primary}44`,
              background:
                currentStep.type === "agent"
                  ? `${PILOT_AGENTS[currentStep.agentIdx ?? 0].color}08`
                  : currentStep.type === "prompt"
                    ? `${NW.warn}08`
                    : currentStep.type === "success" ||
                        currentStep.type === "complete"
                      ? `${NW.ok}08`
                      : `${NW.primary}05`,
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="flex size-10 shrink-0 items-center justify-center rounded-full text-white"
                style={{
                  background:
                    currentStep.type === "agent"
                      ? PILOT_AGENTS[currentStep.agentIdx ?? 0].color
                      : currentStep.type === "prompt"
                        ? NW.warn
                        : currentStep.type === "success" ||
                            currentStep.type === "complete"
                          ? NW.ok
                          : currentStep.type === "analyst"
                            ? NW.human
                            : NW.primary,
                }}
              >
                {currentStep.type === "agent" ? (
                  <Bot className="size-5" />
                ) : currentStep.type === "prompt" ? (
                  <MessageSquare className="size-5" />
                ) : currentStep.type === "analyst" ? (
                  <UserCheck className="size-5" />
                ) : currentStep.type === "success" ||
                  currentStep.type === "complete" ? (
                  <CheckCircle2 className="size-5" />
                ) : (
                  <User className="size-5" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{
                      color:
                        currentStep.type === "agent"
                          ? PILOT_AGENTS[currentStep.agentIdx ?? 0].color
                          : currentStep.type === "prompt"
                            ? NW.warn
                            : currentStep.type === "success" ||
                                currentStep.type === "complete"
                              ? NW.ok
                              : NW.primary,
                    }}
                  >
                    Step {activeStep + 1} of {JOURNEY_STEPS.length}
                  </span>
                  {currentStep.type === "agent" && (
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
                      style={{
                        background:
                          PILOT_AGENTS[currentStep.agentIdx ?? 0].color,
                      }}
                    >
                      {PILOT_AGENTS[currentStep.agentIdx ?? 0].name}
                    </span>
                  )}
                </div>
                <h2 className="mt-1 text-lg font-bold">{currentStep.label}</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {currentStep.overlay}
                </p>
              </div>
              <div className="hidden shrink-0 sm:block">
                <StepProgress current={activeStep} total={JOURNEY_STEPS.length} />
              </div>
            </div>
          </div>

          {/* Main flow SVG */}
          <div className="mt-4 overflow-x-auto rounded-2xl border-2 bg-card p-4 shadow-sm">
            <svg
              viewBox="0 0 1050 400"
              className="min-w-[900px]"
              style={{ height: 400 }}
            >
              {/* Background lanes */}
              <rect
                x="0"
                y="0"
                width="1050"
                height="400"
                fill={`${NW.bg}`}
                rx="12"
              />

              {/* Agent lane background */}
              <rect
                x="140"
                y="60"
                width="520"
                height="100"
                rx="8"
                fill={`${NW.agent}06`}
                stroke={`${NW.agent}22`}
                strokeWidth="1"
              />
              <text
                x="400"
                y="85"
                textAnchor="middle"
                fontSize="10"
                fontWeight="bold"
                fill={NW.agent}
                letterSpacing="2"
              >
                AGENT VALIDATION LAYER — REAL-TIME CHECKS
              </text>

              {/* Prompt lane background */}
              <rect
                x="140"
                y="240"
                width="200"
                height="80"
                rx="8"
                fill={`${NW.warn}06`}
                stroke={`${NW.warn}22`}
                strokeWidth="1"
              />
              <text
                x="240"
                y="265"
                textAnchor="middle"
                fontSize="9"
                fontWeight="bold"
                fill={NW.warn}
                letterSpacing="1"
              >
                INSTANT CUSTOMER PROMPT
              </text>

              {/* Main flow path */}
              <path
                d="M60 200 
                   C120 200 140 130 180 130
                   L600 130
                   C640 130 660 200 720 200
                   L980 200"
                fill="none"
                stroke={`${NW.ok}33`}
                strokeWidth="4"
              />
              {/* Animated dashed overlay */}
              <path
                d="M60 200 
                   C120 200 140 130 180 130
                   L600 130
                   C640 130 660 200 720 200
                   L980 200"
                fill="none"
                stroke={NW.ok}
                strokeWidth="3"
                strokeDasharray="10 6"
                className="animate-flow-dash"
              />

              {/* Prompt branch path */}
              <path
                d="M180 130 L180 290"
                fill="none"
                stroke={`${NW.warn}44`}
                strokeWidth="2"
                strokeDasharray="4 3"
              />
              <path
                d="M180 290 L180 130"
                fill="none"
                stroke={NW.warn}
                strokeWidth="2"
                strokeDasharray="4 3"
                className="animate-flow-dash"
                style={{ animationDirection: "reverse" }}
              />

              {/* Step nodes */}
              {JOURNEY_STEPS.map((step, i) => {
                const isActive = i === activeStep
                const isPast = i < activeStep

                let color = NW.primary
                if (step.type === "agent")
                  color = PILOT_AGENTS[step.agentIdx ?? 0].color
                else if (step.type === "prompt") color = NW.warn
                else if (step.type === "success" || step.type === "complete")
                  color = NW.ok
                else if (step.type === "analyst") color = NW.human

                const radius = isActive ? 24 : 18

                return (
                  <g key={step.id}>
                    {/* Pulse ring for active */}
                    {isActive && (
                      <circle
                        cx={step.x}
                        cy={step.y}
                        r={radius + 8}
                        fill="none"
                        stroke={color}
                        strokeWidth="2"
                        opacity="0.4"
                        className="animate-ping"
                      />
                    )}

                    {/* Node */}
                    <circle
                      cx={step.x}
                      cy={step.y}
                      r={radius}
                      fill={isPast || isActive ? color : `${color}44`}
                      stroke={color}
                      strokeWidth={isActive ? 3 : 1}
                    />

                    {/* Icon */}
                    {step.type === "agent" ? (
                      <text
                        x={step.x}
                        y={step.y + 4}
                        textAnchor="middle"
                        fontSize={isActive ? 10 : 8}
                        fontWeight="bold"
                        fill="white"
                      >
                        {PILOT_AGENTS[step.agentIdx ?? 0].short.slice(0, 3)}
                      </text>
                    ) : (
                      <text
                        x={step.x}
                        y={step.y + 5}
                        textAnchor="middle"
                        fontSize={isActive ? 14 : 11}
                        fontWeight="bold"
                        fill="white"
                      >
                        {step.type === "customer"
                          ? "👤"
                          : step.type === "prompt"
                            ? "💬"
                            : step.type === "analyst"
                              ? "🔍"
                              : step.type === "success"
                                ? "✓"
                                : step.type === "complete"
                                  ? "🎉"
                                  : "•"}
                      </text>
                    )}

                    {/* Label */}
                    <text
                      x={step.x}
                      y={step.y + (step.type === "prompt" ? -35 : 42)}
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="600"
                      fill={isPast || isActive ? color : `${color}88`}
                    >
                      {step.label.length > 18
                        ? step.label.slice(0, 16) + "..."
                        : step.label}
                    </text>

                    {/* Time saved indicator for agent nodes */}
                    {step.type === "agent" && (isPast || isActive) && (
                      <g>
                        <rect
                          x={step.x - 25}
                          y={step.y + 52}
                          width="50"
                          height="16"
                          rx="8"
                          fill={`${NW.ok}22`}
                          stroke={NW.ok}
                          strokeWidth="1"
                        />
                        <text
                          x={step.x}
                          y={step.y + 63}
                          textAnchor="middle"
                          fontSize="8"
                          fontWeight="bold"
                          fill={NW.ok}
                        >
                          ✓ Checked
                        </text>
                      </g>
                    )}
                  </g>
                )
              })}

              {/* Traveling packet */}
              <circle r="10" fill={NW.accent}>
                <animateMotion
                  dur={`${JOURNEY_STEPS.length * 2.5}s`}
                  repeatCount="indefinite"
                  path="M60 200 C120 200 140 130 180 130 L600 130 C640 130 660 200 720 200 L980 200"
                />
              </circle>
              <circle r="6" fill="white" opacity="0.6">
                <animateMotion
                  dur={`${JOURNEY_STEPS.length * 2.5}s`}
                  repeatCount="indefinite"
                  path="M60 200 C120 200 140 130 180 130 L600 130 C640 130 660 200 720 200 L980 200"
                />
              </circle>

              {/* Time comparison callout */}
              <g>
                <rect
                  x="750"
                  y="60"
                  width="280"
                  height="100"
                  rx="12"
                  fill="white"
                  stroke={`${NW.ok}44`}
                  strokeWidth="2"
                />
                <text
                  x="890"
                  y="90"
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="bold"
                  fill={NW.ok}
                >
                  TIME SAVED
                </text>
                <text
                  x="890"
                  y="115"
                  textAnchor="middle"
                  fontSize="22"
                  fontWeight="bold"
                  fill={NW.ok}
                >
                  2-5 DAYS → MINUTES
                </text>
                <text
                  x="890"
                  y="140"
                  textAnchor="middle"
                  fontSize="9"
                  fill={NW.primary}
                >
                  No wait for customer response
                </text>
              </g>
            </svg>
          </div>

          {/* Key benefits */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <BenefitCard
              icon={<Zap className="size-5" />}
              title="Instant Validation"
              desc="Agents check data as customer types — no delays"
              color={NW.agent}
            />
            <BenefitCard
              icon={<MessageSquare className="size-5" />}
              title="Same-Session Fixes"
              desc="Issues found → customer corrects immediately"
              color={NW.warn}
            />
            <BenefitCard
              icon={<ShieldCheck className="size-5" />}
              title="Clean Applications"
              desc="Analysts receive complete, validated data"
              color={NW.ok}
            />
            <BenefitCard
              icon={<TrendingUp className="size-5" />}
              title="Higher RFT & STP"
              desc="Right First Time jumps from 62% to 94%"
              color={NW.accent}
            />
          </div>

          {/* Metrics comparison */}
          <MetricsSection />

          {/* Pilot agents */}
          <AgentsSection />

          {/* Bottom CTA */}
          <section className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/adoption">
              <Button
                variant="outline"
                className="gap-2"
                style={{ borderColor: `${NW.primary}44`, color: NW.primary }}
              >
                <TrendingUp className="size-4" />
                View Adoption Roadmap
              </Button>
            </Link>
            <Link href="/flow">
              <Button
                variant="outline"
                className="gap-2"
                style={{ borderColor: `${NW.primary}44`, color: NW.primary }}
              >
                <Zap className="size-4" />
                Watch Onboarding Flow
              </Button>
            </Link>
          </section>
        </div>
      </div>
    </main>
  )
}

/* ---------- Step progress indicator ---------- */
function StepProgress({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-2 rounded-full transition-all ${
            i === current ? "w-6" : "w-2"
          }`}
          style={{
            background:
              i < current ? NW.ok : i === current ? NW.accent : `${NW.wait}44`,
          }}
        />
      ))}
    </div>
  )
}

/* ---------- Benefit card ---------- */
function BenefitCard({
  icon,
  title,
  desc,
  color,
}: {
  icon: React.ReactNode
  title: string
  desc: string
  color: string
}) {
  return (
    <div
      className="rounded-xl border-2 p-4"
      style={{ borderColor: `${color}33`, background: `${color}05` }}
    >
      <div
        className="flex size-10 items-center justify-center rounded-lg text-white"
        style={{ background: color }}
      >
        {icon}
      </div>
      <h4 className="mt-2 font-bold" style={{ color }}>
        {title}
      </h4>
      <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
    </div>
  )
}

/* ---------- Metrics section ---------- */
function MetricsSection() {
  const metrics = [
    {
      label: "Right First Time (RFT)",
      before: "62%",
      after: "94%",
      improvement: "+52%",
      color: NW.ok,
    },
    {
      label: "Straight Through Processing",
      before: "28%",
      after: "78%",
      improvement: "+179%",
      color: NW.accent,
    },
    {
      label: "Average Cycle Time",
      before: "5-7 days",
      after: "4-8 hours",
      improvement: "-91%",
      color: NW.agent,
    },
    {
      label: "Customer Contacts",
      before: "2.4 avg",
      after: "0.2 avg",
      improvement: "-92%",
      color: NW.primary,
    },
  ]

  return (
    <section className="mt-6 rounded-2xl border bg-card p-5 shadow-sm">
      <h3
        className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest"
        style={{ color: NW.primary }}
      >
        <Sparkles className="size-4" />
        Impact on Key Metrics
      </h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="rounded-xl border p-3"
            style={{ borderColor: `${m.color}33` }}
          >
            <div className="text-xs font-medium text-muted-foreground">
              {m.label}
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-sm line-through opacity-50">{m.before}</span>
              <ArrowRight className="size-3 text-muted-foreground" />
              <span className="text-xl font-bold" style={{ color: m.color }}>
                {m.after}
              </span>
            </div>
            <div
              className="mt-1 text-xs font-bold"
              style={{ color: m.color }}
            >
              {m.improvement}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ---------- Agents section ---------- */
function AgentsSection() {
  return (
    <section className="mt-6 rounded-2xl border bg-card p-5 shadow-sm">
      <h3
        className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest"
        style={{ color: NW.agent }}
      >
        <Bot className="size-4" />
        Pilot Agents in User Journey
      </h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {PILOT_AGENTS.map((agent) => (
          <div
            key={agent.id}
            className="flex items-start gap-3 rounded-xl border p-3"
            style={{ borderColor: `${agent.color}33` }}
          >
            <div
              className="flex size-10 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
              style={{ background: agent.color }}
            >
              {agent.short.slice(0, 3)}
            </div>
            <div>
              <div className="font-semibold text-sm" style={{ color: agent.color }}>
                {agent.name}
              </div>
              <div className="mt-0.5 text-xs text-muted-foreground">
                Validates: {agent.check}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
