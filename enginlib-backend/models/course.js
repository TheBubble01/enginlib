'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    static associate(models) {
      // Define associations here
      Course.belongsTo(models.Department, { foreignKey: 'departmentId' });  // Course belongs to a Department
      Course.belongsTo(models.User, { foreignKey: 'uploadedBy' });          // Course uploaded by a User
      Course.hasMany(models.Material, { foreignKey: 'courseId' });          // Course can have multiple Materials
    }
  }

  Course.init({
    courseCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'unique_course_code_per_department',  // Custom unique constraint
    },
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    level: DataTypes.STRING,
    semester: DataTypes.STRING,
    departmentId: {
      type: DataTypes.INTEGER,
      allowNull: true,  // Null for general courses
      unique: 'unique_course_code_per_department',  // Custom unique constraint
    },
    uploadedBy: DataTypes.INTEGER,
    isGeneral: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,  // Defaault to false for department-specific courses
    }
  }, {
    sequelize,
    modelName: 'Course',
  });

  return Course;
};

