'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HiveForum extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      HiveForum.belongsTo(models.Department, { foreignKey: 'departmentId' });
      HiveForum.hasMany(models.HiveGroup, { foreignKey: 'forumId', onDelete: 'CASCADE' });
    }
  }
  HiveForum.init({
    departmentId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    logo: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'HiveForum',
  });
  return HiveForum;
};