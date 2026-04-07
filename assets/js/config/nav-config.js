/*
 * ENTERPRISE STATIC SERVICE SITE TEMPLATE
 * SAFE TO EDIT: labels, ordering, visibility, button treatment
 * EDIT WITH CARE: keep href values aligned with actual page filenames
 */

window.SiteTemplate = window.SiteTemplate || {};
window.SiteTemplate.config = window.SiteTemplate.config || {};

window.SiteTemplate.config.navigation = [
  {
    id: "home",
    label: "Home",
    href: "index.html",
    visible: true,
    footerVisible: false,
    order: 10,
    isPrimary: true,
    isButtonStyle: false,
    openInNewTab: false
  },
  {
    id: "services",
    label: "Services",
    href: "services.html",
    visible: true,
    footerVisible: false,
    order: 20,
    isPrimary: true,
    isButtonStyle: false,
    openInNewTab: false
  },
  {
    id: "quote",
    label: "Quote",
    href: "quote.html",
    visible: true,
    footerVisible: false,
    order: 30,
    isPrimary: true,
    isButtonStyle: true,
    openInNewTab: false
  },
  {
    id: "about",
    label: "About",
    href: "about.html",
    visible: true,
    footerVisible: false,
    order: 40,
    isPrimary: true,
    isButtonStyle: false,
    openInNewTab: false
  },
  {
    id: "contact",
    label: "Contact",
    href: "contact.html",
    visible: true,
    footerVisible: false,
    order: 50,
    isPrimary: true,
    isButtonStyle: false,
    openInNewTab: false
  },
  {
    id: "articles",
    label: "Articles",
    href: "articles.html",
    visible: false,
    footerVisible: false,
    order: 60,
    isPrimary: false,
    isButtonStyle: false,
    openInNewTab: false
  },
  {
    id: "misc",
    label: "Misc",
    href: "misc.html",
    visible: false,
    footerVisible: false,
    order: 70,
    isPrimary: false,
    isButtonStyle: false,
    openInNewTab: false
  },
  {
    id: "privacy",
    label: "Privacy",
    href: "privacy.html",
    visible: false,
    footerVisible: true,
    order: 80,
    isPrimary: false,
    isButtonStyle: false,
    openInNewTab: false
  },
  {
    id: "terms",
    label: "Terms",
    href: "terms.html",
    visible: false,
    footerVisible: true,
    order: 90,
    isPrimary: false,
    isButtonStyle: false,
    openInNewTab: false
  }
];
