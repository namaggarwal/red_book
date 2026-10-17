import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AppointmentRecord, AppointmentStatus } from '../../types';
import { formatDisplayDate } from '../../utils/dateUtils';
import {
  Calendar,
  Plus,
  Clock,
  MapPin,
  User,
  CheckCircle2,
  CheckSquare,
  Square,
  HelpCircle,
  FileCheck2,
} from 'lucide-react';

export const AppointmentsScreen: React.FC = () => {
  const { profile, records, saveRecord, openQuickAdd, openRecordDetail } = useApp();
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'completed'>('all');
  const [newQuestionText, setNewQuestionText] = useState<{ [apptId: string]: string }>({});

  if (!profile) return null;

  const appointments = records
    .filter((r): r is AppointmentRecord => r.recordType === 'appointment')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const filtered = appointments.filter((a) => {
    if (filter === 'scheduled') return a.appointmentStatus === 'scheduled';
    if (filter === 'completed') return a.appointmentStatus === 'completed';
    return true;
  });

  const toggleStatus = async (appt: AppointmentRecord) => {
    const nextStatus: AppointmentStatus =
      appt.appointmentStatus === 'scheduled' ? 'completed' : 'scheduled';
    const updated: AppointmentRecord = {
      ...appt,
      appointmentStatus: nextStatus,
      updatedAt: new Date().toISOString(),
    };
    await saveRecord(updated);
  };

  const handleAddQuestion = async (appt: AppointmentRecord) => {
    const qText = newQuestionText[appt.id]?.trim();
    if (!qText) return;

    const updatedQuestions = [...(appt.questionsToAsk || []), qText];
    const updated: AppointmentRecord = {
      ...appt,
      questionsToAsk: updatedQuestions,
      updatedAt: new Date().toISOString(),
    };

    await saveRecord(updated);
    setNewQuestionText((prev) => ({ ...prev, [appt.id]: '' }));
  };

  const handleRemoveQuestion = async (appt: AppointmentRecord, index: number) => {
    const updatedQuestions = appt.questionsToAsk.filter((_, i) => i !== index);
    const updated: AppointmentRecord = {
      ...appt,
      questionsToAsk: updatedQuestions,
      updatedAt: new Date().toISOString(),
    };
    await saveRecord(updated);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-stone-900">
              Appointments & Health Visits
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-md font-bold uppercase tracking-wider bg-teal-100 text-teal-800">
              Visit Tracker
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Track GP visits, clinic check-ins, and prepare questions to ask for {profile.preferredName}
          </p>
        </div>

        <button
          onClick={() => openQuickAdd('appointment')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-berry-700 hover:bg-berry-800 text-white font-semibold text-xs sm:text-sm shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Visit</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            filter === 'all'
              ? 'bg-stone-900 text-white'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          All Visits ({appointments.length})
        </button>
        <button
          onClick={() => setFilter('scheduled')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            filter === 'scheduled'
              ? 'bg-teal-700 text-white'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Upcoming ({appointments.filter((a) => a.appointmentStatus === 'scheduled').length})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            filter === 'completed'
              ? 'bg-emerald-700 text-white'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Completed ({appointments.filter((a) => a.appointmentStatus === 'completed').length})
        </button>
      </div>

      {/* Appointment Cards */}
      <div className="space-y-4">
        {filtered.map((appt) => {
          const isScheduled = appt.appointmentStatus === 'scheduled';
          return (
            <div
              key={appt.id}
              className={`p-5 rounded-2xl border transition-all space-y-4 ${
                isScheduled
                  ? 'bg-white border-teal-200 shadow-xs ring-1 ring-teal-50'
                  : 'bg-stone-50 border-stone-200 opacity-85'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      isScheduled ? 'bg-teal-600 text-white' : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                        {appt.appointmentType.replace('_', ' ')}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          isScheduled
                            ? 'bg-teal-50 text-teal-800 border border-teal-200'
                            : 'bg-emerald-50 text-emerald-800'
                        }`}
                      >
                        {appt.appointmentStatus}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-stone-900">{appt.title}</h3>
                    <p className="text-xs text-stone-600 flex items-center gap-2 mt-1">
                      <span className="font-semibold text-stone-900">
                        {formatDisplayDate(appt.date)}
                      </span>
                      {appt.time && <span>• {appt.time}</span>}
                      {appt.location && <span>• {appt.location}</span>}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    onClick={() => toggleStatus(appt)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      isScheduled
                        ? 'bg-teal-700 hover:bg-teal-800 text-white'
                        : 'bg-stone-200 hover:bg-stone-300 text-stone-700'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isScheduled ? 'Mark Completed' : 'Reopen'}</span>
                  </button>
                  <button
                    onClick={() => openRecordDetail(appt)}
                    className="p-1.5 text-stone-400 hover:text-stone-700"
                  >
                    •••
                  </button>
                </div>
              </div>

              {/* Interactive Questions to Ask Checklist */}
              <div className="p-3.5 rounded-xl bg-ivory-50 border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-teal-700" />
                    Questions to ask doctor / health visitor:
                  </span>
                  <span className="text-[11px] text-stone-500 font-medium">
                    {appt.questionsToAsk.length} prepared
                  </span>
                </div>

                {appt.questionsToAsk.length > 0 ? (
                  <ul className="space-y-1.5 pt-1">
                    {appt.questionsToAsk.map((q, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-stone-700 flex items-start justify-between gap-2 p-1.5 rounded bg-white border border-stone-200/70"
                      >
                        <div className="flex items-start gap-2">
                          <CheckSquare className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                          <span>{q}</span>
                        </div>
                        <button
                          onClick={() => handleRemoveQuestion(appt, idx)}
                          className="text-stone-400 hover:text-rose-600 text-[11px] shrink-0"
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-stone-400 italic">No questions added yet.</p>
                )}

                {/* Add new question input */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Type a question to remember during visit..."
                    value={newQuestionText[appt.id] || ''}
                    onChange={(e) =>
                      setNewQuestionText({ ...newQuestionText, [appt.id]: e.target.value })
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddQuestion(appt);
                      }
                    }}
                    className="flex-1 px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs bg-white"
                  />
                  <button
                    onClick={() => handleAddQuestion(appt)}
                    className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shrink-0"
                  >
                    + Add
                  </button>
                </div>
              </div>

              {appt.notes && (
                <p className="text-xs text-stone-600 italic bg-white p-2.5 rounded-lg border border-stone-200/80">
                  Notes: {appt.notes}
                </p>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="p-8 text-center rounded-2xl bg-white border border-stone-200 text-stone-400 text-xs">
            No appointments found in this view.
          </div>
        )}
      </div>
    </div>
  );
};
