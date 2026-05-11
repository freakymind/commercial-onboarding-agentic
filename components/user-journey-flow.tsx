"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bot,
  CheckCircle2,
  Clock,
  FileSearch,
  MessageSquare,
  Pause,
  Play,
  User,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"

/* ---------- NatWest palette (more colorful) ---------- */
const NW = {
  primary: "#5a287d",
  accent: "#bd0f72",
  customer: "#0ea5e9",    // brighter blue
  analyst: "#7c3aed",     // vibrant purple
  agent: "#10b981",       // emerald green
  ok: "#10b981",
  warn: "#f59e0b",
  error: "#ef4444",       // brighter red
  wait: "#64748b",
  bg: "#faf8fc",
  dataFlow: "#06b6d4",    // cyan for data arrows
  waitFlow: "#f97316",    // orange for wait arrows
}

/* ---------- Pilot agents in user journey ---------- */
const PILOT_AGENTS = [
  { id: "sof", name: "SOF Agent", short: "SOF", color: "#7b2d8e", desc: "Source of Funds validation" },
  { id: "biz", name: "BizVerify Agent", short: "BizVerify", color: "#bd0f72", desc: "Company/VAT/Sole Trader check" },
  { id: "director", name: "Directors Agent", short: "Directors", color: "#5a287d", desc: "Director & UBO verification" },
  { id: "sic", name: "SIC Agent", short: "SIC", color: "#1a8754", desc: "Industry code validation" },
]

/* ---------- Speed options ---------- */
const SPEEDS = [
  { label: "Slow", ms: 3500 },
  { label: "Normal", ms: 2000 },
  { label: "Fast", ms: 1000 },
]

/* ---------- Main component ---------- */
export function UserJourneyFlow() {
  const [playing, setPlaying] = useState(true)
  const [speedIdx, setSpeedIdx] = useState(0) // Default Slow
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (!playing) return
    const interval = setInterval(() => {
      setTick((t) => t + 1)
    }, SPEEDS[speedIdx].ms)
    return () => clearInterval(interval)
  }, [playing, speedIdx])

  // Traditional journey has 10 ticks, Agent journey has 8
  const tradTick = tick % 10
  const agentTick = tick % 8

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
                Adding agents during customer application capture brings correct info into the system from the start, 
                increasing RFT and STP while eliminating the costly analyst wait time.
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

          {/* Two journeys side by side */}
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {/* TRADITIONAL JOURNEY */}
            <TraditionalJourney tick={tradTick} />

            {/* AGENT-ENHANCED JOURNEY */}
            <AgentJourney tick={agentTick} />
          </div>

          {/* Key insight */}
          <div
            className="mt-6 rounded-xl border-2 p-4"
            style={{ borderColor: `${NW.ok}44`, background: `${NW.ok}08` }}
          >
            <div className="flex items-start gap-3">
              <div
                className="flex size-12 shrink-0 items-center justify-center rounded-full text-white"
                style={{ background: NW.ok }}
              >
                <Zap className="size-6" />
              </div>
              <div>
                <h3 className="font-bold" style={{ color: NW.ok }}>
                  The Key Insight: Agents BEFORE Submit = Clean Data from Day One
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  When agents validate during the customer session (SOF, Business Verification, Directors, SIC), 
                  issues are caught and fixed <strong>immediately</strong> while the customer is still engaged.
                  The analyst receives a <strong>pre-validated, complete application</strong> — no chasing, no waiting.
                </p>
                <div className="mt-3 flex flex-wrap gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full px-2 py-0.5 text-xs font-bold text-white" style={{ background: NW.ok }}>RFT</span>
                    <span className="font-semibold">62% → 94%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full px-2 py-0.5 text-xs font-bold text-white" style={{ background: NW.ok }}>STP</span>
                    <span className="font-semibold">28% → 78%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pilot agents */}
          <div className="mt-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Initial Pilot Agents in User Journey
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
                      <div className="text-[11px] text-muted-foreground">{agent.desc}</div>
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

/* ========================================
   TRADITIONAL JOURNEY - Customer & Analyst Swimlanes
   ======================================== */
