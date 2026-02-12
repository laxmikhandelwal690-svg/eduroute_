import express from 'express';
import { 
  RoadmapRole, Assessment, Attempt, Internship, 
  Company, Event, Reward, SoftSkillLesson, User 
} from '../models';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = express.Router();

// --- Roadmap Routes ---
router.get('/roadmaps', async (req, res) => {
  const roadmaps = await RoadmapRole.find();
  res.json({ success: true, data: roadmaps });
});

router.get('/roadmaps/:slug', async (req, res) => {
  const roadmap = await RoadmapRole.findOne({ slug: req.params.slug });
  res.json({ success: true, data: roadmap });
});

// --- Assessment Routes ---
router.get('/assessments', async (req, res) => {
  const assessments = await Assessment.find({}, { questions: 0 }); // Hide questions in list
  res.json({ success: true, data: assessments });
});

router.get('/assessments/:id', authMiddleware, async (req, res) => {
  const assessment = await Assessment.findById(req.params.id);
  res.json({ success: true, data: assessment });
});

router.post('/assessments/:id/attempt', authMiddleware, async (req: any, res) => {
  const attempt = new Attempt({
    ...req.body,
    userId: req.user.id,
    assessmentId: req.params.id
  });
  await attempt.save();
  // Update user points
  await User.findByIdAndUpdate(req.user.id, { $inc: { points: attempt.score * 10 } });
  res.json({ success: true, data: attempt });
});

// --- Career Routes ---
router.get('/internships', async (req, res) => {
  const internships = await Internship.find().populate('companyId');
  res.json({ success: true, data: internships });
});

router.get('/companies/:id', async (req, res) => {
  const company = await Company.findById(req.params.id);
  res.json({ success: true, data: company });
});

// --- Growth Routes ---
router.get('/events', async (req, res) => {
  const events = await Event.find();
  res.json({ success: true, data: events });
});

router.get('/soft-skills', async (req, res) => {
  const lessons = await SoftSkillLesson.find();
  res.json({ success: true, data: lessons });
});

// --- Reward Routes ---
router.get('/rewards', async (req, res) => {
  const rewards = await Reward.find();
  res.json({ success: true, data: rewards });
});

// --- AI Buddy Simulator ---
router.post('/buddy/chat', authMiddleware, async (req, res) => {
  const { message, language } = req.body;
  // This would normally call an LLM. Here we return deterministic responses.
  let response = "That's an interesting question! Let's look at your roadmap for guidance.";
  if (language === 'hinglish') {
    response = "Ye kaafi sahi sawaal hai! Chalo tumhare roadmap ko check karte hain guidance ke liye.";
  }
  res.json({ success: true, data: { text: response } });
});

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
