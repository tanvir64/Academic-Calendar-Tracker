// Optional personal routine. Until the user adds a class, every hook into
// script.js falls back to the shared calendar and nothing changes.
// Loaded after script.js and relies on its globals (ALL_CLASSES, completedClasses, ...).

const ROUTINE_STORAGE_KEY = "calendar_263_routine_v1";

const ROUTINE_DAY_ORDER = ["SAT", "SUN", "MON", "TUE", "WED", "THU", "FRI"];
const ROUTINE_DAY_NAMES = [
  "SATURDAY",
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
];
// Only weekdays that have regular classes in the shared calendar can be used
const ROUTINE_DAYS = ROUTINE_DAY_ORDER.filter((d) =>
  ALL_CLASSES.some((c) => !c.isMakeup && c.dayName === d),
);
// Theory courses (odd last digit) meet twice a week on these day pairs
const ROUTINE_PAIRED_DAY = { SAT: "TUE", TUE: "SAT", SUN: "WED", WED: "SUN" };
const ROUTINE_TRACK_FILTERS = [
  "SAT",
  "SUN",
  "TUE",
  "WED",
  "SAT-TUE",
  "SUN-WED",
];
const ROUTINE_SAMPLE_CSV = `day,start_time,end_time,course_code,course_title,room,section
SAT,09:00,10:20,CSE 1111,Structured Programming,Room 501,A
TUE,09:00,10:20,CSE 1111,Structured Programming,Room 501,A
SAT,10:30,11:50,MATH 1151,Fundamental Calculus,Room 304,B
TUE,10:30,11:50,MATH 1151,Fundamental Calculus,Room 304,B
SUN,09:00,10:20,PHY 2105,Physics,Room 210,A
WED,09:00,10:20,PHY 2105,Physics,Room 210,A
SUN,14:00,15:20,CSE 1112,Structured Programming Lab,Lab 3,A
`;

let routineClasses = [];
let editingRoutineClass = null;

function escapeRoutineHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normalizeRoutineTime(value) {
  const m = String(value || "")
    .trim()
    .toUpperCase()
    .match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/);
  if (!m) return null;
  let hour = Number(m[1]);
  if (Number(m[2]) > 59) return null;
  if (m[3]) {
    if (hour < 1 || hour > 12) return null;
    hour = (hour % 12) + (m[3] === "PM" ? 12 : 0);
  } else if (hour > 23) {
    return null;
  }
  return `${String(hour).padStart(2, "0")}:${m[2]}`;
}

function formatRoutineTime(value) {
  const [h, m] = value.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
}

function displayRoutineCode(code) {
  return code.replace(/^([A-Z]+)(?=\d)/, "$1 ");
}

function isTheoryRoutineCode(code) {
  return Number(code.slice(-1)) % 2 === 1;
}

// Returns { row, errors }. row is null when any field is invalid.
function normalizeRoutineRow(day, start, end, code, title, room, section) {
  const errors = [];
  const dayValue = String(day || "")
    .trim()
    .toUpperCase();
  const dayIdx = Math.max(
    ROUTINE_DAY_ORDER.indexOf(dayValue),
    ROUTINE_DAY_NAMES.indexOf(dayValue),
  );
  const dayKey = ROUTINE_DAY_ORDER[dayIdx];
  if (!ROUTINE_DAYS.includes(dayKey)) {
    errors.push(`day must be one of ${ROUTINE_DAYS.join(", ")}`);
  }

  const codeValue = String(code || "")
    .toUpperCase()
    .replace(/\s+/g, "");
  if (!/^[A-Z][A-Z0-9-]{0,10}\d$/.test(codeValue)) {
    errors.push("course code must start with a letter and end with a digit");
  }

  let startTime = normalizeRoutineTime(start);
  let endTime = normalizeRoutineTime(end);

  if (!startTime) errors.push("start time must look like 09:00 or 9:00 AM");
  if (!endTime) errors.push("end time must look like 10:20 or 10:20 AM");
  if (startTime && endTime && startTime >= endTime) {
    errors.push("end time must be after start time");
  }

  const titleValue = String(title || "").trim();
  if (!titleValue) errors.push("course title is required");
  if (titleValue.length > 80) errors.push("course title is too long");

  const roomValue = String(room || "").trim();
  if (roomValue.length > 40) errors.push("room is too long");

  const sectionValue = String(section || "").trim().toUpperCase().replace(/\s+/g, " ");
  if (sectionValue && !/^[A-Z0-9][A-Z0-9 -]{0,19}$/.test(sectionValue)) {
    errors.push("section must contain at most 20 letters, numbers, spaces or hyphens");
  }

  if (errors.length) return { row: null, errors };
  return {
    row: {
      day: dayKey,
      code: codeValue,
      start: startTime,
      end: endTime,
      title: titleValue,
      room: roomValue,
      section: sectionValue,
    },
    errors,
  };
}

