// UK-WHO Growth Charts reference data (0 to 24 months)
// Based on WHO Child Growth Standards (2006) as adopted in the UK Personal Child Health Record (Red Book)
// UK Red Book standard centiles: 0.4th, 2nd, 9th, 25th, 50th, 75th, 91st, 98th, 99.6th

export interface CentileDataPoint {
  ageMonths: number;
  p04: number; // 0.4th centile (Z = -2.67)
  p2: number;  // 2nd centile (Z = -2.05)
  p9: number;  // 9th centile (Z = -1.34)
  p25: number; // 25th centile (Z = -0.67)
  p50: number; // 50th centile (Median, Z = 0)
  p75: number; // 75th centile (Z = +0.67)
  p91: number; // 91st centile (Z = +1.34)
  p98: number; // 98th centile (Z = +2.05)
  p996: number;// 99.6th centile (Z = +2.67)
}

// Boys Weight-for-Age (kg)
export const BOYS_WEIGHT: CentileDataPoint[] = [
  { ageMonths: 0,  p04: 2.1, p2: 2.5, p9: 2.9, p25: 3.1, p50: 3.3, p75: 3.7, p91: 4.0, p98: 4.3, p996: 4.8 },
  { ageMonths: 1,  p04: 3.0, p2: 3.4, p9: 3.9, p25: 4.2, p50: 4.5, p75: 4.9, p91: 5.4, p98: 5.7, p996: 6.2 },
  { ageMonths: 2,  p04: 3.8, p2: 4.3, p9: 4.9, p25: 5.3, p50: 5.6, p75: 6.1, p91: 6.6, p98: 7.0, p996: 7.5 },
  { ageMonths: 3,  p04: 4.5, p2: 5.0, p9: 5.7, p25: 6.1, p50: 6.4, p75: 7.0, p91: 7.5, p98: 8.0, p996: 8.5 },
  { ageMonths: 4,  p04: 5.1, p2: 5.6, p9: 6.3, p25: 6.7, p50: 7.0, p75: 7.6, p91: 8.2, p98: 8.7, p996: 9.3 },
  { ageMonths: 5,  p04: 5.5, p2: 6.1, p9: 6.8, p25: 7.2, p50: 7.5, p75: 8.2, p91: 8.8, p98: 9.3, p996: 10.0 },
  { ageMonths: 6,  p04: 5.9, p2: 6.5, p9: 7.2, p25: 7.6, p50: 7.9, p75: 8.6, p91: 9.3, p98: 9.8, p996: 10.5 },
  { ageMonths: 7,  p04: 6.2, p2: 6.8, p9: 7.5, p25: 8.0, p50: 8.3, p75: 9.0, p91: 9.7, p98: 10.3, p996: 11.0 },
  { ageMonths: 8,  p04: 6.5, p2: 7.1, p9: 7.8, p25: 8.3, p50: 8.6, p75: 9.3, p91: 10.0, p98: 10.6, p996: 11.4 },
  { ageMonths: 9,  p04: 6.7, p2: 7.3, p9: 8.1, p25: 8.6, p50: 8.9, p75: 9.6, p91: 10.4, p98: 11.0, p996: 11.8 },
  { ageMonths: 10, p04: 6.9, p2: 7.5, p9: 8.3, p25: 8.8, p50: 9.2, p75: 9.9, p91: 10.7, p98: 11.3, p996: 12.1 },
  { ageMonths: 11, p04: 7.1, p2: 7.7, p9: 8.5, p25: 9.0, p50: 9.4, p75: 10.1, p91: 10.9, p98: 11.5, p996: 12.4 },
  { ageMonths: 12, p04: 7.3, p2: 7.9, p9: 8.7, p25: 9.2, p50: 9.6, p75: 10.4, p91: 11.2, p98: 11.8, p996: 12.7 },
  { ageMonths: 15, p04: 7.8, p2: 8.4, p9: 9.2, p25: 9.8, p50: 10.3, p75: 11.1, p91: 11.9, p98: 12.6, p996: 13.5 },
  { ageMonths: 18, p04: 8.2, p2: 8.9, p9: 9.8, p25: 10.4, p50: 10.9, p75: 11.7, p91: 12.6, p98: 13.3, p996: 14.3 },
  { ageMonths: 21, p04: 8.7, p2: 9.4, p9: 10.3, p25: 10.9, p50: 11.5, p75: 12.4, p91: 13.3, p98: 14.1, p996: 15.1 },
  { ageMonths: 24, p04: 9.1, p2: 9.8, p9: 10.8, p25: 11.5, p50: 12.2, p75: 13.0, p91: 14.0, p98: 14.8, p996: 15.9 },
];

