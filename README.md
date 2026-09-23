# 🎓 ScholarSync — Intelligent Scholarship Discovery & Combination Engine

> **One Profile. Every Eligible Scholarship. Smarter Combinations.**

ScholarSync is an intelligent scholarship discovery and combination engine designed to simplify the scholarship journey for students.

Instead of manually searching multiple scholarship portals, checking complicated eligibility criteria, tracking different deadlines, collecting documents, and testing whether scholarships can be combined, ScholarSync allows students to enter their profile once and automatically analyzes available scholarship opportunities.

---

## 🌐 Live Demo

🔗 https://scholarsync-v1-git-main-kaknateganesh24.vercel.app/

## 💻 GitHub Repository

🔗 https://github.com/kishanpand724/ScholarSyncv1

---

# 🚨 The Problem

Finding a scholarship is not the only challenge.

Students often have to answer many questions before applying:

- Which scholarships am I eligible for?
- Why am I eligible or not eligible?
- Does my family income satisfy the requirement?
- Does my category, gender, course or domicile match?
- What academic criteria are required?
- What documents are required?
- What is the actual application deadline?
- Where should I apply?
- Can I receive multiple scholarships together?
- Which scholarship combinations are actually valid?

Scholarship information is distributed across different portals, scheme pages and guideline documents.

As a result, students have to spend significant time manually searching, comparing and validating scholarship information.

---

# 💡 Our Solution

ScholarSync converts this complicated process into a single profile-driven workflow.

**Student Profile → Scholarship Dataset → Eligibility Analysis → Combination Analysis → Conflict Detection → Valid Scholarship Options**

The student enters their information once, and ScholarSync performs the scholarship analysis automatically.

---

# 🚀 What Makes ScholarSync Different?

Most scholarship platforms primarily focus on scholarship discovery.

ScholarSync goes beyond discovery by combining:

- Profile-based eligibility analysis
- Explainable eligibility results
- Missing-information detection
- Scholarship details
- Scholarship-specific deadlines
- Required documents
- Official application information
- Automatic combination generation
- Conflict detection
- Potential combined benefit calculation

### Traditional Approach

Search → Read Eligibility → Compare → Check Restrictions → Apply

### ScholarSync Approach

Create Profile  
↓  
Automatically Analyze Scholarships  
↓  
Understand Eligibility  
↓  
Identify Missing Information  
↓  
Generate Possible Combinations  
↓  
Check Conflicts  
↓  
Calculate Potential Benefits  
↓  
View Documents & Deadlines  
↓  
Apply Through Official Sources

---

# ✨ Key Features

## 👤 1. Single Student Profile

Students provide their information once instead of repeatedly entering the same information for different scholarships.

The profile can contain:

- Personal information
- Category
- Gender
- Family income
- Domicile
- Academic qualification
- Board
- Percentage / CGPA
- Passing year
- Course
- Branch / specialization
- Current year
- Current semester
- Previous academic performance
- Backlogs / ATKT
- Entrance examination information where applicable

The same profile is used throughout the scholarship matching process.

---

# 🎓 2. Dynamic Academic Profile

Different education levels require different academic information.

ScholarSync is designed to support academic structures for:

- Class 10
- Class 11
- Class 12
- Diploma
- B.Tech / B.E.
- BCA
- B.Sc.
- B.A.
- B.Com.
- Other undergraduate programs

For engineering students, academic information is mapped according to the current year and semester.

This avoids forcing students to enter irrelevant academic details.

---

# 🔎 3. Scholarship Discovery

ScholarSync maintains structured scholarship information including:

- Scholarship name
- Provider
- Education level
- Course
- Branch
- Category
- Gender
- Income criteria
- Academic criteria
- Domicile
- Benefit amount
- Duration
- Application deadline
- Required documents
- Restrictions
- Official source
- Application information

---

# 🌐 4. Official Scholarship Data

ScholarSync is designed around information collected from official scholarship sources.

Important sources include:

- National Scholarship Portal (NSP)
- MahaDBT
- AICTE
- Official scholarship scheme guidelines

### Data Pipeline

Official Scholarship Portal  
↓  
Scholarship Listing  
↓  
Official Scheme / Guidelines  
↓  
Data Extraction  
↓  
Data Normalization  
↓  
Validation  
↓  
Structured Scholarship Dataset  
↓  
ScholarSync Engine

