import {initializeApp} from "firebase/app";
import {getMessaging, getToken} from "firebase/messaging";

import axios from "../utils/axios";
import {registerUrl} from "../notification/api_urls";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBBbDS1ijUYrVvmICiWloPZEkMQgqy20-k",
  authDomain: "nantral-platform.firebaseapp.com",
  projectId: "nantral-platform",
  storageBucket: "nantral-platform.appspot.com",
  messagingSenderId: "1087095901919",
  appId: "1:1087095901919:web:d941ee535d9e974d09636a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);


/**
 * Main function to register the service worker, and some other stuff 
 * associated, like subscribe to the notifications and clear the badge counter
 */
const registerSw = async () => {

  if ('serviceWorker' in navigator) {

    // register the serice worker
    const reg = await navigator.serviceWorker.register('/sw.js');

    // try to subscribe to notifications
    if (!reg.showNotification) {
      console.log('Showing notifications isn\'t supported');
    } else if (Notification.permission === 'denied') {
      console.log('Permission denied for notifications');
    } else if (!('PushManager' in window)) {
      console.log("Push isn't allowed in your browser 🤔");
    } else {
      subscribe(reg);
    }

    // clear the badge since we just opened the app
    if ('clearAppBadge' in navigator) {
      (navigator as any).clearAppBadge().catch((error) => {
        console.log("Cannot clear badge.");
      });
    }

  } else {
    // if service workers are not supported
    console.log("Navigator doesn't support service worker.")
  }
};




/**
 * Asynchronous function to subscribe to notifications
 * @param reg The registration of the service worker
 * @returns None
//  */
const subscribe = async (reg) => {
  // check if already subscribed
  const subscription = await reg.pushManager.getSubscription();
  if (subscription) return;
  // else create the subscription
  const key = "BOmXcqrHbWJVHuO25dHxU8KPGC34pBZCzCh80KQFLTproeb5BvwcbSz8bxEnWWK2vw4F_6tE6OWc3BP-eEi8qzg";
  const options = {
      userVisibleOnly: true,
      // if key exists, create applicationServerKey property
      ...(key && {applicationServerKey: urlBase64ToUint8Array(key)})
  };

  const sub = await reg.pushManager.subscribe(options);
  
  getToken(messaging, {vapidKey: key}).then(currentToken => {
    if (currentToken) {
      sendSubData(sub, currentToken);
    } else {
      console.log("No registration token available");
    }
  });

};



/**
 * Send the subscription to server
 * @param subscription The subscription object
 */
const sendSubData = async (subscription, currentToken) => {
  const browser = loadVersionBrowser();
  var data = {
    'browser': browser.name.toUpperCase(),
    'p256dh': btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('p256dh')))),
    'auth': btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('auth')))),
    'registration_id': currentToken
  };
  axios.post(registerUrl, data).then((res) =>
    console.log("Service worker registration result: " + res. status)
  );
};



/**
 * function to hash a string
 * @param base64String A string not hashed
 * @returns A hashed string
 */
 function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  const outputData = outputArray.map((output, index) => rawData.charCodeAt(index));

  return outputData;
}



/**
 * Load the version of browser
 * @returns A dict with name and version of the browser
 */
function loadVersionBrowser () {
  if ("userAgentData" in navigator) {
    // navigator.userAgentData is not available in
    // Firefox and Safari
    const uaData = (navigator as any).userAgentData;
    // Outputs of navigator.userAgentData.brands[n].brand are e.g.
    // Chrome: 'Google Chrome'
    // Edge: 'Microsoft Edge'
    // Opera: 'Opera'
    let browsername;
    let browserversion;
    let chromeVersion = null;
    for (var i = 0; i < uaData.brands.length; i++) {
      let brand = uaData.brands[i].brand;
      browserversion = uaData.brands[i].version;
      if (brand.match(/opera|chrome|edge|safari|firefox|msie|trident/i) !== null) {
        // If we have a chrome match, save the match, but try to find another match
        // E.g. Edge can also produce a false Chrome match.
        if (brand.match(/chrome/i) !== null) {
          chromeVersion = browserversion;
        }
        // If this is not a chrome match return immediately
        else {
          browsername = brand.substr(brand.indexOf(' ')+1);
          return {
            name: browsername,
            version: browserversion
          }
        }
      }
    }
    // No non-Chrome match was found. If we have a chrome match, return it.
    if (chromeVersion !== null) {
      return {
        name: "chrome",
        version: chromeVersion
      }
    }
  }
  // If no userAgentData is not present, or if no match via userAgentData was found,
  // try to extract the browser name and version from userAgent
  const userAgent = navigator.userAgent;
  var ua = userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
  if (/trident/i.test(M[1])) {
    tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
    return {name: 'IE', version: (tem[1] || '')};
  }
  if (M[1] === 'Chrome') {
    tem = ua.match(/\bOPR\/(\d+)/);
    if (tem != null) {
      return {name: 'Opera', version: tem[1]};
    }
  }
  M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
  if ((tem = ua.match(/version\/(\d+)/i)) != null) {
    M.splice(1, 1, tem[1]);
  }
  return {
    name: M[0],
    version: M[1]
  };
};



export default registerSw;