const pool = require('../database/connection');

exports.passwordChange = (req, res) => {
  const { password, old_Pwd } = req.body;
  const { id } = req.query;

  pool.query('SELECT * FROM users WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    if(result.length==0){
      return res.status(400).json({ error: 'User not found' });
    }
    if (result.length === 1 && result[0].password != old_Pwd) {
      return res.status(400).json({ error: 'Old password is incorrect. Please enter the correct password and try again.' });
    }

    if (result[0].password === password) {
      return res.status(400).json({ error: "New password can't be the same as the old password." });
    }
    pool.query('UPDATE users SET password = ? WHERE id = ?', [password, id], (err, result) => {
      if (err) {
        console.error('Error updating password:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      res.status(200).json({
        status: 'success',
        message: 'Password updated successfully!',
      });
    });
  });
};
