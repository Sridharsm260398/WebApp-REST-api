const pool = require('../database/connection');

exports.createaddress = (req, res) => {
  pool.query('INSERT INTO UserAddress SET ?', req.body, (err, result) => {
    if (err) {
      console.error("Error creating address:", err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    res.status(201).json({
      status: 'success',
      message: 'Address created successfully',
      data: req.body,
    });
  });
};

exports.getALLUserAddress = (req, res) => {
  pool.query('SELECT * FROM UserAddress', (error, userResults) => {
    if (error) {
      console.error("Error fetching addresses:", error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    res.status(200).json({
      status: 'success',
      data: userResults,
    });
  });
};

exports.getSingleUserAddress = (req, res) => {
  const { id } = req.query;
  pool.query('SELECT * FROM UserAddress WHERE id = ?', [id], (error, userResults) => {
    if (error) {
      console.error("Error fetching address:", error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (userResults.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      status: 'success',
      data: userResults,
    });
  });
};

exports.getSingleUserAddresswithAddressID = (req, res) => {
  const { id, addressid } = req.query;
  pool.query('SELECT * FROM UserAddress WHERE id = ? AND addressid = ?', [id, addressid], (error, userResults) => {
    if (error) {
      console.error("Error fetching address:", error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (userResults.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      status: 'success',
      data: userResults,
    });
  });
};

exports.deleteUserAddresswithId = (req, res) => {
  const { id } = req.query;
  pool.query('SELECT * FROM UserAddress WHERE id = ?', [id], (error, userResults) => {
    if (error) {
      console.error("Error checking existing user:", error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    if (userResults.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    pool.query('DELETE FROM UserAddress WHERE id = ?', [id], (err, result) => {
      if (err) {
        console.error("Error deleting user:", err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      res.status(200).json({
        status: 'success',
        message: 'User address deleted successfully',
      });
    });
  });
};

exports.deleteUserAddresswithAddressID = (req, res) => {
  const { id, addressid } = req.query;
  pool.query('SELECT * FROM UserAddress WHERE id = ? AND addressid = ?', [id, addressid], (error, userResults) => {
    if (error) {
      console.error("Error checking existing user:", error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    if (userResults.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    pool.query('DELETE FROM UserAddress WHERE id = ? AND addressid = ?', [id, addressid], (err, result) => {
      if (err) {
        console.error("Error deleting user:", err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      res.status(200).json({
        status: 'success',
        message: 'User address deleted successfully',
      });
    });
  });
};

exports.updateUserAddresswithAddressID = (req, res) => {
  const { id, addressid } = req.query;
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

  pool.query(
    'SELECT * FROM UserAddress WHERE id = ? AND addressid = ?',
    [id, addressid],
    (error, userResults) => {
      if (error) {
        console.error('Error checking existing user:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      if (userResults.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

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
        id,
        addressid
      ];

      pool.query(
        `UPDATE UserAddress 
         SET first_name=?, last_name=?, locality=?, town_city=?, country=?, state=?, postcode_zip=?, mobile=?, email_address=?, address_optional=?
         WHERE id = ? AND addressid = ?`,
        values,
        (err, result) => {
          if (err) {
            console.error('Error updating user:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
          }

          res.status(200).json({
            status: 'success',
            message: 'User address updated successfully',
            data: req.body
          });
        }
      );
    }
  );
};
