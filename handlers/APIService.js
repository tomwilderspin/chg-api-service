export const run = async event => Promise.resolve({
  statusCode: 200,
  body: JSON.stringify({ hello: 'poop', path: event.path }),
});

export default run;
