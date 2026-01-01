let rooms = [];


document.addEventListener("DOMContentLoaded", () => {
document.getElementById("addRoomBtn").addEventListener("click", addRoom);
document.getElementById("calculateBtn").addEventListener("click", calculate);
});


function addRoom() {
const container = document.getElementById("rooms");
const id = rooms.length;


rooms.push({ area: 0, ceilingHeight: 2.6, type: "bedroom", sun: "low", distance: 0 });


const div = document.createElement("div");
div.className = "room";
div.innerHTML = `
<h3>Room ${id + 1}</h3>
<input type="number" placeholder="Area m²" oninput="rooms[${id}].area = +this.value" />
<input type="number" value="2.6" step="0.1" oninput="rooms[${id}].ceilingHeight = +this.value" />
<select oninput="rooms[${id}].type = this.value">
<option value="bedroom">Bedroom</option>
<option value="living">Living</option>
<option value="kitchen">Kitchen</option>
</select>
<select oninput="rooms[${id}].sun = this.value">
<option value="low">Low Sun</option>
<option value="medium">Medium Sun</option>
<option value="high">High Sun</option>
</select>
<input type="number" placeholder="Distance m" oninput="rooms[${id}].distance = +this.value" />
`;


container.appendChild(div);
}


async function calculate() {
}
