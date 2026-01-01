let token = localStorage.getItem("token") || null;
let rooms = [];
let language = "en";

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
    export: "Export PDF"
  },
  fr: {
    loginTitle: "Calculateur de climatisation",
    email: "Email",
    password: "Mot de passe",
    login: "Connexion",
    register: "S'inscrire",
    projectName: "Nom du projet",
    addRoom: "➕ Ajouter pièce",
    calculateProject: "Calculer le projet",
    saveProject: "💾 Enregistrer le projet",
    savedProjects: "Projets enregistrés",
    type: "Type",
    sun: "Soleil",
    area: "Surface (m²)",
    distance: "Distance (m)",
    ceiling: "Hauteur plafond",
    remove: "Supprimer",
    system: "Système recommandé",
    totalBTU: "BTU total",
    export: "Exporter PDF"
  },
  ar: {
    loginTitle: "حاسبة مواد التكييف",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    login: "تسجيل الدخول",
    register: "تسجيل",
    projectName: "اسم المشروع",
    addRoom: "➕ إضافة غرفة",
    calculateProject: "حساب المشروع",
    saveProject: "💾 حفظ المشروع",
    savedProjects: "المشاريع المحفوظة",
    type: "النوع",
    sun: "التعرض للشمس",
    area: "المساحة (م²)",
    distance: "المسافة (م)",
    ceiling: "ارتفاع السقف",
    remove: "حذف",
    system: "نظام موصى به",
    totalBTU: "مجموع BTU",
    export: "تصدير PDF"
  }
};

// ===== Helper to translate UI =====
function translateUI() {
  const t = translations[language];
  document.getElementById("title").textContent = t.loginTitle;
  document.getElementById("email").placeholder = t.email;
  document.getElementById("password").placeholder = t.password;
  document.getElementById("projectName").placeholder = t.projectName;
  document.getElementById("addRoomBtn").textContent = t.addRoom;
  document.getElementById("calculateBtn").textContent = t.calculateProject;
  document.getElementById("saveProjectBtn").textContent = t.saveProject;
}

// ===== Handle language change =====
document.getElementById("languageSelect").addEventListener("change", e => {
  language = e.target.value;
  document.body.dir = language === "ar" ? "rtl" : "ltr";
  translateUI();
});
translateUI();

// ===== Login / Register =====
document.getElementById("loginBtn").addEventListener("click", login);
document.getElementById("registerBtn").addEventListener("click", register);

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const res = await fetch("https://ac-calculator-backend.onrender.com/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (data.token) {
    token = data.token;
    localStorage.setItem("token", token);
    showDashboard();
  } else {
    alert(data.message);
  }
}

async function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const res = await fetch("https://ac-calculator-backend.onrender.com/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  alert(data.message);
}

// ===== Show Dashboard =====
function showDashboard() {
  document.getElementById("loginDiv").classList.add("hidden");
  document.getElementById("dashboard").classList.remove("hidden");
  loadSavedProjects();
}

// ===== Add Room =====
document.getElementById("addRoomBtn").addEventListener("click", addRoom);

function addRoom() {
  const id = rooms.length;
  rooms.push({ area: 20, ceilingHeight: 2.6, type: "bedroom", sun: "low", distance: 5 });

  const t = translations[language];
  const div = document.createElement("div");
  div.className = "room";
  div.innerHTML = `
    <h4>${t.addRoom} ${id + 1}</h4>
    <input placeholder="${t.area}" onchange="rooms[${id}].area = +this.value" value="20" />
    <input placeholder="${t.ceiling}" onchange="rooms[${id}].ceilingHeight = +this.value" value="2.6" />
    <select onchange="rooms[${id}].type = this.value">
      <option value="bedroom">Bedroom</option>
      <option value="living">Living</option>
      <option value="kitchen">Kitchen</option>
    </select>
    <select onchange="rooms[${id}].sun = this.value">
      <option value="low">Low Sun</option>
      <option value="medium">Medium Sun</option>
      <option value="high">High Sun</option>
    </select>
    <input placeholder="${t.distance}" onchange="rooms[${id}].distance = +this.value" value="5" />
    <button onclick="removeRoom(${id})">${t.remove}</button>
  `;
  document.getElementById("rooms").appendChild(div);
}

function removeRoom(idx) {
  rooms.splice(idx, 1);
  document.getElementById("rooms").innerHTML = "";
  rooms.forEach((r, i) => addRoom());
}

// ===== Calculate Project =====
document.getElementById("calculateBtn").addEventListener("click", calculate);

async function calculate() {
  const res = await fetch("https://ac-calculator-backend.onrender.com/project/calculate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rooms })
  });
  const data = await res.json();

  const t = translations[language];
  const summary = document.getElementById("summary");
  summary.classList.remove("hidden");
  summary.innerHTML = `
    <h3>${t.system}: ${data.systemRecommendation}</h3>
    <h3>${t.totalBTU}: ${data.totalBTU}</h3>
  `;

  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";
  data.rooms.forEach((r, idx) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h4>Room ${idx + 1}</h4>
      <p>${t.type}: ${r.type}</p>
      <p>${t.sun}: ${r.sun}</p>
      <p>${t.area}: ${r.area} m²</p>
      <p>${t.ceiling}: ${r.ceilingHeight} m</p>
      <p>${t.distance}: ${r.distance} m</p>
      <p>BTU: ${r.btu}</p>
      <p>Pipe: ${r.materials.pipeSize}</p>
    `;
    resultsDiv.appendChild(card);
  });

  // Store last calculation for saving
  window.lastCalculation = data;
}

// ===== Save Project =====
document.getElementById("saveProjectBtn").addEventListener("click", async () => {
  const projectName = document.getElementById("projectName").value || "Untitled Project";
  const data = window.lastCalculation;
  if (!data) return alert("Calculate first!");

  const res = await fetch("https://ac-calculator-backend.onrender.com/project/save", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
    body: JSON.stringify({
      projectName,
      rooms: rooms,
      totalBTU: data.totalBTU,
      totalMaterials: data.totalMaterials,
      systemRecommendation: data.systemRecommendation
    })
  });
  const result = await res.json();
  alert(result.message);
  loadSavedProjects();
});

// ===== Load Saved Projects =====
async function loadSavedProjects() {
  const res = await fetch("https://ac-calculator-backend.onrender.com/project/list", {
    headers: { "Authorization": `Bearer ${token}` }
  });
  const projects = await res.json();
  const t = translations[language];

  const container = document.getElementById("savedProjects");
  container.innerHTML = "";
  projects.forEach(p => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <h4>${p.projectName}</h4>
      <p>${t.totalBTU}: ${p.totalBTU}</p>
      <p>${t.system}: ${p.systemRecommendation}</p>
      <button onclick="exportPDF('${p._id}')">${t.export}</button>
    `;
    container.appendChild(div);
  });
}

// ===== Export PDF =====
function exportPDF(id) {
  window.open(`https://ac-calculator-backend.onrender.com/project/export/${id}?token=${token}`, "_blank");
}

// ===== Auto-show dashboard if logged in =====
if (token) showDashboard();
