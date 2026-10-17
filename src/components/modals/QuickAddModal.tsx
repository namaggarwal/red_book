import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  Syringe,
  Sparkles,
  HeartPulse,
  Calendar,
  FileText,
  FileCheck2,
  X,
  ArrowLeft,
  Check,
  Plus,
} from 'lucide-react';
import {
  GrowthRecord,
  VaccinationRecord,
  MilestoneRecord,
  HealthReviewRecord,
  HealthEventRecord,
  AppointmentRecord,
  NoteRecord,
  RecordSource,
} from '../../types';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: string;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  isOpen,
  onClose,
  initialType,
}) => {
  const { profile, saveRecord } = useApp();
  const [selectedType, setSelectedType] = useState<string | null>(initialType || null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form states
  const today = new Date().toISOString().split('T')[0];
  const [recordDate, setRecordDate] = useState(today);
  const [source, setSource] = useState<RecordSource>('parent');

  // Growth form
  const [weightKg, setWeightKg] = useState('');
  const [lengthCm, setLengthCm] = useState('');
  const [headCircCm, setHeadCircCm] = useState('');
  const [growthNotes, setGrowthNotes] = useState('');

  // Vaccine form
  const [vaccineName, setVaccineName] = useState('');
  const [vaccineDose, setVaccineDose] = useState('1');
  const [vaccineBatch, setVaccineBatch] = useState('');
  const [vaccineGivenBy, setVaccineGivenBy] = useState('');
  const [vaccineReaction, setVaccineReaction] = useState('');

  // Milestone form
  const [milestoneTitle, setMilestoneTitle] = useState('');
  const [milestoneCategory, setMilestoneCategory] = useState<any>('social_emotional');
  const [milestoneNotes, setMilestoneNotes] = useState('');

  // Health event form
  const [eventTitle, setEventTitle] = useState('');
  const [eventType, setEventType] = useState<any>('illness');
  const [symptoms, setSymptoms] = useState('');
  const [tempCelsius, setTempCelsius] = useState('');
  const [medicineName, setMedicineName] = useState('');
  const [medicineDose, setMedicineDose] = useState('');

  // Appointment form
  const [apptTitle, setApptTitle] = useState('');
  const [apptType, setApptType] = useState<any>('gp');
  const [apptTime, setApptTime] = useState('10:00');
  const [apptLocation, setApptLocation] = useState('');
  const [apptQuestions, setApptQuestions] = useState('');

  // Health review form
  const [reviewTitle, setReviewTitle] = useState('6 to 8 Week Baby Health Review');
  const [reviewType, setReviewType] = useState<any>('six_eight_week');
  const [screeningOutcome, setScreeningOutcome] = useState<any>('clear_normal');
  const [reviewNotes, setReviewNotes] = useState('');

  // General note form
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteCategory, setNoteCategory] = useState<any>('general');

  if (!isOpen || !profile) return null;

  const resetFields = () => {
    setWeightKg('');
    setLengthCm('');
    setHeadCircCm('');
    setGrowthNotes('');
    setVaccineName('');
    setVaccineBatch('');
    setVaccineGivenBy('');
    setVaccineReaction('');
    setMilestoneTitle('');
    setMilestoneNotes('');
    setEventTitle('');
    setSymptoms('');
    setTempCelsius('');
    setMedicineName('');
    setMedicineDose('');
    setApptTitle('');
    setApptQuestions('');
    setNoteTitle('');
    setNoteContent('');
  };

  const handleSave = async (andAddAnother = false) => {
    const now = new Date().toISOString();
    const common = {
      childId: profile.id,
      createdAt: now,
      updatedAt: now,
      source,
      schemaVersion: 1,
    };

    if (selectedType === 'growth') {
      const rec: GrowthRecord = {
        ...common,
        id: `growth-${Date.now().toString(36)}`,
        recordType: 'growth',
        recordDate,
        weightKg: weightKg ? parseFloat(weightKg) : null,
        lengthCm: lengthCm ? parseFloat(lengthCm) : null,
        headCircumferenceCm: headCircCm ? parseFloat(headCircCm) : null,
        notes: growthNotes,
        status: 'active',
      };
      await saveRecord(rec);
    } else if (selectedType === 'vaccine') {
      const rec: VaccinationRecord = {
        ...common,
        id: `vax-${Date.now().toString(36)}`,
        recordType: 'vaccination',
        recordDate,
        vaccineName: vaccineName || 'Routine Vaccine',
        diseaseTarget: 'Routine UK immunisation',
        doseNumber: parseInt(vaccineDose, 10) || 1,
        ageRecommended: 'Custom entry',
        status: 'completed',
        batchNumber: vaccineBatch,
        givenBy: vaccineGivenBy,
        reaction: vaccineReaction,
      };
      await saveRecord(rec);
    } else if (selectedType === 'milestone') {
      const rec: MilestoneRecord = {
        ...common,
        id: `milestone-${Date.now().toString(36)}`,
        recordType: 'milestone',
        recordDate,
        title: milestoneTitle || 'New First / Milestone',
        description: milestoneNotes || 'Observed by parent',
        category: milestoneCategory,
        status: 'achieved',
        parentNotes: milestoneNotes,
      };
      await saveRecord(rec);
    } else if (selectedType === 'event') {
      const rec: HealthEventRecord = {
        ...common,
        id: `event-${Date.now().toString(36)}`,
        recordType: 'health_event',
        startDate: recordDate,
        recordDate,
        eventType,
        title: eventTitle || 'Health observation',
        symptoms,
        temperatureCelsius: tempCelsius ? parseFloat(tempCelsius) : null,
        medicines: medicineName
          ? [
              {
                id: `med-${Date.now()}`,
                name: medicineName,
                dose: medicineDose || '2.5',
                unit: 'ml',
                timeGiven: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
              },
            ]
          : [],
        status: 'active',
      };
      await saveRecord(rec);
    } else if (selectedType === 'appointment') {
      const rec: AppointmentRecord = {
        ...common,
        id: `appt-${Date.now().toString(36)}`,
        recordType: 'appointment',
        appointmentType: apptType,
        title: apptTitle || 'Health Visit',
        date: recordDate,
        recordDate,
        time: apptTime,
        location: apptLocation,
        questionsToAsk: apptQuestions ? apptQuestions.split('\n').filter(Boolean) : [],
        followUpActions: [],
        appointmentStatus: 'scheduled',
        status: 'active',
      };
      await saveRecord(rec);
    } else if (selectedType === 'review') {
      const rec: HealthReviewRecord = {
        ...common,
        id: `review-${Date.now().toString(36)}`,
        recordType: 'health_review',
        recordDate,
        reviewType,
        title: reviewTitle,
        reviewDate: recordDate,
        screeningOutcome,
        notes: reviewNotes,
        status: 'active',
      };
      await saveRecord(rec);
    } else if (selectedType === 'note') {
      const rec: NoteRecord = {
        ...common,
        id: `note-${Date.now().toString(36)}`,
        recordType: 'note',
        recordDate,
        title: noteTitle || 'Note',
        category: noteCategory,
        content: noteContent,
        tags: [],
        status: 'active',
      };
      await saveRecord(rec);
    }

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      if (andAddAnother) {
        resetFields();
      } else {
        onClose();
        resetFields();
        setSelectedType(null);
      }
    }, 400);
  };

  const actionTiles = [
    {
      id: 'growth',
      label: 'Growth',
      subtitle: 'Weight, length, head size',
      icon: TrendingUp,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100',
    },
    {
      id: 'vaccine',
      label: 'Vaccination',
      subtitle: 'Vaccine dose, batch, clinic',
      icon: Syringe,
      color: 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100',
    },
    {
      id: 'milestone',
      label: 'Milestone',
      subtitle: 'Firsts and new skills',
      icon: Sparkles,
      color: 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100',
    },
    {
      id: 'review',
      label: 'Health Review',
      subtitle: '6-8w check, HV review',
      icon: FileCheck2,
      color: 'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100',
    },
    {
      id: 'event',
      label: 'Illness / Meds',
      subtitle: 'Fever, symptoms, medicine',
      icon: HeartPulse,
      color: 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100',
    },
    {
      id: 'appointment',
      label: 'Appointment',
      subtitle: 'GP or clinic visit',
      icon: Calendar,
      color: 'bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100',
    },
    {
      id: 'note',
      label: 'Note',
      subtitle: 'Feeding, sleep, reminder',
      icon: FileText,
      color: 'bg-stone-50 text-stone-800 border-stone-200 hover:bg-stone-100',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200">
        {/* Hub Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-stone-200">
          <div className="flex items-center gap-2">
            {selectedType && (
              <button
                onClick={() => setSelectedType(null)}
                className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h2 className="text-lg font-bold text-stone-900">
                {selectedType ? `Log ${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}` : 'Add Health Record'}
              </h2>
              <p className="text-xs text-stone-500">
                {selectedType ? 'Enter details below' : 'Choose a category to log'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 flex items-center gap-2 text-sm font-semibold">
              <Check className="w-5 h-5 text-emerald-600" />
              <span>Record saved successfully!</span>
            </div>
          )}

          {!selectedType ? (
            /* Hub Grid Tiles */
            <div className="grid grid-cols-2 gap-3">
              {actionTiles.map((tile) => {
                const Icon = tile.icon;
                return (
                  <button
                    key={tile.id}
                    onClick={() => setSelectedType(tile.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${tile.color}`}
                  >
                    <Icon className="w-6 h-6 mb-2" />
                    <div>
                      <p className="font-semibold text-sm">{tile.label}</p>
                      <p className="text-[11px] opacity-75 mt-0.5">{tile.subtitle}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            /* Dynamic Forms */
            <div className="space-y-4">
              {/* Date & Source Row */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Event Date
                  </label>
                  <input
                    type="date"
                    value={recordDate}
                    onChange={(e) => setRecordDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Recorded By
                  </label>
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value as RecordSource)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs font-medium"
                  >
                    <option value="parent">Parent</option>
                    <option value="health_visitor">Health Visitor</option>
                    <option value="gp">GP Practice</option>
                    <option value="hospital">Hospital</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Specific Forms */}
              {selectedType === 'growth' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="e.g. 6.45"
                        value={weightKg}
                        onChange={(e) => setWeightKg(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Length (cm)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="e.g. 63.5"
                        value={lengthCm}
                        onChange={(e) => setLengthCm(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Head (cm)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="e.g. 41.2"
                        value={headCircCm}
                        onChange={(e) => setHeadCircCm(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Notes (optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Baby clinic drop-in weighing"
                      value={growthNotes}
                      onChange={(e) => setGrowthNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                    />
                  </div>
                </div>
              )}

              {selectedType === 'vaccine' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Vaccine Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 6-in-1, MenB, MMR, Flu nasal spray"
                      value={vaccineName}
                      onChange={(e) => setVaccineName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Dose Number
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={vaccineDose}
                        onChange={(e) => setVaccineDose(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Batch No. (optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. LOT-9238"
                        value={vaccineBatch}
                        onChange={(e) => setVaccineBatch(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Given By / Clinic
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Nurse Sarah"
                        value={vaccineGivenBy}
                        onChange={(e) => setVaccineGivenBy(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Reaction / Side effects
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. None or mild fever"
                        value={vaccineReaction}
                        onChange={(e) => setVaccineReaction(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedType === 'milestone' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Milestone / First
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rolled over tummy to back, First tooth!"
                      value={milestoneTitle}
                      onChange={(e) => setMilestoneTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Category
                    </label>
                    <select
                      value={milestoneCategory}
                      onChange={(e) => setMilestoneCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                    >
                      <option value="social_emotional">Social & Emotional</option>
                      <option value="communication">Communication & Language</option>
                      <option value="movement_physical">Movement & Physical</option>
                      <option value="hand_finger">Hand & Finger Skills</option>
                      <option value="feeding_self_care">Feeding & Self-care</option>
                      <option value="firsts_memories">Memorable Firsts</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Parent Notes
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Details of the moment..."
                      value={milestoneNotes}
                      onChange={(e) => setMilestoneNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                    />
                  </div>
                </div>
              )}

              {selectedType === 'event' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Type
                      </label>
                      <select
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                      >
                        <option value="illness">Illness / Cold</option>
                        <option value="symptom">Symptom / Fever</option>
                        <option value="injury">Minor Injury</option>
                        <option value="reaction">Allergic Reaction</option>
                        <option value="other">Other Observation</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Temperature (°C)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="e.g. 38.2"
                        value={tempCelsius}
                        onChange={(e) => setTempCelsius(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Event Title / Symptoms
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Teething fever, Runny nose & cough"
                      value={eventTitle}
                      onChange={(e) => setEventTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Medicine Given
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Infant Calpol"
                        value={medicineName}
                        onChange={(e) => setMedicineName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Dose (e.g. 2.5ml)
                      </label>
                      <input
                        type="text"
                        placeholder="2.5ml"
                        value={medicineDose}
                        onChange={(e) => setMedicineDose(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedType === 'appointment' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Appointment Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 6-8 Week GP Check, Health Visitor Weighing"
                      value={apptTitle}
                      onChange={(e) => setApptTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Type
                      </label>
                      <select
                        value={apptType}
                        onChange={(e) => setApptType(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                      >
                        <option value="gp">GP Practice</option>
                        <option value="health_visitor">Health Visitor</option>
                        <option value="hospital_pediatrician">Hospital / Paediatrician</option>
                        <option value="vaccination_clinic">Vaccine Clinic</option>
                        <option value="hearing_vision">Hearing / Vision</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Time
                      </label>
                      <input
                        type="time"
                        value={apptTime}
                        onChange={(e) => setApptTime(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Questions to ask doctor / practitioner (one per line)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Cradle cap treatment? When to start weaning?"
                      value={apptQuestions}
                      onChange={(e) => setApptQuestions(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                    />
                  </div>
                </div>
              )}

              {selectedType === 'review' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Review Title
                    </label>
                    <input
                      type="text"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Screening Outcome
                    </label>
                    <select
                      value={screeningOutcome}
                      onChange={(e) => setScreeningOutcome(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                    >
                      <option value="clear_normal">Clear / Normal</option>
                      <option value="referral_made">Referral Made</option>
                      <option value="review_required">Follow-up Required</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Professional Advice / Findings
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Advice given by practitioner..."
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                    />
                  </div>
                </div>
              )}

              {selectedType === 'note' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Started avocado puree, Sleep routine update"
                      value={noteTitle}
                      onChange={(e) => setNoteTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Content
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Write note here..."
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                    />
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSave(false)}
                  className="flex-1 py-2.5 rounded-xl bg-berry-700 hover:bg-berry-800 text-white font-semibold text-sm shadow-sm transition-colors"
                >
                  Save Record
                </button>
                <button
                  type="button"
                  onClick={() => handleSave(true)}
                  className="px-3.5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs transition-colors"
                >
                  Save & Add Another
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
