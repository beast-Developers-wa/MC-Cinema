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
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'access_secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh_secret';

// MongoDB User schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  mobile: { type: String, required: true, unique: true, trim: true },
}, { timestamps: true });

mongoose.set('strictQuery', true);

const User = mongoose.model('User', userSchema);

// Middleware
app.use(cors({
  origin: FRONTEND_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// JWT creation
const createAccessToken = (user) =>
  jwt.sign({ id: user._id, username: user.username }, JWT_ACCESS_SECRET, { expiresIn: '15m' });

const createRefreshToken = (user) =>
  jwt.sign({ id: user._id, username: user.username }, JWT_REFRESH_SECRET, { expiresIn: '7d' });

// Routes

// Signup
app.post('/signup', async (req, res) => {
  const { username, email, password, mobile } = req.body;
  if (!username || !email || !password || !mobile)
    return res.status(400).json({ message: 'Please fill all fields' });

  try {
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedMobile = mobile.trim();

    const userExists = await User.findOne({
      $or: [
        { username: trimmedUsername },
        { email: trimmedEmail },
        { mobile: trimmedMobile },
      ],
    });

    if (userExists) {
      if (userExists.username === trimmedUsername)
        return res.status(409).json({ message: 'Username already taken' });
      if (userExists.email === trimmedEmail)
        return res.status(409).json({ message: 'Email already registered' });
      if (userExists.mobile === trimmedMobile)
        return res.status(409).json({ message: 'Mobile already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 12); // increased salt rounds

    const newUser = new User({
      username: trimmedUsername,
      email: trimmedEmail,
      password: hashedPassword,
      mobile: trimmedMobile,
    });

    await newUser.save();

    res.status(201).json({ message: 'Signup successful!' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
app.post('/login', async (req, res) => {
  const { emailOrUsername, password } = req.body;
  if (!emailOrUsername || !password)
    return res.status(400).json({ msg: 'Please provide email/username and password' });

  try {
    const query = {
      $or: [
        { email: emailOrUsername.trim().toLowerCase() },
        { username: emailOrUsername.trim() },
      ],
    };
    const user = await User.findOne(query);

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
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Redirect to frontend home page on successful login
    return res.redirect(FRONTEND_ORIGIN);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Refresh Access Token
app.post('/refresh_token', (req, res) => {
  const token = req.cookies.jid;
  if (!token) return res.status(401).json({ accessToken: '' });

  jwt.verify(token, JWT_REFRESH_SECRET, (err, user) => {
    if (err) return res.status(401).json({ accessToken: '' });

    const accessToken = createAccessToken(user);
    res.json({ accessToken });
  });
});

// Logout
app.post('/logout', (req, res) => {
  res.clearCookie('jid', { path: '/refresh_token' });
  res.json({ msg: 'Logged out' });
});

// Global error handling middleware (optional)
app.use((err, req, res, next) => {
  console.error('Unexpected error:', err);
  res.status(500).json({ msg: 'Something went wrong!' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
