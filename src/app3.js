// Importing the built-in 'fs' module
const fs = require('fs');
const url = require('url');
const http = require('http');
const cors = require('cors');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

//const PORT = 8000;
// server.listen(PORT, () => {
//   console.log(`Listening : http://localhost:${PORT}`);
// });
/*// Reading the contents of a file
fs.readFile('example.txt', 'utf-8', (err, data) => {
console.log(data)
fs.writeFile('output.txt', data, 'utf-8', (err) => {
    console.log('file written!')
    });
}); */
// Reading the contents of a file
/* const data = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const parseData = JSON.parse(data);
const server = http.createServer((req, res) => {
  console.log(req.url);
  const pathName = req.url;
  if (pathName === '/api') {
    //  fs.readFile("./data/data.json", "utf-8", (err, data) => {
    //   const parseData = JSON.parse(data);
    //console.log(parseData);
    res.writeHead(200, {
      'content-type': 'application/json',
      'my-own-header': 'Not Found',
    });
    res.end(data);
    //});
  } else {
    res.writeHead(404, {
      'content-type': 'text/html',
      'my-own-header': 'Not Found',
    });
    res.end('<h1>Page not found oops!</h1>');
  }
}); */
const express = require('express');

const { get } = require('https');
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use((req, res, next) => {
  console.log('Hi from M-W!!');
  next();
});
app.use((req, res, next) => {
  req.requestedDate = new Date().toISOString();
  console.log(req.requestedDate);
  next();
});
const PORT = 8000;

var tours = JSON.parse(fs.readFileSync(`${__dirname}/data/data.json`));
const getallTours = (req, res) => {
  res.status(200).json({
    status: 'Success',
    result: tours.length,
    data: {
      tours,
    },
  });
};
const createToursingup = (req, res) => {
  //  console.log(req.body);

  /*  fs.writeFile(`${__dirname}/data/data.json`, JSON.stringify(tours), (err) => {
    res.status(201).json({
      status: 'success!!',
      data: {
        tours: newTour,
      },
    });
  }); */

  const { email, number } = req.body;
  // Check if email already exists
  const existingUser = tours.find(
    (user) => user.email === email || user.number == number
  );
  if (existingUser) {
    return res.status(400).json({ error: 'Email/Number already exists' });
  }
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(`${__dirname}/data/data.json`, JSON.stringify(tours), (err) => {
    res.status(201).json({
      status: 'success!!',
      message: 'User created successfully',
      data: {
        tours: newTour,
      },
    });
  });
};

