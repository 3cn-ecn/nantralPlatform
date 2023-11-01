/**
 * Build an absolute url from a path
 * @param path - The path to build the url from
 * @returns The absolute url
 *
 * @example
 * > buildAbsoluteUrl('/login')
 * 'https://nantral-platform.fr/login'
 * > buildAbsoluteUrl('login')
 * 'https://nantral-platform.fr/login'
 * > buildAbsoluteUrl('https://google.fr/login')
 * 'https://google.fr/login'
 */
export function buildAbsoluteUrl(path: string) {
  return new URL(path, window.location.origin).href;
}
