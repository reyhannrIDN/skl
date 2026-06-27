import React, { useState, useEffect, useRef } from 'react';
import { X, Crown, Shield, UserMinus, Camera, Save, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { chatApi } from '@/api/chatApi';
import { STORAGE_BASE_URL } from '@/utils/runtimeConfig';
import { cn } from '@/utils/utils';
import toast from 'react-hot-toast';

const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
};

export function GroupInfoModal({ group, onClose, onGroupUpdated }) {
  const { user } = useAuthStore();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [description, setDescription] = useState(group?.description || '');
  const [notes, setNotes] = useState(group?.notes || '');
  const [groupName, setGroupName] = useState(group?.name || '');
  const [saving, setSaving] = useState(false);
  const [togglingAdmin, setTogglingAdmin] = useState(null);
  const [removingMember, setRemovingMember] = useState(null);
  const photoInputRef = useRef(null);

  const isGroup = group?.type === 'group' || group?.type === 'class_group';
  const currentMember = members.find(m => m.id === user?.id);
  const isAdmin = currentMember?.is_admin;

  useEffect(() => {
    fetchMembers();
  }, [group?.id]);

  const fetchMembers = async () => {
    try {
      const { data } = await chatApi.getGroupMembers(group.id);
      setMembers(data.members || []);
    } catch {
      toast.error('Gagal memuat anggota grup');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const fd = new FormData();
      fd.append('photo', file);
      const { data } = await chatApi.uploadGroupPhoto(group.id, fd);
      toast.success('Foto grup berhasil diperbarui');
      if (onGroupUpdated) onGroupUpdated(data.group);
    } catch {
      toast.error('Gagal mengupload foto');
    }
  };

  const handleSaveInfo = async () => {
    setSaving(true);
    try {
      const payload = {};
      if (groupName !== group?.name) payload.name = groupName;
      if (description !== (group?.description || '')) payload.description = description;
      if (notes !== (group?.notes || '')) payload.notes = notes;
      if (Object.keys(payload).length === 0) return;
      const { data } = await chatApi.updateGroup(group.id, payload);
      toast.success('Info grup berhasil diperbarui');
      if (onGroupUpdated) onGroupUpdated(data.group);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleAdmin = async (userId) => {
    setTogglingAdmin(userId);
    try {
      const { data } = await chatApi.toggleAdmin(group.id, userId);
      setMembers(prev => prev.map(m =>
        m.id === userId ? { ...m, is_admin: data.is_admin } : m
      ));
      toast.success(data.message);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Gagal mengubah admin');
    } finally {
      setTogglingAdmin(null);
    }
  };

  const handleRemoveMember = async (userId, userName) => {
    if (!confirm(`Yakin ingin mengeluarkan ${userName} dari grup?`)) return;
    setRemovingMember(userId);
    try {
      await chatApi.removeMember(group.id, userId);
      setMembers(prev => prev.filter(m => m.id !== userId));
      toast.success(`${userName} berhasil dikeluarkan`);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Gagal mengeluarkan anggota');
    } finally {
      setRemovingMember(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto mx-4"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700/50">
          <h3 className="font-bold text-base">Info Grup</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Group Photo & Name */}
        <div className="p-4 flex flex-col items-center gap-2 border-b border-slate-200 dark:border-slate-700/50">
          <div className="relative group/photo">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-black text-2xl shadow-sm overflow-hidden">
              {group?.photo_url ? (
                <img src={`${STORAGE_BASE_URL}/${group.photo_url}`} alt="" className="w-full h-full object-cover" />
              ) : (
                getInitials(groupName)
              )}
            </div>
            {isAdmin && (
              <>
                <button
                  onClick={() => photoInputRef.current?.click()}
                  className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <Camera className="w-6 h-6 text-white" />
                </button>
                <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              </>
            )}
          </div>
          {isAdmin ? (
            <input
              type="text"
              value={groupName}
              onChange={e => setGroupName(e.target.value)}
              className="text-center font-bold text-base bg-transparent border-b border-dashed border-slate-300 dark:border-slate-600 focus:border-indigo-500 outline-none px-2 py-0.5"
            />
          ) : (
            <h4 className="font-bold text-base">{groupName}</h4>
          )}
        </div>

        {/* Description & Notes */}
        <div className="p-4 space-y-4 border-b border-slate-200 dark:border-slate-700/50">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">Deskripsi</label>
            {isAdmin ? (
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Tambahkan deskripsi grup..."
                rows={2}
                className="w-full text-sm bg-muted/30 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
              />
            ) : (
              <p className="text-sm text-muted-foreground">{description || <span className="italic opacity-50">Tidak ada deskripsi</span>}</p>
            )}
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">Catatan</label>
            {isAdmin ? (
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Tambahkan catatan grup..."
                rows={2}
                className="w-full text-sm bg-muted/30 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
              />
            ) : (
              <p className="text-sm text-muted-foreground">{notes || <span className="italic opacity-50">Tidak ada catatan</span>}</p>
            )}
          </div>
          {isAdmin && (
            <button
              onClick={handleSaveInfo}
              disabled={saving}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Simpan
            </button>
          )}
        </div>

        {/* Members List */}
        <div className="p-4">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">
            Anggota ({members.length})
          </h4>
          {loading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-1">
              {members.map(m => (
                <div key={m.id} className="flex items-center gap-3 py-2 px-2 rounded-xl hover:bg-muted/50 transition-colors group">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm">
                    {getInitials(m.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold truncate">{m.name}</span>
                      {m.is_admin && (
                        <Crown className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground capitalize">{m.role}</p>
                  </div>
                  {isAdmin && m.id !== user?.id && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleToggleAdmin(m.id)}
                        disabled={togglingAdmin === m.id}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                        title={m.is_admin ? 'Turunkan sebagai anggota' : 'Jadikan admin'}
                      >
                        {togglingAdmin === m.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
                        ) : (
                          <Shield className={cn('w-3.5 h-3.5', m.is_admin ? 'text-amber-500' : 'text-muted-foreground hover:text-amber-500')} />
                        )}
                      </button>
                      <button
                        onClick={() => handleRemoveMember(m.id, m.name)}
                        disabled={removingMember === m.id}
                        className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
                        title="Keluarkan dari grup"
                      >
                        {removingMember === m.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-red-500" />
                        ) : (
                          <UserMinus className="w-3.5 h-3.5 text-muted-foreground hover:text-red-500" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
