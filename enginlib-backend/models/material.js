'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Material extends Model {
    static associate(models) {
      Material.belongsTo(models.Course, { foreignKey: 'courseId' });
    }
  }

  Material.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    filePath: {
      type: DataTypes.STRING,
      allowNull: false  // Store the path to the uploaded file
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Material',
  });
// New Material.init (for testing)

// End (for the test)	
  return Material;
};

