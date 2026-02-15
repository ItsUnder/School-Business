// js/login.js
// Login "fake" com localStorage (Cordova/Framework7 friendly)
// Salva: nome, email, senha em "sb.user"
// Sessão: loggedIn em "sb.auth"
// Pula login se já estiver logado

(function () {
  const USER_KEY = "sb.user";
  const AUTH_KEY = "sb.auth";

  let mode = "login"; // "login" | "register"

  // ---------- storage helpers ----------
  function setJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function getJSON(key) {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  }

  function getUser() {
    return getJSON(USER_KEY);
  }

  function isLoggedIn() {
    const auth = getJSON(AUTH_KEY);
    return !!(auth && auth.loggedIn === true);
  }

  // ---------- navegação (AJUSTE AQUI) ----------
  function goToHome() {
    window.app.views.main.router.navigate('/home/');
    console.log("✅ Logado! Ajuste o redirect em goToHome().");
  }

  // ---------- util ----------
  function validateEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  // pega a raiz da tela de login pra não quebrar com IDs repetidos em outras páginas
  function getRoot() {
    // sua página tem: <div class="page-content" id="pageContentLogin">
    return document.getElementById("pageContentLogin");
  }

  // ---------- UI ----------
  function applyModeUI(root) {
    const labelName = root.querySelector("#labelName");
    const inputName = root.querySelector("#name");
    const btnLogin = root.querySelector("#btnLogin");
    const toggleMode = root.querySelector("#toggleMode");

    const isRegister = (mode === "register");

    if (labelName) labelName.style.display = isRegister ? "block" : "none";
    if (inputName) inputName.style.display = isRegister ? "block" : "none";

    if (btnLogin) btnLogin.textContent = isRegister ? "Criar conta" : "Entrar";

    if (toggleMode) {
      toggleMode.textContent = isRegister
        ? "Já tem conta? Entrar"
        : "Não tem conta? Criar agora";
    }
  }
  
  function register(root) {
    const name = (root.querySelector("#name")?.value || "").trim();
    const email = (root.querySelector("#email")?.value || "").trim().toLowerCase();
    const password = (root.querySelector("#password")?.value || "");

    if (!name) return alert("Digite seu nome.");
    if (!validateEmail(email)) return alert("Digite um email válido.");
    if (!password || password.length < 4) return alert("Senha muito curta (mínimo 4).");

    // salva user
    setJSON(USER_KEY, { name, email, password });

    // loga
    setJSON(AUTH_KEY, { loggedIn: true });

    // agenda uma notificação 1 minuto depois do cadastro
    if (window.SBNotify) {
      window.SBNotify.scheduleActivity({
        id: 201,
        title: "Atividade pendente 🎯",
        text: "Produção de Texto — Artigo de Opinião (toque para abrir)",
        at: new Date(Date.now() + 1),
        route: "/subject/portuguese/"
      });
    }

    goToHome();
  }

  function login(root) {
    const email = (root.querySelector("#email")?.value || "").trim().toLowerCase();
    const password = (root.querySelector("#password")?.value || "");

    const user = getUser();
    if (!user) return alert("Nenhuma conta encontrada. Clique em 'Criar agora'.");

    if (email === user.email && password === user.password) {
      setJSON(AUTH_KEY, { loggedIn: true });
      goToHome();
    } else {
      alert("Email ou senha incorretos.");
    }
  }

  // ---------- eventos ----------
  function bindEvents(root) {
    const btnLogin = root.querySelector("#btnLogin");
    const toggleMode = root.querySelector("#toggleMode");

    if (btnLogin) {
      btnLogin.addEventListener("click", function (e) {
        e.preventDefault();
        if (mode === "register") register(root);
        else login(root);
      });
    }

    if (toggleMode) {
      toggleMode.addEventListener("click", function (e) {
        e.preventDefault();
        mode = (mode === "login") ? "register" : "login";
        applyModeUI(root);
      });
    }
  }

  // ---------- init ----------
  function init() {
    // pula login se já estiver logado
    if (isLoggedIn()) {
      goToHome();
      return;
    }

    const root = getRoot();
    if (!root) {
      console.warn("❌ Não achei #pageContentLogin. Confira o id no HTML.");
      return;
    }

    mode = "login";
    applyModeUI(root);
    bindEvents(root);
  }

  // Cordova
  document.addEventListener("deviceready", init, false);

  // Browser (live server)
  document.addEventListener("DOMContentLoaded", function () {
    if (window.cordova) return; // evita rodar duas vezes no Cordova
    init();
  });

  // ---------- (opcional) funções globais úteis ----------
  // Usar em qualquer página:
  // const user = window.SBAuth.getUser();
  // window.SBAuth.logout();
  window.SBAuth = {
    getUser,
    isLoggedIn,
    logout: function () {
      setJSON(AUTH_KEY, { loggedIn: false });
    },
    clearAll: function () {
      localStorage.removeItem(AUTH_KEY);
      localStorage.removeItem(USER_KEY);
    }
  };
})();
