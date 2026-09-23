/**
 * ScholarSync Explainable Three-State Eligibility Engine
 * Grounded in National Scholarship Portal official specifications (AY 2026-27).
 *
 * Implements strict three-state evaluation:
 * - 'satisfied' (✓): Requirement explicitly met by student profile.
 * - 'not_satisfied' (✗): Requirement explicitly failed by student profile.
 * - 'undetermined' (?): Profile lacks required verification data ("Unable to determine — additional information required").
 *
 * Does NOT assume eligibility or invent missing profile parameters.
 */

import {
  CriterionCheck,
  CriterionStatus,
  EligibilityStatus,
  MatchResult,
  Scholarship,
  StudentProfile,
  syncProfileFields
} from '../types/scholarship';

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Course match helper
 */
function isCourseEligible(
  studentCourse: string,
  allowedCourses: string[] | null | undefined
): boolean {
  if (!allowedCourses || allowedCourses.length === 0 || allowedCourses.includes('ALL')) {
    return true;
  }
  const cleanStudent = studentCourse.trim().toLowerCase();
  if (allowedCourses.some((c) => c.trim().toLowerCase() === cleanStudent)) {
    return true;
  }

  // Handle generic B.Tech / B.E.
  if (cleanStudent === 'b.tech / b.e.' || cleanStudent === 'b.tech' || cleanStudent === 'b.e.') {
    // Check if allowed courses has generic B.Tech, Engineering, or Technical Degree
    const hasGenericBtech = allowedCourses.some((c) => {
      const cl = c.trim().toLowerCase();
      return (
        cl === 'b.tech / b.e.' ||
        cl === 'b.tech' ||
        cl === 'b.e.' ||
        cl === 'technical degree' ||
        cl === 'engineering degree'
      );
    });
    if (hasGenericBtech) return true;

    // If allowed courses only have specific agricultural or other sub-fields, reject generic B.Tech
    const hasSpecializedOnly = allowedCourses.every((c) =>
      c.toLowerCase().includes('agricultural') || c.toLowerCase().includes('dairy') || c.toLowerCase().includes('food tech')
    );
    if (hasSpecializedOnly) return false;
  }

  // Technical degree broad match for general AICTE schemes
  const techCourseList = ['b.tech / b.e.', 'diploma', 'm.tech', 'b.arch', 'bca', 'mca', 'b.pharm'];
  const mentionsTechBroad = allowedCourses.some(
    (c) =>
      c.toLowerCase() === 'technical degree' ||
      c.toLowerCase() === 'technical diploma' ||
      c.toLowerCase() === 'professional degree'
  );

  if (mentionsTechBroad && techCourseList.includes(cleanStudent)) {
    return true;
  }

  return false;
}

/**
 * Domicile match helper
 */
function isDomicileEligible(
  studentDomicile: string,
  allowedDomiciles: string[] | null | undefined
): boolean {
  if (!allowedDomiciles || allowedDomiciles.length === 0 || allowedDomiciles.includes('ALL')) {
    return true;
  }
  return allowedDomiciles.some(
    (d) => d.trim().toLowerCase() === studentDomicile.trim().toLowerCase()
  );
}

/**
 * Evaluates a single scholarship against a student profile with explainable 3-state output.
 */
