/*
 * ENTERPRISE STATIC SERVICE SITE TEMPLATE
 * SAFE TO EDIT: brand identity, homepage copy, about content, legal text
 * EDIT WITH CARE: keep required keys intact so shared renderers stay stable
 */

window.SiteTemplate = window.SiteTemplate || {};
window.SiteTemplate.config = window.SiteTemplate.config || {};

window.SiteTemplate.config.site = {
  siteName: "Northstar Systems Advisory",
  legalName: "Northstar Systems Advisory LLC",
  tagline: "Operational systems for regulated service teams",
  shortDescription:
    "Northstar helps service businesses tighten delivery operations, improve governance, and scale client work without process drift.",
  longDescription:
    "Northstar Systems Advisory designs delivery systems, operating controls, and leadership cadences for B2B service organizations that need stronger execution without unnecessary tooling sprawl.",
  logoPath: "img/branding/logo.svg",
  logoMarkPath: "img/branding/logo-mark.svg",
  logoAlt: "Northstar Systems Advisory",
  wordmarkEnabled: true,
  faviconPath: "img/branding/favicon.ico",
  appleTouchIconPath: "img/branding/apple-touch-icon.png",
  ogImagePath: "img/branding/og-image-default.jpg",
  footerDescription:
    "Strategy, systems, and execution support for teams that need dependable delivery infrastructure.",
  primaryPhone: "(415) 555-0128",
  primaryEmail: "hello@example.com",
  addressLine1: "100 Harbor Avenue",
  addressLine2: "Suite 240",
  city: "San Francisco",
  state: "CA",
  postalCode: "94107",
  country: "United States",
  businessHoursText: "Monday to Friday, 8:00 AM to 6:00 PM Pacific",
  serviceAreaText:
    "Remote-first across North America with limited on-site advisory engagements.",
  linkedinUrl: "https://www.linkedin.com/",
  xUrl: "",
  youtubeUrl: "",
  githubUrl: "https://github.com/",
  footerLinks: [
    { label: "Privacy", href: "privacy.html" },
    { label: "Terms", href: "terms.html" }
  ],
  copyrightOwner: "Northstar Systems Advisory LLC",
  copyrightYearMode: "CURRENT",
  headerCta: {
    label: "Book a Discovery Call",
    href: "quote.html#quote-intro"
  },
  heroCtas: [
    { label: "Request an Estimate", href: "quote.html", style: "primary" },
    { label: "Review Services", href: "services.html", style: "secondary" }
  ],
  trustMarkers: [
    "Static-friendly deployment model",
    "Enterprise delivery governance",
    "Operational redesign without platform sprawl"
  ],
  homePage: {
    hero: {
      eyebrow: "Operational advisory for serious service teams",
      headline: "Make delivery, governance, and growth work on the same system.",
      supportingText:
        "Northstar helps leadership teams replace ad hoc client delivery habits with clear operating models, measurable controls, and decision-ready reporting.",
      statList: [
        { value: "3-6", label: "Week diagnostic engagements" },
        { value: "< 14", label: "Days to first operating baseline" },
        { value: "1", label: "Single accountable advisory lead" }
      ],
      visualPanel: {
        heading: "Core operating outcomes",
        items: [
          "Clear service packaging and delivery standards",
          "Leadership reporting that surfaces risk early",
          "Reusable process and quote infrastructure",
          "Client-facing systems that remain legible under pressure"
        ]
      }
    },
    differentiatorsHeader: {
      eyebrow: "Why Northstar",
      title: "Built for sober operating decisions.",
      body:
        "The template uses the same philosophy as the advisory work: minimal surface area, explicit structure, and strong operational signal."
    },
    processHeader: {
      eyebrow: "Process",
      title: "A direct operating sequence.",
      body:
        "The process block is config-driven so businesses can replace the sample steps without changing the page shell."
    },
    servicesHeader: {
      eyebrow: "Services",
      title: "Three default tiers, built to scale to seven.",
      body:
        "The same renderer supports compact homepage previews and the full services page without scattering business content across HTML files."
    },
    testimonialsHeader: {
      eyebrow: "Testimonials",
      title: "Trusted by operators who need stronger delivery signal.",
      body:
        "Testimonials support both simplified and rich display modes without changing the section shell."
    },
    differentiators: [
      {
        title: "Systems before software",
        body:
          "We fix the operating model first so the site, service packaging, and internal execution stay aligned."
      },
      {
        title: "Boardroom tone, operator detail",
        body:
          "Every recommendation is written for senior decision-makers but grounded in day-to-day delivery reality."
      },
      {
        title: "Controlled rollout",
        body:
          "Engagements are structured to create usable controls quickly, then expand only where justified."
      }
    ],
    processSteps: [
      {
        title: "Discover",
        body:
          "Audit demand, service packaging, leadership reporting, and delivery friction."
      },
      {
        title: "Scope",
        body:
          "Define the target operating model, critical controls, and implementation sequence."
      },
      {
        title: "Execute",
        body:
          "Stand up the reporting, templates, and rituals required to make the model real."
      },
      {
        title: "Stabilize",
        body:
          "Verify adoption, tighten gaps, and prepare leadership for steady-state ownership."
      }
    ],
    ctaStrip: {
      eyebrow: "Next Step",
      title: "Need a disciplined estimate before committing to a full engagement?",
      body:
        "Use the guided quote flow to receive a structured range, likely service fit, and the next best handoff.",
      primaryCta: { label: "Start the Quote", href: "quote.html" },
      secondaryCta: { label: "Contact the Team", href: "contact.html" }
    }
  },
  notFoundPage: {
    eyebrow: "404",
    title: "Page not found.",
    body:
      "The requested page does not exist or the path no longer resolves in this deployment.",
    primaryCta: { label: "Return Home", href: "index.html" },
    secondaryCta: { label: "Contact the Team", href: "contact.html" }
  },
  aboutPage: {
    intro: {
      eyebrow: "About Northstar",
      title: "Built for businesses that cannot afford soft operations.",
      body:
        "Northstar works with leadership teams that need clearer delivery systems, better control points, and more reliable execution across growing client portfolios."
    },
    engagementModelHeading: "Engagement model",
    trustMarkersHeading: "Trust markers",
    philosophy: [
      {
        title: "Clarity over theater",
        body:
          "We prioritize operating clarity, durable documentation, and decision-ready outputs over surface-level process rituals."
      },
      {
        title: "Small surface area",
        body:
          "We keep tools, process artifacts, and implementation touchpoints lean so the system is easier to maintain."
      },
      {
        title: "Executive accountability",
        body:
          "Leadership roles, escalation paths, and service boundaries are made explicit to reduce delivery ambiguity."
      }
    ],
    engagementModel: [
      "Short diagnostic engagements to establish the operating baseline.",
      "Focused transformation programs for teams with active redesign work.",
      "Embedded advisory retainers for businesses needing ongoing operator support."
    ],
    teamProfile: {
      heading: "Principal-led work",
      body:
        "Each engagement is led by a senior advisor with direct responsibility for scoping, delivery governance, and executive communication.",
      highlights: [
        "No bait-and-switch handoff after discovery",
        "Clear escalation path from day one",
        "Structured weekly leadership readouts"
      ]
    },
    trustMarkers: [
      "Experience supporting regulated and multi-stakeholder service organizations",
      "Reusable operating templates for sales, delivery, and governance",
      "Delivery model designed for executives who need concise signal"
    ]
  },
  privacyPage: {
    updatedDate: "April 6, 2026",
    sections: [
      {
        title: "Information We Collect",
        paragraphs: [
          "We collect only the information needed to respond to inquiries, prepare estimates, and coordinate meetings.",
          "That may include contact details, company details, project context, and optional marketing consent."
        ]
      },
      {
        title: "How We Use Information",
        paragraphs: [
          "Submission data is used to review requests, respond to inquiries, prepare engagement recommendations, and improve template operations.",
          "We do not ask for payment data or unnecessary sensitive personal information through this site."
        ]
      },
      {
        title: "Third-Party Processing",
        paragraphs: [
          "Form submissions are processed through Formspree and scheduling handoff is handled through Google Calendar appointment scheduling or its configured replacement.",
          "Review the provider terms and privacy notices before using production endpoints."
        ]
      },
      {
        title: "Contact",
        paragraphs: [
          "Questions about this policy may be sent to hello@example.com."
        ]
      }
    ]
  },
  termsPage: {
    updatedDate: "April 6, 2026",
    sections: [
      {
        title: "Informational Use",
        paragraphs: [
          "Site content, estimates, and service descriptions are informational and do not create a binding agreement.",
          "Any final engagement requires a written scope, commercial terms, and mutual approval."
        ]
      },
      {
        title: "Estimate Disclaimer",
        paragraphs: [
          "Quote results are directional planning ranges based on the information provided and may change after discovery, scope clarification, or dependency review."
        ]
      },
      {
        title: "Acceptable Use",
        paragraphs: [
          "Do not misuse forms, attempt to disrupt site behavior, or submit unlawful or misleading information."
        ]
      },
      {
        title: "Changes",
        paragraphs: [
          "We may update this template and its operating terms without prior notice. The updated date reflects the latest published revision."
        ]
      }
    ]
  }
};
