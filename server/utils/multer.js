// utils/multer.js - Express 4 Compatible
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let subfolder = 'profile-photos';
    
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

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and GIF images are allowed'), false);
  }
};

// Multer configuration
const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
    files: 1
  }
});

module.exports = {
  profileUpload: upload.single('profilePhoto'),
  
  // Helper to delete files
  deleteFile: (filename) => {
    try {
      const filePath = path.join(uploadDir, 'profile-photos', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`File deleted: ${filename}`);
      }
    } catch (error) {
      console.error(`Error deleting file ${filename}:`, error.message);
    }
  },
  
  // Get file URL
  getFileUrl: (filename) => {
    if (!filename) return null;
    return `/public/uploads/profile-photos/${filename}`;
  }
};