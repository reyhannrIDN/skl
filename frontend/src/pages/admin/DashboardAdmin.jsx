import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { adminApi } from '@/api/adminApi';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { 
  Users, FileText, Settings, ActivitySquare, 
  CheckCircle2, AlertCircle, RefreshCw, Loader2, 
  Download, ArrowUpRight, ShieldCheck, 
  ChevronRight, Calendar, UserPlus, FileUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export function DashboardAdmin() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [{ data: statsData }, { data: settingsData }] = await Promise.all([
        adminApi.getStatistics(),
        adminApi.getSettings()
      ]);
      setStats(statsData);
      setSettings(settingsData.settings);
    } catch (error) {
      toast.error('Gagal mengambil data dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (loading) return (
    <div className="flex h-[80vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse font-medium">Menyiapkan Dashboard...</p>
      </div>
    </div>
  );

  return (
    <motion.div 
      className="space-y-8 max-w-[1400px] mx-auto pb-10"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Welcome Hero Section */}
      <motion.div variants={itemVariants} className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/90 via-primary to-indigo-600 p-8 text-white shadow-xl shadow-primary/20">
        <div className="absolute top-0 right-0 -m-8 opacity-10">
          <ShieldCheck size={300} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-2">
              <span className="flex h-2 w-2 rounded-full bg-success animate-pulse" />
              Sistem Aktif
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-display leading-tight">
              Selamat Datang Kembali,<br /> 
              <span className="text-white/90">{user?.name}</span>
            </h1>
            <p className="text-primary-foreground/80 max-w-md font-medium">
              Kelola ekosistem SKL IDN, pantau data lulusan, dan atur konfigurasi sistem dengan mudah.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="secondary" 
              className="bg-white text-primary hover:bg-white/90 font-bold rounded-xl h-12 shadow-lg"
              onClick={fetchData}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
            <Button 
              className="bg-primary-foreground/10 hover:bg-primary-foreground/20 text-white border-white/20 rounded-xl h-12 backdrop-blur-md"
              onClick={() => navigate('/admin/settings')}
            >
              <Settings className="mr-2 h-4 w-4" />
              Sistem Settings
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          variants={itemVariants}
          title="Total Pengguna" 
          value={stats?.users?.total || 0} 
          subValue={`${stats?.users?.siswa || 0} Siswa · ${stats?.users?.guru || 0} Guru`}
          icon={<Users className="text-blue-500" />}
          color="blue"
        />
        <StatCard 
          variants={itemVariants}
          title="Total Pengajuan" 
          value={stats?.submissions?.total || 0} 
          subValue="Dari seluruh angkatan"
          icon={<FileText className="text-amber-500" />}
          color="amber"
        />
        <StatCard 
          variants={itemVariants}
          title="SKL Diterbitkan" 
          value={stats?.submissions?.skl_issued || 0} 
          subValue="Siswa telah divalidasi"
          icon={<CheckCircle2 className="text-emerald-500" />}
          color="emerald"
        />
        <StatCard 
          variants={itemVariants}
          title="Status Registrasi" 
          value={settings?.registration_open === 'true' ? 'Dibuka' : 'Ditutup'} 
          subValue={`Tahun: ${settings?.academic_year || '-'}`}
          icon={settings?.registration_open === 'true' ? <UserPlus className="text-emerald-500" /> : <AlertCircle className="text-rose-500" />}
          color={settings?.registration_open === 'true' ? 'emerald' : 'rose'}
          isStatus
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions Panel */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-bold font-display text-foreground tracking-tight">Aksi Cepat</h2>
            <Button variant="ghost" size="sm" className="text-primary font-bold" onClick={() => navigate('/admin/users')}>
              Lihat Semua <ChevronRight className="ml-1 w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ActionCard 
              title="Manajemen Pengguna"
              description="Daftarkan siswa baru atau setujui akun guru."
              icon={<Users />}
              onClick={() => navigate('/admin/users')}
              color="indigo"
            />
            <ActionCard 
              title="Manajemen Kelas"
              description="Kelola data kelas dan penugasan wali kelas."
              icon={<Calendar />}
              onClick={() => navigate('/admin/classes')}
              color="cyan"
            />
            <ActionCard 
              title="Log Aktivitas"
              description="Pantau audit log dan aktivitas sistem terbaru."
              icon={<ActivitySquare />}
              onClick={() => navigate('/admin/activity-logs')}
              color="amber"
            />
            <ActionCard 
              title="Export Laporan"
              description="Unduh data kelulusan dalam format Excel/PDF."
              icon={<Download />}
              onClick={() => navigate('/admin/reports')}
              color="emerald"
            />
          </div>
        </motion.div>

        {/* System Overview Side Panel */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="flex items-center px-2">
            <h2 className="text-2xl font-bold font-display text-foreground tracking-tight">Info Sistem</h2>
          </div>
          <Card className="border-none shadow-xl shadow-black/5 rounded-3xl overflow-hidden glass-panel">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Ringkasan Konfigurasi</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-5">
                 {settings && Object.entries(settings).slice(0, 5).map(([key, value]) => {
                    if (key === 'school_logo') return null;
                    return (
                      <div key={key} className="flex flex-col gap-1 group">
                        <span className="text-[11px] font-bold uppercase tracking-tight text-muted-foreground/70 group-hover:text-primary transition-colors">
                          {key.replace(/_/g, ' ')}
                        </span>
                        <span className="text-sm font-bold text-foreground truncate">
                          {value === 'true' ? 'YA (AKTIF)' : value === 'false' ? 'TIDAK (NONAKTIF)' : value}
                        </span>
                      </div>
                    );
                 })}
              </div>
              <Button 
                className="w-full mt-8 h-12 rounded-xl font-bold group"
                onClick={() => navigate('/admin/settings')}
              >
                Atur Pengaturan Sistem 
                <ArrowUpRight className="ml-2 w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

function StatCard({ title, value, subValue, icon, color, isStatus, variants }) {
  const bgColors = {
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-700',
    amber: 'bg-amber-500/10 border-amber-500/20 text-amber-700',
    emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700',
    rose: 'bg-rose-500/10 border-rose-500/20 text-rose-700',
  };

  const iconBgs = {
    blue: 'bg-blue-100',
    amber: 'bg-amber-100',
    emerald: 'bg-emerald-100',
    rose: 'bg-rose-100',
  };

  return (
    <motion.div variants={variants}>
      <Card className="border-none shadow-lg shadow-black/5 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 group">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-2xl ${iconBgs[color]} group-hover:scale-110 transition-transform duration-300`}>
              {React.cloneElement(icon, { size: 24, strokeWidth: 2.5 })}
            </div>
            {isStatus && (
              <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-tighter ${bgColors[color]}`}>
                Live Status
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">{title}</p>
            <h3 className="text-3xl font-black font-display tracking-tight text-foreground">{value}</h3>
            <p className="text-xs text-muted-foreground font-medium mt-1 opacity-80">{subValue}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ActionCard({ title, description, icon, onClick, color }) {
  const colors = {
    indigo: 'from-indigo-500/20 to-indigo-500/5 hover:border-indigo-500/30 text-indigo-600 icon-bg-indigo-100',
    cyan: 'from-cyan-500/20 to-cyan-500/5 hover:border-cyan-500/30 text-cyan-600 icon-bg-cyan-100',
    amber: 'from-amber-500/20 to-amber-500/5 hover:border-amber-500/30 text-amber-600 icon-bg-amber-100',
    emerald: 'from-emerald-500/20 to-emerald-500/5 hover:border-emerald-500/30 text-emerald-600 icon-bg-emerald-100',
  };

  const iconBgClass = `bg-${color}-100`; // Note: Tailwind might need full class names if not JIT or if dynamic

  return (
    <button 
      onClick={onClick}
      className={`flex items-start text-left p-6 rounded-3xl border border-transparent bg-gradient-to-br ${colors[color]} transition-all duration-300 hover:shadow-lg group w-full`}
    >
      <div className={`p-4 rounded-2xl bg-white shadow-sm mr-4 group-hover:scale-110 transition-transform`}>
        {React.cloneElement(icon, { className: "w-6 h-6", strokeWidth: 2.5 })}
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{title}</h4>
        <p className="text-xs text-muted-foreground leading-relaxed font-medium">{description}</p>
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 self-center">
        <ChevronRight className="w-5 h-5 text-primary" />
      </div>
    </button>
  );
}
