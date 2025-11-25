// User model for MySQL
// Table: users (id, username, password, role)

const db = require('./db');

async function createUser(username, passwordHash, role = 'Guest') {
  const [result] = await db.execute(
    'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
    [username, passwordHash, role]
  );
  return result.insertId;
}

async function findUserByUsername(username) {
  const [rows] = await db.execute(
    'SELECT * FROM users WHERE username = ?',
    [username]
  );
  return rows[0];
}

module.exports = { createUser, findUserByUsername };
