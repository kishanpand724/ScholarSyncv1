/**
 * ScholarSync Comprehensive Types & Interfaces
 * Designed for Team Scholar IQ MVP
 * Aligned with National Scholarship Portal (AY 2026-27) official specifications
 */

export type Category = 'General' | 'OBC' | 'SC' | 'ST' | 'EWS';
export type Gender = 'Female' | 'Male' | 'Other';
export type EducationLevel =
  | 'School'
  | 'Higher Secondary'
  | 'Diploma'
  | 'Undergraduate'
  | 'Postgraduate'
  | 'Doctoral'
  | 'Coaching';

export interface StructuredStudentProfile {
  personal: {
    name: string;
    dob: string;
    gender: Gender;
    marital_status: 'Single' | 'Married' | 'Other';
    religion: string;
    category: Category;
    domicile_state: string;
  };
  family: {
    annual_income: number;
    parent_profession?: string;
    parents_not_alive: boolean;
    girl_children_count?: number | null;
  };
  disability: {
    is_disabled: boolean;
    percentage?: number | null;
    disability_type?: string;
    certificate_number?: string;
    issuing_authority?: string;
  };
  education: {
    scholarship_category: string;
    application_type: 'Fresh' | 'Renewal';
    institute_name: string;
    institution_type: string;
    admission_type: string;
    mode_of_study: 'Regular' | 'Distance' | 'Online' | 'Part-time' | 'Other';
    hosteller_status: 'Hosteller' | 'Day Scholar';
  };
  course: {
    course_name: string;
    branch: string;
    duration_years: number;
    total_semesters: number;
    current_year: string;
    current_semester: string;
    admission_year?: number;
    expected_graduation_year?: number;
  };
  academic: {
    current_cgpa?: number;
    current_percentage?: number;
    previous_semester_score?: number;
    has_backlogs: boolean;
    backlogs_count?: number;
    entry_pathway: '12th' | 'Diploma' | 'Direct';
    twelfth_roll_number?: string;
    twelfth_percentage?: number;
    twelfth_board?: string;
    twelfth_passing_year?: number;
    diploma_percentage?: number;
    diploma_board?: string;
    diploma_passing_year?: number;
    tenth_roll_number?: string;
    tenth_percentage?: number;
    board_top_20_percentile?: boolean;
  };
  renewal?: {
    previous_scholarship_name?: string;
    previous_scholarship_year?: string;
    previous_scholarship_amount?: number;
    previous_application_id?: string;
    previous_academic_result?: string;
  };
  competitive_exam?: {
    has_taken: boolean;
    exam_name?: string;
    roll_number?: string;
    exam_year?: number;
    conducted_by?: string;
    score_or_percentile?: string;
  };
  special_conditions: {
    orphan_status: boolean;
    covid_affected_orphan: boolean;
    ward_of_armed_forces_martyr: boolean;
    ward_of_railway_employee: boolean;
    beedi_cine_worker_ward: boolean;
    additional_tags: string[];
  };
}

export interface StudentProfile {
  id?: string;
  is_completed?: boolean;
  name: string;
  dob?: string;
  date_of_birth?: string;
  gender: Gender;
  marital_status?: 'Single' | 'Married' | 'Other';
  religion?: string;
  category: Category;
  annual_family_income: number; // in INR, e.g. 250000
  parent_annual_income?: number; // alias for NSP profile form
  state_domicile: string; // e.g. "Maharashtra", "Karnataka", "Delhi", "Uttar Pradesh", "All India"
  district_domicile?: string;
  parent_profession?: string;
  parents_not_alive?: boolean;

  // Disability
  is_disabled: boolean;
  disability_percentage?: number; // 0 - 100
  disability_type?: string;
  disability_cert_number?: string;
  disability_issuing_authority?: string;

  // Education / Scholarship Application
  scholarship_category?: string;
  application_type?: 'Fresh' | 'Renewal';
  institute_name?: string;
  institution_type?: string | null;
  institution_state?: string;
  institution_district?: string;
  admission_type?: string | null;
  mode_of_study?: 'Regular' | 'Distance' | 'Online' | 'Part-time' | 'Other';
  hosteller_status?: 'Day Scholar' | 'Hosteller' | null;

