/**
 * Format date to YYYY-MM-DD
 */
export function formatDate(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format time to HH:mm:ss
 */
export function formatTime(date: Date = new Date()): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

/**
 * Format date to Indonesian locale
 */
export function formatDateIndonesian(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return date.toLocaleDateString('id-ID', options);
}

/**
 * Format time to HH:mm
 */
export function formatTimeShort(date: Date = new Date()): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Parse time string (HH:mm) to Date
 */
export function parseTime(timeStr: string): Date {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

/**
 * Check if current time is within time range
 */
export function isTimeInRange(
  currentTime: Date,
  startTime: Date,
  endTime: Date
): boolean {
  return currentTime >= startTime && currentTime <= endTime;
}

/**
 * Calculate difference between two times in minutes
 */
export function getTimeDifferenceMinutes(
  time1: Date,
  time2: Date
): number {
  const diffMs = Math.abs(time1.getTime() - time2.getTime());
  return Math.floor(diffMs / (1000 * 60));
}
