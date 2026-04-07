/*
 * ENTERPRISE STATIC SERVICE SITE TEMPLATE
 * CORE SYSTEM LOGIC: app bootstrap and per-page initialization
 * SAFE TO EDIT: page-specific business copy belongs in config files
 */

window.SiteTemplate = window.SiteTemplate || {};

(function bootstrapApp(template) {
  function initCommonShell() {
    template.nav.renderHeader(document.querySelector("[data-site-header]"));
    template.renderers.renderFooter(document.querySelector("[data-site-footer]"));
  }

  function initHomePage() {
    template.renderers.renderHero(document.querySelector("[data-home-hero]"));
    template.renderers.renderServiceSummary(document.querySelector("[data-home-services]"));
    template.renderers.renderDifferentiators(document.querySelector("[data-home-differentiators]"));
    template.renderers.renderProcess(document.querySelector("[data-home-process]"));
    template.renderers.renderTestimonials(
      document.querySelector("[data-home-testimonials]"),
      "featuredOnHome",
      "Trusted by operators who need stronger delivery signal.",
      "Testimonials support both simplified and rich display modes without changing the section shell."
    );
    template.renderers.renderCtaStrip(
      document.querySelector("[data-home-cta]"),
      template.config.site.homePage.ctaStrip
    );
  }

  function initServicesPage() {
    template.renderers.renderServicePage(document.querySelector("[data-services-page]"));
    template.renderers.renderComparisonMatrix(document.querySelector("[data-services-comparison]"));
    template.renderers.renderTestimonials(
      document.querySelector("[data-services-testimonials]"),
      "featuredOnServices",
      "Service engagements sized for real delivery complexity.",
      "The services page intentionally carries a broader testimonial set than the homepage."
    );
    template.renderers.renderCtaStrip(
      document.querySelector("[data-services-cta]"),
      template.config.services.pageCta
    );
  }

  function initAboutPage() {
    template.renderers.renderAboutPage(document.querySelector("[data-about-page]"));
    template.renderers.renderCtaStrip(
      document.querySelector("[data-about-cta]"),
      template.config.site.homePage.ctaStrip
    );
  }

  function initContactPage() {
    template.renderers.renderContactPage(document.querySelector("[data-contact-page]"));
    template.forms.bindContactForm(document.querySelector("[data-contact-form]"));
    template.scheduler.renderScheduler(document.querySelector("[data-contact-scheduler]"), { context: "contact" });
  }

  function initLegalPage(pageId) {
    if (pageId === "privacy") {
      template.renderers.renderLegalPage(
        document.querySelector("[data-legal-page]"),
        template.config.site.privacyPage,
        "Privacy Policy"
      );
      return;
    }

    template.renderers.renderLegalPage(
      document.querySelector("[data-legal-page]"),
      template.config.site.termsPage,
      "Terms"
    );
  }

  function initPlaceholderPages(pageId) {
    if (pageId === "articles") {
      template.renderers.renderArticlesPage(document.querySelector("[data-articles-page]"));
      return;
    }

    if (pageId === "misc") {
      template.renderers.renderMiscPage(document.querySelector("[data-misc-page]"));
      return;
    }

    if (pageId === "notFound") {
      template.renderers.renderNotFound(document.querySelector("[data-not-found-page]"));
    }
  }

  function initQuotePage() {
    var intro = document.querySelector("[data-quote-intro-copy]");
    if (intro) {
      template.renderers.renderPageIntro(intro, {
        eyebrow: "Quote",
        title: "A controlled estimate experience for serious buyers.",
        body:
          "The quote flow uses one question per screen, a hard lead gate before result reveal, and scheduler handoff once the estimate is captured."
      });
    }

    template.quoteUi.initQuoteWizard(document.querySelector("[data-quote-root]"));
  }

  function initPage() {
    var pageId = document.body.dataset.page || "";

    initCommonShell();

    if (pageId === "home") {
      initHomePage();
      return;
    }

    if (pageId === "services") {
      initServicesPage();
      return;
    }

    if (pageId === "about") {
      initAboutPage();
      return;
    }

    if (pageId === "contact") {
      initContactPage();
      return;
    }

    if (pageId === "quote") {
      initQuotePage();
      return;
    }

    if (pageId === "privacy" || pageId === "terms") {
      initLegalPage(pageId);
      return;
    }

    initPlaceholderPages(pageId);
  }

  document.addEventListener("DOMContentLoaded", initPage);
})(window.SiteTemplate);
