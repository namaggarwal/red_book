import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { db } from '../../services/db';
import {
  Settings,
  Cloud,
  Lock,
  Download,
  Upload,
  Trash2,
  Check,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  FileSpreadsheet,
  User,
  KeyRound,
  RefreshCw,
  Baby,
} from 'lucide-react';

export const SettingsScreen: React.FC = () => {
  const {
    profile,
    config,
    updateConfig,
    syncState,
    triggerSync,
    setSetupModalOpen,
    wipeAllData,
    refreshData,
  } = useApp();

  // Backend config fields
  const [scriptUrl, setScriptUrl] = useState(config?.backend?.googleScriptUrl || '');
  const [scriptPassword, setScriptPassword] = useState(config?.backend?.googleScriptPassword || '');
  const [autoSync, setAutoSync] = useState(config?.backend?.autoSync ?? true);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  // Security
  const [pin, setPin] = useState(config?.security?.pin || '1234');
  const [usePin, setUsePin] = useState(config?.security?.usePin ?? true);
  const [autoLockMinutes, setAutoLockMinutes] = useState(config?.security?.autoLockMinutes || 15);

  // Units
  const [weightUnit, setWeightUnit] = useState(config?.units?.weight || 'kg');
  const [lengthUnit, setLengthUnit] = useState(config?.units?.length || 'cm');

  // Restore & Wipe
  const [restoreStatus, setRestoreStatus] = useState<string | null>(null);
  const [confirmWipe, setConfirmWipe] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;

    const newConfig = {
      ...config,
      units: {
        weight: weightUnit as any,
        length: lengthUnit as any,
      },
      security: {
        pin,
        usePin,
        autoLockMinutes,
      },
      backend: {
        googleScriptUrl: scriptUrl.trim(),
        googleScriptPassword: scriptPassword.trim(),
        autoSync,
      },
    };

    await updateConfig(newConfig);
    setTestResult({ success: true, message: 'Settings saved successfully.' });
  };

  const handleTestBackend = async () => {
    if (!scriptUrl) {
      setTestResult({ success: false, message: 'Please enter a Google Apps Script Web App URL.' });
      return;
    }
    setIsTesting(true);
    setTestResult(null);

    const res = await api.testConnection(scriptUrl, scriptPassword);
    setIsTesting(false);
    setTestResult(res);

    if (res.success && config) {
      await updateConfig({
        ...config,
        backend: {
          ...config.backend,
          googleScriptUrl: scriptUrl.trim(),
          googleScriptPassword: scriptPassword.trim(),
        },
      });
      await triggerSync();
    }
  };

  const handleInitializeSheets = async () => {
    if (!scriptUrl) {
      setTestResult({ success: false, message: 'Please enter a Google Apps Script Web App URL.' });
      return;
    }
    setIsTesting(true);
    const res = await api.initializeRemoteSheet(scriptUrl, scriptPassword);
    setIsTesting(false);
    setTestResult(res);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      if (content) {
        const res = await db.restoreBackup(content);
        setRestoreStatus(res.message);
        if (res.success) {
          await refreshData();
        }
      }
    };
    reader.readAsText(file);
  };

  const handleDownloadBackup = async () => {
    const json = await db.exportCompleteBackup();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `redbook-full-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-20 max-w-3xl mx-auto">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">
            Settings & Data Management
          </h1>
          <span className="text-xs px-2 py-0.5 rounded-md font-bold uppercase tracking-wider bg-stone-100 text-stone-700">
            Privacy & Sync
          </span>
        </div>
        <p className="text-xs text-stone-500 mt-1">
          Configure security, cloud persistence with Google Sheets, and data backups
        </p>
      </div>

      {/* Child Profile Quick Edit Button */}
      {profile && (
        <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-berry-100 text-berry-800 flex items-center justify-center font-bold">
              <Baby className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">{profile.preferredName}'s Profile</h3>
              <p className="text-xs text-stone-500">DOB: {profile.dob} • Chart: {profile.sex}</p>
            </div>
          </div>
          <button
            onClick={() => setSetupModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold"
          >
            Edit Profile
          </button>
        </div>
      )}

      {/* Google Sheets & Apps Script Backend Integration */}
      <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-stone-900">
                Google Sheets & Apps Script Cloud Sync
              </h2>
              <p className="text-xs text-stone-500">
                Store records privately in your own personal Google Sheet
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowGuideModal(true)}
            className="text-xs text-berry-700 hover:text-berry-900 font-semibold flex items-center gap-1"
          >
            <span>2-Min Setup Guide</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Sync Status Info */}
        <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="font-semibold text-stone-800">Connection Status: </span>
            <span
              className={
                syncState.hasBackendConfigured ? 'text-emerald-700 font-bold' : 'text-stone-500'
              }
            >
              {syncState.hasBackendConfigured ? 'Configured & Active' : 'Offline / Local Only'}
            </span>
            {syncState.pendingCount > 0 && (
              <span className="text-amber-800 font-semibold ml-2">
                ({syncState.pendingCount} local changes pending)
              </span>
            )}
          </div>
          <button
            onClick={triggerSync}
            disabled={syncState.isSyncing}
            className="self-start sm:self-auto px-3 py-1 rounded-lg bg-berry-700 hover:bg-berry-800 text-white font-semibold text-xs flex items-center gap-1.5 shadow-2xs"
          >
            <RefreshCw className={`w-3 h-3 ${syncState.isSyncing ? 'animate-spin' : ''}`} />
            <span>Sync Now</span>
          </button>
        </div>

        {testResult && (
          <div
            className={`p-3 rounded-xl text-xs font-medium border flex items-center gap-2 ${
              testResult.success
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-rose-50 text-rose-800 border-rose-300'
            }`}
          >
            {testResult.success ? (
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{testResult.message}</span>
          </div>
        )}

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Google Apps Script Web App URL
            </label>
            <input
              type="url"
              placeholder="https://script.google.com/macros/s/.../exec"
              value={scriptUrl}
              onChange={(e) => setScriptUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Backend Master Password / Token
            </label>
            <input
              type="password"
              placeholder="e.g. 1234"
              value={scriptPassword}
              onChange={(e) => setScriptPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-mono"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="autoSync"
              checked={autoSync}
              onChange={(e) => setAutoSync(e.target.checked)}
              className="rounded text-berry-700"
            />
            <label htmlFor="autoSync" className="text-xs text-stone-700 font-medium">
              Automatically sync changes when online
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <button
              type="button"
              disabled={isTesting}
              onClick={handleTestBackend}
              className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs"
            >
              {isTesting ? 'Testing...' : 'Test Connection'}
            </button>
            <button
              type="button"
              disabled={isTesting}
              onClick={handleInitializeSheets}
              className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs"
            >
              Initialize Spreadsheet Tabs
            </button>
          </div>
        </div>
      </div>

      {/* Security & Passcode Configuration */}
      <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 border-b border-stone-100 pb-3">
          <div className="w-9 h-9 rounded-xl bg-berry-50 text-berry-700 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-stone-900">Security & Privacy Lock</h2>
            <p className="text-xs text-stone-500">Protect access on this device</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-700">Require Passcode to unlock app</span>
            <input
              type="checkbox"
              checked={usePin}
              onChange={(e) => setUsePin(e.target.checked)}
              className="rounded text-berry-700 w-4 h-4"
            />
          </div>

          {usePin && (
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Change 4-Digit PIN
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-mono tracking-widest"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Auto-Lock Timeout
                </label>
                <select
                  value={autoLockMinutes}
                  onChange={(e) => setAutoLockMinutes(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-medium"
                >
                  <option value={5}>After 5 minutes</option>
                  <option value={15}>After 15 minutes</option>
                  <option value={30}>After 30 minutes</option>
                  <option value={0}>Only on app close</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Measurement Units */}
      <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-2">
          Units of Measurement
        </h2>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-stone-700 mb-1">Weight Unit</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setWeightUnit('kg')}
                className={`flex-1 py-1.5 rounded-lg border font-semibold ${
                  weightUnit === 'kg' ? 'bg-berry-100 border-berry-400 text-berry-900' : 'border-stone-200'
                }`}
              >
                Metric (kg)
              </button>
              <button
                type="button"
                onClick={() => setWeightUnit('lbs')}
                className={`flex-1 py-1.5 rounded-lg border font-semibold ${
                  weightUnit === 'lbs' ? 'bg-berry-100 border-berry-400 text-berry-900' : 'border-stone-200'
                }`}
              >
                Imperial (lbs)
              </button>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Length Unit</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setLengthUnit('cm')}
                className={`flex-1 py-1.5 rounded-lg border font-semibold ${
                  lengthUnit === 'cm' ? 'bg-berry-100 border-berry-400 text-berry-900' : 'border-stone-200'
                }`}
              >
                Centimetres (cm)
              </button>
              <button
                type="button"
                onClick={() => setLengthUnit('in')}
                className={`flex-1 py-1.5 rounded-lg border font-semibold ${
                  lengthUnit === 'in' ? 'bg-berry-100 border-berry-400 text-berry-900' : 'border-stone-200'
                }`}
              >
                Inches (in)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Settings Form Action */}
      <button
        onClick={handleSavePreferences}
        className="w-full py-2.5 rounded-xl bg-berry-700 hover:bg-berry-800 text-white font-semibold text-sm shadow-sm"
      >
        Save All Settings
      </button>

      {/* Data Backup & Restore */}
      <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-2">
          Backup & Recovery
        </h2>

        {restoreStatus && (
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-800">
            {restoreStatus}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={handleDownloadBackup}
            className="p-3 rounded-xl border border-stone-200 text-left hover:bg-stone-50 transition-colors flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-bold text-stone-900">Download Full JSON Backup</p>
              <p className="text-[11px] text-stone-500">Save a complete snapshot to your device</p>
            </div>
            <Download className="w-4 h-4 text-stone-400" />
          </button>

          <label className="p-3 rounded-xl border border-stone-200 text-left hover:bg-stone-50 transition-colors flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-xs font-bold text-stone-900">Restore from Backup File</p>
              <p className="text-[11px] text-stone-500">Upload previously exported JSON</p>
            </div>
            <Upload className="w-4 h-4 text-stone-400" />
            <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {/* Danger Zone: Wipe */}
        <div className="pt-3 border-t border-stone-100">
          {!confirmWipe ? (
            <button
              type="button"
              onClick={() => setConfirmWipe(true)}
              className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Wipe all records from this device...</span>
            </button>
          ) : (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between gap-2">
              <span className="text-xs text-rose-800 font-semibold">
                This will delete all local records permanently.
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setConfirmWipe(false)}
                  className="px-2.5 py-1 text-xs text-stone-600 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    wipeAllData();
                    setConfirmWipe(false);
                  }}
                  className="px-2.5 py-1 text-xs font-bold bg-rose-600 text-white rounded"
                >
                  Yes, Wipe Data
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Guide Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 max-h-[85vh] overflow-y-auto space-y-4">
            <h3 className="text-lg font-bold text-stone-900">
              How to Connect Your Private Google Sheet
            </h3>
            <ol className="list-decimal pl-5 text-xs text-stone-700 space-y-2">
              <li>
                Open <a href="https://sheets.new" target="_blank" rel="noopener noreferrer" className="text-berry-700 font-bold underline">sheets.new</a> in Google.
              </li>
              <li>Click <strong>Extensions &gt; Apps Script</strong>.</li>
              <li>
                Copy and paste the code from <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-800 font-mono">google-apps-script/Code.gs</code>.
              </li>
              <li>Click <strong>Deploy &gt; New deployment</strong>.</li>
              <li>Select type <strong>Web app</strong>. Execute as: <em>Me</em>, Who has access: <em>Anyone</em>.</li>
              <li>Click <strong>Deploy</strong> and copy the <strong>Web App URL</strong>.</li>
              <li>Paste the URL in the box above and click <strong>Initialize Spreadsheet Tabs</strong>!</li>
            </ol>
            <div className="pt-2 text-right">
              <button
                onClick={() => setShowGuideModal(false)}
                className="px-4 py-2 rounded-xl bg-berry-700 text-white font-semibold text-xs"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Notice */}
      <div className="text-center text-xs text-stone-500 space-y-1">
        <p className="font-semibold text-stone-700">Privacy & Data Ownership</p>
        <p>All data belongs exclusively to you and is stored locally on this device and inside your private Google account.</p>
      </div>
    </div>
  );
};
