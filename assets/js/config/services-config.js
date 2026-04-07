/*
 * ENTERPRISE STATIC SERVICE SITE TEMPLATE
 * SAFE TO EDIT: service tiers, feature lists, pricing display, CTA routing
 * EDIT WITH CARE: keep service count between 3 and 7 and allowed enums intact
 */

window.SiteTemplate = window.SiteTemplate || {};
window.SiteTemplate.config = window.SiteTemplate.config || {};

window.SiteTemplate.config.services = {
  intro: {
    eyebrow: "Service tiers",
    title: "Structured engagements sized for the level of operating change required.",
    body:
      "Each service tier is designed to remain legible during sales, delivery, and executive review. Expand the list up to seven tiers without changing the page shell."
  },
  pageCta: {
    title: "Not sure which engagement fits?",
    body:
      "Use the quote flow to map urgency, delivery model, and governance needs into a structured recommendation.",
    primaryCta: { label: "Use the Quote Wizard", href: "quote.html" },
    secondaryCta: { label: "Talk to Northstar", href: "contact.html" }
  },
  testimonialsHeader: {
    eyebrow: "Testimonials",
    title: "Service engagements sized for real delivery complexity.",
    body:
      "The services page intentionally carries a broader testimonial set than the homepage."
  },
  comparisonMatrix: {
    enabled: true,
    header: {
      eyebrow: "Comparison",
      title: "Service structure at a glance."
    },
    rows: [
      {
        label: "Executive readout",
        flags: {
          diagnostic: "Included",
          program: "Included",
          partner: "Included"
        }
      },
      {
        label: "Process redesign",
        flags: {
          diagnostic: "Targeted",
          program: "Comprehensive",
          partner: "Continuous"
        }
      },
      {
        label: "Leadership operating cadence",
        flags: {
          diagnostic: "Baseline only",
          program: "Implemented",
          partner: "Managed"
        }
      },
      {
        label: "Embedded advisory support",
        flags: {
          diagnostic: "No",
          program: "Limited",
          partner: "Yes"
        }
      }
    ]
  },
  items: [
    {
      id: "diagnostic",
      order: 10,
      visible: true,
      title: "Diagnostic Advisory Sprint",
      shortLabel: "Diagnostic",
      audience: "Leadership teams that need a clear operating baseline quickly",
      summary:
        "A focused assessment that produces a practical operating map, service packaging review, and prioritized control plan.",
      detailBody:
        "Best for firms that know execution is drifting but need a clear operating picture before funding a broader redesign.",
      features: [
        "Current-state delivery audit",
        "Service packaging and pricing review",
        "Leadership reporting baseline",
        "Risk and dependency register"
      ],
      deliverables: [
        "Executive findings brief",
        "Priority remediation roadmap",
        "Quote refinement assumptions"
      ],
      timelineText: "3 to 6 weeks",
      priceMode: "STARTING_AT",
      priceText: "$18,000",
      ctaType: "GO_TO_QUOTE",
      ctaLabel: "Estimate My Engagement",
      badge: "Fastest path to clarity",
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
      title: "Transformation Program",
      shortLabel: "Program",
      audience: "Businesses redesigning delivery operations across multiple teams",
      summary:
        "A structured program to redesign service operations, leadership controls, and execution workflows without platform sprawl.",
      detailBody:
        "Best for organizations that already understand the problem surface and need disciplined implementation with executive visibility.",
      features: [
        "Target operating model design",
        "Service tier and scope redesign",
        "Reporting and escalation framework",
        "Implementation playbooks and templates"
      ],
      deliverables: [
        "Program plan",
        "Leadership dashboard specification",
        "Rollout toolkit"
      ],
      timelineText: "8 to 14 weeks",
      priceMode: "QUOTE_REQUIRED",
      priceText: "",
      ctaType: "GO_TO_QUOTE",
      ctaLabel: "Build My Range",
      badge: "Most common fit",
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
      title: "Fractional Operations Partner",
      shortLabel: "Partner",
      audience: "Senior teams that need ongoing operator-level support and decision cadence",
      summary:
        "Embedded advisory support for leadership teams that need continuous execution governance, issue escalation, and service operating discipline.",
      detailBody:
        "Best for organizations balancing growth, regulatory pressure, and high client-delivery complexity across multiple workstreams.",
      features: [
        "Recurring executive operating reviews",
        "Embedded issue triage and escalation support",
        "Capacity and delivery risk monitoring",
        "Cross-functional operating rhythm ownership"
      ],
      deliverables: [
        "Monthly operating review package",
        "Decision log and escalation path",
        "Quarterly service refinement recommendations"
      ],
      timelineText: "90-day minimum",
      priceMode: "CONTACT_SALES",
      priceText: "",
      ctaType: "GO_TO_CONTACT",
      ctaLabel: "Discuss Fit",
      badge: "Highest continuity",
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
