import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/utils/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, 
  faFileUpload, 
  faFolderOpen, 
  faUsers, 
  faCogs, 
  faHistory,
  faFileContract,
  faGraduationCap,
  faCheckDouble,
  faInfoCircle,
  faChartPie,
  faSignOutAlt,
  faUserCircle,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import { ThemeToggle } from '../common/ThemeToggle';
import { Button } from '../common/Button';

export function Sidebar({ isOpen, closeSidebar }) {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const getLinks = () => {
    switch (user?.role) {
      case 'superadmin':
        return [
          { name: 'Dashboard', path: '/admin/dashboard', icon: faChartLine },
          { name: 'Users', path: '/admin/users', icon: faUsers },
          { name: 'Classes', path: '/admin/classes', icon: faGraduationCap },
          { name: 'Monitoring', path: '/admin/monitoring', icon: faChartPie },
          { name: 'Settings', path: '/admin/settings', icon: faCogs },
          { name: 'Logs', path: '/admin/logs', icon: faHistory },
        ];
      case 'guru':
        return [
          { name: 'Dashboard', path: '/guru/dashboard', icon: faChartLine },
          { name: 'Submissions', path: '/guru/submissions', icon: faCheckDouble },
          { name: 'Monitoring', path: '/guru/monitoring', icon: faChartPie },
          { name: 'Students', path: '/guru/students', icon: faUsers },
          { name: 'Guidelines', path: '/guru/tasks', icon: faInfoCircle },
        ];
      case 'siswa':
      default:
        return [
          { name: 'Dashboard', path: '/siswa/dashboard', icon: faChartLine },
          { name: 'Upload Project', path: '/siswa/projects', icon: faFileUpload },
          { name: 'My SKL', path: '/siswa/skl', icon: faFileContract },
        ];
    }
  };

  const links = getLinks();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-950/20 backdrop-blur-md md:hidden animate-in fade-in duration-300" 
          onClick={closeSidebar}
        />
      )}
      
      <aside className={cn(
        "fixed top-0 left-0 z-50 h-screen w-72 shrink-0 border-r border-slate-200 dark:border-white/10 glass-nav transition-transform duration-500 ease-spring md:sticky md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          {/* Fixed Logo Section */}
          <div className="flex h-20 items-center px-8 shrink-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-white/5">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
                <FontAwesomeIcon icon={faGraduationCap} className="text-lg" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black font-display tracking-tight text-slate-900 dark:text-white leading-none">
                  SKL <span className="text-indigo-600 dark:text-indigo-400">IDN</span>
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 mt-1">Sistem Kelulusan</span>
              </div>
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 scrollbar-none">
            {/* Main Menu */}
            <div>
              <h2 className="mb-4 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                Menu Utama
              </h2>
              <nav className="space-y-1.5">
                {links.map((link, idx) => {
                  const isActive = location.pathname.startsWith(link.path);
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => {
                        if (window.innerWidth < 768) closeSidebar();
                      }}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-bold transition-all duration-300",
                        isActive 
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 animate-in slide-in-from-left-2" 
                        : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-indigo-600 dark:hover:text-indigo-400"
                      )}
                    >
                      <FontAwesomeIcon 
                        icon={link.icon} 
                        className={cn(
                          "w-4 h-4 transition-transform duration-300 group-hover:scale-110",
                          isActive ? "text-white" : "text-slate-400 dark:text-slate-600 group-hover:text-indigo-600"
                        )} 
                      />
                      <span className="flex-1">{link.name}</span>
                      {isActive && (
                        <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      )}
                      {!isActive && (
                         <FontAwesomeIcon icon={faChevronRight} className="text-[10px] opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Support / Extra */}
            <div className="pt-4 border-t border-slate-100 dark:border-white/5">
               <h2 className="mb-4 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                Preferensi
              </h2>
              <div className="flex items-center justify-between px-5 py-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                 <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Mode Tema</span>
                 <ThemeToggle />
              </div>
            </div>
          </div>

          {/* User Profile Footer */}
          <div className="mt-auto border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 ring-2 ring-white dark:ring-white/10 shadow-sm overflow-hidden">
                 {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <FontAwesomeIcon icon={faUserCircle} className="text-xl" />}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-black text-slate-800 dark:text-white truncate leading-none mb-1">{user?.name}</span>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-wider">{user?.role}</span>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={logout}
              className="w-full h-11 rounded-1.5xl border-slate-200 dark:border-white/10 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-500 hover:border-rose-100 dark:hover:border-rose-500/30 text-slate-600 dark:text-slate-400 font-bold gap-2 transition-all group"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="text-slate-400 group-hover:text-rose-500 transition-colors" />
              Keluar Sesi
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
