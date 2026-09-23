import React from 'react';
import {
  GraduationCap,
  Award,
  Wallet,
  MapPin,
  User,
  ShieldCheck,
  Edit3,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { StudentProfile } from '../types/scholarship';
import { formatINR } from '../services/eligibilityEngine';

interface ProfileCardProps {
  profile: StudentProfile;
  profileStatus?: 'completed' | 'not_completed';
  isProfileCompleted?: boolean;
  onEditProfile: () => void;
  onResetProfile?: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  profileStatus,
  isProfileCompleted,
  onEditProfile,
  onResetProfile
}) => {
  // Source of truth: profileStatus === "completed" AND validProfile exists
  const isConfigured = Boolean(
    (profileStatus === 'completed' || isProfileCompleted) &&
    profile.is_completed &&
    profile.name?.trim() &&
    profile.academic_percentage > 0
  );

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-none p-6 sm:p-8 shadow-xs">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F3F4F6]">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-none border ${
                isConfigured
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              {isConfigured ? 'Active Student Profile' : 'Setup Required'}
            </span>
            <span className="text-xs text-[#6B7280]">
              Official NSP Eligibility Engine
            </span>
          </div>
          <h2 className="text-lg font-bold text-[#111827] mt-2 flex items-center gap-2">
            {profile.name || 'Candidate Profile'}
            {profile.course && (
              <span className="text-xs font-normal text-[#6B7280]">
                • {profile.course} {profile.branch ? `(${profile.branch.split('(')[1]?.replace(')', '') || profile.branch})` : ''}
              </span>
            )}
          </h2>
          {profile.year_of_study && (
            <p className="text-xs text-emerald-800 font-semibold mt-1">
              {profile.year_of_study} • {profile.current_semester || 'Semester 1'}
              {profile.total_semesters ? ` (Total ${profile.total_semesters} Semesters / ${profile.duration_years || 4} Years)` : ''}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 flex-wrap self-start sm:self-auto">
          {onResetProfile && (
            <button
              type="button"
              onClick={onResetProfile}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-none text-xs font-semibold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100/70 border border-rose-200 transition-all cursor-pointer"
              title="Clear current details and start fresh"
            >
              <span>Clear Profile</span>
            </button>
          )}

          <button
            type="button"
            onClick={onEditProfile}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-none text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 transition-all cursor-pointer shadow-xs"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Grid of Compact Information Rows / Chips */}
      {isConfigured ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          {/* Academic Percentage */}
          <div className="p-4 rounded-none bg-[#F9FAFB] border border-[#E5E7EB]">
            <span className="text-[11px] font-medium text-[#6B7280] block">
              Academic Score
            </span>
            <span className="text-sm font-bold text-[#111827] mt-1 block">
              {profile.academic_percentage}%
              {profile.cgpa ? (
                <span className="text-xs font-normal text-[#6B7280] ml-1">
                  ({profile.cgpa} CGPA)
                </span>
              ) : null}
            </span>
          </div>

          {/* Annual Family Income */}
          <div className="p-4 rounded-none bg-[#F9FAFB] border border-[#E5E7EB]">
            <span className="text-[11px] font-medium text-[#6B7280] block">
              Family Income
            </span>
            <span className="text-sm font-bold text-[#111827] mt-1 block">
              {formatINR(profile.annual_family_income)}
              <span className="text-[10px] font-normal text-[#6B7280] ml-0.5">/yr</span>
            </span>
          </div>

          {/* Social Category */}
          <div className="p-4 rounded-none bg-[#F9FAFB] border border-[#E5E7EB]">
            <span className="text-[11px] font-medium text-[#6B7280] block">
              Category
            </span>
            <span className="text-sm font-bold text-[#111827] mt-1 block">
              {profile.category}
            </span>
          </div>

          {/* Domicile State */}
          <div className="p-4 rounded-none bg-[#F9FAFB] border border-[#E5E7EB]">
            <span className="text-[11px] font-medium text-[#6B7280] block">
              Domicile State
            </span>
            <span className="text-sm font-bold text-[#111827] mt-1 block truncate">
              {profile.state_domicile || 'All India'}
            </span>
          </div>
        </div>
      ) : (
        <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#6B7280]">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-[#111827]">Profile not completed</h4>
              <p className="text-xs text-[#6B7280] mt-0.5">
                Complete your profile to run the eligibility audit.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onEditProfile}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-none text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 transition-all cursor-pointer shadow-xs self-start sm:self-auto shrink-0"
          >
            Complete Profile
          </button>
        </div>
      )}
    </div>
  );
};
