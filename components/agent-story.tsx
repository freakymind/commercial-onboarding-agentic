"use client"

import {
  Rocket,
  Code2,
  FlaskConical,
  Lightbulb,
  Bot,
  Clock,
  Shield,
  Users,
  Sparkles,
  ArrowRight,
  Target,
  Zap,
} from "lucide-react"

const NW = {
  primary: "#5a287d",
  accent: "#bd0f72",
  live: "#10b981",
  dev: "#f59e0b",
  research: "#8b5cf6",
  planned: "#0ea5e9",
  bg: "#faf8fc",
  text: "#1e1b2e",
  muted: "#64748b",
}

/* ---------- Onboarding Journey (matching main flow) ---------- */
const JOURNEY_STAGES = [
  { id: 1, label: "Application Submit" },
  { id: 2, label: "Identity Verify" },
  { id: 3, label: "Business Verify" },
  { id: 4, label: "Ownership Structure" },
  { id: 5, label: "Financial DD" },
  { id: 6, label: "Risk Assessment" },
  { id: 7, label: "TM Setup" },
]

/* ---------- Agents grouped by status, with stage coverage ---------- */
const LIVE_AGENTS = [
  { name: "OpsMate", impact: "Orchestrates end-to-end onboarding", stages: [1, 2, 3, 4, 5, 6, 7] },
  { name: "Business Verification", impact: "Validates registered businesses instantly", stages: [3] },
  { name: "Sole Trader Verification", impact: "Auto-verifies sole trader applications", stages: [2, 3] },
  { name: "APC Mate", impact: "Automates analyst quality checks", stages: [6] },
]

const DEV_AGENTS = [
  { name: "Document Intelligence", impact: "Extracts data from uploaded documents", stages: [1, 2, 5] },
  { name: "UBO", impact: "Identifies ultimate beneficial owners", stages: [4] },
  { name: "Address Density", impact: "Detects high-risk address patterns", stages: [2] },
  { name: "Plausibility", impact: "Sanity-checks business claims", stages: [3] },
  { name: "Source of Fund", impact: "Validates funding origin & legitimacy", stages: [5] },
]

const RESEARCH_AGENTS = [
  { name: "Complex Ownership", impact: "Untangles multi-layer corporate structures", stages: [4] },
  { name: "Business Plan Review", impact: "Assesses business plan viability", stages: [3, 5] },
  { name: "Company Financial", impact: "Analyses financial statements & ratios", stages: [5] },
  { name: "Transaction Monitoring", impact: "Monitors ongoing transaction risk", stages: [7] },
  { name: "Sanctions Screen", impact: "Real-time sanctions & PEP screening", stages: [4, 6] },
]

/* ---------- Planned / Identified agents (from main journey) ---------- */
const PLANNED_AGENTS = [
  { name: "Application Intake", impact: "Smart triage of incoming applications", stages: [1] },
  { name: "Case Allocation", impact: "Routes cases to the right analyst", stages: [1] },
  { name: "Customer & Ops Comms", impact: "Auto-drafts customer communications", stages: [1, 6] },
  { name: "Web Search & Maps", impact: "Verifies trading presence online & physical", stages: [3] },
  { name: "Banking Data", impact: "Pulls & analyses banking data feeds", stages: [5] },
  { name: "Risk Scoring", impact: "Composite risk score across all signals", stages: [6] },
  { name: "Decision Agent", impact: "Recommends approve / refer / decline", stages: [6] },
]

const PHASE_IMPACT = {
  live: {
    headline: "Foundation set",
    statement:
      "4 production agents proving value today — automated checks running 24/7, freeing analyst time on every case",
    metrics: [
      { label: "Apps automated", value: "60%" },
      { label: "Time saved/case", value: "~3 hrs" },
    ],
  },
  dev: {
    headline: "Coverage expanding",
    statement:
      "5 agents in build — unlocking Right-First-Time validation at the customer's fingertips during form fill",
    metrics: [
      { label: "RFT lift", value: "+18%" },
      { label: "STP lift", value: "+24%" },
    ],
  },
  research: {
    headline: "Complex cases next",
    statement:
      "5 agents in design — tackling complex ownership, financials & ongoing monitoring to reach full coverage",
    metrics: [
      { label: "Target RFT", value: "94%" },
      { label: "Target STP", value: "78%" },
    ],
  },
  planned: {
    headline: "Identified & on the backlog",
    statement:
      "6-7 additional agents identified from the main onboarding journey — bringing total agentic coverage to ~20 agents end-to-end",
    metrics: [
      { label: "Total pipeline", value: "20" },
      { label: "Journey coverage", value: "100%" },
    ],
  },
}

