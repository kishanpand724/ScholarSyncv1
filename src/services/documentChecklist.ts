/**
 * Document Checklist & Cross-Reference Service
 * Enables students to toggle possessed documents and cross-reference them
 * against official required documents for eligible scholarships.
 */

export interface DocumentItem {
  id: string;
  name: string;
  shortLabel: string;
  category: 'identity' | 'academic' | 'income_caste' | 'institution' | 'special';
  description: string;
  keywords: string[];
}

export const STANDARD_DOCUMENTS_CATALOG: DocumentItem[] = [
  {
    id: 'aadhaar_card',
    name: 'Aadhaar Card / UIDAI Enrolment ID',
    shortLabel: 'Aadhaar Card',
    category: 'identity',
    description: 'Mandatory Aadhaar identity with registered mobile number for DBT authentication.',
    keywords: ['aadhaar', 'uidai', 'identity card']
  },
  {
    id: 'bank_account_dbt',
    name: 'Aadhaar-Seeded Bank Passbook / Mandate',
    shortLabel: 'Aadhaar Bank Account',
    category: 'identity',
    description: 'Savings bank account seeded with Aadhaar and NPCI mapper for Direct Benefit Transfer.',
    keywords: ['bank', 'passbook', 'dbt', 'npci', 'account details', 'cancelled cheque']
  },
  {
    id: 'income_certificate',
    name: 'Competent Authority Income Certificate',
    shortLabel: 'Income Certificate',
    category: 'income_caste',
    description: 'Valid revenue authority certificate (Tehsildar/SDM/Revenue Officer) for financial year.',
    keywords: ['income certificate', 'family income', 'salary certificate', 'revenue authority', 'income proof']
  },
  {
    id: 'domicile_certificate',
    name: 'State Domicile / Permanent Residence Certificate',
    shortLabel: 'Domicile Certificate',
    category: 'income_caste',
    description: 'Official proof of permanent residence/domicile in the respective state or UT.',
    keywords: ['domicile', 'residence certificate', 'nativity certificate', 'residential proof', 'bonafide resident']
  },
  {
    id: 'caste_certificate',
    name: 'Caste / Community / Tribe Certificate (SC/ST/OBC/EWS)',
    shortLabel: 'Caste/Category Certificate',
    category: 'income_caste',
    description: 'Valid category/caste certificate from authorized government official, if applicable.',
    keywords: ['caste', 'category', 'sc certificate', 'st certificate', 'obc certificate', 'ews certificate', 'tribe']
  },
  {
    id: 'bonafide_certificate',
    name: 'Bonafide Student Certificate from Head of Institution',
    shortLabel: 'Bonafide Certificate',
    category: 'institution',
    description: 'Official certificate issued by Principal/Registrar/Director confirming regular enrollment.',
    keywords: ['bonafide', 'head of institution', 'bonafide certificate', 'institution certificate', 'college seal']
  },
  {
    id: 'admission_fee_receipt',
    name: 'Current Academic Year Admission Fee Receipt',
    shortLabel: 'College Fee Receipt',
    category: 'institution',
    description: 'Official receipt showing course admission and tuition fee payment for current AY.',
    keywords: ['fee receipt', 'admission receipt', 'tuition receipt', 'admission proof', 'challan']
  },
  {
    id: 'tenth_marksheet',
    name: 'Class 10th (SSC) Marksheet / Passing Certificate',
    shortLabel: '10th Marksheet',
    category: 'academic',
    description: 'Secondary school marksheet establishing date of birth and secondary academic merit.',
    keywords: ['10th', 'ssc', 'matric', 'matriculation', 'class 10', 'secondary exam']
  },
  {
    id: 'twelfth_marksheet',
    name: 'Class 12th (HSC) Marksheet / Passing Certificate',
    shortLabel: '12th Marksheet',
    category: 'academic',
    description: 'Higher secondary marksheet with total percentage and board percentile.',
    keywords: ['12th', 'hsc', 'intermediate', 'class 12', 'higher secondary', '10+2']
  },
  {
    id: 'previous_semester_marksheet',
    name: 'Previous Academic Year / Semester Marksheet',
    shortLabel: 'Previous Year/Sem Marksheet',
    category: 'academic',
    description: 'Marksheet or grade card from prior semester/year for renewal and merit eligibility.',
    keywords: ['previous year', 'previous semester', 'marksheet', 'qualifying exam', 'grade card', 'transcript']
  },
  {
    id: 'entrance_exam_scorecard',
    name: 'Competitive / Entrance Exam Scorecard (JEE/CET/GATE)',
    shortLabel: 'Entrance Exam Scorecard',
    category: 'academic',
    description: 'Scorecard/Rank card of entrance test used for college admission quota.',
    keywords: ['entrance', 'competitive exam', 'scorecard', 'rank card', 'allotment letter', 'merit rank']
  },
  {
    id: 'disability_certificate',
    name: 'Disability Certificate (UDID Card / Medical Board)',
    shortLabel: 'UDID / Disability Certificate',
    category: 'special',
    description: 'Unique Disability ID (UDID) or hospital board certificate showing >= 40% disability.',
    keywords: ['disability', 'pwd', 'udid', 'handicapped', 'medical board']
  },
  {
    id: 'passport_photo',
    name: 'Recent Passport Size Photograph',
    shortLabel: 'Passport Photo',
    category: 'identity',
    description: 'Clear color photograph adhering to NSP specifications (JPG under 50KB).',
    keywords: ['photograph', 'photo', 'passport']
  },
  {
    id: 'parent_self_declaration',
    name: 'Parent / Student Self-Declaration Form',
    shortLabel: 'Self-Declaration Form',
    category: 'special',
    description: 'Non-employment, non-receipt of duplicate scholarship or minority self-declaration.',
    keywords: ['declaration', 'undertaking', 'affidavit', 'self declaration', 'minority community certificate']
  },
  {
    id: 'special_quota_certificate',
    name: 'Special Quota Proof (Martyr / Orphan / Armed Forces / Ward)',
    shortLabel: 'Special Quota Proof',
    category: 'special',
    description: 'WARB martyr certificate, death certificate of parents, or departmental service proof.',
    keywords: ['martyr', 'orphan', 'police personnel', 'armed forces', 'warb', 'ward of']
  }
];

