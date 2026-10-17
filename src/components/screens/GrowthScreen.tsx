import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GrowthRecord } from '../../types';
import { getCentileReference, estimateCentile } from '../../data/ukWhoCentiles';
import { formatDisplayDate } from '../../utils/dateUtils';
import {
  TrendingUp,
  Plus,
  Info,
  Calendar,
  User,
  Scale,
  Ruler,
  CircleDot,
  FileSpreadsheet,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

export const GrowthScreen: React.FC = () => {
  const { profile, records, openQuickAdd, openRecordDetail } = useApp();
  const [activeMetric, setActiveMetric] = useState<'weight' | 'length' | 'head'>('weight');
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');

  if (!profile) return null;

  const sex = profile.sex || 'female';
  const centileReference = getCentileReference(activeMetric, sex);

  // All growth records
  const growthRecords = records
    .filter((r): r is GrowthRecord => r.recordType === 'growth')
    .sort((a, b) => new Date(a.recordDate).getTime() - new Date(b.recordDate).getTime());

  // Prepare combined chart data aligning child measurements with reference age brackets
  const chartPoints: any[] = centileReference.map((ref) => {
    // Find closest measurement within +/- 0.5 months of this bracket or exact
    const matchingRec = growthRecords.find((rec) => {
      const birth = new Date(profile.dob);
      const measured = new Date(rec.recordDate);
      const ageMonths = (measured.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24 * 30.4375);
      return Math.abs(ageMonths - ref.ageMonths) < 0.6;
    });

    let babyVal = null;
    let babyDate = null;
    let babySource = null;
    let babyNotes = null;

    if (matchingRec) {
      if (activeMetric === 'weight') babyVal = matchingRec.weightKg;
      else if (activeMetric === 'length') babyVal = matchingRec.lengthCm;
      else if (activeMetric === 'head') babyVal = matchingRec.headCircumferenceCm;

      babyDate = matchingRec.recordDate;
      babySource = matchingRec.source;
      babyNotes = matchingRec.notes;
    }

    return {
      ageMonths: ref.ageMonths,
      ageLabel: `${ref.ageMonths}m`,
      p04: ref.p04,
      p2: ref.p2,
      p9: ref.p9,
      p25: ref.p25,
      p50: ref.p50,
      p75: ref.p75,
      p91: ref.p91,
      p98: ref.p98,
      p996: ref.p996,
      babyValue: babyVal,
      babyDate,
      babySource,
      babyNotes,
    };
  });

  const getMetricLabel = () => {
    switch (activeMetric) {
      case 'weight':
        return { name: 'Weight', unit: 'kg', icon: Scale };
      case 'length':
        return { name: 'Length / Height', unit: 'cm', icon: Ruler };
      case 'head':
        return { name: 'Head Circumference', unit: 'cm', icon: CircleDot };
    }
  };

  const currentMetricInfo = getMetricLabel();

  return (
    <div className="space-y-6 pb-20">
      {/* Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-stone-900">
              Growth & Centiles
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-md font-bold uppercase tracking-wider bg-berry-100 text-berry-800">
              UK-WHO Standard
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Plotted against UK 0–24 months reference centiles for {profile.preferredName} ({sex === 'female' ? 'Girls' : 'Boys'})
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle chart vs table */}
          <div className="bg-stone-100 p-1 rounded-xl flex items-center text-xs font-semibold">
            <button
              onClick={() => setViewMode('chart')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                viewMode === 'chart'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              Chart View
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              Table View
            </button>
          </div>

          <button
            onClick={() => openQuickAdd('growth')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-berry-700 hover:bg-berry-800 text-white font-semibold text-xs sm:text-sm shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Measurement</span>
          </button>
        </div>
      </div>

      {/* Metric Selector Tabs */}
      <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-stone-100/90 border border-stone-200">
        <button
          onClick={() => setActiveMetric('weight')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeMetric === 'weight'
              ? 'bg-white text-berry-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Scale className="w-4 h-4 text-berry-700" />
          <span>Weight (kg)</span>
        </button>
        <button
          onClick={() => setActiveMetric('length')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeMetric === 'length'
              ? 'bg-white text-berry-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Ruler className="w-4 h-4 text-berry-700" />
          <span>Length (cm)</span>
        </button>
        <button
          onClick={() => setActiveMetric('head')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeMetric === 'head'
              ? 'bg-white text-berry-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <CircleDot className="w-4 h-4 text-berry-700" />
          <span>Head Circ (cm)</span>
        </button>
      </div>

      {viewMode === 'chart' ? (
        /* Interactive UK-WHO Chart */
        <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-base font-bold text-stone-900">
                {currentMetricInfo.name} vs Age
              </h3>
              <p className="text-xs text-stone-500">
                UK-WHO Reference Lines: 0.4th, 9th, 50th (median), 91st, 99.6th centiles
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs text-stone-600">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-berry-700 inline-block" />
                <span className="font-semibold text-stone-900">{profile.preferredName}'s Measurements</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-0.5 bg-stone-400 inline-block" />
                <span>Reference Centiles</span>
              </span>
            </div>
          </div>

          <div className="h-80 sm:h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartPoints} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
                <XAxis
                  dataKey="ageLabel"
                  stroke="#78716c"
                  fontSize={12}
                  tickLine={false}
                  label={{ value: 'Age in Months', position: 'insideBottom', offset: -10, fontSize: 11 }}
                />
                <YAxis
                  stroke="#78716c"
                  fontSize={12}
                  domain={['auto', 'auto']}
                  tickLine={false}
                  label={{
                    value: `${currentMetricInfo.name} (${currentMetricInfo.unit})`,
                    angle: -90,
                    position: 'insideLeft',
                    offset: 15,
                    fontSize: 11,
                  }}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      const babyVal = data.babyValue;
                      return (
                        <div className="bg-white p-3 rounded-xl shadow-lg border border-stone-200 text-xs space-y-1.5">
                          <p className="font-bold text-stone-900 border-b border-stone-100 pb-1">
                            Age: {label}
                          </p>
                          {babyVal !== null ? (
                            <div className="space-y-1">
                              <p className="font-extrabold text-berry-700 text-sm">
                                Measured: {babyVal} {currentMetricInfo.unit}
                              </p>
                              {data.babyDate && (
                                <p className="text-stone-500">Date: {formatDisplayDate(data.babyDate)}</p>
                              )}
                              {data.babySource && (
                                <p className="text-stone-500 capitalize">Source: {data.babySource.replace('_', ' ')}</p>
                              )}
                              {data.babyNotes && (
                                <p className="text-stone-600 italic">"{data.babyNotes}"</p>
                              )}
                            </div>
                          ) : (
                            <p className="text-stone-400 italic">No measurement at this milestone</p>
                          )}
                          <div className="pt-1.5 border-t border-stone-100 text-[11px] text-stone-500 space-y-0.5">
                            <div className="flex justify-between gap-4">
                              <span>99.6th centile:</span>
                              <span className="font-mono">{data.p996}</span>
                            </div>
                            <div className="flex justify-between gap-4 font-semibold text-stone-700">
                              <span>50th centile (Median):</span>
                              <span className="font-mono">{data.p50}</span>
                            </div>
                            <div className="flex justify-between gap-4">
                              <span>0.4th centile:</span>
                              <span className="font-mono">{data.p04}</span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                {/* UK-WHO Centile Reference Curves */}
                <Line type="monotone" dataKey="p996" stroke="#d6d3d1" strokeDasharray="3 3" dot={false} strokeWidth={1} name="99.6th" />
                <Line type="monotone" dataKey="p91" stroke="#cbd5e1" dot={false} strokeWidth={1} name="91st" />
                <Line type="monotone" dataKey="p50" stroke="#94a3b8" strokeWidth={1.5} dot={false} name="50th (Median)" />
                <Line type="monotone" dataKey="p9" stroke="#cbd5e1" dot={false} strokeWidth={1} name="9th" />
                <Line type="monotone" dataKey="p04" stroke="#d6d3d1" strokeDasharray="3 3" dot={false} strokeWidth={1} name="0.4th" />

                {/* Actual Baby Measurements as bold line with large points */}
                <Line
                  type="monotone"
                  dataKey="babyValue"
                  stroke="#8e203e"
                  strokeWidth={3}
                  connectNulls={true}
                  dot={{ r: 5, fill: '#8e203e', stroke: '#fff', strokeWidth: 2 }}
                  activeDot={{ r: 7, fill: '#641c31' }}
                  name={`${profile.preferredName}'s ${currentMetricInfo.name}`}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Centile guidance note */}
          <div className="mt-4 p-3 rounded-xl bg-ivory-50 border border-stone-200 text-xs text-stone-600 flex items-start gap-2">
            <Info className="w-4 h-4 text-berry-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-stone-800">Understanding UK-WHO Centiles: </span>
              Centile lines show the pattern healthy children typically follow. About half of children are above the 50th centile line and half below. Tracking steadily along roughly the same centile band is usually what health visitors look for.
            </div>
          </div>
        </div>
      ) : (
        /* Measurement History Table */
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-stone-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-900">Recorded Measurements Table</h3>
            <span className="text-xs text-stone-500">{growthRecords.length} records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Age at Measurement</th>
                  <th className="py-3 px-4">Weight (kg)</th>
                  <th className="py-3 px-4">Centile</th>
                  <th className="py-3 px-4">Length (cm)</th>
                  <th className="py-3 px-4">Head Circ (cm)</th>
                  <th className="py-3 px-4">Source</th>
                  <th className="py-3 px-4">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {growthRecords.map((r) => {
                  const birth = new Date(profile.dob);
                  const measured = new Date(r.recordDate);
                  const ageMonths = (measured.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24 * 30.4375);
                  const centileInfo =
                    r.weightKg && r.weightKg > 0
                      ? estimateCentile('weight', sex, ageMonths, r.weightKg)
                      : null;

                  return (
                    <tr
                      key={r.id}
                      onClick={() => openRecordDetail(r)}
                      className="hover:bg-berry-50/40 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 font-semibold text-stone-900">
                        {formatDisplayDate(r.recordDate)}
                      </td>
                      <td className="py-3 px-4 text-stone-600">
                        {Math.max(0, ageMonths).toFixed(1)} mos
                      </td>
                      <td className="py-3 px-4 font-bold text-stone-900">
                        {r.weightKg ? `${r.weightKg} kg` : '—'}
                      </td>
                      <td className="py-3 px-4">
                        {centileInfo ? (
                          <span className={`font-semibold ${centileInfo.bandColor}`}>
                            {centileInfo.centileText}
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="py-3 px-4 text-stone-700">
                        {r.lengthCm ? `${r.lengthCm} cm` : '—'}
                      </td>
                      <td className="py-3 px-4 text-stone-700">
                        {r.headCircumferenceCm ? `${r.headCircumferenceCm} cm` : '—'}
                      </td>
                      <td className="py-3 px-4 capitalize text-stone-600">
                        {r.source?.replace('_', ' ') || 'Parent'}
                      </td>
                      <td className="py-3 px-4 text-stone-500 max-w-xs truncate">
                        {r.notes || '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Chronological Record Cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
          All Measurement Logs
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {growthRecords.map((r) => (
            <div
              key={r.id}
              onClick={() => openRecordDetail(r)}
              className="p-4 rounded-xl bg-white border border-stone-200/80 hover:border-berry-300 shadow-xs cursor-pointer transition-all space-y-2"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-900">
                  {formatDisplayDate(r.recordDate)}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-semibold capitalize text-[11px]">
                  {r.source ? r.source.replace('_', ' ') : 'Parent'}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs">
                {r.weightKg && (
                  <div>
                    <span className="text-stone-500 block text-[11px]">Weight</span>
                    <span className="font-extrabold text-stone-900">{r.weightKg} kg</span>
                  </div>
                )}
                {r.lengthCm && (
                  <div>
                    <span className="text-stone-500 block text-[11px]">Length</span>
                    <span className="font-extrabold text-stone-900">{r.lengthCm} cm</span>
                  </div>
                )}
                {r.headCircumferenceCm && (
                  <div>
                    <span className="text-stone-500 block text-[11px]">Head Circ</span>
                    <span className="font-extrabold text-stone-900">{r.headCircumferenceCm} cm</span>
                  </div>
                )}
              </div>
              {r.notes && (
                <p className="text-xs text-stone-600 italic bg-stone-50 p-2 rounded-lg">
                  "{r.notes}"
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
