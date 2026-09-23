import React from 'react';
import {
  GraduationCap,
  Award,
  Building,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BookOpen
} from 'lucide-react';
import { StudentProfile } from '../types/scholarship';
import { getSemestersForYear } from '../config/academicCourses';

interface AcademicPerformanceFieldsProps {
  formData: StudentProfile;
  updateField: <K extends keyof StudentProfile>(field: K, value: StudentProfile[K]) => void;
  updateProfile: (patch: Partial<StudentProfile>) => void;
  handlePercentageChange: (pct: number) => void;
  handleYearChange: (yearId: string) => void;
}

const BOARD_OPTIONS = [
  'Maharashtra State Board (MSBSHSE)',
  'CBSE (Central Board of Secondary Education)',
  'CISCE (ICSE / ISC)',
  'UP Board (UPMSP)',
  'Karnataka State Board',
  'Tamil Nadu State Board',
  'Telangana / Andhra Pradesh Board',
  'Bihar School Examination Board',
  'West Bengal Board',
  'Rajasthan Board',
  'National Institute of Open Schooling (NIOS)',
  'Other Recognized State / Central Board'
];

const EXAM_OPTIONS = [
  'MHT-CET (Maharashtra Common Entrance Test)',
  'JEE Main (Joint Entrance Examination)',
  'JEE Advanced',
  'COMEDK UGET',
  'WBJEE',
  'KCET',
  'GUJCET',
  'Other State / National Entrance Exam'
];

