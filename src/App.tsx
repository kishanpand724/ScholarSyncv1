/**
 * ScholarSync by Team Scholar IQ
 * Intelligent Scholarship Discovery & Combination Engine
 * Redesigned with White + Emerald Green + Black Theme
 */

import React, { useEffect, useState } from 'react';
import { Sidebar, NavigationTab } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardSummary } from './components/DashboardSummary';
import { ProfileCard } from './components/ProfileCard';
import { ProfileForm } from './components/ProfileForm';
import { ScholarshipCard } from './components/ScholarshipCard';
import { CombinationCard } from './components/CombinationCard';
import { CatalogView } from './components/CatalogView';
import { ConflictMatrixView } from './components/ConflictMatrixView';
import { CompatibilityNetwork } from './components/CompatibilityNetwork';
import { WhatIfSimulator } from './components/WhatIfSimulator';
import { ScholarshipDetailModal } from './components/ScholarshipDetailModal';
import { CombinationDetailModal } from './components/CombinationDetailModal';
import { SettingsModal } from './components/SettingsModal';
import { DEFAULT_PROFILE } from './data/presets';
import {
  AnalysisResponse,
  MatchResult,
  Scholarship,
  StudentProfile,
  ValidCombination,
  syncProfileFields
} from './types/scholarship';
import { scholarshipService } from './services/scholarshipService';
import { runEligibilityEngine } from './services/eligibilityEngine';
import { runCombinationEngine } from './services/combinationEngine';
import {
  Sparkles,
  Layers,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  ArrowRight,
  Search,
  SlidersHorizontal,
  RefreshCw,
  AlertCircle,
  Edit3,
  RotateCcw,
  GraduationCap,
  Network
} from 'lucide-react';

