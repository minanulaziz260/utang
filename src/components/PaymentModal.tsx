import { X } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import type { DebtTransaction, RecordPaymentInput } from '../types/debt';
import { formatRupiah } from '../utils/formatters';

interface PaymentModalProps {
  transaction: DebtTransaction | null;
  onClose: () => void;
  onSubmit: (input: RecordPaymentInput) => void;
}

export function PaymentModal({
  transaction,
  onClose,
  onSubmit,
}: PaymentModalProps) {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (transaction) {
      setAmount(String(transaction.remainingAmount));
      setNote('');
      setError(null);
    }
  }, [transaction]);

  useEffect(() => {
    if (!transaction) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [transaction, onClose]);

  if (!transaction) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError('Nominal pembayaran harus lebih dari Rp 0.');
      return;
    }
    if (numericAmount > transaction.remainingAmount) {
      setError(
        `Nominal melebihi sisa hutang (${formatRupiah(transaction.remainingAmount)}).`
      );
      return;
    }

    onSubmit({
      transactionId: transaction.id,
      amount: numericAmount,
      note: note.trim() || undefined,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/50 p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md rounded-t-2xl sm:rounded-xl bg-white border border-slate-200 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <div>
            <h2
              id="payment-modal-title"
              className="text-base font-semibold text-slate-900"
            >
              Catat Pembayaran
            </h2>
            <p className="text-xs text-slate-600">
              {transaction.friendName} · {transaction.bank}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup dialog pembayaran"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 flex items-center justify-between">
            <span className="text-xs text-slate-600">Sisa Hutang</span>
            <span className="text-sm font-bold text-slate-900 tabular-nums">
              {formatRupiah(transaction.remainingAmount)}
            </span>
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-lg bg-rose-50 border border-rose-200 px-3.5 py-2.5 text-xs font-medium text-rose-900"
            >
              {error}
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="payment-amount"
                className="text-xs font-medium text-slate-800"
              >
                Nominal Pembayaran (Rp)
              </label>
              <button
                type="button"
                onClick={() => setAmount(String(transaction.remainingAmount))}
                className="text-xs font-medium text-emerald-700 hover:text-emerald-800 underline"
              >
                Lunasi Penuh
              </button>
            </div>
            <input
              id="payment-amount"
              type="number"
              min={1000}
              max={transaction.remainingAmount}
              step={1000}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 min-h-[44px] text-sm text-slate-900 tabular-nums focus:border-emerald-700 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="payment-note"
              className="block text-xs font-medium text-slate-800 mb-1.5"
            >
              Catatan Pembayaran (Opsional)
            </label>
            <input
              id="payment-note"
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Contoh: Transfer cicilan ke-2"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 min-h-[44px] text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-700 focus:outline-none"
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 bg-white hover:bg-slate-50 px-4 py-2.5 min-h-[44px] text-sm font-medium text-slate-800"
            >
              Batal
            </button>
            <button
              type="submit"
              className="rounded-lg bg-emerald-700 hover:bg-emerald-800 px-4 py-2.5 min-h-[44px] text-sm font-medium text-white"
            >
              Simpan Pembayaran
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
