# ScholarSync — Intelligent Scholarship & Combination Engine

> **Built by Team Scholar IQ**

ScholarSync is an intelligent scholarship discovery, eligibility analysis, and automatic scholarship combination platform designed to help students discover scholarship opportunities from multiple official sources and understand which scholarships they can apply for.

Instead of manually searching different scholarship portals and checking complicated eligibility conditions one by one, ScholarSync allows a student to enter their profile once and automatically evaluates available scholarships against that profile.

## Live Demo

**ScholarSync — Intelligent Scholarship & Combination Engine**

https://scholarsync-scholariqv1.ai.studio/

---

# Problem Statement

Students often have to search through multiple scholarship portals to find financial assistance.

The major problems include:

* Scholarship information is distributed across different portals.
* Eligibility criteria are often complicated and scheme-specific.
* Students have to manually compare their profile with every scholarship.
* Missing information can be confused with ineligibility.
* Some scholarships have restrictions on receiving other financial assistance.
* Students may not know why they are rejected by a particular scholarship.
* Finding combinations of scholarships manually is difficult.
* Scholarship information can change between academic years.

ScholarSync addresses these problems through a **data-driven eligibility engine and automatic combination engine**.

---

# Our Solution

ScholarSync follows a simple pipeline:

```text
Student Profile
       ↓
Scholarship Data Collection
       ↓
Data Extraction & Normalization
       ↓
Structured Scholarship JSON
       ↓
Eligibility Engine
       ↓
Eligible / Not Eligible / Info Required
       ↓
Automatic Combination Engine
       ↓
Conflict Detection
       ↓
Valid Scholarship Combinations
       ↓
Student Dashboard
```

The student does not need to manually select scholarships to test combinations.

---

# Core Features

## 1. Single Student Profile

The student enters their information once.

The profile can contain:

* Name
* Date of birth
* Gender
* Domicile state
* Category
* Religion/community where applicable
* Family income
* Disability status
* Parent information
* Hosteller status
* Academic qualifications
* School/college details
* Course
* Branch/specialization
* Current academic year
* Current semester
* Previous academic performance
* CGPA/percentage
* Backlogs/ATKT
* Entrance examination information
* Previous qualification details

The academic fields are designed to adapt according to the student's education level and course.

---

# 2. Multi-Portal Scholarship Data

ScholarSync is designed to work with scholarship information from multiple official portals.

### Current Sources

**National Scholarship Portal (NSP)**

https://scholarships.gov.in/

**MahaDBT — Government of Maharashtra**

https://mahadbt.maharashtra.gov.in/

The system is designed so that additional scholarship sources can be integrated without changing the core matching engine.

---

# 3. Scholarship Fetch Engine

A major part of ScholarSync is the data collection pipeline.

Instead of manually entering every scholarship into the application, the project contains a fetch/data-processing pipeline for collecting scholarship information from official sources.

The basic workflow is:

```text
Official Scholarship Portal
          ↓
       Fetch Engine
          ↓
   Scholarship Pages/PDFs
          ↓
    Data Extraction
          ↓
   Data Normalization
          ↓
 Structured Scholarship JSON
          ↓
 Application Data Layer
```

The purpose of the fetch engine is to keep the application's scholarship dataset maintainable and scalable.

---

# 4. Scholarship Data Extraction

Scholarship information can exist in different formats, including:

* Portal listings
* Scheme pages
* Guidelines
* Government documents
* PDF files
* Structured web information

The extraction pipeline processes this information and converts it into structured scholarship records.

The extracted information can include:

* Scholarship name
* Provider/department
* Academic year
* Scholarship type
* Eligibility criteria
* Minimum percentage
* Income limit
* Category requirements
* Gender requirements
* Domicile requirements
* Course requirements
* Academic requirements
* Benefit amount
* Duration
* Selection process
* Required documents
* Application deadline
* Restrictions
* Official scheme URL
* Official guideline URL
* Official application URL
* Source portal

---

# 5. Structured JSON Scholarship Dataset

After fetching and extracting scholarship information, the data is converted into structured JSON records.

The application can then consume the normalized scholarship dataset instead of repeatedly scraping websites during every student search.

Conceptually:

```json
{
  "id": "scholarship-id",
  "name": "Scholarship Name",
  "provider": "Organization",
  "source": "NSP",
  "academicYear": "2026-27",
  "eligibility": {},
  "benefit": {},
  "documents": [],
  "restrictions": {},
  "officialSchemeUrl": "",
  "officialGuidelineUrl": "",
  "officialApplicationUrl": ""
}
```

This separation makes the scholarship data independent from the frontend.

---

# 6. Data Validation

Scholarship data should not be blindly assumed to be correct.

The extraction pipeline is designed to preserve information from the official source and avoid inventing missing eligibility conditions.

When information is not specified by the source, it should remain:

```text
null
```

or:

```text
Not specified in source
```

rather than being converted into an assumed eligibility rule.

This is particularly important for scheme-specific conditions.

---

# 7. Deterministic Eligibility Engine

The eligibility engine evaluates every scholarship against the student's saved profile.

The matching process is rule-based and deterministic.

It does not depend on an AI response for every individual scholarship evaluation.

The engine evaluates relevant conditions such as:

* Academic percentage
* Previous qualification
* Current academic year
* Current semester
* Course
* Branch
* Category
* Gender
* Family income
* Domicile
* Disability
* Institution requirements
* Entrance examination requirements
* Other scheme-specific conditions

---

# 8. Three-State Eligibility Result

ScholarSync does not treat every missing value as an automatic rejection.

Each scholarship can result in one of three states:

```text
ELIGIBLE
NOT ELIGIBLE
ADDITIONAL INFORMATION REQUIRED
```

### Eligible

All required conditions are satisfied.

### Not Eligible

A required condition is explicitly violated.

### Additional Information Required

The available profile does not contain enough information to determine eligibility.

Example:

```text
Required: Previous semester percentage
Student value: Not provided

Result:
Additional Information Required
```

This prevents incomplete student profiles from producing misleading rejection results.

---

# 9. Explainable Eligibility

ScholarSync provides understandable reasons behind eligibility decisions.

Example:

```text
Eligible

✓ Family income is within the permitted limit
✓ Academic requirement satisfied
✓ Course requirement satisfied
✓ Domicile requirement satisfied
```

For an ineligible scholarship:

```text
Not Eligible

✗ Required percentage: 80%
✗ Student percentage: 72%
```

The purpose is to make the matching process transparent rather than showing only a final status.

---

# 10. Automatic Combination Engine

One of the main innovations of ScholarSync is the automatic scholarship combination engine.

The student does **not** manually choose scholarships and test whether they can be combined.

The system automatically works from the scholarships for which the student is eligible.

```text
Eligible Scholarships
        ↓
Generate Possible Combinations
        ↓
Check Combination Rules
        ↓
Detect Conflicts
        ↓
Remove Invalid Combinations
        ↓
Return Valid Combinations
```

The combination engine can evaluate pairs and larger subsets of eligible scholarships according to the project's supported combination rules.

---

# 11. Conflict Detection

Two individually eligible scholarships are not necessarily valid together.

ScholarSync therefore evaluates combinations using conflict rules.

Examples of conflict categories include:

### Exclusive Scholarship

A scholarship may prohibit receiving another scholarship or financial assistance.

### Provider Conflict

Two schemes may have restrictions on receiving concurrent assistance from the same type of government/provider source.

### Fee Duplication

Two scholarships may attempt to cover the same tuition/fee component.

### Sponsorship Conflict

Certain external/CSR scholarships may restrict simultaneous sponsorship from another organization.

The combination engine filters such invalid combinations.

---

# 12. Combination Ranking

After invalid combinations are removed, valid combinations can be compared based on their potential scholarship benefit.

Example:

```text
Combination A
Scholarship 1 + Scholarship 2
Potential Benefit: ₹80,000/year

Combination B
Scholarship 1 + Scholarship 3
Potential Benefit: ₹1,00,000/year
```

The system can also provide:

* Compatibility information
* Combined benefits
* Scholarship details
* Required documents
* Official source links

---

# 13. Backend Architecture

ScholarSync uses a full-stack architecture rather than relying only on frontend logic.

```text
React Frontend
      ↓
REST API
      ↓
Express Server
      ↓
Scholarship Service
      ↓
Eligibility Engine
      ↓
Combination Engine
      ↓
Structured Scholarship Data
```

The repository contains a dedicated backend/service layer through `server.ts`.

---

# 14. Backend API

The project exposes API endpoints for scholarship operations and analysis.

| Method | Endpoint                | Purpose                               |
| ------ | ----------------------- | ------------------------------------- |
| GET    | `/api/health`           | Check backend/service status          |
| GET    | `/api/scholarships`     | Retrieve scholarship records          |
| GET    | `/api/scholarships/:id` | Retrieve a specific scholarship       |
| POST   | `/api/match`            | Run eligibility matching              |
| POST   | `/api/combinations`     | Generate valid combinations           |
| POST   | `/api/analyze`          | Run matching and combination analysis |

These endpoints are documented in the project's current repository.

---

# 15. Main Project Components

The repository is organized around separate responsibilities.

```text
ScholarSyncv1/
│
├── data/
│   └── Scholarship datasets
│
├── scripts/
│   └── Data fetching / processing utilities
│
├── src/
│   ├── components/
│   ├── services/
│   ├── data/
│   └── types/
│
├── server.ts
├── package.json
├── vite.config.ts
└── README.md
```

The repository currently contains dedicated `data`, `scripts`, and `src` directories along with the backend server and project configuration.