export const AcademicPerformanceFields: React.FC<AcademicPerformanceFieldsProps> = ({
  formData,
  updateField,
  updateProfile,
  handlePercentageChange,
  handleYearChange
}) => {
  const courseName = formData.course || 'B.Tech / B.E.';
  const lowerCourse = courseName.toLowerCase();
  const level = formData.education_level || 'Undergraduate';

  const isBTech =
    lowerCourse.includes('b.tech') ||
    lowerCourse.includes('b.e') ||
    lowerCourse.includes('engineering') ||
    lowerCourse.includes('technology');

  const isPG =
    level === 'Postgraduate' ||
    level === 'Doctoral' ||
    lowerCourse.includes('m.tech') ||
    lowerCourse.includes('mba') ||
    lowerCourse.includes('m.sc') ||
    lowerCourse.includes('m.com') ||
    lowerCourse.includes('m.a');

  const isDiploma =
    level === 'Diploma' ||
    lowerCourse.includes('diploma') ||
    lowerCourse.includes('polytechnic');

  const isClass10 =
    level === 'School' ||
    lowerCourse.includes('secondary') ||
    lowerCourse.includes('class 10') ||
    lowerCourse.includes('class 9') ||
    formData.year_of_study === '10th Standard' ||
    formData.year_of_study === '9th Standard';

  const isClass12 =
    level === 'Higher Secondary' ||
    lowerCourse.includes('higher secondary') ||
    lowerCourse.includes('class 11') ||
    lowerCourse.includes('class 12') ||
    formData.year_of_study === '11th Standard' ||
    formData.year_of_study === '12th Standard';

  const isGeneralUG =
    !isBTech && !isPG && !isDiploma && !isClass10 && !isClass12;

  // Compute effective qualifying score dynamically (NO hardcoded 75%)
  const computeQualifyingScore = (): { score: number; label: string } => {
    if (isClass10) {
      const s = formData.tenth_percentage || formData.academic_percentage || 0;
      return { score: s, label: 'Secondary / Pre-Matric Qualifying Percentage' };
    }
    if (isClass12) {
      if (formData.year_of_study === '11th Standard' || !formData.twelfth_percentage) {
        const s = formData.tenth_percentage || formData.academic_percentage || 0;
        return { score: s, label: '10th Board (Qualifying for Class 11)' };
      }
      const s = formData.twelfth_percentage || formData.academic_percentage || 0;
      return { score: s, label: '12th / Intermediate Percentage' };
    }
    if (isDiploma) {
      if (formData.year_of_study === '1st Year' || !formData.previous_semester_score) {
        const s = formData.tenth_percentage || formData.diploma_percentage || formData.academic_percentage || 0;
        return { score: s, label: '10th Board SSC (Qualifying for Diploma)' };
      }
      const s = formData.previous_semester_score || (formData.cgpa ? Number((formData.cgpa * 9.5).toFixed(2)) : formData.academic_percentage) || 0;
      return { score: s, label: 'Previous Diploma Semester Score' };
    }
    if (isPG) {
      if (formData.year_of_study === '1st Year' || !formData.previous_semester_score) {
        const s = formData.ug_percentage || formData.academic_percentage || 0;
        return { score: s, label: 'Undergraduate Aggregate Percentage' };
      }
      const s = formData.previous_semester_score || (formData.cgpa ? Number((formData.cgpa * 9.5).toFixed(2)) : formData.academic_percentage) || 0;
      return { score: s, label: 'PG Previous Semester Score' };
    }
    if (formData.year_of_study === '1st Year') {
      const s = formData.entry_pathway === 'Diploma'
        ? (formData.diploma_percentage || formData.academic_percentage || 0)
        : (formData.twelfth_percentage || formData.academic_percentage || 0);
      return { score: s, label: formData.entry_pathway === 'Diploma' ? 'Diploma Aggregate Percentage' : '12th Board Percentage' };
    }
    const converted = formData.cgpa && formData.cgpa > 0 ? Number((formData.cgpa * 9.5).toFixed(2)) : 0;
    const s = formData.previous_semester_score || converted || formData.academic_percentage || formData.twelfth_percentage || 0;
    return { score: s, label: 'Previous Semester Score / Cumulative CGPA' };
  };

  const { score: activeScore, label: scoreLabel } = computeQualifyingScore();

  // 1. CLASS 10 (Secondary / Pre-Matric)
  if (isClass10) {
    return (
      <div className="space-y-6 text-xs">
        <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-4">
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[#16A34A]" />
            Secondary School (Class 9 - 10) Academic Performance
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#374151] mb-1.5">
                Current Class <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.year_of_study || '10th Standard'}
                onChange={(e) => handleYearChange(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
              >
                <option value="9th Standard">Class 9 (Pre-Matric)</option>
                <option value="10th Standard">Class 10 (Secondary Board Exam)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#374151] mb-1.5">
                School Board <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.tenth_board || 'Maharashtra State Board (MSBSHSE)'}
                onChange={(e) => updateField('tenth_board', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
              >
                {BOARD_OPTIONS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#374151] mb-1.5">
                Previous Class / Term Percentage (%) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                placeholder="e.g. 82.5"
                value={formData.tenth_percentage === 0 ? '' : (formData.tenth_percentage ?? '')}
                onChange={(e) => {
                  const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                  const clamped = isNaN(val) ? 0 : val;
                  updateField('tenth_percentage', clamped);
                  handlePercentageChange(clamped);
                }}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#374151] mb-1.5">
                Passing / Target Year
              </label>
              <input
                type="number"
                min="2020"
                max="2030"
                value={formData.admission_year || 2026}
                onChange={(e) => updateField('admission_year', parseInt(e.target.value, 10) || 2026)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-[#374151] mb-1.5">
                Roll / Seat Number (if allocated)
              </label>
              <input
                type="text"
                placeholder="e.g. R984120"
                value={formData.tenth_roll_number || ''}
                onChange={(e) => updateField('tenth_roll_number', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Score Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#F0FDF4] border border-[#DCFCE7]">
          <div>
            <span className="text-xs font-semibold text-[#15803D] block">
              {scoreLabel}:
            </span>
            <span className="text-2xl font-black text-[#16A34A]">
              {activeScore > 0 ? `${activeScore}%` : 'Not entered'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 2. CLASS 12 (Higher Secondary / Intermediate / Junior College)
  if (isClass12) {
    return (
      <div className="space-y-6 text-xs">
        {/* 10th Qualifying Details */}
        <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-4">
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[#16A34A]" />
            1. Qualifying Class 10 (Secondary) Board Details
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-[#374151] mb-1.5">
                10th Board <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.tenth_board || 'Maharashtra State Board (MSBSHSE)'}
                onChange={(e) => updateField('tenth_board', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
              >
                {BOARD_OPTIONS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#374151] mb-1.5">
                10th Percentage (%) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                placeholder="e.g. 84.5"
                value={formData.tenth_percentage === 0 ? '' : (formData.tenth_percentage ?? '')}
                onChange={(e) => {
                  const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                  updateField('tenth_percentage', isNaN(val) ? 0 : val);
                }}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#374151] mb-1.5">
                10th Passing Year
              </label>
              <input
                type="number"
                min="2018"
                max="2026"
                value={formData.admission_year ? formData.admission_year - 2 : 2024}
                onChange={(e) => updateField('admission_year', (parseInt(e.target.value, 10) || 2024) + 2)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
              />
            </div>
          </div>
        </div>

        {/* 12th / Current Class Details */}
        <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-4">
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#16A34A]" />
            2. Current Class 11 / 12 (Higher Secondary) Details
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#374151] mb-1.5">
                Current Class <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.year_of_study || '12th Standard'}
                onChange={(e) => handleYearChange(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
              >
                <option value="11th Standard">Class 11 (Junior College 1st Year)</option>
                <option value="12th Standard">Class 12 (HSC / Board Examination)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#374151] mb-1.5">
                12th Board <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.twelfth_board || 'Maharashtra State Board (MSBSHSE)'}
                onChange={(e) => updateField('twelfth_board', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
              >
                {BOARD_OPTIONS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#374151] mb-1.5">
                {formData.year_of_study === '11th Standard' ? 'Class 10 / 11 Term Percentage (%)' : '12th / Board Exam Percentage (%)'} <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                placeholder="e.g. 78.4"
                value={formData.twelfth_percentage === 0 ? '' : (formData.twelfth_percentage ?? '')}
                onChange={(e) => {
                  const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                  const clamped = isNaN(val) ? 0 : val;
                  updateField('twelfth_percentage', clamped);
                  handlePercentageChange(clamped);
                }}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#374151] mb-1.5">
                12th Roll / Seat Number (if issued)
              </label>
              <input
                type="text"
                placeholder="e.g. M1204892"
                value={formData.twelfth_roll_number || ''}
                onChange={(e) => updateField('twelfth_roll_number', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
              />
            </div>
          </div>

          {/* Top 20th Percentile Toggle for CSSS */}
          <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 flex items-center justify-between">
            <div>
              <span className="font-semibold text-gray-900 block">
                Top 20th Percentile in Class 12 Board Exam?
              </span>
              <span className="text-[10px] text-gray-500">
                Mandatory for Central Sector Scheme of Scholarship (CSSS) quota cutoff
              </span>
            </div>
            <button
              type="button"
              onClick={() => updateField('board_percentile_80th', !formData.board_percentile_80th)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                formData.board_percentile_80th
                  ? 'bg-[#16A34A] text-white shadow-xs'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {formData.board_percentile_80th ? 'YES (In Top 20%)' : 'NO'}
            </button>
          </div>
        </div>

        {/* Dynamic Score Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#F0FDF4] border border-[#DCFCE7]">
          <div>
            <span className="text-xs font-semibold text-[#15803D] block">
              {scoreLabel}:
            </span>
            <span className="text-2xl font-black text-[#16A34A]">
              {activeScore > 0 ? `${activeScore}%` : 'Not entered'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 3. DIPLOMA / POLYTECHNIC
  if (isDiploma) {
    const diplomaSemesters = getSemestersForYear('Diploma', formData.year_of_study || '1st Year');

    return (
      <div className="space-y-6 text-xs">
        {/* 10th Qualifying Details */}
        <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-4">
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[#16A34A]" />
            1. Qualifying Class 10th (SSC) Details for Polytechnic
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-[#374151] mb-1.5">
                10th Board <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.tenth_board || 'Maharashtra State Board (MSBSHSE)'}
                onChange={(e) => updateField('tenth_board', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
              >
                {BOARD_OPTIONS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#374151] mb-1.5">
                10th Percentage (%) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                placeholder="e.g. 82.5"
                value={formData.tenth_percentage === 0 ? '' : (formData.tenth_percentage ?? '')}
                onChange={(e) => {
                  const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                  const clamped = isNaN(val) ? 0 : val;
                  updateField('tenth_percentage', clamped);
                  if (formData.year_of_study === '1st Year') {
                    handlePercentageChange(clamped);
                  }
                }}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#374151] mb-1.5">
                10th Roll / Seat Number
              </label>
              <input
                type="text"
                placeholder="e.g. A928371"
                value={formData.tenth_roll_number || ''}
                onChange={(e) => updateField('tenth_roll_number', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
              />
            </div>
          </div>
        </div>

        {/* Diploma Year, Semester & Continuous Evaluation */}
        <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-4">
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <Building className="w-4 h-4 text-[#16A34A]" />
            2. Current Diploma Year, Semester & Performance
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#374151] mb-1.5">
                Current Diploma Year <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.year_of_study || '1st Year'}
                onChange={(e) => handleYearChange(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
              >
                <option value="1st Year">1st Year (Fresh Admission)</option>
                <option value="2nd Year">2nd Year (Lateral / Second)</option>
                <option value="3rd Year">3rd Year (Final Year)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#374151] mb-1.5">
                Current Semester <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.current_semester || diplomaSemesters[0] || 'Semester 1'}
                onChange={(e) => updateField('current_semester', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
              >
                {diplomaSemesters.map((sem) => (
                  <option key={sem} value={sem}>{sem}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#374151] mb-1.5">
                Previous Semester / Year Score (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                placeholder="e.g. 76.5"
                value={formData.previous_semester_score === 0 ? '' : (formData.previous_semester_score ?? '')}
                onChange={(e) => {
                  const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                  const clamped = isNaN(val) ? 0 : val;
                  updateField('previous_semester_score', clamped);
                  if (formData.year_of_study !== '1st Year') {
                    handlePercentageChange(clamped);
                  }
                }}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#374151] mb-1.5">
                Cumulative CGPA (out of 10)
              </label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.01"
                placeholder="e.g. 8.0"
                value={formData.cgpa === 0 ? '' : (formData.cgpa ?? '')}
                onChange={(e) => {
                  const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                  const clamped = isNaN(val) ? 0 : val;
                  updateProfile({
                    cgpa: clamped,
                    academic_percentage: clamped > 0 ? Number((clamped * 9.5).toFixed(2)) : formData.academic_percentage
                  });
                }}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
              />
            </div>

            {/* Backlogs */}
            <div className="sm:col-span-2 p-3.5 rounded-xl border border-gray-200 bg-white flex items-center justify-between">
              <div>
                <span className="font-semibold text-gray-900 block">Active Backlogs / ATKT</span>
                <span className="text-[10px] text-gray-500">Government schemes require regular clear pass</span>
              </div>
              <button
                type="button"
                onClick={() => updateProfile({ has_backlogs: !formData.has_backlogs, backlogs_count: formData.has_backlogs ? 0 : 1 })}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  formData.has_backlogs
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-[#16A34A] text-white shadow-xs'
                }`}
              >
                {formData.has_backlogs ? 'Has Active Backlogs' : 'No Backlogs (0)'}
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Score Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#F0FDF4] border border-[#DCFCE7]">
          <div>
            <span className="text-xs font-semibold text-[#15803D] block">
              {scoreLabel}:
            </span>
            <span className="text-2xl font-black text-[#16A34A]">
              {activeScore > 0 ? `${activeScore}%` : 'Not entered'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 4. POSTGRADUATE (M.Tech, MBA, M.Sc, M.Com, M.A., etc.)
  if (isPG) {
    const pgSemesters = getSemestersForYear(formData.course || 'M.Tech', formData.year_of_study || '1st Year');

    return (
      <div className="space-y-6 text-xs">
        {/* Undergraduate Qualifying Degree */}
        <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-4">
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[#16A34A]" />
            1. Undergraduate Qualifying Degree (UGC PG Merit Criteria)
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#374151] mb-1.5">
                Undergraduate Degree Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. B.Tech (Computer Science) / B.Sc / B.Com"
                value={formData.ug_degree_name || ''}
                onChange={(e) => updateField('ug_degree_name', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#374151] mb-1.5">
                Undergraduate Aggregate Percentage (%) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                placeholder="e.g. 74.5"
                value={formData.ug_percentage === 0 ? '' : (formData.ug_percentage ?? '')}
                onChange={(e) => {
                  const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                  const clamped = isNaN(val) ? 0 : val;
                  updateField('ug_percentage', clamped);
                  if (formData.year_of_study === '1st Year') {
                    handlePercentageChange(clamped);
                  }
                }}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
              />
            </div>
          </div>
        </div>

        {/* PG Standing, Semesters & Score */}
        <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-4">
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <Building className="w-4 h-4 text-[#16A34A]" />
            2. Current Postgraduate Standing & Evaluation
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#374151] mb-1.5">
                Current PG Year of Study <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.year_of_study || '1st Year'}
                onChange={(e) => handleYearChange(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
              >
                <option value="1st Year">1st Year (Fresh Admission)</option>
                <option value="2nd Year">2nd Year (Final Year)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#374151] mb-1.5">
                Current Semester <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.current_semester || pgSemesters[0] || 'Semester 1'}
                onChange={(e) => updateField('current_semester', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
              >
                {pgSemesters.map((sem) => (
                  <option key={sem} value={sem}>{sem}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#374151] mb-1.5">
                Previous Semester Score (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                placeholder="e.g. 78.0"
                value={formData.previous_semester_score === 0 ? '' : (formData.previous_semester_score ?? '')}
                onChange={(e) => {
                  const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                  const clamped = isNaN(val) ? 0 : val;
                  updateField('previous_semester_score', clamped);
                  if (formData.year_of_study !== '1st Year') {
                    handlePercentageChange(clamped);
                  }
                }}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#374151] mb-1.5">
                Current Cumulative CGPA (out of 10)
              </label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.01"
                placeholder="e.g. 8.4"
                value={formData.cgpa === 0 ? '' : (formData.cgpa ?? '')}
                onChange={(e) => {
                  const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                  const clamped = isNaN(val) ? 0 : val;
                  updateProfile({
                    cgpa: clamped,
                    academic_percentage: clamped > 0 ? Number((clamped * 9.5).toFixed(2)) : formData.academic_percentage
                  });
                }}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Score Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#F0FDF4] border border-[#DCFCE7]">
          <div>
            <span className="text-xs font-semibold text-[#15803D] block">
              {scoreLabel}:
            </span>
            <span className="text-2xl font-black text-[#16A34A]">
              {activeScore > 0 ? `${activeScore}%` : 'Not entered'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 5. B.TECH / B.E. (Engineering Degree - Exact specifications for Task 2)
  if (isBTech) {
    const btechSemesters = getSemestersForYear(formData.course || 'B.Tech / B.E.', formData.year_of_study || '1st Year');

    return (
      <div className="space-y-6 text-xs">
        {/* Block 1: 10th & 12th Details */}
        <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-4">
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[#16A34A]" />
            1. Secondary (10th) & Higher Secondary (12th) Board Details
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#374151] mb-1.5">
                10th Board <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.tenth_board || 'Maharashtra State Board (MSBSHSE)'}
                onChange={(e) => updateField('tenth_board', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
              >
                {BOARD_OPTIONS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#374151] mb-1.5">
                10th Percentage (%) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                placeholder="e.g. 85.6"
                value={formData.tenth_percentage === 0 ? '' : (formData.tenth_percentage ?? '')}
                onChange={(e) => {
                  const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                  updateField('tenth_percentage', isNaN(val) ? 0 : val);
                }}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#374151] mb-1.5">
                12th Board <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.twelfth_board || 'Maharashtra State Board (MSBSHSE)'}
                onChange={(e) => updateField('twelfth_board', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
              >
                {BOARD_OPTIONS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#374151] mb-1.5">
                12th Percentage (%) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                placeholder="e.g. 78.4"
                value={formData.twelfth_percentage === 0 ? '' : (formData.twelfth_percentage ?? '')}
                onChange={(e) => {
                  const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                  const clamped = isNaN(val) ? 0 : val;
                  updateField('twelfth_percentage', clamped);
                  if (formData.year_of_study === '1st Year') {
                    handlePercentageChange(clamped);
                  }
                }}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-[#374151] mb-1.5">
                12th Roll / Seat Number
              </label>
              <input
                type="text"
                placeholder="e.g. M1204892"
                value={formData.twelfth_roll_number || ''}
                onChange={(e) => updateField('twelfth_roll_number', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
              />
            </div>
          </div>

          {/* Top 20th Percentile Toggle */}
          <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 flex items-center justify-between">
            <div>
              <span className="font-semibold text-gray-900 block">
                Top 20th Percentile in Class 12 Board Exam?
              </span>
              <span className="text-[10px] text-gray-500">
                Mandatory for Central Sector Scheme of Scholarship (CSSS) quota cutoff
              </span>
            </div>
            <button
              type="button"
              onClick={() => updateField('board_percentile_80th', !formData.board_percentile_80th)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                formData.board_percentile_80th
                  ? 'bg-[#16A34A] text-white shadow-xs'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {formData.board_percentile_80th ? 'YES (In Top 20%)' : 'NO'}
            </button>
          </div>
        </div>

        {/* Block 2: Entrance / Competitive Examination */}
        <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-[#16A34A]" />
              2. Entrance / Competitive Examination
            </h4>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-600">Appeared in Entrance Exam:</span>
              <button
                type="button"
                onClick={() => updateField('competitive_exam_taken', !formData.competitive_exam_taken)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  formData.competitive_exam_taken
                    ? 'bg-[#16A34A] text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {formData.competitive_exam_taken ? 'YES' : 'NO'}
              </button>
            </div>
          </div>

          {formData.competitive_exam_taken && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-200">
              <div>
                <label className="block font-semibold text-[#374151] mb-1.5">
                  Exam Name (MHT-CET / JEE / etc.)
                </label>
                <select
                  value={formData.competitive_exam_name || 'MHT-CET (Maharashtra Common Entrance Test)'}
                  onChange={(e) => updateField('competitive_exam_name', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
                >
                  {EXAM_OPTIONS.map((ex) => (
                    <option key={ex} value={ex}>{ex}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#374151] mb-1.5">
                  Exam Year
                </label>
                <input
                  type="number"
                  min="2020"
                  max="2030"
                  placeholder="e.g. 2024"
                  value={formData.competitive_exam_year || 2024}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    updateField('competitive_exam_year', isNaN(val) ? 2024 : val);
                  }}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#374151] mb-1.5">
                  Exam Conducted By
                </label>
                <input
                  type="text"
                  placeholder="e.g. State Common Entrance Test Cell, Maharashtra"
                  value={formData.competitive_exam_conducted_by || ''}
                  onChange={(e) => updateField('competitive_exam_conducted_by', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#374151] mb-1.5">
                  Competitive Exam Roll Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. 24201994"
                  value={formData.competitive_exam_roll || ''}
                  onChange={(e) => updateField('competitive_exam_roll', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-[#374151] mb-1.5">
                  Entrance Exam Score / Percentile
                </label>
                <input
                  type="text"
                  placeholder="e.g. 96.48 Percentile / 142 Marks"
                  value={formData.competitive_exam_score || ''}
                  onChange={(e) => updateField('competitive_exam_score', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Block 3: Engineering Standing, Semesters & Backlogs */}
        <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-4">
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <Building className="w-4 h-4 text-[#16A34A]" />
            3. Engineering Year, Semester & Continuous Evaluation
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#374151] mb-1.5">
                Current Year of Study <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.year_of_study || '1st Year'}
                onChange={(e) => handleYearChange(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
              >
                <option value="1st Year">1st Year (Semester 1 / 2)</option>
                <option value="2nd Year">2nd Year (Semester 3 / 4)</option>
                <option value="3rd Year">3rd Year (Semester 5 / 6)</option>
                <option value="4th Year">4th Year (Semester 7 / 8)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#374151] mb-1.5">
                Current Semester (Automatic from Year) <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.current_semester || btechSemesters[0] || 'Semester 1'}
                onChange={(e) => updateField('current_semester', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
              >
                {btechSemesters.map((sem) => (
                  <option key={sem} value={sem}>{sem}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#374151] mb-1.5">
                Previous Semester / Year Percentage or CGPA
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                placeholder="e.g. 78.5% or 8.2 CGPA"
                value={formData.previous_semester_score === 0 ? '' : (formData.previous_semester_score ?? '')}
                onChange={(e) => {
                  const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                  const clamped = isNaN(val) ? 0 : val;
                  updateField('previous_semester_score', clamped);
                  if (formData.year_of_study !== '1st Year') {
                    handlePercentageChange(clamped);
                  }
                }}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#374151] mb-1.5">
                Current Cumulative CGPA (out of 10)
              </label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.01"
                placeholder="e.g. 8.25"
                value={formData.cgpa === 0 ? '' : (formData.cgpa ?? '')}
                onChange={(e) => {
                  const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                  const clampedCgpa = isNaN(val) ? 0 : val;
                  updateProfile({
                    cgpa: clampedCgpa,
                    academic_percentage: clampedCgpa > 0 ? Number((clampedCgpa * 9.5).toFixed(2)) : formData.academic_percentage
                  });
                }}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
              />
            </div>

            {/* Backlogs */}
            <div className="sm:col-span-2 p-3.5 rounded-xl border border-gray-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-semibold text-gray-900 block">
                  Backlogs / ATKT (Allowed To Keep Term)
                </span>
                <span className="text-[10px] text-gray-500">
                  Merit and renewal scholarships require passing without active backlogs
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => updateProfile({ has_backlogs: false, backlogs_count: 0 })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    !formData.has_backlogs
                      ? 'bg-[#16A34A] text-white shadow-xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  No Backlogs (0)
                </button>
                <button
                  type="button"
                  onClick={() => updateProfile({ has_backlogs: true, backlogs_count: formData.backlogs_count || 1 })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    formData.has_backlogs
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Has Active Backlogs
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Score Indicator (NO Hardcoded 75%) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#F0FDF4] border border-[#DCFCE7]">
          <div>
            <span className="text-xs font-semibold text-[#15803D] block">
              {scoreLabel}:
            </span>
            <span className="text-2xl font-black text-[#16A34A]">
              {activeScore > 0 ? `${activeScore}%` : 'Not entered'}
            </span>
            {formData.cgpa && formData.cgpa > 0 ? (
              <span className="text-[11px] text-gray-500 ml-2">
                (~ {formData.cgpa.toFixed(2)} CGPA)
              </span>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  // 6. GENERAL UNDERGRADUATE (BCA, B.Sc, B.Com, B.A., B.Pharm, etc.)
  const ugSemesters = getSemestersForYear(formData.course || 'BCA', formData.year_of_study || '1st Year');

  return (
    <div className="space-y-6 text-xs">
      {/* 10th & 12th Details */}
      <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-4">
        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-[#16A34A]" />
          1. 10th & 12th Board Examination Details
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-[#374151] mb-1.5">
              10th Percentage (%) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              placeholder="e.g. 80.0"
              value={formData.tenth_percentage === 0 ? '' : (formData.tenth_percentage ?? '')}
              onChange={(e) => {
                const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                updateField('tenth_percentage', isNaN(val) ? 0 : val);
              }}
              className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#374151] mb-1.5">
              12th Board Percentage (%) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              placeholder="e.g. 78.0"
              value={formData.twelfth_percentage === 0 ? '' : (formData.twelfth_percentage ?? '')}
              onChange={(e) => {
                const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                const clamped = isNaN(val) ? 0 : val;
                updateField('twelfth_percentage', clamped);
                if (formData.year_of_study === '1st Year') {
                  handlePercentageChange(clamped);
                }
              }}
              className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#374151] mb-1.5">
              12th Board Name
            </label>
            <select
              value={formData.twelfth_board || 'Maharashtra State Board (MSBSHSE)'}
              onChange={(e) => updateField('twelfth_board', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
            >
              {BOARD_OPTIONS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 flex items-center justify-between">
            <div>
              <span className="font-semibold text-gray-900 block">
                Top 20th Percentile in Board?
              </span>
              <span className="text-[10px] text-gray-500">
                CSSS merit quota requirement
              </span>
            </div>
            <button
              type="button"
              onClick={() => updateField('board_percentile_80th', !formData.board_percentile_80th)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                formData.board_percentile_80th
                  ? 'bg-[#16A34A] text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {formData.board_percentile_80th ? 'YES' : 'NO'}
            </button>
          </div>
        </div>
      </div>

      {/* Degree Year, Semester & Standing */}
      <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-4">
        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
          <Building className="w-4 h-4 text-[#16A34A]" />
          2. Degree Year, Semester & Performance
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-[#374151] mb-1.5">
              Current Year of Study <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.year_of_study || '1st Year'}
              onChange={(e) => handleYearChange(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
            >
              <option value="1st Year">1st Year (Fresh)</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              {formData.duration_years && formData.duration_years >= 4 && (
                <option value="4th Year">4th Year</option>
              )}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-[#374151] mb-1.5">
              Current Semester <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.current_semester || ugSemesters[0] || 'Semester 1'}
              onChange={(e) => updateField('current_semester', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
            >
              {ugSemesters.map((sem) => (
                <option key={sem} value={sem}>{sem}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-[#374151] mb-1.5">
              Previous Semester / Year Score (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              placeholder="e.g. 72.5"
              value={formData.previous_semester_score === 0 ? '' : (formData.previous_semester_score ?? '')}
              onChange={(e) => {
                const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                const clamped = isNaN(val) ? 0 : val;
                updateField('previous_semester_score', clamped);
                if (formData.year_of_study !== '1st Year') {
                  handlePercentageChange(clamped);
                }
              }}
              className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#374151] mb-1.5">
              Current CGPA (out of 10)
            </label>
            <input
              type="number"
              min="0"
              max="10"
              step="0.01"
              placeholder="e.g. 7.8"
              value={formData.cgpa === 0 ? '' : (formData.cgpa ?? '')}
              onChange={(e) => {
                const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                const clamped = isNaN(val) ? 0 : val;
                updateProfile({
                  cgpa: clamped,
                  academic_percentage: clamped > 0 ? Number((clamped * 9.5).toFixed(2)) : formData.academic_percentage
                });
              }}
              className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
            />
          </div>
        </div>
      </div>

      {/* Dynamic Score Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#F0FDF4] border border-[#DCFCE7]">
        <div>
          <span className="text-xs font-semibold text-[#15803D] block">
            {scoreLabel}:
          </span>
          <span className="text-2xl font-black text-[#16A34A]">
            {activeScore > 0 ? `${activeScore}%` : 'Not entered'}
          </span>
        </div>
      </div>
    </div>
  );
};
