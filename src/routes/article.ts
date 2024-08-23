import express from 'express';
import logger from '../utils/logger';
import { connectMongoDB } from '../db/mongodb.config';
import mongoose from 'mongoose';
import Article from '../db/models/Article';

const router = express.Router();

router.post('/', async (req:any, res) => {
  try {
    await connectMongoDB();
    const {
      title,
      content,
      tags = [],
      category,
      status = 'published',
      summary,
      publishedDate = status === 'published' ? Date.now() : null
    } = req.body;

    const newArticle = new Article({
      title,
      content,
      authorId: req.user.id,
      tags,
      category,
      status,
      summary,
      publishedDate
    });
  
    await newArticle.save();

    mongoose.connection.close();
    return res.status(200).json({ message: 'Article has been created.', token: req.body });
  } catch (err) {
    res.status(500).json({ message: 'An error has occurred.' });
    logger.error(`Error in getting create article: ${err.message}`);
  }
})

router.get('/', async (req:any, res) => {
  try {
    await connectMongoDB();

    const data = await Article.find({ authorId: req.user.id });
    data.reverse()
  
    const newData = data.map(item => {
      return {
        id: item._id,
        title: item.title,
        content: item.content,
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

router.get('/:id', async (req, res) => {
  try {
    await connectMongoDB();

    const item = await Article.findById(req.params.id);

    const newData = {
      id: item._id,
      title: item.title,
      content: item.content,
      authorId: item.authorId,
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
    return res.status(200).json({ message: 'detail articles', data: newData });
  } catch (err) {
    res.status(500).json({ message: 'An error has occurred.' });
    logger.error(`Error in getting detail articles: ${err.message}`);
  }
})

router.put('/:id', async (req, res) => {
  try {
    await connectMongoDB();

    const articleId = req.params.id;
    const {
      title,
      content,
      tags = [],
      category,
      status,
      summary,
    } = req.body;

    const updateData: any = {
      title,
      content,
      tags,
      category,
      status,
      summary,
      updatedAt: new Date(),
    };

    if (status === 'published') {
      updateData.publishedDate = new Date();
    }

    const updatedArticle = await Article.findByIdAndUpdate(articleId, updateData, { new: true });

    if (!updatedArticle) {
      return res.status(404).json({ message: 'Article not found.' });
    }

    mongoose.connection.close();
    return res.status(200).json({ message: 'Article has been updated.', data: updatedArticle });
  } catch (err) {
    res.status(500).json({ message: 'An error has occurred.' });
    logger.error(`Error in getting detail articles: ${err.message}`);
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await connectMongoDB();

    const articleId = req.params.id;

    const deletedArticle = await Article.findByIdAndDelete(articleId);

    if (!deletedArticle) {
      return res.status(404).json({ message: 'Article not found.' });
    }

    mongoose.connection.close();
    return res.status(200).json({ message: 'Article has been deleted.' });
  } catch (err) {
    logger.error(`Error in deleting article: ${err.message}`);
    return res.status(500).json({ message: 'An error has occurred.', error: err.message });
  }
});

export default router;
