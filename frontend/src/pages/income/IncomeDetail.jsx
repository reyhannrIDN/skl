import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { incomeApi, adminIncomeApi } from '@/api/incomeApi';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft, faMoneyBillWave, faUser, faEdit, faTrash,
  faHistory, faCalendarAlt, faPlus, faImage, faTimes
} from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/utils/utils';
import toast from 'react-hot-toast';

export function IncomeDetail() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { studentId } = useParams();
  const isAdmin = user?.role === 'superadmin';
  const api = isAdmin ? adminIncomeApi : incomeApi;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ amount: '', transaction_date: '', description: '' });
  const [lightbox, setLightbox] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.getTransactions(studentId);
      setData(res.data);
    } catch (error) {
      toast.error('Gagal memuat data');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [studentId]);

  const startEdit = (tx) => {
    setEditId(tx.id);
    setEditForm({
      amount: tx.amount.toString(),
      transaction_date: tx.transaction_date,
      description: tx.description || '',
    });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditForm({ amount: '', transaction_date: '', description: '' });
  };

  const saveEdit = async (id) => {
    if (!editForm.amount || parseFloat(editForm.amount) <= 0) return toast.error('Nominal harus valid');
    try {
      await incomeApi.updateTransaction(id, {
        amount: parseFloat(editForm.amount),
        transaction_date: editForm.transaction_date,
        description: editForm.description || null,
      });
      toast.success('Transaksi berhasil diperbarui');
      cancelEdit();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal memperbarui');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus transaksi ini? Total pendapatan akan dihitung ulang.')) return;
    try {
      await incomeApi.deleteTransaction(id);
      toast.success('Transaksi berhasil dihapus');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menghapus');
    }
  };

  const formatRp = (val) => {
    if (val == null) return 'Rp 0';
    return 'Rp ' + Number(val).toLocaleString('id-ID');
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-500 animate-pulse">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-16">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <FontAwesomeIcon icon={faUser} className="text-indigo-500" />
            <span>Detail Siswa</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white font-display">
            {data?.student?.name}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {!isAdmin && (
            <Button onClick={() => navigate(`/guru/income/input?student_id=${studentId}`)}
              className="h-12 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black gap-2 shadow-xl shadow-indigo-500/30">
              <FontAwesomeIcon icon={faPlus} /> Tambah
            </Button>
          )}
          <Button onClick={() => navigate(-1)} variant="outline" className="h-12 px-5 rounded-2xl gap-2 text-xs font-bold">
            <FontAwesomeIcon icon={faArrowLeft} /> Kembali
          </Button>
        </div>
      </div>

      {/* Student Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-xl bg-white dark:bg-white/5 backdrop-blur-xl rounded-[2rem] overflow-hidden">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 text-xl">
              <FontAwesomeIcon icon={faUser} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nama</p>
              <p className="font-black text-slate-900 dark:text-white">{data?.student?.name}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-xl bg-white dark:bg-white/5 backdrop-blur-xl rounded-[2rem] overflow-hidden">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center text-purple-600 text-xl">
              <FontAwesomeIcon icon={faHistory} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kelas / NIS</p>
              <p className="font-black text-slate-900 dark:text-white">{data?.student?.kelas || '-'} / {data?.student?.nis || '-'}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-xl bg-emerald-50 dark:bg-emerald-500/10 rounded-[2rem] overflow-hidden">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 text-xl">
              <FontAwesomeIcon icon={faMoneyBillWave} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Total Pendapatan</p>
              <p className="font-black text-emerald-700 dark:text-emerald-300 text-2xl">{formatRp(data?.total_income)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card className="border-none shadow-2xl bg-white dark:bg-white/5 backdrop-blur-xl rounded-[2rem] overflow-hidden">
        <CardHeader className="p-6 border-b border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-8 bg-indigo-600 rounded-full" />
            <div>
              <CardTitle className="text-lg font-black tracking-tight text-slate-900 dark:text-white">Riwayat Transaksi</CardTitle>
              <p className="text-xs font-bold text-slate-400 mt-1">{data?.transactions?.length || 0} transaksi</p>
            </div>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
                <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Tanggal</th>
                <th className="text-right p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Nominal</th>
                <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Keterangan</th>
                <th className="text-center p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Bukti</th>
                <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Input Oleh</th>
                {!isAdmin && <th className="text-center p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-white/5">
              {data?.transactions?.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                  {editId === tx.id ? (
                    <>
                      <td className="p-4">
                        <input type="date" value={editForm.transaction_date}
                          onChange={(e) => setEditForm({ ...editForm, transaction_date: e.target.value })}
                          className="w-full h-10 px-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                      </td>
                      <td className="p-4">
                        <input type="number" value={editForm.amount}
                          onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                          className="w-full h-10 px-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 text-xs font-bold text-right focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                      </td>
                      <td className="p-4">
                        <input type="text" value={editForm.description}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          placeholder="Keterangan"
                          className="w-full h-10 px-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                      </td>
                      <td className="p-4 text-center text-[10px] text-slate-400">
                        {tx.file_url ? 'Ada' : '-'}
                      </td>
                      <td className="p-4 text-xs text-slate-500">{tx.input_by_name}</td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => saveEdit(tx.id)}
                            className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors">Simpan</button>
                          <button onClick={cancelEdit}
                            className="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-300 transition-colors">Batal</button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <FontAwesomeIcon icon={faCalendarAlt} className="text-slate-300 text-xs" />
                          <span className="font-bold text-slate-700 dark:text-slate-300">{new Date(tx.transaction_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <span className="font-black text-emerald-600 dark:text-emerald-400">{formatRp(tx.amount)}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-xs text-slate-500">{tx.description || '-'}</span>
                      </td>
                      <td className="p-4 text-center">
                        {tx.file_url ? (
                          <button onClick={() => setLightbox(tx.file_url)}
                            className="w-10 h-10 mx-auto rounded-xl bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 flex items-center justify-center transition-colors group"
                            title="Lihat bukti">
                            <FontAwesomeIcon icon={faImage} className="text-indigo-400 group-hover:scale-110 transition-transform" />
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-300 dark:text-slate-600">-</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="text-xs text-slate-400">{tx.input_by_name || '-'}</span>
                      </td>
                      {!isAdmin && (
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => startEdit(tx)}
                              className="p-2 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-500/10 text-amber-600 transition-colors" title="Edit">
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <button onClick={() => handleDelete(tx.id)}
                              className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 transition-colors" title="Hapus">
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </div>
                        </td>
                      )}
                    </>
                  )}
                </tr>
              ))}
              {(!data?.transactions || data.transactions.length === 0) && (
                <tr>
                  <td colSpan={isAdmin ? '5' : '6'} className="p-12 text-center text-sm text-slate-400">
                    Belum ada transaksi pendapatan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Lightbox for proof photo */}
      {lightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setLightbox(null)}>
          <div className="relative max-w-3xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setLightbox(null)}
              className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center text-slate-600 hover:text-red-500 transition-colors z-10">
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <img
              src={lightbox}
              alt="Bukti Pembayaran"
              className="w-full h-auto max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
