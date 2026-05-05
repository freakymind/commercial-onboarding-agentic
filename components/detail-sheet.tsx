"use client"

import { useEffect, useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Cpu,
  FileInput,
  FileOutput,
  Lightbulb,
  ShieldAlert,
  Sparkles,
  User,
  Workflow,
  Wrench,
} from "lucide-react"
import type { Agent, Process, ThemePalette } from "@/lib/journey-data"
import { maturityDescriptions } from "@/lib/journey-data"

function hexToRgba(hex: string, alpha: number) {
  const m = hex.replace("#", "")
  const full = m.length === 3 ? m.split("").map((c) => c + c).join("") : m
  const r = parseInt(full.slice(0, 2), 16)
  const g = parseInt(full.slice(2, 4), 16)
  const b = parseInt(full.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/* -------------------------------------------------------------------------- */
/*  Hook: keep last value for graceful close animation                         */
/* -------------------------------------------------------------------------- */

function useDeferredClose<T>(value: T | null, open: boolean): T | null {
  const [held, setHeld] = useState<T | null>(value)
  useEffect(() => {
    if (open && value) {
      setHeld(value)
      return
    }
    if (!open) {
      const t = setTimeout(() => setHeld(null), 250)
      return () => clearTimeout(t)
    }
  }, [open, value])
  return open ? value : held
}

/* -------------------------------------------------------------------------- */
/*  Agent Detail Sheet                                                         */
/* -------------------------------------------------------------------------- */

export function AgentDetailSheet({
  agent,
  open,
  onOpenChange,
  palette,
  onEdit,
}: {
  agent: Agent | null
  open: boolean
  onOpenChange: (v: boolean) => void
  palette: ThemePalette
  onEdit?: (a: Agent) => void
}) {
  const display = useDeferredClose(agent, open)
  const baseColor = display
    ? display.color || (display.scope === "common" ? palette.common : palette.stage)
    : palette.primary

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto p-0 sm:max-w-[540px]"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>{display ? display.name : "Agent details"}</SheetTitle>
          <SheetDescription>
            {display ? display.function : "Agent details"}
          </SheetDescription>
        </SheetHeader>

        {display && (
          <div className="flex h-full flex-col">
            <div
              className="border-b p-4"
              style={{
                background: `linear-gradient(135deg, ${hexToRgba(
                  baseColor,
                  0.12,
                )}, transparent)`,
              }}
            >
              <div className="flex items-start gap-3">
                <span
                  className="flex size-12 shrink-0 items-center justify-center rounded-xl text-white shadow-md animate-glow-pulse"
                  style={
                    {
                      background: baseColor,
                      ["--glow-color" as string]: hexToRgba(baseColor, 0.5),
                    } as React.CSSProperties
                  }
                >
                  <Bot className="size-6" />
                </span>
                <div className="min-w-0 flex-1 pr-8">
                  <Badge
                    variant="outline"
                    className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider"
                    style={{
                      color: baseColor,
                      borderColor: hexToRgba(baseColor, 0.4),
                      background: hexToRgba(baseColor, 0.08),
                    }}
                  >
                    {display.scope === "common" ? "Reusable agent" : "Stage agent"} ·{" "}
                    {display.maturity}
                  </Badge>
                  <h2 className="text-balance text-xl font-semibold leading-tight">
                    {display.name}
                  </h2>
                  <p className="mt-1 text-pretty text-sm leading-relaxed text-muted-foreground">
                    {display.function}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto px-4 py-5">
              <SectionCard
                icon={<Sparkles className="size-4" />}
                color={baseColor}
                label="Maturity"
                title={display.maturity}
                subtitle={maturityDescriptions[display.maturity]}
              />

              {display.tasks && display.tasks.length > 0 && (
                <Section
                  icon={<Workflow className="size-4" />}
                  color={baseColor}
                  title="What this agent does"
                >
                  <ol className="space-y-2">
                    {display.tasks.map((t, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 rounded-lg border bg-card p-2.5 text-sm"
                        style={{ borderColor: hexToRgba(baseColor, 0.18) }}
                      >
                        <span
                          className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full font-mono text-[10px] font-semibold text-white"
                          style={{ background: baseColor }}
                        >
                          {i + 1}
                        </span>
                        <span className="leading-snug">{t}</span>
                      </li>
                    ))}
                  </ol>
                </Section>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                {display.inputs && display.inputs.length > 0 && (
                  <Section
                    icon={<FileInput className="size-4" />}
                    color={baseColor}
                    title="Inputs"
                    compact
                  >
                    <ul className="space-y-1.5 text-sm">
                      {display.inputs.map((i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span
                            className="mt-1.5 size-1.5 shrink-0 rounded-full"
                            style={{ background: baseColor }}
                          />
                          <span className="leading-snug">{i}</span>
                        </li>
                      ))}
                    </ul>
                  </Section>
                )}
                {display.outputs && display.outputs.length > 0 && (
                  <Section
                    icon={<FileOutput className="size-4" />}
                    color={baseColor}
                    title="Outputs"
                    compact
                  >
                    <ul className="space-y-1.5 text-sm">
                      {display.outputs.map((o) => (
                        <li key={o} className="flex items-start gap-2">
                          <span
                            className="mt-1.5 size-1.5 shrink-0 rounded-full"
                            style={{ background: baseColor }}
                          />
                          <span className="leading-snug">{o}</span>
                        </li>
                      ))}
                    </ul>
                  </Section>
                )}
              </div>
            </div>

            {onEdit && (
              <SheetFooter className="border-t px-4 py-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => onEdit(display)}
                >
                  Edit agent details
                </Button>
              </SheetFooter>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

/* -------------------------------------------------------------------------- */
/*  Process Detail Sheet                                                       */
/* -------------------------------------------------------------------------- */

export function ProcessDetailSheet({
  process,
  stageName,
  open,
  onOpenChange,
  palette,
  onBuildAgent,
}: {
  process: Process | null
  stageName?: string
  open: boolean
  onOpenChange: (v: boolean) => void
  palette: ThemePalette
  onBuildAgent?: (p: Process) => void
}) {
  const display = useDeferredClose(process, open)
  const isHuman = display?.type === "human"
  const color = display
    ? isHuman
      ? palette.human
      : palette.agentic
    : palette.primary

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto p-0 sm:max-w-[560px]"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>{display ? display.name : "Process details"}</SheetTitle>
          <SheetDescription>
            {display ? display.description ?? display.name : "Process details"}
          </SheetDescription>
        </SheetHeader>

        {display && (
          <div className="flex h-full flex-col">
            <div
              className="border-b p-4"
              style={{
                background: `linear-gradient(135deg, ${hexToRgba(
                  color,
                  0.12,
                )}, transparent)`,
              }}
            >
              <div className="flex items-start gap-3">
                <span
                  className="flex size-12 shrink-0 items-center justify-center rounded-xl text-white shadow-md"
                  style={{ background: color }}
                >
                  {isHuman ? (
                    <User className="size-5" />
                  ) : (
                    <Cpu className="size-5" />
                  )}
                </span>
                <div className="min-w-0 flex-1 pr-8">
                  <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                    <Badge
                      variant="outline"
                      className="text-[10px] font-semibold uppercase tracking-wider"
                      style={{
                        color,
                        borderColor: hexToRgba(color, 0.4),
                        background: hexToRgba(color, 0.08),
                      }}
                    >
                      {isHuman
                        ? "Human / control process"
                        : "Agentic-enhanced process"}
                    </Badge>
                    {stageName && (
                      <Badge
                        variant="outline"
                        className="text-[10px] font-medium"
                        style={{
                          borderColor: hexToRgba(palette.primary, 0.3),
                        }}
                      >
                        {stageName}
                      </Badge>
                    )}
                  </div>
                  <h2 className="text-balance text-xl font-semibold leading-tight">
                    {display.name}
                  </h2>
                  {display.description && (
                    <p className="mt-1 text-pretty text-sm leading-relaxed text-muted-foreground">
                      {display.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto px-4 py-5">
              {isHuman && display.agentBlueprint ? (
                <div
                  className="relative overflow-hidden rounded-xl border-2 p-4"
                  style={{
                    borderColor: hexToRgba(palette.accent, 0.4),
                    background: `linear-gradient(160deg, ${hexToRgba(
                      palette.accent,
                      0.08,
                    )}, transparent)`,
                  }}
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full opacity-20 blur-2xl"
                    style={{ background: palette.accent }}
                  />
                  <div className="flex items-center gap-2">
                    <span
                      className="flex size-8 items-center justify-center rounded-lg text-white shadow-sm animate-glow-pulse"
                      style={
                        {
                          background: palette.accent,
                          ["--glow-color" as string]: hexToRgba(
                            palette.accent,
                            0.5,
                          ),
                        } as React.CSSProperties
                      }
                    >
                      <Lightbulb className="size-4" />
                    </span>
                    <div className="flex-1">
                      <p
                        className="text-[10px] font-semibold uppercase tracking-wider"
                        style={{ color: palette.accent }}
                      >
                        Agent build blueprint
                      </p>
                      <p className="text-sm font-semibold leading-tight">
                        How an agent could assist or replace this human step
                      </p>
                    </div>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-foreground/90">
                    {display.agentBlueprint.summary}
                  </p>

                  <div className="mt-4 space-y-3">
                    <BlueprintGroup
                      icon={<Workflow className="size-3.5" />}
                      color={palette.accent}
                      label="Capabilities"
                      items={display.agentBlueprint.capabilities}
                    />
                    <BlueprintGroup
                      icon={<FileInput className="size-3.5" />}
                      color={palette.primary}
                      label="Inputs"
                      items={display.agentBlueprint.inputs}
                    />
                    <BlueprintGroup
                      icon={<ShieldAlert className="size-3.5" />}
                      color={palette.human}
                      label="Risks addressed"
                      items={display.agentBlueprint.risks}
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-card p-2.5">
                    <div className="flex items-center gap-2 text-xs">
                      <Sparkles
                        className="size-3.5"
                        style={{ color: palette.accent }}
                      />
                      <span>
                        Target maturity:{" "}
                        <span
                          className="font-mono font-semibold"
                          style={{ color: palette.accent }}
                        >
                          {display.agentBlueprint.targetMaturity}
                        </span>
                      </span>
                    </div>
                    {onBuildAgent && (
                      <Button
                        size="sm"
                        className="gap-1.5 text-white shadow-sm"
                        style={{ background: palette.accent }}
                        onClick={() => onBuildAgent(display)}
                      >
                        <Wrench className="size-3.5" />
                        Build agent
                        <ArrowRight className="size-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div
                  className="flex items-start gap-2.5 rounded-xl border bg-card p-3 text-sm"
                  style={{ borderColor: hexToRgba(palette.agentic, 0.35) }}
                >
                  <CheckCircle2
                    className="mt-0.5 size-4 shrink-0"
                    style={{ color: palette.agentic }}
                  />
                  <p className="leading-snug">
                    This step is already covered by an embedded agent. Tap the
                    related agent card to see what it does, its inputs and
                    outputs.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

/* ---------- Helpers ---------- */

function Section({
  icon,
  color,
  title,
  children,
  compact,
}: {
  icon: React.ReactNode
  color: string
  title: string
  children: React.ReactNode
  compact?: boolean
}) {
  return (
    <div
      className="rounded-xl border bg-card p-3"
      style={{ borderColor: hexToRgba(color, 0.18) }}
    >
      <div className="mb-2 flex items-center gap-1.5">
        <span
          className="flex size-6 items-center justify-center rounded-md text-white"
          style={{ background: color }}
        >
          {icon}
        </span>
        <p
          className={`font-semibold ${compact ? "text-xs" : "text-sm"}`}
          style={{ color }}
        >
          {title}
        </p>
      </div>
      {children}
    </div>
  )
}

function SectionCard({
  icon,
  color,
  label,
  title,
  subtitle,
}: {
  icon: React.ReactNode
  color: string
  label: string
  title: string
  subtitle: string
}) {
  return (
    <div
      className="flex items-center gap-3 rounded-xl border bg-card p-3"
      style={{ borderColor: hexToRgba(color, 0.18) }}
    >
      <span
        className="flex size-9 items-center justify-center rounded-lg text-white"
        style={{ background: color }}
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p
          className="text-[10px] font-semibold uppercase tracking-wider"
          style={{ color }}
        >
          {label}
        </p>
        <p className="text-sm font-semibold">
          <span className="font-mono">{title}</span>{" "}
          <span className="font-normal text-muted-foreground">
            · {subtitle}
          </span>
        </p>
      </div>
    </div>
  )
}

function BlueprintGroup({
  icon,
  color,
  label,
  items,
}: {
  icon: React.ReactNode
  color: string
  label: string
  items: string[]
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center gap-1.5">
        <span
          className="flex size-5 items-center justify-center rounded-md text-white"
          style={{ background: color }}
        >
          {icon}
        </span>
        <p
          className="text-[10px] font-semibold uppercase tracking-wider"
          style={{ color }}
        >
          {label}
        </p>
      </div>
      <ul className="space-y-1">
        {items.map((it) => (
          <li key={it} className="flex items-start gap-2 text-sm">
            <span
              className="mt-1.5 size-1.5 shrink-0 rounded-full"
              style={{ background: color }}
            />
            <span className="leading-snug">{it}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