---

# 16. Core Services

### Eligibility Engine

```text
src/services/eligibilityEngine.ts
```

Responsible for deterministic scholarship eligibility evaluation.

### Combination Engine

```text
src/services/combinationEngine.ts
```

Responsible for generating scholarship combinations and checking conflicts.

### Scholarship Service

```text
src/services/scholarshipService.ts
```

Responsible for retrieving and working with structured scholarship data.

These services are separated so that data collection, eligibility matching, and combination analysis remain independently maintainable.

---

# 17. Data Pipeline

The overall data pipeline can be represented as:

```text
              OFFICIAL SOURCES
                     │
          ┌──────────┴──────────┐
          │                     │
         NSP                MahaDBT
          │                     │
          └──────────┬──────────┘
                     ↓
              Fetch Engine
                     ↓
           Page / PDF Retrieval
                     ↓
            Content Extraction
                     ↓
          Structured Data Parsing
                     ↓
             Data Validation
                     ↓
              Normalization
                     ↓
              Scholarship JSON
                     ↓
          Scholarship Service
                     ↓
            Eligibility Engine
                     ↓
          Combination Engine
                     ↓
             Student Results
```

---

# 18. Why JSON-Based Scholarship Data?

Using structured JSON provides several advantages:

* Easy local development
* Fast scholarship lookup
* Separation between data and UI
* Easy testing of eligibility rules
* Easy replacement of outdated records
* Easier integration of new portals
* Reusable data for backend APIs
* No need to scrape the source portal for every student request

The repository currently uses a structured local scholarship data layer, while its architecture also supports future automated extraction.

---

# 19. Future Automated Data Pipeline

The architecture also supports a more automated pipeline:

```text
Official NSP / Government Portal
             ↓
        Fetch Engine
             ↓
       PDF Downloader
             ↓
       Text / OCR Extraction
             ↓
      Structured Extraction
             ↓
       Scholarship JSON
             ↓
       Data Validation
             ↓
      Scholarship Service
             ↓
      Eligibility Engine
             ↓
     Combination Engine
```

This allows the scholarship dataset to be updated without rewriting the frontend or matching system.

---

# 20. Technology Stack

### Frontend

* React 19
* TypeScript
* Vite
* Tailwind CSS
* Lucide React
* Motion

### Backend

* Node.js
* Express.js
* TypeScript
* TSX

### Data

* Structured JSON scholarship dataset
* Official portal data
* Extracted scholarship information

### AI / Data Processing

The project architecture includes support for structured extraction workflows where required, while the actual eligibility decision remains deterministic and rule-based.

The current repository includes the Google Generative AI SDK as a project dependency.

---

# 21. Installation

Clone the repository:

```bash
git clone https://github.com/kishanpand724/ScholarSyncv1.git
cd ScholarSyncv1
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The project's development script starts the full-stack server through `server.ts`.

---

# 22. Production Build

Build the frontend:

```bash
npm run build
```

Start the application:

```bash
npm start
```

Type checking:

```bash
npm run lint
```

These commands correspond to the current project configuration.

---

# 23. Project Design Philosophy

ScholarSync follows four major principles:

### Data Driven

Scholarship rules should come from structured scholarship data rather than being hardcoded throughout the frontend.

### Deterministic

Given the same student profile and scholarship dataset, the eligibility engine should produce the same result.

### Explainable

Students should understand why a scholarship is eligible or ineligible.

### Extensible

New scholarship portals and datasets should be addable without rewriting the entire application.

---

# 24. Future Scope

ScholarSync can be extended with:

* More state scholarship portals
* More central government schemes
* Automated scholarship updates
* Scheduled data fetching
* Advanced PDF extraction
* OCR for scanned guidelines
* Improved rule extraction
* Deadline notifications
* Document checklist generation
* Application tracking
* Student notification system
* Scholarship change detection
* Database-backed production deployment

---

# 25. Project Vision

ScholarSync aims to transform scholarship discovery from a manual search process into an intelligent and explainable system.

Instead of asking students to:

```text
Search → Read → Compare → Check Eligibility → Check Conflicts
```

ScholarSync aims to provide:

```text
Enter Profile
      ↓
Automatic Matching
      ↓
Understand Eligibility
      ↓
Automatic Combination Analysis
      ↓
Discover Valid Scholarship Options
```

---

# 26. Team

## Team Scholar IQ

**Project:** ScholarSync — Intelligent Scholarship & Combination Engine

**Live Demo:**
https://scholarsync-scholariqv1.ai.studio/

**Repository:**
https://github.com/kishanpand724/ScholarSyncv1

---

# Disclaimer

ScholarSync is an educational and informational platform intended to assist students in discovering scholarship opportunities.

Scholarship eligibility, benefits, deadlines, and application requirements can change. Students should verify the latest information and final eligibility requirements on the respective official scholarship portal before applying.
