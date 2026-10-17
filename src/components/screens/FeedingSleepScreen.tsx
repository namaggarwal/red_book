import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FeedingSleepRecord } from '../../types';
import { formatDisplayDate } from '../../utils/dateUtils';
import {
  Utensils,
  Moon,
  Baby,
  Plus,
  Clock,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export const FeedingSleepScreen: React.FC = () => {
  const { profile, records, saveRecord } = useApp();
  const [activeTab, setActiveTab] = useState<'all' | 'feed' | 'sleep' | 'nappy'>('all');

  // Quick log states
  const [logType, setLogType] = useState<'breast_feed' | 'formula' | 'solids' | 'sleep' | 'nappy'>('breast_feed');
  const [feedSide, setFeedSide] = useState<'left' | 'right' | 'both'>('both');
  const [durationMins, setDurationMins] = useState('15');
  const [amountMl, setAmountMl] = useState('120');
  const [foodDesc, setFoodDesc] = useState('');
  const [nappyWet, setNappyWet] = useState(true);
  const [nappyDirty, setNappyDirty] = useState(false);
  const [showLogSheet, setShowLogSheet] = useState(false);

  if (!profile) return null;

  const logs = records
    .filter((r): r is FeedingSleepRecord => r.recordType === 'feeding_sleep')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleQuickSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const newLog: FeedingSleepRecord = {
      id: `fs-${Date.now().toString(36)}`,
      childId: profile.id,
      recordType: 'feeding_sleep',
      recordDate: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      entryType: logType,
      side: ['breast_feed'].includes(logType) ? feedSide : undefined,
      durationMinutes: ['breast_feed', 'sleep'].includes(logType) ? parseInt(durationMins, 10) || 15 : undefined,
      amountMl: logType === 'formula' ? parseInt(amountMl, 10) || 120 : undefined,
      foodDescription: logType === 'solids' ? foodDesc : undefined,
      nappyWet: logType === 'nappy' ? nappyWet : undefined,
      nappyDirty: logType === 'nappy' ? nappyDirty : undefined,
      status: 'active',
      source: 'parent',
      schemaVersion: 1,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    await saveRecord(newLog);
    setShowLogSheet(false);
  };

  // Calculate today's totals
  const todayStr = new Date().toISOString().split('T')[0];
  const todayLogs = logs.filter((l) => l.recordDate === todayStr);
  const todayFeeds = todayLogs.filter((l) => ['breast_feed', 'formula', 'solids'].includes(l.entryType)).length;
  const todayNappies = todayLogs.filter((l) => l.entryType === 'nappy').length;
  const todaySleepMins = todayLogs
    .filter((l) => l.entryType === 'sleep')
    .reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);

  return (
    <div className="space-y-6 pb-20">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-stone-900">
              Feeding, Sleep & Routine
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-md font-bold uppercase tracking-wider bg-orange-100 text-orange-800">
              Daily Companion
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Gentle day-to-day routine tracking for {profile.preferredName}
          </p>
        </div>

        <button
          onClick={() => setShowLogSheet(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-berry-700 hover:bg-berry-800 text-white font-semibold text-xs sm:text-sm shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Quick Log Routine</span>
        </button>
      </div>

      {/* Today's Summary Card */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-white border border-stone-200/80 shadow-xs text-center">
          <Utensils className="w-5 h-5 text-orange-600 mx-auto mb-1" />
          <span className="text-xs text-stone-500 block">Today's Feeds</span>
          <span className="text-2xl font-extrabold text-stone-900">{todayFeeds}</span>
        </div>
        <div className="p-4 rounded-xl bg-white border border-stone-200/80 shadow-xs text-center">
          <Moon className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
          <span className="text-xs text-stone-500 block">Sleep Logged</span>
          <span className="text-2xl font-extrabold text-stone-900">
            {Math.floor(todaySleepMins / 60)}h {todaySleepMins % 60}m
          </span>
        </div>
        <div className="p-4 rounded-xl bg-white border border-stone-200/80 shadow-xs text-center">
          <Baby className="w-5 h-5 text-teal-600 mx-auto mb-1" />
          <span className="text-xs text-stone-500 block">Nappies</span>
          <span className="text-2xl font-extrabold text-stone-900">{todayNappies}</span>
        </div>
      </div>

      {/* Feed & Routine Stream */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
          Recent Activity Logs
        </h3>

        <div className="space-y-2">
          {logs.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl bg-white border border-stone-200 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-700">
                  {item.entryType === 'sleep' ? (
                    <Moon className="w-4 h-4 text-indigo-600" />
                  ) : item.entryType === 'nappy' ? (
                    <Baby className="w-4 h-4 text-teal-600" />
                  ) : (
                    <Utensils className="w-4 h-4 text-orange-600" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 capitalize">
                    {item.entryType.replace('_', ' ')}
                  </h4>
                  <p className="text-stone-500">
                    {item.entryType === 'breast_feed' && `Breastfeed (${item.side || 'both'}) • ${item.durationMinutes} mins`}
                    {item.entryType === 'formula' && `Formula bottle • ${item.amountMl} ml`}
                    {item.entryType === 'solids' && (item.foodDescription || 'Solid food')}
                    {item.entryType === 'sleep' && `Nap / Sleep • ${item.durationMinutes} mins`}
                    {item.entryType === 'nappy' && (item.nappyDirty ? 'Dirty & wet nappy' : 'Wet nappy')}
                  </p>
                </div>
              </div>
              <div className="text-right text-stone-400">
                <span className="font-semibold text-stone-700 block">{item.time}</span>
                <span className="text-[11px]">{formatDisplayDate(item.recordDate)}</span>
              </div>
            </div>
          ))}

          {logs.length === 0 && (
            <div className="p-8 text-center rounded-2xl bg-white border border-stone-200 text-stone-400 text-xs">
              No daily feeds or sleeps logged yet.
            </div>
          )}
        </div>
      </div>

      {/* Modal for Routine Log */}
      {showLogSheet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-stone-200">
            <h3 className="text-base font-bold text-stone-900 mb-3">Log Activity</h3>
            <form onSubmit={handleQuickSave} className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setLogType('breast_feed')}
                  className={`py-2 text-xs font-semibold rounded-xl border ${
                    logType === 'breast_feed' ? 'bg-berry-100 border-berry-400 text-berry-900' : 'border-stone-200'
                  }`}
                >
                  Breast
                </button>
                <button
                  type="button"
                  onClick={() => setLogType('formula')}
                  className={`py-2 text-xs font-semibold rounded-xl border ${
                    logType === 'formula' ? 'bg-berry-100 border-berry-400 text-berry-900' : 'border-stone-200'
                  }`}
                >
                  Bottle
                </button>
                <button
                  type="button"
                  onClick={() => setLogType('solids')}
                  className={`py-2 text-xs font-semibold rounded-xl border ${
                    logType === 'solids' ? 'bg-berry-100 border-berry-400 text-berry-900' : 'border-stone-200'
                  }`}
                >
                  Solids
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setLogType('sleep')}
                  className={`py-2 text-xs font-semibold rounded-xl border ${
                    logType === 'sleep' ? 'bg-indigo-100 border-indigo-400 text-indigo-900' : 'border-stone-200'
                  }`}
                >
                  Sleep / Nap
                </button>
                <button
                  type="button"
                  onClick={() => setLogType('nappy')}
                  className={`py-2 text-xs font-semibold rounded-xl border ${
                    logType === 'nappy' ? 'bg-teal-100 border-teal-400 text-teal-900' : 'border-stone-200'
                  }`}
                >
                  Nappy Change
                </button>
              </div>

              {logType === 'breast_feed' && (
                <div className="space-y-2 pt-2">
                  <div className="grid grid-cols-3 gap-2">
                    {['left', 'right', 'both'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setFeedSide(s as any)}
                        className={`py-1.5 text-xs font-medium rounded-lg border capitalize ${
                          feedSide === s ? 'bg-stone-800 text-white' : 'border-stone-200'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <div>
                    <label className="block text-[11px] text-stone-500 mb-1">Duration (minutes)</label>
                    <input
                      type="number"
                      value={durationMins}
                      onChange={(e) => setDurationMins(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs"
                    />
                  </div>
                </div>
              )}

              {logType === 'formula' && (
                <div className="pt-2">
                  <label className="block text-[11px] text-stone-500 mb-1">Quantity (ml)</label>
                  <input
                    type="number"
                    value={amountMl}
                    onChange={(e) => setAmountMl(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs"
                  />
                </div>
              )}

              {logType === 'solids' && (
                <div className="pt-2">
                  <label className="block text-[11px] text-stone-500 mb-1">Food / Meal Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Avocado puree, banana fingers"
                    value={foodDesc}
                    onChange={(e) => setFoodDesc(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs"
                  />
                </div>
              )}

              {logType === 'sleep' && (
                <div className="pt-2">
                  <label className="block text-[11px] text-stone-500 mb-1">Nap duration (minutes)</label>
                  <input
                    type="number"
                    value={durationMins}
                    onChange={(e) => setDurationMins(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs"
                  />
                </div>
              )}

              {logType === 'nappy' && (
                <div className="pt-2 space-y-2">
                  <label className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={nappyWet}
                      onChange={(e) => setNappyWet(e.target.checked)}
                      className="rounded text-berry-700"
                    />
                    <span>Wet nappy</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={nappyDirty}
                      onChange={(e) => setNappyDirty(e.target.checked)}
                      className="rounded text-berry-700"
                    />
                    <span>Dirty / soiled nappy</span>
                  </label>
                </div>
              )}

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowLogSheet(false)}
                  className="px-3 py-1.5 rounded-xl text-stone-600 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-berry-700 text-white font-semibold text-xs"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
