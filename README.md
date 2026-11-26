# UIU Fall 2026 Academic Dashboard & Tracker

A responsive, cloud-synced academic schedule, assessment, and exam duty management platform built for the **United International University (UIU) Fall 2026** trimester. Designed to streamline multi-track class monitoring, custom assessments, mid/final exam planning, client-side invigilation PDF parsing, and academic event alerts, with real-time cross-device synchronization.

---

## ✨ Key Features

### 1. Multi-Track Schedule & Progress Tracking
- **Dual-Track Architecture**: Supports **6 tracks** simultaneously:
  - **4 Single-Day Tracks**: `SAT`, `SUN`, `TUE`, and `WED` (12 classes each).
  - **2 Paired Tracks**: `SAT/TUE` and `SUN/WED` (24 classes each).
- **Dashboard & Trackers**: Overall completion ring (`0–48` classes), regular vs. Thursday online makeup progress bars, custom assessment summary counts, per-track mini-grids (`1–12` and `1–24`), and a chronological class schedule timeline.

### 2. Intelligent Time-Based Auto-Completion
- **4:30 PM BDT Cutoff**: Evaluates regular classes, online makeup classes, exam days, and academic events against the `4:30 PM` (`16:30:00`) cutoff on each scheduled date, automatically transitioning past items to `Completed` and `Locked`.
- **Immutable History**: Completed classes and past exams are locked from accidental edits, and completed online makeup **Join Meeting** links are automatically disabled.

### 3. Smart Navigation & Focus UX
- **Gliding Circular Pill Navbar**: 4-tab navigation (`Calendar`, `Trackers`, `Assessments`, `Events`) with an animated gliding indicator circle, icon lift, and high-contrast red notification badges for upcoming assessments and urgent events (`< 3 days`).
- **Ongoing vs. Next Up Highlighting**: Distinguishes today's active class as **Ongoing** (violet accent) and the next upcoming class as **Next Up** (blue accent) across both the Calendar grid and Trackers timeline.
- **Auto-Scroll & Back to Top**:
  - **Calendar**: Smoothly scrolls to today's class tile (or the Next Up tile / current month fallback) on load and tab switch.
- **Auto-Collapsing Past Months**: Concluded months collapse automatically into summary accordions.

### 4. Integrated Exam Cards, Assessments & PDF Schedule Parsing
- **Exam Window Cards in Calendar**: **Mid-Term Exam (`Dec 5 – Dec 12`)** and **Final Exam (`Jan 25 – Feb 1`)** appear chronologically in the Calendar grid with a distinct rose accent, live countdown, and a **Plan** button that jumps directly to and expands the corresponding exam section in Assessments.
- **Assessment Filtering & History**: Filter by type (`Class Test`, `Presentation`, `Assignment Deadline`, `Update`, `Exam/Duty`) plus a collapsible **Filtering options** panel (`Status` and `Urgency`). Expired/completed assessments collapse automatically at the bottom of the list.
- **Student Exams & Faculty Duties**: Add Student Exam entries or Faculty Exam Duties per exam day (enforcing duty count = selected slot checkboxes), automatically mirrored into the Assessments list under `Exam/Duty`. Exam sections auto-expand within 10 days of the exam start date.
- **Client-Side Invigilation PDF Parser (PDF.js)**: Upload a UIU **My Invigilations** PDF in the Mid-Term or Final exam section to parse `Exam Date`, `Exam Time`, `Course Code`, `Dept.` (`BSCSE`/`BSEEE`), and `Room #` in the browser—automatically setting duty counts and time slots, hiding manual `Edit Duty` for PDF-imported days, and displaying collapsible **Details (N)** per day card.

### 5. Academic Events & Online Makeup Management
- **Important Events**: Filterable by `Academic`, `Exam`, `Payment`, and `Holiday`, with high-visibility warning banners for non-holiday events occurring within `< 3 days`.
- **Online Makeup Links**: Store custom meeting URLs and display aliases (`+ Add Link` / `Join Meeting`) for Thursday online makeup sessions; links are disabled once the session is completed.

### 6. Real-Time Cloud Sync (Firebase)
- **Session Sync Codes**: Automatically generates a `FALL-2026-XXXX-XXXX` session code to sync class completions, event completions, exam completions, user evaluations, makeup meeting links, student exam entries, and faculty exam duties across devices via Firebase Realtime Database (`UIU_Calendar_263/sync_sessions/<SYNC_CODE>`).

---

## 🛠️ Tech Stack

- **Frontend**: Semantic HTML5, Vanilla JavaScript (ES6+), Tailwind CSS (CDN), Custom CSS Variables (`styles.css`)
- **Icons & Fonts**: Lucide Icons, Inter & JetBrains Mono (`tabular-nums`)
- **PDF Parsing**: PDF.js (`v3.11.174` via CDN, coordinate-based client-side table extraction)
- **Backend / Database**: Firebase Realtime Database (v9 Compat Client SDK)

---

## 📂 Project Structure

```text
├── index.html          # Application layout, gliding navbar, tab views, and modals
├── styles.css          # Graphite light theme variables, nav indicator, and tile/timeline styles
├── script.js           # Datasets, auto-completion, PDF.js parser, Firebase sync, and renderers
├── logo.png            # UIU header logo
└── project_readme.md   # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Edge, Safari)
- A Firebase project with **Realtime Database** enabled (for cross-device sync)

### Installation & Setup
1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/uiu-fall-2026-dashboard.git
   cd uiu-fall-2026-dashboard
   ```

2. **Configure Firebase**:
   Open `script.js` and point `firebaseConfig.databaseURL` to your Realtime Database instance:
   ```javascript
   const firebaseConfig = {
     databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.asia-southeast1.firebasedatabase.app/",
   };
   ```

3. **Run Locally**:
   Serve the files using any static HTTP server (e.g., VS Code Live Server, `npx serve`, or Python):
   ```bash
   npx serve .
   ```

---

## 🔄 How Sync Codes Work

1. On first visit, the app generates a unique `FALL-2026-XXXX-XXXX` sync code (accessible from **Sync devices** in the header).
2. All progress, custom assessments, makeup links, student exams, and faculty duties are synced under `UIU_Calendar_263/sync_sessions/<SYNC_CODE>` in Firebase Realtime Database.
3. Enter the same sync code on another device via **Sync devices → Connect** to synchronize your data immediately.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
