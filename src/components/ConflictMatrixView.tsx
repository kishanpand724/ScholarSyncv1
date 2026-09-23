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
    <div className="space-y-6">
      {/* Informational Callout */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center text-[#D97706] shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[#111827]">
                Statutory Conflict Verification Matrix
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#FEF2F2] text-[#991B1B] border border-[#FEE2E2]">
                {invalidCombinations.length} Combinations Blocked
              </span>
            </div>
            <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
              Under statutory scholarship stacking guidelines, holding concurrent conflicting awards (such as claiming duplicate 100% tuition fees or dual ministry merit grants) is prohibited. ScholarSync audits every possible combination across integrated portals and excludes violating sets.
            </p>
          </div>
        </div>
      </div>

      {/* Empty State if no conflicts */}
      {invalidCombinations.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-xs">
          <ShieldCheck className="w-10 h-10 text-[#16A34A] mx-auto mb-2" />
          <h4 className="text-sm font-bold text-[#111827]">
            No Conflicting Combinations
          </h4>
          <p className="text-xs text-[#6B7280] max-w-sm mx-auto mt-1">
            All evaluated combinations passed conflict verification without statutory violations.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {invalidCombinations.map((invalid, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FEF2F2] text-[#991B1B] border border-[#FEE2E2]">
                    Incompatible Stack
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-[#6B7280]">
                    {invalid.conflict_type.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Conflicting Pair display */}
                <div className="space-y-2 mb-4">
                  <div className="p-3 rounded-xl bg-[#F9FAFB] border border-[#F3F4F6]">
                    <span className="text-[10px] font-bold text-[#6B7280] uppercase block">
                      Scheme 1
                    </span>
                    <span className="text-xs font-bold text-[#111827] line-clamp-1 mt-0.5">
                      {invalid.conflicting_pair[0]}
                    </span>
                  </div>

                  <div className="text-center text-[11px] font-bold text-[#DC2626]">
                    + Incompatible with +
                  </div>

                  <div className="p-3 rounded-xl bg-[#F9FAFB] border border-[#F3F4F6]">
                    <span className="text-[10px] font-bold text-[#6B7280] uppercase block">
                      Scheme 2
                    </span>
                    <span className="text-xs font-bold text-[#111827] line-clamp-1 mt-0.5">
                      {invalid.conflicting_pair[1]}
                    </span>
                  </div>
                </div>

                {/* Specific Reason */}
                <div className="p-3 rounded-xl bg-[#FEF2F2]/60 border border-[#FEE2E2] text-xs">
                  <span className="font-bold text-[#991B1B] block mb-0.5">
                    Statutory Incompatibility Rule:
                  </span>
                  <p className="text-[#7F1D1D] leading-relaxed">
                    {invalid.reason}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#F3F4F6] text-[11px] text-[#6B7280] flex items-center justify-between">
                <span>Rule Engine Enforcement</span>
                <span className="text-[#16A34A] font-semibold">Excluded from Results</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
