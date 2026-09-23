/**
 * Configuration-driven academic course taxonomy and statutory options
 * Aligned with National Scholarship Portal (NSP AY 2026-27) official specifications.
 */

import { EducationLevel } from '../types/scholarship';

export interface YearSemesterConfig {
  id: string;
  label: string;
  semesters: string[];
}

export interface CourseConfig {
  id: string;
  name: string;
  label: string;
  education_level: EducationLevel;
  scholarship_category: string;
  duration_years: number;
  total_semesters: number;
  years: YearSemesterConfig[];
  branches: string[];
  entry_pathways?: string[];
  is_engineering?: boolean;
  default_competitive_exam?: string;
}

export const ACADEMIC_COURSES: CourseConfig[] = [
  {
    id: 'B.Tech / B.E.',
    name: 'B.Tech / B.E.',
    label: 'B.Tech / B.E. (Bachelor of Technology / Engineering)',
    education_level: 'Undergraduate',
    scholarship_category: 'Technical / Professional',
    duration_years: 4,
    total_semesters: 8,
    is_engineering: true,
    default_competitive_exam: 'JEE Main',
    entry_pathways: ['After 12th (Standard)', 'After Diploma (Lateral Entry to 2nd Year)'],
    branches: [
      'Computer Science & Engineering (CSE)',
      'Information Technology (IT)',
      'Electronics & Communication Engineering (ECE)',
      'Electrical & Electronics Engineering (EEE)',
      'Mechanical Engineering (ME)',
      'Civil Engineering (CE)',
      'Artificial Intelligence & Machine Learning (AI/ML)',
      'Data Science',
      'Chemical Engineering',
      'Biotechnology Engineering',
      'Aerospace Engineering',
      'Other Engineering Specialization'
    ],
    years: [
      { id: '1st Year', label: '1st Year', semesters: ['Semester 1', 'Semester 2'] },
      { id: '2nd Year', label: '2nd Year', semesters: ['Semester 3', 'Semester 4'] },
      { id: '3rd Year', label: '3rd Year', semesters: ['Semester 5', 'Semester 6'] },
      { id: '4th Year', label: '4th Year', semesters: ['Semester 7', 'Semester 8'] }
    ]
  },
  {
    id: 'Diploma',
    name: 'Diploma',
    label: 'Diploma / Polytechnic (Technical / Engineering)',
    education_level: 'Diploma',
    scholarship_category: 'Technical / Professional',
    duration_years: 3,
    total_semesters: 6,
    is_engineering: true,
    default_competitive_exam: 'State Polytechnic CET',
    entry_pathways: ['After 10th (Standard)', 'After 12th / ITI (Lateral Entry to 2nd Year)'],
    branches: [
      'Diploma in Computer Engineering',
      'Diploma in Mechanical Engineering',
      'Diploma in Civil Engineering',
      'Diploma in Electrical Engineering',
      'Diploma in Electronics & Telecommunication',
      'Diploma in Automobile Engineering',
      'Diploma in Information Technology',
      'Other Polytechnic Specialization'
    ],
    years: [
      { id: '1st Year', label: '1st Year', semesters: ['Semester 1', 'Semester 2'] },
      { id: '2nd Year', label: '2nd Year', semesters: ['Semester 3', 'Semester 4'] },
      { id: '3rd Year', label: '3rd Year', semesters: ['Semester 5', 'Semester 6'] }
    ]
  },
  {
    id: 'MBBS',
    name: 'MBBS',
    label: 'MBBS (Bachelor of Medicine, Bachelor of Surgery)',
    education_level: 'Undergraduate',
    scholarship_category: 'Technical / Professional',
    duration_years: 5.5,
    total_semesters: 9,
    default_competitive_exam: 'NEET-UG',
    entry_pathways: ['After 12th (Standard)'],
    branches: ['General Medicine & Surgery'],
    years: [
      { id: '1st Professional Phase', label: '1st Professional Phase', semesters: ['Phase 1 - Part 1', 'Phase 1 - Part 2'] },
      { id: '2nd Professional Phase', label: '2nd Professional Phase', semesters: ['Phase 2 - Part 1', 'Phase 2 - Part 2'] },
      { id: '3rd Professional Phase (Part 1)', label: '3rd Professional Phase (Part 1)', semesters: ['Phase 3 Part 1 - Sem 5', 'Phase 3 Part 1 - Sem 6'] },
      { id: '3rd Professional Phase (Part 2)', label: '3rd Professional Phase (Part 2)', semesters: ['Phase 3 Part 2 - Sem 7', 'Phase 3 Part 2 - Sem 8'] },
      { id: 'Compulsory Rotatory Internship', label: 'Internship Year', semesters: ['Internship'] }
    ]
  },
  {
    id: 'BCA',
    name: 'BCA',
    label: 'BCA (Bachelor of Computer Applications)',
    education_level: 'Undergraduate',
    scholarship_category: 'Higher Education',
    duration_years: 3,
    total_semesters: 6,
    default_competitive_exam: 'CUET / College Entrance',
    entry_pathways: ['After 12th (Standard)'],
    branches: [
      'General Computer Applications',
      'Cloud & Cyber Security',
      'Data Analytics',
      'Full Stack Software Development'
    ],
    years: [
      { id: '1st Year', label: '1st Year', semesters: ['Semester 1', 'Semester 2'] },
      { id: '2nd Year', label: '2nd Year', semesters: ['Semester 3', 'Semester 4'] },
      { id: '3rd Year', label: '3rd Year', semesters: ['Semester 5', 'Semester 6'] }
    ]
  },
  {
    id: 'B.Sc',
    name: 'B.Sc',
    label: 'B.Sc (Bachelor of Science)',
    education_level: 'Undergraduate',
    scholarship_category: 'Higher Education',
    duration_years: 3,
    total_semesters: 6,
    default_competitive_exam: 'CUET / State University Entrance',
    entry_pathways: ['After 12th (Standard)'],
    branches: [
      'Physics',
      'Chemistry',
      'Mathematics',
      'Computer Science / IT',
      'Biotechnology',
      'Agriculture (ICAR)',
      'Nursing',
      'Botany / Zoology',
      'General Science'
    ],
    years: [
      { id: '1st Year', label: '1st Year', semesters: ['Semester 1', 'Semester 2'] },
      { id: '2nd Year', label: '2nd Year', semesters: ['Semester 3', 'Semester 4'] },
      { id: '3rd Year', label: '3rd Year', semesters: ['Semester 5', 'Semester 6'] }
    ]
  },
  {
    id: 'B.Com',
    name: 'B.Com',
    label: 'B.Com (Bachelor of Commerce)',
    education_level: 'Undergraduate',
    scholarship_category: 'Higher Education',
    duration_years: 3,
    total_semesters: 6,
    default_competitive_exam: 'CUET / State University Entrance',
    entry_pathways: ['After 12th (Standard)'],
    branches: [
      'Accounting & Finance',
      'Banking & Insurance',
      'Financial Markets',
      'Computer Applications in Business',
      'General Commerce'
    ],
    years: [
      { id: '1st Year', label: '1st Year', semesters: ['Semester 1', 'Semester 2'] },
      { id: '2nd Year', label: '2nd Year', semesters: ['Semester 3', 'Semester 4'] },
      { id: '3rd Year', label: '3rd Year', semesters: ['Semester 5', 'Semester 6'] }
    ]
  },
  {
    id: 'B.A.',
    name: 'B.A.',
    label: 'B.A. (Bachelor of Arts)',
    education_level: 'Undergraduate',
    scholarship_category: 'Higher Education',
    duration_years: 3,
    total_semesters: 6,
    default_competitive_exam: 'CUET / State University Entrance',
    entry_pathways: ['After 12th (Standard)'],
    branches: [
      'Economics',
      'English Literature',
      'Political Science',
      'History',
      'Psychology',
      'Sociology',
      'Public Administration',
      'General Arts'
    ],
    years: [
      { id: '1st Year', label: '1st Year', semesters: ['Semester 1', 'Semester 2'] },
      { id: '2nd Year', label: '2nd Year', semesters: ['Semester 3', 'Semester 4'] },
      { id: '3rd Year', label: '3rd Year', semesters: ['Semester 5', 'Semester 6'] }
    ]
  },
  {
    id: 'B.Pharm',
    name: 'B.Pharm',
    label: 'B.Pharm (Bachelor of Pharmacy)',
    education_level: 'Undergraduate',
    scholarship_category: 'Technical / Professional',
    duration_years: 4,
    total_semesters: 8,
    is_engineering: false,
    default_competitive_exam: 'NEET / State CET',
    entry_pathways: ['After 12th (Standard)', 'After D.Pharm (Lateral Entry to 2nd Year)'],
    branches: ['Pharmacy / Pharmaceutical Sciences'],
    years: [
      { id: '1st Year', label: '1st Year', semesters: ['Semester 1', 'Semester 2'] },
      { id: '2nd Year', label: '2nd Year', semesters: ['Semester 3', 'Semester 4'] },
      { id: '3rd Year', label: '3rd Year', semesters: ['Semester 5', 'Semester 6'] },
      { id: '4th Year', label: '4th Year', semesters: ['Semester 7', 'Semester 8'] }
    ]
  },
  {
    id: 'B.Arch',
    name: 'B.Arch',
    label: 'B.Arch (Bachelor of Architecture)',
    education_level: 'Undergraduate',
    scholarship_category: 'Technical / Professional',
    duration_years: 5,
    total_semesters: 10,
    is_engineering: true,
    default_competitive_exam: 'NATA / JEE Main Paper 2',
    entry_pathways: ['After 12th (Standard)'],
    branches: ['Architecture & Design', 'Urban Planning'],
    years: [
      { id: '1st Year', label: '1st Year', semesters: ['Semester 1', 'Semester 2'] },
      { id: '2nd Year', label: '2nd Year', semesters: ['Semester 3', 'Semester 4'] },
      { id: '3rd Year', label: '3rd Year', semesters: ['Semester 5', 'Semester 6'] },
      { id: '4th Year', label: '4th Year', semesters: ['Semester 7', 'Semester 8'] },
      { id: '5th Year', label: '5th Year', semesters: ['Semester 9', 'Semester 10'] }
    ]
  },
  {
    id: 'M.Tech',
    name: 'M.Tech',
    label: 'M.Tech / M.E. (Master of Technology / Engineering)',
    education_level: 'Postgraduate',
    scholarship_category: 'Technical / Professional',
    duration_years: 2,
    total_semesters: 4,
    is_engineering: true,
    default_competitive_exam: 'GATE',
    entry_pathways: ['After B.Tech / B.E.'],
    branches: [
      'Computer Science & Engineering',
      'VLSI & Embedded Systems',
      'Structural Engineering',
      'Thermal & Fluid Engineering',
      'Data Science & AI',
      'Power Systems',
      'Other M.Tech Specialization'
    ],
    years: [
      { id: '1st Year', label: '1st Year (M.Tech)', semesters: ['Semester 1', 'Semester 2'] },
      { id: '2nd Year', label: '2nd Year (M.Tech)', semesters: ['Semester 3', 'Semester 4'] }
    ]
  },
  {
    id: 'MBA',
    name: 'MBA',
    label: 'MBA (Master of Business Administration)',
    education_level: 'Postgraduate',
    scholarship_category: 'Technical / Professional',
    duration_years: 2,
    total_semesters: 4,
    default_competitive_exam: 'CAT / MAT / CMAT',
    entry_pathways: ['After Graduation'],
    branches: [
      'Finance',
      'Marketing',
      'Human Resource Management',
      'Operations & Supply Chain',
      'Business Analytics & IT',
      'General Management'
    ],
    years: [
      { id: '1st Year', label: '1st Year (MBA)', semesters: ['Semester 1', 'Semester 2'] },
      { id: '2nd Year', label: '2nd Year (MBA)', semesters: ['Semester 3', 'Semester 4'] }
    ]
  },
  {
    id: 'M.Sc',
    name: 'M.Sc',
    label: 'M.Sc (Master of Science)',
    education_level: 'Postgraduate',
    scholarship_category: 'Higher Education',
    duration_years: 2,
    total_semesters: 4,
    default_competitive_exam: 'IIT-JAM / CUET-PG',
    entry_pathways: ['After B.Sc'],
    branches: [
      'Physics',
      'Chemistry',
      'Mathematics',
      'Computer Science',
      'Biotechnology',
      'Statistics',
      'Agricultural Sciences'
    ],
    years: [
      { id: '1st Year', label: '1st Year (M.Sc)', semesters: ['Semester 1', 'Semester 2'] },
      { id: '2nd Year', label: '2nd Year (M.Sc)', semesters: ['Semester 3', 'Semester 4'] }
    ]
  },
  {
    id: 'Higher Secondary',
    name: 'Higher Secondary',
    label: 'Class 11 - 12 (Higher Secondary / Intermediate / Pre-University)',
    education_level: 'Higher Secondary',
    scholarship_category: 'Post-Matric',
    duration_years: 2,
    total_semesters: 2,
    entry_pathways: ['After 10th Board'],
    branches: [
      'Science Stream (PCM)',
      'Science Stream (PCB)',
      'Commerce Stream',
      'Arts / Humanities Stream',
      'Vocational Course'
    ],
    years: [
      { id: '11th Standard', label: 'Class 11 (1st Year)', semesters: ['Term 1', 'Term 2 / Annual'] },
      { id: '12th Standard', label: 'Class 12 (2nd Year)', semesters: ['Term 1', 'Term 2 / Board'] }
    ]
  },
  {
    id: 'Secondary',
    name: 'Secondary',
    label: 'Class 9 - 10 (Secondary / Pre-Matric)',
    education_level: 'School',
    scholarship_category: 'Pre-Matric',
    duration_years: 2,
    total_semesters: 2,
    entry_pathways: ['Middle School (Class 8 Passed)'],
    branches: ['General School Curriculum'],
    years: [
      { id: '9th Standard', label: 'Class 9', semesters: ['Annual Term'] },
      { id: '10th Standard', label: 'Class 10', semesters: ['Board Exam'] }
    ]
  },
  {
    id: 'Other / Professional',
    name: 'Other / Professional',
    label: 'Other Degree / Professional Certificate',
    education_level: 'Undergraduate',
    scholarship_category: 'Technical / Professional',
    duration_years: 3,
    total_semesters: 6,
    branches: ['General / Interdisciplinary'],
    years: [
      { id: '1st Year', label: '1st Year', semesters: ['Semester 1', 'Semester 2'] },
      { id: '2nd Year', label: '2nd Year', semesters: ['Semester 3', 'Semester 4'] },
      { id: '3rd Year', label: '3rd Year', semesters: ['Semester 5', 'Semester 6'] },
      { id: '4th Year', label: '4th Year', semesters: ['Semester 7', 'Semester 8'] }
    ]
  }
];

