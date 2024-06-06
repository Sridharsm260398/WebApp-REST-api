const pool = require('../database/connection');

exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  pool.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (error, results) => {
    if (error) {
      console.error("Error checking user credentials:", error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (results.length === 0) {
      console.log("Invalid email or password:", email);
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    console.log("User logged in successfully:", email);
    res.status(200).json({
      status: 'success',
      message: 'User logged in successfully',
      data: results[0]

    });
  });
};
