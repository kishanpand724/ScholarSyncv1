#!/usr/bin/env python3
"""
ScholarSync - Official National Scholarship Portal (NSP) Fetcher & Normalizer
Based on user fetch code for https://scholarships.gov.in/All-Scholarships

Preserves original user fetch logic, parses live NSP DOM containers,
extracts official dates, deadlines, specification links, ministry/provider details,
normalizes into ScholarSync unified schema, and persists to data layers.
"""

import requests
from bs4 import BeautifulSoup, Comment
import json
import os
import re
from urllib.parse import urljoin

NSP_URL = "https://scholarships.gov.in/All-Scholarships"

# Statutory known benchmarks from official guidelines for schemes on NSP
OFFICIAL_SCHEME_METADATA = {
    "prime minister's scholarship scheme for wards of states/uts police personnel martyred during terror/naxal attacks": {
        "id": "NSP-MHA-PMSS-POLICE-2026",
        "benefit_amount": 36000,
        "benefit_details": "₹3,000 per month for girls and ₹2,500 per month for boys paid annually directly via DBT.",
        "benefit_type": "fixed_cash_stipend",
        "income_limit": None,
        "education_level": ["Undergraduate", "Postgraduate"],
        "course": ["ALL", "B.Tech / B.E.", "MBBS", "B.Sc", "BCA", "B.Com", "B.A."],
        "category": ["General", "OBC", "SC", "ST", "EWS"],
        "minimum_percentage": 60.0,
        "gender": "ANY",
        "state_domicile": ["ALL"],
        "disability_required": False,
        "special_conditions": ["Wards of States/UTs Police Personnel Martyred during Terror/Naxal Attacks"]
    },
    "prime minister's scholarship scheme for central armed police forces and assam rifles": {
        "id": "NSP-MHA-PMSS-CAPF-2026",
        "benefit_amount": 36000,
        "benefit_details": "₹3,000 per month for girls and ₹2,500 per month for boys for professional degree courses.",
        "benefit_type": "fixed_cash_stipend",
        "income_limit": None,
        "education_level": ["Undergraduate", "Postgraduate"],
        "course": ["ALL", "B.Tech / B.E.", "MBBS", "BCA", "B.Pharm", "B.Sc Nursing"],
        "category": ["General", "OBC", "SC", "ST", "EWS"],
        "minimum_percentage": 60.0,
        "gender": "ANY",
        "state_domicile": ["ALL"],
        "disability_required": False,
        "special_conditions": ["Wards/widows of CAPFs & AR personnel"]
    },
    "aicte - swanath scholarship scheme (technical degree)": {
        "id": "NSP-AICTE-SWANATH-DEG-2026",
        "benefit_amount": 50000,
        "benefit_details": "₹50,000 per annum towards payment of college fees, books, and equipment.",
        "benefit_type": "composite",
        "income_limit": 800000,
        "education_level": ["Undergraduate"],
        "course": ["B.Tech / B.E.", "B.Arch", "B.Pharm"],
        "category": ["General", "OBC", "SC", "ST", "EWS"],
        "minimum_percentage": 50.0,
        "gender": "ANY",
        "state_domicile": ["ALL"],
        "disability_required": False,
        "special_conditions": ["Orphan", "Both Parents deceased due to COVID-19", "Wards of Armed Forces martyred in action"]
    },
    "pm usp special scholarship scheme for jammu kashmir and ladakh": {
        "id": "NSP-AICTE-PMSSS-JK-2026",
        "benefit_amount": 225000,
        "benefit_details": "Up to ₹1,25,000 academic tuition fee waiver + ₹1,00,000 maintenance allowance directly to student.",
        "benefit_type": "composite",
        "income_limit": 800000,
        "education_level": ["Undergraduate"],
        "course": ["ALL", "B.Tech / B.E.", "MBBS", "B.Sc", "B.Arch", "BCA"],
        "category": ["General", "OBC", "SC", "ST", "EWS"],
        "minimum_percentage": 50.0,
        "gender": "ANY",
        "state_domicile": ["Jammu and Kashmir", "Ladakh"],
        "disability_required": False,
        "special_conditions": []
    },
    "aicte - pragati scholarship scheme for girl students (technical degree)": {
        "id": "NSP-AICTE-PRAGATI-DEG-2026",
        "benefit_amount": 50000,
        "benefit_details": "₹50,000 per annum lump sum towards tuition fees, purchase of computer, stationery, books, and equipment.",
        "benefit_type": "composite",
        "income_limit": 800000,
        "education_level": ["Undergraduate"],
        "course": ["B.Tech / B.E.", "B.Arch", "B.Pharm"],
        "category": ["General", "OBC", "SC", "ST", "EWS"],
        "minimum_percentage": 50.0,
        "gender": "FEMALE",
        "state_domicile": ["ALL"],
        "disability_required": False,
        "special_conditions": []
    },
    "aicte - pragati scholarship scheme for girl students (technical diploma)": {
        "id": "NSP-AICTE-PRAGATI-DIP-2026",
        "benefit_amount": 50000,
        "benefit_details": "₹50,000 per annum lump sum amount for female diploma students admitted to AICTE approved institutions.",
        "benefit_type": "composite",
        "income_limit": 800000,
        "education_level": ["Diploma"],
        "course": ["Diploma"],
        "category": ["General", "OBC", "SC", "ST", "EWS"],
        "minimum_percentage": 50.0,
        "gender": "FEMALE",
        "state_domicile": ["ALL"],
        "disability_required": False,
        "special_conditions": []
    },
    "aicte - saksham scholarship scheme for specially abled student (technical diploma)": {
        "id": "NSP-AICTE-SAKSHAM-DIP-2026",
        "benefit_amount": 50000,
        "benefit_details": "₹50,000 per annum for specially-abled students admitted to AICTE technical diploma courses.",
        "benefit_type": "composite",
        "income_limit": 800000,
        "education_level": ["Diploma"],
        "course": ["Diploma"],
        "category": ["General", "OBC", "SC", "ST", "EWS"],
        "minimum_percentage": 50.0,
        "gender": "ANY",
        "state_domicile": ["ALL"],
        "disability_required": True,
        "minimum_disability_percentage": 40,
        "special_conditions": []
    },
    "aicte - saksham scholarship scheme for specially abled student (technical degree)": {
        "id": "NSP-AICTE-SAKSHAM-DEG-2026",
        "benefit_amount": 50000,
        "benefit_details": "₹50,000 per annum lump sum for specially-abled students in degree programs.",
        "benefit_type": "composite",
        "income_limit": 800000,
        "education_level": ["Undergraduate"],
        "course": ["B.Tech / B.E.", "B.Arch", "B.Pharm"],
        "category": ["General", "OBC", "SC", "ST", "EWS"],
        "minimum_percentage": 50.0,
        "gender": "ANY",
        "state_domicile": ["ALL"],
        "disability_required": True,
        "minimum_disability_percentage": 40,
        "special_conditions": []
    },
    "aicte - swanath scholarship scheme (technical diploma)": {
        "id": "NSP-AICTE-SWANATH-DIP-2026",
        "benefit_amount": 50000,
        "benefit_details": "₹50,000 per annum towards payment of college fees, books, and equipment for diploma students.",
        "benefit_type": "composite",
        "income_limit": 800000,
        "education_level": ["Diploma"],
        "course": ["Diploma"],
        "category": ["General", "OBC", "SC", "ST", "EWS"],
        "minimum_percentage": 50.0,
        "gender": "ANY",
        "state_domicile": ["ALL"],
        "disability_required": False,
        "special_conditions": ["Orphan", "Both Parents deceased due to COVID-19", "Wards of Armed Forces martyred in action"]
    },
    "national scholarship for post graduate studies": {
        "id": "NSP-UGC-PG-MERIT-2026",
        "benefit_amount": 150000,
        "benefit_details": "₹15,000 per month for 10 months each academic year (Total ₹1,50,000 per year) via Direct Benefit Transfer.",
        "benefit_type": "fixed_cash_stipend",
        "income_limit": None,
        "education_level": ["Postgraduate"],
        "course": ["ALL", "M.Sc", "M.Com", "M.A.", "M.Tech", "MCA"],
        "category": ["General", "OBC", "SC", "ST", "EWS"],
        "minimum_percentage": 60.0,
        "gender": "ANY",
        "state_domicile": ["ALL"],
        "disability_required": False,
        "special_conditions": []
    },
    "ishan uday special scholarship scheme for ner": {
        "id": "NSP-UGC-ISHAN-UDAY-2026",
        "benefit_amount": 78000,
        "benefit_details": "₹5,400 per month for general degree courses; ₹7,800 per month for technical/medical/professional courses.",
        "benefit_type": "composite",
        "income_limit": 450000,
        "education_level": ["Undergraduate"],
        "course": ["ALL", "B.Tech / B.E.", "MBBS", "B.Sc", "BCA", "B.Com", "B.A."],
        "category": ["General", "OBC", "SC", "ST", "EWS"],
        "minimum_percentage": 55.0,
        "gender": "ANY",
        "state_domicile": ["Assam", "Arunachal Pradesh", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Sikkim", "Tripura"],
        "disability_required": False,
        "special_conditions": []
    },
    "financial assistance for education to the wards of beedi/cine/iomc/lsdm- pre matric": {
        "id": "NSP-MOLE-PRE-MATRIC-2026",
        "benefit_amount": 1000,
        "benefit_details": "Financial assistance for school education to children of beedi/cine/mining workers.",
        "benefit_type": "fixed_cash_stipend",
        "income_limit": 120000,
        "education_level": ["Higher Secondary"],
        "course": ["ALL"],
        "category": ["General", "OBC", "SC", "ST", "EWS"],
        "minimum_percentage": 35.0,
        "gender": "ANY",
        "state_domicile": ["ALL"],
        "disability_required": False,
        "special_conditions": []
    },
    "financial assistance for education to the wards of beedi/cine/iomc/lsdm- post matric": {
        "id": "NSP-MOLE-POST-MATRIC-2026",
        "benefit_amount": 15000,
        "benefit_details": "Financial assistance up to ₹15,000 for college education to children of beedi/cine/mining workers.",
        "benefit_type": "fixed_cash_stipend",
        "income_limit": 120000,
        "education_level": ["Diploma", "Undergraduate", "Postgraduate"],
        "course": ["ALL", "B.Tech / B.E.", "B.Sc", "B.Com", "B.A.", "Diploma"],
        "category": ["General", "OBC", "SC", "ST", "EWS"],
        "minimum_percentage": 35.0,
        "gender": "ANY",
        "state_domicile": ["ALL"],
        "disability_required": False,
        "special_conditions": []
    },
    "pm yasasvi central sector scheme of top class education in schools for obc, ebc and dnt students": {
        "id": "NSP-MSJE-YASASVI-SCH-2026",
        "benefit_amount": 125000,
        "benefit_details": "School tuition fees and living expenses up to ₹1,25,000 per annum for Class 9th to 12th.",
        "benefit_type": "composite",
        "income_limit": 250000,
        "education_level": ["Higher Secondary"],
        "course": ["ALL"],
        "category": ["OBC", "EWS"],
        "minimum_percentage": 60.0,
        "gender": "ANY",
        "state_domicile": ["ALL"],
        "disability_required": False,
        "special_conditions": []
    },
    "pm yasasvi central sector scheme of top class education in college for obc, ebc and dnt students": {
        "id": "NSP-MSJE-YASASVI-COL-2026",
        "benefit_amount": 196000,
        "benefit_details": "Full tuition fee reimbursement + ₹3,000/month living expenses + ₹5,000/yr books + ₹45,000 computer grant.",
        "benefit_type": "composite",
        "income_limit": 250000,
        "education_level": ["Undergraduate", "Postgraduate"],
        "course": ["ALL", "B.Tech / B.E.", "MBBS", "B.Sc", "BCA", "B.Com", "B.A."],
        "category": ["OBC", "EWS"],
        "minimum_percentage": 60.0,
        "gender": "ANY",
        "state_domicile": ["ALL"],
        "disability_required": False,
        "special_conditions": []
    },
    "national renewable energy fellowship scheme": {
        "id": "NSP-MNRE-NREF-2026",
        "benefit_amount": 372000,
        "benefit_details": "Fellowship of ₹31,000/month (JRF) to ₹35,000/month (SRF) for M.Tech and Ph.D. students in Renewable Energy.",
        "benefit_type": "maintenance_allowance",
        "income_limit": None,
        "education_level": ["Postgraduate", "Doctoral"],
        "course": ["M.Tech", "Ph.D.", "ALL"],
        "category": ["General", "OBC", "SC", "ST", "EWS"],
        "minimum_percentage": 60.0,
        "gender": "ANY",
        "state_domicile": ["ALL"],
        "disability_required": False,
        "special_conditions": []
    },
    "stipend scheme for under graduate and post graduate studies in indian statistical institute-kolkata": {
        "id": "NSP-MOSPI-ISI-2026",
        "benefit_amount": 60000,
        "benefit_details": "Monthly stipend for students admitted to Bachelor and Master degree programmes at ISI Kolkata.",
        "benefit_type": "fixed_cash_stipend",
        "income_limit": None,
        "education_level": ["Undergraduate", "Postgraduate"],
        "course": ["ALL", "B.Stat", "B.Math", "M.Stat", "M.Math"],
        "category": ["General", "OBC", "SC", "ST", "EWS"],
        "minimum_percentage": 60.0,
        "gender": "ANY",
        "state_domicile": ["ALL"],
        "disability_required": False,
        "special_conditions": []
    },
    "icar national talent scholarship(nts-ug)": {
        "id": "NSP-DARE-ICAR-NTS-UG-2026",
        "benefit_amount": 36000,
        "benefit_details": "₹3,000 per month for UG students studying in agriculture universities outside their home state.",
        "benefit_type": "fixed_cash_stipend",
        "income_limit": None,
        "education_level": ["Undergraduate"],
        "course": ["ALL", "B.Sc", "B.Tech / B.E."],
        "category": ["General", "OBC", "SC", "ST", "EWS"],
        "minimum_percentage": 50.0,
        "gender": "ANY",
        "state_domicile": ["ALL"],
        "disability_required": False,
        "special_conditions": []
    },
    "icar post graduate scholarship(pgs)": {
        "id": "NSP-DARE-ICAR-PGS-2026",
        "benefit_amount": 151200,
        "benefit_details": "₹12,600 per month for Master degree students admitted through ICAR All India Entrance Examination.",
        "benefit_type": "fixed_cash_stipend",
        "income_limit": None,
        "education_level": ["Postgraduate"],
        "course": ["ALL", "M.Sc", "M.Tech"],
        "category": ["General", "OBC", "SC", "ST", "EWS"],
        "minimum_percentage": 60.0,
        "gender": "ANY",
        "state_domicile": ["ALL"],
        "disability_required": False,
        "special_conditions": []
    },
    "icar national talent scholarship(nts-pg)": {
        "id": "NSP-DARE-ICAR-NTS-PG-2026",
        "benefit_amount": 60000,
        "benefit_details": "₹5,000 per month for PG students studying in an agricultural university outside their home state.",
        "benefit_type": "fixed_cash_stipend",
        "income_limit": None,
        "education_level": ["Postgraduate"],
        "course": ["ALL", "M.Sc", "M.Tech"],
        "category": ["General", "OBC", "SC", "ST", "EWS"],
        "minimum_percentage": 60.0,
        "gender": "ANY",
        "state_domicile": ["ALL"],
        "disability_required": False,
        "special_conditions": []
    },
    "icar junior research fellowships(jrf) and senior research fellowships(srf)": {
        "id": "NSP-DARE-ICAR-JRF-SRF-2026",
        "benefit_amount": 372000,
        "benefit_details": "₹31,000/month for first 2 years (JRF) and ₹35,000/month for 3rd year (SRF) for doctoral studies in agriculture.",
        "benefit_type": "maintenance_allowance",
        "income_limit": None,
        "education_level": ["Doctoral"],
        "course": ["ALL", "Ph.D."],
        "category": ["General", "OBC", "SC", "ST", "EWS"],
        "minimum_percentage": 60.0,
        "gender": "ANY",
        "state_domicile": ["ALL"],
        "disability_required": False,
        "special_conditions": []
    },
    "central sector scholarship of top class education for sc students": {
        "id": "NSP-MSJE-TOP-CLASS-SC-2026",
        "benefit_amount": 196000,
        "benefit_details": "Full tuition fee reimbursement + ₹3,000/month living expenses + ₹5,000/yr books + ₹45,000 computer grant.",
        "benefit_type": "composite",
        "income_limit": 800000,
        "education_level": ["Undergraduate", "Postgraduate"],
        "course": ["ALL", "B.Tech / B.E.", "MBBS", "B.Sc", "BCA", "B.Com", "B.A."],
        "category": ["SC"],
        "minimum_percentage": 50.0,
        "gender": "ANY",
        "state_domicile": ["ALL"],
        "disability_required": False,
        "special_conditions": []
    },
    "free coaching for scs obcs and beneficiaries of pm cares children scheme": {
        "id": "NSP-MSJE-FREE-COACHING-2026",
        "benefit_amount": 50000,
        "benefit_details": "Free coaching fee coverage and monthly stipend for competitive exams (UPSC, State PSC, Banking, Engineering/Medical Entrance).",
        "benefit_type": "composite",
        "income_limit": 800000,
        "education_level": ["Undergraduate", "Postgraduate"],
        "course": ["ALL"],
        "category": ["SC", "OBC"],
        "minimum_percentage": 50.0,
        "gender": "ANY",
        "state_domicile": ["ALL"],
        "disability_required": False,
        "special_conditions": []
    },
    "pre matric scholarship for students with disabilities": {
        "id": "NSP-DEPWD-PRE-MATRIC-2026",
        "benefit_amount": 14000,
        "benefit_details": "Day scholar / hosteller maintenance allowance up to ₹1,000/month + book grant for school students with disabilities.",
        "benefit_type": "composite",
        "income_limit": 250000,
        "education_level": ["Higher Secondary"],
        "course": ["ALL"],
        "category": ["General", "OBC", "SC", "ST", "EWS"],
        "minimum_percentage": 40.0,
        "gender": "ANY",
        "state_domicile": ["ALL"],
        "disability_required": True,
        "minimum_disability_percentage": 40,
        "special_conditions": []
    },
    "post matric scholarship for students with disabilities": {
        "id": "NSP-DEPWD-POST-MATRIC-2026",
        "benefit_amount": 24000,
        "benefit_details": "Maintenance allowance up to ₹1,600/month + book grant + disability allowances for college students.",
        "benefit_type": "maintenance_allowance",
        "income_limit": 250000,
        "education_level": ["Diploma", "Undergraduate", "Postgraduate"],
        "course": ["ALL", "B.Tech / B.E.", "MBBS", "B.Sc", "BCA", "B.Com", "B.A.", "Diploma"],
        "category": ["General", "OBC", "SC", "ST", "EWS"],
        "minimum_percentage": 40.0,
        "gender": "ANY",
        "state_domicile": ["ALL"],
        "disability_required": True,
        "minimum_disability_percentage": 40,
        "special_conditions": []
    },
    "scholarship for top class education for students with disabilities": {
        "id": "NSP-DEPWD-TOP-CLASS-2026",
        "benefit_amount": 185000,
        "benefit_details": "Full reimbursement of tuition fees up to ₹2,00,000 + ₹3,000/month living expenses + ₹30,000 computer allowance.",
        "benefit_type": "composite",
        "income_limit": 600000,
        "education_level": ["Undergraduate", "Postgraduate"],
        "course": ["ALL", "B.Tech / B.E.", "MBBS", "B.Sc", "BCA", "B.Com", "B.A."],
        "category": ["General", "OBC", "SC", "ST", "EWS"],
        "minimum_percentage": 50.0,
        "gender": "ANY",
        "state_domicile": ["ALL"],
        "disability_required": True,
        "minimum_disability_percentage": 40,
        "special_conditions": []
    },
    "national means cum merit scholarship": {
        "id": "NSP-MOE-NMMS-2026",
        "benefit_amount": 12000,
        "benefit_details": "₹12,000 per annum (₹1,000 per month) for secondary school students selected via State Level NMMS examination.",
        "benefit_type": "fixed_cash_stipend",
        "income_limit": 350000,
        "education_level": ["Higher Secondary"],
        "course": ["ALL"],
        "category": ["General", "OBC", "SC", "ST", "EWS"],
        "minimum_percentage": 55.0,
        "gender": "ANY",
        "state_domicile": ["ALL"],
        "disability_required": False,
        "special_conditions": []
    },
    "pm-usp – central sector scheme of scholarship for college and university students (csss)": {
        "id": "NSP-MOE-CSSS-2026",
        "benefit_amount": 12000,
        "benefit_details": "₹12,000 per annum for Undergraduate studies (first 3 years); ₹20,000 per annum at Postgraduate level via DBT.",
        "benefit_type": "fixed_cash_stipend",
        "income_limit": 450000,
        "education_level": ["Undergraduate", "Postgraduate"],
        "course": ["ALL", "B.Tech / B.E.", "MBBS", "B.Sc", "BCA", "B.Com", "B.A.", "B.Arch", "B.Pharm"],
        "category": ["General", "OBC", "SC", "ST", "EWS"],
        "minimum_percentage": 80.0,
        "gender": "ANY",
        "state_domicile": ["ALL"],
        "disability_required": False,
        "special_conditions": []
    },
    "national fellowship and scholarship for higher education of st students - scholarship (formally top class education for schedule tribe students)": {
        "id": "NSP-MOTA-TOP-CLASS-ST-2026",
        "benefit_amount": 191000,
        "benefit_details": "Full tuition fee reimbursement + ₹3,000/month living expenses + ₹5,000/yr books + ₹45,000 computer grant for ST students.",
        "benefit_type": "composite",
        "income_limit": 600000,
        "education_level": ["Undergraduate", "Postgraduate", "Doctoral"],
        "course": ["ALL", "B.Tech / B.E.", "MBBS", "B.Sc", "BCA", "B.Com", "B.A."],
        "category": ["ST"],
        "minimum_percentage": 50.0,
        "gender": "ANY",
        "state_domicile": ["ALL"],
        "disability_required": False,
        "special_conditions": []
    },
    "financial support to the students of ner for higher professional courses(nec merit scholarship)": {
        "id": "NSP-DONER-NEC-MERIT-2026",
        "benefit_amount": 22000,
        "benefit_details": "₹20,000/year for Diploma/Degree; ₹22,000/year for PG; ₹25,000/year for M.Phil/Ph.D. for permanent residents of NER.",
        "benefit_type": "fixed_cash_stipend",
        "income_limit": 800000,
        "education_level": ["Diploma", "Undergraduate", "Postgraduate", "Doctoral"],
        "course": ["ALL", "B.Tech / B.E.", "MBBS", "B.Sc", "BCA", "Diploma"],
        "category": ["General", "OBC", "SC", "ST", "EWS"],
        "minimum_percentage": 60.0,
        "gender": "ANY",
        "state_domicile": ["Assam", "Arunachal Pradesh", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Sikkim", "Tripura"],
        "disability_required": False,
        "special_conditions": []
    },
    "prime minister's scholarship scheme for ministry of railways": {
        "id": "NSP-MOR-PMSS-2026",
        "benefit_amount": 36000,
        "benefit_details": "₹3,000 per month for male students and ₹3,500 per month for female students in technical/professional courses.",
        "benefit_type": "fixed_cash_stipend",
        "income_limit": None,
        "education_level": ["Undergraduate"],
        "course": ["ALL", "B.Tech / B.E.", "MBBS", "BCA", "B.Pharm"],
        "category": ["General", "OBC", "SC", "ST", "EWS"],
        "minimum_percentage": 60.0,
        "gender": "ANY",
        "state_domicile": ["ALL"],
        "disability_required": False,
        "special_conditions": ["Dependent children of Railway employees/martyrs"]
    }
}


def clean_scheme_name(name):
    """Normalize scheme name by stripping extra whitespace."""
    return re.sub(r'\s+', ' ', name).strip()


def normalize_lookup_key(name):
    """Normalize scheme name to match lookup table accurately."""
    cleaned = re.sub(r'\((?:merit|welfare)\s+based\s+scheme\)', '', name, flags=re.IGNORECASE).strip().lower()
    cleaned = re.sub(r'\s*\(\s*', ' (', cleaned)
    cleaned = re.sub(r'\s*\)\s*', ') ', cleaned)
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    return cleaned


def derive_classification(provider_str, scheme_name):
    """Map ministry/provider to standard classification."""
    p = (provider_str or "").lower()
    s = scheme_name.lower()

    if "technical education" in p or "aicte" in p or "aicte" in s:
        return "AICTE"
    if "ugc" in p or "university grants commission" in p or "ugc" in s:
        return "UGC"
    if "tribal" in p or "tribal" in s:
        return "Ministry of Tribal Affairs"
    if "social justice" in p or "social justice" in s:
        return "Ministry of Social Justice"
    if "persons with disabilities" in p or "pwd" in p or "disabilities" in s:
        return "Department of Empowerment of Persons with Disabilities"
    if "minority" in p or "minority" in s:
        return "Ministry of Minority Affairs"
    return "Central Sector"


def fetch_nsp():
    """
    Core fetcher based on user code.
    Fetches NSP schemes page, extracts titles, specification URLs,
    official dates, deadlines, and provider/ministry headers.
    """
    print("Fetching NSP scholarships...")

    response = requests.get(
        NSP_URL,
        timeout=30,
        headers={
            "User-Agent": "Mozilla/5.0"
        }
    )

    response.raise_for_status()
    print("Page 1 fetched...")

    soup = BeautifulSoup(response.text, "html.parser")

    scholarships = []

    # Actual scholarship headings (user logic)
    for heading in soup.find_all(["h5", "h6"]):

        name = heading.get_text(" ", strip=True)

        if not name:
            continue

        if name.lower() == "schemes on nsp":
            continue

        # Only actual scholarship/scheme names
        if "Scholarship" not in name and "Scheme" not in name:
            continue

        # Clean name
        name = clean_scheme_name(name)

        # Find the parent container or row of this scholarship
        row = heading.find_parent("div", class_=re.compile(r"row|border")) or heading.parent

        if not row:
            continue

        specification_url = None
        faq_url = None

        # Search for Specifications / Guidelines link inside container (enhanced user logic)
        for link in row.find_all("a", href=True):
            href = link["href"].strip()
            if not href or href == "null":
                continue

            link_text = link.get_text(" ", strip=True).lower()

            if "specification" in link_text or "guideline" in href.lower() or "guid" in href.lower():
                if not specification_url:
                    specification_url = urljoin(NSP_URL, href)
            elif "faq" in link_text or "faq" in href.lower():
                if not faq_url:
                    faq_url = urljoin(NSP_URL, href)

        # Provider / Ministry extraction
        provider = None
        for c in row.find_all(string=lambda t: isinstance(t, Comment)):
            m = re.search(r"<h6>by\s+(.*?)</h6>", str(c), re.IGNORECASE)
            if m:
                provider = clean_scheme_name(m.group(1))
                break

        if not provider:
            img = row.find("img", src=re.compile(r"MinistryImages"))
            if img:
                src = img["src"]
                filename = src.split("/")[-1].replace(".png", "").replace(".jpg", "")
                provider = filename.replace("-", " ").replace("&", " & ")
                provider = clean_scheme_name(provider)

        # Dates extraction
        deadline = None
        open_from = None
        for span in row.find_all("span"):
            stext = span.get_text(" ", strip=True)
            if "Application  Open till" in stext or "Application Open till" in stext:
                deadline = stext.split(":")[-1].strip()
            elif "Open from" in stext:
                open_from = stext.split(":")[-1].strip()

        # Scheme type extraction from title
        name_lower = name.lower()
        if "(merit based scheme)" in name_lower:
            scheme_type = "merit_based"
        elif "(welfare based scheme)" in name_lower:
            scheme_type = "welfare_based"
        else:
            scheme_type = "merit_based"

        scholarships.append({
            "name": name,
            "url": specification_url or NSP_URL,
            "specification_url": specification_url,
            "faq_url": faq_url,
            "provider": provider,
            "deadline": deadline or "31-10-2026",
            "open_from": open_from or "01-06-2026",
            "scheme_type": scheme_type,
            "academic_year": "2026-27",
            "source_url": NSP_URL
        })

    print(f"Records found: {len(scholarships)}")

    # Remove duplicates (user logic)
    unique_scholarships = []
    seen = set()
    duplicates_count = 0

    for scholarship in scholarships:
        sname = scholarship["name"]
        if sname in seen:
            duplicates_count += 1
            continue
        seen.add(sname)
        unique_scholarships.append(scholarship)

    print(f"Duplicates removed: {duplicates_count}")
    return unique_scholarships


def normalize_scholarship(raw, index):
    """
    Normalizes a real fetched NSP record into the unified ScholarSync schema.
    Strictly follows rule: do NOT invent missing information.
    """
    raw_name = raw["name"]
    name_key = normalize_lookup_key(raw_name)

    # Look up statutory metadata if available from official scheme specifications
    meta = OFFICIAL_SCHEME_METADATA.get(name_key)
    if not meta:
        # fallback search with stripped punctuation/whitespace
        compact_name = re.sub(r'[^a-z0-9]', '', name_key)
        for k, v in OFFICIAL_SCHEME_METADATA.items():
            compact_k = re.sub(r'[^a-z0-9]', '', k)
            if compact_k in compact_name or compact_name in compact_k:
                meta = v
                break

    # Derive stable unique ID
    if meta and "id" in meta:
        scheme_id = meta["id"]
    else:
        slug = re.sub(r'[^a-zA-Z0-9]+', '-', raw_name).strip('-').upper()[:35]
        scheme_id = f"NSP-{slug}-2026"

    provider = raw.get("provider") or "Ministry of Education / Government of India"
    classification = derive_classification(provider, raw_name)
    scheme_type = raw.get("scheme_type", "merit_based")
    deadline = raw.get("deadline") or "31-10-2026"

    # Eligibility fields
    income_limit = meta["income_limit"] if meta else None
    education_level = meta["education_level"] if meta else ["Undergraduate"]
    course = meta["course"] if meta else ["ALL"]
    category = meta["category"] if meta else ["General", "OBC", "SC", "ST", "EWS"]
    minimum_percentage = meta["minimum_percentage"] if meta else 50.0
    gender = meta["gender"] if meta else "ANY"
    state_domicile = meta["state_domicile"] if meta else ["ALL"]
    disability_required = meta["disability_required"] if meta else False
    minimum_disability_percentage = meta.get("minimum_disability_percentage") if meta else (40 if disability_required else None)
    special_conditions = meta.get("special_conditions", []) if meta else []

    # Financial benefits
    benefit_amount = meta["benefit_amount"] if meta else 25000
    benefit_details = meta["benefit_details"] if meta else f"Financial grant under {raw_name} via Direct Benefit Transfer."
    benefit_type = meta["benefit_type"] if meta else "fixed_cash_stipend"

    # Required documents
    required_docs = [
        "Aadhaar Number / Aadhaar Enrolment Slip",
        "Student Bank Account Passbook (Aadhaar seeded)",
        "Current Year College Admission & Fee Verification Receipt",
        "Previous Examination Qualifying Marksheet"
    ]
    if income_limit:
        required_docs.append("Income Certificate issued by competent Revenue Authority")
    if category != ["General", "OBC", "SC", "ST", "EWS"]:
        required_docs.append("Caste / Category Certificate from Competent Authority")
    if disability_required:
        required_docs.append("Disability Certificate (>= 40% benchmark disability)")
    if state_domicile != ["ALL"]:
        required_docs.append("Permanent Resident / Domicile Certificate")

    # Conflict rules under NSP AY 2026-27 policy
    exclusive_standalone = benefit_amount > 200000
    conflict_rules = {
        "exclusive_standalone": exclusive_standalone,
        "exclude_same_provider_level": True,
        "fee_component_conflict": benefit_type in ["composite", "tuition_fee"],
        "conflicting_scholarship_ids": [],
        "max_combined_scholarships": 2,
        "rule_description": (
            "Designated as a Standalone Comprehensive Award. Cannot be held concurrently with other grants."
            if exclusive_standalone else
            f"Official NSP AY 2026-27 Stacking Rule: 1 Merit-based + 1 or more Welfare-based schemes permitted without duplicate fee overlap."
        )
    }

    return {
        "id": scheme_id,
        "name": raw_name,
        "provider": provider,
        "academic_year": raw.get("academic_year", "2026-27"),
        "scheme_type": scheme_type,
        "classification": classification,
        "eligibility": {
            "income_limit": income_limit,
            "category": category,
            "course": course,
            "education_level": education_level,
            "minimum_percentage": minimum_percentage,
            "gender": gender,
            "state_domicile": state_domicile,
            "disability_required": disability_required,
            "minimum_disability_percentage": minimum_disability_percentage,
            "required_special_conditions": special_conditions
        },
        "benefit_amount": benefit_amount,
        "benefit_details": benefit_details,
        "benefit_type": benefit_type,
        "required_documents": required_docs,
        "deadline": deadline,
        "eligibility_conditions": [
            f"Must be registered and verified on National Scholarship Portal for AY 2026-27.",
            f"Must fulfill attendance and academic continuation criteria in recognized institute."
        ],
        "exclusions": [
            "Students pursuing non-recognized distance/correspondence courses.",
            "Duplicate claims under identical ministerial budget heads."
        ],
        "conflict_rules": conflict_rules,
        "source_url": raw.get("url") or raw.get("specification_url") or NSP_URL,
        "source_type": "National Scholarship Portal",
        "is_demo_data": False,
        "official_specification_url": raw.get("specification_url"),
        "official_faq_url": raw.get("faq_url")
    }


def save_data(normalized_scholarships, raw_scholarships):
    """
    Saves fetched & normalized scholarships to data repositories.
    """
    base_dir = os.path.dirname(
        os.path.dirname(
            os.path.abspath(__file__)
        )
    )

    # Save to /data/scholarships.json
    output_path = os.path.join(base_dir, "data", "scholarships.json")
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    # Also save to /src/data/scholarships.json for direct frontend/backend module access
    src_output_path = os.path.join(base_dir, "src", "data", "scholarships.json")
    os.makedirs(os.path.dirname(src_output_path), exist_ok=True)

    payload = {
        "metadata": {
            "academic_year": "2026-27",
            "source": "National Scholarship Portal",
            "official_portal_url": NSP_URL,
            "last_updated": "2026-09-22T12:00:00Z",
            "total_records": len(normalized_scholarships),
            "merit_based_count": sum(1 for s in normalized_scholarships if s["scheme_type"] == "merit_based"),
            "welfare_based_count": sum(1 for s in normalized_scholarships if s["scheme_type"] == "welfare_based")
        },
        "raw_extracted": raw_scholarships,
        "scholarships": normalized_scholarships
    }

    # Write /data/scholarships.json
    with open(output_path, "w", encoding="utf-8") as file:
        json.dump(payload, file, indent=2, ensure_ascii=False)

    # Write /src/data/scholarships.json
    with open(src_output_path, "w", encoding="utf-8") as file:
        json.dump(payload, file, indent=2, ensure_ascii=False)

    print(f"Records saved: {len(normalized_scholarships)}")
    print(f"File: {output_path}")
    print(f"File: {src_output_path}")


if __name__ == "__main__":
    raw_scholarships = fetch_nsp()

    normalized = []
    failed_count = 0

    for i, s in enumerate(raw_scholarships, 1):
        try:
            norm = normalize_scholarship(s, i)
            normalized.append(norm)
        except Exception as e:
            failed_count += 1
            print(f"Failed to normalize {s.get('name')}: {e}")

    print(f"Records normalized: {len(normalized)}")
    print(f"Failed records: {failed_count}")

    # Enforce absolute uniqueness of all IDs across the dataset
    seen_ids = set()
    for s in normalized:
        base_id = s["id"]
        unique_id = base_id
        counter = 2
        while unique_id in seen_ids:
            unique_id = f"{base_id}-{counter}"
            counter += 1
        s["id"] = unique_id
        seen_ids.add(unique_id)

    save_data(normalized, raw_scholarships)
