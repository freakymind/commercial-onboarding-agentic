"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  AlertTriangle,
  ArrowLeft,
  Bot,
  CheckCircle2,
  Clock,
  Pause,
  Play,
  ThumbsDown,
  ThumbsUp,
  User,
  XCircle,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"

/* ---------- Colors ---------- */
const COLORS = {
  primary: "#5a287d",
  customer: "#0ea5e9",
  analyst: "#7c3aed",
  agent: "#10b981",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  muted: "#64748b",
  bg: "#faf8fc",
}

/* ---------- Pilot agents ---------- */
const AGENTS = [
  { name: "SOF", color: "#7b2d8e", desc: "Source of Funds" },
  { name: "BizVerify", color: "#bd0f72", desc: "Company/VAT check" },
  { name: "Directors", color: "#5a287d", desc: "Director & UBO" },
  { name: "SIC", color: "#1a8754", desc: "Industry code" },
]

/* ---------- Main component ---------- */
export function UserJourneyFlow() {
  const [playing, setPlaying] = useState(true)
  const [tradStep, setTradStep] = useState(0)
  const [agentStep, setAgentStep] = useState(0)

  // Traditional: slower with a big pause at waiting step
  useEffect(() => {
    if (!playing) return
    // Step 4 is WAITING - make it much longer
    const durations = [2500, 2500, 3000, 2500, 7000, 2500, 3000, 2500]
    const timeout = setTimeout(() => {
      setTradStep((s) => (s + 1) % 8)
    }, durations[tradStep])
    return () => clearTimeout(timeout)
  }, [playing, tradStep])

  // Agent: smooth consistent pace
  useEffect(() => {
    if (!playing) return
    const timeout = setTimeout(() => {
      setAgentStep((s) => (s + 1) % 7)
    }, 2200)
    return () => clearTimeout(timeout)
  }, [playing, agentStep])

  return (
    <main className="min-h-screen" style={{ background: COLORS.bg }}>
      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6">
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link href="/flow" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
              <ArrowLeft className="size-3" /> Back to Flow
            </Link>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl" style={{ color: COLORS.primary }}>
              Why Agents in the User Journey?
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              See the difference: Traditional onboarding with issues vs Agent-enhanced smooth flow
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setPlaying((p) => !p)} className="gap-1.5">
            {playing ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
            {playing ? "Pause" : "Play"}
          </Button>
        </header>

        {/* Side by side journeys */}
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* NOT HAPPY PATH - Traditional */}
          <NotHappyPath step={tradStep} />

          {/* HAPPY PATH - With Agents */}
          <HappyPath step={agentStep} />
        </div>

        {/* Bottom summary */}
        <div className="mt-8 rounded-2xl border-2 p-6" style={{ borderColor: `${COLORS.success}44`, background: `${COLORS.success}05` }}>
          <div className="flex items-start gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-full text-white" style={{ background: COLORS.success }}>
              <Zap className="size-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold" style={{ color: COLORS.success }}>
                The Key Insight
              </h3>
              <p className="mt-1 text-muted-foreground">
                In traditional flow, analysts discover issues <strong>after submission</strong> and must wait 2-5 days for customer response.
                With agents validating <strong>during the session</strong>, issues are fixed immediately — the analyst receives clean, complete applications.
              </p>
              <div className="mt-4 flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <span className="rounded-full px-3 py-1 text-sm font-bold text-white" style={{ background: COLORS.success }}>RFT</span>
                  <span className="text-lg font-bold">62% → 94%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full px-3 py-1 text-sm font-bold text-white" style={{ background: COLORS.success }}>STP</span>
                  <span className="text-lg font-bold">28% → 78%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Agent cards */}
        <div className="mt-8">
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Pilot Agents</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {AGENTS.map((agent) => (
              <div key={agent.name} className="flex items-center gap-3 rounded-lg border p-3" style={{ borderColor: `${agent.color}44` }}>
                <div className="flex size-10 items-center justify-center rounded-full text-white" style={{ background: agent.color }}>
                  <Bot className="size-5" />
                </div>
                <div>
                  <div className="font-semibold" style={{ color: agent.color }}>{agent.name}</div>
                  <div className="text-xs text-muted-foreground">{agent.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

/* ============================================================
   NOT HAPPY PATH - Traditional Journey with problems
   ============================================================ */
function NotHappyPath({ step }: { step: number }) {
  const stages = [
    { label: "Customer fills form", icon: User, lane: "customer", status: "active" },
    { label: "Customer submits", icon: CheckCircle2, lane: "customer", status: "done" },
    { label: "Analyst reviews", icon: User, lane: "analyst", status: "working" },
    { label: "ISSUE FOUND!", icon: XCircle, lane: "analyst", status: "error" },
    { label: "WAITING 2-5 DAYS", icon: Clock, lane: "waiting", status: "blocked" },
    { label: "Customer responds", icon: User, lane: "customer", status: "delayed" },
    { label: "Re-review needed", icon: User, lane: "analyst", status: "rework" },
    { label: "Finally approved", icon: CheckCircle2, lane: "analyst", status: "done" },
  ]

  const current = stages[step]
  const isBlocked = step === 4

  return (
    <div className="rounded-2xl border-2 overflow-hidden" style={{ borderColor: `${COLORS.error}66` }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4" style={{ background: `${COLORS.error}10` }}>
        <div className="flex items-center gap-3">
          <ThumbsDown className="size-6" style={{ color: COLORS.error }} />
          <div>
            <h2 className="text-lg font-bold" style={{ color: COLORS.error }}>Not Happy Path</h2>
            <p className="text-xs text-muted-foreground">Traditional: Issues found after submit</p>
          </div>
        </div>
        {isBlocked && (
          <div className="rounded-full px-3 py-1 text-xs font-bold text-white animate-pulse" style={{ background: COLORS.warning }}>
            BLOCKED
          </div>
        )}
      </div>

      {/* Current stage display */}
      <div className="px-5 py-4 border-b" style={{ 
        background: isBlocked ? `${COLORS.warning}15` : current.status === "error" ? `${COLORS.error}10` : "white",
        borderColor: `${COLORS.error}22`
      }}>
        <div className="flex items-center gap-4">
          <div className={`flex size-12 items-center justify-center rounded-full text-white ${isBlocked ? "animate-pulse" : ""}`}
            style={{ 
              background: isBlocked ? COLORS.warning : current.status === "error" ? COLORS.error : current.lane === "customer" ? COLORS.customer : COLORS.analyst 
            }}>
            <current.icon className="size-6" />
          </div>
          <div className="flex-1">
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Step {step + 1} of 8
            </div>
            <div className="text-lg font-bold">{current.label}</div>
            {isBlocked && (
              <div className="mt-1 text-sm font-medium" style={{ color: COLORS.warning }}>
                Case sits idle while waiting for customer to respond...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Visual flow */}
      <div className="px-5 py-6" style={{ background: "white" }}>
        <div className="flex items-center justify-between gap-2">
          {stages.map((stage, i) => {
            const isActive = i === step
            const isPast = i < step
            const isError = stage.status === "error" && (isActive || isPast)
            const isWait = stage.status === "blocked" && (isActive || isPast)
            
            let bgColor = `${COLORS.muted}30`
            if (isPast || isActive) {
              if (isError) bgColor = COLORS.error
              else if (isWait) bgColor = COLORS.warning
              else if (stage.lane === "customer") bgColor = COLORS.customer
              else bgColor = COLORS.analyst
            }

            return (
              <div key={i} className="flex flex-col items-center flex-1">
                {/* Node */}
                <div
                  className={`flex size-10 items-center justify-center rounded-full text-white transition-all ${isActive ? "ring-4 ring-offset-2" : ""}`}
                  style={{ 
                    background: bgColor,
                    ringColor: isError ? COLORS.error : isWait ? COLORS.warning : COLORS.analyst
                  }}
                >
                  {isPast ? (
                    <CheckCircle2 className="size-5" />
                  ) : isActive ? (
                    <stage.icon className="size-5" />
                  ) : (
                    <span className="text-sm font-bold">{i + 1}</span>
                  )}
                </div>
                {/* Label */}
                <div className={`mt-2 text-center text-[10px] leading-tight ${isActive ? "font-bold" : "text-muted-foreground"}`}
                  style={{ color: isActive ? (isError ? COLORS.error : isWait ? COLORS.warning : COLORS.analyst) : undefined }}>
                  {stage.label}
                </div>
                {/* Connector line */}
                {i < stages.length - 1 && (
                  <div className="absolute" style={{ left: `${(i + 0.5) * (100 / stages.length)}%`, top: "20px" }}>
                    {/* Lines drawn between nodes would go here but keeping simple */}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Zigzag indicator */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <span className="px-2 py-0.5 rounded" style={{ background: `${COLORS.customer}20`, color: COLORS.customer }}>Customer</span>
          <span>→</span>
          <span className="px-2 py-0.5 rounded" style={{ background: `${COLORS.analyst}20`, color: COLORS.analyst }}>Analyst</span>
          <span>→</span>
          <span className="px-2 py-0.5 rounded" style={{ background: `${COLORS.error}20`, color: COLORS.error }}>Issue!</span>
          <span>→</span>
          <span className="px-2 py-0.5 rounded" style={{ background: `${COLORS.warning}20`, color: COLORS.warning }}>Wait...</span>
          <span>→</span>
          <span className="px-2 py-0.5 rounded" style={{ background: `${COLORS.customer}20`, color: COLORS.customer }}>Customer</span>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 border-t text-center" style={{ borderColor: `${COLORS.error}22` }}>
        <div className="border-r p-4" style={{ borderColor: `${COLORS.error}22`, background: `${COLORS.error}05` }}>
          <div className="text-xs font-bold uppercase text-muted-foreground">Right First Time</div>
          <div className="text-2xl font-bold" style={{ color: COLORS.error }}>62%</div>
        </div>
        <div className="p-4" style={{ background: `${COLORS.error}05` }}>
          <div className="text-xs font-bold uppercase text-muted-foreground">Straight Through</div>
          <div className="text-2xl font-bold" style={{ color: COLORS.error }}>28%</div>
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   HAPPY PATH - Agent-Enhanced Journey - Smooth flow
   ============================================================ */
function HappyPath({ step }: { step: number }) {
  const stages = [
    { label: "Customer starts", icon: User, type: "customer" },
    { label: "SOF validates", icon: Bot, type: "agent", agentIdx: 0 },
    { label: "BizVerify checks", icon: Bot, type: "agent", agentIdx: 1 },
    { label: "Directors checks", icon: Bot, type: "agent", agentIdx: 2 },
    { label: "SIC validates", icon: Bot, type: "agent", agentIdx: 3 },
    { label: "Clean submit!", icon: CheckCircle2, type: "success" },
    { label: "Fast approved!", icon: CheckCircle2, type: "complete" },
  ]

  const current = stages[step]
  const isAgentStep = current.type === "agent"

  return (
    <div className="rounded-2xl border-2 overflow-hidden" style={{ borderColor: `${COLORS.success}66` }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4" style={{ background: `${COLORS.success}10` }}>
        <div className="flex items-center gap-3">
          <ThumbsUp className="size-6" style={{ color: COLORS.success }} />
          <div>
            <h2 className="text-lg font-bold" style={{ color: COLORS.success }}>Happy Path</h2>
            <p className="text-xs text-muted-foreground">With Agents: Issues fixed before submit</p>
          </div>
        </div>
        {isAgentStep && (
          <div className="rounded-full px-3 py-1 text-xs font-bold text-white" style={{ background: AGENTS[current.agentIdx!].color }}>
            {AGENTS[current.agentIdx!].name} Active
          </div>
        )}
      </div>

      {/* Current stage display */}
      <div className="px-5 py-4 border-b" style={{ background: "white", borderColor: `${COLORS.success}22` }}>
        <div className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-full text-white"
            style={{ background: isAgentStep ? AGENTS[current.agentIdx!].color : current.type === "success" || current.type === "complete" ? COLORS.success : COLORS.customer }}>
            <current.icon className="size-6" />
          </div>
          <div className="flex-1">
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Step {step + 1} of 7
            </div>
            <div className="text-lg font-bold">{current.label}</div>
            {isAgentStep && (
              <div className="mt-1 text-sm" style={{ color: AGENTS[current.agentIdx!].color }}>
                Real-time validation — issues fixed immediately
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Visual flow - straight line */}
      <div className="px-5 py-6" style={{ background: "white" }}>
        <div className="flex items-center justify-between gap-2">
          {stages.map((stage, i) => {
            const isActive = i === step
            const isPast = i < step
            const isAgent = stage.type === "agent"
            
            let bgColor = `${COLORS.muted}30`
            if (isPast || isActive) {
              if (isAgent) bgColor = AGENTS[stage.agentIdx!].color
              else if (stage.type === "success" || stage.type === "complete") bgColor = COLORS.success
              else bgColor = COLORS.customer
            }

            return (
              <div key={i} className="flex flex-col items-center flex-1">
                {/* Node */}
                <div
                  className={`flex size-10 items-center justify-center rounded-full text-white transition-all ${isActive ? "ring-4 ring-offset-2" : ""}`}
                  style={{ 
                    background: bgColor,
                    ringColor: isAgent ? AGENTS[stage.agentIdx!].color : COLORS.success
                  }}
                >
                  {isPast ? (
                    <CheckCircle2 className="size-5" />
                  ) : isActive ? (
                    <stage.icon className="size-5" />
                  ) : (
                    <span className="text-sm font-bold">{i + 1}</span>
                  )}
                </div>
                {/* Label */}
                <div className={`mt-2 text-center text-[10px] leading-tight ${isActive ? "font-bold" : "text-muted-foreground"}`}
                  style={{ color: isActive ? (isAgent ? AGENTS[stage.agentIdx!].color : COLORS.success) : undefined }}>
                  {stage.label}
                </div>
              </div>
            )
          })}
        </div>

        {/* Smooth flow indicator */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <span className="px-2 py-0.5 rounded" style={{ background: `${COLORS.customer}20`, color: COLORS.customer }}>Start</span>
          <span>→</span>
          <span className="px-2 py-0.5 rounded" style={{ background: `${COLORS.agent}20`, color: COLORS.agent }}>Agents validate</span>
          <span>→</span>
          <span className="px-2 py-0.5 rounded" style={{ background: `${COLORS.success}20`, color: COLORS.success }}>Clean!</span>
          <span>→</span>
          <span className="px-2 py-0.5 rounded" style={{ background: `${COLORS.success}20`, color: COLORS.success }}>Approved!</span>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 border-t text-center" style={{ borderColor: `${COLORS.success}22` }}>
        <div className="border-r p-4" style={{ borderColor: `${COLORS.success}22`, background: `${COLORS.success}05` }}>
          <div className="text-xs font-bold uppercase text-muted-foreground">Right First Time</div>
          <div className="text-2xl font-bold" style={{ color: COLORS.success }}>94%</div>
        </div>
        <div className="p-4" style={{ background: `${COLORS.success}05` }}>
          <div className="text-xs font-bold uppercase text-muted-foreground">Straight Through</div>
          <div className="text-2xl font-bold" style={{ color: COLORS.success }}>78%</div>
        </div>
      </div>
    </div>
  )
}
