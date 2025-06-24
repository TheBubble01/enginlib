'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class QuizAnswer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      QuizAnswer.belongsTo(models.QuizSubmission, { foreignKey: 'submissionId' });
      QuizAnswer.belongsTo(models.Question, { foreignKey: 'questionId' });
    }
  }
  QuizAnswer.init({
    submissionId: DataTypes.INTEGER,
    questionId: DataTypes.INTEGER,
    selectedAnswer: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'QuizAnswer',
  });
  return QuizAnswer;
};
