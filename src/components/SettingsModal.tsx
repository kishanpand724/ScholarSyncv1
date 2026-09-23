import React from 'react';
import {
  X,
  RotateCcw,
  User,
  ShieldCheck,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { StudentProfile } from '../types/scholarship';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: StudentProfile;
  onResetDemo: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onResetDemo
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative w-full max-w-xl bg-white rounded-none shadow-xl border border-[#E5E7EB] overflow-hidden my-8 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 sm:p-7 border-b border-[#F3F4F6] flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#111827]">
              Profile &amp; Settings
            </h2>
            <p className="text-xs text-[#6B7280] mt-1">
              Manage your student profile data and preferences.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-none text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-7 space-y-6 overflow-y-auto max-h-[75vh]">
          {/* Active Profile Status */}
          <div className="p-5 rounded-none bg-emerald-50 border border-emerald-200 space-y-2">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-800" />
              <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider">
                Current Student Profile
              </span>
            </div>
            <div className="text-sm font-bold text-[#111827]">
              {currentProfile.name ? currentProfile.name : 'Profile not configured'}
            </div>
            <p className="text-xs text-emerald-900">
              {currentProfile.is_completed
                ? `${currentProfile.course || 'Course specified'} • ${currentProfile.academic_percentage || 0}% Marks • ${currentProfile.category || 'Category'} • ${currentProfile.state_domicile || 'State'}`
                : 'Complete your profile to find scholarships matching your eligibility.'}
            </p>
          </div>

          {/* Privacy and Local Storage Notice */}
          <div className="p-4.5 rounded-none bg-[#F9FAFB] border border-[#E5E7EB] space-y-2 text-xs">
            <div className="flex items-center gap-2 text-[#111827] font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-800" />
              <span>Data Privacy &amp; Storage</span>
            </div>
            <p className="text-[#6B7280] leading-relaxed">
              Your profile details are stored locally on your device and are used solely to match eligibility criteria and calculate scholarship combinations.
            </p>
          </div>

          {/* Reset Action */}
          <div className="pt-3 border-t border-[#F3F4F6] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#111827] block">
                Clear Profile Data
              </span>
              <span className="text-[11px] text-[#6B7280] mt-0.5 block">
                Reset your saved details to start fresh with a blank profile
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                onResetDemo();
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-none bg-white border border-[#FEE2E2] text-[#DC2626] hover:bg-[#FEF2F2] text-xs font-semibold transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Profile</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4.5 sm:p-5 bg-[#F9FAFB] border-t border-[#F3F4F6] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-semibold rounded-none text-[#374151] hover:text-[#111827] bg-white border border-[#E5E7EB] hover:border-[#D1D5DB] cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
