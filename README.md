# UIU Fall 2026 Academic Dashboard

A responsive, cloud-synced academic schedule and progress management platform engineered specifically for the **United International University (UIU) Fall 2026** trimester. Designed to streamline multi-track class monitoring, assessment tracking, and holiday/event alerts, the platform automates completion states and provides real-time synchronization across devices.

---

## ✨ Key Features

### 1. Multi-Track Schedule & Progress Tracking
- **Dual-Track Architecture**: Supports **6 total tracks** simultaneously:
  - **4 Single-Day Tracks**: `SAT`, `SUN`, `TUE`, and `WED` (12 classes each).
  - **2 Paired Tracks**: `SAT/TUE` and `SUN/WED` (24 classes each).
- **Dynamic Dual-Numbering**: Every calendar tile dynamically calculates and displays both its single-track sequence number (`#1–12`) and its paired-track sequence number (`#1–24`).
- **Interactive Mini-Grids**: Visual block grids on the dashboard reflect individual class completion states (`1–12` and `1–24`) with hover tooltips detailing dates and statuses.

### 2. Intelligent Time-Based Auto-Completion
- **4:30 PM BDT Cutoff Engine**: Automatically evaluates both regular and online makeup classes against **Bangladesh Standard Time (UTC+6)**. Once `4:30 PM` on the scheduled date passes, classes transition automatically from `Scheduled` to `Completed` and `Locked`.
- **Live Background Sync**: Runs an automated 60-second background interval check so tiles and dashboard metrics update live without requiring a manual page reload.
- **Immutable History**: Completed items are automatically locked to prevent accidental edits to historical academic records.

### 3. Smart Navigation & Focus UX
- **Auto-Collapsing Past Months**: Months that have concluded (e.g., October) automatically collapse into sleek summary accordions, keeping the workspace focused on active and upcoming schedules.
- **Current Month Badge & Auto-Scroll**: Highlights the active month header with a `Current Month` indicator and smoothly scrolls to the active section (accounting for the persistent sticky navigation bar) upon load or tab switch.
- **"Next Up" Visual Highlighting**: Both the Calendar Grid and the Dashboard Chronological Timeline pinpoint the immediate upcoming pending class using a pulsing amber ring, left accent border, and bouncing `Next Up` badge, automatically scrolling the timeline container to center on it.
- **Dynamic Browser Tab Badge**: Displays the live count of remaining pending classes directly in the browser tab title (e.g., `(18) UIU Fall 2026 Academic Dashboard`).

### 4. Assessments, Events & Online Makeup Management
- **Assessment Tracking**: Attach custom assessments (Quizzes, Presentations, Assignment Deadlines, Updates) with course codes directly to scheduled class dates.
- **Urgent Academic Warnings**: Displays high-visibility warning banners for non-holiday academic events occurring within `< 3 days`.
- **Online Makeup Integration**: Dedicated styling and quick-access meeting link storage (`Join Meeting` / `+ Add Link`) for rescheduled online makeup sessions.

### 5. Real-Time Cloud Sync (Firebase)
- **8-Character Session Keys**: Syncs user-created assessments, custom meeting links, and completion states across browsers and devices via Firebase Realtime Database using lightweight 8-character session codes—no traditional account registration required.

---

## 🛠️ Tech Stack

- **Frontend**: Semantic HTML5, Vanilla JavaScript (ES6+), Tailwind CSS
- **Icons**: Lucide Icons
- **Backend / Database**: Firebase Realtime Database (Client SDK)
- **Timezone & Date Logic**: Native JavaScript `Date` API calibrated for BDT (`16:30:00` cutoff)

---

## 📂 Project Structure

```text
├── index.html          # Main application layout, sticky header, modals, and tab views
├── script.js           # Core logic: ALL_CLASSES dataset, auto-completion engine, Firebase sync, and DOM renderers
├── style.css           # Custom utility overrides and animation helpers (if applicable)
└── README.md           # Project documentation
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
   Open `script.js` and ensure your Firebase configuration object points to your Realtime Database instance:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
     databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_PROJECT_ID.appspot.com",
     messagingSenderId: "YOUR_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```

3. **Run Locally**:
   Serve the files using any static HTTP server (e.g., VS Code Live Server, `npx serve`, or Python):
   ```bash
   npx serve .
   ```

---

## 🔄 How Sync Keys Work

1. On first visit, the dashboard generates or prompts for an **8-character Sync Key**.
2. All custom assessments and online makeup links are stored under `sessions/<SYNC_KEY>` in Firebase Realtime Database.
3. Enter the same 8-character key on another device to immediately pull and synchronize your academic progress.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
