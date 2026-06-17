import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useAuthStore } from '@/store/authStore';
import { siswaApi } from '@/api/siswaApi';
import { notificationApi } from '@/api/notificationApi';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faFolderOpen, 
  faClock, 
  faCheckCircle, 
  faCircleCheck,
  faEye, 
  faChevronRight, 
  faCode, 
  faMobileAlt, 
  faGlobe, 
  faBoxOpen,
  faEdit,
  faCircleDot,
  faLightbulb,
  faRocket,
  faCalendarAlt,
  faExclamationCircle,
  faGraduationCap,
  faCircleNotch
} from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';
import id from 'dayjs/locale/id';
import toast from 'react-hot-toast';
import { cn } from '@/utils/utils';

dayjs.locale(id);

export function DashboardSiswa() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentNotif, setCurrentNotif] = useState(null);

  // Stats
  const stats = useMemo(() => {
    return {
      total: submissions.length,
      pending: submissions.filter(s => ['submitted', 'under_review'].includes(s.status)).length,
      approved: submissions.filter(s => ['approved', 'skl_issued'].includes(s.status)).length,
      views: 0 
    };
  }, [submissions]);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [subRes, catRes] = await Promise.all([
          siswaApi.getMySubmissions(),
          siswaApi.getCategories()
      ]);
      setSubmissions(subRes.data.submissions || []);
      setCategories(catRes.data.categories || []);
    } catch (error) {
      toast.error('Gagal mengambil data dashboard');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchUnreadNotifications = useCallback(async () => {
    try {
      const { data } = await notificationApi.getNotifications({ unread_only: true });
      const unread = data.data || [];
      setUnreadNotifications(unread);
      
      if (unread.length > 0) {
        const taskNotif = unread.find(n => n.title.includes('Tugas') || n.title.includes('New Task'));
        if (taskNotif) {
          setCurrentNotif(taskNotif);
          setShowPopup(true);
        }
      }
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
    fetchUnreadNotifications();
  }, [fetchDashboardData, fetchUnreadNotifications]);

  const filteredSubmissions = submissions.filter(s => {
    if (filter === 'all') return true;
    if (filter === 'approved') return ['approved', 'skl_issued'].includes(s.status);
    if (filter === 'pending') return s.status === 'submitted';
    if (filter === 'review') return s.status === 'under_review';
    return true;
  });

  const getStatusBadge = (status) => {
    const statusMap = {
      draft: { label: 'Draft', variant: 'secondary', icon: faCircleDot, color: 'text-slate-500' },
      submitted: { label: 'Pending', variant: 'default', icon: faClock, color: 'text-indigo-500' },
      under_review: { label: 'In Review', variant: 'warning', icon: faCircleDot, color: 'text-amber-500', pulse: true },
      revision: { label: 'Revisi', variant: 'destructive', icon: faExclamationCircle, color: 'text-rose-500' },
      approved: { label: 'Disetujui', variant: 'success', icon: faCheckCircle, color: 'text-emerald-500' },
      skl_issued: { label: 'SKL Terbit', variant: 'success', icon: faGraduationCap, color: 'text-emerald-600' },
    };
    const Info = statusMap[status] || statusMap.draft;
    return (
      <Badge variant={Info.variant} className="flex items-center gap-1.5 px-3 py-1 font-bold text-[10px] uppercase tracking-wider border-none shadow-sm">
        <FontAwesomeIcon icon={Info.icon} className={cn("text-[10px]", Info.pulse && "animate-pulse")} /> {Info.label}
      </Badge>
    );
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationApi.markAsRead(id);
      setShowPopup(false);
      setUnreadNotifications(prev => prev.filter(n => n.id !== id));
      toast.success('Notifikasi ditandai sudah baca');
    } catch (error) {
      toast.error('Gagal memperbarui notifikasi');
    }
  };

  const progressPercent = categories.length > 0 ? Math.round((stats.approved / categories.length) * 100) : 0;

  if (isLoading && submissions.length === 0) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-500 animate-pulse font-display">Menyiapkan dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-16">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase">
             <FontAwesomeIcon icon={faCalendarAlt} className="text-indigo-500" />
             <span>{dayjs().format('dddd, D MMMM YYYY')}</span>
             <span className="mx-2 opacity-30">•</span>
             <span className="text-indigo-600 dark:text-indigo-400">Semangat belajar!</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white font-display">
            Halo, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 animate-gradient">{user?.name}</span> 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium max-w-lg">
            Berikut adalah ringkasan progres project dan pencapaian kamu hari ini.
          </p>
        </div>
        <Button 
          onClick={() => navigate('/siswa/submission/create')}
          className="h-14 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-xl shadow-indigo-500/30 transition-all hover:-translate-y-1 active:scale-95 gap-3"
        >
          <FontAwesomeIcon icon={faPlus} className="text-sm" />
          Buat Submission Baru
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Submission', value: stats.total, icon: faFolderOpen, color: 'indigo', desc: 'Semua project kamu' },
          { label: 'Menunggu Review', value: stats.pending, icon: faClock, color: 'amber', desc: 'Sedang diproses' },
          { label: 'Approved & SKL', value: stats.approved, icon: faCheckCircle, color: 'emerald', desc: 'Berhasil divalidasi' },
          { label: 'Project Views', value: stats.views, icon: faEye, color: 'violet', desc: 'Dilihat orang lain' },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-xl bg-white dark:bg-white/5 backdrop-blur-xl group hover:scale-[1.03] transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{stat.label}</p>
                  <h3 className="text-4xl font-black text-slate-900 dark:text-white">{stat.value}</h3>
                </div>
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12",
                  stat.color === 'indigo' && "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400",
                  stat.color === 'amber' && "bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-500",
                  stat.color === 'emerald' && "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400",
                  stat.color === 'violet' && "bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400",
                )}>
                  <FontAwesomeIcon icon={stat.icon} className="text-xl" />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-50 dark:border-white/5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{stat.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Project List */}
        <Card className="lg:col-span-2 border-none shadow-2xl bg-white dark:bg-white/5 backdrop-blur-xl rounded-[2rem] overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between p-8 border-b border-slate-50 dark:border-white/5">
            <div className="flex items-center gap-4">
               <div className="w-1.5 h-8 bg-indigo-600 rounded-full" />
               <div>
                  <CardTitle className="text-xl font-black tracking-tight text-slate-900 dark:text-white uppercase tracking-widest">Project Saya</CardTitle>
                  <p className="text-xs font-bold text-slate-400 uppercase mt-1 tracking-widest">{submissions.length} total karya</p>
               </div>
            </div>
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/5 overflow-hidden">
              {['all', 'approved', 'pending', 'review'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
                    filter === f 
                    ? "bg-white dark:bg-white/10 text-indigo-600 dark:text-white shadow-sm" 
                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  )}
                >
                  {f === 'all' ? 'Semua' : f === 'approved' ? 'Selesai' : f === 'pending' ? 'Pending' : 'Review'}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredSubmissions.length === 0 ? (
              <div className="py-24 px-8 text-center bg-slate-50/20 dark:bg-white/[0.01]">
                <div className="w-20 h-20 bg-white dark:bg-white/5 shadow-inner rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200 dark:text-white/10 border border-slate-100 dark:border-white/5">
                   <FontAwesomeIcon icon={faBoxOpen} size="2x" />
                </div>
                <h4 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-widest">Belum ada project</h4>
                <p className="text-slate-400 dark:text-slate-500 text-xs max-w-xs mx-auto mt-2 font-medium">Ayo tunjukkan karya terbaikmu untuk mendapatkan SKL.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50 dark:divide-white/5">
                {filteredSubmissions.map((sub) => (
                  <div 
                    key={sub.id} 
                    onClick={() => navigate(`/siswa/submission/${sub.slug}`)}
                    className="group px-8 py-7 hover:bg-slate-50 dark:hover:bg-white/[0.02] flex transition-all items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-6 flex-1 min-w-0">
                      <div className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center text-xl shadow-lg transition-transform group-hover:scale-110 duration-300",
                        sub.category?.name?.toLowerCase().includes('web') ? "bg-blue-100 dark:bg-blue-500/20 text-blue-600" :
                        sub.category?.name?.toLowerCase().includes('mobile') ? "bg-violet-100 dark:bg-violet-500/20 text-violet-600" :
                        "bg-slate-100 dark:bg-slate-800 text-slate-600"
                      )}>
                        <FontAwesomeIcon icon={
                          sub.category?.name?.toLowerCase().includes('web') ? faGlobe :
                          sub.category?.name?.toLowerCase().includes('mobile') ? faMobileAlt : faCode
                        } />
                      </div>
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex items-center gap-3">
                          <h4 className="font-extrabold text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate text-lg leading-tight">
                            {sub.judul_project}
                          </h4>
                          {getStatusBadge(sub.status)}
                        </div>
                        <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                          <span className="bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">{sub.category?.name || 'Dev'}</span>
                          <span className="opacity-30">•</span>
                          <span>Diupload {dayjs(sub.created_at).format('D MMM YYYY')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 ml-4">
                       <div className="flex items-center -space-x-1 opacity-0 group-hover:opacity-100 transition-all">
                          {sub.status !== 'approved' && sub.status !== 'skl_issued' && (
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              onClick={(e) => { e.stopPropagation(); navigate(`/siswa/submission/${sub.slug}/edit`); }}
                              className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 text-slate-400 hover:text-indigo-600 shadow-sm border border-slate-200 dark:border-white/10"
                            >
                              <FontAwesomeIcon icon={faEdit} className="text-xs" />
                            </Button>
                          )}
                       </div>
                       <div className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-300 dark:text-white/20 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-indigo-500/20">
                          <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
          {/* Progress Tracker */}
          <Card className="border-none shadow-xl shadow-indigo-100/50 dark:shadow-2xl bg-white dark:bg-gradient-to-br dark:from-indigo-700 dark:to-violet-800 text-slate-900 dark:text-white rounded-[2rem] overflow-hidden p-8 relative transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 dark:bg-white/10 blur-3xl rounded-full" />
            <div className="relative z-10 space-y-6">
               <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-indigo-200/70">Status Kelulusan</p>
                    <h3 className="text-2xl font-black">Progres SKL</h3>
                  </div>
                  <div className="text-4xl font-black text-indigo-600 dark:text-indigo-100">{progressPercent}%</div>
               </div>
               
               <div className="space-y-6">
                  { [
                    { title: 'Akun Terverifikasi', desc: 'Email & NIS sudah aktif', done: true, icon: faCircleCheck },
                    { title: 'Pengiriman Berkas', desc: `${stats.total} dari ${categories.length} wajib dikirim`, done: stats.total > 0, icon: faCircleCheck },
                    { title: 'Pemeriksaan Guru', desc: `${stats.pending} dalam penilaian`, active: stats.pending > 0, icon: faCircleDot },
                    { title: 'Penerbitan SKL', desc: `${stats.approved} dari ${categories.length} selesai`, done: progressPercent === 100, icon: faGraduationCap, idle: progressPercent < 100 },
                  ].map((step, i) => (
                    <div key={i} className="flex gap-4 relative">
                      {i < 3 && <div className={cn("absolute left-2.5 top-8 w-[2px] h-8 transition-colors", step.done ? "bg-emerald-400/50 dark:bg-indigo-400" : "bg-slate-100 dark:bg-white/10")} />}
                      <div className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center z-10",
                        step.done ? "text-emerald-500 dark:text-emerald-400" : step.active ? "text-indigo-600 dark:text-white animate-pulse" : "text-slate-300 dark:text-white/20"
                      )}>
                        <FontAwesomeIcon icon={step.icon || (step.active ? faCircleDot : step.done ? faCircleCheck : faGraduationCap)} className="text-sm" />
                      </div>
                      <div className="space-y-0.5">
                        <p className={cn("text-sm font-black tracking-tight transition-colors", (!step.done && !step.active) ? "text-slate-400 dark:text-white/40" : "text-slate-900 dark:text-white")}>{step.title}</p>
                        <p className={cn("text-[10px] font-bold uppercase tracking-tighter transition-colors", step.done || step.active ? "text-slate-500 dark:text-indigo-100/60" : "text-slate-400 dark:text-white/30")}>{step.desc}</p>
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          </Card>

          {/* Tips Card */}
          <Card className="border-none shadow-xl bg-white dark:bg-white/5 backdrop-blur-xl rounded-[2rem] p-8">
             <div className="flex items-start gap-5">
                <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center text-xl shrink-0">
                  <FontAwesomeIcon icon={faLightbulb} />
                </div>
                <div className="space-y-2">
                   <h4 className="text-lg font-black text-slate-800 dark:text-white tracking-tight">Tips & Motivasi</h4>
                   <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium italic">
                    "Gunakan portofolio ini untuk dunia kerja. Setiap project yang kamu selesaikan adalah bukti kemampuanmu."
                   </p>
                </div>
             </div>
          </Card>

          {/* Promotion Card */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-[2rem] p-8 text-white relative overflow-hidden group">
             <div className="relative z-10 flex flex-col items-center text-center space-y-3">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                   <FontAwesomeIcon icon={faRocket} />
                </div>
                <h4 className="text-xl font-black uppercase tracking-widest">Terus Berkarya!</h4>
                <p className="text-[10px] font-bold text-emerald-100/80 uppercase tracking-widest leading-relaxed">
                  Kamu sudah submit {stats.total} project.<br/>Satu langkah lagi menuju SKL!
                </p>
             </div>
             <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700" />
          </div>
        </div>
      </div>

      {/* NOTIFICATION POPUP MODAL */}
      {showPopup && currentNotif && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/40 dark:bg-black/60 backdrop-blur-md animate-in fade-in duration-500">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-indigo-500/30 rounded-[2.5rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.3)] dark:shadow-[0_40px_100px_rgba(0,0,0,0.7)] animate-in zoom-in-95 duration-500">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600" />
            
            <div className="p-10">
              <div className="flex flex-col items-center text-center gap-6 mb-8">
                <div className="w-20 h-20 rounded-3xl bg-indigo-600 text-white flex items-center justify-center text-3xl shadow-xl shadow-indigo-600/30">
                  <FontAwesomeIcon icon={faCheckCircle} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{currentNotif.title}</h3>
                  <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-[0.2em]">{dayjs(currentNotif.created_at).fromNow()}</div>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-2xl border border-slate-100 dark:border-white/5 mb-10 text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic text-center">
                "{currentNotif.message}"
              </div>

              <div className="flex flex-col gap-4">
                <Button 
                  onClick={() => handleMarkAsRead(currentNotif.id)}
                  className="w-full h-15 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-600/20 hover:-translate-y-1 active:scale-95"
                >
                  SAYA MENGERTI
                </Button>
                <button 
                  onClick={() => setShowPopup(false)}
                  className="w-full h-12 bg-transparent hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 dark:text-slate-500 text-xs font-black uppercase tracking-widest rounded-2xl transition-all"
                >
                  Tutup Sekarang
                </button>
              </div>
            </div>
            
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full blur-3xl -z-10" />
            <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl -z-10" />
          </div>
        </div>
      )}
    </div>
  );
}