// Stored or synced data is re-validated on every read
function getRoutine() {
  if (!Array.isArray(routineClasses)) return [];
  return routineClasses
    .map((r) =>
      r
        ? normalizeRoutineRow(r.day, r.start, r.end, r.code, r.title, r.room, r.section)
          .row
        : null,
    )
    .filter(Boolean)
    .sort(
      (a, b) =>
        ROUTINE_DAY_ORDER.indexOf(a.day) - ROUTINE_DAY_ORDER.indexOf(b.day) ||
        a.start.localeCompare(b.start) ||
        a.code.localeCompare(b.code) ||
        a.section.localeCompare(b.section),
    );
}

function hasRoutine() {
  return getRoutine().length > 0;
}

function getRoutineCourses() {
  const courses = [];
  getRoutine().forEach((r) => {
    if (!courses.some((c) => c.code === r.code)) {
      courses.push({ code: r.code, title: r.title });
    }
  });
  return courses.sort((a, b) => a.code.localeCompare(b.code));
}

function routineFilterKey(row) {
  return `${row.code}${row.section ? `|${encodeURIComponent(row.section)}` : ""}`;
}

function getRoutineFilters() {
  const filters = new Map();
  getRoutine().forEach((row) => {
    const key = routineFilterKey(row);
    if (!filters.has(key)) filters.set(key, row);
  });
  return [...filters.values()].sort(
    (a, b) => a.code.localeCompare(b.code) || a.section.localeCompare(b.section),
  );
}

// Calendar items for the user's classes. Falls back to ALL_CLASSES without a routine.
function getScheduleClasses() {
  const rows = getRoutine();
  if (rows.length === 0) return ALL_CLASSES;

  const items = [];
  ALL_CLASSES.forEach((base) => {
    // A makeup date stands in for the weekday named in `follows`
    const day = base.isMakeup ? base.follows : base.dayName;
    if (!day) {
      items.push(base);
      return;
    }
    rows
      .filter((r) => r.day === day)
      .forEach((r) => {
        items.push({
          ...base,
          id: routineClassId(base.id, r),
          code: r.code,
          section: r.section,
          title: r.title,
          room: r.room,
          start: r.start,
          end: r.end,
        });
      });
  });
  return items;
}

function routineClassId(dateId, row) {
  return `${dateId}|${row.code}${row.section ? `|${encodeURIComponent(row.section)}` : ""}`;
}

function routineSectionLabel(row) {
  return row.section ? ` · Section ${escapeRoutineHtml(row.section)}` : "";
}

function findScheduleClass(id) {
  return (
    getScheduleClasses().find((c) => c.id === id) ||
    ALL_CLASSES.find((c) => c.id === String(id).split("|")[0])
  );
}

function getScheduleDone() {
  return getScheduleClasses().filter((c) => completedClasses.has(c.id)).length;
}

function syncPastRoutineClasses() {
  if (!hasRoutine()) return;
  getScheduleClasses().forEach((c) => {
    if (c.code && isDatePassed(c.dateStr)) completedClasses.add(c.id);
  });
}

function getTrackConfigs(defaultConfigs) {
  if (!hasRoutine()) return defaultConfigs;
  const items = getScheduleClasses();
  return getRoutineCourses().map((course) => {
    const classes = items.filter((c) => c.code === course.code);
    return {
      id: course.code,
      name: escapeRoutineHtml(course.title),
      total: classes.length,
      cols: classes.length > 12 ? "grid-cols-12" : "grid-cols-6",
      isPaired: classes.length > 12,
      tracks: [...new Set(classes.map((c) => c.track))],
      classes,
    };
  });
}

function updateRoutineTotalLabel(total) {
  const done = document.getElementById("dash-completed-total");
  const label = done && done.nextElementSibling;
  if (label) label.innerText = `/ ${total}`;
}

