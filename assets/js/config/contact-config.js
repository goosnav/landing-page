/*
 * APERTURE — B2B REVENUE INTELLIGENCE PLATFORM
 * SAFE TO EDIT: Formspree endpoints, admin labels, contact-page copy
 * EDIT WITH CARE: real production endpoints should replace placeholders
 */

window.SiteTemplate = window.SiteTemplate || {};
window.SiteTemplate.config = window.SiteTemplate.config || {};

window.SiteTemplate.config.contact = {
  contactFormEndpoint: "https://formspree.io/f/your-contact-form-id",
  quoteLeadFormEndpoint: "https://formspree.io/f/your-quote-form-id",
  adminEmailLabel: "Sales inbox",
  successMessageContact:
    "Thanks — your message reached the Aperture sales team. Expect a response within one business day.",
  successMessageQuote:
    "Your sizing inputs are captured. The estimate is ready below and a solutions architect will follow up to schedule a working session.",
  errorMessageGeneric:
    "Something went wrong submitting that. Check the form, confirm your network, and try again. If the issue persists, email hello@aperture.example.",
  enableSpamTrap: true,
  privacyNoticeText:
    "By submitting this form you agree that Aperture may use the information to respond to your request. Aperture does not sell personal data.",
  optInLabel:
    "Send me occasional product updates and revenue operations briefings. (You can unsubscribe at any time.)",
  pageIntro: {
    eyebrow: "Talk to sales",
    title: "Start a real sales conversation.",
    body:
      "Use the contact form for sales inquiries, security and compliance reviews, partnership requests, or anything else that needs a real person."
  },
  formLabels: {
    sectionHeading: "Send a message",
    nameLabel: "Full name",
    emailLabel: "Work email",
    phoneLabel: "Phone (optional)",
    companyLabel: "Company",
    messageLabel: "What can we help with?",
    submitLabel: "Send Message"
  },
  alternateContactHeading: "Other ways to reach us",
  alternateContactBody:
    "For procurement, security questionnaires, or executive introductions, the email and phone below reach the Aperture sales team directly.",
  schedulerPreviewHeading: "Prefer to book a slot directly?",
  schedulerPreviewBody:
    "Skip the form and book a 30-minute working session with a solutions architect. Bring your forecast questions."
};
