import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/api/endpoints';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Label } from '@/components/common/Label';
import { CaptchaModal } from '@/components/common/CaptchaModal';
import { GoogleLogin } from '@react-oauth/google';
import { Loader2, Sparkles, ChevronRight, Eye, EyeOff, Check, X, Mail, User, BookOpen, Hash, Calendar, Lock, ArrowLeft, Trophy, Users, Shield } from 'lucide-react';

const schema = z.object({
  name: z.string().min(3, { message: "Nama minimal 3 karakter" }),
  email: z.string().email({ message: "Email tidak valid" }),
  password: z.string().min(8, { message: "Password minimal 8 karakter" }),
  password_confirmation: z.string(),
  nis: z.string().min(3, { message: "NIS wajib diisi" }),
  kelas: z.string().min(3, { message: "Kelas wajib diisi" }),
  angkatan: z.string().min(4, { message: "Angkatan wajib diisi (contoh: 2024)" }),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Konfirmasi password tidak cocok",
  path: ["password_confirmation"],
});

function PasswordStrength({ password }) {
  const checks = [
    { label: '8+ karakter', pass: password.length >= 8 },
    { label: 'Huruf besar', pass: /[A-Z]/.test(password) },
    { label: 'Huruf kecil', pass: /[a-z]/.test(password) },
    { label: 'Angka', pass: /\d/.test(password) },
  ];
  const score = checks.filter(c => c.pass).length;
  return (
    <div className="space-y-1 mt-1.5">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`h-0.5 flex-1 rounded-full transition-all duration-500 ${
            i <= score ? (score <= 2 ? 'bg-rose-500' : score === 3 ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-border'
          }`} />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
        {checks.map((c) => (
          <div key={c.label} className="flex items-center gap-1 text-[10px]">
            {c.pass ? <Check className="w-2.5 h-2.5 text-emerald-500 shrink-0" /> : <X className="w-2.5 h-2.5 text-muted-foreground/30 shrink-0" />}
            <span className={c.pass ? 'text-emerald-500 font-medium' : 'text-muted-foreground/40'}>{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [honeypot, setHoneypot] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [password, setPassword] = useState('');
  const [pendingData, setPendingData] = useState(null);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const { register: reg, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: zodResolver(schema),
  });

  const watchPassword = watch('password', '');

  useEffect(() => {
    const checkRegistrationStatus = async () => {
      try {
        const { data } = await authApi.systemInfo();
        setIsRegistrationOpen(data.registration_open);
      } catch {
        setIsRegistrationOpen(false);
      } finally {
        setCheckingStatus(false);
      }
    };
    checkRegistrationStatus();
  }, []);

  const onSubmit = async (data) => {
    if (honeypot) {
      toast.error('Aktivitas mencurigakan terdeteksi.');
      return;
    }
    setPendingData(data);
    setShowCaptcha(true);
  };

  const handleCaptchaVerified = async () => {
    setShowCaptcha(false);
    setIsLoading(true);

    try {
      const payload = { ...pendingData, role: 'siswa' };
      const response = await authApi.register(payload);
      const { user, token, message } = response.data;
      if (token) {
        setAuth(user, token);
        toast.success(message || 'Registrasi berhasil');
        navigate('/siswa/dashboard', { replace: true });
      } else {
        toast.success(message, { duration: 6000 });
        navigate('/login', { replace: true });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registrasi gagal, periksa isian form anda');
    } finally {
      setIsLoading(false);
      setPendingData(null);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    try {
      const response = await authApi.googleLogin({ credential: credentialResponse.credential });
      const { user, token, message } = response.data;
      if (token) {
        setAuth(user, token);
        toast.success(message || 'Login berhasil');
        navigate('/siswa/dashboard', { replace: true });
      } else {
        toast.success(message, { duration: 6000 });
        navigate('/login', { replace: true });
      }
    } catch {
      toast.error('Gagal login dengan Google');
    } finally {
      setIsLoading(false);
    }
  };

  if (checkingStatus) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Memeriksa status pendaftaran...</p>
        </div>
      </div>
    );
  }

  if (!isRegistrationOpen) {
    return (
      <div className="h-screen flex items-center justify-center bg-background p-4">
        <div className="relative w-full max-w-md">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-3xl blur-xl opacity-50" />
          <div className="relative bg-card/95 backdrop-blur-xl border border-border/60 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto mb-5">
              <Lock className="w-7 h-7 text-rose-500" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Registrasi Ditutup</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">Pendaftaran akun mandiri saat ini sedang ditutup.</p>
            <Button className="w-full h-12 rounded-xl" onClick={() => navigate('/login')}>Kembali ke Login</Button>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Shared input class ─── */
  const inputCls = (hasError) =>
    `h-8 lg:h-9 bg-background/50 border-border/70 text-xs lg:text-sm rounded-lg lg:rounded-xl px-3 lg:px-3.5 transition-all duration-300 focus-visible:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary/15 ${hasError ? 'border-destructive/70' : ''}`;

  const labelCls = "text-[10px] lg:text-[11px] font-semibold text-muted-foreground/70 flex items-center gap-1 lg:gap-1.5 mb-0.5";

  const errorCls = "text-[9px] lg:text-[10px] text-destructive font-medium mt-0.5 flex items-center gap-0.5 lg:gap-1";

  return (
    <div className="flex h-[100dvh] lg:h-auto lg:min-h-screen bg-background overflow-hidden lg:overflow-visible">
      <div className="fixed top-3 right-3 lg:top-4 lg:right-4 z-50">
        <ThemeToggle />
      </div>

      {/* ═══ LEFT — Branding (desktop only) ═══ */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[45%] flex-col justify-between p-8 lg:p-12 xl:p-16 relative overflow-hidden sticky top-0 h-screen border-r border-border/5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-secondary/10" />
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-gradient-to-br from-primary/15 to-transparent rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-gradient-to-tl from-secondary/10 to-transparent rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[length:48px_48px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)]" />

        <Link to="/" className="relative inline-flex items-center gap-2.5 group w-fit">
          <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/25 group-hover:scale-105 transition-transform shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/>
            </svg>
          </div>
          <div>
            <div className="text-base font-bold tracking-tight">IPSA</div>
            <div className="text-[8px] uppercase tracking-[0.2em] font-bold text-muted-foreground/50 leading-none">IDN Pamijahan Super Apps</div>
          </div>
        </Link>

        <div className="relative space-y-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/15 text-primary text-[10px] font-semibold tracking-wide backdrop-blur-sm w-fit">
            <Sparkles className="w-3 h-3" />
            Platform #1 Showcase Project Siswa
          </div>

          <h1 className="text-3xl xl:text-4xl font-bold tracking-tight leading-[1.15]">
            <span className="text-foreground/80">Mulai Perjalanan</span>
            <br />
            <span className="bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">Karyamu Bersama</span>
            <br />
            <span className="text-foreground">Kami.</span>
          </h1>

          <p className="text-sm text-muted-foreground/70 leading-relaxed max-w-sm">
            Bergabunglah dengan komunitas siswa kreatif. Upload project, dapatkan validasi guru, dan buktikan kemampuanmu.
          </p>

          <div className="space-y-3 pt-2">
            {[
              { icon: Trophy, title: 'Tunjukkan Karyamu', desc: 'Upload project teknologi dan tampilkan ke seluruh Indonesia' },
              { icon: Users, title: 'Komunitas Kreatif', desc: 'Terhubung dengan 890+ siswa dan guru berpengalaman' },
              { icon: Shield, title: 'Validasi Resmi', desc: 'Dapatkan pengesahan dan SKL dari guru pembimbing' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-start gap-3 group">
                  <div className="w-8 h-8 rounded-[10px] bg-primary/10 border border-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 group-hover:scale-110 transition-all duration-300">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-foreground/90">{item.title}</div>
                    <div className="text-[11px] text-muted-foreground/60 mt-0.5">{item.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative text-[10px] text-muted-foreground/25">&copy; 2025 IPSA.</div>
      </div>

      {/* ═══ RIGHT — Form ═══ */}
      <div className="flex-1 w-full lg:w-1/2 xl:w-[55%] flex flex-col justify-center items-center px-4 py-3 sm:p-6 lg:p-8 relative lg:h-screen lg:overflow-y-auto">
        {/* BG decorations on mobile */}
        <div className="absolute inset-0 pointer-events-none lg:hidden">
          <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-gradient-to-br from-primary/8 via-secondary/5 to-transparent rounded-full blur-[120px]" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-tr from-secondary/5 via-primary/5 to-transparent rounded-full blur-[100px]" />
        </div>

        <div className="w-full max-w-[460px] relative flex flex-col justify-center flex-1 lg:flex-none">

          {/* ── Mobile/Tablet header — ultra compact ── */}
          <div className="lg:hidden flex items-center gap-2.5 mb-2">
            <Link to="/" className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary via-primary/80 to-secondary shadow-md shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/>
              </svg>
            </Link>
            <div>
              <h1 className="text-sm font-bold tracking-tight leading-none">Daftar Akun Baru</h1>
              <p className="text-[10px] text-muted-foreground/60 mt-0.5">Lengkapi data diri Anda</p>
            </div>
          </div>

          {/* Desktop heading */}
          <div className="hidden lg:block mb-3">
            <h1 className="text-xl font-bold tracking-tight">Daftar Akun Baru</h1>
            <p className="text-[11px] text-muted-foreground/60 mt-0.5">Isi data diri Anda untuk memulai perjalanan</p>
          </div>

          {/* ── Form card ── */}
          <div className="relative">
            <div className="absolute -inset-[1.5px] bg-gradient-to-r from-primary/15 via-secondary/15 to-primary/15 rounded-2xl blur-sm opacity-50" />
            <div className="relative bg-card/95 backdrop-blur-xl border border-border/60 rounded-2xl p-3 sm:p-4 lg:p-5 shadow-xl">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-1.5 lg:space-y-2">
                <input type="text" name="honeypot" style={{ display: 'none' }} tabIndex="-1" autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />

                {/* Row 1: Nama + NIS */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="name" className={labelCls}>
                      <User className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-primary" /> Nama Lengkap
                    </Label>
                    <Input id="name" placeholder="Budi Santoso" {...reg('name')}
                      className={inputCls(errors.name)} />
                    {errors.name && <p className={errorCls}><X className="w-2.5 h-2.5" />{errors.name.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="nis" className={labelCls}>
                      <Hash className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-primary" /> NIS
                    </Label>
                    <Input id="nis" placeholder="0012345678" {...reg('nis')}
                      className={inputCls(errors.nis)} />
                    {errors.nis && <p className={errorCls}><X className="w-2.5 h-2.5" />{errors.nis.message}</p>}
                  </div>
                </div>

                {/* Row 2: Kelas + Angkatan */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="kelas" className={labelCls}>
                      <BookOpen className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-primary" /> Kelas
                    </Label>
                    <Input id="kelas" placeholder="XII RPL 1" {...reg('kelas')}
                      className={inputCls(errors.kelas)} />
                    {errors.kelas && <p className={errorCls}><X className="w-2.5 h-2.5" />{errors.kelas.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="angkatan" className={labelCls}>
                      <Calendar className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-primary" /> Tahun Lulus
                    </Label>
                    <Input id="angkatan" type="number" placeholder="2024" {...reg('angkatan')}
                      className={inputCls(errors.angkatan)} />
                    {errors.angkatan && <p className={errorCls}><X className="w-2.5 h-2.5" />{errors.angkatan.message}</p>}
                  </div>
                </div>

                {/* Row 3: Email */}
                <div>
                  <Label htmlFor="email" className={labelCls}>
                    <Mail className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-primary" /> Email
                  </Label>
                  <Input id="email" type="email" placeholder="email@sekolah.idn" {...reg('email')}
                    className={inputCls(errors.email)} />
                  {errors.email && <p className={errorCls}><X className="w-2.5 h-2.5" />{errors.email.message}</p>}
                </div>

                {/* Row 4: Password + Confirm */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="password" className={labelCls}>
                      <Lock className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-primary" /> Password
                    </Label>
                    <div className="relative">
                      <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Min. 8"
                        {...reg('password')} onChange={(e) => { reg('password').onChange(e); setPassword(e.target.value); }}
                        onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)}
                        className={`${inputCls(errors.password)} pr-8`} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground/30 hover:text-muted-foreground transition-colors">
                        {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </button>
                    </div>
                    {errors.password && <p className={errorCls}><X className="w-2.5 h-2.5" />{errors.password.message}</p>}
                    {/* Password strength — only on desktop to save space */}
                    <div className="hidden lg:block">
                      {focusedField === 'password' && watchPassword && <PasswordStrength password={watchPassword} />}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="password_confirmation" className={labelCls}>
                      <Lock className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-primary" /> Konfirmasi
                    </Label>
                    <div className="relative">
                      <Input id="password_confirmation" type={showConfirm ? 'text' : 'password'} placeholder="Ulangi"
                        {...reg('password_confirmation')}
                        className={`${inputCls(errors.password_confirmation)} pr-8`} />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground/30 hover:text-muted-foreground transition-colors">
                        {showConfirm ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </button>
                    </div>
                    {errors.password_confirmation && <p className={errorCls}><X className="w-2.5 h-2.5" />{errors.password_confirmation.message}</p>}
                  </div>
                </div>

                {/* Submit */}
                <Button type="submit" disabled={isLoading}
                  className="relative w-full h-8 lg:h-9 text-xs lg:text-sm font-bold rounded-lg lg:rounded-xl overflow-hidden group mt-0.5 lg:mt-1"
                  style={{
                    background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))',
                    boxShadow: '0 4px 16px rgba(108,99,255,.25)',
                  }}>
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <span className="relative flex items-center justify-center gap-1.5">
                    {isLoading ? (
                      <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Mendaftarkan...</>
                    ) : (
                      <><Sparkles className="w-3.5 h-3.5" /> Daftar Sekarang <ChevronRight className="w-3 h-3" /></>
                    )}
                  </span>
                </Button>

                {/* Divider + Google */}
                <div className="relative my-1">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border/40" /></div>
                  <div className="relative flex justify-center"><span className="bg-card px-2.5 text-[8px] lg:text-[9px] font-bold tracking-widest uppercase text-muted-foreground/30">Atau</span></div>
                </div>

                <div className="flex justify-center [&>div]:w-full [&>div>div]:!w-full [&>div>div>div]:!w-full [&>div>div>iframe]:!w-full">
                  <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => toast.error('Google Login Gagal')}
                    theme="outline" shape="pill" text="signup_with" width="100%" size="large" />
                </div>
              </form>

              {/* Footer link */}
              <div className="mt-2 lg:mt-2.5 pt-2 lg:pt-2.5 border-t border-border/30 text-center">
                <p className="text-[10px] lg:text-[11px] text-muted-foreground/50 mb-1">Sudah memiliki akun?</p>
                <Link to="/login" className="inline-flex items-center justify-center w-full h-8 lg:h-9 rounded-lg lg:rounded-xl border border-border/60 text-foreground/70 text-[11px] lg:text-xs font-semibold hover:bg-primary/5 hover:border-primary/25 transition-all duration-300 group">
                  Masuk ke Dashboard <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>

      {showCaptcha && (
        <CaptchaModal
          onVerified={handleCaptchaVerified}
          onClose={() => { setShowCaptcha(false); setPendingData(null); }}
        />
      )}
    </div>
  );
}