function routineCardHtml(item) {
  if (!item.code) return "";
  const where = item.isMakeup
    ? `Online, follows ${item.follows}`
    : escapeRoutineHtml(item.room);
  return `
    <div class="mt-2 p-1.5 rounded-lg border border-slate-200 bg-white/70 text-[10px] font-semibold">
      <div class="font-extrabold text-slate-900 truncate">${displayRoutineCode(item.code)}${routineSectionLabel(item)} <span class="font-medium text-slate-600">${escapeRoutineHtml(item.title)}</span></div>
      <div class="text-slate-500">${formatRoutineTime(item.start)} - ${formatRoutineTime(item.end)}${where ? ` · ${where}` : ""}</div>
    </div>
  `;
}

function routineTagHtml(item) {
  if (!item.code) return "";
  return `<span class="text-slate-600 font-medium">${displayRoutineCode(item.code)}${routineSectionLabel(item)} · ${formatRoutineTime(item.start)}</span>`;
}

function prefillRoutineEval(item) {
  if (!item.code) return;
  const code = document.getElementById("eval-code");
  const title = document.getElementById("eval-course-title");
  if (code) code.value = displayRoutineCode(item.code);
  if (title) title.value = item.title;
}

// Swaps the fixed track filters for one chip per course and section.
// Returns true when it re-rendered through setFilter, so the caller can stop.
function refreshRoutineUi() {
  const routine = hasRoutine();
  ROUTINE_TRACK_FILTERS.forEach((f) => {
    const btn = document.getElementById(`filter-${f}`);
    if (btn) btn.style.display = routine ? "none" : "";
  });

  const anchor = document.getElementById("filter-MAKEUP");
  const courses = routine ? getRoutineFilters() : [];
  const signature = JSON.stringify(courses.map((c) => [routineFilterKey(c), c.title]));
  let rebuilt = false;
  if (anchor && (anchor.dataset.routineChips || "[]") !== signature) {
    document.querySelectorAll("[data-routine-chip]").forEach((el) => {
      el.remove();
    });
    courses.forEach((course) => {
      const chip = document.createElement("button");
      const key = routineFilterKey(course);
      chip.id = `filter-${key}`;
      chip.dataset.routineChip = "";
      chip.className =
        "filter-btn px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all bg-white text-slate-600 border-slate-200 hover:bg-slate-50";
      chip.textContent = `${displayRoutineCode(course.code)}${course.section ? ` · Section ${course.section}` : courses.some((c) => c.code === course.code && c.section) ? " · No section" : ""}`;
      chip.title = course.title;
      chip.onclick = () => setFilter(key);
      anchor.parentNode.insertBefore(chip, anchor);
    });
    anchor.dataset.routineChips = signature;
    rebuilt = true;
  }

  const valid =
    currentFilter === "ALL" ||
    currentFilter === "MAKEUP" ||
    (routine
      ? courses.some((c) => routineFilterKey(c) === currentFilter)
      : ROUTINE_TRACK_FILTERS.includes(currentFilter));

  const modal = document.getElementById("routine-modal");
  if (modal && !modal.classList.contains("hidden")) renderRoutineList();

  if (valid && !rebuilt) return false;
  setFilter(valid ? currentFilter : "ALL");
  return true;
}

function commitRoutine() {
  syncPastClassesAndEvents(false);
  renderCalendar();
  renderDashboard();
  renderRoutineList();
}

function hasRoutineKey(rows, row) {
  return rows.some((r) => r.day === row.day && r.code === row.code && r.section === row.section);
}

function moveRoutineSectionData(original, updated) {
  const keys = ALL_CLASSES.filter((c) =>
    (c.isMakeup ? c.follows : c.dayName) === original.day,
  ).map((c) => [routineClassId(c.id, original), routineClassId(c.id, updated)]);
  const hasData = (key) =>
    completedClasses.has(key) || makeupMeetingLinks[key] ||
    userEvaluations.some((e) => e.dateId === key);
  if (keys.some(([oldKey, newKey]) => hasData(oldKey) && hasData(newKey))) {
    return false;
  }
  keys.forEach(([oldKey, newKey]) => {
    if (completedClasses.delete(oldKey)) completedClasses.add(newKey);
    if (makeupMeetingLinks[oldKey]) {
      makeupMeetingLinks[newKey] = makeupMeetingLinks[oldKey];
      delete makeupMeetingLinks[oldKey];
    }
    userEvaluations.forEach((e) => {
      if (e.dateId === oldKey) e.dateId = newKey;
    });
  });
  return true;
}

