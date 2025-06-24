'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HivePost extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      HivePost.belongsTo(models.HiveGroup, { foreignKey: 'groupId' });
      HivePost.belongsTo(models.User, { foreignKey: 'userId' });
      HivePost.hasMany(models.HiveReply, { foreignKey: 'postId', onDelete: 'CASCADE' });
      HivePost.hasMany(models.HiveReaction, { foreignKey: 'postId', onDelete: 'CASCADE' });
    }
  }
  HivePost.init({
    groupId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    content: DataTypes.TEXT,
    mediaUrl: DataTypes.STRING,
    tags: DataTypes.JSON,
    lifespan: {
      type: DataTypes.INTEGER,
      defaultValue: 129600 // Each post will be cleaned after the set value: 3 months (in minutes)
    },
    isPinned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }

  }, {
    sequelize,
    modelName: 'HivePost',
  });
  return HivePost;
};
