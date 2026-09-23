/**
 * What-If Hypothetical Simulator Component
 * In-memory simulation allowing students to explore hypothetical profile adjustments
 * (e.g. income reduction, score improvement, domicile change, hosteller status)
 * without ever mutating or overwriting the saved profile in localStorage/database.
 */

import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  ArrowRight,
  Plus,
  Minus,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Layers,
  HelpCircle,
  ChevronRight,
  Check,
  TrendingUp,
  Info,
  Sliders,
  DollarSign,
  GraduationCap,
  Building,
  Save
} from 'lucide-react';
import {
  StudentProfile,
  Scholarship,
  AnalysisResponse,
  Category,
  Gender,
  EducationLevel
} from '../types/scholarship';
import { runEligibilityEngine, formatINR } from '../services/eligibilityEngine';
import { runCombinationEngine } from '../services/combinationEngine';
import {
  INDIAN_STATES_AND_UTS,
  ACADEMIC_COURSES
} from '../config/academicCourses';

interface WhatIfSimulatorProps {
  originalProfile: StudentProfile;
  allScholarships: Scholarship[];
  originalAnalysis: AnalysisResponse | null;
  onApplyToActiveProfile?: (updatedProfile: StudentProfile) => void;
  onExitSimulation?: () => void;
  onOpenScholarshipDetails?: (scholarship: Scholarship) => void;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  originalProfile,
  allScholarships,
  originalAnalysis,
  onApplyToActiveProfile,
  onExitSimulation,
  onOpenScholarshipDetails
}) => {
  // In-memory simulation state initialized from current saved profile
  const [simProfile, setSimProfile] = useState<StudentProfile>(() => ({
    ...originalProfile,
    is_completed: true
  }));

  // Track if user modified any field from original
  const isModified = useMemo(() => {
    return (
      simProfile.annual_family_income !== originalProfile.annual_family_income ||
      simProfile.academic_percentage !== originalProfile.academic_percentage ||
      simProfile.category !== originalProfile.category ||
      simProfile.state_domicile !== originalProfile.state_domicile ||
      simProfile.gender !== originalProfile.gender ||
      simProfile.hosteller_status !== originalProfile.hosteller_status ||
      simProfile.course !== originalProfile.course ||
      simProfile.is_disabled !== originalProfile.is_disabled
    );
  }, [simProfile, originalProfile]);

  // Run the EXACT same deterministic engines for BEFORE (Original)
  const beforeResults = useMemo(() => {
    if (originalAnalysis) {
      return {
        eligibleCount: originalAnalysis.summary.eligible_count,
        plansCount: originalAnalysis.summary.valid_combinations_count,
        maxBenefit: originalAnalysis.summary.max_potential_benefit || 0,
        eligibleMap: new Set(originalAnalysis.eligible_scholarships.map((m) => m.scholarship.id)),
        topPlan: originalAnalysis.valid_combinations[0] || null
      };
    }
    const match = runEligibilityEngine(allScholarships, originalProfile);
    const eligibleList = match.eligible.map((m) => m.scholarship);
    const { validCombinations } = runCombinationEngine(eligibleList);
    const maxBenefit = validCombinations.length > 0 ? validCombinations[0].total_potential_benefit : 0;
    return {
      eligibleCount: match.eligible.length,
      plansCount: validCombinations.length,
      maxBenefit,
      eligibleMap: new Set(eligibleList.map((s) => s.id)),
      topPlan: validCombinations[0] || null
    };
  }, [allScholarships, originalProfile, originalAnalysis]);

  // Run the EXACT same deterministic engines for AFTER (Simulated)
  const afterResults = useMemo(() => {
    const match = runEligibilityEngine(allScholarships, simProfile);
    const eligibleList = match.eligible.map((m) => m.scholarship);
    const { validCombinations, invalidCombinations } = runCombinationEngine(eligibleList);
    const maxBenefit = validCombinations.length > 0 ? validCombinations[0].total_potential_benefit : 0;

    return {
      match,
      eligibleList,
      eligibleCount: match.eligible.length,
      plansCount: validCombinations.length,
      maxBenefit,
      validCombinations,
      invalidCombinations,
      eligibleMap: new Set(eligibleList.map((s) => s.id)),
      topPlan: validCombinations[0] || null
    };
  }, [allScholarships, simProfile]);

  // Calculate Delta (Newly Eligible, Lost, Unchanged)
  const landscapeDelta = useMemo(() => {
    const gained: { scholarship: Scholarship; reason: string }[] = [];
    const lost: { scholarship: Scholarship; reason: string }[] = [];
    const unchanged: Scholarship[] = [];

    allScholarships.forEach((s) => {
      const wasEligible = beforeResults.eligibleMap.has(s.id);
      const isEligibleNow = afterResults.eligibleMap.has(s.id);

      if (!wasEligible && isEligibleNow) {
        gained.push({
          scholarship: s,
          reason: 'Now satisfies income ceiling, domicile, or quota rules in simulated profile'
        });
      } else if (wasEligible && !isEligibleNow) {
        lost.push({
          scholarship: s,
          reason: 'Simulated parameters exceed scheme threshold or restriction'
        });
      } else if (isEligibleNow) {
        unchanged.push(s);
      }
    });

    return { gained, lost, unchanged };
  }, [allScholarships, beforeResults, afterResults]);

  // Quick simulation presets
  const applyPreset = (type: 'income_drop' | 'score_boost' | 'domicile_mh' | 'category_sc' | 'reset') => {
    if (type === 'reset') {
      setSimProfile({ ...originalProfile });
      return;
    }
    if (type === 'income_drop') {
      setSimProfile((prev) => ({ ...prev, annual_family_income: 200000 }));
    }
    if (type === 'score_boost') {
      setSimProfile((prev) => ({ ...prev, academic_percentage: 90, cgpa: 9.0 }));
    }
    if (type === 'domicile_mh') {
      setSimProfile((prev) => ({ ...prev, state_domicile: 'Maharashtra' }));
    }
    if (type === 'category_sc') {
      setSimProfile((prev) => ({ ...prev, category: 'SC' }));
    }
  };

  const benefitDifference = afterResults.maxBenefit - beforeResults.maxBenefit;
  const eligibleDifference = afterResults.eligibleCount - beforeResults.eligibleCount;

  return (
    <div className="space-y-8">
      {/* SIMULATOR BANNER & CONTROLS */}
      <div className="bg-white border border-[#E5E7EB] rounded-none p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-none bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center">
                <Sparkles className="w-4.5 h-4.5" />
              </span>
              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-purple-700 tracking-wider">
                  Hypothetical Scenario Simulator
                </span>
                <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                  What-If Analysis Engine
                </h2>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 max-w-2xl leading-relaxed">
              Simulate profile changes (income, academic percentage, category, domicile) to observe
              real-time unlockable scholarship grants and compatible plan combinations.
              <strong className="text-gray-700 ml-1">
                Your saved profile remains strictly unaltered.
              </strong>
            </p>
          </div>

          {/* Quick Presets & Reset */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => applyPreset('income_drop')}
              className="px-3.5 py-2 rounded-none bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-semibold text-gray-700 transition-colors cursor-pointer"
            >
              Income ₹2.0L
            </button>
            <button
              onClick={() => applyPreset('score_boost')}
              className="px-3.5 py-2 rounded-none bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-semibold text-gray-700 transition-colors cursor-pointer"
            >
              90% Marks
            </button>
            <button
              onClick={() => applyPreset('domicile_mh')}
              className="px-3.5 py-2 rounded-none bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold text-emerald-800 transition-colors cursor-pointer"
            >
              Maharashtra Domicile
            </button>

            {isModified && (
              <button
                onClick={() => applyPreset('reset')}
                className="px-3.5 py-2 rounded-none bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-bold text-rose-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Simulation</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* TWO COLUMN WORKSPACE: VARIABLES VS IMPACT */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* LEFT COLUMN: SIMULATION INPUT VARIABLES */}
        <div className="xl:col-span-5 bg-white border border-[#E5E7EB] rounded-none p-6 sm:p-7 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <span className="font-mono text-[10px] uppercase font-bold text-gray-500 block">
                Variable Inputs
              </span>
              <h3 className="text-sm font-bold text-gray-900 mt-0.5">Adjust Simulation Parameters</h3>
            </div>
            {isModified && (
              <span className="font-mono text-[10px] font-bold px-2.5 py-1 rounded-none bg-purple-100 text-purple-800 border border-purple-200">
                Simulating
              </span>
            )}
          </div>

          {/* 1. Annual Family Income */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-gray-700">Annual Family Income</span>
              <span className="font-mono font-bold text-gray-900">
                {formatINR(simProfile.annual_family_income || 0)}
              </span>
            </div>
            <input
              type="range"
              min="50000"
              max="1000000"
              step="25000"
              value={simProfile.annual_family_income || 250000}
              onChange={(e) =>
                setSimProfile((prev) => ({
                  ...prev,
                  annual_family_income: Number(e.target.value)
                }))
              }
              className="w-full accent-emerald-800 h-2 bg-gray-200 rounded-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-gray-400">
              <span>₹50K</span>
              <span>₹2.5L</span>
              <span>₹6.0L</span>
              <span>₹8.0L+</span>
            </div>
          </div>

          {/* 2. Academic Percentage / Marks */}
          <div className="space-y-2.5 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-gray-700">Academic Percentage / Marks</span>
              <span className="font-mono font-bold text-gray-900">
                {simProfile.academic_percentage || 75}%
              </span>
            </div>
            <input
              type="range"
              min="40"
              max="100"
              step="1"
              value={simProfile.academic_percentage || 75}
              onChange={(e) =>
                setSimProfile((prev) => ({
                  ...prev,
                  academic_percentage: Number(e.target.value),
                  cgpa: Number((Number(e.target.value) / 9.5).toFixed(2))
                }))
              }
              className="w-full accent-emerald-800 h-2 bg-gray-200 rounded-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-gray-400">
              <span>40%</span>
              <span>60% (First Div)</span>
              <span>75% (Distinction)</span>
              <span>90%+ (Merit)</span>
            </div>
          </div>

          {/* 3. Social Category */}
          <div className="space-y-2 pt-4 border-t border-gray-100">
            <label className="text-xs font-semibold text-gray-700 block">Social Category</label>
            <select
              value={simProfile.category || 'General'}
              onChange={(e) =>
                setSimProfile((prev) => ({
                  ...prev,
                  category: e.target.value as Category
                }))
              }
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-none text-xs text-gray-900 font-medium focus:bg-white focus:ring-1 focus:ring-emerald-800 focus:outline-none"
            >
              <option value="General">General / Open / EBC</option>
              <option value="OBC">OBC (Other Backward Class)</option>
              <option value="SC">SC (Scheduled Caste)</option>
              <option value="ST">ST (Scheduled Tribe)</option>
              <option value="EWS">EWS (Economically Weaker Section)</option>
            </select>
          </div>

          {/* 4. State Domicile */}
          <div className="space-y-2 pt-4 border-t border-gray-100">
            <label className="text-xs font-semibold text-gray-700 block">State Domicile</label>
            <select
              value={simProfile.state_domicile || 'Maharashtra'}
              onChange={(e) =>
                setSimProfile((prev) => ({
                  ...prev,
                  state_domicile: e.target.value
                }))
              }
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-none text-xs text-gray-900 font-medium focus:bg-white focus:ring-1 focus:ring-emerald-800 focus:outline-none"
            >
              {INDIAN_STATES_AND_UTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* 5. Gender & Hosteller Status */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1.5">Gender</label>
              <select
                value={simProfile.gender || 'Male'}
                onChange={(e) =>
                  setSimProfile((prev) => ({
                    ...prev,
                    gender: e.target.value as Gender
                  }))
                }
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-none text-xs text-gray-900 font-medium focus:bg-white focus:ring-1 focus:ring-emerald-800 focus:outline-none"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1.5">Residential Status</label>
              <select
                value={simProfile.hosteller_status || 'Hosteller'}
                onChange={(e) =>
                  setSimProfile((prev) => ({
                    ...prev,
                    hosteller_status: e.target.value as 'Hosteller' | 'Day Scholar'
                  }))
                }
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-none text-xs text-gray-900 font-medium focus:bg-white focus:ring-1 focus:ring-emerald-800 focus:outline-none"
              >
                <option value="Hosteller">Hosteller (Hostel stipend)</option>
                <option value="Day Scholar">Day Scholar</option>
              </select>
            </div>
          </div>

          {/* Apply Simulation Permanently (Optional button) */}
          {isModified && onApplyToActiveProfile && (
            <div className="pt-4 border-t border-gray-100">
              <button
                onClick={() => onApplyToActiveProfile(simProfile)}
                className="w-full py-3 px-4 rounded-none bg-gray-900 text-white hover:bg-gray-800 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <Save className="w-3.5 h-3.5 text-emerald-400" />
                <span>Save Scenario as Permanent Profile</span>
              </button>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: BEFORE / AFTER IMPACT & LANDSCAPE DELTA */}
        <div className="xl:col-span-7 space-y-6">
          {/* BEFORE VS AFTER METRICS CARD */}
          <div className="bg-white border border-[#E5E7EB] rounded-none shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-800" />
                <span className="font-mono text-[10px] uppercase font-bold text-gray-700">
                  Scenario Impact Comparison
                </span>
              </div>

              {benefitDifference !== 0 && (
                <span
                  className={`font-mono text-xs font-bold px-2.5 py-1 rounded-none border ${
                    benefitDifference > 0
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}
                >
                  {benefitDifference > 0 ? `+${formatINR(benefitDifference)}` : formatINR(benefitDifference)} Potential Benefit
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
              {/* CURRENT PROFILE (BEFORE) */}
              <div className="p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase font-bold text-gray-400">
                    Baseline Profile
                  </span>
                  <span className="text-[10px] font-semibold text-gray-600 bg-gray-100 border border-gray-200 px-2.5 py-0.5 rounded-none">
                    Active
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="font-mono text-2xl font-bold text-gray-900 block leading-tight">
                      {beforeResults.eligibleCount}
                    </span>
                    <span className="text-xs text-gray-500 mt-0.5 block">Eligible Scholarships</span>
                  </div>

                  <div>
                    <span className="font-mono text-2xl font-bold text-gray-900 block leading-tight">
                      {beforeResults.plansCount}
                    </span>
                    <span className="text-xs text-gray-500 mt-0.5 block">Compatible Combination Plans</span>
                  </div>

                  <div>
                    <span className="font-mono text-2xl font-bold text-emerald-800 block leading-tight">
                      {formatINR(beforeResults.maxBenefit)}
                    </span>
                    <span className="text-xs text-gray-500 mt-0.5 block">Maximum Potential Benefit</span>
                  </div>
                </div>
              </div>

              {/* SIMULATED PROFILE (AFTER) */}
              <div className={`p-6 space-y-5 ${isModified ? 'bg-purple-50/30' : ''}`}>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase font-bold text-purple-700">
                    Simulated Scenario
                  </span>
                  <span className="text-[10px] font-semibold text-purple-700 bg-purple-100 border border-purple-200 px-2.5 py-0.5 rounded-none">
                    Hypothetical
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-2xl font-bold text-gray-900 leading-tight">
                        {afterResults.eligibleCount}
                      </span>
                      {eligibleDifference !== 0 && (
                        <span
                          className={`font-mono text-xs font-bold ${
                            eligibleDifference > 0 ? 'text-emerald-800' : 'text-rose-600'
                          }`}
                        >
                          {eligibleDifference > 0 ? `(+${eligibleDifference})` : `(${eligibleDifference})`}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 mt-0.5 block">Eligible Scholarships</span>
                  </div>

                  <div>
                    <span className="font-mono text-2xl font-bold text-gray-900 block leading-tight">
                      {afterResults.plansCount}
                    </span>
                    <span className="text-xs text-gray-500 mt-0.5 block">Compatible Combination Plans</span>
                  </div>

                  <div>
                    <span className="font-mono text-2xl font-bold text-purple-900 block leading-tight">
                      {formatINR(afterResults.maxBenefit)}
                    </span>
                    <span className="text-xs text-gray-500 mt-0.5 block">Maximum Potential Benefit</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* LANDSCAPE DELTA LIST */}
          <div className="bg-white border border-[#E5E7EB] rounded-none shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Landscape Availability Delta</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Detailed changes in individual scheme eligibility caused by modified parameters.
                </p>
              </div>

              <div className="flex items-center gap-2.5 font-mono text-[10px]">
                <span className="text-emerald-800 font-bold">
                  +{landscapeDelta.gained.length} Gained
                </span>
                <span className="text-gray-300">|</span>
                <span className="text-rose-700 font-bold">
                  -{landscapeDelta.lost.length} Lost
                </span>
              </div>
            </div>

            <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
              {landscapeDelta.gained.length === 0 && landscapeDelta.lost.length === 0 ? (
                <div className="p-8 text-center text-xs text-gray-500">
                  <Info className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                  <span>No change in scholarship eligibility status with current simulated values.</span>
                </div>
              ) : (
                <>
                  {/* Newly Gained Scholarships */}
                  {landscapeDelta.gained.map(({ scholarship, reason }) => (
                    <div
                      key={scholarship.id}
                      className="p-5 flex items-start justify-between gap-4 hover:bg-emerald-50/40 transition-colors"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[9px] uppercase font-bold px-2 py-0.5 rounded-none bg-emerald-100 text-emerald-900 border border-emerald-200">
                            {scholarship.source_type}
                          </span>
                          <span className="text-xs font-bold text-gray-900">
                            {scholarship.name}
                          </span>
                        </div>
                        <p className="text-[11px] text-emerald-900 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                          <span>{reason}</span>
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-mono text-xs font-bold text-emerald-800 block">
                          {scholarship.benefit_amount ? formatINR(scholarship.benefit_amount) : 'Tuition Waiver'}
                        </span>
                        <span className="inline-flex items-center gap-1 font-mono text-[9px] font-bold uppercase text-emerald-800 mt-1">
                          <Plus className="w-3 h-3" /> Newly Available
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Lost Scholarships */}
                  {landscapeDelta.lost.map(({ scholarship, reason }) => (
                    <div
                      key={scholarship.id}
                      className="p-5 flex items-start justify-between gap-4 hover:bg-rose-50/40 transition-colors"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[9px] uppercase font-bold px-2 py-0.5 rounded-none bg-rose-100 text-rose-800 border border-rose-200">
                            {scholarship.source_type}
                          </span>
                          <span className="text-xs font-bold text-gray-900 line-through text-gray-500">
                            {scholarship.name}
                          </span>
                        </div>
                        <p className="text-[11px] text-rose-700 flex items-center gap-1.5">
                          <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                          <span>{reason}</span>
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="inline-flex items-center gap-1 font-mono text-[9px] font-bold uppercase text-rose-700">
                          <Minus className="w-3 h-3" /> Excluded
                        </span>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
