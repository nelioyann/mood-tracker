
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // path from the root folder
    navigator.serviceWorker
      .register("./sw.js")
      .then((reg) => {
        messaging.useServiceWorker(reg);
      })
      .catch((err) => console.log("service worker not registered"));
  });
}
