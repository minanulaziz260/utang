import type { DebtTransaction, PaymentRecord } from '../types/debt';
import { formatDateId, formatRupiah } from '../utils/formatters';
import { StatusBadge } from './StatusBadge';
import { Button } from './ui/button';
import { Dialog } from './ui/dialog';

interface TransactionDetailModalProps {
  transaction: DebtTransaction | null;
  payments: PaymentRecord[];
  onClose: () => void;
  onRecordPayment: (transaction: DebtTransaction) => void;
}

export function TransactionDetailModal({
  transaction,
  payments,
  onClose,
  onRecordPayment,
}: TransactionDetailModalProps) {
  if (!transaction) return null;

  const relatedPayments = payments.filter(
    (p) => p.transactionId === transaction.id
  );

  return (
    <Dialog
      open={Boolean(transaction)}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title="Detail Catatan Hutang"
      description={`ID: ${transaction.id}`}
      titleId="detail-modal-title"
    >
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-foreground">
              {transaction.friendName}
            </p>
            <p className="text-xs text-muted-foreground">{transaction.bank}</p>
          </div>
          <StatusBadge status={transaction.status} />
        </div>

        <dl className="grid grid-cols-2 gap-3 rounded-lg border border-border bg-muted/50 p-4 text-xs">
          <div>
            <dt className="text-muted-foreground">Nominal Awal</dt>
            <dd className="mt-1 text-sm font-semibold text-foreground tabular-nums">
              {formatRupiah(transaction.principalAmount)}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Sisa Hutang</dt>
            <dd className="mt-1 text-sm font-semibold text-foreground tabular-nums">
              {formatRupiah(transaction.remainingAmount)}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Tanggal Catat</dt>
            <dd className="mt-1 font-medium text-foreground tabular-nums">
              {formatDateId(transaction.createdAt)}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Jatuh Tempo</dt>
            <dd className="mt-1 font-medium text-foreground tabular-nums">
              {formatDateId(transaction.dueDate)}
            </dd>
          </div>
        </dl>

        {transaction.notes && (
          <div>
            <h3 className="text-xs font-semibold text-foreground">Catatan</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {transaction.notes}
            </p>
          </div>
        )}

        <div>
          <h3 className="mb-2 text-xs font-semibold text-foreground">
            Riwayat Pembayaran ({relatedPayments.length})
          </h3>
          {relatedPayments.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border p-3 text-xs text-muted-foreground">
              Belum ada pembayaran yang dicatat untuk transaksi ini.
            </p>
          ) : (
            <ul className="divide-y divide-border rounded-lg border border-border">
              {relatedPayments.map((payment) => (
                <li
                  key={payment.id}
                  className="flex items-center justify-between gap-2 p-3 text-xs"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {formatDateId(payment.paidAt)}
                    </p>
                    {payment.note && (
                      <p className="mt-0.5 text-muted-foreground">
                        {payment.note}
                      </p>
                    )}
                  </div>
                  <span className="font-semibold text-emerald-800 tabular-nums">
                    +{formatRupiah(payment.amount)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onClose}>
            Tutup
          </Button>
          {transaction.remainingAmount > 0 && (
            <Button
              onClick={() => {
                onClose();
                onRecordPayment(transaction);
              }}
            >
              Catat Bayar
            </Button>
          )}
        </div>
      </div>
    </Dialog>
  );
}