// Same time, room and title on the paired day, for theory courses only
function getPairedRoutineRow(row) {
  const day = ROUTINE_PAIRED_DAY[row.day];
  if (!day || !ROUTINE_DAYS.includes(day) || !isTheoryRoutineCode(row.code)) {
    return null;
  }
  return { ...row, day };
}

function parseRoutineCsv(text) {
  const records = [];
  let fields = [];
  let field = "";
  let inQuotes = false;
  let afterQuote = false;
  let line = 1;
  let startLine = 1;
  const errors = [];
  let invalidQuote = false;

  const endRecord = () => {
    fields.push(field);
    if (fields.some((f) => f.trim() !== "")) {
      records.push({ line: startLine, fields });
    }
    if (invalidQuote) errors.push(`Line ${startLine}: invalid quote in CSV value`);
    fields = [];
    field = "";
    afterQuote = false;
    invalidQuote = false;
  };

  const src = text.replace(/^\uFEFF/, "");
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (inQuotes) {
      if (ch === '"' && src[i + 1] === '"') {
        field += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
        afterQuote = true;
      } else {
        if (ch === "\n" || (ch === "\r" && src[i + 1] !== "\n")) line++;
        field += ch;
      }
    } else if (ch === '"' && field === "") {
      if (afterQuote) invalidQuote = true;
      else inQuotes = true;
    } else if (ch === ",") {
      fields.push(field);
      field = "";
      afterQuote = false;
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && src[i + 1] === "\n") i++;
      endRecord();
      line++;
      startLine = line;
    } else {
      if (ch === '"' || (afterQuote && ch !== " " && ch !== "\t")) {
        invalidQuote = true;
      }
      if (afterQuote && (ch === " " || ch === "\t")) continue;
      field += ch;
    }
  }
  if (inQuotes) errors.push(`Line ${startLine}: a quoted value is missing its closing quote`);
  endRecord();
  return { records, errors };
}

function showRoutineMessages(id, messages, isError) {
  const el = document.getElementById(id);
  if (!el) return;
  el.className = `text-[11px] font-bold space-y-0.5 ${isError ? "text-rose-600" : "text-emerald-600"}`;
  el.innerHTML = messages.map((m) => `<p>${escapeRoutineHtml(m)}</p>`).join("");
}

function updateRoutinePairRow() {
  const row = document.getElementById("routine-pair-row");
  if (!row) return;
  if (editingRoutineClass) {
    row.classList.add("hidden");
    return;
  }
  const parsed = normalizeRoutineRow(
    document.getElementById("routine-day").value,
    "09:00",
    "10:00",
    document.getElementById("routine-code").value,
    "x",
    "",
  ).row;
  const paired = parsed && getPairedRoutineRow(parsed);
  row.classList.toggle("hidden", !paired);
  if (paired) {
    document.getElementById("routine-pair-day").innerText = paired.day;
  }
}

function addRoutineClass(e) {
  e.preventDefault();
  const val = (id) => document.getElementById(id).value;
  const { row, errors } = normalizeRoutineRow(
    val("routine-day"),
    val("routine-start"),
    val("routine-end"),
    val("routine-code"),
    val("routine-title"),
    val("routine-room"),
    val("routine-section"),
  );
  if (!row) return showRoutineMessages("routine-form-msg", errors, true);

  let rows = getRoutine();
  if (editingRoutineClass) {
    const original = rows.find(
      (r) => hasRoutineKey([r], editingRoutineClass),
    );
    if (!original || Object.keys(editingRoutineClass).some(
      (key) => original[key] !== editingRoutineClass[key],
    )) {
      return showRoutineMessages(
        "routine-form-msg",
        ["This class changed or was removed. Cancel editing and select it again."],
        true,
      );
    }
    rows = rows.filter((r) => r !== original);
  }
  if (hasRoutineKey(rows, row)) {
    return showRoutineMessages(
      "routine-form-msg",
      [`${displayRoutineCode(row.code)}${row.section ? ` section ${row.section}` : " without a section"} already has a class on ${row.day}`],
      true,
    );
  }

  if (editingRoutineClass) {
    if (row.day === editingRoutineClass.day && row.code === editingRoutineClass.code &&
      row.section !== editingRoutineClass.section &&
      !moveRoutineSectionData(editingRoutineClass, row)) {
      return showRoutineMessages(
        "routine-form-msg",
        ["The new section already has saved class data. Choose another section."],
        true,
      );
    }
    routineClasses = [...rows, row];
    cancelRoutineEdit();
    showRoutineMessages("routine-form-msg", ["Class updated."], false);
    commitRoutine();
    return;
  }

  const added = [row];
  const paired = getPairedRoutineRow(row);
  if (
    paired &&
    document.getElementById("routine-pair").checked &&
    !hasRoutineKey(rows, paired)
  ) {
    added.push(paired);
  }

  routineClasses = [...rows, ...added];
  document.getElementById("routine-form").reset();
  updateRoutinePairRow();
  showRoutineMessages(
    "routine-form-msg",
    [`Added ${added.map((r) => r.day).join(" + ")}`],
    false,
  );
  commitRoutine();
}

