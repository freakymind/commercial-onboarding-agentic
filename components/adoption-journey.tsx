"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Bot,
  ChevronRight,
  Eye,
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

/* ---------- Pilot Agents with colors ---------- */
const AGENTS = [
  { id: "bv", name: "Business Verification", short: "BizVerify", color: "#7c3aed", Icon: Search },
  { id: "plausibility", name: "Plausibility Agent", short: "Plausibility", color: "#bd0f72", Icon: Eye },
  { id: "sof", name: "Source of Funds", short: "SOF", color: "#0891b2", Icon: TrendingUp },
  { id: "apcmate", name: "APCMate", short: "APC", color: "#059669", Icon: Shield },
]

/* ---------- Phase definitions ---------- */
type PhaseId = "human" | "shadow" | "assisted" | "live"
const PHASES: { id: PhaseId; label: string; color: string }[] = [
  { id: "human", label: "Human-Driven", color: NW.human },
  { id: "shadow", label: "Shadow Mode", color: NW.shadow },
  { id: "assisted", label: "Assisted Mode", color: NW.accent },
  { id: "live", label: "Live Mode", color: NW.live },
]

/* ---------- SVG dimensions ---------- */
const W = 1200
const H = 520

/* ---------- Stage positions along the journey rail ---------- */
const STAGES = [
  { id: 1, label: "Application", x: 120 },
  { id: 2, label: "Identity", x: 260 },
  { id: 3, label: "Business", x: 400 },
  { id: 4, label: "Ownership", x: 540 },
  { id: 5, label: "Financials", x: 680 },
  { id: 6, label: "Risk", x: 820 },
  { id: 7, label: "TM Setup", x: 960 },
]

