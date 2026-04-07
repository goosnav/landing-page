/*
 * ENTERPRISE STATIC SERVICE SITE TEMPLATE
 * CORE SYSTEM LOGIC: deterministic quote branching, state pruning, and estimate assembly
 * EDIT WITH CARE: question ids, service ids, and rule enums are contractual
 */

window.SiteTemplate = window.SiteTemplate || {};

(function bootstrapQuoteEngine(template) {
  function getQuoteConfig() {
    return template.config.quote || {};
  }

  function getOrderedQuestions() {
    return (getQuoteConfig().questions || [])
      .filter(function filterVisible(question) {
        return question.visible !== false;
      })
      .sort(function compare(a, b) {
        return a.order - b.order;
      });
  }

  function getQuestionById(questionId) {
    return getOrderedQuestions().find(function findQuestion(question) {
      return question.id === questionId;
    }) || null;
  }

  function getFirstQuestionId() {
    var firstQuestion = getOrderedQuestions()[0];
    return firstQuestion ? firstQuestion.id : null;
  }

  function normalizeAnswer(question, rawValue) {
    if (!question) {
      return rawValue;
    }

    if (question.type === "checkbox-group") {
      return Array.isArray(rawValue)
        ? rawValue.filter(Boolean)
        : rawValue
            .split(",")
            .map(function mapValue(value) {
              return value.trim();
            })
            .filter(Boolean);
    }

    if (question.type === "number") {
      return rawValue === "" || rawValue === null || typeof rawValue === "undefined"
        ? ""
        : Number(rawValue);
    }

    if (question.type === "yes-no") {
      if (rawValue === true || rawValue === false) {
        return rawValue;
      }

      return String(rawValue).toLowerCase() === "true";
    }

    if (typeof rawValue === "string") {
      return rawValue.trim();
    }

    return rawValue;
  }

  function validateAnswer(question, rawValue) {
    var answer = normalizeAnswer(question, rawValue);
    var isEmptyArray = Array.isArray(answer) && answer.length === 0;
    var isEmptyString = answer === "";
    var missing = answer === null || typeof answer === "undefined" || isEmptyArray || isEmptyString;

    if (question.required && missing) {
      return {
        valid: false,
        message: "Provide a response before continuing."
      };
    }

    if (!question.required && missing) {
      return { valid: true, message: "" };
    }

    if (question.type === "number" && question.validationRule) {
      if (Number.isNaN(answer)) {
        return {
          valid: false,
          message: question.validationRule.message || "Enter a valid number."
        };
      }

      if (
        (typeof question.validationRule.min === "number" && answer < question.validationRule.min) ||
        (typeof question.validationRule.max === "number" && answer > question.validationRule.max)
      ) {
        return {
          valid: false,
          message: question.validationRule.message || "Enter a valid number."
        };
      }
    }

    return { valid: true, message: "" };
  }

  function evaluateCondition(condition, answers) {
    var actualValue = answers[condition.answerKey];

    if (condition.operator === "equals") {
      return actualValue === condition.value;
    }

    if (condition.operator === "in") {
      return (condition.values || []).indexOf(actualValue) >= 0;
    }

    if (condition.operator === "gte") {
      return Number(actualValue) >= Number(condition.value);
    }

    if (condition.operator === "lte") {
      return Number(actualValue) <= Number(condition.value);
    }

    if (condition.operator === "contains") {
      return Array.isArray(actualValue) && actualValue.indexOf(condition.value) >= 0;
    }

    return false;
  }

  function getNextQuestionId(questionId, answers) {
    var question = getQuestionById(questionId);

    if (!question || !question.nextQuestionRule) {
      return null;
    }

    var conditions = question.nextQuestionRule.conditions || [];
    for (var index = 0; index < conditions.length; index += 1) {
      var rule = conditions[index];
      if (rule.if && evaluateCondition(rule.if, answers)) {
        return rule.nextId || null;
      }
    }

    return question.nextQuestionRule.defaultNextId || null;
  }

  function getReachableQuestionIds(answers) {
    var orderedIds = [];
    var currentId = getFirstQuestionId();
    var loopGuard = 0;
    var maxSteps = getOrderedQuestions().length + 2;

    while (currentId && loopGuard < maxSteps) {
      if (orderedIds.indexOf(currentId) >= 0) {
        break;
      }

      orderedIds.push(currentId);
      currentId = getNextQuestionId(currentId, answers);
      loopGuard += 1;
    }

    return orderedIds;
  }

  function pruneAnswers(answers) {
    var reachable = getReachableQuestionIds(answers);
    var pruned = {};

    Object.keys(answers).forEach(function keepReachable(answerKey) {
      if (reachable.indexOf(answerKey) >= 0) {
        pruned[answerKey] = answers[answerKey];
      }
    });

    return pruned;
  }

  function createInitialState() {
    return {
      currentQuestionId: getFirstQuestionId(),
      answers: {},
      visitedQuestions: [],
      recommendedTier: null,
      estimateRange: null,
      breakdown: [],
      assumptions: [],
      leadGateData: {},
      optInStatus: false,
      resultTimestamp: null
    };
  }

  function setAnswer(state, questionId, rawValue) {
    var question = getQuestionById(questionId);
    var answerKey = question ? question.answerKey || question.id : questionId;
    var nextAnswers = Object.assign({}, state.answers);
    var nextValue = normalizeAnswer(question, rawValue);
    var isEmptyArray = Array.isArray(nextValue) && nextValue.length === 0;

    if (nextValue === "" || nextValue === null || typeof nextValue === "undefined" || isEmptyArray) {
      delete nextAnswers[answerKey];
    } else {
      nextAnswers[answerKey] = nextValue;
    }

    var prunedAnswers = pruneAnswers(nextAnswers);
    var reachable = getReachableQuestionIds(prunedAnswers);

    state.answers = prunedAnswers;
    state.visitedQuestions = reachable.filter(function filterVisited(id) {
      return state.visitedQuestions.indexOf(id) >= 0 || id === questionId;
    });
    state.currentQuestionId = questionId;
  }

  function getPreviousQuestionId(questionId, answers) {
    var path = getReachableQuestionIds(answers);
    var index = path.indexOf(questionId);
    return index > 0 ? path[index - 1] : null;
  }

  function getProgress(questionId, answers) {
    var path = getReachableQuestionIds(answers);
    var index = Math.max(path.indexOf(questionId), 0);
    return {
      current: index + 1,
      total: path.length || 1
    };
  }

  function tierIndex(tierId) {
    return (getQuoteConfig().tierOrder || []).indexOf(tierId);
  }

  function clampTierIndex(index) {
    var order = getQuoteConfig().tierOrder || [];
    return Math.max(0, Math.min(index, order.length - 1));
  }

  function tierIdFromIndex(index) {
    return (getQuoteConfig().tierOrder || [])[clampTierIndex(index)];
  }

  function maxTier(firstTier, secondTier) {
    return tierIndex(firstTier) >= tierIndex(secondTier) ? firstTier : secondTier;
  }

  function shiftTier(tierId, steps) {
    return tierIdFromIndex(tierIndex(tierId) + steps);
  }

  function thresholdTier(value, thresholds, defaultTier) {
    var resolvedTier = defaultTier;
    thresholds.forEach(function evaluateThreshold(entry) {
      if (Number(value) >= Number(entry.minimum)) {
        resolvedTier = entry.tier;
      }
    });
    return resolvedTier;
  }

  function resolveRecommendedTier(answers) {
    var quoteConfig = getQuoteConfig();
    var tierOrder = quoteConfig.tierOrder || [];
    var recommendationModel = quoteConfig.recommendationModel || {};
    var baseTierByDeliveryModel = recommendationModel.baseTierByDeliveryModel || {};
    var minimumTierByGoal = recommendationModel.minimumTierByGoal || {};
    var minimumTierByTeamSize = recommendationModel.minimumTierByTeamSize || {};
    var primaryConstraintTierHints = recommendationModel.primaryConstraintTierHints || {};
    var urgencyTierUpgrades = recommendationModel.urgencyTierUpgrades || {};

    var resolvedTier = baseTierByDeliveryModel[answers.deliveryModel] || tierOrder[0] || null;

    if (minimumTierByGoal[answers.engagementGoal]) {
      resolvedTier = maxTier(resolvedTier, minimumTierByGoal[answers.engagementGoal]);
    }

    if (minimumTierByTeamSize[answers.teamSize]) {
      resolvedTier = maxTier(resolvedTier, minimumTierByTeamSize[answers.teamSize]);
    }

    if (Array.isArray(recommendationModel.activeClientThresholds)) {
      resolvedTier = maxTier(
        resolvedTier,
        thresholdTier(answers.activeClients || 0, recommendationModel.activeClientThresholds, tierOrder[0])
      );
    }

    if (primaryConstraintTierHints[answers.primaryConstraint]) {
      resolvedTier = maxTier(resolvedTier, primaryConstraintTierHints[answers.primaryConstraint]);
    }

    resolvedTier = shiftTier(resolvedTier, urgencyTierUpgrades[answers.timeline] || 0);

    if (answers.needsCompliance) {
      resolvedTier = shiftTier(resolvedTier, recommendationModel.complianceTierUpgrade || 0);
    }

    return resolvedTier;
  }

  function sumRange(baseRange, deltaRange) {
    return [baseRange[0] + deltaRange[0], baseRange[1] + deltaRange[1]];
  }

  function resolveThresholdRange(value, thresholds) {
    var resolvedRange = [0, 0];
    thresholds.forEach(function evaluate(entry) {
      if (Number(value) >= Number(entry.minimum)) {
        resolvedRange = entry.range;
      }
    });
    return resolvedRange;
  }

  function calculateEstimateRange(answers, tierId) {
    var model = getQuoteConfig().estimateModel || {};
    var range = (model.baseRanges[tierId] || [0, 0]).slice();
    var modifiers = model.rangeModifiers || {};

    if (modifiers.teamSize && modifiers.teamSize[answers.teamSize]) {
      range = sumRange(range, modifiers.teamSize[answers.teamSize]);
    }

    if (Array.isArray(modifiers.activeClients)) {
      range = sumRange(range, resolveThresholdRange(answers.activeClients || 0, modifiers.activeClients));
    }

    if (modifiers.timeline && modifiers.timeline[answers.timeline]) {
      range = sumRange(range, modifiers.timeline[answers.timeline]);
    }

    if (modifiers.needsCompliance) {
      var complianceKey = answers.needsCompliance ? "true" : "false";
      range = sumRange(range, modifiers.needsCompliance[complianceKey] || [0, 0]);
    }

    if (Array.isArray(answers.complianceFocus) && modifiers.complianceFocus) {
      answers.complianceFocus.forEach(function addFocus(focus) {
        range = sumRange(range, modifiers.complianceFocus[focus] || [0, 0]);
      });
    }

    if (modifiers.primaryConstraint && modifiers.primaryConstraint[answers.primaryConstraint]) {
      range = sumRange(range, modifiers.primaryConstraint[answers.primaryConstraint]);
    }

    return range;
  }

  function uniqueItems(items) {
    return items.filter(function filterUnique(item, index) {
      return items.indexOf(item) === index;
    });
  }

  function buildBreakdown(answers, tierId) {
    var config = getQuoteConfig();
    var scopeTemplate = config.scopeTemplates[tierId] || {};
    var additions = [];
    var conditionalAdditions = config.conditionalScopeAdditions || {};

    if (answers.needsCompliance && conditionalAdditions.needsCompliance && conditionalAdditions.needsCompliance.true) {
      additions = additions.concat(conditionalAdditions.needsCompliance.true);
    }

    if (Array.isArray(answers.complianceFocus) && conditionalAdditions.complianceFocus) {
      answers.complianceFocus.forEach(function addFocus(focus) {
        additions = additions.concat(conditionalAdditions.complianceFocus[focus] || []);
      });
    }

    if (conditionalAdditions.primaryConstraint && answers.primaryConstraint) {
      additions = additions.concat(conditionalAdditions.primaryConstraint[answers.primaryConstraint] || []);
    }

    return uniqueItems((scopeTemplate.breakdown || []).concat(additions));
  }

  function buildAssumptions(answers, tierId) {
    var scopeTemplate = (getQuoteConfig().scopeTemplates || {})[tierId] || {};
    var assumptions = (scopeTemplate.assumptions || []).slice();

    if (answers.timeline === "immediate" && answers.targetStartDate) {
      assumptions.push("Planning assumes a target start date of " + answers.targetStartDate + ".");
    }

    if (answers.needsCompliance) {
      assumptions.push("Compliance-sensitive workflows may require additional stakeholder review.");
    }

    return uniqueItems(assumptions);
  }

  function buildNextSteps(tierId) {
    return ((getQuoteConfig().nextStepTemplates || {})[tierId] || []).slice();
  }

  function formatAnswer(question, answer) {
    if (typeof answer === "boolean") {
      return answer ? "Yes" : "No";
    }

    if (Array.isArray(answer)) {
      return answer
        .map(function mapValue(value) {
          return formatAnswer(question, value);
        })
        .join(", ");
    }

    if (question.type === "number") {
      return String(answer);
    }

    var option = (question.options || []).find(function findOption(candidate) {
      return candidate.value === answer;
    });

    return option ? option.label : String(answer);
  }

  function buildAnswerSummary(answers) {
    return getReachableQuestionIds(answers)
      .map(function mapQuestion(questionId) {
        var question = getQuestionById(questionId);
        var answerKey = question.answerKey || question.id;
        var answer = answers[answerKey];

        if (answer === null || typeof answer === "undefined" || answer === "" || (Array.isArray(answer) && !answer.length)) {
          return null;
        }

        return question.title + ": " + formatAnswer(question, answer);
      })
      .filter(Boolean);
  }

  function generateResult(state) {
    var quoteConfig = getQuoteConfig();
    var tierId = resolveRecommendedTier(state.answers);
    var estimateRange = calculateEstimateRange(state.answers, tierId);
    var scopeTemplate = quoteConfig.scopeTemplates[tierId] || {};
    var resultTimestamp = new Date().toISOString();

    return {
      recommendedTierId: tierId,
      recommendedTierLabel: scopeTemplate.recommendedLabel || tierId,
      estimateRange: estimateRange,
      estimateRangeText: template.utils.formatRange(estimateRange),
      scopeSummary: scopeTemplate.scopeSummary || "",
      breakdown: buildBreakdown(state.answers, tierId),
      assumptions: buildAssumptions(state.answers, tierId),
      nextSteps: buildNextSteps(tierId),
      answerSummary: buildAnswerSummary(state.answers),
      disclaimer: (quoteConfig.resultLabels || {}).disclaimer || "",
      resultTimestamp: resultTimestamp
    };
  }

  template.quoteEngine = {
    createInitialState: createInitialState,
    getOrderedQuestions: getOrderedQuestions,
    getQuestionById: getQuestionById,
    getFirstQuestionId: getFirstQuestionId,
    normalizeAnswer: normalizeAnswer,
    validateAnswer: validateAnswer,
    getNextQuestionId: getNextQuestionId,
    getReachableQuestionIds: getReachableQuestionIds,
    pruneAnswers: pruneAnswers,
    setAnswer: setAnswer,
    getPreviousQuestionId: getPreviousQuestionId,
    getProgress: getProgress,
    resolveRecommendedTier: resolveRecommendedTier,
    calculateEstimateRange: calculateEstimateRange,
    buildBreakdown: buildBreakdown,
    buildAssumptions: buildAssumptions,
    buildNextSteps: buildNextSteps,
    buildAnswerSummary: buildAnswerSummary,
    generateResult: generateResult
  };
})(window.SiteTemplate);