This separation allows scholarship data to be updated without rewriting the core eligibility and combination logic.

---

# 📊 5. Scholarship Data Extraction

Scholarship information can be distributed across portal pages and PDF guideline documents.

The data pipeline is designed to extract meaningful information such as:

- Eligibility criteria
- Academic requirements
- Income requirements
- Category
- Gender
- Course
- Year of study
- Benefit
- Duration
- Application deadline
- Required documents
- Restrictions
- Application information
- Official source

If a particular field is not specified by the official source, the system should avoid inventing the information.

---

# 🔐 6. Scheme Identity Validation

Official portals can contain multiple scholarship schemes and guideline documents.

ScholarSync treats scheme identity as an important part of data quality.

If the scholarship listing and guideline document do not refer to the same scheme, the information should not be silently merged.

Such records can be flagged for review instead.

This helps prevent incorrect eligibility, benefit or deadline information from entering the matching system.

---

# 📅 7. Real Scholarship Deadlines

Different scholarships can have different application deadlines.

ScholarSync stores deadlines at the individual scholarship level rather than applying one common deadline to every scholarship.

Where available, the system can distinguish between:

- Student application deadline
- Fresh application deadline
- Renewal deadline
- Defective application deadline
- Institute verification deadline
- Nodal verification deadline

If an official source does not specify a deadline, the system should display:

**Deadline not specified**

instead of inventing a date.

This prevents different scholarships from incorrectly appearing with the same deadline.

---

# 🧠 8. Eligibility Engine

The Eligibility Engine evaluates scholarship requirements against the student's actual profile.

It can evaluate criteria such as:

- Family income
- Category
- Gender
- Domicile
- Academic percentage
- CGPA
- Qualifying examination
- Entrance examination
- Course
- Branch
- Education level
- Current year
- Current semester
- Previous academic result
- Backlogs / ATKT
- Other scholarship restrictions

The engine is designed to be deterministic and data-driven.

---

# ✅ 9. Three-State Eligibility

ScholarSync does not treat missing information as automatic rejection.

A scholarship can return one of three states:

| Result | Meaning |
|---|---|
| ✅ Eligible | Known requirements are satisfied |
| ❌ Not Eligible | A known requirement is not satisfied |
| ℹ️ Additional Information Required | Required information is missing |

For example:

**Income Requirement**

Student Income: ₹2,50,000  
Required Income: ≤ ₹4,50,000

Result: **Eligible**

Another example:

Student Income: ₹8,50,000  
Required Income: ≤ ₹4,50,000

Result: **Not Eligible**

If a required piece of information has not been provided:

Result: **Additional Information Required**

This prevents missing information from being incorrectly treated as failure.

---

# 🔍 10. Explainable Eligibility

ScholarSync does not only return an eligibility result.

It can explain the conditions behind the result.

Example:

**Family Income**

Student: ₹2,50,000  
Required: ≤ ₹4,50,000  
Status: Passed

Example:

**Academic Percentage**

Student: 62%  
Required: ≥ 70%  
Status: Failed

This makes the scholarship matching process transparent and easier for students to understand.

---

# 📄 11. Scholarship Details

Scholarship details can include:

- Scholarship name
- Provider
- Description
- Eligibility
- Academic requirements
- Income criteria
- Category
- Gender
- Course requirements
- Benefit amount
- Duration
- Required documents
- Application deadline
- Official source
- Official guidelines
- Application portal
- Apply Now information
- Important restrictions

---

# 🔗 12. Official Apply Now Information

ScholarSync is designed to direct students toward official application sources.

Important application fields include:

- Official scheme URL
- Official guideline URL
- Official application URL
- Application portal
- Application URL verification status

The system should never invent an application URL.

If an exact scheme-specific application page is unavailable, the student should be directed to the verified official portal.

---

# 🤖 13. Automatic Combination Engine

This is one of the core features of ScholarSync.

Suppose a student is eligible for:

- Scholarship A
- Scholarship B
- Scholarship C
- Scholarship D

The student does not need to manually select scholarships.

ScholarSync automatically generates possible combinations such as:

