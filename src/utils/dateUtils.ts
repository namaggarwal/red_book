export function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, month, day);
      return d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function formatTime(timeStr?: string): string {
  if (!timeStr) return '';
  return timeStr;
}

export interface DetailedAge {
  years: number;
  months: number;
  weeks: number;
  days: number;
  totalDays: number;
  totalMonthsFloat: number;
  formattedPrimary: string; // e.g. "6 months, 2 days" or "8 weeks, 4 days"
  formattedShort: string; // e.g. "6m 2d"
}

export function calculateChildAge(dobString: string, targetDateStr?: string): DetailedAge {
  if (!dobString) {
    return {
      years: 0,
      months: 0,
      weeks: 0,
      days: 0,
      totalDays: 0,
      totalMonthsFloat: 0,
      formattedPrimary: '0 days',
      formattedShort: '0d',
    };
  }

  const birth = new Date(dobString);
  const target = targetDateStr ? new Date(targetDateStr) : new Date();

  // Reset time portions for accurate date arithmetic
  const b = new Date(birth.getFullYear(), birth.getMonth(), birth.getDate());
  const t = new Date(target.getFullYear(), target.getMonth(), target.getDate());

  const diffMs = t.getTime() - b.getTime();
  const totalDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  const totalMonthsFloat = totalDays / 30.4375;

  let years = t.getFullYear() - b.getFullYear();
  let months = t.getMonth() - b.getMonth();
  let days = t.getDate() - b.getDate();

  if (days < 0) {
    months -= 1;
    // Days in previous month of target
    const prevMonthDays = new Date(t.getFullYear(), t.getMonth(), 0).getDate();
    days += prevMonthDays;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const totalWeeks = Math.floor(totalDays / 7);
  const remainingDays = totalDays % 7;

  let formattedPrimary = '';
  let formattedShort = '';

  if (totalDays < 28) {
    // Under 4 weeks: show in days or weeks
    if (totalWeeks === 0) {
      formattedPrimary = `${totalDays} ${totalDays === 1 ? 'day' : 'days'}`;
      formattedShort = `${totalDays}d`;
    } else {
      formattedPrimary = `${totalWeeks} ${totalWeeks === 1 ? 'wk' : 'wks'}${remainingDays > 0 ? `, ${remainingDays} d` : ''}`;
      formattedShort = `${totalWeeks}w ${remainingDays}d`;
    }
  } else if (years < 1) {
    // Under 1 year: show months and days (and weeks in secondary)
    formattedPrimary = `${months} ${months === 1 ? 'month' : 'months'}${days > 0 ? `, ${days} d` : ''}`;
    formattedShort = `${months}m ${days}d`;
  } else if (years < 2) {
    // 1 to 2 years: show months or years + months
    const totalMonths = years * 12 + months;
    formattedPrimary = `${years} yr ${months} ${months === 1 ? 'mo' : 'mos'}`;
    formattedShort = `${totalMonths}m`;
  } else {
    // 2+ years: show years and months
    formattedPrimary = `${years} ${years === 1 ? 'year' : 'years'}${months > 0 ? `, ${months} mo` : ''}`;
    formattedShort = `${years}y ${months}m`;
  }

  return {
    years,
    months,
    weeks: totalWeeks,
    days,
    totalDays,
    totalMonthsFloat,
    formattedPrimary,
    formattedShort,
  };
}
