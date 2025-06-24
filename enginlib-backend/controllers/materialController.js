const { Material, Course } = require('../models');
const fs = require('fs');
const path = require('path');

// Upload a new material
exports.uploadMaterial = async (req, res) => {
  const { title, description, courseId } = req.body;

  try {
    // Validate course existence
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }

    if (!req.file) {
      return res.status(400).json({ msg: 'File is required' });
    }


    // Apply size restrictions for videos
    if (req.file) {
      const fileType = req.file.mimetype;
      const fileSize = req.file.size;

      // If the file is a video, limit to 50 MB
      const videoTypes = ['video/mp4', 'video/mpeg', 'video/quicktime'];
      const maxVideoSize = 50 * 1024 * 1024; // 50 MB

      if (videoTypes.includes(fileType) && fileSize > maxVideoSize) {
        // Delete the oversized uploaded file immediately
        const fs = require('fs');
        fs.unlinkSync(req.file.path);

        return res.status(400).json({
          msg: 'Video file exceeds the 50MB size limit'
        });
      }
    }


    // Save material
    const material = await Material.create({
      title,
      description,
      filePath: req.file.path,           // Save file path
      fileSize: req.file.size,           // Save file size
      fileType: req.file.mimetype,       // Save file type
      courseId,
      uploadedBy: req.user.id		// Get the authenticated user's ID from req.user
    });

    //console.log('Material created:', material); //Debugging log

    res.status(201).json(material); // Return the created material
  } catch (err) {
    console.error('Error uploading material:', err.message);
    res.status(500).send('Server error');
  }
};

// Retrieve materials by course
exports.getMaterialsByCourse = async (req, res) => {
  const { courseId } = req.params;

  try {
    const materials = await Material.findAll({ where: { courseId } });
    const detailedMaterials = materials.map(material => ({
      ...material.dataValues,
      fileSizeMB: (material.fileSize / (1024 * 1024)).toFixed(2) + " MB" // Convert bytes to MB
    }));

    res.json(detailedMaterials);
  } catch (err) {
    console.error('Error fetching materials:', err.message);
    res.status(500).send('Server error');
  }
};

// Preview material
exports.previewMaterial = async (req, res) => {
  const { id } = req.params;

  try {
    const material = await Material.findByPk(id);

    if (!material) {
      return res.status(404).json({ msg: 'Material not found' });
    }

    const filePath = path.resolve(material.filePath);
    res.sendFile(filePath); // Serve the file for preview
  } catch (err) {
    console.error('Error previewing material:', err.message);
    res.status(500).send('Server error');
  }
};

// Download material
exports.downloadMaterial = async (req, res) => {
  const { id } = req.params;

  try {
    const material = await Material.findByPk(id);
    if (!material) {
      return res.status(404).json({ msg: 'Material not found' });
    }

    const filePath = path.resolve(material.filePath);

    res.download(filePath, (err) => {
      if (err) {
        console.error('Download error:', err.message);
        // Only respond if headers haven't already been sent
        if (!res.headersSent) {
          return res.status(500).json({ msg: 'Failed to download file.' });
        }
        // If headers are sent, just end the response silently
      }
    });

  } catch (err) {
    console.error('Server error during download:', err.message);
    if (!res.headersSent) {
      res.status(500).json({ msg: 'Server error during download.' });
    }
  }
};

// Update material details
exports.updateMaterial = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    const material = await Material.findByPk(id);
    if (!material) {
      return res.status(404).json({ msg: 'Material not found' });
    }

    // Update material details
    material.title = title || material.title;
    material.description = description || material.description;

    await material.save();
    res.json(material);
  } catch (err) {
    console.error('Error updating material:', err.message);
    res.status(500).send('Server error');
  }
};

// Delete a material
exports.deleteMaterial = async (req, res) => {
  const { id } = req.params;

  try {
    const material = await Material.findByPk(id);
    if (!material) {
      return res.status(404).json({ msg: 'Material not found' });
    }

    await material.destroy();
    res.json({ msg: 'Material deleted successfully' });
  } catch (err) {
    console.error('Error deleting material:', err.message);
    res.status(500).send('Server error');
  }
};

