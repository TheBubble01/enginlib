const express = require('express');
const { check } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const materialController = require('../controllers/materialController');
const upload = require('../config/uploadConfig');

const router = express.Router();

// Upload a material
router.post(
  '/upload',
  authMiddleware,
  roleMiddleware(['tech-admin', 'admin']),
  upload.single('file'), // Multer middleware for single file upload

  (err, req, res, next) => {
    // Handle multer errors
    if (err) {
      // Handle multiple files error
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({ msg: 'Only one file can be uploaded at a time.'});
      }
      // Handle all other errors
      return res.status(400).json({ msg: err.message });
    }
    next();
  },

  materialController.uploadMaterial
);

// Preview a material
router.get(
  '/preview/:id',
  authMiddleware,
  materialController.previewMaterial
);

// Download a material
router.get(
  '/download/:id',
  authMiddleware,
  materialController.downloadMaterial
);

// Retrieve materials by course
router.get(
  '/course/:courseId',
  authMiddleware,
  roleMiddleware(['tech-admin', 'admin', 'student']),
  materialController.getMaterialsByCourse
);

// Update a material
router.put(
  '/update/:id',
  authMiddleware,
  roleMiddleware(['tech-admin', 'admin']),
  [
    check('title', 'Material title is required').optional().not().isEmpty()
  ],
  materialController.updateMaterial
);

// Delete a material
router.delete(
  '/delete/:id',
  authMiddleware,
  roleMiddleware(['tech-admin', 'admin']),
  materialController.deleteMaterial
);

module.exports = router;

