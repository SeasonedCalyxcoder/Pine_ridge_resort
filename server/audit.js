// Simple audit log utility for demo
const fs = require('fs');
const path = require('path');
const LOG_FILE = path.join(__dirname, 'audit.log');

function logAction({ username, action, details }) {
  const entry = {
    timestamp: new Date().toISOString(),
    username,
    action,
    details
  };
  fs.appendFile(LOG_FILE, JSON.stringify(entry) + '\n', err => {
    if (err) console.error('Audit log error:', err);
  });
}

module.exports = { logAction };
