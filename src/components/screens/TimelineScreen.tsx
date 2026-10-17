import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AnyRecord } from '../../types';
import { formatDisplayDate } from '../../utils/dateUtils';
import {
  Clock,
  Search,
  Filter,
  TrendingUp,
  Syringe,
  Sparkles,
  FileCheck2,
  HeartPulse,
  Calendar,
  FileText,
  Utensils,
  X,
} from 'lucide-react';

export const TimelineScreen: React.FC = () => {
  const { profile, records, openRecordDetail } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  if (!profile) return null;

  // Filter & search records
  const filtered = records
    .filter((r) => {
      // Type filter
      if (selectedType !== 'all' && r.recordType !== selectedType) return false;

      // Date range filter
      const rDate = (r as any).recordDate || (r as any).date || (r as any).startDate;
      if (startDate && rDate && rDate < startDate) return false;
      if (endDate && rDate && rDate > endDate) return false;

      // Search query
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const searchable = [
          (r as any).title,
          (r as any).vaccineName,
          (r as any).diseaseTarget,
          (r as any).symptoms,
          (r as any).notes,
          (r as any).parentNotes,
          (r as any).practitioner,
          (r as any).location,
          (r as any).professionalAdvice,
          r.recordType,
          r.source,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        if (!searchable.includes(query)) return false;
      }

      return true;
    })
    .sort((a, b) => {
      const dateA = (a as any).recordDate || (a as any).date || (a as any).startDate || a.createdAt;
      const dateB = (b as any).recordDate || (b as any).date || (b as any).startDate || b.createdAt;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });

  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'growth':
        return <TrendingUp className="w-4 h-4 text-emerald-700" />;
      case 'vaccination':
        return <Syringe className="w-4 h-4 text-rose-700" />;
      case 'milestone':
        return <Sparkles className="w-4 h-4 text-amber-700" />;
      case 'health_review':
        return <FileCheck2 className="w-4 h-4 text-purple-700" />;
      case 'health_event':
        return <HeartPulse className="w-4 h-4 text-blue-700" />;
      case 'appointment':
        return <Calendar className="w-4 h-4 text-teal-700" />;
      case 'feeding_sleep':
        return <Utensils className="w-4 h-4 text-orange-700" />;
      default:
        return <FileText className="w-4 h-4 text-stone-700" />;
    }
  };

  const filterPills = [
    { id: 'all', label: 'All Records' },
    { id: 'growth', label: 'Growth' },
    { id: 'vaccination', label: 'Vaccines' },
    { id: 'milestone', label: 'Milestones' },
    { id: 'health_review', label: 'Reviews' },
    { id: 'health_event', label: 'Illnesses' },
    { id: 'appointment', label: 'Appointments' },
    { id: 'feeding_sleep', label: 'Daily Logs' },
    { id: 'note', label: 'Notes' },
  ];

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setStartDate('');
    setEndDate('');
  };

  const hasActiveFilters = searchTerm || selectedType !== 'all' || startDate || endDate;

  return (
    <div className="space-y-6 pb-20">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">
            Timeline & Universal Search
          </h1>
          <span className="text-xs px-2 py-0.5 rounded-md font-bold uppercase tracking-wider bg-stone-100 text-stone-700">
            Chronological
          </span>
        </div>
        <p className="text-xs text-stone-500 mt-1">
          Search and browse every event in {profile.preferredName}'s digital Red Book
        </p>
      </div>

      {/* Search Bar & Date Pickers */}
      <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-xs space-y-3">
        {/* Universal Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search measurements, vaccines, milestones, symptoms, doctors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-berry-600 focus:border-berry-600"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {filterPills.map((pill) => (
            <button
              key={pill.id}
              onClick={() => setSelectedType(pill.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border ${
                selectedType === pill.id
                  ? 'bg-berry-800 text-white border-berry-800 shadow-2xs'
                  : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Date range pickers */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-stone-500 font-medium">Dates:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-2 py-1 rounded-lg border border-stone-300 text-xs text-stone-700"
            />
            <span className="text-stone-400">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-2 py-1 rounded-lg border border-stone-300 text-xs text-stone-700"
            />
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-berry-700 hover:text-berry-900 font-semibold"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="relative pl-6 sm:pl-8 space-y-4 before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
        {filtered.map((item) => {
          const itemDate =
            (item as any).recordDate || (item as any).date || (item as any).startDate || item.createdAt;

          return (
            <div
              key={item.id}
              onClick={() => openRecordDetail(item)}
              className="relative group cursor-pointer"
            >
              {/* Timeline dot */}
              <div className="absolute -left-6 sm:-left-8 top-3.5 w-5 h-5 rounded-full bg-white border-2 border-stone-300 group-hover:border-berry-600 group-hover:scale-110 flex items-center justify-center transition-all shadow-xs">
                <div className="w-2 h-2 rounded-full bg-stone-400 group-hover:bg-berry-600" />
              </div>

              {/* Record Card */}
              <div className="p-4 rounded-2xl bg-white border border-stone-200/80 group-hover:border-berry-300 group-hover:shadow-sm transition-all space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-stone-100">
                      {getRecordIcon(item.recordType)}
                    </span>
                    <span className="font-bold text-stone-900">
                      {(item as any).title ||
                        (item as any).vaccineName ||
                        (item as any).reviewType ||
                        item.recordType.replace('_', ' ')}
                    </span>
                  </div>
                  <span className="text-stone-600 font-medium">
                    {formatDisplayDate(itemDate)}
                  </span>
                </div>

                {/* Subtitle / content summary */}
                <p className="text-xs text-stone-600 line-clamp-2">
                  {item.recordType === 'growth' &&
                    `Weight: ${(item as any).weightKg || '—'} kg • Length: ${(item as any).lengthCm || '—'} cm • Head: ${(item as any).headCircumferenceCm || '—'} cm`}
                  {item.recordType === 'vaccination' &&
                    `Dose ${(item as any).doseNumber} • Target: ${(item as any).diseaseTarget}`}
                  {item.recordType === 'milestone' &&
                    ((item as any).parentNotes || (item as any).description)}
                  {item.recordType === 'health_review' &&
                    ((item as any).professionalAdvice || (item as any).notes || 'Screening review')}
                  {item.recordType === 'health_event' &&
                    `Symptoms: ${(item as any).symptoms || 'None'} ${(item as any).temperatureCelsius ? `• ${(item as any).temperatureCelsius}°C` : ''}`}
                  {item.recordType === 'appointment' &&
                    `Location: ${(item as any).location || 'GP / Clinic'} • Questions: ${(item as any).questionsToAsk?.length || 0}`}
                  {item.recordType === 'note' && (item as any).content}
                </p>

                <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-100">
                  <span className="capitalize">
                    Source: {item.source?.replace('_', ' ') || 'Parent'}
                  </span>
                  <span className="uppercase text-[10px] font-semibold text-stone-600">
                    {item.recordType.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="p-8 text-center rounded-2xl bg-white border border-stone-200 text-stone-400 text-xs">
            No records matched your search or filters.
          </div>
        )}
      </div>
    </div>
  );
};