// Girls Weight-for-Age (kg)
export const GIRLS_WEIGHT: CentileDataPoint[] = [
  { ageMonths: 0,  p04: 2.0, p2: 2.4, p9: 2.8, p25: 3.0, p50: 3.2, p75: 3.5, p91: 3.8, p98: 4.2, p996: 4.6 },
  { ageMonths: 1,  p04: 2.8, p2: 3.2, p9: 3.6, p25: 3.9, p50: 4.2, p75: 4.6, p91: 5.0, p98: 5.4, p996: 5.9 },
  { ageMonths: 2,  p04: 3.6, p2: 4.0, p9: 4.5, p25: 4.9, p50: 5.1, p75: 5.6, p91: 6.1, p98: 6.6, p996: 7.1 },
  { ageMonths: 3,  p04: 4.2, p2: 4.7, p9: 5.2, p25: 5.6, p50: 5.8, p75: 6.4, p91: 7.0, p98: 7.5, p996: 8.1 },
  { ageMonths: 4,  p04: 4.7, p2: 5.2, p9: 5.8, p25: 6.2, p50: 6.4, p75: 7.0, p91: 7.6, p98: 8.2, p996: 8.8 },
  { ageMonths: 5,  p04: 5.1, p2: 5.7, p9: 6.3, p25: 6.7, p50: 6.9, p75: 7.6, p91: 8.2, p98: 8.8, p996: 9.5 },
  { ageMonths: 6,  p04: 5.5, p2: 6.0, p9: 6.7, p25: 7.1, p50: 7.3, p75: 8.0, p91: 8.7, p98: 9.3, p996: 10.0 },
  { ageMonths: 7,  p04: 5.8, p2: 6.3, p9: 7.0, p25: 7.4, p50: 7.6, p75: 8.4, p91: 9.1, p98: 9.8, p996: 10.5 },
  { ageMonths: 8,  p04: 6.0, p2: 6.6, p9: 7.3, p25: 7.7, p50: 7.9, p75: 8.7, p91: 9.5, p98: 10.2, p996: 10.9 },
  { ageMonths: 9,  p04: 6.3, p2: 6.8, p9: 7.5, p25: 8.0, p50: 8.2, p75: 9.0, p91: 9.8, p98: 10.5, p996: 11.3 },
  { ageMonths: 10, p04: 6.5, p2: 7.0, p9: 7.7, p25: 8.2, p50: 8.5, p75: 9.3, p91: 10.1, p98: 10.9, p996: 11.7 },
  { ageMonths: 11, p04: 6.7, p2: 7.2, p9: 7.9, p25: 8.4, p50: 8.7, p75: 9.6, p91: 10.4, p98: 11.2, p996: 12.0 },
  { ageMonths: 12, p04: 6.8, p2: 7.4, p9: 8.1, p25: 8.6, p50: 8.9, p75: 9.8, p91: 10.7, p98: 11.5, p996: 12.3 },
  { ageMonths: 15, p04: 7.3, p2: 7.9, p9: 8.7, p25: 9.2, p50: 9.6, p75: 10.5, p91: 11.4, p98: 12.3, p996: 13.2 },
  { ageMonths: 18, p04: 7.7, p2: 8.4, p9: 9.2, p25: 9.8, p50: 10.2, p75: 11.1, p91: 12.1, p98: 13.0, p996: 14.0 },
  { ageMonths: 21, p04: 8.1, p2: 8.9, p9: 9.7, p25: 10.3, p50: 10.9, p75: 11.8, p91: 12.8, p98: 13.7, p996: 14.8 },
  { ageMonths: 24, p04: 8.5, p2: 9.3, p9: 10.2, p25: 10.8, p50: 11.5, p75: 12.5, p91: 13.5, p98: 14.5, p996: 15.6 },
];

