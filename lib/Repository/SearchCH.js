import CompaniesHouseClient from '../DataProvider/CompaniesHouseClient';

const MAX_ITEMS_PER_PAGE = 100;
const MAX_RESULTS_LIMIT = 1000;

export default class SearchCH {
  client;

  endpoints = {
    officers: 'search/officers',
    companies: 'search/companies',
  };

  constructor() {
    this.client = new CompaniesHouseClient();
  }

  getCompanies(searchTerm) {
    console.log('companies search');
    return this.searchCh('companies', searchTerm);
  }

  getOfficers(searchTerm) {
    return this.searchCh('officers', searchTerm);
  }

  async searchCh(type, searchTerm) {
    if (!this.endpoints[type]) {
      throw new Error('invalid search type');
    }
    const recursiveFetch = async (params = {}, fetchedItems = []) => {
      const results = await this.client.getResource(this.endpoints[type], { params })
        .then(result => {
          const { data = null } = result || {};
          if (data === null) {
            return {};
          }
          return data;
        })
        .catch(error => {
          console.error('failed to search for company', error);
          return { code: 500, data: { message: 'error processing request' } };
        });
      if (results.code !== undefined) {
        return results;
      }
      const { total_results: totalResults = 0, items = [] } = results || {};
      let { items_per_page: itemsPerPage = MAX_ITEMS_PER_PAGE } = params;
      const updatedItems = [...fetchedItems, ...items];
      console.log('result', totalResults, items.length, updatedItems.length);
      // work around for CH api as it returns 429 status after result items are more than 1000.
      if (itemsPerPage + updatedItems.length > MAX_RESULTS_LIMIT) {
        itemsPerPage = MAX_RESULTS_LIMIT - updatedItems.length;
      }
      if (
        updatedItems.length === totalResults
        || updatedItems.length === MAX_RESULTS_LIMIT
        || itemsPerPage === 0
      ) {
        return { data: updatedItems };
      }
      return recursiveFetch({
        ...params,
        items_per_page: itemsPerPage,
        start_index: updatedItems.length,
      }, updatedItems);
    };
    return recursiveFetch({ q: searchTerm, items_per_page: MAX_ITEMS_PER_PAGE });
  }
}
