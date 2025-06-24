'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class DiscussionPost extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here
      DiscussionPost.belongsTo(models.User, { foreignKey: 'userId' }); // Each post is authored by a User
    }
  }

  DiscussionPost.init({
    userId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),  // Make sure this line is correct
      allowNull: false  // Allow null values if needed
    }
  }, {
    sequelize,
    modelName: 'DiscussionPost',
  });

  return DiscussionPost;
};

