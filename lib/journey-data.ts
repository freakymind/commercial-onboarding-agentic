export type ProcessType = "agentic" | "human"

export type Process = {
  id: string
  name: string
  type: ProcessType
  /** What happens in this process step (analyst / system view) */
  description?: string
  /** For human steps: how an agent could be built to support / replace this work */
  agentBlueprint?: {
    summary: string
    capabilities: string[]
    inputs: string[]
    risks: string[]
    targetMaturity: MaturityLevel
  }
}

export type MaturityLevel = "L1" | "L2" | "L3" | "L4" | "L5"

export type Agent = {
  id: string
  name: string
  function: string
  scope: "common" | "stage"
  stageId?: string
  maturity: MaturityLevel
  color?: string
  /** Bullet list of what this agent actually does, step by step */
  tasks?: string[]
  /** Data, evidence and systems the agent reads from */
  inputs?: string[]
  /** Outputs / artefacts produced for the analyst or case */
  outputs?: string[]
}

export type Stage = {
  id: string
  number: number
  name: string
  processes: Process[]
}

/* -------------------------------------------------------------------------- */
/*  Stages                                                                     */
/* -------------------------------------------------------------------------- */

export const initialStages: Stage[] = [
  {
    id: "stage-1",
    number: 1,
    name: "Application Submission",
    processes: [
      {
        id: "p-1-1",
        name: "Customer & Ops Comms",
        type: "agentic",
        description:
          "All inbound and outbound communications between the customer and the onboarding ops team — emails, chat, document requests, status updates.",
      },
      {
        id: "p-1-2",
        name: "Case Allocation & Escalations",
        type: "agentic",
        description:
          "Routing of new cases to the right analyst pool and escalating stuck or high-risk cases to the right reviewer or queue.",
      },
    ],
  },
  {
    id: "stage-2",
    number: 2,
    name: "Identity Verification",
    processes: [
      {
        id: "p-2-1",
        name: "Basic ID Verification",
        type: "agentic",
        description: "Document + biometric ID checks against trusted issuers and registries.",
      },
      {
        id: "p-2-2",
        name: "Proof of Address",
        type: "agentic",
        description: "Address validation against utility, government and credit bureau sources.",
      },
      {
        id: "p-2-3",
        name: "Enhanced Identity Verification",
        type: "human",
        description:
          "High-risk identity scenarios — non-standard IDs, mismatches, manual KYC review.",
        agentBlueprint: {
          summary:
            "Enhanced Identity Triage Agent that pre-investigates non-standard cases and prepares a recommendation pack for the analyst.",
          capabilities: [
            "Cross-reference ID across multiple bureaus and document libraries",
            "Detect document tampering and synthetic identity patterns",
            "Summarise mismatches with proposed resolution and confidence",
          ],
          inputs: ["ID documents", "Biometric capture", "Bureau & registry APIs", "Prior cases"],
          risks: ["Synthetic identity", "Document fraud", "Sanctioned individual"],
          targetMaturity: "L3",
        },
      },
    ],
  },
  {
    id: "stage-3",
    number: 3,
    name: "Business Verification",
    processes: [
      {
        id: "p-3-1",
        name: "Business Registration Documents",
        type: "agentic",
        description: "Verifying company registration, certificates and trading status.",
      },
      {
        id: "p-3-2",
        name: "Company Structure Documentation",
        type: "agentic",
        description: "Extracting and validating articles, share register and structure docs.",
      },
      {
        id: "p-3-3",
        name: "Sole Trader Business Verification",
        type: "agentic",
        description:
          "Validates sole-trader trading evidence, HMRC artefacts and self-employment status.",
      },
      {
        id: "p-3-4",
        name: "Web Presence & Search Verification",
        type: "agentic",
        description:
          "Open-web search for business name, website, news and digital footprint cross-checks.",
      },
      {
        id: "p-3-5",
        name: "Google Maps & Premises Check",
        type: "agentic",
        description:
          "Google Maps / Street View lookup to validate trading premises, signage and location plausibility.",
      },
      {
        id: "p-3-6",
        name: "Trusted Sites & Registry Cross-Check",
        type: "agentic",
        description:
          "Cross-checks against trusted sources (Companies House, FCA, HMRC, trade bodies, regulator lists).",
      },
      {
        id: "p-3-7",
        name: "Plausibility Assessment",
        type: "agentic",
        description:
          "Triangulates documents, web, maps and registries to score whether the business plausibly operates as declared.",
      },
      {
        id: "p-3-8",
        name: "Business Plan Review",
        type: "human",
        description:
          "Analyst review of business model, expected activity and onboarding rationale.",
        agentBlueprint: {
          summary:
            "Business Plan Review Agent that reads the plan, extracts the model, expected flows and sector risk, and produces a structured analyst brief.",
          capabilities: [
            "Extract business model, products and customer base from plan",
            "Estimate expected turnover and transaction profile",
            "Flag sector-specific risk indicators (cash, crypto, cross-border)",
          ],
          inputs: ["Business plan", "Website content", "Sector risk taxonomy", "Peer benchmarks"],
          risks: ["Misstated activity", "High-risk sector", "Inconsistent expected flow"],
          targetMaturity: "L3",
        },
      },
    ],
  },
  {
    id: "stage-4",
    number: 4,
    name: "Ownership Structure",
    processes: [
      {
        id: "p-4-1",
        name: "Simple Ownership Verification",
        type: "agentic",
        description: "Sole trader / single-owner ownership validation.",
      },
      {
        id: "p-4-2",
        name: "Director Verification",
        type: "agentic",
        description: "Director identity, history and risk pattern checks.",
      },
      {
        id: "p-4-3",
        name: "Beneficial Owner Identification",
        type: "agentic",
        description: "PSC / UBO identification and percentage ownership analysis.",
      },
      {
        id: "p-4-4",
        name: "Complex Ownership Structure Mapping",
        type: "human",
        description:
          "Mapping layered entities, parent companies, trusts and cross-border structures.",
        agentBlueprint: {
          summary:
            "Complex Ownership Mapping Agent that builds a graph of entities, owners and control links, and highlights opaque structures for the analyst.",
          capabilities: [
            "Build ownership graph from registries and filings",
            "Highlight circular ownership, nominees and trust layers",
            "Quantify control percentages and ultimate beneficial control",
          ],
          inputs: ["Registry filings", "Trust deeds", "Group structure charts", "Sanction lists"],
          risks: ["Hidden UBO", "Sanctioned ownership", "Shell entity layering"],
          targetMaturity: "L3",
        },
      },
    ],
  },
  {
    id: "stage-5",
    number: 5,
    name: "Financial Due Diligence",
    processes: [
      {
        id: "p-5-1",
        name: "Basic Credit Check",
        type: "agentic",
        description: "Standard credit bureau lookups and scoring.",
      },
      {
        id: "p-5-2",
        name: "Cash Handling Assessment",
        type: "human",
        description:
          "Analyst review of cash-intensive activity, expected volume and rationale.",
        agentBlueprint: {
          summary:
            "Cash Activity Agent that estimates expected cash usage from sector, peers and declared activity, and produces a structured cash risk profile.",
          capabilities: [
            "Estimate expected cash ratio from sector and peers",
            "Compare declared cash vs benchmark",
            "Flag inconsistencies for analyst review",
          ],
          inputs: ["Sector benchmarks", "Customer declarations", "Peer transaction data"],
          risks: ["Unjustified cash", "Sector misstatement"],
          targetMaturity: "L2",
        },
      },
      {
        id: "p-5-3",
        name: "Enhanced Source of Wealth Investigation",
        type: "human",
        description:
          "Deep review of source of wealth for high-risk customers and PEPs.",
        agentBlueprint: {
          summary:
            "Source of Wealth Investigation Agent that gathers evidence, reconstructs wealth narrative and surfaces gaps to the analyst.",
          capabilities: [
            "Reconstruct wealth narrative across years",
            "Reconcile declared wealth with public evidence",
            "Surface unexplained increments and missing evidence",
          ],
          inputs: ["Customer disclosures", "Public records", "Media", "Asset registries"],
          risks: ["Unexplained wealth", "Tax evasion", "Corruption proceeds"],
          targetMaturity: "L3",
        },
      },
      {
        id: "p-5-4",
        name: "Source of Funds Verification",
        type: "agentic",
        description: "Verifying source of funds against declared evidence and expected flows.",
      },
      {
        id: "p-5-5",
        name: "Company Financial Review",
        type: "agentic",
        description: "Reading accounts, turnover and balance sheet indicators.",
      },
    ],
  },
  {
    id: "stage-6",
    number: 6,
    name: "Risk Assessment",
    processes: [
      {
        id: "p-6-1",
        name: "Adverse Media Checks",
        type: "agentic",
        description: "Adverse media search, summarisation and risk classification.",
      },
      {
        id: "p-6-2",
        name: "Enhanced PEP Due Diligence",
        type: "human",
        description: "Enhanced review of PEPs, role, jurisdiction and corruption exposure.",
        agentBlueprint: {
          summary:
            "Enhanced PEP DD Agent that builds a full PEP profile, exposure analysis and recommended controls.",
          capabilities: [
            "Profile role, jurisdiction and tenure",
            "Map associates and connected parties",
            "Recommend EDD controls and ongoing monitoring",
          ],
          inputs: ["PEP databases", "Sanction lists", "Adverse media", "Government registries"],
          risks: ["Bribery", "Sanctions exposure", "State capture"],
          targetMaturity: "L3",
        },
      },
      {
        id: "p-6-3",
        name: "PEP Screening",
        type: "agentic",
        description: "Initial PEP screening across global lists.",
      },
      {
        id: "p-6-4",
        name: "Foreign Jurisdiction Risk Assessment",
        type: "human",
        description: "Country / jurisdiction risk scoring with qualitative overlay.",
        agentBlueprint: {
          summary:
            "Jurisdiction Risk Agent that combines country indices, sector exposure and entity footprint into a structured score with rationale.",
          capabilities: [
            "Combine FATF, Basel and corruption indices",
            "Score entity footprint across jurisdictions",
            "Surface red-flag jurisdictions with rationale",
          ],
          inputs: ["FATF / Basel data", "Entity footprint", "Sanction maps"],
          risks: ["High-risk jurisdiction", "Sanctioned territory"],
          targetMaturity: "L3",
        },
      },
      {
        id: "p-6-5",
        name: "Sanctions Screening",
        type: "agentic",
        description: "Sanctions screening, false-positive triage and evidence trail.",
      },
      {
        id: "p-6-6",
        name: "Standard AML Risk Assessment",
        type: "agentic",
        description: "Aggregating risk factors into the AML risk view.",
      },
    ],
  },
  {
    id: "stage-7",
    number: 7,
    name: "Transaction Monitoring",
    processes: [
      {
        id: "p-7-1",
        name: "Standard Monitoring",
        type: "agentic",
        description: "Baseline transaction monitoring against expected behaviour.",
      },
      {
        id: "p-7-2",
        name: "Enhanced Monitoring",
        type: "human",
        description: "Analyst-led enhanced monitoring for high-risk customers.",
        agentBlueprint: {
          summary:
            "Enhanced Monitoring Agent that prioritises alerts, links related cases and prepares an investigation pack.",
          capabilities: [
            "Cluster related alerts and entities",
            "Score alert severity with explainability",
            "Prepare investigation pack with timeline",
          ],
          inputs: ["Alert engine", "KYC profile", "Network graph", "External signals"],
          risks: ["Layering", "Smurfing", "Shell-company flow"],
          targetMaturity: "L4",
        },
      },
      {
        id: "p-7-3",
        name: "Foreign Transaction Monitoring",
        type: "agentic",
        description: "Cross-border flow monitoring and anomaly detection.",
      },
    ],
  },
]

