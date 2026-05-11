"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  CheckCircle2,
  ChevronRight,
  Clock,
  Eye,
  FileSearch,
  Layers,
  Play,
  Pause,
  Search,
  Shield,
  Sparkles,
  TrendingUp,
  User,
  Users,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"

/* ---------- NatWest palette ---------- */
const NW = {
  primary: "#5a287d",
  accent: "#bd0f72",
  human: "#3b82f6",
  agent: "#5a287d",
  shadow: "#f59e0b",
  live: "#10b981",
  muted: "#64748b",
  bg: "#faf8fc",
}

/* ---------- Pilot Agents ---------- */
const PILOT_AGENTS = [
  {
    id: "bv",
    name: "Business Verification",
    short: "BizVerify",
    color: "#7c3aed",
    icon: Search,
    desc: "Validates company registration, structure docs and trading status against Companies House and trusted registries.",
    inputs: ["Company name", "Registration number", "Submitted docs"],
    outputs: ["Verification result", "Confidence score", "Flag list"],
  },
  {
    id: "plausibility",
    name: "Plausibility Agent",
    short: "Plausibility",
    color: "#bd0f72",
    icon: Eye,
    desc: "Triangulates web, maps, registry and document signals to score whether the business plausibly operates as declared.",
    inputs: ["BizVerify output", "Web search", "Maps data", "Customer declarations"],
    outputs: ["Plausibility score", "Contradiction report", "Explainable verdict"],
  },
  {
    id: "sof",
    name: "Source of Funds",
    short: "SOF",
    color: "#0891b2",
    icon: TrendingUp,
    desc: "Analyses bank statements, tax records and financials to validate declared source of funds and expected activity.",
    inputs: ["Bank statements", "Tax docs", "Customer declaration"],
    outputs: ["SOF assessment", "Anomaly flags", "Flow profile"],
  },
  {
    id: "apcmate",
    name: "APCMate",
    short: "APC",
    color: "#059669",
    icon: Shield,
    desc: "Automates Annual Product & Compliance checks, flagging policy breaches and generating remediation tasks.",
    inputs: ["Customer profile", "Product holdings", "Policy rules"],
    outputs: ["Compliance status", "Breach list", "Remediation tasks"],
  },
]

/* ---------- Phases ---------- */
const PHASES = [
  {
    id: "human",
    number: 1,
    title: "Human-Driven Journey",
    subtitle: "Current State",
    desc: "Analysts manually process every application through all 7 stages. Documents are reviewed by eye, registries checked by hand, decisions made case-by-case. Average cycle time: 5-7 days.",
    color: NW.human,
    icon: Users,
  },
  {
    id: "shadow",
    number: 2,
    title: "Shadow Mode — Agents Test",
    subtitle: "Pilot Phase",
    desc: "Agents run in parallel, consuming the same data as analysts. They produce outputs for review but don't drive decisions yet. This lets us measure accuracy, catch edge cases and build trust.",
    color: NW.shadow,
    icon: Eye,
  },
  {
    id: "assisted",
    number: 3,
    title: "Assisted Mode — Agents Assist",
    subtitle: "Adoption Phase",
    desc: "High-confidence agent outputs are surfaced to analysts as recommendations. Analysts approve, override or escalate. Cycle time drops, consistency rises, audit trail improves.",
    color: NW.accent,
    icon: Zap,
  },
  {
    id: "live",
    number: 4,
    title: "Live Mode — Agents Integrated",
    subtitle: "Target State",
    desc: "Agents become part of the journey. They process, decide and hand off automatically. Humans provide oversight (EU AI Act) and handle exceptions only. Cycle time: hours, not days.",
    color: NW.live,
    icon: Bot,
  },
]

