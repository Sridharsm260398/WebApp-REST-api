const pool = require('../database/connection');
exports.getCreditDebit = (req, res) => {
  pool.query('SELECT * FROM savedcards', (err, rows) => {
    if (err) throw err;
    res.status(200).json({
      status: 'Success',
      result: rows.length,
      data: rows.rows,
    });
  });
};
exports.getCreditDebitWithID = (req, res) => {
  const { id } = req.query;
  //const { card_holder_name, card_number, cvv, expiry_date } = req.body;
  pool.query('SELECT * from  savedcards WHERE id = ?', [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    if (result.length == 0) {
      console.log(result);
      return res.status(400).json({ error: 'Card not found for User' });
    }
    res.status(200).json({
      status:"success",
      message: 'Card fetched successful!',
      data: result,
    });
  });
};
exports.deleteCreditDebitWithCID = (req, res) => {
  const { card_id, id } = req.query;
  pool.query(
    'SELECT * FROM savedcards where id =? and card_id =?',
    [id, card_id],
    (error, userResults) => {
      if (error) {
        console.error('Error checking existing card:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      if (userResults.length === 0) {
        return res.status(404).json({ error: 'Card not found' });
      }
      pool.query(
        'DELETE from savedcards where id =? and card_id =?',
        [id,card_id],
        (err, result) => {
          if (err) {
            return res.status(500).json({ message: 'Internal Server Error' });
          }
          res.status(200).json({
            status:"success",
            message: 'Card deleted successful!',
          });
        }
      );
    }
  );
};
exports.addCreditDebit = (req, res) => {
  const { card_holder_name, card_number, cvv, expiry_date, id } = req.body;

  pool.query(
    'SELECT * FROM savedcards WHERE card_number = ?',
    [card_number],
    (error, emailResults) => {
      if (error) {
        console.error('Error checking existing Card number:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (emailResults.length > 0) {
        return res.status(400).json({ error: 'Card number already exist' });
      }

      const values = [card_holder_name, card_number, cvv, expiry_date, id];
       pool.query('INSERT INTO savedcards set ?',req.body, 
        (err, result) => {
          if (err) {
            console.error('Error creating user:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
          }

          res.status(200).json({
            status: 'success',
            message: 'Card added successfully',
            data: req.body,
          });
        }
      );
    }
  );
};
