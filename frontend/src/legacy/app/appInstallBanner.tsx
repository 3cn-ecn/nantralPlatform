import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

import CloseIcon from '@mui/icons-material/Close';
import { Button, IconButton, Stack, Typography } from '@mui/material';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
}

/**
 * A function to decide if we must load the banner or not
 * for installing the application
 */
export function AppInstallBanner(): JSX.Element {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  const [cookies, setCookie] = useCookies(['app-install-closed']);

  useEffect(() => {
    function handleBeforeInstallPrompt(event: Event) {
      const promptEvent = event as BeforeInstallPromptEvent;
      promptEvent.preventDefault();
      setDeferredPrompt(promptEvent);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  const visitInApp = window.matchMedia('(display-mode: standalone)').matches;

  const appUnsupportedOrInstalled = deferredPrompt === null;
  const bannerClosed = cookies['app-install-closed'] ?? false;

  if (visitInApp || appUnsupportedOrInstalled || bannerClosed) {
    return <></>;
  }

  async function askToInstallApp() {
    if (!deferredPrompt) {
      return;
    }

    await deferredPrompt.prompt();

    const result = await deferredPrompt.userChoice;

    if (result.outcome === 'accepted') {
      console.log('User accepted the A2HS prompt');
    } else {
      console.log('User dismissed the A2HS prompt');
    }

    setDeferredPrompt(null);
  }

  function closeBanner() {
    window.localStorage.setItem('app-banner-closed', 'true');

    setDeferredPrompt(null);

    setCookie('app-install-closed', true, {
      path: '/',
      maxAge: 60 * 60 * 24 * 10,
    });
  }

  const isAndroid = /Android/i.test(navigator.userAgent);

  return (
    <Stack
      direction="row"
      spacing={2}
      alignItems="center"
      className="app-install"
    >
      <Typography>L'appli Nantral Platform est disponible&nbsp;! 🥳</Typography>

      {isAndroid ? (
        <Button
          variant="contained"
          color="error"
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
        <Button variant="contained" color="error" onClick={askToInstallApp}>
          Installer
        </Button>
      )}

      <IconButton aria-label="Fermer" onClick={closeBanner} size="small">
        <CloseIcon fontSize="small" />
      </IconButton>
    </Stack>
  );
}
