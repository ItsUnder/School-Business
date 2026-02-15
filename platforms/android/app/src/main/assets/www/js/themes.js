// www/js/themes.js
(function () {
  const KEY = "themeDark"; // 1 = dark, 0 = light

  function isDarkSaved() {
    return localStorage.getItem(KEY) === "1";
  }

  function setSaved(isDark) {
    localStorage.setItem(KEY, isDark ? "1" : "0");
  }

  function applyTheme(isDark) {
    document.body.classList.toggle("theme-dark", isDark);

    // Se o toggle existir na página atual, sincroniza o estado dele
    const toggle = document.getElementById("darkToggle");
    if (toggle) toggle.checked = isDark;
  }

  // Expor funções (opcional, mas útil)
  window.Theme = {
    apply: applyTheme,
    set: (isDark) => {
      setSaved(isDark);
      applyTheme(isDark);
    },
    toggle: () => {
      const next = !document.body.classList.contains("theme-dark");
      setSaved(next);
      applyTheme(next);
    },
    get: () => document.body.classList.contains("theme-dark"),
  };

  // 1) Aplica assim que der (carregou o HTML)
  document.addEventListener("DOMContentLoaded", () => {
    applyTheme(isDarkSaved());
  });

  // 2) Cordova: garante depois do deviceready também (alguns apps demoram a injetar tudo)
  document.addEventListener("deviceready", () => {
    applyTheme(isDarkSaved());
  }, false);

  // 3) Listener global do toggle (funciona mesmo trocando de página)
  document.addEventListener("change", (e) => {
    if (e.target && e.target.id === "darkToggle") {
      const isDark = e.target.checked;
      setSaved(isDark);
      applyTheme(isDark);
    }
  });

  // 4) Framework7: quando entrar em qualquer página, reaplica e sincroniza toggle
  document.addEventListener("page:afterin", () => {
    applyTheme(isDarkSaved());
  });
})();
