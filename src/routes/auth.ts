import express from 'express';
import logger from '../utils/logger';
import { connectMongoDB } from '../db/mongodb.config';
import mongoose from 'mongoose';
import User from '../db/models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import authGuard from '../utils/authGuard';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    await connectMongoDB();
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Username or password is incorrect.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Username or password is incorrect.' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    mongoose.connection.close();
    return res.status(200).json({ message: 'Login successfully', token: token, user: { name: user.name } });
  } catch (err) {
    res.status(500).json({ message: 'An error has occurred.' });
    logger.error(`Error in getting login: ${err.message}`);
  }
})

router.post('/register', async (req, res) => {
  try {
    await connectMongoDB();
    const {
      username,
      name,
      email,
      password,
      role = 'user',
    } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      name,
      email,
      passwordHash: hashedPassword,
      role
    });
  
    await newUser.save();

    mongoose.connection.close();
    return res.status(200).json({ message: 'Register successfully.', body: req.body });
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(400).json({
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists. Please use a different ${field}.`,
        field: field,
        value: req.body[field],
      });
    }
    res.status(500).json({ message: 'An error has occurred.' });
    logger.error(`Error in getting register: ${err.message}`);
  }
});

router.get('/profile', authGuard, async (req: any, res) => {
  try {
    return res.status(200).json({ message: 'My profile.', data: req.user });
  } catch (err) {
    res.status(500).json({ message: 'An error has occurred.' });
    logger.error(`Error in getting profile: ${err.message}`);
  }
});

export default router;
