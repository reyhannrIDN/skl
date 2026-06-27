import React, { useState, useEffect } from 'react';
import { guruApi } from '@/api/guruApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Badge } from '@/components/common/Badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, faTrash, faSave, faFileAlt, faLink, faCloud, 
  faCog, faChevronRight, faChevronLeft, faCalendarAlt, faClock, 
  faLayerGroup, faInfoCircle, faExclamationTriangle, faSearch,
  faCheckCircle, faFolderOpen, faFileSignature, faLightbulb
} from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { cn } from '@/utils/utils';

export function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editingCategory, setEditingCategory] = useState({ 
    name: '', 
    description: '',
    start_date: '',
    end_date: ''
  });
  const [requirements, setRequirements] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await guruApi.getCategories();
      setCategories(data.categories);
    } catch (error) {
      toast.error('Gagal mengambil data kategori');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    setEditingCategory({ 
      name: cat.name, 
      description: cat.description || '',
      start_date: cat.start_date ? dayjs(cat.start_date).format('YYYY-MM-DD') : '',
      end_date: cat.end_date ? dayjs(cat.end_date).format('YYYY-MM-DD') : ''
    });
    setRequirements(cat.requirements || []);
  };

  const handleAddCategory = async () => {
    try {
      const { data } = await guruApi.createCategory({ name: 'Kategori Baru' });
      setCategories([...categories, data.category]);
      handleSelectCategory(data.category);
      toast.success('Kategori baru dibuat');
    } catch (error) {
      toast.error('Gagal membuat kategori');
    }
  };

  const handleSaveCategory = async () => {
    if (!selectedCategory) return;
    try {
      await guruApi.updateCategory(selectedCategory.id, editingCategory);
      await guruApi.updateRequirements(selectedCategory.id, { requirements });
      toast.success('Perubahan berhasil disimpan');
      fetchCategories();
    } catch (error) {
      toast.error('Gagal menyimpan perubahan');
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    setIsDeleting(true);
    try {
      await guruApi.deleteCategory(selectedCategory.id);
      toast.success('Kategori berhasil dihapus');
      setSelectedCategory(null);
      setIsDeleteModalOpen(false);
      fetchCategories();
    } catch (error) {
      toast.error('Gagal menghapus kategori');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddRequirement = () => {
    setRequirements([
      ...requirements,
      { label: 'Requirement Baru', type: 'local_file', is_required: true }
    ]);
  };

  const handleUpdateRequirement = (index, field, value) => {
    const updated = [...requirements];
    updated[index] = { ...updated[index], [field]: value };
    setRequirements(updated);
  };

  const handleRemoveRequirement = (index) => {
    const updated = requirements.filter((_, i) => i !== index);
    setRequirements(updated);
  };

  const getDeadlineStatus = (endDate) => {
    if (!endDate) return null;
    const now = dayjs();
    const end = dayjs(endDate);
    if (now.isAfter(end)) return { label: 'Expired', color: 'bg-rose-500', text: 'text-rose-500' };
    if (end.diff(now, 'day') <= 7) return { label: 'Segera Berakhir', color: 'bg-amber-500', text: 'text-amber-500' };
    return { label: 'Aktif', color: 'bg-emerald-500', text: 'text-emerald-500' };
  };

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-sm font-bold text-slate-500 animate-pulse">Menyiapkan Manajemen Kategori...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-700 pb-20 relative">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 dark:bg-indigo-600/10 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-500/5 dark:bg-violet-600/5 blur-[100px] rounded-full -z-10" />

      {/* Header section with Stats Context */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white font-display">
            Manajemen <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Kategori</span>
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
             <Badge className="w-fit bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-none font-bold py-1 px-3 rounded-full flex items-center gap-2">
                <FontAwesomeIcon icon={faLayerGroup} className="text-[10px]" />
                {categories.length} Total Kategori
             </Badge>
             <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
             <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Kustomisasi parameter submission project.</p>
          </div>
        </div>
        <Button 
          onClick={handleAddCategory} 
          className="w-full md:w-auto justify-center h-14 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-xl shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95 gap-3 shrink-0"
        >
          <FontAwesomeIcon icon={faPlus} /> Tambah Kategori
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start w-full">
        {/* Category Sidebar */}
        <div className={cn(
           "w-full shrink-0 flex flex-col gap-4",
           selectedCategory ? "hidden" : "flex lg:w-[35%]"
        )}>
           <Card className="border-none shadow-2xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] overflow-hidden border border-white dark:border-white/5">
             <CardHeader className="px-8 pt-8 pb-4">
               <CardTitle className="text-xl font-black flex items-center gap-3">
                 <FontAwesomeIcon icon={faFolderOpen} className="text-indigo-500" />
                 Daftar Kategori
               </CardTitle>
             </CardHeader>
             <CardContent className="p-4 space-y-2">
                {categories.map((cat) => {
                  const status = getDeadlineStatus(cat.end_date);
                  const isSelected = selectedCategory?.id === cat.id;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleSelectCategory(cat)}
                      className={cn(
                        "group w-full flex flex-col p-5 rounded-[1.75rem] transition-all duration-500 relative overflow-hidden",
                        isSelected 
                          ? "bg-white dark:bg-indigo-600 shadow-2xl shadow-indigo-500/10 scale-[1.02] z-10" 
                          : "bg-white/30 dark:bg-white/[0.02] hover:bg-white/70 dark:hover:bg-white/[0.05] border border-white/50 dark:border-white/5"
                      )}
                    >
                      <div className="flex items-center justify-between w-full mb-3">
                         <div className={cn(
                           "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                           isSelected ? "bg-indigo-500 text-white shadow-lg" : "bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-indigo-500"
                         )}>
                            <FontAwesomeIcon icon={faFileSignature} className="text-xl" />
                         </div>
                         <div className="flex items-center gap-2">
                            {status && (
                               <Badge className={cn("px-2 py-0.5 rounded-lg border-none text-[10px] font-bold uppercase tracking-tighter", 
                                  isSelected ? "bg-white/20 text-white" : `${status.color}/10 ${status.text}`
                               )}>
                                  {status.label}
                               </Badge>
                            )}
                            <FontAwesomeIcon 
                              icon={faChevronRight} 
                              className={cn("text-[10px] transition-transform duration-500", 
                                isSelected ? "text-white translate-x-1" : "text-slate-300 group-hover:translate-x-1"
                              )} 
                            />
                         </div>
                      </div>
                      <div className="text-left w-full space-y-1">
                        <span className={cn("text-lg font-black block transition-colors", isSelected ? "text-white" : "text-slate-800 dark:text-slate-200")}>
                           {cat.name}
                        </span>
                        <div className="flex items-center gap-3">
                           <span className={cn("text-xs font-bold", isSelected ? "text-white/70" : "text-slate-400")}>
                             {cat.requirements?.length || 0} Requirements
                           </span>
                           {cat.end_date && (
                              <span className={cn("text-[10px] font-black flex items-center gap-1.5", isSelected ? "text-white/60" : "text-slate-500")}>
                                 <FontAwesomeIcon icon={faClock} className="text-[9px]" />
                                 {dayjs(cat.end_date).format('DD MMM YYYY')}
                              </span>
                           )}
                        </div>
                      </div>
                    </button>
                  );
                })}
             </CardContent>
           </Card>
        </div>

        {/* Main Editor Section */}
        <div className={cn(
           "w-full flex-1 flex flex-col gap-8",
           selectedCategory ? "flex" : "hidden lg:flex lg:w-[65%]"
        )}>
          {selectedCategory ? (
            <div className="space-y-8 animate-in slide-in-from-right-10 duration-700">
               <button 
                  onClick={() => setSelectedCategory(null)}
                  className="flex items-center gap-3 text-slate-500 hover:text-indigo-600 font-bold px-4 py-2 bg-white/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 rounded-xl transition-all w-fit shadow-sm border border-slate-200 dark:border-white/10 hover:shadow-md hover:-translate-x-1"
               >
                  <FontAwesomeIcon icon={faChevronLeft} /> Kembali ke Daftar Kategori
               </button>

               {/* Identity Header */}
               <Card className="border-none shadow-2xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white rounded-[2.5rem] overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full -mr-20 -mt-20" />
                  <CardContent className="p-10 relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                     <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center shadow-2xl">
                           <FontAwesomeIcon icon={faCog} className="text-4xl text-white animate-spin-slow" style={{ animationDuration: '8s' }} />
                        </div>
                        <div className="space-y-2">
                           <p className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-100/70">Category Identity</p>
                           <h2 className="text-3xl font-black leading-none">{selectedCategory.name}</h2>
                           <p className="text-indigo-100/80 text-sm font-medium line-clamp-1">{selectedCategory.description || 'Pusat pengaturan metadata dan requirements project.'}</p>
                        </div>
                     </div>
                     <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                       <Button 
                         variant="ghost"
                         onClick={() => setIsDeleteModalOpen(true)}
                         className="w-full sm:w-auto justify-center h-16 px-6 rounded-[1.5rem] bg-white/10 text-white hover:bg-rose-500 hover:text-white border border-white/20 hover:border-transparent font-bold transition-all shadow-xl"
                         title="Hapus Kategori"
                       >
                         <FontAwesomeIcon icon={faTrash} />
                       </Button>
                       <Button 
                         onClick={handleSaveCategory}
                         className="w-full sm:w-auto justify-center h-16 px-10 rounded-[1.5rem] bg-white text-indigo-600 hover:bg-slate-100 font-black shadow-2xl transition-all hover:scale-105 active:scale-95 gap-3"
                       >
                         <FontAwesomeIcon icon={faSave} /> SIMPAN
                       </Button>
                     </div>
                  </CardContent>
               </Card>

               <div className="flex flex-col xl:flex-row gap-8 w-full">
                  {/* Basic Information Card */}
                  <Card className="w-full xl:w-[calc(50%-1rem)] border-none shadow-2xl bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white dark:border-white/5">
                     <CardHeader className="px-8 pt-8">
                        <CardTitle className="text-lg font-black flex items-center gap-3">
                           <FontAwesomeIcon icon={faInfoCircle} className="text-indigo-500" />
                           Detail Dasar
                        </CardTitle>
                     </CardHeader>
                     <CardContent className="px-8 pb-8 space-y-6">
                        <div className="space-y-2">
                           <label className="text-xs font-black uppercase tracking-wider text-slate-500">Nama Kategori</label>
                           <Input 
                              value={editingCategory.name} 
                              onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                              className="h-14 rounded-2xl bg-white/50 dark:bg-slate-800/50 border-white dark:border-slate-800 font-bold px-5 focus:ring-2 focus:ring-indigo-500"
                              placeholder="Masukkan nama kategori..."
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs font-black uppercase tracking-wider text-slate-500">Keterangan Deskriptif</label>
                           <textarea
                              className="w-full min-h-[120px] rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-white dark:border-slate-800 p-5 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                              value={editingCategory.description}
                              onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                              placeholder="Jelaskan instruksi atau tujuan kategori ini..."
                           />
                        </div>
                     </CardContent>
                  </Card>

                  {/* Period & Target Card */}
                  <Card className="w-full xl:w-[calc(50%-1rem)] border-none shadow-2xl bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white dark:border-white/5">
                     <CardHeader className="px-8 pt-8">
                        <CardTitle className="text-lg font-black flex items-center gap-3">
                           <FontAwesomeIcon icon={faCalendarAlt} className="text-indigo-500" />
                           Linimasa & Target
                        </CardTitle>
                     </CardHeader>
                     <CardContent className="px-8 pb-8 space-y-6">
                        <div className="flex flex-col sm:flex-row gap-4 w-full">
                           <div className="w-full sm:w-[calc(50%-0.5rem)] space-y-2">
                              <label className="text-xs font-black uppercase tracking-wider text-slate-500">Mulai</label>
                              <div className="relative group">
                                 <input 
                                    type="date"
                                    className="w-full h-14 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-white dark:border-slate-800 px-5 text-sm font-bold focus:ring-2 focus:ring-indigo-500"
                                    value={editingCategory.start_date}
                                    onChange={(e) => setEditingCategory({ ...editingCategory, start_date: e.target.value })}
                                 />
                                 <FontAwesomeIcon icon={faCalendarAlt} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-focus-within:text-indigo-500 transition-colors" />
                              </div>
                           </div>
                           <div className="w-full sm:w-[calc(50%-0.5rem)] space-y-2">
                              <label className="text-xs font-black uppercase tracking-wider text-rose-500">Deadline</label>
                              <div className="relative group">
                                 <input 
                                    type="date"
                                    className="w-full h-14 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-white dark:border-slate-800 px-5 text-sm font-black text-rose-600 dark:text-rose-400 focus:ring-2 focus:ring-rose-500"
                                    value={editingCategory.end_date}
                                    onChange={(e) => setEditingCategory({ ...editingCategory, end_date: e.target.value })}
                                 />
                                 <FontAwesomeIcon icon={faExclamationTriangle} className="absolute right-12 top-1/2 -translate-y-1/2 text-rose-300 pointer-events-none group-focus-within:text-rose-500 transition-colors" />
                              </div>
                           </div>
                        </div>
                        <div className="p-5 bg-indigo-500/5 dark:bg-white/5 rounded-2xl border border-indigo-500/10 flex items-start gap-4">
                           <div className="bg-white dark:bg-slate-800 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-slate-100 dark:border-slate-700">
                              <FontAwesomeIcon icon={faLightbulb} className="text-indigo-500" />
                           </div>
                           <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed italic">
                             Penetapan tenggat waktu akan memberikan indikator visual pada dashboard siswa untuk mendorong penyelesaian tepat waktu.
                           </p>
                        </div>
                     </CardContent>
                  </Card>
               </div>

               {/* Requirements Manager */}
               <Card className="border-none shadow-2xl bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white dark:border-white/5">
                  <CardHeader className="px-10 pt-10 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                     <CardTitle className="text-2xl font-black flex items-center gap-4 w-full sm:w-auto">
                        <div className="w-10 h-10 bg-indigo-500 text-white rounded-xl flex items-center justify-center shadow-lg shrink-0">
                           <FontAwesomeIcon icon={faLayerGroup} />
                        </div>
                        <span className="truncate">Field Submission Requirements</span>
                     </CardTitle>
                     <Button 
                        variant="outline" 
                        size="lg" 
                        onClick={handleAddRequirement} 
                        className="w-full sm:w-auto justify-center rounded-2xl border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 font-black hover:bg-indigo-600 hover:text-white transition-all gap-3 shrink-0"
                     >
                        <FontAwesomeIcon icon={faPlus} /> TAMBAH FIELD
                     </Button>
                  </CardHeader>
                  <CardContent className="px-10 pb-10 space-y-6">
                     <div className="flex flex-col xl:flex-row xl:flex-wrap gap-6 w-full">
                        {requirements.map((req, idx) => {
                           const getTypeProps = (type) => {
                              switch(type) {
                                 case 'local_file': return { icon: faFileAlt, color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Upload Local' };
                                 case 'link': return { icon: faLink, color: 'text-violet-500', bg: 'bg-violet-500/10', label: 'External Link' };
                                 case 'drive_file': return { icon: faCloud, color: 'text-emerald-500', bg: 'bg-emerald-500/10', label: 'Google Drive' };
                                 case 'text': return { icon: faFileSignature, color: 'text-amber-500', bg: 'bg-amber-500/10', label: 'Narasi/Teks' };
                                 case 'url': return { icon: faSearch, color: 'text-indigo-500', bg: 'bg-indigo-500/10', label: 'Alamat URL' };
                                 default: return { icon: faInfoCircle, color: 'text-slate-500', bg: 'bg-slate-500/10', label: 'Lainnya' };
                              }
                           };
                           const props = getTypeProps(req.type);

                           return (
                              <div key={idx} className="group relative bg-white/40 dark:bg-white/[0.03] border border-white dark:border-white/5 rounded-[2rem] p-6 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-500/30 transition-all duration-500 flex flex-col gap-5 w-full xl:w-[calc(50%-0.75rem)]">
                                 <div className="flex items-start sm:items-center justify-between gap-2">
                                     <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                                        <div className={cn("w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0", props.bg, props.color)}>
                                           <FontAwesomeIcon icon={props.icon} className="text-lg sm:text-xl" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 truncate block">{props.label}</span>
                                           <Input 
                                              value={req.label} 
                                              onChange={(e) => handleUpdateRequirement(idx, 'label', e.target.value)}
                                              className="h-8 p-0 bg-transparent border-none text-sm sm:text-base font-black text-slate-800 dark:text-white focus-visible:ring-0 shadow-none truncate w-full"
                                              placeholder="Label field..."
                                           />
                                        </div>
                                     </div>
                                     <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={() => handleRemoveRequirement(idx)}
                                        className="w-10 h-10 shrink-0 rounded-xl text-slate-300 hover:text-rose-500 hover:bg-rose-500/10 group-hover:opacity-100 lg:opacity-0 transition-all flex items-center justify-center"
                                     >
                                        <FontAwesomeIcon icon={faTrash} className="text-xs" />
                                     </Button>
                                  </div>
                                 
                                 <div className="flex flex-col sm:flex-row gap-4 w-full">
                                    <div className="w-full sm:w-[calc(50%-0.5rem)] space-y-1.5 flex flex-col">
                                       <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Tipe Field</label>
                                       <select
                                          className="w-full h-11 rounded-xl bg-slate-100 dark:bg-slate-800 px-3 text-xs font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                          value={req.type}
                                          onChange={(e) => handleUpdateRequirement(idx, 'type', e.target.value)}
                                       >
                                          <option value="local_file">Dokumen Lokal</option>
                                          <option value="link">Link Eksternal</option>
                                          <option value="drive_file">G-Drive File</option>
                                          <option value="text">Input Teks</option>
                                          <option value="url">Halaman Web</option>
                                       </select>
                                    </div>
                                    <div className="w-full sm:w-[calc(50%-0.5rem)] space-y-1.5 flex flex-col">
                                       <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Sifat Input</label>
                                       <button 
                                          onClick={() => handleUpdateRequirement(idx, 'is_required', !req.is_required)}
                                          className={cn(
                                             "w-full h-11 rounded-xl flex items-center justify-center gap-2 text-xs font-black transition-all",
                                             req.is_required ? "bg-indigo-500 text-white shadow-lg" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                                          )}
                                       >
                                          <FontAwesomeIcon icon={req.is_required ? faCheckCircle : faInfoCircle} className="text-[10px]" />
                                          {req.is_required ? 'WAJIB' : 'OPSIONAL'}
                                       </button>
                                    </div>
                                 </div>

                                  {req.type === 'local_file' && (
                                     <div className="pt-2 animate-in slide-in-from-top-2 duration-300">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">Ekstensi Diizinkan</label>
                                        <div className="flex flex-wrap gap-1.5">
                                           {['pdf','doc','docx','xls','xlsx','ppt','pptx','jpg','jpeg','png','gif','webp','svg','mp4','mp3','zip','rar','7z','txt','csv'].map(ext => {
                                              const current = (req.allowed_extensions || '').split(',').map(s => s.trim().replace(/^\./, '')).filter(Boolean);
                                              const checked = current.includes(ext);
                                              return (
                                                <button
                                                  key={ext}
                                                  type="button"
                                                  onClick={() => {
                                                    let updated = current;
                                                    if (checked) {
                                                      updated = updated.filter(e => e !== ext);
                                                    } else {
                                                      updated = [...updated, ext];
                                                    }
                                                    handleUpdateRequirement(idx, 'allowed_extensions', updated.map(e => `.${e}`).join(','));
                                                  }}
                                                  className={cn(
                                                    'px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all',
                                                    checked
                                                      ? 'bg-indigo-500 text-white border-indigo-500 shadow-sm'
                                                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-transparent hover:border-slate-300 dark:hover:border-slate-600'
                                                  )}
                                                >
                                                  {ext}
                                                </button>
                                              );
                                           })}
                                        </div>
                                     </div>
                                  )}
                              </div>
                           );
                        })}
                     </div>
                     {requirements.length === 0 && (
                        <div className="py-20 flex flex-col items-center justify-center bg-slate-50/50 dark:bg-white/[0.02] border-2 border-dashed border-slate-200 dark:border-white/5 rounded-[2.5rem]">
                           <div className="w-24 h-24 rounded-full bg-white dark:bg-slate-800 shadow-inner flex items-center justify-center mb-6 text-slate-200 dark:text-slate-700">
                              <FontAwesomeIcon icon={faFolderOpen} size="3x" />
                           </div>
                           <h4 className="text-lg font-black text-slate-600 dark:text-slate-400">Arsitektur Field Kosong</h4>
                           <p className="text-slate-400 text-sm max-w-xs text-center mt-2 font-medium">Klik "Tambah Field" di atas untuk menyusun persyaratan pengumpulan project.</p>
                        </div>
                     )}
                  </CardContent>
               </Card>
            </div>
          ) : (
            <div className="h-[600px] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[3rem] bg-white/30 dark:bg-slate-900/40 backdrop-blur-xl animate-in fade-in duration-1000">
               <div className="w-32 h-32 bg-indigo-500/10 rounded-full flex items-center justify-center mb-10 group relative">
                  <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-ping opacity-20" />
                  <FontAwesomeIcon icon={faLayerGroup} className="text-5xl text-indigo-500 opacity-20" />
               </div>
               <h3 className="text-2xl font-black text-slate-700 dark:text-white tracking-tight">Kategori Belum Dipilih</h3>
               <p className="text-slate-500 max-w-sm text-center mt-4 font-medium leading-relaxed">
                  Silakan pilih kategori dari panel kiri untuk mulai mengelola pengaturan, tenggat waktu, dan persyaratan pengumpulan.
               </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !isDeleting && setIsDeleteModalOpen(false)} />
           <Card className="relative w-full max-w-md border-none shadow-2xl rounded-[2.5rem] bg-white dark:bg-slate-900 overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-500/10 rounded-full blur-[40px]" />
              <CardContent className="p-8 flex flex-col items-center text-center relative z-10">
                 <div className="w-20 h-20 bg-rose-50 dark:bg-rose-500/10 rounded-full flex items-center justify-center mb-6">
                    <FontAwesomeIcon icon={faTrash} className="text-3xl text-rose-500" />
                 </div>
                 <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Hapus Kategori?</h3>
                 <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">
                   Tindakan ini tidak dapat dibatalkan. Kategori <span className="font-bold text-slate-700 dark:text-slate-300">"{selectedCategory?.name}"</span> akan dihapus selamanya beserta persyaratannya.
                 </p>
                 <div className="flex gap-4 w-full">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsDeleteModalOpen(false)}
                      className="flex-1 h-14 rounded-2xl font-bold dark:border-white/10 dark:text-slate-300"
                      disabled={isDeleting}
                    >
                      Batal
                    </Button>
                    <Button 
                      onClick={handleDeleteCategory}
                      className="flex-1 h-14 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold gap-2"
                      disabled={isDeleting}
                    >
                      {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
                    </Button>
                 </div>
              </CardContent>
           </Card>
        </div>
      )}
    </div>
  );
}
