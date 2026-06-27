import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/api/endpoints';
import { PatternLock } from '@/components/lock/PatternLock';
import { PinLock } from '@/components/lock/PinLock';
import toast from 'react-hot-toast';
import { STORAGE_BASE_URL } from '@/utils/runtimeConfig';
import {
  User,
  Lock,
  Smartphone,
  Shield,
  CheckCircle2,
  Key,
  Mail,
  Phone,
  Camera,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  X,
} from 'lucide-react';

export function AccountSettings() {
  const { user, setAuth } = useAuthStore();

  const getInitials = (name) => {
    if (!name) return '?';
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
  const [showPasswords, setShowPasswords] = useState({});

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Lock settings
  const [lockEnabled, setLockEnabled] = useState(false);
  const [lockType, setLockType] = useState('pin');
  const [showLockSetup, setShowLockSetup] = useState(false);
  const [showDisableConfirm, setShowDisableConfirm] = useState(false);
  const [lockCode, setLockCode] = useState('');
  const [step, setStep] = useState('choose');

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
    setShowDisableConfirm(true);
    setLockCode('');
  };

  const handleDisableVerify = async (code) => {
    try {
      const res = await authApi.verifyLock({ lock_code: code });
      if (res.data.verified) {
        await authApi.updateLockSettings({ lock_enabled: false });
        setLockEnabled(false);
        setShowDisableConfirm(false);
        toast.success('Kunci aplikasi dinonaktifkan');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Kode salah, coba lagi');
    }
  };

  const openLockSetup = (type) => {
    setLockType(type);
    setShowLockSetup(true);
    setStep('set');
    setLockCode('');
  };

  const closeLockSetup = () => {
    setShowLockSetup(false);
    setStep('choose');
    setLockCode('');
  };

  const closeDisableConfirm = () => {
    setShowDisableConfirm(false);
    setLockCode('');
  };

  useEffect(() => {
    if (!showLockSetup && !showDisableConfirm) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        if (showLockSetup) closeLockSetup();
        if (showDisableConfirm) closeDisableConfirm();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showLockSetup, showDisableConfirm]);

  const roleLabel = user?.role === 'superadmin' ? 'Admin'
    : user?.role === 'guru' ? 'Guru'
    : user?.role === 'siswa' ? 'Siswa'
    : user?.role?.toUpperCase() || '';

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Pengaturan Akun</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Kelola profil dan keamanan akun</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left - Profile Card */}
        <div className="lg:col-span-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
            <div className="p-6 flex flex-col items-center text-center">
              <div className="relative group mb-4">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-500 p-1 shadow-lg">
                  <div className="w-full h-full rounded-xl bg-slate-900 border-2 border-slate-900 flex items-center justify-center text-2xl font-black text-white overflow-hidden">
                    {user?.avatar ? (
                      <img src={`${STORAGE_BASE_URL}/${user.avatar}`} className="w-full h-full object-cover" alt="" />
                    ) : (
                      getInitials(user?.name)
      )}

      {/* Disable Lock Confirm Modal */}
      {showDisableConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={closeDisableConfirm} />
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Nonaktifkan Kunci</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Masukkan {lockType === 'pin' ? 'PIN' : 'pola'} saat ini untuk konfirmasi</p>
              </div>
              <button
                onClick={closeDisableConfirm}
                className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6">
              {lockType === 'pattern' ? (
                <PatternLock key="disable" onComplete={handleDisableVerify} />
              ) : (
                <PinLock key="disable" onComplete={handleDisableVerify} />
              )}
            </div>
          </div>
        </div>
      )}
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-indigo-600 rounded-lg border-2 border-white dark:border-slate-900 flex items-center justify-center text-white cursor-pointer shadow-lg hover:bg-indigo-700 transition-colors"
                     onClick={() => toast.success('Upload avatar segera hadir!')}>
                  <Camera className="w-3.5 h-3.5" />
                </div>
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">{user?.name}</h3>
              <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mt-1">
                {roleLabel} {user?.kelas ? `· ${user.kelas}` : ''}
              </p>
              <div className="w-full mt-4 pt-4 border-t border-slate-100 dark:border-white/5 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">{user?.role === 'siswa' ? 'NIS' : 'NIP'}</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{user?.nis || user?.nip || '-'}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Email</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[140px]">{user?.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Forms */}
        <div className="lg:col-span-8 space-y-6">
          {/* Profile Info */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-slate-900 dark:text-white">Informasi Pribadi</h3>
              </div>
            </div>
            <form onSubmit={handleProfileSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Nama Lengkap</label>
                  <input type="text" value={profileData.name}
                    onChange={e => setProfileData({...profileData, name: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Email</label>
                  <input type="email" value={profileData.email}
                    onChange={e => setProfileData({...profileData, email: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">No. WhatsApp</label>
                  <input type="text" value={profileData.phone}
                    onChange={e => setProfileData({...profileData, phone: e.target.value})}
                    placeholder="081234..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                </div>
              </div>
              <div className="pt-2">
                <button type="submit" disabled={isUpdatingProfile}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isUpdatingProfile ? 'Menyimpan...' : 'Simpan Profil'}
                </button>
              </div>
            </form>
          </div>

          {/* Password & Lock */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-slate-900 dark:text-white">Keamanan</h3>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {/* Change Password */}
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Key className="w-4 h-4" /> Ganti Password
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Password Saat Ini</label>
                    <input type={showPasswords.current ? 'text' : 'password'} value={passwordData.current_password}
                      onChange={e => setPasswordData({...passwordData, current_password: e.target.value})}
                      className="w-full px-4 py-2.5 pr-10 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    />
                    <button type="button" onClick={() => setShowPasswords(p => ({...p, current: !p.current}))}
                      className="absolute right-3 bottom-2.5 text-slate-400 hover:text-slate-600">
                      {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="relative">
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Password Baru</label>
                    <input type={showPasswords.new ? 'text' : 'password'} value={passwordData.password}
                      onChange={e => setPasswordData({...passwordData, password: e.target.value})}
                      className="w-full px-4 py-2.5 pr-10 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    />
                    <button type="button" onClick={() => setShowPasswords(p => ({...p, new: !p.new}))}
                      className="absolute right-3 bottom-2.5 text-slate-400 hover:text-slate-600">
                      {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="relative">
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Konfirmasi</label>
                    <input type={showPasswords.confirm ? 'text' : 'password'} value={passwordData.password_confirmation}
                      onChange={e => setPasswordData({...passwordData, password_confirmation: e.target.value})}
                      className="w-full px-4 py-2.5 pr-10 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    />
                    <button type="button" onClick={() => setShowPasswords(p => ({...p, confirm: !p.confirm}))}
                      className="absolute right-3 bottom-2.5 text-slate-400 hover:text-slate-600">
                      {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={isUpdatingPassword}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-600 text-white font-semibold text-sm hover:bg-amber-700 transition-colors disabled:opacity-50"
                >
                  <RotateCcw className="w-4 h-4" />
                  {isUpdatingPassword ? 'Mengubah...' : 'Ganti Password'}
                </button>
              </form>

              <div className="border-t border-slate-100 dark:border-white/5 pt-6">
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-4">
                  <Lock className="w-4 h-4" /> Kunci Aplikasi
                </h4>

                {lockEnabled ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Kunci Aktif</p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400">
                          Tipe: {lockType === 'pin' ? 'PIN' : 'Pola'}
                        </p>
                      </div>
                    </div>
                    <button onClick={handleDisableLock}
                      className="px-6 py-2 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-colors"
                    >
                      Nonaktifkan Kunci
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    <button onClick={() => openLockSetup('pin')}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all"
                    >
                      <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center">
                        <Lock className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Kunci PIN</p>
                        <p className="text-xs text-slate-500">4-6 digit angka</p>
                      </div>
                    </button>
                    <button onClick={() => openLockSetup('pattern')}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all"
                    >
                      <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center">
                        <Smartphone className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Kunci Pola</p>
                        <p className="text-xs text-slate-500">3x3 dot pattern</p>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lock Setup Modal */}
      {showLockSetup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={closeLockSetup} />
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">
                  {step === 'set' ? `Atur ${lockType === 'pin' ? 'PIN' : 'Pola'}` : 'Konfirmasi Ulang'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {step === 'set' ? 'Buat kunci baru' : 'Masukkan kunci yang sama untuk konfirmasi'}
                </p>
              </div>
              <button
                onClick={closeLockSetup}
                className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6">
              {lockType === 'pattern' ? (
                <PatternLock key={step} onComplete={handleLockCode} />
              ) : (
                <PinLock key={step} onComplete={handleLockCode} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
