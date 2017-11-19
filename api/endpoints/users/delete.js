const { getDB } = require('../../db/db.js');

module.exports = async (req, res) => {
  try {
    const db = getDB();

    const userId = req.params.id;

    await db.Users.destroy({
      where: {
        id: userId
      }
    });
    res.status(204).send({});
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
};
