import React, { useState, useEffect } from 'react';
import { guruApi } from '@/api/guruApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Badge } from '@/components/common/Badge';
import { cn } from '@/utils/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, 
  faSearch, 
  faTrash, 
  faUserPlus, 
  faGraduationCap, 
  faSpinner, 
  faExclamationCircle,
  faEllipsisV,
  faUserCircle,
  faEnvelope,
  faIdCard,
  faPlus,
  faChevronRight,
  faTimes,
  faEdit,
  faSave
} from '@fortawesome/free-solid-svg-icons';
import { Modal } from '@/components/common/Modal';
import { Label } from '@/components/common/Label';
import toast from 'react-hot-toast';

export function StudentManagement() {
  const [myClass, setMyClass] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteData, setDeleteData] = useState({ isOpen: false, studentId: null, studentName: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchMyClass();
    fetchAvailableStudents();
  }, []);

  const fetchMyClass = async () => {
    try {
      const { data } = await guruApi.getMyClass();
      setMyClass(data.group);
    } catch (error) {
      toast.error('Gagal mengambil data kelas Anda');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAvailableStudents = async () => {
    try {
      const { data } = await guruApi.getAvailableStudents();
      setAvailableStudents(data.students || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddStudent = async (studentId) => {
    if (!myClass) return;
    try {
      await guruApi.addGroupStudents(myClass.id, [studentId]);
      toast.success('Siswa berhasil ditambahkan');
      fetchMyClass(); // refresh
    } catch (error) {
      toast.error('Gagal menambahkan siswa');
    }
  };

  const handleRemoveStudent = async () => {
    if (!myClass || !deleteData.studentId) return;
    setIsSaving(true);
    try {
      await guruApi.removeGroupStudent(myClass.id, deleteData.studentId);
      toast.success('Siswa dihapus dari kelas');
      setDeleteData({ isOpen: false, studentId: null, studentName: '' });
      fetchMyClass(); // refresh
    } catch (error) {
      toast.error('Gagal menghapus siswa');
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = (student) => {
    setDeleteData({
      isOpen: true,
      studentId: student.id,
      studentName: student.name
    });
  };

  const handleOpenEdit = (student) => {
    setEditingStudent({ ...student });
    setIsEditModalOpen(true);
  };

  const handleUpdateStudentDetail = async () => {
    if (!editingStudent) return;
    setIsSaving(true);
    try {
      await guruApi.updateStudent(editingStudent.id, {
        name: editingStudent.name,
        nis: editingStudent.nis,
        kelas: editingStudent.kelas,
        email: editingStudent.email
      });
      toast.success('Detail siswa berhasil diperbarui');
      setIsEditModalOpen(false);
      fetchMyClass(); // refresh list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal memperbarui detail siswa');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredStudents = availableStudents.filter(s => 
    (s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     s.nis?.includes(searchQuery)) &&
    !myClass?.students?.some(gs => gs.id === s.id)
  );

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse p-4">
        <div className="h-20 bg-slate-200 dark:bg-white/5 rounded-[2rem] w-2/3 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-24 bg-slate-100 dark:bg-white/5 rounded-3xl" />)}
          </div>
          <div className="lg:col-span-4 h-[400px] bg-slate-100 dark:bg-white/5 rounded-[2.5rem]" />
        </div>
      </div>
    );
  }

  if (!myClass) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="relative group max-w-lg w-full">
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-[3rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative bg-white dark:bg-slate-900 ring-1 ring-slate-900/5 dark:ring-white/10 rounded-[2.5rem] p-12 text-center shadow-2xl">
            <div className="w-20 h-20 bg-amber-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-amber-500">
              <FontAwesomeIcon icon={faExclamationCircle} size="2x" className="animate-pulse" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Akses Terbatas</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Anda belum ditetapkan sebagai Wali Kelas. Silakan hubungi Administrator untuk mendapatkan akses penuh ke manajemen siswa.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-1000">
      {/* Dynamic Header */}
      <div className="relative group">
        <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/10 to-sky-500/10 rounded-[3rem] blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/20 dark:border-white/10 p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-500/10">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-600 shadow-xl shadow-indigo-600/20 flex items-center justify-center text-white text-2xl">
              <FontAwesomeIcon icon={faGraduationCap} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-md">Wali Kelas</span>
              </div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                Kelas <span className="text-indigo-600">{myClass.name}</span>
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-0.5">Kelola dan organisir daftar siswa terdaftar.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-white/50 dark:bg-white/5 px-6 py-3 rounded-2xl border border-white dark:border-white/5 shadow-sm">
            <FontAwesomeIcon icon={faUsers} className="text-indigo-500" />
            <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">{myClass.students?.length || 0}</span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Siswa</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Main List Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-black tracking-tight flex items-center gap-3">
              <div className="w-2 h-8 bg-indigo-500 rounded-full" />
              Siswa Terdaftar
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {myClass.students?.map((s) => (
              <div key={s.id} className="relative group/card bg-white/60 dark:bg-white/[0.03] backdrop-blur-md border border-white dark:border-white/5 p-5 rounded-[2rem] transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-white/5 dark:to-white/10 flex items-center justify-center overflow-hidden">
                      <span className="text-xl font-black text-indigo-600 dark:text-indigo-400 transition-transform group-hover/card:scale-110 duration-500">
                        {s.name[0]}
                      </span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-white dark:border-slate-900 rounded-full" title="Active Account" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-lg font-black text-slate-900 dark:text-white leading-tight truncate group-hover/card:text-indigo-600 transition-colors">
                      {s.name}
                    </span>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                       <div className="flex items-center gap-1.5 bg-indigo-500/5 dark:bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/10">
                          <span className="text-[8px] font-black text-indigo-500 uppercase tracking-tighter">NIS:</span>
                          <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 tracking-wider font-mono">
                            {s.nis || '---'}
                          </span>
                       </div>
                       <div className="flex items-center gap-1.5 bg-sky-500/5 dark:bg-sky-500/10 px-2 py-0.5 rounded-md border border-sky-500/10">
                          <span className="text-[8px] font-black text-sky-500 uppercase tracking-tighter">Email:</span>
                          <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 tracking-tight truncate max-w-[140px]">
                            {s.email}
                          </span>
                       </div>
                       <div className="flex items-center gap-1.5 bg-emerald-500/5 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/10">
                          <span className="text-[8px] font-black text-emerald-500 uppercase tracking-tighter">Kelas:</span>
                          <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 tracking-wider">
                            {s.kelas || '---'}
                          </span>
                       </div>
                    </div>
                  </div>
                </div>

                <div className="relative flex items-center justify-end">
                   {/* Actions Revealed on Hover */}
                   <div className="flex items-center gap-2 opacity-0 group-hover/card:opacity-100 transition-all duration-300 pointer-events-none group-hover/card:pointer-events-auto z-30">
                      <Button 
                        variant="secondary"
                        size="icon"
                        onClick={(e) => { e.stopPropagation(); handleOpenEdit(s); }}
                        className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500 hover:text-white shadow-xl transition-all duration-300 active:scale-90"
                        title="Edit detail siswa"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </Button>
                      <Button 
                        variant="destructive"
                        size="icon"
                        onClick={(e) => { e.stopPropagation(); confirmDelete(s); }}
                        className="w-10 h-10 rounded-xl shadow-xl transition-all duration-300 active:scale-90 hover:rotate-6"
                        title="Hapus dari kelas"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                   </div>
                   
                   {/* Static Ellipsis - Disappears on Hover */}
                   <div className="absolute right-0 flex items-center justify-center w-10 h-10 text-slate-300 dark:text-slate-700 transition-opacity duration-300 group-hover/card:opacity-0 z-10">
                      <FontAwesomeIcon icon={faEllipsisV} />
                   </div>
                </div>
              </div>
            ))}

            {(!myClass.students || myClass.students.length === 0) && (
              <div className="flex flex-col items-center justify-center py-24 bg-white/40 dark:bg-white/[0.02] border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[3rem] text-center">
                 <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
                    <FontAwesomeIcon icon={faUsers} className="text-3xl text-slate-200 dark:text-slate-800" />
                 </div>
                 <h4 className="text-xl font-black text-slate-400">Kelas Masih Kosong</h4>
                 <p className="text-slate-400 mt-2 font-medium">Gunakan panel di samping untuk mencari dan menambahkan siswa.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-5 relative">
          <div className="sticky top-24 space-y-6">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-600/20 overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-150 transition-transform duration-700">
                <FontAwesomeIcon icon={faUserPlus} className="text-7xl" />
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-black mb-1">Tambah Siswa</h3>
                <p className="text-indigo-100 text-sm font-medium opacity-80 mb-6">Masukkan data siswa baru ke dalam rombel {myClass.name}.</p>
                
                <div className="relative group/search">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faSearch} className="text-white/40 group-focus-within/search:text-white transition-colors" />
                  </div>
                  <input 
                    type="text"
                    placeholder="Nama atau NIS..." 
                    className="w-full h-14 pl-12 pr-6 bg-white/10 hover:bg-white/20 focus:bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl outline-none placeholder:text-white/40 font-bold transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Suggestions Window */}
            <div className="bg-white/60 dark:bg-white/[0.03] backdrop-blur-md border border-white dark:border-white/5 rounded-[2.5rem] p-6 shadow-xl">
               <div className="flex items-center justify-between mb-4 px-2">
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Hasil Pencarian</span>
                 {searchQuery && (
                   <button onClick={() => setSearchQuery('')} className="text-[10px] font-bold text-indigo-500 hover:underline">Reset</button>
                 )}
               </div>
               
               <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                 {filteredStudents.length > 0 ? (
                   filteredStudents.slice(0, 10).map((s) => (
                     <div key={s.id} className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-800/40 border border-transparent hover:border-indigo-500/30 hover:bg-white dark:hover:bg-slate-800 rounded-2xl transition-all group/item">
                       <div className="flex flex-col min-w-0">
                         <span className="text-sm font-black tracking-tight text-slate-800 dark:text-slate-200 truncate">{s.name}</span>
                         <span className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">{s.nis || 'TANPA NIS'} • {s.kelas || 'N/A'}</span>
                       </div>
                       <button 
                         onClick={() => handleAddStudent(s.id)}
                         className="w-10 h-10 rounded-xl bg-indigo-500 shadow-lg shadow-indigo-500/20 text-white hover:scale-110 active:scale-95 transition-all flex items-center justify-center shrink-0"
                       >
                         <FontAwesomeIcon icon={faPlus} />
                       </button>
                     </div>
                   ))
                 ) : (
                   <div className="text-center py-12 opacity-50">
                      <FontAwesomeIcon icon={faUserCircle} className="text-4xl text-slate-200 dark:text-slate-800 mb-3" />
                      <p className="text-xs font-bold text-slate-400 italic">
                        {searchQuery ? 'Tidak ada siswa yang cocok.' : 'Silakan cari nama siswa.'}
                      </p>
                   </div>
                 )}
               </div>
            </div>
          </div>
        </div>
      </div>
      {/* Edit Student Modal */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)}
        title="Perbarui Detail Siswa"
        description="Edit informasi identitas siswa di rombel Anda."
        footer={
          <>
            <Button variant="ghost" className="h-12 rounded-2xl font-bold flex-1" onClick={() => setIsEditModalOpen(false)}>BATAL</Button>
            <Button 
              disabled={isSaving}
              className="h-12 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black flex-1 shadow-lg shadow-indigo-600/20"
              onClick={handleUpdateStudentDetail}
            >
              <FontAwesomeIcon icon={isSaving ? faSpinner : faSave} className={cn("mr-2", isSaving && "animate-spin")} />
              SIMPAN
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">NAMA LENGKAP</Label>
            <Input 
              value={editingStudent?.name || ''} 
              onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
              className="h-12 bg-white/50 dark:bg-white/5 rounded-2xl border-slate-200/50 dark:border-white/5 font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 font-display">NIS (NOMOR INDUK)</Label>
              <Input 
                value={editingStudent?.nis || ''} 
                onChange={(e) => setEditingStudent({ ...editingStudent, nis: e.target.value })}
                placeholder="12345"
                className="h-12 bg-white/50 dark:bg-white/5 rounded-2xl border-slate-200/50 dark:border-white/5 font-bold"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">KELAS</Label>
              <Input 
                value={editingStudent?.kelas || ''} 
                onChange={(e) => setEditingStudent({ ...editingStudent, kelas: e.target.value })}
                placeholder="12 RPL"
                className="h-12 bg-white/50 dark:bg-white/5 rounded-2xl border-slate-200/50 dark:border-white/5 font-bold"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">EMAIL KOMUNIKASI</Label>
            <Input 
              type="email"
              value={editingStudent?.email || ''} 
              onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
              className="h-12 bg-white/50 dark:bg-white/5 rounded-2xl border-slate-200/50 dark:border-white/5 font-bold"
            />
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={deleteData.isOpen} 
        onClose={() => setDeleteData({ ...deleteData, isOpen: false })}
        title="Hapus Siswa?"
        description={`Anda akan menghapus ${deleteData.studentName} dari kelas. Tindakan ini tidak dapat dibatalkan.`}
        footer={
          <>
            <Button variant="ghost" className="h-12 rounded-2xl font-bold flex-1" onClick={() => setDeleteData({ ...deleteData, isOpen: false })}>BATAL</Button>
            <Button 
              disabled={isSaving}
              variant="destructive"
              className="h-12 rounded-2xl font-black flex-1 shadow-lg shadow-rose-500/20"
              onClick={handleRemoveStudent}
            >
              <FontAwesomeIcon icon={isSaving ? faSpinner : faTrash} className={cn("mr-2", isSaving && "animate-spin")} />
              HAPUS SISWA
            </Button>
          </>
        }
      >
        <div className="p-4 bg-rose-50 dark:bg-rose-500/5 rounded-2xl border border-rose-100 dark:border-rose-500/10">
           <p className="text-sm font-medium text-rose-600 dark:text-rose-400 leading-relaxed text-center">
             Siswa ini akan dihapus dari rombel Anda, tetapi data akun siswa tersebut tetap ada di sistem.
           </p>
        </div>
      </Modal>
    </div>
  );
}
