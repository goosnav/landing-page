/*
 * APERTURE — B2B REVENUE INTELLIGENCE PLATFORM
 * SAFE TO EDIT: pricing tiers, feature lists, pricing display, CTA routing
 * EDIT WITH CARE: keep tier ids (diagnostic/program/partner) stable — quote engine references them
 */

window.SiteTemplate = window.SiteTemplate || {};
window.SiteTemplate.config = window.SiteTemplate.config || {};

window.SiteTemplate.config.services = {
  intro: {
    eyebrow: "Plans",
    title: "Three deployment tiers, sized to your revenue motion.",
    body:
      "Aperture meets B2B revenue teams where they are. Each tier includes the full revenue intelligence surface — forecast, deal risk, and account health — and scales on connected systems, seat count, and the depth of executive workflows you turn on."
  },
  pageCta: {
    title: "Not sure which plan fits?",
    body:
      "Use the sizing tool to map team size, ARR band, and integrations into a recommended tier and a directional quote.",
    primaryCta: { label: "Run the Sizing Tool", href: "quote.html" },
    secondaryCta: { label: "Talk to Sales", href: "contact.html" }
  },
  testimonialsHeader: {
    eyebrow: "Customers",
    title: "Used by revenue teams running serious quarterly cycles.",
    body:
      "Aperture customers run forecast cadences with measurably tighter accuracy and faster deal-risk identification."
  },
  comparisonMatrix: {
    enabled: true,
    header: {
      eyebrow: "Compare plans",
      title: "What's included at each tier."
    },
    rows: [
      {
        label: "Pipeline and forecast workspace",
        flags: {
          diagnostic: "Included",
          program: "Included",
          partner: "Included"
        }
      },
      {
        label: "CRM and data warehouse connectors",
        flags: {
          diagnostic: "Salesforce or HubSpot",
          program: "All native connectors",
          partner: "All connectors + custom"
        }
      },
      {
        label: "Deal-risk and engagement scoring",
        flags: {
          diagnostic: "Standard model",
          program: "Tunable model",
          partner: "Custom + embedded data science"
        }
      },
      {
        label: "Solutions architect implementation",
        flags: {
          diagnostic: "Self-serve + onboarding",
          program: "Dedicated 2-week project",
          partner: "Dedicated 4-week + ongoing"
        }
      },
      {
        label: "Single sign-on and audit logs",
        flags: {
          diagnostic: "SSO via SAML",
          program: "SSO + SCIM + audit log",
          partner: "SSO + SCIM + audit + tenant isolation"
        }
      },
      {
        label: "Support and SLA",
        flags: {
          diagnostic: "Business hours, next-day",
          program: "Business hours, 4-hour SLA",
          partner: "24/7 with named CSE"
        }
      }
    ]
  },
  items: [
    {
      id: "diagnostic",
      order: 10,
      visible: true,
      title: "Starter",
      shortLabel: "Starter",
      audience: "Revenue teams up to 50 sellers building their first forecast system",
      summary:
        "Everything a Series B revenue team needs to retire spreadsheets and start running a real forecast cadence. Includes pipeline, forecast, deal-risk, and the standard alert model.",
      detailBody:
        "Best for revenue teams between $5M and $25M ARR who are running forecast in spreadsheets today and need a single source of truth without committing to a multi-quarter implementation.",
      features: [
        "Pipeline and forecast workspace for up to 50 seats",
        "Salesforce or HubSpot connector",
        "Standard deal-risk and engagement scoring",
        "SSO via SAML and basic audit log",
        "Business-hours support with next-day response"
      ],
      deliverables: [
        "Self-serve onboarding flow",
        "Solutions engineer onboarding session",
        "Forecast cadence playbook"
      ],
      timelineText: "Live in 7 days",
      priceMode: "STARTING_AT",
      priceText: "$1,800 / month",
      ctaType: "GO_TO_QUOTE",
      ctaLabel: "Get a Custom Quote",
      badge: "Series B fit",
      featured: false,
      comparisonFlags: {
        governance: true,
        transformation: false,
        embedded: false
      },
      testimonialIds: ["harper", "nguyen"]
    },
    {
      id: "program",
      order: 20,
      visible: true,
      title: "Growth",
      shortLabel: "Growth",
      audience: "Revenue orgs scaling from 50 to 200 sellers across multiple segments",
      summary:
        "Tunable scoring, dedicated solutions architect implementation, and the integration depth needed to run a real multi-segment revenue motion across global teams.",
      detailBody:
        "Best for B2B SaaS and B2B marketplaces between $25M and $150M ARR running multi-segment revenue motions with overlay teams, customer success, and partner channels.",
      features: [
        "Pipeline workspace for up to 200 seats",
        "All native connectors (Salesforce, HubSpot, Snowflake, BigQuery, Gong, Outreach, Slack)",
        "Tunable deal-risk and engagement model",
        "SSO + SCIM + full audit log",
        "Dedicated 2-week solutions architect implementation",
        "4-hour SLA during business hours"
      ],
      deliverables: [
        "Tailored forecast model and segmentation",
        "Custom executive dashboards",
        "Dedicated customer success engineer"
      ],
      timelineText: "Live in 2 to 4 weeks",
      priceMode: "QUOTE_REQUIRED",
      priceText: "",
      ctaType: "GO_TO_QUOTE",
      ctaLabel: "Get a Custom Quote",
      badge: "Most popular",
      featured: true,
      comparisonFlags: {
        governance: true,
        transformation: true,
        embedded: false
      },
      testimonialIds: ["ramos", "harper", "clarke"]
    },
    {
      id: "partner",
      order: 30,
      visible: true,
      title: "Enterprise",
      shortLabel: "Enterprise",
      audience: "Public companies and 200+ seller revenue organizations with complex compliance needs",
      summary:
        "Single-tenant deployment, custom data science, embedded customer success engineering, and 24/7 support with a named operator. Built for revenue teams that report to a CFO.",
      detailBody:
        "Best for late-stage and public-company revenue organizations with multi-region data residency requirements, custom forecast models, and a procurement process that demands single-tenant isolation.",
      features: [
        "Unlimited seats",
        "Single-tenant deployment with regional data residency",
        "Custom data science and bespoke forecast models",
        "All connectors plus customer-built integrations",
        "SSO + SCIM + immutable audit log + tenant isolation",
        "24/7 support with named customer success engineer",
        "Quarterly executive business reviews"
      ],
      deliverables: [
        "Single-tenant deployment in your region of choice",
        "Embedded customer success engineering",
        "Quarterly executive business review"
      ],
      timelineText: "Live in 4 to 6 weeks",
      priceMode: "CONTACT_SALES",
      priceText: "",
      ctaType: "GO_TO_CONTACT",
      ctaLabel: "Talk to Sales",
      badge: "Enterprise grade",
      featured: false,
      comparisonFlags: {
        governance: true,
        transformation: true,
        embedded: true
      },
      testimonialIds: ["clarke", "ramos"]
    }
  ]
};
