export interface RoadmapModule {
  id: string;
  title: string;
  lessons: string[];
  completed?: boolean;
  video?: string;
  resources?: Array<{ label: string; url: string }>;
}

export interface RoadmapLevel {
  name: string;
  status: 'completed' | 'current' | 'locked';
  modules: RoadmapModule[];
}

export const ROADMAP_DATA: Record<string, { title: string; description: string; levels: RoadmapLevel[] }> = {
  frontend: {
    title: 'Frontend Developer',
    description: 'Learn the foundations of web interfaces, modern JavaScript, and React to build polished user experiences.',
    levels: [
      {
        name: 'Beginner',
        status: 'completed',
        modules: [
          { id: '1', title: 'Internet Fundamentals', lessons: ['How the web works', 'DNS', 'HTTP/HTTPS'], completed: true },
          { id: '2', title: 'HTML & CSS', lessons: ['Semantic HTML', 'CSS Flexbox/Grid', 'Responsive Design'], completed: true },
        ],
      },
      {
        name: 'Intermediate',
        status: 'current',
        modules: [
          {
            id: '3',
            title: 'Modern JavaScript',
            lessons: ['ES6+ Syntax', 'Asynchronous JS', 'DOM Manipulation'],
            video: 'https://www.youtube.com/embed/W6NZfCO5SIk',
            resources: [
              { label: 'MDN Documentation', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
              { label: 'JavaScript.info', url: 'https://javascript.info/' },
            ],
          },
          { id: '4', title: 'React Essentials', lessons: ['Hooks', 'Props/State', 'Components'] },
        ],
      },
      {
        name: 'Pro',
        status: 'locked',
        modules: [
          { id: '5', title: 'Next.js & Performance', lessons: ['SSR/SSG', 'Optimization', 'Vercel Deployment'] },
          { id: '6', title: 'Advanced Testing', lessons: ['Jest', 'Cypress', 'RTL'] },
        ],
      },
    ],
  },
  backend: {
    title: 'Backend Developer',
    description: 'Master server-side logic, APIs, databases, and system design to build scalable applications.',
    levels: [
      {
        name: 'Beginner',
        status: 'completed',
        modules: [
          { id: 'b1', title: 'Programming Basics', lessons: ['Variables', 'Functions', 'Control Flow'], completed: true },
          { id: 'b2', title: 'HTTP & APIs', lessons: ['REST basics', 'JSON', 'Request/Response'], completed: true },
        ],
      },
      {
        name: 'Intermediate',
        status: 'current',
        modules: [
          { id: 'b3', title: 'Node.js & Express', lessons: ['Routing', 'Middleware', 'Authentication'] },
          { id: 'b4', title: 'Databases', lessons: ['SQL', 'MongoDB', 'Relationships'] },
        ],
      },
      {
        name: 'Pro',
        status: 'locked',
        modules: [
          { id: 'b5', title: 'System Design', lessons: ['Scaling', 'Caching', 'Load Balancing'] },
          { id: 'b6', title: 'Production Deployment', lessons: ['Docker', 'CI/CD', 'Monitoring'] },
        ],
      },
    ],
  },
  'data-analyst': {
    title: 'Data Analyst',
    description: 'Build expertise in Python, SQL, data cleaning, statistics, and business intelligence storytelling.',
    levels: [
      {
        name: 'Beginner',
        status: 'completed',
        modules: [
          { id: 'd1', title: 'Python Fundamentals', lessons: ['Syntax', 'Lists', 'Loops'], completed: true },
          { id: 'd2', title: 'Spreadsheet & Data Basics', lessons: ['Tables', 'Filters', 'Summaries'], completed: true },
        ],
      },
      {
        name: 'Intermediate',
        status: 'current',
        modules: [
          { id: 'd3', title: 'SQL & Data Wrangling', lessons: ['SELECT', 'JOINs', 'CLEANING'] },
          { id: 'd4', title: 'Visualization', lessons: ['Charts', 'Dashboards', 'Insights'] },
        ],
      },
      {
        name: 'Pro',
        status: 'locked',
        modules: [
          { id: 'd5', title: 'Statistics', lessons: ['A/B testing', 'Probability', 'Hypothesis testing'] },
          { id: 'd6', title: 'Business Analytics', lessons: ['KPIs', 'Forecasting', 'Storytelling'] },
        ],
      },
    ],
  },
  cybersecurity: {
    title: 'Cybersecurity',
    description: 'Develop the skills to secure systems, analyze threats, and protect digital infrastructure.',
    levels: [
      {
        name: 'Beginner',
        status: 'completed',
        modules: [
          { id: 'c1', title: 'Networking Basics', lessons: ['IP', 'DNS', 'Ports'], completed: true },
          { id: 'c2', title: 'Linux Essentials', lessons: ['Shell', 'Permissions', 'Processes'], completed: true },
        ],
      },
      {
        name: 'Intermediate',
        status: 'current',
        modules: [
          { id: 'c3', title: 'Threat Fundamentals', lessons: ['Malware', 'Phishing', 'SOC basics'] },
          { id: 'c4', title: 'Web Security', lessons: ['OWASP', 'XSS', 'CSRF'] },
        ],
      },
      {
        name: 'Pro',
        status: 'locked',
        modules: [
          { id: 'c5', title: 'Offensive Security', lessons: ['Reconnaissance', 'Exploitation', 'Reporting'] },
          { id: 'c6', title: 'Defensive Security', lessons: ['Logs', 'SIEM', 'Incident Response'] },
        ],
      },
    ],
  },
  'ui-ux': {
    title: 'UI/UX Designer',
    description: 'Create user-first experiences with design thinking, wireframing, usability, and interaction patterns.',
    levels: [
      {
        name: 'Beginner',
        status: 'completed',
        modules: [
          { id: 'u1', title: 'Design Fundamentals', lessons: ['Color', 'Layout', 'Typography'], completed: true },
          { id: 'u2', title: 'UX Research', lessons: ['User interviews', 'Pain points', 'Surveys'], completed: true },
        ],
      },
      {
        name: 'Intermediate',
        status: 'current',
        modules: [
          { id: 'u3', title: 'Figma & Prototyping', lessons: ['Frames', 'Components', 'Interactions'] },
          { id: 'u4', title: 'Information Architecture', lessons: ['Navigation', 'Content hierarchy', 'Flows'] },
        ],
      },
      {
        name: 'Pro',
        status: 'locked',
        modules: [
          { id: 'u5', title: 'Design Systems', lessons: ['Tokens', 'Patterns', 'Accessibility'] },
          { id: 'u6', title: 'Portfolio & Case Studies', lessons: ['Research docs', 'Metrics', 'Presentation'] },
        ],
      },
    ],
  },
  fullstack: {
    title: 'Fullstack Engineer',
    description: 'Connect frontend craftsmanship with backend systems to ship complete products end-to-end.',
    levels: [
      {
        name: 'Beginner',
        status: 'completed',
        modules: [
          { id: 'f1', title: 'Frontend Basics', lessons: ['HTML', 'CSS', 'Responsive UI'], completed: true },
          { id: 'f2', title: 'Backend Foundations', lessons: ['Servers', 'Database basics', 'APIs'], completed: true },
        ],
      },
      {
        name: 'Intermediate',
        status: 'current',
        modules: [
          { id: 'f3', title: 'Fullstack Project Flow', lessons: ['Auth', 'CRUD', 'State sync'] },
          { id: 'f4', title: 'Dev Tools', lessons: ['Debugging', 'Testing', 'Deployment'] },
        ],
      },
      {
        name: 'Pro',
        status: 'locked',
        modules: [
          { id: 'f5', title: 'Production Architectures', lessons: ['Monorepos', 'Microservices', 'Caching'] },
          { id: 'f6', title: 'Scaling & Optimization', lessons: ['Performance', 'Monitoring', 'Reliability'] },
        ],
      },
    ],
  },
};
