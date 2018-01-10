const { getDB } = require('../../db/db.js');

module.exports = async (req, res) => {
  try {
    const db = getDB();
    const userId = parseInt(req.params.id, 10);

    const userToUpdate = await db.Users.findById(userId);
    if (!userToUpdate) {
      res.status(404).send(`User not found with id ${userId}`);
    }

    const newUserName = req.body.name;
    const newRfid = req.body.rfid;

    await userToUpdate.update({
      name: newUserName,
      rfid: newRfid
    });

    const { deviceIds } = req.body;
    await userToUpdate.setDevices(deviceIds);
    res.status(204).send();
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
};
