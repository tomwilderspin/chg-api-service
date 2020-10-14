import SearchCHRepo from '../Repository/SearchCH';

const searchCH = new SearchCHRepo();

export const officerSearch = event => {
  const term = getSearchTerm(event);
  return searchCH.getOfficers(term);
};

export const companySearch = event => {
  const term = getSearchTerm(event);
  return searchCH.getCompanies(term);
};

function getSearchTerm(event) {
  const { queryStringParameters = {} } = event;
  const { search_term: term = '' } = queryStringParameters;
  if (!term) {
    throw new Error('name querystring param term is required for search');
  }
  return term;
}

export default { companySearch, officerSearch };
