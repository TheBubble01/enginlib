'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HiveGroup extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      HiveGroup.belongsTo(models.HiveForum, { foreignKey: 'forumId' });
      HiveGroup.belongsTo(models.User, { foreignKey: 'createdBy' });
      HiveGroup.hasMany(models.HivePost, { foreignKey: 'groupId', onDelete: 'CASCADE' });
    }
  }
  HiveGroup.init({
    forumId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    createdBy: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'HiveGroup',
  });
  return HiveGroup;
};