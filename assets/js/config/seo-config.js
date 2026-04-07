/*
 * APERTURE — B2B REVENUE INTELLIGENCE PLATFORM
 * SAFE TO EDIT: titles, descriptions, canonical base URL, social profiles
 * EDIT WITH CARE: keep page ids aligned with page filenames and html data-page values
 */

window.SiteTemplate = window.SiteTemplate || {};
window.SiteTemplate.config = window.SiteTemplate.config || {};

window.SiteTemplate.config.seo = {
  siteUrl: "https://aperture.example",
  defaultTitle: "Aperture — Revenue intelligence for B2B teams",
  titleSuffix: " | Aperture",
  defaultDescription:
    "Aperture is the revenue operating system for B2B teams. Unify pipeline data, deal risk, and customer health on one auditable surface.",
  defaultOgImage: "img/branding/og-image-default.jpg",
  defaultRobots: "index,follow",
  organizationName: "Aperture Labs, Inc.",
  organizationLogo: "img/branding/logo.svg",
  socialProfiles: [
    "https://www.linkedin.com/company/aperture",
    "https://x.com/aperture",
    "https://github.com/aperture"
  ],
  pageOverrides: {
    home: {
      title: "Revenue intelligence for B2B teams",
      description:
        "Aperture unifies pipeline data, deal risk, and customer health into one auditable surface. Forecast accuracy revenue leaders can defend.",
      canonicalPath: "/",
      ogTitle: "Aperture — Revenue intelligence for B2B teams",
      ogDescription:
        "The revenue operating system for high-velocity B2B teams. Unify pipeline, forecast, and account health."
    },
    services: {
      title: "Plans and Pricing",
      description:
        "Three Aperture deployment tiers covering Series B revenue teams through enterprise. Native connectors, dedicated implementation, and 24/7 enterprise support.",
      canonicalPath: "/services.html"
    },
    quote: {
      title: "Get a Custom Quote",
      description:
        "Run the Aperture sizing tool to receive a directional quote, recommended deployment tier, and a working session with a solutions architect.",
      canonicalPath: "/quote.html"
    },
    about: {
      title: "About Aperture",
      description:
        "Aperture was built by revenue operators and platform engineers tired of rebuilding the same forecast spreadsheet at every company.",
      canonicalPath: "/about.html"
    },
    contact: {
      title: "Talk to Sales",
      description:
        "Reach the Aperture team for sales conversations, security and compliance reviews, or partnership discussions.",
      canonicalPath: "/contact.html"
    },
    privacy: {
      title: "Privacy Policy",
      description:
        "How Aperture handles customer data, marketing site submissions, subprocessors, and data subject requests.",
      canonicalPath: "/privacy.html",
      robots: "noindex,follow"
    },
    terms: {
      title: "Terms of Service",
      description:
        "Terms governing use of the Aperture marketing site and the relationship to the master subscription agreement.",
      canonicalPath: "/terms.html",
      robots: "noindex,follow"
    },
    articles: {
      title: "Resources and Briefings",
      description:
        "Briefings, benchmarks, and operator notes from the Aperture team and our customers.",
      canonicalPath: "/articles.html"
    },
    misc: {
      title: "Trust and Reference",
      description:
        "Aperture trust center, security documentation, and reference materials.",
      canonicalPath: "/misc.html"
    },
    notFound: {
      title: "Page Not Found",
      description:
        "The requested Aperture page could not be found.",
      canonicalPath: "/404.html",
      robots: "noindex,follow"
    }
  }
};
