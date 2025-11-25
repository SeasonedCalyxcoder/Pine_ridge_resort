const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { createUser, findUserByUsername } = require('./models');
const { logAction } = require('./audit');

// In-memory store for reset tokens (for demo/testing)
const resetTokens = {};
// Password reset request endpoint
router.post('/forgot-password', async (req, res) => {
  const { username } = req.body;
  const user = await findUserByUsername(username);
  if (!user) {
    logAction({ username, action: 'password_reset_request', details: { found: false } });
    // Always respond with success to avoid user enumeration
    return res.json({ message: 'If this username exists, a reset link will be sent.' });
  }
  // Generate a token
  const token = crypto.randomBytes(32).toString('hex');
  // Store token with expiration (15 min)
  resetTokens[token] = { username, expires: Date.now() + 15 * 60 * 1000 };
  logAction({ username, action: 'password_reset_request', details: { found: true, token } });
  // In production, send email with link containing token
  // For demo, return token in response
  res.json({ message: 'Password reset token generated.', token });
});

// Password reset endpoint
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  const entry = resetTokens[token];
  if (!entry || entry.expires < Date.now()) {
    logAction({ username: entry?.username || 'unknown', action: 'password_reset_failed', details: { reason: 'Invalid or expired token' } });
    return res.status(400).json({ error: 'Invalid or expired token.' });
  }
  const user = await findUserByUsername(entry.username);
  if (!user) {
    logAction({ username: entry.username, action: 'password_reset_failed', details: { reason: 'User not found' } });
    return res.status(400).json({ error: 'User not found.' });
  }
  const passwordHash = await bcrypt.hash(newPassword, 10);
  // Update password in DB
  const db = require('./db');
  await db.execute('UPDATE users SET password = ? WHERE username = ?', [passwordHash, entry.username]);
  // Remove token
  delete resetTokens[token];
  logAction({ username: entry.username, action: 'password_reset_success', details: {} });
  res.json({ message: 'Password has been reset.' });
});
//const router = express.Router();

// Registration endpoint
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  const existingUser = await findUserByUsername(username);
  if (existingUser) {
    return res.status(409).json({ error: 'Username already exists' });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const userId = await createUser(username, passwordHash, role || 'Guest');
  logAction({ username, action: 'register', details: { role: role || 'Guest' } });
  res.status(201).json({ userId, username, role: role || 'Guest' });
});

// Login endpoint with 2FA step
const jwt = require('jsonwebtoken');
const { SECRET } = require('./middleware');

// In-memory store for 2FA codes (for demo)
const twoFACodes = {};

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await findUserByUsername(username);
  if (!user) {
    logAction({ username, action: 'login_failed', details: { reason: 'User not found' } });
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    logAction({ username, action: 'login_failed', details: { reason: 'Wrong password' } });
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  // Generate 2FA code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  twoFACodes[username] = { code, expires: Date.now() + 5 * 60 * 1000 };
  logAction({ username, action: 'login_password_ok', details: { twoFACode: code } });
  // For demo, return code in response
  res.json({ twoFARequired: true, code });
});

// 2FA verification endpoint
router.post('/verify-2fa', async (req, res) => {
  const { username, code } = req.body;
  const user = await findUserByUsername(username);
  if (!user || !twoFACodes[username]) {
    logAction({ username, action: '2fa_failed', details: { reason: 'Invalid or expired code' } });
    return res.status(401).json({ error: 'Invalid or expired 2FA code' });
  }
  const { code: expectedCode, expires } = twoFACodes[username];
  if (Date.now() > expires) {
    delete twoFACodes[username];
    logAction({ username, action: '2fa_failed', details: { reason: 'Code expired' } });
    return res.status(401).json({ error: '2FA code expired' });
  }
  if (code !== expectedCode) {
    logAction({ username, action: '2fa_failed', details: { reason: 'Wrong code', provided: code } });
    return res.status(401).json({ error: 'Invalid 2FA code' });
  }
  // Success: issue JWT
  delete twoFACodes[username];
  logAction({ username, action: '2fa_success', details: {} });
  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, SECRET, { expiresIn: '1h' });
  res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
});

module.exports = router;
