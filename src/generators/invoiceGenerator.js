const PDFDocument = require('pdfkit');
function generateInvoice(doc, data) {
 doc.fontSize(20).text('Tax Invoice', { align: 'center' });
 doc.moveDown();
 doc.fontSize(8);
 const leftMargin = 50;
 const rightMargin = 300;
 const initialY = 100;
 doc.text(`Order Id: ${data.orderId}`, leftMargin, initialY);
 doc.text(`Invoice No: ${data.invoiceNo}`, rightMargin, initialY);
 doc.text(`Order Date: ${data.orderDate}`, leftMargin, initialY + 15);
 doc.text(`Invoice Date: ${data.invoiceDate}`, rightMargin, initialY + 15);
 doc.moveDown().moveDown();
 const soldByY = doc.y;
 const addressHeight = doc.heightOfString(data.soldBy.address, { width: 150 });
 const nameStartY = soldByY + 12 + addressHeight;
 doc.text('Sold By:', leftMargin, soldByY)
   .text(data.soldBy.address, leftMargin, soldByY + 12, { width: 150 })
   .text(data.soldBy.name, leftMargin, nameStartY, { width: 150 });
 // doc.text(`GST: ${data.soldBy.gstin}`, leftMargin + 70, soldByY + 30);
 doc.moveDown().moveDown();
 const addressY = soldByY;
 doc.text('Shipping Address:', leftMargin + 150, addressY);
 doc.moveDown()
 doc.text(data.shippingAddress, leftMargin + 150, addressY + 12, { width: 200 });
 const shippingHeight = doc.heightOfString(data.shippingAddress, leftMargin + 150, addressY + 12, { width: 200 })
 doc.text('Billing Address:', rightMargin + 100, addressY);
 doc.moveDown();
 doc.text(data.billingAddress, rightMargin + 100, addressY + 12, { width: 200 });
 const billingHeight = doc.heightOfString(data.billingAddress, rightMargin + 100, addressY + 12, { width: 200 })
 doc.moveDown()
 let maxHeight =Math.max(addressHeight,shippingHeight,billingHeight)
 doc.y = addressY + maxHeight -12
 doc.x = leftMargin;
 doc.fontSize(20).text('Products', { align: 'center' });
 doc.moveDown();
 const tableTop = doc.y;
 const itemX = 50;
 const descriptionX = 150;
 const qtyX = 250;
 const grossAmountX = 300;
 const discountX = 350;
 const taxableValueX = 400;
 const igstX = 450;
 const totalX = 500;
 doc.fontSize(10);
 doc.text('Product', itemX, tableTop, { width: descriptionX - itemX - 5 });
 doc.text('Description', descriptionX, tableTop, { width: qtyX - descriptionX - 5 });
 doc.text('Qty', qtyX, tableTop, { width: grossAmountX - qtyX - 5, align: 'right' });
 doc.text('Gross Amount', grossAmountX, tableTop, { width: discountX - grossAmountX - 5, align: 'right' });
 doc.text('Discount', discountX, tableTop, { width: taxableValueX - discountX - 5, align: 'right' });
 doc.text('Taxable Value', taxableValueX, tableTop, { width: igstX - taxableValueX - 5, align: 'right' });
 doc.text('IGST', igstX, tableTop, { width: totalX - igstX - 5, align: 'right' });
 doc.text('Total', totalX, tableTop, { width: 50, align: 'right' });
 const headerBottom = tableTop + 20;
 doc.moveTo(itemX, headerBottom).lineTo(totalX + 50, headerBottom).stroke();
 const rowHeight = 20;
 let position = headerBottom + 10;
 data.items.forEach((item, index) => {
   doc.text(item.product, itemX, position, { width: descriptionX - itemX - 5 });
   doc.text(item.description, descriptionX, position, { width: qtyX - descriptionX - 5 });
   doc.text(item.qty.toString(), qtyX, position, { width: grossAmountX - qtyX - 5, align: 'right' });
   doc.text(item.grossAmount, grossAmountX, position, { width: discountX - grossAmountX - 5, align: 'right' });
   doc.text(item.discount, discountX, position, { width: taxableValueX - discountX - 5, align: 'right' });
   doc.text(item.taxableValue, taxableValueX, position, { width: igstX - taxableValueX - 5, align: 'right' });
   doc.text(item.igst, igstX, position, { width: totalX - igstX - 5, align: 'right' });
   doc.text(item.total, totalX, position, { width: 50, align: 'right' });
   position += rowHeight;
 });
 const itemsBottom = position + 10;
 doc.moveTo(itemX, itemsBottom).lineTo(totalX + 50, itemsBottom).stroke();
 doc.text(`Total Quantity: ${data.totalQty}`, leftMargin, itemsBottom + 10);
 doc.text(`Total Price: ${data.totalPrice}`, leftMargin, itemsBottom + 25);
 doc.moveDown().moveDown();
 doc.text(`Declaration: ${data.declaration}`, leftMargin, doc.y, { align: 'center', width: 500 });
}
module.exports = { generateInvoice };