import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Ban,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { InvalidCombination } from '../types/scholarship';

interface ConflictMatrixViewProps {
  invalidCombinations: InvalidCombination[];
  validCount: number;
}

export const ConflictMatrixView: React.FC<ConflictMatrixViewProps> = ({
  invalidCombinations,
  validCount
}) => {
  return (
    <div className="space-y-8">
      {/* Informational Callout */}
      <div className="bg-white border border-[#E5E7EB] rounded-none p-6 sm:p-8 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-none bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center text-[#D97706] shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-base font-bold text-[#111827]">
                Incompatible Scholarship Pairs
              </h3>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-none bg-[#FEF2F2] text-[#991B1B] border border-[#FEE2E2]">
                {invalidCombinations.length} Combinations Blocked
              </span>
            </div>
            <p className="text-xs text-[#6B7280] mt-1.5 leading-relaxed">
              Government rules prohibit claiming duplicate benefits (such as two full tuition reimbursements or two central merit scholarships simultaneously). ScholarSync automatically filters out these incompatible pairs so you only apply for valid options.
            </p>
          </div>
        </div>
      </div>

      {/* Empty State if no conflicts */}
      {invalidCombinations.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-none border border-[#E5E7EB] p-8 shadow-xs">
          <ShieldCheck className="w-12 h-12 text-emerald-800 mx-auto mb-3" />
          <h4 className="text-base font-bold text-[#111827]">
            No Incompatible Combinations
          </h4>
          <p className="text-xs text-[#6B7280] max-w-sm mx-auto mt-1.5">
            All evaluated combinations are compatible with no overlapping restrictions.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {invalidCombinations.map((invalid, idx) => (
            <div
              key={idx}
              className="bg-white rounded-none border border-[#E5E7EB] p-6 sm:p-7 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-none bg-[#FEF2F2] text-[#991B1B] border border-[#FEE2E2]">
                    Cannot Combine
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-[#6B7280]">
                    {invalid.conflict_type.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Conflicting Pair display */}
                <div className="space-y-2.5 mb-5">
                  <div className="p-3.5 rounded-none bg-[#F9FAFB] border border-[#E5E7EB]">
                    <span className="text-[10px] font-bold text-[#6B7280] uppercase block">
                      Scholarship 1
                    </span>
                    <span className="text-xs font-bold text-[#111827] line-clamp-1 mt-1">
                      {invalid.conflicting_pair[0]}
                    </span>
                  </div>

                  <div className="text-center text-[11px] font-bold text-[#DC2626]">
                    + Cannot be availed with +
                  </div>

                  <div className="p-3.5 rounded-none bg-[#F9FAFB] border border-[#E5E7EB]">
                    <span className="text-[10px] font-bold text-[#6B7280] uppercase block">
                      Scholarship 2
                    </span>
                    <span className="text-xs font-bold text-[#111827] line-clamp-1 mt-1">
                      {invalid.conflicting_pair[1]}
                    </span>
                  </div>
                </div>

                {/* Specific Reason */}
                <div className="p-3.5 rounded-none bg-[#FEF2F2]/60 border border-[#FEE2E2] text-xs">
                  <span className="font-bold text-[#991B1B] block mb-1">
                    Reason for Incompatibility:
                  </span>
                  <p className="text-[#7F1D1D] leading-relaxed">
                    {invalid.reason}
                  </p>
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-[#F3F4F6] text-[11px] text-[#6B7280] flex items-center justify-between">
                <span>Conflict Protection</span>
                <span className="text-emerald-800 font-semibold">Excluded from Results</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