export default function App() {
  const [profile, setProfile] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem('scholarsync_active_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name === 'Ananya Sharma' || parsed.name === 'Kishan Pande' || parsed.name === 'Kishan Pandey') {
          localStorage.removeItem('scholarsync_active_profile');
          return DEFAULT_PROFILE;
        }
        return syncProfileFields(parsed);
      }
    } catch (e) {
      console.error('Failed to load profile from localStorage:', e);
    }
    return DEFAULT_PROFILE;
  });
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Analysis state
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);

  // Modals
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [selectedMatchResult, setSelectedMatchResult] = useState<MatchResult | null>(null);
  const [selectedCombination, setSelectedCombination] = useState<ValidCombination | null>(null);

  // Combinations view sub-tab
  const [combinationSubTab, setCombinationSubTab] = useState<'valid' | 'conflicts'>('valid');

  // Filter within Dashboard for Eligible vs Undetermined vs Ineligible
  const [dashboardFilter, setDashboardFilter] = useState<'all' | 'eligible' | 'undetermined' | 'ineligible'>('all');

  const handleToggleDocument = (docIdOrName: string) => {
    setProfile((prev) => {
      const currentDocs = prev.possessed_documents || [];
      const updatedDocs = currentDocs.includes(docIdOrName)
        ? currentDocs.filter((d) => d !== docIdOrName)
        : [...currentDocs, docIdOrName];
      const updatedProfile = { ...prev, possessed_documents: updatedDocs };
      try {
        localStorage.setItem('scholarsync_active_profile', JSON.stringify(updatedProfile));
      } catch (e) {
        console.error(e);
      }
      return updatedProfile;
    });
  };

  // Live NSP & MahaDBT Sync state
  const [isSyncingNsp, setIsSyncingNsp] = useState<boolean>(false);
  const [isSyncingMahaDbt, setIsSyncingMahaDbt] = useState<boolean>(false);
  const [syncFeedback, setSyncFeedback] = useState<{
    message: string;
    count: number;
    log?: string;
  } | null>(null);
  const [scholarshipsList, setScholarshipsList] = useState<Scholarship[]>(
    scholarshipService.getAllScholarships()
  );

  const handleSyncNsp = async () => {
    setIsSyncingNsp(true);
    try {
      const res = await fetch('/api/nsp/fetch', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setSyncFeedback({
          message: data.message,
          count: data.records_count,
          log: data.execution_log
        });

        // Refresh list from /api/scholarships
        const sRes = await fetch('/api/scholarships');
        if (sRes.ok) {
          const sData = await sRes.json();
          if (Array.isArray(sData.scholarships)) {
            setScholarshipsList(sData.scholarships);
          }
        }

        // Re-execute analysis with updated scholarships
        await executeAnalysis(profile);
      }
    } catch (err) {
      console.error('NSP Sync error:', err);
    } finally {
      setIsSyncingNsp(false);
    }
  };

  const handleSyncMahaDbt = async () => {
    setIsSyncingMahaDbt(true);
    try {
      const res = await fetch('/api/mahadbt/fetch', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setSyncFeedback({
          message: data.message,
          count: data.records_count,
          log: data.execution_log
        });

        // Refresh list from /api/scholarships
        const sRes = await fetch('/api/scholarships');
        if (sRes.ok) {
          const sData = await sRes.json();
          if (Array.isArray(sData.scholarships)) {
            setScholarshipsList(sData.scholarships);
          }
        }

        // Re-execute analysis with updated scholarships
        await executeAnalysis(profile);
      }
    } catch (err) {
      console.error('MahaDBT Sync error:', err);
    } finally {
      setIsSyncingMahaDbt(false);
    }
  };

  // Execution engine: POST /api/analyze with client-side fallback
  const executeAnalysis = async (targetProfile: StudentProfile = profile) => {
    if (!targetProfile?.is_completed) {
      setAnalysis(null);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(targetProfile)
      });

      if (res.ok) {
        const data: AnalysisResponse = await res.json();
        setAnalysis(data);
      } else {
        throw new Error('Backend responded with non-200');
      }
    } catch {
      // Deterministic client fallback using local rule engine
      const all = scholarshipService.getAllScholarships();
      const match = runEligibilityEngine(all, targetProfile);
      const eligibleScholarships = match.eligible.map((m) => m.scholarship);
      const { validCombinations, invalidCombinations } =
        runCombinationEngine(eligibleScholarships);

      const maxBenefit =
        validCombinations.length > 0 ? validCombinations[0].total_potential_benefit : 0;

      const fallbackData: AnalysisResponse = {
        student_profile: targetProfile,
        summary: {
          total_analyzed: all.length,
          eligible_count: match.eligible.length,
          undetermined_count: match.undetermined.length,
          ineligible_count: match.ineligible.length,
          valid_combinations_count: validCombinations.length,
          invalid_combinations_count: invalidCombinations.length,
          max_potential_benefit: maxBenefit
        },
        eligible_scholarships: match.eligible,
        undetermined_scholarships: match.undetermined,
        ineligible_scholarships: match.ineligible,
        valid_combinations: validCombinations,
        invalid_combinations: invalidCombinations
      };
      setAnalysis(fallbackData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (profile?.is_completed) {
      executeAnalysis(profile);
    } else {
      setAnalysis(null);
    }
  }, []);

  const handleUpdateProfile = (updated: StudentProfile) => {
    const synced = syncProfileFields(updated);
    setProfile(synced);
    try {
      localStorage.setItem('scholarsync_active_profile', JSON.stringify(synced));
    } catch (e) {
      console.error('Failed to save profile to localStorage:', e);
    }
  };

  const handleSaveAndAnalyze = (updated: StudentProfile = profile) => {
    const synced = syncProfileFields({
      ...updated,
      is_completed: true
    });
    setProfile(synced);
    try {
      localStorage.setItem('scholarsync_active_profile', JSON.stringify(synced));
    } catch (e) {
      console.error('Failed to save profile to localStorage:', e);
    }
    executeAnalysis(synced);
    setActiveTab('dashboard');
  };

  const handleSaveProfile = (updated: StudentProfile) => {
    handleSaveAndAnalyze(updated);
  };

  const handleResetToBlank = () => {
    const blank = syncProfileFields({
      is_completed: false,
      name: '',
      date_of_birth: '',
      gender: 'Male',
      marital_status: 'Single',
      religion: 'Hindu',
      category: 'General',
      state_domicile: '',
      district_domicile: '',
      parent_annual_income: 0,
      annual_family_income: 0,
      parent_profession: '',
      parents_not_alive: false,
      is_disabled: false,
      disability_percentage: 0,
      scholarship_category: 'Post Matric/Top Class/MCM',
      application_type: 'Fresh',
      academic_percentage: 0,
      cgpa: 0,
      board_percentile_80th: false,
      course: 'B.Tech / B.E.',
      branch: '',
      year_of_study: '1st Year',
      current_semester: 'Semester 1',
      duration_years: 4,
      total_semesters: 8,
      education_level: 'Undergraduate',
      course_type: 'Regular / Full Time',
      admission_type: 'Merit / Centralized Counseling',
      institution_state: '',
      institution_district: '',
      institution_type: 'AICTE Approved Institution',
      institute_name: '',
      hosteller_status: 'Day Scholar',
      special_conditions: []
    });
    setProfile(blank);
    setAnalysis(null);
    try {
      localStorage.setItem('scholarsync_active_profile', JSON.stringify(blank));
    } catch (e) {
      console.error(e);
    }
    setActiveTab('profile');
  };

  const handleResetProfile = () => {
    setProfile(DEFAULT_PROFILE);
    setAnalysis(null);
    try {
      localStorage.setItem('scholarsync_active_profile', JSON.stringify(DEFAULT_PROFILE));
    } catch (e) {
      console.error(e);
    }
    setActiveTab('profile');
  };

  const allScholarships = scholarshipsList;
  const eligibleIds = new Set(
    analysis?.eligible_scholarships.map((e) => e.scholarship.id) || []
  );

  return (
    <div className="min-h-screen bg-[#F8FAF8] text-[#111827] flex flex-col antialiased">
      {/* 1. LEFT SIDEBAR */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        validCombinationsCount={analysis?.summary.valid_combinations_count || 0}
        eligibleCount={analysis?.summary.eligible_count || 0}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onResetProfile={handleResetProfile}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />

      {/* 2. MAIN LAYOUT WRAPPER (Shifted on desktop to accommodate left sidebar) */}
      <div className="lg:pl-64 flex-1 flex flex-col min-h-screen">
        {/* TOP HEADER */}
        <Header
          activeTab={activeTab}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />

        {/* 3. MAIN CONTENT AREA */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 space-y-8">
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            !profile.is_completed ? (
              <div className="bg-white border border-[#E5E7EB] rounded-none p-8 sm:p-14 text-center shadow-xs flex flex-col items-center justify-center max-w-xl mx-auto my-8 space-y-5">
                <div className="w-16 h-16 rounded-none bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center mb-1">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight">
                  Complete your profile to find scholarships matching your eligibility.
                </h2>
                <p className="text-xs text-[#6B7280] max-w-md mx-auto leading-relaxed">
                  Enter your academic and personal details to discover eligible scholarships and valid combinations.
                </p>
                <div className="pt-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('profile')}
                    className="px-6 py-3 rounded-none bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Complete Profile</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Top Hero Section */}
                <div className="bg-white border border-[#E5E7EB] rounded-none p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight">
                    Scholarship Eligibility & Stacking
                  </h2>
                  <p className="text-xs text-[#6B7280] mt-1.5 leading-relaxed">
                    Check your eligibility and find compatible scholarship combinations without duplicate benefit conflicts.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => executeAnalysis(profile)}
                    disabled={isLoading}
                    className="px-4 py-2.5 rounded-none bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Evaluating...</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        <span>Check Eligibility</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('profile')}
                    className="px-4 py-2.5 rounded-none bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] hover:border-emerald-800 text-[#111827] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Edit3 className="w-4 h-4 text-emerald-800" />
                    <span>Edit Profile</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetToBlank}
                    className="px-3.5 py-2.5 rounded-none bg-rose-50/70 border border-rose-200 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    title="Clear current profile data and start fresh"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Clear Profile</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSyncNsp}
                    disabled={isSyncingNsp}
                    className="px-3.5 py-2.5 rounded-none bg-white border border-[#E5E7EB] hover:border-emerald-800 text-emerald-900 hover:bg-emerald-50 text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    <RefreshCw className={`w-4 h-4 text-emerald-800 ${isSyncingNsp ? 'animate-spin' : ''}`} />
                    <span>{isSyncingNsp ? 'Updating...' : 'Refresh Directory'}</span>
                  </button>
                </div>
              </div>

              {/* Sync Feedback Banner */}
              {syncFeedback && (
                <div className="p-4 rounded-none bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0" />
                    <div>
                      <span className="font-bold text-emerald-900">{syncFeedback.message}</span>
                      <span className="text-[#4B5563] ml-1.5">
                        ({syncFeedback.count} scholarships updated)
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSyncFeedback(null)}
                    className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 px-2 py-1 rounded-none hover:bg-white cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {/* Summary Statistic Cards */}
              {analysis && (
                <DashboardSummary
                  totalAnalyzed={analysis.summary.total_analyzed}
                  eligibleCount={analysis.summary.eligible_count}
                  ineligibleCount={analysis.summary.ineligible_count}
                  validCombinationsCount={analysis.summary.valid_combinations_count}
                  selectedMetric={dashboardFilter}
                  onSelectMetric={(metric) => {
                    if (metric === 'combinations') setActiveTab('combinations');
                    else if (metric === 'eligible') setDashboardFilter('eligible');
                    else if (metric === 'undetermined') setDashboardFilter('undetermined');
                    else if (metric === 'ineligible') setDashboardFilter('ineligible');
                    else setDashboardFilter('all');
                  }}
                  onNavigateToNetwork={() => setActiveTab('network')}
                  onNavigateToWhatIf={() => setActiveTab('whatif')}
                />
              )}

              {/* Student Profile Card */}
              <ProfileCard
                profile={profile}
                onEditProfile={() => setActiveTab('profile')}
                onResetProfile={handleResetToBlank}
              />

              {/* SMART COMBINATIONS SECTION (Premium Green-Tinted Section) */}
              <section className="bg-emerald-50/50 border border-emerald-200 rounded-none p-6 sm:p-7 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-none bg-emerald-800" />
                      <h3 className="text-lg font-bold text-[#111827]">
                        Recommended Combinations
                      </h3>
                    </div>
                    <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
                      Compatible multi-scholarship options that can be availed together without conflict.
                    </p>
                  </div>

                  {analysis && analysis.valid_combinations.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('combinations')}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors cursor-pointer self-start sm:self-auto"
                    >
                      <span>View All ({analysis.valid_combinations.length})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {analysis && analysis.valid_combinations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {analysis.valid_combinations.slice(0, 3).map((combo, idx) => (
                      <CombinationCard
                        key={combo.id}
                        combination={combo}
                        rank={idx + 1}
                        isFeatured={idx === 0}
                        onInspect={(c) => setSelectedCombination(c)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-none border border-emerald-200 p-8 text-center">
                    <Layers className="w-10 h-10 text-[#9CA3AF] mx-auto mb-2" />
                    <h4 className="text-sm font-bold text-[#111827]">
                      No Multi-Scholarship Combinations Possible
                    </h4>
                    <p className="text-xs text-[#6B7280] max-w-md mx-auto mt-1">
                      The candidate is either eligible for a single scholarship or available schemes contain standalone exclusivity rules.
                    </p>
                  </div>
                )}
              </section>

              {/* FILTER BAR FOR SCHOLARSHIP RESULTS */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setDashboardFilter('all')}
                    className={`text-xs font-semibold px-4 py-2 rounded-none border transition-all cursor-pointer ${
                      dashboardFilter === 'all'
                        ? 'bg-[#111827] text-white border-[#111827]'
                        : 'bg-white text-[#4B5563] border-[#E5E7EB] hover:bg-[#F9FAFB]'
                    }`}
                  >
                    All Evaluated ({analysis?.summary.total_analyzed || 0})
                  </button>
                  <button
                    type="button"
                    onClick={() => setDashboardFilter('eligible')}
                    className={`text-xs font-semibold px-4 py-2 rounded-none border transition-all cursor-pointer ${
                      dashboardFilter === 'eligible'
                        ? 'bg-emerald-800 text-white border-emerald-800'
                        : 'bg-white text-[#4B5563] border-[#E5E7EB] hover:bg-[#F9FAFB]'
                    }`}
                  >
                    Eligible Only (✓ {analysis?.summary.eligible_count || 0})
                  </button>
                  <button
                    type="button"
                    onClick={() => setDashboardFilter('undetermined')}
                    className={`text-xs font-semibold px-4 py-2 rounded-none border transition-all cursor-pointer ${
                      dashboardFilter === 'undetermined'
                        ? 'bg-amber-700 text-white border-amber-700'
                        : 'bg-white text-[#4B5563] border-[#E5E7EB] hover:bg-[#F9FAFB]'
                    }`}
                  >
                    Additional Info Required (? {analysis?.undetermined_scholarships?.length || 0})
                  </button>
                  <button
                    type="button"
                    onClick={() => setDashboardFilter('ineligible')}
                    className={`text-xs font-semibold px-4 py-2 rounded-none border transition-all cursor-pointer ${
                      dashboardFilter === 'ineligible'
                        ? 'bg-[#374151] text-white border-[#374151]'
                        : 'bg-white text-[#4B5563] border-[#E5E7EB] hover:bg-[#F9FAFB]'
                    }`}
                  >
                    Not Eligible (✗ {analysis?.summary.ineligible_count || 0})
                  </button>
                </div>
              </div>

              {/* ELIGIBLE SCHOLARSHIPS SECTION */}
              {(dashboardFilter === 'all' || dashboardFilter === 'eligible') && (
                <section className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#111827]">
                      Eligible Scholarships (✓ 100% Criteria Met)
                    </h3>
                    <p className="text-xs text-[#6B7280] mt-0.5">
                      Statutory criteria verified and passed against candidate profile
                    </p>
                  </div>

                  {analysis && analysis.eligible_scholarships.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {analysis.eligible_scholarships.map((match) => (
                        <ScholarshipCard
                          key={match.scholarship.id}
                          matchResult={match}
                          possessedDocuments={profile.possessed_documents || []}
                          onToggleDocument={handleToggleDocument}
                          onOpenDetails={(s, m) => {
                            setSelectedScholarship(s);
                            setSelectedMatchResult(m || match);
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white border border-[#E5E7EB] rounded-none p-8 text-center shadow-xs">
                      <AlertCircle className="w-8 h-8 text-[#9CA3AF] mx-auto mb-2" />
                      <h4 className="text-sm font-bold text-[#111827]">
                        No 100% Eligible Scholarships Found
                      </h4>
                      <p className="text-xs text-[#6B7280] max-w-sm mx-auto mt-1 mb-4">
                        Adjust your profile parameters to discover more eligible schemes.
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveTab('profile')}
                        className="px-4 py-2 rounded-none bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 transition-colors"
                      >
                        Adjust Profile Criteria
                      </button>
                    </div>
                  )}
                </section>
              )}

              {/* ADDITIONAL INFO REQUIRED SECTION */}
              {(dashboardFilter === 'all' || dashboardFilter === 'undetermined') && (
                <section className="space-y-4 pt-4 border-t border-[#E5E7EB]">
                  <div>
                    <h3 className="text-lg font-bold text-amber-900 flex items-center gap-2">
                      <span>Additional Information Required (? Missing Input)</span>
                      {analysis?.undetermined_scholarships && analysis.undetermined_scholarships.length > 0 && (
                        <span className="text-xs font-bold px-2 py-0.5 rounded-none bg-amber-100 text-amber-900 border border-amber-200">
                          {analysis.undetermined_scholarships.length}
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-[#6B7280] mt-0.5">
                      Schemes where critical profile parameters (such as competitive exam, disability percentage, or quota proof) are missing to reach a definitive verdict
                    </p>
                  </div>

                  {analysis && analysis.undetermined_scholarships && analysis.undetermined_scholarships.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {analysis.undetermined_scholarships.map((match) => (
                        <ScholarshipCard
                          key={match.scholarship.id}
                          matchResult={match}
                          possessedDocuments={profile.possessed_documents || []}
                          onToggleDocument={handleToggleDocument}
                          onOpenDetails={(s, m) => {
                            setSelectedScholarship(s);
                            setSelectedMatchResult(m || match);
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white border border-[#E5E7EB] rounded-none p-6 text-center shadow-xs">
                      <p className="text-xs text-[#6B7280]">
                        No scholarships currently requiring additional information.
                      </p>
                    </div>
                  )}
                </section>
              )}

              {/* NOT ELIGIBLE SECTION */}
              {(dashboardFilter === 'all' || dashboardFilter === 'ineligible') && (
                <section className="space-y-4 pt-4 border-t border-[#E5E7EB]">
                  <div>
                    <h3 className="text-lg font-bold text-[#374151]">
                      Not Eligible (✗ Criteria Failed)
                    </h3>
                    <p className="text-xs text-[#6B7280] mt-0.5">
                      Schemes reviewed with exact criteria rejection log
                    </p>
                  </div>

                  {analysis && analysis.ineligible_scholarships.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {analysis.ineligible_scholarships.map((match) => (
                        <ScholarshipCard
                          key={match.scholarship.id}
                          matchResult={match}
                          possessedDocuments={profile.possessed_documents || []}
                          onToggleDocument={handleToggleDocument}
                          onOpenDetails={(s, m) => {
                            setSelectedScholarship(s);
                            setSelectedMatchResult(m || match);
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white border border-[#E5E7EB] rounded-none p-6 text-center shadow-xs">
                      <p className="text-xs text-[#6B7280]">
                        All analyzed schemes are currently eligible for this candidate!
                      </p>
                    </div>
                  )}
                </section>
              )}
            </div>
          )
        )}

          {/* TAB 2: MY PROFILE */}
          {activeTab === 'profile' && (
            <ProfileForm
              profile={profile}
              onChange={handleUpdateProfile}
              onAnalyze={(updated) => handleSaveAndAnalyze(updated || profile)}
              isLoading={isLoading}
            />
          )}

          {/* TAB 3: SCHOLARSHIPS (Catalog) */}
          {activeTab === 'scholarships' && (
            <CatalogView
              scholarships={allScholarships}
              analysis={analysis}
              profile={profile}
              eligibleScholarshipIds={eligibleIds}
              onOpenDetails={(s, match) => {
                setSelectedScholarship(s);
                setSelectedMatchResult(match || null);
              }}
              onSyncNsp={handleSyncNsp}
              isSyncingNsp={isSyncingNsp}
              onSyncMahaDbt={handleSyncMahaDbt}
              isSyncingMahaDbt={isSyncingMahaDbt}
            />
          )}

          {/* TAB 4: SMART COMBINATIONS */}
          {activeTab === 'combinations' && (
            !profile.is_completed ? (
              <div className="bg-white border border-[#E5E7EB] rounded-none p-8 sm:p-14 text-center shadow-xs flex flex-col items-center justify-center max-w-xl mx-auto my-8 space-y-5">
                <div className="w-16 h-16 rounded-none bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center mb-1">
                  <Layers className="w-8 h-8" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight">
                  Complete your profile to find scholarships matching your eligibility.
                </h2>
                <p className="text-xs text-[#6B7280] max-w-md mx-auto leading-relaxed">
                  Compatible combinations and scholarship stacking options require a completed profile.
                </p>
                <div className="pt-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('profile')}
                    className="px-6 py-3 rounded-none bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Complete Profile</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Sub navigation for Valid vs Blocked Conflicts */}
                <div className="bg-white border border-[#E5E7EB] rounded-none p-4 sm:p-5 shadow-xs flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setCombinationSubTab('valid')}
                      className={`text-xs font-bold px-4 py-2 rounded-none transition-all cursor-pointer ${
                        combinationSubTab === 'valid'
                          ? 'bg-emerald-800 text-white shadow-xs'
                          : 'text-[#4B5563] hover:bg-[#F9FAFB]'
                      }`}
                    >
                      Valid Combinations ({analysis?.summary.valid_combinations_count || 0})
                    </button>

                    <button
                      type="button"
                      onClick={() => setCombinationSubTab('conflicts')}
                      className={`text-xs font-bold px-4 py-2 rounded-none transition-all cursor-pointer ${
                        combinationSubTab === 'conflicts'
                          ? 'bg-[#111827] text-white shadow-xs'
                          : 'text-[#4B5563] hover:bg-[#F9FAFB]'
                      }`}
                    >
                      Blocked Conflicts ({analysis?.summary.invalid_combinations_count || 0})
                    </button>
                  </div>
                </div>

                {combinationSubTab === 'valid' ? (
                  analysis && analysis.valid_combinations.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {analysis.valid_combinations.map((combo, idx) => (
                        <CombinationCard
                          key={combo.id}
                          combination={combo}
                          rank={idx + 1}
                          isFeatured={idx === 0}
                          onInspect={(c) => setSelectedCombination(c)}
                          onInspectNetwork={() => setActiveTab('network')}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white border border-[#E5E7EB] rounded-none p-12 text-center shadow-xs">
                      <Layers className="w-10 h-10 text-[#9CA3AF] mx-auto mb-2" />
                      <h4 className="text-sm font-bold text-[#111827]">
                        No Valid Combinations Found
                      </h4>
                      <p className="text-xs text-[#6B7280] max-w-sm mx-auto mt-1 mb-4">
                        The candidate is either eligible for only 1 scholarship, or candidate schemes cannot be legally combined.
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveTab('profile')}
                        className="px-4 py-2 rounded-none bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900"
                      >
                        Update Profile
                      </button>
                    </div>
                  )
                ) : (
                  <ConflictMatrixView
                    invalidCombinations={analysis?.invalid_combinations || []}
                    validCount={analysis?.valid_combinations.length || 0}
                  />
                )}
              </div>
            )
          )}

          {/* TAB 5: COMPATIBILITY NETWORK */}
          {activeTab === 'network' && (
            !profile.is_completed ? (
              <div className="bg-white border border-[#E5E7EB] rounded-none p-8 sm:p-14 text-center shadow-xs flex flex-col items-center justify-center max-w-xl mx-auto my-8 space-y-5">
                <div className="w-16 h-16 rounded-none bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center mb-1">
                  <Network className="w-8 h-8" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight">
                  Complete your profile to find scholarships matching your eligibility.
                </h2>
                <p className="text-xs text-[#6B7280] max-w-md mx-auto leading-relaxed">
                  The compatibility network shows connections and rules based on your profile and eligible schemes.
                </p>
                <div className="pt-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('profile')}
                    className="px-6 py-3 rounded-none bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Complete Profile</span>
                  </button>
                </div>
              </div>
            ) : (
              <CompatibilityNetwork
                scholarships={allScholarships}
                eligibleScholarships={
                  analysis?.eligible_scholarships.map((m) => m.scholarship) || []
                }
                validCombinations={analysis?.valid_combinations || []}
                invalidCombinations={analysis?.invalid_combinations || []}
                analysis={analysis}
                onSelectScholarship={(s) => {
                  setSelectedScholarship(s);
                  const m =
                    analysis?.eligible_scholarships.find((em) => em.scholarship.id === s.id) ||
                    analysis?.undetermined_scholarships.find((um) => um.scholarship.id === s.id) ||
                    analysis?.ineligible_scholarships.find((im) => im.scholarship.id === s.id) ||
                    null;
                  setSelectedMatchResult(m);
                }}
                onOpenPlan={(plan) => setSelectedCombination(plan)}
              />
            )
          )}

          {/* TAB 6: WHAT-IF? SIMULATOR */}
          {activeTab === 'whatif' && (
            !profile.is_completed ? (
              <div className="bg-white border border-[#E5E7EB] rounded-none p-8 sm:p-14 text-center shadow-xs flex flex-col items-center justify-center max-w-xl mx-auto my-8 space-y-5">
                <div className="w-16 h-16 rounded-none bg-purple-50 border border-purple-200 text-purple-800 flex items-center justify-center mb-1">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight">
                  Complete your profile to find scholarships matching your eligibility.
                </h2>
                <p className="text-xs text-[#6B7280] max-w-md mx-auto leading-relaxed">
                  The What-If simulator uses your baseline profile to calculate potential unlocked scholarships when parameters change.
                </p>
                <div className="pt-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('profile')}
                    className="px-6 py-3 rounded-none bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Complete Profile</span>
                  </button>
                </div>
              </div>
            ) : (
              <WhatIfSimulator
                originalProfile={profile}
                allScholarships={allScholarships}
                originalAnalysis={analysis}
                onApplyToActiveProfile={(updatedProf) => {
                  handleUpdateProfile(updatedProf);
                  handleSaveAndAnalyze(updatedProf);
                  setActiveTab('dashboard');
                }}
                onExitSimulation={() => setActiveTab('dashboard')}
                onOpenScholarshipDetails={(s) => {
                  setSelectedScholarship(s);
                  const m =
                    analysis?.eligible_scholarships.find((em) => em.scholarship.id === s.id) || null;
                  setSelectedMatchResult(m);
                }}
              />
            )
          )}
        </main>

        {/* FOOTER */}
        <footer className="bg-white border-t border-[#E5E7EB] py-4 px-4 sm:px-8 text-xs text-[#6B7280] mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
            <span className="font-semibold text-[#111827]">ScholarSync</span>
            <span className="text-[11px] text-[#9CA3AF]">© {new Date().getFullYear()} ScholarSync. All rights reserved.</span>
          </div>
        </footer>
      </div>

      {/* MODALS */}
      <ScholarshipDetailModal
        scholarship={selectedScholarship}
        matchResult={selectedMatchResult}
        possessedDocuments={profile.possessed_documents || []}
        onToggleDocument={handleToggleDocument}
        onClose={() => {
          setSelectedScholarship(null);
          setSelectedMatchResult(null);
        }}
      />

      <CombinationDetailModal
        combination={selectedCombination}
        onClose={() => setSelectedCombination(null)}
        onOpenScholarship={(s) => {
          setSelectedCombination(null);
          setSelectedScholarship(s);
        }}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentProfile={profile}
        onResetDemo={handleResetProfile}
      />
    </div>
  );
}
