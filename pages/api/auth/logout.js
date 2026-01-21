import { serialize } from 'cookie';

export default function handler(req, res) {
  /* We set the cookie twice to cover all bases:
     1. Standard removal
     2. Removal with httpOnly flag (just in case)
  */
  res.setHeader('Set-Cookie', [
    serialize('auth', '', { maxAge: -1, path: '/', expires: new Date(0) }),
    serialize('auth', '', { maxAge: -1, path: '/', httpOnly: true, expires: new Date(0) }),
  ]);

  res.status(200).json({ success: true });
}