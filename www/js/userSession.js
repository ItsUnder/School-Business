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

    root.querySelectorAll(".userName").forEach(el => el.textContent = name || "");
    root.querySelectorAll(".userEmail").forEach(el => el.textContent = email || "");
  }

  function fillAll() {
    fillInRoot(document);
  }

  console.log("[user-session] loaded");

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fillAll);
  } else {
    fillAll();
  }

  const obs = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;

        if (node.matches?.(".userName, .userEmail") || node.querySelector?.(".userName, .userEmail")) {
          fillInRoot(node);
        }
      }
    }
  });

  obs.observe(document.documentElement, { childList: true, subtree: true });

  window.SBUser = {
    getUser,
    refresh: fillAll,
  };
})();
