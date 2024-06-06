const pool = require('../database/connection');
exports.getAllUser = (req, res) => {
  pool.query('SELECT * FROM users', (err, rows) => {
    if (err) throw err;
    res.status(200).json({
      status: 'Success',
      result: rows.length,
      data: rows

    });

  });
};


exports.getSingleUser = (req, res) => {
  const { id } = req.query;
  pool.query('SELECT * FROM users WHERE id = ?', [id], (error, userResults) => {
    if (error) {
      console.error("Error fetching user:", error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (userResults.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      status: 'success',
      data: userResults[0],
    });
  });
};
exports.updateUserProfile = (req, res) => {
  const { id } = req.query;
  const { email, phone_number, password } = req.body;

  // First, check if the user with the given ID exists
  pool.query('SELECT * FROM users WHERE id = ?', [id], (error, userResults) => {
    if (error) {
      console.error("Error checking existing user:", error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (userResults.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResults[0];
    if (password !== user.password) {
      return res.status(401).json({ error: 'Incorrect password' });
    }
    if (email !== user.email || phone_number !== user.phone_number) {
      pool.query('SELECT * FROM users WHERE (email = ? OR phone_number = ?) AND id != ?', [email, phone_number, id], (error, results) => {
        if (error) {
          console.error("Error checking existing email or phone number:", error);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (results.length > 0) {
          const existingUser = results[0];
          if (existingUser.email === email) {
            return res.status(400).json({ error: 'Email already exists' });
          } else {
            return res.status(400).json({ error: 'Phone number already exists' });
          }
        }

        updateProfile();
      });
    } else {
      updateProfile();
    }
  });
  function updateProfile() {
    pool.query('UPDATE users SET email = ?, phone_number = ? WHERE id = ?', [email, phone_number, id], (err, result) => {
      if (err) {
        console.error("Error updating user:", err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      res.status(200).json({
        status: 'success',
        message: 'User updated successfully',
        data: req.body,
      });
    });
  }
};
exports.deleteUser = (req, res) => {
  const { id } = req.query;
  pool.query('SELECT * FROM users WHERE id = ?', [id], (error, userResults) => {
    if (error) {
      console.error("Error checking existing user:", error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    if (userResults.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    pool.query('DELETE FROM users WHERE id = ?', [id], (err, result) => {
      if (err) {
        console.error("Error deleting user:", err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      res.status(200).json({
        status: 'success',
        message: 'User deleted successfully',
      });
    });
  });
};
exports.createProfile = (req, res) => {
  //const { first_name, last_name,email, phone_number } = req.body;
  const { name, email, phone_number } = req.body;
  pool.query('SELECT * FROM users WHERE email = ?', [email], (error, emailResults) => {
    if (error) {
      console.error("Error checking existing email:", error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (emailResults.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    pool.query('SELECT * FROM users WHERE phone_number = ?', [phone_number], (error, numberResults) => {
      if (error) {
        console.error("Error checking existing phone number:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (numberResults.length > 0) {
        return res.status(400).json({ error: 'Phone number already exists' });
      }
      //const values = [ first_name, last_name,email, phone_number];
      const values = [name, email, phone_number];
      pool.query('INSERT INTO users set ?', values, (err, result) => {
        if (err) {
          console.error("Error creating user:", err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.status(201).json({
          status: 'success',
          message: 'User profile created successfully',
          data: req.body,

        });
      });
    });
  });
};