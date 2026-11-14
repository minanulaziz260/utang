import {
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Eye,
  Plus,
  Trash2,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import type { DebtTransaction } from '../types/debt';
import { formatDateSlash, formatRupiah } from '../utils/formatters';
import { StatusBadge } from './StatusBadge';

interface FriendDebtGroupListProps {
  transactions: DebtTransaction[];
  onRecordPayment: (transaction: DebtTransaction) => void;
  onViewDetail: (transaction: DebtTransaction) => void;
  onDeleteTransaction: (transaction: DebtTransaction) => void;
  onAddDebtForFriend: (friendName: string) => void;
  onCopySummary?: (friendName: string, text: string) => void;
}

interface FriendGroup {
  friendName: string;
  items: DebtTransaction[];
  totalRemaining: number;
  unpaidCount: number;
}

export function FriendDebtGroupList({
  transactions,
  onRecordPayment,
  onViewDetail,
  onDeleteTransaction,
  onAddDebtForFriend,
  onCopySummary,
}: FriendDebtGroupListProps) {
  const [collapsedFriends, setCollapsedFriends] = useState<
    Record<string, boolean>
  >({});

  const groups = useMemo<FriendGroup[]>(() => {
    const map = new Map<string, DebtTransaction[]>();
    for (const trx of transactions) {
      const existing = map.get(trx.friendName);
      if (existing) {
        existing.push(trx);
      } else {
        map.set(trx.friendName, [trx]);
      }
    }

    return Array.from(map.entries()).map(([friendName, items]) => {
      const totalRemaining = items.reduce(
        (sum, t) => sum + t.remainingAmount,
        0
      );
      const unpaidCount = items.filter((t) => t.status !== 'lunas').length;
      return {
        friendName,
        items,
        totalRemaining,
        unpaidCount,
      };
    });
  }, [transactions]);

  const toggleCollapse = (friendName: string) => {
    setCollapsedFriends((prev) => ({
      ...prev,
      [friendName]: !prev[friendName],
    }));
  };

  const handleCopy = (group: FriendGroup) => {
    const lines = [
      `Ringkasan Hutang - ${group.friendName}`,
      `Total Sisa: ${formatRupiah(group.totalRemaining)}`,
      ...group.items.map(
        (t) =>
          `- ${t.bank}: ${formatRupiah(t.remainingAmount > 0 ? t.remainingAmount : t.principalAmount)} (Jatuh tempo ${formatDateSlash(t.dueDate)})`
      ),
    ];
    const summaryText = lines.join('\n');
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(summaryText).catch(() => {});
    }
    onCopySummary?.(group.friendName, summaryText);
  };

  return (
    <div className="space-y-4">
      {groups.map((group) => {
        const isCollapsed = Boolean(collapsedFriends[group.friendName]);
        const initial = group.friendName.trim().charAt(0).toUpperCase() || '?';

        return (
          <article
            key={group.friendName}
            className="rounded-xl bg-white border border-slate-200 shadow-xs overflow-hidden"
          >
            {/* Header kartu nama teman */}
            <div className="px-4 sm:px-5 py-4 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => toggleCollapse(group.friendName)}
                aria-expanded={!isCollapsed}
                className="flex items-center gap-3 min-w-0 flex-1 text-left"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-sm font-bold">
                  {initial}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-semibold text-slate-900 truncate">
                    {group.friendName}
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {group.items.length} hutang · {group.unpaidCount} belum
                  </p>
                </div>
              </button>

              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <span className="text-sm sm:text-base font-bold text-slate-900 tabular-nums mr-1">
                  {formatRupiah(group.totalRemaining)}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(group)}
                  aria-label={`Salin ringkasan hutang ${group.friendName}`}
                  title="Salin ringkasan"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                >
                  <Copy className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => toggleCollapse(group.friendName)}
                  aria-label={
                    isCollapsed
                      ? `Tampilkan daftar hutang ${group.friendName}`
                      : `Sembunyikan daftar hutang ${group.friendName}`
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                >
                  {isCollapsed ? (
                    <ChevronDown className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <ChevronUp className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {/* Daftar hutang satu baris per item di bawah nama */}
            {!isCollapsed && (
              <>
                <div className="divide-y divide-slate-200 border-t border-slate-200">
                  {group.items.map((trx) => (
                    <div
                      key={trx.id}
                      className="px-4 sm:px-5 py-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
                    >
                      <div className="min-w-0 space-y-1.5">
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                          <span className="text-sm font-medium text-slate-900">
                            {trx.bank}
                          </span>
                          <span className="text-sm font-semibold text-slate-900 tabular-nums">
                            {formatRupiah(
                              trx.remainingAmount > 0
                                ? trx.remainingAmount
                                : trx.principalAmount
                            )}
                          </span>
                          {trx.remainingAmount > 0 &&
                            trx.remainingAmount < trx.principalAmount && (
                              <span className="text-xs text-slate-500 tabular-nums">
                                (awal {formatRupiah(trx.principalAmount)})
                              </span>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 tabular-nums">
                            <Calendar
                              className="h-3.5 w-3.5 text-slate-500 shrink-0"
                              aria-hidden="true"
                            />
                            <span>{formatDateSlash(trx.dueDate)}</span>
                          </span>
                          <StatusBadge status={trx.status} />
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {trx.remainingAmount > 0 && (
                          <button
                            type="button"
                            onClick={() => onRecordPayment(trx)}
                            aria-label={`Catat bayar ${trx.bank} untuk ${trx.friendName}`}
                            title="Catat Bayar"
                            className="flex h-10 w-10 items-center justify-center rounded-lg text-emerald-700 hover:bg-emerald-50 transition-colors"
                          >
                            <Check className="h-4 w-4" aria-hidden="true" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onViewDetail(trx)}
                          aria-label={`Lihat detail ${trx.bank} untuk ${trx.friendName}`}
                          title="Detail"
                          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                        >
                          <Eye className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteTransaction(trx)}
                          aria-label={`Hapus catatan ${trx.bank} untuk ${trx.friendName}`}
                          title="Hapus"
                          className="flex h-10 w-10 items-center justify-center rounded-lg text-rose-700 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tombol tambah hutang untuk teman ini */}
                <div className="border-t border-slate-200 bg-slate-50/40">
                  <button
                    type="button"
                    onClick={() => onAddDebtForFriend(group.friendName)}
                    className="w-full py-3 px-4 min-h-[44px] inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-medium text-emerald-800 hover:bg-emerald-50 transition-colors"
                  >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    <span>Tambah hutang untuk {group.friendName}</span>
                  </button>
                </div>
              </>
            )}
          </article>
        );
      })}
    </div>
  );
}
