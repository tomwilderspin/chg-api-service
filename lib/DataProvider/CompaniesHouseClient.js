import axios from 'axios';

const BASE_URL = 'https://api.company-information.service.gov.uk/';
const REQ_TIMEOUT = 20000;
const API_SECRET = process.env.CH_API_SECRET;
let Client;
const createClient = apiSecret => {
  // basic auth token (RFC2617) but with no username or `:` for this api.
  const authToken = Buffer.from(`${apiSecret}`).toString('base64');
  if (!Client) {
    Client = axios.create({
      baseURL: BASE_URL,
      timeout: REQ_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${authToken}`,
      },
    });
  }
  return Client;
};
export default class CompaniesHouseClient {
  client;

  constructor() {
    this.client = createClient(API_SECRET);
  }

  async getResource(resource = '', params = {}) {
    return this.client.get(resource, params);
  }
}
