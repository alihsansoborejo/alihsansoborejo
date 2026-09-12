// Utility functions for handling and formatting dates in Indonesian locale

const INDONESIAN_MONTHS: Record<string, string> = {
  januari: '01', feb: '02', februari: '02', mar: '03', maret: '03',
  apr: '04', april: '04', mei: '05', jun: '06', juni: '06',
  jul: '07', juli: '07', ags: '08', agustus: '08', sep: '09', september: '09',
  okt: '10', oktober: '10', nov: '11', november: '11', des: '12', desember: '12'
};

const INDONESIAN_MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

/**
 * Converts any date string (ISO, YYYY-MM-DD, or Indonesian text date) into standard YYYY-MM-DD
 * suitable for HTML <input type="date">.
 */
export function toDateInputValue(dateStr?: string): string {
  if (!dateStr || !dateStr.trim()) {
    return new Date().toISOString().split('T')[0];
  }

  const trimmed = dateStr.trim();

  // Already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }

  // Indonesian text format like "10 Agustus 2024" or "10-08-2024"
  const parts = trimmed.split(/[\s-]+/);
  if (parts.length === 3) {
    // If DD-MM-YYYY format
    if (/^\d{1,2}$/.test(parts[0]) && /^\d{1,2}$/.test(parts[1]) && /^\d{4}$/.test(parts[2])) {
      const day = parts[0].padStart(2, '0');
      const month = parts[1].padStart(2, '0');
      const year = parts[2];
      return `${year}-${month}-${day}`;
    }

    // If "10 Agustus 2024" format
    const day = parts[0].padStart(2, '0');
    const monthKey = parts[1].toLowerCase();
    const month = INDONESIAN_MONTHS[monthKey];
    const year = parts[2];
    if (month && /^\d{4}$/.test(year) && /^\d{2}$/.test(day)) {
      return `${year}-${month}-${day}`;
    }
  }

  // Standard Date parse fallback
  const parsed = new Date(trimmed);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split('T')[0];
  }

  return new Date().toISOString().split('T')[0];
}

/**
 * Formats date into readable Indonesian format, e.g. "12 September 2026".
 * If the input already contains month words, it returns it cleanly.
 */
export function formatDisplayDate(dateStr?: string): string {
  if (!dateStr || !dateStr.trim()) return '';

  const trimmed = dateStr.trim();

  // If already contains Indonesian month names, return as is
  if (/[a-zA-Z]/.test(trimmed)) {
    return trimmed;
  }

  // If YYYY-MM-DD format
  const ymdMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (ymdMatch) {
    const year = parseInt(ymdMatch[1], 10);
    const monthIdx = parseInt(ymdMatch[2], 10) - 1;
    const day = parseInt(ymdMatch[3], 10);
    if (monthIdx >= 0 && monthIdx < 12) {
      return `${day} ${INDONESIAN_MONTH_NAMES[monthIdx]} ${year}`;
    }
  }

  // General Date parsing
  try {
    const d = new Date(trimmed);
    if (!isNaN(d.getTime())) {
      return `${d.getDate()} ${INDONESIAN_MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
    }
  } catch {
    // Fallback to original string
  }

  return trimmed;
}

/**
 * Returns YYYY-MM-DD string offset by N days in the past (e.g. 0 = today, 1 = yesterday, etc.)
 */
export function getDaysAgoDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

/**
 * Safely parse date to unix timestamp for chronological sorting
 */
export function parseDateTimestamp(dateStr?: string): number {
  if (!dateStr) return 0;
  const iso = toDateInputValue(dateStr);
  const time = new Date(iso).getTime();
  return isNaN(time) ? 0 : time;
}
