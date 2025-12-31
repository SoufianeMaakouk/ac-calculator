async function calculate() {
  const rooms = Number(document.getElementById("rooms").value);
  const area = Number(document.getElementById("area").value);
  const distance = Number(document.getElementById("distance").value);

  const res = await fetch(
    "https://ac-calculator-backend.onrender.com/calculate",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rooms, area, distance })
    }
  );

  if (!res.ok) {
    const error = await res.json();
    document.getElementById("result").textContent =
      error.error || "Calculation failed";
    return;
  }

  const data = await res.json();
  document.getElementById("result").textContent =
    JSON.stringify(data, null, 2);
}
