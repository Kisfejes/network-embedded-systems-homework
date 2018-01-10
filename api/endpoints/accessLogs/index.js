const createAccessLog = require('./create');
const listAccessLogs = require('./list');

module.exports = (app) => {
  app.post('/accesslogs', createAccessLog);
  app.get('/accesslogs', listAccessLogs);
};
