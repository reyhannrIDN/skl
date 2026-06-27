import React, { useEffect, useState } from 'react';
import { idnApi } from '@/api/idnApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Label } from '@/components/common/Label';
import { Badge } from '@/components/common/Badge';
import { Search, Plus, Loader2, Edit, Trash2, Building2, X, Calendar, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';

export function IdnSchoolVisits() {
  const [visits, setVisits] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ school_name: '', address: '', visit_date: '', team_name: '', team_members: '', total_audience: '', notes: '' });
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchVisits(); fetchStudents(); }, []);

  const fetchVisits = async () => {
    try {
      const { data } = await idnApi.getSchoolVisits();
      setVisits(data.visits);
    } catch {
      toast.error('Gagal memuat data kunjungan');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const { data } = await idnApi.getStudents();
      setStudents((data.students || []).filter(s => s.is_active));
    } catch {}
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ school_name: '', address: '', visit_date: '', team_name: '', team_members: '', total_audience: '', notes: '' });
    setSelectedMembers([]);
    setModalOpen(true);
  };

  const openEdit = (v) => {
    setEditing(v);
    const members = (v.team_members || '').split(',').map(m => m.trim()).filter(Boolean);
    setForm({
      school_name: v.school_name,
      address: v.address || '',
      visit_date: v.visit_date || '',
      team_name: v.team_name,
      team_members: v.team_members || '',
      total_audience: v.total_audience,
      notes: v.notes || '',
    });
    setSelectedMembers(members);
    setModalOpen(true);
  };

  const toggleMember = (name) => {
    setSelectedMembers(prev =>
      prev.includes(name) ? prev.filter(m => m !== name) : [...prev, name]
    );
  };

  const handleSave = async () => {
    if (!form.school_name.trim()) return toast.error('Nama sekolah wajib diisi');
    if (!form.team_name.trim()) return toast.error('Nama tim wajib diisi');
    setSaving(true);
    const payload = { ...form, team_members: selectedMembers.join(', '), total_audience: form.total_audience || 0 };
    try {
      if (editing) {
        await idnApi.updateSchoolVisit(editing.id, payload);
        toast.success('Kunjungan diperbarui');
      } else {
        await idnApi.createSchoolVisit(payload);
        toast.success('Kunjungan ditambahkan');
      }
      setModalOpen(false);
      fetchVisits();
    } catch {
      toast.error('Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (v) => {
    Swal.fire({
      title: 'Hapus kunjungan?',
      text: `Yakin ingin menghapus kunjungan ke ${v.school_name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Hapus',
      cancelButtonText: 'Batal',
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          await idnApi.deleteSchoolVisit(v.id);
          toast.success('Kunjungan dihapus');
          fetchVisits();
        } catch {
          toast.error('Gagal menghapus');
        }
      }
    });
  };

  const filtered = visits.filter((v) =>
    v.school_name.toLowerCase().includes(search.toLowerCase()) ||
    v.team_name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight text-primary mb-1">Kunjungan Sekolah</h1>
          <p className="text-sm text-muted-foreground">Total {visits.length} kunjungan</p>
        </div>
        <Button onClick={openCreate} className="gap-2"><Plus className="w-4 h-4" /> Tambah Kunjungan</Button>
      </div>

      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari sekolah/tim..." className="pl-9" />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="p-4">Sekolah</th>
                  <th className="p-4">Tim</th>
                  <th className="p-4">Tanggal</th>
                  <th className="p-4">Audience</th>
                  <th className="p-4 hidden md:table-cell">Anggota Tim</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((v) => (
                  <tr key={v.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-muted-foreground shrink-0" />
                        <span className="font-medium">{v.school_name}</span>
                      </div>
                    </td>
                    <td className="p-4"><Badge variant="secondary">{v.team_name}</Badge></td>
                    <td className="p-4">
                      {v.visit_date ? (
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5 text-primary" />
                          <span className="font-medium text-foreground">{dayjs(v.visit_date).format('DD MMM YYYY')}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground italic text-xs">—</span>
                      )}
                    </td>
                    <td className="p-4">
                      <Badge variant="default" className="gap-1.5 py-1">
                        <Users className="w-3 h-3" /> {v.total_audience}
                      </Badge>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {(v.team_members || '').split(',').filter(Boolean).map((m, i) => (
                          <Badge key={i} variant="outline" className="text-[10px] font-normal">
                            {m.trim()}
                          </Badge>
                        ))}
                        {!v.team_members && <span className="text-muted-foreground italic text-xs">—</span>}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(v)}><Edit className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(v)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="p-8 text-center text-muted-foreground italic">Tidak ada data kunjungan.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setModalOpen(false)}>
          <div className="bg-background rounded-2xl shadow-2xl w-full max-w-lg p-6 mx-4 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">{editing ? 'Edit Kunjungan' : 'Tambah Kunjungan'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Nama Sekolah</Label>
                <Input value={form.school_name} onChange={(e) => setForm({ ...form, school_name: e.target.value })} placeholder="Nama sekolah yang dikunjungi" />
              </div>
              <div>
                <Label>Alamat</Label>
                <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Alamat sekolah (opsional)" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Tanggal Kunjungan</Label>
                  <div className="relative">
                    <Input
                      type="date"
                      value={form.visit_date}
                      onChange={(e) => setForm({ ...form, visit_date: e.target.value })}
                      onFocus={(e) => e.target.showPicker?.()}
                      className="cursor-pointer [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0"
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
                <div>
                  <Label>Total Audience</Label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={form.total_audience}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, '');
                      setForm({ ...form, total_audience: v });
                    }}
                    placeholder="0"
                    className="font-semibold tabular-nums"
                  />
                </div>
              </div>
            <div>
              <Label>Nama Tim</Label>
              <Input value={form.team_name} onChange={(e) => setForm({ ...form, team_name: e.target.value })} placeholder="e.g. Tim A, Tim Android" />
            </div>
            <div>
              <Label>Anggota Tim <span className="text-muted-foreground font-normal text-xs">(pilih dari siswa terdaftar)</span></Label>
              <div className="max-h-40 overflow-y-auto border rounded-lg p-2 space-y-1 bg-muted/20">
                {students.length === 0 && (
                  <p className="text-xs text-muted-foreground italic p-2 text-center">Belum ada siswa terdaftar.</p>
                )}
                {students.map(s => {
                  const checked = selectedMembers.includes(s.name);
                  return (
                    <label
                      key={s.id}
                      className="flex items-center gap-2.5 p-2 rounded-lg cursor-pointer hover:bg-background transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleMember(s.name)}
                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <div className="flex items-center justify-between w-full min-w-0">
                        <span className="text-sm font-medium truncate">{s.name}</span>
                        {s.school && <span className="text-[10px] text-muted-foreground shrink-0 ml-2">{s.school}</span>}
                      </div>
                    </label>
                  );
                })}
              </div>
              {selectedMembers.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedMembers.map(name => (
                    <Badge key={name} variant="secondary" className="text-[10px] gap-1">
                      {name}
                      <button onClick={() => toggleMember(name)} className="hover:text-destructive ml-0.5">×</button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
              <div>
                <Label>Catatan</Label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Catatan tambahan (opsional)"
                  className="flex h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                />
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
