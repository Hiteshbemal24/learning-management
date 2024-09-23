const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const admin = require('firebase-admin');

const serviceAccount = require('../firebase/learning-6ff71-firebase-adminsdk-1ok7w-39535c2e63.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const verifyFirebaseToken = async (token) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    throw error;
  }
};

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new Error('Invalid email or password');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid email or password');

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/social-login', async (req, res) => {
  const { token } = req.body; 

  try {
    // Verify the Firebase ID token
    const decodedToken = await verifyFirebaseToken(token);
    
    const { email, name, uid } = decodedToken;  
    if (!email) {
      return res.status(400).json({ message: 'Email is required from Google account' });
    }

    // Check if the user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // If the user doesn't exist, create a new one
      user = new User({
        email,
        name,
        googleId: uid, 
      });
      await user.save();
    }

    
    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in with Google', error });
  }
});

module.exports = router;
