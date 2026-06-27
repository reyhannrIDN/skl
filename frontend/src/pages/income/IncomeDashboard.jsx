import React, { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import { incomeApi, adminIncomeApi } from '@/api/incomeApi';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDollarSign, faReceipt, faUserCheck, faUserTimes,
  faSearch, faPlus, faFileExcel, faFilePdf,
  faEye, faHistory, faMoneyBillWave,
  faSchool, faTrophy, faChartLine,
  faSync, faChevronDown, faChevronUp
} from '@fortawesome/free-solid-svg-icons';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';
import { cn } from '@/utils/utils';
import toast from 'react-hot-toast';

export function IncomeDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'superadmin';
  const api = isAdmin ? adminIncomeApi : incomeApi;

  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [charts, setCharts] = useState(null);
  const [kelasList, setKelasList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [filterKelas, setFilterKelas] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterYear, setFilterYear] = useState(new Date().getFullYear().toString());

  const [showFilters, setShowFilters] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = { year: filterYear, month: filterMonth || undefined, kelas: filterKelas || undefined, search: search || undefined };
      const [statsRes, studentsRes, chartsRes] = await Promise.all([
        api.getDashboard(params),
        api.getStudents(params),
        api.getCharts({ year: filterYear, target: 10000000 }),
      ]);
      setStats(statsRes.data.stats);
      setStudents(studentsRes.data.students);
      setKelasList(studentsRes.data.kelas_list || []);
      setCharts(chartsRes.data);
    } catch (error) {
      toast.error('Gagal memuat data pendapatan');
    } finally {
      setLoading(false);
    }
  }, [filterYear, filterMonth, filterKelas, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleExport = async (type) => {
    try {
      const params = { year: filterYear, month: filterMonth || undefined, kelas: filterKelas || undefined };
      const res = type === 'excel' ? await api.exportExcel(params) : await api.exportPdf(params);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = type === 'excel' ? `pendapatan-${filterYear}.xlsx` : `pendapatan-${filterYear}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success(`${type === 'excel' ? 'Excel' : 'PDF'} berhasil diunduh`);
    } catch (error) {
      toast.error('Gagal mengekspor data');
    }
  };

  const formatRp = (val) => {
    if (val == null) return 'Rp 0';
    return 'Rp ' + Number(val).toLocaleString('id-ID');
  };

  const statCards = stats ? [
    { label: 'Total Pendapatan', value: formatRp(stats.total_income), icon: faMoneyBillWave, color: 'emerald', desc: 'Keseluruhan' },
    { label: 'Total Transaksi', value: stats.total_transactions, icon: faReceipt, color: 'indigo', desc: 'Semua transaksi' },
    { label: 'Siswa Membayar', value: stats.students_with_income, icon: faUserCheck, color: 'blue', desc: `Dari ${stats.total_students} siswa` },
    { label: 'Belum Membayar', value: stats.students_without_income, icon: faUserTimes, color: 'amber', desc: 'Belum ada transaksi' },
  ] : [];

  if (loading && !stats) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-500 animate-pulse">Memuat dashboard pendapatan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 animate-in fade-in duration-700 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-6">
        <div className="space-y-1 sm:space-y-2 w-full sm:w-auto">
          <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
            <FontAwesomeIcon icon={faDollarSign} className="text-indigo-500" />
            <span>Dashboard Pendapatan</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white font-display">
            Pendapatan <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Siswa</span>
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button onClick={() => handleExport('excel')}
            className="flex-1 sm:flex-none h-10 sm:h-12 px-3 sm:px-5 rounded-xl sm:rounded-2xl gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-bold border border-emerald-500/30 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all inline-flex items-center justify-center">
            <FontAwesomeIcon icon={faFileExcel} className="text-sm sm:text-base" />
            <span className="hidden xs:inline">Excel</span>
          </button>
          <button onClick={() => handleExport('pdf')}
            className="flex-1 sm:flex-none h-10 sm:h-12 px-3 sm:px-5 rounded-xl sm:rounded-2xl gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-bold border border-red-500/30 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all inline-flex items-center justify-center">
            <FontAwesomeIcon icon={faFilePdf} className="text-sm sm:text-base" />
            <span className="hidden xs:inline">PDF</span>
          </button>
          {!isAdmin && (
            <button onClick={() => navigate('/guru/income/input')}
              className="flex-1 sm:flex-none h-10 sm:h-12 px-4 sm:px-6 rounded-xl sm:rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold sm:font-black gap-1.5 sm:gap-2 shadow-lg shadow-indigo-500/30 text-[10px] sm:text-xs transition-all inline-flex items-center justify-center">
              <FontAwesomeIcon icon={faPlus} className="text-sm sm:text-base" />
              <span>Input</span>
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {statCards.map((stat, i) => (
          <Card key={i} className="border-none shadow-lg sm:shadow-xl bg-white dark:bg-white/5 backdrop-blur-xl group hover:scale-[1.02] lg:hover:scale-[1.03] transition-all duration-300">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex justify-between items-start gap-2">
                <div className="space-y-0.5 sm:space-y-1 min-w-0">
                  <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-slate-400 truncate">{stat.label}</p>
                  <h3 className="text-sm sm:text-base lg:text-2xl font-black text-slate-900 dark:text-white break-all sm:break-normal">{stat.value}</h3>
                </div>
                <div className={cn(
                  'w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:rotate-12',
                  stat.color === 'emerald' && 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600',
                  stat.color === 'indigo' && 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600',
                  stat.color === 'blue' && 'bg-blue-100 dark:bg-blue-500/20 text-blue-600',
                  stat.color === 'amber' && 'bg-amber-100 dark:bg-amber-500/20 text-amber-600',
                )}>
                  <FontAwesomeIcon icon={stat.icon} className="text-sm sm:text-base lg:text-xl" />
                </div>
              </div>
              <div className="mt-2 sm:mt-3 lg:mt-4 pt-2 sm:pt-3 lg:pt-4 border-t border-slate-50 dark:border-white/5 hidden sm:block">
                <p className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{stat.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      {charts && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          <Card className="border-none shadow-lg sm:shadow-xl bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-[2rem] overflow-hidden">
            <CardHeader className="p-4 sm:p-6 pb-0">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faChartLine} className="text-indigo-600 text-xs sm:text-sm" />
                <CardTitle className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">Per Bulan ({filterYear})</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-6">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={charts.monthly} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month_name" tick={{ fontSize: 9 }} interval={1} />
                  <YAxis tick={{ fontSize: 9 }} tickFormatter={(v) => (v / 1000000).toFixed(0) + 'jt'} width={40} />
                  <Tooltip formatter={(v) => formatRp(v)} />
                  <Bar dataKey="total" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg sm:shadow-xl bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-[2rem] overflow-hidden">
            <CardHeader className="p-4 sm:p-6 pb-0">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faSchool} className="text-purple-600 text-xs sm:text-sm" />
                <CardTitle className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">Per Kelas</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-6">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={charts.per_kelas} layout="vertical" margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 9 }} tickFormatter={(v) => (v / 1000000).toFixed(0) + 'jt'} />
                  <YAxis type="category" dataKey="kelas" tick={{ fontSize: 9 }} width={50} />
                  <Tooltip formatter={(v) => formatRp(v)} />
                  <Bar dataKey="total" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg sm:shadow-xl bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-[2rem] overflow-hidden">
            <CardHeader className="p-4 sm:p-6 pb-0">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faTrophy} className="text-amber-500 text-xs sm:text-sm" />
                <CardTitle className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">Top 10 Siswa</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-6">
              <div className="space-y-1.5 sm:space-y-2">
                {charts.top_students.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-lg sm:rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <div className={cn(
                      'w-5 h-5 sm:w-7 sm:h-7 rounded-md sm:rounded-lg flex items-center justify-center text-[8px] sm:text-[10px] font-black text-white shrink-0',
                      i === 0 ? 'bg-amber-500' : i === 1 ? 'bg-slate-400' : i === 2 ? 'bg-amber-700' : 'bg-slate-300'
                    )}>{i + 1}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] sm:text-sm font-bold text-slate-800 dark:text-white truncate">{s.name}</p>
                      <p className="text-[9px] sm:text-[10px] text-slate-400 truncate">{s.kelas} · {s.count} transaksi</p>
                    </div>
                    <span className="text-[11px] sm:text-sm font-black text-emerald-600 shrink-0">{formatRp(s.total)}</span>
                  </div>
                ))}
                {charts.top_students.length === 0 && (
                  <p className="text-sm text-slate-400 text-center py-8">Belum ada data</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg sm:shadow-xl bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-[2rem] overflow-hidden">
            <CardHeader className="p-4 sm:p-6 pb-0">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faChartLine} className="text-emerald-600 text-xs sm:text-sm" />
                <CardTitle className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">Target vs Realisasi ({filterYear})</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {(() => {
                const tvr = charts.target_vs_realization;
                return (
                  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                    <div className="relative w-28 h-28 sm:w-36 sm:h-36 lg:w-40 lg:h-40 shrink-0">
                      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" strokeWidth="4" />
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#6366f1" strokeWidth="4"
                          strokeDasharray={`${tvr.percentage}, 100`} strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <span className="text-xl sm:text-2xl font-black text-indigo-600">{tvr.percentage}%</span>
                        <span className="text-[8px] sm:text-[10px] text-slate-400 font-bold">Tercapai</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:gap-4 w-full sm:flex-1">
                      <div className="p-2 sm:p-3 bg-slate-50 dark:bg-white/5 rounded-lg sm:rounded-xl text-center">
                        <p className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase">Target</p>
                        <p className="text-xs sm:text-sm lg:text-lg font-black text-slate-800 dark:text-white break-all">{formatRp(tvr.target)}</p>
                      </div>
                      <div className="p-2 sm:p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg sm:rounded-xl text-center">
                        <p className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase">Realisasi</p>
                        <p className="text-xs sm:text-sm lg:text-lg font-black text-indigo-600 break-all">{formatRp(tvr.realization)}</p>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="border-none shadow-lg sm:shadow-xl bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-[2rem] overflow-hidden">
        <CardContent className="p-4 sm:p-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex sm:hidden items-center justify-between w-full text-xs font-bold text-slate-500 mb-2"
          >
            <span>Filter & Pencarian</span>
            <FontAwesomeIcon icon={showFilters ? faChevronUp : faChevronDown} />
          </button>
          <div className={cn('flex-col lg:flex-row gap-3 lg:gap-4 items-end', showFilters || 'hidden sm:flex sm:flex')}>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:flex lg:flex-1 gap-3 w-full">
              <div className="col-span-2 sm:col-span-4 lg:flex-1">
                <label className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Cari Nama</label>
                <div className="relative">
                  <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs sm:text-sm" />
                  <input
                    type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari siswa..."
                    className="w-full h-9 sm:h-11 pl-9 pr-3 rounded-lg sm:rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Kelas</label>
                <select value={filterKelas} onChange={(e) => setFilterKelas(e.target.value)}
                  className="w-full h-9 sm:h-11 px-2 sm:px-4 rounded-lg sm:rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all">
                  <option value="">Semua</option>
                  {kelasList.map((k) => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Bulan</label>
                <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}
                  className="w-full h-9 sm:h-11 px-2 sm:px-4 rounded-lg sm:rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all">
                  <option value="">Semua</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('id', { month: 'short' })}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Tahun</label>
                <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)}
                  className="w-full h-9 sm:h-11 px-2 sm:px-4 rounded-lg sm:rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all">
                  {[2024, 2025, 2026, 2027].map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>
            <button onClick={fetchData} className="w-full lg:w-auto h-9 sm:h-11 px-4 sm:px-5 rounded-lg sm:rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2 text-xs sm:text-sm transition-all inline-flex items-center justify-center">
              <FontAwesomeIcon icon={faSync} /> Terapkan
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card className="border-none shadow-lg sm:shadow-2xl bg-white dark:bg-white/5 backdrop-blur-xl rounded-2xl sm:rounded-[2rem] overflow-hidden">
        <CardHeader className="p-4 sm:p-6 border-b border-slate-50 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 sm:w-1.5 sm:h-8 bg-indigo-600 rounded-full" />
            <div>
              <CardTitle className="text-sm sm:text-lg font-black tracking-tight text-slate-900 dark:text-white">Data Pendapatan Siswa</CardTitle>
              <p className="text-[10px] sm:text-xs font-bold text-slate-400 mt-0.5 sm:mt-1">{students.length} siswa</p>
            </div>
          </div>
        </CardHeader>

        {/* Mobile: Card view */}
        <div className="block sm:hidden divide-y divide-slate-100 dark:divide-white/5">
          {students.map((s) => (
            <div key={s.id} className="p-4 space-y-2 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-[10px] shrink-0">
                    {s.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-bold text-sm text-slate-800 dark:text-white truncate">{s.name}</span>
                </div>
                <span className="font-black text-emerald-600 text-sm">{formatRp(s.total_income)}</span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded font-bold">{s.kelas || '-'}</span>
                  <span>{s.transaction_count}x transaksi</span>
                </div>
                <span>{s.last_date ? new Date(s.last_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-'}</span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button onClick={() => navigate(isAdmin ? `/admin/income/detail/${s.id}` : `/guru/income/detail/${s.id}`)}
                  className="flex-1 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 font-bold text-[10px] transition-colors hover:bg-indigo-100">Detail</button>
                <button onClick={() => navigate(isAdmin ? `/admin/income/detail/${s.id}` : `/guru/income/detail/${s.id}`)}
                  className="flex-1 h-8 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-600 font-bold text-[10px] transition-colors hover:bg-amber-100">Riwayat</button>
                {!isAdmin && (
                  <button onClick={() => navigate(`/guru/income/input?student_id=${s.id}`)}
                    className="flex-1 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 font-bold text-[10px] transition-colors hover:bg-emerald-100">Tambah</button>
                )}
              </div>
            </div>
          ))}
          {students.length === 0 && (
            <div className="p-8 text-center text-sm text-slate-400">Belum ada data pendapatan</div>
          )}
        </div>

        {/* Desktop: Table view */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
                <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Nama Siswa</th>
                <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Kelas</th>
                <th className="text-right p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Total Pendapatan</th>
                <th className="text-center p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Transaksi</th>
                <th className="text-right p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Terakhir</th>
                <th className="text-center p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-white/5">
              {students.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-xs shrink-0">
                        {s.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-bold text-slate-800 dark:text-white truncate max-w-[200px]">{s.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-white/5 px-2 py-1 rounded-lg">{s.kelas || '-'}</span>
                  </td>
                  <td className="p-4 text-right">
                    <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">{formatRp(s.total_income)}</span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="text-xs font-bold text-slate-500">{s.transaction_count}x</span>
                  </td>
                  <td className="p-4 text-right whitespace-nowrap">
                    <span className="text-xs font-bold text-slate-500">{s.last_date ? new Date(s.last_date).toLocaleDateString('id-ID') : '-'}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => navigate(isAdmin ? `/admin/income/detail/${s.id}` : `/guru/income/detail/${s.id}`)}
                        className="p-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-indigo-600 transition-colors" title="Detail">
                        <FontAwesomeIcon icon={faEye} className="text-sm" />
                      </button>
                      <button onClick={() => navigate(isAdmin ? `/admin/income/detail/${s.id}` : `/guru/income/detail/${s.id}`)}
                        className="p-1.5 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-500/10 text-amber-600 transition-colors" title="Riwayat">
                        <FontAwesomeIcon icon={faHistory} className="text-sm" />
                      </button>
                      {!isAdmin && (
                        <button onClick={() => navigate(`/guru/income/input?student_id=${s.id}`)}
                          className="p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-emerald-600 transition-colors" title="Tambah Pendapatan">
                          <FontAwesomeIcon icon={faPlus} className="text-sm" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-sm text-slate-400">Belum ada data pendapatan</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
