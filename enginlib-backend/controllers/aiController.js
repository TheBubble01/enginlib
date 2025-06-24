const { Material } = require('../models');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const textract = require('textract');

exports.checkMaterialReadability = async (req, res) => {
  const materialId = req.params.id;

  try {
    const material = await Material.findByPk(materialId);
    if (!material) {
      return res.status(404).json({ msg: 'Material not found' });
    }

    const filePath = path.resolve(material.filePath);
    const ext = path.extname(filePath).toLowerCase();
    const allowedTextFormats = ['.docx', '.doc', '.pptx', '.ppt', '.txt', '.rtf'];

    let fullText = '';

    if (ext === '.pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const parsed = await pdfParse(dataBuffer);
      fullText = parsed.text;
    } else if (allowedTextFormats.includes(ext)) {
      fullText = await new Promise((resolve, reject) => {
        textract.fromFileWithPath(filePath, (err, text) => {
          if (err) reject(err);
          else resolve(text);
        });
      });
    } else {
      return res.json({
        readable: false,
        reason: "Unsupported file format for quiz generation",
        canGenerateQuiz: false
      });
    }

    if (!fullText || fullText.trim().length < 30) {
      return res.json({
        readable: false,
        reason: 'No extractable text found. The file may be scanned or image-based.',
        canGenerateQuiz: false
      });
    }

    const words = fullText.trim().split(/\s+/);
    const previewWords = words.slice(0, 400).join(' ');

    res.json({
      readable: true,
      canGenerateQuiz: true,
      preview: previewWords,
      charCount: fullText.length
    });
  } catch (error) {
    console.error('Text extraction error:', error.message);
    res.status(500).json({
      readable: false,
      reason: 'Text extraction failed due to a server error.',
      canGenerateQuiz: false
    });
  }
};

exports.generateQuizFromMaterial = async (req, res) => {
  const { materialId } = req.body;

  try {
    const material = await Material.findByPk(materialId);
    if (!material) {
      return res.status(404).json({ msg: 'Material not found' });
    }

    const ext = path.extname(material.filePath).toLowerCase();
    const filePath = path.resolve(material.filePath);

    let fullText = '';

    if (ext === '.pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const parsed = await pdfParse(dataBuffer);
      fullText = parsed.text;
    } else {
      fullText = await new Promise((resolve, reject) => {
        textract.fromFileWithPath(filePath, (err, text) => {
          if (err) reject(err);
          else resolve(text);
        });
      });
    }

    if (!fullText || fullText.trim().length < 50) {
      return res.status(400).json({
        msg: 'Unable to extract sufficient text for quiz generation.'
      });
    }

    // ✨ MOCK AI QUIZ OUTPUT (simulated)
    const mockQuiz = {
      title: `Auto-Generated Quiz from: ${material.filePath.split('/').pop()}`,
      questions: [
        {
          questionText: "What is the primary focus of this material?",
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: "Option A"
        },
        {
          questionText: "Which concept is explained in the second section?",
          options: ["Concept A", "Concept B", "Concept C", "Concept D"],
          correctAnswer: "Concept B"
        },
        {
          questionText: "How is the process described in the document categorized?",
          options: ["Theoretical", "Practical", "Experimental", "None"],
          correctAnswer: "Practical"
        }
      ]
    };

    res.status(200).json({
      generatedFrom: materialId,
      preview: fullText.substring(0, 300),
      quiz: mockQuiz
    });

  } catch (err) {
    console.error('AI generation error:', err.message);
    res.status(500).json({ msg: 'Failed to generate quiz' });
  }
};

exports.generateQuizFromPrompt = async (req, res) => {
  const { prompt } = req.body;

  try {
    if (!prompt || prompt.trim().length < 10) {
      return res.status(400).json({ msg: 'Prompt is too short or missing.' });
    }

    // 🧠 MOCK AI-generated quiz from admin prompt
    const mockQuiz = {
      title: 'Quiz: ' + prompt.slice(0, 50).replace(/\.$/, '') + '...',
      questions: [
        {
          questionText: "What is the primary concept behind this topic?",
          options: ["Theory A", "Theory B", "Theory C", "Theory D"],
          correctAnswer: "Theory A"
        },
        {
          questionText: "Which method is often used in this field?",
          options: ["Method X", "Method Y", "Method Z", "Method W"],
          correctAnswer: "Method Y"
        },
        {
          questionText: "Which scenario best demonstrates the concept?",
          options: ["Scenario 1", "Scenario 2", "Scenario 3", "Scenario 4"],
          correctAnswer: "Scenario 3"
        }
      ]
    };

    res.status(200).json({
      generatedFromPrompt: prompt,
      quiz: mockQuiz
    });

  } catch (err) {
    console.error('Error generating quiz from prompt:', err.message);
    res.status(500).json({ msg: 'Server error during prompt-based generation.' });
  }
};
