(function () {
  const USER_KEY = "sb.user";
  const DEFAULT_AVATAR = "https://www.w3schools.com/howto/img_avatar.png";

  function getUser() {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  }

  function setUser(userObj) {
    localStorage.setItem(USER_KEY, JSON.stringify(userObj));
  }

  function normalizeImgSrc(uriOrUrl) {
    if (!uriOrUrl) return DEFAULT_AVATAR;

    if (window.Ionic?.WebView?.convertFileSrc) {
      return window.Ionic.WebView.convertFileSrc(uriOrUrl);
    }

    return uriOrUrl;
  }

  function getAvatarRaw() {
    const u = getUser();
    return (u && u.avatarUrl) ? u.avatarUrl : "";
  }

  function getAvatarSrc() {
    return normalizeImgSrc(getAvatarRaw() || DEFAULT_AVATAR);
  }

  function applyAvatar(root = document) {
    const src = getAvatarSrc();
    root.querySelectorAll("img.userAvatarEl").forEach(img => {
      img.src = src;
    });
  }

  function applyNameEmail(root = document) {
    const u = getUser() || {};
    const name = u.name || "";
    const email = u.email || "";

    root.querySelectorAll(".userName").forEach(el => el.textContent = name);
    root.querySelectorAll(".userEmail").forEach(el => el.textContent = email);
  }

  function refresh(root = document) {
    applyNameEmail(root);
    applyAvatar(root);
  }

  window.SBUser = {
    getUser,
    setUser,
    getAvatarRaw,
    getAvatarSrc,
    normalizeImgSrc,
    refresh
  };

  document.addEventListener("DOMContentLoaded", () => refresh(document));
  document.addEventListener("deviceready", () => refresh(document));

  ["page:init", "page:mounted", "page:afterin"].forEach(evt => {
    document.addEventListener(evt, (e) => {
      const pageEl = e.detail?.el;
      if (pageEl) refresh(pageEl);
    });
  });

})();
