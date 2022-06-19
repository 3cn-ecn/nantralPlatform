/**
 * Format an url with path, path parameters and query parameters
 * @param path The path of the url with {0}, {1}, etc...
 * @param pathParams The list of path parameters of the url
 * @param queryParams The dict of query parameters of the url
 * @returns The complete url
 *
 * Example :
 * $ var path = "/club/{0}/member/{1}";
 * $ var pathParams = ["bde", 2];
 * $ var queryParams = {id: 5, mode: true, details='something'}
 * $ var url = formatUrl(url, pathParams, queryParams);
 * url -> /club/bde/member/2?id=5&mode=true&details=something
 */
function formatUrl(path: string, pathParams: any[] = [], queryParams: {} = {}) {
  // first we complete the path with the path parameters
  let url = path.replace(/{(\d+)}/g, (match, index) =>
    pathParams[index].toString()
  );
  // then we add the query parameters to the url
  let first = true;
  for (const key in queryParams) {
    url += first ? '?' : '&'; // add "?" if it is the first loop, else "&"
    url += key + '=' + queryParams[key];
    if (first) first = false;
  }
  return url;
}

export default formatUrl;
