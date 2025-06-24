const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Check if the text in the material is extractable
router.get(
  '/materials/:id/check-readability',
  authMiddleware,
  roleMiddleware(['tech-admin', 'admin']),
  aiController.checkMaterialReadability
);

// If the text is extractable then quiz is generated
router.post(
  '/quizzes/generate-ai',
  authMiddleware,
  roleMiddleware(['tech-admin', 'admin']),
  aiController.generateQuizFromMaterial
);

// If text is unextractable manually create quiz with the help of AI prompt
router.post(
  '/quizzes/generate-from-prompt',
  authMiddleware,
  roleMiddleware(['tech-admin', 'admin']),
  aiController.generateQuizFromPrompt
);


module.exports = router;
