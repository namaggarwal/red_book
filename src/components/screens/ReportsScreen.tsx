import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GrowthRecord, VaccinationRecord, AppointmentRecord, HealthEventRecord } from '../../types';
import { formatDisplayDate } from '../../utils/dateUtils';
import { db } from '../../services/db';
import {
  FileText,
  Printer,
  Download,
  Share2,
  Calendar,
  Baby,
  Syringe,
  TrendingUp,
  ShieldCheck,
  HeartPulse,
} from 'lucide-react';

export const ReportsScreen: React.FC = () => {
  const { profile, records, childAge } = useApp();
  const [reportType, setReportType] = useState<'appointment' | 'growth' | 'full'>('appointment');

  if (!profile) return null;

  const nowFormatted = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const growthRecords = records
    .filter((r): r is GrowthRecord => r.recordType === 'growth')
    .sort((a, b) => new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime());

  const latestWeight = growthRecords.find((r) => r.weightKg);
  const latestLength = growthRecords.find((r) => r.lengthCm);
  const latestHead = growthRecords.find((r) => r.headCircumferenceCm);

  const vaccines = records
    .filter((r): r is VaccinationRecord => r.recordType === 'vaccination')
    .sort((a, b) => (a.ageRecommendedWeeks || 0) - (b.ageRecommendedWeeks || 0));

  const upcomingAppt = records
    .filter((r): r is AppointmentRecord => r.recordType === 'appointment' && r.appointmentStatus === 'scheduled')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  const recentEvents = records
    .filter((r): r is HealthEventRecord => r.recordType === 'health_event')
    .slice(0, 3);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = async () => {
    const json = await db.exportCompleteBackup();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `redbook-${profile.preferredName.toLowerCase()}-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCSV = () => {
    // Generate simple structured CSV of measurements and events
    const headers = ['RecordType', 'Date', 'TitleOrMetric', 'ValueOrNotes', 'Source', 'Status'];
    const rows = records.map((r) => [
      r.recordType,
      (r as any).recordDate || (r as any).date || (r as any).startDate || '',
      (r as any).title || (r as any).vaccineName || 'Measurement',
      (r as any).weightKg
        ? `${(r as any).weightKg}kg`
        : (r as any).notes || (r as any).symptoms || '',
      r.source || 'parent',
      r.status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `redbook-${profile.preferredName.toLowerCase()}-records-${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Title & Action Buttons (Hidden when printing) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-stone-900">
              Reports & Clinical Summaries
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-md font-bold uppercase tracking-wider bg-berry-100 text-berry-800">
              Print & Export
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Generate clean summary reports ready to take to your GP or Health Visitor appointment
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-semibold shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-stone-500" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleDownloadJSON}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-semibold shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-stone-500" />
            <span>Backup JSON</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-berry-700 hover:bg-berry-800 text-white font-semibold text-xs sm:text-sm shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save to PDF</span>
          </button>
        </div>
      </div>

      {/* Report Selection Tabs (Hidden when printing) */}
      <div className="no-print flex items-center gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setReportType('appointment')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            reportType === 'appointment'
              ? 'bg-berry-800 text-white'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          GP / Health Visitor Appointment Sheet
        </button>
        <button
          onClick={() => setReportType('growth')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            reportType === 'growth'
              ? 'bg-berry-800 text-white'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Growth & Centiles History
        </button>
        <button
          onClick={() => setReportType('full')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            reportType === 'full'
              ? 'bg-berry-800 text-white'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Complete Health Summary
        </button>
      </div>

      {/* PRINT-READY REPORT CONTAINER */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs max-w-4xl mx-auto space-y-6 card-print">
        {/* Official Header */}
        <div className="border-b-2 border-berry-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-berry-900">
                RED BOOK UK
              </span>
              <span className="text-xs uppercase font-bold px-2 py-0.5 rounded bg-berry-100 text-berry-800">
                Personal Child Health Record
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Parent-Maintained Clinical Appointment Summary
            </p>
          </div>

          <div className="text-left sm:text-right text-xs text-stone-600">
            <p>
              Generated: <span className="font-medium text-stone-900">{nowFormatted}</span>
            </p>
            <p className="text-[11px] text-stone-500">Source: Parent-recorded digital companion</p>
          </div>
        </div>

        {/* Child Profile Box */}
        <div className="p-4 rounded-xl bg-ivory-50 border border-stone-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-stone-500 block text-[11px]">Child's Name</span>
            <span className="text-sm font-bold text-stone-900">{profile.preferredName}</span>
          </div>
          <div>
            <span className="text-stone-500 block text-[11px]">Date of Birth</span>
            <span className="font-semibold text-stone-900">{formatDisplayDate(profile.dob)}</span>
          </div>
          <div>
            <span className="text-stone-500 block text-[11px]">Current Age</span>
            <span className="font-semibold text-stone-900">{childAge?.formattedPrimary}</span>
          </div>
          <div>
            <span className="text-stone-500 block text-[11px]">Sex (Growth Chart)</span>
            <span className="font-semibold capitalize text-stone-900">{profile.sex}</span>
          </div>
        </div>

        {/* Latest Measurements Section */}
        <div>
          <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2 flex items-center gap-1.5 border-b border-stone-200 pb-1">
            <TrendingUp className="w-3.5 h-3.5 text-berry-700" />
            <span>Latest Growth Measurements</span>
          </h2>
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg border border-stone-200 bg-stone-50">
              <span className="text-stone-500 block">Weight</span>
              <span className="text-base font-bold text-stone-900">
                {latestWeight?.weightKg ? `${latestWeight.weightKg} kg` : '—'}
              </span>
              <span className="text-[10px] text-stone-400 block mt-0.5">
                {latestWeight ? formatDisplayDate(latestWeight.recordDate) : ''}
              </span>
            </div>
            <div className="p-3 rounded-lg border border-stone-200 bg-stone-50">
              <span className="text-stone-500 block">Length / Height</span>
              <span className="text-base font-bold text-stone-900">
                {latestLength?.lengthCm ? `${latestLength.lengthCm} cm` : '—'}
              </span>
              <span className="text-[10px] text-stone-400 block mt-0.5">
                {latestLength ? formatDisplayDate(latestLength.recordDate) : ''}
              </span>
            </div>
            <div className="p-3 rounded-lg border border-stone-200 bg-stone-50">
              <span className="text-stone-500 block">Head Circumference</span>
              <span className="text-base font-bold text-stone-900">
                {latestHead?.headCircumferenceCm ? `${latestHead.headCircumferenceCm} cm` : '—'}
              </span>
              <span className="text-[10px] text-stone-400 block mt-0.5">
                {latestHead ? formatDisplayDate(latestHead.recordDate) : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Prepared Questions for Appointment */}
        {upcomingAppt && upcomingAppt.questionsToAsk.length > 0 && (
          <div>
            <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2 flex items-center gap-1.5 border-b border-stone-200 pb-1">
              <Calendar className="w-3.5 h-3.5 text-teal-700" />
              <span>Questions for Today's Consultation ({upcomingAppt.title})</span>
            </h2>
            <ul className="list-disc pl-5 text-xs text-stone-800 space-y-1">
              {upcomingAppt.questionsToAsk.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Immunisation Status Summary */}
        <div>
          <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2 flex items-center gap-1.5 border-b border-stone-200 pb-1">
            <Syringe className="w-3.5 h-3.5 text-rose-700" />
            <span>Immunisations & Vaccinations Received</span>
          </h2>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 text-[11px]">
                <th className="py-1.5">Vaccine</th>
                <th className="py-1.5">Age Bracket</th>
                <th className="py-1.5">Status</th>
                <th className="py-1.5">Date</th>
                <th className="py-1.5">Batch / Provider</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {vaccines.map((v) => (
                <tr key={v.id}>
                  <td className="py-1.5 font-medium text-stone-900">{v.vaccineName}</td>
                  <td className="py-1.5 text-stone-600">{v.ageRecommended}</td>
                  <td className="py-1.5 font-bold uppercase text-[10px]">
                    <span className={v.status === 'completed' ? 'text-emerald-700' : 'text-amber-700'}>
                      {v.status}
                    </span>
                  </td>
                  <td className="py-1.5 text-stone-700">
                    {v.status === 'completed' ? formatDisplayDate(v.recordDate) : 'Planned'}
                  </td>
                  <td className="py-1.5 text-stone-500 font-mono text-[11px]">
                    {v.batchNumber || v.givenBy || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Illnesses & Medications */}
        {recentEvents.length > 0 && (
          <div>
            <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2 flex items-center gap-1.5 border-b border-stone-200 pb-1">
              <HeartPulse className="w-3.5 h-3.5 text-blue-700" />
              <span>Recent Health Events & Medications</span>
            </h2>
            <div className="space-y-2 text-xs">
              {recentEvents.map((evt) => (
                <div key={evt.id} className="p-2.5 rounded-lg border border-stone-200 bg-stone-50">
                  <div className="flex justify-between font-bold text-stone-900">
                    <span>{evt.title}</span>
                    <span>{formatDisplayDate(evt.startDate)}</span>
                  </div>
                  {evt.symptoms && <p className="text-stone-600 mt-0.5">{evt.symptoms}</p>}
                  {evt.medicines && evt.medicines.length > 0 && (
                    <p className="text-stone-700 font-medium mt-1">
                      Medicines: {evt.medicines.map((m) => `${m.name} (${m.dose}${m.unit})`).join(', ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Doctor / Health Visitor Notes Section */}
        <div className="pt-2">
          <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-1">
            Clinician / Health Visitor Consultation Notes:
          </h2>
          <div className="h-24 rounded-lg border border-dashed border-stone-300 bg-stone-50/50 p-3 text-stone-400 text-xs italic">
            Space for handwritten notes during consultation...
          </div>
        </div>

        {/* Printable Legal Disclaimer */}
        <div className="pt-4 border-t border-stone-200 text-[10px] text-stone-500 text-center space-y-1">
          <p className="font-semibold text-stone-700">
            CONFIDENTIAL • FOR CLINICAL CONSULTATION USE ONLY
          </p>
          <p>
            This document is a parent-maintained extract from a digital companion to the UK Personal Child Health Record (PCHR). It is not an automated medical advice system and is not an official NHS hospital record.
          </p>
        </div>
      </div>
    </div>
  );
};
