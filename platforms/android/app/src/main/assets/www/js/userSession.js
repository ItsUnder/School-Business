// js/user-session.js
(function () {
  const USER_KEY = "sb.user";

  function getUser() {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  }

  function resolveName(u) {
    return (u && (u.name || u.nome || u.username || u.userName)) || "";
  }

  function fillInRoot(root) {
    const u = getUser();
    const name = resolveName(u);
    const email = (u && u.email) ? u.email : "";

    // preenche todos dentro do root
    root.querySelectorAll(".userName").forEach(el => el.textContent = name || "");
    root.querySelectorAll(".userEmail").forEach(el => el.textContent = email || "");
  }

  function fillAll() {
    fillInRoot(document);
  }

  // Debug rápido pra você ver se o arquivo está carregando mesmo
  console.log("[user-session] loaded");

  // 1) Preenche imediatamente
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fillAll);
  } else {
    fillAll();
  }

  // 2) Observa mudanças no DOM (Framework7 injeta páginas depois!)
  const obs = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;

        // Se o nó adicionado ou algo dentro dele tiver .userName/.userEmail, preenche só ali
        if (node.matches?.(".userName, .userEmail") || node.querySelector?.(".userName, .userEmail")) {
          fillInRoot(node);
        }
      }
    }
  });

  obs.observe(document.documentElement, { childList: true, subtree: true });

  // API global (pra você testar no console)
  window.SBUser = {
    getUser,
    refresh: fillAll,
  };
})();
