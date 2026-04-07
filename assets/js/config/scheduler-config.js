/*
 * ENTERPRISE STATIC SERVICE SITE TEMPLATE
 * SAFE TO EDIT: scheduler mode, link, explanatory copy
 * EDIT WITH CARE: inline embed HTML should come only from a trusted scheduler source
 */

window.SiteTemplate = window.SiteTemplate || {};
window.SiteTemplate.config = window.SiteTemplate.config || {};

window.SiteTemplate.config.scheduler = {
  mode: "EXTERNAL_LINK",
  schedulerUrl:
    "https://calendar.google.com/calendar/u/0/appointments/schedules/placeholder",
  embedHtml: "",
  schedulerHeading: "Schedule a working session",
  schedulerBodyText:
    "If the estimate looks close, book time to confirm scope, dependencies, and the right engagement model.",
  fallbackLinkLabel: "Open the Scheduler",
  openInNewTab: true,
  enabledOnQuote: true,
  enabledOnContact: true,
  disabledText:
    "Scheduling is currently handled manually. Use the contact form if direct booking is disabled."
};
