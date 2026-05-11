"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  AlertTriangle,
  ArrowLeft,
  Bot,
  Check,
  CheckCircle2,
  Clock,
  FileSearch,
  MessageSquare,
  Pause,
  Play,
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

/* ---------- Pilot agents ---------- */
const PILOT_AGENTS = [
  { id: "sof", name: "SOF Capture Agent", short: "SOF", color: "#7b2d8e" },
  { id: "biz", name: "Business Verification Agent", short: "BizVerify", color: "#bd0f72" },
  { id: "director", name: "Director Check Agent", short: "Directors", color: "#5a287d" },
  { id: "sic", name: "SIC Review Agent", short: "SIC", color: "#1a8754" },
]

/* ---------- Traditional journey steps (with waiting) ---------- */
const TRADITIONAL_STEPS = [
  { id: "t1", label: "Customer Submits", overlay: "Customer completes and submits application", type: "customer" },
  { id: "t2", label: "Application Queued", overlay: "Application enters analyst queue — may wait hours or days", type: "queue" },
  { id: "t3", label: "Analyst Reviews", overlay: "Analyst manually checks SOF, business details, directors, SIC codes", type: "analyst" },
  { id: "t4", label: "Issue Found!", overlay: "Missing SOF documentation, director mismatch, invalid SIC code", type: "error" },
  { id: "t5", label: "Contact Customer", overlay: "Analyst emails/calls customer requesting missing information", type: "contact" },
  { id: "t6", label: "WAITING...", overlay: "Customer may take 2-5 days to respond — analyst moves to other cases", type: "wait" },
  { id: "t7", label: "Customer Responds", overlay: "Customer finally provides the requested information", type: "respond" },
  { id: "t8", label: "Re-Review", overlay: "Analyst must re-review the updated application from scratch", type: "analyst" },
  { id: "t9", label: "Approved", overlay: "Finally approved after 5-7 days total cycle time", type: "complete" },
]

