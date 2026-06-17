import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/api/endpoints';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { adminApi } from '@/api/adminApi';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Label } from '@/components/common/Label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/common/Card';
import { GoogleLogin } from '@react-oauth/google';

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

export function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [honeypot, setHoneypot] = useState(''); // Anti-bot Honeypot
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  // Check if registration is allowed by system settings
  useEffect(() => {
    const checkRegistrationStatus = async () => {
      try {
        const { data } = await authApi.systemInfo();
        setIsRegistrationOpen(data.registration_open);
      } catch (error) {
        setIsRegistrationOpen(false); // Default to closed on error
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

    setIsLoading(true);
    try {
      // Append role = siswa for public registration
      const payload = { ...data, role: 'siswa' };
      const response = await authApi.register(payload);
      const { user, token, message } = response.data;
      
      if (token) {
        setAuth(user, token);
        toast.success(message || 'Registrasi berhasil');
        navigate('/siswa/dashboard', { replace: true });
      } else {
        // Pending approval
        toast.success(message, { duration: 6000 });
        navigate('/login', { replace: true });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registrasi gagal, periksa isian form anda');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    try {
      const response = await authApi.googleLogin({ 
        credential: credentialResponse.credential 
      });
      
      const { user, token, message } = response.data;
      
      if (token) {
        setAuth(user, token);
        toast.success(message || 'Login berhasil');
        navigate('/siswa/dashboard', { replace: true });
      } else {
        // Pending approval
        toast.success(message, { duration: 6000 });
        navigate('/login', { replace: true });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal login dengan Google');
    } finally {
      setIsLoading(false);
    }
  };

  if (checkingStatus) {
    return <div className="flex min-h-screen items-center justify-center bg-background p-4">Loading...</div>;
  }

  if (!isRegistrationOpen) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-destructive">Registrasi Ditutup</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">Pendaftaran akun mandiri saat ini sedang ditutup. Silakan hubungi admin sekolah atau guru Anda.</p>
            <Button className="w-full" onClick={() => navigate('/login')}>
              Kembali ke Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 py-12 relative overflow-x-hidden font-sans">
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>
      {/* Abstract Background Effects */}
      <div className="fixed top-[-20%] right-[-10%] w-[60%] h-[60%] bg-secondary/10 rounded-full blur-[150px] pointer-events-none -z-10 animate-pulse duration-[10000ms]"></div>
      <div className="fixed bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-[150px] pointer-events-none -z-10"></div>

      <div className="w-full max-w-xl z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-modern flex items-center justify-center shadow-lg shadow-primary/20 mb-6 hover:scale-105 transition-transform cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
          </Link>
          <h1 className="text-3xl lg:text-4xl font-serif font-bold tracking-tight text-foreground mb-3">Pendaftaran Siswa Baru</h1>
          <p className="text-muted-foreground text-[15px]">Lengkapi data diri Anda untuk memulai permohonan SKL</p>
        </div>

        <Card className="border-0 glass-panel p-2 sm:p-4">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Anti-Bot Honeypot Field */}
              <input 
                type="text" 
                name="honeypot" 
                style={{ display: 'none' }} 
                tabIndex="-1" 
                autoComplete="off" 
                value={honeypot} 
                onChange={(e) => setHoneypot(e.target.value)} 
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2.5 md:col-span-2">
                  <Label htmlFor="name" className="text-foreground font-semibold">Nama Lengkap</Label>
                  <Input
                    id="name"
                    placeholder="Budi Santoso"
                    {...register('name')}
                    className={`h-12 bg-background/50 border-input font-medium placeholder:font-normal placeholder:text-muted-foreground/60 focus-visible:ring-accent ${errors.name ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                  />
                  {errors.name && <p className="text-xs text-destructive font-medium">{errors.name.message}</p>}
                </div>

                <div className="space-y-2.5">
                  <Label htmlFor="nis" className="text-foreground font-semibold">NIS / NISN</Label>
                  <Input
                    id="nis"
                    placeholder="0012345678"
                    {...register('nis')}
                    className={`h-12 bg-background/50 border-input font-medium placeholder:font-normal placeholder:text-muted-foreground/60 focus-visible:ring-accent ${errors.nis ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                  />
                  {errors.nis && <p className="text-xs text-destructive font-medium">{errors.nis.message}</p>}
                </div>

                <div className="space-y-2.5">
                  <Label htmlFor="kelas" className="text-foreground font-semibold">Jurusan / Kelas</Label>
                  <Input
                    id="kelas"
                    placeholder="XII RPL 1"
                    {...register('kelas')}
                    className={`h-12 bg-background/50 border-input font-medium placeholder:font-normal placeholder:text-muted-foreground/60 focus-visible:ring-accent ${errors.kelas ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                  />
                  {errors.kelas && <p className="text-xs text-destructive font-medium">{errors.kelas.message}</p>}
                </div>

                <div className="space-y-2.5 md:col-span-2">
                  <Label htmlFor="angkatan" className="text-foreground font-semibold">Tahun Angkatan Lulus</Label>
                  <Input
                    id="angkatan"
                    type="number"
                    placeholder="2024"
                    {...register('angkatan')}
                    className={`h-12 bg-background/50 border-input font-medium placeholder:font-normal placeholder:text-muted-foreground/60 focus-visible:ring-accent ${errors.angkatan ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                  />
                  {errors.angkatan && <p className="text-xs text-destructive font-medium">{errors.angkatan.message}</p>}
                </div>

                <div className="space-y-2.5 md:col-span-2">
                  <Label htmlFor="email" className="text-foreground font-semibold">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@sekolah.idn"
                    {...register('email')}
                    className={`h-12 bg-background/50 border-input font-medium placeholder:font-normal placeholder:text-muted-foreground/60 focus-visible:ring-accent ${errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                  />
                  {errors.email && <p className="text-xs text-destructive font-medium">{errors.email.message}</p>}
                </div>

                <div className="space-y-2.5">
                  <Label htmlFor="password" className="text-foreground font-semibold">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Minimal 8 karakter"
                    {...register('password')}
                    className={`h-12 bg-background/50 border-input font-medium placeholder:font-normal placeholder:text-muted-foreground/60 tracking-widest focus-visible:ring-accent ${errors.password ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                  />
                  {errors.password && <p className="text-xs text-destructive font-medium">{errors.password.message}</p>}
                </div>

                <div className="space-y-2.5">
                  <Label htmlFor="password_confirmation" className="text-foreground font-semibold">Konfirmasi Password</Label>
                  <Input
                    id="password_confirmation"
                    type="password"
                    placeholder="Ulangi password"
                    {...register('password_confirmation')}
                    className={`h-12 bg-background/50 border-input font-medium placeholder:font-normal placeholder:text-muted-foreground/60 tracking-widest focus-visible:ring-accent ${errors.password_confirmation ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                  />
                  {errors.password_confirmation && <p className="text-xs text-destructive font-medium">{errors.password_confirmation.message}</p>}
                </div>
              </div>

              <Button type="submit" className="w-full h-12 text-base font-bold transition-all bg-accent hover:bg-accent/90 text-accent-foreground glow-button rounded-xl mt-8" disabled={isLoading}>
                {isLoading ? <span className="animate-pulse">Mendaftarkan Akun...</span> : 'Daftar Sekarang'}
              </Button>

              <div className="flex items-center gap-4 my-6 opacity-40">
                <div className="h-[1px] flex-1 bg-foreground" />
                <span className="text-[10px] font-bold tracking-widest uppercase">Atau</span>
                <div className="h-[1px] flex-1 bg-foreground" />
              </div>

              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => toast.error('Google Login Gagal')}
                  theme="filled_blue"
                  shape="pill"
                  text="signup_with"
                  width="100%"
                />
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col border-t border-border/50 pt-6 mt-2">
            <p className="text-center text-[15px] text-muted-foreground w-full mb-4">
              Sudah memiliki akun?
            </p>
            <Button asChild variant="outline" className="w-full h-12 border-border text-foreground font-semibold hover:bg-muted/50 transition-colors rounded-xl">
              <Link to="/login">Masuk ke Dashboard</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
