import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Body parsing middleware
app.use(express.json());

// ==========================================
// DATA LOADING & REPOSITORY HELPERS
// ==========================================

interface Scholarship {
  id: string;
  name: string;
  offered_by: string;
  department?: string;
  source_type?: 'NSP' | 'MAHADBT' | 'STATE' | 'CORPORATE';
  classification: 'MERIT' | 'WELFARE' | 'SPECIAL_CATEGORY';
  academic_level?: string;
  degree_type?: string[];
  field_of_study?: string[];
  max_benefit_amount: number;
  benefits?: {
    tuition_fee: number | 'FULL' | string;
    maintenance_allowance: number;
    book_allowance: number;
    hostel_fee: number;
    total_estimated: number;
    description: string;
  };
  eligibility: {
    income_limit: number | null;
    gender_restriction?: string;
    minimum_percentage?: number | null;
    category?: string[];
    domicile_state?: string[];
    disability_required?: boolean;
    course_level?: string[];
    eligible_courses?: string[];
    eligible_categories?: string[];
    eligible_domiciles?: string[];
    eligible_genders?: string[];
  };
  conflict_rules: {
    exclusive_standalone: boolean;
    conflicting_scholarship_ids: string[];
    conflict_type?: string;
    rule_description: string;
  };
  application_url?: string;
  portal_url?: string;
  scheme_code?: string;
  deadline?: string;
}

interface StudentProfile {
  name: string;
  annual_family_income?: number | null;
  academic_percentage?: number | null;
  category?: string;
  state_domicile?: string;
  gender?: string;
  course?: string;
  is_differently_abled?: boolean;
  possessed_documents?: string[];
  is_completed?: boolean;
}

function loadAllScholarships(): Scholarship[] {
  const list: Scholarship[] = [];
  const nspPath = path.resolve(__dirname, 'src', 'data', 'scholarships.json');
  const mahaPath = path.resolve(__dirname, 'src', 'data', 'mahadbt', 'mahadbtSchemes.json');

  if (fs.existsSync(nspPath)) {
    try {
      const raw = JSON.parse(fs.readFileSync(nspPath, 'utf-8'));
      const items = Array.isArray(raw) ? raw : raw.scholarships || [];
      list.push(...items);
    } catch (e) {
      console.warn('[Server] Error reading scholarships.json:', e);
    }
  }

  if (fs.existsSync(mahaPath)) {
    try {
      const raw = JSON.parse(fs.readFileSync(mahaPath, 'utf-8'));
      const items = Array.isArray(raw) ? raw : raw.scholarships || [];
      for (const item of items) {
        if (!list.some((existing) => existing.id === item.id)) {
          list.push(item);
        }
      }
    } catch (e) {
      console.warn('[Server] Error reading mahadbtSchemes.json:', e);
    }
  }

  return list;
}

let inMemoryScholarships: Scholarship[] = loadAllScholarships();
let activeStudentProfile: StudentProfile | null = null;

// ==========================================
// ELIGIBILITY EVALUATION ENGINE
// ==========================================

