/**
 * Unified Scholarship Data Service
 * Ingestion Architecture Layer 5:
 * Connects the business logic to both official NSP (National Scholarship Portal)
 * and official MahaDBT (Government of Maharashtra) repositories.
 */

import { Scholarship, ScholarshipClassification } from '../types/scholarship';
import { nspScholarshipRepository } from '../data/nsp/nspScholarshipRepository';
import { MahaDbtScholarshipRepository } from '../data/mahadbt/mahadbtScholarshipRepository';
import { RawNspScheme } from '../data/nsp/nspOfficialSchemes';

export type ScholarshipSourceFilter = 'ALL' | 'NSP' | 'MAHADBT';

class ScholarshipService {
  private mahaDbtRepo = MahaDbtScholarshipRepository.getInstance();

  /**
   * Get all active scholarships across NSP and MahaDBT (or filtered by portal)
   */
  public getAllScholarships(
    source: ScholarshipSourceFilter = 'ALL',
    academicYear: string = '2026-27'
  ): Scholarship[] {
    const nspList = nspScholarshipRepository.getAll(academicYear);
    const mahaList = this.mahaDbtRepo.getAll(academicYear);

    if (source === 'NSP') {
      return nspList;
    } else if (source === 'MAHADBT') {
      return mahaList;
    }

    // Return combined: NSP + MahaDBT deduplicated by ID
    const combined = [...nspList, ...mahaList];
    const uniqueMap = new Map<string, Scholarship>();
    for (const s of combined) {
      if (!uniqueMap.has(s.id)) {
        uniqueMap.set(s.id, s);
      }
    }
    return Array.from(uniqueMap.values());
  }

  /**
   * Find a scholarship by unique ID or Scheme Identifier
   */
  public getScholarshipById(id: string, academicYear: string = '2026-27'): Scholarship | undefined {
    const fromMaha = this.mahaDbtRepo.getById(id, academicYear);
    if (fromMaha) return fromMaha;
    return nspScholarshipRepository.getById(id, academicYear);
  }

  /**
   * Filter scholarships with source portal, classification, department, category, gender, or search query
   */
  public filterScholarships(options: {
    source?: ScholarshipSourceFilter;
    classification?: ScholarshipClassification | 'ALL';
    department?: string;
    mahadbt_scheme_type?: string;
    query?: string;
    gender?: string;
    category?: string;
    academicYear?: string;
  }): Scholarship[] {
    const list = this.getAllScholarships(options.source || 'ALL', options.academicYear || '2026-27');

    return list.filter((s) => {
      // Classification filter
      if (options.classification && options.classification !== 'ALL') {
        if (s.classification !== options.classification) return false;
      }

      // Department filter
      if (options.department && options.department !== 'ALL') {
        if (!s.department || !s.department.toLowerCase().includes(options.department.toLowerCase())) {
          return false;
        }
      }

      // MahaDBT scheme type filter (scholarship, fee_reimbursement, maintenance_allowance, etc.)
      if (options.mahadbt_scheme_type && options.mahadbt_scheme_type !== 'ALL') {
        if (s.mahadbt_scheme_type !== options.mahadbt_scheme_type) {
          return false;
        }
      }

      // Gender filter
      if (options.gender && options.gender !== 'ALL') {
        if (s.eligibility.gender !== 'ANY' && s.eligibility.gender !== options.gender.toUpperCase()) {
          return false;
        }
      }

      // Category filter
      if (options.category && options.category !== 'ALL') {
        if (
          s.eligibility.category &&
          s.eligibility.category.length > 0 &&
          !(s.eligibility.category as string[]).includes(options.category)
        ) {
          return false;
        }
      }

      // Free text search query
      if (options.query && options.query.trim() !== '') {
        const q = options.query.toLowerCase().trim();
        const nameMatch = s.name.toLowerCase().includes(q);
        const providerMatch = s.provider.toLowerCase().includes(q);
        const deptMatch = (s.department || '').toLowerCase().includes(q);
        const descMatch = (s.description || '').toLowerCase().includes(q);
        const idMatch = s.id.toLowerCase().includes(q);
        if (!nameMatch && !providerMatch && !deptMatch && !descMatch && !idMatch) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Reload datasets
   */
  public reloadDataset(records?: Scholarship[]): number {
    if (records) {
      const nspRecords = records.filter((r) => r.source_type !== 'MAHADBT' && !r.id.startsWith('MAHADBT'));
      const mahaRecords = records.filter((r) => r.source_type === 'MAHADBT' || r.id.startsWith('MAHADBT'));
      nspScholarshipRepository.reloadFromJson(nspRecords);
      this.mahaDbtRepo.reloadDataset(mahaRecords);
      return records.length;
    }
    const nspCount = nspScholarshipRepository.reloadFromJson();
    const mahaCount = this.mahaDbtRepo.reloadDataset();
    return nspCount + mahaCount;
  }

  /**
   * Refresh NSP dataset
   */
  public refreshNspDataset(customSchemes?: RawNspScheme[], academicYear: string = '2026-27') {
    return nspScholarshipRepository.refreshFromSource(customSchemes, academicYear);
  }

  /**
   * Refresh MahaDBT dataset
   */
  public refreshMahaDbtDataset(customSchemes?: any[], academicYear: string = '2026-27') {
    return this.mahaDbtRepo.reloadDataset(customSchemes, academicYear);
  }

  /**
   * Get all distinct departments across all schemes
   */
  public getAllDepartments(academicYear: string = '2026-27'): string[] {
    const depts = new Set<string>();
    for (const s of this.getAllScholarships('ALL', academicYear)) {
      if (s.department) depts.add(s.department.trim());
    }
    return Array.from(depts).sort();
  }

  /**
   * Get combined metadata
   */
  public getSourceMetadata(academicYear: string = '2026-27') {
    const nspMeta = nspScholarshipRepository.getMetadata(academicYear);
    const mahaMeta = this.mahaDbtRepo.getMetadata(academicYear);
    return {
      academic_year: academicYear,
      sources: ['National Scholarship Portal (NSP)', 'MahaDBT (Government of Maharashtra)'],
      total_scholarships: nspMeta.total_schemes_count + mahaMeta.total_schemes_count,
      nsp: nspMeta,
      mahadbt: mahaMeta,
      last_refreshed: new Date().toISOString()
    };
  }

  public getNspMetadata(academicYear: string = '2026-27') {
    return nspScholarshipRepository.getMetadata(academicYear);
  }

  public getMahaDbtMetadata(academicYear: string = '2026-27') {
    return this.mahaDbtRepo.getMetadata(academicYear);
  }
}

export const scholarshipService = new ScholarshipService();
