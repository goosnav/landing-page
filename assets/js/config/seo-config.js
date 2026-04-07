/*
 * ENTERPRISE STATIC SERVICE SITE TEMPLATE
 * SAFE TO EDIT: titles, descriptions, canonical base URL, social profiles
 * EDIT WITH CARE: keep page ids aligned with page filenames and html data-page values
 */

window.SiteTemplate = window.SiteTemplate || {};
window.SiteTemplate.config = window.SiteTemplate.config || {};

window.SiteTemplate.config.seo = {
  siteUrl: "https://example.com",
  defaultTitle: "Northstar Systems Advisory",
  titleSuffix: " | Northstar Systems Advisory",
  defaultDescription:
    "Config-driven static website template for service businesses with quote intake, Formspree lead capture, and scheduler handoff.",
  defaultOgImage: "img/branding/og-image-default.jpg",
  defaultRobots: "index,follow",
  organizationName: "Northstar Systems Advisory LLC",
  organizationLogo: "img/branding/logo.svg",
  socialProfiles: [
    "https://www.linkedin.com/company/example",
    "https://github.com/example"
  ],
  pageOverrides: {
    home: {
      title: "Operational Systems for Regulated Service Teams",
      description:
        "Northstar helps service businesses stabilize delivery, improve governance, and scale operations without tooling bloat.",
      canonicalPath: "/",
      ogTitle: "Northstar Systems Advisory",
      ogDescription:
        "Structured advisory for service organizations that need stronger operating systems."
    },
    services: {
      title: "Service Tiers",
      description:
        "Review Northstar's diagnostic, program, and embedded advisory engagements.",
      canonicalPath: "/services.html"
    },
    quote: {
      title: "Guided Estimate",
      description:
        "Use the quote wizard to receive a directional estimate, recommended engagement, and scheduling handoff.",
      canonicalPath: "/quote.html"
    },
    about: {
      title: "About",
      description:
        "Learn how Northstar approaches delivery systems, governance, and executive operating design.",
      canonicalPath: "/about.html"
    },
    contact: {
      title: "Contact",
      description:
        "Contact Northstar Systems Advisory for operational advisory inquiries and follow-up discussions.",
      canonicalPath: "/contact.html"
    },
    privacy: {
      title: "Privacy Policy",
      description:
        "Review how this static site template handles contact and quote submission data.",
      canonicalPath: "/privacy.html",
      robots: "noindex,follow"
    },
    terms: {
      title: "Terms",
      description:
        "Review the terms governing use of this website and its non-binding estimate output.",
      canonicalPath: "/terms.html",
      robots: "noindex,follow"
    },
    articles: {
      title: "Articles and White Papers",
      description:
        "Placeholder index for future articles, briefs, and white papers.",
      canonicalPath: "/articles.html"
    },
    misc: {
      title: "Miscellaneous",
      description:
        "Hidden placeholder page for future custom business content.",
      canonicalPath: "/misc.html"
    },
    notFound: {
      title: "Page Not Found",
      description:
        "The requested page could not be found.",
      canonicalPath: "/404.html",
      robots: "noindex,follow"
    }
  }
};
