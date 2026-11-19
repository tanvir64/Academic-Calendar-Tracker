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
      setItem: (key, value) => storage.set(key, value),
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
    renderCalendar = renderDashboard = renderEvaluations = renderEvents = updateNavigation = () => {};
  `, ctx);
  return { ctx, events, refs, alerts, storage, writes };
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
