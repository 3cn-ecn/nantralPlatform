import React, { useState } from "react";
import ReactDOM, { render } from "react-dom";
import { Button, CloseButton } from "react-bootstrap";



/**
 * Declare an event listener which will wait until the browser launch the event
 * "beforeinstallprompt".
 * If this event is triggered, we then know that the browser in compatible with 
 * PWA and that the app is not already installed so we prompt the banner to the 
 * user.
 */
export default function addAppInstallListener(): void {
  render(
    <AppInstallBanner></AppInstallBanner>,
    document.getElementById("footer-install-app")
  );
}

/**
 * A function to decide if we must load the banner or not
 * for installing the application
 */
function AppInstallBanner(): JSX.Element {
  // declare conditions 
  const [defferredPrompt, setDefferredPrompt] = useState(null);
  const visitInApp: boolean = window.matchMedia('(display-mode: standalone)').matches;
  const appUnsupportedOrInstalled = defferredPrompt == null;
  const closed = window.sessionStorage.getItem('app-banner-closed') == "true";
  
  // initiate the event listener
  window.addEventListener('beforeinstallprompt', (e) => {
    setDefferredPrompt(e);
  });

  // test if we must not show the banner
  if (visitInApp || appUnsupportedOrInstalled || closed) {
    return <></>
  }

  /**
   * Function to install the app as a PWA
   */
  function askToInstallApp() {
    defferredPrompt.prompt();
    defferredPrompt.userChoice.then((result) => {
      if (result.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      setDefferredPrompt(null);
    });
  }

  // finally show the banner
  const isAndroid = false; // /Android/i.test(navigator.userAgent);
  return (
    <div className="app-install">
      <span className="me-4">L'appli Nantral Platform est disponible&nbsp;!&nbsp;🥳</span>
      {isAndroid ?
        <Button variant="danger" onClick={(e) => window.open("url of play store", "_self")}>
          Télécharger
        </Button>
        :
        <Button variant="danger" onClick={askToInstallApp}>
          Installer
        </Button>
      }
      <CloseButton 
        className="ms-3" 
        title="Fermer" 
        style={{verticalAlign: "middle"}} 
        onClick={() => {
          window.sessionStorage.setItem('app-banner-closed', 'true');
          setDefferredPrompt(null);
        }}
      />
    </div>
  );
}