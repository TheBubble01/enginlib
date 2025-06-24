const multer = require('multer');
const path = require('path');

// Supported file types
const supportedTypes = {
  pdf: 'application/pdf',
  word: ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  excel: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  image: ['image/jpeg', 'image/png', 'image/gif'],
  powerpoint: ['application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
  video: ['video/mp4', 'video/mpeg', 'video/quicktime']
};

// Combine all supported MIME types into a single array
const allSupportedTypes = [
  ...Object.values(supportedTypes).flat()
];

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files to the "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Multer file filter and size validator
const fileFilter = (req, file, cb) => {
  const { mimetype } = file;

  // Check for supported types
  if (!allSupportedTypes.includes(mimetype)) {
    return cb(new Error('Unsupported file type'), false);
  }

  cb(null, true);
};

// Multer upload setup
const upload = multer({
  storage,
  fileFilter
});

module.exports = upload;

