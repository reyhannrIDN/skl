import React, { useEffect, useState, useCallback } from 'react';
import { lombaApi } from '@/api/lombaApi';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import {
  Trophy, Search, Plus, Filter, Download, FileSpreadsheet, FileText,
  Printer, Eye, Edit, Trash2, Image as ImageIcon, Loader2,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const tingkatLabels = { sekolah: 'Sekolah', kecamatan: 'Kecamatan', kabupaten: 'Kabupaten', provinsi: 'Provinsi', nasional: 'Nasional', internasional: 'Internasional' };
const statusLabels = { belum_ada_hasil: 'Belum Ada Hasil', juara: 'Juara', tidak_juara: 'Tidak Juara' };
const statusColors = { belum_ada_hasil: 'bg-slate-100 text-slate-600 dark:bg-slate-700', juara: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300', tidak_juara: 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-300' };
const tingkatColors = { sekolah: 'bg-slate-100 text-slate-600', kecamatan: 'bg-blue-100 text-blue-700', kabupaten: 'bg-indigo-100 text-indigo-700', provinsi: 'bg-purple-100 text-purple-700', nasional: 'bg-amber-100 text-amber-700', internasional: 'bg-emerald-100 text-emerald-700' };

export function LombaList() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, lastPage: 1 });
  const [filters, setFilters] = useState({ search: '', tahun: '', bulan: '', tingkat: '', status: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [exporting, setExporting] = useState(null);

  const canEdit = user?.role === 'superadmin' || user?.role === 'idn';

  const fetchData = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, per_page: 15, ...filters };
      Object.keys(params).forEach(k => { if (!params[k]) delete params[k]; });
      const { data: res } = await lombaApi.getList(params);
      setData(res.data || []);
      setPagination({ currentPage: res.current_page, lastPage: res.last_page });
    } catch { toast.error('Gagal memuat data'); } finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (id) => {
    if (!confirm('Hapus lomba ini?')) return;
    try {
      await lombaApi.delete(id);
      toast.success('Lomba berhasil dihapus');
      fetchData();
    } catch { toast.error('Gagal menghapus'); }
  };

  const handleExport = async (type) => {
    setExporting(type);
    try {
      const params = { ...filters };
      Object.keys(params).forEach(k => { if (!params[k]) delete params[k]; });
      const fn = type === 'excel' ? lombaApi.exportExcel : lombaApi.exportPdf;
      const { data: blob } = await fn(params);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `data-lomba.${type === 'excel' ? 'xlsx' : 'pdf'}`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`Berhasil export ${type.toUpperCase()}`);
    } catch { toast.error('Gagal export'); } finally { setExporting(null); }
  };

  const handlePrint = () => window.print();

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-16">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <Trophy className="w-4 h-4 text-indigo-500" />
            <span>Pendataan Lomba</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white font-display">
            Data Lomba
          </h1>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1">
            <Button onClick={() => handleExport('excel')} disabled={exporting} variant="outline" className="h-10 px-3 rounded-xl gap-2 text-xs font-bold">
              {exporting === 'excel' ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4" />} Excel
            </Button>
            <Button onClick={() => handleExport('pdf')} disabled={exporting} variant="outline" className="h-10 px-3 rounded-xl gap-2 text-xs font-bold">
              {exporting === 'pdf' ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />} PDF
            </Button>
            <Button onClick={handlePrint} variant="outline" className="h-10 px-3 rounded-xl gap-2 text-xs font-bold">
              <Printer className="w-4 h-4" /> Print
            </Button>
          </div>
          {canEdit && (
            <Button onClick={() => navigate('/lomba/create')} className="h-12 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black gap-2 shadow-xl shadow-indigo-500/30">
              <Plus className="w-4 h-4" /> Tambah Lomba
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card className="border-none shadow-xl rounded-2xl">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" value={filters.search} onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
                placeholder="Cari lomba..." className="w-full h-10 pl-10 pr-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20" />
            </div>
            <Button onClick={() => setShowFilters(!showFilters)} variant="outline" className="h-10 px-4 rounded-xl gap-2 text-xs font-bold">
              <Filter className="w-4 h-4" /> Filter
            </Button>
          </div>
          {showFilters && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-slate-100 dark:border-white/5">
              <select value={filters.tahun} onChange={e => setFilters(f => ({ ...f, tahun: e.target.value }))}
                className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 text-sm outline-none">
                <option value="">Semua Tahun</option>
                {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <select value={filters.bulan} onChange={e => setFilters(f => ({ ...f, bulan: e.target.value }))}
                className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 text-sm outline-none">
                <option value="">Semua Bulan</option>
                {['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'].map((b, i) => <option key={i} value={i + 1}>{b}</option>)}
              </select>
              <select value={filters.tingkat} onChange={e => setFilters(f => ({ ...f, tingkat: e.target.value }))}
                className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 text-sm outline-none">
                <option value="">Semua Tingkat</option>
                {Object.entries(tingkatLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <select value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
                className="h-10 px-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 text-sm outline-none">
                <option value="">Semua Status</option>
                <option value="juara">Juara</option>
                <option value="belum_juara">Belum Juara</option>
              </select>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-none shadow-xl rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/50">
                <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Nama Lomba</th>
                <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Tingkat</th>
                <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Lokasi</th>
                <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Tanggal</th>
                <th className="text-center p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Tim</th>
                <th className="text-center p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Peserta</th>
                <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Pendamping</th>
                <th className="text-center p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Hasil</th>
                <th className="text-center p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Foto</th>
                <th className="text-center p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-white/5">
              {loading ? (
                <tr><td colSpan={10} className="p-12 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-600" /></td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={10} className="p-12 text-center text-sm text-slate-400">Belum ada data lomba</td></tr>
              ) : data.map(l => (
                <tr key={l.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                  <td className="p-4"><span className="font-bold text-slate-800 dark:text-slate-200">{l.nama_lomba}</span></td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${tingkatColors[l.tingkat] || ''}`}>
                      {tingkatLabels[l.tingkat] || l.tingkat}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-slate-500">{l.lokasi}</td>
                  <td className="p-4 text-xs text-slate-500">{l.tanggal_mulai || '-'}</td>
                  <td className="p-4 text-center font-bold text-slate-700">{l.total_tim}</td>
                  <td className="p-4 text-center font-bold text-slate-700">{l.total_peserta}</td>
                  <td className="p-4 text-xs text-slate-500 max-w-[150px] truncate">{l.pendamping || '-'}</td>
                  <td className="p-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${statusColors[l.status_hasil] || ''}`}>
                      {l.status_hasil === 'juara' ? `Juara ${l.juara_ke?.replace('_', ' ')}` : statusLabels[l.status_hasil] || '-'}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    {l.total_foto > 0 ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600">
                        <ImageIcon className="w-3 h-3" /> {l.total_foto}
                      </span>
                    ) : <span className="text-xs text-slate-300">-</span>}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => navigate(`/lomba/${l.id}`)} className="p-2 rounded-lg hover:bg-indigo-50 text-indigo-600 transition-colors" title="Detail">
                        <Eye className="w-4 h-4" />
                      </button>
                      {canEdit && (
                        <>
                          <button onClick={() => navigate(`/lomba/${l.id}/edit`)} className="p-2 rounded-lg hover:bg-amber-50 text-amber-600 transition-colors" title="Edit">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(l.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors" title="Hapus">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {pagination.lastPage > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-slate-100">
            <span className="text-xs text-slate-400">Halaman {pagination.currentPage} dari {pagination.lastPage}</span>
            <div className="flex gap-2">
              <button disabled={pagination.currentPage <= 1} onClick={() => fetchData(pagination.currentPage - 1)}
                className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button>
              <button disabled={pagination.currentPage >= pagination.lastPage} onClick={() => fetchData(pagination.currentPage + 1)}
                className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
