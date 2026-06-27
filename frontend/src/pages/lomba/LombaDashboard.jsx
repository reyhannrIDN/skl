import React, { useEffect, useState } from 'react';
import { lombaApi } from '@/api/lombaApi';
import { Card, CardContent } from '@/components/common/Card';
import {
  Trophy, Users, Users2, GraduationCap, Medal,
  BarChart3, TrendingUp, LayoutDashboard
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const bulanIndo = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

export function LombaDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    lombaApi.getDashboard().then(({ data }) => setData(data))
      .catch(() => toast.error('Gagal memuat dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex h-80 items-center justify-center"><BarChart3 className="w-8 h-8 text-indigo-600 animate-pulse" /></div>;
  if (!data) return null;

  const stats = [
    { label: 'Total Lomba', value: data.stats.totalLomba, icon: Trophy, color: 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600' },
    { label: 'Total Peserta', value: data.stats.totalPeserta, icon: Users, color: 'bg-blue-100 dark:bg-blue-500/20 text-blue-600' },
    { label: 'Total Tim', value: data.stats.totalTim, icon: Users2, color: 'bg-purple-100 dark:bg-purple-500/20 text-purple-600' },
    { label: 'Total Pendamping', value: data.stats.totalPendamping, icon: GraduationCap, color: 'bg-amber-100 dark:bg-amber-500/20 text-amber-600' },
    { label: 'Total Juara', value: data.stats.totalJuara, icon: Medal, color: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600' },
    { label: '% Juara', value: `${data.stats.persentaseJuara}%`, icon: TrendingUp, color: 'bg-rose-100 dark:bg-rose-500/20 text-rose-600' },
  ];

  const maxBulan = Math.max(...data.perBulan.map(b => Math.max(b.total, b.juara)), 1);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-16">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <LayoutDashboard className="w-4 h-4 text-indigo-500" />
          <span>Dashboard</span>
        </div>
        <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white font-display">
          Pendataan Lomba
        </h1>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((s, i) => (
          <Card key={i} className="border-none shadow-xl rounded-2xl overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center`}>
                  <s.icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{s.value}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-xl rounded-2xl">
          <CardContent className="p-6">
            <h3 className="font-black text-slate-900 dark:text-white mb-4">Lomba & Juara per Bulan</h3>
            <div className="flex items-end gap-2 h-48">
              {data.perBulan.map((b, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  <div className="w-full flex flex-col items-center gap-0.5" style={{ height: `${(Math.max(b.total, 1) / maxBulan) * 100}%` }}>
                    <div className="w-full bg-indigo-500 rounded-t" style={{ height: `${(b.total / Math.max(b.total, 1)) * 50}%` }} title={`${b.total} lomba`} />
                    {b.juara > 0 && <div className="w-full bg-emerald-400 rounded-t" style={{ height: `${(b.juara / Math.max(b.total, 1)) * 50}%` }} title={`${b.juara} juara`} />}
                  </div>
                  <span className="text-[9px] font-bold text-slate-400">{bulanIndo[b.bulan - 1]}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-4 text-xs text-slate-500">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-indigo-500" /> Lomba</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-400" /> Juara</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl rounded-2xl">
          <CardContent className="p-6">
            <h3 className="font-black text-slate-900 dark:text-white mb-4">Berdasarkan Tingkat</h3>
            <div className="space-y-3">
              {Object.entries(data.perTingkat).map(([tingkat, total]) => {
                const maxVal = Math.max(...Object.values(data.perTingkat), 1);
                const pct = (total / maxVal) * 100;
                const colors = { sekolah: 'bg-slate-400', kecamatan: 'bg-blue-400', kabupaten: 'bg-indigo-400', provinsi: 'bg-purple-400', nasional: 'bg-amber-400', internasional: 'bg-emerald-400' };
                return (
                  <div key={tingkat}>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="capitalize text-slate-700 dark:text-slate-300">{tingkat}</span>
                      <span className="text-slate-400">{total}</span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${colors[tingkat] || 'bg-indigo-400'}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
