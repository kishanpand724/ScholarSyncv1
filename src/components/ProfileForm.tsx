import React, { useState, useEffect } from 'react';
import {
  User,
  GraduationCap,
  Award,
  Wallet,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  RotateCcw,
  Check,
  Edit3,
  Building,
  ShieldCheck,
  ChevronRight,
  Send,
  Save,
  HelpCircle,
  FileText
} from 'lucide-react';
import {
  StudentProfile,
  Gender,
  Category,
  EducationLevel,
  syncProfileFields
} from '../types/scholarship';
import {
  ACADEMIC_COURSES,
  INDIAN_STATES_AND_UTS,
  RELIGIONS,
  MARITAL_STATUSES,
  MODES_OF_STUDY,
  getCourseConfig,
  getSemestersForYear
} from '../config/academicCourses';
import { formatINR } from '../services/eligibilityEngine';
import { DocumentChecklistSection } from './DocumentChecklistSection';
import { AcademicPerformanceFields } from './AcademicPerformanceFields';

interface ProfileFormProps {
  profile: StudentProfile;
  onChange: (profile: StudentProfile) => void;
  onAnalyze: (profile?: StudentProfile) => void;
  isLoading: boolean;
}

const INCOME_PRESETS = [
  { label: '₹ 1.5 Lakh', value: 150000 },
  { label: '₹ 2.5 Lakh', value: 250000 },
  { label: '₹ 4.5 Lakh', value: 450000 },
  { label: '₹ 6.0 Lakh', value: 600000 },
  { label: '₹ 8.0 Lakh', value: 800000 }
];

const STEPS = [
  { id: 1, title: 'Personal Details', shortTitle: 'Personal', icon: User },
  { id: 2, title: 'Academic & Course', shortTitle: 'Course', icon: GraduationCap },
  { id: 3, title: 'Family & Financial', shortTitle: 'Family/Income', icon: Wallet },
  { id: 4, title: 'Academic Performance', shortTitle: 'Marks & Score', icon: Award },
  { id: 5, title: 'Review & Submit', shortTitle: 'Review', icon: CheckCircle2 }
];

