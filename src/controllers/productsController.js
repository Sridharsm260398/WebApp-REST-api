const pool = require('../database/connection');

exports.getallProducts = (req, res) => {
  pool.query('Select * from products', (err, result) => {
    if (err) {
      console.error('Error fetching address:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Products fetched successfull!',
      data: result,
    });
  })
};

exports.addItemstoCart = (req, res) => {
  const {
    id,
    item_id,
    title,
    price,
    description,
    category,
    image,
    rate,
    count
  } = req.body;

  const values = [
    id,
    item_id,
    title,
    price,
    description,
    category,
    image,
    rate,
    count
  ];
  pool.query(
    'INSERT INTO cart set ?',
    req.body,
    (err, result) => {
      if (err) {
        console.error('Error adding cart:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      res.status(201).json({
        status: 'success',
        message: 'Item added to cart Successfully',
        data: req.body,
      });
    }
  );
};
