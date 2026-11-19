const test = require("node:test");
const assert = require("node:assert/strict");
const vm = require("node:vm");
const fs = require("node:fs");
const path = require("node:path");

function setup(savedStorage) {
  const events = {};
  const refs = [];
  const alerts = [];
  const writes = {};
  const storageWrites = [];
  const storage = savedStorage || new Map([
    ["calendar_263_sync_code_v1", "FALL-2026-ABCD-EFGH"],
    ["calendar_263_routine_v1", JSON.stringify([
      { day: "SAT", start: "09:00", end: "10:00", code: "CSE1111", title: "Local", room: "R" },
    ])],
  ]);
  const db = {
    ref(name) {
      const ref = {
        name,
        writes: [],
        on(event, callback, onError) {
          this.callback = callback;
          this.onError = onError;
        },
        off() { this.detached = true; },
        set(data) {
          this.writes.push(JSON.parse(JSON.stringify(data)));
          if (writes.deferred) {
            return new Promise((resolve, reject) => writes.deferred.push({ resolve, reject }));
          }
          return writes.error ? Promise.reject(writes.error) : Promise.resolve();
        },
        deliver(data) { this.callback({ val: () => data }); },
      };
      refs.push(ref);
      return ref;
    },
  };
  const ctx = vm.createContext({
    firebase: { apps: [], initializeApp() {}, database: () => db },
    localStorage: {
      getItem: (key) => storage.get(key) || null,
      setItem: (key, value) => { storageWrites.push(key); storage.set(key, value); },
      removeItem: (key) => storage.delete(key),
    },
    window: { addEventListener: (name, callback) => { events[name] = callback; } },
    document: { getElementById: () => null, addEventListener() {} },
    lucide: { createIcons() {} },
    console: { warn() {}, error() {} },
    alert: (message) => alerts.push(message),
    confirm: () => true,
  });
  for (const file of ["script.js", "routine.js"]) {
    vm.runInContext(fs.readFileSync(path.join(__dirname, "..", file), "utf8"), ctx);
  }
  vm.runInContext(`
    globalThis.originalRenderDashboard = renderDashboard;
    renderCalendar = renderDashboard = renderEvaluations = renderEvents = updateNavigation = () => {};
  `, ctx);
  return { ctx, events, refs, alerts, storage, writes, storageWrites };
}

test("startup reads an existing remote session before writing", async () => {
  const { ctx, events, refs, storage } = setup();
  await events.DOMContentLoaded();
  assert.equal(refs.length, 1);
  assert.equal(refs[0].writes.length, 0);
  refs[0].deliver({ routineClasses: [{ title: "Remote" }] });
  assert.equal(vm.runInContext("routineClasses[0].title", ctx), "Remote");
  assert.equal(JSON.parse(storage.get("calendar_263_routine_v1"))[0].title, "Remote");
  assert.equal(refs[0].writes.length, 0);
  vm.runInContext('routineClasses = [{title: "Updated"}]; saveState()', ctx);
  assert.equal(refs[1].writes[0].routineClasses[0].title, "Updated");
});

test("an empty remote session is initialized with local data", async () => {
  const { events, refs } = setup();
  await events.DOMContentLoaded();
  refs[0].deliver(null);
  assert.equal(refs[1].writes[0].routineClasses[0].title, "Local");
});

test("local edits made while waiting preserve both versions and pause sync", async () => {
  const { ctx, events, refs, alerts, storage } = setup();
  await events.DOMContentLoaded();
  vm.runInContext('routineClasses[0].title = "Edited"; commitRoutine()', ctx);
  assert.equal(refs[0].writes.length, 0);
  refs[0].deliver({ routineClasses: [{ title: "Remote" }] });
  assert.equal(vm.runInContext("routineClasses[0].title", ctx), "Edited");
  assert.equal(JSON.parse(storage.get("calendar_263_routine_v1"))[0].title, "Edited");
  assert.equal(refs[0].writes.length, 0);
  assert.equal(refs[0].detached, true);
  assert.match(alerts[0], /both preserved/);
});

test("automatic updates in another tab do not pause startup sync", async () => {
  const { ctx, events, refs, alerts, storage } = setup();
  await events.DOMContentLoaded();
  events.storage({ key: "calendar_263_completed_classes_v1" });
  assert.equal(storage.has("calendar_263_sync_pending_v1"), false);
  refs[0].deliver({ routineClasses: [{ title: "Remote" }] });
  assert.equal(alerts.length, 0);
  assert.equal(vm.runInContext("routineClasses[0].title", ctx), "Remote");
});

