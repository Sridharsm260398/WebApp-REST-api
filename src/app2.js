const express = require('express');

const bodyParser = require('body-parser');

const fs = require('fs');

const bcrypt = require('bcrypt');

const app = express();

const PORT = 3000;

// Middleware

app.use(bodyParser.json());

// Sample JSON file to store user data

const usersFilePath = 'users.json';

// Helper function to read users from JSON file

function readUsersFromFile() {
  const usersData = fs.readFileSync(usersFilePath);

  return JSON.parse(usersData);
}

// Helper function to write users to JSON file

function writeUsersToFile(users) {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

// Signup endpoint

app.post('/signup', (req, res) => {
  const { email, password } = req.body;

  // Check if email already exists

  const users = readUsersFromFile();

  const existingUser = users.find((user) => user.email === email);

  if (existingUser) {
    return res.status(400).json({ error: 'Email already exists' });
  }

  // Hash password

  const saltRounds = 10;

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      return res.status(500).json({ error: 'Error hashing password' });
    }

    // Save user

    const newUser = { email, password: hash };

    users.push(newUser);

    writeUsersToFile(users);

    res.status(201).json({ message: 'User created successfully' });
  });
});

// Login endpoint

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Find user by email

  const users = readUsersFromFile();

  const user = users.find((user) => user.email === email);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Compare password

  bcrypt.compare(password, user.password, (err, result) => {
    if (err || !result) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.status(200).json({ message: 'Login successful' });
  });
});

// Start server

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});



const { Pool } = require('pg');
// Create a new pool with your PostgreSQL database configuration
const pool = new Pool({
 user: 'your_username',
 host: 'localhost',
 database: 'your_database_name',
 password: 'your_password',
 port: 5432, // Default PostgreSQL port is 5432
});
// Example query to fetch data from a PostgreSQL database
pool.query('SELECT * FROM your_table_name', (error, results) => {
 if (error) {
   console.error('Error executing query:', error);
   return;
 }
 console.log('Query result:', results.rows);
});
// Close the pool when your application exits
pool.end();