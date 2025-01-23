import db from '../conn.mjs';
import express from 'express';
import crypto from 'crypto';

export async function login(email, password) {
    console.log('Attempting to log in with email:', email);
    let collection = db.collection('users');
    let document = await collection.findOne({ email: email });
    console.log('Document:', document);
    if (document === null) {
        console.log('User not found');
        return { status: 400, message: 'Invalid email or password' };
    }

    const encryptHash = crypto.pbkdf2Sync(password, document.salt, 10000, 512, 'sha512');

    console.log('Encrypt hash:', encryptHash.toString('hex'));

    if (crypto.timingSafeEqual(document.hash.buffer, encryptHash)) {
        console.log('Login successful');
        delete document._id;
        var expires = (new Date(Date.now()+ 86400*1000)).toUTCString();
        document.cookie = "loggedIn=true; expires=" + expires + ";path=/;"
        return { status: 200, message: 'Login successful' };
    } else {
        delete document._id;

        console.log('Incorrect password');
        return { status: 400, message: 'Invalid email or password' };
    }
}

const router = express.Router();
router.post('/', async (req, res) => {
    try {
        let result = await login(req.body.email, req.body.password);
        console.log('Login result:', result);
        res.status(result.status).json({ message: result.message });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
