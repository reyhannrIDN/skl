import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/api/axios';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faGraduationCap, 
  faCheckCircle, 
  faCircleNotch,
  faCircleDot,
  faExclamationCircle,
  faFolderOpen,
  faClock,
  faShieldAlt,
  faUserGraduate,
  faChartLine,
  faCalendarCheck,
  faExternalLinkAlt,
  faFileAlt,
  faEye,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import { Card, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import { cn } from '@/utils/utils';
import { STORAGE_BASE_URL } from '@/utils/runtimeConfig';

dayjs.locale('id');

export function PantauResult() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
   const API_STORAGE_URL = STORAGE_BASE_URL;

  useEffect(() => {
    const nis = localStorage.getItem('parent_tracked_nis');
    if (!nis) {
       toast.error('Sesi pantau kadaluarsa. Silakan masuk kembali.');
       return navigate('/pantau');
    }
    
    fetchData(nis);
  }, [navigate]);

  const fetchData = async (nis) => {
     setIsLoading(true);
     try {
        const response = await api.get(`/parent/track/${nis}`);
        setData(response.data);
     } catch(error) {
        toast.error('Sesi pantau berakhir.');
        navigate('/pantau');
     } finally {
        setIsLoading(false);
     }
  };

  const logoutTracker = () => {
     localStorage.removeItem('parent_tracked_nis');
     localStorage.removeItem('parent_tracked_student');
     navigate('/pantau');
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      draft: { label: 'Draft', variant: 'secondary', icon: faCircleDot, color: 'text-slate-500', bg: 'bg-slate-100/50' },
      submitted: { label: 'Pending', variant: 'default', icon: faClock, color: 'text-indigo-500', bg: 'bg-indigo-100/50' },
      under_review: { label: 'In Review', variant: 'warning', icon: faCircleDot, color: 'text-amber-500', bg: 'bg-amber-100/50', pulse: true },
      revision: { label: 'Revisi', variant: 'destructive', icon: faExclamationCircle, color: 'text-rose-500', bg: 'bg-rose-100/50' },
      approved: { label: 'Disetujui', variant: 'success', icon: faCheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-100/50' },
      skl_issued: { label: 'SKL Terbit', variant: 'success', icon: faGraduationCap, color: 'text-emerald-600', bg: 'bg-emerald-200/50' },
    };
    const Info = statusMap[status] || statusMap.draft;
    return (
      <div className={cn("flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 shadow-sm backdrop-blur-md", Info.bg)}>
        <FontAwesomeIcon icon={Info.icon} className={cn("text-[10px]", Info.color, Info.pulse && "animate-pulse")} /> 
        <span className={cn("text-[10px] font-black uppercase tracking-widest", Info.color)}>{Info.label}</span>
      </div>
    );
  };

  if (isLoading || !data) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
         <div className="relative flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-700">
            <div className="w-14 h-14 border-[3px] border-indigo-500/10 border-t-indigo-600 rounded-full animate-spin" />
            <div className="text-center">
               <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-[0.3em]">Parent Portal</h3>
            </div>
         </div>
      </div>
    );
  }

  const { student, categories, submissions } = data;
  const approvedCount = submissions.filter(s => ['approved', 'skl_issued'].includes(s.status)).length;
  const pendingCount = submissions.filter(s => ['submitted', 'under_review'].includes(s.status)).length;
  const totalCategories = categories.length;
  const progressPercent = totalCategories > 0 ? Math.round((approvedCount / totalCategories) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] pb-24 text-slate-900 dark:text-slate-100">
        {/* Animated Background Gradients */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
           <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[100px]" />
           <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-violet-500/5 rounded-full blur-[100px]" />
        </div>

        {/* Premium Navbar */}
        <nav className="sticky top-0 z-[100] w-full h-16 bg-white/60 dark:bg-slate-950/60 backdrop-blur-3xl border-b border-indigo-500/10">
           <div className="max-w-7xl mx-auto h-full px-6 lg:px-12 flex items-center justify-between">
              <div className="flex items-center gap-4 group cursor-pointer" onClick={() => navigate('/')}>
                 <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg transition-transform hover:scale-110">
                    <FontAwesomeIcon icon={faUserGraduate} className="text-base" />
                 </div>
                 <h2 className="text-xl font-black font-display tracking-tight text-slate-900 dark:text-white leading-none uppercase">IPSA</h2>
                 <div className="text-[8px] uppercase tracking-[0.2em] font-bold text-slate-400/60">IDN Pamijahan Super Apps</div>
              </div>
              
              <button 
                onClick={logoutTracker} 
                className="px-6 h-10 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 font-black text-xs uppercase tracking-widest transition-all border border-slate-200 dark:border-white/5"
              >
                Logout Account
              </button>
           </div>
        </nav>

        <main className="max-w-7xl mx-auto px-6 lg:px-12 pt-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {/* Stunning Hero ID Card */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#020617] p-8 lg:p-12 shadow-2xl border border-white/10">
               <div className="absolute top-0 right-0 w-[25rem] h-[25rem] bg-indigo-600/10 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none" />
               <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-start gap-10 lg:gap-14">
                   
                   <div className="relative shrink-0">
                      <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-[2.5rem] bg-slate-800 p-1 relative overflow-hidden ring-1 ring-white/20 shadow-2xl">
                         <div className="w-full h-full rounded-[2.3rem] bg-slate-900 border-2 border-white/10 overflow-hidden flex items-center justify-center">
                            {student.avatar ? (
                                <img src={student.avatar} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <FontAwesomeIcon icon={faUserGraduate} className="text-5xl text-slate-700" />
                            )}
                         </div>
                      </div>
                   </div>

                   <div className="flex-1 space-y-6 text-center lg:text-left">
                      <div className="space-y-4">
                         <h1 className="text-4xl lg:text-6xl font-black text-white font-display tracking-tight leading-tight">
                            {student.name}
                         </h1>
                         <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 pt-1">
                            <div className="flex flex-col">
                               <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">ID NOMOR INDUK</span>
                               <span className="text-xl font-bold text-slate-200">NIS: {student.nis}</span>
                            </div>
                            <div className="w-px h-10 bg-white/10 hidden sm:block" />
                            <div className="flex flex-col">
                               <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">KELOMPOK BELAJAR</span>
                               <span className="text-xl font-bold text-slate-200">Kelas {student.kelas}</span>
                            </div>
                         </div>
                      </div>
                   </div>
               </div>
            </div>

            {/* Content Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-12">
               <div className="lg:col-span-8 space-y-8">
                  <div className="flex items-center gap-4 pb-2">
                     <div className="w-1.5 h-8 bg-indigo-500 rounded-full" />
                     <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-widest leading-none">Aktivitas & Kategori Tugas</h3>
                  </div>

                  <div className="space-y-6">
                     {categories.map((cat, idx) => {
                        const sub = cat.user_submission;
                        const isDone = sub && ['approved', 'skl_issued'].includes(sub.status);
                        return (
                            <div key={cat.id} className={cn(
                                 "group bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200/60 dark:border-white/5 overflow-hidden transition-all duration-300",
                                 isDone && "border-emerald-500/20 shadow-[0_8px_30px_rgb(16,185,129,0.05)]"
                              )}
                            >
                               <div className="p-8 lg:p-10 flex flex-col sm:flex-row gap-8 sm:items-start relative z-10">
                                  <div className={cn(
                                     "w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shrink-0 shadow-lg",
                                     isDone ? "bg-emerald-500 text-white shadow-emerald-500/20 transition-transform group-hover:rotate-6" :
                                     sub ? "bg-indigo-600 text-white shadow-indigo-600/20" :
                                     "bg-slate-100 dark:bg-white/5 text-slate-400"
                                  )}>
                                     {idx + 1}
                                  </div>

                                  <div className="flex-1 space-y-6">
                                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div>
                                           <h4 className="text-xl font-black text-slate-800 dark:text-white tracking-tight leading-tight">{cat.name}</h4>
                                           {(cat.start_date || cat.end_date) && (
                                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                                                <FontAwesomeIcon icon={faClock} className="text-indigo-500" /> 
                                                Deadline: {dayjs(cat.start_date || new Date()).format('DD MMM')} — {dayjs(cat.end_date || new Date()).format('DD MMM YYYY')}
                                              </p>
                                           )}
                                        </div>
                                        {sub ? getStatusBadge(sub.status) : <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 dark:bg-white/5 px-4 py-1.5 rounded-full border border-slate-100 dark:border-white/5">Menunggu Pengiriman</span>}
                                     </div>

                                     {sub && (
                                        <div className="bg-slate-50 dark:bg-white/[0.02] rounded-[2rem] border border-slate-100 dark:border-white/5 p-6 lg:p-8 space-y-6">
                                           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-4 border-b border-slate-200/60 dark:border-white/5">
                                               <div className="space-y-1.5">
                                                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Judul Project Siswa</p>
                                                  <p className="text-base font-extrabold text-slate-800 dark:text-slate-200">{sub.judul_project}</p>
                                               </div>
                                               <div className="flex flex-col sm:items-end gap-1 shrink-0">
                                                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">Update Terakhir</p>
                                                  <p className="text-xs font-bold text-indigo-500">{dayjs(sub.submitted_at || sub.updated_at).format('DD MMMM YYYY, HH:mm')}</p>
                                               </div>
                                           </div>

                                           {submissions.find(s => s.id === sub.id)?.files?.length > 0 && (
                                              <div className="space-y-4">
                                                 <div className="flex items-center justify-between">
                                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Berkas Tersimpan:</p>
                                                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-amber-500 uppercase tracking-widest animate-pulse">
                                                       <FontAwesomeIcon icon={faInfoCircle} /> Klik berkas untuk melihat
                                                    </div>
                                                 </div>
                                                 <div className="flex flex-wrap gap-3">
                                                    {submissions.find(s => s.id === sub.id).files.map(f => {
                                                       const fileUrl = f.link_url || (f.file_path ? `${API_STORAGE_URL}/${f.file_path}` : '#');
                                                       return (
                                                          <a 
                                                            key={f.id} 
                                                            href={fileUrl} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer" 
                                                            className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-white/5 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-all hover:-translate-y-1 shadow-sm group/file"
                                                          >
                                                             <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover/file:bg-indigo-600 group-hover/file:text-white transition-colors">
                                                                <FontAwesomeIcon icon={f.link_url ? faExternalLinkAlt : faEye} className="text-[10px]" />
                                                             </div>
                                                             <div className="flex flex-col">
                                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-200">{f.requirement || 'Lihat Dokumen'}</span>
                                                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Klik Untuk Membuka</span>
                                                             </div>
                                                          </a>
                                                       );
                                                    })}
                                                 </div>
                                              </div>
                                           )}
                                        </div>
                                     )}
                                  </div>
                               </div>
                            </div>
                        );
                     })}
                  </div>
               </div>

               <div className="lg:col-span-4 space-y-8">
                  <Card className="border-none shadow-xl bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 lg:p-10">
                     <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 bg-slate-100 dark:bg-white/5 rounded-2xl flex items-center justify-center text-slate-600 dark:text-slate-400 text-lg shadow-inner">
                          <FontAwesomeIcon icon={faChartLine} />
                        </div>
                        <h4 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Rangkuman</h4>
                     </div>
                     
                     <div className="space-y-4">
                        {[
                           { label: 'Kewajiban Tugas', count: totalCategories, color: 'text-slate-500' },
                           { label: 'Project Approved', count: approvedCount, color: 'text-emerald-500' },
                           { label: 'Menunggu Review', count: pendingCount, color: 'text-amber-500' },
                           { label: 'Status Revisi', count: submissions.filter(s => s.status === 'revision').length, color: 'text-rose-500' },
                        ].map((item, idx) => (
                           <div key={idx} className="flex items-center justify-between bg-slate-50 dark:bg-white/[0.02] p-5 rounded-[1.5rem] border border-slate-100 dark:border-white/5">
                              <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{item.label}</span>
                              <span className={cn("text-2xl font-black font-display", item.color)}>{item.count}</span>
                           </div>
                        ))}
                     </div>
                     
                     <div className="mt-8 p-6 rounded-[2rem] bg-indigo-600 dark:bg-indigo-500 text-white shadow-xl shadow-indigo-600/30 text-center">
                        <div className="flex items-center justify-between mb-3">
                           <p className="text-[10px] font-black uppercase tracking-widest text-indigo-100">Progress SKL</p>
                           <p className="text-2xl font-black">{progressPercent}%</p>
                        </div>
                        <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
                           <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
                        </div>
                     </div>
                  </Card>

                  <div className="rounded-[3rem] bg-gradient-to-br from-slate-900 to-black p-10 text-center border border-white/5 shadow-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full blur-[3xl]" />
                      <FontAwesomeIcon icon={faShieldAlt} className="text-4xl text-slate-700 mb-6 group-hover:rotate-12 transition-transform" />
                      <h4 className="text-sm font-black text-white uppercase tracking-widest mb-3">Secure Access</h4>
                      <p className="text-[10px] text-slate-500 leading-relaxed font-bold uppercase tracking-tight">
                         Data dienkripsi secara aman melalui portal tracking resmi sekolah.
                      </p>
                  </div>
               </div>
            </div>
        </main>
    </div>
  );
}
