
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
    Notification.requestPermission();
  }
}