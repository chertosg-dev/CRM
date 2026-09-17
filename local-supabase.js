(() => {
  "use strict";

  const LOCAL_USER = {
    id: "00000000-0000-4000-8000-000000000001",
    email: "Τοπική αποθήκευση iPhone"
  };
  const REQUIRED_TABLES = [
    "insureds", "policies", "policy_coverages", "covered_members",
    "covered_member_coverages", "hospital_program_options",
    "diagnostic_package_options", "ife_options", "auto_policies",
    "payment_receipts"
  ];
  const DEFAULT_HOSPITAL_PROGRAMS = [
    "Βασική προστασία", "Προνομιακή προστασία", "Full Lux 0€", "Full Α 0€",
    "Full Α 500€", "Full B 500€", "Full Α 750€", "Full Β 750€",
    "Full Α 1.500€", "Full Β 1.500€", "Full Α 3.000€", "Full Β 3.000€",
    "Full Α 6.000€", "Full Β 6.000€", "Full Α 10.000€", "Full Β 10.000€",
    "Full Health Ειδικό (χωρίς διαβήτη)", "Full Health Ειδικό (με διαβήτη)",
    "Full Health Plus Α 1.500€", "Full Health Plus Β 1.500€",
    "Full Health Plus Α 3.000€", "Full Health Β 3.000€",
    "Full Health Plus Α 6.000€", "Full Health Β 6.000€", "Full Health Value",
    "ΠΛΕΟΝΕΚΤΙΚΟ"
  ];
  const DEFAULT_DIAGNOSTIC_PACKAGES = [
    "Full Απεριόριστο 0%", "Full 700€ 0%", "Full 700€ 10%",
    "Full 2.000€ 0%", "Full 2.000€ 10%", "Full Διάγνωση Ειδική Μέριμνα"
  ];
  const DEFAULT_IFE_OPTIONS = [
    ["500", "500€"], ["700", "700€"], ["1000", "1.000€"],
    ["2000", "2.000€"], ["3000", "3.000€"]
  ];
  const nativeStore = window.webkit?.messageHandlers?.localStore;
  const BROWSER_DATABASE_NAME = "tsertos-insurance-crm";
  const BROWSER_STORE_NAME = "app-state";
  const BROWSER_STATE_KEY = "primary";

  function openBrowserDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(BROWSER_DATABASE_NAME, 1);
      request.onupgradeneeded = () => {
        const database = request.result;
        if (!database.objectStoreNames.contains(BROWSER_STORE_NAME)) {
          database.createObjectStore(BROWSER_STORE_NAME);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("Δεν άνοιξε η τοπική βάση."));
    });
  }

  async function readBrowserState() {
    const database = await openBrowserDatabase();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(BROWSER_STORE_NAME, "readonly");
      const request = transaction.objectStore(BROWSER_STORE_NAME).get(BROWSER_STATE_KEY);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error || new Error("Δεν διαβάστηκε η τοπική βάση."));
      transaction.oncomplete = () => database.close();
      transaction.onabort = () => database.close();
    });
  }

  async function writeBrowserState(state) {
    const database = await openBrowserDatabase();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(BROWSER_STORE_NAME, "readwrite");
      transaction.objectStore(BROWSER_STORE_NAME).put(clone(state), BROWSER_STATE_KEY);
      transaction.oncomplete = () => {
        database.close();
        resolve({ saved: true });
      };
      transaction.onerror = () => {
        database.close();
        reject(transaction.error || new Error("Δεν αποθηκεύτηκε η τοπική βάση."));
      };
      transaction.onabort = transaction.onerror;
    });
  }

  const browserStore = {
    async postMessage(message) {
      if (message?.action === "load") return readBrowserState();
      if (message?.action === "save") return writeBrowserState(message.state);
      throw new Error("Άγνωστη ενέργεια τοπικής βάσης.");
    }
  };
  const persistentStore = nativeStore || browserStore;

  function clone(value) {
    return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
  }

  function localUuid() {
    if (window.crypto?.randomUUID) return window.crypto.randomUUID();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, character => {
      const random = Math.random() * 16 | 0;
      const value = character === "x" ? random : (random & 0x3 | 0x8);
      return value.toString(16);
    });
  }

  function mergeDefaultOptions(rows, defaults, idPrefix) {
    const existingRows = Array.isArray(rows) ? rows : [];
    const existingValues = new Set(
      existingRows.map(row => String(row?.value ?? "")).filter(Boolean)
    );

    defaults.forEach((option, index) => {
      const value = Array.isArray(option) ? option[0] : option;
      const label = Array.isArray(option) ? option[1] : null;
      if (existingValues.has(String(value))) return;
      existingRows.push({
        id: `local-${idPrefix}-${index + 1}`,
        value: String(value),
        ...(label ? { label } : {}),
        sort_order: index + 1,
        active: true
      });
      existingValues.add(String(value));
    });

    return existingRows;
  }

  function normalizeState(input) {
    const state = input && typeof input === "object" ? input : {};
    state.schema_version = 3;
    state.tables = state.tables && typeof state.tables === "object" ? state.tables : {};
    REQUIRED_TABLES.forEach(table => {
      if (!Array.isArray(state.tables[table])) state.tables[table] = [];
    });
    state.tables.hospital_program_options = mergeDefaultOptions(
      state.tables.hospital_program_options,
      DEFAULT_HOSPITAL_PROGRAMS,
      "hospital"
    );
    state.tables.diagnostic_package_options = mergeDefaultOptions(
      state.tables.diagnostic_package_options,
      DEFAULT_DIAGNOSTIC_PACKAGES,
      "diagnostic"
    );
    state.tables.ife_options = mergeDefaultOptions(
      state.tables.ife_options,
      DEFAULT_IFE_OPTIONS,
      "ife"
    );
    return state;
  }

  const store = {
    state: null,
    loading: null,
    writeQueue: Promise.resolve(),

    async ready() {
      if (this.state) return this.state;
      if (!this.loading) {
        this.loading = persistentStore.postMessage({ action: "load" });
        if (!nativeStore && navigator.storage?.persist) {
          navigator.storage.persist().catch(() => false);
        }
      }
      this.state = normalizeState(await this.loading);
      await persistentStore.postMessage({ action: "save", state: this.state });
      return this.state;
    },

    async read(work) {
      await this.ready();
      await this.writeQueue.catch(() => {});
      return work(this.state);
    },

    mutate(work) {
      const perform = async () => {
        await this.ready();
        const previous = clone(this.state);
        try {
          const result = work(this.state);
          await persistentStore.postMessage({ action: "save", state: this.state });
          return result;
        } catch (error) {
          this.state = previous;
          throw error;
        }
      };
      this.writeQueue = this.writeQueue.then(perform, perform);
      return this.writeQueue;
    }
  };

  function rowMatches(row, filters) {
    return filters.every(filter => {
      const value = row?.[filter.column];
      if (filter.type === "eq") return value === filter.value;
      if (filter.type === "in") return filter.values.includes(value);
      return true;
    });
  }

  function projectedRows(rows, columns) {
    if (!columns || columns === "*") return clone(rows);
    const fields = String(columns).split(",").map(field => field.trim()).filter(Boolean);
    return rows.map(row => Object.fromEntries(fields.map(field => [field, row?.[field] ?? null])));
  }

  function sortedRows(rows, orders) {
    if (!orders.length) return rows;
    return [...rows].sort((left, right) => {
      for (const order of orders) {
        const leftValue = left?.[order.column];
        const rightValue = right?.[order.column];
        if (leftValue === rightValue) continue;
        if (leftValue === null || leftValue === undefined) return order.ascending ? -1 : 1;
        if (rightValue === null || rightValue === undefined) return order.ascending ? 1 : -1;
        const comparison = String(leftValue).localeCompare(String(rightValue), "el", {
          numeric: true,
          sensitivity: "base"
        });
        if (comparison) return order.ascending ? comparison : -comparison;
      }
      return 0;
    });
  }

  function prepareRow(source, existing = null) {
    const now = new Date().toISOString();
    return {
      ...(existing || {}),
      ...clone(source || {}),
      id: source?.id || existing?.id || localUuid(),
      created_at: existing?.created_at || source?.created_at || now,
      updated_at: now
    };
  }

  function cascadeDeletedRows(state, table, deletedRows) {
    const tables = state.tables;
    if (!deletedRows.length) return;

    if (table === "insureds") {
      const insuredIds = new Set(deletedRows.map(row => row.id));
      const deletedPolicies = tables.policies.filter(row => insuredIds.has(row.insured_id));
      tables.policies = tables.policies.filter(row => !insuredIds.has(row.insured_id));
      tables.auto_policies = tables.auto_policies.filter(row => !insuredIds.has(row.insured_id));
      cascadeDeletedRows(state, "policies", deletedPolicies);
    } else if (table === "policies") {
      const policyIds = new Set(deletedRows.map(row => row.id));
      const deletedMembers = tables.covered_members.filter(row => policyIds.has(row.policy_id));
      tables.policy_coverages = tables.policy_coverages.filter(row => !policyIds.has(row.policy_id));
      tables.covered_members = tables.covered_members.filter(row => !policyIds.has(row.policy_id));
      cascadeDeletedRows(state, "covered_members", deletedMembers);
    } else if (table === "covered_members") {
      const memberIds = new Set(deletedRows.map(row => row.id));
      tables.covered_member_coverages = tables.covered_member_coverages
        .filter(row => !memberIds.has(row.covered_member_id));
    }
  }

  class LocalQuery {
    constructor(table) {
      this.table = table;
      this.operation = null;
      this.values = null;
      this.filters = [];
      this.orders = [];
      this.columns = "*";
      this.returnColumns = null;
      this.singleResult = false;
      this.upsertOptions = {};
      this.execution = null;
    }

    select(columns = "*") {
      if (this.operation && this.operation !== "select") {
        this.returnColumns = columns;
      } else {
        this.operation = "select";
        this.columns = columns;
      }
      return this;
    }

    insert(values) {
      this.operation = "insert";
      this.values = values;
      return this;
    }

    update(values) {
      this.operation = "update";
      this.values = values;
      return this;
    }

    upsert(values, options = {}) {
      this.operation = "upsert";
      this.values = values;
      this.upsertOptions = options || {};
      return this;
    }

    delete() {
      this.operation = "delete";
      return this;
    }

    eq(column, value) {
      this.filters.push({ type: "eq", column, value });
      return this;
    }

    in(column, values) {
      this.filters.push({ type: "in", column, values: Array.isArray(values) ? values : [] });
      return this;
    }

    order(column, options = {}) {
      this.orders.push({ column, ascending: options.ascending !== false });
      return this;
    }

    single() {
      this.singleResult = true;
      return this;
    }

    then(resolve, reject) {
      return this.execute().then(resolve, reject);
    }

    execute() {
      if (!this.execution) {
        this.execution = this.run().catch(error => ({
          data: null,
          error: { message: error?.message || "Σφάλμα τοπικής αποθήκευσης", code: "LOCAL_DB_ERROR" }
        }));
      }
      return this.execution;
    }

    async run() {
      if (!REQUIRED_TABLES.includes(this.table)) {
        throw new Error(`Άγνωστος τοπικός πίνακας: ${this.table}`);
      }
      if (!this.operation) this.operation = "select";

      if (this.operation === "select") {
        return store.read(state => {
          let rows = state.tables[this.table].filter(row => rowMatches(row, this.filters));
          rows = sortedRows(rows, this.orders);
          return this.result(projectedRows(rows, this.columns));
        });
      }

      return store.mutate(state => {
        const rows = state.tables[this.table];
        let affected = [];

        if (this.operation === "insert") {
          affected = (Array.isArray(this.values) ? this.values : [this.values]).map(value => prepareRow(value));
          state.tables[this.table] = rows.concat(affected);
        } else if (this.operation === "update") {
          state.tables[this.table] = rows.map(row => {
            if (!rowMatches(row, this.filters)) return row;
            const updated = prepareRow(this.values, row);
            affected.push(updated);
            return updated;
          });
        } else if (this.operation === "delete") {
          affected = rows.filter(row => rowMatches(row, this.filters));
          state.tables[this.table] = rows.filter(row => !rowMatches(row, this.filters));
          cascadeDeletedRows(state, this.table, affected);
        } else if (this.operation === "upsert") {
          const conflictFields = String(this.upsertOptions.onConflict || "id")
            .split(",").map(field => field.trim()).filter(Boolean);
          for (const value of (Array.isArray(this.values) ? this.values : [this.values])) {
            const index = state.tables[this.table].findIndex(row =>
              conflictFields.every(field => row?.[field] === value?.[field])
            );
            if (index >= 0) {
              const updated = prepareRow(value, state.tables[this.table][index]);
              state.tables[this.table][index] = updated;
              affected.push(updated);
            } else {
              const inserted = prepareRow(value);
              state.tables[this.table].push(inserted);
              affected.push(inserted);
            }
          }
        }

        const data = this.returnColumns ? projectedRows(affected, this.returnColumns) : null;
        return this.result(data);
      });
    }

    result(data) {
      if (!this.singleResult) return { data, error: null };
      const rows = Array.isArray(data) ? data : [];
      return rows.length
        ? { data: rows[0], error: null }
        : { data: null, error: { message: "Δεν βρέθηκε εγγραφή.", code: "LOCAL_NOT_FOUND" } };
    }
  }

  const localSession = { user: LOCAL_USER, access_token: "local-only" };
  window.__TSERTOS_LOCAL_ONLY__ = true;
  document.documentElement.classList.add("local-only-mode");
  window.createLocalSupabaseClient = () => ({
    from: table => new LocalQuery(table),
    auth: {
      getSession: async () => ({ data: { session: localSession }, error: null }),
      onAuthStateChange: callback => {
        queueMicrotask(() => callback?.("INITIAL_SESSION", localSession));
        return { data: { subscription: { unsubscribe() {} } } };
      },
      signInWithPassword: async () => ({ data: { session: localSession, user: LOCAL_USER }, error: null }),
      signUp: async () => ({ data: { session: localSession, user: LOCAL_USER }, error: null }),
      signOut: async () => ({ error: null }),
      resetPasswordForEmail: async () => ({ error: null }),
      updateUser: async () => ({ data: { user: LOCAL_USER }, error: null })
    }
  });
})();
