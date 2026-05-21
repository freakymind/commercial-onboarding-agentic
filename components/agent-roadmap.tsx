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

/* ---------- Onboarding Journey Stages (matching main flow) ---------- */
const JOURNEY_STAGES = [
  { id: 1, label: "App\nSubmit" },
  { id: 2, label: "Identity\nVerify" },
  { id: 3, label: "Business\nVerify" },
  { id: 4, label: "Ownership\nStructure" },
  { id: 5, label: "Financial\nDD" },
  { id: 6, label: "Risk\nAssess" },
  { id: 7, label: "TM\nSetup" },
]

/* ---------- Agent Categories ---------- */
const AGENT_LAYERS = [
  {
    status: "Live",
    color: NW.live,
    icon: Rocket,
    agents: [
      { name: "OpsMate", stages: [1, 2, 3, 4, 5, 6, 7] },
      { name: "Business Verification", stages: [3] },
      { name: "Sole Trader Verification", stages: [2, 3] },
      { name: "APC Mate", stages: [6] },
    ],
  },
  {
    status: "In Dev",
    color: NW.dev,
    icon: Code2,
    agents: [
      { name: "Document Intelligence", stages: [1, 2, 5] },
      { name: "UBO", stages: [4] },
      { name: "Address Density", stages: [2] },
      { name: "Plausibility", stages: [3] },
      { name: "Source of Fund", stages: [5] },
    ],
  },
  {
    status: "Research",
    color: NW.research,
    icon: FlaskConical,
    agents: [
      { name: "Complex Ownership", stages: [4] },
      { name: "Business Plan Review", stages: [3, 5] },
      { name: "Company Financial", stages: [5] },
      { name: "Transaction Monitoring", stages: [7] },
      { name: "Sanctions Screen", stages: [4, 6] },
    ],
  },
]

