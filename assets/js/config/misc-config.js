/*
 * APERTURE — B2B REVENUE INTELLIGENCE PLATFORM
 * SAFE TO EDIT: trust center / reference content surface for hidden page
 * EDIT WITH CARE: keep content simple and reusable
 */

window.SiteTemplate = window.SiteTemplate || {};
window.SiteTemplate.config = window.SiteTemplate.config || {};

window.SiteTemplate.config.misc = {
  eyebrow: "Trust and reference",
  title: "Aperture trust center",
  body:
    "Reference materials for procurement, security, and compliance reviews. Updated when the underlying program changes.",
  blocks: [
    {
      title: "Security and certifications",
      items: [
        "SOC 2 Type II report (latest available on request)",
        "ISO 27001 certification",
        "Quarterly third-party penetration testing",
        "Single-tenant deployment available on Enterprise"
      ]
    },
    {
      title: "Data handling",
      items: [
        "Customer data isolated per tenant",
        "Regional data residency in US, EU, and AU",
        "BYO encryption keys via KMS for Enterprise",
        "No customer data used to train shared models"
      ]
    }
  ]
};
