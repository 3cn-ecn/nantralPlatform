/**
 * List of all API endpoints to pull and push data from and to the Django server.
 */
import formatQuery from './utils/formatQuery';

// export the formatter for queries
export default formatQuery;

// export API endpoints
export const searchApi = '/api/search/';
export const getEventApi = '/api/event/';
