# StudyPilot AI — Premium AI-Powered Exam Coach

> **"Learn smarter. Score higher."**
> A responsive, full-stack student exam coach built for hackathons and academic preparation. Turn class study notes into grounded quizzes, take timed MCQ exams, diagnose weak topics under 60% mastery, and accelerate learning with instant-feedback smart drills.

---

## 🌟 Key Features

1. **Notes-to-Quiz Generator**
   - Ingests raw study notes, lecture summaries, or textbook excerpts.
   - Built-in library of curated sample notes: *Cellular Respiration & Bioenergetics*, *OS Virtual Memory & Deadlocks*, and *Macroeconomics & Monetary Policy*.
   - Generates MCQs with exactly 4 options, 1 verified correct answer, and an explanation grounded in the text.
   - Transparent factual integrity: never hallucinates facts outside the provided material. If notes are too brief to support the requested number of questions (5, 10, or 15), StudyPilot provides an honest grounding notice.
   - Pluggable AI integration architecture: calls an optional server-side AI proxy if configured, with deterministic fallback when offline.

2. **Interactive Exam Experience**
   - Clean, focused interface displaying one question at a time.
   - Answer selection with free modification before submission.
   - Mark-for-review flagging and visual question jump palette.
   - Pre-submission audit modal displaying answered, skipped, and flagged questions.
   - Safe accuracy calculation that prevents division by zero.
   - Duplicate submission protection.

3. **Results & Question-by-Question Review**
   - Big score display with letter-grade and mastery tier classification (*Mastery*, *Proficient*, *Developing*, *Needs Practice*).
   - Complete breakdown of correct, incorrect, and skipped questions.
   - Expandable question review displaying student choice, correct answer key, and exact quote from the notes.
   - Per-quiz topic breakdown with direct "Practise Weak Topics" action.

4. **Weak-Topic Detection Engine**
   - Centralized rule definition in `src/constants/rules.ts`.
   - Diagnoses topics needing review when accuracy falls below **60%** with at least **3 questions attempted**.
   - Topics with fewer than 3 attempts are accurately classified as *"Not enough data"* to prevent premature conclusions.
   - Topics with $\ge 80\%$ accuracy are celebrated as *"Strong"*.

5. **Smart Practice Mode**
   - Prioritizes diagnosed weak topics.
   - **Instant Feedback**: Reveals whether an answer is correct or incorrect immediately upon clicking, accompanied by the source-grounded explanation.
   - Topic selector allows drilling specific syllabus areas.
   - Session completion summary.

6. **Progress Analytics (Recharts)**
   - Score trajectory line chart over chronological test attempts.
   - Subject-wise accuracy comparison bar chart.
   - Correct vs. Incorrect vs. Skipped donut chart.
   - Top-performing concepts vs. high-priority revision topics.

7. **My Quizzes & History**
   - Search by title, subject, or keyword.
   - Subject filter dropdown.
   - Retake previous quizzes with a single click.
   - Inspect historical attempt answers.
   - Local storage persistence with corrupted-data fallback.

8. **Settings & Data Privacy**
   - Customizable student display name and exam target.
   - Visual theme color tokens documentation.
   - Clear history with confirmation modal.
   - Reset to demonstration dataset with confirmation modal.
   - 100% local browser storage guarantee — notes and quiz answers never leave the browser in local mode.

---

## 🎨 Visual Design System

Built on a dark fintech SaaS aesthetic:
- **Main Background**: `#0B0F19`
- **Sidebar**: `#0D1220`
- **Card Background**: `#121A2A`
- **Elevated Surface**: `#172235`
- **Primary Blue**: `#3B82F6`
- **Cyan Accent**: `#22D3EE`
- **Success**: `#22C55E`
- **Warning**: `#F59E0B`
- **Danger**: `#EF4444`
- **Main Text**: `#F8FAFC`
- **Secondary Text**: `#94A3B8`
- **Borders**: `rgba(255, 255, 255, 0.08)`

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, PostCSS, Lucide React icons
- **Data Visualization**: Recharts
- **Testing**: Vitest
- **Persistence**: Browser `localStorage` with JSON schema validation
- **Backend (Optional)**: Node.js server proxy (`server/aiProxy.js`)

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js $\ge 18$
- pnpm $\ge 9$ (or npm)

### 2. Installation
```bash
# Clone the repository and navigate into the workspace
cd studypilot-ai

# Install dependencies
pnpm install
```

