(() => {
  "use strict";

  const VERSION = "1.0.0";
  const DB_NAME = "tsertos-form-library";
  const DB_VERSION = 1;
  const STORE = "templates";
  const PDF_LIB_PRIMARY = "https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js";
  const PDF_LIB_FALLBACK = "https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js";

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
    ["policy.number", "Αριθμός συμβολαίου", "Συμβόλαιο"],
    ["policy.product", "Προϊόν συμβολαίου", "Συμβόλαιο"],
    ["policy.startDate", "Ημερομηνία έναρξης", "Συμβόλαιο"],
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
      return Array.isArray(customers) ? customers : [];
    } catch (_) {
      return [];
    }
  }

  function autoPoliciesArray() {
    try {
      return Array.isArray(autoPolicies) ? autoPolicies : [];
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
    if (has("αρ συμβολ", "αριθμος συμβολ", "policy number", "contract number")) return "policy.number";
    if (has("προϊον", "product")) return "policy.product";
    if (has("ημερ εναρξ", "ημερομηνια εναρξ", "start date")) return "policy.startDate";
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
                <div class="forms-field"><label for="formsPolicySelect">Συμβόλαιο</label><select id="formsPolicySelect"><option value="">Χωρίς συγκεκριμένο συμβόλαιο</option></select></div>
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
      const mapped = Object.values(template.mapping || {}).filter(Boolean).length;
      const ready = fieldCount > 0 && mapped > 0;
      return `<article class="forms-template-card ${template.id === selectedTemplateId ? "selected" : ""}" data-template-id="${esc(template.id)}">
        <div class="forms-template-name">${esc(template.name || template.originalName || "Έντυπο")}</div>
        <div class="forms-template-meta"><span class="forms-chip">${fieldCount} πεδία PDF</span><span class="forms-chip ${ready ? "ready" : "warning"}">${mapped} αντιστοιχισμένα</span></div>
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1
      };
      await dbPut(template);
      selectedTemplateId = template.id;
      await refreshTemplates();
      if (!fields.length) {
        setStatus("Το PDF προστέθηκε, αλλά δεν έχει διαδραστικά πεδία φόρμας. Θα χρειαστεί οπτική τοποθέτηση πεδίων σε επόμενη έκδοση.", "warning");
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
    host.innerHTML = matches.length ? matches.map(customer => `<button class="forms-customer-option" type="button" data-customer-id="${esc(customer.id)}"><strong>${esc(displayName(customer))}</strong><span>${[customer.afm && `ΑΦΜ ${customer.afm}`, customer.phone].filter(Boolean).map(esc).join(" · ")}</span></button>`).join("") : `<div class="forms-empty">Δεν βρέθηκε πελάτης.</div>`;
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
      options.push(`<optgroup label="Συμβόλαια">${regular.map(policy => `<option value="policy:${esc(policy.id || policy.number)}">${esc(policy.number || "Χωρίς αριθμό")}${policy.product ? ` — ${esc(policy.product)}` : ""}</option>`).join("")}</optgroup>`);
    }
    if (autos.length) {
      options.push(`<optgroup label="Αυτοκίνητα">${autos.map(policy => `<option value="auto:${esc(policy.id)}">${esc(policy.policyNumber || "Συμβόλαιο")}${policy.registrationNumber ? ` — ${esc(policy.registrationNumber)}` : ""}</option>`).join("")}</optgroup>`);
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
    const host = $("formsMapList");
    if (!fields.length) {
      host.innerHTML = `<div class="forms-empty">Το PDF δεν περιέχει διαδραστικά πεδία φόρμας. Η οπτική τοποθέτηση πεδίων πάνω σε επίπεδα PDF θα προστεθεί στο επόμενο στάδιο.</div>`;
      $("formsMapSaveBtn").disabled = true;
    } else {
      $("formsMapSaveBtn").disabled = false;
      host.innerHTML = fields.map((field,index) => `<div class="forms-map-row"><div class="forms-map-name"><strong title="${esc(field.name)}">${esc(field.name)}</strong><small>${esc(field.type)}</small></div><select data-map-index="${index}" data-field-name="${esc(field.name)}">${optionMarkup((template.mapping || {})[field.name] || "")}</select></div>`).join("");
    }
    $("formsMapModal").classList.remove("hidden");
  }

  function closeMapping() {
    currentMapTemplate = null;
    $("formsMapModal")?.classList.add("hidden");
  }

  async function saveMapping() {
    if (!currentMapTemplate) return;
    const mapping = {};
    $("formsMapList").querySelectorAll("select[data-field-name]").forEach(select => {
      mapping[select.dataset.fieldName] = select.value;
    });
    const updated = { ...currentMapTemplate, mapping, updatedAt: new Date().toISOString() };
    try {
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
    if (!(template.fields || []).length) { setStatus("Αυτό το PDF δεν έχει διαδραστικά πεδία φόρμας ακόμη.", "warning"); return; }
    const mapped = Object.entries(template.mapping || {}).filter(([,value]) => value);
    if (!mapped.length) { setStatus("Ρύθμισε πρώτα την αντιστοίχιση πεδίων του εντύπου.", "warning"); openMapping(template.id); return; }

    setStatus("Συμπλήρωση του PDF…");
    $("formsFillBtn").disabled = true;
    try {
      const { PDFDocument } = await ensurePdfLib();
      const bytes = await template.pdfBlob.arrayBuffer();
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const form = doc.getForm();
      const fields = form.getFields();
      const byName = new Map(fields.map(field => [field.getName(), field]));
      const context = buildContext();
      let filledCount = 0;
      let nonEmptyCount = 0;

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
      setStatus(`Το νέο PDF δημιουργήθηκε. Συμπληρώθηκαν ${filledCount} αντιστοιχισμένα πεδία (${nonEmptyCount} με διαθέσιμη τιμή από το CRM).`, "success");
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
