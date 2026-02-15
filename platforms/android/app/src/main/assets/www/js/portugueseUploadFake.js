(function () {
  const KEY = "sb.assign.portuguese.producaoTexto";

  function getJSON(key){
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  }
  function setJSON(key, value){
    localStorage.setItem(key, JSON.stringify(value));
  }

  function setSentUI() {
    const status = document.getElementById("ptProducaoStatus");
    if (!status) return;

    status.textContent = "Enviado";
    status.classList.remove("pending");
    status.classList.add("sent");
  }

  function refreshFromStorage() {
    const saved = getJSON(KEY);
    if (saved && saved.sent === true) setSentUI();
  }

  function bind() {
    const card = document.getElementById("ptProducaoCard");
    const input = document.getElementById("ptProducaoFile");
    if (!card || !input) return;

    // Se já enviou antes, já mostra enviado
    refreshFromStorage();

    // Clique no card abre seletor
    card.addEventListener("click", () => {
      const saved = getJSON(KEY);
      if (saved && saved.sent === true) {
        // já enviado (pode deixar só um aviso)
        if (window.app?.dialog) window.app.dialog.alert("Você já enviou essa atividade.");
        else alert("Você já enviou essa atividade.");
        return;
      }
      input.value = ""; // permite selecionar o mesmo arquivo de novo
      input.click();
    });

    // Escolheu arquivo -> confirma upload fake
    input.addEventListener("change", () => {
      const file = input.files && input.files[0];
      if (!file) return;

      const fileName = file.name || "arquivo";

      const confirmUpload = () => {
        // “upload fake”
        setTimeout(() => {
          setJSON(KEY, { sent: true, fileName, sentAt: Date.now() });
          setSentUI();

          // 🔥 dispara um evento global pra outras páginas (mural) atualizarem badge
          document.dispatchEvent(new CustomEvent("sb:portuguese:sent"));

          if (window.app?.toast) {
            window.app.toast.create({ text: "Arquivo enviado ✅", closeTimeout: 2000 }).open();
          }
        }, 450);
      };

      if (window.app?.dialog) {
        window.app.dialog.confirm(
          `Enviar "${fileName}"?`,
          "Upload",
          confirmUpload
        );
      } else {
        if (confirm(`Enviar "${fileName}"?`)) confirmUpload();
      }
    });
  }
// Framework7: roda quando a página Portuguese entra
document.addEventListener("page:init", function (e) {
  if (e.target && e.target.dataset && e.target.dataset.name === "portuguese") {
    console.log("📄 Página Portuguese iniciada");
    bind();
  }
});

// fallback (não quebra nada fora do F7)
document.addEventListener("deviceready", bind, false);
document.addEventListener("DOMContentLoaded", bind);

})();

