import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { 
  RoadmapRole, Assessment, Internship, 
  Company, Event, Reward, SoftSkillLesson 
} from './models';

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eduroute');
    console.log('Connected to DB for seeding...');

    // Clear existing data
    await RoadmapRole.deleteMany({});
    await Assessment.deleteMany({});
    await Internship.deleteMany({});
    await Company.deleteMany({});
    await Event.deleteMany({});
    await Reward.deleteMany({});
    await SoftSkillLesson.deleteMany({});

    // Seed Companies
    const companies = await Company.insertMany([
      { name: 'TechFlow Systems', description: 'AI-first engineering company', cultureVideoUrls: ['https://example.com/video1'] },
      { name: 'DataScale AI', description: 'Data analytics platform', cultureVideoUrls: ['https://example.com/video2'] }
    ]);

    // Seed Roadmaps
    await RoadmapRole.create({
      name: 'Frontend Developer',
      slug: 'frontend',
      description: 'Master modern web development',
      modules: [
        { 
          title: 'Basics', 
          level: 'Beginner', 
          tasks: [{ title: 'HTML/CSS', description: 'Learn structure and style' }]
        },
        { 
          title: 'Advanced React', 
          level: 'Intermediate', 
          tasks: [{ title: 'Hooks', description: 'Master React hooks' }]
        }
      ]
    });

    // Seed Internships
    await Internship.insertMany([
      { role: 'Frontend Intern', companyId: companies[0]._id, location: 'Remote', stipend: '₹25,000', duration: '6 months', tags: ['React'], isVerified: true },
      { role: 'Data Science Intern', companyId: companies[1]._id, location: 'Pune', stipend: '₹30,000', duration: '3 months', tags: ['Python'], isVerified: true }
    ]);

    // Seed Assessments
    await Assessment.create({
      title: 'React Fundamentals',
      category: 'Frontend',
      questions: [
        { text: 'What is JSX?', options: ['A JS extension', 'A CSS framework', 'A database', 'None'], correctOption: 0 }
      ],
      points: 200
    });

    // Seed Events
    await Event.create({
      title: 'Global AI Summit',
      city: 'Delhi',
      date: new Date('2024-12-15'),
      monthTag: 'Dec',
      image: 'https://images.unsplash.com/photo-1540575861501-7ad05823c9f5'
    });

    // Seed Rewards
    await Reward.create({
      title: '50% Off IIT Jodhpur Courses',
      description: 'Unlock exclusive academic benefits',
      pointsRequired: 5000,
      partner: 'IIT Jodhpur',
      category: 'Education'
    });

    console.log('Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seed();
