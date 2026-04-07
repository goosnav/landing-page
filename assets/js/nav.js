/*
 * ENTERPRISE STATIC SERVICE SITE TEMPLATE
 * CORE SYSTEM LOGIC: shared header and navigation rendering
 * SAFE TO EDIT: nav labels and ordering belong in nav-config.js, not here
 */

window.SiteTemplate = window.SiteTemplate || {};

(function bootstrapNavigation(template) {
  function renderHeader(container) {
    if (!container) {
      return;
    }

    var site = template.config.site || {};
    var navigation = (template.config.navigation || [])
      .filter(function filterVisible(item) {
        return item.visible;
      })
      .sort(function compare(a, b) {
        return a.order - b.order;
      });
    var currentPage = template.utils.getPageId();

    container.innerHTML =
      '<div class="container site-header__inner">' +
      '<a class="brand-link" href="index.html">' +
      (site.logoMarkPath
        ? '<img class="brand-link__mark" src="' +
          template.utils.escapeHtml(template.utils.resolveAssetPath(site.logoMarkPath)) +
          '" alt="' +
          template.utils.escapeHtml(site.logoAlt || site.siteName) +
          '">'
        : "") +
      '<span class="brand-link__copy">' +
      '<span class="brand-link__name">' + template.utils.escapeHtml(site.siteName) + "</span>" +
      '<span class="brand-link__tagline">' + template.utils.escapeHtml(site.tagline) + "</span>" +
      "</span></a>" +
      '<button class="button button--secondary site-nav__toggle" type="button" aria-expanded="false" aria-controls="primary-navigation">Menu</button>' +
      '<nav class="site-nav" aria-label="Primary navigation">' +
      '<ul class="site-nav__list" id="primary-navigation">' +
      navigation.map(function mapItem(item) {
        var buttonClass = item.isButtonStyle ? " site-nav__link--button" : "";
        var current = item.id === currentPage ? ' aria-current="page"' : "";
        var target = item.openInNewTab ? ' target="_blank" rel="noreferrer"' : "";

        return (
          '<li class="site-nav__item">' +
          '<a class="site-nav__link' +
          buttonClass +
          '" href="' +
          template.utils.escapeHtml(item.href) +
          '"' +
          current +
          target +
          ">" +
          template.utils.escapeHtml(item.label) +
          "</a></li>"
        );
      }).join("") +
      "</ul>" +
      "</nav>" +
      "</div>";

    bindMobileMenu(container);
  }

  function bindMobileMenu(container) {
    var toggle = container.querySelector(".site-nav__toggle");
    var nav = container.querySelector(".site-nav");
    var navLinks = container.querySelectorAll(".site-nav__link");

    if (!toggle || !nav) {
      return;
    }

    function closeMenu() {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("is-menu-open");
    }

    toggle.addEventListener("click", function handleToggle() {
      var isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      document.body.classList.toggle("is-menu-open", isOpen);
    });

    navLinks.forEach(function addHandler(link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function handleKeydown(event) {
      if (event.key === "Escape") {
        closeMenu();
      }
    });
  }

  template.nav = {
    renderHeader: renderHeader
  };
})(window.SiteTemplate);
