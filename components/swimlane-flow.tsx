"use client"

import { Bot, User } from "lucide-react"

/* ---------- NatWest palette (kept consistent with the rest of the app) ---------- */
const NW = {
  primary: "#5a287d",
  accent: "#bd0f72",
  agent: "#5a287d",
  human: "#1f6cab",
  exception: "#d97706",
  agentBg: "rgba(90,40,125,0.06)",
  humanBg: "rgba(31,108,171,0.07)",
}

/* ---------- Geometry (SVG viewBox) ---------- */
const W = 1240
const H = 420
const AGENT_Y = 130
const HUMAN_Y = 310
const NODE_R = 26
const HUMAN_R = 24

/* ---------- Stage data — mirrors the 7 stages on the main journey page ---------- */
type StageNode = {
  id: string
  x: number
  n?: number
  name: string
  kind: "edge" | "stage"
  hasHuman?: boolean
  humanRole?: string
  humanTrigger?: string
}

const NODES: StageNode[] = [
  { id: "cust", x: 70, name: "Customer", kind: "edge" },
  { id: "s1", x: 210, n: 1, name: "Application", kind: "stage" },
  {
    id: "s2",
    x: 350,
    n: 2,
    name: "Identity",
    kind: "stage",
    hasHuman: true,
    humanRole: "Compliance Reviewer",
    humanTrigger: "Doc mismatch / low confidence",
  },
  {
    id: "s3",
    x: 490,
    n: 3,
    name: "Business",
    kind: "stage",
    hasHuman: true,
    humanRole: "Business Analyst",
    humanTrigger: "Plausibility contradictions",
  },
  { id: "s4", x: 630, n: 4, name: "Ownership", kind: "stage" },
  { id: "s5", x: 770, n: 5, name: "Financials", kind: "stage" },
  {
    id: "s6",
    x: 910,
    n: 6,
    name: "Risk",
    kind: "stage",
    hasHuman: true,
    humanRole: "Senior Analyst",
    humanTrigger: "High-risk / complex case",
  },
  { id: "s7", x: 1050, n: 7, name: "Monitoring", kind: "stage" },
  { id: "done", x: 1180, name: "Onboarded", kind: "edge" },
]

const HUMANS = NODES.filter((n) => n.hasHuman)

/* ---------- Path builders ---------- */
const mainRailD = `M ${NODES[0].x} ${AGENT_Y} L ${NODES[NODES.length - 1].x} ${AGENT_Y}`

function exceptionPath(node: StageNode) {
  const idx = NODES.findIndex((n) => n.id === node.id)
  const next = NODES[idx + 1]
  const xa = node.x
  const xb = next.x
  // Smooth U-shape: down from agent rail at xa, across bottom (visiting human at xa),
  // then back up to agent rail at xb.
  return `M ${xa} ${AGENT_Y} 
          C ${xa} ${AGENT_Y + 90}, ${xa} ${HUMAN_Y - 40}, ${xa} ${HUMAN_Y}
          C ${xa} ${HUMAN_Y + 30}, ${xb} ${HUMAN_Y + 30}, ${xb} ${HUMAN_Y}
          C ${xb} ${HUMAN_Y - 40}, ${xb} ${AGENT_Y + 90}, ${xb} ${AGENT_Y}`
}

/* =================================================================
   COMPONENT
   ================================================================= */
