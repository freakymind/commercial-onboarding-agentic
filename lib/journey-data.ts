export type ProcessType = "agentic" | "human"

export type Process = {
  id: string
  name: string
  type: ProcessType
}

export type MaturityLevel = "L1" | "L2" | "L3" | "L4" | "L5"

export type Agent = {
  id: string
  name: string
  function: string
  scope: "common" | "stage"
  stageId?: string
  maturity: MaturityLevel
  color?: string // optional per-agent color override
}

export type Stage = {
  id: string
  number: number
  name: string
  processes: Process[]
}

export const initialStages: Stage[] = [
  {
    id: "stage-1",
    number: 1,
    name: "Application Submission",
    processes: [
      { id: "p-1-1", name: "Customer & Ops Comms", type: "human" },
      { id: "p-1-2", name: "Case Allocation & Escalations", type: "human" },
    ],
  },
  {
    id: "stage-2",
    number: 2,
    name: "Identity Verification",
    processes: [
      { id: "p-2-1", name: "Basic ID Verification", type: "agentic" },
      { id: "p-2-2", name: "Proof of Address", type: "agentic" },
      { id: "p-2-3", name: "Enhanced Identity Verification", type: "human" },
    ],
  },
  {
    id: "stage-3",
    number: 3,
    name: "Business Verification",
    processes: [
      { id: "p-3-1", name: "Business Registration Documents", type: "agentic" },
      { id: "p-3-2", name: "Company Structure Documentation", type: "agentic" },
      { id: "p-3-3", name: "Business Plan Review", type: "human" },
    ],
  },
  {
    id: "stage-4",
    number: 4,
    name: "Ownership Structure",
    processes: [
      { id: "p-4-1", name: "Simple Ownership Verification", type: "agentic" },
      { id: "p-4-2", name: "Director Verification", type: "agentic" },
      { id: "p-4-3", name: "Beneficial Owner Identification", type: "agentic" },
      { id: "p-4-4", name: "Complex Ownership Structure Mapping", type: "human" },
    ],
  },
  {
    id: "stage-5",
    number: 5,
    name: "Financial Due Diligence",
    processes: [
      { id: "p-5-1", name: "Basic Credit Check", type: "agentic" },
      { id: "p-5-2", name: "Cash Handling Assessment", type: "human" },
      { id: "p-5-3", name: "Enhanced Source of Wealth Investigation", type: "human" },
      { id: "p-5-4", name: "Source of Funds Verification", type: "agentic" },
      { id: "p-5-5", name: "Company Financial Review", type: "agentic" },
    ],
  },
  {
    id: "stage-6",
    number: 6,
    name: "Risk Assessment",
    processes: [
      { id: "p-6-1", name: "Adverse Media Checks", type: "agentic" },
      { id: "p-6-2", name: "Enhanced PEP Due Diligence", type: "human" },
      { id: "p-6-3", name: "PEP Screening", type: "agentic" },
      { id: "p-6-4", name: "Foreign Jurisdiction Risk Assessment", type: "human" },
      { id: "p-6-5", name: "Sanctions Screening", type: "agentic" },
      { id: "p-6-6", name: "Standard AML Risk Assessment", type: "agentic" },
    ],
  },
  {
    id: "stage-7",
    number: 7,
    name: "Transaction Monitoring",
    processes: [
      { id: "p-7-1", name: "Standard Monitoring", type: "agentic" },
      { id: "p-7-2", name: "Enhanced Monitoring", type: "human" },
      { id: "p-7-3", name: "Foreign Transaction Monitoring", type: "agentic" },
    ],
  },
]

