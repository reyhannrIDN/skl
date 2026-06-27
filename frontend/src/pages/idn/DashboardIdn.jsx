import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { idnApi } from '@/api/idnApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Users, GraduationCap, UsersRound, Building2, School, ArrowRight, Calendar, Loader2, MapPin, UserCheck, TrendingUp, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

export function DashboardIdn() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const { data: res } = await idnApi.getDashboard();
      setData(res);
    } catch (err) {
      toast.error('Gagal memuat dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  const maxAudience = Math.max(...(data?.schools?.map(s => s.total_audience) || [1]), 1);

  const stats = [
    { label: 'Total Siswa', value: data?.total_students ?? 0, icon: Users, color: 'from-blue-600 to-blue-700', light: 'from-blue-50 to-blue-100 dark:from-blue-950/40 dark:to-blue-900/20', textColor: 'text-blue-600 dark:text-blue-400', href: '/idn/students' },
    { label: 'Total Sekolah', value: data?.total_schools ?? 0, icon: Building2, color: 'from-emerald-600 to-emerald-700', light: 'from-emerald-50 to-emerald-100 dark:from-emerald-950/40 dark:to-emerald-900/20', textColor: 'text-emerald-600 dark:text-emerald-400', href: '/idn/school-visits' },
    { label: 'Total Tim', value: data?.total_teams ?? 0, icon: UsersRound, color: 'from-violet-600 to-violet-700', light: 'from-violet-50 to-violet-100 dark:from-violet-950/40 dark:to-violet-900/20', textColor: 'text-violet-600 dark:text-violet-400' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight text-primary">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Selamat datang kembali, <span className="font-semibold text-foreground">{user?.name}</span></p>
        </div>
        <Badge variant="outline" className="gap-1.5 py-1.5 px-3 text-xs font-semibold">
          <Calendar className="w-3.5 h-3.5" /> {dayjs().format('dddd, DD MMM YYYY')}
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.label}
              onClick={() => s.href && navigate(s.href)}
              className="group relative overflow-hidden rounded-2xl border bg-card p-6 text-left shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${s.light} opacity-50`} />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-4xl font-black tracking-tight">{s.value}</span>
                </div>
                <p className="text-sm font-semibold text-muted-foreground">{s.label}</p>
                {s.href && (
                  <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Lihat detail <ChevronRight className="w-3 h-3" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3">
          <CardHeader className="pb-4 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" /> Audience per Sekolah
              </CardTitle>
              <Badge variant="secondary" className="text-[10px]">{data?.schools?.length || 0} sekolah</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-5">
            {data?.schools?.length > 0 ? (
              <div className="space-y-4">
                {data.schools.map((s, idx) => (
                  <div key={s.school_name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground shrink-0">{idx + 1}</span>
                        <span className="font-medium truncate">{s.school_name}</span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 ml-3">
                        <Badge variant="outline" className="text-[10px] font-normal gap-1">
                          <MapPin className="w-3 h-3" /> {s.visit_count}x
                        </Badge>
                        <span className="font-bold text-sm tabular-nums">{s.total_audience.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-indigo-500 transition-all duration-700"
                        style={{ width: `${(s.total_audience / maxAudience) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Building2 className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground italic">Belum ada data kunjungan.</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate('/idn/school-visits')}>
                  Tambah Kunjungan
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-4 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" /> Kunjungan Terbaru
              </CardTitle>
              {data?.recent_visits?.length > 0 && (
                <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 px-2" onClick={() => navigate('/idn/school-visits')}>
                  Semua <ArrowRight className="w-3 h-3" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {data?.recent_visits?.length > 0 ? (
              <div className="space-y-2">
                {data.recent_visits.map((v) => (
                  <div key={v.id} className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => navigate('/idn/school-visits')}>
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center shrink-0">
                      <School className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{v.school_name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="outline" className="text-[9px] font-normal h-4">{v.team_name}</Badge>
                        {v.visit_date && (
                          <span className="text-[10px] text-muted-foreground">{dayjs(v.visit_date).format('DD MMM')}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-primary">{v.total_audience}</p>
                      <p className="text-[9px] text-muted-foreground uppercase tracking-wider">audiens</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground italic">Belum ada kunjungan.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-4 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" /> Siswa Terdaftar
            </CardTitle>
            {data?.recent_students?.length > 0 && (
              <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 px-2" onClick={() => navigate('/idn/students')}>
                Kelola Siswa <ArrowRight className="w-3 h-3" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-5">
          {data?.recent_students?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
              {data.recent_students.map((s) => (
                <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 border border-transparent hover:border-border transition-all">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-indigo-500/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                    {s.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate">{s.name}</p>
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      {s.school && <span className="truncate">{s.school}</span>}
                      {s.kelas && <><span>•</span><span>Kelas {s.kelas}</span></>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground italic">Belum ada siswa terdaftar.</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate('/idn/students')}>
                Tambah Siswa
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
