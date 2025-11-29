/**
 * Expert System Inference Engine
 */

export const determineNextStep = (knownFacts, kb) => {
  const { rules, facts, issues } = kb;

  // 1. Check if any rule is satisfied
  for (const rule of rules) {
    const isSatisfied = rule.if.every(condition => {
      const factValue = knownFacts[condition.fact];
      return factValue !== undefined && factValue === condition.value;
    });

    if (isSatisfied) {
      // Find the issue details
      const issueAction = rule.then.find(action => action.action === 'set_issue');
      if (issueAction) {
        const issue = issues.find(i => i.id === issueAction.issueId);
        return {
          type: 'issue',
          data: issue,
          explanation: rule.explanation
        };
      }
    }
  }

  // 2. If no rule satisfied, find the next question to ask
  // We look for the first rule that is *potential* (not yet disproven)
  // and find the first missing fact in it.
  
  // Create a set of facts we've already asked/know
  const knownFactIds = new Set(Object.keys(knownFacts));

  for (const rule of rules) {
    // Check if rule is "possible"
    const isImpossible = rule.if.some(condition => {
      const factValue = knownFacts[condition.fact];
      // If we know the fact, and it doesn't match the condition, the rule is impossible
      return factValue !== undefined && factValue !== condition.value;
    });

    if (!isImpossible) {
      // Rule is possible. Find the first unknown fact.
      const missingCondition = rule.if.find(condition => !knownFactIds.has(condition.fact));
      
      if (missingCondition) {
        const factDef = facts.find(f => f.id === missingCondition.fact);
        if (factDef) {
            return {
                type: 'question',
                data: factDef
            };
        }
      }
    }
  }

  return { type: 'no_result' };
};