- A + B
- A + C
- A + D
- B + C
- B + D
- C + D
- A + B + C
- A + B + D
- And other valid subsets

Each combination is then evaluated by the conflict-checking layer.

---

# ⚔️ 14. Conflict Detection

Being individually eligible for two scholarships does not necessarily mean that both scholarships can be received together.

ScholarSync checks stored restrictions before considering a combination valid.

Possible conflict types include:

### Financial Assistance Restrictions

A scholarship may restrict receiving financial assistance from another source.

### Exclusivity Rules

A scheme may require the student to receive it exclusively.

### Duplicate Benefits

Two scholarships may provide overlapping financial benefits.

### Provider Restrictions

Certain scholarship providers may have restrictions regarding other scholarships or financial assistance.

Therefore:

**Eligible A + Eligible B**

does not automatically mean:

**Valid A + B**

Instead, ScholarSync performs:

Eligible Scholarships  
↓  
Combination Generation  
↓  
Conflict Checking  
↓  
Valid Combinations

---

# 💰 15. Potential Benefit Calculation

For valid combinations, ScholarSync can calculate the potential combined benefit based on the structured scholarship information.

Example:

Scholarship A: ₹50,000/year  
Scholarship C: ₹30,000/year  
Scholarship D: ₹20,000/year

Potential Combined Benefit: **₹1,00,000/year**

This allows students to understand the financial potential of valid combinations without manually calculating every scholarship amount.

The final awarded amount remains subject to the respective scholarship provider's official rules and approval.

---

# 📋 16. Combined Document Requirements

Different scholarships may require overlapping documents.

ScholarSync can combine document requirements for a valid scholarship combination and avoid unnecessary duplication.

Example:

Scholarship A:

- Aadhaar
- Income Certificate
- Marksheet

Scholarship B:

- Aadhaar
- Income Certificate
- Bank Details

Combined Checklist:

- Aadhaar
- Income Certificate
- Marksheet
- Bank Details

This helps students prepare their documents more efficiently.

---

# 📊 17. Student Dashboard

The dashboard is designed around the student's actual scholarship status.

After completing the profile, the student can access information such as:

- Profile status
- Eligible scholarships
- Scholarships requiring additional information
- Potential scholarship benefits
- Upcoming deadlines
- Scholarship details
- Valid combinations
- Application information

The objective is to keep the student focused on actionable scholarship information.

---

# 🔄 18. End-to-End Workflow

A complete ScholarSync workflow looks like:

**Step 1 — Create Profile**

The student enters academic, financial and personal information.

**Step 2 — Analyze Profile**

The system processes the profile against the scholarship dataset.

**Step 3 — Evaluate Eligibility**

Each scholarship is evaluated using its stored eligibility rules.

**Step 4 — Explain Results**

The system identifies eligible scholarships, failed conditions and missing information.

**Step 5 — Generate Combinations**

Eligible scholarships are automatically combined into possible subsets.

**Step 6 — Check Conflicts**

Each combination is checked against scholarship restrictions.

**Step 7 — Calculate Benefits**

Potential combined benefits are calculated for valid combinations.

**Step 8 — Prepare Application Information**

The student can view documents, deadlines and official application sources.

---

# 🏗️ System Architecture

