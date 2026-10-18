import React from 'react';
import { useApp } from '../../context/AppContext';
import { BookOpen, RefreshCw, Lock, Plus, Cloud, CloudOff, AlertCircle, LogOut } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    profile,
    childAge,
    syncState,
    triggerSync,
    lockApp,
    openQuickAdd,
    setCurrentScreen,
    isDemo,
    openExitDemoModal,
  } = useApp();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-stone-200/80 px-4 py-2.5 transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Brand & Child info */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setCurrentScreen('home')}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-berry-700 to-berry-900 flex items-center justify-center text-white shadow-sm ring-2 ring-berry-100 group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5 text-berry-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-stone-900 tracking-tight text-base sm:text-lg">
                Red Book
              </span>
              <span className="text-[11px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded bg-berry-50 text-berry-800 border border-berry-200/60">
                UK
              </span>
              {isDemo && (
                <span className="text-[10px] font-extrabold tracking-wider uppercase px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  Demo
                </span>
              )}
            </div>
            {profile ? (
              <p className="text-xs text-stone-500 flex items-center gap-1.5">
                <span className="font-medium text-stone-800">{profile.preferredName}</span>
                <span>•</span>
                <span>{childAge?.formattedPrimary || 'Newborn'}</span>
              </p>
            ) : (
              <p className="text-xs text-stone-400">Child Health Record</p>
            )}
          </div>
        </div>

        {/* Action Controls & Sync Status */}
        <div className="flex items-center gap-2">
          {/* Sync Pill */}
          <button
            onClick={triggerSync}
            disabled={syncState.isSyncing}
            title={
              syncState.hasBackendConfigured
                ? `Google Sheets Sync: ${syncState.pendingCount} pending changes`
                : 'Local Mode (Click Settings to connect Google Sheets)'
            }
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
              syncState.isSyncing
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : syncState.pendingCount > 0
                ? 'bg-amber-50 text-amber-800 border-amber-300'
                : syncState.hasBackendConfigured
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
            }`}
          >
            {syncState.isSyncing ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />
            ) : !syncState.isOnline ? (
              <CloudOff className="w-3.5 h-3.5 text-stone-400" />
            ) : syncState.hasBackendConfigured ? (
              <Cloud className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Cloud className="w-3.5 h-3.5 text-stone-400" />
            )}
            <span>
              {syncState.isSyncing
                ? 'Syncing...'
                : syncState.pendingCount > 0
                ? `${syncState.pendingCount} to sync`
                : syncState.hasBackendConfigured
                ? 'Synced'
                : 'Local'}
            </span>
          </button>

          {/* Quick Add Button */}
          <button
            onClick={() => openQuickAdd()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-berry-700 hover:bg-berry-800 active:bg-berry-900 text-white text-xs sm:text-sm font-medium shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Record</span>
            <span className="sm:hidden">Add</span>
          </button>

          {/* Exit Demo Button */}
          {isDemo && (
            <button
              onClick={openExitDemoModal}
              title="Exit Demo Mode"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 text-amber-800" />
              <span className="hidden sm:inline">Exit Demo</span>
              <span className="sm:hidden">Exit</span>
            </button>
          )}

          {/* Lock App Button */}
          <button
            onClick={lockApp}
            title="Lock App"
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-700 hover:bg-stone-100 active:bg-stone-200 transition-colors"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
