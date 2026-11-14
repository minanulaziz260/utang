import type { DebtStatus } from '../types/debt';

const rupiahFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

export function formatRupiah(amount: number): string {
  return rupiahFormatter.format(amount);
}

export function formatDateId(isoDate: string): string {
  if (!isoDate) return '-';
  const parsed = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return isoDate;
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parsed);
}

export function formatDateSlash(isoDate: string): string {
  if (!isoDate) return '-';
  const [year, month, day] = isoDate.split('-');
  if (!year || !month || !day) return isoDate;
  return `${day}/${month}/${year}`;
}

export function addMonthsToIsoDate(
  isoDate: string,
  monthsToAdd: number
): string {
  const [yStr, mStr, dStr] = isoDate.split('-');
  const year = Number(yStr);
  const month = Number(mStr);
  const day = Number(dStr);
  if (!year || !month || !day) return isoDate;

  const targetMonthIndex = month - 1 + monthsToAdd;
  const targetYear = year + Math.floor(targetMonthIndex / 12);
  const normalizedMonth = ((targetMonthIndex % 12) + 12) % 12;
  const lastDayOfTargetMonth = new Date(
    targetYear,
    normalizedMonth + 1,
    0
  ).getDate();
  const clampedDay = Math.min(day, lastDayOfTargetMonth);

  return `${targetYear}-${String(normalizedMonth + 1).padStart(2, '0')}-${String(clampedDay).padStart(2, '0')}`;
}

export interface StatusMeta {
  label: string;
  badgeClass: string;
  dotClass: string;
}

export function getStatusMeta(status: DebtStatus): StatusMeta {
  switch (status) {
    case 'lunas':
      return {
        label: 'Sudah Lunas',
        badgeClass: 'bg-emerald-100 text-emerald-900 border border-emerald-200',
        dotClass: 'bg-emerald-700',
      };
    case 'terlambat':
      return {
        label: 'Terlambat',
        badgeClass: 'bg-rose-100 text-rose-900 border border-rose-200',
        dotClass: 'bg-rose-700',
      };
    case 'belum_lunas':
    default:
      return {
        label: 'Belum Lunas',
        badgeClass: 'bg-amber-100 text-amber-900 border border-amber-200',
        dotClass: 'bg-amber-700',
      };
  }
}
