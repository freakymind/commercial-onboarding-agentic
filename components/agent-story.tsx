"use client"

import { Bot, Rocket, Code2, FlaskConical, TrendingUp, Users, Clock, CheckCircle2, ArrowRight } from "lucide-react"

/* ---------- NatWest palette ---------- */
const NW = {
  primary: "#5a287d",
  accent: "#bd0f72",
  live: "#10b981",
  dev: "#f59e0b",
  research: "#6366f1",
  bg: "#faf8fc",
  muted: "#64748b",
}

/* ---------- Agents by status with expected benefits ---------- */
const AGENTS = {
  live: [
    { name: "OpsMate", benefit: "30% faster routing" },
    { name: "Business Verification", benefit: "85% auto-verified" },
    { name: "Sole Trader Verification", benefit: "70% STP rate" },
    { name: "APC Mate", benefit: "40% faster decisions" },
  ],
  dev: [
    { name: "Document Intelligence", benefit: "60% faster doc review" },
    { name: "UBO Check", benefit: "Auto ownership mapping" },
    { name: "Address Density", benefit: "Risk scoring" },
    { name: "Plausibility", benefit: "Anomaly detection" },
    { name: "Source of Fund", benefit: "Automated SOF checks" },
  ],
  research: [
    { name: "Complex Ownership", benefit: "Multi-layer structures" },
    { name: "Business Plan Review", benefit: "AI-driven analysis" },
    { name: "Company Financial", benefit: "Auto financial review" },
    { name: "Transaction Monitoring", benefit: "Real-time alerts" },
    { name: "Sanctions Screen", benefit: "Continuous screening" },
  ],
}

/* ---------- Cumulative benefits story ---------- */
const BENEFIT_MILESTONES = [
  { agents: 0, rft: 62, stp: 28, label: "Baseline" },
  { agents: 4, rft: 78, stp: 52, label: "Today (4 Live)" },
  { agents: 9, rft: 88, stp: 68, label: "+5 In Dev" },
  { agents: 14, rft: 94, stp: 78, label: "+5 Research" },
]