export const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  onChange,
  onAnalyze,
  isLoading
}) => {
  // Current active section step: 1, 2, 3, 4, or 5 (Review)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Single source of truth for the entire profile form
  const [formData, setFormData] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem('scholarsync_active_profile');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return profile;
  });
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Sync when parent resets profile externally
  const prevProfileRef = React.useRef(profile);
  useEffect(() => {
    if (prevProfileRef.current !== profile) {
      prevProfileRef.current = profile;
      setFormData(profile);
    }
  }, [profile]);

  // Unified updater for partial updates
  const updateProfile = (patch: Partial<StudentProfile>) => {
    setFormData((prev) => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem('scholarsync_active_profile', JSON.stringify(next));
      } catch (err) {
        console.error('Failed to save to localStorage:', err);
      }
      return next;
    });
  };

  // Unified updater for any single field
  const updateField = <K extends keyof StudentProfile>(field: K, value: StudentProfile[K]) => {
    const patch: Partial<StudentProfile> = { [field]: value };
    if (field === 'dob') {
      patch.date_of_birth = value as string;
    } else if (field === 'date_of_birth') {
      patch.dob = value as string;
    } else if (field === 'annual_family_income') {
      patch.parent_annual_income = value as number;
    }
    updateProfile(patch);
  };

  // Dynamic Course configuration logic (e.g. B.Tech -> 4 years -> 8 semesters)
  const courseConfig = getCourseConfig(formData.course || 'B.Tech / B.E.');
  const availableSemesters = getSemestersForYear(
    formData.course || 'B.Tech / B.E.',
    formData.year_of_study || '1st Year'
  );

  const handleCourseChange = (newCourseName: string) => {
    const config = getCourseConfig(newCourseName);
    const defaultYear = config.years[0]?.id || '1st Year';
    const defaultSemesters = config.years[0]?.semesters || ['Semester 1'];
    const defaultBranch = config.branches[0] || 'General';

    updateProfile({
      course: config.name,
      education_level: config.education_level,
      scholarship_category: config.scholarship_category,
      duration_years: config.duration_years,
      total_semesters: config.total_semesters,
      year_of_study: defaultYear,
      current_semester: defaultSemesters[0],
      branch: defaultBranch
    });
  };

  const handleYearChange = (yearId: string) => {
    const validSemesters = getSemestersForYear(formData.course || 'B.Tech / B.E.', yearId);
    updateProfile({
      year_of_study: yearId,
      current_semester: validSemesters[0] || 'Semester 1'
    });
  };

  // Percentage and CGPA sync (percentage / 9.5)
  const handlePercentageChange = (pct: number) => {
    const clampedPct = isNaN(pct) ? 0 : Math.max(0, Math.min(100, pct));
    const approxCgpa = clampedPct > 0 ? Number((clampedPct / 9.5).toFixed(2)) : 0;
    updateProfile({
      academic_percentage: clampedPct,
      cgpa: approxCgpa
    });
  };

  // Reset/Clear Form
  const handleClearForm = () => {
    const blank: StudentProfile = {
      name: '',
      date_of_birth: '',
      dob: '',
      gender: 'Male',
      marital_status: 'Single',
      religion: 'Hindu',
      category: 'General',
      state_domicile: 'Maharashtra',
      district_domicile: '',
      annual_family_income: 0,
      parent_annual_income: 0,
      parent_profession: 'Private Sector / Self-Employed',
      parents_not_alive: false,
      is_disabled: false,
      disability_percentage: 0,
      scholarship_category: 'Post Matric/Top Class/MCM',
      application_type: 'Fresh',
      academic_percentage: 0,
      cgpa: 0,
      board_percentile_80th: false,
      course: 'B.Tech / B.E.',
      branch: '',
      year_of_study: '1st Year',
      current_semester: 'Semester 1',
      duration_years: 4,
      total_semesters: 8,
      education_level: 'Undergraduate',
      course_type: 'Regular / Full Time',
      mode_of_study: 'Regular',
      admission_type: 'Merit / Centralized Counseling',
      institution_state: 'Maharashtra',
      institution_district: '',
      institution_type: 'AICTE Approved Engineering College',
      institute_name: '',
      hosteller_status: 'Day Scholar',
      special_conditions: []
    };
    setFormData(blank);
    try {
      localStorage.setItem('scholarsync_active_profile', JSON.stringify(blank));
    } catch (err) {
      console.error(err);
    }
    onChange(blank);
    setCurrentStep(1);
    setSaveStatus('Form reset to blank state. All fields are empty and ready for input.');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  // Final submission to eligibility engine
  const handleFinalSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.name?.trim()) {
      setCurrentStep(1);
      setSaveStatus('Please enter your full legal student name before running eligibility analysis.');
      return;
    }
    if (!formData.state_domicile) {
      setCurrentStep(1);
      setSaveStatus('Please select your state of domicile.');
      return;
    }

    const completedProfile: StudentProfile = {
      ...formData,
      is_completed: true
    };
    const synced = syncProfileFields(completedProfile);
    try {
      localStorage.setItem('scholarsync_active_profile', JSON.stringify(synced));
    } catch (err) {
      console.error(err);
    }
    setFormData(synced);
    onChange(synced);
    onAnalyze(synced);
  };

  return (
    <div className="space-y-8">
      {/* TOP HEADER */}
      <div className="bg-white border border-[#E5E7EB] rounded-none p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-none bg-emerald-800 animate-pulse"></span>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              NSP Eligibility Profile Form
            </span>
          </div>
          <h2 className="text-xl font-bold text-[#111827] mt-1.5">
            Student Eligibility Profile
          </h2>
          <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
            Fill and edit your details. Navigate freely between sections, edit any field anytime, review all details, and click &quot;Find My Scholarships&quot;.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleClearForm}
            className="px-4 py-2.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-none transition-all cursor-pointer flex items-center gap-1.5"
            title="Reset all fields to blank"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear / Start Blank</span>
          </button>
        </div>
      </div>

      {saveStatus && (
        <div className="p-4 rounded-none bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0" />
          <span>{saveStatus}</span>
        </div>
      )}

      {/* STEPPER PROGRESS BAR (Freely clickable to jump anywhere) */}
      <div className="bg-white border border-[#E5E7EB] rounded-none p-4 sm:p-5 shadow-xs overflow-x-auto">
        <div className="flex items-center justify-between min-w-[580px] gap-3">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isCurrent = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <React.Fragment key={step.id}>
                <button
                  type="button"
                  onClick={() => setCurrentStep(step.id)}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-none text-xs font-bold transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : isCompleted
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-none flex items-center justify-center text-[10px] font-bold ${
                      isCurrent
                        ? 'bg-white text-emerald-900'
                        : isCompleted
                        ? 'bg-emerald-800 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {isCompleted ? '✓' : step.id}
                  </div>
                  <span>{step.shortTitle}</span>
                </button>

                {idx < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 min-w-[20px] ${
                      currentStep > step.id ? 'bg-emerald-800' : 'bg-gray-200'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: PERSONAL DETAILS                                               */}
      {/* ========================================================================= */}
      {currentStep === 1 && (
        <div className="bg-white border border-[#E5E7EB] rounded-none p-6 sm:p-8 shadow-xs space-y-7">
          <div className="flex items-center justify-between border-b border-[#F3F4F6] pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-none bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="text-base font-bold text-[#111827]">Personal Information</h3>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  Official NSP identity, category, and domicile fields (freely editable)
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setCurrentStep(5)}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 hover:underline cursor-pointer"
            >
              Skip to Review →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            {/* Student Full Name */}
            <div>
              <label className="block font-semibold text-[#374151] mb-1.5">
                Full Name (as per Aadhaar / School Records) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-none text-xs text-[#111827] focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-800 focus:border-emerald-800 transition-all"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block font-semibold text-[#374151] mb-1.5">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.date_of_birth || formData.dob || ''}
                onChange={(e) => updateProfile({ date_of_birth: e.target.value, dob: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-none text-xs text-[#111827] focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-800 focus:border-emerald-800 transition-all"
              />
            </div>

            {/* Gender (Pills) */}
            <div className="md:col-span-2">
              <label className="block font-semibold text-[#374151] mb-1.5">
                Gender <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['Male', 'Female', 'Other'] as Gender[]).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => updateField('gender', g)}
                    className={`py-2.5 px-3.5 rounded-none border text-xs font-semibold transition-all cursor-pointer text-center ${
                      formData.gender === g
                        ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                        : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#374151] hover:bg-gray-100'
                    }`}
                  >
                    {g === 'Male' ? '👨 Male' : g === 'Female' ? '👩 Female' : '⚧ Other'}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-[#6B7280] mt-1.5">
                Note: Female applicants qualify for AICTE Pragati, Begum Hazrat Mahal, and special female quotas.
              </p>
            </div>

            {/* Caste / Community Category */}
            <div className="md:col-span-2">
              <label className="block font-semibold text-[#374151] mb-1.5">
                Community / Caste Category <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {(['General', 'OBC', 'SC', 'ST', 'EWS'] as Category[]).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => updateField('category', cat)}
                    className={`py-2.5 px-3.5 rounded-none border text-xs font-bold transition-all cursor-pointer text-center ${
                      formData.category === cat
                        ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                        : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#374151] hover:bg-gray-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Domicile State */}
            <div>
              <label className="block font-semibold text-[#374151] mb-1.5">
                Domicile State / UT <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.state_domicile || 'Maharashtra'}
                onChange={(e) => updateField('state_domicile', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-none text-xs text-[#111827] focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-800 focus:border-emerald-800 transition-all"
              >
                {INDIAN_STATES_AND_UTS.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Domicile District */}
            <div>
              <label className="block font-semibold text-[#374151] mb-1.5">
                Domicile District
              </label>
              <input
                type="text"
                value={formData.district_domicile || ''}
                onChange={(e) => updateField('district_domicile', e.target.value)}
                placeholder="e.g. Pune, Nagpur, Mumbai Suburban"
                className="w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-none text-xs text-[#111827] focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-800 focus:border-emerald-800 transition-all"
              />
            </div>

            {/* Religion */}
            <div>
              <label className="block font-semibold text-[#374151] mb-1.5">
                Religion <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.religion || 'Hindu'}
                onChange={(e) => updateField('religion', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-none text-xs text-[#111827] focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-800 focus:border-emerald-800 transition-all"
              >
                {RELIGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Marital Status */}
            <div>
              <label className="block font-semibold text-[#374151] mb-1.5">
                Marital Status
              </label>
              <select
                value={formData.marital_status || 'Single'}
                onChange={(e) => updateField('marital_status', e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-none text-xs text-[#111827] focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-800 focus:border-emerald-800 transition-all"
              >
                {MARITAL_STATUSES.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Both Parents Not Alive (Orphan) */}
            <div className="p-4 rounded-none border border-gray-200 bg-gray-50/50 flex items-center justify-between">
              <div>
                <span className="font-semibold text-gray-900 block">Both Parents Not Alive (Orphan)?</span>
                <span className="text-[10px] text-gray-500 mt-0.5 block">Qualifies for special state/central orphan quotas</span>
              </div>
              <button
                type="button"
                onClick={() => updateField('parents_not_alive', !formData.parents_not_alive)}
                className={`px-4 py-2 rounded-none text-xs font-bold transition-all cursor-pointer ${
                  formData.parents_not_alive
                    ? 'bg-emerald-800 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {formData.parents_not_alive ? 'YES' : 'NO'}
              </button>
            </div>

            {/* Person with Disability (PwD) */}
            <div className="p-4 rounded-none border border-gray-200 bg-gray-50/50 space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-gray-900 block">Person with Disability (PwD)?</span>
                  <span className="text-[10px] text-gray-500 mt-0.5 block">Benchmark disability (40%+) for Divyang schemes</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const nextVal = !formData.is_disabled;
                    updateField('is_disabled', nextVal);
                    if (nextVal && !formData.disability_percentage) {
                      updateField('disability_percentage', 40);
                    }
                  }}
                  className={`px-4 py-2 rounded-none text-xs font-bold transition-all cursor-pointer ${
                    formData.is_disabled
                      ? 'bg-emerald-800 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {formData.is_disabled ? 'YES' : 'NO'}
                </button>
              </div>

              {formData.is_disabled && (
                <div className="pt-2.5 border-t border-gray-200 space-y-2">
                  <div className="flex justify-between font-medium">
                    <span>Disability Percentage:</span>
                    <span className="font-bold text-emerald-800">{formData.disability_percentage || 40}%</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="100"
                    step="5"
                    value={formData.disability_percentage || 40}
                    onChange={(e) => updateField('disability_percentage', parseInt(e.target.value))}
                    className="w-full accent-emerald-800 cursor-pointer"
                  />
                  <span className="text-[10px] text-gray-500 block">
                    Statutory benchmark on NSP is 40% certified disability.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Section 1 Footer Navigation */}
          <div className="pt-5 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500">Step 1 of 5</span>
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-6 py-2.5 rounded-none bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <span>Next: Course & Academic Details</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: ACADEMIC & COURSE DETAILS                                      */}
      {/* ========================================================================= */}
      {currentStep === 2 && (
        <div className="bg-white border border-[#E5E7EB] rounded-none p-6 sm:p-8 shadow-xs space-y-7">
          <div className="flex items-center justify-between border-b border-[#F3F4F6] pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-none bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="text-base font-bold text-[#111827]">Degree & Course Details</h3>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  Dynamic duration, semesters, and institution profile (freely editable)
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setCurrentStep(5)}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 hover:underline cursor-pointer"
            >
              Skip to Review →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            {/* Degree / Course Dropdown */}
            <div className="md:col-span-2">
              <label className="block font-semibold text-[#374151] mb-1.5">
                Course / Program <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.course || 'B.Tech / B.E.'}
                onChange={(e) => handleCourseChange(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-none text-xs text-[#111827] font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-800 focus:border-emerald-800 transition-all"
              >
                {ACADEMIC_COURSES.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.label} ({c.duration_years} Years / {c.total_semesters} Semesters)
                  </option>
                ))}
              </select>
              <div className="flex items-center gap-3 mt-2 text-[11px] text-[#6B7280]">
                <span>Level: <strong className="text-gray-900">{formData.education_level}</strong></span>
                <span>•</span>
                <span>Duration: <strong className="text-gray-900">{formData.duration_years || 4} Years</strong></span>
                <span>•</span>
                <span>Total: <strong className="text-gray-900">{formData.total_semesters || 8} Semesters</strong></span>
              </div>
            </div>

            {/* Branch / Specialization */}
            <div>
              <label className="block font-semibold text-[#374151] mb-1.5">
                Branch / Specialization
              </label>
              <input
                type="text"
                value={formData.branch || ''}
                onChange={(e) => updateField('branch', e.target.value)}
                placeholder="e.g. Computer Science, Mechanical, Civil, Commerce"
                className="w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-none text-xs text-[#111827] focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-800 focus:border-emerald-800 transition-all"
              />
            </div>

            {/* Institution / College Name */}
            <div>
              <label className="block font-semibold text-[#374151] mb-1.5">
                College / Institute / University Name
              </label>
              <input
                type="text"
                value={formData.institute_name || ''}
                onChange={(e) => updateField('institute_name', e.target.value)}
                placeholder="e.g. IIT Bombay, Delhi University, COEP Pune"
                className="w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-none text-xs text-[#111827] focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-800 focus:border-emerald-800 transition-all"
              />
            </div>

            {/* Current Year of Study (Dynamic Chips) */}
            <div className="md:col-span-2">
              <label className="block font-semibold text-[#374151] mb-1.5">
                Current Year of Study <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {courseConfig.years.map((yr) => (
                  <button
                    key={yr.id}
                    type="button"
                    onClick={() => handleYearChange(yr.id)}
                    className={`py-2.5 px-3.5 rounded-none border text-xs font-bold transition-all cursor-pointer text-center ${
                      formData.year_of_study === yr.id
                        ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                        : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#374151] hover:bg-gray-100'
                    }`}
                  >
                    {yr.label || yr.id}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Semester (Dynamic Options) */}
            <div>
              <label className="block font-semibold text-[#374151] mb-1.5">
                Current Semester <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.current_semester || availableSemesters[0] || 'Semester 1'}
                onChange={(e) => updateField('current_semester', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-none text-xs text-[#111827] focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-800 focus:border-emerald-800 transition-all"
              >
                {availableSemesters.map((sem) => (
                  <option key={sem} value={sem}>
                    {sem}
                  </option>
                ))}
              </select>
            </div>

            {/* Accommodation: Hosteller vs Day Scholar */}
            <div>
              <label className="block font-semibold text-[#374151] mb-1.5">
                Accommodation Status
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => updateField('hosteller_status', 'Day Scholar')}
                  className={`py-2.5 px-3.5 rounded-none border text-xs font-semibold transition-all cursor-pointer text-center ${
                    formData.hosteller_status === 'Day Scholar'
                      ? 'bg-emerald-800 text-white border-emerald-800'
                      : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#374151] hover:bg-gray-100'
                  }`}
                >
                  🏠 Day Scholar
                </button>
                <button
                  type="button"
                  onClick={() => updateField('hosteller_status', 'Hosteller')}
                  className={`py-2.5 px-3.5 rounded-none border text-xs font-semibold transition-all cursor-pointer text-center ${
                    formData.hosteller_status === 'Hosteller'
                      ? 'bg-emerald-800 text-white border-emerald-800'
                      : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#374151] hover:bg-gray-100'
                  }`}
                >
                  🏢 Hosteller
                </button>
              </div>
            </div>

            {/* Mode of Study */}
            <div>
              <label className="block font-semibold text-[#374151] mb-1.5">
                Mode of Study
              </label>
              <select
                value={formData.mode_of_study || 'Regular'}
                onChange={(e) => updateField('mode_of_study', e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-none text-xs text-[#111827] focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-800 focus:border-emerald-800 transition-all"
              >
                {MODES_OF_STUDY.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Application Type */}
            <div>
              <label className="block font-semibold text-[#374151] mb-1.5">
                Application Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => updateField('application_type', 'Fresh')}
                  className={`py-2.5 px-3.5 rounded-none border text-xs font-semibold transition-all cursor-pointer text-center ${
                    formData.application_type === 'Fresh'
                      ? 'bg-emerald-800 text-white border-emerald-800'
                      : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#374151] hover:bg-gray-100'
                  }`}
                >
                  Fresh Application
                </button>
                <button
                  type="button"
                  onClick={() => updateField('application_type', 'Renewal')}
                  className={`py-2.5 px-3.5 rounded-none border text-xs font-semibold transition-all cursor-pointer text-center ${
                    formData.application_type === 'Renewal'
                      ? 'bg-emerald-800 text-white border-emerald-800'
                      : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#374151] hover:bg-gray-100'
                  }`}
                >
                  Renewal
                </button>
              </div>
            </div>
          </div>

          {/* Section 2 Footer Navigation */}
          <div className="pt-5 border-t border-gray-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-5 py-2.5 rounded-none border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back: Personal Details</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-6 py-2.5 rounded-none bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <span>Next: Family & Income Details</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: FAMILY & FINANCIAL DETAILS                                     */}
      {/* ========================================================================= */}
      {currentStep === 3 && (
        <div className="bg-white border border-[#E5E7EB] rounded-none p-6 sm:p-8 shadow-xs space-y-7">
          <div className="flex items-center justify-between border-b border-[#F3F4F6] pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-none bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="text-base font-bold text-[#111827]">Family & Financial Details</h3>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  Annual income ceilings and statutory welfare quotas (freely editable)
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setCurrentStep(5)}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 hover:underline cursor-pointer"
            >
              Skip to Review →
            </button>
          </div>

          <div className="space-y-5 text-xs">
            {/* Quick Income Preset Buttons */}
            <div>
              <label className="block font-semibold text-[#374151] mb-1.5">
                Official NSP Scheme Income Ceilings (1-Click Presets)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {INCOME_PRESETS.map((p) => {
                  const isSelected = formData.annual_family_income === p.value;
                  return (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => {
                        updateField('annual_family_income', p.value);
                        updateField('parent_annual_income', p.value);
                      }}
                      className={`py-2.5 px-3.5 rounded-none border text-xs font-bold transition-all cursor-pointer text-center ${
                        isSelected
                          ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                          : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#374151] hover:bg-gray-100'
                      }`}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Income Input Field & Formatted Display */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              <div>
                <label className="block font-semibold text-[#374151] mb-1.5">
                  Annual Family Income (INR ₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="5000"
                  min="0"
                  value={formData.annual_family_income === 0 ? '' : (formData.annual_family_income ?? '')}
                  placeholder="e.g. 250000"
                  onChange={(e) => {
                    const raw = e.target.value;
                    const val = raw === '' ? 0 : parseFloat(raw);
                    updateProfile({
                      annual_family_income: isNaN(val) ? 0 : val,
                      parent_annual_income: isNaN(val) ? 0 : val
                    });
                  }}
                  className="w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-none text-xs text-[#111827] focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-800 focus:border-emerald-800"
                />
              </div>

              <div className="flex flex-col justify-end">
                <div className="p-3.5 rounded-none bg-gray-50 border border-gray-200">
                  <span className="text-[11px] text-gray-500 block">Formatted Income:</span>
                  <span className="text-sm font-bold text-gray-900 mt-0.5 block">
                    {formatINR(formData.annual_family_income || 0)} / year
                  </span>
                </div>
              </div>
            </div>

            {/* Parent Profession */}
            <div>
              <label className="block font-semibold text-[#374151] mb-1.5">
                Parent / Guardian Profession
              </label>
              <select
                value={formData.parent_profession || 'Private Sector / Self-Employed'}
                onChange={(e) => updateField('parent_profession', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-none text-xs text-[#111827] focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-800 focus:border-emerald-800 transition-all"
              >
                <option value="Agriculture / Farming">Agriculture / Farming</option>
                <option value="Private Sector / Self-Employed">Private Sector / Self-Employed</option>
                <option value="Government Employee">Government Employee</option>
                <option value="Armed Forces / Ex-Servicemen">Armed Forces / Ex-Servicemen</option>
                <option value="Daily Wage Laborer">Daily Wage Laborer</option>
                <option value="Business / Commerce">Business / Commerce</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Special Welfare Quotas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Single Girl Child */}
              <div className="p-4 rounded-none border border-gray-200 bg-gray-50/50 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-gray-900 block">Single Girl Child in Family?</span>
                  <span className="text-[10px] text-gray-500 mt-0.5 block">Qualifies for AICTE Pragati & UGC Girl Child schemes</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const count = formData.family_girl_children_count === 1 ? 0 : 1;
                    updateField('family_girl_children_count', count);
                  }}
                  className={`px-4 py-2 rounded-none text-xs font-bold transition-all cursor-pointer ${
                    formData.family_girl_children_count === 1
                      ? 'bg-emerald-800 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {formData.family_girl_children_count === 1 ? 'YES' : 'NO'}
                </button>
              </div>

              {/* Ward of Armed Forces / Ex-Servicemen */}
              <div className="p-4 rounded-none border border-gray-200 bg-gray-50/50 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-gray-900 block">Ward of Armed Forces / Police?</span>
                  <span className="text-[10px] text-gray-500 mt-0.5 block">Eligible for Prime Minister&apos;s Scholarship Scheme (PMSS)</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const exists = formData.special_conditions?.includes('ward_of_armed_forces_martyr');
                    const nextTags = exists
                      ? (formData.special_conditions || []).filter((c) => c !== 'ward_of_armed_forces_martyr')
                      : [...(formData.special_conditions || []), 'ward_of_armed_forces_martyr'];
                    updateField('special_conditions', nextTags);
                  }}
                  className={`px-4 py-2 rounded-none text-xs font-bold transition-all cursor-pointer ${
                    formData.special_conditions?.includes('ward_of_armed_forces_martyr')
                      ? 'bg-emerald-800 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {formData.special_conditions?.includes('ward_of_armed_forces_martyr') ? 'YES' : 'NO'}
                </button>
              </div>
            </div>
          </div>

          {/* Section 3 Footer Navigation */}
          <div className="pt-5 border-t border-gray-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-5 py-2.5 rounded-none border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back: Course Details</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="px-6 py-2.5 rounded-none bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <span>Next: Marks & Score</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 4: ACADEMIC PERFORMANCE & MARKS (Dynamic per course)             */}
      {/* ========================================================================= */}
      {currentStep === 4 && (
        <div className="bg-white border border-[#E5E7EB] rounded-none p-6 sm:p-8 shadow-xs space-y-7">
          <div className="flex items-center justify-between border-b border-[#F3F4F6] pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-none bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="text-base font-bold text-[#111827]">
                  Academic Performance & Marks
                </h3>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  Dynamic evaluation fields configured for: <strong className="text-emerald-800">{formData.course || 'B.Tech / B.E.'}</strong>
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setCurrentStep(5)}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 hover:underline cursor-pointer"
            >
              Skip to Review →
            </button>
          </div>

          {/* DYNAMIC FORM ACCORDING TO COURSE */}
          <AcademicPerformanceFields
            formData={formData}
            updateField={updateField}
            updateProfile={updateProfile}
            handlePercentageChange={handlePercentageChange}
            handleYearChange={handleYearChange}
          />

          {/* Section 4 Footer Navigation */}
          <div className="pt-5 border-t border-gray-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-5 py-2.5 rounded-none border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back: Family & Income</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(5)}
              className="px-6 py-2.5 rounded-none bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <span>Next: Review & Confirm</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 5: REVIEW & CONFIRMATION SCREEN (With Edit Buttons on Each Card)  */}
      {/* ========================================================================= */}
      {currentStep === 5 && (
        <div className="bg-white border border-[#E5E7EB] rounded-none p-6 sm:p-8 shadow-xs space-y-7">
          <div className="flex items-center justify-between border-b border-[#F3F4F6] pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-none bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-center justify-center font-bold">
                ✓
              </div>
              <div>
                <h3 className="text-base font-bold text-[#111827]">Review & Confirm Your Profile</h3>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  Click &quot;Edit&quot; on any section to return and change values, or click &quot;Find My Scholarships&quot; to evaluate.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Review Card 1: Personal Details */}
            <div className="p-5 rounded-none border border-gray-200 bg-gray-50/50 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-800" />
                  <span className="text-xs font-bold text-[#111827]">1. Personal Information</span>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-900 hover:text-emerald-950 bg-white px-3 py-1 rounded-none border border-emerald-200 shadow-2xs hover:bg-emerald-50 cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-xs pt-1 border-t border-gray-200/60">
                <div>
                  <span className="text-[11px] text-gray-500 block">Full Name:</span>
                  <span className="font-semibold text-gray-900 mt-0.5 block">{formData.name || 'Not provided'}</span>
                </div>
                <div>
                  <span className="text-[11px] text-gray-500 block">Gender:</span>
                  <span className="font-semibold text-gray-900 mt-0.5 block">{formData.gender}</span>
                </div>
                <div>
                  <span className="text-[11px] text-gray-500 block">Category:</span>
                  <span className="font-semibold text-gray-900 mt-0.5 block">{formData.category}</span>
                </div>
                <div>
                  <span className="text-[11px] text-gray-500 block">Religion:</span>
                  <span className="font-semibold text-gray-900 mt-0.5 block">{formData.religion || 'Hindu'}</span>
                </div>
                <div>
                  <span className="text-[11px] text-gray-500 block">Domicile State:</span>
                  <span className="font-semibold text-gray-900 mt-0.5 block">{formData.state_domicile}</span>
                </div>
                <div>
                  <span className="text-[11px] text-gray-500 block">Disability:</span>
                  <span className="font-semibold text-gray-900 mt-0.5 block">
                    {formData.is_disabled ? `Yes (${formData.disability_percentage}%)` : 'No'}
                  </span>
                </div>
              </div>
            </div>

            {/* Review Card 2: Academic & Course Details */}
            <div className="p-5 rounded-none border border-gray-200 bg-gray-50/50 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-emerald-800" />
                  <span className="text-xs font-bold text-[#111827]">2. Degree & Course Details</span>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-900 hover:text-emerald-950 bg-white px-3 py-1 rounded-none border border-emerald-200 shadow-2xs hover:bg-emerald-50 cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-xs pt-1 border-t border-gray-200/60">
                <div className="col-span-2">
                  <span className="text-[11px] text-gray-500 block">Course / Degree:</span>
                  <span className="font-semibold text-gray-900 mt-0.5 block">{formData.course}</span>
                </div>
                <div>
                  <span className="text-[11px] text-gray-500 block">Year of Study:</span>
                  <span className="font-semibold text-gray-900 mt-0.5 block">{formData.year_of_study || '1st Year'}</span>
                </div>
                <div>
                  <span className="text-[11px] text-gray-500 block">Current Semester:</span>
                  <span className="font-semibold text-gray-900 mt-0.5 block">{formData.current_semester || 'Semester 1'}</span>
                </div>
                <div>
                  <span className="text-[11px] text-gray-500 block">Education Level:</span>
                  <span className="font-semibold text-gray-900 mt-0.5 block">{formData.education_level}</span>
                </div>
                <div>
                  <span className="text-[11px] text-gray-500 block">Accommodation:</span>
                  <span className="font-semibold text-gray-900 mt-0.5 block">{formData.hosteller_status || 'Day Scholar'}</span>
                </div>
              </div>
            </div>

            {/* Review Card 3: Family & Financial */}
            <div className="p-5 rounded-none border border-gray-200 bg-gray-50/50 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-emerald-800" />
                  <span className="text-xs font-bold text-[#111827]">3. Family & Financial</span>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-900 hover:text-emerald-950 bg-white px-3 py-1 rounded-none border border-emerald-200 shadow-2xs hover:bg-emerald-50 cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-xs pt-1 border-t border-gray-200/60">
                <div className="col-span-2">
                  <span className="text-[11px] text-gray-500 block">Annual Family Income:</span>
                  <span className="text-sm font-bold text-emerald-800 mt-0.5 block">
                    {formatINR(formData.annual_family_income || 0)} / year
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-gray-500 block">Parent Profession:</span>
                  <span className="font-semibold text-gray-900 mt-0.5 block">{formData.parent_profession || 'Private'}</span>
                </div>
                <div>
                  <span className="text-[11px] text-gray-500 block">Single Girl Child:</span>
                  <span className="font-semibold text-gray-900 mt-0.5 block">
                    {formData.family_girl_children_count === 1 ? 'Yes' : 'No'}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-gray-500 block">Armed Forces Ward:</span>
                  <span className="font-semibold text-gray-900 mt-0.5 block">
                    {formData.special_conditions?.includes('ward_of_armed_forces_martyr') ? 'Yes' : 'No'}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-gray-500 block">Parents Alive:</span>
                  <span className="font-semibold text-gray-900 mt-0.5 block">
                    {formData.parents_not_alive ? 'Both Deceased (Orphan)' : 'Normal'}
                  </span>
                </div>
              </div>
            </div>

            {/* Review Card 4: Academic Performance */}
            <div className="p-5 rounded-none border border-gray-200 bg-gray-50/50 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-800" />
                  <span className="text-xs font-bold text-[#111827]">4. Marks & Performance</span>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-900 hover:text-emerald-950 bg-white px-3 py-1 rounded-none border border-emerald-200 shadow-2xs hover:bg-emerald-50 cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-xs pt-1 border-t border-gray-200/60">
                <div>
                  <span className="text-[11px] text-gray-500 block">Course & Year:</span>
                  <span className="font-semibold text-gray-900 mt-0.5 block">{formData.course} ({formData.year_of_study || '1st Year'})</span>
                </div>
                <div>
                  <span className="text-[11px] text-gray-500 block">Qualifying Score:</span>
                  <span className="text-sm font-bold text-emerald-800 mt-0.5 block">{formData.academic_percentage || formData.twelfth_percentage || formData.tenth_percentage || formData.ug_percentage || 0}%</span>
                </div>
                {formData.tenth_percentage ? (
                  <div>
                    <span className="text-[11px] text-gray-500 block">10th Percentage:</span>
                    <span className="font-semibold text-gray-900 mt-0.5 block">{formData.tenth_percentage}% ({formData.tenth_board ? formData.tenth_board.split('(')[0].trim() : 'Board'})</span>
                  </div>
                ) : null}
                {formData.twelfth_percentage ? (
                  <div>
                    <span className="text-[11px] text-gray-500 block">12th Percentage:</span>
                    <span className="font-semibold text-gray-900 mt-0.5 block">{formData.twelfth_percentage}% ({formData.twelfth_board ? formData.twelfth_board.split('(')[0].trim() : 'Board'})</span>
                  </div>
                ) : null}
                {formData.ug_percentage ? (
                  <div>
                    <span className="text-[11px] text-gray-500 block">UG Percentage:</span>
                    <span className="font-semibold text-gray-900 mt-0.5 block">{formData.ug_percentage}% ({formData.ug_degree_name || 'UG Degree'})</span>
                  </div>
                ) : null}
                {formData.competitive_exam_taken && (
                  <div className="col-span-2">
                    <span className="text-[11px] text-gray-500 block">Entrance Exam:</span>
                    <span className="font-semibold text-gray-900 mt-0.5 block">
                      {formData.competitive_exam_name?.split('(')[0].trim()} - {formData.competitive_exam_score || 'Declared'} (Roll: {formData.competitive_exam_roll || 'N/A'})
                    </span>
                  </div>
                )}
                <div>
                  <span className="text-[11px] text-gray-500 block">Backlogs / ATKT:</span>
                  <span className={`font-semibold mt-0.5 block ${formData.has_backlogs ? 'text-amber-700' : 'text-emerald-800'}`}>
                    {formData.has_backlogs ? `${formData.backlogs_count || 1} Active Backlog(s)` : 'Clear Pass (0)'}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-gray-500 block">Top 20th Percentile in Board:</span>
                  <span className="font-semibold text-gray-900 mt-0.5 block">
                    {formData.board_percentile_80th ? 'Yes (Meets CSSS Merit Cutoff)' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Student Document Readiness Checklist */}
          <div className="pt-3">
            <DocumentChecklistSection
              possessedDocuments={formData.possessed_documents || []}
              onChange={(updatedDocs) => updateField('possessed_documents', updatedDocs)}
              compact={false}
              title="Official Documents in Your Possession"
              subtitle="Check the documents you currently hold. ScholarSync will cross-reference them against eligible scholarship requirements."
            />
          </div>

          {/* Section 5 Footer Action Bar */}
          <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-none border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back: Marks & Score</span>
            </button>

            <button
              type="button"
              onClick={handleFinalSubmit}
              disabled={isLoading}
              className="w-full sm:w-auto px-8 py-3 rounded-none bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-none animate-spin"></div>
                  <span>Evaluating 31 Official Schemes...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Find My Scholarships</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
