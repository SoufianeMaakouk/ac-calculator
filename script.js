let roomCount = 0;
let currentLang = "en";

// ===== LANGUAGE STRINGS =====
const LANG = {
  en: {
    title: "AC Material Calculator",
    addRoom: "➕ Add Room",
    calculate: "Calculate Project",
    area: "Area (m²)",
    distance: "Distance to outdoor unit (m)",
    roomType: "Room Type",
    sunExposure: "Sun Exposure",
    roomTypes: [
      { value: "bedroom", label: "Bedroom" },
      { value: "living", label: "Living Room" },
      { value: "kitchen", label: "Kitchen" }
    ],
    sunLevels: [
      { value: "low", label: "Low" },
      { value: "medium", label: "Medium" },
      { value: "high", label: "High" }
    ],
    summary: "Project Summary",
    totalBTU: "Total BTU Required",
    system: "Recommended System",
    copperPipe: "Copper Pipe",
    drainPipe: "Drain Pipe",
    cable: "Cable",
    alertAddRoom: "Please add at least one room with area"
  },
  fr: {
    title: "Calculateur de Matériel AC",
    addRoom: "➕ Ajouter une pièce",
    calculate: "Calculer le projet",
    area: "Surface (m²)",
    distance: "Distance vers unité extérieure (m)",
    roomType: "Type de pièce",
    sunExposure: "Exposition au soleil",
    roomTypes: [
      { value: "bedroom", label: "Chambre" },
      { value: "living", label: "Salon" },
      { value: "kitchen", label: "Cuisine" }
    ],
    sunLevels: [
      { value: "low", label: "Faible" },
      { value: "medium", label: "Moyenne" },
      { value: "high", label: "Élevée" }
    ],
    summary: "Résumé du projet",
    totalBTU: "BTU total requis",
    system: "Système recommandé",
    copperPipe: "Tuyau cuivre",
    drainPipe: "Tuyau d’évacuation",
    cable: "Câble",
    alertAddRoom: "Veuillez ajouter au moins une pièce avec une surface"
  }
};

// ===== EVENT LISTENERS =====
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("addRoomBtn").addEventListener("click", addRoom);
  document.getElementById("calculateBtn").addEventListener("click", calculate);
  document.getElementById("languageSelect").addEventListener("change", (e) => {
    currentLang = e.target.value;
    updateUIText();
  });
});

// ===== UPDATE UI TEXT FOR LANGUAGE =====
function updateUIText() {
  const t = LANG[currentLang];
  document.getElementById("title").innerText = t.title;
  document.getElementById("addRoomBtn").innerText = t.addRoom;
  document.getElementById("calculateBtn").innerText = t.calculate;

  document.querySelectorAll(".room-card").forEach((card) => {
    const labels = card.querySelectorAll("label");
    if (labels[0]) labels[0].innerText = t.area;
    if (labels[1]) labels[1].innerText = t.distance;
    if (labels[2]) labels[2].innerText = t.roomType;
    if (labels[3]) labels[3].innerText = t.sunExposure;

    // Update dropdown options
    const typeSelect = card.querySelector(".type");
    const sunSelect = card.querySelector(".sun");

    typeSelect.innerHTML = t.roomTypes.map(rt => `<option value="${rt.value}">${rt.label}</option>`).join("");
    sunSelect.innerHTML = t.sunLevels.map(s => `<option value="${s.value}">${s.label}</option>`).join("");
  });
}

// ===== ADD ROOM =====
function addRoom() {
  roomCount++;
  const t = LANG[currentLang];

  const room = document.createElement("div");
  room.className = "room-card";

  const roomTypeOptions = t.roomTypes.map(rt => `<option value="${rt.value}">${rt.label}</option>`).join("");
  const sunOptions = t.sunLevels.map(s => `<option value="${s.value}">${s.label}</option>`).join("");

  room.innerHTML = `
    <h3>Room ${roomCount}</h3>

    <label>${t.area}</label>
    <input type="number" class="area" placeholder="20" />

    <label>${t.distance}</label>
    <input type="number" class="distance" placeholder="5" />

    <label>${t.roomType}</label>
    <select class="type">${roomTypeOptions}</select>

    <label>${t.sunExposure}</label>
    <select class="sun">${sunOptions}</select>
  `;

  document.getElementById("rooms").appendChild(room);
}

// ===== CALCULATE PROJECT =====
async function calculate() {
  const t = LANG[currentLang];
  const rooms = [];

  document.querySelectorAll(".room-card").forEach(card => {
    rooms.push({
      area: card.querySelector(".area").value,
      distance: card.querySelector(".distance").value,
      type: card.querySelector(".type").value,
      sun: card.querySelector(".sun").value,
      ceilingHeight: 2.6
    });
  });

  const validRooms = rooms.filter(r => r.area > 0);
  if (validRooms.length === 0) {
    alert(t.alertAddRoom);
    return;
  }

  const res = await fetch("https://ac-calculator-backend.onrender.com/project/calculate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ projectName: "AC Project", rooms: validRooms })
  });

  const data = await res.json();
  renderResults(data);
}

// ===== RENDER DASHBOARD =====
function renderResults(data) {
  const t = LANG[currentLang];
  const results = document.getElementById("results");
  const summary = document.getElementById("summary");

  results.innerHTML = "";
  summary.classList.remove("hidden");

  // SUMMARY CARD
  summary.innerHTML = `
    <div class="summary-card">
      <h2>${t.summary}</h2>
      <p>${t.totalBTU}: <span class="badge">${data.totalBTU} BTU</span></p>
      <p><strong>${t.system}:</strong> ${data.systemRecommendation}</p>
      <p>
        ${t.copperPipe}: ${data.totalMaterials.copperPipe_m} m |
        ${t.drainPipe}: ${data.totalMaterials.drainPipe_m} m |
        ${t.cable}: ${data.totalMaterials.cable_m} m
      </p>
    </div>
  `;

  // ROOM DETAIL CARDS
  data.rooms.forEach(r => {
    const card = document.createElement("div");
    card.className = "result-card";
    card.innerHTML = `
      <h3>Room ${r.room}</h3>
      <p><strong>BTU:</strong> ${r.btu}</p>
      <p>
        Pipe Size: ${r.materials.pipeSize}<br>
        ${t.copperPipe}: ${r.materials.copperPipe_m} m<br>
        ${t.drainPipe}: ${r.materials.drainPipe_m} m<br>
        ${t.cable}: ${r.materials.cable_m} m
      </p>
    `;
    results.appendChild(card);
  });
}
