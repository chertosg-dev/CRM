(() => {
  "use strict";

  const VERSION = "9.13.11";
  const TABLE = "fire_policies";
  const LOCAL_OWNER_ID = "00000000-0000-4000-8000-000000000001";
  const HOME_PACKAGES = ["BASIC", "EXTRA", "ADVANCED", "MAX"];
  const BUSINESS_PACKAGES = ["ΑΠΛΟ", "ΣΥΝΘΕΤΟ", "ΠΛΗΡΕΣ"];
  const HOME_USES = [
    "ΚΥΡΙΑ / ΜΟΝΙΜΗ ΚΑΤΟΙΚΙΑ",
    "ΕΞΟΧΙΚΗ / ΔΕΥΤΕΡΕΥΟΥΣΑ ΚΑΤΟΙΚΙΑ",
    "ΚΟΙΝΟΧΡΗΣΤΟΙ ΧΩΡΟΙ",
    "ΥΠΟ ΑΝΕΓΕΡΣΗ / ΝΕΑ ΟΙΚΟΔΟΜΗ",
    "AIRBNB"
  ];
  const HOME_TYPES = ["ΔΙΑΜΕΡΙΣΜΑ", "ΜΟΝΟΚΑΤΟΙΚΙΑ", "ΜΕΖΟΝΕΤΑ"];

  const HOME_COVERAGE_GROUPS = {
    BASIC: [
      { id: "fire", name: "Πυρκαγιά, δασική πυρκαγιά, καπνός φωτιάς", limit: "Ζημιές στα ασφαλισμένα αντικείμενα, μέχρι το αντίστοιχο κεφάλαιο", deductible: "Δεν αναφέρεται ειδική" },
      { id: "lightning", name: "Κεραυνός", limit: "Ζημιές από κεραυνό, σύμφωνα με τους όρους", deductible: "Δεν αναφέρεται ειδική" },
      { id: "explosion", name: "Ευρεία έκρηξη", limit: "Μέχρι το αντίστοιχο ασφαλισμένο κεφάλαιο", deductible: "Δεν αναφέρεται ειδική" },
      { id: "aircraft", name: "Πτώση αεροσκάφους", limit: "Μέχρι το αντίστοιχο ασφαλισμένο κεφάλαιο", deductible: "Δεν αναφέρεται ειδική" },
      { id: "civil_unrest", name: "Φωτιά / έκρηξη από τρομοκρατία, απεργίες, οχλαγωγίες, πολιτικές ταραχές ή κακόβουλες πράξεις", limit: "Στο Basic αφορά τη φωτιά / έκρηξη από αυτές τις αιτίες", deductible: "5%, ελάχιστο 350€" },
      { id: "burglar_damage", name: "Ζημιές κλέπτη στο κτίριο", limit: "6% Κ ή, αν ασφαλίζεται μόνο περιεχόμενο, 6% Π· έως 6.000€", deductible: "5%, ελάχιστο 500€" },
      { id: "common_areas", name: "Κοινόχρηστοι / κοινόκτητοι χώροι", limit: "15% Κ, έως 15.000€", deductible: "Ανάλογα με τον κίνδυνο" },
      { id: "loan_installments", name: "Δόσεις στεγαστικού / ανακαινιστικού δανείου", limit: "3% Κ, έως 6.000€, λόγω καλυπτόμενης ζημιάς", deductible: "Ανάλογα με τον κίνδυνο" },
      { id: "demolition", name: "Κατεδάφιση και απομάκρυνση ερειπίων", limit: "5% Σ", deductible: "Ανάλογα με τον κίνδυνο" },
      { id: "third_party_liability", name: "Αστική ευθύνη για υλικές ζημιές τρίτων", limit: "20% Σ, έως 20.000€, από καλυπτόμενο κίνδυνο", deductible: "Σύμφωνα με τον σχετικό όρο" },
      { id: "engineers", name: "Αμοιβές μηχανικών / αρχιτεκτόνων και άδειες", limit: "Περιλαμβάνονται στην επίσημη παρουσίαση· χρειάζεται επιβεβαίωση του ορίου ειδικά για Basic", deductible: "Σύμφωνα με τον σχετικό όρο" },
      { id: "emergency_assistance", name: "Επείγουσα τεχνική βοήθεια", limit: "Παροχή υπηρεσιών με όρια και γεωγραφικές προϋποθέσεις", deductible: "Σύμφωνα με το προσάρτημα" }
    ],
    EXTRA: [
      { id: "pipes", name: "Διαρροή, θραύση ή υπερχείλιση σωληνώσεων / δεξαμενών", limit: "Ζημιές από εγκαταστάσεις ύδρευσης, θέρμανσης, κλιματισμού και αποχέτευσης", deductible: "5%, ελάχιστο 350€· ειδικός κανόνας άνω των 30 ετών" },
      { id: "leak_detection", name: "Εντοπισμός διαρροής και επισκευή ίδιων σωληνώσεων", limit: "3% Κ, έως 3.000€", deductible: "Όπως οι σωληνώσεις" },
      { id: "water_pumping", name: "Άντληση υδάτων", limit: "3% Σ, έως 3.000€", deductible: "Ελέγχεται σε συνδυασμό με το ζημιογόνο γεγονός" },
      { id: "vehicle_impact", name: "Πρόσκρουση οχήματος", limit: "Υλικές ζημιές στα ασφαλισμένα αντικείμενα", deductible: "Δεν αναφέρεται ειδική" },
      { id: "civil_unrest", name: "Τρομοκρατία, απεργίες, οχλαγωγίες, πολιτικές ταραχές, κακόβουλες πράξεις", limit: "Διευρυμένη κάλυψη πέρα από φωτιά / έκρηξη", deductible: "5%, ελάχιστο 350€" }
    ],
    ADVANCED: [
      { id: "smoke", name: "Ατυχηματική / αντικανονική διαφυγή καπνού από εστία θέρμανσης", limit: "Ζημιές στα ασφαλισμένα αντικείμενα", deductible: "Δεν αναφέρεται ειδική" },
      { id: "falling_objects", name: "Πτώση δέντρων / στύλων", limit: "Ζημιές στο ασφαλισμένο κτίριο ή περιεχόμενο", deductible: "Δεν αναφέρεται ειδική" },
      { id: "weather", name: "Θύελλα, καταιγίδα, πλημμύρα, ανεμοθύελλα, ανεμοστρόβιλος, χιόνι, βάρος χιονιού, χαλάζι, παγετός", limit: "Μέχρι το αντίστοιχο κεφάλαιο, με ειδικά υποόρια παρακάτω", deductible: "5%, ελάχιστο 350€" },
      { id: "weather_basements", name: "Φυσικά φαινόμενα σε υπόγεια / ημιυπόγεια και μόνιμα εξωτερικά προσαρτημένα αντικείμενα", limit: "10% Σ, έως 6.000€", deductible: "5%, ελάχιστο 350€" },
      { id: "glass", name: "Θραύση τζαμιών, κρυστάλλων και καθρεπτών", limit: "3% του σχετικού κεφαλαίου κτιρίου ή/και περιεχομένου, έως 3.000€", deductible: "Δεν αναφέρεται ειδική" }
    ],
    MAX: [
      { id: "theft", name: "Κλοπή περιεχομένου μετά από διάρρηξη / ληστεία", limit: "Μέχρι το ασφαλισμένο κεφάλαιο περιεχομένου, με επιμέρους περιορισμούς αντικειμένων", deductible: "5%, ελάχιστο 500€" },
      { id: "duplicate_key", name: "Κλοπή με αντικλείδι", limit: "10% Π, έως 5.000€· μόνο κύρια κατοικία", deductible: "5%, ελάχιστο 500€" },
      { id: "robbery", name: "Ληστεία χρημάτων / κοσμημάτων / τιμαλφών", limit: "Έως 600€, με υποόριο χρημάτων 200€", deductible: "Έλεγχος ειδικού όρου ληστείας" },
      { id: "temporary_housing", name: "Προσωρινή μεταστέγαση", limit: "3% Σ, έως 5.000€", deductible: "Σύμφωνα με τον σχετικό όρο" },
      { id: "temporary_contents", name: "Οικοσκευή σε προσωρινή στέγαση", limit: "3% Π, έως 3.000€", deductible: "Ανάλογα με τον κίνδυνο" },
      { id: "food_spoilage", name: "Αλλοίωση τροφίμων ψυγείου", limit: "1% Π, έως 1.000€", deductible: "Δεν αναφέρεται ειδική" },
      { id: "family_liability", name: "Προσωπική / οικογενειακή και εργοδοτική ευθύνη προς οικιακό προσωπικό", limit: "25% Σ, έως 25.000€", deductible: "Σύμφωνα με τον σχετικό όρο" },
      { id: "rent_loss", name: "Απώλεια ενοικίων", limit: "10% Κ, έως 6.000€", deductible: "Σύμφωνα με τον σχετικό όρο" },
      { id: "electrical", name: "Ηλεκτρικές / μηχανικές βλάβες", limit: "3% Σ, έως 3.000€", deductible: "150€" },
      { id: "matching_materials", name: "Αντικατάσταση μη ζημιωθέντων υλικών", limit: "3% Κ, έως 3.000€", deductible: "Σύμφωνα με τον σχετικό όρο" },
      { id: "automatic_reinstatement", name: "Αυτόματη επαναφορά ασφαλισμένων ποσών μετά τη ζημιά", limit: "Επαναφορά στα αρχικά ποσά, υπό προϋποθέσεις", deductible: "Δεν αποτελεί αυτοτελή χρηματική αποζημίωση" }
    ]
  };
  const EARTHQUAKE_COVERAGE = {
    id: "earthquake",
    name: "Σεισμός",
    limit: "Πρόσθετη κάλυψη σύμφωνα με τους όρους του συμβολαίου",
    deductible: "Σύμφωνα με την αναγραφόμενη απαλλαγή του συμβολαίου"
  };

  let client = null;
  let ownerId = LOCAL_OWNER_ID;
  let firePolicies = [];
  let modal = null;
  let activeMode = "list";
  let editingPolicyId = null;
  let observer = null;
  let importNotice = null;

  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[char]);
  const normalize = value => String(value || "").normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("el-GR").replace(/\s+/g, " ").trim();
  const uid = () => crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const formatDate = value => value ? new Date(`${value}T00:00:00`).toLocaleDateString("el-GR") : "—";
  const formatMoney = value => {
    if (value === "" || value === null || value === undefined) return "—";
    const number = Number(value);
    return Number.isFinite(number)
      ? new Intl.NumberFormat("el-GR", { style: "currency", currency: "EUR", maximumFractionDigits: 2 }).format(number)
      : "—";
  };
  const customers = () => window.TSERTOS_CRM_FORMS_API?.getCustomers?.() || [];
  const autos = () => window.TSERTOS_CRM_FORMS_API?.getAutoPolicies?.() || [];
  const customerName = customer => [customer?.firstName, customer?.lastName].filter(Boolean).join(" ").trim()
    || customer?.company || "ΧΩΡΙΣ ΟΝΟΜΑ";
  const customerById = id => customers().find(customer => customer.id === id) || null;
  const policiesForCustomer = id => firePolicies.filter(policy => policy.insuredId === id);

  function coverageRows(packageName) {
    const index = HOME_PACKAGES.indexOf(String(packageName || "").toLocaleUpperCase("el-GR"));
    if (index < 0) return [];
    const merged = new Map();
    HOME_PACKAGES.slice(0, index + 1).forEach(group => {
      HOME_COVERAGE_GROUPS[group].forEach(row => merged.set(row.id, { ...row, introducedIn: group }));
    });
    return [...merged.values()];
  }

  function sanitizePolicy(source = {}) {
    const payload = source.payload && typeof source.payload === "object" ? source.payload : source;
    return {
      id: source.id || payload.id || uid(),
      insuredId: source.insured_id || payload.insuredId || "",
      policyNumber: source.policy_number || payload.policyNumber || "",
      insured: { name: "", afm: "", phone: "", email: "", ...(payload.insured || {}) },
      policyholderSame: payload.policyholderSame !== false,
      policyholder: { name: "", afm: "", phone: "", email: "", ...(payload.policyholder || {}) },
      beneficiarySame: payload.beneficiarySame !== false,
      beneficiary: { name: "", afm: "", phone: "", email: "", ...(payload.beneficiary || {}) },
      productType: source.product_type || payload.productType || "HOME",
      productName: payload.productName || "FULL HOME",
      packageName: source.package_name ?? payload.packageName ?? "BASIC",
      withDeductible: Boolean(source.with_deductible ?? payload.withDeductible),
      earthquakeCoverage: Boolean(payload.earthquakeCoverage),
      completedRenewalDates: Array.isArray(payload.completedRenewalDates)
        ? [...new Set(payload.completedRenewalDates.map(value => String(value || "").trim()).filter(Boolean))]
        : [],
      startDate: payload.startDate || "",
      installments: payload.installments ?? "",
      grossPremium: payload.grossPremium ?? "",
      risk: { street: "", streetNumber: "", area: "", postalCode: "", additional: "", ...(payload.risk || {}) },
      property: {
        useType: "ΚΥΡΙΑ / ΜΟΝΙΜΗ ΚΑΤΟΙΚΙΑ", residenceType: "", ama: "", constructionYear: "",
        mainArea: "", auxiliaryArea: "", roofConstruction: "", buildingConstruction: "", floor: "",
        ...(payload.property || {})
      },
      insuredItems: { building: "", contents: "", buildingImprovements: "", alternativeEnergy: "", ...(payload.insuredItems || {}) },
      notes: payload.notes || "",
      createdAt: source.created_at || payload.createdAt || "",
      updatedAt: source.updated_at || payload.updatedAt || ""
    };
  }

  function databaseRow(policy, includeId = true) {
    const payload = { ...policy };
    delete payload.id;
    delete payload.createdAt;
    delete payload.updatedAt;
    return {
      ...(includeId ? { id: policy.id || uid() } : {}),
      owner_id: ownerId,
      insured_id: policy.insuredId,
      policy_number: policy.policyNumber,
      product_type: policy.productType,
      package_name: policy.packageName,
      with_deductible: Boolean(policy.withDeductible),
      payload
    };
  }

  function injectStyles() {
    if (document.getElementById("tsertos-fire-styles")) return;
    const style = document.createElement("style");
    style.id = "tsertos-fire-styles";
    style.textContent = `
      .crm-fire-button{min-height:43px;border:1px solid rgba(255,255,255,.18)!important;background:rgba(229,72,77,.18)!important;color:#fff!important;box-shadow:none!important}.crm-fire-button span{color:#ffbd61;font-size:18px}
      .fire-modal{position:fixed;inset:0;z-index:48000;display:grid;place-items:center;padding:14px;background:rgba(3,18,46,.78);backdrop-filter:blur(8px)}.fire-modal.hidden{display:none!important}.fire-window{display:flex;flex-direction:column;width:min(1100px,100%);max-height:calc(100dvh - 28px);overflow-x:hidden;overflow-y:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;border:1px solid rgba(255,255,255,.18);border-radius:24px;background:#f5f8fd;box-shadow:0 34px 100px rgba(0,0,0,.4)}
      .fire-package-options{display:flex;align-items:center;gap:8px}
      .fire-head{position:sticky;top:0;z-index:30;display:flex;align-items:center;gap:12px;padding:16px 18px;border-bottom:1px solid rgba(255,255,255,.12);background:linear-gradient(145deg,#061b43,#0b2d67);color:#fff}.fire-head .fire-policy-icon{display:grid;place-items:center;width:39px;height:39px;flex:0 0 auto;border-radius:12px;background:rgba(255,255,255,.12);font-size:20px}.fire-head-copy{min-width:0;flex:1}.fire-head-copy small{display:block;color:#f2b629;font-size:9px;font-weight:950;letter-spacing:.14em}.fire-head-copy h2{margin:3px 0 0;color:#fff;font-size:20px}.fire-close{display:grid;place-items:center;width:38px;height:38px;border:1px solid rgba(255,255,255,.18);border-radius:11px;background:rgba(255,255,255,.1);color:#fff;font-size:25px}.fire-body{padding:14px;background:#f5f8fd}.fire-toolbar{position:sticky;top:71px;z-index:20;display:flex;gap:8px;margin:-14px -14px 14px;padding:11px 14px;border-bottom:1px solid #dfe6f1;background:rgba(255,255,255,.97);backdrop-filter:blur(12px)}.fire-toolbar input{min-width:0;flex:1}.fire-list{display:grid;gap:13px}.fire-form{display:grid;gap:10px}.fire-form-section{overflow:hidden;border:1px solid #dce5f2;border-radius:17px;background:#fff;box-shadow:0 8px 22px rgba(18,42,85,.07)}.fire-form-section>summary{display:flex;align-items:center;min-height:54px;padding:11px 13px;cursor:pointer;list-style:none;background:linear-gradient(180deg,#fff,#f9fbff);color:#17284b;font-size:15px;font-weight:950}.fire-form-section>summary::-webkit-details-marker{display:none}.fire-section-body{padding:12px;border-top:1px solid #edf1f7}.fire-form-grid,.fire-data-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.fire-form .field{min-width:0}.fire-form .field-wide{grid-column:1/-1}.fire-form .field label{display:block;margin-bottom:5px;color:#354361;font-size:11px;font-weight:850}.fire-form input,.fire-form select,.fire-form textarea{width:100%;min-height:42px;padding:9px 11px}.fire-form textarea{min-height:82px}.fire-person-same,.fire-deductible-check{display:flex;align-items:center;justify-content:space-between;gap:9px;padding:10px 12px;border:1px solid #e1e7f1;border-radius:12px;background:#f8faff;color:#354361;font-size:12px;font-weight:850}.fire-person-same{margin-bottom:10px}.fire-person-same input,.fire-deductible-check input{width:20px;min-height:20px}.fire-package-line{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:end;gap:10px}.fire-coverages{display:grid;gap:8px}.fire-coverage{display:grid;grid-template-columns:minmax(180px,1.2fr) minmax(160px,1fr) minmax(130px,.8fr);gap:10px;padding:11px;border:1px solid #e2e8f2;border-radius:13px;background:#fbfdff}.fire-coverage strong{color:#17284b}.fire-coverage span,.fire-coverage em{color:#66758f;font-size:12px}.fire-savebar{position:sticky;bottom:-14px;z-index:20;display:flex;justify-content:flex-end;gap:8px;margin:12px -14px -14px;padding:11px 14px calc(11px + env(safe-area-inset-bottom));background:rgba(255,255,255,.97);box-shadow:0 -9px 24px rgba(15,30,62,.1)}.fire-actions{display:flex;justify-content:flex-end;gap:8px;padding:12px 14px;border-top:1px solid #e6ebf3;background:#fff}.fire-empty,.fire-customer-note,.fire-import-result{padding:24px 16px;border:1px dashed #d9e0eb;border-radius:16px;background:#fff;color:#71809a;text-align:center}.fire-empty strong,.fire-import-result strong{display:block;margin-bottom:6px;color:#21375e}.fire-policy-list-entry .life-policy-number-icon{background:linear-gradient(135deg,#c94c32,#f29b38)}
      @media(max-width:900px){.crm-fire-button{width:43px;padding:0!important;font-size:0}.crm-fire-button span{font-size:21px}.top-actions{grid-template-columns:repeat(7,minmax(0,1fr))!important}.fire-modal{padding:0;background:#f5f8fd}.fire-window{width:100%;height:100dvh;max-height:100dvh;border:0;border-radius:0}.fire-head{padding:calc(13px + env(safe-area-inset-top)) 13px 12px}.fire-body{padding:10px}.fire-toolbar{top:72px;flex-wrap:wrap;margin:-10px -10px 10px;padding:9px 10px}.fire-toolbar #fireSearch{flex-basis:100%;order:2}.fire-toolbar .btn{flex:1}.fire-form-grid,.fire-data-grid{grid-template-columns:1fr 1fr}.fire-coverages{gap:7px}.fire-coverage{grid-template-columns:1fr;gap:5px;padding:9px}.fire-savebar{bottom:-10px;margin-right:-10px;margin-left:-10px}.fire-package-line{grid-template-columns:1fr}.fire-package-options{display:grid;grid-template-columns:1fr 1fr}.fire-deductible-check{justify-content:center}.fire-policy-main strong{font-size:17px}}
      @media(min-width:700px) and (max-width:1366px){.fire-modal{padding:24px;background:rgba(3,18,46,.78)}.fire-window{width:min(1040px,94vw);height:auto;max-height:calc(100dvh - 48px);border:1px solid rgba(255,255,255,.18);border-radius:24px}.fire-head{padding:16px 18px}.fire-body{padding:14px}.fire-toolbar{top:71px;margin:-14px -14px 14px;padding:11px 14px}.fire-form-grid,.fire-data-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.fire-coverage{grid-template-columns:minmax(180px,1.2fr) minmax(160px,1fr) minmax(130px,.8fr);gap:10px;padding:11px}.fire-savebar{bottom:-14px;margin-right:-14px;margin-left:-14px}.fire-package-line{grid-template-columns:minmax(0,1fr) auto}.fire-package-options{display:flex}.fire-policy-main strong{font-size:clamp(25px,4vw,34px)}}
      @media(max-width:420px){.fire-form-grid,.fire-data-grid{grid-template-columns:1fr}.fire-form .field-wide{grid-column:auto}.fire-package-pill{display:none}}
    `;
    document.head.appendChild(style);
  }

  function injectShell() {
    if (document.getElementById("fireBranchModal")) return;
    modal = document.createElement("div");
    modal.id = "fireBranchModal";
    modal.className = "fire-modal hidden";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.innerHTML = `
      <div class="fire-window">
        <div class="fire-head">
          <span class="fire-policy-icon">🔥</span>
          <div class="fire-head-copy"><small>TSERTOS INSURANCE CRM</small><h2 id="fireModalTitle">Κλάδος Πυρός</h2></div>
          <button class="fire-close" id="fireModalClose" type="button" aria-label="Κλείσιμο">×</button>
        </div>
        <div class="fire-body" id="fireModalBody"></div>
        <input id="fireExcelInput" type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" hidden>
      </div>`;
    document.body.appendChild(modal);
    modal.querySelector("#fireModalClose").addEventListener("click", closeModal);
    modal.querySelector("#fireExcelInput").addEventListener("change", importFireExcel);
    modal.addEventListener("click", event => { if (event.target === modal) closeModal(); });
  }

  function injectNavigation() {
    const actions = document.querySelector(".top-actions");
    if (actions && !document.getElementById("fireBranchBtn")) {
      const button = document.createElement("button");
      button.id = "fireBranchBtn";
      button.type = "button";
      button.className = "btn crm-fire-button";
      button.title = "Κλάδος Πυρός";
      button.innerHTML = "<span>🔥</span> Πυρός";
      const backupButton = document.getElementById("quickBackupBtn");
      actions.insertBefore(button, backupButton || document.getElementById("topMenuBtn"));
      button.addEventListener("click", openList);
    }
    const dashboard = document.getElementById("tsertosDashboard");
    if (dashboard && !document.getElementById("statFire")) {
      const card = document.createElement("div");
      card.className = "tsertos-stat fire-stat";
      card.tabIndex = 0;
      card.innerHTML = '<div class="tsertos-stat-icon">🔥</div><strong id="statFire">0</strong><span>Συμβόλαια Πυρός</span>';
      dashboard.appendChild(card);
      card.addEventListener("click", openList);
      card.addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") openList(); });
      window.applyV9MobileGrid?.();
    }
  }

  function setModalTitle(title) {
    const heading = document.getElementById("fireModalTitle");
    if (heading) heading.textContent = title;
  }

  function resetFireBodyScroll() {
    const body = document.getElementById("fireModalBody");
    const windowElement = modal?.querySelector(".fire-window");
    if (body) body.scrollTop = 0;
    if (windowElement) windowElement.scrollTop = 0;
    requestAnimationFrame(() => {
      if (body) body.scrollTop = 0;
      if (windowElement) windowElement.scrollTop = 0;
    });
  }

  function openModal() {
    modal?.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    resetFireBodyScroll();
  }

  function closeModal() {
    modal?.classList.add("hidden");
    document.body.style.overflow = "";
    activeMode = "list";
    editingPolicyId = null;
  }

  function updateCounters() {
    const fireCounter = document.getElementById("statFire");
    if (fireCounter && fireCounter.textContent !== String(firePolicies.length)) {
      fireCounter.textContent = String(firePolicies.length);
    }
    const lifeCount = customers().flatMap(customer => customer.policies || []).length;
    const total = lifeCount + autos().length + firePolicies.length;
    const allCounter = document.getElementById("statPolicies");
    const totalCounter = document.getElementById("totalPolicies");
    if (allCounter && allCounter.textContent !== String(total)) allCounter.textContent = String(total);
    if (totalCounter && totalCounter.textContent !== String(total)) totalCounter.textContent = String(total);
  }

  async function loadPolicies() {
    const { data, error } = await client.from(TABLE).select("*").order("policy_number", { ascending: true });
    if (error) throw error;
    firePolicies = (data || []).map(sanitizePolicy);
    window.TSERTOS_CRM_FORMS_API.getFirePolicies = () => firePolicies.map(policy => ({ ...policy }));
    window.TSERTOS_CRM_FORMS_API.mergeFirePolicies = async sources => {
      const rows = (Array.isArray(sources) ? sources : []).map(source => databaseRow(sanitizePolicy(source), true));
      for (let index = 0; index < rows.length; index += 75) {
        const result = await client.from(TABLE).upsert(rows.slice(index, index + 75), { onConflict: "id" });
        if (result.error) throw result.error;
      }
      await loadPolicies();
      return firePolicies.length;
    };
    window.TSERTOS_CRM_FORMS_API.openFirePolicy = policyId => {
      openForm(policyId);
      openModal();
    };
    window.TSERTOS_CRM_FORMS_API.completeFireRenewal = async (policyId, renewalDate) => {
      const policy = firePolicies.find(item => item.id === policyId);
      const date = String(renewalDate || "").trim();
      if (!policy || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
      if (!policy.completedRenewalDates.includes(date)) {
        const updated = sanitizePolicy({
          ...policy,
          completedRenewalDates: [...policy.completedRenewalDates, date].sort()
        });
        const { error } = await client.from(TABLE).update(databaseRow(updated, false)).eq("id", policy.id);
        if (error) throw error;
        await loadPolicies();
      }
      return true;
    };
    updateCounters();
    window.TSERTOS_CRM_FORMS_API.refreshCustomerDirectory?.();
  }

  function policyMatches(policy, query) {
    if (!query) return true;
    const customer = customerById(policy.insuredId);
    const haystack = [
      policy.policyNumber, policy.insured?.name, policy.insured?.afm, customerName(customer),
      policy.risk?.street, policy.risk?.area, policy.risk?.postalCode, policy.packageName
    ].map(normalize);
    return haystack.some(value => value.includes(query));
  }

  function fireSectionCard(title, icon, rows, policyId, open = false) {
    const visibleRows = rows.filter(([, value]) => value !== "" && value !== null && value !== undefined);
    return `
      <details class="mock-policy-section-expanded tone-other" ${open ? "open" : ""}>
        <summary class="mock-policy-section-heading">
          <span class="coverage-section-icon">${icon}</span>
          <strong>${escapeHtml(title)}</strong>
          <span class="mock-policy-section-count">${visibleRows.length}</span>
          <span class="mock-policy-section-arrow">⌄</span>
        </summary>
        <div class="mock-policy-section-table">
          ${visibleRows.map(([label, value]) => `<div class="mock-policy-section-row ${label === "Σημειώσεις" ? "mock-policy-section-row-long" : ""}"><span>${escapeHtml(label)}</span><b>${escapeHtml(value || "—")}</b></div>`).join("")}
          <button class="mock-policy-section-edit" type="button" data-fire-edit="${escapeHtml(policyId)}">✎ Επεξεργασία καταχώρησης</button>
        </div>
      </details>`;
  }

  function policyCard(policy) {
    const customer = customerById(policy.insuredId);
    const packageLabel = policy.packageName
      ? `${policy.packageName}${policy.withDeductible ? " · ΜΕ ΑΠΑΛΛΑΓΗ" : " · ΧΩΡΙΣ ΑΠΑΛΛΑΓΗ"}${policy.earthquakeCoverage ? " · ΣΕΙΣΜΟΣ" : ""}`
      : "ΠΑΚΕΤΟ / ΑΠΑΛΛΑΓΗ: ΔΕΝ ΟΡΙΣΤΗΚΕ";
    const people = [
      ["Ασφαλιζόμενος", policy.insured],
      ["Λήπτης", policy.policyholderSame ? policy.insured : policy.policyholder],
      ["Δικαιούχος", policy.beneficiarySame ? policy.insured : policy.beneficiary]
    ];
    const riskAddress = [policy.risk.street, policy.risk.streetNumber].filter(Boolean).join(" ");
    const propertyRows = [
      ["Χρήση / Είδος", policy.productType === "BUSINESS" ? "ΕΠΙΧΕΙΡΗΣΗ" : policy.property.useType],
      ["Τύπος κατοικίας", policy.productType === "HOME" ? policy.property.residenceType : ""],
      ["ΑΜΑ", policy.property.ama], ["Έτος κατασκευής", policy.property.constructionYear],
      ["Κύριοι χώροι", policy.property.mainArea ? `${policy.property.mainArea} τ.μ.` : ""],
      ["Βοηθητικοί χώροι", policy.property.auxiliaryArea ? `${policy.property.auxiliaryArea} τ.μ.` : ""],
      ["Κατασκευή στέγης", policy.property.roofConstruction],
      ["Κατασκευή κτιρίου", policy.property.buildingConstruction], ["Όροφος", policy.property.floor]
    ].filter(([, value]) => value !== "" && value !== null && value !== undefined);
    const itemRows = [
      ["Οικοδομή", formatMoney(policy.insuredItems.building)], ["Περιεχόμενο", formatMoney(policy.insuredItems.contents)],
      ["Βελτιώσεις οικοδομής", formatMoney(policy.insuredItems.buildingImprovements)],
      ["Εναλλακτικές πηγές ενέργειας", formatMoney(policy.insuredItems.alternativeEnergy)]
    ];
    const packageCoverages = policy.productType === "HOME" ? coverageRows(policy.packageName) : [];
    const coverages = policy.earthquakeCoverage
      ? [...packageCoverages, EARTHQUAKE_COVERAGE]
      : packageCoverages;
    const personalRows = people.flatMap(([role, person]) => [
      [role, person.name], [`${role} · ΑΦΜ`, person.afm], [`${role} · Κινητό`, person.phone], [`${role} · Email`, person.email]
    ]);
    const policyRows = [["Προϊόν", policy.productName], ["Πακέτο", packageLabel], ["Κάλυψη σεισμού", policy.earthquakeCoverage ? "Περιλαμβάνεται" : "Δεν περιλαμβάνεται"], ["Έναρξη", formatDate(policy.startDate)], ["Δόσεις", policy.installments], ["Ολικά ασφάλιστρα", formatMoney(policy.grossPremium)]];
    const riskRows = [["Διεύθυνση", riskAddress], ["Περιοχή", policy.risk.area], ["ΤΚ", policy.risk.postalCode], ["Πρόσθετα στοιχεία", policy.risk.additional]];
    const coverageRowsForCard = coverages.map(coverage => [coverage.name, `${coverage.limit} · Απαλλαγή: ${coverage.deductible}`]);
    return `
      <details class="life-policy-collapsible fire-policy-list-entry">
        <summary class="life-policy-number-button">
          <span class="life-policy-number-icon">🔥</span>
          <strong>${escapeHtml(policy.policyNumber || "Χωρίς αριθμό συμβολαίου")}</strong>
          <span class="life-policy-number-arrow">⌄</span>
        </summary>
        <div class="life-policy-collapsible-body">
          <article class="policy-coverage-card mock-policy-card">
            <div class="mock-policy-header">
              <div><span class="mock-policy-label">Συμβόλαιο Πυρός</span><div class="policy-coverage-number">${escapeHtml(policy.policyNumber || "—")}</div><div class="mock-policy-date">▣ Ημ. Έναρξης: ${escapeHtml(formatDate(policy.startDate) || "Δεν έχει καταχωριστεί")}</div></div>
              <div class="mock-policy-product"><span>${escapeHtml(policy.productName || "Πυρός")}</span><small>${escapeHtml(customerName(customer))} · ${escapeHtml(packageLabel)}</small></div>
            </div>
            <div class="mock-policy-sections">
              ${fireSectionCard("Προσωπικά στοιχεία", "👤", personalRows, policy.id)}
              ${fireSectionCard("Στοιχεία συμβολαίου & προϊόν", "📄", policyRows, policy.id, true)}
              ${fireSectionCard("Τοποθεσία κινδύνου", "📍", riskRows, policy.id)}
              ${fireSectionCard("Στοιχεία ακινήτου", "🏠", propertyRows, policy.id)}
              ${fireSectionCard("Ασφαλιζόμενα αντικείμενα", "💶", itemRows, policy.id)}
              ${fireSectionCard(`Καλύψεις πακέτου (${coverages.length})`, "🛡️", coverageRowsForCard, policy.id)}
              ${policy.notes ? fireSectionCard("Σημειώσεις", "📝", [["Σημειώσεις", policy.notes]], policy.id) : ""}
            </div>
            <div class="fire-actions"><button class="btn btn-primary" type="button" data-fire-edit="${escapeHtml(policy.id)}">✎ Επεξεργασία συμβολαίου</button><button class="btn btn-danger" type="button" data-fire-delete="${escapeHtml(policy.id)}">Διαγραφή</button></div>
          </article>
        </div>
      </details>`;
  }

  function coverageViewRow(row) {
    return `<div class="fire-coverage"><strong>${escapeHtml(row.name)}</strong><span>${escapeHtml(row.limit)}</span><em>${escapeHtml(row.deductible)}</em></div>`;
  }

  function bindListEvents() {
    const body = document.getElementById("fireModalBody");
    body.querySelector("#fireNewPolicy")?.addEventListener("click", () => openForm());
    body.querySelector("#fireNewCustomer")?.addEventListener("click", () => {
      closeModal();
      document.getElementById("toggleCustomerFormBtn")?.click();
    });
    body.querySelector("#fireSearch")?.addEventListener("input", event => renderList(event.target.value));
    body.querySelectorAll("[data-fire-edit]").forEach(button => button.addEventListener("click", () => openForm(button.dataset.fireEdit)));
    body.querySelectorAll("[data-fire-delete]").forEach(button => button.addEventListener("click", () => deletePolicy(button.dataset.fireDelete)));
  }

  function renderList(searchValue = "") {
    activeMode = "list";
    setModalTitle("Κλάδος Πυρός");
    const query = normalize(searchValue);
    const filtered = firePolicies.filter(policy => policyMatches(policy, query));
    const body = document.getElementById("fireModalBody");
    body.innerHTML = `
      <div class="fire-toolbar"><input id="fireSearch" type="search" inputmode="search" class="no-auto-uppercase" placeholder="Αναζήτηση ονόματος, ΑΦΜ, συμβολαίου ή διεύθυνσης" value="${escapeHtml(searchValue)}"><label class="btn btn-secondary" for="fireExcelInput" role="button">⬆ Excel Πυρός</label><button class="btn btn-primary" id="fireNewPolicy" type="button">+ Νέο Πυρός</button></div>
      ${importNotice ? `<div class="fire-import-result ${importNotice.type === "error" ? "error" : ""}"><strong>${escapeHtml(importNotice.title)}</strong>${escapeHtml(importNotice.text)}</div>` : ""}
      ${customers().length ? "" : '<div class="fire-customer-note">Δεν υπάρχει πελάτης στο CRM. Δημιούργησε πρώτα τον ασφαλιζόμενο.</div>'}
      ${filtered.length ? `<div class="fire-list">${filtered.map(policyCard).join("")}</div>` : `<div class="fire-empty"><strong>${firePolicies.length ? "Δεν βρέθηκαν αποτελέσματα" : "Δεν υπάρχει συμβόλαιο Πυρός"}</strong><span>Πρόσθεσε το πρώτο συμβόλαιο και σύνδεσέ το με υπάρχοντα πελάτη του CRM.</span><div style="margin-top:14px"><button class="btn btn-secondary" id="fireNewCustomer" type="button">+ Νέος πελάτης</button></div></div>`}`;
    bindListEvents();
    resetFireBodyScroll();
  }

  async function openList() {
    setModalTitle("Κλάδος Πυρός");
    const body = document.getElementById("fireModalBody");
    body.innerHTML = '<div class="fire-empty"><strong>Φόρτωση συμβολαίων…</strong></div>';
    openModal();
    try {
      await loadPolicies();
      renderList();
    } catch (error) {
      body.innerHTML = `<div class="fire-empty"><strong>Δεν άνοιξε η τοπική βάση Πυρός</strong><span>${escapeHtml(error?.message || error)}</span></div>`;
    }
  }

  function personFields(prefix, person) {
    return `<div class="fire-form-grid" data-person-fields="${prefix}">
      <div class="field field-wide"><label>Ονοματεπώνυμο / Επωνυμία</label><input name="${prefix}_name" value="${escapeHtml(person.name)}"></div>
      <div class="field"><label>ΑΦΜ</label><input name="${prefix}_afm" inputmode="numeric" maxlength="9" value="${escapeHtml(person.afm)}"></div>
      <div class="field"><label>Κινητό</label><input name="${prefix}_phone" inputmode="tel" value="${escapeHtml(person.phone)}"></div>
      <div class="field field-wide"><label>Email</label><input name="${prefix}_email" type="email" inputmode="email" value="${escapeHtml(person.email)}"></div>
    </div>`;
  }

  function customerOptions(selectedId) {
    return [...customers()].sort((a,b) => customerName(a).localeCompare(customerName(b), "el")).map(customer =>
      `<option value="${escapeHtml(customer.id)}" ${customer.id === selectedId ? "selected" : ""}>${escapeHtml(customerName(customer))}${customer.afm ? ` · ${escapeHtml(customer.afm)}` : ""}</option>`
    ).join("");
  }

  function optionsHtml(values, selected) {
    return values.map(value => `<option value="${escapeHtml(value)}" ${value === selected ? "selected" : ""}>${escapeHtml(value)}</option>`).join("");
  }

  function policyForm(policy) {
    const isHome = policy.productType !== "BUSINESS";
    const packageValues = isHome ? HOME_PACKAGES : BUSINESS_PACKAGES;
    const packageCoverages = isHome ? coverageRows(policy.packageName) : [];
    const visibleCoverages = policy.earthquakeCoverage
      ? [...packageCoverages, EARTHQUAKE_COVERAGE]
      : packageCoverages;
    return `<form id="firePolicyForm" class="fire-form" autocomplete="off">
      <details class="fire-form-section" open><summary>👤 Ασφαλιζόμενος</summary><div class="fire-section-body">
        <div class="field"><label>Επιλογή πελάτη από το CRM *</label><select name="insured_id" id="fireInsuredSelect" required><option value="">— Επιλογή ασφαλιζόμενου —</option>${customerOptions(policy.insuredId)}</select></div>
        ${personFields("insured", policy.insured)}
      </div></details>
      <details class="fire-form-section"><summary>🧾 Λήπτης της ασφάλισης</summary><div class="fire-section-body">
        <label class="fire-person-same"><span>Ίδιος με τον ασφαλιζόμενο</span><input name="policyholder_same" type="checkbox" ${policy.policyholderSame ? "checked" : ""}></label>
        ${personFields("policyholder", policy.policyholder)}
      </div></details>
      <details class="fire-form-section"><summary>🏦 Δικαιούχος ασφαλίσματος</summary><div class="fire-section-body">
        <label class="fire-person-same"><span>Ίδιος με τον ασφαλιζόμενο</span><input name="beneficiary_same" type="checkbox" ${policy.beneficiarySame ? "checked" : ""}></label>
        ${personFields("beneficiary", policy.beneficiary)}
      </div></details>
      <details class="fire-form-section" open><summary>📄 Στοιχεία συμβολαίου & προϊόν</summary><div class="fire-section-body fire-form-grid">
        <div class="field"><label>Προϊόν *</label><select name="product_type" id="fireProductType" required><option value="HOME" ${isHome ? "selected" : ""}>ΚΑΤΟΙΚΙΑ · FULL HOME</option><option value="BUSINESS" ${!isHome ? "selected" : ""}>ΕΠΙΧΕΙΡΗΣΗ · ΕΘΝΙΚΗ ΕΠΙΧΕΙΡΗΣΗ PLUS</option></select></div>
        <div class="field"><label>Αριθμός συμβολαίου *</label><input name="policy_number" inputmode="numeric" required value="${escapeHtml(policy.policyNumber)}"></div>
        <div class="field"><label>Έναρξη συμβολαίου</label><input name="start_date" type="date" value="${escapeHtml(policy.startDate)}"></div>
        <div class="field"><label>Δόσεις</label><input name="installments" type="number" inputmode="numeric" min="1" max="12" value="${escapeHtml(policy.installments)}"></div>
        <div class="field"><label>Ολικά ασφάλιστρα (€)</label><input name="gross_premium" type="number" inputmode="decimal" min="0" step="0.01" value="${escapeHtml(policy.grossPremium)}"></div>
        <div class="field field-wide fire-package-line"><div class="field"><label>Πακέτο *</label><select name="package_name" id="firePackage" required>${optionsHtml(packageValues, policy.packageName)}</select></div><div class="fire-package-options"><label class="fire-deductible-check"><input name="with_deductible" type="checkbox" ${policy.withDeductible ? "checked" : ""}> Με απαλλαγές</label><label class="fire-deductible-check"><input name="earthquake_coverage" type="checkbox" ${policy.earthquakeCoverage ? "checked" : ""}> Σεισμός</label></div></div>
      </div></details>
      <details class="fire-form-section"><summary>📍 Τοποθεσία κινδύνου</summary><div class="fire-section-body fire-form-grid">
        <div class="field"><label>Οδός</label><input name="risk_street" value="${escapeHtml(policy.risk.street)}"></div><div class="field"><label>Αριθμός</label><input name="risk_number" value="${escapeHtml(policy.risk.streetNumber)}"></div>
        <div class="field"><label>Περιοχή</label><input name="risk_area" value="${escapeHtml(policy.risk.area)}"></div><div class="field"><label>ΤΚ</label><input name="risk_postal" inputmode="numeric" maxlength="5" value="${escapeHtml(policy.risk.postalCode)}"></div>
        <div class="field field-wide"><label>Πρόσθετα στοιχεία διεύθυνσης</label><input name="risk_additional" value="${escapeHtml(policy.risk.additional)}"></div>
      </div></details>
      <details class="fire-form-section"><summary>🏠 Στοιχεία ακινήτου</summary><div class="fire-section-body fire-form-grid">
        <div class="field" data-home-only><label>Χρήση / Είδος</label><select name="use_type">${optionsHtml(HOME_USES, policy.property.useType)}</select></div>
        <div class="field" data-business-only><label>Χρήση / Είδος</label><input value="ΕΠΙΧΕΙΡΗΣΗ" readonly></div>
        <div class="field" data-home-only><label>Τύπος κατοικίας</label><select name="residence_type"><option value="">— Επιλογή —</option>${optionsHtml(HOME_TYPES, policy.property.residenceType)}</select></div>
        <div class="field"><label>Αριθμός Μητρώου Ακινήτου (ΑΜΑ)</label><input name="ama" value="${escapeHtml(policy.property.ama)}"></div>
        <div class="field"><label>Έτος κατασκευής</label><input name="construction_year" type="number" inputmode="numeric" min="1800" max="2100" value="${escapeHtml(policy.property.constructionYear)}"></div>
        <div class="field"><label>Εμβαδόν κύριων χώρων (τ.μ.)</label><input name="main_area" type="number" inputmode="decimal" min="0" step="0.01" value="${escapeHtml(policy.property.mainArea)}"></div>
        <div class="field"><label>Εμβαδόν βοηθητικών χώρων (τ.μ.)</label><input name="auxiliary_area" type="number" inputmode="decimal" min="0" step="0.01" value="${escapeHtml(policy.property.auxiliaryArea)}"></div>
        <div class="field"><label>Κατασκευή στέγης</label><input name="roof_construction" value="${escapeHtml(policy.property.roofConstruction)}"></div>
        <div class="field"><label>Κατασκευή κτιρίου</label><input name="building_construction" value="${escapeHtml(policy.property.buildingConstruction)}"></div>
        <div class="field"><label>Όροφος</label><input name="floor" value="${escapeHtml(policy.property.floor)}"></div>
      </div></details>
      <details class="fire-form-section"><summary>💶 Ασφαλιζόμενα αντικείμενα</summary><div class="fire-section-body fire-form-grid">
        <div class="field"><label>Οικοδομή (€)</label><input name="building" type="number" inputmode="decimal" min="0" step="0.01" value="${escapeHtml(policy.insuredItems.building)}"></div>
        <div class="field"><label>Περιεχόμενο (€)</label><input name="contents" type="number" inputmode="decimal" min="0" step="0.01" value="${escapeHtml(policy.insuredItems.contents)}"></div>
        <div class="field"><label>Βελτιώσεις οικοδομής (€)</label><input name="building_improvements" type="number" inputmode="decimal" min="0" step="0.01" value="${escapeHtml(policy.insuredItems.buildingImprovements)}"></div>
        <div class="field"><label>Εναλλακτικές πηγές ενέργειας (€)</label><input name="alternative_energy" type="number" inputmode="decimal" min="0" step="0.01" value="${escapeHtml(policy.insuredItems.alternativeEnergy)}"></div>
      </div></details>
      <details class="fire-form-section" open><summary>🛡️ Καλύψεις επιλεγμένου πακέτου <span id="fireCoverageCount" style="margin-left:auto">${visibleCoverages.length}</span></summary><div class="fire-section-body fire-coverages" id="fireCoveragePreview">${visibleCoverages.length ? visibleCoverages.map(coverageViewRow).join("") : '<div class="fire-customer-note">Οι καλύψεις των πακέτων Επιχείρησης θα προστεθούν όταν δοθούν οι αντίστοιχοι πίνακες.</div>'}</div></details>
      <div class="field"><label>Σημειώσεις</label><textarea name="notes" rows="4">${escapeHtml(policy.notes)}</textarea></div>
      <div class="fire-savebar"><button class="btn btn-secondary" id="fireCancel" type="button">Ακύρωση</button><button class="btn btn-primary" type="submit">Αποθήκευση συμβολαίου Πυρός</button></div>
    </form>`;
  }

  function personFromForm(data, prefix) {
    return {
      name: String(data.get(`${prefix}_name`) || "").trim(), afm: String(data.get(`${prefix}_afm`) || "").replace(/\D/g, ""),
      phone: String(data.get(`${prefix}_phone`) || "").trim(), email: String(data.get(`${prefix}_email`) || "").trim()
    };
  }

  function selectedCustomerSnapshot(customer) {
    return { name: customerName(customer), afm: customer?.afm || "", phone: customer?.phone || "", email: customer?.email || "" };
  }

  function fillPerson(form, prefix, person) {
    ["name", "afm", "phone", "email"].forEach(key => {
      const field = form.elements[`${prefix}_${key}`];
      if (field) field.value = person[key] || "";
    });
  }

  function toggleSamePerson(form, prefix, same) {
    const fields = form.querySelector(`[data-person-fields="${prefix}"]`);
    if (fields) fields.hidden = same;
    if (same) fillPerson(form, prefix, personFromForm(new FormData(form), "insured"));
  }

  function syncProductForm(form) {
    const isHome = form.elements.product_type.value === "HOME";
    form.querySelectorAll("[data-home-only]").forEach(node => node.hidden = !isHome);
    form.querySelectorAll("[data-business-only]").forEach(node => node.hidden = isHome);
    const packageSelect = form.elements.package_name;
    const previous = packageSelect.value;
    const values = isHome ? HOME_PACKAGES : BUSINESS_PACKAGES;
    packageSelect.innerHTML = optionsHtml(values, values.includes(previous) ? previous : values[0]);
    renderCoveragePreview(form);
  }

  function renderCoveragePreview(form) {
    const isHome = form.elements.product_type.value === "HOME";
    const packageRows = isHome ? coverageRows(form.elements.package_name.value) : [];
    const rows = form.elements.earthquake_coverage?.checked
      ? [...packageRows, EARTHQUAKE_COVERAGE]
      : packageRows;
    const preview = form.querySelector("#fireCoveragePreview");
    const counter = form.querySelector("#fireCoverageCount");
    if (counter) counter.textContent = String(rows.length);
    if (preview) preview.innerHTML = rows.length ? rows.map(coverageViewRow).join("") : '<div class="fire-customer-note">Οι καλύψεις των πακέτων Επιχείρησης θα προστεθούν όταν δοθούν οι αντίστοιχοι πίνακες.</div>';
  }

  function bindForm(policy, isExisting) {
    const form = document.getElementById("firePolicyForm");
    toggleSamePerson(form, "policyholder", form.elements.policyholder_same.checked);
    toggleSamePerson(form, "beneficiary", form.elements.beneficiary_same.checked);
    syncProductForm(form);
    if (policy.packageName) form.elements.package_name.value = policy.packageName;
    renderCoveragePreview(form);
    form.elements.insured_id.addEventListener("change", () => {
      const customer = customerById(form.elements.insured_id.value);
      if (!customer) return;
      fillPerson(form, "insured", selectedCustomerSnapshot(customer));
      if (!form.elements.risk_street.value) form.elements.risk_street.value = customer.street || "";
      if (!form.elements.risk_number.value) form.elements.risk_number.value = customer.streetNumber || "";
      if (!form.elements.risk_area.value) form.elements.risk_area.value = customer.area || "";
      if (!form.elements.risk_postal.value) form.elements.risk_postal.value = customer.postalCode || "";
      if (form.elements.policyholder_same.checked) toggleSamePerson(form, "policyholder", true);
      if (form.elements.beneficiary_same.checked) toggleSamePerson(form, "beneficiary", true);
    });
    form.elements.policyholder_same.addEventListener("change", () => toggleSamePerson(form, "policyholder", form.elements.policyholder_same.checked));
    form.elements.beneficiary_same.addEventListener("change", () => toggleSamePerson(form, "beneficiary", form.elements.beneficiary_same.checked));
    form.elements.product_type.addEventListener("change", () => syncProductForm(form));
    form.elements.package_name.addEventListener("change", () => renderCoveragePreview(form));
    form.elements.earthquake_coverage.addEventListener("change", () => renderCoveragePreview(form));
    form.querySelector("#fireCancel").addEventListener("click", () => renderList());
    form.addEventListener("submit", event => {
      event.preventDefault();
      savePolicy(form, isExisting ? policy : null);
    });
  }

  function openForm(policyId = null) {
    if (!customers().length) {
      alert("Δημιούργησε πρώτα τον ασφαλιζόμενο στο CRM.");
      return;
    }
    activeMode = "form";
    editingPolicyId = policyId;
    const existing = firePolicies.find(policy => policy.id === policyId);
    const initialCustomer = existing ? customerById(existing.insuredId) : customers()[0];
    const policy = existing || sanitizePolicy({
      insuredId: initialCustomer?.id || "", insured: selectedCustomerSnapshot(initialCustomer),
      policyholderSame: true, beneficiarySame: true,
      risk: { street: initialCustomer?.street || "", streetNumber: initialCustomer?.streetNumber || "", area: initialCustomer?.area || "", postalCode: initialCustomer?.postalCode || "" }
    });
    setModalTitle(existing ? `Επεξεργασία ${existing.policyNumber}` : "Νέο συμβόλαιο Πυρός");
    document.getElementById("fireModalBody").innerHTML = policyForm(policy);
    bindForm(policy, Boolean(existing));
    resetFireBodyScroll();
  }

  async function savePolicy(form, existing) {
    const data = new FormData(form);
    const insuredId = String(data.get("insured_id") || "");
    const customer = customerById(insuredId);
    const insured = personFromForm(data, "insured");
    const policyholderSame = data.has("policyholder_same");
    const beneficiarySame = data.has("beneficiary_same");
    const policy = sanitizePolicy({
      id: existing?.id || uid(), insuredId, policyNumber: String(data.get("policy_number") || "").trim(), insured,
      policyholderSame, policyholder: policyholderSame ? { ...insured } : personFromForm(data, "policyholder"),
      beneficiarySame, beneficiary: beneficiarySame ? { ...insured } : personFromForm(data, "beneficiary"),
      productType: String(data.get("product_type") || "HOME"),
      productName: data.get("product_type") === "BUSINESS" ? "ΕΘΝΙΚΗ ΕΠΙΧΕΙΡΗΣΗ PLUS" : "FULL HOME",
      packageName: String(data.get("package_name") || ""), withDeductible: data.has("with_deductible"), earthquakeCoverage: data.has("earthquake_coverage"),
      startDate: String(data.get("start_date") || ""), installments: String(data.get("installments") || ""), grossPremium: String(data.get("gross_premium") || ""),
      risk: { street: String(data.get("risk_street") || "").trim(), streetNumber: String(data.get("risk_number") || "").trim(), area: String(data.get("risk_area") || "").trim(), postalCode: String(data.get("risk_postal") || "").trim(), additional: String(data.get("risk_additional") || "").trim() },
      property: { useType: data.get("product_type") === "BUSINESS" ? "ΕΠΙΧΕΙΡΗΣΗ" : String(data.get("use_type") || ""), residenceType: data.get("product_type") === "HOME" ? String(data.get("residence_type") || "") : "", ama: String(data.get("ama") || "").trim(), constructionYear: String(data.get("construction_year") || ""), mainArea: String(data.get("main_area") || ""), auxiliaryArea: String(data.get("auxiliary_area") || ""), roofConstruction: String(data.get("roof_construction") || "").trim(), buildingConstruction: String(data.get("building_construction") || "").trim(), floor: String(data.get("floor") || "").trim() },
      insuredItems: { building: String(data.get("building") || ""), contents: String(data.get("contents") || ""), buildingImprovements: String(data.get("building_improvements") || ""), alternativeEnergy: String(data.get("alternative_energy") || "") },
      notes: String(data.get("notes") || "").trim()
    });
    if (!customer || !policy.policyNumber) { alert("Επίλεξε ασφαλιζόμενο και συμπλήρωσε τον αριθμό συμβολαίου."); return; }
    for (const [label, person] of [["ασφαλιζόμενου", policy.insured], ["λήπτη", policy.policyholder], ["δικαιούχου", policy.beneficiary]]) {
      if (person.afm && !/^\d{9}$/.test(person.afm)) { alert(`Το ΑΦΜ ${label} πρέπει να έχει 9 ψηφία.`); return; }
    }
    if (policy.risk.postalCode && !/^\d{5}$/.test(policy.risk.postalCode)) { alert("Ο ΤΚ της τοποθεσίας κινδύνου πρέπει να έχει 5 ψηφία."); return; }
    const submit = form.querySelector("button[type='submit']");
    submit.disabled = true;
    try {
      const request = existing?.id
        ? client.from(TABLE).update(databaseRow(policy, false)).eq("id", existing.id)
        : client.from(TABLE).insert(databaseRow(policy, true));
      const { error } = await request;
      if (error) throw error;
      await loadPolicies();
      renderList();
    } catch (error) {
      alert(`Δεν αποθηκεύτηκε το συμβόλαιο Πυρός: ${error?.message || error}`);
    } finally {
      submit.disabled = false;
    }
  }

  async function deletePolicy(id) {
    const policy = firePolicies.find(item => item.id === id);
    if (!policy || !confirm(`Να διαγραφεί το συμβόλαιο Πυρός ${policy.policyNumber};`)) return;
    const { error } = await client.from(TABLE).delete().eq("id", id);
    if (error) { alert(error.message || "Δεν ολοκληρώθηκε η διαγραφή."); return; }
    await loadPolicies();
    renderList();
  }

  const FIRE_EXCEL_HEADERS = {
    insuredName: ["ονομ μο ασφ μενου", "ονομ μο ασφαλισμενου", "ονοματεπωνυμο ασφαλισμενου", "επωνυμια ασφαλισμενου"],
    product: ["προιον"],
    policyNumber: ["συμβολαιο", "αριθμος συμβολαιου"],
    startDate: ["εναρξη σ λ", "εναρξη συμβολαιου", "ημερομηνια εναρξης"],
    installments: ["δοσεις"],
    grossPremium: ["ολικα", "ολικα ασφαλιστρα"],
    riskLocation: ["τοποθεσια κινδ", "τοποθεσια κινδυνου"],
    postalCode: ["τ κ", "τκ", "ταχυδρομικος κωδικας"]
  };

  function excelHeaderKey(value) {
    return normalize(value).replace(/[^a-z0-9α-ω]+/gi, " ").replace(/\s+/g, " ").trim();
  }

  function excelHasValue(value) {
    return value !== null && value !== undefined && String(value).trim() !== "";
  }

  function excelDate(value, rowNumber) {
    if (value instanceof Date && Number.isFinite(value.getTime())) return value.toISOString().slice(0, 10);
    if (typeof value === "number" || /^\d+(\.\d+)?$/.test(String(value || "").trim())) {
      const serial = Number(value);
      if (serial > 20000 && serial < 80000) {
        return new Date(Date.UTC(1899, 11, 30) + Math.round(serial) * 86400000).toISOString().slice(0, 10);
      }
    }
    const text = String(value || "").trim();
    const isoDate = text.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T\s].*)?$/);
    if (isoDate) return `${isoDate[1]}-${isoDate[2]}-${isoDate[3]}`;
    const greekDate = text.match(/^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{4})$/);
    if (greekDate) return `${greekDate[3]}-${greekDate[2].padStart(2, "0")}-${greekDate[1].padStart(2, "0")}`;
    throw new Error(`Γραμμή ${rowNumber}: μη έγκυρη ημερομηνία έναρξης.`);
  }

  function excelNumber(value, rowNumber, label, { integer = false, min = 0, max = Number.MAX_SAFE_INTEGER } = {}) {
    let number = value;
    if (typeof number !== "number") {
      let text = String(number || "").trim().replace(/\s/g, "").replace(/€/g, "");
      if (text.includes(",")) text = text.replace(/\./g, "").replace(",", ".");
      number = Number(text);
    }
    if (!Number.isFinite(number) || number < min || number > max || (integer && !Number.isInteger(number))) {
      throw new Error(`Γραμμή ${rowNumber}: μη έγκυρη τιμή στο πεδίο «${label}».`);
    }
    return number;
  }

  function excelPostalCode(value, rowNumber) {
    const text = String(value ?? "").trim().replace(/\.0$/, "").replace(/\s/g, "");
    if (!/^\d{5}$/.test(text)) throw new Error(`Γραμμή ${rowNumber}: ο Τ.Κ. πρέπει να έχει 5 ψηφία.`);
    return text;
  }

  function findFireExcelHeader(rows) {
    for (let rowIndex = 0; rowIndex < Math.min(rows.length, 20); rowIndex += 1) {
      const row = Array.isArray(rows[rowIndex]) ? rows[rowIndex] : [];
      const normalizedIndexes = new Map(row.map((value, index) => [excelHeaderKey(value), index]));
      const indexes = {};
      let complete = true;
      Object.entries(FIRE_EXCEL_HEADERS).forEach(([field, aliases]) => {
        const alias = aliases.find(candidate => normalizedIndexes.has(candidate));
        if (!alias) complete = false;
        else indexes[field] = normalizedIndexes.get(alias);
      });
      if (complete) return { rowIndex, indexes };
    }
    throw new Error("Δεν βρέθηκαν οι 8 αναμενόμενες στήλες του χαρτοφυλακίου Πυρός.");
  }

  function parseFireExcelRows(rows) {
    if (!Array.isArray(rows) || !rows.length) throw new Error("Το Excel δεν περιέχει δεδομένα.");
    const { rowIndex, indexes } = findFireExcelHeader(rows);
    const records = [];
    const errors = [];
    const seenPolicyNumbers = new Set();

    rows.slice(rowIndex + 1).forEach((row, offset) => {
      if (!Array.isArray(row) || !row.some(excelHasValue)) return;
      const rowNumber = rowIndex + offset + 2;
      try {
        const insuredName = String(row[indexes.insuredName] || "").trim();
        const product = String(row[indexes.product] || "").trim();
        const policyNumber = String(row[indexes.policyNumber] || "").trim();
        const riskLocation = String(row[indexes.riskLocation] || "").trim();
        if (!insuredName || !product || !policyNumber || !riskLocation) {
          throw new Error(`Γραμμή ${rowNumber}: λείπει ασφαλιζόμενος, προϊόν, συμβόλαιο ή τοποθεσία κινδύνου.`);
        }
        const policyKey = normalize(policyNumber).replace(/\s/g, "");
        if (seenPolicyNumbers.has(policyKey)) throw new Error(`Γραμμή ${rowNumber}: το συμβόλαιο ${policyNumber} υπάρχει δύο φορές στο Excel.`);
        seenPolicyNumbers.add(policyKey);
        records.push({
          rowNumber,
          insuredName,
          product,
          policyNumber,
          policyKey,
          startDate: excelDate(row[indexes.startDate], rowNumber),
          installments: excelNumber(row[indexes.installments], rowNumber, "Δόσεις", { integer: true, min: 1, max: 12 }),
          grossPremium: excelNumber(row[indexes.grossPremium], rowNumber, "Ολικά", { min: 0 }),
          riskLocation,
          postalCode: excelPostalCode(row[indexes.postalCode], rowNumber)
        });
      } catch (error) {
        errors.push(error.message || String(error));
      }
    });

    if (errors.length) {
      const remaining = errors.length > 5 ? ` Επιπλέον σφάλματα: ${errors.length - 5}.` : "";
      throw new Error(`${errors.slice(0, 5).join(" ")}${remaining}`);
    }
    if (!records.length) throw new Error("Δεν βρέθηκε καμία εγγραφή συμβολαίου στο Excel.");
    return records;
  }

  function importedNameKey(value) {
    return excelHeaderKey(value);
  }

  function customerSearchKeys(customer) {
    const firstName = String(customer?.firstName || "").trim();
    const lastName = String(customer?.lastName || "").trim();
    const company = String(customer?.company || "").trim();
    const values = company
      ? [company]
      : [customerName(customer), [firstName, lastName].filter(Boolean).join(" "), [lastName, firstName].filter(Boolean).join(" ")];
    if (!firstName && lastName) values.push(lastName);
    return new Set(values.map(importedNameKey).filter(Boolean));
  }

  function findUniqueCustomer(importedName) {
    const key = importedNameKey(importedName);
    const exactMatches = customers().filter(customer => customerSearchKeys(customer).has(key));
    if (exactMatches.length === 1) return exactMatches[0];
    if (exactMatches.length > 1) return null;

    const importedTokens = new Set(key.split(" ").filter(token => token.length > 1));
    const personMatches = customers().filter(customer => {
      if (customer.company || !customer.firstName || !customer.lastName) return false;
      const customerTokens = importedNameKey(`${customer.firstName} ${customer.lastName}`).split(" ").filter(token => token.length > 1);
      return customerTokens.length >= 2 && customerTokens.every(token => importedTokens.has(token));
    });
    return personMatches.length === 1 ? personMatches[0] : null;
  }

  function importedProduct(product) {
    const normalized = normalize(product);
    const productType = normalized.includes("επιχειρηση") || normalized.includes("ενοικιαζομενα")
      ? "BUSINESS"
      : "HOME";
    return { productType, productName: String(product || "").trim().toLocaleUpperCase("el-GR") };
  }

  function importedCustomerRow(plan) {
    return {
      id: plan.id,
      owner_id: ownerId,
      first_name: null,
      last_name: plan.name,
      company: null,
      phone: null,
      email: null,
      afm: null,
      birth_date: null,
      dou: null,
      adt: null,
      street: null,
      street_number: null,
      area: null,
      postal_code: null,
      notes: "Δημιουργήθηκε από εισαγωγή χαρτοφυλακίου Πυρός."
    };
  }

  function customerSnapshotForImport(customer, importedName) {
    return {
      name: importedName,
      afm: customer?.afm || "",
      phone: customer?.phone || "",
      email: customer?.email || ""
    };
  }

  function policyFromImport(record, customer, existing = null) {
    const product = importedProduct(record.product);
    const previous = existing ? sanitizePolicy(existing) : null;
    const insured = previous
      ? { ...customerSnapshotForImport(customer, record.insuredName), ...previous.insured, name: record.insuredName }
      : customerSnapshotForImport(customer, record.insuredName);
    return sanitizePolicy({
      ...(previous || {}),
      id: previous?.id || uid(),
      insuredId: previous?.insuredId || customer.id,
      policyNumber: record.policyNumber,
      insured,
      policyholderSame: previous?.policyholderSame ?? true,
      policyholder: previous?.policyholder || { ...insured },
      beneficiarySame: previous?.beneficiarySame ?? true,
      beneficiary: previous?.beneficiary || { ...insured },
      productType: product.productType,
      productName: product.productName,
      packageName: previous?.packageName ?? "",
      withDeductible: previous?.withDeductible ?? false,
      earthquakeCoverage: previous?.earthquakeCoverage ?? false,
      startDate: record.startDate,
      installments: String(record.installments),
      grossPremium: String(record.grossPremium),
      risk: {
        ...(previous?.risk || {}),
        street: record.riskLocation,
        postalCode: record.postalCode
      },
      property: {
        ...(previous?.property || {}),
        useType: product.productType === "BUSINESS" ? "ΕΠΙΧΕΙΡΗΣΗ" : (previous?.property?.useType || "")
      }
    });
  }

  async function rollbackFireImport(insertedPolicyIds, updatedPolicies, insertedCustomerIds) {
    for (const policy of [...updatedPolicies].reverse()) {
      await client.from(TABLE).update(databaseRow(policy, false)).eq("id", policy.id);
    }
    if (insertedPolicyIds.length) await client.from(TABLE).delete().in("id", insertedPolicyIds);
    if (insertedCustomerIds.length) await client.from("insureds").delete().in("id", insertedCustomerIds);
  }

  async function importFireExcel(event) {
    const input = event.target;
    const file = input.files?.[0];
    if (!file) return;
    let insertedPolicyIds = [];
    let insertedCustomerIds = [];
    const updatedPolicies = [];

    try {
      if (!window.TsertosXlsx?.readFirstSheet) throw new Error("Δεν φορτώθηκε ο αναγνώστης Excel.");
      const rows = await window.TsertosXlsx.readFirstSheet(file);
      const records = parseFireExcelRows(rows);
      const existingPolicyMap = new Map();
      firePolicies.forEach(policy => {
        const key = normalize(policy.policyNumber).replace(/\s/g, "");
        if (!existingPolicyMap.has(key)) existingPolicyMap.set(key, []);
        existingPolicyMap.get(key).push(policy);
      });
      const ambiguousPolicy = records.find(record => (existingPolicyMap.get(record.policyKey) || []).length > 1);
      if (ambiguousPolicy) throw new Error(`Το συμβόλαιο ${ambiguousPolicy.policyNumber} υπάρχει περισσότερες από μία φορές στη βάση.`);

      const newCustomerPlans = new Map();
      let matchedExistingCustomers = 0;
      let updateCount = 0;
      records.forEach(record => {
        const existing = (existingPolicyMap.get(record.policyKey) || [])[0] || null;
        if (existing) {
          record.existingPolicy = existing;
          record.customer = customerById(existing.insuredId) || { id: existing.insuredId, lastName: existing.insured.name };
          updateCount += 1;
          return;
        }
        const nameKey = importedNameKey(record.insuredName);
        let plan = newCustomerPlans.get(nameKey);
        if (!plan) {
          const match = findUniqueCustomer(record.insuredName);
          plan = match
            ? { id: match.id, name: record.insuredName, customer: match, isNew: false }
            : { id: uid(), name: record.insuredName, customer: { id: "", firstName: "", lastName: record.insuredName, company: "", phone: "", email: "", afm: "" }, isNew: true };
          plan.customer.id = plan.id;
          newCustomerPlans.set(nameKey, plan);
          if (!plan.isNew) matchedExistingCustomers += 1;
        }
        record.customer = plan.customer;
      });

      const customersToInsert = [...newCustomerPlans.values()].filter(plan => plan.isNew);
      const insertCount = records.length - updateCount;
      const confirmed = window.confirm(
        `Βρέθηκαν ${records.length} συμβόλαια Πυρός.\n\n` +
        `Νέα συμβόλαια: ${insertCount}\n` +
        `Ενημερώσεις υπαρχόντων: ${updateCount}\n` +
        `Νέοι ασφαλιζόμενοι: ${customersToInsert.length}\n` +
        `Αντιστοιχίσεις με υπάρχον CRM: ${matchedExistingCustomers}\n\n` +
        "Το πακέτο και η ένδειξη απαλλαγών θα μείνουν χωρίς επιλογή, επειδή δεν υπάρχουν στο Excel. Να συνεχίσω;"
      );
      if (!confirmed) return;

      document.getElementById("fireModalBody").innerHTML = '<div class="fire-empty"><strong>Εισαγωγή χαρτοφυλακίου Πυρός…</strong><span>Τα δεδομένα αποθηκεύονται στην τοπική βάση.</span></div>';
      const customerRows = customersToInsert.map(importedCustomerRow);
      for (let index = 0; index < customerRows.length; index += 75) {
        const batch = customerRows.slice(index, index + 75);
        const result = await client.from("insureds").insert(batch);
        if (result.error) throw result.error;
        insertedCustomerIds.push(...batch.map(row => row.id));
      }

      const policiesToInsert = [];
      const policiesToUpdate = [];
      records.forEach(record => {
        const policy = policyFromImport(record, record.customer, record.existingPolicy);
        if (record.existingPolicy) policiesToUpdate.push({ policy, previous: record.existingPolicy });
        else policiesToInsert.push(policy);
      });

      for (let index = 0; index < policiesToInsert.length; index += 75) {
        const batch = policiesToInsert.slice(index, index + 75);
        const result = await client.from(TABLE).insert(batch.map(policy => databaseRow(policy, true)));
        if (result.error) throw result.error;
        insertedPolicyIds.push(...batch.map(policy => policy.id));
      }
      for (const item of policiesToUpdate) {
        const result = await client.from(TABLE).update(databaseRow(item.policy, false)).eq("id", item.policy.id);
        if (result.error) throw result.error;
        updatedPolicies.push(item.previous);
      }

      if (window.TSERTOS_CRM_FORMS_API?.refreshCustomers) {
        await window.TSERTOS_CRM_FORMS_API.refreshCustomers();
      }
      await loadPolicies();
      importNotice = {
        type: "success",
        title: "Η εισαγωγή Excel ολοκληρώθηκε",
        text: `${insertCount} νέα συμβόλαια, ${updateCount} ενημερώσεις και ${customersToInsert.length} νέοι ασφαλιζόμενοι. Σύνολο Πυρός: ${firePolicies.length}.`
      };
      renderList();
    } catch (error) {
      console.error(error);
      if (insertedPolicyIds.length || updatedPolicies.length || insertedCustomerIds.length) {
        try {
          await rollbackFireImport(insertedPolicyIds, updatedPolicies, insertedCustomerIds);
          if (window.TSERTOS_CRM_FORMS_API?.refreshCustomers) await window.TSERTOS_CRM_FORMS_API.refreshCustomers();
          await loadPolicies();
        } catch (rollbackError) {
          console.error("Fire Excel rollback failed", rollbackError);
        }
      }
      importNotice = { type: "error", title: "Η εισαγωγή δεν ολοκληρώθηκε", text: error?.message || String(error) };
      renderList();
    } finally {
      input.value = "";
    }
  }

  async function enhancedBackup(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    const receiptResult = await client.from("payment_receipts").select("*");
    const payload = {
      app: "Προσωπικό Χαρτοφυλάκιο", version: 9, crmVersion: VERSION, exportedAt: new Date().toISOString(),
      customers: customers(), autoPolicies: autos(), paymentReceipts: receiptResult.data || [], firePolicies
    };
    const text = JSON.stringify(payload, null, 2);
    const name = `portfolio-backup-${new Date().toISOString().slice(0,10)}.json`;
    if (window.AndroidBridge?.saveTextFile) window.AndroidBridge.saveTextFile(name, text);
    else {
      const url = URL.createObjectURL(new Blob([text], { type: "application/json" }));
      const anchor = document.createElement("a"); anchor.href = url; anchor.download = name; anchor.click(); URL.revokeObjectURL(url);
    }
  }

  async function initialize() {
    if (!window.createLocalSupabaseClient || !window.TSERTOS_CRM_FORMS_API) return;
    injectStyles();
    injectShell();
    injectNavigation();
    client = window.createLocalSupabaseClient();
    const session = await client.auth.getSession();
    ownerId = session?.data?.session?.user?.id || LOCAL_OWNER_ID;
    await loadPolicies();
    document.getElementById("exportBtn")?.addEventListener("click", enhancedBackup, true);
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && modal && !modal.classList.contains("hidden")) closeModal();
    });
    observer = new MutationObserver(() => { injectNavigation(); updateCounters(); });
    observer.observe(document.getElementById("appShell") || document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => initialize().catch(console.error));
  else initialize().catch(console.error);
})();
