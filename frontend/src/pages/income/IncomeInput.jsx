import React, { useEffect, useState, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';
import { incomeApi } from '@/api/incomeApi';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faSave, faArrowLeft, faMoneyBillWave, faUser, faCalendarAlt, faSpinner, faCamera, faTrash, faImage } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';

export function IncomeInput() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const preselectedStudent = searchParams.get('student_id');
  const fileInputRef = useRef(null);

  const [students, setStudents] = useState([]);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    user_id: preselectedStudent || '',
    amount: '',
    transaction_date: new Date().toISOString().split('T')[0],
    description: '',
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    incomeApi.getStudents().then(res => {
      setStudents(res.data.students || []);
    }).catch(() => toast.error('Gagal memuat data siswa'));
  }, []);

  const handleFileSelect = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(f);
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.user_id) return toast.error('Pilih siswa terlebih dahulu');
    if (!form.amount || parseFloat(form.amount) <= 0) return toast.error('Nominal harus diisi dan lebih dari 0');
    if (!form.transaction_date) return toast.error('Pilih tanggal transaksi');

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('user_id', form.user_id);
      fd.append('amount', form.amount);
      fd.append('transaction_date', form.transaction_date);
      if (form.description) fd.append('description', form.description);
      if (file) fd.append('file', file);

      await incomeApi.createTransaction(fd);
      toast.success('Pendapatan berhasil ditambahkan');
      setForm({ user_id: form.user_id, amount: '', transaction_date: new Date().toISOString().split('T')[0], description: '' });
      removeFile();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menyimpan data');
    } finally {
      setSaving(false);
    }
  };

  const selectedStudent = students.find(s => s.id === parseInt(form.user_id));

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-16">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <FontAwesomeIcon icon={faDollarSign} className="text-indigo-500" />
            <span>Input Pendapatan</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white font-display">
            Tambah Pendapatan
          </h1>
        </div>
        <Button onClick={() => navigate(-1)} variant="outline" className="h-12 px-5 rounded-2xl gap-2 text-xs font-bold">
          <FontAwesomeIcon icon={faArrowLeft} /> Kembali
        </Button>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card className="border-none shadow-2xl bg-white dark:bg-white/5 backdrop-blur-xl rounded-[2rem] overflow-hidden">
          <CardHeader className="p-6 border-b border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600">
                <FontAwesomeIcon icon={faMoneyBillWave} />
              </div>
              <div>
                <CardTitle className="text-lg font-black text-slate-900 dark:text-white">Form Pendapatan</CardTitle>
                <p className="text-xs text-slate-400 font-medium">Isi data pendapatan siswa dengan benar</p>
              </div>
            </div>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <FontAwesomeIcon icon={faUser} className="text-indigo-500" /> Pilih Siswa
                </label>
                <select
                  value={form.user_id}
                  onChange={(e) => setForm({ ...form, user_id: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                  required
                >
                  <option value="">-- Pilih Siswa --</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.kelas || '-'})</option>
                  ))}
                </select>
                {selectedStudent && (
                  <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 bg-indigo-50 dark:bg-indigo-500/10 p-2 rounded-lg">
                    <span className="font-bold">Total saat ini:</span>
                    <span className="font-black text-emerald-600">Rp {Number(selectedStudent.total_income).toLocaleString('id-ID')}</span>
                    <span className="text-slate-300 mx-1">|</span>
                    <span>{selectedStudent.transaction_count} transaksi</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <FontAwesomeIcon icon={faCalendarAlt} className="text-indigo-500" /> Tanggal
                </label>
                <input
                  type="date"
                  value={form.transaction_date}
                  onChange={(e) => setForm({ ...form, transaction_date: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nominal Pendapatan (Rp)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">Rp</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={form.amount ? Number(form.amount).toLocaleString('id-ID') : ''}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\./g, '').replace(/\D/g, '');
                      setForm({ ...form, amount: raw });
                    }}
                    placeholder="0"
                    className="w-full h-12 pl-12 pr-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Keterangan (opsional)</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Contoh: Pembayaran SPP Bulan Juli"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-none"
                />
              </div>

              {/* Upload Bukti */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <FontAwesomeIcon icon={faImage} className="text-indigo-500" /> Bukti Pembayaran (opsional)
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative w-full border-2 border-dashed border-slate-300 dark:border-white/20 rounded-xl p-4 sm:p-6 cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors group"
                >
                  {preview ? (
                    <div className="relative">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full max-h-48 sm:max-h-64 object-contain rounded-lg mx-auto"
                      />
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeFile(); }}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                      >
                        <FontAwesomeIcon icon={faTrash} className="text-xs" />
                      </button>
                      <p className="text-[10px] text-slate-400 text-center mt-2">{file?.name}</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 sm:gap-3 py-4 sm:py-8">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FontAwesomeIcon icon={faCamera} className="text-xl sm:text-2xl text-indigo-400" />
                      </div>
                      <div className="text-center">
                        <p className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400">Klik untuk upload foto</p>
                        <p className="text-[9px] sm:text-[10px] text-slate-400 mt-1">PNG, JPG, HEIC, WEBP, GIF — Max 10MB</p>
                      </div>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.heic,.heif"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={saving || !form.user_id || !form.amount || !form.transaction_date}
                  className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-xl shadow-indigo-500/30 transition-all text-base gap-3 disabled:opacity-50"
                >
                  <FontAwesomeIcon icon={saving ? faSpinner : faSave} spin={saving} />
                  {saving ? 'Menyimpan...' : 'Simpan Pendapatan'}
                </Button>
              </div>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  );
}