function evaluateEligibility(scholarship: Scholarship, profile: StudentProfile) {
  const checks: any[] = [];
  let isEligible = true;
  let isUndetermined = false;

  const { eligibility } = scholarship;

  // 1. Income Check
  if (eligibility.income_limit !== null && eligibility.income_limit !== undefined) {
    if (profile.annual_family_income === undefined || profile.annual_family_income === null) {
      isUndetermined = true;
      checks.push({
        criterion: 'Annual Family Income',
        status: 'undetermined',
        message: 'Family income certificate or value needed'
      });
    } else if (profile.annual_family_income <= eligibility.income_limit) {
      checks.push({
        criterion: 'Annual Family Income',
        status: 'satisfied',
        message: `Income ₹${profile.annual_family_income.toLocaleString('en-IN')} within limit of ₹${eligibility.income_limit.toLocaleString('en-IN')}`
      });
    } else {
      isEligible = false;
      checks.push({
        criterion: 'Annual Family Income',
        status: 'not_satisfied',
        message: `Income ₹${profile.annual_family_income.toLocaleString('en-IN')} exceeds limit of ₹${eligibility.income_limit.toLocaleString('en-IN')}`
      });
    }
  }

  // 2. Marks Check
  if (eligibility.minimum_percentage !== null && eligibility.minimum_percentage !== undefined) {
    if (profile.academic_percentage === undefined || profile.academic_percentage === null) {
      isUndetermined = true;
      checks.push({
        criterion: 'Academic Performance',
        status: 'undetermined',
        message: 'Academic percentage needed'
      });
    } else if (profile.academic_percentage >= eligibility.minimum_percentage) {
      checks.push({
        criterion: 'Academic Performance',
        status: 'satisfied',
        message: `Scored ${profile.academic_percentage}% (Required: ≥${eligibility.minimum_percentage}%)`
      });
    } else {
      isEligible = false;
      checks.push({
        criterion: 'Academic Performance',
        status: 'not_satisfied',
        message: `Scored ${profile.academic_percentage}% (Required: ≥${eligibility.minimum_percentage}%)`
      });
    }
  }

  // 3. Category Check
  const allowedCategories = eligibility.category || eligibility.eligible_categories;
  if (allowedCategories && allowedCategories.length > 0 && !allowedCategories.includes('ALL')) {
    if (!profile.category) {
      isUndetermined = true;
      checks.push({
        criterion: 'Social Category',
        status: 'undetermined',
        message: 'Social category not specified'
      });
    } else if (allowedCategories.some((c) => c.toLowerCase() === profile.category?.toLowerCase() || c === 'ALL')) {
      checks.push({
        criterion: 'Social Category',
        status: 'satisfied',
        message: `Category ${profile.category} eligible`
      });
    } else {
      isEligible = false;
      checks.push({
        criterion: 'Social Category',
        status: 'not_satisfied',
        message: `Category ${profile.category} not in eligible list (${allowedCategories.join(', ')})`
      });
    }
  }

  // 4. Gender Check
  const allowedGenders = eligibility.gender_restriction
    ? [eligibility.gender_restriction]
    : eligibility.eligible_genders;
  if (allowedGenders && allowedGenders.length > 0 && !allowedGenders.includes('ALL')) {
    if (!profile.gender) {
      isUndetermined = true;
      checks.push({
        criterion: 'Gender',
        status: 'undetermined',
        message: 'Gender not specified'
      });
    } else if (allowedGenders.some((g) => g.toLowerCase() === profile.gender?.toLowerCase() || g === 'ALL')) {
      checks.push({
        criterion: 'Gender',
        status: 'satisfied',
        message: `Gender ${profile.gender} eligible`
      });
    } else {
      isEligible = false;
      checks.push({
        criterion: 'Gender',
        status: 'not_satisfied',
        message: `Scheme restricted to ${allowedGenders.join(', ')}`
      });
    }
  }

  // 5. Domicile Check
  const allowedDomiciles = eligibility.domicile_state || eligibility.eligible_domiciles;
  if (allowedDomiciles && allowedDomiciles.length > 0 && !allowedDomiciles.includes('ALL')) {
    if (!profile.state_domicile) {
      isUndetermined = true;
      checks.push({
        criterion: 'State Domicile',
        status: 'undetermined',
        message: 'Domicile state not specified'
      });
    } else if (allowedDomiciles.some((d) => d.toLowerCase() === profile.state_domicile?.toLowerCase() || d === 'ALL')) {
      checks.push({
        criterion: 'State Domicile',
        status: 'satisfied',
        message: `Domicile ${profile.state_domicile} eligible`
      });
    } else {
      isEligible = false;
      checks.push({
        criterion: 'State Domicile',
        status: 'not_satisfied',
        message: `Domicile ${profile.state_domicile} not eligible (Required: ${allowedDomiciles.join(', ')})`
      });
    }
  }

  let finalStatus: 'eligible' | 'undetermined' | 'ineligible' = 'eligible';
  if (!isEligible) {
    finalStatus = 'ineligible';
  } else if (isUndetermined) {
    finalStatus = 'undetermined';
  }

  const satisfiedCount = checks.filter((c) => c.status === 'satisfied').length;
  const matchScore = checks.length > 0 ? Math.round((satisfiedCount / checks.length) * 100) : 100;

  return {
    scholarship,
    status: finalStatus,
    match_score: matchScore,
    criteria_checks: checks
  };
}

// ==========================================
// COMBINATIONS ENGINE
// ==========================================