  // Course Details
  course: string; // e.g. "B.Tech / B.E.", "MBBS", "B.Sc", "BCA", "B.Com", "Diploma"
  course_type?: string;
  branch?: string;
  duration_years?: number;
  total_semesters?: number;
  education_level: EducationLevel;
  year_of_study?: string | null; // e.g. "1st Year", "2nd Year", "3rd Year", "4th Year"
  current_semester?: string | null;
  admission_year?: number;
  expected_graduation_year?: number;

  // Academic Performance & History
  academic_percentage: number; // 0 - 100
  cgpa?: number; // Optional 0 - 10
  previous_semester_score?: number;
  previous_academic_year_score?: number;
  has_backlogs?: boolean;
  backlogs_count?: number;

  // Previous Qualifications
  entry_pathway?: '12th' | 'Diploma' | 'Direct';
  twelfth_roll_number?: string;
  twelfth_percentage?: number;
  twelfth_board?: string;
  twelfth_passing_year?: number;
  diploma_percentage?: number;
  diploma_board?: string;
  diploma_passing_year?: number;
  tenth_board?: string;
  tenth_roll_number?: string;
  tenth_percentage?: number;
  board_percentile_80th?: boolean | null; // for CSSS Top 20th percentile
  ug_degree_name?: string;
  ug_percentage?: number;

  // Competitive Exam
  competitive_exam_taken?: boolean;
  competitive_exam_name?: string;
  competitive_exam_roll?: string;
  competitive_exam_year?: number;
  competitive_exam_conducted_by?: string;
  competitive_exam_score?: string;

  // Renewal Fields
  previous_scholarship_name?: string;
  previous_scholarship_year?: string;
  previous_scholarship_amount?: number;
  previous_application_id?: string;
  previous_academic_result?: string;

  // Family & Quota Declarations
  family_girl_children_count?: number | null; // e.g. 1 or 2 (Pragati rule)
  orphan_status?: boolean | null; // for Swanath
  covid_affected_orphan?: boolean | null; // for Swanath
  ward_of_armed_forces_martyr?: boolean | null; // for PMSS Police/CAPF
  ward_of_railway_employee?: boolean | null; // for PMSS Railways
  beedi_cine_worker_ward?: boolean | null; // for MOLE
  special_conditions: string[]; // e.g. "Single Girl Child", "Orphan", "Ward of Armed Forces", "First Generation Learner"

  // Hierarchical full structure representation
  structured?: StructuredStudentProfile;

  // Documents possession checklist
  possessed_documents?: string[];
}

export type ScholarshipClassification =
  | 'Central Sector'
  | 'State Government'
  | 'AICTE'
  | 'UGC'
  | 'Ministry of Tribal Affairs'
  | 'Ministry of Social Justice'
  | 'Department of Empowerment of Persons with Disabilities'
  | 'Ministry of Minority Affairs'
  | 'Ministry of Labour & Employment'
  | 'Ministry of Home Affairs'
  | 'Ministry of Railways'
  | 'Department of Higher Education'
  | 'Department of School Education & Literacy'
  | 'Department of Agriculture Research and Education'
  | 'Ministry of Statistics and Programme Implementation'
  | 'Ministry of New and Renewable Energy'
  | 'Ministry of Development of North Eastern Region'
  | 'Private CSR / Foundation';

export type SchemeType = 'merit_based' | 'welfare_based';

export type BenefitType =
  | 'tuition_fee'
  | 'maintenance_allowance'
  | 'fixed_cash_stipend'
  | 'composite'
  | 'books_and_supplies';

export interface ConflictRules {
  exclusive_standalone: boolean; // Cannot be combined with ANY other scholarship
  exclude_same_provider_level: boolean; // Cannot be combined with another scholarship from same tier (e.g. 2 Central Govt schemes)
  conflicting_scholarship_ids?: string[]; // Explicit conflicting IDs
  fee_component_conflict?: boolean; // Cannot combine two scholarships that both pay 100% tuition fees
  max_combined_scholarships?: number; // Maximum limit on stack size
  rule_description: string; // Official rule explanation
}

