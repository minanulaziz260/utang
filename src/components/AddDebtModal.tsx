import { Calendar } from 'lucide-react';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { BANK_OPTIONS } from '../constants/banks';
import type { BankOption, CreateDebtInput } from '../types/debt';
import {
  addMonthsToIsoDate,
  formatDateSlash,
  formatRupiah,
} from '../utils/formatters';
import { Button } from './ui/button';
import { Dialog } from './ui/dialog';
import { Input, Label, Select, Textarea } from './ui/input';

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
    if (
      !Number.isInteger(parsedPeriods) ||
      parsedPeriods < 1 ||
      parsedPeriods > 36
    ) {
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
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title="Catat Hutang Baru"
      description="Tersimpan otomatis di localStorage browser ini."
      titleId="add-debt-title"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div
            role="alert"
            className="rounded-md border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-900"
          >
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2 space-y-1.5">
            <Label htmlFor="debt-friend-name">Nama Teman</Label>
            <Input
              id="debt-friend-name"
              type="text"
              value={friendName}
              onChange={(e) => setFriendName(e.target.value)}
              placeholder="Contoh: Budi Santoso"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="debt-friend-phone">Nomor Kontak (Opsional)</Label>
            <Input
              id="debt-friend-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0812-xxxx-xxxx"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="debt-bank">Bank / Layanan</Label>
            <Select
              id="debt-bank"
              value={bank}
              onChange={(e) => setBank(e.target.value as BankOption)}
            >
              {BANK_OPTIONS.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.name} ({item.category})
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="debt-amount">Nominal Hutang (Rp)</Label>
            <Input
              id="debt-amount"
              type="number"
              min={1000}
              step={1000}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="500000"
              className="tabular-nums"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="debt-due-date">Jatuh Tempo Awal</Label>
            <Input
              id="debt-due-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="tabular-nums"
            />
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <Label htmlFor="debt-periods">Auto Generate Periode (Bulan)</Label>
            <Input
              id="debt-periods"
              type="number"
              min={1}
              max={36}
              value={periods}
              onChange={(e) => setPeriods(e.target.value)}
              className="tabular-nums"
            />
            <p className="text-[11px] text-muted-foreground">
              Isi lebih dari 1 (misal 5) untuk otomatis membuat tagihan bulan-bulan berikutnya.
            </p>
          </div>

          {periodCount > 1 && generatedDates.length > 0 && (
            <div className="sm:col-span-2 space-y-2 rounded-lg border border-emerald-200 bg-emerald-50/60 p-3">
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
                    className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-background px-2 py-1 text-[11px] font-medium text-foreground tabular-nums"
                  >
                    <Calendar
                      className="h-3 w-3 text-primary"
                      aria-hidden="true"
                    />
                    <span>
                      #{idx + 1} {formatDateSlash(d)}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="sm:col-span-2 space-y-1.5">
            <Label htmlFor="debt-notes">Catatan (Opsional)</Label>
            <Textarea
              id="debt-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Keterangan singkat keperluan pinjaman..."
            />
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit">Simpan Catatan</Button>
        </div>
      </form>
    </Dialog>
  );
}
