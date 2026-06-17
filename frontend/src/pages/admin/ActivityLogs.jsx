import React, { useEffect, useState, useCallback } from 'react';
import { adminApi } from '@/api/adminApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { 
  Loader2, Search, Download, ShieldAlert, 
  User, Clock, Globe, ShieldCheck, 
  Trash2, Edit3, PlusCircle, LogIn, LogOut,
  Monitor, Smartphone, Laptop, SmartphoneIcon
} from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import toast from 'react-hot-toast';
import { cn } from '@/utils/utils';

dayjs.extend(relativeTime);

export function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [actionFilter, setActionFilter] = useState('all');

  const fetchLogs = useCallback(async (isLoadMore = false) => {
    if (!isLoadMore) setLoading(true);
    try {
      const currentPage = isLoadMore ? page + 1 : 1;
      const { data } = await adminApi.getActivityLogs({ 
        search, 
        action: actionFilter === 'all' ? undefined : actionFilter,
        page: currentPage 
      });
      
      const newLogs = data.data || [];
      if (isLoadMore) {
        setLogs(prev => [...prev, ...newLogs]);
        setPage(currentPage);
      } else {
        setLogs(newLogs);
        setPage(1);
      }
      setHasMore(data.next_page_url !== null);
    } catch (error) {
      toast.error('Gagal memuat log aktivitas');
    } finally {
      setLoading(false);
    }
  }, [search, actionFilter, page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLogs();
    }, 500);
    return () => clearTimeout(timer);
  }, [search, actionFilter]);

  const getActionIcon = (action) => {
    const a = action.toLowerCase();
    if (a.includes('login')) return <LogIn className="w-4 h-4 text-emerald-500" />;
    if (a.includes('logout')) return <LogOut className="w-4 h-4 text-slate-500" />;
    if (a.includes('create') || a.includes('store')) return <PlusCircle className="w-4 h-4 text-indigo-500" />;
    if (a.includes('update') || a.includes('edit')) return <Edit3 className="w-4 h-4 text-amber-500" />;
    if (a.includes('delete') || a.includes('destroy')) return <Trash2 className="w-4 h-4 text-rose-500" />;
    return <ShieldCheck className="w-4 h-4 text-slate-400" />;
  };

  const getDeviceIcon = (userAgent) => {
    const ua = userAgent?.toLowerCase() || '';
    if (ua.includes('windows')) return <Monitor className="w-3.5 h-3.5" />;
    if (ua.includes('android')) return <Smartphone className="w-3.5 h-3.5" />;
    if (ua.includes('iphone') || ua.includes('ios')) return <SmartphoneIcon className="w-3.5 h-3.5" />;
    if (ua.includes('macintosh')) return <Laptop className="w-3.5 h-3.5" />;
    return <Globe className="w-3.5 h-3.5" />;
  };

  const actionTypes = [
    { label: 'Semua', value: 'all' },
    { label: 'Login', value: 'LOGIN' },
    { label: 'Create', value: 'CREATE' },
    { label: 'Update', value: 'UPDATE' },
    { label: 'Delete', value: 'DELETE' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      {/* Header section with glass effect */}
      <div className="relative overflow-hidden p-8 rounded-[2.5rem] bg-slate-900 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 blur-[100px] -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600/10 blur-[100px] -ml-32 -mb-32" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full w-fit">
              <ShieldAlert className="w-3 h-3 text-indigo-400" />
              <span className="text-[10px] font-black tracking-widest uppercase">Security Audit Log</span>
            </div>
            <h1 className="text-4xl font-black font-display tracking-tight leading-none">Log Aktivitas</h1>
            <p className="text-slate-400 text-sm font-medium max-w-md">Pantau jejak digital dan audit keamanan seluruh interaksi sistem secara real-time.</p>
          </div>
          <div className="flex gap-3">
             <Button variant="secondary" className="rounded-2xl h-12 px-6 font-bold bg-white/10 hover:bg-white/20 text-white border-none shadow-xl backdrop-blur-md gap-2">
                <Download className="w-4 h-4" /> Export Audit
             </Button>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
         <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 p-1.5 rounded-2xl border border-slate-200 dark:border-white/5 w-full lg:w-fit overflow-x-auto no-scrollbar">
            {actionTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setActionFilter(type.value)}
                className={cn(
                  "px-5 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all whitespace-nowrap",
                  actionFilter === type.value 
                  ? "bg-white dark:bg-white/10 text-indigo-600 dark:text-white shadow-md" 
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                )}
              >
                {type.label}
              </button>
            ))}
         </div>
         <div className="w-full lg:w-96 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <Input 
              placeholder="Cari user, aksi, atau IP..." 
              className="pl-11 h-14 rounded-2xl bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 shadow-lg shadow-slate-200/20 dark:shadow-none focus:ring-indigo-500/20 font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
         </div>
      </div>

      {/* Log Feed */}
      <Card className="border-none shadow-2xl bg-white dark:bg-white/5 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 dark:bg-white/[0.02] border-b border-slate-100 dark:border-white/5">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Timestamp</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Operator</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Aksi</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Audit Trail</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Perangkat & IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5 relative">
                {loading && page === 1 ? (
                  <tr>
                    <td colSpan="5" className="px-8 py-32 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-10 h-10 animate-spin text-indigo-600/30" />
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Menganalisis Audit Trail...</p>
                      </div>
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-8 py-32 text-center">
                       <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200 dark:text-slate-800 border-4 border-slate-50 dark:border-slate-800/50 shadow-inner">
                          <ShieldCheck size="2x" />
                       </div>
                       <h4 className="text-lg font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">Sistem Bersih</h4>
                       <p className="text-slate-400 text-xs mt-2 font-medium">Belum ada aktivitas yang tercatat untuk filter ini.</p>
                    </td>
                  </tr>
                ) : (
                  logs.map((log, idx) => (
                    <tr key={log.id} className="group hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-all">
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                           <span className="text-[13px] font-bold text-slate-700 dark:text-slate-200">{dayjs(log.created_at).format('DD MMM YYYY')}</span>
                           <div className="flex items-center gap-1.5 text-[11px] font-black text-slate-400 uppercase mt-0.5">
                              <Clock className="w-3 h-3" />
                              <span>{dayjs(log.created_at).format('HH:mm:ss')}</span>
                           </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center border border-indigo-100/50 dark:border-indigo-500/20">
                              <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                           </div>
                           <div className="flex flex-col min-w-0">
                              <span className="text-[14px] font-black text-slate-800 dark:text-white truncate max-w-[150px] leading-tight">{log.user?.name || 'SYSTEM'}</span>
                              <Badge variant="outline" className="w-fit text-[9px] h-4 mt-1 border-slate-200 dark:border-white/10 uppercase tracking-widest text-slate-400 font-bold px-1.5 bg-slate-50 dark:bg-white/5">
                                 {log.user?.role || 'SYSTEM'}
                              </Badge>
                           </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center shrink-0">
                               {getActionIcon(log.action)}
                            </div>
                            <span className="text-[11px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">{log.action}</span>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                         <p className="text-[13px] font-medium text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm line-clamp-2" title={log.description}>
                            {log.description}
                         </p>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5 group-hover:border-indigo-500/20 transition-colors">
                               <span className="text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400">{log.ip_address}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-400" title={log.user_agent}>
                               {getDeviceIcon(log.user_agent)}
                            </div>
                         </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {hasMore && (
            <div className="p-8 flex justify-center border-t border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-transparent">
              <Button 
                onClick={() => fetchLogs(true)} 
                disabled={loading}
                variant="outline"
                className="rounded-2xl h-12 px-8 font-black uppercase tracking-widest text-[11px] border-slate-200 dark:border-white/10 bg-white dark:bg-transparent shadow-xl shadow-slate-200/20 dark:shadow-none hover:bg-slate-50 transition-all active:scale-95 gap-2"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Muat Lebih Banyak Audit'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

