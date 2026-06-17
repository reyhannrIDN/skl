import React, { useEffect, useState } from 'react';
import { guruApi } from '@/api/guruApi';
import { adminApi } from '@/api/adminApi'; // Need this for categories if not globally available
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Badge } from '@/components/common/Badge';
import { Label } from '@/components/common/Label';
import { 
  Plus, 
  Loader2, 
  Edit, 
  Trash2, 
  CheckSquare, 
  Link as LinkIcon, 
  FileText, 
  Youtube, 
  Layout, 
  Settings2,
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';

export function MyClassTaskManagement() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm();
  const taskType = watch('type', 'file');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [taskRes, catRes] = await Promise.all([
        guruApi.getTasks(),
        guruApi.getCategories() // Using existing guruApi for categories
      ]);
      setTasks(taskRes.data.requirements || []);
      setCategories(catRes.data.categories || []);
    } catch (error) {
      toast.error('Gagal mengambil data tugas');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingTask(null);
    reset({ 
      category_id: '', 
      label: '', 
      type: 'file', 
      is_required: true, 
      allowed_extensions: 'pdf,zip,jpg,png,docx,xlsx', 
      max_size_mb: 10,
      instructions: '',
      input_config: { placeholder: '', help_text: '' }
    });
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    reset({
      category_id: task.category_id,
      label: task.label,
      type: task.type,
      is_required: task.is_required,
      allowed_extensions: task.allowed_extensions,
      max_size_mb: task.max_size_mb,
      instructions: task.instructions || '',
      input_config: task.input_config || { placeholder: '', help_text: '' }
    });
    setIsModalOpen(true);
  };

  const onSubmitForm = async (data) => {
    setIsSubmitting(true);
    try {
      if (editingTask) {
        await guruApi.updateTask(editingTask.id, data);
        toast.success('Tugas berhasil diperbarui');
      } else {
        await guruApi.createTask(data);
        toast.success('Tugas baru berhasil ditambahkan');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menyimpan tugas');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Hapus tugas '${title}'?`)) {
      try {
        await guruApi.deleteTask(id);
        toast.success('Tugas dihapus');
        fetchData();
      } catch (error) {
        toast.error('Gagal menghapus tugas');
      }
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'url': return <Youtube className="w-5 h-5 text-red-500" />;
      case 'file': return <FileText className="w-5 h-5 text-blue-500" />;
      default: return <Layout className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-br from-card to-muted/30 p-8 rounded-[2rem] border shadow-sm gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 px-3 py-1">
              Guru Pengampu
            </Badge>
            <Badge variant="outline" className="text-amber-500 border-amber-500/20 bg-amber-500/5 px-3 py-1">
              Information Hub
            </Badge>
          </div>
          <h1 className="text-4xl font-black font-display tracking-tight text-primary flex items-center gap-3">
             Pusat Informasi & Ketentuan
          </h1>
          <p className="text-muted-foreground mt-2 max-w-lg leading-relaxed">
            Kelola pengumuman, panduan, dan persyaratan teknis yang harus diikuti oleh siswa untuk setiap kategori project.
          </p>
        </div>
        <Button onClick={openAddModal} className="gap-2 rounded-2xl h-14 px-8 shadow-lg shadow-primary/20 hover:translate-y-[-2px] transition-all font-bold">
          <Plus className="w-5 h-5" /> Buat Informasi Baru
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-10 h-10 animate-spin mx-auto text-primary opacity-20" />
            <p className="mt-4 text-muted-foreground animate-pulse">Memuat daftar tugas kelas...</p>
          </div>
        ) : tasks.length === 0 ? (
          <Card className="border-dashed border-2 bg-muted/5 py-20 text-center rounded-3xl">
            <Layout className="w-16 h-16 mx-auto mb-4 opacity-5" />
            <h3 className="text-xl font-bold text-muted-foreground/50">Belum Ada Tugas Khusus</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-[300px] mx-auto">
              Anda belum menentukan tugas khusus untuk kelas Anda. Klik tombol di atas untuk memulai.
            </p>
          </Card>
        ) : (
          tasks.map((task) => (
            <Card key={task.id} className="overflow-hidden group hover:border-primary/40 transition-all duration-300 rounded-[2rem] bg-card/50 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row items-stretch">
                  <div className={`w-3 ${task.is_required ? 'bg-gradient-to-b from-primary to-blue-600' : 'bg-slate-200'}`} />
                  <div className="flex-1 p-8 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-start gap-6 flex-1">
                      <div className="mt-1 p-4 bg-muted/50 rounded-[1.5rem] group-hover:bg-primary/10 transition-colors border border-border/50 shadow-inner">
                        {getTypeIcon(task.type)}
                      </div>
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-2xl font-black font-display tracking-tight group-hover:text-primary transition-colors">{task.label}</h3>
                          {task.is_required && (
                            <Badge className="bg-primary text-white border-none text-[10px] px-2.5 py-0.5 uppercase font-black tracking-tighter rounded-lg shadow-sm">
                              Wajib Diikuti
                            </Badge>
                          )}
                          <Badge variant="secondary" className="bg-muted hover:bg-muted font-bold text-[10px] uppercase tracking-wider px-2 h-6 border">
                            {task.category?.name || 'Umum'}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium italic">
                          <span>
                             ID: #{task.id}
                          </span>
                        </div>

                        {task.instructions && (
                          <div className="relative group/info">
                            <div className="absolute -left-3 top-0 bottom-0 w-1 bg-primary/20 rounded-full" />
                            <div className="text-[13px] text-muted-foreground whitespace-pre-wrap leading-relaxed pl-3 font-medium">
                              {task.instructions}
                            </div>
                          </div>
                        )}

                        {task.input_config?.help_text && (
                          <p className="text-[11px] text-primary/70 flex items-center gap-2 bg-primary/5 p-2 px-3 rounded-xl border border-primary/10 w-fit font-bold">
                            <Info className="w-3.5 h-3.5" /> {task.input_config.help_text}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Button variant="outline" size="sm" onClick={() => openEditModal(task)} className="h-12 w-12 md:w-auto md:px-5 rounded-2xl gap-2 hover:bg-primary/5 hover:text-primary group-hover:border-primary/30 transition-all border-2">
                        <Edit className="w-4 h-4" /> <span className="hidden md:inline">Edit</span>
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(task.id, task.label)} className="h-12 w-12 md:w-auto md:px-5 rounded-2xl gap-2 text-destructive hover:bg-destructive/5 hover:border-destructive/30 transition-all border-2">
                        <Trash2 className="w-4 h-4" /> <span className="hidden md:inline">Hapus</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <Card className="w-full max-w-xl shadow-2xl border-primary/20 bg-card overflow-hidden animate-in zoom-in-95 duration-200">
            <CardHeader className="border-b bg-muted/10 pb-6 p-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Settings2 className="w-5 h-5 text-primary" />
                </div>
                <CardTitle className="text-3xl font-black font-display tracking-tight text-primary">
                  {editingTask ? 'Edit Informasi' : 'Informasi Baru'}
                </CardTitle>
              </div>
              <CardDescription className="text-sm font-medium">Definisikan panduan dan ketentuan pengumpulan untuk project siswa.</CardDescription>
            </CardHeader>
            <CardContent className="pt-8 p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <form id="taskForm" onSubmit={handleSubmit(onSubmitForm)} className="grid grid-cols-2 gap-6">
                <div className="col-span-2 space-y-2">
                  <Label>Kategori Project <span className="text-destructive">*</span></Label>
                  <select 
                    className="flex h-11 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 appearance-none"
                    {...register('category_id', { required: true })}
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2 space-y-2">
                  <Label>Nama Tugas / Label Input <span className="text-destructive">*</span></Label>
                  <Input {...register('label', { required: true })} placeholder="Contoh: Link Video Demo, File Dokumentasi PDF" className="h-11 rounded-xl" />
                </div>

                <div className="col-span-2 space-y-2">
                  <Label>Ketentuan & Informasi Lengkap</Label>
                  <textarea 
                    className="flex min-h-[120px] w-full rounded-2xl border border-input bg-background/50 px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none shadow-inner"
                    placeholder="Tuliskan detail ketentuan, kriteria penilaian, atau informasi tambahan untuk tugas ini..."
                    {...register('instructions')}
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <Label>Petunjuk Singkat (Help Text)</Label>
                  <Input {...register('input_config.help_text')} placeholder="Berikan instruksi singkat yang muncul di bawah input" className="h-11 rounded-xl" />
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-end gap-3 p-8 pt-6 border-t bg-muted/5">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="rounded-2xl h-12 px-6 font-bold">Batal</Button>
              <Button type="submit" form="taskForm" disabled={isSubmitting} className="rounded-2xl h-12 min-w-[160px] font-black shadow-lg shadow-primary/20">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : editingTask ? 'Perbarui Data' : 'Simpan Informasi'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
