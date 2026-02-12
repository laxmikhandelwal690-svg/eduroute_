import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Mock database
const users: any[] = [];

router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  // In a real app, hash password and save to DB
  const user = { id: Date.now().toString(), email, name };
  users.push(user);
  
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
  res.status(201).json({ success: true, token, user });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ success: false, error: 'Invalid credentials' });
  
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
  res.json({ success: true, token, user });
});

export default router;
