"use client"

import { useMemo, useState } from "react"
import {
  ArrowRight,
  Bot,
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Cpu,
  FileText,
  Fingerprint,
  Layers,
  Lightbulb,
  Plus,
  Radar,
  ScanSearch,
  Settings2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  User,
  UserCheck,
  Users,
  Wallet,
  Wrench,
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
  Process,
  Stage,
  ThemePalette,
} from "@/lib/journey-data"
import { AgentDialog } from "@/components/agent-dialog"
import { ThemeCustomizer } from "@/components/theme-customizer"
import {
  AgentDetailSheet,
  ProcessDetailSheet,
} from "@/components/detail-sheet"

const stageIcons: Record<string, React.ComponentType<{ className?: string }>> =
  {
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

/* ========================================================================== */
/*  Main                                                                       */
/* ========================================================================== */

export function OnboardingJourney() {
  const [stages] = useState<Stage[]>(initialStages)
  const [agents, setAgents] = useState<Agent[]>(initialAgents)
  const [palette, setPalette] = useState<ThemePalette>(defaultPalette)
  const [activeStageIdx, setActiveStageIdx] = useState(0)

  // Agent add/edit dialog
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add")
  const [dialogInitial, setDialogInitial] = useState<
    Partial<Agent> | undefined
  >()

  // Detail sheets
  const [activeAgent, setActiveAgent] = useState<Agent | null>(null)
  const [agentSheetOpen, setAgentSheetOpen] = useState(false)
  const [activeProcess, setActiveProcess] = useState<Process | null>(null)
  const [activeProcessStage, setActiveProcessStage] = useState<
    string | undefined
  >()
  const [processSheetOpen, setProcessSheetOpen] = useState(false)

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

  const activeStage = stages[activeStageIdx]
  const activeStageAgents = stageAgents.get(activeStage.id) ?? []

  /* ---------- handlers ---------- */

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
        return prev.map((a) =>
          a.id === next.id ? ({ ...a, ...next } as Agent) : a,
        )
      }
      const id = `agent-${Date.now().toString(36)}`
      return [...prev, { ...(next as Agent), id }]
    })
  }
  const deleteAgent = (id: string) => {
    setAgents((prev) => prev.filter((a) => a.id !== id))
  }

  const openAgentSheet = (a: Agent) => {
    setActiveAgent(a)
    requestAnimationFrame(() => setAgentSheetOpen(true))
  }
  const openProcessSheet = (p: Process, stageName?: string) => {
    setActiveProcess(p)
    setActiveProcessStage(stageName)
    requestAnimationFrame(() => setProcessSheetOpen(true))
  }
  const buildAgentFromProcess = (p: Process) => {
    const stageId = stages.find((s) =>
      s.processes.some((pp) => pp.id === p.id),
    )?.id
    setProcessSheetOpen(false)
    setTimeout(
      () =>
        openAdd({
          scope: "stage",
          stageId,
          name: `${p.name} Agent`,
          function: p.agentBlueprint?.summary,
          maturity: p.agentBlueprint?.targetMaturity,
        }),
      200,
    )
  }

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
        <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-8 lg:py-12">
          {/* Header */}
          <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-3">
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex size-8 items-center justify-center rounded-md text-white shadow-sm animate-glow-pulse"
                  style={
                    {
                      background: `linear-gradient(135deg, ${palette.primary}, ${palette.accent})`,
                      ["--glow-color" as string]: hexToRgba(
                        palette.primary,
                        0.5,
                      ),
                    } as React.CSSProperties
                  }
                >
                  <Sparkles className="size-4" />
                </span>
                <Badge
                  variant="outline"
                  className="border-current text-xs font-medium"
                  style={{
                    color: palette.primary,
                    borderColor: hexToRgba(palette.primary, 0.3),
                  }}
                >
                  Agentic Operating Model
                </Badge>
              </div>
              <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.6rem]">
                <span className="shimmer-text">
                  Commercial Onboarding Journey
                </span>{" "}
                <span className="text-foreground">with Embedded AI Agents</span>
              </h1>
              <p className="text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                Click any stage on the journey path to focus it. Tap any agent
                or process card to see how it works. Where humans are still
                in-the-loop, build a purpose-built agent in one click.
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

          {/* Journey stepper / path */}
          <JourneyPath
            stages={stages}
            activeIdx={activeStageIdx}
            onSelect={setActiveStageIdx}
            palette={palette}
            stageAgents={stageAgents}
          />

          {/* Active stage panel */}
          <ActiveStagePanel
            stage={activeStage}
            stageIdx={activeStageIdx}
            total={stages.length}
            agents={activeStageAgents}
            palette={palette}
            onPrev={() =>
              setActiveStageIdx((i) => Math.max(0, i - 1))
            }
            onNext={() =>
              setActiveStageIdx((i) => Math.min(stages.length - 1, i + 1))
            }
            onAddAgent={() =>
              openAdd({ scope: "stage", stageId: activeStage.id })
            }
            onAgentClick={openAgentSheet}
            onProcessClick={(p) => openProcessSheet(p, activeStage.name)}
            onBuildAgent={buildAgentFromProcess}
          />

          {/* Common Reusable Agent Layer */}
          <CommonAgentLayer
            agents={commonAgents}
            palette={palette}
            onAdd={() => openAdd({ scope: "common" })}
            onAgentClick={openAgentSheet}
          />

          {/* Maturity model */}
          <MaturityModel palette={palette} />

          {/* Legend */}
          <Legend palette={palette} />

          <footer className="mt-10 flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>
              {agents.length} agents · {stages.length} stages · Theme:{" "}
              <span className="font-medium text-foreground">
                {palette.name}
              </span>
            </span>
            <span>
              Journey: Customer applies → 7 stages → Onboarded customer
            </span>
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

        <AgentDetailSheet
          agent={activeAgent}
          open={agentSheetOpen}
          onOpenChange={setAgentSheetOpen}
          palette={palette}
          onEdit={(a) => {
            setAgentSheetOpen(false)
            setTimeout(() => openEdit(a), 200)
          }}
        />

        <ProcessDetailSheet
          process={activeProcess}
          stageName={activeProcessStage}
          open={processSheetOpen}
          onOpenChange={setProcessSheetOpen}
          palette={palette}
          onBuildAgent={buildAgentFromProcess}
        />
      </div>
    </TooltipProvider>
  )
}

