/**
 * Function for the reading of a cookie
 * @param name Name of the cookie
 * @returns Value of the cookie
 */
export function getCookie(name) {
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
  
/**
 * Merge two lists of objects
 * @param a First list
 * @param b Second list
 * @returns The merged list
 */
export function merge(a:any[], b:any[]) {
    if (a == null) a = [];
    if (b == null) b = [];
    return [...new Set([...a, ...b])];
}