// ---------------------------------------------------------
// EXTENSIBLE STRUCTURED SCHOLARSHIP SUB-BLOCKS
// ---------------------------------------------------------

export interface SchemeEligibility {
  income_limit: number | null; // null if no ceiling or not specified
  income_limit_description?: string | null;
  category: Category[] | null; // null if open to all / not specified in source
  category_description?: string | null;
  course: string[] | null; // null if open to all / not specified
  course_description?: string | null;
  education_level: EducationLevel[] | null; // null if not specified
  education_level_description?: string | null;
  minimum_percentage: number | null; // null if not specified
  percentage_description?: string | null;
  cgpa_requirement?: string | null;
  gender: 'FEMALE' | 'MALE' | 'ANY' | null; // null if not specified in source
  gender_description?: string | null;
  state_domicile: string[] | null; // null if not specified in source
  state_domicile_description?: string | null;
  region_specific_conditions?: string[] | null;

  // Disability criteria
  disability_required: boolean | null; // null if not specified in source
  minimum_disability_percentage?: number | null;
  disability_description?: string | null;

  // Dynamic / granular conditions from official source guidelines
  year_of_study?: string | null;
  admission_type?: string | null;
  institution_requirements?: string[] | null;
  family_conditions?: string[] | null;
  number_of_beneficiaries_limit?: string | null;
  age_requirement?: string | null;
  special_category_requirements?: string[] | null;
  other_conditions?: string[] | null;
}

export type ScholarshipEligibility = SchemeEligibility;

export interface SchemeSelection {
  selection_criteria: string | null;
  merit_criteria: string | null;
  ranking_method: string | null;
  selection_priority: string | null;
  state_wise_allocation: string | null;
  renewal_conditions: string | null;
}

export interface FinancialComponent {
  title: string;
  amount: number | null;
  description: string;
  interval?: 'per_month' | 'per_year' | 'one_time' | 'actual_fee' | null;
}

export interface SchemeBenefits {
  amount: number | null;
  amount_per_interval: string | null;
  fee_reimbursement: string | null;
  maintenance_allowance: string | null;
  books_equipment_allowance: string | null;
  components: FinancialComponent[];
  maximum_duration: string | null;
  number_of_installments: string | null;
  benefit_specific_conditions: string[];
}

export interface SchemeApplication {
  application_period: string | null;
  deadline: string;
  application_mode: string;
  renewal_requirements: string | null;
  verification_requirements: string | null;
  official_application_url?: string | null;
  scheme_identifier?: string | null;
}

export interface SchemeDocuments {
  required_documents: string[];
  certificates: string[];
  income_certificate: string | null;
  category_certificate: string | null;
  disability_certificate: string | null;
  domicile_certificate: string | null;
  academic_documents: string[];
  scheme_specific_documents: string[];
  submission_format?: string;
  max_file_size?: string;
}

export interface SchemeRestrictions {
  exclusions: string[];
  conditions_ineligible: string[];
  simultaneous_scholarship_restrictions: string | null;
  fee_reimbursement_restrictions: string | null;
  institution_restrictions: string | null;
  previous_scholarship_restrictions: string | null;
  conflict_rules: ConflictRules;
}

export interface SchemeSource {
  official_portal_url: string;
  official_application_url?: string | null;
  official_source_url?: string | null;
  scheme_identifier?: string | null;
  source_url: string;
  official_specification_url: string | null;
  official_faq_url: string | null;
  source_document_name: string | null;
  source_academic_year: string;
  last_extracted_timestamp: string;
  source_validation_status: 'verified' | 'needs_review' | 'official_guideline_matched';
  validation_notes?: string | null;
}

// Full Scholarship Object
export interface Scholarship {
  id: string;
  name: string;
  provider: string;
  academic_year: string;
  scheme_type: SchemeType;
  classification: ScholarshipClassification;
  description?: string | null;
  department?: string;
  source_portal?: string;
  mahadbt_scheme_type?: 'scholarship' | 'fee_reimbursement' | 'maintenance_allowance' | 'freeship' | 'vocational_training' | 'education_assistance' | 'other_government_scheme' | string;

