/**
 * Automatic Scholarship Combination Generator & Data-Driven Conflict Detection Engine
 * ScholarSync by Team Scholar IQ
 *
 * Implements National Scholarship Portal (NSP) AY 2026-27 Combination Guidelines:
 * "Students may apply for one merit-based scholarship scheme and one or more
 * welfare-based scholarship schemes, subject to individual scheme eligibility criteria."
 */

import {
  InvalidCombination,
  Scholarship,
  ValidCombination
} from '../types/scholarship';

/**
 * Checks conflict rules between any pair of scholarships in a candidate set.
 * Returns null if valid, or an InvalidCombination record if conflicting.
 */
export function checkPairwiseConflict(
  s1: Scholarship,
  s2: Scholarship,
  allIdsInCombo: string[],
  allNamesInCombo: string[]
): InvalidCombination | null {
  // 1. Standalone Exclusivity Rule
  if (s1.conflict_rules.exclusive_standalone) {
    return {
      scholarship_ids: allIdsInCombo,
      scholarship_names: allNamesInCombo,
      conflicting_pair: [s1.name, s2.name],
      conflict_type: 'exclusive_standalone',
      reason: `"${s1.name}" is a comprehensive standalone award that covers full tuition and maintenance. NSP rules strictly prohibit combining it with any other scholarship.`
    };
  }
  if (s2.conflict_rules.exclusive_standalone) {
    return {
      scholarship_ids: allIdsInCombo,
      scholarship_names: allNamesInCombo,
      conflicting_pair: [s2.name, s1.name],
      conflict_type: 'exclusive_standalone',
      reason: `"${s2.name}" is a comprehensive standalone award that covers full tuition and maintenance. NSP rules strictly prohibit combining it with any other scholarship.`
    };
  }

  // 2. Explicit ID Incompatibility
  if (s1.conflict_rules.conflicting_scholarship_ids?.includes(s2.id)) {
    return {
      scholarship_ids: allIdsInCombo,
      scholarship_names: allNamesInCombo,
      conflicting_pair: [s1.name, s2.name],
      conflict_type: 'explicit_conflict',
      reason: `"${s1.name}" explicitly prohibits concurrent combination with "${s2.name}". (${s1.conflict_rules.rule_description})`
    };
  }
  if (s2.conflict_rules.conflicting_scholarship_ids?.includes(s1.id)) {
    return {
      scholarship_ids: allIdsInCombo,
      scholarship_names: allNamesInCombo,
      conflicting_pair: [s2.name, s1.name],
      conflict_type: 'explicit_conflict',
      reason: `"${s2.name}" explicitly prohibits concurrent combination with "${s1.name}". (${s2.conflict_rules.rule_description})`
    };
  }

  // 3. Official NSP AY 2026-27 Rule: Dual Merit Restriction
  // "Students may apply for only ONE merit-based scholarship scheme and one or more welfare-based scholarship schemes."
  if (s1.scheme_type === 'merit_based' && s2.scheme_type === 'merit_based') {
    return {
      scholarship_ids: allIdsInCombo,
      scholarship_names: allNamesInCombo,
      conflicting_pair: [s1.name, s2.name],
      conflict_type: 'nsp_dual_merit_restriction',
      reason: `Dual Merit Restriction: Under statutory scholarship guidelines, students may avail at most ONE merit-based scholarship scheme concurrently. Both "${s1.name}" and "${s2.name}" are classified as merit-based schemes.`
    };
  }

  // 4. Same Ministry / Central Sector Provider Exclusivity
  if (
    s1.conflict_rules.exclude_same_provider_level &&
    s2.conflict_rules.exclude_same_provider_level
  ) {
    // If from same classification, check if they are mutually exclusive
    if (s1.classification === s2.classification) {
      // In Maharashtra State Government, Tuition Fee + Hostel Maintenance Allowance is an explicitly allowed statutory pair
      const isMahaFeeAndHostel =
        (s1.source_type === 'MAHADBT' || s1.provider?.includes('Maharashtra')) &&
        (s2.source_type === 'MAHADBT' || s2.provider?.includes('Maharashtra')) &&
        ((s1.mahadbt_scheme_type === 'fee_reimbursement' && s2.mahadbt_scheme_type === 'maintenance_allowance') ||
         (s1.mahadbt_scheme_type === 'maintenance_allowance' && s2.mahadbt_scheme_type === 'fee_reimbursement'));

      if (!isMahaFeeAndHostel) {
        // If same department or both same benefit type
        const sameDept = s1.department && s2.department && s1.department === s2.department;
        const sameBenefitType = s1.benefit_type === s2.benefit_type;
        const centralExclusivity = s1.classification !== 'State Government';

        if (centralExclusivity || sameDept || sameBenefitType) {
          return {
            scholarship_ids: allIdsInCombo,
            scholarship_names: allNamesInCombo,
            conflicting_pair: [s1.name, s2.name],
            conflict_type: 'same_provider_level',
            reason: `Both "${s1.name}" and "${s2.name}" belong to the same issuing authority (${s1.department || s1.classification}). Departmental guidelines prohibit concurrent claims under the same category.`
          };
        }
      }
    }
  }

  // 5. Tuition Fee Duplication Conflict (Cross-Portal or Same Portal)
  const isS1Fee =
    s1.benefit_type === 'tuition_fee' ||
    s1.mahadbt_scheme_type === 'fee_reimbursement' ||
    s1.mahadbt_scheme_type === 'freeship' ||
    s1.conflict_rules.fee_component_conflict;

  const isS2Fee =
    s2.benefit_type === 'tuition_fee' ||
    s2.mahadbt_scheme_type === 'fee_reimbursement' ||
    s2.mahadbt_scheme_type === 'freeship' ||
    s2.conflict_rules.fee_component_conflict;

  if (isS1Fee && isS2Fee) {
    return {
      scholarship_ids: allIdsInCombo,
      scholarship_names: allNamesInCombo,
      conflicting_pair: [s1.name, s2.name],
      conflict_type: 'fee_duplication',
      reason: `Fee Re-imbursement Conflict: Both "${s1.name}" and "${s2.name}" provide institutional tuition fee reimbursement. Statutory state and central audit regulations strictly prohibit duplicate claims for the same academic tuition fees.`
    };
  }

  return null;
}

