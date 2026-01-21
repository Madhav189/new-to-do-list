import { serialize } from 'cookie';

export default function handler(req, res) {
  // We overwrite the 'auth' cookie with an empty string and expire it immediately (-1)
  const cookie = serialize('auth', '', {
    httpOnly: true,
    path: '/',
    maxAge: -1 // This deletes the cookie instantly
  });

  res.setHeader('Set-Cookie', cookie);
  res.status(200).json({ message: 'Logged out successfully' });
}