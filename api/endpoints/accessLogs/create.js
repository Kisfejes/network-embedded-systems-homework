const { getDB } = require('../../db/db.js');

module.exports = async (req, res) => {
  try {
    const db = getDB();

    const { body } = req;

    const { deviceUID, rfidID, accessDate, access } = body;
    console.log(body);

    const device = await db.Devices.find({ where: { UID: deviceUID }});
    if (!device) {
      console.log(`Unknown device: ${deviceUID}`);
      return;
    }

    const user = await db.Users.find({ where: { rfid: rfidID } });
    if (!user) {
      console.log(`User not found with rfid: ${rfidID}`);
      return;
    }

    const accessLog = await db.AccessLogs.create({
      accessDate,
      access
    });

    await accessLog.setUser(user);
    await accessLog.setDevice(device);

    res.status(201).send(accessLog);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
};
