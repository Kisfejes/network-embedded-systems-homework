const deviceEndpoints = require('./devices');
const userEndpoints = require('./users');
const accessLogEndpoints = require('./accessLogs');

module.exports = (app) => {
  deviceEndpoints(app);
  userEndpoints(app);
  accessLogEndpoints(app);
};
