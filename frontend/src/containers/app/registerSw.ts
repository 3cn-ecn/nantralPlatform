import axios from "../utils/axios";
import { REGISTER_URL } from "../notification/api_urls";
import { urlBase64ToUint8Array, loadVersionBrowser } from "./utils";


/**
 * Main function: register the service worker,
 * for background tasks, cache, and notifications
 */
export default function registerSw() {
  if ('serviceWorker' in navigator) {
    // The service worker has to store in the root of the app
    // http://stackoverflow.com/questions/29874068/navigator-serviceworker-is-never-ready
    navigator.serviceWorker.register('/sw.js/').then(function (reg) {
      if (Notification.permission === "granted") {
        subscribePushNotifications(reg);
      } else {
        console.log("Permission for notifications not granted")
      }
    }).catch(function (err) {
      console.log(':^(', err);
    });
  }
}


/**
 * Subscribe for push notifications once we installed the service worker
 * @param reg The service worker registration
 */
function subscribePushNotifications(reg) {
  // get constants
  const WP_PUBLIC_KEY = getPublicKey();
  var browser = loadVersionBrowser();
  // subscribe to push manager
  reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(WP_PUBLIC_KEY)
  }).then(function (sub) {
    // once we are subscribed, get subscriptions data and send it to our server
    var endpointParts = sub.endpoint.split('/');
    var registration_id = endpointParts[endpointParts.length - 1];
    var data = {
      'browser': browser.name.toUpperCase(),
      'p256dh': btoa(String.fromCharCode.apply(
        null, 
        new Uint8Array(sub.getKey('p256dh'))
      )),
      'auth': btoa(String.fromCharCode.apply(
        null, 
        new Uint8Array(sub.getKey('auth'))
      )),
      'registration_id': registration_id
    };
    sendSubscriptionData(data);
  })
}


/**
 * Send the subscription to server
 * @param subscription The subscription object
 */
function sendSubscriptionData(data) {
  axios.post(REGISTER_URL, data).then((res) =>
    console.log("Subscription registered with status " + res. status)
  ).catch((err) => 
    console.log("Fail to register subscription:" + err)
  );
}


/**
 * Get the WebPush Public Key from template (base.html)
 * @returns The VAPID Public Key for WebPush
 */
function getPublicKey() {
  const vapidMeta = document.querySelector('meta[name="vapid-key"]') as HTMLMetaElement;
  const key = vapidMeta.content;
  return key;
}
