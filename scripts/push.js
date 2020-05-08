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
          icon: "/images/icons/icon-72x72.png",
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

// const subscribeToPushService = () => {
//   navigator.serviceWorker.getRegistration().then((reg) => {
//     console.log("Getting the reg in here");
//     reg.pushManager
//       .subscribe({
//         userVisibleOnly: true,
//       })
//       .then((sub) => {
//         console.log(sub.toJSON());
//       });
//   });
// };

// navigator.serviceWorker.ready.then((reg) => {
//   reg.pushManager.getSubscription().then((sub) => {
//     if (sub == undefined) {
//       // ask user to register for push
//       console.log("The user not subscribed");
//     } else {
//       // User subscribed, update database
//       console.log("The user is subscribed");
//     }
//   });
// });


// var firebaseConfig = {
//     apiKey: "AIzaSyCIVRHzGGcAbhPeOzAudc_d3sImjZaZi4A",
//     authDomain: "mood-tracker-f7525.firebaseapp.com",
//     databaseURL: "https://mood-tracker-f7525.firebaseio.com",
//     projectId: "mood-tracker-f7525",
//     storageBucket: "mood-tracker-f7525.appspot.com",
//     messagingSenderId: "425666970841",
//     appId: "1:425666970841:web:a3d7d02accd44c4774eac8"
//   };
//   // Initialize Firebase
// firebase.initializeApp(firebaseConfig);


// const messaging = firebase.messaging();
// messaging
//   .getToken()
//   .then((currentToken) => {
//     if (currentToken) {
//       console.log(currentToken);
//     } else {
//       // Show permission request.
//       console.log(
//         "No Instance ID token available. Request permission to generate one."
//       );
//     }
//   })
//   .catch((err) => {
//     console.log("An error occurred while retrieving token. ", err);
//   });

// messaging.onMessage((payload) => {
//   console.log("Message received. ", payload);
// });