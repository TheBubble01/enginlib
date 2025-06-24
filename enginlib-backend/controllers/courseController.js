const { Course } = require('../models');

// Create a new course
exports.createCourse = async (req, res) => {
  const { courseCode, title, description, level, semester, departmentId, isGeneral } = req.body;

  try {
    // Validate required fields
    if ((!courseCode || !level || !semester || !departmentId || !title || !description) && (!isGeneral)) {
      return res.status(400).json({ msg: 'All fields are required' });
    }
    if ((isGeneral) && (!courseCode || !level || !semester || !title || !description)) {
      return res.status(400).json({ msg: 'All fields are required' });
    }

    // Ensure course code is uppercase
    const formattedCourseCode = courseCode.toUpperCase();

    // Check for existing course with the same code in the department
    const existingCourse = await Course.findOne({
      where: {
        courseCode: formattedCourseCode,
        departmentId: isGeneral ? null : departmentId  // Null for general courses
      }
    });

    if (existingCourse) {
      return res.status(400).json({ msg: 'A course with this code already exists in the department' });
    }

    // Create the course
    const course = await Course.create({
      courseCode: formattedCourseCode,
      title,
      description,
      level: level,
      semester: semester,
      departmentId: isGeneral ? null : departmentId,  // Null if course is general
      isGeneral: isGeneral || false,
      uploadedBy: req.user.id  // Get the user ID from the authenticated user
    });

    res.status(201).json(course);
  } catch (err) {
    console.error('Error creating course:', err.message);
    res.status(500).send('Server error');
  }
};


// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.json(courses);
  } catch (err) {
    console.error('Error fetching courses:', err.message);
    res.status(500).send('Server error');
  }
};


// Get courses (with filters: department, semester and level)
exports.getCourses = async (req, res) => {
  const { departmentId, level, semester } = req.query;  // Filters from query parameters

  try {
    const filters = {};

    // Apply filters if provided
    if (departmentId) filters.departmentId = departmentId;
    if (level) filters.level = level;
    if (semester) filters.semester = semester;

    const courses = await Course.findAll({
      where: filters
    });

    res.json(courses);
  } catch (err) {
    console.error('Error fetching courses:', err.message);
    res.status(500).send('Server error');
  }
};


// Update a course
exports.updateCourse = async (req, res) => {
  const { id } = req.params;  // Get the course ID from the URL
  const { courseCode, title, description, level, semester, departmentId, isGeneral } = req.body;

  try {
    // Find the course by primary key
    const course = await Course.findByPk(id);

    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }

    // Update course details
    //course.courseCode = courseCode || course.courseCode;
    course.courseCode = courseCode ? courseCode.toUpperCase() : course.courseCode;
    course.title = title || course.title;
    course.description = description || course.description;
    course.level = level || course.level;
    course.semester = semester || course.semester;
    course.departmentId = isGeneral ? null : departmentId || course.departmentId;
    course.isGeneral = isGeneral !== undefined ? isGeneral : course.isGeneral;

    await course.save();
    res.json(course);
  } catch (err) {
    console.error('Error updating course:', err.message);
    res.status(500).send('Server error');
  }
};

// Delete a course
exports.deleteCourse = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the course by primary key
    const course = await Course.findByPk(id);

    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }

    // Delete the course
    await course.destroy();
    res.json({ msg: 'Course deleted successfully' });
  } catch (err) {
    console.error('Error deleting course:', err.message);
    res.status(500).send('Server error');
  }
};
