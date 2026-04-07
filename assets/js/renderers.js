/*
 * ENTERPRISE STATIC SERVICE SITE TEMPLATE
 * CORE SYSTEM LOGIC: shared DOM rendering helpers used across pages
 * SAFE TO EDIT: business copy belongs in config files, not in this renderer layer
 */

window.SiteTemplate = window.SiteTemplate || {};
window.SiteTemplate.config = window.SiteTemplate.config || {};

(function bootstrapRenderers(template) {
  var serviceConfig = template.config.services || {};
  var siteConfig = template.config.site || {};
  var testimonialConfig = template.config.testimonials || [];
  var articleConfig = template.config.articles || {};
  var miscConfig = template.config.misc || {};

  function getPageId() {
    return document.body ? document.body.dataset.page || "" : "";
  }

  function getAssetRoot() {
    return document.documentElement.dataset.assetRoot || "assets/";
  }

  function resolveAssetPath(path) {
    if (!path) {
      return "";
    }

    if (/^(https?:|mailto:|tel:|data:)/i.test(path)) {
      return path;
    }

    return getAssetRoot() + String(path).replace(/^\/+/, "");
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(value);
  }

  function formatRange(range) {
    return formatCurrency(range[0]) + " to " + formatCurrency(range[1]);
  }

  function sortByOrder(items) {
    return items.slice().sort(function compare(a, b) {
      return (a.order || a.sortOrder || 0) - (b.order || b.sortOrder || 0);
    });
  }

  function getVisibleServices() {
    return sortByOrder((serviceConfig.items || []).filter(function filterVisible(item) {
      return item.visible !== false;
    }));
  }

  function getVisibleTestimonials(filterKey) {
    return sortByOrder(testimonialConfig.filter(function filterVisible(item) {
      return item.visible !== false && (!filterKey || Boolean(item[filterKey]));
    }));
  }

  function getServiceById(serviceId) {
    return getVisibleServices().find(function findService(item) {
      return item.id === serviceId;
    });
  }

  function resolveServiceCta(service) {
    var label = service.ctaLabel || "Learn More";

    if (service.ctaType === "GO_TO_QUOTE") {
      return { href: "quote.html", label: label };
    }

    if (service.ctaType === "GO_TO_CONTACT") {
      return { href: "contact.html", label: label };
    }

    if (service.ctaType === "GO_TO_CUSTOM_URL" && service.ctaTarget) {
      return { href: service.ctaTarget, label: label };
    }

    return null;
  }

  function renderButtonRow(ctas) {
    if (!ctas || !ctas.length) {
      return "";
    }

    return (
      '<div class="button-row">' +
      ctas.map(function mapCta(cta) {
        var href = escapeHtml(cta.href || "#");
        var styleClass = cta.style ? "button--" + escapeHtml(cta.style) : "button--secondary";
        return (
          '<a class="button ' +
          styleClass +
          '" href="' +
          href +
          '">' +
          escapeHtml(cta.label || "Learn More") +
          "</a>"
        );
      }).join("") +
      "</div>"
    );
  }

  function renderPageIntro(container, introConfig) {
    if (!container || !introConfig) {
      return;
    }

    container.innerHTML =
      '<div class="container">' +
      '<div class="page-intro">' +
      (introConfig.eyebrow ? '<p class="eyebrow">' + escapeHtml(introConfig.eyebrow) + "</p>" : "") +
      '<h1>' + escapeHtml(introConfig.title) + "</h1>" +
      (introConfig.body ? '<p class="page-copy">' + escapeHtml(introConfig.body) + "</p>" : "") +
      "</div>" +
      "</div>";
  }

  function renderHero(container) {
    if (!container || !siteConfig.homePage || !siteConfig.homePage.hero) {
      return;
    }

    var hero = siteConfig.homePage.hero;
    var stats = hero.statList || [];
    var ctas = siteConfig.heroCtas || [];
    var visualPanel = hero.visualPanel || null;
    var panelItems = (visualPanel && visualPanel.items) || [];

    var heroCopy =
      '<div class="hero__copy">' +
      (hero.eyebrow ? '<p class="eyebrow">' + escapeHtml(hero.eyebrow) + "</p>" : "") +
      '<h1>' + escapeHtml(hero.headline) + "</h1>" +
      '<p class="hero__support">' + escapeHtml(hero.supportingText) + "</p>" +
      renderButtonRow(ctas) +
      (stats.length
        ? '<div class="hero__stats">' +
          stats.map(function mapStat(stat) {
            return (
              '<article class="stat-card">' +
              '<strong class="stat-card__value">' + escapeHtml(stat.value) + "</strong>" +
              '<span class="stat-card__label">' + escapeHtml(stat.label) + "</span>" +
              "</article>"
            );
          }).join("") +
          "</div>"
        : "") +
      "</div>";

    var heroAside = visualPanel
      ? '<aside class="hero-panel">' +
        (visualPanel.heading
          ? '<h2 class="info-panel__heading">' + escapeHtml(visualPanel.heading) + "</h2>"
          : "") +
        (panelItems.length
          ? '<ul class="hero-panel__list">' +
            panelItems.map(function mapItem(item) {
              return "<li>" + escapeHtml(item) + "</li>";
            }).join("") +
            "</ul>"
          : "") +
        "</aside>"
      : "";

    container.innerHTML =
      '<div class="container">' +
      '<div class="hero__layout">' +
      heroCopy +
      heroAside +
      "</div>" +
      "</div>";
  }

  function renderSectionHeader(headerConfig, defaults) {
    var resolved = headerConfig || {};
    var eyebrow = resolved.eyebrow || (defaults && defaults.eyebrow) || "";
    var title = resolved.title || (defaults && defaults.title) || "";
    var body = resolved.body || (defaults && defaults.body) || "";

    if (!eyebrow && !title && !body) {
      return "";
    }

    return (
      '<div class="section-header">' +
      (eyebrow ? '<p class="eyebrow">' + escapeHtml(eyebrow) + "</p>" : "") +
      (title ? '<h2>' + escapeHtml(title) + "</h2>" : "") +
      (body ? '<p class="section-copy">' + escapeHtml(body) + "</p>" : "") +
      "</div>"
    );
  }

  function renderDifferentiators(container) {
    var homePage = siteConfig.homePage || {};
    var items = homePage.differentiators || [];

    if (!container) {
      return;
    }

    container.innerHTML =
      '<div class="container">' +
      renderSectionHeader(homePage.differentiatorsHeader, { eyebrow: "Differentiators" }) +
      '<div class="card-grid">' +
      items.map(function mapItem(item) {
        return (
          '<article class="card">' +
          '<h3>' + escapeHtml(item.title) + "</h3>" +
          '<p>' + escapeHtml(item.body) + "</p>" +
          "</article>"
        );
      }).join("") +
      "</div>" +
      "</div>";
  }

  function pickProcessGridClass(stepCount) {
    if (stepCount <= 1) {
      return "stack-md";
    }

    if (stepCount === 2) {
      return "grid-2";
    }

    if (stepCount === 3) {
      return "grid-3";
    }

    if (stepCount === 4) {
      return "grid-4";
    }

    return "card-grid";
  }

  function renderProcess(container) {
    var homePage = siteConfig.homePage || {};
    var steps = homePage.processSteps || [];

    if (!container) {
      return;
    }

    var gridClass = pickProcessGridClass(steps.length);

    container.innerHTML =
      '<div class="container">' +
      renderSectionHeader(homePage.processHeader, { eyebrow: "Process" }) +
      '<div class="' + gridClass + '">' +
      steps.map(function mapStep(step, index) {
        return (
          '<article class="card">' +
          '<p class="eyebrow">Step ' + escapeHtml(index + 1) + "</p>" +
          '<h3>' + escapeHtml(step.title) + "</h3>" +
          '<p>' + escapeHtml(step.body) + "</p>" +
          "</article>"
        );
      }).join("") +
      "</div>" +
      "</div>";
  }

  function createPriceMarkup(service) {
    if (service.priceMode === "SHOW_PRICE" && service.priceText) {
      return '<p class="service-card__price">' + escapeHtml(service.priceText) + "</p>";
    }

    if (service.priceMode === "STARTING_AT" && service.priceText) {
      return '<p class="service-card__price">Starting at ' + escapeHtml(service.priceText) + "</p>";
    }

    if (service.priceMode === "QUOTE_REQUIRED") {
      return '<p class="service-card__price">Estimate required</p>';
    }

    if (service.priceMode === "CONTACT_SALES") {
      return '<p class="service-card__price">Contact for commercial terms</p>';
    }

    return "";
  }

  function createServiceCardMarkup(service, compact) {
    var cta = resolveServiceCta(service);
    var featureList = compact ? service.features.slice(0, 3) : service.features;
    var bodyCopy = compact ? service.summary : service.detailBody || service.summary;

    return (
      '<article class="service-card' + (service.featured ? " service-card--featured" : "") + '">' +
      (service.badge ? '<span class="service-card__badge">' + escapeHtml(service.badge) + "</span>" : "") +
      '<div class="stack-sm">' +
      '<h3>' + escapeHtml(service.title) + "</h3>" +
      (service.audience ? '<p class="visually-muted">' + escapeHtml(service.audience) + "</p>" : "") +
      createPriceMarkup(service) +
      '<p>' + escapeHtml(bodyCopy) + "</p>" +
      "</div>" +
      (service.timelineText
        ? '<div class="service-card__meta"><span class="meta-chip">' + escapeHtml(service.timelineText) + "</span></div>"
        : "") +
      '<ul class="service-card__list">' +
      featureList.map(function mapFeature(feature) {
        return "<li>" + escapeHtml(feature) + "</li>";
      }).join("") +
      "</ul>" +
      (cta
        ? '<div class="button-row"><a class="button button--secondary" href="' +
          escapeHtml(cta.href) +
          '">' +
          escapeHtml(cta.label) +
          "</a></div>"
        : "") +
      "</article>"
    );
  }

  function renderServiceSummary(container) {
    if (!container) {
      return;
    }

    var homePage = siteConfig.homePage || {};

    container.innerHTML =
      '<div class="container">' +
      renderSectionHeader(homePage.servicesHeader, { eyebrow: "Services" }) +
      '<div class="card-grid">' +
      getVisibleServices().map(function mapService(service) {
        return createServiceCardMarkup(service, true);
      }).join("") +
      "</div>" +
      "</div>";
  }

  function renderServicePage(container) {
    if (!container) {
      return;
    }

    container.innerHTML =
      '<div class="container stack-lg">' +
      '<div class="page-intro">' +
      '<p class="eyebrow">' + escapeHtml(serviceConfig.intro.eyebrow) + "</p>" +
      '<h1>' + escapeHtml(serviceConfig.intro.title) + "</h1>" +
      '<p class="page-copy">' + escapeHtml(serviceConfig.intro.body) + "</p>" +
      "</div>" +
      '<div class="card-grid">' +
      getVisibleServices().map(function mapService(service) {
        return createServiceCardMarkup(service, false);
      }).join("") +
      "</div>" +
      "</div>";
  }

  function renderComparisonMatrix(container) {
    if (!container || !serviceConfig.comparisonMatrix || !serviceConfig.comparisonMatrix.enabled) {
      return;
    }

    var services = getVisibleServices();
    var rows = serviceConfig.comparisonMatrix.rows || [];

    container.innerHTML =
      '<div class="container stack-md">' +
      renderSectionHeader(serviceConfig.comparisonMatrix.header, { eyebrow: "Comparison" }) +
      '<div class="comparison-table-wrap">' +
      "<table>" +
      "<thead><tr><th>Capability</th>" +
      services.map(function mapService(service) {
        return "<th>" + escapeHtml(service.shortLabel || service.title) + "</th>";
      }).join("") +
      "</tr></thead>" +
      "<tbody>" +
      rows.map(function mapRow(row) {
        return (
          "<tr><th>" +
          escapeHtml(row.label) +
          "</th>" +
          services.map(function mapService(service) {
            return "<td>" + escapeHtml((row.flags && row.flags[service.id]) || "—") + "</td>";
          }).join("") +
          "</tr>"
        );
      }).join("") +
      "</tbody></table></div></div>";
  }

  function createTestimonialMarkup(item) {
    var header = item.simplifiedMode
      ? ""
      : '<div class="testimonial-card__header">' +
        (item.imagePath
          ? '<img class="testimonial-card__image" src="' +
            escapeHtml(resolveAssetPath(item.imagePath)) +
            '" alt="' +
            escapeHtml(item.imageAlt || item.personName) +
            '">'
          : "") +
        '<div class="stack-sm">' +
        '<strong>' + escapeHtml(item.personName) + "</strong>" +
        (item.personTitle ? '<span class="visually-muted">' + escapeHtml(item.personTitle) + "</span>" : "") +
        (item.companyName ? '<span class="visually-muted">' + escapeHtml(item.companyName) + "</span>" : "") +
        (item.starRating
          ? '<span class="testimonial-card__stars" aria-label="' +
            escapeHtml(item.starRating) +
            ' star rating">' +
            "★".repeat(item.starRating) +
            "</span>"
          : "") +
        "</div></div>";

    return (
      '<article class="testimonial-card">' +
      header +
      '<blockquote class="testimonial-card__quote">"' + escapeHtml(item.quoteText) + '"</blockquote>' +
      (item.simplifiedMode
        ? '<p class="testimonial-meta"><strong>' +
          escapeHtml(item.personName) +
          "</strong>" +
          (item.companyName ? '<span class="visually-muted">' + escapeHtml(item.companyName) + "</span>" : "") +
          "</p>"
        : "") +
      "</article>"
    );
  }

  function renderTestimonials(container, filterKey, headerConfig) {
    if (!container) {
      return;
    }

    var items = getVisibleTestimonials(filterKey);

    container.innerHTML =
      '<div class="container">' +
      renderSectionHeader(headerConfig, { eyebrow: "Testimonials" }) +
      '<div class="card-grid">' +
      items.map(createTestimonialMarkup).join("") +
      "</div>" +
      "</div>";
  }

  function renderCtaStrip(container, ctaConfig) {
    if (!container || !ctaConfig) {
      return;
    }

    var ctas = [];
    if (ctaConfig.primaryCta) {
      ctas.push({
        label: ctaConfig.primaryCta.label,
        href: ctaConfig.primaryCta.href,
        style: "primary"
      });
    }

    if (ctaConfig.secondaryCta) {
      ctas.push({
        label: ctaConfig.secondaryCta.label,
        href: ctaConfig.secondaryCta.href,
        style: "secondary"
      });
    }

    var eyebrow = ctaConfig.eyebrow || "Next Step";

    container.innerHTML =
      '<div class="container">' +
      '<div class="card">' +
      '<p class="eyebrow">' + escapeHtml(eyebrow) + "</p>" +
      '<h2>' + escapeHtml(ctaConfig.title) + "</h2>" +
      '<p class="section-copy">' + escapeHtml(ctaConfig.body) + "</p>" +
      renderButtonRow(ctas) +
      "</div>" +
      "</div>";
  }

  function renderAboutPage(container) {
    var about = siteConfig.aboutPage;

    if (!container || !about) {
      return;
    }

    container.innerHTML =
      '<div class="container stack-lg">' +
      '<div class="page-intro">' +
      '<p class="eyebrow">' + escapeHtml(about.intro.eyebrow) + "</p>" +
      '<h1>' + escapeHtml(about.intro.title) + "</h1>" +
      '<p class="page-copy">' + escapeHtml(about.intro.body) + "</p>" +
      "</div>" +
      '<section class="grid-3">' +
      about.philosophy.map(function mapItem(item) {
        return (
          '<article class="card">' +
          '<h2>' + escapeHtml(item.title) + "</h2>" +
          '<p>' + escapeHtml(item.body) + "</p>" +
          "</article>"
        );
      }).join("") +
      "</section>" +
      '<section class="split-layout">' +
      '<article class="info-panel">' +
      '<h2 class="info-panel__heading">' + escapeHtml(about.engagementModelHeading || "Engagement model") + "</h2>" +
      '<ul class="info-list">' +
      about.engagementModel.map(function mapItem(item) {
        return "<li>" + escapeHtml(item) + "</li>";
      }).join("") +
      "</ul>" +
      "</article>" +
      '<aside class="info-panel">' +
      '<h2 class="info-panel__heading">' + escapeHtml(about.teamProfile.heading) + "</h2>" +
      '<p>' + escapeHtml(about.teamProfile.body) + "</p>" +
      '<ul class="info-list">' +
      about.teamProfile.highlights.map(function mapItem(item) {
        return "<li>" + escapeHtml(item) + "</li>";
      }).join("") +
      "</ul>" +
      "</aside>" +
      "</section>" +
      '<section class="card">' +
      '<h2>' + escapeHtml(about.trustMarkersHeading || "Trust markers") + "</h2>" +
      '<ul class="info-list">' +
      about.trustMarkers.map(function mapItem(item) {
        return "<li>" + escapeHtml(item) + "</li>";
      }).join("") +
      "</ul>" +
      "</section>" +
      "</div>";
  }

  function renderLegalPage(container, legalConfig, title) {
    if (!container || !legalConfig) {
      return;
    }

    container.innerHTML =
      '<div class="container stack-lg">' +
      '<div class="legal-header">' +
      '<p class="eyebrow">' + escapeHtml(title) + "</p>" +
      '<h1>' + escapeHtml(title) + "</h1>" +
      '<p class="page-copy">Updated ' + escapeHtml(legalConfig.updatedDate) + "</p>" +
      "</div>" +
      legalConfig.sections.map(function mapSection(section) {
        return (
          '<section class="card prose">' +
          '<h2>' + escapeHtml(section.title) + "</h2>" +
          section.paragraphs.map(function mapParagraph(paragraph) {
            return "<p>" + escapeHtml(paragraph) + "</p>";
          }).join("") +
          "</section>"
        );
      }).join("") +
      "</div>";
  }

  function renderContactPage(container) {
    var contactConfig = template.config.contact || {};
    var formLabels = contactConfig.formLabels || {};
    var sectionHeading = formLabels.sectionHeading || "Send a message";
    var nameLabel = formLabels.nameLabel || "Name";
    var emailLabel = formLabels.emailLabel || "Email";
    var phoneLabel = formLabels.phoneLabel || "Phone";
    var companyLabel = formLabels.companyLabel || "Company";
    var messageLabel = formLabels.messageLabel || "Message";
    var submitLabel = formLabels.submitLabel || "Send Message";
    var brandAddress = [
      siteConfig.addressLine1,
      siteConfig.addressLine2,
      [siteConfig.city, siteConfig.state, siteConfig.postalCode].filter(Boolean).join(", "),
      siteConfig.country
    ].filter(Boolean);

    if (!container) {
      return;
    }

    container.innerHTML =
      '<div class="container stack-lg">' +
      '<div class="page-intro">' +
      '<p class="eyebrow">' + escapeHtml(contactConfig.pageIntro.eyebrow) + "</p>" +
      '<h1>' + escapeHtml(contactConfig.pageIntro.title) + "</h1>" +
      '<p class="page-copy">' + escapeHtml(contactConfig.pageIntro.body) + "</p>" +
      "</div>" +
      '<div class="contact-grid">' +
      '<section class="card">' +
      '<h2>' + escapeHtml(sectionHeading) + "</h2>" +
      '<form class="form-shell" data-contact-form novalidate>' +
      '<div class="form-grid">' +
      '<div class="form-field"><label class="form-label" for="contact-name">' + escapeHtml(nameLabel) + '</label><input class="form-input" id="contact-name" name="name" autocomplete="name" required></div>' +
      '<div class="form-field"><label class="form-label" for="contact-email">' + escapeHtml(emailLabel) + '</label><input class="form-input" id="contact-email" name="email" type="email" autocomplete="email" required></div>' +
      '<div class="form-field"><label class="form-label" for="contact-phone">' + escapeHtml(phoneLabel) + '</label><input class="form-input" id="contact-phone" name="phone" type="tel" autocomplete="tel"></div>' +
      '<div class="form-field"><label class="form-label" for="contact-company">' + escapeHtml(companyLabel) + '</label><input class="form-input" id="contact-company" name="company" autocomplete="organization"></div>' +
      '<div class="form-field form-field--full"><label class="form-label" for="contact-message">' + escapeHtml(messageLabel) + '</label><textarea class="form-textarea" id="contact-message" name="message" required></textarea></div>' +
      "</div>" +
      (contactConfig.enableSpamTrap
        ? '<div class="form-field visually-hidden" aria-hidden="true"><label for="contact-website">Website</label><input id="contact-website" name="_gotcha" tabindex="-1" autocomplete="off"></div>'
        : "") +
      '<p class="form-note">' + escapeHtml(contactConfig.privacyNoticeText) + "</p>" +
      '<div class="form-status" data-form-status aria-live="polite"></div>' +
      '<div class="button-row"><button class="button button--primary" type="submit">' + escapeHtml(submitLabel) + "</button></div>" +
      "</form>" +
      "</section>" +
      '<aside class="info-panel" data-contact-sidebar>' +
      '<h2 class="info-panel__heading">' + escapeHtml(contactConfig.alternateContactHeading) + "</h2>" +
      '<p>' + escapeHtml(contactConfig.alternateContactBody) + "</p>" +
      '<div class="stack-sm">' +
      '<p><strong>Email</strong><br><a href="mailto:' + escapeHtml(siteConfig.primaryEmail) + '">' + escapeHtml(siteConfig.primaryEmail) + "</a></p>" +
      '<p><strong>Phone</strong><br><a href="tel:' + escapeHtml(siteConfig.primaryPhone.replace(/[^+\d]/g, "")) + '">' + escapeHtml(siteConfig.primaryPhone) + "</a></p>" +
      '<p><strong>Hours</strong><br>' + escapeHtml(siteConfig.businessHoursText) + "</p>" +
      '<p><strong>Service Area</strong><br>' + escapeHtml(siteConfig.serviceAreaText) + "</p>" +
      '<p><strong>Address</strong><br>' + brandAddress.map(escapeHtml).join("<br>") + "</p>" +
      "</div>" +
      '<div data-contact-scheduler></div>' +
      "</aside>" +
      "</div>" +
      "</div>";
  }

  function renderArticlesPage(container) {
    var articles = (articleConfig.items || []).filter(function filterVisible(item) {
      return item.visible !== false;
    });

    if (!container) {
      return;
    }

    container.innerHTML =
      '<div class="container stack-lg">' +
      '<div class="page-intro">' +
      '<p class="eyebrow">' + escapeHtml(articleConfig.intro.eyebrow) + "</p>" +
      '<h1>' + escapeHtml(articleConfig.intro.title) + "</h1>" +
      '<p class="page-copy">' + escapeHtml(articleConfig.intro.body) + "</p>" +
      "</div>" +
      '<div class="card-grid">' +
      articles.map(function mapItem(item) {
        return (
          '<article class="article-card">' +
          '<p class="eyebrow">' + escapeHtml(item.category) + "</p>" +
          '<h2>' + escapeHtml(item.title) + "</h2>" +
          '<p>' + escapeHtml(item.summary) + "</p>" +
          '<p class="visually-muted">' + escapeHtml(item.publishDate) + "</p>" +
          '<a class="button button--tertiary" href="' + escapeHtml(item.href || "#") + '">Placeholder entry</a>' +
          "</article>"
        );
      }).join("") +
      "</div>" +
      "</div>";
  }

  function renderMiscPage(container) {
    if (!container) {
      return;
    }

    container.innerHTML =
      '<div class="container stack-lg">' +
      '<div class="page-intro">' +
      '<p class="eyebrow">' + escapeHtml(miscConfig.eyebrow || "Hidden placeholder") + "</p>" +
      '<h1>' + escapeHtml(miscConfig.title) + "</h1>" +
      '<p class="page-copy">' + escapeHtml(miscConfig.body) + "</p>" +
      "</div>" +
      '<div class="card-grid">' +
      (miscConfig.blocks || []).map(function mapBlock(block) {
        return (
          '<article class="misc-card">' +
          '<h2>' + escapeHtml(block.title) + "</h2>" +
          '<ul class="misc-list">' +
          (block.items || []).map(function mapItem(item) {
            return "<li>" + escapeHtml(item) + "</li>";
          }).join("") +
          "</ul>" +
          "</article>"
        );
      }).join("") +
      "</div>" +
      "</div>";
  }

  function renderNotFound(container) {
    if (!container) {
      return;
    }

    var notFoundConfig = siteConfig.notFoundPage || {};
    var eyebrow = notFoundConfig.eyebrow || "404";
    var title = notFoundConfig.title || "Page not found.";
    var body =
      notFoundConfig.body ||
      "The requested page does not exist or the path no longer resolves in this deployment.";
    var ctas = [];
    if (notFoundConfig.primaryCta) {
      ctas.push({
        label: notFoundConfig.primaryCta.label,
        href: notFoundConfig.primaryCta.href,
        style: "primary"
      });
    } else {
      ctas.push({ label: "Return Home", href: "index.html", style: "primary" });
    }
    if (notFoundConfig.secondaryCta) {
      ctas.push({
        label: notFoundConfig.secondaryCta.label,
        href: notFoundConfig.secondaryCta.href,
        style: "secondary"
      });
    }

    container.innerHTML =
      '<div class="container">' +
      '<section class="not-found">' +
      '<div class="card u-max-md">' +
      '<p class="eyebrow">' + escapeHtml(eyebrow) + "</p>" +
      '<h1>' + escapeHtml(title) + "</h1>" +
      '<p>' + escapeHtml(body) + "</p>" +
      renderButtonRow(ctas) +
      "</div></section></div>";
  }

  function renderFooter(container) {
    if (!container) {
      return;
    }

    var footerNavItems = (template.config.navigation || []).filter(function filterVisible(item) {
      return item.footerVisible;
    });
    var year =
      siteConfig.copyrightYearMode === "CURRENT"
        ? new Date().getFullYear()
        : escapeHtml(siteConfig.copyrightYearMode || new Date().getFullYear());

    container.innerHTML =
      '<div class="container site-footer__inner">' +
      '<div class="footer-brand">' +
      '<a class="brand-link" href="index.html">' +
      (siteConfig.logoMarkPath
        ? '<img class="brand-link__mark" src="' +
          escapeHtml(resolveAssetPath(siteConfig.logoMarkPath)) +
          '" alt="' +
          escapeHtml(siteConfig.logoAlt || siteConfig.siteName) +
          '">'
        : "") +
      '<span class="brand-link__copy">' +
      '<span class="brand-link__name">' + escapeHtml(siteConfig.siteName) + "</span>" +
      '<span class="brand-link__tagline">' + escapeHtml(siteConfig.tagline) + "</span>" +
      "</span></a>" +
      '<p class="section-copy">' + escapeHtml(siteConfig.footerDescription) + "</p>" +
      "</div>" +
      '<div class="footer-meta">' +
      '<p><strong>Email</strong><br><a href="mailto:' + escapeHtml(siteConfig.primaryEmail) + '">' + escapeHtml(siteConfig.primaryEmail) + "</a></p>" +
      '<p><strong>Phone</strong><br><a href="tel:' + escapeHtml(siteConfig.primaryPhone.replace(/[^+\d]/g, "")) + '">' + escapeHtml(siteConfig.primaryPhone) + "</a></p>" +
      '<ul class="footer-nav">' +
      footerNavItems.map(function mapItem(item) {
        return (
          '<li><a class="footer-nav__link" href="' + escapeHtml(item.href) + '">' + escapeHtml(item.label) + "</a></li>"
        );
      }).join("") +
      "</ul>" +
      '<p class="visually-muted">© ' + escapeHtml(year) + " " + escapeHtml(siteConfig.copyrightOwner) + "</p>" +
      "</div>" +
      "</div>";
  }

  template.utils = Object.assign({}, template.utils, {
    getPageId: getPageId,
    getAssetRoot: getAssetRoot,
    resolveAssetPath: resolveAssetPath,
    escapeHtml: escapeHtml,
    formatCurrency: formatCurrency,
    formatRange: formatRange,
    getVisibleServices: getVisibleServices,
    getVisibleTestimonials: getVisibleTestimonials,
    getServiceById: getServiceById
  });

  template.renderers = {
    pickProcessGridClass: pickProcessGridClass,
    renderPageIntro: renderPageIntro,
    renderHero: renderHero,
    renderDifferentiators: renderDifferentiators,
    renderProcess: renderProcess,
    renderServiceSummary: renderServiceSummary,
    renderServicePage: renderServicePage,
    renderComparisonMatrix: renderComparisonMatrix,
    renderTestimonials: renderTestimonials,
    renderCtaStrip: renderCtaStrip,
    renderAboutPage: renderAboutPage,
    renderLegalPage: renderLegalPage,
    renderContactPage: renderContactPage,
    renderArticlesPage: renderArticlesPage,
    renderMiscPage: renderMiscPage,
    renderNotFound: renderNotFound,
    renderFooter: renderFooter
  };
})(window.SiteTemplate);
