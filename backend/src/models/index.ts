import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'student' | 'admin';
  isVerified: boolean;
  collegeVerified: 'none' | 'pending' | 'verified' | 'rejected';
  points: number;
  languagePreference: 'en' | 'hi' | 'hinglish';
  avatar?: string;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  isVerified: { type: Boolean, default: false },
  collegeVerified: { type: String, enum: ['none', 'pending', 'verified', 'rejected'], default: 'none' },
  points: { type: Number, default: 0 },
  languagePreference: { type: String, enum: ['en', 'hi', 'hinglish'], default: 'en' },
  avatar: { type: String },
}, { timestamps: true });

export const User = mongoose.model<IUser>('User', UserSchema);

// OTP Model
const OTPSchema = new Schema({
  email: { type: String, required: true },
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
export const OTP = mongoose.model('OTP', OTPSchema);

// College Verification Model
const CollegeVerificationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  docUrl: { type: String, required: true },
  status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
  remarks: { type: String },
}, { timestamps: true });
export const CollegeVerification = mongoose.model('CollegeVerification', CollegeVerificationSchema);

// Roadmap Models
const RoadmapTaskSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  resources: [{ title: String, url: String }],
  videoUrl: { type: String },
});

const RoadmapModuleSchema = new Schema({
  title: { type: String, required: true },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Pro'], required: true },
  tasks: [RoadmapTaskSchema],
});

const RoadmapRoleSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  icon: { type: String },
  modules: [RoadmapModuleSchema],
});
export const RoadmapRole = mongoose.model('RoadmapRole', RoadmapRoleSchema);

const UserProgressSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  roleId: { type: Schema.Types.ObjectId, ref: 'RoadmapRole', required: true },
  completedTasks: [String], // Task IDs or titles
  pointsEarned: { type: Number, default: 0 },
});
export const UserProgress = mongoose.model('UserProgress', UserProgressSchema);

// Assessment Models
const QuestionSchema = new Schema({
  text: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctOption: { type: Number, required: true },
  explanation: { type: String },
});

const AssessmentSchema = new Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  questions: [QuestionSchema],
  points: { type: Number, default: 100 },
});
export const Assessment = mongoose.model('Assessment', AssessmentSchema);

const AttemptSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  assessmentId: { type: Schema.Types.ObjectId, ref: 'Assessment', required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  answers: [Number],
}, { timestamps: true });
export const Attempt = mongoose.model('Attempt', AttemptSchema);

// Career Models
const CompanySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  logo: { type: String },
  cultureVideoUrls: [String],
  website: { type: String },
});
export const Company = mongoose.model('Company', CompanySchema);

const InternshipSchema = new Schema({
  role: { type: String, required: true },
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  location: { type: String },
  stipend: { type: String },
  duration: { type: String },
  tags: [String],
  isVerified: { type: Boolean, default: false },
});
export const Internship = mongoose.model('Internship', InternshipSchema);

// Event Model
const EventSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  city: { type: String },
  date: { type: Date },
  monthTag: { type: String },
  image: { type: String },
});
export const Event = mongoose.model('Event', EventSchema);

// Reward Model
const RewardSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  pointsRequired: { type: Number, required: true },
  partner: { type: String },
  category: { type: String },
});
export const Reward = mongoose.model('Reward', RewardSchema);

// Soft Skills Models
const SoftSkillLessonSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String },
  videoUrl: { type: String },
});
export const SoftSkillLesson = mongoose.model('SoftSkillLesson', SoftSkillLessonSchema);

const SoftSkillAttemptSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  lessonId: { type: Schema.Types.ObjectId, ref: 'SoftSkillLesson', required: true },
  completed: { type: Boolean, default: false },
});
export const SoftSkillAttempt = mongoose.model('SoftSkillAttempt', SoftSkillAttemptSchema);
