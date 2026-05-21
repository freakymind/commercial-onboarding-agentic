"use client"

import { Bot, CheckCircle2, Code2, FlaskConical, Lightbulb, Rocket } from "lucide-react"

/* ---------- NatWest palette ---------- */
const NW = {
  primary: "#5a287d",
  accent: "#bd0f72",
  live: "#10b981",
  dev: "#f59e0b",
  research: "#6366f1",
  bg: "#faf8fc",
  muted: "#94a3b8",
}

/* ---------- Onboarding Journey Stages ---------- */
const JOURNEY_STAGES = [
  { id: 1, label: "Application\nReceived" },
  { id: 2, label: "Identity &\nVerification" },
  { id: 3, label: "Business\nChecks" },
  { id: 4, label: "Risk\nAssessment" },
  { id: 5, label: "Document\nReview" },
  { id: 6, label: "Compliance\nChecks" },
  { id: 7, label: "Final\nApproval" },
]

/* ---------- Agent Categories ---------- */
const AGENT_LAYERS = [
  {
    status: "Live",
    color: NW.live,
    icon: Rocket,
    description: "In production, processing real applications",
    agents: [
      { name: "OpsMate", stages: [1, 2, 3, 4, 5, 6, 7] },
      { name: "Business Verification", stages: [2, 3] },
      { name: "Sole Trader Verification", stages: [2, 3] },
      { name: "APC Mate", stages: [4, 6] },
    ],
  },
  {
    status: "In Development",
    color: NW.dev,
    icon: Code2,
    description: "Being built and tested, launching soon",
    agents: [
      { name: "Document Intelligence", stages: [5] },
      { name: "UBO", stages: [2, 3] },
      { name: "Address Density", stages: [2] },
      { name: "Plausibility", stages: [3, 4] },
      { name: "Source of Fund", stages: [4, 5] },
    ],
  },
  {
    status: "In Design & Research",
    color: NW.research,
    icon: FlaskConical,
    description: "Exploring feasibility and requirements",
    agents: [
      { name: "Complex Ownership", stages: [3, 4] },
      { name: "Business Plan Review", stages: [4, 5] },
      { name: "Company Financial", stages: [4, 5] },
      { name: "Transaction Monitoring", stages: [6] },
      { name: "Sanctions Screen", stages: [6] },
    ],
  },
]

