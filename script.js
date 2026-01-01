let rooms = [];

function addRoom() {
  const id = rooms.length;
  rooms.push({});

  const div = document.createElement("div");
  div.className = "room";
  div.innerHTML = `
    <h3>Room ${id + 1}</h3>
    <input placeholder="Area m²" onchange="rooms[${id}].area = +this.value" />
    <input placeholder="Ceiling height" value="2.6" onchange="rooms[${id}].ceilingHeight = +this.value" />
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
    <input placeholder="Distance m" onchange="rooms[${id}].distance = +this.value" />
  `;

  document.getElementById("rooms").appendChild(div);
}

async function calculate() {
  const res = await fetch("https://ac-calculator-backend.onrender.com/project/calculate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ projectName: "My Project", rooms })
  });

  const data = await res.json();
  document.getElementById("result").textContent = JSON.stringify(data, null, 2);
}
