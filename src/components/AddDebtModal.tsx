import { Calendar, X } from 'lucide-react';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { BANK_OPTIONS } from '../constants/banks';
import type { BankOption, CreateDebtInput } from '../types/debt';
import {
  addMonthsToIsoDate,
  formatDateSlash,
  formatRupiah,
} from '../utils/formatters';

interface AddDebtModalProps {
  isOpen: boolean;
  prefillFriend?: { name: string; phone?: string } | null;
  onClose: () => void;
  onSubmitBatch: (inputs: CreateDebtInput[]) => void;
}

export function AddDebtModal({
  isOpen,
  prefillFriend = null,
  onClose,
  onSubmitBatch,
}: AddDebtModalProps) {
  const [friendName, setFriendName] = useState('');
  const [phone, setPhone] = useState('');
  const [bank, setBank] = useState<BankOption>('Bank Jago');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('2026-12-01');
  const [periods, setPeriods] = useState('1');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setFriendName(prefillFriend?.name ?? '');
    setPhone(
      prefillFriend?.phone && prefillFriend.phone !== '-'
        ? prefillFriend.phone
        : ''
    );
    setBank('Bank Jago');
    setAmount('');
    setDueDate('2026-12-01');
    setPeriods('1');
    setNotes('');
    setError(null);
  }, [isOpen, prefillFriend]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const periodCount = useMemo(() => {
    const parsed = Number(periods);
    if (!Number.isInteger(parsed) || parsed < 1) return 1;
    return Math.min(parsed, 36);
  }, [periods]);

  const generatedDates = useMemo(() => {
    if (!dueDate) return [];
    return Array.from({ length: periodCount }, (_, idx) =>
      addMonthsToIsoDate(dueDate, idx)
    );
  }, [dueDate, periodCount]);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const numericAmount = Number(amount);
    const parsedPeriods = Number(periods);

    if (!friendName.trim()) {
      setError('Nama teman wajib diisi.');
      return;
    }
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError('Nominal hutang harus lebih dari Rp 0.');
      return;
    }
    if (!dueDate) {
      setError('Tanggal jatuh tempo awal wajib dipilih.');
      return;
    }
    if (!Number.isInteger(parsedPeriods) || parsedPeriods < 1 || parsedPeriods > 36) {
      setError('Jumlah periode harus antara 1 sampai 36 bulan.');
      return;
    }

    const baseNote = notes.trim();
    const inputs: CreateDebtInput[] = generatedDates.map((date, idx) => ({
      friendName: friendName.trim(),
      phone: phone.trim() || undefined,
      bank,
      principalAmount: numericAmount,
      dueDate: date,
      notes:
        parsedPeriods > 1
          ? `${baseNote ? `${baseNote} ` : ''}(Periode ${idx + 1}/${parsedPeriods})`
          : baseNote || undefined,
    }));

    onSubmitBatch(inputs);

    setFriendName('');
    setPhone('');
    setBank('Bank Jago');
    setAmount('');
    setDueDate('2026-12-01');
    setPeriods('1');
    setNotes('');
    setError(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/50 p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-debt-title"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-lg rounded-t-2xl sm:rounded-xl bg-white border border-slate-200 shadow-lg max-h-[90dvh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <div>
            <h2
              id="add-debt-title"
              className="text-base font-semibold text-slate-900"
            >
              Catat Hutang Baru
            </h2>
            <p className="text-xs text-slate-600">
              Disimpan sementara di sesi simulasi browser.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup dialog"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div
              role="alert"
              className="rounded-lg bg-rose-50 border border-rose-200 px-3.5 py-2.5 text-xs font-medium text-rose-900"
            >
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label
                htmlFor="debt-friend-name"
                className="block text-xs font-medium text-slate-800 mb-1.5"
              >
                Nama Teman
              </label>
              <input
                id="debt-friend-name"
                type="text"
                value={friendName}
                onChange={(e) => setFriendName(e.target.value)}
                placeholder="Contoh: Budi Santoso"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 min-h-[44px] text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-700 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="debt-friend-phone"
                className="block text-xs font-medium text-slate-800 mb-1.5"
              >
                Nomor Kontak (Opsional)
              </label>
              <input
                id="debt-friend-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0812-xxxx-xxxx"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 min-h-[44px] text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-700 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="debt-bank"
                className="block text-xs font-medium text-slate-800 mb-1.5"
              >
                Bank / Layanan
              </label>
              <select
                id="debt-bank"
                value={bank}
                onChange={(e) => setBank(e.target.value as BankOption)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 min-h-[44px] text-sm text-slate-900 focus:border-emerald-700 focus:outline-none"
              >
                {BANK_OPTIONS.map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.name} ({item.category})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="debt-amount"
                className="block text-xs font-medium text-slate-800 mb-1.5"
              >
                Nominal Hutang (Rp)
              </label>
              <input
                id="debt-amount"
                type="number"
                min={1000}
                step={1000}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="500000"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 min-h-[44px] text-sm text-slate-900 tabular-nums placeholder:text-slate-500 focus:border-emerald-700 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="debt-due-date"
                className="block text-xs font-medium text-slate-800 mb-1.5"
              >
                Jatuh Tempo Awal
              </label>
              <input
                id="debt-due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 min-h-[44px] text-sm text-slate-900 tabular-nums focus:border-emerald-700 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="debt-periods"
                className="block text-xs font-medium text-slate-800 mb-1.5"
              >
                Auto Generate Periode (Bulan)
              </label>
              <input
                id="debt-periods"
                type="number"
                min={1}
                max={36}
                value={periods}
                onChange={(e) => setPeriods(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 min-h-[44px] text-sm text-slate-900 tabular-nums focus:border-emerald-700 focus:outline-none"
              />
              <p className="mt-1 text-[11px] text-slate-600">
                Isi lebih dari 1 (misal 5) untuk otomatis membuat tagihan bulan-bulan berikutnya.
              </p>
            </div>

            {periodCount > 1 && generatedDates.length > 0 && (
              <div className="sm:col-span-2 rounded-lg bg-emerald-50/60 border border-emerald-200 p-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-emerald-900">
                    Jadwal Auto Generate ({periodCount} periode)
                  </span>
                  {Number(amount) > 0 && (
                    <span className="font-bold text-emerald-900 tabular-nums">
                      Total: {formatRupiah(Number(amount) * periodCount)}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {generatedDates.map((d, idx) => (
                    <span
                      key={d}
                      className="inline-flex items-center gap-1 rounded-md bg-white border border-emerald-200 px-2 py-1 text-[11px] font-medium text-slate-800 tabular-nums"
                    >
                      <Calendar className="h-3 w-3 text-emerald-700" aria-hidden="true" />
                      <span>
                        #{idx + 1} {formatDateSlash(d)}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="sm:col-span-2">
              <label
                htmlFor="debt-notes"
                className="block text-xs font-medium text-slate-800 mb-1.5"
              >
                Catatan (Opsional)
              </label>
              <textarea
                id="debt-notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Keterangan singkat keperluan pinjaman..."
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-700 focus:outline-none"
              />
            </div>
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
              Simpan Catatan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
