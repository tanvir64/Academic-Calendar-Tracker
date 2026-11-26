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
    dateStr: "2026-12-07",
    display: "Dec 7, 2026 (Mon)",
    dayNo: 2,
  },
  {
    id: "mid-3",
    dateStr: "2026-12-08",
    display: "Dec 8, 2026 (Tue)",
    dayNo: 3,
  },
  {
    id: "mid-4",
    dateStr: "2026-12-09",
    display: "Dec 9, 2026 (Wed)",
    dayNo: 4,
  },
  {
    id: "mid-5",
    dateStr: "2026-12-10",
    display: "Dec 10, 2026 (Thu)",
    dayNo: 5,
  },
  {
    id: "mid-6",
    dateStr: "2026-12-11",
    display: "Dec 11, 2026 (Fri)",
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
let studentExamEntries = {};
let facultyExamDuties = {};

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
const STUDENT_EXAMS_STORAGE_KEY = "calendar_263_student_exams_v1";
const FACULTY_DUTIES_STORAGE_KEY = "calendar_263_faculty_duties_v1";
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

    const savedStudentExams = localStorage.getItem(STUDENT_EXAMS_STORAGE_KEY);
    if (savedStudentExams) studentExamEntries = JSON.parse(savedStudentExams);

    const savedFacultyDuties = localStorage.getItem(FACULTY_DUTIES_STORAGE_KEY);
    if (savedFacultyDuties) facultyExamDuties = JSON.parse(savedFacultyDuties);
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
    localStorage.setItem(
      STUDENT_EXAMS_STORAGE_KEY,
      JSON.stringify(studentExamEntries),
    );
    localStorage.setItem(
      FACULTY_DUTIES_STORAGE_KEY,
      JSON.stringify(facultyExamDuties),
    );

    if (db && syncCode && !isRemoteUpdating) {
      db.ref("UIU_Calendar_263/sync_sessions/" + syncCode).set({
        completedClasses: [...completedClasses],
        completedEvents: [...completedEvents],
        completedExams: [...completedExams],
        userEvaluations,
        makeupMeetingLinks,
        studentExamEntries,
        facultyExamDuties,
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
      studentExamEntries = data.studentExamEntries || {};
      facultyExamDuties = data.facultyExamDuties || {};

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

  if (page === "calendar") {
    renderCalendar();
    scrollToCurrentDay();
  } else if (page === "dashboard") {
    renderDashboard();
    window.scrollTo({ top: 0, behavior: "auto" });
  } else if (page === "assessments") {
    renderEvaluations();
    window.scrollTo({ top: 0, behavior: "auto" });
  } else if (page === "events") {
    renderEvents();
    scrollToFirstPendingEvent();
  }

  updateNavigation();
}

function updateNavigation() {
  const navCal = document.getElementById("nav-calendar");
  const navDash = document.getElementById("nav-dashboard");
  const navEvt = document.getElementById("nav-events");
  const navEval = document.getElementById("nav-assessments");

  const inactiveStyle =
    "relative z-[2] flex flex-col items-center justify-center h-full w-full text-xs font-medium text-[#737373]";
  const activeStyle =
    "relative z-[2] flex flex-col items-center justify-center h-full w-full text-xs font-bold text-brand-700";

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

  positionNavPillIndicator();
}

function positionNavPillIndicator(immediate = false) {
  const pill = document.getElementById("nav-pill-indicator");
  const navMap = {
    calendar: "nav-calendar",
    dashboard: "nav-dashboard",
    assessments: "nav-assessments",
    events: "nav-events",
  };
  const activeBtn = document.getElementById(navMap[currentPage] || "nav-calendar");
  if (!pill || !activeBtn) return;

  if (!pill.style.opacity || pill.style.opacity === "0") {
    immediate = true;
  }

  if (immediate) {
    pill.style.transition = "none";
  }

  const centerX =
    activeBtn.offsetLeft + activeBtn.offsetWidth / 2 - pill.offsetWidth / 2;
  pill.style.transform = `translate3d(${centerX}px, 0, 0)`;
  pill.style.opacity = "1";

  if (immediate) {
    pill.offsetHeight; // force reflow before restoring transition
    pill.style.transition = "";
  }
}

window.addEventListener("resize", () => positionNavPillIndicator(true));

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateBackToTopVisibility() {
  const btn = document.getElementById("back-to-top-btn");
  if (!btn) return;
  const show = window.scrollY > 240;
  btn.classList.toggle("opacity-0", !show);
  btn.classList.toggle("pointer-events-none", !show);
  btn.classList.toggle("translate-y-2", !show);
}

window.addEventListener("scroll", updateBackToTopVisibility, { passive: true });

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

// Check if Date and Cutoff Time (4:30 PM / 16:30) Have Passed
function isDatePassed(dateStr) {
  const now = new Date();

  // Set target class date with 4:30 PM (16:30:00) cutoff time
  const targetCutoff = new Date(dateStr);
  targetCutoff.setHours(16, 30, 0, 0);

  return now >= targetCutoff;
}

function isTodayDate(dateStr) {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return dateStr === `${yyyy}-${mm}-${dd}`;
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

  // Map month key to Year-Month (YYYY-MM) for exact date checking
  const monthDates = {
    OCT: { year: 2026, monthIndex: 9 }, // October (0-indexed 9)
    NOV: { year: 2026, monthIndex: 10 }, // November (0-indexed 10)
    DEC: { year: 2026, monthIndex: 11 }, // December (0-indexed 11)
    JAN: { year: 2027, monthIndex: 0 }, // January (0-indexed 0)
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

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonthIdx = now.getMonth();

  let activeFilterTotal = 0;
  let activeFilterCompleted = 0;

  // Track if we have flagged the first pending/upcoming class globally across the calendar grid
  let foundFirstPendingInCalendar = false;

  months.forEach((m) => {
    const monthClasses = ALL_CLASSES.filter((c) => c.month === m);

    const filteredClasses = monthClasses.filter((c) => {
      if (currentFilter === "ALL") return true;
      if (currentFilter === "MAKEUP") return c.isMakeup;
      if (currentFilter === "SAT-TUE")
        return c.track === "SAT" || c.track === "TUE";
      if (currentFilter === "SUN-WED")
        return c.track === "SUN" || c.track === "WED";
      return c.track === currentFilter;
    });

    if (filteredClasses.length === 0 && currentFilter !== "ALL") return;

    const monthTotalCount = filteredClasses.length;
    const monthCompletedCount = filteredClasses.filter((c) =>
      completedClasses.has(c.id),
    ).length;
    const monthUpcomingCount = monthTotalCount - monthCompletedCount;

    activeFilterTotal += monthTotalCount;
    activeFilterCompleted += monthCompletedCount;

    // Check month status: Is Current Month vs Past Month
    const targetMonthObj = monthDates[m];
    const isCurrentMonth =
      currentYear === targetMonthObj.year &&
      currentMonthIdx === targetMonthObj.monthIndex;

    // Month is ended if target year/month is earlier than current year/month
    const isMonthEnded =
      targetMonthObj.year < currentYear ||
      (targetMonthObj.year === currentYear &&
        targetMonthObj.monthIndex < currentMonthIdx);

    const endedMonthBadgeHtml = isMonthEnded
      ? `<span class="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-slate-950 px-2.5 py-0.5 rounded-full shadow-sm">Completed</span>`
      : ``;

    const theme = monthThemeMap[m];
    const monthSection = document.createElement("div");
    monthSection.id = `month-card-${m}`;
    monthSection.className = `rounded-3xl border-2 shadow-sm p-5 space-y-4 ${theme.cardBg}`;

    // Header Badges
    const currentMonthBadgeHtml = isCurrentMonth
      ? `<span class="text-[10px] font-black uppercase tracking-wider bg-blue-300 text-slate-950 px-2.5 py-0.5 rounded-full shadow-sm">Current Month</span>`
      : ``;

    monthSection.innerHTML = `
      <button onclick="toggleSection('month-sec-${m}')" class="w-full flex items-center justify-between bg-gradient-to-r ${theme.headerGrad} p-3.5 rounded-2xl shadow-sm cursor-pointer hover:opacity-95 transition-opacity">
        <div class="flex items-center gap-2.5">
          <i data-lucide="calendar" class="w-5 h-5 opacity-90"></i>
          <h2 class="text-base font-extrabold tracking-wide">${monthTitles[m]}</h2>
          ${currentMonthBadgeHtml}
          ${endedMonthBadgeHtml}
          <span class="text-[11px] font-bold bg-white/20 backdrop-blur-md text-white px-2.5 py-0.5 rounded-full border border-white/30">${monthUpcomingCount} Upcoming</span>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-xs font-bold bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-xl border border-white/30">${monthCompletedCount} / ${monthTotalCount} Done</span>
          <i id="month-sec-${m}-arrow" data-lucide="chevron-down" class="w-5 h-5 transform transition-transform ${isMonthEnded ? "" : "rotate-180"}"></i>
        </div>
      </button>
      <div id="month-sec-${m}" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-3.5 transition-all ${isMonthEnded ? "hidden" : ""}"></div>
    `;

    container.appendChild(monthSection);
    const grid = document.getElementById(`month-sec-${m}`);

    filteredClasses.forEach((item) => {
      const isDone = completedClasses.has(item.id);
      const isPast = isDatePassed(item.dateStr);
      const isOngoing = !isDone && !isPast && isTodayDate(item.dateStr);
      const dayEvals = userEvaluations.filter((e) => e.dateId === item.id);
      const linkData = makeupMeetingLinks[item.id];

      // Check if this card is the very first upcoming/pending class (after today's ongoing class)
      let isFirstPendingItem = false;
      if (!isDone && !isPast && !isOngoing && !foundFirstPendingInCalendar) {
        isFirstPendingItem = true;
        foundFirstPendingInCalendar = true;
      }

      const card = document.createElement("div");
      if (isTodayDate(item.dateStr)) {
        card.dataset.today = "true";
      }
      if (isOngoing) {
        card.id = "ongoing-calendar-tile";
      } else if (isFirstPendingItem) {
        card.id = "first-pending-calendar-tile";
      }

      // Accent border for ongoing / first pending item
      let borderStyle = isDone
        ? "border-emerald-500 bg-emerald-50/80 shadow-sm"
        : isOngoing
          ? "border-violet-400 bg-violet-50/60 shadow-sm border-l-4 border-l-violet-600"
          : isFirstPendingItem
            ? "border-blue-400 bg-gradient-to-br from-blue-50/90 via-white to-blue-50/40 shadow-sm border-l-4 border-l-blue-500"
            : item.isMakeup
              ? "border-amber-300 bg-amber-50/60 hover:bg-amber-100/70"
              : "border-slate-200 bg-white hover:border-brand-300 hover:shadow-sm";

      card.className = `relative flex flex-col justify-between p-3 sm:p-3.5 rounded-xl border transition-colors select-none min-w-0 ${borderStyle}`;

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
          <div class="flex items-center justify-between gap-1.5 mb-2 flex-wrap">
            <div class="flex items-center gap-1.5 min-w-0">
              <span class="text-xs font-semibold ${isDone ? "text-emerald-900" : isOngoing ? "text-violet-950 font-semibold" : isFirstPendingItem ? "text-amber-950 font-semibold" : "text-slate-900"}">${item.month} ${item.dayNum}</span>
              ${isOngoing ? `<span class="ongoing-badge px-1.5 py-0.5 rounded text-[10px] font-medium text-white">Ongoing</span>` : isFirstPendingItem ? `<span class="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500 text-white">Next up</span>` : ``}
            </div>
            <span class="text-[10px] font-medium px-2 py-0.5 rounded-md ${trackBadgeClass} shrink-0">${item.dayName}</span>
          </div>

          <div class="space-y-1">
            <span class="text-xs ${isDone ? "text-emerald-700" : "text-slate-500"} font-medium block">
              Track: <strong class="${isDone ? "text-emerald-900" : "text-slate-800"}">${item.track}</strong> 
              <span class="text-[11px] font-bold text-brand-700 bg-brand-50 px-1.5 py-0.5 rounded border border-brand-200/60 ml-0.5">#${item.classNo}/12</span>
            </span>                  

            ${item.isMakeup
          ? `<div class="flex items-center justify-between pt-0.5">
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

        <div class="mt-3 pt-2 border-t ${isDone ? "border-emerald-200" : "border-slate-100"} flex items-center justify-between gap-2 flex-wrap">
          ${isPast || isDone
          ? `<button disabled class="text-[10px] font-bold text-slate-400 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded cursor-not-allowed flex items-center gap-0.5">
                  <i data-lucide="lock" class="w-3 h-3"></i> Locked
                 </button>`
          : `<button onclick="openEvalModal('${item.id}', '${item.month} ${item.dayNum}, 2026', event)" class="text-[10px] font-bold text-brand-600 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 px-2.5 py-1 rounded transition-colors flex items-center gap-0.5">
                  <i data-lucide="plus" class="w-3 h-3"></i> Assessment
                 </button>`
        }
          ${isPast || isDone
          ? `<span class="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200">Completed</span>`
          : isOngoing
            ? `<span class="ongoing-status-pill text-[10px] font-semibold px-2 py-0.5 rounded-md">Ongoing</span>`
            : isFirstPendingItem
              ? `<span class="nextup-status-pill text-[10px] font-semibold px-2 py-0.5 rounded-md">Next Up</span>`
              : `<span class="text-[10px] font-semibold text-slate-400">Scheduled</span>`
        }
        </div>
      `;
      grid.appendChild(card);
    });
  });

  const qComp = document.getElementById("quick-completed-count");
  const qRem = document.getElementById("quick-remaining-count");
  if (qComp) qComp.innerText = activeFilterCompleted;
  if (qRem) qRem.innerText = activeFilterTotal - activeFilterCompleted;

  renderExamPlanningBanner();
  lucide.createIcons();
}

function scrollToCurrentDay() {
  const months = ["OCT", "NOV", "DEC", "JAN"];
  const monthDates = {
    OCT: { year: 2026, monthIndex: 9 },
    NOV: { year: 2026, monthIndex: 10 },
    DEC: { year: 2026, monthIndex: 11 },
    JAN: { year: 2027, monthIndex: 0 },
  };

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonthIdx = now.getMonth();

  const currentMonthKey = months.find((m) => {
    const obj = monthDates[m];
    return obj.year === currentYear && obj.monthIndex === currentMonthIdx;
  });

  // Prefer today's class tile, then the next upcoming class tile, then the current month card
  const targetEl =
    document.querySelector('#calendar-container [data-today="true"]') ||
    document.getElementById("ongoing-calendar-tile") ||
    document.getElementById("first-pending-calendar-tile") ||
    (currentMonthKey ? document.getElementById(`month-card-${currentMonthKey}`) : null);

  if (targetEl) {
    setTimeout(() => {
      const headerEl = document.querySelector("header");
      const headerOffset =
        (headerEl ? headerEl.getBoundingClientRect().height : 80) + 16;
      const elementPosition = targetEl.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: "smooth",
      });
    }, 100);
  }
}

// Each class item now belongs to its single track and paired track (pairedTrack)
// Example mapping for SAT & TUE days:
// SAT days -> track: "SAT", pairedTrack: "SAT-TUE"
// SUN days -> track: "SUN", pairedTrack: "SUN-WED"
// TUE days -> track: "TUE", pairedTrack: "SAT-TUE"
// WED days -> track: "WED", pairedTrack: "SUN-WED"

// Compute class sequence numbers dynamically for 24-class tracks:
function getPairedClassNo(item) {
  const pairedClasses = ALL_CLASSES.filter(
    (c) => c.pairedTrack === item.pairedTrack,
  );
  return pairedClasses.findIndex((c) => c.id === item.id) + 1;
}

function renderDashboardTimeline() {
  const container = document.getElementById("timeline-container");
  if (!container) return;
  container.innerHTML = "";

  let foundFirstPending = false;

  ALL_CLASSES.forEach((item) => {
    const isPast = isDatePassed(item.dateStr);
    const isDone = completedClasses.has(item.id) || isPast;
    const isOngoing = !isDone && isTodayDate(item.dateStr);

    const row = document.createElement("div");
    let isFirstPendingItem = false;

    // Check if this is the first upcoming/pending item (after today's ongoing class)
    if (isOngoing) {
      row.id = "ongoing-timeline-item";
    } else if (!isDone && !foundFirstPending) {
      row.id = "first-pending-timeline-item";
      foundFirstPending = true;
      isFirstPendingItem = true;
    }

    row.className = `p-3 rounded-xl border flex items-center justify-between gap-3 text-xs font-semibold transition-all ${isDone
        ? "bg-emerald-50/70 border-emerald-200 text-emerald-900"
        : isOngoing
          ? "bg-violet-50/70 border-violet-300 text-slate-900 border-l-4 border-l-violet-600"
          : isFirstPendingItem
            ? "bg-gradient-to-r from-amber-50/90 via-white to-white border-amber-300 text-slate-900 shadow-md shadow-amber-500/10 ring-2 ring-amber-400/50 animate-pulse border-l-4 border-l-amber-500"
            : "bg-white border-slate-200 text-slate-800 shadow-2xs"
      }`;

    row.innerHTML = `
      <div class="flex items-center gap-3">
        <span class="font-extrabold w-14 ${isDone ? "text-emerald-950" : isOngoing ? "text-violet-950" : isFirstPendingItem ? "text-amber-950 font-black" : "text-slate-900"}">${item.month} ${item.dayNum}</span>
        <span class="text-[10px] font-bold px-2 py-0.5 rounded ${isOngoing ? "bg-violet-100 border border-violet-300 text-violet-900" : isFirstPendingItem ? "bg-amber-100 border border-amber-300 text-amber-900" : "bg-slate-100 border border-slate-200 text-slate-700"}">${item.dayName}</span>
        <span class="text-slate-500">Track: <strong>${item.track}</strong> (#${item.classNo})</span>
      </div>
      <div>
        ${isDone
        ? `<span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">Completed</span>`
        : isOngoing
          ? `<span class="ongoing-badge px-2.5 py-0.5 rounded-md text-[10px] font-bold text-white">Ongoing</span>`
          : isFirstPendingItem
            ? `<span class="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-500 text-white shadow-xs">Next Up</span>`
            : `<span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">Scheduled</span>`
      }
      </div>
    `;

    container.appendChild(row);
  });

  // Automatically scroll the timeline container to the highlighted item
  setTimeout(() => {
    const targetItem =
      document.getElementById("ongoing-timeline-item") ||
      document.getElementById("first-pending-timeline-item");
    if (targetItem && container) {
      container.scrollTo({
        top: targetItem.offsetTop - container.offsetTop - 8,
        behavior: "smooth",
      });
    }
  }, 100);
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

  const trackConfigs = [
    {
      id: "SAT",
      name: "SAT Track",
      total: 12,
      cols: "grid-cols-6",
      tracks: ["SAT"],
    },
    {
      id: "SUN",
      name: "SUN Track",
      total: 12,
      cols: "grid-cols-6",
      tracks: ["SUN"],
    },
    {
      id: "TUE",
      name: "TUE Track",
      total: 12,
      cols: "grid-cols-6",
      tracks: ["TUE"],
    },
    {
      id: "WED",
      name: "WED Track",
      total: 12,
      cols: "grid-cols-6",
      tracks: ["WED"],
    },
    {
      id: "SAT-TUE",
      name: "SAT/TUE Track",
      total: 24,
      cols: "grid-cols-12",
      isPaired: true,
      tracks: ["SAT", "TUE"],
    },
    {
      id: "SUN-WED",
      name: "SUN/WED Track",
      total: 24,
      cols: "grid-cols-12",
      isPaired: true,
      tracks: ["SUN", "WED"],
    },
  ];

  const trackGrid = document.getElementById("track-cards-grid");
  if (!trackGrid) return;
  trackGrid.innerHTML = "";

  trackConfigs.forEach((config) => {
    // Collect all class objects matching single or combined track days
    const trackClasses = ALL_CLASSES.filter((c) =>
      config.tracks.includes(c.track),
    );

    // Calculate completed count dynamically
    const trackDone = trackClasses.filter((c) =>
      completedClasses.has(c.id),
    ).length;
    const remainingCount = config.total - trackDone;
    const trackPct = Math.round((trackDone / config.total) * 100);

    const card = document.createElement("div");
    card.className = `bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 ${config.isPaired ? "md:col-span-2 lg:col-span-2" : ""
      }`;

    card.innerHTML = `
      <div>
        <div class="flex justify-between items-center mb-2">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-400">${config.id} TRACK</span>
          <span class="text-xs font-bold ${trackDone > 0
        ? "text-emerald-700 bg-emerald-50 border border-emerald-200"
        : "text-slate-900 bg-slate-100"
      } px-2.5 py-0.5 rounded-md">${trackDone} / ${config.total}</span>
        </div>
        <h3 class="text-xl font-extrabold text-slate-900">${config.name}</h3>
        <p class="text-xs text-slate-500 mt-0.5">${remainingCount} class${remainingCount === 1 ? "" : "es"} remaining</p>
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

      <div class="grid ${config.cols} gap-1.5 pt-2 border-t border-slate-100">
        ${trackClasses
        .map((c, idx) => {
          const isC = completedClasses.has(c.id);
          const classNum = idx + 1;
          return `
              <div title="${c.month} ${c.dayNum} (${c.dayName}) - Class #${classNum} - ${isC ? "Completed" : "Pending"}" 
                   class="h-6 rounded-md flex items-center justify-center text-[10px] font-bold transition-colors ${isC
              ? "bg-emerald-500 text-white shadow-xs"
              : "bg-slate-100 text-slate-400 border border-slate-200"
            }">
                ${classNum}
              </div>
            `;
        })
        .join("")}
      </div>
    `;

    trackGrid.appendChild(card);
  });
  // Add inside renderDashboard()
  renderDashboardTimeline();

  const timeline = document.getElementById("schedule-timeline");
  if (timeline) {
    timeline.innerHTML = "";
    let foundFirstPending = false;

    ALL_CLASSES.forEach((c) => {
      const isPast = isDatePassed(c.dateStr);
      const isDone = completedClasses.has(c.id) || isPast;
      const isOngoing = !isDone && isTodayDate(c.dateStr);

      const item = document.createElement("div");
      let isFirstPendingItem = false;

      // Identify and flag today's ongoing class and the first upcoming/pending item
      if (isOngoing) {
        item.id = "ongoing-timeline-item";
      } else if (!isDone && !foundFirstPending) {
        item.id = "first-pending-timeline-item";
        foundFirstPending = true;
        isFirstPendingItem = true;
      }

      item.className = `flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all ${isDone
          ? "bg-emerald-50/70 border-emerald-200 text-emerald-900"
          : isOngoing
            ? "bg-violet-50/70 border-violet-300 text-slate-900 border-l-4 border-l-violet-600"
            : isFirstPendingItem
              ? "bg-gradient-to-r from-amber-50/90 via-white to-white border-amber-300 text-slate-900 shadow-md shadow-amber-500/10 ring-2 ring-amber-400/50 border-l-4 border-l-amber-500"
              : "bg-slate-50 border-slate-200 text-slate-800"
        }`;

      item.innerHTML = `
        <div class="flex items-center gap-3">
          <span class="font-extrabold w-16 ${isDone ? "text-emerald-950" : isOngoing ? "text-violet-950" : isFirstPendingItem ? "text-amber-950 font-black" : "text-slate-900"}">${c.month} ${c.dayNum}</span>
          <span class="px-2 py-0.5 rounded text-[10px] font-bold ${isOngoing ? "bg-violet-100 border border-violet-300 text-violet-900" : isFirstPendingItem ? "bg-amber-100 border border-amber-300 text-amber-900" : "bg-white border border-slate-200 text-slate-700"}">${c.dayName}</span>
          <span class="text-slate-600 font-medium">Track: <strong class="text-slate-800">${c.track}</strong> (#${c.classNo})</span>
        </div>
        <div>
          ${isDone
          ? `<span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">Completed</span>`
          : isOngoing
            ? `<span class="ongoing-badge px-2.5 py-0.5 rounded-md text-[10px] font-bold text-white">Ongoing</span>`
            : isFirstPendingItem
              ? `<span class="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-500 text-white shadow-xs">Next Up</span>`
              : `<span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">Scheduled</span>`
        }
        </div>
      `;

      timeline.appendChild(item);
    });

    // Auto-scroll the timeline container to today's ongoing class or the first pending item
    setTimeout(() => {
      const targetItem =
        document.getElementById("ongoing-timeline-item") ||
        document.getElementById("first-pending-timeline-item");
      if (targetItem && timeline) {
        timeline.scrollTo({
          top: targetItem.offsetTop - timeline.offsetTop - 8,
          behavior: "smooth",
        });
      }
    }, 100);
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
  if (type === "Exam/Duty") btnId = "eval-filter-ExamDuty";

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

function shouldExpandExamSchedule(daysList) {
  if (!daysList || daysList.length === 0) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startDate = new Date(daysList[0].dateStr);
  startDate.setHours(0, 0, 0, 0);
  const daysUntilStart = Math.ceil((startDate - today) / (1000 * 60 * 60 * 24));

  const lastDayStr = daysList[daysList.length - 1].dateStr;
  return daysUntilStart <= 10 && !isDatePassed(lastDayStr);
}

// Render the dynamic banner in the Calendar tab:
// If an exam is ≤10 days away, show a clickable planning prompt; otherwise show auto-sync info.
function renderExamPlanningBanner() {
  const banner = document.getElementById("calendar-banner");
  if (!banner) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  function getExamInfo(daysList, label, sectionId) {
    if (!daysList || daysList.length === 0) return null;
    const startDate = new Date(daysList[0].dateStr);
    startDate.setHours(0, 0, 0, 0);
    const lastDayStr = daysList[daysList.length - 1].dateStr;
    if (isDatePassed(lastDayStr)) return null; // exam already over
    const daysUntil = Math.ceil((startDate - today) / (1000 * 60 * 60 * 24));
    if (daysUntil > 10) return null;
    return { label, sectionId, daysUntil };
  }

  const midInfo = getExamInfo(MIDTERM_DAYS, "Mid-Term Examinations", "midterm-section");
  const finInfo = getExamInfo(FINAL_DAYS, "Final Examinations", "final-section");

  // Pick the nearer exam, or both if both qualify
  const exams = [midInfo, finInfo].filter(Boolean);
  exams.sort((a, b) => a.daysUntil - b.daysUntil);

  if (exams.length === 0) {
    // Show default auto-sync banner
    banner.innerHTML = `
      <div class="bg-[#ffffff] border border-[#171717]/[0.08] rounded-xl px-4 py-3 text-xs text-[#525252] flex items-center justify-between gap-3">
        <div class="flex items-center gap-2.5">
          <span class="w-2 h-2 rounded-full bg-[#16a34a] shrink-0"></span>
          <span class="leading-relaxed">
            <strong class="text-[#171717] font-medium">Automatic past completion sync:</strong>
            Dates that have passed (after 4:30 PM BDT) are marked completed automatically.
          </span>
        </div>
        <span class="font-mono text-[11px] text-[#737373] shrink-0">Auto-synced</span>
      </div>`;
  } else {
    let html = "";
    exams.forEach((exam) => {
      const daysText = exam.daysUntil <= 0
        ? "happening now"
        : exam.daysUntil === 1
          ? "starts tomorrow"
          : `starts in ${exam.daysUntil} days`;

      html += `
        <button onclick="navigateToExamSection('${exam.sectionId}')"
          class="w-full bg-[#ffffff] border border-[#d97706]/30 rounded-xl px-4 py-3.5 text-xs text-[#525252] flex items-center justify-between gap-3 hover:bg-[#fffbeb] hover:border-[#d97706]/50 transition-colors duration-150 cursor-pointer group">
          <div class="flex items-center gap-2.5">
            <span class="w-2 h-2 rounded-full bg-[#d97706] shrink-0"></span>
            <span class="leading-relaxed">
              <strong class="text-[#171717] font-medium">${exam.label}</strong>
              <span class="text-[#d97706] font-medium ml-1">${daysText}</span>
              <span class="text-[#737373] mx-1">—</span>
              <span class="text-[#0284c7] font-medium group-hover:underline">Plan your exam schedule →</span>
            </span>
          </div>
          <span class="font-mono text-[11px] text-[#d97706] tabular-nums shrink-0 bg-[#fef3c7] px-2 py-0.5 rounded-md border border-[#d97706]/20">${exam.daysUntil <= 0 ? "Now" : exam.daysUntil + "d"}</span>
        </button>`;
    });
    banner.innerHTML = `<div class="space-y-2">${html}</div>`;
  }

  lucide.createIcons();
}

function navigateToExamSection(sectionId) {
  // Switch to Assessments tab
  switchPage("assessments");

  // Expand the target exam section
  setTimeout(() => {
    const sec = document.getElementById(sectionId);
    const arrow = document.getElementById(sectionId + "-arrow");
    if (sec && sec.classList.contains("hidden")) {
      sec.classList.remove("hidden");
      if (arrow) arrow.classList.add("rotate-180");
    }
    // Scroll to it
    if (sec) {
      const headerEl = document.querySelector("header");
      const headerOffset = (headerEl ? headerEl.getBoundingClientRect().height : 80) + 16;
      const parent = sec.closest(".glass-card");
      const target = parent || sec;
      const top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    }
  }, 150);
}

// Placeholder upload handlers (no processing logic — UI-only stubs)
function handleScheduleUpload(input, examType) {
  if (!input.files || !input.files[0]) return;
  const file = input.files[0];
  const preview = document.getElementById(examType + "-upload-preview");
  const nameEl = document.getElementById(examType + "-upload-name");
  if (preview && nameEl) {
    nameEl.textContent = file.name;
    preview.classList.remove("hidden");
  }
  lucide.createIcons();
}

function clearScheduleUpload(examType) {
  const preview = document.getElementById(examType + "-upload-preview");
  if (preview) preview.classList.add("hidden");
  // Reset the file input
  const section = examType === "midterm" ? "midterm-section" : "final-section";
  const sec = document.getElementById(section);
  if (sec) {
    const fileInput = sec.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = "";
  }
}

function applyDefaultExamSectionState() {
  [
    { secId: "midterm-section", days: MIDTERM_DAYS },
    { secId: "final-section", days: FINAL_DAYS },
  ].forEach(({ secId, days }) => {
    const sec = document.getElementById(secId);
    const arrow = document.getElementById(secId + "-arrow");
    if (!sec) return;
    const expand = shouldExpandExamSchedule(days);
    sec.classList.toggle("hidden", !expand);
    if (arrow) arrow.classList.toggle("rotate-180", expand);
  });
}

function findExamDayById(dayId) {
  return [...MIDTERM_DAYS, ...FINAL_DAYS].find((d) => d.id === dayId);
}

function openStudentExamModal(dayId) {
  const day = findExamDayById(dayId);
  if (!day) return;
  document.getElementById("student-exam-day-id").value = day.id;
  document.getElementById("student-exam-day-display").value =
    `Day ${day.dayNo}: ${day.display}`;
  document.getElementById("student-exam-course").value = "";
  document.getElementById("student-exam-slot").selectedIndex = 0;
  const modal = document.getElementById("student-exam-modal");
  if (modal) modal.classList.remove("hidden");
}

function closeStudentExamModal() {
  const modal = document.getElementById("student-exam-modal");
  if (modal) modal.classList.add("hidden");
}

function saveStudentExam(event) {
  event.preventDefault();
  const dayId = document.getElementById("student-exam-day-id").value;
  const course = document.getElementById("student-exam-course").value.trim();
  const slot = document.getElementById("student-exam-slot").value;
  if (!dayId || !course || !slot) return;

  if (!Array.isArray(studentExamEntries[dayId])) {
    studentExamEntries[dayId] = [];
  }
  studentExamEntries[dayId].push({
    id: "se-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6),
    course,
    slot,
  });

  saveState();
  closeStudentExamModal();
  renderEvaluations();
}

function removeStudentExam(dayId, entryId) {
  if (!Array.isArray(studentExamEntries[dayId])) return;
  studentExamEntries[dayId] = studentExamEntries[dayId].filter(
    (entry) => entry.id !== entryId,
  );
  if (studentExamEntries[dayId].length === 0) {
    delete studentExamEntries[dayId];
  }
  saveState();
  renderEvaluations();
}

function syncFacultyDutySlotCheckboxes() {
  const countInput = document.getElementById("faculty-duty-count");
  let maxCount = parseInt(countInput ? countInput.value : "1", 10);
  if (isNaN(maxCount) || maxCount < 1) maxCount = 1;
  if (maxCount > 3) maxCount = 3;

  const checkboxes = Array.from(
    document.querySelectorAll('input[name="faculty-duty-slot"]'),
  );
  let checkedBoxes = checkboxes.filter((cb) => cb.checked);

  // If duty count was lowered below current selections, uncheck extras from the end
  while (checkedBoxes.length > maxCount) {
    const extra = checkedBoxes.pop();
    if (extra) extra.checked = false;
  }

  const atLimit = checkedBoxes.length >= maxCount;
  checkboxes.forEach((cb) => {
    const shouldDisable = atLimit && !cb.checked;
    cb.disabled = shouldDisable;
    const label = cb.closest("label");
    if (label) {
      label.classList.toggle("opacity-50", shouldDisable);
      label.classList.toggle("cursor-not-allowed", shouldDisable);
    }
  });

  const hint = document.getElementById("faculty-duty-slot-hint");
  if (hint) {
    hint.textContent = `(Select ${maxCount} slot${maxCount === 1 ? "" : "s"} — ${checkedBoxes.length}/${maxCount} selected)`;
  }
}

function openFacultyDutyModal(dayId) {
  const day = findExamDayById(dayId);
  if (!day) return;
  document.getElementById("faculty-duty-day-id").value = day.id;
  document.getElementById("faculty-duty-day-display").value =
    `Day ${day.dayNo}: ${day.display}`;

  const existing = facultyExamDuties[dayId];
  document.getElementById("faculty-duty-count").value = existing
    ? existing.count
    : 1;

  const checkboxes = document.querySelectorAll(
    'input[name="faculty-duty-slot"]',
  );
  checkboxes.forEach((cb) => {
    cb.checked = existing && Array.isArray(existing.slots)
      ? existing.slots.includes(cb.value)
      : false;
  });

  syncFacultyDutySlotCheckboxes();

  const clearBtn = document.getElementById("btn-clear-faculty-duty");
  if (clearBtn) clearBtn.classList.toggle("hidden", !existing);

  const modal = document.getElementById("faculty-duty-modal");
  if (modal) modal.classList.remove("hidden");
}

function closeFacultyDutyModal() {
  const modal = document.getElementById("faculty-duty-modal");
  if (modal) modal.classList.add("hidden");
}

function saveFacultyDuty(event) {
  event.preventDefault();
  const dayId = document.getElementById("faculty-duty-day-id").value;
  const count = parseInt(
    document.getElementById("faculty-duty-count").value,
    10,
  );
  const selectedSlots = Array.from(
    document.querySelectorAll('input[name="faculty-duty-slot"]:checked'),
  ).map((cb) => cb.value);

  if (!dayId || isNaN(count) || count < 1 || count > 3) return;
  if (selectedSlots.length !== count) {
    alert(
      `Please select exactly ${count} duty time slot${count === 1 ? "" : "s"}.`,
    );
    return;
  }

  facultyExamDuties[dayId] = {
    count,
    slots: selectedSlots,
  };

  saveState();
  closeFacultyDutyModal();
  renderEvaluations();
}

function clearFacultyDuty() {
  const dayId = document.getElementById("faculty-duty-day-id").value;
  if (dayId && facultyExamDuties[dayId]) {
    delete facultyExamDuties[dayId];
    saveState();
  }
  closeFacultyDutyModal();
  renderEvaluations();
}

function renderExamDaysList(containerEl, daysList, today) {
  if (!containerEl) return;
  containerEl.innerHTML = "";

  daysList.forEach((d) => {
    const isDone = completedExams.has(d.id) || isDatePassed(d.dateStr);
    const targetDate = new Date(d.dateStr);
    targetDate.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));

    const urgencyClass =
      diffDays < 7
        ? "bg-rose-100 text-rose-800 border-rose-300 font-medium"
        : diffDays <= 14
          ? "bg-amber-100 text-amber-800 border-amber-300 font-medium"
          : "bg-emerald-100 text-emerald-800 border-emerald-300 font-medium";
    const urgencyBadge = isDone
      ? "Completed (Auto)"
      : diffDays < 0
        ? "Passed"
        : diffDays === 0
          ? "Today"
          : `${diffDays} Days (${diffDays < 7 ? "Very Important" : diffDays <= 14 ? "Prepare" : "Plan"})`;

    const studentEntries = studentExamEntries[d.id] || [];
    const facultyDuty = facultyExamDuties[d.id];

    const studentHtml =
      studentEntries.length > 0
        ? `<div class="mt-2 pt-2 border-t border-slate-200 space-y-1">
            ${studentEntries
          .map(
            (entry) => `
              <div class="flex items-center justify-between gap-2 text-[11px] bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
                <span class="text-slate-800 font-medium">${entry.course} <span class="text-slate-500 font-mono">(${entry.slot})</span></span>
                <button onclick="removeStudentExam('${d.id}', '${entry.id}')" class="text-rose-600 hover:text-rose-800 font-medium px-1" title="Remove">×</button>
              </div>`,
          )
          .join("")}
          </div>`
        : "";

    const facultyHtml = facultyDuty
      ? `<div class="mt-2 pt-2 border-t border-slate-200">
          <div class="text-[11px] bg-amber-50 text-amber-900 px-2.5 py-1.5 rounded-lg border border-amber-200 flex items-center justify-between gap-2">
            <span><strong>Faculty Duty:</strong> ${facultyDuty.count} ${facultyDuty.count === 1 ? "duty" : "duties"} — <span class="font-mono">${facultyDuty.slots.join(", ")}</span></span>
          </div>
        </div>`
      : "";

    const item = document.createElement("div");
    item.className = `p-3 rounded-xl border text-xs ${isDone ? "bg-emerald-50 border-emerald-300 opacity-75" : "bg-white border-slate-200"}`;
    item.innerHTML = `
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div class="flex items-center gap-2.5">
          <span class="font-medium text-slate-800">Day ${d.dayNo}: ${d.display}</span>
          <span class="px-2 py-0.5 rounded-md border text-[10px] ${isDone ? "bg-emerald-100 text-emerald-800 border-emerald-300 font-medium" : urgencyClass}">${urgencyBadge}</span>
        </div>
        <div class="flex items-center gap-1.5">
          <button onclick="openStudentExamModal('${d.id}')" class="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 transition-colors">
            + Student Exam
          </button>
          <button onclick="openFacultyDutyModal('${d.id}')" class="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors">
            ${facultyDuty ? "Edit Duty" : "+ Faculty Duty"}
          </button>
        </div>
      </div>
      ${studentHtml}
      ${facultyHtml}
    `;
    containerEl.appendChild(item);
  });
}

function getCombinedEvaluations() {
  const combined = userEvaluations.map((ev) => ({
    ...ev,
    source: "eval",
  }));

  const allExamDays = [...MIDTERM_DAYS, ...FINAL_DAYS];
  allExamDays.forEach((d) => {
    const studentEntries = studentExamEntries[d.id] || [];
    studentEntries.forEach((entry) => {
      combined.push({
        id: entry.id,
        dayId: d.id,
        dateStr: d.dateStr,
        code: entry.course,
        title: d.display,
        type: "Exam/Duty",
        subType: "Student Exam",
        desc: `Time Slot: ${entry.slot}`,
        source: "student-exam",
      });
    });

    const duty = facultyExamDuties[d.id];
    if (duty) {
      combined.push({
        id: "fd-" + d.id,
        dayId: d.id,
        dateStr: d.dateStr,
        code: "Faculty Duty",
        title: d.display,
        type: "Exam/Duty",
        subType: "Faculty Duty",
        desc: `${duty.count} ${duty.count === 1 ? "duty" : "duties"} — ${duty.slots.join(", ")}`,
        source: "faculty-duty",
      });
    }
  });

  return combined;
}

function renderEvaluations() {
  const container = document.getElementById("evaluations-list");
  const midContainer = document.getElementById("midterm-exam-list");
  const finalContainer = document.getElementById("final-exam-list");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  renderExamDaysList(midContainer, MIDTERM_DAYS, today);
  renderExamDaysList(finalContainer, FINAL_DAYS, today);

  if (!container) return;
  container.innerHTML = "";

  const allEvaluations = getCombinedEvaluations();
  let filtered = [...allEvaluations];

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

  const upcomingCount = allEvaluations.filter(
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
      } else if (ev.type === "Exam/Duty") {
        if (ev.source === "faculty-duty") {
          typeBadge = "bg-amber-50 text-amber-800 border-amber-200";
          iconName = "briefcase";
          iconBg = "bg-amber-600 text-white";
        } else {
          typeBadge = "bg-violet-50 text-violet-700 border-violet-200";
          iconName = "graduation-cap";
          iconBg = "bg-violet-600 text-white";
        }
      }

      const item = document.createElement("div");
      item.className = `p-4 rounded-2xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none ${isPast
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
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-md border ${typeBadge}">${ev.subType || ev.type}</span>
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
            ${isPast
          ? `<button disabled class="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed">
                    Completed
                   </button>`
          : ev.source === "student-exam"
            ? `<button onclick="removeStudentExam('${ev.dayId}', '${ev.id}')" class="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors">
                    Remove
                   </button>`
            : ev.source === "faculty-duty"
              ? `<button onclick="openFacultyDutyModal('${ev.dayId}')" class="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors">
                      Edit Duty
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

function filterEvents(category) {
  currentEventFilter = category;

  document.querySelectorAll(".evt-f-btn").forEach((btn) => {
    btn.className =
      "evt-f-btn px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all bg-white text-slate-600 border-slate-200 hover:bg-slate-50";
  });

  const activeBtn = document.getElementById(`evt-filter-${category}`);
  if (activeBtn) {
    activeBtn.className =
      "evt-f-btn px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all bg-slate-900 text-white border-slate-900 shadow-sm";
  }

  renderEvents();
  if (currentPage === "events") {
    scrollToFirstPendingEvent();
  }
}

function scrollToFirstPendingEvent() {
  const targetEl = document.getElementById("first-pending-event-item");
  if (!targetEl) return;

  setTimeout(() => {
    const headerEl = document.querySelector("header");
    const filterBarEl = document.getElementById("events-filter-bar");
    const headerHeight = headerEl ? headerEl.getBoundingClientRect().height : 64;
    const filterHeight = filterBarEl
      ? filterBarEl.getBoundingClientRect().height
      : 0;
    const stickyOffset = headerHeight + filterHeight + 16;

    const elementPosition = targetEl.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - stickyOffset;

    window.scrollTo({
      top: Math.max(0, offsetPosition),
      behavior: "smooth",
    });
  }, 60);
}

function renderEvents() {
  const container = document.getElementById("events-container");
  const bannerContainer = document.getElementById("events-banner-container");
  if (!container) return;
  container.innerHTML = "";
  if (bannerContainer) bannerContainer.innerHTML = "";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 1. Calculate urgent events (< 3 days left, not completed, and EXCLUDING holidays)
  const urgentEvents = ACADEMIC_EVENTS.filter((evt) => {
    // Exclude holidays from urgent notifications
    if (evt.category === "HOLIDAY") return false;

    let startDateStr = evt.dateStr;
    let endDateStr = evt.dateStr;

    if (evt.dateDisplay && evt.dateDisplay.includes("–")) {
      const parts = evt.dateDisplay.split("–").map((s) => s.trim());
      const parsedEnd = new Date(parts[1]);
      if (!isNaN(parsedEnd)) {
        endDateStr = parsedEnd.toISOString().split("T")[0];
      }
    }

    const isPast = isDatePassed(endDateStr);
    const isDone = completedEvents.has(evt.id) || isPast;

    if (isDone) return false;

    const targetDate = new Date(startDateStr);
    targetDate.setHours(0, 0, 0, 0);
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays >= 0 && diffDays < 3;
  });

  // Update navigation badge for Important Events tab
  const navEvtBadge = document.getElementById("nav-events-badge");
  if (navEvtBadge) {
    if (urgentEvents.length > 0) {
      navEvtBadge.innerText = urgentEvents.length;
      navEvtBadge.classList.remove("hidden");
    } else {
      navEvtBadge.classList.add("hidden");
    }
  }

  // 2. Render Urgent Notification Banner if non-holiday urgent events exist
  if (bannerContainer && urgentEvents.length > 0) {
    const banner = document.createElement("div");
    banner.className =
      "bg-slate-900/95 text-slate-100 p-4 sm:p-5 rounded-3xl shadow-xl shadow-rose-950/20 border border-rose-900/40 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3";

    const eventNames = urgentEvents
      .map((e) => {
        const targetDate = new Date(e.dateStr);
        targetDate.setHours(0, 0, 0, 0);
        const diffDays = Math.ceil(
          (targetDate - today) / (1000 * 60 * 60 * 24),
        );
        const label = diffDays === 0 ? "Today" : `${diffDays} Day(s) Left`;
        return `<strong class="text-rose-100 font-bold">${e.title}</strong> (${label})`;
      })
      .join(", ");

    banner.innerHTML = `
      <div class="flex items-center gap-3.5">
        <div class="p-2.5 bg-rose-500/15 text-rose-400 border border-rose-500/30 rounded-2xl shrink-0">
          <i data-lucide="bell-ring" class="w-5 h-5"></i>
        </div>
        <div>
          <h4 class="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
            Urgent Academic Warning
          </h4>
          <p class="text-xs sm:text-sm font-medium text-slate-300 mt-0.5 leading-snug">
            Upcoming Event Alert: ${eventNames}
          </p>
        </div>
      </div>
      <span class="px-3 py-1 bg-rose-950/80 text-rose-300 text-[10px] font-bold uppercase tracking-wider rounded-xl border border-rose-800/60 shrink-0">
        Action Required
      </span>
    `;

    bannerContainer.appendChild(banner);
  }

  // 3. Filter list based on selected category pill
  const filtered = ACADEMIC_EVENTS.filter((evt) => {
    if (currentEventFilter === "ALL") return true;
    return evt.category === currentEventFilter;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="bg-white p-8 text-center rounded-2xl border border-slate-200 shadow-sm">
        <div class="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-2">
          <i data-lucide="calendar-off" class="w-5 h-5"></i>
        </div>
        <h3 class="text-xs font-bold text-slate-800">No Events Found</h3>
        <p class="text-[11px] text-slate-500 max-w-sm mx-auto mt-0.5">
          No scheduled events match the selected category filter.
        </p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  // 4. Render Event Cards
  let firstPendingAssigned = false;
  filtered.forEach((evt) => {
    let startDateStr = evt.dateStr;
    let endDateStr = evt.dateStr;

    if (evt.dateDisplay && evt.dateDisplay.includes("–")) {
      const parts = evt.dateDisplay.split("–").map((s) => s.trim());
      const parsedEnd = new Date(parts[1]);
      if (!isNaN(parsedEnd)) {
        endDateStr = parsedEnd.toISOString().split("T")[0];
      }
    }

    const isPast = isDatePassed(endDateStr);
    if (isPast) {
      completedEvents.add(evt.id);
    }
    const isDone = completedEvents.has(evt.id) || isPast;

    const targetDate = new Date(startDateStr);
    targetDate.setHours(0, 0, 0, 0);
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let timerBadgeHtml = "";
    if (isDone || isPast) {
      timerBadgeHtml = `
        <span class="px-2.5 py-1 rounded-xl text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
          Completed
        </span>
      `;
    } else if (diffDays === 0) {
      timerBadgeHtml = `
        <span class="px-2.5 py-1 rounded-xl text-xs font-extrabold bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">
          Event Today!
        </span>
      `;
    } else if (diffDays < 3 && evt.category !== "HOLIDAY") {
      // Highlighted notification style for < 3 days left (excluding holidays)
      timerBadgeHtml = `
        <span class="px-2.5 py-1 rounded-xl text-xs font-black bg-rose-500 text-white shadow-md shadow-rose-500/30 border border-rose-600 animate-bounce">
          ${diffDays} Day${diffDays > 1 ? "s" : ""} Left
        </span>
      `;
    } else if (diffDays < 7) {
      timerBadgeHtml = `
        <span class="px-2.5 py-1 rounded-xl text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
          ${diffDays} Days Left
        </span>
      `;
    } else if (diffDays <= 14) {
      timerBadgeHtml = `
        <span class="px-2.5 py-1 rounded-xl text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
          ${diffDays} Days Left
        </span>
      `;
    } else {
      timerBadgeHtml = `
        <span class="px-2.5 py-1 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
          ${diffDays} Days Left
        </span>
      `;
    }

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

    const isUrgentNonHoliday =
      diffDays < 3 && !isDone && evt.category !== "HOLIDAY";

    const item = document.createElement("div");
    if (!isDone && !firstPendingAssigned) {
      item.id = "first-pending-event-item";
      firstPendingAssigned = true;
    }
    item.className = `p-4 rounded-2xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none ${isDone
        ? "bg-emerald-50/80 border-emerald-400 opacity-80"
        : isUrgentNonHoliday
          ? "bg-rose-50/60 border-rose-300 shadow-md shadow-rose-500/10"
          : "bg-white border-slate-200 hover:border-brand-300 shadow-sm"
      }`;

    item.innerHTML = `
      <div class="flex items-start gap-3.5">
        <div class="p-2.5 rounded-xl ${isDone ? "bg-emerald-600 text-white" : iconBg
      } shrink-0 mt-0.5 sm:mt-0">
          <i data-lucide="${isDone ? "check-circle-2" : iconName
      }" class="w-5 h-5"></i>
        </div>
        <div>
          <div class="flex flex-wrap items-center gap-2 mb-1">
            <span class="text-xs font-extrabold ${isDone ? "text-emerald-950" : "text-slate-900"
      }">${evt.dateDisplay} (${evt.dayName})</span>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-md border ${catBadge}">${evt.category
      }</span>
          </div>
          <h3 class="text-sm font-bold ${isDone
        ? "text-emerald-900 line-through opacity-75"
        : "text-slate-900"
      }">${evt.title}</h3>
          <p class="text-xs ${isDone ? "text-emerald-700" : "text-slate-500"
      } mt-0.5">${evt.note}</p>
        </div>
      </div>

      <div class="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
        ${timerBadgeHtml}
      </div>
    `;

    container.appendChild(item);
  });

  lucide.createIcons();
}

// Calculate dynamic 1-24 class sequence number for paired tracks (SAT/TUE or SUN/WED)
function getPairedClassNo(item) {
  const pairedClasses = ALL_CLASSES.filter(
    (c) => c.pairedTrack === item.pairedTrack,
  );
  return pairedClasses.findIndex((c) => c.id === item.id) + 1;
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
  studentExamEntries = {};
  facultyExamDuties = {};
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

  [...MIDTERM_DAYS, ...FINAL_DAYS].forEach((d) => {
    if (isDatePassed(d.dateStr)) {
      completedExams.add(d.id);
    }
  });

  ACADEMIC_EVENTS.forEach((evt) => {
    let targetDateStr = evt.dateStr;
    // Handle multi-day event date ranges (e.g., "2026-12-05" vs range end date)
    if (evt.dateDisplay && evt.dateDisplay.includes("–")) {
      const parts = evt.dateDisplay.split("–").map((s) => s.trim());
      const endPart = parts[1]; // e.g. "Dec 12, 2026"
      const parsedEnd = new Date(endPart);
      if (!isNaN(parsedEnd)) {
        targetDateStr = parsedEnd.toISOString().split("T")[0];
      }
    }

    if (targetDateStr && isDatePassed(targetDateStr)) {
      completedEvents.add(evt.id);
    }
  });

  saveState();
}

// Initialize App
window.addEventListener(
  "DOMContentLoaded",
  async () => {
    await initSyncCode();
    loadState();
    syncPastClassesAndEvents();
    renderCalendar();
    renderDashboard();
    renderEvaluations();
    applyDefaultExamSectionState();
    renderEvents();
    updateNavigation();
    setupFirebaseSync();
    if (currentPage === "calendar") {
      scrollToCurrentDay();
    }
    lucide.createIcons();
  },
  60000,
); // 60 seconds delay to ensure Firebase is initialized

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
    applyDefaultExamSectionState();
    renderEvents();
  }
});
