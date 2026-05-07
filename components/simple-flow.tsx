"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
  AlertTriangle,
  ArrowLeft,
  Bot,
  CheckCircle2,
  FileText,
  Network,
  Pause,
  Play,
  Radar,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  User,
  UserCircle2,
  Wallet,
  Wrench,
} from "lucide-react"
import { Button } from "@/components/ui/button"

type NodeType = "customer" | "agent" | "human" | "end"

type FNode = {
  id: string
  x: number
  y: number
  label: string
  sub: string
  badge?: string
  type: NodeType
  Icon: React.ComponentType<{ className?: string }>
}

const W = 1500
const H = 580
const TOP = 180
const BOTTOM = 420

/**
 * 7 stages on the agent lane, mirrored 1:1 from the Customer Onboarding Journey
 * page. Three humans sit on the bottom lane to resolve exceptions that the
 * agents at Stage 2 (Identity), Stage 3 (Business) and Stage 6 (Risk) cannot
 * fully clear.
 */
const NODES: FNode[] = [
  {
    id: "customer",
    x: 80,
    y: 300,
    label: "Customer",
    sub: "Submits application",
    type: "customer",
    Icon: UserCircle2,
  },
  // ---------- Agent lane (top) — Stages 1..7 ----------
  {
    id: "s1",
    x: 230,
    y: TOP,
    label: "Application",
    sub: "Captures intake forms & documents",
    badge: "S1",
    type: "agent",
    Icon: FileText,
  },
  {
    id: "s2",
    x: 390,
    y: TOP,
    label: "Identity",
    sub: "Verifies directors & beneficial owners",
    badge: "S2",
    type: "agent",
    Icon: ShieldCheck,
  },
  {
    id: "s3",
    x: 550,
    y: TOP,
    label: "Business",
    sub: "Web · Maps · Trusted sources · Plausibility",
    badge: "S3",
    type: "agent",
    Icon: Sparkles,
  },
  {
    id: "s4",
    x: 710,
    y: TOP,
    label: "Ownership",
    sub: "Maps shareholding & UBO structure",
    badge: "S4",
    type: "agent",
    Icon: Network,
  },
  {
    id: "s5",
    x: 870,
    y: TOP,
    label: "Financials",
    sub: "Source of funds & financial analysis",
    badge: "S5",
    type: "agent",
    Icon: TrendingUp,
  },
  {
    id: "s6",
    x: 1030,
    y: TOP,
    label: "Risk",
    sub: "AML · Sanctions · PEP · Adverse media",
    badge: "S6",
    type: "agent",
    Icon: Radar,
  },
  {
    id: "s7",
    x: 1190,
    y: TOP,
    label: "Tx Monitoring",
    sub: "Auto-decision & account provisioning",
    badge: "S7",
    type: "agent",
    Icon: Wallet,
  },
  // ---------- Human lane (bottom) — exception handlers ----------
  {
    id: "h-id",
    x: 390,
    y: BOTTOM,
    label: "Compliance Reviewer",
    sub: "Resolves ID exceptions (S2)",
    type: "human",
    Icon: User,
  },
  {
    id: "h-biz",
    x: 550,
    y: BOTTOM,
    label: "Business Analyst",
    sub: "Reviews business plan / sector (S3)",
    type: "human",
    Icon: User,
  },
  {
    id: "h-risk",
    x: 1030,
    y: BOTTOM,
    label: "Senior Analyst",
    sub: "Adjudicates high-risk cases (S6)",
    type: "human",
    Icon: User,
  },
  {
    id: "end",
    x: 1370,
    y: 300,
    label: "Onboarded",
    sub: "Customer live & monitored",
    type: "end",
    Icon: CheckCircle2,
  },
]

const NW = {
  primary: "#5a287d", // NatWest purple
  primaryDark: "#3f1957",
  accent: "#bd0f72", // NatWest pink/magenta
  agent: "#7c3aed", // agent lane tint
  human: "#1f6feb", // human lane tint
  exception: "#d97706", // amber for exceptions
  ok: "#16a34a",
}

/**
 * Smooth cubic-Bezier path through a list of points so the packet motion
 * feels natural and continuous.
 */
function smoothPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return ""
  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]
    const cur = points[i]
    const dx = (cur.x - prev.x) * 0.55
    const c1x = prev.x + dx
    const c1y = prev.y
    const c2x = cur.x - dx
    const c2y = cur.y
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${cur.x} ${cur.y}`
  }
  return d
}

const N = (id: string) => NODES.find((n) => n.id === id)!

// Standard end-to-end path: Customer → S1..S7 → Onboarded (all on the agent lane).
const STD_POINTS = [
  N("customer"),
  N("s1"),
  N("s2"),
  N("s3"),
  N("s4"),
  N("s5"),
  N("s6"),
  N("s7"),
  N("end"),
]
const STD_PATH = smoothPath(STD_POINTS)

// Identity exception: dips to Compliance Reviewer after Stage 2, rejoins at S3.
const ID_EXC_PATH = smoothPath([
  N("customer"),
  N("s1"),
  N("s2"),
  N("h-id"),
  N("s3"),
  N("s4"),
  N("s5"),
  N("s6"),
  N("s7"),
  N("end"),
])

// Business exception: dips to Business Analyst after Stage 3, rejoins at S4.
const BIZ_EXC_PATH = smoothPath([
  N("customer"),
  N("s1"),
  N("s2"),
  N("s3"),
  N("h-biz"),
  N("s4"),
  N("s5"),
  N("s6"),
  N("s7"),
  N("end"),
])

// Risk exception: dips to Senior Analyst after Stage 6, rejoins at S7.
const RISK_EXC_PATH = smoothPath([
  N("customer"),
  N("s1"),
  N("s2"),
  N("s3"),
  N("s4"),
  N("s5"),
  N("s6"),
  N("h-risk"),
  N("s7"),
  N("end"),
])

// Short branch lines used as the visible "dip" indicators.
const idDipDown = smoothPath([N("s2"), N("h-id")])
const idDipUp = smoothPath([N("h-id"), N("s3")])
const bizDipDown = smoothPath([N("s3"), N("h-biz")])
const bizDipUp = smoothPath([N("h-biz"), N("s4")])
const riskDipDown = smoothPath([N("s6"), N("h-risk")])
const riskDipUp = smoothPath([N("h-risk"), N("s7")])

/* ---------- Packet definitions ---------- */

type Packet = {
  id: string
  label: string
  color: string
  path: string
  dur: number
  delay: number
  exception?: boolean
}

const PACKETS: Packet[] = [
  // 6 standard packets — most cases sail across the agent lane.
  {
    id: "p-1",
    label: "Application",
    color: NW.primary,
    path: STD_PATH,
    dur: 18,
    delay: 0,
  },
  {
    id: "p-2",
    label: "ID checks",
    color: NW.accent,
    path: STD_PATH,
    dur: 18,
    delay: 3,
  },
  {
    id: "p-3",
    label: "Plausibility",
    color: "#9333ea",
    path: STD_PATH,
    dur: 18,
    delay: 6,
  },
  {
    id: "p-4",
    label: "Risk score",
    color: "#0ea5e9",
    path: STD_PATH,
    dur: 18,
    delay: 9,
  },
  {
    id: "p-5",
    label: "Decision",
    color: NW.ok,
    path: STD_PATH,
    dur: 18,
    delay: 12,
  },
  {
    id: "p-6",
    label: "Setup",
    color: NW.primaryDark,
    path: STD_PATH,
    dur: 18,
    delay: 15,
  },
  // 3 exception packets — agents fail, cases hand off to humans then rejoin.
  {
    id: "ex-id",
    label: "ID mismatch",
    color: NW.exception,
    path: ID_EXC_PATH,
    dur: 22,
    delay: 4,
    exception: true,
  },
  {
    id: "ex-biz",
    label: "Complex business",
    color: NW.exception,
    path: BIZ_EXC_PATH,
    dur: 22,
    delay: 9,
    exception: true,
  },
  {
    id: "ex-risk",
    label: "High-risk case",
    color: NW.exception,
    path: RISK_EXC_PATH,
    dur: 22,
    delay: 14,
    exception: true,
  },
]

/* =================================================================
   COMPONENT
   ================================================================= */
export function SimpleFlow() {
  const [playing, setPlaying] = useState(true)
  const [speed, setSpeed] = useState<"slow" | "normal" | "fast">("normal")
  const svgRef = useRef<SVGSVGElement>(null)

  const speedMul = speed === "slow" ? 1.8 : speed === "fast" ? 0.55 : 1

  // Pause/resume all <animateMotion> elements when toggled.
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    if (playing) {
      svg.unpauseAnimations()
    } else {
      svg.pauseAnimations()
    }
  }, [playing])

  return (
    <main className="nw-grid-bg min-h-screen px-4 py-8">
      <div className="mx-auto max-w-[1500px]">
        {/* Toolbar */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-1.5">
                  <ArrowLeft className="size-4" />
                  Back to Journey
                </Button>
              </Link>
              <span
                className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white"
                style={{ background: NW.primary }}
              >
                Onboarding in motion
              </span>
            </div>
            <h1 className="mt-2 text-3xl font-bold leading-tight text-balance">
              Agents work the journey end-to-end. Humans handle the exceptions.
            </h1>
            <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted-foreground text-pretty">
              The seven stages of the Customer Onboarding Journey are mapped onto an
              agent swimlane. Most cases flow straight across all seven agents. When an
              agent's confidence is low or the case is complex, the work drops to a
              human reviewer and rejoins the agent lane afterwards.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={playing ? "default" : "outline"}
              size="sm"
              onClick={() => setPlaying((p) => !p)}
              className="gap-1.5"
              style={
                playing
                  ? { background: NW.primary, color: "white" }
                  : undefined
              }
            >
              {playing ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
              {playing ? "Pause" : "Play"}
            </Button>
            <div className="flex overflow-hidden rounded-md border">
              {(["slow", "normal", "fast"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSpeed(s)}
                  className="px-3 py-1.5 text-xs font-medium capitalize transition"
                  style={
                    s === speed
                      ? { background: NW.primary, color: "white" }
                      : { background: "transparent" }
                  }
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stage 7-step ribbon — instantly readable mapping back to the main page */}
        <ol className="mb-3 flex flex-wrap items-center gap-2 text-[11px]">
          {[
            "Application Submission",
            "Identity Verification",
            "Business Verification",
            "Ownership Structure",
            "Financial Due Diligence",
            "Risk Assessment",
            "Transaction Monitoring",
          ].map((name, i) => (
            <li key={name} className="flex items-center gap-2">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-semibold"
                style={{
                  background: `${NW.primary}14`,
                  color: NW.primary,
                  border: `1px solid ${NW.primary}33`,
                }}
              >
                <span
                  className="inline-flex size-4 items-center justify-center rounded-full text-[9px] font-bold text-white"
                  style={{ background: NW.primary }}
                >
                  {i + 1}
                </span>
                {name}
              </span>
              {i < 6 && <span className="text-muted-foreground/60">›</span>}
            </li>
          ))}
        </ol>

        {/* Stage / Flow canvas */}
        <div className="relative overflow-hidden rounded-2xl border-2 bg-card shadow-md">
          <div
            className="border-b px-5 py-3"
            style={{
              borderColor: `${NW.primary}22`,
              background: `linear-gradient(90deg, ${NW.primary}0a, ${NW.accent}0a)`,
            }}
          >
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <LegendDot color={NW.agent} label="Agent (autonomous)" Icon={Bot} />
              <LegendDot color={NW.human} label="Human (exception handler)" Icon={User} />
              <LegendDot
                color={NW.exception}
                label="Exception path — agent escalates"
                Icon={AlertTriangle}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <svg
              ref={svgRef}
              viewBox={`0 0 ${W} ${H}`}
              className="block min-w-[1300px] w-full"
              style={{ height: H }}
            >
              <defs>
                <linearGradient id="agent-lane" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={`${NW.primary}1f`} />
                  <stop offset="100%" stopColor={`${NW.primary}05`} />
                </linearGradient>
                <linearGradient id="human-lane" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={`${NW.human}05`} />
                  <stop offset="100%" stopColor={`${NW.human}1f`} />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Arrow markers */}
                <marker
                  id="arrow-down"
                  viewBox="0 0 12 12"
                  refX="10"
                  refY="6"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto"
                >
                  <path d="M2,2 L10,6 L2,10 Z" fill={NW.exception} />
                </marker>
                <marker
                  id="arrow-up"
                  viewBox="0 0 12 12"
                  refX="10"
                  refY="6"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto"
                >
                  <path d="M2,2 L10,6 L2,10 Z" fill={NW.exception} />
                </marker>
              </defs>

              {/* Lanes */}
              <rect
                x="0"
                y="60"
                width={W}
                height="180"
                fill="url(#agent-lane)"
              />
              <rect
                x="0"
                y={H - 230}
                width={W}
                height="180"
                fill="url(#human-lane)"
              />

              {/* Lane labels */}
              <text
                x={W / 2}
                y="56"
                fontSize="11"
                fontWeight="800"
                fill={NW.agent}
                letterSpacing="4"
                textAnchor="middle"
              >
                AGENTS LANE — STAGES 1 – 7
              </text>
              <text
                x={W / 2}
                y={H - 18}
                fontSize="11"
                fontWeight="800"
                fill={NW.human}
                letterSpacing="4"
                textAnchor="middle"
              >
                HUMANS LANE — EXCEPTIONS
              </text>

              {/* Standard agent backbone (visible flow) */}
              <path
                d={STD_PATH}
                fill="none"
                stroke={`${NW.primary}33`}
                strokeWidth="3"
              />
              <path
                d={STD_PATH}
                fill="none"
                stroke={NW.primary}
                strokeWidth="2"
                strokeDasharray="6 8"
                strokeLinecap="round"
                opacity="0.55"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="0"
                  to="-200"
                  dur={`${4 * speedMul}s`}
                  repeatCount="indefinite"
                />
              </path>

              {/* Exception dip lines */}
              {[idDipDown, idDipUp, bizDipDown, bizDipUp, riskDipDown, riskDipUp].map(
                (d, i) => (
                  <path
                    key={i}
                    d={d}
                    fill="none"
                    stroke={NW.exception}
                    strokeWidth="1.8"
                    strokeDasharray="4 5"
                    opacity="0.65"
                    markerEnd={i % 2 === 0 ? "url(#arrow-down)" : "url(#arrow-up)"}
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      from="0"
                      to={i % 2 === 0 ? "-100" : "100"}
                      dur={`${3 * speedMul}s`}
                      repeatCount="indefinite"
                    />
                  </path>
                ),
              )}

              {/* Exception trigger labels */}
              <ExceptionLabel x={390} y={310} text="Doc mismatch / low confidence" />
              <ExceptionLabel x={550} y={310} text="Complex business / unusual sector" />
              <ExceptionLabel x={1030} y={310} text="High-risk PEP / sanctions" />

              {/* Nodes */}
              {NODES.map((n) => (
                <NodeMark key={n.id} node={n} />
              ))}

              {/* Animated packets */}
              {PACKETS.map((p) => (
                <Packet key={p.id} packet={p} speedMul={speedMul} />
              ))}
            </svg>
          </div>
        </div>

        {/* Exception explainers — what makes an agent escalate to a human */}
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <ExceptionCard
            title="Stage 2 — Identity"
            human="Compliance Reviewer"
            triggers={[
              "Liveness / face-match below threshold",
              "Document tampering signals",
              "Cross-border ID with no electronic verification",
              "Mismatch between declared and verified identity",
            ]}
          />
          <ExceptionCard
            title="Stage 3 — Business"
            human="Business Analyst"
            triggers={[
              "Plausibility score contradicts declarations",
              "Premises check fails or shows virtual office",
              "Unusual sector outside policy thresholds",
              "Complex sole-trader trading evidence",
            ]}
          />
          <ExceptionCard
            title="Stage 6 — Risk"
            human="Senior Analyst"
            triggers={[
              "Sanctions or PEP true match",
              "Adverse media with high relevance",
              "Foreign jurisdiction risk above appetite",
              "Conflicting signals across risk factors",
            ]}
          />
        </div>
      </div>
    </main>
  )
}

/* ---------- Sub-components ---------- */

function LegendDot({
  color,
  label,
  Icon,
}: {
  color: string
  label: string
  Icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="inline-flex size-5 items-center justify-center rounded-full text-white"
        style={{ background: color }}
      >
        <Icon className="size-3" />
      </span>
      <span className="text-foreground/80">{label}</span>
    </span>
  )
}

function ExceptionLabel({ x, y, text }: { x: number; y: number; text: string }) {
  return (
    <g>
      <rect
        x={x - 95}
        y={y - 11}
        width="190"
        height="20"
        rx="10"
        fill={`${NW.exception}1a`}
        stroke={`${NW.exception}66`}
        strokeWidth="1"
      />
      <text
        x={x}
        y={y + 4}
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

function NodeMark({ node }: { node: FNode }) {
  const isCustomer = node.type === "customer"
  const isHuman = node.type === "human"
  const isEnd = node.type === "end"
  const isAgent = node.type === "agent"
  const fill = isHuman
    ? NW.human
    : isEnd
      ? NW.ok
      : isCustomer
        ? NW.accent
        : NW.primary
  const r = isCustomer || isEnd ? 36 : 38

  return (
    <g>
      {/* Pulse ring */}
      <circle cx={node.x} cy={node.y} r={r + 6} fill={`${fill}1f`}>
        <animate
          attributeName="r"
          values={`${r + 4};${r + 14};${r + 4}`}
          dur="2.4s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.6;0;0.6"
          dur="2.4s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Body */}
      <circle
        cx={node.x}
        cy={node.y}
        r={r}
        fill="white"
        stroke={fill}
        strokeWidth="2.5"
      />
      <circle cx={node.x} cy={node.y} r={r - 6} fill={fill} opacity="0.12" />

      {/* Stage badge for agents */}
      {isAgent && node.badge && (
        <g>
          <circle
            cx={node.x + r - 6}
            cy={node.y - r + 6}
            r="13"
            fill={NW.accent}
            stroke="white"
            strokeWidth="2"
          />
          <text
            x={node.x + r - 6}
            y={node.y - r + 10}
            fontSize="10"
            fontWeight="800"
            fill="white"
            textAnchor="middle"
          >
            {node.badge}
          </text>
        </g>
      )}

      {/* Icon — rendered via foreignObject so we can use lucide */}
      <foreignObject
        x={node.x - 14}
        y={node.y - 14}
        width="28"
        height="28"
        style={{ overflow: "visible" }}
      >
        <div
          className="flex size-7 items-center justify-center"
          style={{ color: fill }}
        >
          <node.Icon className="size-6" />
        </div>
      </foreignObject>

      {/* Bot / Human chip */}
      <g>
        <rect
          x={node.x - 22}
          y={node.y + r - 8}
          width="44"
          height="16"
          rx="8"
          fill={fill}
        />
        <foreignObject
          x={node.x - 20}
          y={node.y + r - 7}
          width="40"
          height="14"
          style={{ overflow: "visible" }}
        >
          <div className="flex h-full items-center justify-center gap-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
            {isHuman ? (
              <>
                <User className="size-2.5" />
                Human
              </>
            ) : isAgent ? (
              <>
                <Bot className="size-2.5" />
                Agent
              </>
            ) : isEnd ? (
              <>
                <CheckCircle2 className="size-2.5" />
                Done
              </>
            ) : (
              "Start"
            )}
          </div>
        </foreignObject>
      </g>

      {/* Label */}
      <text
        x={node.x}
        y={isHuman ? node.y + r + 32 : node.y - r - 18}
        fontSize="13"
        fontWeight="700"
        fill={NW.primaryDark}
        textAnchor="middle"
      >
        {node.label}
      </text>
      <text
        x={node.x}
        y={isHuman ? node.y + r + 48 : node.y - r - 4}
        fontSize="10.5"
        fill="#525866"
        textAnchor="middle"
      >
        {node.sub}
      </text>
    </g>
  )
}

function Packet({ packet, speedMul }: { packet: Packet; speedMul: number }) {
  return (
    <g>
      {/* Trailing glow */}
      <circle r="18" fill={packet.color} opacity="0.18" filter="url(#glow)">
        <animateMotion
          dur={`${packet.dur * speedMul}s`}
          begin={`${packet.delay * speedMul}s`}
          repeatCount="indefinite"
          path={packet.path}
          rotate="auto"
        />
      </circle>
      {/* Body */}
      <g>
        <circle r="10" fill={packet.color} stroke="white" strokeWidth="2.5">
          <animateMotion
            dur={`${packet.dur * speedMul}s`}
            begin={`${packet.delay * speedMul}s`}
            repeatCount="indefinite"
            path={packet.path}
            rotate="0"
          />
        </circle>
      </g>
      {/* Label chip */}
      <g>
        <rect
          x="-44"
          y="-32"
          width="88"
          height="20"
          rx="10"
          fill={packet.color}
        >
          <animateMotion
            dur={`${packet.dur * speedMul}s`}
            begin={`${packet.delay * speedMul}s`}
            repeatCount="indefinite"
            path={packet.path}
            rotate="0"
          />
        </rect>
        <text
          y="-18"
          fontSize="10"
          fontWeight="700"
          fill="white"
          textAnchor="middle"
        >
          {packet.exception ? `EXC · ${packet.label}` : packet.label}
          <animateMotion
            dur={`${packet.dur * speedMul}s`}
            begin={`${packet.delay * speedMul}s`}
            repeatCount="indefinite"
            path={packet.path}
            rotate="0"
          />
        </text>
      </g>
    </g>
  )
}

function ExceptionCard({
  title,
  human,
  triggers,
}: {
  title: string
  human: string
  triggers: string[]
}) {
  return (
    <div
      className="rounded-xl border-2 bg-card p-4 shadow-sm"
      style={{ borderColor: `${NW.exception}33` }}
    >
      <div className="flex items-start gap-2">
        <span
          className="inline-flex size-7 shrink-0 items-center justify-center rounded-full text-white"
          style={{ background: NW.exception }}
        >
          <AlertTriangle className="size-3.5" />
        </span>
        <div>
          <div className="text-sm font-bold leading-tight">{title}</div>
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
            Escalates to {human}
          </div>
        </div>
      </div>
      <ul className="mt-3 space-y-1.5">
        {triggers.map((t) => (
          <li key={t} className="flex items-start gap-1.5 text-xs leading-snug">
            <Wrench className="mt-0.5 size-3 shrink-0" style={{ color: NW.exception }} />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
