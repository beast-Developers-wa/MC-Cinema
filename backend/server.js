import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET || 'yoursecretkey';


app.use(cors({
  origin: 'http://192.168.43.16:5000', 
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile:   { type: String, required: true, unique: true },
});
const User = mongoose.model('User', userSchema);


app.post('/signup', async (req, res) => {
  const { username, email, password, mobile } = req.body;
  if (!username || !email || !password || !mobile) {
    return res.status(400).json({ message: 'Please fill all fields' });
  }
  try {
    if (await User.findOne({ username })) 
      return res.status(409).json({ message: 'Username already taken' });
    if (await User.findOne({ email })) 
      return res.status(409).json({ message: 'Email already registered' });
    if (await User.findOne({ mobile })) 
      return res.status(409).json({ message: 'Mobile already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword, mobile });
    await newUser.save();

    res.status(201).json({ message: 'Signup successful!' });
  } catch (error) {
    console.error('Signup error:', error);
    if (error.code === 11000) {
      const duplicateKey = Object.keys(error.keyValue)[0];
      return res.status(409).json({ message: `${duplicateKey} already exists` });
    }
    res.status(500).json({ message: 'Server error' });
  }
});


app.post('/login', async (req, res) => {
  const { emailOrUsername, password } = req.body;
  if (!emailOrUsername || !password) {
    return res.status(400).json({ msg: 'Please provide email/username and password' });
  }
  try {
    const user = await User.findOne({
      $or: [
        { email: emailOrUsername },
        { username: emailOrUsername },
      ],
    });
    if (!user) return res.status(401).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'lax' });
    res.status(200).json({ msg: 'Login successful!', token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});


app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
