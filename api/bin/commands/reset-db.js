const { initDB, closeDB } = require('../../db/db');

module.exports = async () => {
  await initDB({ force: true });
  await closeDB();
};