export const initialAgents: Agent[] = [
  // Common reusable agents
  {
    id: "agent-common-1",
    scope: "common",
    name: "OpsMate Agent",
    function: "SOP, policy and document guidance for analysts",
    maturity: "L1",
  },
  {
    id: "agent-common-2",
    scope: "common",
    name: "Policy-to-Rule Agent",
    function: "Converts policy requirements into rule logic and checklist controls",
    maturity: "L3",
  },
  {
    id: "agent-common-3",
    scope: "common",
    name: "Nudge Agent",
    function: "Sends reminders, follow-ups and missing information prompts",
    maturity: "L4",
  },
  {
    id: "agent-common-4",
    scope: "common",
    name: "QC Agent",
    function: "Reviews case quality, evidence completeness and decision consistency",
    maturity: "L2",
  },

  // Business Verification
  {
    id: "agent-3-1",
    scope: "stage",
    stageId: "stage-3",
    name: "Business Verification Agent",
    function:
      "Checks company registration, trading status, SIC, VAT, active/inactive status and registry evidence",
    maturity: "L3",
  },
  {
    id: "agent-3-2",
    scope: "stage",
    stageId: "stage-3",
    name: "Business Plan Review Agent",
    function: "Reviews business model, expected activity, sector risk and onboarding rationale",
    maturity: "L2",
  },

  // Ownership Structure
  {
    id: "agent-4-1",
    scope: "stage",
    stageId: "stage-4",
    name: "Sole Trader Agent",
    function: "Validates sole trader profile, trading evidence and identity link",
    maturity: "L3",
  },
  {
    id: "agent-4-2",
    scope: "stage",
    stageId: "stage-4",
    name: "Director Verification Agent",
    function: "Checks directors, appointment history, active companies and risk patterns",
    maturity: "L3",
  },
  {
    id: "agent-4-3",
    scope: "stage",
    stageId: "stage-4",
    name: "Beneficial Ownership Agent",
    function: "Identifies PSCs, ownership percentages and control logic",
    maturity: "L3",
  },
  {
    id: "agent-4-4",
    scope: "stage",
    stageId: "stage-4",
    name: "Complex Ownership Mapping Agent",
    function: "Maps layered entities, parent companies, trusts and cross-border structures",
    maturity: "L2",
  },
  {
    id: "agent-4-5",
    scope: "stage",
    stageId: "stage-4",
    name: "Customer Activity Agent",
    function: "Compares expected customer activity with business type and ownership profile",
    maturity: "L2",
  },

  // Financial Due Diligence
  {
    id: "agent-5-1",
    scope: "stage",
    stageId: "stage-5",
    name: "Source of Funds Agent",
    function: "Reviews declared source of funds against evidence and transaction expectations",
    maturity: "L3",
  },
  {
    id: "agent-5-2",
    scope: "stage",
    stageId: "stage-5",
    name: "Financial Analysis Agent",
    function: "Reads accounts, turnover, balance sheet, liabilities and financial health indicators",
    maturity: "L3",
  },

  // Risk Assessment
  {
    id: "agent-6-1",
    scope: "stage",
    stageId: "stage-6",
    name: "Adverse Media Agent",
    function: "Searches and summarises negative media, fraud, litigation and reputational risk signals",
    maturity: "L3",
  },
  {
    id: "agent-6-2",
    scope: "stage",
    stageId: "stage-6",
    name: "PEP Due Diligence Agent",
    function: "Reviews PEP exposure, role, jurisdiction and required enhanced checks",
    maturity: "L2",
  },
  {
    id: "agent-6-3",
    scope: "stage",
    stageId: "stage-6",
    name: "Sanctions Screening Agent",
    function: "Checks sanctions hits, false positives and evidence trail",
    maturity: "L4",
  },
  {
    id: "agent-6-4",
    scope: "stage",
    stageId: "stage-6",
    name: "AML Risk Assessment Agent",
    function: "Combines risk factors into a structured AML risk view",
    maturity: "L3",
  },

  // Transaction Monitoring
  {
    id: "agent-7-1",
    scope: "stage",
    stageId: "stage-7",
    name: "Transaction Monitoring Agent",
    function: "Sets expected behaviour baseline and identifies post-onboarding anomalies",
    maturity: "L4",
  },
]

export const maturityDescriptions: Record<MaturityLevel, string> = {
  L1: "Assist — Agent supports analyst with guidance",
  L2: "Check — Agent validates evidence and flags gaps",
  L3: "Recommend — Agent suggests decision or next best action",
  L4: "Act with approval — Agent completes action after human approval",
  L5: "Autonomous — Agent operates within approved risk boundaries",
}

export type ThemePalette = {
  name: string
  primary: string // main brand (purple)
  accent: string // magenta
  agentic: string // amber
  human: string // blue
  common: string // green
  stage: string // purple cards (defaults to primary)
}

export const defaultPalette: ThemePalette = {
  name: "NatWest",
  primary: "#5A287D",
  accent: "#BD0F72",
  agentic: "#F7A823",
  human: "#4A90B8",
  common: "#2E9E6E",
  stage: "#7B3FA0",
}

export const presetPalettes: ThemePalette[] = [
  defaultPalette,
  {
    name: "Royal Indigo",
    primary: "#312E81",
    accent: "#9333EA",
    agentic: "#F59E0B",
    human: "#0EA5E9",
    common: "#10B981",
    stage: "#6366F1",
  },
  {
    name: "Midnight Teal",
    primary: "#0F4C5C",
    accent: "#E36414",
    agentic: "#FFB400",
    human: "#5390D9",
    common: "#06A77D",
    stage: "#1B998B",
  },
  {
    name: "Slate & Rose",
    primary: "#1E293B",
    accent: "#E11D48",
    agentic: "#F59E0B",
    human: "#64748B",
    common: "#059669",
    stage: "#7C3AED",
  },
]
