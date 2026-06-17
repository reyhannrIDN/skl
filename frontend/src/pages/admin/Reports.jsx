import React, { useState, useEffect } from 'react';
import { adminApi } from '@/api/adminApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { 
  Download, FileSpreadsheet, Loader2, 
  PieChart, FileText, CheckCircle, 
  Clock, Users, ArrowRight, ShieldCheck,
  FileIcon, Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/utils/utils';

export function Reports() {
  const [downloading, setDownloading] = useState(false);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await adminApi.getStatistics();
      setStats(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = async () => {
    setDownloading(true);
    try {
      const response = await adminApi.exportSubmissions({});
      
      // Create a blob from the response
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link element to trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Rekap_SKL_Project_${new Date().getTime()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('File Excel berhasil diunduh');
    } catch (error) {
      toast.error('Gagal mengekspor laporan');
      console.error(error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Header section with glass effect */}
      <div className="relative overflow-hidden p-8 rounded-[2.5rem] bg-indigo-600 text-white shadow-2xl shadow-indigo-500/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/10 blur-[100px] -ml-32 -mb-32" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full w-fit">
              <PieChart className="w-3 h-3" />
              <span className="text-[10px] font-black tracking-widest uppercase">Data & Analytics</span>
            </div>
            <h1 className="text-4xl font-black font-display tracking-tight leading-none">Pusat Laporan</h1>
            <p className="text-indigo-100 text-sm font-medium max-w-md">Eksport data rekapitulasi nilai dan status SKL siswa untuk keperluan administrasi sekolah.</p>
          </div>
          <div className="flex gap-3">
             <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <FileSpreadsheet className="w-6 h-6 text-white" />
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Statistics Preview */}
        <div className="lg:col-span-8 space-y-8">
           <div className="flex items-center justify-between px-2">
              <h2 className="text-xl font-black font-display tracking-tight text-slate-900 dark:text-white uppercase tracking-widest">Live Data Preview</h2>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { label: 'Total Siswa', val: stats?.users?.total || 0, icon: Users, color: 'indigo' },
                { label: 'Project Selesai', val: stats?.submissions?.approved || 0, icon: CheckCircle, color: 'emerald' },
                { label: 'Menunggu Review', val: stats?.submissions?.submitted || 0, icon: Clock, color: 'amber' },
              ].map((item, i) => (
                <div key={i} className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 p-6 rounded-[2rem] shadow-xl shadow-slate-200/20 dark:shadow-none">
                   <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4", 
                      item.color === 'indigo' ? "bg-indigo-500/10 text-indigo-600" :
                      item.color === 'emerald' ? "bg-emerald-500/10 text-emerald-600" :
                      "bg-amber-500/10 text-amber-600"
                   )}>
                      <item.icon className="w-5 h-5" />
                   </div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{item.label}</p>
                   <h3 className="text-2xl font-black text-slate-900 dark:text-white">{item.val}</h3>
                </div>
              ))}
           </div>

           {/* Export Options */}
           <div className="space-y-6">
              <h2 className="text-xl font-black font-display tracking-tight text-slate-900 dark:text-white uppercase tracking-widest px-2">Format Ekspor</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Card className="border-none shadow-2xl bg-white dark:bg-white/5 backdrop-blur-xl rounded-[2.5rem] overflow-hidden group hover:scale-[1.02] transition-all duration-300">
                    <CardContent className="p-8">
                       <div className="flex justify-between items-start mb-6">
                          <div className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/20">
                             <FileSpreadsheet className="w-7 h-7" />
                          </div>
                          <Badge className="bg-emerald-500/10 text-emerald-600 border-none px-3 font-black text-[10px] uppercase">Recommended</Badge>
                       </div>
                       <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Rekap Excel (XLSX)</h3>
                       <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium mb-8">
                          Laporan lengkap berisi NIS, Nama, Kelas, Kategori Project, Nilai Checklist, Link File, dan Status Review.
                       </p>
                       <Button 
                         onClick={handleExportExcel}
                         disabled={downloading}
                         className="w-full h-14 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black tracking-widest hover:bg-emerald-600 dark:hover:bg-emerald-400 transition-all shadow-xl group-hover:translate-y-[-2px]"
                       >
                          {downloading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Download className="w-4 h-4 mr-2" />}
                          UNDUH EXCEL
                       </Button>
                    </CardContent>
                 </Card>

                 <Card className="border-none shadow-2xl bg-white dark:bg-white/5 backdrop-blur-xl rounded-[2.5rem] overflow-hidden group opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
                    <CardContent className="p-8">
                       <div className="flex justify-between items-start mb-6">
                          <div className="w-14 h-14 bg-rose-500 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-rose-500/20">
                             <FileText className="w-7 h-7" />
                          </div>
                          <Badge variant="secondary" className="border-none px-3 font-black text-[10px] uppercase">Coming Soon</Badge>
                       </div>
                       <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Rekap PDF (Formal)</h3>
                       <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium mb-8">
                          Format dokumen resmi dengan kop sekolah, siap cetak untuk arsip fisik atau lampiran ijazah.
                       </p>
                       <Button 
                         disabled
                         className="w-full h-14 rounded-2xl bg-slate-100 text-slate-400 font-black tracking-widest cursor-not-allowed"
                       >
                          <FileIcon className="w-4 h-4 mr-2" />
                          COMING SOON
                       </Button>
                    </CardContent>
                 </Card>
              </div>
           </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-8">
           <Card className="border-none shadow-xl bg-slate-900 text-white rounded-[2.5rem] p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full" />
              <div className="relative z-10 space-y-6">
                 <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-indigo-400 border border-white/10">
                    <ShieldCheck className="w-6 h-6" />
                 </div>
                 <h4 className="text-xl font-black tracking-tight leading-tight">Integritas Laporan Audit</h4>
                 <p className="text-sm text-slate-400 leading-relaxed font-medium">
                    Seluruh data yang diekspor berasal dari database utama dan divalidasi oleh sistem autentikasi multi-faktor untuk mencegah manipulasi data.
                 </p>
                 <div className="pt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-400">
                    <Sparkles className="w-3 h-3" />
                    <span>Validated Export System</span>
                 </div>
              </div>
           </Card>

           <div className="p-8 rounded-[2.5rem] bg-indigo-50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/10 space-y-4">
              <h4 className="text-sm font-black text-indigo-900 dark:text-indigo-200 uppercase tracking-widest">Informasi Penting</h4>
              <ul className="space-y-3">
                 {[
                   'Data Excel mencakup project dari seluruh angkatan.',
                   'Format tanggal menggunakan zona waktu Jakarta.',
                   'Link file project akan otomatis kadaluarsa jika user dihapus.',
                 ].map((text, i) => (
                   <li key={i} className="flex gap-3 text-xs text-indigo-700/70 dark:text-indigo-300/60 font-medium leading-relaxed">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                      {text}
                   </li>
                 ))}
              </ul>
              <Button variant="link" className="text-indigo-600 dark:text-indigo-400 font-black p-0 h-auto gap-2 group text-xs uppercase tracking-widest">
                 Butuh format lain? Hubungi IT
                 <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </Button>
           </div>
        </div>
      </div>
    </div>
  );
}

