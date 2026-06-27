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
import { BackupManagement } from '@/pages/admin/BackupManagement';
import { PermissionManagement } from '@/pages/admin/PermissionManagement';
import { Reports } from '@/pages/admin/Reports';
import { DashboardSiswa } from '@/pages/siswa/DashboardSiswa';
import { SubmissionCreate } from '@/pages/siswa/SubmissionCreate';
import { SubmissionDetail } from '@/pages/siswa/SubmissionDetail';
import SiswaProjectList from '@/pages/siswa/SiswaProjectList';
import { SiswaMySKL } from '@/pages/siswa/SiswaMySKL';
import { ProfileSettings } from '@/pages/siswa/ProfileSettings';
import { AccountSettings } from '@/pages/common/AccountSettings';
import { NotificationList } from '@/pages/common/NotificationList';
import { ErrorPage } from '@/pages/common/ErrorPage';
import { CategoryManagement } from '@/pages/guru/CategoryManagement';
import { StudentManagement } from '@/pages/guru/StudentManagement';
import { ClassManagement } from '@/pages/admin/ClassManagement';
import { MyClassTaskManagement } from '@/pages/guru/MyClassTaskManagement';
import { PerformanceStats } from '@/pages/common/PerformanceStats';
import { ChatPage } from '@/pages/chat/ChatPage';
import { IncomeDashboard } from '@/pages/income/IncomeDashboard';
import { IncomeInput } from '@/pages/income/IncomeInput';
import { IncomeDetail } from '@/pages/income/IncomeDetail';
import { DashboardIdn } from '@/pages/idn/DashboardIdn';
import { IdnStudents } from '@/pages/idn/IdnStudents';
import { IdnSchoolVisits } from '@/pages/idn/IdnSchoolVisits';
import { LombaDashboard } from '@/pages/lomba/LombaDashboard';
import { LombaList } from '@/pages/lomba/LombaList';
import { LombaForm } from '@/pages/lomba/LombaForm';
import { LombaDetail } from '@/pages/lomba/LombaDetail';

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
        case 'idn': 
        case 'kepala_sekolah': return <Navigate to="/idn/dashboard" replace />;
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
      <Route element={<ProtectedRoute allowedRoles={['superadmin', 'guru', 'siswa', 'idn']} />}>
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
          <Route path="/admin/backups" element={<BackupManagement />} />
          <Route path="/admin/permissions" element={<PermissionManagement />} />
          <Route path="/admin/settings/account" element={<AccountSettings />} />
          <Route path="/admin/chat" element={<ChatPage />} />
          <Route path="/admin/income" element={<IncomeDashboard />} />
          <Route path="/admin/income/detail/:studentId" element={<IncomeDetail />} />
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
          <Route path="/guru/chat" element={<ChatPage />} />
          <Route path="/guru/income" element={<IncomeDashboard />} />
          <Route path="/guru/income/input" element={<IncomeInput />} />
          <Route path="/guru/income/detail/:studentId" element={<IncomeDetail />} />
          <Route path="/guru/settings/account" element={<AccountSettings />} />
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
          <Route path="/siswa/chat" element={<ChatPage />} />
          <Route path="/siswa/settings" element={<ProfileSettings />} />
        </Route>
      </Route>

      {/* IDN + Kepala Sekolah Routes */}
      <Route element={<ProtectedRoute allowedRoles={['idn', 'kepala_sekolah']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/idn/dashboard" element={<DashboardIdn />} />
          <Route path="/idn/students" element={<IdnStudents />} />
          <Route path="/idn/school-visits" element={<IdnSchoolVisits />} />
          <Route path="/idn/settings/account" element={<AccountSettings />} />
        </Route>
      </Route>

      {/* Lomba Routes - multiple roles */}
      <Route element={<ProtectedRoute allowedRoles={['superadmin', 'idn', 'guru', 'kepala_sekolah']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/lomba" element={<LombaList />} />
          <Route path="/lomba/create" element={<LombaForm />} />
          <Route path="/lomba/:id" element={<LombaDetail />} />
          <Route path="/lomba/:id/edit" element={<LombaForm />} />
          <Route path="/lomba/dashboard" element={<LombaDashboard />} />
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
