import React from 'react';
import { ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';
import { StudentProfile } from '../types/scholarship';

interface AuditPercentageCardProps {
  profileStatus: 'completed' | 'not_completed';
  validProfile: StudentProfile | null;
  auditPercentage: number | null;
  eligibleCount?: number;
  totalAnalyzed?: number;
  onCompleteProfile: () => void;
}

export const AuditPercentageCard: React.FC<AuditPercentageCardProps> = ({
  profileStatus,
  validProfile,
  auditPercentage,
  eligibleCount = 0,
  totalAnalyzed = 0,
  onCompleteProfile
}) => {
  // Source of truth: profileStatus === "completed" AND validProfile exists
  const isCompleted = profileStatus === 'completed' && Boolean(validProfile) && auditPercentage !== null;

  // RULE: No profile = NO audit percentage
  // When there is no valid submitted student profile:
  // - Audit Percentage must NOT be calculated.
  // - Do NOT show 0%, 50%, 75%, 100%, or any other percentage.
  // - Replace the audit percentage card with:
  //   "Profile not completed"
  //   "Complete your profile to run the eligibility audit."
  //   [Complete Profile]
  if (!isCompleted) {
    return (
      <div
        data-testid="audit-percentage-card"
        className="bg-white border border-[#E5E7EB] rounded-none p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6"
      >
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-11 h-11 rounded-none bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#111827]">
              Profile not completed
            </h3>
            <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
              Complete your profile to run the eligibility audit.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onCompleteProfile}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-none bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
        >
          <span>Complete Profile</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  // Only after user successfully submits a complete profile:
  // Calculate and display the Audit Percentage based ONLY on the actual submitted profile and real scholarship dataset.
  return (
    <div
      data-testid="audit-percentage-card"
      className="bg-white border border-[#E5E7EB] rounded-none p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-none bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 shrink-0">
          <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
        </div>
        <div>
          <span className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider block">
            Statutory Eligibility Engine
          </span>
          <h3 className="text-lg font-bold text-[#111827] mt-0.5">
            Audit Percentage
          </h3>
          <p className="text-xs text-[#6B7280] mt-1">
            Evaluated against official NSP AY 2026-27 statutory scholarship criteria.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 self-start sm:self-auto">
        <div className="text-left sm:text-right">
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-800 tracking-tight">
            {auditPercentage}%
          </div>
          <span className="text-xs text-[#6B7280] block mt-1 font-medium">
            {eligibleCount} of {totalAnalyzed} Schemes Fully Qualified
          </span>
        </div>
      </div>
    </div>
  );
};
