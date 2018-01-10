const { getDB } = require('../../db/db.js');

module.exports = async (req, res) => {
  try {
    const db = getDB();
    const deviceUID = req.params.uid;

    const device = await db.Devices.find({
      where: { UID: deviceUID }
    });

    if (!device) {
      return res.status(404).send();
    }

    const allowedUsers = await device.getUsers();
    console.log(allowedUsers);

    const rfids = allowedUsers.map(allowedUser => allowedUser.rfid);
    res.send({ rfids });
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
};
