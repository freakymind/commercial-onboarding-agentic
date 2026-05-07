"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
  AlertTriangle,
  ArrowLeft,
  Bot,
  CheckCircle2,
  FileText,
  Map,
  Pause,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  User,
  UserCircle2,
  Wallet,
} from "lucide-react"
import { Button } from "@/components/ui/button"

type NodeType = "customer" | "agent" | "human" | "end"

type FNode = {
  id: string
  x: number
  y: number
  label: string
  sub: string
  type: NodeType
  Icon: React.ComponentType<{ className?: string }>
}

const W = 1500
const H = 560
const TOP = 170
const BOTTOM = 410

const NODES: FNode[] = [
  {
    id: "customer",
    x: 80,
    y: 290,
    label: "Customer",
    sub: "Submits application",
    type: "customer",
    Icon: UserCircle2,
  },
  {
    id: "intake",
    x: 240,
    y: TOP,
    label: "Intake Agent",
    sub: "Parses forms & docs",
    type: "agent",
    Icon: FileText,
  },
  {
    id: "id",
    x: 400,
    y: TOP,
    label: "ID Agent",
    sub: "Validates identity",
    type: "agent",
    Icon: ShieldCheck,
  },
  {
    id: "reviewer",
    x: 560,
    y: BOTTOM,
    label: "Compliance Reviewer",
    sub: "Resolves ID exceptions",
    type: "human",
    Icon: User,
  },
  {
    id: "kyc",
    x: 720,
    y: TOP,
    label: "KYC Agent",
    sub: "Sanctions & PEP",
    type: "agent",
    Icon: Search,
  },
  {
    id: "plaus",
    x: 880,
    y: TOP,
    label: "Plausibility Agent",
    sub: "Web + maps + registries",
    type: "agent",
    Icon: Sparkles,
  },
  {
    id: "analyst",
    x: 1040,
    y: BOTTOM,
    label: "Senior Analyst",
    sub: "Complex / high-risk cases",
    type: "human",
    Icon: User,
  },
  {
    id: "decide",
    x: 1200,
    y: TOP,
    label: "Decision Agent",
    sub: "Auto-approves clean cases",
    type: "agent",
    Icon: Map,
  },
  {
    id: "setup",
    x: 1340,
    y: TOP,
    label: "Setup Agent",
    sub: "Provisions account",
    type: "agent",
    Icon: Wallet,
  },
  {
    id: "done",
    x: 1450,
    y: 290,
    label: "Onboarded",
    sub: "Customer is live",
    type: "end",
    Icon: CheckCircle2,
  },
]

const NODE_BY_ID = Object.fromEntries(NODES.map((n) => [n.id, n])) as Record<
  string,
  FNode
>

/* ---------- Path builder ---------- */

function pathFromIds(ids: string[]) {
  const nodes = ids.map((id) => NODE_BY_ID[id])
  if (nodes.length === 0) return ""
  let d = `M ${nodes[0].x} ${nodes[0].y}`
  for (let i = 1; i < nodes.length; i++) {
    const p = nodes[i - 1]
    const c = nodes[i]
    const dx = (c.x - p.x) / 2
    d += ` C ${p.x + dx} ${p.y}, ${c.x - dx} ${c.y}, ${c.x} ${c.y}`
  }
  return d
}

const PATH_HAPPY = pathFromIds([
  "customer",
  "intake",
  "id",
  "kyc",
  "plaus",
  "decide",
  "setup",
  "done",
])

const PATH_ID_EXCEPTION = pathFromIds([
  "customer",
  "intake",
  "id",
  "reviewer",
  "kyc",
  "plaus",
  "decide",
  "setup",
  "done",
])

const PATH_COMPLEX_EXCEPTION = pathFromIds([
  "customer",
  "intake",
  "id",
  "kyc",
  "plaus",
  "analyst",
  "decide",
  "setup",
  "done",
])

const SPEEDS = { slow: 26, normal: 16, fast: 9 } as const
type Speed = keyof typeof SPEEDS

const NW = {
  primary: "#5a287d",
  accent: "#bd0f72",
  agent: "#5a287d",
  human: "#0f7ab5",
  exception: "#d97706",
}

type Packet = {
  id: string
  color: string
  label: string
  r: number
  pathId: string
  delayShare: number
}

const PACKETS: Packet[] = [
  {
    id: "p1",
    color: NW.accent,
    label: "Clean application",
    r: 8,
    pathId: "path-happy",
    delayShare: 0,
  },
  {
    id: "p2",
    color: NW.exception,
    label: "ID exception",
    r: 8,
    pathId: "path-id-exception",
    delayShare: 0.33,
  },
  {
    id: "p3",
    color: NW.primary,
    label: "Standard case",
    r: 7,
    pathId: "path-happy",
    delayShare: 0.55,
  },
  {
    id: "p4",
    color: NW.exception,
    label: "Complex / high-risk",
    r: 8,
    pathId: "path-complex-exception",
    delayShare: 0.78,
  },
]

