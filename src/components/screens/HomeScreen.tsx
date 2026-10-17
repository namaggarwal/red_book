import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  Syringe,
  Sparkles,
  Calendar,
  FileCheck2,
  HeartPulse,
  Plus,
  ArrowRight,
  ShieldAlert,
  Clock,
  Baby,
  ChevronRight,
} from 'lucide-react';
import { formatDisplayDate } from '../../utils/dateUtils';
import { GrowthRecord, VaccinationRecord, MilestoneRecord, HealthReviewRecord, AppointmentRecord } from '../../types';
import { estimateCentile } from '../../data/ukWhoCentiles';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

export const HomeScreen: React.FC = () => {
  const {
    profile,
    records,
    childAge,
    openQuickAdd,
    setCurrentScreen,
    openRecordDetail,
    setSetupModalOpen,
    seedSampleData,
  } = useApp();

  if (!profile) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-berry-100 text-berry-800 flex items-center justify-center mx-auto mb-4">
          <Baby className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-stone-900">Welcome to Red Book UK</h2>
        <p className="text-xs text-stone-500 mt-1 mb-6">
          Set up your baby's digital health record or try the demo.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => setSetupModalOpen(true)}
            className="w-full py-3 rounded-xl bg-berry-700 hover:bg-berry-800 text-white font-semibold text-sm shadow-sm"
          >
            Create Baby's Record
          </button>
          <button
            onClick={() => seedSampleData()}
            className="w-full py-3 rounded-xl bg-white border border-stone-200 text-stone-700 font-semibold text-sm hover:bg-stone-50"
          >
            Explore Sample Record (Baby Tara)
          </button>
        </div>
      </div>
    );
  }

  // Get latest growth measurements
  const growthRecords = records
    .filter((r): r is GrowthRecord => r.recordType === 'growth')
    .sort((a, b) => new Date(a.recordDate).getTime() - new Date(b.recordDate).getTime());

  const latestWeight = [...growthRecords]
    .reverse()
    .find((r) => r.weightKg !== null && r.weightKg !== undefined);

  const latestLength = [...growthRecords]
    .reverse()
    .find((r) => r.lengthCm !== null && r.lengthCm !== undefined);

  const latestHead = [...growthRecords]
    .reverse()
    .find((r) => r.headCircumferenceCm !== null && r.headCircumferenceCm !== undefined);

  // Centiles for latest measurements
  const weightCentile =
    latestWeight && latestWeight.weightKg && childAge
      ? estimateCentile('weight', profile.sex, childAge.totalMonthsFloat, latestWeight.weightKg)
      : null;

  // Upcoming items (planned vaccines & scheduled appointments)
  const upcomingVaccines = records
    .filter((r): r is VaccinationRecord => r.recordType === 'vaccination' && r.status === 'planned')
    .sort((a, b) => new Date(a.recordDate).getTime() - new Date(b.recordDate).getTime())
    .slice(0, 3);

  const upcomingAppts = records
    .filter((r): r is AppointmentRecord => r.recordType === 'appointment' && r.appointmentStatus === 'scheduled')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 2);

  const upcomingReviews = records
    .filter((r): r is HealthReviewRecord => r.recordType === 'health_review' && r.screeningOutcome === 'pending')
    .sort((a, b) => new Date(a.reviewDate).getTime() - new Date(b.reviewDate).getTime())
    .slice(0, 1);

  // Latest achieved milestones
  const achievedMilestones = records
    .filter((r): r is MilestoneRecord => r.recordType === 'milestone' && r.status === 'achieved')
    .sort((a, b) => new Date(b.recordDate || b.createdAt).getTime() - new Date(a.recordDate || a.createdAt).getTime())
    .slice(0, 3);

  // Recent activity stream (last 5 records)
  const recentActivity = [...records]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Mini growth chart data
  const chartData = growthRecords
    .filter((r) => r.weightKg)
    .map((r) => {
      const d = new Date(r.recordDate);
      const b = new Date(profile.dob);
      const ageWeeks = Math.max(0, Math.round((d.getTime() - b.getTime()) / (1000 * 60 * 60 * 24 * 7)));
      return {
        date: formatDisplayDate(r.recordDate),
        ageWeeks: `${ageWeeks}w`,
        weight: r.weightKg,
      };
    });

  return (
    <div className="space-y-6 pb-20">
      {/* Child Header Card */}
      <div className="rounded-2xl bg-gradient-to-br from-berry-800 via-berry-900 to-stone-900 text-white p-5 sm:p-6 shadow-md relative overflow-hidden">
        {/* Subtle decorative background circle */}
        <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-berry-700/20 pointer-events-none blur-2xl" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-berry-700/60 text-berry-100 border border-berry-600/50">
                UK Red Book • {profile.sex === 'female' ? 'Girl' : 'Boy'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {profile.preferredName}'s Health Record
            </h1>
            <p className="text-sm text-berry-100/90 mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="font-semibold text-white">{childAge?.formattedPrimary}</span>
              <span>•</span>
              <span>Born {formatDisplayDate(profile.dob)}</span>
              {profile.gestationalAgeWeeks && (
                <>
                  <span>•</span>
                  <span>{profile.gestationalAgeWeeks}w gestation</span>
                </>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => openQuickAdd()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-berry-900 hover:bg-ivory-100 font-semibold text-xs sm:text-sm shadow-sm transition-transform active:scale-95"
            >
              <Plus className="w-4 h-4 text-berry-700" />
              <span>Record Event</span>
            </button>
          </div>
        </div>
      </div>

      {/* Latest Growth Cards */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
            Latest Measurements
          </h2>
          <button
            onClick={() => setCurrentScreen('growth')}
            className="text-xs text-berry-700 hover:text-berry-900 font-semibold flex items-center gap-1"
          >
            <span>UK-WHO Growth Charts</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Weight Card */}
          <div
            onClick={() => setCurrentScreen('growth')}
            className="p-4 rounded-xl bg-white border border-stone-200/80 shadow-xs hover:border-berry-200 hover:shadow-sm transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
              <span className="font-semibold text-stone-700">Weight</span>
              <span className="text-[11px] text-stone-600 bg-stone-100 px-1.5 py-0.5 rounded capitalize">
                {latestWeight?.source ? latestWeight.source.replace('_', ' ') : 'None'}
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-stone-900 group-hover:text-berry-800 transition-colors">
                {latestWeight?.weightKg ? `${latestWeight.weightKg} kg` : '—'}
              </span>
            </div>
            <div className="mt-2 text-xs flex items-center justify-between">
              {latestWeight ? (
                <span className="text-stone-600">
                  Measured {formatDisplayDate(latestWeight.recordDate)}
                </span>
              ) : (
                <span className="text-stone-600">No measurement yet</span>
              )}
              {weightCentile && (
                <span className={`text-[11px] font-semibold ${weightCentile.bandColor}`}>
                  {weightCentile.centileText}
                </span>
              )}
            </div>
          </div>

          {/* Length / Height Card */}
          <div
            onClick={() => setCurrentScreen('growth')}
            className="p-4 rounded-xl bg-white border border-stone-200/80 shadow-xs hover:border-berry-200 hover:shadow-sm transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
              <span className="font-semibold text-stone-700">Length / Height</span>
              <span className="text-[11px] text-stone-600 bg-stone-100 px-1.5 py-0.5 rounded capitalize">
                {latestLength?.source ? latestLength.source.replace('_', ' ') : 'None'}
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-stone-900 group-hover:text-berry-800 transition-colors">
                {latestLength?.lengthCm ? `${latestLength.lengthCm} cm` : '—'}
              </span>
            </div>
            <div className="mt-2 text-xs text-stone-600">
              {latestLength ? (
                <span>Measured {formatDisplayDate(latestLength.recordDate)}</span>
              ) : (
                <span>No measurement yet</span>
              )}
            </div>
          </div>

          {/* Head Circumference Card */}
          <div
            onClick={() => setCurrentScreen('growth')}
            className="p-4 rounded-xl bg-white border border-stone-200/80 shadow-xs hover:border-berry-200 hover:shadow-sm transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
              <span className="font-semibold text-stone-700">Head Circumference</span>
              <span className="text-[11px] text-stone-600 bg-stone-100 px-1.5 py-0.5 rounded capitalize">
                {latestHead?.source ? latestHead.source.replace('_', ' ') : 'None'}
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-stone-900 group-hover:text-berry-800 transition-colors">
                {latestHead?.headCircumferenceCm ? `${latestHead.headCircumferenceCm} cm` : '—'}
              </span>
            </div>
            <div className="mt-2 text-xs text-stone-600">
              {latestHead ? (
                <span>Measured {formatDisplayDate(latestHead.recordDate)}</span>
              ) : (
                <span>No measurement yet</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Snapshot Growth Chart + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Compact Growth Snapshot */}
        <div className="lg:col-span-2 p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-stone-900">Weight Trend</h3>
              <p className="text-xs text-stone-500">Weight (kg) over time vs age</p>
            </div>
            <button
              onClick={() => setCurrentScreen('growth')}
              className="text-xs text-berry-700 font-semibold hover:underline"
            >
              Full Centile Chart
            </button>
          </div>

          {chartData.length > 1 ? (
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="ageWeeks" stroke="#a8a29e" fontSize={11} tickLine={false} />
                  <YAxis stroke="#a8a29e" fontSize={11} domain={['auto', 'auto']} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      borderRadius: '8px',
                      border: '1px solid #e7e5e4',
                      fontSize: '12px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#8e203e"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#8e203e' }}
                    name="Weight (kg)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-36 flex flex-col items-center justify-center text-center p-4 border border-dashed border-stone-200 rounded-xl bg-stone-50">
              <TrendingUp className="w-8 h-8 text-stone-300 mb-1" />
              <p className="text-xs text-stone-600 font-medium">Add at least two weight entries to view growth trend</p>
              <button
                onClick={() => openQuickAdd('growth')}
                className="mt-2 text-xs font-semibold text-berry-700 hover:text-berry-900"
              >
                + Log Weight Now
              </button>
            </div>
          )}
        </div>

        {/* Quick Action Tiles */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-stone-900 mb-2.5">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => openQuickAdd('growth')}
                className="p-2.5 rounded-xl bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200 text-left transition-colors"
              >
                <TrendingUp className="w-4 h-4 text-emerald-700 mb-1" />
                <span className="text-xs font-semibold block">Add Weight</span>
              </button>
              <button
                onClick={() => openQuickAdd('vaccine')}
                className="p-2.5 rounded-xl bg-rose-50 text-rose-900 hover:bg-rose-100 border border-rose-200 text-left transition-colors"
              >
                <Syringe className="w-4 h-4 text-rose-700 mb-1" />
                <span className="text-xs font-semibold block">Log Vaccine</span>
              </button>
              <button
                onClick={() => openQuickAdd('milestone')}
                className="p-2.5 rounded-xl bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200 text-left transition-colors"
              >
                <Sparkles className="w-4 h-4 text-amber-700 mb-1" />
                <span className="text-xs font-semibold block">New Milestone</span>
              </button>
              <button
                onClick={() => openQuickAdd('appointment')}
                className="p-2.5 rounded-xl bg-teal-50 text-teal-900 hover:bg-teal-100 border border-teal-200 text-left transition-colors"
              >
                <Calendar className="w-4 h-4 text-teal-700 mb-1" />
                <span className="text-xs font-semibold block">Appointment</span>
              </button>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>Red Book Paper Companion</span>
            <button
              onClick={() => setCurrentScreen('reports')}
              className="text-berry-700 hover:text-berry-900 font-semibold"
            >
              Print Summary
            </button>
          </div>
        </div>
      </div>

      {/* Two Column: Upcoming Schedule & Development / Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Upcoming Vaccinations & Appointments */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
              Upcoming Schedule
            </h3>
            <button
              onClick={() => setCurrentScreen('vaccines')}
              className="text-xs text-berry-700 font-semibold hover:underline"
            >
              View Full Schedule
            </button>
          </div>

          <div className="space-y-2">
            {/* Upcoming Appointments */}
            {upcomingAppts.map((appt) => (
              <div
                key={appt.id}
                onClick={() => openRecordDetail(appt)}
                className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200 flex items-start gap-3 cursor-pointer hover:bg-teal-100/70 transition-colors"
              >
                <div className="p-2 rounded-lg bg-teal-600 text-white shrink-0 mt-0.5">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 block">
                    Planned Visit • {formatDisplayDate(appt.date)}
                  </span>
                  <h4 className="text-sm font-semibold text-stone-900 truncate">{appt.title}</h4>
                  {appt.location && (
                    <p className="text-xs text-stone-600 truncate mt-0.5">{appt.location}</p>
                  )}
                  {appt.questionsToAsk.length > 0 && (
                    <p className="text-[11px] text-teal-700 mt-1 font-medium">
                      {appt.questionsToAsk.length} questions prepared
                    </p>
                  )}
                </div>
              </div>
            ))}

            {/* Upcoming Vaccinations */}
            {upcomingVaccines.map((vax) => (
              <div
                key={vax.id}
                onClick={() => openRecordDetail(vax)}
                className="p-3.5 rounded-xl bg-white border border-stone-200/80 flex items-start gap-3 cursor-pointer hover:border-berry-200 transition-colors shadow-xs"
              >
                <div className="p-2 rounded-lg bg-berry-50 text-berry-700 border border-berry-200 shrink-0 mt-0.5">
                  <Syringe className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-berry-700">
                      Recommended at {vax.ageRecommended}
                    </span>
                    <span className="text-[11px] text-stone-400">Due ~{formatDisplayDate(vax.recordDate)}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-stone-900 truncate">{vax.vaccineName}</h4>
                  <p className="text-xs text-stone-500 truncate mt-0.5">{vax.diseaseTarget}</p>
                </div>
              </div>
            ))}

            {upcomingVaccines.length === 0 && upcomingAppts.length === 0 && (
              <div className="p-6 text-center rounded-xl bg-white border border-stone-200 text-stone-400 text-xs">
                No immediate upcoming appointments or vaccines scheduled.
              </div>
            )}
          </div>
        </div>

        {/* Developmental Highlights & Recent Stream */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
              Recent Milestones & Activity
            </h3>
            <button
              onClick={() => setCurrentScreen('timeline')}
              className="text-xs text-berry-700 font-semibold hover:underline"
            >
              Universal Timeline
            </button>
          </div>

          <div className="space-y-2">
            {achievedMilestones.map((m) => (
              <div
                key={m.id}
                onClick={() => openRecordDetail(m)}
                className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 flex items-center justify-between gap-3 cursor-pointer hover:bg-amber-100/60 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-stone-900 truncate">{m.title}</h4>
                    {m.parentNotes && (
                      <p className="text-[11px] text-stone-600 truncate italic">"{m.parentNotes}"</p>
                    )}
                  </div>
                </div>
                <span className="text-[11px] text-amber-800 font-medium shrink-0">
                  {m.recordDate ? formatDisplayDate(m.recordDate) : 'Achieved'}
                </span>
              </div>
            ))}

            {/* Recent records activity list */}
            <div className="pt-2">
              <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1.5">
                Latest Entries
              </p>
              <div className="space-y-1.5">
                {recentActivity.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => openRecordDetail(r)}
                    className="p-2.5 rounded-lg bg-white border border-stone-200/60 flex items-center justify-between text-xs cursor-pointer hover:bg-stone-50"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-berry-600 shrink-0" />
                      <span className="font-medium text-stone-800 truncate">
                        {(r as any).title || (r as any).vaccineName || r.recordType}
                      </span>
                    </div>
                    <span className="text-stone-400 text-[11px] shrink-0">
                      {formatDisplayDate((r as any).recordDate || (r as any).date || r.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
