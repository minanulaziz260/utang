import { X } from 'lucide-react';
import { useEffect } from 'react';
import type { DebtTransaction, PaymentRecord } from '../types/debt';
import { formatDateId, formatRupiah } from '../utils/formatters';
import { StatusBadge } from './StatusBadge';

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
  useEffect(() => {
    if (!transaction) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [transaction, onClose]);

  if (!transaction) return null;

  const relatedPayments = payments.filter(
    (p) => p.transactionId === transaction.id
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/50 p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-lg rounded-t-2xl sm:rounded-xl bg-white border border-slate-200 shadow-lg max-h-[90dvh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <div>
            <h2
              id="detail-modal-title"
              className="text-base font-semibold text-slate-900"
            >
              Detail Catatan Hutang
            </h2>
            <p className="text-xs text-slate-600">ID: {transaction.id}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup detail transaksi"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {transaction.friendName}
              </p>
              <p className="text-xs text-slate-600">{transaction.bank}</p>
            </div>
            <StatusBadge status={transaction.status} />
          </div>

          <dl className="grid grid-cols-2 gap-3 rounded-lg bg-slate-50 border border-slate-200 p-4 text-xs">
            <div>
              <dt className="text-slate-600">Nominal Awal</dt>
              <dd className="mt-1 text-sm font-semibold text-slate-900 tabular-nums">
                {formatRupiah(transaction.principalAmount)}
              </dd>
            </div>
            <div>
              <dt className="text-slate-600">Sisa Hutang</dt>
              <dd className="mt-1 text-sm font-semibold text-slate-900 tabular-nums">
                {formatRupiah(transaction.remainingAmount)}
              </dd>
            </div>
            <div>
              <dt className="text-slate-600">Tanggal Catat</dt>
              <dd className="mt-1 font-medium text-slate-800 tabular-nums">
                {formatDateId(transaction.createdAt)}
              </dd>
            </div>
            <div>
              <dt className="text-slate-600">Jatuh Tempo</dt>
              <dd className="mt-1 font-medium text-slate-800 tabular-nums">
                {formatDateId(transaction.dueDate)}
              </dd>
            </div>
          </dl>

          {transaction.notes && (
            <div>
              <h3 className="text-xs font-semibold text-slate-800">Catatan</h3>
              <p className="mt-1 text-sm text-slate-700 leading-relaxed">
                {transaction.notes}
              </p>
            </div>
          )}

          <div>
            <h3 className="text-xs font-semibold text-slate-800 mb-2">
              Riwayat Pembayaran ({relatedPayments.length})
            </h3>
            {relatedPayments.length === 0 ? (
              <p className="text-xs text-slate-600 rounded-lg border border-dashed border-slate-300 p-3">
                Belum ada pembayaran yang dicatat untuk transaksi ini.
              </p>
            ) : (
              <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200">
                {relatedPayments.map((payment) => (
                  <li
                    key={payment.id}
                    className="p-3 flex items-center justify-between gap-2 text-xs"
                  >
                    <div>
                      <p className="font-medium text-slate-900">
                        {formatDateId(payment.paidAt)}
                      </p>
                      {payment.note && (
                        <p className="text-slate-600 mt-0.5">{payment.note}</p>
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

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 bg-white hover:bg-slate-50 px-4 py-2.5 min-h-[44px] text-sm font-medium text-slate-800"
            >
              Tutup
            </button>
            {transaction.remainingAmount > 0 && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onRecordPayment(transaction);
                }}
                className="rounded-lg bg-emerald-700 hover:bg-emerald-800 px-4 py-2.5 min-h-[44px] text-sm font-medium text-white"
              >
                Catat Bayar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