function generateCombinations(scholarships: Scholarship[]) {
  const validCombinations: any[] = [];
  const invalidCombinations: any[] = [];

  // Individual single schemes
  scholarships.forEach((s) => {
    validCombinations.push({
      scholarships: [s],
      scholarship_ids: [s.id],
      scholarship_names: [s.name],
      total_potential_benefit: s.max_benefit_amount || 0,
      combination_type: s.classification === 'MERIT' ? 'Single Merit Scheme' : 'Single Welfare Scheme',
      compatibility_score: 100,
      conflict_free: true
    });
  });

  // Pairwise combos
  for (let i = 0; i < scholarships.length; i++) {
    for (let j = i + 1; j < scholarships.length; j++) {
      const s1 = scholarships[i];
      const s2 = scholarships[j];

      // Exclusivity check
      if (s1.conflict_rules?.exclusive_standalone || s2.conflict_rules?.exclusive_standalone) {
        invalidCombinations.push({
          conflicting_pair: [s1.name, s2.name],
          conflict_type: 'exclusive_standalone',
          reason: `"${s1.conflict_rules?.exclusive_standalone ? s1.name : s2.name}" is a standalone award and cannot be combined.`
        });
        continue;
      }

      // Explicit conflict
      if (
        s1.conflict_rules?.conflicting_scholarship_ids?.includes(s2.id) ||
        s2.conflict_rules?.conflicting_scholarship_ids?.includes(s1.id)
      ) {
        invalidCombinations.push({
          conflicting_pair: [s1.name, s2.name],
          conflict_type: 'explicit_conflict',
          reason: `Rules prohibit combining "${s1.name}" with "${s2.name}".`
        });
        continue;
      }

      // Two Central Merit Schemes check
      if (
        s1.classification === 'MERIT' &&
        s2.classification === 'MERIT' &&
        s1.source_type !== 'CORPORATE' &&
        s2.source_type !== 'CORPORATE'
      ) {
        invalidCombinations.push({
          conflicting_pair: [s1.name, s2.name],
          conflict_type: 'multiple_merit_schemes',
          reason: 'Government regulations restrict claiming more than one government merit scholarship simultaneously.'
        });
        continue;
      }

      validCombinations.push({
        scholarships: [s1, s2],
        scholarship_ids: [s1.id, s2.id],
        scholarship_names: [s1.name, s2.name],
        total_potential_benefit: (s1.max_benefit_amount || 0) + (s2.max_benefit_amount || 0),
        combination_type: `${s1.classification} + ${s2.classification} Stack`,
        compatibility_score: 100,
        conflict_free: true
      });
    }
  }

  validCombinations.sort((a, b) => b.total_potential_benefit - a.total_potential_benefit);

  return { validCombinations, invalidCombinations };
}

// ==========================================
// API ROUTES
// ==========================================

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    project: 'ScholarSync',
    version: '1.0.0',
    scholarships_count: inMemoryScholarships.length,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/mahadbt/metadata', (_req: Request, res: Response) => {
  res.json({
    portal: 'MahaDBT (Aaple Sarkar DBT Portal)',
    authority: 'Government of Maharashtra',
    academic_year: '2026-27',
    total_schemes_count: inMemoryScholarships.filter((s) => s.source_type === 'MAHADBT' || s.id.startsWith('MAHADBT')).length
  });
});

app.get('/api/nsp/metadata', (_req: Request, res: Response) => {
  res.json({
    portal: 'National Scholarship Portal (NSP)',
    authority: 'Government of India',
    academic_year: '2026-27',
    total_schemes_count: inMemoryScholarships.filter((s) => s.source_type !== 'MAHADBT' && !s.id.startsWith('MAHADBT')).length
  });
});