/* ---------- Main Component ---------- */
export function AdoptionJourney() {
  const [activePhase, setActivePhase] = useState(0)
  const [playing, setPlaying] = useState(true)

  // Auto-advance phases
  useEffect(() => {
    if (!playing) return
    const interval = setInterval(() => {
      setActivePhase((p) => (p + 1) % PHASES.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [playing])

  const phase = PHASES[activePhase]

  return (
    <main className="min-h-screen bg-background">
      <div className="nw-grid-bg min-h-screen">
        <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6">
          {/* Header */}
          <header className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <Link
                href="/flow"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="size-3.5" />
                Back to Flow
              </Link>
              <h1
                className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl"
                style={{ color: NW.primary }}
              >
                Agent Adoption Roadmap
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                How agents integrate into the onboarding journey — from shadow testing to full automation.
              </p>
            </div>
            <div className="flex items-center gap-2">
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

          {/* Phase selector */}
          <nav className="mt-6 flex flex-wrap items-center gap-2">
            {PHASES.map((p, i) => (
              <button
                key={p.id}
                onClick={() => {
                  setActivePhase(i)
                  setPlaying(false)
                }}
                className={`relative flex items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-semibold transition ${
                  activePhase === i
                    ? "text-white shadow-md"
                    : "bg-card text-muted-foreground hover:border-current"
                }`}
                style={{
                  borderColor: p.color,
                  background: activePhase === i ? p.color : undefined,
                }}
              >
                <p.icon className="size-4" />
                <span className="hidden sm:inline">{p.title}</span>
                <span className="sm:hidden">Phase {p.number}</span>
                {activePhase === i && (
                  <span
                    className="absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rotate-45"
                    style={{ background: p.color }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Main visualization */}
          <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
            {/* Left: Phase diagram */}
            <div
              className="relative overflow-hidden rounded-2xl border-2 bg-card p-4 shadow-sm sm:p-6"
              style={{ borderColor: `${phase.color}33` }}
            >
              <PhaseVisualization phase={phase} phaseIndex={activePhase} />
            </div>

            {/* Right: Phase details + pilot agents */}
            <aside className="space-y-4">
              {/* Phase card */}
              <div
                className="rounded-2xl border-2 bg-card p-4 shadow-sm"
                style={{ borderColor: `${phase.color}55` }}
              >
                <div
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
                  style={{ color: phase.color }}
                >
                  <phase.icon className="size-4" />
                  Phase {phase.number}: {phase.subtitle}
                </div>
                <h2 className="mt-2 text-lg font-bold" style={{ color: phase.color }}>
                  {phase.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {phase.desc}
                </p>

                {/* Progress indicator */}
                <div className="mt-4 flex items-center gap-1">
                  {PHASES.map((_, i) => (
                    <div
                      key={i}
                      className="h-1.5 flex-1 rounded-full transition-all"
                      style={{
                        background: i <= activePhase ? phase.color : "#e2e8f0",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Pilot agents */}
              <div className="rounded-2xl border bg-card p-4 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  <Sparkles className="size-3.5" />
                  Pilot Agents
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  These agents are first to adopt — high impact, measurable outcomes.
                </p>
                <div className="mt-3 space-y-2">
                  {PILOT_AGENTS.map((agent) => (
                    <AgentChip key={agent.id} agent={agent} phaseIndex={activePhase} />
                  ))}
                </div>
              </div>
            </aside>
          </section>

          {/* Benefits by phase */}
          <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PHASES.map((p, i) => (
              <BenefitCard key={p.id} phase={p} active={i === activePhase} />
            ))}
          </section>

          {/* Detailed agent cards */}
          <section className="mt-8">
            <h2 className="text-lg font-bold" style={{ color: NW.primary }}>
              Pilot Agent Details
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Each agent consumes journey data, processes it, and produces structured outputs for analyst review.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {PILOT_AGENTS.map((agent) => (
                <AgentDetailCard key={agent.id} agent={agent} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

/* ---------- Phase Visualization ---------- */
function PhaseVisualization({
  phase,
  phaseIndex,
}: {
  phase: (typeof PHASES)[0]
  phaseIndex: number
}) {
  const isHuman = phaseIndex === 0
  const isShadow = phaseIndex === 1
  const isAssisted = phaseIndex === 2
  const isLive = phaseIndex === 3

  return (
    <div className="relative min-h-[420px]">
      {/* Title */}
      <div className="mb-4 flex items-center gap-2">
        <phase.icon className="size-5" style={{ color: phase.color }} />
        <span className="text-sm font-bold" style={{ color: phase.color }}>
          {phase.title}
        </span>
      </div>

      {/* Journey rail (always present) */}
      <div className="relative">
        {/* Human journey lane */}
        <div
          className="relative rounded-xl border-2 p-4"
          style={{
            borderColor: `${NW.human}44`,
            background: `${NW.human}08`,
          }}
        >
          <div
            className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest"
            style={{ color: NW.human }}
          >
            <Users className="size-3.5" />
            Onboarding Journey {isHuman ? "(Human-Driven)" : "(Data Source)"}
          </div>

          {/* 7 stage chips */}
          <div className="flex flex-wrap gap-2">
            {[
              "Application",
              "Identity",
              "Business",
              "Ownership",
              "Financials",
              "Risk",
              "Monitoring",
            ].map((stage, i) => (
              <div
                key={stage}
                className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium"
                style={{
                  borderColor: `${NW.human}44`,
                  color: NW.human,
                  background: isHuman ? `${NW.human}15` : "white",
                }}
              >
                <span
                  className="flex size-4 items-center justify-center rounded-full text-[9px] font-bold text-white"
                  style={{ background: NW.human }}
                >
                  {i + 1}
                </span>
                {stage}
              </div>
            ))}
          </div>

          {/* Analyst indicator for human phase */}
          {isHuman && (
            <div className="mt-4 flex items-center gap-2 rounded-lg border bg-white p-3" style={{ borderColor: `${NW.human}33` }}>
              <div
                className="flex size-10 items-center justify-center rounded-full"
                style={{ background: `${NW.human}15` }}
              >
                <User className="size-5" style={{ color: NW.human }} />
              </div>
              <div>
                <div className="text-sm font-semibold" style={{ color: NW.human }}>
                  Human Analyst
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Manually processes every step
                </div>
              </div>
              <div className="ml-auto text-right">
                <div className="text-lg font-bold" style={{ color: NW.human }}>
                  5-7 days
                </div>
                <div className="text-[10px] text-muted-foreground">avg cycle time</div>
              </div>
            </div>
          )}
        </div>

        {/* Data flow arrows (shadow/assisted/live) */}
        {!isHuman && (
          <div className="my-3 flex justify-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className="flex size-6 items-center justify-center rounded-full animate-bounce"
                style={{ background: phase.color }}
              >
                <ChevronRight className="size-4 rotate-90 text-white" />
              </div>
              <span className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: phase.color }}>
                {isShadow ? "Data flows to agents" : isAssisted ? "Outputs flow up" : "Agents drive journey"}
              </span>
            </div>
          </div>
        )}

        {/* Agent layer (shadow/assisted/live) */}
        {!isHuman && (
          <div
            className="relative rounded-xl border-2 p-4"
            style={{
              borderColor: `${phase.color}44`,
              background: `${phase.color}08`,
            }}
          >
            <div
              className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest"
              style={{ color: phase.color }}
            >
              <Bot className="size-3.5" />
              {isShadow
                ? "Agent Layer (Shadow — Testing)"
                : isAssisted
                ? "Agent Layer (Assisted — Recommending)"
                : "Agent Layer (Live — Driving)"}
            </div>

            {/* Pilot agents */}
            <div className="grid gap-2 sm:grid-cols-2">
              {PILOT_AGENTS.map((agent, i) => (
                <div
                  key={agent.id}
                  className="relative overflow-hidden rounded-lg border bg-white p-3"
                  style={{
                    borderColor: `${agent.color}44`,
                    animationDelay: `${i * 150}ms`,
                  }}
                >
                  {/* Processing indicator */}
                  {(isShadow || isAssisted || isLive) && (
                    <div
                      className="absolute inset-x-0 top-0 h-0.5 animate-pulse"
                      style={{ background: agent.color }}
                    />
                  )}
                  <div className="flex items-center gap-2">
                    <div
                      className="flex size-8 items-center justify-center rounded-lg"
                      style={{ background: `${agent.color}15` }}
                    >
                      <agent.icon className="size-4" style={{ color: agent.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="truncate text-sm font-semibold" style={{ color: agent.color }}>
                        {agent.short}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {isShadow ? "Testing" : isAssisted ? "Recommending" : "Autonomous"}
                      </div>
                    </div>
                    <StatusBadge phase={phaseIndex} />
                  </div>
                </div>
              ))}
            </div>

            {/* Output indicator */}
            {(isAssisted || isLive) && (
              <div className="mt-3 flex items-center gap-2 rounded-lg border bg-white p-2" style={{ borderColor: `${phase.color}33` }}>
                <CheckCircle2 className="size-4" style={{ color: phase.color }} />
                <span className="text-[11px] font-medium" style={{ color: phase.color }}>
                  {isAssisted
                    ? "Agent outputs surfaced as recommendations to analysts"
                    : "Agents auto-process, humans provide EU AI Act oversight only"}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Shadow mode: analyst still deciding */}
        {isShadow && (
          <>
            <div className="my-3 flex justify-center">
              <div className="flex flex-col items-center gap-1">
                <div
                  className="flex size-6 items-center justify-center rounded-full animate-bounce"
                  style={{ background: NW.human, animationDelay: "300ms" }}
                >
                  <ChevronRight className="size-4 -rotate-90 text-white" />
                </div>
                <span className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: NW.human }}>
                  Analyst compares outputs
                </span>
              </div>
            </div>
            <div
              className="rounded-xl border-2 p-4"
              style={{
                borderColor: `${NW.human}44`,
                background: `${NW.human}08`,
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex size-10 items-center justify-center rounded-full"
                  style={{ background: `${NW.human}15` }}
                >
                  <User className="size-5" style={{ color: NW.human }} />
                </div>
                <div>
                  <div className="text-sm font-semibold" style={{ color: NW.human }}>
                    Analyst Review
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Compares own work to agent output — builds trust, catches edge cases
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Assisted mode: analyst approves */}
        {isAssisted && (
          <>
            <div className="my-3 flex justify-center">
              <div className="flex flex-col items-center gap-1">
                <div
                  className="flex size-6 items-center justify-center rounded-full animate-bounce"
                  style={{ background: NW.human, animationDelay: "300ms" }}
                >
                  <ChevronRight className="size-4 -rotate-90 text-white" />
                </div>
                <span className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: NW.human }}>
                  Analyst approves / overrides
                </span>
              </div>
            </div>
            <div
              className="rounded-xl border-2 p-4"
              style={{
                borderColor: `${NW.human}44`,
                background: `${NW.human}08`,
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex size-10 items-center justify-center rounded-full"
                  style={{ background: `${NW.human}15` }}
                >
                  <CheckCircle2 className="size-5" style={{ color: NW.human }} />
                </div>
                <div>
                  <div className="text-sm font-semibold" style={{ color: NW.human }}>
                    Analyst Approval
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Reviews agent recommendation, approves or overrides
                  </div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-lg font-bold" style={{ color: NW.accent }}>
                    2-3 days
                  </div>
                  <div className="text-[10px] text-muted-foreground">avg cycle time</div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Live mode: human oversight only */}
        {isLive && (
          <>
            <div className="my-3 flex justify-center">
              <div className="flex flex-col items-center gap-1">
                <div
                  className="flex size-6 items-center justify-center rounded-full animate-pulse"
                  style={{ background: NW.live }}
                >
                  <Eye className="size-3.5 text-white" />
                </div>
                <span className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: NW.live }}>
                  Human oversight (EU AI Act)
                </span>
              </div>
            </div>
            <div
              className="rounded-xl border-2 p-4"
              style={{
                borderColor: `${NW.live}44`,
                background: `${NW.live}08`,
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex size-10 items-center justify-center rounded-full"
                  style={{ background: `${NW.live}15` }}
                >
                  <Eye className="size-5" style={{ color: NW.live }} />
                </div>
                <div>
                  <div className="text-sm font-semibold" style={{ color: NW.live }}>
                    Oversight Only
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Human reviews agent decisions — intervenes on exceptions only
                  </div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-lg font-bold" style={{ color: NW.live }}>
                    4-8 hours
                  </div>
                  <div className="text-[10px] text-muted-foreground">avg cycle time</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/* ---------- Status Badge ---------- */
function StatusBadge({ phase }: { phase: number }) {
  if (phase === 0) return null
  if (phase === 1)
    return (
      <span
        className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase"
        style={{ background: `${NW.shadow}20`, color: NW.shadow }}
      >
        Shadow
      </span>
    )
  if (phase === 2)
    return (
      <span
        className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase"
        style={{ background: `${NW.accent}20`, color: NW.accent }}
      >
        Assist
      </span>
    )
  return (
    <span
      className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase"
      style={{ background: `${NW.live}20`, color: NW.live }}
    >
      Live
    </span>
  )
}

/* ---------- Agent Chip ---------- */
function AgentChip({
  agent,
  phaseIndex,
}: {
  agent: (typeof PILOT_AGENTS)[0]
  phaseIndex: number
}) {
  return (
    <div
      className="flex items-center gap-2 rounded-lg border p-2 transition hover:shadow-sm"
      style={{ borderColor: `${agent.color}33` }}
    >
      <div
        className="flex size-7 items-center justify-center rounded-lg"
        style={{ background: `${agent.color}15` }}
      >
        <agent.icon className="size-3.5" style={{ color: agent.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="truncate text-xs font-semibold" style={{ color: agent.color }}>
          {agent.name}
        </div>
      </div>
      <StatusBadge phase={phaseIndex} />
    </div>
  )
}

/* ---------- Benefit Card ---------- */
function BenefitCard({
  phase,
  active,
}: {
  phase: (typeof PHASES)[0]
  active: boolean
}) {
  const benefits: Record<string, string[]> = {
    human: ["Full control", "No tech dependency", "Slow & manual", "Inconsistent"],
    shadow: ["Zero risk testing", "Accuracy measurement", "Edge case capture", "Trust building"],
    assisted: ["Faster processing", "Consistency gains", "Audit trail", "Analyst upskill"],
    live: ["Hours not days", "Scalable", "EU AI Act compliant", "Exception-only human"],
  }

  return (
    <div
      className={`rounded-xl border-2 p-4 transition ${active ? "shadow-md" : "opacity-60"}`}
      style={{
        borderColor: active ? phase.color : "#e2e8f0",
        background: active ? `${phase.color}08` : undefined,
      }}
    >
      <div
        className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest"
        style={{ color: phase.color }}
      >
        <phase.icon className="size-3.5" />
        Phase {phase.number}
      </div>
      <div className="mt-2 text-sm font-semibold" style={{ color: phase.color }}>
        {phase.title}
      </div>
      <ul className="mt-2 space-y-1">
        {benefits[phase.id].map((b, i) => (
          <li
            key={i}
            className="flex items-center gap-1.5 text-[11px]"
            style={{ color: i < 2 ? phase.color : NW.muted }}
          >
            {i < 2 ? (
              <CheckCircle2 className="size-3" />
            ) : (
              <Clock className="size-3 opacity-50" />
            )}
            {b}
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ---------- Agent Detail Card ---------- */
function AgentDetailCard({ agent }: { agent: (typeof PILOT_AGENTS)[0] }) {
  return (
    <div
      className="rounded-xl border-2 bg-card p-4 shadow-sm"
      style={{ borderColor: `${agent.color}44` }}
    >
      <div className="flex items-center gap-2">
        <div
          className="flex size-10 items-center justify-center rounded-xl"
          style={{ background: `${agent.color}15` }}
        >
          <agent.icon className="size-5" style={{ color: agent.color }} />
        </div>
        <div>
          <div className="font-semibold" style={{ color: agent.color }}>
            {agent.name}
          </div>
        </div>
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
        {agent.desc}
      </p>
      <div className="mt-3 space-y-2">
        <div>
          <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
            Inputs
          </div>
          <div className="mt-1 flex flex-wrap gap-1">
            {agent.inputs.map((inp) => (
              <span
                key={inp}
                className="rounded-full border px-2 py-0.5 text-[9px]"
                style={{ borderColor: `${agent.color}33`, color: agent.color }}
              >
                {inp}
              </span>
            ))}
          </div>
        </div>
        <div>
          <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
            Outputs
          </div>
          <div className="mt-1 flex flex-wrap gap-1">
            {agent.outputs.map((out) => (
              <span
                key={out}
                className="rounded-full px-2 py-0.5 text-[9px] font-medium text-white"
                style={{ background: agent.color }}
              >
                {out}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