export function SimpleFlow() {
  const [playing, setPlaying] = useState(true)
  const [speed, setSpeed] = useState<Speed>("normal")
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = svgRef.current as unknown as {
      pauseAnimations?: () => void
      unpauseAnimations?: () => void
    } | null
    if (!svg) return
    if (playing) svg.unpauseAnimations?.()
    else svg.pauseAnimations?.()
  }, [playing, speed])

  const dur = SPEEDS[speed]

  return (
    <div className="nw-grid-bg min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-[1600px]">
        {/* Header */}
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex items-start gap-2">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-1.5">
                <ArrowLeft className="size-4" />
                Detailed journey
              </Button>
            </Link>
            <div>
              <h1
                className="text-balance text-2xl font-bold tracking-tight md:text-3xl"
                style={{ color: NW.primary }}
              >
                Onboarding in motion
              </h1>
              <p className="mt-1 max-w-2xl text-pretty text-sm text-muted-foreground md:text-base">
                Most cases sail through the agent lane. Only{" "}
                <span style={{ color: NW.exception, fontWeight: 600 }}>
                  exceptions and complex applications
                </span>{" "}
                that agents can&apos;t fully resolve drop down to a human.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              size="sm"
              onClick={() => setPlaying((p) => !p)}
              className="gap-1.5 text-white shadow-sm"
              style={{ background: NW.primary }}
            >
              {playing ? (
                <>
                  <Pause className="size-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="size-4" />
                  Play
                </>
              )}
            </Button>
            <div
              className="flex overflow-hidden rounded-md border"
              style={{ borderColor: `${NW.primary}55` }}
            >
              {(Object.keys(SPEEDS) as Speed[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSpeed(s)}
                  className="px-3 py-1.5 text-xs font-semibold capitalize transition"
                  style={{
                    background: speed === s ? NW.primary : "transparent",
                    color: speed === s ? "white" : NW.primary,
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Stage */}
        <section
          className="mt-6 overflow-hidden rounded-2xl border-2 bg-card shadow-md"
          style={{ borderColor: `${NW.primary}33` }}
        >
          <div className="overflow-x-auto">
            <div
              className="relative mx-auto"
              style={{
                aspectRatio: `${W} / ${H}`,
                width: "100%",
                minWidth: 1100,
              }}
            >
              <svg
                key={speed}
                ref={svgRef}
                viewBox={`0 0 ${W} ${H}`}
                className="absolute inset-0 h-full w-full"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <linearGradient
                    id="agent-lane"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                  >
                    <stop offset="0%" stopColor={NW.agent} stopOpacity="0.04" />
                    <stop
                      offset="50%"
                      stopColor={NW.agent}
                      stopOpacity="0.14"
                    />
                    <stop
                      offset="100%"
                      stopColor={NW.accent}
                      stopOpacity="0.04"
                    />
                  </linearGradient>
                  <linearGradient
                    id="human-lane"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                  >
                    <stop offset="0%" stopColor={NW.human} stopOpacity="0.04" />
                    <stop
                      offset="50%"
                      stopColor={NW.human}
                      stopOpacity="0.14"
                    />
                    <stop
                      offset="100%"
                      stopColor={NW.human}
                      stopOpacity="0.04"
                    />
                  </linearGradient>
                </defs>

                {/* Lane backgrounds */}
                <rect
                  x="0"
                  y="70"
                  width={W}
                  height="200"
                  fill="url(#agent-lane)"
                />
                <rect
                  x="0"
                  y="310"
                  width={W}
                  height="200"
                  fill="url(#human-lane)"
                />

                {/* Lane labels */}
                <text
                  x={W / 2}
                  y="60"
                  fontSize="11"
                  fontWeight="800"
                  fill={NW.agent}
                  letterSpacing="4"
                  textAnchor="middle"
                >
                  AGENTS LANE — AUTONOMOUS WORK
                </text>
                <text
                  x={W / 2}
                  y={H - 22}
                  fontSize="11"
                  fontWeight="800"
                  fill={NW.human}
                  letterSpacing="4"
                  textAnchor="middle"
                >
                  HUMANS LANE — EXCEPTION HANDLING
                </text>

                {/* Happy path — base track */}
                <path
                  id="path-happy"
                  d={PATH_HAPPY}
                  fill="none"
                  stroke={`${NW.primary}33`}
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                {/* Hidden full paths used by exception packets only */}
                <path
                  id="path-id-exception"
                  d={PATH_ID_EXCEPTION}
                  fill="none"
                  stroke="transparent"
                  strokeWidth="0"
                />
                <path
                  id="path-complex-exception"
                  d={PATH_COMPLEX_EXCEPTION}
                  fill="none"
                  stroke="transparent"
                  strokeWidth="0"
                />

                {/* Visible exception branches as dashed amber arrows */}
                <path
                  d={pathFromIds(["id", "reviewer", "kyc"])}
                  fill="none"
                  stroke={NW.exception}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="4 8"
                  opacity="0.65"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="0"
                    to="-120"
                    dur={`${dur * 0.6}s`}
                    repeatCount="indefinite"
                  />
                </path>
                <path
                  d={pathFromIds(["plaus", "analyst", "decide"])}
                  fill="none"
                  stroke={NW.exception}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="4 8"
                  opacity="0.65"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="0"
                    to="-120"
                    dur={`${dur * 0.6}s`}
                    repeatCount="indefinite"
                  />
                </path>

                {/* Animated dashed glow overlay along happy path */}
                <path
                  d={PATH_HAPPY}
                  fill="none"
                  stroke={NW.accent}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="6 14"
                  opacity="0.5"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="0"
                    to="-200"
                    dur={`${dur}s`}
                    repeatCount="indefinite"
                  />
                </path>

                {/* Exception labels on the dip arrows */}
                <ExceptionLabel
                  x={(NODE_BY_ID.id.x + NODE_BY_ID.reviewer.x) / 2 - 12}
                  y={(TOP + BOTTOM) / 2 - 24}
                  text="Doc mismatch / low confidence"
                />
                <ExceptionLabel
                  x={(NODE_BY_ID.plaus.x + NODE_BY_ID.analyst.x) / 2 - 12}
                  y={(TOP + BOTTOM) / 2 - 24}
                  text="Contradictions / high-risk sector"
                />

                {/* Pulse rings on every node */}
                {NODES.map((n) => {
                  const color =
                    n.type === "agent"
                      ? NW.agent
                      : n.type === "human"
                        ? NW.human
                        : NW.accent
                  return (
                    <g key={`pulse-${n.id}`}>
                      <circle
                        cx={n.x}
                        cy={n.y}
                        r="40"
                        fill="none"
                        stroke={color}
                        strokeWidth="1.5"
                        opacity="0.5"
                      >
                        <animate
                          attributeName="r"
                          from="34"
                          to="58"
                          dur="2.6s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          from="0.6"
                          to="0"
                          dur="2.6s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    </g>
                  )
                })}

                {/* Traveling work packets — each one knows its own path */}
                {PACKETS.map((p) => (
                  <g key={`packet-${p.id}`}>
                    <circle
                      r={p.r}
                      fill={p.color}
                      style={{ filter: `drop-shadow(0 0 8px ${p.color})` }}
                    >
                      <animateMotion
                        dur={`${dur}s`}
                        begin={`${dur * p.delayShare}s`}
                        repeatCount="indefinite"
                        rotate="auto"
                      >
                        <mpath xlinkHref={`#${p.pathId}`} href={`#${p.pathId}`} />
                      </animateMotion>
                    </circle>
                    {/* Trailing fade */}
                    <circle r={p.r * 1.6} fill={p.color} opacity="0.18">
                      <animateMotion
                        dur={`${dur}s`}
                        begin={`${dur * p.delayShare - 0.2}s`}
                        repeatCount="indefinite"
                      >
                        <mpath xlinkHref={`#${p.pathId}`} href={`#${p.pathId}`} />
                      </animateMotion>
                    </circle>
                  </g>
                ))}
              </svg>

              {/* HTML overlays for node cards */}
              {NODES.map((n) => (
                <NodeCard key={n.id} n={n} />
              ))}
            </div>
          </div>

          {/* Legend strip */}
          <div className="grid gap-3 border-t bg-muted/30 p-4 text-sm md:grid-cols-4">
            <Legend
              label="Agent"
              desc="Autonomous task — parses, validates, decides, files"
              color={NW.agent}
            />
            <Legend
              label="Human"
              desc="Reviews exceptions agents can&apos;t fully resolve"
              color={NW.human}
            />
            <Legend
              label="Standard packet"
              desc="Clean case — stays on the agent lane end-to-end"
              color={NW.accent}
            />
            <Legend
              label="Exception packet"
              desc="Drops to human, then resumes on the agent lane"
              color={NW.exception}
            />
          </div>
        </section>

        {/* Narrative cards */}
        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <Story
            title="Agents do the heavy lifting"
            body="Intake, ID, KYC, plausibility, decisioning and account setup all run autonomously. ~85% of cases never need a human."
            color={NW.agent}
          />
          <Story
            title="Humans handle the edge cases"
            body="When an agent's confidence is low, the document quality is poor, or signals contradict, the case drops down to a Compliance Reviewer or Senior Analyst."
            color={NW.exception}
            icon
          />
          <Story
            title="Continuous handoff"
            body="The packet returns to the agent lane immediately after human input — no batch queues, no overnight runs. Every case stays in motion."
            color={NW.accent}
          />
        </section>

        {/* What makes agents fail */}
        <section className="mt-6 rounded-2xl border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle
              className="size-4"
              style={{ color: NW.exception }}
            />
            <h2
              className="text-sm font-bold uppercase tracking-wider"
              style={{ color: NW.exception }}
            >
              When agents escalate to humans
            </h2>
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <FailCase
              title="ID Agent → Compliance Reviewer"
              triggers={[
                "Document scan quality below threshold",
                "Name / DOB mismatch across sources",
                "Possible synthetic identity signals",
                "Confidence score < 80%",
              ]}
            />
            <FailCase
              title="Plausibility Agent → Senior Analyst"
              triggers={[
                "Contradictions across web, maps and registries",
                "High-risk sector (cash-intensive, crypto, cross-border)",
                "Declared turnover not supported by digital footprint",
                "Trading premises classification ambiguous",
              ]}
            />
          </div>
        </section>
      </div>
    </div>
  )
}

function NodeCard({ n }: { n: FNode }) {
  const color =
    n.type === "agent"
      ? NW.agent
      : n.type === "human"
        ? NW.human
        : NW.accent
  const tag =
    n.type === "agent"
      ? "Agent"
      : n.type === "human"
        ? "Human"
        : n.type === "customer"
          ? "Start"
          : "Onboarded"

  return (
    <div
      className="pointer-events-none absolute flex flex-col items-center"
      style={{
        left: `${(n.x / W) * 100}%`,
        top: `${(n.y / H) * 100}%`,
        transform: "translate(-50%, -50%)",
        width: 160,
      }}
    >
      <div
        className="relative grid size-16 place-items-center rounded-full border-2 bg-white shadow-md"
        style={{ borderColor: color, color }}
      >
        <n.Icon className="size-7" />
        {n.type === "agent" && (
          <span
            className="absolute -bottom-1 -right-1 grid size-5 place-items-center rounded-full border-2 border-white text-[9px] font-bold text-white shadow"
            style={{ background: NW.agent }}
            aria-hidden
          >
            <Bot className="size-3" />
          </span>
        )}
      </div>
      <div
        className="mt-2 max-w-[150px] rounded-md bg-white/95 px-2 py-1 text-center text-[12px] font-bold leading-tight shadow-sm backdrop-blur-sm"
        style={{ color: NW.primary }}
      >
        {n.label}
      </div>
      <div
        className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.18em]"
        style={{ color }}
      >
        {tag}
      </div>
      <div className="max-w-[150px] text-center text-[10px] leading-tight text-muted-foreground">
        {n.sub}
      </div>
    </div>
  )
}

function ExceptionLabel({
  x,
  y,
  text,
}: {
  x: number
  y: number
  text: string
}) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect
        x="-90"
        y="-12"
        width="200"
        height="22"
        rx="11"
        fill="white"
        stroke={NW.exception}
        strokeWidth="1.5"
        opacity="0.95"
      />
      <text
        x="10"
        y="3"
        fontSize="10"
        fontWeight="700"
        fill={NW.exception}
        textAnchor="middle"
      >
        {text}
      </text>
    </g>
  )
}

