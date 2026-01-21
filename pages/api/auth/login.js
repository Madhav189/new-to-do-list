// pages/api/auth/login.js
import { db } from '../../../lib/db';
import bcrypt from 'bcryptjs';
import { serialize } from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { username, password } = req.body;

  try {
    // 1. Get user from DB
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    const user = rows[0];

    // 2. Check if user exists AND password matches
    if (user && bcrypt.compareSync(password, user.password)) {
      
      // 3. Set Cookie
      const cookie = serialize('auth', String(user.id), {
        httpOnly: true,
        path: '/',
        maxAge: 3600 // 1 hour
      });
      res.setHeader('Set-Cookie', cookie);
      res.json({ message: 'Welcome' });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}