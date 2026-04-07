/*
 * ENTERPRISE STATIC SERVICE SITE TEMPLATE
 * CORE SYSTEM LOGIC: quote-result and contact-page scheduler rendering
 * SAFE TO EDIT: scheduler copy belongs in scheduler-config.js
 */

window.SiteTemplate = window.SiteTemplate || {};

(function bootstrapScheduler(template) {
  function renderScheduler(container, options) {
    if (!container) {
      return;
    }

    var config = template.config.scheduler || {};
    var mode = config.mode || "EXTERNAL_LINK";
    var allowRender = options && options.context === "contact" ? config.enabledOnContact : config.enabledOnQuote;

    if (!allowRender) {
      container.innerHTML =
        '<div class="scheduler-card"><h2 class="scheduler-card__heading">Scheduling</h2><p>' +
        template.utils.escapeHtml(config.disabledText || "Scheduling is currently disabled.") +
        "</p></div>";
      return;
    }

    if (mode === "INLINE_EMBED" && config.embedHtml) {
      container.innerHTML =
        '<section class="scheduler-card">' +
        '<h2 class="scheduler-card__heading">' + template.utils.escapeHtml(config.schedulerHeading) + "</h2>" +
        '<p>' + template.utils.escapeHtml(config.schedulerBodyText) + "</p>" +
        '<div class="scheduler-embed">' + config.embedHtml + "</div>" +
        "</section>";
      return;
    }

    container.innerHTML =
      '<section class="scheduler-card">' +
      '<h2 class="scheduler-card__heading">' + template.utils.escapeHtml(config.schedulerHeading) + "</h2>" +
      '<p>' + template.utils.escapeHtml(config.schedulerBodyText) + "</p>" +
      '<div class="button-row">' +
      '<a class="button button--primary" href="' +
      template.utils.escapeHtml(config.schedulerUrl || "contact.html") +
      '"' +
      (config.openInNewTab ? ' target="_blank" rel="noreferrer"' : "") +
      ">" +
      template.utils.escapeHtml(config.fallbackLinkLabel || "Open Scheduler") +
      "</a></div></section>";
  }

  template.scheduler = {
    renderScheduler: renderScheduler
  };
})(window.SiteTemplate);
