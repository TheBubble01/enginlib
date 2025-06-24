'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Quiz extends Model {
    /**
     * Define associations here
     */
    static associate(models) {
      // A quiz belongs to a course
      Quiz.belongsTo(models.Course, { foreignKey: 'courseId' });

      // A quiz is created by a user (admin)
      Quiz.belongsTo(models.User, { foreignKey: 'createdBy' });

      // A quiz has many questions
      Quiz.hasMany(models.Question, { foreignKey: 'quizId', onDelete: 'CASCADE' });

      // A quiz has many submissions
      Quiz.hasMany(models.QuizSubmission, { foreignKey: 'quizId', onDelete: 'CASCADE' });
    }
  }

  Quiz.init({
    title: DataTypes.STRING,
    courseId: DataTypes.INTEGER,
    createdBy: DataTypes.INTEGER,
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Quiz',
    tableName: 'Quizzes',
    freezeTableName: true
  });

  return Quiz;
};
