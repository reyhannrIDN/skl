import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { notificationApi } from '@/api/notificationApi';
import { Bell, Check, Info, AlertTriangle, CheckCircle, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

export function NotificationBell() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const [{ data: countData }, { data: notifData }] = await Promise.all([
        notificationApi.getUnreadCount(),
        notificationApi.getNotifications({ limit: 5 })
      ]);
      setUnreadCount(countData.count || 0);
      setNotifications(notifData.data || []);
    } catch (error) {
      console.error('Gagal mengambil notifikasi', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const handleMarkAsRead = async (id, relatedId, e) => {
    e?.stopPropagation();
    try {
      await notificationApi.markAsRead(id);
      fetchNotifications();
      if (relatedId) {
        setIsOpen(false);
        // Navigate based on role for the related submission
        if (user?.role === 'siswa') navigate(`/siswa/submission/${relatedId}`);
        if (user?.role === 'guru') navigate(`/guru/submissions/${relatedId}`);
      }
    } catch (error) {
      toast.error('Gagal menandai dibaca');
    }
  };

  const handleMarkAllRead = async (e) => {
    e?.stopPropagation();
    try {
      await notificationApi.markAllAsRead();
      fetchNotifications();
      toast.success('Semua notifikasi ditandai dibaca');
    } catch (error) {
      toast.error('Gagal');
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'info': return <Info className="w-4 h-4 text-blue-500" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-warning" />;
      default: return <Package className="w-4 h-4 text-muted-foreground" />;
    }
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center transition-all hover:bg-slate-200 dark:hover:bg-white/10 group shadow-sm dark:shadow-none overflow-hidden"
        aria-label="Notifications"
      >
        <Bell className="w-4.5 h-4.5 text-amber-500 dark:text-amber-400 fill-amber-500/10 dark:fill-amber-400/20 group-hover:fill-amber-400/40 transition-all" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white shadow-lg border-2 border-white dark:border-[#0c0c20]">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-[#0c0c20]/95 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="p-5 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-white/5">
            <h3 className="font-black text-sm tracking-tight text-slate-900 dark:text-white uppercase tracking-widest">Notifikasi</h3>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllRead}
                className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors flex items-center gap-1"
              >
                <Check className="w-3 h-3" /> Tandai semua
              </button>
            )}
          </div>
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 dark:border-white/5">
                  <Bell className="w-8 h-8 text-slate-300 dark:text-white/20 animate-pulse" />
                </div>
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">Belum ada kabar baru</h4>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-1">Notifikasi Anda akan muncul di sini</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-white/5">
                {notifications.map(notif => (
                  <div 
                    key={notif.id} 
                    className={`p-5 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer flex gap-4 ${!notif.is_read ? 'bg-indigo-50/50 dark:bg-[#6d5bff]/5' : ''}`}
                    onClick={(e) => handleMarkAsRead(notif.id, notif.submission?.slug || notif.related_submission_id, e)}
                  >
                    <div className="mt-0.5 shrink-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${!notif.is_read ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-white/40'}`}>
                        {getIcon(notif.type)}
                      </div>
                    </div>
                    <div className="space-y-1 w-full">
                      <div className="flex justify-between gap-2 items-start">
                        <p className={`text-[13px] leading-snug ${!notif.is_read ? 'font-black text-slate-900 dark:text-white' : 'font-bold text-slate-600 dark:text-white/70'}`}>{notif.title}</p>
                        <span className="text-[9px] text-slate-400 dark:text-white/30 font-bold uppercase tracking-tighter whitespace-nowrap shrink-0">{dayjs(notif.created_at).fromNow()}</span>
                      </div>
                      <p className={`text-[11px] leading-relaxed line-clamp-2 ${!notif.is_read ? 'text-slate-600 dark:text-white/60 font-medium' : 'text-slate-400 dark:text-white/40'}`}>{notif.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="p-4 border-t border-slate-100 dark:border-white/5 text-center bg-slate-50/50 dark:bg-white/[0.02]">
            <button 
              className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-600 dark:text-white/40 dark:hover:text-amber-400 transition-all"
              onClick={() => { setIsOpen(false); navigate('/notifications'); }}
            >
              Lihat Semua Notifikasi
            </button>
          </div>
        </div>
      )}

      {/* Backdrop for mobile closing */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setIsOpen(false)}></div>
      )}
    </div>
  );
}
