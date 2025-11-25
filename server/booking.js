const express = require('express');
const router = express.Router();
const db = require('./db');
const { authenticateToken } = require('./middleware');
// Process a refund for a booking
router.post('/:id/refund', async (req, res) => {
  const booking_id = req.params.id;
  const { reason } = req.body;
  // Fetch booking details
  const [rows] = await db.execute('SELECT * FROM bookings WHERE id = ?', [booking_id]);
  if (rows.length === 0) {
    return res.status(404).json({ error: 'Booking not found.' });
  }
  const booking = rows[0];
  // Only allow refund if status is 'paid'
  if (booking.payment_status !== 'paid') {
    return res.status(400).json({ error: 'Refunds can only be processed for paid bookings.' });
  }
  await db.execute('UPDATE bookings SET payment_status = ? WHERE id = ?', ['refunded', booking_id]);
  // Log transaction
  await db.execute(
    'INSERT INTO transactions (booking_id, user_id, action, status, amount, details) VALUES (?, ?, ?, ?, ?, ?)',
    [
      booking_id,
      booking.user_id,
      'refund_processed',
      'refunded',
      booking.amount || null,
      JSON.stringify({ reason: reason || 'No reason provided', timestamp: new Date().toISOString() })
    ]
  );
  res.json({ message: 'Refund processed.', payment_status: 'refunded' });
});
// Simulate payment processing for a booking
router.post('/:id/simulate-payment', async (req, res) => {
  const booking_id = req.params.id;
  // Fetch booking details
  const [rows] = await db.execute('SELECT * FROM bookings WHERE id = ?', [booking_id]);
  if (rows.length === 0) {
    return res.status(404).json({ error: 'Booking not found.' });
  }
  const booking = rows[0];
  // Simulate payment: randomly succeed or fail
  const isSuccess = Math.random() < 0.8; // 80% success rate
  const newStatus = isSuccess ? 'paid' : 'failed';
  await db.execute('UPDATE bookings SET payment_status = ? WHERE id = ?', [newStatus, booking_id]);
  // Log transaction
  await db.execute(
    'INSERT INTO transactions (booking_id, user_id, action, status, amount, details) VALUES (?, ?, ?, ?, ?, ?)',
    [
      booking_id,
      booking.user_id,
      'payment_simulation',
      newStatus,
      booking.amount || null,
      JSON.stringify({ simulated: true, timestamp: new Date().toISOString() })
    ]
  );
  res.json({
    message: isSuccess ? 'Payment simulated successfully.' : 'Payment simulation failed.',
    payment_status: newStatus
  });
});
const PDFDocument = require('pdfkit');
// Generate PDF invoice for a booking
router.get('/:id/invoice', async (req, res) => {
  const booking_id = req.params.id;
  const [rows] = await db.execute('SELECT * FROM bookings WHERE id = ?', [booking_id]);
  if (rows.length === 0) {
    return res.status(404).json({ error: 'Booking not found.' });
  }
  const booking = rows[0];
    const fs = require('fs');
    const path = require('path');
    const invoiceDir = path.join(__dirname, '../invoices');
    if (!fs.existsSync(invoiceDir)) {
      fs.mkdirSync(invoiceDir);
    }
    const invoicePath = path.join(invoiceDir, `invoice_${booking_id}.pdf`);
    const stream = fs.createWriteStream(invoicePath);
    const doc = new PDFDocument();
    doc.pipe(stream);
    doc.fontSize(20).text('Pine Ridge Resort Invoice', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Booking ID: ${booking.id}`);
    doc.text(`User ID: ${booking.user_id}`);
    doc.text(`Room: ${booking.room_id}`);
    doc.text(`Amount: ${booking.amount || 'N/A'}`);
    doc.text(`Status: ${booking.payment_status}`);
    doc.text(`Date: ${booking.created_at}`);
    doc.end();
    stream.on('finish', async () => {
      await db.execute(
        'INSERT INTO transactions (booking_id, user_id, action, status, amount, details) VALUES (?, ?, ?, ?, ?, ?)',
        [
          booking_id,
          booking.user_id,
          'invoice_generated',
          booking.payment_status,
          booking.amount || null,
          JSON.stringify({ invoice_path: invoicePath, timestamp: new Date().toISOString() })
        ]
      );
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=invoice_${booking_id}.pdf`);
      fs.createReadStream(invoicePath).pipe(res);
    });
    stream.on('error', (err) => {
      res.status(500).json({ error: 'Failed to generate invoice.' });
    });
});
// Update payment status for a booking (manual/admin)
router.put('/:id/payment-status', async (req, res) => {
  const booking_id = req.params.id;
  const { payment_status } = req.body;
  const allowedStatuses = ['pending', 'paid', 'refunded', 'failed'];
  if (!allowedStatuses.includes(payment_status)) {
    return res.status(400).json({ error: 'Invalid payment status.' });
  }
  const [result] = await db.execute(
    'UPDATE bookings SET payment_status = ? WHERE id = ?',
    [payment_status, booking_id]
  );
  if (result.affectedRows === 0) {
    return res.status(404).json({ error: 'Booking not found.' });
  }
  // Log transaction
  // Get booking for user_id and amount
  const [rows] = await db.execute('SELECT * FROM bookings WHERE id = ?', [booking_id]);
  const booking = rows[0];
  await db.execute(
    'INSERT INTO transactions (booking_id, user_id, action, status, amount, details) VALUES (?, ?, ?, ?, ?, ?)',
    [
      booking_id,
      booking.user_id,
      'payment_status_update',
      payment_status,
      null, // Add amount if available
      JSON.stringify({ updated_by: 'manual', timestamp: new Date().toISOString() })
    ]
  );
  res.json({ message: 'Payment status updated.', payment_status });
});