export function AgentRoadmap() {
  return (
    <div className="min-h-screen p-3" style={{ background: NW.bg }}>
      <div className="mx-auto max-w-6xl">
        {/* Header - Very Compact */}
        <div className="mb-2 flex items-center justify-between">
          <h1 className="text-xl font-bold" style={{ color: NW.primary }}>
            Agentic Capability Roadmap
          </h1>
          <div className="flex gap-3">
            {AGENT_LAYERS.map((layer) => {
              const Icon = layer.icon
              return (
                <div key={layer.status} className="flex items-center gap-1 text-[10px]">
                  <div
                    className="flex size-4 items-center justify-center rounded-full text-white"
                    style={{ background: layer.color }}
                  >
                    <Icon className="size-2.5" />
                  </div>
                  <span className="font-medium">{layer.status}</span>
                  <span className="text-muted-foreground">({layer.agents.length})</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-12 gap-3">
          {/* Main Visualization - takes 8 columns */}
          <div className="col-span-8 rounded-lg border bg-white p-3 shadow-sm" style={{ borderColor: `${NW.primary}22` }}>
            
            {/* Journey Header Row */}
            <div className="mb-1 flex items-center">
              <div className="w-28 shrink-0" />
              <div className="flex flex-1 justify-between">
                {JOURNEY_STAGES.map((stage) => (
                  <div key={stage.id} className="flex-1 text-center px-0.5">
                    <div
                      className="mx-auto mb-0.5 flex size-5 items-center justify-center rounded-full text-white font-bold text-[9px]"
                      style={{ background: NW.primary }}
                    >
                      {stage.id}
                    </div>
                    <div className="text-[7px] font-medium text-muted-foreground whitespace-pre-line leading-tight">
                      {stage.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Journey Flow Line */}
            <div className="mb-2 flex items-center">
              <div className="w-28 shrink-0 text-right pr-2">
                <span className="text-[8px] font-bold uppercase" style={{ color: NW.primary }}>Journey</span>
              </div>
              <div className="flex-1 relative h-1.5">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{ background: `linear-gradient(90deg, ${NW.primary}, ${NW.accent})` }}
                />
              </div>
            </div>

            {/* Separator */}
            <div className="mb-2 border-t border-dashed" style={{ borderColor: `${NW.primary}15` }} />

            {/* Agent Layers */}
            {AGENT_LAYERS.map((layer, layerIdx) => {
              const Icon = layer.icon
              return (
                <div key={layer.status} className="mb-2 last:mb-0">
                  {/* Layer Header */}
                  <div className="mb-1 flex items-center">
                    <div
                      className="w-28 shrink-0 flex items-center gap-1 rounded px-1.5 py-0.5"
                      style={{ background: `${layer.color}10` }}
                    >
                      <div
                        className="flex size-4 items-center justify-center rounded-full text-white"
                        style={{ background: layer.color }}
                      >
                        <Icon className="size-2.5" />
                      </div>
                      <span className="text-[9px] font-bold" style={{ color: layer.color }}>
                        {layer.status}
                      </span>
                    </div>
                  </div>

                  {/* Agent Rows */}
                  <div className="space-y-0.5">
                    {layer.agents.map((agent) => (
                      <div key={agent.name} className="flex items-center">
                        <div className="w-28 shrink-0 flex items-center gap-1 pl-1">
                          <Bot className="size-2.5" style={{ color: layer.color }} />
                          <span className="text-[9px] font-medium truncate">{agent.name}</span>
                        </div>
                        <div className="flex flex-1 justify-between">
                          {JOURNEY_STAGES.map((stage) => {
                            const isActive = agent.stages.includes(stage.id)
                            return (
                              <div key={stage.id} className="flex-1 flex justify-center">
                                {isActive ? (
                                  <CheckCircle2 className="size-3" style={{ color: layer.color }} />
                                ) : (
                                  <div className="size-3 flex items-center justify-center">
                                    <div className="size-0.5 rounded-full bg-muted-foreground/20" />
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
                    <div className="mt-1.5 border-t" style={{ borderColor: `${NW.muted}10` }} />
                  )}
                </div>
              )
            })}
          </div>

          {/* Sidebar - 4 columns */}
          <div className="col-span-4 space-y-2">
            {/* What is this */}
            <div className="rounded-lg border bg-white p-2.5" style={{ borderColor: `${NW.primary}22` }}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Lightbulb className="size-3.5" style={{ color: NW.primary }} />
                <h3 className="text-xs font-bold" style={{ color: NW.primary }}>What is this?</h3>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                This roadmap shows AI agents across the 7-stage commercial onboarding journey. 
                Each agent automates specific checks, reducing manual effort and improving accuracy.
              </p>
            </div>

            {/* Summary Stats - Inline */}
            <div className="rounded-lg border bg-white p-2.5" style={{ borderColor: `${NW.primary}22` }}>
              <h3 className="text-xs font-bold mb-2" style={{ color: NW.primary }}>Agent Pipeline</h3>
              <div className="space-y-1.5">
                {AGENT_LAYERS.map((layer) => (
                  <div
                    key={layer.status}
                    className="rounded px-2 py-1.5"
                    style={{ background: `${layer.color}08`, borderLeft: `2px solid ${layer.color}` }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold" style={{ color: layer.color }}>{layer.status}</span>
                      <span className="text-sm font-bold" style={{ color: layer.color }}>{layer.agents.length}</span>
                    </div>
                    <p className="text-[9px] text-muted-foreground leading-snug mt-0.5">
                      {layer.agents.map((a) => a.name).join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Benefits */}
            <div className="rounded-lg border bg-white p-2.5" style={{ borderColor: `${NW.primary}22` }}>
              <h3 className="text-xs font-bold mb-1.5" style={{ color: NW.primary }}>Key Benefits</h3>
              <ul className="space-y-1 text-[9px] text-muted-foreground">
                <li className="flex items-start gap-1">
                  <CheckCircle2 className="size-2.5 mt-0.5 shrink-0" style={{ color: NW.live }} />
                  <span>Faster processing with automated checks</span>
                </li>
                <li className="flex items-start gap-1">
                  <CheckCircle2 className="size-2.5 mt-0.5 shrink-0" style={{ color: NW.live }} />
                  <span>Higher accuracy and consistency</span>
                </li>
                <li className="flex items-start gap-1">
                  <CheckCircle2 className="size-2.5 mt-0.5 shrink-0" style={{ color: NW.live }} />
                  <span>Analysts focus on complex cases</span>
                </li>
                <li className="flex items-start gap-1">
                  <CheckCircle2 className="size-2.5 mt-0.5 shrink-0" style={{ color: NW.live }} />
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
