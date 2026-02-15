document.addEventListener('deviceready', function () {

  document.addEventListener('click', function (e) {
    const a = e.target.closest('.open-link');
    if (!a) return;

    e.preventDefault();
    const url = a.getAttribute('data-url');
    if (!url) return;

    cordova.InAppBrowser.open(url, '_system', 'location=yes');
  });

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
