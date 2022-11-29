/**
 * Convert the query object to a query string for an API request and
 * add it to the url.
 *
 * @params url - The original url without the query string
 * @param queryObject - The object with all query params
 * @returns A string with all query params
 *
 * @example
 * >> formatQuery('/api/club', { id: 109 })
 * '/api/club?id=109'
 */
export default function formatQuery(
  url: string,
  queryObject: Record<string, any> = {}
): string {
  return (
    url +
    Object.entries(queryObject).reduce(
      (query, [key, value]) =>
        query ? `${query}&${key}=${value}` : `?${key}=${value}`,
      ''
    )
  );
}