test("automatic cloud writes do not mark user changes as pending", async () => {
  const { ctx, events, refs, storage, writes } = setup();
  await events.DOMContentLoaded();
  refs[0].deliver({ routineClasses: [] });
  writes.deferred = [];
  vm.runInContext("saveState(true)", ctx);
  assert.equal(storage.has("calendar_263_sync_pending_v1"), false);
  writes.deferred[0].resolve();
  await new Promise((resolve) => setImmediate(resolve));
});

test("an automatic write does not clear a later edit from another tab", async () => {
  const { ctx, events, refs, storage, writes } = setup();
  await events.DOMContentLoaded();
  refs[0].deliver({ routineClasses: [] });
  writes.deferred = [];
  vm.runInContext("saveState(true)", ctx);
  storage.set("calendar_263_sync_pending_v1", "FALL-2026-ABCD-EFGH");
  writes.deferred[0].resolve();
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(storage.get("calendar_263_sync_pending_v1"), "FALL-2026-ABCD-EFGH");
});

test("manual edits in another tab remain protected while waiting", async () => {
  const { ctx, events, refs, alerts, storage } = setup();
  await events.DOMContentLoaded();
  const code = storage.get("calendar_263_sync_code_v1");
  storage.set("calendar_263_sync_pending_v1", code);
  storage.set("calendar_263_routine_v1", JSON.stringify([
    { day: "SAT", start: "09:00", end: "10:00", code: "CSE1111", title: "Edited", room: "R" },
  ]));
  events.storage({ key: "calendar_263_sync_pending_v1", newValue: code });
  events.storage({ key: "calendar_263_routine_v1" });
  refs[0].deliver({ routineClasses: [{ title: "Remote" }] });
  assert.equal(vm.runInContext("routineClasses[0].title", ctx), "Edited");
  assert.match(alerts[0], /both preserved/);
});

test("manual saves mark pending before updating shared data", async () => {
  const { ctx, events, storageWrites } = setup();
  await events.DOMContentLoaded();
  storageWrites.length = 0;
  vm.runInContext('routineClasses[0].title = "Edited"; saveState()', ctx);
  assert.equal(storageWrites[0], "calendar_263_sync_pending_v1");
});

test("clearing a routine excludes its class IDs from shared progress", async () => {
  const storage = new Map([["calendar_263_sync_code_v1", "FALL-2026-ABCD-EFGH"]]);
  const { ctx, events } = setup(storage);
  await events.DOMContentLoaded();
  const elements = {
    "overall-percentage": {},
    "dash-completed-total": {},
    "dash-remaining-desc": {},
  };
  ctx.document.getElementById = (id) => elements[id] || null;
  vm.runInContext(`
    isDatePassed = () => true;
    syncPastClassesAndEvents();
    routineClasses = [{day: "SAT", start: "09:00", end: "10:00", code: "CSE1111", title: "Course", room: "R"}];
    syncPastRoutineClasses();
    routineClasses = [];
    originalRenderDashboard();
  `, ctx);
  assert.equal(elements["dash-completed-total"].innerText, 48);
  assert.equal(elements["overall-percentage"].innerText, "100%");
  assert.match(elements["dash-remaining-desc"].innerText, /^0 classes/);
});

test("pending local changes remain protected after a reload", async () => {
  const first = setup();
  await first.events.DOMContentLoaded();
  vm.runInContext('routineClasses[0].title = "Edited"; commitRoutine()', first.ctx);
  const reloaded = setup(first.storage);
  await reloaded.events.DOMContentLoaded();
  reloaded.refs[0].deliver({ routineClasses: [{ title: "Remote" }] });
  assert.equal(vm.runInContext("routineClasses[0].title", reloaded.ctx), "Edited");
  assert.equal(reloaded.refs[0].writes.length, 0);
  assert.match(reloaded.alerts[0], /both preserved/);
});

test("edits made without Firebase are protected on reconnect", async () => {
  const first = setup();
  await first.events.DOMContentLoaded();
  vm.runInContext('db = null; routineClasses[0].title = "Offline"; commitRoutine()', first.ctx);
  const reloaded = setup(first.storage);
  await reloaded.events.DOMContentLoaded();
  reloaded.refs[0].deliver({ routineClasses: [{ title: "Remote" }] });
  assert.equal(vm.runInContext("routineClasses[0].title", reloaded.ctx), "Offline");
  assert.equal(reloaded.refs[0].writes.length, 0);
  assert.match(reloaded.alerts[0], /both preserved/);
});

