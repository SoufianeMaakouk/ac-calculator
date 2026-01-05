const API = "https://ac-calculator-backend.onrender.com";
const token = localStorage.getItem("token");

function el(id) {
  return document.getElementById(id);
}

/* 🔒 PROTECT DASHBOARD */
if (!token) {
  location.href = "login.html";
}

/* 🚪 LOGOUT */
el("logoutBtn").onclick = () => {
  localStorage.removeItem("token");
  location.href = "login.html";
};

let rooms = [];

/* ➕ NEW PROJECT (FIXED STUCK ISSUE) */
function newProject() {
  rooms = [];
  el("rooms").innerHTML = "";
  el("summary").classList.add("hidden");
  el("projectName").value = "";
}

/* 🏠 ADD ROOM */
function addRoom() {
  const room = { size: 20 };
  rooms.push(room);

  const div = document.createElement("div");
  div.className = "room";
  div.innerHTML = `
    <input type="number" value="20" onchange="updateRoom(${rooms.length - 1}, this.value)" />
    <span>m²</span>
  `;
  el("rooms").appendChild(div);
}

function updateRoom(index, value) {
  rooms[index].size = Number(value);
}

/* 🧮 CALCULATE */
function calculate() {
  let total = 0;
  rooms.forEach(r => total += r.size * 0.1);

  el("totalKw").innerText = total.toFixed(2) + " kW";
  el("summary").classList.remove("hidden");
}

/* 💾 SAVE PROJECT */
async function saveProject() {
  const name = el("projectName").value.trim();
  if (!name) return alert("Enter project name");

  const res = await fetch(`${API}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      name,
      rooms
    })
  });

  if (!res.ok) return alert("Save failed");

  loadSavedProjects();
}

/* 📂 LOAD PROJECTS */
async function loadSavedProjects() {
  const res = await fetch(`${API}/projects`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();

  el("savedProjects").innerHTML = "";
  data.forEach(p => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <strong>${p.name}</strong>
      <button onclick='loadProject(${JSON.stringify(p.rooms)})'>Open</button>
    `;
    el("savedProjects").appendChild(div);
  });
}

function loadProject(r) {
  newProject();
  r.forEach(room => {
    rooms.push(room);
    addRoom();
  });
}

/* 📄 EXPORT PDF */
function exportPDF() {
  alert("PDF export coming next step (backend ready)");
}

/* 🚀 AUTO LOAD */
loadSavedProjects();
