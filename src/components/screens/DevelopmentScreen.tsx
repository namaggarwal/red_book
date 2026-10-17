import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MilestoneRecord, MilestoneCategory, MilestoneStatus } from '../../types';
import { formatDisplayDate, calculateChildAge } from '../../utils/dateUtils';
import {
  Sparkles,
  Plus,
  CheckCircle2,
  Clock,
  Heart,
  MessageCircle,
  Footprints,
  Hand,
  Utensils,
  Camera,
  Info,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const DevelopmentScreen: React.FC = () => {
  const { profile, records, saveRecord, openQuickAdd, openRecordDetail } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'achieved' | 'pending'>('all');
  const [activeEditingMilestone, setActiveEditingMilestone] = useState<MilestoneRecord | null>(null);

  // Edit fields
  const [achieveDate, setAchieveDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<MilestoneStatus>('achieved');
  const [parentNotes, setParentNotes] = useState('');

  if (!profile) return null;

  const milestones = records
    .filter((r): r is MilestoneRecord => r.recordType === 'milestone')
    .sort((a, b) => (a.ageRecommendedMonths || 0) - (b.ageRecommendedMonths || 0));

  const filtered = milestones.filter((m) => {
    if (selectedCategory !== 'all' && m.category !== selectedCategory) return false;
    if (statusFilter === 'achieved' && m.status !== 'achieved') return false;
    if (statusFilter === 'pending' && m.status === 'achieved') return false;
    return true;
  });

  const categories = [
    { id: 'all', label: 'All Milestones', icon: Sparkles },
    { id: 'social_emotional', label: 'Social & Emotional', icon: Heart },
    { id: 'communication', label: 'Communication', icon: MessageCircle },
    { id: 'movement_physical', label: 'Movement & Physical', icon: Footprints },
    { id: 'hand_finger', label: 'Hand & Finger', icon: Hand },
    { id: 'feeding_self_care', label: 'Feeding & Independence', icon: Utensils },
    { id: 'firsts_memories', label: 'Memorable Firsts', icon: Sparkles },
  ];

  const handleSaveMilestoneUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEditingMilestone) return;

    let ageAchievedText = activeEditingMilestone.ageAchievedText;
    if (status === 'achieved' && achieveDate) {
      const ageAtMoment = calculateChildAge(profile.dob, achieveDate);
      ageAchievedText = ageAtMoment.formattedPrimary;
    }

    const updated: MilestoneRecord = {
      ...activeEditingMilestone,
      status,
      recordDate: status === 'achieved' ? achieveDate : undefined,
      ageAchievedText,
      parentNotes: parentNotes.trim() || undefined,
      updatedAt: new Date().toISOString(),
    };

    await saveRecord(updated);
    setActiveEditingMilestone(null);

    if (status === 'achieved') {
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#8e203e', '#f59e0b', '#10b981', '#3b82f6'],
        });
      } catch {}
    }
  };

  const achievedCount = milestones.filter((m) => m.status === 'achieved').length;

  return (
    <div className="space-y-6 pb-20">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-stone-900">
              Developmental Milestones & Firsts
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-md font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
              NHS Red Book Guide
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Cherish observations, memorable firsts, and growth milestones for {profile.preferredName}
          </p>
        </div>

        <button
          onClick={() => openQuickAdd('milestone')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-berry-700 hover:bg-berry-800 text-white font-semibold text-xs sm:text-sm shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom First</span>
        </button>
      </div>

      {/* Progress Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50/70 via-orange-50/50 to-ivory-50 border border-amber-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-stone-900">
              {achievedCount} Milestones Celebrated!
            </h2>
            <p className="text-xs text-stone-600 mt-0.5">
              Every child develops at their own individual pace.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-white/80 px-3 py-1.5 rounded-xl border border-amber-200 text-xs font-semibold">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-2.5 py-1 rounded-lg ${
              statusFilter === 'all' ? 'bg-amber-100 text-amber-900' : 'text-stone-500'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter('achieved')}
            className={`px-2.5 py-1 rounded-lg ${
              statusFilter === 'achieved' ? 'bg-amber-100 text-amber-900' : 'text-stone-500'
            }`}
          >
            Achieved ({achievedCount})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-2.5 py-1 rounded-lg ${
              statusFilter === 'pending' ? 'bg-amber-100 text-amber-900' : 'text-stone-500'
            }`}
          >
            Looking Ahead
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border ${
                isSelected
                  ? 'bg-stone-900 text-white border-stone-900 shadow-2xs'
                  : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Milestone Gallery Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((m) => {
          const isAchieved = m.status === 'achieved';
          const isEmerging = m.status === 'emerging';

          return (
            <div
              key={m.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                isAchieved
                  ? 'bg-white border-stone-200/80 shadow-xs'
                  : 'bg-ivory-50/70 border-stone-200/60'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    {m.category.replace('_', ' ')}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      isAchieved
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : isEmerging
                        ? 'bg-blue-50 text-blue-800 border border-blue-200'
                        : 'bg-stone-100 text-stone-500'
                    }`}
                  >
                    {m.status.replace('_', ' ')}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-stone-900 mb-1">
                  {m.title}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed mb-3">
                  {m.description}
                </p>

                {m.parentNotes && (
                  <div className="mb-3 p-2 rounded-lg bg-stone-50 border border-stone-200/60 text-xs text-stone-700 italic">
                    "{m.parentNotes}"
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <div>
                  {isAchieved ? (
                    <div className="text-[11px] text-stone-500">
                      <span className="font-semibold text-emerald-700 block">
                        ✓ {m.ageAchievedText || 'Achieved'}
                      </span>
                      {m.recordDate && (
                        <span>{formatDisplayDate(m.recordDate)}</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-[11px] text-stone-400">
                      Typical: ~{m.ageRecommendedMonths || 3} months
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setActiveEditingMilestone(m);
                      setStatus(m.status);
                      setAchieveDate(m.recordDate || new Date().toISOString().split('T')[0]);
                      setParentNotes(m.parentNotes || '');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs"
                  >
                    {isAchieved ? 'Edit Note' : 'Record'}
                  </button>
                  <button
                    onClick={() => openRecordDetail(m)}
                    className="text-stone-400 hover:text-stone-700 p-1"
                  >
                    •••
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Editing / Recording Modal */}
      {activeEditingMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-stone-200">
            <h3 className="text-base font-bold text-stone-900 mb-1">
              Record Milestone
            </h3>
            <p className="text-xs text-stone-600 mb-4 font-medium">
              {activeEditingMilestone.title}
            </p>

            <form onSubmit={handleSaveMilestoneUpdate} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Status
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setStatus('achieved')}
                    className={`py-2 text-xs font-semibold rounded-xl border ${
                      status === 'achieved'
                        ? 'bg-amber-100 border-amber-400 text-amber-900'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    Achieved ⭐
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('emerging')}
                    className={`py-2 text-xs font-semibold rounded-xl border ${
                      status === 'emerging'
                        ? 'bg-blue-100 border-blue-400 text-blue-900'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    Emerging 🌱
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('not_observed')}
                    className={`py-2 text-xs font-semibold rounded-xl border ${
                      status === 'not_observed'
                        ? 'bg-stone-200 border-stone-400 text-stone-900'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    Not Yet
                  </button>
                </div>
              </div>

              {status === 'achieved' && (
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Date Observed / Achieved
                  </label>
                  <input
                    type="date"
                    required
                    value={achieveDate}
                    onChange={(e) => setAchieveDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Parent Notes & Memories
                </label>
                <textarea
                  rows={3}
                  placeholder="Where were you? What was their reaction? Any funny story..."
                  value={parentNotes}
                  onChange={(e) => setParentNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveEditingMilestone(null)}
                  className="px-3.5 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-berry-700 hover:bg-berry-800 text-white font-semibold text-xs shadow-sm"
                >
                  Save Observation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Non-Diagnostic Disclaimer */}
      <div className="p-3.5 rounded-xl bg-ivory-50 border border-stone-200 text-xs text-stone-600 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-berry-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-stone-800">Important Note on Child Development: </span>
          Milestones are guidelines for fun observation. Babies develop different skills at different times. An unrecorded milestone is not a diagnosis of developmental delay. If you ever have questions or concerns about your child's progress, discuss them with your Health Visitor or GP during your routine reviews.
        </div>
      </div>
    </div>
  );
};
