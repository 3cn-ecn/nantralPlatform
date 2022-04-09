
/**
 * Format an url with arguments
 * Example : 
 *      `format("/club/{0}/member/{1}", "bde", "2")`
 *      returns "club/bde/member/2"
 * @param url The url of the api with {0}, {1}, etc...
 * @param args The path arguments of the url
 * @param params The parameters of the request
 * @returns The complete url
 */
export default function formatUrl (url: string, args: any[] = [], params: {} = {}) {
    let res = url.replace(
        /{(\d+)}/g, 
        (match, index) => args[index].toString()
    )
    let first = true;
    for (const key in params) {
        res += first ? "?" : "&";
        res += key + "=" + params[key];
        if (first) first = false;
    }
    return res;
}
