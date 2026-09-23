ScholarSync — Intelligent Scholarship & Combination Engine

One Profile. Every Eligible Scholarship. Smarter Combinations.

ScholarSync is an intelligent scholarship discovery and combination engine that helps students discover scholarships, understand their eligibility, track deadlines and documents, and automatically identify valid scholarship combinations from a single student profile.

Instead of forcing students to search through multiple portals and manually compare complicated eligibility and scholarship rules, ScholarSync turns the process into a profile-driven, explainable and automated workflow.

🔗 Live Demo

https://scholarsync-v1-git-main-kaknateganesh24.vercel.app/

💻 GitHub

https://github.com/kishanpand724/ScholarSyncv1

🎯 The Problem

Finding a scholarship is easy.

Finding the right combination of scholarships is not.

Students often have to:

Search multiple scholarship portals
Read lengthy eligibility conditions
Compare income and academic requirements
Check category, gender, domicile and course restrictions
Track different deadlines
Find required documents
Visit different application portals
Determine whether multiple scholarships can be received together

This becomes especially difficult when two scholarships are individually eligible but cannot be combined due to their respective rules.

The result is a fragmented and confusing process.

💡 Our Solution

ScholarSync converts this entire process into a single workflow:

Student Profile
      ↓
Scholarship Dataset
      ↓
Eligibility Analysis
      ↓
Explainable Results
      ↓
Automatic Combination Generation
      ↓
Conflict Detection
      ↓
Valid Scholarship Combinations
      ↓
Benefits + Documents + Deadlines + Apply

The student enters their profile once.

ScholarSync does the rest.

🚀 What Makes ScholarSync Different?

Most scholarship platforms primarily help students find scholarships.

ScholarSync goes one step further.

Traditional Approach
Search Scholarship
       ↓
Read Eligibility
       ↓
Apply
ScholarSync Approach
Create Profile
      ↓
Automatically Evaluate Scholarships
      ↓
Understand Why You Are / Aren't Eligible
      ↓
Identify Missing Information
      ↓
Generate Possible Combinations
      ↓
Check Conflicts & Restrictions
      ↓
Calculate Potential Combined Benefits
      ↓
Prepare Documents & Application Links

The key innovation is the automatic combination engine.

Students do not have to manually test:

A + B
A + C
A + D
B + C
...

ScholarSync generates and evaluates these combinations automatically.

🧠 Core Intelligence

ScholarSync is built around three major engines.

1. Eligibility Engine

Evaluates each scholarship against the student's actual profile.

It can consider:

Family income
Category
Gender
Domicile
Academic percentage
CGPA
Qualifying examination
Entrance examination
Course
Branch
Current year
Current semester
Previous academic performance
Backlogs / ATKT
Other scholarship restrictions
Three possible outcomes
Result	Meaning
✅ Eligible	Known requirements are satisfied
❌ Not Eligible	A known requirement is not satisfied
ℹ️ Additional Information Required	Required information is missing

This distinction is important because:

Missing information should not automatically mean rejection.

🔍 Explainable Eligibility

ScholarSync doesn't simply say:

"You are not eligible."

It can show which condition caused the result.

Example:

Family Income

Student: ₹2,50,000
Required: ≤ ₹4,50,000

✓ Passed

or:

Academic Percentage

Student: 62%
Required: ≥ 70%

✗ Failed

This makes the matching process transparent and understandable.

🔗 Automatic Combination Engine

This is one of ScholarSync's core features.

Suppose the student is eligible for:

Scholarship A
Scholarship B
Scholarship C
Scholarship D

Instead of asking the student to manually select scholarships, the system automatically generates possible combinations:

A + B
A + C
A + D
B + C
B + D
C + D
A + B + C
A + B + D
...

Each combination is then passed through the conflict-checking layer.

⚔️ Conflict Detection

Being individually eligible for two scholarships does not necessarily mean they can be received together.

ScholarSync checks stored scholarship restrictions before considering a combination valid.

Examples include:

Financial Assistance Restrictions

A scholarship may restrict receiving financial assistance from another source.

Exclusivity Rules

A scheme may require the student to choose it exclusively.