  // Extensible structured modules
  eligibility: SchemeEligibility;
  selection: SchemeSelection;
  benefits: SchemeBenefits;
  application: SchemeApplication;
  documents: SchemeDocuments;
  restrictions: SchemeRestrictions;
  source: SchemeSource;

  // Top-level aliases for backwards compatibility with existing views
  benefit_amount: number;
  benefit_details: string;
  benefit_type: BenefitType;
  required_documents: string[];
  deadline: string;
  eligibility_conditions: string[];
  exclusions: string[];
  conflict_rules: ConflictRules;
  source_url: string;
  source_type: string;
  official_specification_url?: string;
  official_faq_url?: string | null;
  official_source_url?: string;
  official_application_url?: string;
  scheme_identifier?: string;
  source_validation_status?: string;
  is_demo_data?: boolean;
}

// ---------------------------------------------------------
// EXPLAINABLE THREE-STATE EVALUATION ENGINE TYPES
// ---------------------------------------------------------

export type CriterionStatus = 'satisfied' | 'not_satisfied' | 'undetermined';

export interface CriterionCheck {
  criterion: string;
  status: CriterionStatus;
  passed: boolean; // true if status === 'satisfied'
  student_value: string;
  required_value: string;
  reason: string;
  field_key?: string;
}

export type EligibilityStatus = 'eligible' | 'undetermined' | 'not_eligible';

export interface MatchResult {
  scholarship: Scholarship;
  status: EligibilityStatus; // 'eligible' (all passed), 'undetermined' (needs additional info), 'not_eligible' (at least 1 failed)
  eligible: boolean; // true only if status === 'eligible'
  criteria_checks: CriterionCheck[];
  rejection_reasons: string[];
  missing_info_reasons: string[];
  match_score: number; // percentage of satisfied criteria
}

export interface InvalidCombination {
  scholarship_ids: string[];
  scholarship_names: string[];
  reason: string;
  conflict_type:
    | 'exclusive_standalone'
    | 'same_provider_level'
    | 'explicit_conflict'
    | 'fee_duplication'
    | 'stack_limit'
    | 'nsp_dual_merit_restriction';
  conflicting_pair: [string, string];
}

export interface ValidCombination {
  id: string;
  scholarship_ids: string[];
  scholarships: Scholarship[];
  scholarship_names: string[];
  total_potential_benefit: number;
  benefit_breakdown: { name: string; amount: number; type: BenefitType }[];
  count: number;
  compatibility_status:
    | 'Fully Compatible'
    | 'NSP Merit + Welfare Stacking'
    | 'Complementary (Fee + Maintenance)'
    | 'State + CSR Stacking'
    | 'AICTE + Private Stacking';
  important_conditions: string[];
  merged_documents: string[];
  conflict_audit_notes: string[];
}

export interface AnalysisResponse {
  student_profile: StudentProfile;
  summary: {
    total_analyzed: number;
    eligible_count: number;
    undetermined_count: number;
    ineligible_count: number;
    valid_combinations_count: number;
    invalid_combinations_count: number;
    max_potential_benefit: number;
  };
  eligible_scholarships: MatchResult[];
  undetermined_scholarships: MatchResult[];
  ineligible_scholarships: MatchResult[];
  valid_combinations: ValidCombination[];
  invalid_combinations: InvalidCombination[];
}

/**
 * Constructs a canonical StructuredStudentProfile from a StudentProfile
 */