/* -------------------------------------------------------------------------- */
/*  Agents                                                                     */
/* -------------------------------------------------------------------------- */

export const initialAgents: Agent[] = [
  /* ---------- Common reusable agents ---------- */
  {
    id: "agent-common-1",
    scope: "common",
    name: "OpsMate Agent",
    function: "SOP, policy and document guidance for analysts",
    maturity: "L1",
    tasks: [
      "Answer SOP and policy questions in natural language",
      "Surface the right control for the case in front of the analyst",
      "Cite the source paragraph in policy / SOP",
    ],
    inputs: ["SOP library", "Policy documents", "Internal knowledge base"],
    outputs: ["Inline answer", "Cited source", "Suggested next action"],
  },
  {
    id: "agent-common-2",
    scope: "common",
    name: "Policy-to-Rule Agent",
    function: "Converts policy requirements into rule logic and checklist controls",
    maturity: "L3",
    tasks: [
      "Parse policy clauses into structured requirements",
      "Generate rule logic and case checklist items",
      "Track policy version → rule mapping",
    ],
    inputs: ["Policy library", "Existing rules engine"],
    outputs: ["Rule definitions", "Checklist controls", "Policy traceability"],
  },
  {
    id: "agent-common-3",
    scope: "common",
    name: "Nudge Agent",
    function: "Sends reminders, follow-ups and missing information prompts",
    maturity: "L4",
    tasks: [
      "Detect missing or ageing items on a case",
      "Send tailored nudge to customer or analyst",
      "Track response and escalate on SLA breach",
    ],
    inputs: ["Case state", "SLA matrix", "Comms templates"],
    outputs: ["Nudge messages", "Escalation events"],
  },
  {
    id: "agent-common-4",
    scope: "common",
    name: "QC Agent",
    function: "Reviews case quality, evidence completeness and decision consistency",
    maturity: "L2",
    tasks: [
      "Check evidence completeness against control list",
      "Spot decision inconsistencies vs similar cases",
      "Flag QC issues before sign-off",
    ],
    inputs: ["Case file", "Decision history", "Control library"],
    outputs: ["QC report", "Re-work flags"],
  },

  /* ---------- Stage 1: Application Submission ---------- */
  {
    id: "agent-1-1",
    scope: "stage",
    stageId: "stage-1",
    name: "Customer & Ops Comms Agent",
    function:
      "Drafts, triages and sends all customer and ops communications across the case lifecycle",
    maturity: "L3",
    tasks: [
      "Draft outbound emails / chat for analyst review",
      "Triage inbound customer responses to the right case",
      "Auto-classify intent (info request, complaint, escalation)",
      "Maintain a single threaded conversation per case",
    ],
    inputs: ["Case state", "Comms templates", "Customer history", "Inbound channels"],
    outputs: ["Draft messages", "Threaded conversation", "Intent labels"],
  },
  {
    id: "agent-1-2",
    scope: "stage",
    stageId: "stage-1",
    name: "Case Allocation Agent",
    function:
      "Routes new cases to the right analyst pool and escalates risk or SLA breaches",
    maturity: "L3",
    tasks: [
      "Score case complexity and risk on intake",
      "Route to the right analyst pool (SME, complex, EDD)",
      "Detect SLA breach risk and escalate proactively",
      "Re-balance load across analysts",
    ],
    inputs: ["Case attributes", "Analyst skills matrix", "Workload", "SLA rules"],
    outputs: ["Routing decision", "Escalation event", "Workload metrics"],
  },

  /* ---------- Stage 2: Identity ---------- */
  {
    id: "agent-2-1",
    scope: "stage",
    stageId: "stage-2",
    name: "ID Verification Agent",
    function: "Validates ID documents, biometrics and registry matches end-to-end",
    maturity: "L4",
    tasks: [
      "Validate document type, format and issuer",
      "Run biometric match and liveness check",
      "Cross-reference registry / bureau data",
      "Generate evidence pack with confidence score",
    ],
    inputs: ["ID document", "Selfie / biometric", "Bureau APIs", "Registry data"],
    outputs: ["ID decision", "Confidence score", "Evidence pack"],
  },
  {
    id: "agent-2-2",
    scope: "stage",
    stageId: "stage-2",
    name: "Proof of Address Agent",
    function: "Checks address evidence against trusted sources and detects mismatches",
    maturity: "L3",
    tasks: [
      "Extract address from utility / bank evidence",
      "Match against electoral / postal databases",
      "Flag mismatches and stale evidence",
    ],
    inputs: ["Address documents", "Postal / electoral databases"],
    outputs: ["Match result", "Mismatch flags"],
  },

  /* ---------- Stage 3: Business Verification ---------- */
  {
    id: "agent-3-1",
    scope: "stage",
    stageId: "stage-3",
    name: "Business Verification Agent",
    function:
      "Checks company registration, trading status, SIC, VAT and registry evidence",
    maturity: "L3",
    tasks: [
      "Pull live company registry data",
      "Validate trading status, SIC, VAT, filings",
      "Detect dormant / dissolved / restored states",
      "Build evidence pack for analyst",
    ],
    inputs: ["Companies House / equivalents", "VAT registry", "Filings"],
    outputs: ["Verification result", "Evidence pack"],
  },
  {
    id: "agent-3-2",
    scope: "stage",
    stageId: "stage-3",
    name: "Business Plan Review Agent",
    function: "Reviews business model, expected activity, sector risk and rationale",
    maturity: "L2",
    tasks: [
      "Extract model, products, customer base from plan",
      "Estimate expected turnover and transaction profile",
      "Flag sector-specific red flags",
    ],
    inputs: ["Business plan", "Website", "Sector risk taxonomy"],
    outputs: ["Structured analyst brief", "Risk flags"],
  },
  {
    id: "agent-3-3",
    scope: "stage",
    stageId: "stage-3",
    name: "Sole Trader Business Verification Agent",
    function:
      "Validates sole-trader trading evidence, self-employment and identity-to-business linkage",
    maturity: "L3",
    tasks: [
      "Confirm self-employment via HMRC UTR / SA302 / tax records",
      "Match sole trader identity to declared trading name and activity",
      "Validate trading evidence (invoices, bank statements, contracts)",
      "Flag inconsistencies between declared and observed activity",
    ],
    inputs: [
      "HMRC artefacts (UTR, SA302)",
      "Bank statements",
      "Customer declaration",
      "Invoices / contracts",
    ],
    outputs: ["Sole trader validation result", "Trading evidence pack", "Inconsistency flags"],
  },
  {
    id: "agent-3-4",
    scope: "stage",
    stageId: "stage-3",
    name: "Web Search Agent",
    function:
      "Performs open-web search to verify the business exists, is trading and matches declarations",
    maturity: "L2",
    tasks: [
      "Search for company name, brand and trading aliases across the open web",
      "Crawl official website and validate ownership and activity claims",
      "Pull recent news, reviews and adverse coverage",
      "Score digital footprint plausibility vs. declared size and sector",
    ],
    inputs: [
      "Company name / aliases",
      "Declared website",
      "News and review sources",
      "Search APIs",
    ],
    outputs: ["Digital footprint dossier", "Adverse media flags", "Plausibility score"],
  },
  {
    id: "agent-3-5",
    scope: "stage",
    stageId: "stage-3",
    name: "Google Maps & Premises Agent",
    function:
      "Uses Google Maps and Street View to validate trading premises and physical plausibility",
    maturity: "L2",
    tasks: [
      "Locate registered and trading address on Google Maps",
      "Inspect Street View for signage, condition and business type",
      "Detect virtual offices, residential lets and shared mail-drops",
      "Cross-check opening hours and reviews",
    ],
    inputs: ["Registered address", "Trading address", "Google Maps / Street View"],
    outputs: ["Premises validation", "Address-type classification", "Visual evidence pack"],
  },
  {
    id: "agent-3-6",
    scope: "stage",
    stageId: "stage-3",
    name: "Trusted Sources Agent",
    function:
      "Cross-checks the business against trusted registries, regulators and trade bodies",
    maturity: "L3",
    tasks: [
      "Query Companies House, FCA, HMRC and equivalent registries",
      "Match against trade body memberships and licensing schemes",
      "Check sanctions, PEP and watchlist databases",
      "Aggregate trust signals into a unified evidence pack",
    ],
    inputs: [
      "Companies House",
      "FCA register",
      "HMRC lists",
      "Trade bodies",
      "Sanctions / PEP feeds",
    ],
    outputs: ["Trusted-source evidence pack", "Regulatory flags", "Sanctions / PEP hits"],
  },
  {
    id: "agent-3-7",
    scope: "stage",
    stageId: "stage-3",
    name: "Plausibility Agent",
    function:
      "Triangulates documents, web, maps and registries to score whether the business plausibly operates as declared",
    maturity: "L3",
    tasks: [
      "Aggregate signals from registry, web, maps and document agents",
      "Detect contradictions between declared and observed activity",
      "Score plausibility across identity, premises, activity and scale",
      "Produce explainable plausibility verdict for analyst",
    ],
    inputs: [
      "Business Verification Agent output",
      "Web Search Agent output",
      "Google Maps Agent output",
      "Trusted Sources Agent output",
      "Customer declarations",
    ],
    outputs: [
      "Plausibility score (identity / premises / activity / scale)",
      "Contradiction report",
      "Explainable verdict",
    ],
  },

  /* ---------- Stage 4: Ownership ---------- */
  {
    id: "agent-4-1",
    scope: "stage",
    stageId: "stage-4",
    name: "Sole Trader Agent",
    function: "Validates sole trader profile, trading evidence and identity link",
    maturity: "L3",
    tasks: [
      "Link sole trader identity to trading evidence",
      "Validate self-employment and HMRC artefacts",
      "Confirm activity matches declarations",
    ],
    inputs: ["HMRC evidence", "Bank flows", "Customer declaration"],
    outputs: ["Validation result", "Evidence summary"],
  },
  {
    id: "agent-4-2",
    scope: "stage",
    stageId: "stage-4",
    name: "Director Verification Agent",
    function: "Checks directors, appointment history, active companies and risk patterns",
    maturity: "L3",
    tasks: [
      "Pull director appointment history",
      "Detect serial director / shell-pattern signals",
      "Cross-check sanctions and adverse media",
    ],
    inputs: ["Registry data", "Sanctions lists", "Adverse media"],
    outputs: ["Director risk profile", "Pattern flags"],
  },
  {
    id: "agent-4-3",
    scope: "stage",
    stageId: "stage-4",
    name: "Beneficial Ownership Agent",
    function: "Identifies PSCs, ownership percentages and control logic",
    maturity: "L3",
    tasks: [
      "Identify PSCs and ownership %",
      "Reconcile declared vs registry UBO",
      "Compute ultimate beneficial control",
    ],
    inputs: ["PSC register", "Declarations", "Group structure"],
    outputs: ["UBO list", "Control map"],
  },
  {
    id: "agent-4-4",
    scope: "stage",
    stageId: "stage-4",
    name: "Complex Ownership Mapping Agent",
    function: "Maps layered entities, parent companies, trusts and cross-border structures",
    maturity: "L2",
    tasks: [
      "Build ownership graph across jurisdictions",
      "Highlight circular ownership, nominees, trusts",
      "Quantify control across layers",
    ],
    inputs: ["Filings", "Trust deeds", "Sanctions maps"],
    outputs: ["Ownership graph", "Opacity flags"],
  },
  {
    id: "agent-4-5",
    scope: "stage",
    stageId: "stage-4",
    name: "Customer Activity Agent",
    function: "Compares expected customer activity with business type and ownership profile",
    maturity: "L2",
    tasks: [
      "Build expected activity profile from segment",
      "Compare against declared activity",
      "Flag inconsistencies for review",
    ],
    inputs: ["Segment data", "Declarations", "Peer activity"],
    outputs: ["Expected profile", "Mismatch flags"],
  },

  /* ---------- Stage 5: Financial DD ---------- */
  {
    id: "agent-5-1",
    scope: "stage",
    stageId: "stage-5",
    name: "Source of Funds Agent",
    function: "Reviews declared SoF against evidence and transaction expectations",
    maturity: "L3",
    tasks: [
      "Reconcile declared SoF with evidence",
      "Compare against expected flows",
      "Surface unexplained funding",
    ],
    inputs: ["SoF declaration", "Evidence docs", "Expected flow profile"],
    outputs: ["SoF assessment", "Gap list"],
  },
  {
    id: "agent-5-2",
    scope: "stage",
    stageId: "stage-5",
    name: "Financial Analysis Agent",
    function: "Reads accounts, turnover, balance sheet and financial health",
    maturity: "L3",
    tasks: [
      "Parse statutory accounts",
      "Compute key ratios and trend",
      "Flag financial health concerns",
    ],
    inputs: ["Accounts", "Bureau data", "Sector benchmarks"],
    outputs: ["Financial health view", "Ratio dashboard"],
  },

  /* ---------- Stage 6: Risk ---------- */
  {
    id: "agent-6-1",
    scope: "stage",
    stageId: "stage-6",
    name: "Adverse Media Agent",
    function: "Searches and summarises negative media, fraud, litigation and reputational signals",
    maturity: "L3",
    tasks: [
      "Search global media in multiple languages",
      "Summarise hits with relevance",
      "De-duplicate and link to entity",
    ],
    inputs: ["News feeds", "Litigation databases", "Translation"],
    outputs: ["Adverse media summary", "Source links"],
  },
  {
    id: "agent-6-2",
    scope: "stage",
    stageId: "stage-6",
    name: "PEP Due Diligence Agent",
    function: "Reviews PEP exposure, role, jurisdiction and required enhanced checks",
    maturity: "L2",
    tasks: [
      "Profile PEP role and tenure",
      "Map close associates",
      "Recommend EDD controls",
    ],
    inputs: ["PEP databases", "Government registers", "Adverse media"],
    outputs: ["PEP profile", "EDD recommendation"],
  },
  {
    id: "agent-6-3",
    scope: "stage",
    stageId: "stage-6",
    name: "Sanctions Screening Agent",
    function: "Checks sanctions hits, false positives and evidence trail",
    maturity: "L4",
    tasks: [
      "Run sanctions screening across global lists",
      "Resolve false positives",
      "Maintain auditable evidence trail",
    ],
    inputs: ["Sanctions lists", "Match engine", "Customer profile"],
    outputs: ["Screening result", "Audit trail"],
  },
  {
    id: "agent-6-4",
    scope: "stage",
    stageId: "stage-6",
    name: "AML Risk Assessment Agent",
    function: "Combines risk factors into a structured AML risk view",
    maturity: "L3",
    tasks: [
      "Aggregate risk factors with weighting",
      "Produce structured AML risk view",
      "Recommend tier and controls",
    ],
    inputs: ["Risk factors", "Policy weights"],
    outputs: ["AML risk tier", "Control recommendation"],
  },

  /* ---------- Stage 7: TM ---------- */
  {
    id: "agent-7-1",
    scope: "stage",
    stageId: "stage-7",
    name: "Transaction Monitoring Agent",
    function: "Sets expected behaviour baseline and identifies post-onboarding anomalies",
    maturity: "L4",
    tasks: [
      "Build expected behaviour baseline",
      "Detect anomalies and risk patterns",
      "Cluster related alerts",
    ],
    inputs: ["Transactions", "KYC profile", "Network graph"],
    outputs: ["Alerts", "Pattern clusters"],
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
  primary: string
  accent: string
  agentic: string
  human: string
  common: string
  stage: string
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