/**
 * Validates a candidate combination of scholarships.
 */
function validateCombination(combination: Scholarship[]): {
  isValid: boolean;
  invalidReason?: InvalidCombination;
  compatibilityStatus: ValidCombination['compatibility_status'];
  conflictAuditNotes: string[];
} {
  const ids = combination.map((s) => s.id);
  const names = combination.map((s) => s.name);
  const auditNotes: string[] = [];

  // Single scholarship baseline
  if (combination.length === 1) {
    auditNotes.push('Standalone single-grant baseline (no multi-scholarship conflict).');
    return {
      isValid: true,
      compatibilityStatus: 'Fully Compatible',
      conflictAuditNotes: auditNotes
    };
  }

  // Check stack size limit
  for (const s of combination) {
    const maxAllowed = s.conflict_rules.max_combined_scholarships || 2;
    if (combination.length > maxAllowed) {
      return {
        isValid: false,
        invalidReason: {
          scholarship_ids: ids,
          scholarship_names: names,
          conflicting_pair: [s.name, combination[0].name],
          conflict_type: 'stack_limit',
          reason: `"${s.name}" limits simultaneous stacking to ${maxAllowed} schemes. Candidate combination has ${combination.length}.`
        },
        compatibilityStatus: 'Fully Compatible',
        conflictAuditNotes: auditNotes
      };
    }
  }

  // Check NSP AY 2026-27 Merit Count Limit: at most 1 merit-based scheme in any stack
  const meritSchemes = combination.filter((s) => s.scheme_type === 'merit_based');
  if (meritSchemes.length > 1) {
    return {
      isValid: false,
      invalidReason: {
        scholarship_ids: ids,
        scholarship_names: names,
        conflicting_pair: [meritSchemes[0].name, meritSchemes[1].name],
        conflict_type: 'nsp_dual_merit_restriction',
        reason: `NSP AY 2026-27 Guideline: Students may hold at most ONE merit-based scholarship scheme alongside welfare schemes. Current combination includes ${meritSchemes.length} merit awards.`
      },
      compatibilityStatus: 'Fully Compatible',
      conflictAuditNotes: auditNotes
    };
  }

  // Check all pairwise combinations
  for (let i = 0; i < combination.length; i++) {
    for (let j = i + 1; j < combination.length; j++) {
      const conflict = checkPairwiseConflict(combination[i], combination[j], ids, names);
      if (conflict) {
        return {
          isValid: false,
          invalidReason: conflict,
          compatibilityStatus: 'Fully Compatible',
          conflictAuditNotes: auditNotes
        };
      }
    }
  }

  // Determine statutory compatibility status & audit notes
  const hasMerit = combination.some((s) => s.scheme_type === 'merit_based');
  const hasWelfare = combination.some((s) => s.scheme_type === 'welfare_based');
  const hasFee = combination.some((s) => s.benefit_type === 'tuition_fee');
  const hasMaintenance = combination.some((s) => s.benefit_type === 'maintenance_allowance');
  const hasAicte = combination.some((s) => s.classification === 'AICTE');

  let status: ValidCombination['compatibility_status'] = 'Fully Compatible';

  if (hasMerit && hasWelfare) {
    status = 'NSP Merit + Welfare Stacking';
    auditNotes.push('NSP AY 2026-27 Certified Stack: 1 Merit-based scholarship combined with compatible Welfare-based grant.');
  } else if (hasFee && hasMaintenance) {
    status = 'Complementary (Fee + Maintenance)';
    auditNotes.push('Optimal synergy: Tuition fee coverage combined with monthly living/hostel allowance.');
  } else if (hasAicte) {
    status = 'AICTE + Private Stacking';
    auditNotes.push('Compliant stack: AICTE equipment/study stipend permitted alongside non-conflicting schemes.');
  } else {
    auditNotes.push('Verified: No provider exclusivity, fee duplication, or statutory restrictions.');
  }

  return {
    isValid: true,
    compatibilityStatus: status,
    conflictAuditNotes: auditNotes
  };
}

