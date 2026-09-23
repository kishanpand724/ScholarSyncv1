#!/usr/bin/env python3
"""
Official NSP Scheme Details Database (AY 2026-27)
Grounded strictly in official guidelines published on https://scholarships.gov.in/All-Scholarships
"""

SCHEME_DETAILS = {
    "NSP-MHA-PMSS-POLICE-2026": {
        "description": "Prime Minister's Scholarship Scheme for wards of State/UT Police personnel who were martyred during terror or naxal attacks, administered by the Welfare and Rehabilitation Board (WARB), Ministry of Home Affairs.",
        "eligibility": {
            "income_limit": None,
            "income_limit_description": "No income ceiling specified in official guidelines.",
            "category": None,
            "category_description": "Open to all categories (General, OBC, SC, ST, EWS).",
            "course": ["B.Tech / B.E.", "MBBS", "BDS", "B.Pharm", "B.Sc Nursing", "B.V.Sc", "MCA", "MBA"],
            "course_description": "First professional degree courses recognized by respective regulatory councils (AICTE, NMC, DCI, PCI, etc.). Not applicable for diploma or master courses except MCA/MBA.",
            "education_level": ["Undergraduate", "Postgraduate"],
            "education_level_description": "Professional Undergraduate Degree or approved professional Master's degree.",
            "minimum_percentage": 60.0,
            "percentage_description": "Minimum 60% marks in 10+2 / Diploma / Graduation as qualifying exam.",
            "cgpa_requirement": "Equivalent to 60% as per university conversion formula.",
            "gender": "ANY",
            "gender_description": "Open to all genders.",
            "state_domicile": None,
            "state_domicile_description": "All India (States and Union Territories).",
            "region_specific_conditions": None,
            "disability_required": None,
            "minimum_disability_percentage": None,
            "disability_description": "Not specified in source as mandatory requirement.",
            "year_of_study": "1st Year (fresh admission)",
            "admission_type": "Regular full-time admission in recognized university/institute.",
            "institution_requirements": ["Institution must be recognized by respective regulatory body (AICTE/UGC/MCI/DCI).", "Distance education / correspondence degrees are not eligible."],
            "family_conditions": ["Exclusively for dependent wards and widows of State/UT Police personnel martyred in terror/naxal attacks."],
            "number_of_beneficiaries_limit": "500 fresh scholarships annually (250 for boys, 250 for girls).",
            "age_requirement": "Not specified in source.",
            "special_category_requirements": ["Wards of State/UT Police Personnel Martyred during Terror / Naxal Attacks"],
            "other_conditions": ["Applicable for single degree course only. Student cannot claim scholarship for subsequent second degree."]
        },
        "selection": {
            "selection_criteria": "Merit list prepared based on normalized marks obtained in 10+2 / diploma / graduation.",
            "merit_criteria": "Percentage scored in Minimum Educational Qualification (MEQ).",
            "ranking_method": "In case of tie in percentage, elder applicant by date of birth is ranked higher.",
            "selection_priority": "Order of Priority: Priority I (Wards of personnel killed in action), followed by subsequent priorities as specified in WARB guidelines.",
            "state_wise_allocation": "Quota allocated state-wise as per ministerial schedule.",
            "renewal_conditions": "Must secure minimum 50% marks in each academic year to continue scholarship."
        },
        "benefits": {
            "amount": 36000,
            "amount_per_interval": "₹3,000 per month for girls (₹36,000/yr) and ₹2,500 per month for boys (₹30,000/yr)",
            "fee_reimbursement": "Not separate; paid as consolidated stipend.",
            "maintenance_allowance": "Included in monthly stipend.",
            "books_equipment_allowance": None,
            "components": [
                {"title": "Girls Monthly Stipend", "amount": 36000, "description": "₹3,000 per month paid annually via DBT", "interval": "per_year"},
                {"title": "Boys Monthly Stipend", "amount": 30000, "description": "₹2,500 per month paid annually via DBT", "interval": "per_year"}
            ],
            "maximum_duration": "Up to 5 years depending on prescribed course duration.",
            "number_of_installments": "1 annual installment directly transferred to Aadhaar-linked bank account.",
            "benefit_specific_conditions": ["Bank account must be in candidate's own name and mapped with Aadhaar in NPCI mapper."]
        },
        "application": {
            "application_period": "Annual cycle on National Scholarship Portal.",
            "deadline": "31-10-2026",
            "application_mode": "Online exclusively through National Scholarship Portal (scholarships.gov.in).",
            "renewal_requirements": "Passing marksheet and bonafide certificate verified by Head of Institution.",
            "verification_requirements": "L1 verification by Institute Nodal Officer (INO) and L2 verification by State Nodal Officer (SNO / WARB)."
        },
        "documents": {
            "required_documents": [
                "Service Certificate / Martyr Certificate issued by State DGP / Home Department",
                "Bonafide Student Certificate signed by Head of Institution",
                "Qualifying Examination (10+2 / Diploma / Graduation) Marksheet",
                "Aadhaar Card / Aadhaar Enrolment Slip",
                "Active Bank Account Passbook (Aadhaar Seeded)",
                "Admission Fee Receipt of current academic session"
            ],
            "certificates": ["Martyrdom Certificate from State Police HQ", "Bonafide Certificate"],
            "income_certificate": None,
            "category_certificate": None,
            "disability_certificate": None,
            "domicile_certificate": None,
            "academic_documents": ["Class 10 Marksheet (DOB proof)", "Class 12 / Diploma / Degree Marksheet"],
            "scheme_specific_documents": ["WARB Annexure-1 & Annexure-2 Martyr certification"]
        },
        "restrictions": {
            "exclusions": ["Distance/open learning degrees not permitted.", "Students already in receipt of other Central Govt scholarships are restricted."],
            "conditions_ineligible": ["Failure to secure 50% marks in annual examination terminates the award.", "Disciplinary suspension by institution."],
            "simultaneous_scholarship_restrictions": "Cannot hold any other scholarship from Central / State Government or PSU for the same course.",
            "fee_reimbursement_restrictions": "Stipendiary scheme; no separate reimbursement of hostel or tuition fees.",
            "institution_restrictions": "Foreign universities not covered.",
            "previous_scholarship_restrictions": "Not eligible if candidate has already completed another professional degree with scholarship."
        },
        "source": {
            "source_document_name": "PMSS_Guidelines_1197_3001-2023-24.pdf",
            "source_academic_year": "2026-27",
            "source_validation_status": "verified",
            "validation_notes": "Official WARB guidelines verified for police personnel martyrs quota."
        }
    },
    "NSP-MHA-PMSS-CAPF-2026": {
        "description": "Prime Minister's Scholarship Scheme for dependent wards and widows of Central Armed Police Forces (CAPFs) & Assam Rifles personnel, Ministry of Home Affairs.",
        "eligibility": {
            "income_limit": None,
            "income_limit_description": "No income ceiling specified in official guidelines.",
            "category": None,
            "category_description": "Open to all categories (General, OBC, SC, ST, EWS).",
            "course": ["B.Tech / B.E.", "MBBS", "BDS", "B.Pharm", "B.Sc Nursing", "B.V.Sc", "B.Arch", "MCA", "MBA"],
            "course_description": "Technical & professional degree courses recognized by statutory regulatory bodies (AICTE, NMC, etc.).",
            "education_level": ["Undergraduate", "Postgraduate"],
            "education_level_description": "Professional Undergraduate and select Postgraduate degrees.",
            "minimum_percentage": 60.0,
            "percentage_description": "Minimum 60% marks in 10+2 / Diploma / Graduation as MEQ.",
            "cgpa_requirement": "Equivalent to 60% marks.",
            "gender": "ANY",
            "gender_description": "Open to all genders.",
            "state_domicile": None,
            "state_domicile_description": "All India.",
            "region_specific_conditions": None,
            "disability_required": None,
            "minimum_disability_percentage": None,
            "disability_description": "Not specified in source as mandatory requirement.",
            "year_of_study": "1st Year (fresh admission)",
            "admission_type": "Regular full-time admission.",
            "institution_requirements": ["AICTE / NMC / DCI / UGC approved institution."],
            "family_conditions": ["Dependent wards / widows of CAPFs & Assam Rifles personnel who died in harness or retired with disability."],
            "number_of_beneficiaries_limit": "2,000 fresh scholarships annually (1,000 for boys, 1,000 for girls).",
            "age_requirement": "Not specified in source.",
            "special_category_requirements": ["Wards of CAPF & AR personnel (CRPF, BSF, CISF, ITBP, SSB, Assam Rifles)"],
            "other_conditions": ["Distance learning not eligible."]
        },
        "selection": {
            "selection_criteria": "Priority order from Category A to F based on martyrdom/service category and academic MEQ percentage.",
            "merit_criteria": "Marks in 10+2 / Diploma / Graduation.",
            "ranking_method": "Tie-break by age (elder applicant prioritized).",
            "selection_priority": "Priority I: Wards/widows of CAPFs/AR personnel killed in action.",
            "state_wise_allocation": "Central CAPF quota.",
            "renewal_conditions": "Minimum 50% aggregate in preceding examination."
        },
        "benefits": {
            "amount": 36000,
            "amount_per_interval": "₹3,000/month for girls (₹36,000/yr), ₹2,500/month for boys (₹30,000/yr)",
            "fee_reimbursement": "Included in stipend.",
            "maintenance_allowance": "Included in stipend.",
            "books_equipment_allowance": None,
            "components": [
                {"title": "Girls Annual Stipend", "amount": 36000, "description": "₹36,000 per year via DBT", "interval": "per_year"},
                {"title": "Boys Annual Stipend", "amount": 30000, "description": "₹30,000 per year via DBT", "interval": "per_year"}
            ],
            "maximum_duration": "Duration of professional course (up to 5 years).",
            "number_of_installments": "Annual DBT payment.",
            "benefit_specific_conditions": ["Direct credit into student's Aadhaar-seeded bank account."]
        },
        "application": {
            "application_period": "Annual NSP application portal.",
            "deadline": "31-10-2026",
            "application_mode": "Online on scholarships.gov.in.",
            "renewal_requirements": "Head of Institute renewal verification.",
            "verification_requirements": "L1 (INO) and L2 (WARB Force Nodal Officer)."
        },
        "documents": {
            "required_documents": [
                "Serving / Discharge / Death Certificate of CAPF personnel",
                "Bonafide Student Certificate",
                "Marksheet of Qualifying Examination (10+2 / Diploma)",
                "Aadhaar Card copy",
                "Aadhaar-seeded Bank Passbook",
                "PPO or Gallantry Award citation (if applicable)"
            ],
            "certificates": ["WARB Annexure Certificate"],
            "income_certificate": None,
            "category_certificate": None,
            "disability_certificate": None,
            "domicile_certificate": None,
            "academic_documents": ["10th mark sheet", "12th mark sheet"],
            "scheme_specific_documents": ["Force Identity / Discharge Certificate"]
        },
        "restrictions": {
            "exclusions": ["Distance education students.", "Candidates already pursuing second professional degree."],
            "conditions_ineligible": ["Failure in annual exams.", "Leaving course mid-way."],
            "simultaneous_scholarship_restrictions": "Cannot draw concurrent scholarship from other central/state government sources.",
            "fee_reimbursement_restrictions": "Consolidated grant.",
            "institution_restrictions": "Recognized Indian institutions only.",
            "previous_scholarship_restrictions": "One degree only."
        },
        "source": {
            "source_document_name": "PMSS_Guidelines_1197_3001-2023-24.pdf",
            "source_academic_year": "2026-27",
            "source_validation_status": "verified",
            "validation_notes": "Official MHA guidelines verified."
        }
    },
    "NSP-AICTE-PRAGATI-DEG-2026": {
        "description": "AICTE Pragati Scholarship Scheme for Girl Students pursuing Technical Degree in AICTE approved institutions.",
        "eligibility": {
            "income_limit": 800000,
            "income_limit_description": "Family income from all sources must not exceed ₹8,00,000 per annum.",
            "category": None,
            "category_description": "Open to all categories (General, OBC, SC, ST, EWS). Statutory reservations apply (SC 15%, ST 7.5%, OBC 27%).",
            "course": ["B.Tech / B.E.", "B.Arch", "B.Pharm", "B.Des"],
            "course_description": "First year of degree level course OR second year of degree level course via lateral entry in AICTE approved institution.",
            "education_level": ["Undergraduate"],
            "education_level_description": "Undergraduate Technical Degree.",
            "minimum_percentage": None,
            "percentage_description": "Admission based on centralized entrance/counseling; no standalone percentage cutoff beyond admission eligibility.",
            "cgpa_requirement": "Not specified in source.",
            "gender": "FEMALE",
            "gender_description": "Strictly restricted to Girl Students only.",
            "state_domicile": None,
            "state_domicile_description": "All India (UTs/States).",
            "region_specific_conditions": None,
            "disability_required": None,
            "minimum_disability_percentage": None,
            "disability_description": "Not specified in source as mandatory requirement.",
            "year_of_study": "1st Year OR 2nd Year via Lateral Entry",
            "admission_type": "Admitted through centralized counseling / regular merit in AICTE approved institution.",
            "institution_requirements": ["Must be enrolled in an AICTE approved institution."],
            "family_conditions": ["Maximum two girl children per family are eligible."],
            "number_of_beneficiaries_limit": "5,000 scholarships annually across India, plus all eligible girls from 13 designated UTs/NE states.",
            "age_requirement": "Not specified in source.",
            "special_category_requirements": ["Girl students admitted to AICTE approved technical degree"],
            "other_conditions": ["Lateral entry students in 2nd year are eligible."]
        },
        "selection": {
            "selection_criteria": "Merit list prepared based on normalized qualifying exam (Class 12 / Diploma) marks.",
            "merit_criteria": "Class 12 / Qualifying Diploma marks.",
            "ranking_method": "Tie-break: elder candidate ranked higher.",
            "selection_priority": "State-wise quota allocation as per AICTE formula.",
            "state_wise_allocation": "State-wise quota based on AICTE approved seats.",
            "renewal_conditions": "Promotion to next academic year certified by Head of Institution."
        },
        "benefits": {
            "amount": 50000,
            "amount_per_interval": "₹50,000 per annum lump sum",
            "fee_reimbursement": "Can be utilized for college fee payment.",
            "maintenance_allowance": "Can be utilized for purchase of computer, stationery, books, and equipment.",
            "books_equipment_allowance": "Covered within ₹50,000 lump sum.",
            "components": [
                {"title": "Annual Composite Technical Grant", "amount": 50000, "description": "₹50,000 per annum paid via DBT for fees, laptop, books, and software", "interval": "per_year"}
            ],
            "maximum_duration": "4 years for first year degree entrants; 3 years for lateral entry entrants.",
            "number_of_installments": "1 annual installment directly via DBT.",
            "benefit_specific_conditions": ["No requirement to produce separate equipment purchase bills; ₹50,000 is transferred directly via DBT."]
        },
        "application": {
            "application_period": "Online via National Scholarship Portal.",
            "deadline": "31-10-2026",
            "application_mode": "Online on scholarships.gov.in.",
            "renewal_requirements": "Passing marksheet and bonafide certificate uploaded on NSP.",
            "verification_requirements": "Two-level verification by INO and AICTE Nodal Officer."
        },
        "documents": {
            "required_documents": [
                "Class 10 and 12 / Diploma Marksheet",
                "Admission Letter / Seat Allotment Letter confirming AICTE approved seat",
                "Current Academic Year College Tuition Fee Receipt",
                "Annual Family Income Certificate issued by Revenue Authority (<= ₹8 Lakh)",
                "Aadhaar Card",
                "Aadhaar-seeded Bank Passbook in student's name",
                "Declaration by Parents certifying not more than two girl children are availing scheme"
            ],
            "certificates": ["Income Certificate (<= 8 Lakh)", "Family Child Count Declaration"],
            "income_certificate": "Issued by Tehsildar / Sub-Divisional Magistrate / Revenue Officer",
            "category_certificate": "Caste Certificate for SC/ST/OBC (if applicable)",
            "disability_certificate": None,
            "domicile_certificate": "Domicile / PR Certificate",
            "academic_documents": ["12th / Diploma Marksheet", "Admission Allotment Letter"],
            "scheme_specific_documents": ["Parental declaration on number of girl children"]
        },
        "restrictions": {
            "exclusions": ["Management quota / non-counseling direct admissions not eligible.", "Diploma level students must apply under Pragati Diploma, not Degree."],
            "conditions_ineligible": ["More than two girl children per family.", "Income exceeding ₹8,00,000.", "Institution not AICTE approved."],
            "simultaneous_scholarship_restrictions": "Student cannot hold any other government scholarship providing fee reimbursement or stipend.",
            "fee_reimbursement_restrictions": "Lump sum grant; duplicate fee claims prohibited.",
            "institution_restrictions": "Non-AICTE approved institutions or distance education not eligible.",
            "previous_scholarship_restrictions": "Not applicable."
        },
        "source": {
            "source_document_name": "AICTE_2010_G.pdf",
            "source_academic_year": "2026-27",
            "source_validation_status": "verified",
            "validation_notes": "Official AICTE Pragati Degree guidelines verified."
        }
    },
    "NSP-AICTE-PRAGATI-DIP-2026": {
        "description": "AICTE Pragati Scholarship Scheme for Girl Students pursuing Technical Diploma in AICTE approved institutions.",
        "eligibility": {
            "income_limit": 800000,
            "income_limit_description": "Family income from all sources must not exceed ₹8,00,000 per annum.",
            "category": None,
            "category_description": "Open to all categories (General, OBC, SC, ST, EWS).",
            "course": ["Diploma", "Polytechnic Diploma in Engineering/Technology"],
            "course_description": "First year of Diploma level course OR second year through lateral entry in AICTE approved institution.",
            "education_level": ["Diploma"],
            "education_level_description": "Technical Diploma / Polytechnic.",
            "minimum_percentage": None,
            "percentage_description": "Admission based on merit/qualifying exam in AICTE approved polytechnic.",
            "cgpa_requirement": "Not specified in source.",
            "gender": "FEMALE",
            "gender_description": "Strictly restricted to Girl Students only.",
            "state_domicile": None,
            "state_domicile_description": "All India.",
            "region_specific_conditions": None,
            "disability_required": None,
            "minimum_disability_percentage": None,
            "disability_description": "Not specified in source as mandatory requirement.",
            "year_of_study": "1st Year OR 2nd Year via Lateral Entry",
            "admission_type": "Regular centralized polytechnic admission.",
            "institution_requirements": ["AICTE approved polytechnic / institution."],
            "family_conditions": ["Maximum two girl children per family are eligible."],
            "number_of_beneficiaries_limit": "5,000 scholarships annually.",
            "age_requirement": "Not specified in source.",
            "special_category_requirements": ["Girl students in AICTE approved technical diploma"],
            "other_conditions": None
        },
        "selection": {
            "selection_criteria": "Merit list prepared based on Class 10 / qualifying exam marks.",
            "merit_criteria": "Class 10 normalized score.",
            "ranking_method": "Tie-break: elder candidate ranked higher.",
            "selection_priority": "State quota distribution.",
            "state_wise_allocation": "State quota allocated as per AICTE seats.",
            "renewal_conditions": "Promotion to subsequent diploma year."
        },
        "benefits": {
            "amount": 50000,
            "amount_per_interval": "₹50,000 per annum lump sum",
            "fee_reimbursement": "Applicable for tuition fees.",
            "maintenance_allowance": "Applicable for books/equipment.",
            "books_equipment_allowance": "Covered within ₹50,000.",
            "components": [
                {"title": "Annual Diploma Technical Grant", "amount": 50000, "description": "₹50,000 per annum for tuition fees, books, equipment", "interval": "per_year"}
            ],
            "maximum_duration": "3 years (2 years for lateral entry).",
            "number_of_installments": "1 annual installment via DBT.",
            "benefit_specific_conditions": ["Direct benefit transfer to bank account."]
        },
        "application": {
            "application_period": "Annual NSP cycle.",
            "deadline": "31-10-2026",
            "application_mode": "Online on scholarships.gov.in.",
            "renewal_requirements": "Passing marksheet and INO verification.",
            "verification_requirements": "INO and AICTE verification."
        },
        "documents": {
            "required_documents": [
                "Class 10 Marksheet",
                "Admission Allotment Letter for Polytechnic Diploma",
                "Tuition Fee Receipt",
                "Income Certificate (<= ₹8 Lakh)",
                "Parental Declaration (max 2 girl children)",
                "Aadhaar Card",
                "Bank Account Passbook"
            ],
            "certificates": ["Income Certificate", "Family Declaration"],
            "income_certificate": "Issued by Competent Revenue Authority",
            "category_certificate": "Category Certificate (if applicable)",
            "disability_certificate": None,
            "domicile_certificate": "Domicile Certificate",
            "academic_documents": ["Class 10 Marksheet"],
            "scheme_specific_documents": ["Two-girl children family affidavit"]
        },
        "restrictions": {
            "exclusions": ["Non-AICTE approved polytechnics.", "Management quota admissions."],
            "conditions_ineligible": ["Family income > ₹8 Lakh.", "More than 2 girl children."],
            "simultaneous_scholarship_restrictions": "Cannot hold another government scholarship simultaneously.",
            "fee_reimbursement_restrictions": "Lump sum composite grant.",
            "institution_restrictions": "Must be AICTE approved polytechnic.",
            "previous_scholarship_restrictions": "Not applicable."
        },
        "source": {
            "source_document_name": "AICTE_2011_G.pdf",
            "source_academic_year": "2026-27",
            "source_validation_status": "verified",
            "validation_notes": "Official AICTE Pragati Diploma guidelines verified."
        }
    },
    "NSP-AICTE-SAKSHAM-DEG-2026": {
        "description": "AICTE Saksham Scholarship Scheme for Specially Abled Students pursuing Technical Degree in AICTE approved institutions.",
        "eligibility": {
            "income_limit": 800000,
            "income_limit_description": "Family annual income from all sources must not exceed ₹8,00,000 per annum.",
            "category": None,
            "category_description": "Open to all categories (General, OBC, SC, ST, EWS).",
            "course": ["B.Tech / B.E.", "B.Arch", "B.Pharm", "B.Des"],
            "course_description": "First year degree or second year lateral entry technical course in AICTE approved institution.",
            "education_level": ["Undergraduate"],
            "education_level_description": "Technical Degree.",
            "minimum_percentage": None,
            "percentage_description": "Admitted through regular counseling.",
            "cgpa_requirement": "Not specified in source.",
            "gender": "ANY",
            "gender_description": "Open to all genders.",
            "state_domicile": None,
            "state_domicile_description": "All India.",
            "region_specific_conditions": None,
            "disability_required": True,
            "minimum_disability_percentage": 40,
            "disability_description": "Must have certified benchmark disability of not less than 40% issued by competent medical authority.",
            "year_of_study": "1st Year OR 2nd Year via Lateral Entry",
            "admission_type": "Centralized admission.",
            "institution_requirements": ["AICTE approved institution."],
            "family_conditions": None,
            "number_of_beneficiaries_limit": "All eligible specially-abled students admitted to AICTE approved technical degree courses are covered.",
            "age_requirement": "Not specified in source.",
            "special_category_requirements": ["Specially Abled Students with >= 40% disability"],
            "other_conditions": None
        },
        "selection": {
            "selection_criteria": "All eligible PwD applicants admitted to AICTE institutions are awarded (no ceiling).",
            "merit_criteria": "Eligibility fulfillment.",
            "ranking_method": "All eligible applicants receive award.",
            "selection_priority": "Direct coverage of all eligible PwD applicants.",
            "state_wise_allocation": "Pan-India coverage.",
            "renewal_conditions": "Promotion to next academic year."
        },
        "benefits": {
            "amount": 50000,
            "amount_per_interval": "₹50,000 per annum lump sum",
            "fee_reimbursement": "Can cover college fees.",
            "maintenance_allowance": "Can cover assistive devices, books, and software.",
            "books_equipment_allowance": "Covered within ₹50,000.",
            "components": [
                {"title": "Annual Specially-Abled Technical Grant", "amount": 50000, "description": "₹50,000 per annum paid via DBT for fees, assistive devices, and books", "interval": "per_year"}
            ],
            "maximum_duration": "4 years (3 years for lateral entry).",
            "number_of_installments": "1 annual installment via DBT.",
            "benefit_specific_conditions": ["Direct credit to Aadhaar-seeded bank account."]
        },
        "application": {
            "application_period": "Annual NSP portal.",
            "deadline": "31-10-2026",
            "application_mode": "Online on scholarships.gov.in.",
            "renewal_requirements": "Passing marksheet and bonafide.",
            "verification_requirements": "INO and AICTE verification."
        },
        "documents": {
            "required_documents": [
                "Disability Certificate with minimum 40% disability issued by Competent Medical Authority / UDID Card",
                "Admission Allotment Letter for AICTE approved degree",
                "Class 10 and 12 / Diploma Marksheet",
                "Current Year Fee Receipt",
                "Income Certificate (<= ₹8 Lakh)",
                "Aadhaar Card copy",
                "Bank Account Passbook"
            ],
            "certificates": ["Disability Certificate (>= 40%)", "Income Certificate"],
            "income_certificate": "Issued by Competent Revenue Authority",
            "category_certificate": "Caste Certificate (if applicable)",
            "disability_certificate": "Valid Disability Certificate / UDID Card issued by CMO/Civil Surgeon/Govt Hospital",
            "domicile_certificate": "Domicile Certificate",
            "academic_documents": ["12th / Diploma Marksheet", "Admission Letter"],
            "scheme_specific_documents": ["UDID Card / Disability Certificate"]
        },
        "restrictions": {
            "exclusions": ["Disability below 40%.", "Unapproved institutions."],
            "conditions_ineligible": ["Income exceeding ₹8,00,000.", "Failure to promote to next academic year."],
            "simultaneous_scholarship_restrictions": "Cannot draw simultaneous tuition fee scholarship from other government sources.",
            "fee_reimbursement_restrictions": "Lump sum composite grant.",
            "institution_restrictions": "Must be AICTE approved.",
            "previous_scholarship_restrictions": "One degree only."
        },
        "source": {
            "source_document_name": "AICTE_2012_G.pdf",
            "source_academic_year": "2026-27",
            "source_validation_status": "verified",
            "validation_notes": "Official AICTE Saksham Degree guidelines verified."
        }
    },
    "NSP-AICTE-SWANATH-DEG-2026": {
        "description": "AICTE Swanath Scholarship Scheme for technical degree students who are Orphans, wards of parents who died due to COVID-19, or wards of Armed Forces and Central Paramilitary Forces martyred in action.",
        "eligibility": {
            "income_limit": 800000,
            "income_limit_description": "Family income from all sources must not exceed ₹8,00,000 per annum (not applicable for orphans).",
            "category": None,
            "category_description": "Open to all categories (General, OBC, SC, ST, EWS).",
            "course": ["B.Tech / B.E.", "B.Arch", "B.Pharm", "B.Des"],
            "course_description": "First to fourth year technical degree course in AICTE approved institution.",
            "education_level": ["Undergraduate"],
            "education_level_description": "Technical Degree.",
            "minimum_percentage": None,
            "percentage_description": "Admission in AICTE approved technical institution.",
            "cgpa_requirement": "Not specified in source.",
            "gender": "ANY",
            "gender_description": "Open to all genders.",
            "state_domicile": None,
            "state_domicile_description": "All India.",
            "region_specific_conditions": None,
            "disability_required": None,
            "minimum_disability_percentage": None,
            "disability_description": "Not specified in source as mandatory requirement.",
            "year_of_study": "Any year of study (1st, 2nd, 3rd, 4th Year)",
            "admission_type": "Regular admission in AICTE approved institution.",
            "institution_requirements": ["AICTE approved institution."],
            "family_conditions": ["Candidate must be Orphan, OR candidate whose both parents died due to COVID-19, OR wards of Armed Forces / CAPFs martyred in action."],
            "number_of_beneficiaries_limit": "2,000 scholarships annually (1,000 for Degree, 1,000 for Diploma).",
            "age_requirement": "Not specified in source.",
            "special_category_requirements": ["Orphan / COVID Orphan / Wards of Martyred Armed Forces"],
            "other_conditions": None
        },
        "selection": {
            "selection_criteria": "Merit list prepared based on qualifying exam marks.",
            "merit_criteria": "Qualifying examination percentage.",
            "ranking_method": "Tie-break: elder candidate ranked higher.",
            "selection_priority": "Category 1: Orphans, Category 2: COVID orphans, Category 3: Martyred Armed Forces wards.",
            "state_wise_allocation": "All India allocation.",
            "renewal_conditions": "Passing examination."
        },
        "benefits": {
            "amount": 50000,
            "amount_per_interval": "₹50,000 per annum lump sum",
            "fee_reimbursement": "Tuition fees covered.",
            "maintenance_allowance": "Books/equipment covered.",
            "books_equipment_allowance": "Covered within ₹50,000.",
            "components": [
                {"title": "Annual Swanath Welfare Technical Grant", "amount": 50000, "description": "₹50,000 per annum via DBT", "interval": "per_year"}
            ],
            "maximum_duration": "Duration of degree course.",
            "number_of_installments": "1 annual installment via DBT.",
            "benefit_specific_conditions": ["Direct credit to Aadhaar-seeded bank account."]
        },
        "application": {
            "application_period": "Annual NSP window.",
            "deadline": "31-10-2026",
            "application_mode": "Online on scholarships.gov.in.",
            "renewal_requirements": "Passing marksheet and bonafide.",
            "verification_requirements": "INO and AICTE verification."
        },
        "documents": {
            "required_documents": [
                "Death Certificate of both parents OR Martyrdom Certificate of parent in Armed Forces/CAPF",
                "Admission Allotment Letter for AICTE approved degree",
                "Qualifying Examination Marksheet",
                "Income Certificate (if applicable, not required for orphans)",
                "Bonafide Certificate from College Head",
                "Aadhaar Card",
                "Bank Account Passbook"
            ],
            "certificates": ["Orphan Certificate / Parents Death Certificates", "Bonafide Certificate"],
            "income_certificate": "Income Certificate (<= ₹8 Lakh for non-orphans)",
            "category_certificate": None,
            "disability_certificate": None,
            "domicile_certificate": "Domicile Certificate",
            "academic_documents": ["Marksheets of qualifying examinations"],
            "scheme_specific_documents": ["Death Certificates of both parents / COVID death proof / Armed forces martyr certificate"]
        },
        "restrictions": {
            "exclusions": ["Candidates with surviving parents not affected by COVID/martyrdom."],
            "conditions_ineligible": ["Institutions not approved by AICTE."],
            "simultaneous_scholarship_restrictions": "Cannot draw duplicate fee reimbursement.",
            "fee_reimbursement_restrictions": "Lump sum grant.",
            "institution_restrictions": "AICTE approved.",
            "previous_scholarship_restrictions": "One degree only."
        },
        "source": {
            "source_document_name": "AICTE_3039_G.pdf",
            "source_academic_year": "2026-27",
            "source_validation_status": "verified",
            "validation_notes": "Official AICTE Swanath Degree guidelines verified."
        }
    },
    "NSP-MOE-CSSS-2026": {
        "description": "PM-USP Central Sector Scheme of Scholarship for College and University Students (CSSS), Department of Higher Education, Ministry of Education.",
        "eligibility": {
            "income_limit": 450000,
            "income_limit_description": "Gross parental/family annual income must not exceed ₹4,50,000 per annum.",
            "category": None,
            "category_description": "Open to all categories (General, OBC, SC, ST, EWS). 50% reserved for girls.",
            "course": ["ALL", "B.Tech / B.E.", "MBBS", "B.Sc", "B.Com", "B.A.", "BCA", "BBA", "Integrated Master's"],
            "course_description": "Regular full-time degree courses in recognized colleges/universities.",
            "education_level": ["Undergraduate", "Postgraduate"],
            "education_level_description": "College and University regular degree level.",
            "minimum_percentage": 80.0,
            "percentage_description": "Above 80th percentile of successful candidates in relevant stream from respective State/Central Board in Class 12 examination.",
            "cgpa_requirement": "Not specified in source.",
            "gender": "ANY",
            "gender_description": "Open to all genders (50% earmarked for girl students).",
            "state_domicile": None,
            "state_domicile_description": "All India (State boards and Central boards like CBSE, CISCE).",
            "region_specific_conditions": None,
            "disability_required": None,
            "minimum_disability_percentage": None,
            "disability_description": "Not specified in source as mandatory (5% horizontal reservation for PwD).",
            "year_of_study": "1st Year of Undergraduate Degree",
            "admission_type": "Regular full-time degree admission.",
            "institution_requirements": ["Colleges/Institutions recognized by UGC, AICTE, NMC, or State/Central Government.", "Distance education / correspondence / diploma not eligible."],
            "family_conditions": None,
            "number_of_beneficiaries_limit": "82,000 fresh scholarships annually (41,000 boys and 41,000 girls).",
            "age_requirement": "18 to 25 years.",
            "special_category_requirements": ["Top 20th percentile in Class 12 Board examination"],
            "other_conditions": ["Must not be receiving any other scholarship/stipend."]
        },
        "selection": {
            "selection_criteria": "Merit list prepared state-board-wise based on Class 12 examination percentile and allocated state quotas.",
            "merit_criteria": "Rank within 80th percentile of Class 12 Board.",
            "ranking_method": "Board percentile in Science, Commerce, and Humanities streams (ratio 3:2:1).",
            "selection_priority": "State quota based on state population in 18-25 age group.",
            "state_wise_allocation": "State quota distributed among boards based on 18-25 age population.",
            "renewal_conditions": "Minimum 50% marks in annual university exams and 75% attendance."
        },
        "benefits": {
            "amount": 12000,
            "amount_per_interval": "₹12,000/year for first 3 years (UG); ₹20,000/year for 4th & 5th year (PG/Professional)",
            "fee_reimbursement": "Not separate; paid as maintenance stipend.",
            "maintenance_allowance": "₹12,000/year for UG; ₹20,000/year for PG.",
            "books_equipment_allowance": None,
            "components": [
                {"title": "Undergraduate Annual Allowance", "amount": 12000, "description": "₹12,000 per annum for 1st, 2nd, and 3rd year of undergraduate studies", "interval": "per_year"},
                {"title": "Postgraduate / Professional 4th-5th Year Allowance", "amount": 20000, "description": "₹20,000 per annum for 4th and 5th year / PG degree", "interval": "per_year"}
            ],
            "maximum_duration": "Up to 5 years (3 years UG + 2 years PG, or 5 years integrated).",
            "number_of_installments": "1 annual installment directly via DBT.",
            "benefit_specific_conditions": ["Payment through PFMS/DBT directly to Aadhaar-seeded bank account."]
        },
        "application": {
            "application_period": "Annual cycle on NSP.",
            "deadline": "31-10-2026",
            "application_mode": "Online on scholarships.gov.in.",
            "renewal_requirements": "Passing marksheet with >= 50% marks and institute verification.",
            "verification_requirements": "Two-level verification: Institute Nodal Officer (INO) and State Nodal Officer (SNO)."
        },
        "documents": {
            "required_documents": [
                "Class 12 Marksheet showing marks above 80th percentile cutoff",
                "College Bonafide Student Certificate",
                "Annual Family Income Certificate issued by Revenue Authority (<= ₹4.5 Lakh)",
                "College Admission & Fee Payment Receipt",
                "Aadhaar Card",
                "Bank Account Passbook (Aadhaar linked)"
            ],
            "certificates": ["Income Certificate (<= ₹4.5 Lakh)", "Bonafide Certificate"],
            "income_certificate": "Issued by Tehsildar / SDM / Competent Revenue Officer",
            "category_certificate": "Category Certificate for SC/ST/OBC (if applicable)",
            "disability_certificate": "Disability certificate (for 5% PwD quota)",
            "domicile_certificate": "Domicile / PR Certificate",
            "academic_documents": ["Class 10 Marksheet", "Class 12 Board Marksheet"],
            "scheme_specific_documents": ["Board percentile verification"]
        },
        "restrictions": {
            "exclusions": ["Students pursuing diploma or correspondence/distance education.", "Students availing any other government scholarship or fee waiver."],
            "conditions_ineligible": ["Income > ₹4,50,000.", "Scoring < 50% in university renewal exams.", "Change of course without prior approval."],
            "simultaneous_scholarship_restrictions": "Strictly cannot hold any other Central/State Govt scholarship.",
            "fee_reimbursement_restrictions": "Fixed maintenance stipend.",
            "institution_restrictions": "Recognized colleges and universities only.",
            "previous_scholarship_restrictions": "Only fresh 1st year entrants eligible."
        },
        "source": {
            "source_document_name": "CSSS_GUIDLINES_07022024_updated.pdf",
            "source_academic_year": "2026-27",
            "source_validation_status": "verified",
            "validation_notes": "Official Ministry of Education CSSS guidelines verified."
        }
    },
    "NSP-DEPWD-TOP-CLASS-2026": {
        "description": "Scholarship for Top Class Education for Students with Disabilities, Department of Empowerment of Persons with Disabilities, Ministry of Social Justice and Empowerment.",
        "eligibility": {
            "income_limit": 600000,
            "income_limit_description": "Parental/family income from all sources must not exceed ₹6,00,000 per annum.",
            "category": None,
            "category_description": "Open to all categories (General, OBC, SC, ST, EWS). 50% reserved for female students.",
            "course": ["ALL", "B.Tech / B.E.", "MBBS", "MBA", "LL.B", "Postgraduate Degree / Diploma"],
            "course_description": "Full-time graduate or postgraduate degree/diploma in designated Top Class Institutions notified by DEPwD (IITs, IIMs, NITs, AIIMS, NLUs, etc.).",
            "education_level": ["Undergraduate", "Postgraduate"],
            "education_level_description": "Undergraduate and Postgraduate degree/diploma in notified premier institutions.",
            "minimum_percentage": None,
            "percentage_description": "Admitted to notified Top Class institution through national entrance test.",
            "cgpa_requirement": "Not specified in source.",
            "gender": "ANY",
            "gender_description": "Open to all genders (50% earmarked for female students).",
            "state_domicile": None,
            "state_domicile_description": "All India.",
            "region_specific_conditions": None,
            "disability_required": True,
            "minimum_disability_percentage": 40,
            "disability_description": "Benchmark disability of not less than 40% certified by competent medical authority under RPwD Act 2016.",
            "year_of_study": "1st Year of course in notified institution",
            "admission_type": "Admitted through regular merit / entrance examination in notified institutions.",
            "institution_requirements": ["Must be one of the ~240 Top Class institutions notified by DEPwD (IITs, IIMs, NITs, Central Universities, etc.)."],
            "family_conditions": ["Not more than two children from the same family can avail the scholarship (relaxation for twins)."],
            "number_of_beneficiaries_limit": "300 fresh scholarships per year.",
            "age_requirement": "Not specified in source.",
            "special_category_requirements": ["Persons with Disabilities admitted to notified premier institutes"],
            "other_conditions": None
        },
        "selection": {
            "selection_criteria": "Merit list prepared among eligible PwD applicants in notified institutions based on entrance marks and gender reservation.",
            "merit_criteria": "Qualifying entrance rank / MEQ marks.",
            "ranking_method": "Entrance rank in respective national exam.",
            "selection_priority": "Priority to female PwD students (50% slots) and severe disability benchmarks.",
            "state_wise_allocation": "Central pan-India quota.",
            "renewal_conditions": "Passing examination each year."
        },
        "benefits": {
            "amount": 185000,
            "amount_per_interval": "Up to ₹2,00,000/yr tuition fee + ₹36,000/yr maintenance + ₹5,000 books + ₹45,000 computer aid (one time)",
            "fee_reimbursement": "Full tuition fee and non-refundable charges up to ₹2,00,000 per annum (full fee for Govt institutes).",
            "maintenance_allowance": "₹3,000 per month for hostellers (₹36,000/year); ₹1,500/month for day scholars.",
            "books_equipment_allowance": "₹5,000 per annum for books and stationery.",
            "components": [
                {"title": "Tuition Fee Reimbursement", "amount": 140000, "description": "Actual tuition fees and non-refundable fees up to ceiling", "interval": "per_year"},
                {"title": "Maintenance Allowance (Hosteller)", "amount": 36000, "description": "₹3,000 per month paid directly via DBT", "interval": "per_year"},
                {"title": "Books & Stationery Allowance", "amount": 5000, "description": "₹5,000 per annum for academic materials", "interval": "per_year"},
                {"title": "Computer / Assistive Device Aid", "amount": 45000, "description": "One-time grant up to ₹45,000 for laptop/assistive technology", "interval": "one_time"}
            ],
            "maximum_duration": "Full course duration (up to 5 years).",
            "number_of_installments": "Annual DBT fee reimbursement and monthly maintenance.",
            "benefit_specific_conditions": ["Tuition fee paid directly to institute or reimbursed to student upon proof."]
        },
        "application": {
            "application_period": "Annual NSP application window.",
            "deadline": "31-10-2026",
            "application_mode": "Online on scholarships.gov.in.",
            "renewal_requirements": "Annual progress report from Head of Institution.",
            "verification_requirements": "Institute Nodal Officer (INO) and DEPwD verification."
        },
        "documents": {
            "required_documents": [
                "Disability Certificate (>= 40% benchmark disability) / UDID Card",
                "Proof of Admission in notified Top Class Institution",
                "College Fee Breakdown & Receipt of fee payment",
                "Income Certificate (<= ₹6 Lakh per annum)",
                "Class 10 and 12 Marksheets",
                "Aadhaar Card",
                "Bank Account Passbook (Aadhaar linked)",
                "Self-declaration regarding family child count"
            ],
            "certificates": ["UDID / Disability Certificate", "Income Certificate"],
            "income_certificate": "Issued by Tehsildar / SDM / Revenue Authority",
            "category_certificate": None,
            "disability_certificate": "Valid Disability Certificate / UDID Card showing >= 40% disability",
            "domicile_certificate": "Domicile / PR Certificate",
            "academic_documents": ["Entrance Exam Scorecard", "10th and 12th Marksheets"],
            "scheme_specific_documents": ["Admission letter from notified Top Class Institution"]
        },
        "restrictions": {
            "exclusions": ["Non-notified institutions.", "Disability below 40%."],
            "conditions_ineligible": ["Income exceeding ₹6,00,000.", "More than two children availing scheme from same family."],
            "simultaneous_scholarship_restrictions": "Cannot hold any other scholarship from Central / State government.",
            "fee_reimbursement_restrictions": "Actual fees subject to notified ceiling.",
            "institution_restrictions": "Designated DEPwD notified list only.",
            "previous_scholarship_restrictions": "One degree only."
        },
        "source": {
            "source_document_name": "DEPDGuidelines_1.pdf",
            "source_academic_year": "2026-27",
            "source_validation_status": "verified",
            "validation_notes": "Official DEPwD Top Class guidelines verified."
        }
    }
}
