import { Suspense, lazy, type ReactElement } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { getAuthUser, isAuthenticated } from './utils/rbacAuth';

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

const PageLoader = () => <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 font-semibold">Loading...</div>;

export function App() {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<PublicOnlyRoute><Signup /></PublicOnlyRoute>} />
          <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
          <Route path="/verify-otp" element={<PublicOnlyRoute><VerifyOTP /></PublicOnlyRoute>} />
          <Route path="/verify-college" element={<PublicOnlyRoute><VerifyCollege /></PublicOnlyRoute>} />

          <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<RoleRoute role="student"><Dashboard /></RoleRoute>} />
            <Route path="/courses" element={<RoleRoute role="student"><MyCourses /></RoleRoute>} />
            <Route path="/browse" element={<RoleRoute role="student"><BrowseCourses /></RoleRoute>} />
            <Route path="/course/:id" element={<RoleRoute role="student"><CourseDetails /></RoleRoute>} />
            <Route path="/paths" element={<RoleRoute role="student"><Pathways /></RoleRoute>} />
            <Route path="/roadmaps" element={<RoleRoute role="student"><RoadmapList /></RoleRoute>} />
            <Route path="/roadmaps/:role" element={<RoleRoute role="student"><RoadmapDetail /></RoleRoute>} />
            <Route path="/assessments" element={<RoleRoute role="student"><Assessments /></RoleRoute>} />
            <Route path="/buddy" element={<RoleRoute role="student"><BuddyChat /></RoleRoute>} />
            <Route path="/leaderboard" element={<RoleRoute role="student"><Leaderboard /></RoleRoute>} />
            <Route path="/rewards" element={<RoleRoute role="student"><Rewards /></RoleRoute>} />
            <Route path="/internships" element={<RoleRoute role="student"><Internships /></RoleRoute>} />
            <Route path="/companies/:id" element={<RoleRoute role="student"><CompanyDetail /></RoleRoute>} />
            <Route path="/events" element={<RoleRoute role="student"><Events /></RoleRoute>} />
            <Route path="/soft-skills" element={<RoleRoute role="student"><SoftSkills /></RoleRoute>} />
            <Route path="/admin" element={<RoleRoute role="admin"><AdminDashboard /></RoleRoute>} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