export function buildStructuredProfile(p: StudentProfile): StructuredStudentProfile {
  const dobVal = p.dob || p.date_of_birth || '';
  const incomeVal = p.annual_family_income !== undefined ? p.annual_family_income : (p.parent_annual_income !== undefined ? p.parent_annual_income : 0);
  const percentageVal = p.academic_percentage !== undefined ? p.academic_percentage : 0;
  const cgpaVal = p.cgpa !== undefined ? p.cgpa : (percentageVal > 0 ? Number((percentageVal / 9.5).toFixed(2)) : 0);

  return {
    personal: {
      name: p.name !== undefined ? p.name : '',
      dob: dobVal,
      gender: p.gender || 'Male',
      marital_status: p.marital_status || 'Single',
      religion: p.religion !== undefined ? p.religion : 'Hindu',
      category: p.category || 'General',
      domicile_state: p.state_domicile !== undefined ? p.state_domicile : ''
    },
    family: {
      annual_income: incomeVal,
      parent_profession: p.parent_profession !== undefined ? p.parent_profession : 'Private Sector / Self-Employed',
      parents_not_alive: Boolean(p.parents_not_alive),
      girl_children_count: p.family_girl_children_count ?? null
    },
    disability: {
      is_disabled: Boolean(p.is_disabled),
      percentage: p.disability_percentage ?? null,
      disability_type: p.disability_type || '',
      certificate_number: p.disability_cert_number || '',
      issuing_authority: p.disability_issuing_authority || ''
    },
    education: {
      scholarship_category: p.scholarship_category || 'Post Matric/Top Class/MCM',
      application_type: p.application_type || 'Fresh',
      institute_name: p.institute_name !== undefined ? p.institute_name : '',
      institution_type: p.institution_type || 'AICTE Approved Institution',
      admission_type: p.admission_type || 'Merit / Centralized Counseling',
      mode_of_study: p.mode_of_study || 'Regular',
      hosteller_status: (p.hosteller_status as 'Hosteller' | 'Day Scholar') || 'Day Scholar'
    },
    course: {
      course_name: p.course || 'B.Tech / B.E.',
      branch: p.branch !== undefined ? p.branch : '',
      duration_years: p.duration_years || 4,
      total_semesters: p.total_semesters || 8,
      current_year: p.year_of_study || '1st Year',
      current_semester: p.current_semester || 'Semester 1',
      admission_year: p.admission_year || 2024,
      expected_graduation_year: p.expected_graduation_year || 2028
    },
    academic: {
      current_cgpa: cgpaVal,
      current_percentage: percentageVal,
      previous_semester_score: p.previous_semester_score ?? percentageVal,
      has_backlogs: Boolean(p.has_backlogs),
      backlogs_count: p.backlogs_count ?? 0,
      entry_pathway: p.entry_pathway || '12th',
      twelfth_roll_number: p.twelfth_roll_number || '',
      twelfth_percentage: p.twelfth_percentage ?? percentageVal,
      twelfth_board: p.twelfth_board || 'CBSE (Central Board of Secondary Education)',
      twelfth_passing_year: p.twelfth_passing_year || 2024,
      diploma_percentage: p.diploma_percentage,
      diploma_board: p.diploma_board,
      diploma_passing_year: p.diploma_passing_year,
      tenth_roll_number: p.tenth_roll_number || '',
      tenth_percentage: p.tenth_percentage ?? percentageVal,
      board_top_20_percentile: p.board_percentile_80th ?? false
    },
    renewal: p.application_type === 'Renewal' ? {
      previous_scholarship_name: p.previous_scholarship_name,
      previous_scholarship_year: p.previous_scholarship_year,
      previous_scholarship_amount: p.previous_scholarship_amount,
      previous_application_id: p.previous_application_id,
      previous_academic_result: p.previous_academic_result || 'Passed / Promoted'
    } : undefined,
    competitive_exam: p.competitive_exam_taken ? {
      has_taken: true,
      exam_name: p.competitive_exam_name || 'JEE Main',
      roll_number: p.competitive_exam_roll || '',
      exam_year: p.competitive_exam_year || 2024,
      conducted_by: p.competitive_exam_conducted_by || 'NTA (National Testing Agency)',
      score_or_percentile: p.competitive_exam_score || '92.5 Percentile'
    } : {
      has_taken: false
    },
    special_conditions: {
      orphan_status: Boolean(p.orphan_status),
      covid_affected_orphan: Boolean(p.covid_affected_orphan),
      ward_of_armed_forces_martyr: Boolean(p.ward_of_armed_forces_martyr),
      ward_of_railway_employee: Boolean(p.ward_of_railway_employee),
      beedi_cine_worker_ward: Boolean(p.beedi_cine_worker_ward),
      additional_tags: p.special_conditions || []
    }
  };
}

