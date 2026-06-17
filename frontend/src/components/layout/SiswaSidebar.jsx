import React from 'react';
import { Link } from 'react-router-dom';

export function SiswaSidebar({ user, logout, navigate, sidebarOpen, closeSidebar, activePath }) {
  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const handleLogoutClick = async (e) => {
    e.stopPropagation();
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <>
      <div className={`sd-overlay ${sidebarOpen ? 'show' : ''}`} onClick={closeSidebar} />
      <aside className={`sd-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <Link to="/" className="sb-logo">
          <div className="sb-mark">⚡</div>
        </Link>

        <div className="sb-section">Menu Utama</div>

        <Link className={`sb-link ${activePath === '/siswa/dashboard' ? 'active' : ''}`} to="/siswa/dashboard">
          <span className="sb-icon">⊞</span> Dashboard
        </Link>
        <Link className={`sb-link ${activePath === '/siswa/projects' ? 'active' : ''}`} to="/siswa/projects">
          <span className="sb-icon">↑</span> Upload Project
        </Link>

        <Link className={`sb-link ${activePath === '/siswa/skl' ? 'active' : ''}`} to="/siswa/dashboard">
          <span className="sb-icon">◈</span> Lihat SKL
        </Link>

        <div className="sb-section">Lainnya</div>

        <Link className={`sb-link ${activePath === '/siswa/settings' ? 'active' : ''}`} to="/siswa/settings">
          <span className="sb-icon">⊙</span> Pengaturan
        </Link>

        <div className="sb-spacer" />

        <div className="sb-user" onClick={() => navigate('/notifications')}>
          <div className="sb-avatar">{getInitials(user?.name)}</div>
          <div>
            <div className="sb-uname text-truncate" style={{maxWidth: '120px'}}>{user?.name}</div>
            <div className="sb-urole">Siswa · {user?.kelas}</div>
          </div>
          <div className="sb-logout" onClick={handleLogoutClick}>⇥</div>
        </div>
      </aside>
    </>
  );
}