function Legend({
  label,
  desc,
  color,
}: {
  label: string
  desc: string
  color: string
}) {
  return (
    <div className="flex items-start gap-2">
      <span
        className="mt-1 size-2.5 shrink-0 rounded-full"
        style={{ background: color, boxShadow: `0 0 0 3px ${color}33` }}
      />
      <div>
        <div
          className="text-[11px] font-bold uppercase tracking-wider"
          style={{ color }}
        >
          {label}
        </div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
    </div>
  )
}

function Story({
  title,
  body,
  color,
  icon,
}: {
  title: string
  body: string
  color: string
  icon?: boolean
}) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div
        className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider"
        style={{ color }}
      >
        {icon && <AlertTriangle className="size-3.5" />}
        {title}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {body}
      </p>
    </div>
  )
}

function FailCase({ title, triggers }: { title: string; triggers: string[] }) {
  return (
    <div
      className="rounded-xl border-2 border-dashed p-4"
      style={{ borderColor: `${NW.exception}66` }}
    >
      <div
        className="text-sm font-bold"
        style={{ color: NW.primary }}
      >
        {title}
      </div>
      <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
        {triggers.map((t) => (
          <li key={t} className="flex items-start gap-2">
            <span
              className="mt-1.5 size-1.5 shrink-0 rounded-full"
              style={{ background: NW.exception }}
              aria-hidden
            />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
