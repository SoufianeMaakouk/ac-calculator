async function calculate() {
  const result = document.getElementById("result");
  const error = document.getElementById("error");
  const loader = document.getElementById("loader");

  result.classList.add("hidden");
  error.classList.add("hidden");
  loader.classList.remove("hidden");

  const rooms = Number(document.getElementById("rooms").value);
  const area = Number(document.getElementById("area").value);
  const distance = Number(document.getElementById("distance").value) || 5;

  try {
    const res = await fetch(
      "https://ac-calculator-backend.onrender.com/calculate",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rooms, area, distance })
      }
    );

    const data = await res.json();
    loader.classList.add("hidden");

    if (!res.ok) {
      error.textContent = data.error;
      error.classList.remove("hidden");
      return;
    }

    const priceEstimate =
      data.materials.copperPipe_m * 15 +
      data.materials.drainPipe_m * 5 +
      data.materials.cable_m * 4;

    const systemType =
      data.indoorUnits > 2
        ? "Multi-Split system recommended"
        : "Single Split units recommended";

    result.innerHTML = `
      <div class="result-card"><strong>Total Area:</strong> ${data.area} m²</div>
      <div class="result-card"><strong>Total Capacity:</strong> ${data.btu} BTU</div>
      <div class="result-card"><strong>Indoor Units:</strong> ${data.indoorUnits}</div>

      <div class="result-card"><strong>Copper Pipe:</strong> ${data.materials.copperPipe_m} m</div>
      <div class="result-card"><strong>Drain Pipe:</strong> ${data.materials.drainPipe_m} m</div>
      <div class="result-card"><strong>Electrical Cable:</strong> ${data.materials.cable_m} m</div>
      <div class="result-card"><strong>Breaker:</strong> ${data.materials.breaker}</div>

      <div class="result-card"><strong>Estimated Material Cost:</strong> €${priceEstimate}</div>
      <div class="result-card"><strong>Recommendation:</strong> ${systemType}</div>
    `;

    result.classList.remove("hidden");

  } catch (err) {
    loader.classList.add("hidden");
    error.textContent = "Connection error. Please try again.";
    error.classList.remove("hidden");
  }
}
