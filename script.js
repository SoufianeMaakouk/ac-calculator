const API = "https://ac-calculator-backend.onrender.com";
const token = localStorage.getItem("token");
let rooms = [];
let lastCalculation = null;

/* ================= HELPERS ================= */

function el(id) {
  return document.getElementById(id);
}

/* ================= AUTH GUARD ================= */

if (!token && location.pathname.includes("dashboard")) {
  location.href = "login.html";
}

/* ================= LOGOUT ================= */

if (el("logoutBtn")) {
  el("logoutBtn").onclick = () => {
    localStorage.removeItem("token");
    location.href = "login.html";
  };
}

/* ================= PROJECT ================= */

function newProject() {
  rooms = [];
  lastCalculation = null;
  el("rooms").innerHTML = "";
  el("summary").classList.add("hidden");
  el("projectName").value = "";
}

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

/* ================= UI ================= */

function renderRooms() {
  if (!el("rooms")) return;
  el("rooms").innerHTML = "";

  rooms.forEach((r, i) => {
    el("rooms").innerHTML += `
      <div class="room">
        <h4>Room ${i + 1}</h4>

        <label>Area (m²)</label>
        <input type="number" value="${r.area}"
          onchange="rooms[${i}].area=this.valueAsNumber">

        <label>Ceiling height (m)</label>
        <input type="number" step="0.1" value="${r.ceilingHeight}"
          onchange="rooms[${i}].ceilingHeight=this.valueAsNumber">

        <label>Room type</label>
        <select onchange="rooms[${i}].type=this.value">
          <option value="bedroom" ${r.type === "bedroom" ? "selected" : ""}>Bedroom</option>
          <option value="living" ${r.type === "living" ? "selected" : ""}>Living Room</option>
          <option value="kitchen" ${r.type === "kitchen" ? "selected" : ""}>Kitchen</option>
        </select>

        <label>Sun exposure</label>
        <select onchange="rooms[${i}].sun=this.value">
          <option value="low" ${r.sun === "low" ? "selected" : ""}>Low</option>
          <option value="medium" ${r.sun === "medium" ? "selected" : ""}>Medium</option>
          <option value="high" ${r.sun === "high" ? "selected" : ""}>High</option>
        </select>

        <label>Distance (m)</label>
        <input type="number" value="${r.distance}"
          onchange="rooms[${i}].distance=this.valueAsNumber">

        <button onclick="removeRoom(${i})">❌ Remove</button>
      </div>
    `;
  });
}

/* ================= CALCULATION ================= */

function calculateRoomBTU(room) {
  let btu = room.area * 600;

  // Ceiling height
  if (room.ceilingHeight > 2.7) btu *= 1.1;

  // Room type
  if (room.type === "living") btu *= 1.1;
  if (room.type === "kitchen") btu *= 1.2;

  // Sun exposure
  if (room.sun === "medium") btu *= 1.1;
  if (room.sun === "high") btu *= 1.2;

  // Distance penalty
  if (room.distance > 5) btu *= 1.05;

  return Math.round(btu);
}

function calculate() {
  if (rooms.length === 0) return alert("Add at least one room");

  let totalBTU = 0;
  rooms.forEach(r => totalBTU += calculateRoomBTU(r));

  let system = "Single Split";
  if (rooms.length > 1 && totalBTU > 24000) system = "Multi Split";
  if (totalBTU > 36000) system = "VRF System";

  lastCalculation = { totalBTU, system };

  el("summary").classList.remove("hidden");
  el("summary").innerHTML = `
    <h3>System Recommendation</h3>
    <p><strong>${system}</strong></p>
    <h3>Total Capacity</h3>
    <p><strong>${totalBTU} BTU</strong></p>
  `;
}

/* ================= SAVE / LOAD ================= */

async function saveProject() {
  if (!window.lastCalculation) return alert("Calculate first!");

  const projectName = document.getElementById("projectName").value || "Untitled Project";

  try {
    const res = await fetch("https://ac-calculator-backend.onrender.com/project/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`  // <--- make sure token is here
      },
      body: JSON.stringify({
        projectName,
        rooms,
        totalBTU: window.lastCalculation.totalBTU,
        totalMaterials: window.lastCalculation.totalMaterials,
        systemRecommendation: window.lastCalculation.systemRecommendation
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


/* ================= INIT ================= */

if (token) loadSavedProjects();
