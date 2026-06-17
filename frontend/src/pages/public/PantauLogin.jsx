import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/api/axios';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faGraduationCap, faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import { Card, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';

export function PantauLogin() {
  const [nis, setNis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!nis.trim()) {
      return toast.error('Silakan masukkan NIS Anak Anda');
    }

    setIsLoading(true);
    try {
      // Validate NIS via GET request to avoid CSRF mismatch
         const response = await api.get(`/parent/track/${nis}`);
      
      if (response.data && response.data.student) {
         // Save to local storage for the dashboard tracking state
         localStorage.setItem('parent_tracked_nis', nis);
         localStorage.setItem('parent_tracked_student', JSON.stringify(response.data.student));
         toast.success('Siswa ditemukan! Membuka Portal Pantau...');
         navigate('/pantau/dashboard');
      }
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error('Gagal masuk: NIS tidak terdaftar di sistem.');
      } else {
        toast.error('Terjadi kesalahan koneksi server.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-500/20 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="w-full max-w-md relative z-10">
           <div className="flex flex-col items-center text-center mb-10">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-indigo-600/30 mb-6 group-hover:scale-110 transition-transform cursor-pointer" onClick={() => navigate('/')}>
                 <FontAwesomeIcon icon={faGraduationCap} className="text-4xl" />
              </div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white font-display uppercase tracking-widest mb-2">Portal Orang Tua</h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Masuk untuk memantau kelulusan SKL dan tugas khusus anak secara *real-time*.</p>
           </div>

           <Card className="border-none shadow-2xl rounded-[3rem] bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl ring-1 ring-white/20 dark:ring-white/5 overflow-hidden">
               <CardContent className="p-8">
                  <form onSubmit={handleLogin} className="space-y-6">
                     <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-2">Nomor Induk Siswa (NIS)</label>
                        <div className="relative">
                            <input 
                              type="text" 
                              value={nis}
                              onChange={(e) => setNis(e.target.value)}
                              placeholder="Ketik NIS Anak Anda di sini..."
                              className="w-full h-14 pl-6 pr-14 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold tracking-widest text-lg"
                              autoFocus
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-indigo-500 bg-indigo-50 dark:bg-indigo-500/20 rounded-xl">
                               <FontAwesomeIcon icon={faSearch} className="text-sm" />
                            </div>
                        </div>
                     </div>
                     
                     <div className="pt-2">
                        <Button 
                           type="submit" 
                           disabled={isLoading}
                           className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-600/30 transition-transform active:scale-95"
                        >
                           {isLoading ? (
                               <div className="flex items-center gap-3">
                                   <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                   Mencari Data...
                               </div>
                           ) : 'Tracking Sekarang'}
                        </Button>
                     </div>
                  </form>
               </CardContent>

               <div className="bg-slate-100/50 dark:bg-slate-800/30 p-6 flex items-start gap-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center shrink-0">
                     <FontAwesomeIcon icon={faShieldAlt} />
                  </div>
                  <div className="space-y-1">
                     <h4 className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">Keamanan Terjamin</h4>
                     <p className="text-[10px] text-slate-500 leading-relaxed font-bold">Portal ini hanya menampilkan rekam progress kelulusan anonim. Identitas wali dan informasi pribadi lainnya tetap terjaga.</p>
                  </div>
               </div>
           </Card>
        </div>
    </div>
  );
}
