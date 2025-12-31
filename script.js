async function calculate() {
  const resultEl = document.getElementById("result");
  resultEl.textContent = "Calculating...";

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

    if (!res.ok) {
      resultEl.textContent = data.error || "Error calculating";
      console.error("Backend error:", data);
      return;
    }

    resultEl.textContent = JSON.stringify(data, null, 2);
    console.log("Calculation result:", data);

  } catch (err) {
    resultEl.textContent = "Connection error. Please try again.";
    console.error("Fetch error:", err);
  }
}
