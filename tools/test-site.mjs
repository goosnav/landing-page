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
    "assets/js/quote-engine.js",
    "assets/js/renderers.js"
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

  const homePageConfig = template.config.site.homePage || {};
  assert(homePageConfig.differentiatorsHeader && homePageConfig.differentiatorsHeader.title, "site-config homePage must define differentiatorsHeader so renderers stay business-neutral.");
  assert(homePageConfig.processHeader && homePageConfig.processHeader.title, "site-config homePage must define processHeader so renderers stay business-neutral.");
  assert(homePageConfig.servicesHeader && homePageConfig.servicesHeader.title, "site-config homePage must define servicesHeader so renderers stay business-neutral.");
  assert(homePageConfig.testimonialsHeader && homePageConfig.testimonialsHeader.title, "site-config homePage must define testimonialsHeader so renderers stay business-neutral.");
  assert(template.config.services.testimonialsHeader && template.config.services.testimonialsHeader.title, "services-config must define testimonialsHeader so the services page stays business-neutral.");
  assert(template.config.services.comparisonMatrix && template.config.services.comparisonMatrix.header && template.config.services.comparisonMatrix.header.title, "services-config comparisonMatrix must define a header so renderers stay business-neutral.");
  assert(template.config.site.aboutPage && template.config.site.aboutPage.engagementModelHeading, "site-config aboutPage must define engagementModelHeading so the renderer stays business-neutral.");
  assert(template.config.site.aboutPage && template.config.site.aboutPage.trustMarkersHeading, "site-config aboutPage must define trustMarkersHeading so the renderer stays business-neutral.");
  const notFoundConfig = template.config.site.notFoundPage || null;
  assert(notFoundConfig && notFoundConfig.title && notFoundConfig.primaryCta, "site-config must define notFoundPage with a title and primaryCta so the 404 renderer stays business-neutral.");
  const formLabels = template.config.contact.formLabels || null;
  assert(formLabels && formLabels.sectionHeading && formLabels.submitLabel, "contact-config must define formLabels with sectionHeading and submitLabel so the renderer stays business-neutral.");
  assert(template.config.misc && template.config.misc.eyebrow, "misc-config must define an eyebrow so the renderer stays business-neutral.");
  const quoteExperience = template.config.quote.experience || {};
  assert(quoteExperience.pageIntro && quoteExperience.pageIntro.title, "quote-config experience must define pageIntro so app.js does not hardcode the quote intro copy.");

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

  const quoteUiSource = readFile("assets/js/quote-ui.js");
  assert(quoteUiSource.includes("data-option-input"), "quote-ui.js must mark option inputs so the change listener can find them.");
  assert(quoteUiSource.includes("data-option-button"), "quote-ui.js must mark option button labels so .is-selected can be toggled.");
  assert(quoteUiSource.includes("syncOptionSelectionState"), "quote-ui.js must keep .is-selected in sync with the underlying input state on change.");
  assert(/form\.addEventListener\("change"/.test(quoteUiSource), "quote-ui.js must register a change listener so visual selection follows clicks.");
  assert(quoteUiSource.includes("heading.focus"), "quote-ui.js must move focus to the new question heading after advancing.");

  const componentsCss = readFile("assets/css/components.css");
  assert(componentsCss.includes("cursor: pointer"), "components.css must give .option-button a pointer cursor so it reads as clickable.");
  assert(/\.option-button:hover/.test(componentsCss), "components.css must define a hover state for .option-button so users get rollover feedback.");
  assert(/\.option-button:has\(input:checked\)/.test(componentsCss), "components.css must style the selected option via :has(input:checked) so the visual state always tracks the radio.");
  assert(/\.option-button:focus-within/.test(componentsCss), "components.css must give .option-button a visible focus ring for keyboard users.");

  runRendererSnapshotTests(template);
  runQuoteEngineScenarioTests(template);
  runSeoConfigIntegrityTests(template);
  runNavigationConfigIntegrityTests(template);
  runSchedulerConfigIntegrityTests(template);
  runFormHelperTests(template);
  runHtmlHeadHarmonizationTests(template);
  runProcessGridSizingTests(template);
}

function makeContainer() {
  return { innerHTML: "" };
}

function escapeForHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function runRendererSnapshotTests(template) {
  const renderers = template.renderers;
  assert(renderers && typeof renderers.renderHero === "function", "Renderers must be exported on template.renderers.");

  const hero = makeContainer();
  renderers.renderHero(hero);
  assert(hero.innerHTML.includes("hero__copy"), "renderHero must emit the hero copy block.");
  assert(hero.innerHTML.includes("hero-panel"), "renderHero must emit the hero side panel when visualPanel is configured.");
  assert(hero.innerHTML.includes(escapeForHtml(template.config.site.homePage.hero.headline)), "renderHero must include the configured headline.");
  template.config.site.heroCtas.forEach((cta) => {
    assert(hero.innerHTML.includes(escapeForHtml(cta.label)), `renderHero must include hero CTA label "${cta.label}".`);
  });

  const differentiators = makeContainer();
  renderers.renderDifferentiators(differentiators);
  template.config.site.homePage.differentiators.forEach((item) => {
    assert(differentiators.innerHTML.includes(escapeForHtml(item.title)), `renderDifferentiators must include "${item.title}".`);
  });

  const process = makeContainer();
  renderers.renderProcess(process);
  template.config.site.homePage.processSteps.forEach((step, index) => {
    assert(process.innerHTML.includes(escapeForHtml(step.title)), `renderProcess must include step title "${step.title}".`);
    assert(process.innerHTML.includes(`Step ${index + 1}`), `renderProcess must label step ${index + 1}.`);
  });

  const services = makeContainer();
  renderers.renderServicePage(services);
  template.config.services.items
    .filter((item) => item.visible !== false)
    .forEach((item) => {
      assert(services.innerHTML.includes(escapeForHtml(item.title)), `renderServicePage must include service "${item.title}".`);
    });

  const summary = makeContainer();
  renderers.renderServiceSummary(summary);
  assert(summary.innerHTML.includes("card-grid"), "renderServiceSummary must emit a card-grid wrapper.");

  const matrix = makeContainer();
  renderers.renderComparisonMatrix(matrix);
  assert(matrix.innerHTML.includes("<table>"), "renderComparisonMatrix must emit a table when enabled.");
  template.config.services.comparisonMatrix.rows.forEach((row) => {
    assert(matrix.innerHTML.includes(escapeForHtml(row.label)), `Comparison matrix must include row "${row.label}".`);
  });

  const testimonials = makeContainer();
  renderers.renderTestimonials(testimonials, "featuredOnHome", template.config.site.homePage.testimonialsHeader);
  const featuredHomeTestimonials = template.config.testimonials.filter((item) => item.featuredOnHome && item.visible !== false);
  assert(featuredHomeTestimonials.length >= 1, "There must be at least one home-featured testimonial.");
  featuredHomeTestimonials.forEach((item) => {
    assert(testimonials.innerHTML.includes(escapeForHtml(item.personName)), `renderTestimonials should include "${item.personName}".`);
  });

  const ctaStrip = makeContainer();
  renderers.renderCtaStrip(ctaStrip, template.config.site.homePage.ctaStrip);
  assert(ctaStrip.innerHTML.includes(escapeForHtml(template.config.site.homePage.ctaStrip.title)), "renderCtaStrip must include the configured title.");
  assert(ctaStrip.innerHTML.includes(escapeForHtml(template.config.site.homePage.ctaStrip.primaryCta.label)), "renderCtaStrip must include the primary CTA label.");

  const about = makeContainer();
  renderers.renderAboutPage(about);
  assert(about.innerHTML.includes(escapeForHtml(template.config.site.aboutPage.intro.title)), "renderAboutPage must include the configured intro title.");
  assert(about.innerHTML.includes(escapeForHtml(template.config.site.aboutPage.engagementModelHeading)), "renderAboutPage must surface the engagement model heading.");
  assert(about.innerHTML.includes(escapeForHtml(template.config.site.aboutPage.trustMarkersHeading)), "renderAboutPage must surface the trust markers heading.");

  const legal = makeContainer();
  renderers.renderLegalPage(legal, template.config.site.privacyPage, "Privacy Policy");
  assert(legal.innerHTML.includes("Privacy Policy"), "renderLegalPage must include the page title.");
  template.config.site.privacyPage.sections.forEach((section) => {
    assert(legal.innerHTML.includes(escapeForHtml(section.title)), `Privacy page must include section "${section.title}".`);
  });

  const contact = makeContainer();
  renderers.renderContactPage(contact);
  const contactConfig = template.config.contact;
  assert(contact.innerHTML.includes(escapeForHtml(contactConfig.formLabels.sectionHeading)), "renderContactPage must include the configured section heading.");
  assert(contact.innerHTML.includes(escapeForHtml(contactConfig.formLabels.submitLabel)), "renderContactPage must include the submit label.");
  assert(contact.innerHTML.includes("data-contact-form"), "renderContactPage must mark the contact form for binding.");
  assert(contact.innerHTML.includes(escapeForHtml(template.config.site.primaryEmail)), "renderContactPage must surface the contact email address.");

  const articles = makeContainer();
  renderers.renderArticlesPage(articles);
  template.config.articles.items.forEach((item) => {
    if (item.visible !== false) {
      assert(articles.innerHTML.includes(escapeForHtml(item.title)), `Articles page must include "${item.title}".`);
    }
  });

  const misc = makeContainer();
  renderers.renderMiscPage(misc);
  assert(misc.innerHTML.includes(escapeForHtml(template.config.misc.title)), "renderMiscPage must include the configured title.");

  const notFound = makeContainer();
  renderers.renderNotFound(notFound);
  assert(notFound.innerHTML.includes(escapeForHtml(template.config.site.notFoundPage.title)), "renderNotFound must include the configured title.");
  assert(notFound.innerHTML.includes(escapeForHtml(template.config.site.notFoundPage.primaryCta.label)), "renderNotFound must include the primary CTA label.");

  const footer = makeContainer();
  renderers.renderFooter(footer);
  assert(footer.innerHTML.includes(escapeForHtml(template.config.site.siteName)), "renderFooter must include the brand name.");
  assert(footer.innerHTML.includes(escapeForHtml(template.config.site.tagline)), "renderFooter must include the brand tagline.");
  assert(footer.innerHTML.includes("Privacy"), "renderFooter must surface footer-visible nav items.");
  assert(footer.innerHTML.includes("Terms"), "renderFooter must surface footer-visible nav items.");
}

