// pages/api/auth/logout.js
import { serialize } from 'cookie';

export default function handler(req, res) {
  // Clear the cookie by setting it to expire immediately
  const cookie = serialize('auth', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: -1, // Expire immediately
    path: '/'
  });

  res.setHeader('Set-Cookie', cookie);
  res.status(200).json({ message: 'Logged out successfully' });
}