export const INDIAN_STATES_AND_UTS = [
  'Andaman and Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'All India'
];

export const RELIGIONS = [
  'Hindu',
  'Muslim',
  'Christian',
  'Sikh',
  'Buddhist',
  'Jain',
  'Parsi (Zoroastrian)',
  'Other'
];

export const MARITAL_STATUSES = ['Single', 'Married', 'Other'];

export const SCHOLARSHIP_CATEGORIES = [
  'Technical / Professional',
  'Higher Education',
  'Post-Matric',
  'Pre-Matric',
  'Other'
];

export const MODES_OF_STUDY = [
  'Regular',
  'Distance',
  'Online',
  'Part-time',
  'Other'
];

export const INSTITUTION_TYPES = [
  'AICTE Approved Institution',
  'UGC Recognized University / College',
  'Central University / IIT / NIT / IIM',
  'State Government College / University',
  'Other Recognized Institution'
];

export const ADMISSION_TYPES = [
  'Merit / Centralized Counseling',
  'Direct Admission / Institutional Merit',
  'Management Quota'
];

export const DISABILITY_TYPES = [
  'Locomotor / Orthopedic Disability',
  'Visual Impairment (Blindness / Low Vision)',
  'Hearing Impairment (Deaf / Hard of Hearing)',
  'Intellectual Disability / Learning Disability',
  'Cerebral Palsy / Muscular Dystrophy',
  'Multiple Disabilities',
  'Other Certified Disability'
];

