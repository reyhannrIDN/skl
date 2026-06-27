import React, { useEffect, useState, useCallback } from 'react';
import { adminApi } from '@/api/adminApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import {
  Shield, Search, Loader2, Check, X, UserCog,
  Eye, PenSquare, PlusCircle, Trash2, MessageSquare,
  LayoutDashboard, BookOpen, GraduationCap, Users,
  DollarSign, ClipboardList, Settings, Star,
  Building2, Bus, FileText, ChevronDown, ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { cn } from '@/utils/utils';

const moduleIcons = {
  dashboard: LayoutDashboard,
  submissions: BookOpen,
  categories: ClipboardList,
  students: Users,
  monitoring: Star,
  pendapatan: DollarSign,
  chat: MessageSquare,
  tasks: ClipboardList,
  profile: Settings,
  projects: BookOpen,
  skl: FileText,
  school_visits: Bus,
};

const actionLabels = {
  view: 'Lihat',
  create: 'Tambah',
  edit: 'Ubah',
  delete: 'Hapus',
  review: 'Nilai',
  send: 'Kirim',
};

export function PermissionManagement() {
  const [users, setUsers] = useState([]);
  const [availablePerms, setAvailablePerms] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [saving, setSaving] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      const { data } = await adminApi.getPermissions(params);
      setUsers(data.users);
      setAvailablePerms(data.available_permissions);
    } catch {
      toast.error('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const togglePermission = async (user, module, action) => {
    const current = user.permissions || {};
    const modulePerms = current[module] || [];
    const hasAction = modulePerms.includes(action);
    const updated = {
      ...current,
      [module]: hasAction
        ? modulePerms.filter(a => a !== action)
        : [...modulePerms, action],
    };
    if (updated[module].length === 0) delete updated[module];

    setUsers(prev => prev.map(u =>
      u.id === user.id ? { ...u, permissions: updated } : u
    ));

    setSaving(user.id);
    try {
      await adminApi.updateUserPermissions(user.id, { permissions: Object.keys(updated).length ? updated : null });
      toast.success(`"${actionLabels[action] || action}" ${hasAction ? 'dicabut' : 'diberikan'} untuk ${user.name}`);
    } catch {
      toast.error('Gagal menyimpan');
      fetchData();
    } finally {
      setSaving(null);
    }
  };

  const setAll = async (user, module, actions, grant) => {
    const current = user.permissions || {};
    const updated = { ...current };
    if (grant) {
      updated[module] = actions;
    } else {
      delete updated[module];
    }

    setUsers(prev => prev.map(u =>
      u.id === user.id ? { ...u, permissions: updated } : u
    ));

    setSaving(user.id);
    try {
      await adminApi.updateUserPermissions(user.id, { permissions: Object.keys(updated).length ? updated : null });
      toast.success(`Semua akses ${module} ${grant ? 'diberikan' : 'dicabut'} untuk ${user.name}`);
    } catch {
      toast.error('Gagal menyimpan');
      fetchData();
    } finally {
      setSaving(null);
    }
  };

  const filteredUsers = users.filter(u => {
    if (roleFilter && u.role !== roleFilter) return false;
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-16">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <Shield className="w-4 h-4 text-indigo-500" />
            <span>Manajemen Akses</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white font-display">
            Atur Izin Pengguna
          </h1>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari pengguna..."
            className="w-full h-12 pl-11 pr-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="h-12 px-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          <option value="">Semua Role</option>
          <option value="guru">Guru</option>
          <option value="siswa">Siswa</option>
          <option value="idn">IDN</option>
        </select>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <Card className="border-none shadow-xl rounded-[2rem]">
            <CardContent className="p-12 text-center text-sm text-slate-400">
              Tidak ada pengguna ditemukan
            </CardContent>
          </Card>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {filteredUsers.map((user) => {
              const perms = user.permissions || {};
              const rolePerms = availablePerms[user.role] || {};
              const modules = Object.keys(rolePerms);
              const grantedCount = modules.filter(m => perms[m]?.length > 0).length;
              const isExpanded = expanded === user.id;

              const roleColors = {
                guru: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300',
                siswa: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
                idn: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300',
              };

              return (
                <motion.div
                  key={user.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-[2rem] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-xl overflow-hidden"
                >
                  {/* User Header */}
                  <button
                    onClick={() => setExpanded(isExpanded ? null : user.id)}
                    className="w-full flex items-center gap-4 p-5 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors text-left"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center shrink-0">
                      <UserCog className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <span className="font-black text-slate-900 dark:text-white truncate">{user.name}</span>
                        <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0", roleColors[user.role])}>
                          {user.role}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[10px] font-bold text-slate-400">
                        {grantedCount}/{modules.length} modul
                      </span>
                      {saving === user.id ? (
                        <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
                      ) : (
                        isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {/* Permission Modules */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 space-y-3 border-t border-slate-100 dark:border-white/5 pt-4">
                          {modules.map((module) => {
                            const actions = rolePerms[module];
                            const userActions = perms[module] || [];
                            const allGranted = actions.every(a => userActions.includes(a));
                            const anyGranted = actions.some(a => userActions.includes(a));
                            const Icon = moduleIcons[module] || Shield;

                            return (
                              <div key={module} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/30">
                                <div className="flex items-center gap-3 sm:w-44 shrink-0">
                                  <Icon className="w-4 h-4 text-indigo-500" />
                                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 capitalize">
                                    {module.replace(/_/g, ' ')}
                                  </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 flex-1">
                                  {actions.map((action) => {
                                    const granted = userActions.includes(action);
                                    return (
                                      <button
                                        key={action}
                                        onClick={() => togglePermission(user, module, action)}
                                        disabled={saving === user.id}
                                        className={cn(
                                          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all border",
                                          granted
                                            ? "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500/30"
                                            : "bg-white text-slate-400 border-slate-200 dark:bg-slate-900/50 dark:text-slate-500 dark:border-white/10 hover:border-indigo-200"
                                        )}
                                      >
                                        {granted ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                        {actionLabels[action] || action}
                                      </button>
                                    );
                                  })}
                                </div>
                                <div className="flex gap-1 shrink-0">
                                  {!allGranted && (
                                    <button
                                      onClick={() => setAll(user, module, actions, true)}
                                      disabled={saving === user.id}
                                      className="px-2.5 py-1.5 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 text-[10px] font-bold hover:bg-emerald-200 transition-colors disabled:opacity-50"
                                      title="Beri semua akses"
                                    >
                                      <PlusCircle className="w-3 h-3" />
                                    </button>
                                  )}
                                  {anyGranted && (
                                    <button
                                      onClick={() => setAll(user, module, actions, false)}
                                      disabled={saving === user.id}
                                      className="px-2.5 py-1.5 rounded-lg bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-300 text-[10px] font-bold hover:bg-red-200 transition-colors disabled:opacity-50"
                                      title="Cabut semua akses"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