Duplicate Benefits

Two scholarships may attempt to cover the same type of financial benefit.

Provider Restrictions

Some schemes may have restrictions involving other government, institutional or private scholarships.

Therefore:

Eligible A
+
Eligible B

does not automatically become:

Valid A + B

Instead:

Eligible Scholarships
        ↓
Combination Generator
        ↓
Conflict Checker
        ↓
Valid Combinations
💰 Potential Benefit Analysis

For valid combinations, ScholarSync can calculate the combined potential benefit from the structured scholarship data.

Example:

Scholarship A     ₹50,000/year
Scholarship C     ₹30,000/year
Scholarship D     ₹20,000/year
--------------------------------
Potential Benefit ₹1,00,000/year

This allows students to understand the financial potential of a combination without manually calculating every scholarship amount.

The final awarded amount remains subject to the respective scholarship provider's official rules and approval.

📄 One Profile → Multiple Scholarship Decisions

The student profile acts as the single source of input.

                    Student Profile
                          │
          ┌───────────────┼───────────────┐
          ↓               ↓               ↓
      Academic         Financial       Personal
      Details           Details        Details
          │               │               │
          └───────────────┼───────────────┘
                          ↓
                  Eligibility Engine
                          ↓
             ┌────────────┼────────────┐
             ↓            ↓            ↓
          Eligible     Ineligible    Info Needed
             │
             ↓
      Combination Engine
             │
             ↓
      Conflict Detection
             │
             ↓
       Valid Combinations

This avoids repeatedly entering the same information for different scholarships.

🌐 Official Scholarship Data

ScholarSync is designed around structured information collected from official scholarship sources.

The project currently focuses on sources such as:

National Scholarship Portal (NSP)
MahaDBT
AICTE / official scheme guidelines
Data Pipeline
Official Portal
      ↓
Scholarship Listing
      ↓
Official Scheme / Guidelines
      ↓
Extraction
      ↓
Normalization
      ↓
Validation
      ↓
Structured Scholarship Dataset
      ↓
ScholarSync Engine

This separates data collection from eligibility and combination logic.

📅 Real Scholarship Deadlines

Scholarship deadlines are maintained per scholarship.

ScholarSync does not assume that every scholarship has the same deadline.

Where available, the system can distinguish between:

Student application deadline
Fresh application deadline
Renewal deadline
Defective application deadline
Institute verification deadline
Nodal verification deadline

If the official source does not provide a deadline, the system should not invent one.

Official Deadline
       ↓
Scholarship Record
       ↓
Student Dashboard

This prevents a common problem where different scholarships are incorrectly displayed with the same deadline.

📋 Documents & Application Information

For every scholarship, ScholarSync can expose information such as:

Required documents
Benefit amount
Eligibility conditions
Deadline
Official scheme page
Official guideline
Application portal
Apply Now link
Important restrictions

The goal is to take the student from:

"I found a scholarship."

to:

"I know why I qualify, what I need, when to apply and where to apply."

🧩 Data-Driven Architecture

A major design decision in ScholarSync is keeping scholarship rules data-driven.

Instead of writing separate frontend logic such as:

if scholarshipA...
if scholarshipB...
if scholarshipC...

scholarship requirements are represented as structured data and evaluated by reusable services.

This makes the system easier to:

Add new scholarships
Update existing rules
Support multiple portals
Maintain different eligibility criteria
Extend combination rules
🏗️ System Architecture
┌───────────────────────────┐
│      Student Profile      │
└─────────────┬─────────────┘
              ↓
┌───────────────────────────┐
│   Scholarship Data Layer  │
│      NSP / MahaDBT        │
└─────────────┬─────────────┘
              ↓
┌───────────────────────────┐
│    Eligibility Engine     │
└─────────────┬─────────────┘
              ↓
     ┌────────┴────────┐
     ↓                 ↓
 Eligible          Not Eligible /
 Scholarships      Info Required
     │
     ↓
┌───────────────────────────┐
│  Combination Generator    │
└─────────────┬─────────────┘
              ↓
┌───────────────────────────┐
│    Conflict Checker       │
└─────────────┬─────────────┘
              ↓