/* ---------- Agent-enhanced journey steps (real-time) ---------- */
const AGENT_STEPS = [
  { id: "a1", label: "Customer Starts", overlay: "Customer begins filling the onboarding form", type: "customer" },
  { id: "a2", label: "SOF Agent Checks", overlay: "Real-time: Agent validates Source of Funds as customer types", type: "agent", agentIdx: 0 },
  { id: "a3", label: "Issue? Prompt Now!", overlay: "Missing info? Agent immediately prompts customer to fix it", type: "prompt" },
  { id: "a4", label: "BizVerify Checks", overlay: "Real-time: Agent verifies company against Companies House", type: "agent", agentIdx: 1 },
  { id: "a5", label: "Directors Checks", overlay: "Real-time: Agent cross-checks director details against registry", type: "agent", agentIdx: 2 },
  { id: "a6", label: "SIC Agent Checks", overlay: "Real-time: Agent confirms SIC codes match declared activity", type: "agent", agentIdx: 3 },
  { id: "a7", label: "Clean Submit", overlay: "All validated! Complete, high-quality application submitted", type: "success" },
  { id: "a8", label: "Analyst Reviews", overlay: "Analyst receives pre-validated application — minimal effort", type: "analyst" },
  { id: "a9", label: "Fast Approved!", overlay: "Approved in hours, not days — no back-and-forth needed", type: "complete" },
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
  const [speedIdx, setSpeedIdx] = useState(0) // Default Slow
  const [tradStep, setTradStep] = useState(0)
  const [agentStep, setAgentStep] = useState(0)

  // Sync both journeys
  useEffect(() => {
    if (!playing) return
    const interval = setInterval(() => {
      setTradStep((s) => (s + 1) % TRADITIONAL_STEPS.length)
      setAgentStep((s) => (s + 1) % AGENT_STEPS.length)
    }, SPEEDS[speedIdx].ms)
    return () => clearInterval(interval)
  }, [playing, speedIdx])

  const tradCurrent = TRADITIONAL_STEPS[tradStep]
  const agentCurrent = AGENT_STEPS[agentStep]

  return (
    <main className="min-h-screen bg-background">
      <div className="nw-grid-bg min-h-screen" style={{ background: NW.bg }}>
        <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6">
          {/* Header */}
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <Link
                href="/flow"
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="size-3" />
                Back to Flow
              </Link>
              <h1
                className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl"
                style={{ color: NW.primary }}
              >
                Why Agents in the User Journey?
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                Compare traditional analyst-driven onboarding vs agent-enhanced capture.
                See how real-time validation eliminates the costly wait-loop.
              </p>
            </div>
            <div className="flex items-center gap-2">
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
                {playing ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
                {playing ? "Pause" : "Play"}
              </Button>
            </div>
          </header>

          {/* Side-by-side comparison */}
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {/* Traditional Journey */}
            <JourneyPanel
              title="Traditional: Analyst Finds Issues Later"
              subtitle="Submit → Review → Issue → Wait → Re-review"
              steps={TRADITIONAL_STEPS}
              currentIdx={tradStep}
              currentStep={tradCurrent}
              variant="traditional"
              cycleTime="5-7 days"
              rft="~62%"
              stp="~28%"
            />

            {/* Agent-Enhanced Journey */}
            <JourneyPanel
              title="Agent-Enhanced: Fix Issues Now"
              subtitle="Fill → Validate → Prompt → Submit Clean"
              steps={AGENT_STEPS}
              currentIdx={agentStep}
              currentStep={agentCurrent}
              variant="agent"
              cycleTime="4-8 hours"
              rft="~94%"
              stp="~78%"
            />
          </div>

          {/* Key insight callout */}
          <div
            className="mt-6 rounded-xl border-2 p-4"
            style={{ borderColor: `${NW.ok}44`, background: `${NW.ok}08` }}
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="flex items-center gap-3">
                <div
                  className="flex size-12 shrink-0 items-center justify-center rounded-full text-white"
                  style={{ background: NW.ok }}
                >
                  <Zap className="size-6" />
                </div>
                <div>
                  <h3 className="font-bold" style={{ color: NW.ok }}>
                    The Core Problem Solved
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    In traditional flow, analysts discover issues <strong>after</strong> submission.
                    Customer contact and wait time (2-5 days) is the biggest delay.
                  </p>
                </div>
              </div>
              <div className="flex-1 lg:text-right">
                <p className="text-sm font-medium text-muted-foreground">
                  Agents validate <strong>during</strong> the customer session.
                  Issues are fixed <strong>before</strong> submission.
                  Analysts receive clean, high-quality applications.
                </p>
                <p className="mt-1 text-lg font-bold" style={{ color: NW.ok }}>
                  Result: Higher RFT, Higher STP, Faster Onboarding
                </p>
              </div>
            </div>
          </div>

          {/* Pilot agents */}
          <div className="mt-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Initial Pilot Agents
            </h3>
            <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {PILOT_AGENTS.map((agent) => (
                <div
                  key={agent.id}
                  className="rounded-lg border p-3"
                  style={{ borderColor: `${agent.color}44`, background: `${agent.color}05` }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="flex size-8 items-center justify-center rounded-full text-white"
                      style={{ background: agent.color }}
                    >
                      <Bot className="size-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold" style={{ color: agent.color }}>
                        {agent.name}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        Validates in real-time during form fill
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

/* ---------- Journey Panel Component ---------- */
function JourneyPanel({
  title,
  subtitle,
  steps,
  currentIdx,
  currentStep,
  variant,
  cycleTime,
  rft,
  stp,
}: {
  title: string
  subtitle: string
  steps: typeof TRADITIONAL_STEPS
  currentIdx: number
  currentStep: (typeof TRADITIONAL_STEPS)[0]
  variant: "traditional" | "agent"
  cycleTime: string
  rft: string
  stp: string
}) {
  const isTraditional = variant === "traditional"
  const panelColor = isTraditional ? NW.error : NW.ok

  return (
    <div
      className="overflow-hidden rounded-2xl border-2"
      style={{ borderColor: `${panelColor}44` }}
    >
      {/* Panel header */}
      <div
        className="border-b px-4 py-3"
        style={{ background: `${panelColor}08`, borderColor: `${panelColor}22` }}
      >
        <h2 className="font-bold" style={{ color: panelColor }}>
          {isTraditional ? "❌ " : "✓ "}
          {title}
        </h2>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>

      {/* Current step overlay */}
      <div
        key={currentStep.id}
        className="animate-draw-in border-b p-3"
        style={{
          background: getStepBg(currentStep, isTraditional),
          borderColor: `${panelColor}22`,
        }}
      >
        <div className="flex items-center gap-3">
          <StepIcon step={currentStep} isTraditional={isTraditional} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: getStepColor(currentStep, isTraditional) }}
              >
                Step {currentIdx + 1}/{steps.length}
              </span>
              {currentStep.type === "wait" && (
                <span className="animate-pulse rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-700">
                  WAITING 2-5 DAYS
                </span>
              )}
              {currentStep.type === "agent" && (
                <span
                  className="rounded-full px-1.5 py-0.5 text-[9px] font-bold text-white"
                  style={{ background: PILOT_AGENTS[(currentStep as any).agentIdx].color }}
                >
                  {PILOT_AGENTS[(currentStep as any).agentIdx].short}
                </span>
              )}
            </div>
            <div className="mt-0.5 font-semibold text-sm">{currentStep.label}</div>
            <div className="text-xs text-muted-foreground truncate">{currentStep.overlay}</div>
          </div>
        </div>
      </div>

      {/* Flow visualization */}
      <div className="bg-card p-3">
        <svg viewBox="0 0 400 120" className="w-full" style={{ height: 120 }}>
          {/* Background */}
          <rect x="0" y="0" width="400" height="120" fill={NW.bg} rx="8" />

          {/* Flow path */}
          <path
            d={isTraditional 
              ? "M20 60 L60 60 L100 30 L140 90 L180 30 L220 90 L260 60 L300 60 L340 60 L380 60"
              : "M20 60 L380 60"
            }
            fill="none"
            stroke={`${panelColor}33`}
            strokeWidth="3"
          />
          <path
            d={isTraditional 
              ? "M20 60 L60 60 L100 30 L140 90 L180 30 L220 90 L260 60 L300 60 L340 60 L380 60"
              : "M20 60 L380 60"
            }
            fill="none"
            stroke={panelColor}
            strokeWidth="2"
            strokeDasharray="6 4"
            className="animate-flow-dash"
          />

          {/* Step nodes */}
          {steps.map((step, i) => {
            const x = 20 + (i * 360) / (steps.length - 1)
            const y = isTraditional 
              ? (step.type === "error" || step.type === "wait" ? 90 : step.type === "contact" || step.type === "respond" ? 30 : 60)
              : 60
            const isActive = i === currentIdx
            const isPast = i < currentIdx
            const color = getStepColor(step, isTraditional)
            const r = isActive ? 14 : 10

            return (
              <g key={step.id}>
                {isActive && (
                  <circle
                    cx={x}
                    cy={y}
                    r={r + 6}
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    opacity="0.4"
                    className="animate-ping"
                  />
                )}
                <circle
                  cx={x}
                  cy={y}
                  r={r}
                  fill={isPast || isActive ? color : `${color}44`}
                  stroke={color}
                  strokeWidth={isActive ? 2 : 1}
                />
                {/* Step number */}
                <text
                  x={x}
                  y={y + 4}
                  textAnchor="middle"
                  fontSize={isActive ? 10 : 8}
                  fontWeight="bold"
                  fill="white"
                >
                  {i + 1}
                </text>
              </g>
            )
          })}

          {/* Wait indicator for traditional */}
          {isTraditional && currentIdx >= 5 && (
            <g>
              <rect x="150" y="95" width="100" height="18" rx="9" fill={NW.warn} />
              <text x="200" y="107" textAnchor="middle" fontSize="9" fontWeight="bold" fill="white">
                ⏳ WAITING...
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Metrics footer */}
      <div
        className="grid grid-cols-3 border-t text-center"
        style={{ borderColor: `${panelColor}22` }}
      >
        <div className="border-r p-2" style={{ borderColor: `${panelColor}22` }}>
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Cycle Time
          </div>
          <div className="text-sm font-bold" style={{ color: panelColor }}>
            {cycleTime}
          </div>
        </div>
        <div className="border-r p-2" style={{ borderColor: `${panelColor}22` }}>
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            RFT
          </div>
          <div className="text-sm font-bold" style={{ color: panelColor }}>
            {rft}
          </div>
        </div>
        <div className="p-2">
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            STP
          </div>
          <div className="text-sm font-bold" style={{ color: panelColor }}>
            {stp}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---------- Helper: Step Icon ---------- */
function StepIcon({
  step,
  isTraditional,
}: {
  step: (typeof TRADITIONAL_STEPS)[0]
  isTraditional: boolean
}) {
  const color = getStepColor(step, isTraditional)

  const Icon =
    step.type === "customer" || step.type === "respond"
      ? User
      : step.type === "queue"
        ? Clock
        : step.type === "analyst"
          ? FileSearch
          : step.type === "error"
            ? AlertTriangle
            : step.type === "contact"
              ? MessageSquare
              : step.type === "wait"
                ? Clock
                : step.type === "agent"
                  ? Bot
                  : step.type === "prompt"
                    ? MessageSquare
                    : step.type === "success" || step.type === "complete"
                      ? CheckCircle2
                      : Check

  return (
    <div
      className="flex size-10 shrink-0 items-center justify-center rounded-full text-white"
      style={{ background: color }}
    >
      <Icon className="size-5" />
    </div>
  )
}

/* ---------- Helper: Get step color ---------- */
function getStepColor(
  step: (typeof TRADITIONAL_STEPS)[0],
  isTraditional: boolean
): string {
  if (step.type === "error") return NW.error
  if (step.type === "wait") return NW.warn
  if (step.type === "contact" || step.type === "respond") return NW.warn
  if (step.type === "agent") return PILOT_AGENTS[(step as any).agentIdx]?.color || NW.agent
  if (step.type === "prompt") return NW.warn
  if (step.type === "success" || step.type === "complete") return NW.ok
  if (step.type === "analyst") return NW.human
  if (step.type === "queue") return NW.wait
  return isTraditional ? NW.error : NW.ok
}

/* ---------- Helper: Get step background ---------- */
function getStepBg(
  step: (typeof TRADITIONAL_STEPS)[0],
  isTraditional: boolean
): string {
  const color = getStepColor(step, isTraditional)
  return `${color}08`
}
