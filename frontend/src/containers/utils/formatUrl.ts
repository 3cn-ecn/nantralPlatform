/**
 * Format an url with arguments and query params
 * @param path The path of the url with {0}, {1}, etc...
 * @param pathParams The list of path parameters of the url
 * @param queryParams The dict of query parameters of the url
 * @returns The complete url
 * 
 * Example : 
 * $ var path = "/club/{0}/member/{1}";
 * $ var pathParams = ["bde", "2"];
 * $ var queryParams = {id: 5, mode: true, details='something'}
 * $ var url = formatUrl(url, pathParams, queryParams);
 * url -> club/bde/member/2?id=5&mode=true&details=something
 */
export default function formatUrl(path: string, pathParams: any[] = [], queryParams: {} = {}) {
    let url = path.replace(
        /{(\d+)}/g, 
        (match, index) => pathParams[index].toString()
    )
    let first = true;
    for (const key in queryParams) {
        url += first ? "?" : "&";
        url += key + "=" + queryParams[key];
        if (first) first = false;
    }
    return url;
}
