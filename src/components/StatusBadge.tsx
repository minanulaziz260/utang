import { AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import type { DebtStatus } from '../types/debt';
import { getStatusMeta } from '../utils/formatters';

interface StatusBadgeProps {
  status: DebtStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const meta = getStatusMeta(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap ${meta.badgeClass}`}
    >
      {status === 'lunas' && (
        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      )}
      {status === 'terlambat' && (
        <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      )}
      {status === 'belum_lunas' && (
        <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      )}
      <span>{meta.label}</span>
    </span>
  );
}