function TraditionalJourney({ tick }: { tick: number }) {
  // Steps: 0-2 customer lane, 3-4 analyst lane, 5 issue, 6 contact (goes back to customer), 
  // 7 customer wait, 8 re-review, 9 approved
  const steps = [
    { id: 0, label: "Customer fills form", lane: "customer", x: 50 },
    { id: 1, label: "Customer submits", lane: "customer", x: 150 },
    { id: 2, label: "Application queued", lane: "analyst", x: 250 },
    { id: 3, label: "Analyst reviews", lane: "analyst", x: 350 },
    { id: 4, label: "ISSUE FOUND!", lane: "analyst", x: 450, isError: true },
    { id: 5, label: "Contact customer", lane: "analyst", x: 550 },
    { id: 6, label: "WAITING 2-5 DAYS", lane: "customer", x: 650, isWait: true },
    { id: 7, label: "Customer responds", lane: "customer", x: 750 },
    { id: 8, label: "Re-review", lane: "analyst", x: 850 },
    { id: 9, label: "Approved", lane: "analyst", x: 950, isComplete: true },
  ]

  const currentStep = steps[tick] || steps[0]
  const isWaiting = tick === 6

  return (
    <div className="rounded-2xl border-2 overflow-hidden" style={{ borderColor: `${NW.error}44` }}>
      {/* Header */}
      <div className="border-b px-4 py-3" style={{ background: `${NW.error}08`, borderColor: `${NW.error}22` }}>
        <h2 className="font-bold" style={{ color: NW.error }}>
          Traditional: Issues Found AFTER Submit
        </h2>
        <p className="text-xs text-muted-foreground">
          Customer submits → Analyst finds issues → Contact customer → Wait 2-5 days
        </p>
      </div>

      {/* Current step callout */}
      <div
        className="border-b px-4 py-3 animate-draw-in"
        style={{
          background: currentStep.isWait ? `${NW.warn}15` : currentStep.isError ? `${NW.error}10` : `${NW.primary}05`,
          borderColor: `${NW.error}22`,
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex size-10 shrink-0 items-center justify-center rounded-full text-white"
            style={{
              background: currentStep.isWait ? NW.warn : currentStep.isError ? NW.error : currentStep.lane === "customer" ? NW.customer : NW.analyst,
            }}
          >
            {currentStep.isWait ? <Clock className="size-5" /> : currentStep.isError ? <AlertTriangle className="size-5" /> : currentStep.lane === "customer" ? <User className="size-5" /> : <FileSearch className="size-5" />}
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Step {tick + 1}/10 — {currentStep.lane === "customer" ? "Customer" : "Analyst"} Lane
            </div>
            <div className="font-semibold">{currentStep.label}</div>
            {currentStep.isWait && (
              <div className="mt-1 text-xs font-bold animate-pulse" style={{ color: NW.warn }}>
                THE BIG PROBLEM: Analyst waits for customer response — case sits idle
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SVG Swimlane visualization */}
      <div className="bg-card p-2 overflow-x-auto">
        <svg viewBox="0 0 1000 200" className="w-full min-w-[600px]" style={{ height: 200 }}>
          <defs>
            {/* Arrow markers */}
            <marker id="arrowWait" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill={NW.waitFlow} />
            </marker>
            <marker id="arrowData" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill={NW.error} />
            </marker>
          </defs>

          {/* Background */}
          <rect x="0" y="0" width="1000" height="200" fill={NW.bg} />

          {/* Customer Lane */}
          <rect x="0" y="10" width="1000" height="75" fill={`${NW.customer}12`} rx="6" />
          <text x="15" y="32" fontSize="11" fontWeight="bold" fill={NW.customer}>CUSTOMER</text>

          {/* Analyst Lane */}
          <rect x="0" y="110" width="1000" height="75" fill={`${NW.analyst}12`} rx="6" />
          <text x="15" y="132" fontSize="11" fontWeight="bold" fill={NW.analyst}>ANALYST</text>

          {/* Flow path - zigzag between lanes */}
          <path
            d="M50 50 L150 50 L200 145 L350 145 L450 145 L550 145 L600 50 L750 50 L800 145 L950 145"
            fill="none"
            stroke={`${NW.error}40`}
            strokeWidth="4"
          />
          <path
            d="M50 50 L150 50 L200 145 L350 145 L450 145 L550 145 L600 50 L750 50 L800 145 L950 145"
            fill="none"
            stroke={NW.error}
            strokeWidth="2"
            strokeDasharray="8 4"
            className="animate-flow-dash"
          />

          {/* ANIMATED DATA ARROWS - Analyst contacts customer */}
          {tick >= 5 && (
            <g className="animate-draw-in">
              {/* Arrow down: Analyst sends request */}
              <path d="M555 145 Q555 95 600 50" fill="none" stroke={NW.waitFlow} strokeWidth="3" markerEnd="url(#arrowWait)" strokeDasharray="6 3" className="animate-flow-dash" />
              <text x="545" y="95" fontSize="8" fontWeight="bold" fill={NW.waitFlow} transform="rotate(-45 545 95)">Request info</text>
            </g>
          )}

          {/* LONG WAIT ZONE */}
          {tick >= 6 && tick <= 7 && (
            <g>
              <rect x="580" y="20" width="180" height="55" rx="8" fill={`${NW.warn}20`} stroke={NW.warn} strokeWidth="2" strokeDasharray="4 2" />
              <text x="670" y="38" textAnchor="middle" fontSize="10" fontWeight="bold" fill={NW.warn}>WAITING FOR CUSTOMER</text>
              <text x="670" y="52" textAnchor="middle" fontSize="14" fontWeight="bold" fill={NW.error} className="animate-pulse">2-5 DAYS</text>
              <text x="670" y="68" textAnchor="middle" fontSize="8" fill={NW.wait}>Case sits idle...</text>
            </g>
          )}

          {/* Arrow up: Customer finally responds */}
          {tick >= 7 && (
            <g className="animate-draw-in">
              <path d="M750 50 Q750 95 800 145" fill="none" stroke={NW.dataFlow} strokeWidth="3" markerEnd="url(#arrowData)" strokeDasharray="6 3" className="animate-flow-dash" />
              <text x="785" y="95" fontSize="8" fontWeight="bold" fill={NW.dataFlow} transform="rotate(45 785 95)">Response</text>
            </g>
          )}

          {/* Step nodes */}
          {steps.map((step, i) => {
            const y = step.lane === "customer" ? 50 : 145
            const isActive = i === tick
            const isPast = i < tick
            const color = step.isWait ? NW.warn : step.isError ? NW.error : step.isComplete ? NW.ok : step.lane === "customer" ? NW.customer : NW.analyst
            const r = isActive ? 18 : 13

            return (
              <g key={step.id}>
                {isActive && (
                  <circle cx={step.x} cy={y} r={r + 10} fill="none" stroke={color} strokeWidth="2" opacity="0.5" className="animate-ping" />
                )}
                <circle cx={step.x} cy={y} r={r} fill={isPast || isActive ? color : `${color}40`} stroke={color} strokeWidth={isActive ? 3 : 2} />
                <text x={step.x} y={y + 4} textAnchor="middle" fontSize={isActive ? 12 : 10} fontWeight="bold" fill="white">
                  {i + 1}
                </text>
                {/* Label below */}
                <text
                  x={step.x}
                  y={step.lane === "customer" ? 78 : 173}
                  textAnchor="middle"
                  fontSize="9"
                  fill={color}
                  fontWeight={isActive ? "bold" : "normal"}
                >
                  {step.label.length > 14 ? step.label.slice(0, 14) + "..." : step.label}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Metrics - percentages only */}
      <div className="grid grid-cols-2 border-t text-center" style={{ borderColor: `${NW.error}22` }}>
        <div className="border-r p-3" style={{ borderColor: `${NW.error}22`, background: `${NW.error}05` }}>
          <div className="text-[10px] font-bold uppercase text-muted-foreground">Right First Time</div>
          <div className="text-lg font-bold" style={{ color: NW.error }}>~62%</div>
        </div>
        <div className="p-3" style={{ background: `${NW.error}05` }}>
          <div className="text-[10px] font-bold uppercase text-muted-foreground">Straight Through</div>
          <div className="text-lg font-bold" style={{ color: NW.error }}>~28%</div>
        </div>
      </div>
    </div>
  )
}

/* ========================================
   AGENT-ENHANCED JOURNEY - Customer & Analyst Swimlanes
   ======================================== */
function AgentJourney({ tick }: { tick: number }) {
  // Steps: Customer fills form with agents validating, then submits clean, analyst approves fast
  const steps = [
    { id: 0, label: "Customer starts", lane: "customer", x: 80 },
    { id: 1, label: "SOF validates", lane: "customer", x: 200, agent: 0 },
    { id: 2, label: "BizVerify checks", lane: "customer", x: 320, agent: 1 },
    { id: 3, label: "Directors checks", lane: "customer", x: 440, agent: 2 },
    { id: 4, label: "SIC validates", lane: "customer", x: 560, agent: 3 },
    { id: 5, label: "Clean submit!", lane: "customer", x: 680, isSuccess: true },
    { id: 6, label: "Quick review", lane: "analyst", x: 800 },
    { id: 7, label: "Fast approved!", lane: "analyst", x: 920, isComplete: true },
  ]

  const currentStep = steps[tick] || steps[0]
  const hasAgent = currentStep.agent !== undefined

  return (
    <div className="rounded-2xl border-2 overflow-hidden" style={{ borderColor: `${NW.ok}44` }}>
      {/* Header */}
      <div className="border-b px-4 py-3" style={{ background: `${NW.ok}08`, borderColor: `${NW.ok}22` }}>
        <h2 className="font-bold" style={{ color: NW.ok }}>
          With Agents: Issues Fixed BEFORE Submit
        </h2>
        <p className="text-xs text-muted-foreground">
          Agents validate during form fill → Customer fixes issues immediately → Clean application submitted
        </p>
      </div>

      {/* Current step callout */}
      <div
        className="border-b px-4 py-3 animate-draw-in"
        style={{
          background: hasAgent ? `${PILOT_AGENTS[currentStep.agent!].color}10` : `${NW.ok}05`,
          borderColor: `${NW.ok}22`,
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex size-10 shrink-0 items-center justify-center rounded-full text-white"
            style={{
              background: hasAgent ? PILOT_AGENTS[currentStep.agent!].color : currentStep.isSuccess || currentStep.isComplete ? NW.ok : currentStep.lane === "customer" ? NW.customer : NW.analyst,
            }}
          >
            {hasAgent ? <Bot className="size-5" /> : currentStep.isSuccess || currentStep.isComplete ? <CheckCircle2 className="size-5" /> : currentStep.lane === "customer" ? <User className="size-5" /> : <FileSearch className="size-5" />}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Step {tick + 1}/8 — {currentStep.lane === "customer" ? "Customer" : "Analyst"} Lane
              </span>
              {hasAgent && (
                <span
                  className="rounded-full px-2 py-0.5 text-[9px] font-bold text-white"
                  style={{ background: PILOT_AGENTS[currentStep.agent!].color }}
                >
                  {PILOT_AGENTS[currentStep.agent!].short} AGENT
                </span>
              )}
            </div>
            <div className="font-semibold">{currentStep.label}</div>
            {hasAgent && (
              <div className="mt-1 text-xs" style={{ color: PILOT_AGENTS[currentStep.agent!].color }}>
                Real-time validation — issues fixed immediately while customer is engaged
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SVG Swimlane visualization */}
      <div className="bg-card p-2 overflow-x-auto">
        <svg viewBox="0 0 1000 200" className="w-full min-w-[600px]" style={{ height: 200 }}>
          <defs>
            <marker id="arrowAgent" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill={NW.agent} />
            </marker>
            <marker id="arrowCustomer" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill={NW.customer} />
            </marker>
            {/* Gradient for agent zone */}
            <linearGradient id="agentZoneGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={`${NW.agent}15`} />
              <stop offset="50%" stopColor={`${NW.agent}25`} />
              <stop offset="100%" stopColor={`${NW.agent}15`} />
            </linearGradient>
          </defs>

          {/* Background */}
          <rect x="0" y="0" width="1000" height="200" fill={NW.bg} />

          {/* Customer Lane */}
          <rect x="0" y="10" width="1000" height="75" fill={`${NW.customer}12`} rx="6" />
          <text x="15" y="32" fontSize="11" fontWeight="bold" fill={NW.customer}>CUSTOMER</text>

          {/* Agent Validation Zone - highlighted */}
          <rect x="140" y="15" width="520" height="65" fill="url(#agentZoneGrad)" rx="6" stroke={NW.agent} strokeWidth="2" strokeDasharray="6 3" />
          <text x="400" y="30" textAnchor="middle" fontSize="10" fontWeight="bold" fill={NW.agent}>AGENT VALIDATION ZONE - Real-time checks</text>

          {/* Analyst Lane */}
          <rect x="0" y="110" width="1000" height="75" fill={`${NW.analyst}12`} rx="6" />
          <text x="15" y="132" fontSize="11" fontWeight="bold" fill={NW.analyst}>ANALYST</text>

          {/* Flow path - mostly straight, quick dip to analyst */}
          <path
            d="M80 50 L680 50 L740 145 L920 145"
            fill="none"
            stroke={`${NW.ok}40`}
            strokeWidth="4"
          />
          <path
            d="M80 50 L680 50 L740 145 L920 145"
            fill="none"
            stroke={NW.ok}
            strokeWidth="2"
            strokeDasharray="8 4"
            className="animate-flow-dash"
          />

          {/* QUICK DATA ARROWS - Agent checks and prompts customer instantly */}
          {hasAgent && tick >= 1 && tick <= 4 && (
            <g className="animate-draw-in">
              {/* Small bidirectional arrows showing instant validation */}
              <circle cx={currentStep.x} cy="90" r="12" fill={PILOT_AGENTS[currentStep.agent!].color} className="animate-pulse" />
              <text x={currentStep.x} y="94" textAnchor="middle" fontSize="8" fontWeight="bold" fill="white">OK</text>
              {/* Arrow up from agent to customer */}
              <path d={`M${currentStep.x - 15} 85 L${currentStep.x - 15} 60`} fill="none" stroke={NW.agent} strokeWidth="2" markerEnd="url(#arrowAgent)" />
              {/* Arrow down from customer to agent */}
              <path d={`M${currentStep.x + 15} 60 L${currentStep.x + 15} 85`} fill="none" stroke={NW.customer} strokeWidth="2" markerEnd="url(#arrowCustomer)" />
              <text x={currentStep.x} y="105" textAnchor="middle" fontSize="7" fontWeight="bold" fill={NW.agent}>INSTANT</text>
            </g>
          )}

          {/* Step nodes */}
          {steps.map((step, i) => {
            const y = step.lane === "customer" ? 50 : 140
            const isActive = i === tick
            const isPast = i < tick
            const color = step.agent !== undefined ? PILOT_AGENTS[step.agent].color : step.isSuccess || step.isComplete ? NW.ok : step.lane === "customer" ? NW.customer : NW.analyst
            const r = isActive ? 16 : 12

            return (
              <g key={step.id}>
                {isActive && (
                  <circle cx={step.x} cy={y} r={r + 8} fill="none" stroke={color} strokeWidth="2" opacity="0.4" className="animate-ping" />
                )}
                <circle cx={step.x} cy={y} r={r} fill={isPast || isActive ? color : `${color}33`} stroke={color} strokeWidth={isActive ? 3 : 1} />
                {step.agent !== undefined ? (
                  <Bot x={step.x - 6} y={y - 6} className="size-3" style={{ color: "white" }} />
                ) : (
                  <text x={step.x} y={y + 4} textAnchor="middle" fontSize={isActive ? 11 : 9} fontWeight="bold" fill="white">
                    {i + 1}
                  </text>
                )}
                {/* Agent icon in circle */}
                {step.agent !== undefined && (
                  <text x={step.x} y={y + 4} textAnchor="middle" fontSize="8" fontWeight="bold" fill="white">
                    {PILOT_AGENTS[step.agent].short.charAt(0)}
                  </text>
                )}
                {/* Label */}
                <text
                  x={step.x}
                  y={step.lane === "customer" ? 75 : 165}
                  textAnchor="middle"
                  fontSize="8"
                  fill={color}
                  fontWeight={isActive ? "bold" : "normal"}
                >
                  {step.label}
                </text>
              </g>
            )
          })}

          {/* No wait indicator - straight through! */}
          <g>
            <rect x="700" y="85" width="80" height="20" rx="10" fill={NW.ok} />
            <text x="740" y="99" textAnchor="middle" fontSize="9" fontWeight="bold" fill="white">
              NO WAIT!
            </text>
          </g>
        </svg>
      </div>

      {/* Metrics - percentages only */}
      <div className="grid grid-cols-2 border-t text-center" style={{ borderColor: `${NW.ok}22` }}>
        <div className="border-r p-3" style={{ borderColor: `${NW.ok}22`, background: `${NW.ok}08` }}>
          <div className="text-[10px] font-bold uppercase text-muted-foreground">Right First Time</div>
          <div className="text-lg font-bold" style={{ color: NW.ok }}>~94%</div>
        </div>
        <div className="p-3" style={{ background: `${NW.ok}08` }}>
          <div className="text-[10px] font-bold uppercase text-muted-foreground">Straight Through</div>
          <div className="text-lg font-bold" style={{ color: NW.ok }}>~78%</div>
        </div>
      </div>
    </div>
  )
}
