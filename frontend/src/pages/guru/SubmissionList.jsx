import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { guruApi } from '@/api/guruApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Badge } from '@/components/common/Badge';
import { cn } from '@/utils/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faFilter, 
  faEye, 
  faCheckCircle, 
  faExclamationCircle, 
  faClock, 
  faSpinner,
  faCircle,
  faGraduationCap,
  faClipboardList,
  faHourglassHalf,
  faCheckDouble,
  faUserCircle
} from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';

export function SubmissionList() {
  const navigate = useNavigate();
  const location = useLocation();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [filters, setFilters] = useState({
    search: '',
    status: new URLSearchParams(location.search).get('status') || '',
    kelas: '',
  });

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const { data } = await guruApi.getSubmissions(filters);
      setSubmissions(data.data || []); // .data because it's paginated
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [filters.status, filters.kelas]); // Re-fetch when status or kelas changes

  const handleSearch = (e) => {
    e.preventDefault();
    fetchSubmissions();
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      submitted: { label: 'Menunggu Review', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', icon: faClock, glow: 'shadow-amber-500/10' },
      under_review: { label: 'Dalam Review', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400', icon: faHourglassHalf, glow: 'shadow-indigo-500/10' },
      revision: { label: 'Perlu Revisi', color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400', icon: faExclamationCircle, glow: 'shadow-rose-500/10' },
      approved: { label: 'Disetujui', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', icon: faCheckDouble, glow: 'shadow-emerald-500/10' },
      skl_issued: { label: 'SKL Terbit', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: faGraduationCap, glow: 'shadow-blue-500/10' },
    };
    const Info = statusMap[status] || { label: status, color: 'bg-slate-100 text-slate-700', icon: faCircle };
    return (
      <div className={cn(
        "flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider shadow-sm",
        Info.color,
        Info.glow
      )}>
        <FontAwesomeIcon icon={Info.icon} className="text-[10px]" />
        {Info.label}
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="relative">
          <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-600 to-violet-600 rounded-full hidden md:block" />
          <h1 className="text-4xl font-black font-display tracking-tight text-slate-900 dark:text-white leading-tight">
            Review <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Submissions</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faClipboardList} className="text-indigo-500" />
            Kelola dan evaluasi karya terbaik siswa anda hari ini.
          </p>
        </div>
        
        <div className="flex gap-3">
          <div className="bg-white/50 dark:bg-white/5 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-100 dark:border-white/5 flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <FontAwesomeIcon icon={faHourglassHalf} />
             </div>
             <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Menunggu</p>
                <p className="text-xl font-black text-slate-900 dark:text-white">{submissions.filter(s => s.status === 'submitted').length}</p>
             </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-3xl p-6 shadow-2xl shadow-slate-200/50 dark:shadow-none">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative group">
            <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <Input 
              placeholder="Cari judul project atau nama siswa..." 
              className="pl-12 h-12 bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-white/5 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
          </div>
          
          <div className="relative">
             <select 
               className="h-12 w-full appearance-none rounded-2xl border border-slate-200/50 dark:border-white/5 bg-white/50 dark:bg-slate-800/50 px-4 text-sm font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer"
               value={filters.status}
               onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
             >
               <option value="">Status (Semua)</option>
               <option value="submitted">Menunggu Review</option>
               <option value="under_review">Dalam Review</option>
               <option value="revision">Perlu Revisi</option>
               <option value="approved">Disetujui</option>
               <option value="skl_issued">SKL Diterbitkan</option>
             </select>
             <FontAwesomeIcon icon={faFilter} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs" />
          </div>

          <Button type="submit" className="h-12 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-500/20 font-black tracking-widest transform transition-all active:scale-95">
            CARI DATA
          </Button>
        </form>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 animate-pulse">
            <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-500/10 flex items-center justify-center mb-4">
               <FontAwesomeIcon icon={faSpinner} className="text-3xl text-indigo-600 dark:text-indigo-400 animate-spin" />
            </div>
            <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">Mempersiapkan data...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="bg-white/40 dark:bg-white/[0.02] border border-dashed border-slate-200 dark:border-white/10 rounded-3xl py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center mx-auto mb-6">
                <FontAwesomeIcon icon={faSearch} className="text-2xl text-slate-300 dark:text-slate-700" />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Tidak ada data ditemukan</h3>
            <p className="text-slate-500 dark:text-slate-500 mt-2 font-medium">Coba gunakan filter lain untuk pencarian anda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {submissions.map((sub, idx) => (
              <div 
                key={sub.id} 
                style={{ animationDelay: `${idx * 50}ms` }}
                className="group relative bg-white/60 dark:bg-white/[0.03] backdrop-blur-md border border-white dark:border-white/5 rounded-[2rem] p-5 md:p-6 hover:bg-white dark:hover:bg-white/[0.06] transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 animate-in slide-in-from-bottom-4"
              >
                <div className="flex flex-col md:flex-row items-center gap-6">
                  {/* User Avatar & Info */}
                  <div className="flex items-center gap-4 w-full md:w-[250px] shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center text-slate-500 ring-4 ring-white dark:ring-white/5 shadow-sm overflow-hidden group-hover:scale-110 transition-transform duration-500">
                       {sub.user?.avatar ? <img src={sub.user.avatar} className="w-full h-full object-cover" /> : <FontAwesomeIcon icon={faUserCircle} className="text-2xl" />}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-base font-black text-slate-900 dark:text-white truncate leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{sub.user?.name}</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{sub.user?.kelas}</span>
                    </div>
                  </div>

                  {/* Project Title */}
                  <div className="flex-1 w-full md:w-auto">
                    <div className="flex flex-col">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Judul Project</span>
                       <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200 leading-tight line-clamp-1">{sub.judul_project}</h4>
                       <span className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-2">
                         <FontAwesomeIcon icon={faClock} className="text-[10px]" />
                         Submit: {dayjs(sub.submitted_at).format('DD MMMM YYYY')}
                       </span>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto shrink-0">
                      {getStatusBadge(sub.status)}
                      <Button 
                        onClick={() => navigate(`/guru/submissions/${sub.slug}`)}
                        className="w-full md:w-auto h-12 px-8 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xs tracking-[0.2em] hover:bg-indigo-600 dark:hover:bg-indigo-400 hover:text-white dark:hover:text-white transition-all shadow-xl shadow-slate-900/5 group/btn"
                      >
                        REVIEW
                        <FontAwesomeIcon icon={faEye} className="ml-3 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