/* ========================================================================== */
/*  Journey Path (horizontal stepper)                                          */
/* ========================================================================== */

function JourneyPath({
  stages,
  activeIdx,
  onSelect,
  palette,
  stageAgents,
}: {
  stages: Stage[]
  activeIdx: number
  onSelect: (i: number) => void
  palette: ThemePalette
  stageAgents: Map<string, Agent[]>
}) {
  return (
    <section
      className="mt-8 overflow-hidden rounded-2xl border bg-card/60 shadow-xs backdrop-blur-sm"
      style={{ borderColor: hexToRgba(palette.primary, 0.2) }}
    >
      {/* Path header */}
      <div className="flex flex-col gap-3 border-b px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex items-center gap-2">
          <Sparkles
            className="size-4"
            style={{ color: palette.primary }}
          />
          <p className="text-sm font-semibold">
            The Customer Onboarding Journey
          </p>
          <Badge
            variant="outline"
            className="text-[10px] font-medium"
            style={{
              borderColor: hexToRgba(palette.primary, 0.3),
              color: palette.primary,
            }}
          >
            {stages.length} stages
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Customer applies → relationship activated.{" "}
          <span className="font-medium text-foreground">
            Click a node to focus that stage.
          </span>
        </p>
      </div>

      {/* Horizontal scroll path */}
      <div className="overflow-x-auto">
        <div className="relative min-w-[920px] px-6 pb-6 pt-8">
          {/* Backbone line */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-[60px] right-[60px] top-[58px] h-[3px] rounded-full"
            style={{
              background: `linear-gradient(90deg, ${hexToRgba(
                palette.primary,
                0.15,
              )}, ${hexToRgba(palette.primary, 0.6)}, ${hexToRgba(
                palette.accent,
                0.6,
              )}, ${hexToRgba(palette.primary, 0.15)})`,
            }}
          />
          {/* Animated dashed overlay */}
          <div
            aria-hidden
            className="animate-flow-dash pointer-events-none absolute left-[60px] right-[60px] top-[58px] h-[3px] rounded-full"
            style={{
              background: `repeating-linear-gradient(90deg, ${hexToRgba(
                palette.accent,
                0.85,
              )} 0 8px, transparent 8px 18px)`,
              backgroundSize: "200% 100%",
            }}
          />
          {/* Traveling customer dot */}
          <span
            aria-hidden
            className="animate-connector-particle pointer-events-none absolute left-[60px] top-[58px] -translate-y-1/2"
            style={{
              width: `calc(100% - 120px)`,
              animationDuration: "8s",
            }}
          >
            <span
              className="block size-3 -translate-y-1/2 rounded-full shadow-md"
              style={{
                background: palette.accent,
                boxShadow: `0 0 12px ${palette.accent}, 0 0 4px ${palette.primary}`,
              }}
            />
          </span>

          {/* Nodes row */}
          <ol className="relative grid grid-flow-col auto-cols-fr gap-0">
            {/* Start node */}
            <PathNode
              kind="endpoint"
              label="Customer applies"
              icon={<UserCheck className="size-4" />}
              palette={palette}
              position="start"
            />

            {stages.map((s, i) => {
              const Icon = stageIcons[s.id] ?? Cpu
              const isActive = i === activeIdx
              const isPast = i < activeIdx
              const agentCount = stageAgents.get(s.id)?.length ?? 0
              return (
                <PathNode
                  key={s.id}
                  kind="stage"
                  number={s.number}
                  label={s.name}
                  icon={<Icon className="size-4" />}
                  palette={palette}
                  active={isActive}
                  past={isPast}
                  agentCount={agentCount}
                  onClick={() => onSelect(i)}
                />
              )
            })}

            {/* End node */}
            <PathNode
              kind="endpoint"
              label="Onboarded customer"
              icon={<CheckCircle2 className="size-4" />}
              palette={palette}
              position="end"
            />
          </ol>
        </div>
      </div>
    </section>
  )
}

function PathNode({
  kind,
  number,
  label,
  icon,
  palette,
  active,
  past,
  agentCount,
  position,
  onClick,
}: {
  kind: "stage" | "endpoint"
  number?: number
  label: string
  icon: React.ReactNode
  palette: ThemePalette
  active?: boolean
  past?: boolean
  agentCount?: number
  position?: "start" | "end"
  onClick?: () => void
}) {
  const isEndpoint = kind === "endpoint"
  const baseColor = isEndpoint ? palette.primary : palette.primary

  return (
    <li className="relative flex flex-col items-center">
      {/* Node */}
      {isEndpoint ? (
        <span
          className="relative z-10 flex size-12 items-center justify-center rounded-full text-white shadow-md ring-4 ring-card"
          style={{
            background: `linear-gradient(135deg, ${palette.primary}, ${palette.accent})`,
          }}
        >
          {icon}
        </span>
      ) : (
        <button
          type="button"
          onClick={onClick}
          aria-pressed={active}
          aria-label={`Stage ${number}: ${label}`}
          className="group relative z-10 flex size-12 items-center justify-center rounded-full font-semibold text-white shadow-md transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{
            background: active
              ? `linear-gradient(135deg, ${palette.primary}, ${palette.accent})`
              : past
                ? hexToRgba(palette.primary, 0.85)
                : hexToRgba(palette.primary, 0.55),
            boxShadow: active
              ? `0 0 0 4px ${hexToRgba(palette.accent, 0.35)}, 0 0 16px ${hexToRgba(palette.primary, 0.4)}`
              : `0 0 0 4px ${hexToRgba(palette.primary, 0.08)}`,
          }}
        >
          {/* pulse ring on active */}
          {active && (
            <span
              aria-hidden
              className="animate-pulse-ring absolute inset-0 rounded-full"
              style={{ background: hexToRgba(palette.primary, 0.45) }}
            />
          )}
          <span className="relative flex flex-col items-center leading-none">
            <span className="text-[10px] font-medium opacity-90">
              Stage
            </span>
            <span className="text-base font-bold">{number}</span>
          </span>

          {/* agent count badge */}
          {agentCount !== undefined && agentCount > 0 && (
            <span
              className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full border-2 border-card text-[10px] font-bold text-white shadow-sm animate-badge-pulse"
              style={{ background: palette.stage }}
              aria-label={`${agentCount} agents`}
            >
              {agentCount}
            </span>
          )}
        </button>
      )}

      {/* Label */}
      <div className="mt-3 max-w-[120px] text-center">
        <p
          className={`text-[10px] font-semibold uppercase tracking-wider ${
            active || isEndpoint
              ? ""
              : "text-muted-foreground"
          }`}
          style={
            active
              ? { color: palette.primary }
              : isEndpoint
                ? { color: palette.primary }
                : undefined
          }
        >
          {isEndpoint ? (position === "start" ? "Start" : "End") : `Stage ${number}`}
        </p>
        <p
          className={`mt-0.5 text-pretty text-[11px] leading-tight ${
            active ? "font-semibold text-foreground" : "text-foreground/70"
          }`}
        >
          {label}
        </p>
        <div className="mt-1 flex items-center justify-center gap-0.5 text-[10px]">
          <span className="inline-flex items-center gap-0.5 text-muted-foreground">
            <Bot
              className="size-2.5"
              style={{ color: palette.stage }}
            />
            {isEndpoint ? "—" : agentCount ?? 0}
          </span>
        </div>
      </div>
    </li>
  )
}

