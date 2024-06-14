const pool = require('../database/connection');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        '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',
    },
  })
);
exports.signupUser = async (req, res) => {
  const {
    email,
    password,
    forget_password,
    phone_number,
    first_name,
    last_name,
  } = req.body;
  try {
    const [emailResults] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    if (emailResults.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    const [numberResults] = await pool.query(
      'SELECT * FROM users WHERE phone_number = ?',
      [phone_number]
    );
    if (numberResults.length > 0) {
      return res.status(400).json({ error: 'Phone number already exists' });
    }
    const hashPwd = await bcrypt.hash(password, 12);
    const userID = uuidv4();
    const token = jwt.sign({ user_id: userID }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_SESSION_EXPIRE,
    });
    const values = [
      email,
      hashPwd,
     // password,
      forget_password,
      phone_number,
      first_name,
      last_name,
      userID
    ];
    const result = await pool.query(
      'INSERT INTO users (email, password, forget_password, phone_number, first_name, last_name,user_id) VALUES(?, ?, ?, ?, ?, ?,?)',
      values
    );
   req.body.password = hashPwd;
    res.status(200).json({
      SECRET_KEY: token,
      status: 'success',
      message: 'User created successfully',
      data: req.body,
    });
    // Uncomment and configure your mail transporter to send emails
    // await transporter.sendMail({
    //   to: "sridharsmwork@gmail.com",
    //   from: "ScartWebApp@gmail.com",
    // });
  } catch (error) {
    console.error('Error processing signup:', error);
    res
      .status(500)
      .json({ error: 'Internal Server Error', message: error.message });
  }
};