export const COMPETITIVE_EXAMS = [
  'JEE Main',
  'JEE Advanced',
  'NEET-UG',
  'State CET / Engineering Entrance',
  'CUET (Common University Entrance Test)',
  'GATE',
  'CAT / MAT / CMAT',
  'CLAT',
  'NATA',
  'Other State / National Entrance',
  'None / Merit-Based Admission'
];

export const PARENT_PROFESSIONS = [
  'Government Service (Central / State)',
  'Agriculture / Farmer / Cultivator',
  'Private Sector Employee',
  'Business / Self-Employed / Professional',
  'Registered Beedi / Cine / Mine Worker',
  'Armed Forces / Paramilitary (Active)',
  'Police Personnel (State / Central)',
  'Railway Employee',
  'Daily Wage Worker / Laborer',
  'Homemaker / Retired / Other'
];

export const EDUCATION_BOARDS = [
  'CBSE (Central Board of Secondary Education)',
  'CISCE (ICSE / ISC)',
  'Maharashtra State Board',
  'Karnataka State Board',
  'Tamil Nadu State Board',
  'Uttar Pradesh State Board',
  'Bihar School Examination Board',
  'West Bengal Board',
  'Rajasthan Board',
  'National Institute of Open Schooling (NIOS)',
  'Other State / Recognized Board'
];

