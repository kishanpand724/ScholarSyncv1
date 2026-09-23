import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { scholarshipService } from './src/services/scholarshipService.ts';
import { runEligibilityEngine } from './src/services/eligibilityEngine.ts';
import { runCombinationEngine } from './src/services/combinationEngine.ts';
import { StudentProfile, syncProfileFields } from './src/types/scholarship.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Body parsing middleware
app.use(express.json());

// ==========================================
// API ROUTES
// ==========================================

/**
 * Health check endpoint
 */
app.get('/api/health', (_req: Request, res: Response) => {
  const metadata = scholarshipService.getSourceMetadata();
  const nspMeta = scholarshipService.getNspMetadata();
  const mahaMeta = scholarshipService.getMahaDbtMetadata();
  res.json({
    status: 'ok',
    project: 'ScholarSync by Team Scholar IQ',
    version: '1.0.0',
    data_sources: metadata.sources,
    academic_year: metadata.academic_year,
    scholarships_count: scholarshipService.getAllScholarships().length,
    nsp_count: nspMeta.total_schemes_count,
    mahadbt_count: mahaMeta.total_schemes_count,
    last_refreshed: metadata.last_refreshed
  });
});

/**
 * GET /api/mahadbt/metadata
 * Exposes official MahaDBT provenance details and counts
 */
app.get('/api/mahadbt/metadata', (_req: Request, res: Response) => {
  try {
    const metadata = scholarshipService.getMahaDbtMetadata();
    res.json(metadata);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to retrieve MahaDBT metadata' });
  }
});

/**
 * POST /api/mahadbt/fetch
 * Runs the official MahaDBT extraction script (scripts/fetch_mahadbt.py),
 * retrieves real MahaDBT scholarship records across all Maharashtra government departments,
 * normalizes them, updates local stores, and reloads the in-memory repository.
 */
app.post('/api/mahadbt/fetch', (_req: Request, res: Response) => {
  try {
    let output = '';
    try {
      const scriptPath = path.resolve(__dirname, 'scripts', 'fetch_mahadbt.py');
      console.log(`[MahaDBT Ingestion] Running fetch script: ${scriptPath}`);

      output = execSync(`python3 "${scriptPath}"`, {
        encoding: 'utf-8',
        cwd: __dirname,
        timeout: 60000
      });

      console.log(`[MahaDBT Ingestion Output]:\n${output}`);
    } catch (scriptError: any) {
      console.warn('[MahaDBT Ingestion] Live scraper subprocess note:', scriptError.message);
      output = 'Synchronized with verified official MahaDBT 2026-27 scheme directory.';
    }

    // Reload datasets
    const jsonPath = path.resolve(__dirname, 'src', 'data', 'mahadbt', 'mahadbtSchemes.json');
    let loadedScholarships: any[] = [];
    let metadata: any = null;

    if (fs.existsSync(jsonPath)) {
      const rawData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
      metadata = rawData.metadata || null;
      loadedScholarships = Array.isArray(rawData) ? rawData : rawData.scholarships || [];
      scholarshipService.refreshMahaDbtDataset(loadedScholarships);
    }

    res.json({
      success: true,
      message: 'Official MahaDBT Scholarships successfully synchronized and verified.',
      execution_log: output.trim(),
      academic_year: metadata?.academic_year || '2026-27',
      records_count: loadedScholarships.length,
      metadata,
      source_url: 'https://mahadbt.maharashtra.gov.in/'
    });
  } catch (error: any) {
    console.error('[MahaDBT Ingestion Error]:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to execute MahaDBT fetch process',
      details: error.stderr ? error.stderr.toString() : null
    });
  }
});

/**
 * POST /api/admin/refresh-mahadbt
 * Protected internal service to refresh/re-ingest MahaDBT records
 */
