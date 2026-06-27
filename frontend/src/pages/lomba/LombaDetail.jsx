import React, { useEffect, useState } from 'react';
import { lombaApi } from '@/api/lombaApi';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import {
  Trophy, ArrowLeft, MapPin, Calendar, Users, Users2,
  GraduationCap, Medal, Image as ImageIcon, X, Loader2,
  Tag, Building2, FileText
} from 'lucide-react';
import toast from 'react-hot-toast';

const tingkatLabels = { sekolah: 'Sekolah', kecamatan: 'Kecamatan', kabupaten: 'Kabupaten', provinsi: 'Provinsi', nasional: 'Nasional', internasional: 'Internasional' };
const statusLabels = { belum_ada_hasil: 'Belum Ada Hasil', juara: 'Juara', tidak_juara: 'Tidak Juara' };

export function LombaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lomba, setLomba] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    lombaApi.getDetail(id).then(({ data }) => setLomba(data.lomba))
      .catch(() => { toast.error('Gagal memuat data'); navigate('/lomba'); })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex h-80 items-center justify-center"><Loader2 className="w-8 h-8 text-indigo-600 animate-spin" /></div>;
  if (!lomba) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-16">
      <div className="flex items-center gap-3">
        <Button onClick={() => navigate('/lomba')} variant="outline" className="h-10 px-4 rounded-xl gap-2 text-xs font-bold">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Button>
      </div>

      {/* Informasi Lomba */}
      <Card className="border-none shadow-xl rounded-2xl overflow-hidden">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center shrink-0">
              <Trophy className="w-7 h-7 text-indigo-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white">{lomba.nama_lomba}</h1>
              <p className="text-sm text-slate-500 mt-1">{lomba.deskripsi}</p>
            </div>
            {lomba.status_hasil === 'juara' && (
              <div className="shrink-0 px-4 py-2 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white font-black shadow-lg flex items-center gap-2">
                <Medal className="w-5 h-5" />
                Juara {lomba.juara_ke?.replace('_', ' ')}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Tag, label: 'Tingkat', value: tingkatLabels[lomba.tingkat] || lomba.tingkat },
              { icon: Building2, label: 'Penyelenggara', value: lomba.penyelenggara || '-' },
              { icon: MapPin, label: 'Lokasi', value: lomba.lokasi },
              { icon: Calendar, label: 'Tanggal', value: lomba.tanggal_mulai ? `${lomba.tanggal_mulai}${lomba.tanggal_selesai ? ` s/d ${lomba.tanggal_selesai}` : ''}` : '-' },
              { icon: Medal, label: 'Status Hasil', value: statusLabels[lomba.status_hasil] || '-' },
              { icon: Users2, label: 'Jumlah Tim', value: lomba.total_tim },
              { icon: Users, label: 'Total Peserta', value: lomba.total_peserta },
              { icon: GraduationCap, label: 'Kategori', value: lomba.kategori },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/30">
                <item.icon className="w-5 h-5 text-indigo-500 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
          {lomba.alamat && <p className="text-xs text-slate-400"><span className="font-bold">Alamat:</span> {lomba.alamat}</p>}
        </CardContent>
      </Card>

      {/* Pendamping */}
      {lomba.pendamping?.length > 0 && (
        <Card className="border-none shadow-xl rounded-2xl">
          <CardContent className="p-6">
            <h3 className="font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-500" /> Pendamping
            </h3>
            <div className="flex flex-wrap gap-3">
              {lomba.pendamping.map((p) => (
                <div key={p.id} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-xs font-bold">
                  <span className="text-indigo-600">{p.nama}</span>
                  <span className="text-slate-400">({p.jabatan})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tim */}
      {lomba.tim?.map((tim, idx) => (
        <Card key={tim.id} className="border-none shadow-xl rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center">
                <Users2 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 dark:text-white">{tim.nama_tim}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{tim.jenis_tim} — {tim.jumlah_anggota} Anggota</p>
              </div>
            </div>
            <div className="space-y-2">
              {tim.peserta.map((p) => (
                <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/30">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-600">
                    {p.nama.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{p.nama}</p>
                    <p className="text-[10px] text-slate-400">NIS: {p.nis || '-'} | Kelas: {p.kelas || '-'}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Dokumentasi */}
      {lomba.foto?.length > 0 && (
        <Card className="border-none shadow-xl rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <h3 className="font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-indigo-500" /> Dokumentasi ({lomba.foto.length})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {lomba.foto.map((f) => (
                <button key={f.id} onClick={() => setLightbox(f.url)}
                  className="aspect-video rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 group relative">
                  <img src={f.url} alt={f.original_name || 'Foto'} loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setLightbox(null)}>
          <div className="relative max-w-4xl max-h-[90vh] w-full" onClick={e => e.stopPropagation()}>
            <button onClick={() => setLightbox(null)}
              className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center text-slate-600 hover:text-red-500 z-10">
              <X className="w-5 h-5" />
            </button>
            <img src={lightbox} alt="Dokumentasi" className="w-full h-auto max-h-[85vh] object-contain rounded-2xl shadow-2xl" />
          </div>
        </div>
      )}
    </div>
  );
}
