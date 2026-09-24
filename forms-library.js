(() => {
  "use strict";

  const VERSION = "1.1.22";
  const LAST_TEMPLATE_KEY = "tsertos.forms.lastTemplateId.v1";
  const DB_NAME = "tsertos-form-library";
  const DB_VERSION = 2;
  const STORE = "templates";
  const PROFILE_STORE = "mappingProfiles";
  const PDF_LIB_PRIMARY = "https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js";
  const PDF_LIB_FALLBACK = "https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js";
  const PDF_JS_PRIMARY = "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js";
  const PDF_JS_FALLBACK = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
  const PDF_JS_WORKER = "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js";
  const TESSERACT_JS_PRIMARY = "https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js";
  const TESSERACT_JS_FALLBACK = "https://unpkg.com/tesseract.js@5.1.1/dist/tesseract.min.js";

  const sourceDefinitions = [
    ["", "— Να μη συμπληρώνεται —", ""],
    ["person.fullName", "Ονοματεπώνυμο προσώπου", "Πρόσωπο"],
    ["person.firstName", "Όνομα", "Πρόσωπο"],
    ["person.lastName", "Επώνυμο", "Πρόσωπο"],
    ["person.company", "Εταιρεία / Επωνυμία", "Πρόσωπο"],
    ["person.phone", "Τηλέφωνο", "Πρόσωπο"],
    ["person.email", "Email", "Πρόσωπο"],
    ["person.afm", "ΑΦΜ", "Πρόσωπο"],
    ["person.dou", "ΔΟΥ", "Πρόσωπο"],
    ["person.adt", "ΑΔΤ / Αρ. ταυτότητας", "Πρόσωπο"],
    ["person.birthDate", "Ημερομηνία γέννησης", "Πρόσωπο"],
    ["person.address", "Πλήρης διεύθυνση", "Πρόσωπο"],
    ["person.street", "Οδός", "Πρόσωπο"],
    ["person.streetNumber", "Αριθμός οδού", "Πρόσωπο"],
    ["person.area", "Περιοχή", "Πρόσωπο"],
    ["person.postalCode", "ΤΚ", "Πρόσωπο"],
    ["person.notes", "Σημειώσεις", "Πρόσωπο"],
    ["insured.fullName", "Ονοματεπώνυμο κύριου ασφαλισμένου", "Κύριος ασφαλισμένος"],
    ["insured.afm", "ΑΦΜ κύριου ασφαλισμένου", "Κύριος ασφαλισμένος"],
    ["insured.phone", "Τηλέφωνο κύριου ασφαλισμένου", "Κύριος ασφαλισμένος"],
    ["insured.email", "Email κύριου ασφαλισμένου", "Κύριος ασφαλισμένος"],
    ["insured.address", "Διεύθυνση κύριου ασφαλισμένου", "Κύριος ασφαλισμένος"],
    ["contract.number", "Αριθμός επιλεγμένου συμβολαίου", "Επιλεγμένο συμβόλαιο"],
    ["contract.type", "Τύπος συμβολαίου (Ζωής / Αυτοκινήτου)", "Επιλεγμένο συμβόλαιο"],
    ["contract.product", "Προϊόν / Πακέτο επιλεγμένου συμβολαίου", "Επιλεγμένο συμβόλαιο"],
    ["contract.startDate", "Ημερομηνία έναρξης επιλεγμένου συμβολαίου", "Επιλεγμένο συμβόλαιο"],
    ["contract.endDate", "Ημερομηνία λήξης επιλεγμένου συμβολαίου", "Επιλεγμένο συμβόλαιο"],
    ["policy.number", "Αριθμός συμβολαίου Ζωής", "Ζωής"],
    ["policy.product", "Προϊόν συμβολαίου Ζωής", "Ζωής"],
    ["policy.startDate", "Ημερομηνία έναρξης Ζωής", "Ζωής"],
    ["policy.tariff", "Τιμολόγιο", "Συμβόλαιο"],
    ["policy.hospitalProgram", "Νοσοκομειακό πρόγραμμα", "Συμβόλαιο"],
    ["policy.diagnosticPackage", "Διαγνωστικές εξετάσεις", "Συμβόλαιο"],
    ["auto.policyNumber", "Αρ. συμβολαίου αυτοκινήτου", "Αυτοκίνητο"],
    ["auto.registrationNumber", "Αριθμός κυκλοφορίας", "Αυτοκίνητο"],
    ["auto.startDate", "Έναρξη αυτοκινήτου", "Αυτοκίνητο"],
    ["auto.endDate", "Λήξη αυτοκινήτου", "Αυτοκίνητο"],
    ["auto.packageName", "Πακέτο αυτοκινήτου", "Αυτοκίνητο"],
    ["auto.insuredValue", "Ασφαλιζόμενη αξία", "Αυτοκίνητο"],
    ["vehicleReg.make", "Μάρκα (D.1)", "Άδεια Κυκλοφορίας"],
    ["vehicleReg.type", "Τύπος (D.2)", "Άδεια Κυκλοφορίας"],
    ["vehicleReg.firstRegistration", "Ημερομηνία έκδοσης πρώτης άδειας κυκλοφορίας (B)", "Άδεια Κυκλοφορίας"],
    ["vehicleReg.firstRegistrationGreece", "Ημερομηνία πρώτης άδειας στην Ελλάδα (4)", "Άδεια Κυκλοφορίας"],
    ["vehicleReg.vin", "Αριθμός πλαισίου / VIN (E)", "Άδεια Κυκλοφορίας"],
    ["vehicleReg.engineNumber", "Αριθμός κινητήρα (P.5)", "Άδεια Κυκλοφορίας"],
    ["vehicleReg.fuel", "Καύσιμο (P.3)", "Άδεια Κυκλοφορίας"],
    ["vehicleReg.color", "Χρώμα (R)", "Άδεια Κυκλοφορίας"],
    ["date.today", "Τρέχουσα ημερομηνία (ΗΗ/ΜΜ/ΕΕΕΕ)", "Ημερομηνίες"]
  ];

  const TEMPLATE_CATEGORIES = [
    "Ζωή / Υγεία",
    "Αυτοκίνητο",
    "Κατοικία / Περιουσία",
    "Ζημιές / Αποζημιώσεις",
    "Αιτήσεις / Δηλώσεις",
    "Εξουσιοδοτήσεις / Συγκαταθέσεις",
    "Λοιπά"
  ];

  let templateSearchQuery = "";
  let templateCategoryFilter = "";
  let templateViewMode = "all";
  let templateDetailsResolver = null;
  let templateDetailsEditingId = null;

  let templates = [];
  let selectedTemplateId = null;
  let selectedCustomerId = null;
  let selectedPolicySource = "";
  let selectedPersonId = "insured";
  let generatedBlob = null;
  let generatedObjectURL = null;
  let currentMapTemplate = null;
  let pdfLibPromise = null;
  let pdfJsPromise = null;
  let tesseractPromise = null;
  let pdfJsWorkerObjectURL = null;
  let visualPdfDoc = null;
  let visualPageIndex = 0;
  let visualDraft = [];
  let visualRenderSeq = 0;
  let visualPageCssScale = 1;
  let visualDragState = null;
  let replaceTemplateId = null;
  let pickerCategory = "";
  let pickerSearchQuery = "";
  let supplementDraft = [];
  let supplementalFileName = "";
  let supplementalText = "";
  let supplementalFormValues = {};
  let supplementalValues = {};
  let vehicleRegFileName = "";
  let vehicleRegText = "";
  let vehicleRegValues = {};

  const $ = id => document.getElementById(id);
  const esc = value => String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[ch]);

  function normalizeText(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("el-GR")
      .replace(/[^a-z0-9α-ω]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function uid() {
    return crypto.randomUUID ? crypto.randomUUID() : `form-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function formatDateGR(value) {
    if (!value) return "";
    const raw = String(value);
    const iso = /^\d{4}-\d{2}-\d{2}$/.test(raw);
    const date = new Date(iso ? `${raw}T00:00:00` : raw);
    return Number.isNaN(date.getTime()) ? raw : date.toLocaleDateString("el-GR");
  }

  function formatTodayGR() {
    const now = new Date();
    const pad = value => String(value).padStart(2, "0");
    return `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`;
  }

  function categoryOptionsMarkup(selected = "Λοιπά", includeAll = false) {
    const options = [];
    if (includeAll) options.push(`<option value="">Όλες οι κατηγορίες</option>`);
    TEMPLATE_CATEGORIES.forEach(category => options.push(`<option value="${esc(category)}" ${category === selected ? "selected" : ""}>${esc(category)}</option>`));
    return options.join("");
  }

  function displayName(person) {
    if (!person) return "";
    return [person.firstName, person.lastName].filter(Boolean).join(" ").trim() || person.company || "Χωρίς όνομα";
  }

  function fullAddress(person) {
    if (!person) return "";
    const line = [person.street, person.streetNumber].filter(Boolean).join(" ").trim();
    return [line, person.area, person.postalCode].filter(Boolean).join(", ");
  }

  function customersArray() {
    try {
      const api = window.TSERTOS_CRM_FORMS_API;
      const items = api?.getCustomers?.();
      return Array.isArray(items) ? items : [];
    } catch (_) {
      return [];
    }
  }

  function autoPoliciesArray() {
    try {
      const api = window.TSERTOS_CRM_FORMS_API;
      const items = api?.getAutoPolicies?.();
      return Array.isArray(items) ? items : [];
    } catch (_) {
      return [];
    }
  }

  function openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE)) {
          const store = db.createObjectStore(STORE, { keyPath: "id" });
          store.createIndex("createdAt", "createdAt");
        }
        if (!db.objectStoreNames.contains(PROFILE_STORE)) {
          const profileStore = db.createObjectStore(PROFILE_STORE, { keyPath: "key" });
          profileStore.createIndex("updatedAt", "updatedAt");
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("Δεν άνοιξε η βιβλιοθήκη εντύπων."));
    });
  }

  async function dbGetAll() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readonly");
      const req = tx.objectStore(STORE).getAll();
      req.onsuccess = () => resolve((req.result || []).sort((a,b) => String(b.createdAt||"").localeCompare(String(a.createdAt||""))));
      req.onerror = () => reject(req.error);
      tx.oncomplete = () => db.close();
      tx.onabort = () => db.close();
    });
  }

  async function dbPut(template) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).put(template);
      tx.oncomplete = () => { db.close(); resolve(template); };
      tx.onerror = () => { db.close(); reject(tx.error); };
      tx.onabort = tx.onerror;
    });
  }

  async function dbDelete(id) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).delete(id);
      tx.oncomplete = () => { db.close(); resolve(); };
      tx.onerror = () => { db.close(); reject(tx.error); };
      tx.onabort = tx.onerror;
    });
  }

  async function dbGetAllProfiles() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(PROFILE_STORE, "readonly");
      const req = tx.objectStore(PROFILE_STORE).getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
      tx.oncomplete = () => db.close();
      tx.onabort = () => db.close();
    });
  }

  async function dbPutProfile(profile) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(PROFILE_STORE, "readwrite");
      tx.objectStore(PROFILE_STORE).put(profile);
      tx.oncomplete = () => { db.close(); resolve(profile); };
      tx.onerror = () => { db.close(); reject(tx.error); };
      tx.onabort = tx.onerror;
    });
  }

  function exactArrayBuffer(value) {
    if (!value) return null;
    if (value instanceof ArrayBuffer) return value.slice(0);
    if (ArrayBuffer.isView(value)) {
      const start = value.byteOffset || 0;
      const end = start + value.byteLength;
      return value.buffer.slice(start, end);
    }
    return null;
  }

  function localFingerprintPdfBytes(value) {
    const buffer = exactArrayBuffer(value);
    if (!buffer) return "";
    const bytes = new Uint8Array(buffer);
    let h1 = 2166136261 >>> 0;
    let h2 = 2246822519 >>> 0;
    for (let i = 0; i < bytes.length; i += 1) {
      const valueByte = bytes[i];
      h1 ^= valueByte;
      h1 = Math.imul(h1, 16777619) >>> 0;
      h2 ^= (valueByte + (i & 255));
      h2 = Math.imul(h2, 3266489917) >>> 0;
    }
    return `local:${bytes.length}:${h1.toString(16).padStart(8, "0")}${h2.toString(16).padStart(8, "0")}`;
  }

  async function fingerprintPdfBytes(value) {
    const buffer = exactArrayBuffer(value);
    if (!buffer) return "";
    const bytes = new Uint8Array(buffer);
    try {
      if (crypto?.subtle?.digest) {
        const digest = await crypto.subtle.digest("SHA-256", bytes);
        return `sha256:${Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("")}`;
      }
    } catch (error) {
      console.warn("SHA-256 fingerprint unavailable; using local fallback", error);
    }
    return localFingerprintPdfBytes(buffer);
  }

  function rememberSelectedTemplate(id) {
    selectedTemplateId = id || null;
    try {
      if (selectedTemplateId) localStorage.setItem(LAST_TEMPLATE_KEY, selectedTemplateId);
      else localStorage.removeItem(LAST_TEMPLATE_KEY);
    } catch (_) {}
  }

  function restoreSelectedTemplate() {
    if (selectedTemplateId && templates.some(item => item.id === selectedTemplateId)) return;
    let stored = "";
    try { stored = localStorage.getItem(LAST_TEMPLATE_KEY) || ""; } catch (_) {}
    if (stored && templates.some(item => item.id === stored)) {
      selectedTemplateId = stored;
      return;
    }
    selectedTemplateId = templates.length === 1 ? templates[0].id : null;
    if (selectedTemplateId) {
      try { localStorage.setItem(LAST_TEMPLATE_KEY, selectedTemplateId); } catch (_) {}
    }
  }

  function useTemplate(id, message = "") {
    const template = templates.find(item => item.id === id);
    if (!template) return;
    const changed = selectedTemplateId !== id;
    rememberSelectedTemplate(id);
    if (changed) clearSupplementDocument(false);
    const lastUsedAt = new Date().toISOString();
    template.lastUsedAt = lastUsedAt;
    dbPut({ ...template, lastUsedAt }).catch(error => console.warn("Δεν αποθηκεύτηκε το πρόσφατο έντυπο", error));
    renderTemplates();
    renderSelectedTemplateSummary();
    renderVehicleRegistrationSection();
    renderSupplementSection();
    const mappedCount = templateMappedCount(template);
    if (message) setStatus(message, mappedCount ? "success" : "warning");
    else if (mappedCount) setStatus(`Το πρότυπο «${template.name || template.originalName || "Έντυπο"}» είναι έτοιμο με ${mappedCount} αποθηκευμένες αντιστοιχίσεις. Επίλεξε πελάτη και πάτησε «Αυτόματη συμπλήρωση».`, "success");
    else setStatus("Το πρότυπο δεν έχει ακόμη αντιστοίχιση πεδίων.", "warning");
  }

  function templateMappedCount(template) {
    const acroMapped = Object.values(template?.mapping || {}).filter(Boolean).length;
    const visualMapped = Array.isArray(template?.visualFields) ? template.visualFields.filter(item => item?.sourceKey).length : 0;
    return acroMapped + visualMapped;
  }

  function normalizedTemplateFileName(value) {
    return String(value || "")
      .normalize("NFC")
      .trim()
      .toLocaleLowerCase("el-GR")
      .replace(/\.pdf$/i, "")
      .replace(/\s+/g, " ");
  }

  function profileMappedCount(profile) {
    const acroMapped = Object.values(profile?.mapping || {}).filter(Boolean).length;
    const visualMapped = Array.isArray(profile?.visualFields) ? profile.visualFields.filter(item => item?.sourceKey).length : 0;
    return acroMapped + visualMapped;
  }

  async function persistMappingProfile(template) {
    if (!template || templateMappedCount(template) < 1) return null;
    let fingerprint = template.fingerprint || "";
    let byteFingerprint = template.byteFingerprint || "";
    if (!fingerprint || !byteFingerprint) {
      try {
        const bytes = await templatePdfArrayBuffer(template);
        fingerprint = fingerprint || await fingerprintPdfBytes(bytes);
        byteFingerprint = byteFingerprint || localFingerprintPdfBytes(bytes);
      } catch (error) {
        console.warn("Δεν δημιουργήθηκε fingerprint για την αποθηκευμένη αντιστοίχιση", error);
      }
    }
    const normalizedName = normalizedTemplateFileName(template.originalName || template.name);
    const key = fingerprint || byteFingerprint || (normalizedName ? `name:${normalizedName}` : `mapping:${template.id}`);
    const profile = {
      key,
      fingerprint,
      byteFingerprint,
      normalizedName,
      displayName: template.name || template.originalName || "Έντυπο",
      originalName: template.originalName || "",
      category: template.category || "Λοιπά",
      mapping: { ...(template.mapping || {}) },
      visualFields: Array.isArray(template.visualFields) ? template.visualFields.map(item => ({ ...item })) : [],
      supplementFields: Array.isArray(template.supplementFields) ? template.supplementFields.map(item => ({ ...item })) : [],
      sourceTemplateId: template.id,
      createdAt: template.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await dbPutProfile(profile);
    return profile;
  }

  async function migrateExistingMappingsToProfiles() {
    for (const template of templates) {
      if (templateMappedCount(template) < 1) continue;
      try { await persistMappingProfile(template); } catch (error) { console.warn("Δεν μεταφέρθηκε παλιά αντιστοίχιση", template?.id, error); }
    }
  }

  async function findSavedMappingProfile(fingerprint, byteFingerprint, fileName = "") {
    const profiles = await dbGetAllProfiles();
    const normalizedName = normalizedTemplateFileName(fileName);
    const exact = profiles
      .filter(profile => profileMappedCount(profile) > 0)
      .find(profile =>
        (fingerprint && profile.fingerprint === fingerprint) ||
        (byteFingerprint && profile.byteFingerprint === byteFingerprint)
      );
    if (exact) return exact;
    if (!normalizedName) return null;
    const sameName = profiles
      .filter(profile => profileMappedCount(profile) > 0 && profile.normalizedName === normalizedName)
      .sort((a,b) => String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")));
    return sameName.length === 1 ? sameName[0] : null;
  }

  async function applyProfileToTemplate(template, profile) {
    if (!template || !profile) return null;
    const updated = {
      ...template,
      mapping: { ...(profile.mapping || {}) },
      visualFields: Array.isArray(profile.visualFields) ? profile.visualFields.map(item => ({ ...item })) : [],
      supplementFields: Array.isArray(profile.supplementFields) ? profile.supplementFields.map(item => ({ ...item })) : (Array.isArray(template.supplementFields) ? template.supplementFields.map(item => ({ ...item })) : []),
      mappingProfileKey: profile.key,
      category: template.category || profile.category || "Λοιπά",
      updatedAt: new Date().toISOString(),
      version: Math.max(Number(template.version) || 1, 4)
    };
    await dbPut(updated);
    await persistMappingProfile(updated);
    const index = templates.findIndex(item => item.id === updated.id);
    if (index >= 0) templates[index] = updated;
    return updated;
  }

  async function manualRelinkTemplate(id) {
    const template = templates.find(item => item.id === id);
    if (!template) return;
    const profiles = (await dbGetAllProfiles())
      .filter(profile => profileMappedCount(profile) > 0)
      .sort((a,b) => {
        const sameA = profileNameMatch(profileName(a), template) ? 1 : 0;
        const sameB = profileNameMatch(profileName(b), template) ? 1 : 0;
        if (sameA !== sameB) return sameB - sameA;
        return String(b.updatedAt || "").localeCompare(String(a.updatedAt || ""));
      });
    if (!profiles.length) {
      setStatus("Δεν υπάρχουν ακόμη αποθηκευμένες αντιστοιχίσεις για σύνδεση.", "warning");
      return;
    }
    const choices = profiles.slice(0, 20);
    const lines = choices.map((profile, index) => `${index + 1}. ${profile.displayName || profile.originalName || "Έντυπο"} · ${profileMappedCount(profile)} πεδία`);
    const answer = window.prompt(`Επίλεξε έτοιμη αντιστοίχιση για το «${template.name || template.originalName || "Έντυπο"}»:\n\n${lines.join("\n")}\n\nΓράψε τον αριθμό της επιλογής:`);
    if (answer == null) return;
    const selected = choices[Number(answer) - 1];
    if (!selected) { setStatus("Δεν επιλέχθηκε έγκυρη αντιστοίχιση.", "warning"); return; }
    const updated = await applyProfileToTemplate(template, selected);
    await refreshTemplates();
    useTemplate(updated.id, `Συνδέθηκε η έτοιμη αντιστοίχιση «${selected.displayName || selected.originalName || "Έντυπο"}». Δεν χρειάζεται να ξαναστήσεις τα πεδία.`);
  }

  function profileName(profile) { return normalizedTemplateFileName(profile?.originalName || profile?.displayName); }
  function profileNameMatch(name, template) {
    if (!name) return false;
    return name === normalizedTemplateFileName(template?.originalName) || name === normalizedTemplateFileName(template?.name);
  }

  function findLegacyMappedTemplateForFile(file) {
    const wanted = normalizedTemplateFileName(file?.name);
    if (!wanted) return null;
    const candidates = templates
      .filter(template => templateMappedCount(template) > 0)
      .filter(template => {
        const original = normalizedTemplateFileName(template?.originalName);
        const display = normalizedTemplateFileName(template?.name);
        return original === wanted || display === wanted;
      })
      .sort((a, b) => {
        const selectedA = a.id === selectedTemplateId ? 1 : 0;
        const selectedB = b.id === selectedTemplateId ? 1 : 0;
        if (selectedA !== selectedB) return selectedB - selectedA;
        const mappedDiff = templateMappedCount(b) - templateMappedCount(a);
        if (mappedDiff) return mappedDiff;
        return String(b.updatedAt || b.createdAt || "").localeCompare(String(a.updatedAt || a.createdAt || ""));
      });
    return candidates[0] || null;
  }

  async function relinkLegacyMappedTemplate(template, file, pdfBytes, fingerprint, byteFingerprint) {
    const fields = await inspectPdf(pdfBytes);
    const previousMapping = template?.mapping || {};
    const mapping = {};
    if (fields.length) {
      fields.forEach(field => {
        mapping[field.name] = previousMapping[field.name] || guessSource(field.name);
      });
    }
    const updated = {
      ...template,
      originalName: file.name || template.originalName,
      pdfBytes: pdfBytes.slice(0),
      fingerprint,
      byteFingerprint,
      storageVersion: 2,
      fields,
      mapping: fields.length ? mapping : previousMapping,
      visualFields: Array.isArray(template?.visualFields) ? template.visualFields.map(item => ({ ...item })) : [],
      updatedAt: new Date().toISOString(),
      version: Math.max(Number(template?.version) || 1, 3)
    };
    delete updated.pdfBlob;
    await dbPut(updated);
    const index = templates.findIndex(item => item.id === updated.id);
    if (index >= 0) templates[index] = updated;
    rememberSelectedTemplate(updated.id);
    await refreshTemplates();
    return updated;
  }

  async function findDuplicateTemplate(pdfBytes, fingerprint = "") {
    const wanted = fingerprint || await fingerprintPdfBytes(pdfBytes);
    const wantedLocal = localFingerprintPdfBytes(pdfBytes);
    if (!wanted && !wantedLocal) return null;

    for (let index = 0; index < templates.length; index += 1) {
      let template = templates[index];
      let existingFingerprint = template?.fingerprint || "";
      let existingLocal = template?.byteFingerprint || (existingFingerprint.startsWith("local:") ? existingFingerprint : "");

      // Always keep a deterministic byte fingerprint as a second identity.
      // This makes exact duplicate recognition stable even when WebKit switches
      // between SHA-256 and the offline fallback in different launches.
      if (!existingLocal || !existingFingerprint) {
        try {
          const existingBytes = await templatePdfArrayBuffer(template);
          existingLocal = existingLocal || localFingerprintPdfBytes(existingBytes);
          existingFingerprint = existingFingerprint || await fingerprintPdfBytes(existingBytes);
          const migrated = {
            ...template,
            fingerprint: existingFingerprint,
            byteFingerprint: existingLocal,
            updatedAt: template.updatedAt || new Date().toISOString()
          };
          await dbPut(migrated);
          templates[index] = migrated;
          template = migrated;
        } catch (error) {
          console.warn("Δεν ήταν δυνατός ο έλεγχος διπλότυπου για παλιό έντυπο", template?.id, error);
        }
      }

      if ((wanted && existingFingerprint === wanted) || (wantedLocal && existingLocal === wantedLocal)) return template;
    }
    return null;
  }

  async function templatePdfArrayBuffer(template, migrate = true) {
    const stored = exactArrayBuffer(template?.pdfBytes);
    if (stored) return stored;

    if (template?.pdfBlob && typeof template.pdfBlob.arrayBuffer === "function") {
      try {
        const buffer = await template.pdfBlob.arrayBuffer();
        if (migrate) {
          const migrated = { ...template, pdfBytes: buffer.slice(0), updatedAt: new Date().toISOString(), storageVersion: 2 };
          delete migrated.pdfBlob;
          await dbPut(migrated);
          const index = templates.findIndex(item => item.id === migrated.id);
          if (index >= 0) templates[index] = migrated;
          if (currentMapTemplate?.id === migrated.id) currentMapTemplate = migrated;
          Object.keys(template).forEach(key => delete template[key]);
          Object.assign(template, migrated);
        }
        return buffer;
      } catch (error) {
        const replacementError = new Error("Το iPhone δεν μπορεί πλέον να διαβάσει το αποθηκευμένο αντίγραφο αυτού του PDF. Πάτησε «↻ PDF» στο έντυπο και επίλεξε ξανά το αρχικό PDF. Οι αντιστοιχίσεις και οι θέσεις σου θα παραμείνουν.");
        replacementError.code = "PDF_BYTES_UNAVAILABLE";
        replacementError.cause = error;
        throw replacementError;
      }
    }

    const replacementError = new Error("Δεν υπάρχει διαθέσιμο αντίγραφο του PDF. Πάτησε «↻ PDF» και επίλεξε ξανά το αρχικό αρχείο. Οι αντιστοιχίσεις θα παραμείνουν.");
    replacementError.code = "PDF_BYTES_UNAVAILABLE";
    throw replacementError;
  }

  function loadExternalScript(src, timeoutMs = 12000) {
    return new Promise((resolve, reject) => {
      const existing = [...document.scripts].find(node => node.src === src);
      if (existing?.dataset?.loaded === "1") { resolve(); return; }
      const script = existing || document.createElement("script");
      let settled = false;
      const finish = (fn, value) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        fn(value);
      };
      const timer = setTimeout(() => finish(reject, new Error(`Χρόνος αναμονής κατά τη φόρτωση ${src}`)), timeoutMs);
      script.onload = () => { script.dataset.loaded = "1"; finish(resolve); };
      script.onerror = () => finish(reject, new Error(`Δεν φορτώθηκε ${src}`));
      if (!existing) {
        script.src = src;
        script.async = true;
        document.head.appendChild(script);
      }
    });
  }

  function ensurePdfLib() {
    if (window.PDFLib?.PDFDocument) return Promise.resolve(window.PDFLib);
    if (pdfLibPromise) return pdfLibPromise;
    pdfLibPromise = loadExternalScript(PDF_LIB_PRIMARY)
      .catch(() => loadExternalScript(PDF_LIB_FALLBACK))
      .then(() => {
        if (!window.PDFLib?.PDFDocument) throw new Error("Δεν είναι διαθέσιμη η μηχανή PDF.");
        return window.PDFLib;
      })
      .catch(error => {
        pdfLibPromise = null;
        throw error;
      });
    return pdfLibPromise;
  }

  async function configurePdfJsWorker(pdfjs) {
    // Μην μπλοκάρεις το άνοιγμα του editor περιμένοντας ξεχωριστό fetch του worker.
    // Σε iPhone/PWA αυτό μπορούσε να αφήσει το κουμπί «Πεδία» να φαίνεται ότι κόλλησε.
    try { pdfjs.GlobalWorkerOptions.workerSrc = PDF_JS_WORKER; } catch (_) {}
    return pdfjs;
  }

  function ensurePdfJs() {
    if (window.pdfjsLib?.getDocument) return configurePdfJsWorker(window.pdfjsLib);
    if (pdfJsPromise) return pdfJsPromise;
    pdfJsPromise = loadExternalScript(PDF_JS_PRIMARY)
      .catch(() => loadExternalScript(PDF_JS_FALLBACK))
      .then(() => {
        if (!window.pdfjsLib?.getDocument) throw new Error("Δεν φορτώθηκε η προεπισκόπηση PDF.");
        return configurePdfJsWorker(window.pdfjsLib);
      })
      .catch(error => {
        pdfJsPromise = null;
        throw error;
      });
    return pdfJsPromise;
  }

  function ensureTesseract() {
    if (window.Tesseract?.recognize) return Promise.resolve(window.Tesseract);
    if (tesseractPromise) return tesseractPromise;
    tesseractPromise = loadExternalScript(TESSERACT_JS_PRIMARY, 25000)
      .catch(() => loadExternalScript(TESSERACT_JS_FALLBACK, 25000))
      .then(() => {
        if (!window.Tesseract?.recognize) throw new Error("Δεν φορτώθηκε η μηχανή OCR.");
        return window.Tesseract;
      })
      .catch(error => {
        tesseractPromise = null;
        throw error;
      });
    return tesseractPromise;
  }

  function canvasToBlob(canvas, type = "image/png", quality = 0.95) {
    return new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error("Δεν δημιουργήθηκε εικόνα για OCR.")), type, quality));
  }

  function loadImageFile(file) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Δεν ανοίγει η φωτογραφία.")); };
      img.src = url;
    });
  }

  function vehicleRegOtsuThreshold(data) {
    const histogram = new Array(256).fill(0);
    let total = 0;
    for (let i = 0; i < data.length; i += 4) {
      const gray = Math.max(0, Math.min(255, Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2])));
      histogram[gray] += 1; total += 1;
    }
    let sum = 0;
    for (let i = 0; i < 256; i += 1) sum += i * histogram[i];
    let sumB = 0, wB = 0, best = 128, bestVar = -1;
    for (let t = 0; t < 256; t += 1) {
      wB += histogram[t];
      if (!wB) continue;
      const wF = total - wB;
      if (!wF) break;
      sumB += t * histogram[t];
      const mB = sumB / wB;
      const mF = (sum - sumB) / wF;
      const between = wB * wF * (mB - mF) * (mB - mF);
      if (between > bestVar) { bestVar = between; best = t; }
    }
    return best;
  }

  async function prepareVehicleRegistrationVariants(file) {
    const img = await loadImageFile(file);
    const rawW = Number(img.naturalWidth || img.width || 1);
    const rawH = Number(img.naturalHeight || img.height || 1);
    const longSide = Math.max(rawW, rawH);
    const targetLongSide = 3200;
    const scale = Math.max(0.72, Math.min(2.15, targetLongSide / Math.max(1, longSide)));
    const width = Math.max(1, Math.round(rawW * scale));
    const height = Math.max(1, Math.round(rawH * scale));

    const base = document.createElement("canvas");
    base.width = width; base.height = height;
    const baseCtx = base.getContext("2d", { willReadFrequently: true });
    baseCtx.fillStyle = "#fff"; baseCtx.fillRect(0, 0, width, height);
    baseCtx.imageSmoothingEnabled = true;
    baseCtx.imageSmoothingQuality = "high";
    baseCtx.drawImage(img, 0, 0, width, height);

    const enhanced = document.createElement("canvas");
    enhanced.width = width; enhanced.height = height;
    const ectx = enhanced.getContext("2d", { willReadFrequently: true });
    ectx.drawImage(base, 0, 0);
    try {
      const image = ectx.getImageData(0, 0, width, height);
      const data = image.data;
      for (let i = 0; i < data.length; i += 4) {
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        const contrasted = Math.max(0, Math.min(255, (gray - 128) * 1.65 + 128));
        data[i] = data[i + 1] = data[i + 2] = contrasted;
      }
      ectx.putImageData(image, 0, 0);
    } catch (_) {}

    const binary = document.createElement("canvas");
    binary.width = width; binary.height = height;
    const bctx = binary.getContext("2d", { willReadFrequently: true });
    bctx.drawImage(enhanced, 0, 0);
    try {
      const image = bctx.getImageData(0, 0, width, height);
      const data = image.data;
      const threshold = vehicleRegOtsuThreshold(data);
      for (let i = 0; i < data.length; i += 4) {
        const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
        const v = gray >= threshold ? 255 : 0;
        data[i] = data[i + 1] = data[i + 2] = v;
      }
      bctx.putImageData(image, 0, 0);
    } catch (_) {}

    return [
      { label: "κανονική", blob: await canvasToBlob(base) },
      { label: "ενισχυμένη", blob: await canvasToBlob(enhanced) },
      { label: "ασπρόμαυρη", blob: await canvasToBlob(binary) }
    ];
  }

  async function prepareVehicleRegistrationTiles(file) {
    const img = await loadImageFile(file);
    const rawW = Number(img.naturalWidth || img.width || 1);
    const rawH = Number(img.naturalHeight || img.height || 1);
    const targetLongSide = 3600;
    const scale = Math.max(1, Math.min(2.5, targetLongSide / Math.max(1, Math.max(rawW, rawH))));
    const width = Math.max(1, Math.round(rawW * scale));
    const height = Math.max(1, Math.round(rawH * scale));
    const source = document.createElement("canvas");
    source.width = width; source.height = height;
    const sctx = source.getContext("2d", { willReadFrequently: true });
    sctx.fillStyle = "#fff"; sctx.fillRect(0, 0, width, height);
    sctx.drawImage(img, 0, 0, width, height);

    // Four overlapping tiles make the tiny printed codes much larger for OCR.
    const specs = [
      [0, 0, 0.58, 0.58, "πάνω αριστερά"],
      [0.42, 0, 0.58, 0.58, "πάνω δεξιά"],
      [0, 0.42, 0.58, 0.58, "κάτω αριστερά"],
      [0.42, 0.42, 0.58, 0.58, "κάτω δεξιά"]
    ];
    const out = [];
    for (const [xr, yr, wr, hr, label] of specs) {
      const sx = Math.round(width * xr), sy = Math.round(height * yr);
      const sw = Math.max(1, Math.round(width * wr)), sh = Math.max(1, Math.round(height * hr));
      const tile = document.createElement("canvas");
      const zoom = 1.6;
      tile.width = Math.max(1, Math.round(sw * zoom));
      tile.height = Math.max(1, Math.round(sh * zoom));
      const tctx = tile.getContext("2d", { willReadFrequently: true });
      tctx.fillStyle = "#fff"; tctx.fillRect(0, 0, tile.width, tile.height);
      tctx.imageSmoothingEnabled = true;
      tctx.imageSmoothingQuality = "high";
      tctx.drawImage(source, sx, sy, sw, sh, 0, 0, tile.width, tile.height);
      try {
        const image = tctx.getImageData(0, 0, tile.width, tile.height);
        const data = image.data;
        for (let i = 0; i < data.length; i += 4) {
          const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          const v = Math.max(0, Math.min(255, (gray - 128) * 1.45 + 128));
          data[i] = data[i + 1] = data[i + 2] = v;
        }
        tctx.putImageData(image, 0, 0);
      } catch (_) {}
      out.push({ label, blob: await canvasToBlob(tile) });
    }
    return out;
  }


  // Greek registration certificates use a very stable three-column layout. For camera
  // photos, reading the whole page as one text stream is error-prone. The routines below
  // first find the green certificate and then OCR only the left VEHICLE DATA panel. Values
  // are extracted by fixed normalized regions, so text from the holder/authority columns
  // can never become a VIN, make, fuel or colour.
  function detectGreekVehicleRegistrationBounds(canvas) {
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const width = canvas.width, height = canvas.height;
    let image;
    try { image = ctx.getImageData(0, 0, width, height); } catch (_) { return null; }
    const data = image.data;
    const step = Math.max(2, Math.round(Math.max(width, height) / 900));
    let minX = width, minY = height, maxX = -1, maxY = -1, hits = 0, samples = 0;
    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        samples += 1;
        const i = (y * width + x) * 4;
        const r = data[i], g = data[i + 1], b = data[i + 2];
        // Pale green paper: green channel is measurably above red/blue, but allow shadows.
        const greenish = g >= 78 && (g - r) >= 5 && (g - b) >= 4 && g >= r * 1.025 && g >= b * 1.02;
        if (!greenish) continue;
        hits += 1;
        if (x < minX) minX = x; if (x > maxX) maxX = x;
        if (y < minY) minY = y; if (y > maxY) maxY = y;
      }
    }
    if (hits < Math.max(120, samples * 0.035) || maxX <= minX || maxY <= minY) return null;
    let x = Math.max(0, minX - step * 3), y = Math.max(0, minY - step * 3);
    let w = Math.min(width - x, (maxX - minX) + step * 6);
    let h = Math.min(height - y, (maxY - minY) + step * 6);
    const ratio = w / Math.max(1, h);
    // A Greek registration certificate is landscape. Reject tiny/implausible green objects.
    if (ratio < 1.25 || ratio > 2.35 || w < width * 0.35 || h < height * 0.25) return null;
    return { x, y, w, h };
  }

  async function prepareGreekVehicleRegistrationPanel(input) {
    const img = await loadImageFile(input);
    const rawW = Number(img.naturalWidth || img.width || 1);
    const rawH = Number(img.naturalHeight || img.height || 1);
    const scale = Math.max(0.9, Math.min(2.2, 2600 / Math.max(1, Math.max(rawW, rawH))));
    const width = Math.max(1, Math.round(rawW * scale));
    const height = Math.max(1, Math.round(rawH * scale));
    const source = document.createElement("canvas");
    source.width = width; source.height = height;
    const sctx = source.getContext("2d", { willReadFrequently: true });
    sctx.fillStyle = "#fff"; sctx.fillRect(0, 0, width, height);
    sctx.imageSmoothingEnabled = true; sctx.imageSmoothingQuality = "high";
    sctx.drawImage(img, 0, 0, width, height);

    const detectedBounds = detectGreekVehicleRegistrationBounds(source);
    const bounds = detectedBounds || { x: 0, y: 0, w: width, h: height };
    // The left panel occupies approximately one third of the green certificate.
    const sx = Math.max(0, Math.round(bounds.x + bounds.w * 0.002));
    // Skip the pale green outer margin and start on the actual bordered VEHICLE DATA panel.
    const sy = Math.max(0, Math.round(bounds.y + bounds.h * 0.026));
    const sw = Math.max(1, Math.round(bounds.w * 0.335));
    const sh = Math.max(1, Math.round(bounds.h * 0.970));
    const targetW = 1600;
    const targetH = Math.max(1800, Math.round(targetW * sh / sw));
    const panel = document.createElement("canvas");
    panel.width = targetW; panel.height = targetH;
    const pctx = panel.getContext("2d", { willReadFrequently: true });
    pctx.fillStyle = "#fff"; pctx.fillRect(0, 0, targetW, targetH);
    pctx.imageSmoothingEnabled = true; pctx.imageSmoothingQuality = "high";
    pctx.drawImage(source, sx, sy, sw, sh, 0, 0, targetW, targetH);
    try {
      const image = pctx.getImageData(0, 0, targetW, targetH);
      const data = image.data;
      for (let i = 0; i < data.length; i += 4) {
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        // Flatten the green paper and strengthen the dark printed characters.
        const v = Math.max(0, Math.min(255, (gray - 150) * 1.85 + 178));
        data[i] = data[i + 1] = data[i + 2] = v;
      }
      pctx.putImageData(image, 0, 0);
    } catch (_) {}
    return { blob: await canvasToBlob(panel), canvas: panel, width: targetW, height: targetH, detected: Boolean(detectedBounds) };
  }

  function vehicleRegWordsFromBlocks(blocks) {
    const words = [];
    for (const block of Array.isArray(blocks) ? blocks : []) {
      for (const paragraph of Array.isArray(block?.paragraphs) ? block.paragraphs : []) {
        for (const line of Array.isArray(paragraph?.lines) ? paragraph.lines : []) {
          for (const word of Array.isArray(line?.words) ? line.words : []) {
            const text = String(word?.text || "").trim();
            const bbox = word?.bbox || null;
            const confidence = Number(word?.confidence ?? word?.conf ?? 0);
            if (!text || !bbox || (Number.isFinite(confidence) && confidence < 15)) continue;
            words.push({ text, bbox, confidence });
          }
        }
      }
    }
    return words;
  }

  function vehicleRegTextFromRegion(words, width, height, roi) {
    const x0 = roi.x0 * width, x1 = roi.x1 * width, y0 = roi.y0 * height, y1 = roi.y1 * height;
    const picked = words.filter(word => {
      const b = word.bbox || {};
      const cx = (Number(b.x0 || 0) + Number(b.x1 || 0)) / 2;
      const cy = (Number(b.y0 || 0) + Number(b.y1 || 0)) / 2;
      return cx >= x0 && cx <= x1 && cy >= y0 && cy <= y1;
    });
    if (!picked.length) return "";
    picked.sort((a,b) => {
      const ay = (Number(a.bbox.y0 || 0) + Number(a.bbox.y1 || 0)) / 2;
      const by = (Number(b.bbox.y0 || 0) + Number(b.bbox.y1 || 0)) / 2;
      if (Math.abs(ay - by) > height * 0.012) return ay - by;
      return Number(a.bbox.x0 || 0) - Number(b.bbox.x0 || 0);
    });
    const lines = [];
    for (const word of picked) {
      const cy = (Number(word.bbox.y0 || 0) + Number(word.bbox.y1 || 0)) / 2;
      let line = lines.find(item => Math.abs(item.y - cy) <= height * 0.012);
      if (!line) { line = { y: cy, words: [] }; lines.push(line); }
      line.words.push(word);
    }
    lines.sort((a,b) => a.y - b.y);
    return lines.map(line => line.words.sort((a,b) => Number(a.bbox.x0 || 0) - Number(b.bbox.x0 || 0)).map(w => w.text).join(" ")).join(" ").trim();
  }

  function parseGreekVehicleRegistrationPanel(blocks, width, height) {
    const words = vehicleRegWordsFromBlocks(blocks);
    if (!words.length) return {};
    // Normalized positions measured on the official Greek green registration certificate.
    // X coordinates are relative to the left VEHICLE DATA panel; Y to its full height.
    const regions = {
      firstRegistration:       { code: "B",   x0: 0.09, x1: 0.36, y0: 0.150, y1: 0.198 },
      firstRegistrationGreece: { code: "4",   x0: 0.39, x1: 0.68, y0: 0.150, y1: 0.198 },
      make:                    { code: "D.1", x0: 0.09, x1: 0.78, y0: 0.187, y1: 0.228 },
      type:                    { code: "D.2", x0: 0.09, x1: 0.78, y0: 0.245, y1: 0.326 },
      vin:                     { code: "E",   x0: 0.09, x1: 0.78, y0: 0.323, y1: 0.368 },
      fuel:                    { code: "P.3", x0: 0.09, x1: 0.78, y0: 0.446, y1: 0.490 },
      engineNumber:            { code: "P.5", x0: 0.09, x1: 0.78, y0: 0.482, y1: 0.530 },
      color:                   { code: "R",   x0: 0.31, x1: 0.78, y0: 0.536, y1: 0.586 }
    };
    const out = {};
    for (const [key, region] of Object.entries(regions)) {
      let raw = vehicleRegTextFromRegion(words, width, height, region);
      // Remove any code token that leaked into the crop.
      try { raw = raw.replace(new RegExp(vehicleRegCodePattern(region.code), "ig"), " "); } catch (_) {}
      raw = cleanVehicleRegCandidate(raw);
      let value = "";
      if (region.code === "B" || region.code === "4") value = dateFromSpatialVehicleValue(raw);
      else value = sanitizeVehicleRegValue(region.code, raw);
      if (value) out[key] = value;
    }
    return out;
  }

  const GREEK_VEHICLE_VALUE_REGIONS = [
    // Exact value-only regions measured on the official Greek green registration certificate.
    // Coordinates are relative to the INNER left VEHICLE DATA panel (border to border).
    ["firstRegistration",       "B",   0.100, 0.315, 0.142, 0.178, 210],
    ["firstRegistrationGreece", "4",   0.402, 0.625, 0.142, 0.178, 210],
    ["make",                    "D.1", 0.100, 0.315, 0.174, 0.202, 220],
    // D.2 spans type / variant / version on up to three successive lines.
    ["type",                    "D.2", 0.100, 0.595, 0.226, 0.322, 390],
    ["vin",                     "E",   0.100, 0.665, 0.318, 0.351, 230],
    ["fuel",                    "P.3", 0.100, 0.600, 0.438, 0.469, 235],
    ["engineNumber",            "P.5", 0.100, 0.390, 0.470, 0.501, 225],
    ["color",                   "R",   0.325, 0.575, 0.522, 0.553, 225]
  ];

  function normalizeVehicleMakeCrop(raw) {
    const direct = fallbackMakeFromVehicleRegText(raw);
    if (direct) return direct;
    const compact = String(raw || "").toUpperCase().replace(/[^A-Z0-9]/g, "").replace(/1/g, "I").replace(/0/g, "O");
    const brands = ["FIAT","FORD","OPEL","AUDI","BMW","KIA","SEAT","SKODA","TOYOTA","HONDA","NISSAN","PEUGEOT","RENAULT","CITROEN","HYUNDAI","SUZUKI","MAZDA","VOLVO","JEEP","DACIA","SMART","MINI","SUBARU","TESLA","CUPRA","LEXUS"];
    return brands.find(brand => compact.includes(brand.replace(/[^A-Z0-9]/g, ""))) || "";
  }

  function normalizeVehicleVinCrop(raw) {
    const source = String(raw || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (!source) return "";
    // VIN never contains I, O or Q. OCR commonly confuses them with 1/0.
    const corrected = source.replace(/O/g, "0").replace(/Q/g, "0").replace(/I/g, "1");
    const candidates = [];
    if (corrected.length === 17) candidates.push(corrected);
    for (let i = 0; i + 17 <= corrected.length; i += 1) candidates.push(corrected.slice(i, i + 17));
    for (const candidate of candidates) {
      if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(candidate)) continue;
      const digits = (candidate.match(/\d/g) || []).length;
      const letters = (candidate.match(/[A-Z]/g) || []).length;
      if (digits >= 5 && letters >= 3) return candidate;
    }
    return "";
  }

  async function buildGreekVehicleFieldSheet(panel) {
    const sheetW = 1700;
    const gap = 34;
    const totalH = GREEK_VEHICLE_VALUE_REGIONS.reduce((sum, row) => sum + row[6] + gap, gap);
    const sheet = document.createElement("canvas");
    sheet.width = sheetW; sheet.height = totalH;
    const ctx = sheet.getContext("2d", { willReadFrequently: true });
    ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, sheetW, totalH);
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
    const rows = [];
    let y = gap;
    for (const [key, code, x0, x1, y0, y1, rowH] of GREEK_VEHICLE_VALUE_REGIONS) {
      const sx = Math.round(panel.width * x0), sy = Math.round(panel.height * y0);
      const sw = Math.max(2, Math.round(panel.width * (x1 - x0))), sh = Math.max(2, Math.round(panel.height * (y1 - y0)));
      const maxW = sheetW - 80, maxH = rowH - 24;
      const scale = Math.min(maxW / sw, maxH / sh);
      const dw = Math.max(2, Math.round(sw * scale)), dh = Math.max(2, Math.round(sh * scale));
      const dx = 40, dy = y + Math.max(0, Math.round((rowH - dh) / 2));
      ctx.drawImage(panel.canvas, sx, sy, sw, sh, dx, dy, dw, dh);
      rows.push({ key, code, y0: y / totalH, y1: (y + rowH) / totalH });
      y += rowH + gap;
    }
    // One final contrast pass on the synthetic sheet. Separators remain white and prevent row mixing.
    try {
      const image = ctx.getImageData(0, 0, sheet.width, sheet.height);
      const data = image.data;
      for (let i = 0; i < data.length; i += 4) {
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        const v = gray > 242 ? 255 : Math.max(0, Math.min(255, (gray - 135) * 1.55 + 155));
        data[i] = data[i + 1] = data[i + 2] = v;
      }
      ctx.putImageData(image, 0, 0);
    } catch (_) {}
    return { blob: await canvasToBlob(sheet), width: sheet.width, height: sheet.height, rows };
  }

  function parseGreekVehicleFieldSheet(blocks, sheet) {
    const words = vehicleRegWordsFromBlocks(blocks);
    const values = {};
    for (const row of sheet.rows) {
      const raw = vehicleRegTextFromRegion(words, sheet.width, sheet.height, { x0: 0, x1: 1, y0: row.y0, y1: row.y1 });
      if (!raw) continue;
      let value = "";
      if (row.code === "B" || row.code === "4") value = validVehicleRegDate(dateFromSpatialVehicleValue(raw));
      else if (row.code === "D.1") value = normalizeVehicleMakeCrop(raw) || sanitizeVehicleRegValue(row.code, raw);
      else if (row.code === "E") value = normalizeVehicleVinCrop(raw);
      else value = sanitizeVehicleRegValue(row.code, raw);
      if (value) values[row.key] = value;
    }
    return values;
  }

  async function ocrGreekVehicleRegistrationTargeted(input, label = "άδεια") {
    const panel = await prepareGreekVehicleRegistrationPanel(input);
    const sheet = await buildGreekVehicleFieldSheet(panel);
    const detail = await ocrVehicleRegistrationBlob(sheet.blob, `${label} · 8 συγκεκριμένα πεδία`, "6");
    return {
      text: detail.text || "",
      values: parseGreekVehicleFieldSheet(detail.blocks, sheet),
      detected: panel.detected
    };
  }

  function vehicleRegOcrLinesFromBlocks(blocks) {
    const lines = [];
    for (const block of Array.isArray(blocks) ? blocks : []) {
      for (const paragraph of Array.isArray(block?.paragraphs) ? block.paragraphs : []) {
        for (const line of Array.isArray(paragraph?.lines) ? paragraph.lines : []) {
          const words = (Array.isArray(line?.words) ? line.words : [])
            .map(word => ({
              text: String(word?.text || "").trim(),
              confidence: Number(word?.confidence ?? word?.conf ?? 0),
              bbox: word?.bbox || null
            }))
            .filter(word => word.text && (!Number.isFinite(word.confidence) || word.confidence >= 18));
          if (!words.length) continue;
          words.sort((a,b) => Number(a?.bbox?.x0 || 0) - Number(b?.bbox?.x0 || 0));
          lines.push({
            text: words.map(word => word.text).join(" "),
            words,
            bbox: line?.bbox || null
          });
        }
      }
    }
    lines.sort((a,b) => {
      const ay = Number(a?.bbox?.y0 ?? a?.words?.[0]?.bbox?.y0 ?? 0);
      const by = Number(b?.bbox?.y0 ?? b?.words?.[0]?.bbox?.y0 ?? 0);
      if (Math.abs(ay - by) > 8) return ay - by;
      return Number(a?.bbox?.x0 ?? a?.words?.[0]?.bbox?.x0 ?? 0) - Number(b?.bbox?.x0 ?? b?.words?.[0]?.bbox?.x0 ?? 0);
    });
    return lines;
  }

  function vehicleRegExactCodeRegex(code) {
    try { return new RegExp(String.raw`^\s*${vehicleRegCodePattern(code)}\s*$`, "i"); }
    catch (_) { return null; }
  }

  function vehicleRegFindCodeInWords(words, code) {
    const re = vehicleRegExactCodeRegex(code);
    if (!re) return null;
    const maxStart = Math.min(words.length, 4);
    for (let start = 0; start < maxStart; start += 1) {
      for (let len = 1; len <= 3 && start + len <= words.length; len += 1) {
        const chunk = words.slice(start, start + len).map(word => word.text).join(" ")
          .replace(/[\[\]{}]/g, "")
          .trim();
        if (re.test(chunk)) return { start, end: start + len };
      }
    }
    return null;
  }

  function vehicleRegCandidateFromSpatialLines(lines, lineIndex, codeHit) {
    const line = lines[lineIndex];
    if (!line) return "";
    let sameEnd = line.words.length;
    for (let k = codeHit.end; k < line.words.length; k += 1) {
      const rest = line.words.slice(k);
      if (VEHICLE_REG_DELIMITER_CODES.some(other => vehicleRegFindCodeInWords(rest, other)?.start === 0)) { sameEnd = k; break; }
    }
    const sameLine = line.words.slice(codeHit.end, sameEnd).map(word => word.text).join(" ").trim();
    if (sameLine) return sameLine;

    const lineBox = line.bbox || line.words[0]?.bbox || {};
    const baseY1 = Number(lineBox.y1 || line.words[0]?.bbox?.y1 || 0);
    const baseH = Math.max(12, Number(lineBox.y1 || 0) - Number(lineBox.y0 || 0));
    const codeX = Number(line.words[codeHit.start]?.bbox?.x0 || lineBox.x0 || 0);
    for (let i = lineIndex + 1; i < Math.min(lines.length, lineIndex + 4); i += 1) {
      const next = lines[i];
      const nextBox = next.bbox || next.words[0]?.bbox || {};
      const gap = Number(nextBox.y0 || 0) - baseY1;
      if (gap > baseH * 2.3) break;
      if (VEHICLE_REG_DELIMITER_CODES.some(other => vehicleRegFindCodeInWords(next.words, other))) break;
      const useful = next.words.filter(word => Number(word?.bbox?.x1 || 0) >= codeX - 12).map(word => word.text).join(" ").trim();
      if (useful) return useful;
    }
    return "";
  }

  function dateFromSpatialVehicleValue(value) {
    const match = String(value || "").match(/([0-3]?\d[\/\.\-][01]?\d[\/\.\-](?:19|20)?\d{2})/);
    if (!match) return "";
    const bits = match[1].replace(/[.\-]/g, "/").split("/");
    if (bits.length !== 3) return "";
    const [d,m,y0] = bits;
    const y = y0.length === 2 ? (Number(y0) > 50 ? `19${y0}` : `20${y0}`) : y0;
    return validVehicleRegDate(`${String(d).padStart(2,"0")}/${String(m).padStart(2,"0")}/${y}`);
  }

  function parseVehicleRegistrationBlocks(blocks) {
    const lines = vehicleRegOcrLinesFromBlocks(blocks);
    const result = {};
    const defs = [
      ["make", "D.1"], ["type", "D.2"], ["firstRegistration", "B"], ["firstRegistrationGreece", "4"],
      ["vin", "E"], ["engineNumber", "P.5"], ["fuel", "P.3"], ["color", "R"]
    ];
    for (const [key, code] of defs) {
      for (let i = 0; i < lines.length; i += 1) {
        const hit = vehicleRegFindCodeInWords(lines[i].words, code);
        if (!hit) continue;
        const raw = vehicleRegCandidateFromSpatialLines(lines, i, hit);
        let value = "";
        if (code === "B" || code === "4") value = dateFromSpatialVehicleValue(raw);
        else value = sanitizeVehicleRegValue(code, raw);
        if (value) { result[key] = value; break; }
      }
    }
    return result;
  }

  function mergeVehicleRegValues(...sources) {
    const out = {};
    for (const [key] of VEHICLE_REG_FIELDS) {
      for (const source of sources) {
        const value = String(source?.[key] ?? "").trim();
        if (value) { out[key] = value; break; }
      }
    }
    return out;
  }

  async function ocrVehicleRegistrationBlob(blob, label = "εικόνα", pageSegMode = "11") {
    const Tesseract = await ensureTesseract();
    const result = await Tesseract.recognize(blob, "ell+eng", {
      logger(message) {
        if (message?.status === "recognizing text" && Number.isFinite(message.progress)) {
          setStatus(`OCR ${label}: ${Math.round(message.progress * 100)}%…`);
        }
      },
      tessedit_pageseg_mode: String(pageSegMode || "11"),
      preserve_interword_spaces: "1"
    });
    return {
      text: String(result?.data?.text || ""),
      blocks: Array.isArray(result?.data?.blocks) ? result.data.blocks : []
    };
  }

  async function ocrVehicleRegistrationImages(files) {
    const list = Array.from(files || []).filter(Boolean);
    const parts = [];
    let spatialValues = {};
    for (let i = 0; i < list.length; i += 1) {
      setStatus(`Στοχευμένη ανάγνωση άδειας ${i + 1}/${list.length}…`);
      let imageText = "";
      let officialCardDetected = false;
      try {
        const targeted = await ocrGreekVehicleRegistrationTargeted(list[i], `φωτογραφία ${i + 1}/${list.length}`);
        imageText += targeted?.text || "";
        officialCardDetected = Boolean(targeted?.detected);
        spatialValues = mergeVehicleRegValues(spatialValues, targeted?.values || {});
      } catch (error) {
        console.warn("Targeted vehicle registration OCR failed", error);
      }

      // If the official green card was detected, never contaminate missing fields with guesses
      // from the holder/authority columns. Missing targeted fields stay blank for user review.
      if (!officialCardDetected && Object.values(spatialValues).filter(Boolean).length < 6) {
        setStatus(`Συμπληρωματικό OCR φωτογραφίας ${i + 1}/${list.length}…`);
        const variants = await prepareVehicleRegistrationVariants(list[i]);
        for (let j = 0; j < variants.length; j += 1) {
          const variant = variants[j];
          const detail = await ocrVehicleRegistrationBlob(variant.blob, `φωτογραφία ${i + 1}/${list.length} · ${variant.label}`);
          imageText += (imageText ? "\n" : "") + detail.text;
          spatialValues = mergeVehicleRegValues(spatialValues, parseVehicleRegistrationBlocks(detail.blocks));
          const mergedNow = mergeVehicleRegValues(spatialValues, parseVehicleRegistrationText(imageText));
          if (Object.values(mergedNow).filter(Boolean).length >= 6) break;
        }
      }

      if (!officialCardDetected && Object.values(mergeVehicleRegValues(spatialValues, parseVehicleRegistrationText(imageText))).filter(Boolean).length < 4) {
        const tiles = await prepareVehicleRegistrationTiles(list[i]);
        for (let j = 0; j < tiles.length; j += 1) {
          const tile = tiles[j];
          const detail = await ocrVehicleRegistrationBlob(tile.blob, `λεπτομέρεια ${i + 1}/${list.length} · ${tile.label}`);
          imageText += (imageText ? "\n" : "") + detail.text;
          spatialValues = mergeVehicleRegValues(spatialValues, parseVehicleRegistrationBlocks(detail.blocks));
          const mergedNow = mergeVehicleRegValues(spatialValues, parseVehicleRegistrationText(imageText));
          if (Object.values(mergedNow).filter(Boolean).length >= 6) break;
        }
      }
      parts.push(imageText);
    }
    const text = parts.join("\n");
    return { text, values: spatialValues };
  }

  async function ocrVehicleRegistrationPdf(file) {
    const buffer = await file.arrayBuffer();
    const pdfjs = await ensurePdfJs();
    const pdf = await pdfjs.getDocument({ data: new Uint8Array(buffer.slice(0)) }).promise;
    const parts = [];
    let spatialValues = {};
    for (let pageNo = 1; pageNo <= Math.min(pdf.numPages, 2); pageNo += 1) {
      setStatus(`Προετοιμασία σελίδας ${pageNo}/${Math.min(pdf.numPages, 2)} για OCR…`);
      const page = await pdf.getPage(pageNo);
      const base = page.getViewport({ scale: 1 });
      const scale = Math.min(3.4, 3200 / Math.max(base.width, base.height));
      const viewport = page.getViewport({ scale: Math.max(2.0, scale) });
      const canvas = document.createElement("canvas");
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
      const blob = await canvasToBlob(canvas);
      try {
        const targeted = await ocrGreekVehicleRegistrationTargeted(blob, `σελίδα ${pageNo}`);
        parts.push(targeted?.text || "");
        spatialValues = mergeVehicleRegValues(spatialValues, targeted?.values || {});
      } catch (error) {
        console.warn("Targeted PDF registration OCR failed", error);
      }
      if (Object.values(spatialValues).filter(Boolean).length < 6) {
        const detail = await ocrVehicleRegistrationBlob(blob, `σελίδα ${pageNo}`);
        parts.push(detail.text || "");
        spatialValues = mergeVehicleRegValues(spatialValues, parseVehicleRegistrationBlocks(detail.blocks));
      }
    }
    const text = parts.join("\n");
    return { text, values: mergeVehicleRegValues(spatialValues, parseVehicleRegistrationText(text)) };
  }

  function activeSupplementFields() {
    if (currentMapTemplate) return supplementDraft;
    return templates.find(item => item.id === selectedTemplateId)?.supplementFields || [];
  }

  function sourceLabel(key) {
    const base = sourceDefinitions.find(item => item[0] === key)?.[1];
    if (base) return base;
    if (String(key || "").startsWith("supplement.")) {
      const id = String(key).slice("supplement.".length);
      const field = activeSupplementFields().find(item => String(item.id) === id);
      return field?.label || "Πεδίο συμπληρωματικού εγγράφου";
    }
    return key || "Πεδίο";
  }

  function visualOptionMarkup(selectedValue = "") {
    return optionMarkup(selectedValue);
  }

  function fieldType(field) {
    const name = field?.constructor?.name || "Field";
    return name.replace(/^PDF/, "");
  }

  function guessSource(fieldName) {
    const n = normalizeText(fieldName);
    const compact = n.replace(/\s/g, "");
    const has = (...values) => values.some(value => n.includes(value) || compact.includes(value.replace(/\s/g,"")));

    if (has("ονοματεπωνυμο", "full name", "fullname", "insured name", "ασφαλισμενος")) return "person.fullName";
    if (has("επωνυμο", "surname", "lastname", "last name")) return "person.lastName";
    if (has("ονομα", "firstname", "first name") && !has("πατρ", "μητρ")) return "person.firstName";
    if (has("επωνυμια", "company", "εταιρ")) return "person.company";
    if (has("αφμ", "tax id", "vat")) return "person.afm";
    if (has("δου", "tax office")) return "person.dou";
    if (has("ταυτοτ", "adt", "identity", "id number")) return "person.adt";
    if (has("ημερ γέννη", "ημερομηνια γεννη", "birthdate", "date of birth", "dob")) return "person.birthDate";
    if (has("τηλεφων", "phone", "mobile", "κινητο")) return "person.phone";
    if (has("email", "e mail", "mail")) return "person.email";
    if (has("ταχυδρομ", "τκ", "postal", "zip")) return "person.postalCode";
    if (has("περιοχ", "city", "πολη")) return "person.area";
    if (has("αριθμος οδου", "street number", "address no")) return "person.streetNumber";
    if (has("οδος", "street")) return "person.street";
    if (has("διευθυν", "address")) return "person.address";
    if (has("αρ συμβολ", "αριθμος συμβολ", "policy number", "contract number")) return "contract.number";
    if (has("προϊον", "product")) return "contract.product";
    if (has("ημερ εναρξ", "ημερομηνια εναρξ", "start date")) return "contract.startDate";
    if (has("τιμολογ", "tariff")) return "policy.tariff";
    if (has("κυκλοφορ", "πινακ", "registration")) return "auto.registrationNumber";
    if (has("σημερινη", "today", "ημερομηνια αιτησης", "date")) return "date.today";
    return "";
  }

  async function inspectPdf(source) {
    const { PDFDocument } = await ensurePdfLib();
    const bytes = source instanceof Blob ? await source.arrayBuffer() : exactArrayBuffer(source);
    if (!bytes) throw new Error("Δεν βρέθηκαν δεδομένα PDF.");
    const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const form = doc.getForm();
    const fields = form.getFields().map(field => ({ name: field.getName(), type: fieldType(field) }));
    return fields;
  }

  function createUI() {
    if ($("formsLibraryModal")) return;

    const button = document.createElement("button");
    button.className = "btn crm-forms-button";
    button.id = "formsLibraryBtn";
    button.type = "button";
    button.title = "Βιβλιοθήκη εντύπων PDF";
    button.innerHTML = "<span>📄</span> Έντυπα";
    const quickBackup = $("quickBackupBtn");
    const toolbar = quickBackup?.parentElement || document.querySelector(".quick-actions, .header-actions, .toolbar, header");
    if (toolbar) {
      if (quickBackup && quickBackup.parentElement === toolbar) toolbar.insertBefore(button, quickBackup);
      else toolbar.appendChild(button);
    } else {
      button.classList.add("crm-forms-floating-entry");
      document.body.appendChild(button);
    }

    const modal = document.createElement("div");
    modal.id = "formsLibraryModal";
    modal.className = "forms-modal hidden";
    modal.innerHTML = `
      <div class="forms-window" role="dialog" aria-modal="true" aria-labelledby="formsLibraryTitle">
        <div class="forms-head">
          <div class="forms-title-wrap"><h2 id="formsLibraryTitle">Βιβλιοθήκη Εντύπων</h2><p>Συμπλήρωση PDF από τα στοιχεία του TSERTOS CRM</p></div>
          <button class="forms-close" id="formsCloseBtn" type="button" aria-label="Κλείσιμο">×</button>
        </div>
        <div class="forms-body">
          <aside class="forms-sidebar">
            <div class="forms-sidebar-head">
              <div class="forms-sidebar-head-row"><h3>Αποθηκευμένα έντυπα</h3><button class="forms-add-btn" id="formsAddTemplateBtn" type="button">＋ Νέο PDF</button></div>
              <p class="forms-library-hint">Για επόμενο πελάτη πάτησε <b>Χρήση</b> στο ήδη αποθηκευμένο πρότυπο. Δεν χρειάζεται να το ανεβάσεις ξανά.</p>
              <div class="forms-library-tools">
                <input id="formsTemplateSearch" type="search" autocomplete="off" placeholder="🔍 Αναζήτηση εντύπου" />
                <select id="formsCategoryFilter" aria-label="Κατηγορία">${categoryOptionsMarkup("", true)}</select>
                <div class="forms-view-tabs" role="group" aria-label="Προβολή βιβλιοθήκης">
                  <button type="button" class="active" data-template-view="all">Όλα</button>
                  <button type="button" data-template-view="favorites">⭐ Αγαπημένα</button>
                  <button type="button" data-template-view="recent">🕘 Πρόσφατα</button>
                </div>
              </div>
              <input id="formsPdfInput" type="file" accept="application/pdf,.pdf" hidden />
              <input id="formsReplacePdfInput" type="file" accept="application/pdf,.pdf" hidden />
            </div>
            <div class="forms-template-list" id="formsTemplateList"></div>
          </aside>
          <main class="forms-workspace">
            <section class="forms-section forms-template-choice-section">
              <h3>1. Επιλογή εντύπου</h3>
              <p class="forms-section-note">Διάλεξε πρώτα κατηγορία και μετά το έτοιμο πρότυπο από τη βιβλιοθήκη.</p>
              <div class="forms-template-choice-actions">
                <button class="forms-primary forms-choose-template" id="formsChooseTemplateBtn" type="button">📁 Επιλογή εντύπου</button>
                <button class="forms-secondary" id="formsQuickAddTemplateBtn" type="button">＋ Νέο PDF</button>
              </div>
              <div class="forms-selected-template-summary" id="formsSelectedTemplateSummary"></div>
            </section>
            <section class="forms-section">
              <h3>2. Επιλογή πελάτη / καλυπτόμενου μέλους</h3>
              <div class="forms-field full">
                <label for="formsCustomerSearch">Αναζήτηση στο CRM</label>
                <input id="formsCustomerSearch" type="search" autocomplete="off" placeholder="Πελάτης ή καλυπτόμενο μέλος — όνομα, επώνυμο, ΑΦΜ ή τηλέφωνο" />
                <div class="forms-customer-results" id="formsCustomerResults"></div>
                <div class="forms-selected-customer" id="formsSelectedCustomer"></div>
              </div>
            </section>
            <section class="forms-section">
              <h3>3. Συμβόλαιο και πρόσωπο</h3>
              <div class="forms-grid">
                <div class="forms-field"><label for="formsPolicySelect">Συμβόλαιο (Ζωής / Αυτοκινήτου)</label><select id="formsPolicySelect"><option value="">Χωρίς συγκεκριμένο συμβόλαιο</option></select></div>
                <div class="forms-field"><label for="formsPersonSelect">Πρόσωπο</label><select id="formsPersonSelect"><option value="insured">Κύριος ασφαλισμένος</option></select></div>
              </div>
            </section>
            <section class="forms-section" id="formsVehicleRegSection">
              <h3>4. Άδεια Κυκλοφορίας <span class="forms-optional">(προαιρετικό)</span></h3>
              <p class="forms-section-note" id="formsVehicleRegNote">Βάλε την άδεια ως PDF, από τις Φωτογραφίες ή με την Κάμερα. Για εικόνες/σαρωμένα PDF γίνεται OCR και μετά εμφανίζονται τα 8 στοιχεία για έλεγχο.</p>
              <div class="forms-actions-row">
                <button class="forms-secondary" id="formsVehicleRegUploadBtn" type="button">📄 PDF</button>
                <button class="forms-secondary" id="formsVehicleRegPhotoBtn" type="button">🖼 Φωτογραφίες</button>
                <button class="forms-secondary" id="formsVehicleRegCameraBtn" type="button">📷 Κάμερα</button>
                <button class="forms-secondary" id="formsVehicleRegClearBtn" type="button" style="display:none">Καθαρισμός</button>
                <input id="formsVehicleRegInput" type="file" accept="application/pdf,.pdf" hidden />
                <input id="formsVehicleRegPhotoInput" type="file" accept="image/*" multiple hidden />
                <input id="formsVehicleRegCameraInput" type="file" accept="image/*" capture="environment" hidden />
              </div>
              <div class="forms-supplement-file" id="formsVehicleRegFile"></div>
              <div class="forms-vehicle-mapping-status" id="formsVehicleRegMappingStatus"></div>
              <div class="forms-actions-row forms-vehicle-map-action">
                <button class="forms-secondary" id="formsVehicleRegMapBtn" type="button">⚙️ Τοποθέτηση πεδίων άδειας στο έντυπο</button>
              </div>
              <div class="forms-supplement-values" id="formsVehicleRegValues"></div>
            </section>
            <section class="forms-section" id="formsSupplementSection">
              <h3>5. Συμπληρωματικό έγγραφο <span class="forms-optional">(προαιρετικό)</span></h3>
              <p class="forms-section-note" id="formsSupplementNote">Αν το πρότυπο έχει άλλα πεδία που δεν υπάρχουν στο CRM, μπορείς να ανεβάσεις δεύτερο PDF και να πάρουμε τιμές από αυτό.</p>
              <div class="forms-actions-row">
                <button class="forms-secondary" id="formsSupplementUploadBtn" type="button">＋ Συμπληρωματικό PDF</button>
                <button class="forms-secondary" id="formsSupplementClearBtn" type="button" style="display:none">Καθαρισμός</button>
                <input id="formsSupplementInput" type="file" accept="application/pdf,.pdf" hidden />
              </div>
              <div class="forms-supplement-file" id="formsSupplementFile"></div>
              <div class="forms-supplement-values" id="formsSupplementValues"></div>
            </section>
            <section class="forms-section">
              <h3>6. Αυτόματη συμπλήρωση</h3>
              <p class="forms-section-note">Επίλεξε έντυπο από τη βιβλιοθήκη. Η αντιστοίχιση πεδίων γίνεται μία φορά για κάθε έντυπο και αποθηκεύεται.</p>
              <div class="forms-actions-row">
                <button class="forms-primary" id="formsFillBtn" type="button">✨ Αυτόματη συμπλήρωση</button>
                <button class="forms-secondary" id="formsOpenMapBtn" type="button">⚙️ Αλλαγή αντιστοίχισης</button>
              </div>
              <div class="forms-status" id="formsStatus">Επίλεξε ένα PDF και έναν πελάτη.</div>
              <div class="forms-preview" id="formsPreview"><iframe id="formsPreviewFrame" title="Προεπισκόπηση PDF"></iframe></div>
              <div class="forms-actions-row" id="formsGeneratedActions" style="display:none;margin-top:10px">
                <button class="forms-primary" id="formsSaveGeneratedBtn" type="button">💾 Αποθήκευση νέου PDF</button>
              </div>
            </section>
          </main>
        </div>
        <div class="forms-quick-fill-bar">
          <button class="forms-primary" id="formsQuickFillBtn" type="button">✨ Συμπλήρωση εντύπου</button>
        </div>
      </div>`;
    document.body.appendChild(modal);

    const mapModal = document.createElement("div");
    mapModal.id = "formsMapModal";
    mapModal.className = "forms-map-modal hidden";
    mapModal.innerHTML = `
      <div class="forms-map-window">
        <div class="forms-map-head"><div><h3>Αντιστοίχιση πεδίων PDF</h3><p id="formsMapSubtitle"></p></div><button class="forms-close" id="formsMapCloseBtn" type="button">×</button></div>
        <div class="forms-map-list" id="formsMapList"></div>
        <div class="forms-supplement-defs-panel">
          <div class="forms-supplement-defs-head"><div><strong>Πεδία από συμπληρωματικό έγγραφο</strong><small>Για στοιχεία που δεν υπάρχουν στο CRM.</small></div><button class="forms-secondary" id="formsAddSupplementFieldBtn" type="button">＋ Πεδίο</button></div>
          <div class="forms-supplement-defs-list" id="formsSupplementDefsList"></div>
        </div>
        <div class="forms-map-footer"><button class="forms-secondary" id="formsMapCancelBtn" type="button">Άκυρο</button><button class="forms-primary" id="formsMapSaveBtn" type="button">Αποθήκευση αντιστοίχισης</button></div>
      </div>`;
    document.body.appendChild(mapModal);

    const nameModal = document.createElement("div");
    nameModal.id = "formsNameModal";
    nameModal.className = "forms-name-modal hidden";
    nameModal.innerHTML = `
      <div class="forms-name-sheet">
        <h3>Όνομα νέου αρχείου</h3>
        <p>Γράψε εσύ το όνομα με το οποίο θα αποθηκευτεί το συμπληρωμένο PDF.</p>
        <input id="formsOutputName" type="text" autocomplete="off" placeholder="π.χ. Αίτηση Παπαδόπουλου" />
        <div class="forms-name-error" id="formsNameError"></div>
        <div class="forms-name-actions"><button class="forms-secondary" id="formsNameCancelBtn" type="button">Άκυρο</button><button class="forms-primary" id="formsNameConfirmBtn" type="button">Αποθήκευση / Κοινοποίηση</button></div>
      </div>`;
    document.body.appendChild(nameModal);

    const pickerModal = document.createElement("div");
    pickerModal.id = "formsTemplatePickerModal";
    pickerModal.className = "forms-picker-modal hidden";
    pickerModal.innerHTML = `
      <div class="forms-picker-sheet">
        <div class="forms-picker-head">
          <button class="forms-picker-back" id="formsPickerBackBtn" type="button" aria-label="Πίσω">‹</button>
          <div><h3 id="formsPickerTitle">Επιλογή κατηγορίας</h3><p id="formsPickerSubtitle">Διάλεξε κατηγορία εντύπων</p></div>
          <button class="forms-close forms-picker-close" id="formsPickerCloseBtn" type="button" aria-label="Κλείσιμο">×</button>
        </div>
        <div class="forms-picker-search"><input id="formsPickerSearch" type="search" autocomplete="off" placeholder="🔍 Αναζήτηση εντύπου" /></div>
        <div class="forms-picker-content" id="formsPickerContent"></div>
        <div class="forms-picker-footer"><button class="forms-secondary" id="formsPickerAddBtn" type="button">＋ Νέο PDF στη βιβλιοθήκη</button></div>
      </div>`;
    document.body.appendChild(pickerModal);

    const detailsModal = document.createElement("div");
    detailsModal.id = "formsTemplateDetailsModal";
    detailsModal.className = "forms-name-modal hidden";
    detailsModal.innerHTML = `
      <div class="forms-name-sheet">
        <h3 id="formsTemplateDetailsTitle">Στοιχεία προτύπου</h3>
        <p>Δώσε ένα καθαρό όνομα και διάλεξε κατηγορία. Μπορείς να τα αλλάξεις αργότερα.</p>
        <div class="forms-field full"><label for="formsTemplateName">Όνομα προτύπου</label><input id="formsTemplateName" type="text" autocomplete="off" /></div>
        <div class="forms-field full" style="margin-top:10px"><label for="formsTemplateCategory">Κατηγορία</label><select id="formsTemplateCategory">${categoryOptionsMarkup("Λοιπά")}</select></div>
        <div class="forms-name-error" id="formsTemplateDetailsError"></div>
        <div class="forms-name-actions"><button class="forms-secondary" id="formsTemplateDetailsCancel" type="button">Άκυρο</button><button class="forms-primary" id="formsTemplateDetailsSave" type="button">Αποθήκευση</button></div>
      </div>`;
    document.body.appendChild(detailsModal);
  }

  function setStatus(message, type = "") {
    const node = $("formsStatus");
    if (!node) return;
    node.textContent = message;
    node.className = `forms-status${type ? ` ${type}` : ""}`;
  }

  async function refreshTemplates() {
    try {
      templates = await dbGetAll();
      await migrateExistingMappingsToProfiles();
      restoreSelectedTemplate();
      renderTemplates();
    } catch (error) {
      console.error(error);
      setStatus("Δεν ήταν δυνατή η φόρτωση της βιβλιοθήκης εντύπων.", "error");
    }
  }

  function visibleTemplatesForLibrary() {
    const query = normalizeText(templateSearchQuery);
    let items = templates.filter(template => {
      const category = template.category || "Λοιπά";
      if (templateCategoryFilter && category !== templateCategoryFilter) return false;
      if (templateViewMode === "favorites" && !template.favorite) return false;
      if (templateViewMode === "recent" && !template.lastUsedAt) return false;
      if (!query) return true;
      const haystack = normalizeText([template.name, template.originalName, category].filter(Boolean).join(" "));
      return haystack.includes(query);
    });
    if (templateViewMode === "recent") {
      items = items.sort((a,b) => String(b.lastUsedAt || "").localeCompare(String(a.lastUsedAt || ""))).slice(0, 12);
    } else if (templateViewMode === "favorites") {
      items = items.sort((a,b) => String(a.name || a.originalName || "").localeCompare(String(b.name || b.originalName || ""), "el"));
    } else {
      items = items.sort((a,b) => {
        const categoryCompare = String(a.category || "Λοιπά").localeCompare(String(b.category || "Λοιπά"), "el");
        if (categoryCompare) return categoryCompare;
        return String(a.name || a.originalName || "").localeCompare(String(b.name || b.originalName || ""), "el");
      });
    }
    return items;
  }

  function templateCardMarkup(template) {
    const fieldCount = Array.isArray(template.fields) ? template.fields.length : 0;
    const acroMapped = Object.values(template.mapping || {}).filter(Boolean).length;
    const visualCount = Array.isArray(template.visualFields) ? template.visualFields.length : 0;
    const mapped = acroMapped + visualCount;
    const ready = mapped > 0;
    const fieldLabel = fieldCount ? `${fieldCount} πεδία PDF` : `${visualCount} οπτικά πεδία`;
    const category = template.category || "Λοιπά";
    return `<article class="forms-template-card ${template.id === selectedTemplateId ? "selected" : ""}" data-template-id="${esc(template.id)}">
      <div class="forms-template-top"><div class="forms-template-name">${esc(template.name || template.originalName || "Έντυπο")}</div><button class="forms-favorite-btn ${template.favorite ? "on" : ""}" type="button" data-favorite-template="${esc(template.id)}" aria-label="Αγαπημένο">${template.favorite ? "★" : "☆"}</button></div>
      <div class="forms-template-category">${esc(category)}</div>
      <div class="forms-template-meta"><span class="forms-chip">${fieldLabel}</span><span class="forms-chip ${ready ? "ready" : "warning"}">${ready ? `Έτοιμο · ${mapped} πεδία` : "Χωρίς αντιστοίχιση"}</span></div>
      <div class="forms-template-actions"><button class="forms-use-template-btn" type="button" data-use-template="${esc(template.id)}">✓ Χρήση</button>${ready ? "" : `<button class="forms-map-btn" type="button" data-link-template="${esc(template.id)}">🔗 Έτοιμο πρότυπο</button>`}<button class="forms-map-btn" type="button" data-map-template="${esc(template.id)}">⚙️ Πεδία</button><button class="forms-map-btn" type="button" data-edit-template="${esc(template.id)}">✎ Στοιχεία</button><button class="forms-map-btn" type="button" data-replace-template="${esc(template.id)}" title="Επίλεξε ξανά το ίδιο PDF χωρίς να χαθούν οι αντιστοιχίσεις">↻ PDF</button><button class="forms-delete-btn" type="button" data-delete-template="${esc(template.id)}">Διαγραφή</button></div>
    </article>`;
  }

  function renderTemplates() {
    renderSelectedTemplateSummary();
    if (!$("formsTemplatePickerModal")?.classList.contains("hidden")) renderTemplatePicker();
    const host = $("formsTemplateList");
    if (!host) return;
    const items = visibleTemplatesForLibrary();
    document.querySelectorAll("[data-template-view]").forEach(button => button.classList.toggle("active", button.dataset.templateView === templateViewMode));
    if (!templates.length) {
      host.innerHTML = `<div class="forms-empty">Δεν έχεις ανεβάσει ακόμη έντυπο.<br>Πάτησε <b>＋ Νέο PDF</b> για να δημιουργήσεις τη βιβλιοθήκη σου.</div>`;
      return;
    }
    if (!items.length) {
      host.innerHTML = `<div class="forms-empty">Δεν βρέθηκε έντυπο με αυτά τα φίλτρα.</div>`;
      return;
    }
    if (templateViewMode === "all" && !templateCategoryFilter && !templateSearchQuery.trim()) {
      const groups = new Map();
      items.forEach(template => {
        const category = template.category || "Λοιπά";
        if (!groups.has(category)) groups.set(category, []);
        groups.get(category).push(template);
      });
      host.innerHTML = [...groups.entries()].map(([category, group]) => `<section class="forms-category-group"><div class="forms-category-heading"><strong>${esc(category)}</strong><span>${group.length}</span></div>${group.map(templateCardMarkup).join("")}</section>`).join("");
      return;
    }
    host.innerHTML = items.map(templateCardMarkup).join("");
  }

  function renderSelectedTemplateSummary() {
    const host = $("formsSelectedTemplateSummary");
    if (!host) return;
    const template = templates.find(item => item.id === selectedTemplateId);
    if (!template) {
      host.innerHTML = `<div class="forms-selected-template-empty">Δεν έχει επιλεγεί έντυπο.</div>`;
      return;
    }
    const mapped = templateMappedCount(template);
    host.innerHTML = `<div class="forms-selected-template-card">
      <div class="forms-selected-template-main"><span class="forms-selected-template-icon">📄</span><div><strong>${esc(template.name || template.originalName || "Έντυπο")}</strong><small>${esc(template.category || "Λοιπά")} · ${mapped ? `Έτοιμο · ${mapped} πεδία` : "Χωρίς αντιστοίχιση"}</small></div></div>
      <div class="forms-selected-template-tools">
        <button type="button" class="forms-secondary" id="formsSelectedChangeBtn">Αλλαγή</button>
        <button type="button" class="forms-secondary" id="formsSelectedMapBtn">⚙️ Πεδία</button>
        <button type="button" class="forms-secondary" id="formsSelectedEditBtn">✎ Στοιχεία</button>
        <button type="button" class="forms-secondary" id="formsSelectedReplaceBtn">↻ PDF</button>
      </div>
    </div>`;
    $("formsSelectedChangeBtn")?.addEventListener("click", openTemplatePicker);
    $("formsSelectedMapBtn")?.addEventListener("click", () => openMapping(selectedTemplateId));
    $("formsSelectedEditBtn")?.addEventListener("click", () => editTemplateDetails(selectedTemplateId).catch(console.error));
    $("formsSelectedReplaceBtn")?.addEventListener("click", () => { replaceTemplateId = selectedTemplateId; $("formsReplacePdfInput")?.click(); });
  }

  function openTemplatePicker() {
    pickerCategory = "";
    pickerSearchQuery = "";
    if ($("formsPickerSearch")) $("formsPickerSearch").value = "";
    $("formsTemplatePickerModal")?.classList.remove("hidden");
    renderTemplatePicker();
  }

  function closeTemplatePicker() {
    $("formsTemplatePickerModal")?.classList.add("hidden");
  }

  function templatePickerItems() {
    const q = normalizeText(pickerSearchQuery);
    return templates.filter(template => {
      if (pickerCategory && !pickerCategory.startsWith("__") && (template.category || "Λοιπά") !== pickerCategory) return false;
      if (pickerCategory === "__favorites" && !template.favorite) return false;
      if (pickerCategory === "__recent" && !template.lastUsedAt) return false;
      if (!q) return true;
      return normalizeText([template.name, template.originalName, template.category].filter(Boolean).join(" ")).includes(q);
    }).sort((a,b) => pickerCategory === "__recent"
      ? String(b.lastUsedAt || "").localeCompare(String(a.lastUsedAt || ""))
      : String(a.name || a.originalName || "").localeCompare(String(b.name || b.originalName || ""), "el"));
  }

  function renderTemplatePicker() {
    const host = $("formsPickerContent");
    if (!host) return;
    const searching = Boolean(pickerSearchQuery.trim());
    $("formsPickerBackBtn").style.visibility = (pickerCategory || searching) ? "visible" : "hidden";
    if (!pickerCategory && !searching) {
      $("formsPickerTitle").textContent = "Επιλογή κατηγορίας";
      $("formsPickerSubtitle").textContent = "Διάλεξε κατηγορία και μετά έντυπο";
      const categories = TEMPLATE_CATEGORIES.map(category => ({ category, count: templates.filter(t => (t.category || "Λοιπά") === category).length })).filter(item => item.count > 0);
      const favCount = templates.filter(t => t.favorite).length;
      const recentCount = templates.filter(t => t.lastUsedAt).length;
      host.innerHTML = `<div class="forms-picker-categories">${categories.map(item => `<button type="button" data-picker-category="${esc(item.category)}"><span>📁</span><strong>${esc(item.category)}</strong><em>${item.count}</em></button>`).join("")}${favCount ? `<button type="button" data-picker-category="__favorites"><span>⭐</span><strong>Αγαπημένα</strong><em>${favCount}</em></button>` : ""}${recentCount ? `<button type="button" data-picker-category="__recent"><span>🕘</span><strong>Πρόσφατα</strong><em>${recentCount}</em></button>` : ""}</div>`;
      if (!templates.length) host.innerHTML = `<div class="forms-empty">Η βιβλιοθήκη είναι άδεια. Πάτησε «＋ Νέο PDF».</div>`;
      return;
    }
    const items = templatePickerItems();
    const label = pickerCategory === "__favorites" ? "Αγαπημένα" : pickerCategory === "__recent" ? "Πρόσφατα" : (pickerCategory || "Αποτελέσματα αναζήτησης");
    $("formsPickerTitle").textContent = label;
    $("formsPickerSubtitle").textContent = `${items.length} διαθέσιμα έντυπα`;
    host.innerHTML = items.length ? `<div class="forms-picker-documents">${items.map(template => { const mapped=templateMappedCount(template); return `<button type="button" class="forms-picker-document ${template.id===selectedTemplateId?"selected":""}" data-picker-template="${esc(template.id)}"><span class="forms-picker-doc-icon">📄</span><span><strong>${esc(template.name || template.originalName || "Έντυπο")}</strong><small>${esc(template.category || "Λοιπά")} · ${mapped ? `Έτοιμο · ${mapped} πεδία` : "Χωρίς αντιστοίχιση"}</small></span><b>›</b></button>`; }).join("")}</div>` : `<div class="forms-empty">Δεν βρέθηκε έντυπο.</div>`;
  }

  function requestTemplateDetails(defaultName = "", defaultCategory = "Λοιπά", title = "Στοιχεία προτύπου") {
    const modal = $("formsTemplateDetailsModal");
    if (!modal) return Promise.resolve({ name: defaultName || "Έντυπο", category: defaultCategory || "Λοιπά" });
    $("formsTemplateDetailsTitle").textContent = title;
    $("formsTemplateName").value = defaultName || "";
    $("formsTemplateCategory").value = TEMPLATE_CATEGORIES.includes(defaultCategory) ? defaultCategory : "Λοιπά";
    $("formsTemplateDetailsError").textContent = "";
    modal.classList.remove("hidden");
    setTimeout(() => $("formsTemplateName")?.focus(), 50);
    return new Promise(resolve => { templateDetailsResolver = resolve; });
  }

  function finishTemplateDetails(save) {
    const modal = $("formsTemplateDetailsModal");
    if (!modal || modal.classList.contains("hidden")) return;
    if (save) {
      const name = String($("formsTemplateName")?.value || "").trim();
      const category = $("formsTemplateCategory")?.value || "Λοιπά";
      if (!name) { $("formsTemplateDetailsError").textContent = "Γράψε ένα όνομα για το πρότυπο."; return; }
      const resolver = templateDetailsResolver;
      templateDetailsResolver = null;
      modal.classList.add("hidden");
      resolver?.({ name, category });
    } else {
      const resolver = templateDetailsResolver;
      templateDetailsResolver = null;
      modal.classList.add("hidden");
      resolver?.(null);
    }
  }

  async function editTemplateDetails(id) {
    const template = templates.find(item => item.id === id);
    if (!template) return;
    templateDetailsEditingId = id;
    const details = await requestTemplateDetails(template.name || template.originalName || "Έντυπο", template.category || "Λοιπά", "Επεξεργασία προτύπου");
    templateDetailsEditingId = null;
    if (!details) return;
    const updated = { ...template, name: details.name, category: details.category, updatedAt: new Date().toISOString() };
    await dbPut(updated);
    if (templateMappedCount(updated)) await persistMappingProfile(updated);
    const index = templates.findIndex(item => item.id === id);
    if (index >= 0) templates[index] = updated;
    renderTemplates();
    setStatus("Τα στοιχεία του προτύπου αποθηκεύτηκαν.", "success");
  }

  async function toggleTemplateFavorite(id) {
    const template = templates.find(item => item.id === id);
    if (!template) return;
    const updated = { ...template, favorite: !template.favorite, updatedAt: new Date().toISOString() };
    await dbPut(updated);
    const index = templates.findIndex(item => item.id === id);
    if (index >= 0) templates[index] = updated;
    renderTemplates();
  }

  async function addTemplateFile(file) {
    if (!file || !/pdf/i.test(file.type || file.name)) return;
    setStatus("Έλεγχος βιβλιοθήκης και ανάλυση του PDF…");
    try {
      const pdfBytes = await file.arrayBuffer();
      const fingerprint = await fingerprintPdfBytes(pdfBytes);
      const byteFingerprint = localFingerprintPdfBytes(pdfBytes);
      const savedProfile = await findSavedMappingProfile(fingerprint, byteFingerprint, file.name);
      const duplicate = await findDuplicateTemplate(pdfBytes, fingerprint);

      if (duplicate) {
        const mappedCount = templateMappedCount(duplicate);
        const label = duplicate.name || duplicate.originalName || "Έντυπο";

        if (mappedCount) {
          useTemplate(duplicate.id, `Το ίδιο PDF υπάρχει ήδη στη βιβλιοθήκη με ${mappedCount} αποθηκευμένες αντιστοιχίσεις. Χρησιμοποιείται το έτοιμο πρότυπο «${label}» — δεν χρειάζεται νέα αντιστοίχιση.`);
          return;
        }

        if (savedProfile) {
          const restored = await applyProfileToTemplate(duplicate, savedProfile);
          await refreshTemplates();
          useTemplate(restored.id, `Το PDF αναγνωρίστηκε και επανήλθαν ${profileMappedCount(savedProfile)} αποθηκευμένες αντιστοιχίσεις. Δεν χρειάζεται να ξανανοίξεις τα «Πεδία».`);
          return;
        }

        // Αν έχει ήδη δημιουργηθεί άδειο διπλότυπο από προηγούμενη αποτυχημένη
        // προσπάθεια, προτιμάμε τυχόν παλιότερο πρότυπο με έτοιμες αντιστοιχίσεις.
        const mappedLegacy = findLegacyMappedTemplateForFile(file);
        if (mappedLegacy && mappedLegacy.id !== duplicate.id) {
          const legacyCount = templateMappedCount(mappedLegacy);
          const legacyLabel = mappedLegacy.name || mappedLegacy.originalName || "Έντυπο";
          const reuse = window.confirm(`Βρέθηκε άδειο αντίγραφο του PDF, αλλά υπάρχει και έτοιμο πρότυπο «${legacyLabel}» με ${legacyCount} αντιστοιχίσεις.\n\nΠατήστε OK για να χρησιμοποιηθεί το έτοιμο πρότυπο και να διαγραφεί το άδειο αντίγραφο.`);
          if (reuse) {
            const linked = await relinkLegacyMappedTemplate(mappedLegacy, file, pdfBytes, fingerprint, byteFingerprint);
            await dbDelete(duplicate.id);
            await refreshTemplates();
            useTemplate(linked.id, `Χρησιμοποιείται το έτοιμο πρότυπο «${legacyLabel}» με ${legacyCount} αντιστοιχίσεις. Το άδειο διπλότυπο αφαιρέθηκε.`);
            return;
          }
        }

        useTemplate(duplicate.id, `Το PDF υπάρχει ήδη στη βιβλιοθήκη, αλλά αυτή η εγγραφή δεν έχει αντιστοιχίσεις. Πάτησε «Πεδία» μόνο αν είναι νέο πρότυπο.`);
        return;
      }

      if (savedProfile) {
        const fields = await inspectPdf(pdfBytes);
        const name = file.name.replace(/\.pdf$/i, "") || savedProfile.displayName || "Έντυπο";
        const restoredTemplate = {
          id: uid(),
          name,
          originalName: file.name,
          pdfBytes: pdfBytes.slice(0),
          fingerprint,
          byteFingerprint,
          storageVersion: 2,
          fields,
          mapping: { ...(savedProfile.mapping || {}) },
          visualFields: Array.isArray(savedProfile.visualFields) ? savedProfile.visualFields.map(item => ({ ...item })) : [],
          supplementFields: Array.isArray(savedProfile.supplementFields) ? savedProfile.supplementFields.map(item => ({ ...item })) : [],
          mappingProfileKey: savedProfile.key,
          category: savedProfile.category || "Λοιπά",
          favorite: false,
          lastUsedAt: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          version: 4
        };
        await dbPut(restoredTemplate);
        await persistMappingProfile(restoredTemplate);
        rememberSelectedTemplate(restoredTemplate.id);
        await refreshTemplates();
        useTemplate(restoredTemplate.id, `Το πρότυπο είχε διαγραφεί από τη βιβλιοθήκη, αλλά η αντιστοίχισή του είχε κρατηθεί. Επανήλθαν αυτόματα ${profileMappedCount(savedProfile)} πεδία.`);
        return;
      }

      // Πρότυπα που δημιουργήθηκαν σε παλιότερες εκδόσεις μπορεί να έχουν
      // έτοιμες αντιστοιχίσεις αλλά να μην έχουν το σημερινό fingerprint.
      // Πριν δημιουργήσουμε δεύτερη άδεια εγγραφή, δίνουμε τη δυνατότητα
      // σύνδεσης του PDF με το ήδη ρυθμισμένο πρότυπο.
      const legacyMapped = findLegacyMappedTemplateForFile(file);
      if (legacyMapped) {
        const mappedCount = templateMappedCount(legacyMapped);
        const label = legacyMapped.name || legacyMapped.originalName || "Έντυπο";
        const reuse = window.confirm(`Βρέθηκε ήδη αποθηκευμένο πρότυπο «${label}» με ${mappedCount} αντιστοιχίσεις.\n\nΠατήστε OK για να χρησιμοποιηθούν οι υπάρχουσες αντιστοιχίσεις με αυτό το PDF.\nΠατήστε Άκυρο μόνο αν πρόκειται πραγματικά για διαφορετικό έντυπο με το ίδιο όνομα.`);
        if (reuse) {
          const linked = await relinkLegacyMappedTemplate(legacyMapped, file, pdfBytes, fingerprint, byteFingerprint);
          useTemplate(linked.id, `Το PDF συνδέθηκε με το ήδη έτοιμο πρότυπο «${label}». Διατηρήθηκαν ${mappedCount} αντιστοιχίσεις — δεν χρειάζεται να ανοίξεις ξανά τα «Πεδία».`);
          return;
        }
      }

      const fields = await inspectPdf(pdfBytes);
      const mapping = {};
      fields.forEach(field => { mapping[field.name] = guessSource(field.name); });
      const suggestedName = file.name.replace(/\.pdf$/i, "") || "Νέο έντυπο";
      const details = await requestTemplateDetails(suggestedName, "Λοιπά", "Νέο πρότυπο PDF");
      if (!details) { setStatus("Η προσθήκη του PDF ακυρώθηκε.", "warning"); return; }
      const template = {
        id: uid(),
        name: details.name,
        category: details.category,
        favorite: false,
        lastUsedAt: null,
        originalName: file.name,
        pdfBytes: pdfBytes.slice(0),
        fingerprint,
        byteFingerprint,
        storageVersion: 2,
        fields,
        mapping,
        visualFields: [],
        supplementFields: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1
      };
      await dbPut(template);
      rememberSelectedTemplate(template.id);
      await refreshTemplates();
      if (!fields.length) {
        setStatus("Το PDF προστέθηκε. Δεν έχει έτοιμα πεδία φόρμας, οπότε θα ορίσουμε οπτικά τις θέσεις συμπλήρωσης.", "warning");
        openMapping(template.id);
      } else {
        setStatus(`Το έντυπο προστέθηκε. Εντοπίστηκαν ${fields.length} πεδία PDF.`, "success");
        openMapping(template.id);
      }
    } catch (error) {
      console.error(error);
      setStatus("Δεν μπόρεσα να διαβάσω αυτό το PDF. Έλεγξε ότι δεν είναι κλειδωμένο με κωδικό.", "error");
    }
  }

  async function replaceTemplatePdf(id, file) {
    const existing = templates.find(item => item.id === id);
    if (!existing || !file) return;
    setStatus("Ανανέωση του αποθηκευμένου PDF…");
    try {
      const pdfBytes = await file.arrayBuffer();
      const fingerprint = await fingerprintPdfBytes(pdfBytes);
      const byteFingerprint = localFingerprintPdfBytes(pdfBytes);
      const fields = await inspectPdf(pdfBytes);
      const previousMapping = existing.mapping || {};
      const mapping = {};
      fields.forEach(field => { mapping[field.name] = previousMapping[field.name] || guessSource(field.name); });
      const updated = {
        ...existing,
        pdfBytes: pdfBytes.slice(0),
        fingerprint,
        byteFingerprint,
        storageVersion: 2,
        originalName: file.name || existing.originalName,
        fields,
        mapping,
        updatedAt: new Date().toISOString()
      };
      delete updated.pdfBlob;
      await dbPut(updated);
      if (templateMappedCount(updated)) await persistMappingProfile(updated);
      const index = templates.findIndex(item => item.id === id);
      if (index >= 0) templates[index] = updated;
      if (currentMapTemplate?.id === id) currentMapTemplate = updated;
      renderTemplates();
      setStatus(`Το PDF ανανεώθηκε. Διατηρήθηκαν ${Array.isArray(updated.visualFields) ? updated.visualFields.length : 0} οπτικά πεδία και οι υπάρχουσες αντιστοιχίσεις.`, "success");
    } catch (error) {
      console.error(error);
      setStatus(`Δεν ανανεώθηκε το PDF: ${error?.message || "άγνωστο σφάλμα"}`, "error");
    } finally {
      replaceTemplateId = null;
    }
  }

  function searchablePeople() {
    const rows = [];
    customersArray().forEach(customer => {
      rows.push({ type: "customer", customer, person: customer, policy: null });
      (customer.policies || []).forEach(policy => {
        (policy.coveredMembers || []).forEach(member => {
          rows.push({ type: "member", customer, person: member, policy });
        });
      });
    });
    return rows;
  }

  function renderCustomerResults(query) {
    const host = $("formsCustomerResults");
    if (!host) return;
    const q = normalizeText(query);
    if (!q) { host.classList.remove("open"); host.innerHTML = ""; return; }

    const matches = searchablePeople().filter(row => {
      const person = row.person || {};
      const customer = row.customer || {};
      const policy = row.policy || {};
      const haystack = normalizeText([
        displayName(person), person.company, person.afm, person.phone, person.email,
        row.type === "member" ? displayName(customer) : "",
        row.type === "member" ? policy.number : "",
        row.type === "member" ? policy.product : ""
      ].filter(Boolean).join(" "));
      return haystack.includes(q);
    }).slice(0, 40);

    const allCustomers = customersArray();
    host.innerHTML = matches.length ? matches.map(row => {
      const person = row.person || {};
      if (row.type === "member") {
        const policyKey = row.policy?.id || row.policy?.number || "";
        const secondary = [
          "Καλυπτόμενο μέλος",
          row.policy?.number && `Συμβόλαιο ${row.policy.number}`,
          `Κύριος: ${displayName(row.customer)}`
        ].filter(Boolean).map(esc).join(" · ");
        return `<button class="forms-customer-option forms-member-option" type="button" data-member-customer-id="${esc(row.customer.id)}" data-member-policy-key="${esc(policyKey)}" data-member-id="${esc(person.id)}"><strong>${esc(displayName(person) || "Καλυπτόμενο μέλος")}</strong><span>${secondary}</span></button>`;
      }
      return `<button class="forms-customer-option" type="button" data-customer-id="${esc(row.customer.id)}"><strong>${esc(displayName(row.customer))}</strong><span>${[row.customer.afm && `ΑΦΜ ${row.customer.afm}`, row.customer.phone].filter(Boolean).map(esc).join(" · ")}</span></button>`;
    }).join("") : `<div class="forms-empty">${allCustomers.length ? "Δεν βρέθηκε πελάτης ή καλυπτόμενο μέλος." : "Δεν είναι ακόμη διαθέσιμα τα στοιχεία πελατών του CRM. Κλείσε και ξανάνοιξε τα Έντυπα."}</div>`;
    host.classList.add("open");
  }

  function selectCoveredMemberFromSearch(customerId, policyKey, memberId) {
    const customer = customersArray().find(item => String(item.id) === String(customerId));
    if (!customer) return;
    const policy = (customer.policies || []).find(item => String(item.id || item.number) === String(policyKey));
    const member = (policy?.coveredMembers || []).find(item => String(item.id) === String(memberId));
    if (!policy || !member) return;

    selectedCustomerId = customer.id;
    selectedPolicySource = `policy:${policy.id || policy.number}`;
    selectedPersonId = `member:${member.id}`;
    $("formsCustomerResults")?.classList.remove("open");
    const search = $("formsCustomerSearch");
    if (search) search.value = "";

    const selected = $("formsSelectedCustomer");
    if (selected) {
      selected.innerHTML = `<div><strong>${esc(displayName(member) || "Καλυπτόμενο μέλος")}</strong><small>${esc(`Καλυπτόμενο μέλος · Κύριος ασφαλισμένος: ${displayName(customer)}${policy.number ? ` · Συμβόλαιο ${policy.number}` : ""}`)}</small></div><button class="forms-secondary" id="formsClearCustomerBtn" type="button">Αλλαγή</button>`;
      selected.classList.add("show");
      $("formsClearCustomerBtn")?.addEventListener("click", clearCustomer);
    }

    renderPolicyOptions();
    renderPersonOptions();
    const policySelect = $("formsPolicySelect");
    if (policySelect) policySelect.value = selectedPolicySource;
    const personSelect = $("formsPersonSelect");
    if (personSelect) personSelect.value = selectedPersonId;
    setStatus(selectedTemplateId ? `Επιλέχθηκε καλυπτόμενο μέλος: ${displayName(member)}.` : "Επίλεξε έντυπο από τη βιβλιοθήκη.");
  }

  function selectCustomer(id) {
    const customer = customersArray().find(item => String(item.id) === String(id));
    if (!customer) return;
    selectedCustomerId = customer.id;
    selectedPolicySource = "";
    selectedPersonId = "insured";
    $("formsCustomerResults")?.classList.remove("open");
    const search = $("formsCustomerSearch");
    if (search) search.value = "";
    const selected = $("formsSelectedCustomer");
    if (selected) {
      selected.innerHTML = `<div><strong>${esc(displayName(customer))}</strong><small>${[customer.afm && `ΑΦΜ ${customer.afm}`, customer.phone].filter(Boolean).map(esc).join(" · ")}</small></div><button class="forms-secondary" id="formsClearCustomerBtn" type="button">Αλλαγή</button>`;
      selected.classList.add("show");
      $("formsClearCustomerBtn")?.addEventListener("click", clearCustomer);
    }
    renderPolicyOptions();
    renderPersonOptions();
    setStatus(selectedTemplateId ? "Έτοιμο για αυτόματη συμπλήρωση." : "Επίλεξε έντυπο από τη βιβλιοθήκη.");
  }

  function clearCustomer() {
    selectedCustomerId = null;
    selectedPolicySource = "";
    selectedPersonId = "insured";
    $("formsSelectedCustomer")?.classList.remove("show");
    renderPolicyOptions();
    renderPersonOptions();
    setStatus("Επίλεξε έναν πελάτη από το CRM.");
  }

  function currentCustomer() {
    return customersArray().find(item => String(item.id) === String(selectedCustomerId)) || null;
  }

  function renderPolicyOptions() {
    const select = $("formsPolicySelect");
    if (!select) return;
    const customer = currentCustomer();
    const regular = customer?.policies || [];
    const autos = customer ? autoPoliciesArray().filter(item => String(item.insuredId) === String(customer.id)) : [];
    const options = [`<option value="">Χωρίς συγκεκριμένο συμβόλαιο</option>`];
    if (regular.length) {
      options.push(`<optgroup label="Συμβόλαια Ζωής">${regular.map(policy => `<option value="policy:${esc(policy.id || policy.number)}">${esc(policy.number || "Χωρίς αριθμό")}${policy.product ? ` — ${esc(policy.product)}` : ""}</option>`).join("")}</optgroup>`);
    }
    if (autos.length) {
      options.push(`<optgroup label="Συμβόλαια Αυτοκινήτου">${autos.map(policy => `<option value="auto:${esc(policy.id)}">${esc(policy.policyNumber || "Συμβόλαιο")}${policy.registrationNumber ? ` — ${esc(policy.registrationNumber)}` : ""}</option>`).join("")}</optgroup>`);
    }
    select.innerHTML = options.join("");
    if ([...select.options].some(option => option.value === selectedPolicySource)) select.value = selectedPolicySource;
    else selectedPolicySource = "";
  }

  function selectedRegularPolicy() {
    const customer = currentCustomer();
    if (!customer || !selectedPolicySource.startsWith("policy:")) return null;
    const key = selectedPolicySource.slice(7);
    return (customer.policies || []).find(policy => String(policy.id || policy.number) === key) || null;
  }

  function selectedAutoPolicy() {
    const customer = currentCustomer();
    if (!customer || !selectedPolicySource.startsWith("auto:")) return null;
    const key = selectedPolicySource.slice(5);
    return autoPoliciesArray().find(policy => String(policy.id) === key && String(policy.insuredId) === String(customer.id)) || null;
  }

  function renderPersonOptions() {
    const select = $("formsPersonSelect");
    if (!select) return;
    const policy = selectedRegularPolicy();
    const members = policy?.coveredMembers || [];
    select.innerHTML = `<option value="insured">Κύριος ασφαλισμένος</option>${members.map(member => `<option value="member:${esc(member.id)}">${esc(displayName(member) || "Καλυπτόμενο μέλος")}</option>`).join("")}`;
    if ([...select.options].some(option => option.value === selectedPersonId)) select.value = selectedPersonId;
    else { selectedPersonId = "insured"; select.value = "insured"; }
  }

  function selectedPerson(customer, policy) {
    if (!customer) return null;
    if (!selectedPersonId.startsWith("member:")) return customer;
    const memberId = selectedPersonId.slice(7);
    const member = (policy?.coveredMembers || []).find(item => String(item.id) === memberId);
    if (!member) return customer;
    if (member.sameAddressAsInsured) {
      return { ...member, street: customer.street, streetNumber: customer.streetNumber, area: customer.area, postalCode: customer.postalCode };
    }
    return member;
  }

  function buildContext() {
    const insured = currentCustomer();
    const regularPolicy = selectedRegularPolicy();
    const autoPolicy = selectedAutoPolicy();
    const person = selectedPerson(insured, regularPolicy);
    const coverage = regularPolicy?.coverage || {};
    return {
      insured, person, regularPolicy, autoPolicy, coverage,
      vehicleRegValues: { ...vehicleRegValues },
      supplementalValues: { ...supplementalValues }
    };
  }

  function sourceValue(key, context) {
    if (!key) return "";
    if (String(key).startsWith("supplement.")) {
      const id = String(key).slice("supplement.".length);
      return (context?.supplementalValues || supplementalValues)[id] ?? "";
    }
    if (String(key).startsWith("vehicleReg.")) {
      const id = String(key).slice("vehicleReg.".length);
      return (context?.vehicleRegValues || vehicleRegValues)[id] ?? "";
    }
    const person = context.person || {};
    const insured = context.insured || {};
    const policy = context.regularPolicy || {};
    const coverage = context.coverage || {};
    const auto = context.autoPolicy || {};
    const selectedContractIsAuto = Boolean(context.autoPolicy);
    const contractNumber = selectedContractIsAuto ? (auto.policyNumber || "") : (policy.number || "");
    const contractProduct = selectedContractIsAuto ? (auto.packageName || auto.product || "") : (policy.product || "");
    const contractStartDate = selectedContractIsAuto ? formatDateGR(auto.startDate) : formatDateGR(coverage.startDate);
    const contractEndDate = selectedContractIsAuto ? formatDateGR(auto.endDate) : "";
    const values = {
      "person.fullName": displayName(person),
      "person.firstName": person.firstName || "",
      "person.lastName": person.lastName || "",
      "person.company": person.company || "",
      "person.phone": person.phone || "",
      "person.email": person.email || "",
      "person.afm": person.afm || "",
      "person.dou": person.dou || "",
      "person.adt": person.adt || "",
      "person.birthDate": formatDateGR(person.birthDate),
      "person.address": fullAddress(person),
      "person.street": person.street || "",
      "person.streetNumber": person.streetNumber || "",
      "person.area": person.area || "",
      "person.postalCode": person.postalCode || "",
      "person.notes": person.notes || "",
      "insured.fullName": displayName(insured),
      "insured.afm": insured.afm || "",
      "insured.phone": insured.phone || "",
      "insured.email": insured.email || "",
      "insured.address": fullAddress(insured),
      "contract.number": contractNumber,
      "contract.type": selectedContractIsAuto ? "Αυτοκινήτου" : (context.regularPolicy ? "Ζωής" : ""),
      "contract.product": contractProduct,
      "contract.startDate": contractStartDate,
      "contract.endDate": contractEndDate,
      "policy.number": policy.number || "",
      "policy.product": policy.product || "",
      "policy.startDate": formatDateGR(coverage.startDate),
      "policy.tariff": coverage.tariff || "",
      "policy.hospitalProgram": coverage.hospitalProgram || "",
      "policy.diagnosticPackage": coverage.diagnosticPackage || "",
      "auto.policyNumber": auto.policyNumber || "",
      "auto.registrationNumber": auto.registrationNumber || "",
      "auto.startDate": formatDateGR(auto.startDate),
      "auto.endDate": formatDateGR(auto.endDate),
      "auto.packageName": auto.packageName || "",
      "auto.insuredValue": auto.insuredValue ?? "",
      "date.today": formatTodayGR()
    };
    return values[key] ?? "";
  }

  const VEHICLE_REG_FIELDS = [
    ["make", "Μάρκα", "D.1"],
    ["type", "Τύπος", "D.2"],
    ["firstRegistration", "Πρώτη άδεια κυκλοφορίας", "B"],
    ["firstRegistrationGreece", "Πρώτη άδεια στην Ελλάδα", "4"],
    ["vin", "Αριθμός πλαισίου / VIN", "E"],
    ["engineNumber", "Αριθμός κινητήρα", "P.5"],
    ["fuel", "Καύσιμο", "P.3"],
    ["color", "Χρώμα", "R"]
  ];

  function vehicleRegMappings(template) {
    const keys = [];
    Object.values(template?.mapping || {}).forEach(sourceKey => {
      if (String(sourceKey || "").startsWith("vehicleReg.")) keys.push(String(sourceKey));
    });
    (Array.isArray(template?.visualFields) ? template.visualFields : []).forEach(item => {
      if (String(item?.sourceKey || "").startsWith("vehicleReg.")) keys.push(String(item.sourceKey));
    });
    return [...new Set(keys)];
  }

  function vehicleRegAvailableKeys(values = vehicleRegValues) {
    return VEHICLE_REG_FIELDS
      .map(([key]) => key)
      .filter(key => String(values?.[key] ?? "").trim() !== "")
      .map(key => `vehicleReg.${key}`);
  }

  function refreshVehicleRegMappingStatus() {
    const host = $("formsVehicleRegMappingStatus");
    if (!host) return;
    const template = templates.find(item => item.id === selectedTemplateId);
    if (!template) {
      host.innerHTML = `<span>Επίλεξε πρώτα έντυπο για να δεις την αντιστοίχιση της άδειας.</span>`;
      return;
    }
    const mapped = vehicleRegMappings(template);
    const available = vehicleRegAvailableKeys();
    const mappedWithValue = mapped.filter(key => available.includes(key));
    const cls = mapped.length ? "ok" : "warning";
    host.innerHTML = `<span class="${cls}"><strong>Πεδία άδειας στο πρότυπο: ${mapped.length}/8</strong>${available.length ? ` · με τιμή τώρα: ${mappedWithValue.length}/8` : ""}</span>`;
  }

  function openVehicleRegMapping() {
    const template = templates.find(item => item.id === selectedTemplateId);
    if (!template) { setStatus("Επίλεξε πρώτα έντυπο από τη βιβλιοθήκη.", "warning"); return; }
    openMapping(template.id);
    setTimeout(() => {
      const select = $("formsVisualSource");
      if (!select) return;
      const mapped = new Set(vehicleRegMappings(template));
      const first = sourceDefinitions.find(([key]) => String(key).startsWith("vehicleReg.") && !mapped.has(key))?.[0] || "vehicleReg.make";
      if ([...select.options].some(option => option.value === first)) select.value = first;
      const help = $("formsVisualHelp");
      if (help) help.innerHTML = `Τοποθέτησε μία φορά τα πεδία <strong>Άδεια Κυκλοφορίας</strong> στα αντίστοιχα σημεία του PDF και πάτησε «Αποθήκευση». Μετά θα συμπληρώνονται αυτόματα σε κάθε νέα άδεια.`;
    }, 250);
  }

  function renderVehicleRegistrationSection() {
    const fileHost = $("formsVehicleRegFile");
    const valuesHost = $("formsVehicleRegValues");
    const clearBtn = $("formsVehicleRegClearBtn");
    if (fileHost) fileHost.textContent = vehicleRegFileName ? `🚘 ${vehicleRegFileName}` : "";
    if (clearBtn) clearBtn.style.display = vehicleRegFileName ? "inline-flex" : "none";
    if (!valuesHost) return;
    const hasFile = Boolean(vehicleRegFileName);
    valuesHost.innerHTML = VEHICLE_REG_FIELDS.map(([key, label, code]) => `<div class="forms-field"><label>${esc(label)} <small>(${esc(code)})</small></label><input type="text" data-vehicle-reg-runtime="${esc(key)}" value="${esc(vehicleRegValues[key] || "")}" placeholder="${hasFile ? "Δεν αναγνωρίστηκε — γράψε/διόρθωσε" : "Θα συμπληρωθεί από την άδεια"}" /></div>`).join("");
    refreshVehicleRegMappingStatus();
  }

  function clearVehicleRegistration(render = true) {
    vehicleRegFileName = "";
    vehicleRegText = "";
    vehicleRegValues = {};
    if (render) renderVehicleRegistrationSection();
  }

  function normalizeVehicleRegText(value) {
    return String(value || "")
      .replace(/[\u00A0\t]+/g, " ")
      .replace(/[‐‑‒–—]/g, "-")
      .replace(/\r/g, "\n")
      .replace(/[ ]{2,}/g, " ")
      .trim();
  }

  function vehicleRegCodeCorePattern(code) {
    const digit = d => ({"1":"[1IΙl]","2":"[2Z]","3":"[3]","4":"[4A]","5":"[5S]"}[d] || d);
    const letter = ch => ({"D":"[DΟ0]","P":"[PΡ]","E":"[EΕ]","B":"[BΒ8]","R":"[RΡ]"}[ch] || ch);
    if (code === "4") return "4";
    const parts = code.split(".");
    if (parts.length === 2) return String.raw`${letter(parts[0])}\s*[\.·,:]?\s*${digit(parts[1])}`;
    return letter(code);
  }

  function vehicleRegCodePattern(code) {
    const core = vehicleRegCodeCorePattern(code);
    return String.raw`(?:\(\s*${core}\s*\)|${core})`;
  }

  function vehicleRegCodeAtLineStartPattern(code) {
    const core = vehicleRegCodeCorePattern(code);
    // Registration-field codes are printed as the first token of their row.
    // Requiring the code at the beginning avoids catastrophic false matches such
    // as the standalone letter E inside ordinary words like CERTIFICATE/HOLDER.
    return String.raw`^\s*(?:\(\s*${core}\s*\)|${core})(?=\s|[:=\-])\s*[:=\-]?\s*`;
  }

  const VEHICLE_REG_DELIMITER_CODES = [
    "C.1.1","C.1.2","C.1.3","D.1","D.2","D.3","F.1","F.2","F.3","O.1","O.2","P.1","P.2","P.3","P.4","P.5","S.1","S.2","U.1","U.2","U.3","V.6","V.7","V.9",
    "A","B","E","G","H","I","J","K","L","M","Q","R","T","W",
    "1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28"
  ];

  function vehicleRegDelimiterPattern(excludeCode = "") {
    return VEHICLE_REG_DELIMITER_CODES
      .filter(code => code !== excludeCode)
      .sort((a,b) => b.length - a.length)
      .map(vehicleRegCodePattern)
      .join("|");
  }

  function cleanVehicleRegCandidate(value) {
    return String(value || "")
      .replace(/^\s*[:=\-]+\s*/, "")
      .replace(/\s+/g, " ")
      .replace(/[|]+$/g, "")
      .trim()
      .slice(0, 120);
  }

  function vehicleRegLines(text) {
    return normalizeVehicleRegText(text).split(/\n+/).map(line => cleanVehicleRegCandidate(line)).filter(Boolean);
  }

  function vehicleRegLineStartsWithKnownCode(line, excludeCode = "") {
    const trimmed = String(line || "").trim();
    return VEHICLE_REG_DELIMITER_CODES.some(code => {
      if (code === excludeCode) return false;
      try { return new RegExp(vehicleRegCodeAtLineStartPattern(code), "i").test(trimmed); } catch (_) { return false; }
    });
  }

  function stripVehicleRegLabel(code, value) {
    let out = cleanVehicleRegCandidate(value);
    const patterns = {
      "D.1": [/^(?:ΜΑΡΚΑ|MARKA|MAKE|MARQUE)\s*[:\-]?\s*/i],
      "D.2": [/^(?:ΤΥΠΟΣ|TYPE|TYPOS)\s*[:\-]?\s*/i],
      "B": [/^(?:ΗΜΕΡΟΜΗΝΙΑ|DATE|ΠΡΩΤΗ\s+ΑΔΕΙΑ)[^0-9]{0,35}/i],
      "4": [/^(?:ΗΜΕΡΟΜΗΝΙΑ|DATE|ΠΡΩΤΗ\s+ΑΔΕΙΑ)[^0-9]{0,35}/i],
      "E": [/^(?:ΑΡΙΘΜΟΣ\s+ΠΛΑΙΣΙΟΥ|ΠΛΑΙΣΙΟ|VIN|CHASSIS|IDENTIFICATION)\s*[:\-]?\s*/i],
      "P.5": [/^(?:ΑΡΙΘΜΟΣ\s+ΚΙΝΗΤΗΡΑ|ΚΙΝΗΤΗΡΑΣ|ENGINE)\s*[:\-]?\s*/i],
      "P.3": [/^(?:ΚΑΥΣΙΜΟ|FUEL)\s*[:\-]?\s*/i],
      "R": [/^(?:ΧΡΩΜΑ|COLOU?R)\s*[:\-]?\s*/i]
    };
    for (const re of patterns[code] || []) out = out.replace(re, "");
    return cleanVehicleRegCandidate(out);
  }

  function candidatesAfterVehicleRegCode(text, code, maxLines = 3) {
    const lines = vehicleRegLines(text);
    const codeRe = new RegExp(vehicleRegCodeAtLineStartPattern(code), "i");
    const candidates = [];
    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];
      const match = codeRe.exec(line);
      if (!match) continue;
      const tail = stripVehicleRegLabel(code, line.slice(match[0].length));
      if (tail) candidates.push(tail);
      for (let j = i + 1; j < Math.min(lines.length, i + 1 + maxLines); j += 1) {
        if (vehicleRegLineStartsWithKnownCode(lines[j], code)) break;
        const next = stripVehicleRegLabel(code, lines[j]);
        if (next) candidates.push(next);
      }
    }
    return candidates;
  }

  function dateFromVehicleRegCode(text, code) {
    const candidates = candidatesAfterVehicleRegCode(text, code, 3);
    for (const candidate of candidates) {
      const match = String(candidate).match(/([0-3]?\d[\/\.\-][01]?\d[\/\.\-](?:19|20)?\d{2})/);
      if (!match) continue;
      const raw = match[1].replace(/[.\-]/g, "/");
      const bits = raw.split("/");
      if (bits.length !== 3) continue;
      const [d,m,y0] = bits;
      const y = y0.length === 2 ? (Number(y0) > 50 ? `19${y0}` : `20${y0}`) : y0;
      return `${String(d).padStart(2,"0")}/${String(m).padStart(2,"0")}/${y}`;
    }
    return "";
  }

  function valueFromVehicleRegCode(text, code, maxLen = 60) {
    const candidates = candidatesAfterVehicleRegCode(text, code, 2);
    for (const candidate of candidates) {
      const cleaned = cleanVehicleRegCandidate(candidate).slice(0, maxLen);
      if (cleaned) return cleaned;
    }
    return "";
  }

  function looksLikeRegistrationDefinition(value) {
    const n = normalizeText(value);
    return [
      "μαρκα", "τυπος", "αριθμος αναγνωρισης", "αριθμος πλαισιου", "καυσιμου", "καυσιμο",
      "χρωμα του οχηματος", "χρωμα", "ημερομηνια εκδοσης", "engine number", "vehicle identification",
      "αδεια κυκλοφοριας", "κυκλοφορια", "διευθυνση μεταφορ", "holder", "certificate", "certificat",
      "minister", "republic", "ελληνικη δημοκρατια", "στοιχεια κατοχου", "owner"
    ].some(label => n.includes(label));
  }

  function vehicleRegLooksLikeNoise(value) {
    const out = String(value || "").trim();
    if (!out) return true;
    if (looksLikeRegistrationDefinition(out)) return true;
    if ((out.match(/[|{}<>]/g) || []).length >= 2) return true;
    if ((out.match(/["'`]/g) || []).length >= 4) return true;
    return false;
  }

  function sanitizeVehicleRegValue(code, value) {
    let out = stripVehicleRegLabel(code, cleanVehicleRegCandidate(value));
    if (!out || vehicleRegLooksLikeNoise(out)) return "";

    if (code === "E") {
      const compact = out.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, "");
      const digits = (compact.match(/\d/g) || []).length;
      return compact.length === 17 && /[A-Z]/.test(compact) && digits >= 3 ? compact : "";
    }

    if (code === "P.5") {
      const original = out.toUpperCase().trim();
      if (/[Α-ΩΆΈΉΊΌΎΏ]/.test(original) || original.split(/\s+/).length > 2) return "";
      const compact = original.replace(/[^A-Z0-9\-]/g, "");
      if (compact.length < 4 || compact.length > 24 || !/[0-9]/.test(compact)) return "";
      return compact;
    }

    if (code === "P.3") return normalizeVehicleFuel(out);
    if (code === "R") return normalizeVehicleColor(out);

    if (code === "D.1") {
      const cleaned = out.replace(/[^A-Za-zΑ-ΩΆΈΉΊΌΎΏ0-9 .\-]/g, " ").replace(/\s+/g, " ").trim();
      if (!cleaned || cleaned.length > 32 || cleaned.split(/\s+/).length > 4) return "";
      return cleaned;
    }

    if (code === "D.2") {
      const cleaned = out.replace(/[^A-Za-zΑ-ΩΆΈΉΊΌΎΏ0-9 ._\-\/]/g, " ").replace(/\s+/g, " ").trim();
      if (!cleaned || cleaned.length > 42 || cleaned.split(/\s+/).length > 6) return "";
      return cleaned;
    }
    return out;
  }

  function fallbackVinFromVehicleRegText(raw) {
    const upper = String(raw || "").toUpperCase();
    const direct = upper.match(/\b[A-HJ-NPR-Z0-9]{17}\b/g) || [];
    const hit = direct.find(item => /[A-Z]/.test(item) && (item.match(/\d/g) || []).length >= 3);
    if (hit) return hit;
    for (const line of upper.split(/\n+/)) {
      const compact = line.replace(/[^A-HJ-NPR-Z0-9]/g, "");
      const m = compact.match(/[A-HJ-NPR-Z0-9]{17}/g) || [];
      const found = m.find(item => /[A-Z]/.test(item) && (item.match(/\d/g) || []).length >= 3);
      if (found) return found;
    }
    return "";
  }

  function normalizeVehicleFuel(value) {
    const n = normalizeText(value);
    const pairs = [
      ["αμολυβδ", "ΑΜΟΛΥΒΔΗ - ΚΑΤΑΛΥΤΙΚΟ"], ["καταλυτικ", "ΑΜΟΛΥΒΔΗ - ΚΑΤΑΛΥΤΙΚΟ"],
      ["βενζινη", "ΒΕΝΖΙΝΗ"], ["petrol", "ΒΕΝΖΙΝΗ"], ["gasoline", "ΒΕΝΖΙΝΗ"],
      ["πετρελαιο", "ΠΕΤΡΕΛΑΙΟ"], ["diesel", "ΠΕΤΡΕΛΑΙΟ"],
      ["υβριδ", "ΥΒΡΙΔΙΚΟ"], ["hybrid", "ΥΒΡΙΔΙΚΟ"],
      ["ηλεκτρ", "ΗΛΕΚΤΡΙΚΟ"], ["electric", "ΗΛΕΚΤΡΙΚΟ"],
      ["lpg", "LPG"], ["υγραεριο", "LPG"], ["cng", "CNG"], ["φυσικο αεριο", "CNG"]
    ];
    return pairs.find(([token]) => n.includes(token))?.[1] || "";
  }

  function fallbackFuelFromVehicleRegText(raw) {
    return normalizeVehicleFuel(raw);
  }

  function normalizeVehicleColor(value) {
    const n = normalizeText(value);
    const pairs = [
      ["λευκ", "ΛΕΥΚΟ"], ["white", "ΛΕΥΚΟ"], ["μαυρ", "ΜΑΥΡΟ"], ["black", "ΜΑΥΡΟ"],
      ["γκρι", "ΓΚΡΙ"], ["grey", "ΓΚΡΙ"], ["gray", "ΓΚΡΙ"], ["ασημ", "ΑΣΗΜΙ"], ["silver", "ΑΣΗΜΙ"],
      ["μπλε", "ΜΠΛΕ"], ["blue", "ΜΠΛΕ"], ["κοκκιν", "ΚΟΚΚΙΝΟ"], ["red", "ΚΟΚΚΙΝΟ"],
      ["πρασιν", "ΠΡΑΣΙΝΟ"], ["green", "ΠΡΑΣΙΝΟ"], ["κιτριν", "ΚΙΤΡΙΝΟ"], ["yellow", "ΚΙΤΡΙΝΟ"],
      ["πορτοκαλ", "ΠΟΡΤΟΚΑΛΙ"], ["orange", "ΠΟΡΤΟΚΑΛΙ"], ["καφε", "ΚΑΦΕ"], ["brown", "ΚΑΦΕ"],
      ["μπεζ", "ΜΠΕΖ"], ["beige", "ΜΠΕΖ"], ["χρυ", "ΧΡΥΣΟ"], ["gold", "ΧΡΥΣΟ"]
    ];
    return pairs.find(([token]) => n.includes(token))?.[1] || "";
  }

  function fallbackColorFromVehicleRegText(raw) {
    return normalizeVehicleColor(raw);
  }

  function fallbackMakeFromVehicleRegText(raw) {
    const upper = String(raw || "").toUpperCase();
    const brands = [
      "ALFA ROMEO","LAND ROVER","MERCEDES-BENZ","MERCEDES","VOLKSWAGEN","TOYOTA","PEUGEOT","CITROEN","RENAULT",
      "NISSAN","OPEL","FORD","HONDA","HYUNDAI","KIA","BMW","AUDI","SKODA","SEAT","FIAT","SUZUKI","MAZDA",
      "VOLVO","JEEP","DACIA","SMART","MINI","PORSCHE","MITSUBISHI","SUBARU","TESLA","CUPRA","LEXUS","MG"
    ];
    return brands.find(brand => upper.includes(brand)) || "";
  }

  function validVehicleRegDate(value) {
    const m = String(value || "").match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!m) return "";
    const d = Number(m[1]), mon = Number(m[2]), y = Number(m[3]);
    if (d < 1 || d > 31 || mon < 1 || mon > 12 || y < 1900 || y > 2100) return "";
    return value;
  }

  function parseVehicleRegistrationText(text) {
    const raw = normalizeVehicleRegText(text);
    const values = {
      make: sanitizeVehicleRegValue("D.1", valueFromVehicleRegCode(raw, "D.1", 32)),
      type: sanitizeVehicleRegValue("D.2", valueFromVehicleRegCode(raw, "D.2", 42)),
      firstRegistration: validVehicleRegDate(dateFromVehicleRegCode(raw, "B")),
      firstRegistrationGreece: validVehicleRegDate(dateFromVehicleRegCode(raw, "4")),
      vin: sanitizeVehicleRegValue("E", valueFromVehicleRegCode(raw, "E", 28)),
      engineNumber: sanitizeVehicleRegValue("P.5", valueFromVehicleRegCode(raw, "P.5", 28)),
      fuel: sanitizeVehicleRegValue("P.3", valueFromVehicleRegCode(raw, "P.3", 30)),
      color: sanitizeVehicleRegValue("R", valueFromVehicleRegCode(raw, "R", 30))
    };
    if (!values.vin) values.vin = fallbackVinFromVehicleRegText(raw);
    if (!values.fuel) values.fuel = fallbackFuelFromVehicleRegText(raw);
    if (!values.color) values.color = fallbackColorFromVehicleRegText(raw);
    if (!values.make) values.make = fallbackMakeFromVehicleRegText(raw);
    return values;
  }

  async function extractVehicleRegistrationPdf(file) {
    const buffer = await file.arrayBuffer();
    const pdfjs = await ensurePdfJs();
    const pdf = await pdfjs.getDocument({ data: new Uint8Array(buffer.slice(0)) }).promise;
    const pages = [];
    for (let pageNo = 1; pageNo <= Math.min(pdf.numPages, 2); pageNo += 1) {
      const page = await pdf.getPage(pageNo);
      const content = await page.getTextContent();
      let line = "";
      const lines = [];
      for (const item of content.items || []) {
        const str = String(item.str || "").trim();
        if (str) line += (line ? " " : "") + str;
        if (item.hasEOL) { if (line.trim()) lines.push(line.trim()); line = ""; }
      }
      if (line.trim()) lines.push(line.trim());
      pages.push(lines.join("\n"));
    }
    return pages.join("\n");
  }

  async function handleVehicleRegistrationFile(file) {
    setStatus("Ανάγνωση άδειας κυκλοφορίας…");
    vehicleRegFileName = file.name || "Άδεια Κυκλοφορίας.pdf";
    vehicleRegText = "";
    vehicleRegValues = {};
    try {
      let text = await extractVehicleRegistrationPdf(file);
      if (!String(text || "").trim()) {
        setStatus("Το PDF είναι σαρωμένο. Ξεκινά OCR…");
        const ocr = await ocrVehicleRegistrationPdf(file);
        text = ocr?.text || "";
        vehicleRegText = text;
        vehicleRegValues = mergeVehicleRegValues(ocr?.values || {}, parseVehicleRegistrationText(vehicleRegText));
      }
      if (!vehicleRegText) vehicleRegText = text || "";
      if (!Object.keys(vehicleRegValues || {}).length) vehicleRegValues = parseVehicleRegistrationText(vehicleRegText);
      renderVehicleRegistrationSection();
      const found = Object.values(vehicleRegValues).filter(Boolean).length;
      setStatus(`Η άδεια κυκλοφορίας διαβάστηκε. Αναγνωρίστηκαν ${found} από 8 στοιχεία. Έλεγξέ τα πριν την αυτόματη συμπλήρωση.`, found ? "success" : "warning");
    } catch (error) {
      console.error(error);
      vehicleRegText = "";
      vehicleRegValues = {};
      renderVehicleRegistrationSection();
      setStatus(`Δεν ολοκληρώθηκε η αυτόματη ανάγνωση (${error?.message || "άγνωστο σφάλμα"}). Μπορείς να συμπληρώσεις/διορθώσεις τα 8 πεδία χειροκίνητα.`, "warning");
    }
  }

  async function handleVehicleRegistrationImages(files, source = "Φωτογραφία") {
    const list = Array.from(files || []).filter(Boolean);
    if (!list.length) return;
    vehicleRegFileName = list.length === 1 ? (list[0].name || source) : `${source} (${list.length})`;
    vehicleRegText = "";
    vehicleRegValues = {};
    renderVehicleRegistrationSection();
    try {
      setStatus(`OCR άδειας κυκλοφορίας από ${source.toLocaleLowerCase("el-GR")}…`);
      const ocr = await ocrVehicleRegistrationImages(list);
      vehicleRegText = ocr?.text || "";
      vehicleRegValues = mergeVehicleRegValues(ocr?.values || {}, parseVehicleRegistrationText(vehicleRegText));
      renderVehicleRegistrationSection();
      const found = Object.values(vehicleRegValues).filter(Boolean).length;
      const chars = String(vehicleRegText || "").replace(/\s+/g, "").length;
      setStatus(`Η άδεια από ${source.toLocaleLowerCase("el-GR")} διαβάστηκε. Αναγνωρίστηκαν ${found} από 8 στοιχεία${found ? "" : ` (OCR: ${chars} χαρακτήρες)`}. Έλεγξέ τα πριν την αυτόματη συμπλήρωση.`, found ? "success" : "warning");
    } catch (error) {
      console.error(error);
      vehicleRegText = "";
      vehicleRegValues = {};
      renderVehicleRegistrationSection();
      setStatus(`Δεν ολοκληρώθηκε το OCR (${error?.message || "άγνωστο σφάλμα"}). Τα 8 πεδία είναι διαθέσιμα για χειροκίνητη συμπλήρωση.`, "warning");
    }
  }

  function renderSupplementSection() {
    const note = $("formsSupplementNote");
    const valuesHost = $("formsSupplementValues");
    const fileHost = $("formsSupplementFile");
    const clearBtn = $("formsSupplementClearBtn");
    const template = templates.find(item => item.id === selectedTemplateId);
    const fields = Array.isArray(template?.supplementFields) ? template.supplementFields : [];
    if (fileHost) fileHost.textContent = supplementalFileName ? `📎 ${supplementalFileName}` : "";
    if (clearBtn) clearBtn.style.display = supplementalFileName ? "inline-flex" : "none";
    if (!valuesHost || !note) return;
    if (!template) { note.textContent = "Επίλεξε πρώτα έντυπο."; valuesHost.innerHTML = ""; return; }
    if (!fields.length) {
      note.textContent = "Το συγκεκριμένο πρότυπο δεν έχει ορισμένα πεδία από συμπληρωματικό έγγραφο. Αν χρειάζονται, πρόσθεσέ τα από «Πεδία».";
      valuesHost.innerHTML = "";
      return;
    }
    note.textContent = "Ανέβασε το δεύτερο PDF. Η εφαρμογή θα προσπαθήσει να βρει τις τιμές και μπορείς να τις διορθώσεις πριν τη συμπλήρωση.";
    valuesHost.innerHTML = fields.map(field => `<div class="forms-field"><label>${esc(field.label || "Πεδίο")}</label><input type="text" data-supp-runtime="${esc(field.id)}" value="${esc(supplementalValues[field.id] || "")}" placeholder="${esc(field.matchLabel || field.label || "Τιμή")}" /></div>`).join("");
  }

  function clearSupplementDocument(render = true) {
    supplementalFileName = "";
    supplementalText = "";
    supplementalFormValues = {};
    supplementalValues = {};
    if (render) renderSupplementSection();
  }

  function readPdfFieldCurrentValue(field) {
    try {
      if (typeof field.getText === "function") return field.getText() || "";
      if (typeof field.getSelected === "function") return (field.getSelected() || []).join(", ");
      if (typeof field.isChecked === "function") return field.isChecked() ? "Ναι" : "Όχι";
    } catch (_) {}
    return "";
  }

  async function extractSupplementPdf(file) {
    const buffer = await file.arrayBuffer();
    const formValues = {};
    try {
      const { PDFDocument } = await ensurePdfLib();
      const doc = await PDFDocument.load(buffer.slice(0), { ignoreEncryption: true });
      doc.getForm().getFields().forEach(field => {
        const value = readPdfFieldCurrentValue(field);
        if (value !== "") formValues[normalizeText(field.getName())] = String(value);
      });
    } catch (_) {}
    let text = "";
    try {
      const pdfjs = await ensurePdfJs();
      const pdf = await pdfjs.getDocument({ data: new Uint8Array(buffer.slice(0)) }).promise;
      const pages = [];
      for (let pageNo = 1; pageNo <= pdf.numPages; pageNo += 1) {
        const page = await pdf.getPage(pageNo);
        const content = await page.getTextContent();
        let line = "";
        const lines = [];
        for (const item of content.items || []) {
          const str = String(item.str || "").trim();
          if (str) line += (line ? " " : "") + str;
          if (item.hasEOL) { if (line.trim()) lines.push(line.trim()); line = ""; }
        }
        if (line.trim()) lines.push(line.trim());
        pages.push(lines.join("\n"));
      }
      text = pages.join("\n");
    } catch (error) { console.warn("Δεν εξήχθη κείμενο από συμπληρωματικό PDF", error); }
    return { text, formValues };
  }

  function extractValueAfterLabel(text, field, formValues) {
    const target = normalizeText(field.matchLabel || field.label || "");
    if (!target) return "";
    const formMatch = Object.entries(formValues || {}).find(([name]) => name === target || name.includes(target) || target.includes(name));
    if (formMatch?.[1]) return String(formMatch[1]).trim();
    const lines = String(text || "").split(/\n+/).map(line => line.trim()).filter(Boolean);
    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];
      const normalized = normalizeText(line);
      if (!normalized.includes(target)) continue;
      const separator = line.match(/[:：=]\s*(.+)$/);
      if (separator?.[1]?.trim()) return separator[1].trim().slice(0, 180);
      const dash = line.match(/[-–—]\s*(.+)$/);
      if (dash?.[1]?.trim() && normalizeText(dash[1]) !== target) return dash[1].trim().slice(0, 180);
      if (normalized === target && lines[i + 1]) return lines[i + 1].trim().slice(0, 180);
      const words = line.split(/\s+/);
      const labelWords = String(field.matchLabel || field.label || "").trim().split(/\s+/).filter(Boolean).length;
      if (words.length > labelWords) {
        const tail = words.slice(labelWords).join(" ").replace(/^[:：=\-–—]+\s*/, "").trim();
        if (tail) return tail.slice(0, 180);
      }
    }
    return "";
  }

  async function handleSupplementFile(file) {
    const template = templates.find(item => item.id === selectedTemplateId);
    if (!template) { setStatus("Επίλεξε πρώτα έντυπο.", "warning"); return; }
    const fields = Array.isArray(template.supplementFields) ? template.supplementFields : [];
    if (!fields.length) { setStatus("Στο πρότυπο δεν έχουν οριστεί ακόμη πεδία από συμπληρωματικό έγγραφο. Άνοιξε «Πεδία» και πρόσθεσέ τα.", "warning"); return; }
    setStatus("Ανάγνωση συμπληρωματικού εγγράφου…");
    try {
      const extracted = await extractSupplementPdf(file);
      supplementalFileName = file.name || "Συμπληρωματικό PDF";
      supplementalText = extracted.text || "";
      supplementalFormValues = extracted.formValues || {};
      supplementalValues = {};
      fields.forEach(field => { supplementalValues[field.id] = extractValueAfterLabel(supplementalText, field, supplementalFormValues); });
      renderSupplementSection();
      const found = Object.values(supplementalValues).filter(Boolean).length;
      setStatus(`Το συμπληρωματικό PDF φορτώθηκε. Βρέθηκαν αυτόματα ${found} από ${fields.length} ζητούμενες τιμές. Μπορείς να διορθώσεις τα πεδία πριν τη συμπλήρωση.`, found ? "success" : "warning");
    } catch (error) {
      console.error(error);
      setStatus(`Δεν διαβάστηκε το συμπληρωματικό PDF: ${error?.message || "άγνωστο σφάλμα"}`, "error");
    }
  }

  function optionMarkup(selectedValue = "") {
    let html = "";
    let currentGroup = null;
    for (const [value,label,group] of sourceDefinitions) {
      if (!group) {
        if (currentGroup) { html += "</optgroup>"; currentGroup = null; }
        html += `<option value="${esc(value)}" ${value === selectedValue ? "selected" : ""}>${esc(label)}</option>`;
        continue;
      }
      if (group !== currentGroup) {
        if (currentGroup) html += "</optgroup>";
        html += `<optgroup label="${esc(group)}">`;
        currentGroup = group;
      }
      html += `<option value="${esc(value)}" ${value === selectedValue ? "selected" : ""}>${esc(label)}</option>`;
    }
    if (currentGroup) html += "</optgroup>";
    const supplements = activeSupplementFields();
    if (supplements.length) {
      html += `<optgroup label="Συμπληρωματικό έγγραφο">`;
      supplements.forEach(field => {
        const value = `supplement.${field.id}`;
        html += `<option value="${esc(value)}" ${value === selectedValue ? "selected" : ""}>${esc(field.label || "Πεδίο")}</option>`;
      });
      html += `</optgroup>`;
    }
    return html;
  }

  function renderSupplementDefsPanel() {
    const host = $("formsSupplementDefsList");
    if (!host) return;
    host.innerHTML = supplementDraft.length ? supplementDraft.map(field => `<div class="forms-supplement-def-row" data-supp-def="${esc(field.id)}"><input data-supp-label="${esc(field.id)}" value="${esc(field.label || "")}" placeholder="Όνομα πεδίου" /><input data-supp-match="${esc(field.id)}" value="${esc(field.matchLabel || field.label || "")}" placeholder="Ετικέτα που θα ψάχνουμε στο PDF" /><button class="forms-danger" type="button" data-remove-supp-def="${esc(field.id)}">×</button></div>`).join("") : `<div class="forms-supplement-def-empty">Δεν έχουν οριστεί πεδία από δεύτερο έγγραφο.</div>`;
  }

  function refreshMappingSourceOptions() {
    document.querySelectorAll('#formsMapModal select[data-field-name], #formsMapModal select[data-visual-source-id], #formsVisualSource').forEach(select => {
      const value = select.value;
      select.innerHTML = optionMarkup(value);
      if ([...select.options].some(option => option.value === value)) select.value = value;
    });
    renderVisualMarkers();
  }

  function addSupplementFieldDefinition() {
    const label = String(window.prompt("Όνομα πεδίου που θέλεις να πάρεις από το συμπληρωματικό έγγραφο:", "") || "").trim();
    if (!label) return;
    const matchLabel = String(window.prompt("Ποια λέξη/φράση να ψάχνουμε μέσα στο έγγραφο;", label) || label).trim();
    supplementDraft.push({ id: uid(), label, matchLabel: matchLabel || label });
    renderSupplementDefsPanel();
    refreshMappingSourceOptions();
  }

  function openMapping(templateId = selectedTemplateId) {
    const template = templates.find(item => item.id === templateId);
    if (!template) { setStatus("Επίλεξε πρώτα ένα έντυπο.", "warning"); return; }
    currentMapTemplate = template;
    supplementDraft = Array.isArray(template.supplementFields) ? template.supplementFields.map(item => ({ ...item })) : [];
    renderSupplementDefsPanel();
    $("formsMapSubtitle").textContent = template.name || template.originalName || "Έντυπο";
    const fields = template.fields || [];
    const mapWindow = $("formsMapModal")?.querySelector(".forms-map-window");
    // V9.11.23: always open the full visual PDF editor. Some PDFs contain AcroForm
    // fields; previously those documents showed only a small field list and hid the PDF.
    // We now keep AcroForm mapping as an optional section below the full-page editor.
    mapWindow?.classList.add("visual-mode");
    $("formsMapModal").classList.remove("hidden");
    $("formsMapSaveBtn").disabled = true;
    $("formsMapList").innerHTML = `<div class="forms-empty forms-visual-loading"><strong>Άνοιγμα PDF…</strong><br><small>Φορτώνεται ολόκληρο το έντυπο για οπτική τοποθέτηση πεδίων.</small></div>`;
    requestAnimationFrame(() => {
      openVisualMapping(template, fields).catch(error => {
        console.error(error);
        $("formsMapList").innerHTML = `<div class="forms-empty"><strong>Δεν άνοιξε το PDF.</strong><br>${esc(error?.message || "άγνωστο σφάλμα")}<br><small>Κλείσε το παράθυρο και πάτησε ξανά «Πεδία».</small></div>`;
        $("formsMapSaveBtn").disabled = true;
      });
    });
  }

  async function openVisualMapping(template, acroFields = []) {
    visualDraft = (template.visualFields || []).map(item => ({ ...item }));
    visualPageIndex = visualDraft[0]?.pageIndex || 0;
    $("formsMapSaveBtn").disabled = false;
    $("formsMapList").innerHTML = `
      <div class="forms-visual-toolbar">
        <div class="forms-field forms-visual-source"><label for="formsVisualSource">Πηγή δεδομένων που θα τοποθετήσεις</label><select id="formsVisualSource">${visualOptionMarkup("")}</select></div>
        <div class="forms-field forms-visual-size"><label for="formsVisualFontSize">Μέγεθος νέου πεδίου</label><select id="formsVisualFontSize"><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10" selected>10</option><option value="11">11</option><option value="12">12</option><option value="14">14</option><option value="16">16</option><option value="18">18</option></select></div>
        <div class="forms-visual-pages"><button class="forms-secondary" id="formsVisualPrev" type="button">‹</button><span id="formsVisualPageLabel">Σελίδα</span><button class="forms-secondary" id="formsVisualNext" type="button">›</button></div>
      </div>
      <div class="forms-visual-help" id="formsVisualHelp">Διάλεξε πηγή δεδομένων και πάτησε στο σημείο του εντύπου. Μετά μπορείς να <strong>σύρεις την τιμή</strong> για ακριβή θέση, να αλλάξεις το μέγεθός της ή να τη μετακινήσεις 1 βήμα με τα βελάκια.</div>
      <div class="forms-visual-canvas-shell"><div class="forms-visual-canvas-wrap" id="formsVisualCanvasWrap"><canvas id="formsVisualCanvas"></canvas><div class="forms-visual-markers" id="formsVisualMarkers"></div></div></div>
      <div class="forms-visual-list-wrap"><h4>Τοποθετημένα πεδία</h4><div class="forms-visual-list" id="formsVisualList"></div></div>
      ${acroFields.length ? `<details class="forms-acro-details"><summary>Διαδραστικά πεδία PDF (${acroFields.length}) — προαιρετικά</summary><div class="forms-acro-help">Αν θέλεις, μπορείς να αντιστοιχίσεις και τα υπάρχοντα διαδραστικά πεδία του PDF. Για ακριβή θέση πάνω στο έντυπο χρησιμοποίησε την οπτική τοποθέτηση παραπάνω.</div><div class="forms-acro-list">${acroFields.map((field,index) => `<div class="forms-map-row"><div class="forms-map-name"><strong title="${esc(field.name)}">${esc(field.name)}</strong><small>${esc(field.type)}</small></div><select data-map-index="${index}" data-field-name="${esc(field.name)}">${optionMarkup((template.mapping || {})[field.name] || "")}</select></div>`).join("")}</div></details>` : ""}`;

    const pdfjs = await ensurePdfJs();
    const sourceBuffer = await templatePdfArrayBuffer(template);
    try {
      visualPdfDoc = await pdfjs.getDocument({ data: new Uint8Array(sourceBuffer.slice(0)) }).promise;
    } catch (firstError) {
      // Εφεδρική λειτουργία για iOS/WebKit: φόρτωση του worker και στο main thread,
      // ώστε το PDF.js να μπορεί να χρησιμοποιήσει fake-worker αν το Worker μπλοκάρεται.
      console.warn("PDF.js normal worker failed; trying main-thread fallback", firstError);
      try {
        await loadExternalScript(PDF_JS_WORKER, 12000);
        visualPdfDoc = await pdfjs.getDocument({ data: new Uint8Array(sourceBuffer.slice(0)) }).promise;
      } catch (fallbackError) {
        throw new Error(`Η προεπισκόπηση PDF δεν φόρτωσε (${fallbackError?.message || firstError?.message || "σφάλμα PDF.js"}).`);
      }
    }
    $("formsVisualPrev")?.addEventListener("click", () => changeVisualPage(-1));
    $("formsVisualNext")?.addEventListener("click", () => changeVisualPage(1));
    $("formsVisualCanvas")?.addEventListener("click", addVisualFieldFromClick);
    $("formsVisualList")?.addEventListener("change", event => {
      const sourceSelect = event.target.closest("select[data-visual-source-id]");
      if (sourceSelect) {
        const item = visualDraft.find(field => field.id === sourceSelect.dataset.visualSourceId);
        if (item) item.sourceKey = sourceSelect.value;
        renderVisualMarkers();
        return;
      }
      const fontSelect = event.target.closest("select[data-visual-font-id]");
      if (fontSelect) {
        const item = visualDraft.find(field => field.id === fontSelect.dataset.visualFontId);
        if (item) item.fontSize = Number(fontSelect.value || 10);
        renderVisualMarkers();
      }
    });
    $("formsVisualList")?.addEventListener("click", event => {
      const nudge = event.target.closest("[data-nudge-id]");
      if (nudge) {
        const item = visualDraft.find(field => field.id === nudge.dataset.nudgeId);
        const canvas = $("formsVisualCanvas");
        if (item && canvas) {
          const width = parseFloat(canvas.style.width) || canvas.clientWidth || 1;
          const height = parseFloat(canvas.style.height) || canvas.clientHeight || 1;
          const dx = Number(nudge.dataset.dx || 0) / width;
          const dy = Number(nudge.dataset.dy || 0) / height;
          item.xRatio = Math.max(0, Math.min(1, Number(item.xRatio || 0) + dx));
          item.yRatio = Math.max(0, Math.min(1, Number(item.yRatio || 0) + dy));
          renderVisualMarkers();
        }
        return;
      }
      const remove = event.target.closest("[data-remove-visual]");
      if (!remove) return;
      visualDraft = visualDraft.filter(field => field.id !== remove.dataset.removeVisual);
      renderVisualMarkers();
      renderVisualFieldList();
    });
    $("formsVisualMarkers")?.addEventListener("pointerdown", beginVisualDrag);
    await renderVisualPage();
    renderVisualFieldList();
  }

  async function changeVisualPage(delta) {
    if (!visualPdfDoc) return;
    const next = Math.max(0, Math.min(visualPdfDoc.numPages - 1, visualPageIndex + delta));
    if (next === visualPageIndex) return;
    visualPageIndex = next;
    await renderVisualPage();
  }

  async function renderVisualPage() {
    if (!visualPdfDoc) return;
    const seq = ++visualRenderSeq;
    const canvas = $("formsVisualCanvas");
    const wrap = $("formsVisualCanvasWrap");
    if (!canvas || !wrap) return;
    const page = await visualPdfDoc.getPage(visualPageIndex + 1);
    const base = page.getViewport({ scale: 1 });
    const available = Math.max(280, Math.min(900, (wrap.parentElement?.clientWidth || 760) - 20));
    const cssScale = available / base.width;
    visualPageCssScale = cssScale;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const viewport = page.getViewport({ scale: cssScale * dpr });
    const cssWidth = viewport.width / dpr;
    const cssHeight = viewport.height / dpr;
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;
    wrap.style.width = `${cssWidth}px`;
    wrap.style.height = `${cssHeight}px`;
    const ctx = canvas.getContext("2d", { alpha: false });
    await page.render({ canvasContext: ctx, viewport }).promise;
    if (seq !== visualRenderSeq) return;
    $("formsVisualPageLabel").textContent = `Σελίδα ${visualPageIndex + 1} / ${visualPdfDoc.numPages}`;
    $("formsVisualPrev").disabled = visualPageIndex <= 0;
    $("formsVisualNext").disabled = visualPageIndex >= visualPdfDoc.numPages - 1;
    renderVisualMarkers();
  }

  function addVisualFieldFromClick(event) {
    const sourceKey = $("formsVisualSource")?.value || "";
    if (!sourceKey) {
      const help = $("formsVisualHelp");
      if (help) { help.textContent = "Πρώτα διάλεξε ποια πηγή δεδομένων θέλεις να τοποθετήσεις."; help.classList.add("warning"); }
      return;
    }
    const canvas = $("formsVisualCanvas");
    const rect = canvas.getBoundingClientRect();
    const xRatio = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    const yRatio = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
    const fontSize = Number($("formsVisualFontSize")?.value || 10);
    visualDraft.push({ id: uid(), pageIndex: visualPageIndex, xRatio, yRatio, sourceKey, fontSize });
    const help = $("formsVisualHelp");
    if (help) { help.textContent = `Τοποθετήθηκε: ${sourceLabel(sourceKey)}. Μπορείς να συνεχίσεις με άλλο πεδίο.`; help.classList.remove("warning"); }
    renderVisualMarkers();
    renderVisualFieldList();
  }

  function visualPreviewText(sourceKey) {
    try {
      const value = sourceValue(sourceKey, buildContext());
      if (value !== "" && value !== null && value !== undefined) return String(value);
    } catch (_) {}
    const samples = {
      "person.afm": "123456789",
      "insured.afm": "123456789",
      "person.adt": "ΑΒ123456",
      "contract.number": "12345678",
      "policy.number": "12345678",
      "auto.policyNumber": "12345678",
      "auto.registrationNumber": "ΙΚΧ1234",
      "person.streetNumber": "12",
      "person.postalCode": "18531",
      "person.phone": "6900000000",
      "insured.phone": "6900000000",
      "date.today": formatTodayGR()
    };
    return samples[sourceKey] || sourceLabel(sourceKey) || "Κείμενο";
  }

  function beginVisualDrag(event) {
    const marker = event.target.closest(".forms-visual-marker[data-visual-id]");
    if (!marker) return;
    event.preventDefault();
    event.stopPropagation();
    const id = marker.dataset.visualId;
    const item = visualDraft.find(field => field.id === id);
    const canvas = $("formsVisualCanvas");
    if (!item || !canvas) return;
    visualDragState = { id, marker };
    marker.classList.add("dragging");
    try { marker.setPointerCapture(event.pointerId); } catch (_) {}
    updateVisualDragPosition(event);
    marker.addEventListener("pointermove", updateVisualDragPosition);
    marker.addEventListener("pointerup", endVisualDrag, { once: true });
    marker.addEventListener("pointercancel", endVisualDrag, { once: true });
  }

  function updateVisualDragPosition(event) {
    if (!visualDragState) return;
    const item = visualDraft.find(field => field.id === visualDragState.id);
    const canvas = $("formsVisualCanvas");
    if (!item || !canvas) return;
    const rect = canvas.getBoundingClientRect();
    item.xRatio = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    item.yRatio = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
    const marker = visualDragState.marker;
    marker.style.left = `${item.xRatio * rect.width}px`;
    marker.style.top = `${item.yRatio * rect.height}px`;
  }

  function endVisualDrag(event) {
    const marker = visualDragState?.marker;
    if (marker) {
      marker.classList.remove("dragging");
      marker.removeEventListener("pointermove", updateVisualDragPosition);
    }
    visualDragState = null;
    renderVisualMarkers();
  }

  function fontOptions(selected = 10) {
    return [6,7,8,9,10,11,12,14,16,18].map(size => `<option value="${size}"${Number(selected) === size ? " selected" : ""}>${size} pt</option>`).join("");
  }

  function renderVisualMarkers() {
    const host = $("formsVisualMarkers");
    const canvas = $("formsVisualCanvas");
    if (!host || !canvas) return;
    const width = parseFloat(canvas.style.width) || canvas.clientWidth || 1;
    const height = parseFloat(canvas.style.height) || canvas.clientHeight || 1;
    const current = visualDraft.filter(item => Number(item.pageIndex || 0) === visualPageIndex);
    host.innerHTML = current.map((item, index) => {
      const sizePx = Math.max(4.5, Number(item.fontSize || 10) * visualPageCssScale);
      return `<div class="forms-visual-marker" data-visual-id="${esc(item.id)}" style="left:${item.xRatio * width}px;top:${item.yRatio * height}px;font-size:${sizePx}px" title="Σύρε για ακριβή θέση · ${esc(sourceLabel(item.sourceKey))}"><span>${index + 1}</span><b>${esc(visualPreviewText(item.sourceKey))}</b></div>`;
    }).join("");
  }

  function renderVisualFieldList() {
    const host = $("formsVisualList");
    if (!host) return;
    if (!visualDraft.length) {
      host.innerHTML = `<div class="forms-empty">Δεν έχεις τοποθετήσει ακόμη πεδίο. Διάλεξε πηγή δεδομένων και πάτησε πάνω στο PDF.</div>`;
      return;
    }
    host.innerHTML = visualDraft.map((item,index) => `<div class="forms-visual-list-row"><div class="forms-visual-index">${index + 1}</div><div class="forms-visual-list-main"><small>Σελίδα ${Number(item.pageIndex || 0) + 1}</small><select data-visual-source-id="${esc(item.id)}">${visualOptionMarkup(item.sourceKey || "")}</select><div class="forms-visual-adjust"><label>Μέγεθος <select data-visual-font-id="${esc(item.id)}">${fontOptions(Number(item.fontSize || 10))}</select></label><div class="forms-visual-nudges" aria-label="Μικρομετακίνηση"><button type="button" data-nudge-id="${esc(item.id)}" data-dx="-1" data-dy="0" title="Αριστερά">←</button><button type="button" data-nudge-id="${esc(item.id)}" data-dx="1" data-dy="0" title="Δεξιά">→</button><button type="button" data-nudge-id="${esc(item.id)}" data-dx="0" data-dy="-1" title="Πάνω">↑</button><button type="button" data-nudge-id="${esc(item.id)}" data-dx="0" data-dy="1" title="Κάτω">↓</button></div></div></div><button class="forms-danger forms-visual-remove" type="button" data-remove-visual="${esc(item.id)}">×</button></div>`).join("");
  }

  function closeMapping() {
    currentMapTemplate = null;
    visualPdfDoc = null;
    visualDraft = [];
    supplementDraft = [];
    visualDragState = null;
    $("formsMapModal")?.classList.add("hidden");
  }

  async function saveMapping() {
    if (!currentMapTemplate) return;
    try {
      const mapping = {};
      $("formsMapList").querySelectorAll("select[data-field-name]").forEach(select => {
        mapping[select.dataset.fieldName] = select.value;
      });
      const hasAcroMapping = Object.values(mapping).some(Boolean);
      if (!visualDraft.length && !hasAcroMapping) {
        const help = $("formsVisualHelp");
        if (help) { help.textContent = "Τοποθέτησε τουλάχιστον ένα πεδίο πάνω στο PDF ή αντιστοίχισε ένα διαδραστικό πεδίο πριν την αποθήκευση."; help.classList.add("warning"); }
        return;
      }
      const updated = {
        ...currentMapTemplate,
        mapping,
        visualFields: visualDraft.map(item => ({ ...item })),
        supplementFields: supplementDraft.map(item => ({ ...item })),
        updatedAt: new Date().toISOString(),
        version: 2
      };
      await dbPut(updated);
      await persistMappingProfile(updated);
      await refreshTemplates();
      rememberSelectedTemplate(updated.id);
      renderTemplates();
      closeMapping();
      setStatus("Η αντιστοίχιση πεδίων αποθηκεύτηκε.", "success");
    } catch (error) {
      console.error(error);
      setStatus("Δεν αποθηκεύτηκε η αντιστοίχιση.", "error");
    }
  }

  async function textPngData(text, fontSize = 10) {
    const value = String(text ?? "");
    const scale = 4;
    const family = `-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif`;
    const measure = document.createElement("canvas").getContext("2d");
    measure.font = `${fontSize}px ${family}`;
    const metrics = measure.measureText(value);
    const left = Math.ceil(Math.max(0, metrics.actualBoundingBoxLeft || 0));
    const right = Math.ceil(Math.max(2, metrics.actualBoundingBoxRight || metrics.width || 2));
    const ascent = Math.ceil(Math.max(fontSize * 0.7, metrics.actualBoundingBoxAscent || fontSize));
    const descent = Math.ceil(Math.max(1, metrics.actualBoundingBoxDescent || fontSize * 0.2));
    const logicalWidth = Math.max(3, left + right + 2);
    const logicalHeight = Math.max(3, ascent + descent + 2);
    const canvas = document.createElement("canvas");
    canvas.width = logicalWidth * scale;
    canvas.height = logicalHeight * scale;
    const ctx = canvas.getContext("2d");
    ctx.scale(scale, scale);
    ctx.clearRect(0, 0, logicalWidth, logicalHeight);
    ctx.fillStyle = "#000";
    ctx.font = `${fontSize}px ${family}`;
    ctx.textBaseline = "alphabetic";
    ctx.fillText(value, 1 + left, 1 + ascent);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/png"));
    if (!blob) throw new Error("Δεν δημιουργήθηκε η εικόνα κειμένου.");
    return { bytes: new Uint8Array(await blob.arrayBuffer()), width: logicalWidth, height: logicalHeight };
  }

  async function drawVisualFields(doc, visualFields, context) {
    let filled = 0;
    let nonEmpty = 0;
    let vehicleMapped = 0;
    let vehicleFilled = 0;
    for (const item of visualFields || []) {
      const isVehicle = String(item?.sourceKey || "").startsWith("vehicleReg.");
      if (isVehicle) vehicleMapped += 1;
      const value = sourceValue(item.sourceKey, context);
      if (value === "" || value === null || value === undefined) continue;
      nonEmpty += 1;
      if (isVehicle) vehicleFilled += 1;
      const pageIndex = Math.max(0, Math.min(doc.getPageCount() - 1, Number(item.pageIndex || 0)));
      const page = doc.getPage(pageIndex);

      // PDF.js (the visual mapper) renders the visible CropBox, while pdf-lib's
      // getSize() is based on the full page box.  If a form has cropped margins,
      // using the full page here makes the final text drift vertically/horizontally
      // from the exact position the user chose in the preview.  Anchor the output
      // to the same visible CropBox so preview and generated PDF share coordinates.
      const pageSize = page.getSize();
      let visibleBox = { x: 0, y: 0, width: pageSize.width, height: pageSize.height };
      try {
        const crop = page.getCropBox?.();
        if (crop && Number(crop.width) > 0 && Number(crop.height) > 0) {
          visibleBox = {
            x: Number(crop.x || 0),
            y: Number(crop.y || 0),
            width: Number(crop.width),
            height: Number(crop.height)
          };
        }
      } catch (_) {}

      const fieldFontSize = Number(item.fontSize || 10);
      const pngData = await textPngData(value, fieldFontSize);
      const image = await doc.embedPng(pngData.bytes);
      let drawWidth = pngData.width;
      let drawHeight = pngData.height;

      const xRatio = Math.max(0, Math.min(1, Number(item.xRatio || 0)));
      const yRatio = Math.max(0, Math.min(1, Number(item.yRatio || 0)));
      const x = visibleBox.x + xRatio * visibleBox.width;
      const maxWidth = Math.max(8, (visibleBox.x + visibleBox.width) - x - 2);
      if (drawWidth > maxWidth) {
        const ratio = maxWidth / drawWidth;
        drawWidth *= ratio;
        drawHeight *= ratio;
      }

      const yTopFromVisible = yRatio * visibleBox.height;

      // The browser preview positions the text by its CSS line box, while the PNG
      // embedded in the final PDF is tightly cropped to the glyph ink. Without a
      // small compensation the final text appears a little higher than what the
      // user placed in the visual mapper. Move the final glyph down proportionally
      // to its font size so the visible baseline matches the preview much more
      // closely across small and large fields.
      const baselineCompensation = Math.max(0.8, fieldFontSize * 0.16);
      const y = Math.max(
        visibleBox.y,
        (visibleBox.y + visibleBox.height) - yTopFromVisible - drawHeight - baselineCompensation
      );
      page.drawImage(image, { x, y, width: drawWidth, height: drawHeight });
      filled += 1;
    }
    return { filled, nonEmpty, vehicleMapped, vehicleFilled };
  }

  function setPdfFieldValue(field, type, value) {
    const text = value === null || value === undefined ? "" : String(value);
    if (type.includes("TextField")) {
      field.setText(text);
      return true;
    }
    if (type.includes("CheckBox")) {
      const truthy = value === true || ["1","true","yes","ναι","x"].includes(normalizeText(text));
      truthy ? field.check() : field.uncheck();
      return true;
    }
    if (type.includes("Dropdown") || type.includes("OptionList") || type.includes("RadioGroup")) {
      if (!text) return false;
      try { field.select(text); return true; } catch (_) { return false; }
    }
    return false;
  }

  function syncRuntimeSourceInputs() {
    // Safari/iOS can update text inputs (autofill, programmatic OCR rendering,
    // dictation) without firing the exact input event path we rely on. Read the
    // visible fields again immediately before generating the PDF so the final
    // document always uses what the user actually sees on screen.
    document.querySelectorAll("[data-vehicle-reg-runtime]").forEach(input => {
      const key = input.dataset.vehicleRegRuntime;
      if (key) vehicleRegValues[key] = input.value ?? "";
    });
    document.querySelectorAll("[data-supp-runtime]").forEach(input => {
      const key = input.dataset.suppRuntime;
      if (key) supplementalValues[key] = input.value ?? "";
    });
  }

  async function fillSelectedTemplate() {
    const template = templates.find(item => item.id === selectedTemplateId);
    const customer = currentCustomer();
    if (!template) { setStatus("Επίλεξε πρώτα έντυπο από τη βιβλιοθήκη.", "warning"); return; }
    if (!customer) { setStatus("Επίλεξε πρώτα πελάτη από το CRM.", "warning"); return; }
    syncRuntimeSourceInputs();

    const vehicleAvailable = vehicleRegAvailableKeys();
    const vehicleMapped = vehicleRegMappings(template);
    if (vehicleAvailable.length && !vehicleMapped.length) {
      refreshVehicleRegMappingStatus();
      setStatus(`Η άδεια έχει ${vehicleAvailable.length} διαθέσιμα στοιχεία, αλλά το συγκεκριμένο πρότυπο δεν έχει κανένα πεδίο «Άδεια Κυκλοφορίας» τοποθετημένο. Πάτησε «Τοποθέτηση πεδίων άδειας στο έντυπο» και κάν' το μία φορά.`, "warning");
      return;
    }

    const mapped = Object.entries(template.mapping || {}).filter(([,value]) => value);
    const visualFields = Array.isArray(template.visualFields) ? template.visualFields.filter(item => item.sourceKey) : [];
    if (!mapped.length && !visualFields.length) { setStatus("Ρύθμισε πρώτα την αντιστοίχιση πεδίων του εντύπου.", "warning"); openMapping(template.id); return; }

    setStatus("Συμπλήρωση του PDF…");
    if ($("formsFillBtn")) $("formsFillBtn").disabled = true;
    if ($("formsQuickFillBtn")) $("formsQuickFillBtn").disabled = true;
    try {
      const { PDFDocument } = await ensurePdfLib();
      const bytes = await templatePdfArrayBuffer(template);
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const context = buildContext();
      let filledCount = 0;
      let nonEmptyCount = 0;
      let vehicleMappedCount = 0;
      let vehicleFilledCount = 0;

      if ((template.fields || []).length && mapped.length) {
        const form = doc.getForm();
        const fields = form.getFields();
        const byName = new Map(fields.map(field => [field.getName(), field]));
        for (const [fieldName, sourceKey] of mapped) {
          const field = byName.get(fieldName);
          if (!field) continue;
          const isVehicle = String(sourceKey || "").startsWith("vehicleReg.");
          if (isVehicle) vehicleMappedCount += 1;
          const value = sourceValue(sourceKey, context);
          if (value !== "" && value !== null && value !== undefined) {
            nonEmptyCount += 1;
            if (isVehicle) vehicleFilledCount += 1;
          }
          try {
            if (setPdfFieldValue(field, fieldType(field), value)) filledCount += 1;
          } catch (error) {
            console.warn("Field fill failed", fieldName, error);
          }
        }
      }

      if (visualFields.length) {
        const result = await drawVisualFields(doc, visualFields, context);
        filledCount += result.filled;
        nonEmptyCount += result.nonEmpty;
        vehicleMappedCount += result.vehicleMapped || 0;
        vehicleFilledCount += result.vehicleFilled || 0;
      }

      let outBytes;
      try {
        outBytes = await doc.save();
      } catch (appearanceError) {
        console.warn("PDF appearance update failed; saving without appearance refresh", appearanceError);
        outBytes = await doc.save({ updateFieldAppearances: false });
      }
      generatedBlob = new Blob([outBytes], { type: "application/pdf" });
      if (generatedObjectURL) URL.revokeObjectURL(generatedObjectURL);
      generatedObjectURL = URL.createObjectURL(generatedBlob);
      $("formsPreviewFrame").src = generatedObjectURL;
      $("formsPreview").classList.add("show");
      $("formsGeneratedActions").style.display = "flex";
      const vehicleNote = vehicleMappedCount ? ` · Άδεια κυκλοφορίας: ${vehicleFilledCount}/${vehicleMappedCount} πεδία με τιμή` : "";
      setStatus(`Το νέο PDF δημιουργήθηκε. Συμπληρώθηκαν ${filledCount} πεδία (${nonEmptyCount} με διαθέσιμη τιμή από τις πηγές δεδομένων)${vehicleNote}.`, "success");
    } catch (error) {
      console.error(error);
      setStatus(`Δεν ολοκληρώθηκε η συμπλήρωση: ${error?.message || "άγνωστο σφάλμα"}`, "error");
    } finally {
      if ($("formsFillBtn")) $("formsFillBtn").disabled = false;
      if ($("formsQuickFillBtn")) $("formsQuickFillBtn").disabled = false;
    }
  }

  function openNameSheet() {
    if (!generatedBlob) return;
    const input = $("formsOutputName");
    input.value = "";
    $("formsNameError").textContent = "";
    $("formsNameModal").classList.remove("hidden");
    setTimeout(() => input.focus(), 120);
  }

  function closeNameSheet() {
    $("formsNameModal")?.classList.add("hidden");
  }

  function safeFileName(value) {
    return String(value || "")
      .trim()
      .replace(/[\\/:*?"<>|]+/g, "-")
      .replace(/\s+/g, " ")
      .replace(/\.+$/g, "")
      .trim();
  }

  async function exportGenerated() {
    const input = $("formsOutputName");
    const base = safeFileName(input.value);
    if (!base) {
      $("formsNameError").textContent = "Το όνομα αρχείου είναι υποχρεωτικό.";
      input.focus();
      return;
    }
    const filename = /\.pdf$/i.test(base) ? base : `${base}.pdf`;
    const file = new File([generatedBlob], filename, { type: "application/pdf" });
    try {
      if (navigator.canShare?.({ files: [file] }) && navigator.share) {
        await navigator.share({ files: [file], title: filename });
      } else {
        const url = URL.createObjectURL(file);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 2000);
      }
      closeNameSheet();
      setStatus(`Το αρχείο «${filename}» είναι έτοιμο για αποθήκευση στα Αρχεία.`, "success");
    } catch (error) {
      if (error?.name === "AbortError") return;
      console.error(error);
      $("formsNameError").textContent = "Δεν ολοκληρώθηκε η αποθήκευση/κοινοποίηση.";
    }
  }

  async function deleteTemplate(id) {
    const template = templates.find(item => item.id === id);
    if (!template) return;
    const mappedCount = templateMappedCount(template);
    const message = mappedCount
      ? `Να διαγραφεί το PDF «${template.name || template.originalName}» από τη βιβλιοθήκη;\n\nΟι ${mappedCount} αντιστοιχίσεις του θα παραμείνουν αποθηκευμένες και θα επανέλθουν αν ξαναφορτώσεις το ίδιο PDF.`
      : `Να διαγραφεί το έντυπο «${template.name || template.originalName}» από τη βιβλιοθήκη;`;
    if (!window.confirm(message)) return;
    try {
      if (mappedCount) await persistMappingProfile(template);
      await dbDelete(id);
      if (selectedTemplateId === id) rememberSelectedTemplate(null);
      await refreshTemplates();
      setStatus(mappedCount ? "Το PDF διαγράφηκε. Η αντιστοίχισή του παραμένει αποθηκευμένη για μελλοντική επαναφορά." : "Το έντυπο διαγράφηκε από τη βιβλιοθήκη.", "success");
    } catch (error) {
      console.error(error);
      setStatus("Δεν διαγράφηκε το έντυπο.", "error");
    }
  }

  async function openLibrary() {
    $("formsLibraryModal").classList.remove("hidden");
    document.body.style.overflow = "hidden";
    renderPolicyOptions();
    renderPersonOptions();
    await refreshTemplates();
    renderSelectedTemplateSummary();
    renderVehicleRegistrationSection();
    renderSupplementSection();
    setStatus(selectedTemplateId && selectedCustomerId ? "Έτοιμο για αυτόματη συμπλήρωση." : "Επίλεξε έντυπο και πελάτη.");
  }

  function closeLibrary() {
    $("formsLibraryModal").classList.add("hidden");
    document.body.style.overflow = "";
    $("formsCustomerResults")?.classList.remove("open");
  }

  function bindEvents() {
    $("formsLibraryBtn")?.addEventListener("click", openLibrary);
    $("formsCloseBtn")?.addEventListener("click", closeLibrary);
    $("formsAddTemplateBtn")?.addEventListener("click", () => $("formsPdfInput")?.click());
    $("formsPdfInput")?.addEventListener("change", async event => {
      const file = event.target.files?.[0];
      if (file) await addTemplateFile(file);
      event.target.value = "";
    });
    $("formsReplacePdfInput")?.addEventListener("change", async event => {
      const file = event.target.files?.[0];
      const id = replaceTemplateId;
      if (file && id) await replaceTemplatePdf(id, file);
      event.target.value = "";
      replaceTemplateId = null;
    });
    $("formsTemplateSearch")?.addEventListener("input", event => { templateSearchQuery = event.target.value || ""; renderTemplates(); });
    $("formsCategoryFilter")?.addEventListener("change", event => { templateCategoryFilter = event.target.value || ""; renderTemplates(); });
    document.querySelectorAll("[data-template-view]").forEach(button => button.addEventListener("click", () => { templateViewMode = button.dataset.templateView || "all"; renderTemplates(); }));
    $("formsTemplateDetailsCancel")?.addEventListener("click", () => finishTemplateDetails(false));
    $("formsTemplateDetailsSave")?.addEventListener("click", () => finishTemplateDetails(true));
    $("formsTemplateName")?.addEventListener("keydown", event => { if (event.key === "Enter") finishTemplateDetails(true); });
    $("formsChooseTemplateBtn")?.addEventListener("click", openTemplatePicker);
    $("formsQuickAddTemplateBtn")?.addEventListener("click", () => $("formsPdfInput")?.click());
    $("formsPickerCloseBtn")?.addEventListener("click", closeTemplatePicker);
    $("formsPickerBackBtn")?.addEventListener("click", () => { pickerCategory = ""; pickerSearchQuery = ""; if ($("formsPickerSearch")) $("formsPickerSearch").value = ""; renderTemplatePicker(); });
    $("formsPickerSearch")?.addEventListener("input", event => { pickerSearchQuery = event.target.value || ""; if (pickerSearchQuery.trim()) pickerCategory = ""; renderTemplatePicker(); });
    $("formsPickerAddBtn")?.addEventListener("click", () => { closeTemplatePicker(); $("formsPdfInput")?.click(); });
    $("formsPickerContent")?.addEventListener("click", event => {
      const category = event.target.closest("[data-picker-category]");
      if (category) { pickerCategory = category.dataset.pickerCategory || ""; pickerSearchQuery = ""; if ($("formsPickerSearch")) $("formsPickerSearch").value = ""; renderTemplatePicker(); return; }
      const doc = event.target.closest("[data-picker-template]");
      if (doc) { useTemplate(doc.dataset.pickerTemplate); closeTemplatePicker(); }
    });
    $("formsAddSupplementFieldBtn")?.addEventListener("click", addSupplementFieldDefinition);
    $("formsSupplementDefsList")?.addEventListener("input", event => {
      const labelInput = event.target.closest("[data-supp-label]");
      const matchInput = event.target.closest("[data-supp-match]");
      const id = labelInput?.dataset.suppLabel || matchInput?.dataset.suppMatch;
      const field = supplementDraft.find(item => String(item.id) === String(id));
      if (!field) return;
      if (labelInput) field.label = labelInput.value;
      if (matchInput) field.matchLabel = matchInput.value;
    });
    $("formsSupplementDefsList")?.addEventListener("change", () => refreshMappingSourceOptions());
    $("formsSupplementDefsList")?.addEventListener("click", event => {
      const remove = event.target.closest("[data-remove-supp-def]");
      if (!remove) return;
      const id = remove.dataset.removeSuppDef;
      supplementDraft = supplementDraft.filter(item => String(item.id) !== String(id));
      visualDraft = visualDraft.filter(item => item.sourceKey !== `supplement.${id}`);
      renderSupplementDefsPanel();
      refreshMappingSourceOptions();
      renderVisualFieldList();
    });
    $("formsVehicleRegUploadBtn")?.addEventListener("click", () => $("formsVehicleRegInput")?.click());
    $("formsVehicleRegPhotoBtn")?.addEventListener("click", () => $("formsVehicleRegPhotoInput")?.click());
    $("formsVehicleRegCameraBtn")?.addEventListener("click", () => $("formsVehicleRegCameraInput")?.click());
    $("formsVehicleRegClearBtn")?.addEventListener("click", () => clearVehicleRegistration(true));
    $("formsVehicleRegMapBtn")?.addEventListener("click", openVehicleRegMapping);
    $("formsVehicleRegInput")?.addEventListener("change", async event => { const file = event.target.files?.[0]; if (file) await handleVehicleRegistrationFile(file); event.target.value = ""; });
    $("formsVehicleRegPhotoInput")?.addEventListener("change", async event => { const files = event.target.files; if (files?.length) await handleVehicleRegistrationImages(files, "Φωτογραφίες"); event.target.value = ""; });
    $("formsVehicleRegCameraInput")?.addEventListener("change", async event => { const file = event.target.files?.[0]; if (file) await handleVehicleRegistrationImages([file], "Κάμερα"); event.target.value = ""; });
    $("formsVehicleRegValues")?.addEventListener("input", event => { const input = event.target.closest("[data-vehicle-reg-runtime]"); if (input) vehicleRegValues[input.dataset.vehicleRegRuntime] = input.value; });
    $("formsSupplementUploadBtn")?.addEventListener("click", () => $("formsSupplementInput")?.click());
    $("formsSupplementClearBtn")?.addEventListener("click", () => clearSupplementDocument(true));
    $("formsSupplementInput")?.addEventListener("change", async event => { const file = event.target.files?.[0]; if (file) await handleSupplementFile(file); event.target.value = ""; });
    $("formsSupplementValues")?.addEventListener("input", event => { const input = event.target.closest("[data-supp-runtime]"); if (input) supplementalValues[input.dataset.suppRuntime] = input.value; });
    $("formsCustomerSearch")?.addEventListener("input", event => renderCustomerResults(event.target.value));
    $("formsCustomerResults")?.addEventListener("click", event => {
      const memberOption = event.target.closest("[data-member-customer-id]");
      if (memberOption) {
        selectCoveredMemberFromSearch(memberOption.dataset.memberCustomerId, memberOption.dataset.memberPolicyKey, memberOption.dataset.memberId);
        return;
      }
      const option = event.target.closest("[data-customer-id]");
      if (option) selectCustomer(option.dataset.customerId);
    });
    $("formsTemplateList")?.addEventListener("click", event => {
      const favoriteButton = event.target.closest("[data-favorite-template]");
      if (favoriteButton) { event.stopPropagation(); toggleTemplateFavorite(favoriteButton.dataset.favoriteTemplate).catch(console.error); return; }
      const editButton = event.target.closest("[data-edit-template]");
      if (editButton) { event.stopPropagation(); editTemplateDetails(editButton.dataset.editTemplate).catch(console.error); return; }
      const useButton = event.target.closest("[data-use-template]");
      if (useButton) { event.stopPropagation(); useTemplate(useButton.dataset.useTemplate); return; }
      const replaceButton = event.target.closest("[data-replace-template]");
      if (replaceButton) {
        event.stopPropagation();
        replaceTemplateId = replaceButton.dataset.replaceTemplate;
        $("formsReplacePdfInput")?.click();
        return;
      }
      const linkButton = event.target.closest("[data-link-template]");
      if (linkButton) { event.stopPropagation(); manualRelinkTemplate(linkButton.dataset.linkTemplate).catch(error => { console.error(error); setStatus("Δεν ολοκληρώθηκε η σύνδεση με έτοιμο πρότυπο.", "error"); }); return; }
      const deleteButton = event.target.closest("[data-delete-template]");
      if (deleteButton) { event.stopPropagation(); deleteTemplate(deleteButton.dataset.deleteTemplate); return; }
      const mapButton = event.target.closest("[data-map-template]");
      if (mapButton) { event.stopPropagation(); rememberSelectedTemplate(mapButton.dataset.mapTemplate); renderTemplates(); openMapping(selectedTemplateId); return; }
      const card = event.target.closest("[data-template-id]");
      if (card) useTemplate(card.dataset.templateId);
    });
    $("formsPolicySelect")?.addEventListener("change", event => {
      selectedPolicySource = event.target.value;
      selectedPersonId = "insured";
      renderPersonOptions();
    });
    $("formsPersonSelect")?.addEventListener("change", event => { selectedPersonId = event.target.value; });
    $("formsFillBtn")?.addEventListener("click", fillSelectedTemplate);
    $("formsQuickFillBtn")?.addEventListener("click", fillSelectedTemplate);
    $("formsOpenMapBtn")?.addEventListener("click", () => openMapping());
    $("formsMapCloseBtn")?.addEventListener("click", closeMapping);
    $("formsMapCancelBtn")?.addEventListener("click", closeMapping);
    $("formsMapSaveBtn")?.addEventListener("click", saveMapping);
    $("formsSaveGeneratedBtn")?.addEventListener("click", openNameSheet);
    $("formsNameCancelBtn")?.addEventListener("click", closeNameSheet);
    $("formsNameConfirmBtn")?.addEventListener("click", exportGenerated);
    $("formsOutputName")?.addEventListener("keydown", event => { if (event.key === "Enter") exportGenerated(); });
    $("formsLibraryModal")?.addEventListener("click", event => { if (event.target === $("formsLibraryModal")) closeLibrary(); });
  }

  async function init() {
    createUI();
    bindEvents();
    await refreshTemplates();
    window.TsertosFormsLibrary = {
      version: VERSION,
      open: openLibrary,
      refresh: refreshTemplates
    };
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
