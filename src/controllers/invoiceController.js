const pool = require('../database/connection');
const PDFDocument = require('pdfkit');
const { generateInvoice } = require('../generators/invoiceGenerator');

exports.postInvoice = async (req, res) => {
  const { order, items } = req.body;
  const client = await pool.getConnection()
  try {
    await client.query('BEGIN');
    const orderQuery = `
        INSERT INTO orders (
          user_id,order_id, invoice_no, order_date, invoice_date, sold_by_name, sold_by_address, sold_by_registered_address,
          shipping_address, billing_address, total_qty, total_price, declaration
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?) 
      `;
    const orderValues = [
      order.user_id,
      order.order_id,
      order.invoice_no,
      order.order_date,
      order.invoice_date,
      order.sold_by_name,
      order.sold_by_address,
      order.sold_by_registered_address,
      order.shipping_address,
      order.billing_address,
      order.total_qty,
      order.total_price,
      order.declaration,
    ];
    const [orderResult] = await client.query(orderQuery, orderValues);
    const savedOrder = orderResult[0];
    //console.log(order)
    const itemsQuery = `
        INSERT INTO order_items (
          order_id, user_id,product, description, qty, gross_amount, discount, taxable_value, igst, total
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)
      `;
    for (const item of items) {
      const itemValues = [
        order.order_id,
        order.user_id,
        item.product,
        item.description,
        item.qty,
        item.gross_amount,
        item.discount,
        item.taxable_value,
        item.igst,
        item.total,
      ];
      await client.query(itemsQuery, itemValues);
    }
    await client.query('COMMIT');
    res.status(201).json({ Status: 'Sucess', messsage: 'Order Placed Successfully!!', data: order });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error saving order:', error);
    console.error('Stack trace:', error.stack);
    res.status(400).json({ message: 'Failed', errorMessageList: {error:error} });
   // res.status(500).send('Error saving order');
  } finally {
    client.release();
  }
};

