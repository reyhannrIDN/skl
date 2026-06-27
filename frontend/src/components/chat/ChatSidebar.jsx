import React from 'react';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/utils/utils';
import { MessageCircle, Users, Search, Loader2 } from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/id';
import { STORAGE_BASE_URL } from '@/utils/runtimeConfig';

dayjs.extend(relativeTime);
dayjs.locale('id');

export function ChatSidebar({
  groups,
  contacts,
  selectedGroupId,
  onSelectGroup,
  onSelectContact,
  loading,
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
  onCreateGroup,
}) {
  const { user } = useAuthStore();

  const getAvatar = (name) => {
    return name?.charAt(0).toUpperCase() || '?';
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  const filteredGroups = groups.filter(g => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const otherMembers = g.member_users?.filter(m => m.id !== user?.id) || [];
    return otherMembers.some(m => m.name?.toLowerCase().includes(q)) || g.name?.toLowerCase().includes(q);
  });

  const filteredContacts = contacts.filter(c => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return c.name?.toLowerCase().includes(q);
  });

  return (
    <div className={cn(
      "w-full md:w-80 lg:w-96 border-r border-slate-200 dark:border-slate-700/50 flex-col bg-white/50 dark:bg-slate-900/50",
      selectedGroupId ? "hidden md:flex" : "flex"
    )}>
      {/* Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-700/50">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-indigo-600" />
            Pesan
          </h2>
          {onCreateGroup && (
            <button
              onClick={onCreateGroup}
              className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 hover:bg-indigo-200 dark:hover:bg-indigo-500/30 transition-all"
              title="Buat Grup Baru"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
            </button>
          )}
        </div>
        <div className="relative mt-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari percakapan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-muted/50 border border-transparent focus:bg-background focus:border-primary transition-all text-sm outline-none"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-700/50">
        <button
          onClick={() => setActiveTab('chats')}
          className={cn(
            'flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-all',
            activeTab === 'chats'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          Chat
        </button>
        <button
          onClick={() => setActiveTab('contacts')}
          className={cn(
            'flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-all',
            activeTab === 'contacts'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          Kontak
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : activeTab === 'chats' ? (
          filteredGroups.length === 0 ? (
            <div className="p-8 text-center">
              <MessageCircle className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground font-medium">Belum ada percakapan</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Pilih kontak untuk memulai chat</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {filteredGroups.map((group) => {
                const isSelected = group.id === selectedGroupId;
                const otherMembers = group.member_users?.filter(m => m.id !== user?.id) || [];
                const otherNames = otherMembers.map(m => m.name).filter(Boolean);
                const displayName = group.name
                  || otherNames.join(', ')
                  || contacts?.find(c => group.member_users?.some(m => m.id === c.id))?.name
                  || 'Memuat...';
                const lastMsg = group.last_message;
                const onlineCount = otherMembers.filter(m => {
                  if (!m.last_activity_at) return false;
                  return new Date(m.last_activity_at).getTime() > Date.now() - 5 * 60 * 1000;
                }).length;

                return (
                  <button
                    key={group.id}
                    onClick={() => onSelectGroup(group)}
                    className={cn(
                      'w-full p-4 flex gap-3 transition-all text-left hover:bg-muted/50',
                      isSelected && 'bg-indigo-50 dark:bg-indigo-500/10'
                    )}
                  >
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-black text-sm shadow-sm overflow-hidden shrink-0">
                        {group.photo_url ? (
                          <img src={`${STORAGE_BASE_URL}/${group.photo_url}`} alt="" className="w-full h-full object-cover" />
                        ) : (
                          getInitials(displayName)
                        )}
                      </div>
                      {onlineCount > 0 && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-bold text-sm truncate">{displayName}</h4>
                        {lastMsg && (
                          <span className="text-[10px] text-muted-foreground shrink-0">
                            {dayjs(lastMsg.created_at).fromNow(true)}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {lastMsg ? lastMsg.message || (lastMsg.message_type === 'file' ? '📎 File' : lastMsg.message_type === 'image' ? '🖼️ Gambar' : lastMsg.message_type === 'sticker' ? '📌 Stiker' : '') : 'Belum ada pesan'}
                      </p>
                    </div>
                    {group.unread_count > 0 && (
                      <div className="shrink-0">
                        <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-indigo-600 text-[10px] font-black text-white">
                          {group.unread_count > 99 ? '99+' : group.unread_count}
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )
        ) : (
          /* Contacts Tab */
          <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {filteredContacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => onSelectContact(contact)}
                className="w-full p-4 flex gap-3 transition-all text-left hover:bg-muted/50"
              >
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center text-white font-black text-sm shadow-sm">
                    {getInitials(contact.name)}
                  </div>
                  {contact.is_online && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm">{contact.name}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={cn(
                      'text-[10px] font-bold uppercase tracking-wider',
                      contact.is_online ? 'text-emerald-600' : 'text-muted-foreground'
                    )}>
                      {contact.is_online ? 'Online' : 'Offline'}
                    </span>
                    <span className="text-[10px] text-muted-foreground uppercase">
                      {contact.role === 'superadmin' ? 'Admin' : contact.role === 'guru' ? 'Guru' : 'Siswa'}
                    </span>
                  </div>
                </div>
              </button>
            ))}
            {filteredContacts.length === 0 && (
              <div className="p-8 text-center">
                <Users className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground font-medium">Tidak ada kontak</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
