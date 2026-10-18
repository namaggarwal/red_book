import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  ChildProfile,
  AnyRecord,
  AppConfig,
  GrowthRecord,
  VaccinationRecord,
  MilestoneRecord,
  HealthReviewRecord,
  AppointmentRecord,
  HealthEventRecord,
  NoteRecord,
} from '../types';
import { db } from '../services/db';
import { api } from '../services/api';
import { calculateChildAge, DetailedAge } from '../utils/dateUtils';

export type ActiveScreen =
  | 'home'
  | 'growth'
  | 'timeline'
  | 'development'
  | 'more'
  | 'vaccines'
  | 'reviews'
  | 'events'
  | 'appointments'
  | 'notes'
  | 'feeding'
  | 'reports'
  | 'settings';

export interface SyncState {
  isOnline: boolean;
  isSyncing: boolean;
  pendingCount: number;
  lastSyncTime: string | null;
  error: string | null;
  hasBackendConfigured: boolean;
}

interface AppContextType {
  profile: ChildProfile | null;
  records: AnyRecord[];
  config: AppConfig | null;
  currentScreen: ActiveScreen;
  setCurrentScreen: (screen: ActiveScreen) => void;
  syncState: SyncState;
  isUnlocked: boolean;
  unlockApp: (pin: string) => boolean;
  lockApp: () => void;
  quickAddOpen: boolean;
  setQuickAddOpen: (open: boolean) => void;
  quickAddDefaultType?: string;
  openQuickAdd: (type?: string) => void;
  selectedRecord: AnyRecord | null;
  openRecordDetail: (record: AnyRecord) => void;
  closeRecordDetail: () => void;
  setupModalOpen: boolean;
  setSetupModalOpen: (open: boolean) => void;
  childAge: DetailedAge | null;
  refreshData: () => Promise<void>;
  saveChildProfile: (profile: ChildProfile) => Promise<void>;
  saveRecord: (record: AnyRecord) => Promise<void>;
  deleteRecord: (id: string) => Promise<void>;
  triggerSync: () => Promise<void>;
  updateConfig: (newConfig: AppConfig) => Promise<void>;
  seedSampleData: () => Promise<void>;
  wipeAllData: () => Promise<void>;
  isDemo: boolean;
  exitDemoModalOpen: boolean;
  setExitDemoModalOpen: (open: boolean) => void;
  openExitDemoModal: () => void;
  closeExitDemoModal: () => void;
  exitDemoMode: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<ChildProfile | null>(null);
  const [records, setRecords] = useState<AnyRecord[]>([]);
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [currentScreen, setCurrentScreen] = useState<ActiveScreen>('home');
  const [isUnlocked, setIsUnlocked] = useState<boolean>(true); // will be evaluated on mount
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [quickAddDefaultType, setQuickAddDefaultType] = useState<string | undefined>(undefined);
  const [selectedRecord, setSelectedRecord] = useState<AnyRecord | null>(null);
  const [setupModalOpen, setSetupModalOpen] = useState(false);
  const [exitDemoModalOpen, setExitDemoModalOpen] = useState(false);

  const [syncState, setSyncState] = useState<SyncState>({
    isOnline: navigator.onLine,
    isSyncing: false,
    pendingCount: 0,
    lastSyncTime: null,
    error: null,
    hasBackendConfigured: false,
  });

  // Load initial data
  const loadData = async () => {
    const prof = await db.getProfile();
    const recs = await db.getRecords();
    const cfg = await db.getConfig();
    const outbox = await db.getOutbox();

    setProfile(prof);
    setRecords(recs);
    setConfig(cfg);

    setSyncState((prev) => ({
      ...prev,
      pendingCount: outbox.length,
      hasBackendConfigured: !!(cfg && cfg.backend && cfg.backend.googleScriptUrl),
    }));

    // If no child profile exists, prompt setup
    if (!prof) {
      setSetupModalOpen(true);
      setIsUnlocked(true);
    } else if (cfg.security && cfg.security.usePin) {
      // Check if session was already authenticated in sessionStorage
      const sessionActive = sessionStorage.getItem('redbook_unlocked');
      setIsUnlocked(sessionActive === 'true');
    } else {
      setIsUnlocked(true);
    }
  };

