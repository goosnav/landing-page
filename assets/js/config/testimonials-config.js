/*
 * ENTERPRISE STATIC SERVICE SITE TEMPLATE
 * SAFE TO EDIT: testimonial copy, attribution, featured flags
 * EDIT WITH CARE: keep ids stable if referenced by service tiers
 */

window.SiteTemplate = window.SiteTemplate || {};
window.SiteTemplate.config = window.SiteTemplate.config || {};

window.SiteTemplate.config.testimonials = [
  {
    id: "harper",
    visible: true,
    featuredOnHome: true,
    featuredOnServices: true,
    quoteText:
      "Northstar replaced three competing internal operating documents with one system our leadership team actually used.",
    personName: "Elena Harper",
    personTitle: "Chief Operating Officer",
    companyName: "Bellwether Advisory Group",
    companyLogoPath: "",
    imagePath: "img/testimonials/elena-harper.svg",
    imageAlt: "Portrait illustration of Elena Harper",
    starRating: 5,
    simplifiedMode: false,
    sortOrder: 10,
    accentColor: "red"
  },
  {
    id: "nguyen",
    visible: true,
    featuredOnHome: true,
    featuredOnServices: false,
    quoteText:
      "The estimate and delivery framing were precise enough that procurement, operations, and leadership aligned in one review cycle.",
    personName: "Thomas Nguyen",
    personTitle: "",
    companyName: "Summit Legal Services",
    companyLogoPath: "",
    imagePath: "",
    imageAlt: "",
    starRating: 5,
    simplifiedMode: true,
    sortOrder: 20,
    accentColor: "blue"
  },
  {
    id: "ramos",
    visible: true,
    featuredOnHome: false,
    featuredOnServices: true,
    quoteText:
      "We finally had a disciplined handoff between sales promises and delivery reality. That alone paid for the program.",
    personName: "Iris Ramos",
    personTitle: "Managing Director",
    companyName: "Kestrel Compliance Partners",
    companyLogoPath: "",
    imagePath: "img/testimonials/iris-ramos.svg",
    imageAlt: "Portrait illustration of Iris Ramos",
    starRating: 5,
    simplifiedMode: false,
    sortOrder: 30,
    accentColor: "green"
  },
  {
    id: "clarke",
    visible: true,
    featuredOnHome: false,
    featuredOnServices: true,
    quoteText:
      "The operating cadence Northstar introduced gave our leadership team real signal instead of a weekly status theater exercise.",
    personName: "Marcus Clarke",
    personTitle: "Founder",
    companyName: "Greyline Advisory",
    companyLogoPath: "",
    imagePath: "",
    imageAlt: "",
    starRating: 4,
    simplifiedMode: true,
    sortOrder: 40,
    accentColor: "red"
  }
];
