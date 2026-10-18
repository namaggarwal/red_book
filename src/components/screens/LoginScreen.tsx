import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lock, Eye, EyeOff, ShieldCheck, KeyRound, Sparkles } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { unlockApp, seedSampleData, profile, isDemo } = useApp();
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pin) return;
    setLoading(true);
    setError(false);

    setTimeout(() => {
      const ok = unlockApp(pin);
      if (!ok) {
        setError(true);
        setPin('');
      }
      setLoading(false);
    }, 200);
  };

  const handleQuickDigit = (digit: string) => {
    if (pin.length < 6) {
      const nextPin = pin + digit;
      setPin(nextPin);
      if (nextPin.length === 4) {
        setLoading(true);
        setTimeout(() => {
          const ok = unlockApp(nextPin);
          if (!ok) {
            setError(true);
            setPin('');
          }
          setLoading(false);
        }, 150);
      }
    }
  };

  const handleDeleteDigit = () => {
    setPin(pin.slice(0, -1));
    setError(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-ivory-50 via-white to-ivory-100 flex flex-col justify-center items-center px-4 py-8">
      <div className="w-full max-w-sm">
        {/* Emblem & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-berry-700 via-berry-800 to-berry-900 text-white items-center justify-center shadow-lg shadow-berry-900/15 mb-4 ring-4 ring-berry-100">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">
            Red Book UK
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Personal Child Health Record
          </p>
          {profile && (
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-berry-50 border border-berry-200/80 text-xs font-semibold text-berry-900">
              <span>Record for:</span>
              <span>{profile.preferredName}</span>
              {isDemo && (
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-amber-200 text-amber-900 border border-amber-300 ml-1">
                  Demo
                </span>
              )}
            </div>
          )}
        </div>

        {/* PIN Entry Card */}
        <div className="bg-white rounded-2xl p-6 shadow-card border border-stone-200/80">
          <div className="text-center mb-5">
            <p className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
              Enter Passcode / PIN
            </p>
            <p className="text-xs text-stone-400 mt-0.5">
              Default demo PIN is <span className="font-mono font-bold text-berry-700">1234</span>
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* PIN Dots indicator */}
            <div className="flex justify-center gap-3 mb-6">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                    idx < pin.length
                      ? 'bg-berry-700 border-berry-700 scale-110 shadow-xs'
                      : 'border-stone-300 bg-stone-50'
                  }`}
                />
              ))}
            </div>

            {/* Hidden / Text input option */}
            <div className="relative mb-4">
              <input
                type={showPin ? 'text' : 'password'}
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError(false);
                }}
                placeholder="Enter PIN"
                className="w-full text-center tracking-widest text-lg font-mono py-2.5 px-4 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-berry-600 focus:border-berry-600"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-3 text-stone-400 hover:text-stone-600"
              >
                {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {error && (
              <p className="text-xs text-rose-600 text-center font-medium mb-3">
                Incorrect credentials. Please try again.
              </p>
            )}

            {/* Quick keypad for mobile touch */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleQuickDigit(num)}
                  className="py-3 text-lg font-semibold text-stone-800 rounded-xl bg-stone-50 hover:bg-stone-100 active:bg-berry-100 active:text-berry-900 transition-colors"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPin('')}
                className="py-3 text-xs font-medium text-stone-500 rounded-xl hover:bg-stone-100 transition-colors"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => handleQuickDigit('0')}
                className="py-3 text-lg font-semibold text-stone-800 rounded-xl bg-stone-50 hover:bg-stone-100 active:bg-berry-100 active:text-berry-900 transition-colors"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleDeleteDigit}
                className="py-3 text-xs font-semibold text-stone-600 rounded-xl hover:bg-stone-100 transition-colors"
              >
                ⌫
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || !pin}
              className="w-full py-3 rounded-xl bg-berry-700 hover:bg-berry-800 active:bg-berry-900 disabled:opacity-50 text-white font-medium text-sm transition-colors shadow-sm"
            >
              {loading ? 'Verifying...' : 'Unlock Health Record'}
            </button>
          </form>

          {/* Quick Demo Data loader if testing fresh */}
          {!profile && (
            <div className="mt-4 pt-4 border-t border-stone-100 text-center">
              <button
                type="button"
                onClick={() => seedSampleData()}
                className="inline-flex items-center gap-1.5 text-xs text-berry-700 hover:text-berry-900 font-semibold"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Explore with sample record (Baby Sarah, 6 months)</span>
              </button>
            </div>
          )}
        </div>

        {/* Security & Privacy Reassurance */}
        <div className="mt-6 text-center text-xs text-stone-500 space-y-1">
          <div className="flex items-center justify-center gap-1 text-stone-600 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Private & Encrypted Local Storage</span>
          </div>
          <p>Complies with UK privacy standards. Your data stays in your control.</p>
        </div>
      </div>
    </div>
  );
};
