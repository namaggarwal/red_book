import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HealthReviewRecord, ScreeningOutcome } from '../../types';
import { formatDisplayDate } from '../../utils/dateUtils';
import {
  FileCheck2,
  Plus,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  Building2,
  HelpCircle,
  Stethoscope,
  Info,
} from 'lucide-react';

export const HealthReviewsScreen: React.FC = () => {
  const { profile, records, saveRecord, openQuickAdd, openRecordDetail } = useApp();
  const [editingReview, setEditingReview] = useState<HealthReviewRecord | null>(null);

  // Form states
  const [outcome, setOutcome] = useState<ScreeningOutcome>('clear_normal');
  const [practitioner, setPractitioner] = useState('');
  const [setting, setSetting] = useState('');
  const [parentalConcerns, setParentalConcerns] = useState('');
  const [professionalAdvice, setProfessionalAdvice] = useState('');
  const [notes, setNotes] = useState('');
  const [reviewDate, setReviewDate] = useState('');

  if (!profile) return null;

  const reviews = records
    .filter((r): r is HealthReviewRecord => r.recordType === 'health_review')
    .sort((a, b) => new Date(a.reviewDate).getTime() - new Date(b.reviewDate).getTime());

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview) return;

    const updated: HealthReviewRecord = {
      ...editingReview,
      reviewDate,
      screeningOutcome: outcome,
      practitioner: practitioner.trim() || undefined,
      setting: setting.trim() || undefined,
      parentalConcerns: parentalConcerns.trim() || undefined,
      professionalAdvice: professionalAdvice.trim() || undefined,
      notes: notes.trim() || undefined,
      updatedAt: new Date().toISOString(),
    };

    await saveRecord(updated);
    setEditingReview(null);
  };

  const getOutcomeBadge = (outcome: ScreeningOutcome) => {
    switch (outcome) {
      case 'clear_normal':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Clear / Normal</span>
          </span>
        );
      case 'referral_made':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Referral Made</span>
          </span>
        );
      case 'review_required':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Follow-up Needed</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            <span>Pending Review</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-stone-900">
              Health Reviews & Screening
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-md font-bold uppercase tracking-wider bg-purple-100 text-purple-800">
              Healthy Child Programme
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Structured records of health visitor, GP, and newborn screening reviews for {profile.preferredName}
          </p>
        </div>

        <button
          onClick={() => openQuickAdd('review')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-berry-700 hover:bg-berry-800 text-white font-semibold text-xs sm:text-sm shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Clinical Review</span>
        </button>
      </div>

      {/* Review Timeline Cards */}
      <div className="space-y-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-xs hover:border-purple-200 transition-all space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block mb-0.5">
                  Scheduled / Recorded for: {formatDisplayDate(rev.reviewDate)}
                </span>
                <h3 className="text-base font-bold text-stone-900">{rev.title}</h3>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                {getOutcomeBadge(rev.screeningOutcome)}
                <button
                  onClick={() => {
                    setEditingReview(rev);
                    setReviewDate(rev.reviewDate);
                    setOutcome(rev.screeningOutcome);
                    setPractitioner(rev.practitioner || '');
                    setSetting(rev.setting || '');
                    setParentalConcerns(rev.parentalConcerns || '');
                    setProfessionalAdvice(rev.professionalAdvice || '');
                    setNotes(rev.notes || '');
                  }}
                  className="px-2.5 py-1 text-xs font-semibold text-purple-800 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                >
                  Edit / Update
                </button>
              </div>
            </div>

            {/* Structured details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {rev.practitioner && (
                <div className="flex items-center gap-2 text-stone-600">
                  <User className="w-4 h-4 text-stone-400 shrink-0" />
                  <span>
                    <strong className="text-stone-800">Practitioner:</strong> {rev.practitioner}
                  </span>
                </div>
              )}
              {rev.setting && (
                <div className="flex items-center gap-2 text-stone-600">
                  <Building2 className="w-4 h-4 text-stone-400 shrink-0" />
                  <span>
                    <strong className="text-stone-800">Setting:</strong> {rev.setting}
                  </span>
                </div>
              )}
            </div>

            {rev.parentalConcerns && (
              <div className="p-3 rounded-xl bg-ivory-50 border border-stone-200 text-xs">
                <span className="font-semibold text-stone-800 flex items-center gap-1.5 mb-1">
                  <HelpCircle className="w-3.5 h-3.5 text-stone-500" />
                  Questions / Concerns Raised:
                </span>
                <p className="text-stone-700 italic">{rev.parentalConcerns}</p>
              </div>
            )}

            {rev.professionalAdvice && (
              <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-200 text-xs">
                <span className="font-semibold text-purple-900 flex items-center gap-1.5 mb-1">
                  <Stethoscope className="w-3.5 h-3.5 text-purple-700" />
                  Professional Advice & Follow-up:
                </span>
                <p className="text-stone-800">{rev.professionalAdvice}</p>
              </div>
            )}

            {rev.notes && !rev.professionalAdvice && (
              <p className="text-xs text-stone-600 italic bg-stone-50 p-2.5 rounded-xl">
                "{rev.notes}"
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Edit Review Modal */}
      {editingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-stone-900 mb-1">
              Update Health Review
            </h3>
            <p className="text-xs text-stone-500 mb-4">{editingReview.title}</p>

            <form onSubmit={handleSaveReview} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Review Date
                  </label>
                  <input
                    type="date"
                    required
                    value={reviewDate}
                    onChange={(e) => setReviewDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Screening Outcome
                  </label>
                  <select
                    value={outcome}
                    onChange={(e) => setOutcome(e.target.value as ScreeningOutcome)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                  >
                    <option value="clear_normal">Clear / Normal</option>
                    <option value="referral_made">Referral Made</option>
                    <option value="review_required">Follow-up Required</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Practitioner Name / Role
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Clarke, Health Visitor"
                    value={practitioner}
                    onChange={(e) => setPractitioner(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Location / Setting
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. GP Surgery, Home visit"
                    value={setting}
                    onChange={(e) => setSetting(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Questions / Concerns You Raised
                </label>
                <textarea
                  rows={2}
                  placeholder="Notes on questions you asked during the check..."
                  value={parentalConcerns}
                  onChange={(e) => setParentalConcerns(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Advice Given by Healthcare Professional
                </label>
                <textarea
                  rows={3}
                  placeholder="Advice, guidance or next steps recorded..."
                  value={professionalAdvice}
                  onChange={(e) => setProfessionalAdvice(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingReview(null)}
                  className="px-3.5 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-berry-700 hover:bg-berry-800 text-white font-semibold text-xs shadow-sm"
                >
                  Save Review Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NHS Standard Review Info */}
      <div className="p-3.5 rounded-xl bg-ivory-50 border border-stone-200 text-xs text-stone-600 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-stone-800">NHS Healthy Child Reviews: </span>
          In England, your baby will typically have reviews around birth (NIPE), hearing screen, heel prick, 6 to 8 weeks, 9 to 12 months, and 2 to 2.5 years. Keep this section updated to prepare for your next check-up!
        </div>
      </div>
    </div>
  );
};
