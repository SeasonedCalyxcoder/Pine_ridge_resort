const express = require('express');
const router = express.Router();
const db = require('./db');
const { authenticateToken } = require('./middleware');

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
