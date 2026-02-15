// js/notifications.js
(function () {
  const PENDING_ROUTE_KEY = "sb.pendingRoute";

  function go(route) {
    if (window.app && window.app.views && window.app.views.main) {
      window.app.views.main.router.navigate(route);
      return true;
    }
    return false;
  }

  function handleRoute(route) {
    if (!route) return;
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
    if (!cordova?.plugins?.notification?.local) return;

    cordova.plugins.notification.local.hasPermission(function (granted) {
      if (granted) return;
      cordova.plugins.notification.local.requestPermission(function () { /* ok */ });
    });
  }

  function bindNotificationClick() {
    if (!cordova?.plugins?.notification?.local) return;

    cordova.plugins.notification.local.on("click", function (notification) {
      const route = notification?.data?.route;
      handleRoute(route);
    });
  }

  function init() {
    requestPermissionIfNeeded();
    bindNotificationClick();

    setTimeout(consumePendingRoute, 300);
    setTimeout(consumePendingRoute, 1200);
  }

  document.addEventListener("deviceready", init, false);

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
