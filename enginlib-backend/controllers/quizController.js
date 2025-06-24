const { Quiz, Question, QuizSubmission, QuizAnswer } = require('../models');

// Save a generated quiz from AI
exports.saveQuizFromAI = async (req, res) => {
  const { title, courseId, questions } = req.body;
  const userId = req.user.id;

  try {
    // Validate basic input
    if (!title || !courseId || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ msg: 'Missing or invalid quiz data.' });
    }

    // Step 1: Create the quiz
    const quiz = await Quiz.create({
      title,
      courseId,
      createdBy: userId,
      isPublished: false
    });

    // Step 2: Format questions and bulk-create
    const formattedQuestions = questions.map((q) => ({
      quizId: quiz.id,
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer
    }));

    await Question.bulkCreate(formattedQuestions);

    res.status(201).json({
      msg: 'Quiz saved successfully',
      quizId: quiz.id
    });
  } catch (err) {
    console.error('Error saving AI-generated quiz:', err.message);
    res.status(500).json({ msg: 'Server error while saving quiz.' });
  }
};

// Manually create quiz
exports.createQuiz = async (req, res) => {
  const { title, courseId } = req.body;
  const createdBy = req.user.id;

  try {
    if (!title || !courseId) {
      return res.status(400).json({ msg: 'Title and courseId are required' });
    }

    const quiz = await Quiz.create({
      title,
      courseId,
      createdBy,
      isPublished: false
    });

    res.status(201).json({
      msg: 'Quiz created successfully',
      quizId: quiz.id
    });
  } catch (err) {
    console.error('Error creating quiz:', err.message);
    res.status(500).json({ msg: 'Server error while creating quiz' });
  }
};

// Add questions to the created quiz
exports.addQuestionToQuiz = async (req, res) => {
  const quizId = req.params.id;
  const { questionText, options, correctAnswer } = req.body;

  try {
    const quiz = await Quiz.findByPk(quizId);
    if (!quiz) {
      return res.status(404).json({ msg: 'Quiz not found' });
    }

    if (!questionText || !Array.isArray(options) || options.length < 2 || !correctAnswer) {
      return res.status(400).json({ msg: 'Invalid question data' });
    }

    const question = await Question.create({
      quizId,
      questionText,
      options,
      correctAnswer
    });

    res.status(201).json({
      msg: 'Question added successfully',
      questionId: question.id
    });
  } catch (err) {
    console.error('Error adding question:', err.message);
    res.status(500).json({ msg: 'Server error while adding question' });
  }
};

// Starting the quiz
exports.startQuiz = async (req, res) => {
  const quizId = req.params.id;

  try {
    const quiz = await Quiz.findByPk(quizId, {
      include: [{
        model: Question,
        attributes: ['id', 'questionText', 'options']
      }]
    });

    if (!quiz) {
      return res.status(404).json({ msg: 'Quiz not found' });
    }

    if (!quiz.isPublished) {
      return res.status(403).json({ msg: 'This quiz is not yet published.' });
    }

    res.status(200).json({
      quizId: quiz.id,
      title: quiz.title,
      courseId: quiz.courseId,
      questions: quiz.Questions
    });
  } catch (err) {
    console.error('Error loading quiz:', err.message);
    res.status(500).json({ msg: 'Server error loading quiz' });
  }
};

// Editing or publishing the quiz
exports.updateQuiz = async (req, res) => {
  const quizId = req.params.id;
  const { title, courseId, isPublished } = req.body;

  try {
    const quiz = await Quiz.findByPk(quizId);
    if (!quiz) {
      return res.status(404).json({ msg: 'Quiz not found' });
    }

    if (title !== undefined) quiz.title = title;
    if (courseId !== undefined) quiz.courseId = courseId;
    if (isPublished !== undefined) quiz.isPublished = isPublished;

    await quiz.save();

    res.status(200).json({
      msg: 'Quiz updated successfully',
      quiz
    });
  } catch (err) {
    console.error('Error updating quiz:', err.message);
    res.status(500).json({ msg: 'Server error while updating quiz' });
  }
};

// Delete already created quiz
exports.deleteQuiz = async (req, res) => {
  const quizId = req.params.id;

  try {
    const quiz = await Quiz.findByPk(quizId);
    if (!quiz) {
      return res.status(404).json({ msg: 'Quiz not found' });
    }

    await quiz.destroy();

    res.status(200).json({ msg: 'Quiz deleted successfully' });
  } catch (err) {
    console.error('Error deleting quiz:', err.message);
    res.status(500).json({ msg: 'Server error while deleting quiz' });
  }
};

