import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ChildProfile, Sex } from '../../types';
import { Baby, Info, X, Sparkles, Check } from 'lucide-react';

interface SetupProfileModalProps {
  isOpen: boolean;
  onClose?: () => void;
  existingProfile?: ChildProfile | null;
}

export const SetupProfileModal: React.FC<SetupProfileModalProps> = ({
  isOpen,
  onClose,
  existingProfile,
}) => {
  const { saveChildProfile, seedSampleData } = useApp();

  const isCurrentDemo = Boolean(
    existingProfile &&
      (existingProfile.isDemo ||
        existingProfile.id === 'child-sarah-demo' ||
        existingProfile.id === 'child-tara-demo' ||
        existingProfile.id.includes('demo'))
  );

  const [preferredName, setPreferredName] = useState(
    isCurrentDemo ? '' : existingProfile?.preferredName || ''
  );
  const [dob, setDob] = useState(
    isCurrentDemo ? new Date().toISOString().split('T')[0] : existingProfile?.dob || new Date().toISOString().split('T')[0]
  );
  const [sex, setSex] = useState<Sex>(isCurrentDemo ? 'female' : existingProfile?.sex || 'female');
  const [birthWeightKg, setBirthWeightKg] = useState<string>(
    existingProfile && !isCurrentDemo && existingProfile.birthWeightKg
      ? String(existingProfile.birthWeightKg)
      : ''
  );
  const [birthLengthCm, setBirthLengthCm] = useState<string>(
    existingProfile && !isCurrentDemo && existingProfile.birthLengthCm
      ? String(existingProfile.birthLengthCm)
      : ''
  );
  const [birthHeadCircumferenceCm, setBirthHeadCircumferenceCm] = useState<string>(
    existingProfile && !isCurrentDemo && existingProfile.birthHeadCircumferenceCm
      ? String(existingProfile.birthHeadCircumferenceCm)
      : ''
  );
  const [gestationalAgeWeeks, setGestationalAgeWeeks] = useState<string>(
    existingProfile && !isCurrentDemo && existingProfile.gestationalAgeWeeks
      ? String(existingProfile.gestationalAgeWeeks)
      : '40'
  );
  const [birthDetails, setBirthDetails] = useState(
    existingProfile && !isCurrentDemo ? existingProfile.birthDetails || '' : ''
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setPreferredName(isCurrentDemo ? '' : existingProfile?.preferredName || '');
      setDob(
        isCurrentDemo
          ? new Date().toISOString().split('T')[0]
          : existingProfile?.dob || new Date().toISOString().split('T')[0]
      );
      setSex(isCurrentDemo ? 'female' : existingProfile?.sex || 'female');
      setBirthWeightKg(
        existingProfile && !isCurrentDemo && existingProfile.birthWeightKg
          ? String(existingProfile.birthWeightKg)
          : ''
      );
      setBirthLengthCm(
        existingProfile && !isCurrentDemo && existingProfile.birthLengthCm
          ? String(existingProfile.birthLengthCm)
          : ''
      );
      setBirthHeadCircumferenceCm(
        existingProfile && !isCurrentDemo && existingProfile.birthHeadCircumferenceCm
          ? String(existingProfile.birthHeadCircumferenceCm)
          : ''
      );
      setGestationalAgeWeeks(
        existingProfile && !isCurrentDemo && existingProfile.gestationalAgeWeeks
          ? String(existingProfile.gestationalAgeWeeks)
          : '40'
      );
      setBirthDetails(
        existingProfile && !isCurrentDemo ? existingProfile.birthDetails || '' : ''
      );
      setError(null);
    }
  }, [isOpen, existingProfile, isCurrentDemo]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!preferredName.trim()) {
      setError('Please provide your child\'s preferred name.');
      return;
    }
    if (!dob) {
      setError('Date of birth is required.');
      return;
    }

    const profileData: ChildProfile = {
      id: existingProfile?.id && !isCurrentDemo ? existingProfile.id : `child-${Date.now().toString(36)}`,
      preferredName: preferredName.trim(),
      dob,
      sex,
      birthWeightKg: birthWeightKg ? parseFloat(birthWeightKg) : null,
      birthLengthCm: birthLengthCm ? parseFloat(birthLengthCm) : null,
      birthHeadCircumferenceCm: birthHeadCircumferenceCm
        ? parseFloat(birthHeadCircumferenceCm)
        : null,
      gestationalAgeWeeks: gestationalAgeWeeks ? parseInt(gestationalAgeWeeks, 10) : null,
      birthDetails: birthDetails.trim() || undefined,
      localTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/London',
      createdAt: existingProfile && !isCurrentDemo ? existingProfile.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDemo: false,
    };

    await saveChildProfile(profileData);
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200 relative my-8">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-xl bg-berry-100 text-berry-800 flex items-center justify-center shrink-0">
            <Baby className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-900">
              {existingProfile && !isCurrentDemo ? 'Edit Child Profile' : 'Welcome to Red Book UK'}
            </h2>
            <p className="text-xs text-stone-500">
              {existingProfile && !isCurrentDemo
                ? 'Update your baby\'s personal details and chart settings'
                : 'Set up your child\'s personal digital health record'}
            </p>
          </div>
        </div>

        {/* Quick sample loader prompt if first setup */}
        {!existingProfile && (
          <div className="mb-5 p-3 rounded-xl bg-berry-50/70 border border-berry-200 flex items-center justify-between gap-3">
            <div className="text-xs text-berry-900">
              <span className="font-semibold">Want to see a working demo first?</span>
              <p className="text-berry-700">Pre-fill with 6-month-old Baby Sarah's real schedule & records.</p>
            </div>
            <button
              type="button"
              onClick={() => seedSampleData()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-berry-700 hover:bg-berry-800 text-white text-xs font-semibold shrink-0 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Demo</span>
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Child Preferred Name */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Child's Preferred Name <span className="text-berry-600">*</span>
            </label>
            <input
              type="text"
              required
              value={preferredName}
              onChange={(e) => setPreferredName(e.target.value)}
              placeholder="e.g. Sarah, Arthur, Maya"
              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-berry-600 focus:border-berry-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Date of Birth */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Date of Birth <span className="text-berry-600">*</span>
              </label>
              <input
                type="date"
                required
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-berry-600 focus:border-berry-600"
              />
            </div>

            {/* Sex used for UK-WHO Growth Charts */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Growth Chart Selection <span className="text-berry-600">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSex('female')}
                  className={`py-2 text-xs font-medium rounded-xl border transition-colors flex items-center justify-center gap-1.5 ${
                    sex === 'female'
                      ? 'bg-berry-100 text-berry-900 border-berry-400 font-semibold'
                      : 'border-stone-300 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {sex === 'female' && <Check className="w-3.5 h-3.5 text-berry-700" />}
                  <span>Girl (Female)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSex('male')}
                  className={`py-2 text-xs font-medium rounded-xl border transition-colors flex items-center justify-center gap-1.5 ${
                    sex === 'male'
                      ? 'bg-babyblue-100 text-babyblue-900 border-babyblue-400 font-semibold'
                      : 'border-stone-300 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {sex === 'male' && <Check className="w-3.5 h-3.5 text-babyblue-700" />}
                  <span>Boy (Male)</span>
                </button>
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-stone-50 text-[11px] text-stone-500 flex items-start gap-2">
            <Info className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
            <span>
              UK-WHO growth centile charts are biological sex-specific to match the UK Personal Child Health Record standards.
            </span>
          </div>

          {/* Optional Birth Measurements */}
          <div className="border-t border-stone-200 pt-3">
            <p className="text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
              Birth Measurements (Optional)
            </p>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] text-stone-500 mb-0.5">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.5"
                  max="10"
                  value={birthWeightKg}
                  onChange={(e) => setBirthWeightKg(e.target.value)}
                  placeholder="e.g. 3.40"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] text-stone-500 mb-0.5">
                  Length (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="20"
                  max="70"
                  value={birthLengthCm}
                  onChange={(e) => setBirthLengthCm(e.target.value)}
                  placeholder="e.g. 50.0"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] text-stone-500 mb-0.5">
                  Head (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="20"
                  max="50"
                  value={birthHeadCircumferenceCm}
                  onChange={(e) => setBirthHeadCircumferenceCm(e.target.value)}
                  placeholder="e.g. 35.0"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Gestational Age & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] text-stone-500 mb-0.5">
                Gestation (weeks)
              </label>
              <input
                type="number"
                min="24"
                max="44"
                value={gestationalAgeWeeks}
                onChange={(e) => setGestationalAgeWeeks(e.target.value)}
                placeholder="40"
                className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[11px] text-stone-500 mb-0.5">
                Birth Details / Hospital
              </label>
              <input
                type="text"
                value={birthDetails}
                onChange={(e) => setBirthDetails(e.target.value)}
                placeholder="e.g. St Thomas' Hospital, natural birth"
                className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-sm"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-berry-700 hover:bg-berry-800 text-white font-semibold text-sm shadow-sm transition-colors"
            >
              {existingProfile ? 'Save Changes' : 'Initialize Red Book Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
