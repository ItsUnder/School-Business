(function () {
  const USER_KEY = "sb.user";
  const AUTH_KEY = "sb.auth";
  const DEFAULT_AVATAR = "https://www.w3schools.com/howto/img_avatar.png";

  // ---------- storage ----------
  function getUser() {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  }
  function setUser(userObj) {
    localStorage.setItem(USER_KEY, JSON.stringify(userObj));
  }

  // ---------- helpers ----------
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

    // Se existir o helper do Ionic WebView, ele resolve file:// e alguns content://
    // (Mesmo sem Ionic, em alguns setups existe.)
    if (window.Ionic && window.Ionic.WebView && typeof window.Ionic.WebView.convertFileSrc === "function") {
      return window.Ionic.WebView.convertFileSrc(uriOrUrl);
    }

    return uriOrUrl;
  }

  // Converte content:// -> file:// usando cordova-plugin-filepath (Android)
  function resolveContentUri(uri, cb) {
    if (!uri) return cb("");

    // Se já é file://, ok
    if (uri.startsWith("file://")) return cb(uri);

    // Se não é content://, devolve como está
    if (!uri.startsWith("content://")) return cb(uri);

    // Precisa do plugin filePath
    if (!window.FilePath || typeof window.FilePath.resolveNativePath !== "function") {
      console.warn("FilePath plugin não disponível. URI:", uri);
      return cb(uri); // tenta mesmo assim
    }

    window.FilePath.resolveNativePath(uri, function (nativePath) {
      // nativePath geralmente vem como /storage/... (sem file://)
      const out = nativePath.startsWith("file://") ? nativePath : ("file://" + nativePath);
      cb(out);
    }, function (err) {
      console.warn("resolveNativePath error:", err);
      cb(uri); // fallback
    });
  }

  // ---------- camera / gallery ----------
  function pickAvatarFromGallery(onPicked) {
    if (!window.cordova || !navigator.camera) {
      alert("Isso só funciona no app (Cordova), não no navegador.");
      return;
    }

    navigator.camera.getPicture(
      function (imageUri) {
        // resolve content:// se vier assim
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

  // ---------- profileEdit bind ----------
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

    // URL manual -> prévia
    if (inputAvatar && preview) {
      inputAvatar.addEventListener("input", () => {
        const val = (inputAvatar.value || "").trim();
        preview.src = normalizeImgSrc(val || DEFAULT_AVATAR);
      });
    }

    // Escolher foto da galeria
    if (btnPick) {
      btnPick.addEventListener("click", (e) => {
        e.preventDefault();

        pickAvatarFromGallery(({ resolved, safeSrc }) => {
          // salva no input o caminho real (file://...)
          if (inputAvatar) inputAvatar.value = resolved || "";

          // mostra a prévia (safeSrc quando disponível)
          if (preview) preview.src = safeSrc || resolved || DEFAULT_AVATAR;

          // salva imediatamente (opcional)
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

    // Salvar alterações (requer senha atual)
    btnSave.addEventListener("click", (e) => {
      e.preventDefault();

      const userNow = getUser();
      if (!userNow) return alert("Não encontrei uma conta salva.");

      const currentPassword = (inputCurrent?.value || "");
      if (!currentPassword) return alert("Digite sua senha atual para salvar.");
      if (currentPassword !== userNow.password) return alert("Senha atual incorreta.");

      const name = (inputName?.value || "").trim();
      if (!name) return alert("Digite um nome válido.");

      const avatarUrl = (inputAvatar?.value || "").trim(); // file://... ou url

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

      // voltar
      if (window.app?.views?.main?.router) window.app.views.main.router.back();
      else history.back();
    });
  }

  // ---------- delete bind (profile page) ----------
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
      // se quiser manter tema, deixe aqui (senão, apaga também)
      // "sb.theme"
    ]);

    // remove tudo que começa com sb.
    const toRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;
      if (k.startsWith(prefix) && !keep.has(k)) toRemove.push(k);
    }
    toRemove.forEach(k => localStorage.removeItem(k));

    // dispara evento pra qualquer página atualizar UI/badges na hora
    document.dispatchEvent(new CustomEvent("sb:cleared"));
  }

  // ---------- scan / hooks ----------
  function scan() {
    // profile edit
    const pageEdit =
      document.querySelector('.page[data-name="profileEdit"]') ||
      document.querySelector('.page[data-name="profile-edit"]');
    if (pageEdit) bindProfileEdit(pageEdit);

    // delete
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
