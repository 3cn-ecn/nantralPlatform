import { AnchorHTMLAttributes, forwardRef, MouseEvent } from 'react';

const ELEMENT_WEB_URL = 'https://element.nantral-platform.fr';

const ELEMENT_X_IOS_URL =
  'https://apps.apple.com/fr/app/element-x-secure-chat-call/id1631335820';

const ELEMENT_X_ANDROID_URL =
  'https://play.google.com/store/apps/details?id=io.element.android.x';

export interface MatrixLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * Matrix identifier.
   *
   * Examples:
   *   @alice:nantral-platform.fr
   *   #general:nantral-platform.fr
   *   !roomid:nantral-platform.fr
   *   !roomid
   *
   * Omit to open the Matrix home page.
   */
  to?: string;
}

function getElementWebUrl(matrix?: string): string {
  if (!matrix) {
    return ELEMENT_WEB_URL;
  }

  if (matrix.startsWith('@')) {
    return `${ELEMENT_WEB_URL}/#/user/${encodeURIComponent(matrix)}`;
  }

  return `${ELEMENT_WEB_URL}/#/room/${encodeURIComponent(matrix)}`;
}

function getElementXUri(matrix: string): string {
  if (matrix.startsWith('@')) {
    return `element://user/${encodeURIComponent(matrix)}`;
  }

  if (matrix.startsWith('#')) {
    return `element://room/${encodeURIComponent(matrix)}`;
  }

  if (matrix.startsWith('!')) {
    return `element://room/${encodeURIComponent(matrix)}`;
  }

  return 'element://';
}

function getAppStoreUrl(): string {
  if (typeof navigator === 'undefined') {
    return ELEMENT_X_ANDROID_URL;
  }

  const userAgent = navigator.userAgent;

  if (/iPad|iPhone|iPod/.test(userAgent)) {
    return ELEMENT_X_IOS_URL;
  }

  return ELEMENT_X_ANDROID_URL;
}

function isMobile(): boolean {
  if (typeof navigator === 'undefined') {
    return false;
  }

  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}

export const MatrixLink = forwardRef<HTMLAnchorElement, MatrixLinkProps>(
  function MatrixAction({ to, onClick, ...props }, ref) {
    const href = getElementWebUrl(to);

    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(event);

      if (
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0
      ) {
        return;
      }

      // Desktop: navigate normally to Element Web.
      if (!isMobile()) {
        return;
      }

      event.preventDefault();

      const elementXUri = getElementXUri(to ?? '');

      let appOpened = false;

      const handleVisibilityChange = () => {
        if (document.visibilityState === 'hidden') {
          appOpened = true;
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);

      // Try to launch Element X.
      window.location.href = elementXUri;

      // If the app didn't open, send the user to the store.
      window.setTimeout(() => {
        document.removeEventListener(
          'visibilitychange',
          handleVisibilityChange,
        );

        if (!appOpened && document.visibilityState === 'visible') {
          window.location.href = getAppStoreUrl();
        }
      }, 1500);
    };

    return <a {...props} ref={ref} href={href} onClick={handleClick} />;
  },
);
