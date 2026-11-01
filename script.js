// 1. Firebase Realtime Database Configuration
const firebaseConfig = {
  databaseURL:
    "https://academic-calendar-tracker-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

let db = null;
let syncRef = null;
try {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  db = firebase.database();
} catch (e) {
  console.warn("Firebase fallback to local storage mode.", e);
}

// Master Data Structure
const ALL_CLASSES = [
  // October 2026
  {
    id: "oct-27",
    dateStr: "2026-10-27",
    month: "OCT",
    dayNum: 27,
    dayName: "TUE",
    track: "TUE",
    classNo: 1,
    isMakeup: false,
  },
  {
    id: "oct-28",
    dateStr: "2026-10-28",
    month: "OCT",
    dayNum: 28,
    dayName: "WED",
    track: "WED",
    classNo: 1,
    isMakeup: false,
  },
  {
    id: "oct-31",
    dateStr: "2026-10-31",
    month: "OCT",
    dayNum: 31,
    dayName: "SAT",
    track: "SAT",
    classNo: 1,
    isMakeup: false,
  },

  // November 2026
  {
    id: "nov-01",
    dateStr: "2026-11-01",
    month: "NOV",
    dayNum: 1,
    dayName: "SUN",
    track: "SUN",
    classNo: 1,
    isMakeup: false,
  },
  {
    id: "nov-03",
    dateStr: "2026-11-03",
    month: "NOV",
    dayNum: 3,
    dayName: "TUE",
    track: "TUE",
    classNo: 2,
    isMakeup: false,
  },
  {
    id: "nov-04",
    dateStr: "2026-11-04",
    month: "NOV",
    dayNum: 4,
    dayName: "WED",
    track: "WED",
    classNo: 2,
    isMakeup: false,
  },
  {
    id: "nov-05",
    dateStr: "2026-11-05",
    month: "NOV",
    dayNum: 5,
    dayName: "THU",
    track: "SAT",
    classNo: 2,
    isMakeup: true,
    makeupFor: "SAT",
  },
  {
    id: "nov-08",
    dateStr: "2026-11-08",
    month: "NOV",
    dayNum: 8,
    dayName: "SUN",
    track: "SUN",
    classNo: 2,
    isMakeup: false,
  },
  {
    id: "nov-10",
    dateStr: "2026-11-10",
    month: "NOV",
    dayNum: 10,
    dayName: "TUE",
    track: "TUE",
    classNo: 3,
    isMakeup: false,
  },
  {
    id: "nov-11",
    dateStr: "2026-11-11",
    month: "NOV",
    dayNum: 11,
    dayName: "WED",
    track: "WED",
    classNo: 3,
    isMakeup: false,
  },
  {
    id: "nov-12",
    dateStr: "2026-11-12",
    month: "NOV",
    dayNum: 12,
    dayName: "THU",
    track: "SAT",
    classNo: 3,
    isMakeup: true,
    makeupFor: "SAT",
  },
  {
    id: "nov-14",
    dateStr: "2026-11-14",
    month: "NOV",
    dayNum: 14,
    dayName: "SAT",
    track: "SAT",
    classNo: 4,
    isMakeup: false,
  },
  {
    id: "nov-15",
    dateStr: "2026-11-15",
    month: "NOV",
    dayNum: 15,
    dayName: "SUN",
    track: "SUN",
    classNo: 3,
    isMakeup: false,
  },
  {
    id: "nov-17",
    dateStr: "2026-11-17",
    month: "NOV",
    dayNum: 17,
    dayName: "TUE",
    track: "TUE",
    classNo: 4,
    isMakeup: false,
  },
  {
    id: "nov-18",
    dateStr: "2026-11-18",
    month: "NOV",
    dayNum: 18,
    dayName: "WED",
    track: "WED",
    classNo: 4,
    isMakeup: false,
  },
  {
    id: "nov-21",
    dateStr: "2026-11-21",
    month: "NOV",
    dayNum: 21,
    dayName: "SAT",
    track: "SAT",
    classNo: 5,
    isMakeup: false,
  },
  {
    id: "nov-22",
    dateStr: "2026-11-22",
    month: "NOV",
    dayNum: 22,
    dayName: "SUN",
    track: "SUN",
    classNo: 4,
    isMakeup: false,
  },
  {
    id: "nov-24",
    dateStr: "2026-11-24",
    month: "NOV",
    dayNum: 24,
    dayName: "TUE",
    track: "TUE",
    classNo: 5,
    isMakeup: false,
  },
  {
    id: "nov-25",
    dateStr: "2026-11-25",
    month: "NOV",
    dayNum: 25,
    dayName: "WED",
    track: "WED",
    classNo: 5,
    isMakeup: false,
  },
  {
    id: "nov-26",
    dateStr: "2026-11-26",
    month: "NOV",
    dayNum: 26,
    dayName: "THU",
    track: "SUN",
    classNo: 5,
    isMakeup: true,
    makeupFor: "SUN",
  },
  {
    id: "nov-28",
    dateStr: "2026-11-28",
    month: "NOV",
    dayNum: 28,
    dayName: "SAT",
    track: "SAT",
    classNo: 6,
    isMakeup: false,
  },
  {
    id: "nov-29",
    dateStr: "2026-11-29",
    month: "NOV",
    dayNum: 29,
    dayName: "SUN",
    track: "SUN",
    classNo: 6,
    isMakeup: false,
  },

  // December 2026
  {
    id: "dec-01",
    dateStr: "2026-12-01",
    month: "DEC",
    dayNum: 1,
    dayName: "TUE",
    track: "TUE",
    classNo: 6,
    isMakeup: false,
  },
  {
    id: "dec-02",
    dateStr: "2026-12-02",
    month: "DEC",
    dayNum: 2,
    dayName: "WED",
    track: "WED",
    classNo: 6,
    isMakeup: false,
  },
  {
    id: "dec-13",
    dateStr: "2026-12-13",
    month: "DEC",
    dayNum: 13,
    dayName: "SUN",
    track: "SUN",
    classNo: 7,
    isMakeup: false,
  },
  {
    id: "dec-15",
    dateStr: "2026-12-15",
    month: "DEC",
    dayNum: 15,
    dayName: "TUE",
    track: "TUE",
    classNo: 7,
    isMakeup: false,
  },
  {
    id: "dec-17",
    dateStr: "2026-12-17",
    month: "DEC",
    dayNum: 17,
    dayName: "THU",
    track: "WED",
    classNo: 7,
    isMakeup: true,
    makeupFor: "WED",
  },
  {
    id: "dec-19",
    dateStr: "2026-12-19",
    month: "DEC",
    dayNum: 19,
    dayName: "SAT",
    track: "SAT",
    classNo: 7,
    isMakeup: false,
  },
  {
    id: "dec-20",
    dateStr: "2026-12-20",
    month: "DEC",
    dayNum: 20,
    dayName: "SUN",
    track: "SUN",
    classNo: 8,
    isMakeup: false,
  },
  {
    id: "dec-22",
    dateStr: "2026-12-22",
    month: "DEC",
    dayNum: 22,
    dayName: "TUE",
    track: "TUE",
    classNo: 8,
    isMakeup: false,
  },
  {
    id: "dec-23",
    dateStr: "2026-12-23",
    month: "DEC",
    dayNum: 23,
    dayName: "WED",
    track: "WED",
    classNo: 8,
    isMakeup: false,
  },
  {
    id: "dec-26",
    dateStr: "2026-12-26",
    month: "DEC",
    dayNum: 26,
    dayName: "SAT",
    track: "SAT",
    classNo: 8,
    isMakeup: false,
  },
  {
    id: "dec-27",
    dateStr: "2026-12-27",
    month: "DEC",
    dayNum: 27,
    dayName: "SUN",
    track: "SUN",
    classNo: 9,
    isMakeup: false,
  },
  {
    id: "dec-29",
    dateStr: "2026-12-29",
    month: "DEC",
    dayNum: 29,
    dayName: "TUE",
    track: "TUE",
    classNo: 9,
    isMakeup: false,
  },
  {
    id: "dec-30",
    dateStr: "2026-12-30",
    month: "DEC",
    dayNum: 30,
    dayName: "WED",
    track: "WED",
    classNo: 9,
    isMakeup: false,
  },
  {
    id: "dec-31",
    dateStr: "2026-12-31",
    month: "DEC",
    dayNum: 31,
    dayName: "THU",
    track: "SAT",
    classNo: 9,
    isMakeup: true,
    makeupFor: "SAT",
  },

  // January 2027
  {
    id: "jan-02",
    dateStr: "2027-01-02",
    month: "JAN",
    dayNum: 2,
    dayName: "SAT",
    track: "SAT",
    classNo: 10,
    isMakeup: false,
  },
  {
    id: "jan-03",
    dateStr: "2027-01-03",
    month: "JAN",
    dayNum: 3,
    dayName: "SUN",
    track: "SUN",
    classNo: 10,
    isMakeup: false,
  },
  {
    id: "jan-05",
    dateStr: "2027-01-05",
    month: "JAN",
    dayNum: 5,
    dayName: "TUE",
    track: "TUE",
    classNo: 10,
    isMakeup: false,
  },
  {
    id: "jan-06",
    dateStr: "2027-01-06",
    month: "JAN",
    dayNum: 6,
    dayName: "WED",
    track: "WED",
    classNo: 10,
    isMakeup: false,
  },
  {
    id: "jan-09",
    dateStr: "2027-01-09",
    month: "JAN",
    dayNum: 9,
    dayName: "SAT",
    track: "SAT",
    classNo: 11,
    isMakeup: false,
  },
  {
    id: "jan-10",
    dateStr: "2027-01-10",
    month: "JAN",
    dayNum: 10,
    dayName: "SUN",
    track: "SUN",
    classNo: 11,
    isMakeup: false,
  },
  {
    id: "jan-12",
    dateStr: "2027-01-12",
    month: "JAN",
    dayNum: 12,
    dayName: "TUE",
    track: "TUE",
    classNo: 11,
    isMakeup: false,
  },
  {
    id: "jan-13",
    dateStr: "2027-01-13",
    month: "JAN",
    dayNum: 13,
    dayName: "WED",
    track: "WED",
    classNo: 11,
    isMakeup: false,
  },
  {
    id: "jan-16",
    dateStr: "2027-01-16",
    month: "JAN",
    dayNum: 16,
    dayName: "SAT",
    track: "SAT",
    classNo: 12,
    isMakeup: false,
  },
  {
    id: "jan-17",
    dateStr: "2027-01-17",
    month: "JAN",
    dayNum: 17,
    dayName: "SUN",
    track: "SUN",
    classNo: 12,
    isMakeup: false,
  },
  {
    id: "jan-19",
    dateStr: "2027-01-19",
    month: "JAN",
    dayNum: 19,
    dayName: "TUE",
    track: "TUE",
    classNo: 12,
    isMakeup: false,
  },
  {
    id: "jan-20",
    dateStr: "2027-01-20",
    month: "JAN",
    dayNum: 20,
    dayName: "WED",
    track: "WED",
    classNo: 12,
    isMakeup: false,
  },
];

const MIDTERM_DAYS = [
  {
    id: "mid-1",
    dateStr: "2026-12-05",
    display: "Dec 5, 2026 (Sat)",
    dayNo: 1,
  },
  {
    id: "mid-2",
    dateStr: "2026-12-06",
    display: "Dec 6, 2026 (Sun)",
    dayNo: 2,
  },
  {
    id: "mid-3",
    dateStr: "2026-12-07",
    display: "Dec 7, 2026 (Mon)",
    dayNo: 3,
  },
  {
    id: "mid-4",
    dateStr: "2026-12-08",
    display: "Dec 8, 2026 (Tue)",
    dayNo: 4,
  },
  {
    id: "mid-5",
    dateStr: "2026-12-09",
    display: "Dec 9, 2026 (Wed)",
    dayNo: 5,
  },
  {
    id: "mid-6",
    dateStr: "2026-12-10",
    display: "Dec 10, 2026 (Thu)",
    dayNo: 6,
  },
  {
    id: "mid-7",
    dateStr: "2026-12-12",
    display: "Dec 12, 2026 (Sat)",
    dayNo: 7,
  },
];

const FINAL_DAYS = [
  {
    id: "fin-1",
    dateStr: "2027-01-25",
    display: "Jan 25, 2027 (Mon)",
    dayNo: 1,
  },
  {
    id: "fin-2",
    dateStr: "2027-01-26",
    display: "Jan 26, 2027 (Tue)",
    dayNo: 2,
  },
  {
    id: "fin-3",
    dateStr: "2027-01-27",
    display: "Jan 27, 2027 (Wed)",
    dayNo: 3,
  },
  {
    id: "fin-4",
    dateStr: "2027-01-28",
    display: "Jan 28, 2027 (Thu)",
    dayNo: 4,
  },
  {
    id: "fin-5",
    dateStr: "2027-01-30",
    display: "Jan 30, 2027 (Sat)",
    dayNo: 5,
  },
  {
    id: "fin-6",
    dateStr: "2027-01-31",
    display: "Jan 31, 2027 (Sun)",
    dayNo: 6,
  },
  {
    id: "fin-7",
    dateStr: "2027-02-01",
    display: "Feb 1, 2027 (Mon)",
    dayNo: 7,
  },
];

const ACADEMIC_EVENTS = [
  {
    id: "evt-1",
    dateStr: "2026-10-27",
    dateDisplay: "Oct 27, 2026",
    dayName: "Tue",
    category: "ACADEMIC",
    title: "Classes Begin",
    note: "Start of Fall 2026 Trimester classes",
  },
  {
    id: "evt-2",
    dateStr: "2026-10-31",
    dateDisplay: "Oct 31, 2026",
    dayName: "Sat",
    category: "ACADEMIC",
    title: "Course Drop Deadline (100% Refund)",
    note: "Last day to drop course(s) with 100% adjustable refund",
  },
  {
    id: "evt-3",
    dateStr: "2026-11-04",
    dateDisplay: "Nov 4, 2026",
    dayName: "Wed",
    category: "ACADEMIC",
    title: "Grade Change Application Deadline",
    note: "Last day to apply for Grade Change of Summer 2026 Trimester",
  },
  {
    id: "evt-4",
    dateStr: "2026-11-07",
    dateDisplay: "Nov 7, 2026",
    dayName: "Sat",
    category: "HOLIDAY",
    title: "Holiday: National Revolution & Solidarity Day",
    note: "University closed",
  },
  {
    id: "evt-5",
    dateStr: "2026-11-08",
    dateDisplay: "Nov 8, 2026",
    dayName: "Sun",
    category: "ACADEMIC",
    title: "Grade Submission & 50% Drop Deadline",
    note: "Last day of Grade Submission & 50% refund drop deadline",
  },
  {
    id: "evt-6",
    dateStr: "2026-11-09",
    dateDisplay: "Nov 9, 2026",
    dayName: "Mon",
    category: "ACADEMIC",
    title: "Late Advising & Incomplete Grade Deadline",
    note: "Course Advising with Fine & Incomplete grade submission deadline",
  },
  {
    id: "evt-7",
    dateStr: "2026-11-22",
    dateDisplay: "Nov 22, 2026",
    dayName: "Sun",
    category: "PAYMENT",
    title: "1st Installment Payment Deadline",
    note: "Must pay 40% Tuition + Trimester Fee",
  },
  {
    id: "evt-8",
    dateStr: "2026-12-05",
    dateDisplay: "Dec 5 – Dec 12, 2026",
    dayName: "Sat - Sat",
    category: "EXAM",
    title: "Mid-Term Examinations",
    note: "Mid-Term Exam Week",
  },
  {
    id: "evt-9",
    dateStr: "2026-12-15",
    dateDisplay: "Dec 15, 2026",
    dayName: "Tue",
    category: "PAYMENT",
    title: "2nd Installment Payment Deadline",
    note: "Must pay 70% Tuition + Trimester Fee",
  },
  {
    id: "evt-10",
    dateStr: "2026-12-16",
    dateDisplay: "Dec 16, 2026",
    dayName: "Wed",
    category: "HOLIDAY",
    title: "Holiday: Victory Day",
    note: "University closed",
  },
  {
    id: "evt-11",
    dateStr: "2026-12-23",
    dateDisplay: "Dec 23, 2026",
    dayName: "Wed",
    category: "ACADEMIC",
    title: "Last Day of Course Withdrawal",
    note: "Final deadline to withdraw from course(s)",
  },
  {
    id: "evt-12",
    dateStr: "2026-12-25",
    dateDisplay: "Dec 25, 2026",
    dayName: "Fri",
    category: "HOLIDAY",
    title: "Holiday: Christmas Day",
    note: "University closed",
  },
  {
    id: "evt-13",
    dateStr: "2027-01-13",
    dateDisplay: "Jan 13, 2027",
    dayName: "Wed",
    category: "PAYMENT",
    title: "3rd Installment Payment Deadline",
    note: "Must pay 100% Tuition + Trimester Fee",
  },
  {
    id: "evt-14",
    dateStr: "2027-01-21",
    dateDisplay: "Jan 21 – Jan 24, 2027",
    dayName: "Thu - Sun",
    category: "ACADEMIC",
    title: "Classes Suspended",
    note: "Classes remain suspended ahead of Final Exams",
  },
  {
    id: "evt-15",
    dateStr: "2027-01-24",
    dateDisplay: "Jan 24, 2027",
    dayName: "Sun",
    category: "HOLIDAY",
    title: "Holiday: Shab-e-Barat",
    note: "Subject to appearance of moon",
  },
  {
    id: "evt-16",
    dateStr: "2027-01-25",
    dateDisplay: "Jan 25 – Feb 1, 2027",
    dayName: "Mon - Mon",
    category: "EXAM",
    title: "Final Examinations",
    note: "Final Exam Week for Fall 2026 Trimester",
  },
  {
    id: "evt-17",
    dateStr: "2027-02-04",
    dateDisplay: "Feb 4, 2027",
    dayName: "Thu",
    category: "ACADEMIC",
    title: "Final Grade Submission Deadline",
    note: "Last day of Grade Submission",
  },
];

// App State
let completedClasses = new Set();
let completedEvents = new Set();
let completedExams = new Set();
let userEvaluations = [];
let makeupMeetingLinks = {};

let currentFilter = "ALL";
let currentEventFilter = "ALL";

// Assessment Filters
let currentEvalFilter = "ALL";
let currentEvalStatusFilter = "ALL";
let currentEvalUrgencyFilter = "ALL";

let currentPage = "calendar";
let syncCode = "";

const STORAGE_KEY = "calendar_263_completed_classes_v1";
const EVENTS_STORAGE_KEY = "calendar_263_completed_events_v1";
const EVALS_STORAGE_KEY = "calendar_263_user_evaluations_v1";
const EXAMS_STORAGE_KEY = "calendar_263_completed_exams_v1";
const LINKS_STORAGE_KEY = "calendar_263_makeup_links_v1";
const SYNC_CODE_KEY = "calendar_263_sync_code_v1";

function generateRaw8CharToken() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let part1 = "",
    part2 = "";
  for (let i = 0; i < 4; i++) {
    part1 += chars.charAt(Math.floor(Math.random() * chars.length));
    part2 += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${part1}-${part2}`;
}

async function initSyncCode() {
  let code = localStorage.getItem(SYNC_CODE_KEY);
  if (!code || code.length < 18) {
    let candidateCode = `FALL-2026-${generateRaw8CharToken()}`;
    code = candidateCode;
    localStorage.setItem(SYNC_CODE_KEY, code);
  }
  syncCode = code.toUpperCase();
  const displayEl = document.getElementById("sync-code-display");
  if (displayEl) displayEl.innerText = syncCode;
}

function loadState() {
  try {
    const savedClasses = localStorage.getItem(STORAGE_KEY);
    if (savedClasses) completedClasses = new Set(JSON.parse(savedClasses));

    const savedEvents = localStorage.getItem(EVENTS_STORAGE_KEY);
    if (savedEvents) completedEvents = new Set(JSON.parse(savedEvents));

    const savedEvals = localStorage.getItem(EVALS_STORAGE_KEY);
    if (savedEvals) userEvaluations = JSON.parse(savedEvals);

    const savedExams = localStorage.getItem(EXAMS_STORAGE_KEY);
    if (savedExams) completedExams = new Set(JSON.parse(savedExams));

    const savedLinks = localStorage.getItem(LINKS_STORAGE_KEY);
    if (savedLinks) makeupMeetingLinks = JSON.parse(savedLinks);
  } catch (e) {
    console.error("Failed loading state:", e);
  }
}

let isRemoteUpdating = false;

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedClasses]));
    localStorage.setItem(
      EVENTS_STORAGE_KEY,
      JSON.stringify([...completedEvents]),
    );
    localStorage.setItem(EVALS_STORAGE_KEY, JSON.stringify(userEvaluations));
    localStorage.setItem(
      EXAMS_STORAGE_KEY,
      JSON.stringify([...completedExams]),
    );
    localStorage.setItem(LINKS_STORAGE_KEY, JSON.stringify(makeupMeetingLinks));

    if (db && syncCode && !isRemoteUpdating) {
      db.ref("UIU_Calendar_263/sync_sessions/" + syncCode).set({
        completedClasses: [...completedClasses],
        completedEvents: [...completedEvents],
        completedExams: [...completedExams],
        userEvaluations,
        makeupMeetingLinks,
        lastUpdated: Date.now(),
      });
    }
  } catch (e) {
    console.error("Failed saving state:", e);
  }
}

function setupFirebaseSync() {
  if (!db || !syncCode) return;
  if (syncRef) syncRef.off();

  syncRef = db.ref("UIU_Calendar_263/sync_sessions/" + syncCode);
  syncRef.on("value", (snapshot) => {
    const data = snapshot.val();
    if (data) {
      isRemoteUpdating = true;
      completedClasses = new Set(data.completedClasses || []);
      completedEvents = new Set(data.completedEvents || []);
      completedExams = new Set(data.completedExams || []);
      userEvaluations = data.userEvaluations || [];
      makeupMeetingLinks = data.makeupMeetingLinks || {};

      syncPastClassesAndEvents();
      renderCalendar();
      renderDashboard();
      renderEvaluations();
      renderEvents();

      isRemoteUpdating = false;
    } else {
      saveState();
    }
  });
}

function openSyncModal() {
  const modal = document.getElementById("sync-modal");
  const displayEl = document.getElementById("sync-code-display");
  if (displayEl) displayEl.innerText = syncCode || "GENERATING...";
  if (modal) modal.classList.remove("hidden");
}

function closeSyncModal() {
  const modal = document.getElementById("sync-modal");
  if (modal) modal.classList.add("hidden");
}

function copySyncCode() {
  navigator.clipboard.writeText(syncCode);
  const msg = document.getElementById("sync-status-msg");
  if (msg) {
    msg.innerText = "Sync code copied to clipboard!";
    msg.classList.remove("hidden");
  }
}

function connectSyncCode(e) {
  e.preventDefault();
  const inputVal = document
    .getElementById("input-sync-code")
    .value.trim()
    .toUpperCase();
  if (!inputVal) return;

  syncCode = inputVal;
  localStorage.setItem(SYNC_CODE_KEY, syncCode);
  setupFirebaseSync();
  closeSyncModal();
}

function switchPage(page) {
  currentPage = page;
  ["calendar", "dashboard", "events", "assessments"].forEach((p) => {
    const el = document.getElementById(`page-${p}`);
    if (el) el.classList.add("hidden");
  });

  const activeEl = document.getElementById(`page-${page}`);
  if (activeEl) activeEl.classList.remove("hidden");

  if (page === "calendar") renderCalendar();
  else if (page === "dashboard") renderDashboard();
  else if (page === "assessments") renderEvaluations();
  else if (page === "events") renderEvents();

  updateNavigation();
}

function updateNavigation() {
  const navCal = document.getElementById("nav-calendar");
  const navDash = document.getElementById("nav-dashboard");
  const navEvt = document.getElementById("nav-events");
  const navEval = document.getElementById("nav-assessments");

  const inactiveStyle =
    "flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 text-slate-600 hover:text-slate-900 hover:bg-white/50 whitespace-nowrap shrink-0 relative";
  const activeStyle =
    "flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 bg-white text-brand-700 shadow-sm whitespace-nowrap shrink-0 relative";

  if (navCal)
    navCal.className = currentPage === "calendar" ? activeStyle : inactiveStyle;
  if (navDash)
    navDash.className =
      currentPage === "dashboard" ? activeStyle : inactiveStyle;
  if (navEval)
    navEval.className =
      currentPage === "assessments" ? activeStyle : inactiveStyle;
  if (navEvt)
    navEvt.className = currentPage === "events" ? activeStyle : inactiveStyle;
}

function setFilter(filter) {
  currentFilter = filter;
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.className =
      "filter-btn px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all bg-white text-slate-600 border-slate-200 hover:bg-slate-50";
  });
  const activeBtn = document.getElementById(`filter-${filter}`);
  if (activeBtn) {
    activeBtn.className =
      filter === "MAKEUP"
        ? "filter-btn px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-500 shadow-md shadow-amber-500/20"
        : "filter-btn px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all bg-gradient-to-r from-brand-600 to-indigo-600 text-white border-brand-600 shadow-md shadow-brand-500/20";
  }
  renderCalendar();
}

function isDatePassed(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tileDate = new Date(dateStr);
  tileDate.setHours(0, 0, 0, 0);

  return tileDate < today;
}

function renderCalendar() {
  const container = document.getElementById("calendar-container");
  if (!container) return;
  container.innerHTML = "";

  const months = ["OCT", "NOV", "DEC", "JAN"];
  const monthTitles = {
    OCT: "October 2026",
    NOV: "November 2026",
    DEC: "December 2026",
    JAN: "January 2027",
  };

  const monthThemeMap = {
    OCT: {
      cardBg:
        "bg-gradient-to-br from-indigo-50/90 via-purple-50/50 to-indigo-50/90 border-indigo-200/80",
      headerGrad: "from-indigo-600 via-indigo-700 to-purple-700 text-white",
    },
    NOV: {
      cardBg:
        "bg-gradient-to-br from-amber-50/90 via-orange-50/50 to-amber-50/90 border-amber-200/80",
      headerGrad: "from-amber-600 via-orange-600 to-red-600 text-white",
    },
    DEC: {
      cardBg:
        "bg-gradient-to-br from-emerald-50/90 via-teal-50/50 to-emerald-50/90 border-emerald-200/80",
      headerGrad: "from-emerald-600 via-teal-700 to-cyan-700 text-white",
    },
    JAN: {
      cardBg:
        "bg-gradient-to-br from-blue-50/90 via-sky-50/50 to-blue-50/90 border-blue-200/80",
      headerGrad: "from-blue-600 via-sky-600 to-indigo-700 text-white",
    },
  };

  // Track overall stats dynamically for the active filter
  let activeFilterTotal = 0;
  let activeFilterCompleted = 0;

  months.forEach((m) => {
    const monthClasses = ALL_CLASSES.filter((c) => c.month === m);

    // Get classes that match the selected filter bar
    const filteredClasses = monthClasses.filter((c) => {
      if (currentFilter === "ALL") return true;
      if (currentFilter === "MAKEUP") return c.isMakeup;
      return c.track === currentFilter;
    });

    if (filteredClasses.length === 0 && currentFilter !== "ALL") return;

    // Calculate month metrics based on FILTERED classes
    const monthTotalCount = filteredClasses.length;
    const monthCompletedCount = filteredClasses.filter((c) =>
      completedClasses.has(c.id),
    ).length;
    const monthUpcomingCount = monthTotalCount - monthCompletedCount;

    // Accumulate total metrics for top stats bar
    activeFilterTotal += monthTotalCount;
    activeFilterCompleted += monthCompletedCount;

    const theme = monthThemeMap[m];
    const monthSection = document.createElement("div");
    monthSection.className = `rounded-3xl border-2 shadow-sm p-5 space-y-4 ${theme.cardBg}`;

    monthSection.innerHTML = `
      <button onclick="toggleSection('month-sec-${m}')" class="w-full flex items-center justify-between bg-gradient-to-r ${theme.headerGrad} p-3.5 rounded-2xl shadow-sm cursor-pointer hover:opacity-95 transition-opacity">
        <div class="flex items-center gap-2.5">
          <i data-lucide="calendar" class="w-5 h-5 opacity-90"></i>
          <h2 class="text-base font-extrabold tracking-wide">${monthTitles[m]}</h2>
          <span class="text-[11px] font-bold bg-white/20 backdrop-blur-md text-white px-2.5 py-0.5 rounded-full border border-white/30">${monthUpcomingCount} Upcoming</span>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-xs font-bold bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-xl border border-white/30">${monthCompletedCount} / ${monthTotalCount} Done</span>
          <i id="month-sec-${m}-arrow" data-lucide="chevron-down" class="w-5 h-5 transform transition-transform"></i>
        </div>
      </button>
      <div id="month-sec-${m}" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 transition-all"></div>
    `;

    container.appendChild(monthSection);
    const grid = document.getElementById(`month-sec-${m}`);

    filteredClasses.forEach((item) => {
      const isDone = completedClasses.has(item.id);
      const isPast = isDatePassed(item.dateStr);
      const dayEvals = userEvaluations.filter((e) => e.dateId === item.id);
      const linkData = makeupMeetingLinks[item.id];

      const card = document.createElement("div");
      let borderStyle = isDone
        ? "border-emerald-500 bg-emerald-50/80 shadow-sm"
        : item.isMakeup
          ? "border-amber-300 bg-amber-50/60 hover:bg-amber-100/70"
          : "border-slate-200 bg-white hover:border-brand-300 hover:shadow-sm";

      card.className = `relative flex flex-col justify-between p-3.5 rounded-xl border-2 transition-all select-none ${borderStyle}`;

      let trackBadgeClass = "bg-slate-100 text-slate-700";
      if (item.track === "SAT")
        trackBadgeClass = "bg-indigo-100 text-indigo-800";
      if (item.track === "SUN") trackBadgeClass = "bg-blue-100 text-blue-800";
      if (item.track === "TUE")
        trackBadgeClass = "bg-emerald-100 text-emerald-800";
      if (item.track === "WED")
        trackBadgeClass = "bg-purple-100 text-purple-800";

      let evalsHtml = "";
      if (dayEvals.length > 0) {
        evalsHtml = `<div class="mt-2 space-y-1">`;
        dayEvals.forEach((ev) => {
          let evBadge = "bg-rose-100 text-rose-800 border-rose-200";
          if (ev.type === "Presentation")
            evBadge = "bg-indigo-100 text-indigo-800 border-indigo-200";
          if (ev.type === "Assignment Deadline")
            evBadge = "bg-cyan-100 text-cyan-800 border-cyan-200";
          if (ev.type === "Update")
            evBadge = "bg-amber-100 text-amber-800 border-amber-200";

          evalsHtml += `
            <div onclick="openEditEvalModal('${ev.id}', event)" class="p-1.5 rounded-lg border text-[10px] ${evBadge} font-semibold flex items-center justify-between gap-1 cursor-pointer hover:ring-2 hover:ring-brand-500/30">
              <div class="truncate">
                <span class="font-extrabold uppercase mr-0.5">${ev.code}:</span>
                <span>${ev.desc}</span>
              </div>
              <i data-lucide="edit-2" class="w-3 h-3 text-slate-500 shrink-0"></i>
            </div>
          `;
        });
        evalsHtml += `</div>`;
      }

      let meetingLinkHtml = "";
      if (item.isMakeup) {
        if (linkData && linkData.url) {
          const aliasText = linkData.alias || "Join Meeting";
          meetingLinkHtml = `
            <div class="mt-2">
              <a href="${linkData.url}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 w-full justify-center text-[10px] font-bold text-amber-800 bg-amber-200 hover:bg-amber-300 px-2 py-0.5 rounded border border-amber-300 transition-colors truncate">
                <i data-lucide="video" class="w-3 h-3 text-amber-700 shrink-0"></i>
                <span class="truncate">${aliasText}</span>
              </a>
            </div>
          `;
        } else if (!isPast) {
          meetingLinkHtml = `
            <div class="mt-2">
              <button onclick="openMeetingModal('${item.id}', '${item.month} ${item.dayNum}', event)" class="inline-flex items-center gap-1 w-full justify-center text-[10px] font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded border border-amber-300 transition-colors">
                <i data-lucide="link" class="w-3 h-3"></i> + Add Link
              </button>
            </div>
          `;
        }
      }

      card.innerHTML = `
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-extrabold ${isDone ? "text-emerald-900" : "text-slate-900"}">${item.month} ${item.dayNum}</span>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-md ${trackBadgeClass}">${item.dayName}</span>
          </div>

          <div class="space-y-1">
            <span class="text-xs ${isDone ? "text-emerald-700" : "text-slate-500"} font-medium block">Track: <strong class="${isDone ? "text-emerald-900" : "text-slate-800"}">${item.track}</strong> (#${item.classNo})</span>
            ${
              item.isMakeup
                ? `<div class="flex items-center justify-between">
                    <span class="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-200">
                      <i data-lucide="video" class="w-3 h-3"></i> Online Makeup
                    </span>
                   </div>`
                : `<span class="text-[10px] ${isDone ? "text-emerald-600" : "text-slate-400"}">Regular Class</span>`
            }
          </div>

          ${meetingLinkHtml}
          ${evalsHtml}
        </div>

        <div class="mt-3 pt-2 border-t ${isDone ? "border-emerald-200" : "border-slate-100"} flex items-center justify-between">
          ${
            isPast || isDone
              ? `<button disabled class="text-[10px] font-bold text-slate-400 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded cursor-not-allowed flex items-center gap-0.5">
                  <i data-lucide="lock" class="w-3 h-3"></i> Locked
                 </button>`
              : `<button onclick="openEvalModal('${item.id}', '${item.month} ${item.dayNum}, 2026', event)" class="text-[10px] font-bold text-brand-600 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 px-2.5 py-1 rounded transition-colors flex items-center gap-0.5">
                  <i data-lucide="plus" class="w-3 h-3"></i> Assessment
                 </button>`
          }
          ${
            isPast || isDone
              ? `<span class="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200">Completed</span>`
              : `<span class="text-[10px] font-semibold text-slate-400">Scheduled</span>`
          }
        </div>
      `;

      grid.appendChild(card);
    });
  });

  // Update Top Quick Stats dynamically according to the current filter
  const qComp = document.getElementById("quick-completed-count");
  const qRem = document.getElementById("quick-remaining-count");
  if (qComp) qComp.innerText = activeFilterCompleted;
  if (qRem) qRem.innerText = activeFilterTotal - activeFilterCompleted;

  lucide.createIcons();
}

function renderDashboard() {
  const total = 48;
  const done = completedClasses.size;
  const remaining = total - done;
  const percentage = Math.round((done / total) * 100);

  const ring = document.getElementById("overall-ring");
  if (ring) ring.setAttribute("stroke-dasharray", `${percentage}, 100`);

  const oPct = document.getElementById("overall-percentage");
  const dComp = document.getElementById("dash-completed-total");
  const dRem = document.getElementById("dash-remaining-desc");
  if (oPct) oPct.innerText = `${percentage}%`;
  if (dComp) dComp.innerText = done;
  if (dRem) dRem.innerText = `${remaining} classes remaining for full credit.`;

  const regularClasses = ALL_CLASSES.filter((c) => !c.isMakeup);
  const makeupClasses = ALL_CLASSES.filter((c) => c.isMakeup);

  const regDone = regularClasses.filter((c) =>
    completedClasses.has(c.id),
  ).length;
  const makeupDone = makeupClasses.filter((c) =>
    completedClasses.has(c.id),
  ).length;

  const rLbl = document.getElementById("reg-count-label");
  const rBar = document.getElementById("reg-progress-bar");
  const mLbl = document.getElementById("makeup-count-label");
  const mBar = document.getElementById("makeup-progress-bar");

  if (rLbl) rLbl.innerText = `${regDone}/43`;
  if (rBar) rBar.style.width = `${(regDone / 43) * 100}%`;
  if (mLbl) mLbl.innerText = `${makeupDone}/5`;
  if (mBar) mBar.style.width = `${(makeupDone / 5) * 100}%`;

  let testCnt = 0,
    presCnt = 0,
    assignCnt = 0,
    updCnt = 0;
  userEvaluations.forEach((ev) => {
    if (ev.type === "Class Test") testCnt++;
    if (ev.type === "Presentation") presCnt++;
    if (ev.type === "Assignment Deadline") assignCnt++;
    if (ev.type === "Update") updCnt++;
  });

  const sTest = document.getElementById("sum-tests-count");
  const sPres = document.getElementById("sum-pres-count");
  const sAssign = document.getElementById("sum-assign-count");
  const sUpd = document.getElementById("sum-upd-count");

  if (sTest) sTest.innerText = testCnt;
  if (sPres) sPres.innerText = presCnt;
  if (sAssign) sAssign.innerText = assignCnt;
  if (sUpd) sUpd.innerText = updCnt;

  const tracks = ["SAT", "SUN", "TUE", "WED"];
  const trackGrid = document.getElementById("track-cards-grid");
  if (trackGrid) {
    trackGrid.innerHTML = "";
    tracks.forEach((t) => {
      const trackClasses = ALL_CLASSES.filter((c) => c.track === t);
      const trackDone = trackClasses.filter((c) =>
        completedClasses.has(c.id),
      ).length;
      const trackPct = Math.round((trackDone / 12) * 100);

      const card = document.createElement("div");
      card.className =
        "bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4";

      // Restored 2x6 Class Boxes Grid matching Image 1
      card.innerHTML = `
        <div>
          <div class="flex justify-between items-center mb-2">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-400">${t} TRACK</span>
            <span class="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">${trackDone} / 12</span>
          </div>
          <h3 class="text-xl font-extrabold text-slate-900">${t} Track</h3>
          <p class="text-xs text-slate-500 mt-0.5">${12 - trackDone} classes remaining</p>
        </div>

        <div class="space-y-2">
          <div class="flex justify-between text-xs font-semibold">
            <span class="text-slate-500">Progress</span>
            <span class="text-slate-900 font-bold">${trackPct}%</span>
          </div>
          <div class="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div class="h-full bg-brand-600 rounded-full transition-all duration-500" style="width: ${trackPct}%"></div>
          </div>
        </div>

        <div class="grid grid-cols-6 gap-1.5 pt-2 border-t border-slate-100">
          ${trackClasses
            .map((c) => {
              const isC = completedClasses.has(c.id);
              return `
                <div title="${c.month} ${c.dayNum} (${c.dayName}) - ${isC ? "Completed" : "Pending"}" 
                     class="h-6 rounded-md flex items-center justify-center text-[10px] font-bold ${isC ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400 border border-slate-200"}">
                  ${c.classNo}
                </div>
              `;
            })
            .join("")}
        </div>
      `;
      trackGrid.appendChild(card);
    });
  }

  const timeline = document.getElementById("schedule-timeline");
  if (timeline) {
    timeline.innerHTML = "";
    ALL_CLASSES.forEach((c) => {
      const isDone = completedClasses.has(c.id);
      const item = document.createElement("div");
      item.className = `flex items-center justify-between p-2.5 rounded-xl border text-xs transition-colors ${isDone ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-200"}`;
      item.innerHTML = `
        <div class="flex items-center gap-3">
          <span class="font-bold text-slate-900 w-16">${c.month} ${c.dayNum}</span>
          <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-white border border-slate-200 text-slate-700">${c.dayName}</span>
          <span class="text-slate-600 font-medium">Track: <strong class="text-slate-800">${c.track}</strong> (#${c.classNo})</span>
        </div>
        <span class="font-semibold ${isDone ? "text-emerald-600" : "text-slate-400"}">
          ${isDone ? "Completed" : "Pending"}
        </span>
      `;
      timeline.appendChild(item);
    });
  }

  const makeupList = document.getElementById("makeup-schedule-list");
  if (makeupList) {
    makeupList.innerHTML = "";
    makeupClasses.forEach((c) => {
      const isDone = completedClasses.has(c.id);
      const item = document.createElement("div");
      item.className = `p-3 rounded-xl border flex items-center justify-between ${isDone ? "bg-emerald-50 border-emerald-200" : "bg-amber-50/50 border-amber-200"}`;
      item.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-lg bg-amber-100 text-amber-700">
            <i data-lucide="video" class="w-4 h-4"></i>
          </div>
          <div>
            <h4 class="font-bold text-xs text-slate-900">${c.month} ${c.dayNum} (${c.dayName})</h4>
            <p class="text-[11px] text-slate-500 mt-0.5">Counts as ${c.makeupFor} Class #${c.classNo}</p>
          </div>
        </div>
        <span class="px-3 py-1.5 rounded-lg text-xs font-semibold ${isDone ? "bg-emerald-600 text-white" : "bg-amber-100 text-amber-800"}">
          ${isDone ? "Completed" : "Upcoming"}
        </span>
      `;
      makeupList.appendChild(item);
    });
  }

  lucide.createIcons();
}

function openEvalModal(dateId, dateDisplay, event) {
  if (event) event.stopPropagation();
  const classObj = ALL_CLASSES.find((c) => c.id === dateId);

  // Prevent opening modal for past dates
  if (classObj && isDatePassed(classObj.dateStr)) {
    return;
  }

  const dId = document.getElementById("eval-date-id");
  const dStr = document.getElementById("eval-date-str");
  const dDisp = document.getElementById("eval-date-display");
  const modal = document.getElementById("eval-modal");

  if (dId) dId.value = dateId;
  if (dStr) dStr.value = classObj ? classObj.dateStr : "2026-10-27";
  if (dDisp) dDisp.value = dateDisplay;
  if (modal) modal.classList.remove("hidden");
}

function closeEvalModal() {
  const modal = document.getElementById("eval-modal");
  const form = document.getElementById("eval-form");
  if (modal) modal.classList.add("hidden");
  if (form) form.reset();
}

function saveEvaluation(e) {
  e.preventDefault();
  const dateId = document.getElementById("eval-date-id").value;
  const dateStr = document.getElementById("eval-date-str").value;
  const code = document.getElementById("eval-code").value.trim().toUpperCase();
  const title = document.getElementById("eval-course-title").value.trim();
  const type = document.getElementById("eval-type").value;
  const desc = document.getElementById("eval-desc").value.trim();

  const newEval = {
    id: "eval-" + Date.now(),
    dateId,
    dateStr,
    code,
    title,
    type,
    desc,
  };

  userEvaluations.push(newEval);
  saveState();
  closeEvalModal();
  renderCalendar();
  renderEvaluations();
  renderDashboard();
}

function openEditEvalModal(evalId, event) {
  if (event) event.stopPropagation();
  const ev = userEvaluations.find((e) => e.id === evalId);
  if (!ev) return;

  const classObj = ALL_CLASSES.find((c) => c.id === ev.dateId);
  const dateDisplay = classObj
    ? `${classObj.month} ${classObj.dayNum}, 2026`
    : ev.dateStr;

  document.getElementById("edit-eval-id").value = ev.id;
  document.getElementById("edit-eval-date-display").value = dateDisplay;
  document.getElementById("edit-eval-code").value = ev.code || "";
  document.getElementById("edit-eval-type").value = ev.type || "Class Test";
  document.getElementById("edit-eval-course-title").value = ev.title || "";
  document.getElementById("edit-eval-desc").value = ev.desc || "";

  const modal = document.getElementById("eval-edit-modal");
  if (modal) modal.classList.remove("hidden");
}

function closeEditEvalModal() {
  const modal = document.getElementById("eval-edit-modal");
  const form = document.getElementById("eval-edit-form");
  if (modal) modal.classList.add("hidden");
  if (form) form.reset();
}

function updateEvaluation(e) {
  e.preventDefault();
  const evalId = document.getElementById("edit-eval-id").value;
  const ev = userEvaluations.find((item) => item.id === evalId);

  if (ev) {
    ev.code = document
      .getElementById("edit-eval-code")
      .value.trim()
      .toUpperCase();
    ev.type = document.getElementById("edit-eval-type").value;
    ev.title = document.getElementById("edit-eval-course-title").value.trim();
    ev.desc = document.getElementById("edit-eval-desc").value.trim();

    saveState();
    renderCalendar();
    renderEvaluations();
    renderDashboard();
  }
  closeEditEvalModal();
}

function confirmDeleteEvaluation() {
  const evalId = document.getElementById("edit-eval-id").value;
  userEvaluations = userEvaluations.filter((e) => e.id !== evalId);
  saveState();
  closeEditEvalModal();
  renderCalendar();
  renderEvaluations();
  renderDashboard();
}

function openMeetingModal(tileId, dateDisplay, event) {
  if (event) event.stopPropagation();
  const classObj = ALL_CLASSES.find((c) => c.id === tileId);

  // Prevent adding meeting links for past dates
  if (classObj && isDatePassed(classObj.dateStr)) {
    return;
  }

  const mId = document.getElementById("meeting-tile-id");
  const mDisp = document.getElementById("meeting-tile-display");
  const mUrl = document.getElementById("meeting-url");
  const mAlias = document.getElementById("meeting-alias");
  const btnRemove = document.getElementById("btn-remove-link");
  const modal = document.getElementById("meeting-modal");

  if (mId) mId.value = tileId;
  if (mDisp) mDisp.value = dateDisplay;

  const existing = makeupMeetingLinks[tileId];
  if (existing) {
    if (mUrl) mUrl.value = existing.url || "";
    if (mAlias) mAlias.value = existing.alias || "";
    if (btnRemove) btnRemove.classList.remove("hidden");
  } else {
    if (mUrl) mUrl.value = "";
    if (mAlias) mAlias.value = "";
    if (btnRemove) btnRemove.classList.add("hidden");
  }

  if (modal) modal.classList.remove("hidden");
}

function closeMeetingModal() {
  const modal = document.getElementById("meeting-modal");
  const form = document.getElementById("meeting-form");
  if (modal) modal.classList.add("hidden");
  if (form) form.reset();
}

function saveMeetingLink(e) {
  e.preventDefault();
  const tileId = document.getElementById("meeting-tile-id").value;
  const url = document.getElementById("meeting-url").value.trim();
  const alias = document.getElementById("meeting-alias").value.trim();

  if (url) {
    makeupMeetingLinks[tileId] = { url, alias };
    saveState();
    renderCalendar();
  }
  closeMeetingModal();
}

function removeMeetingLink() {
  const tileId = document.getElementById("meeting-tile-id").value;
  if (makeupMeetingLinks[tileId]) {
    delete makeupMeetingLinks[tileId];
    saveState();
    renderCalendar();
  }
  closeMeetingModal();
}

function filterEvaluations(type) {
  currentEvalFilter = type;
  document.querySelectorAll(".eval-f-btn").forEach((btn) => {
    btn.className =
      "eval-f-btn px-3 py-1.5 rounded-lg text-xs font-medium border transition-all bg-white text-slate-600 border-slate-200 hover:bg-slate-50";
  });

  let btnId = "eval-filter-ALL";
  if (type === "Class Test") btnId = "eval-filter-Test";
  if (type === "Presentation") btnId = "eval-filter-Pres";
  if (type === "Assignment Deadline") btnId = "eval-filter-Assign";
  if (type === "Update") btnId = "eval-filter-Upd";

  const activeBtn = document.getElementById(btnId);
  if (activeBtn) {
    activeBtn.className =
      "eval-f-btn px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all bg-slate-800 text-white border-slate-800 shadow-sm";
  }
  renderEvaluations();
}

function setStatusFilter(status) {
  currentEvalStatusFilter = status;
  document.querySelectorAll(".eval-status-btn").forEach((btn) => {
    btn.className =
      "eval-status-btn px-3 py-1 rounded-xl text-xs font-semibold border transition-all bg-white text-slate-700 border-slate-200 hover:bg-slate-50";
  });

  const activeBtn = document.getElementById(`eval-status-${status}`);
  if (activeBtn) {
    activeBtn.className =
      "eval-status-btn px-3 py-1 rounded-xl text-xs font-bold border transition-all bg-brand-600 text-white border-brand-600 shadow-sm";
  }
  renderEvaluations();
}

function setUrgencyFilter(urgency) {
  currentEvalUrgencyFilter = urgency;
  document.querySelectorAll(".eval-urgency-btn").forEach((btn) => {
    btn.className =
      "eval-urgency-btn px-3 py-1 rounded-xl text-xs font-semibold border transition-all bg-white text-slate-700 border-slate-200 hover:bg-slate-50";
  });

  const activeBtn = document.getElementById(`eval-urgency-${urgency}`);
  if (activeBtn) {
    activeBtn.className =
      "eval-urgency-btn px-3 py-1 rounded-xl text-xs font-bold border transition-all bg-brand-600 text-white border-brand-600 shadow-sm";
  }
  renderEvaluations();
}

function toggleSection(secId) {
  const sec = document.getElementById(secId);
  const arrow = document.getElementById(secId + "-arrow");
  if (sec) {
    sec.classList.toggle("hidden");
    if (arrow) arrow.classList.toggle("rotate-180");
  }
}

function toggleExamDone(id) {
  if (completedExams.has(id)) {
    completedExams.delete(id);
  } else {
    completedExams.add(id);
  }
  saveState();
  renderEvaluations();
}

function renderEvaluations() {
  const container = document.getElementById("evaluations-list");
  const midContainer = document.getElementById("midterm-exam-list");
  const finalContainer = document.getElementById("final-exam-list");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Render Mid-Term Exams Schedule with Live Timers
  if (midContainer) {
    midContainer.innerHTML = "";
    MIDTERM_DAYS.forEach((d) => {
      const isDone = completedExams.has(d.id);
      const targetDate = new Date(d.dateStr);
      targetDate.setHours(0, 0, 0, 0);
      const diffDays = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));

      let urgencyClass =
        diffDays < 7
          ? "bg-rose-100 text-rose-800 border-rose-300 font-bold"
          : diffDays <= 14
            ? "bg-amber-100 text-amber-800 border-amber-300 font-bold"
            : "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold";
      let urgencyBadge =
        diffDays < 0
          ? "Passed"
          : diffDays === 0
            ? "Today"
            : `${diffDays} Days (${diffDays < 7 ? "Very Important" : diffDays <= 14 ? "Prepare" : "Plan"})`;

      const item = document.createElement("div");
      item.className = `p-3 rounded-xl border flex items-center justify-between text-xs ${isDone ? "bg-emerald-50 border-emerald-300 opacity-60" : "bg-white border-slate-200"}`;
      item.innerHTML = `
        <div class="flex items-center gap-3">
          <span class="font-bold text-slate-800">Day ${d.dayNo}: ${d.display}</span>
          <span class="px-2.5 py-0.5 rounded-lg border text-[10px] ${urgencyClass}">${urgencyBadge}</span>
        </div>
        <button onclick="toggleExamDone('${d.id}')" class="px-3.5 py-1.5 rounded-xl text-[11px] font-bold ${isDone ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}">
          ${isDone ? "Completed" : "Mark Done"}
        </button>
      `;
      midContainer.appendChild(item);
    });
  }

  // Render Final Exams Schedule with Live Timers
  if (finalContainer) {
    finalContainer.innerHTML = "";
    FINAL_DAYS.forEach((d) => {
      const isDone = completedExams.has(d.id);
      const targetDate = new Date(d.dateStr);
      targetDate.setHours(0, 0, 0, 0);
      const diffDays = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));

      let urgencyClass =
        diffDays < 7
          ? "bg-rose-100 text-rose-800 border-rose-300 font-bold"
          : diffDays <= 14
            ? "bg-amber-100 text-amber-800 border-amber-300 font-bold"
            : "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold";
      let urgencyBadge =
        diffDays < 0
          ? "Passed"
          : diffDays === 0
            ? "Today"
            : `${diffDays} Days (${diffDays < 7 ? "Very Important" : diffDays <= 14 ? "Prepare" : "Plan"})`;

      const item = document.createElement("div");
      item.className = `p-3 rounded-xl border flex items-center justify-between text-xs ${isDone ? "bg-emerald-50 border-emerald-300 opacity-60" : "bg-white border-slate-200"}`;
      item.innerHTML = `
        <div class="flex items-center gap-3">
          <span class="font-bold text-slate-800">Day ${d.dayNo}: ${d.display}</span>
          <span class="px-2.5 py-0.5 rounded-lg border text-[10px] ${urgencyClass}">${urgencyBadge}</span>
        </div>
        <button onclick="toggleExamDone('${d.id}')" class="px-3.5 py-1.5 rounded-xl text-[11px] font-bold ${isDone ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}">
          ${isDone ? "Completed" : "Mark Done"}
        </button>
      `;
      finalContainer.appendChild(item);
    });
  }

  if (!container) return;
  container.innerHTML = "";

  let filtered = [...userEvaluations];

  if (currentEvalFilter !== "ALL") {
    filtered = filtered.filter((e) => e.type === currentEvalFilter);
  }

  if (currentEvalStatusFilter === "UPCOMING") {
    filtered = filtered.filter((e) => !isDatePassed(e.dateStr));
  } else if (currentEvalStatusFilter === "COMPLETED") {
    filtered = filtered.filter((e) => isDatePassed(e.dateStr));
  }

  if (currentEvalUrgencyFilter !== "ALL") {
    filtered = filtered.filter((e) => {
      const targetDate = new Date(e.dateStr);
      targetDate.setHours(0, 0, 0, 0);
      const diffDays = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));

      if (currentEvalUrgencyFilter === "URGENT")
        return diffDays >= 0 && diffDays < 7;
      if (currentEvalUrgencyFilter === "PREPARE")
        return diffDays >= 7 && diffDays <= 14;
      if (currentEvalUrgencyFilter === "PLAN") return diffDays > 14;
      return true;
    });
  }

  const upcomingCount = userEvaluations.filter(
    (e) => !isDatePassed(e.dateStr),
  ).length;
  const navBadge = document.getElementById("nav-eval-badge");
  if (navBadge) {
    if (upcomingCount > 0) {
      navBadge.innerText = upcomingCount;
      navBadge.classList.remove("hidden");
    } else {
      navBadge.classList.add("hidden");
    }
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="bg-white p-8 text-center rounded-2xl border border-slate-200 shadow-sm">
        <div class="w-10 h-10 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-2">
          <i data-lucide="pen-tool" class="w-5 h-5"></i>
        </div>
        <h3 class="text-xs font-bold text-slate-800">No Assessments Match Filters</h3>
        <p class="text-[11px] text-slate-500 max-w-sm mx-auto mt-0.5">
          Click <strong>+ Assessment</strong> on any calendar tile to schedule custom class tests, presentations, or lab tasks.
        </p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  filtered
    .sort((a, b) => new Date(a.dateStr) - new Date(b.dateStr))
    .forEach((ev) => {
      const isPast = isDatePassed(ev.dateStr);
      const targetDate = new Date(ev.dateStr);
      targetDate.setHours(0, 0, 0, 0);
      const diffTime = targetDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let urgencyBadge = "";
      let urgencyClass = "";

      if (isPast) {
        urgencyClass =
          "bg-rose-100 text-rose-800 border-rose-300 font-extrabold";
        urgencyBadge = "Expired / Completed";
      } else if (diffDays === 0) {
        urgencyClass =
          "bg-rose-100 text-rose-800 border-rose-300 animate-pulse font-extrabold";
        urgencyBadge = "Due Today!";
      } else if (diffDays < 7) {
        urgencyClass = "bg-rose-100 text-rose-800 border-rose-300 font-bold";
        urgencyBadge = `${diffDays} Days Left (Urgent)`;
      } else if (diffDays <= 14) {
        urgencyClass = "bg-amber-100 text-amber-800 border-amber-300 font-bold";
        urgencyBadge = `${diffDays} Days Left (Prepare)`;
      } else {
        urgencyClass =
          "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold";
        urgencyBadge = `${diffDays} Days Left (Plan)`;
      }

      let typeBadge = "bg-rose-50 text-rose-700 border-rose-200";
      let iconName = "file-text";
      let iconBg =
        "bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-sm shadow-rose-500/30";

      if (ev.type === "Presentation") {
        typeBadge = "bg-indigo-50 text-indigo-700 border-indigo-200";
        iconName = "presentation";
        iconBg =
          "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-sm shadow-indigo-500/30";
      } else if (ev.type === "Assignment Deadline") {
        typeBadge = "bg-cyan-50 text-cyan-700 border-cyan-200";
        iconName = "clipboard";
        iconBg =
          "bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-sm shadow-cyan-500/30";
      } else if (ev.type === "Update") {
        typeBadge = "bg-amber-50 text-amber-700 border-amber-200";
        iconName = "alert-circle";
        iconBg =
          "bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-sm shadow-amber-500/30";
      }

      const item = document.createElement("div");
      item.className = `p-4 rounded-2xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none ${
        isPast
          ? "bg-rose-50/40 border-rose-200 opacity-80"
          : "bg-white border-slate-200 hover:border-brand-300 shadow-sm"
      }`;

      item.innerHTML = `
        <div class="flex items-start gap-3.5">
          <div class="p-2.5 rounded-xl ${isPast ? "bg-rose-600 text-white" : iconBg} shrink-0 mt-0.5 sm:mt-0">
            <i data-lucide="${iconName}" class="w-5 h-5"></i>
          </div>
          <div>
            <div class="flex flex-wrap items-center gap-2 mb-1">
              <span class="text-xs font-extrabold ${isPast ? "text-rose-950" : "text-slate-900"}">${ev.code}</span>
              ${ev.title ? `<span class="text-xs text-slate-500 font-medium">— ${ev.title}</span>` : ""}
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-md border ${typeBadge}">${ev.type}</span>
            </div>
            <h3 class="text-sm font-bold ${isPast ? "text-slate-700 line-through" : "text-slate-900"}">${ev.desc}</h3>
            <p class="text-xs text-slate-500 mt-0.5">Upcoming Date: <strong>${ev.dateStr}</strong></p>
          </div>
        </div>

        <div class="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
          <span class="px-2.5 py-1 rounded-xl border text-xs ${urgencyClass}">
            ${urgencyBadge}
          </span>

          <div class="flex items-center gap-2">
            ${
              isPast
                ? `<button disabled class="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed">
                    Completed
                   </button>`
                : `<button onclick="openEditEvalModal('${ev.id}', event)" class="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors">
                    Edit / Delete
                   </button>`
            }
          </div>
        </div>
      `;

      container.appendChild(item);
    });

  lucide.createIcons();
}

function renderEvents() {
  const container = document.getElementById("events-container");
  if (!container) return;
  container.innerHTML = "";

  const filtered = ACADEMIC_EVENTS.filter((evt) => {
    if (currentEventFilter === "ALL") return true;
    return evt.category === currentEventFilter;
  });

  filtered.forEach((evt) => {
    const isDone = completedEvents.has(evt.id);
    const item = document.createElement("div");

    let catBadge = "bg-slate-100 text-slate-700 border-slate-200";
    let iconName = "calendar";
    let iconBg =
      "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-sm shadow-indigo-500/30";

    if (evt.category === "EXAM") {
      catBadge = "bg-rose-100 text-rose-800 border-rose-200";
      iconName = "file-text";
      iconBg =
        "bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-sm shadow-rose-500/30";
    } else if (evt.category === "PAYMENT") {
      catBadge = "bg-emerald-100 text-emerald-800 border-emerald-200";
      iconName = "credit-card";
      iconBg =
        "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm shadow-emerald-500/30";
    } else if (evt.category === "HOLIDAY") {
      catBadge = "bg-amber-100 text-amber-800 border-amber-200";
      iconName = "sun";
      iconBg =
        "bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-sm shadow-amber-500/30";
    } else if (evt.category === "ACADEMIC") {
      catBadge = "bg-indigo-100 text-indigo-800 border-indigo-200";
      iconName = "clock";
      iconBg =
        "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-sm shadow-blue-500/30";
    }

    item.className = `p-4 rounded-2xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none ${
      isDone
        ? "bg-emerald-50/80 border-emerald-500 shadow-sm"
        : "bg-white border-slate-200 hover:border-brand-300"
    }`;

    item.innerHTML = `
      <div class="flex items-start gap-3.5">
        <div class="p-2.5 rounded-xl ${isDone ? "bg-emerald-600 text-white" : iconBg} shrink-0 mt-0.5 sm:mt-0">
          <i data-lucide="${iconName}" class="w-5 h-5"></i>
        </div>
        <div>
          <div class="flex flex-wrap items-center gap-2 mb-1">
            <span class="text-xs font-extrabold ${isDone ? "text-emerald-950" : "text-slate-900"}">${evt.dateDisplay} (${evt.dayName})</span>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-md border ${catBadge}">${evt.category}</span>
          </div>
          <h3 class="text-sm font-bold ${isDone ? "text-emerald-900 line-through" : "text-slate-900"}">${evt.title}</h3>
          <p class="text-xs ${isDone ? "text-emerald-700" : "text-slate-500"} mt-0.5">${evt.note}</p>
        </div>
      </div>

      <div class="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
        <span class="text-xs font-bold ${isDone ? "text-emerald-700" : "text-slate-400"}">
          ${isDone ? "Completed" : "Upcoming"}
        </span>
      </div>
    `;

    container.appendChild(item);
  });

  lucide.createIcons();
}

function openResetModal() {
  const modal = document.getElementById("reset-modal");
  if (modal) modal.classList.remove("hidden");
}

function closeResetModal() {
  const modal = document.getElementById("reset-modal");
  if (modal) modal.classList.add("hidden");
}

function confirmReset() {
  completedClasses.clear();
  completedEvents.clear();
  completedExams.clear();
  userEvaluations = [];
  makeupMeetingLinks = {};
  saveState();
  renderCalendar();
  renderDashboard();
  renderEvaluations();
  renderEvents();
  closeResetModal();
}

function syncPastClassesAndEvents() {
  ALL_CLASSES.forEach((c) => {
    if (isDatePassed(c.dateStr)) {
      completedClasses.add(c.id);
    }
  });

  ACADEMIC_EVENTS.forEach((evt) => {
    if (evt.dateStr && isDatePassed(evt.dateStr)) {
      completedEvents.add(evt.id);
    }
  });

  saveState();
}

// Initialize App
window.addEventListener("DOMContentLoaded", async () => {
  await initSyncCode();
  loadState();
  syncPastClassesAndEvents();
  renderCalendar();
  renderDashboard();
  renderEvaluations();
  renderEvents();
  updateNavigation();
  setupFirebaseSync();
  lucide.createIcons();
});

window.addEventListener("storage", () => {
  loadState();
  syncPastClassesAndEvents();
  renderCalendar();
  renderDashboard();
  renderEvaluations();
  renderEvents();
});

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    syncPastClassesAndEvents();
    renderCalendar();
    renderDashboard();
    renderEvaluations();
    renderEvents();
  }
});