function editRoutineClass(day, code, section) {
  const row = getRoutine().find((r) => hasRoutineKey([r], { day, code, section }));
  if (!row) {
    showRoutineMessages("routine-form-msg", ["Class no longer exists."], true);
    return;
  }
  editingRoutineClass = row;
  ["day", "start", "end", "code", "title", "room", "section"].forEach((field) => {
    document.getElementById(`routine-${field}`).value = row[field];
  });
  document.getElementById("routine-form-heading").textContent = "Edit class";
  document.getElementById("routine-submit").textContent = "Save changes";
  document.getElementById("routine-cancel-edit").classList.remove("hidden");
  document.getElementById("routine-edit-note").classList.remove("hidden");
  showRoutineMessages("routine-form-msg", [], false);
  updateRoutinePairRow();
  document.getElementById("routine-form").scrollIntoView({ block: "start" });
  document.getElementById("routine-day").focus();
}

function cancelRoutineEdit() {
  editingRoutineClass = null;
  document.getElementById("routine-form").reset();
  document.getElementById("routine-form-heading").textContent = "Add a class";
  document.getElementById("routine-submit").textContent = "Add class";
  document.getElementById("routine-cancel-edit").classList.add("hidden");
  document.getElementById("routine-edit-note").classList.add("hidden");
  showRoutineMessages("routine-form-msg", [], false);
  updateRoutinePairRow();
}

function importRoutineCsv() {
  const text = document.getElementById("routine-csv").value;
  const { records, errors } = parseRoutineCsv(text);

  const existing = getRoutine();
  const imported = [];
  records.forEach((rec, i) => {
    const f = rec.fields;
    if (i === 0 && /^(day|weekday)$/i.test(f[0].trim())) return;
    if (f.length > 7) {
      errors.push(
        `Line ${rec.line}: expected up to 7 columns, found ${f.length} (quote values that contain commas)`,
      );
      return;
    }
    const { row, errors: rowErrors } = normalizeRoutineRow(...f);
    if (!row) {
      errors.push(`Line ${rec.line}: ${rowErrors.join("; ")}`);
    } else if (hasRoutineKey(existing, row) || hasRoutineKey(imported, row)) {
      errors.push(
        `Line ${rec.line}: ${displayRoutineCode(row.code)}${row.section ? ` section ${row.section}` : " without a section"} already has a class on ${row.day}`,
      );
    } else {
      imported.push(row);
    }
  });
  if (!errors.length && imported.length === 0) {
    errors.push("No class rows found");
  }
  if (errors.length) {
    errors.push("Nothing was imported. Fix the lines above and try again.");
    return showRoutineMessages("routine-csv-msg", errors, true);
  }

  const all = [...existing, ...imported];
  let pairedCount = 0;
  if (document.getElementById("routine-csv-pair").checked) {
    imported.forEach((row) => {
      const paired = getPairedRoutineRow(row);
      if (paired && !hasRoutineKey(all, paired)) {
        all.push(paired);
        pairedCount++;
      }
    });
  }

  routineClasses = all;
  document.getElementById("routine-csv").value = "";
  showRoutineMessages(
    "routine-csv-msg",
    [
      `Imported ${imported.length} class${imported.length === 1 ? "" : "es"}${pairedCount ? ` (+${pairedCount} paired)` : ""}`,
    ],
    false,
  );
  commitRoutine();
}

function loadRoutineCsvFile(input) {
  const file = input.files && input.files[0];
  if (!file) return;
  file.text().then((text) => {
    document.getElementById("routine-csv").value = text;
    input.value = "";
  });
}

