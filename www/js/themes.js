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

    const toggle = document.getElementById("darkToggle");
    if (toggle) toggle.checked = isDark;
  }

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

  document.addEventListener("DOMContentLoaded", () => {
    applyTheme(isDarkSaved());
  });

  document.addEventListener("deviceready", () => {
    applyTheme(isDarkSaved());
  }, false);

  document.addEventListener("change", (e) => {
    if (e.target && e.target.id === "darkToggle") {
      const isDark = e.target.checked;
      setSaved(isDark);
      applyTheme(isDark);
    }
  });

  document.addEventListener("page:afterin", () => {
    applyTheme(isDarkSaved());
  });
})();
