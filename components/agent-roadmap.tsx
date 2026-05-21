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
    <div className="min-h-screen p-6" style={{ background: NW.bg }}>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold" style={{ color: NW.primary }}>
            Agentic Capability Roadmap
          </h1>
          <p className="mt-2 text-muted-foreground">
            Overview of AI agents across the commercial onboarding journey
          </p>
        </div>

        {/* Main Visualization */}
        <div className="rounded-2xl border-2 bg-white p-6 shadow-sm" style={{ borderColor: `${NW.primary}22` }}>
          
          {/* Journey Header Row */}
          <div className="mb-2 flex items-center gap-2">
            <div className="w-48 shrink-0" />
            <div className="flex flex-1 justify-between">
              {JOURNEY_STAGES.map((stage) => (
                <div
                  key={stage.id}
                  className="flex-1 text-center px-1"
                >
                  <div
                    className="mx-auto mb-2 flex size-10 items-center justify-center rounded-full text-white font-bold text-sm"
                    style={{ background: NW.primary }}
                  >
                    {stage.id}
                  </div>
                  <div className="text-[10px] font-medium text-muted-foreground whitespace-pre-line leading-tight">
                    {stage.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Journey Flow Line */}
          <div className="mb-6 flex items-center gap-2">
            <div className="w-48 shrink-0 text-right pr-4">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: NW.primary }}>
                Onboarding Journey
              </span>
            </div>
            <div className="flex-1 relative h-3">
              <div
                className="absolute inset-0 rounded-full"
                style={{ background: `linear-gradient(90deg, ${NW.primary}, ${NW.accent})` }}
              />
              {/* Stage markers */}
              {JOURNEY_STAGES.map((stage, i) => (
                <div
                  key={stage.id}
                  className="absolute top-1/2 -translate-y-1/2 size-3 rounded-full bg-white border-2"
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
          <div className="mb-6 border-t-2 border-dashed" style={{ borderColor: `${NW.primary}22` }} />

          {/* Agent Layers */}
          {AGENT_LAYERS.map((layer, layerIdx) => {
            const Icon = layer.icon
            return (
              <div key={layer.status} className="mb-6 last:mb-0">
                {/* Layer Header */}
                <div className="mb-3 flex items-center gap-2">
                  <div
                    className="w-48 shrink-0 flex items-center gap-2 rounded-lg px-3 py-2"
                    style={{ background: `${layer.color}15` }}
                  >
                    <div
                      className="flex size-8 items-center justify-center rounded-full text-white"
                      style={{ background: layer.color }}
                    >
                      <Icon className="size-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold" style={{ color: layer.color }}>
                        {layer.status}
                      </div>
                      <div className="text-[9px] text-muted-foreground">
                        {layer.agents.length} agents
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 text-xs text-muted-foreground">
                    {layer.description}
                  </div>
                </div>

                {/* Agent Rows */}
                <div className="space-y-2 pl-4">
                  {layer.agents.map((agent) => (
                    <div key={agent.name} className="flex items-center gap-2">
                      {/* Agent Name */}
                      <div className="w-44 shrink-0 flex items-center gap-2">
                        <Bot className="size-4" style={{ color: layer.color }} />
                        <span className="text-xs font-medium truncate">{agent.name}</span>
                      </div>
                      {/* Stage Coverage */}
                      <div className="flex flex-1 justify-between">
                        {JOURNEY_STAGES.map((stage) => {
                          const isActive = agent.stages.includes(stage.id)
                          return (
                            <div key={stage.id} className="flex-1 flex justify-center">
                              {isActive ? (
                                <div
                                  className="size-6 rounded-full flex items-center justify-center"
                                  style={{ background: `${layer.color}20` }}
                                >
                                  <CheckCircle2
                                    className="size-4"
                                    style={{ color: layer.color }}
                                  />
                                </div>
                              ) : (
                                <div className="size-6 rounded-full border border-dashed flex items-center justify-center" style={{ borderColor: `${NW.muted}44` }}>
                                  <div className="size-1.5 rounded-full" style={{ background: `${NW.muted}33` }} />
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Separator between layers */}
                {layerIdx < AGENT_LAYERS.length - 1 && (
                  <div className="mt-4 border-t" style={{ borderColor: `${NW.muted}22` }} />
                )}
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap justify-center gap-6">
          {AGENT_LAYERS.map((layer) => {
            const Icon = layer.icon
            return (
              <div key={layer.status} className="flex items-center gap-2">
                <div
                  className="flex size-6 items-center justify-center rounded-full text-white"
                  style={{ background: layer.color }}
                >
                  <Icon className="size-3" />
                </div>
                <span className="text-sm font-medium">{layer.status}</span>
                <span className="text-xs text-muted-foreground">({layer.agents.length})</span>
              </div>
            )
          })}
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          {AGENT_LAYERS.map((layer) => (
            <div
              key={layer.status}
              className="rounded-xl p-4 text-center"
              style={{ background: `${layer.color}10`, borderLeft: `4px solid ${layer.color}` }}
            >
              <div className="text-3xl font-bold" style={{ color: layer.color }}>
                {layer.agents.length}
              </div>
              <div className="text-sm font-medium">{layer.status}</div>
              <div className="mt-1 text-xs text-muted-foreground">
                {layer.agents.map((a) => a.name).join(", ")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
