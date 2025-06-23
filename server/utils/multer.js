// utils/multer.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const createError = require('../utils/errorResponse');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// File filter configuration
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
  
  if (!allowedTypes.includes(file.mimetype)) {
    const error = createError('Only JPEG, PNG, GIF images and PDFs are allowed', 400);
    return cb(error, false);
  }
  cb(null, true);
};

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let subfolder = 'profile-photos';
    
    // For academic documents (if implemented later)
    if (file.fieldname === 'academic_docs') {
      subfolder = 'academic-documents';
    }
    
    const dest = path.join(uploadDir, subfolder);
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const userPrefix = req.user ? `${req.user.id}-` : '';
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${userPrefix}${uniqueSuffix}${ext}`);
  }
});

// File size limits (2MB for images, 5MB for PDFs)
const limits = {
  fileSize: 2 * 1024 * 1024, // 2MB default
  files: 1 // Single file
};

// Configure different upload types
const upload = multer({ 
  storage, 
  fileFilter,
  limits
});

const academicDocUpload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(createError('Only PDF documents are allowed for academic files', 400), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB for academic docs
    files: 3 // Max 3 files at once
  }
});

// Middleware for different upload types
module.exports = {
  profileUpload: upload.single('profilePhoto'),
  academicDocsUpload: academicDocUpload.array('academic_docs', 3),
  
  // Helper to delete files
  deleteFile: (filename) => {
    const filePath = path.join(uploadDir, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  },
  
  // Get full public URL for files
  getFileUrl: (filename) => {
    if (!filename) return null;
    return `/uploads/${filename}`;
  }
};