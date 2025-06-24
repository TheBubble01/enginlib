'use strict';
const { Model } = require('sequelize');

// Import HiveForum model manually for sync
//const { HiveForum } = require('./index');

module.exports = (sequelize, DataTypes) => {
  class Department extends Model {
    static associate(models) {
      Department.hasMany(models.User, { foreignKey: 'departmentId' });
      Department.hasMany(models.Course, { foreignKey: 'departmentId' });
    }
  }

  Department.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    logo: DataTypes.STRING,
    customizations: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'Department',
  });

  // Auto-sync HiveForum when department changes
  Department.afterCreate(async (department, options) => {
    const HiveForum = require('./').HiveForum;
    await HiveForum.create({
      departmentId: department.id,
      name: department.name,
      description: department.description,
      logo: department.logo
    });
  });

  Department.afterUpdate(async (department, options) => {
    const HiveForum = require('./').HiveForum;
    const forum = await HiveForum.findOne({ where: { departmentId: department.id } });
    if (forum) {
      forum.name = department.name;
      forum.description = department.description;
      forum.logo = department.logo;
      await forum.save();
    }
  });

  Department.afterDestroy(async (department, options) => {
    const HiveForum = require('./').HiveForum;
    await HiveForum.destroy({ where: { departmentId: department.id } });
  });

  return Department;
};
