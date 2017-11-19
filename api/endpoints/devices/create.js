const { getDB } = require('../../db/db.js');
const { generateUID } = require('../../util/util');

module.exports = async (req, res) => {
  try {
    const db = getDB();

    const { body } = req;

    const { name } = body;
    const state = 'NOT_CONNECTED';
    const registeredDate = new Date();

    const newDevice = await db.Devices.create({
      name,
      state,
      registeredDate,
      UID: generateUID()
    });
    res.status(201).send(newDevice);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
};
