import React from 'react';
import { NotificationBell } from './NotificationBell';
import toast from 'react-hot-toast';

export function SiswaTopbar({ user, toggleSidebar, title = 'Dashboard' }) {
  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <header className="sd-topbar">
      <button className="hamburger" onClick={toggleSidebar}>☰</button>
      <div className="topbar-title"><span>{title}</span></div>
      <div className="tb-spacer" />
      <div className="tb-search" onClick={() => toast.success('Fitur pencarian segera hadir')}>
        🔍 Cari project...
        <kbd>⌘K</kbd>
      </div>
      <NotificationBell />
      <div className="tb-avatar">{getInitials(user?.name)}</div>
    </header>
  );
}