export function SwimlaneFlow() {
  return (
    <div className="rounded-2xl border-2 border-[#5a287d]/20 bg-card p-3 shadow-sm sm:p-5">
      {/* Lane legend */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <LaneTag
          icon={<Bot className="size-3.5" />}
          label="Agent lane"
          caption="Autonomous — runs every case end-to-end"
          color={NW.agent}
        />
        <CaseLegend />
        <LaneTag
          icon={<User className="size-3.5" />}
          label="Human lane"
          caption="Steps in only when agents escalate"
          color={NW.human}
          align="right"
        />
      </div>

      {/* SVG canvas + HTML overlay */}
      <div className="relative w-full" style={{ aspectRatio: `${W} / ${H}` }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
          <defs>
            <filter id="dot-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3.5" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Persistent path defs that animateMotion can reference */}
            <path id="main-rail" d={mainRailD} />
            {HUMANS.map((h) => (
              <path key={`p-${h.id}`} id={`exc-${h.id}`} d={exceptionPath(h)} />
            ))}
          </defs>

          {/* Lane backgrounds */}
          <rect x="0" y="60" width={W} height="160" fill={NW.agentBg} rx="14" />
          <rect x="0" y="240" width={W} height="160" fill={NW.humanBg} rx="14" />

          {/* Lane divider midline */}
          <line
            x1="40"
            x2={W - 40}
            y1="230"
            y2="230"
            stroke="#e9e3ee"
            strokeWidth="1"
            strokeDasharray="2 6"
          />

          {/* Lane labels (left edge, vertical-aligned text) */}
          <text
            x="40"
            y="84"
            fontSize="10"
            fontWeight="800"
            letterSpacing="3"
            fill={NW.agent}
          >
            AGENT LANE — AUTONOMOUS
          </text>
          <text
            x="40"
            y="264"
            fontSize="10"
            fontWeight="800"
            letterSpacing="3"
            fill={NW.human}
          >
            HUMAN LANE — ESCALATIONS
          </text>

          {/* Static rail underlay */}
          <use
            href="#main-rail"
            stroke={NW.agent}
            strokeOpacity="0.18"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
          {/* Animated dashed rail overlay */}
          <use
            href="#main-rail"
            stroke={NW.agent}
            strokeWidth="2.5"
            fill="none"
            strokeDasharray="8 8"
            strokeLinecap="round"
            className="animate-flow-dash"
          />

          {/* Exception detour paths */}
          {HUMANS.map((h) => (
            <use
              key={`e-${h.id}`}
              href={`#exc-${h.id}`}
              stroke={NW.exception}
              strokeOpacity="0.55"
              strokeWidth="2"
              fill="none"
              strokeDasharray="5 6"
              className="animate-flow-dash"
            />
          ))}

          {/* Moving packets — pure colored dots, no text */}
          {/* Happy-path packets: stagger 4 dots along main rail */}
          {[0, 1.5, 3, 4.5].map((delay, i) => (
            <g key={`hp-${i}`} filter="url(#dot-glow)">
              <circle r="7" fill={NW.accent}>
                <animateMotion
                  dur="8s"
                  repeatCount="indefinite"
                  begin={`${delay}s`}
                  rotate="auto"
                >
                  <mpath href="#main-rail" />
                </animateMotion>
              </circle>
              <circle r="7" fill={NW.accent} opacity="0.35">
                <animateMotion
                  dur="8s"
                  repeatCount="indefinite"
                  begin={`${delay}s`}
                  rotate="auto"
                >
                  <mpath href="#main-rail" />
                </animateMotion>
                <animate
                  attributeName="r"
                  values="7;14;7"
                  dur="1.2s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          ))}

          {/* Exception packets — amber, follow detour paths */}
          {HUMANS.map((h, i) => (
            <g key={`ep-${h.id}`} filter="url(#dot-glow)">
              <circle r="7" fill={NW.exception}>
                <animateMotion
                  dur="11s"
                  repeatCount="indefinite"
                  begin={`${i * 3 + 1}s`}
                  rotate="auto"
                >
                  <mpath href={`#exc-${h.id}`} />
                </animateMotion>
              </circle>
              <circle r="7" fill={NW.exception} opacity="0.35">
                <animateMotion
                  dur="11s"
                  repeatCount="indefinite"
                  begin={`${i * 3 + 1}s`}
                  rotate="auto"
                >
                  <mpath href={`#exc-${h.id}`} />
                </animateMotion>
                <animate
                  attributeName="r"
                  values="7;14;7"
                  dur="1.2s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          ))}

          {/* Pulse rings on stage circles */}
          {NODES.filter((n) => n.kind === "stage").map((n, i) => (
            <circle
              key={`ring-${n.id}`}
              cx={n.x}
              cy={AGENT_Y}
              r={NODE_R}
              fill="none"
              stroke={NW.agent}
              strokeWidth="2"
              opacity="0.4"
            >
              <animate
                attributeName="r"
                values={`${NODE_R};${NODE_R + 12};${NODE_R}`}
                dur="2.4s"
                begin={`${i * 0.25}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.5;0;0.5"
                dur="2.4s"
                begin={`${i * 0.25}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
          {/* Pulse rings on human circles */}
          {HUMANS.map((n, i) => (
            <circle
              key={`hring-${n.id}`}
              cx={n.x}
              cy={HUMAN_Y}
              r={HUMAN_R}
              fill="none"
              stroke={NW.human}
              strokeWidth="2"
              opacity="0.45"
            >
              <animate
                attributeName="r"
                values={`${HUMAN_R};${HUMAN_R + 10};${HUMAN_R}`}
                dur="2.6s"
                begin={`${i * 0.4}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.55;0;0.55"
                dur="2.6s"
                begin={`${i * 0.4}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </svg>

        {/* HTML overlay — node visuals (icons + labels) */}
        <div className="pointer-events-none absolute inset-0">
          {NODES.map((n) => (
            <NodeChip key={n.id} node={n} />
          ))}
          {HUMANS.map((h) => (
            <HumanChip key={`hc-${h.id}`} node={h} />
          ))}
        </div>
      </div>

      {/* Concise summary strip below */}
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <SummaryCard
          tone="agent"
          title="What you see on the agent lane"
          body="Pink dots are cases flowing autonomously through all 7 agent stages — Application, Identity, Business, Ownership, Financials, Risk and Monitoring."
        />
        <SummaryCard
          tone="exception"
          title="What you see dipping down"
          body="Amber dots are cases where an agent flagged a problem and routed the case to a human, then handed it back to continue."
        />
        <SummaryCard
          tone="human"
          title="Who picks them up"
          body="Compliance Reviewer (S2), Business Analyst (S3) and Senior Analyst (S6) — only the stages where exceptions actually need a human."
        />
      </div>
    </div>
  )
}

/* ---------- Node visuals ---------- */

function NodeChip({ node }: { node: StageNode }) {
  const isEdge = node.kind === "edge"
  const cx = (node.x / W) * 100
  const cy = (AGENT_Y / H) * 100
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${cx}%`, top: `${cy}%` }}
    >
      <div
        className="flex flex-col items-center"
        style={{ width: 110 }}
      >
        <div
          className="relative flex size-12 items-center justify-center rounded-full border-[2.5px] bg-white shadow-md"
          style={{
            borderColor: isEdge ? NW.accent : NW.agent,
          }}
        >
          {isEdge ? (
            <span
              className="text-[10px] font-bold uppercase tracking-wider"
              style={{ color: NW.accent }}
            >
              {node.id === "cust" ? "Apply" : "Done"}
            </span>
          ) : (
            <>
              <Bot className="size-5" style={{ color: NW.agent }} />
              <span
                className="absolute -right-1.5 -top-1.5 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-[10px] font-bold text-white shadow"
                style={{ background: NW.agent }}
              >
                S{node.n}
              </span>
            </>
          )}
        </div>
        <div className="mt-2 text-center">
          <div
            className="text-[11px] font-bold leading-tight"
            style={{ color: isEdge ? NW.accent : NW.agent }}
          >
            {node.name}
          </div>
          {!isEdge && (
            <div className="mt-0.5 text-[9px] uppercase tracking-wider text-muted-foreground">
              Agent
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function HumanChip({ node }: { node: StageNode }) {
  const cx = (node.x / W) * 100
  const cy = (HUMAN_Y / H) * 100
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${cx}%`, top: `${cy}%` }}
    >
      <div
        className="flex flex-col items-center"
        style={{ width: 130 }}
      >
        <div
          className="flex size-11 items-center justify-center rounded-full border-[2.5px] bg-white shadow-md"
          style={{ borderColor: NW.human }}
        >
          <User className="size-5" style={{ color: NW.human }} />
        </div>
        <div className="mt-2 text-center">
          <div
            className="text-[11px] font-bold leading-tight"
            style={{ color: NW.human }}
          >
            {node.humanRole}
          </div>
          <div className="mt-0.5 text-[9px] uppercase tracking-wider text-muted-foreground">
            Stage {node.n} · Human
          </div>
          {node.humanTrigger && (
            <div
              className="mt-1 inline-block max-w-[120px] rounded px-1.5 py-0.5 text-[9px] font-medium leading-snug"
              style={{
                color: NW.exception,
                background: "rgba(217,119,6,0.1)",
              }}
            >
              {node.humanTrigger}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ---------- Tags / legend / summary ---------- */

function LaneTag({
  icon,
  label,
  caption,
  color,
  align = "left",
}: {
  icon: React.ReactNode
  label: string
  caption: string
  color: string
  align?: "left" | "right"
}) {
  return (
    <div
      className={
        "flex items-center gap-2 " +
        (align === "right" ? "ml-auto flex-row-reverse text-right" : "")
      }
    >
      <span
        className="inline-flex size-6 items-center justify-center rounded-md text-white"
        style={{ background: color }}
      >
        {icon}
      </span>
      <div className="leading-tight">
        <div className="text-xs font-bold" style={{ color }}>
          {label}
        </div>
        <div className="text-[10px] text-muted-foreground">{caption}</div>
      </div>
    </div>
  )
}

function CaseLegend() {
  return (
    <div className="flex items-center gap-4 text-[10px] font-medium text-muted-foreground">
      <span className="inline-flex items-center gap-1.5">
        <span
          className="block size-2.5 rounded-full"
          style={{
            background: NW.accent,
            boxShadow: `0 0 8px ${NW.accent}`,
          }}
        />
        Agent-handled case
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span
          className="block size-2.5 rounded-full"
          style={{
            background: NW.exception,
            boxShadow: `0 0 8px ${NW.exception}`,
          }}
        />
        Escalated to human
      </span>
    </div>
  )
}

function SummaryCard({
  tone,
  title,
  body,
}: {
  tone: "agent" | "human" | "exception"
  title: string
  body: string
}) {
  const color =
    tone === "agent" ? NW.agent : tone === "human" ? NW.human : NW.exception
  return (
    <div
      className="rounded-xl border-l-4 bg-muted/30 p-3"
      style={{ borderLeftColor: color }}
    >
      <div
        className="text-xs font-bold uppercase tracking-wider"
        style={{ color }}
      >
        {title}
      </div>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
        {body}
      </p>
    </div>
  )
}
