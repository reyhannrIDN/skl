import React, { useEffect, useState, useMemo } from 'react';
import { adminApi } from '@/api/adminApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Badge } from '@/components/common/Badge';
import { Label } from '@/components/common/Label';
import { 
  Search, Plus, Loader2, Edit, Trash2, Key, 
  Filter, CheckCircle2, XCircle, GraduationCap,
  Users, UserCheck, ShieldCheck, Mail,
  ChevronLeft, ChevronRight, Hash, Building2,
  Sparkles, SlidersHorizontal, UserPlus,
  ArrowRight, MoreVertical, ShieldAlert,
  SearchCode, Info, Activity, UserCog
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';

export function UserManagement() {
  const [users, setUsers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', role: '', status: '' });
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();

  useEffect(() => {
    fetchUsers();
    fetchClasses();
  }, [filters.role, filters.status]);

  const fetchClasses = async () => {
    try {
      const { data } = await adminApi.getClasses();
      setClasses(data.classes || []);
    } catch (error) {
      console.error('Gagal mengambil data kelas', error);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await adminApi.getUsers(filters);
      setUsers(data.data || []);
    } catch (error) {
      toast.error('Gagal mengambil data pengguna');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const stats = useMemo(() => {
    return {
      total: users.length,
      active: users.filter(u => u.is_active).length,
      pending: users.filter(u => !u.is_active).length,
      guru: users.filter(u => u.role === 'guru').length,
    };
  }, [users]);

  const openAddModal = () => {
    setEditingUser(null);
    reset({ name: '', email: '', role: 'siswa', is_active: true, teaching_group_ids: [] });
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    const formData = { ...user, is_active: String(user.is_active) };
    if (user.role === 'guru') {
      if (user.teaching_groups) {
        formData.teaching_group_ids = user.teaching_groups.map(g => g.id);
      }
      formData.specialty_select = ['IT', 'Diniyah', 'English'].includes(user.specialty) ? user.specialty : (user.specialty ? 'Lainnya' : '');
    } else {
      formData.teaching_group_ids = [];
    }
    reset(formData);
    setIsModalOpen(true);
  };

  const onSubmitForm = async (data) => {
    setIsSubmitting(true);
    try {
      if (data.role !== 'siswa') { data.nis = null; data.angkatan = null; }
      if (data.role !== 'guru') { data.nip = null; }
      if (typeof data.is_active === 'string') { data.is_active = data.is_active === 'true'; }

      if (editingUser) {
        if (!data.password) delete data.password;
        await adminApi.updateUser(editingUser.id, data);
        toast.success('Pengguna berhasil diperbarui');
      } else {
        await adminApi.createUser(data);
        toast.success('Pengguna berhasil ditambahkan');
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menyimpan pengguna');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: 'Apakah Anda Yakin?',
      text: `Anda akan menghapus pengguna '${name}'. Tindakan ini tidak dapat dibatalkan!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
      background: 'hsl(var(--background))',
      color: 'hsl(var(--foreground))',
    });

    if (result.isConfirmed) {
      try {
        await adminApi.deleteUser(id);
        Swal.fire({
          title: 'Terhapus!',
          text: 'Pengguna berhasil dihapus.',
          icon: 'success',
          background: 'hsl(var(--background))',
          color: 'hsl(var(--foreground))',
        });
        fetchUsers();
      } catch (error) {
        Swal.fire({
          title: 'Gagal!',
          text: 'Gagal menghapus pengguna.',
          icon: 'error',
          background: 'hsl(var(--background))',
          color: 'hsl(var(--foreground))',
        });
      }
    }
  };

  const handleResetPassword = async (id, name) => {
    const result = await Swal.fire({
      title: 'Reset Password?',
      text: `Password untuk pengguna '${name}' akan direset.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#f59e0b',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Ya, Reset',
      cancelButtonText: 'Batal',
      background: 'hsl(var(--background))',
      color: 'hsl(var(--foreground))',
    });

    if (result.isConfirmed) {
      try {
        const { data } = await adminApi.resetPassword(id, {});
        Swal.fire({
          title: 'Berhasil Direset!',
          html: `Password baru untuk <b>${name}</b> adalah:<br><br><span style="font-size: 1.5rem; font-weight: bold; background: #f1f5f9; padding: 0.5rem 1rem; border-radius: 0.5rem; color: #0f172a;">${data.new_password}</span>`,
          icon: 'success',
          background: 'hsl(var(--background))',
          color: 'hsl(var(--foreground))',
        });
      } catch (error) {
        Swal.fire({
          title: 'Gagal!',
          text: 'Terjadi kesalahan saat mereset password.',
          icon: 'error',
          background: 'hsl(var(--background))',
          color: 'hsl(var(--foreground))',
        });
      }
    }
  };

  const handleToggleStatus = async (user) => {
    const newStatus = !user.is_active;
    const actionText = newStatus ? 'Mengaktifkan' : 'Men-suspend';
    const actionColor = newStatus ? '#10b981' : '#f43f5e';
    
    const result = await Swal.fire({
      title: `${actionText} Akun?`,
      text: `Anda akan ${actionText.toLowerCase()} akun '${user.name}'.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: actionColor,
      cancelButtonColor: '#94a3b8',
      confirmButtonText: `Ya, Lanjutkan`,
      cancelButtonText: 'Batal',
      background: 'hsl(var(--background))',
      color: 'hsl(var(--foreground))',
    });

    if (result.isConfirmed) {
      try {
        await adminApi.updateUser(user.id, { is_active: newStatus });
        Swal.fire({
          title: 'Berhasil!',
          text: `Akun ${user.name} berhasil ${newStatus ? 'diaktifkan' : 'disuspend'}.`,
          icon: 'success',
          background: 'hsl(var(--background))',
          color: 'hsl(var(--foreground))',
        });
        fetchUsers();
      } catch (error) {
        Swal.fire({
          title: 'Gagal!',
          text: 'Gagal mengubah status akun.',
          icon: 'error',
          background: 'hsl(var(--background))',
          color: 'hsl(var(--foreground))',
        });
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      className="w-full space-y-6 md:space-y-10 pb-20 px-2 sm:px-4 lg:px-8 max-w-full"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Mesh Gradient Background Decor */}
      <div className="fixed top-0 right-0 -z-10 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-primary/5 rounded-full blur-[80px] md:blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="fixed bottom-0 left-0 -z-10 w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-indigo-500/5 rounded-full blur-[70px] md:blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      {/* Header Section - Fluid Flex */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <motion.div variants={itemVariants} className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
             <div className="flex-shrink-0 p-2 md:p-3 bg-primary rounded-xl md:rounded-2xl text-white shadow-xl shadow-primary/20">
               <UserCog className="w-6 h-6 md:w-8 md:h-8" />
             </div>
             <div className="min-w-0">
                <Badge variant="outline" className="hidden sm:inline-flex mb-1 bg-background/50 border-primary/20 text-primary px-3 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase">
                  Directory Management
                </Badge>
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-tight truncate">Direktori Pengguna</h1>
             </div>
          </div>
          <p className="text-muted-foreground text-sm md:text-lg max-w-2xl font-medium leading-relaxed truncate-3-lines">
            Kelola akses siswa, guru, dan admin dalam satu platform terintegrasi yang responsif.
          </p>
        </motion.div>
        
        <motion.div variants={itemVariants} className="w-full lg:w-auto">
          <Button 
            onClick={openAddModal} 
            className="w-full sm:w-auto h-12 md:h-16 px-6 md:px-10 rounded-xl md:rounded-[2rem] font-black text-sm md:text-base gap-3 shadow-lg shadow-primary/20 hover:-translate-y-1 transition-all"
          >
            <UserPlus className="w-5 h-5 md:w-6 md:h-6" />
            <span>Tambah Baru</span>
          </Button>
        </motion.div>
      </div>

      {/* Quick Stats - Fluid Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Total Pengguna', value: stats.total, icon: Users, color: 'text-blue-600', bg: 'bg-blue-500/10' },
          { label: 'Akun Aktif', value: stats.active, icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
          { label: 'Menunggu ACC', value: stats.pending, icon: ShieldAlert, color: 'text-rose-600', bg: 'bg-rose-500/10' },
          { label: 'Total Guru', value: stats.guru, icon: GraduationCap, color: 'text-indigo-600', bg: 'bg-indigo-500/10' },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-xl shadow-black/[0.02] rounded-2xl md:rounded-[2rem] overflow-hidden group hover:shadow-primary/5 transition-all duration-300">
            <CardContent className="p-4 md:p-6 flex items-center gap-4 md:gap-6">
               <div className={`p-3 md:p-4 rounded-xl md:rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                 <stat.icon className="w-6 h-6 md:w-8 md:h-8" />
               </div>
               <div className="min-w-0">
                 <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground/60 truncate">{stat.label}</p>
                 <h3 className="text-xl md:text-3xl font-black text-foreground truncate">{stat.value}</h3>
               </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Filters - Flexible Flexbox */}
      <motion.div variants={itemVariants}>
        <Card className="border-none shadow-xl shadow-black/[0.02] rounded-2xl md:rounded-[2.5rem] overflow-hidden glass-panel border border-white/40">
          <CardContent className="p-4 md:p-8">
            <form onSubmit={handleSearchSubmit} className="flex flex-col xl:flex-row gap-4 md:gap-6">
              <div className="flex-1 relative group">
                <Search className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 h-5 w-5 md:h-6 md:w-6 text-muted-foreground group-focus-within:text-primary transition-all" />
                <Input 
                  placeholder="Cari nama, email, atau ID..." 
                  className="h-12 md:h-16 pl-12 md:pl-14 pr-6 rounded-xl md:rounded-2xl bg-white/50 border-transparent focus:bg-white focus:shadow-xl focus:border-primary/20 transition-all font-bold text-sm md:text-lg w-full"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
                <div className="relative flex-1 sm:min-w-[180px]">
                  <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-muted-foreground pointer-events-none" />
                  <select 
                    className="h-12 md:h-16 w-full pl-10 md:pl-12 pr-10 rounded-xl md:rounded-2xl bg-white/50 border-transparent focus:bg-white focus:border-primary/20 transition-all text-xs md:text-sm font-black uppercase tracking-widest appearance-none cursor-pointer"
                    value={filters.role}
                    onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
                  >
                    <option value="">Semua Role</option>
                    <option value="siswa">Siswa</option>
                    <option value="guru">Guru</option>
                    <option value="superadmin">Admin</option>
                  </select>
                </div>
                <div className="relative flex-1 sm:min-w-[180px]">
                  <Activity className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-muted-foreground pointer-events-none" />
                  <select 
                    className="h-12 md:h-16 w-full pl-10 md:pl-12 pr-10 rounded-xl md:rounded-2xl bg-white/50 border-transparent focus:bg-white focus:border-primary/20 transition-all text-xs md:text-sm font-black uppercase tracking-widest appearance-none cursor-pointer"
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="">Semua Status</option>
                    <option value="active">Aktif</option>
                    <option value="inactive">Nonaktif</option>
                  </select>
                </div>
                <Button type="submit" className="h-12 md:h-16 px-6 md:px-8 rounded-xl md:rounded-2xl font-black bg-foreground text-background hover:bg-primary hover:text-white transition-all w-full sm:w-auto">
                  Terapkan
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main List Section - Fluid Grid & Flex Cards */}
      <motion.div variants={itemVariants} className="space-y-4 md:space-y-6">
        <AnimatePresence mode="popLayout">
          {loading ? (
            <div className="py-20 md:py-40 flex flex-col items-center justify-center space-y-6">
               <Loader2 className="w-10 h-10 md:w-16 md:h-16 animate-spin text-primary" />
               <p className="text-sm md:text-xl font-black text-muted-foreground uppercase tracking-widest animate-pulse">Menghubungkan Data...</p>
            </div>
          ) : users.length === 0 ? (
            <Card className="border-none shadow-xl shadow-black/[0.02] rounded-2xl md:rounded-[3rem] py-20 md:py-32 flex flex-col items-center text-center px-6">
               <div className="p-6 md:p-8 bg-muted rounded-2xl md:rounded-[2.5rem] mb-4 md:mb-6 opacity-30">
                 <SearchCode className="w-12 h-12 md:w-20 md:h-20" />
               </div>
               <h3 className="text-xl md:text-3xl font-black text-foreground mb-2">Data Tidak Ditemukan</h3>
               <p className="text-muted-foreground font-medium text-sm md:text-base max-w-sm">Coba ubah kata kunci atau filter pencarian Anda.</p>
            </Card>
          ) : (
            users.map((u, idx) => (
              <motion.div 
                key={u.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.02 }}
                className="w-full"
              >
                <Card className={`group border-none shadow-lg shadow-black/[0.02] rounded-2xl md:rounded-[2rem] overflow-hidden hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 border border-transparent ${!u.is_active ? 'bg-rose-50/50 dark:bg-rose-950/10 border-rose-500/10' : 'bg-background hover:border-primary/10'}`}>
                  <CardContent className="p-0">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-4 divide-y lg:divide-y-0 lg:divide-x divide-dashed divide-muted-foreground/10">
                      
                      {/* Identity Column (Col 1-4) */}
                      <div className="p-5 md:p-6 lg:col-span-4 flex items-center gap-4">
                         <div className={`relative flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-[1.2rem] flex items-center justify-center font-black text-xl md:text-2xl shadow-md transition-transform duration-300 ${u.is_active ? 'bg-primary text-white shadow-primary/20' : 'bg-muted text-muted-foreground shadow-black/5'}`}>
                           {u.name.charAt(0)}
                           {u.is_active && <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />}
                         </div>
                         <div className="min-w-0 flex-1">
                            <h4 className="text-lg md:text-xl font-black text-foreground group-hover:text-primary transition-colors leading-tight truncate">{u.name}</h4>
                            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mt-1 truncate">
                              <Mail className="w-3.5 h-3.5 flex-shrink-0 opacity-70" /> 
                              <span className="truncate">{u.email}</span>
                            </div>
                         </div>
                      </div>

                      {/* Info & Metadata Column (Col 5-9) */}
                      <div className="p-5 md:p-6 lg:col-span-5 flex flex-col sm:flex-row gap-6 sm:items-center justify-between">
                         {/* Role */}
                         <div className="space-y-2 flex-shrink-0">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 opacity-70">
                              <ShieldCheck className="w-3 h-3" /> Hak Akses
                            </p>
                            <Badge 
                              variant={u.role === 'superadmin' ? 'destructive' : u.role === 'guru' ? 'default' : 'secondary'} 
                              className="h-8 px-4 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest shadow-sm"
                            >
                              {u.role}
                            </Badge>
                         </div>

                         {/* Meta */}
                         <div className="space-y-2 flex-1 min-w-0">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 opacity-70">
                              <Info className="w-3 h-3" /> Data Spesifik
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {u.role === 'siswa' && (
                                <>
                                  <div className="px-3 py-1.5 bg-muted/40 rounded-lg border border-border/50 flex items-center gap-2 max-w-full">
                                    <Hash className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                                    <span className="text-xs font-bold truncate">NIS: {u.nis || '-'}</span>
                                  </div>
                                  <div className="px-3 py-1.5 bg-muted/40 rounded-lg border border-border/50 flex items-center gap-2 max-w-full">
                                    <Building2 className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                                    <span className="text-xs font-bold truncate">{u.kelas || '-'}</span>
                                  </div>
                                </>
                              )}
                              {u.role === 'guru' && (
                                <>
                                  <div className="px-3 py-1.5 bg-muted/40 rounded-lg border border-border/50">
                                    <span className="text-[10px] font-bold text-muted-foreground mr-1">NIP:</span>
                                    <span className="text-xs font-bold truncate uppercase">{u.nip || '-'}</span>
                                  </div>
                                  {u.specialty && (
                                    <div className="px-3 py-1.5 bg-indigo-500/10 text-indigo-600 rounded-lg border border-indigo-500/20 flex items-center gap-2">
                                      <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
                                      <span className="text-[10px] font-bold uppercase truncate">{u.specialty}</span>
                                    </div>
                                  )}
                                </>
                              )}
                              {u.role === 'superadmin' && <span className="text-xs font-medium text-muted-foreground/60 italic">Full Access</span>}
                            </div>
                         </div>
                      </div>

                      {/* Actions Column (Col 10-12) */}
                      <div className="p-5 md:p-6 lg:col-span-3 flex items-center lg:justify-end">
                         <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                            {!u.is_active ? (
                              <Button 
                                variant="outline" size="sm" className="h-10 px-3 md:px-4 rounded-xl border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white dark:bg-emerald-500/10 dark:border-emerald-500/20 font-bold transition-all flex-1 lg:flex-none" 
                                onClick={() => handleToggleStatus(u)}
                              >
                                <CheckCircle2 className="w-4 h-4 mr-2" /> Setujui
                              </Button>
                            ) : (
                              <Button 
                                variant="outline" size="sm" className="h-10 px-3 md:px-4 rounded-xl border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white dark:bg-rose-500/10 dark:border-rose-500/20 font-bold transition-all flex-1 lg:flex-none" 
                                onClick={() => handleToggleStatus(u)}
                              >
                                <XCircle className="w-4 h-4 mr-2" /> Suspend
                              </Button>
                            )}
                            
                            <Button 
                              variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-amber-500 hover:bg-amber-500/10 transition-all flex-shrink-0" 
                              onClick={() => handleResetPassword(u.id, u.name)} title="Reset Password"
                            >
                              <Key className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-primary hover:bg-primary/10 transition-all flex-shrink-0" 
                              onClick={() => openEditModal(u)} title="Edit Profil"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-destructive hover:bg-destructive/10 transition-all flex-shrink-0" 
                              onClick={() => handleDelete(u.id, u.name)} title="Hapus User"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                         </div>
                      </div>

                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>

      {/* Modal - Ultra Responsive & Neat Design */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-4xl max-h-[90vh] flex flex-col bg-background rounded-[2rem] shadow-2xl overflow-hidden border border-border/50 relative"
            >
              {/* Close Button - Fixed Top Right */}
              <div className="absolute top-4 right-4 md:top-6 md:right-6 z-10">
                <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 bg-muted/50 hover:bg-muted" onClick={() => setIsModalOpen(false)}>
                  <XCircle className="w-5 h-5 text-muted-foreground" />
                </Button>
              </div>

              {/* Modal Header */}
              <div className="bg-muted/30 p-6 md:p-8 border-b border-border/50 flex-shrink-0">
                <div className="flex items-center gap-4 md:gap-5">
                  <div className="p-3 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20">
                    {editingUser ? <UserCog className="w-6 h-6 md:w-8 md:h-8" /> : <UserPlus className="w-6 h-6 md:w-8 md:h-8" />}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-xl md:text-3xl font-black tracking-tight text-foreground">{editingUser ? 'Perbarui Profil Pengguna' : 'Tambah Entitas Baru'}</h2>
                    <p className="text-sm md:text-base font-medium text-muted-foreground mt-1">Lengkapi informasi identitas dan hak akses untuk pengguna ini.</p>
                  </div>
                </div>
              </div>
              
              {/* Modal Body - Scrollable */}
              <div className="overflow-y-auto p-6 md:p-8 flex-grow custom-scrollbar">
                <form id="userForm" onSubmit={handleSubmit(onSubmitForm)} className="space-y-8">
                  
                  {/* Section 1: Informasi Dasar */}
                  <div>
                    <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-4 flex items-center gap-2 border-b pb-2">
                      <Info className="w-4 h-4" /> Informasi Dasar
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="name" className="text-xs font-bold text-muted-foreground">Nama Lengkap *</Label>
                        <Input id="name" className="h-12 px-4 rounded-xl bg-muted/30 border-transparent focus:bg-background focus:border-primary transition-all font-bold text-base" placeholder="Masukkan nama lengkap" {...register('name', { required: true })} />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-xs font-bold text-muted-foreground">Email Sekolah *</Label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input id="email" type="email" className="h-12 pl-10 px-4 rounded-xl bg-muted/30 border-transparent focus:bg-background focus:border-primary transition-all font-bold" placeholder="user@school.id" {...register('email', { required: true })} />
                        </div>
                      </div>

                      {!editingUser && (
                        <div className="space-y-2">
                          <Label htmlFor="password" className="text-xs font-bold text-muted-foreground">Sandi Akses (Opsional)</Label>
                          <div className="relative">
                            <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input id="password" type="password" className="h-12 pl-10 px-4 rounded-xl bg-muted/30 border-transparent focus:bg-background focus:border-primary transition-all font-bold" placeholder="Biarkan kosong untuk default" {...register('password')} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Section 2: Hak Akses & Status */}
                  <div>
                    <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-4 flex items-center gap-2 border-b pb-2">
                      <ShieldCheck className="w-4 h-4" /> Akses & Keamanan
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-muted-foreground">Peran / Role *</Label>
                        <select 
                          className="h-12 w-full px-4 rounded-xl bg-muted/30 border-transparent focus:bg-background focus:border-primary transition-all font-bold text-sm appearance-none cursor-pointer"
                          {...register('role')}
                        >
                          <option value="siswa">Siswa (Student)</option>
                          <option value="guru">Guru (Instructor)</option>
                          <option value="superadmin">Admin (System)</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-muted-foreground">Status Akun</Label>
                        <select 
                          className="h-12 w-full px-4 rounded-xl bg-muted/30 border-transparent focus:bg-background focus:border-primary transition-all font-bold text-sm appearance-none cursor-pointer"
                          {...register('is_active')}
                        >
                          <option value="true">Aktif (Approved)</option>
                          <option value="false">Nonaktif (Pending)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Data Spesifik Role */}
                  <div className="bg-muted/20 p-5 rounded-2xl border border-border/50">
                     <h3 className="text-sm font-black text-indigo-600 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-indigo-500/10 pb-2">
                       <SearchCode className="w-4 h-4" /> Metadata Entitas
                     </h3>
                     
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                       <div className="space-y-2">
                         <Label className="text-xs font-bold text-muted-foreground">Nomor Induk (NIS/NIP)</Label>
                         <Input {...register('nis')} placeholder="NIS untuk Siswa" className="h-12 px-4 rounded-xl bg-background border-muted focus:border-primary shadow-sm font-medium mb-2" />
                         <Input {...register('nip')} placeholder="NIP untuk Guru" className="h-12 px-4 rounded-xl bg-background border-muted focus:border-primary shadow-sm font-medium" />
                       </div>
                       <div className="space-y-2">
                         <Label className="text-xs font-bold text-muted-foreground">Grup / Angkatan</Label>
                         <Input {...register('kelas')} placeholder="Kelas (mis. XII RPL 1)" className="h-12 px-4 rounded-xl bg-background border-muted focus:border-primary shadow-sm font-medium mb-2" />
                         <Input type="number" {...register('angkatan')} placeholder="Tahun Angkatan" className="h-12 px-4 rounded-xl bg-background border-muted focus:border-primary shadow-sm font-medium" />
                       </div>
                     </div>

                     {/* Guru Extended Features */}
                     {(editingUser?.role === 'guru' || watch('role') === 'guru') && (
                       <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-6 pt-6 border-t border-indigo-500/10">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label className="text-xs font-bold text-indigo-600">Spesialisasi Pengajaran</Label>
                              <div className="flex flex-col gap-2">
                                <select 
                                  className="h-12 w-full px-4 rounded-xl bg-background border-muted focus:border-primary text-sm font-bold appearance-none cursor-pointer shadow-sm"
                                  {...register('specialty_select')}
                                  onChange={(e) => {
                                    if (e.target.value !== 'Lainnya') setValue('specialty', e.target.value);
                                    else setValue('specialty', '');
                                  }}
                                >
                                  <option value="">Pilih Spesialisasi...</option>
                                  <option value="IT">IT & Software Engineering</option>
                                  <option value="Diniyah">Keagamaan & Diniyah</option>
                                  <option value="English">Bahasa Inggris</option>
                                  <option value="Lainnya">Lainnya (Isi Manual)</option>
                                </select>
                                {(watch('specialty_select') === 'Lainnya' || (!['IT', 'Diniyah', 'English', ''].includes(watch('specialty') || '') && watch('specialty'))) && (
                                  <Input 
                                    {...register('specialty')} 
                                    placeholder="Ketik spesialisasi..." 
                                    className="h-12 px-4 rounded-xl bg-background border-muted focus:border-primary shadow-sm font-bold"
                                  />
                                )}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-xs font-bold text-indigo-600 flex justify-between items-end">
                                Alokasi Kelas 
                                <span className="text-[10px] text-muted-foreground bg-background px-2 py-0.5 rounded border">Pilih yang diampu</span>
                              </Label>
                              <div className="grid grid-cols-2 gap-2 p-3 bg-background rounded-xl border border-muted max-h-[160px] overflow-y-auto custom-scrollbar">
                                {classes.map(cls => (
                                  <label key={cls.id} className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-border">
                                    <input 
                                      type="checkbox" 
                                      className="h-4 w-4 rounded border-muted-foreground/30 text-primary focus:ring-primary"
                                      checked={watch('teaching_group_ids')?.includes(cls.id) || watch('teaching_group_ids')?.includes(String(cls.id))}
                                      onChange={(e) => {
                                        const id = parseInt(e.target.value);
                                        const current = watch('teaching_group_ids') || [];
                                        if (e.target.checked) setValue('teaching_group_ids', [...current, id]);
                                        else setValue('teaching_group_ids', current.filter(cid => cid !== id));
                                      }}
                                      value={cls.id}
                                    />
                                    <span className="text-xs font-bold text-foreground/80 truncate">{cls.name}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          </div>
                       </motion.div>
                     )}
                  </div>
                </form>
              </div>
              
              {/* Modal Footer - Fixed Bottom */}
              <div className="bg-muted/10 p-5 md:p-6 border-t border-border/50 flex flex-col-reverse sm:flex-row justify-end gap-3 flex-shrink-0">
                <Button type="button" variant="ghost" className="h-12 px-6 rounded-xl font-bold text-muted-foreground hover:bg-muted" onClick={() => setIsModalOpen(false)}>
                  Batalkan
                </Button>
                <Button 
                  type="submit" 
                  form="userForm" 
                  disabled={isSubmitting} 
                  className="h-12 px-8 rounded-xl font-bold bg-primary text-white shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                  {isSubmitting ? 'Menyimpan...' : 'Selesaikan & Simpan'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
