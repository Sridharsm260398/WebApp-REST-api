const fs = require('fs').promises;
/* const url = require('url');
const http = require('http'); */
const cors = require('cors');
//const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
//const mysql = require('mysql')
const pool = require('./database/connection');
const express = require('express');
const axios = require('axios');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const userRoute = require('./routes/userRoutes');
const addressRoute = require('./routes/addressRoutes');
const loginRoute = require('./routes/loginRoutes');
const signupRoute = require('./routes/signupRoutes');
const paymentRoute = require('./routes/paymentRoutes');
const productRoute = require('./routes/productRoutes');
const passwordChangeRoute = require('./routes/passwordRoutes');
const invoiceRoute = require('./routes/invoiceRoutes');
const bcrypt = require('bcryptjs');
const passwordChange = require('./routes/passwordRoutes');
const { get } = require('https');
const { stat } = require('fs');
const { error } = require('console');
const { STATUS_CODES } = require('http');
const app = express();
app.use(cors());
app.use(express.json());
//app.use(morgon.json());
app.use(bodyParser.json());
app.use(express.static(`${__dirname}/../src`));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use((req, res, next) => {
  console.log('Hi from M-W!!');
  next();
});
/* const pool = mysql.createpool({
  host: 'localhost',
  user: 'root',
  password: 'Shreyas@1998',
  database: 'store'
}); */
app.use((req, res, next) => {
  req.requestedDate = new Date().toISOString();
  console.log(req.requestedDate);
  next();
});
app.get('/fetch-products', async (req, res) => {
  try {
    const checkQuery = 'SELECT COUNT(*) AS count FROM products';
    pool.query(checkQuery, async (err, results) => {
      if (err) {
        console.error('Error checking products:', err);
        res.status(500).send('Error checking products in database');
        return;
      }
      const productCount = results.count;
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
        p.rating.count
      ]);
      const insertQuery = `INSERT INTO products (id, title, price, description, category, image, rate, count)
                           VALUES ?
                           ON DUPLICATE KEY UPDATE
                           title=VALUES(title), price=VALUES(price), description=VALUES(description),
                           category=VALUES(category), image=VALUES(image), rate=VALUES(rate), count=VALUES(count)`;
      pool.query(insertQuery, [values], (err, result) => {
        if (err) {
          console.error('Error inserting products:', err);
          res.status(500).send('Error fetching and saving products');
          return;
        }
        res.status(200).send('Products fetched and saved to database');
      });
    });
  } catch (error) {
    res.status(500).send('Error fetching products from API');
  }
});

const query = (sql, values) => {
  return new Promise((resolve, reject) => {
    pool.query(sql, values, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

app.get('/fetch-products1', async (req, res) => {
  try {
    const checkQuery = 'SELECT COUNT(*) AS count FROM products_1';
    const results = await query(checkQuery);

    const productCount = results[0].count;
    if (productCount > 0) {
      res.status(200).send('Products already exist in the database');
      return;
    }

    const response = await fs.readFile(`${__dirname}/data/newJson.json`, 'utf-8');
    const products = JSON.parse(response);

    const values = products.map(p => [
      p.id,
      p.title,
      p.description,
      p.price,
      p.discountPercentage, 
      p.rating,
      p.stock,
      p.brand,
      p.category,
      p.thumbnail,
      JSON.stringify(p.image) 
    ]);

    console.log('Values to insert:', values); 

    const insertQuery = `INSERT INTO products_1 (id, title, description, price, discount_percentage, rating, stock, brand, category, thumbnail, image)
                         VALUES ?`;

    await query(insertQuery, [values]);
    res.status(200).send('Products fetched and saved to database');
  } catch (error) {
    console.error('Error fetching or inserting products:', error);
    res.status(500).send('Error fetching or inserting products');
  }
});

//created the middleware
app.use('/api/v1/users', signupRoute);
app.use('/api/v1/users', loginRoute);
app.use('/api/v1/users', paymentRoute);
app.use('/api/v1/users/address', addressRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/products', productRoute);
app.use('/api/v1/users', passwordChangeRoute);
app.use('/api/v1/users', invoiceRoute);
app.all('*', (req, res, next) => {
  return res.status(404).json({
    error: {
      errMessageList: {
        errorCode:404,
        status: 'Fail',
        message: `Can't find the ${req.originalUrl} on this server`,
      },
    },
  });
});
// userRoute.route('/creditdebit').post(addCreditDebit).get(getCreditDebit);
// addressRoute.route('/').post(createaddress).get(getALLUserAddress);
// addressRoute.route('/:id').get(getSingleUserAddress).delete(deleteUserAddresswithId);
// addressRoute.route('/:id/:addressid').get(getSingleUserAddresswithAddressID).delete(deleteUserAddresswithAddressID)
// userRoute.route('/profile').post(createProfile);
// userRoute.route('').get(getAllUser);
// userRoute.route('/signup').post(singupUser);
// userRoute.route('/login').post(loginUser);
// userRoute.route('/:id').get(getSingleUser).delete(deleteUser).patch(updateUserProfile)
// app.route('/api/v1/users/creditdebit').post(addCreditDebit).get(getCreditDebit);
// app.route('/api/v1/users/address').post(createaddress).get(getALLUserAddress);
// app.route('/api/v1/users/address/:id').get(getSingleUserAddress).delete(deleteUserAddresswithId);
// app.route('/api/v1/users/address/:id/:addressid').get(getSingleUserAddresswithAddressID).delete(deleteUserAddresswithAddressID)
// app.route('/api/v1/users/profile').post(createProfile);
// app.route('/api/v1/users').get(getAllUser);
// app.route('/api/v1/users/signup').post(singupUser);
// app.route('/api/v1/users/login').post(loginUser);
// app.route('/api/v1/users/:id').get(getSingleUser).delete(deleteUser).patch(updateUserProfile)

// app.get('/api/v1/users', getallTours);
// app.post('/api/v1/users', createTour);
// app.get('/api/v1/users/:id', getTour);
// app.patch('/api/v1/users/:id', updateTour);
// app.delete('/api/v1/users/:id', deleteTour);
module.exports = app;
