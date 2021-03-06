const createDevice = require('./create');
const listDevices = require('./list');
const deleteDevice = require('./delete');
const connectDevice = require('./connect');
const getAccessConfig = require('./getAccessConfig');

module.exports = (app) => {
  app.get('/devices', listDevices);
  app.post('/devices', createDevice);
  app.delete('/devices/:id', deleteDevice);
  app.post('/devices/connect', connectDevice);
  app.get('/devices/access-config/:uid', getAccessConfig);
};
