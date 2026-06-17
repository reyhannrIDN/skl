import React, { useEffect, useState } from 'react';
import { adminApi } from '@/api/adminApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Label } from '@/components/common/Label';
import { 
  Save, Loader2, Power, PowerOff, 
  Settings2, School, GraduationCap, 
  ShieldCheck, AlertCircle, Info,
  Sparkles, ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export function SystemSettings() {
  const [settings, setSettings] = useState({
    school_name: '',
    academic_year: '',
    registration_open: 'false',
    headmaster_name: '',
    headmaster_nip: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data } = await adminApi.getSettings();
      setSettings(prev => ({ ...prev, ...data.settings }));
    } catch (error) {
      toast.error('Gagal memuat pengaturan sistem');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...settings };
      await adminApi.updateSettings(payload);
      toast.success('Pengaturan berhasil disimpan');
      fetchSettings();
    } catch (error) {
      toast.error('Gagal menyimpan pengaturan');
    } finally {
      setSaving(false);
    }
  };

  const toggleRegistration = async () => {
    const isCurrentlyOpen = settings.registration_open === 'true';
    const actionLabel = isCurrentlyOpen ? 'menutup' : 'membuka';
    
    if (window.confirm(`Apakah Anda yakin ingin ${actionLabel} pendaftaran siswa?`)) {
      const newValue = isCurrentlyOpen ? 'false' : 'true';
      setSettings(prev => ({ ...prev, registration_open: newValue }));
      
      try {
        await adminApi.toggleRegistration(!isCurrentlyOpen);
        toast.success(`Pendaftaran telah ${!isCurrentlyOpen ? 'Dibuka' : 'Ditutup'}`);
      } catch (error) {
        toast.error('Gagal mengubah status pendaftaran');
        setSettings(prev => ({ ...prev, registration_open: isCurrentlyOpen ? 'true' : 'false' })); // Revert
      }
    }
  };

  if (loading) return (
    <div className="flex h-[80vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse font-medium">Memuat Pengaturan...</p>
      </div>
    </div>
  );

  const isRegistrationOpen = settings.registration_open === 'true';

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      className="space-y-8 max-w-6xl mx-auto pb-20"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <motion.div variants={itemVariants}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-3">
            <Settings2 className="w-3 h-3" />
            Konfigurasi Inti
          </div>
          <h1 className="text-4xl font-black font-display tracking-tight text-foreground">Pengaturan Sistem</h1>
          <p className="text-muted-foreground mt-2 max-w-md">
            Sesuaikan parameter utama aplikasi, identitas sekolah, dan status akses pendaftaran di sini.
          </p>
        </motion.div>
        
        <motion.div variants={itemVariants} className="flex gap-2">
           <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border ${isRegistrationOpen ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' : 'bg-rose-500/10 border-rose-500/20 text-rose-600'}`}>
              <span className={`flex h-2 w-2 rounded-full ${isRegistrationOpen ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`} />
              <span className="text-sm font-bold uppercase tracking-tighter">
                {isRegistrationOpen ? 'Registration: Open' : 'Registration: Closed'}
              </span>
           </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Configuration Form */}
        <motion.div variants={itemVariants} className="lg:col-span-8">
          <Card className="border-none shadow-xl shadow-black/5 rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-muted/30 border-b p-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary rounded-2xl text-white shadow-lg shadow-primary/20">
                  <School className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">Identitas Sekolah</CardTitle>
                  <CardDescription>Informasi ini akan muncul di dashboard dan kop surat resmi.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <form onSubmit={handleSave}>
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label htmlFor="school_name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Nama Sekolah</Label>
                    <div className="relative">
                      <School className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        id="school_name" 
                        className="h-12 pl-12 rounded-xl bg-muted/50 border-transparent focus:bg-background focus:border-primary transition-all font-medium"
                        value={settings.school_name || ''} 
                        onChange={(e) => setSettings({...settings, school_name: e.target.value})} 
                        placeholder="Contoh: SMK Negeri 1 Jakarta"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="academic_year" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Tahun Ajaran</Label>
                    <div className="relative">
                      <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        id="academic_year" 
                        className="h-12 pl-12 rounded-xl bg-muted/50 border-transparent focus:bg-background focus:border-primary transition-all font-medium"
                        value={settings.academic_year || ''} 
                        onChange={(e) => setSettings({...settings, academic_year: e.target.value})} 
                        placeholder="Contoh: 2024/2025"
                      />
                    </div>
                  </div>
                </div>

                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-dashed" />
                  </div>
                  <div className="relative flex justify-start">
                    <span className="bg-background pr-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                      <ShieldCheck className="w-3 h-3" /> Penanggung Jawab
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label htmlFor="headmaster_name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Nama Kepala Sekolah</Label>
                    <Input 
                      id="headmaster_name" 
                      className="h-12 rounded-xl bg-muted/50 border-transparent focus:bg-background focus:border-primary transition-all font-medium"
                      value={settings.headmaster_name || ''} 
                      onChange={(e) => setSettings({...settings, headmaster_name: e.target.value})} 
                      placeholder="Masukkan nama lengkap & gelar"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="headmaster_nip" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">NIP Kepala Sekolah</Label>
                    <Input 
                      id="headmaster_nip" 
                      className="h-12 rounded-xl bg-muted/50 border-transparent focus:bg-background focus:border-primary transition-all font-medium"
                      value={settings.headmaster_nip || ''} 
                      onChange={(e) => setSettings({...settings, headmaster_nip: e.target.value})} 
                      placeholder="Masukkan 18 digit NIP"
                    />
                  </div>
                </div>
                
                <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-4 flex gap-4">
                  <div className="p-2 bg-amber-500/10 rounded-xl text-amber-600 h-fit">
                    <Info className="w-5 h-5" />
                  </div>
                  <p className="text-sm text-amber-700/80 leading-relaxed">
                    Pastikan data di atas sesuai dengan dokumen resmi sekolah karena data ini akan digunakan secara otomatis pada saat pencetakan dokumen SKL oleh guru.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/20 border-t p-8 flex justify-end">
                <Button 
                  type="submit" 
                  disabled={saving} 
                  className="h-14 px-10 rounded-2xl font-bold gap-3 shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  Simpan Perubahan Sistem
                </Button>
              </CardFooter>
            </form>
          </Card>
        </motion.div>

        {/* Access Controls & Quick Info */}
        <motion.div variants={itemVariants} className="lg:col-span-4 space-y-8">
          {/* Registration Toggle Card */}
          <Card className={`border-none shadow-xl shadow-black/5 rounded-[2rem] overflow-hidden transition-all duration-500 ${isRegistrationOpen ? 'ring-2 ring-emerald-500/30' : ''}`}>
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" /> Kontrol Akses
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
               <div className="space-y-6">
                 <div className={`group relative p-8 rounded-[1.5rem] flex flex-col items-center justify-center text-center space-y-4 border-2 border-dashed transition-all duration-300 ${isRegistrationOpen ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-muted/50 border-muted-foreground/10'}`}>
                   <div className={`p-5 rounded-3xl shadow-xl transition-all duration-500 ${isRegistrationOpen ? 'bg-emerald-500 text-white shadow-emerald-500/20 rotate-0' : 'bg-white text-muted-foreground shadow-black/5 rotate-12'}`}>
                     {isRegistrationOpen ? <Power className="w-10 h-10" /> : <PowerOff className="w-10 h-10 opacity-50" />}
                   </div>
                   <div>
                     <h4 className={`font-black text-xl tracking-tight transition-colors ${isRegistrationOpen ? 'text-emerald-700' : 'text-muted-foreground'}`}>
                        {isRegistrationOpen ? 'Registrasi Terbuka' : 'Registrasi Terkunci'}
                     </h4>
                     <p className="text-[11px] font-medium opacity-60 mt-2 px-2 leading-relaxed uppercase tracking-wider">
                       {isRegistrationOpen 
                         ? 'Siswa dapat mendaftarkan akun secara mandiri sekarang.' 
                         : 'Hanya admin yang dapat mendaftarkan akun baru.'}
                     </p>
                   </div>
                 </div>
                 
                 <Button 
                   variant={isRegistrationOpen ? "outline" : "default"} 
                   className={`w-full h-16 rounded-2xl font-black text-sm uppercase tracking-[0.1em] transition-all shadow-lg ${isRegistrationOpen ? 'border-rose-500/30 text-rose-600 hover:bg-rose-500 hover:text-white shadow-rose-500/10' : 'shadow-primary/20'}`}
                   onClick={toggleRegistration}
                 >
                   {isRegistrationOpen ? (
                     <span className="flex items-center gap-2"><PowerOff className="w-5 h-5" /> Tutup Pendaftaran</span>
                   ) : (
                     <span className="flex items-center gap-2"><Power className="w-5 h-5" /> Buka Pendaftaran</span>
                   )}
                 </Button>
               </div>
            </CardContent>
          </Card>

          {/* Security Alert Card */}
          <Card className="bg-rose-500 border-none shadow-xl shadow-rose-500/20 rounded-[2rem] text-white">
            <CardContent className="p-8">
               <div className="flex gap-4 items-start mb-4">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Keamanan Sistem</h4>
                    <p className="text-white/70 text-xs mt-1 leading-relaxed">
                      Pengaturan ini berdampak langsung pada seluruh integritas data kelulusan.
                    </p>
                  </div>
               </div>
               <div className="text-[10px] font-bold uppercase tracking-widest p-3 bg-white/10 rounded-xl border border-white/10">
                 Akses Admin Terakhir: Baru Saja
               </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
