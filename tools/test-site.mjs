import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const sourceHtmlFiles = [
  "site/index.html",
  "site/services.html",
  "site/quote.html",
  "site/about.html",
  "site/contact.html",
  "site/privacy.html",
  "site/terms.html",
  "site/articles.html",
  "site/misc.html",
  "site/404.html"
];

const requiredFiles = [
  ...sourceHtmlFiles,
  "assets/css/styles.css",
  "assets/css/components.css",
  "assets/css/utilities.css",
  "assets/css/print.css",
  "assets/js/app.js",
  "assets/js/nav.js",
  "assets/js/renderers.js",
  "assets/js/form-handlers.js",
  "assets/js/scheduler.js",
  "assets/js/seo.js",
  "assets/js/quote-engine.js",
  "assets/js/quote-ui.js",
  "assets/js/quote-download.js",
  "assets/js/config/site-config.js",
  "assets/js/config/nav-config.js",
  "assets/js/config/services-config.js",
  "assets/js/config/testimonials-config.js",
  "assets/js/config/contact-config.js",
  "assets/js/config/scheduler-config.js",
  "assets/js/config/quote-config.js",
  "assets/js/config/seo-config.js",
  "assets/js/config/articles-config.js",
  "assets/js/config/misc-config.js",
  "assets/img/branding/logo.svg",
  "assets/img/branding/logo-mark.svg",
  "assets/img/branding/favicon.ico",
  "assets/img/branding/apple-touch-icon.png",
  "assets/img/branding/og-image-default.jpg",
  ".github/workflows/deploy-pages.yml",
  "docs/QUICKSTART.txt",
  "docs/EDITING_GUIDE.txt",
  "docs/DEPLOY_GITHUB_PAGES.txt",
  "docs/FORMSPREE_SETUP.txt",
  "docs/GOOGLE_CALENDAR_SETUP.txt",
  "docs/SITE_ARCHITECTURE.txt",
  "docs/STYLE_GUIDE.txt",
  "docs/CONTENT_MODEL.txt",
  "docs/QUOTE_ENGINE_RULES.txt",
  "docs/CHANGELOG.txt",
  "tools/build-site.mjs"
];

function fail(message) {
  throw new Error(message);
}

function assert(condition, message) {
  if (!condition) {
    fail(message);
  }
}

function resolveFromRoot(relativePath) {
  return path.join(rootDir, relativePath);
}

function runNodeSyntaxCheck(filePath) {
  const result = spawnSync("node", ["--check", resolveFromRoot(filePath)], { encoding: "utf8" });
  assert(result.status === 0, `Syntax check failed for ${filePath}\n${result.stderr}`);
}

function readFile(relativePath) {
  return fs.readFileSync(resolveFromRoot(relativePath), "utf8");
}

