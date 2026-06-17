import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { guruApi } from '@/api/guruApi';
import { Input } from '@/components/common/Input';
import { Label } from '@/components/common/Label';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, faDownload, faFileArchive, faVideo, 
  faImage, faCheckCircle, faExclamationCircle, faLink, 
  faSave, faPaperPlane, faDesktop, faFileCode, faGlobe, faTimesCircle, faClock
} from '@fortawesome/free-solid-svg-icons';

export function SubmissionReview() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [checklist, setChecklist] = useState([]);
  const [catatanGuru, setCatatanGuru] = useState('');
  
  // Issue SKL State
  const [isIssuingSkl, setIsIssuingSkl] = useState(false);
  const [sklDriveLink, setSklDriveLink] = useState('');

  useEffect(() => {
    fetchDetail();
  }, [slug]);

  const fetchDetail = async () => {
    try {
      const { data } = await guruApi.getSubmissionDetail(slug);
      setSubmission(data.submission);
      setChecklist(data.submission.checklist_reviews || []);
      setCatatanGuru(data.submission.catatan_guru || '');
    } catch (err) {
      toast.error('Gagal mengambil data submission');
      navigate('/guru/submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleChecklistChange = (itemId, field, value) => {
    setChecklist(prev => prev.map(item => 
      item.id === itemId ? { ...item, [field]: value } : item
    ));
  };

  const saveReviewProgress = async () => {
    setSubmitting(true);
    try {
      await guruApi.submitReview(slug, {
        checklist,
        catatan_guru: catatanGuru
      });
      toast.success('Progres review berhasil disimpan!');
      fetchDetail();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menyimpan review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleApproveAll = async () => {
    const updatedChecklist = checklist.map(item => ({ ...item, status: 'approved' }));
    setChecklist(updatedChecklist);
    
    setSubmitting(true);
    try {
      await guruApi.submitReview(slug, {
        checklist: updatedChecklist,
        catatan_guru: catatanGuru,
        status: 'approved'
      });
      toast.success('Project berhasil di-ACC sepenuhnya!');
      fetchDetail();
    } catch (err) {
      toast.error('Gagal melakukan ACC');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRejectAll = async () => {
    const updatedChecklist = checklist.map(item => ({ ...item, status: 'rejected' }));
    setChecklist(updatedChecklist);
    
    setSubmitting(true);
    try {
      await guruApi.submitReview(slug, {
        checklist: updatedChecklist,
        catatan_guru: catatanGuru,
        status: 'revision'
      });
      toast.success('Semua poin ditolak!');
      fetchDetail();
    } catch (err) {
      toast.error('Gagal melakukan penolakan masal');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRequestRevision = async () => {
    if (!catatanGuru) {
      return toast.error('Silakan isi Catatan Utama (Revisi) terlebih dahulu.');
    }
    setSubmitting(true);
    try {
      await guruApi.requestRevision(slug, { catatan_guru: catatanGuru });
      toast.success('Permintaan revisi telah dikirim ke siswa');
      navigate('/guru/submissions');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal meminta revisi');
    } finally {
      setSubmitting(false);
    }
  };

  const handleIssueSkl = async () => {
    const pendingCount = checklist.filter(i => i.status !== 'approved').length;
    if (pendingCount > 0) {
      return toast.error('Semua poin checklist harus disetujui (Approved) sebelum menerbitkan SKL.');
    }
    if (!sklDriveLink.includes('drive.google.com')) {
      return toast.error('Tautan Google Drive SKL tidak valid.');
    }

    setSubmitting(true);
    try {
      await guruApi.issueSkl(slug, { 
        skl_drive_link: sklDriveLink,
        catatan_guru: catatanGuru 
      });
      toast.success('SKL berhasil diterbitkan! Siswa sekarang dapat mendownloadnya.');
      setIsIssuingSkl(false);
      fetchDetail();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menerbitkan SKL');
    } finally {
      setSubmitting(false);
    }
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'poster':
      case 'screenshot': return <FontAwesomeIcon icon={faImage} className="text-blue-500 text-lg" />;
      case 'apk': return <FontAwesomeIcon icon={faDownload} className="text-emerald-500 text-lg" />;
      case 'url':
      case 'link': 
      case 'youtube': return <FontAwesomeIcon icon={faLink} className="text-rose-500 text-lg" />;
      case 'drive_file': return <FontAwesomeIcon icon={faGlobe} className="text-sky-500 text-lg" />;
      case 'source_zip':
      case 'kodular_aia': return <FontAwesomeIcon icon={faFileArchive} className="text-amber-500 text-lg" />;
      case 'video': return <FontAwesomeIcon icon={faVideo} className="text-rose-500 text-lg" />;
      default: return <FontAwesomeIcon icon={faFileCode} className="text-slate-400 text-lg" />;
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 opacity-70 animate-pulse">
      <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
      <p className="text-muted-foreground tracking-widest text-sm uppercase font-semibold">Memuat Data Project...</p>
    </div>
  );
  if (!submission) return null;

  const allApproved = checklist.every(item => item.status === 'approved');
  const isLocked = submission.is_locked;
  const isSklIssued = submission.status === 'skl_issued';

  return (
    <div className="relative max-w-7xl mx-auto pb-24 pt-4 px-4 sm:px-6">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent -z-10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Header Navigation */}
      <button 
        onClick={() => navigate('/guru/submissions')} 
        className="group mb-8 flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors font-medium"
      >
        <div className="w-8 h-8 rounded-full bg-muted/50 border border-muted flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/20 transition-all">
          <FontAwesomeIcon icon={faArrowLeft} className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" /> 
        </div>
        Kembali ke Daftar Project
      </button>

      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
        <div>
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border shadow-sm
            ${isSklIssued ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
              submission.status === 'approved' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
              submission.status === 'revision' ? 'bg-rose-50 text-rose-700 border-rose-200' :
              'bg-amber-50 text-amber-700 border-amber-200'}`}
          >
            <FontAwesomeIcon icon={isSklIssued || submission.status === 'approved' ? faCheckCircle : submission.status === 'revision' ? faExclamationCircle : faClock } />
            {submission.status.replace('_', ' ')}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white mb-2 relative">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">
              {submission.judul_project}
            </span>
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-slate-500 mt-4 font-medium text-sm">
             <div className="flex items-center gap-2 px-3 py-1 bg-white/60 dark:bg-slate-800/60 shadow-sm border border-slate-200/50 rounded-lg">
                <span className="opacity-70">Siswa:</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold">{submission.user?.name}</span>
             </div>
             <div className="flex items-center gap-2 px-3 py-1 bg-white/60 dark:bg-slate-800/60 shadow-sm border border-slate-200/50 rounded-lg">
                <span className="opacity-70">Kelas / NIS:</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold">{submission.user?.kelas} • {submission.user?.nis}</span>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN - File Attachments */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800/60 bg-gradient-to-br from-indigo-50/30 to-white dark:from-slate-800 dark:to-slate-900">
               <h3 className="text-xl font-bold flex items-center gap-3 text-slate-800 dark:text-slate-100">
                 <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 flex items-center justify-center">
                    <FontAwesomeIcon icon={faFileArchive} />
                 </div>
                 File Lampiran Siswa
               </h3>
               <p className="mt-2 text-sm text-slate-500 font-medium">Tinjau seluruh kelengkapan tugas sebelum memberikan penilaian.</p>
            </div>
            
            <div className="p-3">
                <div className="flex flex-col gap-2">
                  {submission.files.map((file) => {
                    const isLink = !!file.link_url || file.mime_type === 'text/url';
                    const isText = file.mime_type === 'text/plain';
                    
                    return (
                      <div key={file.id} className="group p-4 flex flex-col gap-3 rounded-2xl bg-slate-50/50 hover:bg-white dark:bg-slate-800/30 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all shadow-sm hover:shadow-md">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4 overflow-hidden pr-4">
                             <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                               {getFileIcon(file.file_type)}
                             </div>
                             <div className="min-w-0">
                                <p className="text-[15px] font-semibold text-slate-800 dark:text-slate-200 truncate" title={file.file_name}>{file.file_name}</p>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                                  {file.file_type.replace('_',' ')} <span className="mx-1">•</span> {isLink ? 'EXT LINK' : `${(file.file_size / 1024 / 1024).toFixed(2)} MB`}
                                </p>
                             </div>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            {isLink ? (
                              <button onClick={() => window.open(file.link_url || file.file_path, '_blank')} className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 dark:text-indigo-300 rounded-xl font-semibold text-xs transition-colors flex items-center gap-2 active:scale-95">
                                <FontAwesomeIcon icon={faLink} /> Kunjungi
                              </button>
                            ) : !isText ? (
                              <button onClick={() => window.open(file.file_url, '_blank')} className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-semibold text-xs transition-colors flex items-center gap-2 active:scale-95 border border-slate-200 dark:border-slate-700">
                                <FontAwesomeIcon icon={faDesktop} /> Buka
                              </button>
                            ) : null}
                          </div>
                        </div>
                        
                        {isText && (
                          <div className="mt-2 bg-white dark:bg-slate-900/50 p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-sm font-mono whitespace-pre-wrap leading-relaxed shadow-inner overflow-auto max-h-[300px]">
                            {file.file_path || "Tidak ada konten."}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - Checklist Review */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/80 rounded-3xl shadow-[0_10px_40px_rgb(0,0,0,0.05)] overflow-hidden flex flex-col">
            
            <div className="p-6 md:px-8 border-b border-slate-100 dark:border-slate-800">
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                 <div>
                   <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">Checklist Standar</h2>
                   <p className="text-slate-500 font-medium text-sm mt-1">Berikan penilaian untuk setiap aspek wajib.</p>
                 </div>
                 <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 px-4 py-2 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                    <div className="text-right leading-none">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Disetujui</span>
                      <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">{checklist.filter(i => i.status === 'approved').length}</span>
                      <span className="text-lg text-slate-400 font-medium">/{checklist.length}</span>
                    </div>
                 </div>
               </div>
            </div>
            
            <div className="flex-1 p-3 space-y-2 bg-slate-50/30 dark:bg-transparent">
              {checklist.map((item, idx) => {
                const isApp = item.status === 'approved';
                const isRej = item.status === 'rejected';
                
                return (
                  <div key={item.id} className={`group relative p-5 transition-all duration-300 rounded-2xl border-2
                    ${isApp ? 'border-emerald-500/20 bg-emerald-50/30 dark:bg-emerald-900/10' : 
                      isRej ? 'border-rose-500/20 bg-rose-50/30 dark:bg-rose-900/10' : 
                      'border-transparent bg-white hover:border-slate-200 dark:bg-slate-800/40 hover:shadow-sm'}`}>
                    
                      <div className="flex flex-col sm:flex-row justify-between gap-5 relative z-10 w-full">
                         <div className="flex-1">
                            <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-base leading-snug">
                              <span className="opacity-50 mr-2">{idx + 1}.</span> {item.checklist_item}
                            </h4>
                         </div>
                         <div className="flex items-center gap-1.5 shrink-0 bg-slate-100/50 dark:bg-slate-900/50 p-1 rounded-xl">
                           <button 
                              type="button"
                              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${isApp ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' : 'text-slate-500 hover:bg-white hover:text-slate-900 dark:hover:bg-slate-800'}`}
                              onClick={() => handleChecklistChange(item.id, 'status', 'approved')}
                              disabled={isLocked}
                           >
                              ACC
                           </button>
                           <button 
                              type="button"
                              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${isRej ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20' : 'text-slate-500 hover:bg-white hover:text-slate-900 dark:hover:bg-slate-800'}`}
                              onClick={() => handleChecklistChange(item.id, 'status', 'rejected')}
                              disabled={isLocked}
                           >
                              Tolak
                           </button>
                           <button 
                              type="button"
                              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${!isApp && !isRej ? 'bg-slate-500 text-white shadow-md shadow-slate-500/20' : 'text-slate-500 hover:bg-white hover:text-slate-900 dark:hover:bg-slate-800'}`}
                              onClick={() => handleChecklistChange(item.id, 'status', 'pending')}
                              disabled={isLocked}
                           >
                              -
                           </button>
                         </div>
                      </div>
                      
                      <div className="mt-4 relative z-10">
                        <Input 
                          placeholder="Tambahkan feedback untuk bagian ini..." 
                          value={item.catatan || ''}
                          onChange={(e) => handleChecklistChange(item.id, 'catatan', e.target.value)}
                          className="bg-white/80 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 text-sm h-10 shadow-inner rounded-xl focus:ring-primary/20"
                          disabled={isLocked}
                        />
                      </div>
                  </div>
                )
              })}
            </div>

            {/* General Notes Input */}
            {!isLocked && (
              <div className="p-6 md:px-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30">
                <Label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-3">
                  <FontAwesomeIcon icon={faExclamationCircle} className="text-amber-500" /> Catatan Publik & Revisi Keseluruhan
                </Label>
                <textarea 
                  className="w-full min-h-[120px] rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-inner resize-y placeholder:text-slate-400"
                  placeholder="Instruksi revisi mendetail atau pesan apresiasi atas project ini..."
                  value={catatanGuru}
                  onChange={(e) => setCatatanGuru(e.target.value)}
                />
              </div>
            )}

            {/* ACTION BUTTONS (FLOATING FEEL) */}
            {!isLocked && (
              <div className="p-6 md:px-8 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-4 justify-between">
                
                <div className="flex flex-wrap flex-1 gap-3 min-w-[300px]">
                   <button 
                     onClick={saveReviewProgress} 
                     disabled={submitting}
                     className="flex-1 min-w-[140px] whitespace-nowrap px-4 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 transition-all active:scale-95"
                   >
                     <FontAwesomeIcon icon={faSave} /> Simpan Draft
                   </button>
                   <button 
                     onClick={handleRequestRevision} 
                     disabled={submitting || allApproved}
                     className="flex-1 min-w-[140px] whitespace-nowrap px-4 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
                   >
                     <FontAwesomeIcon icon={faTimesCircle} /> Minta Revisi
                   </button>
                </div>

                <div className="flex flex-wrap flex-1 gap-3 min-w-[300px]">
                   <button 
                     onClick={handleRejectAll} 
                     disabled={submitting}
                     className="flex-1 min-w-[140px] whitespace-nowrap px-4 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 bg-white text-rose-500 border-2 border-rose-200 hover:bg-rose-50 shadow-sm transition-all active:scale-95"
                   >
                     <FontAwesomeIcon icon={faTimesCircle} /> Tolak Semua
                   </button>
                   
                   <button 
                     onClick={handleApproveAll} 
                     disabled={submitting}
                     className={`flex-1 min-w-[140px] whitespace-nowrap px-4 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 border-2
                        ${allApproved ? 'bg-indigo-50 text-indigo-500 border-indigo-200 opacity-50 cursor-not-allowed' : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50 shadow-sm'}`}
                   >
                     <FontAwesomeIcon icon={faCheckCircle} /> Setujui Semua
                   </button>
                   
                   {allApproved && (
                     <button 
                       onClick={() => setIsIssuingSkl(true)}
                       disabled={submitting}
                       className="flex-1 min-w-[150px] whitespace-nowrap px-4 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white shadow-lg shadow-emerald-500/30 transition-all active:scale-95 border border-emerald-400/50"
                     >
                       <FontAwesomeIcon icon={faCheckCircle} /> Terbitkan SKL
                     </button>
                   )}
                </div>

              </div>
            )}

            {/* Issued State Box */}
            {isLocked && isSklIssued && (
              <div className="p-10 border-t border-emerald-100 dark:border-emerald-900 bg-gradient-to-b from-emerald-50/50 to-emerald-100/30 dark:from-emerald-900/20 dark:to-emerald-900/10 flex flex-col items-center justify-center text-center">
                 <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mb-5 ring-8 ring-emerald-50 dark:ring-emerald-900/20">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-4xl text-emerald-500" />
                 </div>
                 <h3 className="text-2xl font-extrabold text-emerald-800 dark:text-emerald-400 mb-2 font-display">Tugas Selesai & SKL Diterbitkan!</h3>
                 <p className="text-emerald-600/80 dark:text-emerald-400/80 font-medium mb-6 max-w-sm">
                   Seluruh review telah dikunci pada {dayjs(submission.skl_issued_at).format('DD MMMM YYYY')}.
                 </p>
                 <button 
                   onClick={() => window.open(submission.skl_drive_link, '_blank')} 
                   className="px-8 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5"
                 >
                   <FontAwesomeIcon icon={faGlobe} /> Buka Tautan Drive SKL
                 </button>
              </div>
            )}
            
            {/* Issuing Form Float */}
            {isIssuingSkl && !isLocked && (
               <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4">
                 <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200 border border-emerald-200 dark:border-emerald-800 relative">
                    <button onClick={() => setIsIssuingSkl(false)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-800 transition-colors">
                      <FontAwesomeIcon icon={faTimesCircle} />
                    </button>
                    
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-inner">
                      <FontAwesomeIcon icon={faPaperPlane} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Terbitkan SKL</h2>
                    <p className="text-slate-500 text-sm mb-8 leading-relaxed">Semua aspek telah tervalidasi. Langkah terakhir, letakkan link file **Surat Keterangan Lulus** (Google Drive) agar dapat diakses oleh Siswa.</p>
                    
                    <div className="space-y-4 mb-8">
                      <div className="relative">
                        <FontAwesomeIcon icon={faLink} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                          id="driveLink"
                          placeholder="https://drive.google.com/file/d/.../view" 
                          value={sklDriveLink}
                          onChange={(e) => setSklDriveLink(e.target.value)}
                          className="w-full pl-11 pr-4 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 font-medium transition-all"
                        />
                      </div>
                      <p className="text-xs font-semibold text-amber-600 bg-amber-50 dark:bg-amber-500/10 p-3 rounded-xl">⚠️ Pastikan akses link diubah ke mode "Anyone with the link can view".</p>
                    </div>

                    <div className="flex gap-3">
                       <button onClick={() => setIsIssuingSkl(false)} className="flex-1 py-3.5 rounded-xl font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">Batal</button>
                       <button 
                         onClick={handleIssueSkl} 
                         disabled={submitting || !sklDriveLink} 
                         className="flex-[2] py-3.5 rounded-xl font-bold text-white shadow-lg bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                       >
                         <FontAwesomeIcon icon={faCheckCircle} /> Sahkan & Kirim SKL
                       </button>
                    </div>
                 </div>
               </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
