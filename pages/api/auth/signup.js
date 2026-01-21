// pages/api/auth/signup.js
import { db } from '../../../lib/db';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' });
  }

  // Check if user already exists
  const [existingUser] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
  if (existingUser.length > 0) {
    return res.status(409).json({ message: 'User already exists' });
  }

  // Hash password and save
  const hash = bcrypt.hashSync(password, 10);
  
  try {
    await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash]);
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Database error', error: error.message });
  }
}