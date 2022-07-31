import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

/**
 * Formt the query paramters to a string for the request
 *
 * @param queryParams The object with all query params
 * @returns A string with all query params
 */
function formatQuery(queryParams: Record<string, any> = {}): string {
  return Object.entries(queryParams).reduce(
    (query, [key, value]) =>
      query ? `${query}&${key}=${value}` : `?${key}=${value}`,
    ''
  );
}

/**
 * An object with different methods to fetch an API.
 */
const fetchAPI = {
  /**
   * Fetch the API with GET method.
   * Use GET to get data from the server.
   *
   * @param endpoint The base of the url
   * @param queryParams The query paramters (optional)
   * @returns A promise of the response
   */
  async get<ResponseType>(endpoint: string, queryParams?: Record<string, any>) {
    const url = endpoint + formatQuery(queryParams);
    return axios.get<ResponseType>(url);
  },

  /**
   * Fetch the API with POST method.
   * Use POST to send new data to the server.
   *
   * @param endpoint The base of the url
   * @param queryParams The query parameters (optional)
   * @param data The data to include in the request body (optional)
   * @returns A promise of the response
   */
  async post<ResponseType>(
    endpoint: string,
    queryParams?: Record<string, unknown>,
    data?: any
  ) {
    const url = endpoint + formatQuery(queryParams);
    return axios.post<ResponseType>(url, data);
  },

  /**
   * Fetch the API with PUT method.
   * Use PUT to updata some data on the server.
   *
   * @param endpoint The base of the url
   * @param queryParams The query parameters (optional)
   * @param data The data to include in the request body (optional)
   * @returns A promise of the response
   */
  async put<ResponseType>(
    endpoint: string,
    queryParams?: Record<string, unknown>,
    data?: any
  ) {
    const url = endpoint + formatQuery(queryParams);
    return axios.put<ResponseType>(url, data);
  },

  /**
   * Fetch the API with DELETE method.
   * Use DELETE to delete data on the server.
   *
   * @param endpoint The base of the url
   * @param queryParams The query parameters (optional)
   * @returns A promise of the response
   */
  async delete<ResponseType>(
    endpoint: string,
    queryParams?: Record<string, unknown>
  ) {
    const url = endpoint + formatQuery(queryParams);
    return axios.delete<ResponseType>(url);
  },
};

export default fetchAPI;
