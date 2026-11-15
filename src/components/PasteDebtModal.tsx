import { Calendar, ClipboardPaste } from 'lucide-react';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import type { CreateDebtInput } from '../types/debt';
import { formatDateSlash, formatRupiah } from '../utils/formatters';
import { parsePastedDebtText, toCreateDebtInputs } from '../utils/pasteParser';
import { Button } from './ui/button';
import { Dialog } from './ui/dialog';
import { Input, Label, Textarea } from './ui/input';

interface PasteDebtModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitBatch: (inputs: CreateDebtInput[]) => void;
}

const EXAMPLE_TEXT = `MURIA
| 11 hari lagi | Rp 355.000 | Bank Jago
| 41 hari lagi | Rp 355.000 | Bank Jago
| 72 hari lagi | Rp 355.000 | Bank Jago`;

export function PasteDebtModal({
  isOpen,
  onClose,
  onSubmitBatch,
}: PasteDebtModalProps) {
  const [rawText, setRawText] = useState('');
  const [friendNameOverride, setFriendNameOverride] = useState('');
  const [error, setError] = useState<string | null>(null);

  const parsed = useMemo(() => parsePastedDebtText(rawText), [rawText]);

  useEffect(() => {
    if (parsed.friendName) {
      setFriendNameOverride(parsed.friendName);
    }
  }, [parsed.friendName]);

  const effectiveFriendName = friendNameOverride.trim();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!effectiveFriendName) {
      setError('Nama teman wajib diisi (bisa di baris pertama atau kolom nama).');
      return;
    }
    if (parsed.items.length === 0) {
      setError('Belum ada baris hutang yang valid untuk disimpan.');
      return;
    }

    onSubmitBatch(toCreateDebtInputs(effectiveFriendName, parsed.items));
    setRawText('');
    setFriendNameOverride('');
    setError(null);
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title="Paste Data Hutang Otomatis"
      description="Tempel daftar tagihan, sistem membaca nama, tanggal, nominal, dan bank."
      titleId="paste-debt-title"
      maxWidthClass="sm:max-w-xl"
      icon={
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-emerald-200 bg-emerald-50 text-primary">
          <ClipboardPaste className="h-4 w-4" aria-hidden="true" />
        </div>
      }
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

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="paste-raw-input">Tempel Daftar Hutang</Label>
            <button
              type="button"
              onClick={() => {
                setRawText(EXAMPLE_TEXT);
                setError(null);
              }}
              className="text-xs font-medium text-primary underline hover:text-emerald-800"
            >
              Isi Contoh
            </button>
          </div>
          <Textarea
            id="paste-raw-input"
            rows={5}
            value={rawText}
            onChange={(e) => {
              setRawText(e.target.value);
              setError(null);
            }}
            placeholder={EXAMPLE_TEXT}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="paste-friend-name">
            Nama Teman (otomatis dari baris pertama, bisa diubah)
          </Label>
          <Input
            id="paste-friend-name"
            type="text"
            value={friendNameOverride}
            onChange={(e) => {
              setFriendNameOverride(e.target.value);
              setError(null);
            }}
            placeholder="Contoh: MURIA"
          />
        </div>

        {parsed.warnings.length > 0 && (
          <div className="space-y-1 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
            {parsed.warnings.map((w, idx) => (
              <p key={idx}>{w}</p>
            ))}
          </div>
        )}

        {parsed.items.length > 0 && (
          <div className="overflow-hidden rounded-lg border border-border">
            <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-2.5 text-xs">
              <span className="font-semibold text-foreground">
                Pratinjau ({parsed.items.length} catatan terbaca)
              </span>
              <span className="font-bold text-foreground tabular-nums">
                Total:{' '}
                {formatRupiah(
                  parsed.items.reduce((sum, i) => sum + i.principalAmount, 0)
                )}
              </span>
            </div>
            <ul className="max-h-48 divide-y divide-border overflow-y-auto">
              {parsed.items.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between gap-3 px-4 py-2.5 text-xs"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="font-medium text-foreground">
                      {item.bank}
                    </span>
                    <span className="inline-flex items-center gap-1 text-muted-foreground tabular-nums">
                      <Calendar className="h-3 w-3" aria-hidden="true" />
                      <span>{formatDateSlash(item.dueDate)}</span>
                    </span>
                  </div>
                  <span className="shrink-0 font-semibold text-foreground tabular-nums">
                    {formatRupiah(item.principalAmount)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit">Simpan Semua ({parsed.items.length})</Button>
        </div>
      </form>
    </Dialog>
  );
}