export function AgentRoadmap() {
  return (
    <div className="min-h-screen p-4" style={{ background: NW.bg }}>
      <div className="mx-auto max-w-6xl">
        {/* Header - Compact */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: NW.primary }}>
              Agentic Capability Roadmap
            </h1>
            <p className="text-sm text-muted-foreground">
              AI agents across commercial onboarding journey
            </p>
          </div>
          <div className="flex gap-4">
            {AGENT_LAYERS.map((layer) => {
              const Icon = layer.icon
              return (
                <div key={layer.status} className="flex items-center gap-1.5 text-xs">
                  <div
                    className="flex size-5 items-center justify-center rounded-full text-white"
                    style={{ background: layer.color }}
                  >
                    <Icon className="size-3" />
                  </div>
                  <span className="font-medium">{layer.status}</span>
                  <span className="text-muted-foreground">({layer.agents.length})</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          {/* Main Visualization - takes 9 columns */}
          <div className="col-span-9 rounded-xl border-2 bg-white p-4 shadow-sm" style={{ borderColor: `${NW.primary}22` }}>
            
            {/* Journey Header Row - Compact */}
            <div className="mb-1 flex items-center gap-1">
              <div className="w-36 shrink-0" />
              <div className="flex flex-1 justify-between">
                {JOURNEY_STAGES.map((stage) => (
                  <div key={stage.id} className="flex-1 text-center px-0.5">
                    <div
                      className="mx-auto mb-1 flex size-7 items-center justify-center rounded-full text-white font-bold text-xs"
                      style={{ background: NW.primary }}
                    >
                      {stage.id}
                    </div>
                    <div className="text-[8px] font-medium text-muted-foreground whitespace-pre-line leading-tight">
                      {stage.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Journey Flow Line - Compact */}
            <div className="mb-3 flex items-center gap-1">
              <div className="w-36 shrink-0 text-right pr-2">
                <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: NW.primary }}>
                  Journey
                </span>
              </div>
              <div className="flex-1 relative h-2">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{ background: `linear-gradient(90deg, ${NW.primary}, ${NW.accent})` }}
                />
                {JOURNEY_STAGES.map((stage, i) => (
                  <div
                    key={stage.id}
                    className="absolute top-1/2 -translate-y-1/2 size-2 rounded-full bg-white border"
                    style={{
                      left: `${(i / (JOURNEY_STAGES.length - 1)) * 100}%`,
                      transform: "translate(-50%, -50%)",
                      borderColor: NW.primary,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Separator */}
            <div className="mb-3 border-t border-dashed" style={{ borderColor: `${NW.primary}22` }} />

            {/* Agent Layers - Compact */}
            {AGENT_LAYERS.map((layer, layerIdx) => {
              const Icon = layer.icon
              return (
                <div key={layer.status} className="mb-3 last:mb-0">
                  {/* Layer Header */}
                  <div className="mb-1.5 flex items-center gap-1">
                    <div
                      className="w-36 shrink-0 flex items-center gap-1.5 rounded px-2 py-1"
                      style={{ background: `${layer.color}12` }}
                    >
                      <div
                        className="flex size-5 items-center justify-center rounded-full text-white"
                        style={{ background: layer.color }}
                      >
                        <Icon className="size-3" />
                      </div>
                      <div className="text-[10px] font-bold" style={{ color: layer.color }}>
                        {layer.status}
                      </div>
                    </div>
                  </div>

                  {/* Agent Rows - Compact */}
                  <div className="space-y-1 pl-2">
                    {layer.agents.map((agent) => (
                      <div key={agent.name} className="flex items-center gap-1">
                        <div className="w-34 shrink-0 flex items-center gap-1">
                          <Bot className="size-3" style={{ color: layer.color }} />
                          <span className="text-[10px] font-medium truncate">{agent.name}</span>
                        </div>
                        <div className="flex flex-1 justify-between">
                          {JOURNEY_STAGES.map((stage) => {
                            const isActive = agent.stages.includes(stage.id)
                            return (
                              <div key={stage.id} className="flex-1 flex justify-center">
                                {isActive ? (
                                  <div
                                    className="size-4 rounded-full flex items-center justify-center"
                                    style={{ background: `${layer.color}25` }}
                                  >
                                    <CheckCircle2 className="size-3" style={{ color: layer.color }} />
                                  </div>
                                ) : (
                                  <div className="size-4 flex items-center justify-center">
                                    <div className="size-1 rounded-full" style={{ background: `${NW.muted}33` }} />
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {layerIdx < AGENT_LAYERS.length - 1 && (
                    <div className="mt-2 border-t" style={{ borderColor: `${NW.muted}15` }} />
                  )}
                </div>
              )
            })}
          </div>

          {/* Sidebar - Key Insights - takes 3 columns */}
          <div className="col-span-3 space-y-3">
            {/* What is this */}
            <div className="rounded-xl border bg-white p-3" style={{ borderColor: `${NW.primary}22` }}>
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="size-4" style={{ color: NW.primary }} />
                <h3 className="text-sm font-bold" style={{ color: NW.primary }}>What is this?</h3>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                This roadmap shows all AI agents being developed for commercial onboarding. 
                Each agent automates specific checks across the 7-stage journey, reducing manual effort and improving accuracy.
              </p>
            </div>

            {/* Summary Stats */}
            {AGENT_LAYERS.map((layer) => (
              <div
                key={layer.status}
                className="rounded-xl p-3"
                style={{ background: `${layer.color}08`, borderLeft: `3px solid ${layer.color}` }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold" style={{ color: layer.color }}>{layer.status}</span>
                  <span className="text-lg font-bold" style={{ color: layer.color }}>{layer.agents.length}</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-snug">
                  {layer.agents.map((a) => a.name).join(", ")}
                </p>
              </div>
            ))}

            {/* Key Benefits */}
            <div className="rounded-xl border bg-white p-3" style={{ borderColor: `${NW.primary}22` }}>
              <h3 className="text-sm font-bold mb-2" style={{ color: NW.primary }}>Key Benefits</h3>
              <ul className="space-y-1.5 text-[10px] text-muted-foreground">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="size-3 mt-0.5 shrink-0" style={{ color: NW.live }} />
                  <span>Faster processing with automated checks</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="size-3 mt-0.5 shrink-0" style={{ color: NW.live }} />
                  <span>Higher accuracy and consistency</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="size-3 mt-0.5 shrink-0" style={{ color: NW.live }} />
                  <span>Analysts focus on complex cases</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="size-3 mt-0.5 shrink-0" style={{ color: NW.live }} />
                  <span>Scalable capacity without headcount</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
