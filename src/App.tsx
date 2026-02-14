import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';

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

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 font-semibold">
    Loading...
  </div>
);

export function App() {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/verify-college" element={<VerifyCollege />} />

          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/courses" element={<MyCourses />} />
            <Route path="/browse" element={<BrowseCourses />} />
            <Route path="/course/:id" element={<CourseDetails />} />
            <Route path="/paths" element={<Pathways />} />
            <Route path="/roadmaps" element={<RoadmapList />} />
            <Route path="/roadmaps/:role" element={<RoadmapDetail />} />
            <Route path="/assessments" element={<Assessments />} />
            <Route path="/buddy" element={<BuddyChat />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/internships" element={<Internships />} />
            <Route path="/companies/:id" element={<CompanyDetail />} />
            <Route path="/events" element={<Events />} />
            <Route path="/soft-skills" element={<SoftSkills />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
