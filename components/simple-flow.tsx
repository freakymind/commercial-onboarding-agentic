"use client"

import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bot,
  CheckCircle2,
  ChevronLeft,
  Cpu,
  FastForward,
  Pause,
  Play,
  Rewind,
  Sparkles,
  User,
  UserCheck,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SwimlaneFlow } from "@/components/swimlane-flow"

/* ---------- NatWest palette ---------- */
const NW = {
  primary: "#5a287d",
  accent: "#bd0f72",
  agent: "#5a287d",
  human: "#1f6cab",
  exception: "#d97706",
  ok: "#15803d",
  border: "#e9e3ee",
  ink: "#1a1a1a",
  muted: "#6b7280",
}

/* ---------- Row model ---------- */

type AgentMini = { name: string; short: string }
type FlowRow = {
  id: string
  kind: "edge" | "stage"
  number?: number
  name: string
  sub: string
  agents: AgentMini[]
  human?: {
    role: string
    trigger: string
    rate: string
  }
}

const ROWS: FlowRow[] = [
  {
    id: "customer",
    kind: "edge",
    name: "Customer applies",
    sub: "Business submits the application via web or RM",
    agents: [],
  },
  {
    id: "s1",
    kind: "stage",
    number: 1,
    name: "Application Submission",
    sub: "Capture, route and acknowledge the case",
    agents: [
      { name: "Application Intake Agent", short: "Intake" },
      { name: "Customer & Ops Comms Agent", short: "Comms" },
      { name: "Case Allocation Agent", short: "Allocation" },
    ],
  },
  {
    id: "s2",
    kind: "stage",
    number: 2,
    name: "Identity Verification",
    sub: "Verify directors, signatories and beneficial owners",
    agents: [
      { name: "ID Verification Agent", short: "ID" },
      { name: "Proof of Address Agent", short: "PoA" },
    ],
    human: {
      role: "Compliance Reviewer",
      trigger: "Document mismatch or low-confidence biometric match",
      rate: "~6% of cases",
    },
  },
  {
    id: "s3",
    kind: "stage",
    number: 3,
    name: "Business Verification",
    sub: "Confirm the business plausibly trades as declared",
    agents: [
      { name: "Business Verification Agent", short: "Registry" },
      { name: "Web Search Agent", short: "Web" },
      { name: "Google Maps Agent", short: "Maps" },
      { name: "Trusted Sources Agent", short: "Trust" },
      { name: "Plausibility Agent", short: "Plausibility" },
    ],
    human: {
      role: "Business Analyst",
      trigger: "Plausibility contradictions or unusual sector",
      rate: "~9% of cases",
    },
  },
  {
    id: "s4",
    kind: "stage",
    number: 4,
    name: "Ownership Structure",
    sub: "Map UBOs, control chains and PEP exposure",
    agents: [
      { name: "Ownership Mapping Agent", short: "UBO" },
      { name: "PEP & Sanctions Agent", short: "PEP" },
    ],
  },
  {
    id: "s5",
    kind: "stage",
    number: 5,
    name: "Financial Due Diligence",
    sub: "Validate financials and expected flows",
    agents: [
      { name: "Banking Data Agent", short: "Banking" },
      { name: "Financials Agent", short: "Financials" },
    ],
  },
  {
    id: "s6",
    kind: "stage",
    number: 6,
    name: "Risk Assessment",
    sub: "Score and decide: approve, refer or decline",
    agents: [
      { name: "Risk Scoring Agent", short: "Risk" },
      { name: "Decision Agent", short: "Decision" },
    ],
    human: {
      role: "Senior Analyst",
      trigger: "Borderline risk score or policy override required",
      rate: "~4% of cases",
    },
  },
  {
    id: "s7",
    kind: "stage",
    number: 7,
    name: "Transaction Monitoring",
    sub: "Open, provision and start monitoring",
    agents: [
      { name: "Account Provisioning Agent", short: "Provision" },
      { name: "TM Setup Agent", short: "TM" },
    ],
  },
  {
    id: "onboarded",
    kind: "edge",
    name: "Customer onboarded",
    sub: "Active account with continuous monitoring",
    agents: [],
  },
]

