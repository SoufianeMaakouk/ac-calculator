const API = "https://ac-calculator-backend.onrender.com";
const token = localStorage.getItem("token");

// 🔐 Protect page
if (!token) {
  window.location.href = "login.html";
}

// Show user
const user = JSON.parse(localStorage.getItem("user"));
document.getElementById("userEmail").textContent = user.email;

// 🚪 Logout
function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

// 💾 Save project
async function saveProject() {
  const name = document.getElementById("projectName").value;

  const res = await fetch(`${API}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ name, data: { example: true } })
  });

  const data = await res.json();
  document.getElementById("result").textContent = JSON.stringify(data, null, 2);
}

// 📄 Export PDF
async function exportPDF() {
  const res = await fetch(`${API}/projects/pdf`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "project.pdf";
  a.click();
}
