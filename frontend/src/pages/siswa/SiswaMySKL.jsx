import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { siswaApi } from '@/api/siswaApi';
import { cn } from '@/utils/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowRight, faClock, faCheckCircle, faExclamationCircle, 
  faGraduationCap, faCalendarAlt, faHourglassHalf, faFolderOpen,
  faCalendarCheck, faCalendarTimes, faTrophy, faChartLine, faChevronLeft, faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import toast from 'react-hot-toast';

dayjs.locale('id');

const SKLCalendarView = ({ categories }) => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  
  const daysInMonth = currentDate.daysInMonth();
  const firstDayOfMonth = currentDate.startOf('month').day();

  // Map timelines (continuous bars)
  const timelines = {};
  categories.forEach((cat, index) => {
      const start = dayjs(cat.start_date || new Date()).startOf('day');
      const end = dayjs(cat.end_date || new Date()).startOf('day');
      
      const themeColors = [
          "bg-indigo-500", "bg-emerald-500", "bg-rose-500", "bg-amber-500", "bg-sky-500", "bg-fuchsia-500"
      ];
      const colorClass = themeColors[index % themeColors.length];
      
      let curr = start.clone();
      let safeLoops = 365; // max 1 year timeline to prevent infinite loops
      
      while((curr.isBefore(end, 'day') || curr.isSame(end, 'day')) && safeLoops > 0) {
         const dateKey = curr.format('YYYY-MM-DD');
         if(!timelines[dateKey]) timelines[dateKey] = [];
         
         const isStart = curr.isSame(start, 'day');
         const isEnd = curr.isSame(end, 'day');
         
         timelines[dateKey].push({
            cat,
            isStart,
            isEnd,
            colorClass
         });
         
         curr = curr.add(1, 'day');
         safeLoops--;
      }
  });

  const generateDays = () => {
     let days = [];
     for(let i = 0; i < firstDayOfMonth; i++) {
        days.push(<div key={`empty-${i}`} className="border-b border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50"></div>);
     }
     for(let d = 1; d <= daysInMonth; d++) {
        const dateObj = currentDate.date(d);
        const dateKey = dateObj.format('YYYY-MM-DD');
        const dayEvents = timelines[dateKey] || [];
        const isToday = dateObj.isSame(dayjs(), 'day');

        days.push(
           <div key={d} className={cn(
               "py-2 border-b border-r border-slate-200 dark:border-slate-800 min-h-[90px] md:min-h-[120px] flex flex-col overflow-hidden transition-colors", 
               isToday ? "bg-indigo-50/50 dark:bg-indigo-900/40" : "bg-white dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800"
            )}>
              <span className={cn("text-[10px] md:text-xs font-black w-6 h-6 flex items-center justify-center rounded-full mb-1 ml-2 shrink-0", isToday ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/30" : "text-slate-500 dark:text-slate-400")}>{d}</span>
              
              <div className="flex flex-col gap-[2px] mt-1 w-full justify-start items-stretch">
                 {dayEvents.map((evt, i) => (
                    <div 
                       key={`evt-${i}`} 
                       className={cn(
                          "text-[9px] md:text-[10px] font-bold px-2 py-0.5 md:py-1 text-white truncate min-h-[22px] flex items-center shadow-sm relative z-10",
                          evt.colorClass,
                          evt.isStart ? "rounded-l-md ml-1" : "ml-0",
                          evt.isEnd ? "rounded-r-md mr-1" : "mr-0",
                          (!evt.isStart && !evt.isEnd) ? "rounded-none" : ""
                       )} 
                       title={evt.cat.name}
                    >
                       {evt.isStart ? (
                           <span className="truncate w-full pr-1">{evt.cat.name}</span>
                       ) : evt.isEnd ? (
                           <span className="font-extrabold tracking-widest truncate w-full flex justify-end text-white/90">DEADLINE</span>
                       ) : (
                           <span className="opacity-0 w-full">-</span>
                       )}
                    </div>
                 ))}
              </div>
           </div>
        );
     }
     
     // Fill remaining grid to make perfect rectangle
     const totalBlocks = firstDayOfMonth + daysInMonth;
     const rows = Math.ceil(totalBlocks / 7);
     const remaining = (rows * 7) - totalBlocks;
     for(let i = 0; i < remaining; i++) {
         days.push(<div key={`fill-${i}`} className="border-b border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50"></div>);
     }
     
     return days;
  };

  return (
     <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl p-6 md:p-10 rounded-[3rem] border border-white dark:border-white/5 shadow-2xl shadow-indigo-500/5 dark:shadow-none w-full">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
           <div>
              <h3 className="text-2xl lg:text-3xl font-black font-display text-slate-800 dark:text-white flex items-center gap-3">
                 <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                   <FontAwesomeIcon icon={faCalendarAlt} />
                 </div>
                 Kalendar Timeline SKL
              </h3>
              <p className="text-slate-500 font-medium text-sm mt-2 ml-1">Jadwal mulai dan durasi pengerjaan divisualisasikan dengan blok garis waktu.</p>
           </div>
           <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-2 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
              <button className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 rounded-2xl transition-colors text-slate-600 dark:text-slate-300 font-bold" onClick={() => setCurrentDate(currentDate.subtract(1, 'month'))}><FontAwesomeIcon icon={faChevronLeft}/></button>
              <div className="font-black text-sm tracking-[0.2em] uppercase px-4 text-slate-800 dark:text-slate-200 min-w-[160px] text-center">{currentDate.format('MMMM YYYY')}</div>
              <button className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 rounded-2xl transition-colors text-slate-600 dark:text-slate-300 font-bold" onClick={() => setCurrentDate(currentDate.add(1, 'month'))}><FontAwesomeIcon icon={faChevronRight}/></button>
           </div>
        </div>
        
        <div className="grid grid-cols-7 border-t border-l border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden bg-white/50 dark:bg-slate-900/50 shadow-inner">
           {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(d => (
              <div key={d} className="text-center text-[10px] md:text-xs uppercase tracking-widest font-black text-slate-500 py-4 bg-slate-50 dark:bg-slate-800/80 border-b border-r border-slate-200 dark:border-slate-800">{d}</div>
           ))}
           {generateDays()}
        </div>
     </div>
  );
};

export function SiswaMySKL() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await siswaApi.getCategories();
      setCategories(res.data.categories || []);
    } catch (error) {
      toast.error('Gagal mengambil daftar timeline SKL');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const map = {
      approved: { label: 'Disetujui', icon: faCheckCircle, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
      submitted: { label: 'Sedang Direview', icon: faHourglassHalf, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
      revision: { label: 'Perlu Revisi', icon: faExclamationCircle, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
      skl_issued: { label: 'SKL Terbit', icon: faGraduationCap, color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-600/20 border-emerald-600/30 ring-1 ring-emerald-500/50 shadow-lg shadow-emerald-500/20 font-black' },
    };
    return map[status] || { label: 'Belum Dikerjakan', icon: faClock, color: 'text-slate-500', bg: 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700' };
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium animate-pulse tracking-widest text-sm uppercase">Memuat Timeline SKL...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20 px-4 sm:px-6 mt-4">
      {/* Header Area */}
      <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-indigo-900 via-violet-800 to-indigo-900 p-10 md:p-14 shadow-2xl border border-white/10">
         <div className="absolute top-0 right-0 p-12 opacity-[0.08] pointer-events-none">
            <FontAwesomeIcon icon={faTrophy} className="text-[14rem] text-white -rotate-12 transform scale-125" />
         </div>
         <div className="relative z-10">
           <Badge variant="outline" className="text-indigo-200 border-indigo-400/30 bg-white/5 px-4 py-1.5 font-bold uppercase tracking-widest text-[10px] rounded-full mb-6 backdrop-blur-md">
              <FontAwesomeIcon icon={faChartLine} className="mr-2" /> Progress Kelulusan
           </Badge>
           <h1 className="text-4xl md:text-6xl font-black font-display tracking-tight text-white leading-tight mb-4">
             My <span className="text-indigo-300">SKL Timeline</span>
           </h1>
           <p className="text-indigo-100/80 max-w-xl font-medium leading-relaxed text-sm md:text-base">
             Pantau seluruh timeline project, sisa waktu deadline, dan status kelulusan Anda secara real-time. Manfaatkan waktu dengan maksimal! 
           </p>
         </div>
      </div>

      {/* Calendar Grid View component */}
      {categories.length > 0 && <SKLCalendarView categories={categories} />}

      {categories.length === 0 ? (
        <div className="py-24 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] bg-white/50 dark:bg-slate-900/50">
           <FontAwesomeIcon icon={faFolderOpen} className="text-6xl text-slate-300 dark:text-slate-700 mb-6" />
           <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-300">Belum Ada Timeline Kelulusan</h3>
           <p className="text-slate-500 mt-2 font-medium">Tidak ada project utama yang ditugaskan untuk kelas Anda saat ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {categories.map((cat) => {
            const status = cat.user_submission?.status;
            const config = getStatusConfig(status);
            const hasSubmission = !!cat.user_submission;
            const isApproved = status === 'approved' || status === 'skl_issued';

            // Dates & Timeline calculation
            const startDate = dayjs(cat.start_date || new Date());
            const endDate = dayjs(cat.end_date || new Date()).endOf('day');
            const today = dayjs();
            const totalDays = endDate.diff(startDate, 'day') || 1;
            const daysPassed = today.diff(startDate, 'day');
            
            let progressPercent = (daysPassed / totalDays) * 100;
            if (progressPercent < 0) progressPercent = 0;
            if (progressPercent > 100) progressPercent = 100;

            const isPastDeadline = today.isAfter(endDate, 'day') && !isApproved;
            
            return (
              <Card key={cat.id} className="group overflow-hidden border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-indigo-500/20 transition-all duration-500 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-[2.5rem] flex flex-col ring-1 ring-slate-100 dark:ring-white/5 hover:-translate-y-1">
                <CardHeader className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800/60 bg-gradient-to-br from-slate-50/80 to-white dark:from-slate-800/50 dark:to-slate-900">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                     <Badge className={cn("px-4 py-2 font-bold text-[10px] uppercase tracking-widest gap-2 flex items-center border", config.bg, config.color)}>
                       <FontAwesomeIcon icon={config.icon} className="text-sm" /> {config.label}
                     </Badge>
                     {isPastDeadline && (
                        <div className="flex items-center gap-2 text-rose-500 text-xs font-black uppercase tracking-widest py-1.5 px-4 bg-rose-50 border border-rose-200 dark:border-rose-500/20 dark:bg-rose-500/10 rounded-full shadow-sm">
                           <FontAwesomeIcon icon={faCalendarTimes} className="animate-pulse" /> Lewat Deadline
                        </div>
                     )}
                  </div>
                  <CardTitle className="text-2xl lg:text-3xl font-black text-slate-800 dark:text-white leading-tight">
                    {cat.name}
                  </CardTitle>
                  <p className="text-sm text-slate-500 font-medium line-clamp-2 mt-3 leading-relaxed">{cat.description}</p>
                </CardHeader>
                
                <CardContent className="flex-1 p-6 md:p-8 flex flex-col sm:flex-row gap-8 items-stretch pt-8">
                   {/* Left: Mini Calendar Visualization */}
                   <div className="shrink-0 flex flex-col items-center justify-center bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-200 dark:border-slate-700 w-full sm:w-36 shadow-sm overflow-hidden group-hover:border-indigo-300 dark:group-hover:border-indigo-500/50 transition-colors">
                      <div className={cn(
                        "text-white text-[10px] font-black uppercase tracking-[0.2em] w-full text-center py-2.5",
                        isApproved ? "bg-emerald-500" : isPastDeadline ? "bg-rose-500" : "bg-indigo-600"
                      )}>Target Selesai</div>
                      <div className="py-6 flex flex-col items-center justify-center w-full">
                         <div className="text-5xl font-black font-display text-slate-800 dark:text-white leading-none">{endDate.format('DD')}</div>
                         <div className="text-sm font-bold text-slate-400 uppercase mt-2 tracking-widest">{endDate.format('MMM YYYY')}</div>
                      </div>
                   </div>

                   {/* Right: Detailed Timeline Progress */}
                   <div className="flex-1 flex flex-col justify-center space-y-6">
                      <div className="flex justify-between items-end">
                         <div>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Dimulai Sejak</p>
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                               <FontAwesomeIcon icon={faCalendarAlt} className="text-indigo-400 dark:text-indigo-500" /> {startDate.format('DD MMM YYYY')}
                            </p>
                         </div>
                         <div className="text-right">
                             <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Durasi</p>
                             <p className="text-2xl font-black text-slate-300 dark:text-slate-600 font-display">
                                {isApproved ? 'TUNTAS' : `${totalDays - daysPassed > 0 ? totalDays - daysPassed : 0} Hari`}
                             </p>
                         </div>
                      </div>

                      {/* Bar Gradient Area */}
                      <div className="space-y-2.5 relative">
                         <div className="w-full h-3.5 bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden flex shadow-inner relative border border-slate-200/50 dark:border-slate-700/50">
                            {/* Inner Gradient Loader */}
                            <div 
                               className={cn(
                                 "h-full rounded-full transition-all duration-1000",
                                  isApproved ? "bg-gradient-to-r from-emerald-400 to-emerald-500" :
                                  isPastDeadline ? "bg-gradient-to-r from-rose-400 to-rose-500" :
                                  "bg-gradient-to-r from-indigo-500 to-violet-500 relative overflow-hidden"
                               )} 
                               style={{ width: `${progressPercent}%` }}
                            >
                               {/* Subtle Shine Effect if in progress */}
                               {!isApproved && !isPastDeadline && (
                                   <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                               )}
                            </div>
                         </div>
                         <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <span>0%</span>
                            <span className={cn(
                               isPastDeadline ? "text-rose-500" : isApproved ? "text-emerald-500" : "text-indigo-500"
                            )}>{progressPercent.toFixed(0)}% WAKTU BERLALU</span>
                            <span>100%</span>
                         </div>
                      </div>

                      {/* Action & Guide Row */}
                      <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <span className="text-[11px] font-bold text-slate-400 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700 w-fit">
                             Oleh: <span className="text-slate-700 dark:text-slate-300 uppercase">{cat.guru?.name || 'Sekolah'}</span>
                          </span>
                          
                          {isApproved ? (
                            <Button 
                              onClick={() => navigate(`/siswa/submission/${cat.user_submission.slug}`)}
                              variant="outline"
                              className="rounded-xl border-emerald-200 text-emerald-600 hover:bg-emerald-50 text-xs font-bold gap-2 px-6 h-11 w-full sm:w-auto transition-colors"
                            >
                               Lihat Hasil <FontAwesomeIcon icon={faArrowRight} />
                            </Button>
                          ) : hasSubmission ? (
                             <Button 
                              onClick={() => navigate(`/siswa/submission/${cat.user_submission.slug}/edit`)}
                              className="rounded-xl shadow-lg shadow-indigo-500/30 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold gap-2 px-6 h-11 w-full sm:w-auto transition-transform hover:-translate-y-0.5 active:scale-95"
                            >
                               {status === 'revision' ? 'Kerjakan Revisi' : 'Lanjutkan SKL'} <FontAwesomeIcon icon={faArrowRight} />
                            </Button>
                          ) : (
                             <Button 
                              onClick={() => navigate(`/siswa/submission/create?category_id=${cat.id}`)}
                              className="rounded-xl shadow-lg shadow-indigo-500/30 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-bold gap-2 px-6 h-11 w-full sm:w-auto transition-transform hover:-translate-y-0.5 active:scale-95"
                            >
                               Mulai Sekarang <FontAwesomeIcon icon={faArrowRight} />
                            </Button>
                          )}
                      </div>
                   </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