function runQuoteEngineScenarioTests(template) {
  const quoteEngine = template.quoteEngine;
  const tierOrder = template.config.quote.tierOrder;
  const baseRanges = template.config.quote.estimateModel.baseRanges;
  tierOrder.forEach((tierId) => {
    assert(Array.isArray(baseRanges[tierId]), `Estimate model must define a base range for tier "${tierId}".`);
    assert(baseRanges[tierId][0] < baseRanges[tierId][1], `Base range for tier "${tierId}" must be ordered.`);
  });

  // Scenario A: small team, advisory_only, no compliance, "later" timeline → diagnostic tier.
  const scenarioA = quoteEngine.createInitialState();
  quoteEngine.setAnswer(scenarioA, "engagementGoal", "stabilize");
  quoteEngine.setAnswer(scenarioA, "teamSize", "team_1_10");
  quoteEngine.setAnswer(scenarioA, "activeClients", 12);
  quoteEngine.setAnswer(scenarioA, "deliveryModel", "advisory_only");
  quoteEngine.setAnswer(scenarioA, "timeline", "later");
  quoteEngine.setAnswer(scenarioA, "needsCompliance", false);
  quoteEngine.setAnswer(scenarioA, "primaryConstraint", "reporting");
  const resultA = quoteEngine.generateResult(scenarioA);
  assert(resultA.recommendedTierId === "diagnostic", `Scenario A should recommend diagnostic tier, got "${resultA.recommendedTierId}".`);
  assert(resultA.estimateRange[0] >= baseRanges.diagnostic[0], "Scenario A lower bound must be at least the diagnostic base.");

  // Scenario B: medium team, sprint_program, modest compliance, this_quarter → program tier.
  const scenarioB = quoteEngine.createInitialState();
  quoteEngine.setAnswer(scenarioB, "engagementGoal", "modernize");
  quoteEngine.setAnswer(scenarioB, "teamSize", "team_11_50");
  quoteEngine.setAnswer(scenarioB, "activeClients", 240);
  quoteEngine.setAnswer(scenarioB, "deliveryModel", "sprint_program");
  quoteEngine.setAnswer(scenarioB, "timeline", "this_quarter");
  quoteEngine.setAnswer(scenarioB, "needsCompliance", false);
  quoteEngine.setAnswer(scenarioB, "primaryConstraint", "service_design");
  const resultB = quoteEngine.generateResult(scenarioB);
  assert(resultB.recommendedTierId === "program", `Scenario B should recommend program tier, got "${resultB.recommendedTierId}".`);
  assert(resultB.estimateRange[0] > resultA.estimateRange[0], "Scenario B should be more expensive than Scenario A.");

  // Scenario C: changing the immediate→later branch should drop targetStartDate from answers.
  const scenarioC = quoteEngine.createInitialState();
  quoteEngine.setAnswer(scenarioC, "engagementGoal", "scale");
  quoteEngine.setAnswer(scenarioC, "teamSize", "team_200_plus");
  quoteEngine.setAnswer(scenarioC, "activeClients", 800);
  quoteEngine.setAnswer(scenarioC, "deliveryModel", "embedded_partner");
  quoteEngine.setAnswer(scenarioC, "timeline", "immediate");
  quoteEngine.setAnswer(scenarioC, "targetStartDate", "2026-05-01");
  quoteEngine.setAnswer(scenarioC, "needsCompliance", false);
  quoteEngine.setAnswer(scenarioC, "primaryConstraint", "alignment");
  assert("targetStartDate" in scenarioC.answers, "targetStartDate should remain when timeline is immediate.");
  quoteEngine.setAnswer(scenarioC, "timeline", "later");
  assert(!("targetStartDate" in scenarioC.answers), "Switching timeline to later must prune targetStartDate.");

  // Lead-only tests covering both gate halves.
  const forms = template.forms;
  assert(forms.validateLeadGateData({ name: "Sam", email: "sam@example.com" }).valid === true, "Name + email should pass the lead gate.");
  assert(forms.validateLeadGateData({ name: "Sam", phone: "555-0101" }).valid === true, "Name + phone should pass the lead gate.");
  assert(forms.validateLeadGateData({ company: "Acme", phone: "555-0101" }).valid === true, "Company + phone should pass the lead gate.");
  assert(forms.validateLeadGateData({ company: "Acme" }).valid === false, "Company without contact channel must fail.");
  assert(forms.validateLeadGateData({ email: "sam@example.com" }).valid === false, "Email without identity must fail.");

  // Estimate range monotonicity: more compliance = more cost.
  const baseScenario = quoteEngine.createInitialState();
  quoteEngine.setAnswer(baseScenario, "engagementGoal", "modernize");
  quoteEngine.setAnswer(baseScenario, "teamSize", "team_51_200");
  quoteEngine.setAnswer(baseScenario, "activeClients", 400);
  quoteEngine.setAnswer(baseScenario, "deliveryModel", "sprint_program");
  quoteEngine.setAnswer(baseScenario, "timeline", "this_quarter");
  quoteEngine.setAnswer(baseScenario, "needsCompliance", false);
  quoteEngine.setAnswer(baseScenario, "primaryConstraint", "reporting");
  const baseRange = quoteEngine.calculateEstimateRange(baseScenario.answers, "program");

  const complianceScenario = quoteEngine.createInitialState();
  Object.assign(complianceScenario, { answers: Object.assign({}, baseScenario.answers) });
  quoteEngine.setAnswer(complianceScenario, "needsCompliance", true);
  quoteEngine.setAnswer(complianceScenario, "complianceFocus", ["security", "vendor"]);
  const complianceRange = quoteEngine.calculateEstimateRange(complianceScenario.answers, "program");
  assert(complianceRange[0] > baseRange[0], "Compliance requirements should increase the lower bound of the estimate.");
  assert(complianceRange[1] > baseRange[1], "Compliance requirements should increase the upper bound of the estimate.");

  // formatRange returns a string with currency formatting.
  const formattedRange = template.utils.formatRange([20000, 35000]);
  assert(formattedRange.includes("$20,000") && formattedRange.includes("$35,000"), "formatRange must produce currency-formatted output.");

  // Scope additions surface compliance breakdown.
  const breakdownWithCompliance = quoteEngine.buildBreakdown(complianceScenario.answers, "program");
  assert(breakdownWithCompliance.length > quoteEngine.buildBreakdown(baseScenario.answers, "program").length, "Compliance breakdown additions should expand the program scope.");
}

