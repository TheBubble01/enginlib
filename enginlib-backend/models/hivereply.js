'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HiveReply extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      HiveReply.belongsTo(models.HivePost, { foreignKey: 'postId' });
      HiveReply.belongsTo(models.User, { foreignKey: 'userId' });
      HiveReply.belongsTo(models.HiveReply, { foreignKey: 'parentReplyId', as: 'parent' });
      HiveReply.hasMany(models.HiveReply, { foreignKey: 'parentReplyId', as: 'replies', onDelete: 'CASCADE' });
      HiveReply.hasMany(models.HiveReaction, { foreignKey: 'replyId', onDelete: 'CASCADE' });
    }
  }
  HiveReply.init({
    postId: DataTypes.INTEGER,
    parentReplyId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    content: DataTypes.TEXT,
    mediaUrl: DataTypes.STRING,
    tags: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'HiveReply',
  });
  return HiveReply;
};