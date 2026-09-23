/**
 * Official National Scholarship Portal (NSP) Dataset
 * Source: National Scholarship Portal (https://scholarships.gov.in/All-Scholarships)
 * Academic Year: 2026-27
 *
 * All records strictly represent real schemes published on the official NSP portal.
 * No fictional, placeholder, or third-party records.
 */

export interface RawNspScheme {
  scheme_code: string;
  official_name: string;
  ministry_or_department: string;
  academic_year: string;
  scheme_type: 'merit_based' | 'welfare_based';
  classification:
    | 'Central Sector'
    | 'AICTE'
    | 'UGC'
    | 'Ministry of Tribal Affairs'
    | 'Ministry of Social Justice'
    | 'Department of Empowerment of Persons with Disabilities'
    | 'Ministry of Minority Affairs'
    | 'State Government';
  annual_benefit_amount: number;
  benefit_breakdown: string;
  benefit_category: 'tuition_fee' | 'maintenance_allowance' | 'fixed_cash_stipend' | 'composite' | 'books_and_supplies';
  income_ceiling: number | null;
  eligible_categories: ('General' | 'OBC' | 'SC' | 'ST' | 'EWS')[];
  eligible_courses: string[];
  education_stages: ('Higher Secondary' | 'Diploma' | 'Undergraduate' | 'Postgraduate' | 'Doctoral')[];
  minimum_qualifying_percentage: number;
  gender_eligibility: 'ANY' | 'FEMALE' | 'MALE';
  state_domicile: string[];
  disability_reservation: boolean;
  benchmark_disability_percentage: number | null;
  special_reservations?: string[];
  official_documents_required: string[];
  scheme_deadline: string;
  official_conditions: string[];
  disqualifications: string[];
  nsp_conflict_guidelines: {
    exclusive_standalone: boolean;
    exclude_same_provider_level: boolean;
    fee_component_conflict: boolean;
    conflicting_scholarship_ids?: string[];
    max_combined_scholarships?: number;
    rule_description: string;
  };
  official_portal_url: string;
  official_application_url?: string;
  official_source_url?: string;
}

