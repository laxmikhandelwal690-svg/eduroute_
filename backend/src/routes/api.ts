import express from 'express';
import {
  RoadmapRole, Assessment, Attempt, Internship,
  Company, Event, Reward, SoftSkillLesson, User
} from '../models';
import { authMiddleware } from '../middleware/auth';
import { ApiError, asyncHandler } from '../middleware/error';

const router = express.Router();

// --- Roadmap Routes ---
router.get('/roadmaps', asyncHandler(async (req, res) => {
  const roadmaps = await RoadmapRole.find();
  res.json({ success: true, data: roadmaps });
}));

router.get('/roadmaps/:slug', asyncHandler(async (req, res) => {
  const roadmap = await RoadmapRole.findOne({ slug: req.params.slug });
  if (!roadmap) {
    throw new ApiError(404, 'Roadmap not found');
  }
  res.json({ success: true, data: roadmap });
}));

// --- Assessment Routes ---
router.get('/assessments', asyncHandler(async (req, res) => {
  const assessments = await Assessment.find({}, { questions: 0 });
  res.json({ success: true, data: assessments });
}));

router.get('/assessments/:id', authMiddleware, asyncHandler(async (req, res) => {
  const assessment = await Assessment.findById(req.params.id);
  if (!assessment) {
    throw new ApiError(404, 'Assessment not found');
  }
  res.json({ success: true, data: assessment });
}));

router.post('/assessments/:id/attempt', authMiddleware, asyncHandler(async (req: any, res) => {
  const attempt = new Attempt({
    ...req.body,
    userId: req.user.id,
    assessmentId: req.params.id,
  });
  await attempt.save();
  await User.findByIdAndUpdate(req.user.id, { $inc: { points: attempt.score * 10 } });
  res.json({ success: true, data: attempt });
}));

// --- Career Routes ---
router.get('/internships', asyncHandler(async (req, res) => {
  const internships = await Internship.find().populate('companyId');
  res.json({ success: true, data: internships });
}));

router.get('/companies/:id', asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);
  if (!company) {
    throw new ApiError(404, 'Company not found');
  }
  res.json({ success: true, data: company });
}));

// --- Growth Routes ---
router.get('/events', asyncHandler(async (req, res) => {
  const events = await Event.find();
  res.json({ success: true, data: events });
}));

router.get('/soft-skills', asyncHandler(async (req, res) => {
  const lessons = await SoftSkillLesson.find();
  res.json({ success: true, data: lessons });
}));

// --- Reward Routes ---
router.get('/rewards', asyncHandler(async (req, res) => {
  const rewards = await Reward.find();
  res.json({ success: true, data: rewards });
}));

// --- AI Buddy Simulator ---
router.post('/buddy/chat', authMiddleware, asyncHandler(async (req, res) => {
  const { message, language } = req.body as { message?: string; language?: string };

  if (!message?.trim()) {
    throw new ApiError(400, 'Message is required.');
  }

  if (!process.env.BUDDY_API_KEY && process.env.NODE_ENV === 'production') {
    throw new ApiError(503, 'AI service unavailable.');
  }

  let response = "That's an interesting question! Let's look at your roadmap for guidance.";
  if (language === 'hinglish') {
    response = 'Ye kaafi sahi sawaal hai! Chalo tumhare roadmap ko check karte hain guidance ke liye.';
  }
  res.json({ success: true, data: { text: response } });
}));

// --- Admin Documentation ---
router.get('/docs', (req, res) => {
  const routes = [
    { method: 'GET', path: '/api/roadmaps', description: 'Get all roadmaps' },
    { method: 'GET', path: '/api/assessments', description: 'Get all assessments' },
    { method: 'POST', path: '/api/assessments/:id/attempt', description: 'Submit assessment' },
    { method: 'GET', path: '/api/internships', description: 'Get all internships' },
    { method: 'GET', path: '/api/events', description: 'Get all events' },
    { method: 'GET', path: '/api/rewards', description: 'Get all rewards' },
    { method: 'POST', path: '/api/buddy/chat', description: 'Chat with AI buddy' },
  ];
  res.json({ success: true, data: routes });
});

export default router;