function runSeoConfigIntegrityTests(template) {
  const seo = template.config.seo;
  assert(seo, "seo-config must define a config object.");
  assert(typeof seo.siteUrl === "string" && seo.siteUrl.startsWith("http"), "seo-config siteUrl must be an absolute URL.");
  assert(typeof seo.defaultTitle === "string" && seo.defaultTitle.length > 0, "seo-config defaultTitle must be set.");
  assert(typeof seo.defaultDescription === "string" && seo.defaultDescription.length > 30, "seo-config defaultDescription must be a real sentence.");
  assert(typeof seo.titleSuffix === "string", "seo-config titleSuffix must be defined (may be empty).");
  const requiredPageIds = ["home", "services", "quote", "about", "contact", "privacy", "terms", "articles", "misc", "notFound"];
  requiredPageIds.forEach((pageId) => {
    const override = seo.pageOverrides && seo.pageOverrides[pageId];
    assert(override, `seo-config must define pageOverrides for "${pageId}".`);
    assert(typeof override.title === "string" && override.title.length > 0, `seo-config "${pageId}" override must include a title.`);
    assert(typeof override.description === "string" && override.description.length > 20, `seo-config "${pageId}" override must include a description.`);
    assert(typeof override.canonicalPath === "string" && override.canonicalPath.startsWith("/"), `seo-config "${pageId}" override canonicalPath must start with /.`);
  });
  assert(seo.pageOverrides.privacy.robots === "noindex,follow", "Privacy page must opt out of indexing.");
  assert(seo.pageOverrides.terms.robots === "noindex,follow", "Terms page must opt out of indexing.");
  assert(seo.pageOverrides.notFound.robots === "noindex,follow", "404 page must opt out of indexing.");
}

