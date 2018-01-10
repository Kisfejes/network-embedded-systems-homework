const { getDB } = require('../../db/db.js');

module.exports = async (req, res) => {
  try {
    const db = getDB();

    const users = await db.Users.findAll({
      include: {
        model: db.Devices,
        attributes: ['id', 'name', 'UID']
      },
      order: [
        ['id']
      ]
    });
    res.send(users);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
};
