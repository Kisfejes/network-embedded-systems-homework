module.exports = (sequelize, DataTypes) => {
  const AccessLogs = sequelize.define('AccessLogs', {
    accessDate: DataTypes.DATE,
    access: DataTypes.BOOLEAN
  });
  AccessLogs.associate = (models) => {
    AccessLogs.belongsTo(models.Users);
    AccessLogs.belongsTo(models.Devices);
  };
  return AccessLogs;
};