function runNavigationConfigIntegrityTests(template) {
  const nav = template.config.navigation || [];
  const requiredIds = ["home", "services", "quote", "about", "contact", "privacy", "terms"];
  requiredIds.forEach((id) => {
    assert(nav.find((item) => item.id === id), `nav-config must define an entry for "${id}".`);
  });
  nav.forEach((item) => {
    assert(typeof item.label === "string" && item.label.length > 0, `nav item "${item.id}" must have a label.`);
    assert(typeof item.href === "string" && item.href.endsWith(".html"), `nav item "${item.id}" href must end in .html.`);
    assert(typeof item.order === "number", `nav item "${item.id}" must define an order.`);
  });
  const orderedIds = nav.slice().sort((a, b) => a.order - b.order).map((item) => item.id);
  assert(orderedIds.indexOf("home") < orderedIds.indexOf("services"), "Home must come before Services in nav order.");
  assert(orderedIds.indexOf("services") < orderedIds.indexOf("quote"), "Services must come before Quote in nav order.");
}

function runSchedulerConfigIntegrityTests(template) {
  const config = template.config.scheduler || {};
  assert(["EXTERNAL_LINK", "INLINE_EMBED"].indexOf(config.mode) >= 0, "scheduler-config mode must be one of EXTERNAL_LINK or INLINE_EMBED.");
  if (config.mode === "EXTERNAL_LINK") {
    assert(typeof config.schedulerUrl === "string" && config.schedulerUrl.startsWith("http"), "scheduler-config schedulerUrl must be set when mode is EXTERNAL_LINK.");
  }
  assert(typeof config.schedulerHeading === "string" && config.schedulerHeading.length > 0, "scheduler-config schedulerHeading must be set.");
  assert(typeof config.fallbackLinkLabel === "string" && config.fallbackLinkLabel.length > 0, "scheduler-config fallbackLinkLabel must be set.");
}