```text
                    Student Profile
                           |
                           v
                 Scholarship Dataset
                           |
                           v
                 Eligibility Engine
                           |
              +------------+------------+
              |                         |
              v                         v
          Eligible              Not Eligible /
       Scholarships             Info Required
              |
              v
       Combination Generator
              |
              v
        Conflict Checker
              |
              v
       Valid Combinations
              |
              v
   Benefits / Documents /
   Deadlines / Apply Links



🔄 Data Architecture

ScholarSync separates data collection from scholarship matching.

Official Sources
      ↓
Data Fetching
      ↓
Data Extraction
      ↓
Data Normalization
      ↓
Source Validation
      ↓
Structured Dataset
      ↓
Eligibility Engine
      ↓
Combination Engine
      ↓
Student Results


This makes the system easier to maintain and extend.

🧩 Data-Driven Design

A major design decision in ScholarSync is keeping scholarship rules data-driven.

Instead of writing separate hardcoded conditions for every scholarship, scholarship requirements are represented as structured data and processed through reusable services.

This makes it easier to:

Add new scholarships
Update scholarship rules
Support multiple portals
Maintain different eligibility criteria
Add new conflict rules
Scale the scholarship dataset
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
Data & Logic
Structured scholarship dataset
Official scholarship information
Scheme guideline documents
Deterministic eligibility rules
Automatic combination generation
Conflict detection
Benefit calculation
Document processing
📡 API Layer

ScholarSync includes a backend service layer for scholarship operations.

| Endpoint                    | Purpose                               |
| --------------------------- | ------------------------------------- |
| `GET /api/health`           | Service health check                  |
| `GET /api/scholarships`     | Retrieve scholarship records          |
| `GET /api/scholarships/:id` | Retrieve scholarship details          |
| `POST /api/match`           | Evaluate student eligibility          |
| `POST /api/combinations`    | Generate and validate combinations    |
| `POST /api/analyze`         | Run the scholarship analysis workflow |



📁 Project Structure
ScholarSyncv1/
│
├── data/
│   └── Scholarship datasets
│
├── scripts/
│   └── Data fetching and processing utilities
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


▶️ Running the Project Locally
1. Clone the Repository
git clone https://github.com/kishanpand724/ScholarSyncv1.git
cd ScholarSyncv1
2. Install Dependencies
npm install
3. Start Development Server
npm run dev
4. Build the Project
npm run build
🧪 Example

Consider a student with:

Course: B.Tech CSE
Current Year: 2nd Year
Category: EWS
Family Income: ₹3,00,000
Academic Score: 82%
Domicile: Maharashtra

ScholarSync processes the profile.

Eligibility Analysis

Scholarship A → Eligible
Scholarship B → Eligible
Scholarship C → Not Eligible
Scholarship D → Additional Information Required

Combination Analysis

The system automatically generates:

A + B

The combination is then checked against the stored restrictions.

Final Result

If no conflict is detected:

A + B → Valid Combination

The student can then view:

Individual scholarship benefits
Combined potential benefit
Documents
Deadlines
Official application information
🌟 Why ScholarSync Matters

Scholarship discovery is usually treated as a search problem.

ScholarSync treats it as a decision-support problem.

Instead of asking students to manually answer:

What scholarships exist?

Which ones am I eligible for?

Why am I eligible?

What information is missing?

What documents do I need?

When should I apply?

Where should I apply?

Can I combine multiple scholarships?

ScholarSync brings these questions into one workflow.

🏆 Hackathon Impact

ScholarSync focuses on three major problems:

1. Fragmentation

Scholarship information is spread across multiple portals and documents.

2. Eligibility Complexity

Every scholarship can have different academic, financial, demographic and course requirements.

3. Combination Uncertainty

Being eligible for two scholarships individually does not necessarily mean they can be received together.

ScholarSync brings these challenges into a unified system.

🔮 Future Scope

The architecture can be extended with:

More government scholarship portals
More state-specific scholarship sources
Automated periodic data updates
Advanced PDF extraction
OCR for scanned guidelines
Automated deadline monitoring
Deadline reminders and notifications
Multilingual support
Mobile application
Expanded conflict policies
Automated source verification
Larger national scholarship database
Personalized scholarship notifications
⚠️ Disclaimer

ScholarSync is a scholarship discovery and decision-support system.

Eligibility and combination results are generated from the scholarship information and rules available in the system.

Final eligibility, selection, award amount, approval and application status are determined by the respective scholarship provider.

Students should verify important information from the official scholarship portal or official scheme guidelines before applying.

👨‍💻 Team Scholar IQ

ScholarSync — Intelligent Scholarship Discovery & Combination Engine

Our Vision

Students should not have to become scholarship experts just to find financial support.

ScholarSync turns a student's profile into understandable scholarship matches and automatically checks possible combinations.

🔗 Important Links
Live Demo

https://scholarsync-v1-git-main-kaknateganesh24.vercel.app/

GitHub Repository

https://github.com/kishanpand724/ScholarSyncv1

National Scholarship Portal

https://scholarships.gov.in/

MahaDBT

https://mahadbt.maharashtra.gov.in/

⭐ ScholarSync

One Profile. Every Eligible Scholarship. Smarter Combinations.