const STEP_MS_NORMAL = 2400

// Shared template so header + rows align column-by-column
const GRID_COLS = "minmax(180px, 1fr) 96px minmax(0, 1.8fr)"

/* =================================================================
   COMPONENT
   ================================================================= */
export function SimpleFlow() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [speed, setSpeed] = useState<0.5 | 1 | 2>(1)
  const [escalated, setEscalated] = useState(false)

  const sectionRef = useRef<HTMLElement>(null)
  const badgeRefs = useRef<Array<HTMLDivElement | null>>([])
  const [casePos, setCasePos] = useState<{ x: number; y: number } | null>(null)

  // Auto-advance
  useEffect(() => {
    if (!playing) return
    const ms = STEP_MS_NORMAL / speed
    const id = window.setInterval(() => {
      setActiveIdx((i) => (i + 1) % ROWS.length)
    }, ms)
    return () => window.clearInterval(id)
  }, [playing, speed])

  // Trigger an "escalation pulse" mid-stage when the active row has a human
  useEffect(() => {
    setEscalated(false)
    const row = ROWS[activeIdx]
    if (!row?.human) return
    const ms = STEP_MS_NORMAL / speed
    const t = window.setTimeout(() => setEscalated(true), ms * 0.4)
    return () => window.clearTimeout(t)
  }, [activeIdx, speed])

  // Position the case marker over the center of the active row's badge
  useEffect(() => {
    const measure = () => {
      const sectionEl = sectionRef.current
      const badgeEl = badgeRefs.current[activeIdx]
      if (!sectionEl || !badgeEl) return
      const sectionRect = sectionEl.getBoundingClientRect()
      const badgeRect = badgeEl.getBoundingClientRect()
      setCasePos({
        x: badgeRect.left - sectionRect.left + badgeRect.width / 2,
        y: badgeRect.top - sectionRect.top + badgeRect.height / 2,
      })
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (sectionRef.current) ro.observe(sectionRef.current)
    badgeRefs.current.forEach((el) => el && ro.observe(el))
    window.addEventListener("scroll", measure, { passive: true })
    window.addEventListener("resize", measure)
    return () => {
      ro.disconnect()
      window.removeEventListener("scroll", measure)
      window.removeEventListener("resize", measure)
    }
  }, [activeIdx])

  const activeRow = ROWS[activeIdx]
  const totalStages = ROWS.filter((r) => r.kind === "stage").length
  const stageProgress = useMemo(() => {
    let n = 0
    for (let i = 0; i <= activeIdx; i++) {
      if (ROWS[i].kind === "stage") n++
    }
    return n
  }, [activeIdx])

  return (
    <main className="nw-grid-bg min-h-screen">
      <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-10">
        {/* Header */}
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Link
              href="/"
              className="mb-2 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="size-3.5" />
              Back to Onboarding Journey
            </Link>
            <h1 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
              Onboarding in motion
            </h1>
            <p className="mt-1 max-w-2xl text-pretty text-sm text-muted-foreground">
              The same 7 stages as the journey map, played out as a live pipeline. Watch the case
              flow stage-by-stage — agents on the right do the work, humans on the left only step
              in when something falls outside the agents&apos; competence.
            </p>
          </div>

          <ProgressBadge
            stageProgress={stageProgress}
            totalStages={totalStages}
            activeRow={activeRow}
          />
        </header>

        {/* Stage pill ribbon (mirrors main page) */}
        <StageRibbon activeIdx={activeIdx} onJump={setActiveIdx} />

        {/* View tabs — Live swimlane (motion overview) vs Stage timeline (detailed) */}
        <Tabs defaultValue="swimlane" className="mt-4">
          <TabsList className="h-auto bg-muted/60 p-1">
            <TabsTrigger value="swimlane" className="px-4 py-2 text-xs font-semibold">
              Live swimlane
            </TabsTrigger>
            <TabsTrigger value="timeline" className="px-4 py-2 text-xs font-semibold">
              Stage timeline
            </TabsTrigger>
          </TabsList>

          {/* === Tab 1: Live swimlane (horizontal animated flow) === */}
          <TabsContent value="swimlane" className="mt-3">
            <SwimlaneFlow />
          </TabsContent>

          {/* === Tab 2: Stage timeline (detailed step-through) === */}
          <TabsContent value="timeline" className="mt-3">
            {/* Controls */}
            <Controls
              playing={playing}
              onTogglePlay={() => setPlaying((p) => !p)}
              speed={speed}
              onSpeedChange={setSpeed}
              onPrev={() =>
                setActiveIdx((i) => (i - 1 + ROWS.length) % ROWS.length)
              }
              onNext={() => setActiveIdx((i) => (i + 1) % ROWS.length)}
              onRestart={() => setActiveIdx(0)}
            />

            {/* Timeline */}
            <section
              ref={sectionRef}
              className="relative mt-4 overflow-hidden rounded-2xl border-2 border-[#5a287d]/20 bg-card p-3 shadow-sm sm:p-5"
            >
          {/* Column headers */}
          <div
            className="grid items-end gap-x-4"
            style={{ gridTemplateColumns: GRID_COLS }}
          >
            <ColumnHeader
              label="Human escalation"
              caption="Only when agents can't decide"
              icon={<Users className="size-3.5" />}
              color={NW.human}
              align="right"
            />
            <div className="px-2 py-2 text-center text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Journey
            </div>
            <ColumnHeader
              label="Agents at work"
              caption="Run continuously, end-to-end"
              icon={<Bot className="size-3.5" />}
              color={NW.agent}
              align="left"
            />
          </div>

          {/* Rows — each row is its own 3-column grid; the rail line is drawn as a piece inside each row's centre cell */}
          <div>
            {ROWS.map((row, idx) => {
              const status: RowStatus =
                idx < activeIdx
                  ? "done"
                  : idx === activeIdx
                    ? "active"
                    : "pending"
              const showEscalation =
                idx === activeIdx && !!row.human && escalated
              return (
                <RowGroup
                  key={row.id}
                  row={row}
                  idx={idx}
                  status={status}
                  escalated={showEscalation}
                  registerBadgeRef={(el) => {
                    badgeRefs.current[idx] = el
                  }}
                  onClick={() => setActiveIdx(idx)}
                />
              )
            })}
          </div>

          {/* Travelling case marker — absolute over the section, anchored to the active badge */}
          {casePos && (
            <div
              className="pointer-events-none absolute z-20 transition-all duration-700 ease-out"
              style={{ left: casePos.x, top: casePos.y }}
            >
              <span
                className="block size-4 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  background: NW.accent,
                  boxShadow: `0 0 0 6px ${NW.accent}33, 0 0 16px ${NW.accent}cc`,
                }}
              />
              <span
                aria-hidden
                className="absolute left-0 top-0 size-4 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full"
                style={{ background: NW.accent, opacity: 0.55 }}
              />
            </div>
          )}
            </section>

            {/* Active stage detail */}
            <ActiveDetail row={activeRow} escalated={escalated} />

            {/* Legend */}
            <Legend />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

