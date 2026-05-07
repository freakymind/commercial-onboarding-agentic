"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Bot,
  CheckCircle2,
  FileText,
  Pause,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  User,
  UserCircle2,
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

const W = 1400
const H = 540
const TOP = 160
const BOTTOM = 380

const NODES: FNode[] = [
  {
    id: "customer",
    x: 90,
    y: 270,
    label: "Customer",
    sub: "Submits application",
    type: "customer",
    Icon: UserCircle2,
  },
  {
    id: "intake",
    x: 230,
    y: TOP,
    label: "Application Intake",
    sub: "Parses forms & docs",
    type: "agent",
    Icon: FileText,
  },
  {
    id: "id",
    x: 390,
    y: TOP,
    label: "ID Verification",
    sub: "Validates identity",
    type: "agent",
    Icon: ShieldCheck,
  },
  {
    id: "reviewer",
    x: 550,
    y: BOTTOM,
    label: "Compliance Reviewer",
    sub: "Edge-case decisions",
    type: "human",
    Icon: User,
  },
  {
    id: "kyc",
    x: 710,
    y: TOP,
    label: "KYC Screening",
    sub: "Sanctions & PEP",
    type: "agent",
    Icon: Search,
  },
  {
    id: "plaus",
    x: 870,
    y: TOP,
    label: "Plausibility",
    sub: "Triangulates evidence",
    type: "agent",
    Icon: Sparkles,
  },
  {
    id: "decide",
    x: 1030,
    y: BOTTOM,
    label: "Decision Maker",
    sub: "Final approval",
    type: "human",
    Icon: User,
  },
  {
    id: "setup",
    x: 1190,
    y: TOP,
    label: "Account Setup",
    sub: "Provisions account",
    type: "agent",
    Icon: Bot,
  },
  {
    id: "done",
    x: 1330,
    y: 270,
    label: "Onboarded",
    sub: "Customer is live",
    type: "end",
    Icon: CheckCircle2,
  },
]

function buildPath(nodes: FNode[]) {
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

const PATH_D = buildPath(NODES)

const SPEEDS = { slow: 22, normal: 14, fast: 8 } as const
type Speed = keyof typeof SPEEDS

const NW = {
  primary: "#5a287d",
  accent: "#bd0f72",
  agent: "#5a287d",
  human: "#0f7ab5",
}

const PACKETS = [
  { color: "#bd0f72", label: "Application", r: 8 },
  { color: "#5a287d", label: "ID", r: 7 },
  { color: "#0f7ab5", label: "Case file", r: 7 },
  { color: "#bd0f72", label: "Decision", r: 6 },
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
      <div className="mx-auto max-w-[1500px]">
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
                A live look at how agents and humans hand off work to onboard a
                commercial customer. Watch the work packets travel between
                roles.
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
                minWidth: 1000,
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
                    <stop
                      offset="0%"
                      stopColor={NW.agent}
                      stopOpacity="0.04"
                    />
                    <stop
                      offset="50%"
                      stopColor={NW.agent}
                      stopOpacity="0.12"
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
                    <stop
                      offset="0%"
                      stopColor={NW.human}
                      stopOpacity="0.04"
                    />
                    <stop
                      offset="50%"
                      stopColor={NW.human}
                      stopOpacity="0.12"
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
                  y="60"
                  width={W}
                  height="190"
                  fill="url(#agent-lane)"
                />
                <rect
                  x="0"
                  y="290"
                  width={W}
                  height="190"
                  fill="url(#human-lane)"
                />

                {/* Lane labels — placed in the empty middle band so they never overlap nodes */}
                <text
                  x={W / 2}
                  y="56"
                  fontSize="11"
                  fontWeight="800"
                  fill={NW.agent}
                  letterSpacing="4"
                  textAnchor="middle"
                >
                  AGENTS LANE
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
                  HUMANS LANE
                </text>

                {/* Base path */}
                <path
                  id="flow-path"
                  d={PATH_D}
                  fill="none"
                  stroke={`${NW.primary}33`}
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Animated dashed glow overlay */}
                <path
                  d={PATH_D}
                  fill="none"
                  stroke={NW.accent}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="6 14"
                  opacity="0.55"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="0"
                    to="-200"
                    dur={`${dur}s`}
                    repeatCount="indefinite"
                  />
                </path>

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

                {/* Traveling work packets */}
                {PACKETS.map((p, i) => (
                  <g key={`packet-${i}`}>
                    <circle
                      r={p.r}
                      fill={p.color}
                      style={{
                        filter: `drop-shadow(0 0 8px ${p.color})`,
                      }}
                    >
                      <animateMotion
                        dur={`${dur}s`}
                        begin={`${(dur / PACKETS.length) * i}s`}
                        repeatCount="indefinite"
                        rotate="auto"
                      >
                        <mpath
                          xlinkHref="#flow-path"
                          href="#flow-path"
                        />
                      </animateMotion>
                    </circle>
                    {/* Trailing fade */}
                    <circle
                      r={p.r * 1.6}
                      fill={p.color}
                      opacity="0.18"
                    >
                      <animateMotion
                        dur={`${dur}s`}
                        begin={`${(dur / PACKETS.length) * i - 0.18}s`}
                        repeatCount="indefinite"
                      >
                        <mpath
                          xlinkHref="#flow-path"
                          href="#flow-path"
                        />
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
              desc="Reviews edge cases & makes final approval"
              color={NW.human}
            />
            <Legend
              label="Work packet"
              desc="A document, decision or case file in motion"
              color={NW.accent}
            />
            <Legend
              label="Customer"
              desc="Submits the application and gets onboarded"
              color={NW.accent}
            />
          </div>
        </section>

        {/* Narrative cards */}
        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <Story
            title="Agents do the heavy lifting"
            body="Application intake, ID verification, KYC screening, plausibility and account setup are all run autonomously by purpose-built agents."
            color={NW.agent}
          />
          <Story
            title="Humans handle the judgement calls"
            body="Compliance reviewers and decision makers step in for edge cases — high-risk sectors, contradictions, plausibility scores below threshold."
            color={NW.human}
          />
          <Story
            title="Continuous handoff"
            body="Work flows continuously between agents and humans. No queues, no batched lists — every case in motion at the same time."
            color={NW.accent}
          />
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
}: {
  title: string
  body: string
  color: string
}) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div
        className="text-xs font-bold uppercase tracking-wider"
        style={{ color }}
      >
        {title}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {body}
      </p>
    </div>
  )
}
