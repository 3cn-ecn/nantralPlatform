import { useState } from 'react';
import { Button, CloseButton } from 'react-bootstrap';
import { useCookies } from 'react-cookie';

/**
 * A function to decide if we must load the banner or not
 * for installing the application
 */
export function AppInstallBanner(): JSX.Element {
  // declare constants
  const [defferredPrompt, setDefferredPrompt] = useState(null);
  const [cookies, setCookie] = useCookies(['app-install-closed']);
  // declare conditions
  const visitInApp: boolean = window.matchMedia(
    '(display-mode: standalone)',
  ).matches;
  const appUnsupportedOrInstalled: boolean = defferredPrompt == null;
  const bannerClosed: boolean = cookies['app-install-closed'] || false;

  // initiate the event listener
  window.addEventListener('beforeinstallprompt', (e) => {
    setDefferredPrompt(e);
    e.preventDefault();
  });

  // test if we must not show the banner
  if (visitInApp || appUnsupportedOrInstalled || bannerClosed) {
    return <></>;
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
  const isAndroid = /Android/i.test(navigator.userAgent);
  return (
    <div className="app-install">
      <span className="me-4">
        L'appli Nantral Platform est disponible&nbsp;!&nbsp;🥳
      </span>
      {isAndroid ? (
        <Button
          variant="danger"
          onClick={() =>
            window.open(
              'https://play.google.com/store/apps/details?id=org.ecn_3cn.nantral_platform',
              '_self',
            )
          }
        >
          Télécharger
        </Button>
      ) : (
        <Button variant="danger" onClick={askToInstallApp}>
          Installer
        </Button>
      )}
      <CloseButton
        className="ms-3"
        title="Fermer"
        style={{ verticalAlign: 'middle' }}
        onClick={() => {
          window.localStorage.setItem('app-banner-closed', 'true');
          setDefferredPrompt(null);
          setCookie('app-install-closed', true, {
            path: '/',
            maxAge: 60 * 60 * 24 * 10, // cookie expires in 10 days
          });
        }}
      />
    </div>
  );
}
