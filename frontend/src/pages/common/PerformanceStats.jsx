import React, { useState, useEffect, useMemo } from 'react';
import { statsApi } from '@/api/statsApi';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Sector 
} from 'recharts';
import { cn } from '@/utils/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, 
  faCheckCircle, 
  faClock, 
  faChartBar, 
  faChartPie, 
  faSearch, 
  faFilter, 
  faChevronDown, 
  faSync, 
  faExclamationCircle, 
  faFileAlt,
  faHourglassHalf,
  faGraduationCap,
  faShieldAlt,
  faFire,
  faCheckDouble,
  faEllipsisH,
  faUserCircle
} from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';

export function PerformanceStats() {
  const { user } = useAuthStore();
  const [classes, setClasses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isGuru = user?.role === 'guru';

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const classRes = await statsApi.getAccessibleClasses();
      setClasses(classRes.data.classes);
      
      if (!isGuru) {
        const catRes = await statsApi.getCategories();
        setCategories(catRes.data.categories);
        if (catRes.data.categories.length > 0) {
          setSelectedCategoryId(catRes.data.categories[0].id.toString());
        }
      }
      
      if (classRes.data.classes.length > 0) {
        setSelectedClassId(classRes.data.classes[0].id.toString());
      }
    } catch (error) {
      toast.error('Gagal mengambil data awal statistik');
    }
  };

  useEffect(() => {
    if (selectedClassId) {
      if (isGuru || !selectedCategoryId) {
        fetchClassMonitoring();
      } else {
        fetchPerformanceData();
      }
    }
  }, [selectedClassId, selectedCategoryId]);

  const fetchPerformanceData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await statsApi.getPerformanceData(selectedClassId, selectedCategoryId);
      setData(res.data);
    } catch (error) {
      toast.error('Gagal mengambil data performa');
    } finally {
      setIsLoading(false);
    }
  }, [selectedClassId, selectedCategoryId]);

  const fetchClassMonitoring = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await statsApi.getClassMonitoring(selectedClassId);
      setData(res.data);
    } catch (error) {
      toast.error('Gagal mengambil data monitoring kelas');
    } finally {
      setIsLoading(false);
    }
  }, [selectedClassId]);

  const filteredStudents = useMemo(() => {
    if (!data?.students) return [];
    return data.students.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.nis.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);

  // Chart Colors
  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const specialtyGroups = useMemo(() => {
    if (!data?.categories) return [];
    const groups = [];
    data.categories.forEach(cat => {
      const specName = (cat.specialty || 'LAINNYA').toUpperCase();
      const lastGroup = groups[groups.length - 1];
      if (lastGroup && lastGroup.name === specName) {
        lastGroup.count++;
      } else {
        groups.push({ name: specName, count: 1 });
      }
    });
    return groups;
  }, [data, isGuru]);

  const getSpecColor = (name) => {
    const n = name?.toUpperCase() || '';
    if (n.includes('IT')) return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
    if (n.includes('DINIYAH')) return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    if (n.includes('ENGLISH')) return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    return 'bg-primary/5 text-primary border-primary/20';
  };

  if (!data && isLoading) {
    return (
      <div className="space-y-8 animate-pulse p-4">
        <div className="h-20 bg-slate-200 dark:bg-white/5 rounded-3xl w-2/3 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-slate-100 dark:bg-white/5 rounded-3xl" />)}
        </div>
        <div className="h-[400px] bg-slate-100 dark:bg-white/5 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-1000">
      {/* Header & Filter Bar */}
      <div className="relative group">
        <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/10 to-violet-500/10 rounded-[3rem] blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
        <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/20 dark:border-white/10 p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-500/10">
          <div>
            <div className="flex items-center gap-3 mb-2 text-indigo-600 dark:text-indigo-400">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                <FontAwesomeIcon icon={faFire} className="animate-pulse" />
              </div>
              <span className="text-xs font-black uppercase tracking-[0.3em]">Live Monitoring</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black font-display tracking-tight text-slate-900 dark:text-white leading-tight">
              Statistik <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Performa</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
              {isGuru 
                ? `Memantau progres kelas ${data?.summary?.class_name || '...'} secara real-time.`
                : 'Analisis mendalam penyelesaian project antar kelas.'}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-64 group/select">
              <select 
                className="w-full h-14 pl-12 pr-10 bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-white/5 rounded-2xl appearance-none focus:ring-4 focus:ring-indigo-500/10 outline-none text-sm font-bold transition-all cursor-pointer"
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
              >
                <option value="" disabled>Pilih Kelas</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name || `Kelas #${c.id}`}</option>)}
              </select>
              <FontAwesomeIcon icon={faUsers} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/select:text-indigo-500 transition-colors" />
              <FontAwesomeIcon icon={faChevronDown} className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
            </div>

            <Button 
              onClick={isGuru ? fetchClassMonitoring : fetchPerformanceData} 
              disabled={isLoading}
              className="h-14 px-8 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black tracking-widest hover:bg-indigo-600 dark:hover:bg-indigo-400 transition-all shadow-xl shadow-slate-900/10"
            >
              <FontAwesomeIcon icon={faSync} className={cn("mr-3", isLoading && "animate-spin")} />
              REFRESH
            </Button>
          </div>
        </div>
      </div>

      {data && (
        <>
          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Stats Column */}
            <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Total Siswa', val: data.summary.total_students, desc: `Terdaftar di ${data.summary.class_name}`, icon: faUsers, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                { label: isGuru ? 'Total SKL' : 'Total Project', val: isGuru ? data.summary.total_categories : data.summary.total_tasks, desc: 'Requirement Aktif', icon: faFileAlt, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
                { label: 'Penyelesaian', val: `${data.summary.overall_completion_pct}%`, desc: `${data.summary.completed_submissions_count} Selesai`, icon: faCheckDouble, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                { label: 'Status Kelas', val: data.summary.overall_completion_pct >= 80 ? 'EXCELLENT' : 'MONITORING', desc: 'Evaluasi mingguan', icon: faShieldAlt, color: 'text-amber-500', bg: 'bg-amber-500/10' },
              ].map((stat, i) => (
                <div key={i} className="group relative bg-white/60 dark:bg-white/[0.03] backdrop-blur-md border border-white dark:border-white/5 p-6 rounded-[2rem] hover:bg-white transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                    <FontAwesomeIcon icon={stat.icon} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-1 tracking-tight">{stat.val}</h3>
                  <p className="text-xs font-medium text-slate-500">{stat.desc}</p>
                </div>
              ))}
            </div>

            {/* Specialty Breakdown */}
            {data.specialties && data.specialties.length > 0 && (
              <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                {data.specialties.map((spec, idx) => (
                  <div key={idx} className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-[2rem] text-white shadow-xl shadow-indigo-500/20 group hover:-translate-y-1 transition-all duration-500">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-150 transition-transform duration-700">
                      <FontAwesomeIcon icon={faHourglassHalf} className="text-6xl" />
                    </div>
                    <div className="flex justify-between items-start mb-6">
                      <div className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase">
                        BIDANG {spec.name}
                      </div>
                      <span className="text-3xl font-black">{spec.completion_pct}%</span>
                    </div>
                    <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden mb-4">
                      <div className="h-full bg-white transition-all duration-1000" style={{ width: `${spec.completion_pct}%` }} />
                    </div>
                    <div className="flex justify-between text-[10px] font-bold opacity-80 tracking-widest uppercase">
                      <span>{spec.completed_submissions} PROJECT SELESAI</span>
                      <span>{spec.total_categories} TASKS</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Charts Section */}
            <div className="lg:col-span-8 bg-white/60 dark:bg-white/[0.03] backdrop-blur-md border border-white dark:border-white/5 p-8 rounded-[2.5rem]">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                  <FontAwesomeIcon icon={faChartBar} />
                </div>
                <h3 className="text-xl font-black tracking-tight">Penyelesaian per Project</h3>
              </div>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={isGuru ? data.categories : data.tasks}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis 
                      dataKey={isGuru ? "name" : "label"} 
                      axisLine={false} tickLine={false} 
                      tick={{ fontSize: 10, fill: '#888', fontWeight: 700 }} 
                      dy={10}
                    />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#888' }} unit="%" />
                    <Tooltip 
                      cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                      contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.9)' }}
                    />
                    <Bar dataKey="completion_pct" radius={[10, 10, 0, 0]} barSize={30}>
                      {(isGuru ? data.categories : data.tasks).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white/60 dark:bg-white/[0.03] backdrop-blur-md border border-white dark:border-white/5 p-8 rounded-[2.5rem] flex flex-col items-center justify-center">
              <div className="flex items-center gap-3 mb-8 w-full">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <FontAwesomeIcon icon={faChartPie} />
                </div>
                <h3 className="text-xl font-black tracking-tight">Summary Total</h3>
              </div>
              <div className="h-[250px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Selesai', value: isGuru ? data.summary.completed_submissions_count : data.summary.completed_tasks_count },
                        { name: 'Belum', value: (isGuru ? data.summary.expected_submissions_count : data.summary.expected_tasks_count) - (isGuru ? data.summary.completed_submissions_count : data.summary.completed_tasks_count) }
                      ]}
                      innerRadius={65} outerRadius={90} paddingAngle={8} dataKey="value"
                    >
                      <Cell fill="#6366f1" />
                      <Cell fill="rgba(99, 102, 241, 0.1)" stroke="none" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-black text-indigo-600">{data.summary.overall_completion_pct}%</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Selesai</span>
                </div>
              </div>
            </div>

            {/* Monitoring Matrix (The BIG Table) */}
            <div className="lg:col-span-12 relative">
               <div className="bg-white/60 dark:bg-white/[0.03] backdrop-blur-md border border-white dark:border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
                 <div className="p-8 border-b border-white dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                      <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
                        <FontAwesomeIcon icon={faUsers} className="text-indigo-500" />
                        Matrix Monitoring
                      </h3>
                      <p className="text-slate-500 font-medium mt-1">Pantau detail penyelesaian tiap siswa per project.</p>
                    </div>
                    <div className="relative group w-full md:w-80">
                      <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                      <Input 
                        placeholder="Cari nama atau NIS..." 
                        className="pl-12 h-12 bg-white/50 dark:bg-slate-800/50 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 font-bold"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                 </div>

                 <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-indigo-500/20">
                    <table className="w-full border-separate border-spacing-0">
                      <thead>
                        {data.categories && specialtyGroups.length > 0 && (
                          <tr className="bg-slate-50/50 dark:bg-white/[0.02]">
                            <th className="sticky left-0 z-20 p-4 border-b border-r bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md" />
                            {specialtyGroups.map((group, idx) => (
                              <th key={idx} colSpan={group.count} className={cn(
                                "p-3 text-[10px] font-black uppercase tracking-[0.3em] text-center border-b border-r bg-opacity-10",
                                getSpecColor(group.name)
                              )}>
                                {group.name}
                              </th>
                            ))}
                            <th className="p-4 border-b bg-indigo-500/10 text-[10px] font-black tracking-widest text-indigo-600">OVERALL</th>
                          </tr>
                        )}
                        <tr className="bg-slate-50 dark:bg-white/[0.03]">
                          <th className="sticky left-0 z-20 p-4 md:p-6 text-left text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-500 border-b border-r bg-slate-50 dark:bg-slate-900 min-w-[160px] md:min-w-[300px]">
                            Siswa & Metadata
                          </th>
                          {(data.categories || data.tasks).map(t => (
                            <th key={t.id} className="p-4 min-w-[120px] text-center border-b border-r last:border-r-0">
                              <div className="flex flex-col items-center">
                                <span className="text-[10px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-tight line-clamp-1 max-w-[100px]" title={data.categories ? t.name : t.label}>
                                  {data.categories ? t.name : t.label}
                                </span>
                              </div>
                            </th>
                          ))}
                          <th className="p-6 bg-indigo-500/5 text-center text-xs font-black text-indigo-600 uppercase border-b min-w-[100px]">Progres</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white dark:divide-white/5">
                        {filteredStudents.map((student, sIdx) => (
                          <tr key={student.id} className="group hover:bg-indigo-50/30 dark:hover:bg-indigo-500/5 transition-colors">
                            <td className="sticky left-0 z-10 p-3 md:p-6 bg-white dark:bg-slate-900 border-r transition-colors group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/20">
                              <div className="flex items-center gap-2 md:gap-4">
                                <div className="hidden md:flex w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 items-center justify-center text-slate-400 font-black text-xs shrink-0">
                                   {sIdx + 1}
                                </div>
                                <div className="flex flex-col min-w-0 overflow-hidden">
                                   <span className="font-black text-xs md:text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 truncate transition-colors" title={student.name}>{student.name}</span>
                                   <span className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 truncate">NIS {student.nis}</span>
                                </div>
                              </div>
                            </td>
                            {(data.categories || data.tasks).map(t => {
                              const status = data.categories ? student.status_per_category[t.id] : student.tasks[t.slug];
                              return (
                                <td key={t.id} className="p-4 text-center border-r last:border-r-0 transition-transform group-hover:scale-110">
                                  {status === 'done' ? (
                                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-500 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/10">
                                      <FontAwesomeIcon icon={faCheckCircle} />
                                    </div>
                                  ) : status === 'review' ? (
                                    <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 mx-auto flex items-center justify-center shadow-lg shadow-amber-500/10 animate-pulse">
                                      <FontAwesomeIcon icon={faClock} />
                                    </div>
                                  ) : (
                                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 text-slate-300 dark:text-slate-700 mx-auto flex items-center justify-center">
                                      <FontAwesomeIcon icon={faEllipsisH} />
                                    </div>
                                  )}
                                </td>
                              );
                            })}
                            <td className="p-6 bg-indigo-500/5 text-center transition-colors group-hover:bg-indigo-500/10">
                              <div className="flex flex-col items-center gap-1">
                                <span className={cn("text-xs font-black", student.completion_pct === 100 ? "text-emerald-500" : "text-indigo-600")}>
                                  {student.completion_pct}%
                                </span>
                                <div className="w-12 h-1 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                                   <div className={cn("h-full transition-all duration-1000", student.completion_pct === 100 ? "bg-emerald-500" : "bg-indigo-600")} style={{ width: `${student.completion_pct}%` }} />
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                 </div>
               </div>
            </div>
          </div>
        </>
      )}

      {/* Empty State if no data */}
      {!data && !isLoading && (
        <div className="flex flex-col items-center justify-center py-32 bg-white/40 dark:bg-white/[0.02] border border-dashed border-slate-200 dark:border-white/10 rounded-[3.5rem] shadow-inner">
           <div className="w-24 h-24 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center mb-8 shadow-xl">
              <FontAwesomeIcon icon={faExclamationCircle} className="text-4xl text-slate-300 dark:text-slate-700 animate-bounce" />
           </div>
           <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Pilih Parameter Monitoring</h3>
           <p className="text-slate-500 mt-3 font-medium text-center max-w-md">Klik filter di bagian atas untuk mulai menganalisis performa penyelesaian project siswa secara real-time.</p>
        </div>
      )}
    </div>
  );
}
