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
  Clock,
  FileSearch,
  Pause,
  Play,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  User,
  UserCheck,
  Users,
  X,
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
    desc: "Guides customer through Source of Funds declaration with smart prompts and validation",
  },
  {
    id: "biz",
    name: "Business Verification Agent",
    short: "BizVerify",
    color: "#bd0f72",
    desc: "Real-time Companies House lookup and trading name validation during application",
  },
  {
    id: "director",
    name: "Director Check Agent",
    short: "Directors",
    color: "#5a287d",
    desc: "Validates director details against registry and flags discrepancies immediately",
  },
  {
    id: "sic",
    name: "SIC Review Agent",
    short: "SIC",
    color: "#1a8754",
    desc: "Confirms SIC codes match declared activity and suggests corrections",
  },
]

/* ---------- Speed options ---------- */
const SPEEDS = [
  { label: "Slow", ms: 3000 },
  { label: "Normal", ms: 1800 },
  { label: "Fast", ms: 900 },
]

/* ---------- Main component ---------- */
export function UserJourneyFlow() {
  const [playing, setPlaying] = useState(true)
  const [speedIdx, setSpeedIdx] = useState(1)
  const [tick, setTick] = useState(0)

  // Animation tick
  useEffect(() => {
    if (!playing) return
    const interval = setInterval(() => {
      setTick((t) => t + 1)
    }, SPEEDS[speedIdx].ms)
    return () => clearInterval(interval)
  }, [playing, speedIdx])

  // Cycle position for animations (0-11 for traditional, 0-5 for agent-enhanced)
  const tradPos = tick % 12
  const agentPos = tick % 6

  return (
    <main className="min-h-screen bg-background">
      <div
        className="nw-grid-bg min-h-screen"
        style={{ background: NW.bg }}
      >
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
                Why Agents in the User Journey?
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Capture correct information upfront — eliminate rework, reduce
                wait times, increase RFT and STP
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

          {/* Problem statement */}
          <section
            className="mt-6 rounded-xl border-2 border-dashed p-4"
            style={{ borderColor: `${NW.warn}66`, background: `${NW.warn}08` }}
          >
            <div
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
              style={{ color: NW.warn }}
            >
              <AlertTriangle className="size-4" />
              The Problem
            </div>
            <p className="mt-1.5 text-sm leading-relaxed">
              When analysts find missing or incorrect information, they must
              contact the customer and <strong>wait for a response</strong> —
              often days. This back-and-forth is the{" "}
              <strong>biggest cause of delay</strong> in onboarding and kills
              both RFT (Right First Time) and STP (Straight Through Processing).
            </p>
          </section>

          {/* Two-flow comparison */}
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {/* Traditional flow */}
            <TraditionalFlow position={tradPos} />

            {/* Agent-enhanced flow */}
            <AgentEnhancedFlow position={agentPos} />
          </div>

          {/* Metrics comparison */}
          <MetricsComparison />

          {/* Pilot agents detail */}
          <PilotAgentsSection />

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

/* ---------- Traditional Flow (with delays) ---------- */
function TraditionalFlow({ position }: { position: number }) {
  const steps = [
    { id: 1, label: "Customer", icon: User, type: "start" },
    { id: 2, label: "Submit App", icon: FileSearch, type: "action" },
    { id: 3, label: "Analyst Review", icon: UserCheck, type: "human" },
    { id: 4, label: "Issue Found", icon: AlertTriangle, type: "error" },
    { id: 5, label: "Contact Customer", icon: RefreshCw, type: "wait" },
    { id: 6, label: "WAIT 2-5 Days", icon: Clock, type: "delay" },
    { id: 7, label: "Customer Responds", icon: User, type: "action" },
    { id: 8, label: "Re-submit", icon: FileSearch, type: "action" },
    { id: 9, label: "Analyst Re-review", icon: UserCheck, type: "human" },
    { id: 10, label: "Approved", icon: CheckCircle2, type: "ok" },
  ]

  const activeStep = Math.min(position, steps.length - 1)

  return (
    <div className="rounded-2xl border-2 bg-card p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <div
          className="flex size-8 items-center justify-center rounded-full"
          style={{ background: `${NW.error}15`, color: NW.error }}
        >
          <X className="size-4" />
        </div>
        <div>
          <h3 className="font-bold" style={{ color: NW.error }}>
            Traditional Flow
          </h3>
          <p className="text-xs text-muted-foreground">
            Back-and-forth delays kill STP
          </p>
        </div>
      </div>

      {/* Flow visualization */}
      <div className="relative mt-4 overflow-hidden rounded-xl bg-muted/30 p-4">
        <svg
          viewBox="0 0 500 320"
          className="w-full"
          style={{ maxHeight: 320 }}
        >
          {/* Flow path - zigzag to show back-and-forth */}
          <path
            d="M40 40 L140 40 L140 80 L240 80 L240 120 L340 120 L340 160 L240 160 L140 160 L140 200 L240 200 L340 200 L340 240 L440 240 L440 280"
            fill="none"
            stroke={`${NW.wait}44`}
            strokeWidth="3"
            strokeDasharray="6 4"
          />

          {/* Animated packet */}
          <circle r="8" fill={NW.error}>
            <animateMotion
              dur={`${12 * 0.8}s`}
              repeatCount="indefinite"
              path="M40 40 L140 40 L140 80 L240 80 L240 120 L340 120 L340 160 L240 160 L140 160 L140 200 L240 200 L340 200 L340 240 L440 240 L440 280"
            />
          </circle>

          {/* Step nodes */}
          {steps.map((step, i) => {
            const positions = [
              { x: 40, y: 40 },
              { x: 140, y: 40 },
              { x: 240, y: 80 },
              { x: 340, y: 120 },
              { x: 340, y: 160 },
              { x: 240, y: 160 },
              { x: 140, y: 160 },
              { x: 140, y: 200 },
              { x: 240, y: 200 },
              { x: 440, y: 280 },
            ]
            const pos = positions[i]
            const isActive = i === activeStep
            const isPast = i < activeStep
            const isDelay = step.type === "delay" || step.type === "wait"
            const isError = step.type === "error"

            let fill = NW.wait
            if (isError) fill = NW.error
            else if (isDelay) fill = NW.warn
            else if (step.type === "ok") fill = NW.ok
            else if (step.type === "human") fill = NW.human
            else if (isPast || isActive) fill = NW.primary

            return (
              <g key={step.id}>
                {/* Node circle */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isActive ? 18 : 14}
                  fill={fill}
                  opacity={isPast || isActive ? 1 : 0.4}
                  className={isActive ? "animate-pulse" : ""}
                />
                {/* Icon placeholder - just number */}
                <text
                  x={pos.x}
                  y={pos.y + 4}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="bold"
                  fill="white"
                >
                  {i + 1}
                </text>
                {/* Label */}
                <text
                  x={pos.x}
                  y={pos.y + 32}
                  textAnchor="middle"
                  fontSize="9"
                  fontWeight="600"
                  fill={isDelay || isError ? fill : NW.primary}
                  opacity={isPast || isActive ? 1 : 0.5}
                >
                  {step.label}
                </text>
              </g>
            )
          })}

          {/* Delay indicator */}
          <rect
            x="160"
            y="145"
            width="80"
            height="30"
            rx="4"
            fill={`${NW.warn}22`}
            stroke={NW.warn}
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />
          <text
            x="200"
            y="164"
            textAnchor="middle"
            fontSize="10"
            fontWeight="bold"
            fill={NW.warn}
          >
            WAIT
          </text>
        </svg>
      </div>

      {/* Stats */}
      <div className="mt-3 flex flex-wrap gap-3">
        <StatBadge label="Cycle Time" value="5-7 days" color={NW.error} />
        <StatBadge label="RFT" value="~62%" color={NW.warn} />
        <StatBadge label="STP" value="~28%" color={NW.error} />
      </div>
    </div>
  )
}

/* ---------- Agent-Enhanced Flow ---------- */
function AgentEnhancedFlow({ position }: { position: number }) {
  const steps = [
    { id: 1, label: "Customer", icon: User, type: "start" },
    { id: 2, label: "Agents Validate", icon: Bot, type: "agent" },
    { id: 3, label: "Clean Submit", icon: CheckCircle2, type: "ok" },
    { id: 4, label: "Analyst Review", icon: UserCheck, type: "human" },
    { id: 5, label: "Approved", icon: ShieldCheck, type: "ok" },
  ]

  const activeStep = Math.min(position, steps.length - 1)

  return (
    <div
      className="rounded-2xl border-2 bg-card p-4 shadow-sm"
      style={{ borderColor: `${NW.ok}44` }}
    >
      <div className="flex items-center gap-2">
        <div
          className="flex size-8 items-center justify-center rounded-full"
          style={{ background: `${NW.ok}15`, color: NW.ok }}
        >
          <Check className="size-4" />
        </div>
        <div>
          <h3 className="font-bold" style={{ color: NW.ok }}>
            Agent-Enhanced Flow
          </h3>
          <p className="text-xs text-muted-foreground">
            Validate at source, eliminate rework
          </p>
        </div>
      </div>

      {/* Flow visualization */}
      <div className="relative mt-4 overflow-hidden rounded-xl bg-muted/30 p-4">
        <svg
          viewBox="0 0 500 320"
          className="w-full"
          style={{ maxHeight: 320 }}
        >
          {/* Straight flow path */}
          <path
            d="M40 160 L460 160"
            fill="none"
            stroke={`${NW.ok}44`}
            strokeWidth="4"
          />
          {/* Animated dashed overlay */}
          <path
            d="M40 160 L460 160"
            fill="none"
            stroke={NW.ok}
            strokeWidth="3"
            strokeDasharray="8 6"
            className="animate-flow-dash"
          />

          {/* Agent validation zone */}
          <rect
            x="100"
            y="80"
            width="180"
            height="160"
            rx="12"
            fill={`${NW.agent}08`}
            stroke={NW.agent}
            strokeWidth="2"
            strokeDasharray="6 3"
          />
          <text
            x="190"
            y="100"
            textAnchor="middle"
            fontSize="10"
            fontWeight="bold"
            fill={NW.agent}
          >
            REAL-TIME AGENT VALIDATION
          </text>

          {/* Mini agent nodes in validation zone */}
          {PILOT_AGENTS.map((agent, i) => {
            const x = 130 + (i % 2) * 100
            const y = 130 + Math.floor(i / 2) * 50
            return (
              <g key={agent.id}>
                <circle
                  cx={x}
                  cy={y}
                  r="16"
                  fill={agent.color}
                  className="animate-pulse"
                  style={{ animationDelay: `${i * 0.3}s` }}
                />
                <text
                  x={x}
                  y={y + 4}
                  textAnchor="middle"
                  fontSize="8"
                  fontWeight="bold"
                  fill="white"
                >
                  {agent.short.slice(0, 3)}
                </text>
              </g>
            )
          })}

          {/* Data flow arrows into agents */}
          <path
            d="M60 160 Q100 130 130 130"
            fill="none"
            stroke={NW.agent}
            strokeWidth="2"
            markerEnd="url(#arrow)"
            opacity="0.6"
          />

          {/* Main flow nodes */}
          {steps.map((step, i) => {
            const xPositions = [40, 190, 300, 380, 460]
            const x = xPositions[i]
            const y = 160
            const isActive = i === activeStep
            const isPast = i < activeStep

            let fill = NW.wait
            if (step.type === "agent") fill = NW.agent
            else if (step.type === "ok") fill = NW.ok
            else if (step.type === "human") fill = NW.human
            else if (isPast || isActive) fill = NW.primary

            return (
              <g key={step.id}>
                <circle
                  cx={x}
                  cy={y}
                  r={isActive ? 20 : 16}
                  fill={fill}
                  opacity={isPast || isActive ? 1 : 0.4}
                  className={isActive ? "animate-pulse" : ""}
                />
                <text
                  x={x}
                  y={y + 4}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="bold"
                  fill="white"
                >
                  {i + 1}
                </text>
                <text
                  x={x}
                  y={y + 38}
                  textAnchor="middle"
                  fontSize="9"
                  fontWeight="600"
                  fill={fill}
                  opacity={isPast || isActive ? 1 : 0.5}
                >
                  {step.label}
                </text>
              </g>
            )
          })}

          {/* Animated packet */}
          <circle r="10" fill={NW.ok}>
            <animateMotion
              dur="4s"
              repeatCount="indefinite"
              path="M40 160 L460 160"
            />
          </circle>
          <circle r="6" fill="white" opacity="0.8">
            <animateMotion
              dur="4s"
              repeatCount="indefinite"
              path="M40 160 L460 160"
            />
          </circle>

          {/* Arrow marker */}
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill={NW.agent} />
            </marker>
          </defs>
        </svg>
      </div>

      {/* Stats */}
      <div className="mt-3 flex flex-wrap gap-3">
        <StatBadge label="Cycle Time" value="4-8 hrs" color={NW.ok} />
        <StatBadge label="RFT" value="~94%" color={NW.ok} />
        <StatBadge label="STP" value="~78%" color={NW.ok} />
      </div>
    </div>
  )
}

/* ---------- Metrics Comparison ---------- */
function MetricsComparison() {
  const metrics = [
    {
      label: "Right First Time (RFT)",
      before: 62,
      after: 94,
      unit: "%",
      desc: "Applications complete and correct on first submission",
    },
    {
      label: "Straight Through Processing (STP)",
      before: 28,
      after: 78,
      unit: "%",
      desc: "Cases requiring zero human intervention",
    },
    {
      label: "Average Cycle Time",
      before: 5.5,
      after: 0.5,
      unit: " days",
      desc: "Time from application to account live",
      invert: true,
    },
    {
      label: "Customer Contacts",
      before: 2.3,
      after: 0.2,
      unit: " avg",
      desc: "Back-and-forth requests for information",
      invert: true,
    },
  ]

  return (
    <section className="mt-6">
      <h2
        className="text-lg font-bold"
        style={{ color: NW.primary }}
      >
        Impact on Key Metrics
      </h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => {
          const improvement = m.invert
            ? Math.round(((m.before - m.after) / m.before) * 100)
            : Math.round(((m.after - m.before) / m.before) * 100)

          return (
            <div
              key={m.label}
              className="rounded-xl border bg-card p-3 shadow-xs"
            >
              <div className="text-xs font-semibold text-muted-foreground">
                {m.label}
              </div>
              <div className="mt-2 flex items-end gap-2">
                <span
                  className="text-sm line-through opacity-50"
                  style={{ color: NW.error }}
                >
                  {m.before}
                  {m.unit}
                </span>
                <ArrowRight className="size-3 text-muted-foreground" />
                <span
                  className="text-xl font-bold"
                  style={{ color: NW.ok }}
                >
                  {m.after}
                  {m.unit}
                </span>
              </div>
              <div
                className="mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold"
                style={{ background: `${NW.ok}15`, color: NW.ok }}
              >
                <TrendingUp className="size-3" />+{improvement}%
              </div>
              <p className="mt-1.5 text-[11px] leading-snug text-muted-foreground">
                {m.desc}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

/* ---------- Pilot Agents Section ---------- */
function PilotAgentsSection() {
  return (
    <section className="mt-6">
      <h2 className="text-lg font-bold" style={{ color: NW.primary }}>
        Pilot Agents for User Journey
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        These agents validate information in real-time as the customer fills the
        application — before submission.
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {PILOT_AGENTS.map((agent) => (
          <div
            key={agent.id}
            className="rounded-xl border-2 bg-card p-3 shadow-xs transition hover:-translate-y-0.5 hover:shadow-md"
            style={{ borderColor: `${agent.color}44` }}
          >
            <div className="flex items-center gap-2">
              <div
                className="flex size-8 items-center justify-center rounded-full text-white"
                style={{ background: agent.color }}
              >
                <Bot className="size-4" />
              </div>
              <div
                className="text-sm font-bold leading-tight"
                style={{ color: agent.color }}
              >
                {agent.name}
              </div>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {agent.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ---------- Stat Badge ---------- */
function StatBadge({
  label,
  value,
  color,
}: {
  label: string
  value: string
  color: string
}) {
  return (
    <div
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1"
      style={{ borderColor: `${color}44`, background: `${color}08` }}
    >
      <span className="text-[10px] font-medium text-muted-foreground">
        {label}
      </span>
      <span className="text-xs font-bold" style={{ color }}>
        {value}
      </span>
    </div>
  )
}
