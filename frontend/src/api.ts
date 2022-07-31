// File definition for all APIs of Nantral Platform
export default {
  // search app
  GET_SEARCH: 'api/search',
  // events
  GET_EVENT: (slug: string) => `api/event/${slug}`,
};
