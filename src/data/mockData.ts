import { Course, User, LearningPath } from '../types';

export const MOCK_USER: User = {
  id: '1',
  name: 'Alex Rivera',
  email: 'alex@example.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  enrolledCourses: ['1', '2'],
  completedLessons: ['1-1', '1-2'],
  points: 1250,
  rank: 'Gold',
};

export const COURSES: Course[] = [
  {
    id: '1',
    title: 'Master React & TypeScript',
    description: 'Build production-ready applications with React 19 and TypeScript',
    instructor: 'Sarah Johnson',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80',
    duration: '12 hours',
    level: 'Intermediate',
    category: 'Development',
    rating: 4.8,
    students: 15420,
    price: 49.99,
    modules: [
      {
        id: 'm1',
        title: 'React Fundamentals',
        lessons: [
          { id: '1-1', title: 'Introduction to React', duration: '15m', type: 'video', completed: true },
          { id: '1-2', title: 'Components & Props', duration: '20m', type: 'video', completed: true },
          { id: '1-3', title: 'State Management', duration: '25m', type: 'video', completed: false },
        ]
      },
      {
        id: 'm2',
        title: 'TypeScript Integration',
        lessons: [
          { id: '2-1', title: 'TypeScript Basics', duration: '18m', type: 'video', completed: false },
          { id: '2-2', title: 'Type-Safe Components', duration: '22m', type: 'video', completed: false },
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'Full-Stack Development with Node.js',
    description: 'Learn backend development with Node.js, Express, and MongoDB',
    instructor: 'Michael Chen',
    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&auto=format&fit=crop&q=80',
    duration: '18 hours',
    level: 'Advanced',
    category: 'Development',
    rating: 4.9,
    students: 12300,
    price: 59.99,
    modules: []
  },
  {
    id: '3',
    title: 'UI/UX Design Masterclass',
    description: 'Design beautiful and functional user interfaces',
    instructor: 'Emma Davis',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop&q=80',
    duration: '10 hours',
    level: 'Beginner',
    category: 'Design',
    rating: 4.7,
    students: 9800,
    price: 39.99,
    modules: []
  },
  {
    id: '4',
    title: 'Data Science with Python',
    description: 'Master data analysis and machine learning',
    instructor: 'David Kumar',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    duration: '20 hours',
    level: 'Intermediate',
    category: 'Data Science',
    rating: 4.8,
    students: 18500,
    price: 54.99,
    modules: []
  }
];

export const PATHS: LearningPath[] = [
  {
    id: 'p1',
    title: 'Frontend Developer Path',
    description: 'Complete roadmap from HTML to React mastery',
    icon: 'Layers',
    courses: ['1', '3'],
    estimatedTime: '6 months'
  },
  {
    id: 'p2',
    title: 'Backend Developer Path',
    description: 'Master server-side development and databases',
    icon: 'Database',
    courses: ['2'],
    estimatedTime: '8 months'
  }
];
