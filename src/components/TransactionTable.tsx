import {
  Building2,
  Eye,
  LayoutGrid,
  ReceiptText,
  Search,
  Table2,
  X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { cn } from '../lib/utils';
import type { DebtStatus, DebtTransaction } from '../types/debt';
import { formatDateId, formatRupiah } from '../utils/formatters';
import { FriendDebtGroupList } from './FriendDebtGroupList';
import { StatusBadge } from './StatusBadge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

interface TransactionTableProps {
  transactions: DebtTransaction[];
  title?: string;
  limit?: number;
  showFilters?: boolean;
  isLoading?: boolean;
  errorMessage?: string | null;
  onRetry?: () => void;
  onRecordPayment: (transaction: DebtTransaction) => void;
  onViewDetail: (transaction: DebtTransaction) => void;
  onDeleteTransaction: (transaction: DebtTransaction) => void;
  onOpenAddDebt: () => void;
  onAddDebtForFriend: (friendName: string) => void;
  onCopySummary?: (friendName: string) => void;
}

const STATUS_FILTERS: { id: 'all' | DebtStatus; label: string }[] = [
  { id: 'all', label: 'Semua' },
  { id: 'belum_lunas', label: 'Belum Lunas' },
  { id: 'terlambat', label: 'Terlambat' },
  { id: 'lunas', label: 'Sudah Lunas' },
];

export function TransactionTable({
  transactions,
  title = 'Transaksi Terbaru',
  limit,
  showFilters = true,
  isLoading = false,
  errorMessage = null,
  onRetry,
  onRecordPayment,
  onViewDetail,
  onDeleteTransaction,
  onOpenAddDebt,
  onAddDebtForFriend,
  onCopySummary,
}: TransactionTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | DebtStatus>('all');
  const [viewMode, setViewMode] = useState<'grouped' | 'table'>('grouped');

  const filteredTransactions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const list = transactions.filter((trx) => {
      const matchesStatus =
        statusFilter === 'all' ? true : trx.status === statusFilter;
      const matchesQuery =
        query === '' ||
        trx.friendName.toLowerCase().includes(query) ||
        trx.bank.toLowerCase().includes(query);
      return matchesStatus && matchesQuery;
    });
    return typeof limit === 'number' ? list.slice(0, limit) : list;
  }, [transactions, searchQuery, statusFilter, limit]);

  const hasActiveFilter = searchQuery.trim() !== '' || statusFilter !== 'all';

  return (
    <Card aria-labelledby="transactions-heading" className="overflow-hidden">
      <div className="space-y-4 border-b border-border p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2
              id="transactions-heading"
              className="text-base font-semibold tracking-tight text-foreground"
            >
              {title}
            </h2>
            <p className="text-xs text-muted-foreground">
              Menampilkan {filteredTransactions.length} dari{' '}
              {transactions.length} catatan
            </p>
          </div>

          <div
            className="inline-flex self-start rounded-lg border border-border bg-muted p-1 sm:self-auto"
            role="group"
            aria-label="Mode tampilan transaksi"
          >
            <button
              type="button"
              onClick={() => setViewMode('grouped')}
              aria-pressed={viewMode === 'grouped'}
              className={cn(
                'inline-flex min-h-[36px] items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                viewMode === 'grouped'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <LayoutGrid className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Per Teman</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              aria-pressed={viewMode === 'table'}
              className={cn(
                'inline-flex min-h-[36px] items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                viewMode === 'table'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Table2 className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Tabel</span>
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <label htmlFor="trx-search" className="sr-only">
                Cari nama teman atau bank
              </label>
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="trx-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama teman atau bank..."
                className="pl-9 pr-9"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Hapus kata kunci pencarian"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>

            <div
              className="flex flex-wrap gap-1.5"
              role="group"
              aria-label="Filter status hutang"
            >
              {STATUS_FILTERS.map((filter) => {
                const active = statusFilter === filter.id;
                return (
                  <Button
                    key={filter.id}
                    variant={active ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter(filter.id)}
                    aria-pressed={active}
                    className="min-h-[40px]"
                  >
                    {filter.label}
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {isLoading && (
        <div
          role="status"
          aria-live="polite"
          className="space-y-2 p-8 text-center"
        >
          <p className="text-sm font-medium text-foreground">
            Memuat data transaksi...
          </p>
          <p className="text-xs text-muted-foreground">
            Menyiapkan daftar piutang lokal.
          </p>
        </div>
      )}

      {!isLoading && errorMessage && (
        <div role="alert" className="space-y-3 p-8 text-center">
          <p className="text-sm font-semibold text-rose-800">
            Gagal memuat transaksi
          </p>
          <p className="text-xs text-muted-foreground">{errorMessage}</p>
          {onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry}>
              Coba Lagi
            </Button>
          )}
        </div>
      )}

      {!isLoading && !errorMessage && filteredTransactions.length === 0 && (
        <div className="space-y-3 p-8 text-center sm:p-10">
          <p className="text-sm font-semibold text-foreground">
            {hasActiveFilter
              ? 'Tidak ada transaksi yang cocok'
              : 'Belum ada catatan hutang'}
          </p>
          <p className="mx-auto max-w-sm text-xs text-muted-foreground">
            {hasActiveFilter
              ? 'Ubah kata kunci pencarian atau pilih filter status lain.'
              : 'Tambahkan catatan hutang pertama untuk mulai memantau piutang teman.'}
          </p>
          <div className="flex justify-center gap-2 pt-1">
            {hasActiveFilter ? (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
              >
                Reset Filter
              </Button>
            ) : (
              <Button onClick={onOpenAddDebt}>Tambah Hutang Baru</Button>
            )}
          </div>
        </div>
      )}

      {!isLoading &&
        !errorMessage &&
        filteredTransactions.length > 0 &&
        viewMode === 'grouped' && (
          <div className="bg-muted/30 p-4 sm:p-5">
            <FriendDebtGroupList
              transactions={filteredTransactions}
              onRecordPayment={onRecordPayment}
              onViewDetail={onViewDetail}
              onDeleteTransaction={onDeleteTransaction}
              onAddDebtForFriend={onAddDebtForFriend}
              onCopySummary={(friendName) => onCopySummary?.(friendName)}
            />
          </div>
        )}

      {!isLoading &&
        !errorMessage &&
        filteredTransactions.length > 0 &&
        viewMode === 'table' && (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="pl-5">Nama Teman</TableHead>
                <TableHead>Bank/Layanan</TableHead>
                <TableHead className="text-right">Nominal Hutang</TableHead>
                <TableHead>Tanggal Jatuh Tempo</TableHead>
                <TableHead className="text-right">Sisa Hutang</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-5 text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((trx) => (
                <TableRow key={trx.id}>
                  <TableCell className="pl-5 font-medium text-foreground">
                    {trx.friendName}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Building2
                        className="h-3.5 w-3.5 shrink-0"
                        aria-hidden="true"
                      />
                      <span>{trx.bank}</span>
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-medium text-foreground tabular-nums whitespace-nowrap">
                    {formatRupiah(trx.principalAmount)}
                  </TableCell>
                  <TableCell className="text-muted-foreground tabular-nums whitespace-nowrap">
                    {formatDateId(trx.dueDate)}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-foreground tabular-nums whitespace-nowrap">
                    {formatRupiah(trx.remainingAmount)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={trx.status} />
                  </TableCell>
                  <TableCell className="pr-5 text-right">
                    <div className="inline-flex items-center justify-end gap-2">
                      {trx.remainingAmount > 0 && (
                        <Button
                          variant="soft"
                          size="sm"
                          onClick={() => onRecordPayment(trx)}
                        >
                          <ReceiptText
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          />
                          <span>Bayar</span>
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewDetail(trx)}
                        aria-label={`Lihat detail hutang ${trx.friendName}`}
                      >
                        <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Detail</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
    </Card>
  );
}
