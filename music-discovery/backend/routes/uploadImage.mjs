import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
  const previousFilePath = req.body.previousFilePath;

  // Delete the previous file if it exists
  if (previousFilePath) {
    const previousFileName = path.basename(previousFilePath);
    const previousFileFullPath = path.join('uploads', previousFileName);
    fs.unlink(previousFileFullPath, (err) => {
      if (err) {
        console.error('Error deleting previous file:', err);
      } else {
        console.log('Previous file deleted:', previousFileFullPath);
      }
    });
  }

  res.status(200).json({ imageUrl: imageUrl, filePath: path.join('uploads', req.file.filename) });
});

export default router;
