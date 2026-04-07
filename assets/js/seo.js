/*
 * ENTERPRISE STATIC SERVICE SITE TEMPLATE
 * CORE SYSTEM LOGIC: config-driven metadata hydration for static pages
 * EDIT WITH CARE: this file intentionally avoids framework or build-time SEO tooling
 */

window.SiteTemplate = window.SiteTemplate || {};

(function bootstrapSeo(template) {
  function getSeoConfig() {
    return template.config.seo || {};
  }

  function getSiteConfig() {
    return template.config.site || {};
  }

  function getPageId() {
    return document.documentElement.dataset.page || "";
  }

  function ensureMeta(attribute, name) {
    var selector = 'meta[' + attribute + '="' + name + '"]';
    var existing = document.head.querySelector(selector);

    if (existing) {
      return existing;
    }

    var meta = document.createElement("meta");
    meta.setAttribute(attribute, name);
    document.head.appendChild(meta);
    return meta;
  }

  function ensureLink(rel) {
    var existing = document.head.querySelector('link[rel="' + rel + '"]');

    if (existing) {
      return existing;
    }

    var link = document.createElement("link");
    link.setAttribute("rel", rel);
    document.head.appendChild(link);
    return link;
  }

  function assetUrl(assetPath) {
    var seoConfig = getSeoConfig();

    if (!assetPath) {
      return "";
    }

    if (/^https?:/i.test(assetPath)) {
      return assetPath;
    }

    return String(seoConfig.siteUrl || "").replace(/\/$/, "") + "/assets/" + assetPath.replace(/^\/+/, "");
  }

  function canonicalUrl(path) {
    var seoConfig = getSeoConfig();
    return String(seoConfig.siteUrl || "").replace(/\/$/, "") + path;
  }

  function applyPageMetadata() {
    var seoConfig = getSeoConfig();
    var siteConfig = getSiteConfig();
    var pageId = getPageId();
    var override = (seoConfig.pageOverrides && seoConfig.pageOverrides[pageId]) || {};
    var resolvedTitle = override.title
      ? override.title + (seoConfig.titleSuffix || "")
      : seoConfig.defaultTitle || siteConfig.siteName;
    var resolvedDescription = override.description || seoConfig.defaultDescription || siteConfig.shortDescription;
    var resolvedCanonical = canonicalUrl(override.canonicalPath || "/");
    var resolvedRobots = override.robots || seoConfig.defaultRobots || "index,follow";
    var resolvedOgTitle = override.ogTitle || resolvedTitle;
    var resolvedOgDescription = override.ogDescription || resolvedDescription;
    var resolvedOgImage = assetUrl(override.ogImage || seoConfig.defaultOgImage || siteConfig.ogImagePath);

    document.title = resolvedTitle;
    ensureMeta("name", "description").setAttribute("content", resolvedDescription);
    ensureMeta("name", "robots").setAttribute("content", resolvedRobots);
    ensureMeta("property", "og:type").setAttribute("content", "website");
    ensureMeta("property", "og:title").setAttribute("content", resolvedOgTitle);
    ensureMeta("property", "og:description").setAttribute("content", resolvedOgDescription);
    ensureMeta("property", "og:url").setAttribute("content", resolvedCanonical);
    ensureMeta("property", "og:image").setAttribute("content", resolvedOgImage);
    ensureMeta("name", "twitter:card").setAttribute("content", "summary_large_image");
    ensureMeta("name", "twitter:title").setAttribute("content", resolvedOgTitle);
    ensureMeta("name", "twitter:description").setAttribute("content", resolvedOgDescription);
    ensureMeta("name", "twitter:image").setAttribute("content", resolvedOgImage);
    ensureLink("canonical").setAttribute("href", resolvedCanonical);

    var favicon = ensureLink("icon");
    favicon.setAttribute("href", (document.documentElement.dataset.assetRoot || "assets/") + siteConfig.faviconPath);

    var appleTouch = ensureLink("apple-touch-icon");
    appleTouch.setAttribute("href", (document.documentElement.dataset.assetRoot || "assets/") + siteConfig.appleTouchIconPath);

    applyStructuredData(resolvedCanonical, resolvedOgImage);
  }

  function applyStructuredData(pageUrl, imageUrl) {
    var seoConfig = getSeoConfig();
    var siteConfig = getSiteConfig();
    var id = "site-structured-data";
    var existing = document.getElementById(id);
    var payload = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: seoConfig.organizationName || siteConfig.legalName || siteConfig.siteName,
      url: String(seoConfig.siteUrl || "").replace(/\/$/, ""),
      logo: assetUrl(seoConfig.organizationLogo || siteConfig.logoPath),
      image: imageUrl,
      sameAs: seoConfig.socialProfiles || [],
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "sales",
          email: siteConfig.primaryEmail,
          telephone: siteConfig.primaryPhone
        }
      ]
    };

    if (!existing) {
      existing = document.createElement("script");
      existing.type = "application/ld+json";
      existing.id = id;
      document.head.appendChild(existing);
    }

    existing.textContent = JSON.stringify(payload);

    var websiteId = "site-website-structured-data";
    var websiteScript = document.getElementById(websiteId);
    var websitePayload = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteConfig.siteName,
      url: String(seoConfig.siteUrl || "").replace(/\/$/, ""),
      description: seoConfig.defaultDescription || siteConfig.shortDescription,
      potentialAction: {
        "@type": "ViewAction",
        target: pageUrl
      }
    };

    if (!websiteScript) {
      websiteScript = document.createElement("script");
      websiteScript.type = "application/ld+json";
      websiteScript.id = websiteId;
      document.head.appendChild(websiteScript);
    }

    websiteScript.textContent = JSON.stringify(websitePayload);
  }

  template.seo = {
    applyPageMetadata: applyPageMetadata
  };

  applyPageMetadata();
})(window.SiteTemplate);