// Boys Length-for-Age (cm)
export const BOYS_LENGTH: CentileDataPoint[] = [
  { ageMonths: 0,  p04: 45.0, p2: 46.3, p9: 47.9, p25: 48.9, p50: 49.9, p75: 51.0, p91: 52.0, p98: 53.4, p996: 54.8 },
  { ageMonths: 1,  p04: 49.6, p2: 51.0, p9: 52.7, p25: 53.7, p50: 54.7, p75: 55.9, p91: 57.0, p98: 58.4, p996: 59.8 },
  { ageMonths: 2,  p04: 53.5, p2: 54.9, p9: 56.6, p25: 57.6, p50: 58.4, p75: 59.8, p91: 61.0, p98: 62.4, p996: 63.8 },
  { ageMonths: 3,  p04: 56.5, p2: 57.9, p9: 59.7, p25: 60.7, p50: 61.4, p75: 62.9, p91: 64.1, p98: 65.5, p996: 67.0 },
  { ageMonths: 4,  p04: 59.0, p2: 60.4, p9: 62.2, p25: 63.3, p50: 63.9, p75: 65.4, p91: 66.7, p98: 68.2, p996: 69.7 },
  { ageMonths: 5,  p04: 61.0, p2: 62.4, p9: 64.3, p25: 65.4, p50: 65.9, p75: 67.6, p91: 68.9, p98: 70.4, p996: 72.0 },
  { ageMonths: 6,  p04: 62.7, p2: 64.1, p9: 66.0, p25: 67.1, p50: 67.6, p75: 69.3, p91: 70.7, p98: 72.3, p996: 73.9 },
  { ageMonths: 8,  p04: 65.5, p2: 67.0, p9: 69.0, p25: 70.2, p50: 70.6, p75: 72.4, p91: 73.9, p98: 75.5, p996: 77.2 },
  { ageMonths: 10, p04: 68.0, p2: 69.5, p9: 71.6, p25: 72.8, p50: 73.3, p75: 75.1, p91: 76.7, p98: 78.4, p996: 80.2 },
  { ageMonths: 12, p04: 70.2, p2: 71.8, p9: 73.9, p25: 75.2, p50: 75.7, p75: 77.6, p91: 79.3, p98: 81.1, p996: 82.9 },
  { ageMonths: 18, p04: 76.2, p2: 78.0, p9: 80.3, p25: 81.7, p50: 82.3, p75: 84.4, p91: 86.3, p98: 88.3, p996: 90.3 },
  { ageMonths: 24, p04: 81.4, p2: 83.3, p9: 85.8, p25: 87.3, p50: 87.8, p75: 90.1, p91: 92.2, p98: 94.4, p996: 96.6 },
];

// Girls Length-for-Age (cm)
export const GIRLS_LENGTH: CentileDataPoint[] = [
  { ageMonths: 0,  p04: 44.2, p2: 45.4, p9: 47.1, p25: 48.2, p50: 49.1, p75: 50.2, p91: 51.2, p98: 52.7, p996: 54.0 },
  { ageMonths: 1,  p04: 48.6, p2: 49.9, p9: 51.7, p25: 52.7, p50: 53.7, p75: 54.9, p91: 56.0, p98: 57.4, p996: 58.8 },
  { ageMonths: 2,  p04: 52.2, p2: 53.6, p9: 55.4, p25: 56.4, p50: 57.1, p75: 58.5, p91: 59.7, p98: 61.2, p996: 62.6 },
  { ageMonths: 3,  p04: 55.0, p2: 56.4, p9: 58.3, p25: 59.3, p50: 59.8, p75: 61.3, p91: 62.6, p98: 64.1, p996: 65.6 },
  { ageMonths: 4,  p04: 57.3, p2: 58.7, p9: 60.7, p25: 61.7, p50: 62.1, p75: 63.7, p91: 65.1, p98: 66.6, p996: 68.2 },
  { ageMonths: 5,  p04: 59.2, p2: 60.6, p9: 62.7, p25: 63.7, p50: 64.0, p75: 65.7, p91: 67.2, p98: 68.8, p996: 70.4 },
  { ageMonths: 6,  p04: 60.8, p2: 62.2, p9: 64.3, p25: 65.3, p50: 65.7, p75: 67.4, p91: 69.0, p98: 70.6, p996: 72.3 },
  { ageMonths: 8,  p04: 63.6, p2: 65.1, p9: 67.2, p25: 68.3, p50: 68.7, p75: 70.5, p91: 72.2, p98: 73.9, p996: 75.7 },
  { ageMonths: 10, p04: 66.1, p2: 67.6, p9: 69.8, p25: 70.9, p50: 71.5, p75: 73.3, p91: 75.1, p98: 76.9, p996: 78.8 },
  { ageMonths: 12, p04: 68.3, p2: 69.9, p9: 72.1, p25: 73.3, p50: 74.0, p75: 75.9, p91: 77.8, p98: 79.7, p996: 81.7 },
  { ageMonths: 18, p04: 74.4, p2: 76.2, p9: 78.6, p25: 79.9, p50: 80.7, p75: 82.8, p91: 84.9, p98: 87.0, p996: 89.2 },
  { ageMonths: 24, p04: 79.8, p2: 81.7, p9: 84.3, p25: 85.7, p50: 86.4, p75: 88.8, p91: 91.0, p98: 93.2, p996: 95.5 },
];

