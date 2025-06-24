'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class QuizSubmission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      QuizSubmission.belongsTo(models.Quiz, { foreignKey: 'quizId' });
      QuizSubmission.belongsTo(models.User, { foreignKey: 'studentId' });
      QuizSubmission.hasMany(models.QuizAnswer, { foreignKey: 'submissionId' });
    }
  }
  QuizSubmission.init({
    quizId: DataTypes.INTEGER,
    studentId: DataTypes.INTEGER,
    status: DataTypes.STRING,
    score: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'QuizSubmission',
  });
  return QuizSubmission;
};
