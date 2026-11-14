import { Calendar, ClipboardPaste, X } from 'lucide-react';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import type { CreateDebtInput } from '../types/debt';
import { formatDateSlash, formatRupiah } from '../utils/formatters';
import { parsePastedDebtText, toCreateDebtInputs } from '../utils/pasteParser';

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

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/50 p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="paste-debt-title"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-xl rounded-t-2xl sm:rounded-xl bg-white border border-slate-200 shadow-lg max-h-[90dvh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
              <ClipboardPaste className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <h2
                id="paste-debt-title"
                className="text-base font-semibold text-slate-900"
              >
                Paste Data Hutang Otomatis
              </h2>
              <p className="text-xs text-slate-600">
                Tempel daftar tagihan, sistem otomatis membaca nama, tanggal, nominal, dan bank.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup dialog paste data"
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

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="paste-raw-input"
                className="text-xs font-medium text-slate-800"
              >
                Tempel Daftar Hutang
              </label>
              <button
                type="button"
                onClick={() => {
                  setRawText(EXAMPLE_TEXT);
                  setError(null);
                }}
                className="text-xs font-medium text-emerald-700 hover:text-emerald-800 underline"
              >
                Isi Contoh
              </button>
            </div>
            <textarea
              id="paste-raw-input"
              rows={5}
              value={rawText}
              onChange={(e) => {
                setRawText(e.target.value);
                setError(null);
              }}
              placeholder={EXAMPLE_TEXT}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-700 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="paste-friend-name"
              className="block text-xs font-medium text-slate-800 mb-1.5"
            >
              Nama Teman (otomatis dari baris pertama, bisa diubah)
            </label>
            <input
              id="paste-friend-name"
              type="text"
              value={friendNameOverride}
              onChange={(e) => {
                setFriendNameOverride(e.target.value);
                setError(null);
              }}
              placeholder="Contoh: MURIA"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 min-h-[44px] text-sm text-slate-900 placeholder:text-slate-500 focus:border-emerald-700 focus:outline-none"
            />
          </div>

          {parsed.warnings.length > 0 && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 space-y-1 text-xs text-amber-900">
              {parsed.warnings.map((w, idx) => (
                <p key={idx}>{w}</p>
              ))}
            </div>
          )}

          {parsed.items.length > 0 && (
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800">
                  Pratinjau ({parsed.items.length} catatan terbaca)
                </span>
                <span className="font-bold text-slate-900 tabular-nums">
                  Total:{' '}
                  {formatRupiah(
                    parsed.items.reduce((sum, i) => sum + i.principalAmount, 0)
                  )}
                </span>
              </div>
              <ul className="divide-y divide-slate-200 max-h-48 overflow-y-auto">
                {parsed.items.map((item, idx) => (
                  <li
                    key={idx}
                    className="px-4 py-2.5 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-medium text-slate-900">
                        {item.bank}
                      </span>
                      <span className="inline-flex items-center gap-1 text-slate-600 tabular-nums">
                        <Calendar className="h-3 w-3" aria-hidden="true" />
                        <span>{formatDateSlash(item.dueDate)}</span>
                      </span>
                    </div>
                    <span className="font-semibold text-slate-900 tabular-nums shrink-0">
                      {formatRupiah(item.principalAmount)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

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
              Simpan Semua ({parsed.items.length})
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
