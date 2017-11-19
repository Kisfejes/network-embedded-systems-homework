const { getDB } = require('../../db/db.js');
const { generateUID } = require('../../util/util');

module.exports = async (req, res) => {
  try {
    const db = getDB();

    const { body } = req;

    const { name, rfid, deviceIds } = body;

    const newUser = await db.Users.create({
      name,
      rfid
    });
    console.log(newUser.addDevice);
    if (deviceIds && Array.isArray(deviceIds)) {
      const devices = await db.Devices.findAll({
        where: {
          id: { $in: deviceIds }
        }
      });
      console.log(devices);
      await newUser.addDevices(devices);
      // for (const deviceId of deviceIds) { // eslint-disable-line
      //   console.log('newUser.id', newUser.id);
      //   console.log('device.id', deviceId);
      //   const deviceToAdd = await db.Devices.findById(deviceId);
      //   if (deviceToAdd) {

      //   }
      //   // await db.UserDevices.create({ // eslint-disable-line
      //   //   UserId: newUser.id,
      //   //   DeviceId: deviceId
      //   // });
      // }
    }

    res.status(201).send(newUser);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
};
