if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/static/app/sw.js') 
};

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