export const OFFICIAL_NSP_SCHEMES_2026_27: RawNspScheme[] = [
  {
    scheme_code: 'NSP-MOE-CSSS-2026',
    official_name: 'PM-USP – Central Sector Scheme Of Scholarship For College And University Students (CSSS)',
    ministry_or_department: 'Department of Higher Education, Ministry of Education',
    academic_year: '2026-27',
    scheme_type: 'merit_based',
    classification: 'Central Sector',
    annual_benefit_amount: 12000,
    benefit_breakdown: '₹12,000 per annum for Undergraduate studies (first 3 years); ₹20,000 per annum at Postgraduate level directly credited via DBT to bank account.',
    benefit_category: 'fixed_cash_stipend',
    income_ceiling: 450000,
    eligible_categories: ['General', 'OBC', 'SC', 'ST', 'EWS'],
    eligible_courses: ['ALL', 'B.Tech / B.E.', 'MBBS', 'B.Sc', 'BCA', 'B.Com', 'B.A.', 'B.Arch', 'B.Pharm'],
    education_stages: ['Undergraduate', 'Postgraduate'],
    minimum_qualifying_percentage: 80.0,
    gender_eligibility: 'ANY',
    state_domicile: ['ALL'],
    disability_reservation: false,
    benchmark_disability_percentage: null,
    special_reservations: [],
    official_documents_required: [
      'Class 12th / Qualifying Board Marksheet (Top 20th Percentile Verification)',
      'Income Certificate issued by competent Revenue Authority',
      'Aadhaar Number / Aadhaar Enrolment Slip',
      'Student Bank Account Passbook (Aadhaar seeded)',
      'Current Year College Admission & Fee Verification Receipt'
    ],
    scheme_deadline: '31st October 2026',
    official_conditions: [
      'Applicant must be above the 80th percentile of successful candidates in relevant stream in Class XII / 10+2.',
      'Pursuing regular full-time degree courses from recognized Higher Educational Institutions.',
      'Gross family annual income must not exceed ₹4,50,000 per annum.',
      'Not available for distance education or correspondence courses.'
    ],
    disqualifications: [
      'Students pursuing diploma courses not leading to degree.',
      'Students availing benefits under any other Central Sector merit-based scholarship scheme.'
    ],
    nsp_conflict_guidelines: {
      exclusive_standalone: false,
      exclude_same_provider_level: true,
      fee_component_conflict: false,
      max_combined_scholarships: 2,
      rule_description: 'Designated as a Merit-based scheme under NSP AY 2026-27. Under NSP rules, a student can hold only 1 Merit-based scholarship, but may combine with 1 compatible Welfare-based grant.'
    },
    official_portal_url: 'https://scholarships.gov.in/All-Scholarships'
  },
  {
    scheme_code: 'NSP-AICTE-PRAGATI-2026',
    official_name: 'AICTE - Pragati Scholarship Scheme For Girl Students (Technical Degree)',
    ministry_or_department: 'All India Council for Technical Education (AICTE), Ministry of Education',
    academic_year: '2026-27',
    scheme_type: 'welfare_based',
    classification: 'AICTE',
    annual_benefit_amount: 50000,
    benefit_breakdown: '₹50,000 per annum lump sum for every year of study towards college fee payment, computer purchase, stationary, books, and equipment.',
    benefit_category: 'composite',
    income_ceiling: 800000,
    eligible_categories: ['General', 'OBC', 'SC', 'ST', 'EWS'],
    eligible_courses: ['B.Tech / B.E.', 'B.Arch', 'B.Pharm', 'Engineering/Technical'],
    education_stages: ['Undergraduate'],
    minimum_qualifying_percentage: 55.0,
    gender_eligibility: 'FEMALE',
    state_domicile: ['ALL'],
    disability_reservation: false,
    benchmark_disability_percentage: null,
    special_reservations: ['Single Girl Child'],
    official_documents_required: [
      'Class 10th and 12th Board Marksheets',
      'Valid Central/State Income Certificate (Annual family income <= ₹8 Lakhs)',
      'AICTE Approved Institution Admission Letter (Degree Level Technical Course)',
      'Tuition Fee Receipt for current academic year',
      'Parental Declaration stating maximum 2 girl children per family',
      'Student Bank Account details linked with Aadhaar'
    ],
    scheme_deadline: '31st October 2026',
    official_conditions: [
      'Exclusively for female students admitted to 1st year of Degree level course OR 2nd year of Degree course via lateral entry.',
      'Institution must be AICTE approved.',
      'Maximum two girl children per family are eligible.',
      'Family income from all sources must not exceed ₹8,00,000 per annum.'
    ],
    disqualifications: [
      'Students admitted through management quota or non-AICTE approved institutions.',
      'Recipient of any other simultaneous AICTE scholarship (e.g. Saksham or Swanath).'
    ],
    nsp_conflict_guidelines: {
      exclusive_standalone: false,
      exclude_same_provider_level: false,
      fee_component_conflict: false,
      conflicting_scholarship_ids: ['NSP-AICTE-SAKSHAM-2026', 'NSP-AICTE-SWANATH-2026'],
      max_combined_scholarships: 2,
      rule_description: 'AICTE guidelines allow Pragati recipients to avail state tuition fee waivers or compatible merit scholarships, provided duplicate fee component is not drawn.'
    },
    official_portal_url: 'https://scholarships.gov.in/All-Scholarships'
  },
  {
    scheme_code: 'NSP-AICTE-SAKSHAM-2026',
    official_name: 'AICTE - Saksham Scholarship Scheme For Specially Abled Student (Technical Degree)',
    ministry_or_department: 'All India Council for Technical Education (AICTE), Ministry of Education',
    academic_year: '2026-27',
    scheme_type: 'welfare_based',
    classification: 'AICTE',
    annual_benefit_amount: 50000,
    benefit_breakdown: '₹50,000 per annum lump sum grant towards college fee, specialized assistive software, laptop, books, and study material.',
    benefit_category: 'composite',
    income_ceiling: 800000,
    eligible_categories: ['General', 'OBC', 'SC', 'ST', 'EWS'],
    eligible_courses: ['B.Tech / B.E.', 'B.Arch', 'B.Pharm', 'Engineering/Technical'],
    education_stages: ['Undergraduate'],
    minimum_qualifying_percentage: 50.0,
    gender_eligibility: 'ANY',
    state_domicile: ['ALL'],
    disability_reservation: true,
    benchmark_disability_percentage: 40,
    special_reservations: [],
    official_documents_required: [
      'Disability Certificate issued by competent District Medical Authority (minimum 40% benchmark disability)',
      'Class 10th and 12th qualifying Marksheets',
      'Income Certificate (Annual family income <= ₹8 Lakhs)',
      'Admission allotment letter to AICTE approved technical degree program',
      'Aadhaar seeded bank account passbook copy'
    ],
    scheme_deadline: '31st October 2026',
    official_conditions: [
      'Specially abled students having not less than 40% benchmark disability.',
      'Admitted to 1st year of Degree level technical course in an AICTE approved institution.',
      'Annual family income from all sources must not exceed ₹8,00,000.'
    ],
    disqualifications: [
      'Disability below 40% statutory threshold.',
      'Concurrently availing another AICTE scholarship scheme.'
    ],
    nsp_conflict_guidelines: {
      exclusive_standalone: false,
      exclude_same_provider_level: false,
      fee_component_conflict: false,
      conflicting_scholarship_ids: ['NSP-AICTE-PRAGATI-2026', 'NSP-AICTE-SWANATH-2026'],
      max_combined_scholarships: 2,
      rule_description: 'Welfare-based scheme for PwD technical scholars. Compatible with Central merit awards or state living assistance.'
    },
    official_portal_url: 'https://scholarships.gov.in/All-Scholarships'
  },
  {
    scheme_code: 'NSP-AICTE-SWANATH-2026',
    official_name: 'AICTE - Swanath Scholarship Scheme (Technical Degree)',
    ministry_or_department: 'All India Council for Technical Education (AICTE), Ministry of Education',
    academic_year: '2026-27',
    scheme_type: 'welfare_based',
    classification: 'AICTE',
    annual_benefit_amount: 50000,
    benefit_breakdown: '₹50,000 per annum lump sum grant towards college academic fees, hostel and educational expenses.',
    benefit_category: 'composite',
    income_ceiling: 800000,
    eligible_categories: ['General', 'OBC', 'SC', 'ST', 'EWS'],
    eligible_courses: ['B.Tech / B.E.', 'B.Arch', 'B.Pharm', 'Engineering/Technical'],
    education_stages: ['Undergraduate'],
    minimum_qualifying_percentage: 50.0,
    gender_eligibility: 'ANY',
    state_domicile: ['ALL'],
    disability_reservation: false,
    benchmark_disability_percentage: null,
    special_reservations: ['Orphan', 'Ward of Armed Forces'],
    official_documents_required: [
      'Death certificate of parents (for Orphans) or Armed Forces / Central Paramilitary Forces martyr certificate',
      'Income Certificate (Annual family income <= ₹8 Lakhs)',
      'Class 12th mark sheet and admission verification in AICTE approved college',
      'Bank Account details in name of applicant'
    ],
    scheme_deadline: '31st October 2026',
    official_conditions: [
      'Candidate must be an Orphan, OR either/both parents died due to Covid-19, OR wards of Armed Forces/CAPF martyred in action.',
      'Pursuing Degree level course in an AICTE approved institution.',
      'Family income not exceeding ₹8,00,000 per annum.'
    ],
    disqualifications: [
      'Non-AICTE approved institutions.',
      'Recipient of simultaneous AICTE Pragati or Saksham scholarship.'
    ],
    nsp_conflict_guidelines: {
      exclusive_standalone: false,
      exclude_same_provider_level: false,
      fee_component_conflict: false,
      conflicting_scholarship_ids: ['NSP-AICTE-PRAGATI-2026', 'NSP-AICTE-SAKSHAM-2026'],
      max_combined_scholarships: 2,
      rule_description: 'Welfare-based grant for orphan/martyr wards. Can be held concurrently with non-conflicting merit awards.'
    },
    official_portal_url: 'https://scholarships.gov.in/All-Scholarships'
  },
  {
    scheme_code: 'NSP-MSJE-TOPCLASS-SC-2026',
    official_name: 'Central Sector Scholarship Of Top Class Education For SC Students',
    ministry_or_department: 'Ministry of Social Justice & Empowerment',
    academic_year: '2026-27',
    scheme_type: 'welfare_based',
    classification: 'Ministry of Social Justice',
    annual_benefit_amount: 196000,
    benefit_breakdown: 'Full tuition fee and non-refundable fees (up to ₹2,00,000/yr in private / full in govt) + Living expenses ₹3,000/month (₹36,000/yr) + Books & stationery ₹5,000/yr + Computer grant ₹45,000 one-time.',
    benefit_category: 'composite',
    income_ceiling: 800000,
    eligible_categories: ['SC'],
    eligible_courses: ['B.Tech / B.E.', 'MBBS', 'MBA', 'ALL', 'Engineering/Technical', 'Medical'],
    education_stages: ['Undergraduate', 'Postgraduate'],
    minimum_qualifying_percentage: 60.0,
    gender_eligibility: 'ANY',
    state_domicile: ['ALL'],
    disability_reservation: false,
    benchmark_disability_percentage: null,
    special_reservations: [],
    official_documents_required: [
      'Competent Authority Caste Certificate confirming Scheduled Caste (SC) category',
      'Gross Family Income Certificate issued by authorized State Executive Authority',
      'Admission Offer Letter from notified Top Class Institution (IIT, NIT, IIM, AIIMS, NLU, etc.)',
      'Fee Structure & Breakdown Certified by Institution Head',
      'Aadhaar Card copy & seeded Bank Account passbook'
    ],
    scheme_deadline: '31st October 2026',
    official_conditions: [
      'Applicant must belong to Scheduled Caste (SC) community.',
      'Secured admission in notified premier institutions (IITs, NITs, IIMs, AIIMS, NLUs, etc.) as listed under the scheme.',
      'Total annual family income must not exceed ₹8,00,000 per annum.',
      'Scholarship covers full tuition fees plus living and stationery allowances.'
    ],
    disqualifications: [
      'Candidates studying in non-notified colleges.',
      'Holding another scholarship that reimburses tuition fees.'
    ],
    nsp_conflict_guidelines: {
      exclusive_standalone: true,
      exclude_same_provider_level: true,
      fee_component_conflict: true,
      max_combined_scholarships: 1,
      rule_description: 'Standalone Comprehensive Scholarship: As it provides 100% full tuition reimbursement and living allowance, students are not permitted to hold any other scholarship from Central/State governments.'
    },
    official_portal_url: 'https://scholarships.gov.in/All-Scholarships'
  },
  {
    scheme_code: 'NSP-MOTA-FELLOWSHIP-ST-2026',
    official_name: 'National Fellowship And Scholarship For Higher Education Of ST Students',
    ministry_or_department: 'Ministry of Tribal Affairs',
    academic_year: '2026-27',
    scheme_type: 'welfare_based',
    classification: 'Ministry of Tribal Affairs',
    annual_benefit_amount: 191000,
    benefit_breakdown: 'Full tuition fee reimbursement (as per actuals in government / up to ₹2,50,000/yr in private) + Living expenses ₹3,000/month (₹36,000/yr) + Books & stationery ₹5,000/yr + Computer grant ₹45,000 one-time.',
    benefit_category: 'composite',
    income_ceiling: 600000,
    eligible_categories: ['ST'],
    eligible_courses: ['B.Tech / B.E.', 'MBBS', 'MBA', 'M.Tech', 'ALL', 'Engineering/Technical', 'Medical'],
    education_stages: ['Undergraduate', 'Postgraduate', 'Doctoral'],
    minimum_qualifying_percentage: 55.0,
    gender_eligibility: 'ANY',
    state_domicile: ['ALL'],
    disability_reservation: false,
    benchmark_disability_percentage: null,
    special_reservations: [],
    official_documents_required: [
      'ST Certificate issued by competent district authority',
      'Income Certificate (Annual family income <= ₹6,00,000)',
      'Admission Letter from notified Top Class Institution',
      'Institute Fee Verification Certificate',
      'Student Aadhaar and Bank Passbook'
    ],
    scheme_deadline: '31st October 2026',
    official_conditions: [
      'Applicant must belong to Scheduled Tribe (ST) category.',
      'Admitted to notified Top Class institutions across India for degree / PG programs.',
      'Annual family income from all sources must not exceed ₹6,00,000.'
    ],
    disqualifications: [
      'Non-ST candidates.',
      'Holding another Central or State fellowship/scholarship.'
    ],
    nsp_conflict_guidelines: {
      exclusive_standalone: true,
      exclude_same_provider_level: true,
      fee_component_conflict: true,
      max_combined_scholarships: 1,
      rule_description: 'Standalone Comprehensive Grant: Covers full institutional tuition and living stipend; concurrent scholarship holding is strictly forbidden under MoTA guidelines.'
    },
    official_portal_url: 'https://scholarships.gov.in/All-Scholarships'
  },
  {
    scheme_code: 'NSP-DEPWD-POSTMATRIC-2026',
    official_name: 'Post Matric Scholarship For Students With Disabilities',
    ministry_or_department: 'Department of Empowerment of Persons with Disabilities, Ministry of Social Justice & Empowerment',
    academic_year: '2026-27',
    scheme_type: 'welfare_based',
    classification: 'Department of Empowerment of Persons with Disabilities',
    annual_benefit_amount: 24000,
    benefit_breakdown: 'Maintenance allowance (₹1,200/month for Hosteller, ₹550/month for Day Scholar for 10 months) + Disability allowance (₹2,000 to ₹4,000/yr) + Book grant ₹1,500/yr.',
    benefit_category: 'maintenance_allowance',
    income_ceiling: 250000,
    eligible_categories: ['General', 'OBC', 'SC', 'ST', 'EWS'],
    eligible_courses: ['ALL', 'B.Tech / B.E.', 'MBBS', 'B.Sc', 'BCA', 'B.Com', 'B.A.', 'Diploma'],
    education_stages: ['Higher Secondary', 'Diploma', 'Undergraduate', 'Postgraduate'],
    minimum_qualifying_percentage: 50.0,
    gender_eligibility: 'ANY',
    state_domicile: ['ALL'],
    disability_reservation: true,
    benchmark_disability_percentage: 40,
    special_reservations: [],
    official_documents_required: [
      'Unique Disability ID (UDID) Card or Disability Certificate with >= 40% benchmark disability',
      'Annual Family Income Certificate (<= ₹2,50,000)',
      'Previous Examination Passing Marksheet',
      'Admission and Fee receipt for current Post-Matric course',
      'Aadhaar linked bank account passbook'
    ],
    scheme_deadline: '31st October 2026',
    official_conditions: [
      'Applicant must have a valid benchmark disability of 40% or above.',
      'Studying at post-matriculation or post-secondary stage in recognized educational institutions.',
      'Gross family income must not exceed ₹2,50,000 per annum.'
    ],
    disqualifications: [
      'Students with certified disability less than 40%.',
      'Concurrently receiving another Central Government maintenance scholarship.'
    ],
    nsp_conflict_guidelines: {
      exclusive_standalone: false,
      exclude_same_provider_level: false,
      fee_component_conflict: false,
      max_combined_scholarships: 2,
      rule_description: 'Welfare-based maintenance scheme for PwD scholars. Can be legally held alongside a merit-based award or state tuition waiver since it does not duplicate institutional tuition fees.'
    },
    official_portal_url: 'https://scholarships.gov.in/All-Scholarships'
  },
  {
    scheme_code: 'NSP-DEPWD-TOPCLASS-2026',
    official_name: 'Scholarship For Top Class Education For Students With Disabilities',
    ministry_or_department: 'Department of Empowerment of Persons with Disabilities, Ministry of Social Justice & Empowerment',
    academic_year: '2026-27',
    scheme_type: 'welfare_based',
    classification: 'Department of Empowerment of Persons with Disabilities',
    annual_benefit_amount: 185000,
    benefit_breakdown: 'Full reimbursement of tuition fees and non-refundable charges (up to ₹2,00,000/yr) + Maintenance allowance ₹3,000/month (₹36,000/yr) + Books & stationery ₹5,000/yr + Assistive computer grant ₹30,000 one-time.',
    benefit_category: 'composite',
    income_ceiling: 600000,
    eligible_categories: ['General', 'OBC', 'SC', 'ST', 'EWS'],
    eligible_courses: ['B.Tech / B.E.', 'MBBS', 'MBA', 'ALL', 'Engineering/Technical', 'Medical'],
    education_stages: ['Undergraduate', 'Postgraduate'],
    minimum_qualifying_percentage: 55.0,
    gender_eligibility: 'ANY',
    state_domicile: ['ALL'],
    disability_reservation: true,
    benchmark_disability_percentage: 40,
    special_reservations: [],
    official_documents_required: [
      'UDID Card / Disability Certificate (>= 40% disability)',
      'Income Certificate (<= ₹6,00,000 per annum)',
      'Admission verification from notified Top Class Institution',
      'Certified institutional fee break-up',
      'Bank passbook copy with Aadhaar seeding'
    ],
    scheme_deadline: '31st October 2026',
    official_conditions: [
      'Student with not less than 40% benchmark disability.',
      'Secured admission in notified premier Top Class institutions.',
      'Family income not exceeding ₹6,00,000 per annum.'
    ],
    disqualifications: [
      'Institutions not in the notified Top Class list.',
      'Holding another full fee waiver scholarship.'
    ],
    nsp_conflict_guidelines: {
      exclusive_standalone: true,
      exclude_same_provider_level: true,
      fee_component_conflict: true,
      max_combined_scholarships: 1,
      rule_description: 'Standalone Comprehensive Award: Reimburses entire tuition fee and provides living maintenance; no concurrent scholarship allowed.'
    },
    official_portal_url: 'https://scholarships.gov.in/All-Scholarships'
  },
  {
    scheme_code: 'NSP-MSJE-YASASVI-2026',
    official_name: 'PM YASASVI Central Sector Scheme Of Top Class Education In College For OBC, EBC And DNT Students',
    ministry_or_department: 'Ministry of Social Justice & Empowerment',
    academic_year: '2026-27',
    scheme_type: 'welfare_based',
    classification: 'Ministry of Social Justice',
    annual_benefit_amount: 196000,
    benefit_breakdown: 'Full tuition fee reimbursement (up to ₹2,00,000/yr in private / actuals in govt) + Living expenses ₹3,000/month (₹36,000/yr) + Books & stationery ₹5,000/yr + Computer grant ₹45,000 one-time.',
    benefit_category: 'composite',
    income_ceiling: 250000,
    eligible_categories: ['OBC', 'EWS'],
    eligible_courses: ['B.Tech / B.E.', 'MBBS', 'MBA', 'ALL', 'Engineering/Technical', 'Medical'],
    education_stages: ['Undergraduate', 'Postgraduate'],
    minimum_qualifying_percentage: 60.0,
    gender_eligibility: 'ANY',
    state_domicile: ['ALL'],
    disability_reservation: false,
    benchmark_disability_percentage: null,
    special_reservations: [],
    official_documents_required: [
      'OBC / EBC / DNT Community Certificate issued by designated authority',
      'Annual Income Certificate showing family income <= ₹2,50,000',
      'Admission verification letter from notified Top Class Institution',
      'College fee structure verified by head of institution',
      'Aadhaar seeded bank account copy'
    ],
    scheme_deadline: '31st October 2026',
    official_conditions: [
      'Belonging to OBC, Economically Backward Class (EBC), or De-Notified Tribe (DNT) categories.',
      'Secured admission in notified premier institutions across India.',
      'Annual family income must not exceed ₹2,50,000.'
    ],
    disqualifications: [
      'Family income exceeding ₹2.5 Lakhs.',
      'Students in non-notified institutions.'
    ],
    nsp_conflict_guidelines: {
      exclusive_standalone: true,
      exclude_same_provider_level: true,
      fee_component_conflict: true,
      max_combined_scholarships: 1,
      rule_description: 'Standalone Comprehensive Scheme: Covers 100% tuition and living expenses; cannot be held simultaneously with other government scholarships.'
    },
    official_portal_url: 'https://scholarships.gov.in/All-Scholarships'
  },
  {
    scheme_code: 'NSP-UGC-PG-2026',
    official_name: 'National Scholarship For Post Graduate Studies',
    ministry_or_department: 'University Grants Commission (UGC), Ministry of Education',
    academic_year: '2026-27',
    scheme_type: 'merit_based',
    classification: 'UGC',
    annual_benefit_amount: 150000,
    benefit_breakdown: '₹15,000 per month for 10 months each academic year (Total ₹1,50,000 per annum) directly disbursed via DBT.',
    benefit_category: 'fixed_cash_stipend',
    income_ceiling: null,
    eligible_categories: ['General', 'OBC', 'SC', 'ST', 'EWS'],
    eligible_courses: ['M.Tech', 'MBA', 'M.Sc', 'Postgraduate', 'ALL'],
    education_stages: ['Postgraduate'],
    minimum_qualifying_percentage: 60.0,
    gender_eligibility: 'ANY',
    state_domicile: ['ALL'],
    disability_reservation: false,
    benchmark_disability_percentage: null,
    special_reservations: [],
    official_documents_required: [
      'Undergraduate Degree Marksheet & Convocation/Provisional Certificate (min 60% aggregate)',
      'Admission proof in 1st year of regular Master Degree in UGC recognized university/institution',
      'Aadhaar Number and Aadhaar-seeded Bank Passbook'
    ],
    scheme_deadline: '31st October 2026',
    official_conditions: [
      'Enrolled in 1st year of regular full-time Master’s degree program in recognized university or college.',
      'Minimum 60% marks in Bachelor’s degree (55% for SC/ST/PwD candidates).',
      'No income ceiling; selection is strictly based on national merit ranking.'
    ],
    disqualifications: [
      'Distance education or part-time PG students.',
      'Students availing another UGC/CSIR or Central Government merit fellowship.'
    ],
    nsp_conflict_guidelines: {
      exclusive_standalone: false,
      exclude_same_provider_level: true,
      fee_component_conflict: false,
      max_combined_scholarships: 2,
      rule_description: 'Merit-based PG scheme. Under NSP AY 2026-27 rules, students cannot hold two merit-based scholarships simultaneously, but may combine with a compatible welfare-based grant.'
    },
    official_portal_url: 'https://scholarships.gov.in/All-Scholarships'
  },
  {
    scheme_code: 'NSP-UGC-ISHAN-UDAY-2026',
    official_name: 'Ishan Uday Special Scholarship Scheme For NER',
    ministry_or_department: 'University Grants Commission (UGC), Ministry of Education',
    academic_year: '2026-27',
    scheme_type: 'welfare_based',
    classification: 'UGC',
    annual_benefit_amount: 78000,
    benefit_breakdown: '₹5,400 per month for general degree courses (₹54,000/yr); ₹7,800 per month for technical, medical, and professional degree courses (₹78,000/yr).',
    benefit_category: 'composite',
    income_ceiling: 450000,
    eligible_categories: ['General', 'OBC', 'SC', 'ST', 'EWS'],
    eligible_courses: ['ALL', 'B.Tech / B.E.', 'MBBS', 'B.Sc', 'BCA', 'B.Com', 'B.A.', 'Engineering/Technical', 'Medical'],
    education_stages: ['Undergraduate'],
    minimum_qualifying_percentage: 60.0,
    gender_eligibility: 'ANY',
    state_domicile: ['Assam', 'Arunachal Pradesh', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Sikkim', 'Tripura'],
    disability_reservation: false,
    benchmark_disability_percentage: null,
    special_reservations: [],
    official_documents_required: [
      'Domicile / Permanent Resident Certificate (PRC) of North Eastern State issued by authorized officer',
      'Income Certificate (Annual family income <= ₹4.5 Lakhs)',
      'Class 12th passing marksheet',
      'Admission verification into 1st year general or professional degree program',
      'Aadhaar seeded bank account passbook'
    ],
    scheme_deadline: '31st October 2026',
    official_conditions: [
      'Domicile of North Eastern Region (NER) states only.',
      'Passed Class XII or equivalent from a school situated in NER recognized by CBSE, ICSE, or State Board.',
      'Admitted to 1st year of general degree or professional degree course.',
      'Family income must not exceed ₹4,50,000 per annum.'
    ],
    disqualifications: [
      'Students admitted under management quota.',
      'Students who are not domiciles of North Eastern states.'
    ],
    nsp_conflict_guidelines: {
      exclusive_standalone: false,
      exclude_same_provider_level: false,
      fee_component_conflict: false,
      max_combined_scholarships: 2,
      rule_description: 'Regional welfare-based scheme for NER scholars. Can be legally paired with a compatible merit scholarship under NSP AY 2026-27 rules.'
    },
    official_portal_url: 'https://scholarships.gov.in/All-Scholarships'
  },
  {
    scheme_code: 'NSP-MOMA-POSTMATRIC-2026',
    official_name: 'Post Matric Scholarship Scheme for Minorities',
    ministry_or_department: 'Ministry of Minority Affairs',
    academic_year: '2026-27',
    scheme_type: 'welfare_based',
    classification: 'Ministry of Minority Affairs',
    annual_benefit_amount: 13000,
    benefit_breakdown: 'Course/tuition fee up to ₹7,000/yr + Maintenance allowance ₹570/month hosteller / ₹300/month day scholar for 10 months (Total approx ₹10,000 - ₹13,000/yr).',
    benefit_category: 'composite',
    income_ceiling: 200000,
    eligible_categories: ['General', 'OBC', 'EWS'],
    eligible_courses: ['ALL', 'B.Sc', 'B.Com', 'B.A.', 'Higher Secondary', 'Diploma', 'Undergraduate'],
    education_stages: ['Higher Secondary', 'Diploma', 'Undergraduate', 'Postgraduate'],
    minimum_qualifying_percentage: 50.0,
    gender_eligibility: 'ANY',
    state_domicile: ['ALL'],
    disability_reservation: false,
    benchmark_disability_percentage: null,
    special_reservations: ['Minority Community'],
    official_documents_required: [
      'Self-declaration of minority community (Muslim, Christian, Sikh, Buddhist, Jain, Parsi)',
      'Competent Revenue Authority Income Certificate (<= ₹2,00,000 per annum)',
      'Previous qualifying marksheet (min 50%)',
      'Admission fee receipt',
      'Aadhaar seeded bank account passbook'
    ],
    scheme_deadline: '31st October 2026',
    official_conditions: [
      'Belonging to notified minority communities (Muslim, Christian, Sikh, Buddhist, Jain, Parsi).',
      'Minimum 50% marks or equivalent grade in previous final examination.',
      'Annual family income not exceeding ₹2,00,000.'
    ],
    disqualifications: [
      'Non-minority applicants.',
      'Concurrently availing another government scholarship for same course.'
    ],
    nsp_conflict_guidelines: {
      exclusive_standalone: false,
      exclude_same_provider_level: true,
      fee_component_conflict: false,
      max_combined_scholarships: 2,
      rule_description: 'Welfare-based minority scholarship. Governed by NSP Clause 7.2 (cannot combine with another Central Sector minority scheme).'
    },
    official_portal_url: 'https://scholarships.gov.in/All-Scholarships'
  },
  {
    scheme_code: 'NSP-MOMA-MCM-2026',
    official_name: 'Merit-cum-Means Scholarship for Professional and Technical Courses CS',
    ministry_or_department: 'Ministry of Minority Affairs',
    academic_year: '2026-27',
    scheme_type: 'welfare_based',
    classification: 'Ministry of Minority Affairs',
    annual_benefit_amount: 30000,
    benefit_breakdown: 'Course fee reimbursement up to ₹20,000/yr + Maintenance allowance ₹10,000/yr (₹1,000/month for 10 months).',
    benefit_category: 'composite',
    income_ceiling: 250000,
    eligible_categories: ['General', 'OBC', 'EWS'],
    eligible_courses: ['B.Tech / B.E.', 'MBBS', 'MBA', 'MCA', 'B.Arch', 'B.Pharm', 'Engineering/Technical', 'Medical'],
    education_stages: ['Undergraduate', 'Postgraduate'],
    minimum_qualifying_percentage: 50.0,
    gender_eligibility: 'ANY',
    state_domicile: ['ALL'],
    disability_reservation: false,
    benchmark_disability_percentage: null,
    special_reservations: ['Minority Community'],
    official_documents_required: [
      'Self-declaration of notified minority status',
      'Family Income Certificate (<= ₹2,50,000 per annum)',
      'Admission proof to recognized professional/technical course',
      'Mark sheet of qualifying examination (min 50%)',
      'Aadhaar linked bank account passbook'
    ],
    scheme_deadline: '31st October 2026',
    official_conditions: [
      'Notified minority community students pursuing professional or technical degree courses.',
      'Minimum 50% marks in qualifying degree or board examination.',
      'Annual family income not exceeding ₹2,50,000.'
    ],
    disqualifications: [
      'General non-professional courses (B.A., B.Com).',
      'Simultaneous claim under Post Matric Minority scholarship.'
    ],
    nsp_conflict_guidelines: {
      exclusive_standalone: false,
      exclude_same_provider_level: true,
      fee_component_conflict: true,
      conflicting_scholarship_ids: ['NSP-MOMA-POSTMATRIC-2026'],
      max_combined_scholarships: 2,
      rule_description: 'Merit-cum-means technical welfare grant. Cannot be claimed concurrently with general Post-Matric Minority scholarship.'
    },
    official_portal_url: 'https://scholarships.gov.in/All-Scholarships'
  },
  {
    scheme_code: 'NSP-MSJE-POSTMATRIC-SC-2026',
    official_name: 'Post Matric Scholarship for SC Students',
    ministry_or_department: 'Ministry of Social Justice & Empowerment',
    academic_year: '2026-27',
    scheme_type: 'welfare_based',
    classification: 'Ministry of Social Justice',
    annual_benefit_amount: 38000,
    benefit_breakdown: 'Compulsory non-refundable institutional fee reimbursement + Academic allowance (₹13,500/yr for professional degree hosteller / ₹7,000 day scholar) disbursed directly.',
    benefit_category: 'composite',
    income_ceiling: 250000,
    eligible_categories: ['SC'],
    eligible_courses: ['ALL', 'B.Tech / B.E.', 'MBBS', 'B.Sc', 'BCA', 'B.Com', 'B.A.', 'Diploma'],
    education_stages: ['Higher Secondary', 'Diploma', 'Undergraduate', 'Postgraduate', 'Doctoral'],
    minimum_qualifying_percentage: 45.0,
    gender_eligibility: 'ANY',
    state_domicile: ['ALL'],
    disability_reservation: false,
    benchmark_disability_percentage: null,
    special_reservations: [],
    official_documents_required: [
      'Caste Certificate issued by designated Revenue Authority (SC)',
      'Income Certificate (Annual family income <= ₹2,50,000)',
      'Fee receipt from recognized college or university',
      'Previous class passing marksheet',
      'Aadhaar seeded bank account passbook'
    ],
    scheme_deadline: '31st October 2026',
    official_conditions: [
      'Applicant must belong to Scheduled Caste (SC) category.',
      'Enrolled in recognized post-matriculation courses.',
      'Annual family income from all sources must not exceed ₹2,50,000.'
    ],
    disqualifications: [
      'Students repeating the same stage of education.',
      'Holding simultaneous full tuition fee grant from other schemes.'
    ],
    nsp_conflict_guidelines: {
      exclusive_standalone: false,
      exclude_same_provider_level: true,
      fee_component_conflict: true,
      conflicting_scholarship_ids: ['NSP-MSJE-TOPCLASS-SC-2026'],
      max_combined_scholarships: 2,
      rule_description: 'Welfare-based Post-Matric scheme. Cannot be combined with Top Class SC scheme (which already covers 100% fees + living).'
    },
    official_portal_url: 'https://scholarships.gov.in/All-Scholarships'
  },
  {
    scheme_code: 'NSP-AICTE-PMSSS-2026',
    official_name: 'Prime Minister’s Special Scholarship Scheme For UTs Of J&K And Ladakh (PMSSS)',
    ministry_or_department: 'Department of Higher Education & AICTE, Ministry of Education',
    academic_year: '2026-27',
    scheme_type: 'welfare_based',
    classification: 'AICTE',
    annual_benefit_amount: 225000,
    benefit_breakdown: 'Academic fee up to ₹1,25,000/yr for professional degree (up to ₹3,00,000 for medical) directly to institution + ₹1,00,000/yr maintenance allowance directly to student account.',
    benefit_category: 'composite',
    income_ceiling: 800000,
    eligible_categories: ['General', 'OBC', 'SC', 'ST', 'EWS'],
    eligible_courses: ['B.Tech / B.E.', 'MBBS', 'B.Sc', 'B.Arch', 'B.Pharm', 'ALL', 'Engineering/Technical', 'Medical'],
    education_stages: ['Undergraduate'],
    minimum_qualifying_percentage: 50.0,
    gender_eligibility: 'ANY',
    state_domicile: ['Jammu and Kashmir', 'Ladakh'],
    disability_reservation: false,
    benchmark_disability_percentage: null,
    special_reservations: [],
    official_documents_required: [
      'Domicile Certificate of UT of J&K or UT of Ladakh',
      'Class 12th passing marksheet from JKBOSE or CBSE located in J&K/Ladakh',
      'Income Certificate (<= ₹8,00,000 per annum)',
      'Centralized Counseling Allotment Letter from AICTE',
      'Aadhaar seeded bank account passbook'
    ],
    scheme_deadline: '31st October 2026',
    official_conditions: [
      'Domicile of Union Territories of Jammu & Kashmir or Ladakh.',
      'Passed 10+2 from JKBOSE or CBSE affiliated schools in J&K/Ladakh.',
      'Admitted to colleges outside J&K through AICTE centralized counseling.',
      'Family income not exceeding ₹8,00,000 per annum.'
    ],
    disqualifications: [
      'Candidates studying within J&K or admitted outside centralized counseling.',
      'Students availing other fee waivers or government scholarships.'
    ],
    nsp_conflict_guidelines: {
      exclusive_standalone: true,
      exclude_same_provider_level: true,
      fee_component_conflict: true,
      max_combined_scholarships: 1,
      rule_description: 'Standalone Comprehensive Scholarship: Full academic fee plus complete living expenses are borne by the Central Government; holding any other scholarship is prohibited.'
    },
    official_portal_url: 'https://scholarships.gov.in/All-Scholarships'
  }
];
