const pool = require('../database/connection');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
/* const transporter= nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        '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',
    },
  })
); */
exports.singupUser = (req, res) => {
  const { email, password, forget_password, phone_number, first_name, last_name } = req.body;
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
      // Hash the password
      bcrypt.hash(password, 12, (err, hashedPassword) => {
        if (err) {
          console.error("Error hashing password:", err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        const userID = uuidv4();
        const token = jwt.sign({ id: userID }, process.env.JWT_SECRET_KEY, {
          expiresIn: process.env.JWT_SESSION_EXPIRE,
        });
        const newUser = {
          email,
          password: hashedPassword,
          phone_number,
          first_name,
          last_name,
        };
        pool.query('INSERT INTO users SET ?', newUser, (err, result) => {
          if (err) {
            console.error("Error creating user:", err);
            return res.status(500).json({ error: 'Internal Server Error' });
          }

          res.status(201).json({
            SECRET_KEY: { id: userID, token },
            status: 'success',
            message: 'User created successfully',
            data: newUser,
          });
            /*     transporter.sendMail({
                  to:"sridharsmwork@gmail.com",
                  from:"sridharsmwork@gmail.com",
                  subject:"success",
                  
                
                }); */
        });
      });
    });
  });
};