exports.getInvoice = async (req, res) => {
  const orderId = req.params.orderId;
  try {
    const orderQuery = 'SELECT * FROM orders WHERE order_id = ?';
    const [orderData] = await pool.query(orderQuery, [orderId]);
    //const orderData = orderResult;
    const itemsQuery = 'SELECT * FROM order_items WHERE order_id = ?';
    const [itemsData] = await pool.query(itemsQuery, [orderId]);
   // const itemsData = itemsResult;
    if (!orderData || itemsData.length === 0) {
      return res.status(404).send('Order not found');
    }
    const invoiceData = {
      orderId: orderData[0].order_id,
      invoiceNo: orderData[0].invoice_no,
      orderDate: orderData[0].order_date,
      invoiceDate: orderData[0].invoice_date,
      soldBy: {
        name: orderData[0].sold_by_name,
        address: orderData[0].sold_by_address,
        registeredAddress: orderData[0].sold_by_registered_address,
      },
      shippingAddress: orderData[0].shipping_address,
      billingAddress: orderData[0].billing_address,
      items: itemsData.map((item) => ({
        product: item.product,
        description: item.description,
        qty: item.qty,
        grossAmount: item.gross_amount,
        discount: item.discount,
        taxableValue: item.taxable_value,
        igst: item.igst,
        total: item.total,
      })),
      totalQty: orderData.total_qty,
      totalPrice: orderData.total_price,
      declaration: orderData.declaration,
    };
    const doc = new PDFDocument();
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=invoice_${orderId}.pdf`
    );
    res.setHeader('Content-Type', 'application/pdf');
    doc.pipe(res);
    generateInvoice(doc, invoiceData);
    doc.end();
    /*  return res.status(201).json({
      message: 'Success',
      orderRes: orderResult.rows[0],
      itemRes: itemsResult.rows,
    }); */
  } catch (error) {
    console.error('Error generating invoice:', error);
    res.status(500).send('Error generating invoice');
  }
};
/* function generateInvoice(invoiceData) {
 const doc = new PDFDocument({ margin: 50 });
 // Header
 doc
   .fontSize(20)
   .text('Tax Invoice', { align: 'center' })
   .moveDown();
 // Order Details
 doc
   .fontSize(12)
   .text(`Order Id: ${invoiceData.orderId}`, { align: 'left' })
   .text(`Invoice No: ${invoiceData.invoiceNo}`, { align: 'left' })
   .text(`Order Date: ${invoiceData.orderDate}`, { align: 'left' })
   .text(`Invoice Date: ${invoiceData.invoiceDate}`, { align: 'left' })
   .moveDown();
 // Seller and Buyer Information
 doc
   .fontSize(12)
   .text(`Sold By: ${invoiceData.soldBy.name}`, { align: 'left' })
   .text(`Address: ${invoiceData.soldBy.address}`, { align: 'left' })
   .text(`Shipping Address: ${invoiceData.shippingAddress}`, { align: 'left' })
   .text(`Billing Address: ${invoiceData.billingAddress}`, { align: 'left' })
   .moveDown();
 // Table Headers
 doc
   .fontSize(10)
   .text('Product', { continued: true })
   .text('Description', { align: 'center', continued: true })
   .text('Qty', { align: 'center', continued: true })
   .text('Gross Amount', { align: 'center', continued: true })
   .text('Discount', { align: 'center', continued: true })
   .text('Taxable Value', { align: 'center', continued: true })
   .text('IGST', { align: 'center', continued: true })
   .text('Total', { align: 'center' });
 // Table Rows
 invoiceData.items.forEach(item => {
   doc
     .text(item.product, { continued: true })
     .text(item.description, { align: 'center', continued: true })
     .text(item.qty, { align: 'center', continued: true })
     .text(item.grossAmount.toFixed(2), { align: 'center', continued: true })
     .text(item.discount.toFixed(2), { align: 'center', continued: true })
     .text(item.taxableValue.toFixed(2), { align: 'center', continued: true })
     .text(item.igst.toFixed(2), { align: 'center', continued: true })
     .text(item.total.toFixed(2), { align: 'center' });
 });
 // Total Amount
 doc
   .moveDown()
   .text(`TOTAL QTY: ${invoiceData.totalQty}`, { align: 'right' })
   .text(`TOTAL PRICE: ${invoiceData.totalPrice.toFixed(2)}`, { align: 'right' })
   .moveDown();
 // Footer
 doc
   .fontSize(10)
   .text(`Seller Registered Address: ${invoiceData.soldBy.registeredAddress}`, { align: 'left' })
   .text(`Declaration: ${invoiceData.declaration}`, { align: 'left' })
   .moveDown()
   .fontSize(12)
   .text('Thank you for your business!', { align: 'center' });
 doc.end();
 return doc;
}
module.exports = generateInvoice; */

/*  exports.postInvoice = async (req, res) => {
    const orderId = req.params.orderId;
    try {
      // Fetch order details
      const orderQuery = 'SELECT * FROM orders WHERE order_id = ?';
      const orderResult = await pool.query(orderQuery, [orderId]);
      const orderData = orderResult.rows[0];
      // Fetch order items
      const itemsQuery = 'SELECT * FROM order_items WHERE order_id = ?';
      const itemsResult = await pool.query(itemsQuery, [orderId]);
      const itemsData = itemsResult.rows;
      if (!orderData || itemsData.length === 0) {
        return res.status(404).send('Order not found');
      }
      // Prepare invoice data
      const invoiceData = {
        orderId: orderData.order_id,
        invoiceNo: orderData.invoice_no,
        orderDate: orderData.order_date.toISOString(),
        invoiceDate: orderData.invoice_date.toISOString(),
        soldBy: {
          name: orderData.sold_by_name,
          address: orderData.sold_by_address,
          registeredAddress: orderData.sold_by_registered_address,
        },
        shippingAddress: orderData.shipping_address,
        billingAddress: orderData.billing_address,
        items: itemsData.map(item => ({
          product: item.product,
          description: item.description,
          qty: item.qty,
          grossAmount: item.gross_amount,
          discount: item.discount,
          taxableValue: item.taxable_value,
          igst: item.igst,
          total: item.total,
        })),
        totalQty: orderData.total_qty,
        totalPrice: orderData.total_price,
        declaration: orderData.declaration,
      };
      // Generate invoice PDF
      const doc = generateInvoice(invoiceData);
      res.setHeader('Content-Disposition', `attachment; filename=invoice_${orderId}.pdf`);
      res.setHeader('Content-Type', 'application/pdf');
      // Stream the PDF to the response
      doc.pipe(res);
    } catch (error) {
      console.error('Error generating invoice:', error);
      res.status(500).send('Error generating invoice');
    }
   };
  exports.getInvoice= async (req, res) => {
    const orderId = req.params.orderId;
    try {
      // Retrieve invoice data from the database
      const query = 'SELECT * FROM invoices WHERE order_id = ?';
      const values = [orderId];
      const result = await pool.query(query, values);
      const invoiceData = result.rows[0];
      if (!invoiceData) {
        return res.status(404).send('Invoice not found');
      }
      // Generate invoice PDF
      const doc = generateInvoice(invoiceData);
      res.setHeader('Content-Disposition', `attachment; filename=invoice_${orderId}.pdf`);
      res.setHeader('Content-Type', 'application/pdf');
      // Stream the PDF to the response
      doc.pipe(res);
    } catch (error) {
      console.error('Error retrieving invoice:', error);
      res.status(500).send('Error retrieving invoice');
    }
   };    */
