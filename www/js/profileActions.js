(function () {
  const USER_KEY = "sb.user";
  const AUTH_KEY = "sb.auth";
  const DEFAULT_AVATAR = "https://www.w3schools.com/howto/img_avatar.png";

  function getUser() {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  }
  function setUser(userObj) {
    localStorage.setItem(USER_KEY, JSON.stringify(userObj));
  }

  function refreshGlobals() {
    if (window.SBUser?.refresh) window.SBUser.refresh();
  }

  function setAvatarEverywhere(url) {
    const finalUrl = url || DEFAULT_AVATAR;
    document.querySelectorAll(".userAvatarEl, .userAvatarPreview, .userAvatar").forEach(img => {
      if (img && img.tagName === "IMG") img.src = finalUrl;
    });
  }

  function normalizeImgSrc(uriOrUrl) {
    if (!uriOrUrl) return "";

    if (window.Ionic && window.Ionic.WebView && typeof window.Ionic.WebView.convertFileSrc === "function") {
      return window.Ionic.WebView.convertFileSrc(uriOrUrl);
    }

    return uriOrUrl;
  }

  function resolveContentUri(uri, cb) {
    if (!uri) return cb("");

    if (uri.startsWith("file://")) return cb(uri);

    if (!uri.startsWith("content://")) return cb(uri);

    if (!window.FilePath || typeof window.FilePath.resolveNativePath !== "function") {
      console.warn("FilePath plugin não disponível. URI:", uri);
      return cb(uri); 
    }

    window.FilePath.resolveNativePath(uri, function (nativePath) {
      const out = nativePath.startsWith("file://") ? nativePath : ("file://" + nativePath);
      cb(out);
    }, function (err) {
      console.warn("resolveNativePath error:", err);
      cb(uri);
    });
  }

  function pickAvatarFromGallery(onPicked) {
    if (!window.cordova || !navigator.camera) {
      alert("Isso só funciona no app (Cordova), não no navegador.");
      return;
    }

    navigator.camera.getPicture(
      function (imageUri) {
        resolveContentUri(imageUri, function (resolvedUri) {
          const safeSrc = normalizeImgSrc(resolvedUri);
          onPicked({ raw: imageUri, resolved: resolvedUri, safeSrc });
        });
      },
      function (err) {
        console.log("pickAvatar cancel/err:", err);
      },
      {
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        destinationType: Camera.DestinationType.FILE_URI,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE,
        quality: 70,
        correctOrientation: true
      }
    );
  }

  function bindProfileEdit(pageEl) {
    const btnSave = pageEl.querySelector("#btnSaveProfile");
    if (!btnSave) return;

    if (pageEl.dataset.profileEditBound === "1") return;
    pageEl.dataset.profileEditBound = "1";

    const inputName = pageEl.querySelector("#editName");
    const inputAvatar = pageEl.querySelector("#editAvatar");
    const inputCurrent = pageEl.querySelector("#currentPassword");
    const inputNew = pageEl.querySelector("#newPassword");
    const inputConfirm = pageEl.querySelector("#confirmPassword");
    const btnPick = pageEl.querySelector("#btnPickAvatar");
    const preview = pageEl.querySelector(".userAvatarPreview");

    const u = getUser() || {};
    if (inputName) inputName.value = u.name || "";
    if (inputAvatar) inputAvatar.value = u.avatarUrl || "";
    if (preview) preview.src = normalizeImgSrc(u.avatarUrl || DEFAULT_AVATAR);

    if (inputAvatar && preview) {
      inputAvatar.addEventListener("input", () => {
        const val = (inputAvatar.value || "").trim();
        preview.src = normalizeImgSrc(val || DEFAULT_AVATAR);
      });
    }

    if (btnPick) {
      btnPick.addEventListener("click", (e) => {
        e.preventDefault();

        pickAvatarFromGallery(({ resolved, safeSrc }) => {
          if (inputAvatar) inputAvatar.value = resolved || "";

          if (preview) preview.src = safeSrc || resolved || DEFAULT_AVATAR;

          const userNow = getUser();
          if (userNow) {
            userNow.avatarUrl = resolved || "";
            setUser(userNow);
            refreshGlobals();
            setAvatarEverywhere(safeSrc || resolved);
          }
        });
      });
    }

    btnSave.addEventListener("click", (e) => {
      e.preventDefault();

      const userNow = getUser();
      if (!userNow) return alert("Não encontrei uma conta salva.");

      const currentPassword = (inputCurrent?.value || "");
      if (!currentPassword) return alert("Digite sua senha atual para salvar.");
      if (currentPassword !== userNow.password) return alert("Senha atual incorreta.");

      const name = (inputName?.value || "").trim();
      if (!name) return alert("Digite um nome válido.");

      const avatarUrl = (inputAvatar?.value || "").trim(); 
      const newPassword = (inputNew?.value || "");
      const confirm = (inputConfirm?.value || "");

      let finalPassword = userNow.password;
      if (newPassword || confirm) {
        if (newPassword.length < 4) return alert("Nova senha muito curta (mínimo 4).");
        if (newPassword !== confirm) return alert("A confirmação da senha não confere.");
        finalPassword = newPassword;
      }

      const updated = { ...userNow, name, avatarUrl, password: finalPassword };
      setUser(updated);

      refreshGlobals();
      setAvatarEverywhere(normalizeImgSrc(avatarUrl));

      if (window.app?.views?.main?.router) window.app.views.main.router.back();
      else history.back();
    });
  }

  function bindDelete(root) {
    const btn = root.querySelector("#btnClearAccount");
    if (!btn) return;

    if (btn.dataset.bound === "1") return;
    btn.dataset.bound = "1";

    btn.addEventListener("click", (e) => {
      e.preventDefault();

      const ok = confirm("Isso vai apagar TODOS os dados locais (conta e sessão). Continuar?");
      if (!ok) return;
      clearAllSchoolBusinessData();
      refreshGlobals();
      window.app.views.main.router.navigate("/index/", { clearPreviousHistory: true });
      navigator.app.exitApp();
    });
  }

    function clearAllSchoolBusinessData() {
    const prefix = "sb.";
    const keep = new Set([
    ]);

    const toRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;
      if (k.startsWith(prefix) && !keep.has(k)) toRemove.push(k);
    }
    toRemove.forEach(k => localStorage.removeItem(k));

    document.dispatchEvent(new CustomEvent("sb:cleared"));
  }

  function scan() {
    const pageEdit =
      document.querySelector('.page[data-name="profileEdit"]') ||
      document.querySelector('.page[data-name="profile-edit"]');
    if (pageEdit) bindProfileEdit(pageEdit);

    bindDelete(document);
  }

  document.addEventListener("DOMContentLoaded", scan);

  ["page:init", "page:mounted", "page:afterin"].forEach(evt => {
    document.addEventListener(evt, (e) => {
      const pageEl = e.detail?.el;
      if (!pageEl) return;
      bindProfileEdit(pageEl);
      bindDelete(pageEl);
    });
  });

  document.addEventListener("deviceready", scan);
})();

document.addEventListener("page:init", function (e) {
  if (e.target.dataset.name !== "profile") return;

  const btnLogout = document.getElementById("btnLogout");
  if (!btnLogout) return;

  btnLogout.addEventListener("click", function (ev) {
    ev.preventDefault();

    window.SBAuth.logout();

    app.views.main.router.navigate('/', {
      clearPreviousHistory: true,
      reloadAll: true
    });
    navigator.app.exitApp();
  });
});
