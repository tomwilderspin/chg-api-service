import { companySearch } from '../lib/Controller/Search';

const RouteControllers = {
  '/search/companies': { GET: companySearch },
};

function routeEvent(router = {}) {
  return event => {
    const { path = '', httpMethod = '' } = event;
    if (!path || !httpMethod) {
      throw new Error('malformed event context');
    }
    const { [path]: { [httpMethod.toUpperCase()]: controller = null } = {} } = router;
    if (controller === null) {
      return Promise.resolve({ code: 404, data: { message: 'not found' } });
    }
    return controller(event);
  };
}

export const run = async event => {
  const router = routeEvent(RouteControllers);
  try {
    const { code = 200, data = {} } = await router(event).catch(error => {
      const { code: errorCode = 500, message = '' } = error;
      return { code: errorCode, data: { message } };
    });
    return { statusCode: code, body: JSON.stringify(data) };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};

export default run;