// Boys Head Circumference-for-Age (cm)
export const BOYS_HEAD_CIRC: CentileDataPoint[] = [
  { ageMonths: 0,  p04: 31.9, p2: 32.7, p9: 33.7, p25: 34.3, p50: 34.5, p75: 35.3, p91: 36.1, p98: 36.9, p996: 37.8 },
  { ageMonths: 1,  p04: 34.6, p2: 35.4, p9: 36.4, p25: 37.0, p50: 37.3, p75: 38.1, p91: 38.9, p98: 39.7, p996: 40.5 },
  { ageMonths: 2,  p04: 36.5, p2: 37.3, p9: 38.3, p25: 38.9, p50: 39.1, p75: 40.0, p91: 40.8, p98: 41.6, p996: 42.4 },
  { ageMonths: 3,  p04: 38.0, p2: 38.7, p9: 39.8, p25: 40.4, p50: 40.5, p75: 41.4, p91: 42.2, p98: 43.0, p996: 43.8 },
  { ageMonths: 4,  p04: 39.1, p2: 39.8, p9: 40.9, p25: 41.5, p50: 41.6, p75: 42.5, p91: 43.3, p98: 44.1, p996: 44.9 },
  { ageMonths: 6,  p04: 40.7, p2: 41.5, p9: 42.5, p25: 43.1, p50: 43.3, p75: 44.2, p91: 45.0, p98: 45.8, p996: 46.7 },
  { ageMonths: 9,  p04: 42.4, p2: 43.1, p9: 44.2, p25: 44.8, p50: 45.0, p75: 45.9, p91: 46.8, p98: 47.6, p996: 48.5 },
  { ageMonths: 12, p04: 43.4, p2: 44.2, p9: 45.2, p25: 45.8, p50: 46.1, p75: 47.0, p91: 47.9, p98: 48.7, p996: 49.6 },
  { ageMonths: 18, p04: 44.8, p2: 45.5, p9: 46.6, p25: 47.2, p50: 47.4, p75: 48.4, p91: 49.3, p98: 50.2, p996: 51.1 },
  { ageMonths: 24, p04: 45.8, p2: 46.5, p9: 47.5, p25: 48.2, p50: 48.3, p75: 49.3, p91: 50.2, p98: 51.1, p996: 52.0 },
];

