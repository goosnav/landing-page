/*
 * APERTURE — B2B REVENUE INTELLIGENCE PLATFORM
 * SAFE TO EDIT: question copy, option labels, range inputs, assumptions text
 * EDIT WITH CARE: branching ids, service ids, and allowed question types drive core quote logic
 */

window.SiteTemplate = window.SiteTemplate || {};
window.SiteTemplate.config = window.SiteTemplate.config || {};

window.SiteTemplate.config.quote = {
  experience: {
    pageIntro: {
      eyebrow: "Sizing tool",
      title: "Get a custom quote for your revenue team.",
      body:
        "A short sequence of questions about your team, your stack, and your forecast cycle. You'll see a directional quote, recommended deployment tier, and a working session with a solutions architect."
    },
    title: "Aperture Sizing Tool",
    intro:
      "Answer ten quick questions about your revenue motion. We'll size the right deployment tier and estimate annual contract value before you talk to a sales person.",
    estimatedDurationText: "Usually 3 to 5 minutes",
    startLabel: "Start the Sizing Tool"
  },
  supportedQuestionTypes: [
    "single-select",
    "radio",
    "checkbox-group",
    "dropdown",
    "number",
    "short-text",
    "yes-no",
    "date",
    "textarea"
  ],
  questions: [
    {
      id: "engagementGoal",
      visible: true,
      order: 10,
      type: "single-select",
      title: "What is the primary outcome you need from Aperture?",
      helpText: "Pick the option that best matches the reason you're evaluating us today.",
      required: true,
      options: [
        { label: "Replace a forecast spreadsheet that no one trusts", value: "stabilize" },
        { label: "Modernize the revenue stack across multiple teams", value: "modernize" },
        { label: "Scale forecast and risk visibility across a 200+ seller org", value: "scale" }
      ],
      nextQuestionRule: { defaultNextId: "teamSize" },
      answerKey: "engagementGoal",
      affectsEstimate: true,
      affectsScope: true,
      adminNotes: "Primary demand signal"
    },
    {
      id: "teamSize",
      visible: true,
      order: 20,
      type: "radio",
      title: "How many sellers and CSMs will use Aperture?",
      helpText: "Count quota-carrying sellers, sales engineers, customer success managers, and revenue operations.",
      required: true,
      options: [
        { label: "1 to 25", value: "team_1_10" },
        { label: "26 to 75", value: "team_11_50" },
        { label: "76 to 200", value: "team_51_200" },
        { label: "200+", value: "team_200_plus" }
      ],
      nextQuestionRule: { defaultNextId: "activeClients" },
      answerKey: "teamSize",
      affectsEstimate: true,
      affectsScope: true
    },
    {
      id: "activeClients",
      visible: true,
      order: 30,
      type: "number",
      title: "How many active opportunities are typically in your pipeline?",
      helpText: "A rough number is fine — we use this to size the workspace and forecast model complexity.",
      placeholder: "Example: 320",
      required: true,
      validationRule: {
        min: 1,
        max: 100000,
        message: "Enter a number greater than zero."
      },
      nextQuestionRule: { defaultNextId: "deliveryModel" },
      answerKey: "activeClients",
      affectsEstimate: true,
      affectsScope: true
    },
    {
      id: "deliveryModel",
      visible: true,
      order: 40,
      type: "dropdown",
      title: "Which deployment tier are you leaning toward?",
      helpText: "Pick the option closest to your team. The recommendation engine will adjust if your other answers point elsewhere.",
      required: true,
      options: [
        { label: "Starter — self-serve onboarding", value: "advisory_only" },
        { label: "Growth — dedicated 2-week implementation", value: "sprint_program" },
        { label: "Enterprise — single-tenant with named CSE", value: "embedded_partner" }
      ],
      nextQuestionRule: { defaultNextId: "timeline" },
      answerKey: "deliveryModel",
      affectsEstimate: true,
      affectsScope: true
    },
    {
      id: "timeline",
      visible: true,
      order: 50,
      type: "radio",
      title: "When do you need Aperture in production?",
      required: true,
      options: [
        { label: "This month", value: "immediate" },
        { label: "This quarter", value: "this_quarter" },
        { label: "Next quarter or later", value: "later" }
      ],
      nextQuestionRule: {
        defaultNextId: "needsCompliance",
        conditions: [
          {
            if: { operator: "equals", answerKey: "timeline", value: "immediate" },
            nextId: "targetStartDate"
          }
        ]
      },
      answerKey: "timeline",
      affectsEstimate: true,
      affectsScope: false
    },
    {
      id: "targetStartDate",
      visible: true,
      order: 60,
      type: "date",
      title: "What's the target go-live date?",
      helpText: "Used for solutions architect scheduling and implementation planning.",
      required: true,
      nextQuestionRule: { defaultNextId: "needsCompliance" },
      answerKey: "targetStartDate",
      affectsEstimate: false,
      affectsScope: false
    },
    {
      id: "needsCompliance",
      visible: true,
      order: 70,
      type: "yes-no",
      title: "Do you have specific security or compliance requirements?",
      helpText: "Most enterprise procurement does. Examples: SOC 2 review, single-tenant isolation, regional data residency.",
      required: true,
      nextQuestionRule: {
        defaultNextId: "primaryConstraint",
        conditions: [
          {
            if: { operator: "equals", answerKey: "needsCompliance", value: true },
            nextId: "complianceFocus"
          }
        ]
      },
      answerKey: "needsCompliance",
      affectsEstimate: true,
      affectsScope: true
    },
    {
      id: "complianceFocus",
      visible: true,
      order: 80,
      type: "checkbox-group",
      title: "Which areas matter most?",
      helpText: "Select all that apply.",
      required: true,
      options: [
        { label: "SOC 2, ISO 27001, or other audit evidence", value: "documentation" },
        { label: "SSO, SCIM, and access controls", value: "security" },
        { label: "Single-tenant or regional data residency", value: "vendor" }
      ],
      nextQuestionRule: { defaultNextId: "primaryConstraint" },
      answerKey: "complianceFocus",
      affectsEstimate: true,
      affectsScope: true
    },
    {
      id: "primaryConstraint",
      visible: true,
      order: 90,
      type: "radio",
      title: "What's the biggest pain in your current forecast cycle?",
      required: true,
      options: [
        { label: "Capacity planning and quota coverage", value: "capacity" },
        { label: "Forecast accuracy and exec credibility", value: "reporting" },
        { label: "Pipeline hygiene and stage definitions", value: "service_design" },
        { label: "Cross-team alignment between sales, CS, and finance", value: "alignment" }
      ],
      nextQuestionRule: { defaultNextId: "initiativeLabel" },
      answerKey: "primaryConstraint",
      affectsEstimate: true,
      affectsScope: true
    },
    {
      id: "initiativeLabel",
      visible: true,
      order: 100,
      type: "short-text",
      title: "Optional: what does your team call this project internally?",
      placeholder: "Example: FY27 Forecast Reset",
      required: false,
      nextQuestionRule: { defaultNextId: "additionalContext" },
      answerKey: "initiativeLabel",
      affectsEstimate: false,
      affectsScope: false
    },
    {
      id: "additionalContext",
      visible: true,
      order: 110,
      type: "textarea",
      title: "Anything else we should know?",
      placeholder: "Existing tools, board pressure, integration requirements, or stakeholders to involve",
      required: false,
      nextQuestionRule: { defaultNextId: null },
      answerKey: "additionalContext",
      affectsEstimate: false,
      affectsScope: true
    }
  ],
  tierOrder: ["diagnostic", "program", "partner"],
  recommendationModel: {
    baseTierByDeliveryModel: {
      advisory_only: "diagnostic",
      sprint_program: "program",
      embedded_partner: "partner"
    },
    minimumTierByGoal: {
      stabilize: "diagnostic",
      modernize: "program",
      scale: "partner"
    },
    minimumTierByTeamSize: {
      team_1_10: "diagnostic",
      team_11_50: "diagnostic",
      team_51_200: "program",
      team_200_plus: "partner"
    },
    activeClientThresholds: [
      { minimum: 100, tier: "program" },
      { minimum: 500, tier: "partner" }
    ],
    urgencyTierUpgrades: {
      immediate: 1,
      this_quarter: 0,
      later: 0
    },
    complianceTierUpgrade: 1,
    primaryConstraintTierHints: {
      capacity: "program",
      reporting: "diagnostic",
      service_design: "program",
      alignment: "partner"
    }
  },
  estimateModel: {
    baseRanges: {
      diagnostic: [22000, 38000],
      program: [60000, 110000],
      partner: [150000, 280000]
    },
    rangeModifiers: {
      teamSize: {
        team_1_10: [0, 0],
        team_11_50: [8000, 16000],
        team_51_200: [22000, 38000],
        team_200_plus: [40000, 75000]
      },
      activeClients: [
        { minimum: 1, range: [0, 0] },
        { minimum: 100, range: [5000, 10000] },
        { minimum: 500, range: [12000, 22000] },
        { minimum: 2000, range: [22000, 40000] }
      ],
      timeline: {
        immediate: [10000, 18000],
        this_quarter: [4000, 9000],
        later: [0, 0]
      },
      needsCompliance: {
        true: [12000, 22000],
        false: [0, 0]
      },
      complianceFocus: {
        documentation: [3000, 7000],
        security: [5000, 10000],
        vendor: [8000, 18000]
      },
      primaryConstraint: {
        capacity: [6000, 12000],
        reporting: [4000, 8000],
        service_design: [5000, 12000],
        alignment: [8000, 16000]
      }
    }
  },
  scopeTemplates: {
    diagnostic: {
      recommendedLabel: "Aperture Starter",
      scopeSummary:
        "Aperture Starter for revenue teams retiring spreadsheet forecasts. Self-serve onboarding plus a guided solutions engineer session to validate the forecast model.",
      breakdown: [
        "Aperture pipeline and forecast workspace",
        "Salesforce or HubSpot connector",
        "Standard deal-risk and engagement scoring model",
        "SSO via SAML and basic audit log",
        "Onboarding session with a solutions engineer"
      ],
      assumptions: [
        "Your CRM is Salesforce or HubSpot and admin access is available.",
        "Forecast model can be calibrated against the last two closed quarters."
      ]
    },
    program: {
      recommendedLabel: "Aperture Growth",
      scopeSummary:
        "Aperture Growth for B2B revenue orgs scaling across multiple segments. Tunable scoring, native integrations across the revenue stack, and a dedicated solutions architect implementation.",
      breakdown: [
        "Aperture pipeline workspace for the full revenue org",
        "All native connectors (CRM, warehouse, conversation intelligence, sales engagement, Slack)",
        "Tunable deal-risk and engagement model",
        "Custom executive dashboards and forecast roll-ups",
        "Dedicated solutions architect implementation"
      ],
      assumptions: [
        "A revenue operations sponsor is available for working sessions during the implementation window.",
        "Your data warehouse has at least 12 months of pipeline history available."
      ]
    },
    partner: {
      recommendedLabel: "Aperture Enterprise",
      scopeSummary:
        "Aperture Enterprise for late-stage and public-company revenue orgs. Single-tenant deployment, custom data science, embedded customer success engineering, and 24/7 named support.",
      breakdown: [
        "Single-tenant deployment with regional data residency",
        "All connectors plus customer-built integrations",
        "Custom data science and bespoke forecast models",
        "SSO + SCIM + immutable audit log + tenant isolation",
        "24/7 support with named customer success engineer",
        "Quarterly executive business reviews"
      ],
      assumptions: [
        "Procurement, security, and legal review windows are scheduled in parallel.",
        "Executive sponsors will participate in quarterly business reviews."
      ]
    }
  },
  conditionalScopeAdditions: {
    needsCompliance: {
      true: [
        "Security review package and SOC 2 evidence walkthrough"
      ]
    },
    complianceFocus: {
      documentation: [
        "Audit evidence collection and customer-side compliance reporting"
      ],
      security: [
        "SSO, SCIM, and granular role-based access control configuration"
      ],
      vendor: [
        "Single-tenant deployment, regional data residency, and BYO key management"
      ]
    },
    primaryConstraint: {
      capacity: [
        "Capacity model and quota coverage analysis"
      ],
      reporting: [
        "Executive forecast roll-up and dashboard configuration"
      ],
      service_design: [
        "Pipeline stage and forecast category redesign"
      ],
      alignment: [
        "Cross-functional cadence: sales, customer success, and finance integration"
      ]
    }
  },
  nextStepTemplates: {
    diagnostic: [
      "Confirm CRM admin access and a target go-live date.",
      "Schedule a 30-minute working session with an Aperture solutions engineer.",
      "Receive a written quote and self-serve onboarding link after the session."
    ],
    program: [
      "Schedule a working session with a solutions architect to validate the deployment plan.",
      "Confirm the executive sponsor and the data warehouse access path.",
      "Receive a written commercial proposal and an implementation calendar."
    ],
    partner: [
      "Schedule a discovery call with a senior account executive and a solutions architect.",
      "Kick off the security and procurement review in parallel with the technical scoping.",
      "Receive a master subscription agreement draft tailored to your data residency and SLA requirements."
    ]
  },
  resultLabels: {
    estimateRange: "Estimated Annual Contract Value",
    recommendedTier: "Recommended Plan",
    breakdown: "What's included",
    assumptions: "Assumptions",
    nextSteps: "Next Steps",
    disclaimer:
      "This is a directional estimate based on the information you provided. Final pricing depends on contract length, deployment scope, and integration complexity. A solutions architect will confirm the number on a working call."
  },
  leadGate: {
    heading: "One last step before we show your quote",
    body:
      "Tell us who to send the quote to. Aperture's sales team will follow up only to schedule a working session — no marketing nurture spam.",
    submitLabel: "Show My Quote",
    nameLabel: "Full name",
    companyLabel: "Company",
    emailLabel: "Work email",
    phoneLabel: "Phone (optional)",
    nameOrCompanyMessage: "Provide either a name or a company.",
    emailOrPhoneMessage: "Provide either an email or a phone number."
  },
  download: {
    fileNamePrefix: "aperture-quote",
    title: "Aperture Quote Summary"
  }
};
