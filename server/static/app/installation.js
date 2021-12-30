
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(registration => {
        console.log('SW registration succeeded:', registration);
        navigator.serviceWorker.ready.then(function (registration) {
          console.log('SW is active:', registration.active);
        });
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

Notification.requestPermission();

let defferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    defferredPrompt = e;
    var opstel = confirm("Voulez vous installer Nantral-Platform sur vore appareil ?");
    if (opstel == true) {
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
  });