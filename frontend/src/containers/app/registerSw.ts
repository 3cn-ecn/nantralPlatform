import axios from "../utils/axios";
import { REGISTER_URL } from "../notification/api_urls";
import { urlBase64ToUint8Array, loadVersionBrowser } from "./utils";

// In your ready listener
export default function registerSw() {
  const WP_PUBLIC_KEY = getPublicKey();
  if ('serviceWorker' in navigator) {
    // The service worker has to store in the root of the app
    // http://stackoverflow.com/questions/29874068/navigator-serviceworker-is-never-ready
    var browser = loadVersionBrowser();
    navigator.serviceWorker.register('/sw.js').then(function (reg) {
      reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(WP_PUBLIC_KEY)
      }).then(function (sub) {
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
    }).catch(function (err) {
      console.log(':^(', err);
    });
  }
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
