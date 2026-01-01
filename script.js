let roomCount = 0;

// ===== EVENT LISTENERS =====
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("addRoomBtn").addEventListener("click", addRoom);
  document.getElementById("calculateBtn").addEventListener("click", calculate);
});

// ===== ADD ROOM =====
function addRoom() {
  roomCount++;

  const room = document.createElement("div");
  room.className = "room-card";
  room.innerHTML = `
    <h3>Room ${roomCount}</h3>

    <label>Area (m²)</label>
    <input type="number" class="area" placeholder="20" />

    <label>Distance to outdoor unit (m)</label>
    <input type="number" class="distance" placeholder="5" />

    <label>Room Type</label>
    <select class="type">
      <option value="bedroom">Bedroom</option>
      <option value="living">Living Room</option>
      <option value="kitchen">Kitchen</option>
    </select>

    <label>Sun Exposure</label>
    <select class="sun">
      <option value="low">Low</option>
      <option value="medium">Medium</option>
      <option value="high">High</option>
    </select>
  `;

  document.getElementById("rooms").appendChild(room);
}

// ===== CALCULATE PROJECT =====
async function calculate() {
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
    alert("Please add at least one room with area");
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
  const results = document.getElementById("results");
  const summary = document.getElementById("summary");

  // Clear old results
  results.innerHTML = "";
  summary.classList.remove("hidden");

  // ===== SUMMARY CARD =====
  summary.innerHTML = `
    <div class="summary-card">
      <h2>Project Summary</h2>
      <p>Total BTU Required: <span class="badge">${data.totalBTU} BTU</span></p>
      <p><strong>Recommended System:</strong> ${data.systemRecommendation}</p>
      <p>
        Copper Pipe: ${data.totalMaterials.copperPipe_m} m |
        Drain Pipe: ${data.totalMaterials.drainPipe_m} m |
        Cable: ${data.totalMaterials.cable_m} m
      </p>
    </div>
  `;

  // ===== ROOM DETAIL CARDS =====
  data.rooms.forEach(r => {
    const card = document.createElement("div");
    card.className = "result-card";
    card.innerHTML = `
      <h3>Room ${r.room}</h3>
      <p><strong>BTU:</strong> ${r.btu}</p>
      <p>
        Pipe Size: ${r.materials.pipeSize}<br>
        Copper: ${r.materials.copperPipe_m} m<br>
        Drain: ${r.materials.drainPipe_m} m<br>
        Cable: ${r.materials.cable_m} m
      </p>
    `;
    results.appendChild(card);
  });
}
