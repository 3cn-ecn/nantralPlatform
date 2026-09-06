import { AnchorHTMLAttributes, forwardRef } from 'react';

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
   */
  to: string;
}

export type MatrixHomeLinkProps = AnchorHTMLAttributes<HTMLAnchorElement>;

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
  function MatrixLink({ to, ...props }, ref) {
    const href = isMobile() ? getElementXUri(to) : getElementWebUrl(to);

    return <a {...props} ref={ref} href={href} />;
  },
);

export const MatrixHomeLink = forwardRef<
  HTMLAnchorElement,
  MatrixHomeLinkProps
>(function MatrixHomeLink({ ...props }, ref) {
  const href = isMobile() ? getAppStoreUrl() : ELEMENT_WEB_URL;

  return <a {...props} ref={ref} href={href} />;
});
