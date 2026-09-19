import { Suspense, lazy, type ReactElement } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { isAdminSessionActive } from './utils/adminSession';
import { getAuthUser, isAuthenticated } from './utils/rbacAuth';
import { ThemeToggle } from './components/ThemeToggle';

const ProtectedRoute = ({ children }: { children: ReactElement }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const RoleRoute = ({
  children,
  role,
}: {
  children: ReactElement;
  role: 'student' | 'admin' | 'industry' | 'college' | 'faculty';
}) => {
  const user = getAuthUser();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (user.role !== role) {
    if (user.role === 'college') return <Navigate to="/college/placements" replace />;
    if (user.role === 'admin') return <Navigate to="/admin/pending-approvals" replace />;
    if (user.role === 'industry') return <Navigate to="/industry" replace />;
    if (user.role === 'faculty') return <Navigate to="/faculty" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

const AdminAccessRoute = ({ children }: { children: ReactElement }) => {
  const user = getAuthUser();
  if (user?.role === 'college') {
    return <Navigate to="/college/placements" replace />;
  }
  if (user?.role === 'admin') {
    return children;
  }
  if (isAdminSessionActive()) {
    return children;
  }
  if (isAuthenticated()) {
    const u = getAuthUser();
    if (u?.role === 'industry') return <Navigate to="/industry" replace />;
    if (u?.role === 'faculty') return <Navigate to="/faculty" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return <Navigate to="/admin-login" replace />;
};

const PublicOnlyRoute = ({ children }: { children: ReactElement }) => {
  if (isAuthenticated()) {
    const user = getAuthUser();
    if (user?.role === 'college') return <Navigate to="/college/placements" replace />;
    if (user?.role === 'admin') return <Navigate to="/admin/pending-approvals" replace />;
    if (user?.role === 'industry') return <Navigate to="/industry" replace />;
    if (user?.role === 'faculty') return <Navigate to="/faculty" replace />;
    return <Navigate to="/dashboard" replace />;
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
const AdminLayout = lazy(() => import('./layouts/AdminLayout').then((module) => ({ default: module.AdminLayout })));
const Signup = lazy(() => import('./pages/Auth/Signup').then((module) => ({ default: module.Signup })));
const Login = lazy(() => import('./pages/Auth/Login').then((module) => ({ default: module.Login })));
const VerifyOTP = lazy(() => import('./pages/Auth/VerifyOTP').then((module) => ({ default: module.VerifyOTP })));
const VerifyCollege = lazy(() => import('./pages/Auth/VerifyCollege').then((module) => ({ default: module.VerifyCollege })));
const OnboardingAnalyze = lazy(() => import('./pages/Auth/OnboardingAnalyze').then((module) => ({ default: module.OnboardingAnalyze })));
const RoadmapList = lazy(() => import('./pages/Roadmaps/RoadmapList').then((module) => ({ default: module.RoadmapList })));
const RoadmapDetail = lazy(() => import('./pages/Roadmaps/RoadmapDetail').then((module) => ({ default: module.RoadmapDetail })));
const Assessments = lazy(() => import('./pages/Assessments/Assessments').then((module) => ({ default: module.Assessments })));
const BuddyChat = lazy(() => import('./pages/Buddy/BuddyChat').then((module) => ({ default: module.BuddyChat })));
const Leaderboard = lazy(() => import('./pages/Gamification/Leaderboard').then((module) => ({ default: module.Leaderboard })));
const Rewards = lazy(() => import('./pages/Gamification/Rewards').then((module) => ({ default: module.Rewards })));
const Internships = lazy(() => import('./pages/Career/Internships').then((module) => ({ default: module.Internships })));
const FacultyOpportunities = lazy(() =>
  import('./pages/Career/FacultyOpportunities').then((module) => ({ default: module.FacultyOpportunities })),
);
const CvBuilder = lazy(() =>
  import('./pages/Career/CvBuilder').then((module) => ({ default: module.CvBuilder })),
);
const CompanyDetail = lazy(() => import('./pages/Career/CompanyDetail').then((module) => ({ default: module.CompanyDetail })));
const Events = lazy(() => import('./pages/Growth/Events').then((module) => ({ default: module.Events })));
const SoftSkills = lazy(() => import('./pages/Growth/SoftSkills').then((module) => ({ default: module.SoftSkills })));
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard').then((module) => ({ default: module.AdminDashboard })));
const PendingApprovals = lazy(() => import('./pages/Admin/PendingApprovals').then((module) => ({ default: module.PendingApprovals })));
const AdminLogin = lazy(() => import('./pages/Admin/AdminLogin').then((module) => ({ default: module.AdminLogin })));
const CourseManager = lazy(() => import('./pages/Admin/CourseManager').then((module) => ({ default: module.CourseManager })));
const ProfileDashboard = lazy(() => import('./pages/Profile/ProfileDashboard').then((module) => ({ default: module.ProfileDashboard })));
const DSASheet = lazy(() => import('./pages/DSASheet').then((module) => ({ default: module.DSASheet })));
const SkillProfile = lazy(() => import('./pages/SkillProfile').then((module) => ({ default: module.SkillProfile })));
const IndustryWorkspace = lazy(() =>
  import('./pages/Industry/IndustryWorkspace').then((module) => ({ default: module.IndustryWorkspace })),
);
const FacultyWorkspace = lazy(() =>
  import('./pages/Faculty/FacultyWorkspace').then((module) => ({ default: module.FacultyWorkspace })),
);
const PlacementDashboard = lazy(() =>
  import('./pages/Admin/PlacementDashboard').then((module) => ({ default: module.PlacementDashboard })),
);
const CollegeLayout = lazy(() =>
  import('./layouts/CollegeLayout').then((module) => ({ default: module.CollegeLayout })),
);

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 font-semibold">Loading...</div>
);

const DASHBOARD_ROUTES = [
  '/dashboard',
  '/courses',
  '/browse',
  '/course/',
  '/paths',
  '/roadmaps',
  '/assessments',
  '/buddy',
  '/leaderboard',
  '/rewards',
  '/internships',
  '/faculty-opportunities',
  '/cv-builder',
  '/events',
  '/soft-skills',
  '/dsa-sheet',
  '/admin',
  '/profile',
  '/skill-profile',
  '/industry',
  '/college',
  '/faculty',
];

const GlobalThemeButton = () => {
  const location = useLocation();
  const isDashboardArea = DASHBOARD_ROUTES.some(
    (route) => location.pathname === route || location.pathname.startsWith(route),
  );
  if (isDashboardArea) return null;
  return <ThemeToggle movable />;
};

export function App() {
  return (
    <Router>
      <GlobalThemeButton />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<PublicOnlyRoute><Signup /></PublicOnlyRoute>} />
          <Route path="/sign-up" element={<Navigate to="/signup" replace />} />
          <Route path="/register" element={<Navigate to="/signup" replace />} />
          <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
          <Route path="/signin" element={<Navigate to="/login" replace />} />
          <Route path="/sign-in" element={<Navigate to="/login" replace />} />
          <Route path="/verify-otp" element={<PublicOnlyRoute><VerifyOTP /></PublicOnlyRoute>} />
          <Route path="/verify-college" element={<VerifyCollege />} />
          <Route path="/onboarding" element={<OnboardingAnalyze />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/course-manager" element={<AdminSessionRoute><CourseManager /></AdminSessionRoute>} />

          <Route
            path="/college"
            element={
              <ProtectedRoute>
                <RoleRoute role="college">
                  <CollegeLayout />
                </RoleRoute>
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/college/placements" replace />} />
            <Route path="placements" element={<PlacementDashboard />} />
          </Route>

          <Route
            path="/industry"
            element={
              <ProtectedRoute>
                <RoleRoute role="industry">
                  <IndustryWorkspace />
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/faculty"
            element={
              <ProtectedRoute>
                <RoleRoute role="faculty">
                  <FacultyWorkspace />
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          <Route element={<AdminAccessRoute><AdminLayout /></AdminAccessRoute>}>
            <Route path="/admin" element={<PendingApprovals />} />
            <Route path="/admin/pending-approvals" element={<PendingApprovals />} />
            <Route path="/admin/students" element={<PendingApprovals />} />
            <Route path="/admin/verified" element={<AdminDashboard />} />
            <Route path="/admin/courses" element={<AdminDashboard />} />
            <Route path="/admin/partners" element={<AdminDashboard />} />
            <Route path="/admin/reports" element={<AdminDashboard />} />
            <Route path="/admin/settings" element={<AdminDashboard />} />
          </Route>

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
            <Route path="/faculty-opportunities" element={<RoleRoute role="student"><FacultyOpportunities /></RoleRoute>} />
            <Route path="/cv-builder" element={<RoleRoute role="student"><CvBuilder /></RoleRoute>} />
            <Route path="/companies/:id" element={<RoleRoute role="student"><CompanyDetail /></RoleRoute>} />
            <Route path="/events" element={<RoleRoute role="student"><Events /></RoleRoute>} />
            <Route path="/soft-skills" element={<RoleRoute role="student"><SoftSkills /></RoleRoute>} />
            <Route path="/dsa-sheet" element={<RoleRoute role="student"><DSASheet /></RoleRoute>} />
            <Route path="/profile" element={<RoleRoute role="student"><ProfileDashboard /></RoleRoute>} />
            <Route path="/skill-profile" element={<RoleRoute role="student"><SkillProfile /></RoleRoute>} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
