import { AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import type { DebtStatus } from '../types/debt';
import { getStatusMeta } from '../utils/formatters';
import { Badge } from './ui/badge';

interface StatusBadgeProps {
  status: DebtStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const meta = getStatusMeta(status);
  const variant =
    status === 'lunas'
      ? 'success'
      : status === 'terlambat'
        ? 'destructive'
        : 'warning';

  return (
    <Badge variant={variant}>
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
    </Badge>
  );
}