// res.send('Done!!!!!')
const createTourlogin = (req, res) => {
  const { email, password } = req.body;
  // Find user by email
  const user = tours.find(
    (user) => user.email === email && user.password === password
  );
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  res.status(200).json({ message: 'Login successful', user });
};
const getTour = (req, res) => {
  //  console.log(req.body);
  const id = req.params.id * 1;
  // if(id >tours.length){

  const tour = tours.find((el) => el.id == id);
  if (!tour) {
    return res.status(404).json({
      Status: 'Fail!!',
      Message: 'Invalid ID',
    });
  }
  res.status(201).json({
    status: 'success!!',
    data: {
      tour,
    },
  });

  // res.send('Done!!!!!')
};
const updateTour = (req, res) => {
  const userId = req.params.id;
  const updates = req.body; // Assuming req.body contains the updates
  // Find the user by ID and update it
  let userUpdated = false;
  tours.forEach((user) => {
    if (user.id === parseInt(userId)) {
      Object.assign(user, updates);
      userUpdated = true;
    }
  });
  if (!userUpdated) {
    return res.status(404).json({ message: 'User not found' });
  }
  // Write the updated data back to the JSON file
  fs.writeFile(
    `${__dirname}/data/data.json`,
    JSON.stringify(tours, null, 2),
    (err) => {
      if (err) {
        console.error('Error updating user:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }
      console.log('User updated successfully');
      res.status(201).json({
        status: 'success!!',
        message: 'User updated successfully',
        data: {
          tours: updates,
        },
      });
    }
  );
};
const deleteTour = (req, res) => {
  /*   if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      Status: 'Fail!!',
      Message: 'Invalid ID',
    });
  } */
  const id = req.params.id;
  const tour = tours.find((el) => el.id == id);
  if (!tour) {
    res.status(400).json({
      status: 'Fail!!',
      message: 'User Not Found',
    });
  }
  tours = tours.filter((user) => user.id !== parseInt(id));
  fs.writeFile(`${__dirname}/data/data.json`, JSON.stringify(tours), (err) => {
    res.status(204).json({
      status: 'success!!',
      message: 'User deleted successfully',
      data: null,
    });
  });
};
// app.get('/api/v1/tours', getallTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app.route('/api/v1/tours').get(getallTours);
app.route('/api/v1/tours/signup').post(createToursingup);
app.route('/api/v1/tours/login').post(createTourlogin);
app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);
/* app.patch('/api/v1/tours/:id', (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      Status: 'Fail!!',
      Message: 'Invalid ID',
    });
  }
  res.status(200).json({
    status: 'success!!',
    data: {
      tour: '<Updated tour here...',
    },
  });
}); */
/*   const http = require('http');
// Creating an HTTP server
const server = http.createServer((req, res) => {
 res.writeHead(200, { 'Content-Type': 'text/plain' });
 res.end('Hello, World!\n');
});
// Listening on port 3000
const PORT = 3000;
server.listen(PORT, () => {
 console.log(`Server is running on http://localhost:${PORT}/`);
}); */
app.listen(PORT, () => {
  console.log(`Listening : http://localhost:${PORT}`);
});



const express = require('express');
const axios = require('axios');
const { Pool } = require('pg');

const app = express();
const pool = new Pool({
 user: 'your_db_user',
 host: 'your_db_host',
 database: 'your_db_name',
 password: 'your_db_password',
 port: 5432,
});

app.get('/fetch-products', async (req, res) => {
 try {
   const checkQuery = 'SELECT COUNT(*) AS count FROM products';
   const { rows } = await pool.query(checkQuery);
   const productCount = rows[0].count;

   if (productCount > 0) {
     res.status(200).send('Products already exist in the database');
     return;
   }

   const response = await axios.get('https://fakestoreapi.com/products');
   const products = response.data;

   const values = products.map(p => [
     p.id,
     p.title,
     p.price,
     p.description,
     p.category,
     p.image,
     p.rating.rate,
     p.rating.count,
   ]);

   const insertQuery = `
     INSERT INTO products (id, title, price, description, category, image, rate, count)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     ON CONFLICT (id) DO UPDATE SET
       title = EXCLUDED.title,
       price = EXCLUDED.price,
       description = EXCLUDED.description,
       category = EXCLUDED.category,
       image = EXCLUDED.image,
       rate = EXCLUDED.rate,
       count = EXCLUDED.count;
   `;

   for (const value of values) {
     await pool.query(insertQuery, value);
   }

   res.status(200).send('Products fetched and saved to database');
 } catch (error) {
   console.error('Error fetching products:', error);
   res.status(500).send('Error fetching products from API');
 }
});

app.listen(3000, () => {
 console.log('Server running on port 3000');
});


const express = require('express');
const axios = require('axios');
const { Pool } = require('pg');
const app = express();
const pool = new Pool({
 user: 'your_db_user',
 host: 'your_db_host',
 database: 'your_db_name',
 password: 'your_db_password',
 port: 5432,
});
app.get('/fetch-products', async (req, res) => {
 try {
   const checkQuery = 'SELECT COUNT(*) AS count FROM products';
   const { rows } = await pool.query(checkQuery);
   const productCount = rows[0].count;
   if (productCount > 0) {
     res.status(200).send('Products already exist in the database');
     return;
   }
   const response = await axios.get('https://fakestoreapi.com/products');
   const products = response.data;
   const values = products.map(p => [
     p.id,
     p.title,
     p.price,
     p.description,
     p.category,
     p.image,
     p.rating.rate,
     p.rating.count,
   ]);
   const insertQuery = `
     INSERT INTO products (id, title, price, description, category, image, rate, count)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     ON CONFLICT (id) DO UPDATE SET
       title = EXCLUDED.title,
       price = EXCLUDED.price,
       description = EXCLUDED.description,
       category = EXCLUDED.category,
       image = EXCLUDED.image,
       rate = EXCLUDED.rate,
       count = EXCLUDED.count;
   `;
   for (const value of values) {
     await pool.query(insertQuery, value);
   }
   res.status(200).send('Products fetched and saved to database');
 } catch (error) {
   console.error('Error fetching products:', error.message);
   console.error('Stack trace:', error.stack);
   res.status(500).send(`Error fetching products: ${error.message}`);
 }
});
app.listen(3000, () => {
 console.log('Server running on port 3000');
});
app.get('/fetch-products', async (req, res) => {
  try {
    const checkQuery = 'SELECT COUNT(*) AS count FROM products';
    const { rows } = await pool.query(checkQuery);
    const productCount = rows[0].count;
    if (productCount > 0) {
      res.status(200).send('Products already exist in the database');
      return;
    }
    const fetchProducts = async () => {
      const response = await axios.get('https://fakestoreapi.com/products', { timeout: 5000 });
      return response.data;
    };
    const products = await retry(fetchProducts, {
      retries: 3,
      onRetry: (error, attempt) => {
        console.warn(`Attempt ${attempt} failed. Retrying...`, error.message);
      }
    });
    const values = products.map(p => [
      p.id,
      p.title,
      p.price,
      p.description,
      p.category,
      p.image,
      p.rating.rate,
      p.rating.count,
    ]);
    const insertQuery = `
      INSERT INTO products (id, title, price, description, category, image, rate, count)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        price = EXCLUDED.price,
        description = EXCLUDED.description,
        category = EXCLUDED.category,
        image = EXCLUDED.image,
        rate = EXCLUDED.rate,
        count = EXCLUDED.count;
    `;
    for (const value of values) {
      await pool.query(insertQuery, value);
    }
    res.status(200).send('Products fetched and saved to database');
  } catch (error) {
    console.error('Error fetching products:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).send(`Error fetching products: ${error.message}`);
  }
 });