export interface DocumentCrossReferenceResult {
  totalRequired: number;
  possessedCount: number;
  missingCount: number;
  isFullyReady: boolean;
  readinessPercentage: number;
  checks: Array<{
    requiredName: string;
    isPossessed: boolean;
    matchedPossessedId?: string;
    matchedPossessedName?: string;
  }>;
}

/**
 * Cross-references a list of required document strings from a scholarship
 * against the list of document IDs or names possessed by the student.
 */
export function crossReferenceDocuments(
  requiredDocumentStrings: string[] = [],
  possessedIdsOrNames: string[] = []
): DocumentCrossReferenceResult {
  if (!requiredDocumentStrings || requiredDocumentStrings.length === 0) {
    return {
      totalRequired: 0,
      possessedCount: 0,
      missingCount: 0,
      isFullyReady: true,
      readinessPercentage: 100,
      checks: []
    };
  }

  const possessedCatalogItems = STANDARD_DOCUMENTS_CATALOG.filter((item) =>
    possessedIdsOrNames.includes(item.id) ||
    possessedIdsOrNames.some((p) => p.toLowerCase() === item.name.toLowerCase() || p.toLowerCase() === item.shortLabel.toLowerCase())
  );

  const possessedCustomStrings = possessedIdsOrNames.filter((p) =>
    !STANDARD_DOCUMENTS_CATALOG.some((item) => item.id === p)
  );

  const checks = requiredDocumentStrings.map((req) => {
    const reqLower = req.toLowerCase();

    // Check if matched by catalog item keywords
    const matchedItem = possessedCatalogItems.find((item) => {
      // 1. Direct match with shortLabel or name
      if (reqLower.includes(item.shortLabel.toLowerCase()) || reqLower.includes(item.id)) {
        return true;
      }
      // 2. Keyword match
      return item.keywords.some((kw) => reqLower.includes(kw.toLowerCase()));
    });

    if (matchedItem) {
      return {
        requiredName: req,
        isPossessed: true,
        matchedPossessedId: matchedItem.id,
        matchedPossessedName: matchedItem.shortLabel
      };
    }

    // Check if matched by custom string
    const matchedCustom = possessedCustomStrings.find((c) =>
      reqLower.includes(c.toLowerCase()) || c.toLowerCase().includes(reqLower)
    );

    if (matchedCustom) {
      return {
        requiredName: req,
        isPossessed: true,
        matchedPossessedName: matchedCustom
      };
    }

    return {
      requiredName: req,
      isPossessed: false
    };
  });

  const possessedCount = checks.filter((c) => c.isPossessed).length;
  const missingCount = checks.length - possessedCount;
  const isFullyReady = missingCount === 0;
  const readinessPercentage = Math.round((possessedCount / checks.length) * 100);

  return {
    totalRequired: checks.length,
    possessedCount,
    missingCount,
    isFullyReady,
    readinessPercentage,
    checks
  };
}
