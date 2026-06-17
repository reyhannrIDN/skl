import React, { useEffect, useState } from 'react';
import { notificationApi } from '@/api/notificationApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Check, CheckCircle2, AlertTriangle, Info, Package, Loader2 } from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import toast from 'react-hot-toast';

dayjs.extend(relativeTime);

export function NotificationList() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const { data } = await notificationApi.getNotifications({ per_page: 50 });
      setNotifications(data.data || []);
    } catch (error) {
      toast.error('Gagal mengambil riwayat notifikasi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationApi.markAsRead(id);
      fetchNotifications();
    } catch (error) {
      toast.error('Gagal menandai dbaca');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      fetchNotifications();
      toast.success('Semua ditandai dibaca');
    } catch (error) {
      toast.error('Gagal');
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'info': return <Info className="w-5 h-5 text-blue-500" />;
      case 'success': return <CheckCircle2 className="w-5 h-5 text-success" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-warning" />;
      default: return <Package className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight text-primary flex items-center gap-3">
            Pusat Notifikasi 
            {unreadCount > 0 && <Badge variant="destructive" className="rounded-full px-2">{unreadCount} Baru</Badge>}
          </h1>
          <p className="text-muted-foreground mt-1">Semua pemberitahuan sistem untuk Anda.</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={handleMarkAllRead} className="gap-2">
            <Check className="w-4 h-4" /> Tandai Semua Dibaca
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y relative min-h-[300px]">
            {loading ? (
              <div className="py-20 text-center flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                <p className="text-sm text-muted-foreground">Memuat Notifikasi...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-20 text-center">
                <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">Tidak ada notifikasi untuk Anda saat ini.</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={`p-5 hover:bg-muted/30 transition-colors flex gap-4 ${!notif.is_read ? 'bg-primary/5' : ''}`}
                >
                  <div className="shrink-0 mt-1">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start gap-4">
                      <h4 className={`text-base ${!notif.is_read ? 'font-semibold text-primary' : 'font-medium'}`}>
                        {notif.title}
                      </h4>
                      <span className="text-xs text-muted-foreground shrink-0 whitespace-nowrap">
                        {dayjs(notif.created_at).format('DD MMM YYYY, HH:mm')}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {notif.message}
                    </p>
                    
                    {!notif.is_read && (
                       <div className="pt-2">
                         <Button variant="ghost" size="sm" onClick={() => handleMarkAsRead(notif.id)} className="h-7 text-xs -ml-3 text-primary hover:text-primary">
                           Tandai dibaca
                         </Button>
                       </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
