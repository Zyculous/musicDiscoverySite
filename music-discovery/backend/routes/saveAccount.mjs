import express from 'express';
import db from '../conn.mjs';

const router = express.Router();

router.post('/', async (req, res) => {
  const { email, connectedAccounts, username, biography, image } = req.body;

  try {
    const collection = db.collection('users');
    const result = await collection.updateOne(
      { email: email },
      {
        $set: {
          connectedAccounts: connectedAccounts,
          username: username,
          biography: biography,
          image: image
        }
      },
      { upsert: true }
    );

    if (result.matchedCount === 0 && result.upsertedCount === 0) {
      return res.status(404).json({ message: 'User not found and no new user created' });
    }

    res.status(200).json({ message: 'Account data saved successfully' });
  } catch (error) {
    console.error('Error saving account data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
