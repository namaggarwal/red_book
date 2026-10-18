import React from 'react';
import { useApp, ActiveScreen } from '../../context/AppContext';
import {
  Home,
  TrendingUp,
  Clock,
  Sparkles,
  Syringe,
  FileCheck2,
  HeartPulse,
  Calendar,
  Utensils,
  FileText,
  Settings,
  Baby,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { currentScreen, setCurrentScreen, profile, records, childAge, isDemo } = useApp();

  // Calculate quick badges
  const upcomingVaccines = records.filter(
    (r) => r.recordType === 'vaccination' && (r as any).status === 'planned'
  ).length;

  const upcomingAppts = records.filter(
    (r) => r.recordType === 'appointment' && (r as any).appointmentStatus === 'scheduled'
  ).length;

  const menuSections = [
    {
      label: 'Core Record',
      items: [
        { id: 'home', label: 'Dashboard', icon: Home },
        { id: 'growth', label: 'Growth & Centiles', icon: TrendingUp },
        { id: 'timeline', label: 'Timeline & Search', icon: Clock },
      ],
    },
    {
      label: 'Clinical & Health',
      items: [
        { id: 'vaccines', label: 'Vaccinations', icon: Syringe, badge: upcomingVaccines },
        { id: 'development', label: 'Milestones', icon: Sparkles },
        { id: 'reviews', label: 'Health Reviews', icon: FileCheck2 },
        { id: 'events', label: 'Illnesses & Meds', icon: HeartPulse },
        { id: 'appointments', label: 'Appointments', icon: Calendar, badge: upcomingAppts },
      ],
    },
    {
      label: 'Tools & Records',
      items: [
        { id: 'feeding', label: 'Feeding & Sleep', icon: Utensils },
        { id: 'reports', label: 'Reports & Export', icon: FileText },
        { id: 'settings', label: 'Settings & Sync', icon: Settings },
      ],
    },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-stone-200/90 bg-white/70 backdrop-blur min-h-[calc(100vh-57px)] p-4 shrink-0">
      {/* Child Profile Card */}
      {profile && (
        <div className="mb-5 p-3 rounded-xl bg-ivory-50 border border-stone-200/80 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-berry-100 border border-berry-200 flex items-center justify-center text-berry-800 font-bold text-sm">
              <Baby className="w-5 h-5 text-berry-700" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <h2 className="text-sm font-semibold text-stone-900 truncate">
                  {profile.preferredName}
                </h2>
                {isDemo && (
                  <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-900 border border-amber-300 shrink-0">
                    Demo
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 truncate">
                {childAge?.formattedPrimary}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Sections */}
      <div className="space-y-6 flex-1">
        {menuSections.map((section) => (
          <div key={section.label}>
            <p className="text-[11px] font-semibold text-stone-600 uppercase tracking-wider px-3 mb-1.5">
              {section.label}
            </p>
            <nav className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentScreen === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentScreen(item.id as ActiveScreen)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                      isActive
                        ? 'bg-berry-50 text-berry-900 font-semibold'
                        : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`w-4 h-4 ${
                          isActive ? 'text-berry-700 stroke-[2.2]' : 'text-stone-500 stroke-[1.8]'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 ? (
                      <span className="text-[11px] px-1.5 py-0.2 rounded-full font-bold bg-berry-100 text-berry-800">
                        {item.badge}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Bottom disclaimer */}
      <div className="mt-auto pt-4 border-t border-stone-200 text-[11px] text-stone-500 leading-tight">
        <p className="font-medium text-stone-600">Red Book UK</p>
        <p>Personal parent-held child health record.</p>
      </div>
    </aside>
  );
};
