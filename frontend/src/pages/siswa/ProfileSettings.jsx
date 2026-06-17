import React, { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/api/endpoints';
import { SiswaSidebar } from '@/components/layout/SiswaSidebar';
import { SiswaTopbar } from '@/components/layout/SiswaTopbar';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { STORAGE_BASE_URL } from '@/utils/runtimeConfig';

export function ProfileSettings() {
  const { user, setAuth, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      const res = await authApi.updateProfile(profileData);
      setAuth(res.data.user, localStorage.getItem('auth_token'));
      toast.success('Profil berhasil diperbarui');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal memperbarui profil');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.password !== passwordData.password_confirmation) {
      return toast.error('Konfirmasi password tidak cocok');
    }
    setIsUpdatingPassword(true);
    try {
      await authApi.changePassword(passwordData);
      toast.success('Password berhasil diubah');
      setPasswordData({ current_password: '', password: '', password_confirmation: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal mengubah password');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="sd-wrapper">
      <div className="sd-grain" />
      <SiswaSidebar 
        user={user} 
        logout={logout} 
        navigate={navigate} 
        sidebarOpen={sidebarOpen} 
        closeSidebar={closeSidebar} 
        activePath={location.pathname}
      />
      <SiswaTopbar user={user} toggleSidebar={toggleSidebar} title="Pengaturan" />
      
      <main className="sd-main transition-all duration-300 lg:pt-0 pt-16">
        <div className="sd-content lg:max-w-none lg:m-0 lg:p-0 p-4">
          
          {/* Header Info - Responsive margins */}
          <div className="page-header lg:-mt-8 lg:-ml-3 mt-0 mb-6 px-1 lg:px-0">
            <div className="ph-left">
              <div className="ph-greeting underline decoration-primary decoration-2 underline-offset-4 mb-2 inline-block text-[10px] lg:text-xs">
                PENGATURAN AKUN
              </div>
              <div className="ph-title text-3xl lg:text-4xl">
                Kelola Akun <span className="grad italic text-4xl lg:text-5xl">Kamu</span>
              </div>
              <div className="ph-sub text-sm lg:text-base opacity-70">
                Update profil, avatar, dan keamanan akun di SKL IDN.
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-start">
            
            {/* Left Col: Profile Card & Quick Stats */}
            <div className="lg:col-span-3 space-y-4 lg:space-y-5">
              <div className="section-card p-6 flex flex-col items-center text-center">
                <div className="relative group mb-5">
                  <div className="w-28 h-28 lg:w-32 lg:h-32 rounded-3xl bg-gradient-to-br from-primary via-purple-500 to-blue-500 p-1 shadow-2xl transition-transform group-hover:scale-105">
                    <div className="w-full h-full rounded-2xl bg-slate-900 border-4 border-slate-900 flex items-center justify-center text-3xl lg:text-4xl font-black text-white overflow-hidden">
                      {user?.avatar ? (
                        <img src={`${STORAGE_BASE_URL}/${user.avatar}`} className="w-full h-full object-cover" alt="avatar" />
                      ) : (
                        getInitials(user?.name)
                      )}
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 lg:w-10 lg:h-10 bg-primary rounded-2xl border-2 lg:border-4 border-white dark:border-slate-900 flex items-center justify-center text-white cursor-pointer shadow-lg hover:bg-primary/90 transition-colors"
                       onClick={() => toast.success('Upload avatar segera hadir!')}>
                    <span className="text-[10px] lg:text-sm">📷</span>
                  </div>
                </div>
                <div className="mb-4 lg:mb-6">
                  <div className="text-lg lg:text-xl font-bold tracking-tight">{user?.name}</div>
                  <div className="text-[10px] lg:text-xs font-bold text-primary uppercase tracking-widest mt-1">
                    Siswa · {user?.kelas}
                  </div>
                </div>
                <div className="w-full pt-4 lg:pt-6 border-t border-border/50 space-y-3 lg:space-y-4">
                  <div className="flex justify-between items-center text-xs lg:text-sm px-2">
                    <span className="text-muted-foreground">NIS</span>
                    <span className="font-mono font-bold">{user?.nis || '-'}</span>
                  </div>
                </div>
              </div>

               <div className="moti-card p-5 lg:p-6">
                  <div className="moti-emoji text-xl lg:text-2xl">✨</div>
                  <div className="moti-title text-xs lg:text-sm">Tips Keamanan</div>
                  <div className="moti-txt text-xs lg:text-sm">Gunakan kombinasi simbol untuk password kuat.</div>
               </div>
            </div>

            {/* Right Col: Forms - Stacks on mobile, 2 columns on tablet/desktop */}
            <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
              {/* Profil */}
              <div className="section-card flex flex-col h-full">
                <div className="sc-header py-3 lg:py-4 px-5 lg:px-6">
                  <div className="sc-htitle text-sm lg:text-base">Informasi Pribadi</div>
                </div>
                <form onSubmit={handleProfileSubmit} className="p-5 lg:p-6 space-y-4 lg:space-y-6 flex-1">
                  <div className="space-y-1 lg:space-y-2">
                    <label className="text-[10px] lg:text-xs font-bold text-muted-foreground uppercase opacity-70 tracking-widest">Nama Lengkap</label>
                    <input 
                      type="text" 
                      className="w-full bg-slate-50 dark:bg-slate-900/50 border border-border rounded-xl lg:rounded-2xl px-4 lg:px-5 py-3 lg:py-4 text-xs lg:text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-inner"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1 lg:space-y-2">
                    <label className="text-[10px] lg:text-xs font-bold text-muted-foreground uppercase opacity-70 tracking-widest">Alamat Email</label>
                    <input 
                      type="email" 
                      className="w-full bg-slate-50 dark:bg-slate-900/50 border border-border rounded-xl lg:rounded-2xl px-4 lg:px-5 py-3 lg:py-4 text-xs lg:text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-inner"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1 lg:space-y-2">
                    <label className="text-[10px] lg:text-xs font-bold text-muted-foreground uppercase opacity-70 tracking-widest">Nomor WhatsApp</label>
                    <input 
                      type="text" 
                      className="w-full bg-slate-50 dark:bg-slate-900/50 border border-border rounded-xl lg:rounded-2xl px-4 lg:px-5 py-3 lg:py-4 text-xs lg:text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-inner"
                      placeholder="081234..."
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    />
                  </div>
                  <div className="pt-4 lg:pt-6">
                    <button 
                      type="submit" 
                      disabled={isUpdatingProfile}
                      className="btn-new w-full h-12 lg:h-14 justify-center text-sm lg:text-base"
                    >
                      {isUpdatingProfile ? 'Menyimpan...' : 'Perbarui Profil'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Keamanan */}
              <div className="section-card flex flex-col h-full">
                <div className="sc-header py-3 lg:py-4 px-5 lg:px-6">
                  <div className="sc-htitle text-sm lg:text-base">Keamanan & Password</div>
                </div>
                <form onSubmit={handlePasswordSubmit} className="p-5 lg:p-6 space-y-4 lg:space-y-6 flex-1">
                  <div className="space-y-1 lg:space-y-2">
                    <label className="text-[10px] lg:text-xs font-bold text-muted-foreground uppercase opacity-70 tracking-widest">Password Saat Ini</label>
                    <input 
                      type="password" 
                      className="w-full bg-slate-50 dark:bg-slate-900/50 border border-border rounded-xl lg:rounded-2xl px-4 lg:px-5 py-3 lg:py-4 text-xs lg:text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-inner"
                      value={passwordData.current_password}
                      onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1 lg:space-y-2">
                    <label className="text-[10px] lg:text-xs font-bold text-muted-foreground uppercase opacity-70 tracking-widest">Password Baru</label>
                    <input 
                      type="password" 
                      className="w-full bg-slate-50 dark:bg-slate-900/50 border border-border rounded-xl lg:rounded-2xl px-4 lg:px-5 py-3 lg:py-4 text-xs lg:text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-inner"
                      value={passwordData.password}
                      onChange={(e) => setPasswordData({...passwordData, password: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1 lg:space-y-2">
                    <label className="text-[10px] lg:text-xs font-bold text-muted-foreground uppercase opacity-70 tracking-widest">Konfirmasi Password</label>
                    <input 
                      type="password" 
                      className="w-full bg-slate-50 dark:bg-slate-900/50 border border-border rounded-xl lg:rounded-2xl px-4 lg:px-5 py-3 lg:py-4 text-xs lg:text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-inner"
                      value={passwordData.password_confirmation}
                      onChange={(e) => setPasswordData({...passwordData, password_confirmation: e.target.value})}
                    />
                  </div>
                  <div className="pt-4 lg:pt-6">
                    <button 
                      type="submit"
                      disabled={isUpdatingPassword}
                      className="btn-new w-full h-12 lg:h-14 justify-center text-sm lg:text-base"
                      style={{ background: 'linear-gradient(135deg, var(--sd-a), var(--sd-a1))', boxShadow: '0 8px 32px rgba(245, 158, 11, .4)' }}
                    >
                      {isUpdatingPassword ? 'Mengubah...' : 'Ganti Password'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
