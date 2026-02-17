const mongoose = require('mongoose');

let cachedConnection = null;

const roadmapStepSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  resources: [{ type: String }],
  practiceTask: { type: String, default: '' },
}, { _id: false });

const roadmapSchema = new mongoose.Schema({
  role: { type: String, required: true, unique: true },
  beginner: [roadmapStepSchema],
  intermediate: [roadmapStepSchema],
  pro: [roadmapStepSchema],
  updatedBy: { type: String, default: 'admin' },
}, { timestamps: true });

const chatMessageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
}, { _id: false });

const userProgressSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  points: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  achievements: [{ type: String }],
  missingSkills: [{ type: String }],
  weeklyChallenges: [{ type: String }],
  preferredLanguage: { type: String, default: 'english' },
  chatHistory: [chatMessageSchema],
}, { timestamps: true });

const Roadmap = mongoose.models.Roadmap || mongoose.model('Roadmap', roadmapSchema);
const UserProgress = mongoose.models.UserProgress || mongoose.model('UserProgress', userProgressSchema);

async function connectDatabase() {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is required.');
  }

  cachedConnection = await mongoose.connect(uri, {
    dbName: process.env.MONGODB_DB_NAME || 'eduroute',
  });

  return cachedConnection;
}

module.exports = {
  connectDatabase,
  Roadmap,
  UserProgress,
};
