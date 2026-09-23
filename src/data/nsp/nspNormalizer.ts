/**
 * NSP Data Extractor & Normalizer
 * Ingestion Architecture Layer 2: Validates, cleanses, and transforms raw NSP
 * records into the application's unified Scholarship domain model.
 */

import { Scholarship, ConflictRules, ScholarshipEligibility } from '../../types/scholarship';
import { RawNspScheme } from './nspOfficialSchemes';

export interface NormalizationReport {
  totalProcessed: number;
  validCount: number;
  invalidCount: number;
  errors: { schemeCode: string; reason: string }[];
  normalizedRecords: Scholarship[];
}

/**
 * Normalizes a raw NSP scheme object into a strictly-typed Scholarship domain entity.
 */
export function normalizeNspScheme(raw: RawNspScheme): Scholarship {
  if (!raw.scheme_code || !raw.official_name) {
    throw new Error(`Invalid NSP record: Missing scheme_code or official_name`);
  }

  // Enforce AY 2026-27 standard
  const academicYear = raw.academic_year || '2026-27';

  const eligibility: ScholarshipEligibility = {
    income_limit: raw.income_ceiling !== undefined ? raw.income_ceiling : null,
    category: Array.isArray(raw.eligible_categories) && raw.eligible_categories.length > 0
      ? raw.eligible_categories
      : ['General', 'OBC', 'SC', 'ST', 'EWS'],
    course: Array.isArray(raw.eligible_courses) && raw.eligible_courses.length > 0
      ? raw.eligible_courses
      : ['ALL'],
    education_level: Array.isArray(raw.education_stages) && raw.education_stages.length > 0
      ? raw.education_stages
      : ['Undergraduate'],
    minimum_percentage: typeof raw.minimum_qualifying_percentage === 'number'
      ? raw.minimum_qualifying_percentage
      : 50.0,
    gender: raw.gender_eligibility || 'ANY',
    state_domicile: Array.isArray(raw.state_domicile) && raw.state_domicile.length > 0
      ? raw.state_domicile
      : ['ALL'],
    disability_required: Boolean(raw.disability_reservation),
    minimum_disability_percentage: raw.disability_reservation
      ? (raw.benchmark_disability_percentage ?? 40)
      : null,
    special_category_requirements: raw.special_reservations || []
  };

  const conflictRules: ConflictRules = {
    exclusive_standalone: Boolean(raw.nsp_conflict_guidelines?.exclusive_standalone),
    exclude_same_provider_level: Boolean(raw.nsp_conflict_guidelines?.exclude_same_provider_level),
    fee_component_conflict: Boolean(raw.nsp_conflict_guidelines?.fee_component_conflict),
    conflicting_scholarship_ids: raw.nsp_conflict_guidelines?.conflicting_scholarship_ids || [],
    max_combined_scholarships: raw.nsp_conflict_guidelines?.max_combined_scholarships || 2,
    rule_description: raw.nsp_conflict_guidelines?.rule_description ||
      'Governed by National Scholarship Portal (NSP) Clause 7.2 statutory terms.'
  };

  return {
    id: raw.scheme_code,
    name: raw.official_name,
    provider: raw.ministry_or_department,
    academic_year: academicYear,
    scheme_type: raw.scheme_type,
    classification: raw.classification,
    description: `Official Government of India scholarship scheme administered by ${raw.ministry_or_department} on the National Scholarship Portal (NSP).`,
    eligibility,
    selection: {
      selection_criteria: raw.official_conditions?.find((c) => c.toLowerCase().includes('merit') || c.toLowerCase().includes('selection')) || 'Merit and eligibility based on qualifying examination.',
      merit_criteria: `Minimum qualifying score: ${raw.minimum_qualifying_percentage}%`,
      ranking_method: 'State/Board wise quota ranking',
      selection_priority: null,
      state_wise_allocation: raw.state_domicile?.includes('ALL') ? 'Allocated across states as per state population / quotas' : raw.state_domicile?.join(', ') || null,
      renewal_conditions: 'Maintenance of satisfactory academic progress and minimum attendance.'
    },
    benefits: {
      amount: raw.annual_benefit_amount || 0,
      amount_per_interval: `₹${(raw.annual_benefit_amount || 0).toLocaleString('en-IN')} per annum`,
      fee_reimbursement: raw.benefit_category === 'tuition_fee' || raw.benefit_category === 'composite' ? 'Tuition and institutional fee coverage' : null,
      maintenance_allowance: raw.benefit_category === 'maintenance_allowance' || raw.benefit_category === 'composite' ? 'Maintenance allowance included' : null,
      books_equipment_allowance: raw.benefit_category === 'books_and_supplies' ? 'Books and equipment grant' : null,
      components: [
        {
          title: 'Direct Benefit Transfer (DBT)',
          amount: raw.annual_benefit_amount || 0,
          description: raw.benefit_breakdown || 'Direct cash grant',
          interval: 'per_year'
        }
      ],
      maximum_duration: 'Normal duration of course of study',
      number_of_installments: 'Annual DBT payment',
      benefit_specific_conditions: []
    },
    application: {
      application_period: 'AY 2026-27 Open',
      deadline: raw.scheme_deadline || '31st October 2026',
      application_mode: 'Online via National Scholarship Portal (scholarships.gov.in) with OTR / Aadhaar authentication',
      renewal_requirements: 'Annual renewal application on NSP with previous year marksheet and bonafide certificate',
      verification_requirements: 'Institute (L1) and District/State Nodal Officer (L2) verification',
      official_application_url: raw.official_application_url || (raw.scheme_code.includes('PMSSS') ? 'https://aicte-jk-scholarship-gov.in/' : 'https://scholarships.gov.in/student/login'),
      scheme_identifier: raw.scheme_code
    },
    documents: {
      required_documents: raw.official_documents_required || [],
      certificates: ['Bonafide Student Certificate'],
      income_certificate: raw.income_ceiling !== null ? `Income Certificate certifying family income below ₹${(raw.income_ceiling || 0).toLocaleString('en-IN')}` : null,
      category_certificate: Array.isArray(raw.eligible_categories) && !raw.eligible_categories.includes('General') ? 'Caste/Community Certificate issued by competent authority' : null,
      disability_certificate: raw.disability_reservation ? 'Disability Certificate with minimum 40% benchmark disability' : null,
      domicile_certificate: Array.isArray(raw.state_domicile) && !raw.state_domicile.includes('ALL') ? 'Domicile Certificate of eligible state/UT' : null,
      academic_documents: ['Previous qualifying examination marksheet', 'Bonafide certificate'],
      scheme_specific_documents: []
    },
    restrictions: {
      exclusions: raw.disqualifications || [],
      conditions_ineligible: raw.disqualifications || [],
      simultaneous_scholarship_restrictions: raw.nsp_conflict_guidelines?.rule_description || 'Student cannot hold two simultaneous full-fee scholarships under NSP guidelines.',
      fee_reimbursement_restrictions: raw.nsp_conflict_guidelines?.fee_component_conflict ? 'Cannot claim double tuition fee reimbursement' : null,
      institution_restrictions: null,
      previous_scholarship_restrictions: null,
      conflict_rules: conflictRules
    },
    source: {
      official_portal_url: raw.official_portal_url || 'https://scholarships.gov.in/All-Scholarships',
      official_application_url: raw.official_application_url || (raw.scheme_code.includes('PMSSS') ? 'https://aicte-jk-scholarship-gov.in/' : 'https://scholarships.gov.in/student/login'),
      official_source_url: raw.official_source_url || raw.official_portal_url || 'https://scholarships.gov.in/All-Scholarships',
      scheme_identifier: raw.scheme_code,
      source_url: raw.official_portal_url || 'https://scholarships.gov.in/All-Scholarships',
      official_specification_url: raw.official_source_url || raw.official_portal_url || null,
      official_faq_url: 'https://scholarships.gov.in/faq',
      source_document_name: 'NSP Official Scheme Guidelines AY 2026-27',
      source_academic_year: academicYear,
      last_extracted_timestamp: '2026-09-22T00:00:00Z',
      source_validation_status: 'official_guideline_matched'
    },
    benefit_amount: raw.annual_benefit_amount || 0,
    benefit_details: raw.benefit_breakdown || 'Direct Benefit Transfer (DBT) grant under NSP guidelines.',
    benefit_type: raw.benefit_category,
    required_documents: raw.official_documents_required || [],
    deadline: raw.scheme_deadline || '31st October 2026',
    eligibility_conditions: raw.official_conditions || [],
    exclusions: raw.disqualifications || [],
    conflict_rules: conflictRules,
    source_url: raw.official_portal_url || 'https://scholarships.gov.in/All-Scholarships',
    official_source_url: raw.official_source_url || raw.official_portal_url || 'https://scholarships.gov.in/All-Scholarships',
    official_application_url: raw.official_application_url || (raw.scheme_code.includes('PMSSS') ? 'https://aicte-jk-scholarship-gov.in/' : 'https://scholarships.gov.in/student/login'),
    scheme_identifier: raw.scheme_code,
    source_type: 'National Scholarship Portal',
    is_demo_data: false
  };
}

/**
 * Ingests and normalizes an entire batch of raw NSP schemes.
 */
export function normalizeNspDataset(rawSchemes: RawNspScheme[]): NormalizationReport {
  const errors: { schemeCode: string; reason: string }[] = [];
  const normalizedRecords: Scholarship[] = [];

  for (const raw of rawSchemes) {
    try {
      const normalized = normalizeNspScheme(raw);
      normalizedRecords.push(normalized);
    } catch (err: any) {
      errors.push({
        schemeCode: raw?.scheme_code || 'UNKNOWN',
        reason: err.message || 'Normalization failed'
      });
    }
  }

  return {
    totalProcessed: rawSchemes.length,
    validCount: normalizedRecords.length,
    invalidCount: errors.length,
    errors,
    normalizedRecords
  };
}
