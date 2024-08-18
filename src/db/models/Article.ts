import mongoose, { Schema, Document } from 'mongoose';

interface IArticle extends Document {
  title: string;
  content: string;
  authorId: string;
  thumbnail: string;
  tags: string[];
  category: string;
  publishedDate: Date;
  status: string;
  summary: string;
  relatedArticles: string;
  collectionId: string;
  viewsCount: number;
  likesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ArticleSchema: Schema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  thumbnail: { type: String, default: null },
  tags: { type: [String], default: [] },
  category: { type: String, required: true },
  publishedDate: { type: Date, default: null },
  status: { type: String, required: true },
  summary: { type: String, required: true },
  relatedArticles: { type: String, default: null },
  collectionId: { type: String, default: null },
  viewsCount: { type: Number, default: 0 },
  likesCount: { type: Number, default: 0 },
}, {
    timestamps: true 
});

ArticleSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model<IArticle>('articles', ArticleSchema);
