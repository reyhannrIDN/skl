import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/api/endpoints';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { LockScreen } from '@/components/lock/LockScreen';

export function DashboardLayout() {
  const { user } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lockEnabled, setLockEnabled] = useState(false);
  const [lockType, setLockType] = useState('pin');
  const [lockChecked, setLockChecked] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  useEffect(() => {
    if (!user) return;
    authApi.getLockSettings().then(res => {
      if (res.data.lock_enabled) {
        setLockEnabled(true);
        setLockType(res.data.lock_type || 'pin');
      }
      setLockChecked(true);
    }).catch(() => {
      setLockChecked(true);
    });
  }, [user]);

  if (!lockChecked) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-950">
        <div className="w-6 h-6 rounded-full border-2 border-indigo-600/30 border-t-indigo-600 animate-spin" />
      </div>
    );
  }

  if (lockEnabled) {
    return (
      <LockScreen
        lockType={lockType}
        onUnlocked={() => setLockEnabled(false)}
      />
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <Sidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
          <div className="mx-auto w-full max-w-[1600px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