/**
 * Synchronizes flat fields and nested structured fields in both directions
 */
export function syncProfileFields(p: StudentProfile): StudentProfile {
  const structured = buildStructuredProfile(p);

  return {
    ...p,
    name: structured.personal.name,
    dob: structured.personal.dob,
    date_of_birth: structured.personal.dob,
    gender: structured.personal.gender,
    marital_status: structured.personal.marital_status,
    religion: structured.personal.religion,
    category: structured.personal.category,
    state_domicile: structured.personal.domicile_state,

    annual_family_income: structured.family.annual_income,
    parent_annual_income: structured.family.annual_income,
    parent_profession: structured.family.parent_profession,
    parents_not_alive: structured.family.parents_not_alive,
    family_girl_children_count: structured.family.girl_children_count,

    is_disabled: structured.disability.is_disabled,
    disability_percentage: structured.disability.is_disabled ? (structured.disability.percentage ?? 0) : 0,
    disability_type: structured.disability.disability_type,
    disability_cert_number: structured.disability.certificate_number,
    disability_issuing_authority: structured.disability.issuing_authority,

    scholarship_category: structured.education.scholarship_category,
    application_type: structured.education.application_type,
    institute_name: structured.education.institute_name,
    institution_type: structured.education.institution_type,
    admission_type: structured.education.admission_type,
    mode_of_study: structured.education.mode_of_study,
    hosteller_status: structured.education.hosteller_status,

    course: structured.course.course_name,
    branch: structured.course.branch,
    duration_years: structured.course.duration_years,
    total_semesters: structured.course.total_semesters,
    year_of_study: structured.course.current_year,
    current_semester: structured.course.current_semester,
    admission_year: structured.course.admission_year,
    expected_graduation_year: structured.course.expected_graduation_year,

    academic_percentage: structured.academic.current_percentage ?? 0,
    cgpa: structured.academic.current_cgpa ?? 0,
    previous_semester_score: structured.academic.previous_semester_score,
    has_backlogs: structured.academic.has_backlogs,
    backlogs_count: structured.academic.backlogs_count,

    entry_pathway: structured.academic.entry_pathway,
    twelfth_roll_number: structured.academic.twelfth_roll_number,
    twelfth_percentage: structured.academic.twelfth_percentage,
    twelfth_board: structured.academic.twelfth_board,
    twelfth_passing_year: structured.academic.twelfth_passing_year,
    diploma_percentage: structured.academic.diploma_percentage,
    diploma_board: structured.academic.diploma_board,
    diploma_passing_year: structured.academic.diploma_passing_year,
    tenth_roll_number: structured.academic.tenth_roll_number,
    tenth_percentage: structured.academic.tenth_percentage,
    board_percentile_80th: structured.academic.board_top_20_percentile,

    competitive_exam_taken: structured.competitive_exam?.has_taken ?? false,
    competitive_exam_name: structured.competitive_exam?.exam_name,
    competitive_exam_roll: structured.competitive_exam?.roll_number,
    competitive_exam_year: structured.competitive_exam?.exam_year,
    competitive_exam_conducted_by: structured.competitive_exam?.conducted_by,
    competitive_exam_score: structured.competitive_exam?.score_or_percentile,

    previous_scholarship_name: structured.renewal?.previous_scholarship_name,
    previous_scholarship_year: structured.renewal?.previous_scholarship_year,
    previous_scholarship_amount: structured.renewal?.previous_scholarship_amount,
    previous_application_id: structured.renewal?.previous_application_id,
    previous_academic_result: structured.renewal?.previous_academic_result,

    orphan_status: structured.special_conditions.orphan_status,
    covid_affected_orphan: structured.special_conditions.covid_affected_orphan,
    ward_of_armed_forces_martyr: structured.special_conditions.ward_of_armed_forces_martyr,
    ward_of_railway_employee: structured.special_conditions.ward_of_railway_employee,
    beedi_cine_worker_ward: structured.special_conditions.beedi_cine_worker_ward,
    special_conditions: structured.special_conditions.additional_tags,

    structured
  };
}
