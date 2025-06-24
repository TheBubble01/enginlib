'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here
      User.belongsTo(models.Department, { foreignKey: 'departmentId' });  // User belongs to one Department
      User.hasMany(models.Course, { foreignKey: 'uploadedBy' });          // User can upload multiple Courses
    }
  }

  User.init({
    username: DataTypes.STRING,
    fullName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    departmentId: DataTypes.INTEGER,
    profileDetails: DataTypes.JSON,
    profilePicture: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};