function extractAssetPaths(html) {
  const matches = [...html.matchAll(/(?:src|href)="([^"#?]+)"/g)];
  return matches.map((match) => match[1]).filter((value) => {
    return !value.startsWith("mailto:") && !value.startsWith("tel:") && !value.startsWith("http");
  });
}

function checkRelativeAssetPaths(htmlPath) {
  const html = readFile(htmlPath);
  const htmlDir = path.dirname(resolveFromRoot(htmlPath));
  extractAssetPaths(html).forEach((relativeAssetPath) => {
    const resolvedPath = path.resolve(htmlDir, relativeAssetPath);
    assert(fs.existsSync(resolvedPath), `Broken asset reference in ${htmlPath}: ${relativeAssetPath}`);
  });
}

function checkHtmlShellStructure(htmlPath) {
  const html = readFile(htmlPath);
  assert(/<header[^>]*data-site-header/.test(html), `${htmlPath} is missing the shared header target.`);
  assert(/<main[^>]*id="main-content"/.test(html), `${htmlPath} is missing the main content region.`);
  assert(/<footer[^>]*data-site-footer/.test(html), `${htmlPath} is missing the shared footer target.`);
  assert(/class="skip-link"/.test(html), `${htmlPath} is missing the skip link.`);
}

function buildDist() {
  const result = spawnSync("node", [resolveFromRoot("tools/build-site.mjs")], {
    cwd: rootDir,
    encoding: "utf8"
  });
  assert(result.status === 0, `Build failed\n${result.stderr}`);
}

function checkDistOutput() {
  assert(fs.existsSync(resolveFromRoot("dist/.nojekyll")), "Missing dist/.nojekyll publish marker.");

  sourceHtmlFiles.forEach((sourcePath) => {
    const fileName = path.basename(sourcePath);
    const distPath = resolveFromRoot(path.join("dist", fileName));
    assert(fs.existsSync(distPath), `Missing dist output for ${fileName}`);

    const builtHtml = fs.readFileSync(distPath, "utf8");
    assert(!builtHtml.includes("../assets/"), `${fileName} still contains source asset paths after build.`);
    assert(builtHtml.includes('data-asset-root="assets/"'), `${fileName} did not get its asset root rewritten.`);
  });
}

function createTemplateContext() {
  const documentHeadNodes = [];
  const head = {
    querySelector() {
      return null;
    },
    appendChild(node) {
      documentHeadNodes.push(node);
      return node;
    }
  };

  const document = {
    documentElement: { dataset: { assetRoot: "assets/", page: "quote" } },
    body: { dataset: { page: "quote" }, classList: { add() {}, remove() {}, toggle() {} } },
    head,
    addEventListener() {},
    querySelector() {
      return null;
    },
    createElement(tagName) {
      return {
        tagName,
        attributes: {},
        textContent: "",
        setAttribute(name, value) {
          this.attributes[name] = value;
        },
        getAttribute(name) {
          return this.attributes[name];
        },
        appendChild() {},
        querySelector() {
          return null;
        }
      };
    },
    getElementById(id) {
      return documentHeadNodes.find((node) => node.id === id) || null;
    }
  };

  const context = {
    console,
    setTimeout,
    clearTimeout,
    window: null,
    document
  };

  context.window = context;
  context.SiteTemplate = {
    config: {},
    utils: {
      formatRange(range) {
        const formatter = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0
        });
        return `${formatter.format(range[0])} to ${formatter.format(range[1])}`;
      },
      escapeHtml(value) {
        return String(value || "")
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#39;");
      }
    }
  };

  vm.createContext(context);
  return context;
}

function runInContext(context, relativePath) {
  const code = readFile(relativePath);
  vm.runInContext(code, context, { filename: relativePath });
}

function loadLogicContext() {
  const context = createTemplateContext();
  [
    "assets/js/config/site-config.js",
    "assets/js/config/nav-config.js",
    "assets/js/config/services-config.js",
    "assets/js/config/testimonials-config.js",
    "assets/js/config/contact-config.js",
    "assets/js/config/scheduler-config.js",
    "assets/js/config/quote-config.js",
    "assets/js/config/seo-config.js",
    "assets/js/config/articles-config.js",
    "assets/js/config/misc-config.js",
    "assets/js/form-handlers.js",
    "assets/js/scheduler.js",
    "assets/js/quote-engine.js"
  ].forEach((filePath) => {
    runInContext(context, filePath);
  });

  return context;
}

