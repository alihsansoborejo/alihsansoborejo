import React from 'react';
import { useDataContext } from '../context/DataContext';
import { ShieldCheck, Eye, Settings, LogOut, Download, RefreshCw } from 'lucide-react';

export const AdminBar: React.FC = () => {
  const { isAdmin, viewMode, setViewMode, logoutAdmin, exportBackupJSON, cloudSyncStatus, lastSyncedAt } = useDataContext();

  if (!isAdmin) return null;

  return (
    <div
      id="admin-top-ribbon"
      className="bg-gradient-to-r from-[#072217] via-[#0b3c26] to-[#041a11] text-white border-b-2 border-[#d4af37] px-4 py-2 sticky top-0 z-50 shadow-lg text-xs"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 bg-[#d4af37] text-[#072217] px-2 py-0.5 rounded font-bold text-[10px] tracking-wider uppercase">
            <ShieldCheck className="w-3 h-3" />
            <span>Admin Mode</span>
          </span>
          <span className="text-white/90 hidden sm:inline text-xs">
            Panel Pengelola Konten MI Ma'arif Al Ihsan Soborejo
          </span>

          {/* Real-time Status Badge */}
          <div
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
              cloudSyncStatus === 'syncing'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : cloudSyncStatus === 'synced' || cloudSyncStatus === 'connected'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-red-500/20 text-red-300 border-red-500/40'
            }`}
            title={lastSyncedAt ? `Terakhir disinkronkan pukul ${lastSyncedAt}` : 'Sinkronisasi online realtime aktif'}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                cloudSyncStatus === 'syncing'
                  ? 'bg-amber-400 animate-spin'
                  : cloudSyncStatus === 'synced' || cloudSyncStatus === 'connected'
                  ? 'bg-emerald-400 animate-pulse'
                  : 'bg-red-400'
              }`}
            />
            <span>
              {cloudSyncStatus === 'syncing'
                ? 'Menyinkronkan...'
                : cloudSyncStatus === 'synced'
                ? `Online Realtime (${lastSyncedAt || 'Aktif'})`
                : cloudSyncStatus === 'connected'
                ? 'Online Realtime'
                : 'Offline (Tersimpan Lokal)'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="admin-bar-public-view-btn"
            onClick={() => setViewMode('public')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
              viewMode === 'public'
                ? 'bg-[#d4af37] text-[#072217] shadow-sm'
                : 'text-white/80 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Lihat Website Publik</span>
          </button>

          <button
            id="admin-bar-admin-panel-btn"
            onClick={() => setViewMode('admin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
              viewMode === 'admin'
                ? 'bg-[#d4af37] text-[#072217] shadow-sm'
                : 'text-white/80 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Buka Panel Admin (CMS)</span>
          </button>

          <button
            id="admin-bar-export-btn"
            onClick={exportBackupJSON}
            title="Cadangkan seluruh data website (JSON)"
            className="hidden md:flex items-center gap-1 px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-[#f3e5ab] rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Backup</span>
          </button>

          <button
            id="admin-bar-logout-btn"
            onClick={logoutAdmin}
            title="Keluar dari mode admin"
            className="flex items-center gap-1 px-2.5 py-1.5 bg-red-900/50 hover:bg-red-800 text-red-200 hover:text-white rounded-lg transition-colors border border-red-700/50"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
