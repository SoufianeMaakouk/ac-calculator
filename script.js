let rooms = [];

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("addRoomBtn").addEventListener("click", addRoom);
  document.getElementById("calculateBtn").addEventListener("click", calculate);
});

function addRoom() {
  const id = rooms.length;

  rooms.push({
    area: 0,
    ceilingHeight: 2.6,
    type: "bedroom",
    sun: "low",
    distance: 0
  });

  const div = document.createElement("div");
  div.className = "room";

  div.innerHTML = `
    <h3>Room ${id + 1}</h3>

    <label>Area (m²)</label>
    <input type="number" min="1" oninput="rooms[${id}].area = +this.value" />

    <label>Ceiling Height</label>
    <input type="number" step="0.1" value="2.6"
      oninput="rooms[${id}].ceilingHeight = +this.value" />

    <label>Room Type</label>
    <select oninput="rooms[${id}].type = this.value">
      <option value="bedroom">Bedroom</option>
      <option value="living">Living</option>
      <option value="kitchen">Kitchen</option>
    </select>

    <label>Sun Exposure</label>
    <select oninput="rooms[${id}].sun = this.value">
      <option value="low">Low</option>
      <option value="medium">Medium</option>
      <option value="high">High</option>
    </select>

    <label>Pipe Distance (m)</label>
    <input type="number" min="0" oninput="rooms[${id}].distance = +this.value" />
  `;

  document.getElementById("rooms").appendChild(div);
}

async function calculate() {
  // 🔒 VALIDATION
  const validRooms = rooms.filter(r => r.area > 0);

  if (validRooms.length === 0) {
    alert("Please add at least one room with area");
    return;
  }

  document.getElementById("result").textContent = "Calculating...";

  try {
    const res = await fetch(
      "https://ac-calculator-backend.onrender.com/project/calculate",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName: "My Project",
          rooms: validRooms
        })
      }
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text);
    }

    const data = await res.json();

    document.getElementById("result").textContent =
      JSON.stringify(data, null, 2);
  } catch (err) {
    document.getElementById("result").textContent =
      "ERROR:\n" + err.message;
  }
}
