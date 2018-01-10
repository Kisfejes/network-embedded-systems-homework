const createUser = require('./create');
const deleteUser = require('./delete');
const listUsers = require('./list');
const updateUser = require('./update');

module.exports = (app) => {
  app.post('/users', createUser);
  app.get('/users', listUsers);
  app.delete('/users/:id', deleteUser);
  app.patch('/users/:id', updateUser);
};
