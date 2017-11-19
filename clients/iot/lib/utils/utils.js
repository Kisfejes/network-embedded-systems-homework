const fetch = require('node-fetch');
const config = require('../../config/config');

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

async function fetchAPI(resource, method, data) {
  let resourceUrl = '';
  let fetchOptions = {};

  switch (method) {
    case 'create':
      resourceUrl = resource;
      fetchOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      };
      break;
    case 'list':
      resourceUrl = resource;
      fetchOptions = {
        method: 'GET'
      };
      break;
    case 'delete':
      fetchOptions = {
        method: 'DELETE'
      };
      resourceUrl = `${resource}/${data}`;
      break;
    case 'connect':
      resourceUrl = `${resource}/connect`;
      fetchOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      };
      break;
    default:
      throw new Error(`Unknown method: ${method}`);
  }

  const fetchUrl = `${config.api.baseUrl}/${resourceUrl}`;

  console.log(fetchUrl, fetchOptions);

  const fetchResult = await fetch(fetchUrl, fetchOptions);

  let responseBody = null;
  if (fetchResult.status >= 400) {
    try {
      responseBody = await fetchResult.json();
      console.log(responseBody);
    } catch (err) {
      console.log('no error body');
    }
    throw new Error(`Failed to fetch: ${fetchResult.statusText} ${fetchResult.status}`);
  } else if (fetchResult.status === 200 || fetchResult.status === 201) {
    try {
      responseBody = await fetchResult.json();
    } catch (err) {
      console.log(err);
      responseBody = null;
    }
    return responseBody;
  } else {
    responseBody = null;
  }
  return responseBody;
}

module.exports = {
  getRandomNumber,
  fetchAPI
};