test("failed cloud writes keep local changes marked as unsynced", async () => {
  const { ctx, events, refs, alerts, storage, writes } = setup();
  await events.DOMContentLoaded();
  refs[0].deliver({ routineClasses: [{ title: "Remote" }] });
  writes.error = new Error("write denied");
  vm.runInContext('routineClasses = [{title: "Edited"}]; saveState()', ctx);
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(storage.get("calendar_263_sync_pending_v1"), "FALL-2026-ABCD-EFGH");
  assert.equal(JSON.parse(storage.get("calendar_263_routine_v1"))[0].title, "Edited");
  assert.match(alerts[0], /Sync failed/);
});

test("pending writes remain marked until the latest write is acknowledged", async () => {
  const { ctx, events, refs, storage, writes } = setup();
  await events.DOMContentLoaded();
  refs[0].deliver({ routineClasses: [{ title: "Remote" }] });
  writes.deferred = [];
  vm.runInContext('routineClasses = [{title: "First"}]; saveState(); routineClasses = [{title: "Second"}]; saveState()', ctx);
  assert.equal(storage.get("calendar_263_sync_pending_v1"), "FALL-2026-ABCD-EFGH");
  writes.deferred[0].resolve();
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(storage.get("calendar_263_sync_pending_v1"), "FALL-2026-ABCD-EFGH");
  writes.deferred[1].resolve();
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(storage.has("calendar_263_sync_pending_v1"), false);
});

test("a later automatic write keeps a user edit pending until acknowledged", async () => {
  const { ctx, events, refs, storage, writes } = setup();
  await events.DOMContentLoaded();
  refs[0].deliver({ routineClasses: [] });
  writes.deferred = [];
  vm.runInContext('routineClasses = [{title: "Edited"}]; saveState(); saveState(true)', ctx);
  writes.deferred[0].resolve();
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(storage.get("calendar_263_sync_pending_v1"), "FALL-2026-ABCD-EFGH");
  writes.deferred[1].resolve();
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(storage.has("calendar_263_sync_pending_v1"), false);
});

test("an older failed write does not interrupt a newer successful write", async () => {
  const { ctx, events, refs, alerts, storage, writes } = setup();
  await events.DOMContentLoaded();
  refs[0].deliver({ routineClasses: [{ title: "Remote" }] });
  writes.deferred = [];
  vm.runInContext('routineClasses = [{title: "First"}]; saveState(); routineClasses = [{title: "Second"}]; saveState()', ctx);
  writes.deferred[0].reject(new Error("older write failed"));
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(alerts.length, 0);
  assert.equal(storage.get("calendar_263_sync_pending_v1"), "FALL-2026-ABCD-EFGH");
  writes.deferred[1].resolve();
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(storage.has("calendar_263_sync_pending_v1"), false);
  assert.equal(vm.runInContext("isSyncReady", ctx), true);
});

test("reconnecting with unsynced changes requires confirmation", async () => {
  const { ctx, events, refs, storage } = setup();
  await events.DOMContentLoaded();
  vm.runInContext('routineClasses[0].title = "Edited"; commitRoutine()', ctx);
  ctx.document.getElementById = (id) => id === "input-sync-code" ? { value: "FALL-2026-ABCD-EFGH" } : null;
  ctx.confirm = () => false;
  vm.runInContext("connectSyncCode({ preventDefault() {} })", ctx);
  assert.equal(refs.length, 1);
  assert.equal(storage.get("calendar_263_sync_pending_v1"), "FALL-2026-ABCD-EFGH");
  ctx.confirm = () => true;
  vm.runInContext("connectSyncCode({ preventDefault() {} })", ctx);
  assert.equal(refs.length, 2);
  refs[1].deliver({ routineClasses: [{ title: "Remote" }] });
  assert.equal(vm.runInContext("routineClasses[0].title", ctx), "Remote");
});

test("switching sessions ignores callbacks from the detached session", async () => {
  const { ctx, events, refs } = setup();
  await events.DOMContentLoaded();
  vm.runInContext('syncCode = "FALL-2026-IJKL-MNPQ"; setupFirebaseSync()', ctx);
  assert.equal(refs[0].detached, true);
  refs[0].deliver({ routineClasses: [{ title: "Old session" }] });
  assert.equal(vm.runInContext("routineClasses[0].title", ctx), "Local");
  refs[1].deliver({ routineClasses: [{ title: "New session" }] });
  assert.equal(vm.runInContext("routineClasses[0].title", ctx), "New session");
});