app.post('/api/mahadbt/fetch', (_req: Request, res: Response) => {
  try {
    inMemoryScholarships = loadAllScholarships();
    res.json({
      success: true,
      message: 'MahaDBT Scholarships refreshed successfully.',
      records_count: inMemoryScholarships.length
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/nsp/fetch', (_req: Request, res: Response) => {
  try {
    inMemoryScholarships = loadAllScholarships();
    res.json({
      success: true,
      message: 'NSP Scholarships refreshed successfully.',
      records_count: inMemoryScholarships.length
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/scholarships', (req: Request, res: Response) => {
  try {
    let result = [...inMemoryScholarships];
    const { source, classification, query, category, gender } = req.query;

    if (source === 'NSP') {
      result = result.filter((s) => s.source_type !== 'MAHADBT' && !s.id.startsWith('MAHADBT'));
    } else if (source === 'MAHADBT') {
      result = result.filter((s) => s.source_type === 'MAHADBT' || s.id.startsWith('MAHADBT'));
    }

    if (classification && classification !== 'ALL') {
      result = result.filter((s) => s.classification === classification);
    }

    if (query && typeof query === 'string') {
      const q = query.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.offered_by.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q)
      );
    }

    res.json({
      count: result.length,
      scholarships: result
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/scholarships/:id', (req: Request, res: Response) => {
  const item = inMemoryScholarships.find((s) => s.id === req.params.id);
  if (!item) {
    return res.status(404).json({ error: `Scholarship "${req.params.id}" not found.` });
  }
  res.json(item);
});

app.post('/api/match', (req: Request, res: Response) => {
  try {
    const profile = req.body as StudentProfile;
    if (!profile) {
      return res.status(400).json({ error: 'Missing profile' });
    }

    const eligible: any[] = [];
    const undetermined: any[] = [];
    const ineligible: any[] = [];

    for (const scholarship of inMemoryScholarships) {
      const res = evaluateEligibility(scholarship, profile);
      if (res.status === 'eligible') eligible.push(res);
      else if (res.status === 'undetermined') undetermined.push(res);
      else ineligible.push(res);
    }

    res.json({
      summary: {
        total_analyzed: inMemoryScholarships.length,
        eligible_count: eligible.length,
        undetermined_count: undetermined.length,
        ineligible_count: ineligible.length
      },
      eligible,
      undetermined,
      ineligible
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/combinations', (req: Request, res: Response) => {
  try {
    const { eligibleScholarshipIds, profile } = req.body;
    let targetList: Scholarship[] = [];

    if (Array.isArray(eligibleScholarshipIds) && eligibleScholarshipIds.length > 0) {
      targetList = inMemoryScholarships.filter((s) => eligibleScholarshipIds.includes(s.id));
    } else if (profile) {
      targetList = inMemoryScholarships.filter((s) => evaluateEligibility(s, profile).status === 'eligible');
    } else {
      targetList = inMemoryScholarships;
    }

    const { validCombinations, invalidCombinations } = generateCombinations(targetList);

    res.json({
      stats: {
        eligible_scholarships_count: targetList.length,
        valid_combinations_count: validCombinations.length,
        invalid_combinations_count: invalidCombinations.length,
        max_potential_benefit: validCombinations[0]?.total_potential_benefit || 0
      },
      validCombinations,
      invalidCombinations
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/analyze', (req: Request, res: Response) => {
  try {
    const profile = req.body as StudentProfile;
    if (!profile) {
      return res.status(400).json({ error: 'Missing profile' });
    }

    const eligible: any[] = [];
    const undetermined: any[] = [];
    const ineligible: any[] = [];

    for (const scholarship of inMemoryScholarships) {
      const match = evaluateEligibility(scholarship, profile);
      if (match.status === 'eligible') eligible.push(match);
      else if (match.status === 'undetermined') undetermined.push(match);
      else ineligible.push(match);
    }

    const eligibleScholarships = eligible.map((m) => m.scholarship);
    const { validCombinations, invalidCombinations } = generateCombinations(eligibleScholarships);

    res.json({
      student_profile: profile,
      summary: {
        total_analyzed: inMemoryScholarships.length,
        eligible_count: eligible.length,
        undetermined_count: undetermined.length,
        ineligible_count: ineligible.length,
        valid_combinations_count: validCombinations.length,
        invalid_combinations_count: invalidCombinations.length,
        max_potential_benefit: validCombinations[0]?.total_potential_benefit || 0
      },
      eligible_scholarships: eligible,
      undetermined_scholarships: undetermined,
      ineligible_scholarships: ineligible,
      valid_combinations: validCombinations,
      invalid_combinations: invalidCombinations
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/profile', (_req: Request, res: Response) => {
  res.json({
    profile: activeStudentProfile,
    is_completed: Boolean(activeStudentProfile?.is_completed)
  });
});

app.post('/api/profile', (req: Request, res: Response) => {
  try {
    const raw = req.body as StudentProfile;
    if (!raw || !raw.name?.trim()) {
      return res.status(400).json({ error: 'Student full name is required.' });
    }
    activeStudentProfile = { ...raw, is_completed: true };
    res.json({
      success: true,
      profile: activeStudentProfile,
      message: 'Student profile saved successfully.'
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/profile', (_req: Request, res: Response) => {
  activeStudentProfile = null;
  res.json({ success: true, message: 'Profile reset.' });
});

// ==========================================
// STATIC / VITE MIDDLEWARE SETUP
// ==========================================

async function startServer() {
  if (!isProduction) {
    // Development mode: Vite middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: Serve built frontend from dist
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ScholarSync full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