function runFormHelperTests(template) {
  const forms = template.forms;
  assert(forms.isPlaceholderEndpoint("https://formspree.io/f/your-contact-form-id") === true, "Placeholder contact endpoint must be rejected.");
  assert(forms.isPlaceholderEndpoint("https://formspree.io/f/your-quote-form-id") === true, "Placeholder quote endpoint must be rejected.");
  assert(forms.isPlaceholderEndpoint("") === true, "Empty endpoint must be rejected.");
  assert(forms.isPlaceholderEndpoint("https://formspree.io/f/abc12345") === false, "Real-looking endpoint must be accepted.");

  const samplePayload = forms.buildQuoteLeadPayload({
    name: "Sam Operator",
    company: "Acme",
    email: "sam@example.com",
    phone: "555-0100",
    optIn: true,
    answers: { initiativeLabel: "FY27 Reset", additionalContext: "Board pressure" },
    result: {
      recommendedTierLabel: "Aperture Growth",
      estimateRangeText: "$60,000 to $110,000",
      scopeSummary: "Aperture Growth deployment",
      breakdown: ["Item A", "Item B"],
      assumptions: ["Assume X"],
      nextSteps: ["Next 1", "Next 2"],
      answerSummary: ["Q1: A1", "Q2: A2"],
      resultTimestamp: "2026-04-06T00:00:00.000Z"
    }
  });
  assert(samplePayload.lead_name === "Sam Operator", "buildQuoteLeadPayload must include the lead name.");
  assert(samplePayload.company_name === "Acme", "buildQuoteLeadPayload must include the company name.");
  assert(samplePayload.marketing_opt_in === true, "buildQuoteLeadPayload must capture marketing opt-in.");
  assert(samplePayload.recommended_engagement === "Aperture Growth", "buildQuoteLeadPayload must include the recommended tier label.");
  assert(samplePayload.detailed_scope === "Item A | Item B", "buildQuoteLeadPayload must serialize the breakdown with pipe separators.");
}

function runHtmlHeadHarmonizationTests(template) {
  const seo = template.config.seo;
  const pageFiles = {
    home: "site/index.html",
    services: "site/services.html",
    quote: "site/quote.html",
    about: "site/about.html",
    contact: "site/contact.html",
    privacy: "site/privacy.html",
    terms: "site/terms.html",
    articles: "site/articles.html",
    misc: "site/misc.html",
    notFound: "site/404.html"
  };

  const seenTitles = new Set();
  Object.keys(pageFiles).forEach((pageId) => {
    const html = readFile(pageFiles[pageId]);
    const titleMatch = html.match(/<title>([^<]+)<\/title>/);
    assert(titleMatch, `${pageFiles[pageId]} must define a <title> element.`);
    const title = titleMatch[1].trim();
    assert(title.length > 0, `${pageFiles[pageId]} must define a non-empty title.`);
    assert(!seenTitles.has(title), `${pageFiles[pageId]} title "${title}" must be unique across pages.`);
    seenTitles.add(title);
    assert(/aperture/i.test(title), `${pageFiles[pageId]} title must reference the Aperture brand.`);

    const descMatch = html.match(/<meta name="description" content="([^"]+)"/);
    assert(descMatch, `${pageFiles[pageId]} must define a description meta.`);
    assert(descMatch[1].length >= 30, `${pageFiles[pageId]} description must be a real sentence (>= 30 chars).`);

    const override = seo.pageOverrides[pageId];
    assert(override, `seo-config pageOverrides must contain "${pageId}".`);

    // The HTML title should match what seo.js would compute (override.title + suffix) for fallback parity.
    const expectedTitle = override.title + (seo.titleSuffix || "");
    assert(title === expectedTitle, `${pageFiles[pageId]} title "${title}" must match seo-config (expected "${expectedTitle}").`);
  });
}

function runProcessGridSizingTests(template) {
  const pickGridClass = template.renderers.pickProcessGridClass;
  assert(typeof pickGridClass === "function", "renderers.pickProcessGridClass must be exported for grid sizing.");
  assert(pickGridClass(0) === "stack-md", "0 process steps should fall back to stack-md.");
  assert(pickGridClass(1) === "stack-md", "1 process step should render with stack-md.");
  assert(pickGridClass(2) === "grid-2", "2 process steps should render with grid-2.");
  assert(pickGridClass(3) === "grid-3", "3 process steps should render with grid-3.");
  assert(pickGridClass(4) === "grid-4", "4 process steps should render with grid-4.");
  assert(pickGridClass(5) === "card-grid", "5+ process steps should render with card-grid.");
  assert(pickGridClass(7) === "card-grid", "7 process steps should render with card-grid.");
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
