'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      Notification.belongsTo(models.User, { foreignKey: 'userId' });
      Notification.belongsTo(models.HivePost, { foreignKey: 'postId' });
      Notification.belongsTo(models.HiveReply, { foreignKey: 'replyId' });
    }
  }
  Notification.init({
    userId: DataTypes.INTEGER,
    postId: DataTypes.INTEGER,
    replyId: DataTypes.INTEGER,
    message: DataTypes.STRING,
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Notification',
  });
  return Notification;
};
