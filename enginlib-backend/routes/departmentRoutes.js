const express = require('express');
const { check } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const departmentController = require('../controllers/departmentController');

const router = express.Router();

// Create a department (Tech Admin only)
router.post(
  '/create',
  authMiddleware,
  roleMiddleware(['tech-admin']),
  [
    check('name', 'Department name is required').not().isEmpty()
  ],
  departmentController.createDepartment
);

// Get all departments (Tech Admin only)
router.get(
  '/',
  authMiddleware,
  roleMiddleware(['tech-admin']),
  departmentController.getAllDepartments
);

// Update a department (Tech Admin only)
router.put(
  '/update/:id',
  authMiddleware,
  roleMiddleware(['tech-admin']),
  [
    check('name', 'Department name is required').not().isEmpty()
  ],
  departmentController.updateDepartment
);

// Delete a department (Tech Admin only)
router.delete(
  '/delete/:id',
  authMiddleware,
  roleMiddleware(['tech-admin']),
  departmentController.deleteDepartment
);

module.exports = router;

