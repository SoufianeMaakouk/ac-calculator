const API = "https://ac-calculator-backend.onrender.com";

let language = "en";

const translations = {
  en: { title: "Installer Login", email: "Email", password: "Password", login: "Login", register: "Register" },
  fr: { title: "Connexion installateur", email: "Email", password: "Mot de passe", login: "Connexion", register: "S'inscrire" },
  ar: { title: "تسجيل الدخول", email: "البريد الإلكتروني", password: "كلمة المرور", login: "دخول", register: "تسجيل" }
};

function translate() {
  const t = translations[language];
  document.body.dir = language === "ar" ? "rtl" : "ltr";
  document.getElementById("title").textContent = t.title;
  document.getElementById("email").placeholder = t.email;
  document.getElementById("password").placeholder = t.password;
}

document.getElementById("languageSelect").onchange = e => {
  language = e.target.value;
  translate();
};

translate();

/* ================= LOGIN ================= */
async function login() {
  const email = emailInput();
  const password = passwordInput();

  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (res.ok && data.token) {
    localStorage.setItem("token", data.token);
    location.href = "dashboard.html";
  } else {
    alert(data.message || "Login failed");
  }
}

/* ================= REGISTER ================= */
async function register() {
  const email = emailInput();
  const password = passwordInput();

  const res = await fetch(`${API}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  alert(data.message || "Registered");
}

function emailInput() {
  return document.getElementById("email").value;
}

function passwordInput() {
  return document.getElementById("password").value;
}
