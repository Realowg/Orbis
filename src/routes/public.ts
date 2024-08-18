import express from 'express';
import logger from '../utils/logger';
import { connectMongoDB } from '../db/mongodb.config';
import mongoose from 'mongoose';
import Article from '../db/models/Article';

const router = express.Router();

router.get('/article', async (req, res) => {
  try {
    await connectMongoDB();

    const data = await Article.find().populate('authorId', 'name');
    data.reverse()
  
    const newData = data.map(item => {
      return {
        id: item._id,
        title: item.title,
        content: item.content,
        author: item.authorId['name'],
        thumbnail: item.thumbnail,
        tags: item.tags,
        category: item.category,
        publishedDate: item.publishedDate,
        status: item.status,
        summary: item.summary,
        relatedArticles: item.relatedArticles,
        collectionId: item.collectionId,
        viewsCount: item.viewsCount,
        likesCount: item.likesCount,
        createdAt: item.createdAt,
      }
    });

    mongoose.connection.close();
    return res.status(200).json({ message: 'fetch data articles', data: newData });
  } catch (err) {
    res.status(500).json({ message: 'An error has occurred.' });
    logger.error(`Error in getting fetch data articles: ${err.message}`);
  }
})

router.get('/article/:id', async (req:any, res) => {
  try {
    await connectMongoDB();

    const item = await Article.findById(req.params.id).populate('authorId', 'name');
  
    const newData = {
      id: item._id,
      title: item.title,
      content: item.content,
      author: item.authorId['name'],
      thumbnail: item.thumbnail,
      tags: item.tags,
      category: item.category,
      publishedDate: item.publishedDate,
      status: item.status,
      summary: item.summary,
      relatedArticles: item.relatedArticles,
      collectionId: item.collectionId,
      viewsCount: item.viewsCount,
      likesCount: item.likesCount,
      createdAt: item.createdAt,
    }

    mongoose.connection.close();
    return res.status(200).json({ message: 'fetch data articles', data: newData });
  } catch (err) {
    res.status(500).json({ message: 'An error has occurred.' });
    logger.error(`Error in getting fetch data articles: ${err.message}`);
  }
})

export default router;
