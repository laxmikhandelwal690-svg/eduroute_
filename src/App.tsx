import { Suspense, lazy, type ReactElement } from 'react';
import { AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { PageTransition } from './components/PageTransition';
import { isAdminSessionActive } from './utils/adminSession';
import { getAuthUser, isAuthenticated } from './utils/rbacAuth';
import { ThemeToggle } from './components/ThemeToggle';

const ProtectedRoute = ({ children }: { children: ReactElement }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const RoleRoute = ({ children, role }: { children: ReactElement; role: 'student' | 'admin' }) => {
  const user = getAuthUser();
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  return children;
};

const PublicOnlyRoute = ({ children }: { children: ReactElement }) => {
  if (isAuthenticated()) {
    const user = getAuthUser();
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  return children;
};

const AdminSessionRoute = ({ children }: { children: ReactElement }) => {
  if (!isAdminSessionActive()) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
};

const LandingPage = lazy(() => import('./pages/LandingPage').then((module) => ({ default: module.LandingPage })));
const Dashboard = lazy(() => import('./pages/Dashboard').then((module) => ({ default: module.Dashboard })));
const MyCourses = lazy(() => import('./pages/MyCourses').then((module) => ({ default: module.MyCourses })));
const BrowseCourses = lazy(() => import('./pages/BrowseCourses').then((module) => ({ default: module.BrowseCourses })));
const CourseDetails = lazy(() => import('./pages/CourseDetails').then((module) => ({ default: module.CourseDetails })));
const Pathways = lazy(() => import('./pages/Pathways').then((module) => ({ default: module.Pathways })));
const MainLayout = lazy(() => import('./layouts/MainLayout').then((module) => ({ default: module.MainLayout })));
const Signup = lazy(() => import('./pages/Auth/Signup').then((module) => ({ default: module.Signup })));
const Login = lazy(() => import('./pages/Auth/Login').then((module) => ({ default: module.Login })));
const VerifyOTP = lazy(() => import('./pages/Auth/VerifyOTP').then((module) => ({ default: module.VerifyOTP })));
const VerifyCollege = lazy(() => import('./pages/Auth/VerifyCollege').then((module) => ({ default: module.VerifyCollege })));
const RoadmapList = lazy(() => import('./pages/Roadmaps/RoadmapList').then((module) => ({ default: module.RoadmapList })));
const RoadmapDetail = lazy(() => import('./pages/Roadmaps/RoadmapDetail').then((module) => ({ default: module.RoadmapDetail })));
const Assessments = lazy(() => import('./pages/Assessments/Assessments').then((module) => ({ default: module.Assessments })));
const BuddyChat = lazy(() => import('./pages/Buddy/BuddyChat').then((module) => ({ default: module.BuddyChat })));
const Leaderboard = lazy(() => import('./pages/Gamification/Leaderboard').then((module) => ({ default: module.Leaderboard })));
const Rewards = lazy(() => import('./pages/Gamification/Rewards').then((module) => ({ default: module.Rewards })));
const Internships = lazy(() => import('./pages/Career/Internships').then((module) => ({ default: module.Internships })));
const CompanyDetail = lazy(() => import('./pages/Career/CompanyDetail').then((module) => ({ default: module.CompanyDetail })));
const Events = lazy(() => import('./pages/Growth/Events').then((module) => ({ default: module.Events })));
const SoftSkills = lazy(() => import('./pages/Growth/SoftSkills').then((module) => ({ default: module.SoftSkills })));
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard').then((module) => ({ default: module.AdminDashboard })));
const AdminLogin = lazy(() => import('./pages/Admin/AdminLogin').then((module) => ({ default: module.AdminLogin })));
const CourseManager = lazy(() => import('./pages/Admin/CourseManager').then((module) => ({ default: module.CourseManager })));
const ProfileDashboard = lazy(() => import('./pages/Profile/ProfileDashboard').then((module) => ({ default: module.ProfileDashboard })));

const PageLoader = () => <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] text-[var(--text-secondary)] font-semibold">Loading...</div>;

const DASHBOARD_ROUTES = ['/dashboard', '/courses', '/browse', '/course/', '/paths', '/roadmaps', '/assessments', '/buddy', '/leaderboard', '/rewards', '/internships', '/events', '/soft-skills', '/admin', '/profile'];

const GlobalThemeButton = () => {
  const location = useLocation();
  const isDashboardArea = DASHBOARD_ROUTES.some((route) => location.pathname === route || location.pathname.startsWith(route));

  if (isDashboardArea) return null;

  return (
    <div className="fixed right-5 top-5 z-[80]">
      <ThemeToggle />
    </div>
  );
};


const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <Suspense fallback={<PageLoader />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
          <Route path="/signup" element={<PublicOnlyRoute><PageTransition><Signup /></PageTransition></PublicOnlyRoute>} />
          <Route path="/login" element={<PublicOnlyRoute><PageTransition><Login /></PageTransition></PublicOnlyRoute>} />
          <Route path="/verify-otp" element={<PublicOnlyRoute><PageTransition><VerifyOTP /></PageTransition></PublicOnlyRoute>} />
          <Route path="/verify-college" element={<PublicOnlyRoute><PageTransition><VerifyCollege /></PageTransition></PublicOnlyRoute>} />
          <Route path="/admin-login" element={<PageTransition><AdminLogin /></PageTransition>} />
          <Route path="/course-manager" element={<AdminSessionRoute><PageTransition><CourseManager /></PageTransition></AdminSessionRoute>} />

          <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<RoleRoute role="student"><PageTransition><Dashboard /></PageTransition></RoleRoute>} />
            <Route path="/courses" element={<RoleRoute role="student"><PageTransition><MyCourses /></PageTransition></RoleRoute>} />
            <Route path="/browse" element={<RoleRoute role="student"><PageTransition><BrowseCourses /></PageTransition></RoleRoute>} />
            <Route path="/course/:id" element={<RoleRoute role="student"><PageTransition><CourseDetails /></PageTransition></RoleRoute>} />
            <Route path="/paths" element={<RoleRoute role="student"><PageTransition><Pathways /></PageTransition></RoleRoute>} />
            <Route path="/roadmaps" element={<RoleRoute role="student"><PageTransition><RoadmapList /></PageTransition></RoleRoute>} />
            <Route path="/roadmaps/:role" element={<RoleRoute role="student"><PageTransition><RoadmapDetail /></PageTransition></RoleRoute>} />
            <Route path="/assessments" element={<RoleRoute role="student"><PageTransition><Assessments /></PageTransition></RoleRoute>} />
            <Route path="/buddy" element={<RoleRoute role="student"><PageTransition><BuddyChat /></PageTransition></RoleRoute>} />
            <Route path="/leaderboard" element={<RoleRoute role="student"><PageTransition><Leaderboard /></PageTransition></RoleRoute>} />
            <Route path="/rewards" element={<RoleRoute role="student"><PageTransition><Rewards /></PageTransition></RoleRoute>} />
            <Route path="/internships" element={<RoleRoute role="student"><PageTransition><Internships /></PageTransition></RoleRoute>} />
            <Route path="/companies/:id" element={<RoleRoute role="student"><PageTransition><CompanyDetail /></PageTransition></RoleRoute>} />
            <Route path="/events" element={<RoleRoute role="student"><PageTransition><Events /></PageTransition></RoleRoute>} />
            <Route path="/soft-skills" element={<RoleRoute role="student"><PageTransition><SoftSkills /></PageTransition></RoleRoute>} />
            <Route path="/profile" element={<RoleRoute role="student"><PageTransition><ProfileDashboard /></PageTransition></RoleRoute>} />
            <Route path="/admin" element={<RoleRoute role="admin"><PageTransition><AdminDashboard /></PageTransition></RoleRoute>} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
};

export function App() {
  return (
    <Router>
      <GlobalThemeButton />
      <AnimatedRoutes />
    </Router>
  );
}