/* ---------- Sub-components ---------- */

function ProgressBadge({
  stageProgress,
  totalStages,
  activeRow,
}: {
  stageProgress: number
  totalStages: number
  activeRow: FlowRow
}) {
  return (
    <div className="rounded-xl border bg-card px-3 py-2 shadow-xs">
      <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        Live position
      </div>
      <div className="mt-0.5 flex items-baseline gap-2">
        <span
          className="text-2xl font-bold tabular-nums"
          style={{ color: NW.primary }}
        >
          {Math.min(stageProgress, totalStages)} / {totalStages}
        </span>
        <span className="truncate text-sm font-medium">{activeRow.name}</span>
      </div>
    </div>
  )
}

function StageRibbon({
  activeIdx,
  onJump,
}: {
  activeIdx: number
  onJump: (idx: number) => void
}) {
  return (
    <nav
      aria-label="Stages"
      className="mb-3 flex flex-wrap items-center gap-1.5 rounded-xl border bg-card p-2 shadow-xs"
    >
      {ROWS.map((row, idx) => {
        const isActive = idx === activeIdx
        const isDone = idx < activeIdx
        const baseColor =
          row.kind === "edge"
            ? NW.muted
            : isActive
              ? NW.primary
              : isDone
                ? NW.ok
                : NW.muted
        return (
          <button
            key={row.id}
            type="button"
            onClick={() => onJump(idx)}
            className="group inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition hover:bg-muted/60"
            style={{
              color: isActive ? "white" : baseColor,
              background: isActive ? NW.primary : "transparent",
              borderColor: isActive ? NW.primary : "transparent",
            }}
          >
            {row.kind === "stage" && (
              <span
                className="inline-flex size-4 items-center justify-center rounded-full text-[10px] font-bold tabular-nums"
                style={{
                  background: isActive
                    ? "rgba(255,255,255,0.2)"
                    : "rgba(90,40,125,0.08)",
                  color: isActive ? "white" : NW.primary,
                }}
              >
                {row.number}
              </span>
            )}
            <span className="truncate">{row.name}</span>
          </button>
        )
      })}
    </nav>
  )
}

