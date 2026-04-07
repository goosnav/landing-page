/*
 * ENTERPRISE STATIC SERVICE SITE TEMPLATE
 * CORE SYSTEM LOGIC: client-side validation and Formspree submission helpers
 * SAFE TO EDIT: form copy belongs in config, not in submission logic
 */

window.SiteTemplate = window.SiteTemplate || {};

(function bootstrapForms(template) {
  var contactConfig = template.config.contact || {};
  var quoteConfig = template.config.quote || {};

  function isPlaceholderEndpoint(endpoint) {
    return !endpoint || /your-(contact|quote)-form-id/.test(endpoint);
  }

  function renderStatus(target, type, message) {
    if (!target) {
      return;
    }

    target.className = "form-status form-status--" + type;
    target.textContent = message;
  }

  function validateContactData(data) {
    var errors = {};

    if (!data.name) {
      errors.name = "Name is required.";
    }

    if (!data.email) {
      errors.email = "Email is required.";
    }

    if (!data.message) {
      errors.message = "Message is required.";
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors: errors
    };
  }

  function validateLeadGateData(data) {
    var errors = {};
    var leadGate = quoteConfig.leadGate || {};

    if (!data.name && !data.company) {
      errors.name = leadGate.nameOrCompanyMessage || "Provide either a name or a company.";
      errors.company = errors.name;
    }

    if (!data.email && !data.phone) {
      errors.email = leadGate.emailOrPhoneMessage || "Provide either an email or a phone number.";
      errors.phone = errors.email;
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors: errors
    };
  }

  function markFieldErrors(form, errors) {
    Array.prototype.forEach.call(form.querySelectorAll("[name]"), function clearFieldState(field) {
      field.setAttribute("aria-invalid", "false");
    });

    Array.prototype.forEach.call(form.querySelectorAll("[data-field-error]"), function clearMessage(node) {
      node.textContent = "";
    });

    Object.keys(errors).forEach(function markField(name) {
      var field = form.querySelector('[name="' + name + '"]');
      var errorNode = form.querySelector('[data-field-error="' + name + '"]');

      if (field) {
        field.setAttribute("aria-invalid", "true");
      }

      if (errorNode) {
        errorNode.textContent = errors[name];
      }
    });
  }

  async function submitFormspree(endpoint, payload) {
    if (isPlaceholderEndpoint(endpoint)) {
      return {
        ok: false,
        message: "Replace the placeholder Formspree endpoint before using this form."
      };
    }

    try {
      var response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        return {
          ok: false,
          message: contactConfig.errorMessageGeneric
        };
      }

      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        message: contactConfig.errorMessageGeneric
      };
    }
  }

  async function bindContactForm(form) {
    if (!form) {
      return;
    }

    var statusNode = form.querySelector("[data-form-status]");

    form.addEventListener("submit", async function handleSubmit(event) {
      event.preventDefault();

      var payload = {
        name: form.elements.name.value.trim(),
        email: form.elements.email.value.trim(),
        phone: form.elements.phone.value.trim(),
        company: form.elements.company.value.trim(),
        message: form.elements.message.value.trim(),
        page: "contact",
        admin_destination: contactConfig.adminEmailLabel || "Primary inbox"
      };

      if (contactConfig.enableSpamTrap && form.elements._gotcha && form.elements._gotcha.value) {
        renderStatus(statusNode, "success", contactConfig.successMessageContact);
        form.reset();
        return;
      }

      var validation = validateContactData(payload);

      if (!validation.valid) {
        markFieldErrors(form, validation.errors);
        renderStatus(statusNode, "error", "Review the highlighted fields and try again.");
        return;
      }

      renderStatus(statusNode, "success", "Submitting...");

      var result = await submitFormspree(contactConfig.contactFormEndpoint, payload);

      if (!result.ok) {
        renderStatus(statusNode, "error", result.message || contactConfig.errorMessageGeneric);
        return;
      }

      form.reset();
      markFieldErrors(form, {});
      renderStatus(statusNode, "success", contactConfig.successMessageContact);
    });
  }

  function buildQuoteLeadPayload(data) {
    return {
      lead_name: data.name || "",
      company_name: data.company || "",
      email: data.email || "",
      phone: data.phone || "",
      marketing_opt_in: Boolean(data.optIn),
      recommended_engagement: data.result.recommendedTierLabel,
      estimated_range: data.result.estimateRangeText,
      scope_summary: data.result.scopeSummary,
      detailed_scope: data.result.breakdown.join(" | "),
      assumptions: data.result.assumptions.join(" | "),
      next_steps: data.result.nextSteps.join(" | "),
      selected_answers: data.result.answerSummary.join(" | "),
      initiative_label: data.answers.initiativeLabel || "",
      additional_context: data.answers.additionalContext || "",
      result_timestamp: data.result.resultTimestamp,
      admin_destination: contactConfig.adminEmailLabel || "Primary inbox"
    };
  }

  template.forms = {
    bindContactForm: bindContactForm,
    validateContactData: validateContactData,
    validateLeadGateData: validateLeadGateData,
    markFieldErrors: markFieldErrors,
    renderStatus: renderStatus,
    submitFormspree: submitFormspree,
    buildQuoteLeadPayload: buildQuoteLeadPayload,
    isPlaceholderEndpoint: isPlaceholderEndpoint
  };
})(window.SiteTemplate);
