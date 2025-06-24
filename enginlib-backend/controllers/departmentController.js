const { Department } = require('../models');

// Create a new department
exports.createDepartment = async (req, res) => {
  const { name, description } = req.body;
  try {
    const department = await Department.create({ name, description });
    res.status(201).json(department);
  } catch (err) {
    console.error('Error creating department:', err.message);
    res.status(500).send('Server error');
  }
};

// Get all departments
exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.findAll();
    res.json(departments);
  } catch (err) {
    console.error('Error fetching departments:', err.message);
    res.status(500).send('Server error');
  }
};

// Update a department
exports.updateDepartment = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const department = await Department.findByPk(id);
    if (!department) {
      return res.status(404).json({ msg: 'Department not found' });
    }

    department.name = name || department.name;
    department.description = description || department.description;

    await department.save();
    res.json(department);
  } catch (err) {
    console.error('Error updating department:', err.message);
    res.status(500).send('Server error');
  }
};

// Delete a department
exports.deleteDepartment = async (req, res) => {
  const { id } = req.params;

  try {
    const department = await Department.findByPk(id);
    if (!department) {
      return res.status(404).json({ msg: 'Department not found' });
    }

    await department.destroy();
    res.json({ msg: 'Department deleted successfully' });
  } catch (err) {
    console.error('Error deleting department:', err.message);
    res.status(500).send('Server error');
  }
};

