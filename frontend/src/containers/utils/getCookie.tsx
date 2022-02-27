/**
 * Function for the reading of a cookie.
 * Fot the csrf-token, use axios instead of fetch (you don't have to use the cookie this way)
 * @param name Name of the cookie
 * @returns Value of the cookie
 */
export default function getCookie(name) {
  if (!document.cookie) {
      return null;
  }
  const xsrfCookies = document.cookie.split(';')
      .map(c => c.trim())
      .filter(c => c.startsWith(name + '='));
  if (xsrfCookies.length === 0) {
      return null;
  }
  return decodeURIComponent(xsrfCookies[0].split('=')[1]);
}
  