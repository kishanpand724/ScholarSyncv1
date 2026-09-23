# ScholarSync — Intelligent Scholarship Discovery & Combination Engine
### Built with pride by **Team Scholar IQ** for College Hackathon

ScholarSync is an intelligent, explainable scholarship discovery and automatic combination engine for Indian students. It solves the fragmentation and confusing stacking regulations across national schemes (NSP), state portals, AICTE/UGC programs, and private CSR foundations.

---

## 🚀 Key Features

1. **Single Student Entry**: Enter academic performance, category, family income, domicile, and quota conditions once.
2. **Deterministic Rule-Based Eligibility Engine**: Evaluates every scholarship across 8 strict criteria gates without hallucinations.
3. **Deep Explainability**:
   - For eligible schemes: Shows positive audit checks with exact student values vs scheme requirements.
   - For ineligible schemes: Generates clear, unambiguous rejection reasons (e.g. *"Family income of ₹8,50,000 exceeds permitted limit of ₹4,50,000"*, *"Scholarship restricted to SC category"*).
4. **Zero-Manual Automatic Combination Engine**: The student never selects combinations manually. The system automatically computes power sets of all eligible scholarships and tests every pair and triplet.
5. **Data-Driven Conflict Detection**:
   - **Standalone Exclusivity**: Catches schemes that prohibit holding ANY other grant (e.g., Prime Minister Research Fellowship).
   - **Provider Level Conflicts**: Enforces NSP regulations prohibiting two concurrent Central Government / Ministry schemes.
   - **Fee Duplication Conflicts**: Eliminates combinations where two scholarships claim 100% tuition fees.
   - **Corporate CSR Exclusivity**: Enforces foundation guidelines prohibiting dual corporate sponsorships.
6. **Optimized Ranking & Stacking**: Displays valid combinations ranked by total potential benefit (`₹1,00,000/yr`), with compatibility badges, merged deduplicated document checklists, and official source links.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Plus Jakarta Sans typography.
- **Backend / Service Layer**: Express.js REST API with Vite middleware integration (`server.ts`).
- **Data Layer**: Structured local JSON repository (`src/data/scholarships.json`) adhering to standard NSP metadata schema.
- **Engine Layer**:
  - `src/services/eligibilityEngine.ts`: Rule-based deterministic matching engine.
  - `src/services/combinationEngine.ts`: Combinatorial subset generator and data-driven conflict checker.
  - `src/services/scholarshipService.ts`: Extensible repository service with query filters.

---

## 📡 Backend API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status and total loaded scholarships count |
| `GET` | `/api/scholarships` | Retrieves all scholarships with optional query filters (classification, category, query) |
| `GET` | `/api/scholarships/:id` | Returns single scholarship record by unique identifier |
| `POST` | `/api/match` | Runs deterministic eligibility engine against student profile, returning eligible and ineligible schemes with explainability |
| `POST` | `/api/combinations` | Generates combinations from eligible schemes and filters invalid combinations using conflict rules |
| `POST` | `/api/analyze` | Unified endpoint: Match + Automatic Combinations + Conflict Matrix in a single high-speed transaction |

---

## ⚡ How to Run

### Development Mode
```bash
npm run dev
```
Starts the full-stack server on `http://localhost:3000` with Express backend API routes and Vite frontend.

### Production Build
```bash
npm run build
npm start
```

---

## 🔮 Future Integration: Automatic NSP PDF Extraction + Gemini Pipeline

ScholarSync was architected specifically so the local dataset can be swapped or augmented with an automated extraction pipeline:

```text
Official NSP Portal / State Gazette
        ↓
PDF Downloader & OCR / Text Extractor
        ↓
Gemini 2.5 Flash Structured Output (Extracts JSON conforming to Scholarship interface)
        ↓
Database / scholarshipService.ts
        ↓
Deterministic Eligibility Engine
        ↓
Automatic Combination Generator
        ↓
Conflict Detection Matrix
```

The data models in `src/types/scholarship.ts` and `src/services/scholarshipService.ts` provide a direct plug-in method:
```typescript
scholarshipService.seedExtractedScholarships(extractedScholarshipsFromGemini);
```
No frontend UI changes or matching logic changes are required when switching to live extracted data!
