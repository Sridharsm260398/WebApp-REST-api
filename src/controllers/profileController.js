const pool = require('../database/connection');
const fs = require('fs');
const path = require('path');
async function uploadPhoto(req, res) {
  try {
    const userId = req.body.userId;
    const photoPath = req.file.path;
    const query = 'UPDATE users SET profile_photo = ? WHERE user_id = ?';
    await pool.query(query, [photoPath, userId]);
    res.status(200).json({ message: 'Photo uploaded successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getPhoto(req, res) {
  try {
    const userId = req.params.userId;
    const query = 'SELECT profile_photo FROM users WHERE user_id = ?';
    const [result] = await pool.query(query, [userId]);
    if (result.length > 0 && result[0].profile_photo) {
      res.sendFile(path.resolve(result[0].profile_photo));
    } else {
      res.status(404).json({ message: 'Photo not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deletePhoto(req, res) {
  try {
    const userId = req.params.userId;
    const query = 'SELECT profile_photo FROM users WHERE user_id = ?';
    const [result] = await pool.query(query, [userId]);
    if (result.length > 0 && result[0].profile_photo) {
      fs.unlinkSync(result[0].profile_photo);
      const updateQuery = 'UPDATE users SET profile_photo = NULL WHERE user_id = ?';
      await pool.query(updateQuery, [userId]);
      res.status(200).json({ message: 'Photo deleted successfully' });
    } else {
      res.status(404).json({ message: 'Photo not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { uploadPhoto, getPhoto, deletePhoto };
