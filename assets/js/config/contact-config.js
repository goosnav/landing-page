/*
 * ENTERPRISE STATIC SERVICE SITE TEMPLATE
 * SAFE TO EDIT: Formspree endpoints, admin labels, contact-page copy
 * EDIT WITH CARE: real production endpoints should replace placeholders
 */

window.SiteTemplate = window.SiteTemplate || {};
window.SiteTemplate.config = window.SiteTemplate.config || {};

window.SiteTemplate.config.contact = {
  contactFormEndpoint: "https://formspree.io/f/your-contact-form-id",
  quoteLeadFormEndpoint: "https://formspree.io/f/your-quote-form-id",
  adminEmailLabel: "Primary inbox",
  successMessageContact:
    "Message received. A response should reach the configured inbox shortly.",
  successMessageQuote:
    "Details received. Your quote summary is ready below and the lead has been captured.",
  errorMessageGeneric:
    "Submission could not be completed. Review the form, confirm the endpoint, and try again.",
  enableSpamTrap: true,
  privacyNoticeText:
    "By submitting this form you agree that the provided information may be used to respond to your request and coordinate follow-up.",
  optInLabel:
    "Keep me informed about useful updates, relevant service offerings, and occasional insights.",
  pageIntro: {
    eyebrow: "Contact",
    title: "Start with a direct operational conversation.",
    body:
      "Use the contact form for general inquiries, partnership requests, or scoped follow-up after reviewing services."
  },
  alternateContactHeading: "Direct contact",
  alternateContactBody:
    "For procurement, executive introductions, or urgent delivery discussions, use the primary email or phone listed below.",
  schedulerPreviewHeading: "Prefer a scheduled conversation?",
  schedulerPreviewBody:
    "Enable the scheduler block here if you want contact-page visitors to book time without going through the quote flow first."
};
