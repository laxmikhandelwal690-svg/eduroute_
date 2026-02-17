import express from 'express';
import {
  RoadmapRole, Assessment, Attempt, Internship,
  Company, Event, Reward, SoftSkillLesson, User, Course,
} from '../models';
import { authMiddleware, adminMiddleware, AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();

// --- Role-based profile ---
router.get('/me', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const user = await User.findById(req.user?.id).select('-password');
  return res.json({ success: true, data: user });
});

// --- Course Routes (Student+Admin read, Admin write) ---
router.get('/courses', authMiddleware, async (_req, res) => {
  const courses = await Course.find().sort({ createdAt: -1 });
  return res.json({ success: true, data: courses });
});

router.post('/courses', authMiddleware, adminMiddleware, async (req: AuthenticatedRequest, res) => {
  const { title, description, category, level, duration, instructor, thumbnail } = req.body;

  if (!title || !description || !category || !duration || !instructor) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  const course = await Course.create({
    title,
    description,
    category,
    level,
    duration,
    instructor,
    thumbnail,
    createdBy: req.user?.id,
  });

  return res.status(201).json({ success: true, data: course });
});

router.put('/courses/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updatedCourse) {
    return res.status(404).json({ success: false, error: 'Course not found' });
  }

  return res.json({ success: true, data: updatedCourse });
});

router.delete('/courses/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const deletedCourse = await Course.findByIdAndDelete(req.params.id);
  if (!deletedCourse) {
    return res.status(404).json({ success: false, error: 'Course not found' });
  }

  return res.json({ success: true, message: 'Course deleted successfully' });
});

// --- Student verification (admin only) ---
router.get('/students/pending', authMiddleware, adminMiddleware, async (_req, res) => {
  const pendingStudents = await User.find({ role: 'student', collegeVerified: 'pending' })
    .select('name email collegeVerified createdAt')
    .sort({ createdAt: -1 });

  return res.json({ success: true, data: pendingStudents });
});

router.patch('/students/:id/verification', authMiddleware, adminMiddleware, async (req, res) => {
  const { action } = req.body as { action?: 'approve' | 'reject' };
  if (!action || !['approve', 'reject'].includes(action)) {
    return res.status(400).json({ success: false, error: 'Action must be approve or reject' });
  }

  const collegeVerified = action === 'approve' ? 'verified' : 'rejected';
  const student = await User.findOneAndUpdate(
    { _id: req.params.id, role: 'student' },
    { collegeVerified },
    { new: true },
  ).select('name email collegeVerified');

  if (!student) {
    return res.status(404).json({ success: false, error: 'Student not found' });
  }

  return res.json({ success: true, data: student });
});

// --- Existing Routes ---
router.get('/roadmaps', async (_req, res) => {
  const roadmaps = await RoadmapRole.find();
  res.json({ success: true, data: roadmaps });
});

router.get('/roadmaps/:slug', async (req, res) => {
  const roadmap = await RoadmapRole.findOne({ slug: req.params.slug });
  res.json({ success: true, data: roadmap });
});

router.get('/assessments', async (_req, res) => {
  const assessments = await Assessment.find({}, { questions: 0 });
  res.json({ success: true, data: assessments });
});

router.get('/assessments/:id', authMiddleware, async (req, res) => {
  const assessment = await Assessment.findById(req.params.id);
  res.json({ success: true, data: assessment });
});

router.post('/assessments/:id/attempt', authMiddleware, async (req: AuthenticatedRequest, res) => {
  const attempt = new Attempt({ ...req.body, userId: req.user?.id, assessmentId: req.params.id });
  await attempt.save();
  await User.findByIdAndUpdate(req.user?.id, { $inc: { points: attempt.score * 10 } });
  res.json({ success: true, data: attempt });
});

router.get('/internships', async (_req, res) => {
  const internships = await Internship.find().populate('companyId');
  res.json({ success: true, data: internships });
});

router.get('/companies/:id', async (req, res) => {
  const company = await Company.findById(req.params.id);
  res.json({ success: true, data: company });
});

router.get('/events', async (_req, res) => {
  const events = await Event.find();
  res.json({ success: true, data: events });
});

router.get('/soft-skills', async (_req, res) => {
  const lessons = await SoftSkillLesson.find();
  res.json({ success: true, data: lessons });
});

router.get('/rewards', async (_req, res) => {
  const rewards = await Reward.find();
  res.json({ success: true, data: rewards });
});

router.post('/buddy/chat', authMiddleware, async (req, res) => {
  const { language } = req.body;
  let response = "That's an interesting question! Let's look at your roadmap for guidance.";
  if (language === 'hinglish') {
    response = 'Ye kaafi sahi sawaal hai! Chalo tumhare roadmap ko check karte hain guidance ke liye.';
  }
  res.json({ success: true, data: { text: response } });
});

export default router;
