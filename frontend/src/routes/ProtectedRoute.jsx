import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';

export function ProtectedRoute({ allowedRoles }) {
  const { user, token, isLoading, checkAuth } = useAuthStore();
  const location = useLocation();
  const [hasChecked, setHasChecked] = React.useState(false);

  useEffect(() => {
    let mounted = true;
    const initAuth = async () => {
      if (!user || !token) {
        await checkAuth();
      }
      if (mounted) {
        setHasChecked(true);
      }
    };
    initAuth();
    return () => { mounted = false; };
  }, [user, token, checkAuth]);

  if (isLoading || !hasChecked) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 z-[9999]">
         <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-700">
            <div className="relative">
               <div className="absolute inset-0 bg-indigo-500/30 rounded-[2rem] blur-2xl animate-pulse"></div>
               <div className="w-20 h-20 md:w-24 md:h-24 rounded-[2rem] bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-[0_20px_50px_rgba(79,70,229,0.4)] relative z-10 animate-bounce" style={{ animationDuration: '2.5s' }}>
                  <FontAwesomeIcon icon={faGraduationCap} className="text-4xl md:text-5xl" />
               </div>
            </div>
            
            <div className="flex flex-col items-center gap-2 text-center mt-2">
               <h2 className="text-2xl md:text-3xl font-black font-display tracking-tight text-slate-800 dark:text-white">
                 SKL <span className="text-indigo-600 dark:text-indigo-400">IDN</span>
               </h2>
               <div className="flex items-center gap-2 mt-1">
                  <div className="w-3.5 h-3.5 rounded-full border-[2.5px] border-indigo-600/30 border-t-indigo-600 dark:border-indigo-400/30 dark:border-t-indigo-400 animate-spin"></div>
                  <p className="text-slate-500 dark:text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] animate-pulse">
                    Mempersiapkan Sesi...
                  </p>
               </div>
            </div>
         </div>
      </div>
    );
  }

  // Jika setelah checkAuth tidak ada user
  if (!user && !isLoading && hasChecked) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Defense in Depth: Validasi is_active di frontend
  if (user && user.is_active === 0) {
    // Bisa arahkan ke halaman khusus, atau biarkan login menolak
    useAuthStore.getState().logout();
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their respective dashboard if they try to access another role's route
    switch (user.role) {
      case 'superadmin': return <Navigate to="/admin/dashboard" replace />;
      case 'guru': return <Navigate to="/guru/dashboard" replace />;
      case 'siswa': return <Navigate to="/siswa/dashboard" replace />;
      default: return <Navigate to="/login" replace />;
    }
  }

  return <Outlet />;
}
