import express from 'express';
import db from '../conn.mjs';

const router = express.Router();

router.post('/', async (req, res) => {
  const { email } = req.body;

  try {
    const collection = db.collection('users');
    const user = await collection.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const profileData = {
      connectedAccounts: user.connectedAccounts || [],
      username: user.username || '',
      biography: user.biography || '',
      image: user.image || '',
      email: user.email
    };

    res.status(200).json(profileData);
  } catch (error) {
    console.error('Error loading profile data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
