import config from './config/config';

const fruitNames = ['apple', 'avocado', 'banana', 'blackberry', 'blueberry', 'cherry', 'coconut', 'grape', 'kiwifruit', 'lemon', 'lime', 'lychee', 'mango', 'melon', 'orange', 'cucumber', 'pea', 'peach', 'pear', 'pineapple', 'pomelo', 'raspberry'];

const taste = ['sweet', 'sour', 'salty', 'bitter'];

// based on https://i.pinimg.com/564x/ec/50/89/ec50890bb12785cedae0f24c4cf5266d--heavy-metal-bands-heavy-metal-rock.jpg
const firstNames = ['Rancid', 'Insane', 'Black', 'Iron', 'Holy', 'Bloody', 'Satan\'s', 'Bastard', 'Forseaken', 'Hell\'s', 'Forbidden', 'Dark', 'Frantic', 'Devil\'s', 'Evil', 'Inner', 'Bleeding', 'Guilty', 'Illegal', 'Fallen', 'Crazy', 'Sinister'];

const lastnames = ['Empire', 'Fury', 'Rage', 'Zombies', 'Sin', 'Warriors', 'Angels', 'Death', 'Anarchy', 'Kill', 'Vengance', 'Magic', 'Soldier', 'Gods', 'Goblin', 'Spawn', 'Temple', 'Realm', 'Hate', 'Slaves', 'Secrets', 'Fire'];

// The maximum is inclusive and the minimum is inclusive
function _getRandomIntInclusive(min, max) {
  const roundedMin = Math.ceil(min);
  const rounddMax = Math.floor(max);
  return Math.floor(Math.random() * ((rounddMax - roundedMin) + 1)) + roundedMin;
}

function _capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function generateRandomDeviceName() {
  const randomFruit = fruitNames[_getRandomIntInclusive(0, fruitNames.length - 1)];
  const randomTaste = taste[_getRandomIntInclusive(0, taste.length - 1)];

  return `${_capitalizeFirstLetter(randomTaste)} ${_capitalizeFirstLetter(randomFruit)}`;
}

export function generateRandomUserName() {
  const randomFirstName = firstNames[_getRandomIntInclusive(0, firstNames.length - 1)];
  const randomLastName = lastnames[_getRandomIntInclusive(0, lastnames.length - 1)];

  return `${_capitalizeFirstLetter(randomFirstName)} ${_capitalizeFirstLetter(randomLastName)}`;
}

export async function fetchAPI(resource, method, data, resourceId) {
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
      if (data) {
        resourceUrl = `${resource}?userId=${data.userId}&deviceId=${data.deviceId}`;
      }
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
    case 'update':
      fetchOptions = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      };
      resourceUrl = `${resource}/${resourceId}`;
      break;
    default:
      throw new Error(`Unknown method: ${method}`);
  }

  const fetchUrl = `${config.api.baseUrl}/${resourceUrl}`;

  console.log(fetchUrl, fetchOptions);

  const fetchResult = await fetch(fetchUrl, fetchOptions);
  console.log(fetchResult);

  let responseBody = null;
  if (fetchResult.status >= 400) {
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
