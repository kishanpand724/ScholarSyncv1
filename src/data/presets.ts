import { StudentProfile, syncProfileFields } from '../types/scholarship';

export interface DemoPreset {
  id: string;
  name: string;
  tagline: string;
  badge: string;
  profile: StudentProfile;
}

/**
 * Default empty student profile for user input.
 * No hardcoded sample or fake student data.
 */
export const DEFAULT_PROFILE: StudentProfile = syncProfileFields({
  is_completed: false,
  name: '',
  dob: '',
  date_of_birth: '',
  gender: 'Male',
  marital_status: 'Single',
  religion: 'Hindu',
  category: 'General',
  state_domicile: '',
  district_domicile: '',
  annual_family_income: 0,
  parent_annual_income: 0,
  parent_profession: '',
  parents_not_alive: false,

  is_disabled: false,
  disability_percentage: 0,

  scholarship_category: 'Post Matric/Top Class/MCM',
  application_type: 'Fresh',
  institute_name: '',
  institution_type: 'AICTE Approved Institution',
  admission_type: 'Merit / Centralized Counseling',
  mode_of_study: 'Regular',
  hosteller_status: 'Day Scholar',

  course: 'B.Tech / B.E.',
  branch: '',
  duration_years: 4,
  total_semesters: 8,
  education_level: 'Undergraduate',
  year_of_study: '1st Year',
  current_semester: 'Semester 1',
  admission_year: 2026,
  expected_graduation_year: 2030,

  academic_percentage: 0,
  cgpa: 0,
  previous_semester_score: 0,
  has_backlogs: false,
  backlogs_count: 0,

  entry_pathway: '12th',
  twelfth_roll_number: '',
  twelfth_percentage: 0,
  twelfth_board: '',
  twelfth_passing_year: 2026,
  tenth_board: '',
  tenth_roll_number: '',
  tenth_percentage: 0,
  board_percentile_80th: false,
  previous_academic_year_score: 0,
  ug_degree_name: '',
  ug_percentage: 0,

  competitive_exam_taken: false,
  competitive_exam_name: '',
  competitive_exam_roll: '',
  competitive_exam_year: undefined,
  competitive_exam_conducted_by: '',
  competitive_exam_score: '',

  family_girl_children_count: null,
  orphan_status: false,
  covid_affected_orphan: false,
  ward_of_armed_forces_martyr: false,
  ward_of_railway_employee: false,
  beedi_cine_worker_ward: false,
  special_conditions: [],
  possessed_documents: []
});

export const DEMO_PRESETS: DemoPreset[] = [];
