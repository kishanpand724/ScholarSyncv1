import React from 'react';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  FileCheck,
  Building2,
  Award,
  HeartHandshake
} from 'lucide-react';
import { Scholarship, ValidCombination } from '../types/scholarship';
import { formatINR } from '../services/eligibilityEngine';

interface CombinationDetailModalProps {
  combination: ValidCombination | null;
  onClose: () => void;
  onOpenScholarship: (scholarship: Scholarship) => void;
}

export const CombinationDetailModal: React.FC<CombinationDetailModalProps> = ({
  combination,
  onClose,
  onOpenScholarship
}) => {
  if (!combination) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-[#E5E7EB] overflow-hidden my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-[#F3F4F6] flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#F0FDF4] text-[#16A34A] border border-[#DCFCE7]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Compatible Stacking</span>
              </span>
              <span className="text-xs text-[#6B7280]">
                {combination.count} Schemes Combined
              </span>
              <span className="text-xs font-mono font-medium text-[#4B5563] bg-[#F3F4F6] px-2 py-0.5 rounded">
                AY 2026-27
              </span>
            </div>

            <h2 className="text-xl font-bold text-[#111827]">
              Smart Combination Package
            </h2>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Pre-audited against statutory overlap, fee duplication, and NSP AY 2026-27 stacking guidelines.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Benefit Box */}
          <div className="p-5 rounded-2xl bg-[#F0FDF4] border border-[#DCFCE7] flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-[#15803D] uppercase tracking-wider block">
                Total Potential Combined Benefit
              </span>
              <div className="text-3xl font-bold text-[#111827] mt-1">
                {formatINR(combination.total_potential_benefit)}
                <span className="text-xs font-normal text-[#6B7280] ml-1.5">
                  / academic year
                </span>
              </div>
              <span className="text-xs text-[#15803D] mt-0.5 block font-medium">
                {combination.compatibility_status}
              </span>
            </div>
          </div>

          {/* Conflict Audit Certificate */}
          <div className="p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-2">
            <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
              NSP Statutory Conflict Audit Passed
            </h3>
            <div className="space-y-1.5 text-xs text-[#4B5563]">
              <div className="flex items-start gap-2">
                <span className="text-[#16A34A] font-bold">✓</span>
                <span><strong>NSP AY 2026-27 Combination Policy:</strong> Complies with maximum 1 Merit-based scheme plus 1 or more Welfare-based schemes.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#16A34A] font-bold">✓</span>
                <span><strong>No Standalone Exclusivity Breach:</strong> None of the selected schemes enforce single-award exclusivity bans.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#16A34A] font-bold">✓</span>
                <span><strong>Zero Tuition Fee Duplication:</strong> Distinct financial components (academic fee, maintenance, equipment).</span>
              </div>
            </div>
          </div>

          {/* Included Schemes */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider">
              Schemes in this Combination
            </h3>

            <div className="space-y-2">
              {combination.scholarships.map((s, idx) => (
                <div
                  key={s.id}
                  className="p-4 rounded-xl bg-[#F9FAFB] border border-[#F3F4F6] flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-[#111827] border border-[#E5E7EB]">
                        Scheme #{idx + 1}
                      </span>
                      <span className="text-xs text-[#6B7280]">
                        {s.classification}
                      </span>
                      {s.scheme_type === 'merit_based' ? (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[#1D4ED8] bg-[#EFF6FF] px-1.5 py-0.5 rounded">
                          <Award className="w-2.5 h-2.5" />
                          <span>Merit</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[#6D28D9] bg-[#F5F3FF] px-1.5 py-0.5 rounded">
                          <HeartHandshake className="w-2.5 h-2.5" />
                          <span>Welfare</span>
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-[#111827] truncate">
                      {s.name}
                    </h4>
                    <p className="text-xs text-[#6B7280]">
                      {s.provider} • <span className="capitalize">{s.benefit_type.replace(/_/g, ' ')}</span>
                    </p>
                  </div>

                  <div className="text-right shrink-0 flex flex-col items-end gap-1.5">
                    <span className="text-sm font-bold text-[#16A34A]">
                      +{formatINR(s.benefit_amount)}
                    </span>
                    <button
                      type="button"
                      onClick={() => onOpenScholarship(s)}
                      className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white border border-[#E5E7EB] text-[#374151] hover:text-[#111827] hover:border-[#D1D5DB] transition-all cursor-pointer"
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Unified Deduplicated Document Checklist */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center justify-between">
              <span>Required Application Documents ({combination.merged_documents.length})</span>
              <span className="text-[11px] font-normal text-[#6B7280]">Deduplicated</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {combination.merged_documents.map((doc, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-[#F9FAFB] border border-[#F3F4F6] text-xs text-[#374151] flex items-center gap-2"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                  <span className="truncate">{doc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 bg-[#F9FAFB] border-t border-[#F3F4F6] flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
