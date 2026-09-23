# ScholarSync – Intelligent Scholarship & Combination Engine

> **One profile. Multiple scholarships. Smarter combinations.**

ScholarSync is an intelligent scholarship discovery and combination engine designed to simplify the scholarship application process for students.

Instead of manually checking multiple scholarship portals, eligibility conditions, income limits, academic requirements, documents, deadlines, and scholarship conflicts, ScholarSync analyzes the student's profile and automatically identifies relevant scholarships and valid scholarship combinations.

🔗 **Live Demo:** https://scholarsync-v1-git-main-kaknateganesh24.vercel.app/

🔗 **GitHub Repository:** https://github.com/kishanpand724/ScholarSyncv1


## Table of Contents

- [Problem Statement](#problem-statement)
- [Our Solution](#our-solution)
- [What Makes ScholarSync Different](#what-makes-scholarsync-different)
- [Key Features](#key-features)
- [System Architecture](#system-architecture)
- [Data Architecture](#data-architecture)
- [Data Collection and Processing Pipeline](#data-collection-and-processing-pipeline)
- [Scholarship Data Structure](#scholarship-data-structure)
- [Eligibility Engine](#eligibility-engine)
- [Three-State Eligibility Model](#three-state-eligibility-model)
- [Explainable Eligibility Results](#explainable-eligibility-results)
- [Automatic Combination Engine](#automatic-combination-engine)
- [Conflict Detection](#conflict-detection)
- [Scholarship Details](#scholarship-details)
- [Student Dashboard](#student-dashboard)
- [Backend and API Architecture](#backend-and-api-architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Complete User Flow](#complete-user-flow)
- [Example](#example)
- [Why Rule-Based Matching](#why-rule-based-matching)
- [Data Accuracy and Validation](#data-accuracy-and-validation)
- [Installation and Local Setup](#installation-and-local-setup)
- [Environment Configuration](#environment-configuration)
- [Running the Project](#running-the-project)
- [Future Scope](#future-scope)
- [Impact](#impact)
- [Team](#team)
- [Disclaimer](#disclaimer)


# Problem Statement

Students often have to search across multiple scholarship portals to find financial assistance.

A student may need to check:

- Different scholarship portals
- Different eligibility criteria
- Academic percentage requirements
- Income limits
- Category restrictions
- Gender restrictions
- Course and year requirements
- Entrance examination requirements
- Required documents
- Application deadlines
- Scholarship benefits
- Rules about receiving multiple scholarships together

The problem becomes even more difficult when a student is eligible for multiple scholarships but does not know:

- Which scholarships they can actually apply for
- Which scholarships require additional information
- Which scholarships can be combined
- Which combinations are restricted
- Which scholarship provides what benefit
- What the actual application deadline is
- Where the official application should be submitted

This creates a **Scholarship Maze** where potentially useful opportunities can be missed.


# Our Solution

ScholarSync solves this problem by creating a single intelligent scholarship analysis system.

The student enters their academic and personal information once.

ScholarSync then:

1. Collects scholarship information from official sources.
2. Normalizes scholarship information into a structured dataset.
3. Analyzes the student's profile.
4. Checks scholarship-specific eligibility rules.
5. Explains why the student is eligible or not eligible.
6. Identifies missing information separately.
7. Shows relevant scholarships.
8. Displays benefits, documents and deadlines.
9. Automatically generates possible scholarship combinations.
10. Checks combinations against conflict and restriction rules.
11. Shows valid combinations to the student.

The core idea is:

**Student Profile → Scholarship Data → Eligibility Analysis → Combination Generation → Conflict Checking → Results**


# What Makes ScholarSync Different

Traditional scholarship discovery mainly focuses on finding individual scholarships.

ScholarSync goes one step further.

It considers the relationship between multiple scholarships.

For example:

Scholarship A  
+ Scholarship B  
+ Scholarship C

may individually satisfy eligibility requirements, but the three scholarships may not necessarily be allowed together.

Therefore ScholarSync does not simply ask:

> "Is the student eligible for this scholarship?"

It also asks:

> "Which eligible scholarships can work together under their respective rules?"

This combination-based approach is one of the core ideas behind ScholarSync.


# Key Features

## 1. Single Student Profile

The student provides their information once instead of repeatedly entering the same details.

The profile can contain information such as:

- Personal details
- State and domicile
- Category
- Gender
- Family income
- Disability information
- Class 10 details
- Class 12 details
- Diploma details
- Graduation details
- Course
- Branch
- Current year
- Current semester
- Previous academic results
- Current CGPA
- Backlogs / ATKT
- Entrance examination information

The academic fields are dynamically handled according to the student's education level and course structure.


## 2. Multi-Portal Scholarship Data

ScholarSync is designed to work with scholarship information from multiple official sources.

Current project data sources include:

- National Scholarship Portal (NSP)
- Maharashtra MahaDBT

Official sources:

- NSP: https://scholarships.gov.in/
- MahaDBT: https://mahadbt.maharashtra.gov.in/

The system is designed so additional scholarship sources can be integrated in the future.


## 3. Automated Scholarship Data Pipeline

Scholarship information is processed through a data pipeline instead of manually hardcoding every scholarship.

The pipeline follows the general flow:

Official Portal  
→ Scholarship Listing  
→ Scheme Details  
→ Guidelines / PDF  
→ Extraction  
→ Normalization  
→ Validation  
→ Structured Scholarship Dataset  
→ Matching Engine


## 4. Profile-Based Matching

After the profile is saved, ScholarSync evaluates the available scholarship dataset against the student's actual information.

It checks scholarship-specific rules such as:

- Minimum percentage
- Maximum family income
- Category
- Gender
- Domicile
- Course
- Branch
- Current year
- Current semester
- Academic level
- Entrance examination
- Previous academic result
- Current CGPA
- Backlogs
- Other scholarship restrictions


## 5. Explainable Results

ScholarSync does not simply display:

> Eligible

or

> Not Eligible

It also explains the reason behind the result.

For example:

- Family income is within the required limit.
- Academic percentage satisfies the minimum requirement.
- Course requirement is satisfied.
- Gender requirement is not satisfied.
- Required information is missing.


## 6. Real Scholarship Deadlines

Each scholarship maintains its own deadline.

ScholarSync does not use one global deadline for all scholarships.

Where the official source provides separate dates, the system can maintain different stages such as:

- Student application deadline
- Defective application verification deadline
- Institute verification deadline
- Nodal verification deadline

If an official source does not specify a deadline, the system should not invent one.


## 7. Scholarship Benefits

Scholarship information can include:

- Scholarship amount
- Annual benefit
- Duration
- Course coverage
- Other financial assistance information

This allows students to understand what each scholarship actually provides.


## 8. Required Documents

ScholarSync can display scholarship-specific document requirements such as:

- Income certificate
- Academic marksheet
- Domicile certificate
- Category certificate
- Disability certificate
- Admission proof
- Bank details
- Other scheme-specific documents


## 9. Official Application Information

Scholarship results provide official application information where available.

The system keeps scholarship source information separate from application information so that students can be directed toward the appropriate official portal or application flow.

ScholarSync avoids inventing application URLs when an exact official application page is not available.


# System Architecture

The overall architecture of ScholarSync can be represented as:

Student  
↓  
Student Profile  
↓  
Scholarship Dataset  
↓  
Eligibility Engine  
↓  
Eligible / Not Eligible / Additional Information Required  
↓  
Combination Generator  
↓  
Conflict Checker  
↓  
Valid Scholarship Combinations  
↓  
Dashboard / Scholarship Details


The system is divided into major layers:

### Presentation Layer

Responsible for:

- Student profile
- Dashboard
- Scholarship listing
- Scholarship details
- Eligibility results
- Combination results

### API Layer

Responsible for:

- Receiving profile information
- Returning scholarship data
- Running matching
- Generating combinations
- Returning analysis results

### Business Logic Layer

Responsible for:

- Eligibility evaluation
- Rule processing
- Combination generation
- Conflict detection
- Result explanation

### Data Layer

Responsible for:

- Scholarship dataset
- Structured scholarship rules
- Source information
- Application information
- Deadline information


# Data Architecture

ScholarSync follows a structured and data-driven architecture.

Instead of keeping scholarship rules directly inside the frontend, scholarship information is stored as structured data.

The general data architecture is:

Official Scholarship Sources  
↓  
Data Fetcher  
↓  
Content / Guideline Extraction  
↓  
Normalization  
↓  
Validation  
↓  
Structured Scholarship Records  
↓  
Eligibility Engine  
↓  
Combination Engine  
↓  
API  
↓  
Frontend


This architecture allows scholarship data and application logic to remain separated.

Therefore, updating scholarship information does not require rewriting the complete frontend application.


# Data Collection and Processing Pipeline

ScholarSync uses an automated data-processing approach for scholarship information.

## Step 1 – Source Discovery

The system identifies scholarship information from official sources such as:

- National Scholarship Portal
- MahaDBT

## Step 2 – Data Fetching

The fetcher retrieves relevant scholarship information from the source.

Depending on the source, information may be available through:

- Scheme listings
- Scheme detail pages
- Official guidelines
- PDF documents
- Application information

## Step 3 – Content Extraction

Important information is extracted from the source.

Examples include:

- Scheme name
- Organization
- Eligibility
- Income limit
- Academic requirements
- Category
- Gender
- Course
- Benefit
- Documents
- Deadline
- Application information
- Restrictions
- Source URL

## Step 4 – Normalization

Different portals may describe similar information differently.

The extracted information is therefore converted into a common structured format.

For example:

Different source fields:

- Family Income
- Annual Income
- Parental Income

can be normalized into a common field such as:

`family_income_max`

## Step 5 – Validation

The extracted scholarship is checked against its source.

Important validation includes:

- Scheme identity
- Organization
- Eligibility conditions
- Benefits
- Deadline
- Application information
- Guideline source

If the listing and guideline appear to describe different schemes, the system should flag the record for review rather than silently merging incorrect information.

## Step 6 – Storage

After processing and validation, the scholarship is stored in the structured dataset.

## Step 7 – Matching

The Eligibility Engine reads the structured scholarship records and compares them with the student's profile.


# Scholarship Data Structure

A scholarship record is designed to contain structured information instead of only a name and amount.

Typical information includes:

- `id`
- `scheme_name`
- `organization`
- `portal`
- `description`
- `eligibility`
- `academic_requirements`
- `income_limit`
- `category_rules`
- `gender_rules`
- `domicile_rules`
- `course_rules`
- `branch_rules`
- `year_rules`
- `semester_rules`
- `entrance_exam_rules`
- `benefit`
- `duration`
- `documents`
- `deadline`
- `application_url`
- `official_scheme_url`
- `official_guideline_url`
- `official_application_url`
- `application_portal`
- `restrictions`
- `conflict_rules`
- `source`
- `source_validation_status`

Not every scholarship contains every field.

When the official source does not specify a particular condition, the system should preserve that as unknown or not specified instead of incorrectly assuming a value.


# Eligibility Engine

The Eligibility Engine is the core decision-making component of ScholarSync.

It compares:

**Student Profile**

against

**Scholarship Rules**

Each relevant rule is evaluated separately.

Examples:

### Academic Rule

Student percentage >= required percentage

### Income Rule

Student family income <= scholarship income limit

### Category Rule

Student category matches allowed categories

### Gender Rule

Student gender satisfies scholarship requirement

### Course Rule

Student course matches eligible course list

### Year Rule

Student current year satisfies scholarship year requirement

### Entrance Exam Rule

Student's entrance examination information satisfies the scholarship requirement

### Domicile Rule

Student domicile satisfies the scholarship requirement


# Three-State Eligibility Model

ScholarSync uses a three-state result model:

### Eligible

The available student information satisfies the required conditions.

### Not Eligible

The available student information clearly violates one or more required conditions.

### Additional Information Required

The scholarship may be applicable, but a required piece of information is missing.

This distinction is important.

For example:

If a scholarship requires an entrance examination percentile but the student has not entered their percentile, the system should not immediately classify the student as Not Eligible.

Instead:

**Additional Information Required**

This prevents missing information from being treated as a negative result.


# Explainable Eligibility Results

Every eligibility decision can be accompanied by reasons.

Example:

**Eligible**

- Family income is within the allowed limit.
- Academic percentage satisfies the requirement.
- Student's course is eligible.
- Category requirement is satisfied.

Example:

**Not Eligible**

- Required academic percentage is 80%.
- Student percentage is 72%.

Example:

**Additional Information Required**

- Entrance examination percentile is required.
- The student's entrance examination details are missing.

This makes the matching process more transparent and understandable to students.


# Automatic Combination Engine

One of the major components of ScholarSync is the Combination Engine.

The student does not have to manually select scholarships one by one to test combinations.

Instead, the system starts from the scholarships that the student is eligible for.

For example:

Eligible Scholarships:

- Scholarship A
- Scholarship B
- Scholarship C
- Scholarship D

The system can generate possible combinations such as:

A + B  
A + C  
A + D  
B + C  
B + D  
C + D  
A + B + C  
A + B + D  
A + C + D  
B + C + D  
A + B + C + D

The generated combinations are then passed to the conflict-checking stage.


# Conflict Detection

Individual eligibility does not automatically mean that multiple scholarships can be received together.

Some scholarships may contain restrictions such as:

- Cannot receive another scholarship
- Cannot receive financial assistance from another source
- Cannot combine with a particular scheme
- Only one scholarship from a particular category may be used
- Scheme-specific administrative restrictions

ScholarSync checks such rules at the combination level.

The process is:

Eligible Scholarships  
↓  
Generate Possible Combinations  
↓  
Check Restrictions  
↓  
Remove Conflicting Combinations  
↓  
Return Valid Combinations


For example:

Scholarship A → Eligible  
Scholarship B → Eligible

But if Scholarship A states that the student cannot receive financial assistance from another source, then:

A + B → Conflict

The individual eligibility of A and B remains unchanged, but the combination is rejected.


# Scholarship Details

Each scholarship can provide a detailed view containing information such as:

- Scholarship name
- Organization
- Description
- Eligibility criteria
- Academic requirements
- Income requirements
- Category requirements
- Course requirements
- Benefit amount
- Duration
- Required documents
- Application deadline
- Official source
- Application information
- Restrictions

This allows the student to understand the scholarship before applying.


# Student Dashboard

The dashboard acts as the main entry point for the student.

After completing the profile, the dashboard can present:

- Profile completion status
- Matching scholarships
- Eligibility results
- Additional information requirements
- Scholarship benefits
- Application deadlines
- Scholarship details
- Valid combinations

The dashboard is designed around student-facing information rather than internal system or developer terminology.


# Backend and API Architecture

ScholarSync uses a backend service layer to keep the matching logic separate from the frontend.

The backend is responsible for:

- Scholarship retrieval
- Profile analysis
- Eligibility evaluation
- Combination generation
- Conflict checking
- Analysis responses

The project includes API routes such as:

`GET /api/health`

Used for backend health checking.

`GET /api/scholarships`

Used to retrieve scholarship information.

`GET /api/scholarships/:id`

Used to retrieve details of a specific scholarship.

`POST /api/match`

Used to analyze the student's profile against scholarship rules.

`POST /api/combinations`

Used to generate and validate scholarship combinations.

`POST /api/analyze`

Used for scholarship analysis workflows supported by the application.


# Technology Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide React
- Motion

## Backend

- Node.js
- Express
- TypeScript
- TSX

## Data and Logic

- Structured JSON scholarship dataset
- Deterministic eligibility rules
- Combination generation
- Conflict checking
- Scholarship extraction and normalization pipeline

## External Sources

- National Scholarship Portal
- Maharashtra MahaDBT


# Project Structure

The project is organized into frontend, backend, data and processing components.

ScholarSync/

├── src/  
│   ├── components/  
│   ├── services/  
│   ├── eligibilityEngine.ts  
│   ├── combinationEngine.ts  
│   └── scholarshipService.ts  
│
├── data/  
│   └── scholarship datasets  
│
├── scripts/  
│   └── scholarship fetching / processing scripts  
│
├── server.ts  
├── package.json  
└── README.md


The exact structure may evolve as the data pipeline and scholarship sources expand.


# Complete User Flow

The complete ScholarSync workflow is:

### Step 1 – Student Opens ScholarSync

The student accesses the ScholarSync dashboard.

### Step 2 – Complete Profile

The student enters their relevant academic and personal information.

### Step 3 – Save Profile

The profile is validated and stored for the current application session.

### Step 4 – Scholarship Analysis

The system compares the student profile with the scholarship dataset.

### Step 5 – Eligibility Classification

Each scholarship is classified as:

- Eligible
- Not Eligible
- Additional Information Required

### Step 6 – Explanation

The system provides reasons for the eligibility result.

### Step 7 – Scholarship Details

The student can view:

- Benefit
- Eligibility
- Documents
- Deadline
- Official source
- Application information

### Step 8 – Combination Generation

All relevant eligible scholarships are automatically considered for combinations.

### Step 9 – Conflict Checking

Each generated combination is checked against scholarship restrictions.

### Step 10 – Final Results

The student receives valid scholarship combinations and individual scholarship information in one place.


# Example

Consider a student with:

- Family income within the required limit
- Eligible academic percentage
- Eligible course
- Valid category
- Required domicile
- Required entrance examination information

Suppose the system identifies:

Scholarship A → Eligible  
Scholarship B → Eligible  
Scholarship C → Eligible  
Scholarship D → Not Eligible

The system does not stop at these individual results.

It also checks:

A + B  
A + C  
B + C  
A + B + C

If:

A + B → Valid  
A + C → Valid  
B + C → Conflict  
A + B + C → Conflict

then the student can see the combinations that satisfy the defined scholarship rules.

The important part is that the student did not have to manually test every combination.


# Why Rule-Based Matching

Scholarship eligibility is generally defined through explicit conditions such as:

- Percentage
- Income
- Category
- Gender
- Course
- Year
- Domicile
- Entrance examination
- Restrictions

These conditions can be represented as structured rules.

Therefore, ScholarSync uses deterministic rule evaluation for the core eligibility and combination process.

This provides:

- Consistent results
- Explainable decisions
- Easier debugging
- Easier validation
- Reproducible results
- Clear reasons for eligibility decisions

AI or intelligent extraction can assist the data-processing side, but the final eligibility logic should remain deterministic and traceable to scholarship rules.


# Data Accuracy and Validation

Scholarship information can change between academic years.

Therefore, ScholarSync treats official sources as the primary reference.

The data pipeline is designed to:

- Preserve official source information
- Maintain scheme-specific deadlines
- Avoid global/default deadlines
- Avoid inventing missing eligibility conditions
- Avoid inventing application URLs
- Preserve source-specific restrictions
- Validate scheme identity
- Keep unknown information separate from false conditions

For example, if a scholarship guideline does not specify a disability condition, the system should not automatically assume:

`disability_required = false`

Instead, the condition should remain unspecified unless supported by the source.

Similarly, if an official source does not provide a deadline, ScholarSync should show that the deadline is not specified rather than generating an estimated date.


# Installation and Local Setup

## 1. Clone the Repository

Repository:

https://github.com/kishanpand724/ScholarSyncv1

Clone it using:

    git clone https://github.com/kishanpand724/ScholarSyncv1.git

Move into the project directory:

    cd ScholarSyncv1


## 2. Install Dependencies

    npm install


# Environment Configuration

If the project configuration requires environment variables, create the required environment file based on the variables used by the backend and data services.

Do not commit private credentials, API keys, tokens or secrets to the repository.

Use environment variables for sensitive configuration.


# Running the Project

Start the development environment using the project's configured npm script.

    npm run dev

The frontend and backend can then be accessed through the local development environment configured by the project.

For a production build:

    npm run build


# Design Principles

ScholarSync follows several core design principles.

## Student First

The interface should focus on information that helps students understand their scholarship opportunities.

## Explainability

Eligibility decisions should be understandable instead of being black-box results.

## Data Driven

Scholarship rules should come from structured scholarship data rather than being hardcoded throughout the frontend.

## Source Based

Scholarship information should remain connected to official sources.

## No False Assumptions

Missing information should not automatically be interpreted as an ineligible condition.

## Automatic Combination Analysis

Students should not need to manually test every scholarship combination.

## Extensible Architecture

Additional scholarship portals and scholarship schemes should be able to integrate into the same architecture.


# Future Scope

ScholarSync can be extended further with:

- More government scholarship portals
- More state-level scholarship sources
- More centralized scholarship datasets
- Automated periodic data refresh
- Improved PDF and guideline extraction
- Source change detection
- Deadline change detection
- Scholarship notification system
- Deadline reminders
- Advanced document checklist
- Scholarship recommendation explanations
- Improved combination optimization
- Student application tracking
- Multilingual student interface
- Mobile application
- Additional education-level support
- More sophisticated administrative conflict rules


# Impact

ScholarSync aims to reduce the effort required for students to discover and understand scholarships.

Instead of making students manually search:

**Portal → Scheme → Eligibility → Documents → Deadline → Another Portal → Another Scheme**

ScholarSync brings the process into one workflow:

**Profile → Analyze → Understand → Compare → Check Combinations → Apply**

The goal is not simply to list scholarships.

The goal is to make scholarship discovery and combination analysis more structured, transparent and student-friendly.


# Why ScholarSync

ScholarSync combines several components into one workflow:

**Official Scholarship Data**

↓

**Structured Scholarship Dataset**

↓

**Student Profile**

↓

**Eligibility Engine**

↓

**Explainable Results**

↓

**Automatic Combination Generator**

↓

**Conflict Detection**

↓

**Valid Scholarship Combinations**

↓

**Official Application Information**


This transforms scholarship discovery from a manual search problem into a structured decision-support workflow.


# Project Links

### Live Demo

https://scholarsync-v1-git-main-kaknateganesh24.vercel.app/

### GitHub Repository

https://github.com/kishanpand724/ScholarSyncv1

### Official Scholarship Sources

National Scholarship Portal:

https://scholarships.gov.in/

MahaDBT:

https://mahadbt.maharashtra.gov.in/


# Team

**Team Scholar IQ**

Project: **ScholarSync – Intelligent Scholarship & Combination Engine**

Built as a student-focused solution for simplifying scholarship discovery, eligibility analysis and scholarship combination checking.


# Disclaimer

ScholarSync is an educational and technical project intended to help students organize and analyze scholarship information.

Scholarship eligibility, deadlines, benefits, documentation requirements and application procedures can change.

Students should always verify the latest information on the respective official scholarship portal or official scheme guidelines before submitting an application.

ScholarSync does not replace official scholarship authorities or their final eligibility decisions.


# Final Vision

> **ScholarSync is built around one simple idea:**
>
> **Students should not have to solve the scholarship maze themselves.**
>
> They should be able to enter their profile once, understand which scholarships match them, see why they match, discover valid combinations, and access the relevant official application information — all from one place.

**ScholarSync — From Scholarship Search to Scholarship Strategy.**
