module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    name: DataTypes.STRING,
    rfid: DataTypes.STRING
  });
  Users.associate = (models) => {
    Users.belongsToMany(models.Devices, { through: 'UserDevices' });
  };
  return Users;
};
