// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  mobile: { type: String, required: true, unique: true, trim: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