// Girls Head Circumference-for-Age (cm)
export const GIRLS_HEAD_CIRC: CentileDataPoint[] = [
  { ageMonths: 0,  p04: 31.4, p2: 32.2, p9: 33.2, p25: 33.8, p50: 33.9, p75: 34.7, p91: 35.5, p98: 36.3, p996: 37.1 },
  { ageMonths: 1,  p04: 33.9, p2: 34.7, p9: 35.7, p25: 36.3, p50: 36.5, p75: 37.3, p91: 38.1, p98: 38.9, p996: 39.7 },
  { ageMonths: 2,  p04: 35.6, p2: 36.4, p9: 37.4, p25: 38.0, p50: 38.3, p75: 39.1, p91: 40.0, p98: 40.8, p996: 41.6 },
  { ageMonths: 3,  p04: 37.0, p2: 37.8, p9: 38.8, p25: 39.4, p50: 39.5, p75: 40.4, p91: 41.3, p98: 42.1, p996: 42.9 },
  { ageMonths: 4,  p04: 38.0, p2: 38.8, p9: 39.8, p25: 40.5, p50: 40.6, p75: 41.5, p91: 42.4, p98: 43.2, p996: 44.0 },
  { ageMonths: 6,  p04: 39.6, p2: 40.4, p9: 41.4, p25: 42.0, p50: 42.2, p75: 43.1, p91: 44.0, p98: 44.8, p996: 45.7 },
  { ageMonths: 9,  p04: 41.2, p2: 42.0, p9: 43.0, p25: 43.7, p50: 43.8, p75: 44.8, p91: 45.7, p98: 46.5, p996: 47.4 },
  { ageMonths: 12, p04: 42.3, p2: 43.1, p9: 44.1, p25: 44.7, p50: 44.9, p75: 45.9, p91: 46.8, p98: 47.7, p996: 48.6 },
  { ageMonths: 18, p04: 43.7, p2: 44.5, p9: 45.5, p25: 46.1, p50: 46.2, p75: 47.3, p91: 48.2, p98: 49.1, p996: 50.0 },
  { ageMonths: 24, p04: 44.6, p2: 45.4, p9: 46.5, p25: 47.1, p50: 47.2, p75: 48.2, p91: 49.2, p98: 50.1, p996: 51.0 },
];

export function getCentileReference(metric: 'weight' | 'length' | 'head', sex: 'male' | 'female'): CentileDataPoint[] {
  if (metric === 'weight') {
    return sex === 'male' ? BOYS_WEIGHT : GIRLS_WEIGHT;
  }
  if (metric === 'length') {
    return sex === 'male' ? BOYS_LENGTH : GIRLS_LENGTH;
  }
  return sex === 'male' ? BOYS_HEAD_CIRC : GIRLS_HEAD_CIRC;
}

// Function to estimate centile for a given measurement
export function estimateCentile(
  metric: 'weight' | 'length' | 'head',
  sex: 'male' | 'female',
  ageMonths: number,
  value: number
): { centileText: string; bandColor: string; description: string } {
  const dataset = getCentileReference(metric, sex);
  if (!dataset || dataset.length === 0 || value <= 0) {
    return { centileText: 'N/A', bandColor: 'text-stone-500', description: 'Invalid or missing value' };
  }

  // Find surrounding age bracket
  let p = dataset[0];
  for (let i = 0; i < dataset.length; i++) {
    if (dataset[i].ageMonths <= ageMonths) {
      p = dataset[i];
    } else {
      break;
    }
  }

  if (value < p.p04) {
    return { centileText: '< 0.4th centile', bandColor: 'text-amber-600', description: 'Below the 0.4th centile line' };
  } else if (value < p.p2) {
    return { centileText: '0.4th - 2nd centile', bandColor: 'text-stone-700', description: 'Between 0.4th and 2nd centile' };
  } else if (value < p.p9) {
    return { centileText: '2nd - 9th centile', bandColor: 'text-stone-700', description: 'Between 2nd and 9th centile' };
  } else if (value < p.p25) {
    return { centileText: '9th - 25th centile', bandColor: 'text-stone-700', description: 'Between 9th and 25th centile' };
  } else if (value < p.p75) {
    return { centileText: '25th - 75th centile (Average)', bandColor: 'text-emerald-700 font-medium', description: 'Close to the 50th centile median' };
  } else if (value < p.p91) {
    return { centileText: '75th - 91st centile', bandColor: 'text-stone-700', description: 'Between 75th and 91st centile' };
  } else if (value < p.p98) {
    return { centileText: '91st - 98th centile', bandColor: 'text-stone-700', description: 'Between 91st and 98th centile' };
  } else if (value <= p.p996) {
    return { centileText: '98th - 99.6th centile', bandColor: 'text-stone-700', description: 'Between 98th and 99.6th centile' };
  } else {
    return { centileText: '> 99.6th centile', bandColor: 'text-amber-600', description: 'Above the 99.6th centile line' };
  }
}
