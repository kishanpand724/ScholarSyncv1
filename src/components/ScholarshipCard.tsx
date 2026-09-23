import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Award,
  HeartHandshake,
  FileText,
  FileCheck2,
  ShieldCheck,
  Check,
  AlertTriangle
} from 'lucide-react';
import { MatchResult, Scholarship } from '../types/scholarship';
import { formatINR } from '../services/eligibilityEngine';
import { crossReferenceDocuments } from '../services/documentChecklist';
import { getVerifiedOfficialApplicationUrl } from '../utils/scholarshipUrl';

interface ScholarshipCardProps {
  matchResult: MatchResult;
  onOpenDetails: (scholarship: Scholarship, matchResult?: MatchResult) => void;
  possessedDocuments?: string[];
  onToggleDocument?: (documentIdOrName: string) => void;
}

export const ScholarshipCard: React.FC<ScholarshipCardProps> = ({
  matchResult,
  onOpenDetails,
  possessedDocuments = [],
  onToggleDocument
}) => {
  const [showExplainability, setShowExplainability] = useState(false);
  const [showDocuments, setShowDocuments] = useState(false);
  const { scholarship, status, criteria_checks, rejection_reasons, missing_info_reasons } = matchResult;

  const isEligible = status === 'eligible';
  const isUndetermined = status === 'undetermined';

  const requiredDocs: string[] =
    scholarship.documents?.required_documents ||
    scholarship.required_documents ||
    [];

  const docCrossReference = crossReferenceDocuments(requiredDocs, possessedDocuments);

  const sourcePdfName =
    scholarship.source?.source_document_name ||
    'Official Scheme Guidelines.pdf';

  const sourcePdfUrl =
    scholarship.source?.source_url ||
    scholarship.source_url;

  // Official verified application portal URL
  const officialApplicationUrl = getVerifiedOfficialApplicationUrl(scholarship);

  return (
    <div
      className={`bg-white border rounded-2xl p-6 shadow-xs transition-all flex flex-col justify-between group ${
        isEligible
          ? 'border-[#E5E7EB] hover:border-[#16A34A] hover:shadow-sm'
          : isUndetermined
          ? 'border-amber-200/90 hover:border-amber-400 bg-amber-50/15'
          : 'border-[#E5E7EB] opacity-80 hover:opacity-100'
      }`}
    >
      <div>
        {/* Source Provenance & Official PDF Label */}
        <div className="flex items-center justify-between text-[11px] text-[#6B7280] pb-2.5 mb-3 border-b border-[#F3F4F6] gap-2">
          <div className="flex items-center gap-1.5 truncate">
            <span className="font-medium text-[#111827]">
              Source:{' '}
              {scholarship.source_type === 'MAHADBT' || scholarship.id.startsWith('MAHADBT') ? (
                <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  MahaDBT (Govt of Maharashtra)
                </span>
              ) : (
                <span className="text-blue-700 font-bold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                  NSP (Govt of India)
                </span>
              )}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {sourcePdfUrl && (
              <a
                href={sourcePdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 hover:bg-rose-100 text-[10px] font-semibold border border-rose-200 transition-colors"
                title={`Open official scheme PDF: ${sourcePdfName}`}
              >
                <FileText className="w-3 h-3 text-rose-600" />
                <span>{scholarship.official_specification_url ? 'GR / PDF' : 'PDF Guidelines'}</span>
              </a>
            )}
            <span className="px-2 py-0.5 rounded-full bg-[#F3F4F6] text-[#4B5563] font-mono text-[10px] font-bold">
              AY {scholarship.academic_year || '2026-27'}
            </span>
          </div>
        </div>

        {/* Header Row: Provider, Name & Status Badge */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <span className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider block">
              {scholarship.department || scholarship.provider}
            </span>
            <h3
              className={`text-base font-bold mt-0.5 leading-snug ${
                isEligible ? 'text-[#111827]' : isUndetermined ? 'text-gray-900' : 'text-[#4B5563]'
              }`}
            >
              {scholarship.name}
            </h3>
          </div>

          <div className="flex flex-col items-end gap-1 shrink-0">
            {isEligible && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#F0FDF4] text-[#16A34A] border border-[#DCFCE7]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>Eligible</span>
              </span>
            )}
            {isUndetermined && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>Needs Info</span>
              </span>
            )}
            {!isEligible && !isUndetermined && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#F3F4F6] text-[#4B5563] border border-[#E5E7EB]">
                <XCircle className="w-3.5 h-3.5 text-[#6B7280]" />
                <span>Not Eligible</span>
              </span>
            )}

            {scholarship.scheme_type === 'merit_based' ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#EFF6FF] text-[#1D4ED8] border border-[#DBEAFE]">
                <Award className="w-3 h-3" />
                <span>Merit-based</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#F5F3FF] text-[#6D28D9] border border-[#EDE9FE]">
                <HeartHandshake className="w-3 h-3" />
                <span>Welfare-based</span>
              </span>
            )}
          </div>
        </div>

        {/* Large Potential Benefit */}
        <div className="mt-4 mb-4 pb-4 border-b border-[#F3F4F6]">
          <div className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight">
            {formatINR(scholarship.benefit_amount)}
            <span className="text-xs font-normal text-[#6B7280] ml-1.5">
              potential benefit
            </span>
          </div>
          <span className="text-[11px] text-[#6B7280] capitalize mt-0.5 block">
            {scholarship.benefit_type.replace(/_/g, ' ')} • Deadline: {scholarship.deadline}
          </span>
        </div>

        {/* Requirements Overview */}
        <div className="space-y-1.5 text-xs text-[#4B5563] mb-3">
          <div className="flex items-center justify-between">
            <span className="text-[#6B7280]">Academic Cutoff:</span>
            <span className="font-semibold text-[#111827]">
              {scholarship.eligibility.minimum_percentage
                ? `Min ${scholarship.eligibility.minimum_percentage}%`
                : 'Approved Seat'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#6B7280]">Income Limit:</span>
            <span className="font-semibold text-[#111827]">
              {scholarship.eligibility.income_limit
                ? `Up to ${formatINR(scholarship.eligibility.income_limit)}`
                : 'No Income Cap'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#6B7280]">Category:</span>
            <span className="font-semibold text-[#111827] truncate max-w-[140px]">
              {scholarship.eligibility.category
                ? scholarship.eligibility.category.join(', ')
                : 'Open to All'}
            </span>
          </div>
        </div>

        {/* Real Required Documents Preview Bar with Cross-Referencing */}
        {requiredDocs.length > 0 && (
          <div className="mb-3.5">
            <button
              type="button"
              onClick={() => setShowDocuments(!showDocuments)}
              className={`w-full flex items-center justify-between p-2 rounded-xl border text-xs transition-colors cursor-pointer ${
                docCrossReference.isFullyReady
                  ? 'bg-emerald-50/70 hover:bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-blue-50/50 hover:bg-blue-50 border-blue-100 text-blue-900'
              }`}
            >
              <div className="flex items-center gap-1.5 font-semibold">
                <FileCheck2 className={`w-3.5 h-3.5 ${docCrossReference.isFullyReady ? 'text-emerald-600' : 'text-blue-600'}`} />
                <span>Documents ({docCrossReference.possessedCount}/{docCrossReference.totalRequired} Ready)</span>
                {docCrossReference.isFullyReady ? (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">All in Hand ✓</span>
                ) : (
                  <span className="text-[10px] text-amber-700 font-medium">({docCrossReference.missingCount} pending)</span>
                )}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-blue-700">
                <span>{showDocuments ? 'Hide' : 'Checklist'}</span>
                {showDocuments ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </div>
            </button>

            {showDocuments && (
              <div className="mt-2 p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] text-xs space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between text-[11px] font-bold text-gray-700 border-b border-gray-200 pb-1 mb-1">
                  <span>Cross-Referenced Requirements:</span>
                  <span className={`text-[10px] font-bold ${docCrossReference.isFullyReady ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {docCrossReference.readinessPercentage}% Readiness
                  </span>
                </div>
                <ul className="space-y-1.5">
                  {docCrossReference.checks.map((chk, idx) => (
                    <li
                      key={idx}
                      className="flex items-start justify-between gap-2 text-[11px] leading-snug p-1 rounded hover:bg-white transition-colors"
                    >
                      <div className="flex items-start gap-1.5 min-w-0">
                        {chk.isPossessed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        )}
                        <span className={chk.isPossessed ? 'text-gray-800 font-medium' : 'text-gray-600'}>
                          {chk.requiredName}
                        </span>
                      </div>

                      <div className="shrink-0 flex items-center gap-1">
                        {chk.isPossessed ? (
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            Possessed
                          </span>
                        ) : onToggleDocument ? (
                          <button
                            type="button"
                            onClick={() => onToggleDocument(chk.matchedPossessedId || chk.requiredName)}
                            className="text-[10px] font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-1.5 py-0.5 rounded border border-blue-200 cursor-pointer"
                          >
                            + Mark Possessed
                          </button>
                        ) : (
                          <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                            Missing
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Missing Info Warning Callout if Undetermined */}
        {isUndetermined && missing_info_reasons.length > 0 && (
          <div className="mb-4 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
            <span className="font-bold block text-[11px]">
              ? Unable to determine — additional information required:
            </span>
            <p className="text-[11px] text-amber-800 leading-snug line-clamp-2">
              {missing_info_reasons[0]}
            </p>
          </div>
        )}

        {/* Rejection Warning Callout if Ineligible */}
        {!isEligible && !isUndetermined && rejection_reasons.length > 0 && (
          <div className="mb-4 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-1">
            <span className="font-bold block text-[11px]">
              ✗ Primary ineligibility reason:
            </span>
            <p className="text-[11px] text-rose-800 leading-snug line-clamp-2">
              {rejection_reasons[0]}
            </p>
          </div>
        )}
      </div>

      {/* Card Footer & Action */}
      <div>
        <div className="pt-3.5 border-t border-[#F3F4F6] flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setShowExplainability(!showExplainability)}
            className="text-xs font-medium text-[#6B7280] hover:text-[#111827] flex items-center gap-1 transition-colors cursor-pointer"
          >
            {showExplainability ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                <span>Hide Audit</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                <span>Audit Checks ({matchResult.match_score}%)</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2 flex-wrap justify-end">
            {sourcePdfUrl && (
              <a
                href={sourcePdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-medium text-[#4B5563] hover:text-rose-600 transition-colors"
                title="View original scheme PDF document"
              >
                <span>Scheme PDF</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}

            <button
              type="button"
              onClick={() => onOpenDetails(scholarship, matchResult)}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                isEligible
                  ? 'text-[#111827] bg-[#F9FAFB] hover:bg-[#F3F4F6] border border-[#E5E7EB]'
                  : 'text-white bg-[#16A34A] hover:bg-[#15803D]'
              }`}
            >
              <span>Details & Documents</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {isEligible && (
              officialApplicationUrl ? (
                <a
                  href={officialApplicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-[#16A34A] hover:bg-[#15803D] shadow-xs hover:shadow transition-all"
                  title="Open official NSP scholarship application portal in a new tab"
                >
                  <span>Apply Now</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <span className="inline-flex items-center px-2 py-1 rounded-lg text-[10px] font-medium text-[#6B7280] bg-[#F3F4F6] border border-[#E5E7EB]">
                  Official application link unavailable
                </span>
              )
            )}
          </div>
        </div>

        {/* Explainable 3-State Audit Breakdown */}
        {showExplainability && (
          <div className="mt-3 pt-3 border-t border-[#F3F4F6] text-xs space-y-2">
            <span className="text-[11px] font-bold text-[#111827] block mb-1">
              Criteria Evaluation (Three-State Check):
            </span>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {criteria_checks.map((check, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-lg text-xs transition-colors border ${
                    check.status === 'satisfied'
                      ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                      : check.status === 'undetermined'
                      ? 'bg-amber-50 border-amber-200 text-amber-900'
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1.5 mb-0.5">
                    <div className="flex items-center gap-1.5 font-bold">
                      {check.status === 'satisfied' && (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>✓ Satisfied</span>
                        </>
                      )}
                      {check.status === 'undetermined' && (
                        <>
                          <HelpCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>? Cannot determine</span>
                        </>
                      )}
                      {check.status === 'not_satisfied' && (
                        <>
                          <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                          <span>✗ Not satisfied</span>
                        </>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-gray-500 truncate max-w-[120px]">
                      {check.criterion}
                    </span>
                  </div>
                  <p className="text-[11px] leading-tight opacity-90">{check.reason}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

