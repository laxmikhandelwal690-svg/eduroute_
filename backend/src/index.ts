import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import helmet from 'helmet';
import bcrypt from 'bcryptjs';
import authRoutes from './routes/auth';
import apiRoutes from './routes/api';
import { User } from './models';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const ADMIN_EMAIL = 'vansh28@gmail.com';
const ADMIN_PASSWORD = 'timepass';

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

const ensureDefaultAdmin = async () => {
  const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
  if (existingAdmin) {
    return;
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await User.create({
    name: 'EDUROUTE Staff Admin',
    email: ADMIN_EMAIL,
    password: passwordHash,
    role: 'admin',
    isVerified: true,
    collegeVerified: 'verified',
  });

  console.log('Default admin account initialized.');
};

if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
      console.log('Connected to MongoDB');
      await ensureDefaultAdmin();
    })
    .catch((err) => console.error('MongoDB connection error:', err));
} else {
  console.log('Running in local mode without real MongoDB');
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
