if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/static/app/sw.js') 
};

// Show Notification
function showNotification(){
  Notification.requestPermission((result)=> {
    if (result === 'granted') {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification('test',{
          body: 'ceci est un test'
        })
      })
    }   
  })
};

showNotification();