export function AgentStory() {
  return (
    <div className="min-h-screen p-6" style={{ background: NW.bg }}>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-5 text-center">
          <div
            className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs font-medium"
            style={{ borderColor: `${NW.primary}33`, color: NW.primary }}
          >
            <Sparkles className="size-3" />
            Executive View
          </div>
          <h1 className="mt-3 text-2xl font-bold" style={{ color: NW.primary }}>
            Embedded AI Agents Across the Onboarding Journey
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Continuous deployment of agents → compounding benefits at every stage
          </p>
        </div>

        {/* Top Strip: Journey with embedded agent indicators */}
        <div
          className="mb-5 rounded-2xl border-2 bg-white p-4 shadow-sm"
          style={{ borderColor: `${NW.primary}22` }}
        >
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: NW.primary }}>
              The Onboarding Journey
            </h2>
            <div className="flex gap-3 text-[11px]">
              <Legend color={NW.live} label="Live" />
              <Legend color={NW.dev} label="In Build" />
              <Legend color={NW.research} label="Research" />
              <Legend color={NW.planned} label="Planned" />
            </div>
          </div>

          <div className="flex items-center gap-1">
            {JOURNEY_STAGES.map((stage, i) => {
              const liveCount = LIVE_AGENTS.filter((a) => a.stages.includes(stage.id)).length
              const devCount = DEV_AGENTS.filter((a) => a.stages.includes(stage.id)).length
              const researchCount = RESEARCH_AGENTS.filter((a) => a.stages.includes(stage.id)).length
              const plannedCount = PLANNED_AGENTS.filter((a) => a.stages.includes(stage.id)).length
              return (
                <div key={stage.id} className="flex flex-1 items-center">
                  <div className="flex flex-1 flex-col items-center">
                    <div
                      className="flex size-11 items-center justify-center rounded-full font-bold text-base text-white shadow-md"
                      style={{ background: `linear-gradient(135deg, ${NW.primary}, ${NW.accent})` }}
                    >
                      {stage.id}
                    </div>
                    <div
                      className="mt-1.5 px-1 text-center text-[10px] font-semibold leading-tight"
                      style={{ color: NW.text }}
                    >
                      {stage.label}
                    </div>
                    <div className="mt-1 flex flex-wrap justify-center gap-0.5">
                      {liveCount > 0 && <Dot color={NW.live} count={liveCount} />}
                      {devCount > 0 && <Dot color={NW.dev} count={devCount} />}
                      {researchCount > 0 && <Dot color={NW.research} count={researchCount} />}
                      {plannedCount > 0 && <Dot color={NW.planned} count={plannedCount} />}
                    </div>
                  </div>
                  {i < JOURNEY_STAGES.length - 1 && (
                    <ArrowRight className="size-4 shrink-0" style={{ color: `${NW.primary}55` }} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Four Phase Columns - Story Progression */}
        <div className="grid gap-3 lg:grid-cols-4">
          <PhaseColumn
            phase="Live Today"
            phaseLabel="Deployed"
            color={NW.live}
            icon={Rocket}
            agents={LIVE_AGENTS}
            impact={PHASE_IMPACT.live}
            stepNum={1}
          />
          <PhaseColumn
            phase="In Build"
            phaseLabel="Next 6 Months"
            color={NW.dev}
            icon={Code2}
            agents={DEV_AGENTS}
            impact={PHASE_IMPACT.dev}
            stepNum={2}
          />
          <PhaseColumn
            phase="Research & Design"
            phaseLabel="6-12 Months"
            color={NW.research}
            icon={FlaskConical}
            agents={RESEARCH_AGENTS}
            impact={PHASE_IMPACT.research}
            stepNum={3}
          />
          <PhaseColumn
            phase="Planned & Identified"
            phaseLabel="Backlog"
            color={NW.planned}
            icon={Lightbulb}
            agents={PLANNED_AGENTS}
            impact={PHASE_IMPACT.planned}
            stepNum={4}
          />
        </div>

        {/* Bottom executive summary */}
        <div
          className="mt-5 rounded-2xl border-2 p-4"
          style={{
            borderColor: `${NW.primary}33`,
            background: `linear-gradient(135deg, ${NW.primary}08, ${NW.accent}08)`,
          }}
        >
          <div className="flex items-start gap-4">
            <div
              className="flex size-11 shrink-0 items-center justify-center rounded-xl text-white shadow-md"
              style={{ background: `linear-gradient(135deg, ${NW.primary}, ${NW.accent})` }}
            >
              <Target className="size-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold" style={{ color: NW.primary }}>
                The Story: Continuous Deployment, Compounding Impact
              </h3>
              <p className="mt-1 text-sm leading-relaxed" style={{ color: NW.text }}>
                We start with{" "}
                <span className="font-semibold" style={{ color: NW.live }}>
                  4 agents in production today
                </span>{" "}
                — proving the model works. The next{" "}
                <span className="font-semibold" style={{ color: NW.dev }}>
                  5 agents in build
                </span>{" "}
                bring customer-facing validation, then{" "}
                <span className="font-semibold" style={{ color: NW.research }}>
                  5 research agents
                </span>{" "}
                close complex cases, and a further{" "}
                <span className="font-semibold" style={{ color: NW.planned }}>
                  6-7 planned agents
                </span>{" "}
                from the journey blueprint take us to{" "}
                <span className="font-bold">~20 agents</span> covering every stage end-to-end —
                lifting <span className="font-bold">62% → 94% RFT</span> and{" "}
                <span className="font-bold">28% → 78% STP</span>.
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4">
                <SummaryStat icon={Zap} label="~20 agents end-to-end" color={NW.primary} />
                <SummaryStat icon={Clock} label="5-7 days → hours" color={NW.accent} />
                <SummaryStat icon={Shield} label="Higher accuracy" color={NW.live} />
                <SummaryStat icon={Users} label="Analysts → complex cases" color={NW.dev} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---------- Subcomponents ---------- */

function PhaseColumn({
  phase,
  phaseLabel,
  color,
  icon: Icon,
  agents,
  impact,
  stepNum,
}: {
  phase: string
  phaseLabel: string
  color: string
  icon: any
  agents: { name: string; impact: string; stages: number[] }[]
  impact: { headline: string; statement: string; metrics: { label: string; value: string }[] }
  stepNum: number
}) {
  return (
    <div
      className="overflow-hidden rounded-2xl border-2 bg-white shadow-sm"
      style={{ borderColor: `${color}55` }}
    >
      {/* Header */}
      <div className="px-4 py-3" style={{ background: `${color}10`, borderBottom: `1px solid ${color}22` }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="flex size-9 items-center justify-center rounded-lg text-white shadow-sm"
              style={{ background: color }}
            >
              <Icon className="size-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color }}>
                Step {stepNum} · {phaseLabel}
              </div>
              <div className="text-base font-bold" style={{ color: NW.text }}>
                {phase}
              </div>
            </div>
          </div>
          <div
            className="flex size-9 items-center justify-center rounded-full font-bold text-white"
            style={{ background: color }}
          >
            {agents.length}
          </div>
        </div>
      </div>

      {/* Impact statement */}
      <div className="px-4 py-3" style={{ background: `${color}05` }}>
        <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color }}>
          {impact.headline}
        </div>
        <p className="mt-1 text-xs leading-relaxed" style={{ color: NW.text }}>
          {impact.statement}
        </p>
        <div className="mt-2 flex gap-2">
          {impact.metrics.map((m) => (
            <div
              key={m.label}
              className="flex-1 rounded-lg bg-white px-2 py-1.5"
              style={{ border: `1px solid ${color}33` }}
            >
              <div className="text-[9px] font-semibold uppercase" style={{ color: NW.muted }}>
                {m.label}
              </div>
              <div className="text-sm font-bold" style={{ color }}>
                {m.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Agent list */}
      <div className="p-3">
        <div className="mb-2 text-[10px] font-bold uppercase tracking-wider" style={{ color: NW.muted }}>
          Agents
        </div>
        <div className="space-y-1.5">
          {agents.map((agent) => (
            <div
              key={agent.name}
              className="rounded-lg p-2 transition-colors hover:bg-muted/30"
              style={{ borderLeft: `3px solid ${color}` }}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <Bot className="size-3 shrink-0" style={{ color }} />
                  <span className="text-xs font-semibold" style={{ color: NW.text }}>
                    {agent.name}
                  </span>
                </div>
                <span
                  className="rounded px-1.5 py-0.5 text-[9px] font-medium"
                  style={{ background: `${color}15`, color }}
                >
                  Stage {agent.stages.length === JOURNEY_STAGES.length ? "All" : agent.stages.join(",")}
                </span>
              </div>
              <p className="mt-0.5 pl-4 text-[10px] leading-snug text-muted-foreground">
                {agent.impact}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="size-2.5 rounded-full" style={{ background: color }} />
      <span className="font-medium" style={{ color: NW.text }}>
        {label}
      </span>
    </div>
  )
}

function Dot({ color, count }: { color: string; count: number }) {
  return (
    <div
      className="flex size-3.5 items-center justify-center rounded-full text-[8px] font-bold text-white"
      style={{ background: color }}
    >
      {count}
    </div>
  )
}

function SummaryStat({ icon: Icon, label, color }: { icon: any; label: string; color: string }) {
  return (
    <div
      className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2"
      style={{ borderColor: `${color}33` }}
    >
      <Icon className="size-4 shrink-0" style={{ color }} />
      <span className="text-xs font-medium" style={{ color: NW.text }}>
        {label}
      </span>
    </div>
  )
}