┌───────────────────────────┐
│   Valid Combinations      │
└─────────────┬─────────────┘
              ↓
┌───────────────────────────┐
│ Benefits / Docs /         │
│ Deadlines / Apply Links   │
└───────────────────────────┘
🛠️ Technology Stack
Frontend
React 19
TypeScript
Vite
Tailwind CSS
Lucide React
Motion
Backend
Node.js
Express.js
TypeScript
TSX
Core Services
eligibilityEngine.ts
combinationEngine.ts
scholarshipService.ts
Data
Structured scholarship dataset
Official scholarship information
Scheme guidelines
Eligibility rules
Combination restrictions
📡 API Layer

ScholarSync includes a backend service layer for the core scholarship operations.

Endpoint	Purpose
GET /api/health	Backend/service health
GET /api/scholarships	Retrieve scholarships
GET /api/scholarships/:id	Scholarship details
POST /api/match	Evaluate student eligibility
POST /api/combinations	Generate/check combinations
POST /api/analyze	Run analysis workflow

This allows the frontend to remain separate from the core scholarship processing logic.

📁 Project Structure
ScholarSyncv1/
│
├── data/
│   └── Scholarship datasets
│
├── scripts/
│   └── Data fetching / processing
│
├── src/
│   ├── components/
│   ├── services/
│   │   ├── eligibilityEngine.ts
│   │   ├── combinationEngine.ts
│   │   └── scholarshipService.ts
│   ├── types/
│   └── application source
│
├── server.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
⚙️ Running Locally
Clone
git clone https://github.com/kishanpand724/ScholarSyncv1.git
cd ScholarSyncv1
Install
npm install
Run
npm run dev
Build
npm run build
🔄 End-to-End Example

Imagine a student enters:

Course: B.Tech CSE
Year: 2nd
Category: EWS
Family Income: ₹3,00,000
Academic Score: 82%
Domicile: Maharashtra

ScholarSync processes the profile against the scholarship dataset.

Step 1 — Eligibility
Scholarship A → Eligible
Scholarship B → Eligible
Scholarship C → Not Eligible
Scholarship D → Additional Information Required
Step 2 — Combination Generation
A + B
Step 3 — Conflict Check
A + B
↓
No detected conflict
↓
Valid Combination
Step 4 — Student View

The student can then see:

Scholarship A
Benefit
Deadline
Documents
Apply

Scholarship B
Benefit
Deadline
Documents
Apply

────────────────────

Valid Combination

A + B

Potential Combined Benefit
₹XX,XXX / year

The important part is that the student did not have to manually discover and test every combination.

🌟 Why This Matters

Scholarship discovery is often treated as a search problem.

ScholarSync treats it as a decision-support problem.

The system answers multiple questions together:

What scholarships exist?
          ↓
Which ones match me?
          ↓
Why do they match?
          ↓
What information is missing?
          ↓
What documents do I need?
          ↓
When do I need to apply?
          ↓
Where do I apply?
          ↓
Which eligible scholarships can work together?

That is the core idea behind ScholarSync.

🔮 Future Scope

The architecture allows ScholarSync to grow into a larger scholarship intelligence platform.

Potential extensions include:

More state scholarship portals
Automated periodic data updates
Advanced PDF extraction
OCR for scanned documents
Deadline reminders
Multilingual support
Mobile application
More detailed conflict policies
Automated source verification
Personalized scholarship notifications
Expanded national scholarship coverage
⚠️ Disclaimer

ScholarSync is a scholarship discovery and decision-support system.

Eligibility and combination results are generated from the scholarship information and rules available in the system.

Final eligibility, selection, award amount, approval and application status are determined by the respective scholarship provider.

Students should verify important information from the official scholarship portal or guideline before applying.

👨‍💻 Team Scholar IQ

ScholarSync — Intelligent Scholarship & Combination Engine

Our Vision

Make scholarship discovery as simple as entering your profile once — and let the system handle the complexity.

🔗 Project Links

Live Demo:
https://scholarsync-v1-git-main-kaknateganesh24.vercel.app/
