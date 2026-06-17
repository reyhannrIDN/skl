import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { guruApi } from '@/api/guruApi';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, faClock, faHourglassHalf, faExclamationCircle, 
  faCheckCircle, faSync, faSearch, faUsers, faCogs, 
  faChevronRight, faGraduationCap, faLightbulb, faListCheck,
  faFilter, faCircleDot
} from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

export function DashboardGuru() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [{ data: statsData }, { data: submissionsData }] = await Promise.all([
        guruApi.getStatistics(),
        guruApi.getSubmissions({ per_page: 5, status: 'submitted' })
      ]);
      setStats(statsData);
      setRecentSubmissions(submissionsData.data || []);
    } catch (error) {
      toast.error('Gagal memuat data dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStatusBadge = (status) => {
    const statusMap = {
      draft: { label: 'Draft', variant: 'secondary', icon: faCircleDot, color: 'text-gray-500' },
      submitted: { label: 'Menunggu', variant: 'default', icon: faClock, color: 'text-indigo-500' },
      under_review: { label: 'In Review', variant: 'warning', icon: faHourglassHalf, color: 'text-amber-500' },
      revision: { label: 'Revisi', variant: 'destructive', icon: faExclamationCircle, color: 'text-rose-500' },
      approved: { label: 'Disetujui', variant: 'success', icon: faCheckCircle, color: 'text-emerald-500' },
      skl_issued: { label: 'SKL Terbit', variant: 'success', icon: faGraduationCap, color: 'text-emerald-600' },
    };
    const Info = statusMap[status] || statusMap.draft;
    return (
      <Badge variant={Info.variant} className="flex items-center gap-1.5 px-2.5 py-0.5 font-medium border-none shadow-sm capitalize">
        <FontAwesomeIcon icon={Info.icon} className="text-[10px]" /> {Info.label}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-500 animate-pulse">Menyiapkan dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
            Dashboard <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Guru</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Selamat datang kembali, <span className="text-slate-900 dark:text-slate-200">{user?.name}</span> 👋
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-white/50 dark:bg-white/5 backdrop-blur-sm border-slate-200 dark:border-white/10 py-1.5 px-4 text-slate-600 dark:text-slate-300 shadow-sm font-medium">
            <FontAwesomeIcon icon={faChartLine} className="mr-2 text-indigo-500" /> Real-time Analytics
          </Badge>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={fetchData} 
            title="Refresh Data"
            className="rounded-xl border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 h-10 w-10 transition-all hover:rotate-180 duration-500"
          >
            <FontAwesomeIcon icon={faSync} className="text-slate-500 dark:text-slate-400 h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="relative overflow-hidden border-none shadow-xl shadow-indigo-500/10 bg-gradient-to-br from-indigo-600 to-violet-700 text-white group hover:scale-[1.02] transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-indigo-100/70 mb-1">Menunggu</p>
                  <h3 className="text-4xl font-black">{stats.submitted || 0}</h3>
                </div>
                <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                  <FontAwesomeIcon icon={faClock} className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-4 text-[10px] font-medium text-indigo-100 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-200 animate-pulse" /> Memerlukan tindakan segera
              </p>
              <div className="absolute -right-4 -bottom-4 opacity-10 blur-xl group-hover:opacity-20 transition-opacity">
                 <FontAwesomeIcon icon={faClock} className="h-24 w-24" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200/60 dark:border-white/5 shadow-lg shadow-slate-200/40 dark:shadow-none bg-white/70 dark:bg-slate-900/50 backdrop-blur-md hover:border-amber-200 dark:hover:border-amber-500/50 transition-colors group">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">Diproses</p>
                  <h3 className="text-4xl font-black text-slate-800 dark:text-white">{stats.under_review || 0}</h3>
                </div>
                <div className="bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-500 p-3 rounded-2xl group-hover:scale-110 transition-transform">
                  <FontAwesomeIcon icon={faHourglassHalf} className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-4 text-[10px] font-bold text-amber-600/70 dark:text-amber-500/70 uppercase tracking-tighter">Dalam tahap peninjauan</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200/60 dark:border-white/5 shadow-lg shadow-slate-200/40 dark:shadow-none bg-white/70 dark:bg-slate-900/50 backdrop-blur-md hover:border-rose-200 dark:hover:border-rose-500/50 transition-colors group">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">Revisi</p>
                  <h3 className="text-4xl font-black text-slate-800 dark:text-white">{stats.revision || 0}</h3>
                </div>
                <div className="bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-500 p-3 rounded-2xl group-hover:scale-110 transition-transform">
                  <FontAwesomeIcon icon={faExclamationCircle} className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-4 text-[10px] font-bold text-rose-600/70 dark:text-rose-500/70 uppercase tracking-tighter">Perlu diperbaiki siswa</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200/60 dark:border-white/5 shadow-lg shadow-slate-200/40 dark:shadow-none bg-white/70 dark:bg-slate-900/50 backdrop-blur-md hover:border-emerald-200 dark:hover:border-emerald-500/50 transition-colors group">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">SKL Terbit</p>
                  <h3 className="text-4xl font-black text-slate-800 dark:text-white">{stats.skl_issued || 0}</h3>
                </div>
                <div className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-500 p-3 rounded-2xl group-hover:scale-110 transition-transform">
                  <FontAwesomeIcon icon={faCheckCircle} className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-4 text-[10px] font-bold text-emerald-600/70 dark:text-emerald-500/70 uppercase tracking-tighter">Project telah divalidasi</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Submissions List */}
        <Card className="lg:col-span-2 border-slate-200/60 dark:border-white/5 shadow-xl bg-white dark:bg-slate-900/40 shadow-slate-200/50 dark:shadow-none backdrop-blur-xl overflow-hidden rounded-3xl">
          <CardHeader className="flex flex-row items-center justify-between px-6 py-6 border-b border-slate-100 dark:border-white/5">
            <CardTitle className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <div className="w-2 h-6 bg-indigo-600 rounded-full" />
              Submission Masuk Terbaru
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/guru/submissions')} 
              className="text-indigo-600 dark:text-indigo-400 font-bold hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-700 dark:hover:text-indigo-300 px-4 rounded-xl transition-colors"
            >
              Lihat Semua <FontAwesomeIcon icon={faChevronRight} className="ml-2 text-[10px]" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {recentSubmissions.length === 0 ? (
              <div className="py-20 px-8 text-center bg-slate-50/50 dark:bg-slate-900/20">
                <div className="w-20 h-20 bg-white dark:bg-slate-800 shadow-inner rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200 dark:text-slate-700 border-4 border-slate-50 dark:border-slate-800/50">
                   <FontAwesomeIcon icon={faListCheck} size="2x" />
                </div>
                <h4 className="text-lg font-bold text-slate-600 dark:text-slate-400">Semua Terkendali!</h4>
                <p className="text-slate-400 dark:text-slate-500 text-sm max-w-xs mx-auto mt-2">Belum ada project baru yang perlu direview saat ini.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-white/5">
                {recentSubmissions.map((sub) => (
                  <div 
                    key={sub.id} 
                    className="group p-6 hover:bg-indigo-50/30 dark:hover:bg-white/[0.02] flex transition-all items-center justify-between cursor-pointer"
                    onClick={() => navigate(`/guru/submissions/${sub.slug}`)}
                  >
                    <div className="space-y-1.5 overflow-hidden pr-4 flex-1">
                      <div className="flex items-center gap-3">
                         <h4 className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate text-base leading-tight">
                          {sub.judul_project}
                        </h4>
                        {getStatusBadge(sub.status)}
                      </div>
                      <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 gap-4">
                        <span className="flex items-center gap-1.5 font-medium">
                          <FontAwesomeIcon icon={faUsers} className="text-slate-400 dark:text-slate-500 text-[10px]" /> {sub.user?.name}
                        </span>
                        <span className="opacity-30">•</span>
                        <span className="font-medium px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-300">{sub.user?.kelas}</span>
                        <span className="opacity-30">•</span>
                        <span className="flex items-center gap-1.5 italic font-medium">
                           <FontAwesomeIcon icon={faClock} className="text-slate-400 dark:text-slate-500 text-[10px]" /> {dayjs(sub.submitted_at).format('DD MMM, HH:mm')}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => navigate(`/guru/submissions/${sub.slug}`)} 
                        className="opacity-0 group-hover:opacity-100 px-4 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-white/10 text-indigo-600 dark:text-indigo-400 font-bold transition-all"
                      >
                        Review
                      </Button>
                      <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                         <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sidebar Actions */}
        <div className="space-y-8">
          {/* Quick Actions Card */}
          <Card className="border-none shadow-2xl bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] overflow-hidden relative border border-white/50 dark:border-white/5 transition-all duration-700">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 dark:bg-indigo-600/20 blur-[80px] rounded-full -mr-10 -mt-10" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-violet-500/10 dark:bg-violet-600/10 blur-[60px] rounded-full -ml-10 -mb-10" />
            
            <CardHeader className="pb-4 relative pt-10 px-8">
              <CardTitle className="text-2xl font-black tracking-tighter flex items-center gap-3">
                 <div className="bg-gradient-to-t from-indigo-600 to-indigo-400 w-2 h-7 rounded-full shadow-lg shadow-indigo-500/20" />
                 Aksi Cepat
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-2 px-6 pb-10 space-y-4 relative">
              {/* Action Card 1: Review */}
              <button 
                className="w-full group relative flex items-center justify-between p-5 rounded-[1.75rem] bg-white/40 dark:bg-white/[0.03] border border-white dark:border-white/5 hover:bg-white dark:hover:bg-white/[0.08] hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 hover:-translate-y-1 active:scale-[0.98] overflow-hidden text-left"
                onClick={() => navigate('/guru/submissions?status=under_review')}
              >
                <div className="flex items-center gap-4 relative z-10">
                   <div className="w-12 h-12 bg-amber-500/10 dark:bg-amber-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-inner">
                      <FontAwesomeIcon icon={faHourglassHalf} className="text-amber-600 dark:text-amber-500 h-5 w-5" />
                   </div>
                   <div className="flex flex-col">
                      <span className="font-black text-slate-800 dark:text-white text-base leading-tight">Lanjutkan Review</span>
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">Penilaian Berjalan</span>
                   </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                   <FontAwesomeIcon icon={faChevronRight} className="text-[10px]" />
                </div>
              </button>

              {/* Action Card 2: Approved */}
              <button 
                className="w-full group relative flex items-center justify-between p-5 rounded-[1.75rem] bg-white/40 dark:bg-white/[0.03] border border-white dark:border-white/5 hover:bg-white dark:hover:bg-white/[0.08] hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 hover:-translate-y-1 active:scale-[0.98] text-left"
                onClick={() => navigate('/guru/submissions?status=approved')}
              >
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 shadow-inner">
                      <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600 dark:text-emerald-500 h-5 w-5" />
                   </div>
                   <div className="flex flex-col">
                      <span className="font-black text-slate-800 dark:text-white text-base leading-tight">Project Disetujui</span>
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">Arsip Kelulusan</span>
                   </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
                   <FontAwesomeIcon icon={faChevronRight} className="text-[10px]" />
                </div>
              </button>

              <div className="py-2 flex items-center gap-4">
                 <div className="h-px bg-slate-100 dark:bg-white/5 flex-1" />
                 <span className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.2em]">Manajemen</span>
                 <div className="h-px bg-slate-100 dark:bg-white/5 flex-1" />
              </div>

              {/* Secondary Actions Grid */}
              <div className="grid grid-cols-2 gap-4">
                <button 
                  className="group flex flex-col items-center justify-center aspect-square rounded-[2rem] bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/10 hover:bg-indigo-600 text-slate-700 dark:text-indigo-400 hover:text-white transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/20 active:scale-95" 
                  onClick={() => navigate('/guru/students')}
                >
                  <div className="w-12 h-12 bg-white dark:bg-white/5 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors shadow-sm">
                    <FontAwesomeIcon icon={faUsers} className="h-5 w-5" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-widest">Siswa</span>
                </button>
                <button 
                  className="group flex flex-col items-center justify-center aspect-square rounded-[2rem] bg-violet-500/5 dark:bg-violet-500/10 border border-violet-500/10 hover:bg-violet-600 text-slate-700 dark:text-violet-400 hover:text-white transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-500/20 active:scale-95" 
                  onClick={() => navigate('/guru/categories')}
                >
                  <div className="w-12 h-12 bg-white dark:bg-white/5 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors shadow-sm">
                    <FontAwesomeIcon icon={faCogs} className="h-5 w-5" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-widest">Kategori</span>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Tips / Info Card */}
          <Card className="border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-950/20 shadow-none rounded-3xl backdrop-blur-sm transition-colors">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-600 shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                   <FontAwesomeIcon icon={faLightbulb} />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-blue-900 dark:text-blue-300 leading-tight">Panduan Penilaian</h4>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Gunakan checklist untuk memudahkan verifikasi berkas secara sistematis.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
