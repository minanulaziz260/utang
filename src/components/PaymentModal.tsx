import { useEffect, useState, type FormEvent } from 'react';
import type { DebtTransaction, RecordPaymentInput } from '../types/debt';
import { formatRupiah } from '../utils/formatters';
import { Button } from './ui/button';
import { Dialog } from './ui/dialog';
import { Input, Label } from './ui/input';

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
    <Dialog
      open={Boolean(transaction)}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title="Catat Pembayaran"
      description={`${transaction.friendName} · ${transaction.bank}`}
      titleId="payment-modal-title"
      maxWidthClass="sm:max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-3">
          <span className="text-xs text-muted-foreground">Sisa Hutang</span>
          <span className="text-sm font-bold text-foreground tabular-nums">
            {formatRupiah(transaction.remainingAmount)}
          </span>
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-md border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-900"
          >
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="payment-amount">Nominal Pembayaran (Rp)</Label>
            <button
              type="button"
              onClick={() => setAmount(String(transaction.remainingAmount))}
              className="text-xs font-medium text-primary underline hover:text-emerald-800"
            >
              Lunasi Penuh
            </button>
          </div>
          <Input
            id="payment-amount"
            type="number"
            min={1000}
            max={transaction.remainingAmount}
            step={1000}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="tabular-nums"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="payment-note">Catatan Pembayaran (Opsional)</Label>
          <Input
            id="payment-note"
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Contoh: Transfer cicilan ke-2"
          />
        </div>

        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit">Simpan Pembayaran</Button>
        </div>
      </form>
    </Dialog>
  );
}
