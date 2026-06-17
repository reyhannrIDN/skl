import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuthStore } from '@/store/authStore';

// Pages
import { LandingPage } from '@/pages/common/LandingPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { DashboardGuru } from '@/pages/guru/DashboardGuru';
import { SubmissionList } from '@/pages/guru/SubmissionList';
import { SubmissionReview } from '@/pages/guru/SubmissionReview';
import { DashboardAdmin } from '@/pages/admin/DashboardAdmin';
import { UserManagement } from '@/pages/admin/UserManagement';
import { SystemSettings } from '@/pages/admin/SystemSettings';
import { ActivityLogs } from '@/pages/admin/ActivityLogs';
import { Reports } from '@/pages/admin/Reports';
import { DashboardSiswa } from '@/pages/siswa/DashboardSiswa';
import { SubmissionCreate } from '@/pages/siswa/SubmissionCreate';
import { SubmissionDetail } from '@/pages/siswa/SubmissionDetail';
import SiswaProjectList from '@/pages/siswa/SiswaProjectList';
import { SiswaMySKL } from '@/pages/siswa/SiswaMySKL';
import { ProfileSettings } from '@/pages/siswa/ProfileSettings';
import { NotificationList } from '@/pages/common/NotificationList';
import { ErrorPage } from '@/pages/common/ErrorPage';
import { CategoryManagement } from '@/pages/guru/CategoryManagement';
import { StudentManagement } from '@/pages/guru/StudentManagement';
import { ClassManagement } from '@/pages/admin/ClassManagement';
import { MyClassTaskManagement } from '@/pages/guru/MyClassTaskManagement';
import { PerformanceStats } from '@/pages/common/PerformanceStats';

// Public Pantau Portal
import { PantauLogin } from '@/pages/public/PantauLogin';
import { PantauResult } from '@/pages/public/PantauResult';

export function AppRoutes() {
  const { user, token } = useAuthStore();

  // Helper to redirect authenticated users
  const GuestGuard = ({ children }) => {
    if (user && token) {
      switch (user.role) {
        case 'superadmin': return <Navigate to="/admin/dashboard" replace />;
        case 'guru': return <Navigate to="/guru/dashboard" replace />;
        case 'siswa': return <Navigate to="/siswa/dashboard" replace />;
        default: return children;
      }
    }
    return children;
  };

  return (
    <Routes>
      <Route path="/login" element={<GuestGuard><LoginPage /></GuestGuard>} />
      <Route path="/register" element={<GuestGuard><RegisterPage /></GuestGuard>} />
      <Route path="/pantau" element={<PantauLogin />} />
      <Route path="/pantau/dashboard" element={<PantauResult />} />

      {/* Common Authenticated Routes */}
      <Route element={<ProtectedRoute allowedRoles={['superadmin', 'guru', 'siswa']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/notifications" element={<NotificationList />} />
        </Route>
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={['superadmin']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/admin/dashboard" element={<DashboardAdmin />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/classes" element={<ClassManagement />} />
          <Route path="/admin/monitoring" element={<PerformanceStats />} />
          <Route path="/admin/settings" element={<SystemSettings />} />
          <Route path="/admin/reports" element={<Reports />} />
          <Route path="/admin/logs" element={<ActivityLogs />} />
        </Route>
      </Route>

      {/* Guru Routes */}
      <Route element={<ProtectedRoute allowedRoles={['guru']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/guru/dashboard" element={<DashboardGuru />} />
          <Route path="/guru/submissions" element={<SubmissionList />} />
          <Route path="/guru/submissions/:slug" element={<SubmissionReview />} />
          <Route path="/guru/categories" element={<CategoryManagement />} />
          <Route path="/guru/students" element={<StudentManagement />} />
          <Route path="/guru/tasks" element={<MyClassTaskManagement />} />
          <Route path="/guru/monitoring" element={<PerformanceStats />} />
        </Route>
      </Route>

      {/* Siswa Routes */}
      <Route element={<ProtectedRoute allowedRoles={['siswa']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/siswa/dashboard" element={<DashboardSiswa />} />
          <Route path="/siswa/projects" element={<SiswaProjectList />} />
          <Route path="/siswa/skl" element={<SiswaMySKL />} />
          <Route path="/siswa/submission" element={<DashboardSiswa />} />
          <Route path="/siswa/submission/create" element={<SubmissionCreate />} />
          <Route path="/siswa/submission/:slug" element={<SubmissionDetail />} />
          <Route path="/siswa/submission/:slug/edit" element={<SubmissionCreate />} />
          <Route path="/siswa/settings" element={<ProfileSettings />} />
        </Route>
      </Route>

      {/* Error Pages */}
      <Route path="/error/:code" element={<ErrorPage />} />

      {/* Public / Fallback */}
      <Route path="/" element={<LandingPage />} />
      <Route path="*" element={<Navigate to="/error/404" replace />} />
    </Routes>
  );
}
