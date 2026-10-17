import React from 'react';
import { useApp, ActiveScreen } from '../../context/AppContext';
import {
  Syringe,
  FileCheck2,
  HeartPulse,
  Calendar,
  Utensils,
  FileText,
  Settings,
  Baby,
  ShieldCheck,
  Download,
  Info,
} from 'lucide-react';

export const MoreMenuScreen: React.FC = () => {
  const { setCurrentScreen, profile, records } = useApp();

  const menuItems = [
    {
      id: 'vaccines',
      title: 'Vaccinations & Immunisations',
      subtitle: 'UK Routine Schedule (8w, 12w, 16w, 1y, 3y4m)',
      icon: Syringe,
      color: 'bg-rose-50 text-rose-800 border-rose-200',
    },
    {
      id: 'reviews',
      title: 'Health Reviews & Screening',
      subtitle: 'Healthy Child Programme (6-8w check, HV reviews)',
      icon: FileCheck2,
      color: 'bg-purple-50 text-purple-800 border-purple-200',
    },
    {
      id: 'events',
      title: 'Illnesses, Fevers & Medicines',
      subtitle: 'Track symptoms, temperatures and medicines',
      icon: HeartPulse,
      color: 'bg-blue-50 text-blue-800 border-blue-200',
    },
    {
      id: 'appointments',
      title: 'Appointments & Questions',
      subtitle: 'Upcoming visits and doctor question checklist',
      icon: Calendar,
      color: 'bg-teal-50 text-teal-800 border-teal-200',
    },
    {
      id: 'feeding',
      title: 'Feeding, Sleep & Routine',
      subtitle: 'Breast, bottle, solid foods, naps and nappies',
      icon: Utensils,
      color: 'bg-orange-50 text-orange-800 border-orange-200',
    },
    {
      id: 'reports',
      title: 'Reports & Printable Summary',
      subtitle: 'Print-to-PDF consultation summaries and CSV export',
      icon: FileText,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    {
      id: 'settings',
      title: 'Settings, Sync & Privacy',
      subtitle: 'Google Sheets sync, passcode lock, JSON backup',
      icon: Settings,
      color: 'bg-stone-50 text-stone-800 border-stone-200',
    },
  ];

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">
          All Health Sections
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Explore complete Red Book records and utilities
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentScreen(item.id as ActiveScreen)}
              className={`p-4 rounded-2xl border text-left transition-all hover:scale-[1.01] shadow-xs flex items-start gap-3.5 ${item.color}`}
            >
              <div className="p-2.5 rounded-xl bg-white shadow-2xs shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-stone-900">{item.title}</h3>
                <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                  {item.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Disclaimers & Safety */}
      <div className="p-4 rounded-2xl bg-ivory-50 border border-stone-200 text-xs text-stone-600 space-y-1">
        <p className="font-semibold text-stone-800 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-berry-700" />
          <span>UK Red Book (Personal Child Health Record)</span>
        </p>
        <p>
          Parent-held digital health record. Compliant with UK privacy principles. No medical diagnosis or automated treatment suggestions.
        </p>
      </div>
    </div>
  );
};