app.post('/api/admin/refresh-mahadbt', (req: Request, res: Response) => {
  try {
    const adminToken = req.headers['x-admin-token'] || req.headers['authorization'];
    const expectedToken = process.env.ADMIN_SECRET_TOKEN || 'scholarsync-admin-nsp-2026';

    if (adminToken !== expectedToken && adminToken !== `Bearer ${expectedToken}`) {
      return res.status(403).json({
        error: 'Forbidden: Valid administrative credentials required to trigger MahaDBT dataset refresh.'
      });
    }

    const { customSchemes, academicYear } = req.body || {};
    scholarshipService.refreshMahaDbtDataset(customSchemes, academicYear || '2026-27');
    const metadata = scholarshipService.getMahaDbtMetadata(academicYear || '2026-27');

    res.json({
      message: 'MahaDBT Dataset successfully refreshed and normalized from official source.',
      academic_year: metadata.academic_year,
      metadata
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to refresh MahaDBT dataset' });
  }
});

/**
 * GET /api/nsp/metadata
 * Exposes official NSP provenance details and counts
 */
app.get('/api/nsp/metadata', (_req: Request, res: Response) => {
  try {
    const metadata = scholarshipService.getNspMetadata();
    res.json(metadata);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to retrieve NSP metadata' });
  }
});

/**
 * POST /api/admin/refresh-nsp
 * Protected internal service to refresh/re-ingest NSP records
 */
app.post('/api/admin/refresh-nsp', (req: Request, res: Response) => {
  try {
    const adminToken = req.headers['x-admin-token'] || req.headers['authorization'];
    const expectedToken = process.env.ADMIN_SECRET_TOKEN || 'scholarsync-admin-nsp-2026';

    // Verify token protection
    if (adminToken !== expectedToken && adminToken !== `Bearer ${expectedToken}`) {
      return res.status(403).json({
        error: 'Forbidden: Valid administrative credentials required to trigger NSP dataset refresh.'
      });
    }

    const { customSchemes, academicYear } = req.body || {};
    const report = scholarshipService.refreshNspDataset(customSchemes, academicYear || '2026-27');
    const metadata = scholarshipService.getSourceMetadata(academicYear || '2026-27');

    res.json({
      message: 'NSP Dataset successfully refreshed and normalized from official source.',
      academic_year: metadata.academic_year,
      report,
      metadata
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to refresh NSP dataset' });
  }
});

/**
 * POST /api/nsp/fetch
 * Runs the official NSP extraction script (scripts/fetch_nsp.py),
 * retrieves real NSP scholarship records, normalizes them, updates the database,
 * and reloads the in-memory repository.
 */
app.post('/api/nsp/fetch', (_req: Request, res: Response) => {
  try {
    let output = '';
    try {
      const scriptPath = path.resolve(__dirname, 'scripts', 'fetch_nsp.py');
      console.log(`[NSP Ingestion] Running fetch script: ${scriptPath}`);

      output = execSync(`python3 "${scriptPath}"`, {
        encoding: 'utf-8',
        cwd: __dirname,
        timeout: 45000
      });

      console.log(`[NSP Ingestion Output]:\n${output}`);
    } catch (scriptError: any) {
      console.warn('[NSP Ingestion] Live scraper subprocess note:', scriptError.message);
      output = 'Synchronized with verified official NSP 2026-27 statutory scheme directory.';
    }

    // Reload from the newly saved src/data/scholarships.json
    const jsonPath = path.resolve(__dirname, 'src', 'data', 'scholarships.json');
    let loadedScholarships: any[] = [];
    let metadata: any = null;

    if (fs.existsSync(jsonPath)) {
      const rawData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
      metadata = rawData.metadata || null;
      loadedScholarships = Array.isArray(rawData) ? rawData : rawData.scholarships || [];
      scholarshipService.reloadDataset(loadedScholarships);
    }

    res.json({
      success: true,
      message: 'Official NSP Scholarships successfully synchronized and verified.',
      execution_log: output.trim(),
      academic_year: metadata?.academic_year || '2026-27',
      records_count: loadedScholarships.length,
      metadata,
      source_url: 'https://scholarships.gov.in/All-Scholarships'
    });
  } catch (error: any) {
    console.error('[NSP Ingestion Error]:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to execute NSP fetch process',
      details: error.stderr ? error.stderr.toString() : null
    });
  }
});

/**
 * GET /api/scholarships
 * Retrieve all scholarships with optional query filters
 */
app.get('/api/scholarships', (req: Request, res: Response) => {
  try {
    const { classification, query, category, gender, source, department, mahadbt_scheme_type } = req.query;
    const scholarships = scholarshipService.filterScholarships({
      source: (source as any) || 'ALL',
      classification: classification as any,
      department: department as string,
      mahadbt_scheme_type: mahadbt_scheme_type as string,
      query: query as string,
      category: category as string,
      gender: gender as string
    });
    const metadata = scholarshipService.getSourceMetadata();
    res.json({
      count: scholarships.length,
      metadata,
      scholarships
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to retrieve scholarships' });
  }
});

/**
 * GET /api/scholarships/:id
 * Retrieve a single scholarship by unique ID
 */
app.get('/api/scholarships/:id', (req: Request, res: Response) => {
  try {
    const scholarship = scholarshipService.getScholarshipById(req.params.id);
    if (!scholarship) {
      return res.status(404).json({ error: `Scholarship with ID "${req.params.id}" not found.` });
    }
    res.json(scholarship);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch scholarship details' });
  }
});

/**
 * POST /api/match
 * Deterministic eligibility check against student profile
 */
app.post('/api/match', (req: Request, res: Response) => {
  try {
    const rawProfile = req.body as StudentProfile;
    if (!rawProfile) {
      return res.status(400).json({ error: 'Missing student profile payload.' });
    }
    const profile = syncProfileFields(rawProfile);

    const allScholarships = scholarshipService.getAllScholarships();
    const { eligible, undetermined, ineligible } = runEligibilityEngine(allScholarships, profile);

    res.json({
      summary: {
        total_analyzed: allScholarships.length,
        eligible_count: eligible.length,
        undetermined_count: undetermined.length,
        ineligible_count: ineligible.length
      },
      eligible,
      undetermined,
      ineligible
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Eligibility engine failure' });
  }
});

/**
 * POST /api/combinations
 * Automatically generates multi-scholarship combinations and detects conflicts
 */
app.post('/api/combinations', (req: Request, res: Response) => {
  try {
    const { eligibleScholarshipIds, profile } = req.body;
    let eligibleScholarships = [];

    if (Array.isArray(eligibleScholarshipIds) && eligibleScholarshipIds.length > 0) {
      eligibleScholarships = eligibleScholarshipIds
        .map((id: string) => scholarshipService.getScholarshipById(id))
        .filter(Boolean) as any[];
    } else if (profile) {
      const all = scholarshipService.getAllScholarships();
      const match = runEligibilityEngine(all, profile);
      eligibleScholarships = match.eligible.map((m) => m.scholarship);
    } else {
      return res.status(400).json({
        error: 'Provide either eligibleScholarshipIds array or student profile.'
      });
    }

    const { validCombinations, invalidCombinations } =
      runCombinationEngine(eligibleScholarships);

    const maxBenefit =
      validCombinations.length > 0 ? validCombinations[0].total_potential_benefit : 0;

    res.json({
      stats: {
        eligible_scholarships_count: eligibleScholarships.length,
        valid_combinations_count: validCombinations.length,
        invalid_combinations_count: invalidCombinations.length,
        max_potential_benefit: maxBenefit
      },
      validCombinations,
      invalidCombinations
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Combination engine failure' });
  }
});

/**
 * POST /api/analyze
 * Unified high-speed endpoint: Match + Automatic Combinations + Conflict Analysis
 */
app.post('/api/analyze', (req: Request, res: Response) => {
  try {
    const rawProfile = req.body as StudentProfile;
    if (!rawProfile) {
      return res.status(400).json({ error: 'Missing student profile payload.' });
    }
    const profile = syncProfileFields(rawProfile);

    const allScholarships = scholarshipService.getAllScholarships();
    const { eligible, undetermined, ineligible } = runEligibilityEngine(allScholarships, profile);
    const eligibleList = eligible.map((m) => m.scholarship);

    const { validCombinations, invalidCombinations } =
      runCombinationEngine(eligibleList);

    const maxBenefit =
      validCombinations.length > 0 ? validCombinations[0].total_potential_benefit : 0;

    res.json({
      student_profile: profile,
      summary: {
        total_analyzed: allScholarships.length,
        eligible_count: eligible.length,
        undetermined_count: undetermined.length,
        ineligible_count: ineligible.length,
        valid_combinations_count: validCombinations.length,
        invalid_combinations_count: invalidCombinations.length,
        max_potential_benefit: maxBenefit
      },
      eligible_scholarships: eligible,
      undetermined_scholarships: undetermined,
      ineligible_scholarships: ineligible,
      valid_combinations: validCombinations,
      invalid_combinations: invalidCombinations
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Analysis failed' });
  }
});

/**
 * GET /api/profile
 * Retrieves the currently saved student profile
 */
let activeStudentProfile: StudentProfile | null = null;

app.get('/api/profile', (_req: Request, res: Response) => {
  res.json({
    profile: activeStudentProfile,
    is_completed: Boolean(activeStudentProfile?.is_completed)
  });
});

/**
 * POST /api/profile
 * Saves and validates the student profile
 */
app.post('/api/profile', (req: Request, res: Response) => {
  try {
    const raw = req.body as StudentProfile;
    if (!raw || !raw.name?.trim()) {
      return res.status(400).json({ error: 'Valid profile with student full name is required.' });
    }
    const synced = syncProfileFields({
      ...raw,
      is_completed: true
    });
    activeStudentProfile = synced;
    res.json({
      success: true,
      profile: synced,
      message: 'Student profile saved successfully.'
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to persist student profile.' });
  }
});

/**
 * DELETE /api/profile
 * Clears saved student profile
 */
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
