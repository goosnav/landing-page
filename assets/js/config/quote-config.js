/*
 * ENTERPRISE STATIC SERVICE SITE TEMPLATE
 * SAFE TO EDIT: question copy, option labels, range inputs, assumptions text
 * EDIT WITH CARE: branching ids, service ids, and allowed question types drive core quote logic
 */

window.SiteTemplate = window.SiteTemplate || {};
window.SiteTemplate.config = window.SiteTemplate.config || {};

window.SiteTemplate.config.quote = {
  experience: {
    title: "Guided Estimate",
    intro:
      "Answer a short sequence of questions to receive a directional range, recommended engagement tier, and the most sensible next step.",
    estimatedDurationText: "Usually 3 to 5 minutes",
    startLabel: "Start the Quote"
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
      title: "What is the main outcome you need?",
      helpText: "Pick the option that best matches the primary driver behind this request.",
      required: true,
      options: [
        { label: "Stabilize delivery", value: "stabilize" },
        { label: "Redesign operations", value: "modernize" },
        { label: "Scale responsibly", value: "scale" }
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
      title: "How large is the delivery organization involved?",
      helpText: "Use the team size most directly affected by the engagement.",
      required: true,
      options: [
        { label: "1 to 10 people", value: "team_1_10" },
        { label: "11 to 50 people", value: "team_11_50" },
        { label: "51 to 200 people", value: "team_51_200" },
        { label: "200+ people", value: "team_200_plus" }
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
      title: "How many active client engagements are in scope?",
      helpText: "A rough number is fine.",
      placeholder: "Example: 28",
      required: true,
      validationRule: {
        min: 1,
        max: 10000,
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
      title: "What level of support do you expect?",
      helpText: "Choose the delivery model that feels closest to the support you need.",
      required: true,
      options: [
        { label: "Advisory project", value: "advisory_only" },
        { label: "Structured program", value: "sprint_program" },
        { label: "Embedded partner support", value: "embedded_partner" }
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
      title: "When does this work need to begin?",
      required: true,
      options: [
        { label: "Immediately", value: "immediate" },
        { label: "This quarter", value: "this_quarter" },
        { label: "Later this year", value: "later" }
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
      title: "What is the target start date?",
      helpText: "Used only for planning context.",
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
      title: "Does the engagement include compliance, audit, or formal control requirements?",
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
      title: "Which control areas matter most?",
      helpText: "Select all that apply.",
      required: true,
      options: [
        { label: "Documentation and evidence trails", value: "documentation" },
        { label: "Security or access controls", value: "security" },
        { label: "Vendor and dependency management", value: "vendor" }
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
      title: "What is the biggest current constraint?",
      required: true,
      options: [
        { label: "Capacity planning", value: "capacity" },
        { label: "Leadership reporting", value: "reporting" },
        { label: "Service design and scoping", value: "service_design" },
        { label: "Cross-team alignment", value: "alignment" }
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
      title: "Optional: what do you call this initiative internally?",
      placeholder: "Example: Delivery operating model reset",
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
      title: "Anything else we should account for?",
      placeholder: "Constraints, deadlines, stakeholders, or important context",
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
      { minimum: 25, tier: "program" },
      { minimum: 80, tier: "partner" }
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
      diagnostic: [18000, 32000],
      program: [48000, 92000],
      partner: [120000, 240000]
    },
    rangeModifiers: {
      teamSize: {
        team_1_10: [0, 0],
        team_11_50: [6000, 12000],
        team_51_200: [18000, 32000],
        team_200_plus: [35000, 60000]
      },
      activeClients: [
        { minimum: 1, range: [0, 0] },
        { minimum: 15, range: [4000, 8000] },
        { minimum: 40, range: [10000, 18000] },
        { minimum: 100, range: [18000, 30000] }
      ],
      timeline: {
        immediate: [12000, 22000],
        this_quarter: [5000, 12000],
        later: [0, 0]
      },
      needsCompliance: {
        true: [10000, 20000],
        false: [0, 0]
      },
      complianceFocus: {
        documentation: [3000, 7000],
        security: [5000, 10000],
        vendor: [4000, 9000]
      },
      primaryConstraint: {
        capacity: [7000, 12000],
        reporting: [4000, 8000],
        service_design: [6000, 14000],
        alignment: [9000, 18000]
      }
    }
  },
  scopeTemplates: {
    diagnostic: {
      recommendedLabel: "Diagnostic Advisory Sprint",
      scopeSummary:
        "A focused diagnostic engagement to establish the operating baseline, isolate risk, and define the corrective plan.",
      breakdown: [
        "Current-state delivery system review",
        "Service packaging and scoping assessment",
        "Leadership reporting and escalation baseline",
        "Prioritized findings and next-step roadmap"
      ],
      assumptions: [
        "Stakeholder access is available during discovery.",
        "Source documents and current delivery materials can be reviewed within the engagement window."
      ]
    },
    program: {
      recommendedLabel: "Transformation Program",
      scopeSummary:
        "A structured redesign program for service operations, leadership controls, and the delivery model itself.",
      breakdown: [
        "Target operating model design",
        "Service tier and quote refinement",
        "Leadership reporting, cadence, and governance setup",
        "Implementation toolkit and rollout support"
      ],
      assumptions: [
        "A designated sponsor can make scope decisions promptly.",
        "Client-facing and internal workflow owners are available for working sessions."
      ]
    },
    partner: {
      recommendedLabel: "Fractional Operations Partner",
      scopeSummary:
        "An embedded advisory model for ongoing governance, decision support, and continuous operating discipline.",
      breakdown: [
        "Recurring executive operating reviews",
        "Cross-functional issue triage and escalation support",
        "Capacity, delivery, and risk monitoring",
        "Quarterly service and control refinement"
      ],
      assumptions: [
        "Leadership wants an ongoing advisor with direct operating visibility.",
        "The engagement includes recurring access to delivery, sales, and executive stakeholders."
      ]
    }
  },
  conditionalScopeAdditions: {
    needsCompliance: {
      true: [
        "Control mapping for audit or compliance-sensitive workflows"
      ]
    },
    complianceFocus: {
      documentation: [
        "Documentation, evidence trail, and approval-path review"
      ],
      security: [
        "Security and access-control workflow review"
      ],
      vendor: [
        "Vendor and dependency governance review"
      ]
    },
    primaryConstraint: {
      capacity: [
        "Capacity model and workload balancing analysis"
      ],
      reporting: [
        "Leadership reporting redesign and dashboard requirements"
      ],
      service_design: [
        "Service scope, packaging, and quote-boundary redesign"
      ],
      alignment: [
        "Cross-team operating cadence and decision-rights alignment"
      ]
    }
  },
  nextStepTemplates: {
    diagnostic: [
      "Confirm the current-state review scope and stakeholder list.",
      "Schedule a working session to validate delivery pain points and operating constraints.",
      "Use the resulting diagnostic to finalize a binding engagement scope if needed."
    ],
    program: [
      "Review the recommended operating workstreams and target sequence.",
      "Confirm sponsor ownership, dependencies, and implementation window.",
      "Book a working session to convert the estimate into a formal program scope."
    ],
    partner: [
      "Validate the leadership cadence, meeting structure, and reporting expectations.",
      "Clarify executive decision rights and escalation boundaries.",
      "Book a planning session to define the first 90-day operating agenda."
    ]
  },
  resultLabels: {
    estimateRange: "Estimated Range",
    recommendedTier: "Recommended Engagement",
    breakdown: "Detailed Scope",
    assumptions: "Assumptions",
    nextSteps: "Suggested Next Steps",
    disclaimer:
      "This output is a directional estimate based on the information provided. Final pricing and scope require a confirmed written engagement."
  },
  leadGate: {
    heading: "One last step before the estimate is revealed",
    body:
      "Provide a minimal contact point so the quote can be tied to a real lead record and followed up responsibly.",
    submitLabel: "Submit and Show Estimate",
    nameLabel: "Full name",
    companyLabel: "Company",
    emailLabel: "Email",
    phoneLabel: "Phone",
    nameOrCompanyMessage: "Provide either a name or a company.",
    emailOrPhoneMessage: "Provide either an email or a phone number."
  },
  download: {
    fileNamePrefix: "northstar-estimate",
    title: "Estimate Summary"
  }
};
