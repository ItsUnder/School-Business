// Rode quando o app estiver pronto (Cordova)
document.addEventListener('deviceready', function () {

  // 1) Abrir links gerais (PDF, Drive, Spotify, etc.)
  document.addEventListener('click', function (e) {
    const a = e.target.closest('.open-link');
    if (!a) return;

    e.preventDefault();
    const url = a.getAttribute('data-url');
    if (!url) return;

    // abre no navegador do sistema (Chrome/Safari)
    cordova.InAppBrowser.open(url, '_system', 'location=yes');
  });

  // 2) Abrir YouTube
  document.addEventListener('click', function (e) {
    const a = e.target.closest('.open-yt');
    if (!a) return;

    e.preventDefault();
    const id = a.getAttribute('data-yt');
    if (!id) return;

    const url = `https://www.youtube.com/watch?v=${encodeURIComponent(id)}`;
    cordova.InAppBrowser.open(url, '_system', 'location=yes');
  });

}, false);