// Update booking
router.put('/:id', authenticateToken, async (req, res) => {
  const booking_id = req.params.id;
  const user_id = req.user.id;
  const { start_date, end_date, guests } = req.body;
  // Date validation
  if (new Date(start_date) >= new Date(end_date)) {
    return res.status(400).json({ error: 'Invalid date range.' });
  }
  // Check for conflicts
  const [conflicts] = await db.execute(
    'SELECT * FROM bookings WHERE room_id = (SELECT room_id FROM bookings WHERE id = ?) AND id != ? AND ((start_date < ? AND end_date > ?) OR (start_date < ? AND end_date > ?))',
    [booking_id, booking_id, end_date, start_date, end_date, start_date]
  );
  if (conflicts.length > 0) {
    return res.status(409).json({ error: 'Room not available for selected dates.' });
  }
  const [result] = await db.execute(
    'UPDATE bookings SET start_date = ?, end_date = ?, guests = ? WHERE id = ? AND user_id = ?',
    [start_date, end_date, guests, booking_id, user_id]
  );
  if (result.affectedRows === 0) {
    return res.status(404).json({ error: 'Booking not found or not owned by user.' });
  }
  res.json({ message: 'Booking updated.' });
});

// Create a booking
router.post('/', authenticateToken, async (req, res) => {
  const { room_id, start_date, end_date, guests } = req.body;
  const user_id = req.user.id;
  // Date validation
  if (new Date(start_date) >= new Date(end_date)) {
    return res.status(400).json({ error: 'Invalid date range.' });
  }
  // Check for conflicts
  const [conflicts] = await db.execute(
    'SELECT * FROM bookings WHERE room_id = ? AND ((start_date < ? AND end_date > ?) OR (start_date < ? AND end_date > ?))',
    [room_id, end_date, start_date, end_date, start_date]
  );
  if (conflicts.length > 0) {
    return res.status(409).json({ error: 'Room not available for selected dates.' });
  }
  // Insert booking
  await db.execute(
    'INSERT INTO bookings (user_id, room_id, start_date, end_date, guests, status) VALUES (?, ?, ?, ?, ?, ?)',
    [user_id, room_id, start_date, end_date, guests, 'pending']
  );
  res.status(201).json({ message: 'Booking created. Pending confirmation.' });
});

// Get bookings for user
router.get('/my', authenticateToken, async (req, res) => {
  const user_id = req.user.id;
  const [bookings] = await db.execute('SELECT * FROM bookings WHERE user_id = ?', [user_id]);
  res.json(bookings);
});

// Cancel booking
router.delete('/:id', authenticateToken, async (req, res) => {
  const booking_id = req.params.id;
  const user_id = req.user.id;
  await db.execute('DELETE FROM bookings WHERE id = ? AND user_id = ?', [booking_id, user_id]);
  res.json({ message: 'Booking cancelled.' });
});

module.exports = router;