### 3. Running Development Server
```bash
pnpm dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Running Automated Tests
```bash
pnpm test
```
Runs the Vitest suite covering scoring, safe accuracy calculations, weak-topic thresholds, and question generator validation.

### 5. Building for Production
```bash
pnpm build
```
Creates an optimized production bundle in the `dist/` directory.

---

## 🧪 Automated Test Coverage

StudyPilot includes unit tests in `src/tests/`:
1. `scoring.test.ts`:
   - Validates correct answers tally with answer key.
   - Verifies accuracy calculation ($4/5 = 80\%$).
   - Verifies zero-division safety ($0/0 = 0\%$).
   - Verifies unanswered questions tabulation.
2. `weakTopics.test.ts`:
   - Validates topic marked "Weak" when $< 60\%$ accuracy and $\ge 3$ questions.
   - Validates topic marked "Not enough data" when $< 3$ questions attempted.
   - Validates topic marked "Strong" when $\ge 80\%$ accuracy.
3. `generator.test.ts`:
   - Rejects empty or notes shorter than 60 characters with helpful guidance.
   - Ensures generated questions have 4 options, valid single correct index, and explanations.
   - Validates transparent limitation notice when notes cannot support requested question count.

---

## 📂 Project Architecture

```
studypilot-ai/
├── server/
│   └── aiProxy.js             # Optional server-side AI proxy
├── src/
│   ├── types/
│   │   └── quiz.ts            # TypeScript interfaces for Quiz, Attempt, Question
│   ├── constants/
│   │   ├── rules.ts           # Diagnostic thresholds (<60%, min 3 attempts)
│   │   ├── sampleNotes.ts     # Curated notes for Bio, OS, Economics
│   │   └── sampleHistory.ts   # Demonstration attempts
│   ├── services/
│   │   ├── storage.ts         # LocalStorage persistence & error handling
│   │   ├── analytics.ts       # Scoring, accuracy, weak topic diagnostics
│   │   ├── quizGenerator.ts   # Fact-grounded MCQ generation engine
│   │   └── curatedQuestions.ts# Ground-truth question bank
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx    # Collapsible desktop navigation
│   │   │   ├── Header.tsx     # Status bar, streak, profile
│   │   │   └── MobileNav.tsx  # Responsive mobile bottom bar
│   │   ├── common/
│   │   │   ├── Button.tsx     # Reusable button with variants & loading state
│   │   │   ├── Card.tsx       # Fintech styled surface cards
│   │   │   ├── Badge.tsx      # Status & category pills
│   │   │   ├── Modal.tsx      # Accessible modal dialog
│   │   │   └── ProgressBar.tsx# Visual progress bars
│   │   ├── dashboard/
│   │   │   └── OverviewDashboard.tsx # KPIs, trend charts, weak topic preview
│   │   ├── generator/
│   │   │   └── QuizGeneratorView.tsx # Notes-to-quiz form & progress states
│   │   ├── quiz/
│   │   │   └── QuizSessionView.tsx   # Interactive 1-by-1 quiz taking
│   │   ├── results/
│   │   │   └── QuizResultsView.tsx   # Score tiers, answer review, citations
│   │   ├── practice/
│   │   │   └── SmartPracticeView.tsx # Instant-feedback weak topic drills
│   │   ├── history/
│   │   │   └── QuizHistoryView.tsx   # Past quizzes, search & filter, retake
│   │   ├── analytics/
│   │   │   └── AnalyticsView.tsx     # Recharts score trends & breakdowns
│   │   └── settings/
│   │       └── SettingsView.tsx      # Student profile & data management
│   ├── tests/
│   │   ├── scoring.test.ts
│   │   ├── weakTopics.test.ts
│   │   └── generator.test.ts
│   ├── App.tsx                # Main view router & state synchronizer
│   ├── main.tsx               # React DOM entry point
│   └── index.css              # Dark theme CSS & Tailwind directives
├── index.html                 # HTML shell
├── package.json               # Dependencies & scripts
├── tsconfig.json              # TypeScript configuration
├── tailwind.config.js         # Fintech theme tokens
└── vite.config.ts             # Vite build configuration
```

---

## 🔒 Security & Privacy

- **No client-side API secrets**: API keys are never embedded in the frontend bundle.
- **XSS Protection**: User notes and generated questions are rendered using standard React data bindings, avoiding `dangerouslySetInnerHTML`.
- **Offline Reliability**: Works completely offline using client-side deterministic fact extraction and curated question libraries.
