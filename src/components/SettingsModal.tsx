import React from 'react';
import {
  X,
  RotateCcw,
  Server,
  Layers,
  ShieldCheck,
  CheckCircle2
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
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-xl border border-[#E5E7EB] overflow-hidden my-8 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#F3F4F6] flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#111827]">
              System Preferences
            </h2>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Engine status, multi-portal verification, and profile management.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          {/* Active Profile Status */}
          <div className="p-4 rounded-xl bg-[#F0FDF4] border border-[#DCFCE7] space-y-1">
            <span className="text-[11px] font-bold text-[#166534] uppercase tracking-wider block">
              Active Profile Status
            </span>
            <div className="text-sm font-bold text-[#111827]">
              {currentProfile.name ? currentProfile.name : 'Candidate Profile (Pending Setup)'}
            </div>
            <p className="text-xs text-[#166534]">
              {currentProfile.academic_percentage > 0
                ? `${currentProfile.course} • ${currentProfile.academic_percentage}% Marks • ${currentProfile.category} • ${currentProfile.state_domicile}`
                : 'Configure your profile in the Student Profile Setup tab.'}
            </p>
          </div>

          {/* Engine & Architecture Info */}
          <div className="p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-3">
            <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-1.5">
              <Server className="w-4 h-4 text-[#16A34A]" />
              System Architecture & Multi-Portal Pipeline
            </h3>
            <div className="space-y-2 text-xs text-[#4B5563]">
              <div className="flex justify-between items-center py-1 border-b border-[#F3F4F6]">
                <span className="text-[#6B7280]">Eligibility Engine:</span>
                <span className="font-semibold text-[#111827]">8-Gate Deterministic Rule Engine</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#F3F4F6]">
                <span className="text-[#6B7280]">Combination Engine:</span>
                <span className="font-semibold text-[#111827]">Statutory Stacking & Conflict Matrix</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#F3F4F6]">
                <span className="text-[#6B7280]">Portal Integration:</span>
                <span className="font-semibold text-[#111827]">Multi-Portal Directory Extensible</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-[#6B7280]">Decision Type:</span>
                <span className="font-semibold text-[#16A34A]">Explainable 3-State (Pass/Fail/Info-Needed)</span>
              </div>
            </div>
          </div>

          {/* Reset Action */}
          <div className="pt-2 border-t border-[#F3F4F6] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#111827] block">
                Reset Profile Form
              </span>
              <span className="text-[11px] text-[#6B7280]">
                Clear entered inputs to start with a blank student profile
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                onResetDemo();
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#FEE2E2] text-[#DC2626] hover:bg-[#FEF2F2] text-xs font-semibold transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Profile</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F9FAFB] border-t border-[#F3F4F6] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl text-[#374151] hover:text-[#111827] cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
