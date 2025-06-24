'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Question.belongsTo(models.Quiz, { foreignKey: 'quizId' });
    }
  }
  Question.init({
    quizId: DataTypes.INTEGER,
    questionText: DataTypes.TEXT,
    options: DataTypes.JSON,
    correctAnswer: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Question',
  });
  return Question;
};
