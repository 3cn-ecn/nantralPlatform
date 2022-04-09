import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging/sw";

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
const firebaseApp = initializeApp({
  apiKey: "AIzaSyBBbDS1ijUYrVvmICiWloPZEkMQgqy20-k",
  authDomain: "nantral-platform.firebaseapp.com",
  projectId: "nantral-platform",
  storageBucket: "nantral-platform.appspot.com",
  messagingSenderId: "1087095901919",
  appId: "1:1087095901919:web:d941ee535d9e974d09636a"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = getMessaging(firebaseApp);