function Controls({
  playing,
  onTogglePlay,
  speed,
  onSpeedChange,
  onPrev,
  onNext,
  onRestart,
}: {
  playing: boolean
  onTogglePlay: () => void
  speed: 0.5 | 1 | 2
  onSpeedChange: (s: 0.5 | 1 | 2) => void
  onPrev: () => void
  onNext: () => void
  onRestart: () => void
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border bg-card p-2 shadow-xs">
      <div className="flex flex-wrap items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onPrev}
          className="gap-1"
        >
          <ArrowLeft className="size-3.5" />
          Prev
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={onTogglePlay}
          className="gap-1 text-white"
          style={{ background: NW.primary }}
        >
          {playing ? (
            <Pause className="size-3.5" />
          ) : (
            <Play className="size-3.5" />
          )}
          {playing ? "Pause" : "Play"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onNext}
          className="gap-1"
        >
          Next
          <ArrowRight className="size-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRestart}
          className="gap-1"
        >
          <Rewind className="size-3.5" />
          Restart
        </Button>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Speed
        </span>
        {[0.5, 1, 2].map((s) => {
          const active = s === speed
          return (
            <button
              key={s}
              type="button"
              onClick={() => onSpeedChange(s as 0.5 | 1 | 2)}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold transition"
              style={{
                background: active ? NW.primary : "transparent",
                color: active ? "white" : NW.ink,
                border: `1px solid ${active ? NW.primary : NW.border}`,
              }}
            >
              {s === 2 && <FastForward className="size-3" />}
              {s}x
            </button>
          )
        })}
      </div>
    </div>
  )
}

function ColumnHeader({
  label,
  caption,
  icon,
  color,
  align,
}: {
  label: string
  caption: string
  icon: React.ReactNode
  color: string
  align: "left" | "right"
}) {
  return (
    <div
      className={`px-2 py-2 ${align === "right" ? "text-right" : "text-left"}`}
    >
      <div
        className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-widest"
        style={{ background: `${color}14`, color }}
      >
        {icon}
        {label}
      </div>
      <div className="mt-1 text-[11px] text-muted-foreground">{caption}</div>
    </div>
  )
}

/* ---------- Row ---------- */

type RowStatus = "pending" | "active" | "done"

