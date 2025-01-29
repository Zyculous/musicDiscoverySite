import express from 'express';
import db from '../conn.mjs';

const router = express.Router();

router.post('/saveAccount', async (req, res) => {
  const { email, connectedAccounts, username, biography, image, name } = req.body;

  try {
    const collection = db.collection('users');
    const result = await collection.updateOne(
      { email: email },
      {
        $set: {
          connectedAccounts: connectedAccounts,
          username: username,
          biography: biography,
          image: image,
          name: {
            first: name.firstName,
            last: name.lastName
          }
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

router.post('/removeAccount', async (req, res) => {
  const { email, accountId } = req.body;

  try {
    const collection = db.collection('users');
    const result = await collection.updateOne(
      { email: email },
      { $pull: { connectedAccounts: { id: accountId } } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Account removed successfully' });
  } catch (error) {
    console.error('Error removing account:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/loadProfile', async (req, res) => {
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
      email: user.email,
      name: {
        firstName: user.name.firstName || '',
        lastName: user.name.lastName || ''
      }
    };

    res.status(200).json(profileData);
  } catch (error) {
    console.error('Error loading profile data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
