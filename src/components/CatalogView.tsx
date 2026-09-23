import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  ExternalLink,
  ArrowRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  HeartHandshake,
  RefreshCw,
  Landmark,
  Building2,
  FileText
} from 'lucide-react';
import {
  Scholarship,
  ScholarshipClassification,
  MatchResult,
  StudentProfile,
  AnalysisResponse
} from '../types/scholarship';
import { formatINR, runEligibilityEngine } from '../services/eligibilityEngine';
import { getVerifiedOfficialApplicationUrl, getVerifiedOfficialSourceUrl } from '../utils/scholarshipUrl';

interface CatalogViewProps {
  scholarships: Scholarship[];
  analysis?: AnalysisResponse | null;
  profile?: StudentProfile | null;
  eligibleScholarshipIds?: Set<string>;
  onOpenDetails: (scholarship: Scholarship, matchResult?: MatchResult) => void;
  onSyncNsp?: () => Promise<void>;
  isSyncingNsp?: boolean;
  onSyncMahaDbt?: () => Promise<void>;
  isSyncingMahaDbt?: boolean;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  scholarships,
  analysis,
  profile,
  eligibleScholarshipIds = new Set(),
  onOpenDetails,
  onSyncNsp,
  isSyncingNsp = false,
  onSyncMahaDbt,
  isSyncingMahaDbt = false
}) => {
  const isProfileCompleted = Boolean(profile?.is_completed);

  // 1. Unified eligibility evaluation from single source of truth
  const evaluation = useMemo(() => {
    if (analysis) {
      const matchMap = new Map<string, MatchResult>();
      analysis.eligible_scholarships.forEach((m) => matchMap.set(m.scholarship.id, m));
      analysis.undetermined_scholarships.forEach((m) => matchMap.set(m.scholarship.id, m));
      analysis.ineligible_scholarships.forEach((m) => matchMap.set(m.scholarship.id, m));
      return {
        eligible: analysis.eligible_scholarships,
        undetermined: analysis.undetermined_scholarships,
        ineligible: analysis.ineligible_scholarships,
        matchMap,
        summary: analysis.summary
      };
    }
    if (profile?.is_completed) {
      const result = runEligibilityEngine(scholarships, profile);
      const matchMap = new Map<string, MatchResult>();
      result.eligible.forEach((m) => matchMap.set(m.scholarship.id, m));
      result.undetermined.forEach((m) => matchMap.set(m.scholarship.id, m));
      result.ineligible.forEach((m) => matchMap.set(m.scholarship.id, m));
      return {
        eligible: result.eligible,
        undetermined: result.undetermined,
        ineligible: result.ineligible,
        matchMap,
        summary: {
          total_analyzed: scholarships.length,
          eligible_count: result.eligible.length,
          undetermined_count: result.undetermined.length,
          ineligible_count: result.ineligible.length,
          valid_combinations_count: 0,
          invalid_combinations_count: 0,
          max_potential_benefit: 0
        }
      };
    }
    return {
      eligible: [] as MatchResult[],
      undetermined: [] as MatchResult[],
      ineligible: [] as MatchResult[],
      matchMap: new Map<string, MatchResult>(),
      summary: {
        total_analyzed: scholarships.length,
        eligible_count: 0,
        undetermined_count: 0,
        ineligible_count: 0,
        valid_combinations_count: 0,
        invalid_combinations_count: 0,
        max_potential_benefit: 0
      }
    };
  }, [analysis, scholarships, profile]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSource, setSelectedSource] = useState<'ALL' | 'NSP' | 'MAHADBT'>('ALL');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('ALL');
  const [selectedSchemeType, setSelectedSchemeType] = useState<string>('ALL');
  const [selectedClassification, setSelectedClassification] = useState<string>('ALL');
  const [eligibilityFilter, setEligibilityFilter] = useState<'eligible' | 'all' | 'undetermined' | 'ineligible'>(
    isProfileCompleted ? 'eligible' : 'all'
  );

  useEffect(() => {
    if (isProfileCompleted) {
      setEligibilityFilter('eligible');
    } else {
      setEligibilityFilter('all');
    }
  }, [isProfileCompleted]);

  // Counts by source
  const { nspCount, mahadbtCount } = useMemo(() => {
    let nsp = 0;
    let maha = 0;
    for (const s of scholarships) {
      if (s.source_type === 'MAHADBT' || s.id.startsWith('MAHADBT')) {
        maha++;
      } else {
        nsp++;
      }
    }
    return { nspCount: nsp, mahadbtCount: maha };
  }, [scholarships]);

  // All distinct departments for dropdown
  const departments = useMemo(() => {
    const set = new Set<string>();
    for (const s of scholarships) {
      if (s.department) set.add(s.department.trim());
    }
    return Array.from(set).sort();
  }, [scholarships]);

  // 2. Base list for eligibility filter
  const { baseScholarships, baseTotal } = useMemo(() => {
    if (!isProfileCompleted || eligibilityFilter === 'all') {
      return { baseScholarships: scholarships, baseTotal: scholarships.length };
    }
    if (eligibilityFilter === 'eligible') {
      return {
        baseScholarships: evaluation.eligible.map((m) => m.scholarship),
        baseTotal: evaluation.eligible.length
      };
    }
    if (eligibilityFilter === 'undetermined') {
      return {
        baseScholarships: evaluation.undetermined.map((m) => m.scholarship),
        baseTotal: evaluation.undetermined.length
      };
    }
    if (eligibilityFilter === 'ineligible') {
      return {
        baseScholarships: evaluation.ineligible.map((m) => m.scholarship),
        baseTotal: evaluation.ineligible.length
      };
    }
    return { baseScholarships: scholarships, baseTotal: scholarships.length };
  }, [isProfileCompleted, eligibilityFilter, scholarships, evaluation]);

  // 3. Apply search, source, department, classification, scheme type
  const filtered = useMemo(() => {
    return baseScholarships.filter((s) => {
      // Source filter
      const isMaha = s.source_type === 'MAHADBT' || s.id.startsWith('MAHADBT');
      if (selectedSource === 'NSP' && isMaha) return false;
      if (selectedSource === 'MAHADBT' && !isMaha) return false;

      // Department filter
      if (selectedDepartment !== 'ALL') {
        if (!s.department || !s.department.toLowerCase().includes(selectedDepartment.toLowerCase())) {
          return false;
        }
      }

      // Classification filter
      if (selectedClassification !== 'ALL' && s.classification !== selectedClassification) {
        return false;
      }

      // Scheme Type / Classification
      if (selectedSchemeType !== 'ALL') {
        if (selectedSchemeType === 'merit_based' && s.scheme_type !== 'merit_based') return false;
        if (selectedSchemeType === 'welfare_based' && s.scheme_type !== 'welfare_based') return false;
        if (selectedSchemeType === 'fee_reimbursement' && s.mahadbt_scheme_type !== 'fee_reimbursement' && s.mahadbt_scheme_type !== 'freeship') return false;
        if (selectedSchemeType === 'maintenance_allowance' && s.mahadbt_scheme_type !== 'maintenance_allowance') return false;
      }

      // Search Query
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return (
          s.name.toLowerCase().includes(q) ||
          s.provider.toLowerCase().includes(q) ||
          (s.department || '').toLowerCase().includes(q) ||
          s.benefit_details.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [baseScholarships, selectedSource, selectedDepartment, selectedClassification, selectedSchemeType, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
              <h2 className="text-lg font-bold text-[#111827]">
                Official Scholarship Directory & Discovery
              </h2>
            </div>
            <p className="text-xs text-[#6B7280]">
              Explore verified scholarships across Central (NSP) and Maharashtra State (MahaDBT) official portals.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            {onSyncMahaDbt && (
              <button
                type="button"
                onClick={onSyncMahaDbt}
                disabled={isSyncingMahaDbt}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-200 hover:border-emerald-500 text-xs font-semibold text-emerald-800 bg-emerald-50/60 hover:bg-emerald-100/70 transition-all cursor-pointer disabled:opacity-50"
                title="Synchronize MahaDBT schemes from mahadbt.maharashtra.gov.in"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-emerald-700 ${isSyncingMahaDbt ? 'animate-spin' : ''}`} />
                <span>{isSyncingMahaDbt ? 'Syncing MahaDBT...' : 'Sync MahaDBT'}</span>
              </button>
            )}

            {onSyncNsp && (
              <button
                type="button"
                onClick={onSyncNsp}
                disabled={isSyncingNsp}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E5E7EB] hover:border-[#16A34A] text-xs font-semibold text-[#374151] hover:text-[#16A34A] bg-white transition-all cursor-pointer disabled:opacity-50"
                title="Refresh scholarship records from official NSP directory"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#16A34A] ${isSyncingNsp ? 'animate-spin' : ''}`} />
                <span>{isSyncingNsp ? 'Syncing NSP...' : 'Sync NSP'}</span>
              </button>
            )}
          </div>
        </div>

        {/* 1. Official Source Filter Tabs */}
        <div className="flex items-center gap-2 pb-1 border-b border-[#F3F4F6] overflow-x-auto">
          <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mr-1 shrink-0">
            Source Portal:
          </span>
          <button
            type="button"
            onClick={() => setSelectedSource('ALL')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              selectedSource === 'ALL'
                ? 'bg-[#111827] text-white shadow-xs'
                : 'bg-[#F9FAFB] text-[#4B5563] hover:bg-[#F3F4F6]'
            }`}
          >
            <span>All Sources</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${selectedSource === 'ALL' ? 'bg-white/20 text-white' : 'bg-[#E5E7EB] text-[#374151]'}`}>
              {scholarships.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedSource('NSP')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              selectedSource === 'NSP'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200/60'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>National Scholarship Portal (NSP)</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${selectedSource === 'NSP' ? 'bg-white/20 text-white' : 'bg-blue-200 text-blue-900'}`}>
              {nspCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedSource('MAHADBT')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              selectedSource === 'MAHADBT'
                ? 'bg-[#16A34A] text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/60'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>MahaDBT (Maharashtra)</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${selectedSource === 'MAHADBT' ? 'bg-white/20 text-white' : 'bg-emerald-200 text-emerald-900'}`}>
              {mahadbtCount}
            </span>
          </button>
        </div>

        {/* 2. Eligibility State Tabs (if student profile exists) */}
        {isProfileCompleted && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mr-1">
              Status for You:
            </span>
            <button
              type="button"
              onClick={() => setEligibilityFilter('eligible')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                eligibilityFilter === 'eligible'
                  ? 'bg-[#16A34A] text-white shadow-2xs'
                  : 'bg-[#F0FDF4] text-[#16A34A] hover:bg-[#DCFCE7] border border-[#DCFCE7]'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Eligible</span>
              <span className="bg-white/20 px-1.5 py-0.2 rounded-full font-mono text-[10px]">
                {evaluation.summary.eligible_count}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setEligibilityFilter('undetermined')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                eligibilityFilter === 'undetermined'
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Needs Info</span>
              <span className="bg-white/20 px-1.5 py-0.2 rounded-full font-mono text-[10px]">
                {evaluation.summary.undetermined_count}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setEligibilityFilter('ineligible')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                eligibilityFilter === 'ineligible'
                  ? 'bg-[#4B5563] text-white shadow-2xs'
                  : 'bg-[#F3F4F6] text-[#4B5563] hover:bg-[#E5E7EB] border border-[#E5E7EB]'
              }`}
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Ineligible</span>
              <span className="bg-white/20 px-1.5 py-0.2 rounded-full font-mono text-[10px]">
                {evaluation.summary.ineligible_count}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setEligibilityFilter('all')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                eligibilityFilter === 'all'
                  ? 'bg-[#111827] text-white shadow-2xs'
                  : 'bg-[#F9FAFB] text-[#6B7280] hover:bg-[#F3F4F6] border border-[#E5E7EB]'
              }`}
            >
              <span>All Statuses</span>
              <span className="bg-black/10 px-1.5 py-0.2 rounded-full font-mono text-[10px]">
                {scholarships.length}
              </span>
            </button>
          </div>
        )}

        {/* 3. Search and Secondary Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="relative sm:col-span-5">
            <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by scholarship name, department, or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9.5 pr-4 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-xs text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#16A34A] focus:bg-white transition-colors"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              aria-label="Filter by department"
              className="w-full px-3 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-xs text-[#374151] focus:outline-none focus:border-[#16A34A] focus:bg-white transition-colors cursor-pointer"
            >
              <option value="ALL">All Government Departments ({departments.length})</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedSchemeType}
              onChange={(e) => setSelectedSchemeType(e.target.value)}
              aria-label="Filter by scheme type"
              className="w-full px-3 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-xs text-[#374151] focus:outline-none focus:border-[#16A34A] focus:bg-white transition-colors cursor-pointer"
            >
              <option value="ALL">All Benefit Types</option>
              <option value="fee_reimbursement">Fee Reimbursement / Freeship</option>
              <option value="maintenance_allowance">Hostel & Living Allowance</option>
              <option value="merit_based">Merit-based Awards</option>
              <option value="welfare_based">Welfare & Social Assistance</option>
            </select>
          </div>
        </div>

        {/* Results Count Banner */}
        <div className="flex items-center justify-between text-xs text-[#6B7280] pt-1">
          <div>
            Showing <strong className="text-[#111827]">{filtered.length}</strong> of{' '}
            <strong>{baseTotal}</strong> schemes
            {selectedSource !== 'ALL' && (
              <span className="ml-1 font-semibold text-[#16A34A]">
                ({selectedSource === 'MAHADBT' ? 'MahaDBT Maharashtra' : 'NSP National'})
              </span>
            )}
            {selectedDepartment !== 'ALL' && (
              <span className="ml-1 text-[#4B5563]">
                in {selectedDepartment}
              </span>
            )}
          </div>
          {(searchTerm || selectedSource !== 'ALL' || selectedDepartment !== 'ALL' || selectedSchemeType !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedSource('ALL');
                setSelectedDepartment('ALL');
                setSelectedSchemeType('ALL');
                setSelectedClassification('ALL');
              }}
              className="text-[#16A34A] hover:underline font-semibold cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Scholarship Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((s) => {
          const isEligible = eligibleScholarshipIds.has(s.id);
          const matchResult = evaluation.matchMap.get(s.id);
          const isMaha = s.source_type === 'MAHADBT' || s.id.startsWith('MAHADBT');

          return (
            <div
              key={s.id}
              className={`bg-white border rounded-2xl p-5 shadow-xs transition-all flex flex-col justify-between group ${
                isEligible
                  ? 'border-[#DCFCE7] hover:border-[#16A34A] hover:shadow-sm'
                  : 'border-[#E5E7EB] hover:border-[#D1D5DB]'
              }`}
            >
              <div>
                {/* Source & Department Provenance */}
                <div className="flex items-center justify-between text-[11px] pb-2.5 mb-2.5 border-b border-[#F3F4F6] gap-1.5 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    {isMaha ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                        <Building2 className="w-2.5 h-2.5 text-emerald-600" />
                        <span>MahaDBT</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 text-[10px] font-bold border border-blue-200">
                        <Landmark className="w-2.5 h-2.5 text-blue-600" />
                        <span>NSP</span>
                      </span>
                    )}
                    <span className="text-[#6B7280] font-mono text-[10px]">
                      AY {s.academic_year || '2026-27'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {s.mahadbt_scheme_type && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200/50">
                        {s.mahadbt_scheme_type.replace('_', ' ')}
                      </span>
                    )}
                    {s.scheme_type === 'merit_based' ? (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded bg-[#EFF6FF] text-[#1D4ED8]">
                        <Award className="w-2.5 h-2.5" />
                        <span>Merit</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded bg-[#F5F3FF] text-[#6D28D9]">
                        <HeartHandshake className="w-2.5 h-2.5" />
                        <span>Welfare</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Department or Provider */}
                <div className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider mb-1 line-clamp-1">
                  {s.department || s.provider}
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-[#111827] line-clamp-2 leading-snug">
                  {s.name}
                </h3>

                {/* Financial Benefit */}
                <div className="mt-3 mb-3 pb-3 border-b border-[#F3F4F6]">
                  <div className="text-xl font-bold text-[#111827]">
                    {formatINR(s.benefit_amount)}
                    <span className="text-xs font-normal text-[#6B7280] ml-1">
                      / year
                    </span>
                  </div>
                  <span className="text-[11px] text-[#6B7280] block mt-0.5 truncate">
                    {s.classification} • {s.department || s.provider}
                  </span>
                </div>

                {/* Quick Eligibility Requirements */}
                <div className="space-y-1 text-xs text-[#4B5563]">
                  <div className="flex items-center justify-between">
                    <span className="text-[#6B7280]">Domicile:</span>
                    <span className="font-semibold text-[#111827]">
                      {s.eligibility.state_domicile?.includes('ALL') ? 'All India' : (s.eligibility.state_domicile?.join(', ') || 'Not specified')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6B7280]">Income Cap:</span>
                    <span className="font-semibold text-[#111827]">
                      {s.eligibility.income_limit ? formatINR(s.eligibility.income_limit) : 'No Cap / Freeship'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6B7280]">Category:</span>
                    <span className="font-semibold text-[#111827] truncate max-w-[130px]">
                      {s.eligibility.category ? s.eligibility.category.join(', ') : 'Open to All'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-[#F3F4F6] flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <a
                    href={getVerifiedOfficialSourceUrl(s)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-medium text-[#6B7280] hover:text-[#16A34A] flex items-center gap-1 transition-colors"
                    title="Open official scheme page"
                  >
                    <span>Official Scheme</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  {s.official_specification_url && (
                    <a
                      href={s.official_specification_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-semibold text-rose-700 hover:text-rose-900 bg-rose-50 px-1.5 py-0.5 rounded flex items-center gap-1 transition-colors border border-rose-200"
                      title="Open official Government Resolution (GR) PDF"
                    >
                      <FileText className="w-3 h-3" />
                      <span>GR</span>
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenDetails(s, matchResult)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#4B5563] hover:text-[#111827] px-2.5 py-1.5 rounded-xl border border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors cursor-pointer"
                  >
                    <span>Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {(() => {
                    const officialAppUrl = getVerifiedOfficialApplicationUrl(s);
                    return officialAppUrl ? (
                      <a
                        href={officialAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-2xs ${
                          isMaha
                            ? 'text-white bg-emerald-700 hover:bg-emerald-800'
                            : 'text-white bg-[#16A34A] hover:bg-[#15803D]'
                        }`}
                        title={`Open official ${isMaha ? 'MahaDBT' : 'NSP'} application portal in new tab`}
                      >
                        <span>Apply Now</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : null;
                  })()}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-12 text-center">
          <p className="text-sm font-semibold text-[#374151] mb-1">
            No scholarships found matching your filters.
          </p>
          <p className="text-xs text-[#6B7280]">
            Try clearing the search query or switching the source portal.
          </p>
        </div>
      )}
    </div>
  );
};