/**
 * Helper to fetch a course configuration by exact or normalized name
 */
export function getCourseConfig(courseName: string): CourseConfig {
  if (!courseName) return ACADEMIC_COURSES[0];
  const clean = courseName.trim().toLowerCase();

  const found = ACADEMIC_COURSES.find(
    (c) =>
      c.id.toLowerCase() === clean ||
      c.name.toLowerCase() === clean ||
      c.label.toLowerCase().includes(clean)
  );

  if (found) return found;

  // Keyword fallbacks
  if (clean.includes('b.tech') || clean.includes('b.e.') || clean.includes('engineering') || clean.includes('technology')) {
    return ACADEMIC_COURSES[0];
  }
  if (clean.includes('diploma') || clean.includes('polytechnic')) {
    return ACADEMIC_COURSES[1];
  }
  if (clean.includes('mbbs') || clean.includes('medical') || clean.includes('doctor')) {
    return ACADEMIC_COURSES[2];
  }
  if (clean.includes('bca') || clean.includes('computer applications')) {
    return ACADEMIC_COURSES[3];
  }
  if (clean.includes('b.sc') || clean.includes('bsc')) {
    return ACADEMIC_COURSES[4];
  }
  if (clean.includes('b.com') || clean.includes('bcom')) {
    return ACADEMIC_COURSES[5];
  }
  if (clean.includes('b.a.') || clean.includes('ba')) {
    return ACADEMIC_COURSES[6];
  }
  if (clean.includes('pharm')) {
    return ACADEMIC_COURSES[7];
  }
  if (clean.includes('arch')) {
    return ACADEMIC_COURSES[8];
  }
  if (clean.includes('m.tech')) {
    return ACADEMIC_COURSES[9];
  }
  if (clean.includes('mba')) {
    return ACADEMIC_COURSES[10];
  }
  if (clean.includes('m.sc')) {
    return ACADEMIC_COURSES[11];
  }
  if (clean.includes('11') || clean.includes('12') || clean.includes('higher secondary')) {
    return ACADEMIC_COURSES[12];
  }
  if (clean.includes('9') || clean.includes('10') || clean.includes('school')) {
    return ACADEMIC_COURSES[13];
  }

  return ACADEMIC_COURSES[0];
}

/**
 * Returns the list of eligible semesters for a given course and selected year
 */
export function getSemestersForYear(courseName: string, yearId: string): string[] {
  const config = getCourseConfig(courseName);
  const matchedYear = config.years.find((y) => y.id === yearId);
  if (matchedYear && matchedYear.semesters.length > 0) {
    return matchedYear.semesters;
  }
  // Default fallback if not found
  return ['Semester 1', 'Semester 2'];
}

export const INDIAN_STATES = INDIAN_STATES_AND_UTS;
export const POPULAR_COURSES = ACADEMIC_COURSES.map((c) => c.name);
