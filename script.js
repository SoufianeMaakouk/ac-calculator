// ================= GLOBALS =================
let token = localStorage.getItem("token") || null;
let rooms = [];
let language = "en";
let lastCalculation = null;

// ================= TRANSLATIONS =================
const translations = {
  en: {
    loginTitle: "AC Installer Dashboard",
    email: "Email",
    password: "Password",
    login: "Login",
    register: "Register",
    projectName: "Project Name",
    addRoom: "➕ Add Room",
    calculateProject: "Calculate",
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
    high: "High Sun",
    logout: "Logout"
  },
  fr: {
    loginTitle: "Tableau de l'installateur AC",
    email: "Email",
    password: "Mot de passe",
    login: "Connexion",
    register: "S'inscrire",
    projectName: "Nom du projet",
    addRoom: "➕ Ajouter pièce",
    calculateProject: "Calculer",
    saveProject: "💾 Enregistrer",
    savedProjects: "Projets enregistrés",
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
    high: "Fort",
    logout: "Déconnexion"
  },
  ar: {
    loginTitle: "لوحة التثبيت لمكيف الهواء",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    login: "تسجيل الدخول",
    register: "تسجيل",
    projectName: "اسم المشروع",
    addRoom: "➕ إضافة غرفة",
    calculateProject: "احسب",
    saveProject: "💾 حفظ",
    savedProjects: "المشاريع المحفوظة",
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
    high: "قوي",
    logout: "تسجيل الخروج"
  }
};

// ================= HELPERS =================
function el(id) { return document.getElementById(id); }

function translateUI() {
  const t = translations[language];
  document.body.dir = language === "ar" ? "rtl" : "ltr";

  if (el("title")) el("title").textContent = t.loginTitle;
  if (el("projectName")) el("projectName").placeholder = t.projectName;
  if (el("addRoomBtn")) el("addRoomBtn").textContent = t.addRoom;
  if (el("calculateBtn")) el("calculateBtn").textContent = t.calculateProject;
  if (el("saveProjectBtn")) el("saveProjectBtn").textContent = t.saveProject;
  if (el("logoutBtn")) el("logoutBtn").textContent = t.logout;

  renderRooms();
}

// ================= LANGUAGE SELECT =================
if (el("languageSelect")) {
  el("languageSelect").addEventListener("change", e => {
    language = e.target.value;
    translateUI();
  });
}
translateUI();

// ================= LOGOUT =================
if (el("logoutBtn")) {
  el("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("token");
    token = null;
    location.href = "login.html";
  });
}

// ================= ROOMS =================
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

// ================= CALCULATE =================
async function calculate() {
  if (!rooms.length) return alert("Add at least one room!");

  try {
    const res = await fetch("https://ac-calculator-backend.onrender.com/project/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rooms })
    });
    const data = await res.json();
    lastCalculation = data;

    el("summary").classList.remove("hidden");
    el("summary").innerHTML = `
      <h3>${translations[language].system}: ${data.systemRecommendation}</h3>
      <h3>${translations[language].totalBTU}: ${data.totalBTU}</h3>
      <button id="saveProjectBtn">${translations[language].saveProject}</button>
      <button onclick="exportPDF()">${translations[language].export}</button>
    `;

    if (el("saveProjectBtn")) el("saveProjectBtn").addEventListener("click", saveProject);

  } catch (err) {
    alert("Calculation failed: " + err.message);
  }
}

// ================= SAVE PROJECT =================
async function saveProject() {
  if (!lastCalculation) return alert("Calculate first!");
  if (!token) return alert("You must login first!");

  try {
    const res = await fetch("https://ac-calculator-backend.onrender.com/project/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        projectName: el("projectName").value || "Untitled Project",
        rooms,
        totalBTU: lastCalculation.totalBTU,
        totalMaterials: lastCalculation.totalMaterials,
        systemRecommendation: lastCalculation.systemRecommendation
      })
    });

    const data = await res.json();
    if (res.ok) {
      alert("Project saved successfully!");
      loadSavedProjects();
    } else {
      alert("Save failed: " + data.message);
    }
  } catch (err) {
    alert("Save failed: " + err.message);
  }
}

// ================= LOAD PROJECTS =================
async function loadSavedProjects() {
  if (!el("savedProjects")) return;
  if (!token) return;

  try {
    const res = await fetch("https://ac-calculator-backend.onrender.com/project/list", {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const projects = await res.json();
    const t = translations[language];

    el("savedProjects").innerHTML = projects.map(p => `
      <div class="card">
        <h4>${p.projectName}</h4>
        <p>${t.totalBTU}: ${p.totalBTU}</p>
        <p>${t.system}: ${p.systemRecommendation}</p>
        <button onclick="exportPDF('${p._id}')">${t.export}</button>
      </div>
    `).join("");
  } catch (err) {
    console.error(err);
  }
}

// ================= EXPORT PDF =================
function exportPDF(id) {
  if (!id) return alert("Project ID missing");
  window.open(`https://ac-calculator-backend.onrender.com/project/export/${id}?token=${token}`);
}

// ================= INIT =================
if (token) loadSavedProjects();
