const pool = require('../database/connection');

/* exports.getallProducts = (req, res) => {
  pool.query('Select * from products', (err, result) => {
    if (err) {
      console.error('Error fetching Products:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

  res.status(200).json({
    status: 'success',
    message: 'Products fetched successfull!',
    data:result.rows,
  });
})
}; */

exports.getallProducts = async (req, res) => {
  try {
    const [result] = await pool.query('Select * from products');

    res.status(200).json({
      status: 'success',
      message: 'Products fetched successfull!',
      data: result,
    });
  } catch (error) {
    console.error('Error fetching Products:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
exports.addItemstoCart = (req, res) => {
  const {
    id,  
   title,
   price ,
   description,
   category ,
   image,
   rate,
   count
  } = req.body;
  const values = [
    id,  
    title,
    price ,
    description,
    category ,
    image,
    rate,
    count
  ];
  pool.query(
    'INSERT INTO cart (id,title,price,description,category,image,rate,count) VALUES(?,?,?,?,?,?,?,?)',
    values,
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
