const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const UserModel = require('./models/users');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Signup Route
app.post('/signup', async (req, res) => {
  const { name, email, mobile, password } = req.body;
  console.log('Signup request received:', req.body);

  if (!name || !email || !mobile || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      console.log('Email already registered:', email);
      return res.status(400).json({ message: 'Email already registered' });
    }

    const newUser = new UserModel({ name, email, mobile, password });
    await newUser.save();

    console.log('User created:', newUser);
    res.status(201).json({ message: 'User registered successfully', user: { name: newUser.name, email: newUser.email, mobile: newUser.mobile } });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login request received:', req.body);

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Incorrect password for:', email);
      return res.status(401).json({ message: 'Incorrect password' });
    }

    console.log('Login successful for:', email);
    res.status(200).json({ message: 'Login successful', user: { name: user.name, email: user.email, mobile: user.mobile } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
