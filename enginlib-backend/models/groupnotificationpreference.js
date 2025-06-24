'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GroupNotificationPreference extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      GroupNotificationPreference.belongsTo(models.User, { foreignKey: 'userId' });
      GroupNotificationPreference.belongsTo(models.HiveGroup, { foreignKey: 'groupId' });

    }
  }
  GroupNotificationPreference.init({
    userId: DataTypes.INTEGER,
    groupId: DataTypes.INTEGER,
    pinNotifications: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'GroupNotificationPreference',
  });
  return GroupNotificationPreference;
};
