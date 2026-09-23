/**
 * MahaDBT Scholarship Repository
 * Ingestion Architecture Layer 3 & 4: Dedicated repository for official Government of Maharashtra MahaDBT schemes.
 * Manages versioned records, department queries, scheme classification, and dynamic refreshes.
 */

import { Scholarship } from '../../types/scholarship';
import mahadbtData from './mahadbtSchemes.json';
import { normalizeMahaDbtDataset, MahaDbtNormalizationReport } from './mahadbtNormalizer';

export class MahaDbtScholarshipRepository {
  private static instance: MahaDbtScholarshipRepository;
  private versionedStore: Map<string, Scholarship[]> = new Map();
  private lastRefreshedAt: string = new Date().toISOString();
  private defaultYear: string = '2026-27';
  private cachedReport: MahaDbtNormalizationReport | null = null;

  private constructor() {
    this.seedDefaultDataset();
  }

  public static getInstance(): MahaDbtScholarshipRepository {
    if (!MahaDbtScholarshipRepository.instance) {
      MahaDbtScholarshipRepository.instance = new MahaDbtScholarshipRepository();
    }
    return MahaDbtScholarshipRepository.instance;
  }

  private seedDefaultDataset(): void {
    const rawList = Array.isArray(mahadbtData)
      ? mahadbtData
      : (mahadbtData as any).scholarships || [];

    const { scholarships, report } = normalizeMahaDbtDataset(rawList);
    this.versionedStore.set(this.defaultYear, scholarships);
    this.cachedReport = report;
    this.lastRefreshedAt = new Date().toISOString();
  }

  public getAll(academicYear: string = this.defaultYear): Scholarship[] {
    return this.versionedStore.get(academicYear) || this.versionedStore.get(this.defaultYear) || [];
  }

  public getById(id: string, academicYear: string = this.defaultYear): Scholarship | undefined {
    return this.getAll(academicYear).find((s) => s.id === id || s.scheme_identifier === id);
  }

  public getByDepartment(department: string, academicYear: string = this.defaultYear): Scholarship[] {
    const deptNorm = department.toLowerCase().trim();
    return this.getAll(academicYear).filter(
      (s) => s.department && s.department.toLowerCase().includes(deptNorm)
    );
  }

  public getByType(schemeType: string, academicYear: string = this.defaultYear): Scholarship[] {
    const typeNorm = schemeType.toLowerCase().trim();
    return this.getAll(academicYear).filter(
      (s) => s.mahadbt_scheme_type && s.mahadbt_scheme_type.toLowerCase() === typeNorm
    );
  }

  public getAllDepartments(academicYear: string = this.defaultYear): string[] {
    const depts = new Set<string>();
    for (const s of this.getAll(academicYear)) {
      if (s.department) depts.add(s.department.trim());
    }
    return Array.from(depts).sort();
  }

  public reloadDataset(records?: Scholarship[], academicYear: string = this.defaultYear): number {
    if (records && records.length > 0) {
      const { scholarships, report } = normalizeMahaDbtDataset(records);
      this.versionedStore.set(academicYear, scholarships);
      this.cachedReport = report;
    } else {
      this.seedDefaultDataset();
    }
    this.lastRefreshedAt = new Date().toISOString();
    return this.getAll(academicYear).length;
  }

  public getMetadata(academicYear: string = this.defaultYear) {
    const list = this.getAll(academicYear);
    return {
      academic_year: academicYear,
      source_name: 'MahaDBT (Aaple Sarkar DBT Portal)',
      provider: 'Government of Maharashtra',
      official_portal_url: 'https://mahadbt.maharashtra.gov.in/',
      official_login_url: 'https://mahadbt.maharashtra.gov.in/Login/Login',
      total_schemes: list.length,
      total_schemes_count: list.length,
      departments_count: this.getAllDepartments(academicYear).length,
      departments: this.getAllDepartments(academicYear),
      last_refreshed: this.lastRefreshedAt,
      report: this.cachedReport,
      data_integrity_status: 'verified_official_source'
    };
  }
}
