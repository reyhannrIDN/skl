import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/api/endpoints';
import { PatternLock } from '@/components/lock/PatternLock';
import { PinLock } from '@/components/lock/PinLock';
import toast from 'react-hot-toast';
import { STORAGE_BASE_URL } from '@/utils/runtimeConfig';
import { Lock, Smartphone, Shield, CheckCircle2 } from 'lucide-react';

export function ProfileSettings() {
  const { user, setAuth } = useAuthStore();

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

  // Lock settings
  const [lockEnabled, setLockEnabled] = useState(false);
  const [lockType, setLockType] = useState('pin');
  const [showLockSetup, setShowLockSetup] = useState(false);
  const [lockCode, setLockCode] = useState('');
  const [step, setStep] = useState('choose'); // choose | set | confirm | done

  useEffect(() => {
    authApi.getLockSettings().then(res => {
      setLockEnabled(res.data.lock_enabled);
      setLockType(res.data.lock_type || 'pin');
    }).catch(() => {});
  }, []);

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

  const handleLockCode = (code) => {
    if (step === 'set') {
      setLockCode(code);
      setStep('confirm');
    } else if (step === 'confirm') {
      if (code === lockCode) {
        authApi.updateLockSettings({
          lock_enabled: true,
          lock_type: lockType,
          lock_code: code,
        }).then(res => {
          setLockEnabled(true);
          setShowLockSetup(false);
          setStep('choose');
          toast.success('Kunci aplikasi berhasil diaktifkan');
        }).catch(err => {
          toast.error(err.response?.data?.message || 'Gagal menyimpan kunci');
        });
      } else {
        toast.error('Kode tidak cocok, coba lagi');
        setStep('set');
        setLockCode('');
      }
    }
  };

  const handleDisableLock = () => {
    if (!confirm('Nonaktifkan kunci aplikasi?')) return;
    authApi.updateLockSettings({
      lock_enabled: false,
    }).then(() => {
      setLockEnabled(false);
      toast.success('Kunci aplikasi dinonaktifkan');
    }).catch(err => {
      toast.error(err.response?.data?.message || 'Gagal menonaktifkan kunci');
    });
  };

  const openLockSetup = (type) => {
    setLockType(type);
    setShowLockSetup(true);
    setStep('set');
    setLockCode('');
  };

  return (
    <>
      <div className="space-y-6 animate-in fade-in duration-700 pb-16">
        <div className="space-y-2">
          <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white font-display">
            Pengaturan Akun
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Update profil, password, dan keamanan akun kamu.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Col */}
          <div className="lg:col-span-3 space-y-5">
            <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-[2rem] shadow-xl p-6 flex flex-col items-center text-center border-none">
              <div className="relative group mb-5">
                <div className="w-28 h-28 lg:w-32 lg:h-32 rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-500 to-blue-500 p-1 shadow-2xl transition-transform group-hover:scale-105">
                  <div className="w-full h-full rounded-2xl bg-slate-900 border-4 border-slate-900 flex items-center justify-center text-3xl lg:text-4xl font-black text-white overflow-hidden">
                    {user?.avatar ? (
                      <img src={`${STORAGE_BASE_URL}/${user.avatar}`} className="w-full h-full object-cover" alt="avatar" />
                    ) : (
                      <span>{user?.name?.charAt(0).toUpperCase() || '?'}</span>
                    )}
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 lg:w-10 lg:h-10 bg-indigo-600 rounded-2xl border-2 lg:border-4 border-white dark:border-slate-900 flex items-center justify-center text-white cursor-pointer shadow-lg hover:bg-indigo-700 transition-colors"
                     onClick={() => toast.success('Upload avatar segera hadir!')}>
                  <span className="text-sm">📷</span>
                </div>
              </div>
              <div className="mb-4 lg:mb-6">
                <div className="text-lg lg:text-xl font-bold tracking-tight text-slate-900 dark:text-white">{user?.name}</div>
                <div className="text-[10px] lg:text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mt-1">
                  Siswa · {user?.kelas}
                </div>
              </div>
              <div className="w-full pt-4 lg:pt-6 border-t border-slate-100 dark:border-white/10 space-y-3 lg:space-y-4">
                <div className="flex justify-between items-center text-xs lg:text-sm px-2">
                  <span className="text-slate-400">NIS</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-white">{user?.nis || '-'}</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 rounded-[2rem] p-5 lg:p-6 text-center shadow-inner">
              <div className="text-2xl mb-2">✨</div>
              <div className="text-xs lg:text-sm font-bold text-indigo-700 dark:text-indigo-300 mb-1">Tips Keamanan</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Gunakan kombinasi simbol untuk password kuat.</div>
            </div>
          </div>

          {/* Right Col */}
          <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profil */}
            <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-[2rem] shadow-xl flex flex-col h-full border-none overflow-hidden">
              <div className="border-b border-slate-100 dark:border-white/5 px-6 py-4">
                <h3 className="text-sm lg:text-base font-black text-slate-900 dark:text-white">Informasi Pribadi</h3>
              </div>
              <form onSubmit={handleProfileSubmit} className="p-6 space-y-4 lg:space-y-5 flex-1">
                <div className="space-y-1 lg:space-y-2">
                  <label className="text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-widest">Nama Lengkap</label>
                  <input 
                    type="text" 
                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl lg:rounded-2xl px-4 lg:px-5 py-3 lg:py-4 text-xs lg:text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all shadow-inner text-slate-900 dark:text-white"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-1 lg:space-y-2">
                  <label className="text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-widest">Alamat Email</label>
                  <input 
                    type="email" 
                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl lg:rounded-2xl px-4 lg:px-5 py-3 lg:py-4 text-xs lg:text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all shadow-inner text-slate-900 dark:text-white"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-1 lg:space-y-2">
                  <label className="text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-widest">Nomor WhatsApp</label>
                  <input 
                    type="text" 
                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl lg:rounded-2xl px-4 lg:px-5 py-3 lg:py-4 text-xs lg:text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all shadow-inner text-slate-900 dark:text-white"
                    placeholder="081234..."
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  />
                </div>
                <div className="pt-4 lg:pt-6">
                  <button 
                    type="submit" 
                    disabled={isUpdatingProfile}
                    className="w-full h-12 lg:h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-xl shadow-indigo-500/30 transition-all text-sm lg:text-base disabled:opacity-50"
                  >
                    {isUpdatingProfile ? 'Menyimpan...' : 'Perbarui Profil'}
                  </button>
                </div>
              </form>
            </div>

            {/* Keamanan & Lock */}
            <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-[2rem] shadow-xl flex flex-col h-full border-none overflow-hidden">
              <div className="border-b border-slate-100 dark:border-white/5 px-6 py-4">
                <h3 className="text-sm lg:text-base font-black text-slate-900 dark:text-white">Keamanan</h3>
              </div>
              <div className="p-6 space-y-6 flex-1">
                {/* Password Form */}
                <form onSubmit={handlePasswordSubmit} className="space-y-4 lg:space-y-5">
                  <div className="space-y-1 lg:space-y-2">
                    <label className="text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-widest">Password Saat Ini</label>
                    <input 
                      type="password" 
                      className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl lg:rounded-2xl px-4 lg:px-5 py-3 lg:py-4 text-xs lg:text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all shadow-inner text-slate-900 dark:text-white"
                      value={passwordData.current_password}
                      onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1 lg:space-y-2">
                    <label className="text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-widest">Password Baru</label>
                    <input 
                      type="password" 
                      className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl lg:rounded-2xl px-4 lg:px-5 py-3 lg:py-4 text-xs lg:text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all shadow-inner text-slate-900 dark:text-white"
                      value={passwordData.password}
                      onChange={(e) => setPasswordData({...passwordData, password: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1 lg:space-y-2">
                    <label className="text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-widest">Konfirmasi Password</label>
                    <input 
                      type="password" 
                      className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl lg:rounded-2xl px-4 lg:px-5 py-3 lg:py-4 text-xs lg:text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all shadow-inner text-slate-900 dark:text-white"
                      value={passwordData.password_confirmation}
                      onChange={(e) => setPasswordData({...passwordData, password_confirmation: e.target.value})}
                    />
                  </div>
                  <div className="pt-4 lg:pt-6">
                    <button 
                      type="submit"
                      disabled={isUpdatingPassword}
                      className="w-full h-12 lg:h-14 rounded-2xl font-black text-sm lg:text-base text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-xl shadow-amber-500/30 transition-all disabled:opacity-50"
                    >
                      {isUpdatingPassword ? 'Mengubah...' : 'Ganti Password'}
                    </button>
                  </div>
                </form>

                {/* Divider */}
                <div className="border-t border-slate-100 dark:border-white/10 pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-xs lg:text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Kunci Aplikasi</span>
                  </div>

                  {lockEnabled ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Kunci Aktif</p>
                          <p className="text-[10px] text-emerald-600 dark:text-emerald-400">
                            Tipe: {lockType === 'pin' ? 'PIN' : 'Pola'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleDisableLock}
                        className="w-full h-10 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs shadow-xl shadow-red-500/30 transition-all"
                      >
                        Nonaktifkan Kunci
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <button
                        onClick={() => openLockSetup('pin')}
                        className="flex items-center gap-3 w-full p-3 rounded-xl border border-slate-200 dark:border-white/10 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all"
                      >
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center">
                          <Lock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-bold text-slate-800 dark:text-white">Kunci PIN</p>
                          <p className="text-[10px] text-slate-400">4-6 digit angka</p>
                        </div>
                      </button>
                      <button
                        onClick={() => openLockSetup('pattern')}
                        className="flex items-center gap-3 w-full p-3 rounded-xl border border-slate-200 dark:border-white/10 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all"
                      >
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center">
                          <Smartphone className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-bold text-slate-800 dark:text-white">Kunci Pola</p>
                          <p className="text-[10px] text-slate-400">3x3 dot pattern</p>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lock Setup Modal */}
      {showLockSetup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => { if (step !== 'set') return; setShowLockSetup(false); setStep('choose'); }} />
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-white/5">
              <h3 className="font-bold text-slate-900 dark:text-white">
                {step === 'set' ? `Atur ${lockType === 'pin' ? 'PIN' : 'Pola'}` : 'Konfirmasi Ulang'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {step === 'set' ? 'Buat kunci baru' : 'Masukkan kunci yang sama untuk konfirmasi'}
              </p>
            </div>
            <div className="p-6">
              {lockType === 'pattern' ? (
                <PatternLock onComplete={handleLockCode} />
              ) : (
                <PinLock onComplete={handleLockCode} />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