/* ========================================================================== */
/*  Active stage panel                                                         */
/* ========================================================================== */

function ActiveStagePanel({
  stage,
  stageIdx,
  total,
  agents,
  palette,
  onPrev,
  onNext,
  onAddAgent,
  onAgentClick,
  onProcessClick,
  onBuildAgent,
}: {
  stage: Stage
  stageIdx: number
  total: number
  agents: Agent[]
  palette: ThemePalette
  onPrev: () => void
  onNext: () => void
  onAddAgent: () => void
  onAgentClick: (a: Agent) => void
  onProcessClick: (p: Process) => void
  onBuildAgent: (p: Process) => void
}) {
  const Icon = stageIcons[stage.id] ?? Cpu
  const humanCount = stage.processes.filter((p) => p.type === "human").length
  const agenticCount = stage.processes.filter((p) => p.type === "agentic").length
  const humanWithBlueprint = stage.processes.filter(
    (p) => p.type === "human" && !!p.agentBlueprint,
  ).length

  const isFirst = stageIdx === 0
  const isLast = stageIdx === total - 1

  return (
    <section
      className="relative mt-6 overflow-hidden rounded-2xl border-2 bg-card shadow-md transition-colors"
      style={{ borderColor: hexToRgba(palette.primary, 0.25) }}
    >
      {/* top accent bar */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-1.5"
        style={{
          background: `linear-gradient(90deg, ${palette.primary}, ${palette.accent})`,
        }}
      />

      {/* Header */}
      <div
        className="relative px-5 py-5 sm:px-7"
        style={{
          background: `linear-gradient(160deg, ${hexToRgba(palette.primary, 0.08)}, transparent 70%)`,
        }}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <span
                className="animate-pulse-ring absolute inset-0 rounded-2xl"
                style={{ background: hexToRgba(palette.primary, 0.35) }}
                aria-hidden
              />
              <span
                className="relative flex size-14 items-center justify-center rounded-2xl text-white shadow-lg ring-4 ring-card"
                style={{
                  background: `linear-gradient(135deg, ${palette.primary}, ${palette.accent})`,
                }}
              >
                <span className="font-bold">{stage.number}</span>
              </span>
            </div>
            <div className="min-w-0">
              <p
                className="text-[10px] font-semibold uppercase tracking-wider"
                style={{ color: palette.primary }}
              >
                Stage {stage.number} of {total}
              </p>
              <h2 className="text-xl font-semibold leading-tight sm:text-2xl">
                <span className="inline-flex items-center gap-2">
                  <Icon
                    className="size-5"
                    style={{ color: palette.primary }}
                  />
                  {stage.name}
                </span>
              </h2>
              {stage.description && (
                <p className="mt-1 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground">
                  {stage.description}
                </p>
              )}
            </div>
          </div>

          {/* Stage navigation */}
          <div className="relative z-10 flex shrink-0 flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onPrev}
              disabled={isFirst}
              className="gap-1.5"
              type="button"
            >
              <ChevronLeft className="size-4" />
              Prev
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={onNext}
              disabled={isLast}
              className="gap-1.5 text-white shadow-sm"
              style={{ background: palette.primary }}
            >
              Next stage
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>

        {/* Stat chips */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          <Badge
            variant="outline"
            className="gap-1 text-[10px] font-medium"
            style={{
              color: palette.stage,
              borderColor: hexToRgba(palette.stage, 0.4),
              background: hexToRgba(palette.stage, 0.06),
            }}
          >
            <Bot className="size-3" />
            {agents.length} stage agents
          </Badge>
          {agenticCount > 0 && (
            <Badge
              variant="outline"
              className="gap-1 text-[10px] font-medium"
              style={{
                color: palette.agentic,
                borderColor: hexToRgba(palette.agentic, 0.4),
                background: hexToRgba(palette.agentic, 0.06),
              }}
            >
              <Cpu className="size-3" />
              {agenticCount} agentic
            </Badge>
          )}
          {humanCount > 0 && (
            <Badge
              variant="outline"
              className="gap-1 text-[10px] font-medium"
              style={{
                color: palette.human,
                borderColor: hexToRgba(palette.human, 0.4),
                background: hexToRgba(palette.human, 0.06),
              }}
            >
              <User className="size-3" />
              {humanCount} human
            </Badge>
          )}
          {humanWithBlueprint > 0 && (
            <Badge
              variant="outline"
              className="gap-1 text-[10px] font-medium animate-badge-pulse"
              style={{
                color: palette.accent,
                borderColor: hexToRgba(palette.accent, 0.4),
                background: hexToRgba(palette.accent, 0.06),
              }}
            >
              <Lightbulb className="size-3" />
              {humanWithBlueprint} build opportunit
              {humanWithBlueprint === 1 ? "y" : "ies"}
            </Badge>
          )}
        </div>
      </div>

      {/* Two-column body: Agents + Processes — keyed so content re-animates on stage change */}
      <div
        key={stage.id}
        className="animate-draw-in grid gap-0 border-t lg:grid-cols-[1fr_1fr]"
      >
        {/* Agents */}
        <div className="space-y-3 border-b p-5 sm:p-6 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="flex size-7 items-center justify-center rounded-lg text-white shadow-sm"
                style={{ background: palette.stage }}
              >
                <Bot className="size-4" />
              </span>
              <div>
                <p
                  className="text-[10px] font-semibold uppercase tracking-wider"
                  style={{ color: palette.stage }}
                >
                  Stage agents
                </p>
                <p className="text-sm font-semibold">
                  Agents leading this stage
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={onAddAgent}
              className="gap-1.5"
              style={{
                borderColor: hexToRgba(palette.stage, 0.4),
                color: palette.stage,
              }}
            >
              <Plus className="size-3.5" />
              Add agent
            </Button>
          </div>

          {agents.length === 0 ? (
            <button
              onClick={onAddAgent}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed bg-muted/30 px-4 py-8 text-sm text-muted-foreground transition hover:border-primary/40 hover:bg-muted/60 hover:text-foreground"
            >
              <Plus className="size-4" />
              No agents yet — add the first one
            </button>
          ) : (
            <div className="grid gap-2.5 sm:grid-cols-2">
              {agents.map((a, i) => (
                <AgentCard
                  key={a.id}
                  agent={a}
                  palette={palette}
                  onClick={() => onAgentClick(a)}
                  animationDelay={i * 60}
                />
              ))}
            </div>
          )}
        </div>

        {/* Processes */}
        <div className="space-y-3 p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <span
              className="flex size-7 items-center justify-center rounded-lg text-white shadow-sm"
              style={{ background: palette.primary }}
            >
              <Cpu className="size-4" />
            </span>
            <div>
              <p
                className="text-[10px] font-semibold uppercase tracking-wider"
                style={{ color: palette.primary }}
              >
                Process steps
              </p>
              <p className="text-sm font-semibold">
                What happens at this stage
              </p>
            </div>
          </div>

          <ol className="space-y-2">
            {stage.processes.map((p, i) => (
              <ProcessRow
                key={p.id}
                index={i + 1}
                process={p}
                palette={palette}
                onClick={() => onProcessClick(p)}
                onBuildAgent={() => onBuildAgent(p)}
                animationDelay={i * 60}
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

/* ========================================================================== */
/*  Process row                                                                */
/* ========================================================================== */

function ProcessRow({
  index,
  process,
  palette,
  onClick,
  onBuildAgent,
  animationDelay = 0,
}: {
  index: number
  process: Process
  palette: ThemePalette
  onClick: () => void
  onBuildAgent: () => void
  animationDelay?: number
}) {
  const isAgentic = process.type === "agentic"
  const color = isAgentic ? palette.agentic : palette.human
  const hasBlueprint = process.type === "human" && !!process.agentBlueprint

  return (
    <li
      className="animate-draw-in relative overflow-hidden rounded-xl border bg-card shadow-xs transition hover:-translate-y-px hover:shadow-md"
      style={{
        animationDelay: `${animationDelay}ms`,
        borderColor: hexToRgba(color, 0.35),
        background: `linear-gradient(180deg, ${hexToRgba(color, 0.05)}, transparent)`,
      }}
    >
      {/* Animated scan line for agentic */}
      {isAgentic && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[2px] animate-scan-line"
          style={{
            background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          }}
        />
      )}

      {/* Click row */}
      <button
        type="button"
        onClick={onClick}
        className="group flex w-full items-start gap-3 px-3 py-3 text-left focus:outline-none focus-visible:ring-2"
      >
        <span
          className="flex size-6 shrink-0 items-center justify-center rounded-full font-mono text-[10px] font-semibold text-white shadow-sm"
          style={{ background: color }}
        >
          {index}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-sm font-medium leading-tight">
              {process.name}
            </span>
            <Badge
              variant="outline"
              className="gap-1 text-[9px] font-semibold uppercase tracking-wider"
              style={{
                color,
                borderColor: hexToRgba(color, 0.4),
                background: hexToRgba(color, 0.08),
              }}
            >
              {isAgentic ? (
                <Cpu className="size-2.5" />
              ) : (
                <User className="size-2.5" />
              )}
              {isAgentic ? "Agentic" : "Human"}
            </Badge>
          </div>
          {process.description && (
            <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-muted-foreground">
              {process.description}
            </p>
          )}
        </div>
        <ChevronRight
          className="mt-1 size-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5"
          style={{ color: hexToRgba(color, 0.7) }}
        />
      </button>

      {/* Build-agent affordance for human steps */}
      {hasBlueprint && (
        <div
          className="flex items-center gap-2 border-t px-3 py-2"
          style={{
            borderColor: hexToRgba(palette.accent, 0.25),
            background: hexToRgba(palette.accent, 0.05),
          }}
        >
          <span
            className="inline-flex size-5 shrink-0 items-center justify-center rounded-full text-white animate-glow-pulse"
            style={
              {
                background: palette.accent,
                ["--glow-color" as string]: hexToRgba(palette.accent, 0.5),
              } as React.CSSProperties
            }
            aria-hidden
          >
            <Lightbulb className="size-3" />
          </span>
          <button
            type="button"
            onClick={onClick}
            className="flex-1 truncate text-left text-[12px] leading-tight underline-offset-2 hover:underline"
            style={{ color: palette.accent }}
            title="View agent build blueprint"
          >
            <span className="font-semibold">Agent build opportunity:</span>{" "}
            {process.agentBlueprint?.summary}
          </button>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onBuildAgent()
                }}
                className="h-7 gap-1.5 px-2 text-[11px] font-semibold uppercase tracking-wider text-white shadow-sm"
                style={{ background: palette.accent }}
              >
                <Wrench className="size-3" />
                Build
              </Button>
            </TooltipTrigger>
            <TooltipContent>Build an agent for this human step</TooltipContent>
          </Tooltip>
        </div>
      )}
    </li>
  )
}

/* ========================================================================== */
/*  Agent card                                                                 */
/* ========================================================================== */

function AgentCard({
  agent,
  palette,
  onClick,
  variant = "stage",
  animationDelay = 0,
}: {
  agent: Agent
  palette: ThemePalette
  onClick: () => void
  variant?: "stage" | "common"
  animationDelay?: number
}) {
  const baseColor =
    agent.color ||
    (variant === "common" ? palette.common : palette.stage)
  return (
    <button
      type="button"
      onClick={onClick}
      className="group animate-draw-in agent-border-trace relative w-full overflow-hidden rounded-xl border bg-card p-3 text-left shadow-xs transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2"
      style={
        {
          animationDelay: `${animationDelay}ms`,
          borderColor: hexToRgba(baseColor, 0.35),
          ["--trace-color" as string]: baseColor,
          ["--trace-color-2" as string]:
            variant === "common" ? palette.primary : palette.accent,
        } as React.CSSProperties
      }
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
      <div className="relative flex items-start gap-2.5">
        <span
          className="relative flex size-9 shrink-0 items-center justify-center rounded-lg text-white shadow-sm"
          style={{ background: baseColor }}
        >
          <Bot className="size-4 animate-tick-rotate" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="line-clamp-2 text-[13px] font-semibold leading-tight">
              {agent.name}
            </p>
            <span
              className="shrink-0 rounded-full border px-1.5 py-0.5 font-mono text-[10px] font-semibold animate-badge-pulse"
              style={{
                color: baseColor,
                borderColor: hexToRgba(baseColor, 0.4),
                background: hexToRgba(baseColor, 0.08),
              }}
            >
              {agent.maturity}
            </span>
          </div>
          <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-muted-foreground">
            {agent.function}
          </p>
          <div
            className="mt-1.5 flex items-center justify-between gap-2 text-[10px] font-medium"
            style={{ color: baseColor }}
          >
            <span className="inline-flex items-center gap-1">
              <Sparkles className="size-2.5" />
              {agent.tasks?.length ?? 0} tasks · view details
            </span>
            <ArrowRight className="size-3 opacity-0 transition group-hover:opacity-100" />
          </div>
        </div>
      </div>
      <div className="absolute right-2 top-2 opacity-0 transition group-hover:opacity-100">
        <Settings2 className="size-3.5 text-muted-foreground" />
      </div>
    </button>
  )
}

/* ========================================================================== */
/*  Common reusable agent layer                                                */
/* ========================================================================== */

function CommonAgentLayer({
  agents,
  palette,
  onAdd,
  onAgentClick,
}: {
  agents: Agent[]
  palette: ThemePalette
  onAdd: () => void
  onAgentClick: (a: Agent) => void
}) {
  return (
    <section
      className="layer-flow-bg relative mt-10 overflow-hidden rounded-2xl border-2 p-5 shadow-sm sm:p-6"
      style={{
        borderColor: hexToRgba(palette.common, 0.4),
        backgroundImage: `linear-gradient(120deg, ${hexToRgba(
          palette.common,
          0.14,
        )} 0%, ${hexToRgba(palette.common, 0.04)} 50%, ${hexToRgba(
          palette.common,
          0.12,
        )} 100%)`,
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-0 size-72 rounded-full opacity-20 blur-3xl"
        style={{ background: palette.common }}
      />

      {/* Animated data-flow particles */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {[10, 30, 55, 75, 90].map((leftPct, i) => (
          <span
            key={i}
            className="absolute -top-1 size-1 rounded-full animate-data-flow"
            style={{
              left: `${leftPct}%`,
              background: palette.common,
              boxShadow: `0 0 4px ${palette.common}`,
              animationDelay: `${i * 0.35}s`,
            }}
          />
        ))}
      </div>

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-start gap-3">
          <span
            className="flex size-10 items-center justify-center rounded-xl text-white shadow-md animate-glow-pulse"
            style={
              {
                background: palette.common,
                ["--glow-color" as string]: hexToRgba(palette.common, 0.5),
              } as React.CSSProperties
            }
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
              These agents are governed centrally and plug into every onboarding
              stage — providing guidance, controls and quality across the case
              lifecycle.
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onAdd}
          className="gap-2 self-start bg-card sm:self-auto"
          style={{
            borderColor: hexToRgba(palette.common, 0.5),
            color: palette.common,
          }}
        >
          <Plus className="size-4" />
          Add common agent
        </Button>
      </div>

      <div className="relative mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {agents.map((a, i) => (
          <AgentCard
            key={a.id}
            agent={a}
            palette={palette}
            onClick={() => onAgentClick(a)}
            variant="common"
            animationDelay={i * 60}
          />
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
      <div className="relative mt-5 flex items-center gap-2 text-xs text-muted-foreground">
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

/* ========================================================================== */
/*  Maturity model                                                             */
/* ========================================================================== */

function MaturityModel({ palette }: { palette: ThemePalette }) {
  const levels = Object.keys(maturityDescriptions) as Array<
    keyof typeof maturityDescriptions
  >
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
            const [head, tail] = maturityDescriptions[lvl]
              .split("—")
              .map((s) => s.trim())
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
            Every agent is auditable, has a defined risk owner and operates
            within approved boundaries — moving up the maturity curve as
            evidence builds.
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

/* ========================================================================== */
/*  Legend                                                                     */
/* ========================================================================== */

function Legend({ palette }: { palette: ThemePalette }) {
  const items = [
    { color: palette.stage, label: "Stage-specific agent" },
    { color: palette.common, label: "Common reusable agent" },
    { color: palette.agentic, label: "Agentic-enhanced process" },
    { color: palette.human, label: "Human / control process" },
    { color: palette.accent, label: "Agent build opportunity", glow: true },
    { color: palette.primary, label: "Onboarding journey path", arrow: true },
  ]
  return (
    <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl border bg-card/60 p-3 backdrop-blur">
      {items.map((it) => (
        <div
          key={it.label}
          className="flex items-center gap-2 text-xs text-foreground/80"
        >
          {it.arrow ? (
            <span
              className="inline-block h-[3px] w-7 rounded-full"
              style={{ background: it.color }}
            />
          ) : it.glow ? (
            <span
              className="inline-flex size-3 items-center justify-center rounded-full"
              style={{
                background: it.color,
                boxShadow: `0 0 0 3px ${hexToRgba(it.color, 0.25)}`,
              }}
            >
              <Lightbulb className="size-2 text-white" />
            </span>
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