function runContractTests() {
  const context = loadLogicContext();
  const template = context.SiteTemplate;
  const services = template.config.services.items;
  const navItems = template.config.navigation;
  const testimonials = template.config.testimonials;
  const quoteEngine = template.quoteEngine;
  const forms = template.forms;
  const scheduler = template.scheduler;

  assert(services.length >= 3 && services.length <= 7, "Services must default to between 3 and 7 tiers.");
  assert((template.config.site.heroCtas || []).length >= 1 && (template.config.site.heroCtas || []).length <= 3, "Hero CTA count must stay between 1 and 3.");
  assert(navItems.find((item) => item.id === "articles").visible === false, "Articles must be hidden from public nav by default.");
  assert(navItems.find((item) => item.id === "misc").visible === false, "Misc must be hidden from public nav by default.");
  assert(navItems.find((item) => item.id === "privacy").footerVisible === true, "Privacy must remain footer-only by default.");
  assert(navItems.find((item) => item.id === "terms").footerVisible === true, "Terms must remain footer-only by default.");
  assert(testimonials.some((item) => item.simplifiedMode === true), "At least one testimonial must exercise simplified mode.");
  assert(testimonials.some((item) => item.simplifiedMode === false), "At least one testimonial must exercise rich mode.");

  const state = quoteEngine.createInitialState();
  quoteEngine.setAnswer(state, "engagementGoal", "scale");
  quoteEngine.setAnswer(state, "teamSize", "team_200_plus");
  quoteEngine.setAnswer(state, "activeClients", 120);
  quoteEngine.setAnswer(state, "deliveryModel", "embedded_partner");
  quoteEngine.setAnswer(state, "timeline", "immediate");
  assert(quoteEngine.getNextQuestionId("timeline", state.answers) === "targetStartDate", "Immediate timeline should branch to targetStartDate.");
  quoteEngine.setAnswer(state, "targetStartDate", "2026-05-01");
  quoteEngine.setAnswer(state, "needsCompliance", true);
  assert(quoteEngine.getNextQuestionId("needsCompliance", state.answers) === "complianceFocus", "Compliance flag should branch to complianceFocus.");
  quoteEngine.setAnswer(state, "complianceFocus", ["security", "vendor"]);
  quoteEngine.setAnswer(state, "primaryConstraint", "alignment");
  quoteEngine.setAnswer(state, "initiativeLabel", "Delivery reset");
  quoteEngine.setAnswer(state, "additionalContext", "Board review due this month.");

  const result = quoteEngine.generateResult(state);
  assert(result.recommendedTierId === "partner", "High-complexity answers should recommend the partner tier.");
  assert(Array.isArray(result.breakdown) && result.breakdown.length >= 4, "Quote result must include a detailed breakdown.");
  assert(Array.isArray(result.assumptions) && result.assumptions.length >= 2, "Quote result must include assumptions.");
  assert(Array.isArray(result.nextSteps) && result.nextSteps.length >= 2, "Quote result must include next steps.");
  assert(result.estimateRange[0] < result.estimateRange[1], "Estimate range must be ordered correctly.");
  assert(result.answerSummary.length >= 6, "Quote result must summarize selected answers.");

  quoteEngine.setAnswer(state, "timeline", "later");
  assert(!("targetStartDate" in state.answers), "Changing the branch should prune invalid downstream answers.");

  const invalidLead = forms.validateLeadGateData({ name: "", company: "", email: "", phone: "" });
  assert(invalidLead.valid === false, "Lead gate must reject empty identity and contact data.");
  const validLead = forms.validateLeadGateData({ company: "Example Co", email: "", phone: "555-0100", name: "" });
  assert(validLead.valid === true, "Lead gate must accept company plus phone.");
  const invalidContact = forms.validateContactData({ name: "", email: "", message: "" });
  assert(invalidContact.valid === false, "Contact form validation must reject missing required fields.");

  const quoteSchedulerContainer = { innerHTML: "" };
  scheduler.renderScheduler(quoteSchedulerContainer, { context: "quote" });
  assert(quoteSchedulerContainer.innerHTML.includes(template.config.scheduler.fallbackLinkLabel), "Quote scheduler fallback should render when using external-link mode.");

  template.config.scheduler.mode = "INLINE_EMBED";
  template.config.scheduler.embedHtml = "<iframe title='Scheduler'></iframe>";
  const inlineSchedulerContainer = { innerHTML: "" };
  scheduler.renderScheduler(inlineSchedulerContainer, { context: "quote" });
  assert(inlineSchedulerContainer.innerHTML.includes("iframe"), "Inline scheduler mode should render the embed.");
}

function runAllChecks() {
  requiredFiles.forEach((relativePath) => {
    assert(fs.existsSync(resolveFromRoot(relativePath)), `Missing required file: ${relativePath}`);
  });

  sourceHtmlFiles.forEach((htmlPath) => {
    checkHtmlShellStructure(htmlPath);
    checkRelativeAssetPaths(htmlPath);
  });

  [
    "assets/js/app.js",
    "assets/js/nav.js",
    "assets/js/renderers.js",
    "assets/js/form-handlers.js",
    "assets/js/scheduler.js",
    "assets/js/seo.js",
    "assets/js/quote-engine.js",
    "assets/js/quote-ui.js",
    "assets/js/quote-download.js",
    "tools/build-site.mjs",
    "tools/test-site.mjs"
  ].forEach(runNodeSyntaxCheck);

  buildDist();
  checkDistOutput();
  runContractTests();
}

try {
  runAllChecks();
  console.log("All static site checks passed.");
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
