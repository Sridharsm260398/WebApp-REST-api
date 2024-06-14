const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadPhoto,getPhoto, deletePhoto,} = require('../controllers/profileController');
// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage: storage });
router.post('/upload', upload.single('profilePhoto'), uploadPhoto);
router.get('/:userId/photo', getPhoto);
router.delete('/:userId/photo', deletePhoto);
module.exports = router;
