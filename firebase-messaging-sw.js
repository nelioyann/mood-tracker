importScripts('https://www.gstatic.com/firebasejs/7.14.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.14.2/firebase-messaging.js');
var firebaseConfig = {
    apiKey: "AIzaSyCIVRHzGGcAbhPeOzAudc_d3sImjZaZi4A",
    authDomain: "mood-tracker-f7525.firebaseapp.com",
    databaseURL: "https://mood-tracker-f7525.firebaseio.com",
    projectId: "mood-tracker-f7525",
    storageBucket: "mood-tracker-f7525.appspot.com",
    messagingSenderId: "425666970841",
    appId: "1:425666970841:web:a3d7d02accd44c4774eac8"
  };
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();


messaging.setBackgroundMessageHandler(payload => {
    console.log("payload received")
    const notification = JSON.parse(payload.data.notification);
    const notificationTitle = notification.title;
    const notificationOptions = {
      body: notification.body
    };
    //Show the notification :)
    return self.registration.showNotification(
      notificationTitle,
      notificationOptions
    );
  });