/**
 * Generates combinations (subsets) of an array up to maximum stack size
 */
function generateCombinations<T>(items: T[], maxSize: number = 2): T[][] {
  const results: T[][] = [];

  function helper(start: number, currentCombo: T[]) {
    if (currentCombo.length > 0) {
      results.push([...currentCombo]);
    }
    if (currentCombo.length === maxSize) {
      return;
    }
    for (let i = start; i < items.length; i++) {
      currentCombo.push(items[i]);
      helper(i + 1, currentCombo);
      currentCombo.pop();
    }
  }

  helper(0, []);
  return results;
}

/**
 * Main Combination Engine Entrypoint:
 * Takes eligible scholarships, computes candidate combinations, audits conflicts,
 * and sorts valid combinations by total potential financial benefit (descending).
 */
export function runCombinationEngine(eligibleScholarships: Scholarship[]): {
  validCombinations: ValidCombination[];
  invalidCombinations: InvalidCombination[];
} {
  if (!eligibleScholarships || eligibleScholarships.length === 0) {
    return { validCombinations: [], invalidCombinations: [] };
  }

  const candidateCombinations = generateCombinations(eligibleScholarships, 2);
  const validMap = new Map<string, ValidCombination>();
  const invalidList: InvalidCombination[] = [];
  const seenInvalidKeys = new Set<string>();

  for (const combo of candidateCombinations) {
    const sortedIds = combo.map((s) => s.id).sort();
    const comboKey = sortedIds.join('+');

    const validation = validateCombination(combo);

    if (validation.isValid) {
      // Calculate total financial grant
      const totalBenefit = combo.reduce((sum, s) => sum + s.benefit_amount, 0);

      // Unique documents needed across combined schemes
      const allDocs = Array.from(new Set(combo.flatMap((s) => s.required_documents)));

      // Merge important conditions
      const importantConditions = Array.from(
        new Set(combo.flatMap((s) => s.eligibility_conditions.slice(0, 2)))
      );

      const validRecord: ValidCombination = {
        id: `combo-${comboKey}`,
        scholarship_ids: sortedIds,
        scholarships: combo,
        scholarship_names: combo.map((s) => s.name),
        total_potential_benefit: totalBenefit,
        benefit_breakdown: combo.map((s) => ({
          name: s.name,
          amount: s.benefit_amount,
          type: s.benefit_type
        })),
        count: combo.length,
        compatibility_status: validation.compatibilityStatus,
        important_conditions: importantConditions,
        merged_documents: allDocs,
        conflict_audit_notes: validation.conflictAuditNotes
      };

      validMap.set(comboKey, validRecord);
    } else if (validation.invalidReason) {
      const conflictKey = validation.invalidReason.conflicting_pair.sort().join('::');
      if (!seenInvalidKeys.has(conflictKey)) {
        seenInvalidKeys.add(conflictKey);
        invalidList.push(validation.invalidReason);
      }
    }
  }

  // Multi-scholarship combinations (size >= 2) take top priority
  // If only 1 scholarship is eligible, return that single-grant combination
  let validList = Array.from(validMap.values());
  const multiCombinations = validList.filter((c) => c.count >= 2);

  if (multiCombinations.length > 0) {
    // Sort multi-combinations by total benefit descending
    multiCombinations.sort(
      (a, b) => b.total_potential_benefit - a.total_potential_benefit
    );
    validList = multiCombinations;
  } else {
    // Fall back to single-scholarship packages
    validList.sort((a, b) => b.total_potential_benefit - a.total_potential_benefit);
  }

  return {
    validCombinations: validList,
    invalidCombinations: invalidList
  };
}
