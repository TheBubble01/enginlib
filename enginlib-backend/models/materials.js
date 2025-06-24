'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Material extends Model {
    static associate(models) {
      // Define associations here
      Material.belongsTo(models.Course, { foreignKey: 'courseId' });  // Material belongs to a Course
      Material.belongsTo(models.User, { foreignKey: 'uploadedBy' });  // Material uploaded by a User
    }
  }

  Material.init({
    courseId: DataTypes.INTEGER,
    fileType: DataTypes.STRING,
    fileSize: DataTypes.INTEGER,
    filePath: DataTypes.STRING,
    uploadedBy: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Material',
  });

  return Material;
};

