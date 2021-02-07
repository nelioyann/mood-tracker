//  Installation de la PWA
let deferredPrompt;

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  btnAdd.style.visibility = "visible";
});

window.addEventListener("appinstalled", (evt) => {
  app.logEvent("a2hs", "installed");
  btnAdd.style.visibility = "hidden";
  console.log("it is installed");
});

btnAdd.addEventListener("click", () => {
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === "accepted") {
      console.log("User accepted the A2HS prompt");
    }
    deferredPrompt = null;
  });
});

// Push notifications

pushBtn.addEventListener("click", () => {
  Notification.requestPermission(function (status) {
    console.log("Notification permission status:", status);
    if (status == "granted") {
      pushBtn.style.visibility = "hidden";
    }
  });
});

if ("Notification" in window) {
  if (Notification.permission == "granted") pushBtn.style.visibility = "hidden";
}
if (!("Notification" in window)) pushBtn.style.visibility = "hidden";

function displayNotification(title, body, tag) {
  if (Notification.permission == "granted") {
    navigator.serviceWorker
      .getRegistration()
      .then(function (reg) {
        var options = {
          body: body,
          tag: tag,
          icon: "/images/icons/apple-icon-180.png",
          vibrate: [100, 50, 100],
          data: {
            dateOfArrival: Date.now(),
            primaryKey: 1,
          },
        };
        reg.showNotification(title, options);
      })
      .catch((err) => console.log(err));
  }
}
