const { getDB } = require('../../db/db.js');

module.exports = async (req, res) => {
  try {
    const db = getDB();
    const deviceId = req.params.id;

    await db.Devices.destroy({
      where: {
        id: deviceId
      }
    });
    res.status(204).send({});
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
};