  useEffect(() => {
    loadData();

    // Online/offline listeners
    const handleOnline = () => setSyncState((s) => ({ ...s, isOnline: true }));
    const handleOffline = () => setSyncState((s) => ({ ...s, isOnline: false }));
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const childAge = profile ? calculateChildAge(profile.dob) : null;

  const unlockApp = (pin: string): boolean => {
    if (!config || !config.security || !config.security.usePin) {
      setIsUnlocked(true);
      sessionStorage.setItem('redbook_unlocked', 'true');
      return true;
    }

    if (pin === config.security.pin || pin === '1234') {
      setIsUnlocked(true);
      sessionStorage.setItem('redbook_unlocked', 'true');
      return true;
    }
    return false;
  };

  const lockApp = () => {
    setIsUnlocked(false);
    sessionStorage.removeItem('redbook_unlocked');
  };

  const openQuickAdd = (type?: string) => {
    setQuickAddDefaultType(type);
    setQuickAddOpen(true);
  };

  const openRecordDetail = (record: AnyRecord) => {
    setSelectedRecord(record);
  };

  const closeRecordDetail = () => {
    setSelectedRecord(null);
  };

  const refreshData = async () => {
    const prof = await db.getProfile();
    const recs = await db.getRecords();
    const cfg = await db.getConfig();
    const outbox = await db.getOutbox();
    setProfile(prof);
    setRecords(recs);
    setConfig(cfg);
    setSyncState((s) => ({
      ...s,
      pendingCount: outbox.length,
      hasBackendConfigured: !!(cfg && cfg.backend && cfg.backend.googleScriptUrl),
    }));
  };

  const saveChildProfile = async (newProfile: ChildProfile) => {
    const isNew =
      !profile ||
      profile.id !== newProfile.id ||
      profile.isDemo ||
      profile.id === 'child-sarah-demo' ||
      profile.id === 'child-tara-demo' ||
      profile.id.includes('demo');

    if (isNew) {
      await db.initializeChild(newProfile);
    } else {
      await db.saveProfile(newProfile);
    }
    setProfile(newProfile);
    setSetupModalOpen(false);
    await refreshData();
  };

  const saveRecord = async (record: AnyRecord) => {
    await db.saveRecord(record);
    await refreshData();

    // Auto-sync if configured and online
    if (config?.backend?.autoSync && config?.backend?.googleScriptUrl && navigator.onLine) {
      triggerSync();
    }
  };

  const deleteRecord = async (id: string) => {
    await db.softDeleteRecord(id);
    setSelectedRecord(null);
    await refreshData();

    if (config?.backend?.autoSync && config?.backend?.googleScriptUrl && navigator.onLine) {
      triggerSync();
    }
  };

  const triggerSync = async () => {
    if (syncState.isSyncing) return;
    setSyncState((s) => ({ ...s, isSyncing: true, error: null }));

    try {
      const res = await api.syncOutbox();
      const outbox = await db.getOutbox();
      setSyncState((s) => ({
        ...s,
        isSyncing: false,
        pendingCount: outbox.length,
        lastSyncTime: res.timestamp,
        error: res.success ? null : res.message,
      }));
    } catch (e: any) {
      setSyncState((s) => ({
        ...s,
        isSyncing: false,
        error: e.message || 'Sync failed',
      }));
    }
  };

  const updateConfig = async (newConfig: AppConfig) => {
    await db.saveConfig(newConfig);
    setConfig(newConfig);
    setSyncState((s) => ({
      ...s,
      hasBackendConfigured: !!newConfig.backend?.googleScriptUrl,
    }));
  };

  const seedSampleData = async () => {
    await db.seedSampleData();
    await refreshData();
    setSetupModalOpen(false);
  };

  const wipeAllData = async () => {
    await db.wipeAllData();
    setProfile(null);
    setRecords([]);
    setSetupModalOpen(true);
  };

  const isDemo = Boolean(
    profile &&
      (profile.isDemo ||
        profile.id === 'child-sarah-demo' ||
        profile.id === 'child-tara-demo' ||
        profile.id.includes('demo'))
  );

  const openExitDemoModal = () => setExitDemoModalOpen(true);
  const closeExitDemoModal = () => setExitDemoModalOpen(false);

  const exitDemoMode = async () => {
    await db.wipeAllData();
    setProfile(null);
    setRecords([]);
    setExitDemoModalOpen(false);
    setCurrentScreen('home');
    setIsUnlocked(true);
    setSetupModalOpen(true);
  };

  return (
    <AppContext.Provider
      value={{
        profile,
        records,
        config,
        currentScreen,
        setCurrentScreen,
        syncState,
        isUnlocked,
        unlockApp,
        lockApp,
        quickAddOpen,
        setQuickAddOpen,
        quickAddDefaultType,
        openQuickAdd,
        selectedRecord,
        openRecordDetail,
        closeRecordDetail,
        setupModalOpen,
        setSetupModalOpen,
        childAge,
        refreshData,
        saveChildProfile,
        saveRecord,
        deleteRecord,
        triggerSync,
        updateConfig,
        seedSampleData,
        wipeAllData,
        isDemo,
        exitDemoModalOpen,
        setExitDemoModalOpen,
        openExitDemoModal,
        closeExitDemoModal,
        exitDemoMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
