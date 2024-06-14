const pool = require('../database/connection');

exports.createAddress = async (req, res) => {
  const {
    first_name,
    last_name,
    locality,
    town_city,
    country,
    state,
    postcode_zip,
    mobile,
    email_address,
    address_optional,
    user_id,
  } = req.body;
  const values = [
    first_name,
    last_name,
    locality,
    town_city,
    country,
    state,
    postcode_zip,
    mobile,
    email_address,
    address_optional,
    user_id,
  ];
  try {
    const [userResults] = await pool.query(
      'SELECT * FROM useraddress WHERE user_id = ?',
      [user_id]
    );
    if (userResults.length >= 5) {
      return res.status(400).json({
        error: 'Not able to add',
        message:
          'Address can be added up to 5. Please delete or modify the existing address',
      });
    }
    await pool.query(
      'INSERT INTO useraddress (first_name, last_name, locality, town_city, country, state, postcode_zip, mobile, email_address, address_optional, user_id) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      values
    );
    res.status(201).json({
      status: 'success',
      message: 'Address created successfully',
      data: req.body,
    });
  } catch (error) {
    console.error('Error creating address:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getAllUserAddresses = async (req, res) => {
  try {
    const [userResults] = await pool.query('SELECT * FROM useraddress');
    if (userResults.length === 0) {
      return res.status(404).json({ error: 'No addresses found' });
    }
    res.status(200).json({
      status: 'success',
      data: userResults,
    });
  } catch (error) {
    console.error('Error fetching addresses:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getUserAddressById = async (req, res) => {
  const { user_id } = req.query;
  try {
    const [userResults] = await pool.query(
      'SELECT * FROM useraddress WHERE user_id = ?',
      [user_id]
    );
    if (userResults.length === 0) {
      return res.status(404).json({ error: 'Address not found' });
    }
    res.status(200).json({
      status: 'success',
      data: userResults,
    });
  } catch (error) {
    console.error('Error fetching address:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
exports.deleteUserAddresswithId = async (req, res) => {
  const { user_id } = req.query;
  try {
    const [userResults] = await pool.query('SELECT * FROM useraddress WHERE user_id = ?', [user_id]);
    if (userResults.length === 0) {
      return res.status(404).json({ error: 'Address not found' });
    }
    await pool.query('DELETE FROM useraddress WHERE user_id = ?', [user_id]);
    res.status(200).json({
      status: 'success',
      message: 'User address deleted successfully',
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
 };
exports.updateUserAddresswithAddressID = async (req, res) => {
  const { user_id, addressid } = req.query;
  const {
    first_name,
    last_name,
    locality,
    town_city,
    country,
    state,
    postcode_zip,
    mobile,
    email_address,
    address_optional,
  } = req.body;
  try {
    const [userResults] = await pool.query(
      'SELECT * FROM useraddress WHERE user_id = ? AND addressid = ?',
      [user_id, addressid]
    );
    if (userResults.length === 0) {
      return res.status(404).json({ error: 'Address not found' });
    }
  
    await pool.query(
      'UPDATE useraddress SET first_name=?, last_name=?, locality=?, town_city=?, country=?, state=?, postcode_zip=?, mobile=?, email_address=?, address_optional=? WHERE user_id = ? AND addressid = ?',
      [
        first_name,
        last_name,
        locality,
        town_city,
        country,
        state,
        postcode_zip,
        mobile,
        email_address,
        address_optional,
        user_id,
        addressid,
      ]
    );

    res.status(200).json({
      status: 'success',
      message: 'User address updated successfully',
      data: req.body,
    });
  } catch (error) {
    console.error('Error updating user address:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

 exports.getSingleUserAddresswithAddressID = async (req, res) => {
  const { user_id, addressid } = req.query;
  try {
    const [userResults] = await pool.query('SELECT * FROM useraddress WHERE user_id = ? AND addressid = ?', [user_id, addressid]);
    if (userResults.length === 0) {
      return res.status(404).json({ error: 'Address not found' });
    }
    res.status(200).json({
      status: 'success',
      data: userResults[0],
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
 };
 exports.deleteUserAddresswithAddressID = async (req, res) => {
  const { user_id, addressid } = req.query;
  try {
    const [userResults] = await pool.query('SELECT * FROM useraddress WHERE user_id = ? AND addressid = ?', [user_id, addressid]);
    if (userResults.length === 0) {
      return res.status(404).json({ error: 'Address not found' });
    }
    await pool.query('DELETE FROM useraddress WHERE user_id = ? and addressid =?', [user_id, addressid]);
    res.status(200).json({
      status: 'success',
      message: 'User address deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
 };
