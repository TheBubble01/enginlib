'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HiveReaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      HiveReaction.belongsTo(models.User, { foreignKey: 'userId' });
      HiveReaction.belongsTo(models.HivePost, { foreignKey: 'postId' });
      HiveReaction.belongsTo(models.HiveReply, { foreignKey: 'replyId' });
    }
  }
  HiveReaction.init({
    userId: DataTypes.INTEGER,
    postId: DataTypes.INTEGER,
    replyId: DataTypes.INTEGER,
    type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'HiveReaction',
  });
  return HiveReaction;
};