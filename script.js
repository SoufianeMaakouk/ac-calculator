const API = "https://ac-calculator-backend.onrender.com";

/* ================= AUTH GUARD ================= */
const token = localStorage.getItem("token");
if (!token) location.href = "login.html";

/* ================= GLOBALS ================= */
let rooms = [];
let lastCalculation = null;
let language = "en";

/* ================= TRANSLATIONS ================= */
const translations = {
  en: {
    title: "AC Installer Dashboard",
    projectName: "Project Name",
    addRoom: "➕ Add Room",
    calculate: "Calculate",
    system: "System Recommendation",
    totalBTU: "Total BTU",
    save: "💾 Save Project",
    export: "Export PDF",
    logout: "Logout"
  },
  fr: {
    title: "Tableau installateur AC",
    projectName: "Nom du projet",
    addRoom: "➕ Ajouter pièce",
    calculate: "Calculer",
    system: "Système recommandé",
    totalBTU: "BTU total",
    save: "💾 Enregistrer",
    export: "Exporter PDF",
    logout: "Déconnexion"
  },
  ar: {
    title: "لوحة التثبيت",
    projectName: "اسم المشروع",
    addRoom: "➕ إضافة غرفة",
    calculate: "احسب",
    system: "النظام المقترح",
    totalBTU: "مجموع BTU",
    save: "💾 حفظ",
    export: "تصدير PDF",
    logout: "خروج"
  }
};

/* ================= HELPERS ================= */
const el = id => document.getElementById(id);

/* ================= LANGUAGE ================= */
el("languageSelect").onchange = e => {
  language = e.target.value;
  translate();
};

function translate() {
  const t = translations[language];
  document.body.dir = language === "ar" ? "rtl" : "ltr";
  el("title").textContent = t.title;
  el("projectName").placeholder = t.projectName;
  el("addRoomBtn").textContent = t.addRoom;
  el("calculateBtn").textContent = t.calculate;
  el("logoutBtn").textContent = t.logout;
}
translate();

/* ================= LOGOUT ================= */
el("logoutBtn").onclick = () => {
  localStorage.removeItem("token");
  location.href = "login.html";
};

/* ================= ROOMS ================= */
el("addRoomBtn").onclick = () => {
  rooms.push({ area: 20 });
  renderRooms();
};

function renderRooms() {
  el("rooms").innerHTML = rooms.map((r, i) => `
    <div class="room">
      <h4>Room ${i + 1}</h4>
      <input type="number" value="${r.area}" onchange="rooms[${i}].area=this.valueAsNumber">
    </div>
  `).join("");
}

/* ================= CALCULATE ================= */
el("calculateBtn").onclick = async () => {
  const res = await fetch(`${API}/project/calculate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rooms })
  });

  lastCalculation = await res.json();
  el("summary").classList.remove("hidden");
  el("summary").innerHTML = `
    <h3>${translations[language].system}: ${lastCalculation.systemRecommendation}</h3>
    <h3>${translations[language].totalBTU}: ${lastCalculation.totalBTU}</h3>
    <button onclick="saveProject()">${translations[language].save}</button>
  `;
};

/* ================= SAVE ================= */
async function saveProject() {
  await fetch(`${API}/project/save`, {
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

  loadProjects();
}

/* ================= LOAD ================= */
async function loadProjects() {
  const res = await fetch(`${API}/project/list`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const projects = await res.json();
  el("savedProjects").innerHTML = projects.map(p => `
    <div class="card">
      <h4>${p.projectName}</h4>
      <p>${p.totalBTU} BTU</p>
      <button onclick="window.open('${API}/project/export/${p._id}?token=${token}')">PDF</button>
    </div>
  `).join("");
}

loadProjects();
