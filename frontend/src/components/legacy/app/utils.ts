/**
 * function to hash a string
 * @param base64String A string not hashed
 * @returns A hashed string
 */
export function urlBase64ToUint8Array(base64String) {
  var padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  var base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);
  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Load the version of browser
 * @returns A dict with name and version of the browser
 */
export function loadVersionBrowser() {
  if ('userAgentData' in navigator) {
    // navigator.userAgentData is not available in
    // Firefox and Safari
    const uaData = (navigator as any).userAgentData;
    // Outputs of navigator.userAgentData.brands[n].brand are e.g.
    // Chrome: 'Google Chrome'
    // Edge: 'Microsoft Edge'
    // Opera: 'Opera'
    let browsername;
    let browserversion;
    let chromeVersion = null;
    for (var i = 0; i < uaData.brands.length; i++) {
      let brand = uaData.brands[i].brand;
      browserversion = uaData.brands[i].version;
      if (
        brand.match(/opera|chrome|edge|safari|firefox|msie|trident/i) !== null
      ) {
        // If we have a chrome match, save the match, but try to find another match
        // E.g. Edge can also produce a false Chrome match.
        if (brand.match(/chrome/i) !== null) {
          chromeVersion = browserversion;
        }
        // If this is not a chrome match return immediately
        else {
          browsername = brand.substr(brand.indexOf(' ') + 1);
          return {
            name: browsername,
            version: browserversion,
          };
        }
      }
    }
    // No non-Chrome match was found. If we have a chrome match, return it.
    if (chromeVersion !== null) {
      return {
        name: 'chrome',
        version: chromeVersion,
      };
    }
  }
  // If no userAgentData is not present, or if no match via userAgentData was found,
  // try to extract the browser name and version from userAgent
  const userAgent = navigator.userAgent;
  var ua = userAgent,
    tem,
    M =
      ua.match(
        /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i
      ) || [];
  if (/trident/i.test(M[1])) {
    tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
    return { name: 'IE', version: tem[1] || '' };
  }
  if (M[1] === 'Chrome') {
    tem = ua.match(/\bOPR\/(\d+)/);
    if (tem != null) {
      return { name: 'Opera', version: tem[1] };
    }
  }
  M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
  if ((tem = ua.match(/version\/(\d+)/i)) != null) {
    M.splice(1, 1, tem[1]);
  }
  return {
    name: M[0],
    version: M[1],
  };
}
