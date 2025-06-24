const express = require('express');
const { check } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const courseController = require('../controllers/courseController');

const router = express.Router();

// Create a course (Tech Admins and Regular Admins only)
router.post(
  '/create',
  authMiddleware, // Check if the user is authenticated
  roleMiddleware(['tech-admin', 'admin']), // Only Tech Admins and Admins can create a course
  [
    check('title', 'Course title is required').not().isEmpty(),
    check('description', 'Course description is required').not().isEmpty(),
    check('courseCode', 'Course code is required').not().isEmpty(),
    check('level', 'Level is required').not().isEmpty(),
    check('semester', 'Semester is required').not().isEmpty(),
    check('departmentId', 'Department ID is required for department-specific courses').not().isEmpty()
  ],
  courseController.createCourse
);


// View all courses (accessible to all roles)
router.get(
  '/',
  authMiddleware,
  roleMiddleware(['tech-admin', 'admin', 'student']),  // Allow all roles to view courses
  courseController.getCourses
);


// Update a course (Tech Admins and Regular Admins only)
router.put(
  '/update/:id',
  authMiddleware,  // Authenticate the user
  roleMiddleware(['tech-admin', 'admin']),  // Restrict access to Tech Admins and Regular Admins
  [
    check('title', 'Course title is required').optional().not().isEmpty(),
    check('description', 'Course description is required').optional().not().isEmpty(),
    check('courseCode', 'Course code is required').optional().not().isEmpty(),
    check('level', 'Level is required').optional().not().isEmpty(),
    check('semester', 'Semester is required').optional().not().isEmpty(),
    check('departmentId', 'Department ID is required for department-specific courses').optional().not().isEmpty()
  ],
  courseController.updateCourse  // Link to the controller function
);


// Delete a course (Tech Admins only)
router.delete(
  '/delete/:id',
  authMiddleware,  // Authenticate the user
  roleMiddleware(['tech-admin']),  // Restrict access to Tech Admins only
  courseController.deleteCourse  // Link to the controller function
);


module.exports = router;

