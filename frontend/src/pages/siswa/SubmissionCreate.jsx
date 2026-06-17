import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { siswaApi } from '@/api/siswaApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Label } from '@/components/common/Label';
import { FileUpload } from '@/components/forms/FileUpload';
import { GoogleDrivePicker } from '@/components/forms/GoogleDrivePicker';
import { ArrowRight, ArrowLeft, Save, Send, CheckCircle2, Layout, FileCode, Monitor, Smartphone, Globe, AlertCircle, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/utils/utils';

const techOptions = ['MIT App Inventor', 'Kodular', 'Flutter', 'React Native', 'Java Android', 'Kotlin', 'HTML/CSS', 'React.js', 'Next.js', 'PHP/Laravel', 'Python/Django'];

const schemaStep1 = z.object({
  judul_project: z.string().min(5, 'Judul minimal 5 karakter').max(150),
  nama_pembimbing: z.string().min(3, 'Nama pembimbing wajib diisi'),
  deskripsi_project: z.string().min(20, 'Deskripsi minimal 20 karakter'),
  category_id: z.string().min(1, 'Pilih kategori project'),
});

export function SubmissionCreate() {
  const { slug: urlSlug } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [existingSubmission, setExistingSubmission] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    category_id: '',
    judul_project: '',
    nama_pembimbing: '',
    deskripsi_project: '',
    teknologi_digunakan: [],
  });
  
  const [dynamicValues, setDynamicValues] = useState({}); // Stores links and drive values { slug: value }
  const [files, setFiles] = useState({}); // Stores local files { slug: [File] }
  const [existingFiles, setExistingFiles] = useState({}); // { slug: [{...}] }

  const { register, handleSubmit, formState: { errors }, trigger, setValue, watch, reset } = useForm({
    resolver: zodResolver(schemaStep1),
    defaultValues: formData
  });

  const selectedCategoryId = watch('category_id');
  const selectedCategory = categories.find(c => c.id.toString() === selectedCategoryId);

  useEffect(() => {
    fetchInitialData();
  }, [urlSlug]);

  useEffect(() => {
    const catId = searchParams.get('category_id');
    if (catId) {
      setValue('category_id', catId);
      setFormData(prev => ({ ...prev, category_id: catId }));
      setStep(1);
    } else if (!urlSlug) {
      setStep(0);
    }
  }, [searchParams, setValue, urlSlug]);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      const catRes = await siswaApi.getCategories();
      const fetchedCats = catRes.data.categories;
      setCategories(fetchedCats);

      if (urlSlug) {
        const subRes = await siswaApi.getSubmission(urlSlug);
        const sub = subRes.data.submission;
        
        if (sub.is_locked) {
           toast.error('Submission yang sudah disetujui tidak dapat diedit.');
           return navigate('/siswa/dashboard');
        }

        setExistingSubmission(sub);
        const initialForm = {
          category_id: sub.category_id.toString(),
          judul_project: sub.judul_project,
          nama_pembimbing: sub.nama_pembimbing,
          deskripsi_project: sub.deskripsi_project,
          teknologi_digunakan: sub.teknologi_digunakan || [],
        };
        setFormData(initialForm);
        reset(initialForm);

        // Map existing files to dynamicValues (for links) and existingFiles (for downloads)
        const dv = {};
        const ef = {};
        sub.files.forEach(f => {
           if (f.link_url || f.mime_type === 'text/url' || f.mime_type === 'application/vnd.google-apps.file') {
              dv[f.file_type] = f.link_url || f.file_path;
           } else {
              ef[f.file_type] = ef[f.file_type] || [];
              ef[f.file_type].push(f);
           }
        });
        setDynamicValues(dv);
        setExistingFiles(ef);
      }
    } catch (error) {
       toast.error('Gagal mengambil data');
       navigate('/siswa/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTechToggle = (tech) => {
    setFormData(prev => ({
      ...prev,
      teknologi_digunakan: prev.teknologi_digunakan.includes(tech)
        ? prev.teknologi_digunakan.filter(t => t !== tech)
        : [...prev.teknologi_digunakan, tech]
    }));
  };

  const handleFileChange = (slug, selectedFiles) => {
    setFiles(prev => ({
      ...prev,
      [slug]: selectedFiles
    }));
  };

  const removeFile = (slug, index) => {
    setFiles(prev => ({
      ...prev,
      [slug]: prev[slug].filter((_, i) => i !== index)
    }));
  };

  const handleDynamicValueChange = (slug, value) => {
    setDynamicValues(prev => ({
      ...prev,
      [slug]: value
    }));
  };

  const onSubmitForm = async (status = 'draft') => {
    if (status === 'submitted') {
      if (selectedCategory) {
        for (const req of selectedCategory.requirements) {
          if (req.is_required) {
            if ((req.type === 'local_file' || req.type === 'file') && (!files[req.slug] || files[req.slug].length === 0) && (!existingFiles[req.slug] || existingFiles[req.slug].length === 0)) {
              return toast.error(`${req.label} wajib diisi`);
            }
            if ((req.type === 'link' || req.type === 'url' || req.type === 'drive_file' || req.type === 'text') && !dynamicValues[req.slug]) {
               if (!watch(req.slug)) {
                  return toast.error(`${req.label} wajib diisi`);
               }
            }
          }
        }
      }
    }

    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append('category_id', selectedCategoryId);
      data.append('judul_project', watch('judul_project') || '');
      data.append('nama_pembimbing', watch('nama_pembimbing') || '');
      data.append('deskripsi_project', watch('deskripsi_project') || '');
      
      formData.teknologi_digunakan.forEach((tech, i) => {
        data.append(`teknologi_digunakan[${i}]`, tech);
      });
      data.append('status', status);

      Object.keys(dynamicValues).forEach(slug => {
         data.append(slug, dynamicValues[slug]);
      });

      Object.keys(files).forEach(slug => {
         if (files[slug]) {
             files[slug].forEach(file => {
                 data.append(`${slug}[]`, file);
             });
             if (files[slug].length === 1 && reqTypeNotMultiple(slug)) {
                 data.delete(`${slug}[]`);
                 data.append(slug, files[slug][0]);
             }
         }
      });
      
      const reqTypeNotMultiple = (slug) => {
           // Small fast internal check for single files
           return slug !== 'screenshots'; 
      }

      if (urlSlug) {
         await siswaApi.updateSubmission(urlSlug, data);
      } else {
         await siswaApi.createSubmission(data);
      }
      
      toast.success(urlSlug ? 'Submission berhasil diperbarui' : (status === 'draft' ? 'Draft berhasil disimpan' : 'Project berhasil disubmit!'));
      navigate('/siswa/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Terjadi kesalahan saat menyimpan');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] animate-pulse">Menyiapkan Form Berkas...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-24 mt-4 px-4 sm:px-6">
      
      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8 md:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-white/5">
         <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
            <Layout className="w-64 h-64 text-white -rotate-12 transform scale-150" />
         </div>
         <div className="relative z-10">
           <div className="flex flex-wrap items-center gap-3 mb-6">
               <Badge variant="outline" className="text-indigo-200 border-indigo-400/30 bg-white/5 px-4 py-1.5 font-bold uppercase tracking-widest text-[10px] rounded-full backdrop-blur-md">
                  Misi Kelulusan
               </Badge>
               {urlSlug && (
                   <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-4 py-1.5 font-bold uppercase tracking-widest text-[10px] rounded-full backdrop-blur-md">
                      📝 Mode Edit Aktif
                   </Badge>
               )}
           </div>
           
           <h1 className="text-4xl md:text-5xl font-black font-display tracking-tight text-white leading-tight mb-4">
             {urlSlug ? 'Perbarui Submission' : 'Upload Berkas Project'}
           </h1>
           <p className="text-indigo-100/70 max-w-xl font-medium leading-relaxed text-sm md:text-base">
             {selectedCategory ? `Kategori: ${selectedCategory.name}. Pastikan file dan link yang Anda muat valid sebelum diserahkan kepada dewan guru.` : 'Pilih kategori dan lengkapi data project untuk verifikasi kelulusan Anda.'}
           </p>

           {existingSubmission?.status === 'revision' && (
             <div className="mt-8 p-6 bg-rose-500/10 border border-rose-500/20 rounded-3xl backdrop-blur-md">
               <h4 className="flex items-center gap-2 text-rose-400 font-black mb-2 uppercase tracking-widest text-[10px]">
                 <AlertCircle className="w-4 h-4" /> Pesan Revisi dari Pembimbing
               </h4>
               <p className="text-rose-100/90 text-sm leading-relaxed">{existingSubmission.catatan_guru}</p>
             </div>
           )}
         </div>
      </div>

      {step === 0 && (
          <Card className="border-none shadow-2xl rounded-[3rem] bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl py-20 text-center">
             <CardContent className="flex flex-col items-center space-y-6">
                <div className="w-24 h-24 bg-rose-50 dark:bg-rose-500/10 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-10 h-10 text-rose-500" />
                </div>
                <div>
                   <h3 className="text-2xl font-black text-slate-800 dark:text-white">Kategori Tidak Valid</h3>
                   <p className="text-slate-500 mt-2 font-medium">Silakan akses menu ini melalui tombol pada dashboard tugas Anda.</p>
                </div>
                <Button onClick={() => navigate('/siswa/dashboard')} className="rounded-2xl h-12 px-8 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white shadow-xl mt-4">
                   Kembali ke Dashboard
                </Button>
             </CardContent>
          </Card>
      )}

      {step > 0 && (
         <>
             {/* Modern Minimalist Stepper */}
             <div className="flex justify-center relative my-12">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] md:w-[320px] h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full z-0 overflow-hidden">
                    <div className="h-full bg-indigo-600 transition-all duration-700 ease-spring" style={{ width: `${((step - 1) / 1) * 100}%` }}></div>
                </div>
                
                <div className="flex justify-between w-[280px] md:w-[400px] relative z-10">
                   {/* Step 1 Node */}
                   <div className={cn(
                      "flex flex-col items-center gap-3 transition-all duration-500",
                      step >= 1 ? "opacity-100" : "opacity-50"
                   )}>
                      <div className={cn(
                         "w-12 h-12 rounded-[1.2rem] flex items-center justify-center font-black text-lg transition-all duration-500",
                         step >= 1 ? "bg-indigo-600 text-white shadow-[0_10px_20px_rgba(79,70,229,0.3)] shadow-indigo-600/30 scale-110" : "bg-white dark:bg-slate-900 text-slate-400 border-2 border-slate-200 dark:border-slate-800"
                      )}>
                         {step > 1 ? <CheckCircle2 className="w-6 h-6" /> : "1"}
                      </div>
                      <span className={cn("text-[10px] font-black uppercase tracking-widest", step >= 1 ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400")}>Lengkapi Berkas</span>
                   </div>
                   
                   {/* Step 2 Node */}
                   <div className={cn(
                      "flex flex-col items-center gap-3 transition-all duration-500",
                      step >= 2 ? "opacity-100" : "opacity-50"
                   )}>
                      <div className={cn(
                         "w-12 h-12 rounded-[1.2rem] flex items-center justify-center font-black text-lg transition-all duration-500",
                         step >= 2 ? "bg-emerald-500 text-white shadow-[0_10px_20px_rgba(16,185,129,0.3)] shadow-emerald-500/30 scale-110" : "bg-white dark:bg-slate-900 text-slate-400 border-2 border-slate-200 dark:border-slate-800"
                      )}>
                         2
                      </div>
                      <span className={cn("text-[10px] font-black uppercase tracking-widest", step >= 2 ? "text-emerald-500 dark:text-emerald-400" : "text-slate-400")}>Konfirmasi</span>
                   </div>
                </div>
             </div>

             <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl rounded-[3rem] ring-1 ring-slate-100 dark:ring-white/5">
               {step === 1 && (
                 <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                   <CardHeader className="bg-white/50 border-b border-slate-100 dark:bg-slate-900/50 dark:border-slate-800/60 pb-8 px-6 md:px-12 pt-8 md:pt-10">
                     <div className="flex items-center gap-5 mb-2">
                        <div className="w-14 h-14 rounded-[1.5rem] bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-inner">
                           <FileCode className="w-7 h-7" />
                        </div>
                        <div>
                           <CardTitle className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white">Lengkapi File & Informasi</CardTitle>
                           <CardDescription className="font-medium text-slate-500 text-sm mt-1">
                             Isi *field* kosong di bawah ini sesuai ketentuan yang ditetapkan untuk kategori project Anda.
                           </CardDescription>
                        </div>
                     </div>
                     
                     {selectedCategory?.description && (
                       <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-300 leading-relaxed shadow-sm">
                         <div className="font-black text-indigo-500 mb-2 flex items-center gap-2 uppercase tracking-widest text-[10px]">
                            <Info className="w-4 h-4" /> Info Kategori Utama
                         </div>
                         {selectedCategory.description}
                       </div>
                     )}
                   </CardHeader>

                   <CardContent className="space-y-10 pt-10 px-6 md:px-12">
                     <div className="grid grid-cols-1 gap-10">
                       {selectedCategory?.requirements.map((req) => (
                          <div key={req.id} className="space-y-4 group">
                             {/* Requirement Instruction Banner */}
                             {req.instructions && (
                               <div className="p-5 bg-indigo-50/50 dark:bg-indigo-500/5 rounded-2xl border border-indigo-100/50 dark:border-indigo-500/10 text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed shadow-sm transition-colors group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10">
                                 <div className="font-black text-indigo-600 dark:text-indigo-400 mb-2 flex items-center gap-2 text-[10px] uppercase tracking-widest">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Ketentuan {req.label}
                                 </div>
                                 {req.instructions}
                               </div>
                             )}

                             {/* File Uploads */}
                             {(req.type === 'local_file' || req.type === 'file') && (
                               <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-sm group-hover:border-indigo-300 dark:group-hover:border-indigo-500/50 transition-colors">
                                 <FileUpload 
                                   label={`${req.label} ${req.is_required ? '(Wajib)' : '(Opsional)'}`}
                                   accept={req.allowed_extensions || '*'}
                                   maxSizeMB={req.max_size_mb || 5}
                                   multiple={req.slug === 'screenshots'}
                                   selectedFiles={files[req.slug] || []}
                                   onFileSelect={(f) => handleFileChange(req.slug, f)}
                                   onRemove={(idx) => removeFile(req.slug, idx)}
                                   helperText={`Format yang diizinkan: ${req.allowed_extensions || 'Bebas'}. Maksimal ukuran: ${req.max_size_mb || 5}MB`}
                                 />
                                 {existingFiles[req.slug] && existingFiles[req.slug].length > 0 && (
                                   <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                                     <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest pl-2">Berkas Tersimpan Sebelumnya:</p>
                                     {existingFiles[req.slug].map(exFile => (
                                       <div key={exFile.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs font-medium">
                                          <span className="truncate max-w-[200px] md:max-w-[400px] text-slate-600 dark:text-slate-300">{exFile.file_name}</span>
                                          <Button variant="ghost" className="h-8 rounded-lg text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-[11px] font-bold" onClick={() => window.open(exFile.file_url, '_blank')}>
                                            Buka Berkas
                                          </Button>
                                       </div>
                                     ))}
                                   </div>
                                 )}
                               </div>
                             )}

                             {/* Basic Text Inputs (Text/Links) */}
                             {(req.type === 'link' || req.type === 'url') && (
                               <div className="space-y-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-sm group-hover:border-indigo-300 dark:group-hover:border-indigo-500/50 transition-colors">
                                 <Label htmlFor={req.slug} className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-wide ml-2">
                                    {req.label} {req.is_required && <span className="text-rose-500">*</span>}
                                 </Label>
                                 <Input 
                                   id={req.slug} 
                                   className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus-visible:ring-indigo-500/20 px-6 font-medium"
                                   placeholder={req.input_config?.placeholder || (req.type === 'url' ? "https://..." : "Masukkan tautan...") } 
                                   value={dynamicValues[req.slug] || ''}
                                   onChange={(e) => handleDynamicValueChange(req.slug, e.target.value)}
                                 />
                                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider ml-2">
                                    {req.input_config?.help_text || (req.type === 'url' ? "Gunakan URL lengkap secara valid (sertakan https://)" : `Masukkan string teks terkait ${req.label}`)}
                                 </p>
                               </div>
                             )}

                             {/* Textarea */}
                             {req.type === 'text' && (
                               <div className="space-y-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-sm group-hover:border-indigo-300 dark:group-hover:border-indigo-500/50 transition-colors">
                                 <Label htmlFor={req.slug} className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-wide ml-2">
                                    {req.label} {req.is_required && <span className="text-rose-500">*</span>}
                                 </Label>
                                 <textarea 
                                   id={req.slug}
                                   className="flex w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-6 py-4 text-sm font-medium focus:outline-none focus:ring-4 focus:border-indigo-500 focus:ring-indigo-500/20 min-h-[120px] transition-all resize-y"
                                   placeholder={req.input_config?.placeholder || `Ketik ${req.label} di sini...`}
                                   value={dynamicValues[req.slug] || ''}
                                   onChange={(e) => handleDynamicValueChange(req.slug, e.target.value)}
                                 />
                                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider ml-2">{req.input_config?.help_text}</p>
                               </div>
                             )}

                             {/* Google Drive Picker */}
                             {req.type === 'drive_file' && (
                               <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-sm flex flex-col items-center justify-center space-y-4 group-hover:border-indigo-300 dark:group-hover:border-indigo-500/50 transition-colors text-center w-full">
                                  <div className="font-black text-slate-700 dark:text-slate-200 uppercase tracking-wide">{req.label} {req.is_required && <span className="text-rose-500">*</span>}</div>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 mb-4">Pilih file berukuran besar melalui repositori Google Drive.</p>
                                  <GoogleDrivePicker 
                                    label="Buka Google Drive Picker"
                                    value={dynamicValues[req.slug]}
                                    onFileSelect={(url) => handleDynamicValueChange(req.slug, url)}
                                  />
                               </div>
                             )}
                          </div>
                       ))}
                     </div>
                   </CardContent>
                   <CardFooter className="flex justify-end pt-10 pb-8 px-6 md:px-12 border-t border-slate-100 dark:border-slate-800/60 mt-8 bg-slate-50/50 dark:bg-slate-900/30">
                     <Button 
                        onClick={() => {
                           window.scrollTo({ top: 0, behavior: 'smooth' });
                           setStep(2);
                        }} 
                        className="gap-3 px-10 h-14 rounded-2xl shadow-xl shadow-indigo-500/20 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm uppercase tracking-widest transition-all hover:-translate-y-1 active:scale-95"
                     >
                       Simpan & Lanjutkan <ArrowRight className="w-5 h-5" />
                     </Button>
                   </CardFooter>
                 </div>
               )}

               {step === 2 && (
                 <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                   <CardHeader className="bg-emerald-50 border-b border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20 pb-8 px-6 md:px-12 pt-8 md:pt-10">
                     <CardTitle className="flex items-center gap-3 text-2xl md:text-3xl font-black text-emerald-800 dark:text-emerald-400">
                       <CheckCircle2 className="w-8 h-8" />
                       Konfirmasi Penyerahan
                     </CardTitle>
                     <CardDescription className="text-emerald-700 dark:text-emerald-500 font-medium text-sm mt-2 ml-11">
                       Tinjau kembali kelengkapan seluruh data Anda secara meyakinkan sebelum meneruskannya ke dewan penguji.
                     </CardDescription>
                   </CardHeader>
                   <CardContent className="space-y-8 pt-10 px-6 md:px-12">
                     <div className="space-y-6">
                       
                       <div className="p-8 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-500/10 to-transparent rounded-bl-full pointer-events-none"></div>
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Informasi Kategori Pekerjaan</div>
                          <p className="font-black text-2xl text-slate-800 dark:text-white mb-2">{selectedCategory?.name}</p>
                          <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-xl">{selectedCategory?.description || 'Tidak ada spesifikasi kategori tambahan.'}</p>
                       </div>
                       
                       <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-inner">
                           <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Status Pengecekan Berkas (Pre-flight)</div>
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             {selectedCategory?.requirements.map(req => {
                               const hasVal = (req.type === 'local_file' || req.type === 'file') ? (files[req.slug]?.length > 0 || existingFiles[req.slug]?.length > 0) : !!dynamicValues[req.slug];
                               return (
                                 <div key={req.id} className="flex items-center gap-4 text-sm font-medium bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
                                   {hasVal ? <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 shadow-sm"><CheckCircle2 className="w-5 h-5" /></div> : <div className="w-8 h-8 rounded-full border-2 border-slate-300 dark:border-slate-600 border-dashed shrink-0" />}
                                   <div className="flex flex-col">
                                       <span className={cn("font-bold text-sm", hasVal ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400 italic')}>
                                           {req.label}
                                       </span>
                                       {!hasVal && req.is_required && <span className="text-[10px] text-rose-500 mt-1 uppercase font-bold tracking-widest">Wajib dilengkapi</span>}
                                   </div>
                                 </div>
                               );
                             })}
                           </div>
                       </div>

                       <div className="flex items-start gap-4 p-6 bg-amber-50 dark:bg-amber-500/10 rounded-3xl border border-amber-200 dark:border-amber-500/20 backdrop-blur-sm">
                          <AlertCircle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
                          <div className="text-sm leading-relaxed text-amber-800 dark:text-amber-300 font-medium tracking-wide">
                             <strong className="block text-amber-700 dark:text-amber-400 mb-1">Perhatian!</strong> Setelah menekan tombol <strong>Kirim Sekarang</strong>, berkas ini akan diteruskan ke guru pembimbing untuk diuji. Anda tidak akan diizinkan mengubah file secara sepihak sampai pembimbing memberikan *Umpan Balik* atau meminta Revisi.
                          </div>
                       </div>
                     </div>
                   </CardContent>
                   <CardFooter className="flex flex-col sm:flex-row justify-between pt-8 pb-8 px-6 md:px-12 border-t border-slate-100 dark:border-slate-800/60 mt-8 bg-slate-50/50 dark:bg-slate-900/30 gap-4">
                      <Button 
                         variant="outline" 
                         onClick={() => {
                           window.scrollTo({ top: 0, behavior: 'smooth' });
                           setStep(1);
                         }} 
                         disabled={isSubmitting} 
                         className="gap-3 h-14 px-8 rounded-2xl text-slate-500 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 uppercase font-black text-[10px] tracking-widest order-2 sm:order-1 transition-all"
                       >
                       <ArrowLeft className="w-4 h-4" /> Koreksi Jawaban
                     </Button>
                     <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto order-1 sm:order-2">
                       <Button 
                         variant="outline" 
                         onClick={() => onSubmitForm('draft')} 
                         disabled={isSubmitting}
                         className="gap-3 h-14 px-8 rounded-2xl bg-white dark:bg-slate-800 border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 font-black text-[10px] uppercase tracking-widest shadow-sm transition-all"
                       >
                         <Save className="w-4 h-4" /> Simpan Draft Target
                       </Button>
                       <Button 
                         onClick={() => onSubmitForm('submitted')} 
                         disabled={isSubmitting}
                         className="gap-3 h-14 px-10 rounded-2xl shadow-xl shadow-emerald-500/30 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm uppercase tracking-widest transition-transform hover:-translate-y-1 active:scale-95"
                       >
                         {isSubmitting ? 'Meneruskan Berkas...' : 'Kirim Sekarang'} 
                         {!isSubmitting && <Send className="w-5 h-5" />}
                       </Button>
                     </div>
                   </CardFooter>
                 </div>
               )}
             </Card>
         </>
      )}
    </div>
  );
}
