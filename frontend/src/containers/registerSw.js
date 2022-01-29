// saving the service worker
const registerSw = async () => {
  if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.register('/sw.js');
      initialiseState(reg);
  } else {
      showNotAllowed("You can't send push notifications ☹️😢")
  }
};

// show status of notifications
const initialiseState = (reg) => {
  if (!reg.showNotification) {
      showNotAllowed('Showing notifications isn\'t supported ☹️😢');
      return
  }
  if (Notification.permission === 'denied') {
      showNotAllowed('You prevented us from showing notifications ☹️🤔');
      return
  }
  if (!'PushManager' in window) {
      showNotAllowed("Push isn't allowed in your browser 🤔");
      return
  }
  subscribe(reg);
}

// show the message
const showNotAllowed = (message) => {
  console.log(message);
  // const button = document.querySelector('form>button');
  // button.innerHTML = `${message}`;
  // button.setAttribute('disabled', 'true');
};

// function to hash a string
function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  const outputData = outputArray.map((output, index) => rawData.charCodeAt(index));

  return outputData;
}

// function to subscribe to notifications
const subscribe = async (reg) => {
  const subscription = await reg.pushManager.getSubscription();
  if (subscription) {
      sendSubData(subscription);
      return;
  }

  const vapidMeta = document.querySelector('meta[name="vapid-key"]');
  const key = vapidMeta.content;
  const options = {
      userVisibleOnly: true,
      // if key exists, create applicationServerKey property
      ...(key && {applicationServerKey: urlB64ToUint8Array(key)})
  };

  const sub = await reg.pushManager.subscribe(options);
  sendSubData(sub)
};

// send the subscription to server
const sendSubData = async (subscription) => {
  const browser = navigator.userAgent.match(/(firefox|msie|chrome|safari|trident)/ig)[0].toLowerCase();
  const data = {
      status_type: 'subscribe',
      subscription: subscription.toJSON(),
      browser: browser,
  };

  const res = await fetch('/webpush/save_information', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
          'content-type': 'application/json'
      },
      credentials: "include"
  });

  handleResponse(res);
};

// log results
const handleResponse = (res) => {
  console.log(res.status);
};

registerSw();



// action for install the app when clicking on the button

let defferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  defferredPrompt = e;
});

function askToInstall() {
  if (defferredPrompt == null) {
    alert("Désolé, l'installation d'appli n'est pas supportée " +
          "par ce navigateur ou l'appli est déjà installée 😥");
  } else {
    defferredPrompt.prompt();
    defferredPrompt.userChoice.then((result) => {
        if (result.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        deferredPrompt = null;
      });
  }
  Notification.requestPermission();
}

