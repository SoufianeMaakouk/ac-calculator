let roomCount = 0;

function addRoom() {
  roomCount++;

  const room = document.createElement("div");
  room.className = "room-card";
  room.innerHTML = `
    <h3>Room ${roomCount}</h3>

    <input placeholder="Area (m²)" type="number" class="area" />
    <input placeholder="Distance to outdoor unit (m)" type="number" class="distance" />

    <select class="type">
      <option value="bedroom">Bedroom</option>
      <option value="living">Living Room</option>
      <option value="kitchen">Kitchen</option>
    </select>

    <select class="sun">
      <option value="low">Low Sun</option>
      <option value="medium">Medium Sun</option>
      <option value="high">High Sun</option>
    </select>
  `;

  document.getElementById("rooms").appendChild(room);
}

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

  const res = await fetch("https://ac-calculator-backend.onrender.com/project/calculate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      projectName: "AC Project",
      rooms
    })
  });

  const data = await res.json();
  renderResults(data);
}

function renderResults(data) {
  const results = document.getElementById("results");
  const summary = document.getElementById("summary");

  results.innerHTML = "";
  summary.classList.remove("hidden");

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
