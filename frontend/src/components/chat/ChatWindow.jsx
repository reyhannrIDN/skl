import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/utils/utils';
import {
  Loader2, ChevronDown, FileText, Download,
  Paperclip, Smile, Sticker, Send, X, MessageCircle,
  Pin, PinOff, Camera, ZoomIn, Info, Trash2, ChevronLeft
} from 'lucide-react';
import dayjs from 'dayjs';
import { EmojiPicker } from './EmojiPicker';
import { StickerPicker } from './StickerPicker';
import { GroupInfoModal } from './GroupInfoModal';
import { chatApi } from '@/api/chatApi';
import { STORAGE_BASE_URL } from '@/utils/runtimeConfig';
import toast from 'react-hot-toast';

export function ChatWindow({ group, onMessageSent, contacts, onAddMembers, onBack }) {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [text, setText] = useState('');
  const [hasMore, setHasMore] = useState(false);
  const [nextPage, setNextPage] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showSticker, setShowSticker] = useState(false);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const photoInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Pinned messages
  const [pinnedMessages, setPinnedMessages] = useState([]);

  // Mention
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionIndex, setMentionIndex] = useState(-1);
  const [groupMembers, setGroupMembers] = useState([]);
  const [mentionedIds, setMentionedIds] = useState([]);

  // Delete message
  const [deleteMsgId, setDeleteMsgId] = useState(null);

  // Group info modal
  const [showGroupInfo, setShowGroupInfo] = useState(false);

  // PDF lightbox
  const [lightboxPdf, setLightboxPdf] = useState(null);

  // Lightbox
  const [lightboxImage, setLightboxImage] = useState(null);

  const scrollToBottom = (smooth = true) => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
    }, 100);
  };

  useEffect(() => {
    if (group) {
      fetchMessages();
      fetchPinned();
      fetchGroupMembers();
      chatApi.markAsRead(group.id).catch(() => {});
      setShowEmoji(false);
      setShowSticker(false);
      setFile(null);
      setText('');
    }
  }, [group?.id]);

  const fetchPinned = async () => {
    if (!group) return;
    try {
      const { data } = await chatApi.getPinnedMessages(group.id);
      setPinnedMessages(data.messages || []);
    } catch (e) { /* ignore */ }
  };

  const fetchGroupMembers = async () => {
    if (!group || group.type === 'personal') return;
    try {
      const { data } = await chatApi.getGroupMembers(group.id);
      setGroupMembers(data.members || []);
    } catch (e) { /* ignore */ }
  };

  useEffect(() => {
    if (messages.length > 0 && !loading) {
      scrollToBottom(true);
    }
  }, [messages.length, loading]);

  const fetchMessages = async (page) => {
    if (!group) return;
    setLoading(true);
    try {
      const { data } = await chatApi.getMessages(group.id, page || 1);
      const fetchedMessages = (data.messages || []).reverse();
      if (page && page > 1) {
        setMessages(prev => [...fetchedMessages, ...prev]);
      } else {
        setMessages(fetchedMessages);
      }
      setHasMore(data.has_more || false);
      setNextPage(data.next_page);
    } catch (error) {
      toast.error('Gagal memuat pesan');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (nextPage) {
      const url = new URL(nextPage);
      const pageNum = url.searchParams.get('page') || 2;
      fetchMessages(parseInt(pageNum));
    }
  };

  const handleSend = async () => {
    const trimmedText = text.trim();
    if (!trimmedText && !file) return;

    setSending(true);
    try {
      let payload;
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('message_type', file.type.startsWith('image/') ? 'image' : 'file');
        if (trimmedText) formData.append('message', trimmedText);
        if (mentionedIds.length > 0) {
          mentionedIds.forEach(id => formData.append('mentioned_ids[]', id));
        }
        payload = formData;
      } else {
        payload = { message_type: 'text', message: trimmedText };
        if (mentionedIds.length > 0) {
          payload.mentioned_ids = mentionedIds;
        }
      }

      const { data } = await chatApi.sendMessage(group.id, payload);
      setMessages(prev => [...prev, data.message]);
      setText('');
      setFile(null);
      setMentionedIds([]);
      if (onMessageSent) onMessageSent();
      scrollToBottom(true);
    } catch (error) {
      const msg = error.response?.data?.message || 'Gagal mengirim pesan';
      toast.error(msg);
    } finally {
      setSending(false);
    }
  };

  const handleEmojiSelect = (emoji) => {
    setText(prev => prev + emoji);
    setShowEmoji(false);
  };

  const handleStickerSelect = async (stickerId, emoji) => {
    setShowSticker(false);
    setSending(true);
    try {
      const { data } = await chatApi.sendMessage(group.id, {
        message_type: 'sticker',
        sticker_id: stickerId,
        message: emoji,
      });
      setMessages(prev => [...prev, data.message]);
      if (onMessageSent) onMessageSent();
      scrollToBottom(true);
    } catch (error) {
      toast.error('Gagal mengirim stiker');
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTogglePin = async (message) => {
    try {
      await chatApi.togglePinMessage(group.id, message.id);
      fetchPinned();
      fetchMessages(1);
      toast.success(message.is_pinned ? 'Pesan dilepas dari sematan' : 'Pesan disematkan');
    } catch (e) {
      toast.error('Gagal mengubah sematan');
    }
  };

  const handleDeleteMessage = async (msgId, type) => {
    try {
      await chatApi.deleteMessage(group.id, msgId, type);
      setMessages(prev => prev.filter(m => m.id !== msgId));
      setDeleteMsgId(null);
      toast.success('Pesan berhasil dihapus');
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Gagal menghapus pesan');
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('photo', file);
    try {
      const { data } = await chatApi.uploadGroupPhoto(group.id, formData);
      toast.success(data.message || 'Foto grup diperbarui');
      if (onMessageSent) onMessageSent(data.group);
    } catch (error) {
      toast.error('Gagal mengupload foto');
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setText(value);

    const lastAt = value.lastIndexOf('@');
    if (lastAt !== -1 && lastAt === value.lastIndexOf('@', value.length - 1)) {
      const afterAt = value.slice(lastAt + 1);
      if (!afterAt.includes(' ') && afterAt.length < 30) {
        setMentionQuery(afterAt);
        setShowMentions(true);
        setMentionIndex(-1);
        return;
      }
    }
    setShowMentions(false);
  };

  const insertMention = (member) => {
    const lastAt = text.lastIndexOf('@');
    const before = text.slice(0, lastAt);
    setText(`${before}@${member.name} `);
    setMentionedIds(prev => [...new Set([...prev, member.id])]);
    setShowMentions(false);
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatDate = (date) => {
    const d = dayjs(date);
    const now = dayjs();
    if (d.isSame(now, 'day')) return d.format('HH:mm');
    if (d.isSame(now.subtract(1, 'day'), 'day')) return 'Kemarin ' + d.format('HH:mm');
    return d.format('DD/MM/YYYY HH:mm');
  };

  const shouldShowDate = (msg, idx) => {
    if (idx === 0) return true;
    const prev = messages[idx - 1];
    return !dayjs(msg.created_at).isSame(dayjs(prev.created_at), 'day');
  };

  const scrollToMessage = (msgId) => {
    const el = document.getElementById(`msg-${msgId}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  useEffect(() => {
    if (!deleteMsgId) return;
    const close = () => setDeleteMsgId(null);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [deleteMsgId]);

  const otherMembers = group?.member_users?.filter(m => m.id !== user?.id) || [];
  const otherNames = otherMembers.map(m => m.name).filter(Boolean);
  const displayName = group?.name
    || otherNames.join(', ')
    || contacts?.find(c => group?.member_users?.some(m => m.id === c.id))?.name
    || 'Memuat...';
  const onlineCount = otherMembers.filter(m => {
    if (!m.last_activity_at) return false;
    return new Date(m.last_activity_at).getTime() > Date.now() - 5 * 60 * 1000;
  }).length;
  const isGroupChat = otherMembers.length > 1 || group?.type === 'class_group' || group?.type === 'group';

  if (!group) {
    return (
      <div className={cn("flex-1 items-center justify-center bg-muted/20", !group ? "hidden md:flex" : "flex")}>
        <div className="text-center">
          <MessageCircle className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-muted-foreground">Pilih Percakapan</h3>
          <p className="text-sm text-muted-foreground/60 mt-1">Pilih chat atau kontak untuk memulai</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex-1 flex-col bg-white dark:bg-slate-900", !group ? "hidden md:flex" : "flex")}>
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700/50 flex items-center gap-3 bg-white dark:bg-slate-900">
        <button 
          onClick={onBack} 
          className="md:hidden p-2 -ml-2 text-muted-foreground hover:bg-muted rounded-xl transition-colors shrink-0"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="relative shrink-0 group/photo cursor-pointer" onClick={() => setShowGroupInfo(true)}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-black text-xs shadow-sm overflow-hidden">
            {group?.photo_url ? (
              <img src={`${STORAGE_BASE_URL}/${group.photo_url}`} alt="" className="w-full h-full object-cover" />
            ) : (
              getInitials(displayName)
            )}
          </div>
          {isGroupChat && (
            <button
              onClick={(e) => { e.stopPropagation(); photoInputRef.current?.click(); }}
              className="absolute inset-0 rounded-xl bg-black/40 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center"
              title="Ganti Foto Grup"
            >
              <Camera className="w-4 h-4 text-white" />
            </button>
          )}
          {onlineCount > 0 && (
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
          )}
        </div>
        <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setShowGroupInfo(true)}>
          <h3 className="font-bold text-sm truncate">{displayName}</h3>
          <p className="text-[10px] text-muted-foreground">
            {onlineCount > 0 ? `${onlineCount} online` : `${otherMembers.length} anggota`}
          </p>
        </div>
        <button
          onClick={() => setShowGroupInfo(true)}
          className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          title="Info Grup"
        >
          <Info className="w-4 h-4" />
        </button>
        {isGroupChat && onAddMembers && (
          <button
            onClick={() => onAddMembers(group)}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            title="Tambah Anggota"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
          </button>
        )}
      </div>

      {/* Pinned Messages Banner — always visible */}
      {pinnedMessages.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-500/5 border-b border-amber-200 dark:border-amber-500/20 px-4 py-2 shrink-0">
          <div className="flex items-center gap-2 mb-1">
            <Pin className="w-3 h-3 text-amber-600" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Disematkan</span>
          </div>
          <div className="space-y-1 max-h-20 overflow-y-auto">
            {pinnedMessages.map(pm => (
              <div
                key={pm.id}
                onClick={() => scrollToMessage(pm.id)}
                className="flex items-center gap-2 text-xs text-amber-800 dark:text-amber-300/80 cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-500/10 rounded px-1 py-0.5 transition-colors"
              >
                <span className="font-bold shrink-0">{pm.sender?.name}:</span>
                <span className="truncate">{pm.message || (pm.message_type === 'file' ? '📎 File' : pm.message_type === 'image' ? '🖼️ Gambar' : pm.message_type === 'sticker' ? '📌 Stiker' : '')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div
        ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar bg-gradient-to-b from-slate-50/50 to-white dark:from-slate-950/50 dark:to-slate-900"
        >
          {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {hasMore && (
              <button
                onClick={loadMore}
                className="w-full py-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center justify-center gap-1"
              >
                <ChevronDown className="w-3 h-3 rotate-180" />
                Muat pesan sebelumnya
              </button>
            )}

            {messages.map((msg, idx) => (
              <React.Fragment key={msg.id}>
                {shouldShowDate(msg, idx) && (
                  <div className="flex justify-center py-2">
                    <span className="text-[10px] font-bold text-muted-foreground/60 bg-muted/50 px-3 py-1 rounded-full uppercase tracking-wider">
                      {dayjs(msg.created_at).format('DD MMMM YYYY')}
                    </span>
                  </div>
                )}

                <div id={`msg-${msg.id}`} className={cn(
                  'flex gap-2 max-w-[80%]',
                  msg.sender_id === user?.id ? 'ml-auto flex-row-reverse' : ''
                )}>
                  {msg.sender_id !== user?.id && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center text-white font-bold text-[10px] shrink-0 shadow-sm">
                      {getInitials(msg.sender?.name)}
                    </div>
                  )}
                    <div className={cn(
                      'space-y-1 group/message',
                      msg.sender_id === user?.id ? 'items-end' : 'items-start'
                    )}>
                      {msg.sender_id !== user?.id && (
                        <p className="text-[10px] font-bold text-muted-foreground/60 px-1">{msg.sender?.name}</p>
                      )}
                      <div className="relative">
                          <div className={cn(
                            'rounded-2xl shadow-sm',
                            msg.message_type === 'sticker' && 'bg-transparent shadow-none p-0',
                            msg.message_type !== 'sticker' && 'px-4 py-2.5',
                            msg.message_type !== 'sticker' && (msg.sender_id === user?.id
                              ? 'bg-indigo-600 text-white rounded-tr-md'
                              : 'bg-muted/50 text-foreground rounded-tl-md')
                          )}>
                          {msg.message_type === 'sticker' && (
                            <span
                              className="text-6xl block animate-float"
                              style={{ animationDelay: `${(msg.id % 7) * 0.4}s` }}
                            >{msg.message}</span>
                          )}
                          {msg.message_type === 'emoji' && (
                            <span className="text-3xl block">{msg.message}</span>
                          )}
                          {(msg.message_type === 'text' || msg.message_type === 'file' || msg.message_type === 'image') && msg.message && (
                            <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                          )}
                              {msg.file_path && (
                                <div className="mt-2">
                                  {msg.mime_type?.startsWith('image/') ? (
                                    <div
                                      className="rounded-xl overflow-hidden max-w-[250px] cursor-pointer group/img relative"
                                      onClick={() => setLightboxImage({ url: `${STORAGE_BASE_URL}/${msg.file_path}`, name: msg.file_name })}
                                    >
                                      <img
                                        src={`${STORAGE_BASE_URL}/${msg.file_path}`}
                                        alt={msg.file_name}
                                        className="w-full h-auto object-cover rounded-xl"
                                      />
                                      <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 transition-colors rounded-xl flex items-center justify-center pointer-events-none">
                                        <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover/img:opacity-100 transition-opacity" />
                                      </div>
                                    </div>
                                  ) : msg.mime_type === 'application/pdf' ? (
                                    <button
                                      onClick={() => setLightboxPdf({ url: `${STORAGE_BASE_URL}/${msg.file_path}`, name: msg.file_name })}
                                      className={cn(
                                        'flex items-center gap-2 p-2 rounded-xl text-xs font-medium w-full text-left transition-colors',
                                        msg.sender_id === user?.id
                                          ? 'bg-indigo-500/30 text-white hover:bg-indigo-500/40'
                                          : 'bg-muted text-foreground hover:bg-muted/80'
                                      )}
                                    >
                                      <FileText className="w-4 h-4 text-red-500 shrink-0" />
                                      <span className="truncate flex-1">{msg.file_name}</span>
                                      <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 shrink-0">Lihat</span>
                                    </button>
                                ) : (
                                <a
                                  href={`${STORAGE_BASE_URL}/${msg.file_path}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={cn(
                                    'flex items-center gap-2 p-2 rounded-xl text-xs font-medium',
                                    msg.sender_id === user?.id
                                      ? 'bg-indigo-500/30 text-white'
                                      : 'bg-muted text-foreground'
                                  )}
                                >
                                  <FileText className="w-4 h-4" />
                                  <span className="truncate max-w-[150px]">{msg.file_name}</span>
                                  <Download className="w-3 h-3 shrink-0" />
                                </a>
                              )}
                            </div>
                          )}
                          <div className="flex items-center justify-end gap-1 mt-1">
                            {msg.mentions && msg.mentions.length > 0 && (
                              <span className="text-[9px] opacity-60">@</span>
                            )}
                            {msg.is_pinned && <Pin className="w-2.5 h-2.5 opacity-50" />}
                          </div>
                        </div>
                        <div className={cn(
                          'absolute -top-2 opacity-0 group-hover/message:opacity-100 transition-opacity flex gap-0.5 z-10',
                          msg.sender_id === user?.id ? '-left-6 flex-row' : '-right-6 flex-row-reverse'
                        )}>
                          <button
                            onClick={() => handleTogglePin(msg)}
                            className="p-1 rounded-lg hover:bg-muted transition-colors"
                            title={msg.is_pinned ? 'Lepas sematan' : 'Sematkan'}
                          >
                            {msg.is_pinned ? <PinOff className="w-3.5 h-3.5 text-amber-600" /> : <Pin className="w-3.5 h-3.5 text-muted-foreground" />}
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setDeleteMsgId(deleteMsgId === msg.id ? null : msg.id); }}
                            className="p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
                            title="Hapus pesan"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-red-500" />
                          </button>
                          {deleteMsgId === msg.id && (
                            <div className={cn(
                              'absolute top-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-1 min-w-[180px]',
                              msg.sender_id === user?.id ? 'left-0' : 'right-0'
                            )} onClick={e => e.stopPropagation()}>
                              <button
                                onClick={() => handleDeleteMessage(msg.id, 'me')}
                                className="w-full text-left px-3 py-2 text-xs font-medium hover:bg-muted transition-colors flex items-center gap-2"
                              >
                                <Trash2 className="w-3 h-3 text-muted-foreground" />
                                Hapus untuk saya
                              </button>
                              {msg.sender_id === user?.id && (
                                <button
                                  onClick={() => handleDeleteMessage(msg.id, 'everyone')}
                                  className="w-full text-left px-3 py-2 text-xs font-medium hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors flex items-center gap-2 text-red-600"
                                >
                                  <Trash2 className="w-3 h-3 text-red-500" />
                                  Hapus untuk semua
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    <p className={cn(
                      'text-[9px] font-medium px-1',
                      msg.sender_id === user?.id ? 'text-right' : 'text-left',
                      'text-muted-foreground/50'
                    )}>
                      {dayjs(msg.created_at).format('HH:mm')}
                    </p>
                  </div>
                </div>
              </React.Fragment>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* File Preview */}
      {file && (
        <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-700/50 bg-muted/20">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-muted/50">
            {file.type.startsWith('image/') ? (
              <img src={URL.createObjectURL(file)} alt="preview" className="w-10 h-10 rounded-lg object-cover" />
            ) : (
              <FileText className="w-10 h-10 text-muted-foreground" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-[10px] text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <button onClick={() => setFile(null)} className="p-1 hover:bg-muted rounded-lg transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900 relative">
        {showEmoji && (
          <EmojiPicker onSelect={handleEmojiSelect} onClose={() => setShowEmoji(false)} />
        )}
        {showSticker && (
          <StickerPicker onSelect={handleStickerSelect} onClose={() => setShowSticker(false)} />
        )}
        {showMentions && groupMembers.length > 0 && (
          <div className="absolute bottom-20 left-0 z-50 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-2 max-h-48 overflow-y-auto">
            {groupMembers
              .filter(m => m.name.toLowerCase().includes(mentionQuery.toLowerCase()) && m.id !== user?.id)
              .slice(0, 8)
              .map(member => (
                <button
                  key={member.id}
                  type="button"
                  className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-muted transition-colors text-left"
                  onClick={() => insertMention(member)}
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center text-white font-bold text-[10px] shrink-0">
                    {member.name?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <span className="text-sm font-medium truncate">{member.name}</span>
                  <span className="text-[9px] text-muted-foreground uppercase ml-auto">{member.role === 'superadmin' ? 'Admin' : member.role === 'guru' ? 'Guru' : 'Siswa'}</span>
                </button>
              ))}
            {groupMembers.filter(m => m.name.toLowerCase().includes(mentionQuery.toLowerCase()) && m.id !== user?.id).length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-3">Tidak ditemukan</p>
            )}
          </div>
        )}

        <div className="flex items-end gap-2">
          <div className="flex items-center gap-1 pb-1">
            <button
              type="button"
              onClick={() => { setShowEmoji(!showEmoji); setShowSticker(false); }}
              className={cn('p-2 rounded-lg hover:bg-muted transition-colors', showEmoji && 'bg-muted')}
              title="Emoji"
            >
              <Smile className="w-5 h-5 text-muted-foreground" />
            </button>
            <button
              type="button"
              onClick={() => { setShowSticker(!showSticker); setShowEmoji(false); }}
              className={cn('p-2 rounded-lg hover:bg-muted transition-colors', showSticker && 'bg-muted')}
              title="Stiker"
            >
              <Sticker className="w-5 h-5 text-muted-foreground" />
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              title="Lampirkan File"
            >
              <Paperclip className="w-5 h-5 text-muted-foreground" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
          <div className="flex-1 relative">
            <textarea
              value={text}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ketik pesan..."
              rows={1}
              className="w-full min-h-[44px] max-h-[120px] resize-none rounded-2xl bg-muted/50 border border-transparent focus:bg-background focus:border-primary transition-all px-4 py-3 text-sm outline-none"
              style={{ height: 'auto' }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
              }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={sending || (!text.trim() && !file)}
            className="p-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/20"
          >
            {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setLightboxImage(null)}>
          <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center" onClick={e => e.stopPropagation()}>
            <div className="absolute top-0 right-0 -mt-2 -mr-2 flex gap-2 z-10">
              <a
                href={lightboxImage.url}
                download={lightboxImage.name}
                className="p-2.5 bg-white/90 dark:bg-slate-800/90 rounded-xl shadow-lg hover:bg-white dark:hover:bg-slate-800 transition-colors"
                title="Download"
              >
                <Download className="w-5 h-5" />
              </a>
              <button
                onClick={() => setLightboxImage(null)}
                className="p-2.5 bg-white/90 dark:bg-slate-800/90 rounded-xl shadow-lg hover:bg-white dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <img
              src={lightboxImage.url}
              alt={lightboxImage.name}
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            />
            {lightboxImage.name && (
              <p className="text-white/70 text-sm mt-3 font-medium">{lightboxImage.name}</p>
            )}
          </div>
        </div>
      )}

      {/* PDF Lightbox */}
      {lightboxPdf && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setLightboxPdf(null)}>
          <div className="relative w-full max-w-5xl h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-white/80 text-sm font-medium truncate mr-4">{lightboxPdf.name}</p>
              <div className="flex gap-2 shrink-0">
                <a
                  href={lightboxPdf.url}
                  download={lightboxPdf.name}
                  className="p-2.5 bg-white/90 dark:bg-slate-800/90 rounded-xl shadow-lg hover:bg-white dark:hover:bg-slate-800 transition-colors"
                  title="Download"
                >
                  <Download className="w-5 h-5" />
                </a>
                <button
                  onClick={() => setLightboxPdf(null)}
                  className="p-2.5 bg-white/90 dark:bg-slate-800/90 rounded-xl shadow-lg hover:bg-white dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-2xl">
              <iframe
                src={`${lightboxPdf.url}#toolbar=0`}
                className="w-full h-full"
                title={lightboxPdf.name}
              />
            </div>
          </div>
        </div>
      )}

      {showGroupInfo && (
        <GroupInfoModal
          group={group}
          onClose={() => setShowGroupInfo(false)}
          onGroupUpdated={(updatedGroup) => {
            if (onMessageSent) onMessageSent();
          }}
        />
      )}
    </div>
  );
}