export function AgentStory() {
  return (
    <div className="min-h-screen p-4" style={{ background: NW.bg }}>
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-4 text-center">
          <h1 className="text-2xl font-bold" style={{ color: NW.primary }}>
            The Agentic Journey: Continuous Improvement
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            As more agents deploy, benefits compound across the onboarding process
          </p>
        </div>

        {/* Main Content - Two columns */}
        <div className="grid grid-cols-12 gap-4">
          
          {/* Left: Benefits Curve - 5 cols */}
          <div className="col-span-5 rounded-xl border bg-white p-4" style={{ borderColor: `${NW.primary}22` }}>
            <h2 className="text-sm font-bold mb-3" style={{ color: NW.primary }}>
              Projected Benefits as Agents Deploy
            </h2>
            
            {/* Simple bar chart showing progression */}
            <div className="space-y-4">
              {BENEFIT_MILESTONES.map((milestone, idx) => (
                <div key={milestone.label} className="relative">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium">{milestone.label}</span>
                    <span className="text-[10px] text-muted-foreground">{milestone.agents} agents</span>
                  </div>
                  
                  {/* RFT bar */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] w-8 text-muted-foreground">RFT</span>
                    <div className="flex-1 h-4 bg-muted/20 rounded overflow-hidden">
                      <div 
                        className="h-full rounded transition-all duration-500 flex items-center justify-end pr-1"
                        style={{ 
                          width: `${milestone.rft}%`, 
                          background: idx === 0 ? NW.muted : idx === 1 ? NW.live : idx === 2 ? NW.dev : NW.research
                        }}
                      >
                        <span className="text-[9px] font-bold text-white">{milestone.rft}%</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* STP bar */}
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] w-8 text-muted-foreground">STP</span>
                    <div className="flex-1 h-4 bg-muted/20 rounded overflow-hidden">
                      <div 
                        className="h-full rounded transition-all duration-500 flex items-center justify-end pr-1"
                        style={{ 
                          width: `${milestone.stp}%`, 
                          background: idx === 0 ? NW.muted : idx === 1 ? NW.live : idx === 2 ? NW.dev : NW.research
                        }}
                      >
                        <span className="text-[9px] font-bold text-white">{milestone.stp}%</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Arrow to next milestone */}
                  {idx < BENEFIT_MILESTONES.length - 1 && (
                    <div className="flex justify-center my-2">
                      <ArrowRight className="size-4 text-muted-foreground/40 rotate-90" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Key message */}
            <div className="mt-4 p-2 rounded-lg text-center" style={{ background: `${NW.live}10` }}>
              <p className="text-[10px] font-medium" style={{ color: NW.live }}>
                Each wave of agents compounds the benefits
              </p>
            </div>
          </div>

          {/* Right: Agent Pipeline - 7 cols */}
          <div className="col-span-7 rounded-xl border bg-white p-4" style={{ borderColor: `${NW.primary}22` }}>
            <h2 className="text-sm font-bold mb-3" style={{ color: NW.primary }}>
              Agent Pipeline: From Research to Production
            </h2>
            
            {/* Pipeline visualization */}
            <div className="relative">
              {/* Flow arrow background */}
              <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 rounded-full" 
                   style={{ background: `linear-gradient(90deg, ${NW.research}, ${NW.dev}, ${NW.live})` }} />
              
              {/* Three columns for stages */}
              <div className="relative grid grid-cols-3 gap-3">
                {/* Research */}
                <div className="rounded-lg p-3" style={{ background: `${NW.research}08`, border: `1px solid ${NW.research}33` }}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="flex size-5 items-center justify-center rounded-full text-white" style={{ background: NW.research }}>
                      <FlaskConical className="size-3" />
                    </div>
                    <span className="text-xs font-bold" style={{ color: NW.research }}>Research</span>
                    <span className="text-[9px] text-muted-foreground ml-auto">{AGENTS.research.length}</span>
                  </div>
                  <div className="space-y-1.5">
                    {AGENTS.research.map((agent) => (
                      <div key={agent.name} className="flex items-start gap-1.5">
                        <Bot className="size-3 mt-0.5 shrink-0" style={{ color: NW.research }} />
                        <div>
                          <div className="text-[9px] font-medium leading-tight">{agent.name}</div>
                          <div className="text-[8px] text-muted-foreground">{agent.benefit}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* In Development */}
                <div className="rounded-lg p-3" style={{ background: `${NW.dev}08`, border: `1px solid ${NW.dev}33` }}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="flex size-5 items-center justify-center rounded-full text-white" style={{ background: NW.dev }}>
                      <Code2 className="size-3" />
                    </div>
                    <span className="text-xs font-bold" style={{ color: NW.dev }}>In Dev</span>
                    <span className="text-[9px] text-muted-foreground ml-auto">{AGENTS.dev.length}</span>
                  </div>
                  <div className="space-y-1.5">
                    {AGENTS.dev.map((agent) => (
                      <div key={agent.name} className="flex items-start gap-1.5">
                        <Bot className="size-3 mt-0.5 shrink-0" style={{ color: NW.dev }} />
                        <div>
                          <div className="text-[9px] font-medium leading-tight">{agent.name}</div>
                          <div className="text-[8px] text-muted-foreground">{agent.benefit}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Live */}
                <div className="rounded-lg p-3" style={{ background: `${NW.live}08`, border: `2px solid ${NW.live}` }}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="flex size-5 items-center justify-center rounded-full text-white" style={{ background: NW.live }}>
                      <Rocket className="size-3" />
                    </div>
                    <span className="text-xs font-bold" style={{ color: NW.live }}>Live</span>
                    <span className="text-[9px] text-muted-foreground ml-auto">{AGENTS.live.length}</span>
                  </div>
                  <div className="space-y-1.5">
                    {AGENTS.live.map((agent) => (
                      <div key={agent.name} className="flex items-start gap-1.5">
                        <CheckCircle2 className="size-3 mt-0.5 shrink-0" style={{ color: NW.live }} />
                        <div>
                          <div className="text-[9px] font-medium leading-tight">{agent.name}</div>
                          <div className="text-[8px] text-muted-foreground">{agent.benefit}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Direction arrows */}
              <div className="flex justify-around mt-2">
                <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
                  <ArrowRight className="size-3" />
                  <span>Moving to Dev</span>
                </div>
                <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
                  <ArrowRight className="size-3" />
                  <span>Going Live</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Key Stats */}
        <div className="mt-4 grid grid-cols-4 gap-3">
          <div className="rounded-lg border bg-white p-3 text-center" style={{ borderColor: `${NW.live}44` }}>
            <div className="text-2xl font-bold" style={{ color: NW.live }}>4</div>
            <div className="text-[10px] font-medium text-muted-foreground">Agents Live</div>
            <div className="text-[9px]" style={{ color: NW.live }}>Delivering value now</div>
          </div>
          <div className="rounded-lg border bg-white p-3 text-center" style={{ borderColor: `${NW.dev}44` }}>
            <div className="text-2xl font-bold" style={{ color: NW.dev }}>5</div>
            <div className="text-[10px] font-medium text-muted-foreground">In Development</div>
            <div className="text-[9px]" style={{ color: NW.dev }}>Coming in 2024</div>
          </div>
          <div className="rounded-lg border bg-white p-3 text-center" style={{ borderColor: `${NW.research}44` }}>
            <div className="text-2xl font-bold" style={{ color: NW.research }}>5</div>
            <div className="text-[10px] font-medium text-muted-foreground">In Research</div>
            <div className="text-[9px]" style={{ color: NW.research }}>Future roadmap</div>
          </div>
          <div className="rounded-lg border bg-white p-3 text-center" style={{ borderColor: `${NW.primary}44` }}>
            <div className="text-2xl font-bold" style={{ color: NW.primary }}>14</div>
            <div className="text-[10px] font-medium text-muted-foreground">Total Pipeline</div>
            <div className="text-[9px]" style={{ color: NW.primary }}>Full automation vision</div>
          </div>
        </div>

        {/* Story message */}
        <div className="mt-4 rounded-xl p-4 text-center" style={{ background: `${NW.primary}08`, border: `1px solid ${NW.primary}22` }}>
          <h3 className="text-sm font-bold" style={{ color: NW.primary }}>The Story</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-2xl mx-auto">
            We started with 4 agents and achieved 78% RFT. As we deploy each new wave of agents, 
            benefits compound - more automation, higher accuracy, faster processing. 
            The full pipeline of 14 agents will transform commercial onboarding to 94%+ RFT and 78%+ STP.
          </p>
        </div>
      </div>
    </div>
  )
}
