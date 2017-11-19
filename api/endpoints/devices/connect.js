const { getDB } = require('../../db/db.js');

module.exports = async (req, res) => {
  try {
    const db = getDB();
    console.log(req.body);

    const { raspberryId, UID } = req.body;

    const device = await db.Devices.findOne({
      where: { UID }
    });

    if (!device) {
      res.status(404).send({
        message: `Device not found with UID(${UID})`
      });
      return;
    }

    await device.update({
      raspberryId,
      state: 'CONNECTED'
    });
    res.status(200).send(device);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
};
