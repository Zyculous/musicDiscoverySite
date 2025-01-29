import db from '../conn.mjs';
import express from 'express';

export async function spotifyLogin(email, code) {
  try {
    const collection = db.collection('users');
    const result = await collection.updateOne(
      { email: email },
      { $set: { spotifyCode: code } }
    );
    console.log(code);
    if (result.matchedCount === 0) {
      return { status: 404, message: 'User not found' };
    }

    return { status: 200, message: 'Spotify code stored successfully' };
  } catch (error) {
    console.error('Error storing Spotify code:', error);
    return { status: 500, message: 'Internal server error' };
  }
}

const router = express.Router();
router.post('/', async (req, res) => {
  try {
    const { email, code } = req.body; // Destructure email and code from the request body
    let result = await spotifyLogin(email, code);
    console.log('Result:', result);
    res.status(result.status).json({ message: result.message });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
