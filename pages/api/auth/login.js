// pages/api/auth/login.js
import { db } from '../../../lib/db';
import bcrypt from 'bcryptjs';
import { serialize } from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { username, password } = req.body;
  
  // check if user exists
  const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
  const user = rows[0];

  // validate password
  if (user && bcrypt.compareSync(password, user.password)) {
    const cookie = serialize('auth', String(user.id), {
      httpOnly: true,
      path: '/',
      maxAge: 3600 // 1 hour
    });
    res.setHeader('Set-Cookie', cookie);
    res.json({ message: 'Logged in!' });
  } else {
    res.status(401).json({ message: 'Invalid login' });
  }
}