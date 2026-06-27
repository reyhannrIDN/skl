import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { siswaApi } from '@/api/siswaApi';
import { cn } from '@/utils/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowRight, 
  faGlobe, 
  faMobileAlt, 
  faCode, 
  faMicrochip,
  faClipboardList,
  faCheckCircle,
  faClock,
  faExclamationCircle,
  faGraduationCap,
  faFileInvoice,
  faInfoCircle,
  faLaptopCode
} from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';

export default function SiswaProjectList() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const res = await siswaApi.getCategories();
      setProjects(res.data.categories || []);
    } catch (error) {
      toast.error('Gagal mengambil daftar project');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      approved: { label: 'Disetujui', icon: faCheckCircle, class: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
      submitted: { label: 'In Review', icon: faClock, class: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20' },
      revision: { label: 'Perlu Revisi', icon: faExclamationCircle, class: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' },
      draft: { label: 'Draft', icon: faFileInvoice, class: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20' },
      skl_issued: { label: 'SKL Terbit', icon: faGraduationCap, class: 'bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 border-emerald-600/20' },
    };

    const config = statusMap[status] || { label: 'Belum Dimulai', icon: faClock, class: 'bg-slate-100 dark:bg-white/5 text-slate-400 border-slate-200 dark:border-white/10' };

    return (
      <Badge className={cn("px-3 py-1 font-bold text-[10px] uppercase tracking-wider gap-2 flex items-center border shadow-sm", config.class)}>
        <FontAwesomeIcon icon={config.icon} className="text-[10px]" /> {config.label}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4">
        <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 dark:text-slate-400 animate-pulse font-display font-medium">Memuat daftar tugas project...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-3">
          <Badge variant="outline" className="text-indigo-600 dark:text-indigo-400 border-indigo-500/20 bg-indigo-500/5 px-4 py-1.5 font-bold uppercase tracking-[0.2em] text-[10px] rounded-full">
             <FontAwesomeIcon icon={faLaptopCode} className="mr-2" /> Sertifikasi IPSA
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-black font-display tracking-tight text-slate-900 dark:text-white leading-tight">
            Tugas <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Project Saya</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl font-medium leading-relaxed">
            Selesaikan semua tugas project dari guru pengampu Anda untuk mendapatkan verifikasi kelulusan resmi.
          </p>
        </div>
        
        <div className="flex gap-4">
           <div className="px-6 py-5 bg-white dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/10 text-center min-w-[140px] shadow-xl shadow-slate-200/40 dark:shadow-none backdrop-blur-sm group hover:-translate-y-1 transition-transform">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3">
                 <FontAwesomeIcon icon={faClipboardList} />
              </div>
              <p className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-widest mb-1">Total Tugas</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{projects.length}</p>
           </div>
           <div className="px-6 py-5 bg-white dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/10 text-center min-w-[140px] shadow-xl shadow-slate-200/40 dark:shadow-none backdrop-blur-sm group hover:-translate-y-1 transition-transform">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
                 <FontAwesomeIcon icon={faCheckCircle} />
              </div>
              <p className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-widest mb-1">Selesai</p>
              <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-tighter">
                 {projects.filter(p => p.user_submission?.status === 'approved' || p.user_submission?.status === 'skl_issued').length}
              </p>
           </div>
        </div>
      </div>

      {projects.length === 0 ? (
        <Card className="border-none py-28 bg-white dark:bg-white/5 rounded-[2.5rem] shadow-xl text-center">
          <CardContent className="flex flex-col items-center justify-center space-y-6">
            <div className="w-24 h-24 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center text-slate-200 dark:text-white/10 border border-slate-100 dark:border-white/5">
               <FontAwesomeIcon icon={faClipboardList} size="3x" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-widest">Tidak ada tugas</h3>
              <p className="text-sm text-slate-400 dark:text-slate-500 font-medium max-w-xs mx-auto text-center font-display leading-relaxed">Belum ada project yang ditujukan untuk kelas Anda saat ini.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => {
            const hasSubmission = !!project.user_submission;
            const status = project.user_submission?.status;
            const isApproved = status === 'approved' || status === 'skl_issued';
            
            return (
              <Card key={project.id} className="group overflow-hidden border-none shadow-2xl hover:shadow-indigo-500/20 transition-all duration-500 bg-white dark:bg-white/5 backdrop-blur-xl rounded-[2.5rem] flex flex-col ring-1 ring-slate-100 dark:ring-white/5">
                <CardHeader className="p-8 pb-4 relative">
                  <div className="flex justify-between items-start mb-6">
                    <div className={cn(
                      "w-14 h-14 rounded-[20px] flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/10 transition-transform group-hover:rotate-6 duration-500",
                      isApproved ? "bg-emerald-500/10 text-emerald-600" : "bg-indigo-600 text-white"
                    )}>
                      <FontAwesomeIcon icon={
                        project.name.toLowerCase().includes('web') ? faGlobe :
                        project.name.toLowerCase().includes('mobile') ? faMobileAlt :
                        project.name.toLowerCase().includes('iot') ? faMicrochip : faCode
                      } />
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      {getStatusBadge(status)}
                      {project.guru?.specialty && (
                        <Badge 
                          className={cn(
                            "text-[9px] font-black px-2.5 py-1 rounded-lg border uppercase tracking-[0.1em]",
                            project.guru.specialty === 'IT' ? "text-blue-500 border-blue-500/20 bg-blue-500/5" :
                            project.guru.specialty === 'Diniyah' ? "text-emerald-500 border-emerald-500/20 bg-emerald-500/5" :
                            project.guru.specialty === 'English' ? "text-purple-500 border-purple-500/20 bg-purple-500/5" :
                            "text-slate-500 border-slate-500/20 bg-slate-500/5"
                          )}
                        >
                          {project.guru.specialty}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-xl font-black text-slate-800 dark:text-white leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                    {project.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 font-bold text-slate-400 dark:text-slate-500 mt-2 uppercase tracking-wide text-[10px]">
                    <div className="w-1 h-3 bg-indigo-500 dark:bg-indigo-400 rounded-full" /> {project.guru?.name || 'Guru Idaman'}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="flex-1 px-8 pb-8 pt-4">
                  <div className="p-5 bg-slate-50 dark:bg-white/[0.03] rounded-[24px] space-y-4 border border-slate-100 dark:border-white/5 transition-colors group-hover:bg-indigo-50/50 dark:group-hover:bg-indigo-500/5">
                    <p className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 dark:text-slate-500 flex items-center gap-2">
                      <FontAwesomeIcon icon={faInfoCircle} className="text-indigo-500" /> Ketentuan
                    </p>
                    <div className="space-y-3">
                       {(project.requirements || []).slice(0, 3).map(req => (
                         <div key={req.id} className="flex items-start gap-3 text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                            <div className="w-1 h-1 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                            <span className="line-clamp-1">{req.label}</span>
                         </div>
                       ))}
                       {(project.requirements || []).length > 3 && (
                         <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500/60 dark:text-indigo-400/60 pl-4">+ {(project.requirements || []).length - 3} lainnya...</p>
                       )}
                       {(project.requirements || []).length === 0 && (
                          <p className="text-xs text-slate-400 italic">Tidak ada syarat khusus.</p>
                       )}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="p-8 pt-0">
                  {isApproved ? (
                    <Button 
                      variant="outline" 
                      className="w-full h-14 rounded-2xl border-slate-200 dark:border-white/10 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-200 dark:hover:border-emerald-500/30 text-slate-600 dark:text-slate-400 font-black transition-all gap-3 uppercase tracking-widest text-xs"
                      onClick={() => navigate(`/siswa/submission/${project.user_submission.slug}`)}
                    >
                      LIHAT HASIL <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
                    </Button>
                  ) : hasSubmission ? (
                    <Button 
                      className="w-full h-14 rounded-2xl shadow-xl shadow-indigo-500/30 gap-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black transition-all hover:-translate-y-1 active:scale-95 uppercase tracking-widest text-xs"
                      onClick={() => navigate(`/siswa/submission/${project.user_submission.slug}/edit`)}
                    >
                      {status === 'revision' ? 'PERBAIKI SEKARANG' : 'EDIT SUBMISSION'} <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
                    </Button>
                  ) : (
                    <Button 
                      className="w-full h-14 rounded-2xl shadow-xl shadow-indigo-500/30 gap-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black transition-all hover:-translate-y-1 active:scale-95 uppercase tracking-widest text-xs"
                      onClick={() => navigate(`/siswa/submission/create?category_id=${project.id}`)}
                    >
                      MULAI KERJAKAN <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
