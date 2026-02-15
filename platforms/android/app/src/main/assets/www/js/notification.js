// js/notifications.js
(function () {
  const PENDING_ROUTE_KEY = "sb.pendingRoute";

  function go(route) {
    // tenta navegar quando o Framework7 já existe
    if (window.app && window.app.views && window.app.views.main) {
      window.app.views.main.router.navigate(route);
      return true;
    }
    return false;
  }

  function handleRoute(route) {
    if (!route) return;
    // se o router ainda não tá pronto, salva e navega depois
    if (!go(route)) {
      localStorage.setItem(PENDING_ROUTE_KEY, route);
    }
  }

  function consumePendingRoute() {
    const route = localStorage.getItem(PENDING_ROUTE_KEY);
    if (route) {
      localStorage.removeItem(PENDING_ROUTE_KEY);
      handleRoute(route);
    }
  }

  function requestPermissionIfNeeded() {
    // Android 13+ pode precisar; em muitos casos o plugin já resolve, mas isso ajuda.
    if (!cordova?.plugins?.notification?.local) return;

    cordova.plugins.notification.local.hasPermission(function (granted) {
      if (granted) return;
      cordova.plugins.notification.local.requestPermission(function () { /* ok */ });
    });
  }

  function bindNotificationClick() {
    if (!cordova?.plugins?.notification?.local) return;

    // Quando o usuário toca na notificação
    cordova.plugins.notification.local.on("click", function (notification) {
      const route = notification?.data?.route;
      handleRoute(route);
    });
  }

  function init() {
    requestPermissionIfNeeded();
    bindNotificationClick();

    // Se o app abriu “frio” e o router demorou, tenta consumir rota pendente
    setTimeout(consumePendingRoute, 300);
    setTimeout(consumePendingRoute, 1200);
  }

  document.addEventListener("deviceready", init, false);

  // expõe um helper pra agendar (vamos usar no register)
  window.SBNotify = {
    scheduleActivity: function ({ id = 101, title, text, at, route }) {
      if (!cordova?.plugins?.notification?.local) return;

      cordova.plugins.notification.local.schedule({
        id,
        title: title || "Nova atividade",
        text: text || "Clique para abrir",
        trigger: { at: at || new Date(Date.now() + 10 * 1000) }, // default: 10s
        foreground: true,
        data: { route }
      });
    }
  };
})();
