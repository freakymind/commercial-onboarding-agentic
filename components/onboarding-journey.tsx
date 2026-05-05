"use client"

import { useMemo, useState } from "react"
import {
  Bot,
  Building2,
  CheckCircle2,
  ChevronRight,
  Cog,
  FileText,
  Fingerprint,
  Layers,
  Plus,
  Radar,
  ScanSearch,
  Settings2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Agent,
  defaultPalette,
  initialAgents,
  initialStages,
  maturityDescriptions,
  Stage,
  ThemePalette,
} from "@/lib/journey-data"
import { AgentDialog } from "@/components/agent-dialog"
import { ThemeCustomizer } from "@/components/theme-customizer"

const stageIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "stage-1": FileText,
  "stage-2": Fingerprint,
  "stage-3": Building2,
  "stage-4": Users,
  "stage-5": Wallet,
  "stage-6": ShieldCheck,
  "stage-7": Radar,
}

function hexToRgba(hex: string, alpha: number) {
  const m = hex.replace("#", "")
  const full = m.length === 3 ? m.split("").map((c) => c + c).join("") : m
  const r = parseInt(full.slice(0, 2), 16)
  const g = parseInt(full.slice(2, 4), 16)
  const b = parseInt(full.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function OnboardingJourney() {
  const [stages] = useState<Stage[]>(initialStages)
  const [agents, setAgents] = useState<Agent[]>(initialAgents)
  const [palette, setPalette] = useState<ThemePalette>(defaultPalette)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add")
  const [dialogInitial, setDialogInitial] = useState<Partial<Agent> | undefined>()

  const commonAgents = useMemo(
    () => agents.filter((a) => a.scope === "common"),
    [agents],
  )
  const stageAgents = useMemo(() => {
    const map = new Map<string, Agent[]>()
    for (const a of agents) {
      if (a.scope === "stage" && a.stageId) {
        const arr = map.get(a.stageId) ?? []
        arr.push(a)
        map.set(a.stageId, arr)
      }
    }
    return map
  }, [agents])

  const openAdd = (preset?: Partial<Agent>) => {
    setDialogMode("add")
    setDialogInitial(preset)
    setDialogOpen(true)
  }
  const openEdit = (a: Agent) => {
    setDialogMode("edit")
    setDialogInitial(a)
    setDialogOpen(true)
  }
  const saveAgent = (next: Omit<Agent, "id"> & { id?: string }) => {
    setAgents((prev) => {
      if (next.id) {
        return prev.map((a) => (a.id === next.id ? ({ ...a, ...next } as Agent) : a))
      }
      const id = `agent-${Date.now().toString(36)}`
      return [...prev, { ...(next as Agent), id }]
    })
  }
  const deleteAgent = (id: string) => {
    setAgents((prev) => prev.filter((a) => a.id !== id))
  }

  // CSS variable style object so children can read theme tokens
  const themeStyle = {
    ["--c-primary" as string]: palette.primary,
    ["--c-accent" as string]: palette.accent,
    ["--c-agentic" as string]: palette.agentic,
    ["--c-human" as string]: palette.human,
    ["--c-common" as string]: palette.common,
    ["--c-stage" as string]: palette.stage,
  } as React.CSSProperties

  return (
    <TooltipProvider delayDuration={150}>
      <div className="nw-grid-bg min-h-screen" style={themeStyle}>
        <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-8 lg:py-12">
          {/* Header */}
          <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-3">
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex size-8 items-center justify-center rounded-md text-white shadow-sm"
                  style={{ background: `linear-gradient(135deg, ${palette.primary}, ${palette.accent})` }}
                >
                  <Sparkles className="size-4" />
                </span>
                <Badge
                  variant="outline"
                  className="border-current text-xs font-medium"
                  style={{ color: palette.primary, borderColor: hexToRgba(palette.primary, 0.3) }}
                >
                  Agentic Operating Model
                </Badge>
              </div>
              <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.6rem]">
                <span className="shimmer-text">Commercial Onboarding Journey</span>{" "}
                <span className="text-foreground">with Embedded AI Agents</span>
              </h1>
              <p className="text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                From manual process steps to reusable, governed agentic capabilities across
                onboarding — a board-ready view of where humans, controls and AI agents
                collaborate.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <ThemeCustomizer palette={palette} onChange={setPalette} />
              <Button
                size="sm"
                onClick={() => openAdd()}
                className="gap-2 text-white shadow-sm"
                style={{ background: palette.primary }}
              >
                <Plus className="size-4" />
                Add agent
              </Button>
            </div>
          </header>

          {/* Legend */}
          <Legend palette={palette} />

          {/* Stages */}
          <section className="mt-8">
            <div className="grid gap-x-4 gap-y-8 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
              {stages.map((stage, idx) => (
                <StageCard
                  key={stage.id}
                  stage={stage}
                  index={idx}
                  total={stages.length}
                  agents={stageAgents.get(stage.id) ?? []}
                  palette={palette}
                  onAddAgent={() => openAdd({ scope: "stage", stageId: stage.id })}
                  onEditAgent={openEdit}
                />
              ))}
              <OnboardedCard palette={palette} delay={stages.length} />
            </div>
          </section>

          {/* Common Reusable Agent Layer */}
          <CommonAgentLayer
            agents={commonAgents}
            palette={palette}
            onAdd={() => openAdd({ scope: "common" })}
            onEdit={openEdit}
          />

          {/* Maturity model */}
          <MaturityModel palette={palette} />

          <footer className="mt-10 flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>
              {agents.length} agents · {stages.length} stages · Theme:{" "}
              <span className="font-medium text-foreground">{palette.name}</span>
            </span>
            <span>Tap any agent card to edit, or use Add agent to extend the model.</span>
          </footer>
        </div>

        <AgentDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          mode={dialogMode}
          initial={dialogInitial}
          stages={stages}
          onSave={saveAgent}
          onDelete={deleteAgent}
        />
      </div>
    </TooltipProvider>
  )
}

/* ---------- Legend ---------- */

function Legend({ palette }: { palette: ThemePalette }) {
  const items = [
    { color: palette.agentic, label: "Agentic-enhanced process" },
    { color: palette.human, label: "Human / control process" },
    { color: palette.common, label: "Common reusable agents" },
    { color: palette.stage, label: "Stage-specific agents" },
    { color: palette.primary, label: "Onboarding journey flow", arrow: true },
  ]
  return (
    <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl border bg-card/60 p-3 backdrop-blur">
      {items.map((it) => (
        <div key={it.label} className="flex items-center gap-2 text-xs text-foreground/80">
          {it.arrow ? (
            <span
              className="inline-block h-[3px] w-7 rounded-full"
              style={{ background: it.color }}
            />
          ) : (
            <span
              className="inline-block size-3 rounded-sm"
              style={{ background: it.color }}
            />
          )}
          <span>{it.label}</span>
        </div>
      ))}
    </div>
  )
}

/* ---------- Stage card ---------- */

function StageCard({
  stage,
  index,
  total,
  agents,
  palette,
  onAddAgent,
  onEditAgent,
}: {
  stage: Stage
  index: number
  total: number
  agents: Agent[]
  palette: ThemePalette
  onAddAgent: () => void
  onEditAgent: (a: Agent) => void
}) {
  const Icon = stageIcons[stage.id] ?? Cog
  const last = index === total - 1

  return (
    <div
      className="animate-draw-in relative flex flex-col"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      {/* Connector arrow to next stage (desktop only) */}
      {!last && <Connector palette={palette} />}

      {/* Header with number + icon */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <span
            className="absolute inset-0 rounded-full animate-pulse-ring"
            style={{ background: hexToRgba(palette.primary, 0.35) }}
            aria-hidden
          />
          <span
            className="relative flex size-11 items-center justify-center rounded-full text-sm font-semibold text-white shadow-md ring-4 ring-background"
            style={{
              background: `linear-gradient(135deg, ${palette.primary}, ${palette.accent})`,
            }}
          >
            {stage.number}
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Stage {stage.number}
          </p>
          <h3 className="text-base font-semibold leading-tight">
            <span className="inline-flex items-center gap-1.5">
              <Icon className="size-4" style={{ color: palette.primary }} />
              {stage.name}
            </span>
          </h3>
        </div>
      </div>

      {/* Processes */}
      <div className="mt-4 flex flex-col gap-2">
        {stage.processes.map((p) => {
          const isAgentic = p.type === "agentic"
          const color = isAgentic ? palette.agentic : palette.human
          return (
            <div
              key={p.id}
              className="group flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm shadow-xs transition hover:-translate-y-px hover:shadow-sm"
              style={{
                borderColor: hexToRgba(color, 0.35),
                background: `linear-gradient(180deg, ${hexToRgba(color, 0.08)}, transparent)`,
              }}
            >
              <span
                className="size-2 shrink-0 rounded-full"
                style={{ background: color, boxShadow: `0 0 0 3px ${hexToRgba(color, 0.18)}` }}
              />
              <span className="flex-1 leading-tight">{p.name}</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    className="text-[10px] font-medium uppercase tracking-wide"
                    style={{ color }}
                  >
                    {isAgentic ? "Agentic" : "Human"}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  {isAgentic
                    ? "Agentic-enhanced process — AI assists or executes"
                    : "Human / control process"}
                </TooltipContent>
              </Tooltip>
            </div>
          )
        })}
      </div>

      {/* Stage agents */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Stage agents
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 px-2 text-xs"
            onClick={onAddAgent}
          >
            <Plus className="size-3.5" />
            Add
          </Button>
        </div>

        {agents.length === 0 ? (
          <button
            onClick={onAddAgent}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed bg-muted/30 px-3 py-3 text-xs text-muted-foreground transition hover:border-primary/40 hover:bg-muted/60 hover:text-foreground"
          >
            <Plus className="size-3.5" />
            Add stage-specific agent
          </button>
        ) : (
          <div className="flex flex-col gap-2">
            {agents.map((a) => (
              <AgentCard key={a.id} agent={a} palette={palette} onClick={() => onEditAgent(a)} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* ---------- Connector arrow (between stage cards) ---------- */

function Connector({ palette }: { palette: ThemePalette }) {
  // Visible on large screens only — points from this card to the next.
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -right-2 top-4 z-10 hidden lg:block"
    >
      <svg width="28" height="14" viewBox="0 0 28 14">
        <line
          x1="0"
          y1="7"
          x2="20"
          y2="7"
          stroke={palette.primary}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="4 4"
          className="animate-flow-dash"
        />
        <path d="M20 1 L28 7 L20 13 Z" fill={palette.primary} />
      </svg>
    </div>
  )
}

/* ---------- Agent card ---------- */

function AgentCard({
  agent,
  palette,
  onClick,
  variant = "stage",
}: {
  agent: Agent
  palette: ThemePalette
  onClick: () => void
  variant?: "stage" | "common"
}) {
  const baseColor = agent.color || (variant === "common" ? palette.common : palette.stage)
  return (
    <button
      onClick={onClick}
      className="group relative w-full overflow-hidden rounded-xl border bg-card p-3 text-left shadow-xs transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      style={{
        borderColor: hexToRgba(baseColor, 0.35),
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-1"
        style={{ background: baseColor }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-6 -top-6 size-16 rounded-full opacity-20 blur-xl transition group-hover:opacity-40"
        style={{ background: baseColor }}
      />
      <div className="flex items-start gap-2.5">
        <span
          className="flex size-8 shrink-0 items-center justify-center rounded-lg text-white shadow-sm"
          style={{ background: baseColor }}
        >
          <Bot className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-[13px] font-semibold leading-tight">{agent.name}</p>
            <span
              className="shrink-0 rounded-full border px-1.5 py-0.5 font-mono text-[10px] font-semibold"
              style={{
                color: baseColor,
                borderColor: hexToRgba(baseColor, 0.4),
                background: hexToRgba(baseColor, 0.08),
              }}
            >
              {agent.maturity}
            </span>
          </div>
          <p className="mt-1 line-clamp-3 text-[11px] leading-snug text-muted-foreground">
            {agent.function}
          </p>
        </div>
      </div>
      <div className="absolute right-2 top-2 opacity-0 transition group-hover:opacity-100">
        <Settings2 className="size-3.5 text-muted-foreground" />
      </div>
    </button>
  )
}

/* ---------- Onboarded customer end card ---------- */

function OnboardedCard({ palette, delay }: { palette: ThemePalette; delay: number }) {
  return (
    <div
      className="animate-draw-in relative flex flex-col rounded-2xl border-2 p-5 shadow-md"
      style={{
        animationDelay: `${delay * 70}ms`,
        borderColor: hexToRgba(palette.primary, 0.35),
        background: `linear-gradient(160deg, ${hexToRgba(palette.primary, 0.06)}, ${hexToRgba(
          palette.accent,
          0.04,
        )})`,
      }}
    >
      <div className="flex items-center gap-3">
        <span
          className="flex size-11 items-center justify-center rounded-full text-white shadow-md"
          style={{
            background: `linear-gradient(135deg, ${palette.primary}, ${palette.accent})`,
          }}
        >
          <CheckCircle2 className="size-5" />
        </span>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            End state
          </p>
          <h3 className="text-base font-semibold leading-tight">Onboarded Customer</h3>
        </div>
      </div>
      <div className="mt-5 flex flex-1 flex-col items-center justify-center gap-3 rounded-xl border bg-card/60 p-5 text-center">
        <span
          className="animate-float-soft flex size-14 items-center justify-center rounded-2xl text-white shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${palette.primary}, ${palette.accent})`,
          }}
        >
          <Building2 className="size-7" />
        </span>
        <p className="max-w-[220px] text-sm font-medium leading-snug text-foreground">
          Customer ready for relationship activation
        </p>
        <Badge
          className="border-transparent text-[10px] font-medium uppercase tracking-wider text-white"
          style={{ background: palette.primary }}
        >
          Activated
        </Badge>
      </div>
    </div>
  )
}

/* ---------- Common reusable agent layer ---------- */

function CommonAgentLayer({
  agents,
  palette,
  onAdd,
  onEdit,
}: {
  agents: Agent[]
  palette: ThemePalette
  onAdd: () => void
  onEdit: (a: Agent) => void
}) {
  return (
    <section
      className="relative mt-12 overflow-hidden rounded-2xl border-2 p-5 shadow-sm sm:p-6"
      style={{
        borderColor: hexToRgba(palette.common, 0.4),
        background: `linear-gradient(120deg, ${hexToRgba(palette.common, 0.1)} 0%, ${hexToRgba(
          palette.common,
          0.03,
        )} 60%, transparent 100%)`,
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-0 size-72 rounded-full opacity-20 blur-3xl"
        style={{ background: palette.common }}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-start gap-3">
          <span
            className="flex size-10 items-center justify-center rounded-xl text-white shadow-md"
            style={{ background: palette.common }}
          >
            <Layers className="size-5" />
          </span>
          <div>
            <p
              className="text-[11px] font-medium uppercase tracking-wider"
              style={{ color: palette.common }}
            >
              Reusable agent layer
            </p>
            <h2 className="text-xl font-semibold leading-tight">
              Common reusable agents across all stages
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              These agents are governed centrally and plug into every onboarding stage —
              providing guidance, controls and quality across the case lifecycle.
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onAdd}
          className="gap-2 self-start bg-card sm:self-auto"
          style={{ borderColor: hexToRgba(palette.common, 0.5), color: palette.common }}
        >
          <Plus className="size-4" />
          Add common agent
        </Button>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {agents.map((a, i) => (
          <div
            key={a.id}
            className="animate-draw-in"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <AgentCard agent={a} palette={palette} onClick={() => onEdit(a)} variant="common" />
          </div>
        ))}
        {agents.length === 0 && (
          <button
            onClick={onAdd}
            className="col-span-full flex items-center justify-center gap-2 rounded-xl border border-dashed bg-card/40 px-4 py-6 text-sm text-muted-foreground transition hover:border-primary/40 hover:bg-card hover:text-foreground"
          >
            <Plus className="size-4" />
            Add a common reusable agent
          </button>
        )}
      </div>

      {/* Reusable across stages indicator */}
      <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
        <span className="font-medium" style={{ color: palette.common }}>
          Reusable across:
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          {initialStages.map((s) => (
            <span
              key={s.id}
              className="inline-flex items-center gap-1 rounded-full border bg-card px-2 py-0.5 text-[10px] font-medium"
              style={{ borderColor: hexToRgba(palette.common, 0.35) }}
            >
              <span
                className="size-1.5 rounded-full"
                style={{ background: palette.common }}
              />
              {s.number}. {s.name}
            </span>
          ))}
          <ChevronRight className="size-3" style={{ color: palette.common }} />
        </div>
      </div>
    </section>
  )
}

/* ---------- Maturity model ---------- */

function MaturityModel({ palette }: { palette: ThemePalette }) {
  const levels = Object.keys(maturityDescriptions) as Array<keyof typeof maturityDescriptions>
  return (
    <section className="mt-10 grid gap-5 lg:grid-cols-[1fr_auto]">
      <div className="rounded-2xl border bg-card p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <span
            className="flex size-10 items-center justify-center rounded-xl text-white shadow-md"
            style={{
              background: `linear-gradient(135deg, ${palette.primary}, ${palette.accent})`,
            }}
          >
            <TrendingUp className="size-5" />
          </span>
          <div>
            <p
              className="text-[11px] font-medium uppercase tracking-wider"
              style={{ color: palette.primary }}
            >
              Agent maturity model
            </p>
            <h2 className="text-xl font-semibold leading-tight">
              From assist to autonomous, with governance at every step
            </h2>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {levels.map((lvl, i) => {
            const [head, tail] = maturityDescriptions[lvl].split("—").map((s) => s.trim())
            const intensity = (i + 1) / levels.length
            return (
              <div
                key={lvl}
                className="animate-draw-in relative overflow-hidden rounded-xl border bg-card p-3"
                style={{
                  animationDelay: `${i * 80}ms`,
                  borderColor: hexToRgba(palette.primary, 0.2 + intensity * 0.2),
                }}
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-1"
                  style={{
                    background: `linear-gradient(90deg, ${palette.primary}, ${palette.accent})`,
                    opacity: 0.5 + intensity * 0.5,
                  }}
                />
                <div className="flex items-center gap-2">
                  <span
                    className="font-mono text-xs font-bold"
                    style={{ color: palette.primary }}
                  >
                    {lvl}
                  </span>
                  <span className="text-[13px] font-semibold">{head}</span>
                </div>
                <p className="mt-1.5 text-[11px] leading-snug text-muted-foreground">
                  {tail}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      <div
        className="flex flex-col justify-between rounded-2xl border-2 p-5 lg:w-[260px]"
        style={{
          borderColor: hexToRgba(palette.primary, 0.25),
          background: `linear-gradient(160deg, ${hexToRgba(palette.primary, 0.08)}, transparent)`,
        }}
      >
        <div>
          <span
            className="flex size-10 items-center justify-center rounded-xl text-white shadow-md"
            style={{ background: palette.primary }}
          >
            <ScanSearch className="size-5" />
          </span>
          <h3 className="mt-3 text-base font-semibold leading-tight">
            Governed agentic capability
          </h3>
          <p className="mt-1.5 text-[13px] leading-snug text-muted-foreground">
            Every agent is auditable, has a defined risk owner and operates within approved
            boundaries — moving up the maturity curve as evidence builds.
          </p>
        </div>
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-card/60 p-2 text-[11px]">
          <ShieldCheck className="size-4" style={{ color: palette.common }} />
          <span className="font-medium">Risk-aware · Auditable · Reusable</span>
        </div>
      </div>
    </section>
  )
}
