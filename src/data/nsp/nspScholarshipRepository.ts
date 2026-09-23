/**
 * NSP Scholarship Repository
 * Ingestion Architecture Layer 3 & 4: Versioned repository managing official NSP datasets.
 * Allows multi-year versioning (AY 2026-27 default) and dynamic data refresh.
 */

import { Scholarship, ScholarshipClassification } from '../../types/scholarship';
import scholarshipsData from '../scholarships.json';
import { OFFICIAL_NSP_SCHEMES_2026_27, RawNspScheme } from './nspOfficialSchemes';
import { normalizeNspDataset, NormalizationReport } from './nspNormalizer';

export class NspScholarshipRepository {
  private static instance: NspScholarshipRepository;
  private versionedStore: Map<string, Scholarship[]> = new Map();
  private lastRefreshedAt: string = new Date().toISOString();
  private defaultYear: string = '2026-27';

  private constructor() {
    this.seedDefaultDataset();
  }

  public static getInstance(): NspScholarshipRepository {
    if (!NspScholarshipRepository.instance) {
      NspScholarshipRepository.instance = new NspScholarshipRepository();
    }
    return NspScholarshipRepository.instance;
  }

  /**
   * Initializes the repository with official NSP 2026-27 verified records from scholarships.json.
   */
  private seedDefaultDataset(): void {
    const allList = Array.isArray(scholarshipsData)
      ? scholarshipsData
      : (scholarshipsData as any).scholarships || [];

    const rawList = (allList as any[]).filter(
      (s) => s.source_type !== 'MAHADBT' && !s.id?.startsWith('MAHADBT')
    );

    if (rawList.length > 0) {
      const enrichedList: Scholarship[] = (rawList as any[]).map((s) => {
        const id = s.id || s.scheme_identifier || s.name || '';
        const isPmsss = id.includes('PMSSS') || (s.name || '').includes('PMSSS') || (s.name || '').includes('Jammu Kashmir');
        const officialAppUrl =
          s.official_application_url ||
          s.application?.official_application_url ||
          s.source?.official_application_url ||
          (isPmsss ? 'https://aicte-jk-scholarship-gov.in/' : 'https://scholarships.gov.in/student/login');
        const officialSrcUrl =
          s.official_source_url ||
          s.official_specification_url ||
          s.source?.official_specification_url ||
          s.source?.official_source_url ||
          s.source?.source_url ||
          s.source_url ||
          'https://scholarships.gov.in/All-Scholarships';

        return {
          ...s,
          official_application_url: officialAppUrl,
          official_source_url: officialSrcUrl,
          scheme_identifier: s.scheme_identifier || id,
          application: {
            ...(s.application || {}),
            official_application_url: officialAppUrl,
            scheme_identifier: s.scheme_identifier || id
          },
          source: {
            ...(s.source || {}),
            official_application_url: officialAppUrl,
            official_source_url: officialSrcUrl,
            scheme_identifier: s.scheme_identifier || id,
            official_portal_url: s.source?.official_portal_url || 'https://scholarships.gov.in/All-Scholarships'
          }
        } as Scholarship;
      });
      this.versionedStore.set(this.defaultYear, enrichedList);
    } else {
      const report = normalizeNspDataset(OFFICIAL_NSP_SCHEMES_2026_27);
      this.versionedStore.set(this.defaultYear, report.normalizedRecords);
    }
    this.lastRefreshedAt = new Date().toISOString();
  }

  /**
   * Reload repository from in-memory records or re-read file
   */
  public reloadFromJson(records?: Scholarship[]): number {
    if (records && Array.isArray(records) && records.length > 0) {
      this.versionedStore.set(this.defaultYear, records);
      this.lastRefreshedAt = new Date().toISOString();
      return records.length;
    }
    this.seedDefaultDataset();
    return this.getAll().length;
  }

  /**
   * Returns all normalized NSP scholarships for the specified academic year.
   */
  public getAll(academicYear: string = this.defaultYear): Scholarship[] {
    return this.versionedStore.get(academicYear) || [];
  }

  /**
   * Returns a single NSP scholarship by scheme code / ID.
   */
  public getById(id: string, academicYear: string = this.defaultYear): Scholarship | undefined {
    const list = this.getAll(academicYear);
    return list.find((s) => s.id.toLowerCase() === id.toLowerCase());
  }

  /**
   * Filters NSP scholarships based on search query, classification, category, etc.
   */
  public filter(
    criteria: {
      query?: string;
      classification?: ScholarshipClassification | 'ALL';
      category?: string;
      gender?: string;
    },
    academicYear: string = this.defaultYear
  ): Scholarship[] {
    let result = this.getAll(academicYear);

    if (criteria.classification && criteria.classification !== 'ALL') {
      result = result.filter((s) => s.classification === criteria.classification);
    }

    if (criteria.category) {
      const cat = criteria.category.toUpperCase();
      result = result.filter(
        (s) =>
          !s.eligibility.category ||
          s.eligibility.category.some((c) => c.toUpperCase() === cat)
      );
    }

    if (criteria.gender) {
      const gen = criteria.gender.toUpperCase();
      result = result.filter(
        (s) =>
          !s.eligibility.gender ||
          s.eligibility.gender === 'ANY' ||
          s.eligibility.gender.toUpperCase() === gen
      );
    }

    if (criteria.query && criteria.query.trim()) {
      const q = criteria.query.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.provider.toLowerCase().includes(q) ||
          s.benefit_details.toLowerCase().includes(q)
      );
    }

    return result;
  }

  /**
   * Ingests and refreshes NSP data from raw source (or dynamic PDF/extractor payloads).
   */
  public refreshFromSource(
    rawSchemes: RawNspScheme[] = OFFICIAL_NSP_SCHEMES_2026_27,
    academicYear: string = this.defaultYear
  ): NormalizationReport {
    const report = normalizeNspDataset(rawSchemes);
    this.versionedStore.set(academicYear, report.normalizedRecords);
    this.lastRefreshedAt = new Date().toISOString();
    return report;
  }

  /**
   * Provides metadata regarding data provenance and status.
   */
  public getMetadata(academicYear: string = this.defaultYear) {
    const schemes = this.getAll(academicYear);
    return {
      source: 'National Scholarship Portal',
      official_portal_url: 'https://scholarships.gov.in/All-Scholarships',
      academic_year: academicYear,
      total_schemes_count: schemes.length,
      merit_based_count: schemes.filter((s) => s.scheme_type === 'merit_based').length,
      welfare_based_count: schemes.filter((s) => s.scheme_type === 'welfare_based').length,
      last_refreshed: this.lastRefreshedAt,
      is_official_nsp_data: true
    };
  }
}

export const nspScholarshipRepository = NspScholarshipRepository.getInstance();
