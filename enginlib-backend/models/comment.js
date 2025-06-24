'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      // Define associations here
      Comment.belongsTo(models.Material, { foreignKey: 'materialId' });  // Comment is linked to a Material
      Comment.belongsTo(models.User, { foreignKey: 'userId' });          // Comment made by a User
    }
  }

  Comment.init({
    materialId: DataTypes.INTEGER,
    commentText: DataTypes.TEXT,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Comment',
  });

  return Comment;
};

