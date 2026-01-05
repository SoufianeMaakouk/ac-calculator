let token = localStorage.getItem("token") || null;
let language = localStorage.getItem("language") || "en";

const translations = {
  en: { loginTitle: "AC Installer Login", email: "Email", password: "Password", login: "Login", register: "Register" },
  fr: { loginTitle: "Connexion Installateur AC", email: "Email", password: "Mot de passe", login: "Connexion", register: "S'inscrire" },
  ar: { loginTitle: "تسجيل دخول المثبت", email: "البريد الإلكتروني", password: "كلمة المرور", login: "دخول", register: "تسجيل" }
};

function el(id) { return document.getElementById(id); }

function translateUI() {
  const t = translations[language];
  document.body.dir = language === "ar" ? "rtl" : "ltr";
  if(el("title")) el("title").textContent = t.loginTitle;
  if(el("email")) el("email").placeholder = t.email;
  if(el("password")) el("password").placeholder = t.password;
  if(el("loginBtn")) el("loginBtn").textContent = t.login;
  if(el("registerBtn")) el("registerBtn").textContent = t.register;
}

// ===== LANGUAGE SELECT =====
if(el("languageSelect")) {
  el("languageSelect").value = language;
  el("languageSelect").addEventListener("change", e => {
    language = e.target.value;
    localStorage.setItem("language", language);
    translateUI();
  });
}

translateUI();

// ===== LOGIN / REGISTER =====
if(el("loginBtn")) el("loginBtn").onclick = async () => {
  const res = await fetch("https://ac-calculator-backend.onrender.com/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ email: el("email").value, password: el("password").value })
  });
  const data = await res.json();
  if(data.token) {
    localStorage.setItem("token", data.token);
    location.href = "dashboard.html";
  } else alert(data.message || "Login failed");
};

if(el("registerBtn")) el("registerBtn").onclick = async () => {
  const res = await fetch("https://ac-calculator-backend.onrender.com/register", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ email: el("email").value, password: el("password").value })
  });
  const data = await res.json();
  alert(data.message || "Registration failed");
};

// ===== AUTO-REDIRECT IF LOGGED IN =====
if(token) location.href = "dashboard.html";
