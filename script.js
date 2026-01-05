let token = localStorage.getItem("token");
let rooms = [];
let language = "en";

/* ================= TRANSLATIONS ================= */

const translations = {
  en: {
    loginTitle: "AC Material Calculator",
    email: "Email",
    password: "Password",
    login: "Login",
    register: "Register",
    projectName: "Project Name",
    addRoom: "➕ Add Room",
    calculateProject: "Calculate Project",
    saveProject: "💾 Save Project",
    savedProjects: "Saved Projects",
    type: "Type",
    sun: "Sun",
    area: "Area (m²)",
    distance: "Distance (m)",
    ceiling: "Ceiling height",
    remove: "Remove",
    system: "System Recommendation",
    totalBTU: "Total BTU",
    export: "Export PDF",
    bedroom: "Bedroom",
    living: "Living Room",
    kitchen: "Kitchen",
    low: "Low Sun",
    medium: "Medium Sun",
    high: "High Sun"
  },
  fr: {
    loginTitle: "Calculateur de climatisation",
    email: "Email",
    password: "Mot de passe",
    login: "Connexion",
    register: "S'inscrire",
    projectName: "Nom du projet",
    addRoom: "➕ Ajouter pièce",
    calculateProject: "Calculer",
    saveProject: "💾 Enregistrer",
    savedProjects: "Projets",
    type: "Type",
    sun: "Soleil",
    area: "Surface (m²)",
    distance: "Distance (m)",
    ceiling: "Hauteur plafond",
    remove: "Supprimer",
    system: "Système recommandé",
    totalBTU: "BTU total",
    export: "Exporter PDF",
    bedroom: "Chambre",
    living: "Salon",
    kitchen: "Cuisine",
    low: "Faible",
    medium: "Moyen",
    high: "Fort"
  },
  ar: {
    loginTitle: "حاسبة التكييف",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    login: "دخول",
    register: "تسجيل",
    projectName: "اسم المشروع",
    addRoom: "➕ إضافة غرفة",
    calculateProject: "احسب",
    saveProject: "💾 حفظ",
    savedProjects: "المشاريع",
    type: "النوع",
    sun: "الشمس",
    area: "المساحة (م²)",
    distance: "المسافة (م)",
    ceiling: "ارتفاع السقف",
    remove: "حذف",
    system: "النظام المقترح",
    totalBTU: "مجموع BTU",
    export: "تصدير PDF",
    bedroom: "غرفة نوم",
    living: "صالة",
    kitchen: "مطبخ",
    low: "ضعيف",
    medium: "متوسط",
    high: "قوي"
  }
};

/* ================= HELPERS ================= */

function el(id) {
  return document.getElementById(id);
}

function translateUI() {
  const t = translations[language];
  document.body.dir = language === "ar" ? "rtl" : "ltr";

  if (el("title")) el("title").textContent = t.loginTitle;
  if (el("email")) el("email").placeholder = t.email;
  if (el("password")) el("password").placeholder = t.password;
  if (el("projectName")) el("projectName").placeholder = t.projectName;
  if (el("addRoomBtn")) el("addRoomBtn").textContent = t.addRoom;
  if (el("calculateBtn")) el("calculateBtn").textContent = t.calculateProject;
  if (el("saveProjectBtn")) el("saveProjectBtn").textContent = t.saveProject;

  renderRooms();
}

/* ================= LANGUAGE ================= */

if (el("languageSelect")) {
  el("languageSelect").addEventListener("change", e => {
    language = e.target.value;
    translateUI();
  });
}

translateUI();

/* ================= AUTH ================= */

if (el("loginBtn")) el("loginBtn").onclick = login;
if (el("registerBtn")) el("registerBtn").onclick = register;

async function login() {
  const email = el("email").value;
  const password = el("password").value;

  const res = await fetch("https://ac-calculator-backend.onrender.com/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  if (data.token) {
    localStorage.setItem("token", data.token);
    location.href = "dashboard.html";
  } else alert(data.message);
}

async function register() {
  const email = el("email").value;
  const password = el("password").value;

  const res = await fetch("https://ac-calculator-backend.onrender.com/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  alert(data.message);
}

/* ================= DASHBOARD ================= */

if (el("addRoomBtn")) el("addRoomBtn").onclick = addRoom;
if (el("calculateBtn")) el("calculateBtn").onclick = calculate;
if (el("saveProjectBtn")) el("saveProjectBtn").onclick = saveProject;

function addRoom() {
  rooms.push({
    area: 20,
    ceilingHeight: 2.6,
    type: "bedroom",
    sun: "low",
    distance: 5
  });
  renderRooms();
}

function removeRoom(index) {
  rooms.splice(index, 1);
  renderRooms();
}

function renderRooms() {
  if (!el("rooms")) return;
  const t = translations[language];
  el("rooms").innerHTML = "";

  rooms.forEach((r, i) => {
    el("rooms").innerHTML += `
      <div class="room">
        <h4>${t.addRoom} ${i + 1}</h4>
        <input type="number" value="${r.area}" placeholder="${t.area}"
          onchange="rooms[${i}].area=this.valueAsNumber">
        <input type="number" value="${r.ceilingHeight}" placeholder="${t.ceiling}"
          onchange="rooms[${i}].ceilingHeight=this.valueAsNumber">
        <select onchange="rooms[${i}].type=this.value">
          <option value="bedroom">${t.bedroom}</option>
          <option value="living">${t.living}</option>
          <option value="kitchen">${t.kitchen}</option>
        </select>
        <select onchange="rooms[${i}].sun=this.value">
          <option value="low">${t.low}</option>
          <option value="medium">${t.medium}</option>
          <option value="high">${t.high}</option>
        </select>
        <input type="number" value="${r.distance}" placeholder="${t.distance}"
          onchange="rooms[${i}].distance=this.valueAsNumber">
        <button onclick="removeRoom(${i})">${t.remove}</button>
      </div>
    `;
  });
}

/* ================= CALCULATE ================= */

async function calculate() {
  const res = await fetch("https://ac-calculator-backend.onrender.com/project/calculate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rooms })
  });

  window.lastCalculation = await res.json();
  el("summary").classList.remove("hidden");

  el("summary").innerHTML = `
    <h3>${translations[language].system}: ${lastCalculation.systemRecommendation}</h3>
    <h3>${translations[language].totalBTU}: ${lastCalculation.totalBTU}</h3>
  `;
}

/* ================= SAVE & LOAD ================= */

async function saveProject() {
  if (!lastCalculation) return alert("Calculate first!");

  await fetch("https://ac-calculator-backend.onrender.com/project/save", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      projectName: el("projectName").value || "Untitled",
      rooms,
      ...lastCalculation
    })
  });

  loadSavedProjects();
}

async function loadSavedProjects() {
  if (!el("savedProjects")) return;

  const res = await fetch("https://ac-calculator-backend.onrender.com/project/list", {
    headers: { Authorization: `Bearer ${token}` }
  });

  const projects = await res.json();
  el("savedProjects").innerHTML = projects.map(p => `
    <div class="card">
      <h4>${p.projectName}</h4>
      <p>${translations[language].totalBTU}: ${p.totalBTU}</p>
      <button onclick="exportPDF('${p._id}')">${translations[language].export}</button>
    </div>
  `).join("");
}

function exportPDF(id) {
  window.open(`https://ac-calculator-backend.onrender.com/project/export/${id}?token=${token}`);
}

if (token && el("savedProjects")) loadSavedProjects();
