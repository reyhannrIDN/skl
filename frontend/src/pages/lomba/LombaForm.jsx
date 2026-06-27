import React, { useEffect, useState, useRef, useCallback } from 'react';
import { lombaApi } from '@/api/lombaApi';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import {
  Trophy, Save, ArrowLeft, Loader2, Plus, Trash2, X,
  Users, GraduationCap, Medal, Camera, Upload, FileImage,
  ChevronDown, ChevronUp, AlertCircle, Search, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { cn } from '@/utils/utils';

const tingkatOptions = [
  { value: 'sekolah', label: 'Sekolah' },
  { value: 'kecamatan', label: 'Kecamatan' },
  { value: 'kabupaten', label: 'Kabupaten' },
  { value: 'provinsi', label: 'Provinsi' },
  { value: 'nasional', label: 'Nasional' },
  { value: 'internasional', label: 'Internasional' },
];

const juaraOptions = [
  { value: 'juara_1', label: 'Juara 1' },
  { value: 'juara_2', label: 'Juara 2' },
  { value: 'juara_3', label: 'Juara 3' },
  { value: 'harapan_1', label: 'Harapan 1' },
  { value: 'harapan_2', label: 'Harapan 2' },
  { value: 'harapan_3', label: 'Harapan 3' },
  { value: 'favorit', label: 'Favorit' },
  { value: 'best_performance', label: 'Best Performance' },
  { value: 'lainnya', label: 'Lainnya' },
];

export function LombaForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const fileInputRef = useRef(null);

  const [saving, setSaving] = useState(false);
  const [referensi, setReferensi] = useState({ siswa: [], guru: [] });
  const [form, setForm] = useState({
    nama_lomba: '', tingkat: '', kategori: '', penyelenggara: '',
    lokasi: '', alamat: '', tanggal_mulai: '', tanggal_selesai: '',
    deskripsi: '', status_hasil: 'belum_ada_hasil', juara_ke: '', juara_ke_lainnya: '',
  });
  const [tim, setTim] = useState([{ nama_tim: '', jenis_tim: 'individu', jumlah_anggota: 1, peserta: [{ user_id: '' }] }]);
  const [pendamping, setPendamping] = useState([]);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [siswaSearch, setSiswaSearch] = useState({});
  const [showSiswaDropdown, setShowSiswaDropdown] = useState({});
  const [guruSearch, setGuruSearch] = useState('');
  const [showGuruDropdown, setShowGuruDropdown] = useState(false);

  useEffect(() => {
    lombaApi.getReferensi().then(({ data }) => setReferensi(data)).catch(() => toast.error('Gagal memuat data referensi'));
    if (isEdit) {
      lombaApi.getDetail(id).then(({ data }) => {
        const l = data.lomba;
        setForm({
          nama_lomba: l.nama_lomba, tingkat: l.tingkat, kategori: l.kategori,
          penyelenggara: l.penyelenggara || '', lokasi: l.lokasi, alamat: l.alamat || '',
          tanggal_mulai: l.tanggal_mulai || '', tanggal_selesai: l.tanggal_selesai || '',
          deskripsi: l.deskripsi || '', status_hasil: l.status_hasil,
          juara_ke: l.juara_ke || '', juara_ke_lainnya: l.juara_ke_lainnya || '',
        });
        setTim(l.tim.map(t => ({
          nama_tim: t.nama_tim, jenis_tim: t.jenis_tim,
          jumlah_anggota: t.jumlah_anggota,
          peserta: t.peserta.map(p => ({ user_id: String(p.user_id), _nama: p.nama, _nis: p.nis, _kelas: p.kelas })),
        })));
        setPendamping(l.pendamping.map(p => ({ user_id: String(p.user_id), _nama: p.nama, _jabatan: p.jabatan })));
      }).catch(() => { toast.error('Gagal memuat data'); navigate('/lomba'); });
    }
  }, [id]);

  const addTim = () => setTim([...tim, { nama_tim: '', jenis_tim: 'individu', jumlah_anggota: 1, peserta: [{ user_id: '' }] }]);
  const removeTim = (idx) => { if (tim.length > 1) setTim(tim.filter((_, i) => i !== idx)); };

  const updateTim = (idx, field, value) => {
    const newTim = [...tim];
    newTim[idx] = { ...newTim[idx], [field]: value };
    if (field === 'jumlah_anggota') {
      const diff = parseInt(value) - newTim[idx].peserta.length;
      if (diff > 0) for (let i = 0; i < diff; i++) newTim[idx].peserta.push({ user_id: '' });
      else newTim[idx].peserta = newTim[idx].peserta.slice(0, parseInt(value));
    }
    setTim(newTim);
  };

  const updatePeserta = (timIdx, pesertaIdx, userId) => {
    const newTim = [...tim];
    newTim[timIdx].peserta[pesertaIdx] = { ...newTim[timIdx].peserta[pesertaIdx], user_id: userId };
    setTim(newTim);
    setShowSiswaDropdown({ ...showSiswaDropdown, [`${timIdx}-${pesertaIdx}`]: false });
    setSiswaSearch({ ...siswaSearch, [`${timIdx}-${pesertaIdx}`]: '' });
  };

  const getSelectedSiswaIds = () => tim.flatMap(t => t.peserta.map(p => p.user_id).filter(Boolean));

  const togglePendamping = (userId, nama, jabatan) => {
    setPendamping(prev =>
      prev.find(p => p.user_id === userId)
        ? prev.filter(p => p.user_id !== userId)
        : [...prev, { user_id: userId, _nama: nama, _jabatan: jabatan || 'Guru' }]
    );
  };

  const handleFiles = useCallback((newFiles) => {
    const validFiles = Array.from(newFiles).filter(f => f.type.startsWith('image/'));
    setFiles(prev => [...prev, ...validFiles]);
    validFiles.forEach(f => {
      const reader = new FileReader();
      reader.onload = (e) => setPreviews(prev => [...prev, { name: f.name, url: e.target.result }]);
      reader.readAsDataURL(f);
    });
  }, []);

  const removeFile = (idx) => {
    setFiles(files.filter((_, i) => i !== idx));
    setPreviews(previews.filter((_, i) => i !== idx));
  };

  const handleDrop = (e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); };

  const filteredSiswa = (timIdx, pesertaIdx) => {
    const search = siswaSearch[`${timIdx}-${pesertaIdx}`] || '';
    const selectedIds = getSelectedSiswaIds();
    return referensi.siswa.filter(s =>
      (s.name.toLowerCase().includes(search.toLowerCase()) || s.nis?.includes(search)) &&
      !selectedIds.includes(String(s.id))
    );
  };

  const filteredGuru = referensi.guru.filter(g =>
    g.name.toLowerCase().includes(guruSearch.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nama_lomba || !form.tingkat || !form.kategori || !form.lokasi) return toast.error('Lengkapi informasi lomba');
    if (form.status_hasil === 'juara' && !form.juara_ke) return toast.error('Pilih juara ke');
    if (tim.some(t => !t.nama_tim)) return toast.error('Nama semua tim harus diisi');
    if (tim.some(t => t.peserta.some(p => !p.user_id))) return toast.error('Pilih semua peserta');

    setSaving(true);
    setUploadProgress(0);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v); });
      fd.append('tim', JSON.stringify(tim));
      fd.append('pendamping', JSON.stringify(pendamping));
      files.forEach(f => fd.append('foto[]', f));

      if (isEdit) {
        fd.append('_method', 'PUT');
        await lombaApi.update(id, fd);
        toast.success('Lomba berhasil diperbarui');
      } else {
        await lombaApi.create(fd);
        toast.success('Lomba berhasil ditambahkan');
      }
      navigate('/lomba');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  };

  const handleTimPaste = (e) => {
    try {
      const parsed = JSON.parse(e.clipboardData.getData('text'));
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].nama_tim !== undefined) {
        setTim(parsed);
        toast.success('Data tim berhasil diimport dari clipboard');
      }
    } catch { /* ignore */ }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-16">
      <div className="flex items-center gap-3">
        <Button onClick={() => navigate('/lomba')} variant="outline" className="h-10 px-4 rounded-xl gap-2 text-xs font-bold">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Button>
      </div>

      <form onSubmit={handleSubmit} onPaste={handleTimPaste}>
        {/* Informasi Lomba */}
        <Card className="border-none shadow-xl rounded-2xl mb-6">
          <CardHeader className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center"><Trophy className="w-5 h-5 text-indigo-600" /></div>
              <div>
                <CardTitle className="text-lg font-black text-slate-900">Informasi Lomba</CardTitle>
                <p className="text-xs text-slate-400">Data umum kegiatan lomba</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nama Lomba *</label>
                <input value={form.nama_lomba} onChange={e => setForm({...form, nama_lomba: e.target.value})}
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20" required /></div>
              <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tingkat *</label>
                <select value={form.tingkat} onChange={e => setForm({...form, tingkat: e.target.value})}
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20" required>
                  <option value="">Pilih Tingkat</option>
                  {tingkatOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select></div>
              <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kategori *</label>
                <input value={form.kategori} onChange={e => setForm({...form, kategori: e.target.value})}
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20" required /></div>
              <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Penyelenggara</label>
                <input value={form.penyelenggara} onChange={e => setForm({...form, penyelenggara: e.target.value})}
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20" /></div>
              <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lokasi *</label>
                <input value={form.lokasi} onChange={e => setForm({...form, lokasi: e.target.value})}
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20" required /></div>
              <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Alamat Lengkap</label>
                <input value={form.alamat} onChange={e => setForm({...form, alamat: e.target.value})}
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20" /></div>
              <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tanggal Mulai</label>
                <input type="date" value={form.tanggal_mulai} onChange={e => setForm({...form, tanggal_mulai: e.target.value})}
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20" /></div>
              <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tanggal Selesai</label>
                <input type="date" value={form.tanggal_selesai} onChange={e => setForm({...form, tanggal_selesai: e.target.value})}
                  className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20" /></div>
            </div>
            <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Deskripsi</label>
              <textarea value={form.deskripsi} onChange={e => setForm({...form, deskripsi: e.target.value})} rows={3}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none" /></div>
          </CardContent>
        </Card>

        {/* Tim */}
        <Card className="border-none shadow-xl rounded-2xl mb-6">
          <CardHeader className="p-6 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center"><Users className="w-5 h-5 text-purple-600" /></div>
                <div>
                  <CardTitle className="text-lg font-black text-slate-900">Data Tim</CardTitle>
                  <p className="text-xs text-slate-400">Jumlah tim dan anggota peserta</p>
                </div>
              </div>
              <Button type="button" onClick={addTim} variant="outline" className="h-10 px-4 rounded-xl gap-2 text-xs font-bold">
                <Plus className="w-4 h-4" /> Tambah Tim
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <AnimatePresence>
              {tim.map((t, timIdx) => (
                <motion.div key={timIdx} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-700 dark:text-slate-300">Tim {timIdx + 1}</span>
                    {tim.length > 1 && (
                      <button type="button" onClick={() => removeTim(timIdx)} className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nama Tim *</label>
                      <input value={t.nama_tim} onChange={e => updateTim(timIdx, 'nama_tim', e.target.value)}
                        className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20" required /></div>
                    <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Jenis Tim *</label>
                      <select value={t.jenis_tim} onChange={e => updateTim(timIdx, 'jenis_tim', e.target.value)}
                        className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20">
                        <option value="individu">Individu</option><option value="beregu">Beregu</option>
                      </select></div>
                    <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Jumlah Anggota *</label>
                      <input type="number" min="1" max="100" value={t.jumlah_anggota}
                        onChange={e => updateTim(timIdx, 'jumlah_anggota', e.target.value)}
                        className="w-full h-10 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20" /></div>
                  </div>

                  {/* Peserta */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Daftar Anggota</p>
                    {t.peserta.map((p, pIdx) => {
                      const key = `${timIdx}-${pIdx}`;
                      const siswa = referensi.siswa.find(s => String(s.id) === p.user_id);
                      const filtered = filteredSiswa(timIdx, pIdx);
                      return (
                        <div key={pIdx} className="relative">
                          <div className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200">
                            <span className="text-[10px] font-bold text-slate-400 w-16 shrink-0">Siswa {pIdx + 1}</span>
                            {siswa ? (
                              <div className="flex-1 flex items-center justify-between px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10">
                                <div><span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">{siswa.name}</span>
                                  <span className="text-[10px] text-slate-400 ml-2">NIS: {siswa.nis} | {siswa.kelas}</span></div>
                                <button type="button" onClick={() => updatePeserta(timIdx, pIdx, '')}
                                  className="p-1 rounded hover:bg-red-50 text-red-500"><X className="w-3 h-3" /></button>
                              </div>
                            ) : (
                              <div className="flex-1 relative">
                                <div className="relative">
                                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                                  <input placeholder="Cari siswa..." value={siswaSearch[key] || ''}
                                    onChange={e => setSiswaSearch({...siswaSearch, [key]: e.target.value})}
                                    onFocus={() => setShowSiswaDropdown({...showSiswaDropdown, [key]: true})}
                                    className="w-full h-9 pl-9 pr-3 rounded-lg bg-slate-50 border border-slate-200 text-xs outline-none" />
                                </div>
                                {showSiswaDropdown[key] && filtered.length > 0 && (
                                  <div className="absolute z-20 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                                    {filtered.map(s => (
                                      <button key={s.id} type="button" onClick={() => updatePeserta(timIdx, pIdx, String(s.id))}
                                        className="w-full text-left px-4 py-2.5 text-xs hover:bg-indigo-50 dark:hover:bg-indigo-500/10 border-b border-slate-50 last:border-0">
                                        <span className="font-bold text-slate-700 dark:text-slate-300">{s.name}</span>
                                        <span className="text-slate-400 ml-2">NIS: {s.nis} | {s.kelas}</span>
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Pendamping */}
        <Card className="border-none shadow-xl rounded-2xl mb-6">
          <CardHeader className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center"><GraduationCap className="w-5 h-5 text-amber-600" /></div>
              <div>
                <CardTitle className="text-lg font-black text-slate-900">Pendamping</CardTitle>
                <p className="text-xs text-slate-400">Pilih guru pendamping (bisa lebih dari satu)</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input placeholder="Cari guru..." value={guruSearch} onChange={e => setGuruSearch(e.target.value)}
                onFocus={() => setShowGuruDropdown(true)} onBlur={() => setTimeout(() => setShowGuruDropdown(false), 200)}
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20" />
              {showGuruDropdown && filteredGuru.length > 0 && (
                <div className="absolute z-20 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                  {filteredGuru.map(g => {
                    const selected = pendamping.some(p => p.user_id === String(g.id));
                    return (
                      <button key={g.id} type="button" onClick={() => togglePendamping(String(g.id), g.name, g.specialty)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-xs hover:bg-indigo-50 border-b border-slate-50 last:border-0">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${selected ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'}`}>
                          {selected && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <div><span className="font-bold text-slate-700">{g.name}</span>
                          <span className="text-slate-400 ml-2">{g.specialty || 'Guru'}</span></div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            {pendamping.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {pendamping.map((p, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 text-xs font-bold text-indigo-700">
                    {p._nama}
                    <button type="button" onClick={() => togglePendamping(p.user_id)} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Hasil Lomba */}
        <Card className="border-none shadow-xl rounded-2xl mb-6">
          <CardHeader className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center"><Medal className="w-5 h-5 text-emerald-600" /></div>
              <div>
                <CardTitle className="text-lg font-black text-slate-900">Hasil Lomba</CardTitle>
                <p className="text-xs text-slate-400">Status dan pencapaian lomba</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status Hasil</label>
              <select value={form.status_hasil} onChange={e => setForm({...form, status_hasil: e.target.value, juara_ke: '', juara_ke_lainnya: ''})}
                className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20">
                <option value="belum_ada_hasil">Belum Ada Hasil</option>
                <option value="juara">Juara</option>
                <option value="tidak_juara">Tidak Juara</option>
              </select></div>
            {form.status_hasil === 'juara' && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
                <div className="space-y-1"><label className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Juara Ke *</label>
                  <select value={form.juara_ke} onChange={e => setForm({...form, juara_ke: e.target.value})}
                    className="w-full h-11 px-4 rounded-xl bg-white border border-amber-200 text-sm outline-none focus:ring-2 focus:ring-amber-500/20" required>
                    <option value="">Pilih Juara</option>
                    {juaraOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select></div>
                {form.juara_ke === 'lainnya' && (
                  <div className="space-y-1"><label className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Juara (Lainnya)</label>
                    <input value={form.juara_ke_lainnya} onChange={e => setForm({...form, juara_ke_lainnya: e.target.value})}
                      placeholder="Tulis juara..."
                      className="w-full h-11 px-4 rounded-xl bg-white border border-amber-200 text-sm outline-none focus:ring-2 focus:ring-amber-500/20" /></div>
                )}
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Dokumentasi */}
        <Card className="border-none shadow-xl rounded-2xl mb-6">
          <CardHeader className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-100 flex items-center justify-center"><Camera className="w-5 h-5 text-cyan-600" /></div>
              <div>
                <CardTitle className="text-lg font-black text-slate-900">Dokumentasi Foto</CardTitle>
                <p className="text-xs text-slate-400">Upload dokumentasi kegiatan (opsional, multiple)</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div
              onDrop={handleDrop} onDragOver={e => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 dark:border-white/20 rounded-2xl p-8 text-center cursor-pointer hover:border-indigo-400 transition-colors group"
            >
              <Upload className="w-10 h-10 mx-auto text-slate-300 group-hover:text-indigo-400 mb-3 transition-colors" />
              <p className="text-sm font-bold text-slate-500">Klik atau drag & drop foto di sini</p>
              <p className="text-[10px] text-slate-400 mt-1">JPG, PNG, WebP, HEIC, GIF, BMP, TIFF — Max 20MB/file</p>
            </div>
            <input ref={fileInputRef} type="file" multiple accept="image/*,.heic,.heif" className="hidden"
              onChange={e => handleFiles(e.target.files)} />

            {previews.length > 0 && (
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mt-4">
                {previews.map((p, i) => (
                  <div key={i} className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 group">
                    <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeFile(i)}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-3 h-3" />
                    </button>
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-1">
                      <p className="text-[8px] text-white truncate">{p.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Button type="button" onClick={() => navigate('/lomba')} variant="outline" className="h-12 px-6 rounded-xl gap-2 text-xs font-bold">
            Batal
          </Button>
          <Button type="submit" disabled={saving}
            className="h-12 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black gap-2 shadow-xl shadow-indigo-500/30 disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </div>
      </form>
    </div>
  );
}