function RowGroup({
  row,
  idx,
  status,
  escalated,
  registerBadgeRef,
  onClick,
}: {
  row: FlowRow
  idx: number
  status: RowStatus
  escalated: boolean
  registerBadgeRef: (el: HTMLDivElement | null) => void
  onClick: () => void
}) {
  const isFirst = idx === 0
  const isLast = idx === ROWS.length - 1

  return (
    <div
      className="grid items-stretch gap-x-4"
      style={{ gridTemplateColumns: GRID_COLS }}
    >
      {/* Left column: human card (only when stage has a human) */}
      <div className="flex items-center justify-end py-3 pr-1">
        {row.human ? (
          <HumanCard
            role={row.human.role}
            trigger={row.human.trigger}
            rate={row.human.rate}
            active={status === "active" && escalated}
            dim={status === "pending"}
            onClick={onClick}
          />
        ) : null}
      </div>

      {/* Center column: rail piece + stage badge */}
      <div className="relative flex items-center justify-center py-3">
        {/* Static rail piece — fills full row height so adjacent pieces connect visually */}
        <span
          aria-hidden
          className="absolute left-1/2 w-[3px] -translate-x-1/2 rounded-full"
          style={{
            top: isFirst ? "50%" : 0,
            bottom: isLast ? "50%" : 0,
            background: `linear-gradient(180deg, ${NW.primary}33, ${NW.accent}66)`,
          }}
        />
        {/* Animated dashed overlay */}
        <span
          aria-hidden
          className="animate-flow-dash absolute left-1/2 w-[3px] -translate-x-1/2 rounded-full opacity-70"
          style={{
            top: isFirst ? "50%" : 0,
            bottom: isLast ? "50%" : 0,
            background: `repeating-linear-gradient(180deg, ${NW.accent}cc 0 8px, transparent 8px 18px)`,
            backgroundSize: "100% 200%",
            animationDuration: "3s",
          }}
        />

        <div
          ref={registerBadgeRef}
          role="button"
          tabIndex={0}
          onClick={onClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onClick()
          }}
          className="relative z-10 outline-none"
        >
          <StageBadge row={row} status={status} />
        </div>

        {/* Escalation arrow toward the human card on the left */}
        {row.human && status === "active" && escalated && <EscalationArrow />}
      </div>

      {/* Right column: agent strip */}
      <div className="flex items-center py-3 pl-1">
        <AgentStrip row={row} status={status} />
      </div>
    </div>
  )
}

function StageBadge({ row, status }: { row: FlowRow; status: RowStatus }) {
  const isActive = status === "active"
  const isDone = status === "done"
  const isStage = row.kind === "stage"

  const ring = isActive
    ? `0 0 0 6px ${NW.primary}1a, 0 0 0 12px ${NW.primary}0d`
    : isDone
      ? `0 0 0 4px ${NW.ok}1a`
      : `0 0 0 0 transparent`

  const bg = !isStage
    ? "white"
    : isActive
      ? NW.primary
      : isDone
        ? NW.ok
        : "white"
  const fg = !isStage
    ? NW.primary
    : isActive
      ? "white"
      : isDone
        ? "white"
        : NW.muted
  const border = !isStage
    ? `2px dashed ${NW.primary}66`
    : isDone
      ? `2px solid ${NW.ok}`
      : isActive
        ? `2px solid ${NW.primary}`
        : `2px solid ${NW.border}`

  return (
    <div className="relative flex flex-col items-center">
      <div
        className={`relative z-10 flex size-12 items-center justify-center rounded-full font-bold transition-all ${
          isActive ? "scale-105" : ""
        }`}
        style={{
          background: bg,
          color: fg,
          border,
          boxShadow: ring,
        }}
      >
        {!isStage ? (
          row.id === "customer" ? (
            <User className="size-5" />
          ) : (
            <Sparkles className="size-5" />
          )
        ) : isDone ? (
          <CheckCircle2 className="size-5" />
        ) : (
          <span className="text-base tabular-nums">{row.number}</span>
        )}
      </div>
      {isActive && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-0 size-12 animate-ping rounded-full"
          style={{ background: NW.primary, opacity: 0.18 }}
        />
      )}
    </div>
  )
}

function EscalationArrow() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute right-[calc(50%+30px)] top-1/2 h-0.5 -translate-y-1/2"
      style={{ width: "calc(50% - 14px)" }}
    >
      <span
        className="absolute inset-0 animate-flow-dash"
        style={{
          background: `repeating-linear-gradient(90deg, ${NW.exception} 0 6px, transparent 6px 10px)`,
          backgroundSize: "200% 100%",
          animationDuration: "1.2s",
        }}
      />
      <span
        className="absolute -left-1 top-1/2 -translate-y-1/2 border-y-[5px] border-r-[7px] border-y-transparent"
        style={{ borderRightColor: NW.exception }}
      />
      <span
        className="absolute -top-5 left-0 whitespace-nowrap rounded-md px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white shadow"
        style={{ background: NW.exception }}
      >
        Escalate
      </span>
    </span>
  )
}

