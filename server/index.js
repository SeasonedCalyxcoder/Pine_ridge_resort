const express = require('express');
const cors = require('cors');

const authRoutes = require('./auth');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

const { authenticateToken } = require('./middleware');

// Example protected route
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route!', user: req.user });
});

app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to Pine Ridge Resort API!' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
