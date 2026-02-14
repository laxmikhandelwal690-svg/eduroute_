import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { MyCourses } from './pages/MyCourses';
import { BrowseCourses } from './pages/BrowseCourses';
import { CourseDetails } from './pages/CourseDetails';
import { Pathways } from './pages/Pathways';
import { MainLayout } from './layouts/MainLayout';

// Auth Pages
import { Signup } from './pages/Auth/Signup';
import { VerifyOTP } from './pages/Auth/VerifyOTP';
import { VerifyCollege } from './pages/Auth/VerifyCollege';
import { Login } from './pages/Auth/Login';

// Roadmap Pages
import { RoadmapList } from './pages/Roadmaps/RoadmapList';
import { RoadmapDetail } from './pages/Roadmaps/RoadmapDetail';

// Learning & Assessments
import { Assessments } from './pages/Assessments/Assessments';
import { BuddyChat } from './pages/Buddy/BuddyChat';

// Gamification
import { Leaderboard } from './pages/Gamification/Leaderboard';
import { Rewards } from './pages/Gamification/Rewards';

// Career & Growth
import { Internships } from './pages/Career/Internships';
import { CompanyDetail } from './pages/Career/CompanyDetail';
import { Events } from './pages/Growth/Events';
import { SoftSkills } from './pages/Growth/SoftSkills';

// Admin
import { AdminDashboard } from './pages/Admin/AdminDashboard';

export function App() {
  return (
    <Router>
      <Routes>
        {/* Public Landing */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Auth Flow */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/verify-college" element={<VerifyCollege />} />
        
        {/* App Shell */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Learning */}
          <Route path="/courses" element={<MyCourses />} />
          <Route path="/browse" element={<BrowseCourses />} />
          <Route path="/course/:id" element={<CourseDetails />} />
          <Route path="/paths" element={<Pathways />} />
          
          {/* Roadmaps */}
          <Route path="/roadmaps" element={<RoadmapList />} />
          <Route path="/roadmaps/:role" element={<RoadmapDetail />} />
          
          {/* Assessments & Buddy */}
          <Route path="/assessments" element={<Assessments />} />
          <Route path="/buddy" element={<BuddyChat />} />
          
          {/* Motivation & Rewards */}
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/rewards" element={<Rewards />} />
          
          {/* Career & Personal Growth */}
          <Route path="/internships" element={<Internships />} />
          <Route path="/companies/:id" element={<CompanyDetail />} />
          <Route path="/events" element={<Events />} />
          <Route path="/soft-skills" element={<SoftSkills />} />
          
          {/* Admin (Simple protection simulated) */}
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
