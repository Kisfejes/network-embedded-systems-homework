const deviceEndpoints = require('./devices');
const userEndpoints = require('./users');

module.exports = (app) => {
  deviceEndpoints(app);
  userEndpoints(app);
};
