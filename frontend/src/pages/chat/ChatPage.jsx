import React, { useEffect, useState, useCallback } from 'react';
import { chatApi } from '@/api/chatApi';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { Loader2, X, Check, Users } from 'lucide-react';
import { cn } from '@/utils/utils';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';

export function ChatPage() {
  const { user } = useAuthStore();
  const [groups, setGroups] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('chats');

  // Add Member
  const [showAddMember, setShowAddMember] = useState(false);
  const [selectedMemberIds, setSelectedMemberIds] = useState([]);
  const [addingMember, setAddingMember] = useState(false);

  // Create Group
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [creatingGroup, setCreatingGroup] = useState(false);

  const fetchGroups = useCallback(async () => {
    try {
      const { data } = await chatApi.getGroups();
      setGroups(data.groups || []);
      if (selectedGroup) {
        const updated = (data.groups || []).find(g => g.id === selectedGroup.id);
        if (updated) setSelectedGroup(updated);
      }
    } catch (error) {
      if (error.response?.status !== 401) {
        toast.error('Gagal memuat daftar chat');
      }
    }
  }, [selectedGroup?.id]);

  const fetchContacts = useCallback(async () => {
    try {
      const { data } = await chatApi.getContacts();
      setContacts(data.contacts || []);
    } catch (error) {
      // silently fail
    }
  }, []);

  const fetchAll = useCallback(async () => {
    await Promise.all([fetchGroups(), fetchContacts()]);
  }, [fetchGroups, fetchContacts]);

  useEffect(() => {
    setLoading(true);
    fetchAll().finally(() => setLoading(false));

    const interval = setInterval(fetchAll, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectGroup = (group) => {
    setSelectedGroup(group);
    setActiveTab('chats');
  };

  const handleSelectContact = async (contact) => {
    try {
      setLoading(true);
      const { data } = await chatApi.createGroup({
        type: 'personal',
        member_ids: [contact.id],
      });
      await fetchGroups();
      setSelectedGroup(data.group);
      setActiveTab('chats');
    } catch (error) {
      toast.error('Gagal memulai percakapan');
    } finally {
      setLoading(false);
    }
  };

  const handleMessageSent = () => {
    fetchGroups();
  };

  const handleOpenAddMember = (group) => {
    setSelectedGroup(group);
    setSelectedMemberIds([]);
    setShowAddMember(true);
  };

  const handleAddMembers = async () => {
    if (!selectedGroup || selectedMemberIds.length === 0) return;
    setAddingMember(true);
    try {
      const { data } = await chatApi.addMembers(selectedGroup.id, selectedMemberIds);
      toast.success(data.message || 'Anggota berhasil ditambahkan');
      setShowAddMember(false);
      await fetchGroups();
      if (data.group) setSelectedGroup(data.group);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menambahkan anggota');
    } finally {
      setAddingMember(false);
    }
  };

  const toggleMemberSelection = (id) => {
    setSelectedMemberIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim() || selectedIds.length === 0) return;
    setCreatingGroup(true);
    try {
      const memberIds = selectedIds.filter(id => id !== user?.id);
      const { data } = await chatApi.createGroup({
        type: 'group',
        name: groupName.trim(),
        member_ids: memberIds,
      });
      toast.success('Grup berhasil dibuat');
      setShowCreateGroup(false);
      setGroupName('');
      setSelectedIds([]);
      await fetchGroups();
      setSelectedGroup(data.group);
      setActiveTab('chats');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal membuat grup');
    } finally {
      setCreatingGroup(false);
    }
  };

  const toggleCreateSelection = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  if (loading && groups.length === 0) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse font-medium">Memuat Chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] rounded-[2rem] overflow-hidden border border-slate-200 dark:border-slate-700/50 shadow-xl shadow-black/5">
      <ChatSidebar
        groups={groups}
        contacts={contacts}
        selectedGroupId={selectedGroup?.id}
        onSelectGroup={handleSelectGroup}
        onSelectContact={handleSelectContact}
        loading={loading}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onCreateGroup={() => setShowCreateGroup(true)}
      />
      <ChatWindow
        group={selectedGroup}
        onMessageSent={handleMessageSent}
        contacts={contacts}
        onAddMembers={handleOpenAddMember}
        onBack={() => setSelectedGroup(null)}
      />

      {/* Create Group Modal */}
      {showCreateGroup && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowCreateGroup(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col border border-slate-200 dark:border-slate-700 overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-slate-200 dark:border-slate-700/50 flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                Buat Grup Baru
              </h3>
              <button onClick={() => setShowCreateGroup(false)} className="p-2 hover:bg-muted rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 border-b border-slate-200 dark:border-slate-700/50">
              <input
                type="text"
                value={groupName}
                onChange={e => setGroupName(e.target.value)}
                placeholder="Nama grup..."
                className="w-full h-12 px-4 rounded-xl bg-muted/50 border border-transparent focus:bg-background focus:border-primary transition-all text-sm outline-none font-medium"
                autoFocus
              />
              <p className="text-xs text-muted-foreground mt-2 px-1">Pilih anggota untuk ditambahkan ke grup:</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {contacts.map(contact => (
                <button
                  key={contact.id}
                  onClick={() => toggleCreateSelection(contact.id)}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left',
                    selectedIds.includes(contact.id)
                      ? 'bg-indigo-50 dark:bg-indigo-500/10 ring-2 ring-indigo-500/30'
                      : 'hover:bg-muted'
                  )}
                >
                  <div className={cn(
                    'w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0',
                    selectedIds.includes(contact.id)
                      ? 'bg-indigo-600 border-indigo-600'
                      : 'border-muted-foreground/30'
                  )}>
                    {selectedIds.includes(contact.id) && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {contact.name?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm truncate">{contact.name}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      {contact.role === 'superadmin' ? 'Admin' : contact.role === 'guru' ? 'Guru' : 'Siswa'}
                      {contact.is_online && <span className="text-emerald-600 ml-2">Online</span>}
                    </p>
                  </div>
                </button>
              ))}
              {contacts.length === 0 && (
                <p className="text-center text-muted-foreground py-8 text-sm">Tidak ada kontak tersedia</p>
              )}
            </div>
            <div className="p-4 border-t border-slate-200 dark:border-slate-700/50 flex justify-end gap-2">
              <button
                onClick={() => setShowCreateGroup(false)}
                className="px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-muted transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleCreateGroup}
                disabled={!groupName.trim() || selectedIds.length === 0 || creatingGroup}
                className="px-5 py-2.5 rounded-xl font-bold text-sm bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {creatingGroup ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                Buat Grup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddMember && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowAddMember(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col border border-slate-200 dark:border-slate-700 overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-slate-200 dark:border-slate-700/50 flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                Tambah Anggota
              </h3>
              <button onClick={() => setShowAddMember(false)} className="p-2 hover:bg-muted rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {contacts.filter(c => {
                const isAlreadyMember = selectedGroup?.member_users?.some(m => m.id === c.id);
                return !isAlreadyMember;
              }).map(contact => (
                <button
                  key={contact.id}
                  onClick={() => toggleMemberSelection(contact.id)}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left',
                    selectedMemberIds.includes(contact.id)
                      ? 'bg-indigo-50 dark:bg-indigo-500/10 ring-2 ring-indigo-500/30'
                      : 'hover:bg-muted'
                  )}
                >
                  <div className={cn(
                    'w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0',
                    selectedMemberIds.includes(contact.id)
                      ? 'bg-indigo-600 border-indigo-600'
                      : 'border-muted-foreground/30'
                  )}>
                    {selectedMemberIds.includes(contact.id) && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {contact.name?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm truncate">{contact.name}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      {contact.role === 'superadmin' ? 'Admin' : contact.role === 'guru' ? 'Guru' : 'Siswa'}
                      {contact.is_online && <span className="text-emerald-600 ml-2">Online</span>}
                    </p>
                  </div>
                </button>
              ))}
              {contacts.filter(c => !selectedGroup?.member_users?.some(m => m.id === c.id)).length === 0 && (
                <p className="text-center text-muted-foreground py-8 text-sm">Semua kontak sudah menjadi anggota</p>
              )}
            </div>
            <div className="p-4 border-t border-slate-200 dark:border-slate-700/50 flex justify-end gap-2">
              <button
                onClick={() => setShowAddMember(false)}
                className="px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-muted transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleAddMembers}
                disabled={selectedMemberIds.length === 0 || addingMember}
                className="px-5 py-2.5 rounded-xl font-bold text-sm bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {addingMember ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                Tambahkan ({selectedMemberIds.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
