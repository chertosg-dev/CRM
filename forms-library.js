(() => {
  "use strict";

  const VERSION = "1.1.0";
  const DB_NAME = "tsertos-form-library";
  const DB_VERSION = 1;
  const STORE = "templates";
  const PDF_LIB_PRIMARY = "https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js";
  const PDF_LIB_FALLBACK = "https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js";
  const PDF_JS_PRIMARY = "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js";
  const PDF_JS_FALLBACK = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
  const PDF_JS_WORKER = "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

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
    ["date.today", "Σημερινή ημερομηνία", "Ημερομηνίες"]
  ];

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
  let pdfJsWorkerObjectURL = null;
  let visualPdfDoc = null;
  let visualPageIndex = 0;
  let visualDraft = [];
  let visualRenderSeq = 0;

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

  function loadExternalScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Δεν φορτώθηκε ${src}`));
      document.head.appendChild(script);
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
    if (pdfJsWorkerObjectURL) {
      try { pdfjs.GlobalWorkerOptions.workerSrc = pdfJsWorkerObjectURL; } catch (_) {}
      return pdfjs;
    }
    try {
      const response = await fetch(PDF_JS_WORKER, { mode: "cors", cache: "force-cache" });
      if (!response.ok) throw new Error(`Worker HTTP ${response.status}`);
      const blob = await response.blob();
      pdfJsWorkerObjectURL = URL.createObjectURL(blob);
      pdfjs.GlobalWorkerOptions.workerSrc = pdfJsWorkerObjectURL;
    } catch (error) {
      console.warn("PDF.js worker fallback", error);
      try { pdfjs.GlobalWorkerOptions.workerSrc = PDF_JS_WORKER; } catch (_) {}
    }
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

  function sourceLabel(key) {
    return sourceDefinitions.find(item => item[0] === key)?.[1] || key || "Πεδίο";
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

  async function inspectPdf(blob) {
    const { PDFDocument } = await ensurePdfLib();
    const bytes = await blob.arrayBuffer();
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
    quickBackup?.parentElement?.insertBefore(button, quickBackup);

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
              <div class="forms-sidebar-head-row"><h3>Αποθηκευμένα έντυπα</h3><button class="forms-add-btn" id="formsAddTemplateBtn" type="button">＋ PDF</button></div>
              <input id="formsPdfInput" type="file" accept="application/pdf,.pdf" hidden />
            </div>
            <div class="forms-template-list" id="formsTemplateList"></div>
          </aside>
          <main class="forms-workspace">
            <section class="forms-section">
              <h3>1. Επιλογή πελάτη</h3>
              <div class="forms-field full">
                <label for="formsCustomerSearch">Αναζήτηση στο CRM</label>
                <input id="formsCustomerSearch" type="search" autocomplete="off" placeholder="Όνομα, επώνυμο, ΑΦΜ ή τηλέφωνο" />
                <div class="forms-customer-results" id="formsCustomerResults"></div>
                <div class="forms-selected-customer" id="formsSelectedCustomer"></div>
              </div>
            </section>
            <section class="forms-section">
              <h3>2. Συμβόλαιο και πρόσωπο</h3>
              <div class="forms-grid">
                <div class="forms-field"><label for="formsPolicySelect">Συμβόλαιο (Ζωής / Αυτοκινήτου)</label><select id="formsPolicySelect"><option value="">Χωρίς συγκεκριμένο συμβόλαιο</option></select></div>
                <div class="forms-field"><label for="formsPersonSelect">Πρόσωπο</label><select id="formsPersonSelect"><option value="insured">Κύριος ασφαλισμένος</option></select></div>
              </div>
            </section>
            <section class="forms-section">
              <h3>3. Αυτόματη συμπλήρωση</h3>
              <p class="forms-section-note">Επίλεξε έντυπο από τη βιβλιοθήκη. Η αντιστοίχιση πεδίων γίνεται μία φορά για κάθε έντυπο και αποθηκεύεται.</p>
              <div class="forms-actions-row">
                <button class="forms-primary" id="formsFillBtn" type="button">✨ Αυτόματη συμπλήρωση</button>
                <button class="forms-secondary" id="formsOpenMapBtn" type="button">⚙️ Αντιστοίχιση πεδίων</button>
              </div>
              <div class="forms-status" id="formsStatus">Επίλεξε ένα PDF και έναν πελάτη.</div>
              <div class="forms-preview" id="formsPreview"><iframe id="formsPreviewFrame" title="Προεπισκόπηση PDF"></iframe></div>
              <div class="forms-actions-row" id="formsGeneratedActions" style="display:none;margin-top:10px">
                <button class="forms-primary" id="formsSaveGeneratedBtn" type="button">💾 Αποθήκευση νέου PDF</button>
              </div>
            </section>
          </main>
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
      renderTemplates();
    } catch (error) {
      console.error(error);
      setStatus("Δεν ήταν δυνατή η φόρτωση της βιβλιοθήκης εντύπων.", "error");
    }
  }

  function renderTemplates() {
    const host = $("formsTemplateList");
    if (!host) return;
    if (!templates.length) {
      host.innerHTML = `<div class="forms-empty">Δεν έχεις ανεβάσει ακόμη έντυπο.<br>Πάτησε <b>＋ PDF</b> για να δημιουργήσεις τη βιβλιοθήκη σου.</div>`;
      return;
    }
    host.innerHTML = templates.map(template => {
      const fieldCount = Array.isArray(template.fields) ? template.fields.length : 0;
      const acroMapped = Object.values(template.mapping || {}).filter(Boolean).length;
      const visualCount = Array.isArray(template.visualFields) ? template.visualFields.length : 0;
      const mapped = acroMapped + visualCount;
      const ready = mapped > 0;
      const fieldLabel = fieldCount ? `${fieldCount} πεδία PDF` : `${visualCount} οπτικά πεδία`;
      return `<article class="forms-template-card ${template.id === selectedTemplateId ? "selected" : ""}" data-template-id="${esc(template.id)}">
        <div class="forms-template-name">${esc(template.name || template.originalName || "Έντυπο")}</div>
        <div class="forms-template-meta"><span class="forms-chip">${fieldLabel}</span><span class="forms-chip ${ready ? "ready" : "warning"}">${mapped} αντιστοιχισμένα</span></div>
        <div class="forms-template-actions"><button class="forms-map-btn" type="button" data-map-template="${esc(template.id)}">⚙️ Πεδία</button><button class="forms-delete-btn" type="button" data-delete-template="${esc(template.id)}">Διαγραφή</button></div>
      </article>`;
    }).join("");
  }

  async function addTemplateFile(file) {
    if (!file || !/pdf/i.test(file.type || file.name)) return;
    setStatus("Ανάλυση του PDF…");
    try {
      const fields = await inspectPdf(file);
      const mapping = {};
      fields.forEach(field => { mapping[field.name] = guessSource(field.name); });
      const name = file.name.replace(/\.pdf$/i, "") || "Νέο έντυπο";
      const template = {
        id: uid(),
        name,
        originalName: file.name,
        pdfBlob: file,
        fields,
        mapping,
        visualFields: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1
      };
      await dbPut(template);
      selectedTemplateId = template.id;
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

  function renderCustomerResults(query) {
    const host = $("formsCustomerResults");
    if (!host) return;
    const q = normalizeText(query);
    if (!q) { host.classList.remove("open"); host.innerHTML = ""; return; }
    const matches = customersArray().filter(customer => {
      const haystack = normalizeText([
        displayName(customer), customer.company, customer.afm, customer.phone, customer.email
      ].filter(Boolean).join(" "));
      return haystack.includes(q);
    }).slice(0, 30);
    const allCustomers = customersArray();
    host.innerHTML = matches.length ? matches.map(customer => `<button class="forms-customer-option" type="button" data-customer-id="${esc(customer.id)}"><strong>${esc(displayName(customer))}</strong><span>${[customer.afm && `ΑΦΜ ${customer.afm}`, customer.phone].filter(Boolean).map(esc).join(" · ")}</span></button>`).join("") : `<div class="forms-empty">${allCustomers.length ? "Δεν βρέθηκε πελάτης." : "Δεν είναι ακόμη διαθέσιμα τα στοιχεία πελατών του CRM. Κλείσε και ξανάνοιξε τα Έντυπα."}</div>`;
    host.classList.add("open");
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
    return { insured, person, regularPolicy, autoPolicy, coverage };
  }

  function sourceValue(key, context) {
    if (!key) return "";
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
      "date.today": new Date().toLocaleDateString("el-GR")
    };
    return values[key] ?? "";
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
    return html;
  }

  function openMapping(templateId = selectedTemplateId) {
    const template = templates.find(item => item.id === templateId);
    if (!template) { setStatus("Επίλεξε πρώτα ένα έντυπο.", "warning"); return; }
    currentMapTemplate = template;
    $("formsMapSubtitle").textContent = template.name || template.originalName || "Έντυπο";
    const fields = template.fields || [];
    const mapWindow = $("formsMapModal")?.querySelector(".forms-map-window");
    mapWindow?.classList.toggle("visual-mode", !fields.length);
    $("formsMapModal").classList.remove("hidden");

    if (!fields.length) {
      openVisualMapping(template).catch(error => {
        console.error(error);
        $("formsMapList").innerHTML = `<div class="forms-empty">Δεν μπόρεσε να ανοίξει η οπτική αντιστοίχιση: ${esc(error?.message || "άγνωστο σφάλμα")}</div>`;
        $("formsMapSaveBtn").disabled = true;
      });
      return;
    }

    $("formsMapSaveBtn").disabled = false;
    const host = $("formsMapList");
    host.innerHTML = fields.map((field,index) => `<div class="forms-map-row"><div class="forms-map-name"><strong title="${esc(field.name)}">${esc(field.name)}</strong><small>${esc(field.type)}</small></div><select data-map-index="${index}" data-field-name="${esc(field.name)}">${optionMarkup((template.mapping || {})[field.name] || "")}</select></div>`).join("");
  }

  async function openVisualMapping(template) {
    visualDraft = (template.visualFields || []).map(item => ({ ...item }));
    visualPageIndex = visualDraft[0]?.pageIndex || 0;
    $("formsMapSaveBtn").disabled = false;
    $("formsMapList").innerHTML = `
      <div class="forms-visual-toolbar">
        <div class="forms-field forms-visual-source"><label for="formsVisualSource">Πεδίο CRM που θα τοποθετήσεις</label><select id="formsVisualSource">${visualOptionMarkup("")}</select></div>
        <div class="forms-field forms-visual-size"><label for="formsVisualFontSize">Μέγεθος</label><select id="formsVisualFontSize"><option value="8">8</option><option value="9">9</option><option value="10">10</option><option value="11" selected>11</option><option value="12">12</option><option value="14">14</option><option value="16">16</option><option value="18">18</option></select></div>
        <div class="forms-visual-pages"><button class="forms-secondary" id="formsVisualPrev" type="button">‹</button><span id="formsVisualPageLabel">Σελίδα</span><button class="forms-secondary" id="formsVisualNext" type="button">›</button></div>
      </div>
      <div class="forms-visual-help" id="formsVisualHelp">Διάλεξε ένα πεδίο CRM και μετά πάτησε ακριβώς πάνω στο σημείο του εντύπου όπου θέλεις να εμφανίζεται.</div>
      <div class="forms-visual-canvas-shell"><div class="forms-visual-canvas-wrap" id="formsVisualCanvasWrap"><canvas id="formsVisualCanvas"></canvas><div class="forms-visual-markers" id="formsVisualMarkers"></div></div></div>
      <div class="forms-visual-list-wrap"><h4>Τοποθετημένα πεδία</h4><div class="forms-visual-list" id="formsVisualList"></div></div>`;

    const pdfjs = await ensurePdfJs();
    const bytes = new Uint8Array(await template.pdfBlob.arrayBuffer());
    visualPdfDoc = await pdfjs.getDocument({ data: bytes }).promise;
    $("formsVisualPrev")?.addEventListener("click", () => changeVisualPage(-1));
    $("formsVisualNext")?.addEventListener("click", () => changeVisualPage(1));
    $("formsVisualCanvas")?.addEventListener("click", addVisualFieldFromClick);
    $("formsVisualList")?.addEventListener("change", event => {
      const select = event.target.closest("select[data-visual-source-id]");
      if (!select) return;
      const item = visualDraft.find(field => field.id === select.dataset.visualSourceId);
      if (item) item.sourceKey = select.value;
      renderVisualMarkers();
    });
    $("formsVisualList")?.addEventListener("click", event => {
      const remove = event.target.closest("[data-remove-visual]");
      if (!remove) return;
      visualDraft = visualDraft.filter(field => field.id !== remove.dataset.removeVisual);
      renderVisualMarkers();
      renderVisualFieldList();
    });
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
      if (help) { help.textContent = "Πρώτα διάλεξε ποιο πεδίο του CRM θέλεις να τοποθετήσεις."; help.classList.add("warning"); }
      return;
    }
    const canvas = $("formsVisualCanvas");
    const rect = canvas.getBoundingClientRect();
    const xRatio = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    const yRatio = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
    const fontSize = Number($("formsVisualFontSize")?.value || 11);
    visualDraft.push({ id: uid(), pageIndex: visualPageIndex, xRatio, yRatio, sourceKey, fontSize });
    const help = $("formsVisualHelp");
    if (help) { help.textContent = `Τοποθετήθηκε: ${sourceLabel(sourceKey)}. Μπορείς να συνεχίσεις με άλλο πεδίο.`; help.classList.remove("warning"); }
    renderVisualMarkers();
    renderVisualFieldList();
  }

  function renderVisualMarkers() {
    const host = $("formsVisualMarkers");
    const canvas = $("formsVisualCanvas");
    if (!host || !canvas) return;
    const width = parseFloat(canvas.style.width) || canvas.clientWidth || 1;
    const height = parseFloat(canvas.style.height) || canvas.clientHeight || 1;
    const current = visualDraft.filter(item => Number(item.pageIndex || 0) === visualPageIndex);
    host.innerHTML = current.map((item, index) => `<div class="forms-visual-marker" style="left:${item.xRatio * width}px;top:${item.yRatio * height}px" title="${esc(sourceLabel(item.sourceKey))}"><span>${index + 1}</span><b>${esc(sourceLabel(item.sourceKey))}</b></div>`).join("");
  }

  function renderVisualFieldList() {
    const host = $("formsVisualList");
    if (!host) return;
    if (!visualDraft.length) {
      host.innerHTML = `<div class="forms-empty">Δεν έχεις τοποθετήσει ακόμη πεδίο. Διάλεξε πεδίο CRM και πάτησε πάνω στο PDF.</div>`;
      return;
    }
    host.innerHTML = visualDraft.map((item,index) => `<div class="forms-visual-list-row"><div class="forms-visual-index">${index + 1}</div><div class="forms-visual-list-main"><small>Σελίδα ${Number(item.pageIndex || 0) + 1} · ${Number(item.fontSize || 11)} pt</small><select data-visual-source-id="${esc(item.id)}">${visualOptionMarkup(item.sourceKey || "")}</select></div><button class="forms-danger forms-visual-remove" type="button" data-remove-visual="${esc(item.id)}">×</button></div>`).join("");
  }

  function closeMapping() {
    currentMapTemplate = null;
    visualPdfDoc = null;
    visualDraft = [];
    $("formsMapModal")?.classList.add("hidden");
  }

  async function saveMapping() {
    if (!currentMapTemplate) return;
    try {
      let updated;
      if ((currentMapTemplate.fields || []).length) {
        const mapping = {};
        $("formsMapList").querySelectorAll("select[data-field-name]").forEach(select => {
          mapping[select.dataset.fieldName] = select.value;
        });
        updated = { ...currentMapTemplate, mapping, updatedAt: new Date().toISOString() };
      } else {
        if (!visualDraft.length) {
          const help = $("formsVisualHelp");
          if (help) { help.textContent = "Τοποθέτησε τουλάχιστον ένα πεδίο πάνω στο PDF πριν την αποθήκευση."; help.classList.add("warning"); }
          return;
        }
        updated = { ...currentMapTemplate, visualFields: visualDraft.map(item => ({ ...item })), updatedAt: new Date().toISOString(), version: 2 };
      }
      await dbPut(updated);
      await refreshTemplates();
      selectedTemplateId = updated.id;
      renderTemplates();
      closeMapping();
      setStatus("Η αντιστοίχιση πεδίων αποθηκεύτηκε.", "success");
    } catch (error) {
      console.error(error);
      setStatus("Δεν αποθηκεύτηκε η αντιστοίχιση.", "error");
    }
  }

  async function textPngData(text, fontSize = 11) {
    const value = String(text ?? "");
    const scale = 3;
    const family = `-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif`;
    const measure = document.createElement("canvas").getContext("2d");
    measure.font = `${fontSize}px ${family}`;
    const measured = Math.max(2, Math.ceil(measure.measureText(value).width));
    const logicalWidth = measured + 5;
    const logicalHeight = Math.ceil(fontSize * 1.45) + 2;
    const canvas = document.createElement("canvas");
    canvas.width = logicalWidth * scale;
    canvas.height = logicalHeight * scale;
    const ctx = canvas.getContext("2d");
    ctx.scale(scale, scale);
    ctx.clearRect(0, 0, logicalWidth, logicalHeight);
    ctx.fillStyle = "#000";
    ctx.font = `${fontSize}px ${family}`;
    ctx.textBaseline = "top";
    ctx.fillText(value, 2, 1);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/png"));
    if (!blob) throw new Error("Δεν δημιουργήθηκε η εικόνα κειμένου.");
    return { bytes: new Uint8Array(await blob.arrayBuffer()), width: logicalWidth, height: logicalHeight };
  }

  async function drawVisualFields(doc, visualFields, context) {
    let filled = 0;
    let nonEmpty = 0;
    for (const item of visualFields || []) {
      const value = sourceValue(item.sourceKey, context);
      if (value === "" || value === null || value === undefined) continue;
      nonEmpty += 1;
      const pageIndex = Math.max(0, Math.min(doc.getPageCount() - 1, Number(item.pageIndex || 0)));
      const page = doc.getPage(pageIndex);
      const { width: pageWidth, height: pageHeight } = page.getSize();
      const pngData = await textPngData(value, Number(item.fontSize || 11));
      const image = await doc.embedPng(pngData.bytes);
      let drawWidth = pngData.width;
      let drawHeight = pngData.height;
      const x = Math.max(0, Math.min(pageWidth - 2, Number(item.xRatio || 0) * pageWidth));
      const maxWidth = Math.max(8, pageWidth - x - 2);
      if (drawWidth > maxWidth) {
        const ratio = maxWidth / drawWidth;
        drawWidth *= ratio;
        drawHeight *= ratio;
      }
      const yTop = Math.max(0, Math.min(pageHeight, Number(item.yRatio || 0) * pageHeight));
      const y = Math.max(0, pageHeight - yTop - drawHeight);
      page.drawImage(image, { x, y, width: drawWidth, height: drawHeight });
      filled += 1;
    }
    return { filled, nonEmpty };
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

  async function fillSelectedTemplate() {
    const template = templates.find(item => item.id === selectedTemplateId);
    const customer = currentCustomer();
    if (!template) { setStatus("Επίλεξε πρώτα έντυπο από τη βιβλιοθήκη.", "warning"); return; }
    if (!customer) { setStatus("Επίλεξε πρώτα πελάτη από το CRM.", "warning"); return; }
    const mapped = Object.entries(template.mapping || {}).filter(([,value]) => value);
    const visualFields = Array.isArray(template.visualFields) ? template.visualFields.filter(item => item.sourceKey) : [];
    if (!mapped.length && !visualFields.length) { setStatus("Ρύθμισε πρώτα την αντιστοίχιση πεδίων του εντύπου.", "warning"); openMapping(template.id); return; }

    setStatus("Συμπλήρωση του PDF…");
    $("formsFillBtn").disabled = true;
    try {
      const { PDFDocument } = await ensurePdfLib();
      const bytes = await template.pdfBlob.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const context = buildContext();
      let filledCount = 0;
      let nonEmptyCount = 0;

      if ((template.fields || []).length && mapped.length) {
        const form = doc.getForm();
        const fields = form.getFields();
        const byName = new Map(fields.map(field => [field.getName(), field]));
        for (const [fieldName, sourceKey] of mapped) {
          const field = byName.get(fieldName);
          if (!field) continue;
          const value = sourceValue(sourceKey, context);
          if (value !== "" && value !== null && value !== undefined) nonEmptyCount += 1;
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
      setStatus(`Το νέο PDF δημιουργήθηκε. Συμπληρώθηκαν ${filledCount} πεδία (${nonEmptyCount} με διαθέσιμη τιμή από το CRM).`, "success");
    } catch (error) {
      console.error(error);
      setStatus(`Δεν ολοκληρώθηκε η συμπλήρωση: ${error?.message || "άγνωστο σφάλμα"}`, "error");
    } finally {
      $("formsFillBtn").disabled = false;
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
    if (!window.confirm(`Να διαγραφεί το έντυπο «${template.name || template.originalName}» από τη βιβλιοθήκη;`)) return;
    try {
      await dbDelete(id);
      if (selectedTemplateId === id) selectedTemplateId = null;
      await refreshTemplates();
      setStatus("Το έντυπο διαγράφηκε από τη βιβλιοθήκη.", "success");
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
    $("formsCustomerSearch")?.addEventListener("input", event => renderCustomerResults(event.target.value));
    $("formsCustomerResults")?.addEventListener("click", event => {
      const option = event.target.closest("[data-customer-id]");
      if (option) selectCustomer(option.dataset.customerId);
    });
    $("formsTemplateList")?.addEventListener("click", event => {
      const deleteButton = event.target.closest("[data-delete-template]");
      if (deleteButton) { event.stopPropagation(); deleteTemplate(deleteButton.dataset.deleteTemplate); return; }
      const mapButton = event.target.closest("[data-map-template]");
      if (mapButton) { event.stopPropagation(); selectedTemplateId = mapButton.dataset.mapTemplate; renderTemplates(); openMapping(selectedTemplateId); return; }
      const card = event.target.closest("[data-template-id]");
      if (card) { selectedTemplateId = card.dataset.templateId; renderTemplates(); setStatus(selectedCustomerId ? "Έτοιμο για αυτόματη συμπλήρωση." : "Επίλεξε πελάτη από το CRM."); }
    });
    $("formsPolicySelect")?.addEventListener("change", event => {
      selectedPolicySource = event.target.value;
      selectedPersonId = "insured";
      renderPersonOptions();
    });
    $("formsPersonSelect")?.addEventListener("change", event => { selectedPersonId = event.target.value; });
    $("formsFillBtn")?.addEventListener("click", fillSelectedTemplate);
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
