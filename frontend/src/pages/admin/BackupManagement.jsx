import { useState, useEffect, useCallback, useRef } from 'react';
import { adminApi } from '@/api/adminApi';
import { Button } from '@/components/common/Button';
import { toast } from 'react-hot-toast';
import {
  Download,
  Trash2,
  Plus,
  RefreshCw,
  RotateCcw,
  Upload,
  Clock,
  Calendar,
  Database,
  HardDrive,
  AlertCircle,
  FileArchive,
  Save,
  X,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

const DAYS = [
  { value: 'Monday', label: 'Senin' },
  { value: 'Tuesday', label: 'Selasa' },
  { value: 'Wednesday', label: 'Rabu' },
  { value: 'Thursday', label: 'Kamis' },
  { value: 'Friday', label: "Jum'at" },
  { value: 'Saturday', label: 'Sabtu' },
  { value: 'Sunday', label: 'Minggu' },
];

export function BackupManagement() {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [schedule, setSchedule] = useState(null);
  const [scheduleLoading, setScheduleLoading] = useState(true);
  const [savingSchedule, setSavingSchedule] = useState(false);

  // Restore dialog state
  const [restoreTarget, setRestoreTarget] = useState(null);
  const [restoreDb, setRestoreDb] = useState(true);
  const [restoreFiles, setRestoreFiles] = useState(true);
  const [restoring, setRestoring] = useState(false);

  // Upload restore state
  const [showUploadRestore, setShowUploadRestore] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadRestoreDb, setUploadRestoreDb] = useState(true);
  const [uploadRestoreFiles, setUploadRestoreFiles] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const fetchBackups = useCallback(async () => {
    try {
      const res = await adminApi.getBackups();
      setBackups(res.data.backups);
    } catch {
      toast.error('Gagal memuat daftar backup');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSchedule = useCallback(async () => {
    try {
      const res = await adminApi.getBackupSchedule();
      setSchedule(res.data.schedule);
    } catch {
      toast.error('Gagal memuat jadwal backup');
    } finally {
      setScheduleLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBackups();
    fetchSchedule();
  }, [fetchBackups, fetchSchedule]);

  const handleCreateBackup = async () => {
    setCreating(true);
    try {
      const res = await adminApi.createBackup();
      toast.success(res.data.message);
      setBackups(prev => [res.data.backup, ...prev]);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal membuat backup');
    } finally {
      setCreating(false);
    }
  };

  const handleDownload = async (filename) => {
    try {
      const res = await adminApi.downloadBackup(filename);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error('Gagal mengunduh backup');
    }
  };

  const handleDelete = async (filename) => {
    if (!confirm(`Hapus backup ${filename}?`)) return;
    try {
      await adminApi.deleteBackup(filename);
      toast.success('Backup berhasil dihapus');
      setBackups(prev => prev.filter(b => b.filename !== filename));
    } catch {
      toast.error('Gagal menghapus backup');
    }
  };

  const openRestore = (filename) => {
    setRestoreTarget(filename);
    setRestoreDb(true);
    setRestoreFiles(true);
  };

  const closeRestore = () => {
    setRestoreTarget(null);
    setRestoring(false);
  };

  const handleRestore = async () => {
    if (!restoreDb && !restoreFiles) {
      toast.error('Pilih minimal satu opsi restore');
      return;
    }
    if (!confirm(
      `Yakin akan merestore backup ${restoreTarget}?\n\n` +
      `${restoreDb ? '✓ Database akan diganti dengan data backup\n' : ''}` +
      `${restoreFiles ? '✓ File upload akan diganti dengan file backup\n' : ''}\n` +
      'Data saat ini akan hilang dan diganti data backup!'
    )) return;

    setRestoring(true);
    try {
      const res = await adminApi.restoreBackup(restoreTarget, {
        restore_database: restoreDb,
        restore_files: restoreFiles,
      });
      toast.success(res.data.message);
      closeRestore();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal merestore backup');
    } finally {
      setRestoring(false);
    }
  };

  const handleUploadRestore = async () => {
    if (!uploadFile) {
      toast.error('Pilih file backup terlebih dahulu');
      return;
    }
    if (!uploadRestoreDb && !uploadRestoreFiles) {
      toast.error('Pilih minimal satu opsi restore');
      return;
    }
    if (!confirm(
      `Yakin akan merestore dari file ${uploadFile.name}?\n\n` +
      `${uploadRestoreDb ? '✓ Database akan diganti dengan data backup\n' : ''}` +
      `${uploadRestoreFiles ? '✓ File upload akan diganti dengan file backup\n' : ''}\n` +
      'Data saat ini akan hilang dan diganti data backup!'
    )) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('backup_file', uploadFile);
      formData.append('restore_database', uploadRestoreDb);
      formData.append('restore_files', uploadRestoreFiles);
      const res = await adminApi.restoreBackupFromUpload(formData);
      toast.success(res.data.message);
      closeUploadRestore();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal merestore backup');
    } finally {
      setUploading(false);
    }
  };

  const closeUploadRestore = () => {
    setShowUploadRestore(false);
    setUploadFile(null);
    setUploadRestoreDb(true);
    setUploadRestoreFiles(true);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSaveSchedule = async () => {
    setSavingSchedule(true);
    try {
      const res = await adminApi.updateBackupSchedule(schedule);
      toast.success(res.data.message);
    } catch {
      toast.error('Gagal menyimpan jadwal');
    } finally {
      setSavingSchedule(false);
    }
  };

  const toggleDay = (day) => {
    setSchedule(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day],
    }));
  };

  if (loading || scheduleLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-6 h-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Manajemen Backup</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Backup dan restore database serta file upload</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Button variant="outline" onClick={() => setShowUploadRestore(true)} className="gap-2 justify-center">
            <Upload className="w-4 h-4" />
            Upload & Restore
          </Button>
          <Button onClick={handleCreateBackup} disabled={creating} className="gap-2 justify-center">
            <Plus className="w-4 h-4" />
            {creating ? 'Membuat...' : 'Buat Backup Baru'}
          </Button>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="font-bold">Database</h3>
          </div>
          <p className="text-indigo-100 text-sm leading-relaxed">
            MySQL dump dengan struktur dan data lengkap, termasuk stored procedures dan events.
          </p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <HardDrive className="w-5 h-5" />
            </div>
            <h3 className="font-bold">File Upload</h3>
          </div>
          <p className="text-emerald-100 text-sm leading-relaxed">
            Semua file upload siswa (submissions, foto, dokumen) turut dibackup.
          </p>
        </div>
      </div>

      {/* Schedule Settings */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl">
              <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white">Jadwal Backup Otomatis</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Backup berjalan otomatis via cron job</p>
            </div>
          </div>
          <button
            onClick={() => setSchedule(prev => ({ ...prev, enabled: !prev.enabled }))}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 ${
              schedule.enabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${
                schedule.enabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              <Calendar className="w-4 h-4 inline mr-2" />
              Hari Backup
            </label>
            <div className="flex flex-wrap gap-2">
              {DAYS.map(day => (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => toggleDay(day.value)}
                  disabled={!schedule.enabled}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    schedule.days?.includes(day.value)
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  } ${!schedule.enabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Jam Backup
              </label>
              <input
                type="time"
                value={schedule.time || '02:00'}
                onChange={e => setSchedule(prev => ({ ...prev, time: e.target.value }))}
                disabled={!schedule.enabled}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Maksimal Backup Tersimpan
              </label>
              <input
                type="number"
                min={1}
                max={100}
                value={schedule.max_backups || 10}
                onChange={e => setSchedule(prev => ({ ...prev, max_backups: parseInt(e.target.value) || 10 }))}
                disabled={!schedule.enabled}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
            <p className="text-xs text-slate-400">
              {schedule.enabled
                ? `Backup akan berjalan setiap ${schedule.days?.length || 0} hari yang dipilih pukul ${schedule.time || '02:00'}`
                : 'Jadwal backup otomatis saat ini nonaktif'}
            </p>
            <Button onClick={handleSaveSchedule} disabled={savingSchedule} className="gap-2">
              <Save className="w-4 h-4" />
              {savingSchedule ? 'Menyimpan...' : 'Simpan Jadwal'}
            </Button>
          </div>
        </div>
      </div>

      {/* Backup List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 dark:border-white/5">
          <h2 className="font-bold text-slate-900 dark:text-white">Daftar Backup</h2>
        </div>

        {backups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-4">
              <FileArchive className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-1">Belum Ada Backup</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
              Belum ada file backup. Klik tombol "Buat Backup Baru" untuk memulai.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-white/5">
            {backups.map(backup => (
              <div
                key={backup.filename}
                className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl shrink-0">
                    <FileArchive className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {backup.filename}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {backup.size_formatted} &middot; {backup.created_at}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openRestore(backup.filename)}
                    className="text-slate-400 hover:text-amber-600"
                    title="Restore"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(backup.filename)}
                    className="text-slate-400 hover:text-indigo-600"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(backup.filename)}
                    className="text-slate-400 hover:text-red-600"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Restore from List Dialog */}
      {restoreTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={closeRestore} />
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 dark:bg-amber-500/10 rounded-xl">
                  <RotateCcw className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white">Restore Backup</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-[260px]">
                    {restoreTarget}
                  </p>
                </div>
              </div>
              <button
                onClick={closeRestore}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mx-6 mt-4 p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">Perhatian!</p>
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-1 leading-relaxed">
                  Restore akan menimpa data saat ini dengan data dari backup. Pastikan Anda telah membackup data terbaru sebelum merestore.
                </p>
              </div>
            </div>

            <div className="px-6 py-5 space-y-4">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Pilih yang akan direstore:
              </p>

              <label className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                restoreDb
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10'
                  : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
              }`}>
                <div className={`p-2 rounded-xl ${
                  restoreDb
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}>
                  <Database className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 dark:text-slate-200">Database</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Struktur tabel dan semua data</p>
                </div>
                <input
                  type="checkbox"
                  checked={restoreDb}
                  onChange={e => setRestoreDb(e.target.checked)}
                  className="w-5 h-5 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
              </label>

              <label className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                restoreFiles
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10'
                  : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
              }`}>
                <div className={`p-2 rounded-xl ${
                  restoreFiles
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}>
                  <HardDrive className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 dark:text-slate-200">File Upload</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Submissions, foto, dokumen siswa</p>
                </div>
                <input
                  type="checkbox"
                  checked={restoreFiles}
                  onChange={e => setRestoreFiles(e.target.checked)}
                  className="w-5 h-5 rounded-lg border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-5 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-900/50">
              <Button variant="outline" onClick={closeRestore} disabled={restoring}>
                Batal
              </Button>
              <Button
                onClick={handleRestore}
                disabled={restoring || (!restoreDb && !restoreFiles)}
                className="gap-2 bg-amber-600 hover:bg-amber-700 text-white"
              >
                {restoring ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Merestore...
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-4 h-4" />
                    Restore Sekarang
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Upload & Restore Dialog */}
      {showUploadRestore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={closeUploadRestore} />
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl">
                  <Upload className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white">Upload & Restore</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Restore dari file backup</p>
                </div>
              </div>
              <button
                onClick={closeUploadRestore}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mx-6 mt-4 p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">Perhatian!</p>
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-1 leading-relaxed">
                  Restore akan menimpa data saat ini dengan data dari file backup yang diupload.
                </p>
              </div>
            </div>

            <div className="px-6 pt-5 pb-3 space-y-4">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Pilih File Backup (.tar.gz)
                </label>
                <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                  uploadFile
                    ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-500/10'
                    : 'border-slate-300 dark:border-white/20 hover:border-indigo-400 bg-slate-50 dark:bg-slate-800/50'
                }`}>
                  {uploadFile ? (
                    <div className="flex items-center gap-3">
                      <FileArchive className="w-8 h-8 text-indigo-600" />
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{uploadFile.name}</p>
                        <p className="text-xs text-slate-500">{(uploadFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="w-8 h-8 text-slate-400" />
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        Klik untuk pilih file atau tarik & lepas
                      </p>
                      <p className="text-xs text-slate-400">.tar.gz</p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".tar.gz,.tar,.gz"
                    onChange={e => setUploadFile(e.target.files[0] || null)}
                    className="hidden"
                  />
                </label>
              </div>

              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Pilih yang akan direstore:
              </p>

              <label className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                uploadRestoreDb
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10'
                  : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
              }`}>
                <div className={`p-2 rounded-xl ${
                  uploadRestoreDb
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}>
                  <Database className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 dark:text-slate-200">Database</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Struktur tabel dan semua data</p>
                </div>
                <input
                  type="checkbox"
                  checked={uploadRestoreDb}
                  onChange={e => setUploadRestoreDb(e.target.checked)}
                  className="w-5 h-5 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
              </label>

              <label className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                uploadRestoreFiles
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10'
                  : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
              }`}>
                <div className={`p-2 rounded-xl ${
                  uploadRestoreFiles
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}>
                  <HardDrive className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 dark:text-slate-200">File Upload</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Submissions, foto, dokumen siswa</p>
                </div>
                <input
                  type="checkbox"
                  checked={uploadRestoreFiles}
                  onChange={e => setUploadRestoreFiles(e.target.checked)}
                  className="w-5 h-5 rounded-lg border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-5 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-900/50">
              <Button variant="outline" onClick={closeUploadRestore} disabled={uploading}>
                Batal
              </Button>
              <Button
                onClick={handleUploadRestore}
                disabled={uploading || !uploadFile || (!uploadRestoreDb && !uploadRestoreFiles)}
                className="gap-2 bg-amber-600 hover:bg-amber-700 text-white"
              >
                {uploading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Mengupload & Merestore...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Upload & Restore
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