/* ---------- Main Component ---------- */
export function AdoptionJourney() {
  const [phase, setPhase] = useState<PhaseId>("human")
  const [playing, setPlaying] = useState(true)

  // Auto-advance phases for demo
  useEffect(() => {
    if (!playing) return
    const interval = setInterval(() => {
      setPhase((p) => {
        const idx = PHASES.findIndex((ph) => ph.id === p)
        return PHASES[(idx + 1) % PHASES.length].id
      })
    }, 4500)
    return () => clearInterval(interval)
  }, [playing])

  const phaseIdx = PHASES.findIndex((p) => p.id === phase)

  return (
    <main className="min-h-screen bg-background">
      <div className="nw-grid-bg min-h-screen">
        <div className="mx-auto max-w-[1300px] px-4 py-6 sm:px-6">
          {/* Header */}
          <header className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Link href="/flow">
                <Button variant="ghost" size="sm" className="gap-1.5">
                  <ArrowLeft className="size-4" />
                  Back to Flow
                </Button>
              </Link>
              <div>
                <h1
                  className="flex items-center gap-2 text-xl font-bold sm:text-2xl"
                  style={{ color: NW.primary }}
                >
                  <Layers className="size-5" />
                  Agent Adoption Roadmap
                </h1>
                <p className="text-sm text-muted-foreground">
                  How agents integrate into the onboarding journey
                </p>
              </div>
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
          </header>

          {/* Phase selector pills */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {PHASES.map((p, i) => {
              const active = p.id === phase
              return (
                <button
                  key={p.id}
                  onClick={() => setPhase(p.id)}
                  className="flex items-center gap-1.5 rounded-full border-2 px-3 py-1.5 text-xs font-semibold transition"
                  style={{
                    borderColor: active ? p.color : `${p.color}44`,
                    background: active ? p.color : "transparent",
                    color: active ? "#fff" : p.color,
                  }}
                >
                  <span
                    className="flex size-5 items-center justify-center rounded-full text-[10px] font-bold"
                    style={{
                      background: active ? "#fff" : p.color,
                      color: active ? p.color : "#fff",
                    }}
                  >
                    {i + 1}
                  </span>
                  {p.label}
                </button>
              )
            })}
          </div>

          {/* Main SVG flow diagram */}
          <div className="mt-5 overflow-x-auto rounded-2xl border-2 bg-card shadow-sm" style={{ borderColor: `${NW.primary}22` }}>
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="w-full min-w-[900px]"
              style={{ background: `linear-gradient(180deg, ${NW.bg}, #fff)` }}
            >
              <defs>
                {/* Animated dash pattern */}
                <pattern id="dashFlow" width="16" height="1" patternUnits="userSpaceOnUse">
                  <rect width="8" height="1" fill={NW.primary}>
                    <animate attributeName="x" from="0" to="16" dur="0.8s" repeatCount="indefinite" />
                  </rect>
                </pattern>
                {/* Agent glow filter */}
                <filter id="agentGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                {/* Data particle gradient */}
                {AGENTS.map((a) => (
                  <radialGradient key={a.id} id={`grad-${a.id}`}>
                    <stop offset="0%" stopColor={a.color} />
                    <stop offset="100%" stopColor={a.color} stopOpacity="0.3" />
                  </radialGradient>
                ))}
              </defs>

              {/* ========== Lane labels ========== */}
              <text x="30" y="95" fontSize="11" fontWeight="800" fill={NW.human} letterSpacing="2">
                HUMAN JOURNEY
              </text>
              {phase !== "human" && (
                <text x="30" y="275" fontSize="11" fontWeight="800" fill={NW.primary} letterSpacing="2" className="animate-draw-in">
                  AGENT LAYER
                </text>
              )}
              {(phase === "assisted" || phase === "live") && (
                <text x="30" y="440" fontSize="11" fontWeight="800" fill={NW.live} letterSpacing="2" className="animate-draw-in">
                  ANALYST OUTPUT
                </text>
              )}

              {/* ========== HUMAN JOURNEY RAIL (always visible) ========== */}
              <g>
                {/* Rail background */}
                <line
                  x1="80"
                  y1="140"
                  x2="1050"
                  y2="140"
                  stroke={`${NW.human}33`}
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                {/* Rail animated dashes */}
                <line
                  x1="80"
                  y1="140"
                  x2="1050"
                  y2="140"
                  stroke={NW.human}
                  strokeWidth="3"
                  strokeDasharray="12 8"
                  strokeLinecap="round"
                  className="animate-flow-dash"
                />
                {/* Stage nodes */}
                {STAGES.map((s) => (
                  <g key={s.id}>
                    {/* Node circle */}
                    <circle
                      cx={s.x}
                      cy="140"
                      r="22"
                      fill="#fff"
                      stroke={NW.human}
                      strokeWidth="3"
                    />
                    <text
                      x={s.x}
                      y="145"
                      textAnchor="middle"
                      fontSize="13"
                      fontWeight="700"
                      fill={NW.human}
                    >
                      S{s.id}
                    </text>
                    {/* Label below */}
                    <text
                      x={s.x}
                      y="178"
                      textAnchor="middle"
                      fontSize="10"
                      fill={NW.muted}
                      fontWeight="500"
                    >
                      {s.label}
                    </text>
                    {/* Analyst icon for human phase */}
                    {phase === "human" && (
                      <g className="animate-draw-in">
                        <circle cx={s.x} cy="210" r="14" fill={`${NW.human}15`} stroke={NW.human} strokeWidth="1.5" />
                        <User x={s.x - 6} y="204" width="12" height="12" stroke={NW.human} strokeWidth="1.5" fill="none" />
                      </g>
                    )}
                  </g>
                ))}
                {/* Travelling case marker on human rail */}
                <circle r="8" fill={NW.human} filter="url(#agentGlow)">
                  <animateMotion dur="6s" repeatCount="indefinite" path={`M80,140 L1050,140`} />
                </circle>
              </g>

              {/* ========== SHADOW MODE: Parallel agent rail with data flowing DOWN ========== */}
              {phase !== "human" && (
                <g className="animate-draw-in">
                  {/* Agent rail */}
                  <line
                    x1="80"
                    y1="320"
                    x2="1050"
                    y2="320"
                    stroke={`${NW.primary}33`}
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  <line
                    x1="80"
                    y1="320"
                    x2="1050"
                    y2="320"
                    stroke={NW.primary}
                    strokeWidth="3"
                    strokeDasharray="12 8"
                    strokeLinecap="round"
                    className="animate-flow-dash"
                  />

                  {/* Data flow arrows from human rail DOWN to agent rail */}
                  {STAGES.slice(1, 6).map((s, i) => {
                    const agent = AGENTS[i % AGENTS.length]
                    return (
                      <g key={`flow-${s.id}`}>
                        {/* Vertical dashed line */}
                        <line
                          x1={s.x}
                          y1="165"
                          x2={s.x}
                          y2="295"
                          stroke={agent.color}
                          strokeWidth="2"
                          strokeDasharray="6 4"
                          opacity="0.6"
                        />
                        {/* Arrow head */}
                        <polygon
                          points={`${s.x},295 ${s.x - 6},280 ${s.x + 6},280`}
                          fill={agent.color}
                          opacity="0.8"
                        />
                        {/* Animated data particle flowing down */}
                        <circle r="5" fill={`url(#grad-${agent.id})`}>
                          <animateMotion
                            dur="1.5s"
                            repeatCount="indefinite"
                            path={`M${s.x},165 L${s.x},290`}
                            begin={`${i * 0.3}s`}
                          />
                        </circle>
                        {/* "Data" label */}
                        <text
                          x={s.x + 12}
                          y="230"
                          fontSize="9"
                          fill={agent.color}
                          fontWeight="600"
                          opacity="0.8"
                        >
                          data
                        </text>
                      </g>
                    )
                  })}

                  {/* Agent nodes on agent rail */}
                  {AGENTS.map((agent, i) => {
                    const x = 260 + i * 180
                    return (
                      <g key={agent.id}>
                        <circle
                          cx={x}
                          cy="320"
                          r="24"
                          fill="#fff"
                          stroke={agent.color}
                          strokeWidth="3"
                          filter="url(#agentGlow)"
                        />
                        <agent.Icon
                          x={x - 10}
                          y="310"
                          width="20"
                          height="20"
                          stroke={agent.color}
                          strokeWidth="1.8"
                          fill="none"
                        />
                        {/* Agent name below */}
                        <text
                          x={x}
                          y="360"
                          textAnchor="middle"
                          fontSize="10"
                          fontWeight="700"
                          fill={agent.color}
                        >
                          {agent.short}
                        </text>
                        {/* Status badge */}
                        <rect
                          x={x - 22}
                          y="370"
                          width="44"
                          height="16"
                          rx="8"
                          fill={phase === "shadow" ? NW.shadow : phase === "assisted" ? NW.accent : NW.live}
                          opacity="0.9"
                        />
                        <text
                          x={x}
                          y="381"
                          textAnchor="middle"
                          fontSize="8"
                          fontWeight="700"
                          fill="#fff"
                        >
                          {phase === "shadow" ? "TESTING" : phase === "assisted" ? "ASSIST" : "LIVE"}
                        </text>
                      </g>
                    )
                  })}

                  {/* Travelling case marker on agent rail */}
                  <circle r="7" fill={NW.accent}>
                    <animateMotion dur="5s" repeatCount="indefinite" path={`M80,320 L1050,320`} />
                  </circle>
                </g>
              )}

              {/* ========== ASSISTED/LIVE: Output flows UP to analyst ========== */}
              {(phase === "assisted" || phase === "live") && (
                <g className="animate-draw-in">
                  {/* Analyst output area */}
                  <rect
                    x="200"
                    y="420"
                    width="700"
                    height="70"
                    rx="12"
                    fill={`${NW.live}08`}
                    stroke={NW.live}
                    strokeWidth="2"
                    strokeDasharray="8 4"
                  />
                  <text x="550" y="448" textAnchor="middle" fontSize="11" fontWeight="700" fill={NW.live}>
                    {phase === "assisted"
                      ? "ANALYST REVIEWS AGENT RECOMMENDATIONS"
                      : "HUMAN OVERSIGHT — APPROVE / OVERRIDE"}
                  </text>
                  <text x="550" y="468" textAnchor="middle" fontSize="10" fill={NW.muted}>
                    {phase === "assisted"
                      ? "Agent outputs surface as recommendations; analyst approves or overrides"
                      : "Agents drive the journey; human confirms decisions (EU AI Act)"}
                  </text>

                  {/* Output arrows from agent rail UP to analyst area */}
                  {AGENTS.map((agent, i) => {
                    const x = 260 + i * 180
                    return (
                      <g key={`out-${agent.id}`}>
                        <line
                          x1={x}
                          y1="390"
                          x2={x}
                          y2="418"
                          stroke={agent.color}
                          strokeWidth="2"
                          strokeDasharray="4 3"
                          opacity="0.7"
                        />
                        <polygon
                          points={`${x},418 ${x - 5},408 ${x + 5},408`}
                          fill={agent.color}
                          opacity="0.8"
                        />
                        {/* Output particle */}
                        <circle r="4" fill={agent.color}>
                          <animateMotion
                            dur="1.2s"
                            repeatCount="indefinite"
                            path={`M${x},390 L${x},415`}
                            begin={`${i * 0.25}s`}
                          />
                        </circle>
                      </g>
                    )
                  })}
                </g>
              )}

              {/* ========== LIVE MODE: Agents merge INTO the journey ========== */}
              {phase === "live" && (
                <g className="animate-draw-in">
                  {/* Merge arrows from agent rail UP to human rail */}
                  {AGENTS.map((agent, i) => {
                    const ax = 260 + i * 180
                    const hx = STAGES[i + 1]?.x ?? ax
                    return (
                      <g key={`merge-${agent.id}`}>
                        <path
                          d={`M${ax},296 Q${ax},230 ${hx},165`}
                          fill="none"
                          stroke={agent.color}
                          strokeWidth="2.5"
                          strokeDasharray="6 4"
                          opacity="0.7"
                        />
                        {/* Merge particle */}
                        <circle r="6" fill={agent.color} filter="url(#agentGlow)">
                          <animateMotion
                            dur="2s"
                            repeatCount="indefinite"
                            path={`M${ax},296 Q${ax},230 ${hx},165`}
                            begin={`${i * 0.4}s`}
                          />
                        </circle>
                        {/* "Integrated" badge on human rail */}
                        <rect
                          x={hx - 28}
                          y="105"
                          width="56"
                          height="18"
                          rx="9"
                          fill={NW.live}
                        />
                        <text x={hx} y="117" textAnchor="middle" fontSize="8" fontWeight="700" fill="#fff">
                          INTEGRATED
                        </text>
                      </g>
                    )
                  })}
                </g>
              )}

              {/* ========== Legend ========== */}
              <g transform="translate(1030, 100)">
                <rect x="0" y="0" width="150" height="140" rx="10" fill="#fff" stroke={`${NW.primary}22`} strokeWidth="1.5" />
                <text x="12" y="22" fontSize="10" fontWeight="800" fill={NW.primary} letterSpacing="1">
                  LEGEND
                </text>
                {/* Human journey */}
                <circle cx="22" cy="45" r="6" fill={NW.human} />
                <text x="36" y="49" fontSize="9" fill={NW.muted}>Human Journey</text>
                {/* Agent layer */}
                <circle cx="22" cy="70" r="6" fill={NW.primary} />
                <text x="36" y="74" fontSize="9" fill={NW.muted}>Agent Layer</text>
                {/* Data flow */}
                <line x1="16" y1="95" x2="28" y2="95" stroke={NW.accent} strokeWidth="2" strokeDasharray="4 2" />
                <text x="36" y="99" fontSize="9" fill={NW.muted}>Data Flow</text>
                {/* Integration */}
                <line x1="16" y1="120" x2="28" y2="120" stroke={NW.live} strokeWidth="2" />
                <text x="36" y="124" fontSize="9" fill={NW.muted}>Integration</text>
              </g>
            </svg>
          </div>

          {/* Phase description card */}
          <div
            className="mt-4 rounded-xl border-2 p-4"
            style={{
              borderColor: PHASES[phaseIdx].color,
              background: `${PHASES[phaseIdx].color}08`,
            }}
          >
            <div className="flex items-center gap-2">
              <span
                className="flex size-7 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ background: PHASES[phaseIdx].color }}
              >
                {phaseIdx + 1}
              </span>
              <h2 className="text-lg font-bold" style={{ color: PHASES[phaseIdx].color }}>
                {PHASES[phaseIdx].label}
              </h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {phaseIdx === 0 &&
                "Analysts manually process every application through all 7 stages. Documents reviewed by eye, registries checked by hand, decisions made case-by-case. Average cycle time: 5-7 days."}
              {phaseIdx === 1 &&
                "Agents run in parallel, consuming the same journey data as analysts. They produce outputs for comparison but don't drive decisions. This lets us measure accuracy, catch edge cases and build trust — zero risk."}
              {phaseIdx === 2 &&
                "High-confidence agent outputs surface as recommendations. Analysts approve, override or escalate. Cycle time drops to 2-3 days, consistency rises, audit trail improves."}
              {phaseIdx === 3 &&
                "Agents become part of the journey itself — processing, deciding and handing off automatically. Humans provide EU AI Act oversight and handle exceptions only. Cycle time: hours, not days."}
            </p>
          </div>

          {/* Pilot agents row */}
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {AGENTS.map((a) => (
              <div
                key={a.id}
                className="flex items-center gap-3 rounded-xl border p-3"
                style={{ borderColor: `${a.color}44` }}
              >
                <span
                  className="flex size-9 shrink-0 items-center justify-center rounded-lg"
                  style={{ background: `${a.color}15` }}
                >
                  <a.Icon className="size-5" style={{ color: a.color }} />
                </span>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold" style={{ color: a.color }}>
                    {a.name}
                  </div>
                  <div className="text-[11px] text-muted-foreground">Pilot Agent</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
