(function () {
  const KEY = "sb.assign.portuguese.producaoTexto";

  function getJSON(key){
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  }

  function updatePortugueseBadge() {
    const badge = document.getElementById("badgePortuguese");
    if (!badge) return;

    const saved = getJSON(KEY);

    if (saved && saved.sent === true) {
      badge.style.display = "none";
    } else {
      badge.style.display = "";
      badge.textContent = "1";
    }
    console.log("🔔 updatePortugueseBadge rodou");
  }

  document.addEventListener("page:init", function (e) {
    if (e.target?.dataset?.name === "home" || e.target?.dataset?.name === "mural" || e.target?.dataset?.name === "index") {
      updatePortugueseBadge();
    }
  });

  document.addEventListener("page:afterin", function (e) {
    if (e.target?.dataset?.name === "home" || e.target?.dataset?.name === "mural") {
      updatePortugueseBadge();
    }
  });

  document.addEventListener("sb:portuguese:sent", updatePortugueseBadge);

  document.addEventListener("deviceready", updatePortugueseBadge, false);
  document.addEventListener("DOMContentLoaded", updatePortugueseBadge);

})();
