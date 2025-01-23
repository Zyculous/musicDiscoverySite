import express from 'express';
import db from "../conn.mjs";
import crypto from 'crypto';

const router = express.Router();

router.post('/', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const salt = crypto.randomBytes(128).toString('base64');
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512');

    await db.collection('users').insertOne({ username, email, salt, hash });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
