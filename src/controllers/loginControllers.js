const pool = require('../database/connection');
const bcrypt = require('bcryptjs');

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [results] = await pool.query('SELECT * FROM users WHERE email = ?', [
      email,
    ]);
   
    if (results.length === 0) {
      console.log('Invalid email or password:', email);
      return res.status(400).json({ error: 'Invalid email or password' });
    }
   const user = results;
   console.log(user[0].password)
     const isPasswordMatch = await bcrypt.compare(password, user[0].password);
    if (!isPasswordMatch) {
      console.log('Invalid email or password:', email);
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    console.log('User logged in successfully:', email);
    res.status(200).json({
      status: 'success',
      message: 'User logged in successfully',
      data: { id: user[0].user_id },
    });
  } catch (error) {
    console.error('Error checking user credentials:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};