function HumanCard({
  role,
  trigger,
  rate,
  active,
  dim,
  onClick,
}: {
  role: string
  trigger: string
  rate: string
  active: boolean
  dim: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group w-full max-w-[260px] rounded-xl border-2 bg-card p-3 text-right shadow-xs transition ${
        dim ? "opacity-40" : "opacity-100"
      } ${active ? "scale-[1.02] shadow-md" : ""}`}
      style={{
        borderColor: active ? NW.exception : `${NW.human}33`,
        background: active ? `${NW.exception}0d` : "white",
      }}
    >
      <div className="flex items-start justify-end gap-2">
        <div className="min-w-0 flex-1">
          <div
            className="flex items-center justify-end gap-1.5 text-[10px] font-semibold uppercase tracking-wider"
            style={{ color: active ? NW.exception : NW.human }}
          >
            {active && <AlertTriangle className="size-3 animate-bounce" />}
            Human
          </div>
          <div
            className="mt-0.5 truncate text-sm font-bold"
            style={{ color: NW.human }}
          >
            {role}
          </div>
        </div>
        <span
          className="flex size-9 shrink-0 items-center justify-center rounded-full"
          style={{
            background: active ? NW.exception : `${NW.human}14`,
            color: active ? "white" : NW.human,
          }}
        >
          <UserCheck className="size-4" />
        </span>
      </div>
      <p className="mt-1.5 text-[11px] leading-snug text-muted-foreground">
        Trigger:{" "}
        <span className="font-medium text-foreground/80">{trigger}</span>
      </p>
      <p
        className="mt-0.5 text-[10px] font-semibold tabular-nums"
        style={{ color: NW.exception }}
      >
        {rate}
      </p>
    </button>
  )
}

function AgentStrip({ row, status }: { row: FlowRow; status: RowStatus }) {
  const isActive = status === "active"
  const isDone = status === "done"
  const dim = status === "pending"

  if (row.agents.length === 0) {
    return (
      <div className="flex w-full items-center gap-2 rounded-xl border border-dashed bg-card/50 px-3 py-2 text-[12px] italic text-muted-foreground">
        <Sparkles
          className="size-3.5 shrink-0"
          style={{ color: NW.primary }}
        />
        <span className="truncate">{row.sub}</span>
      </div>
    )
  }

  return (
    <div
      className={`flex w-full flex-wrap items-center gap-1.5 rounded-xl border-2 bg-card p-2 shadow-xs transition ${
        dim ? "opacity-50" : "opacity-100"
      } ${isActive ? "scale-[1.01]" : ""}`}
      style={{
        borderColor: isActive
          ? NW.primary
          : isDone
            ? `${NW.ok}55`
            : NW.border,
        background: isActive
          ? `linear-gradient(90deg, ${NW.primary}0a, transparent)`
          : "white",
      }}
    >
      {row.agents.map((a, i) => (
        <AgentChip
          key={a.name}
          agent={a}
          active={isActive}
          done={isDone}
          index={i}
        />
      ))}
    </div>
  )
}

function AgentChip({
  agent,
  active,
  done,
  index,
}: {
  agent: AgentMini
  active: boolean
  done: boolean
  index: number
}) {
  const color = NW.primary
  return (
    <div
      className="relative flex items-center gap-1.5 overflow-hidden rounded-lg border px-2 py-1"
      style={{
        borderColor: active ? color : done ? `${NW.ok}55` : NW.border,
        background: active ? `${color}0d` : "white",
      }}
    >
      {active && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 animate-scan-line"
          style={{
            background: `linear-gradient(180deg, transparent 0%, ${color}22 50%, transparent 100%)`,
            animationDelay: `${index * 0.15}s`,
          }}
        />
      )}
      <span
        className="relative flex size-5 items-center justify-center rounded-md text-white"
        style={{ background: done ? NW.ok : color }}
      >
        {done ? (
          <CheckCircle2 className="size-3" />
        ) : (
          <Cpu className="size-3" />
        )}
      </span>
      <span
        className="relative text-[11px] font-semibold leading-tight"
        style={{ color: done ? NW.ok : color }}
      >
        {agent.short}
      </span>
    </div>
  )
}

/* ---------- Active stage detail panel ---------- */

function ActiveDetail({
  row,
  escalated,
}: {
  row: FlowRow
  escalated: boolean
}) {
  return (
    <section className="mt-6 grid gap-3 rounded-2xl border bg-card p-4 shadow-xs sm:p-5 lg:grid-cols-[2fr_1fr]">
      <div>
        <div
          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest"
          style={{ color: NW.primary }}
        >
          <Sparkles className="size-3.5" />
          Now playing
        </div>
        <h2 className="mt-1 text-pretty text-xl font-bold sm:text-2xl">
          {row.kind === "stage"
            ? `Stage ${row.number} — ${row.name}`
            : row.name}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{row.sub}</p>

        {row.agents.length > 0 && (
          <div className="mt-3">
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Agents on this stage
            </div>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {row.agents.map((a) => (
                <span
                  key={a.name}
                  className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium"
                  style={{
                    borderColor: `${NW.primary}55`,
                    color: NW.primary,
                    background: `${NW.primary}08`,
                  }}
                >
                  <Cpu className="size-3" />
                  {a.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div
        className="rounded-xl border-2 border-dashed p-3"
        style={{
          borderColor: row.human ? `${NW.exception}55` : `${NW.ok}55`,
          background: row.human ? `${NW.exception}08` : `${NW.ok}08`,
        }}
      >
        {row.human ? (
          <>
            <div
              className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest"
              style={{ color: NW.exception }}
            >
              <AlertTriangle className="size-3.5" />
              Human escalation path
            </div>
            <div
              className="mt-1 text-sm font-semibold"
              style={{ color: NW.human }}
            >
              {row.human.role}
            </div>
            <p className="mt-0.5 text-[12px] leading-snug text-muted-foreground">
              <span className="font-medium text-foreground">
                Triggered when:
              </span>{" "}
              {row.human.trigger}.
            </p>
            <p
              className="mt-1 text-[11px] font-semibold tabular-nums"
              style={{ color: NW.exception }}
            >
              {row.human.rate} {escalated && "· escalating now"}
            </p>
          </>
        ) : (
          <>
            <div
              className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest"
              style={{ color: NW.ok }}
            >
              <CheckCircle2 className="size-3.5" />
              Fully agentic
            </div>
            <p className="mt-1 text-[12px] leading-snug text-muted-foreground">
              No human in the loop on this stage. Agents complete the work
              end-to-end and hand off automatically to the next stage.
            </p>
          </>
        )}
      </div>
    </section>
  )
}

/* ---------- Legend ---------- */

function Legend() {
  return (
    <section className="mt-4 grid gap-3 rounded-2xl border bg-card p-4 shadow-xs sm:grid-cols-3 sm:p-5">
      <LegendItem
        title="Agents"
        desc="Run continuously across all 7 stages — process documents, call registries and score risk."
        icon={<Bot className="size-4" />}
        color={NW.agent}
      />
      <LegendItem
        title="Humans"
        desc="Step in only on exceptions: low-confidence biometrics, plausibility contradictions or borderline risk."
        icon={<Users className="size-4" />}
        color={NW.human}
      />
      <LegendItem
        title="Escalations"
        desc="Amber dashed arrow shows a case briefly handed to a human, who returns it to the agent flow."
        icon={<AlertTriangle className="size-4" />}
        color={NW.exception}
      />
    </section>
  )
}

function LegendItem({
  title,
  desc,
  icon,
  color,
}: {
  title: string
  desc: string
  icon: React.ReactNode
  color: string
}) {
  return (
    <div className="flex items-start gap-2">
      <span
        className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-md"
        style={{ background: `${color}14`, color }}
      >
        {icon}
      </span>
      <div>
        <div className="text-sm font-bold" style={{ color }}>
          {title}
        </div>
        <p className="mt-0.5 text-[12px] leading-snug text-muted-foreground">
          {desc}
        </p>
      </div>
    </div>
  )
}
