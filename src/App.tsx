import React, { useEffect, useState } from 'react';
import { BrowserRouter, Link, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LoadingState, RmCrestMark } from './components/BrandAssets';
import { DEFAULT_WEBSITE_CONTENT } from './constants/legal';
import {
  subscribeActiveDepartments,
  subscribePublicInternships,
  subscribePublishedCourses,
  subscribeWebsiteContent,
} from './firebase/services';
import type { Course, Department, Internship, WebsiteContent } from './types';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { AboutPage } from './pages/public/AboutPage';
import { CoursesPage } from './pages/public/CoursesPage';
import { CourseDetailPage } from './pages/public/CourseDetailPage';
import { InternshipsPage } from './pages/public/InternshipsPage';
import { ResourcesPage } from './pages/public/ResourcesPage';
import { HowItWorksPage } from './pages/public/HowItWorksPage';
import { ContactPage } from './pages/public/ContactPage';
import {
  ConductPage,
  PrivacyPage,
  TermsPage,
  VerifyCertificatePage,
} from './pages/public/LegalPages';

// Auth Pages
import { RegisterPage } from './pages/auth/RegisterPage';
import { LoginPage } from './pages/auth/LoginPage';

// Protected Portals
import { StudentDashboard } from './pages/student/StudentDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);
  return null;
}

function PublicLayout({ content }: { content: WebsiteContent }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#F8F4ED] text-[#292323]">
      {content.announcementBanner?.trim() && (
        <div className="bg-[#761D2D] px-4 py-2 text-center text-xs font-medium text-[#F8F4ED]">
          {content.announcementBanner}
        </div>
      )}
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer content={content} />
    </div>
  );
}

function RequireStudent({
  courses,
  internships,
}: {
  courses: Course[];
  internships: Internship[];
}) {
  const { user, profile, isAdmin, authReady, loadingProfile } = useAuth();
  const location = useLocation();

  if (!authReady || loadingProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F4ED]">
        <LoadingState message="Verifying student session..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // Enforce mandatory Welcome / Terms & Code of Conduct onboarding before dashboard access
  if (!profile && !isAdmin) {
    return <Navigate to="/register" replace />;
  }

  return <StudentDashboard courses={courses} internships={internships} />;
}

function RequireAdmin({ content }: { content: WebsiteContent }) {
  const { user, isAdmin, authReady, loadingProfile } = useAuth();

  if (!authReady || loadingProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F4ED]">
        <LoadingState message="Verifying administrator credentials..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: '/admin' }} />;
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F4ED] px-4">
        <div className="w-full max-w-md rounded-2xl border border-[#292323]/12 bg-white p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#761D2D]/10 text-[#761D2D]">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div className="mt-4 flex justify-center">
            <RmCrestMark size={36} />
          </div>
          <h1 className="mt-3 font-display text-2xl font-bold text-[#292323]">
            Administrator Access Restricted
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[#292323]/75">
            This portal is restricted to verified RM HEAVEN administrators. Student accounts cannot access institutional administration tools.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/dashboard"
              className="rounded-lg bg-[#761D2D] px-4 py-2 text-sm font-semibold text-white hover:bg-[#8F2638] transition-colors"
            >
              Go to Student Dashboard
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#292323]/15 px-4 py-2 text-sm font-semibold text-[#292323] hover:bg-[#F8F4ED] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <AdminDashboard content={content} />;
}

function AppContent() {
  const [content, setContent] = useState<WebsiteContent>({
    ...DEFAULT_WEBSITE_CONTENT,
    updatedAt: null,
  });
  const [departments, setDepartments] = useState<Department[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loadingInternships, setLoadingInternships] = useState(true);

  useEffect(() => {
    const unsubContent = subscribeWebsiteContent((nextContent) => {
      setContent(nextContent);
    });
    const unsubDepts = subscribeActiveDepartments((list) => {
      setDepartments(list);
    });
    const unsubCourses = subscribePublishedCourses((list) => {
      setCourses(list);
      setLoadingCourses(false);
    });
    const unsubInternships = subscribePublicInternships((list) => {
      setInternships(list);
      setLoadingInternships(false);
    });
    return () => {
      unsubContent();
      unsubDepts();
      unsubCourses();
      unsubInternships();
    };
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<PublicLayout content={content} />}>
          <Route
            path="/"
            element={
              <HomePage
                content={content}
                departments={departments}
                courses={courses}
                internships={internships}
                loadingCourses={loadingCourses}
                loadingInternships={loadingInternships}
              />
            }
          />
          <Route path="/about" element={<AboutPage />} />
          <Route
            path="/courses"
            element={<CoursesPage departments={departments} courses={courses} loading={loadingCourses} />}
          />
          <Route path="/courses/:courseId" element={<CourseDetailPage />} />
          <Route
            path="/internships"
            element={<InternshipsPage internships={internships} loading={loadingInternships} />}
          />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/contact" element={<ContactPage content={content} />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/conduct" element={<ConductPage />} />
          <Route path="/verify" element={<VerifyCertificatePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route
          path="/dashboard"
          element={<RequireStudent courses={courses} internships={internships} />}
        />
        <Route path="/admin" element={<RequireAdmin content={content} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}
