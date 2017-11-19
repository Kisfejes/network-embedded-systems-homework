const { getDB } = require('../../db/db.js');

module.exports = async (req, res) => {
  try {
    const db = getDB();

    const devices = await db.Devices.findAll();
    res.send(devices);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
};