// Save quiz progress (A user can save his progrress and continue the quiz later
exports.saveQuizProgress = async (req, res) => {
  const quizId = req.params.id;
  const studentId = req.user.id;
  const { answers } = req.body;

  try {
    const quiz = await Quiz.findByPk(quizId);
    if (!quiz) {
      return res.status(404).json({ msg: 'Quiz not found' });
    }

    // Find or create draft submission
    let submission = await QuizSubmission.findOne({
      where: {
        quizId,
        studentId,
        status: 'in-progress'
      }
    });

    if (!submission) {
      submission = await QuizSubmission.create({
        quizId,
        studentId,
        status: 'in-progress',
        score: null
      });
    }

    // Overwrite or create answers
    for (const ans of answers) {
      const { questionId, selectedAnswer } = ans;

      const existing = await QuizAnswer.findOne({
        where: {
          submissionId: submission.id,
          questionId
        }
      });

      if (existing) {
        existing.selectedAnswer = selectedAnswer;
        await existing.save();
      } else {
        await QuizAnswer.create({
          submissionId: submission.id,
          questionId,
          selectedAnswer
        });
      }
    }

    res.status(200).json({
      msg: 'Progress saved',
      submissionId: submission.id
    });
  } catch (err) {
    console.error('Error saving quiz progress:', err.message);
    res.status(500).json({ msg: 'Server error while saving progress' });
  }
};

// Submit the quiz when finished
exports.submitQuiz = async (req, res) => {
  const quizId = req.params.id;
  const studentId = req.user.id;

  try {
    const quiz = await Quiz.findByPk(quizId, {
      include: [{ model: Question }]
    });

    if (!quiz) {
      return res.status(404).json({ msg: 'Quiz not found' });
    }

    // Try to find saved progress
    let submission = await QuizSubmission.findOne({
      where: {
        quizId,
        studentId,
        status: 'in-progress'
      },
      include: [{ model: QuizAnswer }]
    });

    // If no saved progress found, then submit the current status (ongoing answers)
    if (!submission) {
      const { answers } = req.body;

      if (!answers || !Array.isArray(answers) || answers.length === 0) {
        return res.status(400).json({ msg: 'No draft found and no answers provided.' });
      }

      submission = await QuizSubmission.create({
        quizId,
        studentId,
        status: 'submitted',
        score: null
      });

      for (const ans of answers) {
        const { questionId, selectedAnswer } = ans;
        await QuizAnswer.create({
          submissionId: submission.id,
          questionId,
          selectedAnswer
        });
      }

      submission.QuizAnswers = await QuizAnswer.findAll({
        where: { submissionId: submission.id }
      });
    }

    // Force all questions to be answered before scoring
    /*
    if (submission.QuizAnswers.length < quiz.Questions.length) {
      return res.status(400).json({ msg: 'Please answer all questions before submitting.' });
    }*/

    // Score the Quiz
    let correctCount = 0;
    for (const question of quiz.Questions) {
      const answer = submission.QuizAnswers.find(
        (a) => a.questionId === question.id
      );
      if (answer && answer.selectedAnswer === question.correctAnswer) {
        correctCount++;
      }
    }

    const totalQuestions = quiz.Questions.length;
    const score = ((correctCount / totalQuestions) * 100).toFixed(2);

    // Lock the submission
    submission.status = 'submitted';
    submission.score = score;
    await submission.save();

    res.status(200).json({
      msg: 'Quiz submitted successfully',
      score: score + "%",
      submissionId: submission.id,
      totalQuestions,
      correctAnswers: correctCount
    });

  } catch (err) {
    console.error('Error submitting quiz:', err.message);
    res.status(500).json({ msg: 'Server error during quiz submission' });
  }
};

// Review the quiz result
exports.getSubmissionResult = async (req, res) => {
  const submissionId = req.params.id;
  const user = req.user;

  try {
    const submission = await QuizSubmission.findByPk(submissionId, {
      include: [
        {
          model: Quiz,
          attributes: ['title', 'courseId'],
          include: [{ model: Question }]
        },
        {
          model: QuizAnswer
        }
      ]
    });

    if (!submission) {
      return res.status(404).json({ msg: 'Submission not found' });
    }

    // Access control: student can only view their own
    if (
      user.role === 'student' &&
      submission.studentId !== user.id
    ) {
      return res.status(403).json({ msg: 'Not authorized to view this result' });
    }

    // Build result breakdown
    const breakdown = submission.Quiz.Questions.map((question) => {
      const userAnswer = submission.QuizAnswers.find(
        (a) => a.questionId === question.id
      );

      return {
        questionId: question.id,
        questionText: question.questionText,
        options: question.options,
        correctAnswer: question.correctAnswer,
        selectedAnswer: userAnswer ? userAnswer.selectedAnswer : null,
        isCorrect: userAnswer?.selectedAnswer === question.correctAnswer
      };
    });

    res.status(200).json({
      quiz: {
        title: submission.Quiz.title,
        courseId: submission.Quiz.courseId
      },
      score: submission.score + "%",
      status: submission.status,
      breakdown
    });
  } catch (err) {
    console.error('Error loading submission result:', err.message);
    res.status(500).json({ msg: 'Server error while fetching result' });
  }
};
