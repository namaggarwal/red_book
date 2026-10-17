import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AnyRecord } from '../../types';
import { formatDisplayDate } from '../../utils/dateUtils';
import {
  X,
  Trash2,
  Calendar,
  User,
  Clock,
  Sparkles,
  TrendingUp,
  Syringe,
  FileCheck2,
  HeartPulse,
  FileText,
  Copy,
} from 'lucide-react';

export const RecordDetailModal: React.FC = () => {
  const { selectedRecord, closeRecordDetail, deleteRecord, saveRecord } = useApp();
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!selectedRecord) return null;

  const handleDelete = async () => {
    await deleteRecord(selectedRecord.id);
    closeRecordDetail();
  };

  const handleDuplicate = async () => {
    const clone = {
      ...selectedRecord,
      id: `${selectedRecord.recordType}-dup-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await saveRecord(clone);
    closeRecordDetail();
  };

  const getRecordIcon = () => {
    switch (selectedRecord.recordType) {
      case 'growth':
        return <TrendingUp className="w-5 h-5 text-emerald-700" />;
      case 'vaccination':
        return <Syringe className="w-5 h-5 text-rose-700" />;
      case 'milestone':
        return <Sparkles className="w-5 h-5 text-amber-700" />;
      case 'health_review':
        return <FileCheck2 className="w-5 h-5 text-purple-700" />;
      case 'health_event':
        return <HeartPulse className="w-5 h-5 text-blue-700" />;
      case 'appointment':
        return <Calendar className="w-5 h-5 text-teal-700" />;
      default:
        return <FileText className="w-5 h-5 text-stone-700" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-stone-200 relative">
        <button
          onClick={closeRecordDetail}
          className="absolute top-4 right-4 p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center">
            {getRecordIcon()}
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-600">
              {selectedRecord.recordType.replace('_', ' ')}
            </span>
            <h3 className="text-lg font-bold text-stone-900">
              {(selectedRecord as any).title ||
                (selectedRecord as any).vaccineName ||
                (selectedRecord as any).reviewType ||
                'Health Record'}
            </h3>
          </div>
        </div>

        {/* Content Details */}
        <div className="space-y-3 bg-stone-50 rounded-xl p-3.5 border border-stone-200 text-xs">
          <div className="flex items-center justify-between text-stone-600">
            <span className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5" /> Date Recorded
            </span>
            <span className="font-semibold text-stone-900">
              {formatDisplayDate((selectedRecord as any).recordDate || (selectedRecord as any).date || (selectedRecord as any).startDate)}
            </span>
          </div>

          <div className="flex items-center justify-between text-stone-600">
            <span className="flex items-center gap-1.5 font-medium">
              <User className="w-3.5 h-3.5" /> Source
            </span>
            <span className="capitalize px-2 py-0.5 rounded bg-white border border-stone-200 font-semibold text-stone-800">
              {selectedRecord.source?.replace('_', ' ') || 'Parent'}
            </span>
          </div>

          {/* Growth specifics */}
          {selectedRecord.recordType === 'growth' && (
            <div className="pt-2 border-t border-stone-200 space-y-1">
              {(selectedRecord as any).weightKg && (
                <div className="flex justify-between">
                  <span className="text-stone-500">Weight:</span>
                  <span className="font-bold text-stone-900">{(selectedRecord as any).weightKg} kg</span>
                </div>
              )}
              {(selectedRecord as any).lengthCm && (
                <div className="flex justify-between">
                  <span className="text-stone-500">Length / Height:</span>
                  <span className="font-bold text-stone-900">{(selectedRecord as any).lengthCm} cm</span>
                </div>
              )}
              {(selectedRecord as any).headCircumferenceCm && (
                <div className="flex justify-between">
                  <span className="text-stone-500">Head Circumference:</span>
                  <span className="font-bold text-stone-900">{(selectedRecord as any).headCircumferenceCm} cm</span>
                </div>
              )}
            </div>
          )}

          {/* Vaccine specifics */}
          {selectedRecord.recordType === 'vaccination' && (
            <div className="pt-2 border-t border-stone-200 space-y-1">
              <div className="flex justify-between">
                <span className="text-stone-500">Status:</span>
                <span className="font-bold uppercase text-berry-700">{(selectedRecord as any).status}</span>
              </div>
              {(selectedRecord as any).doseNumber && (
                <div className="flex justify-between">
                  <span className="text-stone-500">Dose:</span>
                  <span className="font-semibold text-stone-800">Dose {(selectedRecord as any).doseNumber}</span>
                </div>
              )}
              {(selectedRecord as any).batchNumber && (
                <div className="flex justify-between">
                  <span className="text-stone-500">Batch Number:</span>
                  <span className="font-mono text-stone-800">{(selectedRecord as any).batchNumber}</span>
                </div>
              )}
              {(selectedRecord as any).givenBy && (
                <div className="flex justify-between">
                  <span className="text-stone-500">Given By:</span>
                  <span className="text-stone-800">{(selectedRecord as any).givenBy}</span>
                </div>
              )}
            </div>
          )}

          {/* Milestone specifics */}
          {selectedRecord.recordType === 'milestone' && (
            <div className="pt-2 border-t border-stone-200 space-y-1">
              <div className="flex justify-between">
                <span className="text-stone-500">Status:</span>
                <span className="font-bold uppercase text-amber-700">{(selectedRecord as any).status.replace('_', ' ')}</span>
              </div>
              {(selectedRecord as any).description && (
                <p className="text-stone-600 mt-1 italic">{(selectedRecord as any).description}</p>
              )}
            </div>
          )}

          {/* Notes field */}
          {(selectedRecord as any).notes && (
            <div className="pt-2 border-t border-stone-200">
              <span className="text-stone-500 block mb-0.5 font-medium">Notes:</span>
              <p className="text-stone-800 bg-white p-2 rounded-lg border border-stone-200/80">
                {(selectedRecord as any).notes}
              </p>
            </div>
          )}

          {/* Timestamps */}
          <div className="pt-2 border-t border-stone-200 text-[10px] text-stone-400 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> Created: {formatDisplayDate(selectedRecord.createdAt)}
            </span>
            <span className="font-mono">ID: {selectedRecord.id.substring(0, 12)}...</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex items-center justify-between gap-2">
          {!confirmDelete ? (
            <>
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDuplicate}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Duplicate</span>
                </button>
                <button
                  type="button"
                  onClick={closeRecordDetail}
                  className="px-4 py-2 rounded-xl bg-berry-700 hover:bg-berry-800 text-white text-xs font-semibold transition-colors"
                >
                  Done
                </button>
              </div>
            </>
          ) : (
            <div className="w-full bg-rose-50 p-3 rounded-xl border border-rose-200 flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-rose-800">
                Are you sure you want to delete this record?
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="px-2.5 py-1 text-xs text-stone-600 hover:bg-white rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-2.5 py-1 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-2xs"
                >
                  Confirm
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
