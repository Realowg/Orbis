import jwt from 'jsonwebtoken';
import User from '../db/models/User';
import mongoose from 'mongoose';
import { connectMongoDB } from '../db/mongodb.config';

const authGuard = async (req, res, next) => {
  try {
    await connectMongoDB();
  
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
  
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    
    await User.updateOne(
      { _id: user._id },
      { lastLogin: Date.now() }
    );
  
    mongoose.connection.close();
  
    req.user = {
      id: user._id,
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role,
      lastLogin: user.lastLogin,
      profilePicture: user.profilePicture,
      bio: user.bio,
      threadsCount: user.threadsCount,
      collectionsCount: user.collectionsCount,
      articlesWritten: user.articlesWritten,
      createdAt: user.createdAt,
    };
  
    next();
  } catch (error) {
    console.error('Error in authentication middleware:', error);
    res.status(400).json({ message: 'Invalid token.' });
  }
};

export default authGuard;