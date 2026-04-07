/*
 * ENTERPRISE STATIC SERVICE SITE TEMPLATE
 * CORE SYSTEM LOGIC: downloadable summary assembly without heavy PDF tooling
 * SAFE TO EDIT: labels and copy belong in config
 */

window.SiteTemplate = window.SiteTemplate || {};

(function bootstrapQuoteDownload(template) {
  function buildSummaryHtml(state, result) {
    var site = template.config.site || {};
    var downloadConfig = (template.config.quote && template.config.quote.download) || {};
    var lead = state.leadGateData || {};
    var escapeHtml = template.utils.escapeHtml;
    var addressLines = [
      site.addressLine1,
      site.addressLine2,
      [site.city, site.state, site.postalCode].filter(Boolean).join(", "),
      site.country
    ].filter(Boolean);

    return (
      "<!doctype html>" +
      '<html lang="en">' +
      "<head>" +
      '<meta charset="utf-8">' +
      '<meta name="viewport" content="width=device-width, initial-scale=1">' +
      "<title>" + escapeHtml(downloadConfig.title || "Estimate Summary") + "</title>" +
      "<style>" +
      "body{font-family:Helvetica,Arial,sans-serif;background:#ffffff;color:#111111;margin:0;padding:2rem;line-height:1.6;}" +
      "main{max-width:56rem;margin:0 auto;display:grid;gap:1.5rem;}" +
      "section{border:1px solid #d5d7dd;padding:1.25rem;}" +
      "h1,h2{line-height:1.15;margin:0 0 0.75rem 0;}" +
      "p,li{margin:0.35rem 0;}" +
      "ul{padding-left:1.25rem;margin:0;}" +
      ".meta{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem;}" +
      ".muted{color:#4b5563;font-size:0.95rem;}" +
      "@media print{body{padding:1rem;}section{break-inside:avoid;}}" +
      "</style>" +
      "</head><body><main>" +
      "<section>" +
      "<p class='muted'>" + escapeHtml(site.siteName) + "</p>" +
      "<h1>" + escapeHtml(downloadConfig.title || "Estimate Summary") + "</h1>" +
      "<p class='muted'>Generated " + escapeHtml(result.resultTimestamp) + "</p>" +
      "</section>" +
      "<section><div class='meta'>" +
      "<div><h2>Lead</h2><p>" + escapeHtml(lead.name || lead.company || "Not provided") + "</p>" +
      (lead.company && lead.name ? "<p class='muted'>" + escapeHtml(lead.company) + "</p>" : "") +
      (lead.email ? "<p>" + escapeHtml(lead.email) + "</p>" : "") +
      (lead.phone ? "<p>" + escapeHtml(lead.phone) + "</p>" : "") +
      "</div>" +
      "<div><h2>Estimate</h2><p><strong>" + escapeHtml(result.recommendedTierLabel) + "</strong></p>" +
      "<p>" + escapeHtml(result.estimateRangeText) + "</p></div>" +
      "</div></section>" +
      "<section><h2>Scope Summary</h2><p>" + escapeHtml(result.scopeSummary) + "</p></section>" +
      "<section><h2>Detailed Scope</h2><ul>" +
      result.breakdown.map(function mapItem(item) {
        return "<li>" + escapeHtml(item) + "</li>";
      }).join("") +
      "</ul></section>" +
      "<section><h2>Selected Answers</h2><ul>" +
      result.answerSummary.map(function mapItem(item) {
        return "<li>" + escapeHtml(item) + "</li>";
      }).join("") +
      "</ul></section>" +
      "<section><h2>Assumptions</h2><ul>" +
      result.assumptions.map(function mapItem(item) {
        return "<li>" + escapeHtml(item) + "</li>";
      }).join("") +
      "</ul><p class='muted'>" + escapeHtml(result.disclaimer) + "</p></section>" +
      "<section><h2>Suggested Next Steps</h2><ul>" +
      result.nextSteps.map(function mapItem(item) {
        return "<li>" + escapeHtml(item) + "</li>";
      }).join("") +
      "</ul></section>" +
      "<section><h2>Contact</h2>" +
      "<p>" + escapeHtml(site.primaryEmail) + "</p>" +
      "<p>" + escapeHtml(site.primaryPhone) + "</p>" +
      "<p>" + addressLines.map(escapeHtml).join("<br>") + "</p>" +
      "</section>" +
      "</main></body></html>"
    );
  }

  function downloadSummary(state, result) {
    var html = buildSummaryHtml(state, result);
    var blob = new Blob([html], { type: "text/html" });
    var url = URL.createObjectURL(blob);
    var anchor = document.createElement("a");
    var prefix = (template.config.quote && template.config.quote.download && template.config.quote.download.fileNamePrefix) || "estimate";

    anchor.href = url;
    anchor.download = prefix + "-" + result.recommendedTierId + ".html";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    setTimeout(function revokeUrl() {
      URL.revokeObjectURL(url);
    }, 500);
  }

  function printSummary(state, result) {
    var summaryWindow = window.open("", "_blank", "noopener,noreferrer,width=1000,height=800");
    if (!summaryWindow) {
      return;
    }

    summaryWindow.document.open();
    summaryWindow.document.write(buildSummaryHtml(state, result));
    summaryWindow.document.close();
    summaryWindow.focus();
    summaryWindow.print();
  }

  template.quoteDownload = {
    buildSummaryHtml: buildSummaryHtml,
    downloadSummary: downloadSummary,
    printSummary: printSummary
  };
})(window.SiteTemplate);
