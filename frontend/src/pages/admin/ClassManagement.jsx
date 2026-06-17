import React, { useEffect, useState } from 'react';
import { adminApi } from '@/api/adminApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Badge } from '@/components/common/Badge';
import { Label } from '@/components/common/Label';
import { Search, Plus, Loader2, Edit, Trash2, Users, GraduationCap, UserCheck, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';

export function ClassManagement() {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();
  const selectedTeacherIds = watch('teacher_ids', []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [classRes, teacherRes] = await Promise.all([
        adminApi.getClasses(),
        adminApi.getEligibleTeachers()
      ]);
      setClasses(classRes.data.classes || []);
      setTeachers(teacherRes.data.teachers || []);
    } catch (error) {
      toast.error('Gagal mengambil data');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingClass(null);
    reset({ name: '', description: '', wali_kelas_id: '', teacher_ids: [] });
    setIsModalOpen(true);
  };

  const openEditModal = (cls) => {
    setEditingClass(cls);
    reset({
      name: cls.name,
      description: cls.description,
      wali_kelas_id: cls.wali_kelas_id,
      teacher_ids: cls.teachers?.map(t => t.id) || []
    });
    setIsModalOpen(true);
  };

  const onSubmitForm = async (data) => {
    setIsSubmitting(true);
    try {
      if (editingClass) {
        await adminApi.updateClass(editingClass.id, data);
        toast.success('Kelas berhasil diperbarui');
      } else {
        await adminApi.createClass(data);
        toast.success('Kelas berhasil dibuat');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menyimpan data');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Hapus kelas '${name}'?`)) {
      try {
        await adminApi.deleteClass(id);
        toast.success('Kelas dihapus');
        fetchData();
      } catch (error) {
        toast.error('Gagal menghapus kelas');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight text-primary">Manajemen Kelas</h1>
          <p className="text-muted-foreground mt-1">Buat kelas dan tentukan Wali Kelas serta Guru Pengajar.</p>
        </div>
        <Button onClick={openAddModal} className="gap-2">
          <Plus className="w-4 h-4" /> Tambah Kelas
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            <p className="mt-2 text-muted-foreground">Memuat data kelas...</p>
          </div>
        ) : classes.length === 0 ? (
          <div className="col-span-full py-20 text-center border-2 border-dashed rounded-3xl bg-muted/5">
            <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-10" />
            <p className="text-muted-foreground font-medium">Belum ada data kelas yang dibuat.</p>
            <Button variant="link" onClick={openAddModal} className="mt-2">Klik di sini untuk membuat kelas pertama.</Button>
          </div>
        ) : (
          classes.map((cls) => (
            <Card key={cls.id} className="group hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md">
              <CardHeader className="pb-3 border-b bg-muted/30 group-hover:bg-primary/5 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-2">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10" onClick={() => openEditModal(cls)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(cls.id, cls.name)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-xl font-bold font-display">{cls.name}</CardTitle>
                <CardDescription className="line-clamp-2 min-h-[2.5rem]">{cls.description || 'Tidak ada deskripsi'}</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <UserCheck className="w-3 h-3 text-primary" /> Wali Kelas
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                      {cls.wali_kelas?.name?.[0]}
                    </div>
                    <span className="text-sm font-semibold">{cls.wali_kelas?.name || 'Belum ditentukan'}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Users className="w-3 h-3 text-primary" /> Guru Pengajar ({cls.teachers?.length || 0})
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {cls.teachers?.map(teacher => (
                      <Badge key={teacher.id} variant="outline" className="text-[10px] bg-muted/50 font-normal">
                        {teacher.name}
                      </Badge>
                    ))}
                    {(!cls.teachers || cls.teachers.length === 0) && (
                      <span className="text-[10px] text-muted-foreground italic">Belum ada guru tambahan</span>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 pb-4 flex justify-between items-center text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" /> {cls.students_count || 0} Siswa
                </span>
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3" /> ID: {cls.id}
                </span>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-lg shadow-2xl border-primary/20 bg-card overflow-hidden">
            <CardHeader className="border-b bg-muted/10 pb-4">
              <CardTitle>{editingClass ? 'Edit Detail Kelas' : 'Buat Kelas Baru'}</CardTitle>
              <CardDescription>Konfigurasi identitas kelas dan tim pengajar.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <form id="classForm" onSubmit={handleSubmit(onSubmitForm)} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Kelas <span className="text-destructive">*</span></Label>
                  <Input id="name" {...register('name', { required: true })} placeholder="Contoh: XII RPL 1" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi</Label>
                  <Input id="description" {...register('description')} placeholder="Keterangan singkat tentang kelas ini" />
                </div>

                <div className="space-y-2 py-2">
                  <Label>Wali Kelas <span className="text-destructive">*</span></Label>
                  <div className="relative">
                    <UserCheck className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                      {...register('wali_kelas_id', { required: true })}
                    >
                      <option value="">Pilih Wali Kelas</option>
                      {teachers.map(t => (
                        <option key={t.id} value={t.id}>{t.name} ({t.email})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-3 bg-muted/30 p-4 rounded-xl border">
                  <Label className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" /> Daftar Guru Pengajar
                  </Label>
                  <p className="text-[10px] text-muted-foreground">Pilih guru lain yang juga mengajar di kelas ini.</p>
                  <div className="grid grid-cols-2 gap-2 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                    {teachers.map(t => (
                      <label key={t.id} className="flex items-center space-x-2 p-2 border rounded-md bg-card hover:border-primary/30 transition-all cursor-pointer">
                        <input 
                          type="checkbox" 
                          value={t.id}
                          className="w-4 h-4 rounded border-input text-primary focus:ring-primary/20"
                          checked={selectedTeacherIds?.includes(t.id) || selectedTeacherIds?.includes(String(t.id))}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            const current = Array.isArray(selectedTeacherIds) ? selectedTeacherIds : [];
                            if (e.target.checked) {
                              setValue('teacher_ids', [...current, val]);
                            } else {
                              setValue('teacher_ids', current.filter(id => parseInt(id) !== val));
                            }
                          }}
                        />
                        <div className="truncate">
                          <p className="text-xs font-medium truncate">{t.name}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-end gap-3 pt-6 border-t bg-muted/5">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Batal</Button>
              <Button type="submit" form="classForm" disabled={isSubmitting} className="min-w-[100px]">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Simpan Data'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