function downloadRoutineSample() {
  const url = URL.createObjectURL(
    new Blob([ROUTINE_SAMPLE_CSV], { type: "text/csv" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = "routine-sample.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function removeRoutineClass(day, code, section) {
  const key = { day, code, section };
  if (editingRoutineClass && hasRoutineKey([editingRoutineClass], key)) {
    cancelRoutineEdit();
  }
  routineClasses = getRoutine().filter(
    (r) => !hasRoutineKey([r], key),
  );
  commitRoutine();
}

function clearRoutine() {
  if (!confirm("Remove all classes from your routine?")) return;
  if (editingRoutineClass) cancelRoutineEdit();
  routineClasses = [];
  commitRoutine();
}

function renderRoutineList() {
  const list = document.getElementById("routine-list");
  if (!list) return;
  const rows = getRoutine();
  const clearBtn = document.getElementById("routine-clear-btn");
  if (clearBtn) clearBtn.classList.toggle("hidden", rows.length === 0);

  if (rows.length === 0) {
    list.innerHTML = `<p class="text-xs text-slate-500">No classes yet. The tracker shows the full shared calendar until you add one.</p>`;
    return;
  }
  list.innerHTML = rows
    .map(
      (r) => `
        <div class="flex items-center justify-between gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs">
          <div class="min-w-0">
            <div class="font-extrabold text-slate-900 truncate">
              <span class="text-brand-700">${r.day}</span> ${displayRoutineCode(r.code)}${routineSectionLabel(r)}
              <span class="font-medium text-slate-600">${escapeRoutineHtml(r.title)}</span>
            </div>
            <div class="text-[11px] text-slate-500">${formatRoutineTime(r.start)} - ${formatRoutineTime(r.end)}${r.room ? ` · ${escapeRoutineHtml(r.room)}` : ""}</div>
          </div>
          <div class="flex items-center shrink-0">
            <button type="button" onclick="editRoutineClass('${r.day}', '${r.code}', '${r.section}')" class="p-1.5 text-brand-700 hover:bg-brand-100 rounded-lg" aria-label="Edit ${r.day} ${displayRoutineCode(r.code)}${routineSectionLabel(r)}" title="Edit">
              <i data-lucide="edit-2" class="w-4 h-4"></i>
            </button>
            <button type="button" onclick="removeRoutineClass('${r.day}', '${r.code}', '${r.section}')" class="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg" aria-label="Remove ${r.day} ${displayRoutineCode(r.code)}${routineSectionLabel(r)}" title="Remove">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>
        </div>
      `,
    )
    .join("");
  lucide.createIcons();
}

function buildRoutineModal() {
  const modal = document.createElement("div");
  modal.id = "routine-modal";
  modal.className =
    "fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-md hidden flex items-center justify-center p-4";
  modal.innerHTML = `
    <div class="routine-modal-body bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 space-y-5">
      <div class="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 class="text-base font-extrabold text-slate-900">My Class Routine</h3>
          <p class="text-[11px] text-slate-500">Optional. Once set, the tracker shows only your classes.</p>
        </div>
        <button onclick="closeRoutineModal()" class="text-slate-400 hover:text-slate-600 p-1 rounded-xl">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <form id="routine-form" onsubmit="addRoutineClass(event)" class="space-y-3">
        <h4 id="routine-form-heading" class="text-xs font-extrabold text-slate-800">Add a class</h4>
        <p id="routine-edit-note" class="hidden text-[11px] text-slate-500">Changes apply to this day only. Changing the course code does not move existing assessments or meeting links.</p>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <label class="text-xs font-bold text-slate-700">Day
            <select id="routine-day" class="routine-field mt-1">
              ${ROUTINE_DAYS.map((d) => `<option value="${d}">${d}</option>`).join("")}
            </select>
          </label>
          <label class="text-xs font-bold text-slate-700">Course code
            <input type="text" id="routine-code" required placeholder="e.g. CSE 1111" class="routine-field mt-1" />
          </label>
          <label class="text-xs font-bold text-slate-700">Start
            <input type="time" id="routine-start" required class="routine-field mt-1" />
          </label>
          <label class="text-xs font-bold text-slate-700">End
            <input type="time" id="routine-end" required class="routine-field mt-1" />
          </label>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <label class="text-xs font-bold text-slate-700 sm:col-span-2">Course title
            <input type="text" id="routine-title" required placeholder="e.g. Structured Programming" class="routine-field mt-1" />
          </label>
          <label class="text-xs font-bold text-slate-700">Room
            <input type="text" id="routine-room" placeholder="e.g. Room 501" class="routine-field mt-1" />
          </label>
          <label class="text-xs font-bold text-slate-700">Section (optional)
            <input type="text" id="routine-section" maxlength="20" placeholder="e.g. A" class="routine-field mt-1" />
          </label>
        </div>
        <label id="routine-pair-row" class="hidden flex items-center gap-2 text-xs font-bold text-slate-700">
          <input type="checkbox" id="routine-pair" checked />
          <span>Also add the paired day (<span id="routine-pair-day"></span>)</span>
        </label>
        <div class="flex items-center gap-3">
          <button id="routine-submit" type="submit" class="px-4 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl">Add class</button>
          <button id="routine-cancel-edit" type="button" onclick="cancelRoutineEdit()" class="hidden px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl">Cancel</button>
          <div id="routine-form-msg"></div>
        </div>
      </form>

      <div class="space-y-3 pt-4 border-t border-slate-100">
        <h4 class="text-xs font-extrabold text-slate-800">Import CSV</h4>
        <p class="text-[11px] text-slate-500">Columns: day, start_time, end_time, course_code, course_title, room, section (room and section may be empty; older six-column CSVs are supported).</p>
        <textarea id="routine-csv" rows="5" placeholder="Paste CSV rows here" class="routine-field routine-csv"></textarea>
        <label class="flex items-center gap-2 text-xs font-bold text-slate-700">
          <input type="checkbox" id="routine-csv-pair" checked />
          <span>Also add the paired day for theory courses (skipped if already listed)</span>
        </label>
        <div class="flex flex-wrap items-center gap-2">
          <button type="button" onclick="importRoutineCsv()" class="px-4 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl">Import</button>
          <label class="px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer">
            Upload CSV file
            <input type="file" accept=".csv,text/csv,text/plain" onchange="loadRoutineCsvFile(this)" class="hidden" />
          </label>
          <button type="button" onclick="downloadRoutineSample()" class="px-4 py-2.5 text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-xl">Download sample CSV</button>
        </div>
        <div id="routine-csv-msg"></div>
      </div>

      <div class="space-y-3 pt-4 border-t border-slate-100">
        <div class="flex items-center justify-between">
          <h4 class="text-xs font-extrabold text-slate-800">Your classes</h4>
          <button id="routine-clear-btn" onclick="clearRoutine()" class="hidden px-3 py-1.5 text-[11px] font-bold text-rose-600 hover:bg-rose-100/70 border border-rose-200 rounded-xl">Clear all</button>
        </div>
        <div id="routine-list" class="space-y-2"></div>
      </div>

      <button onclick="closeRoutineModal()" class="w-full py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl">Close</button>
    </div>
  `;
  document.body.appendChild(modal);
  ["routine-day", "routine-code"].forEach((id) => {
    document.getElementById(id).addEventListener("input", updateRoutinePairRow);
  });

  const routineStartInput = document.getElementById("routine-start");
  const routineEndInput = document.getElementById("routine-end");
  const routineCodeInput = document.getElementById("routine-code");

  routineStartInput.addEventListener("change", () => {
    const startTime = normalizeRoutineTime(routineStartInput.value);

    if (!startTime) return;
    if (routineEndInput.value) return;

    const codeValue = routineCodeInput.value
      .toUpperCase()
      .replace(/\s+/g, "");

    const [h, m] = startTime.split(":").map(Number);
    const totalMinutes = h * 60 + m;
    const additionalMinutes = isTheoryRoutineCode(codeValue) ? 79 : 149;
    const newTotalMinutes = totalMinutes + additionalMinutes;

    const newHours = Math.floor(newTotalMinutes / 60);
    const newMinutes = newTotalMinutes % 60;

    routineEndInput.value =
      `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}`;
  });
}

function openRoutineModal() {
  if (!document.getElementById("routine-modal")) buildRoutineModal();
  renderRoutineList();
  document.getElementById("routine-modal").classList.remove("hidden");
  lucide.createIcons();
}

function closeRoutineModal() {
  const modal = document.getElementById("routine-modal");
  if (editingRoutineClass) cancelRoutineEdit();
  if (modal) modal.classList.add("hidden");
}
