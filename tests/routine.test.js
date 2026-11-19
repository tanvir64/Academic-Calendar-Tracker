const test = require("node:test");
const assert = require("node:assert/strict");
const vm = require("node:vm");
const fs = require("node:fs");
const path = require("node:path");

function setup() {
  const context = vm.createContext({
    ALL_CLASSES: [
      { id: "sat", dayName: "SAT", isMakeup: false },
      { id: "tue", dayName: "TUE", isMakeup: false },
      { id: "makeup", dayName: "THU", isMakeup: true, follows: "SAT" },
      { id: "generic", dayName: "THU", isMakeup: true },
    ],
    completedClasses: new Set(),
    makeupMeetingLinks: {},
    userEvaluations: [],
  });
  vm.runInContext(
    fs.readFileSync(path.join(__dirname, "../routine.js"), "utf8"),
    context,
  );
  return context;
}

test("sections have distinct schedule identities and paired days", () => {
  const ctx = setup();
  const result = vm.runInContext(`
    routineClasses = [
      { day: "SAT", start: "11:00", end: "12:00", code: "CSE1111", title: "Course", room: "R", section: "b" },
      { day: "SAT", start: "09:00", end: "10:00", code: "CSE1111", title: "Course", room: "R", section: "A" },
      { day: "SAT", start: "08:00", end: "09:00", code: "CSE1111", title: "Course", room: "R" },
    ];
    JSON.stringify({
      ids: getScheduleClasses().map(c => c.id),
      paired: getPairedRoutineRow(getRoutine()[1]),
      duplicate: hasRoutineKey(getRoutine(), normalizeRoutineRow("SAT", "09:00", "10:00", "CSE1111", "Course", "R", "a").row),
      distinct: hasRoutineKey(getRoutine(), normalizeRoutineRow("SAT", "09:00", "10:00", "CSE1111", "Course", "R", "C").row),
    });
  `, ctx);
  const data = JSON.parse(result);
  assert.deepEqual(data.ids, [
    "sat|CSE1111", "sat|CSE1111|A", "sat|CSE1111|B",
    "makeup|CSE1111", "makeup|CSE1111|A", "makeup|CSE1111|B",
    "generic",
  ]);
  assert.equal(data.paired.day, "TUE");
  assert.equal(data.paired.section, "A");
  assert.equal(data.duplicate, true);
  assert.equal(data.distinct, false);
});

test("old CSV rows and section validation remain compatible", () => {
  const ctx = setup();
  const result = vm.runInContext(`
    const records = parseRoutineCsv("SAT,09:00,10:00,CSE1111,Course,R\\nSAT,10:00,11:00,CSE1111,Course,R,A").records;
    JSON.stringify({
      old: normalizeRoutineRow(...records[0].fields).row.section,
      section: normalizeRoutineRow(...records[1].fields).row.section,
      invalid: normalizeRoutineRow("SAT", "09:00", "10:00", "CSE1111", "Course", "R", "A'").errors.length,
    });
  `, ctx);
  assert.deepEqual(JSON.parse(result), { old: "", section: "A", invalid: 1 });
});

test("CSV reports malformed quotes while accepting escaped and multiline values", () => {
  const ctx = setup();
  const result = vm.runInContext(`
    JSON.stringify({
      valid: parseRoutineCsv('SAT,09:00,10:00,CSE1111,"Course, ""Advanced""\\nTopics",R,A'),
      trailing: parseRoutineCsv('SAT,09:00,10:00,CSE1111,"Title"junk,R,A'),
      unquoted: parseRoutineCsv('SAT,09:00,10:00,CSE1111,Ti"tle,R,A'),
      missing: parseRoutineCsv('SAT,09:00,10:00,CSE1111,"Title,R,A'),
    });
  `, ctx);
  const data = JSON.parse(result);
  assert.deepEqual(data.valid.errors, []);
  assert.equal(data.valid.records[0].fields[4], 'Course, "Advanced"\nTopics');
  assert.match(data.trailing.errors[0], /Line 1: invalid quote/);
  assert.match(data.unquoted.errors[0], /Line 1: invalid quote/);
  assert.match(data.missing.errors[0], /Line 1:.*missing its closing quote/);
});

test("invalid CSV quotes reject the whole import", () => {
  const ctx = setup();
  const result = vm.runInContext(`
    const elements = {
      "routine-csv": { value: 'SAT,09:00,10:00,CSE1111,Valid,R,A\\nTUE,09:00,10:00,CSE1111,"Bad"extra,R,A' },
      "routine-csv-msg": {},
    };
    globalThis.document = { getElementById: (id) => elements[id] };
    importRoutineCsv();
    JSON.stringify({ rows: getRoutine().length, message: elements["routine-csv-msg"].innerHTML });
  `, ctx);
  const data = JSON.parse(result);
  assert.equal(data.rows, 0);
  assert.match(data.message, /Line 2: invalid quote/);
  assert.match(data.message, /Nothing was imported/);
});

test("course filters distinguish sections and deduplicate paired days", () => {
  const ctx = setup();
  const result = vm.runInContext(`
    routineClasses = [
      { day: "SAT", start: "08:31", end: "09:50", code: "CSE1111", title: "Course", room: "R", section: "A" },
      { day: "SAT", start: "09:51", end: "11:10", code: "CSE1111", title: "Course", room: "R", section: "B" }
    ];
    JSON.stringify(getRoutineFilters().map(routineFilterKey));
  `, ctx);
  assert.deepEqual(JSON.parse(result), ["CSE1111", "CSE1111|A", "CSE1111|B%201"]);
});

test("renaming a section moves saved data without overwriting existing data", () => {
  const ctx = setup();
  const result = vm.runInContext(`
    const old = normalizeRoutineRow("SAT", "09:00", "10:00", "CSE1111", "Course", "R").row;
    const next = { ...old, section: "A" };
    completedClasses.add("sat|CSE1111");
    makeupMeetingLinks["makeup|CSE1111"] = { url: "https://example.test" };
    userEvaluations.push({ dateId: "sat|CSE1111" });
    const moved = moveRoutineSectionData(old, next);
    const preserved = completedClasses.has("sat|CSE1111|A") &&
      makeupMeetingLinks["makeup|CSE1111|A"].url === "https://example.test" &&
      userEvaluations[0].dateId === "sat|CSE1111|A";
    completedClasses.add("sat|CSE1111|B");
    const conflict = moveRoutineSectionData(next, { ...next, section: "B" });
    JSON.stringify({ moved, preserved, conflict, stillPresent: completedClasses.has("sat|CSE1111|A") });
  `, ctx);
  assert.deepEqual(JSON.parse(result), {
    moved: true, preserved: true, conflict: false, stillPresent: true,
  });
});
