module.exports = (sequelize, DataTypes) => {
  const Devices = sequelize.define('Devices', {
    name: DataTypes.STRING,
    state: DataTypes.STRING,
    registeredDate: DataTypes.DATE,
    UID: DataTypes.STRING,
    raspberryId: {
      type: DataTypes.STRING,
      defaultValue: 'N/A'
    }
  });
  Devices.associate = (models) => {
    Devices.belongsToMany(models.Users, { through: 'UserDevices' });
    Devices.hasMany(models.AccessLogs);
  };
  return Devices;
};
