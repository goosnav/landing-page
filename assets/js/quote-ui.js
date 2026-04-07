/*
 * ENTERPRISE STATIC SERVICE SITE TEMPLATE
 * CORE SYSTEM LOGIC: one-question-per-screen quote wizard UI
 * EDIT WITH CARE: keep UI separate from quote-engine.js business logic
 */

window.SiteTemplate = window.SiteTemplate || {};

(function bootstrapQuoteUi(template) {
  function readQuestionAnswer(form, question) {
    var formData = new FormData(form);

    if (question.type === "checkbox-group") {
      return formData.getAll(question.answerKey);
    }

    if (question.type === "yes-no") {
      var rawBoolean = formData.get(question.answerKey);
      return rawBoolean === null ? "" : rawBoolean === "true";
    }

    return formData.get(question.answerKey) || "";
  }

  function renderOptionInput(question, option, currentValue, index) {
    var inputId = question.id + "-" + index;
    var isSelected = Array.isArray(currentValue)
      ? currentValue.indexOf(option.value) >= 0
      : currentValue === option.value;
    var inputType = question.type === "checkbox-group" ? "checkbox" : "radio";

    return (
      '<label class="option-button' + (isSelected ? " is-selected" : "") + '" for="' + inputId + '">' +
      '<input class="visually-hidden" id="' +
      inputId +
      '" type="' +
      inputType +
      '" name="' +
      question.answerKey +
      '" value="' +
      template.utils.escapeHtml(option.value) +
      '"' +
      (isSelected ? " checked" : "") +
      ">" +
      '<span>' + template.utils.escapeHtml(option.label) + "</span>" +
      "</label>"
    );
  }

  function renderQuestionField(question, answer) {
    var escapedAnswer = template.utils.escapeHtml(answer || "");

    if (
      question.type === "single-select" ||
      question.type === "radio" ||
      question.type === "checkbox-group" ||
      question.type === "yes-no"
    ) {
      var options = question.type === "yes-no"
        ? [
            { label: "Yes", value: true },
            { label: "No", value: false }
          ]
        : question.options || [];

      return (
        '<fieldset class="option-list">' +
        '<legend class="visually-hidden">' + template.utils.escapeHtml(question.title) + "</legend>" +
        '<div class="option-button-grid">' +
        options.map(function mapOption(option, index) {
          return renderOptionInput(question, option, answer, index);
        }).join("") +
        "</div></fieldset>"
      );
    }

    if (question.type === "dropdown") {
      return (
        '<div class="form-field">' +
        '<label class="form-label visually-hidden" for="' + question.id + '">Select an option</label>' +
        '<select class="form-select" id="' + question.id + '" name="' + question.answerKey + '">' +
        '<option value="">Select one</option>' +
        (question.options || []).map(function mapOption(option) {
          return (
            '<option value="' +
            template.utils.escapeHtml(option.value) +
            '"' +
            (answer === option.value ? " selected" : "") +
            ">" +
            template.utils.escapeHtml(option.label) +
            "</option>"
          );
        }).join("") +
        "</select></div>"
      );
    }

    if (question.type === "number") {
      return (
        '<div class="form-field">' +
        '<label class="form-label visually-hidden" for="' + question.id + '">' + template.utils.escapeHtml(question.title) + "</label>" +
        '<input class="form-input" id="' +
        question.id +
        '" name="' +
        question.answerKey +
        '" type="number" inputmode="numeric" placeholder="' +
        template.utils.escapeHtml(question.placeholder || "") +
        '" value="' +
        escapedAnswer +
        '">' +
        "</div>"
      );
    }

    if (question.type === "date") {
      return (
        '<div class="form-field">' +
        '<label class="form-label visually-hidden" for="' + question.id + '">' + template.utils.escapeHtml(question.title) + "</label>" +
        '<input class="form-input" id="' +
        question.id +
        '" name="' +
        question.answerKey +
        '" type="date" value="' +
        escapedAnswer +
        '">' +
        "</div>"
      );
    }

    if (question.type === "textarea") {
      return (
        '<div class="form-field">' +
        '<label class="form-label visually-hidden" for="' + question.id + '">' + template.utils.escapeHtml(question.title) + "</label>" +
        '<textarea class="form-textarea" id="' +
        question.id +
        '" name="' +
        question.answerKey +
        '" placeholder="' +
        template.utils.escapeHtml(question.placeholder || "") +
        '">' +
        escapedAnswer +
        "</textarea></div>"
      );
    }

    return (
      '<div class="form-field">' +
      '<label class="form-label visually-hidden" for="' + question.id + '">' + template.utils.escapeHtml(question.title) + "</label>" +
      '<input class="form-input" id="' +
      question.id +
      '" name="' +
      question.answerKey +
      '" type="text" placeholder="' +
      template.utils.escapeHtml(question.placeholder || "") +
      '" value="' +
      escapedAnswer +
      '">' +
      "</div>"
    );
  }

  function renderIntro(root, onStart) {
    var config = template.config.quote.experience;
    root.innerHTML =
      '<section class="quote-panel quote-stage" id="quote-intro">' +
      '<p class="eyebrow">Quote</p>' +
      '<h1>' + template.utils.escapeHtml(config.title) + "</h1>" +
      '<p class="page-copy">' + template.utils.escapeHtml(config.intro) + "</p>" +
      '<p class="visually-muted">' + template.utils.escapeHtml(config.estimatedDurationText) + "</p>" +
      '<div class="button-row"><button class="button button--primary" type="button" data-start-quote>' +
      template.utils.escapeHtml(config.startLabel) +
      "</button></div></section>";

    root.querySelector("[data-start-quote]").addEventListener("click", onStart);
  }

  function renderQuestion(root, state, onAdvance, onBack) {
    var question = template.quoteEngine.getQuestionById(state.currentQuestionId);
    var progress = template.quoteEngine.getProgress(question.id, state.answers);
    var currentAnswer = state.answers[question.answerKey];
    var percentage = Math.round((progress.current / progress.total) * 100);

    root.innerHTML =
      '<form class="quote-panel quote-stage" data-question-form novalidate>' +
      '<div class="quote-progress">' +
      '<div class="result-meta"><span class="meta-chip">Question ' +
      template.utils.escapeHtml(progress.current) +
      " of " +
      template.utils.escapeHtml(progress.total) +
      '</span></div>' +
      '<div class="quote-progress__track" aria-hidden="true"><div class="quote-progress__bar" style="width:' +
      template.utils.escapeHtml(percentage) +
      '%"></div></div>' +
      "</div>" +
      '<div class="stack-md">' +
      '<h2>' + template.utils.escapeHtml(question.title) + "</h2>" +
      (question.helpText ? '<p class="form-help">' + template.utils.escapeHtml(question.helpText) + "</p>" : "") +
      renderQuestionField(question, currentAnswer) +
      '<p class="field-error" data-question-error aria-live="polite"></p>' +
      '<div class="quote-panel__actions">' +
      '<button class="button button--secondary" type="button" data-quote-back>' +
      (template.quoteEngine.getPreviousQuestionId(question.id, state.answers) ? "Back" : "Back to intro") +
      "</button>" +
      '<button class="button button--primary" type="submit">Continue</button>' +
      "</div></div></form>";

    var form = root.querySelector("[data-question-form]");
    var errorNode = root.querySelector("[data-question-error]");

    form.addEventListener("submit", function handleSubmit(event) {
      event.preventDefault();
      var answer = readQuestionAnswer(form, question);
      var validation = template.quoteEngine.validateAnswer(question, answer);

      if (!validation.valid) {
        errorNode.textContent = validation.message;
        return;
      }

      errorNode.textContent = "";
      onAdvance(answer);
    });

    root.querySelector("[data-quote-back]").addEventListener("click", onBack);
  }

  function renderLeadGate(root, state, onSubmit, onBack) {
    var leadGate = template.config.quote.leadGate || {};
    var contactConfig = template.config.contact || {};
    var lead = state.leadGateData || {};

    root.innerHTML =
      '<form class="quote-panel lead-gate-form" data-lead-gate-form novalidate>' +
      '<p class="eyebrow">Lead Capture</p>' +
      '<h2>' + template.utils.escapeHtml(leadGate.heading) + "</h2>" +
      '<p class="form-help">' + template.utils.escapeHtml(leadGate.body) + "</p>" +
      '<div class="form-grid">' +
      '<div class="form-field"><label class="form-label" for="lead-name">' + template.utils.escapeHtml(leadGate.nameLabel) + '</label><input class="form-input" id="lead-name" name="name" autocomplete="name" value="' + template.utils.escapeHtml(lead.name || "") + '"><p class="field-error" data-field-error="name"></p></div>' +
      '<div class="form-field"><label class="form-label" for="lead-company">' + template.utils.escapeHtml(leadGate.companyLabel) + '</label><input class="form-input" id="lead-company" name="company" autocomplete="organization" value="' + template.utils.escapeHtml(lead.company || "") + '"><p class="field-error" data-field-error="company"></p></div>' +
      '<div class="form-field"><label class="form-label" for="lead-email">' + template.utils.escapeHtml(leadGate.emailLabel) + '</label><input class="form-input" id="lead-email" name="email" type="email" autocomplete="email" value="' + template.utils.escapeHtml(lead.email || "") + '"><p class="field-error" data-field-error="email"></p></div>' +
      '<div class="form-field"><label class="form-label" for="lead-phone">' + template.utils.escapeHtml(leadGate.phoneLabel) + '</label><input class="form-input" id="lead-phone" name="phone" type="tel" autocomplete="tel" value="' + template.utils.escapeHtml(lead.phone || "") + '"><p class="field-error" data-field-error="phone"></p></div>' +
      "</div>" +
      (contactConfig.enableSpamTrap
        ? '<div class="form-field visually-hidden" aria-hidden="true"><label for="lead-website">Website</label><input id="lead-website" name="_gotcha" tabindex="-1" autocomplete="off"></div>'
        : "") +
      '<label class="form-field"><span class="form-label">Optional updates</span><span><input type="checkbox" name="optIn" value="true"' +
      (state.optInStatus ? " checked" : "") +
      "> " +
      template.utils.escapeHtml(contactConfig.optInLabel) +
      "</span></label>" +
      '<p class="form-note">' + template.utils.escapeHtml(contactConfig.privacyNoticeText) + "</p>" +
      '<div class="form-status" data-form-status aria-live="polite"></div>' +
      '<div class="quote-panel__actions"><button class="button button--secondary" type="button" data-lead-back>Back</button><button class="button button--primary" type="submit">' +
      template.utils.escapeHtml(leadGate.submitLabel) +
      "</button></div></form>";

    var form = root.querySelector("[data-lead-gate-form]");

    form.addEventListener("submit", function handleSubmit(event) {
      event.preventDefault();
      var payload = {
        name: form.elements.name.value.trim(),
        company: form.elements.company.value.trim(),
        email: form.elements.email.value.trim(),
        phone: form.elements.phone.value.trim(),
        optIn: Boolean(form.elements.optIn.checked)
      };
      onSubmit(form, payload);
    });

    root.querySelector("[data-lead-back]").addEventListener("click", onBack);
  }

  function renderResult(root, state, result, onDownload, onPrint, onReset, onRevise) {
    var labels = template.config.quote.resultLabels || {};

    root.innerHTML =
      '<section class="quote-result-layout">' +
      '<article class="result-card">' +
      '<p class="eyebrow">Result</p>' +
      '<h2>' + template.utils.escapeHtml(labels.recommendedTier || "Recommended Engagement") + "</h2>" +
      '<div class="result-meta">' +
      '<span class="meta-chip">' + template.utils.escapeHtml(result.recommendedTierLabel) + "</span>" +
      '<span class="meta-chip">' + template.utils.escapeHtml(result.estimateRangeText) + "</span>" +
      "</div>" +
      '<p>' + template.utils.escapeHtml(result.scopeSummary) + "</p>" +
      '<p class="quote-disclaimer">' + template.utils.escapeHtml(result.disclaimer) + "</p>" +
      "</article>" +
      '<article class="result-card"><h2>' + template.utils.escapeHtml(labels.breakdown || "Detailed Scope") + '</h2><ul class="result-list">' +
      result.breakdown.map(function mapItem(item) {
        return "<li>" + template.utils.escapeHtml(item) + "</li>";
      }).join("") +
      "</ul></article>" +
      '<article class="result-card"><h2>' + template.utils.escapeHtml(labels.assumptions || "Assumptions") + '</h2><ul class="result-list">' +
      result.assumptions.map(function mapItem(item) {
        return "<li>" + template.utils.escapeHtml(item) + "</li>";
      }).join("") +
      "</ul></article>" +
      '<article class="result-card"><h2>' + template.utils.escapeHtml(labels.nextSteps || "Suggested Next Steps") + '</h2><ul class="result-list">' +
      result.nextSteps.map(function mapItem(item) {
        return "<li>" + template.utils.escapeHtml(item) + "</li>";
      }).join("") +
      '</ul><div class="result-actions">' +
      '<button class="button button--primary" type="button" data-download-summary>Download Summary</button>' +
      '<button class="button button--secondary" type="button" data-print-summary>Print Summary</button>' +
      '<button class="button button--secondary" type="button" data-revise-answers>Revise Answers</button>' +
      '<button class="button button--tertiary" type="button" data-reset-quote>Start Over</button>' +
      "</div></article>" +
      '<div data-result-scheduler></div>' +
      "</section>";

    root.querySelector("[data-download-summary]").addEventListener("click", onDownload);
    root.querySelector("[data-print-summary]").addEventListener("click", onPrint);
    root.querySelector("[data-reset-quote]").addEventListener("click", onReset);
    root.querySelector("[data-revise-answers]").addEventListener("click", onRevise);

    template.scheduler.renderScheduler(root.querySelector("[data-result-scheduler]"), { context: "quote" });
  }

  function initQuoteWizard(root) {
    if (!root) {
      return;
    }

    var state = template.quoteEngine.createInitialState();
    var activeResult = null;

    function showIntro() {
      root.innerHTML = "";
      renderIntro(root, function handleStart() {
        state.currentQuestionId = template.quoteEngine.getFirstQuestionId();
        showQuestion();
      });
    }

    function showQuestion() {
      renderQuestion(
        root,
        state,
        function handleAdvance(answer) {
          template.quoteEngine.setAnswer(state, state.currentQuestionId, answer);
          var nextQuestionId = template.quoteEngine.getNextQuestionId(state.currentQuestionId, state.answers);

          if (!nextQuestionId) {
            showLeadGate();
            return;
          }

          state.currentQuestionId = nextQuestionId;
          showQuestion();
        },
        function handleBack() {
          var previousQuestionId = template.quoteEngine.getPreviousQuestionId(state.currentQuestionId, state.answers);

          if (!previousQuestionId) {
            showIntro();
            return;
          }

          state.currentQuestionId = previousQuestionId;
          showQuestion();
        }
      );
    }

    function showLeadGate() {
      renderLeadGate(
        root,
        state,
        async function handleLeadSubmit(form, leadData) {
          var validation = template.forms.validateLeadGateData(leadData);
          var statusNode = form.querySelector("[data-form-status]");

          template.forms.markFieldErrors(form, validation.errors);

          if (!validation.valid) {
            template.forms.renderStatus(statusNode, "error", "Review the highlighted lead fields and try again.");
            return;
          }

          activeResult = template.quoteEngine.generateResult(state);
          var payload = template.forms.buildQuoteLeadPayload({
            name: leadData.name,
            company: leadData.company,
            email: leadData.email,
            phone: leadData.phone,
            optIn: leadData.optIn,
            result: activeResult,
            answers: state.answers
          });

          template.forms.renderStatus(statusNode, "success", "Submitting...");

          var submission = await template.forms.submitFormspree(template.config.contact.quoteLeadFormEndpoint, payload);

          if (!submission.ok) {
            template.forms.renderStatus(statusNode, "error", submission.message || template.config.contact.errorMessageGeneric);
            return;
          }

          state.leadGateData = leadData;
          state.optInStatus = Boolean(leadData.optIn);
          state.resultTimestamp = activeResult.resultTimestamp;
          template.forms.renderStatus(statusNode, "success", template.config.contact.successMessageQuote);
          showResult();
        },
        function handleLeadBack() {
          var path = template.quoteEngine.getReachableQuestionIds(state.answers);
          state.currentQuestionId = path[path.length - 1];
          showQuestion();
        }
      );
    }

    function showResult() {
      renderResult(
        root,
        state,
        activeResult,
        function handleDownload() {
          template.quoteDownload.downloadSummary(state, activeResult);
        },
        function handlePrint() {
          template.quoteDownload.printSummary(state, activeResult);
        },
        function handleReset() {
          state = template.quoteEngine.createInitialState();
          activeResult = null;
          showIntro();
        },
        function handleRevise() {
          var path = template.quoteEngine.getReachableQuestionIds(state.answers);
          state.currentQuestionId = path[path.length - 1];
          showQuestion();
        }
      );
    }

    showIntro();
  }

  template.quoteUi = {
    initQuoteWizard: initQuoteWizard
  };
})(window.SiteTemplate);