export function evaluateScholarshipEligibility(
  scholarship: Scholarship,
  rawProfile: StudentProfile
): MatchResult {
  const profile = syncProfileFields(rawProfile);
  const checks: CriterionCheck[] = [];
  const rejectionReasons: string[] = [];
  const missingInfoReasons: string[] = [];

  const { eligibility } = scholarship;

  // -------------------------------------------------------------
  // 1. Annual Family Income Check
  // -------------------------------------------------------------
  if (eligibility.income_limit !== null && eligibility.income_limit !== undefined) {
    if (profile.annual_family_income === undefined || profile.annual_family_income === null) {
      const reason = `Unable to determine — additional information required: Family income certificate / amount required (Ceiling: ${formatINR(eligibility.income_limit)}).`;
      checks.push({
        criterion: 'Annual Family Income',
        status: 'undetermined',
        passed: false,
        student_value: 'Not provided',
        required_value: `Up to ${formatINR(eligibility.income_limit)}`,
        reason,
        field_key: 'annual_family_income'
      });
      missingInfoReasons.push(reason);
    } else {
      const satisfied = profile.annual_family_income <= eligibility.income_limit;
      const status: CriterionStatus = satisfied ? 'satisfied' : 'not_satisfied';
      const reason = satisfied
        ? `Family income ${formatINR(profile.annual_family_income)} is within the permissible limit of ${formatINR(eligibility.income_limit)}.`
        : `Family annual income of ${formatINR(profile.annual_family_income)} exceeds the permitted limit of ${formatINR(eligibility.income_limit)}.`;
      checks.push({
        criterion: 'Annual Family Income',
        status,
        passed: satisfied,
        student_value: formatINR(profile.annual_family_income),
        required_value: `Up to ${formatINR(eligibility.income_limit)}`,
        reason,
        field_key: 'annual_family_income'
      });
      if (!satisfied) {
        rejectionReasons.push(reason);
      }
    }
  } else {
    checks.push({
      criterion: 'Annual Family Income',
      status: 'satisfied',
      passed: true,
      student_value: formatINR(profile.annual_family_income || 0),
      required_value: 'No Ceiling Specified',
      reason: 'No parental income ceiling specified in official scheme guidelines.',
      field_key: 'annual_family_income'
    });
  }

  // -------------------------------------------------------------
  // 2. Social Category Check
  // -------------------------------------------------------------
  if (eligibility.category && eligibility.category.length > 0) {
    if (!profile.category) {
      const reason = `Unable to determine — additional information required: Social category not provided (Eligible: ${eligibility.category.join(', ')}).`;
      checks.push({
        criterion: 'Social Category',
        status: 'undetermined',
        passed: false,
        student_value: 'Not provided',
        required_value: eligibility.category.join(' / '),
        reason,
        field_key: 'category'
      });
      missingInfoReasons.push(reason);
    } else {
      const satisfied = eligibility.category.includes(profile.category);
      const status: CriterionStatus = satisfied ? 'satisfied' : 'not_satisfied';
      const reason = satisfied
        ? `Student category (${profile.category}) satisfies the scheme reservation requirements.`
        : `Scholarship is reserved for ${eligibility.category.join(', ')} applicants (Applicant category: ${profile.category}).`;
      checks.push({
        criterion: 'Social Category',
        status,
        passed: satisfied,
        student_value: profile.category,
        required_value: eligibility.category.join(' / '),
        reason,
        field_key: 'category'
      });
      if (!satisfied) {
        rejectionReasons.push(reason);
      }
    }
  } else {
    checks.push({
      criterion: 'Social Category',
      status: 'satisfied',
      passed: true,
      student_value: profile.category || 'Any',
      required_value: 'Open to All Categories',
      reason: 'Open to all categories (General, OBC, SC, ST, EWS) as per official guidelines.',
      field_key: 'category'
    });
  }

  // -------------------------------------------------------------
  // 3. Gender Requirement Check
  // -------------------------------------------------------------
  if (eligibility.gender && eligibility.gender !== 'ANY') {
    if (!profile.gender) {
      const reason = `Unable to determine — additional information required: Applicant gender not specified (Required: ${eligibility.gender}).`;
      checks.push({
        criterion: 'Gender Requirement',
        status: 'undetermined',
        passed: false,
        student_value: 'Not provided',
        required_value: eligibility.gender === 'FEMALE' ? 'Female Only' : eligibility.gender,
        reason,
        field_key: 'gender'
      });
      missingInfoReasons.push(reason);
    } else {
      const satisfied =
        (eligibility.gender === 'FEMALE' && profile.gender === 'Female') ||
        (eligibility.gender === 'MALE' && profile.gender === 'Male');
      const status: CriterionStatus = satisfied ? 'satisfied' : 'not_satisfied';
      const reason = satisfied
        ? `Applicant gender (${profile.gender}) meets the ${eligibility.gender.toLowerCase()} requirement.`
        : `This scheme is exclusively reserved for ${eligibility.gender.toLowerCase()} candidates (Applicant: ${profile.gender}).`;
      checks.push({
        criterion: 'Gender Requirement',
        status,
        passed: satisfied,
        student_value: profile.gender,
        required_value: eligibility.gender === 'FEMALE' ? 'Female Only' : eligibility.gender,
        reason,
        field_key: 'gender'
      });
      if (!satisfied) {
        rejectionReasons.push(reason);
      }
    }
  } else {
    checks.push({
      criterion: 'Gender Requirement',
      status: 'satisfied',
      passed: true,
      student_value: profile.gender || 'Any',
      required_value: 'Open to All Genders',
      reason: 'Open to all genders as per official scheme guidelines.',
      field_key: 'gender'
    });
  }

  // -------------------------------------------------------------
  // 4. Education Level Check
  // -------------------------------------------------------------
  if (eligibility.education_level && eligibility.education_level.length > 0) {
    if (!profile.education_level) {
      const reason = `Unable to determine — additional information required: Education level not specified (Required: ${eligibility.education_level.join(', ')}).`;
      checks.push({
        criterion: 'Education Level',
        status: 'undetermined',
        passed: false,
        student_value: 'Not provided',
        required_value: eligibility.education_level.join(' / '),
        reason,
        field_key: 'education_level'
      });
      missingInfoReasons.push(reason);
    } else {
      const satisfied = eligibility.education_level.includes(profile.education_level);
      const status: CriterionStatus = satisfied ? 'satisfied' : 'not_satisfied';
      const reason = satisfied
        ? `Education level (${profile.education_level}) matches eligible levels (${eligibility.education_level.join(', ')}).`
        : `Applicant education level (${profile.education_level}) is not eligible (Required: ${eligibility.education_level.join(', ')}).`;
      checks.push({
        criterion: 'Education Level',
        status,
        passed: satisfied,
        student_value: profile.education_level,
        required_value: eligibility.education_level.join(' / '),
        reason,
        field_key: 'education_level'
      });
      if (!satisfied) {
        rejectionReasons.push(reason);
      }
    }
  } else {
    checks.push({
      criterion: 'Education Level',
      status: 'satisfied',
      passed: true,
      student_value: profile.education_level || 'Any',
      required_value: 'Not restricted in source',
      reason: 'Education level not explicitly restricted in source listing.',
      field_key: 'education_level'
    });
  }

  // -------------------------------------------------------------
  // 5. Course / Stream Check
  // -------------------------------------------------------------
  if (eligibility.course && eligibility.course.length > 0 && !eligibility.course.includes('ALL')) {
    if (!profile.course) {
      const reason = `Unable to determine — additional information required: Student course not provided (Required: ${eligibility.course.join(', ')}).`;
      checks.push({
        criterion: 'Enrolled Course / Stream',
        status: 'undetermined',
        passed: false,
        student_value: 'Not provided',
        required_value: eligibility.course.slice(0, 3).join(', ') + (eligibility.course.length > 3 ? '...' : ''),
        reason,
        field_key: 'course'
      });
      missingInfoReasons.push(reason);
    } else {
      const satisfied = isCourseEligible(profile.course, eligibility.course);
      const status: CriterionStatus = satisfied ? 'satisfied' : 'not_satisfied';
      const reason = satisfied
        ? `Enrolled course (${profile.course}) meets the approved course curriculum.`
        : `Applicant course (${profile.course}) is not listed in approved courses for this scheme.`;
      checks.push({
        criterion: 'Enrolled Course / Stream',
        status,
        passed: satisfied,
        student_value: profile.course,
        required_value: eligibility.course.slice(0, 3).join(', ') + (eligibility.course.length > 3 ? '...' : ''),
        reason,
        field_key: 'course'
      });
      if (!satisfied) {
        rejectionReasons.push(reason);
      }
    }
  } else {
    checks.push({
      criterion: 'Enrolled Course / Stream',
      status: 'satisfied',
      passed: true,
      student_value: profile.course || 'Any',
      required_value: 'Open to All Approved Courses',
      reason: 'All courses recognized by appropriate regulatory bodies are eligible.',
      field_key: 'course'
    });
  }

  // -------------------------------------------------------------
  // 6. Minimum Academic Percentage / CGPA / Percentile
  // -------------------------------------------------------------
  if (eligibility.minimum_percentage !== null && eligibility.minimum_percentage !== undefined) {
    const isCsss = scholarship.id.includes('CSSS');
    const isUgPgMerit = scholarship.id.includes('UGC-PG-MERIT');
    const isNmms = scholarship.id.includes('NMMS') || scholarship.id.includes('PRE-MATRIC');
    const isDiplomaScheme = scholarship.id.includes('DIP');
    const isRenewal = profile.application_type === 'Renewal';

    // Determine target qualification & score
    let targetExamLabel = 'Qualifying Examination';
    let relevantScore: number | undefined = undefined;

    if (isCsss) {
      targetExamLabel = 'Class 12 Board Examination';
      relevantScore = profile.twelfth_percentage || profile.academic_percentage;
    } else if (isUgPgMerit) {
      targetExamLabel = 'Undergraduate Qualifying Degree';
      relevantScore = profile.ug_percentage || profile.academic_percentage;
    } else if (isNmms) {
      targetExamLabel = 'Class 8 / 10 Board Examination';
      relevantScore = profile.tenth_percentage || profile.academic_percentage;
    } else if (isDiplomaScheme) {
      targetExamLabel = 'Class 10 Board Examination';
      relevantScore = profile.tenth_percentage || profile.academic_percentage;
    } else if (isRenewal) {
      targetExamLabel = 'Previous Semester / Academic Year Examination';
      relevantScore =
        profile.previous_semester_score ||
        profile.previous_academic_year_score ||
        (profile.cgpa ? profile.cgpa * 9.5 : undefined) ||
        profile.academic_percentage;
    } else {
      // General course-based qualification
      if (profile.education_level === 'Postgraduate' || profile.education_level === 'Doctoral') {
        targetExamLabel = 'Undergraduate Qualifying Degree';
        relevantScore = profile.ug_percentage || profile.academic_percentage;
      } else if (profile.education_level === 'Undergraduate') {
        if (profile.entry_pathway === 'Diploma') {
          targetExamLabel = 'Diploma (Lateral Entry Qualification)';
          relevantScore = profile.diploma_percentage || profile.academic_percentage;
        } else {
          targetExamLabel = 'Class 12 Board Examination';
          relevantScore = profile.twelfth_percentage || profile.academic_percentage;
        }
      } else {
        targetExamLabel = 'Qualifying Examination';
        relevantScore = profile.academic_percentage;
      }
    }

    if (relevantScore === undefined || relevantScore === null || relevantScore === 0) {
      const reason = `Unable to determine — additional information required: ${targetExamLabel} marks / percentage required (Minimum cutoff: ${eligibility.minimum_percentage}%).`;
      checks.push({
        criterion: `Academic Merit Cutoff (${targetExamLabel})`,
        status: 'undetermined',
        passed: false,
        student_value: 'Not provided',
        required_value: `Minimum ${eligibility.minimum_percentage}% in ${targetExamLabel}`,
        reason,
        field_key: isCsss ? 'twelfth_percentage' : isUgPgMerit ? 'ug_percentage' : 'academic_percentage'
      });
      missingInfoReasons.push(reason);
    } else {
      // Check for CSSS 80th percentile condition
      if (isCsss) {
        if (profile.board_percentile_80th === false) {
          const reason = `Applicant is not in the top 20th percentile (>= 80th percentile) of the Class 12 Board examination.`;
          checks.push({
            criterion: 'Class 12 Board Percentile',
            status: 'not_satisfied',
            passed: false,
            student_value: `${relevantScore}% (Below 80th percentile)`,
            required_value: 'Above 80th Percentile of State/Central Board',
            reason,
            field_key: 'board_percentile_80th'
          });
          rejectionReasons.push(reason);
        } else if (profile.board_percentile_80th === null || profile.board_percentile_80th === undefined) {
          const reason = `Unable to determine — additional information required: Class 12 Board percentile status (Must be above 80th percentile of relevant Board).`;
          checks.push({
            criterion: 'Class 12 Board Percentile',
            status: 'undetermined',
            passed: false,
            student_value: 'Percentile declaration pending',
            required_value: 'Above 80th Percentile of State/Central Board',
            reason,
            field_key: 'board_percentile_80th'
          });
          missingInfoReasons.push(reason);
        } else {
          checks.push({
            criterion: 'Class 12 Board Percentile',
            status: 'satisfied',
            passed: true,
            student_value: 'Above 80th Percentile (Declared)',
            required_value: 'Above 80th Percentile of State/Central Board',
            reason: 'Applicant is in the top 20th percentile of the qualifying board examination.',
            field_key: 'board_percentile_80th'
          });
        }
      }

      // Check Backlogs / ATKT for continuing or renewal students
      if ((isRenewal || profile.year_of_study !== '1st Year') && profile.has_backlogs) {
        const backlogCount = profile.backlogs_count || 1;
        const reason = `Candidate has active backlogs / ATKT (${backlogCount} paper${backlogCount > 1 ? 's' : ''}). Scheme requires passing all examinations without arrears.`;
        checks.push({
          criterion: 'No Active Backlogs / ATKT',
          status: 'not_satisfied',
          passed: false,
          student_value: `${backlogCount} Backlog(s)`,
          required_value: '0 Backlogs / Regular Pass',
          reason,
          field_key: 'has_backlogs'
        });
        rejectionReasons.push(reason);
      }

      const satisfied = relevantScore >= eligibility.minimum_percentage;
      const status: CriterionStatus = satisfied ? 'satisfied' : 'not_satisfied';
      const reason = satisfied
        ? `${targetExamLabel} score (${relevantScore}%) satisfies the minimum cutoff of ${eligibility.minimum_percentage}%.`
        : `${targetExamLabel} score (${relevantScore}%) is below the mandatory threshold of ${eligibility.minimum_percentage}%.`;
      checks.push({
        criterion: `Academic Merit Cutoff (${targetExamLabel})`,
        status,
        passed: satisfied,
        student_value: `${relevantScore}%`,
        required_value: `Minimum ${eligibility.minimum_percentage}% in ${targetExamLabel}`,
        reason,
        field_key: isCsss ? 'twelfth_percentage' : 'academic_percentage'
      });
      if (!satisfied) {
        rejectionReasons.push(reason);
      }
    }
  } else {
    checks.push({
      criterion: 'Academic Merit Cutoff',
      status: 'satisfied',
      passed: true,
      student_value: `${profile.academic_percentage || profile.twelfth_percentage || 0}%`,
      required_value: 'Admission in Approved Seat',
      reason: 'No fixed percentage cutoff beyond admission in approved seat.',
      field_key: 'academic_percentage'
    });
  }

  // -------------------------------------------------------------
  // 7. State Domicile & Region Check
  // -------------------------------------------------------------
  if (eligibility.state_domicile && eligibility.state_domicile.length > 0 && !eligibility.state_domicile.includes('ALL')) {
    if (!profile.state_domicile) {
      const reason = `Unable to determine — additional information required: State of domicile not specified (Required: ${eligibility.state_domicile.join(', ')}).`;
      checks.push({
        criterion: 'State / Regional Domicile',
        status: 'undetermined',
        passed: false,
        student_value: 'Not provided',
        required_value: eligibility.state_domicile.join(' / '),
        reason,
        field_key: 'state_domicile'
      });
      missingInfoReasons.push(reason);
    } else {
      const satisfied = isDomicileEligible(profile.state_domicile, eligibility.state_domicile);
      const status: CriterionStatus = satisfied ? 'satisfied' : 'not_satisfied';
      const reason = satisfied
        ? `Domicile state (${profile.state_domicile}) is eligible for this scheme.`
        : `Applicant domicile (${profile.state_domicile}) is not eligible (Required: ${eligibility.state_domicile.join(', ')}).`;
      checks.push({
        criterion: 'State / Regional Domicile',
        status,
        passed: satisfied,
        student_value: profile.state_domicile,
        required_value: eligibility.state_domicile.join(' / '),
        reason,
        field_key: 'state_domicile'
      });
      if (!satisfied) {
        rejectionReasons.push(reason);
      }
    }
  } else {
    checks.push({
      criterion: 'State / Regional Domicile',
      status: 'satisfied',
      passed: true,
      student_value: profile.state_domicile || 'All India',
      required_value: 'All India (All States & UTs)',
      reason: 'All Indian citizens with bonafide enrollment are eligible.',
      field_key: 'state_domicile'
    });
  }

  // -------------------------------------------------------------
  // 8. Disability Requirement & Benchmark Percentage
  // -------------------------------------------------------------
  if (eligibility.disability_required === true) {
    if (!profile.is_disabled) {
      const reason = 'Scheme is strictly reserved for Specially Abled Students with benchmark disability of 40% or more.';
      checks.push({
        criterion: 'Benchmark Disability Requirement',
        status: 'not_satisfied',
        passed: false,
        student_value: 'Non-disabled',
        required_value: 'Disability Certificate >= 40%',
        reason,
        field_key: 'is_disabled'
      });
      rejectionReasons.push(reason);
    } else {
      const minPercentage = eligibility.minimum_disability_percentage || 40;
      if (profile.disability_percentage === undefined || profile.disability_percentage === null) {
        const reason = `Unable to determine — additional information required: UDID / Disability percentage certificate required (Benchmark: >= ${minPercentage}%).`;
        checks.push({
          criterion: 'Benchmark Disability Percentage',
          status: 'undetermined',
          passed: false,
          student_value: 'Disability declared, percentage unspecified',
          required_value: `>= ${minPercentage}% Disability`,
          reason,
          field_key: 'disability_percentage'
        });
        missingInfoReasons.push(reason);
      } else {
        const satisfied = profile.disability_percentage >= minPercentage;
        const status: CriterionStatus = satisfied ? 'satisfied' : 'not_satisfied';
        const reason = satisfied
          ? `Disability percentage (${profile.disability_percentage}%) satisfies the official benchmark threshold of ${minPercentage}%.`
          : `Certified disability (${profile.disability_percentage}%) is below the statutory benchmark cutoff of ${minPercentage}%.`;
        checks.push({
          criterion: 'Benchmark Disability Percentage',
          status,
          passed: satisfied,
          student_value: `${profile.disability_percentage}%`,
          required_value: `>= ${minPercentage}% Disability`,
          reason,
          field_key: 'disability_percentage'
        });
        if (!satisfied) {
          rejectionReasons.push(reason);
        }
      }
    }
  } else {
    checks.push({
      criterion: 'Disability Requirement',
      status: 'satisfied',
      passed: true,
      student_value: profile.is_disabled ? `Specially Abled (${profile.disability_percentage || '40'}%)` : 'Non-disabled',
      required_value: 'No Disability Mandate',
      reason: 'No mandatory disability requirement specified for this scheme.',
      field_key: 'disability_required'
    });
  }

  // -------------------------------------------------------------
  // 9. Institution Requirements (e.g. AICTE / UGC Approved)
  // -------------------------------------------------------------
  if (eligibility.institution_requirements && eligibility.institution_requirements.length > 0) {
    const reqText = eligibility.institution_requirements[0];
    const reqLower = reqText.toLowerCase();

    if (!profile.institution_type) {
      // Profile has not supplied institution accreditation information
      const reason = `Unable to determine — additional information required: Institution accreditation proof (${reqText}).`;
      checks.push({
        criterion: 'Institution Accreditation',
        status: 'undetermined',
        passed: false,
        student_value: 'Not provided',
        required_value: reqText,
        reason,
        field_key: 'institution_type'
      });
      missingInfoReasons.push(reason);
    } else {
      const instLower = profile.institution_type.toLowerCase();
      let satisfied = false;

      const isMultiRegulatory =
        reqLower.includes('/') ||
        reqLower.includes('respective regulatory body') ||
        reqLower.includes('or') ||
        (reqLower.includes('aicte') && reqLower.includes('ugc'));

      if (isMultiRegulatory) {
        // Disjunctive OR: approved by ANY respective regulatory council (AICTE / UGC / NMC / DCI / Central / State)
        satisfied =
          instLower.includes('aicte') ||
          instLower.includes('ugc') ||
          instLower.includes('central') ||
          instLower.includes('state') ||
          instLower.includes('government') ||
          instLower.includes('autonomous') ||
          instLower.includes('deemed') ||
          instLower.includes('institute') ||
          instLower.includes('university') ||
          instLower.includes('college');
      } else if (reqLower.includes('aicte')) {
        satisfied = instLower.includes('aicte') || instLower.includes('technical');
      } else if (reqLower.includes('ugc') || reqLower.includes('2(f)')) {
        satisfied =
          instLower.includes('ugc') ||
          instLower.includes('central') ||
          instLower.includes('university') ||
          instLower.includes('state');
      } else if (reqLower.includes('isi') || reqLower.includes('indian statistical institute')) {
        satisfied =
          profile.institute_name?.toLowerCase().includes('isi') ||
          profile.institute_name?.toLowerCase().includes('indian statistical institute') ||
          false;
      } else {
        // General recognized institution
        satisfied = true;
      }

      const status: CriterionStatus = satisfied ? 'satisfied' : 'not_satisfied';
      const reason = satisfied
        ? `Institution type (${profile.institution_type}) fulfills statutory recognition/accreditation criteria.`
        : `Scheme requires enrollment in: ${reqText} (Student institution: ${profile.institution_type}).`;
      checks.push({
        criterion: 'Institution Accreditation',
        status,
        passed: satisfied,
        student_value: profile.institution_type,
        required_value: reqText,
        reason,
        field_key: 'institution_type'
      });
      if (!satisfied) {
        rejectionReasons.push(reason);
      }
    }
  }

  // -------------------------------------------------------------
  // 10. Family Conditions (e.g., Pragati Max 2 Girl Children)
  // -------------------------------------------------------------
  if (eligibility.family_conditions && eligibility.family_conditions.length > 0) {
    for (const condition of eligibility.family_conditions) {
      if (condition.toLowerCase().includes('two girl children') || condition.toLowerCase().includes('max 2 girl')) {
        if (profile.family_girl_children_count === undefined || profile.family_girl_children_count === null) {
          const reason = 'Unable to determine — additional information required: Declaration of number of girl children in family (Maximum 2 eligible).';
          checks.push({
            criterion: 'Family Girl Children Limit',
            status: 'undetermined',
            passed: false,
            student_value: 'Declaration not submitted',
            required_value: 'Max 2 Girl Children per Family',
            reason,
            field_key: 'family_girl_children_count'
          });
          missingInfoReasons.push(reason);
        } else {
          const satisfied = profile.family_girl_children_count <= 2;
          const status: CriterionStatus = satisfied ? 'satisfied' : 'not_satisfied';
          const reason = satisfied
            ? `Family girl children count (${profile.family_girl_children_count}) is within the permissible limit of 2.`
            : `Exceeds statutory limit of maximum 2 girl children per family (Declared: ${profile.family_girl_children_count}).`;
          checks.push({
            criterion: 'Family Girl Children Limit',
            status,
            passed: satisfied,
            student_value: `${profile.family_girl_children_count} girl child(ren)`,
            required_value: 'Max 2 Girl Children per Family',
            reason,
            field_key: 'family_girl_children_count'
          });
          if (!satisfied) {
            rejectionReasons.push(reason);
          }
        }
      } else if (condition.toLowerCase().includes('orphan') || condition.toLowerCase().includes('covid')) {
        // AICTE Swanath scheme
        const isSwanathQualified =
          profile.orphan_status === true ||
          profile.covid_affected_orphan === true ||
          profile.special_conditions.includes('Orphan') ||
          profile.special_conditions.includes('COVID Affected');

        if (profile.orphan_status === false && profile.covid_affected_orphan === false) {
          const reason = 'Scheme is strictly for Orphans, COVID-19 orphaned students, or wards of martyred Armed Forces/CAPFs.';
          checks.push({
            criterion: 'Swanath Welfare Category',
            status: 'not_satisfied',
            passed: false,
            student_value: 'Not applicable',
            required_value: 'Orphan / COVID Orphan / Martyr Ward',
            reason,
            field_key: 'orphan_status'
          });
          rejectionReasons.push(reason);
        } else if (isSwanathQualified) {
          checks.push({
            criterion: 'Swanath Welfare Category',
            status: 'satisfied',
            passed: true,
            student_value: 'Eligible Special Category Declared',
            required_value: 'Orphan / COVID Orphan / Martyr Ward',
            reason: 'Candidate meets the Swanath welfare beneficiary criteria.',
            field_key: 'orphan_status'
          });
        } else {
          const reason = 'Unable to determine — additional information required: Proof of orphan status, COVID death certificates of parents, or martyr certificate required.';
          checks.push({
            criterion: 'Swanath Welfare Category',
            status: 'undetermined',
            passed: false,
            student_value: 'Not verified',
            required_value: 'Orphan / COVID Orphan / Martyr Ward',
            reason,
            field_key: 'orphan_status'
          });
          missingInfoReasons.push(reason);
        }
      }
    }
  }

  // -------------------------------------------------------------
  // 11. Special Category Requirements (e.g., Police Martyr / CAPF / Railway / Beedi Workers)
  // -------------------------------------------------------------
  if (eligibility.special_category_requirements && eligibility.special_category_requirements.length > 0) {
    for (const specReq of eligibility.special_category_requirements) {
      const lower = specReq.toLowerCase();

      // Railway quota check
      if (lower.includes('railway')) {
        const matchesRailway =
          profile.ward_of_railway_employee === true ||
          profile.special_conditions.some((sc) => sc.toLowerCase().includes('railway'));

        if (profile.ward_of_railway_employee === false) {
          const reason = `Candidate is not a dependent child of a Railway employee/martyr.`;
          checks.push({
            criterion: 'Railway Personnel Dependent Quota',
            status: 'not_satisfied',
            passed: false,
            student_value: 'No',
            required_value: specReq,
            reason,
            field_key: 'ward_of_railway_employee'
          });
          rejectionReasons.push(reason);
        } else if (matchesRailway) {
          checks.push({
            criterion: 'Railway Personnel Dependent Quota',
            status: 'satisfied',
            passed: true,
            student_value: 'Yes (Declared)',
            required_value: specReq,
            reason: 'Candidate meets the Railway personnel dependent criterion.',
            field_key: 'ward_of_railway_employee'
          });
        } else {
          const reason = `Unable to determine — additional information required: Railway employee service/pension certificate or dependent ID.`;
          checks.push({
            criterion: 'Railway Personnel Dependent Quota',
            status: 'undetermined',
            passed: false,
            student_value: 'Pending verification',
            required_value: specReq,
            reason,
            field_key: 'ward_of_railway_employee'
          });
          missingInfoReasons.push(reason);
        }
      }
      // Beedi / Cine / Mine worker check
      else if (lower.includes('beedi') || lower.includes('cine') || lower.includes('mine') || lower.includes('iomc') || lower.includes('lsdm')) {
        const matchesBeedi =
          profile.beedi_cine_worker_ward === true ||
          profile.special_conditions.some((sc) => sc.toLowerCase().includes('beedi') || sc.toLowerCase().includes('cine'));

        if (profile.beedi_cine_worker_ward === false) {
          const reason = `Candidate's parent is not a registered Beedi, Cine, or Mine worker.`;
          checks.push({
            criterion: 'Beedi / Cine / Mine Worker Ward Quota',
            status: 'not_satisfied',
            passed: false,
            student_value: 'No',
            required_value: specReq,
            reason,
            field_key: 'beedi_cine_worker_ward'
          });
          rejectionReasons.push(reason);
        } else if (matchesBeedi) {
          checks.push({
            criterion: 'Beedi / Cine / Mine Worker Ward Quota',
            status: 'satisfied',
            passed: true,
            student_value: 'Yes (Declared)',
            required_value: specReq,
            reason: 'Applicant is a certified ward of a registered worker.',
            field_key: 'beedi_cine_worker_ward'
          });
        } else {
          const reason = `Unable to determine — additional information required: Identity card / registration proof of Beedi/Cine/Mine worker parent.`;
          checks.push({
            criterion: 'Beedi / Cine / Mine Worker Ward Quota',
            status: 'undetermined',
            passed: false,
            student_value: 'Pending verification',
            required_value: specReq,
            reason,
            field_key: 'beedi_cine_worker_ward'
          });
          missingInfoReasons.push(reason);
        }
      }
      // Police / CAPF / Armed forces martyr check
      else if (lower.includes('martyr') || lower.includes('police') || lower.includes('capf')) {
        const matchesCondition =
          profile.ward_of_armed_forces_martyr === true ||
          profile.special_conditions.includes('Ward of Armed Forces') ||
          profile.special_conditions.some((sc) => sc.toLowerCase().includes('martyr') || sc.toLowerCase().includes('police'));

        if (profile.ward_of_armed_forces_martyr === false) {
          const reason = `Candidate is not a ward/dependent of martyred personnel as required by ${scholarship.name}.`;
          checks.push({
            criterion: 'Special Martyr / Defense Category',
            status: 'not_satisfied',
            passed: false,
            student_value: 'No martyr relationship',
            required_value: specReq,
            reason,
            field_key: 'ward_of_armed_forces_martyr'
          });
          rejectionReasons.push(reason);
        } else if (matchesCondition) {
          checks.push({
            criterion: 'Special Martyr / Defense Category',
            status: 'satisfied',
            passed: true,
            student_value: 'Ward / Dependent of Personnel',
            required_value: specReq,
            reason: 'Applicant meets the specific martyr/defense personnel category requirement.',
            field_key: 'ward_of_armed_forces_martyr'
          });
        } else {
          const reason = `Unable to determine — additional information required: Service / Martyrdom verification certificate (${specReq}).`;
          checks.push({
            criterion: 'Special Martyr / Defense Category',
            status: 'undetermined',
            passed: false,
            student_value: 'Verification pending',
            required_value: specReq,
            reason,
            field_key: 'ward_of_armed_forces_martyr'
          });
          missingInfoReasons.push(reason);
        }
      }
      // ICAR / Agricultural University Check
      else if (lower.includes('icar') || lower.includes('agricultural university')) {
        const isAgriCourse =
          profile.course?.toLowerCase().includes('agri') ||
          profile.course?.toLowerCase().includes('horti') ||
          profile.course?.toLowerCase().includes('veterinary') ||
          profile.course?.toLowerCase().includes('fisher') ||
          profile.branch?.toLowerCase().includes('agri');
        const tookIcarExam = profile.competitive_exam_name?.toUpperCase().includes('ICAR');

        if (isAgriCourse || tookIcarExam) {
          checks.push({
            criterion: 'ICAR Accredited Admission',
            status: 'satisfied',
            passed: true,
            student_value: profile.course || 'Agricultural Degree',
            required_value: specReq,
            reason: 'Candidate is enrolled in an eligible ICAR agricultural program or qualified via ICAR entrance.',
            field_key: 'course'
          });
        } else {
          const reason = `This scheme is exclusively for students admitted to accredited Agricultural Universities via ICAR AIEEA (Applicant course: ${profile.course || 'Non-agricultural'}).`;
          checks.push({
            criterion: 'ICAR Accredited Admission',
            status: 'not_satisfied',
            passed: false,
            student_value: profile.course || 'Non-agricultural',
            required_value: specReq,
            reason,
            field_key: 'course'
          });
          rejectionReasons.push(reason);
        }
      }
      // Indian Statistical Institute (ISI) Check
      else if (lower.includes('indian statistical institute') || lower.includes('isi')) {
        const isIsi =
          profile.institute_name?.toLowerCase().includes('indian statistical institute') ||
          profile.institute_name?.toLowerCase().includes('isi') ||
          profile.course === 'B.Stat' ||
          profile.course === 'B.Math' ||
          profile.course === 'M.Stat';

        if (isIsi) {
          checks.push({
            criterion: 'ISI Enrolled Student',
            status: 'satisfied',
            passed: true,
            student_value: profile.institute_name || profile.course,
            required_value: specReq,
            reason: 'Candidate is verified as an enrolled student at the Indian Statistical Institute.',
            field_key: 'institute_name'
          });
        } else {
          const reason = `This scheme is exclusively for students enrolled at the Indian Statistical Institute (ISI Kolkata/Delhi/Bangalore).`;
          checks.push({
            criterion: 'ISI Enrolled Student',
            status: 'not_satisfied',
            passed: false,
            student_value: profile.institute_name || 'Other Institution',
            required_value: specReq,
            reason,
            field_key: 'institute_name'
          });
          rejectionReasons.push(reason);
        }
      }
      // North Eastern Region (NER) Residency Check
      else if (lower.includes('north eastern') || lower.includes('ner')) {
        const nerStates = [
          'assam',
          'arunachal pradesh',
          'manipur',
          'meghalaya',
          'mizoram',
          'nagaland',
          'sikkim',
          'tripura'
        ];
        const isNer = nerStates.includes((profile.state_domicile || '').toLowerCase());

        if (isNer) {
          checks.push({
            criterion: 'North Eastern Region Domicile',
            status: 'satisfied',
            passed: true,
            student_value: profile.state_domicile,
            required_value: 'NER State Permanent Resident',
            reason: `Applicant has verified permanent residency in ${profile.state_domicile} (NER).`,
            field_key: 'state_domicile'
          });
        } else {
          const reason = `This scholarship is restricted to permanent residents of the 8 North Eastern States (Applicant: ${profile.state_domicile || 'Non-NER'}).`;
          checks.push({
            criterion: 'North Eastern Region Domicile',
            status: 'not_satisfied',
            passed: false,
            student_value: profile.state_domicile || 'All India',
            required_value: 'NER State Permanent Resident',
            reason,
            field_key: 'state_domicile'
          });
          rejectionReasons.push(reason);
        }
      }
      // Top Class Institution Check (IIT, NIT, AIIMS, IIM, NLU, etc.)
      else if (lower.includes('top class institution') || lower.includes('top class college')) {
        const isTopClass =
          profile.institution_type === 'Centrally Funded Technical Institute (CFTI / IIT / NIT)' ||
          profile.institution_type?.includes('Autonomous') ||
          profile.institute_name?.toLowerCase().includes('iit') ||
          profile.institute_name?.toLowerCase().includes('nit') ||
          profile.institute_name?.toLowerCase().includes('iiit') ||
          profile.institute_name?.toLowerCase().includes('aiims') ||
          profile.institute_name?.toLowerCase().includes('iim');

        if (isTopClass) {
          checks.push({
            criterion: 'Notified Top Class Institution',
            status: 'satisfied',
            passed: true,
            student_value: profile.institution_type || 'CFTI / Top Class',
            required_value: specReq,
            reason: 'Applicant is admitted to a notified Top Class institution.',
            field_key: 'institution_type'
          });
        } else {
          const reason = `Scheme is exclusively for students admitted to notified Top Class Institutions (IITs, NITs, AIIMS, IIMs, Central Universities).`;
          checks.push({
            criterion: 'Notified Top Class Institution',
            status: 'not_satisfied',
            passed: false,
            student_value: profile.institution_type || 'General Institution',
            required_value: specReq,
            reason,
            field_key: 'institution_type'
          });
          rejectionReasons.push(reason);
        }
      }
      // Coaching Enrollment Check
      else if (lower.includes('coaching')) {
        const isInCoaching = profile.special_conditions?.some((sc) => sc.toLowerCase().includes('coaching'));
        if (isInCoaching) {
          checks.push({
            criterion: 'Empaneled Coaching Enrollment',
            status: 'satisfied',
            passed: true,
            student_value: 'Enrolled',
            required_value: specReq,
            reason: 'Candidate is enrolled in an approved competitive exam coaching program.',
            field_key: 'special_conditions'
          });
        } else {
          const reason = `This welfare scheme is exclusively for students enrolled in empaneled coaching institutes for competitive exam preparation.`;
          checks.push({
            criterion: 'Empaneled Coaching Enrollment',
            status: 'not_satisfied',
            passed: false,
            student_value: 'Not enrolled in coaching',
            required_value: specReq,
            reason,
            field_key: 'special_conditions'
          });
          rejectionReasons.push(reason);
        }
      }
    }
  }

  // -------------------------------------------------------------
  // 12. Admission Mode Verification (Management Quota disqualification)
  // -------------------------------------------------------------
  if (profile.admission_type === 'Management Quota') {
    // Most government and AICTE/UGC schemes exclude management/paid quota admissions
    const schemeRequiresMerit =
      scholarship.classification === 'AICTE' ||
      scholarship.classification === 'Central Sector' ||
      (scholarship.selection?.selection_criteria && scholarship.selection.selection_criteria.toLowerCase().includes('merit'));

    if (schemeRequiresMerit) {
      const reason = `Admission via Management Quota is not eligible for this government/institutional merit scheme.`;
      checks.push({
        criterion: 'Admission Quota Verification',
        status: 'not_satisfied',
        passed: false,
        student_value: profile.admission_type,
        required_value: 'Merit / Centralized Counseling',
        reason,
        field_key: 'admission_type'
      });
      rejectionReasons.push(reason);
    }
  }

  // -------------------------------------------------------------
  // 13. Year of Study Verification (e.g., Pragati/Saksham fresh 1st year or 2nd yr lateral)
  // -------------------------------------------------------------
  if (scholarship.classification === 'AICTE' && profile.year_of_study) {
    const isRenewal = profile.application_type === 'Renewal';
    const isLateralEntry =
      profile.year_of_study.toLowerCase().includes('lateral') ||
      (profile.admission_type && profile.admission_type.toLowerCase().includes('lateral')) ||
      profile.entry_pathway === 'Diploma';
    const isFirstYear = profile.year_of_study.includes('1st Year');

    if (!isRenewal && !isFirstYear && !isLateralEntry) {
      const reason = `Fresh AICTE application requires candidate to be in 1st Year or 2nd Year (Lateral Entry) only. (Current: ${profile.year_of_study}).`;
      checks.push({
        criterion: 'Eligible Year of Study',
        status: 'not_satisfied',
        passed: false,
        student_value: profile.year_of_study,
        required_value: '1st Year or 2nd Year Lateral Entry (or Renewal)',
        reason,
        field_key: 'year_of_study'
      });
      rejectionReasons.push(reason);
    } else {
      checks.push({
        criterion: 'Eligible Year of Study',
        status: 'satisfied',
        passed: true,
        student_value: profile.year_of_study,
        required_value: isRenewal ? 'Renewal (Any Year of Study)' : '1st Year or 2nd Year Lateral Entry',
        reason: isRenewal
          ? `Continuing candidate eligible for renewal in ${profile.year_of_study}.`
          : `Candidate is in an eligible admission entry year (${profile.year_of_study}).`,
        field_key: 'year_of_study'
      });
    }
  }

  // -------------------------------------------------------------
  // Final Evaluation Synthesis: Three-State Resolution
  // -------------------------------------------------------------
  const hasRejection = checks.some((c) => c.status === 'not_satisfied');
  const hasUndetermined = checks.some((c) => c.status === 'undetermined');

  let status: EligibilityStatus;
  if (hasRejection) {
    status = 'not_eligible';
  } else if (hasUndetermined) {
    status = 'undetermined';
  } else {
    status = 'eligible';
  }

  const satisfiedCount = checks.filter((c) => c.status === 'satisfied').length;
  const matchScore = Math.round((satisfiedCount / checks.length) * 100);

  return {
    scholarship,
    status,
    eligible: status === 'eligible',
    criteria_checks: checks,
    rejection_reasons: rejectionReasons,
    missing_info_reasons: missingInfoReasons,
    match_score: matchScore
  };
}

/**
 * Evaluates all scholarships against student profile
 */
export function evaluateAllScholarships(
  scholarships: Scholarship[],
  profile: StudentProfile
): {
  eligible: MatchResult[];
  undetermined: MatchResult[];
  ineligible: MatchResult[];
  all: MatchResult[];
} {
  const all = scholarships.map((s) => evaluateScholarshipEligibility(s, profile));
  const eligible = all.filter((r) => r.status === 'eligible');
  const undetermined = all.filter((r) => r.status === 'undetermined');
  const ineligible = all.filter((r) => r.status === 'not_eligible');

  return { eligible, undetermined, ineligible, all };
}

/**
 * Backward-compatible alias for evaluateAllScholarships
 */
export const runEligibilityEngine = evaluateAllScholarships;
