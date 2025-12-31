async function calculate() {
  const rooms = Number(document.getElementById("rooms").value);
  const area = Number(document.getElementById("area").value);
  const distance = Number(document.getElementById("distance").value);

  const res = await fetch("https://YOUR-RENDER-URL/calculate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rooms, area, distance })
  });

  const data = await res.json();
  document.getElementById("result").textContent =
    JSON.stringify(data, null, 2);
}
