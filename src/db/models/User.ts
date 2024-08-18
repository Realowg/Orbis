import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  name: string;
  role: string;
  lastLogin: Date;
  profilePicture: string;
  bio: string;
  threadsCount: number;
  collectionsCount: number;
  articlesWritten: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true, default: 'user' },
  lastLogin: { type: Date, default: Date.now() },
  profilePicture: { type: String, default: null },
  bio: { type: String, default: null },
  threadsCount: { type: Number, required: true, default: 0 },
  collectionsCount: { type: Number, required: true, default: 0 },
  articlesWritten: { type: Number, required: true, default: 0 },
}, {
    timestamps: true 
});

UserSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model<IUser>('users', UserSchema);
