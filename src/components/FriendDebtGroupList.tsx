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
import { Button } from './ui/button';
import { Card } from './ui/card';

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
          <Card key={group.friendName} className="overflow-hidden">
            <div className="flex items-center justify-between gap-3 px-4 py-4 sm:px-5">
              <button
                type="button"
                onClick={() => toggleCollapse(group.friendName)}
                aria-expanded={!isCollapsed}
                className="flex min-w-0 flex-1 items-center gap-3 text-left"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-sm font-semibold text-primary">
                  {initial}
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-foreground sm:text-base">
                    {group.friendName}
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {group.items.length} hutang · {group.unpaidCount} belum
                  </p>
                </div>
              </button>

              <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
                <span className="mr-1 text-sm font-semibold text-foreground tabular-nums sm:text-base">
                  {formatRupiah(group.totalRemaining)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleCopy(group)}
                  aria-label={`Salin ringkasan hutang ${group.friendName}`}
                  title="Salin ringkasan"
                  className="h-9 w-9 text-muted-foreground hover:text-foreground"
                >
                  <Copy className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleCollapse(group.friendName)}
                  aria-label={
                    isCollapsed
                      ? `Tampilkan daftar hutang ${group.friendName}`
                      : `Sembunyikan daftar hutang ${group.friendName}`
                  }
                  className="h-9 w-9 text-muted-foreground hover:text-foreground"
                >
                  {isCollapsed ? (
                    <ChevronDown className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <ChevronUp className="h-4 w-4" aria-hidden="true" />
                  )}
                </Button>
              </div>
            </div>

            {!isCollapsed && (
              <>
                <div className="divide-y divide-border border-t border-border">
                  {group.items.map((trx) => (
                    <div
                      key={trx.id}
                      className="flex items-center justify-between gap-3 px-4 py-3.5 transition-colors hover:bg-muted/40 sm:px-5"
                    >
                      <div className="min-w-0 space-y-1.5">
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                          <span className="text-sm font-medium text-foreground">
                            {trx.bank}
                          </span>
                          <span className="text-sm font-semibold text-foreground tabular-nums">
                            {formatRupiah(
                              trx.remainingAmount > 0
                                ? trx.remainingAmount
                                : trx.principalAmount
                            )}
                          </span>
                          {trx.remainingAmount > 0 &&
                            trx.remainingAmount < trx.principalAmount && (
                              <span className="text-xs text-muted-foreground tabular-nums">
                                (awal {formatRupiah(trx.principalAmount)})
                              </span>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground tabular-nums">
                            <Calendar
                              className="h-3.5 w-3.5 shrink-0"
                              aria-hidden="true"
                            />
                            <span>{formatDateSlash(trx.dueDate)}</span>
                          </span>
                          <StatusBadge status={trx.status} />
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-1">
                        {trx.remainingAmount > 0 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onRecordPayment(trx)}
                            aria-label={`Catat bayar ${trx.bank} untuk ${trx.friendName}`}
                            title="Catat Bayar"
                            className="text-primary hover:bg-emerald-50 hover:text-emerald-800"
                          >
                            <Check className="h-4 w-4" aria-hidden="true" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onViewDetail(trx)}
                          aria-label={`Lihat detail ${trx.bank} untuk ${trx.friendName}`}
                          title="Detail"
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Eye className="h-4 w-4" aria-hidden="true" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDeleteTransaction(trx)}
                          aria-label={`Hapus catatan ${trx.bank} untuk ${trx.friendName}`}
                          title="Hapus"
                          className="text-rose-700 hover:bg-rose-50 hover:text-rose-800"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border bg-muted/30">
                  <button
                    type="button"
                    onClick={() => onAddDebtForFriend(group.friendName)}
                    className="inline-flex min-h-[44px] w-full items-center justify-center gap-1.5 px-4 py-3 text-xs font-medium text-primary transition-colors hover:bg-emerald-50/70 sm:text-sm"
                  >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    <span>Tambah hutang untuk {group.friendName}</span>
                  </button>
                </div>
              </>
            )}
          </Card>
        );
      })}
    </div>
  );
}
