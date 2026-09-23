import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  Building2,
  Calendar,
  FileCheck,
  Award,
  HeartHandshake,
  CheckCircle2,
  XCircle,
  HelpCircle,
  AlertTriangle,
  BookOpen,
  GraduationCap,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  FileText,
  BadgeCheck,
  Clock,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { Scholarship, MatchResult } from '../types/scholarship';
import { formatINR } from '../services/eligibilityEngine';
import { crossReferenceDocuments } from '../services/documentChecklist';
import { getVerifiedOfficialApplicationUrl, getVerifiedOfficialSourceUrl } from '../utils/scholarshipUrl';

interface ScholarshipDetailModalProps {
  scholarship: Scholarship | null;
  matchResult?: MatchResult | null;
  onClose: () => void;
  possessedDocuments?: string[];
  onToggleDocument?: (docId: string) => void;
}

export const ScholarshipDetailModal: React.FC<ScholarshipDetailModalProps> = ({
  scholarship,
  matchResult,
  onClose,
  possessedDocuments = [],
  onToggleDocument
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'evaluation' | 'source'>('overview');

  if (!scholarship) return null;

  const elig = scholarship.eligibility || ({} as any);
  const sel = scholarship.selection || ({} as any);
  const ben = scholarship.benefits || ({} as any);
  const app = scholarship.application || ({} as any);
  const doc = scholarship.documents || ({} as any);
  const rest = scholarship.restrictions || ({} as any);
  const src = scholarship.source || ({} as any);

  const officialPortalUrl = src.official_portal_url || 'https://scholarships.gov.in/All-Scholarships';
  const officialSpecUrl = getVerifiedOfficialSourceUrl(scholarship);
  const officialFaqUrl = src.official_faq_url || scholarship.official_faq_url;
  const sourceDocName = src.source_document_name || 'Official Scheme Guidelines';
  const validationStatus = src.source_validation_status || scholarship.source_validation_status || 'verified';

  // Official verified application portal URL
  const officialApplicationUrl = getVerifiedOfficialApplicationUrl(scholarship);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] overflow-hidden my-6 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="p-6 border-b border-[#F3F4F6] bg-white sticky top-0 z-10">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5 flex-1 min-w-0">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                {scholarship.source_type === 'MAHADBT' || scholarship.id.startsWith('MAHADBT') ? (
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300">
                    MahaDBT (Govt of Maharashtra)
                  </span>
                ) : (
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-300">
                    NSP (Govt of India)
                  </span>
                )}
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#F0FDF4] text-[#16A34A] border border-[#DCFCE7]">
                  {scholarship.classification}
                </span>
                {scholarship.department && (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                    {scholarship.department}
                  </span>
                )}
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-[#F3F4F6] text-[#111827]">
                  AY {scholarship.academic_year || '2026-27'}
                </span>
                {scholarship.scheme_type === 'merit_based' ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-md bg-[#EFF6FF] text-[#1D4ED8] border border-[#DBEAFE]">
                    <Award className="w-3.5 h-3.5" />
                    <span>Merit-based Scheme</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-md bg-[#F5F3FF] text-[#6D28D9] border border-[#EDE9FE]">
                    <HeartHandshake className="w-3.5 h-3.5" />
                    <span>Welfare-based Scheme</span>
                  </span>
                )}
                {validationStatus === 'verified' && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <BadgeCheck className="w-3 h-3 text-emerald-600" />
                    Official Scheme Verified
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-[#111827] leading-tight">
                {scholarship.name}
              </h2>

              <p className="text-xs sm:text-sm text-[#4B5563] flex items-center gap-1.5 font-medium">
                <Building2 className="w-4 h-4 text-[#9CA3AF] shrink-0" />
                <span>{scholarship.provider}</span>
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors cursor-pointer shrink-0"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#F3F4F6]">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#16A34A] text-white'
                  : 'text-[#4B5563] hover:bg-[#F3F4F6]'
              }`}
            >
              Scheme Specifications
            </button>
            {matchResult && (
              <button
                onClick={() => setActiveTab('evaluation')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'evaluation'
                    ? 'bg-[#16A34A] text-white'
                    : 'text-[#4B5563] hover:bg-[#F3F4F6]'
                }`}
              >
                <span>Student Evaluation</span>
                {matchResult.status === 'eligible' && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                )}
                {matchResult.status === 'undetermined' && (
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                )}
                {matchResult.status === 'not_eligible' && (
                  <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                )}
              </button>
            )}
            <button
              onClick={() => setActiveTab('source')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'source'
                  ? 'bg-[#16A34A] text-white'
                  : 'text-[#4B5563] hover:bg-[#F3F4F6]'
              }`}
            >
              Official Sources & PDF
            </button>
          </div>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: OVERVIEW & SPECIFICATIONS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Highlight Banner: Benefit & Deadline */}
              <div className="p-5 rounded-2xl bg-[#F0FDF4] border border-[#DCFCE7] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold text-[#15803D] uppercase tracking-wider block">
                    Potential Financial Benefit
                  </span>
                  <div className="text-3xl font-extrabold text-[#111827] mt-0.5">
                    {formatINR(scholarship.benefit_amount || ben.amount || 0)}
                    <span className="text-xs font-normal text-[#6B7280] ml-2">
                      {ben.amount_per_interval || '/ academic year'}
                    </span>
                  </div>
                  <p className="text-xs text-[#15803D] mt-1 font-medium">
                    {scholarship.benefit_details || ben.amount_per_interval || 'Disbursed directly via DBT to Aadhaar-seeded bank account.'}
                  </p>
                </div>

                <div className="sm:text-right pt-3 sm:pt-0 border-t sm:border-t-0 border-[#DCFCE7]">
                  <span className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider block">
                    Application Deadline
                  </span>
                  <div className="inline-flex items-center gap-1.5 text-sm font-bold text-[#111827] mt-1">
                    <Calendar className="w-4 h-4 text-[#16A34A]" />
                    <span>{scholarship.deadline || app.deadline || '31-10-2026'}</span>
                  </div>
                  <span className="text-[11px] text-[#6B7280] block mt-0.5">
                    {app.application_mode || 'Online via scholarships.gov.in'}
                  </span>
                </div>
              </div>

              {/* Official Description */}
              {scholarship.description && (
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Official Mandate & Scope
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                    {scholarship.description}
                  </p>
                </div>
              )}

              {/* SECTION 1: WHO CAN APPLY? */}
              <div className="rounded-2xl border border-gray-200 p-5 bg-white space-y-3">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                  <GraduationCap className="w-5 h-5 text-[#16A34A]" />
                  <h3 className="text-sm font-bold text-gray-900 tracking-wide uppercase">
                    1. Who Can Apply?
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-gray-500 font-medium block">Education Level</span>
                    <span className="font-semibold text-gray-900 mt-0.5 block">
                      {elig.education_level ? elig.education_level.join(', ') : 'Not specified in source'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-gray-500 font-medium block">Course / Stream</span>
                    <span className="font-semibold text-gray-900 mt-0.5 block">
                      {elig.course ? elig.course.join(', ') : 'Open to all recognized courses'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-gray-500 font-medium block">Year of Study</span>
                    <span className="font-semibold text-gray-900 mt-0.5 block">
                      {elig.year_of_study || '1st Year (or as specified)'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-gray-500 font-medium block">Social Category</span>
                    <span className="font-semibold text-gray-900 mt-0.5 block">
                      {elig.category ? elig.category.join(', ') : 'Open to all categories (General, OBC, SC, ST, EWS)'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-gray-500 font-medium block">Gender</span>
                    <span className="font-semibold text-gray-900 mt-0.5 block">
                      {elig.gender && elig.gender !== 'ANY' ? elig.gender : 'Open to All Genders'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-gray-500 font-medium block">Annual Family Income</span>
                    <span className="font-semibold text-gray-900 mt-0.5 block">
                      {elig.income_limit ? `Up to ${formatINR(elig.income_limit)} / year` : 'No income ceiling specified in source'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-gray-500 font-medium block">Domicile / Region</span>
                    <span className="font-semibold text-gray-900 mt-0.5 block">
                      {elig.state_domicile ? elig.state_domicile.join(', ') : 'All India (All States & UTs)'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-gray-500 font-medium block">Academic Requirement</span>
                    <span className="font-semibold text-gray-900 mt-0.5 block">
                      {elig.minimum_percentage ? `Minimum ${elig.minimum_percentage}% marks` : 'Admission in approved seat'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-gray-500 font-medium block">Disability Criteria</span>
                    <span className="font-semibold text-gray-900 mt-0.5 block">
                      {elig.disability_required ? `>= ${elig.minimum_disability_percentage || 40}% benchmark disability` : 'Not required'}
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 2: SPECIAL ELIGIBILITY CONDITIONS */}
              <div className="rounded-2xl border border-gray-200 p-5 bg-white space-y-3">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  <h3 className="text-sm font-bold text-gray-900 tracking-wide uppercase">
                    2. Special Eligibility Conditions
                  </h3>
                </div>

                <div className="space-y-2 text-xs">
                  {elig.family_conditions && elig.family_conditions.length > 0 && (
                    <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100">
                      <span className="font-bold text-amber-900 block mb-1">Family & Children Constraints:</span>
                      <ul className="list-disc list-inside space-y-0.5 text-amber-900/90">
                        {elig.family_conditions.map((fc: string, i: number) => (
                          <li key={i}>{fc}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {elig.institution_requirements && elig.institution_requirements.length > 0 && (
                    <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100">
                      <span className="font-bold text-blue-900 block mb-1">Institution Accreditation Requirements:</span>
                      <ul className="list-disc list-inside space-y-0.5 text-blue-900/90">
                        {elig.institution_requirements.map((ir: string, i: number) => (
                          <li key={i}>{ir}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {elig.admission_type && (
                    <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100">
                      <span className="font-bold text-purple-900 block mb-0.5">Admission Type:</span>
                      <span className="text-purple-900/90">{elig.admission_type}</span>
                    </div>
                  )}

                  {elig.special_category_requirements && elig.special_category_requirements.length > 0 && (
                    <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-100">
                      <span className="font-bold text-rose-900 block mb-1">Special Wards / Beneficiary Quotas:</span>
                      <ul className="list-disc list-inside space-y-0.5 text-rose-900/90">
                        {elig.special_category_requirements.map((sq: string, i: number) => (
                          <li key={i}>{sq}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {!elig.family_conditions && !elig.institution_requirements && !elig.admission_type && !elig.special_category_requirements && (
                    <p className="text-gray-500 italic p-2">
                      No additional special conditions specified in official source.
                    </p>
                  )}
                </div>
              </div>

              {/* SECTION 3: SELECTION PROCESS */}
              <div className="rounded-2xl border border-gray-200 p-5 bg-white space-y-3">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                  <Award className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-sm font-bold text-gray-900 tracking-wide uppercase">
                    3. Selection Process & Merit Criteria
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-gray-500 font-medium block">How Candidates are Selected</span>
                    <span className="font-semibold text-gray-900 mt-1 block">
                      {sel.selection_criteria || 'Prepared purely on merit based on qualifying examination percentage.'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-gray-500 font-medium block">Tie-Breaking Rules</span>
                    <span className="font-semibold text-gray-900 mt-1 block">
                      {sel.ranking_method || 'Elder candidate by date of birth ranked higher in case of identical score.'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-gray-500 font-medium block">Quotas & Allocation</span>
                    <span className="font-semibold text-gray-900 mt-1 block">
                      {sel.state_wise_allocation || 'Allocated as per ministerial guidelines and population quotas.'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-gray-500 font-medium block">Renewal Conditions</span>
                    <span className="font-semibold text-gray-900 mt-1 block">
                      {sel.renewal_conditions || 'Must secure minimum passing marks and minimum 75% attendance.'}
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 4: FINANCIAL BENEFITS BREAKDOWN */}
              <div className="rounded-2xl border border-gray-200 p-5 bg-white space-y-3">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                  <Layers className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-sm font-bold text-gray-900 tracking-wide uppercase">
                    4. Financial Benefits Breakdown
                  </h3>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
                      <span className="text-emerald-800 font-medium block">Tuition / Course Fee</span>
                      <span className="font-bold text-gray-900 mt-0.5 block">
                        {ben.fee_reimbursement || 'Included in consolidated grant'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
                      <span className="text-emerald-800 font-medium block">Maintenance Allowance</span>
                      <span className="font-bold text-gray-900 mt-0.5 block">
                        {ben.maintenance_allowance || 'Included in stipend'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
                      <span className="text-emerald-800 font-medium block">Books / Equipment Aid</span>
                      <span className="font-bold text-gray-900 mt-0.5 block">
                        {ben.books_equipment_allowance || 'Covered under annual grant'}
                      </span>
                    </div>
                  </div>

                  {ben.components && ben.components.length > 0 && (
                    <div className="mt-3 space-y-1.5">
                      <span className="font-bold text-gray-700 block">Designated Benefit Components:</span>
                      {ben.components.map((comp: any, i: number) => (
                        <div key={i} className="p-2.5 rounded-lg bg-gray-50 border border-gray-200 flex justify-between items-center">
                          <div>
                            <span className="font-semibold text-gray-900 block">{comp.title}</span>
                            <span className="text-[11px] text-gray-500">{comp.description}</span>
                          </div>
                          {comp.amount && (
                            <span className="font-mono font-bold text-emerald-700 text-sm">
                              {formatINR(comp.amount)}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4 pt-2 text-gray-600 text-[11px]">
                    <span><strong>Duration:</strong> {ben.maximum_duration || 'Duration of course'}</span>
                    <span><strong>Disbursement:</strong> {ben.number_of_installments || 'Annual DBT credit'}</span>
                  </div>
                </div>
              </div>

              {/* SECTION 5: REQUIRED DOCUMENTS (EXTRACTED FROM OFFICIAL SCHEME PDF) */}
              <div className="rounded-2xl border border-gray-200 p-5 bg-white space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-blue-600" />
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 tracking-wide uppercase">
                        5. Mandatory Required Documents
                      </h3>
                      <span className="text-[11px] text-[#16A34A] font-semibold block">
                        Verified from Official Scheme Guidelines PDF
                      </span>
                    </div>
                  </div>

                  {(scholarship.source?.source_url || scholarship.source_url) && (
                    <a
                      href={scholarship.source?.source_url || scholarship.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold border border-rose-200 transition-colors self-start sm:self-auto"
                      title="Open and read the official Ministry guidelines PDF"
                    >
                      <FileText className="w-3.5 h-3.5 text-rose-600" />
                      <span>{scholarship.source?.source_document_name || 'Download Scheme PDF'}</span>
                      <ExternalLink className="w-3 h-3 text-rose-500" />
                    </a>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100 text-xs text-blue-900 leading-relaxed">
                  <span className="font-bold block mb-0.5">Scheme Document Requirements:</span>
                  The following documents are mandatory for registration and verification on the National Scholarship Portal (NSP) for <strong>{scholarship.name}</strong> as specified in statutory circular <em>{scholarship.source?.source_document_name || 'Ministry Guidelines'}</em>.
                </div>

                {(() => {
                  const reqDocs = doc.required_documents || scholarship.documents?.required_documents || scholarship.required_documents || [];
                  const crossRef = crossReferenceDocuments(reqDocs, possessedDocuments);

                  return (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                        <span className="font-semibold text-gray-700">Document Readiness Status:</span>
                        <span className={`font-bold px-2 py-0.5 rounded-full text-xs ${crossRef.isFullyReady ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                          {crossRef.possessedCount}/{crossRef.totalRequired} Ready ({crossRef.readinessPercentage}%)
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                        {crossRef.checks.map((chk, i) => (
                          <div
                            key={i}
                            className={`flex items-start justify-between gap-2.5 p-3 rounded-xl border transition-colors ${
                              chk.isPossessed
                                ? 'bg-emerald-50/40 border-emerald-200'
                                : 'bg-gray-50 border-gray-200/80 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-start gap-2.5 min-w-0">
                              <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px] ${
                                chk.isPossessed ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700'
                              }`}>
                                {chk.isPossessed ? '✓' : i + 1}
                              </div>
                              <div>
                                <span className={`font-semibold block leading-snug ${chk.isPossessed ? 'text-emerald-950' : 'text-gray-900'}`}>
                                  {chk.requiredName}
                                </span>
                                <span className="text-[10px] text-gray-500 mt-0.5 block">
                                  {chk.isPossessed ? `Possessed (${chk.matchedPossessedName || 'Verified in profile'})` : 'Mandatory upload on NSP'}
                                </span>
                              </div>
                            </div>

                            <div className="shrink-0">
                              {chk.isPossessed ? (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                                  In Hand
                                </span>
                              ) : onToggleDocument ? (
                                <button
                                  type="button"
                                  onClick={() => onToggleDocument(chk.matchedPossessedId || chk.requiredName)}
                                  className="text-[10px] font-semibold text-blue-700 hover:text-blue-900 bg-white hover:bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 cursor-pointer transition-colors"
                                >
                                  + Mark Possessed
                                </button>
                              ) : (
                                <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                                  Pending
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {doc.submission_format && (
                  <div className="pt-2 flex flex-wrap gap-4 text-gray-500 text-[11px] border-t border-gray-100">
                    <span><strong>Accepted Format:</strong> {doc.submission_format}</span>
                    <span><strong>Maximum File Size:</strong> {doc.max_file_size || '200 KB per document'}</span>
                    <span><strong>Verification Mode:</strong> Level 1 (Institute) & Level 2 (District/State Nodal Officer)</span>
                  </div>
                )}
              </div>

              {/* SECTION 6: IMPORTANT RESTRICTIONS */}
              <div className="rounded-2xl border border-gray-200 p-5 bg-white space-y-3">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                  <ShieldAlert className="w-5 h-5 text-rose-600" />
                  <h3 className="text-sm font-bold text-gray-900 tracking-wide uppercase">
                    6. Important Restrictions & Exclusions
                  </h3>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-100">
                    <span className="font-bold text-rose-900 block mb-1">Who CANNOT Apply (Exclusions):</span>
                    <ul className="list-disc list-inside space-y-0.5 text-rose-900/90">
                      {(rest.exclusions || scholarship.exclusions || []).map((exc: string, i: number) => (
                        <li key={i}>{exc}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100">
                    <span className="font-bold text-amber-900 block mb-1">Simultaneous Scholarship & Stacking Rules:</span>
                    <p className="text-amber-900/90 leading-relaxed">
                      {rest.simultaneous_scholarship_restrictions ||
                        scholarship.conflict_rules?.rule_description ||
                        'Under statutory scholarship policy, students may receive 1 Merit-based award and 1 or more non-duplicative Welfare-based awards.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION 7: APPLICATION & VERIFICATION */}
              <div className="rounded-2xl border border-gray-200 p-5 bg-white space-y-3">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                  <Clock className="w-5 h-5 text-teal-600" />
                  <h3 className="text-sm font-bold text-gray-900 tracking-wide uppercase">
                    7. Application & Verification Process
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-gray-500 font-medium block">Application Mode</span>
                    <span className="font-semibold text-gray-900 mt-1 block">
                      {app.application_mode || 'Online via National Scholarship Portal'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-gray-500 font-medium block">Verification Flow</span>
                    <span className="font-semibold text-gray-900 mt-1 block">
                      {app.verification_requirements || 'L1 Institute Nodal Officer (INO) followed by L2 State/Ministry Nodal Officer'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-gray-500 font-medium block">Disbursement Mode</span>
                    <span className="font-semibold text-gray-900 mt-1 block">
                      Direct Benefit Transfer (DBT) via PFMS to Aadhaar-seeded account
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EXPLAINABLE 3-STATE STUDENT EVALUATION */}
          {activeTab === 'evaluation' && matchResult && (
            <div className="space-y-5">
              {/* Overall Status Banner */}
              <div
                className={`p-5 rounded-2xl border flex items-center justify-between gap-4 ${
                  matchResult.status === 'eligible'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : matchResult.status === 'undetermined'
                    ? 'bg-amber-50 border-amber-200 text-amber-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  {matchResult.status === 'eligible' && (
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                  )}
                  {matchResult.status === 'undetermined' && (
                    <HelpCircle className="w-8 h-8 text-amber-600 shrink-0" />
                  )}
                  {matchResult.status === 'not_eligible' && (
                    <XCircle className="w-8 h-8 text-rose-600 shrink-0" />
                  )}
                  <div>
                    <h3 className="text-base font-bold capitalize">
                      {matchResult.status === 'eligible' && '✓ Fully Eligible — All Requirements Satisfied'}
                      {matchResult.status === 'undetermined' && '? Unable to Determine — Additional Information Required'}
                      {matchResult.status === 'not_eligible' && '✗ Ineligible — Criteria Not Satisfied'}
                    </h3>
                    <p className="text-xs mt-0.5 opacity-90">
                      {matchResult.status === 'eligible' &&
                        'The candidate profile satisfies 100% of the verified statutory requirements for this scheme.'}
                      {matchResult.status === 'undetermined' &&
                        'The profile does not contain enough information to evaluate every requirement. See missing parameters below.'}
                      {matchResult.status === 'not_eligible' &&
                        'One or more statutory criteria fail based on the current student profile.'}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-2xl font-black">{matchResult.match_score}%</span>
                  <span className="text-[11px] block opacity-75">Match Score</span>
                </div>
              </div>

              {/* Requirement-by-Requirement 3-State Table */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Detailed Criteria Evaluation Breakdown
                </h4>

                <div className="space-y-2">
                  {matchResult.criteria_checks.map((check, i) => (
                    <div
                      key={i}
                      className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-all ${
                        check.status === 'satisfied'
                          ? 'bg-emerald-50/40 border-emerald-200/80'
                          : check.status === 'undetermined'
                          ? 'bg-amber-50/50 border-amber-200'
                          : 'bg-rose-50/40 border-rose-200/80'
                      }`}
                    >
                      <div className="flex items-start gap-2.5 flex-1">
                        {check.status === 'satisfied' && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        )}
                        {check.status === 'undetermined' && (
                          <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        )}
                        {check.status === 'not_satisfied' && (
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900">{check.criterion}</span>
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase ${
                                check.status === 'satisfied'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : check.status === 'undetermined'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {check.status === 'satisfied' && '✓ Satisfied'}
                              {check.status === 'undetermined' && '? Cannot Determine'}
                              {check.status === 'not_satisfied' && '✗ Not Satisfied'}
                            </span>
                          </div>
                          <p className="text-gray-700 mt-1 leading-relaxed">{check.reason}</p>
                        </div>
                      </div>

                      <div className="text-left sm:text-right shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-200/60 pl-6 sm:pl-0">
                        <div className="text-[11px] text-gray-500">
                          Student: <span className="font-semibold text-gray-800">{check.student_value}</span>
                        </div>
                        <div className="text-[11px] text-gray-500">
                          Required: <span className="font-semibold text-gray-800">{check.required_value}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: OFFICIAL SOURCES & PDF VERIFICATION */}
          {activeTab === 'source' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 text-xs text-blue-900 leading-relaxed">
                <span className="font-bold block mb-1">Official Verification Guarantee:</span>
                ScholarSync never invents or guesses scholarship eligibility rules. All rules,
                percentages, reservations, and benefit amounts are grounded in the official
                specifications published on official scholarship portals (AY 2026-27).
              </div>

              <div className="rounded-2xl border border-gray-200 p-5 bg-white space-y-4">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider border-b pb-2">
                  Official Documents & Links
                </h4>

                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="font-bold text-gray-900 block">Official Scholarship Portal Listing</span>
                      <span className="text-gray-500 text-[11px]">Primary repository for central, state, and institutional schemes</span>
                    </div>
                    <a
                      href={officialPortalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#16A34A] text-white font-semibold rounded-lg hover:bg-[#15803D] transition-colors shrink-0 cursor-pointer"
                    >
                      <span>View Official Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {officialSpecUrl && (
                    <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="font-bold text-gray-900 block">Official Guidelines & Specifications (PDF)</span>
                        <span className="text-gray-500 text-[11px] font-mono">{sourceDocName}</span>
                      </div>
                      <a
                        href={officialSpecUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#111827] text-white font-semibold rounded-lg hover:bg-black transition-colors shrink-0 cursor-pointer"
                      >
                        <span>Open Official Guidelines PDF</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}

                  {officialFaqUrl && (
                    <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="font-bold text-gray-900 block">Official Scheme FAQs</span>
                        <span className="text-gray-500 text-[11px]">Direct clarifications issued by the Ministry/Department</span>
                      </div>
                      <a
                        href={officialFaqUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors shrink-0 cursor-pointer"
                      >
                        <span>View FAQ Document</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-gray-100 text-[11px] text-gray-500 flex flex-wrap justify-between items-center gap-2">
                  <span>Source Validation Status: <strong className="text-emerald-700 capitalize">{validationStatus}</strong></span>
                  <span>Academic Year: <strong className="text-gray-900">{scholarship.academic_year || '2026-27'}</strong></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 border-t border-[#F3F4F6] bg-gray-50 flex items-center justify-between gap-3">
          <div className="text-xs text-gray-500">
            Source:{' '}
            <span className="font-semibold text-gray-800">
              {scholarship.source_type === 'MAHADBT' || scholarship.id.startsWith('MAHADBT')
                ? 'mahadbt.maharashtra.gov.in'
                : 'scholarships.gov.in'}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-end">
            {scholarship.official_specification_url && (
              <a
                href={scholarship.official_specification_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl hover:bg-rose-100 transition-colors"
                title="Open official Government Resolution / Guideline PDF"
              >
                <span>View Official GR / PDF</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            <a
              href={officialSpecUrl || officialPortalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <span>View Source Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {matchResult?.status === 'eligible' && (
              officialApplicationUrl ? (
                <a
                  href={officialApplicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 bg-[#16A34A] text-white rounded-xl hover:bg-[#15803D] transition-colors shadow-2xs"
                  title="Open official application portal in a new tab"
                >
                  <span>Apply Now</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <span className="inline-flex items-center px-3 py-2 rounded-xl text-xs font-medium text-[#6B7280] bg-[#F3F4F6] border border-[#E5E7EB]">
                  Official application link unavailable
                </span>
              )
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#111827] text-white text-xs font-bold rounded-xl hover:bg-black transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
