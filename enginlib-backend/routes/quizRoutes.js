const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Save AI-generated quiz
router.post(
  '/save-from-ai',
  authMiddleware,
  roleMiddleware(['tech-admin', 'admin']),
  quizController.saveQuizFromAI
);

// Create a quiz manually
router.post(
  '/create',
  authMiddleware,
  roleMiddleware(['tech-admin', 'admin']),
  quizController.createQuiz
);

// Add a question manually to a quiz
router.post(
  '/:id/questions/add',
  authMiddleware,
  roleMiddleware(['tech-admin', 'admin']),
  quizController.addQuestionToQuiz
);

// Entry route to the quiz
router.get(
  '/:id/start',
  authMiddleware,
  roleMiddleware(['student']),
  quizController.startQuiz
);

// For editing or publishing the quiz
router.put(
  '/:id/update',
  authMiddleware,
  roleMiddleware(['tech-admin', 'admin']),
  quizController.updateQuiz
);

// Deleting already created quiz
router.delete(
  '/:id/delete',
  authMiddleware,
  roleMiddleware(['tech-admin', 'admin']),
  quizController.deleteQuiz
);

// Save quiz progress (A user can save his progrress and continue the quiz later
router.post(
  '/:id/save-progress',
  authMiddleware,
  roleMiddleware(['student']),
  quizController.saveQuizProgress
);

// Route to submit the quiz after finishing the quiz
router.post(
  '/:id/submit',
  authMiddleware,
  roleMiddleware(['student']),
  quizController.submitQuiz
);

// Quiz result review
router.get(
  '/submissions/:id',
  authMiddleware,
  quizController.getSubmissionResult
);

module.exports = router;
