import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import User from './models/User.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'access_secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh_secret';

// Middleware
mongoose.set('strictQuery', true);
app.use(cors({ origin: FRONTEND_ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Connect MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Helper functions
const createAccessToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, JWT_ACCESS_SECRET, { expiresIn: '15m' });

const createRefreshToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, JWT_REFRESH_SECRET, { expiresIn: '7d' });

// Routes
app.post('/signup', async (req, res) => {
  const { username, email, password, mobile } = req.body;
  if (!username || !email || !password || !mobile)
    return res.status(400).json({ message: 'Please fill all fields' });

  try {
    const exists = await User.findOne({ $or: [{ username }, { email }, { mobile }] });
    if (exists) return res.status(409).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 12);

    // Assign admin role if hardcoded admin creds
    const role = (username === 'admin123' && password === '123admin') ? 'admin' : 'user';

    const newUser = new User({ username, email, password: hashedPassword, mobile, role });
    await newUser.save();

    res.status(201).json({ message: 'Signup successful!' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/login', async (req, res) => {
  const { emailOrUsername, password } = req.body;
  if (!emailOrUsername || !password)
    return res.status(400).json({ msg: 'Please provide credentials' });

  try {
    const user = await User.findOne({
      $or: [
        { email: emailOrUsername.trim().toLowerCase() },
        { username: emailOrUsername.trim() }
      ]
    });

    if (!user) return res.status(401).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ msg: 'Invalid credentials' });

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    res.cookie('jid', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/refresh_token',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      msg: 'Login success',
      role: user.role,
      accessToken
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

app.post('/refresh_token', (req, res) => {
  const token = req.cookies.jid;
  if (!token) return res.status(401).json({ accessToken: '' });

  jwt.verify(token, JWT_REFRESH_SECRET, (err, user) => {
    if (err) return res.status(401).json({ accessToken: '' });

    const accessToken = createAccessToken(user);
    res.json({ accessToken });
  });
});

app.post('/logout', (req, res) => {
  res.clearCookie('jid', { path: '/refresh_token' });
  res.json({ msg: 'Logged out' });
});

// Admin-only route example
app.get('/admin', (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(403).json({ msg: 'Access denied' });

  try {
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({ msg: 'Admins only' });

    res.json({ msg: 'Welcome Admin' });
  } catch (err) {
    return res.status(403).json({ msg: 'Invalid token' });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
});
