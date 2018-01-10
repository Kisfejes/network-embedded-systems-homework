const { getDB } = require('../../db/db.js');

module.exports = async (req, res) => {
  try {
    const db = getDB();

    console.log(req.query);

    const devices = await db.AccessLogs.findAll({
      include: [
        {
          model: db.Users,
          where: (req.query.userId !== 'null' && req.query.userId !== undefined) ? {
            id: req.query.userId
          } : {}
        },
        {
          model: db.Devices,
          where: (req.query.deviceId !== 'null' && req.query.deviceId !== undefined) ? {
            id: req.query.deviceId
          } : {}
        }
      ]
    });
    res.send(devices);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
};
