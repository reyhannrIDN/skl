import React, { useEffect, useState } from 'react';
import { idnApi } from '@/api/idnApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Label } from '@/components/common/Label';
import { Badge } from '@/components/common/Badge';
import { Search, Plus, Loader2, Edit, Trash2, Users, X, CheckCircle2, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

export function IdnStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', nis: '', school: '', kelas: '', is_active: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchStudents(); }, []);

  const fetchStudents = async () => {
    try {
      const { data } = await idnApi.getStudents();
      setStudents(data.students);
    } catch {
      toast.error('Gagal memuat data siswa');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', nis: '', school: '', kelas: '', is_active: true });
    setModalOpen(true);
  };

  const openEdit = (s) => {
    setEditing(s);
    setForm({ name: s.name, nis: s.nis || '', school: s.school || '', kelas: s.kelas || '', is_active: s.is_active });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return toast.error('Nama siswa wajib diisi');
    setSaving(true);
    try {
      if (editing) {
        await idnApi.updateStudent(editing.id, form);
        toast.success('Siswa diperbarui');
      } else {
        await idnApi.createStudent(form);
        toast.success('Siswa ditambahkan');
      }
      setModalOpen(false);
      fetchStudents();
    } catch {
      toast.error('Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (s) => {
    Swal.fire({
      title: 'Hapus siswa?',
      text: `Yakin ingin menghapus ${s.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Hapus',
      cancelButtonText: 'Batal',
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          await idnApi.deleteStudent(s.id);
          toast.success('Siswa dihapus');
          fetchStudents();
        } catch {
          toast.error('Gagal menghapus');
        }
      }
    });
  };

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    (s.nis || '').includes(search) ||
    (s.school || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight text-primary mb-1">Data Siswa</h1>
          <p className="text-sm text-muted-foreground">Total {students.length} siswa</p>
        </div>
        <Button onClick={openCreate} className="gap-2"><Plus className="w-4 h-4" /> Tambah Siswa</Button>
      </div>

      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari siswa..." className="pl-9" />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="p-4">Nama</th>
                  <th className="p-4">NIS</th>
                  <th className="p-4">Sekolah</th>
                  <th className="p-4">Kelas</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="p-4 font-medium">{s.name}</td>
                    <td className="p-4 text-muted-foreground">{s.nis || '-'}</td>
                    <td className="p-4 text-muted-foreground">{s.school || '-'}</td>
                    <td className="p-4 text-muted-foreground">{s.kelas || '-'}</td>
                    <td className="p-4">
                      <Badge variant={s.is_active ? 'success' : 'secondary'}>
                        {s.is_active ? 'Aktif' : 'Nonaktif'}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(s)}><Edit className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(s)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="p-8 text-center text-muted-foreground italic">Tidak ada data siswa.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setModalOpen(false)}>
          <div className="bg-background rounded-2xl shadow-2xl w-full max-w-md p-6 mx-4 animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">{editing ? 'Edit Siswa' : 'Tambah Siswa'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Nama Siswa</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nama lengkap" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>NIS</Label>
                  <Input value={form.nis} onChange={(e) => setForm({ ...form, nis: e.target.value })} placeholder="Nomor induk" />
                </div>
                <div>
                  <Label>Kelas</Label>
                  <Input value={form.kelas} onChange={(e) => setForm({ ...form, kelas: e.target.value })} placeholder="e.g. 9" />
                </div>
              </div>
              <div>
                <Label>Sekolah</Label>
                <Input value={form.school} onChange={(e) => setForm({ ...form, school: e.target.value })} placeholder="Asal sekolah" />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <Label>Status Aktif</Label>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, is_active: !form.is_active })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.is_active ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${form.is_active ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setModalOpen(false)}>Batal</Button>
              <Button onClick={handleSave} disabled={saving} className="gap-2">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editing ? 'Simpan' : 'Tambah'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
