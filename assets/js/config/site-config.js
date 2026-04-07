/*
 * APERTURE — B2B REVENUE INTELLIGENCE PLATFORM
 * SAFE TO EDIT: brand identity, homepage copy, about content, legal text
 * EDIT WITH CARE: keep required keys intact so shared renderers stay stable
 */

window.SiteTemplate = window.SiteTemplate || {};
window.SiteTemplate.config = window.SiteTemplate.config || {};

window.SiteTemplate.config.site = {
  siteName: "Aperture",
  legalName: "Aperture Labs, Inc.",
  tagline: "The revenue operating system for B2B teams",
  shortDescription:
    "Aperture unifies pipeline data, account signals, and forecast inputs so revenue, RevOps, and customer success leaders trust the same numbers.",
  longDescription:
    "Aperture is a revenue intelligence platform built for B2B companies between Series B and IPO. It replaces spreadsheets, point dashboards, and forecast guesswork with one auditable system of record for pipeline health, deal risk, and customer expansion signal.",
  logoPath: "img/branding/logo.svg",
  logoMarkPath: "img/branding/logo-mark.svg",
  logoAlt: "Aperture",
  wordmarkEnabled: true,
  faviconPath: "img/branding/favicon.ico",
  appleTouchIconPath: "img/branding/apple-touch-icon.png",
  ogImagePath: "img/branding/og-image-default.jpg",
  footerDescription:
    "Pipeline, forecast, and customer health on one auditable surface. Built for B2B revenue teams that have outgrown the spreadsheet phase.",
  primaryPhone: "(415) 555-0182",
  primaryEmail: "hello@aperture.example",
  addressLine1: "548 Market Street",
  addressLine2: "Floor 17",
  city: "San Francisco",
  state: "CA",
  postalCode: "94104",
  country: "United States",
  businessHoursText: "Monday to Friday, 7:00 AM to 7:00 PM Pacific",
  serviceAreaText:
    "Deployed across North America, EMEA, and APAC. Data residency available in US, EU, and AU.",
  linkedinUrl: "https://www.linkedin.com/",
  xUrl: "https://x.com/",
  youtubeUrl: "",
  githubUrl: "https://github.com/",
  footerLinks: [
    { label: "Privacy", href: "privacy.html" },
    { label: "Terms", href: "terms.html" }
  ],
  copyrightOwner: "Aperture Labs, Inc.",
  copyrightYearMode: "CURRENT",
  headerCta: {
    label: "Book a Demo",
    href: "quote.html#quote-intro"
  },
  heroCtas: [
    { label: "Get a Custom Quote", href: "quote.html", style: "primary" },
    { label: "See How It Works", href: "services.html", style: "secondary" }
  ],
  trustMarkers: [
    "SOC 2 Type II and ISO 27001 certified",
    "99.95% measured platform uptime",
    "Customer data isolation by tenant"
  ],
  homePage: {
    hero: {
      eyebrow: "Revenue intelligence platform",
      headline: "One source of truth for pipeline, forecast, and account health.",
      supportingText:
        "Aperture pulls signal from your CRM, calendar, email, and product so revenue leaders stop arguing about the numbers and start acting on them.",
      statList: [
        { value: "37%", label: "Average forecast accuracy lift after 90 days" },
        { value: "< 14d", label: "From contract to first executive readout" },
        { value: "11x", label: "Faster deal-risk identification vs. CRM alone" }
      ],
      visualPanel: {
        heading: "What you get on day one",
        items: [
          "Unified pipeline view across every active opportunity",
          "Forecast roll-ups your CFO will actually defend",
          "Deal-risk alerts before the deal slips a quarter",
          "Executive dashboards that survive procurement review"
        ]
      }
    },
    differentiatorsHeader: {
      eyebrow: "Why Aperture",
      title: "Built for revenue teams that need answers, not more dashboards.",
      body:
        "Most revenue tools layer on more reports. Aperture compresses the entire pipeline picture into a single auditable surface that scales with your team."
    },
    processHeader: {
      eyebrow: "How it works",
      title: "Production-grade in three weeks, not three quarters.",
      body:
        "Aperture deploys against your existing CRM and data warehouse without rip-and-replace. Most customers reach steady-state operating cadence in under 30 days."
    },
    servicesHeader: {
      eyebrow: "Plans",
      title: "Pricing that scales with your revenue motion.",
      body:
        "Three deployment tiers cover everything from Series B teams to public-company revenue orgs. Pick the tier closest to your motion and the quote tool will refine the fit."
    },
    testimonialsHeader: {
      eyebrow: "Customers",
      title: "Trusted by revenue leaders at high-growth B2B companies.",
      body:
        "From Series B SaaS to public marketplaces, Aperture customers run their forecast cycles with measurably less guesswork."
    },
    differentiators: [
      {
        title: "One auditable forecast",
        body:
          "Every roll-up traces back to the underlying signal. Sales leaders, RevOps, and finance all see the same number — and the math behind it."
      },
      {
        title: "Risk before the slip",
        body:
          "Aperture flags engagement decay, stalled buying committees, and timeline drift before the deal moves out of quarter — not after."
      },
      {
        title: "Connects, doesn't replace",
        body:
          "Your CRM stays the system of record. Aperture sits on top, unifies the signal, and pushes context back where your reps already work."
      }
    ],
    processSteps: [
      {
        title: "Connect",
        body:
          "Authenticate Salesforce or HubSpot, your data warehouse, calendar, and email. Native connectors, no ETL project."
      },
      {
        title: "Calibrate",
        body:
          "Aperture maps your pipeline stages, forecast categories, and segmentation. Solutions architects validate the model."
      },
      {
        title: "Operate",
        body:
          "Forecast cadence, deal-risk alerts, and exec readouts switch on. Revenue leadership runs the first weekly call inside Aperture."
      }
    ],
    ctaStrip: {
      eyebrow: "Get started",
      title: "See what your forecast looks like with Aperture.",
      body:
        "Run the sizing tool to receive a directional quote, recommended deployment tier, and a working session with a solutions architect.",
      primaryCta: { label: "Get a Custom Quote", href: "quote.html" },
      secondaryCta: { label: "Talk to Sales", href: "contact.html" }
    }
  },
  notFoundPage: {
    eyebrow: "404",
    title: "We can't find that page.",
    body:
      "The link you followed may be broken, or the page may have been moved. Head back to the home page or talk to our team.",
    primaryCta: { label: "Return Home", href: "index.html" },
    secondaryCta: { label: "Talk to Sales", href: "contact.html" }
  },
  aboutPage: {
    intro: {
      eyebrow: "About Aperture",
      title: "Built by revenue operators who lived the spreadsheet problem.",
      body:
        "Aperture was founded in 2022 by a team of former RevOps, sales engineering, and data infrastructure leaders who spent a decade rebuilding the same forecast spreadsheet at three different companies. We decided to ship a real product instead."
    },
    engagementModelHeading: "Deployment model",
    trustMarkersHeading: "Compliance and security",
    philosophy: [
      {
        title: "Operator-grade UX",
        body:
          "Every screen is designed for the person running the Monday morning forecast call, not the analyst building a quarterly slide deck."
      },
      {
        title: "Auditable by default",
        body:
          "Every forecast number, every risk score, every alert traces back to a signal you can inspect. No black-box AI, no unverifiable lifts."
      },
      {
        title: "Customer data stays isolated",
        body:
          "Single-tenant data isolation, regional residency, and BYO encryption keys are available from day one. No shared model training."
      }
    ],
    engagementModel: [
      "Native connectors for Salesforce, HubSpot, Snowflake, BigQuery, Gong, Outreach, and Slack.",
      "Solutions architect-led implementation in two to four weeks.",
      "Dedicated customer success engineer assigned at signing for Growth and Enterprise."
    ],
    teamProfile: {
      heading: "Founding team",
      body:
        "Aperture's founding team came out of RevOps and platform engineering at Stripe, Snowflake, and Datadog. We have shipped forecast systems used by tens of thousands of sellers.",
      highlights: [
        "Former RevOps lead at a public SaaS company",
        "Built forecast systems serving 25k+ sellers",
        "Backed by tier-one B2B SaaS investors"
      ]
    },
    trustMarkers: [
      "SOC 2 Type II audited annually",
      "ISO 27001 certified",
      "GDPR and CCPA aligned with regional data residency",
      "Penetration tested by a third-party assessor each quarter"
    ]
  },
  privacyPage: {
    updatedDate: "April 6, 2026",
    sections: [
      {
        title: "Information We Collect",
        paragraphs: [
          "We collect the information needed to operate Aperture and respond to inquiries: account contact details, company information, billing details, and the customer data you authorize Aperture to ingest from connected systems.",
          "We do not sell customer data, train shared models on customer data, or share customer data with third parties beyond the subprocessors disclosed in our trust center."
        ]
      },
      {
        title: "How We Use Information",
        paragraphs: [
          "Customer data is used solely to provide the contracted Aperture service to your tenant. Marketing site submissions are used to respond to inquiries, schedule conversations, and operate the website.",
          "Aperture maintains role-based access controls internally and logs every administrative action against customer tenants."
        ]
      },
      {
        title: "Subprocessors",
        paragraphs: [
          "A current list of subprocessors is published in the Aperture trust center and updated whenever a subprocessor is added.",
          "Customers receive notice in advance of any material change to the subprocessor list as required by their contract."
        ]
      },
      {
        title: "Contact",
        paragraphs: [
          "Privacy questions can be sent to privacy@aperture.example. Data subject requests are handled through the trust center portal."
        ]
      }
    ]
  },
  termsPage: {
    updatedDate: "April 6, 2026",
    sections: [
      {
        title: "Use of the Marketing Site",
        paragraphs: [
          "Content on this marketing site is informational. Use of the Aperture platform is governed by the master subscription agreement signed with Aperture Labs, Inc.",
          "Nothing on this site constitutes a binding commercial commitment until a written order form is countersigned by both parties."
        ]
      },
      {
        title: "Quote Tool",
        paragraphs: [
          "The quote tool produces a directional pricing estimate based on the inputs you provide. Final commercial terms depend on contract length, deployment scope, and integration complexity.",
          "Quote outputs are non-binding and may change after a sizing call with a solutions architect."
        ]
      },
      {
        title: "Acceptable Use",
        paragraphs: [
          "Do not attempt to scrape, probe, or disrupt this site. Submitting false or misleading information through site forms is prohibited."
        ]
      },
      {
        title: "Changes",
        paragraphs: [
          "These terms may be updated at any time. The updated date reflects the latest published revision."
        ]
      }
    ]
  }
};
